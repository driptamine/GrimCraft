import { useSyncExternalStore } from 'react';
import { getTicker, subscribeChannel } from './store.js';

/**
 * Subscribes a component to a HUD channel (hud / topbar / minimap / capture).
 * Returns a version number that changes whenever the channel is bumped.
 */
export function useHUDVersion(channel) {
  return useSyncExternalStore(
    (cb) => subscribeChannel(channel, cb),
    () => getTicker(channel),
  );
}
