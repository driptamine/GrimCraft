/**
 * Pathfinding tab — routing-mode list for squad movement.
 * Mirrors decals-panel.js: lazy-loaded from game.js, builds the list on open.
 */
import { world } from './scene.js';
import {
  ROUTING_MODES,
  getRoutingMode,
  setRoutingMode,
} from '../pathfinding/astar-integrated.js';

export function setPathfindingMode(mode) {
  setRoutingMode(mode);
  // Drop cached routes so every squad re-routes under the new mode on its
  // next tick (orders themselves are untouched).
  for (const id of world.query('squad')) {
    const squad = world.get(id, 'squad');
    if (squad) {
      squad._astarPath = null;
      squad._astarKey = null;
    }
  }
  buildPathfindingList();
}

export function buildPathfindingList() {
  const list = document.getElementById('pathfinding-list');
  if (!list) {
    return;
  }
  const active = getRoutingMode();
  list.innerHTML = '';
  ROUTING_MODES.forEach((mode) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pf-mode-row' + (mode.id === active ? ' active' : '');
    btn.dataset.mode = mode.id;
    const name = document.createElement('span');
    name.className = 'pf-mode-name';
    name.textContent = (mode.id === active ? '◉ ' : '◎ ') + mode.name;
    const desc = document.createElement('span');
    desc.className = 'pf-mode-desc';
    desc.textContent = mode.desc;
    btn.appendChild(name);
    btn.appendChild(desc);
    btn.addEventListener('click', () => setPathfindingMode(mode.id));
    list.appendChild(btn);
  });
  const status = document.getElementById('pathfinding-status');
  if (status) {
    let routing = 0;
    let squads = 0;
    for (const id of world.query('squad')) {
      const squad = world.get(id, 'squad');
      if (!squad) continue;
      squads += 1;
      if (squad._astarPath && squad._astarPath.length) routing += 1;
    }
    status.textContent = active.toUpperCase() + ' · ' + routing + '/' + squads + ' SQUADS ROUTING';
  }
}

export function togglePathfindingPanel() {
  const panel = document.getElementById('pathfinding-panel');
  if (!panel) return;
  const opening = !panel.classList.contains('open');
  panel.classList.toggle('open', opening);
  const btn = document.getElementById('pathfinding-panel-btn');
  if (btn) btn.classList.toggle('active', opening);
  if (opening) buildPathfindingList();
}
