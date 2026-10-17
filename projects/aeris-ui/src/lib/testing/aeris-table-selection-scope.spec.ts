import { TestBed } from '@angular/core/testing';
import { AerisTable } from '../../../table/aeris-table';
import { AerisTreeTable, type AerisTreeTableNode } from '../../../tree-table/aeris-tree-table';

describe('Table selection scope', () => {
  it('limits the header checkbox to the filtered page while retaining off-page and unloaded keys', () => {
    const fixture = TestBed.createComponent(AerisTable);
    for (const [key, value] of Object.entries({
      data: [
        { id: '1', name: 'Maya' },
        { id: '2', name: 'Noah' },
        { id: '3', name: 'Sofia' },
      ],
      columns: [{ field: 'name', header: 'Name' }],
      selectionMode: 'multiple',
      paginator: true,
      rows: 1,
      globalFilter: true,
      lazy: true,
    }))
      fixture.componentRef.setInput(key, value);
    const table = fixture.componentInstance;
    table.selectedKeys.set(['remote']);
    fixture.detectChanges();
    const toggle = () => {
      (
        fixture.nativeElement.querySelector('thead input[type="checkbox"]') as HTMLInputElement
      ).click();
      fixture.detectChanges();
    };
    toggle();
    expect(table.selectedKeys()).toEqual(['remote', '1']);
    table.first.set(1);
    fixture.detectChanges();
    toggle();
    expect(table.selectedKeys()).toEqual(['remote', '1', '2']);
    toggle();
    expect(table.selectedKeys()).toEqual(['remote', '1']);
    table.filter('Sofia');
    fixture.detectChanges();
    toggle();
    expect(table.selectedKeys()).toEqual(['remote', '1', '3']);
    table.filter('No match');
    fixture.detectChanges();
    toggle();
    expect(table.selectedKeys()).toEqual(['remote', '1', '3']);
    table.clearSelection();
    expect(table.selectedKeys()).toEqual([]);
  });

  it('retains controlled selection when loaded data changes, but selectRows only accepts loaded keys', () => {
    const fixture = TestBed.createComponent(AerisTable);
    fixture.componentRef.setInput('data', [{ id: 'loaded', name: 'Loaded' }]);
    fixture.componentRef.setInput('columns', [{ field: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('lazy', true);
    fixture.componentInstance.selectedKeys.set(['remote']);
    fixture.detectChanges();
    fixture.componentRef.setInput('data', [{ id: 'next', name: 'Next page' }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedKeys()).toEqual(['remote']);
    fixture.componentInstance.selectRows(['remote', 'next']);
    expect(fixture.componentInstance.selectedKeys()).toEqual(['next']);
  });

  it('exports only current columns in their displayed order without clearing selection', () => {
    const fixture = TestBed.createComponent(AerisTable);
    fixture.componentRef.setInput('data', [
      { id: '1', name: 'Maya', team: 'Design', status: 'Active' },
    ]);
    fixture.componentRef.setInput('columns', [
      { field: 'status', header: 'Status' },
      { field: 'name', header: 'Name' },
    ]);
    fixture.componentInstance.selectedKeys.set(['1']);
    fixture.detectChanges();
    expect(fixture.componentInstance.exportCSV({ download: false })).toBe(
      '"Status","Name"\r\n"Active","Maya"',
    );
    expect(fixture.componentInstance.selectedKeys()).toEqual(['1']);
  });
});

const ROOTS: readonly AerisTreeTableNode[] = [
  {
    key: 'first',
    data: { name: 'First folder' },
    children: [
      { key: 'a', data: { name: 'a.ts' }, leaf: true },
      { key: 'b', data: { name: 'b.ts' }, leaf: true },
    ],
  },
  {
    key: 'second',
    data: { name: 'Second folder' },
    children: [{ key: 'c', data: { name: 'c.ts' }, leaf: true }],
  },
];

describe('TreeTable selection scope', () => {
  it('retains selected keys through collapsed branches, filtering, and root paging', () => {
    const fixture = TestBed.createComponent(AerisTreeTable);
    for (const [key, value] of Object.entries({
      value: ROOTS,
      columns: [{ field: 'name', header: 'Name' }],
      selectionMode: 'checkbox',
      propagateSelection: false,
      paginator: true,
      rows: 1,
      globalFilter: true,
    }))
      fixture.componentRef.setInput(key, value);
    const table = fixture.componentInstance;
    table.selectionKeys.set(['a', 'c', 'remote']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-row-key="a"]')).toBeNull();
    table.first.set(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-row-key="second"]')).not.toBeNull();
    table.globalFilterValue.set('No match');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[data-row-key]')).toHaveLength(0);
    expect(table.selectionKeys()).toEqual(['a', 'c', 'remote']);
    table.selectionKeys.set([]);
    expect(table.selectionKeys()).toEqual([]);
  });

  it('selects only the matching loaded branch when checkbox propagation follows path filtering', () => {
    const fixture = TestBed.createComponent(AerisTreeTable);
    for (const [key, value] of Object.entries({
      value: ROOTS,
      columns: [{ field: 'name', header: 'Name' }],
      selectionMode: 'checkbox',
      globalFilter: true,
      globalFilterValue: 'a.ts',
    }))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        '[data-row-key="first"] input[type="checkbox"]',
      ) as HTMLInputElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['first', 'a']);
    expect(fixture.componentInstance.selectionKeys()).not.toContain('b');
  });

  it('uses rendered selectable rows for Ctrl+A, not collapsed or other-page nodes', () => {
    const fixture = TestBed.createComponent(AerisTreeTable);
    for (const [key, value] of Object.entries({
      value: ROOTS,
      columns: [{ field: 'name', header: 'Name' }],
      selectionMode: 'multiple',
      paginator: true,
      rows: 1,
    }))
      fixture.componentRef.setInput(key, value);
    fixture.componentInstance.selectionKeys.set(['remote']);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-row-key="first"]') as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['remote', 'first']);
    fixture.componentInstance.expandedKeys.set(['first']);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-row-key="a"]') as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', metaKey: true, bubbles: true }),
    );
    expect(fixture.componentInstance.selectionKeys()).toEqual(['remote', 'first', 'a', 'b']);
  });

  it('does not select children that arrive after a lazy parent was selected', () => {
    const fixture = TestBed.createComponent(AerisTreeTable);
    for (const [key, value] of Object.entries({
      value: [{ key: 'remote-root', data: { name: 'Remote root' }, leaf: false }],
      columns: [{ field: 'name', header: 'Name' }],
      selectionMode: 'checkbox',
      lazy: true,
      paginator: true,
      rows: 1,
      first: 50,
      totalRecords: 100,
    }))
      fixture.componentRef.setInput(key, value);
    fixture.componentInstance.selectionKeys.set(['earlier-page']);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        '[data-row-key="remote-root"] input[type="checkbox"]',
      ) as HTMLInputElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['earlier-page', 'remote-root']);
    fixture.componentRef.setInput('value', [
      {
        key: 'remote-root',
        data: { name: 'Remote root' },
        children: [{ key: 'new-child', data: { name: 'Loaded later' }, leaf: true }],
      },
    ]);
    fixture.componentInstance.expandedKeys.set(['remote-root']);
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).not.toContain('new-child');
    expect(
      (
        fixture.nativeElement.querySelector(
          '[data-row-key="remote-root"] input[type="checkbox"]',
        ) as HTMLInputElement
      ).indeterminate,
    ).toBe(true);
  });
});
