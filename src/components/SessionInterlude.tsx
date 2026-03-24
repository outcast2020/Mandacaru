interface SessionInterludeProps {
  stageOrder: number;
  totalStages: number;
  title: string;
  beat: string;
  message: string;
  score: number;
  comboBest: number;
  foundRhymes: number;
  isFinalStage: boolean;
  nextFocus: string;
  watermarkUrl: string;
  onContinue: () => void;
}

export function SessionInterlude({
  stageOrder,
  totalStages,
  title,
  beat,
  message,
  score,
  comboBest,
  foundRhymes,
  isFinalStage,
  nextFocus,
  watermarkUrl,
  onContinue,
}: SessionInterludeProps) {
  return (
    <section className="session-card session-interlude">
      <img alt="" aria-hidden="true" className="session-watermark" decoding="async" loading="lazy" src={watermarkUrl} />
      <p className="eyebrow">
        Ato {stageOrder} de {totalStages}
      </p>
      <h2>{beat}</h2>
      <p className="session-lead">{message}</p>
      <p className="session-next-focus">{nextFocus}</p>

      <div className="session-metrics">
        <div>
          <span className="meta-label">Pontuacao</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span className="meta-label">Melhor combo</span>
          <strong>x{comboBest}</strong>
        </div>
        <div>
          <span className="meta-label">Rimas achadas</span>
          <strong>{foundRhymes}</strong>
        </div>
      </div>

      <div className="session-actions">
        <button className="replay-button" onClick={onContinue} type="button">
          {isFinalStage ? 'Receber a consagracao final' : `Seguir para ${title}`}
        </button>
      </div>
    </section>
  );
}
