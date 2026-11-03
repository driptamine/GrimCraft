import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };

const { reinforceQueueIcon } = await import('../src/hud/queue-icons.js');

describe('reinforcement queue icons', () => {
  it('shows the sergeant icon for a formIdx 0 (sergeant) entry', () => {
    assert.equal(
      reinforceQueueIcon({ type: 'reinforce', formIdx: 0, isGrenadier: false }),
      'assets/icons/Imperial Guard/Units/Basic/guard_sargeant_icon.png',
    );
  });

  it('shows the grenade launcher icon for a grenadier upgrade', () => {
    assert.equal(
      reinforceQueueIcon({ type: 'grenade', isGrenadier: true }),
      'assets/icons/Imperial Guard/Units/Abilities/guard_upgrade_grenade_launcher.png',
    );
  });

  it('shows the plasma gun icon for a plasma upgrade entry', () => {
    assert.equal(
      reinforceQueueIcon({ type: 'plasma', isGrenadier: false }),
      'assets/icons/Space Marines/Buildings/Economy/guard_upgrade_plasma_gun.png',
    );
  });

  it('shows the reinforce (plus) icon for a regular soldier, not the helmet', () => {
    assert.equal(
      reinforceQueueIcon({ type: 'reinforce', formIdx: 3, isGrenadier: false }),
      'assets/command_icons/reinforce.png',
    );
  });
});
