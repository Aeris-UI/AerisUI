import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AerisTree,
  AerisTreeModule,
  type AerisTreeDropEvent,
  type AerisTreeNode,
} from '../../../tree/aeris-tree';

interface FileData {
  readonly kind: 'folder' | 'file';
}

const NODES: readonly AerisTreeNode<FileData>[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    data: { kind: 'folder' },
    children: [
      {
        key: 'src',
        label: 'Source',
        data: { kind: 'folder' },
        children: [{ key: 'app', label: 'app.ts', leaf: true, data: { kind: 'file' } }],
      },
      { key: 'readme', label: 'README.md', leaf: true, data: { kind: 'file' } },
    ],
  },
  { key: 'archive', label: 'Archive', disabled: true, leaf: true, data: { kind: 'folder' } },
];

@Component({
  imports: [AerisTreeModule],
  template: `
    <aeris-tree
      #tree
      ariaLabel="Project files"
      filter
      [selectionMode]="mode()"
      [(value)]="nodes"
      [loadingKeys]="loadingKeys()"
      [dragDrop]="dragDrop()"
      [(expandedKeys)]="expandedKeys"
      [(selectionKeys)]="selectionKeys"
      [(filterValue)]="query"
      (nodeExpanded)="expandedEvent.set($event.key)"
      (nodeCollapsed)="collapsedEvent.set($event.key)"
      (selectionChanged)="selectionEvent.set($event.key)"
      (filterChanged)="filterEvent.set($event.value)"
      (nodeDropped)="droppedEvent.set($event)"
    />
  `,
})
class TreeTestHost {
  readonly tree = viewChild.required<AerisTree<FileData>>('tree');
  readonly nodes = signal(NODES);
  readonly mode = signal<'single' | 'multiple' | 'checkbox'>('checkbox');
  readonly loadingKeys = signal<readonly string[]>([]);
  readonly dragDrop = signal(false);
  readonly expandedKeys = signal<readonly string[]>([]);
  readonly selectionKeys = signal<readonly string[]>([]);
  readonly query = signal('');
  readonly expandedEvent = signal('');
  readonly collapsedEvent = signal('');
  readonly selectionEvent = signal('');
  readonly filterEvent = signal('');
  readonly droppedEvent = signal<AerisTreeDropEvent<FileData> | null>(null);
}

@Component({
  imports: [AerisTreeModule],
  template: `
    <aeris-tree [value]="nodes" [expandedKeys]="['workspace']">
      <ng-template aerisTreeNode let-node let-level="level" let-leaf="leaf">
        <span class="custom-node" [attr.data-level]="level" [attr.data-leaf]="leaf">
          {{ $any(node).data.kind }}: {{ $any(node).label }}
        </span>
      </ng-template>
    </aeris-tree>
  `,
})
class TreeTemplateHost {
  readonly nodes = NODES;
}

@Component({
  imports: [AerisTreeModule],
  template: `
    <aeris-tree [value]="[]" [loading]="loading()">
      <ng-template aerisTreeEmpty><strong class="custom-empty">Nothing here</strong></ng-template>
      <ng-template aerisTreeLoading
        ><strong class="custom-loading">Fetching nodes</strong></ng-template
      >
    </aeris-tree>
  `,
})
class TreeStateHost {
  readonly loading = signal(false);
}

