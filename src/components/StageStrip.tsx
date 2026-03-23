import type { TrailStage } from '../types/content';

interface StageStripProps {
  stages: TrailStage[];
}

export function StageStrip({ stages }: StageStripProps) {
  return (
    <div className="stage-strip">
      {stages.map((stage) => (
        <article className="stage-card" key={stage.id}>
          <p className="eyebrow">Etapa {stage.order}</p>
          <h3>{stage.title}</h3>
          <p>{stage.scenePrompt}</p>
          <div className="stage-meta">
            <span>{stage.timeLimitSec}s</span>
            <span>{stage.validWords.length} alvos</span>
            <span>{stage.bonusRhymes.length} rimas</span>
          </div>
          <ul className="stage-tags">
            {stage.difficultyTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
