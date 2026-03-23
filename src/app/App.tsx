import { useEffect, useMemo, useRef, useState } from 'react';
import { CordelPanel } from '../components/CordelPanel';
import { FinalResults } from '../components/FinalResults';
import { SessionInterlude } from '../components/SessionInterlude';
import { StageHUD } from '../components/StageHUD';
import { StageSidebar } from '../components/StageSidebar';
import { WordGrid } from '../components/WordGrid';
import { getPlacementPoints, getTimeBonus } from '../game/scoring';
import { CellCoord, getCellKey, getCellsForPlacement, getPathBetween, matchPlacement } from '../game/selection';
import { getPoeticToolkit, getTrailPackage } from '../services/loaders';
import { playComboAudio } from '../services/fx';
import { getWeeklyChallenge } from '../services/challenge';
import {
  fetchRanking,
  loadLocalRanking,
  type RankingEntry,
  type RankingMode,
  type RankingScope,
  submitRanking,
} from '../services/ranking';
import { downloadCardImage, generateCardImage, shareCardImage } from '../services/share-card';
import type { GridPlacement, TrailStage } from '../types/content';

const trailPackage = getTrailPackage('trilha_feira_ao_anoitecer');
const poeticToolkit = getPoeticToolkit();
const totalStages = trailPackage.stages.length;
const narratorOpening = poeticToolkit.corpus.stanzas.find((item) => item.speaker === 'NARRADOR');

type ViewMode = 'stage' | 'interlude' | 'final';
type StageOutcome = 'won' | 'lost' | null;

interface SessionStats {
  totalRhymes: number;
  totalRare: number;
  stagesCompleted: number;
  bestCombo: number;
  totalSelections: number;
  mistakes: number;
}

interface InterludeData {
  stageTitle: string;
  beat: string;
  message: string;
  score: number;
  comboBest: number;
  foundRhymes: number;
}

interface FinalizeStageOptions {
  nextStageScore?: number;
  nextStageRhymes?: number;
}

interface ComboFxState {
  combo: number;
  message: string;
  placementWord: string;
  token: number;
}

interface CellBurstState {
  keys: string[];
  category: GridPlacement['category'];
  token: number;
}

const comboNarratives: Record<number, string> = {
  3: 'A flor do mandacaru abriu no escuro.',
  4: 'Os espinhos viraram defesa da voz.',
  5: 'A rua e o sertao rimaram juntos.',
  6: 'A cantoria floresceu acima da poeira.',
};

function getCurrentStage(stageIndex: number): TrailStage {
  return trailPackage.stages[Math.min(stageIndex, trailPackage.stages.length - 1)];
}

function getFoundPlacements(stage: TrailStage, foundIds: Set<string>): GridPlacement[] {
  return stage.gridPlacements.filter((placement) => foundIds.has(placement.id));
}

function buildInitialFeedback(): string {
  return 'Toque na primeira e na ultima letra da palavra. Se preferir, arraste pelo grid e faca a rima florescer.';
}

function getTrailMaxScore(): number {
  return trailPackage.stages.reduce((total, stage) => {
    const targets = stage.validWords.reduce((sum, target) => sum + target.points, 0);
    const rhymes = stage.bonusRhymes.reduce((sum, target) => sum + target.points, 0);
    const timeBonus = getTimeBonus(stage.timeLimitSec, trailPackage.manifest);
    return total + targets + rhymes + timeBonus;
  }, 0);
}

function getEndingKey(score: number, stagesCompleted: number): 'low' | 'mid' | 'high' {
  const maxScore = getTrailMaxScore();

  if (stagesCompleted === totalStages && score >= maxScore * 0.72) {
    return 'high';
  }

  if (stagesCompleted >= Math.ceil(totalStages / 2) || score >= maxScore * 0.38) {
    return 'mid';
  }

  return 'low';
}

function getMedal(stats: SessionStats): string {
  if (stats.stagesCompleted === totalStages && stats.mistakes === 0) {
    return 'Sem Errar';
  }

  if (stats.totalRhymes >= 5) {
    return 'Rima de Ouro';
  }

  if (stats.bestCombo >= 5) {
    return 'Poeta Veloz';
  }

  return 'Olho de Feirante';
}

