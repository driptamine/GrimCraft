import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const tool = join(root, 'scripts', 'glb-mesh-tool.mjs');
const src = join(root, 'models', 'ig', 'infantry', 'guardsmen.glb');

function run(...args) {
  return execFileSync('node', [tool, ...args], { encoding: 'utf8' });
}

function parseGltf(path) {
  const file = readFileSync(path);
  assert.equal(file.readUInt32LE(0), 0x46546c67, 'GLB magic');
  const jsonLength = file.readUInt32LE(12);
  return JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
}

describe('glb-mesh-tool', () => {
  it('lists the node tree with mesh refs', () => {
    const out = run('list', src);
    assert.ok(out.includes('guardsmen_lasgun [mesh 18'), 'lasgun listed with mesh');
    assert.ok(out.includes('marker_lasgun_muzzle'), 'marker listed');
  });

  it('isolates kept meshes and strips the rest', () => {
    const dst = join(tmpdir(), 'glb-tool-iso-probe.glb');
    const out = run('isolate', src, dst, '--keep', 'guardsmen_lasgun,guardsmen_head01');
    assert.ok(out.includes('19 meshes hidden'), out);
    const gltf = parseGltf(dst);
    const withMesh = gltf.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name).sort();
    assert.deepEqual(withMesh, ['guardsmen_head01', 'guardsmen_lasgun']);
  });

  it('sets a node transform in place and rejects unknown nodes', () => {
    const dst = join(tmpdir(), 'glb-tool-xform-probe.glb');
    copyFileSync(join(root, 'models', 'ig', 'infantry', 'guardsmen_lasgun_mesh.glb'), dst);
    const out = run('set-transform', dst, '--node', 'guardsmen_lasgun', '--rot', '0,0,0,1');
    assert.ok(out.includes('updated node'), out);
    const gltf = parseGltf(dst);
    assert.deepEqual(gltf.nodes.find((n) => n.name === 'guardsmen_lasgun').rotation, [0, 0, 0, 1]);
    assert.throws(() => run('set-transform', dst, '--node', 'nope', '--rot', '0,0,0,1'));
  });
});
