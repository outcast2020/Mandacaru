import { forwardRef } from 'react';

interface ShareCardPreviewProps {
  trailTitle: string;
  headline: string;
  cta: string;
  medal: string;
  score: number;
  ending: string;
  rankingPosition: number;
}

export const ShareCardPreview = forwardRef<HTMLElement, ShareCardPreviewProps>(function ShareCardPreview(
  { trailTitle, headline, cta, medal, score, ending, rankingPosition },
  ref,
) {
  return (
    <article className="share-card-preview" ref={ref}>
      <div className="share-card-hat" aria-hidden="true" />
      <div className="share-card-bloom" aria-hidden="true" />
      <div className="share-card-city" aria-hidden="true" />
      <div className="share-card-seal" aria-hidden="true">
        <span>Cordel 2.0</span>
      </div>
      <p className="eyebrow">Card compartilhavel</p>
      <h2>{headline}</h2>
      <p className="share-card-trail">{trailTitle}</p>
      <div className="share-card-score">{score}</div>
      <p className="share-card-medal">{medal}</p>
      <p className="share-card-ending">{ending}</p>
      <p className="share-card-ranking">{rankingPosition > 0 ? `Ranking atual: #${rankingPosition}` : 'Entre no top 10 da trilha'}</p>
      <div className="share-card-challenge">{cta}</div>
      <footer>
        <strong>{'Mandacar\u00FA: rima que resiste'}</strong>
        <span>Chame outra voz</span>
      </footer>
    </article>
  );
});
