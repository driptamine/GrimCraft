import * as THREE from 'three';
import {
  enemyFaction,
  factionContainers,
  getFactionAnimations,
  playerFaction,
  resolveFactionKey,
} from '../factions.js';
import { instantiateGltf } from '../gltf-models.js';
import { getMat } from '../mat-cache.js';
import { useProceduralModels } from '../model-source.js';
import { _assetContainer, _cloneCustomModel } from '../model-upload.js';
import { addNecronAura } from '../necron-aura.js';
import { attachGaussConduit } from '../necron-conduit.js';
import { applyPlasmaGlow } from '../plasma-glow.js';
import { addPlasmaPistolGlow } from '../plasma-pistol-glow.js';
import {
  HITBOX_SIZE,
  PLAYER,
  TEAM_COLOR,
  _allHitboxes,
  _hitboxDebug,
  scene,
} from '../scene.js';
import { IDLE_TRACKING_HOLD_SEC, animSwitchBlocked, resolveIdleAnim } from '../soldier-aim.js';
import {
  childMeshes,
  descendants,
  ghostHitboxMaterial,
  matchHiddenNodeName,
  mkBox,
  mkCylinder,
  mkDisc,
  mkGroup,
  mkPoly,
  mkSharedMesh,
  mkSphere,
  mkTorus,
} from '../three-helpers.js';


export function addTeamRing(root, isPlayerTeam) {
  const torus = mkTorus('teamRing_' + Math.random(), 1.5, 0.06, 24);
  torus.rotation.x = 0;
  torus.position.y = 0.05;
  root.add(torus);
  torus.userData.pickable = false;
  const material = new THREE.MeshBasicMaterial();
  material.color = isPlayerTeam
    ? new THREE.Color(0, 1, 0.4)
    : new THREE.Color(1, 0.15, 0.1);
  material.opacity = 0;
  material.transparent = true;
  torus.material = material;
  torus.visible = false;
  torus.visible = false;

  root._teamRing = torus;
  if (!root._selMat) root._selMat = material;
  if (!root._selDisc) root._selDisc = torus;

  return torus;
}


// ══════════════════════════════════════════════════════════════════════════════
//  MESH FACTORIES
// ══════════════════════════════════════════════════════════════════════════════
export function makeMissileMesh() {
  const root = mkGroup('missile_root');
  const body = mkCylinder('mbody', 0.1, 0.13, 1.1, 7);
  root.add(body);
  body.rotation.x = Math.PI / 2;
  body.userData.pickable = false;
  const missileMaterial = new THREE.MeshStandardMaterial();
  missileMaterial.color = new THREE.Color(0.6, 0.55, 0.4);
  missileMaterial.emissive = new THREE.Color(0.1, 0.08, 0.02);
  body.material = missileMaterial;

  // Exhaust glow
  const exhaust = mkSphere('mexh', 0.22, 4);
  exhaust.position.z = -0.7;
  root.add(exhaust);
  exhaust.userData.pickable = false;
  const exhaustMaterial = new THREE.MeshBasicMaterial();
  exhaustMaterial.color = new THREE.Color(1, 0.5, 0.1);
  exhaustMaterial.opacity = 0.9;
  exhaustMaterial.transparent = true;
  exhaust.material = exhaustMaterial;
  root._exhaustMat = exhaustMaterial;
  return root;
}


// One shared BufferGeometry per projectile type: shots differ only by
// transform and material, so per-shot geometry churn is pure waste.
const _bulletGeo = new THREE.BoxGeometry(0.04, 0.04, 0.5);
const _laserGeo = new THREE.BoxGeometry(0.02, 0.02, 8.0);
const _plasmaGeo = new THREE.IcosahedronGeometry(0.22);
const _grenadeGeo = new THREE.SphereGeometry(0.55 / 2, 8, 7);
for (const geo of [_bulletGeo, _laserGeo, _plasmaGeo, _grenadeGeo]) {
  geo.userData.shared = true;
}

export function makeBulletMesh() {
  const mesh = mkSharedMesh(_bulletGeo, 'bullet');
  const bulletMaterial = new THREE.MeshStandardMaterial();
  bulletMaterial.color = new THREE.Color(0.87, 0.67, 0);
  bulletMaterial.emissive = new THREE.Color(0.53, 0.4, 0);
  mesh.material = bulletMaterial;
  mesh.userData.pickable = false;
  return mesh;
}


