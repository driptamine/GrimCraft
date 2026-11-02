import type * as THREE from 'three';

// Shared mesh-subtree types: factories attach runtime fields (selection
// discs, anim groups, ...) that three.js types don't know. The three.js
// surface stays checked; the attached fields are untyped by design.
export type AnyGroup = THREE.Group & Record<string, any>;
export type AnyMesh = THREE.Mesh & Record<string, any>;

// Entity metadata threaded through every mesh factory into userData.
// `faction`/`unitType` drive model selection; the index signature carries
// the rest (entity ids, team, builder refs) untyped, as before.
export interface MetaPayload {
  faction?: string;
  builderEntityId?: unknown;
  team?: string;
  soldierEntityId?: unknown;
  unitType?: string;
  [key: string]: unknown;
}
