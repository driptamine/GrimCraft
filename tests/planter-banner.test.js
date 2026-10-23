import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { findNodesByName } from '../src/three-helpers.js';

function glbNodeNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return (json.nodes || []).map((n) => n.name);
}

describe('planter banner', () => {
  it('guardsmen.glb carries the banner prop nodes', () => {
    const names = glbNodeNames(new URL('../models/ig/infantry/guardsmen.glb', import.meta.url));
    assert.ok(names.includes('guard_banner'));
    assert.ok(names.includes('guard_banner_rod'));
  });

  it('findNodesByName collects banner nodes incl. loader dedupe suffixes', () => {
    const root = new THREE.Group();
    root.name = 'guardsman';
    const banner = new THREE.Mesh(new THREE.BufferGeometry());
    banner.name = 'guard_banner';
    const rod = new THREE.Mesh(new THREE.BufferGeometry());
    rod.name = 'guard_banner_rod';
    const rodDedupe = new THREE.Mesh(new THREE.BufferGeometry());
    rodDedupe.name = 'guard_banner_rod_1';
    const nested = new THREE.Group();
    nested.name = 'arm';
    const nestedBanner = new THREE.Mesh(new THREE.BufferGeometry());
    nestedBanner.name = 'guard_banner_2';
    nested.add(nestedBanner);
    const body = new THREE.Mesh(new THREE.BufferGeometry());
    body.name = 'body';
    const lookalike = new THREE.Mesh(new THREE.BufferGeometry());
    lookalike.name = 'guard_banner_pole';
    root.add(banner, rod, rodDedupe, nested, body, lookalike);
    const found = findNodesByName(root, ['guard_banner', 'guard_banner_rod']);
    assert.deepEqual(
      found.map((n) => n.name).sort(),
      ['guard_banner', 'guard_banner_2', 'guard_banner_rod', 'guard_banner_rod_1'],
    );
  });

  it('findNodesByName tolerates missing roots and models without banners', () => {
    assert.deepEqual(findNodesByName(null, ['guard_banner']), []);
    const root = new THREE.Group();
    assert.deepEqual(findNodesByName(root, ['guard_banner']), []);
  });
});
