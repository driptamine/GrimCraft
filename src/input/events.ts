import * as THREE from 'three';
import { DEFAULT_CAMERA_ALPHA, DEFAULT_CAMERA_BETA, DEFAULT_CAMERA_RADIUS, applyZoom } from '../render/camera-zoom.js';
import {
  cursorCss,
  getModalCursor,
  preloadCursors,
  resolveCursor,
  withinHoverRadius,
} from '../ui/cursors.js';
import { preloadTaskbarIcons } from '../ui/taskbar-icons.js';
import { updateHUD } from '../core/hud.js';
import { reinforceSelectedSquads } from '../core/reinforce.js';
import { buildMenuOpen, setBuildMenuOpen } from '../hud/store.js';
import {
  buildMode,
  camera,
  canCommand,
  canvas,
  hoveredEnemySquad,
  paused,
  scene,
  selBuilder,
  selSquads,
  setPaused,
  setSelBuilder,
  set_hoverEnemySquad,
  world,
  addBeforeRender,
  removeBeforeRender,
} from '../core/scene.js';
import { createUnitHover, syncUnitHealthBars, faceHealthBarsToCamera } from '../render/unit-indicators.js';
import { _groundAt } from '../systems/terrain.js';
import { isDecalHoverEnabled } from '../maps/sgb-decals.js';
import { _apcEjectPassengers } from '../core/systems.js';
import { disposeObj } from '../render/three-helpers.js';
import { cancelBuild, setGhostPending } from './build-ghost.js';
import { initTouchControls } from './touch-controls.js';
import {
  POINT_HOVER_RADIUS, POINT_HOVER_SEGMENTS, _hideRangeCircles, _lastGroundPt, _lastHoverPickT, _mouseEntered, _mouseX, _mouseY, _rangeCirclesVisible, altDown, altOrbitLast, isAltOrbiting, isOrbiting, isSelecting, keys, rightDown, rightDragStartPos, rightLastPos, selEnd, selStart,
  setAltDown, setAltOrbitLast, setIsAltOrbiting, setIsOrbiting, setIsSelecting, setLastHoverPickT, setMouseEntered, setMouseX, setMouseY, setRangeCirclesVisible, setRightDown, setRightDragStartPos, setRightLastPos, setSelEnd, setSelStart,
} from './camera.js';
import { _boardSquadOntoApc, _flyArmed, _pendingBuilderCommand, _tryBuilderCommandClick, cancelFlyTargeting, clearBuilderCommand, issueFpsShot, issueRightClick, placeBuild, placeListeningPost, setBuilderCommand } from './orders.js';
import { pendingUnitCommand, clearUnitCommand, setUnitCommand, setSelectedAttackMode, stopSelectedTroops, tryUnitCommandClick } from './unit-commands.js';
import { copyGunPose, fpsAimPoint, fpsLook, initGunPosePanel, isGunEditMode, isShooterMode, setCameraMode, toggleCameraFps, toggleGunEditMode } from '../render/camera-fps.js';
import { clearSelection, doBoxSelect, doClickSelect, pickMesh, raycastGround } from './selection.js';


export const selBoxEl = document.getElementById('selBox') as HTMLElement;

export function updateSelBoxCSS(): void {
  const x = Math.min(selStart.x, selEnd.x);
  const y = Math.min(selStart.y, selEnd.y);
  selBoxEl.style.left = `${x}px`;
  selBoxEl.style.top = `${y}px`;
  selBoxEl.style.width = `${Math.abs(selEnd.x - selStart.x)}px`;
  selBoxEl.style.height = `${Math.abs(selEnd.y - selStart.y)}px`;
}


