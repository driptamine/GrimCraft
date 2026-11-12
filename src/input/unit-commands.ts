import * as THREE from 'three';
import { world, selSquads, selBuilder, canCommand, canvas, buildMode } from '../core/scene.js';
import { updateHUD } from '../core/hud.js';
import { issueGroundOrder, clearBuilderCommand, setBuilderCommand, cancelFlyTargeting } from './orders.js';
import { cancelBuild } from './build-ghost.js';
import { pickMesh, raycastGround } from './selection.js';
import { spawnMoveMarkerAt } from './markers.js';
import { cursorCss } from '../ui/cursors.js';

export type UnitCommand = 'move' | 'attackmove' | 'melee';
export let pendingUnitCommand: UnitCommand | null = null;
let armedSelection: number[] = [];

export function selectedTroops(): { id: number; kind: string; unit: any }[] {
  if (!world) return [];
  return selSquads.flatMap((id: number) => {
    for (const kind of ['squad', 'apc', 'vehicle', 'jet']) {
      const unit = world.get(id, kind);
      if (unit && canCommand(unit.team,id)) return [{ id, kind, unit }];
    }
    return [];
  });
}

export function clearUnitCommand(): void {
  const wasArmed = pendingUnitCommand !== null;
  pendingUnitCommand = null;
  armedSelection = [];
  if (canvas) canvas.style.cursor = '';
  if (wasArmed) updateHUD();
}

export function setUnitCommand(command: UnitCommand): void {
  const troops = selectedTroops();
  if (!troops.length || (command === 'melee' && !troops.some(({ kind }) => kind === 'squad'))) return;
  if (buildMode) cancelBuild();
  clearBuilderCommand();
  cancelFlyTargeting();
  pendingUnitCommand = command;
  armedSelection = troops.map(({ id }) => id);
  if (canvas) canvas.style.cursor = command === 'melee' ? cursorCss('melee', 'crosshair') : 'crosshair';
  updateHUD();
}

export function setSelectedAttackMode(mode: 'melee' | 'ranged'): void {
  const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
  const squads = selectedTroops().filter(({ kind }) => kind === 'squad');
  const ownedBuilder = !squads.length && builder && canCommand(builder.team,selBuilder) ? builder : null;
  if (!ownedBuilder && !squads.length) return;
  if (mode === 'melee' && !ownedBuilder) {
    setUnitCommand('melee');
  } else {
    clearUnitCommand();
    clearBuilderCommand();
    cancelFlyTargeting();
    if (mode === 'melee') {
      if (buildMode) cancelBuild();
      setBuilderCommand('melee');
    }
  }
  if (ownedBuilder) {
    ownedBuilder.meleeOrder = mode === 'melee';
    ownedBuilder.meleeTimer = 0;
  }
  if(typeof window!=='undefined'&&window._multiplayerMode)window._grimcraftSendCommand?.({SetCombatStance:{ids:ownedBuilder?[selBuilder]:squads.map(t=>t.id),mode}});
  for (const { unit } of squads) {
    unit.attackMode = mode;
    for (const id of unit.soldiers || []) {
      const soldier = world.get(id, 'soldier');
      if (!soldier) continue;
      soldier.meleeTimer = 0;
      if (mode === 'ranged' || soldier.meleeEngaged) soldier.shootTimer = 0;
      if (mode === 'melee') soldier.attackCooldown = Math.min(soldier.attackCooldown || 0, 0.65);
    }
  }
  updateHUD();
}

function stopUnit(unit: any, kind: string): void {
  unit.moveOrder = null;
  unit.forcedTarget = null;
  unit.forcedSoldierId = null;
  unit.attackMove = false;
  unit.stopped = true;
  if (kind === 'squad') {
    unit.flyOrder = null;
    unit.captureOrderSpId = null;
    for (const id of unit.soldiers || []) {
      const soldier = world.get(id, 'soldier');
      if (soldier) {
        soldier.meleeTimer = 0;
        soldier.shootTimer = 0;
      }
    }
  } else if (kind === 'jet') {
    unit.waitOrders = true;
    unit.strafe = null;
    unit.forcedTargetSqId = null;
  }
}

// Builders are selected on their own (selBuilder), not through selSquads, and
// they have no `stopped` flag: holding position means dropping every queued
// job and leaving combat stance. The worker's job timer resets; the site's
// construction progress remains available for a later resume order.
function stopBuilder(builder: any): void {
  builder.moveTarget = null;
  builder.buildTarget = null;
  builder.buildTargetSP = null;
  builder.buildProgress = 0;
  builder.isBuilding = false;
  builder.repairTarget = null;
  builder.attackMove = false;
  builder.meleeOrder = false;
  builder.meleeTimer = 0;
  builder.stance = 'stand';
}

