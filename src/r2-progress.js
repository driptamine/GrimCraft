// R2 download progress tracker: aggregates byte-level ProgressEvents from
// model/texture loads so the START BATTLE loading bar can show real
// downloaded megabytes instead of just file counts. Pure logic, no DOM —
// the loading UI subscribes and renders. Safe under node:test.
const _files = new Map(); // url -> { loaded, total|null, done, failed }
const _listeners = new Set();

function _notify() {
  const snapshot = r2ProgressSnapshot();
  for (const listener of _listeners) {
    try {
      listener(snapshot);
    } catch (_) {
      // A broken listener must never break downloads.
    }
  }
}

export function resetR2Progress() {
  _files.clear();
  _notify();
}

export function subscribeR2Progress(listener) {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

// Report bytes for one URL. total=null when the server did not send a
// Content-Length (lengthComputable === false). done=true marks the file
// finished (success or failure — see failed flag); a fresh non-done report
// for an already-done URL restarts the entry for re-downloads.
export function reportR2Progress(url, { loaded = 0, total = null, done = false, failed = false } = {}) {
  const key = String(url || '');
  if (!key) {
    return;
  }
  const prev = _files.get(key);
  if (prev && prev.done && !done) {
    _files.set(key, {
      loaded: Math.max(0, loaded),
      total: total != null && total > 0 ? total : null,
      done: false,
      failed: false,
    });
  } else {
    const base = prev || { loaded: 0, total: null, done: false, failed: false };
    const next = {
      loaded: Math.max(base.loaded, Math.max(0, loaded)),
      total: total != null && total > 0 ? total : base.total,
      done: done || base.done,
      failed: failed || base.failed,
    };
    if (next.done && next.total == null && next.loaded > 0) {
      next.total = next.loaded;
    }
    _files.set(key, next);
  }
  _notify();
}

export function r2ProgressSnapshot() {
  let loadedBytes = 0;
  let totalBytes = 0;
  let knownBytes = 0;
  let doneFiles = 0;
  let failedFiles = 0;
  let unknownTotals = 0;
  const totalFiles = _files.size;
  for (const file of _files.values()) {
    loadedBytes += file.loaded;
    if (file.total != null) {
      totalBytes += file.total;
      knownBytes += Math.min(file.loaded, file.total);
    } else {
      unknownTotals += 1;
    }
    if (file.done) {
      doneFiles += 1;
    }
    if (file.failed) {
      failedFiles += 1;
    }
  }
  const percent = totalBytes > 0
    ? Math.min(100, Math.round((knownBytes / totalBytes) * 100))
    : (totalFiles > 0 && doneFiles === totalFiles ? 100 : 0);
  return {
    loadedBytes,
    totalBytes,
    doneFiles,
    totalFiles,
    unknownTotals,
    failedFiles,
    percent,
    complete: totalFiles > 0 && doneFiles === totalFiles,
  };
}
