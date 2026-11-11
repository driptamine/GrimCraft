import { useState, useEffect, type JSX } from 'react';
import {necronGlowMode,setNecronGlowMode,type NecronGlowMode} from '../../fx/necron-aurora.js';
import { LIGHTING_CHANGED, lightingMode, setLightingMode, shadowsEnabled, setShadowsEnabled } from '../../render/lighting.js';
import { qualityTier } from '../../core/scene.js';
import { world, PLAYER, controlBoth, canCommand, requisition, energy, kills, startTime, getPowerRate, getRequisitionRate, getRenderBackend, isBackendSwitching, supportsWebGPU, getBackendError, _gridVariant } from '../../core/scene.js';
import { getFactionTeamcolor, getFactionTeamcolourScheme, getFactionTeamcolourSchemes, setFactionTeamcolourScheme, TEAMCOLOUR_SLOT } from '../../factions.js';
import { teamcolorHex } from '../../ui/teamcolour.js';
import type { TeamcolourRGB } from '../../ui/teamcolour.js';
import { useHUDVersion } from '../useHUD.js';
import { useNewInfantryModel } from '../../render/infantry-model-variant.js';
import { infantryImmortal, setInfantryImmortal, getFps } from '../store.js';
import { backendButtonState } from '../../render/render-backend.js';
import {
  TopBarDiv, TbSection, TbStat, TbReq, TbSep, TbTitle, TerrainSelect, ResetBtn, InspectorBtn,
  ImmortalBtn,
} from '../primitives.jsx';
import { assetUrl } from '../../render/assets.js';
import { R2Img } from '../bits.jsx';

function TeamcolourSelect({ faction, short }: any): JSX.Element {
  const scheme = getFactionTeamcolourScheme(faction);
  const slot = TEAMCOLOUR_SLOT[faction] || 'trim';
  const hex = teamcolorHex(getFactionTeamcolor(faction)?.[slot] as TeamcolourRGB | null | undefined);
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

function LightingControls(): JSX.Element {
  const [, refresh] = useState(0);
  useEffect(() => {
    const changed = () => refresh(version => version + 1);
    window.addEventListener(LIGHTING_CHANGED, changed);
    return () => window.removeEventListener(LIGHTING_CHANGED, changed);
  }, []);
  const enhanced = lightingMode() === 'definitive', shadows = shadowsEnabled(qualityTier());
  return <div role="group" aria-label="Освещение и тени" style={{ position: 'absolute', top: 50, left: 150, display: 'flex', gap: 6, background: 'rgba(4,12,20,.85)' }}>
    <InspectorBtn id="lighting-mode-toggle" aria-pressed={enhanced} title="Освещение: Classic / в духе Dawn of War: Definitive Edition. Переключение без перезапуска матча." onClick={() => setLightingMode(enhanced ? 'classic' : 'definitive')}>
      СВЕТ: {enhanced ? 'DE' : 'CLASSIC'}
    </InspectorBtn>
    <InspectorBtn id="lighting-shadows-toggle" aria-pressed={shadows} title="Включить или выключить тени юнитов и зданий." onClick={() => setShadowsEnabled(!shadows)}>
      ТЕНИ: {shadows ? 'ВКЛ.' : 'ВЫКЛ.'}
    </InspectorBtn>
  </div>;
}

export function TopBar(): JSX.Element {
  const [auraMode,setAuraMode]=useState<NecronGlowMode>(necronGlowMode);
  useEffect(()=>{const refresh=()=>setAuraMode(necronGlowMode());window.addEventListener('necron-glow-changed',refresh);return()=>window.removeEventListener('necron-glow-changed',refresh)},[]);
  const showAuraControl=world&&[...world.query('squad'),...world.query('structure')].some((id:number)=>(world.get(id,'squad')||world.get(id,'structure'))?.faction==='necrons');
  useHUDVersion('topbar');

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = String(elapsed % 60).padStart(2, '0');
  const timer = `${minutes}:${seconds}`;

  const bldCount = world ? world.query('building').length + world.query('structure').length : 0;
  const squadCount = world ? world.query('squad').filter((id: number) => canCommand(world.get(id, 'squad')?.team)).length : 0;
  const builderCount = world ? world.query('builder').length : 0;
  const spIds = world ? world.query('strategicPoint') : [];
  const capCount = spIds.filter((id: number) => canCommand(world.get(id, 'strategicPoint')?.owner)).length;
  const backendArgs: { backend?: any; supportsWebGPU?: any; switching?: any; error?: any } = {
    backend: getRenderBackend(),
    supportsWebGPU: supportsWebGPU(),
    switching: isBackendSwitching(),
    error: getBackendError(),
  };
  const backendUi = backendButtonState(backendArgs);

  return (
    <TopBarDiv>
      <LightingControls />
      <TbSection>
        {showAuraControl&&<InspectorBtn id="necron-aura-toggle" title="Аура некронов: новая → текущая → выключена. Сравнение без перезапуска матча." onClick={()=>{const modes=['new','current','off'] as const;const next=modes[(modes.indexOf(necronGlowMode())+1)%3];setNecronGlowMode(next);setAuraMode(next)}}>NECRON: {{new:'НОВАЯ',current:'ТЕКУЩАЯ',off:'ВЫКЛ.'}[auraMode]}</InspectorBtn>}

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
      <ImmortalBtn
        className={useNewInfantryModel('marine') ? 'on' : ''}
        onClick={() => window.toggleInfantryModel?.('marine')}
        title="Space Marine model: switch between the classic space_marine.glb and the new space-marine.glb (live, no restart)"
      >
        {useNewInfantryModel('marine') ? 'SM MODEL: NEW' : 'SM MODEL: OLD'}
      </ImmortalBtn>
      <ImmortalBtn
        className={useNewInfantryModel('guardsman') ? 'on' : ''}
        onClick={() => window.toggleInfantryModel?.('guardsman')}
        title="Guardsman model: switch between the classic guardsmen.glb and the new guardsmen.glb (live, no restart)"
      >
        {useNewInfantryModel('guardsman') ? 'IG MODEL: NEW' : 'IG MODEL: OLD'}
      </ImmortalBtn>
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
