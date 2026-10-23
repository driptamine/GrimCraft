import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { world, PLAYER, camera, currentBounds } from '../../scene.js';
import { issueGroundOrder, isFlyArmed } from '../../input.js';
import { useHUDVersion } from '../useHUD.js';
import { MinimapPanel, MinimapCanvas, MinimapLabel } from '../primitives.jsx';

function drawMinimap(canvasEl) {
  if (!canvasEl || !world) {
    return;
  }
  const ctx = canvasEl.getContext('2d');
  const W = canvasEl.width;
  const H = canvasEl.height;
  const HALF = currentBounds();
  // mirrored left-to-right plus flipped top-to-bottom: world +X at the
  // left, world +Z at the top
  const wx = (x) => Math.round(((HALF - x) / (HALF * 2)) * W);
  const wy = (z) => Math.round(((HALF - z) / (HALF * 2)) * H);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(4, 10, 22, 0.95)';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(80, 200, 255, 0.07)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i += 1) {
    const x = Math.round((i / 4) * W) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
    const y = Math.round((i / 4) * H) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  world.query('strategicPoint').forEach((id) => {
    const sp = world.get(id, 'strategicPoint');
    if (!sp || !sp.position) {
      return;
    }
    const x = wx(sp.position.x);
    const y = wy(sp.position.z);
    const color = sp.owner === PLAYER ? '#4af' : (sp.owner === 'red' ? '#f44' : 'rgba(255,255,255,0.3)');
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 4, y - 4, 8, 8);
    if (sp.owner === PLAYER || sp.owner === 'red') {
      ctx.fillStyle = `${color}44`;
      ctx.fillRect(x - 4, y - 4, 8, 8);
    }
  });

  world.query('building').concat(world.query('structure')).forEach((id) => {
    const mc = world.get(id, 'mesh');
    if (!mc?.root) {
      return;
    }
    const { position } = mc.root;
    ctx.fillStyle = 'rgba(80,200,255,0.55)';
    ctx.fillRect(wx(position.x) - 2, wy(position.z) - 2, 5, 5);
  });

  world.query('squad').forEach((id) => {
    const squad = world.get(id, 'squad');
    if (!squad || !squad.position) {
      return;
    }
    const x = wx(squad.position.x);
    const y = wy(squad.position.z);
    ctx.fillStyle = squad.team === PLAYER ? '#4af' : '#f55';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  world.query('builder').forEach((id) => {
    const bmc = world.get(id, 'mesh');
    if (!bmc?.root) {
      return;
    }
    const { position } = bmc.root;
    ctx.fillStyle = '#fc4';
    ctx.fillRect(wx(position.x) - 2, wy(position.z) - 2, 4, 4);
  });

  world.query('apc').forEach((id) => {
    const apc = world.get(id, 'apc');
    if (!apc || !apc.position) {
      return;
    }
    ctx.fillStyle = '#8f8';
    ctx.fillRect(wx(apc.position.x) - 2, wy(apc.position.z) - 2, 5, 5);
  });

  world.query('jet').forEach((id) => {
    const jet = world.get(id, 'jet');
    if (!jet || jet.team !== PLAYER || !jet.position) {
      return;
    }
    const x = wx(jet.position.x);
    const y = wy(jet.position.z);
    ctx.fillStyle = jet.selected ? '#fff' : '#88ddff';
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + 3, y + 3);
    ctx.lineTo(x - 3, y + 3);
    ctx.closePath();
    ctx.fill();
  });

  if (camera) {
    const { target } = camera;
    const cx = wx(target.x);
    const cy = wy(target.z);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
    ctx.stroke();
  }
}

export function Minimap() {
  const version = useHUDVersion('minimap');
  const canvasRef = useRef(null);

  useEffect(() => {
    drawMinimap(canvasRef.current);
  }, [version]);

  const minimapWorld = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;
    return new THREE.Vector3(currentBounds() - normalizedX * currentBounds() * 2, 0, currentBounds() - normalizedY * currentBounds() * 2);
  };

  const handleClick = (e) => {
    if (!camera) {
      return;
    }
    camera.target = minimapWorld(e);
  };

  const handleContextMenu = (e) => {
    // No Chrome menu over the minimap: right-click issues orders instead.
    e.preventDefault();
  };

  const handleMouseDown = (e) => {
    // Right-click on the minimap sends the selection there: same ground
    // order as a canvas right-click (formation, paint snap, capture).
    if (e.button !== 2 || !camera || isFlyArmed()) {
      return;
    }
    issueGroundOrder(minimapWorld(e));
  };

  return (
    <MinimapPanel>
      <MinimapLabel>MINIMAP</MinimapLabel>
      <MinimapCanvas ref={canvasRef} width={140} height={140} onClick={handleClick} onContextMenu={handleContextMenu} onMouseDown={handleMouseDown} />
    </MinimapPanel>
  );
}
