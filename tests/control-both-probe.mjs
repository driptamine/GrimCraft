// Helper for control-both.test.js (not a test file itself).
// Importing input.js pulls game.js, which leaves the process unable to exit
// on its own under node --test, so this runs in a child process and
// terminates explicitly; the test asserts its exit code.
import { register } from 'node:module';
import assert from 'node:assert/strict';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = { addEventListener() {}, _currentMapKey: 'arena' };
globalThis.document = { getElementById: () => null };
const scene = await import('../src/scene.js');
const { isHostileToSelection } = await import('../src/input.js');
const { systemAI } = await import('../src/systems.js');

function stubWorld(comps) {
  return {
    get(id, type) {
      return comps[id]?.[type];
    },
  };
}

// canCommand gates orders to the player team by default.
scene.setControlBoth(false);
assert.equal(scene.canCommand('blue'), true);
assert.equal(scene.canCommand('red'), false);
assert.equal(scene.canCommand(null), false);
assert.equal(scene.canCommand(undefined), false);
assert.equal(scene.canCommand('green'), false);
console.log('ok - canCommand gates orders to the player team by default');

// canCommand opens both teams in sandbox mode, never null owners.
scene.setControlBoth(true);
assert.equal(scene.canCommand('blue'), true);
assert.equal(scene.canCommand('red'), true);
assert.equal(scene.canCommand(null), false);
assert.equal(scene.canCommand(undefined), false);
scene.setControlBoth(false);
console.log('ok - canCommand opens both teams in sandbox mode, never null owners');

// Hover hostility follows the current selection.
{
  const world = stubWorld({
    1: { squad: { team: 'blue' } },
    2: { squad: { team: 'blue' } },
    3: { squad: { team: 'red' } },
    4: { squad: { team: 'red' } },
  });
  scene.setControlBoth(false);
  scene.setSelSquads([]);
  assert.equal(isHostileToSelection(world, 3, 'red'), true);
  assert.equal(isHostileToSelection(world, 1, 'blue'), false);
  scene.setSelSquads([1]);
  assert.equal(isHostileToSelection(world, 3, 'red'), true);
  assert.equal(isHostileToSelection(world, 2, 'blue'), false);
  assert.equal(isHostileToSelection(world, 1, 'blue'), false);
  scene.setControlBoth(true);
  scene.setSelSquads([3]);
  assert.equal(isHostileToSelection(world, 1, 'blue'), true);
  assert.equal(isHostileToSelection(world, 4, 'red'), false);
  assert.equal(isHostileToSelection(world, 3, 'red'), false);
  scene.setSelSquads([]);
  scene.setControlBoth(false);
}
console.log('ok - hover hostility follows the current selection');

// AI auto-spawns are disabled in sandbox mode.
{
  let created = 0;
  const countingWorld = { createEntity() { created += 1; return created; } };
  scene.setControlBoth(true);
  systemAI(countingWorld, 30);
  assert.equal(created, 0, 'no AI squads spawn while commanding both teams');
  scene.setControlBoth(false);
}
console.log('ok - AI auto-spawns are disabled in sandbox mode');

console.log('all control-both checks passed');
process.exit(0);
