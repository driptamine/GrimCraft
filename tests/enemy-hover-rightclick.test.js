import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/input/events.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('events.ts', source, ts.ScriptTarget.Latest, true);

function findFunction(node, name) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === name) return node;
  let found;
  ts.forEachChild(node, (child) => {
    if (!found) found = findFunction(child, name);
  });
  return found;
}

const helper = findFunction(ast, '_refreshHoverState');
assert.ok(helper, '_refreshHoverState must exist in events.ts');
const code = ts.transpileModule(helper.getText(ast), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

function fixture() {
  const calls = { updateHoverCursor: [], unitHoverUpdate: [], hoveredSquad: [] };
  const components = new Map();
  const context = vm.createContext({
    _updateHoverCursor: (hit) => calls.updateHoverCursor.push(hit),
    unitHover: {
      update: (world, meta, isHostile) => calls.unitHoverUpdate.push({ meta, hostile: isHostile?.(1, 'red') }),
    },
    world: {
      get: (id, kind) => components.get(id)?.[kind],
      has: (id, kind) => !!components.get(id)?.[kind],
    },
    isHostileToSelection: (world, id, team) => team === 'red',
    set_hoverEnemySquad: (id) => calls.hoveredSquad.push(id),
  });
  vm.runInContext(code, context);
  return { components, context, calls };
}

describe('enemy hover survives right-click', () => {
  it('restores the torus, cursor and hovered squad for an enemy squad hit', () => {
    const f = fixture();
    f.components.set(1, { squad: { team: 'red', soldiers: [2] } });
    f.components.set(2, { soldier: { squadId: 1, hp: 100 } });
    f.context.hit = { meta: { squadEntityId: 1 } };
    vm.runInContext('_refreshHoverState(hit)', f.context);
    const hit = f.context.hit;
    assert.deepEqual(f.calls.updateHoverCursor, [hit]);
    assert.equal(f.calls.unitHoverUpdate.length, 1);
    assert.deepEqual(f.calls.unitHoverUpdate[0].meta, { squadEntityId: 1 });
    assert.deepEqual(f.calls.hoveredSquad, [1]);
  });

  it('resolves the squad through a clicked enemy soldier', () => {
    const f = fixture();
    f.components.set(1, { squad: { team: 'red', soldiers: [2] } });
    f.components.set(2, { soldier: { squadId: 1, hp: 100 } });
    f.context.hit = { meta: { soldierEntityId: 2 } };
    vm.runInContext('_refreshHoverState(hit)', f.context);
    const hit = f.context.hit;
    assert.deepEqual(f.calls.hoveredSquad, [1]);
    assert.deepEqual(f.calls.unitHoverUpdate[0].meta, { soldierEntityId: 2 });
  });

  it('clears the hovered squad on friendly units and empty ground', () => {
    const f = fixture();
    f.components.set(1, { squad: { team: 'blue', soldiers: [] } });
    f.context.friendlyHit = { meta: { squadEntityId: 1 } };
    vm.runInContext('_refreshHoverState(friendlyHit)', f.context);
    assert.deepEqual(f.calls.hoveredSquad, [null]);
    vm.runInContext('_refreshHoverState(null)', f.context);
    assert.deepEqual(f.calls.hoveredSquad, [null, null]);
    assert.deepEqual(f.calls.unitHoverUpdate[1].meta, null);
  });

  it('wires the restore into the right-button pointerup after the attack order', () => {
    const setup = findFunction(ast, 'setupPointerEvents');
    assert.ok(setup, 'setupPointerEvents must exist');
    const text = setup.getText(ast);
    const upIndex = text.indexOf('event.button === 2');
    assert.ok(upIndex >= 0, 'pointerup must handle the right button');
    const branch = text.slice(upIndex);
    const orderIndex = branch.indexOf('issueRightClick(event.clientX, event.clientY)');
    const restoreIndex = branch.indexOf('_refreshHoverState(pickMesh(event.clientX, event.clientY))');
    assert.ok(orderIndex >= 0 && restoreIndex >= 0 && restoreIndex > orderIndex,
      'pointerup must re-resolve hover after issueRightClick');
  });
});
