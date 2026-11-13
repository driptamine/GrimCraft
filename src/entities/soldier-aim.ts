/**
 * Soldier facing decision. Pure math, no engine imports.
 *
 * - firing (standing or running) -> ease toward the aim angle, so the body
 *   and the muzzle flash agree with where the shots go;
 * - running without firing -> snap to the movement direction;
 * - idle -> ease toward the aim angle (squad facing + per-soldier offset).
 *
 * Angles in radians, deltaTime in seconds.
 */
/**
 * Planter capture sequence (slot names): two one-shot flag plants at the
 * point center, then the planter backs off to stand distance, and only
 * then plays capture1 once and loops capture2 until ownership changes.
 * The planting clips play once per capture effort (see _captureKey). The rest of
 * the squad plays capture1 once, then replays its guardCaptureAnim clip
 * until the point is captured, then idle too.
 */
export const CAPTURE_SEQUENCE = ['flagPlant1', 'flagPlant2', 'capture1', 'capture2'];

export function nextCaptureStage(stage: number, currentAnim: string | null, prevPlayed: string | null): { stage: number; want: string } {
  const last = CAPTURE_SEQUENCE.length - 1;
  let s = Math.min(Math.max(stage || 0, 0), last);
  if (s < last && currentAnim === null && prevPlayed === CAPTURE_SEQUENCE[s]) {
    s += 1;
  }
  return { stage: s, want: CAPTURE_SEQUENCE[s] };
}

// A one-shot capture clip finished when it was the last thing played and
// nothing is playing anymore.
export function captureClipDone(want: string, prevPlayed: string | null, currentAnim: string | null): boolean {
  return prevPlayed === want && currentAnim == null;
}

// Guards play capture1 once, then repeat capture2 (capture_strategic_point_2)
// until the point is captured (the planter is index 0 and never reaches
// this). The index stays so per-guard variety can return.
export function guardCaptureAnim(aliveIndex: number): string {
  void aliveIndex;
  return 'capture2';
}

// Guard capture stages (slot names): stage 0 plays capture1 once and
// advances when it ends; stage 1 replays capture2 until the point flips.
export const GUARD_CAPTURE_SEQUENCE = ['capture1', 'capture2'];

export function nextGuardCaptureStage(stage: number, currentAnim: string | null, prevPlayed: string | null): { stage: number; want: string } {
  let s = stage === 1 ? 1 : 0;
  if (s === 0 && currentAnim == null && prevPlayed === GUARD_CAPTURE_SEQUENCE[0]) {
    s = 1;
  }
  return { stage: s, want: GUARD_CAPTURE_SEQUENCE[s] };
}

// The point assembly may rise once the planter finished flag_plant_2
// (planter stage 2+); units without plant clips skip the wait.
export function isPlantingDone({ captureStage, hasPlantAnims }: { captureStage?: number; hasPlantAnims?: boolean }): boolean {
  if (!hasPlantAnims) {
    return true;
  }
  return (captureStage || 0) >= 2;
}

// The carried banner+banner_rod show only while the flag_plant_1 clip
// itself plays — not on the walk in, not during flag_plant_2. The point's
// own pair pops into the socket when flag_plant_1 seats the rod.
export function planterBannerShown({ currentAnim }: { currentAnim?: string }): boolean {
  return currentAnim === 'flagPlant1';
}

// The point counts as captured for a squad once its team owns it.
export function isPointCapturedBy(spOwner: unknown, team: unknown): boolean {
  return spOwner != null && spOwner === team;
}

// Capture positioning: the planter (first alive soldier) walks to the plant
// ring to plant the flag; the rest hold formation at a distance — any slot
// inside CAPTURE_GUARD_DISTANCE of the center is pushed radially out to it.
// Tune to taste: guards hold no closer than this to a captured point.
export const CAPTURE_GUARD_DISTANCE = 10.0;
// Post-plant stand-off: after flag_plant_2 the planter backs away from the
// center toward his squad but stays on the point (inside the 4.5 capture
// radius) so progress keeps ticking, and plays the capture clips only once
// arrived. Tune to taste.
export const PLANTER_STAND_DISTANCE = 4.0;

export function planterStandTarget({ centerX, centerZ, squadX, squadZ, standDistance = PLANTER_STAND_DISTANCE }: {
  centerX: number; centerZ: number; squadX: number; squadZ: number; standDistance?: number;
}): { x: number; z: number } {
  let dx = squadX - centerX;
  let dz = squadZ - centerZ;
  if (Math.hypot(dx, dz) < 1e-6) {
    dx = 1;
    dz = 0;
  }
  const inv = 1 / Math.hypot(dx, dz);
  return { x: centerX + dx * inv * standDistance, z: centerZ + dz * inv * standDistance };
}
// Planter pace toward the point: no catch-up bonus, so the flag run reads
// as a deliberate advance instead of a sprint. Tune to taste.
export const PLANTER_SPEED_MULT = 1.0;