export function makeLaserBulletMesh() {
  const mesh = mkSharedMesh(_laserGeo, 'laser');
  const laserMaterial = new THREE.MeshBasicMaterial();
  laserMaterial.color = new THREE.Color(1, 0, 0);
  mesh.material = laserMaterial;
  mesh.userData.pickable = false;
  return mesh;
}


export function makePlasmaBulletMesh() {
  const mesh = mkSharedMesh(_plasmaGeo, 'plasma');
  mesh.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  );
  const plasmaMaterial = new THREE.MeshStandardMaterial();
  plasmaMaterial.color = new THREE.Color(0.55, 0.85, 1.0);
  plasmaMaterial.emissive = new THREE.Color(0.4, 0.8, 1.0);
  plasmaMaterial.roughness = 0.3;
  plasmaMaterial.metalness = 0.1;
  mesh.material = plasmaMaterial;
  mesh.userData.pickable = false;
  return mesh;
}


export function makeGrenadeMesh() {
  const root = mkGroup('grenade_root');
  const mesh = mkSharedMesh(_grenadeGeo, 'grenade');
  root.add(mesh);
  const grenadeMaterial = new THREE.MeshStandardMaterial();
  grenadeMaterial.color = new THREE.Color(0.4, 0.4, 0.4);
  grenadeMaterial.roughness = 0.3;
  grenadeMaterial.metalness = 0.1;
  mesh.material = grenadeMaterial;
  mesh.userData.pickable = false;

  const core = mkSphere('gcore', 0.3, 4);
  root.add(core);
  const coreMaterial = new THREE.MeshBasicMaterial();
  coreMaterial.color = new THREE.Color(0.8, 0.2, 1);
  core.material = coreMaterial;
  core.userData.pickable = false;

  return root;
}


