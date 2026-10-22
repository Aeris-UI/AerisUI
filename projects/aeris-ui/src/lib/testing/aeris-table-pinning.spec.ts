import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  aerisInternalOrderPinnedColumns,
  aerisInternalOrderPinnedRows,
  aerisInternalPinnedRowSides,
  type AerisTablePinnedRows,
} from '@aeris-ui/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';
import { AerisTreeTableModule } from '@aeris-ui/core/tree-table';

@Component({
  imports: [AerisTableModule, AerisTreeTableModule],
  template: `
    @if (tree()) {
      <aeris-tree-table
        [value]="nodes()"
        [(columns)]="columns"
        reorderableColumns
        [(pinnedRows)]="pins"
        [stickyHeader]="headers()"
        [paginator]="paging()"
        [rows]="2"
        [first]="first()"
        [expandedKeys]="['two']"
        [globalFilterValue]="filter()"
      />
    } @else {
      <aeris-table
        globalFilter
        [data]="rows()"
        [(columns)]="columns"
        reorderableColumns
        [(pinnedRows)]="pins"
        [stickyHeader]="headers()"
        [paginator]="paging()"
        [rows]="2"
        [first]="first()"
        [filterValue]="filter()"
      />
    }
  `,
})
class PinningHost {
  readonly tree = signal(false);
  readonly pins = signal<AerisTablePinnedRows>({ top: [], bottom: [] });
  readonly headers = signal(true);
  readonly paging = signal(false);
  readonly first = signal(0);
  readonly filter = signal('');
  readonly columns = signal<readonly AerisTableColumn[]>([
    { field: 'name', header: 'Name', width: '10rem' },
    { field: 'team', header: 'Team', width: '10rem' },
    { field: 'status', header: 'Status', width: '10rem' },
  ]);
  readonly rows = signal<readonly AerisTableData[]>([
    { id: 'one', name: 'First', team: 'Design', status: 'Active' },
    { id: 'two', name: 'Second', team: 'Design', status: 'Active' },
    { id: 'three', name: 'Third', team: 'Engineering', status: 'Archived' },
    { id: 'four', name: 'Fourth', team: 'Design', status: 'Active' },
  ]);
  readonly nodes = computed(() =>
    this.rows().map((data) => ({
      key: String(data['id']),
      data,
      ...(data['id'] === 'two'
        ? {
            children: [{ key: 'child', data: { name: 'Child', team: 'Design', status: 'Active' } }],
          }
        : {}),
    })),
  );
}

describe('Shared table pinning operations', () => {
  it('preserves input identity when nothing is pinned', () => {
    const rows = ['one', 'two'];
    const columns: readonly AerisTableColumn[] = [{ field: 'name', header: 'Name' }];
    expect(aerisInternalOrderPinnedRows(rows, new Map(), (key) => key)).toBe(rows);
    expect(aerisInternalOrderPinnedColumns(columns)).toBe(columns);
  });
  it('partitions columns without changing the supplied configuration', () => {
    const columns: readonly AerisTableColumn[] = [
      { field: 'a', header: 'A' },
      { field: 'b', header: 'B', pinned: 'end' },
      { field: 'c', header: 'C', pinned: 'start' },
      { field: 'd', header: 'D', pinned: 'start' },
    ];
    expect(aerisInternalOrderPinnedColumns(columns).map((column) => column.field)).toEqual([
      'c',
      'd',
      'a',
      'b',
    ]);
    expect(columns.map((column) => column.field)).toEqual(['a', 'b', 'c', 'd']);
  });
  it('deduplicates sides, ignores empty keys and gives top precedence', () => {
    const sides = aerisInternalPinnedRowSides({
      top: ['two', 'two', ''],
      bottom: ['one', 'two', '  '],
    });
    expect([...sides]).toEqual([
      ['one', 'bottom'],
      ['two', 'top'],
    ]);
    expect(aerisInternalOrderPinnedRows(['one', 'two', 'three'], sides, (key) => key)).toEqual([
      'two',
      'three',
      'one',
    ]);
  });
});

