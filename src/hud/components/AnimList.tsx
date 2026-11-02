import type { JSX } from 'react';
import { getAnimList } from '../data.js';
import {
  AnimListWrap, AnimListLabel, AnimChips, AnimChip, AnimChipSlot, AnimChipName,
} from '../primitives.jsx';

const SLOT_LABEL: Record<string, string> = {
  idle: 'IDLE',
  run: 'RUN',
  shoot: 'SHOOT',
  shootMove: 'MOVE-FIRE',
};

export function AnimList(): JSX.Element | null {
  const list = getAnimList();
  if (!list) {
    return null;
  }
  const order = ['idle', 'run', 'shoot', 'shootMove'];
  return (
    <AnimListWrap>
      <AnimListLabel>{list.isCustom ? 'ANIMATIONS · CUSTOM MODEL' : 'ANIMATIONS'}</AnimListLabel>
      <AnimChips>
        {order.map((slot) => {
          const entry = list.slots.find((s) => s.slot === slot);
          return (
            <AnimChip key={slot} className={entry ? '' : 'missing'} title={entry ? entry.name : `no ${SLOT_LABEL[slot]} animation assigned`}>
              <AnimChipSlot>{SLOT_LABEL[slot] || slot}</AnimChipSlot>
              <AnimChipName>{entry ? entry.name : '—'}</AnimChipName>
            </AnimChip>
          );
        })}
      </AnimChips>
    </AnimListWrap>
  );
}
