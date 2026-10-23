/**
 * Decals browser — loose terrain texture/stamp store (maps/6p_alvarus/decals/).
 *
 * The alvarus biome textures live here (maps/6p_alvarus/decals/{jungle,urban,z_all} +
 * loose .tga/.dds), not next to the .sgb. This mirrors maps-menu.js: glob
 * every supported raster under maps/6p_alvarus/decals/, group it by subfolder, and on
 * click push the URL into the same ground-emissive swap terrain-upload uses.
 */

const DECALS_GLOB = import.meta.glob(
  '/maps/6p_alvarus/decals/**/*.{tga,dds,png,jpg,jpeg,webp}',
  { as: 'url', eager: true },
);

export function displayDecalsName(path) {
  return path
    .replace(/^\/maps\/decals\//, '')
    .replace(/\.(tga|dds|png|jpe?g|webp)$/i, '')
    .replace(/[_-]+/g, ' ');
}

function groupOf(path) {
  const match = path.match(/^\/maps\/decals\/([^/]+)\//);
  return match ? match[1].toUpperCase() : 'MISC';
}

export async function applyDecal(path, url) {
  // Same ground-material swap as dragging onto 🌍 TERRAIN, but URL-driven so
  // it works from the built-in list instead of a file drop.
  const { loadTerrainTextureUrl } = await import('./terrain-upload.js');
  loadTerrainTextureUrl(url, path);
}

export function buildDecalsMenu() {
  const list = document.getElementById('decals-list');
  if (!list) {
    return;
  }
  const entries = Object.entries(DECALS_GLOB).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  list.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'maps-empty';
    empty.textContent = 'NO DECAL FILES IN maps/6p_alvarus/decals/';
    list.appendChild(empty);
    return;
  }
  let currentGroup = null;
  entries.forEach(([path, url]) => {
    const group = groupOf(path);
    if (group !== currentGroup) {
      currentGroup = group;
      const header = document.createElement('div');
      header.className = 'decals-group';
      header.textContent = group;
      list.appendChild(header);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'decals-entry';
    btn.dataset.path = path;
    btn.textContent = displayDecalsName(path);
    btn.addEventListener('click', () => {
      applyDecal(path, url);
    });
    list.appendChild(btn);
  });
}

export function filterDecals(query) {
  const list = document.getElementById('decals-list');
  if (!list) {
    return;
  }
  const needle = (query || '').trim().toLowerCase();
  if (!needle) {
    buildDecalsMenu();
    return;
  }
  const entries = Object.entries(DECALS_GLOB).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  list.innerHTML = '';
  let currentGroup = null;
  let matched = 0;
  entries.forEach(([path, url]) => {
    if (!path.toLowerCase().includes(needle)) {
      return;
    }
    const group = groupOf(path);
    if (group !== currentGroup) {
      currentGroup = group;
      const header = document.createElement('div');
      header.className = 'decals-group';
      header.textContent = group;
      list.appendChild(header);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'decals-entry';
    btn.dataset.path = path;
    btn.textContent = displayDecalsName(path);
    btn.addEventListener('click', () => {
      applyDecal(path, url);
    });
    list.appendChild(btn);
    matched++;
  });
  if (!matched) {
    const empty = document.createElement('div');
    empty.className = 'maps-empty';
    empty.textContent = 'NO DECALS MATCH "' + needle.slice(0, 24) + '"';
    list.appendChild(empty);
  }
}
