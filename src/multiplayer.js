import * as THREE from 'three';
import { World } from './ecs.js';
import {
  scene, world, setWorld, PLAYER, requisition, setRequisition, energy, setEnergy,
  kills, setKills, gameOver, setGameOver, selSquads, selBuilder,
} from './scene.js';
import { updateHUD } from './hud.js';
import { applySquadWeaponVisuals } from './entities.js';
import {
  makeHpBar, makeSoldierMesh, makeBarracksMesh, makeTowerMesh,
  makeThermoMesh, makeAirfieldMesh, makeApcMesh, makeGunTurretMesh,
  makeStrategicPointMesh, makeLaserBulletMesh, makePlasmaBulletMesh,
  makeBulletMesh, makeGrenadeMesh, makeMissileMesh,
} from './meshes.js';
import { disposeMeshComponent, _initSystems, spawnParticles } from './systems.js';
import { bootGame, resetGame } from './game.js';
import { issueRightClick, pickMesh, raycastGround } from './input.js';
import { disposeObj } from './three-helpers.js';
import { listBuiltinMaps, selectMap, previewState, entryLabel, skirmishMapCards, defaultSkirmishMap } from './maps-menu.js';
import { LOBBIES, capacityLabel, isFull, hasPlayers, createLobby } from './lobbies.js';

export let SERVER_URL = 'https://127.0.0.1:4433/grimcraft';
export let SERVER_CERT_HASH = '4c0409537cdf2905891d85c70369531614f138c923008c092ff72e31bc46fc25';

export let _myPlayerId = null;
export let _myTeam = null;
export let _netStatus = 'disconnected';
let _lastSnapshotTick = 0;
let _lastDeltaTick = 0;
let _selectedMap = null;
let _selectedLobby = null;

class StreamFramer {
  constructor() {
    this._buffer = new Uint8Array(0);
  }

  push(chunk) {
    const merged = new Uint8Array(this._buffer.length + chunk.length);
    merged.set(this._buffer);
    merged.set(chunk, this._buffer.length);
    this._buffer = merged;
  }

  drain() {
    const messages = [];
    while (this._buffer.length >= 4) {
      const length = new DataView(this._buffer.buffer, this._buffer.byteOffset, 4).getUint32(0, true);
      if (this._buffer.length < 4 + length) {
        break;
      }
      messages.push(this._buffer.slice(4, 4 + length));
      this._buffer = this._buffer.slice(4 + length);
    }
    return messages;
  }
}

class WTNet {
  constructor() {
    this._webTransport = null;
    this._cmdStream = null;
    this._cmdWriter = null;
    this._encoder = new TextEncoder();
    this._decoder = new TextDecoder();
  }

  async connect(url, certHash) {
    _netStatus = 'connecting';
    _updateNetHUD();
    const options = { allowPooling: false };
    if (certHash && certHash.length === 64) {
      options.serverCertificateHashes = [{
        algorithm: 'sha-256',
        value: _hexToBytes(certHash),
      }];
    }
    this._webTransport = new WebTransport(url, options);
    await this._webTransport.ready;
    _netStatus = 'connected';
    _updateNetHUD();
    this._cmdStream = await this._webTransport.createBidirectionalStream();
    this._cmdWriter = this._cmdStream.writable.getWriter();
    this._readAcks(this._cmdStream.readable);
    this._readUniStreams();
    this._readDatagrams();
  }

  async _readUniStreams() {
    try {
      for await (const stream of this._webTransport.incomingUnidirectionalStreams) {
        this._readStream(stream);
      }
    } catch (error) {
      if (_netStatus === 'connected') {
        _netStatus = 'error';
        _updateNetHUD();
      }
    }
  }

  async _readStream(readable) {
    const framer = new StreamFramer();
    try {
      for await (const chunk of readable) {
        framer.push(new Uint8Array(chunk));
        for (const bytes of framer.drain()) {
          _handleServerBytes(bytes);
        }
      }
    } catch (error) {
      // stream ended
    }
  }

  async _readAcks(readable) {
    const framer = new StreamFramer();
    try {
      for await (const chunk of readable) {
        framer.push(new Uint8Array(chunk));
        for (const bytes of framer.drain()) {
          _handleServerBytes(bytes);
        }
      }
    } catch (error) {
      // stream ended
    }
  }

  async _readDatagrams() {
    try {
      for await (const datagram of this._webTransport.datagrams.readable) {
        _handleServerBytes(new Uint8Array(datagram));
      }
    } catch (error) {
      // stream ended
    }
  }

