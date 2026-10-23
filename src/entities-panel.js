import { world, PLAYER } from './scene.js';

export let _entitiesPanelOpen = false;
export let _entitiesFilter = '';
let _lastSig = '';

function _escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _collect() {
  const entries = [];
  if (!world) {
    return entries;
  }
  for (const id of world._entities) {
    const tags = [...(world._tags.get(id) || [])];
    const comps = [];
    let team;
    for (const [name, store] of world._components) {
      const data = store.get(id);
      if (data === undefined) {
        continue;
      }
      comps.push(name);
      if (team === undefined && data && typeof data === 'object' && 'team' in data) {
        team = data.team;
      }
    }
    entries.push({ id, tags, comps, team });
  }
  return entries;
}

function _signature(entries) {
  return entries
    .map((e) => `${e.id}:${e.tags.join('|')}:${e.comps.join('|')}:${e.team || ''}`)
    .join(';');
}

function _matchesFilter(entry) {
  const filter = _entitiesFilter.toLowerCase();
  if (!filter) {
    return true;
  }
  return (
    String(entry.id).includes(filter) ||
    entry.tags.some((t) => t.toLowerCase().includes(filter)) ||
    entry.comps.some((c) => c.toLowerCase().includes(filter)) ||
    String(entry.team || '').toLowerCase().includes(filter)
  );
}

export function toggleEntitiesPanel() {
  _entitiesPanelOpen = !_entitiesPanelOpen;
  const panel = document.getElementById('entities-panel');
  const btn = document.getElementById('entities-toggle-btn');
  if (!panel || !btn) {
    return;
  }
  if (_entitiesPanelOpen) {
    panel.classList.add('open');
    btn.classList.add('active');
    entitiesRefresh();
  } else {
    panel.classList.remove('open');
    btn.classList.remove('active');
  }
}

export function entitiesFilter(value) {
  _entitiesFilter = value;
  entitiesRefresh();
}

export function entitiesRefresh() {
  const panel = document.getElementById('entities-panel');
  if (!panel || !_entitiesPanelOpen) {
    return;
  }
  const list = document.getElementById('entities-list');
  const count = document.getElementById('entities-count');
  const all = _collect();
  const sig = _signature(all);
  const filterChanged = sig !== _lastSig;
  _lastSig = sig;

  if (count) {
    count.textContent = `${all.length} ENTITIES`;
  }
  if (!list) {
    return;
  }
  if (!all.length) {
    list.innerHTML = '<div class="entities-empty">NO ENTITIES YET</div>';
    return;
  }
  const visible = all.filter(_matchesFilter);
  if (!visible.length) {
    list.innerHTML = '<div class="entities-empty">NO ENTITIES MATCH FILTER</div>';
    return;
  }
  if (!filterChanged && _entitiesFilter.length === 0) {
    return;
  }
  list.innerHTML = '';
  const rows = visible.sort((a, b) => a.id - b.id);
  const frag = document.createDocumentFragment();
  for (const entry of rows) {
    const row = document.createElement('div');
    row.className = 'entity-row';
    const teamClass = entry.team === PLAYER ? 'team-player' : entry.team ? 'team-enemy' : '';
    const tagBadges = entry.tags
      .sort()
      .map((t) => `<span class="entity-tag">${_escapeHtml(t)}</span>`)
      .join('');
    row.innerHTML =
      `<span class="entity-team-dot ${teamClass}"></span>` +
      `<span class="entity-id">#${entry.id}</span>` +
      tagBadges +
      `<span class="entity-comps">${_escapeHtml(entry.comps.join(', '))}</span>`;
    frag.appendChild(row);
  }
  list.appendChild(frag);
}

export function initEntitiesPanelAutoRefresh() {
  setInterval(() => {
    if (_entitiesPanelOpen) {
      entitiesRefresh();
    }
  }, 500);
}
