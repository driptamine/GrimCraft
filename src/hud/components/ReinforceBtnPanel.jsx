import { world, requisition, setRequisition, SQUAD_MAX, COSTS } from '../../scene.js';
import { updateHUD } from '../../hud.js';
import { applySquadWeaponVisuals } from '../../entities.js';
import { netSetProjectileType } from '../../multiplayer.js';
import { computeSquadData } from '../data.js';
import { CompactReinforceButton, AmmoButton, Tooltip } from '../bits.jsx';
import {
  ReinforceBtnPanel, ReinforceBtnRow, ReinforceBtnLabel, SergeantSlot, AmmoPanel,
} from '../primitives.jsx';

function SergeantSlotView({ data }) {
  const sgtCost = COSTS.reinforce;
  const canAddSgt = requisition >= sgtCost && !data.sgtSoldier && !data.sgtQueued;

  let cls = '';
  let icon = '⭐';
  let barWidth = '0%';
  let barColor = '#ffe066';
  if (data.sgtSoldier) {
    cls = 'alive';
    const hpPct = Math.max(0, Math.min(100, (data.sgtSoldier.hp / data.sgtSoldier.maxHp) * 100));
    barWidth = `${hpPct}%`;
    barColor = hpPct > 50 ? '#ffe066' : '#ff8844';
  } else if (data.sgtQueued) {
    cls = 'queued';
    icon = '⏳';
  }

  const addSergeant = () => {
    for (let i = 0; i < data.alive.length; i += 1) {
      const sqId = data.alive[i];
      const sq = world.get(sqId, 'squad');
      if (sq && !sq.reinforceQueue.some((q) => q.formIdx === 0)) {
        setRequisition(requisition - sgtCost);
        sq.reinforceQueue.unshift({ formIdx: 0 });
        break;
      }
    }
    updateHUD();
  };

  return (
    <Tooltip
      content={
        `SERGEANT (SLOT 0)\n${data.sgtSoldier ? 'Squad leader present' : data.sgtQueued ? 'Sergeant training…' : `Cost ${sgtCost}R — reinforce squad leader`}`
      }
    >
      <SergeantSlot
        className={cls}
        style={{ cursor: canAddSgt ? 'pointer' : 'default' }}
        onClick={canAddSgt ? addSergeant : undefined}
      >
        {data.sgtQueued ? icon : <img src="assets/icons/Imperial Guard/Units/Basic/guard_sargeant_icon.png" alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />}
        <span className="sgt-label">SGT</span>
        {data.sgtSoldier ? <div className="sgt-bar" style={{ width: barWidth, background: barColor }} /> : <div className="sgt-bar" style={{ width: barWidth }} />}
      </SergeantSlot>
    </Tooltip>
  );
}

