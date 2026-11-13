import * as THREE from 'three';
import type { GltfInstance } from './gltf-models.js';

/** Clips listed together share a start time; the next phase waits for all of them. */
export type ConstructionPhases = Record<string, string | string[]>;

interface ConstructionPhase {
    key: string;
    name: string;
    start: number;
    end: number;
}
export interface ConstructionTimeline {
    clip: THREE.AnimationClip;
    phases: ConstructionPhase[];
    deliveryDuration: number;
}

export const CONSTRUCTION_DELIVERY_TIME = 1;
export function hasAnimatedConstruction(building: { type: string; faction: string }): boolean {
    return building.faction === 'ig' && ['hq', 'hq-anim', 'infantry_command', 'barracks', 'listening_post', 'mechanized', 'mars_pattern', 'plasma_generator', 'tactica_control', 'turret'].includes(building.type);
}

function hasMotion(track: THREE.KeyframeTrack): boolean {
    const width = track.getValueSize();
    for (let index = width; index < track.values.length; index++)
        if (Math.abs(Number(track.values[index]) - Number(track.values[index % width])) > 1e-5) return true;
    return false;
}

/** Each exported phase contains the entire rig, including unrelated bind poses.
 * Only moving channels advance a part; other parts retain their previous pose.
 * Starting future channels at their first authored pose keeps the bunker below
 * ground and deliveries in the sky until their respective phases.
 */
export function buildConstructionTimeline(animations: THREE.AnimationClip[], phases: ConstructionPhases): ConstructionTimeline | null {
    const byName = new Map(animations.map(clip => [clip.name.toLowerCase(), clip]));
    const placement = typeof phases.placement === 'string' ? byName.get(phases.placement.toLowerCase()) : undefined;
    const ordered = Object.entries(phases).filter(([key]) => /^phase_\d+$/.test(key))
        .sort(([first], [second]) => Number(first.slice(6)) - Number(second.slice(6)))
        .map(([key, names]) => ({ key, names: Array.isArray(names) ? names : [names] }));
    if (phases.delivery) ordered.unshift({ key: 'delivery', names: Array.isArray(phases.delivery) ? phases.delivery : [phases.delivery] });
    const parallelNames = phases.parallel ? (Array.isArray(phases.parallel) ? phases.parallel : [phases.parallel]) : [];
    if (!placement || !ordered.length || ordered.some(({ names }) => !names.length || names.some(name => !byName.has(name.toLowerCase())))
        || parallelNames.some(name => !byName.has(name.toLowerCase()))) return null;
    const steps = ordered.map(({ key, names }) => ({ key, name: names.join(' + '), clips: names.map(name => byName.get(name.toLowerCase())!) }));
    const parallelClips = parallelNames.map(name => byName.get(name.toLowerCase())!);
    const initial = new Map(placement.tracks.map(track => [track.name, track]));
    const moving = new Map<string, THREE.KeyframeTrack>();
    for (const clip of [...steps.flatMap(step => step.clips), ...parallelClips])
        for (const track of clip.tracks)
            if (!moving.has(track.name) && hasMotion(track)) moving.set(track.name, track);

    const records = new Map<string, { template: THREE.KeyframeTrack; times: number[]; values: number[] }>();
    for (const [name, track] of new Map([...initial, ...moving])) {
        const width = track.getValueSize();
        records.set(name, { template: track, times: [0], values: Array.from(track.values.slice(0, width), Number) });
    }
    function appendClip(clip: THREE.AnimationClip, start: number, timeScale = 1): void {
        for (const track of clip.tracks) {
            if (!hasMotion(track)) continue;
            const record = records.get(track.name)!;
            const width = track.getValueSize();
            const lastTime = record.times[record.times.length - 1];
            if (start > lastTime + 1e-5) {
                record.times.push(start - 1e-5);
                record.values.push(...record.values.slice(-width));
            }
            for (let frame = 0; frame < track.times.length; frame++) {
                const time = start + track.times[frame] * timeScale;
                const values = Array.from(track.values.slice(frame * width, (frame + 1) * width), Number);
                if (time === record.times[record.times.length - 1])
                    record.values.splice(record.values.length - width, width, ...values);
                else {
                    record.times.push(time);
                    record.values.push(...values);
                }
            }
        }
    }
    const timelinePhases: ConstructionPhase[] = [{ key: 'placement', name: placement.name, start: 0, end: 0 }];
    let elapsed = 0, deliveryDuration = 0;
    for (const { key, name, clips } of steps) {
        const duration = Math.max(0, ...clips.map(clip => clip.duration));
        timelinePhases.push({ key, name, start: elapsed, end: elapsed + duration });
        for (const clip of clips) appendClip(clip, elapsed);
        elapsed += duration;
        if (key === 'delivery') deliveryDuration = duration;
    }
    // These channels (the rising bunker) follow the whole assembly interval,
    // independently of the sequential crane and crate phases.
    for (const clip of parallelClips)
        appendClip(clip, deliveryDuration, clip.duration > 0 ? (elapsed - deliveryDuration) / clip.duration : 1);
    if (elapsed <= 0) return null;
    const tracks = [...records.values()].map(({ template, times, values }) => {
        const track = template.clone();
        track.times = new Float32Array(times);
        track.values = new Float32Array(values);
        return track;
    });
    return { clip: new THREE.AnimationClip('construction_sequence', elapsed, tracks), phases: timelinePhases, deliveryDuration };
}

