import * as THREE from 'three';
import { updateHUD } from '../hud.js';
import {
  _stopTargetPulse,
  camera,
  canCommand,
  hoveredEnemySquad,
  pickAt,
  projectToScreen,
  scene,
  selBuilder,
  selBuildings,
  selListeningPost,
  selSquads,
  setHoveredEnemySquad,
  setSelBuilder,
  setSelBuildings,
  setSelListeningPost,
  setSelSquads,
  world,
} from '../scene.js';
import {
  disposeObj,
  isGroundMesh,
  mkBox,
  mkCylinder,
  mkLineSystem,
} from '../three-helpers.js';
import { selEnd, selStart } from './camera.js';


export function raycastGround(sx, sy) {
  if (!scene || !camera) return null;
  const hit = pickAt(sx, sy, (m) => isGroundMesh(m, scene._ground));
  return hit.hit ? hit.pickedPoint.clone() : null;
}


export function pickMesh(sx, sy) {
  if (!scene || !camera) return null;
  const hit = pickAt(sx, sy, (m) => {
    if (m === scene._ground || m.name === 'grid' || m.name.startsWith('hp') || m.name.startsWith('capring') || m.name.startsWith('sel')) {
      return false;
    }
    return true;
  });
  return hit.hit ? { mesh: hit.pickedMesh, meta: hit.pickedMesh?.userData } : null;
}

// First-person target pick: the FPS eye sits inside/near the ridden
// soldier, so the center ray can strike the shooter before the enemy. Skip
// the ridden squad entirely, then accept the first remaining mesh. A small
// crosshair tolerance keeps near-miss clicks from silently doing nothing.
export const FPS_PICK_OFFSETS = [
  [0, 0], [7, 0], [-7, 0], [0, 7], [0, -7], [13, 0], [-13, 0], [0, 13], [0, -13],
];

export function pickFpsTargetMesh(sx, sy, mySquadId, scope = null) {
  const scopeScene = scope?.scene ?? scene;
  for (const [dx, dy] of FPS_PICK_OFFSETS) {
    const hit = pickAt(sx + dx, sy + dy, (m) => {
      if (m === scopeScene?._ground || m.name === 'grid' || m.name.startsWith('hp') || m.name.startsWith('capring') || m.name.startsWith('sel')) {
        return false;
      }
      const meta = m.userData || {};
      if (meta.squadEntityId !== undefined && meta.squadEntityId === mySquadId) {
        return false;
      }
      if (meta.soldierEntityId !== undefined) {
        const sid = world?.get(meta.soldierEntityId, 'soldier')?.squadId;
        if (sid !== undefined && sid === mySquadId) {
          return false;
        }
      }
      return true;
    }, scope);
    if (hit.hit) {
      return { mesh: hit.pickedMesh, meta: hit.pickedMesh?.userData };
    }
  }
  return null;
}


export function clearEnemySelection() {
  _stopTargetPulse();
  if (hoveredEnemySquad !== null && world.has(hoveredEnemySquad, 'squad')) {
    const squad = world.get(hoveredEnemySquad, 'squad');
    squad?.soldiers.forEach((sid) => {
      if (sid === null) return;
      const mesh = world.get(sid, 'mesh');
      if (mesh?.root?._selMat) mesh.root._selMat.opacity = 0; mesh.root._selMat.transparent = true;
      if (mesh?.root?._selDisc) {
        mesh.root._selDisc.visible = false;
        mesh.root._selDisc.visible = false;
      }
    });
  }
  setHoveredEnemySquad(null);
}


