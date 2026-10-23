import * as THREE from 'three';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js';
import { reportR2Progress } from './r2-progress.js';

// ══════════════════════════════════════════════════════════════════════════════
//  THREE.JS HELPERS — small factories + graph utilities for the migrated game.
//  Factories auto-attach to the default scene (set by scene.js at boot) so
//  call sites stay one-liners; re-parenting via `parent.add(child)` detaches
//  from the scene automatically, matching the old engine's behaviour.
// ══════════════════════════════════════════════════════════════════════════════

let _defaultScene = null;

export function setDefaultScene(sceneInstance) {
  _defaultScene = sceneInstance;
}

function _place(object, name) {
  if (name !== undefined && name !== null) {
    object.name = name;
  }
  if (object.parent === null && _defaultScene && object !== _defaultScene) {
    _defaultScene.add(object);
  }
  return object;
}

// ── Object / mesh factories ─────────────────────────────────────────────────

export function mkGroup(name) {
  return _place(new THREE.Group(), name);
}

export function mkBox(name, width, height, depth) {
  return _place(new THREE.Mesh(new THREE.BoxGeometry(width, height, depth)), name);
}

export function mkSphere(name, diameter, segments = 12) {
  const seg = Math.max(3, Math.round(segments));
  return _place(new THREE.Mesh(new THREE.SphereGeometry(diameter / 2, seg, Math.max(2, seg - 1))), name);
}

export function mkCylinder(name, diameterTop, diameterBottom, height, tessellation = 12) {
  const seg = Math.max(3, Math.round(tessellation));
  return _place(
    new THREE.Mesh(new THREE.CylinderGeometry(diameterTop / 2, diameterBottom / 2, height, seg)),
    name,
  );
}

export function mkTorus(name, diameter, thickness, tessellation = 24) {
  // Babylon's torus lies flat in XZ; three.js TorusGeometry stands in XY, so
  // bake a -90° X rotation into the geometry to preserve the flat ground-ring look.
  const geo = new THREE.TorusGeometry(diameter / 2, thickness / 2, 10, Math.max(3, Math.round(tessellation)));
  geo.rotateX(Math.PI / 2);
  return _place(new THREE.Mesh(geo), name);
}

// Expanding-ring ping frame: linear growth from 0.5 to maxScale, with the
// fade concentrated near the end (opacity 1 - t^2).
export function spPingFrame(time, duration, maxScale) {
  const t = Math.min(1, Math.max(0, time / duration));
  return { scale: 0.5 + (maxScale - 0.5) * t, opacity: 1 - t * t };
}

export function mkDisc(name, radius, tessellation = 16, doubleSided = false) {
  const mesh = _place(
    new THREE.Mesh(new THREE.CircleGeometry(radius, Math.max(3, Math.round(tessellation)))),
    name,
  );
  if (doubleSided) {
    mesh.material.side = THREE.DoubleSide;
  }
  return mesh;
}

export function mkPlane(name, width, height, doubleSided = false) {
  const mesh = _place(new THREE.Mesh(new THREE.PlaneGeometry(width, height)), name);
  if (doubleSided) {
    mesh.material.side = THREE.DoubleSide;
  }
  return mesh;
}

const _polyBuilders = [
  (r) => new THREE.TetrahedronGeometry(r),
  (r) => new THREE.OctahedronGeometry(r),
  (r) => new THREE.DodecahedronGeometry(r),
  (r) => new THREE.IcosahedronGeometry(r),
];

export function mkPoly(name, type, size) {
  const build = _polyBuilders[type] || _polyBuilders[3];
  return _place(new THREE.Mesh(build(size)), name);
}

// Mesh sharing one of the caller's geometries (marked userData.shared so
// disposeObj keeps it). For high-rate throwaways — bullets, particles —
// where per-shot BufferGeometry churn costs more than it buys.
export function mkSharedMesh(geometry, name) {
  return _place(new THREE.Mesh(geometry), name);
}

