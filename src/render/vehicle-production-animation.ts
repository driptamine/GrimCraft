import * as THREE from 'three';

interface ProductionOrder { progress: number; total: number }
interface ProductionRoot extends THREE.Object3D {
    _instanceData?: { mixer: THREE.AnimationMixer };
    _vehicleProductionAnimation?: { update(queue: ProductionOrder[], interpolation?: number): void };
}

/** Exported drop-off clips contain the whole rig. Keep the completed building
 * pose, and animate only channels that actually move during the delivery. */
export function attachVehicleProductionAnimation(root: ProductionRoot, animations: THREE.AnimationClip[], clipName: string): void {
    const source = animations.find(clip => clip.name === clipName);
    const mixer = root._instanceData?.mixer;
    if (!source || !mixer) return;
    const tracks = source.tracks.filter(track => {
        const width = track.getValueSize();
        return track.values.some((value, index) => Math.abs(value - track.values[index % width]) > 1e-4);
    }).map(track => track.clone());
    const clip = new THREE.AnimationClip('vehicle_production_dropoff', source.duration, tracks);
    const aircraft: THREE.Object3D[] = [];
    root.traverse(node => {
        if (/^valkyrie(?:_|$)/i.test(node.name)) {
            node.visible = false;
            if (!/shadow/i.test(node.name)) aircraft.push(node);
        }
    });
    let action: THREE.AnimationAction | null = null;
    const culling = new Map<THREE.Object3D, boolean>();
    root._vehicleProductionAnimation = {
        update(queue, interpolation = 0) {
            const order = queue?.[0];
            if (!order || !(order.total > 0)) {
                if (!action) return;
                action.stop();
                mixer.uncacheAction(clip);
                action = null;
                for (const node of aircraft) node.visible = false;
                root.updateMatrixWorld(true);
                for (const [node, previous] of culling) {
                    if ((node as THREE.SkinnedMesh).isSkinnedMesh) (node as THREE.SkinnedMesh).computeBoundingSphere();
                    node.frustumCulled = previous;
                }
                culling.clear();
                return;
            }
            if (!action) {
                action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.play();
                action.paused = true;
                for (const node of aircraft) node.visible = true;
                root.traverse(node => {
                    if ((node as THREE.Mesh).isMesh) {
                        culling.set(node, node.frustumCulled);
                        node.frustumCulled = false;
                    }
                });
            }
            // The same production progress drives skirmish and network replicas.
            // A new queue head returns to zero, including two identical vehicles.
            action.time = THREE.MathUtils.clamp((order.progress + interpolation) / order.total, 0, 1) * clip.duration;
            mixer.update(0);
        },
    };
}
