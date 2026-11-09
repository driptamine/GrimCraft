import { updateStrategicPointOwnershipRim } from '../meshes/points.js';
import { updateHUD } from '../core/hud.js';
import { nextPointOpenState, nextStrategicPointAnim, shouldShowCaptureFlag, updatePointFlag } from '../meshes.js';
import { world } from '../core/scene.js';
import { decayedCaptureProgress } from '../entities/soldier-aim.js';
import { _snapMeshToTerrain, _snapTerrainBegin } from './terrain.js';


export function systemStrategicPoint(world: any, deltaTime: number) {
  const capturingSpIds = new Set();
  const capturingFactions = new Map();
  // Closest planter distance per point: a squad carrying a capture order is
  // "on the way" even before it enters the capture radius.
  const planterDistances = new Map();
  for (const squadId of world.query('squad')) {
    const squad = world.get(squadId, 'squad');
    if (!squad) continue;
    if (squad.capturingSpId != null) {
      capturingSpIds.add(squad.capturingSpId);
      if (!capturingFactions.has(squad.capturingSpId)) {
        capturingFactions.set(squad.capturingSpId, squad.faction);
      }
    }
    if (squad.captureOrderSpId != null) {
      const orderedPoint = world.get(squad.captureOrderSpId, 'strategicPoint');
      if (orderedPoint) {
        const distance = squad.position.distanceTo(orderedPoint.position);
        const prev = planterDistances.get(squad.captureOrderSpId);
        if (prev == null || distance < prev) {
          planterDistances.set(squad.captureOrderSpId, distance);
        }
      }
    }
  }
  _snapTerrainBegin();
  for (const id of world.query('strategicPoint', 'mesh')) {
    const strategicPoint = world.get(id, 'strategicPoint');
    const meshComponent = world.get(id, 'mesh');
    if (!strategicPoint || !meshComponent) {
      continue;
    }
    updateStrategicPointOwnershipRim(meshComponent.model, strategicPoint.owner != null);
    // Idle decay (single-player only; multiplayer progress is server-owned):
    // the moment capping stops, unowned progress drains toward 0.
    if (!window._multiplayerMode) {
      if (strategicPoint._capTicked) {
        strategicPoint._capTicked = false;
      } else if (Math.abs(strategicPoint.captureProgress) < 1) {
        const next = decayedCaptureProgress(strategicPoint.captureProgress, deltaTime);
        if (next !== strategicPoint.captureProgress) {
          strategicPoint.captureProgress = next;
          _strategicPointUpdateOwner(world, id, strategicPoint);
        }
      }
    }
    // Points spawn at y=0 but the rendered SGB surface sits at
    // sampleHeight+rootY: seat the mesh onto it every frame (also heals
    // terrain-slider moves). Logic position stays flat by design.
    _snapMeshToTerrain(meshComponent);
    const beingCaptured = capturingSpIds.has(id);
    if (strategicPoint.owner == null && !beingCaptured) {
      strategicPoint.raiseFrom = null;
    }
    // Opens the moment a capture order is issued, waits for the planter to
    // start approaching, and closes after the grace window when he never does.
    const openState = nextPointOpenState({
      owner: strategicPoint.owner,
      beingCaptured,
      orderedCapture: planterDistances.has(id),
      planterDistance: planterDistances.get(id) ?? null,
      deltaTime,
      waited: strategicPoint._openWaited,
      approaching: strategicPoint._openApproaching,
      lastDistance: strategicPoint._openLastDistance,
    });
    strategicPoint._openWaited = openState.waited;
    strategicPoint._openApproaching = openState.approaching;
    strategicPoint._openLastDistance = openState.lastDistance;
    if (meshComponent.model && meshComponent.model._playAnim) {
      const decision = nextStrategicPointAnim({
        owner: strategicPoint.owner,
        beingCaptured: openState.open,
        animState: strategicPoint._animState,
        currentAnim: meshComponent.model._currentAnim,
        progress: strategicPoint.captureProgress,
        planted: strategicPoint.raiseFrom != null,
        raiseFrom: strategicPoint.raiseFrom,
      });
      strategicPoint._animState = decision.state;
      if (decision.scrub != null && meshComponent.model._scrubAnim) {
        meshComponent.model._scrubAnim(decision.play, decision.scrub);
      } else if (decision.play) {
        meshComponent.model._playAnim(decision.play, decision.loop);
      }
    }
    if (meshComponent.model) {
      updatePointFlag(meshComponent.model, {
        faction: capturingFactions.get(id) ?? strategicPoint.faction ?? null,
        show: shouldShowCaptureFlag({
          engaged: capturingSpIds.has(id),
          owner: strategicPoint.owner,
          progress: strategicPoint.captureProgress,
          planted: strategicPoint.raiseFrom != null,
        }),
      });
    }
    if (strategicPoint.researchQueue && strategicPoint.researchQueue.length > 0) {
      const item = strategicPoint.researchQueue[0];
      item.progress += deltaTime;
      if (item.progress >= item.total) {
        strategicPoint.researchQueue.shift();
        if (item.key === 'fortified_position') {
          strategicPoint.lpTier = 2;
        } else if (item.key === 'heavily_fortified_position') {
          strategicPoint.lpTier = 3;
        }
        updateHUD();
      }
    }
  }
}


export function _strategicPointUpdateOwner(world: any, spId: number, strategicPoint: any, faction: any = null) {
  let newOwner = null;
  if (strategicPoint.captureProgress >= 1) {
    newOwner = 'blue';
  } else if (strategicPoint.captureProgress <= -1) {
    newOwner = 'red';
  }
  if (newOwner !== strategicPoint.owner) {
    strategicPoint.owner = newOwner;
    strategicPoint.faction = newOwner == null ? null : faction;
    const meshComponent = world.get(spId, 'mesh');
    if (meshComponent && meshComponent.gemMat) {
      if (strategicPoint.owner === 'blue') {
        meshComponent.gemMat.color.setRGB(.13, .4, 1);
        meshComponent.gemMat.emissive.setRGB(0, 0.07, .27);
        meshComponent.gemMat.emissiveIntensity = 2;
      } else if (strategicPoint.owner === 'red') {
        meshComponent.gemMat.color.setRGB(.87, .13, .07);
        meshComponent.gemMat.emissive.setRGB(.33, 0, 0);
        meshComponent.gemMat.emissiveIntensity = 2;
      } else {
        meshComponent.gemMat.color.setRGB(1, 1, 1);
        meshComponent.gemMat.emissive.setRGB(.2, .2, .2);
        meshComponent.gemMat.emissiveIntensity = 1;
      }
    }
  }
  const meshComponent = world.get(spId, 'mesh');
  updateStrategicPointOwnershipRim(meshComponent?.model, strategicPoint.owner != null);
}
