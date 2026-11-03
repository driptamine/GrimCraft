import type { JSX } from 'react';
import { world, requisition, setRequisition, energy, setEnergy, COSTS } from '../../core/scene.js';
import { updateHUD } from '../../core/hud.js';
import { computeSquadData, PLASMA_ENERGY_COST } from '../data.js';
import { ReinforcePanel as ReinforcePanelCss, ReinforcePanelLabel, RpWrap, RpBar, RpFill, RpIcon, RpLabel, RpQueue, RqSlot } from '../primitives.jsx';
import { assetUrl } from '../../render/assets.js';
import { R2Img } from '../bits.jsx';
import { reinforceQueueIcon } from '../queue-icons.js';

function upgradeName(q: { type: string; isGrenadier: boolean }): string {
  if (q.isGrenadier) return 'GRENADIER UPGRADE';
  if (q.type === 'plasma') return 'PLASMA UPGRADE';
  return 'REINFORCE';
}

export function ReinforceProgressPanel(): JSX.Element {
  const data = computeSquadData();

  if (data.allQueued.length === 0) {
    return (
      <ReinforcePanelCss>
        <ReinforcePanelLabel>REINFORCING</ReinforcePanelLabel>
        <RpQueue><div style={{ fontSize: 8, color: 'rgba(80,200,255,0.25)', letterSpacing: '.1em' }}>IDLE</div></RpQueue>
      </ReinforcePanelCss>
    );
  }

  const { active, rest } = data;

  const cancelActive = () => {
    if (!active) return;
    const sq = world.get(active.sqId, 'squad');
    if (!sq) return;
    if (active.type === 'reinforce') {
      sq.reinforceQueue.shift();
      sq.reinforceProgress = 0;
      setRequisition(requisition + (active.cost ?? sq.reinforceCost ?? COSTS.reinforce));
    } else if (active.type === 'plasma') {
      sq.plasmaQueue.shift();
      sq.plasmaProgress = 0;
      setRequisition(requisition + COSTS.plasmaUpgrade);
      setEnergy(energy + PLASMA_ENERGY_COST);
    } else {
      sq.grenadeQueue.shift();
      sq.grenadeProgress = 0;
      setRequisition(requisition + COSTS.grenadeUpgrade);
    }
    updateHUD();
  };

  const cancelSlot = (q: NonNullable<typeof active>) => {
    const sq = world.get(q.sqId, 'squad');
    if (!sq) return;
    if (q.type === 'reinforce') {
      const idx = sq.reinforceQueue.findIndex((r: any) => r.formIdx === q.formIdx);
      if (idx !== -1) {
        const item = sq.reinforceQueue[idx];
        sq.reinforceQueue.splice(idx, 1);
        setRequisition(requisition + (item?.cost ?? sq.reinforceCost ?? COSTS.reinforce));
      }
    } else if (q.type === 'plasma') {
      const idx = sq.plasmaQueue.findIndex((r: any) => r.solId === q.solId);
      if (idx !== -1) {
        sq.plasmaQueue.splice(idx, 1);
        setRequisition(requisition + COSTS.plasmaUpgrade);
        setEnergy(energy + PLASMA_ENERGY_COST);
      }
    } else {
      const idx = sq.grenadeQueue.findIndex((r: any) => r.solId === q.solId);
      if (idx !== -1) {
        sq.grenadeQueue.splice(idx, 1);
        setRequisition(requisition + COSTS.grenadeUpgrade);
      }
    }
    updateHUD();
  };

  return (
    <ReinforcePanelCss>
      <ReinforcePanelLabel>REINFORCING</ReinforcePanelLabel>
      <RpWrap onClick={cancelActive} title={active ? `${upgradeName(active)} — click to cancel` : ''}>
        <RpIcon>{active ? <R2Img src={assetUrl(reinforceQueueIcon(active))} alt="" style={{ width: 16, height: 16, objectFit: 'contain', display: 'block' }} /> : null}</RpIcon>
        <RpBar>
          <RpFill
            style={{
              width: `${Math.round((active?.progress || 0) * 100)}%`,
              background: active?.isGrenadier ? '#ff8c14' : '#50c8ff',
            }}
          />
        </RpBar>
        <RpLabel>{`${active && (active.isGrenadier || active.type === 'plasma') ? upgradeName(active) : 'TRAINING'} ${Math.round((active?.progress || 0) * 100)}%`}</RpLabel>
      </RpWrap>
      <RpQueue>
        {rest.map((q, i) => (
          <RqSlot key={i} className={q.isGrenadier ? 'grenadier' : ''} title={`${upgradeName(q)} — click to cancel`} onClick={() => cancelSlot(q)}>
            <R2Img src={assetUrl(reinforceQueueIcon(q))} alt="" style={{ width: 14, height: 14, objectFit: 'contain', display: 'block' }} />
            <div style={{ fontSize: 7, color: 'rgba(80,200,255,0.6)', lineHeight: 1 }}>0%</div>
            <div className="rq-bar" style={{ width: '0%' }} />
          </RqSlot>
        ))}
      </RpQueue>
    </ReinforcePanelCss>
  );
}
