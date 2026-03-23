import type { GridPlacement } from '../types/content';

export interface CellCoord {
  row: number;
  col: number;
}

export function getCellKey(cell: CellCoord): string {
  return `${cell.row}:${cell.col}`;
}

export function getPathBetween(start: CellCoord, end: CellCoord): CellCoord[] {
  const rowDelta = end.row - start.row;
  const colDelta = end.col - start.col;

  const rowStep = Math.sign(rowDelta);
  const colStep = Math.sign(colDelta);
  const absRow = Math.abs(rowDelta);
  const absCol = Math.abs(colDelta);

  const isHorizontal = rowDelta === 0 && absCol > 0;
  const isVertical = colDelta === 0 && absRow > 0;
  const isDiagonal = absRow === absCol && absRow > 0;

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [];
  }

  const steps = Math.max(absRow, absCol);
  const cells: CellCoord[] = [];

  for (let index = 0; index <= steps; index += 1) {
    cells.push({
      row: start.row + rowStep * index,
      col: start.col + colStep * index,
    });
  }

  return cells;
}

function sameCell(left: CellCoord, right: CellCoord): boolean {
  return left.row === right.row && left.col === right.col;
}

export function matchPlacement(path: CellCoord[], placements: GridPlacement[], foundIds: Set<string>): GridPlacement | null {
  if (!path.length) {
    return null;
  }

  const first = path[0];
  const last = path[path.length - 1];

  for (const placement of placements) {
    if (foundIds.has(placement.id) || path.length !== placement.word.length) {
      continue;
    }

    const start: CellCoord = { row: placement.start[0], col: placement.start[1] };
    const end: CellCoord = { row: placement.end[0], col: placement.end[1] };

    const forward = sameCell(first, start) && sameCell(last, end);
    const reverse = sameCell(first, end) && sameCell(last, start);

    if (forward || reverse) {
      return placement;
    }
  }

  return null;
}

export function getCellsForPlacement(placement: GridPlacement): CellCoord[] {
  return getPathBetween(
    { row: placement.start[0], col: placement.start[1] },
    { row: placement.end[0], col: placement.end[1] },
  );
}
