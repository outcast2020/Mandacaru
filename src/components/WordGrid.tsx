import type { GridPlacement } from '../types/content';
import type { CellCoord } from '../game/selection';
import { getCellKey } from '../game/selection';

interface WordGridProps {
  grid: string[];
  selectionPath: CellCoord[];
  foundPlacements: GridPlacement[];
  hintCell: CellCoord | null;
  burstKeys: string[];
  burstCategory: GridPlacement['category'] | null;
  errorKeys: string[];
  onCellPointerDown: (cell: CellCoord) => void;
  onCellPointerEnter: (cell: CellCoord) => void;
  onCellPointerUp: (cell: CellCoord) => void;
  onCellClick: (cell: CellCoord) => void;
}

export function WordGrid({
  grid,
  selectionPath,
  foundPlacements,
  hintCell,
  burstKeys,
  burstCategory,
  errorKeys,
  onCellPointerDown,
  onCellPointerEnter,
  onCellPointerUp,
  onCellClick,
}: WordGridProps) {
  const selected = new Set(selectionPath.map(getCellKey));
  const burstSet = new Set(burstKeys);
  const errorSet = new Set(errorKeys);
  const foundMap = new Map<string, GridPlacement['category']>();

  foundPlacements.forEach((placement) => {
    const rowDelta = Math.sign(placement.end[0] - placement.start[0]);
    const colDelta = Math.sign(placement.end[1] - placement.start[1]);
    const steps = Math.max(Math.abs(placement.end[0] - placement.start[0]), Math.abs(placement.end[1] - placement.start[1]));

    for (let index = 0; index <= steps; index += 1) {
      const key = `${placement.start[0] + rowDelta * index}:${placement.start[1] + colDelta * index}`;
      foundMap.set(key, placement.category);
    }
  });

  return (
    <section className="word-grid-panel">
      <div
        className="grid-frame"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.split('').map((letter, colIndex) => {
            const cell = { row: rowIndex, col: colIndex };
            const key = getCellKey(cell);
            const foundCategory = foundMap.get(key);

            return (
              <button
                aria-pressed={selected.has(key)}
                className={[
                  'grid-cell',
                  selected.has(key) ? 'is-selected' : '',
                  hintCell && getCellKey(hintCell) === key ? 'is-hinted' : '',
                  burstSet.has(key) && burstCategory ? `is-burst is-burst-${burstCategory}` : '',
                  errorSet.has(key) ? 'is-error' : '',
                  foundCategory ? `is-found is-found-${foundCategory}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={key}
                onClick={() => onCellClick(cell)}
                onPointerDown={() => onCellPointerDown(cell)}
                onPointerEnter={() => onCellPointerEnter(cell)}
                onPointerUp={() => onCellPointerUp(cell)}
                type="button"
              >
                <span className="grid-cell-letter">{letter}</span>
                <span className="grid-cell-flare" aria-hidden="true" />
              </button>
            );
          }),
        )}
      </div>
    </section>
  );
}
