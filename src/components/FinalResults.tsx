import { RefObject, useMemo } from 'react';
import { ShareCardPreview } from './ShareCardPreview';
import type { RankingEntry, RankingMode } from '../services/ranking';

interface FinalResultsProps {
  trailTitle: string;
  ending: string;
  shareHeadline: string;
  shareCta: string;
  medal: string;
  score: number;
  stagesCompleted: number;
  totalStages: number;
  totalRhymes: number;
  bestCombo: number;
  rankingMode: RankingMode;
  rankingSource: 'online' | 'local';
  nickname: string;
  isSaved: boolean;
  ranking: RankingEntry[];
  cardRef: RefObject<HTMLElement>;
  exportStatus: string;
  onNicknameChange: (value: string) => void;
  onSaveScore: () => void;
  onShare: () => void;
  onExportCard: () => void;
  onReplay: () => void;
}

export function FinalResults({
  trailTitle,
  ending,
  shareHeadline,
  shareCta,
  medal,
  score,
  stagesCompleted,
  totalStages,
  totalRhymes,
  bestCombo,
  rankingMode,
  rankingSource,
  nickname,
  isSaved,
  ranking,
  cardRef,
  exportStatus,
  onNicknameChange,
  onSaveScore,
  onShare,
  onExportCard,
  onReplay,
}: FinalResultsProps) {
  const rankingPosition = useMemo(
    () => ranking.findIndex((entry) => entry.name === nickname && entry.score === score) + 1,
    [nickname, ranking, score],
  );

  return (
    <section className="final-layout">
      <article className="session-card final-summary">
        <p className="eyebrow">Desfecho da jornada</p>
        <h2>{medal}</h2>
        <p className="session-lead">{ending}</p>

        <div className="session-metrics">
          <div>
            <span className="meta-label">Pontuacao final</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span className="meta-label">Etapas</span>
            <strong>
              {stagesCompleted}/{totalStages}
            </strong>
          </div>
          <div>
            <span className="meta-label">Rimas</span>
            <strong>{totalRhymes}</strong>
          </div>
          <div>
            <span className="meta-label">Melhor combo</span>
            <strong>x{bestCombo}</strong>
          </div>
        </div>

        <div className="ranking-save">
          <label className="nickname-field">
            <span className="meta-label">Apelido para ranking</span>
            <input
              maxLength={18}
              onChange={(event) => onNicknameChange(event.target.value)}
              placeholder="Seu nome de peleja"
              type="text"
              value={nickname}
            />
          </label>

          <div className="session-actions">
            <button className="replay-button" disabled={!nickname.trim() || isSaved} onClick={onSaveScore} type="button">
              {isSaved ? 'Pontuacao salva' : 'Salvar no ranking'}
            </button>
            <button className="ghost-button" onClick={onExportCard} type="button">
              Baixar card PNG
            </button>
            <button className="ghost-button" onClick={onShare} type="button">
              Compartilhar convite
            </button>
            <button className="ghost-button" onClick={onReplay} type="button">
              Jogar de novo
            </button>
          </div>

          {rankingPosition > 0 ? (
            <p className="ranking-note">Posicao atual no ranking local: #{rankingPosition}</p>
          ) : null}
          {exportStatus ? <p className="ranking-note">{exportStatus}</p> : null}
          <p className="ranking-note">
            Ranking em modo {rankingMode === 'challenge' ? 'desafio semanal' : 'casual'} via {rankingSource === 'online' ? 'online' : 'fallback local'}.
          </p>
        </div>
      </article>

      <ShareCardPreview
        ref={cardRef}
        cta={shareCta}
        ending={ending}
        headline={shareHeadline}
        medal={medal}
        score={score}
        trailTitle={trailTitle}
      />

      <article className="session-card leaderboard-card">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Ranking local</p>
            <h2>Top 10 da trilha</h2>
          </div>
          <p>{rankingSource === 'online' ? 'Sincronizado com o endpoint configurado.' : 'Persistido no navegador para validar o loop competitivo do beta.'}</p>
        </div>

        <ol className="leaderboard-list">
          {ranking.length ? (
            ranking.map((entry, index) => (
              <li key={entry.id}>
                <span className="leaderboard-rank">#{index + 1}</span>
                <div className="leaderboard-nameplate">
                  <strong>{entry.name}</strong>
                  <span>{entry.medal}</span>
                </div>
                <span className="leaderboard-score">{entry.score}</span>
              </li>
            ))
          ) : (
            <li className="leaderboard-empty">Ainda nao ha pontuacoes salvas nesta trilha.</li>
          )}
        </ol>
      </article>
    </section>
  );
}
