import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { productionQueueIcon } from '../src/hud/queue-icons.js';
import { FACTIONS } from '../src/factions.js';

describe('production queue icons', () => {
  it('uses the recruitment icon of each configured unit across all factions', () => {
    let checked = 0;
    const buildings = new Set();
    for (const [key, faction] of Object.entries(FACTIONS)) {
      for (const building of faction.structures || []) {
        for (const unit of building.production || []) {
          if (typeof unit !== 'object' || !unit.name || !unit.icon) continue;
          assert.equal(
            productionQueueIcon({ type: unit.name }, faction, building.type),
            unit.icon,
            `${key}: ${building.type} queues ${unit.name}`,
          );
          buildings.add(building.type);
          checked++;
        }
      }
    }
    assert.ok(checked > 0);
    assert.ok(buildings.has('infantry_command') && buildings.has('mechanized'), 'covers both infantry and vehicle production');
  });

  it('resolves legacy squad and builder orders using the producing faction', () => {
    for (const key of ['ig', 'chaos', 'eldar', 'necrons']) {
      const faction = FACTIONS[key];
      assert.equal(productionQueueIcon({ type: 'squad' }, faction), faction.infantry[1].icon || faction.icons.squad);
      assert.equal(productionQueueIcon({ type: 'builder' }, faction), faction.infantry[0].icon || faction.icons.worker);
    }
    assert.notEqual(
      productionQueueIcon({ type: 'squad' }, FACTIONS.ig),
      productionQueueIcon({ type: 'squad' }, FACTIONS.chaos),
    );
  });

  it('prefers the selected building’s production icon when the same unit has variants', () => {
    const faction = { structures: [
      { type: 'first', production: [{ name: 'marine', icon: 'icons/first.png' }] },
      { type: 'second', production: [{ name: 'marine', icon: 'icons/second.png' }] },
    ] };
    assert.equal(productionQueueIcon({ type: 'marine' }, faction, 'second'), 'icons/second.png');
    assert.equal(
      productionQueueIcon({ type: 'marine' }, faction, 'second', [{ name: 'marine', icon: 'icons/runtime.png' }]),
      'icons/runtime.png',
    );
  });

  it('matches model keys and normalized names in older queue snapshots', () => {
    const faction = { units: [{ name: 'Heavy Weapons Team', model: 'models/heavy_weapon_platoon.glb', icon: 'icons/heavy.png' }] };
    assert.equal(productionQueueIcon({ type: 'heavy_weapons_team' }, faction), 'icons/heavy.png');
    assert.equal(productionQueueIcon({ type: 'heavy_weapon_platoon' }, faction), 'icons/heavy.png');
  });

  it('preserves explicit entry icons and handles unknown types without assigning another unit’s icon', () => {
    assert.equal(productionQueueIcon({ type: 'custom', icon: 'icons/custom.png' }, undefined), 'icons/custom.png');
    assert.equal(productionQueueIcon({ type: 'unknown' }, FACTIONS.ig), '');
    assert.equal(productionQueueIcon({ type: 'unknown' }, undefined), '');
    assert.equal(productionQueueIcon({ type: 'vehicle' }, { icons: { vehicle: {} } }), '');
  });
});
