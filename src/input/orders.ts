import { findConstructionTarget } from './construction-target.js';
import { sendSkirmishCommand } from '../net/skirmish-input.js';
import { assignConstructionWork } from '../systems/construction.js';
import * as THREE from 'three';
import { createAirfieldEntity, createBeamEntity, createBuildingEntity, createStructureEntity, getSoldierMuzzlePos } from '../entities/entities.js';
import { playHitCrunch } from '../fx/audio.js';
import { cursorCss } from '../ui/cursors.js';
import { FACTIONS, playerFaction, resolveFactionKey } from '../factions.js';
import { updateHUD } from '../core/hud.js';
import { canPlaceListeningPost } from '../meshes.js';
import { netPlaceBuilding, netMoveSquads, netAttackSquad } from '../net/multiplayer.js';
import {
  COSTS,
  JET_ALT,
  PLAYER,
  _startTargetPulse,
  buildMode,
  camera,
  canCommand,
  canvas,
  currentBounds,
  requisition,
  selBuilder,
  selBuildings,
  selSquads,
  setBuildMode,
  setHoveredEnemySquad,
  setMapRevealed,
  setRequisition,
  world,
} from '../core/scene.js';
import { disposeMeshComponent, spawnParticles } from '../core/systems.js';
import { _stopBuildGhost, cancelBuild, _listeningPostGhostTarget } from './build-ghost.js';
import { _spIdAt, flashHitmarker, spawnBeamTracer, spawnMoveMarker, spawnMoveMarkerAt, spawnSpPing } from './markers.js';
import { fpsShotTarget, getViewmodelMuzzleWorldPos, resolveFpsTarget } from '../render/camera-fps.js';
import { snapOrderToFree } from '../../pathfinding/astar-integrated.js';
import { _setAirfieldSelected, clearAirfieldRallyMarker, clearEnemySelection, clearRallyMarker, pickFpsTargetMesh, pickMesh, raycastGround, setBuildingSelected, updateAirfieldRallyMarker, updateRallyMarker } from './selection.js';