for (const tree of [false, true]) {
  describe(`${tree ? 'TreeTable' : 'Table'} shared pinning contract`, () => {
    async function setup() {
      const fixture = TestBed.createComponent(PinningHost);
      fixture.componentInstance.tree.set(tree);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const keys = () =>
        Array.from(root.querySelectorAll('tbody tr[data-row-key]')).map((row) =>
          row.getAttribute('data-row-key'),
        );
      return { fixture, host: fixture.componentInstance, root, keys };
    }
    it('defaults to sticky headers and no pinned data', async () => {
      const { fixture, host, root } = await setup();
      expect(root.querySelector('[data-sticky-header="true"]')).not.toBeNull();
      expect(root.querySelector('[data-pinned-row]')).toBeNull();
      expect(root.querySelector('[data-pinned-column]')).toBeNull();
      host.headers.set(false);
      await fixture.whenStable();
      expect(root.querySelector('[data-sticky-header="false"]')).not.toBeNull();
    });
    it('orders top and bottom rows once, preserving original data and branch structure', async () => {
      const { fixture, host, root, keys } = await setup();
      const original = host.rows();
      host.pins.set({ top: ['two'], bottom: ['one', 'missing', 'two'] });
      await fixture.whenStable();
      expect(keys()).toEqual(
        tree ? ['two', 'child', 'three', 'four', 'one'] : ['two', 'three', 'four', 'one'],
      );
      expect(host.rows()).toBe(original);
      expect(root.querySelector('tr[data-row-key="two"]')?.getAttribute('data-pinned-row')).toBe(
        'top',
      );
      expect(root.querySelector('tr[data-row-key="one"]')?.getAttribute('data-pinned-row')).toBe(
        'bottom',
      );
      if (tree)
        expect(
          root.querySelector('tr[data-row-key="child"]')?.getAttribute('data-pinned-row'),
        ).toBe('top');
      host.pins.set({ top: [], bottom: [] });
      await fixture.whenStable();
      expect(keys()).toEqual(
        tree ? ['one', 'two', 'child', 'three', 'four'] : ['one', 'two', 'three', 'four'],
      );
    });
    it('keeps filtering and pagination authoritative and ignores absent/deleted keys', async () => {
      const { fixture, host, root, keys } = await setup();
      host.pins.set({ top: ['four'], bottom: ['one'] });
      host.paging.set(true);
      await fixture.whenStable();
      expect(keys()).toEqual(tree ? ['two', 'child', 'one'] : ['two', 'one']);
      host.first.set(2);
      await fixture.whenStable();
      expect(keys()).toEqual(['four', 'three']);
      host.rows.update((rows) => rows.filter((row) => row['id'] !== 'four'));
      await fixture.whenStable();
      expect(keys()).toEqual(['three']);
      expect(root.querySelector('[data-pinned-row]')).toBeNull();
      host.paging.set(false);
      host.filter.set('Engineering');
      await fixture.whenStable();
      expect(keys()).toEqual(['three']);
    });
    it('shares start/end column configuration without mutating column order', async () => {
      const { fixture, host, root } = await setup();
      host.columns.update((columns) =>
        columns.map((column) => ({
          ...column,
          pinned: column.field === 'status' ? 'start' : column.field === 'name' ? 'end' : undefined,
        })),
      );
      await fixture.whenStable();
      const headers = Array.from(root.querySelectorAll('thead tr:first-child th[data-field]'));
      expect(headers.map((header) => header.getAttribute('data-field'))).toEqual([
        'status',
        'team',
        'name',
      ]);
      expect(host.columns().map((column) => column.field)).toEqual(['name', 'team', 'status']);
      expect(
        root.querySelector('td[data-field="status"]')?.getAttribute('data-pinned-column'),
      ).toBe('start');
      expect(root.querySelector('td[data-field="name"]')?.getAttribute('data-pinned-column')).toBe(
        'end',
      );
    });
    it('reorders inside a pin group without moving a column across pin boundaries', async () => {
      const { fixture, host, root } = await setup();
      host.columns.set([
        { field: 'name', header: 'Name', pinned: 'start' },
        { field: 'team', header: 'Team' },
        { field: 'status', header: 'Status' },
        { field: 'details', header: 'Details', pinned: 'end' },
      ]);
      await fixture.whenStable();
      const key = (field: string) => {
        const label = root.querySelector(`th[data-field="${field}"] [tabindex="0"]`) as HTMLElement;
        label.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            altKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      };
      key('name');
      await fixture.whenStable();
      expect(host.columns().map((column) => column.field)).toEqual([
        'name',
        'team',
        'status',
        'details',
      ]);
      key('team');
      await fixture.whenStable();
      expect(host.columns().map((column) => column.field)).toEqual([
        'name',
        'status',
        'team',
        'details',
      ]);
    });

    if (tree)
      it('ignores descendant keys rather than detaching or duplicating ancestors', async () => {
        const { fixture, host, root, keys } = await setup();
        host.pins.set({ top: ['child'], bottom: [] });
        await fixture.whenStable();
        expect(keys()).toEqual(['one', 'two', 'child', 'three', 'four']);
        expect(root.querySelector('[data-pinned-row]')).toBeNull();
      });
  });
}
