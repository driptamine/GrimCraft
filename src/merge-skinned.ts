import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { childMeshes, descendants, matchHiddenNodeName } from './three-helpers.js';
import { extractGroupGeometry, meshCallCount } from './merge-static.js';

// Merge skinned infantry geometry per material to cut draw calls.
//
// Same idea as merge-static, but SkinnedMesh parts merge in bind space
// (no transform baking) and rebind to the shared skeleton, so walk/attack
// clips keep working. Applied at load to worker/soldier/unit containers.
//
// A pool only merges parts that share material + skeleton + world matrix +
// bind matrix; anything else stays separate. Excluded (left untouched):
//  - hiddenNodes subtrees (static per-container hiding);
//  - SOLDIER_SWITCHED_NODES subtrees: runtime weapon swaps, planter
//    banner show/hide, meshes found by name for glow anchors;
//  - animated-node subtrees (node names from clip track names);
//  - InstancedMesh, morph geometry, skeleton-less skinned meshes;
//  - pools whose geometries fail to merge (attribute mismatch).

// three-helpers.js is still untyped, so meshes arrive as `any` there.
// AnyMesh keeps the checked three.js surface (position, material,
// geometry) while allowing the duck-typed flags (isSkinnedMesh, ...).
type AnyMesh = THREE.Mesh & Record<string, any>;

interface GltfContainerLike {
  scene?: THREE.Object3D | null;
  animations?: THREE.AnimationClip[] | null;
}

export interface SkinnedMergeStats {
  before: number;
  after: number;
  merged: number;
  excludedHidden: number;
  excludedSwitched: number;
  excludedAnimated: number;
  skipped: number;
  failed: number;
}

interface SkinnedPool {
  geos: THREE.BufferGeometry[];
  meshes: AnyMesh[];
  material: THREE.Material;
  skinned: boolean;
}

export const SOLDIER_SWITCHED_NODES = [
  'guard_banner', 'guard_banner_rod',
  'guardsmen_lasgun', 'guardsmen_plasma_pistol',
  'guardsmen_grenade_launcher', 'guardsmen_flamer',
  'karskin_plasmagun',
];

function _animatedNodeNames(animations: THREE.AnimationClip[] | null | undefined): Set<string> {
  const names = new Set<string>();
  for (const clip of animations || []) {
    for (const track of clip.tracks || []) {
      if (!track || typeof track.name !== 'string') continue;
      try {
        const parsed = THREE.PropertyBinding.parseTrackName(track.name);
        if (parsed && parsed.nodeName) names.add(parsed.nodeName);
      } catch (_) {
        // Unparseable track: ignore, the clip still plays.
      }
    }
  }
  return names;
}

function _hasMorph(mesh: THREE.Mesh): boolean {
  if (mesh.morphTargetInfluences !== undefined) return true;
  const morph = mesh.geometry && mesh.geometry.morphAttributes;
  return !!(morph && morph.position && morph.position.length);
}

const _mat4key = (m: THREE.Matrix4 | null | undefined): string => (m ? m.elements.join(',') : '');

