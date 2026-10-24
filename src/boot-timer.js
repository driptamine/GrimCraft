// Stopwatch for game boot: measures wall time from START BATTLE press until
// the loading UI hides, so launch duration is visible instead of guessed.
// Pure logic (injectable clock), the loading UI ticks it into the panel.
export function createBootTimer(nowFn = () => performance.now()) {
  let startedAt = null;
  let stoppedAt = null;
  return {
    start() {
      startedAt = nowFn();
      stoppedAt = null;
    },
    elapsedMs() {
      if (startedAt === null) {
        return 0;
      }
      return Math.max(0, (stoppedAt ?? nowFn()) - startedAt);
    },
    stop() {
      if (startedAt === null) {
        return 0;
      }
      if (stoppedAt === null) {
        stoppedAt = nowFn();
      }
      return Math.max(0, stoppedAt - startedAt);
    },
    running() {
      return startedAt !== null && stoppedAt === null;
    },
  };
}

export function formatBootTime(ms) {
  const totalSeconds = Math.max(0, ms) / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
