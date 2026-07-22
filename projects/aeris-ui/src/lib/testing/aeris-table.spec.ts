import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  AerisTable,
  AerisTableContextMenuModule,
  AerisTableModule,
  type AerisTableColumn,
  type AerisTableColumnReorderEvent,
  type AerisTableColumnResizeEvent,
  type AerisTableContextMenuEvent,
  type AerisTableData,
  type AerisTableSelectionEvent,
  type AerisTableSortEvent,
} from '../../../table/aeris-table';

@Component({
  imports: [AerisTableModule],
  template: `
    <aeris-table
      caption="Team members"
      rowKeyField="id"
      [data]="members"
      [columns]="columns"
      [editable]="editable()"
      [gridlines]="gridlines()"
      [(sort)]="sort"
      [(selectedKeys)]="selectedKeys"
      [(expandedKeys)]="expandedKeys"
      [(filterValue)]="filterValue"
      [(columnFilters)]="columnFilters"
      globalFilter
      columnFilter
      paginator
      [rows]="2"
      [rowsPerPageOptions]="[2, 3]"
      selectionMode="multiple"
      expandableRows
      (sorted)="lastSort.set($event)"
      (selectionChanged)="lastSelection.set($event)"
    >
      <ng-template aerisTableCell let-value let-column="column">
        @if (column.field === 'status') {
          <strong>{{ value }}</strong>
        } @else {
          {{ value }}
        }
      </ng-template>
      <ng-template aerisTableExpansion let-row>
        {{ row['name'] }} works on {{ row['team'] }}.
      </ng-template>
    </aeris-table>
  `,
})
class TableTestHost {
  readonly filterValue = signal('');
  readonly sort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  readonly selectedKeys = signal<readonly string[]>([]);
  readonly expandedKeys = signal<readonly string[]>([]);
  readonly columnFilters = signal<Readonly<Record<string, string>>>({});
  readonly editable = signal(false);
  readonly gridlines = signal(false);
  readonly lastSort = signal<AerisTableSortEvent | null>(null);
  readonly lastSelection = signal<AerisTableSelectionEvent | null>(null);
  readonly columns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'team', header: 'Team', sortable: true },
    { field: 'status', header: 'Status' },
  ];
  readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
    { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
  ];
}

@Component({
  imports: [AerisTableContextMenuModule],
  template: `
    <aeris-table
      rowKeyField="id"
      [data]="members"
      [columns]="columns"
      [contextMenu]="menu"
      [(contextMenuRow)]="contextMenuRow"
      [(contextMenuRowKey)]="contextMenuRowKey"
      [contextMenuDisabled]="contextMenuDisabled"
      (contextMenuOpened)="lastContextMenu.set($event)"
    />
    <aeris-context-menu #menu [model]="menuItems" ariaLabel="Member actions" />
  `,
})
class TableContextMenuHost {
  readonly contextMenuRow = signal<AerisTableData | null>(null);
  readonly contextMenuRowKey = signal('');
  readonly lastContextMenu = signal<AerisTableContextMenuEvent | null>(null);
  contextMenuDisabled = (row: AerisTableData) => row['id'] === '2';
  readonly columns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'team', header: 'Team' },
  ];
  readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design' },
    { id: '2', name: 'Noah Williams', team: 'Engineering' },
  ];
  readonly menuItems = [{ label: 'Open profile' }, { label: 'Copy member link' }];
}

@Component({
  imports: [AerisTableModule],
  template: `
    <aeris-table
      [data]="members"
      [(columns)]="columns"
      resizableColumns
      reorderableColumns
      showOverflowTooltip
      [minColumnWidth]="80"
      (columnResized)="resized.set($event)"
      (columnReordered)="reordered.set($event)"
    />
  `,
})
class TableResizeHost {
  readonly columns = signal<readonly AerisTableColumn[]>([
    { field: 'name', header: 'Name', width: '180px' },
    { field: 'team', header: 'Team', width: '160px' },
  ]);
  readonly members: readonly AerisTableData[] = [{ id: '1', name: 'Maya Chen', team: 'Design' }];
  readonly resized = signal<AerisTableColumnResizeEvent | null>(null);
  readonly reordered = signal<AerisTableColumnReorderEvent | null>(null);
}