export function stopSelectedTroops(): void {
  if(typeof window!=='undefined'&&window._multiplayerMode&&window._networkSchema===2){window._grimcraftSendCommand?.({StopUnits:{ids:[...selectedTroops().map(t=>t.id),...(selBuilder!=null?[selBuilder]:[])]}});return;}
  if (typeof window !== 'undefined' && window._multiplayerMode) window._grimcraftNetStop?.(selectedTroops().filter(t => t.kind === 'squad').map(t => t.id));
  clearUnitCommand();
  clearBuilderCommand();
  cancelFlyTargeting();
  if (buildMode) cancelBuild();
  for (const { unit, kind } of selectedTroops()) stopUnit(unit, kind);
  const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
  if (builder && canCommand(builder.team)) stopBuilder(builder);
  updateHUD();
}

export function setUnitStance(stance: 'stand' | 'ranged'): void {
  if(typeof window!=='undefined'&&window._multiplayerMode&&window._networkSchema===2){window._grimcraftSendCommand?.({SetStance:{ids:selectedTroops().map(t=>t.id),stance}});return;}
  clearUnitCommand();
  cancelFlyTargeting();
  for (const { unit, kind } of selectedTroops()) {
    unit.stance = stance;
    unit.attackMode = 'ranged';
    unit.autoChase = stance === 'ranged';
    if (stance === 'stand') stopUnit(unit, kind);
    else {
      unit.stopped = false;
      if (kind === 'jet') {
        unit.waitOrders = false;
        unit.patrolMode = 'attack';
      }
    }
  }
  updateHUD();
}

export function issueUnitCommand(command: UnitCommand, point: THREE.Vector3, target?: { squadId: number; soldierId?: number }): void {
  const troops = selectedTroops();
  if (!troops.length) return;
  if(typeof window!=='undefined'&&window._multiplayerMode&&window._networkSchema===2){window._grimcraftSendCommand?.({UnitCommand:{ids:troops.map(t=>t.id),command,target:point,enemy:target}});spawnMoveMarkerAt(point);updateHUD();return;}
  issueGroundOrder(point);
  if (typeof window !== 'undefined' && window._multiplayerMode && target && command !== 'move') window._grimcraftNetAttack?.(troops.filter(t => t.kind === 'squad').map(t => t.id), target.squadId);
  for (const { unit, kind } of troops) {
    unit.stopped = false;
    unit.attackMove = command !== 'move';
    unit.attackMode = command === 'melee' && kind === 'squad' ? 'melee' : 'ranged';
    if (kind === 'squad' && command === 'melee') {
      for (const id of unit.soldiers || []) {
        const soldier = world.get(id, 'soldier');
        if (soldier) {
          soldier.shootTimer = 0;
          soldier.attackCooldown = Math.min(soldier.attackCooldown, 0.65);
        }
      }
    }
    unit.autoChase = command !== 'move';
    unit.forcedTarget = null;
    unit.forcedSoldierId = null;
    if (command !== 'move' && kind === 'squad') unit.captureOrderSpId = null;
    if (kind === 'jet') {
      unit.waitOrders = false;
      unit.patrolMode = command === 'move' ? 'hold' : 'attack';
      unit.forcedTargetSqId = null;
    }
    if (target && command !== 'move') {
      const enemy = world.get(target.squadId, 'squad');
      if (enemy && enemy.team !== unit.team) {
        if (kind === 'squad') {
          unit.forcedTarget = target.squadId;
          unit.forcedSoldierId = target.soldierId ?? null;
          unit.moveOrder = null;
        } else if (kind === 'jet') unit.forcedTargetSqId = target.squadId;
      }
    }
  }
  updateHUD();
}

export function tryUnitCommandClick(sx: number, sy: number, button = 0): boolean {
  if (!pendingUnitCommand) return false;
  if (button !== (pendingUnitCommand === 'melee' ? 2 : 0)) return false;
  const command = pendingUnitCommand;
  const current = selectedTroops().map(({ id }) => id);
  const sameSelection = current.length === armedSelection.length && current.every((id) => armedSelection.includes(id));
  clearUnitCommand();
  if (!sameSelection) return false;
  const point = raycastGround(sx, sy);
  if (point) {
    const meta = pickMesh(sx, sy)?.meta;
    const soldierId = meta?.soldierEntityId;
    const squadId = meta?.squadEntityId ?? (soldierId !== undefined ? world.get(soldierId, 'soldier')?.squadId : undefined);
    issueUnitCommand(command, point, squadId !== undefined ? { squadId, soldierId } : undefined);
  }
  return true;
}
