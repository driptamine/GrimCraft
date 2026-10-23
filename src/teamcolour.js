// Soulstorm .teamcolour parsing (Dawn of War Lua-ish army scheme files).
//
// Pure module: no engine imports, so node --test covers it. The game loads
// one file per faction (see `teamcolour` in src/factions/*.js) and exposes
// the palette on the faction container for HUD/banner use. Nothing here
// touches materials: the converted GLBs are fully painted, so there is no
// team-color mask channel to multiply (see cadian31 notes below).

// Cadian 31st ("31st Harakoni Warhawks") reference values from
// models/ig/color/cadian31.teamcolour — Primary khaki #979082, Trim light
// grey #D4D4D4, Secondary/Eyes/Weapons near-black #232323.
export const TEAMCOLOUR_SLOTS = ['eyes', 'weapons', 'primary', 'trim', 'secondary'];

function _parseSlot(body, name) {
  // `Name = { b = 1, g = 2, r = 3, }` with arbitrary order/whitespace.
  const block = new RegExp(name + '\\s*=\\s*\\{([^}]*)\\}', 'i').exec(body);
  if (!block) return null;
  const inner = block[1];
  const channel = (ch) => {
    const m = new RegExp('\\b' + ch + '\\s*=\\s*(\\d+)', 'i').exec(inner);
    if (!m) return null;
    const v = Number(m[1]);
    return Number.isFinite(v) ? Math.max(0, Math.min(255, Math.round(v))) : null;
  };
  const r = channel('r');
  const g = channel('g');
  const b = channel('b');
  if (r == null || g == null || b == null) return null;
  return { r, g, b };
}

function _parseString(body, name) {
  const m = new RegExp(name + '\\s*=\\s*\"([^\"]*)\"', 'i').exec(body);
  return m ? m[1] : null;
}

// Parse .teamcolour text. Returns null when the text has no recognizable
// UnitCustomization block (missing file, wrong format) — callers treat null
// as "no faction colors" and keep defaults.
export function parseTeamcolour(text) {
  if (typeof text !== 'string' || !text) return null;
  if (!/UnitCustomization\s*=/i.test(text)) return null;
  const colors = {};
  for (const slot of TEAMCOLOUR_SLOTS) {
    colors[slot] = _parseSlot(text, slot);
  }
  if (!colors.primary) return null;
  return {
    associatedRace: _parseString(text, 'associated_race'),
    badgeName: _parseString(text, 'badge_name'),
    bannerName: _parseString(text, 'banner_name'),
    patternName: _parseString(text, 'pattern_name'),
    forceName: _parseString(text, 'force_name'),
    ...colors,
  };
}

// {r,g,b} 0-255 -> 0xRRGGBB int. Null-safe (null in, null out).
export function teamcolorHex(rgb) {
  if (!rgb) return null;
  return ((rgb.r & 0xff) << 16) | ((rgb.g & 0xff) << 8) | (rgb.b & 0xff);
}

// Fetch + parse. Loader errors (404, network) resolve null — a missing
// scheme file must never break model loading.
export async function loadTeamcolour(url, fetchImpl = fetch) {
  if (!url) return null;
  try {
    const res = await fetchImpl(url);
    if (!res || res.ok === false) return null;
    return parseTeamcolour(await res.text());
  } catch (_) {
    return null;
  }
}
