import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { readFileSync } from 'node:fs';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const {
  STRATEGIC_POINT_CLIPS,
  STRATEGIC_POINT_HIDDEN_NODES,
  POINT_PRE_PLANT_RISE,
  nextStrategicPointAnim,
  raiseScrubProgress,
  _wirePointAnims,
  makeStrategicPointMesh,
} = await import('../src/meshes.js');

function approx(actual, expected, eps = 1e-9) {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${actual} ≈ ${expected}`);
}

function glbClipNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return (json.animations || []).map((a) => a.name);
}

function fakeGroup(name) {
  const callbacks = [];
  return {
    name,
    starts: 0,
    loopArg: null,
    loopAnimation: true,
    stop() {},
    reset() {},
    start(loop) {
      this.starts += 1;
      this.loopArg = loop;
    },
    onAnimationGroupEndObservable: {
      addOnce(cb) {
        callbacks.push(cb);
      },
      clear() {
        callbacks.length = 0;
      },
    },
    _fireEnd() {
      callbacks.splice(0).forEach((cb) => cb());
    },
  };
}

describe('strategic point capture anims', () => {
  it('maps each kind to clips carried by its glb', () => {
    assert.deepEqual(STRATEGIC_POINT_CLIPS.point, {
      idle: 'uncaptured_idle', open: 'uncaptured_open', raise: 'captured_raise', captured: 'captured_idle',
    });
    assert.deepEqual(STRATEGIC_POINT_CLIPS.relic, {
      idle: 'ol_uncaptured_idle', open: 'ol_uncaptured_open', raise: 'ol_captured_raise', captured: 'ol_captured_idle',
    });
    const pointClips = glbClipNames(new URL('../models/points/strategic_point.glb', import.meta.url));
    for (const clip of ['uncaptured_idle', 'uncaptured_open', 'captured_raise', 'captured_idle']) {
      assert.ok(pointClips.includes(clip), `${clip} exists`);
    }
    const relicClips = glbClipNames(new URL('../models/points/relic.glb', import.meta.url));
    for (const clip of ['ol_uncaptured_idle', 'ol_uncaptured_open', 'ol_captured_raise', 'ol_captured_idle']) {
      assert.ok(relicClips.includes(clip), `${clip} exists`);
    }
  });

  it('loops idle while neutral and untouched', () => {
    const d = nextStrategicPointAnim({ owner: null, beingCaptured: false, animState: undefined, currentAnim: null });
    assert.deepEqual(d, { play: 'idle', loop: true, state: 'idle', scrub: null });
    const stay = nextStrategicPointAnim({ owner: null, beingCaptured: false, animState: 'idle', currentAnim: 'idle' });
    assert.deepEqual(stay, { play: null, loop: false, state: 'idle', scrub: null });
  });

  it('plays open once, then scrubs raise by capture progress', () => {
    const start = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'idle', currentAnim: 'idle', progress: 0, planted: false, raiseFrom: null });
    assert.deepEqual(start, { play: 'open', loop: false, state: 'opening', scrub: null });
    const playing = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'opening', currentAnim: 'open', progress: 0.1, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(playing, { play: null, loop: false, state: 'opening', scrub: null });
    const opened = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'opening', currentAnim: null, progress: 0.1, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(opened, { play: 'raise', loop: false, state: 'raising', scrub: POINT_PRE_PLANT_RISE });
    const mid = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'raising', currentAnim: 'raise', progress: 0.625, planted: true, raiseFrom: 0.25 });
    assert.equal(mid.play, 'raise');
    assert.equal(mid.state, 'raising');
    approx(mid.scrub, 0.6);
    const enemySide = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'raising', currentAnim: 'raise', progress: -0.625, planted: true, raiseFrom: 0.25 });
    approx(enemySide.scrub, 0.6);
  });

  it('holds the 20% pre-rise while the planter works, then raises', () => {
    assert.equal(POINT_PRE_PLANT_RISE, 0.2);
    const hold = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'opening', currentAnim: null, progress: 0.1, planted: false, raiseFrom: null });
    assert.deepEqual(hold, { play: 'raise', loop: false, state: 'opening', scrub: POINT_PRE_PLANT_RISE });
    const raisingHold = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'raising', currentAnim: 'raise', progress: 0.3, planted: false, raiseFrom: null });
    assert.deepEqual(raisingHold, { play: null, loop: false, state: 'raising', scrub: null });
    const fromPreRise = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'opening', currentAnim: 'raise', progress: 0.1, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(fromPreRise, { play: 'raise', loop: false, state: 'raising', scrub: POINT_PRE_PLANT_RISE });
  });

  it('re-enters scrub when a raised point is contested, idles when left', () => {
    const contested = nextStrategicPointAnim({ owner: null, beingCaptured: true, animState: 'raised', currentAnim: 'captured', progress: 0.625, planted: true, raiseFrom: 0.5 });
    assert.deepEqual(contested, { play: 'raise', loop: false, state: 'raising', scrub: 0.4 });
    const d = nextStrategicPointAnim({ owner: null, beingCaptured: false, animState: 'raising', currentAnim: 'raise', progress: 0.4, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(d, { play: 'idle', loop: true, state: 'idle', scrub: null });
    const left = nextStrategicPointAnim({ owner: null, beingCaptured: false, animState: 'raised', currentAnim: 'captured', progress: 0.4, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(left, { play: 'idle', loop: true, state: 'idle', scrub: null });
  });

  it('puts owned points straight into the raised loop', () => {
    const d = nextStrategicPointAnim({ owner: 'blue', beingCaptured: true, animState: 'idle', currentAnim: 'idle', progress: 1, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(d, { play: 'captured', loop: true, state: 'raised', scrub: null });
    const hold = nextStrategicPointAnim({ owner: 'blue', beingCaptured: false, animState: 'raised', currentAnim: 'captured', progress: 1, planted: true, raiseFrom: 0.1 });
    assert.deepEqual(hold, { play: null, loop: false, state: 'raised', scrub: null });
  });

  it('maps either capture side onto the raise clip from the plant mark', () => {
    assert.equal(raiseScrubProgress(0, 0), POINT_PRE_PLANT_RISE);
    approx(raiseScrubProgress(0.5, 0), 0.6);
    approx(raiseScrubProgress(-0.5, 0), 0.6);
    assert.equal(raiseScrubProgress(0.1, 0.1), POINT_PRE_PLANT_RISE);
    assert.equal(raiseScrubProgress(1, 0.1), 1);
    assert.equal(raiseScrubProgress(0.05, 0.1), POINT_PRE_PLANT_RISE);
    approx(raiseScrubProgress(0.625, 0.25), 0.6);
    assert.equal(raiseScrubProgress(-2, 0), 1);
    assert.equal(raiseScrubProgress(null, null), POINT_PRE_PLANT_RISE);
  });

  it('wires point slots and clears _currentAnim when the one-shot ends', () => {
    const idle = fakeGroup('uncaptured_idle');
    const open = fakeGroup('uncaptured_open');
    const raise = fakeGroup('captured_raise');
    const captured = fakeGroup('captured_idle');
    const model = { _animationGroups: [idle, open, raise, captured] };
    _wirePointAnims(model, 'point');
    assert.equal(model._animGroups.idle, idle);
    assert.equal(model._animGroups.open, open);
    assert.equal(model._animGroups.raise, raise);
    assert.equal(model._animGroups.captured, captured);
    model._playAnim('idle');
    assert.equal(model._currentAnim, 'idle');
    assert.equal(idle.starts, 1);
    assert.equal(idle.loopArg, true);
    model._playAnim('idle');
    assert.equal(idle.starts, 1);
    model._playAnim('open', false);
    assert.equal(model._currentAnim, 'open');
    assert.equal(open.loopArg, false);
    open._fireEnd();
    assert.equal(model._currentAnim, null);
    model._playAnim('missing');
    assert.equal(model._currentAnim, null);
  });

  it('wires relic slots from the ol_ clips only', () => {
    const idle = fakeGroup('ol_uncaptured_idle');
    const open = fakeGroup('ol_uncaptured_open');
    const raise = fakeGroup('ol_captured_raise');
    const captured = fakeGroup('ol_captured_idle');
    const other = fakeGroup('uncaptured_idle');
    const model = { _animationGroups: [idle, open, raise, captured, other] };
    _wirePointAnims(model, 'relic');
    assert.equal(model._animGroups.idle, idle);
    assert.equal(model._animGroups.open, open);
    assert.equal(model._animGroups.raise, raise);
    assert.equal(model._animGroups.captured, captured);
    const pointModel = { _animationGroups: [idle, open] };
    _wirePointAnims(pointModel, 'point');
    assert.deepEqual(Object.keys(pointModel._animGroups), []);
  });

  it('lists every faction banner and rod explicitly', () => {
    for (const name of [
      'chaos_banner', 'chaos_banner_rod',
      'guard_banner', 'guard_banner_rod',
      'marine_sergeant_banner', 'marine_sergeant_banner_rod',
      'tau_banner', 'tau_banner_rod',
      'eldar_flag', 'eldar_flag_pole',
      'ork_flag', 'ork_flag_pole',
    ]) {
      assert.ok(STRATEGIC_POINT_HIDDEN_NODES.includes(name), `${name} is hidden`);
    }
  });

  it('exposes the model slot on the viz (null without a container)', () => {
    const viz = makeStrategicPointMesh(1, 2);
    assert.equal(viz.model, null);
  });
});
