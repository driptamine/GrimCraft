// Startup main menu (right side): 200x200 art placeholder + section buttons.
// Skirmish / Multi-player open the connect overlay in that mode; the rest are
// stub screens until those sections exist. Only zero-dependency leaf modules
// are imported statically (multiplayer stays lazy to avoid an import cycle).
import { modelSource, setModelSource, MODEL_SOURCE_PROCEDURAL, MODEL_SOURCE_GLB } from './model-source.js';

export const MENU_ITEMS = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'skirmish', label: 'Skirmish' },
  { id: 'multiplayer', label: 'Multi-player' },
  { id: 'army-painter', label: 'Army Painter' },
  { id: 'settings', label: 'Settings' },
  { id: 'credits', label: 'Credits' },
];

export function screenFor(itemId) {
  if (itemId === 'skirmish') {
    return 'skirmish';
  }
  if (itemId === 'multiplayer') {
    return 'multiplayer';
  }
  return 'stub';
}

let _showConnectOverlay = null;
let _hideConnectOverlay = null;

function _menuElement() {
  return document.getElementById('grimcraft-main-menu');
}

export function showMainMenu() {
  if (_hideConnectOverlay) {
    _hideConnectOverlay();
  }
  renderMenuList();
  const menu = _menuElement();
  if (menu) {
    menu.style.display = 'flex';
  }
}

export function hideMainMenu() {
  const menu = _menuElement();
  if (menu) {
    menu.style.display = 'none';
  }
}

function _onItemClick(item) {
  const screen = screenFor(item.id);
  if (item.id === 'credits') {
    renderCredits();
    return;
  }
  if (screen === 'stub') {
    renderStub(item.label);
    return;
  }
  hideMainMenu();
  if (_showConnectOverlay) {
    _showConnectOverlay(screen);
  }
}

function renderMenuList() {
  const list = document.getElementById('main-menu-list');
  if (!list) {
    return;
  }
  list.innerHTML = '';
  for (const item of MENU_ITEMS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'main-menu-btn';
    btn.textContent = item.label;
    btn.addEventListener('click', () => _onItemClick(item));
    list.appendChild(btn);
  }
  // Model source toggle: GLB files from models/ vs built-in procedural
  // meshes. Persisted; takes effect on the next game start.
  const modelsBtn = document.createElement('button');
  modelsBtn.type = 'button';
  modelsBtn.className = 'main-menu-btn';
  const paintModelsBtn = () => {
    modelsBtn.textContent = `MODELS: ${modelSource() === MODEL_SOURCE_PROCEDURAL ? 'PROCEDURAL' : 'GLB'}`;
  };
  paintModelsBtn();
  modelsBtn.addEventListener('click', () => {
    setModelSource(modelSource() === MODEL_SOURCE_PROCEDURAL ? MODEL_SOURCE_GLB : MODEL_SOURCE_PROCEDURAL);
    paintModelsBtn();
  });
  list.appendChild(modelsBtn);
  // Render quality button: LOW → MEDIUM → HIGH. Persisted; MSAA is a
  // construction-time flag, so applying a level reloads the page.
  const qualityBtn = document.createElement('button');
  qualityBtn.type = 'button';
  qualityBtn.className = 'main-menu-btn';
  qualityBtn.textContent = 'QUALITY: …';
  import('./scene.js').then((sceneModule) => {
    qualityBtn.textContent = `QUALITY: ${String(sceneModule.qualityTier()).toUpperCase()}`;
  }).catch(() => {
    qualityBtn.textContent = 'QUALITY: HIGH';
  });
  qualityBtn.addEventListener('click', () => {
    import('./scene.js').then((sceneModule) => {
      sceneModule.cycleQualityTier();
      window.location.reload();
    });
  });
  list.appendChild(qualityBtn);
}

function renderCredits() {
  const list = document.getElementById('main-menu-list');
  if (!list) {
    return;
  }
  list.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'main-menu-stub-title';
  title.textContent = 'Credits';
  list.appendChild(title);
  for (const name of ['Driptamine', 'Alexander Morgun']) {
    const line = document.createElement('div');
    line.className = 'main-menu-stub-note';
    line.textContent = name;
    list.appendChild(line);
  }
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'main-menu-btn';
  back.textContent = '‹ BACK';
  back.addEventListener('click', renderMenuList);
  list.appendChild(back);
}

function renderStub(label) {
  const list = document.getElementById('main-menu-list');
  if (!list) {
    return;
  }
  list.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'main-menu-stub-title';
  title.textContent = label;
  list.appendChild(title);
  const note = document.createElement('div');
  note.className = 'main-menu-stub-note';
  note.textContent = 'NOT IMPLEMENTED YET';
  list.appendChild(note);
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'main-menu-btn';
  back.textContent = '‹ BACK';
  back.addEventListener('click', renderMenuList);
  list.appendChild(back);
}

export async function injectMainMenu() {
  const multiplayer = await import('./multiplayer.js');
  _showConnectOverlay = multiplayer.showConnectOverlay;
  _hideConnectOverlay = multiplayer.hideConnectOverlay;
  multiplayer._injectConnectUI();
  _hideConnectOverlay();

  if (_menuElement()) {
    showMainMenu();
    return;
  }
  const overlay = document.createElement('div');
  overlay.id = 'grimcraft-main-menu';
  overlay.innerHTML = [
    '<div class="main-menu-side">',
    '<div class="main-menu-title">GRIMCRAFT</div>',
    '<div class="main-menu-art">200 × 200</div>',
    '<div id="main-menu-list" class="main-menu-list"></div>',
    '</div>',
  ].join('');
  const style = document.createElement('style');
  style.textContent = [
    '#grimcraft-main-menu { position:fixed; inset:0; z-index:10000; background:rgba(4,8,18,0.92); display:flex; align-items:center; justify-content:flex-end; }',
    '.main-menu-side { width:280px; margin-right:6vw; display:flex; flex-direction:column; gap:14px; background:rgba(10,18,35,0.97); border:1px solid rgba(80,200,255,0.35); padding:24px; font-family:\'Courier New\',monospace; box-shadow:0 0 40px rgba(80,200,255,0.15); }',
    '.main-menu-title { font-size:20px; letter-spacing:.3em; color:#50c8ff; text-align:center; }',
    '.main-menu-art { width:200px; height:200px; margin:0 auto; border:1px solid rgba(80,200,255,0.4); background:#06101f; display:flex; align-items:center; justify-content:center; color:#50c8ff; font-size:11px; letter-spacing:.2em; }',
    '.main-menu-list { display:flex; flex-direction:column; gap:8px; }',
    '.main-menu-btn { padding:10px; background:rgba(80,200,255,0.08); border:1px solid rgba(80,200,255,0.35); color:#cfeaff; font-family:\'Courier New\',monospace; font-size:12px; letter-spacing:.15em; cursor:pointer; text-align:center; }',
    '.main-menu-btn:hover { background:rgba(80,200,255,0.18); }',
    '.main-menu-stub-title { font-size:14px; letter-spacing:.2em; color:#ffc850; text-align:center; margin-top:4px; }',
    '.main-menu-stub-note { font-size:9px; letter-spacing:.2em; color:rgba(255,255,255,0.5); text-align:center; margin-bottom:6px; }',
  ].join(' ');
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  renderMenuList();

  window.__grimcraftShowMainMenu = showMainMenu;
}
