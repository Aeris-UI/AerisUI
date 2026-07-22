import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AerisTreeTable,
  AerisTreeTableModule,
  type AerisTreeTableCellEditEvent,
  type AerisTreeTableColumn,
  type AerisTreeTableColumnReorderEvent,
  type AerisTreeTableColumnResizeEvent,
  type AerisTreeTableData,
  type AerisTreeTableLazyLoadEvent,
  type AerisTreeTableNode,
} from '../../../tree-table/aeris-tree-table';

type FileRow = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
};

const COLUMNS: readonly AerisTreeTableColumn[] = [
  { field: 'name', header: 'Name', sortable: true, filterable: true, frozen: true, width: '12rem' },
  {
    field: 'size',
    header: 'Size',
    sortable: true,
    filterable: true,
    editable: true,
    width: '8rem',
    align: 'end',
  },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
];

const NODES: readonly AerisTreeTableNode<FileRow>[] = [
  {
    key: 'workspace',
    data: { name: 'Workspace', size: 24, type: 'folder' },
    children: [
      {
        key: 'src',
        data: { name: 'Source', size: 16, type: 'folder' },
        children: [
          { key: 'app', data: { name: 'app.ts', size: 4, type: 'typescript' }, leaf: true },
        ],
      },
      { key: 'readme', data: { name: 'README.md', size: 8, type: 'document' }, leaf: true },
    ],
  },
  {
    key: 'archive',
    data: { name: 'Archive', size: 40, type: 'folder' },
    disabled: true,
    leaf: true,
  },
];

@Component({
  imports: [AerisTreeTableModule],
  template: `
    <aeris-tree-table
      #table
      ariaLabel="Project file hierarchy"
      caption="Project files"
      [selectionMode]="selectionMode()"
      [globalFilter]="globalFilter()"
      [columnFilter]="columnFilter()"
      [gridlines]="gridlines()"
      [paginator]="paginator()"
      [lazy]="lazy()"
      [totalRecords]="100"
      [loading]="loading()"
      [editable]="editable()"
      [resizableColumns]="resizable()"
      [reorderableColumns]="reorderable()"
      [showOverflowTooltip]="showOverflowTooltip()"
      [responsiveMode]="responsiveMode()"
      [(value)]="nodes"
      [(columns)]="columns"
      [(expandedKeys)]="expandedKeys"
      [(selectionKeys)]="selectionKeys"
      [(sorts)]="sorts"
      [(globalFilterValue)]="query"
      [(columnFilters)]="filters"
      [(first)]="first"
      [(rows)]="rows"
      (nodeExpanded)="expandedEvent.set($event.key)"
      (selectionChanged)="selectionEvent.set($event.key)"
      (lazyLoad)="lazyEvent.set($event)"
      (cellEdited)="editEvent.set($event)"
      (columnResized)="resizeEvent.set($event)"
      (columnReordered)="reorderEvent.set($event)"
    />
  `,
})
class TreeTableTestHost {
  readonly table = viewChild.required<AerisTreeTable<FileRow>>('table');
  readonly nodes = signal(NODES);
  readonly columns = signal(COLUMNS);
  readonly expandedKeys = signal<readonly string[]>([]);
  readonly selectionKeys = signal<readonly string[]>([]);
  readonly sorts = signal<
    readonly { readonly field: string; readonly direction: 'asc' | 'desc' }[]
  >([]);
  readonly query = signal('');
  readonly filters = signal<Readonly<Record<string, string>>>({});
  readonly first = signal(0);
  readonly rows = signal(1);
  readonly selectionMode = signal<'single' | 'multiple' | 'checkbox' | null>(null);
  readonly globalFilter = signal(false);
  readonly columnFilter = signal(false);
  readonly gridlines = signal(false);
  readonly paginator = signal(false);
  readonly lazy = signal(false);
  readonly loading = signal(false);
  readonly editable = signal(false);
  readonly resizable = signal(false);
  readonly reorderable = signal(false);
  readonly showOverflowTooltip = signal(false);
  readonly responsiveMode = signal<'scroll' | 'stack'>('scroll');
  readonly expandedEvent = signal('');
  readonly selectionEvent = signal('');
  readonly lazyEvent = signal<AerisTreeTableLazyLoadEvent | null>(null);
  readonly editEvent = signal<AerisTreeTableCellEditEvent<FileRow> | null>(null);
  readonly resizeEvent = signal<AerisTreeTableColumnResizeEvent | null>(null);
  readonly reorderEvent = signal<AerisTreeTableColumnReorderEvent | null>(null);
}

