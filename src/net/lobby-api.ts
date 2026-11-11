import type { Lobby } from './lobbies.js';

export function multiplayerAPI(): string {
  // Local development: both normal and incognito windows use the same server.
  return 'http://127.0.0.1:8080';
}
export async function fetchOnlineLobbies(): Promise<Lobby[]> {
  const response = await fetch(`${multiplayerAPI()}/api/lobbies`, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error(`Go server: HTTP ${response.status}`);
  return (await response.json()).map((lobby: Lobby) => ({ ...lobby, players: lobby.players || [] }));
}
export async function createOnlineLobby(name: string, map: string, capacity: number): Promise<Lobby> {
  const response = await fetch(`${multiplayerAPI()}/api/lobbies`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, map, capacity }), signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`Cannot create lobby: HTTP ${response.status}`);
  return response.json();
}

export interface WebTransportConnection {
  enabled: boolean;
  webtransport_url: string;
  certificate_hash: string;
}
export async function fetchWebTransportConnection(): Promise<WebTransportConnection> {
  const response = await fetch(`${multiplayerAPI()}/api/connection`, {
    cache: 'no-store', signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`Cannot discover WebTransport: HTTP ${response.status}`);
  const info: WebTransportConnection = await response.json();
  if (!info.enabled) throw new Error('WebTransport is disabled. Start grimcraft-go without --no-wt.');
  const url = new URL(info.webtransport_url);
  if (url.protocol !== 'https:' || !/^[a-f0-9]{64}$/i.test(info.certificate_hash)) {
    throw new Error('Go server returned invalid WebTransport connection settings.');
  }
  return { ...info, webtransport_url: url.toString(), certificate_hash: info.certificate_hash.toLowerCase() };
}