export function mkTube(name, path, radius, tessellation = 8, capped = true) {
  // TubeGeometry needs a Curve, not a point array; the game's paths are dense
  // closed loops (rounded-square capture rings), which CatmullRom follows
  // exactly enough that the tube matches the old look.
  const closed = path.length > 1 && path[0].equals(path[path.length - 1]);
  const curve = new THREE.CatmullRomCurve3(closed ? path.slice(0, -1) : path, closed);
  const tubularSegments = Math.max(8, path.length * 4);
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, Math.max(3, Math.round(tessellation)), !capped);
  return _place(new THREE.Mesh(geo), name);
}

export function mkGround(name, width, height, subdivisions = 1) {
  const geo = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
  geo.rotateX(-Math.PI / 2);
  return _place(new THREE.Mesh(geo), name);
}

export function mkEmptyMesh(name) {
  return _place(new THREE.Mesh(new THREE.BufferGeometry()), name);
}

// ── Line factories ──────────────────────────────────────────────────────────

export function mkLines(name, points, color = null, opacity = 1) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: color ? color.clone() : new THREE.Color(1, 1, 1),
    transparent: opacity < 1,
    opacity,
  });
  return _place(new THREE.Line(geo, mat), name);
}

export function mkLineSystem(name, lines, colors = null, opacity = 1) {
  // Each entry of `lines` is a polyline strip; expand into segments so both
  // 2-point pairs (grid, rally dashes) and longer strips render identically.
  const positions = [];
  const colorValues = [];
  const hasColors = Array.isArray(colors);
  lines.forEach((strip, stripIndex) => {
    const stripColors = hasColors ? colors[stripIndex] : null;
    for (let i = 0; i + 1 < strip.length; i++) {
      positions.push(strip[i].x, strip[i].y, strip[i].z, strip[i + 1].x, strip[i + 1].y, strip[i + 1].z);
      const c0 = (stripColors && stripColors[i]) || stripColors?.[0] || new THREE.Color(1, 1, 1);
      const c1 = (stripColors && stripColors[i + 1]) || stripColors?.[0] || new THREE.Color(1, 1, 1);
      colorValues.push(c0.r, c0.g, c0.b, c1.r, c1.g, c1.b);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colorValues, 3));
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: opacity < 1, opacity, depthWrite: opacity >= 1,
  });
  return _place(new THREE.LineSegments(geo, mat), name);
}

// Shared invisible material for pick hitboxes: the mesh stays `visible` so the
// raycaster hits it, but it writes neither color nor depth.
let _ghostHitboxMaterial = null;
export function ghostHitboxMaterial() {
  if (!_ghostHitboxMaterial) {
    _ghostHitboxMaterial = new THREE.MeshBasicMaterial();
    _ghostHitboxMaterial.colorWrite = false;
    _ghostHitboxMaterial.depthWrite = false;
  }
  return _ghostHitboxMaterial;
}

// ── Graph utilities ─────────────────────────────────────────────────────────

export function childMeshes(root) {
  const out = [];
  if (!root) {
    return out;
  }
  root.traverse((child) => {
    if (child !== root && child.isMesh) {
      out.push(child);
    }
  });
  return out;
}

export function descendants(node) {
  const out = [];
  if (!node) {
    return out;
  }
  node.traverse((child) => {
    if (child !== node) {
      out.push(child);
    }
  });
  return out;
}

// Ground-click predicate for raycastGround: the default plane, or an SGB map
// tile (SGB_Tile_<n>) when a map hides the plane. Units, decals and helpers
// never match, so clicks fall through them to the surface behind.
export function isGroundMesh(mesh, ground = null) {
  if (!mesh) {
    return false;
  }
  if (ground && mesh === ground) {
    return true;
  }
  return typeof mesh.name === 'string' && mesh.name.startsWith('SGB_Tile');
}

