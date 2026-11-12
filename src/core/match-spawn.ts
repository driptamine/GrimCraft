import * as THREE from 'three';
import { createBuildingEntity, createBuilderEntity, createSquadEntity } from '../entities/entities.js';
import type { LocalMatchSeat } from './local-match.js';
export function spawnMatchSeat(world: any, seat: LocalMatchSeat, position: {
    x: number;
    z: number;
}): void {
    world.defaultOwner = seat.owner ?? null;
    const { x, z } = position;
    createBuildingEntity(world, 'hq', new THREE.Vector3(x, 0, z), seat.team, seat.faction, { completed: true });
    createBuilderEntity(world, x + (x > 0 ? -10 : 10), z, seat.team, seat.faction);
    const types = seat.faction === 'chaos' ? ['chaos_space_marine'] : seat.faction === 'orks' ? [null, 'boyz_shoota'] : [null, null];
    for (const [i, type] of types.entries()) {
        const id = createSquadEntity(world, seat.team, x + (x > 0 ? -16 : 16), z + (i === 0 ? -6 : 6), seat.faction === 'chaos' ? 4 : 5, type, seat.faction);
        if (seat.computer)
            world.add(id, 'computer', { slot: seat.slot });
    }
    world.defaultOwner = null;
}
