export function getSgbTextures() {
  return window.__sgbTexData || null;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderTextureList() {
  const el = document.getElementById('terrain-texture-list');
  if (!el) {
    return;
  }
  const data = getSgbTextures();
  if (!data) {
    el.innerHTML = '<div class="maps-empty">LOAD A MAP FIRST</div>';
    return;
  }
  const rows = [];
  rows.push(
    '<div class="terrain-tex-row terrain-tex-title">' +
    escapeHtml(data.mapName) + ' · ' + escapeHtml(data.scenarioName) +
    '</div>',
  );
  if (data.detailTextures && data.detailTextures.length) {
    rows.push('<div class="terrain-section-label">DETAIL TEXTURES</div>');
    data.detailTextures.forEach((t) => {
      rows.push('<div class="terrain-tex-row">[' + t.index + '] ' + escapeHtml(t.path) + '</div>');
    });
  }
  if (data.decalLinks && data.decalLinks.length) {
    rows.push('<div class="terrain-section-label">DECALS (' + (data.decals || []).length + ' INSTANCES)</div>');
    const countById = new Map();
    (data.decals || []).forEach((d) => {
      countById.set(d.decalIdx, (countById.get(d.decalIdx) || 0) + 1);
    });
    data.decalLinks.slice().sort((a, b) => a.path.localeCompare(b.path)).forEach((d) => {
      const n = countById.get(d.id) || 0;
      rows.push(
        '<div class="terrain-tex-row">' +
        (n ? '×' + n + ' ' : '') +
        escapeHtml(d.path.replace(/^art\/decals\//, '')) +
        '</div>',
      );
    });
  }
  if (
    (!data.detailTextures || !data.detailTextures.length) &&
    (!data.decalLinks || !data.decalLinks.length)
  ) {
    rows.push('<div class="maps-empty">NO TEXTURE PATHS IN THIS SGB</div>');
  }
  el.innerHTML = rows.join('');
}

export function clearTextureList() {
  const el = document.getElementById('terrain-texture-list');
  if (el) {
    el.innerHTML = '';
  }
}