import { lobbySlots, type Lobby } from '../net/lobbies.js';

export const LOBBY_FACTIONS: Record<string, string> = {
  'Space Marines': 'space marines', 'Imperial Guard': 'ig', Chaos: 'chaos',
  Eldar: 'eldar', 'Dark Eldar': 'dark eldar', Orks: 'orks', Necrons: 'necrons', Tau: 'tau',
};
export interface LocalMatchSeat {
  slot: number;
  owner?: number;
  faction: string;
  team: 'blue' | 'red';
  computer: boolean;
}
export interface LocalMatchConfig { mapKey: string; seats: LocalMatchSeat[] }
let activeMatch: LocalMatchConfig | null = null;
export function setLocalMatch(config: LocalMatchConfig | null): void { activeMatch = config; }
export function localMatchFor(mapKey: string): LocalMatchConfig | null {
  return activeMatch?.mapKey === mapKey ? activeMatch : null;
}
export function isComputerOnlyMatch(mapKey: string): boolean {
  return activeMatch?.mapKey === mapKey && !!activeMatch.seats.length && activeMatch.seats.every(seat => seat.computer);
}
export function makeLocalMatch(lobby: Lobby, mapKey: string): LocalMatchConfig {
  const seats = lobbySlots(lobby).flatMap((player, slot): LocalMatchSeat[] => player ? [{
    slot, faction: LOBBY_FACTIONS[player.faction] || 'ig',
    team: player.team === 2 ? 'red' : 'blue', computer: player.controller === 'computer',
  }] : []);
  if (seats.length < 2 || new Set(seats.map(s => s.team)).size < 2) {
    throw new Error('Add a Computer on the opposing team to start the game.');
  }
  return { mapKey, seats };
}

// Alvarus has three starts on each side. Lobby slots are player identities,
// not the map's physical start indices: place the host and first opponent
// in the central lanes, then fill each side's flanks without reusing a start.
export function localMatchPositions<T extends { x: number; z: number }>(
  config: LocalMatchConfig, positions: T[],
): Map<number, T> {
  if (!/(?:^|\/)6p_alvarus(?:\.sgb)?$/i.test(config.mapKey) || positions.length !== 6) {
    return new Map(config.seats.flatMap(seat => positions[seat.slot] ? [[seat.slot, positions[seat.slot]] as [number, T]] : []));
  }
  const host = config.seats.find(seat => seat.slot === 0) || config.seats.find(seat => !seat.computer) || config.seats[0];
  const assigned = new Map<number, T>();
  if (!host) return assigned;
  const used = new Set<number>();
  const seats = [host, ...config.seats.filter(seat => seat !== host)];
  for (const seat of seats) {
    const order = seat.team === host.team ? [1, 0, 2, 4, 5, 3] : [4, 5, 3, 1, 0, 2];
    const index = order.find(index => !used.has(index));
    if (index === undefined) continue;
    used.add(index);
    assigned.set(seat.slot, positions[index]);
  }
  return assigned;
}
