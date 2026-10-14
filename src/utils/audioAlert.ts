/**
 * Emergency Audio Siren & Spoken Alert Synthesizer
 * Uses Web Audio API oscillator for authentic Civil Defense Siren
 * and Web Speech API for emergency broadcast announcements.
 */

let audioCtx: AudioContext | null = null;
let activeOscillator: OscillatorNode | null = null;
let activeGain: GainNode | null = null;
let lfoOscillator: OscillatorNode | null = null;
let sirenTimeout: any = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play authentic alternating pitch Civil Defense Emergency Siren
 * Duration defaults to 5 seconds to avoid fatigue.
 */
export function playEmergencySiren(durationSeconds: number = 4) {
  stopEmergencySiren();
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Carrier Oscillator (primary siren pitch)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);

    // LFO to oscillate carrier frequency (warble effect 0.8 Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.8, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(300, now); // swing between 520 - 300 = 220Hz and 520 + 300 = 820Hz

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Master volume gain with smooth fade in/out
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.3);
    masterGain.gain.setValueAtTime(0.35, now + durationSeconds - 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    lfo.start(now);

    activeOscillator = osc;
    lfoOscillator = lfo;
    activeGain = masterGain;

    sirenTimeout = setTimeout(() => {
      stopEmergencySiren();
    }, durationSeconds * 1000);
  } catch (e) {
    console.warn('Audio siren could not be played:', e);
  }
}

/**
 * Stop active emergency siren
 */
export function stopEmergencySiren() {
  if (sirenTimeout) {
    clearTimeout(sirenTimeout);
    sirenTimeout = null;
  }
  try {
    if (activeOscillator) {
      activeOscillator.stop();
      activeOscillator.disconnect();
      activeOscillator = null;
    }
    if (lfoOscillator) {
      lfoOscillator.stop();
      lfoOscillator.disconnect();
      lfoOscillator = null;
    }
    if (activeGain) {
      activeGain.disconnect();
      activeGain = null;
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Play gentle notification ping
 */
export function playNotificationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // Ignore
  }
}

/**
 * Multi-lingual Emergency Spoken Voice Broadcast
 */
export function speakDisasterAlert(text: string, lang: 'hi-IN' | 'en-IN' = 'en-IN') {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis error handled gracefully
  }
}
