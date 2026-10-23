import { world, scene, camera, PLAYER, projectToScreen } from '../../scene.js';
import { useHUDVersion } from '../useHUD.js';
import { CapWrap, CapLabel, CapBar, CapFill } from '../primitives.jsx';

/**
 * Projects 3D-to-2D capture progress bars above each strategic point.
 */
export function CaptureBars() {
  useHUDVersion('capture');

  if (!world || !scene || !camera) {
    return null;
  }

  const rows = [];
  world.query('strategicPoint').forEach((spId) => {
    const sp = world.get(spId, 'strategicPoint');
    const meshComponent = world.get(spId, 'mesh');
    if (!sp || !meshComponent) {
      return;
    }
    const progress = sp.captureProgress;
    if (Math.abs(progress) <= 0.005) {
      return;
    }
    const proj = projectToScreen(sp.position.x, 2.0, sp.position.z);
    if (proj.z < -1 || proj.z > 1) {
      return;
    }
    rows.push({ id: spId, x: proj.sx, y: proj.sy - 18, progress, owner: sp.owner });
  });

  return rows.map((r) => {
    const percentage = Math.abs(r.progress) * 100;
    const positive = r.progress > 0;
    const label = positive
      ? (r.owner === PLAYER ? `HELD ▸ ${Math.ceil(percentage)}%` : `CAPTURING ▸ ${Math.ceil(percentage)}%`)
      : (r.owner === 'red' ? `ENEMY HELD ▸ ${Math.ceil(percentage)}%` : `ENEMY CAP ▸ ${Math.ceil(percentage)}%`);
    const fillColor = 'linear-gradient(90deg,#5c5c5c,#9a9a9a)';
    const labelColor = positive ? '#50c8ff' : '#ff6644';
    return (
      <CapWrap key={r.id} style={{ left: r.x, top: r.y, display: 'flex' }}>
        <CapLabel style={{ color: labelColor }}>{label}</CapLabel>
        <CapBar>
          <CapFill style={{ width: `${percentage}%`, background: fillColor }} />
        </CapBar>
      </CapWrap>
    );
  });
}
