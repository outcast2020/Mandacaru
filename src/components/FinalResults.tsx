import { RefObject, useMemo } from 'react';
import { ShareCardPreview } from './ShareCardPreview';
import type { RankingEntry, RankingMode } from '../services/ranking';

interface FinalResultsProps {
  trailTitle: string;
  finaleTitle: string;
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
  rankingPosition: number;
  watermarkUrl: string;
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
  finaleTitle,
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
  rankingPosition,
  watermarkUrl,
  cardRef,
  exportStatus,
  onNicknameChange,
  onSaveScore,
  onShare,
  onExportCard,
  onReplay,
}: FinalResultsProps) {
  const topThree = useMemo(() => ranking.slice(0, 3), [ranking]);

  return (
    <section className="final-layout">
      <article className="session-card final-summary final-hero-card">
        <img alt="" aria-hidden="true" className="session-watermark final-watermark" decoding="async" loading="lazy" src={watermarkUrl} />
        <div className="final-hero-copy">
          <p className="eyebrow">Consagracao da jornada</p>
          <h2>{finaleTitle}</h2>
          <p className="session-lead">{ending}</p>
        </div>

        <div className="final-score-slab">
          <span className="meta-label">Score total</span>
          <strong>{score}</strong>
          <span className="final-medal-chip">{medal}</span>
        </div>

        <div className="final-spotlights">
          <div className="final-spotlight">
            <span className="meta-label">Ranking</span>
            <strong>{rankingPosition > 0 ? `#${rankingPosition}` : 'Top 10'}</strong>
            <span>{rankingPosition > 0 ? 'Posicao atual da peleja' : 'Salve o apelido para entrar'}</span>
          </div>
          <div className="final-spotlight">
            <span className="meta-label">Etapas</span>
            <strong>
              {stagesCompleted}/{totalStages}
            </strong>
            <span>Trilha concluida ate o fim da noite</span>
          </div>
          <div className="final-spotlight">
            <span className="meta-label">Fluxo</span>
            <strong>x{bestCombo}</strong>
            <span>{totalRhymes} rimas bonus encontradas</span>
          </div>
        </div>

        <div className="ranking-save">
          <label className="nickname-field">
            <span className="meta-label">Assine sua conquista</span>
            <input
              maxLength={18}
              onChange={(event) => onNicknameChange(event.target.value)}
              placeholder="Seu nome de peleja"
              type="text"
              value={nickname}
            />
          </label>

          <div className="session-actions final-primary-actions">
            <button className="replay-button challenge-button" onClick={onShare} type="button">
              Desafiar outro jogador
            </button>
            <button className="ghost-button" disabled={!nickname.trim() || isSaved} onClick={onSaveScore} type="button">
              {isSaved ? 'Ranking salvo' : 'Salvar no ranking'}
            </button>
            <button className="ghost-button" onClick={onExportCard} type="button">
              Baixar card
            </button>
            <button className="ghost-button" onClick={onReplay} type="button">
              Jogar novamente
            </button>
          </div>

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
        rankingPosition={rankingPosition}
        score={score}
        trailTitle={trailTitle}
      />

      <article className="session-card leaderboard-card">
        <img alt="" aria-hidden="true" className="session-watermark leaderboard-watermark" decoding="async" loading="lazy" src={watermarkUrl} />
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Ranking da trilha</p>
            <h2>Quem manteve a flor aberta</h2>
          </div>
          <p>{rankingSource === 'online' ? 'Sincronizado com o endpoint configurado.' : 'Persistido no navegador para validar o loop competitivo do beta.'}</p>
        </div>

        {topThree.length ? (
          <div className="leaderboard-podium" aria-label="Destaques do ranking">
            {topThree.map((entry, index) => (
              <article className={`podium-slot podium-slot-${index + 1}`} key={entry.id}>
                <span className="podium-rank">#{index + 1}</span>
                <div className="leaderboard-avatar" aria-hidden="true">
                  {entry.name.slice(0, 1).toUpperCase()}
                </div>
                <strong>{entry.name}</strong>
                <span>{entry.medal}</span>
                <b>{entry.score}</b>
              </article>
            ))}
          </div>
        ) : null}

        <ol className="leaderboard-list">
          {ranking.length ? (
            ranking.map((entry, index) => (
              <li className={entry.score === score && entry.name === nickname ? 'is-player-entry' : ''} key={entry.id}>
                <span className="leaderboard-rank">#{index + 1}</span>
                <div className="leaderboard-avatar" aria-hidden="true">
                  {entry.name.slice(0, 1).toUpperCase()}
                </div>
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
