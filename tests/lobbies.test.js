import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LOBBIES, capacityLabel, isFull, hasPlayers, createLobby } from '../src/lobbies.js';

describe('lobby browser data', () => {
  it('lists the five servers in order', () => {
    assert.deepEqual(
      LOBBIES.map((lobby) => lobby.name),
      ['Mechanize', 'Driptamine', 'Henry Cavill', 'Doom Spiral', 'Burial Grounds'],
    );
  });

  it('matches the requested server rows', () => {
    const byName = (name) => LOBBIES.find((lobby) => lobby.name === name);
    assert.equal(byName('Mechanize').map, 'Alvarus');
    assert.equal(capacityLabel(byName('Mechanize')), '5/6');
    assert.equal(byName('Driptamine').map, 'Oasis of Sharr');
    assert.equal(capacityLabel(byName('Driptamine')), '8/8');
    assert.equal(byName('Henry Cavill').map, 'Mortalis');
    assert.equal(capacityLabel(byName('Henry Cavill')), '5/6');
    assert.equal(capacityLabel(byName('Doom Spiral')), '3/4');
    assert.equal(capacityLabel(byName('Burial Grounds')), '8/8');
  });

  it('keeps player counts within capacity', () => {
    for (const lobby of LOBBIES) {
      assert.ok(lobby.current <= lobby.total, `${lobby.name} fits capacity`);
      assert.equal(isFull(lobby), lobby.current >= lobby.total);
    }
    assert.ok(isFull(LOBBIES[1]));
    assert.ok(!isFull(LOBBIES[0]));
  });

  it('carries the example 8-player roster on the full lobby', () => {
    const lobby = LOBBIES.find((entry) => entry.name === 'Driptamine');
    assert.ok(hasPlayers(lobby));
    assert.equal(lobby.players.length, lobby.current);
    for (const player of lobby.players) {
      assert.ok(player.username, 'username present');
      assert.ok(player.faction, 'faction present');
      assert.ok([1, 2].includes(player.team), 'team is 1 or 2');
      assert.ok(Number.isFinite(player.ping), 'ping is a number');
    }
    assert.deepEqual(
      lobby.players.map((player) => player.username),
      ['Redemption_Arc', 'MASTER_YOBA', 'Driptamine', 'Yang_Wen', 'Mechanize', 'DANTIST', 'Destar', 'El Bandido'],
    );
    const elBandido = lobby.players.find((player) => player.username === 'El Bandido');
    assert.equal(elBandido.faction, 'Tau');
    assert.equal(elBandido.team, 2);
    assert.equal(elBandido.ping, 30);
  });

  it('createLobby builds a hosted lobby with sane fallbacks', () => {
    assert.deepEqual(createLobby({ name: 'Evening ', map: 'Alvarus', total: '4' }), {
      name: 'Evening',
      map: 'Alvarus',
      current: 1,
      total: 4,
      players: [{ username: 'HOST', faction: '—', team: 1, ping: 0 }],
    });
    const fallback = createLobby({ name: '   ', map: '', total: 'bogus' });
    assert.equal(fallback.name, 'My Game');
    assert.equal(fallback.map, 'Arena');
    assert.equal(fallback.total, 6);
    assert.equal(capacityLabel(fallback), '1/6');
  });
});