// Matches a hiddenNodes entry against a runtime Object3D name.
// Three.js GLTFLoader dedupes repeated node names with a numeric suffix
// (bone "guard_banner_rod" + mesh "guard_banner_rod_1"), so the exact name
// and the exact name plus _<digits> both match. The _inst_ form is a leftover
// from the Babylon.js cloner suffix.
export function matchHiddenNodeName(childName, wantedName) {
  const child = String(childName || '').toLowerCase();
  const wanted = String(wantedName || '').toLowerCase();
  if (!wanted) {
    return false;
  }
  if (child === wanted) {
    return true;
  }
  if (child.startsWith(wanted + '_inst_')) {
    return true;
  }
  if (child.startsWith(wanted + '_')) {
    const suffix = child.slice(wanted.length + 1);
    if (suffix.length > 0 && /^[0-9]+$/.test(suffix)) {
      return true;
    }
  }
  return false;
}

// Collect descendants of `root` whose names match any of `wantedNames` using
// the same dedupe-aware matching as hiddenNodes (see matchHiddenNodeName).
export function findNodesByName(root, wantedNames) {
  const found = [];
  if (!root || typeof root.traverse !== 'function') {
    return found;
  }
  const wanted = Array.isArray(wantedNames) ? wantedNames : [wantedNames];
  root.traverse((child) => {
    if (child !== root && wanted.some((w) => matchHiddenNodeName(child.name, w))) {
      found.push(child);
    }
  });
  return found;
}

export function disposeObj(obj, deep = false) {
  if (!obj || obj.userData?.disposed) {
    return;
  }
  if (obj.parent) {
    obj.parent.remove(obj);
  }
  const disposeMaterial = (material) => {
    if (!material) {
      return;
    }
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((mat) => {
      Object.values(mat).forEach((value) => {
        if (value && value.isTexture) {
          value.dispose();
        }
      });
      mat.dispose();
    });
  };
  if (obj.traverse) {
    obj.traverse((child) => {
      if (child.geometry && !child.geometry.userData.shared) {
        child.geometry.dispose();
      }
      // NOTE: materials are shared/cached in several places (mat-cache), so
      // only dispose them on an explicit deep dispose — same as Babylon's
      // mesh.dispose() default, which leaves materials alone.
      if (deep) {
        disposeMaterial(child.material);
      }
    });
  } else if (obj.geometry && !obj.geometry.userData.shared) {
    obj.geometry.dispose();
  }
  if (obj.userData) {
    obj.userData.disposed = true;
  }
}

// ── Texture loading (stmt images + legacy TGA/DDS) ──────────────────────────

const _textureLoader = new THREE.TextureLoader();
const _tgaLoader = new TGALoader();
const _ddsLoader = new DDSLoader();

export function loadTexture(url, { onLoad = null, onError = null, onProgress = null } = {}) {
  const done = (texture) => {
    if (onLoad) {
      onLoad(texture);
    }
  };
  const fail = (error) => {
    reportR2Progress(url, { done: true, failed: true });
    if (onError) {
      onError(error);
    } else {
      console.warn('[texture] failed to load', url, error);
    }
  };
  const lower = String(url || '').split('?')[0].toLowerCase();
  if (lower.endsWith('.tga') || lower.endsWith('.dds')) {
    // TGALoader/DDSLoader parse raw bytes; fill a placeholder texture async.
    const texture = new THREE.Texture();
    texture.colorSpace = THREE.SRGBColorSpace;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        // Whole-file completion (bytes known only at the end here).
        reportR2Progress(url, {
          loaded: buffer.byteLength,
          total: buffer.byteLength,
          done: true,
        });
        const parsed = lower.endsWith('.tga') ? _tgaLoader.parse(buffer) : _ddsLoader.parse(buffer, true);
        texture.image = parsed.image;
        texture.mipmaps = parsed.mipmaps || [];
        texture.needsUpdate = true;
        done(texture);
      })
      .catch(fail);
    return texture;
  }
  // Match the .tga/.dds path above: color rasters are sRGB; without the
  // mark three r152+ treats them as linear and washes them out (~2.2x).
  const texture = _textureLoader.load(url, done, onProgress || undefined, fail);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ── GPU quality tier ────────────────────────────────────────────────
