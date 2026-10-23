import * as THREE from 'three';
import { useProceduralModels } from '../model-source.js';
import { _instantiateFromContainer } from '../model-upload.js';
import { PLAYER, scene } from '../scene.js';
import {
  findNodesByName,
  mkBox,
  mkCylinder,
  mkGroup,
  mkSphere,
} from '../three-helpers.js';
import { _factionBucket } from './common.js';


export const SP_MODEL_PATHS = {
  point: 'models/points/strategic_point.glb',
  relic: 'models/points/relic.glb',
  objective: 'models/points/strategic_objective.glb',
};

export const SP_MODEL_SCALES = { point: 1.0, relic: 0.8, objective: 1.0 };

// Faction banners/flags/poles inside the point model stay hidden: the point
// is neutral until captured (capture ring + gem show the owner instead).
// ground_plane (the DoW blob-shadow quad over the hatch) stays VISIBLE: its
// black look is wanted. It shares BLEND material 0 with base/doora/doorb, so
// patchStrategicPointGroundPlane gives it a depthWrite-off clone + renderOrder
// -1 instead: the quad draws first and blends under the doors.
export const STRATEGIC_POINT_HIDDEN_NODES = [
  'chaos_banner',
  'chaos_banner_rod',
  'dark_eldar_banner',
  'dark_eldar_flag_pole',
  'eldar_flag',
  'eldar_flag_pole',
  'guard_banner',
  'guard_banner_rod',
  'marine_sergeant_banner',
  'marine_sergeant_banner_rod',
  'necron_flag_east',
  'necron_flag_north',
  'necron_flag_south',
  'necron_flag_west',
  'ork_flag',
  'ork_flag_pole',
  'sisters_banner',
  'sisters_flag_pole',
  'tau_banner',
  'tau_banner_rod',
];


export const STRATEGIC_POINT_GROUND_PLANE = 'ground_plane';

export const STRATEGIC_POINT_GROUND_PLANE_RENDER_ORDER = -1;


// Keeps the blob-shadow quad visible (black look untouched) while stopping it
// from blacking out doora/doorb: the quad shares its BLEND material with the
// doors, so it gets a per-instance clone with depth writes off and draws
// first (renderOrder -1), letting the doors blend over it. Returns how many
// meshes were patched. Name match mirrors _instantiateFromContainer.
export function patchStrategicPointGroundPlane(model) {
  if (!model || typeof model.traverse !== 'function') return 0;
  let patched = 0;
  model.traverse((child) => {
    if (!child.isMesh) return;
    const name = String(child.name || '').toLowerCase().split('_inst_')[0];
    if (name !== STRATEGIC_POINT_GROUND_PLANE && !name.startsWith(STRATEGIC_POINT_GROUND_PLANE)) return;
    const isArray = Array.isArray(child.material);
    const mats = isArray ? child.material : [child.material];
    const clones = mats.map((mat) => {
      if (!mat || typeof mat.clone !== 'function') return mat;
      const clone = mat.clone();
      clone.depthWrite = false;
      return clone;
    });
    child.material = isArray ? clones : clones[0];
    child.renderOrder = STRATEGIC_POINT_GROUND_PLANE_RENDER_ORDER;
    child.visible = true;
    patched += 1;
  });
  return patched;
}


export const STRATEGIC_POINT_CENTERPOST = 'stratetgic_point_centerpost';


