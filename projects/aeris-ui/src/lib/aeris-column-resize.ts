export interface AerisInternalResizableColumn {
  readonly field: string;
  readonly width?: string;
}

export interface AerisInternalSeparatorValue {
  readonly min: number;
  readonly max: number;
  readonly now: number;
}

export function aerisInternalColumnSeparatorValues(
  widths: readonly (string | undefined)[],
  minColumnWidth: number,
): readonly AerisInternalSeparatorValue[] {
  const percentages = widths.map((width) =>
    width?.trim().endsWith('%') ? Number.parseFloat(width) : Number.NaN,
  );
  if (percentages.every(Number.isFinite)) {
    let position = 0;
    return percentages.slice(0, -1).map((width) => {
      position += width;
      return { min: 0, max: 100, now: Math.min(100, Math.max(0, position)) };
    });
  }

  const pixels = widths.map(aerisInternalColumnWidthPixels);
  const total = pixels.reduce((sum, width) => sum + width, 0);
  let position = 0;
  return pixels.slice(0, -1).map((width, index) => {
    position += width;
    return {
      min: minColumnWidth * (index + 1),
      max: Math.max(
        minColumnWidth * (index + 1),
        total - minColumnWidth * (pixels.length - index - 1),
      ),
      now: position,
    };
  });
}

export function aerisInternalPixelWidth(width: number): string {
  return `${Math.round(width * 100) / 100}px`;
}

export function aerisInternalColumnWidthPixels(width: string | undefined): number {
  if (!width) return 160;
  const value = Number.parseFloat(width);
  if (!Number.isFinite(value)) return 160;
  return width.trim().endsWith('rem') ? value * 16 : value;
}

export function aerisInternalClampColumnResizeDelta(
  delta: number,
  width: number,
  adjacentWidth: number,
  minimumWidth: number,
): number {
  const minimum = Math.max(0, minimumWidth);
  const minimumDelta = Math.min(0, minimum - width);
  const maximumDelta = Math.max(0, adjacentWidth - minimum);
  return Math.min(maximumDelta, Math.max(minimumDelta, delta));
}

export function aerisInternalSetColumnPairWidths<TColumn extends AerisInternalResizableColumn>(
  columns: readonly TColumn[],
  field: string,
  adjacentField: string,
  width: number,
  adjacentWidth: number,
): readonly TColumn[] {
  const nextWidth = aerisInternalPixelWidth(width);
  const nextAdjacentWidth = aerisInternalPixelWidth(adjacentWidth);
  return columns.map((column) => {
    if (column.field === field) return { ...column, width: nextWidth };
    if (column.field === adjacentField) return { ...column, width: nextAdjacentWidth };
    return column;
  });
}

export function aerisInternalMeasureColumnWidths(
  header: HTMLElement | null,
): ReadonlyMap<string, number> {
  const widths = new Map<string, number>();
  const row = header?.closest('tr');
  if (!row) return widths;
  row.querySelectorAll<HTMLElement>('th[data-field]').forEach((cell) => {
    const field = cell.dataset['field'];
    const width = cell.getBoundingClientRect().width;
    if (field && width > 0) widths.set(field, width);
  });
  return widths;
}

export function aerisInternalApplyMeasuredColumnWidths<
  TColumn extends AerisInternalResizableColumn,
>(columns: readonly TColumn[], widths: ReadonlyMap<string, number>): readonly TColumn[] {
  return columns.map((column) => {
    const width = widths.get(column.field);
    return width == null ? column : { ...column, width: aerisInternalPixelWidth(width) };
  });
}

export function aerisInternalColumnResizeDirection(element: HTMLElement): 1 | -1 {
  return element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl' ? -1 : 1;
}

export function aerisInternalListenForColumnResize(
  document: Document,
  move: (event: PointerEvent) => void,
  end: (event: PointerEvent) => void,
): () => void {
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
  return () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', end);
    document.removeEventListener('pointercancel', end);
  };
}