export function issueRightClick(sx: number, sy: number): void {
  if (_flyArmed) {
    if (_issueFlyOrder(sx, sy)) {
      spawnMoveMarker(sx, sy);
    }
    cancelFlyTargeting();
    updateHUD();
    return;
  }
  const hit = pickMesh(sx, sy);
  if (hit?.meta) {
    if (hit.meta.strategicPointEntityId !== undefined) {
      spawnSpPing(hit.meta.strategicPointEntityId);
    }
    const { soldierEntityId } = hit.meta;
    const sid = hit.meta.squadEntityId !== undefined
      ? hit.meta.squadEntityId
      : (soldierEntityId !== undefined ? world.get(soldierEntityId, 'soldier')?.squadId : undefined);

    if (sid !== undefined) {
      const squad = world.get(sid, 'squad');
      if (squad && selSquads.length > 0 && !selSquads.includes(sid)) {
        // Attackers: selected units whose team differs from the clicked
        // squad. In normal play this is exactly the PLAYER selection vs an
        // enemy squad; in control-both mode each side attacks the other.
        const teamOf = (id: number): string | undefined => (world.get(id, 'jet') ?? world.get(id, 'apc') ?? world.get(id, 'vehicle') ?? world.get(id, 'squad'))?.team;
        const attackers = selSquads.filter((id: number) => {
          const t = teamOf(id);
          return t && t !== squad.team;
        });
        if (attackers.length > 0) {
          const targetSoldierId = soldierEntityId !== undefined && world.has(soldierEntityId, 'soldier') ? soldierEntityId : null;
          clearEnemySelection();
          setHoveredEnemySquad(sid);
          if (targetSoldierId) {
            squad.soldiers.forEach((soldierId: number) => {
              if (soldierId === null) return;
              const mc = world.get(soldierId, 'mesh');
              if (mc?.root?._selMat) {
                mc.root._selMat.opacity = (soldierId === targetSoldierId) ? 1 : 0.25;
                mc.root._selMat.transparent = true;
              }
            });
            _startTargetPulse(targetSoldierId);
          } else {
            squad.soldiers.forEach((soldierId: number) => {
              if (soldierId === null) return;
              const mc = world.get(soldierId, 'mesh');
              if (mc?.root?._selMat) mc.root._selMat.opacity = 0.85; if(mc?.root?._selMat)mc.root._selMat.transparent = true;
            });
          }
          const attackerJets = attackers.filter((id: number) => world.get(id, 'jet') != null);
          attackerJets.forEach((id) => {
            const jet = world.get(id, 'jet');
            if (jet) {
              jet.forcedTargetSqId = sid;
              jet.strafe = null;
              jet.strafeCd = 0;
              jet.moveOrder = null;
              jet.waitOrders = false;
              jet.patrolMode = 'attack';
            }
          });
          if (window._multiplayerMode) netAttackSquad(attackers.filter(id => world.has(id, 'squad')), sid);
          // No click torus on enemy squads: the persistent hover torus and
          // the target highlight already mark the victim.
          attackers.forEach((id) => {
            const psq = world.get(id, 'squad');
            if (psq) {
              psq.forcedTarget = sid;
              psq.forcedSoldierId = targetSoldierId;
              psq.moveOrder = null;
              psq.flyOrder = null;
              psq.captureOrderSpId = null;
              psq.stopped = false;
            }
          });
          const attackerVehicles = attackers.filter((id: number) => world.get(id, 'vehicle') != null);
          attackerVehicles.forEach((id) => {
            const vehicle = world.get(id, 'vehicle');
            if (vehicle) {
              vehicle.moveOrder = new THREE.Vector3(squad.position.x, 0, squad.position.z);
            }
          });
          updateHUD();
          return;
        }
      }
    }
    if (hit.meta.apcEntityId !== undefined) {
      const apc = world.get(hit.meta.apcEntityId, 'apc');
      if (apc && canCommand(apc.team)) {
        let boarded = false;
        for (const sid of selSquads) {
          boarded = _boardSquadOntoApc(apc, sid) || boarded;
        }
        if (boarded) {
          spawnMoveMarker(sx, sy);
          updateHUD();
          return;
        }
      }
    }
  }

  const point = raycastGround(sx, sy);
  const construction = findConstructionTarget(world, selBuilder, hit?.meta, point, canCommand);
  if (construction) {
    if (sendSkirmishCommand({ ResumeBuild: { builder_id: selBuilder, target_id: construction.id } })) return;
    assignConstructionWork(world, selBuilder!, construction.id, construction.component);
    spawnMoveMarker(sx, sy);
    updateHUD();
    return;
  }
  if (!point) return;
  issueGroundOrder(point, {
    strategicPointEntityId: hit?.meta?.strategicPointEntityId,
    markerSx: sx,
    markerSy: sy,
  });
}

// First-person free fire: left-click shoots a beam at whatever is under the
// crosshair — enemies, ground, scenery. No orders are issued and the squad
// never moves: every click is exactly one shot from the ridden soldier.
// Enemy hits deal damage through the beam pipeline; anything else gets a
// visual tracer plus impact particles. Returns true when a shot was fired.
export function issueFpsShot(sx: number, sy: number): boolean {
  const target = resolveFpsTarget(world, selSquads);
  if (!target) return false;
  const shooterRoot = world.get(target.soldierId, 'mesh')?.root;
  if (!shooterRoot) return false;
  // The beam leaves the viewmodel's muzzle tip, falling back to the
  // soldier's gun tip when the camera carries no gun yet.
  const from = getViewmodelMuzzleWorldPos() ?? getSoldierMuzzlePos(world, target.soldierId);
  const hit = pickFpsTargetMesh(sx, sy, target.squadId);
  const order = fpsShotTarget(world, hit?.meta, target.squadId, target.squad.team);
  if (order?.targetSoldierId) {
    createBeamEntity(world, from, target.squad.team, target.soldierId, order.targetSoldierId, 1, true);
    flashHitmarker();
    playHitCrunch();
  } else {
    const point = raycastGround(sx, sy) ?? _fpsSkyPoint(sx, sy);
    if (!point) return false;
    spawnBeamTracer(from, point);
    spawnParticles(point, new THREE.Color(1, 0.45, 0.2), 4);
  }
  updateHUD();
  return true;
}

