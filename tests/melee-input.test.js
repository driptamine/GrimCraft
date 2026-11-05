import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';

const read = (file) => readFileSync(new URL(`../src/input/${file}.ts`, import.meta.url), 'utf8');
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const events = ts.createSourceFile('events.ts', read('events'), ts.ScriptTarget.Latest, true);
const setup = events.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === 'setupPointerEvents');
const init = events.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === 'initInput');
function handler(name, fn = setup, target = 'canvas') {
  const call = fn.body.statements.find((node) => ts.isExpressionStatement(node)
    && ts.isCallExpression(node.expression)
    && node.expression.expression.getText(events) === `${target}.addEventListener`
    && node.expression.arguments[0].text === name).expression;
  return compile(`var handle = ${call.arguments[1].getText(events)};`);
}
const builderSource = ts.createSourceFile('orders.ts', read('orders'), ts.ScriptTarget.Latest, true);
const builderFunctions = ['setBuilderCommand', 'clearBuilderCommand', '_issueBuilderCommand', '_tryBuilderCommandClick'];
const builderCode = compile('export let _pendingBuilderCommand: string | null = null;\n' + builderSource.statements
  .filter((node) => ts.isFunctionDeclaration(node) && builderFunctions.includes(node.name?.text))
  .map((node) => node.getText(builderSource)).join('\n'));

function fixture() {
  const world = new World();
  const add = (kind, value) => {
    const id = world.createEntity([]);
    world.add(id, kind, value);
    return id;
  };
  const own = add('squad', { team: 'blue', soldiers: [], attackMode: 'ranged', forcedTarget: null });
  const enemy = add('squad', { team: 'red', soldiers: [], position: new THREE.Vector3(10, 0, 20) });
  const soldier = add('soldier', { squadId: enemy });
  const builder = add('builder', { team: 'blue', meleeOrder: false });
  const canvas = { style: {}, setPointerCapture() {}, releasePointerCapture() {} };
  const scene = { world, selSquads: [own], selBuilder: null, canCommand: (team) => team === 'blue', canvas, buildMode: null };
  const selection = {
    pickMesh: () => ({ meta: { soldierEntityId: soldier, squadEntityId: enemy } }),
    raycastGround: () => new THREE.Vector3(10, 0, 20),
  };
  const noop = () => {};
  const builderContext = vm.createContext({
    exports: {}, world, selBuilder: builder, canvas, THREE,
    ...selection, cursorCss: (name) => name, spawnMoveMarker: noop, updateHUD: noop,
  });
  vm.runInContext(builderCode, builderContext);
  const builderCommands = builderContext.exports;
  const orders = {
    clearBuilderCommand: builderCommands.clearBuilderCommand,
    setBuilderCommand: builderCommands.setBuilderCommand,
    cancelFlyTargeting: noop,
    issueGroundOrder: (point) => scene.selSquads.forEach((id) => {
      const squad = world.get(id, 'squad');
      if (squad) squad.moveOrder = point.clone();
    }),
  };
  const commandContext = vm.createContext({ exports: {}, require(name) {
    if (name === 'three') return THREE;
    if (name.endsWith('/scene.js')) return scene;
    if (name.endsWith('/hud.js')) return { updateHUD: noop };
    if (name === './orders.js') return orders;
    if (name === './build-ghost.js') return { cancelBuild: noop };
    if (name === './selection.js') return selection;
    if (name.endsWith('/cursors.js')) return { cursorCss: (name) => name };
    throw new Error(`Unexpected import ${name}`);
  } });
  vm.runInContext(compile(read('unit-commands')), commandContext);
  const commands = commandContext.exports;
  let ordinaryOrders = 0;
  const context = vm.createContext({
    canvas, world, THREE, selSquads: scene.selSquads,
    clearUnitHover: noop, isShooterMode: () => false, buildMode: null,
    clearUnitCommand: commands.clearUnitCommand, clearBuilderCommand: builderCommands.clearBuilderCommand,
    setUnitCommand: commands.setUnitCommand, setSelectedAttackMode: commands.setSelectedAttackMode,
    setBuilderCommand: builderCommands.setBuilderCommand,
    tryUnitCommandClick: commands.tryUnitCommandClick, _tryBuilderCommandClick: builderCommands._tryBuilderCommandClick,
    cancelBuild: noop, ...selection,
    setRightDown: (value) => { context.rightDown = value; },
    setIsOrbiting: (value) => { context.isOrbiting = value; },
    setIsSelecting: (value) => { context.isSelecting = value; },
    selBoxEl: { style: {} },
    setRightDragStartPos: noop, setRightLastPos: noop,
    isSelecting: false, isOrbiting: false, isAltOrbiting: false, keys: {},
    issueRightClick: () => { ordinaryOrders += 1; },
  });
  Object.defineProperties(context, {
    pendingUnitCommand: { get: () => commands.pendingUnitCommand },
    _pendingBuilderCommand: { get: () => builderCommands._pendingBuilderCommand },
    selBuilder: { get: () => scene.selBuilder },
  });
  vm.runInContext(handler('pointerdown'), context);
  const down = context.handle;
  vm.runInContext(handler('pointerup'), context);
  const up = context.handle;
  vm.runInContext(handler('keydown', init, 'window'), context);
  const keydown = context.handle;
  const event = (button = 2) => ({ button, clientX: 30, clientY: 40, pointerId: 1 });
  return { world, own, enemy, soldier, builder, commands, builderCommands, context, scene,
    down: () => down(event()), up: (button = 2) => up(event(button)), ordinary: () => ordinaryOrders,
    key: (code, options = {}) => keydown({ code, target: { tagName: 'CANVAS' }, preventDefault: noop, ...options }),
  };
}

