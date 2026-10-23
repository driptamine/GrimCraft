import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const probePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'control-both-probe.mjs');

describe('control both teams (sandbox)', () => {
  it('gates orders, hover and AI spawns by commandable team', () => {
    const output = execFileSync(process.execPath, [probePath], {
      encoding: 'utf8',
      timeout: 120000,
    });
    assert.match(output, /all control-both checks passed/);
    assert.doesNotMatch(output, /FAIL|AssertionError/);
  });
});
