import type { GridPlacement } from '../types/content';

const AUDIO_STORAGE_KEY = 'mandacaru-audio-enabled';

const AUDIO_ASSETS = {
  combo: '/audio/combo-up.wav',
  hit: '/audio/hit-common.wav',
  mistake: '/audio/mistake-soft.wav',
  rhyme: '/audio/hit-rhyme.wav',
  stageIntro: '/audio/stage-intro.wav',
  victory: '/audio/victory-short.wav',
} as const;

type AudioAssetKey = keyof typeof AUDIO_ASSETS;

let audioContext: AudioContext | null = null;
let cachedPreference: boolean | null = null;
let preloadedAudio = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

function isAudioEnabled(): boolean {
  if (cachedPreference !== null) {
    return cachedPreference;
  }

  if (typeof window === 'undefined') {
    cachedPreference = true;
    return cachedPreference;
  }

  const savedValue = window.localStorage.getItem(AUDIO_STORAGE_KEY);
  cachedPreference = savedValue !== '0';
  return cachedPreference;
}

function cueRoot(cue: string): number {
  const hash = cue.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  return 170 + (hash % 55);
}

function warmAudioAssets(): void {
  if (preloadedAudio || typeof window === 'undefined') {
    return;
  }

  Object.values(AUDIO_ASSETS).forEach((src) => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.load();
  });

  preloadedAudio = true;
}

function getPlayableContext(): AudioContext | null {
  const context = getAudioContext();

  if (!context || !isAudioEnabled()) {
    return null;
  }

  return context;
}

function scheduleTone(
  context: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = 'triangle',
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.connect(gain);
  gain.connect(context.destination);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

function scheduleSweep(
  context: AudioContext,
  fromFrequency: number,
  toFrequency: number,
  startAt: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = 'sine',
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(fromFrequency, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(toFrequency, startAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

async function playAsset(
  key: AudioAssetKey,
  options: {
    playbackRate?: number;
    volume?: number;
  } = {},
): Promise<boolean> {
  if (typeof window === 'undefined' || !isAudioEnabled()) {
    return false;
  }

  try {
    const audio = new Audio(AUDIO_ASSETS[key]);
    audio.preload = 'auto';
    audio.volume = options.volume ?? 0.72;
    audio.playbackRate = options.playbackRate ?? 1;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

async function playPlacementFallback(category: GridPlacement['category']): Promise<void> {
  const context = getPlayableContext();

  if (!context) {
    return;
  }

  const start = context.currentTime;

  if (category === 'common') {
    [330, 392].forEach((frequency, index) => {
      scheduleTone(context, frequency, start + index * 0.05, 0.12, 0.028, 'triangle');
    });
    return;
  }

  if (category === 'rare') {
    [330, 415, 523].forEach((frequency, index) => {
      scheduleTone(context, frequency, start + index * 0.05, 0.16, 0.03, index === 0 ? 'triangle' : 'sine');
    });
    return;
  }

  [392, 494, 659].forEach((frequency, index) => {
    scheduleTone(context, frequency, start + index * 0.06, 0.18, 0.034, 'triangle');
  });
}

async function playMistakeFallback(): Promise<void> {
  const context = getPlayableContext();

  if (!context) {
    return;
  }

  const start = context.currentTime;
  scheduleSweep(context, 240, 162, start, 0.18, 0.028, 'sawtooth');
  scheduleTone(context, 145, start + 0.04, 0.12, 0.018, 'triangle');
}

async function playStageFallback(cue: string, variant: 'intro' | 'transition' | 'victory'): Promise<void> {
  const context = getPlayableContext();

  if (!context) {
    return;
  }

  const start = context.currentTime;
  const root = cueRoot(cue);

  if (variant === 'transition') {
    [root, root * 1.2, root * 1.5].forEach((frequency, index) => {
      scheduleTone(context, frequency, start + index * 0.1, 0.22, 0.022, 'sine');
    });
    return;
  }

  if (variant === 'victory') {
    [root * 1.18, root * 1.5, root * 1.82, root * 2.2].forEach((frequency, index) => {
      scheduleTone(context, frequency, start + index * 0.09, 0.24, 0.03, index < 2 ? 'triangle' : 'sine');
    });
    scheduleSweep(context, root * 0.92, root * 1.45, start, 0.72, 0.014, 'sine');
    return;
  }

  scheduleSweep(context, root * 0.8, root * 1.05, start, 0.62, 0.012, 'sine');
  [root * 1.2, root * 1.5].forEach((frequency, index) => {
    scheduleTone(context, frequency, start + 0.14 + index * 0.12, 0.2, 0.02, 'triangle');
  });
}

async function playComboFallback(combo: number): Promise<void> {
  const context = getPlayableContext();

  if (!context) {
    return;
  }

  const start = context.currentTime;
  const frequencies =
    combo >= 6 ? [392, 494, 659] :
    combo >= 5 ? [349, 440, 587] :
    [330, 392];

  frequencies.forEach((frequency, index) => {
    scheduleTone(context, frequency, start + index * 0.08, 0.18, 0.035, index === frequencies.length - 1 ? 'sine' : 'triangle');
  });
}

export function getAudioEnabled(): boolean {
  return isAudioEnabled();
}

export function setAudioEnabled(enabled: boolean): void {
  cachedPreference = enabled;

  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUDIO_STORAGE_KEY, enabled ? '1' : '0');
}

export async function resumeAudio(): Promise<void> {
  const context = getAudioContext();

  warmAudioAssets();

  if (!context || !isAudioEnabled()) {
    return;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }
}

export async function playPlacementAudio(category: GridPlacement['category']): Promise<void> {
  if (!isAudioEnabled()) {
    return;
  }

  await resumeAudio();

  const played =
    category === 'rhyme'
      ? await playAsset('rhyme', { playbackRate: 1, volume: 0.76 })
      : await playAsset('hit', {
          playbackRate: category === 'rare' ? 1.08 : 1,
          volume: category === 'rare' ? 0.76 : 0.7,
        });

  if (!played) {
    await playPlacementFallback(category);
  }
}

export async function playMistakeAudio(): Promise<void> {
  if (!isAudioEnabled()) {
    return;
  }

  await resumeAudio();

  const played = await playAsset('mistake', { playbackRate: 1, volume: 0.5 });

  if (!played) {
    await playMistakeFallback();
  }
}

export async function playStageCueAudio(cue: string, variant: 'intro' | 'transition' | 'victory' = 'intro'): Promise<void> {
  if (!isAudioEnabled()) {
    return;
  }

  await resumeAudio();

  const baseRate = 0.94 + (cueRoot(cue) % 8) * 0.015;
  const played =
    variant === 'victory'
      ? await playAsset('victory', { playbackRate: 1, volume: 0.78 })
      : await playAsset('stageIntro', {
          playbackRate: variant === 'transition' ? Math.min(1.12, baseRate + 0.06) : baseRate,
          volume: variant === 'transition' ? 0.44 : 0.52,
        });

  if (!played) {
    await playStageFallback(cue, variant);
  }
}

export async function playComboAudio(combo: number): Promise<void> {
  if (!isAudioEnabled()) {
    return;
  }

  await resumeAudio();

  const played = await playAsset('combo', {
    playbackRate: combo >= 6 ? 1.08 : combo >= 4 ? 1.03 : 1,
    volume: combo >= 5 ? 0.82 : 0.74,
  });

  if (!played) {
    await playComboFallback(combo);
  }
}