export function mergeSkinnedContainer(container: GltfContainerLike | null, hiddenNames: string[] = []): SkinnedMergeStats {
  const stats: SkinnedMergeStats = {
    before: 0, after: 0, merged: 0,
    excludedHidden: 0, excludedSwitched: 0, excludedAnimated: 0,
    skipped: 0, failed: 0,
  };
  const scene = container ? container.scene : null;
  if (!container || !scene) {
    return stats;
  }
  const animatedNames = _animatedNodeNames(container.animations);
  const hiddenRoots = new Set<THREE.Object3D>();
  const switchedRoots = new Set<THREE.Object3D>();
  const animatedRoots = new Set<THREE.Object3D>();
  for (const node of descendants(scene)) {
    const name = node.name || '';
    if ((hiddenNames || []).some((wanted) => matchHiddenNodeName(name, wanted))) {
      hiddenRoots.add(node);
    }
    if (SOLDIER_SWITCHED_NODES.some((wanted) => matchHiddenNodeName(name, wanted))) {
      switchedRoots.add(node);
    }
    if (animatedNames.has(name)) {
      animatedRoots.add(node);
    }
  }
  const underAny = (node: THREE.Object3D, roots: Set<THREE.Object3D>): boolean => {
    let current: THREE.Object3D | null = node;
    while (current) {
      if (roots.has(current)) return true;
      current = current.parent;
    }
    return false;
  };

  scene.updateMatrixWorld(true);
  const meshes: AnyMesh[] = childMeshes(scene);
  // Pool key: material + (skinned ? skeleton + world + bind : 'rigid').
  // Nested maps avoid inventing composite string keys for objects.
  const pools = new Map<THREE.Material, Map<string, SkinnedPool>>();
  const poolFor = (material: THREE.Material, mesh: AnyMesh): SkinnedPool => {
    let byMat = pools.get(material);
    if (!byMat) {
      byMat = new Map();
      pools.set(material, byMat);
    }
    const sub = mesh.isSkinnedMesh
      ? `skinned:${poolsSkinnedKey(mesh)}`
      : 'rigid';
    let pool = byMat.get(sub);
    if (!pool) {
      pool = { geos: [], meshes: [], material, skinned: mesh.isSkinnedMesh };
      byMat.set(sub, pool);
    }
    return pool;
  };
  // Skeleton identity via object key path: keep a side registry so two
  // different Skeleton instances never share a pool even if their
  // matrices print identically.
  const skeletonIds = new Map<unknown, number>();
  const poolsSkinnedKey = (mesh: AnyMesh): string => {
    if (!skeletonIds.has(mesh.skeleton)) {
      skeletonIds.set(mesh.skeleton, skeletonIds.size);
    }
    return `${skeletonIds.get(mesh.skeleton)}|${_mat4key(mesh.matrixWorld)}|${_mat4key(mesh.bindMatrix)}`;
  };

  let leftovers = 0;
  for (const mesh of meshes) {
    if (underAny(mesh, hiddenRoots)) {
      stats.excludedHidden += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    if (underAny(mesh, switchedRoots)) {
      stats.excludedSwitched += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    if (underAny(mesh, animatedRoots)) {
      stats.excludedAnimated += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    const geo = mesh.geometry;
    if (!mesh.material || mesh.isInstancedMesh
      || !geo || !geo.getAttribute || _hasMorph(mesh)
      || (mesh.isSkinnedMesh && !mesh.skeleton)) {
      stats.skipped += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    if (Array.isArray(mesh.material)) {
      const materials = mesh.material as THREE.Material[];
      const groups: Array<{ start: number; count: number; materialIndex?: number }> = (geo.groups && geo.groups.length) ? geo.groups : [{ start: 0, count: Infinity, materialIndex: 0 }];
      let splittable = true;
      const parts: Array<{ geo: THREE.BufferGeometry; material: THREE.Material }> = [];
      for (const group of groups) {
        const material = materials[group.materialIndex ?? 0] || materials[0];
        if (!material) {
          splittable = false;
          break;
        }
        const count = Number.isFinite(group.count) ? group.count : (geo.index ? geo.index.count : geo.getAttribute('position').count);
        parts.push({ geo: extractGroupGeometry(geo, { start: group.start || 0, count }), material });
      }
      if (!splittable || !parts.length) {
        stats.skipped += 1;
        leftovers += meshCallCount(mesh);
        continue;
      }
      for (const part of parts) {
        // Split parts join pools keyed by the source mesh's bind state.
        const pool = poolFor(part.material, mesh);
        pool.geos.push(part.geo);
        pool.meshes.push(mesh);
      }
      continue;
    }
    const pool = poolFor(mesh.material, mesh);
    const clone = geo.clone();
    if (!mesh.isSkinnedMesh) {
      // Rigid parts bake the world transform (container root identity).
      clone.applyMatrix4(mesh.matrixWorld);
    }
    pool.geos.push(clone);
    pool.meshes.push(mesh);
  }
  stats.before = meshes.reduce((sum, mesh) => sum + meshCallCount(mesh), 0);

  let mergedIndex = 0;
  for (const byMat of pools.values()) {
    for (const pool of byMat.values()) {
      // Originals are only removed after a successful merge, so every
      // failure path keeps the scene pixel-identical by construction.
      const sources = [...new Set(pool.meshes)];
      const soleKept = pool.geos.length === 1 && sources.length === 1
        && !Array.isArray(sources[0].material);
      if (soleKept) {
        leftovers += 1;
        continue;
      }
      let geos = pool.geos;
      const needSkin = pool.skinned;
      const valid = geos.every((g) => g.getAttribute('position') && g.getAttribute('normal')
        && (!needSkin || (g.getAttribute('skinIndex') && g.getAttribute('skinWeight'))));
      if (valid && geos.some((g) => !g.index)) {
        geos = geos.map((g) => (g.index ? g.toNonIndexed() : g));
      }
      let merged: THREE.BufferGeometry | null = null;
      if (valid) {
        try {
          merged = mergeGeometries(geos, false);
        } catch (_) {
          merged = null;
        }
      }
      if (!merged) {
        stats.failed += 1;
        leftovers += sources.reduce((sum, mesh) => sum + meshCallCount(mesh), 0);
        continue;
      }
      for (const mesh of sources) {
        if (mesh.parent) mesh.parent.remove(mesh);
      }
      const first = sources[0];
      let out: THREE.Mesh;
      if (pool.skinned) {
        const skinned = new THREE.SkinnedMesh(merged, pool.material);
        skinned.bind(first.skeleton, first.bindMatrix);
        skinned.position.copy(first.position);
        skinned.quaternion.copy(first.quaternion);
        skinned.scale.copy(first.scale);
        (first.parent || scene).add(skinned);
        out = skinned;
      } else {
        out = new THREE.Mesh(merged, pool.material);
        scene.add(out);
      }
      out.name = `merged_sk_${mergedIndex}_${pool.material.name || 'mat'}`;
      out.castShadow = !!first.castShadow;
      out.receiveShadow = !!first.receiveShadow;
      merged.computeBoundingSphere();
      mergedIndex += 1;
      stats.merged += 1;
      leftovers += 1;
    }
  }
  stats.after = leftovers;
  return stats;
}
