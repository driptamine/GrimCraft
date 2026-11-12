import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { findConstructionTarget } from '../src/input/construction-target.js';

const source = readFileSync(new URL('../src/input/orders.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('orders.ts', source, ts.ScriptTarget.Latest, true);
const declaration = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'issueRightClick');
const code = ts.transpileModule(declaration.getText(ast).replace(/^export /, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

for (const multiplayer of [false, true]) {
  test(`${multiplayer ? 'multiplayer' : 'skirmish'}: right-click resumes a post through point meshes and empty scaffold gaps`, () => {
    const components = new Map([
      [10, { builder: { team: 'blue', hp: 100 } }],
      [1, { building: { type: 'listening_post', faction: 'ig', team: 'blue', hp: 400, position: { x: 0, z: 0 }, constructing: true, pendingWorker: true, constructProgress: 1, constructTime: 5 } }],
      [99, { strategicPoint: { owner: 'blue', listeningPostEntityId: 1 } }],
    ]);
    const calls = [];
    let meta = { strategicPointEntityId: 99 }, ground = { x: 4.8, z: 0 };
    const context = vm.createContext({
      world: { get: (id, kind) => components.get(id)?.[kind], query: kind => [...components.keys()].filter(id => components.get(id)[kind]) },
      selBuilder: 10, selSquads: [], _flyArmed: false,
      pickMesh: () => meta ? { meta } : null, raycastGround: () => ground,
      canCommand: team => team === 'blue', findConstructionTarget,
      sendSkirmishCommand: command => { if (multiplayer) calls.push(['network', JSON.parse(JSON.stringify(command))]);return multiplayer; },
      assignConstructionWork: (_world, workerId, siteId) => calls.push(['local', workerId, siteId]),
      issueGroundOrder: () => calls.push(['move']), spawnMoveMarker() {}, spawnSpPing() {}, updateHUD() {},
    });
    vm.runInContext(code, context);
    for (const hit of [{ strategicPointEntityId: 99 }, { listeningPostEntityId: 99 }, null]) {
      meta = hit;calls.length = 0;context.issueRightClick(400, 300);
      assert.deepEqual(calls, multiplayer ? [['network', { ResumeBuild: { builder_id: 10, target_id: 1 } }]] : [['local', 10, 1]]);
    }
    ground = { x: 8, z: 0 };calls.length = 0;context.issueRightClick(400, 300);
    assert.deepEqual(calls, [['move']], 'clicking beyond the site remains a movement order');
    ground = { x: 0, z: 0 };meta = { strategicPointEntityId: 99 };
    components.get(1).building.constructProgress = 5;calls.length = 0;context.issueRightClick(400, 300);
    assert.deepEqual(calls, [['move']], 'completed posts cannot receive a resume command');
  });
}