export function _updateHoverCursor(hit: { meta?: any } | null): void {
  const meta = hit?.meta;
  const repairMode = _pendingBuilderCommand === 'repair';
  let hover: { kind: string; damaged?: boolean } | null = null;
  let hoverApc = null;
  if (meta) {
    const targetId = meta.squadEntityId ?? world.get(meta.soldierEntityId, 'soldier')?.squadId
      ?? meta.builderEntityId ?? meta.apcEntityId ?? meta.vehicleEntityId ?? meta.jetEntityId
      ?? meta.buildingEntityId ?? meta.structureEntityId ?? meta.airfieldEntityId;
    const target = targetId == null ? null
      : world.get(targetId, 'squad') || world.get(targetId, 'builder') || world.get(targetId, 'apc')
        || world.get(targetId, 'vehicle') || world.get(targetId, 'jet') || world.get(targetId, 'building')
        || world.get(targetId, 'structure') || world.get(targetId, 'airfield');
    if (repairMode) {
      const rid = meta.buildingEntityId ?? meta.structureEntityId ?? meta.vehicleEntityId ?? meta.airfieldEntityId;
      if (rid !== undefined) {
        const comp = world.get(rid, 'building') || world.get(rid, 'structure') || world.get(rid, 'vehicle') || world.get(rid, 'airfield');
        if (comp) {
          hover = { kind: 'repairable', damaged: comp.hp < (comp.maxHp || comp.hp) };
        }
      }
    } else if (target?.team && (target.hp == null || target.hp > 0) && isHostileToSelection(world, targetId, target.team)) {
      hover = { kind: 'enemy' };
    } else if (meta.apcEntityId !== undefined) {
      const apc = world.get(meta.apcEntityId, 'apc');
      if (apc && canCommand(apc.team) && apc.passengers.length < apc.maxPassengers) {
        hover = { kind: 'loadable' };
        hoverApc = apc;
      }
    }
  }
  if (!hover && !repairMode && world && _lastGroundPt.valid) {
    // Sole capture-cursor trigger: the ground point under the cursor inside
    // a point's hover circle. Direct hits on tall point meshes (poles, post,
    // console) outside the circle must NOT flip the cursor.
    for (const spId of world.query('strategicPoint')) {
      const c = world.get(spId, 'mesh')?.root?.position;
      if (c && withinHoverRadius(_lastGroundPt.x, _lastGroundPt.z, c.x, c.z, POINT_HOVER_RADIUS)) {
        hover = { kind: 'sp' };
        break;
      }
    }
  }
  const infantrySelected = !!hoverApc && selSquads.some((sid: number) => {
    const squad = world.get(sid, 'squad');
    return squad && canCommand(squad.team) && squad.team === hoverApc.team
      && !world.has(sid, 'apc') && !world.has(sid, 'vehicle')
      && !hoverApc.passengers.includes(sid)
      && squad.position.distanceTo(hoverApc.position) <= 10;
  });
  const name = resolveCursor({
    modal: getModalCursor(),
    buildMode,
    pendingCommand: pendingUnitCommand || _pendingBuilderCommand,
    hover,
    infantrySelected,
  });
  canvas!.style.cursor = name ? cursorCss(name, 'auto') : ((buildMode || _pendingBuilderCommand || pendingUnitCommand || _flyArmed) ? 'crosshair' : cursorCss('default', ''));
}


// Enemy hover highlight relative to the current selection: a hovered squad
// counts as hostile when at least one selected unit sits on another team.
// With no selection this is exactly the non-commandable teams.
export function isHostileToSelection(world: any, hoveredId: number, hoveredTeam: string): boolean {
  if (selSquads.length === 0) {
    return !canCommand(hoveredTeam);
  }
  if (selSquads.includes(hoveredId)) {
    return false;
  }
  return selSquads.some((id: number) => {
    const t = (world.get(id, 'jet') ?? world.get(id, 'apc') ?? world.get(id, 'vehicle') ?? world.get(id, 'squad'))?.team;
    return t && t !== hoveredTeam;
  });
}


let _unitIndicatorsCleanup: (() => void) | null = null;