export function makeSoldierMesh(teamKey, metaPayload = {}) {
  const isBuilder = (teamKey === 'builder' || metaPayload.builderEntityId !== undefined);
  const actualTeam = isBuilder ? (metaPayload.team || PLAYER) : teamKey;

  // Try faction-specific model first
  const factionKey = resolveFactionKey(metaPayload.faction, actualTeam === PLAYER ? playerFaction : enemyFaction);
  let containerType = isBuilder ? 'worker' : 'soldier';
  const procedural = useProceduralModels();
  let container = procedural ? null : factionContainers[factionKey]?.[containerType];
  const unitContainer = (!procedural && !isBuilder && metaPayload.unitType) ? factionContainers[factionKey]?.units?.[metaPayload.unitType] : null;
  if (unitContainer) {
    container = unitContainer;
    containerType = 'soldier';
  }
  if (container) {
    return _makeFactionSoldierMesh(container, actualTeam, metaPayload, factionKey, containerType);
  }

  // Custom model only replaces player/builder units — enemies keep the default mesh
  if (_assetContainer && teamKey !== 'red') return _cloneCustomModel(teamKey, metaPayload);

  const config = TEAM_COLOR[actualTeam] || TEAM_COLOR.builder;
  const root = mkGroup('soldier_root');

  const bodyMat = new THREE.MeshStandardMaterial();
  bodyMat.color = config.diffuse.clone();
  bodyMat.emissive = config.emissive.clone();

  const darkMat = getMat(0x1e1e1e);
  const gunMat = getMat(0x1a1a1a);

  const addBox = function addBox(width, height, depth, material, x, y, z) {
    const box = mkBox('b', width, height, depth);
    box.position.set(x, y, z);
    box.material = material;
    root.add(box);
    box.userData = { ...metaPayload };
    return box;
  };

  const torso = addBox(0.5, 0.6, 0.28, bodyMat, 0, 0.92, 0);
  const head = addBox(0.34, 0.34, 0.32, bodyMat, 0, 1.5, 0);

  const helmbrim = mkCylinder('hb', 0.44, 0.48, 0.11, 8);
  helmbrim.position.set(0, 1.68, 0);
  helmbrim.material = darkMat;
  root.add(helmbrim);
  helmbrim.userData = { ...metaPayload };

  const helmtop = mkSphere('ht', 0.36, 5);
  helmtop.position.set(0, 1.76, 0);
  helmtop.material = darkMat;
  root.add(helmtop);
  helmtop.userData = { ...metaPayload };

  const legL = addBox(0.18, 0.5, 0.2, bodyMat, -0.14, 0.32, 0);
  const legR = addBox(0.18, 0.5, 0.2, bodyMat, 0.14, 0.32, 0);
  const armL = addBox(0.14, 0.46, 0.16, bodyMat, -0.34, 0.9, 0);
  const armR = addBox(0.14, 0.46, 0.16, bodyMat, 0.34, 0.9, 0);

  const gunRoot = mkGroup('gun_root');
  gunRoot.position.set(0.34, 1.02, 0.28);
  root.add(gunRoot);
  const gunBody = mkBox('gb', 0.055, 0.055, 0.65);
  gunBody.material = gunMat;
  gunRoot.add(gunBody);
  const gunRail = mkBox('gr', 0.038, 0.038, 0.32);
  gunRail.position.z = 0.48;
  gunRail.material = gunMat;
  gunRoot.add(gunRail);

  const selectionDisc = mkTorus('sel', 1.5, 0.05, 32);
  selectionDisc.rotation.x = 0;
  selectionDisc.position.y = 0.05;
  root.add(selectionDisc);
  const selectionMaterial = new THREE.MeshBasicMaterial();
  // Green for player, red for enemy
  selectionMaterial.color = (actualTeam === 'blue' || actualTeam === PLAYER)
    ? new THREE.Color(0, 1, 0.53)
    : new THREE.Color(1, 0.15, 0.1);
  selectionMaterial.opacity = 0;
  selectionMaterial.transparent = true;
  selectionDisc.material = selectionMaterial;
  selectionDisc.visible = false;
  selectionDisc.visible = false;

  const hitbox = mkCylinder('hb', HITBOX_SIZE, HITBOX_SIZE, 2.2, 12);
  hitbox.position.set(0, 1.1, 0);
  root.add(hitbox);
  hitbox.userData.pickable = true;
  hitbox.visible = true;
  if (_hitboxDebug) {
    const hitboxMaterial = new THREE.MeshBasicMaterial();
    hitboxMaterial.color = new THREE.Color(1, 0.2, 0.1);
    hitboxMaterial.wireframe = true;
    hitbox.material = hitboxMaterial;
  } else {
    hitbox.material = ghostHitboxMaterial();
  }
  hitbox.userData = { ...metaPayload };
  _allHitboxes.push(hitbox);

  const childMeshes = [torso, head, helmbrim, helmtop, legL, legR, armL, armR, gunBody, gunRail];
  childMeshes.forEach((mesh) => {
    mesh.userData = { ...metaPayload };
  });

  root._bodyMat = bodyMat;
  root._selDisc = selectionDisc;
  root._selMat = selectionMaterial;
  root._legL = legL;
  root._legR = legR;
  root._armL = armL;
  root._armR = armR;
  root._helmTopMesh = helmtop;
  root._helmBrimMesh = helmbrim;
  if (scene._registerShadows) {
    childMeshes.forEach((mesh) => {
      scene._registerShadows(mesh);
    });
  }
  const blob = mkDisc('blobshadow', 0.52, 16, false);
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.015;
  root.add(blob);
  blob.userData.pickable = false;
  blob.frustumCulled = false;
  const blobMaterial = new THREE.MeshBasicMaterial();
  blobMaterial.color = new THREE.Color(0, 0, 0);
  blobMaterial.opacity = 0.55;
  blobMaterial.transparent = true;
  blobMaterial.polygonOffset = true;
  blobMaterial.polygonOffsetFactor = -1;
  blob.material = blobMaterial;
  root._blobShadow = blob;
  return root;
}


const GUARDSMAN_HEADS = ['guardsmen_head01', 'guardsmen_head02', 'guardsmen_head03', 'guardsmen_head04'];
let _guardsmanHeadCycle = 0;

// Per-soldier head variety for guardsmen.glb: exactly one of head01..04 is
// visible, stable per soldier entity id (reinforce and upgrade visuals keep
// their head). No-ops when the hierarchy carries no head variants (other
// factions, procedural fallback). Returns the picked index (0..3) or -1.
export function applyGuardsmanHead(root, soldierEntityId) {
  const heads = [];
  root.traverse((child) => {
    if (GUARDSMAN_HEADS.includes(child.name)) heads.push(child);
  });
  if (!heads.length) return -1;
  const pick = Number.isInteger(soldierEntityId)
    ? ((soldierEntityId % GUARDSMAN_HEADS.length) + GUARDSMAN_HEADS.length) % GUARDSMAN_HEADS.length
    : (_guardsmanHeadCycle++ % GUARDSMAN_HEADS.length);
  heads.forEach((head) => {
    head.visible = head.name === GUARDSMAN_HEADS[pick];
  });
  return pick;
}

