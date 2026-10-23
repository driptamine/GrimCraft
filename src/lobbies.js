// Static lobby browser data (wireframe): server list + per-server player slots.
// Shaped like a future server response so a backend can replace LOBBIES
// without touching the UI. No imports.

export const LOBBIES = [
  { name: 'Mechanize', map: 'Alvarus', current: 5, total: 6, players: [] },
  {
    name: 'Driptamine', map: 'Oasis of Sharr', current: 8, total: 8,
    players: [
      { username: 'Redemption_Arc', faction: 'Space Marines', team: 1, ping: 70 },
      { username: 'MASTER_YOBA', faction: 'Imperial Guard', team: 1, ping: 120 },
      { username: 'Driptamine', faction: 'Eldar', team: 1, ping: 100 },
      { username: 'Yang_Wen', faction: 'Sister Of Battle', team: 1, ping: 90 },
      { username: 'Mechanize', faction: 'Necron', team: 2, ping: 80 },
      { username: 'DANTIST', faction: 'Chaos', team: 2, ping: 100 },
      { username: 'Destar', faction: 'Orks', team: 2, ping: 160 },
      { username: 'El Bandido', faction: 'Tau', team: 2, ping: 30 },
    ],
  },
  { name: 'Henry Cavill', map: 'Mortalis', current: 5, total: 6, players: [] },
  { name: 'Doom Spiral', map: null, current: 3, total: 4, players: [] },
  { name: 'Burial Grounds', map: null, current: 8, total: 8, players: [] },
];

export function capacityLabel(lobby) {
  return `${lobby.current}/${lobby.total}`;
}

export function isFull(lobby) {
  return lobby.current >= lobby.total;
}

export function hasPlayers(lobby) {
  return Array.isArray(lobby.players) && lobby.players.length > 0;
}

export function createLobby({ name, map, total } = {}) {
  const capacity = Number(total);
  return {
    name: String(name || '').trim() || 'My Game',
    map: String(map || '').trim() || 'Arena',
    current: 1,
    total: Number.isFinite(capacity) && capacity > 0 ? Math.floor(capacity) : 6,
    players: [{ username: 'HOST', faction: '—', team: 1, ping: 0 }],
  };
}
