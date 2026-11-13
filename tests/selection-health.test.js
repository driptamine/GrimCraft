import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../src/core/ecs.js';
import { createSelectionHealthTracker, refreshSelectionHealth } from '../src/hud/selection-health.js';
import { getTicker } from '../src/hud/store.js';

function fixture() {
  const world = new World(), squad = world.createEntity([]), soldier = world.createEntity([]), other = world.createEntity([]);
  world.add(squad, 'squad', { soldiers: [soldier], maxSquadSize: 10 });
  world.add(soldier, 'soldier', { squadId: squad, hp: 375, maxHp: 375 });
  world.add(other, 'soldier', { hp: 100, maxHp: 100 });
  return { world, squad, soldier, other };
}
test('enemy inspection reacts to nonlethal damage, healing, death and squad removal', () => {
  const { world, squad, soldier, other } = fixture(), changed = createSelectionHealthTracker(), selection = { enemySquadId: squad };
  assert.equal(changed(world, selection), true);
  assert.equal(changed(world, selection), false);
  world.get(other, 'soldier').hp -= 10;
  assert.equal(changed(world, selection), false, 'uninspected fights must not redraw the HUD');
  world.get(soldier, 'soldier').hp -= 2.75;
  assert.equal(changed(world, selection), true, 'a single shot updates HP before any soldier dies');
  assert.equal(changed(world, selection), false);
  world.get(soldier, 'soldier').hp += 1;
  assert.equal(changed(world, selection), true);
  world.get(squad, 'squad').soldiers[0] = null;
  assert.equal(changed(world, selection), true);
  world.destroyEntity(squad);world._flushDestroyed();
  assert.equal(changed(world, selection), true, 'wiped enemy clears the portrait');
});
test('tracks friendly units, buildings and workers and resets on a new world', () => {
  const { world, squad, soldier } = fixture(), changed = createSelectionHealthTracker();
  const building = world.createEntity([]), worker = world.createEntity([]);
  world.add(building, 'structure', { hp: 400, maxHp: 400 });world.add(worker, 'builder', { hp: 100, maxHp: 100 });
  const selection = { unitIds: [squad], buildingIds: [building], builderId: worker };
  changed(world, selection);
  world.get(soldier, 'soldier').hp = 300;assert.equal(changed(world, selection), true);
  world.get(building, 'structure').hp = 350;assert.equal(changed(world, selection), true);
  world.get(worker, 'builder').maxHp = 120;assert.equal(changed(world, selection), true);
  assert.equal(changed(world, selection), false);
  assert.equal(changed(fixture().world, selection), true);
});
test('health changes notify the health channel without redrawing all command panels', () => {
  const { world, squad, soldier } = fixture(), selection = { enemySquadId: squad };
  const commandsBefore = getTicker('hud');
  refreshSelectionHealth(world, selection);
  const healthBefore = getTicker('health');
  refreshSelectionHealth(world, selection);assert.equal(getTicker('health'), healthBefore);
  world.get(soldier, 'soldier').hp -= 1;
  refreshSelectionHealth(world, selection);
  assert.equal(getTicker('health'), healthBefore + 1);
  assert.equal(getTicker('hud'), commandsBefore);
});
