import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/input/orders.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('orders.ts', source, ts.ScriptTarget.Latest, true);

function findFunction(node, name) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === name) return node;
  let found;
  ts.forEachChild(node, (child) => {
    if (!found) found = findFunction(child, name);
  });
  return found;
}

function findIf(node, snippet) {
  if (ts.isIfStatement(node) && node.expression.getText(ast).includes(snippet)) return node;
  let found;
  ts.forEachChild(node, (child) => {
    if (!found) found = findIf(child, snippet);
  });
  return found;
}

describe('right-click torus on enemies', () => {
  it('does not spawn the click torus when ordering an attack on an enemy squad', () => {
    const issueRightClick = findFunction(ast, 'issueRightClick');
    assert.ok(issueRightClick, 'issueRightClick must exist');
    const attackBranch = findIf(issueRightClick, 'attackers.length > 0');
    assert.ok(attackBranch, 'attack branch must exist');
    const text = attackBranch.getText(ast);
    assert.ok(!text.includes('spawnAttackMarker('), 'no click torus on enemy squads');
    assert.ok(!text.includes('spawnMoveMarker('), 'no move torus on enemy squads');
    assert.ok(text.includes('forcedTarget'), 'the attack order itself must stay');
  });

  it('keeps click feedback for ground orders and point pings', () => {
    assert.ok(source.includes('spawnMoveMarker(sx, sy)'), 'ground orders keep the move torus');
    assert.ok(source.includes('spawnSpPing('), 'strategic-point pings stay');
    const markers = readFileSync(new URL('../src/input/markers.ts', import.meta.url), 'utf8');
    assert.ok(markers.includes('export function spawnAttackMarker'), 'the marker helper stays available');
  });
});
