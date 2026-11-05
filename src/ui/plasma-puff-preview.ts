import * as THREE from 'three';
import { scene, world, camera, selSquads, canCommand, BUILDING_BOUNDS, STRUCTURE_BOUNDS, AIRFIELD_BOUNDS, addBeforeRender, removeBeforeRender, getDeltaTime } from '../core/scene.js';
import { updateHUD } from '../core/hud.js';
import { _groundAt } from '../systems/terrain.js';
import { setCameraMode } from '../render/camera-fps.js';
import { createPlasmaPuffPreview, findPlasmaPuffPreviewCenter } from '../render/plasma-puff-preview.js';

let closePreview: ((restoreCamera?: boolean) => void) | null = null;

export function isPlasmaPuffPreviewOpen(): boolean {
  return closePreview !== null;
}

export function togglePlasmaPuffPreview(): void {
  if (closePreview) { closePreview(); return; }
  if (!scene || !camera?.target) return;
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
  const selected = selSquads.filter((id: number) => canCommand(world?.get(id, 'squad')?.team));
  const center = findPlasmaPuffPreviewCenter(world, selected, right, _groundAt, (kind, type) => {
    if (kind === 'airfield') return AIRFIELD_BOUNDS;
    const bounds: Record<string, number> = kind === 'building' ? BUILDING_BOUNDS : STRUCTURE_BOUNDS;
    return bounds[type] ?? 3.5;
  });
  if (!center) return;
  const previewScene = scene;
  const previewWorld = world;
  const previewCamera = camera;
  const saved = {
    target: camera.target.clone(), alpha: camera.alpha, beta: camera.beta,
    radius: camera.radius, lowerRadiusLimit: camera.lowerRadiusLimit,
  };
  const preview = createPlasmaPuffPreview(scene, center, right);
  setCameraMode('orbit');
  camera.target.copy(center);
  camera.lowerRadiusLimit = Math.min(camera.lowerRadiusLimit, 1.5);
  camera.radius = 4;
  camera.beta = Math.PI / 3;

  const toolbar = document.createElement('div');
  toolbar.id = 'plasma-puff-preview-toolbar';
  toolbar.style.cssText = 'position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:10000;max-width:calc(100vw - 32px);padding:12px 16px;background:#101827ee;border:1px solid #879eff;color:#e4edff;font:13px sans-serif;display:flex;align-items:center;gap:16px;border-radius:6px;';
  const hint = document.createElement('span');
  hint.textContent = 'PLASMA CLOUD PUFF · Три стадии луча: 20% → 40% → 60% роста солдата на пути A→B. Колесо — масштаб, Alt + перетаскивание — вращение, Esc — закрыть.';
  const close = document.createElement('button');
  close.textContent = 'Закрыть';
  close.style.cssText = 'cursor:pointer;padding:6px 10px;background:#26355c;border:1px solid #879eff;color:#fff;border-radius:4px;';
  close.addEventListener('click', () => closePreview?.());
  toolbar.append(hint, close);
  document.body.append(toolbar);
  const escape = (event: KeyboardEvent): void => {
    if (event.code === 'Escape') closePreview?.();
  };
  window.addEventListener('keydown', escape);
  const tick = addBeforeRender(() => {
    if (scene !== previewScene || world !== previewWorld || camera !== previewCamera) {
      closePreview?.(false);
      return;
    }
    preview.update(getDeltaTime());
  });
  closePreview = (restoreCamera = true): void => {
    closePreview = null;
    removeBeforeRender(tick);
    window.removeEventListener('keydown', escape);
    toolbar.remove();
    preview.dispose();
    // A new world may have already positioned the same camera for another map.
    if (camera === previewCamera) {
      camera.lowerRadiusLimit = saved.lowerRadiusLimit;
      if (restoreCamera) {
        camera.target.copy(saved.target);
        camera.alpha = saved.alpha;
        camera.beta = saved.beta;
        camera.radius = saved.radius;
      }
    }
    updateHUD();
  };
  updateHUD();
}