export function setupPointerEvents(): void {
  initGunPosePanel();
  if (!canvas) return;
  _unitIndicatorsCleanup?.();
  const unitHover = createUnitHover(scene, _groundAt);
  const clearUnitHover = (): void => {
    unitHover.clear();
    set_hoverEnemySquad(null);
  };
  const refreshIndicators = addBeforeRender(() => {
    if (isShooterMode()) unitHover.clear();
    else unitHover.refresh(world);
    syncUnitHealthBars(world, {
      unitIds: selSquads, builderId: selBuilder, enemySquadId: hoveredEnemySquad,
      hoveredUnitId: unitHover.hoveredUnitId,
    });
    faceHealthBarsToCamera(world, camera, _groundAt);
  });
  canvas.addEventListener('pointerleave', clearUnitHover);
  window.addEventListener('blur', clearUnitHover);
  _unitIndicatorsCleanup = () => {
    removeBeforeRender(refreshIndicators);
    window.removeEventListener('blur', clearUnitHover);
    unitHover.dispose();
  };
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  canvas.addEventListener('pointerdown', (event) => {
    if (!canvas) return;
    clearUnitHover();
    // Touch in shooter mode is owned by the touch controls (left stick for
    // movement, right-side drag for look, FIRE button to shoot): letting the
    // mouse path run would fire a shot on every look-drag start.
    if (event.pointerType === 'touch' && isShooterMode()) {
      return;
    }
    if (event.button === 0) {
      // First person: left-click fires instead of selecting. The crosshair
      // is the aim in every case (pointer lock freezes the cursor position,
      // and without lock the cursor is irrelevant to the crosshair), so a
      // missed shot must not start a stale-coordinate selection.
      if (isShooterMode()) {
        const locked = typeof document !== 'undefined' && !!document.pointerLockElement;
        const aim = fpsAimPoint(event.clientX, event.clientY, true, canvas?.getBoundingClientRect?.());
        if (issueFpsShot(aim.x, aim.y)) {
          return;
        }
        if (locked) {
          return;
        }
      }
      if (buildMode) return;
      if (altDown) {
        setIsAltOrbiting(true);
        setAltOrbitLast({ x: event.clientX, y: event.clientY });
        canvas.style.cursor = 'grabbing';
        canvas.setPointerCapture(event.pointerId);
        return;
      }
      if (pendingUnitCommand) return;
      setIsSelecting(true);
      canvas.setPointerCapture(event.pointerId);
      setSelStart({ x: event.clientX, y: event.clientY });
      setSelEnd({ x: event.clientX, y: event.clientY });
      selBoxEl.style.display = 'block';
      updateSelBoxCSS();
    } else if (event.button === 2) {
      if (pendingUnitCommand && pendingUnitCommand !== 'melee') clearUnitCommand();
      if (_pendingBuilderCommand && _pendingBuilderCommand !== 'melee') {
        clearBuilderCommand();
      }
      if (buildMode) {
        cancelBuild();
        return;
      }
      setRightDown(true);
      canvas.setPointerCapture(event.pointerId);
      setIsOrbiting(false);
      setRightDragStartPos({ x: event.clientX, y: event.clientY });
      setRightLastPos({ x: event.clientX, y: event.clientY });
      if (pendingUnitCommand === 'melee' || _pendingBuilderCommand === 'melee') return;
      const selectedApcs = selSquads.filter((id: number) => world.get(id, 'apc') != null);
      if (selectedApcs.length) {
        const point = raycastGround(event.clientX, event.clientY);
        if (point) {
          selectedApcs.forEach((id) => {
            const apc = world.get(id, 'apc');
            if (apc) apc.moveOrder = new THREE.Vector3(point.x, 0, point.z);
          });
        }
      }
      const selectedVehicles = selSquads.filter((id: number) => world.get(id, 'vehicle') != null);
      if (selectedVehicles.length) {
        const point = raycastGround(event.clientX, event.clientY);
        if (point) {
          selectedVehicles.forEach((id) => {
            const vehicle = world.get(id, 'vehicle');
            if (vehicle) vehicle.moveOrder = new THREE.Vector3(point.x, 0, point.z);
          });
        }
      }
    }
  });
  function _updateCursorCoords(sx: number, sy: number): void {
    const pt = raycastGround(sx, sy);
    _lastGroundPt.valid = !!pt;
    if (pt) {
      _lastGroundPt.x = pt.x;
      _lastGroundPt.z = pt.z;
    }
    const el = document.getElementById('cursorCoords');
    if (!el) return;
    if (pt) {
      el.textContent = `x: ${Math.round(pt.x)}  z: ${Math.round(pt.z)}   (${pt.x.toFixed(1)}, ${pt.z.toFixed(1)})`;
    } else {
      el.textContent = 'x: –  z: –';
    }
  }
  let _decalHoverEl: HTMLElement | null = null;
  function _decalHoverTip(): HTMLElement | null {
    if (!_decalHoverEl) {
      _decalHoverEl = document.getElementById('decalHoverTip');
    }
    return _decalHoverEl;
  }
  function _updateDecalHover(hit: { mesh?: THREE.Object3D; meta?: any } | null, sx: number, sy: number): void {
    const tip = _decalHoverTip();
    if (!tip) return;
    if (!isDecalHoverEnabled()) {
      tip.style.display = 'none';
      return;
    }
    let name = '';
    if (hit?.mesh) {
      const n = hit.mesh.name || '';
      if (n.startsWith('SGB_Decal') && hit.mesh.userData?.decalPath) {
        name = hit.mesh.userData.decalPath.replace(/^art\/decals\//, '');
      }
    }
    if (!name) {
      tip.style.display = 'none';
      return;
    }
    tip.textContent = '◈ ' + name;
    tip.style.display = 'block';
    tip.style.left = (sx + 14) + 'px';
    tip.style.top = (sy + 14) + 'px';
  }
  let _pointBaseTarget: number | null = null;
  let _pointBaseOutline: THREE.Line | null = null;
  function _clearPointBaseOutline(): void {
    if (_pointBaseOutline) {
      disposeObj(_pointBaseOutline);
      _pointBaseOutline = null;
    }
    _pointBaseTarget = null;
  }
  function _makeHoverRing(): THREE.Line {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((POINT_HOVER_SEGMENTS + 1) * 3), 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff }));
    // positions rewrite in place: stale bounds would frustum-pop the ring
    line.frustumCulled = false;
    return line;
  }
  function _updateHoverRing(line: THREE.Line, cx: number, cy: number, cz: number): void {
    const p = line.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= POINT_HOVER_SEGMENTS; i += 1) {
      const a = (i / POINT_HOVER_SEGMENTS) * Math.PI * 2;
      p.setXYZ(i, cx + Math.cos(a) * POINT_HOVER_RADIUS, cy, cz + Math.sin(a) * POINT_HOVER_RADIUS);
    }
    p.needsUpdate = true;
  }
  // White flat 2D ring around a strategic point/relic, shown only while
  // the ground point under the cursor is inside POINT_HOVER_RADIUS of the
  // entity root. Direct hits on tall point meshes (poles, post, console)
  // outside the circle must NOT draw the ring. Centered on the entity root.
  function _updatePointBaseHover(): void {
    let target = null;
    let center = null;
    if (world && _lastGroundPt.valid) {
      for (const spId of world.query('strategicPoint')) {
        const mc = world.get(spId, 'mesh');
        const c = mc?.root?.position;
        if (c && withinHoverRadius(_lastGroundPt.x, _lastGroundPt.z, c.x, c.z, POINT_HOVER_RADIUS)) {
          target = spId;
          center = c;
          break;
        }
      }
    }
    if (target === _pointBaseTarget) {
      // keep the ring glued if the point moved (terrain snap / raise anim)
      if (_pointBaseOutline && center) _updateHoverRing(_pointBaseOutline, center.x, center.y + 0.1, center.z);
      return;
    }
    _clearPointBaseOutline();
    if (target && center) {
      _pointBaseTarget = target;
      _pointBaseOutline = _makeHoverRing();
      _updateHoverRing(_pointBaseOutline, center.x, center.y + 0.1, center.z);
      scene.add(_pointBaseOutline);
    }
  }
  let _hoverBuildingRoot: THREE.Object3D | null = null;
  let _hoverBuildingOutline: THREE.Line | null = null;
  const _hoverFootBox = new THREE.Box3();
  function _makeFootRect(): THREE.Line {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15), 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    // positions rewrite in place: stale bounds would frustum-pop the rect
    line.frustumCulled = false;
    return line;
  }
  function _updateFootRect(line: THREE.Line, target: THREE.Object3D): void {
    _hoverFootBox.setFromObject(target);
    // flat XZ footprint at the snapped base height + lift (above decal sheets)
    const y = target.position.y + 0.1;
    const p = line.geometry.attributes.position as THREE.BufferAttribute;
    const x0 = _hoverFootBox.min.x, x1 = _hoverFootBox.max.x;
    const z0 = _hoverFootBox.min.z, z1 = _hoverFootBox.max.z;
    p.setXYZ(0, x0, y, z0);
    p.setXYZ(1, x1, y, z0);
    p.setXYZ(2, x1, y, z1);
    p.setXYZ(3, x0, y, z1);
    p.setXYZ(4, x0, y, z0);
    p.needsUpdate = true;
  }
  function _clearBuildingOutline(): void {
    if (_hoverBuildingOutline) {
      disposeObj(_hoverBuildingOutline);
      _hoverBuildingOutline = null;
    }
    _hoverBuildingRoot = null;
  }
  // Re-resolve the enemy hover highlight and cursor for a picked hit.
  // Used by pointermove and — after right-click orders, which clear hover
  // state on pointerdown — by pointerup, so the enemy torus and the attack
  // cursor do not stay gone until the next mouse motion.
  function _refreshHoverState(hit: { meta?: any } | null): void {
    _updateHoverCursor(hit);
    unitHover.update(world, hit?.meta || null, (id, team) => isHostileToSelection(world, id, team));
    let hoveredSquadId = null;
    if (hit?.meta) {
      const sid = hit.meta.squadEntityId !== undefined ? hit.meta.squadEntityId : world.get(hit.meta.soldierEntityId, 'soldier')?.squadId;
      if (sid !== undefined) {
        const squad = world.get(sid, 'squad');
        if (squad && isHostileToSelection(world, sid, squad.team)) hoveredSquadId = sid;
      }
    }
    set_hoverEnemySquad(hoveredSquadId);
  }
  // Pause indicator; the sim block in game.ts already stops on `paused`.
  function setPausedBanner(visible: boolean): void {
    let banner = document.getElementById('game-paused-banner');
    if (visible && !banner) {
      banner = document.createElement('div');
      banner.id = 'game-paused-banner';
      banner.textContent = '⏸ ПАУЗА — Shift чтобы продолжить';
      banner.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:10001;padding:8px 18px;background:#101827ee;border:1px solid #879eff;color:#e4edff;font:14px sans-serif;border-radius:6px;pointer-events:none;';
      document.body.append(banner);
    } else if (!visible && banner) {
      banner.remove();
    }
  }
  // Green flat 2D footprint rectangle on the whole hovered
  // building/structure/airfield (entity mesh root, not the hit child mesh).
  function _updateBuildingHover(hit: { mesh?: THREE.Object3D; meta?: any } | null): void {
    let target = null;
    const meta = hit?.meta;
    const id = meta?.buildingEntityId ?? meta?.structureEntityId ?? meta?.airfieldEntityId;
    if (id !== undefined) {
      const mc = world.get(id, 'mesh');
      if (mc?.root) target = mc.root;
    }
    if (target === _hoverBuildingRoot) {
      if (_hoverBuildingOutline) _updateFootRect(_hoverBuildingOutline, target);
      return;
    }
    _clearBuildingOutline();
    if (target) {
      _hoverBuildingRoot = target;
      _hoverBuildingOutline = _makeFootRect();
      _updateFootRect(_hoverBuildingOutline, target);
      scene.add(_hoverBuildingOutline);
    }
  }
  canvas.addEventListener('pointermove', (event) => {
    // Shooter look under pointer lock: cursor deltas steer the view, the
    // frozen cursor position feeds nothing else this frame.
    if (fpsLook(event.movementX || 0, event.movementY || 0)) {
      return;
    }
    setMouseX(event.clientX);
    setMouseY(event.clientY);
    setMouseEntered(true);
    // Hover raycasts (coords readout + mesh hover below) run at most once
    // per frame: high-frequency mice would otherwise fire several full-scene
    // raycasts between renders. Clicks raycast synchronously, unaffected.
    const hoverNow = performance.now();
    const hoverDue = hoverNow - _lastHoverPickT >= 16;
    if (hoverDue) {
      setLastHoverPickT(hoverNow);
    }
    if (_mouseEntered && hoverDue) _updateCursorCoords(event.clientX, event.clientY);
    if (buildMode) {
      setGhostPending(event.clientX, event.clientY);
    }
    if (isAltOrbiting) {
      camera.alpha -= (event.clientX - altOrbitLast.x) * 0.007;
      camera.beta = Math.max(0.15, Math.min(1.4, camera.beta + (event.clientY - altOrbitLast.y) * 0.007));
      setAltOrbitLast({ x: event.clientX, y: event.clientY });
      return;
    }
    if (isSelecting) {
      setSelEnd({ x: event.clientX, y: event.clientY });
      updateSelBoxCSS();
    }
    if (rightDown) setRightLastPos({ x: event.clientX, y: event.clientY });
    if (!isSelecting && !rightDown && hoverDue) {
      const hit = pickMesh(event.clientX, event.clientY);
      _updateDecalHover(hit, event.clientX, event.clientY);
      _updatePointBaseHover();
      _updateBuildingHover(hit);
      _refreshHoverState(hit);
    }
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!canvas) return;
    if (event.pointerId !== undefined) {
      try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
    }
    if (event.button === 0) {
      if (isAltOrbiting) {
        setIsAltOrbiting(false);
        canvas.style.cursor = altDown ? 'grab' : '';
        return;
      }
      if (buildMode) {
        if (buildMode === 'listening_post') {
          placeListeningPost(event.clientX, event.clientY);
        } else {
          const point = raycastGround(event.clientX, event.clientY);
          if (point) placeBuild(point);
        }
        return;
      }
      if (tryUnitCommandClick(event.clientX, event.clientY) || _tryBuilderCommandClick(event.clientX, event.clientY)) {
        setIsSelecting(false);
        selBoxEl.style.display = 'none';
        return;
      }
      if (!isSelecting) return;
      setIsSelecting(false);
      selBoxEl.style.display = 'none';
      if (Math.abs(selEnd.x - selStart.x) < 5 && Math.abs(selEnd.y - selStart.y) < 5) {
        doClickSelect(event.clientX, event.clientY, event.shiftKey);
      } else {
        doBoxSelect();
      }
      updateHUD();
    } else if (event.button === 2) {
      if (!isOrbiting
        && !tryUnitCommandClick(event.clientX, event.clientY, 2)
        && !_tryBuilderCommandClick(event.clientX, event.clientY, 2)) {
        issueRightClick(event.clientX, event.clientY);
      }
      // pointerdown cleared the hover rings; restore the enemy torus and
      // the attack cursor even if the mouse does not move afterwards.
      _refreshHoverState(pickMesh(event.clientX, event.clientY));
      setRightDown(false);
      setIsOrbiting(false);
    }
  });
  canvas.addEventListener('wheel', (event) => {
    camera.radius = applyZoom(camera.radius, event.deltaY, camera.lowerRadiusLimit, camera.upperRadiusLimit);
    event.preventDefault();
  }, { passive: false });
}


