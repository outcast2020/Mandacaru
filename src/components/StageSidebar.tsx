import type { TrailManifest, TrailStage } from '../types/content';

interface StageSidebarProps {
  manifest: TrailManifest;
  stage: TrailStage;
  foundIds: Set<string>;
  onHint: () => void;
  canUseHint: boolean;
  feedback: string;
  stageFocus: string;
  comboPrompt: string;
  pressureText: string;
}

function isFound(word: string, stage: TrailStage, foundIds: Set<string>): boolean {
  const upperWord = word.toUpperCase();
  return stage.gridPlacements.some((placement) => placement.word === upperWord && foundIds.has(placement.id));
}

export function StageSidebar({
  manifest,
  stage,
  foundIds,
  onHint,
  canUseHint,
  feedback,
  stageFocus,
  comboPrompt,
  pressureText,
}: StageSidebarProps) {
  return (
    <aside className="stage-sidebar">
      <article className="side-card">
        <p className="eyebrow">Missao</p>
        <h3>{stage.transitionBeat}</h3>
        <p>{stage.transitionMessage}</p>
        <div className="mission-tags">
          <span>{stageFocus}</span>
          <span>{pressureText}</span>
        </div>
      </article>

      <article className="side-card">
        <div className="side-card-header">
          <div>
            <p className="eyebrow">Palavras-alvo</p>
            <h3>Procura principal</h3>
          </div>
          <button className="hint-button" disabled={!canUseHint} onClick={onHint} type="button">
            {canUseHint ? `Dica (-${manifest.scoringProfile.hintPenalty})` : 'Dica usada'}
          </button>
        </div>

        <ul className="target-list">
          {stage.validWords.map((target) => (
            <li className={isFound(target.word, stage, foundIds) ? 'is-found' : ''} key={target.word}>
              <span>{target.word}</span>
              <strong>{target.points}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="side-card">
        <p className="eyebrow">Rimas bonus</p>
        <h3>Selos poeticos</h3>
        <p>{comboPrompt}</p>
        <ul className="target-list target-list-rhyme">
          {stage.bonusRhymes.map((target) => (
            <li className={isFound(target.word, stage, foundIds) ? 'is-found' : ''} key={target.word}>
              <span>
                {target.word} / {target.rhymesWith}
              </span>
              <strong>{target.points}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="side-card side-card-feedback">
        <p className="eyebrow">Feedback</p>
        <h3>{feedback}</h3>
      </article>
    </aside>
  );
}