export function clearSelection() {
  if (selBuilder !== null) {
    const builderMesh = world.get(selBuilder, 'mesh');
    if (builderMesh?.root?._selMat) builderMesh.root._selMat.opacity = 0; builderMesh.root._selMat.transparent = true;
    if (builderMesh?.root?._selDisc) {
      builderMesh.root._selDisc.visible = false;
      builderMesh.root._selDisc.visible = false;
    }
  }
  setSelBuilder(null);

  selBuildings.forEach((id) => {
    if (world.has(id, 'airfield')) _setAirfieldSelected(world, id, false);
    else setBuildingSelected(world, id, false);
  });
  setSelBuildings([]);

  selSquads.forEach((sid) => {
    if (world.has(sid, 'squad')) setSquadSelected(world, sid, false);
    if (world.has(sid, 'apc')) setApcSelected(world, sid, false);
    if (world.has(sid, 'vehicle')) setVehicleSelected(world, sid, false);
    if (world.has(sid, 'jet')) setJetSelected(world, sid, false);
  });
  setSelSquads([]);
  setSelListeningPost(null);

  clearEnemySelection();
}


export function setSquadSelected(worldRef, sid, value) {
  const squad = worldRef.get(sid, 'squad');
  if (!squad) return;
  squad.selected = value;
  squad.soldiers.forEach((sid2) => {
    if (sid2) {
      const smc = worldRef.get(sid2, 'mesh');
      if (smc) {
        smc.root._selMat.opacity = value ? 0.9 : 0;
        smc.root._selMat.transparent = true;
        if (smc.root._selDisc) {
          smc.root._selDisc.visible = value;
          smc.root._selDisc.visible = value;
        }
      }
    }
  });
}


export function setBuildingSelected(worldRef, id, value) {
  const building = worldRef.get(id, 'building') || worldRef.get(id, 'structure');
  if (!building) return;
  building.selected = value;
  const mc = worldRef.get(id, 'mesh');
  if (mc?.root?._ringMat) mc.root._ringMat.opacity = value ? 0.9 : 0; mc.root._ringMat.transparent = true;
  if (mc?.root?._ring) {
    mc.root._ring.visible = value;
    mc.root._ring.visible = value;
  }
  if (value) {
    // eslint-disable-next-line no-use-before-define
    if (building.rallyPoint) updateRallyMarker(id, building);
  } else {
    // eslint-disable-next-line no-use-before-define
    clearRallyMarker(id);
  }
}


export function setApcSelected(worldRef, id, value) {
  const apc = worldRef.get(id, 'apc');
  if (!apc) return;
  apc.selected = value;
  const mc = worldRef.get(id, 'mesh');
  if (mc?.root?._selMat) {
    mc.root._selMat.opacity = value ? 0.5 : 0;
    mc.root._selMat.transparent = true;
  }
  if (mc?.root?._selDisc) {
    mc.root._selDisc.visible = value;
    mc.root._selDisc.visible = value;
  }
}


export function setVehicleSelected(worldRef, id, value) {
  const vehicle = worldRef.get(id, 'vehicle');
  if (!vehicle) return;
  vehicle.selected = value;
  const mc = worldRef.get(id, 'mesh');
  if (mc?.root?._selMat) {
    mc.root._selMat.opacity = value ? 0.5 : 0;
    mc.root._selMat.transparent = true;
  }
  if (mc?.root?._selDisc) {
    mc.root._selDisc.visible = value;
    mc.root._selDisc.visible = value;
  }
}


export function setJetSelected(worldRef, id, value) {
  const jet = worldRef.get(id, 'jet');
  if (!jet) return;
  jet.selected = value;
  const mc = worldRef.get(id, 'mesh');
  if (mc?.root?._selMat) {
    mc.root._selMat.opacity = value ? 0.9 : 0;
    mc.root._selMat.transparent = true;
  }
  if (mc?.root?._selRing) {
    mc.root._selRing.visible = value;
    mc.root._selRing.visible = value;
  }
}


export function _setAirfieldSelected(worldRef, id, value) {
  const airfield = worldRef.get(id, 'airfield');
  if (!airfield) return;
  airfield.selected = value;
  const mc = worldRef.get(id, 'mesh');
  if (mc?.root?._ringMat) mc.root._ringMat.opacity = value ? 0.9 : 0; mc.root._ringMat.transparent = true;
  if (mc?.root?._ring) {
    mc.root._ring.visible = value;
    mc.root._ring.visible = value;
  }
  if (value) {
    // eslint-disable-next-line no-use-before-define
    if (airfield.rallyPoint) updateAirfieldRallyMarker(id, airfield);
  } else {
    // eslint-disable-next-line no-use-before-define
    clearAirfieldRallyMarker(id);
  }
}


