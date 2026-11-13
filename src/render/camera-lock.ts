import type { Vector3 } from 'three';

interface OrbitCamera {
  target: Vector3;
  alpha: number;
  beta: number;
  radius: number;
}
const locks = new WeakMap<object, OrbitCamera>();

export function isCameraLocked(camera: object | null | undefined): boolean {
  return !!camera && locks.has(camera);
}

/** The editor owns one fixed view until its cleanup releases the lock. */
export function lockCamera(camera: OrbitCamera): () => void {
  const previous = locks.get(camera);
  const pose = { target: camera.target.clone(), alpha: camera.alpha, beta: camera.beta, radius: camera.radius };
  locks.set(camera, pose);
  return () => {
    if (locks.get(camera) !== pose) return;
    if (previous) locks.set(camera, previous);
    else locks.delete(camera);
  };
}

export function enforceCameraLock(camera: OrbitCamera): boolean {
  const pose = locks.get(camera);
  if (!pose) return false;
  camera.target.copy(pose.target);
  camera.alpha = pose.alpha;camera.beta = pose.beta;camera.radius = pose.radius;
  return true;
}