  sendCmd(command) {
    if (!this._cmdWriter) {
      return;
    }
    const payload = this._encoder.encode(JSON.stringify({ Command: command }));
    this._cmdWriter.write(_makeFrame(payload));
  }

  sendJoin(team) {
    if (!this._cmdWriter) {
      return;
    }
    const payload = this._encoder.encode(JSON.stringify({ Join: { preferred_team: team } }));
    this._cmdWriter.write(_makeFrame(payload));
  }

  disconnect() {
    this._cmdWriter?.releaseLock();
    this._cmdWriter = null;
    this._webTransport?.close();
    this._webTransport = null;
    _netStatus = 'disconnected';
    _updateNetHUD();
  }
}

function _makeFrame(payload) {
  const frame = new Uint8Array(4 + payload.length);
  new DataView(frame.buffer).setUint32(0, payload.length, true);
  frame.set(payload, 4);
  return frame;
}

function _hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

const _decoder = new TextDecoder();

function _handleServerBytes(bytes) {
  let message;
  try {
    message = JSON.parse(_decoder.decode(bytes));
  } catch (error) {
    return;
  }
  if (message.Session) {
    _onSession(message.Session);
    return;
  }
  if (message.Snapshot) {
    _onSnapshot(message.Snapshot);
    return;
  }
  if (message.Delta) {
    _onDelta(message.Delta);
    return;
  }
  if (message.CmdAck) {
    _onCmdAck(message.CmdAck);
  }
}

function _onSession(info) {
  _myPlayerId = info.player_id;
  _myTeam = info.team === 'Blue' ? 'blue' : 'red';
  window._multiplayerMode = true;
  if (world) {
    for (const id of world.query('mesh')) {
      const meshComponent = world.get(id, 'mesh');
      if (meshComponent) {
        disposeMeshComponent(meshComponent);
      }
    }
  }
  const newWorld = new World();
  setWorld(newWorld);
  _initSystems(newWorld);
  setRequisition(1500);
  setEnergy(100);
  setKills(0);
  setGameOver(false);
  updateHUD();
  _setConnectOverlay(false);
  _updateNetHUD();
}

function _onSnapshot(snapshot) {
  _lastSnapshotTick = snapshot.tick;
  if (!world) {
    return;
  }
  const squadIds = new Set(snapshot.squads.map(([id]) => id));
  for (const id of world.query('squad')) {
    if (!squadIds.has(id)) {
      const meshComponent = world.get(id, 'mesh');
      if (meshComponent) {
        disposeObj(meshComponent.hpBar);
        disposeObj(meshComponent.reinBar);
        disposeObj(meshComponent.grenadeSetupBar);
      }
      world.destroyEntity(id);
    }
  }
  for (const [id, squadData] of snapshot.squads) {
    const team = squadData.team === 'Blue' ? 'blue' : 'red';
    if (!world._entities.has(id)) {
      world._entities.add(id);
      world._tags.set(id, new Set(['squad']));
      const hpBar = makeHpBar(2.8, team);
      hpBar.visible = false;
      const reinBar = makeHpBar(2.8, team);
      reinBar._fg.material.color = new THREE.Color(0.1, 0.9, 1.0);
      reinBar.visible = false;
      const grenadeBar = makeHpBar(2.8, team);
      grenadeBar._fg.material.color = new THREE.Color(1.0, 0.55, 0.0);
      grenadeBar._bg.material.color = new THREE.Color(0.18, 0.10, 0.0);
      grenadeBar.visible = false;
      world.add(id, 'mesh', { hpBar, reinBar, grenadeSetupBar: grenadeBar });
    }
    const existingSquad = world.get(id, 'squad');
    world.add(id, 'squad', {
      team,
      position: _toVector3(squadData.position),
      facing: _toVector3(squadData.facing),
      visualFacing: existingSquad?.visualFacing ?? _toVector3(squadData.facing),
      speed: squadData.speed,
      attackRange: squadData.attack_range,
      detectionRange: squadData.detection_range,
      grenadeCd: squadData.grenade_cd,
      grenadeReloadTime: squadData.grenade_reload_time,
      idleTime: squadData.idle_time,
      reinforceQueue: squadData.reinforce_queue || [],
      reinforceProgress: squadData.reinforce_progress,
      grenadeQueue: squadData.grenade_queue || [],
      grenadeProgress: squadData.grenade_progress,
      moveOrder: squadData.move_order ? _toVector3(squadData.move_order) : null,
      stopped: squadData.stopped,
      autoChase: squadData.auto_chase,
      projectileType: (squadData.projectile_type || 'Bullet').toLowerCase(),
      soldiers: squadData.soldiers.map((soldier) => soldier ?? null),
      forcedTarget: squadData.forced_target ?? null,
      forcedSoldierId: squadData.forced_soldier_id ?? null,
      autoReinforce: squadData.auto_reinforce,
      owner: squadData.owner,
      selected: existingSquad?.selected ?? false,
    });
    if (existingSquad && world.has(squadId, 'mesh')) {
      applySquadWeaponVisuals(world, squadId);
    }
  }
  updateHUD();
}

