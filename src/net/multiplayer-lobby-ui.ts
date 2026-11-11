import { LOBBIES, capacityLabel, createLobby, lobbySlots, setLobbySlot, type Lobby } from './lobbies.js';
import { serverIdFromPath, setServerRoute } from './server-route.js';
import { fetchOnlineLobbies, createOnlineLobby } from './lobby-api.js';
import { makeLocalMatch, type LocalMatchConfig } from '../core/local-match.js';
import { skirmishMapCards, defaultSkirmishMap, type MapCard } from '../ui/maps-menu.js';

type Screen = 'servers' | 'maps' | 'lobby';
const FACTIONS = ['Space Marines', 'Imperial Guard', 'Chaos', 'Eldar', 'Dark Eldar', 'Orks', 'Necrons', 'Tau'];
const TITLES: Record<Screen, string> = { servers: 'ONLINE JOIN GAME', maps: 'CREATE GAME · SELECT MAP', lobby: 'ONLINE GAME SETUP' };

export function mountMultiplayerLobby(panel: HTMLElement, options: {
  back: () => void;
  select: (lobby: Lobby, map: MapCard | null) => void;
  connect: () => void;
  startLocal: (config: LocalMatchConfig) => void;
  joinOnline: (lobby: Lobby, username: string) => Promise<void>;
  leaveOnline: () => void;
  startOnline: (computers: Array<{faction: string; team: number}>) => void;
  factionOnline: (faction: string) => void;
}): { reset: () => void; onlineLobby: (lobby: Lobby, playerId: number | null) => void; status: (message: string) => void } {
  const connection = panel.querySelector<HTMLElement>('#webTransport-connect-form')!;
  const loading = panel.querySelector<HTMLElement>('#webTransport-load-wrap')!;
  panel.classList.add('mp-shell');
  panel.innerHTML = `
    <header class="mp-heading"><span class="mp-brand">GRIMCRAFT <small>MULTIPLAYER</small></span><h1></h1><label class="mp-session"><span id="mp-server-status">CONNECTING TO GO…</span><input id="mp-username" aria-label="Player name" maxlength="32"></label></header>
    <div class="mp-columns">
      <section class="mp-left"><div class="mp-metal mp-list-frame"><h2 class="mp-tab" id="mp-list-title"></h2><div id="mp-list" class="mp-inset"></div></div>
        <footer class="mp-parchment"><div id="mp-actions"></div><p id="mp-hint"></p></footer>
      </section>
      <aside class="mp-right">
        <section class="mp-metal mp-map-panel"><h2 id="mp-map-title" class="mp-map-title"></h2><div class="mp-map-content"><div><div class="mp-map-stats"><span>Max Players: <b id="mp-max-players"></b></span><span>Map Size: <b id="mp-map-size"></b></span></div><p id="mp-map-description" class="mp-inset"></p></div><div id="mp-preview" class="mp-inset"></div></div></section>
        <section class="mp-metal mp-options"><div class="mp-inset"><div><h3>Game Options</h3><dl><dt>AI difficulty</dt><dd>Standard</dd><dt>Starting resources</dt><dd>Standard</dd><dt>Lock teams</dt><dd>Yes</dd><dt>Enable cheats</dt><dd>No</dd><dt>Starting location</dt><dd>Fixed</dd><dt>Game speed</dt><dd>Normal</dd><dt>Resource Sharing</dt><dd>No</dd><dt>Resource Rate</dt><dd>Standard</dd></dl></div><div><h3>Game rules</h3><p>Annihilate</p><p>Control Area</p><p>Take and Hold</p></div></div></section>
        <section class="mp-metal mp-chat"><h2 class="mp-tab">Chat Area</h2><div id="mp-chat-log" class="mp-inset" role="log" aria-label="Lobby chat"></div><form id="mp-chat-form"><label class="mp-sr-only" for="mp-chat-input">Message</label><input id="mp-chat-input" autocomplete="off" maxlength="300" placeholder="Type a message…"><button type="submit">Send</button></form><span class="mp-chat-note">Local chat preview</span></section>
      </aside>
    </div>
    <details class="mp-connection"><summary>Connection settings</summary><div id="mp-connection-content"></div></details>
    <div id="mp-loading"></div>`;
  panel.querySelector('#mp-connection-content')!.append(connection);
  panel.querySelector('#mp-loading')!.append(loading);
  // Keep the existing networking inputs and progress UI; navigation belongs to this screen.
  const status = connection.querySelector('#webTransport-connect-status');
  if (status) panel.append(status);
  const cards = skirmishMapCards();
  const username = panel.querySelector<HTMLInputElement>('#mp-username')!;
  username.value = `Player ${Math.floor(1000 + Math.random() * 9000)}`;
  let onlinePlayerId: number | null = null;
  let screen: Screen = 'servers';
  let selected: Lobby | null = LOBBIES[0] || null;
  let selectedMap: MapCard = defaultSkirmishMap(cards) || cards[0];
  let room: Lobby | null = null;
  let hosted = false;
  const hostedRooms = new WeakSet<Lobby>();
  const localRooms: Lobby[] = [];
  let ready = false;
  let routeRequest = 0;
  const chat: Array<{ name: string; text: string }> = [];
  const $ = (selector: string) => panel.querySelector<HTMLElement>(selector)!;
  const mapFor = (lobby: Lobby | null): MapCard | null => cards.find(c => c.name === lobby?.map || (lobby?.map && c.name.toLowerCase().includes(lobby.map.toLowerCase()))) || null;
  const label = (card: MapCard) => card.name.replace(/^\d+p\s+/i, '');
  function button(text: string, action: () => void, disabled = false): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = text; button.disabled = disabled;
    button.addEventListener('click', action);
    return button;
  }
  function sync(): void {
    if (room) options.select(room, mapFor(room));
  }
  async function open(lobby: Lobby, isHost = hostedRooms.has(lobby)): void {
    routeRequest++;
    room = lobby; selected = lobby; hosted = isHost; ready = false; chat.length = 0;
    setServerRoute(lobby.id || null);
    screen = 'lobby'; sync(); render();
    if (lobby.id) {
      try { await options.joinOnline(lobby, username.value.trim() || 'Player'); }
      catch (error) { $('#mp-hint').textContent = (error as Error).message; }
    }
  }
  async function create(mode: 'auto' | 'local' = 'auto'): Promise<void> {
    const name = panel.querySelector<HTMLInputElement>('#mp-game-name')?.value || 'My Game';
    let lobby: Lobby;
    try {
      lobby = mode !== 'local' ? await createOnlineLobby(name, selectedMap.name, selectedMap.players || 6)
        : createLobby({ name, map: selectedMap.name, total: selectedMap.players || 6 });
    } catch (error) { $('#mp-hint').textContent = `Cannot create online game: ${(error as Error).message}. Start grimcraft-go on port 8080, or choose Local Game.`; return; }
    if (lobby.id) {
      hostedRooms.add(lobby); LOBBIES.unshift(lobby); await open(lobby, true); return;
    }
    lobby.players[0].faction = 'Imperial Guard';
    lobby.players[0].controller = 'human';
    hostedRooms.add(lobby);
    localRooms.push(lobby);
    LOBBIES.unshift(lobby); open(lobby, true);
  }
  function renderDetail(): void {
    const card = screen === 'maps' ? selectedMap : mapFor(screen === 'lobby' ? room : selected);
    const lobby = screen === 'lobby' ? room : selected;
    $('#mp-map-title').textContent = card ? `${label(card)} (${card.players || lobby?.total || 6})` : lobby?.map || 'Select a game';
    $('#mp-max-players').textContent = String(card?.players || lobby?.total || '—');
    $('#mp-map-size').textContent = card?.path && /alvarus/i.test(card.path) ? '512 × 512' : card && !card.path ? 'Arena' : '—';
    $('#mp-map-description').textContent = card ? `${label(card)}. Secure strategic points, control resources and lead your army to victory.` : 'Select a game to view its battlefield and player capacity.';
    const preview = $('#mp-preview'); preview.replaceChildren();
    if (card?.previewUrl) {
      const img = document.createElement('img'); img.src = card.previewUrl; img.alt = `${label(card)} map preview`;
      img.addEventListener('error', () => { preview.textContent = 'NO PREVIEW'; });
      preview.append(img);
    } else preview.textContent = card && !card.path ? 'ARENA' : 'NO PREVIEW';
  }
  function renderServers(): void {
    const list = $('#mp-list');
    list.className = 'mp-inset mp-server-list';
    const head = document.createElement('div'); head.className = 'mp-server-head';
    for (const text of ['Game Name', 'Map Name', 'Ping', 'Players']) {
      const span = document.createElement('span'); span.textContent = text; head.append(span);
    }
    list.append(head);
    for (const lobby of LOBBIES) {
      const row = button('', () => {
        selected = lobby;
        list.querySelectorAll('.mp-server-row').forEach(el => el.classList.toggle('active', el === row));
        const join = panel.querySelector<HTMLButtonElement>('#mp-join'); if (join) join.disabled = false;
        renderDetail();
      });
      row.className = 'mp-server-row' + (selected === lobby ? ' active' : '');
      for (const value of [lobby.name, lobby.map || '—', '—', capacityLabel(lobby)]) {
        const span = document.createElement('span'); span.textContent = value; row.append(span);
      }
      row.addEventListener('dblclick', () => open(lobby));
      row.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); open(lobby); } });
      list.append(row);
    }
    const actions = $('#mp-actions');
    actions.append(button('Refresh', () => { const id = serverIdFromPath(window.location.pathname); if (id) void restoreRoute(id, ++routeRequest); else void refresh(); }), button('Create Game', () => { screen = 'maps'; render(); }), button('Back', () => { setServerRoute(null); options.back(); }));
    const join = button('Join Game', () => { if (selected) open(selected); }, !selected); join.id = 'mp-join'; actions.append(join);
  }
  function renderMaps(): void {
    const list = $('#mp-list'); list.className = 'mp-inset mp-map-list';
    const nameRow = document.createElement('label'); nameRow.className = 'mp-game-name'; nameRow.textContent = 'Game name';
    const name = document.createElement('input'); name.id = 'mp-game-name'; name.value = 'My Game'; name.maxLength = 64; nameRow.append(name); list.append(nameRow);
    for (const card of cards) {
      const row = button('', () => {
        selectedMap = card;
        list.querySelectorAll('.mp-map-row').forEach(el => el.classList.toggle('active', el === row));
        renderDetail();
      });
      row.className = 'mp-map-row' + (selectedMap === card ? ' active' : '');
      const title = document.createElement('span'); title.textContent = label(card);
      const players = document.createElement('span'); players.textContent = `${card.players || 6} players`;
      row.append(title, players);
      row.addEventListener('dblclick', () => { void create(); });
      row.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); selectedMap = card; create(); } });
      list.append(row);
    }
    $('#mp-actions').append(button('Back', () => { screen = 'servers'; render(); }), button('Create Game', () => { void create(); }));
    $('#mp-actions').append(button('Local Game', () => { void create('local'); }));
  }
  function renderPlayers(): void {
    if (!room) return;
    const list = $('#mp-list'); list.className = 'mp-inset mp-players-list';
    const title = document.createElement('div'); title.className = 'mp-room-name'; title.textContent = room.name; list.append(title);
    const slots = lobbySlots(room);
    for (let i = 0; i < room.total; i++) {
      const player = slots[i];
      const row = document.createElement('div'); row.className = 'mp-player-row' + (hosted ? ' mp-host-slot' : '') + (!player ? ' mp-player-empty' : '');
      if (hosted && (!room.id || !player || player.controller === 'computer')) {
        const control = document.createElement('select'); control.className = 'mp-slot-controller';
        control.setAttribute('aria-label', `Slot ${i + 1}`);
        for (const [value, text] of [['open', 'Open slot'], ['computer', 'Computer'], ...(i === 0 ? [['human', 'Human (you)']] : [])]) {
          const option = document.createElement('option'); option.value = value; option.textContent = text; control.append(option);
        }
        control.value = player ? player.controller === 'computer' ? 'computer' : 'human' : 'open';
        control.addEventListener('change', () => {
          if (!room) return;
          setLobbySlot(room, i, control.value === 'open' ? null : {
            username: control.value === 'computer' ? `Computer ${i + 1}` : 'HOST',
            faction: player?.faction || 'Space Marines', team: player?.team || (i === 0 ? 1 : 2), ping: 0,
            controller: control.value === 'computer' ? 'computer' : 'human',
          });
          ready = false; sync(); render();
        });
        row.append(control);
      }
      if (player) {
        const identity = document.createElement('div'); identity.className = 'mp-player-identity';
        const name = document.createElement('strong'); name.textContent = player.username;
        const colour = document.createElement('span'); colour.className = 'mp-player-colour'; colour.style.background = player.team === 2 ? '#a83e32' : '#3e7295';
        identity.append(name, colour);
        const faction = document.createElement('select'); faction.setAttribute('aria-label', `Faction for ${player.username}`);
        const factions = FACTIONS.includes(player.faction) ? FACTIONS : [player.faction, ...FACTIONS];
        for (const text of factions) { const option = document.createElement('option'); option.textContent = text; option.value = text; faction.append(option); }
        faction.value = player.faction; faction.disabled = room.id ? (player.controller === 'computer' ? !hosted : player.player_id !== onlinePlayerId) : !hosted;
        faction.addEventListener('change', () => { player.faction = faction.value; if (room?.id && player.controller !== 'computer') options.factionOnline(player.faction); sync(); });
        const team = document.createElement('select'); team.className = 'mp-team';
        team.setAttribute('aria-label', `Team for ${player.username}`); team.disabled = !!room.id || !hosted;
        for (const n of [1, 2]) { const option = document.createElement('option'); option.value = String(n); option.textContent = `Team ${n}`; team.append(option); }
        team.value = String(player.team);
        team.addEventListener('change', () => { player.team = Number(team.value); sync(); render(); });
        const isReady = player.controller === 'computer' || (hosted && i === 0 && ready);
        const indicator = document.createElement('span'); indicator.className = 'mp-ready' + (isReady ? ' is-ready' : '');
        indicator.textContent = isReady ? '✓' : '·'; indicator.title = isReady ? 'Ready' : 'Not ready';
        row.append(identity, faction, team, indicator);
      } else {
        const empty = document.createElement('span'); empty.textContent = !room.slots && i < room.current ? 'Player data unavailable' : 'Open slot';
        row.append(empty);
      }
      list.append(row);
    }
    $('#mp-actions').append(button('Back', () => { routeRequest++; if (room?.id) options.leaveOnline(); setServerRoute(null); screen = 'servers'; room = null; render(); void refresh(); }));
    if (hosted && slots.some(player => player && player.controller !== 'computer')) $('#mp-actions').append(button(ready ? 'Not Ready' : 'Ready', () => { ready = !ready; render(); }));
    if (hosted) {
      $('#mp-actions').append(button('Start Game', () => {
        if (!room) return;
        try {
          if (room.id) options.startOnline(lobbySlots(room).filter(player => player?.controller === 'computer').map(player => ({faction: player!.faction, team: player!.team})));
          else options.startLocal(makeLocalMatch(room, mapFor(room)?.path || 'arena'));
        }
        catch (error) { $('#mp-hint').textContent = (error as Error).message; }
      }));
    } else if (!room.id) $('#mp-actions').append(button('Connect', options.connect));
    else { const note = document.createElement('span'); note.textContent = 'Waiting for host to start…'; $('#mp-actions').append(note); }
  }
  function renderChat(): void {
    const log = $('#mp-chat-log'); log.replaceChildren();
    if (!chat.length) {
      const message = document.createElement('p'); message.className = 'mp-chat-system';
      message.textContent = screen === 'lobby' && room ? `Lobby: ${room.name}` : 'Double-click a game to enter its lobby.'; log.append(message);
    }
    for (const message of chat) {
      const line = document.createElement('p'); const author = document.createElement('b'); author.textContent = `${message.name}: `;
      line.append(author, document.createTextNode(message.text)); log.append(line);
    }
    log.scrollTop = log.scrollHeight;
    panel.querySelector<HTMLInputElement>('#mp-chat-input')!.disabled = screen !== 'lobby';
    panel.querySelector<HTMLButtonElement>('#mp-chat-form button')!.disabled = screen !== 'lobby';
  }
  function render(): void {
    panel.dataset.screen = screen;
    panel.querySelector('h1')!.textContent = TITLES[screen];
    $('#mp-list-title').textContent = screen === 'servers' ? 'List of Games' : screen === 'maps' ? 'Select Battlefield' : 'Players List';
    $('#mp-list').replaceChildren(); $('#mp-actions').replaceChildren();
    if (screen === 'servers') renderServers(); else if (screen === 'maps') renderMaps(); else renderPlayers();
    $('#mp-hint').textContent = screen === 'servers' ? 'Double-click a game to open its lobby.' : screen === 'maps' ? 'Double-click a map to create your game.' : 'Choose your army and prepare for battle.';
    renderDetail(); renderChat();
  }
  $('#mp-chat-form').addEventListener('submit', e => {
    e.preventDefault(); const input = panel.querySelector<HTMLInputElement>('#mp-chat-input')!;
    if (screen !== 'lobby' || !input.value.trim()) return;
    chat.push({ name: hosted ? 'HOST' : 'You', text: input.value.trim() }); input.value = ''; renderChat();
  });
  async function refresh(): Promise<void> {
    if (!panel.isConnected || screen !== 'servers') return;
    try {
      const lobbies = await fetchOnlineLobbies();
      $('#mp-server-status').textContent = 'GO SERVER · ONLINE';
      const selectedId = selected?.id;
      LOBBIES.splice(0, LOBBIES.length, ...lobbies.sort((a,b) => (a.id || '').localeCompare(b.id || '', undefined, {numeric:true})), ...localRooms);
      selected = LOBBIES.find(lobby => lobby.id === selectedId) || LOBBIES[0] || null;
      if (screen === 'servers') render();
    } catch (error) {
      $('#mp-server-status').textContent = 'GO SERVER · UNAVAILABLE';
      $('#mp-hint').textContent = 'Start grimcraft-go on port 8080. Local games are still available.';
    }
  }
  async function restoreRoute(serverId: string, request: number): Promise<void> {
    $('#mp-hint').textContent = `Connecting to ${serverId}…`;
    try {
      const lobbies = await fetchOnlineLobbies();
      if (!panel.isConnected || request !== routeRequest || serverIdFromPath(window.location.pathname) !== serverId) return;
      $('#mp-server-status').textContent = 'GO SERVER · ONLINE';
      const lobby = lobbies.find(candidate => candidate.id === serverId);
      if (!lobby) throw new Error(`Server ${serverId} was not found. It may have been removed or the Go server restarted.`);
      await open(lobby);
    } catch (error) {
      if (request === routeRequest) $('#mp-hint').textContent = (error as Error).message;
    }
  }
  const polling = setInterval(() => {
    if (!panel.isConnected) { clearInterval(polling); return; }
    if (!serverIdFromPath(window.location.pathname) && panel.closest<HTMLElement>('#webTransport-connect-overlay')?.style.display !== 'none') void refresh();
  }, 2000);
  render();
  return { onlineLobby: (lobby, playerId) => {
    if (!room?.id || room.id !== lobby.id) return;
    // Keep configured local computer slots until the server starts the match.
    const bots = room.slots?.filter(player => player?.controller === 'computer') || [];
    room = {...lobby, players: lobby.players || []};
    onlinePlayerId = playerId;
    hosted = lobby.host_id === playerId;
    if (!lobby.started && bots.length) {
      room.slots = [...room.players];
      for (const bot of bots) if (room.slots.length < room.total) room.slots.push(bot);
      room.current = room.slots.filter(Boolean).length;
    }
    selected = room; sync(); render();
  }, status: (message) => { $('#mp-hint').textContent = message; }, reset: () => {
    const serverId = serverIdFromPath(window.location.pathname);
    if (room?.id && room.id === serverId) { screen = 'lobby'; render(); return; }
    const request = ++routeRequest;
    if (room?.id) options.leaveOnline();
    screen = 'servers'; room = null; render();
    if (serverId) void restoreRoute(serverId, request);
    else void refresh();
  } };
}
