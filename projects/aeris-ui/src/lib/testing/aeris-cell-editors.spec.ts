import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { type AerisCellEditor } from '@aeris-ui/core';
import { AerisTableModule, type AerisTableCellEditEvent } from '@aeris-ui/core/table';
import {
  AerisTreeTableModule,
  type AerisTreeTableCellEditEvent,
  type AerisTreeTableNode,
} from '@aeris-ui/core/tree-table';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'editor-actions',
  template: `<button type="button" (click)="editor().commit($event)">Save</button>
    <button type="button" (click)="editor().cancel($event)">Cancel</button>`,
})
class EditorActions {
  readonly editor = input.required<AerisCellEditor>();
}

@Component({
  imports: [
    AerisTableModule,
    AerisTreeTableModule,
    AerisInputNumber,
    AerisSelect,
    AerisDatePicker,
    EditorActions,
  ],
  template: `
    @if (tree()) {
      <aeris-tree-table
        [editable]="enabled()"
        [value]="nodes()"
        (valueChange)="nodes.set($event)"
        [columns]="columns"
        (cellEdited)="treeEdits.push($event)"
      >
        @if (custom()) {
          <ng-template aerisTreeTableEditor let-editor let-column="column">
            @let draft = editor.value();
            @switch (column.field) {
              @case ('amount') {
                <aeris-input-number
                  [ariaLabel]="editor.ariaLabel"
                  [value]="typeof draft === 'number' ? draft : null"
                  (valueChange)="editor.value.set($event)"
                />
              }
              @case ('status') {
                <aeris-select
                  appendTo="body"
                  [ariaLabel]="editor.ariaLabel"
                  [options]="options"
                  [value]="typeof draft === 'string' ? draft : null"
                  (valueChange)="editor.value.set($event)"
                />
              }
              @case ('date') {
                <aeris-date-picker
                  appendTo="body"
                  [ariaLabel]="editor.ariaLabel"
                  [value]="date"
                  (valueChange)="editor.value.set($event)"
                />
              }
            }
            <editor-actions [editor]="editor" />
          </ng-template>
        }
      </aeris-tree-table>
    } @else {
      <aeris-table
        [editable]="enabled()"
        [data]="tableRows()"
        [columns]="columns"
        (cellEdited)="saveTableEdit($event)"
      >
        @if (custom()) {
          <ng-template aerisTableEditor let-editor let-column="column">
            @let draft = editor.value();
            @switch (column.field) {
              @case ('amount') {
                <aeris-input-number
                  [ariaLabel]="editor.ariaLabel"
                  [value]="typeof draft === 'number' ? draft : null"
                  (valueChange)="editor.value.set($event)"
                />
              }
              @case ('status') {
                <aeris-select
                  appendTo="body"
                  [ariaLabel]="editor.ariaLabel"
                  [options]="options"
                  [value]="typeof draft === 'string' ? draft : null"
                  (valueChange)="editor.value.set($event)"
                />
              }
              @case ('date') {
                <aeris-date-picker
                  appendTo="body"
                  [ariaLabel]="editor.ariaLabel"
                  [value]="date"
                  (valueChange)="editor.value.set($event)"
                />
              }
            }
            <editor-actions [editor]="editor" />
          </ng-template>
        }
      </aeris-table>
    }
    <button id="outside">Outside</button>
  `,
})
class EditorHost {
  readonly tree = signal(false);
  readonly custom = signal(true);
  readonly enabled = signal(true);
  readonly date = new Date(2026, 9, 21);
  readonly rows = [{ id: 'one', amount: 7, status: 'draft', date: this.date }];
  readonly tableRows = signal<readonly Record<string, unknown>[]>(this.rows);
  readonly nodes = signal<readonly AerisTreeTableNode[]>([{ key: 'one', data: this.rows[0] }]);
  readonly columns = [
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'date', header: 'Date' },
  ];
  readonly options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];
  readonly edits: AerisTableCellEditEvent[] = [];
  readonly treeEdits: AerisTreeTableCellEditEvent[] = [];

  saveTableEdit(event: AerisTableCellEditEvent): void {
    this.edits.push(event);
    this.tableRows.update((rows) =>
      rows.map((row) => (row === event.row ? { ...row, [event.field]: event.value } : row)),
    );
  }
}

