// NOTE: call import.meta.glob unconditionally — vite replaces these calls
// statically at build time, while `typeof import.meta.glob` is undefined at
// runtime (browser and node alike), so it can't be used as a guard.
let MAP_GLOB = {};
let MAP_PREVIEW_GLOB = {};
try {
  MAP_GLOB = import.meta.glob('/maps/**/*.sgb', { as: 'url', eager: true });
  MAP_PREVIEW_GLOB = import.meta.glob('/maps/**/*_preview.png', { as: 'url', eager: true });
} catch (_) {
  // Plain node (tests): no vite transform, keep the empty maps.
}

let _selectedPath = null;
let _entries = [];

export function displayName(path) {
  return String(path)
    .split('/')
    .pop()
    .replace(/\.sgb$/i, '')
    .replace(/[_-]+/g, ' ');
}

export function playersFor(path) {
  const match = /(\d+)p[_-]/i.exec(String(path).split('/').pop());
  return match ? Number(match[1]) : null;
}

export function previewFor(path, previews = MAP_PREVIEW_GLOB) {
  const key = String(path).replace(/\.sgb$/i, '') + '_preview.png';
  return previews[key] || null;
}

export function listBuiltinMaps(glob = MAP_GLOB, previews = MAP_PREVIEW_GLOB) {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => ({
      path,
      url,
      name: displayName(path),
      players: playersFor(path),
      previewUrl: previewFor(path, previews),
    }));
}

export function entryLabel({ name, players }) {
  return players ? `${name} (${players}P)` : name;
}

export function skirmishMapCards(builtin = listBuiltinMaps()) {
  return [
    { path: null, url: null, name: 'Default Arena', players: null, previewUrl: null },
    ...builtin,
  ];
}

// Skirmish preselects 6p_alvarus when shipped (null = Default Arena).
export function defaultSkirmishMap(cards) {
  return (cards || []).find((c) => c.path && /alvarus/i.test(c.path)) || null;
}

export function previewState(entry) {
  const url = entry?.previewUrl || null;
  return url ? { kind: 'image', url } : { kind: 'empty' };
}

function renderMapPreview(entry) {
  const box = document.getElementById('maps-preview');
  if (!box) {
    return;
  }
  box.innerHTML = '';
  if (previewState(entry).kind === 'image') {
    const img = document.createElement('img');
    img.src = entry.previewUrl;
    img.alt = entry.name;
    img.addEventListener('error', () => {
      box.innerHTML = '';
      const empty = document.createElement('div');
      empty.className = 'maps-empty';
      empty.textContent = 'NO PREVIEW';
      box.appendChild(empty);
      const cap = document.createElement('div');
      cap.className = 'maps-preview-cap';
      cap.textContent = entryLabel(entry);
      box.appendChild(cap);
    });
    box.appendChild(img);
  } else {
    const empty = document.createElement('div');
    empty.className = 'maps-empty';
    empty.textContent = entry ? 'NO PREVIEW' : 'SELECT A MAP';
    box.appendChild(empty);
  }
  if (entry) {
    const cap = document.createElement('div');
    cap.className = 'maps-preview-cap';
    cap.textContent = entryLabel(entry);
    box.appendChild(cap);
  }
}

export function buildMapsMenu() {
  const list = document.getElementById('maps-list');
  if (!list) {
    return;
  }
  const entries = listBuiltinMaps();
  _entries = entries;
  list.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'maps-empty';
    empty.textContent = 'NO .SGB MAPS IN maps/';
    list.appendChild(empty);
    return;
  }
  entries.forEach((entry) => {
    const { path, url } = entry;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'maps-entry' + (path === _selectedPath ? ' active' : '');
    btn.dataset.path = path;
    btn.textContent = entry.name;
    btn.addEventListener('click', () => selectMap(path, url));
    list.appendChild(btn);
  });
  renderMapPreview(_entries.find((e) => e.path === _selectedPath) || null);
}

export async function selectMap(path, url) {
  _selectedPath = path;
  window._currentMapKey = path;
  renderMapPreview(_entries.find((e) => e.path === path) || null);
  const list = document.getElementById('maps-list');
  if (list) {
    Array.from(list.children).forEach((el) => {
      if (el.classList) {
        el.classList.toggle('active', el.dataset.path === path);
      }
    });
  }
  try {
    const { loadSgbUrl } = await import('./sgb-upload.js');
    await loadSgbUrl(url, displayName(path) + '.sgb', path);
  } catch (err) {
    console.error(err);
  }
  // Paint AFTER the ground material exists — sgb-upload rebuilds the ground,
  // so a pre-load decal would be wiped along with the old material.
  applyMapDecalAutoPair(path, url);
}

async function applyMapDecalAutoPair(path, url) {
  // The 6p_alvarus map is wired to the terrain decal store (maps/6p_alvarus/decals/) as
  // its biomes live there (jungle/urban/z_all + loose), not beside the .sgb.
  // Mirror the decals-browser click (loadTerrainTextureUrl) so the map jump
  // paints the same ground before the heightmap settles.
  if (!/alvarus/i.test(path)) {
    return;
  }
  const { loadTerrainTextureUrl, updateTerrainMeshY } = await import('./terrain-upload.js');
  // Default the map's ground to Y offset 4.0.
  const ySlider = document.getElementById('terrain-mesh-y');
  const yVal = document.getElementById('terrain-mesh-y-val');
  if (ySlider) {
    ySlider.value = '4';
  }
  if (yVal) {
    yVal.textContent = '4.0';
  }
  updateTerrainMeshY(4);
  // Full-coverage sheet the user's own store-list calls the 100%-ground
  // decal: the DDS-derived PNG (256x256, same footprint as the old one).
  // Tiling is eye-picked; defaults come from tex-tile-x/y.
  loadTerrainTextureUrl('/maps/6p_alvarus/decals/terrain/chaos_taint_02_dds.png', '6P ALVARUS');

  // Project the per-decal layout (maps/*_layout_upd.json) onto the surface,
  // mirroring the ground-sheet attachment for x/z/size/angle.
  try {
    const layoutPath = String(path).replace(/\.sgb$/i, '') + '_layout_upd.json';
    const res = await fetch(layoutPath);
    if (!res.ok) {
      return;
    }
    const layout = await res.json();
    const [{ buildSgbDecalsFromLayout }, sgbModule] = await Promise.all([
      import('./sgb-decals.js'),
      import('./sgb-upload.js'),
    ]);
    const sampleHeight = window.__sgbSampleHeight || (() => 0);
    buildSgbDecalsFromLayout(sgbModule._sgbRoot, layout, sampleHeight);
  } catch (err) {
    console.error('layout decals error:', err);
  }
}
