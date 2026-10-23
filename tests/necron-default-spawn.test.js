import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const probePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'necron-reset-probe.mjs');

describe('necron default spawn', () => {
  it('resetGame fields two size-5 warrior squads on arena and SGB maps', () => {
    const output = execFileSync(process.execPath, [probePath], {
      encoding: 'utf8',
      timeout: 120000,
    });
    assert.match(output, /all headless resetGame checks passed/);
    assert.doesNotMatch(output, /FAIL/);
  });
});
