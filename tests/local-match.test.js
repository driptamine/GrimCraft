import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createLobby, lobbySlots, setLobbySlot } from '../src/net/lobbies.js';
import { makeLocalMatch, setLocalMatch, localMatchFor, localMatchPositions } from '../src/core/local-match.js';
const computer = (faction, team = 2) => ({ username: 'Computer', faction, team, ping: 0, controller: 'computer' });
describe('local computer lobby', () => {
  it('keeps slot positions and counts when opening a middle slot', () => {
    const lobby = createLobby({total:4});
    setLobbySlot(lobby, 1, computer('Eldar'));
    setLobbySlot(lobby, 3, computer('Tau'));
    setLobbySlot(lobby, 1, null);
    assert.equal(lobby.current, 2);
    assert.equal(lobbySlots(lobby)[1], null);
    assert.equal(lobbySlots(lobby)[3].faction, 'Tau');
  });
  it('transfers computer races and original map slots into the match', () => {
    const lobby = createLobby({total:6});
    lobby.players[0].faction = 'Imperial Guard';
    setLobbySlot(lobby, 4, computer('Space Marines'));
    assert.deepEqual(makeLocalMatch(lobby,'alvarus').seats, [
      {slot:0,faction:'ig',team:'blue',computer:false},
      {slot:4,faction:'space marines',team:'red',computer:true},
    ]);
  });
  it('allows a match consisting entirely of computers', () => {
    const lobby = createLobby();
    setLobbySlot(lobby,0,computer('Necrons',1));
    setLobbySlot(lobby,1,computer('Chaos',2));
    const config = makeLocalMatch(lobby,'arena');
    assert.ok(config.seats.every(seat=>seat.computer));
    setLocalMatch(config);
    assert.equal(localMatchFor('arena'),config);
    assert.equal(localMatchFor('another-map'),null);
    setLocalMatch(null);
    assert.equal(localMatchFor('arena'),null);
  });
  it('requires an opponent and does not change the roster on a rejected start', () => {
    const lobby = createLobby();
    assert.throws(()=>makeLocalMatch(lobby,'arena'),/opposing team/);
    setLobbySlot(lobby,1,computer('Orks',1));
    assert.throws(()=>makeLocalMatch(lobby,'arena'),/opposing team/);
    assert.equal(lobby.current,2);
  });
});

describe('Alvarus lobby start positions', () => {
  const positions = [
    {x:-105.69,z:-93.69}, {x:14.76,z:-102.98}, {x:110.94,z:-101.08},
    {x:-109.79,z:111.93}, {x:-5.38,z:114.06}, {x:109.47,z:110.37},
  ];
  const seat = (slot, team) => ({slot,team,faction:'ig',computer:slot!==0});
  it('starts the host and first opponent at the opposite central bases', () => {
    for (const enemySlot of [1,3,5]) {
      const config={mapKey:'/maps/6p_alvarus/6p_alvarus.sgb',seats:[seat(0,'blue'),seat(enemySlot,'red')]};
      const result=localMatchPositions(config,positions);
      assert.deepEqual(result.get(0),positions[1]);
      assert.deepEqual(result.get(enemySlot),positions[4]);
    }
  });
  it('keeps allies on the host side and gives every player a distinct start', () => {
    const config={mapKey:'/maps/6p_alvarus/6p_alvarus.sgb',seats:[seat(0,'blue'),seat(1,'red'),seat(2,'blue'),seat(3,'red'),seat(4,'blue'),seat(5,'red')]};
    const result=localMatchPositions(config,positions);
    assert.equal(new Set(result.values()).size,6);
    for (const player of config.seats) assert.equal(Math.sign(result.get(player.slot).z),player.team==='blue'?-1:1);
  });
  it('preserves start slots on other maps', () => {
    const config={mapKey:'arena',seats:[seat(0,'blue'),seat(3,'red')]};
    const result=localMatchPositions(config,positions);
    assert.equal(result.get(0),positions[0]);
    assert.equal(result.get(3),positions[3]);
  });
});