function _onDelta(delta) {
  if (delta.tick < _lastDeltaTick) {
    return;
  }
  _lastDeltaTick = delta.tick;
  for (const [id, x, z] of (delta.squad_pos || [])) {
    const squad = world.get(id, 'squad');
    if (squad) {
      squad.position.x = x;
      squad.position.z = z;
    }
  }
  for (const [id, facingX, facingZ] of (delta.squad_facing || [])) {
    const squad = world.get(id, 'squad');
    if (squad) {
      squad.facing.x = facingX;
      squad.facing.z = facingZ;
      squad.visualFacing.x = facingX;
      squad.visualFacing.z = facingZ;
    }
  }
}

function _onCmdAck(ack) {
  if (!ack.ok) {
    console.warn('[WTNet] Command rejected:', ack.reason);
  }
}

const _net = new WTNet();

export function netMoveSquads(ids, target) {
  _net.sendCmd({ MoveSquads: { squad_ids: ids, target: { x: target.x, y: target.y, z: target.z } } });
}
export function netMoveBuilders(ids, target) {
  _net.sendCmd({ MoveBuilders: { builder_ids: ids, target: { x: target.x, y: target.y, z: target.z } } });
}
export function netMoveApcs(ids, target) {
  _net.sendCmd({ MoveApcs: { apc_ids: ids, target: { x: target.x, y: target.y, z: target.z } } });
}
export function netMoveJets(ids, target) {
  _net.sendCmd({ MoveJets: { jet_ids: ids, target: { x: target.x, y: target.y, z: target.z } } });
}
export function netStopSquads(ids) {
  _net.sendCmd({ StopSquads: { squad_ids: ids } });
}
export function netAttackSquad(attackerIds, targetId) {
  _net.sendCmd({ AttackSquad: { attacker_ids: attackerIds, target_squad: targetId } });
}
export function netAttackSoldier(attackerIds, targetId) {
  _net.sendCmd({ AttackSoldier: { attacker_ids: attackerIds, target_soldier: targetId } });
}
export function netPlaceBuilding(type, position) {
  _net.sendCmd({ PlaceBuilding: { building_type: type, position: { x: position.x, y: position.y, z: position.z } } });
}
export function netReinforce(squadId, formIdx) {
  _net.sendCmd({ Reinforce: { squad_id: squadId, form_idx: formIdx } });
}
export function netAutoReinforce(squadId, enabled) {
  _net.sendCmd({ AutoReinforce: { squad_id: squadId, enabled } });
}
export function netSetProjectileType(squadId, type) {
  _net.sendCmd({ SetProjectileType: { squad_id: squadId, proj_type: type } });
}
export function netTrainUnit(buildingId, unitType) {
  _net.sendCmd({ TrainUnit: { building_id: buildingId, unit_type: unitType } });
}
export function netGrenadeUpgrade(squadId, soldierId) {
  _net.sendCmd({ GrenadeUpgrade: { squad_id: squadId, sol_id: soldierId } });
}
export function netDemolishBuilding(id) {
  _net.sendCmd({ DemolishBuilding: { building_id: id } });
}
export function netSpendRequisition(amount) {
  _net.sendCmd({ SpendRequisition: { amount } });
}

function _toVector3(vector) {
  if (!vector) {
    return new THREE.Vector3(0, 0, 0);
  }
  return new THREE.Vector3(vector.x ?? 0, vector.y ?? 0, vector.z ?? 0);
}

function _buildingEntityTypeName(type) {
  const mapping = {
    Barracks: 'barracks',
    InfantryCommand: 'infantry_command',
    Tower: 'tower',
    Turret: 'turret',
    ThermoGen: 'thermoGen',
    ListeningPost: 'listeningPost',
    TowerBase: 'towerBase',
    APC: 'apc',
    Airfield: 'airfield',
    GunTurret: 'gunTurret',
    PlasmaGenerator: 'plasma_generator',
    TacticaControl: 'tactica_control',
    MarsPattern: 'mars_pattern',
    Mines: 'mines',
  };
  return mapping[type] || 'barracks';
}

