import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const {
  layoutFor, startPositionsFor, strategicPointsFor, factionsFor, boundsFor, startingGuardsmenSpawns, startingNecronSpawns, startingTauSpawns,
  startingOrkSpawns, startingEldarSpawns, startingMarineSpawns, startingDarkEldarSpawns, factionBasePosition,
} = await import('../src/map-layout.js');
const { POSITION_FACTIONS, ARENA_POSITION_FACTIONS } = await import('../src/factions.js');

describe('map layout', () => {
  it('arena resolves 8 positions with Tau 7th and Dark Eldar 8th', () => {
    const layout = layoutFor('arena');
    assert.equal(layout.name, 'Default Arena');
    assert.deepEqual(factionsFor('arena'), ARENA_POSITION_FACTIONS);
    const positions = startPositionsFor('arena');
    assert.equal(positions.length, 8);
    assert.deepEqual(positions[6], { x: 220, z: -110, team: 'blue' });
    assert.deepEqual(positions[7], { x: 74, z: 110, team: 'red' });
    const blue = positions.filter((p) => p.team === 'blue');
    const red = positions.filter((p) => p.team === 'red');
    assert.ok(blue.every((p) => p.z === blue[0].z), 'blue row shares one z');
    assert.ok(red.every((p) => p.z === red[0].z), 'red row shares one z');
    assert.equal(red[0].z, -blue[0].z);
    assert.equal(red[0].z - blue[0].z, 220, 'team rows stand 220 apart');
    for (const side of [blue, red]) {
      const xs = side.map((p) => p.x).sort((a, b) => a - b);
      const mirrored = [...xs].reverse();
      assert.ok(xs.every((x, i) => x + mirrored[i] === 0), 'row mirrors about x=0');
    }
    // Red mirrors blue slot for slot: chaos, marines, dark eldar, eldar.
    assert.deepEqual(red.map((p) => p.x).sort((a, b) => a - b), [-220, -74, 74, 220]);
    assert.deepEqual(
      red.map((p) => p.x).sort((a, b) => a - b),
      blue.map((p) => p.x).sort((a, b) => a - b),
      'red mirrors blue slots',
    );
  });

  it('arena adds a 4-point ring around every HQ with no center cluster', () => {
    const layout = layoutFor('arena');
    assert.deepEqual(layout.ringOffsets, [[-40, -40], [40, -40], [-40, 40], [40, 40]]);
    assert.deepEqual(layout.centerPoints, []);
    const points = strategicPointsFor('arena');
    assert.equal(points.length, layout.centerPoints.length + 8 * (layout.ringOffsets.length + 1));
    const key = (x, z) => `${x},${z}`;
    const pointSet = new Set(points.map((p) => key(p.x, p.z)));
    assert.equal(pointSet.size, points.length);
    for (const [x, z] of layout.centerPoints) {
      assert.ok(pointSet.has(key(x, z)), `center point ${x},${z} exists`);
    }
    for (const pos of startPositionsFor('arena')) {
      for (const [dx, dz] of layout.ringOffsets) {
        assert.ok(pointSet.has(key(pos.x + dx, pos.z + dz)), `ring point near HQ ${pos.x},${pos.z}`);
      }
      const cx = layout.ringOffsets.reduce((sum, [dx]) => sum + pos.x + dx, 0) / layout.ringOffsets.length;
      const cz = layout.ringOffsets.reduce((sum, [, dz]) => sum + pos.z + dz, 0) / layout.ringOffsets.length;
      assert.equal(cx, pos.x);
      assert.equal(cz, pos.z);
    }
    for (const p of points) {
      assert.ok(Math.abs(p.x) <= 512 && Math.abs(p.z) <= 512, `point ${p.x},${p.z} inside playable bounds`);
    }
  });

  it('arena adds one inward relic per HQ as the 5th point', () => {
    const layout = layoutFor('arena');
    const points = strategicPointsFor('arena');
    const relics = points.filter((p) => p.kind === 'relic');
    assert.equal(relics.length, 8);
    assert.ok(points.every((p) => p.kind === 'point' || p.kind === 'relic'));
    for (const pos of startPositionsFor('arena')) {
      const inward = pos.z >= 0 ? -1 : 1;
      const found = relics.find((p) => p.x === pos.x && p.z === pos.z + inward * layout.relicDistance);
      assert.ok(found, `relic inward of HQ ${pos.x},${pos.z}`);
    }
  });

  it('alvarus resolves by .sgb path with the base 6 positions and no rings', () => {
    const layout = layoutFor('/maps/6p_alvarus/6p_alvarus.sgb');
    assert.equal(layout.name, 'Alvarus');
    assert.deepEqual(factionsFor('/maps/6p_alvarus/6p_alvarus.sgb'), POSITION_FACTIONS);
    assert.equal(startPositionsFor('/maps/6p_alvarus/6p_alvarus.sgb').length, 6);
    assert.equal(layout.ringPerPosition, false);
    const points = strategicPointsFor('/maps/6p_alvarus/6p_alvarus.sgb');
    assert.equal(points.length, 24);
    assert.equal(points.filter((p) => p.kind === 'point').length, 18);
    assert.equal(points.filter((p) => p.kind === 'relic').length, 4);
    assert.equal(points.filter((p) => p.kind === 'objective').length, 2);
    assert.ok(points.every((p) => p.kind === 'point' || p.kind === 'relic' || p.kind === 'objective'));
    const seen = new Set(points.map((p) => `${p.x},${p.z}`));
    assert.equal(seen.size, points.length);
    for (const p of points) {
      assert.ok(Math.abs(p.x) <= 256 && Math.abs(p.z) <= 256, `point ${p.x},${p.z} inside map bounds`);
    }
  });

  it('alvarus points match SGB entities through the mirrored root transform', async () => {
    const layoutUpd = (await import('../maps/6p_alvarus/6p_alvarus_layout_upd.json')).default;
    // Root transform M = Ry(90) * Sz(-1): world_x = -local_z, world_z = -local_x.
    const toWorld = (e) => ({
      x: Math.round(-e.z * 100) / 100,
      z: Math.round(-e.x * 100) / 100,
    });
    const byId = (list) => [...list].sort((a, b) => a.id - b.id);
    const wantPoints = byId(layoutUpd.entities.filter((e) => e.blueprint === 'strategic_point_flag')).map(toWorld);
    const wantRelics = byId(layoutUpd.entities.filter((e) => e.blueprint === 'relic_struct')).map(toWorld);
    const points = strategicPointsFor('/maps/6p_alvarus/6p_alvarus.sgb');
    assert.deepEqual(points.filter((p) => p.kind === 'point').map(({ x, z }) => ({ x, z })), wantPoints);
    assert.deepEqual(points.filter((p) => p.kind === 'relic').map(({ x, z }) => ({ x, z })), wantRelics);
  });

  it('mortalis resolves its real layout with extracted points', () => {
    const layout = layoutFor('/maps/6p_mortalis/6p_mortalis.sgb');
    assert.equal(layout.name, 'Mortalis');
    assert.equal(layout.placeholder, false);
    assert.equal(startPositionsFor('/maps/6p_mortalis/6p_mortalis.sgb').length, 6);
    assert.equal(layoutFor('/maps/6p_mortalis/mortalis.sgb').name, 'Mortalis');
    const points = strategicPointsFor('/maps/6p_mortalis/6p_mortalis.sgb');
    assert.equal(points.filter((p) => p.kind === 'point').length, 24);
    assert.equal(points.filter((p) => p.kind === 'relic').length, 6);
  });

  it('new maps resolve extracted layouts with even teams and placed points', () => {
    const factions = new Set(['orks', 'ig', 'necrons', 'tau', 'chaos', 'space marines', 'dark eldar', 'eldar']);
    const cases = [
      { key: '/maps/4p_doom_spiral/4p_doom_spiral.sgb', name: 'Doom Spiral', np: 4, points: 14, relics: 0 },
      { key: '/maps/4p_into_the_breach/4p_into_the_breach.sgb', name: 'Into The Breach', np: 4, points: 12, relics: 4 },
      { key: '/maps/6p_mortalis/6p_mortalis.sgb', name: 'Mortalis', np: 6, points: 24, relics: 6 },
      { key: '/maps/6p_parmenie/6p_parmenie.sgb', name: 'Parmenie', np: 6, points: 18, relics: 4 },
      { key: '/maps/6p_vandea_coast/6p_vandea_coast.sgb', name: 'Vandea Coast', np: 6, points: 12, relics: 0 },
      { key: '/maps/8p_burial_grounds/8p_burial_grounds.sgb', name: 'Burial Grounds', np: 8, points: 32, relics: 4 },
      { key: '/maps/8p_oasis_of_sharr/8p_oasis_of_sharr.sgb', name: 'Oasis Of Sharr', np: 8, points: 32, relics: 3 },
    ];
    for (const c of cases) {
      assert.equal(layoutFor(c.key).name, c.name, c.key);
      assert.equal(boundsFor(c.key), 256, c.key);
      const pos = startPositionsFor(c.key);
      assert.equal(pos.length, c.np, `${c.key} positions`);
      assert.equal(pos.filter((p) => p.team === 'blue').length, c.np / 2, `${c.key} blue`);
      assert.equal(pos.filter((p) => p.team === 'red').length, c.np / 2, `${c.key} red`);
      for (const f of factionsFor(c.key)) {
        assert.ok(factions.has(f), `${c.key} faction ${f}`);
      }
      const pts = strategicPointsFor(c.key);
      assert.equal(pts.filter((p) => p.kind === 'point').length, c.points, `${c.key} points`);
      assert.equal(pts.filter((p) => p.kind === 'relic').length, c.relics, `${c.key} relics`);
      for (const p of [...pos, ...pts]) {
        assert.ok(Math.abs(p.x) <= 256 && Math.abs(p.z) <= 256, `${c.key} in bounds ${p.x},${p.z}`);
      }
      const seen = new Set(pts.map((p) => `${p.x},${p.z}`));
      assert.equal(seen.size, pts.length, `${c.key} unique points`);
    }
  });

  it('unknown maps fall back to the default arena layout', () => {
    assert.equal(layoutFor('/maps/elsewhere/unknown.sgb').name, 'Default Arena');
    assert.equal(startPositionsFor('bogus').length, 8);
  });

  it('fields two guardsmen squads at the blue IG base', () => {
    const spawns = startingGuardsmenSpawns('arena', 'blue');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'blue', x: -58, z: -100, size: 5, unitType: 'guardsmen', faction: 'ig' },
      { team: 'blue', x: -58, z: -120, size: 5, unitType: 'guardsmen', faction: 'ig' },
    ]);
    assert.deepEqual(startingGuardsmenSpawns('arena', 'red'), []);
    for (const mapKey of ['/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
      const side = startingGuardsmenSpawns(mapKey, 'blue');
      assert.equal(side.length, 2);
      assert.ok(side.every((s) => s.unitType === 'guardsmen' && s.faction === 'ig' && s.size === 5));
    }
  });

  it('fields two necron warrior squads at the blue necron base by default', () => {
    const spawns = startingNecronSpawns('arena', 'blue');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'blue', x: 90, z: -100, size: 5, unitType: null, faction: 'necrons' },
      { team: 'blue', x: 90, z: -120, size: 5, unitType: null, faction: 'necrons' },
    ]);
    assert.deepEqual(startingNecronSpawns('arena', 'red'), []);
    for (const mapKey of ['/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
      const side = startingNecronSpawns(mapKey, 'blue');
      assert.equal(side.length, 2);
      assert.ok(side.every((s) => s.unitType === null && s.faction === 'necrons' && s.size === 5));
    }
  });

  it('fields two fire warrior squads at the blue tau base by default', () => {
    const spawns = startingTauSpawns('arena', 'blue');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'blue', x: 236, z: -100, size: 5, unitType: null, faction: 'tau' },
      { team: 'blue', x: 236, z: -120, size: 5, unitType: null, faction: 'tau' },
    ]);
    assert.deepEqual(startingTauSpawns('arena', 'red'), []);
    for (const mapKey of ['/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
      assert.deepEqual(startingTauSpawns(mapKey, 'blue'), [], `${mapKey} has no tau base`);
    }
  });

  it('fields two warrior squads at the red dark eldar base by default', () => {
    const spawns = startingDarkEldarSpawns('arena', 'red');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'red', x: 90, z: 120, size: 5, unitType: null, faction: 'dark eldar' },
      { team: 'red', x: 90, z: 100, size: 5, unitType: null, faction: 'dark eldar' },
    ]);
    assert.deepEqual(startingDarkEldarSpawns('arena', 'blue'), []);
    assert.deepEqual(startingDarkEldarSpawns('/maps/6p_alvarus/6p_alvarus.sgb', 'red'), [], 'alvarus has no dark eldar base');
    const mortalis = startingDarkEldarSpawns('/maps/6p_mortalis/mortalis.sgb', 'red');
    assert.equal(mortalis.length, 2);
    assert.ok(mortalis.every((s) => s.unitType === null && s.faction === 'dark eldar' && s.size === 5));
  });

  it('fields boyz and shoota boyz squads at the blue ork base', () => {
    const spawns = startingOrkSpawns('arena', 'blue');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'blue', x: -204, z: -100, size: 5, unitType: null, faction: 'orks' },
      { team: 'blue', x: -204, z: -120, size: 5, unitType: 'boyz_shoota', faction: 'orks' },
    ]);
    assert.deepEqual(startingOrkSpawns('arena', 'red'), []);
    for (const mapKey of ['/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
      const side = startingOrkSpawns(mapKey, 'blue');
      assert.equal(side.length, 2);
      assert.deepEqual(side.map((s) => s.unitType), [null, 'boyz_shoota']);
      assert.deepEqual(startingOrkSpawns(mapKey, 'red'), []);
    }
  });

  it('fields guardian and dark reaper squads at the red eldar base', () => {
    const spawns = startingEldarSpawns('arena', 'red');
    assert.equal(spawns.length, 2);
    assert.deepEqual(spawns, [
      { team: 'red', x: 236, z: 120, size: 5, unitType: null, faction: 'eldar' },
      { team: 'red', x: 236, z: 100, size: 5, unitType: 'dark_reaper', faction: 'eldar' },
    ]);
    assert.deepEqual(startingEldarSpawns('arena', 'blue'), []);
    const side = startingEldarSpawns('/maps/6p_alvarus/6p_alvarus.sgb', 'red');
    assert.equal(side.length, 2);
    assert.deepEqual(side.map((s) => s.unitType), [null, 'dark_reaper']);
    assert.deepEqual(startingEldarSpawns('/maps/6p_alvarus/6p_alvarus.sgb', 'blue'), []);
    assert.deepEqual(startingEldarSpawns('/maps/6p_mortalis/mortalis.sgb', 'red'), [], 'mortalis has no eldar base');
  });

  it('fields two tactical squads plus grey knights at the red space marine base', () => {
    const spawns = startingMarineSpawns('arena', 'red');
    assert.equal(spawns.length, 3);
    assert.deepEqual(spawns, [
      { team: 'red', x: -58, z: 120, size: 5, unitType: null, faction: 'space marines' },
      { team: 'red', x: -58, z: 100, size: 5, unitType: null, faction: 'space marines' },
      { team: 'red', x: -58, z: 110, size: 5, unitType: 'grey_knight', faction: 'space marines' },
    ]);
    assert.deepEqual(startingMarineSpawns('arena', 'blue'), []);
    for (const mapKey of ['/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
      const side = startingMarineSpawns(mapKey, 'red');
      assert.equal(side.length, 3);
      assert.deepEqual(side.map((s) => s.unitType), [null, null, 'grey_knight']);
      assert.ok(side.every((s) => s.faction === 'space marines'));
      assert.deepEqual(startingMarineSpawns(mapKey, 'blue'), []);
    }
  });

  it('locates faction bases for the starting camera', () => {
    assert.deepEqual(factionBasePosition('arena', 'blue', 'ig'), { x: -74, z: -110 });
    assert.equal(factionBasePosition('arena', 'red', 'ig'), null);
    const alvarusIg = factionBasePosition('/maps/6p_alvarus/6p_alvarus.sgb', 'blue', 'ig');
    assert.ok(alvarusIg && typeof alvarusIg.x === 'number' && typeof alvarusIg.z === 'number');
  });

  it('boundsFor reads per-map playable half-extents', () => {
    assert.equal(boundsFor('arena'), 512);
    assert.equal(boundsFor('/maps/6p_alvarus/6p_alvarus.sgb'), 256);
    assert.equal(boundsFor('/maps/6p_mortalis/mortalis.sgb'), 256);
    assert.equal(boundsFor('bogus'), 512);
  });
});