describe('melee right-click targeting', () => {
  it('keeps melee armed on right-button down and attacks the clicked enemy on release', () => {
    const f = fixture();
    f.commands.setUnitCommand('melee');
    f.up(0);
    assert.equal(f.commands.pendingUnitCommand, 'melee', 'left-click cannot confirm melee');
    assert.equal(f.world.get(f.own, 'squad').attackMode, 'ranged');
    f.down();
    assert.equal(f.commands.pendingUnitCommand, 'melee', 'right-button down must not cancel melee');
    f.up();
    const squad = f.world.get(f.own, 'squad');
    assert.equal(squad.attackMode, 'melee');
    assert.equal(squad.forcedTarget, f.enemy);
    assert.equal(squad.forcedSoldierId, f.soldier);
    assert.equal(f.commands.pendingUnitCommand, null);
    assert.equal(f.context.rightDown, false);
    assert.equal(f.ordinary(), 0, 'normal right-click must not overwrite the melee order');
  });

  it('uses the same right-click confirmation for the engineer', () => {
    const f = fixture();
    f.builderCommands.setBuilderCommand('melee');
    f.up(0);
    assert.equal(f.builderCommands._pendingBuilderCommand, 'melee');
    f.down();
    assert.equal(f.builderCommands._pendingBuilderCommand, 'melee');
    f.up();
    const builder = f.world.get(f.builder, 'builder');
    assert.equal(builder.meleeOrder, true);
    assert.equal(builder.attackMove, true);
    assert.deepEqual(builder.moveTarget, new THREE.Vector3(10, 0, 20));
    assert.equal(f.builderCommands._pendingBuilderCommand, null);
    assert.equal(f.ordinary(), 0);
  });

  it('preserves melee during camera dragging and still cancels other targeting modes on right-click', () => {
    const f = fixture();
    f.commands.setUnitCommand('melee');
    f.down();
    f.context.isOrbiting = true;
    f.up();
    assert.equal(f.commands.pendingUnitCommand, 'melee');
    assert.equal(f.world.get(f.own, 'squad').attackMode, 'ranged');
    assert.equal(f.ordinary(), 0);
    f.commands.setUnitCommand('move');
    f.down();
    assert.equal(f.commands.pendingUnitCommand, null);
    f.up();
    assert.equal(f.ordinary(), 1);
    f.commands.setUnitCommand('attackmove');
    f.up(0);
    assert.equal(f.world.get(f.own, 'squad').attackMode, 'ranged');
    assert.equal(f.world.get(f.own, 'squad').attackMove, true, 'other commands still use left-click');
  });
});

describe('attack mode keyboard shortcuts', () => {
  it('switches selected infantry with 1 and 2 and keeps melee attack confirmation on right-click', () => {
    const f = fixture();
    const squad = f.world.get(f.own, 'squad');
    squad.stance = 'stand';
    f.scene.selSquads.push(f.enemy);
    f.key('Digit1');
    assert.equal(squad.attackMode, 'melee');
    assert.equal(f.commands.pendingUnitCommand, 'melee');
    assert.equal(f.world.get(f.enemy, 'squad').attackMode, undefined, 'enemy selection is not commandable');
    f.up(0);
    assert.equal(squad.forcedTarget, null, 'left-click cannot confirm the attack');
    f.down();
    f.up();
    assert.equal(squad.forcedTarget, f.enemy);
    f.key('Digit2');
    assert.equal(squad.attackMode, 'ranged');
    assert.equal(squad.stance, 'stand', 'switching weapons does not change movement stance');
    assert.equal(squad.forcedTarget, f.enemy, 'the current target survives switching to ranged');
    assert.equal(f.commands.pendingUnitCommand, null);
    f.key('Digit1');
    f.key('Digit2');
    assert.equal(f.commands.pendingUnitCommand, null, 'ranged cancels pending melee targeting');
  });

  it('supports the selected engineer and numpad keys', () => {
    const f = fixture();
    f.scene.selBuilder = f.builder;
    const builder = f.world.get(f.builder, 'builder');
    f.key('Numpad1');
    assert.equal(builder.meleeOrder, true);
    assert.equal(f.builderCommands._pendingBuilderCommand, 'melee');
    assert.equal(f.world.get(f.own, 'squad').attackMode, 'ranged', 'engineer mode does not change other troops');
    f.down();
    f.up();
    assert.equal(builder.meleeOrder, true);
    const target = builder.moveTarget;
    f.key('Numpad2');
    assert.equal(builder.meleeOrder, false);
    assert.equal(builder.moveTarget, target);
    assert.equal(f.builderCommands._pendingBuilderCommand, null);
  });

  it('ignores typing, modified shortcuts, shooter mode, and unsupported vehicle melee', () => {
    const f = fixture();
    for (const options of [
      { target: { tagName: 'INPUT' } }, { target: { tagName: 'TEXTAREA' } },
      { target: { tagName: 'SELECT' } }, { target: { tagName: 'DIV', isContentEditable: true } },
      { ctrlKey: true }, { metaKey: true }, { altKey: true },
    ]) f.key('Digit1', options);
    assert.equal(f.commands.pendingUnitCommand, null);
    assert.equal(f.world.get(f.own, 'squad').attackMode, 'ranged');
    f.context.isShooterMode = () => true;
    f.key('Digit1');
    assert.equal(f.commands.pendingUnitCommand, null);
    f.context.isShooterMode = () => false;
    const vehicle = f.world.createEntity([]);
    f.world.add(vehicle, 'vehicle', { team: 'blue', attackMode: 'ranged' });
    f.scene.selSquads.splice(0, f.scene.selSquads.length, vehicle);
    f.key('Digit1');
    assert.equal(f.commands.pendingUnitCommand, null);
    assert.equal(f.world.get(vehicle, 'vehicle').attackMode, 'ranged');
  });
});
