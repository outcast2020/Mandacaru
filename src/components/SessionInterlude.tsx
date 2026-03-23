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
  onContinue,
}: SessionInterludeProps) {
  return (
    <section className="session-card session-interlude">
      <p className="eyebrow">Ato {stageOrder} de {totalStages}</p>
      <h2>{beat}</h2>
      <p className="session-lead">{message}</p>

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
          {isFinalStage ? 'Ver resultado final' : `Seguir para ${title}`}
        </button>
      </div>
    </section>
  );
}