// The raised centerpost renders ghostly: it shares the BLEND-flagged material
// 0 with the rest of the point (conversion artifact — the post is solid
// metal). Give it a per-instance opaque clone so it draws in the opaque pass
// with depth writes and no sorting artifacts. RGB is untouched (verified
// against the texture), only the blend flag changes. Returns patched count.
export function patchStrategicPointCenterpost(model) {
  if (!model || typeof model.traverse !== 'function') return 0;
  let patched = 0;
  model.traverse((child) => {
    if (!child.isMesh) return;
    const name = String(child.name || '').toLowerCase().split('_inst_')[0];
    if (name !== STRATEGIC_POINT_CENTERPOST && !name.startsWith(STRATEGIC_POINT_CENTERPOST)) return;
    const isArray = Array.isArray(child.material);
    const mats = isArray ? child.material : [child.material];
    const clones = mats.map((mat) => {
      if (!mat || typeof mat.clone !== 'function') return mat;
      const clone = mat.clone();
      clone.transparent = false;
      clone.opacity = 1;
      clone.depthWrite = true;
      clone.depthTest = true;
      return clone;
    });
    child.material = isArray ? clones : clones[0];
    patched += 1;
  });
  return patched;
}


// Listening Posts build only on player-owned points/relics without one.
export function canPlaceListeningPost(sp, team) {
  return !!sp && sp.owner === team && !sp.hasListeningPost;
}


// Capture flag: per-faction banner nodes shown for the capturing/owning
// faction. The rise itself is clip-driven — captured_raise lifts the
// centerpost/console/banner assembly (the banner meshes are skinned, so
// node offsets would not move them); this only gates visibility.
export const STRATEGIC_POINT_BANNERS = {
  ig: ['guard_banner', 'guard_banner_rod'],
  chaos: ['chaos_banner', 'chaos_banner_rod'],
  'space marines': ['marine_sergeant_banner', 'marine_sergeant_banner_rod'],
  orks: ['ork_flag', 'ork_flag_pole'],
  eldar: ['eldar_flag', 'eldar_flag_pole'],
  tau: ['tau_banner', 'tau_banner_rod'],
  sob: ['sisters_banner', 'sisters_flag_pole'],
  necrons: ['necron_flag_north', 'necron_flag_south', 'necron_flag_east', 'necron_flag_west'],
  'dark eldar': ['dark_eldar_banner', 'dark_eldar_flag_pole'],
};

// The planter seats his banner+rod into the centerpost socket the moment
// flag_plant_2 ends (planted): the point's own banner pair pops in on the
// same tick his carried pair pops out. Progress can tick while he is still
// walking/planting, so the unowned clauses wait for planted too; owned
// points keep the old behavior.
export function shouldShowCaptureFlag({ engaged, owner, progress, planted }) {
  if (owner != null) {
    return true;
  }
  return !!planted && (engaged || Math.abs(progress || 0) > 0.001);
}


export function _wirePointFlagNodes(model) {
  const banners = {};
  for (const [faction, names] of Object.entries(STRATEGIC_POINT_BANNERS)) {
    banners[faction] = [];
    for (const name of names) {
      for (const node of findNodesByName(model, [name])) {
        if (node.isMesh) {
          banners[faction].push(node);
        }
      }
    }
  }
  model._flagNodes = { banners };
}


export function updatePointFlag(model, { faction, show }) {
  const wired = model ? model._flagNodes : null;
  if (!wired) {
    return;
  }
  for (const [key, nodes] of Object.entries(wired.banners)) {
    const visible = show && key === faction;
    for (const node of nodes) {
      node.visible = !!visible;
    }
  }
}


// Capture-state clips per point kind: neutral points loop `idle` (assembly
// buried); on capture start `open` plays once, then the native `raise` clip
// lifts the centerpost/console/banner assembly, then `captured` loops raised.
export const STRATEGIC_POINT_CLIPS = {
  point: { idle: 'uncaptured_idle', open: 'uncaptured_open', raise: 'captured_raise', captured: 'captured_idle' },
  relic: { idle: 'ol_uncaptured_idle', open: 'ol_uncaptured_open', raise: 'ol_captured_raise', captured: 'ol_captured_idle' },
};


// Pre-plant hold: once uncaptured_open finishes, the post waits scrubbed at
// 20% of captured_raise (socket at ~1.25, just past the 1.11 rod-butt height
// at flag_plant_1 end) with no banner until the planter seats it. Post-plant
// progress maps onto the remaining [0.2, 1] so the handoff never pops down.
export const POINT_PRE_PLANT_RISE = 0.2;


