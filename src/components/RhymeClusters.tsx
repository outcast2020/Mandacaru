import type { RhymeCluster } from '../types/poetry';

interface RhymeClustersProps {
  title: string;
  subtitle: string;
  clusters: RhymeCluster[];
}

export function RhymeClusters({ title, subtitle, clusters }: RhymeClustersProps) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Banco de rimas</p>
          <h2>{title}</h2>
        </div>
        <p>{subtitle}</p>
      </div>

      <div className="cluster-list">
        {clusters.map((cluster) => (
          <div className="cluster-card" key={cluster.rhyme_key}>
            <span className="cluster-key">{cluster.rhyme_key}</span>
            <strong>{cluster.frequency} usos</strong>
            <p>{cluster.unique_words.slice(0, 4).join(', ')}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
