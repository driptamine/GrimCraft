import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { findConstructionTarget } from '../src/input/construction-target.js';
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
    resolveCursor, withinHoverRadius, findConstructionTarget,
    cursorCss: (name) => name,
    getModalCursor: () => null,
    isHostileToSelection: (_, id, team) => team === 'red',
    canCommand: (team) => team === 'blue',
    selSquads: [],
    selBuilder: null,
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

it('uses the build cursor only for a selected worker over an unfinished friendly site', () => {
  const f = fixture();
  f.components.set(10, { builder: { team: 'blue', hp: 100 } });
  f.context.selBuilder = 10;
  for (const [kind, key] of [['building', 'buildingEntityId'], ['structure', 'structureEntityId'], ['airfield', 'airfieldEntityId']]) {
    const site = { team: 'blue', hp: 300, constructProgress: 3, constructTime: 8, constructing: true, pendingWorker: true };
    f.components.set(1, { [kind]: site });
    assert.equal(f.hover({ [key]: 1 }), 'build');
    site.constructProgress = 8;assert.equal(f.hover({ [key]: 1 }), 'default', 'finished buildings do not offer construction');
    site.constructProgress = 3;site.team = 'red';assert.equal(f.hover({ [key]: 1 }), 'attack', 'enemy sites never offer construction');
    site.team = 'blue';f.context.selBuilder = null;assert.equal(f.hover({ [key]: 1 }), 'default');f.context.selBuilder = 10;
  }
});

it('workers show a default cursor over owned, neutral, and enemy strategic points', () => {
  const f=fixture();f.context.selBuilder=10;
  f.components.set(10,{builder:{team:'blue',hp:100}});
  for(const owner of ['blue','red',null]){
    f.components.set(99,{strategicPoint:{owner},mesh:{root:{position:{x:0,z:0}}}});
    assert.equal(f.hover({strategicPointEntityId:99}),'default');
    assert.equal(f.hover(null),'default');
  }
  f.context.selBuilder=null;assert.equal(f.hover(null),'capture','infantry capture cursor remains available');
});

it('recognizes an unfinished listening post through the centerpost and throughout its construction footprint', () => {
  const f=fixture();f.context.selBuilder=10;
  f.components.set(10,{builder:{team:'blue',hp:100}});
  const site={type:'listening_post',faction:'ig',team:'blue',hp:400,position:{x:0,z:0},constructing:true,pendingWorker:true,constructTime:5,constructProgress:1};
  f.components.set(1,{building:site});
  f.components.set(99,{strategicPoint:{owner:'blue',listeningPostEntityId:1},mesh:{root:{position:{x:0,z:0}}}});
  assert.equal(f.hover({strategicPointEntityId:99}),'build');
  assert.equal(f.hover({listeningPostEntityId:99}),'build');
  f.context._lastGroundPt.x=4.9;assert.equal(f.hover(null),'build','gaps in drop geometry still offer construction');
  f.context._lastGroundPt.x=5.1;assert.equal(f.hover(null),'default','outside the footprint stays neutral');
  site.constructProgress=5;f.context._lastGroundPt.x=0;assert.equal(f.hover({strategicPointEntityId:99}),'default');
  site.constructProgress=1;site.team='red';assert.equal(f.hover({strategicPointEntityId:99}),'default');
  site.team='blue';f.components.get(10).builder.hp=0;assert.equal(f.hover({strategicPointEntityId:99}),'default');
});
