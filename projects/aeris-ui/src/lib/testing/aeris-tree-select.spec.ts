import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisTreeSelect,
  AerisTreeSelectComponent,
  type AerisTreeNode,
  type AerisTreeSelectChangeEvent,
} from '../../../tree-select/aeris-tree-select';

const nodes: readonly AerisTreeNode[] = [
  {
    label: 'Root',
    value: 'root',
    expanded: true,
    selectable: false,
    children: [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ],
  },
];

@Component({
  imports: [AerisTreeSelect],
  template: `
    <aeris-tree-select
      #treeSelect
      inputId="destination"
      name="destination"
      ariaLabel="Destination"
      [nodes]="nodes"
      [(value)]="value"
      (changed)="lastChange.set($event)"
    />
  `,
})
class TreeSelectHost {
  readonly treeSelect = viewChild.required<AerisTreeSelectComponent>('treeSelect');
  readonly nodes = nodes;
  readonly value = signal<string | null>('alpha');
  readonly lastChange = signal<AerisTreeSelectChangeEvent | null>(null);
}

describe('AerisTreeSelect', () => {
  it('exposes combobox and native form semantics', async () => {
    const fixture = TestBed.createComponent(TreeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    const hidden = fixture.nativeElement.querySelector('input[type="hidden"]') as HTMLInputElement;

    expect(trigger.id).toBe('destination');
    expect(trigger.getAttribute('aria-label')).toBe('Destination');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(hidden.name).toBe('destination');
    expect(hidden.value).toBe('alpha');
  });

  it('opens, navigates, and selects with keyboard', async () => {
    const fixture = TestBed.createComponent(TreeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('beta');
    expect(fixture.componentInstance.lastChange()?.node?.label).toBe('Beta');
  });

  it('supports checkbox mode, clearing, and disabled forms state', async () => {
    const fixture = TestBed.createComponent(AerisTreeSelectComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('selectionMode', 'checkbox');
    fixture.componentRef.setInput('value', ['alpha']);
    fixture.componentRef.setInput('clearable', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    component.clear();
    fixture.detectChanges();
    expect(component.value()).toEqual([]);

    component.writeValue(['beta']);
    fixture.detectChanges();
    expect(component.value()).toEqual(['beta']);

    component.setDisabledState(true);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
  });

  it('renders checked and mixed states with distinct checkbox marks', async () => {
    const fixture = TestBed.createComponent(AerisTreeSelectComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('selectionMode', 'checkbox');
    fixture.componentRef.setInput('value', ['alpha']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLElement>;
    const mixedBox = items[0]?.querySelector('.aeris-tree-select__box') as HTMLElement;
    const checkedBox = items[1]?.querySelector('.aeris-tree-select__box') as HTMLElement;

    expect(items[0]?.getAttribute('aria-checked')).toBe('mixed');
    expect(mixedBox.hasAttribute('data-mixed')).toBe(true);
    expect(mixedBox.hasAttribute('data-checked')).toBe(false);
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
    expect(checkedBox.hasAttribute('data-checked')).toBe(true);
    expect(checkedBox.hasAttribute('data-mixed')).toBe(false);
  });

  it('derives parent checkbox state from all selectable children', async () => {
    const fixture = TestBed.createComponent(AerisTreeSelectComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('selectionMode', 'checkbox');
    fixture.componentRef.setInput('value', ['alpha', 'beta']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;
    const box = root.querySelector('.aeris-tree-select__box') as HTMLElement;
    expect(root.getAttribute('aria-checked')).toBe('true');
    expect(box.hasAttribute('data-checked')).toBe(true);
    expect(box.hasAttribute('data-mixed')).toBe(false);

    fixture.componentRef.setInput('value', ['root']);
    fixture.detectChanges();
    expect(root.getAttribute('aria-checked')).toBe('false');
    expect(box.hasAttribute('data-checked')).toBe(false);
    expect(box.hasAttribute('data-mixed')).toBe(false);
  });

  it('keeps ancestor values synchronized as children are toggled', async () => {
    const selectableNodes: readonly AerisTreeNode[] = [
      {
        label: 'Root',
        value: 'root',
        expanded: true,
        children: [
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' },
        ],
      },
    ];
    const fixture = TestBed.createComponent(AerisTreeSelectComponent);
    fixture.componentRef.setInput('nodes', selectableNodes);
    fixture.componentRef.setInput('selectionMode', 'checkbox');
    fixture.componentRef.setInput('value', []);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    let items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLElement>;
    items[0]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['root', 'alpha', 'beta']);
    expect(items[0]?.getAttribute('aria-checked')).toBe('true');

    items[1]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['beta']);
    expect(items[0]?.getAttribute('aria-checked')).toBe('mixed');

    items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLElement>;
    items[2]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
    expect(items[0]?.getAttribute('aria-checked')).toBe('false');

    items[1]?.click();
    items[2]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['alpha', 'beta', 'root']);
    expect(items[0]?.getAttribute('aria-checked')).toBe('true');

    items[0]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
  });
});