// Aim-ray endpoint for crosshair shots at the sky: 60 units out along the
// camera ray through the given screen point. Null without a live camera.
function _fpsSkyPoint(sx: number, sy: number): THREE.Vector3 | null {
  if (!camera || !canvas?.getBoundingClientRect) return null;
  const rect = canvas.getBoundingClientRect();
  if (!rect || !rect.width || !rect.height) return null;
  _fpsNdc.set(
    ((sx - rect.left) / rect.width) * 2 - 1,
    -((sy - rect.top) / rect.height) * 2 + 1,
  );
  _fpsRay.setFromCamera(_fpsNdc, camera);
  return _fpsRay.ray.at(60, new THREE.Vector3());
}

const _fpsNdc = new THREE.Vector2();
const _fpsRay = new THREE.Raycaster();

// Ground move order to an explicit world point (shared by canvas
// right-click and the minimap): formation offsets, paint snap, capture
// clearing, markers, builder/rally handling. strategicPointEntityId pins
// an explicit capture target from the canvas pick; the minimap passes
// null and the radius check still applies. markerSx/markerSy keep the
// click marker on the canvas click; without them the marker drops at
// the destination.
export function issueGroundOrder(point: THREE.Vector3, opts: { strategicPointEntityId?: unknown; markerSx?: number | null; markerSy?: number | null } = {}): void {
  const { strategicPointEntityId = null, markerSx = null, markerSy = null } = opts;
  if(window._multiplayerMode && window._networkSchema===2){
    if(selBuildings.length && !selSquads.length && selBuilder==null){
      for(const id of selBuildings)sendSkirmishCommand({SetRally:{building_id:id,target:point}});
    }else{
      const ids=[...selSquads,...(selBuilder!=null?[selBuilder]:[])];
      sendSkirmishCommand({MoveUnits:{ids,target:point,point_id:strategicPointEntityId??_spIdAt(point.x,point.z)}});
    }
    if(markerSx!==null&&markerSy!==null)spawnMoveMarker(markerSx,markerSy);else spawnMoveMarkerAt(point);
    updateHUD();
    return;
  }
  const mark = (): void => {
    if (markerSx !== null && markerSy !== null) spawnMoveMarker(markerSx, markerSy);
    else spawnMoveMarkerAt(point);
  };
  const selectedJets = selSquads.filter((id: number) => canCommand(world.get(id, 'jet')?.team));
  if (selectedJets.length) {
    selectedJets.forEach((id, i) => {
      const jet = world.get(id, 'jet');
      if (jet) {
        const c = (i % 2) - (selectedJets.length > 1 ? 0.5 : 0);
        const r = Math.floor(i / 2);
        jet.moveOrder = new THREE.Vector3(point.x + c * 6, JET_ALT, point.z + r * 6);
        jet.waitOrders = false;
        jet.strafe = null;
      }
    });
  }
  const selectedBarracks = selBuildings.filter((id: number) => world.has(id, 'building'));
  if (selectedBarracks.length && selSquads.length === 0 && selBuilder === null) {
    selectedBarracks.forEach((id) => {
      const bld = world.get(id, 'building');
      bld.rallyPoint = new THREE.Vector3(point.x, 0, point.z);
      updateRallyMarker(id, bld);
    });
    mark();
    return;
  }
  const selectedAirfields = selBuildings.filter((id: number) => world.has(id, 'airfield'));
  if (selectedAirfields.length && selSquads.length === 0 && selBuilder === null) {
    selectedAirfields.forEach((id) => {
      const airfield = world.get(id, 'airfield');
      if (airfield) {
        airfield.rallyPoint = new THREE.Vector3(point.x, 0, point.z);
        updateAirfieldRallyMarker(id, airfield);
      }
    });
    mark();
    return;
  }
  mark();
  if (selBuilder !== null && world.has(selBuilder, 'builder')) {
    const builder = world.get(selBuilder, 'builder');
    builder.buildTargetSP = null;
    builder.buildTarget = null;
    builder.moveTarget = new THREE.Vector3(point.x, 0, point.z);
    builder.isBuilding = false;
  }
  const active = selSquads.filter((sid: number) => canCommand(world.get(sid, 'squad')?.team));
  if (active.length) {
    const cols = Math.ceil(Math.sqrt(active.length));
    // Explicit capture request: right-click landed on a point mesh, or the
    // ordered destination sits inside a point's radius. Any other ground
    // order clears the capture order — proximity alone never caps.
    const hitSpId = strategicPointEntityId;
    active.forEach((sid, i) => {
      const squad = world.get(sid, 'squad');
      if (!squad) return;
      const c = (i % cols) - (cols - 1) / 2;
      const r = Math.floor(i / cols);
      const destination = new THREE.Vector3(point.x + c * 7, 0, point.z + r * 7);
      destination.x = Math.max(-currentBounds(), Math.min(currentBounds(), destination.x));
      destination.z = Math.max(-currentBounds(), Math.min(currentBounds(), destination.z));
      // Point capture reads the raw click (hilltop points stay reachable);
      // the walk destination itself snaps off closed paint.
      squad.captureOrderSpId = hitSpId ?? _spIdAt(destination.x, destination.z) ?? null;
      const snapped = snapOrderToFree(destination.x, destination.z);
      if (snapped) {
        destination.x = snapped.x;
        destination.z = snapped.z;
      }
      if (window._multiplayerMode) netMoveSquads([sid], destination);
      squad.moveOrder = destination;
      squad.attackMove = false;
      squad.stopped = false;
      squad.flyOrder = null;
      squad.forcedTarget = null;
      squad.forcedSoldierId = null;
    });
  }
  const activeApcs = selSquads.filter((sid: number) => canCommand(world.get(sid, 'apc')?.team));
  activeApcs.forEach((id, i) => {
    const apc = world.get(id, 'apc');
    if (apc) {
      const c = (i % 2) - (activeApcs.length > 1 ? 0.5 : 0);
      const r = Math.floor(i / 2);
      const destination = new THREE.Vector3(point.x + c * 5, 0, point.z + r * 5);
      destination.x = Math.max(-currentBounds(), Math.min(currentBounds(), destination.x));
      destination.z = Math.max(-currentBounds(), Math.min(currentBounds(), destination.z));
      const snappedApc = snapOrderToFree(destination.x, destination.z);
      if (snappedApc) {
        destination.x = snappedApc.x;
        destination.z = snappedApc.z;
      }
      apc.moveOrder = destination;
    }
  });
  const activeVehicles = selSquads.filter((sid: number) => canCommand(world.get(sid, 'vehicle')?.team));
  activeVehicles.forEach((id, i) => {
    const vehicle = world.get(id, 'vehicle');
    if (vehicle) {
      const c = (i % 2) - (activeVehicles.length > 1 ? 0.5 : 0);
      const r = Math.floor(i / 2);
      const destination = new THREE.Vector3(point.x + c * 5, 0, point.z + r * 5);
      destination.x = Math.max(-currentBounds(), Math.min(currentBounds(), destination.x));
      destination.z = Math.max(-currentBounds(), Math.min(currentBounds(), destination.z));
      const snappedVehicle = snapOrderToFree(destination.x, destination.z);
      if (snappedVehicle) {
        destination.x = snappedVehicle.x;
        destination.z = snappedVehicle.z;
      }
      vehicle.moveOrder = destination;
    }
  });
}


