import { updateHUD } from '../hud.js';
import { nextStrategicPointAnim, shouldShowCaptureFlag, updatePointFlag } from '../meshes.js';
import { world } from '../scene.js';
import { decayedCaptureProgress } from '../soldier-aim.js';
import { _snapMeshToTerrain, _snapTerrainBegin } from './terrain.js';


export function systemStrategicPoint(world, deltaTime) {
  const capturingSpIds = new Set();
  const capturingFactions = new Map();
  for (const squadId of world.query('squad')) {
    const squad = world.get(squadId, 'squad');
    if (squad?.capturingSpId != null) {
      capturingSpIds.add(squad.capturingSpId);
      if (!capturingFactions.has(squad.capturingSpId)) {
        capturingFactions.set(squad.capturingSpId, squad.faction);
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
    if (meshComponent.model && meshComponent.model._playAnim) {
      const decision = nextStrategicPointAnim({
        owner: strategicPoint.owner,
        beingCaptured,
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


export function _strategicPointUpdateOwner(world, spId, strategicPoint, faction = null) {
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
  if (meshComponent && meshComponent.capRing && meshComponent.capRingMat) {
    const time = (strategicPoint.captureProgress + 1) / 2;
    const r = time > .5 ? 0.13 : 0.87;
    const g = time > .5 ? 0.4 : 0.13;
    const b = time > .5 ? 1 : 0.07;
    meshComponent.capRingMat.color.setRGB(r, g, b);
    meshComponent.capRingMat.opacity = .35 + .45 * Math.abs(strategicPoint.captureProgress);
    meshComponent.capRingMat.transparent = true;
    const scale = .3 + .7 * Math.abs(strategicPoint.captureProgress);
    meshComponent.capRing.scale.set(scale, 1, scale);
  }
}
