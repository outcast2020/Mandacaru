interface StageHUDProps {
  trailTitle: string;
  stageLabel: string;
  score: number;
  combo: number;
  comboActive: boolean;
  timeLeft: number;
  maxTime: number;
  targetProgress: number;
  targetTotal: number;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function StageHUD({
  trailTitle,
  stageLabel,
  score,
  combo,
  comboActive,
  timeLeft,
  maxTime,
  targetProgress,
  targetTotal,
}: StageHUDProps) {
  const ratio = Math.max(0, Math.min(1, timeLeft / maxTime));

  return (
    <header className="stage-hud">
      <div className="stage-hud-brand">
        <div className="brand-stack" aria-hidden="true">
          <div className="brand-hat brand-hat-small" />
          <div className="brand-bloom brand-bloom-small" />
        </div>
        <div>
          <p className="eyebrow">{'Mandacar\u00FA'}</p>
          <strong>{trailTitle}</strong>
          <span>{stageLabel}</span>
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
    </header>
  );
}
