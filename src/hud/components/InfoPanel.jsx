import { world, selBuilder, selBuildings, selListeningPost, hoveredEnemySquad, SQUAD_MAX, JET_ATTACK_RANGE, PLAYER, LP_REQUISITION_RATES } from '../../scene.js';
import { getStructureConfig } from '../../factions.js';
import { getViewKind, getAliveGroups, computeSquadData, entityFaction, workerDisplayName } from '../data.js';
import { StatRow } from '../bits.jsx';
import { MAX_UPGRADES_PER_SQUAD, meleeDamageEstimate, numberOfUpgrades } from '../../soldier-aim.js';
import { taskbarIconUrl } from '../../taskbar-icons.js';
import {
  InfoPanel as InfoPanelCss, InfoTitle, InfoStats, QueueWrap, QueueLabel, QueueItemsRow, QueueItem,
} from '../primitives.jsx';

function queueIcon(item) {
  if (item.type === 'squad') return '⚔';
  if (item.type === 'jet') return '✈️';
  if (item.type === 'vehicle') return '🚜';
  if (item.type === 'builder') return '🔨';
  return '👤';
}

function ProductionQueue({ items }) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <QueueWrap>
      <QueueLabel>PRODUCTION QUEUE</QueueLabel>
      <QueueItemsRow>
        {items.map((item, i) => (
          <QueueItem key={i} title={`${String(item.type).replace(/_/g, ' ').toUpperCase()} — ${Math.round((item.progress / item.total) * 100)}%`}>
            {queueIcon(item)}
            <div className="q-prog" style={{ width: `${(item.progress / item.total) * 100}%` }} />
          </QueueItem>
        ))}
      </QueueItemsRow>
    </QueueWrap>
  );
}

function ResearchQueue({ items }) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <QueueWrap>
      <QueueLabel>RESEARCH</QueueLabel>
      <QueueItemsRow>
        {items.map((item, i) => (
          <QueueItem key={i} title={`RESEARCH — ${Math.round((item.progress / item.total) * 100)}%`}>
            🔬
            <div className="q-prog" style={{ width: `${(item.progress / item.total) * 100}%` }} />
          </QueueItem>
        ))}
      </QueueItemsRow>
    </QueueWrap>
  );
}

