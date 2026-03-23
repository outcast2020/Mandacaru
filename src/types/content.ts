export type Difficulty = 'easy' | 'normal' | 'hard';
export type WordCategory = 'common' | 'rare' | 'rhyme';
export type GridDirection = 'E' | 'S' | 'SE' | 'NE';

export interface ContentIndexEntry {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  difficulty: Difficulty;
  estimatedDurationMin: number;
  manifest: string;
  theme: string;
  tags: string[];
}

export interface ContentIndex {
  $schema?: string;
  schemaVersion: string;
  appId: 'mandacaru';
  defaultTrailId: string;
  trails: ContentIndexEntry[];
}

export interface ThemeDictionary {
  $schema?: string;
  schemaVersion: string;
  id: string;
  title: string;
  contexts: string[];
  commonWords: string[];
  rareWords: string[];
  bonusRhymes: Array<{
    word: string;
    rhymesWith: string;
  }>;
  ambientWords: string[];
}

export interface TrailManifest {
  $schema?: string;
  schemaVersion: string;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  theme: {
    palette: string;
    symbol: string;
    texture: string;
  };
  hero: {
    name: string;
    role: string;
    avatar: string;
    narrativeObject: string;
  };
  socialContext: {
    location: string;
    topics: string[];
    threat: string;
  };
  artDirection: {
    visualMood: string;
    motionPreset: string;
    shareCardLayout: string;
  };
  unlockRule: {
    type: 'default-open' | 'score-gated' | 'progress-gated';
    minimumScore?: number;
  };
  scoringProfile: {
    common: number;
    rare: number;
    rhyme: number;
    timeBonusStepSec: number;
    timeBonusPoints: number;
    comboWindowSec: number;
    comboThreshold: number;
    comboMultiplierCap: number;
    hintPenalty: number;
  };
  stageFiles: string[];
  finale: {
    title: string;
    text: string;
    performanceMessages: {
      low: string;
      mid: string;
      high: string;
    };
  };
  shareTemplate: string;
  shareCard: {
    headline: string;
    cta: string;
    badgeStyle: string;
    formats: string[];
  };
}

export interface WordTarget {
  word: string;
  category: Exclude<WordCategory, 'rhyme'>;
  points: 10 | 20;
}

export interface RhymeTarget {
  word: string;
  rhymesWith: string;
  points: 30;
  tag: 'curated';
}

export interface GridPlacement {
  id: string;
  word: string;
  category: WordCategory;
  start: [number, number];
  end: [number, number];
  direction: GridDirection;
}

export interface TrailStage {
  $schema?: string;
  schemaVersion: string;
  trailId: string;
  id: string;
  order: number;
  title: string;
  timeLimitSec: number;
  scenePrompt: string;
  objectiveLabel: string;
  narrativeStanza: string[];
  grid: string[];
  validWords: WordTarget[];
  rareWords: string[];
  bonusRhymes: RhymeTarget[];
  gridPlacements: GridPlacement[];
  hint: {
    uses: 0 | 1;
    penalty: number;
    behavior: 'highlight-first-letter';
  };
  completionRule: {
    requiredTargetWords: number;
    bonusWordsOptional: boolean;
  };
  transitionMessage: string;
  transitionBeat: string;
  difficultyTags: string[];
  audioCue: string;
}

export interface TrailArtMap {
  trailId: string;
  brandMark: string;
  heroAvatar: string;
  backgroundPreset: string;
  paperTexture: string;
  inkStyle: string;
  hudAccent: string;
  transitionMotion: string;
  shareCardFrame: string;
  trophyStyle: string;
}

export interface TrailPackage {
  manifest: TrailManifest;
  artMap: TrailArtMap;
  stages: TrailStage[];
}
