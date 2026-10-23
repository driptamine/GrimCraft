import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSystemsSource } from './systems-src.mjs';
import { CAPTURE_SEQUENCE, nextCaptureStage, guardCaptureAnim, captureClipDone, isPointCapturedBy, GUARD_CAPTURE_SEQUENCE, nextGuardCaptureStage, isPlantingDone, planterBannerShown } from '../src/soldier-aim.js';

function glbClipNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return (json.animations || []).map((a) => a.name);
}

describe('capture anims', () => {
  it('guardsmen.glb carries the planter and capturer clips', () => {
    const names = glbClipNames(new URL('../models/ig/infantry/guardsmen.glb', import.meta.url));
    for (const clip of ['flag_plant_1', 'flag_plant_2', 'capture_strategic_point_1', 'capture_strategic_point_2']) {
      assert.ok(names.includes(clip), `${clip} exists`);
    }
  });

  it('planter sequence plays four one-shots then holds the last stage', () => {
    assert.deepEqual(CAPTURE_SEQUENCE, ['flagPlant1', 'flagPlant2', 'capture1', 'capture2']);
    let next = nextCaptureStage(0, 'idle', null);
    assert.deepEqual(next, { stage: 0, want: 'flagPlant1' });
    next = nextCaptureStage(0, null, 'flagPlant1');
    assert.deepEqual(next, { stage: 1, want: 'flagPlant2' });
    next = nextCaptureStage(1, null, 'flagPlant2');
    assert.deepEqual(next, { stage: 2, want: 'capture1' });
    next = nextCaptureStage(2, null, 'capture1');
    assert.deepEqual(next, { stage: 3, want: 'capture2' });
    next = nextCaptureStage(3, 'capture2', 'capture2');
    assert.deepEqual(next, { stage: 3, want: 'capture2' });
  });

  it('sequencer ignores mid-play ticks and clamps bad stages', () => {
    assert.deepEqual(nextCaptureStage(0, 'flagPlant1', 'flagPlant1').stage, 0);
    assert.deepEqual(nextCaptureStage(undefined, null, null), { stage: 0, want: 'flagPlant1' });
    assert.deepEqual(nextCaptureStage(99, 'capture2', 'capture2'), { stage: 3, want: 'capture2' });
  });

  it('detects a finished one-shot capture clip', () => {
    assert.equal(captureClipDone('capture1', 'capture1', null), true);
    assert.equal(captureClipDone('capture1', 'capture1', undefined), true);
    assert.equal(captureClipDone('capture1', 'capture1', 'capture1'), false);
    assert.equal(captureClipDone('capture1', null, null), false);
    assert.equal(captureClipDone('capture1', 'flagPlant2', null), false);
  });

  it('all guards use capture2 until the point is captured', () => {
    for (const idx of [1, 2, 3, 4]) {
      assert.equal(guardCaptureAnim(idx), 'capture2');
    }
    assert.equal(isPointCapturedBy('blue', 'blue'), true);
    assert.equal(isPointCapturedBy('red', 'blue'), false);
    assert.equal(isPointCapturedBy(null, 'blue'), false);
  });

  it('planting finishes when flag_plant_2 ends (stage 2+)', () => {
    assert.equal(isPlantingDone({ captureStage: 0, hasPlantAnims: true }), false);
    assert.equal(isPlantingDone({ captureStage: 1, hasPlantAnims: true }), false);
    assert.equal(isPlantingDone({ captureStage: 2, hasPlantAnims: true }), true);
    assert.equal(isPlantingDone({ captureStage: undefined, hasPlantAnims: true }), false);
    assert.equal(isPlantingDone({ captureStage: 0, hasPlantAnims: false }), true);
  });

  it('planter backs off after the plants, before the capture clips', () => {
    assert.deepEqual(CAPTURE_SEQUENCE.slice(0, 2), ['flagPlant1', 'flagPlant2']);
    assert.deepEqual(CAPTURE_SEQUENCE.slice(2), ['capture1', 'capture2']);
    // Stage 2 = plants done (leave now), capture clips still ahead.
    assert.equal(isPlantingDone({ captureStage: 2, hasPlantAnims: true }), true);
    assert.equal(CAPTURE_SEQUENCE[2], 'capture1');
  });

  it('capture clips wait for the back-off, leave waits for the plants', () => {
    const src = readSystemsSource();
    const seq = src.slice(src.indexOf('function _playPlanterSequence'), src.indexOf('function _captureHoldTarget'));
    assert.ok(seq.includes('!soldierComponent._planterBackedOff'), 'capture phase gated on arrival');
    assert.ok(!src.includes('isPlanterFinished'), 'whole-sequence leave condition gone');
    const move = src.slice(src.indexOf('let planterLeaving = false;'), src.indexOf('const MAX_LAG = 5.0;'));
    assert.ok(move.includes('isPlantingDone'), 'leave as soon as the plants are done');
    assert.ok(src.includes('soldierComponent._planterBackedOff = true;'), 'arrival latch set');
    assert.ok(src.includes('soldierComponent._planterBackedOff = false;'), 'latch resets per effort');
  });

  it('carried banner shows only while flag_plant_1 plays', () => {
    assert.equal(planterBannerShown({ currentAnim: 'flagPlant1' }), true);
    assert.equal(planterBannerShown({ currentAnim: 'run' }), false);
    assert.equal(planterBannerShown({ currentAnim: 'idle' }), false);
    assert.equal(planterBannerShown({ currentAnim: 'flagPlant2' }), false);
    assert.equal(planterBannerShown({ currentAnim: 'capture1' }), false);
    assert.equal(planterBannerShown({ currentAnim: null }), false);
    assert.equal(planterBannerShown({}), false);
  });

  it('planter banner visibility trails the play call, walking hides', () => {
    const src = readSystemsSource();
    const seq = src.slice(src.indexOf('function _playPlanterSequence'), src.indexOf('function _captureHoldTarget'));
    const playIdx = seq.indexOf('soldierComponent._capturePrev = root._currentAnim;');
    const visIdx = seq.indexOf('planterBannerShown({ currentAnim: root._currentAnim })');
    assert.ok(playIdx >= 0 && visIdx > playIdx, 'visibility decided after the play call');
    assert.ok(!src.includes('_setPlanterBannerVisible(soldierComponent, root, !planted)'), 'planted gate gone');
    assert.ok(!seq.includes('planterBannerShown({\n    captureStage'), 'no stage-based window');
  });

  it('planter squares up to the post before planting', () => {
    const src = readSystemsSource();
    const yawBlock = src.slice(src.indexOf('let aimAngle = yawAngle'), src.indexOf('root.rotation.y = computeSoldierYaw'));
    assert.ok(yawBlock.includes('aimAngle = planterPlantYaw({'), 'yaw override present');
    assert.ok(yawBlock.includes('isPlanter && engagedSp'), 'planter-only');
    assert.ok(yawBlock.includes('!isPlantingDone'), 'pre-plant only');
    assert.ok(yawBlock.includes('kind: engagedSp.kind'), 'socket offset per kind');
    assert.ok(src.includes('kind: strategicPoint.kind,'), 'plant ring per kind');
  });

  it('guard sequencer plays capture1 once then holds capture2', () => {
    assert.deepEqual(GUARD_CAPTURE_SEQUENCE, ['capture1', 'capture2']);
    assert.deepEqual(nextGuardCaptureStage(undefined, 'run', null), { stage: 0, want: 'capture1' });
    assert.deepEqual(nextGuardCaptureStage(0, 'capture1', 'capture1'), { stage: 0, want: 'capture1' });
    assert.deepEqual(nextGuardCaptureStage(0, null, 'capture1'), { stage: 1, want: 'capture2' });
    assert.deepEqual(nextGuardCaptureStage(1, 'capture2', 'capture2'), { stage: 1, want: 'capture2' });
    assert.deepEqual(nextGuardCaptureStage(1, null, 'capture2'), { stage: 1, want: 'capture2' });
    assert.deepEqual(nextGuardCaptureStage(0, null, null), { stage: 0, want: 'capture1' });
  });
});