for (const tree of [false, true]) {
  describe(`${tree ? 'TreeTable' : 'Table'} cell editors`, () => {
    async function setup(custom = true) {
      const fixture = TestBed.createComponent(EditorHost);
      fixture.componentInstance.tree.set(tree);
      fixture.componentInstance.custom.set(custom);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const cell = root.querySelector('td[data-label="Amount"]') as HTMLTableCellElement;
      cell.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
      return { fixture, root, cell, host: fixture.componentInstance };
    }

    it('names and focuses the built-in editor, preserves text events and restores focus', async () => {
      const { fixture, root, cell, host } = await setup(false);
      const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).toBe('Edit Amount');
      expect(document.activeElement).toBe(input);
      input.value = '12';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor')).toBeNull();
      expect((tree ? host.treeEdits : host.edits)[0].value).toBe('12');
      expect(document.activeElement).toBe(cell);
    });

    it('keeps typed drafts isolated until completion and ignores stale callbacks', async () => {
      const { fixture, root, cell, host } = await setup();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      expect(editor.originalValue).toBe(7);
      expect(editor.value()).toBe(7);
      editor.value.set(42);
      await fixture.whenStable();
      expect(host.rows[0].amount).toBe(7);
      const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
      input.value = '42';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
      input.dispatchEvent(new FocusEvent('blur', { bubbles: false }));
      await fixture.whenStable();
      expect(root.querySelector('editor-actions')).toBeNull();
      editor.commit();
      await fixture.whenStable();
      expect((tree ? host.treeEdits : host.edits)[0].value).toBe(42);
      if (tree) expect(host.nodes()[0].data['amount']).toBe(42);
      expect(document.activeElement).toBe(cell);
      cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await fixture.whenStable();
      editor.value.set(99);
      editor.cancel();
      editor.commit();
      expect(root.querySelector('editor-actions')).not.toBeNull();
      expect(tree ? host.treeEdits : host.edits).toHaveLength(1);
    });

    it('switches cells immediately and commits the previous typed draft', async () => {
      const { fixture, root, host } = await setup();
      const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
      input.value = '23';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      (root.querySelector('td[data-label="Status"]') as HTMLElement).dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true }),
      );
      await fixture.whenStable();
      expect((tree ? host.treeEdits : host.edits)[0].value).toBe(23);
      expect(root.querySelector('.aeris-cell-editor aeris-select')).not.toBeNull();
      if (tree) expect(host.nodes()[0].data['amount']).toBe(23);
    });

    it('blocks an invalid blur commit but discards it when switching cells', async () => {
      const { fixture, root, host } = await setup();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      editor.valid.set(false);
      editor.value.set(-1);
      (root.querySelector('#outside') as HTMLElement).focus();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor')).not.toBeNull();
      expect(tree ? host.treeEdits : host.edits).toHaveLength(0);
      (root.querySelector('td[data-label="Status"]') as HTMLElement).dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true }),
      );
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor aeris-select')).not.toBeNull();
      expect(tree ? host.treeEdits : host.edits).toHaveLength(0);
    });

    it('commits when focus leaves the editor without stealing outside focus', async () => {
      const { fixture, root, host } = await setup();
      const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
      input.value = '17';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const outside = root.querySelector('#outside') as HTMLElement;
      outside.focus();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await fixture.whenStable();
      expect((tree ? host.treeEdits : host.edits)[0].value).toBe(17);
      expect(root.querySelector('.aeris-cell-editor')).toBeNull();
      expect(document.activeElement).toBe(outside);
    });

    it('cancels without mutation and does not intercept composing or consumed Escape', async () => {
      const { fixture, root, host } = await setup();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      editor.value.set(null);
      const input = root.querySelector('.aeris-cell-editor input') as HTMLInputElement;
      const consumed = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      consumed.preventDefault();
      input.dispatchEvent(consumed);
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, isComposing: true }),
      );
      await fixture.whenStable();
      expect(root.querySelector('editor-actions')).not.toBeNull();
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor')).toBeNull();
      expect(tree ? host.treeEdits : host.edits).toHaveLength(0);
      expect(host.nodes()[0].data['amount']).toBe(7);
    });

    it('retires the active draft when editing is disabled and can start a fresh session', async () => {
      const { fixture, root, cell, host } = await setup();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      host.enabled.set(false);
      await fixture.whenStable();
      expect(root.querySelector('.aeris-cell-editor')).toBeNull();
      editor.commit();
      expect(tree ? host.treeEdits : host.edits).toHaveLength(0);
      host.enabled.set(true);
      await fixture.whenStable();
      cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await fixture.whenStable();
      expect(root.querySelector('editor-actions')).not.toBeNull();
    });

    it('preserves structured and boolean values without coercing them to text', async () => {
      const { fixture, cell, host } = await setup();
      for (const value of [true, [1, 2], { selected: 'blue' }]) {
        const editor = fixture.debugElement
          .query(By.directive(EditorActions))
          .componentInstance.editor() as AerisCellEditor;
        editor.value.set(value);
        editor.commit();
        await fixture.whenStable();
        expect((tree ? host.treeEdits : host.edits).at(-1)?.value).toBe(value);
        cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        await fixture.whenStable();
      }
    });

    it('does not steal outside focus when a built-in edit commits on blur', async () => {
      const { fixture, root } = await setup(false);
      const outside = root.querySelector('#outside') as HTMLButtonElement;
      outside.focus();
      await fixture.whenStable();
      expect(document.activeElement).toBe(outside);
      expect(root.querySelector('.aeris-cell-editor')).toBeNull();
    });

    it('keeps a real body-mounted Select open through selection and commits its typed value', async () => {
      const { fixture, root } = await setup();
      fixture.debugElement.query(By.directive(EditorActions)).componentInstance.editor().cancel();
      await fixture.whenStable();
      const cell = root.querySelector('td[data-label="Status"]') as HTMLElement;
      cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await fixture.whenStable();
      const trigger = root.querySelector('.aeris-cell-editor [role="combobox"]') as HTMLElement;
      trigger.click();
      await fixture.whenStable();
      const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
      expect(panel).not.toBeNull();
      expect(root.contains(panel)).toBe(false);
      const option = Array.from(panel?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).find(
        (el) => el.textContent?.includes('Published'),
      );
      option?.click();
      await fixture.whenStable();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      expect(editor.value()).toBe('published');
      expect(root.querySelector('editor-actions')).not.toBeNull();
      editor.commit();
      await fixture.whenStable();
      expect(root.querySelector('editor-actions')).toBeNull();
    });

    it('preserves Date and null values without string conversion', async () => {
      const { fixture, root, host } = await setup();
      fixture.debugElement.query(By.directive(EditorActions)).componentInstance.editor().cancel();
      await fixture.whenStable();
      (root.querySelector('td[data-label="Date"]') as HTMLElement).dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true }),
      );
      await fixture.whenStable();
      const editor = fixture.debugElement
        .query(By.directive(EditorActions))
        .componentInstance.editor() as AerisCellEditor;
      expect(editor.value()).toBe(host.date);
      expect(root.querySelector('aeris-date-picker')).not.toBeNull();
      editor.value.set(null);
      editor.commit();
      await fixture.whenStable();
      expect((tree ? host.treeEdits : host.edits)[0].value).toBeNull();
    });
  });
}
