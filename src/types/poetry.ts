export type SpeakerId = 'AB' | 'BB' | 'NARRADOR';
export type RhymeQuality = 'perfeita' | 'toante' | 'assonancia' | 'nenhuma';

export interface CorpusStanza {
  id: number;
  speaker: SpeakerId;
  section: string;
  meter: string;
  line_count: number;
  rhyme_scheme_estimated: string;
  end_words: string[];
  lines: string[];
}

export interface PoeticCorpus {
  title: string;
  source_note: string;
  automatic_analysis_note: string;
  stanzas: CorpusStanza[];
  rhyme_bank: unknown;
}

export interface RhymeCluster {
  rhyme_key: string;
  frequency: number;
  unique_words: string[];
}

export interface SpeakerRhymeBank {
  total_line_endings: number;
  unique_line_endings: string[];
  clusters: RhymeCluster[];
}

export interface PoeticRhymeBank {
  AB: SpeakerRhymeBank;
  BB: SpeakerRhymeBank;
}

export interface PoeticMetadata {
  $schema?: string;
  schemaVersion: string;
  id: string;
  title: string;
  themes: string[];
  tone: string[];
  toponyms: string[];
  sertaoImagery: string[];
  culturalEntities: string[];
  rhymeModes: Array<{
    id: RhymeQuality | 'assonancia';
    label: string;
    description: string;
  }>;
  speakerProfiles: Record<
    SpeakerId,
    {
      label: string;
      traits: string[];
      themes: string[];
    }
  >;
}

export interface VerseTrainingExample {
  id: string;
  speaker: Extract<SpeakerId, 'AB' | 'BB'>;
  section: string;
  meter: string;
  sourceStanzaId: number;
  promptContext: {
    theme: string;
    tone: string[];
    topoi: string[];
    rhymeMode: RhymeQuality | 'assonancia';
  };
  inputSeed: string;
  targetLines: string[];
  endWords: string[];
}

export interface VerseTrainingSet {
  $schema?: string;
  schemaVersion: string;
  id: string;
  title: string;
  source: string;
  examples: VerseTrainingExample[];
}

export interface PoeticToolkit {
  corpus: PoeticCorpus;
  rhymeBank: PoeticRhymeBank;
  metadata: PoeticMetadata;
  training: VerseTrainingSet;
}

export interface SpeakerStats {
  speaker: SpeakerId;
  stanzas: number;
  averageLineCount: number;
  mainMeters: string[];
}