export const _rallyMeshes = new Map();

export function updateRallyMarker(bid, building) {
  if (_rallyMeshes.has(bid)) {
    const old = _rallyMeshes.get(bid);
    disposeObj(old.flag);
    disposeObj(old.line);
  }
  if (!building.rallyPoint) {
    _rallyMeshes.delete(bid);
    return;
  }
  const { rallyPoint } = building;
  const bp = building.position;
  const pole = mkCylinder(`rally_pole_${bid}`, 0.08, 0.08, 1.4, 6);
  pole.position.set(rallyPoint.x, 0.7, rallyPoint.z);
  const poleMat = new THREE.MeshBasicMaterial();
  poleMat.color = new THREE.Color(0.5, 0.5, 0.5);
  pole.material = poleMat;
  pole.userData.pickable = false;
  const flag = mkBox(`rally_flag_${bid}`, 0.55, 0.32, 0.04);
  flag.position.set(rallyPoint.x + 0.27, 1.55, rallyPoint.z);
  const flagMat = new THREE.MeshBasicMaterial();
  flagMat.color = new THREE.Color(0, 0.6, 0.15);
  flag.material = flagMat;
  flag.userData.pickable = false;
  const lines = [];
  const cols = [];
  const dashColor = new THREE.Color(0.1, 0.9, 0.3);
  for (let i = 0; i < 12; i += 1) {
    const t0 = (i + 0.1) / 12;
    const t1 = (i + 0.6) / 12;
    lines.push([
      new THREE.Vector3(bp.x + (rallyPoint.x - bp.x) * t0, 0.06, bp.z + (rallyPoint.z - bp.z) * t0),
      new THREE.Vector3(bp.x + (rallyPoint.x - bp.x) * t1, 0.06, bp.z + (rallyPoint.z - bp.z) * t1),
    ]);
    cols.push([dashColor, dashColor]);
  }
  const line = mkLineSystem(`rally_line_${bid}`, lines, cols, 0.7);
  line.userData.pickable = false;
  _rallyMeshes.set(bid, { pole, flag, line });
}


export function clearRallyMarker(bid) {
  if (_rallyMeshes.has(bid)) {
    const m = _rallyMeshes.get(bid);
    disposeObj(m.pole);
    disposeObj(m.flag);
    disposeObj(m.line);
    _rallyMeshes.delete(bid);
  }
}


export const _afRallyMeshes = new Map();

export function updateAirfieldRallyMarker(afid, airfield) {
  if (_afRallyMeshes.has(afid)) {
    const old = _afRallyMeshes.get(afid);
    disposeObj(old.pole);
    disposeObj(old.flag);
    disposeObj(old.line);
  }
  if (!airfield.rallyPoint) {
    _afRallyMeshes.delete(afid);
    return;
  }
  const { rallyPoint } = airfield;
  const bp = airfield.position;
  const pole = mkCylinder(`afr_pole_${afid}`, 0.08, 0.08, 1.4, 6);
  pole.position.set(rallyPoint.x, 0.7, rallyPoint.z);
  const poleMat = new THREE.MeshBasicMaterial();
  poleMat.color = new THREE.Color(0.5, 0.5, 0.5);
  pole.material = poleMat;
  pole.userData.pickable = false;
  const flag = mkBox(`afr_flag_${afid}`, 0.55, 0.32, 0.04);
  flag.position.set(rallyPoint.x + 0.27, 1.55, rallyPoint.z);
  const flagMat = new THREE.MeshBasicMaterial();
  flagMat.color = new THREE.Color(0, 0.25, 0.6);
  flag.material = flagMat;
  flag.userData.pickable = false;
  const dashColor = new THREE.Color(0.1, 0.6, 1);
  const lines = [];
  const cols = [];
  for (let i = 0; i < 12; i += 1) {
    const t0 = (i + 0.1) / 12;
    const t1 = (i + 0.6) / 12;
    lines.push([
      new THREE.Vector3(bp.x + (rallyPoint.x - bp.x) * t0, 0.06, bp.z + (rallyPoint.z - bp.z) * t0),
      new THREE.Vector3(bp.x + (rallyPoint.x - bp.x) * t1, 0.06, bp.z + (rallyPoint.z - bp.z) * t1),
    ]);
    cols.push([dashColor, dashColor]);
  }
  const line = mkLineSystem(`afr_line_${afid}`, lines, cols, 0.7);
  line.userData.pickable = false;
  _afRallyMeshes.set(afid, { pole, flag, line });
}


