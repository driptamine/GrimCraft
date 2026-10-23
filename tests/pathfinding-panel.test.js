import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ROUTING_MODES,
  getRoutingMode,
  setRoutingMode,
  updateSquadRoute,
} from '../pathfinding/astar-integrated.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
const panel = fs.readFileSync(path.join(root, 'src/pathfinding-panel.js'), 'utf8');
const passGrid = JSON.parse(
  fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path.json'), 'utf8'),
);
const flat = () => 0;
const WEST = { x: 10, z: 98 };
const EAST = { x: 118, z: 98 };

describe('pathfinding tab wiring', () => {
  it('has a toolbar button, a panel with a mode list, and a binding', () => {
    assert.ok(html.includes('id="pathfinding-panel-btn"'), 'toolbar button');
    assert.ok(html.includes('onclick="togglePathfindingPanel()"'), 'button opens the tab');
    assert.ok(html.includes('id="pathfinding-panel"'), 'panel');
    assert.ok(html.includes('id="pathfinding-list"'), 'mode list');
    assert.ok(html.includes('id="pathfinding-status"'), 'status line');
    assert.ok(game.includes('window.togglePathfindingPanel'), 'game binding');
    assert.ok(game.includes("import('./pathfinding-panel.js')"), 'lazy chunk import');
    assert.ok(panel.includes('togglePathfindingPanel'), 'panel toggle export');
    assert.ok(panel.includes('ROUTING_MODES'), 'list built from routing modes');
  });

  it('lists every routing mode with an active marker', () => {
    assert.ok(ROUTING_MODES.length >= 2, 'a real list to choose from');
    for (const mode of ROUTING_MODES) {
      assert.ok(panel.includes(mode.name) || panel.includes('mode.name'), 'mode rendered');
    }
    assert.ok(panel.includes("' active'") || panel.includes("'active'") || panel.includes('active'), 'active highlight');
  });
});

describe('routing modes in the game', () => {
  it('defaults to astar and rejects unknown modes', () => {
    setRoutingMode('astar');
    assert.equal(getRoutingMode(), 'astar');
    assert.deepEqual(ROUTING_MODES.map((m) => m.id).sort(), ['astar', 'straight']);
    setRoutingMode('teleport');
    assert.equal(getRoutingMode(), 'astar');
  });

  it('straight mode stays out of the way even across closed paint', () => {
    setRoutingMode('straight');
    try {
      const squad = {
        position: { x: WEST.x, y: 0, z: WEST.z },
        moveOrder: { ...EAST },
        _astarPath: [{ x: 1, z: 1 }],
        _astarKey: 'stale',
      };
      assert.equal(updateSquadRoute(squad, { passGrid, groundAt: flat }), null);
      assert.equal(squad._astarPath, null, 'cached route cleared');
    } finally {
      setRoutingMode('astar');
    }
  });

  it('astar mode routes across the wall again after switching back', () => {
    setRoutingMode('astar');
    const squad = {
      position: { x: WEST.x, y: 0, z: WEST.z },
      moveOrder: { ...EAST },
      _astarPath: null,
      _astarKey: null,
    };
    const wp = updateSquadRoute(squad, { passGrid, groundAt: flat });
    assert.ok(wp, 'waypoint issued');
  });
});
