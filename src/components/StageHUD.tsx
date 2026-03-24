interface StageHUDProps {
  trailTitle: string;
  stageLabel: string;
  stageOrder: number;
  totalStages: number;
  pressureText: string;
  score: number;
  combo: number;
  comboActive: boolean;
  timeLeft: number;
  maxTime: number;
  targetProgress: number;
  targetTotal: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function StageHUD({
  trailTitle,
  stageLabel,
  stageOrder,
  totalStages,
  pressureText,
  score,
  combo,
  comboActive,
  timeLeft,
  maxTime,
  targetProgress,
  targetTotal,
  audioEnabled,
  onToggleAudio,
}: StageHUDProps) {
  const ratio = Math.max(0, Math.min(1, timeLeft / maxTime));
  const urgencyClass = ratio <= 0.25 ? 'is-critical' : ratio <= 0.5 ? 'is-warning' : 'is-calm';

  return (
    <header className={`stage-hud ${urgencyClass}`}>
      <div className="stage-hud-brand">
        <div className="brand-stack" aria-hidden="true">
          <div className="brand-hat brand-hat-small" />
          <div className="brand-bloom brand-bloom-small" />
        </div>
        <div className="stage-hud-brand-copy">
          <div>
            <p className="eyebrow">{'Mandacar\u00FA'}</p>
            <strong>{trailTitle}</strong>
            <span>{stageLabel}</span>
          </div>
          <p className="stage-hud-pressure">{pressureText}</p>
          <ol className="stage-progress-strip" aria-label="Progresso da trilha">
            {Array.from({ length: totalStages }, (_, index) => {
              const state =
                index + 1 < stageOrder ? 'is-complete' :
                index + 1 === stageOrder ? 'is-current' :
                '';

              return (
                <li className={state} key={index}>
                  <span>{index + 1}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="hud-pill hud-pill-score">
        <span className="hud-label">Pontos</span>
        <strong>{score}</strong>
      </div>

      <div className="hud-pill hud-pill-progress">
        <span className="hud-label">Achadas</span>
        <strong>
          {targetProgress}/{targetTotal}
        </strong>
      </div>

      <div className={`hud-pill hud-pill-combo ${comboActive ? 'is-active' : ''}`}>
        <span className="hud-label">Combo</span>
        <strong>x{combo}</strong>
      </div>

      <div className="hud-pill hud-pill-timer">
        <span className="hud-label">Tempo</span>
        <strong>{formatTime(timeLeft)}</strong>
        <div className="timer-bar">
          <span style={{ transform: `scaleX(${ratio})` }} />
        </div>
      </div>

      <button
        className={`hud-pill hud-pill-audio ${audioEnabled ? '' : 'is-muted'}`.trim()}
        onClick={onToggleAudio}
        type="button"
      >
        <span className="hud-label">Som</span>
        <strong>{audioEnabled ? 'Ligado' : 'Mute'}</strong>
      </button>
    </header>
  );
}