export interface ConstructionAnimation {
    seek(progress: number): void;
    seekConstruction(progress: number, deliveryProgress: number): void;
    finish(): void;
    readonly phase: string;
}

export function createConstructionAnimation(instance: GltfInstance, timeline: ConstructionTimeline, finishVisibility: () => void): ConstructionAnimation {
    const action = instance.mixer.clipAction(timeline.clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    action.paused = true;
    let phase = 'placement', finished = false;
    const player: ConstructionAnimation = {
        get phase() { return phase; },
        seek(progress) {
            if (finished) return;
            const fraction = THREE.MathUtils.clamp(progress || 0, 0, 1);
            const time = fraction * timeline.clip.duration;
            phase = fraction === 0 ? 'placement'
                : (timeline.phases.find(step => step.end > time)?.key || timeline.phases[timeline.phases.length - 1].key);
            action.time = time;
            instance.mixer.update(0);
        },
        seekConstruction(progress, deliveryProgress) {
            const delivery = THREE.MathUtils.clamp(deliveryProgress || 0, 0, 1);
            const construction = THREE.MathUtils.clamp(progress || 0, 0, 1);
            const time = delivery < 1 ? delivery * timeline.deliveryDuration
                : timeline.deliveryDuration + construction * (timeline.clip.duration - timeline.deliveryDuration);
            player.seek(time / timeline.clip.duration);
        },
        finish() {
            if (finished) return;
            player.seek(1);
            // Bake the terminal pose, then retire the action. Completed
            // buildings no longer evaluate hundreds of construction channels.
            const poses: Array<{ node: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Quaternion; scale: THREE.Vector3 }> = [];
            for (const root of instance.rootNodes)
                root.traverse(node => poses.push({ node, position: node.position.clone(), rotation: node.quaternion.clone(), scale: node.scale.clone() }));
            action.stop();
            instance.mixer.uncacheAction(timeline.clip);
            for (const pose of poses) {
                pose.node.position.copy(pose.position);
                pose.node.quaternion.copy(pose.rotation);
                pose.node.scale.copy(pose.scale);
            }
            for (const root of instance.rootNodes) {
                root.updateWorldMatrix(true, true);
                // SkinnedMesh updates its inverse bind matrix in this override.
                root.updateMatrixWorld(true);
            }
            finishVisibility();
            finished = true;
        },
    };
    player.seek(0);
    return player;
}
