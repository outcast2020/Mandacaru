interface CordelPanelProps {
  title: string;
  scenePrompt: string;
  objectiveLabel: string;
  lines: string[];
  compact: boolean;
  onToggle: () => void;
}

export function CordelPanel({ title, scenePrompt, objectiveLabel, lines, compact, onToggle }: CordelPanelProps) {
  return (
    <section className={`cordel-panel ${compact ? 'is-compact' : 'is-focus'}`}>
      <div className="cordel-header">
        <div>
          <p className="eyebrow">Estrofe da etapa</p>
          <h2>{title}</h2>
        </div>
        <button className="toggle-button" onClick={onToggle} type="button">
          {compact ? 'Ver estrofe' : 'Modo compacto'}
        </button>
      </div>

      <p className="scene-prompt">{scenePrompt}</p>
      <p className="objective-banner">{objectiveLabel}</p>

      <div className="stanza-lines" aria-live="polite">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  );
}
