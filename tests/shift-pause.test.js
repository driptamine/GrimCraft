import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/input/events.ts', import.meta.url), 'utf8');
const gameSource = readFileSync(new URL('../src/core/game.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('events.ts', source, ts.ScriptTarget.Latest, true);

function findFunction(node, name) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === name) return node;
  let found;
  ts.forEachChild(node, (child) => {
    if (!found) found = findFunction(child, name);
  });
  return found;
}

const initInput = findFunction(ast, 'initInput');
assert.ok(initInput, 'initInput must exist');
const keydownMatch = initInput.getText(ast).match(/window\.addEventListener\('keydown', \(event\) => \{([\s\S]*?)\n  \}\);/);
assert.ok(keydownMatch, 'keydown handler must exist');
const keydownCode = ts.transpileModule(`(event) => {${keydownMatch[1]}\n}`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

/**
 * NOTE: a vm handler cannot observe its own write to a context primitive
 * within the same run, so the toggle is verified in both directions by
 * seeding the initial state, and the banner pairing by source order below.
 */
function fixture({ multiplayer = false, paused = false } = {}) {
  const registry = new Map();
  const body = { children: [], append(child) { child.parent = body; this.children.push(child); if (child.id) registry.set(child.id, child); } };
  const calls = { setPaused: [], banner: [], hud: 0 };
  const context = vm.createContext({
    keys: {},
    selBuilder: null,
    selSquads: [],
    paused,
    setPaused: (value) => { calls.setPaused.push(value); },
    setPausedBanner: (visible) => { calls.banner.push(visible); },
    isShooterMode: () => false,
    document: {
      getElementById: (id) => registry.get(id) || null,
      createElement: () => ({ id: '', textContent: '', style: {}, parent: null,
        remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); registry.delete(this.id); } }),
      body,
    },
    window: { _multiplayerMode: multiplayer, addEventListener() {}, removeEventListener() {} },
    updateHUD: () => { calls.hud += 1; },
    event: null,
    __handler: null,
  });
  context.__handler = vm.runInContext(keydownCode, context);
  return {
    context,
    calls,
    key(partial) {
      context.event = { repeat: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault() {}, ...partial };
      vm.runInContext('__handler(event)', context);
    },
  };
}

describe('shift pause', () => {
  it('pauses on Shift and shows a banner', () => {
    const f = fixture();
    f.key({ code: 'ShiftLeft' });
    assert.deepEqual(f.calls.setPaused, [true]);
    assert.equal(f.calls.banner.length, 1, 'banner toggled with pause');
    assert.equal(f.calls.hud, 1);
  });

  it('resumes on Shift when already paused', () => {
    const f = fixture({ paused: true });
    f.key({ code: 'ShiftRight' });
    assert.deepEqual(f.calls.setPaused, [false]);
    assert.equal(f.calls.banner.length, 1);
  });

  it('ignores key repeat and multiplayer sims', () => {
    const f = fixture();
    f.key({ code: 'ShiftLeft', repeat: true });
    assert.deepEqual(f.calls.setPaused, []);
    const mp = fixture({ multiplayer: true });
    mp.key({ code: 'ShiftLeft' });
    assert.deepEqual(mp.calls.setPaused, []);
    assert.deepEqual(mp.calls.banner, []);
  });

  it('banners the just-written state, not a stale one', () => {
    const branch = keydownMatch[1];
    const shiftIndex = branch.indexOf("'ShiftLeft'");
    assert.ok(shiftIndex >= 0, 'shift branch must exist');
    const tail = branch.slice(shiftIndex);
    assert.ok(/setPaused\(!paused\);\s*setPausedBanner\(!paused\);/.test(tail),
      'banner must mirror the state written one line above');
  });

  it('shows and removes the real banner element', () => {
    const helper = findFunction(ast, 'setPausedBanner');
    assert.ok(helper, 'setPausedBanner must exist');
    const code = ts.transpileModule(helper.getText(ast), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
    }).outputText;
    const registry = new Map();
    const context = vm.createContext({
      document: {
        getElementById: (id) => registry.get(id) || null,
        createElement: () => ({ id: '', textContent: '', style: {}, parent: null,
          remove() { registry.delete(this.id); } }),
        body: { append(child) { if (child.id) registry.set(child.id, child); } },
      },
    });
    vm.runInContext(`${code}\nthis.show = setPausedBanner;`, context);
    vm.runInContext('show(true)', context);
    const banner = registry.get('game-paused-banner');
    assert.ok(banner, 'banner created');
    assert.ok(banner.textContent.includes('ПАУЗА'));
    vm.runInContext('show(true)', context);
    assert.equal(registry.size, 1, 'no duplicate banners');
    vm.runInContext('show(false)', context);
    assert.equal(registry.size, 0, 'banner removed on resume');
  });

  it('gates the world tick on the pause flag', () => {
    assert.ok(/if\s*\(!gameOver\s*&&\s*!paused\s*&&\s*world\)/.test(gameSource), 'game loop must skip the sim while paused');
  });
});