// Capture progress (-1..1, either side) mapped onto the raise clip from the
// pre-plant hold to full capture, remapped so the rise spans from the plant
// mark to 100%.
export function raiseScrubProgress(progress, raiseFrom = 0) {
  const m = Math.min(1, Math.abs(progress || 0));
  const from = Math.min(0.999, Math.max(0, raiseFrom || 0));
  const raw = Math.min(1, Math.max(0, (m - from) / (1 - from)));
  return POINT_PRE_PLANT_RISE + (1 - POINT_PRE_PLANT_RISE) * raw;
}


// Capture-state machine for the point model. Returns { play, loop, state,
// scrub }: 'idle' loops the idle clip, 'opening' plays the open clip once
// then holds the 20% pre-rise while the planter works, 'raising' scrubs the
// raise clip by capture progress (plant mark to 100%), 'raised' loops the
// captured clip. Owned points go straight to the raised loop; a contested
// raised point re-enters 'raising'.
export function nextStrategicPointAnim({ owner, beingCaptured, animState, currentAnim, progress, planted, raiseFrom }) {
  if (owner != null && animState !== 'raised') {
    return { play: 'captured', loop: true, state: 'raised', scrub: null };
  }
  if (owner != null) {
    return { play: null, loop: false, state: 'raised', scrub: null };
  }
  if (beingCaptured && (animState == null || animState === 'idle')) {
    return { play: 'open', loop: false, state: 'opening', scrub: null };
  }
  if (beingCaptured && !planted && animState === 'opening' && currentAnim == null) {
    return { play: 'raise', loop: false, state: 'opening', scrub: POINT_PRE_PLANT_RISE };
  }
  if (beingCaptured && planted && animState === 'opening' && (currentAnim == null || currentAnim === 'raise')) {
    return { play: 'raise', loop: false, state: 'raising', scrub: raiseScrubProgress(progress, raiseFrom) };
  }
  if (beingCaptured && planted && (animState === 'raising' || animState === 'raised')) {
    return { play: 'raise', loop: false, state: 'raising', scrub: raiseScrubProgress(progress, raiseFrom) };
  }
  if (!beingCaptured && animState !== 'idle') {
    return { play: 'idle', loop: true, state: 'idle', scrub: null };
  }
  return { play: null, loop: false, state: animState ?? null, scrub: null };
}


// Wire the capture-state clips onto an instantiated point model. Slots are
// 'idle'/'captured' (looped), 'open' (one-shot), and 'raise' (scrubbed by
// capture progress); one-shot end clears _currentAnim.
export function _wirePointAnims(model, kind) {
  const clips = STRATEGIC_POINT_CLIPS[kind] || STRATEGIC_POINT_CLIPS.point;
  const groups = model._animationGroups || [];
  const find = (wanted) => groups.find((g) => String(g.name || '').toLowerCase() === wanted) || null;
  model._animGroups = {};
  const idle = find(clips.idle);
  const open = find(clips.open);
  const raise = find(clips.raise);
  const captured = find(clips.captured);
  if (idle) model._animGroups.idle = idle;
  if (open) model._animGroups.open = open;
  if (raise) model._animGroups.raise = raise;
  if (captured) model._animGroups.captured = captured;
  model._currentAnim = null;
  model._scrubAnim = function (name, progress) {
    const ag = model._animGroups[name];
    if (!ag || typeof ag.scrub !== 'function') {
      return;
    }
    if (model._currentAnim !== name) {
      Object.values(model._animGroups).forEach((other) => {
        try { other.stop(); } catch (e) { /* ignore */ }
      });
      model._currentAnim = name;
    }
    try {
      ag.scrub(progress);
    } catch (e) {
      console.warn('_scrubAnim error', name, e);
    }
  };
  model._playAnim = function (name, loop) {
    if (loop === undefined) loop = true;
    if (model._currentAnim === name) {
      return;
    }
    const ag = model._animGroups[name];
    if (!ag) {
      return;
    }
    Object.values(model._animGroups).forEach((other) => {
      try { other.stop(); } catch (e) { /* ignore */ }
    });
    model._currentAnim = name;
    try {
      ag.loopAnimation = !!loop;
      ag.onAnimationGroupEndObservable.clear();
      ag.reset();
      ag.start(!!loop, 1.0);
      if (!loop) {
        ag.onAnimationGroupEndObservable.addOnce(() => {
          model._currentAnim = null;
        });
      }
    } catch (e) {
      console.warn('_playAnim error', name, e);
    }
  };
}