function AmmoSubPanel({ data }) {
  if (data.alive.length === 0) {
    return null;
  }

  const addGrenadier = () => {
    for (let i = 0; i < data.alive.length; i += 1) {
      const sqId = data.alive[i];
      const sq = world.get(sqId, 'squad');
      if (!sq) continue;
      const grenadierCount = sq.soldiers.filter((sid) => sid && world.has(sid, 'soldier') && world.get(sid, 'soldier').isGrenadier).length;
      if (grenadierCount + sq.grenadeQueue.length < 5) {
        const target = sq.soldiers.find((sid) => sid && world.has(sid, 'soldier') && !world.get(sid, 'soldier').isGrenadier && !sq.grenadeQueue.some((q) => q.solId === sid));
        if (target) {
          setRequisition(requisition - data.glCost);
          sq.grenadeQueue.push({ solId: target });
          break;
        }
      }
    }
    updateHUD();
  };

  const setProjectile = (pt) => {
    data.alive.forEach((sqId) => {
      const sq = world.get(sqId, 'squad');
      if (sq) {
        sq.projectileType = pt;
        applySquadWeaponVisuals(world, sqId);
        if (window._multiplayerMode) netSetProjectileType(sqId, pt.charAt(0).toUpperCase() + pt.slice(1));
      }
    });
    updateHUD();
  };

  return (
    <AmmoPanel>
      <AmmoButton icon="assets/icons/Imperial Guard/Units/Abilities/guard_upgrade_grenade_launcher.png" label="" cost={`${data.glCost}R`} disabled={!data.canAddGL} tooltip={`GRENADE LAUNCHER\nCost ${data.glCost}R — upgrade one soldier to a grenadier`} onClick={addGrenadier} />
      <AmmoButton
        icon="assets/icons/Space Marines/Buildings/Economy/guard_upgrade_plasma_gun.png"
        label="PLASMA"
        disabled={false}
        tooltip="WEAPON: PLASMA\nSwitch squad weapons to plasma projectiles"
        style={{
          border: data.curPtSq === 'plasma' ? '1px solid #ff4444' : '1px solid rgba(255,68,68,0.22)',
          opacity: data.curPtSq === 'plasma' ? 1 : 0.55,
        }}
        onClick={() => setProjectile('plasma')}
      />
      <AmmoButton
        icon="assets/icons/Imperial Guard/Buildings/Economy/guard_squad_kasrkin_plasma.png"
        label="PLASMA FINAL"
        disabled={false}
        tooltip="WEAPON: PLASMA FINAL\nSwitch squad weapons to heavy plasma-final projectiles"
        style={{
          border: data.curPtSq === 'plasma-final' ? '1px solid #ff4444' : '1px solid rgba(255,68,68,0.22)',
          opacity: data.curPtSq === 'plasma-final' ? 1 : 0.55,
        }}
        onClick={() => setProjectile('plasma-final')}
      />
      <AmmoButton
        icon="🔴"
        label="BEAM"
        disabled={false}
        tooltip="WEAPON: BEAM\nSwitch squad weapons to beam projectiles"
        style={{
          border: data.curPtSq === 'beam' ? '1px solid #ff4444' : '1px solid rgba(255,68,68,0.22)',
          opacity: data.curPtSq === 'beam' ? 1 : 0.55,
        }}
        onClick={() => setProjectile('beam')}
      />
      <AmmoButton
        icon="🔶"
        label="BULLET"
        disabled={false}
        tooltip="WEAPON: BULLET\nSwitch squad weapons to bullet projectiles"
        style={{
          border: data.curPtSq === 'bullet' ? '1px solid #ff4444' : '1px solid rgba(255,68,68,0.22)',
          opacity: data.curPtSq === 'bullet' ? 1 : 0.55,
        }}
        onClick={() => setProjectile('bullet')}
      />
    </AmmoPanel>
  );
}

export function ReinforceButtonsPanel() {
  const data = computeSquadData();

  const reinforceAdd = () => {
    if (requisition < data.reinCost) return;
    let added = 0;
    for (let j = 0; j < data.alive.length; j += 1) {
      const sqId = data.alive[j];
      const sq = world.get(sqId, 'squad');
      if (!sq) continue;
      const aliveSols = sq.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier'));
      const occupied = new Set([
        ...aliveSols.map((sid) => {
          const sol = world.get(sid, 'soldier');
          return sol ? sol.formIdx : -1;
        }),
        ...sq.reinforceQueue.map((q) => q.formIdx),
      ]);
      for (let i = 1; i < SQUAD_MAX; i += 1) {
        if (!occupied.has(i)) {
          setRequisition(requisition - data.reinCost);
          sq.reinforceQueue.push({ formIdx: i });
          added += 1;
          break;
        }
      }
      if (added > 0) break;
    }
    updateHUD();
  };

  const toggleAuto = () => {
    const newVal = !data.autoOn;
    data.alive.forEach((sqId) => {
      const sq = world.get(sqId, 'squad');
      if (sq) sq.autoReinforce = newVal;
    });
    updateHUD();
  };

  const autoStyle = data.autoOn
    ? { borderColor: '#44ff88', color: '#44ff88', background: 'rgba(68,255,136,0.12)' }
    : undefined;

  return (
    <ReinforceBtnPanel>
      <ReinforceBtnLabel>REINFORCE</ReinforceBtnLabel>
      <ReinforceBtnRow>
        <CompactReinforceButton
          icon="assets/command_icons/reinforce.png"
          label={data.autoOn ? 'AUTO REINF' : 'REINFORCE'}
          cost={`${data.reinCost}R`}
          tooltip={`REINFORCE\nCost ${data.reinCost}R — add a soldier to the squad\nRight-click to toggle auto-reinforce`}
          disabled={!(requisition >= data.reinCost || data.autoOn)}
          style={autoStyle}
          onClick={reinforceAdd}
          onRightClick={toggleAuto}
        />
        <SergeantSlotView data={data} />
      </ReinforceBtnRow>
      <AmmoSubPanel data={data} />
    </ReinforceBtnPanel>
  );
}