// World-space rod butt at flag_plant_1 end, measured with the animated
// skeleton and mesh transforms applied (not the unposed accessor bounds).
const PLANTER_ROD_X = 0.0016879153;
const PLANTER_ROD_Z = 3.0045565826;
export const PLANTER_PLANT_DISTANCE = Math.hypot(PLANTER_ROD_X, PLANTER_ROD_Z);
export const PLANTER_PLANT_YAW_OFF = Math.atan2(PLANTER_ROD_X, PLANTER_ROD_Z);

// Centerpost top ring in captured_raise at the pre-plant hold. Relic uses
// its native banner socket with the model's 0.8 world scale applied.
export const POINT_SOCKET_OFFSET = { x: 0.0028192258, z: 0.0043139010 };
export const RELIC_SOCKET_OFFSET = { x: 0.0000365841, z: -0.0357806645 };

export function planterSocketXZ({ centerX, centerZ, kind }: { centerX: number; centerZ: number; kind: string }): { x: number; z: number } {
  const off = kind === 'relic' ? RELIC_SOCKET_OFFSET : POINT_SOCKET_OFFSET;
  return { x: centerX + off.x, z: centerZ + off.z };
}

export function planterPlantYaw({ soldierX, soldierZ, centerX, centerZ, kind = 'point', yawOffset = PLANTER_PLANT_YAW_OFF }: {
  soldierX: number; soldierZ: number; centerX: number; centerZ: number; kind?: string; yawOffset?: number;
}): number {
  const s = planterSocketXZ({ centerX, centerZ, kind });
  return Math.atan2(s.x - soldierX, s.z - soldierZ) - yawOffset;
}

export function captureSlotTarget({ isPlanter, slotX, slotZ, centerX, centerZ, soldierX, soldierZ, kind = 'point', minDistance = CAPTURE_GUARD_DISTANCE, plantDistance = PLANTER_PLANT_DISTANCE }: {
  isPlanter: boolean; slotX: number; slotZ: number; centerX: number; centerZ: number;
  soldierX: number; soldierZ: number; kind?: string; minDistance?: number; plantDistance?: number;
}): { x: number; z: number } {
  if (isPlanter) {
    const s = planterSocketXZ({ centerX, centerZ, kind });
    let dx = soldierX - s.x;
    let dz = soldierZ - s.z;
    if (Math.hypot(dx, dz) < 1e-6) {
      dx = 1;
      dz = 0;
    }
    const inv = 1 / Math.hypot(dx, dz);
    return { x: s.x + dx * inv * plantDistance, z: s.z + dz * inv * plantDistance };
  }
  let dx = slotX - centerX;
  let dz = slotZ - centerZ;
  if (Math.hypot(dx, dz) >= minDistance) {
    return { x: slotX, z: slotZ };
  }
  if (Math.hypot(dx, dz) < 1e-6) {
    dx = soldierX - centerX;
    dz = soldierZ - centerZ;
  }
  if (Math.hypot(dx, dz) < 1e-6) {
    dx = 1;
    dz = 0;
  }
  const inv = 1 / Math.hypot(dx, dz);
  return { x: centerX + dx * inv * minDistance, z: centerZ + dz * inv * minDistance };
}

// Capture hold: a squad ordered onto a point halts at guard distance instead
// of marching everybody in — only the planter walks to the plant ring.
export function shouldHoldForCapture({ orderX, orderZ, squadX, squadZ, spX, spZ, captureRadius, guardDistance = CAPTURE_GUARD_DISTANCE }: {
  orderX: number; orderZ: number; squadX: number; squadZ: number;
  spX: number; spZ: number; captureRadius: number; guardDistance?: number;
}): boolean {
  const orderOnPoint = Math.hypot(orderX - spX, orderZ - spZ) < captureRadius;
  const holdingRange = Math.hypot(squadX - spX, squadZ - spZ) <= guardDistance;
  return orderOnPoint && holdingRange;
}

// Engagement (slots + point anims) needs boots on the point or a held order;
// progress itself needs boots on the point — a bare order must not cap.
export function isCaptureEngaged({ squadInside, soldierInside, orderedHold }: {
  squadInside?: unknown; soldierInside?: unknown; orderedHold?: unknown;
}): unknown {
  return squadInside || soldierInside || orderedHold;
}

// Capture tick gate: proximity alone never caps — the squad must carry an
// explicit right-click capture order for this point AND have boots on it.
export function shouldTickCapture({ captureOrderSpId, spId, squadInside, soldierInside }: {
  captureOrderSpId?: unknown; spId?: unknown; squadInside?: unknown; soldierInside?: unknown;
}): unknown {
  return captureOrderSpId === spId && (squadInside || soldierInside);
}

// Capture progress rate: a full bar ticks in 20s of uninterrupted capping.
export const CAPTURE_PROGRESS_RATE = 1 / 20;
// No grace period: abandoned progress drains on the very next frame after
// capping stops. Kept at 0 for API compatibility.
export const CAPTURE_DECAY_DELAY_SEC = 0;