export function demolishBuilding(id: number): void {
  if (world.has(id, 'airfield')) {
    _setAirfieldSelected(world, id, false);
  } else {
    setBuildingSelected(world, id, false);
  }
  const idx = selBuildings.indexOf(id);
  if (idx >= 0) {
    selBuildings.splice(idx, 1);
  }
  clearRallyMarker(id);
  clearAirfieldRallyMarker(id);
  const component = world.get(id, 'building') || world.get(id, 'structure') || world.get(id, 'airfield');
  if (component) {
    spawnParticles(new THREE.Vector3(component.position.x, 2, component.position.z), new THREE.Color(1, 0.4, 0.1), 28);
  }
  const meshComponent = world.get(id, 'mesh');
  if (meshComponent) {
    disposeMeshComponent(meshComponent);
  }
  world.destroyEntity(id);
  updateHUD();
}


export function buildAddon(buildingId: number, addonKey: string): boolean {
  if(sendSkirmishCommand({BuildAddon:{building_id:buildingId,addon:addonKey}}))return true;
  const building = world.get(buildingId, 'building');
  if (!building || !canCommand(building.team)) return false;
  const factionKey = resolveFactionKey(building.faction, playerFaction);
  const structureConfig = FACTIONS[factionKey]?.structures?.find((s) => s.type === building.type);
  const addonConfig = structureConfig?.addons?.find((a) => a.name === addonKey);
  if (!addonConfig) return false;
  if (building.addons.includes(addonKey)) return false;
  if (building.constructing) return false;
  if (addonConfig.requiresTier && building.tier < addonConfig.requiresTier) return false;
  if (requisition < addonConfig.cost!) return false;
  setRequisition(requisition - addonConfig.cost!);
  building.addons.push(addonKey);
  if (addonConfig.tier) building.tier = Math.max(building.tier, addonConfig.tier);
  if (addonConfig.scanner) setMapRevealed(true);
  updateHUD();
  return true;
}


