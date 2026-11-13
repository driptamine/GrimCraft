const SOLDIER_HEIGHT = 1.85;
export const CLOUD_BLASTER_STAGE_LENGTHS = [0.2, 0.4, 0.6].map(fraction => SOLDIER_HEIGHT * fraction);

/** One world-space segment drives both the blue core and all seven clouds. */
export function plasmaCloudLayout(distance: number, travelled: number, lengthScale: number) {
  const travel = Math.max(0, travelled);
  const stage = Math.min(2, Math.floor(travel / distance * 3));
  const length = Math.min(distance, CLOUD_BLASTER_STAGE_LENGTHS[stage] * Math.max(.05, lengthScale));
  return { start: Math.min(travel, distance - length), length, visible: travel < distance };
}