describe('AerisTree', () => {
  function setup(): ComponentFixture<TreeTestHost> {
    const fixture = TestBed.createComponent(TreeTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function keydown(element: HTMLElement, key: string, init: KeyboardEventInit = {}): void {
    element.dispatchEvent(new KeyboardEvent('keydown', { ...init, key, bubbles: true }));
  }

  it('exports one module-array import with the component and templates', () => {
    expect(AerisTreeModule[0]).toBe(AerisTree);
    expect(AerisTreeModule.length).toBe(4);
  });

  it('renders a named, responsive ARIA tree with hierarchical metadata', () => {
    const fixture = setup();
    const tree = fixture.nativeElement.querySelector('[role="tree"]') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLElement>;

    expect(tree.getAttribute('aria-label')).toBe('Project files');
    expect(tree.getAttribute('aria-multiselectable')).toBe('true');
    expect(tree.closest('.aeris-tree')?.getAttribute('data-fluid')).toBe('true');
    expect(items.length).toBe(2);
    expect(items.item(0).getAttribute('aria-level')).toBe('1');
    expect(items.item(0).getAttribute('aria-posinset')).toBe('1');
    expect(items.item(0).getAttribute('aria-setsize')).toBe('2');
    expect(items.item(0).getAttribute('aria-expanded')).toBe('false');
    expect(items.item(1).getAttribute('aria-disabled')).toBe('true');
    expect(items.item(0).tabIndex).toBe(0);
    expect(items.item(1).tabIndex).toBe(-1);
  });

  it('expands and collapses branches while emitting controlled state events', () => {
    const fixture = setup();
    const toggle = fixture.nativeElement.querySelector('.aeris-tree__toggle') as HTMLElement;

    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace']);
    expect(fixture.componentInstance.expandedEvent()).toBe('workspace');
    expect(fixture.nativeElement.textContent).toContain('Source');

    (fixture.nativeElement.querySelector('.aeris-tree__toggle') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
    expect(fixture.componentInstance.collapsedEvent()).toBe('workspace');
  });

  it('supports roving focus and directional branch navigation', () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;

    root.focus();
    keydown(root, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace']);

    keydown(root, 'ArrowRight');
    fixture.detectChanges();
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('src');

    keydown(document.activeElement as HTMLElement, 'ArrowLeft');
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('workspace');

    keydown(document.activeElement as HTMLElement, 'End');
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('archive');
    keydown(document.activeElement as HTMLElement, 'Home');
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('workspace');
  });

  it('selects with the keyboard and supports label typeahead', () => {
    const fixture = setup();
    fixture.componentInstance.mode.set('single');
    fixture.componentInstance.tree().expandAll();
    fixture.detectChanges();

    fixture.componentInstance.tree().focus('app');
    keydown(document.activeElement as HTMLElement, ' ');
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['app']);

    fixture.componentInstance.tree().focus('workspace');
    keydown(document.activeElement as HTMLElement, 'r');
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('readme');
  });

  it('toggles independent nodes in multiple selection mode', () => {
    const fixture = setup();
    fixture.componentInstance.mode.set('multiple');
    fixture.componentInstance.tree().expandAll();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[data-tree-key="app"]') as HTMLElement).click();
    (fixture.nativeElement.querySelector('[data-tree-key="readme"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['app', 'readme']);
    expect(fixture.nativeElement.querySelector('.aeris-tree__box')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-tree-key="app"]')?.getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('reorders siblings and changes hierarchy with keyboard alternatives', () => {
    const fixture = setup();
    fixture.componentInstance.dragDrop.set(true);
    fixture.componentInstance.tree().expandAll();
    fixture.detectChanges();

    fixture.componentInstance.tree().focus('src');
    keydown(document.activeElement as HTMLElement, 'ArrowDown', { altKey: true });
    fixture.detectChanges();
    expect(fixture.componentInstance.nodes()[0]?.children?.map((node) => node.key)).toEqual([
      'readme',
      'src',
    ]);

    fixture.componentInstance.tree().focus('app');
    keydown(document.activeElement as HTMLElement, 'ArrowLeft', { altKey: true });
    fixture.detectChanges();
    expect(fixture.componentInstance.nodes()[0]?.children?.map((node) => node.key)).toEqual([
      'readme',
      'src',
      'app',
    ]);
    expect(fixture.componentInstance.droppedEvent()?.key).toBe('app');
    expect(fixture.componentInstance.droppedEvent()?.position).toBe('after');
  });

  it('moves a pointer-dragged node into a branch and announces the result', () => {
    const fixture = setup();
    fixture.componentInstance.dragDrop.set(true);
    fixture.componentInstance.tree().expandAll();
    fixture.detectChanges();

    const source = fixture.nativeElement.querySelector('[data-tree-key="readme"]') as HTMLElement;
    const target = fixture.nativeElement.querySelector('[data-tree-key="src"]') as HTMLElement;
    source.dispatchEvent(new Event('dragstart', { bubbles: true, cancelable: true }));
    target.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(target.getAttribute('data-drop-position')).toBe('inside');

    target.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.nodes()[0]?.children?.map((node) => node.key)).toEqual([
      'src',
    ]);
    expect(
      fixture.componentInstance.nodes()[0]?.children?.[0]?.children?.map((node) => node.key),
    ).toEqual(['app', 'readme']);
    expect(fixture.componentInstance.droppedEvent()?.targetKey).toBe('src');
    expect(fixture.nativeElement.textContent).toContain('README.md moved inside Source.');
  });

  it('cascades checkbox selection and exposes mixed parent state', () => {
    const fixture = setup();
    fixture.componentInstance.tree().expandAll();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLElement>;

    items.item(0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual([
      'workspace',
      'src',
      'app',
      'readme',
    ]);
    expect(fixture.componentInstance.selectionEvent()).toBe('workspace');
    expect(items.item(0).getAttribute('aria-checked')).toBe('true');

    items.item(2).click();
    fixture.detectChanges();
    const updatedRoot = fixture.nativeElement.querySelector(
      '[data-tree-key="workspace"]',
    ) as HTMLElement;
    expect(updatedRoot.getAttribute('aria-checked')).toBe('mixed');
    expect(fixture.componentInstance.selectionKeys()).not.toContain('app');

    updatedRoot.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual([
      'workspace',
      'src',
      'readme',
      'app',
    ]);
  });

  it('filters by label, preserves ancestors, emits changes, and restores focus', async () => {
    const fixture = setup();
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    input.value = 'app';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.query()).toBe('app');
    expect(fixture.componentInstance.filterEvent()).toBe('app');
    expect(fixture.nativeElement.textContent).toContain('Workspace');
    expect(fixture.nativeElement.textContent).toContain('Source');
    expect(fixture.nativeElement.textContent).toContain('app.ts');
    expect(fixture.nativeElement.textContent).not.toContain('README.md');

    (fixture.nativeElement.querySelector('.aeris-tree__filter-clear') as HTMLButtonElement).click();
    fixture.detectChanges();
    await Promise.resolve();
    expect(fixture.componentInstance.query()).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Archive');
    expect(document.activeElement).toBe(input);
  });

  it('announces an empty filter result', () => {
    const fixture = setup();
    fixture.componentInstance.query.set('missing');
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.aeris-tree__message') as HTMLElement;
    expect(message.getAttribute('role')).toBe('status');
    expect(message.textContent).toContain('No matching nodes');
  });

  it('emits expansion for lazy branches and marks node loading state', () => {
    const fixture = setup();
    fixture.componentInstance.nodes.set([
      { key: 'remote', label: 'Remote files', leaf: false, data: { kind: 'folder' } },
    ]);
    fixture.componentInstance.loadingKeys.set(['remote']);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;
    expect(item.getAttribute('aria-busy')).toBe('true');
    expect(item.getAttribute('aria-expanded')).toBe('false');

    fixture.componentInstance.loadingKeys.set([]);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.aeris-tree__toggle') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedEvent()).toBe('remote');
    expect(fixture.componentInstance.expandedKeys()).toEqual(['remote']);
  });

  it('renders typed node template context', () => {
    const fixture = TestBed.createComponent(TreeTemplateHost);
    fixture.detectChanges();
    const customNodes = fixture.nativeElement.querySelectorAll(
      '.custom-node',
    ) as NodeListOf<HTMLElement>;

    expect(customNodes.length).toBe(4);
    expect(customNodes.item(0).textContent).toContain('folder: Workspace');
    expect(customNodes.item(1).dataset['level']).toBe('2');
    expect(customNodes.item(2).dataset['leaf']).toBe('true');
  });

  it('renders custom empty and loading templates', () => {
    const fixture = TestBed.createComponent(TreeStateHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-empty')?.textContent).toContain(
      'Nothing here',
    );

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-loading')?.textContent).toContain(
      'Fetching nodes',
    );
    expect(fixture.nativeElement.querySelector('.custom-empty')).toBeNull();
  });

  it('provides focus, expandAll, and collapseAll methods', () => {
    const fixture = setup();
    const tree = fixture.componentInstance.tree();

    tree.expandAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual(['workspace', 'src']);

    tree.focus('readme');
    expect((document.activeElement as HTMLElement).dataset['treeKey']).toBe('readme');

    tree.collapseAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('README.md');
  });
});