/* ── Builder command mode (Tech-Priest control grid) ────────────────── */

export let _pendingBuilderCommand: string | null = null;


export function setBuilderCommand(cmd: string): void {
  _pendingBuilderCommand = cmd;
  if (canvas) canvas.style.cursor = cmd === 'melee' ? cursorCss('melee', 'crosshair') : (cmd ? 'crosshair' : '');
}


export function clearBuilderCommand(): void {
  _pendingBuilderCommand = null;
  if (canvas) canvas.style.cursor = '';
}


/* ── Fly targeting mode (bloodthirster FLY button) ─────────────────── */

export let _flyArmed: number[] | null = null;


export function isFlyArmed(): boolean {
  return !!_flyArmed;
}


// Arms RMB fly targeting for the selected fly-capable squads.
// Single-player only: no net order exists for flight.
export function armFlyTargeting(): boolean {
  const flyers = selSquads.filter((sid: number) => {
    const squad = world.get(sid, 'squad');
    if (!squad || !canCommand(squad.team)) {
      return false;
    }
    const cfg = squad.unitType ? FACTIONS[squad.faction]?.units?.find((u) => u.name === squad.unitType) : null;
    return !!cfg?.canFly;
  });
  if (!flyers.length) {
    return false;
  }
  if (buildMode) {
    cancelBuild();
  }
  _flyArmed = flyers;
  canvas!.style.cursor = 'crosshair';
  return true;
}


export function cancelFlyTargeting(): void {
  _flyArmed = null;
  if (canvas) canvas.style.cursor = '';
}


export function _issueFlyOrder(sx: number, sy: number): boolean {
  const point = raycastGround(sx, sy);
  if (!point) {
    return false;
  }
  const armed = (_flyArmed || []).filter((sid: number) => world.has(sid, 'squad'));
  if (!armed.length) {
    return false;
  }
  const cols = Math.ceil(Math.sqrt(armed.length));
  armed.forEach((sid, i) => {
    const squad = world.get(sid, 'squad');
    if (!squad) {
      return;
    }
    const c = (i % cols) - (cols - 1) / 2;
    const r = Math.floor(i / cols);
    const destination = new THREE.Vector3(point.x + c * 7, 0, point.z + r * 7);
    destination.x = Math.max(-currentBounds(), Math.min(currentBounds(), destination.x));
    destination.z = Math.max(-currentBounds(), Math.min(currentBounds(), destination.z));
    if(sendSkirmishCommand({FlySquads:{ids:[sid],target:destination}}))return;
    squad.flyOrder = destination;
    squad.moveOrder = null;
    squad.stopped = false;
    squad.forcedTarget = null;
    squad.forcedSoldierId = null;
    squad.captureOrderSpId = null;
  });
  return true;
}


