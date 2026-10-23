import * as THREE from 'three';
import { PLAYER } from '../scene.js';
import { mkBox, mkGroup, mkPlane } from '../three-helpers.js';


export function makeHpBar(width, teamKey) {
  const group = mkGroup('hpgrp_' + Math.random());
  const border = mkPlane('hpborder', width + 0.07, 0.22 + 0.07, true);
  border.rotation.x = -Math.PI / 2;
  border.position.y = -0.002;
  group.add(border);
  const borderMaterial = new THREE.MeshBasicMaterial();
  borderMaterial.color = new THREE.Color(0, 0, 0);
  // Transparent + no depth test/write: bars join the transparent pass AFTER
  // the decals (negative renderOrder) so ground sheets never cover them.
  borderMaterial.transparent = true;
  borderMaterial.depthTest = false;
  borderMaterial.depthWrite = false;
  border.renderOrder = 2;
  border.material = borderMaterial;
  const backgroundPlane = mkPlane('hpbg', width, 0.22, true);
  backgroundPlane.rotation.x = -Math.PI / 2;
  group.add(backgroundPlane);
  const backgroundMaterial = new THREE.MeshBasicMaterial();
  backgroundMaterial.color = new THREE.Color(0.16, 0.16, 0.16);
  backgroundMaterial.transparent = true;
  backgroundMaterial.depthTest = false;
  backgroundMaterial.depthWrite = false;
  backgroundPlane.renderOrder = 2;
  backgroundPlane.material = backgroundMaterial;

  const foregroundPlane = mkPlane('hpfg', width, 0.22, true);
  foregroundPlane.rotation.x = -Math.PI / 2;
  foregroundPlane.position.y = 0.005;
  group.add(foregroundPlane);
  const foregroundMaterial = new THREE.MeshBasicMaterial();
  const color = (teamKey === PLAYER) ? new THREE.Color(0.27, 1, 0.53) : new THREE.Color(1, 0.27, 0.2);
  foregroundMaterial.color = color;
  foregroundMaterial.transparent = true;
  foregroundMaterial.depthTest = false;
  foregroundMaterial.depthWrite = false;
  foregroundPlane.renderOrder = 2;
  foregroundPlane.material = foregroundMaterial;

  group._fg = foregroundPlane;
  group._bg = backgroundPlane;
  group._width = width;
  return group;
}


export function updateHpBar(group, percentage) {
  group._fg.scale.x = Math.max(0.001, percentage);
  // Anchor the full end at +X: three.js mirrors the old left-handed view, so
  // +X is screen-left and the bar depletes from screen-right like before.
  group._fg.position.x = ((1 - percentage) * group._width) / 2;
}


export function makeSquareSelRing(parent, size, thickness = 0.12, y = 0.06) {
  const ringThickness = thickness;
  const ringSize = size;
  const bars = [
    [ringSize * 2 + ringThickness, ringThickness, 0, ringSize],
    [ringSize * 2 + ringThickness, ringThickness, 0, -ringSize],
    [ringThickness, ringSize * 2, ringSize, 0],
    [ringThickness, ringSize * 2, -ringSize, 0],
  ];
  const node = mkGroup('selRingNode');
  parent.add(node);
  node.position.y = y;
  node.userData.pickable = false;
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(0, 1, 0.53);
  material.opacity = 0;
  material.transparent = true;
  node.userData.pickable = false;
  node.visible = false;
  node.visible = false;
  bars.forEach(([w, d, x, z]) => {
    const box = mkBox('srb', w, ringThickness, d);
    node.add(box);
    box.position.set(x, 0, z);
    box.material = material;
    box.userData.pickable = false;
    box._isSelRingBar = true;
  });
  node._material = material;
  return node;
}
