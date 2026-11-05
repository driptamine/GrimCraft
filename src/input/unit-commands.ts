import * as THREE from 'three';
import { world, selSquads, selBuilder, canCommand, canvas, buildMode } from '../core/scene.js';
import { updateHUD } from '../core/hud.js';
import { issueGroundOrder, clearBuilderCommand, setBuilderCommand, cancelFlyTargeting } from './orders.js';
import { cancelBuild } from './build-ghost.js';
import { pickMesh, raycastGround } from './selection.js';
import { cursorCss } from '../ui/cursors.js';

export type UnitCommand = 'move' | 'attackmove' | 'melee';
export let pendingUnitCommand: UnitCommand | null = null;
let armedSelection: number[] = [];

export function selectedTroops(): { id: number; kind: string; unit: any }[] {
  if (!world) return [];
  return selSquads.flatMap((id: number) => {
    for (const kind of ['squad', 'apc', 'vehicle', 'jet']) {
      const unit = world.get(id, kind);
      if (unit && canCommand(unit.team)) return [{ id, kind, unit }];
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
  const ownedBuilder = builder && canCommand(builder.team) ? builder : null;
  const squads = ownedBuilder ? [] : selectedTroops().filter(({ kind }) => kind === 'squad');
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
  for (const { unit } of squads) {
    unit.attackMode = mode;
    for (const id of unit.soldiers || []) {
      const soldier = world.get(id, 'soldier');
      if (!soldier) continue;
      soldier.meleeTimer = 0;
      soldier.shootTimer = 0;
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

export function stopSelectedTroops(): void {
  clearUnitCommand();
  cancelFlyTargeting();
  for (const { unit, kind } of selectedTroops()) stopUnit(unit, kind);
  updateHUD();
}

export function setUnitStance(stance: 'stand' | 'ranged'): void {
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
  issueGroundOrder(point);
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