export function _injectConnectUI() {
  const overlay = document.createElement('div');
  overlay.id = 'webTransport-connect-overlay';
  overlay.innerHTML = [
    '<div class="webTransport-panel">',
    '<div class="webTransport-title">⚡ GRIMCRAFT MULTIPLAYER</div>',
    '<div class="webTransport-subtitle">WebTransport / QUIC</div>',
    '<div id="webTransport-map-wrap">',
    '<div class="webTransport-map-label">MAP</div>',
    '<div class="webTransport-map-body">',
    '<div id="webTransport-map-grid" class="webTransport-map-grid"></div>',
    '<div id="webTransport-map-detail" class="webTransport-map-detail"></div>',
    '</div>',
    '</div>',
    '<div id="webTransport-lobby-wrap">',
    '<div class="webTransport-lobby-label" id="webTransport-servers-label">SERVERS</div>',
    '<div id="webTransport-server-list" class="webTransport-server-list"></div>',
    '<div style="display:flex;gap:8px;margin-bottom:10px" id="webTransport-create-row"><button id="wt-create-game-btn" class="webTransport-button">CREATE GAME</button></div>',
    '<div id="webTransport-create-form" style="display:none">',
    '<div class="webTransport-lobby-label">NEW GAME</div>',
    '<div class="webTransport-field-row"><label>NAME</label><input id="webTransport-lobby-name" type="text" value="My Game"></div>',
    '<div class="webTransport-field-row"><label>MAP</label><select id="webTransport-lobby-map"></select></div>',
    '<div class="webTransport-field-row"><label>PLAYERS</label><select id="webTransport-lobby-capacity"><option>2</option><option>4</option><option selected>6</option><option>8</option></select></div>',
    '<div style="display:flex;gap:8px;margin:6px 0 14px"><button id="wt-create-confirm-btn" class="webTransport-button">CREATE</button><button id="wt-create-cancel-btn" class="webTransport-button">CANCEL</button></div>',
    '</div>',
    '<div class="webTransport-lobby-label" id="webTransport-players-label">PLAYERS</div>',
    '<div id="webTransport-slot-panel" class="webTransport-slot-panel"></div>',
    '</div>',
    '<div id="webTransport-connect-form">',
    `<div class="webTransport-field-row webTransport-server-row"><label>SERVER</label><input id="webTransport-url" type="text" value="${SERVER_URL}"></div>`,
    `<div class="webTransport-field-row webTransport-server-row"><label>CERT&nbsp;HASH</label><input id="webTransport-cert" type="text" value="${SERVER_CERT_HASH}"></div>`,
    '<div style="display:flex;gap:8px;margin-top:6px"><button id="wt-connect-btn" class="webTransport-button">CONNECT</button><button id="wt-offline-btn" class="webTransport-button webTransport-offline">PLAY OFFLINE</button></div>',
    '<div style="display:flex;gap:8px;margin-top:8px"><button id="wt-back-btn" class="webTransport-button">‹ BACK</button></div>',
    '<div id="webTransport-connect-status" style="margin-top:8px;font-size:9px;letter-spacing:.1em;color:#ff8833;min-height:14px"></div>',
    '</div>',
    '<div id="webTransport-load-wrap" style="display:none">',
    '<div class="webTransport-load-title">LOADING</div>',
    '<div class="webTransport-load-track"><div id="webTransport-load-fill" class="webTransport-load-fill"></div></div>',
    '<div id="webTransport-load-label" class="webTransport-load-label"></div>',
    '</div>',
    '</div>',
  ].join('');
  const style = document.createElement('style');
  style.textContent = [
    '#webTransport-connect-overlay { position:fixed; inset:0; z-index:9999; background:rgba(4,8,18,0.92); display:flex; align-items:center; justify-content:center; }',
    '.webTransport-panel { background:rgba(10,18,35,0.97); border:1px solid rgba(80,200,255,0.35); padding:28px 32px; max-width:480px; width:100%; font-family:\'Courier New\',monospace; box-shadow:0 0 40px rgba(80,200,255,0.15); }',
    '.webTransport-title { font-size:18px;letter-spacing:.25em;color:#50c8ff;margin-bottom:3px; }',
    '.webTransport-subtitle { font-size:9px;letter-spacing:.2em;color:#50c8ff;opacity:.45;margin-bottom:18px; }',
    '.webTransport-field-row { display:flex;align-items:center;gap:10px;margin-bottom:10px; }',
    '.webTransport-field-row label { font-size:9px;letter-spacing:.12em;color:#50c8ff;width:72px;flex-shrink:0; }',
    '.webTransport-field-row input { flex:1; background:rgba(80,200,255,0.06); border:1px solid rgba(80,200,255,0.25); color:#fff; font-family:\'Courier New\',monospace; font-size:10px; padding:5px 8px; outline:none; }',
    '.webTransport-field-row select { flex:1; background:rgba(80,200,255,0.06); border:1px solid rgba(80,200,255,0.25); color:#fff; font-family:\'Courier New\',monospace; font-size:10px; padding:5px 8px; outline:none; }',
    '.webTransport-field-row select option { background:#0a1226; }',
    '.webTransport-button { flex:1; padding:8px; background:rgba(80,200,255,0.1); border:1px solid rgba(80,200,255,0.4); color:#50c8ff; font-family:\'Courier New\',monospace; font-size:10px; letter-spacing:.1em; cursor:pointer; }',
    '.webTransport-button:hover { background:rgba(80,200,255,0.2); }',
    '.webTransport-offline { border-color:rgba(255,200,80,0.4);color:#ffc850; background:rgba(255,200,80,0.08); }',
    '.webTransport-offline:hover { background:rgba(255,200,80,0.2); }',
    '#webTransport-net-hud { position:fixed; top:48px; right:8px; z-index:20; font-family:\'Courier New\',monospace; font-size:8px; letter-spacing:.1em; padding:3px 7px; background:rgba(5,8,18,0.8); border:1px solid rgba(80,200,255,0.15); pointer-events:none; }',
    '.webTransport-load-title { font-size:12px; letter-spacing:.25em; color:#50c8ff; margin:6px 0 10px; }',
    '.webTransport-load-track { height:10px; background:rgba(80,200,255,0.08); border:1px solid rgba(80,200,255,0.35); }',
    '.webTransport-load-fill { height:100%; width:0%; background:#50c8ff; transition:width .15s; }',
    '.webTransport-load-label { margin-top:6px; font-size:9px; letter-spacing:.1em; color:rgba(255,255,255,0.55); min-height:13px; }',
    '.webTransport-panel.webTransport-panel-skirmish { max-width:900px; }',
    '.webTransport-map-label { font-size:9px; letter-spacing:.2em; color:#50c8ff; opacity:.7; margin:2px 0 8px; }',
    '.webTransport-map-body { display:flex; gap:10px; align-items:flex-start; margin-bottom:14px; }',
    '.webTransport-map-grid { flex:1; min-width:0; display:grid; grid-template-columns:1fr; gap:8px; max-height:360px; overflow-y:auto; }',
    '.webTransport-map-detail { width:220px; flex:none; display:flex; flex-direction:column; gap:6px; padding:6px; background:rgba(80,200,255,0.05); border:1px solid rgba(80,200,255,0.25); }',
    '.webTransport-map-detail-img { width:100%; height:200px; object-fit:cover; display:block; background:#06101f; }',
    '.webTransport-map-detail-empty { display:flex; align-items:center; justify-content:center; font-size:10px; letter-spacing:.3em; color:#50c8ff; }',
    '.webTransport-map-detail-cap { font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:#fff; text-align:center; }',
    '.webTransport-map-card { display:flex; flex-direction:column; gap:2px; padding:3px 6px; background:rgba(80,200,255,0.05); border:1px solid rgba(80,200,255,0.25); cursor:pointer; font-family:\'Courier New\',monospace; color:#fff; text-align:left; }',
    '.webTransport-map-card:hover { background:rgba(80,200,255,0.12); }',
    '.webTransport-map-card.active { border-color:#50c8ff; background:rgba(80,200,255,0.15); }',
    '.webTransport-map-name { font-size:9px; letter-spacing:.08em; text-transform:uppercase; }',
    '.webTransport-map-players { font-size:8px; letter-spacing:.15em; color:#ffc850; }',
    '.webTransport-lobby-label { font-size:9px; letter-spacing:.2em; color:#50c8ff; opacity:.7; margin:2px 0 8px; }',
    '.webTransport-server-list { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; max-height:150px; overflow-y:auto; }',
    '.webTransport-server-row { display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:center; padding:5px 8px; background:rgba(80,200,255,0.05); border:1px solid rgba(80,200,255,0.25); color:#fff; font-family:\'Courier New\',monospace; font-size:9px; letter-spacing:.06em; cursor:pointer; text-align:left; }',
    '.webTransport-server-row:hover { background:rgba(80,200,255,0.12); }',
    '.webTransport-server-row.active { border-color:#50c8ff; background:rgba(80,200,255,0.15); }',
    '.webTransport-server-map { color:rgba(255,255,255,0.6); }',
    '.webTransport-server-players { color:#ffc850; }',
    '.webTransport-server-players.full { color:#ff5555; }',
    '.webTransport-slot-panel { margin-bottom:14px; max-height:170px; overflow-y:auto; border:1px solid rgba(80,200,255,0.2); }',
    '.webTransport-slot-head, .webTransport-slot-row { display:grid; grid-template-columns:1.4fr 1fr 0.6fr 0.6fr; gap:8px; padding:4px 8px; font-size:8px; letter-spacing:.08em; }',
    '.webTransport-slot-head { color:#50c8ff; opacity:.7; border-bottom:1px solid rgba(80,200,255,0.2); }',
    '.webTransport-slot-row { color:#fff; border-bottom:1px solid rgba(80,200,255,0.08); }',
    '.webTransport-slot-team-1 { color:#50c8ff; }',
    '.webTransport-slot-team-2 { color:#ff7a50; }',
    '.webTransport-slot-empty { padding:10px; text-align:center; font-size:9px; letter-spacing:.15em; color:rgba(255,255,255,0.4); }',
  ].join(' ');
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  const badge = document.createElement('div');
  badge.id = 'webTransport-net-hud';
  badge.textContent = '⚡ OFFLINE';
  document.body.appendChild(badge);

  document.getElementById('wt-connect-btn').addEventListener('click', webTransportConnect);
  document.getElementById('wt-offline-btn').addEventListener('click', webTransportPlayOffline);
  document.getElementById('wt-back-btn').addEventListener('click', () => {
    _setConnectOverlay(false);
    if (window.__grimcraftShowMainMenu) {
      window.__grimcraftShowMainMenu();
    }
  });
  _buildMapGrid();
  _buildServerList();
  _renderSlots(null);
  _buildCreateForm();
}

