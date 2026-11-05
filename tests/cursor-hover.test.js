import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { resolveCursor, withinHoverRadius } from '../src/ui/cursors.js';

const source = readFileSync(new URL('../src/input/events.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('events.ts', source, ts.ScriptTarget.Latest, true);
const cursorFunction = ast.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === '_updateHoverCursor');
const code = ts.transpileModule(cursorFunction.getText(ast).replace(/^export /, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

function fixture() {
  const components = new Map();
  const context = vm.createContext({
    world: {
      get: (id, kind) => components.get(id)?.[kind],
      query: (kind) => [...components.keys()].filter((id) => components.get(id)[kind]),
      has: (id, kind) => !!components.get(id)?.[kind],
    },
    canvas: { style: {} },
    resolveCursor, withinHoverRadius,
    cursorCss: (name) => name,
    getModalCursor: () => null,
    isHostileToSelection: (_, id, team) => team === 'red',
    canCommand: (team) => team === 'blue',
    selSquads: [],
    _pendingBuilderCommand: null,
    pendingUnitCommand: null,
    buildMode: null,
    _flyArmed: false,
    _lastGroundPt: { valid: true, x: 0, z: 0 },
    POINT_HOVER_RADIUS: 3.5,
  });
  vm.runInContext(code, context);
  const hover = (meta) => {
    context._updateHoverCursor(meta ? { meta } : null);
    return context.canvas.style.cursor;
  };
  return { components, context, hover };
}

describe('attack cursor on enemy hover', () => {
  it('recognizes every enemy entity kind and takes priority over nearby capture points', () => {
    const f = fixture();
    f.components.set(99, { strategicPoint: {}, mesh: { root: { position: { x: 0, z: 0 } } } });
    for (const [kind, key] of [
      ['squad', 'squadEntityId'], ['builder', 'builderEntityId'], ['apc', 'apcEntityId'],
      ['vehicle', 'vehicleEntityId'], ['jet', 'jetEntityId'], ['building', 'buildingEntityId'],
      ['structure', 'structureEntityId'], ['airfield', 'airfieldEntityId'],
    ]) {
      f.components.set(1, { [kind]: { team: 'red', hp: 100 } });
      assert.equal(f.hover({ [key]: 1 }), 'attack', kind);
    }
    f.components.set(1, { squad: { team: 'red', soldiers: [2] } });
    f.components.set(2, { soldier: { squadId: 1, hp: 100 } });
    assert.equal(f.hover({ soldierEntityId: 2 }), 'attack');
    assert.equal(f.hover(null), 'capture', 'leaving the enemy restores the nearby capture cursor');
  });

  it('keeps friendly and allied units neutral and respects melee, repair, and build modes', () => {
    const f = fixture();
    f.components.set(1, { squad: { team: 'blue' } });
    assert.equal(f.hover({ squadEntityId: 1 }), 'default');
    f.components.set(1, { squad: { team: 'blue', faction: 'eldar' } });
    assert.equal(f.hover({ squadEntityId: 1 }), 'default');
    f.components.set(1, { squad: { team: 'red' } });
    f.context.pendingUnitCommand = 'melee';
    assert.equal(f.hover({ squadEntityId: 1 }), 'melee');
    f.context.pendingUnitCommand = null;
    f.context.buildMode = 'hq';
    assert.equal(f.hover({ squadEntityId: 1 }), 'crosshair');
    f.context.buildMode = null;
    f.context._pendingBuilderCommand = 'repair';
    f.components.set(2, { vehicle: { team: 'blue', hp: 50, maxHp: 100 } });
    assert.equal(f.hover({ vehicleEntityId: 2 }), 'repair');
    f.context._pendingBuilderCommand = null;
    f.components.set(2, { vehicle: { team: 'red', hp: 0 } });
    assert.equal(f.hover({ vehicleEntityId: 2 }), 'default');
  });
});
