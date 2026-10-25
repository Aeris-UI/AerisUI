import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisTableModule, type AerisTableCellEditable } from '@aeris-ui/core/table';
import { AerisTreeTableModule, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  imports: [AerisTableModule, AerisTreeTableModule],
  template: `
    @if (tree()) {
      <aeris-tree-table
        [value]="nodes()"
        [columns]="columns()"
        [expandedKeys]="['one']"
        [editable]="editable()"
        [cellEditable]="permission()"
        (editStarted)="started = started + 1"
        (editCancelled)="cancelled = cancelled + 1"
        (cellEdited)="saved = saved + 1"
      />
    } @else {
      <aeris-table
        [data]="rows"
        [columns]="columns()"
        [editable]="editable()"
        [cellEditable]="permission()"
        (editStarted)="started = started + 1"
        (editCancelled)="cancelled = cancelled + 1"
        (cellEdited)="saved = saved + 1"
      />
    }
    <button id="outside">Outside</button>
  `,
})
class PermissionsHost {
  readonly tree = signal(false);
  readonly editable = signal(false);
  readonly columnEditable = signal<boolean | undefined>(undefined);
  readonly permission = signal<AerisTableCellEditable | undefined>(undefined);
  readonly columns = computed(() => [
    { field: 'amount', header: 'Amount', editable: this.columnEditable() },
    { field: 'name', header: 'Name' },
  ]);
  readonly rows = [
    { id: 'one', amount: 7, name: 'First' },
    { id: 'two', amount: 9, name: 'Second' },
  ];
  readonly nodes = signal<readonly AerisTreeTableNode[]>(
    this.rows.map((data) => ({ key: data.id, data })),
  );
  started = 0;
  cancelled = 0;
  saved = 0;
}

for (const tree of [false, true]) {
  describe(`${tree ? 'TreeTable' : 'Table'} editing permissions`, () => {
    async function setup() {
      const fixture = TestBed.createComponent(PermissionsHost);
      fixture.componentInstance.tree.set(tree);
      await fixture.whenStable();
      return {
        fixture,
        host: fixture.componentInstance,
        root: fixture.nativeElement as HTMLElement,
      };
    }

    for (const fallback of [false, true]) {
      for (const column of [undefined, false, true]) {
        for (const cell of [undefined, false, true]) {
          it(`resolves table=${fallback}, column=${column}, cell=${cell}`, async () => {
            const { fixture, host, root } = await setup();
            host.editable.set(fallback);
            host.columnEditable.set(column);
            host.permission.set(() => cell);
            await fixture.whenStable();
            const target = root.querySelector('td[data-label="Amount"]') as HTMLElement;
            const expected = cell ?? column ?? fallback;
            expect(target.hasAttribute('data-editable')).toBe(expected);
            expect(target.getAttribute('tabindex')).toBe(expected ? '0' : null);
            expect(target.querySelector('[aerisInternalIcon="edit"]') !== null).toBe(expected);
            target.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'F2',
                bubbles: true,
                cancelable: true,
              }),
            );
            await fixture.whenStable();
            expect(root.querySelector('.aeris-cell-editor') !== null).toBe(expected);
            if (!expected) {
              target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
              target.dispatchEvent(
                new KeyboardEvent('keydown', {
                  key: 'Enter',
                  bubbles: true,
                  cancelable: true,
                }),
              );
              await fixture.whenStable();
              expect(host.started).toBe(0);
              expect(root.querySelector('.aeris-cell-editor')).toBeNull();
            }
          });
        }
      }
    }

    it('inherits without a callback and restricts rows and individual cells with one predicate', async () => {
      const { fixture, host, root } = await setup();
      expect(root.querySelectorAll('[data-editable="true"]')).toHaveLength(0);
      host.editable.set(true);
      await fixture.whenStable();
      expect(root.querySelectorAll('[data-editable="true"]')).toHaveLength(4);
      host.permission.set((row, column) =>
        row['id'] === 'two' || column.field === 'name' ? false : undefined,
      );
      await fixture.whenStable();
      expect(root.querySelectorAll('[data-editable="true"]')).toHaveLength(1);
      expect(root.querySelector('[data-editable="true"]')?.getAttribute('data-label')).toBe(
        'Amount',
      );
    });

    it('keeps an active column editor when only the table default changes', async () => {
      const { fixture, host, root } = await setup();
      host.editable.set(true);
      host.columnEditable.set(true);
      await fixture.whenStable();
      (root.querySelector('td[data-label="Amount"]') as HTMLElement).dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true }),
      );
      await fixture.whenStable();
      host.editable.set(false);
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor input')).not.toBeNull();
      expect(host.cancelled).toBe(0);
    });

    for (const source of ['table', 'column', 'cell'] as const) {
      it(`cancels an active draft when ${source} permission is revoked`, async () => {
        const { fixture, host, root } = await setup();
        if (source === 'table') host.editable.set(true);
        if (source === 'column') host.columnEditable.set(true);
        const allowed = signal(true);
        if (source === 'cell') host.permission.set(() => allowed());
        await fixture.whenStable();
        (root.querySelector('td[data-label="Amount"]') as HTMLElement).dispatchEvent(
          new MouseEvent('dblclick', { bubbles: true }),
        );
        await fixture.whenStable();
        const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
        input.value = '99';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        if (source === 'table') host.editable.set(false);
        if (source === 'column') host.columnEditable.set(false);
        if (source === 'cell') allowed.set(false);
        await fixture.whenStable();
        expect(root.querySelector('.aeris-cell-editor')).toBeNull();
        expect(host.cancelled).toBe(1);
        expect(host.saved).toBe(0);
        expect(host.nodes()[0].data['amount']).toBe(7);
        expect(host.rows[0].amount).toBe(7);
      });
    }

    if (tree) {
      it('passes the row data, column and node to the predicate', async () => {
        const { fixture, host, root } = await setup();
        const seen: string[] = [];
        host.permission.set((data, column, node?: AerisTreeTableNode) => {
          expect(node?.data).toBe(data);
          expect(column.field).toMatch(/^(amount|name)$/);
          seen.push(node?.key ?? 'missing');
          return node?.key === 'one';
        });
        await fixture.whenStable();
        expect(seen).toContain('one');
        expect(seen).toContain('two');
        expect(root.querySelectorAll('[data-editable="true"]')).toHaveLength(2);
      });

      it('never overrides disabled nodes and preserves descendants own permissions', async () => {
        const { fixture, host, root } = await setup();
        host.permission.set(() => true);
        host.nodes.set([
          {
            key: 'one',
            data: host.rows[0],
            disabled: true,
            children: [{ key: 'two', data: host.rows[1] }],
          },
        ]);
        await fixture.whenStable();
        expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
        const rows = root.querySelectorAll('tbody tr');
        expect(rows[0].querySelectorAll('[data-editable="true"]')).toHaveLength(0);
        expect(rows[1].querySelectorAll('[data-editable="true"]')).toHaveLength(2);
      });
    }
  });
}
