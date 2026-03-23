import type { VerseTrainingExample } from '../types/poetry';

interface TrainingDeckProps {
  examples: VerseTrainingExample[];
}

export function TrainingDeck({ examples }: TrainingDeckProps) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Treino poetico</p>
          <h2>JSON base para sugestao AB/BB</h2>
        </div>
        <p>Seeds, contexto, metrico e palavras finais prontas para motor de IA ou ferramenta de apoio criativo.</p>
      </div>

      <div className="training-deck">
        {examples.map((example) => (
          <article className="training-card" key={example.id}>
            <div className="training-topline">
              <span className={`speaker-badge speaker-${example.speaker.toLowerCase()}`}>{example.speaker}</span>
              <span>{example.meter}</span>
              <span>{example.promptContext.rhymeMode}</span>
            </div>
            <h3>{example.inputSeed}</h3>
            <p>{example.promptContext.theme}</p>
            <ul className="inline-tags">
              {example.promptContext.topoi.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </article>
  );
}
