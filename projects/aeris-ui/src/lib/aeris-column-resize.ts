export interface AerisInternalResizableColumn {
  readonly field: string;
  readonly width?: string;
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

export function aerisInternalMeasureColumnWidths(header: HTMLElement | null): ReadonlyMap<string, number> {
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

export function aerisInternalApplyMeasuredColumnWidths<TColumn extends AerisInternalResizableColumn>(
  columns: readonly TColumn[],
  widths: ReadonlyMap<string, number>,
): readonly TColumn[] {
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
