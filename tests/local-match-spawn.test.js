import { it } from 'node:test';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
it('spawns configured armies and runs computers through the real game systems', () => {
  const result = spawnSync(process.execPath, ['--import', './tests/register-hooks.mjs', 'tests/local-match-spawn-probe.mjs'], {encoding:'utf8',timeout:45000});
  assert.equal(result.status,0,result.stdout + result.stderr);
});
