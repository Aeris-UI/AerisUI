import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';
import { aerisInternalCreateFrameScheduler } from './aeris-frame-scheduler';

export type AerisTableColumnPin = 'start' | 'end';
export interface AerisTablePinnedRows {
  readonly top: readonly string[];
  readonly bottom: readonly string[];
}

export function aerisInternalOrderPinnedColumns<
  T extends { readonly pinned?: AerisTableColumnPin },
>(columns: readonly T[]): readonly T[] {
  if (!columns.some((column) => column.pinned)) return columns;
  return [
    ...columns.filter((column) => column.pinned === 'start'),
    ...columns.filter((column) => !column.pinned),
    ...columns.filter((column) => column.pinned === 'end'),
  ];
}

export function aerisInternalPinnedRowSides(
  pins: AerisTablePinnedRows,
): ReadonlyMap<string, 'top' | 'bottom'> {
  const result = new Map<string, 'top' | 'bottom'>();
  for (const key of pins.bottom) if (key.trim()) result.set(key, 'bottom');
  for (const key of pins.top) if (key.trim()) result.set(key, 'top');
  return result;
}

export function aerisInternalOrderPinnedRows<T>(
  rows: readonly T[],
  sides: ReadonlyMap<string, 'top' | 'bottom'>,
  key: (row: T) => string,
): readonly T[] {
  if (!sides.size) return rows;
  const top: T[] = [],
    middle: T[] = [],
    bottom: T[] = [];
  for (const row of rows) {
    const side = sides.get(key(row));
    (side === 'top' ? top : side === 'bottom' ? bottom : middle).push(row);
  }
  return [...top, ...middle, ...bottom];
}

/** Measured sticky geometry shared by Table and TreeTable; no per-cell listeners. */
@Directive({
  selector: '[aerisInternalTablePinning]',
  host: { '[attr.data-sticky-header]': 'aerisInternalTablePinning()' },
})
export class ɵAerisTablePinning {
  readonly aerisInternalTablePinning = input(true);
  private readonly viewport = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly scheduler = aerisInternalCreateFrameScheduler(() => this.measure());
  private resizeObserver: ResizeObserver | null = null;
  private readonly observed = new Set<Element>();
  private started = false;

  constructor() {
    effect(() => {
      this.aerisInternalTablePinning();
      if (this.started) this.scheduler.schedule();
    });
    afterNextRender(() => {
      this.started = true;
      if (typeof ResizeObserver !== 'undefined')
        this.resizeObserver = new ResizeObserver(() => this.scheduler.schedule());
      const mutations = new MutationObserver(() => this.scheduler.schedule());
      mutations.observe(this.viewport, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-pinned-column', 'data-pinned-row'],
      });
      this.measure();
      this.destroyRef.onDestroy(() => mutations.disconnect());
    });
    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.observed.clear();
      this.scheduler.cancel();
    });
  }

  private measure(): void {
    if (this.destroyRef.destroyed) return;
    const table = this.viewport.querySelector('table');
    if (!table) return;
    const headers = Array.from(table.tHead?.rows ?? []);
    const headerCells = Array.from(headers[0]?.cells ?? []);
    const rows = Array.from(table.tBodies[0]?.rows ?? []);
    const pinnedRows = rows.filter((row) => row.hasAttribute('data-pinned-row'));
    const wanted = new Set<Element>([
      this.viewport,
      table,
      ...headers,
      ...headerCells,
      ...pinnedRows,
    ]);
    for (const element of this.observed)
      if (!wanted.has(element)) {
        this.resizeObserver?.unobserve(element);
        this.observed.delete(element);
      }
    for (const element of wanted)
      if (!this.observed.has(element)) {
        this.observed.add(element);
        this.resizeObserver?.observe(element);
      }

    const stacked = getComputedStyle(table).display === 'block';
    let headerHeight = 0;
    for (const header of headers) {
      header.style.setProperty('--aeris-table-header-offset', `${headerHeight}px`);
      headerHeight += header.getBoundingClientRect().height;
    }
    const headerDisabled = stacked || headerHeight > Math.max(0, this.viewport.clientHeight - 44);
    this.viewport.toggleAttribute('data-pin-header-disabled', headerDisabled);
    if (!this.aerisInternalTablePinning() || headerDisabled) headerHeight = 0;
    const offsets = new Map<string, { side: string; offset: number }>();
    let start = 0,
      end = 0;
    for (const cell of headerCells)
      if (cell.dataset['pinnedColumn'] === 'start') {
        offsets.set(cell.dataset['field'] ?? '', { side: 'start', offset: start });
        start += cell.getBoundingClientRect().width;
      }
    for (const cell of [...headerCells].reverse())
      if (cell.dataset['pinnedColumn'] === 'end') {
        offsets.set(cell.dataset['field'] ?? '', { side: 'end', offset: end });
        end += cell.getBoundingClientRect().width;
      }
    const inlineDisabled = stacked || start + end > Math.max(0, this.viewport.clientWidth - 44);
    this.viewport.toggleAttribute('data-pin-inline-disabled', inlineDisabled);
    for (const cell of table.querySelectorAll<HTMLElement>(
      ':scope > thead > tr > th[data-pinned-column], :scope > tbody > tr > td[data-pinned-column]',
    )) {
      const pin = offsets.get(cell.dataset['field'] ?? '');
      cell.style.setProperty(
        '--aeris-table-pin-start',
        pin?.side === 'start' ? `${pin.offset}px` : 'auto',
      );
      cell.style.setProperty(
        '--aeris-table-pin-end',
        pin?.side === 'end' ? `${pin.offset}px` : 'auto',
      );
    }
    let top = 0,
      bottom = 0;
    for (const row of pinnedRows)
      if (row.dataset['pinnedRow'] === 'top') {
        row.style.setProperty('--aeris-table-row-offset', `${headerHeight + top}px`);
        top += row.getBoundingClientRect().height;
      }
    for (const row of [...pinnedRows].reverse())
      if (row.dataset['pinnedRow'] === 'bottom') {
        row.style.setProperty('--aeris-table-row-offset', `${bottom}px`);
        bottom += row.getBoundingClientRect().height;
      }
    const blockDisabled =
      stacked || top + bottom > Math.max(0, this.viewport.clientHeight - headerHeight - 44);
    this.viewport.toggleAttribute('data-pin-block-disabled', blockDisabled);
    this.viewport.style.scrollPaddingBlockStart = `${headerHeight + (blockDisabled ? 0 : top)}px`;
    this.viewport.style.scrollPaddingBlockEnd = `${blockDisabled ? 0 : bottom}px`;
    this.viewport.style.scrollPaddingInlineStart = `${inlineDisabled ? 0 : start}px`;
    this.viewport.style.scrollPaddingInlineEnd = `${inlineDisabled ? 0 : end}px`;
  }
}