export const _strategicPointContainers = { point: null, relic: null, objective: null };


export async function _loadPointContainer(kind) {
  if (_strategicPointContainers[kind]) {
    return _strategicPointContainers[kind];
  }
  try {
    const [{ loadGltf }, { modelUrl }] = await Promise.all([
      import('../gltf-models.js'),
      import('../assets.js'),
    ]);
    const container = await loadGltf(modelUrl(SP_MODEL_PATHS[kind]));
    if (container) {
      container._hiddenNodes = STRATEGIC_POINT_HIDDEN_NODES;
      _strategicPointContainers[kind] = container;
    }
  } catch (err) {
    console.warn(`[points] ${kind} model failed to load, using procedural fallback`, err);
  }
  return _strategicPointContainers[kind];
}


export async function preloadStrategicPointModel() {
  return _loadPointContainer('point');
}


export async function preloadRelicModel() {
  return _loadPointContainer('relic');
}

export async function preloadObjectiveModel() {
  return _loadPointContainer('objective');
}


export function makeStrategicPointMesh(x, z, kind = 'point') {
  const position = new THREE.Vector3(x, 0, z);
  const root = mkGroup('sp');
  root.position.copy(position);
  const container = useProceduralModels() ? null : (_strategicPointContainers[kind] || null);
  const model = container ? _instantiateFromContainer(container, {}) : null;
  if (model) {
    _wirePointAnims(model, kind);
    _wirePointFlagNodes(model);
    patchStrategicPointGroundPlane(model);
    patchStrategicPointCenterpost(model);
    model.scale.setScalar(SP_MODEL_SCALES[kind] || SP_MODEL_SCALES.point);
    root.add(model);
  } else {
    const base = mkCylinder('spbase', 2.8, 2.8, 0.3, 16);
    base.position.y = 0.15;
    root.add(base);
    const baseMaterial = new THREE.MeshStandardMaterial();
    baseMaterial.color = new THREE.Color(0.2, 0.27, 0.2);
    base.material = baseMaterial;
  }

  return {
    group: root,
    model: model || null,
    gem: null,
    gemMat: null,
    capRing: null,
    capRingMat: null,
    pillar: null,
  };
}


export function buildListeningPostMesh(position, teamKey = PLAYER, metaPayload = {}) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.listening_post;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('lp');
  root.position.copy(position);
  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('lb', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.userData = { ...metaPayload };
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    box.material = boxMaterial;
    return box;
  };
  addBox(1.2, 2.5, 1.2, 0x2244aa, 0x000033, 0, 1.25, 0);
  const cap = mkCylinder('lpcap', 0, 1.6, 1, 8);
  cap.position.set(0, 3, 0);
  root.add(cap);
  cap.userData = { ...metaPayload };
  const capMaterial = new THREE.MeshStandardMaterial();
  capMaterial.color = new THREE.Color(0.07, 0.2, 0.67);
  cap.material = capMaterial;
  addBox(0.08, 0.08, 2, 0x888888, 0, 0, 4.2, 0);
  const dish = mkSphere('dish', 0.8, 4);
  dish.position.set(0.6, 3.8, 0);
  root.add(dish);
  dish.userData = { ...metaPayload };
  const dishMaterial = new THREE.MeshStandardMaterial();
  dishMaterial.color = new THREE.Color(0.6, 0.6, 0.6);
  dish.material = dishMaterial;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  return root;
}
