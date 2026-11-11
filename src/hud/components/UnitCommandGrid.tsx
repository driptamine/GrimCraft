import type { JSX } from 'react';
import { ActionButton } from '../bits.jsx';
import { CommandGridDiv, CommandEmptySlot } from '../primitives.jsx';
import { selectedTroops, pendingUnitCommand, setUnitCommand, setUnitStance, setSelectedAttackMode, stopSelectedTroops } from '../../input/unit-commands.js';

// Match the Enginseer's 4-column grid: common orders at 0..3, stances at 6..7.
// Unit-specific abilities use the remaining slots without shifting these six.
export function UnitCommandGrid({ extras = [] }: { extras?: JSX.Element[] }): JSX.Element {
  const troops = selectedTroops();
  const buttons = Array.from({ length: Math.max(12, extras.length + 6) }, (_, i) => <CommandEmptySlot key={`empty-${i}`} />);
  const commandStyle = (command: string) => pendingUnitCommand === command ? { borderColor: '#50c8ff' } : undefined;
  buttons[0] = <ActionButton key="move" icon="assets/command_icons/move.png" label="MOVE" cost="M" tooltip="MOVE\nClick ground to move" style={commandStyle('move')} onClick={() => setUnitCommand('move')} />;
  buttons[1] = <ActionButton key="stop" icon="assets/command_icons/stop.png" label="STOP" cost="Q KEY" tooltip="STOP\nCancel all orders and hold position" onClick={stopSelectedTroops} />;
  buttons[2] = <ActionButton key="attackmove" icon="assets/command_icons/attackm.png" label="ATTACK\nMOVE" tooltip="ATTACK MOVE\nClick ground to advance and engage enemies" style={commandStyle('attackmove')} onClick={() => setUnitCommand('attackmove')} />;
  buttons[3] = <ActionButton key="melee" icon="assets/command_icons/melee.png" label="MELEE" cost="1 / T" tooltip="MELEE (1 / T)\nRight-click an enemy or ground to engage in close combat (infantry)\nPress 2 to switch back to ranged" disabled={!troops.some(({ kind }) => kind === 'squad')} style={commandStyle('melee')} onClick={() => setUnitCommand('melee')} />;
  for (const [index, stance] of ['stand'].entries()) {
    const active = troops.length > 0 && troops.every(({ unit }) => (unit.stance || 'stand') === stance);
    buttons[6 + index] = <ActionButton key={`stance_${stance}`} icon={`assets/command_icons/stance_${stance}.png`} label={stance.toUpperCase()} tooltip={stance === 'stand' ? 'STAND\nHold position and fire at enemies in range' : 'RANGED\nAutomatically advance and engage enemies'} style={{ border: active ? '1px solid #50c8ff' : '1px solid rgba(80,200,255,0.22)', opacity: active ? 1 : 0.6 }} onClick={() => setUnitStance(stance as 'stand' | 'ranged')} />;
  }
  const infantry = troops.filter(({ kind }) => kind === 'squad');
  const assault = infantry.length > 0 && infantry.every(({ unit }) => unit.attackMode === 'melee');
  const toggleCombatStance = () => {
    if (infantry.length) setSelectedAttackMode(assault ? 'ranged' : 'melee');
    else setUnitStance('ranged');
  };
  buttons[7] = <ActionButton key="combat_stance"
    icon={`assets/command_icons/stance_${assault ? 'assault' : 'ranged'}.png`}
    label={assault ? 'STANCE\nASSAULT' : 'STANCE\nRANGED'} cost="1 / 2"
    tooltip="COMBAT STANCE\n1: Assault — shoot while advancing, melee on contact\n2: Ranged — engage with guns\nLeft-click or right-click to switch"
    style={{ border: '1px solid #50c8ff' }}
    onClick={toggleCombatStance} onRightClick={toggleCombatStance} />;
  extras.forEach((button, index) => { buttons[index < 2 ? 4 + index : 6 + index] = button; });
  return <CommandGridDiv>{buttons}</CommandGridDiv>;
}