export function clearAirfieldRallyMarker(afid) {
  if (_afRallyMeshes.has(afid)) {
    const m = _afRallyMeshes.get(afid);
    disposeObj(m.pole);
    disposeObj(m.flag);
    disposeObj(m.line);
    _afRallyMeshes.delete(afid);
  }
}


export function doClickSelect(sx, sy, additive) {
  const hit = pickMesh(sx, sy);
  if (!additive) clearSelection();

  if (!hit || !hit.meta) {
    updateHUD();
    return;
  }

  const { meta } = hit;

  // ── BUILDER ────────────────────────────────────────────────────────────────
  if (meta.builderEntityId !== undefined) {
    const id = meta.builderEntityId;
    setSelListeningPost(null);
    if (additive) {
      if (selBuilder === id) {
        setSelBuilder(null);
        const mc = world.get(id, 'mesh');
        if (mc?.root?._selMat) mc.root._selMat.opacity = 0; mc.root._selMat.transparent = true;
        if (mc?.root?._selDisc) {
          mc.root._selDisc.visible = false;
          mc.root._selDisc.visible = false;
        }
      } else {
        setSelBuilder(id);
        const mc = world.get(id, 'mesh');
        if (mc?.root?._selMat) mc.root._selMat.opacity = 0.9; mc.root._selMat.transparent = true;
        if (mc?.root?._selDisc) {
          mc.root._selDisc.visible = true;
          mc.root._selDisc.visible = true;
        }
      }
    } else {
      setSelBuilder(id);
      const mc = world.get(id, 'mesh');
      if (mc?.root?._selMat) mc.root._selMat.opacity = 0.9; mc.root._selMat.transparent = true;
      if (mc?.root?._selDisc) {
        mc.root._selDisc.visible = true;
        mc.root._selDisc.visible = true;
      }
    }
  }

  // ── BUILDINGS & STRUCTURES ─────────────────────────────────────────────────
  else if (meta.buildingEntityId !== undefined || meta.structureEntityId !== undefined || meta.airfieldEntityId !== undefined) {
    const id = meta.buildingEntityId ?? meta.structureEntityId ?? meta.airfieldEntityId;
    const isAirfield = meta.airfieldEntityId !== undefined;
    setSelListeningPost(null);

    if (additive) {
      const idx = selBuildings.indexOf(id);
      if (idx >= 0) {
        if (isAirfield) _setAirfieldSelected(world, id, false);
        else setBuildingSelected(world, id, false);
        selBuildings.splice(idx, 1);
      } else {
        if (isAirfield) _setAirfieldSelected(world, id, true);
        else setBuildingSelected(world, id, true);
        selBuildings.push(id);
      }
    } else {
      setSelBuildings([id]);
      if (isAirfield) _setAirfieldSelected(world, id, true);
      else setBuildingSelected(world, id, true);
    }
  }

  // ── JETS, APCs, VEHICLES & SQUADS ──────────────────────────────────────────
  else if (meta.jetEntityId !== undefined || meta.apcEntityId !== undefined || meta.vehicleEntityId !== undefined || meta.squadEntityId !== undefined || meta.soldierEntityId !== undefined) {
    let sid = meta.jetEntityId ?? meta.apcEntityId ?? meta.vehicleEntityId ?? meta.squadEntityId;
    if (sid === undefined && meta.soldierEntityId !== undefined) {
      sid = world.get(meta.soldierEntityId, 'soldier')?.squadId;
    }

    if (sid !== undefined) {
      const isJet = world.has(sid, 'jet');
      const isApc = world.has(sid, 'apc');
      const isVehicle = world.has(sid, 'vehicle');
      const isSquad = world.has(sid, 'squad');
      const entity = world.get(sid, 'jet') ?? world.get(sid, 'apc') ?? world.get(sid, 'vehicle') ?? world.get(sid, 'squad');
      setSelListeningPost(null);

      if (entity && canCommand(entity.team)) {
        if (additive) {
          const idx = selSquads.indexOf(sid);
          if (idx >= 0) {
            if (isJet) setJetSelected(world, sid, false);
            else if (isApc) setApcSelected(world, sid, false);
            else if (isVehicle) setVehicleSelected(world, sid, false);
            else if (isSquad) setSquadSelected(world, sid, false);
            selSquads.splice(idx, 1);
          } else {
            if (isJet) setJetSelected(world, sid, true);
            else if (isApc) setApcSelected(world, sid, true);
            else if (isVehicle) setVehicleSelected(world, sid, true);
            else if (isSquad) setSquadSelected(world, sid, true);
            selSquads.push(sid);
          }
        } else {
          setSelSquads([sid]);
          if (isJet) setJetSelected(world, sid, true);
          else if (isApc) setApcSelected(world, sid, true);
          else if (isVehicle) setVehicleSelected(world, sid, true);
          else if (isSquad) setSquadSelected(world, sid, true);
        }
      } else if (entity && !canCommand(entity.team) && isSquad) {
        // Enemy squad selection (only squads for now)
        clearEnemySelection();
        setHoveredEnemySquad(sid);
        entity.soldiers.forEach((soldierId) => {
          if (!soldierId) return;
          const mc = world.get(soldierId, 'mesh');
          if (mc?.root?._selMat) mc.root._selMat.opacity = 0.85; mc.root._selMat.transparent = true;
          if (mc?.root?._selDisc) {
            mc.root._selDisc.visible = true;
            mc.root._selDisc.visible = true;
          }
        });
      }
    }
  }

  // ── LISTENING POST ──────────────────────────────────────────────────────────
  else if (meta.listeningPostEntityId !== undefined) {
    const spId = meta.listeningPostEntityId;
    const sp = world.get(spId, 'strategicPoint');
    if (sp && sp.hasListeningPost && canCommand(sp.owner)) {
      if (additive && selListeningPost === spId) {
        setSelListeningPost(null);
      } else {
        setSelListeningPost(spId);
      }
    }
  }

  // ── STRATEGIC POINTS ───────────────────────────────────────────────────────
  else if (meta.strategicPointEntityId !== undefined) {
    const spId = meta.strategicPointEntityId;
    const sp = world.get(spId, 'strategicPoint');
    // If a builder is selected, right-click (or regular click if we want) could order it
    if (selBuilder !== null && world.has(selBuilder, 'builder') && canCommand(sp?.owner) && !sp.hasListeningPost) {
      const bld = world.get(selBuilder, 'builder');
      bld.buildTargetSP = spId;
      bld.moveTarget = sp.position.clone().add(new THREE.Vector3(3, 0, 0));
      bld.isBuilding = false;
    }
  }

  updateHUD();
}


