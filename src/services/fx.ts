let audioContext: AudioContext | null = null;

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

function scheduleTone(context: AudioContext, frequency: number, startAt: number, duration: number, gainValue: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.connect(gain);
  gain.connect(context.destination);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

export async function playComboAudio(combo: number): Promise<void> {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  const start = context.currentTime;
  const frequencies =
    combo >= 6 ? [392, 494, 659] :
    combo >= 5 ? [349, 440, 587] :
    [330, 392];

  frequencies.forEach((frequency, index) => {
    scheduleTone(context, frequency, start + index * 0.08, 0.18, 0.035);
  });
}
