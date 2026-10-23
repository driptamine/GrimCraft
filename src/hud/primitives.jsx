import { styled } from '@linaria/react';

/**
 * Linaria styled primitives. Each block is a port of the corresponding rule
 * that used to live in the inline <style> of index.html.
 */

/* ── Top bar ─────────────────────────────────────────────────────────── */
export const TopBarDiv = styled.div`
  position: fixed; top: 0; left: 0; right: 0; height: 42px;
  background: transparent; border-bottom: 1px solid rgba(80, 200, 255, 0.2);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 18px; pointer-events: none; z-index: 10;
`;

export const TbSection = styled.div`
  display: flex; align-items: center; gap: 16px;
`;

export const TbStat = styled.div`
  display: flex; align-items: center; gap: 5px; font-size: 11px; letter-spacing: .1em; color: #50c8ff;
  & .val { color: #fff; font-weight: bold; min-width: 24px; }
  & img { width: 14px; height: 14px; object-fit: contain; image-rendering: pixelated; }
`;

export const TbReq = styled(TbStat)`
  & .val { color: #ffe066; }
`;

export const TbSep = styled.div`
  width: 1px; height: 22px; background: rgba(80, 200, 255, 0.15);
`;

export const TbTitle = styled.div`
  font-size: 13px; letter-spacing: .3em; color: #fff; opacity: .7;
`;

export const TerrainSelect = styled.select`
  pointer-events: all; background: rgba(20, 35, 20, .9); border: 1px solid rgba(100, 200, 100, .4);
  color: #aaffaa; font-family: inherit; font-size: 10px; padding: 3px 6px; cursor: pointer; margin-right: 4px;
`;

export const ResetBtn = styled.button`
  pointer-events: all; background: rgba(255, 50, 50, .1); border: 1px solid rgba(255, 80, 80, .4); color: #ff6666;
  font-family: inherit; font-size: 10px; letter-spacing: .1em; padding: 4px 10px; cursor: pointer;
`;

export const InspectorBtn = styled.button`
  pointer-events: all; background: rgba(80, 200, 255, .1); border: 1px solid rgba(80, 200, 255, .4); color: #50c8ff;
  font-family: inherit; font-size: 10px; letter-spacing: .1em; padding: 4px 10px; cursor: pointer;
  &:disabled { opacity: .45; cursor: default; }
`;

export const ImmortalBtn = styled.button`
  pointer-events: all; background: rgba(255, 200, 60, .1); border: 1px solid rgba(255, 200, 60, .4); color: #ffcc44;
  font-family: inherit; font-size: 10px; letter-spacing: .1em; padding: 4px 10px; cursor: pointer;
  &.on { background: rgba(255, 200, 60, .28); border-color: #ffcc44; color: #fff; }
`;

/* ── HUD container ───────────────────────────────────────────────────── */
export const HudContainer = styled.div`
  position: fixed; bottom: 0; left: 0; right: 0; height: 160px;
  background: transparent; border-top: 1px solid rgba(80, 200, 255, 0.25);
  display: flex; z-index: 10; pointer-events: none;
`;

/* ── Panel 1: Minimap ───────────────────────────────────────────────── */
export const MinimapPanel = styled.div`
  width: 160px; min-width: 160px; border-right: 1px solid rgba(80, 200, 255, 0.12);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6px; gap: 4px; position: relative; pointer-events: all;
`;

export const MinimapCanvas = styled.canvas`
  width: 140px; height: 140px;
  background: rgba(4, 10, 20, 0.9);
  border: 1px solid rgba(80, 200, 255, 0.25);
  image-rendering: pixelated;
  display: block;
  cursor: pointer;
`;

export const MinimapLabel = styled.div`
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  font-size: 7px; letter-spacing: .18em; color: rgba(80, 200, 255, 0.4);
  pointer-events: none;
`;

/* ── Panel 2: Portrait ──────────────────────────────────────────────── */
export const PortraitPanel = styled.div`
  width: 116px; min-width: 116px; border-right: 1px solid rgba(80, 200, 255, 0.12);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 8px; gap: 5px; cursor: pointer; pointer-events: all;
`;

export const PortraitIconDiv = styled.div`
  width: 64px; height: 64px; border: 1px solid rgba(80, 200, 255, 0.3);
  background: rgba(80, 200, 255, 0.05); display: flex; align-items: center;
  justify-content: center; font-size: 26px; overflow: hidden;
`;

export const PortraitImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

export const PortraitName = styled.div`
  font-size: 9px; letter-spacing: .15em; color: #50c8ff; text-align: center;
`;