@Component({
  imports: [AerisTreeTableModule],
  template: `
    <aeris-tree-table [value]="nodes" [columns]="columns" [expandedKeys]="['workspace']">
      <ng-template aerisTreeTableHeader let-column let-sort="sort">
        <span class="custom-header" [attr.data-sort]="sort">{{ column.header }}</span>
      </ng-template>
      <ng-template aerisTreeTableCell let-value let-node="node" let-level="level">
        <span class="custom-cell" [attr.data-key]="node.key" [attr.data-level]="level">{{
          value
        }}</span>
      </ng-template>
    </aeris-tree-table>
  `,
})
class TreeTableTemplateHost {
  readonly nodes = NODES;
  readonly columns = COLUMNS;
}

@Component({
  imports: [AerisTreeTableModule],
  template: `
    <aeris-tree-table [value]="[]" [columns]="columns" [loading]="loading()">
      <ng-template aerisTreeTableEmpty><strong class="custom-empty">No files</strong></ng-template>
      <ng-template aerisTreeTableLoading
        ><strong class="custom-loading">Fetching files</strong></ng-template
      >
    </aeris-tree-table>
  `,
})
class TreeTableStateHost {
  readonly columns = COLUMNS;
  readonly loading = signal(false);
}

describe('AerisTreeTable', () => {
  function setup(): ComponentFixture<TreeTableTestHost> {
    const fixture = TestBed.createComponent(TreeTableTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function keydown(element: HTMLElement, key: string, init: KeyboardEventInit = {}): void {
    element.dispatchEvent(new KeyboardEvent('keydown', { ...init, key, bubbles: true }));
  }

  it('exports one module-array import with the component and templates', () => {
    expect(AerisTreeTableModule[0]).toBe(AerisTreeTable);
    expect(AerisTreeTableModule.length).toBe(5);
  });

  it('renders a named treegrid with dynamic columns and hierarchical metadata', () => {
    const fixture = setup();
    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const rows = fixture.nativeElement.querySelectorAll(
      'tbody tr',
    ) as NodeListOf<HTMLTableRowElement>;

    expect(table.getAttribute('role')).toBe('treegrid');
    expect(table.getAttribute('aria-label')).toBe('Project file hierarchy');
    expect(table.getAttribute('aria-colcount')).toBe('3');
    expect(fixture.nativeElement.querySelector('.aeris-tree-table__caption').textContent).toContain(
      'Project files',
    );
    expect(
      (fixture.nativeElement.querySelector('.aeris-tree-table__viewport') as HTMLElement).tabIndex,
    ).toBe(0);
    expect((fixture.nativeElement.querySelector('caption') as HTMLElement).textContent).toContain(
      'Project files',
    );
    expect(fixture.nativeElement.querySelectorAll('thead th').length).toBe(3);
    expect(rows.length).toBe(2);
    expect(rows.item(0).getAttribute('aria-level')).toBe('1');
    expect(rows.item(0).getAttribute('aria-posinset')).toBe('1');
    expect(rows.item(0).getAttribute('aria-setsize')).toBe('2');
    expect(rows.item(0).getAttribute('aria-expanded')).toBe('false');
    expect(rows.item(1).getAttribute('aria-disabled')).toBe('true');
    expect(rows.item(0).tabIndex).toBe(0);

    const frame = fixture.nativeElement.querySelector('.aeris-tree-table__frame') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector(
      '.aeris-tree-table__viewport',
    ) as HTMLElement;
    expect(frame.contains(viewport)).toBe(true);
    expect(getComputedStyle(frame).overflow).toBe('hidden');
    expect(getComputedStyle(viewport).overflow).toBe('auto');
  });

  it('controls expansion and emits node events', () => {
    const fixture = setup();
    const toggle = fixture.nativeElement.querySelector(
      '.aeris-tree-table__toggle',
    ) as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace']);
    expect(fixture.componentInstance.expandedEvent()).toBe('workspace');
    expect(fixture.nativeElement.textContent).toContain('Source');

    fixture.componentInstance.table().expandAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace', 'src']);
    expect(fixture.nativeElement.textContent).toContain('app.ts');

    fixture.componentInstance.table().collapseAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
  });

  it('supports complete row keyboard navigation', () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector('[data-row-key="workspace"]') as HTMLElement;
    root.focus();

    keydown(root, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace']);
    keydown(root, 'ArrowRight');
    expect((document.activeElement as HTMLElement).dataset['rowKey']).toBe('src');
    keydown(document.activeElement as HTMLElement, 'ArrowLeft');
    expect((document.activeElement as HTMLElement).dataset['rowKey']).toBe('workspace');
    keydown(document.activeElement as HTMLElement, 'End');
    expect((document.activeElement as HTMLElement).dataset['rowKey']).toBe('archive');
    keydown(document.activeElement as HTMLElement, 'Home');
    expect((document.activeElement as HTMLElement).dataset['rowKey']).toBe('workspace');
  });

  it('selects rows in single and multiple modes without checkbox controls', () => {
    const fixture = setup();
    fixture.componentInstance.selectionMode.set('single');
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-row-key="workspace"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['workspace']);
    expect(fixture.componentInstance.selectionEvent()).toBe('workspace');

    fixture.componentInstance.selectionMode.set('multiple');
    fixture.componentInstance.table().expandAll();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-row-key="src"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['workspace', 'src']);
    expect(fixture.nativeElement.querySelector('.aeris-tree-table__checkbox')).toBeNull();
  });

  it('cascades checkbox selection and exposes mixed state', () => {
    const fixture = setup();
    fixture.componentInstance.selectionMode.set('checkbox');
    fixture.componentInstance.table().expandAll();
    fixture.detectChanges();
    const rootCheckbox = fixture.nativeElement.querySelector(
      '[data-row-key="workspace"] .aeris-tree-table__checkbox input',
    ) as HTMLInputElement;
    rootCheckbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual([
      'workspace',
      'src',
      'app',
      'readme',
    ]);

    const appCheckbox = fixture.nativeElement.querySelector(
      '[data-row-key="app"] .aeris-tree-table__checkbox input',
    ) as HTMLInputElement;
    appCheckbox.click();
    fixture.detectChanges();
    const updatedRoot = fixture.nativeElement.querySelector(
      '[data-row-key="workspace"] .aeris-tree-table__checkbox input',
    ) as HTMLInputElement;
    expect(updatedRoot.indeterminate).toBe(true);
    expect(updatedRoot.tabIndex).toBe(-1);
  });

  it('sorts sibling groups and reports accessible sort state', () => {
    const fixture = setup();
    const nameSort = fixture.nativeElement.querySelector(
      'th[data-field="name"] .aeris-tree-table__sort',
    ) as HTMLButtonElement;
    nameSort.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sorts()).toEqual([{ field: 'name', direction: 'asc' }]);
    expect(
      fixture.nativeElement.querySelector('th[data-field="name"]')?.getAttribute('aria-sort'),
    ).toBe('ascending');
    expect((fixture.nativeElement.querySelector('tbody tr') as HTMLElement).dataset['rowKey']).toBe(
      'archive',
    );

    nameSort.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sorts()).toEqual([{ field: 'name', direction: 'desc' }]);
  });

  it('filters paths globally and by individual columns', () => {
    const fixture = setup();
    fixture.componentInstance.globalFilter.set(true);
    fixture.detectChanges();
    const globalInput = fixture.nativeElement.querySelector(
      '.aeris-tree-table__global-filter input',
    ) as HTMLInputElement;
    globalInput.value = 'app';
    globalInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Workspace');
    expect(fixture.nativeElement.textContent).toContain('Source');
    expect(fixture.nativeElement.textContent).toContain('app.ts');
    expect(fixture.nativeElement.textContent).not.toContain('README.md');

    fixture.componentInstance.query.set('');
    fixture.componentInstance.columnFilter.set(true);
    fixture.detectChanges();
    const typeInput = fixture.nativeElement
      .querySelectorAll('.aeris-tree-table__filter-row input')
      .item(2) as HTMLInputElement;
    typeInput.value = 'document';
    typeInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('README.md');
    expect(fixture.nativeElement.textContent).not.toContain('app.ts');

    fixture.componentInstance.table().clearFilters();
    fixture.detectChanges();
    expect(fixture.componentInstance.filters()).toEqual({});
  });

  it('paginates root nodes while retaining controlled state', () => {
    const fixture = setup();
    fixture.componentInstance.paginator.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Workspace');

    fixture.componentInstance.first.set(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Archive');
    expect(fixture.nativeElement.textContent).not.toContain('Workspace');
  });

  it('emits complete lazy state for server-side operations', () => {
    const fixture = setup();
    fixture.componentInstance.lazy.set(true);
    fixture.componentInstance.paginator.set(true);
    fixture.componentInstance.globalFilter.set(true);
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('th[data-field="name"] button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lazyEvent()?.sorts).toEqual([
      { field: 'name', direction: 'asc' },
    ]);

    const input = fixture.nativeElement.querySelector(
      '.aeris-tree-table__global-filter input',
    ) as HTMLInputElement;
    input.value = 'remote';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.lazyEvent()?.globalValue).toBe('remote');
    expect(fixture.nativeElement.querySelector('aeris-paginator')).not.toBeNull();
  });

  it('edits cells immutably and emits the committed value', () => {
    const fixture = setup();
    fixture.componentInstance.editable.set(true);
    fixture.detectChanges();
    const sizeCell = fixture.nativeElement.querySelector(
      '[data-row-key="workspace"] td:nth-child(2)',
    ) as HTMLTableCellElement;
    const nameCell = fixture.nativeElement.querySelector(
      '[data-row-key="workspace"] td:nth-child(1)',
    ) as HTMLTableCellElement;
    expect(sizeCell.getAttribute('data-editable')).toBe('true');
    expect(nameCell.getAttribute('data-editable')).toBeNull();
    sizeCell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    const editor = fixture.nativeElement.querySelector(
      '.aeris-tree-table__editor',
    ) as HTMLInputElement;
    editor.value = '32';
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    keydown(editor, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.nodes()[0]?.data['size']).toBe('32');
    expect(fixture.componentInstance.editEvent()?.previousValue).toBe(24);
    expect(fixture.componentInstance.editEvent()?.value).toBe('32');
  });

  it('uses tree table gridlines for the complete column including filter cells', () => {
    const fixture = setup();
    fixture.componentInstance.columnFilter.set(true);
    fixture.componentInstance.gridlines.set(true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.aeris-tree-table') as HTMLElement;
    expect(root.getAttribute('data-gridlines')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('.aeris-tree-table__filter-row th').length).toBe(
      COLUMNS.length,
    );
  });

  it('resizes and reorders columns with keyboard controls', () => {
    const fixture = setup();
    fixture.componentInstance.resizable.set(true);
    fixture.componentInstance.reorderable.set(true);
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector(
      'th[data-field="name"] [role="separator"]',
    ) as HTMLElement;
    expect(fixture.nativeElement.querySelectorAll('[role="separator"]').length).toBe(2);
    keydown(separator, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.columns()[0]?.width).toBe('208px');
    expect(fixture.componentInstance.columns()[1]?.width).toBe('112px');
    expect(fixture.componentInstance.resizeEvent()?.field).toBe('name');

    const nameHeader = fixture.nativeElement.querySelector(
      'th[data-field="name"] button',
    ) as HTMLElement;
    keydown(nameHeader, 'ArrowRight', { altKey: true });
    fixture.detectChanges();
    expect(fixture.componentInstance.columns().map((column) => column.field)).toEqual([
      'size',
      'name',
      'type',
    ]);
    expect(fixture.componentInstance.reorderEvent()?.fromIndex).toBe(0);
    expect(fixture.componentInstance.reorderEvent()?.toIndex).toBe(1);
  });

  it('preserves total width during pointer column resizing', () => {
    const fixture = setup();
    fixture.componentInstance.resizable.set(true);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>;
    const separator = fixture.nativeElement.querySelector(
      'th[data-field="name"] .aeris-tree-table__resize',
    ) as HTMLElement;
    vi.spyOn(headers.item(0), 'getBoundingClientRect').mockReturnValue({ width: 192 } as DOMRect);
    vi.spyOn(headers.item(1), 'getBoundingClientRect').mockReturnValue({ width: 128 } as DOMRect);
    vi.spyOn(headers.item(2), 'getBoundingClientRect').mockReturnValue({ width: 144 } as DOMRect);

    separator.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 124, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 124, bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.columns()[0]?.width).toBe('216px');
    expect(fixture.componentInstance.columns()[1]?.width).toBe('104px');
    expect(fixture.componentInstance.columns()[2]?.width).toBe('144px');
    expect(fixture.componentInstance.resizeEvent()?.width).toBe('216px');
  });

  it('shows an Aeris tooltip only for truncated tree table values when enabled', () => {
    vi.useFakeTimers();
    const fixture = setup();
    fixture.componentInstance.showOverflowTooltip.set(true);
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector(
      '.aeris-tree-table__cell-content',
    ) as HTMLElement;
    Object.defineProperties(cell, {
      clientWidth: { configurable: true, value: 80 },
      scrollWidth: { configurable: true, value: 160 },
    });

    cell.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(300);
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Workspace');

    cell.dispatchEvent(new Event('pointerleave'));
    fixture.destroy();
    vi.useRealTimers();
  });

  it('renders typed header and cell template contexts', () => {
    const fixture = TestBed.createComponent(TreeTableTemplateHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.custom-header').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain('Name');
    const sourceName = fixture.nativeElement.querySelector(
      '.custom-cell[data-key="src"]',
    ) as HTMLElement;
    expect(sourceName.textContent).toContain('Source');
    expect(sourceName.dataset['level']).toBe('2');
  });

  it('renders custom empty and loading states', () => {
    const fixture = TestBed.createComponent(TreeTableStateHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-empty')?.textContent).toContain('No files');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-loading')?.textContent).toContain(
      'Fetching files',
    );
  });

  it('exposes responsive and frozen-column structure', () => {
    const fixture = setup();
    fixture.componentInstance.responsiveMode.set('stack');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.aeris-tree-table')?.getAttribute('data-responsive'),
    ).toBe('stack');
    expect(
      fixture.nativeElement.querySelector('th[data-field="name"]')?.getAttribute('data-frozen'),
    ).toBe('true');
    expect(
      (fixture.nativeElement.querySelector('td[data-frozen="true"]') as HTMLElement).style.left,
    ).toBe('0px');
  });
});
