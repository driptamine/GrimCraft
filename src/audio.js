// Tiny synthesized SFX: no audio files, everything is generated with the
// Web Audio API on the first user gesture (LMB counts, so the context is
// always allowed by the time a shot lands).
let _ctx = null;

function ensureContext() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!_ctx) {
    try {
      _ctx = new AC();
    } catch (_) {
      return null;
    }
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

// Wet crunch for a las-beam hit: a short filtered-noise snap (flesh) over a
// fast pitch-dropping thump (impact). ~0.2s, quiet enough to spam per click.
export function playHitCrunch(volume = 0.5) {
  const ctx = ensureContext();
  if (!ctx) return false;
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), now);
  master.connect(ctx.destination);

  const noiseLen = Math.floor(ctx.sampleRate * 0.16);
  const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) {
    const decay = 1 - i / noiseLen;
    data[i] = (Math.random() * 2 - 1) * decay * decay;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const crunchFilter = ctx.createBiquadFilter();
  crunchFilter.type = 'lowpass';
  crunchFilter.frequency.setValueAtTime(3200, now);
  crunchFilter.frequency.exponentialRampToValueAtTime(300, now + 0.16);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.9, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  noise.connect(crunchFilter).connect(noiseGain).connect(master);
  noise.start(now);

  const thump = ctx.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(170, now);
  thump.frequency.exponentialRampToValueAtTime(48, now + 0.14);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.7, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  thump.connect(thumpGain).connect(master);
  thump.start(now);
  thump.stop(now + 0.16);
  return true;
}
