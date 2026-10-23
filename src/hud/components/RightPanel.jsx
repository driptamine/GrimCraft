import { world, PLAYER, attackMode, SQUAD_SCATTER, setAttackMode, onScatterInput } from '../../scene.js';
import { getViewKind, getAliveGroups } from '../data.js';
import { updateHUD } from '../../hud.js';
import {
  RightPanel, RightBtn, AttackModeToggle, AtkModeLabel, AtkModeBtn, ScatterRow, ScatterVal,
} from '../primitives.jsx';

function stopSelected() {
  const view = getViewKind();
  const { squads, apcs, vehicles, jets } = getAliveGroups();
  if (view === 'jet') {
    jets.forEach((jid) => {
      const j = world.get(jid, 'jet');
      if (j) {
        j.waitOrders = true;
        j.moveOrder = null;
        j.strafe = null;
      }
    });
  } else if (view === 'apc') {
    apcs.forEach((id) => {
      const a = world.get(id, 'apc');
      if (a) a.moveOrder = null;
    });
  } else if (view === 'vehicle') {
    vehicles.forEach((id) => {
      const v = world.get(id, 'vehicle');
      if (v) v.moveOrder = null;
    });
  } else if (view === 'squad' || view === 'squads') {
    squads.forEach((sqId) => {
      const sq = world.get(sqId, 'squad');
      if (sq) {
        sq.moveOrder = null;
        sq.stopped = true;
      }
    });
  }
  updateHUD();
}

function attackSelected() {
  const { squads } = getAliveGroups();
  squads.forEach((sqId) => {
    const sq = world.get(sqId, 'squad');
    if (!sq) return;
    let nearest = null;
    let nDist = Infinity;
    world.query('squad').forEach((eid) => {
      const esq = world.get(eid, 'squad');
      if (!esq || esq.team === PLAYER) return;
      const dist = sq.position.distanceTo(esq.position);
      if (dist < nDist) {
        nDist = dist;
        nearest = esq;
      }
    });
    if (nearest) {
      sq.moveOrder = nearest.position.clone();
      sq.stopped = false;
    }
  });
  updateHUD();
}

export function RightPanelCmp() {
  const view = getViewKind();
  const hasUnits = view === 'squad' || view === 'squads' || view === 'jet' || view === 'apc' || view === 'vehicle';

  return (
    <RightPanel>
      <RightBtn className="attack-btn" title="Attack Move" disabled={!hasUnits} onClick={attackSelected}>
        <span className="rb-icon">⚔</span>ATTACK
      </RightBtn>
      <RightBtn className="stop-btn" title="Stop (Q)" disabled={!hasUnits} onClick={stopSelected}>
        <span className="rb-icon">⏹</span>STOP
      </RightBtn>
      <AttackModeToggle>
        <AtkModeLabel>MODE</AtkModeLabel>
        <AtkModeBtn className={attackMode === 'ranged' ? 'active' : ''} title="Ranged — hold position and shoot" onClick={() => setAttackMode('ranged')}>
          🎯 RANGE
        </AtkModeBtn>
        <AtkModeBtn className={attackMode === 'melee' ? 'active' : ''} title="Melee — charge into enemy" onClick={() => setAttackMode('melee')}>
          ⚔ MELEE
        </AtkModeBtn>
      </AttackModeToggle>
      <ScatterRow>
        <label>◈ SCAT</label>
        <input
          type="range"
          min="0.4"
          max="4.0"
          step="0.1"
          value={SQUAD_SCATTER}
          onChange={(e) => onScatterInput(e.target.value)}
        />
        <ScatterVal>{SQUAD_SCATTER.toFixed(1)}x</ScatterVal>
      </ScatterRow>
    </RightPanel>
  );
}
