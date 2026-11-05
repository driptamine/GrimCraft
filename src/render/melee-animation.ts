import * as THREE from 'three';

export function isMeleeAttackName(name: string): boolean {
  const value = name.toLowerCase();
  return /(?:^|_)(melee|attack|slash|swing|punch|stab)(?:_|$)/.test(value)
    && !/(idle|run|walk|block|damage|death|die|sync|special|vis_|throw|firing|shoot)/.test(value);
}

export function findMeleeClip(clips: THREE.AnimationClip[], configured?: string): THREE.AnimationClip | undefined {
  const wanted = configured?.toLowerCase();
  return (wanted ? clips.find((clip) => clip.name.toLowerCase() === wanted) : undefined)
    || clips.find((clip) => /^melee[_-]/i.test(clip.name) && isMeleeAttackName(clip.name))
    || clips.find((clip) => isMeleeAttackName(clip.name));
}

// Models without an authored attack still get an actual arm swing.
// Bind by node name so SkeletonUtils clones resolve their own bones.
export function makeMeleeFallbackClip(model: THREE.Object3D): THREE.AnimationClip {
  let arm: THREE.Object3D | undefined;
  model.traverse((node) => {
    const name = node.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (name.includes('rupperarm') || name.includes('upperarmr')) arm = node;
  });
  const node = arm || model;
  const times = [0, 0.15, 0.3, 0.42, 0.65];
  const angles = arm ? [0, -0.8, 1.1, 0.35, 0] : [0, -0.12, 0.2, 0.08, 0];
  const axis = new THREE.Vector3(1, 0, 0);
  const values = angles.flatMap((angle) => node.quaternion.clone().multiply(
    new THREE.Quaternion().setFromAxisAngle(axis, angle),
  ).toArray());
  const track = new THREE.QuaternionKeyframeTrack(arm ? `${arm.name}.quaternion` : '.quaternion', times, values);
  return new THREE.AnimationClip('melee_attack_fallback', 0.65, [track]);
}
