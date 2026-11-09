import type { JSX } from 'react';
import { world, canCommand, requisition, setRequisition, energy, setEnergy, COSTS } from '../../core/scene.js';
import { reinforceSelectedSquads } from '../../core/reinforce.js';
import { updateHUD } from '../../core/hud.js';
import { applySquadWeaponVisuals } from '../../entities/entities.js';
import { netPlasmaUpgrade, netSetProjectileType } from '../../net/multiplayer.js';
import { computeSquadData } from '../data.js';
import { CompactReinforceButton, AmmoButton, Tooltip } from '../bits.jsx';
import {
  ReinforceBtnPanel, ReinforceBtnRow, ReinforceBtnLabel, SergeantSlot, AmmoPanel,
} from '../primitives.jsx';
import { assetUrl } from '../../render/assets.js';
import { R2Img } from '../bits.jsx';
import { PLASMA_CLOUD_PUFF } from '../../fx/plasma-cloud-puff.js';
import plasmaCloudPuffIcon from '../../../assets/command_icons/plasma_cloud_puff.svg?url';
import { isPlasmaPuffPreviewOpen, togglePlasmaPuffPreview } from '../../ui/plasma-puff-preview.js';

function SergeantSlotView({ data }: any): JSX.Element {
  const sgtCost = data.sgtCost ?? COSTS.reinforce;
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
      if (sq && !sq.reinforceQueue.some((q: any) => q.formIdx === 0)) {
        const cost = sq.sergeantCost ?? sgtCost;
        if (requisition < cost) return;
        setRequisition(requisition - cost);
        sq.reinforceQueue.unshift({ formIdx: 0, cost, time: sq.sergeantTime ?? data.sgtTime ?? 7 });
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
        {data.sgtQueued ? icon : <R2Img src={assetUrl('assets/icons/Imperial Guard/Units/Basic/guard_sargeant_icon.png')} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />}
        <span className="sgt-label">SGT</span>
        {data.sgtSoldier ? <div className="sgt-bar" style={{ width: barWidth, background: barColor }} /> : <div className="sgt-bar" style={{ width: barWidth }} />}
      </SergeantSlot>
    </Tooltip>
  );
}

function AmmoSubPanel({ data }: any): JSX.Element | null {
  if (data.alive.length === 0) {
    return null;
  }
  const puffSquads = data.alive.filter((id: number) => {
    const squad = world.get(id, 'squad');
    return squad && canCommand(squad.team) && (squad.faction || 'ig') === 'ig'
      && (!squad.unitType || squad.unitType === 'guardsmen');
  });

  const addGrenadier = () => {
    for (let i = 0; i < data.alive.length; i += 1) {
      const sqId = data.alive[i];
      const sq = world.get(sqId, 'squad');
      if (!sq) continue;
      const grenadierCount = sq.soldiers.filter((sid: any) => sid && world.has(sid, 'soldier') && world.get(sid, 'soldier').isGrenadier).length;
      if (grenadierCount + sq.grenadeQueue.length < 5) {
        const target = sq.soldiers.find((sid: any) => sid && world.has(sid, 'soldier') && !world.get(sid, 'soldier').isGrenadier && !sq.grenadeQueue.some((q: any) => q.solId === sid));
        if (target) {
          setRequisition(requisition - data.glCost);
          sq.grenadeQueue.push({ solId: target });
          break;
        }
      }
    }
    updateHUD();
  };

  const addPlasma = () => {
    for (let i = 0; i < data.alive.length; i += 1) {
      const sqId = data.alive[i];
      const sq = world.get(sqId, 'squad');
      if (!sq) continue;
      const plasmaCount = sq.soldiers.filter((sid: any) => sid && world.has(sid, 'soldier') && world.get(sid, 'soldier').projectileType === 'plasma').length;
      if (plasmaCount + (sq.plasmaQueue || []).length >= 5) continue;
      const target = sq.soldiers.find((sid: any) => {
        if (!sid || !world.has(sid, 'soldier')) return false;
        const sol = world.get(sid, 'soldier');
        if (sol.isGrenadier || sol.projectileType === 'plasma') return false;
        if ((sq.plasmaQueue || []).some((q: any) => q.solId === sid)) return false;
        if ((sq.grenadeQueue || []).some((q: any) => q.solId === sid)) return false;
        return true;
      });
      if (target) {
        setRequisition(requisition - data.plCost);
        setEnergy(energy - data.plEnergyCost);
        sq.plasmaQueue.push({ solId: target });
        if (window._multiplayerMode) netPlasmaUpgrade(sqId, target);
        break;
      }
    }
    updateHUD();
  };

  const setProjectile = (pt: string) => {
    data.alive.forEach((sqId: number) => {
      if (pt === PLASMA_CLOUD_PUFF && !puffSquads.includes(sqId)) return;
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
        disabled={!data.canAddPL}
        cost={`${data.plCost}R`}
        tooltip={`WEAPON UPGRADE: PLASMA\nCost ${data.plCost}R ${data.plEnergyCost}E — upgrade one soldier to plasma (max 5 per squad)`}
        style={{
          border: data.curPtSq === 'plasma' || data.hasPlasma ? '1px solid #ff4444' : '1px solid rgba(255,68,68,0.22)',
          opacity: data.curPtSq === 'plasma' || data.hasPlasma ? 1 : 0.55,
        }}
        onClick={addPlasma}
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
      {puffSquads.length > 0 && <AmmoButton
        icon={plasmaCloudPuffIcon}
        label="PLASMA CLOUD PUFF"
        disabled={false}
        tooltip="WEAPON: PLASMA CLOUD PUFF\nSeven small plasma clouds pierced by a blue beam\nThree lengths along the flight: 20%, 40%, 60% of soldier height"
        style={{
          border: data.curPtSq === PLASMA_CLOUD_PUFF ? '1px solid #879eff' : '1px solid rgba(135,158,255,0.22)',
          opacity: data.curPtSq === PLASMA_CLOUD_PUFF ? 1 : 0.55,
        }}
        onClick={() => setProjectile(PLASMA_CLOUD_PUFF)}
      />}
      {puffSquads.length > 0 && <AmmoButton
        icon="🔍"
        label={isPlasmaPuffPreviewOpen() ? 'CLOSE PREVIEW' : 'VIEW PUFFS'}
        disabled={false}
        tooltip="VIEW PLASMA CLOUD PUFF\nInspect all seven stationary projectiles up close\nMouse wheel: zoom · Alt + drag: orbit · Esc: close"
        style={{ borderColor: isPlasmaPuffPreviewOpen() ? '#879eff' : undefined }}
        onClick={togglePlasmaPuffPreview}
      />}
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

export function ReinforceButtonsPanel(): JSX.Element {
  const data = computeSquadData();

  const reinforceAdd = () => {
    reinforceSelectedSquads();
    updateHUD();
  };

  const toggleAuto = () => {
    const newVal = !data.autoOn;
    data.alive.forEach((sqId: number) => {
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
          tooltip={`REINFORCE\nCost ${data.reinCost}R — add a soldier to the squad\nRight-click to toggle auto-reinforce\nHotkey: R`}
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