export function setBuilderStance(stance: string): void {
  if(selBuilder!=null&&sendSkirmishCommand({BuilderStance:{builder_id:selBuilder,stance}}))return;
  if (selBuilder === null || !world.has(selBuilder, 'builder')) {
    return;
  }
  const builder = world.get(selBuilder, 'builder');
  builder.stance = stance;
  builder.attackMove = false;
  clearBuilderCommand();
  updateHUD();
}


export function _issueBuilderCommand(cmd: string, sx: number, sy: number, point: THREE.Vector3, hit: { meta?: any } | null): void {
  if (selBuilder === null || !world.has(selBuilder, 'builder')) {
    return;
  }
  const builder = world.get(selBuilder, 'builder');
  if(sendSkirmishCommand({BuilderCommand:{builder_id:selBuilder,command:cmd,target:point,hit:hit?.meta}}))return;
  builder.buildTargetSP = null;
  builder.buildTarget = null;
  builder.isBuilding = false;
  if (cmd === 'move') {
    builder.moveTarget = point.clone();
    builder.attackMove = false;
    builder.meleeOrder = false;
    builder.repairTarget = null;
  } else if (cmd === 'attackmove') {
    builder.moveTarget = point.clone();
    builder.attackMove = true;
    builder.meleeOrder = false;
    builder.repairTarget = null;
  } else if (cmd === 'melee') {
    builder.moveTarget = point.clone();
    builder.attackMove = true;
    builder.meleeOrder = true;
    builder.repairTarget = null;
  } else if (cmd === 'repair') {
    builder.attackMove = false;
    builder.meleeOrder = false;
    builder.repairTarget = null;
    let targetId;
    if (hit?.meta) {
      if (hit.meta.buildingEntityId !== undefined) {
        targetId = hit.meta.buildingEntityId;
      } else if (hit.meta.structureEntityId !== undefined) {
        targetId = hit.meta.structureEntityId;
      } else if (hit.meta.vehicleEntityId !== undefined) {
        targetId = hit.meta.vehicleEntityId;
      } else if (hit.meta.airfieldEntityId !== undefined) {
        targetId = hit.meta.airfieldEntityId;
      }
    }
    if (targetId !== undefined) {
      builder.repairTarget = targetId;
      const comp = world.get(targetId, 'building') || world.get(targetId, 'structure') || world.get(targetId, 'vehicle') || world.get(targetId, 'airfield');
      if (comp) {
        builder.moveTarget = comp.position.clone();
      }
    } else {
      builder.moveTarget = point.clone();
    }
  }
  spawnMoveMarker(sx, sy);
  updateHUD();
}


export function _tryBuilderCommandClick(sx: number, sy: number, button = 0): boolean {
  if (_pendingBuilderCommand === null) {
    return false;
  }
  if (button !== (_pendingBuilderCommand === 'melee' ? 2 : 0)) return false;
  const cmd = _pendingBuilderCommand;
  clearBuilderCommand();
  if (selBuilder === null || !world.has(selBuilder, 'builder')) {
    return true;
  }
  const hit = pickMesh(sx, sy);
  const point = raycastGround(sx, sy);
  if (point) {
    _issueBuilderCommand(cmd, sx, sy, point, hit);
  }
  return true;
}


