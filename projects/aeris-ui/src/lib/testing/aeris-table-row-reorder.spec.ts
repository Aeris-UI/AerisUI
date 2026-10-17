import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisTable, type AerisTableData } from '../../../table/aeris-table';

const rows: readonly AerisTableData[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
  { id: 'c', name: 'Charlie' },
];

@Component({
  imports: [AerisTable],
  template: `<ng-template #dragIcon
      ><svg data-drag-icon viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2" /></svg></ng-template
    ><aeris-table
      [(data)]="data"
      [columns]="columns"
      reorderableRows
      selectionMode="multiple"
      expandableRows
      [rowReorderIconTemplate]="dragIcon"
    />`,
})
class Host {
  readonly data = signal(rows);
  readonly columns = [{ field: 'name', header: 'Name' }];
}

describe('Table row reordering', () => {
  afterEach(() => vi.restoreAllMocks());
  function setup() {
    const fixture = TestBed.createComponent(AerisTable);
    fixture.componentRef.setInput('data', rows);
    fixture.componentRef.setInput('columns', [{ field: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('reorderableRows', true);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const handles = () => [
      ...element.querySelectorAll<HTMLButtonElement>('.aeris-table__row-reorder'),
    ];
    return { fixture, table: fixture.componentInstance, element, handles };
  }

  it('updates the controlled data model without mutating the input array or keyed states', () => {
    const host = TestBed.createComponent(Host);
    host.detectChanges();
    const table = host.debugElement.children[0]?.componentInstance as AerisTable;
    expect(host.nativeElement.querySelectorAll('[data-drag-icon]')).toHaveLength(3);
    table.selectedKeys.set(['b']);
    table.expandedKeys.set(['b']);
    const event = vi.fn();
    table.rowReordered.subscribe(event);
    expect(table.moveRow(1, 0)).toBe(true);
    host.detectChanges();
    expect(host.componentInstance.data().map((row) => row['id'])).toEqual(['b', 'a', 'c']);
    expect(rows.map((row) => row['id'])).toEqual(['a', 'b', 'c']);
    expect(table.selectedKeys()).toEqual(['b']);
    expect(table.expandedKeys()).toEqual(['b']);
    expect(event).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'b', fromIndex: 1, toIndex: 0, originalEvent: null }),
    );
  });

  it('moves only through handle keyboard shortcuts, retains focus and announces position', () => {
    const { fixture, table, element, handles } = setup();
    const handle = handles()[0];
    handle?.focus();
    handle?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        altKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
    expect(table.data()[1]?.['id']).toBe('a');
    expect(document.activeElement).toBe(handle);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('position 2 of 3');
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(table.data()[1]?.['id']).toBe('a');
    expect(handle?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it.each([
    ['sort', { field: 'name', direction: 'asc' }],
    ['filterValue', 'Alpha'],
    ['columnFilters', { name: 'Alpha' }],
    ['paginator', true],
    ['lazy', true],
    ['loading', true],
    ['rowReorderDisabled', true],
    ['reorderableRows', false],
  ])('rejects unsupported moves with %s active', (name, value) => {
    const { fixture, table, handles } = setup();
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    expect(table.moveRow(0, 1)).toBe(false);
    expect(handles().every((handle) => handle.disabled)).toBe(true);
    expect(table.data()).toBe(rows);
  });

  it.each([
    [{ name: 'No identity' }],
    [{ id: 'a' }, { id: 'a' }],
    [{ id: '' }],
    [{ id: Number.NaN }],
  ])('requires stable unique explicit identities: %j', (...data) => {
    const { fixture, table } = setup();
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    expect(table.moveRow(0, 1)).toBe(false);
  });

  it('rejects invalid bounds and keeps disabled rows fixed, including crossing moves', () => {
    const { fixture, table } = setup();
    fixture.componentRef.setInput('rowReorderDisabled', (row: AerisTableData) => row['id'] === 'b');
    fixture.detectChanges();
    for (const [from, to] of [
      [0, 2],
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, 3],
      [0, 0],
      [0, 0.5],
    ]) {
      expect(table.moveRow(from ?? 0, to ?? 0)).toBe(false);
    }
  });

  it('can hide handles for external controls and keeps empty/loading colspans correct', () => {
    const { fixture, table, element, handles } = setup();
    fixture.componentRef.setInput('showRowReorderHandle', false);
    fixture.detectChanges();
    expect(handles()).toHaveLength(0);
    expect(table.moveRow(0, 1)).toBe(true);
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(element.querySelector('tbody td')?.getAttribute('colspan')).toBe('1');
    fixture.componentRef.setInput('showRowReorderHandle', true);
    fixture.detectChanges();
    expect(element.querySelector('tbody td')?.getAttribute('colspan')).toBe('2');
  });

  it('does not let handle Enter or Space toggle selection or expansion', () => {
    const { fixture, table, handles } = setup();
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('expandableRows', true);
    fixture.detectChanges();
    for (const key of ['Enter', ' '])
      handles()[0]?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect(table.selectedKeys()).toEqual([]);
    expect(table.expandedKeys()).toEqual([]);
  });

  it('provides click/tap pick-and-place without dragging, with cancellation and source focus', async () => {
    const { fixture, table, handles, element } = setup();
    const source = handles()[0];
    source?.click();
    fixture.detectChanges();
    expect(source?.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('selected to move');
    handles()[2]?.click();
    fixture.detectChanges();
    expect(table.data().map((row) => row['id'])).toEqual(['b', 'c', 'a']);
    await fixture.whenStable();
    expect(document.activeElement).toBe(source);
    expect(source?.getAttribute('aria-pressed')).toBe('false');
    source?.click();
    source?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(source?.getAttribute('aria-pressed')).toBe('false');
    expect(table.data().map((row) => row['id'])).toEqual(['b', 'c', 'a']);
  });

  it('ignores a stale picked row when the controlled dataset changes', () => {
    const { fixture, table, handles } = setup();
    handles()[0]?.click();
    fixture.componentRef.setInput('data', [...rows]);
    fixture.detectChanges();
    handles()[2]?.click();
    fixture.detectChanges();
    expect(table.data()).toEqual(rows);
    expect(handles()[2]?.getAttribute('aria-pressed')).toBe('true');
  });

  it('does not move during cell editing, and preserves the editor until committed', () => {
    const { fixture, table, element } = setup();
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    element
      .querySelector('tbody td:last-child')
      ?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelector('.aeris-table__cell-editor')).toBeTruthy();
    expect(table.moveRow(0, 1)).toBe(false);
  });

  it('preserves native touch clicks while preventing mouse text selection', () => {
    const { handles } = setup();
    for (const pointerType of ['touch', 'mouse']) {
      const down = new PointerEvent('pointerdown', {
        pointerId: 8,
        pointerType,
        button: 0,
        isPrimary: true,
        bubbles: true,
        cancelable: true,
      });
      handles()[0]?.dispatchEvent(down);
      expect(down.defaultPrevented).toBe(pointerType === 'mouse');
      document.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 8 }));
    }
  });

  it.each(['commit', 'pointercancel', 'Escape', 'external update', 'destroy', 'outside', 'click'])(
    'cleans a pointer session on %s',
    (ending) => {
      const { fixture, table, handles, element } = setup();
      const source = handles()[0];
      const target = element.querySelector('tr[data-row-reorder-key="c"]');
      const original = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
      Object.defineProperty(document, 'elementFromPoint', {
        configurable: true,
        value: () => (ending === 'outside' ? document.body : target),
      });
      const emit = (name: string, y: number) =>
        document.dispatchEvent(
          new PointerEvent(name, {
            pointerId: 5,
            pointerType: 'touch',
            isPrimary: true,
            clientY: y,
            bubbles: true,
            cancelable: true,
          }),
        );
      const changed = vi.fn();
      table.rowReordered.subscribe(changed);
      try {
        source?.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 5,
            pointerType: 'touch',
            button: 0,
            isPrimary: true,
            clientY: 10,
            bubbles: true,
            cancelable: true,
          }),
        );
        emit('pointermove', ending === 'click' ? 12 : 100);
        if (ending === 'external update') fixture.componentRef.setInput('data', [...rows]);
        if (ending === 'destroy') fixture.destroy();
        else if (ending === 'Escape')
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        else if (ending === 'pointercancel') emit('pointercancel', 100);
        emit('pointerup', ending === 'click' ? 12 : 100);
        expect(changed).toHaveBeenCalledTimes(ending === 'commit' ? 1 : 0);
        if (ending !== 'destroy') {
          fixture.detectChanges();
          expect(element.querySelector('[data-row-dragging]')).toBeNull();
          expect(table.data().map((row) => row['id'])).toEqual(
            ending === 'commit' ? ['b', 'c', 'a'] : ['a', 'b', 'c'],
          );
        }
      } finally {
        if (original) Object.defineProperty(document, 'elementFromPoint', original);
        else Reflect.deleteProperty(document, 'elementFromPoint');
      }
    },
  );
});
