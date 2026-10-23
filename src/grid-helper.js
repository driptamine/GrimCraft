/**
 * Arena-floor grid math. Pure, no engine imports.
 *
 * Both tiers generate symmetric multiples from the origin, so macro ribbons
 * always land exactly on the micro lines skipped for them — regardless of
 * the half-extent. Requires macro to be a whole multiple of micro.
 */
export function macroLinePositions(half, macro) {
  const positions = [];
  const count = Math.floor(half / macro + 1e-9);
  for (let k = -count; k <= count; k++) {
    positions.push(k * macro);
  }
  return positions;
}

export function microLinePositions(half, micro, macro) {
  const positions = [];
  const count = Math.floor(half / micro + 1e-9);
  const perMacro = Math.round(macro / micro);
  for (let k = -count; k <= count; k++) {
    if (k % perMacro === 0) {
      continue;
    }
    positions.push(k * micro);
  }
  return positions;
}