// Idle decay: contested-but-abandoned progress drains toward 0 at the
// capture rate. Owned points (|progress| === 1) never decay — callers skip
// them before calling this.
export function decayedCaptureProgress(progress: number, deltaTime: number, rate = CAPTURE_PROGRESS_RATE): number {
  if (progress > 0) {
    return Math.max(0, progress - rate * deltaTime);
  }
  if (progress < 0) {
    return Math.min(0, progress + rate * deltaTime);
  }
  return 0;
}

// Fleeing: running away from the aim direction (more than 90° apart) — the
// soldier keeps facing where it runs instead of twisting back to fire.
export function isFleeingMove(moveAngle: number, aimAngle: number): boolean {
  return Math.cos(moveAngle - aimAngle) < 0;
}

// Shoot lock: a one-shot firing clip plays to the end instead of being cut
// by the next request — unless the player issued a new order (force),
// which must cut instantly like any RTS stop/move command.
export function animSwitchBlocked({ currentAnim, shootDone, name, force = false }: {
  currentAnim?: string | null; shootDone?: boolean; name?: string; force?: boolean;
}): boolean {
  if (force) {
    return false;
  }
  return (currentAnim === 'shoot' || currentAnim === 'shootMove' || currentAnim === 'melee') && !shootDone && name !== currentAnim;
}

// Seconds a soldier holds the weapon-ready idle_tracking pose after combat
// (a player stop order or a finished firing clip) before relaxing to idle.
export const IDLE_TRACKING_HOLD_SEC = 2.5;

// Resolves an 'idle' request to 'idle' or 'idle_tracking'. A forced request
// (Q/RMB order edge) always enters the tracking pose first; later idle
// ticks hold it until `trackingUntil`, then relax to plain idle.
export function resolveIdleAnim({ hasTracking, force = false, shootJustEnded = false, currentAnim = null, trackingUntil = 0, now = 0 }: {
  hasTracking?: boolean; force?: boolean; shootJustEnded?: boolean;
  currentAnim?: string | null; trackingUntil?: number; now?: number;
}): string {
  if (!hasTracking) {
    return 'idle';
  }
  if (force) {
    return 'idle_tracking';
  }
  if (shootJustEnded) {
    return 'idle_tracking';
  }
  if (currentAnim === 'idle_tracking' && now < trackingUntil) {
    return 'idle_tracking';
  }
  return 'idle';
}

// Squad weapon upgrades: grenade launchers (per-soldier isGrenadier) plus
// plasma pistols/guns (squad-wide projectileType, carried by non-grenadiers
// — see applySquadWeaponVisuals). Capped at MAX_UPGRADES_PER_SQUAD.
// `soldiers` are the alive soldier components of one squad.
export const MAX_UPGRADES_PER_SQUAD = 5;

export function numberOfUpgrades(soldiers: { isGrenadier?: boolean }[] | null | undefined, projectileType: string): number {
  const list = soldiers || [];
  const grenadiers = list.filter((s) => s && s.isGrenadier).length;
  const plasma = projectileType === 'plasma' || projectileType === 'plasma-final' || projectileType === 'plasma-cloud-puff'
    ? list.filter((s) => s && !s.isGrenadier).length
    : 0;
  return Math.min(MAX_UPGRADES_PER_SQUAD, grenadiers + plasma);
}

// Base melee damage per swing; long animation clips can limit attack cadence.
export const MELEE_DAMAGE_BASE = 8.0;
export const MELEE_RANGE = 2.4;
// Center-to-center gap duelists hold. Must stay above the collision body
// diameter (see systems/melee-collision.ts) so the two systems do not fight
// each other every frame; models are up to ~1.7 wide at the torso.
export const MELEE_STANDOFF = 1.9;
// How long a melee hit reaction holds before the soldier returns to his own
// animation. Every DoW clip here is exported at 2.5 s, which would otherwise
// replace attacks and firing for a full clip length after a single hit.
export const MELEE_HIT_REACTION_SEC = 0.8;

export function meleeDamageEstimate(soldiers: { attackRate?: number }[] | null | undefined): number {
  const list = (soldiers || []).filter(Boolean);
  if (!list.length) {
    return 0;
  }
  const avgRate = list.reduce((sum, s) => sum + (s.attackRate || 0), 0) / list.length;
  return MELEE_DAMAGE_BASE * avgRate;
}

export function computeSoldierYaw({ shooting, moving, moveAngle, aimAngle, currentYaw, deltaTime, fleeing = false }: {
  shooting?: boolean; moving?: boolean; moveAngle: number; aimAngle: number;
  currentYaw: number; deltaTime: number; fleeing?: boolean;
}): number {
  if (!fleeing && (!moving || shooting)) {
    let dy = aimAngle - currentYaw;
    while (dy > Math.PI) {
      dy -= Math.PI * 2;
    }
    while (dy < -Math.PI) {
      dy += Math.PI * 2;
    }
    return currentYaw + dy * (1 - Math.exp(-8 * deltaTime));
  }
  return moveAngle;
}
