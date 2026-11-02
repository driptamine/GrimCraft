import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { childMeshes, descendants, matchHiddenNodeName } from './three-helpers.js';

// Merge static GLB geometry per material to cut draw calls.
//
// One merged Mesh per material replaces all mergeable meshes: same
// triangles in the same places (world transforms baked), one draw call
// each. Applied at load to structure/HQ containers only — never to
// soldiers (skinned), vehicles, or strategic points (clip-driven parts
// and runtime node lookups by name).
//
// Excluded from merging (left untouched):
//  - hiddenNodes subtrees: hiding is applied per container at instantiate,
//    so merged geometry must not swallow hideable parts;
//  - animated-node subtrees: node names taken from clip track names;
//  - SkinnedMesh, InstancedMesh, multi-material meshes, morph geometry;
//  - groups whose geometries fail to merge (attribute mismatch).

// three-helpers.js is still untyped, so meshes arrive as `any` there.
// AnyMesh keeps the checked three.js surface (position, material,
// geometry) while allowing the duck-typed flags (isSkinnedMesh, ...).
type AnyMesh = THREE.Mesh & Record<string, any>;

interface GltfContainerLike {
  scene?: THREE.Object3D | null;
  animations?: THREE.AnimationClip[] | null;
}

export interface MergeStats {
  before: number;
  after: number;
  merged: number;
  excludedHidden: number;
  excludedAnimated: number;
  skipped: number;
  failed: number;
}

interface MergePool {
  geos: THREE.BufferGeometry[];
  meshes: AnyMesh[];
}

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

// Draw calls a mesh costs: one per group with a material array,
// otherwise one (groups are ignored for single materials).
export function meshCallCount(mesh: THREE.Mesh): number {
  const geo = mesh.geometry;
  if (Array.isArray(mesh.material) && geo && (geo as THREE.BufferGeometry).groups && (geo as THREE.BufferGeometry).groups.length) {
    return (geo as THREE.BufferGeometry).groups.length;
  }
  return 1;
}

// Extract one group's triangles as a standalone non-indexed geometry.
export function extractGroupGeometry(geo: THREE.BufferGeometry, group: { start: number; count: number }): THREE.BufferGeometry {
  const src = geo.index ? geo.toNonIndexed() : geo;
  const out = new THREE.BufferGeometry();
  const { start, count } = group;
  for (const name of Object.keys(src.attributes)) {
    const attr = src.attributes[name] as THREE.BufferAttribute;
    const itemSize = attr.itemSize;
    const Ctor = attr.array.constructor as new (length: number) => { [index: number]: number };
    const sliced = new Ctor(count * itemSize);
    const input = attr.array as unknown as { [index: number]: number };
    for (let i = 0; i < count; i += 1) {
      for (let k = 0; k < itemSize; k += 1) {
        sliced[i * itemSize + k] = input[(start + i) * itemSize + k];
      }
    }
    const outAttr = new THREE.BufferAttribute(sliced as unknown as THREE.BufferAttribute['array'], itemSize);
    if (attr.normalized) outAttr.normalized = true;
    out.setAttribute(name, outAttr);
  }
  return out;
}

export function mergeStaticContainer(container: GltfContainerLike | null, hiddenNames: string[] = []): MergeStats {
  const stats: MergeStats = {
    before: 0, after: 0, merged: 0,
    excludedHidden: 0, excludedAnimated: 0, skipped: 0, failed: 0,
  };
  const scene = container ? container.scene : null;
  if (!container || !scene) {
    return stats;
  }
  const animatedNames = _animatedNodeNames(container.animations);
  const hiddenRoots = new Set<THREE.Object3D>();
  const animatedRoots = new Set<THREE.Object3D>();
  for (const node of descendants(scene)) {
    const name = node.name || '';
    if ((hiddenNames || []).some((wanted) => matchHiddenNodeName(name, wanted))) {
      hiddenRoots.add(node);
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
  const meshes = childMeshes(scene) as AnyMesh[];
  // Multi-material meshes are split per group so every primitive joins
  // its material pool; anything unmergeable keeps its original calls.
  const pools = new Map<THREE.Material, MergePool>(); // material -> { geos, meshes }
  const poolFor = (material: THREE.Material): MergePool => {
    let pool = pools.get(material);
    if (!pool) {
      pool = { geos: [], meshes: [] };
      pools.set(material, pool);
    }
    return pool;
  };
  let leftovers = 0;
  for (const mesh of meshes) {
    if (underAny(mesh, hiddenRoots)) {
      stats.excludedHidden += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    if (underAny(mesh, animatedRoots)) {
      stats.excludedAnimated += 1;
      leftovers += meshCallCount(mesh);
      continue;
    }
    const geo = mesh.geometry;
    if (!mesh.material || mesh.isSkinnedMesh || mesh.isInstancedMesh
      || !geo || !geo.getAttribute || _hasMorph(mesh)) {
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
        part.geo.applyMatrix4(mesh.matrixWorld);
        const pool = poolFor(part.material);
        pool.geos.push(part.geo);
        pool.meshes.push(mesh);
      }
      continue;
    }
    const clone = geo.clone();
    clone.applyMatrix4(mesh.matrixWorld);
    const pool = poolFor(mesh.material);
    pool.geos.push(clone);
    pool.meshes.push(mesh);
  }
  stats.before = meshes.reduce((sum, mesh) => sum + meshCallCount(mesh), 0);

  let mergedIndex = 0;
  for (const [material, pool] of pools) {
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
    const valid = geos.every((g) => g.getAttribute('position') && g.getAttribute('normal'));
    // mergeGeometries needs consistent indexing; normalize to non-indexed.
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
    const out = new THREE.Mesh(merged, material);
    out.name = `merged_${mergedIndex}_${material.name || 'mat'}`;
    out.castShadow = !!sources[0].castShadow;
    out.receiveShadow = !!sources[0].receiveShadow;
    merged.computeBoundingSphere();
    scene.add(out);
    mergedIndex += 1;
    stats.merged += 1;
    leftovers += 1;
  }
  stats.after = leftovers;
  return stats;
}