export function placeListeningPost(sx: number, sy: number): void {
  const hit = pickMesh(sx, sy);
  let spId = hit?.meta?.strategicPointEntityId;
  if (spId === undefined && _listeningPostGhostTarget != null) {
    const point = world.get(_listeningPostGhostTarget, 'strategicPoint');
    const ground = raycastGround(sx, sy);
    if (point && ground && Math.hypot(ground.x - point.position.x, ground.z - point.position.z) <= 4.5) spId = _listeningPostGhostTarget;
  }
  const sp = spId !== undefined ? world.get(spId, 'strategicPoint') : null;
  const builder = selBuilder !== null && world.has(selBuilder, 'builder') ? world.get(selBuilder, 'builder') : null;
  if (!canPlaceListeningPost(sp, builder?.team) || !builder) {
    return;
  }
  if (requisition < COSTS.listening_post) return;
  if(sendSkirmishCommand({PlaceBuilding:{builder_id:selBuilder,building_type:'listening_post',position:sp.position}}))return;
  builder.buildTargetSP = spId;
  builder.buildTarget = null;
  builder.moveTarget = sp.position.clone().add(new THREE.Vector3(3, 0, 0));
  builder.isBuilding = false;
  cancelBuild();
  updateHUD();
}


export function placeBuild(pt: THREE.Vector3): void {
  if (!buildMode) return;
  const type = buildMode;
  _stopBuildGhost();
  setBuildMode(null);
  canvas!.style.cursor = '';

  if (window._multiplayerMode) { netPlaceBuilding(type,pt,selBuilder); return; }

  if (requisition < COSTS[type as keyof typeof COSTS] || selBuilder === null || !world.has(selBuilder, 'builder')) return;
  const point = pt.clone();
  point.x = Math.max(-currentBounds() + 4, Math.min(currentBounds() - 4, point.x));
  point.z = Math.max(-currentBounds() + 4, Math.min(currentBounds() - 4, point.z));

  if (type === 'airfield') {
    const entityId = createAirfieldEntity(world, point, world.get(selBuilder, 'builder')?.faction);
    const component = world.get(entityId, 'airfield');
    if (component) {
      component.constructing = true;
      component.requiresWorker = true;
      component.pendingWorker = true;
      component.constructProgress = 0;
    }
    assignConstructionWork(world, selBuilder, entityId, component);
    updateHUD();
    return;
  }

  let entityId;
  if (type === 'barracks' || type === 'infantry_command' || type === 'hq' || type === 'hq-anim' || type === 'mechanized' || type === 'mars_pattern' || type === 'greater_sacrificial_circle') {
    entityId = createBuildingEntity(world, type, point, world.get(selBuilder, 'builder')?.team ?? PLAYER, world.get(selBuilder, 'builder')?.faction);
  } else {
    entityId = createStructureEntity(world, type, point, world.get(selBuilder, 'builder')?.faction, world.get(selBuilder, 'builder')?.team ?? PLAYER);
  }

  const component = world.get(entityId, 'building') || world.get(entityId, 'structure');
  if (component) {
    component.constructing = true;
    component.requiresWorker = true;
    component.pendingWorker = true;
    component.constructProgress = 0;
  }
  assignConstructionWork(world, selBuilder, entityId, component);
}


export function _boardSquadOntoApc(apc: any, sid: number): boolean {
  const squad = world.get(sid, 'squad');
  if (!squad || !canCommand(squad.team) || squad.team !== apc?.team || world.has(sid, 'apc') || world.has(sid, 'vehicle')) {
    return false;
  }
  if (!apc || apc.passengers.includes(sid)) {
    return false;
  }
  if (apc.passengers.length >= apc.maxPassengers) {
    return false;
  }
  if (squad.position.distanceTo(apc.position) > 10) {
    return false;
  }
  if(sendSkirmishCommand({BoardTransport:{apc_id:world.query('apc').find((id:number)=>world.get(id,'apc')===apc),ids:[sid]}}))return true;
  apc.passengers.push(sid);
  squad.soldiers.forEach((soldierId: number) => {
    if (soldierId) {
      const mc = world.get(soldierId, 'mesh');
      if (mc) mc.root.visible = false;
    }
  });
  const sqmc = world.get(sid, 'mesh');
  if (sqmc?.hpBar) sqmc.hpBar.visible = false;
  squad.stopped = true;
  squad.captureOrderSpId = null;
  return true;
}
