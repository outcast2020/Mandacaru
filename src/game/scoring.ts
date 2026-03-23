import type { GridPlacement, TrailManifest, TrailStage, WordTarget } from '../types/content';

export function getPlacementPoints(placement: GridPlacement, stage: TrailStage): number {
  if (placement.category === 'rhyme') {
    return stage.bonusRhymes.find((item) => item.word.toUpperCase() === placement.word)?.points ?? 30;
  }

  const target = stage.validWords.find((item) => item.word.toUpperCase() === placement.word) as WordTarget | undefined;
  return target?.points ?? 0;
}

export function getTimeBonus(secondsLeft: number, manifest: TrailManifest): number {
  const step = manifest.scoringProfile.timeBonusStepSec;
  const chunks = Math.floor(secondsLeft / step);
  return chunks * manifest.scoringProfile.timeBonusPoints;
}
