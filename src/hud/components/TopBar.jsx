import { world, PLAYER, controlBoth, canCommand, requisition, energy, kills, startTime, getPowerRate, getRequisitionRate, getRenderBackend, isBackendSwitching, supportsWebGPU, getBackendError, _gridVariant } from '../../scene.js';
import { getFactionTeamcolor, getFactionTeamcolourScheme, getFactionTeamcolourSchemes, setFactionTeamcolourScheme, TEAMCOLOUR_SLOT } from '../../factions.js';
import { teamcolorHex } from '../../teamcolour.js';
import { useHUDVersion } from '../useHUD.js';
import { infantryImmortal, setInfantryImmortal, getFps } from '../store.js';
import { backendButtonState } from '../../render-backend.js';
import {
  TopBarDiv, TbSection, TbStat, TbReq, TbSep, TbTitle, TerrainSelect, ResetBtn, InspectorBtn,
  ImmortalBtn,
} from '../primitives.jsx';
import { assetUrl } from '../../assets.js';
import { R2Img } from '../bits.jsx';

function TeamcolourSelect({ faction, short }) {
  const scheme = getFactionTeamcolourScheme(faction);
  const slot = TEAMCOLOUR_SLOT[faction] || 'trim';
  const hex = teamcolorHex(getFactionTeamcolor(faction)?.[slot]);
  return (
    <TbStat title={`${short} army scheme`}>
      {short}
      {hex != null && (
        <span style={{ display: 'inline-block', width: 10, height: 10, background: `#${hex.toString(16).padStart(6, '0')}`, border: '1px solid rgba(255,255,255,.5)' }} />
      )}
      <TerrainSelect value={scheme} onChange={(e) => setFactionTeamcolourScheme(faction, e.target.value)}>
        {getFactionTeamcolourSchemes(faction).map((name) => (
          <option key={name} value={name}>{name.toUpperCase()}</option>
        ))}
      </TerrainSelect>
    </TbStat>
  );
}

export function TopBar() {
  useHUDVersion('topbar');

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = String(elapsed % 60).padStart(2, '0');
  const timer = `${minutes}:${seconds}`;

  const bldCount = world ? world.query('building').length + world.query('structure').length : 0;
  const squadCount = world ? world.query('squad').filter((id) => canCommand(world.get(id, 'squad')?.team)).length : 0;
  const builderCount = world ? world.query('builder').length : 0;
  const spIds = world ? world.query('strategicPoint') : [];
  const capCount = spIds.filter((id) => canCommand(world.get(id, 'strategicPoint')?.owner)).length;
  const backendUi = backendButtonState({
    backend: getRenderBackend(),
    supportsWebGPU: supportsWebGPU(),
    switching: isBackendSwitching(),
    error: getBackendError(),
  });

  return (
    <TopBarDiv>
      <TbSection>
        <InspectorBtn title={backendUi.title} disabled={backendUi.disabled} onClick={() => window.switchRenderBackend?.()}>
          {backendUi.label}
        </InspectorBtn>
        <TbSep />
        <TbReq title="REQUISITION — primary resource"><R2Img src={assetUrl('assets/Resource_requisition.gif')} alt="req" /> <span className="val">{requisition}/{getRequisitionRate(world)}</span></TbReq>
        <TbSep />
        <TbStat title="ENERGY — power for research"><R2Img src={assetUrl('assets/Resource_power.gif')} alt="energy" /><span className="val">{energy}/{getPowerRate(world)}</span></TbStat>
        <TbStat title="BUILDINGS — structures owned">🏠<span className="val">{bldCount}</span></TbStat>
        <TbStat title="SQUADS — infantry squads">⚔<span className="val">{squadCount}</span></TbStat>
        <TbStat title="BUILDERS — construction engineers">🔨<span className="val">{builderCount}</span></TbStat>
        <TbSep />
        <TbStat title="STRATEGIC POINTS — captured/total">🚩<span className="val">{capCount}/{spIds.length}</span></TbStat>
      </TbSection>
      <TbTitle>▸ GRIMCRAFT ◂</TbTitle>
      <ImmortalBtn
        className={infantryImmortal ? 'on' : ''}
        onClick={() => setInfantryImmortal(!infantryImmortal)}
        title="Toggle: infantry stops taking damage"
      >
        {infantryImmortal ? '🛡 INFANTRY INVULNERABLE' : '🛡 INFANTRY VULNERABLE'}
      </ImmortalBtn>
      <ImmortalBtn
        className={controlBoth ? 'on' : ''}
        onClick={() => window.toggleControlBoth?.()}
        title="Sandbox: command both teams (AI spawns off)"
      >
        {controlBoth ? '⚔ CONTROL: BOTH' : `⚔ CONTROL: ${PLAYER.toUpperCase()}`}
      </ImmortalBtn>
      <ImmortalBtn
        className={_gridVariant === 1 ? '' : 'on'}
        onClick={() => window.toggleGridVariant?.()}
        title="Grid style: standard lines vs small cells readable at zoom-out vs hidden"
      >
        {_gridVariant === 2 ? '▦ GRID: FINE' : _gridVariant === 3 ? '▦ GRID: NO-GRID' : '▦ GRID: STD'}
      </ImmortalBtn>
      <TeamcolourSelect faction="ig" short="IG" />
      <TeamcolourSelect faction="space marines" short="SM" />
      <TbSection>
        <TbStat title="FPS — frames per second"><span className="val">{getFps()} FPS</span></TbStat>
        <TbStat title="GAME TIME — elapsed match time"><span className="val">{timer}</span></TbStat>
        <TbStat title="KILLS — enemies destroyed">💀<span className="val">{kills}</span></TbStat>
        <TerrainSelect onChange={(e) => window.setTerrain?.(e.target.value)}>
          <option value="steppe">STEPPE</option>
          <option value="jungle">JUNGLE</option>
          <option value="river">RIVER</option>
        </TerrainSelect>
        <ResetBtn title="RESET — restart the match" onClick={() => window.resetGame?.()}>RESET</ResetBtn>
        <InspectorBtn title="INSPECTOR — BabylonJS debug tool" onClick={() => window.toggleInspector?.()}>🔍</InspectorBtn>
      </TbSection>
    </TopBarDiv>
  );
}