export function InfoPanel() {
  const view = getViewKind();

  let title = 'SELECT A UNIT OR BUILDING';
  let stats = null;
  let queue = null;

  if (view === 'builder') {
    const builder = world.get(selBuilder, 'builder');
    title = `${workerDisplayName(entityFaction(builder))} UNIT`;
    stats = <span>STATUS:<b>{builder?.isBuilding ? 'BUILDING…' : 'IDLE'}</b></span>;
  } else if (view === 'airfield') {
    const airfield = world.get(selBuildings[0], 'airfield');
    if (airfield) {
      const jets = world.query('jet').filter((jid) => world.get(jid, 'jet')?.team === PLAYER);
      title = 'AIRFIELD';
      stats = (
        <>
          <span>HP:<b>{Math.ceil(airfield.hp)}/{airfield.maxHp}</b></span>
          <span>JETS:<b>{jets.length}</b></span>
          <span>QUEUE:<b>{airfield.queue.length}/4</b></span>
        </>
      );
      if (airfield.queue.length > 0) {
        queue = <ProductionQueue items={airfield.queue} />;
      }
    }
  } else if (view === 'building') {
    const id = selBuildings[0];
    const building = world.get(id, 'building');
    const structure = world.get(id, 'structure');
    const entity = building || structure;
    if (entity) {
      const isHQ = building?.type === 'hq';
      const isBarracks = building?.type === 'barracks' || building?.type === 'infantry_command';
      const isMechanized = building?.type === 'mechanized';
      const factionKey = entityFaction(entity);
      const structureCfg = structure ? getStructureConfig(factionKey, structure.type) : (building ? getStructureConfig(factionKey, building.type) : null);
      const name = isHQ ? 'HQ' : (isBarracks ? (structureCfg?.name?.toUpperCase() || 'INFANTRY COMMAND') : (isMechanized ? (factionKey === 'ig' ? 'MECHANIZED COMMAND' : 'VEHICLE DEPOT') : (structureCfg?.name?.toUpperCase() || (structure?.type === 'tower' ? 'TOWER' : (structure?.type === 'towerBase' ? 'TOWER BASE' : (structure?.type === 'gunTurret' ? 'GUN TURRET' : 'POWER PLANT'))))));
      title = name;
      stats = <span>HP:<b>{Math.ceil(entity.hp)}/{entity.maxHp}</b></span>;
      // Any training building shows its queue (structures have no queue).
      if (building && building.queue) {
        stats = (
          <>
            <span>HP:<b>{Math.ceil(entity.hp)}/{entity.maxHp}</b></span>
            <span>QUEUE:<b>{building.queue.length}/6</b></span>
          </>
        );
        if (building.queue.length > 0) {
          queue = <ProductionQueue items={building.queue} />;
        }
      }
      if (structure?.type === 'tactica_control' && structure.researchQueue?.length > 0) {
        queue = <ResearchQueue items={structure.researchQueue} />;
      }
    }
  } else if (view === 'listening_post') {
    const sp = world.get(selListeningPost, 'strategicPoint');
    if (sp) {
      const tier = sp.lpTier || 0;
      const rate = LP_REQUISITION_RATES[Math.min(tier, 3)];
      title = 'LISTENING POST';
      stats = (
        <>
          <span>TIER:<b>{tier}/3</b></span>
          <span>RATE:<b>+{(rate * 0.1).toFixed(1)}/s</b></span>
        </>
      );
      if (sp.researchQueue?.length > 0) {
        queue = <ResearchQueue items={sp.researchQueue} />;
      }
    }
  } else if (view === 'buildings') {
    title = `${selBuildings.length} BUILDINGS SELECTED`;
    const barracksIds = selBuildings.filter((bid) => world.has(bid, 'building'));
    if (barracksIds.length) {
      const totalQ = barracksIds.reduce((sum, bid) => sum + (world.get(bid, 'building')?.queue.length || 0), 0);
      stats = <span>TOTAL QUEUE:<b>{totalQ}</b></span>;
    }
  } else if (view === 'jet') {
    const { jets } = getAliveGroups();
    const jet = world.get(jets[0], 'jet');
    if (jet) {
      title = jets.length > 1 ? `${jets.length} JETS` : 'FIGHTER JET';
      const mode = jet.waitOrders ? 'HOLDING' : jet.moveOrder ? 'EN ROUTE' : jet.patrolMode.toUpperCase();
      stats = (
        <>
          <StatRow icon="❤️" label="HP" value={`${Math.ceil(jet.hp)}/${jet.maxHp}`} cls={jet.hp / jet.maxHp < 0.4 ? 'warn' : jet.hp === jet.maxHp ? 'good' : ''} />
          <StatRow icon="🔵" label="STATUS" value={mode} />
          <StatRow icon="🎯" label="ATK RNG" value={`${JET_ATTACK_RANGE}u`} />
          <StatRow icon="✈️" label="JETS" value={`${jets.length}`} />
        </>
      );
    }
  } else if (view === 'apc') {
    const { apcs } = getAliveGroups();
    const apc = world.get(apcs[0], 'apc');
    if (apc) {
      title = entityFaction(apc) === 'ig' ? 'MECHANIZED COMMAND' : 'VEHICLE DEPOT';
      stats = (
        <>
          <span>HP:<b>{Math.ceil(apc.hp)}/{apc.maxHp}</b></span>
          <span>QUEUE:<b>{apc.queue?.length || 0}/6</b></span>
        </>
      );
      if (apc.queue?.length > 0) {
        queue = <ProductionQueue items={apc.queue} />;
      }
    }
  } else if (view === 'vehicle') {
    const { vehicles } = getAliveGroups();
    const vehicle = world.get(vehicles[0], 'vehicle');
    if (vehicle) {
      title = vehicles.length > 1 ? `${vehicles.length} VEHICLES` : vehicle.name.toUpperCase();
      const statusStr = vehicle.moveOrder ? 'MOVE' : 'IDLE';
      stats = (
        <>
          <StatRow icon="❤️" label="HP" value={`${Math.ceil(vehicle.hp)}/${vehicle.maxHp}`} cls={vehicle.hp / vehicle.maxHp < 0.4 ? 'warn' : vehicle.hp === vehicle.maxHp ? 'good' : ''} />
          <StatRow icon="🔵" label="STATUS" value={statusStr} />
          <StatRow icon="🎯" label="ATK RNG" value={`${vehicle.attackRange}u`} />
          <StatRow icon="💨" label="SPD" value={vehicle.speed.toFixed(1)} />
          <StatRow icon={taskbarIconUrl('rangedamage') || '💥'} label="DPS" value={(vehicle.attackRate * 10).toFixed(0)} />
        </>
      );
    }
  } else if (view === 'squad') {
    const data = computeSquadData();
    const sq = data.alive.length === 1 ? world.get(data.alive[0], 'squad') : null;
    if (sq) {
      title = 'SOLDIER SQUAD';
      const aliveSols = sq.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier'));
      const avgRate = aliveSols.length ? aliveSols.reduce((sum, sid) => {
        const sol = world.get(sid, 'soldier');
        return sum + (sol ? sol.attackRate : 0);
      }, 0) / aliveSols.length : 0;
      const dps = (10.5 * avgRate).toFixed(1);
      const mel = meleeDamageEstimate(aliveSols.map((sid) => world.get(sid, 'soldier'))).toFixed(1);
      const upgrades = numberOfUpgrades(
        aliveSols.map((sid) => world.get(sid, 'soldier')),
        sq.projectileType,
      );
      const menMax = sq.soldiers[0] !== null && world.has(sq.soldiers[0], 'soldier') ? SQUAD_MAX : SQUAD_MAX - 1;
      stats = (
        <>
          <StatRow icon={taskbarIconUrl('meleedamage') || '🗡️'} label={null} value={mel} />
          <StatRow icon={taskbarIconUrl('squadsize') || '👥'} label={null} value={`${aliveSols.length}/${menMax}`} cls={aliveSols.length < 3 ? 'warn' : aliveSols.length === SQUAD_MAX ? 'good' : ''} />
          <StatRow icon={taskbarIconUrl('rangedamage') || '⚡'} label={null} value={dps} />
          <StatRow icon={taskbarIconUrl('numberofupgrades') || '⬆️'} label={null} value={`${upgrades}/${MAX_UPGRADES_PER_SQUAD}`} />
        </>
      );
    }
  } else if (view === 'squads') {
    const data = computeSquadData();
    title = `${data.alive.length} SQUADS SELECTED`;
    const avgRange = (data.alive.reduce((sum, sqId) => {
      const sq = world.get(sqId, 'squad');
      return sum + (sq ? sq.attackRange : 0);
    }, 0) / data.alive.length).toFixed(0);
    const avgSpd = (data.alive.reduce((sum, sqId) => {
      const sq = world.get(sqId, 'squad');
      return sum + (sq ? sq.speed : 0);
    }, 0) / data.alive.length).toFixed(1);
    stats = (
      <>
        <StatRow icon={taskbarIconUrl('squadsize') || '👥'} label="MEN" value={`${data.totalMen}/${data.totalMax}`} cls={data.totalMen < data.totalMax * 0.3 ? 'warn' : ''} />
        <StatRow icon="❤️" label="AVG HP" value={`${Math.ceil(data.avgHpPct * 100)}%`} cls={data.avgHpPct < 0.4 ? 'warn' : ''} />
        <StatRow icon="🎯" label="AVG RNG" value={`${avgRange}u`} />
        <StatRow icon="💨" label="AVG SPD" value={avgSpd} />
      </>
    );
  } else if (view === 'default') {
    title = 'SELECT A UNIT OR BUILDING';
    if (hoveredEnemySquad && world.has(hoveredEnemySquad, 'squad')) {
      const sq = world.get(hoveredEnemySquad, 'squad');
      const aliveSols = sq.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier'));
      let hp = 0;
      let mhp = 0;
      aliveSols.forEach((sid) => {
        const sol = world.get(sid, 'soldier');
        if (sol) {
          hp += sol.hp;
          mhp += sol.maxHp;
        }
      });
      const percentage = mhp > 0 ? hp / mhp : 0;
      title = 'ENEMY — RIGHT-CLICK TO ATTACK';
      stats = (
        <>
          <StatRow icon={taskbarIconUrl('squadsize') || '👥'} label="MEN" value={`${aliveSols.length}/${SQUAD_MAX}`} cls={aliveSols.length < SQUAD_MAX * 0.4 ? 'warn' : ''} />
          <StatRow icon="❤️" label="HP" value={`${Math.ceil(percentage * 100)}%`} cls={percentage < 0.4 ? 'warn' : ''} />
        </>
      );
    }
  }

  return (
    <InfoPanelCss>
      <InfoTitle>{title}</InfoTitle>
      <InfoStats>{stats}</InfoStats>
      {queue}
    </InfoPanelCss>
  );
}
