import { forwardRef } from 'react';

interface ShareCardPreviewProps {
  trailTitle: string;
  headline: string;
  cta: string;
  medal: string;
  score: number;
  ending: string;
}

export const ShareCardPreview = forwardRef<HTMLElement, ShareCardPreviewProps>(function ShareCardPreview(
  { trailTitle, headline, cta, medal, score, ending },
  ref,
) {
  return (
    <article className="share-card-preview" ref={ref}>
      <div className="share-card-hat" aria-hidden="true" />
      <div className="share-card-bloom" aria-hidden="true" />
      <p className="eyebrow">Card compartilhavel</p>
      <h2>{headline}</h2>
      <p className="share-card-trail">{trailTitle}</p>
      <div className="share-card-score">{score}</div>
      <p className="share-card-medal">{medal}</p>
      <p className="share-card-ending">{ending}</p>
      <footer>
        <strong>{'Mandacar\u00FA: rima que resiste'}</strong>
        <span>{cta}</span>
      </footer>
    </article>
  );
});