describe('AerisTable', () => {
  it('renders native table semantics with caption and paginated rows', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const caption = fixture.nativeElement.querySelector('caption') as HTMLElement;
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(table).not.toBeNull();
    expect(caption.textContent).toContain('Team members');
    expect(rows.length).toBe(2);
    expect(table.textContent).toContain('Maya Chen');
    expect(table.textContent).toContain('Noah Williams');
    const nameHeader = fixture.nativeElement.querySelector(
      '.aeris-table__header-label',
    ) as HTMLElement;
    expect(nameHeader.textContent).toContain('Name');
    expect(nameHeader.hasAttribute('title')).toBe(false);
    expect(fixture.nativeElement.querySelector('thead aeris-checkbox')).not.toBeNull();

    const frame = fixture.nativeElement.querySelector('.aeris-table__frame') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-table__viewport') as HTMLElement;
    expect(frame.contains(viewport)).toBe(true);
    expect(getComputedStyle(frame).overflow).toBe('hidden');
    expect(getComputedStyle(viewport).overflow).toBe('auto');
  });

  it('sorts rows and emits sort metadata', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const sortButtons = fixture.nativeElement.querySelectorAll(
      '.aeris-table__sort',
    ) as NodeListOf<HTMLButtonElement>;
    sortButtons.item(0).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sort()).toEqual({
      field: 'name',
      direction: 'asc',
    });
    expect(fixture.componentInstance.lastSort()?.sort?.field).toBe('name');

    sortButtons.item(0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()?.direction).toBe('desc');
  });

  it('filters records and resets to the first page', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const filter = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    filter.value = 'sofia';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sofia Rossi');
    expect(fixture.nativeElement.textContent).not.toContain('Maya Chen');
    expect(fixture.componentInstance.filterValue()).toBe('sofia');
  });

  it('filters records by column', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const filters = fixture.nativeElement.querySelectorAll(
      '.aeris-table__filter-row input',
    ) as NodeListOf<HTMLInputElement>;
    filters.item(1).value = 'research';
    filters.item(1).dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sofia Rossi');
    expect(fixture.nativeElement.textContent).not.toContain('Maya Chen');
    expect(fixture.componentInstance.columnFilters()['team']).toBe('research');
  });

  it('identifies editable cells', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.componentInstance.editable.set(true);
    await fixture.whenStable();

    const editableCell = fixture.nativeElement.querySelector('tbody td[data-editable]');

    expect(editableCell).not.toBeNull();
  });

  it('uses table gridlines for the complete column including filter cells', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    fixture.componentInstance.gridlines.set(true);
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector('.aeris-table') as HTMLElement;
    expect(root.hasAttribute('data-gridlines')).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.aeris-table__filter-row th').length).toBe(
      fixture.componentInstance.columns.length + 2,
    );
  });

  it('resizes adjacent columns without changing their combined width', async () => {
    const fixture = TestBed.createComponent(TableResizeHost);
    await fixture.whenStable();

    const separator = fixture.nativeElement.querySelector('.aeris-table__resize') as HTMLElement;
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-label')).toBe('Resize Name column');

    separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.columns().map((column) => column.width)).toEqual([
      '196px',
      '144px',
    ]);
    expect(fixture.componentInstance.resized()?.field).toBe('name');
  });

  it('preserves total width during pointer column resizing', async () => {
    const fixture = TestBed.createComponent(TableResizeHost);
    await fixture.whenStable();
    const headers = fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>;
    const separator = fixture.nativeElement.querySelector('.aeris-table__resize') as HTMLElement;
    vi.spyOn(headers.item(0), 'getBoundingClientRect').mockReturnValue({ width: 180 } as DOMRect);
    vi.spyOn(headers.item(1), 'getBoundingClientRect').mockReturnValue({ width: 160 } as DOMRect);

    separator.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 124, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 124, bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.columns().map((column) => column.width)).toEqual([
      '204px',
      '136px',
    ]);
    expect(fixture.componentInstance.resized()?.width).toBe('204px');
  });

  it('reorders columns with accessible keyboard controls', async () => {
    const fixture = TestBed.createComponent(TableResizeHost);
    await fixture.whenStable();
    const header = fixture.nativeElement.querySelector(
      'th .aeris-table__header-label',
    ) as HTMLElement;

    expect(header.closest('th')?.getAttribute('draggable')).toBe('true');
    header.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.columns().map((column) => column.field)).toEqual([
      'team',
      'name',
    ]);
    expect(fixture.componentInstance.reordered()?.toIndex).toBe(1);
  });

  it('shows an Aeris tooltip only for truncated table values when enabled', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TableResizeHost);
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('.aeris-table__cell-content') as HTMLElement;
    Object.defineProperties(cell, {
      clientWidth: { configurable: true, value: 80 },
      scrollWidth: { configurable: true, value: 160 },
    });

    cell.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(300);
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Maya Chen');

    cell.dispatchEvent(new Event('pointerleave'));
    fixture.destroy();
    vi.useRealTimers();
  });

  it('supports selection and row expansion', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const rowCheckboxes = fixture.nativeElement.querySelectorAll(
      'tbody input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    rowCheckboxes.item(0).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedKeys()).toEqual(['1']);
    expect(fixture.componentInstance.lastSelection()?.row['name']).toBe('Maya Chen');

    const expand = fixture.nativeElement.querySelector(
      '.aeris-table__icon-button',
    ) as HTMLButtonElement;
    expand.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedKeys()).toEqual(['1']);
    expect(fixture.nativeElement.textContent).toContain('Maya Chen works on Design');
  });

  it('exports CSV and exposes public state helpers', async () => {
    const fixture = TestBed.createComponent(TableTestHost);
    await fixture.whenStable();

    const table = fixture.debugElement.query(By.directive(AerisTable))
      .componentInstance as AerisTable;

    const csv = table.exportCSV({ download: false, rows: 'all' });
    expect(csv).toContain('"Name","Team","Status"');
    expect(csv).toContain('"Maya Chen","Design","Active"');

    table.filter('maya');
    fixture.detectChanges();
    expect(fixture.componentInstance.filterValue()).toBe('maya');

    const state = table.saveState();
    table.clearFilters();
    table.restoreState(state);
    fixture.detectChanges();

    expect(fixture.componentInstance.filterValue()).toBe('maya');
    expect(table.exportCSV({ download: false, rows: 'filtered' })).toContain('Maya Chen');
  });

  it('neutralizes spreadsheet formulas in CSV exports', async () => {
    const fixture = TestBed.createComponent(AerisTable);
    fixture.componentRef.setInput('columns', [{ field: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('data', [{ name: '=HYPERLINK("https://example.invalid")' }]);
    fixture.detectChanges();
    await fixture.whenStable();

    const csv = fixture.componentInstance.exportCSV({ download: false });
    expect(csv).toBe('"Name"\r\n"\'=HYPERLINK(""https://example.invalid"")"');
  });

  it('opens a bound context menu from data rows and exposes context row state', async () => {
    const fixture = TestBed.createComponent(TableContextMenuHost);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll(
      'tbody tr',
    ) as NodeListOf<HTMLTableRowElement>;
    rows.item(0).dispatchEvent(contextMenuEvent(120, 140));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;

    expect(panel).toBeTruthy();
    expect(panel.textContent).toContain('Open profile');
    expect(fixture.componentInstance.contextMenuRowKey()).toBe('1');
    expect(fixture.componentInstance.contextMenuRow()?.['name']).toBe('Maya Chen');
    expect(fixture.componentInstance.lastContextMenu()?.rowIndex).toBe(0);
    expect(fixture.componentInstance.lastContextMenu()?.key).toBe('1');
    expect(rows.item(0).getAttribute('data-context-menu-active')).toBe('true');
  });

  it('does not suppress native row context menus when context menu integration is disabled for a row', async () => {
    const fixture = TestBed.createComponent(TableContextMenuHost);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll(
      'tbody tr',
    ) as NodeListOf<HTMLTableRowElement>;
    const prevented = !rows.item(1).dispatchEvent(contextMenuEvent(120, 140));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(prevented).toBe(false);
    expect(document.querySelector('.aeris-context-menu__panel')).toBeNull();
    expect(fixture.componentInstance.contextMenuRowKey()).toBe('');
    expect(fixture.componentInstance.lastContextMenu()).toBeNull();
  });
});

function contextMenuEvent(x: number, y: number): MouseEvent {
  return new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
}
