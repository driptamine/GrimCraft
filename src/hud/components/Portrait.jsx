import * as THREE from 'three';
import { world, camera, selBuilder, selBuildings, selListeningPost, hoveredEnemySquad } from '../../scene.js';
import { FACTIONS, getStructureConfig } from '../../factions.js';
import { getViewKind, getAliveGroups, computeSquadData, getPortraitFocusPosition, entityFaction, workerDisplayName } from '../data.js';
import {
  PortraitPanel, PortraitIconDiv, PortraitImg, PortraitName, PortraitHpBar, PortraitHpFill, PortraitHpLabel,
} from '../primitives.jsx';

function portraitIconEl(icon) {
  if (icon && icon.includes('/')) {
    return <PortraitImg src={icon} alt="" />;
  }
  return icon || '❓';
}

function computeSingleBuilding() {
  const id = selBuildings[0];
  const building = world.get(id, 'building');
  const structure = world.get(id, 'structure');
  const entity = building || structure;
  if (!entity) {
    return null;
  }
  const isHQ = building?.type === 'hq' || structure?.type === 'hq';
  const isBarracks = building?.type === 'barracks' || building?.type === 'infantry_command';
  const isMechanized = building?.type === 'mechanized';
  const factionKey = entityFaction(entity);
  const faction = FACTIONS[factionKey];
  const cfg = structure ? getStructureConfig(factionKey, structure.type) : (building ? getStructureConfig(factionKey, building.type) : null);

  let icon;
  let name;
  if (isHQ) {
    icon = faction?.icons?.hq || '🏰';
    name = 'HQ';
  } else if (isBarracks) {
    icon = faction?.icons?.infantry_command || faction?.icons?.barracks || '🏠';
    name = cfg?.name?.toUpperCase() || (building?.type === 'infantry_command' ? 'INFANTRY COMMAND' : 'BARRACKS');
  } else if (isMechanized) {
    icon = faction?.icons?.mechanized || '🏗';
    name = factionKey === 'ig' ? 'MECHANIZED COMMAND' : 'VEHICLE DEPOT';
  } else if (structure) {
    const iconKey = structure.type === 'tower' ? 'turret' : structure.type;
    name = cfg?.name?.toUpperCase() || structure.type.toUpperCase();
    icon = faction?.icons?.[iconKey] || cfg?.icon || '🏗';
  } else {
    name = 'BUILDING';
    icon = '🏗';
  }
  return { icon, name, entity };
}

export function Portrait() {
  const view = getViewKind();

  let icon = '❓';
  let name = 'NOTHING';
  let hpPct = 0;
  let hpColor = '#44ff88';
  let hpLabel = '';

  if (view === 'builder') {
    const builder = world.get(selBuilder, 'builder');
    if (builder) {
      icon = FACTIONS[entityFaction(builder)]?.icons?.worker || '🔨';
      name = workerDisplayName(entityFaction(builder));
      hpPct = (builder.hp / builder.maxHp) * 100;
      hpColor = '#ffaa22';
    }
  } else if (view === 'airfield') {
    const airfield = world.get(selBuildings[0], 'airfield');
    if (airfield) {
      icon = FACTIONS[entityFaction(airfield)]?.icons?.airfield || '✈️';
      name = 'AIRFIELD';
      hpPct = (airfield.hp / airfield.maxHp) * 100;
      hpColor = '#44aaff';
    }
  } else if (view === 'building') {
    const single = computeSingleBuilding();
    if (single) {
      icon = single.icon;
      name = single.name;
      hpPct = (single.entity.hp / single.entity.maxHp) * 100;
      hpColor = '#44ff88';
    }
  } else if (view === 'buildings') {
    icon = '🏠🏠';
    name = `${selBuildings.length} BUILDINGS`;
    hpPct = 100;
    hpColor = '#44ff88';
  } else if (view === 'jet') {
    const { jets } = getAliveGroups();
    const jet = world.get(jets[0], 'jet');
    if (jet) {
      icon = '✈️';
      name = jets.length > 1 ? `${jets.length} JETS` : 'FIGHTER JET';
      hpPct = (jet.hp / jet.maxHp) * 100;
      hpColor = '#44aaff';
    }
  } else if (view === 'apc') {
    const { apcs } = getAliveGroups();
    const apc = world.get(apcs[0], 'apc');
    if (apc) {
      const apcFaction = entityFaction(apc);
      icon = FACTIONS[apcFaction]?.icons?.mechanized || '🏗';
      name = apcFaction === 'ig' ? 'MECHANIZED COMMAND' : 'VEHICLE DEPOT';
      hpPct = (apc.hp / apc.maxHp) * 100;
      hpColor = '#22ff88';
    }
  } else if (view === 'vehicle') {
    const { vehicles } = getAliveGroups();
    const vehicle = world.get(vehicles[0], 'vehicle');
    if (vehicle) {
      icon = vehicle.icon || '🚜';
      name = vehicles.length > 1 ? `${vehicles.length} VEHICLES` : vehicle.name.toUpperCase().replace(/_/g, ' ');
      hpPct = (vehicle.hp / vehicle.maxHp) * 100;
      hpColor = '#22ff88';
    }
  } else if (view === 'squad' || view === 'squads') {
    const data = computeSquadData();
    const squadFaction = FACTIONS[entityFaction(world.get(data.alive[0], 'squad'))];
    if (view === 'squad') {
      const firstSq = world.get(data.alive[0], 'squad');
      const unitCfg = firstSq?.unitType ? squadFaction?.units?.find((u) => u.name === firstSq.unitType) : null;
      icon = unitCfg?.icon || squadFaction?.icons?.squad || '⚔';
      name = unitCfg ? unitCfg.name.toUpperCase().replace(/_/g, ' ') : 'SQUAD';
    } else {
      icon = '⚔⚔';
      name = `${data.alive.length} SQUADS`;
    }
    hpPct = data.avgHpPct * 100;
    hpColor = data.hpColor;
    hpLabel = `${Math.ceil(data.totalHp)} / ${data.totalMaxHp}`;
  } else if (view === 'default') {
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
      icon = '💀';
      name = 'ENEMY SQUAD';
      hpPct = percentage * 100;
      hpColor = percentage > 0.6 ? '#44ff88' : percentage > 0.3 ? '#ffcc00' : '#ff4422';
      hpLabel = `${Math.ceil(hp)} / ${mhp}`;
    }
  }

  const handleClick = () => {
    if (!camera) {
      return;
    }
    const { squads, apcs, vehicles, jets } = getAliveGroups();
    const pos = getPortraitFocusPosition(world, view, {
      builderId: selBuilder,
      buildingIds: selBuildings,
      squads,
      apcs,
      vehicles,
      jets,
      hoveredEnemySquad,
      listeningPostId: selListeningPost,
    });
    if (pos) {
      camera.target = new THREE.Vector3(pos.x, 0, pos.z);
    }
  };

  return (
    <PortraitPanel onClick={handleClick} title="Click to focus camera">
      <PortraitIconDiv title={name}>{portraitIconEl(icon)}</PortraitIconDiv>
      <PortraitName>{name}</PortraitName>
      <PortraitHpBar>
        <PortraitHpFill style={{ width: `${hpPct}%`, background: hpColor }} />
      </PortraitHpBar>
      <PortraitHpLabel>{hpLabel}</PortraitHpLabel>
    </PortraitPanel>
  );
}
