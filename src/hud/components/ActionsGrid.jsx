import * as THREE from 'three';
import React from 'react';
import {
  world, selBuilder, selBuildings, selSquads, selListeningPost, requisition, setRequisition, energy, setEnergy, PLAYER, COSTS, PROD_TIME, SQUAD_MAX,
  researchedTech,
} from '../../scene.js';
import { FACTIONS, getStructureConfig } from '../../factions.js';
import { startBuild, demolishBuilding, setBuilderCommand, setBuilderStance, clearBuilderCommand, buildAddon, armFlyTargeting } from '../../input.js';
import { netTrainUnit, netDemolishBuilding } from '../../multiplayer.js';
import { updateHUD } from '../../hud.js';
import { buildMenuOpen, setBuildMenuOpen } from '../store.js';
import { getViewKind, getAliveGroups, computeSquadData, getBarracksProduction, getStructureProduction, unitTooltip, structureTooltip, addonTooltip, entityFaction, workerDisplayName } from '../data.js';
import { ActionButton, CostGlyph } from '../bits.jsx';
import { ActionsGridDiv, CommandGridDiv, CommandEmptySlot } from '../primitives.jsx';

/* ── Builder ─────────────────────────────────────────────────────────── */

function BuilderActions() {
  const builder = world.get(selBuilder, 'builder');
  if (!builder) return null;

  const builderFaction = entityFaction(builder);
  const faction = FACTIONS[builderFaction];
  const isOpen = buildMenuOpen;

  const stopBuild = () => {
    builder.moveTarget = null;
    builder.buildTarget = null;
    builder.buildTargetSP = null;
    builder.isBuilding = false;
    builder.attackMove = false;
    builder.meleeOrder = false;
    builder.repairTarget = null;
    clearBuilderCommand();
    updateHUD();
  };

  const buttons = [];

  if (!isOpen) {
    const stanceBtn = (key, icon, label) => {
      const isActive = builder.stance === key;
      return (
        <ActionButton
          key={`stance_${key}`}
          icon={icon}
          label={label}
          tooltip={`STANCE: ${label}\n${key === 'stand' ? 'Hold position, shoot enemies' : 'Move & shoot while advancing'}`}
          style={{
            border: isActive ? '1px solid #50c8ff' : '1px solid rgba(80,200,255,0.22)',
            opacity: isActive ? 1 : 0.6,
          }}
          onClick={() => setBuilderStance(key)}
        />
      );
    };

    buttons.push(
      <ActionButton key="move" icon="assets/command_icons/move.png" label="MOVE" cost="M" tooltip="MOVE\nRight-click ground to move" onClick={() => setBuilderCommand('move')} />,
      <ActionButton key="stop" icon={faction?.icons?.stop || 'assets/command_icons/stop.png'} label="STOP" cost="Q KEY" tooltip="STOP\nCancel all orders" onClick={stopBuild} />,
      <ActionButton key="attackmove" icon="assets/command_icons/attackm.png" label="ATTACK\nMOVE" tooltip="ATTACK MOVE\nMove and engage enemies along the way" onClick={() => setBuilderCommand('attackmove')} />,
      <ActionButton key="melee" icon="assets/command_icons/melee.png" label="MELEE" cost="T" tooltip="MELEE\nEngage in close combat" onClick={() => setBuilderCommand('melee')} />,
      <ActionButton key="toggle" icon="assets/command_icons/train_units.png" label="BUILD\nSTRUCTURE" tooltip="BUILD STRUCTURE\nOpen construction menu" onClick={() => setBuildMenuOpen(true)} />,
      <ActionButton key="repair" icon="assets/command_icons/repair.png" label="REPAIR" cost="R" tooltip="REPAIR\nRight-click damaged building to repair" onClick={() => setBuilderCommand('repair')} />,
      stanceBtn('stand', 'assets/command_icons/stance_stand.png', 'STAND'),
      stanceBtn('ranged', 'assets/command_icons/stance_ranged.png', 'RANGED'),
      <CommandEmptySlot key="empty_0" />,
      <CommandEmptySlot key="empty_1" />,
      <CommandEmptySlot key="empty_2" />,
      <CommandEmptySlot key="empty_3" />,
    );
  }

  if (isOpen) {
    const PRIORITY_ORDER = ['hq', 'barracks', 'infantry_command', 'listening_post', 'plasma_generator', 'tactica_control', 'mechanized', 'mars_pattern', 'thermo_generator', 'turret', 'mines'];
    const factionStructures = (FACTIONS[builderFaction]?.structures || []).map((s) => s.type);
    const BUILD_ORDER = FACTIONS[builderFaction]?.buildOrder || PRIORITY_ORDER.filter((t) => factionStructures.includes(t));
    const DEFAULT_LABELS = {
      hq: 'HQ',
      barracks: 'BARRACKS',
      infantry_command: 'INFANTRY COMMAND',
      listening_post: 'LISTENING POST',
      plasma_generator: 'PLASMA GENERATOR',
      tactica_control: 'TACTICA CONTROL',
      mechanized: 'MECHANIZED COMMAND',
      mars_pattern: 'MARS PATTERN COMMAND',
      thermo_generator: 'THERMO GENERATOR',
      turret: 'TURRET',
      mines: 'MINES',
    };
    const FALLBACK_ICONS = {
      hq: '🏰', barracks: '🏗', infantry_command: '🏗', listening_post: '📡', plasma_generator: '⚡', tactica_control: '🛰',
      mechanized: '🚗', mars_pattern: '🏛', thermo_generator: '⚡', turret: '🗼', mines: '💣',
    };

    for (const [slotIndex, type] of BUILD_ORDER.entries()) {
      if (!type) {
        buttons.push(<CommandEmptySlot key={`empty_${slotIndex}`} />);
        continue;
      }
      const cfg = getStructureConfig(builderFaction, type);
      const cost = COSTS[type] ?? cfg?.cost ?? 0;
      const label = (cfg?.name ? cfg.name.toUpperCase() : DEFAULT_LABELS[type]).replace(/ /g, '\n');
      const btnIcon = faction?.icons?.[type] || cfg?.icon || FALLBACK_ICONS[type];
      const noReq = requisition < cost;

      // Listening posts stay clickable whenever affordable, like every other
      // structure: placeListeningPost still rejects invalid targets, so the
      // ghost simply finds no valid point until one is owned.
      buttons.push(
        <ActionButton
          key={type}
          icon={btnIcon}
          label={label}
          cost={`${cost}R`}
          hideText
          tooltip={structureTooltip(type, builderFaction)}
          disabled={noReq}
          onClick={() => startBuild(type)}
        />,
      );
    }
  }

  // Build-structures menu is icon-only like the command grid: labels and
  // costs stay hidden until hover (full name + cost remain in the tooltip).
  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Buildings ───────────────────────────────────────────────────────── */

function DemolishButton({ label, confirmText, onClick }) {
  return (
    <ActionButton
      icon="💥"
      label={label}
      style={{ borderColor: '#ff4444', color: '#ff8888' }}
      tooltip="DEMOLISH\nDestroy permanently"
      onClick={() => {
        if (!confirm(confirmText)) return;
        onClick();
      }}
    />
  );
}

function AirfieldActions() {
  const id = selBuildings[0];
  const airfield = world.get(id, 'airfield');
  if (!airfield) return null;
  const faction = FACTIONS[entityFaction(airfield)];

  const train = (count) => {
    if (window._multiplayerMode) {
      for (let i = 0; i < count; i += 1) netTrainUnit(id, 'jet');
    } else {
      for (let i = 0; i < count; i += 1) {
        if (requisition >= COSTS.jet && airfield.queue.length < 4) {
          setRequisition(requisition - COSTS.jet);
          airfield.queue.push({ type: 'jet', progress: 0, total: PROD_TIME.jet });
        }
      }
    }
    updateHUD();
  };

  const buttons = [];
  if (!airfield.constructing) {
    buttons.push(
      <ActionButton key="jet" icon={faction?.icons?.jet || '✈️'} label="JET" cost={`${COSTS.jet}R`} tooltip={`FIGHTER JET\nCOST ${COSTS.jet}R\nTrain 1 fighter jet`} disabled={!(requisition >= COSTS.jet && airfield.queue.length < 4)} onClick={() => train(1)} />,
      <ActionButton key="jets2" icon={faction?.icons?.jet || '✈️✈️'} label="2 JETS" cost={`${COSTS.jet * 2}R`} tooltip={`2 FIGHTER JETS\nCOST ${COSTS.jet * 2}R\nTrain 2 fighter jets`} disabled={!(requisition >= COSTS.jet * 2 && airfield.queue.length <= 2)} onClick={() => train(2)} />,
    );
  }
  buttons.push(
    <DemolishButton
      key="demolish"
      label="DEMOLISH"
      confirmText="Demolish this airfield?"
      onClick={() => {
        if (window._multiplayerMode) netDemolishBuilding(id);
        else demolishBuilding(id);
      }}
    />,
  );

  return <ActionsGridDiv>{buttons}</ActionsGridDiv>;
}

function BuildingActions() {
  const id = selBuildings[0];
  const building = world.get(id, 'building');
  const structure = world.get(id, 'structure');
  const entity = building || structure;
  if (!entity) return null;

  const factionKey = entityFaction(entity);
  const faction = FACTIONS[factionKey];
  const isBarracks = !!building;
  const isMechanized = building?.type === 'mechanized';
  const buttons = [];

  if (isBarracks || isMechanized) {
    const squadIcon = faction?.icons?.squad || '⚔';
    const workerIcon = faction?.icons?.worker || '🔨';
    const barracksProduction = isMechanized ? getStructureProduction('mechanized', factionKey) : getBarracksProduction(factionKey);
    // Buildings with no barracks list (e.g. the chaos greater circle) train
    // from their own production order instead; legacy string entries can't
    // render, so only object items reach the grid.
    const ownProduction = ((getStructureConfig(factionKey, building?.type) || {}).production || [])
      .filter((p) => p && typeof p === 'object' && p.name);
    const useOwn = !isMechanized && barracksProduction.length === 0 && ownProduction.length > 0;
    const production = useOwn ? ownProduction : barracksProduction;

    const train = (type, count) => {
      if (window._multiplayerMode) {
        for (let i = 0; i < count; i += 1) netTrainUnit(id, type);
      } else {
        for (let i = 0; i < count; i += 1) {
          if (requisition >= COSTS[type] && building.queue.length < 6) {
            setRequisition(requisition - COSTS[type]);
            building.queue.push({ type, progress: 0, total: PROD_TIME[type] });
          }
        }
      }
      updateHUD();
    };

    const trainProd = (item) => {
      const cost = item.cost || COSTS[item.name] || COSTS.squad;
      const time = item.time || PROD_TIME[item.name] || PROD_TIME.squad;
      if (window._multiplayerMode) {
        netTrainUnit(id, item.name);
      } else if (requisition >= cost && building.queue.length < 6) {
        setRequisition(requisition - cost);
        building.queue.push({ type: item.name, progress: 0, total: time });
      }
      updateHUD();
    };

    production.forEach((item, i) => {
      const cost = item.cost || COSTS[item.name] || COSTS.squad;
      buttons.push(
        <ActionButton
          key={`prod_${i}`}
          icon={item.icon}
          label={item.name.toUpperCase().replace(/_/g, ' ')}
          cost={`${cost}R`}
          tooltip={unitTooltip(item, factionKey)}
          disabled={!(requisition >= cost && building.queue.length < 6)}
          onClick={() => trainProd(item)}
        />,
      );
    });

    if (isBarracks && !useOwn) {
      buttons.push(
        <ActionButton key="squad" icon={squadIcon} label="SQUAD" cost={`${COSTS.squad}R`} tooltip={`GUARDSMEN SQUAD\nCOST ${COSTS.squad}R\nRecruit a squad of guardsmen`} disabled={!(requisition >= COSTS.squad && building.queue.length < 6)} onClick={() => train('squad', 1)} />,
        <ActionButton key="builder" icon={workerIcon} label={workerDisplayName(factionKey)} cost={`${COSTS.builder}R`} tooltip={`${workerDisplayName(factionKey)}\nCOST ${COSTS.builder}R\nRecruit a construction engineer`} disabled={!(requisition >= COSTS.builder && building.queue.length < 6)} onClick={() => train('builder', 1)} />,
        <ActionButton key="squad3" icon={squadIcon} label="3 SQUADS" cost={`${COSTS.squad * 3}R`} tooltip={`3 GUARDSMEN SQUADS\nCOST ${COSTS.squad * 3}R\nRecruit 3 squads at once`} disabled={!(requisition >= COSTS.squad * 3 && building.queue.length <= 3)} onClick={() => train('squad', 3)} />,
      );
    }
  }

  buttons.push(
    <DemolishButton
      key="demolish"
      label="DEMOLISH"
      confirmText="Demolish this building?"
      onClick={() => {
        if (window._multiplayerMode) netDemolishBuilding(id);
        else demolishBuilding(id);
      }}
    />,
  );

  return <ActionsGridDiv>{buttons}</ActionsGridDiv>;
}

function MultiBuildingActions() {
  const firstBuilding = world.get(selBuildings[0], 'building') || world.get(selBuildings[0], 'structure');
  const faction = FACTIONS[entityFaction(firstBuilding)];
  const barracksIds = selBuildings.filter((bid) => world.has(bid, 'building'));
  const buttons = [];

  if (barracksIds.length) {
    const squadIcon = faction?.icons?.squad || '⚔';
    buttons.push(
      <ActionButton
        key="squadAll"
        icon={squadIcon}
        label="SQUAD ALL"
        cost={`${COSTS.squad * barracksIds.length}R`}
        tooltip={`SQUAD ALL\nCOST ${COSTS.squad * barracksIds.length}R\nRecruit 1 squad from each selected barracks`}
        disabled={requisition < COSTS.squad * barracksIds.length}
        onClick={() => {
          if (window._multiplayerMode) {
            barracksIds.forEach((bid) => netTrainUnit(bid, 'squad'));
          } else {
            barracksIds.forEach((bid) => {
              const b = world.get(bid, 'building');
              if (b && requisition >= COSTS.squad && b.queue.length < 6) {
                setRequisition(requisition - COSTS.squad);
                b.queue.push({ type: 'squad', progress: 0, total: PROD_TIME.squad });
              }
            });
          }
          updateHUD();
        }}
      />,
    );
  }

  buttons.push(
    <DemolishButton
      key="demolishAll"
      label="DEMOLISH ALL"
      confirmText={`Demolish ${selBuildings.length} buildings?`}
      onClick={() => {
        const ids = [...selBuildings];
        if (window._multiplayerMode) ids.forEach((bid) => netDemolishBuilding(bid));
        else ids.forEach((bid) => demolishBuilding(bid));
      }}
    />,
  );

  return <ActionsGridDiv>{buttons}</ActionsGridDiv>;
}

/* ── Jets ────────────────────────────────────────────────────────────── */

function JetActions() {
  const { jets } = getAliveGroups();
  const jet = world.get(jets[0], 'jet');
  if (!jet) return null;

  const modes = [
    { key: 'hold', icon: '⏸', label: 'HOLD', tip: 'Hover in place, no attack' },
    { key: 'orbit', icon: '🔄', label: 'PATROL', tip: 'Circle patrol, no attack' },
    { key: 'attack', icon: '⚔', label: 'ATTACK', tip: 'Circle + auto-strafe enemies' },
  ];

  const setMode = (m) => {
    jets.forEach((jid) => {
      const j = world.get(jid, 'jet');
      if (!j) return;
      j.patrolMode = m.key;
      j.waitOrders = false;
      j.moveOrder = null;
      j.strafe = null;
      j.strafeCd = 0;
      if (m.key === 'orbit' || m.key === 'attack') {
        j.holdPos = j.position.clone();
        j.orbitAngle = Math.atan2(j.position.x - j.holdPos.x, j.position.z - j.holdPos.z);
      }
    });
    updateHUD();
  };

  return (
    <ActionsGridDiv>
      {modes.map((m) => {
        const isActive = jets.every((jid) => {
          const j = world.get(jid, 'jet');
          return j && (j.waitOrders ? 'hold' : j.patrolMode) === m.key;
        });
        return (
          <ActionButton
            key={m.key}
            icon={m.icon}
            label={m.label}
            tooltip={m.tip}
            style={{
              border: isActive ? '1px solid #50c8ff' : '1px solid rgba(80,200,255,0.22)',
              opacity: isActive ? 1 : 0.6,
            }}
            onClick={() => setMode(m)}
          />
        );
      })}
    </ActionsGridDiv>
  );
}

/* ── Squads ──────────────────────────────────────────────────────────── */

function SquadActions() {
  const data = computeSquadData();
  const canFlySelected = !window._multiplayerMode && data.alive.some((sqId) => {
    const sq = world.get(sqId, 'squad');
    const cfg = sq?.unitType ? FACTIONS[sq.faction]?.units?.find((u) => u.name === sq.unitType) : null;
    return !!cfg?.canFly;
  });

  return (
    <ActionsGridDiv>
      <ActionButton
        icon="⏹"
        label="STOP"
        cost="Q KEY"
        tooltip="STOP\nCancel movement and hold position"
        onClick={() => {
          data.alive.forEach((sqId) => {
            const sq = world.get(sqId, 'squad');
            if (sq) {
              sq.moveOrder = null;
              sq.stopped = true;
            }
          });
          updateHUD();
        }}
      />
      <ActionButton
        icon="▶"
        label="RESUME"
        tooltip="RESUME\nClear STOP and resume orders"
        onClick={() => {
          data.alive.forEach((sqId) => {
            const sq = world.get(sqId, 'squad');
            if (sq) sq.stopped = false;
          });
          updateHUD();
        }}
      />
      <ActionButton
        icon={data.chaseActive ? '🔴' : '🟢'}
        label={data.chaseActive ? 'CHASE ON' : 'CHASE OFF'}
        tooltip={`AUTO-CHASE ${data.chaseActive ? 'ON' : 'OFF'}\nAutomatically pursue nearby enemies`}
        onClick={() => {
          const newVal = !data.chaseActive;
          data.alive.forEach((sqId) => {
            const sq = world.get(sqId, 'squad');
            if (sq) sq.autoChase = newVal;
          });
          updateHUD();
        }}
      />
      {canFlySelected && (
        <ActionButton
          icon="🕊"
          label="FLY"
          tooltip="FLY\nRight-click a point to fly there"
          onClick={() => {
            armFlyTargeting();
            updateHUD();
          }}
        />
      )}
    </ActionsGridDiv>
  );
}

/* ── HQ command grid (Imperial Guard) ────────────────────────────────── */

function HQActions() {
  const id = selBuildings[0];
  const building = world.get(id, 'building');
  if (!building || building.type !== 'hq') return null;

  const factionKey = entityFaction(building);
  const faction = FACTIONS[factionKey];
  const structureConfig = getStructureConfig(factionKey, 'hq') || {};
  const addons = structureConfig.addons || [];
  const production = structureConfig.production || [];
  const factionIcons = faction?.icons || {};

  const train = (item) => {
    const cost = item.cost || COSTS[item.name];
    const total = item.time || PROD_TIME[item.name] || 4;
    if (building.queue.length >= 6 || building.constructing || requisition < cost) return;
    if (window._multiplayerMode) {
      netTrainUnit(id, item.name);
    } else {
      setRequisition(requisition - cost);
      building.queue.push({ type: item.name, progress: 0, total });
    }
    updateHUD();
  };

  const payAddon = (key) => {
    buildAddon(id, key);
    updateHUD();
  };

  const prodItem = (name) => production.find((p) => p.name === name);

  const unitBtn = (name) => {
    const item = prodItem(name);
    const icon = item?.icon || factionIcons[name] || '❓';
    const cost = item?.cost || COSTS[name];
    return (
      <ActionButton
        key={`unit_${name}`}
        icon={icon}
        label={name === 'builder' ? workerDisplayName(factionKey) : name.toUpperCase()}
        cost={`${cost}R`}
        tooltip={unitTooltip(item || { name }, factionKey)}
        disabled={building.queue.length >= 6 || building.constructing || requisition < cost}
        onClick={() => train(item)}
      />
    );
  };

  const addonBtn = (key, label) => {
    const cfg = addons.find((a) => a.name === key);
    if (!cfg) return <CommandEmptySlot key={key} />;
    const built = building.addons.includes(key);
    const blocked = building.constructing || requisition < cfg.cost || (cfg.requiresTier && building.tier < cfg.requiresTier);
    return (
      <ActionButton
        key={`addon_${key}`}
        icon={cfg.icon}
        label={built ? `${label}\nBUILT` : label}
        cost={built ? undefined : `${cfg.cost}R`}
        tooltip={addonTooltip(cfg)}
        disabled={built || blocked}
        style={built ? { borderColor: '#44ff88' } : undefined}
        onClick={() => payAddon(key)}
      />
    );
  };

  const templeBtn = (templeKey, unlockName) => {
    if (building.addons.includes(templeKey)) {
      const item = prodItem(unlockName);
      if (item) return unitBtn(unlockName);
      return <CommandEmptySlot key={`temple_${templeKey}`} />;
    }
    return addonBtn(templeKey, `${templeKey.replace(/_/g, ' ').toUpperCase()}\n→ ${unlockName.toUpperCase()}`);
  };

  const buttons = [];
  buttons.push(unitBtn('guardsmen'));
  buttons.push(unitBtn('builder'));
  buttons.push(<CommandEmptySlot key="c0" />);
  buttons.push(<CommandEmptySlot key="d0" />);
  buttons.push(unitBtn('commissar'));
  buttons.push(templeBtn('telepathica_temple', 'psyker'));
  buttons.push(templeBtn('ministorum_temple', 'priest'));
  buttons.push(templeBtn('vindicare_temple', 'vindicare'));
  buttons.push(addonBtn('battle_command', 'BATTLE COMMAND\nTIER 2'));
  buttons.push(<CommandEmptySlot key="b2" />);
  buttons.push(<CommandEmptySlot key="c2" />);
  buttons.push(addonBtn('long_range_scanner', 'LONG RANGE\nSCANNER'));

  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Infantry Command grid (Imperial Guard) ──────────────────────────── */

function InfantryCommandActions() {
  const id = selBuildings[0];
  const building = world.get(id, 'building');
  if (!building || building.type !== 'infantry_command') return null;

  const factionKey = entityFaction(building);
  const faction = FACTIONS[factionKey];
  const structureConfig = getStructureConfig(factionKey, 'infantry_command') || {};
  const production = structureConfig.production || [];
  const factionIcons = faction?.icons || {};

  const train = (item) => {
    const cost = item.cost || COSTS[item.name];
    const total = item.time || PROD_TIME[item.name] || 4;
    if (building.queue.length >= 6 || building.constructing || requisition < cost) return;
    if (window._multiplayerMode) {
      netTrainUnit(id, item.name);
    } else {
      setRequisition(requisition - cost);
      building.queue.push({ type: item.name, progress: 0, total });
    }
    updateHUD();
  };

  const prodItem = (name) => production.find((p) => p.name === name);

  const unitBtn = (name) => {
    const item = prodItem(name);
    if (!item) return <CommandEmptySlot key={`unit_${name}`} />;
    const cost = item.cost || COSTS[item.name];
    return (
      <ActionButton
        key={`unit_${name}`}
        icon={item.icon || factionIcons[name] || '❓'}
        label={name.toUpperCase().replace(/_/g, ' ')}
        cost={`${cost}R`}
        tooltip={unitTooltip(item, factionKey)}
        disabled={building.queue.length >= 6 || building.constructing || requisition < cost}
        onClick={() => train(item)}
      />
    );
  };

  const buttons = [];
  buttons.push(unitBtn('guardsmen'));
  buttons.push(unitBtn('heavy_weapons_team'));
  buttons.push(unitBtn('kasrkin'));
  buttons.push(unitBtn('ogryn'));
  buttons.push(unitBtn('command_squad'));
  buttons.push(<CommandEmptySlot key="b1" />);
  buttons.push(<CommandEmptySlot key="c1" />);
  buttons.push(<CommandEmptySlot key="d1" />);
  buttons.push(<CommandEmptySlot key="a2" />);
  buttons.push(<CommandEmptySlot key="b2" />);
  buttons.push(<CommandEmptySlot key="c2" />);
  buttons.push(<CommandEmptySlot key="d2" />);

  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Mechanized Command grid (Imperial Guard) ────────────────────────── */

function MechanizedActions() {
  const id = selBuildings[0];
  const building = world.get(id, 'building');
  if (!building || building.type !== 'mechanized') return null;

  const factionKey = entityFaction(building);
  const cfg = getStructureConfig(factionKey, 'mechanized') || {};
  const production = cfg.production || [];
  const researchList = cfg.research || [];
  const byKey = {};
  researchList.forEach((r) => { byKey[r.key] = r; });
  const researchingItem = building.researchQueue?.[0] || null;

  const train = (item) => {
    const cost = item.cost || COSTS[item.name];
    const total = item.time || PROD_TIME[item.name] || 5;
    if (building.queue.length >= 6 || building.constructing || requisition < cost) return;
    if (window._multiplayerMode) {
      netTrainUnit(id, item.name);
    } else {
      setRequisition(requisition - cost);
      building.queue.push({ type: item.name, progress: 0, total });
    }
    updateHUD();
  };

  const lockedBy = (item) => (item.requires || []).filter((req) => !researchedTech.has(req));

  const prodBtn = (name) => {
    const item = production.find((p) => p.name === name);
    if (!item) return <CommandEmptySlot key={`mech-${name}`} />;
    const cost = item.cost || COSTS[item.name];
    const locked = lockedBy(item);
    const disabled = building.queue.length >= 6 || building.constructing || requisition < cost || locked.length > 0;
    return (
      <ActionButton
        key={`mech-${name}`}
        icon={item.icon}
        label={locked.length ? `${name.toUpperCase().replace(/_/g, ' ')}\n🔒 ${locked.join(' ').replace(/_/g, ' ')}` : name.toUpperCase().replace(/_/g, ' ')}
        cost={`${cost}R`}
        tooltip={unitTooltip(item, factionKey)}
        disabled={disabled}
        onClick={() => train(item)}
      />
    );
  };

  const startResearch = (r) => {
    if (window._multiplayerMode) return;
    if (building.constructing) return;
    if (building.researchQueue.length > 0) return;
    if (researchedTech.has(r.key)) return;
    if (requisition < r.cost || energy < r.power) return;
    setRequisition(requisition - r.cost);
    setEnergy(energy - r.power);
    building.researchQueue.push({ key: r.key, progress: 0, total: r.time });
    updateHUD();
  };

  const researchBtn = (r) => {
    if (!r) return <CommandEmptySlot key="mech-research-empty" />;
    const researched = researchedTech.has(r.key);
    const researching = building.researchQueue.some((q) => q.key === r.key);
    const disabled = researched || researching || building.constructing
      || building.researchQueue.length > 0 || requisition < r.cost || energy < r.power;
    const pct = researchingItem && researchingItem.key === r.key ? Math.min(100, (researchingItem.progress / researchingItem.total) * 100) : 0;
    return (
      <div key={`mech-research-${r.key}`} style={{ position: 'relative' }}>
        <ActionButton
          icon={r.icon}
          label={researched ? `${r.name}\nRESEARCHED` : r.name}
          cost={`${r.cost}R/${r.power}P`}
          disabled={disabled}
          style={researched ? { borderColor: '#44ff88' } : undefined}
          onClick={() => startResearch(r)}
        />
        {researching ? (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, height: 3,
              background: '#ffcc44', width: `${pct}%`, transition: 'width .1s', zIndex: 5,
            }}
          />
        ) : null}
      </div>
    );
  };

  const buttons = [];
  buttons.push(prodBtn('chimera'));
  buttons.push(prodBtn('sentinel'));
  buttons.push(prodBtn('hellhound'));
  buttons.push(prodBtn('basilisk'));
  buttons.push(prodBtn('marauder_bomber'));
  buttons.push(prodBtn('leman_russ_battle_tank'));
  buttons.push(<CommandEmptySlot key="mech-c1" />);
  buttons.push(<CommandEmptySlot key="mech-d1" />);
  buttons.push(researchBtn(byKey['full_scale_war']));
  buttons.push(<CommandEmptySlot key="mech-b2" />);
  buttons.push(<CommandEmptySlot key="mech-c2" />);
  buttons.push(<CommandEmptySlot key="mech-d2" />);
  buttons.push(
    <DemolishButton
      key="demolish"
      label="DEMOLISH"
      confirmText="Demolish this building?"
      onClick={() => {
        if (window._multiplayerMode) netDemolishBuilding(id);
        else demolishBuilding(id);
      }}
    />,
  );

  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Tactica Control research grid (Imperial Guard) ──────────────────── */

function ResearchTooltip({ r, researched, available, hovered }) {
  if (!hovered) return null;
  const reqText = (r.requires || []).map((req) => `Requires: ${req.replace(/_/g, ' ')}`).join('\n');
  return (
    <div
      style={{
        position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, width: 190, marginBottom: 6, padding: '6px 8px',
        background: 'rgba(5, 8, 18, 0.97)', border: `1px solid ${researched ? '#44ff88' : 'rgba(80, 200, 255, 0.5)'}`,
        borderRadius: 3, pointerEvents: 'none', whiteSpace: 'pre-line',
        fontSize: 8, letterSpacing: '.06em', color: '#cfd8ff', textAlign: 'left', lineHeight: 1.45,
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 'bold', color: researched ? '#44ff88' : '#fff', marginBottom: 3 }}>
        {r.name}{researched ? ' ✓' : ''}
      </div>
      <div style={{ color: '#8fd0ff' }}>{r.desc}</div>
      <div style={{ marginTop: 3, color: '#ffcc44' }}>COST: {r.cost}<CostGlyph req />{r.power != null ? <> / {r.power}<CostGlyph /></> : null}</div>
      <div style={{ color: '#9fb0d8' }}>TIME: {r.time}s</div>
      {reqText ? <div style={{ color: available ? '#9fb0d8' : '#ff8866' }}>{reqText}</div> : null}
    </div>
  );
}

function TacticaActions() {
  const id = selBuildings[0];
  const structure = world.get(id, 'structure');
  if (!structure || structure.type !== 'tactica_control') return null;
  const [hoveredKey, setHoveredKey] = React.useState(null);

  const cfg = getStructureConfig(entityFaction(structure), 'tactica_control') || {};
  const researchList = cfg.research || [];
  const byKey = {};
  researchList.forEach((r) => { byKey[r.key] = r; });

  const hqAddons = world.query('building').reduce((acc, bid) => {
    const b = world.get(bid, 'building');
    if (b && b.team === PLAYER) {
      (b.addons || []).forEach((a) => acc.add(a));
    }
    return acc;
  }, new Set());

  const reqMet = (r) => (r.requires || []).every((req) => {
    if (byKey[req]) return researchedTech.has(req);
    return hqAddons.has(req);
  });

  const researchingItem = structure.researchQueue?.[0] || null;

  const startResearch = (r) => {
    if (window._multiplayerMode) return;
    if (structure.constructing) return;
    if (structure.researchQueue.length > 0) return;
    if (researchedTech.has(r.key)) return;
    if (requisition < r.cost || energy < r.power) return;
    if (!reqMet(r)) return;
    setRequisition(requisition - r.cost);
    setEnergy(energy - r.power);
    structure.researchQueue.push({ key: r.key, progress: 0, total: r.time });
    updateHUD();
  };

  const SLOT_ORDER = [
    'death_before_dishonor', 'battle_armor', 'c0', 'uncommon_valor',
    'satellite_targeting', 'will_of_the_emperor', 'c1', 'weapon_specialization',
    'genetic_enhancement', 'kasrkin_armor', 'powered_bayonets', 'infiltration_research',
  ];

  const buttons = SLOT_ORDER.map((slot) => {
    if (slot.startsWith('c')) return <CommandEmptySlot key={slot} />;
    const r = byKey[slot];
    if (!r) return <CommandEmptySlot key={slot} />;
    const researched = researchedTech.has(r.key);
    const researching = structure.researchQueue.some((q) => q.key === r.key);
    const available = reqMet(r);
    const disabled = researched || researching || structure.constructing
      || structure.researchQueue.length > 0 || requisition < r.cost || energy < r.power || !available;
    const pct = researchingItem && researchingItem.key === r.key ? Math.min(100, (researchingItem.progress / researchingItem.total) * 100) : 0;
    const hovered = hoveredKey === r.key;
    return (
      <div
        key={slot}
        style={{ position: 'relative' }}
        onMouseEnter={() => setHoveredKey(r.key)}
        onMouseLeave={() => setHoveredKey(null)}
      >
        <ActionButton
          icon={r.icon}
          label={researched ? `${r.name}\nRESEARCHED` : r.name}
          cost={`${r.cost}R/${r.power}P`}
          disabled={disabled}
          style={researched ? { borderColor: '#44ff88' } : undefined}
          onClick={() => startResearch(r)}
        />
        {researching ? (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, height: 3,
              background: '#ffcc44', width: `${pct}%`, transition: 'width .1s', zIndex: 5,
            }}
          />
        ) : null}
        <ResearchTooltip r={r} researched={researched} available={available} hovered={hovered} />
      </div>
    );
  });

  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Listening Post upgrades (Imperial Guard) ────────────────────────── */

function ListeningPostActions() {
  const sp = world.get(selListeningPost, 'strategicPoint');
  if (!sp) return null;

  const cfg = getStructureConfig(entityFaction(sp), 'listening_post') || {};
  const addons = cfg.addons || [];
  const byKey = {};
  addons.forEach((a) => { byKey[a.name] = a; });

  const researchingItem = sp.researchQueue?.[0] || null;

  const startUpgrade = (a) => {
    if (window._multiplayerMode) return;
    if (sp.researchQueue.length > 0) return;
    if (sp.lpTier >= a.tier) return;
    if (sp.lpTier < (a.requiresTier || 1)) return;
    if (requisition < a.cost || energy < a.power) return;
    setRequisition(requisition - a.cost);
    setEnergy(energy - a.power);
    sp.researchQueue.push({ key: a.name, progress: 0, total: a.time });
    updateHUD();
  };

  const upgradeBtn = (a, slotKey) => {
    if (!a) return <CommandEmptySlot key={slotKey} />;
    const done = sp.lpTier >= a.tier;
    const researching = researchingItem && researchingItem.key === a.name;
    const disabled = done || researching || sp.researchQueue.length > 0
      || sp.lpTier < (a.requiresTier || 1) || requisition < a.cost || energy < a.power;
    const pct = researching ? Math.min(100, (researchingItem.progress / researchingItem.total) * 100) : 0;
    return (
      <div key={slotKey} style={{ position: 'relative' }}>
        <ActionButton
          icon={a.icon}
          label={done ? `${a.name.replace(/_/g, ' ').toUpperCase()}\nRESEARCHED` : a.name.replace(/_/g, ' ').toUpperCase()}
          cost={`${a.cost}R/${a.power}P`}
          tooltip={addonTooltip(a)}
          disabled={disabled}
          style={done ? { borderColor: '#44ff88' } : undefined}
          onClick={() => startUpgrade(a)}
        />
        {researching ? (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, height: 3,
              background: '#ffcc44', width: `${pct}%`, transition: 'width .1s', zIndex: 5,
            }}
          />
        ) : null}
      </div>
    );
  };

  const buttons = [];
  buttons.push(upgradeBtn(byKey['fortified_position'], 'lp-tier1'));
  buttons.push(upgradeBtn(byKey['heavily_fortified_position'], 'lp-tier2'));
  for (let i = buttons.length; i < 12; i += 1) {
    buttons.push(<CommandEmptySlot key={`lp-slot-${i}`} />);
  }
  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}

/* ── Dispatcher ──────────────────────────────────────────────────────── */

export function ActionsGrid() {
  const view = getViewKind();

  if (view === 'builder') return <BuilderActions />;
  if (view === 'airfield') return <AirfieldActions />;
  if (view === 'listening_post') return <ListeningPostActions />;
  if (view === 'building') {
    const b = world.get(selBuildings[0], 'building');
    const s = world.get(selBuildings[0], 'structure');
    if (b?.type === 'hq') return <HQActions />;
    if (b?.type === 'infantry_command') return <InfantryCommandActions />;
    if (b?.type === 'mechanized') return <MechanizedActions />;
    if (s?.type === 'tactica_control') return <TacticaActions />;
    return <BuildingActions />;
  }
  if (view === 'buildings') return <MultiBuildingActions />;
  if (view === 'jet') return <JetActions />;
  if (view === 'squad' || view === 'squads') return <SquadActions />;
  return <ActionsGridDiv />;
}