function _setLobbyView(creating) {
  for (const id of ['webTransport-servers-label', 'webTransport-server-list', 'webTransport-create-row', 'webTransport-players-label', 'webTransport-slot-panel']) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = creating ? 'none' : '';
    }
  }
  const form = document.getElementById('webTransport-create-form');
  if (form) {
    form.style.display = creating ? '' : 'none';
  }
}

function _buildCreateForm() {
  const mapSelect = document.getElementById('webTransport-lobby-map');
  if (mapSelect) {
    mapSelect.innerHTML = '';
    const arena = document.createElement('option');
    arena.value = 'Arena';
    arena.textContent = 'Default Arena';
    mapSelect.appendChild(arena);
    for (const map of listBuiltinMaps()) {
      const option = document.createElement('option');
      option.value = map.name;
      option.textContent = map.players ? `${map.name} (${map.players}P)` : map.name;
      mapSelect.appendChild(option);
    }
  }
  document.getElementById('wt-create-game-btn')?.addEventListener('click', () => _setLobbyView(true));
  document.getElementById('wt-create-cancel-btn')?.addEventListener('click', () => _setLobbyView(false));
  document.getElementById('wt-create-confirm-btn')?.addEventListener('click', () => {
    const lobby = createLobby({
      name: document.getElementById('webTransport-lobby-name')?.value,
      map: document.getElementById('webTransport-lobby-map')?.value,
      total: document.getElementById('webTransport-lobby-capacity')?.value,
    });
    LOBBIES.unshift(lobby);
    _selectedLobby = lobby;
    _buildServerList();
    _renderSlots(lobby);
    _setLobbyView(false);
  });
}

