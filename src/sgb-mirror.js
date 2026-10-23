// Pure SGB map-root transform: yaw + horizontal mirror.
// No engine/DOM imports so node tests can verify the world-space effect.
//
// Screen geometry (default camera looks along +Z from -Z, screen-right is
// world -X): negating LOCAL Z under the 90° yaw negates WORLD X, so the map
// flips left<->right on screen while rows (world Z) and heights (world Y)
// stay put. Faction positions are world-space entities outside this root,
// so they are untouched.
export function applySgbRootTransform(root, rotateDeg, flipH) {
  if (!root) {
    return;
  }
  root.rotation.y = ((parseFloat(rotateDeg) || 0) * Math.PI) / 180;
  root.scale.set(1, 1, flipH ? -1 : 1);
}