export function doBoxSelect() {
  if (!world) return;
  const x0 = Math.min(selStart.x, selEnd.x);
  const x1 = Math.max(selStart.x, selEnd.x);
  const y0 = Math.min(selStart.y, selEnd.y);
  const y1 = Math.max(selStart.y, selEnd.y);
  clearSelection();

  const proj = (wpos, yoff = 1) => projectToScreen(wpos.x, wpos.y + yoff, wpos.z);

  const foundBuilders = [];
  world.query('builder', 'mesh').forEach((id) => {
    const mc = world.get(id, 'mesh');
    if (!mc) return;
    const { sx, sy } = proj(mc.root.position);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) foundBuilders.push(id);
  });

  const foundSquads = [];
  world.query('squad', 'mesh').forEach((sid) => {
    const squad = world.get(sid, 'squad');
    if (!squad || !canCommand(squad.team)) return;
    const inApc = world.query('apc').some((aid) => world.get(aid, 'apc')?.passengers.includes(sid));
    if (inApc) return;

    let hit = false;
    const alive = squad.soldiers.filter((sid2) => sid2 !== null && world.has(sid2, 'soldier'));
    if (alive.length > 0) {
      for (let i = 0; i < alive.length; i += 1) {
        const sid2 = alive[i];
        const mc = world.get(sid2, 'mesh');
        if (mc) {
          const { sx, sy } = proj(mc.root.position, 0);
          if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) {
            hit = true;
            break;
          }
        }
      }
    } else {
      const { sx, sy } = proj(squad.position);
      if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) hit = true;
    }
    if (hit) foundSquads.push(sid);
  });

  const foundApcs = [];
  world.query('apc', 'mesh').forEach((id) => {
    const apc = world.get(id, 'apc');
    const mc = world.get(id, 'mesh');
    if (!apc || !canCommand(apc.team) || !mc) return;
    const { sx, sy } = proj(apc.position, 2);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) foundApcs.push(id);
  });

  const foundVehicles = [];
  world.query('vehicle', 'mesh').forEach((id) => {
    const vehicle = world.get(id, 'vehicle');
    const mc = world.get(id, 'mesh');
    if (!vehicle || !canCommand(vehicle.team) || !mc) return;
    const { sx, sy } = proj(vehicle.position, 2);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) foundVehicles.push(id);
  });

  const foundJets = [];
  world.query('jet', 'mesh').forEach((id) => {
    const jet = world.get(id, 'jet');
    const mc = world.get(id, 'mesh');
    if (!jet || !canCommand(jet.team) || !mc) return;
    const { sx, sy } = proj(jet.position, 2);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) foundJets.push(id);
  });

  // Prioritization: if any units are found, ignore buildings
  if (foundSquads.length > 0 || foundBuilders.length > 0 || foundApcs.length > 0 || foundVehicles.length > 0 || foundJets.length > 0) {
    foundBuilders.forEach((id) => {
      setSelBuilder(id);
      const mc = world.get(id, 'mesh');
      if (mc) {
        mc.root._selMat.opacity = 0.9;
        mc.root._selMat.transparent = true;
        if (mc.root._selDisc) {
          mc.root._selDisc.visible = true;
          mc.root._selDisc.visible = true;
        }
      }
    });
    foundSquads.forEach((sid) => {
      setSquadSelected(world, sid, true);
      selSquads.push(sid);
    });
    foundApcs.forEach((id) => {
      const apc = world.get(id, 'apc');
      const mc = world.get(id, 'mesh');
      if (apc) apc.selected = true;
      if (mc?.root?._selMat) mc.root._selMat.opacity = 0.5; mc.root._selMat.transparent = true;
      selSquads.push(id);
    });
    foundVehicles.forEach((id) => {
      const vehicle = world.get(id, 'vehicle');
      const mc = world.get(id, 'mesh');
      if (vehicle) vehicle.selected = true;
      if (mc?.root?._selMat) mc.root._selMat.opacity = 0.5; mc.root._selMat.transparent = true;
      selSquads.push(id);
    });
    foundJets.forEach((id) => {
      const jet = world.get(id, 'jet');
      const mc = world.get(id, 'mesh');
      if (jet) jet.selected = true;
      if (mc?.root?._selMat) mc.root._selMat.opacity = 0.9; mc.root._selMat.transparent = true;
      selSquads.push(id);
    });
    updateHUD();
    return;
  }

  // If no units, look for buildings/structures
  world.query('building', 'mesh').forEach((id) => {
    const bld = world.get(id, 'building');
    if (!bld) return;
    const { sx, sy } = proj(bld.position, 2);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) {
      setBuildingSelected(world, id, true);
      selBuildings.push(id);
    }
  });

  world.query('structure', 'mesh').forEach((id) => {
    const str = world.get(id, 'structure');
    if (!str) return;
    const { sx, sy } = proj(str.position, 2);
    if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) {
      setBuildingSelected(world, id, true);
      selBuildings.push(id);
    }
  });

  updateHUD();
}