export function initInput(): void {
  preloadCursors();
  preloadTaskbarIcons();
  window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
    if (event.code.startsWith('Arrow')) {
      event.preventDefault();
    }
    if (event.code === 'Escape') {
      if (pendingUnitCommand) {
        clearUnitCommand();
        event.preventDefault();
        updateHUD();
      }
      if (buildMenuOpen) {
        setBuildMenuOpen(false);
        event.preventDefault();
      }
      if (_flyArmed) {
        cancelFlyTargeting();
        event.preventDefault();
      }
    }
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      setAltDown(true);
      event.preventDefault();
      if (!buildMode) canvas!.style.cursor = 'grab';
    }
    if (event.code === 'KeyQ') {
      stopSelectedTroops();
    }
    if (event.code === 'KeyL') {
      selSquads.filter((id: number) => world.has(id, 'apc')).forEach((apcId) => {
        const apc = world.get(apcId, 'apc');
        if (!apc) return;
        world.query('squad').forEach((sid: number) => {
          _boardSquadOntoApc(apc, sid);
        });
        updateHUD();
      });
    }
    if (event.code === 'KeyU') {
      selSquads.filter((id: number) => world.has(id, 'apc')).forEach((apcId) => {
        const apc = world.get(apcId, 'apc');
        if (apc) {
          _apcEjectPassengers(world, apc);
          updateHUD();
        }
      });
    }
    if (event.code === 'KeyA') {
      setRangeCirclesVisible(!_rangeCirclesVisible);
      if (!_rangeCirclesVisible) _hideRangeCircles();
    }
    if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && !event.repeat && !window._multiplayerMode) {
      setPaused(!paused);
      setPausedBanner(!paused);
      event.preventDefault();
      updateHUD();
    }
    if (event.code === 'Backspace') {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        camera.radius = DEFAULT_CAMERA_RADIUS;
        camera.alpha = DEFAULT_CAMERA_ALPHA;
        camera.beta = DEFAULT_CAMERA_BETA;
        event.preventDefault();
      }
    }
    if (event.code === 'Tab') {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        toggleCameraFps();
      }
    }
    if (event.code === 'KeyP') {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && toggleGunEditMode()) {
        event.preventDefault();
      }
    }
    if (event.code === 'KeyC' && isGunEditMode()) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        copyGunPose();
      }
    }
    if (event.code === 'Space') {
      event.preventDefault();
      const prevBuilder = selBuilder;
      clearSelection();
      const builders = world.query('builder', 'mesh').filter((id: number) => canCommand(world.get(id, 'builder')?.team));
      if (builders.length > 0) {
        const curIdx = prevBuilder !== null ? builders.indexOf(prevBuilder) : -1;
        const builderId = builders[(curIdx + 1) % builders.length];
        setSelBuilder(builderId);
        const mc = world.get(builderId, 'mesh');
        if (mc?.root?._selMat) mc.root._selMat.opacity = 0.9; mc.root._selMat.transparent = true;
        if (mc?.root?._selDisc) {
          mc.root._selDisc.visible = true;
          mc.root._selDisc.visible = true;
        }
      }
      updateHUD();
    }
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement | null)?.tagName || '');
    if (!typing && !(event.target as HTMLElement | null)?.isContentEditable && !event.ctrlKey && !event.metaKey && !event.altKey && !isShooterMode()) {
      if (event.code === 'Digit1' || event.code === 'Numpad1') {
        setSelectedAttackMode('melee');
        event.preventDefault();
      } else if (event.code === 'Digit2' || event.code === 'Numpad2') {
        setSelectedAttackMode('ranged');
        event.preventDefault();
      }
    }
    if (!typing && selBuilder === null && selSquads.length > 0) {
      if (event.code === 'KeyM') setUnitCommand('move');
      if (event.code === 'KeyT') setUnitCommand('melee');
      if (event.code === 'KeyR' && !event.repeat) {
        reinforceSelectedSquads();
        updateHUD();
      }
    }
    if (selBuilder !== null && world.has(selBuilder, 'builder')) {
      if (event.code === 'KeyM') {
        setBuilderCommand('move');
        updateHUD();
      } else if (event.code === 'KeyR') {
        setBuilderCommand('repair');
        updateHUD();
      } else if (event.code === 'KeyT') {
        setBuilderCommand('melee');
        updateHUD();
      } else if (event.code === 'KeyB') {
        setBuildMenuOpen(!buildMenuOpen);
        updateHUD();
      }
    }
  });
  window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      setAltDown(false);
      setIsAltOrbiting(false);
      if (!buildMode) canvas!.style.cursor = '';
    }
  });
  window.addEventListener('blur', () => {
    setIsSelecting(false);
    setRightDown(false);
    setIsAltOrbiting(false);
    setAltDown(false);
    canvas!.style.cursor = '';
    selBoxEl.style.display = 'none';
  });
  // Losing pointer lock (ESC) drops out of first person: without a captured
  // cursor there is no shooter look, so orbit is the honest state.
  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && isShooterMode()) {
      setCameraMode('orbit');
    }
  });

  window.addEventListener('mousemove', (event) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
    setMouseEntered(true);
  });
  window.addEventListener('mouseenter', () => {
    setMouseEntered(true);
  });
  setupPointerEvents();
  initTouchControls();
}
