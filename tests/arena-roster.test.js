import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const {
  FACTIONS, POSITION_FACTIONS, ARENA_POSITION_FACTIONS, factionContainers,
} = await import('../src/factions.js');

describe('map rosters', () => {
  it('Default Arena adds Tau 7th and Dark Eldar 8th', () => {
    assert.deepEqual(ARENA_POSITION_FACTIONS, [...POSITION_FACTIONS, 'tau', 'dark eldar']);
    assert.equal(ARENA_POSITION_FACTIONS.length, 8);
    assert.equal(ARENA_POSITION_FACTIONS[6], 'tau');
    assert.equal(ARENA_POSITION_FACTIONS[7], 'dark eldar');
  });

  it('SGB maps keep the base 6 position factions without Tau', () => {
    assert.equal(POSITION_FACTIONS.length, 6);
    assert.ok(!POSITION_FACTIONS.includes('tau'));
    assert.ok(!POSITION_FACTIONS.includes('dark eldar'));
  });

  it('Tau is fully playable: config, models and container bucket', () => {
    assert.ok(FACTIONS.tau, 'tau config exists');
    assert.ok(FACTIONS.tau.hq, 'tau has an HQ model');
    assert.ok(FACTIONS.tau.infantry?.[0]?.model, 'tau has a worker model');
    assert.ok(FACTIONS.tau.infantry?.[1]?.model, 'tau has a soldier model');
    const bucket = factionContainers.tau;
    assert.ok(bucket, 'tau bucket exists');
    assert.deepEqual(Object.keys(bucket).sort(), ['hq', 'soldier', 'structures', 'teamcolor', 'units', 'vehicles', 'worker']);
  });

  it('Dark Eldar is fully playable: config, models and container bucket', () => {
    const config = FACTIONS['dark eldar'];
    assert.ok(config, 'dark eldar config exists');
    assert.equal(config.hq, 'models/dark eldar/structures/kabal_fortress.glb');
    assert.equal(config.infantry?.[0]?.model, 'models/dark eldar/infantry/tortured_slave.glb');
    assert.equal(config.infantry?.[1]?.model, 'models/dark eldar/infantry/warrior.glb');
    const bucket = factionContainers['dark eldar'];
    assert.ok(bucket, 'dark eldar bucket exists');
    assert.deepEqual(Object.keys(bucket).sort(), ['hq', 'soldier', 'structures', 'teamcolor', 'units', 'vehicles', 'worker']);
  });
});
