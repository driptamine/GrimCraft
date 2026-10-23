import { world, requisition, setRequisition, COSTS } from '../../scene.js';
import { updateHUD } from '../../hud.js';
import { computeSquadData } from '../data.js';
import { ReinforcePanel as ReinforcePanelCss, ReinforcePanelLabel, RpWrap, RpBar, RpFill, RpIcon, RpLabel, RpQueue, RqSlot } from '../primitives.jsx';

export function ReinforceProgressPanel() {
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
    const sq = world.get(active.sqId, 'squad');
    if (!sq) return;
    if (active.type === 'reinforce') {
      sq.reinforceQueue.shift();
      sq.reinforceProgress = 0;
      setRequisition(requisition + COSTS.reinforce);
    } else {
      sq.grenadeQueue.shift();
      sq.grenadeProgress = 0;
      setRequisition(requisition + COSTS.grenadeUpgrade);
    }
    updateHUD();
  };

  const cancelSlot = (q) => {
    const sq = world.get(q.sqId, 'squad');
    if (!sq) return;
    if (q.type === 'reinforce') {
      const idx = sq.reinforceQueue.findIndex((r) => r.formIdx === q.formIdx);
      if (idx !== -1) {
        sq.reinforceQueue.splice(idx, 1);
        setRequisition(requisition + COSTS.reinforce);
      }
    } else {
      const idx = sq.grenadeQueue.findIndex((r) => r.solId === q.solId);
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
      <RpWrap onClick={cancelActive} title={active.isGrenadier ? 'GRENADIER UPGRADE — click to cancel' : 'REINFORCE — click to cancel'}>
        <RpIcon>{active.isGrenadier ? '💥' : '🪖'}</RpIcon>
        <RpBar>
          <RpFill
            style={{
              width: `${Math.round(active.progress * 100)}%`,
              background: active.isGrenadier ? '#ff8c14' : '#50c8ff',
            }}
          />
        </RpBar>
        <RpLabel>{`${active.isGrenadier ? 'UPGRADING' : 'TRAINING'} ${Math.round(active.progress * 100)}%`}</RpLabel>
      </RpWrap>
      <RpQueue>
        {rest.map((q, i) => (
          <RqSlot key={i} className={q.isGrenadier ? 'grenadier' : ''} title={`${q.isGrenadier ? 'GRENADIER UPGRADE' : 'REINFORCE'} — click to cancel`} onClick={() => cancelSlot(q)}>
            {q.isGrenadier ? '💥' : '🪖'}
            <div style={{ fontSize: 7, color: 'rgba(80,200,255,0.6)', lineHeight: 1 }}>0%</div>
            <div className="rq-bar" style={{ width: '0%' }} />
          </RqSlot>
        ))}
      </RpQueue>
    </ReinforcePanelCss>
  );
}
