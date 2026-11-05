import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';

describe('unit command grid', () => {
  function render(kinds, extras = []) {
    const calls = [];
    const context = { exports: {}, require(name) {
      if (name === 'react/jsx-runtime') return jsxRuntime;
      if (name.endsWith('bits.jsx')) return { ActionButton: 'button' };
      if (name.endsWith('primitives.jsx')) return { CommandGridDiv: 'grid', CommandEmptySlot: 'empty' };
      if (name.endsWith('unit-commands.js')) return {
        selectedTroops: () => kinds.map((kind) => ({ kind, unit: { stance: 'stand' } })),
        pendingUnitCommand: null,
        setUnitCommand: (command) => calls.push(command),
        stopSelectedTroops: () => calls.push('stop'),
        setUnitStance: (stance) => calls.push(`stance_${stance}`),
      };
      throw new Error(`Unexpected import ${name}`);
    } };
    const src = readFileSync(new URL('../src/hud/components/UnitCommandGrid.tsx', import.meta.url), 'utf8');
    const compiled = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
    vm.runInNewContext(compiled.outputText, context);
    return { children: context.exports.UnitCommandGrid({ extras }).props.children, calls };
  }

  it('keeps all six icons in the Enginseer’s original grid cells for every troop kind', () => {
    for (const kind of ['squad', 'vehicle', 'apc', 'jet']) {
      const { children } = render([kind]);
      for (const [slot, icon] of [[0, 'move'], [1, 'stop'], [2, 'attackm'], [3, 'melee'], [6, 'stance_stand'], [7, 'stance_ranged']]) {
        assert.equal(children[slot].props.icon, `assets/command_icons/${icon}.png`, `${kind}: slot ${slot}`);
      }
      assert.equal(children[3].props.disabled, kind !== 'squad');
    }
  });

  it('retains abilities in the free cells and wires each common button to its command', () => {
    const extras = ['resume', 'chase', 'fly'].map((name) => jsxRuntime.jsx('ability', { name }));
    const { children, calls } = render(['squad'], extras);
    assert.equal(children[4].props.name, 'resume');
    assert.equal(children[5].props.name, 'chase');
    assert.equal(children[8].props.name, 'fly');
    for (const slot of [0, 1, 2, 3, 6, 7]) children[slot].props.onClick();
    assert.deepEqual(calls, ['move', 'stop', 'attackmove', 'melee', 'stance_stand', 'stance_ranged']);
  });

  it('applies movement, stop, combat orders, and stances to the selected troops', () => {
    const output = execFileSync(process.execPath, ['--import', './tests/register-hooks.mjs', fileURLToPath(new URL('./unit-commands-probe.mjs', import.meta.url))], { encoding: 'utf8', timeout: 120000 });
    assert.match(output, /all unit command checks passed/);
  });
});
