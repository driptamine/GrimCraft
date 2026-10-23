import * as THREE from 'three';
import { sgbGroundY, sgbSurfaceSnapY } from '../sgb-surface.js';
import { HILL_RELEASE_DIST, sgbAvoidUphill } from '../../pathfinding/avoid.js';

export const _snapV = new THREE.Vector3();
export const _snapInv = new THREE.Matrix4();
export let _snapRoot = null;
export let _snapSample = null;

export function _sgbToLocal(tx, tz, out) {
  _snapV.set(tx, 0, tz).applyMatrix4(_snapInv);
  out.x = _snapV.x;
  out.z = _snapV.z;
  return out;
}

export function _snapTerrainBegin() {
  _snapRoot = window.__sgbTerrainRoot || null;
  _snapSample = (typeof window.__sgbSampleHeight === 'function') ? window.__sgbSampleHeight : null;
  if (_snapRoot && _snapSample) {
    _snapRoot.updateWorldMatrix(true, false);
    _snapInv.copy(_snapRoot.matrixWorld).invert();
  }
}

export function _snapMeshToTerrain(meshComponent) {
  if (!_snapRoot || !_snapSample || !meshComponent.root) return;
  const p = meshComponent.root.position;
  p.y = sgbSurfaceSnapY(_sgbToLocal, _snapRoot.position.y, _snapSample, p.x, p.z);
}

// Feet height for ground movers (0 on flat maps: exact old behavior).
export function _groundAt(x, z) {
  if (!_snapRoot || !_snapSample) return 0;
  return sgbGroundY(_sgbToLocal, _snapRoot.position.y, _snapSample, x, z);
}

export const _avoidOut = { x: 0, z: 0 };

// Hill avoidance shared by all ground movers. Returns the shared _avoidOut
// (straight input dir when no terrain); callers consume it immediately.
export function _avoidDir(comp, x, z, dx, dz, distToGoal, releaseDist) {
  const sample = (_snapRoot && _snapSample) ? _snapSample : null;
  const passGrid = window.__sgbPassGrid || null;
  sgbAvoidUphill(_sgbToLocal, _snapRoot ? _snapRoot.position.y : 0, sample, x, z, dx, dz, distToGoal, releaseDist, comp, _avoidOut, passGrid);
  return _avoidOut;
}

export function _steerSquadFacing(squad, distToGoal) {
  const d = _avoidDir(squad, squad.position.x, squad.position.z, squad.facing.x, squad.facing.z, distToGoal, HILL_RELEASE_DIST);
  squad.facing.set(d.x, 0, d.z);
}