export function App() {
  const weeklyChallenge = useMemo(() => getWeeklyChallenge(), []);
  const [mode, setMode] = useState<RankingMode>('casual');
  const [viewMode, setViewMode] = useState<ViewMode>('stage');
  const [stageIndex, setStageIndex] = useState(0);
  const [stageRound, setStageRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getCurrentStage(0).timeLimitSec);
  const [score, setScore] = useState(0);
  const [stageScore, setStageScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [stageBestCombo, setStageBestCombo] = useState(0);
  const [lastFoundAt, setLastFoundAt] = useState<number | null>(null);
  const [compactStanza, setCompactStanza] = useState(false);
  const [foundIds, setFoundIds] = useState<Set<string>>(() => new Set());
  const [selectionPath, setSelectionPath] = useState<CellCoord[]>([]);
  const [anchorCell, setAnchorCell] = useState<CellCoord | null>(null);
  const [dragOrigin, setDragOrigin] = useState<CellCoord | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState(buildInitialFeedback());
  const [hintUsed, setHintUsed] = useState(false);
  const [hintCell, setHintCell] = useState<CellCoord | null>(null);
  const [stageRhymes, setStageRhymes] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalRhymes: 0,
    totalRare: 0,
    stagesCompleted: 0,
    bestCombo: 0,
    totalSelections: 0,
    mistakes: 0,
  });
  const [interludeData, setInterludeData] = useState<InterludeData | null>(null);
  const [stageOutcome, setStageOutcome] = useState<StageOutcome>(null);
  const [nickname, setNickname] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [rankingSource, setRankingSource] = useState<'online' | 'local'>('local');
  const [shareNotice, setShareNotice] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [comboFx, setComboFx] = useState<ComboFxState | null>(null);
  const [cellBurst, setCellBurst] = useState<CellBurstState | null>(null);
  const [errorBurstKeys, setErrorBurstKeys] = useState<string[]>([]);

  const suppressClickRef = useRef(false);
  const comboFxTimerRef = useRef<number | null>(null);
  const cellBurstTimerRef = useRef<number | null>(null);
  const errorBurstTimerRef = useRef<number | null>(null);
  const shareCardRef = useRef<HTMLElement>(null);

  const currentStage = getCurrentStage(stageIndex);
  const foundPlacements = useMemo(() => getFoundPlacements(currentStage, foundIds), [currentStage, foundIds]);
  const foundTargetCount = foundPlacements.filter((placement) => placement.category !== 'rhyme').length;
  const targetTotal = currentStage.completionRule.requiredTargetWords;

  const rankingScope: RankingScope = useMemo(
    () => ({
      trailId: trailPackage.manifest.id,
      mode,
      seed: mode === 'challenge' ? weeklyChallenge.seed : undefined,
    }),
    [mode, weeklyChallenge.seed],
  );

  useEffect(() => {
    let active = true;

    setRanking(loadLocalRanking(rankingScope));

    void fetchRanking(rankingScope).then((response) => {
      if (!active) {
        return;
      }

      setRanking(response.entries);
      setRankingSource(response.source);
    });

    return () => {
      active = false;
    };
  }, [rankingScope]);

  useEffect(() => {
    if (viewMode !== 'stage') {
      return undefined;
    }

    if (timeLeft <= 0) {
      finalizeStage('lost');
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [timeLeft, viewMode]);

  useEffect(() => {
    if (viewMode !== 'stage') {
      return undefined;
    }

    const compactId = window.setTimeout(() => {
      setCompactStanza(true);
    }, 4200);

    return () => window.clearTimeout(compactId);
  }, [stageIndex, stageRound, viewMode]);

  useEffect(() => {
    const resetDrag = () => {
      setIsDragging(false);
      setDragOrigin(null);
    };

    window.addEventListener('pointerup', resetDrag);
    return () => window.removeEventListener('pointerup', resetDrag);
  }, []);

  useEffect(() => {
    return () => {
      if (comboFxTimerRef.current) {
        window.clearTimeout(comboFxTimerRef.current);
      }
      if (cellBurstTimerRef.current) {
        window.clearTimeout(cellBurstTimerRef.current);
      }
      if (errorBurstTimerRef.current) {
        window.clearTimeout(errorBurstTimerRef.current);
      }
    };
  }, []);

  function resetStageLocal(nextStage: TrailStage) {
    setTimeLeft(nextStage.timeLimitSec);
    setStageScore(0);
    setComboStreak(0);
    setStageBestCombo(0);
    setLastFoundAt(null);
    setCompactStanza(false);
    setFoundIds(new Set());
    setSelectionPath([]);
    setAnchorCell(null);
    setDragOrigin(null);
    setIsDragging(false);
    setFeedback(buildInitialFeedback());
    setHintUsed(false);
    setHintCell(null);
    setStageRhymes(0);
    setStageOutcome(null);
    setInterludeData(null);
    setComboFx(null);
    setCellBurst(null);
    setErrorBurstKeys([]);
  }

  function restartJourney(nextMode?: RankingMode) {
    if (nextMode) {
      setMode(nextMode);
    }

    setViewMode('stage');
    setStageIndex(0);
    setStageRound((current) => current + 1);
    setScore(0);
    setSessionStats({
      totalRhymes: 0,
      totalRare: 0,
      stagesCompleted: 0,
      bestCombo: 0,
      totalSelections: 0,
      mistakes: 0,
    });
    setNickname('');
    setScoreSaved(false);
    setShareNotice('');
    setExportStatus('');
    resetStageLocal(trailPackage.stages[0]);
  }

  function moveToNextStage() {
    const nextStageIndex = stageIndex + 1;

    if (nextStageIndex >= totalStages) {
      setViewMode('final');
      return;
    }

    setStageIndex(nextStageIndex);
    setStageRound((current) => current + 1);
    setViewMode('stage');
    resetStageLocal(trailPackage.stages[nextStageIndex]);
  }

  function clearSelection() {
    setSelectionPath([]);
    setAnchorCell(null);
    setDragOrigin(null);
    setIsDragging(false);
  }

  async function triggerComboFx(combo: number, placementWord: string, message: string) {
    setComboFx({
      combo,
      message,
      placementWord,
      token: Date.now(),
    });

    if (comboFxTimerRef.current) {
      window.clearTimeout(comboFxTimerRef.current);
    }

    comboFxTimerRef.current = window.setTimeout(() => {
      setComboFx(null);
    }, 1200);

    await playComboAudio(combo);
  }

  function triggerCellBurst(placement: GridPlacement) {
    const keys = getCellsForPlacement(placement).map(getCellKey);
    setCellBurst({
      keys,
      category: placement.category,
      token: Date.now(),
    });

    if (cellBurstTimerRef.current) {
      window.clearTimeout(cellBurstTimerRef.current);
    }

    cellBurstTimerRef.current = window.setTimeout(() => {
      setCellBurst(null);
    }, 700);
  }

  function triggerErrorBurst(path: CellCoord[]) {
    const keys = path.map(getCellKey);
    setErrorBurstKeys(keys);

    if (errorBurstTimerRef.current) {
      window.clearTimeout(errorBurstTimerRef.current);
    }

    errorBurstTimerRef.current = window.setTimeout(() => {
      setErrorBurstKeys([]);
    }, 420);
  }

  function finalizeStage(outcome: StageOutcome, options: FinalizeStageOptions = {}) {
    setStageOutcome(outcome);
    setCompactStanza(true);

    if (outcome === 'won') {
      setInterludeData({
        stageTitle: currentStage.title,
        beat: currentStage.transitionBeat,
        message: currentStage.transitionMessage,
        score: options.nextStageScore ?? stageScore,
        comboBest: stageBestCombo,
        foundRhymes: options.nextStageRhymes ?? stageRhymes,
      });

      setSessionStats((current) => ({
        ...current,
        stagesCompleted: Math.max(current.stagesCompleted, stageIndex + 1),
      }));

      setViewMode(stageIndex === totalStages - 1 ? 'final' : 'interlude');
      return;
    }

    setFeedback('O tempo secou a rodada antes da flor abrir por completo.');
    setViewMode('final');
  }

  function registerFoundPlacement(placement: GridPlacement) {
    const nextFoundIds = new Set(foundIds);
    nextFoundIds.add(placement.id);

    const basePoints = getPlacementPoints(placement, currentStage);
    const now = Date.now();
    const comboWindowMs = trailPackage.manifest.scoringProfile.comboWindowSec * 1000;
    const nextCombo = lastFoundAt && now - lastFoundAt <= comboWindowMs ? comboStreak + 1 : 1;
    const comboBonus = nextCombo >= trailPackage.manifest.scoringProfile.comboThreshold ? 10 : 0;
    const comboNarrative = comboNarratives[nextCombo] ?? '';
    const nextTargetCount = currentStage.gridPlacements.filter(
      (item) => item.category !== 'rhyme' && nextFoundIds.has(item.id),
    ).length;

    let gainedPoints = basePoints + comboBonus;
    const nextStageRhymes = stageRhymes + (placement.category === 'rhyme' ? 1 : 0);
    let nextFeedback =
      placement.category === 'rhyme'
        ? `Rima achada: ${placement.word.toLowerCase()} (+${basePoints})`
        : placement.category === 'rare'
          ? `Palavra rara: ${placement.word.toLowerCase()} (+${basePoints})`
          : `Boa! ${placement.word.toLowerCase()} (+${basePoints})`;

    if (comboBonus) {
      nextFeedback = `${nextFeedback} Combo x${nextCombo} (+${comboBonus}). ${comboNarrative}`.trim();
    }

    if (nextTargetCount >= targetTotal) {
      const bonus = getTimeBonus(timeLeft, trailPackage.manifest);
      gainedPoints += bonus;
      nextFeedback = `Etapa vencida! ${placement.word.toLowerCase()} fechou a rodada. Bonus de tempo: +${bonus}.`;
    }

    setFoundIds(nextFoundIds);
    setScore((current) => current + gainedPoints);
    setStageScore((current) => current + gainedPoints);
    setFeedback(nextFeedback);
    setHintCell(null);
    setComboStreak(nextCombo);
    setLastFoundAt(now);
    setStageBestCombo((current) => Math.max(current, nextCombo));
    setSessionStats((current) => ({
      ...current,
      totalSelections: current.totalSelections + 1,
      totalRhymes: current.totalRhymes + (placement.category === 'rhyme' ? 1 : 0),
      totalRare: current.totalRare + (placement.category === 'rare' ? 1 : 0),
      bestCombo: Math.max(current.bestCombo, nextCombo),
    }));

    if (placement.category === 'rhyme') {
      setStageRhymes((current) => current + 1);
    }

    triggerCellBurst(placement);
    clearSelection();

    if (comboBonus) {
      void triggerComboFx(nextCombo, placement.word.toLowerCase(), comboNarrative || 'A flor do mandacaru respondeu ao repente.');
    }

    if (nextTargetCount >= targetTotal) {
      finalizeStage('won', {
        nextStageScore: stageScore + gainedPoints,
        nextStageRhymes,
      });
    }
  }

  function commitSelection(path: CellCoord[]) {
    if (viewMode !== 'stage' || !path.length) {
      return;
    }

    const placement = matchPlacement(path, currentStage.gridPlacements, foundIds);

    if (!placement) {
      setFeedback('Selecao invalida. Procure uma palavra em linha reta ou diagonal para manter a flor aberta.');
      setSelectionPath(path);
      setComboStreak(0);
      triggerErrorBurst(path);
      setSessionStats((current) => ({
        ...current,
        totalSelections: current.totalSelections + 1,
        mistakes: current.mistakes + 1,
      }));
      return;
    }

    registerFoundPlacement(placement);
  }

  function handleCellPointerDown(cell: CellCoord) {
    if (viewMode !== 'stage') {
      return;
    }

    setDragOrigin(cell);
    setAnchorCell(cell);
    setSelectionPath([cell]);
    setIsDragging(true);
  }

  function handleCellPointerEnter(cell: CellCoord) {
    if (!isDragging || !dragOrigin || viewMode !== 'stage') {
      return;
    }

    const path = getPathBetween(dragOrigin, cell);
    setSelectionPath(path.length ? path : [dragOrigin]);
  }

  function handleCellPointerUp(cell: CellCoord) {
    if (!dragOrigin || viewMode !== 'stage') {
      return;
    }

    const path = getPathBetween(dragOrigin, cell);
    suppressClickRef.current = true;

    if (path.length) {
      commitSelection(path);
    } else {
      setAnchorCell(dragOrigin);
      setSelectionPath([dragOrigin]);
      setFeedback('Agora toque no fim da palavra para completar a selecao.');
    }

    setIsDragging(false);
    setDragOrigin(null);
  }

  function handleCellClick(cell: CellCoord) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (viewMode !== 'stage') {
      return;
    }

    if (!anchorCell) {
      setAnchorCell(cell);
      setSelectionPath([cell]);
      setFeedback('Inicio marcado. Agora toque na ultima letra da palavra.');
      return;
    }

    const path = getPathBetween(anchorCell, cell);

    if (!path.length) {
      setAnchorCell(cell);
      setSelectionPath([cell]);
      setFeedback('Selecao reiniciada. Escolha uma direcao reta ou diagonal.');
      return;
    }

    commitSelection(path);
  }

  function handleHint() {
    if (hintUsed || viewMode !== 'stage') {
      return;
    }

    const nextTarget = currentStage.gridPlacements.find(
      (placement) => placement.category !== 'rhyme' && !foundIds.has(placement.id),
    );

    if (!nextTarget) {
      return;
    }

    const nextHintCell = {
      row: nextTarget.start[0],
      col: nextTarget.start[1],
    };
    const penalty = trailPackage.manifest.scoringProfile.hintPenalty;

    setHintUsed(true);
    setHintCell(nextHintCell);
    setScore((current) => Math.max(0, current - penalty));
    setStageScore((current) => Math.max(0, current - penalty));
    setFeedback(`Dica ativada: siga a flor pela letra ${currentStage.grid[nextHintCell.row][nextHintCell.col]}.`);
  }

  async function handleSaveScore() {
    if (!nickname.trim() || scoreSaved) {
      return;
    }

    const entry: RankingEntry = {
      id: `${Date.now()}-${nickname.trim().toLowerCase()}`,
      name: nickname.trim(),
      score,
      medal: getMedal(sessionStats),
      stagesCompleted: sessionStats.stagesCompleted,
      totalStages,
      createdAt: new Date().toISOString(),
      mode,
      seed: rankingScope.seed,
      trailId: trailPackage.manifest.id,
    };

    const response = await submitRanking(rankingScope, entry);
    setRanking(response.entries);
    setRankingSource(response.source);
    setScoreSaved(true);
  }

  function buildShareText(): string {
    return trailPackage.manifest.shareTemplate
      .replace('{score}', String(score))
      .replace('{trailTitle}', trailPackage.manifest.title)
      .replace('{medal}', getMedal(sessionStats));
  }

  async function handleExportCard() {
    if (!shareCardRef.current) {
      setExportStatus('Nao foi possivel localizar o card para exportacao.');
      return;
    }

    try {
      const card = await generateCardImage(shareCardRef.current, `${trailPackage.manifest.id}-${score}.png`);
      downloadCardImage(card);
      setExportStatus('Card exportado em PNG.');
    } catch {
      setExportStatus('Nao foi possivel gerar a imagem do card.');
    }
  }

  async function handleShare() {
    const shareText = buildShareText();

    if (!shareCardRef.current) {
      setShareNotice('Nao foi possivel localizar o card para compartilhar.');
      return;
    }

    try {
      const card = await generateCardImage(shareCardRef.current, `${trailPackage.manifest.id}-${score}.png`);
      const shared = await shareCardImage(card, shareText, trailPackage.manifest.title);

      if (shared) {
        setShareNotice('PNG compartilhado com sucesso.');
        return;
      }

      await navigator.clipboard?.writeText(shareText);
      setShareNotice('Seu dispositivo nao compartilhou o PNG. O convite em texto foi copiado.');
    } catch {
      setShareNotice('Nao foi possivel compartilhar agora.');
    }
  }

  const endingKey = getEndingKey(score, sessionStats.stagesCompleted);
  const ending = trailPackage.manifest.finale.performanceMessages[endingKey];
  const medal = getMedal(sessionStats);

  return (
    <div className="game-shell">
      <section className="play-hero">
        <div className="hero-night-sky" aria-hidden="true" />
        <div className="hero-cactus-sigil" aria-hidden="true" />
        <div className="play-hero-curtain play-hero-curtain-left" aria-hidden="true" />
        <div className="play-hero-curtain play-hero-curtain-right" aria-hidden="true" />

        <div className="play-hero-brand">
          <div className="brand-stack" aria-hidden="true">
            <div className="brand-hat" />
            <div className="brand-bloom" />
          </div>
          <div>
            <p className="eyebrow">Jornada completa</p>
            <h1>Mandacarú</h1>
            <p className="hero-subtitle">rima que resiste</p>
          </div>
        </div>

        <div className="play-hero-copy">
          <p className="hero-kicker">
            A flor do mandacaru abre no seco. O jogo cruza sertao, cordel, quadras e rimas urbanas em atos curtos de palavra, voz e resistencia.
          </p>
          <p>{trailPackage.manifest.description}</p>
          {narratorOpening ? (
            <blockquote className="hero-quote">
              {narratorOpening.lines.slice(0, 2).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </blockquote>
          ) : null}
        </div>

        <div className="play-hero-meta">
          <div>
            <span className="meta-label">Modo</span>
            <div className="mode-switch">
              <button
                className={`mode-chip ${mode === 'casual' ? 'is-active' : ''}`}
                onClick={() => restartJourney('casual')}
                type="button"
              >
                Casual
              </button>
              <button
                className={`mode-chip ${mode === 'challenge' ? 'is-active' : ''}`}
                onClick={() => restartJourney('challenge')}
                type="button"
              >
                Desafio semanal
              </button>
            </div>
          </div>
          <div>
            <span className="meta-label">Seca simbolica</span>
            <strong>{trailPackage.manifest.socialContext.threat}</strong>
          </div>
          <div>
            <span className="meta-label">Seed da semana</span>
            <strong>{mode === 'challenge' ? weeklyChallenge.seed : 'Livre'}</strong>
          </div>
        </div>
      </section>

      {viewMode === 'stage' ? (
        <>
          <StageHUD
            combo={comboStreak}
            comboActive={Boolean(comboFx)}
            maxTime={currentStage.timeLimitSec}
            score={score}
            stageLabel={`${mode === 'challenge' ? 'Desafio' : 'Ato'} ${currentStage.order} de ${totalStages}`}
            targetProgress={foundTargetCount}
            targetTotal={targetTotal}
            timeLeft={timeLeft}
            trailTitle={trailPackage.manifest.title}
          />

          <main className="play-layout">
            <section className="play-main">
              {comboFx ? (
                <div className="combo-burst" key={comboFx.token}>
                  <span className="combo-burst-label">Combo x{comboFx.combo}</span>
                  <strong>{comboFx.placementWord}</strong>
                  <p>{comboFx.message}</p>
                </div>
              ) : null}

              <CordelPanel
                compact={compactStanza}
                lines={currentStage.narrativeStanza}
                objectiveLabel={currentStage.objectiveLabel}
                onToggle={() => setCompactStanza((current) => !current)}
                scenePrompt={currentStage.scenePrompt}
                title={currentStage.title}
              />

              <div className="grid-instructions">
                <p>Toque na primeira e na ultima letra da palavra.</p>
                <p>Se preferir, arraste na horizontal, vertical ou diagonal.</p>
                <p>{mode === 'challenge' ? `${weeklyChallenge.label}: mesma seed para todos.` : 'Combo entra quando os acertos chegam na mesma florada do repente.'}</p>
              </div>

              <WordGrid
                burstCategory={cellBurst?.category ?? null}
                burstKeys={cellBurst?.keys ?? []}
                errorKeys={errorBurstKeys}
                foundPlacements={foundPlacements}
                grid={currentStage.grid}
                hintCell={hintCell}
                onCellClick={handleCellClick}
                onCellPointerDown={handleCellPointerDown}
                onCellPointerEnter={handleCellPointerEnter}
                onCellPointerUp={handleCellPointerUp}
                selectionPath={selectionPath}
              />
            </section>

            <StageSidebar
              canUseHint={!hintUsed}
              feedback={feedback}
              foundIds={foundIds}
              manifest={trailPackage.manifest}
              onHint={handleHint}
              stage={currentStage}
            />
          </main>
        </>
      ) : null}

      {viewMode === 'interlude' && interludeData ? (
        <SessionInterlude
          beat={interludeData.beat}
          comboBest={interludeData.comboBest}
          foundRhymes={interludeData.foundRhymes}
          isFinalStage={stageIndex === totalStages - 1}
          message={interludeData.message}
          onContinue={moveToNextStage}
          score={interludeData.score}
          stageOrder={stageIndex + 1}
          title={trailPackage.stages[stageIndex + 1]?.title ?? 'resultado final'}
          totalStages={totalStages}
        />
      ) : null}

      {viewMode === 'final' ? (
        <>
          <FinalResults
            bestCombo={sessionStats.bestCombo}
            cardRef={shareCardRef}
            ending={ending}
            exportStatus={exportStatus}
            isSaved={scoreSaved}
            medal={medal}
            nickname={nickname}
            onExportCard={handleExportCard}
            onNicknameChange={setNickname}
            onReplay={restartJourney}
            onSaveScore={handleSaveScore}
            onShare={handleShare}
            ranking={ranking}
            rankingMode={mode}
            rankingSource={rankingSource}
            score={score}
            shareCta={trailPackage.manifest.shareCard.cta}
            shareHeadline={trailPackage.manifest.shareCard.headline}
            stagesCompleted={sessionStats.stagesCompleted}
            totalRhymes={sessionStats.totalRhymes}
            totalStages={totalStages}
            trailTitle={trailPackage.manifest.title}
          />

          {shareNotice ? <p className="share-notice">{shareNotice}</p> : null}
          {stageOutcome === 'lost' ? (
            <p className="share-notice share-notice-warning">
              A jornada terminou antes do fim da trilha. Voce chegou ate o ato {stageIndex + 1}.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