function _buildServerList() {
  const list = document.getElementById('webTransport-server-list');
  if (!list) {
    return;
  }
  list.innerHTML = '';
  for (const lobby of LOBBIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'webTransport-server-row' + (lobby === _selectedLobby ? ' active' : '');
    const name = document.createElement('span');
    name.textContent = lobby.name;
    btn.appendChild(name);
    const map = document.createElement('span');
    map.className = 'webTransport-server-map';
    map.textContent = lobby.map || '—';
    btn.appendChild(map);
    const players = document.createElement('span');
    players.className = 'webTransport-server-players' + (isFull(lobby) ? ' full' : '');
    players.textContent = capacityLabel(lobby);
    btn.appendChild(players);
    btn.addEventListener('click', () => {
      _selectedLobby = lobby;
      Array.from(list.children).forEach((el) => {
        if (el.classList) {
          el.classList.toggle('active', el === btn);
        }
      });
      _renderSlots(lobby);
    });
    list.appendChild(btn);
  }
}

function _renderSlots(lobby) {
  const panel = document.getElementById('webTransport-slot-panel');
  if (!panel) {
    return;
  }
  panel.innerHTML = '';
  if (!lobby) {
    const empty = document.createElement('div');
    empty.className = 'webTransport-slot-empty';
    empty.textContent = 'SELECT A SERVER';
    panel.appendChild(empty);
    return;
  }
  const head = document.createElement('div');
  head.className = 'webTransport-slot-head';
  for (const text of ['PLAYER', 'FACTION', 'TEAM', 'PING']) {
    const cell = document.createElement('span');
    cell.textContent = text;
    head.appendChild(cell);
  }
  panel.appendChild(head);
  if (!hasPlayers(lobby)) {
    const empty = document.createElement('div');
    empty.className = 'webTransport-slot-empty';
    empty.textContent = 'NO PLAYER DATA';
    panel.appendChild(empty);
    return;
  }
  for (const player of lobby.players) {
    const row = document.createElement('div');
    row.className = 'webTransport-slot-row';
    const name = document.createElement('span');
    name.textContent = player.username;
    row.appendChild(name);
    const faction = document.createElement('span');
    faction.textContent = player.faction;
    row.appendChild(faction);
    const team = document.createElement('span');
    team.className = player.team === 2 ? 'webTransport-slot-team-2' : 'webTransport-slot-team-1';
    team.textContent = `TEAM ${player.team}`;
    row.appendChild(team);
    const ping = document.createElement('span');
    ping.textContent = String(player.ping);
    row.appendChild(ping);
    panel.appendChild(row);
  }
}

