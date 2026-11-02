// NOTE: call import.meta.glob unconditionally — vite replaces these calls
// statically at build time, while `typeof import.meta.glob` is undefined at
// runtime (browser and node alike), so it can't be used as a guard.
let MAP_GLOB: Record<string, string> = {};
let MAP_PREVIEW_GLOB: Record<string, string> = {};
try {
  MAP_GLOB = import.meta.glob('/maps/**/*.sgb', { as: 'url', eager: true });
  MAP_PREVIEW_GLOB = import.meta.glob('/maps/**/*_preview.png', { as: 'url', eager: true });
} catch (_) {
  // Plain node (tests): no vite transform, keep the empty maps.
}

let _selectedPath: string | null = null;

export interface MapEntry {
  path: string;
  url: string;
  name: string;
  players: number | null;
  previewUrl: string | null;
}

export interface MapCard {
  path: string | null;
  url: string | null;
  name: string;
  players: number | null;
  previewUrl: string | null;
}

let _entries: MapCard[] = [];

export function displayName(path: string): string {
  return (String(path)
    .split('/')
    .pop() || '')
    .replace(/\.sgb$/i, '')
    .replace(/[_-]+/g, ' ');
}

export function playersFor(path: string): number | null {
  const match = /(\d+)p[_-]/i.exec(String(path).split('/').pop() || '');
  return match ? Number(match[1]) : null;
}

export function previewFor(path: string, previews: Record<string, string> = MAP_PREVIEW_GLOB): string | null {
  const key = String(path).replace(/\.sgb$/i, '') + '_preview.png';
  return previews[key] || null;
}

export function listBuiltinMaps(glob: Record<string, string> = MAP_GLOB, previews: Record<string, string> = MAP_PREVIEW_GLOB): MapEntry[] {
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

export function entryLabel({ name, players }: { name: string; players: number | null }): string {
  return players ? `${name} (${players}P)` : name;
}

export function skirmishMapCards(builtin: MapEntry[] = listBuiltinMaps()): MapCard[] {
  return [
    { path: null, url: null, name: 'Default Arena', players: null, previewUrl: null },
    ...builtin,
  ];
}

// Skirmish preselects 6p_alvarus when shipped (null = Default Arena).
export function defaultSkirmishMap(cards?: MapCard[] | null): MapCard | null {
  return (cards || []).find((c) => c.path && /alvarus/i.test(c.path)) || null;
}

export function previewState(entry: MapEntry | MapCard | null): { kind: 'image'; url: string } | { kind: 'empty' } {
  const url = entry?.previewUrl || null;
  return url ? { kind: 'image', url } : { kind: 'empty' };
}

function renderMapPreview(entry: MapEntry | MapCard | null): void {
  const box = document.getElementById('maps-preview');
  if (!box) {
    return;
  }
  box.innerHTML = '';
  const preview = previewState(entry);
  if (preview.kind === 'image' && entry) {
    const img = document.createElement('img');
    img.src = preview.url;
    img.alt = entry.name;
    img.addEventListener('error', () => {
      box.innerHTML = '';
      const empty = document.createElement('div');
      empty.className = 'maps-empty';
      empty.textContent = 'NO PREVIEW';
      box.appendChild(empty);
      const cap = document.createElement('div');
      cap.className = 'maps-preview-cap';
      cap.textContent = entryLabel(entry as MapCard);
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

export function buildMapsMenu(): void {
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

export async function selectMap(path: string, url: string): Promise<void> {
  _selectedPath = path;
  (window as unknown as Record<string, unknown>)._currentMapKey = path;
  renderMapPreview(_entries.find((e) => e.path === path) || null);
  const list = document.getElementById('maps-list');
  if (list) {
    (Array.from(list.children) as HTMLElement[]).forEach((el) => {
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

async function applyMapDecalAutoPair(path: string, _url: string): Promise<void> {
  // The 6p_alvarus map is wired to the terrain decal store (maps/6p_alvarus/decals/) as
  // its biomes live there (jungle/urban/z_all + loose), not beside the .sgb.
  // Mirror the decals-browser click (loadTerrainTextureUrl) so the map jump
  // paints the same ground before the heightmap settles.
  if (!/alvarus/i.test(path)) {
    return;
  }
  const { loadTerrainTextureUrl, updateTerrainMeshY } = await import('./terrain-upload.js');
  // Default the map's ground to Y offset 4.0.
  const ySlider = document.getElementById('terrain-mesh-y') as HTMLInputElement | null;
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
    const sampleHeight = (window as unknown as Record<string, unknown>).__sgbSampleHeight || (() => 0);
    buildSgbDecalsFromLayout(sgbModule._sgbRoot, layout, sampleHeight);
  } catch (err) {
    console.error('layout decals error:', err);
  }
}
