/**
 * Decals left panel — tree view over the 324 placed decals (maps/6p_alvarus/6p_alvarus_preview.png).
 * Groups by texture (8 groups, e.g. stone_cliff_05 ×80) and expands to every
 * individual instance with its world x/z and size. Selection is per-instance
 * and syncs with the map pick (click on surface → highlight here).
 */

import {
  getDecalGroups,
  getPlacedDecalList,
  getSelectedDecalPath,
  getSelectedDecalIndex,
  getSelectedDecalPosition,
  setSelectedDecalPosition,
  isDecalGroupVisible,
  toggleDecalGroup,
  selectDecalAt,
  selectDecalByPath,
} from './sgb-decals.js';

let _expanded = new Set();
let _slidersReady = false;

function decalDisplayName(path) {
  return String(path || '')
    .replace(/^art\/decals\//, '')
    .replace(/^\/maps\/decals\//, '')
    .replace(/\.(tga|dds|png|jpe?g|webp)$/i, '')
    .replace(/[_-]+/g, ' ');
}

function highlight(path, index = -1) {
  const list = document.getElementById('decal-selection-list');
  if (!list) return;
  list.querySelectorAll('.decal-group-row').forEach((row) => {
    row.classList.toggle('selected', row.dataset.path === path && index === -1);
  });
  list.querySelectorAll('.decal-instance-row').forEach((row) => {
    const idx = Number(row.dataset.index);
    row.classList.toggle('selected', idx === index);
  });
  const selected = list.querySelector('.decal-instance-row.selected') || list.querySelector('.decal-group-row.selected');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
  syncPosControls();
}

function syncPosControls() {
  const ctr = document.getElementById('decal-pos-controls');
  if (!ctr) return;
  const pos = getSelectedDecalPosition();
  if (!pos) {
    ctr.style.display = 'none';
    return;
  }
  ctr.style.display = 'block';
  ensureSliders();
  const sx = document.getElementById('decal-pos-x');
  const sy = document.getElementById('decal-pos-y');
  const sz = document.getElementById('decal-pos-z');
  if (sx) { sx.value = String(pos.x); const v = document.getElementById('decal-pos-x-val'); if (v) v.textContent = pos.x.toFixed(1); }
  if (sy) { sy.value = String(pos.y); const v = document.getElementById('decal-pos-y-val'); if (v) v.textContent = pos.y.toFixed(1); }
  if (sz) { sz.value = String(pos.z); const v = document.getElementById('decal-pos-z-val'); if (v) v.textContent = pos.z.toFixed(1); }
}

function ensureSliders() {
  if (_slidersReady) return;
  _slidersReady = true;
  const sx = document.getElementById('decal-pos-x');
  const sy = document.getElementById('decal-pos-y');
  const sz = document.getElementById('decal-pos-z');
  if (sx) sx.addEventListener('input', () => {
    const v = parseFloat(sx.value);
    const el = document.getElementById('decal-pos-x-val'); if (el) el.textContent = v.toFixed(1);
    setSelectedDecalPosition({ x: v });
    const idx = getSelectedDecalIndex();
    if (idx !== -1) {
      const row = document.querySelector(`.decal-instance-row[data-index="${idx}"] .decal-instance-coords`);
      const pos = getSelectedDecalPosition();
      if (row && pos) row.textContent = `x${pos.x.toFixed(1)} z${pos.z.toFixed(1)}`;
    }
  });
  if (sy) sy.addEventListener('input', () => {
    const v = parseFloat(sy.value);
    const el = document.getElementById('decal-pos-y-val'); if (el) el.textContent = v.toFixed(1);
    setSelectedDecalPosition({ y: v });
  });
  if (sz) sz.addEventListener('input', () => {
    const v = parseFloat(sz.value);
    const el = document.getElementById('decal-pos-z-val'); if (el) el.textContent = v.toFixed(1);
    setSelectedDecalPosition({ z: v });
    const idx = getSelectedDecalIndex();
    if (idx !== -1) {
      const row = document.querySelector(`.decal-instance-row[data-index="${idx}"] .decal-instance-coords`);
      const pos = getSelectedDecalPosition();
      if (row && pos) row.textContent = `x${pos.x.toFixed(1)} z${pos.z.toFixed(1)}`;
    }
  });
  window.addEventListener('decal-moved', (e) => {
    const pos = getSelectedDecalPosition();
    if (!pos) return;
    // keep sliders in sync if moved elsewhere
  });
}

export function buildDecalsSelectionList() {
  const list = document.getElementById('decal-selection-list');
  if (!list) return;

  const groups = getDecalGroups();
  // fallback for empty (before map load) use old aggregated list
  const entries = groups.length ? groups : getPlacedDecalList().map((e) => ({ ...e, instances: [] }));
  list.innerHTML = '';

  if (!groups.length && !entries.length) {
    const empty = document.createElement('div');
    empty.className = 'decals-empty';
    empty.textContent = 'NO PLACED DECALS — LOAD A MAP';
    list.appendChild(empty);
  } else if (!groups.length) {
    // fallback flat list (should not happen after layout load)
    entries.forEach((entry) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'decal-sel-row';
      row.dataset.path = entry.path;
      row.title = entry.path;
      const name = document.createElement('span');
      name.className = 'decal-sel-name';
      name.textContent = decalDisplayName(entry.path);
      const count = document.createElement('span');
      count.className = 'decal-sel-count';
      count.textContent = '\u00d7' + entry.count;
      row.appendChild(name);
      row.appendChild(count);
      row.addEventListener('click', () => selectDecalByPath(entry.path));
      list.appendChild(row);
    });
  } else {
    groups.forEach((group) => {
      const isExpanded = _expanded.has(group.path);
      const grp = document.createElement('div');
      grp.className = 'decal-group' + (isExpanded ? ' expanded' : '');
      grp.dataset.path = group.path;

      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'decal-group-row' + (getSelectedDecalPath() === group.path && getSelectedDecalIndex() === -1 ? ' selected' : '');
      header.dataset.path = group.path;
      header.title = group.path;

      const exp = document.createElement('span');
      exp.className = 'decal-expand-btn';
      exp.textContent = isExpanded ? '▾' : '▸';

      const eye = document.createElement('button');
      eye.type = 'button';
      eye.className = 'decal-group-eye' + (isDecalGroupVisible(group.path) ? '' : ' off');
      eye.textContent = isDecalGroupVisible(group.path) ? '◉' : '◎';
      eye.title = isDecalGroupVisible(group.path) ? 'Hide group' : 'Show group';
      eye.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDecalGroup(group.path);
        buildDecalsSelectionList();
      });

      const name = document.createElement('span');
      name.className = 'decal-group-name';
      name.textContent = decalDisplayName(group.path);

      const count = document.createElement('span');
      count.className = 'decal-sel-count';
      count.textContent = '\u00d7' + group.count;

      header.appendChild(exp);
      header.appendChild(eye);
      header.appendChild(name);
      header.appendChild(count);

      // click on header: toggle expand; double intent: if already expanded, also select first instance
      header.addEventListener('click', (e) => {
        // if click on expand glyph, just toggle
        const wasExpanded = _expanded.has(group.path);
        if (wasExpanded) _expanded.delete(group.path);
        else _expanded.add(group.path);
        buildDecalsSelectionList();
        // also select first instance of group for quick preview (don't override toggle highlight immediately)
        if (!wasExpanded && group.instances.length) {
          // keep selection on group header until user picks an instance
        }
      });
      // right side count click or name double-click could select first — keep simple: header selects first instance on second click
      header.addEventListener('dblclick', () => {
        if (group.instances.length) selectDecalAt(group.instances[0].index);
      });

      grp.appendChild(header);

      const children = document.createElement('div');
      children.className = 'decal-group-children';
      children.style.display = isExpanded ? 'block' : 'none';

      group.instances.forEach((inst, i) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'decal-instance-row';
        row.dataset.index = String(inst.index);
        row.dataset.path = group.path;
        row.title = `${group.path}  #${i + 1}  x:${inst.x.toFixed(1)} z:${inst.z.toFixed(1)}  size:${inst.sizeRaw.toFixed(4)}  ang:${inst.angle.toFixed(2)}`;

        const idx = document.createElement('span');
        idx.className = 'decal-instance-idx';
        idx.textContent = `#${i + 1}`;

        const coords = document.createElement('span');
        coords.className = 'decal-instance-coords';
        coords.textContent = `x${inst.x.toFixed(1)} z${inst.z.toFixed(1)}`;

        const size = document.createElement('span');
        size.className = 'decal-instance-size';
        size.textContent = `${inst.sizeRaw.toFixed(3)}`;

        row.appendChild(idx);
        row.appendChild(coords);
        row.appendChild(size);
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          selectDecalAt(inst.index);
        });
        children.appendChild(row);
      });

      grp.appendChild(children);
      list.appendChild(grp);
    });
  }

  const count = document.getElementById('decals-panel-count');
  if (count) {
    const total = groups.reduce((s, g) => s + g.count, 0) || entries.reduce((s, e) => s + e.count, 0);
    const tex = groups.length || entries.length;
    count.textContent = total + ' DECALS \u00b7 ' + tex + ' TEXTURES';
  }
  highlight(getSelectedDecalPath(), getSelectedDecalIndex());
}

export function toggleDecalsPanel() {
  const panel = document.getElementById('decals-panel');
  if (!panel) return;
  const opening = !panel.classList.contains('open');
  panel.classList.toggle('open', opening);
  const btn = document.getElementById('decals-panel-btn');
  if (btn) btn.classList.toggle('active', opening);
  if (opening) buildDecalsSelectionList();
}

window.addEventListener('decal-selected', (event) => {
  const path = event.detail?.path || '';
  const idx = event.detail?.index ?? -1;
  if (path && idx !== -1 && !_expanded.has(path)) {
    _expanded.add(path);
    buildDecalsSelectionList();
    return;
  }
  highlight(path, idx);
});

window.addEventListener('decal-list-changed', () => {
  if (document.getElementById('decals-panel')?.classList.contains('open')) {
    buildDecalsSelectionList();
  }
});
