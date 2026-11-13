import * as THREE from 'three';
import { scene, world, camera, selSquads, canCommand, BUILDING_BOUNDS, STRUCTURE_BOUNDS, AIRFIELD_BOUNDS, addBeforeRender, removeBeforeRender, getDeltaTime } from '../core/scene.js';
import { updateHUD } from '../core/hud.js';
import { _groundAt } from '../systems/terrain.js';
import { setCameraMode } from '../render/camera-fps.js';
import { lockCamera } from '../render/camera-lock.js';
import { createPlasmaPuffPreview, findPlasmaPuffPreviewCenter } from '../render/plasma-puff-preview.js';
import { PLASMA_CLOUD_PUFF_COUNT, plasmaCloudTuning, resetPlasmaCloudTuning } from '../fx/plasma-cloud-puff.js';

let closePreview: ((restoreCamera?: boolean) => void) | null = null;
type Tuning = { sizes: number[]; spread: number[]; blasterLength: number; blasterWidth: number };
const snapshot = (): Tuning => ({ ...plasmaCloudTuning, sizes: [...plasmaCloudTuning.sizes], spread: [...plasmaCloudTuning.spread] });
const apply = (value: Tuning): void => {
  plasmaCloudTuning.sizes = [...value.sizes];plasmaCloudTuning.spread = [...value.spread];
  plasmaCloudTuning.blasterLength = value.blasterLength;plasmaCloudTuning.blasterWidth = value.blasterWidth;
};

export function parsePlasmaTuning(text: string): Tuning {
  let value: any;
  try { value = JSON.parse(text); } catch { throw new Error('Некорректный JSON. Вставьте настройки, скопированные из редактора.'); }
  const list = (input: unknown, min: number, max: number): input is number[] => Array.isArray(input)
    && input.length === PLASMA_CLOUD_PUFF_COUNT && input.every(number => typeof number === 'number' && Number.isFinite(number) && number >= min && number <= max);
  if (!value || !list(value.sizes, .05, .5) || !list(value.spread, 0, 1)
    || typeof value.blasterLength !== 'number' || !Number.isFinite(value.blasterLength) || value.blasterLength < .2 || value.blasterLength > 2.5
    || typeof value.blasterWidth !== 'number' || !Number.isFinite(value.blasterWidth) || value.blasterWidth < .2 || value.blasterWidth > 3)
    throw new Error('Нужны 7 размеров (0.05–0.50), 7 позиций (0–1), длина луча (0.2–2.5) и ширина (0.2–3).');
  return { sizes: [...value.sizes], spread: [...value.spread], blasterLength: value.blasterLength, blasterWidth: value.blasterWidth };
}