// Weak integrated GPUs (2013-era Intel Iris/HD, old laptops) are fill-rate
// bound at retina resolution: dpr≤2 + MSAA + PCF shadows + PBR. Such GPUs
// get the low tier: pixelRatio 1, no MSAA, no shadow maps.
// Pure functions (node-testable); DOM sniffing lives in scene.js.

export function classifyGPU(rendererName) {
  const name = String(rendererName || '');
  // Intel iGPUs (Iris/HD/UHD) — but not discrete Intel Arc.
  if (/intel/i.test(name) && !/arc/i.test(name)) return 'low';
  return 'high';
}

// ── Dynamic resolution ──────────────────────────────────────────────
// Self-tuning DPR ladder driven by the live FPS meter: step down when slow
// for ~1s, step back up after ~5s of headroom. Pure logic (node-testable);
// the frame loop applies returned ratios via setPixelRatio + setSize.
export const DPR_LADDER = [2, 1.5, 1.25, 1];
const DPR_LOW_FPS = 30;
const DPR_HIGH_FPS = 55;
const DPR_DOWN_FRAMES = 60;
const DPR_UP_FRAMES = 300;

export function createDynamicResolution(cap) {
  let idx = DPR_LADDER.findIndex((r) => r <= cap);
  if (idx < 0) {
    idx = DPR_LADDER.length - 1;
  }
  let lowStreak = 0;
  let highStreak = 0;
  return {
    ratio() {
      return DPR_LADDER[idx];
    },
    tick(fps) {
      if (DPR_LADDER[idx] <= 1) {
        return null;
      }
      if (fps < DPR_LOW_FPS) {
        lowStreak += 1;
        highStreak = 0;
        if (lowStreak >= DPR_DOWN_FRAMES && idx < DPR_LADDER.length - 1) {
          idx += 1;
          lowStreak = 0;
          return DPR_LADDER[idx];
        }
        return null;
      }
      if (fps > DPR_HIGH_FPS && idx > 0 && DPR_LADDER[idx - 1] <= cap) {
        highStreak += 1;
        lowStreak = 0;
        if (highStreak >= DPR_UP_FRAMES) {
          idx -= 1;
          highStreak = 0;
          return DPR_LADDER[idx];
        }
        return null;
      }
      lowStreak = 0;
      highStreak = 0;
      return null;
    },
  };
}

export function pixelRatioForTier(tier, devicePixelRatio) {
  const dpr = Number(devicePixelRatio) || 1;
  if (tier === 'low') return 1;
  if (tier === 'medium') return Math.min(dpr, 1.5);
  return Math.min(dpr, 2);
}

export const QUALITY_LOW = 'low';
export const QUALITY_MEDIUM = 'medium';
export const QUALITY_HIGH = 'high';
export const QUALITY_STORAGE_KEY = 'grimcraft-quality';

export function isQualityLevel(value) {
  const v = String(value || '').toLowerCase();
  return v === QUALITY_LOW || v === QUALITY_MEDIUM || v === QUALITY_HIGH;
}

// Pure resolution (node-testable): explicit query param wins, then the stored
// button choice, then auto-detection from the GPU name (auto only ever
// resolves to low or high — medium is a manual choice).
export function resolveQualityTier({ query = '', stored = '', gpu = '' } = {}) {
  const q = String(query || '').toLowerCase();
  if (isQualityLevel(q)) return q;
  const s = String(stored || '').toLowerCase();
  if (isQualityLevel(s)) return s;
  return classifyGPU(gpu);
}

export function nextQualityTier(current) {
  const order = [QUALITY_LOW, QUALITY_MEDIUM, QUALITY_HIGH];
  const idx = order.indexOf(String(current || '').toLowerCase());
  return order[(idx + 1) % order.length];
}

export function qualityShadowsEnabled(tier) {
  return String(tier) !== QUALITY_LOW;
}

export function qualityAntialiasEnabled(tier) {
  return String(tier) !== QUALITY_LOW;
}
