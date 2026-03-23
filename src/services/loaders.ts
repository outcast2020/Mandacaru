import rootCorpusData from '../../peleja_bulebule_barreto_estruturada.json';
import rootRhymeBankData from '../../banco_de_rimas_bulebule_barreto.json';
import contentIndexData from '../../content/index.json';
import poeticMetadataData from '../../content/corpus/peleja.metadata.json';
import verseTrainingData from '../../content/corpus/verse-training.ab-bb.json';
import type {
  ContentIndex,
  ThemeDictionary,
  TrailArtMap,
  TrailManifest,
  TrailPackage,
  TrailStage,
} from '../types/content';
import type { PoeticToolkit, PoeticCorpus, PoeticMetadata, PoeticRhymeBank, VerseTrainingSet } from '../types/poetry';
import { sanitizeImportedData } from '../utils/text';

type JsonModule<T> = T | { default: T };

const themeModules = import.meta.glob('../../content/dictionaries/themes/*.json', {
  eager: true,
}) as Record<string, JsonModule<ThemeDictionary>>;

const trailModules = import.meta.glob('../../content/trails/*/trail.json', {
  eager: true,
}) as Record<string, JsonModule<TrailManifest>>;

const stageModules = import.meta.glob('../../content/trails/*/words.stage-*.json', {
  eager: true,
}) as Record<string, JsonModule<TrailStage>>;

const artModules = import.meta.glob('../../content/trails/*/art-map.json', {
  eager: true,
}) as Record<string, JsonModule<TrailArtMap>>;

function unwrapModule<T>(module: JsonModule<T>): T {
  return (module as { default?: T }).default ?? (module as T);
}

function findByPath<T>(modules: Record<string, JsonModule<T>>, pathFragment: string): T {
  const match = Object.entries(modules).find(([path]) => path.includes(pathFragment));

  if (!match) {
    throw new Error(`Conteudo nao encontrado: ${pathFragment}`);
  }

  return sanitizeImportedData(unwrapModule(match[1]));
}

export function getContentIndex(): ContentIndex {
  return sanitizeImportedData(contentIndexData as ContentIndex);
}

export function getThemeDictionary(themeId: string): ThemeDictionary {
  const slug = themeId.replace(/^theme_/, '');
  return findByPath(themeModules, `/themes/${slug}.json`);
}

export function getTrailManifest(trailId: string): TrailManifest {
  return findByPath(trailModules, `/${trailId}/trail.json`);
}

export function getTrailArtMap(trailId: string): TrailArtMap {
  return findByPath(artModules, `/${trailId}/art-map.json`);
}

export function getTrailStages(trailId: string, stageFiles: string[]): TrailStage[] {
  return stageFiles
    .map((fileName) => findByPath(stageModules, `/${trailId}/${fileName}`))
    .sort((left, right) => left.order - right.order);
}

export function getTrailPackage(trailId: string): TrailPackage {
  const manifest = getTrailManifest(trailId);
  const artMap = getTrailArtMap(trailId);
  const stages = getTrailStages(trailId, manifest.stageFiles);

  return {
    manifest,
    artMap,
    stages,
  };
}

export function getPoeticToolkit(): PoeticToolkit {
  return {
    corpus: sanitizeImportedData(rootCorpusData as PoeticCorpus),
    rhymeBank: sanitizeImportedData(rootRhymeBankData as PoeticRhymeBank),
    metadata: sanitizeImportedData(poeticMetadataData as PoeticMetadata),
    training: sanitizeImportedData(verseTrainingData as VerseTrainingSet),
  };
}