const editorStyle = `
.plasma-editor{position:fixed;right:18px;top:72px;z-index:10000;width:354px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 90px);display:flex;flex-direction:column;color:#dce9f3;background:#101923f5;border:1px solid #426078;border-radius:12px;box-shadow:0 16px 56px #0008;font:13px/1.45 system-ui,sans-serif;box-sizing:border-box;color-scheme:dark;backdrop-filter:blur(12px)}
.plasma-editor *{box-sizing:border-box}.plasma-editor button,.plasma-editor input,.plasma-editor textarea{font:inherit}.plasma-editor button{cursor:pointer;color:#c9dcea;background:#1b2b39;border:1px solid #3b5265;border-radius:6px;padding:6px 9px;transition:background .12s,border-color .12s}.plasma-editor button:hover{background:#2a4052;border-color:#6f9ab8}.plasma-editor button:disabled{opacity:.35;cursor:default}.plasma-editor :focus-visible{outline:2px solid #8cd9ff;outline-offset:2px}.plasma-editor h2,.plasma-editor p{margin:0}.plasma-editor h2{font-size:17px;font-weight:650;letter-spacing:-.3px}
.plasma-editor-head{padding:14px 16px 11px;border-bottom:1px solid #2b3d4d;display:flex;justify-content:space-between;align-items:center}.plasma-editor-eyebrow{font-size:10px;letter-spacing:1.6px;color:#829eb2;margin-bottom:3px}.plasma-editor-body{overflow:auto;overscroll-behavior:contain;padding:14px 16px;display:grid;gap:16px;min-height:0}.plasma-editor-section{display:grid;gap:9px}.plasma-editor-label{color:#9ab0c0;font-size:11px;letter-spacing:.8px;text-transform:uppercase}.plasma-editor-row{display:flex;align-items:center;gap:7px}.plasma-editor-row.between{justify-content:space-between}.plasma-editor-muted{color:#88a2b5;font-size:11px}.plasma-editor-puffs{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}.plasma-editor-puffs button{height:55px;padding:5px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-size:11px}.plasma-editor-puffs button[aria-pressed=true]{color:#d8f5ff;border-color:#85d7fa;background:#23465b;box-shadow:inset 0 0 0 1px #85d7fa33}.plasma-editor-dot{display:block;border-radius:50%;background:radial-gradient(circle,#c2eeff88,#6ba9e544 50%,#3e73ba08 75%);border:1px solid #74b4da55}
.plasma-editor-direction{display:flex;align-items:center;gap:10px;color:#83a8c0;font-size:10px}.plasma-editor-direction span:nth-child(2){flex:1;height:1px;position:relative;background:linear-gradient(90deg,#456984,#8bd5fd)}.plasma-editor-direction span:nth-child(2):after{content:'';position:absolute;right:0;top:-3px;border-left:5px solid #8bd5fd;border-top:3px solid transparent;border-bottom:3px solid transparent}.plasma-editor-field{display:grid;grid-template-columns:1fr 66px;gap:3px 10px;align-items:center}.plasma-editor-field label{font-size:12px;color:#c0d1df}.plasma-editor-field input[type=range]{grid-column:1/-1;width:100%;margin:2px 0 4px;accent-color:#8bc9ee;height:18px;cursor:pointer}.plasma-editor-field input[type=number]{width:66px;padding:4px 5px;text-align:right;font-variant-numeric:tabular-nums;color:#d8f2ff;background:#0b131d;border:1px solid #344e62;border-radius:5px}.plasma-editor-history{display:flex;gap:5px}.plasma-editor-history button{flex:1}.plasma-editor-primary{background:#284b60!important;border-color:#568ca9!important;color:#e1f6ff!important}.plasma-editor details{border-top:1px solid #2b3d4d;padding-top:10px}.plasma-editor summary{cursor:pointer;color:#a1bdd1;font-size:12px}.plasma-editor textarea{display:block;resize:vertical;min-height:108px;width:100%;padding:9px;margin:9px 0;color:#a6d8f2;background:#0a121c;border:1px solid #344e62;border-radius:6px;font:11px/1.4 ui-monospace,monospace}.plasma-editor-status{font-size:11px;color:#b4d9ca;min-height:16px}.plasma-editor-foot{padding:10px 16px 12px;border-top:1px solid #2b3d4d;display:grid;gap:7px}.plasma-editor-foot .plasma-editor-row button:last-child{margin-left:auto;min-width:92px}
@media(max-width:620px){.plasma-editor{top:auto;bottom:10px;right:12px;width:calc(100vw - 24px);max-height:49dvh}.plasma-editor-head{padding:10px 14px}.plasma-editor-body{padding:12px 14px}.plasma-editor-foot{padding:8px 14px}.plasma-editor h2{font-size:15px}}
`;

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);node.className = className;if (text) node.textContent = text;return node;
}

export function isPlasmaPuffPreviewOpen(): boolean { return closePreview !== null; }