export const PortraitHpBar = styled.div`
  width: 100%; height: 5px; background: #1a2a1a; border-radius: 2px; overflow: hidden;
`;

export const PortraitHpFill = styled.div`
  height: 100%; width: 100%; transition: width .2s;
`;

export const PortraitHpLabel = styled.div`
  font-size: 7.5px; color: rgba(255, 255, 255, 0.5); text-align: center; letter-spacing: .06em; margin-top: 2px;
  font-family: 'Courier New', monospace;
`;

/* ── Panel 3: Unit stats ────────────────────────────────────────────── */
export const InfoPanel = styled.div`
  flex: 1; padding: 7px 10px; display: flex; flex-direction: column; gap: 4px; overflow: hidden;
  pointer-events: none;
`;

export const InfoTitle = styled.div`
  font-size: 9px; letter-spacing: .22em; color: #fff; opacity: .45; margin-bottom: 1px;
`;

export const InfoStats = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 2px 8px; font-size: 8.5px;
`;

export const StatCell = styled.div`
  display: flex; align-items: center; gap: 4px;
  color: #50c8ff; white-space: nowrap; overflow: hidden;
  & .si { font-size: 10px; line-height: 1; opacity: .8; flex-shrink: 0; }
  & .sl { opacity: .55; letter-spacing: .06em; flex-shrink: 0; }
  & .sv { color: #fff; font-weight: bold; margin-left: auto; }
  &.warn .sv { color: #ff6644; }
  &.good .sv { color: #44ff88; }
`;

/* ── Production queue (inside info panel) ───────────────────────────── */
export const QueueWrap = styled.div`
  margin-top: 2px;
`;

export const QueueLabel = styled.div`
  font-size: 8px; letter-spacing: .12em; color: #50c8ff; opacity: .5; margin-bottom: 3px;
`;

export const QueueItemsRow = styled.div`
  display: flex; gap: 3px;
`;

export const QueueItem = styled.div`
  width: 34px; height: 34px; background: rgba(80, 200, 255, 0.07);
  border: 1px solid rgba(80, 200, 255, 0.22); position: relative;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
  & .q-prog { position: absolute; bottom: 0; left: 0; height: 3px; background: #50c8ff; }
`;

/* ── Assigned animation list (inside info panel) ────────────────────── */
export const AnimListWrap = styled.div`
  margin-top: 2px;
`;

export const AnimListLabel = styled.div`
  font-size: 8px; letter-spacing: .12em; color: #50c8ff; opacity: .5; margin-bottom: 3px;
`;

export const AnimChips = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;
`;

export const AnimChip = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 2px 3px; background: rgba(80, 200, 255, 0.06);
  border: 1px solid rgba(80, 200, 255, 0.18); overflow: hidden;
  &.missing { opacity: .3; }
`;

export const AnimChipSlot = styled.div`
  font-size: 6.5px; letter-spacing: .1em; color: #50c8ff; opacity: .85;
  white-space: nowrap;
`;

export const AnimChipName = styled.div`
  font-size: 7px; color: #fff; font-weight: bold; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 100%;
`;

/* ── Panel 3.5a: Reinforce button panel ────────────────────────────── */
export const ReinforceBtnPanel = styled.div`
  width: 90px; min-width: 90px;
  border-left: 1px solid rgba(80, 200, 255, 0.12);
  border-right: 1px solid rgba(80, 200, 255, 0.12);
  display: flex; flex-direction: column;
  padding: 6px 8px; gap: 5px; overflow: hidden; align-items: center; justify-content: flex-start;
  pointer-events: all;
`;

export const ReinforceBtnRow = styled.div`
  display: flex; flex-direction: row; gap: 6px; align-items: center; justify-content: center;
  width: 100%;
`;

export const ReinforceBtnLabel = styled.div`
  display: none;
`;

/* ── Sergeant slot ──────────────────────────────────────────────────── */
export const SergeantSlot = styled.div`
  width: 36px; height: 36px; flex-shrink: 0;
  background: rgba(255, 220, 60, 0.10); border: 1px solid rgba(255, 220, 60, 0.55);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; font-size: 14px; gap: 0; cursor: default;
  opacity: 1;
  box-shadow: 0 0 8px rgba(255, 210, 40, 0.35), inset 0 0 6px rgba(255, 220, 60, 0.08);
  &.alive {
    border-color: rgba(255, 200, 30, 0.9); background: rgba(255, 200, 30, 0.18); opacity: 1;
    box-shadow: 0 0 12px rgba(255, 200, 30, 0.5), inset 0 0 8px rgba(255, 220, 60, 0.12);
  }
  &.queued {
    border-color: rgba(255, 200, 30, 0.55); background: rgba(255, 200, 30, 0.10); opacity: 1;
    box-shadow: 0 0 8px rgba(255, 200, 30, 0.3);
  }
  &.dead {
    border-color: rgba(255, 80, 60, 0.6); background: rgba(255, 60, 40, 0.10); opacity: .8;
    box-shadow: 0 0 8px rgba(255, 60, 40, 0.25);
  }
  & .sgt-label {
    font-size: 6px; letter-spacing: .08em; color: rgba(255, 220, 60, 0.85);
    position: absolute; bottom: 2px; line-height: 1;
  }
  & .sgt-bar {
    position: absolute; bottom: 0; left: 0; height: 2px;
    background: #ffe066; transition: width .1s;
  }
`;

/* ── Panel 3.5b: Reinforce progress panel ──────────────────────────── */
export const ReinforcePanel = styled.div`
  width: 85px; min-width: 85px;
  border-left: 1px solid rgba(80, 200, 255, 0.12);
  border-right: 1px solid rgba(80, 200, 255, 0.12);
  display: flex; flex-direction: column;
  padding: 8px 7px; gap: 4px; overflow: hidden;
  pointer-events: all;
`;

export const ReinforcePanelLabel = styled.div`
  font-size: 7.5px; letter-spacing: .18em; color: #50c8ff; opacity: .5;
  white-space: nowrap;
`;

export const RpWrap = styled.div`
  display: flex; flex-direction: column; gap: 2px;
  cursor: pointer;
`;

export const RpBar = styled.div`
  width: 100%; height: 6px; background: rgba(80, 200, 255, 0.08);
  border: 1px solid rgba(80, 200, 255, 0.2); border-radius: 2px; overflow: hidden;
`;

export const RpFill = styled.div`
  height: 100%; width: 0%; background: #50c8ff;
  transition: width .1s; border-radius: 2px;
`;

export const RpIcon = styled.div`
  font-size: 13px; line-height: 1; text-align: center;
`;

export const RpLabel = styled.div`
  font-size: 7px; letter-spacing: .08em; color: rgba(80, 200, 255, 0.55);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

export const RpQueue = styled.div`
  display: grid; grid-template-columns: repeat(4, 22px);
  gap: 3px; align-content: start;
`;

export const RqSlot = styled.div`
  width: 22px; height: 22px; flex-shrink: 0;
  background: rgba(80, 200, 255, 0.06); border: 1px solid rgba(80, 200, 255, 0.2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; font-size: 9px;
  cursor: pointer;
  & .rq-bar {
    position: absolute; bottom: 0; left: 0; height: 2px;
    background: #50c8ff; transition: width .1s;
  }
  &.grenadier { border-color: rgba(255, 140, 20, 0.5); }
  &.grenadier .rq-bar { background: #ff8c14; }
`;

/* ── Ammo/weapon sub-panel ──────────────────────────────────────────── */
export const AmmoPanel = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 3px; width: 100%;
`;

/* ── Panel 4a: Action grid ──────────────────────────────────────────── */
export const ActionsGridDiv = styled.div`
  width: 240px; min-width: 240px; padding: 8px;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; align-content: start;
  border-right: 1px solid rgba(80, 200, 255, 0.12);
  pointer-events: all;
`;

export const ActionBtn = styled.button`
  position: relative;
  background: rgba(80, 200, 255, 0.07); border: 1px solid rgba(80, 200, 255, 0.22);
  color: #50c8ff; font-family: 'Courier New', monospace;
  font-size: 8px; letter-spacing: .06em; padding: 5px 3px;
  cursor: pointer; text-align: center; transition: all .12s;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-height: 50px; justify-content: center;
  &:hover:not(:disabled) { background: rgba(80, 200, 255, 0.18); border-color: #50c8ff; color: #fff; }
  &:disabled { opacity: .3; cursor: not-allowed; }
  & .bi { font-size: 17px; line-height: 1; }
  & .bc { font-size: 7px; color: #ffcc44; }
`;

export const TooltipPop = styled.div`
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  z-index: 100; width: 190px; padding: 6px 8px;
  background: rgba(5, 8, 18, 0.97); border: 1px solid rgba(80, 200, 255, 0.5);
  border-radius: 3px; pointer-events: none; white-space: pre-line;
  font-size: 8px; letter-spacing: .06em; color: #cfd8ff; text-align: left; line-height: 1.45;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

export const AmmoActionBtn = styled(ActionBtn)`
  width: 100%; min-height: unset; height: 28px; padding: 2px 4px;
  font-size: 7.5px; gap: 2px;
  & .bi { font-size: 13px; }
  & .action-icon { width: 18px; height: 18px; margin-bottom: 0; }
`;

/* ── Panel 4a.5: Builder command grid (icon-only, label on hover) ───── */
export const CommandGridDiv = styled(ActionsGridDiv)`
  grid-auto-rows: 1fr;
  & ${ActionBtn} {
    position: relative;
    .btn-label, .bc {
      position: absolute; left: 0; right: 0; bottom: 3px;
      font-size: 7px; letter-spacing: .06em; text-align: center;
      opacity: 0; transition: opacity .12s; pointer-events: none;
      white-space: pre-line; line-height: 1.1;
    }
    .btn-label { color: #fff; }
    .bc { bottom: 1px; color: #ffcc44; }
    &:hover .btn-label, &:hover .bc { opacity: 1; }
  }
`;

export const CommandEmptySlot = styled.div`
  border: 1px dashed rgba(80, 200, 255, 0.12);
  background: rgba(80, 200, 255, 0.02);
  min-height: 50px;
`;

/* ── Panel 4b: Right strip ──────────────────────────────────────────── */
export const RightPanel = styled.div`
  width: 72px; min-width: 72px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6px 5px; gap: 6px;
`;

export const RightBtn = styled.button`
  width: 56px; height: 56px;
  background: rgba(80, 200, 255, 0.06); border: 1px solid rgba(80, 200, 255, 0.22);
  color: #50c8ff; font-family: 'Courier New', monospace;
  font-size: 7.5px; letter-spacing: .06em;
  cursor: pointer; text-align: center; transition: all .15s;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  &:hover:not(:disabled) { background: rgba(80, 200, 255, 0.2); border-color: #50c8ff; color: #fff; }
  &:disabled { opacity: .28; cursor: not-allowed; }
  & .rb-icon { font-size: 20px; line-height: 1; }
  &.attack-btn { border-color: rgba(255, 100, 80, 0.35); }
  &.attack-btn:hover:not(:disabled) { background: rgba(255, 80, 60, 0.18); border-color: rgba(255, 100, 80, 0.9); color: #fff; }
  &.stop-btn { border-color: rgba(80, 200, 255, 0.22); }
`;

export const AttackModeToggle = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  width: 56px; padding: 4px;
  border: 1px solid rgba(255, 160, 60, 0.25); background: rgba(255, 140, 40, 0.05);
`;

export const AtkModeLabel = styled.div`
  font-size: 7px; letter-spacing: .14em; color: rgba(255, 160, 60, 0.5);
  font-family: 'Courier New', monospace;
`;

export const AtkModeBtn = styled.button`
  width: 100%; padding: 3px 2px; font-size: 7.5px; letter-spacing: .06em;
  font-family: 'Courier New', monospace; cursor: pointer; text-align: center;
  background: rgba(255, 140, 40, 0.05); border: 1px solid rgba(255, 140, 40, 0.2);
  color: rgba(255, 160, 60, 0.5); transition: all .12s;
  &:hover { background: rgba(255, 140, 40, 0.15); color: #ffa030; border-color: rgba(255, 140, 40, 0.5); }
  &.active { background: rgba(255, 140, 40, 0.2); color: #ffb040; border-color: #ffa030; }
`;

export const ScatterRow = styled.div`
  display: none; flex-direction: column; align-items: center; gap: 3px;
  width: 56px; padding: 5px 4px;
  background: rgba(80, 200, 255, 0.05); border: 1px solid rgba(80, 200, 255, 0.18);
  font-size: 7px; color: #50c8ff; letter-spacing: .08em;
  font-family: 'Courier New', monospace;
  & label { white-space: nowrap; opacity: .7; }
  & input[type=range] {
    writing-mode: vertical-lr; direction: rtl;
    width: 10px; height: 52px; accent-color: #50c8ff; cursor: pointer;
  }
`;

export const ScatterVal = styled.span`
  color: #fff; font-weight: bold; font-size: 8px;
`;

/* ── Capture progress bars ──────────────────────────────────────────── */
export const CapWrap = styled.div`
  position: fixed; pointer-events: none; z-index: 8;
  transform: translate(-50%, -50%);
  display: none; flex-direction: column; align-items: center; gap: 2px;
`;

export const CapLabel = styled.div`
  font-size: 8px; letter-spacing: .1em; color: #fff; opacity: .8; white-space: nowrap;
`;

export const CapBar = styled.div`
  width: 52px; height: 5px; background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 3px; overflow: hidden;
`;

export const CapFill = styled.div`
  height: 100%; width: 0%; transition: width .1s; border-radius: 3px;
`;