export function showConnectOverlay(mode = 'multiplayer') {
  const isSkirmish = mode === 'skirmish';
  const mapWrap = document.getElementById('webTransport-map-wrap');
  if (mapWrap) {
    mapWrap.style.display = isSkirmish ? '' : 'none';
  }
  const lobbyWrap = document.getElementById('webTransport-lobby-wrap');
  if (lobbyWrap) {
    lobbyWrap.style.display = isSkirmish ? 'none' : '';
  }
  const panel = document.querySelector('#webTransport-connect-overlay .webTransport-panel');
  if (panel) {
    panel.classList.toggle('webTransport-panel-skirmish', isSkirmish);
  }
  document.querySelectorAll('.webTransport-server-row').forEach((el) => {
    el.style.display = isSkirmish ? 'none' : '';
  });
  const connectBtn = document.getElementById('wt-connect-btn');
  if (connectBtn) {
    connectBtn.style.display = isSkirmish ? 'none' : '';
  }
  const title = document.querySelector('#webTransport-connect-overlay .webTransport-title');
  if (title) {
    title.textContent = isSkirmish ? 'GRIMCRAFT SKIRMISH' : '⚡ GRIMCRAFT MULTIPLAYER';
  }
  const subtitle = document.querySelector('#webTransport-connect-overlay .webTransport-subtitle');
  if (subtitle) {
    subtitle.textContent = isSkirmish ? 'Offline Battle' : 'WebTransport / QUIC';
  }
  const offlineBtn = document.getElementById('wt-offline-btn');
  if (offlineBtn) {
    offlineBtn.textContent = isSkirmish ? 'START BATTLE' : 'PLAY OFFLINE';
  }
  _setConnectOverlay(true);
}

export function hideConnectOverlay() {
  _setConnectOverlay(false);
}

function _renderMapDetail(card) {
  const box = document.getElementById('webTransport-map-detail');
  if (!box || !card) {
    return;
  }
  box.innerHTML = '';
  if (previewState(card).kind === 'image') {
    const img = document.createElement('img');
    img.className = 'webTransport-map-detail-img';
    img.src = card.previewUrl;
    img.alt = '';
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'webTransport-map-detail-img webTransport-map-detail-empty';
      placeholder.textContent = card.path ? 'NO PREVIEW' : 'ARENA';
      img.replaceWith(placeholder);
    });
    box.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'webTransport-map-detail-img webTransport-map-detail-empty';
    placeholder.textContent = card.path ? 'NO PREVIEW' : 'ARENA';
    box.appendChild(placeholder);
  }
  const cap = document.createElement('div');
  cap.className = 'webTransport-map-detail-cap';
  cap.textContent = entryLabel(card);
  box.appendChild(cap);
}

