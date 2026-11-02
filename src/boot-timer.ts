// Stopwatch for game boot: measures wall time from START BATTLE press until
// the loading UI hides, so launch duration is visible instead of guessed.
// Pure logic (injectable clock), the loading UI ticks it into the panel.
export type NowFn = () => number;

export interface BootTimer {
  start(): void;
  elapsedMs(): number;
  stop(): number;
  running(): boolean;
}

export function createBootTimer(nowFn: NowFn = () => performance.now()): BootTimer {
  let startedAt: number | null = null;
  let stoppedAt: number | null = null;
  return {
    start(): void {
      startedAt = nowFn();
      stoppedAt = null;
    },
    elapsedMs(): number {
      if (startedAt === null) {
        return 0;
      }
      return Math.max(0, (stoppedAt ?? nowFn()) - startedAt);
    },
    stop(): number {
      if (startedAt === null) {
        return 0;
      }
      if (stoppedAt === null) {
        stoppedAt = nowFn();
      }
      return Math.max(0, stoppedAt - startedAt);
    },
    running(): boolean {
      return startedAt !== null && stoppedAt === null;
    },
  };
}

export function formatBootTime(ms: number): string {
  const totalSeconds = Math.max(0, ms) / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