export function _makeFactionSoldierMesh(container, teamKey, metaPayload, factionKey, role = 'soldier') {
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.builder;
  const instance = instantiateGltf(container);
  instance.animationGroups.forEach((animationGroup) => animationGroup.stop());

  const root = mkGroup('faction_soldier_root');

  instance.rootNodes.forEach((rootNode) => {
    root.add(rootNode);
    rootNode.visible = true;
  });

  (container._hiddenNodes || []).forEach((nodeName) => {
    instance.rootNodes.forEach((rootNode) => {
      descendants(rootNode).forEach((child) => {
        if (matchHiddenNodeName(child.name, nodeName)) {
          child.visible = false;
          child.visible = false;
          child.userData.pickable = false;
        }
      });
    });
  });

  childMeshes(root).forEach((mesh) => {
    mesh.userData.pickable = true;
    mesh.userData = { ...metaPayload };
    if (scene._registerShadows) {
      scene._registerShadows(mesh);
    }
  });

  applyGuardsmanHead(root, metaPayload && metaPayload.soldierEntityId);

  const bodyMat = new THREE.MeshStandardMaterial();
  bodyMat.color = config.diffuse.clone();
  bodyMat.emissive = config.emissive.clone();
  root._bodyMat = bodyMat;

  const selDisc = mkTorus('sel_faction', 1.5, 0.05, 32);
  selDisc.rotation.x = 0;
  selDisc.position.y = 0.05;
  root.add(selDisc);
  const selMat = new THREE.MeshBasicMaterial();
  selMat.color = (teamKey === PLAYER)
    ? new THREE.Color(0, 1, 0.53)
    : new THREE.Color(1, 0.15, 0.1);
  selMat.opacity = 0;
  selMat.transparent = true;
  selDisc.material = selMat;
  selDisc.visible = false;
  selDisc.visible = false;
  selDisc.userData = { ...metaPayload };
  root._selDisc = selDisc;
  root._selMat = selMat;

  const _dummy = () => {
    const node = mkGroup('dummy_faction');
    root.add(node);
    return node;
  };
  root._legL = _dummy();
  root._legR = _dummy();
  root._armL = _dummy();
  root._armR = _dummy();
  root._helmTopMesh = null;
  root._helmBrimMesh = null;

  root._animGroups = {};
  root._currentAnim = null;
  root._shootDone = false;
  root._trackingUntil = 0;

  const animName = (g) => g.name.toLowerCase();
  const isMeleeName = (name) => /(melee|attack|slash|swing|punch|stab|combat|knife|damage|thrown)/.test(name);
  const isFiringName = (name) => /(fir|shoot|gun|weapon)/.test(name) && !name.startsWith('vis_');
  const findAnim = (pred) => instance.animationGroups.find((g) => pred(animName(g)));
  const animConfig = getFactionAnimations(factionKey, role) || {};
  const findByName = (wantedName) => {
    if (!wantedName) return null;
    const wanted = wantedName.toLowerCase();
    return findAnim((n) => n.startsWith(wanted));
  };

  const idleAnim = findByName(animConfig.idle)
    || findAnim((n) => !isFiringName(n) && !isMeleeName(n) && /^(idle|stand)/.test(n))
    || findAnim((n) => !isMeleeName(n) && /^(idle|stand)/.test(n));
  const idleTrackingAnim = findByName(animConfig.idle_tracking)
    || findAnim((n) => !isMeleeName(n) && /idle[_-]?tracking/.test(n));
  const moveTrackingAnim = findByName(animConfig.moveTracking)
    || findAnim((n) => !isMeleeName(n) && /move[_-]?tracking/.test(n));
  const runAnim = findByName(animConfig.run)
    || findAnim((n) => !isFiringName(n) && !isMeleeName(n) && /^(run|walk|jog|move_run)/.test(n))
    || findAnim((n) => !isMeleeName(n) && /(^run|^walk|^jog)/.test(n));
  const shootMoveAnim = findByName(animConfig.moveFiring)
    || findAnim((n) => isFiringName(n) && !isMeleeName(n) && /^(move|run|walk|jog)_?(fir|shoot)/.test(n));
  // Exact first: 'fly_launch_continue' must not match the launch slot.
  const findExact = (wantedName) => {
    if (!wantedName) return null;
    const wanted = wantedName.toLowerCase();
    return findAnim((n) => n === wanted) || null;
  };
  const flyLaunchAnim = findExact(animConfig.flyLaunch)
    || findByName(animConfig.flyLaunch)
    || findAnim((n) => /^fly[_-]?launch$/.test(n));
  const flyIdleAnim = findExact(animConfig.flyIdle)
    || findByName(animConfig.flyIdle)
    || findAnim((n) => /^fly[_-]?idle$/.test(n));
  const flyLandAnim = findExact(animConfig.flyLand)
    || findByName(animConfig.flyLand)
    || findAnim((n) => /^fly[_-]?land$/.test(n));
  const shootAnim = findByName(animConfig.firing)
    || findAnim((n) => isFiringName(n) && !isMeleeName(n) && /^(idle|stand)_?(fir|shoot)/.test(n))
    || findAnim((n) => isFiringName(n) && !isMeleeName(n));
  const buildAnim = findByName(animConfig.build)
    || findAnim((n) => !isMeleeName(n) && /^build/.test(n))
    || null;
  const repairAnim = findByName(animConfig.repair)
    || findAnim((n) => !isMeleeName(n) && /^repair/.test(n))
    || null;
  const flagPlant1Anim = findByName(animConfig.flagPlant1)
    || findAnim((n) => /^flag_plant_1/.test(n))
    || null;
  const flagPlant2Anim = findByName(animConfig.flagPlant2)
    || findAnim((n) => /^flag_plant_2/.test(n))
    || null;
  const capture1Anim = findByName(animConfig.capture1)
    || findAnim((n) => /^capture_strategic_point_1/.test(n))
    || null;
  const capture2Anim = findByName(animConfig.capture2)
    || findAnim((n) => /^capture_strategic_point_2/.test(n))
    || null;
  const dieAnims = [];
  const safeFind = (name) => (name ? findAnim((n) => n.toLowerCase().startsWith(name.toLowerCase())) : null);
  ['die_normal_1', 'die_normal_2'].forEach((key) => {
    const ag = findByName(animConfig[key])
      || safeFind(key)
      || findAnim((n) => new RegExp('^' + key).test(n.toLowerCase()));
    if (ag) dieAnims.push(ag);
  });
  if (!dieAnims.length) {
    ['die', 'death'].forEach((prefix) => {
      const ag = findAnim((n) => n.toLowerCase().startsWith(prefix));
      if (ag) dieAnims.push(ag);
    });
  }

  if (idleAnim) root._animGroups.idle = idleAnim;
  if (idleTrackingAnim) root._animGroups.idle_tracking = idleTrackingAnim;
  if (moveTrackingAnim) root._animGroups.move_tracking = moveTrackingAnim;
  if (runAnim) root._animGroups.run = runAnim;
  if (shootAnim) root._animGroups.shoot = shootAnim;
  if (shootMoveAnim) root._animGroups.shootMove = shootMoveAnim;
  if (flyLaunchAnim) root._animGroups.flyLaunch = flyLaunchAnim;
  if (flyIdleAnim) root._animGroups.flyIdle = flyIdleAnim;
  if (flyLandAnim) root._animGroups.flyLand = flyLandAnim;
  if (buildAnim) root._animGroups.build = buildAnim;
  if (repairAnim) root._animGroups.repair = repairAnim;
  if (flagPlant1Anim) root._animGroups.flagPlant1 = flagPlant1Anim;
  if (flagPlant2Anim) root._animGroups.flagPlant2 = flagPlant2Anim;
  if (capture1Anim) root._animGroups.capture1 = capture1Anim;
  if (capture2Anim) root._animGroups.capture2 = capture2Anim;
  if (dieAnims.length) root._dieAnims = dieAnims;

  const firstNonMelee = () => instance.animationGroups.find((g) => !isMeleeName(animName(g))) || null;
  if (!root._animGroups.idle) root._animGroups.idle = firstNonMelee();
  if (!root._animGroups.run) root._animGroups.run = firstNonMelee() || root._animGroups.idle;
  if (!root._animGroups.shoot) root._animGroups.shoot = firstNonMelee() || root._animGroups.idle;

  root._playAnim = function (name, loop, force) {
    if (loop === undefined) loop = (name !== 'shoot' && name !== 'shootMove');
    if (animSwitchBlocked({ currentAnim: root._currentAnim, shootDone: root._shootDone, name, force })) return;
    let resolvedName = name;
    if (name === 'idle' && root._animGroups.idle_tracking) {
      const nowSec = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
      if (force) {
        // Order edge (Q/RMB stop): weapon-ready pose first, relax later.
        root._trackingUntil = nowSec + IDLE_TRACKING_HOLD_SEC;
      }
      resolvedName = resolveIdleAnim({
        hasTracking: true,
        force,
        shootJustEnded: root._shootJustEnded,
        currentAnim: root._currentAnim,
        trackingUntil: root._trackingUntil || 0,
        now: nowSec,
      });
      root._shootJustEnded = false;
    }
    if (name === 'run' && root._animGroups.move_tracking) {
      if (root._shootJustEnded || root._currentAnim === 'move_tracking') {
        resolvedName = 'move_tracking';
      }
      root._shootJustEnded = false;
    }
    if (root._currentAnim === resolvedName && loop) return;
    if (root._currentAnim === resolvedName && !loop) return;
    if (!root._animGroups[resolvedName]) {
      const fallbackOrder = name === 'idle' ? ['run', 'shoot', 'shootMove']
        : name === 'run' ? ['idle', 'shoot', 'shootMove']
          : name === 'shootMove' ? ['shoot', 'idle', 'run']
            : ['idle', 'run', 'shoot', 'shootMove'];
      const found = fallbackOrder.find((s) => root._animGroups[s]);
      if (found) resolvedName = found;
      else return;
    }
    const resolvedLoop = loop && resolvedName !== 'shoot' && resolvedName !== 'shootMove';
    Object.values(root._animGroups).forEach((ag) => {
      try { ag.stop(); } catch (e) { /* ignore */ }
    });
    root._currentAnim = resolvedName;
    root._shootDone = (resolvedName !== 'shoot') && (resolvedName !== 'shootMove');
    const ag = root._animGroups[resolvedName];
    if (!ag) return;
    try {
      ag.loopAnimation = resolvedLoop;
      ag.onAnimationGroupEndObservable.clear();
      ag.reset();
      ag.start(resolvedLoop, 1.0);
      if (!resolvedLoop) {
        ag.onAnimationGroupEndObservable.addOnce(() => {
          root._shootDone = true;
          root._shootJustEnded = root._currentAnim === 'shoot' || root._currentAnim === 'shootMove';
          if (root._shootJustEnded && root._animGroups.idle_tracking) {
            const nowSec = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
            root._trackingUntil = nowSec + IDLE_TRACKING_HOLD_SEC;
          }
          root._currentAnim = null;
        });
      }
    } catch (e) {
      console.warn('_playAnim error', resolvedName, e);
    }
  };

  addTeamRing(root, teamKey === PLAYER);

  const blob = mkDisc('blobshadow_faction', 0.52, 16, false);
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.015;
  root.add(blob);
  blob.userData.pickable = false;
  blob.frustumCulled = false;
  const blobMat = new THREE.MeshBasicMaterial();
  blobMat.color = new THREE.Color(0, 0, 0);
  blobMat.opacity = 0.55;
  blobMat.transparent = true;
  blobMat.polygonOffset = true;
  blobMat.polygonOffsetFactor = -1;
  blob.material = blobMat;
  root._blobShadow = blob;

  const hitbox = mkCylinder('hb_faction', HITBOX_SIZE, HITBOX_SIZE, 2.2, 12);
  hitbox.position.set(0, 1.1, 0);
  root.add(hitbox);
  hitbox.userData.pickable = true;
  hitbox.visible = true;
  if (_hitboxDebug) {
    const hbMat = new THREE.MeshBasicMaterial();
    hbMat.color = new THREE.Color(1, 0.2, 0.1);
    hbMat.wireframe = true;
    hitbox.material = hbMat;
  } else {
    hitbox.material = ghostHitboxMaterial();
  }
  hitbox.userData = { ...metaPayload };
  _allHitboxes.push(hitbox);

  if (factionKey === 'necrons' && role === 'soldier') {
    try {
      attachGaussConduit(root);
    } catch (_) {
      // Older/alternate warrior models without gun markers stay conduit-free.
    }
    try {
      addNecronAura(root);
    } catch (_) {
      // Aura is decorative; never break a spawn.
    }
  }

  try {
    applyPlasmaGlow(root);
  } catch (_) {
    // Models without a plasmagun stay untouched.
  }

  try {
    addPlasmaPistolGlow(root);
  } catch (_) {
    // Models without a plasma pistol stay untouched.
  }

  return root;
}