function _buildMapGrid() {
  const grid = document.getElementById('webTransport-map-grid');
  if (!grid) {
    return;
  }
  grid.innerHTML = '';
  const cards = skirmishMapCards();
  if (!_selectedMap) {
    const def = defaultSkirmishMap(cards);
    if (def) {
      _selectedMap = { path: def.path, url: def.url, name: def.name };
    }
  }
  const selectedKey = _selectedMap ? _selectedMap.path : 'arena';
  for (const card of cards) {
    const key = card.path || 'arena';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'webTransport-map-card' + (key === selectedKey ? ' active' : '');
    const name = document.createElement('span');
    name.className = 'webTransport-map-name';
    name.textContent = card.name;
    btn.appendChild(name);
    if (card.players) {
      const players = document.createElement('span');
      players.className = 'webTransport-map-players';
      players.textContent = `${card.players}P`;
      btn.appendChild(players);
    }
    btn.addEventListener('click', () => {
      _selectedMap = card.path ? { path: card.path, url: card.url, name: card.name } : null;
      Array.from(grid.children).forEach((el) => {
        if (el.classList) {
          el.classList.toggle('active', el === btn);
        }
      });
      _renderMapDetail(card);
    });
    grid.appendChild(btn);
  }
  _renderMapDetail(cards.find((c) => (c.path || 'arena') === selectedKey) || null);
}

function _setConnectOverlay(visible) {
  const element = document.getElementById('webTransport-connect-overlay');
  if (element) {
    element.style.display = visible ? 'flex' : 'none';
  }
}

function _setLoadingUI(loading) {
  const form = document.getElementById('webTransport-connect-form');
  const wrap = document.getElementById('webTransport-load-wrap');
  if (form) {
    form.style.display = loading ? 'none' : '';
  }
  if (wrap) {
    wrap.style.display = loading ? '' : 'none';
  }
  if (loading) {
    _updateLoadBar({ loaded: 0, total: 0, label: '' });
  }
}

function _updateLoadBar({ loaded, total, label }) {
  const fill = document.getElementById('webTransport-load-fill');
  const text = document.getElementById('webTransport-load-label');
  const pct = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
  if (fill) {
    fill.style.width = `${pct}%`;
  }
  if (text) {
    text.textContent = total > 0 ? `${label} — ${loaded}/${total}` : (label || 'Preparing…');
  }
}

function _updateNetHUD() {
  const element = document.getElementById('webTransport-net-hud');
  if (!element) {
    return;
  }
  const colors = { connecting: '#ffcc44', connected: '#44ff88', error: '#ff4422', disconnected: '#888' };
  const labels = {
    connecting: '⚡ CONNECTING…',
    connected: `⚡ ONLINE [${(_myTeam || '').toUpperCase()}]`,
    error: '⚡ ERROR',
    disconnected: '⚡ OFFLINE',
  };
  element.style.color = colors[_netStatus] || '#888';
  element.textContent = labels[_netStatus] || '⚡ OFFLINE';
}

export async function webTransportConnect() {
  const url = document.getElementById('webTransport-url').value.trim();
  const cert = document.getElementById('webTransport-cert').value.trim();
  SERVER_URL = url;
  SERVER_CERT_HASH = cert;
  const statusElement = document.getElementById('webTransport-connect-status');
  statusElement.textContent = 'Connecting…';
  _setLoadingUI(true);
  try {
    window._multiplayerMode = true;
    await bootGame({ onProgress: _updateLoadBar });
    _setLoadingUI(false);
    statusElement.textContent = 'Connecting…';
    await _net.connect(url, cert);
    _net.sendJoin(null);
    statusElement.textContent = 'Connected! Waiting for session…';
  } catch (error) {
    _setLoadingUI(false);
    _netStatus = 'error';
    _updateNetHUD();
    statusElement.style.color = '#ff4422';
    statusElement.textContent = `Connection failed: ${error.message || error}`;
  }
}

export async function webTransportPlayOffline() {
  window._multiplayerMode = false;
  window._currentMapKey = _selectedMap ? _selectedMap.path : 'arena';
  _setLoadingUI(true);
  try {
    await bootGame({ onProgress: _updateLoadBar });
    if (_selectedMap) {
      _updateLoadBar({ loaded: 0, total: 0, label: `Loading map ${_selectedMap.name}` });
      await selectMap(_selectedMap.path, _selectedMap.url);
    }
    _setLoadingUI(false);
    _setConnectOverlay(false);
  } catch (error) {
    _setLoadingUI(false);
    const statusElement = document.getElementById('webTransport-connect-status');
    if (statusElement) {
      statusElement.style.color = '#ff4422';
      statusElement.textContent = `Load failed: ${error.message || error}`;
    }
  }
}

window._injectConnectUI = _injectConnectUI;
window.webTransportConnect = webTransportConnect;
window.webTransportPlayOffline = webTransportPlayOffline;
