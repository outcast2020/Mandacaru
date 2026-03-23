import type { PoeticRhymeBank, PoeticToolkit, RhymeCluster, RhymeQuality, SpeakerId, SpeakerStats } from '../types/poetry';
import { normalizeTerminalWord } from '../utils/text';

function getEnding(value: string, size: number): string {
  const normalized = normalizeTerminalWord(value);
  return normalized.slice(Math.max(normalized.length - size, 0));
}

function getVowels(value: string): string {
  return normalizeTerminalWord(value).replace(/[^aeiou]/g, '');
}

export function classifyRhymeQuality(left: string, right: string): RhymeQuality {
  const leftNormalized = normalizeTerminalWord(left);
  const rightNormalized = normalizeTerminalWord(right);

  if (!leftNormalized || !rightNormalized) {
    return 'nenhuma';
  }

  if (getEnding(leftNormalized, 3) === getEnding(rightNormalized, 3)) {
    return 'perfeita';
  }

  if (getVowels(leftNormalized).slice(-2) === getVowels(rightNormalized).slice(-2)) {
    return 'toante';
  }

  if (getVowels(leftNormalized).slice(-1) === getVowels(rightNormalized).slice(-1)) {
    return 'assonancia';
  }

  return 'nenhuma';
}

export function getSpeakerStats(toolkit: PoeticToolkit): SpeakerStats[] {
  const speakers: SpeakerId[] = ['NARRADOR', 'AB', 'BB'];

  return speakers.map((speaker) => {
    const stanzas = toolkit.corpus.stanzas.filter((item) => item.speaker === speaker);
    const meterCounts = new Map<string, number>();

    stanzas.forEach((stanza) => {
      meterCounts.set(stanza.meter, (meterCounts.get(stanza.meter) ?? 0) + 1);
    });

    return {
      speaker,
      stanzas: stanzas.length,
      averageLineCount:
        stanzas.reduce((total, stanza) => total + stanza.line_count, 0) / Math.max(stanzas.length, 1),
      mainMeters: [...meterCounts.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 2)
        .map(([meter]) => meter),
    };
  });
}

export function getTopRhymeClusters(rhymeBank: PoeticRhymeBank, speaker: Extract<SpeakerId, 'AB' | 'BB'>, limit = 5): RhymeCluster[] {
  return [...rhymeBank[speaker].clusters]
    .sort((left, right) => right.frequency - left.frequency)
    .slice(0, limit);
}

export function getNarrativeSample(toolkit: PoeticToolkit): string[] {
  return toolkit.corpus.stanzas
    .filter((stanza) => stanza.speaker === 'NARRADOR')
    .slice(0, 2)
    .flatMap((stanza) => stanza.lines.slice(0, 2));
}