export function togglePlasmaPuffPreview(): void {
  if (closePreview) { closePreview();return; }
  if (!scene || !camera?.target) return;
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
  const selected = selSquads.filter((id: number) => canCommand(world?.get(id, 'squad')?.team));
  const center = findPlasmaPuffPreviewCenter(world, selected, right, _groundAt, (kind, type) => {
    if (kind === 'airfield') return AIRFIELD_BOUNDS;
    const bounds: Record<string, number> = kind === 'building' ? BUILDING_BOUNDS : STRUCTURE_BOUNDS;
    return bounds[type] ?? 3.5;
  });
  if (!center) return;
  const previewScene = scene, previewWorld = world, previewCamera = camera;
  const saved = { target: camera.target.clone(), alpha: camera.alpha, beta: camera.beta, radius: camera.radius, lowerRadiusLimit: camera.lowerRadiusLimit };
  const preview = createPlasmaPuffPreview(scene, center, right);
  setCameraMode('orbit');camera.target.copy(center);camera.lowerRadiusLimit = Math.min(camera.lowerRadiusLimit, 1.5);camera.radius = 4;camera.beta = Math.PI / 3;
  const releaseCamera = lockCamera(camera);
  let selectedPuff = 0, playing = true, speed = 1;
  const undoStack: Tuning[] = [], redoStack: Tuning[] = [];
  let pendingEdit: Tuning | null = null;
  const original = snapshot();
  const panel = element('aside', 'plasma-editor');panel.id = 'plasma-puff-preview-toolbar';panel.setAttribute('role', 'dialog');panel.setAttribute('aria-labelledby', 'plasma-editor-title');
  const style = element('style');style.textContent = editorStyle;panel.append(style);
  const head = element('header', 'plasma-editor-head'), titles = element('div');
  const title = element('h2', '', 'Редактор плазмы');title.id = 'plasma-editor-title';
  titles.append(element('div', 'plasma-editor-eyebrow', 'PLASMA CLOUD PUFF'), title);head.append(titles);panel.append(head);
  const body = element('div', 'plasma-editor-body');body.id = 'plasma-puff-tuning';panel.append(body);
  const button = (label: string, action: () => void, parent: HTMLElement, id: string, tooltip = ''): HTMLButtonElement => {
    const node = element('button', '', label);node.type = 'button';node.id = id;node.title = tooltip || label;
    node.addEventListener('click', action);parent.append(node);return node;
  };
  button('✕', () => closePreview?.(), head, 'plasma-editor-close', 'Закрыть · Esc').setAttribute('aria-label', 'Закрыть редактор');
  const history = element('div', 'plasma-editor-history');body.append(history);
  const commitPending = (): void => {
    if (!pendingEdit) return;
    if (JSON.stringify(pendingEdit) !== JSON.stringify(snapshot())) { undoStack.push(pendingEdit);if (undoStack.length > 50) undoStack.shift();redoStack.length = 0; }
    pendingEdit = null;
  };
  const change = (operation: () => void): void => { commitPending();pendingEdit = snapshot();operation();commitPending();refresh(); };
  const undo = (): void => { commitPending();const value = undoStack.pop();if (value) { redoStack.push(snapshot());apply(value); }refresh(); };
  const redo = (): void => { commitPending();const value = redoStack.pop();if (value) { undoStack.push(snapshot());apply(value); }refresh(); };
  const undoButton = button('↶ Отменить', undo, history, 'plasma-editor-undo', 'Отменить изменение · Ctrl/⌘ Z');
  const redoButton = button('↷ Повторить', redo, history, 'plasma-editor-redo', 'Повторить · Ctrl/⌘ Shift Z');
  const clouds = element('section', 'plasma-editor-section');body.append(clouds);
  clouds.append(element('div', 'plasma-editor-label', 'Выберите облако'));
  const chooser = element('div', 'plasma-editor-puffs');chooser.setAttribute('aria-label', 'Облака плазмы');clouds.append(chooser);
  const dots: HTMLElement[] = [], choices: HTMLButtonElement[] = [];
  const choose = (index: number): void => { commitPending();selectedPuff = index;preview.select(index);refresh(); };
  for (let index = 0; index < PLASMA_CLOUD_PUFF_COUNT; index++) {
    const choice = button('', () => choose(index), chooser, `plasma-puff-${index + 1}`, `Облако ${index + 1}`);
    const dot = element('span', 'plasma-editor-dot');choice.append(dot, element('span', '', String(index + 1)));choices.push(choice);dots.push(dot);
    choice.setAttribute('aria-label', `Облако ${index + 1}`);
  }
  const direction = element('div', 'plasma-editor-direction');direction.append(element('span', '', 'СТРЕЛОК'), element('span'), element('span', '', 'ЦЕЛЬ'));clouds.append(direction);
  const puffTitle = element('div', 'plasma-editor-label');clouds.append(puffTitle);
  type Control = { range: HTMLInputElement; number: HTMLInputElement; sync(): void };
  const controls: Control[] = [];
  const field = (parent: HTMLElement, label: string, key: string, min: number, max: number, step: number,
    get: () => number, set: (value: number) => void, record = true): Control => {
    const row = element('div', 'plasma-editor-field'), name = element('label', '', label);
    const number = element('input'), range = element('input');number.type = 'number';range.type = 'range';
    name.htmlFor = number.id = `plasma-${key}-number`;range.id = `plasma-${key}`;
    for (const input of [number, range]) {
      input.min = String(min);input.max = String(max);input.step = String(step);input.dataset.tuning = key;input.setAttribute('aria-label', label);
      const inputValue = (): void => {
        if (input.value.trim() === '') return;
        const parsed = Number(input.value);if (!Number.isFinite(parsed)) return;
        if (record && !pendingEdit) pendingEdit = snapshot();
        const value = Math.round(THREE.MathUtils.clamp(parsed, min, max) / step) * step;
        set(Number(value.toFixed(4)));refresh(input);
      };
      input.addEventListener('input', inputValue);
      input.addEventListener('change', () => { inputValue();commitPending();refresh(); });
    }
    row.append(name, number, range);parent.append(row);
    const control: Control = { range, number, sync() {
      range.value = String(Number(get().toFixed(4)));number.value = step >= 1 ? String(Math.round(get())) : get().toFixed(2);
    } };
    controls.push(control);return control;
  };
  field(clouds, 'Размер', 'puff-size', .05, .5, .01, () => plasmaCloudTuning.sizes[selectedPuff], value => { plasmaCloudTuning.sizes[selectedPuff] = value; });
  field(clouds, 'Положение на луче, %', 'puff-position', 0, 100, 1, () => plasmaCloudTuning.spread[selectedPuff] * 100, value => { plasmaCloudTuning.spread[selectedPuff] = value / 100; });
  button('⇄ Развернуть форму', () => change(() => { plasmaCloudTuning.sizes.reverse(); }), clouds, 'plasma-editor-reverse', 'Поменять порядок размеров облаков от стрелка к цели');
  const beam = element('section', 'plasma-editor-section');beam.append(element('div', 'plasma-editor-label', 'Синий луч'));body.append(beam);
  field(beam, 'Длина', 'beam-length', .2, 2.5, .05, () => plasmaCloudTuning.blasterLength, value => { plasmaCloudTuning.blasterLength = value; });
  field(beam, 'Толщина', 'beam-width', .2, 3, .05, () => plasmaCloudTuning.blasterWidth, value => { plasmaCloudTuning.blasterWidth = value; });
  const playback = element('section', 'plasma-editor-section');playback.append(element('div', 'plasma-editor-label', 'Предпросмотр'));body.append(playback);
  const playbackButtons = element('div', 'plasma-editor-row');playback.append(playbackButtons);
  const playButton = button('Ⅱ Пауза', () => { playing = !playing;refresh(); }, playbackButtons, 'plasma-editor-play');
  button('↺ Сначала', () => { preview.setTime(0);refresh(); }, playbackButtons, 'plasma-editor-restart');
  const stage = element('span', 'plasma-editor-muted');playbackButtons.append(stage);
  field(playback, 'Скорость', 'preview-speed', .1, 2, .1, () => speed, value => { speed = value; }, false);
  const timeline = field(playback, 'Кадр, %', 'preview-time', 0, 100, 1,
    () => (preview.time % preview.duration) / preview.duration * 100,
    value => { playing = false;preview.setTime(Math.min(value, 99.99) / 100 * preview.duration); }, false);
  const json = element('details'), summary = element('summary', '', 'Скопировать или загрузить настройки');json.append(summary);body.append(json);
  const values = element('textarea');values.id = 'plasma-tuning-values';values.spellcheck = false;values.setAttribute('aria-label', 'Настройки плазмы в JSON');json.append(values);
  let editingJson = false;
  values.addEventListener('input', () => { editingJson = true; });
  const jsonButtons = element('div', 'plasma-editor-row');json.append(jsonButtons);
  const status = element('p', 'plasma-editor-status');status.id = 'plasma-editor-status';status.setAttribute('role', 'status');json.append(status);
  button('Копировать', () => {
    editingJson = false;refresh();
    const fallback = (): void => { values.focus?.();values.select?.();status.textContent = 'Текст выделен — скопируйте его вручную.'; };
    try {
      if (!navigator.clipboard?.writeText) { fallback();return; }
      void navigator.clipboard.writeText(values.value).then(() => { if (panel.parentNode) status.textContent = 'Настройки скопированы.'; }, fallback);
    } catch { fallback(); }
  }, jsonButtons, 'plasma-editor-copy');
  button('Применить JSON', () => {
    try { const value = parsePlasmaTuning(values.value);change(() => apply(value));editingJson = false;refresh();status.textContent = 'Настройки применены.'; }
    catch (error) { status.textContent = error instanceof Error ? error.message : 'Не удалось прочитать JSON.'; }
  }, jsonButtons, 'plasma-editor-import');
  const foot = element('footer', 'plasma-editor-foot');panel.append(foot);
  foot.append(element('p', 'plasma-editor-muted', 'Изменения видны сразу и применяются к новым выстрелам.'));
  const actions = element('div', 'plasma-editor-row');foot.append(actions);
  button('Сбросить', () => change(resetPlasmaCloudTuning), actions, 'plasma-editor-reset', 'Вернуть исходные настройки; редактор останется открыт');
  button('Как было', () => change(() => apply(original)), actions, 'plasma-editor-restore', 'Вернуть настройки, с которыми был открыт редактор');
  button('Готово', () => closePreview?.(), actions, 'plasma-editor-done').className = 'plasma-editor-primary';
  foot.append(element('p', 'plasma-editor-muted', '1–7 — облако · Пробел — пауза · Esc — закрыть'));
  function refresh(active?: HTMLInputElement): void {
    for (const control of controls) {
      // Keep a partially typed number intact while the linked slider updates.
      const typed = active === control.number ? active.value : null;
      control.sync();if (typed != null) control.number.value = typed;
    }
    puffTitle.textContent = `Облако ${selectedPuff + 1} из ${PLASMA_CLOUD_PUFF_COUNT}`;
    for (let index = 0; index < choices.length; index++) {
      choices[index].setAttribute('aria-pressed', String(index === selectedPuff));
      choices[index].title = `Облако ${index + 1} · ${plasmaCloudTuning.sizes[index].toFixed(2)} · ${Math.round(plasmaCloudTuning.spread[index] * 100)}% пути`;
      const size = `${12 + plasmaCloudTuning.sizes[index] * 38}px`;dots[index].style.width = dots[index].style.height = size;
    }
    undoButton.disabled = undoStack.length === 0 && pendingEdit == null;redoButton.disabled = redoStack.length === 0;
    playButton.textContent = playing ? 'Ⅱ Пауза' : '▶ Играть';
    playButton.setAttribute('aria-pressed', String(!playing));
    stage.textContent = `Стадия ${Math.min(3, Math.floor((preview.time % preview.duration) / preview.duration * 3) + 1)} / 3`;
    if (!editingJson) values.value = JSON.stringify(snapshot(), null, 2);
    preview.setTime(preview.time);
  }
  panel.addEventListener('keydown', event => event.stopPropagation());
  const keyboard = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null;
    if (event.code === 'Escape') { event.preventDefault?.();event.stopImmediatePropagation?.();closePreview?.();return; }
    if ((event.ctrlKey || event.metaKey) && target?.tagName !== 'TEXTAREA' && (event.code === 'KeyZ' || event.code === 'KeyY')) {
      event.preventDefault();event.stopImmediatePropagation();
      if (event.code === 'KeyY' || event.shiftKey) redo();else undo();
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey && !['INPUT', 'TEXTAREA'].includes(target?.tagName || '') && /^Digit[1-7]$/.test(event.code)) {
      event.preventDefault();event.stopImmediatePropagation();choose(Number(event.code.slice(-1)) - 1);
    } else if (event.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(target?.tagName || '')) {
      event.preventDefault();event.stopImmediatePropagation();playing = !playing;refresh();
    }
  };
  window.addEventListener('keydown', keyboard, true);
  document.body.append(panel);preview.select(0);refresh();
  const tick = addBeforeRender(() => {
    if (scene !== previewScene || world !== previewWorld || camera !== previewCamera) { closePreview?.(false);return; }
    if (playing) { preview.update(getDeltaTime() * speed);timeline.sync(); }
    stage.textContent = `Стадия ${Math.min(3, Math.floor((preview.time % preview.duration) / preview.duration * 3) + 1)} / 3`;
  });
  closePreview = (restoreCamera = true): void => {
    releaseCamera();
    closePreview = null;removeBeforeRender(tick);window.removeEventListener('keydown', keyboard, true);panel.remove();preview.dispose();
    if (camera === previewCamera) {
      camera.lowerRadiusLimit = saved.lowerRadiusLimit;
      if (restoreCamera) { camera.target.copy(saved.target);camera.alpha = saved.alpha;camera.beta = saved.beta;camera.radius = saved.radius; }
    }
    updateHUD();
  };
  updateHUD();
}
