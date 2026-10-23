import { createRoot } from 'react-dom/client';
import { useHUDVersion } from './useHUD.js';
import { HudContainer } from './primitives.jsx';
import { TopBar } from './components/TopBar.jsx';
import { Minimap } from './components/Minimap.jsx';
import { Portrait } from './components/Portrait.jsx';
import { InfoPanel } from './components/InfoPanel.jsx';
import { ReinforceProgressPanel } from './components/ReinforcePanel.jsx';
import { ReinforceButtonsPanel } from './components/ReinforceBtnPanel.jsx';
import { ActionsGrid } from './components/ActionsGrid.jsx';
import { CaptureBars } from './components/CaptureBars.jsx';

function HUDApp() {
  useHUDVersion('hud');
  return (
    <HudContainer>
      <Minimap />
      <Portrait />
      <InfoPanel />
      <ReinforceProgressPanel />
      <ReinforceButtonsPanel />
      <ActionsGrid />
    </HudContainer>
  );
}

function mount() {
  const topbarRootEl = document.getElementById('topbar-root');
  if (topbarRootEl) {
    createRoot(topbarRootEl).render(<TopBar />);
  }
  const hudRootEl = document.getElementById('hud-root');
  if (hudRootEl) {
    createRoot(hudRootEl).render(<HUDApp />);
  }
  const capRootEl = document.getElementById('capBarsContainer');
  if (capRootEl) {
    createRoot(capRootEl).render(<CaptureBars />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
