import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Run the real popup functions without booting Three.js or WebTransport.
const source = readFileSync(new URL('../src/net/multiplayer.ts', import.meta.url), 'utf8');
const popupCode = ts.transpileModule(
  source.slice(source.indexOf('let _r2Unsubscribe'), source.indexOf('function _updateLoadBar')),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } },
).outputText;

function popup(probe = () => new Promise(() => {})) {
  let now = 1000;
  let nextTimer = 1;
  const timers = new Map();
  const elements = new Map();
  function element() {
    let text = '';
    const node = { style: {}, appendChild() {}, writes: 0 };
    Object.defineProperty(node, 'id', { set(id) { elements.set(id, node); } });
    Object.defineProperty(node, 'textContent', {
      get: () => text,
      set(value) { text = value; node.writes++; },
    });
    Object.defineProperty(node.style, 'cssText', {
      set(value) { node.style.display = /(?:^|;)display:([^;]+)/.exec(value)?.[1] || ''; },
    });
    return node;
  }
  const context = vm.createContext({
    document: { getElementById: (id) => elements.get(id) || null, createElement: element, body: element() },
    window: {}, console: { log() {} }, Date: { now: () => now },
    setTimeout(fn, delay) { const id = nextTimer++; timers.set(id, { at: now + delay, fn }); return id; },
    clearTimeout(id) { timers.delete(id); }, setInterval: () => 1, clearInterval() {},
    resetR2Progress() {}, subscribeR2Progress: () => () => {},
    probeR2Cache: probe, collectBootR2Urls: () => ['model.glb'], ARENA_POSITION_FACTIONS: [],
    SP_MODEL_PATHS: {}, PLASMA_BOLT_PATH: '', PLASMA_FX_DIR: '', LASGUN_MODEL_PATH: '',
    createBootTimer: () => ({ start() {}, stop: () => 0, elapsedMs: () => 0 }),
    formatBootTime: () => '0s', _updateLoadBar() {}, _updateNetHUD() {},
  });
  vm.runInContext(popupCode, context);
  return {
    loading: (value) => context._setLoadingUI(value),
    report: (value) => context._renderR2Bar(value),
    el: (id) => elements.get(id),
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        timers.delete(next[0]);
        now = next[1].at;
        next[1].fn();
      }
      now = end;
    },
  };
}

function snapshot(overrides = {}) {
  return {
    totalFiles: 1, doneFiles: 0, loadedBytes: 10, totalBytes: 100,
    percent: 10, complete: false, failedFiles: 0,
    current: { index: 1, name: 'first.glb' }, ...overrides,
  };
}

describe('R2 popup lifecycle', () => {
  it('stays visible between sequential downloads and closes when battle loading ends', () => {
    const ui = popup();
    ui.loading(true);
    ui.report(snapshot({ doneFiles: 1, percent: 100, complete: true, current: null }));
    ui.advance(1000);
    ui.report(snapshot({ totalFiles: 2, doneFiles: 1, percent: 60 }));
    ui.advance(600);
    assert.equal(ui.el('r2-progress').style.display, 'block', 'a previous file cannot hide the next download');
    ui.advance(5000);
    assert.equal(ui.el('r2-progress').style.display, 'block');
    ui.loading(false);
    assert.equal(ui.el('r2-progress').style.display, 'none');
  });

  it('coalesces rapidly changing percentages and paints the latest pending update', () => {
    const ui = popup();
    ui.loading(true);
    ui.report(snapshot());
    const label = ui.el('r2-progress-label');
    const writes = label.writes;
    ui.advance(10);
    ui.report(snapshot({ percent: 20 }));
    ui.advance(10);
    ui.report(snapshot({ percent: 30, current: { index: 1, name: 'latest.glb' } }));
    assert.equal(label.writes, writes);
    ui.advance(130);
    assert.equal(label.writes, writes + 1);
    assert.equal(ui.el('r2-progress-fill').style.width, '30%');
    assert.ok(label.textContent.includes('latest.glb'));
    ui.advance(1);
    ui.report(snapshot({ percent: 100, complete: true, doneFiles: 1, current: null }));
    ui.advance(149);
    assert.equal(ui.el('r2-progress-fill').style.width, '100%', 'last update is not lost without more events');
    ui.loading(false);
  });

  it('cancels pending paints on close and resets progress for the next loading session', () => {
    const ui = popup();
    ui.loading(true);
    ui.report(snapshot({ percent: 80 }));
    ui.advance(10);
    ui.report(snapshot({ percent: 90 }));
    ui.loading(false);
    ui.advance(1000);
    assert.equal(ui.el('r2-progress').style.display, 'none');
    ui.loading(true);
    ui.report(snapshot({ percent: 5 }));
    ui.advance(1000);
    assert.equal(ui.el('r2-progress-fill').style.width, '5%');
    ui.loading(false);
  });

  it('ignores an old cache probe that finishes after closing or starting another battle', async () => {
    for (const restart of [false, true]) {
      const probes = [];
      const ui = popup(() => new Promise((resolve) => probes.push(resolve)));
      ui.loading(true);
      ui.report(snapshot());
      ui.loading(false);
      if (restart) {
        ui.loading(true);
        ui.report(snapshot({ percent: 25 }));
      }
      probes[0]({ checked: true, total: 1, cached: 1, missing: [] });
      await Promise.resolve();
      await Promise.resolve();
      assert.equal(ui.el('r2-progress').style.display, restart ? 'block' : 'none');
      assert.ok(!ui.el('r2-progress-label').textContent.includes('Already downloaded'));
      if (restart) ui.loading(false);
    }
  });

  it('keeps the cached-files summary stable until loading finishes', async () => {
    const ui = popup(async () => ({ checked: true, total: 1, cached: 1, missing: [] }));
    ui.loading(true);
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(ui.el('r2-progress-label').textContent.includes('Already downloaded'));
    ui.advance(3000);
    assert.equal(ui.el('r2-progress').style.display, 'block');
    ui.loading(false);
    assert.equal(ui.el('r2-progress').style.display, 'none');
  });
});
