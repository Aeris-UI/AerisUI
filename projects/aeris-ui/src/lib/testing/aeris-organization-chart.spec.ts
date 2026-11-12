import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AerisOrganizationChart,
  type AerisOrganizationChartNode,
} from '../../../organization-chart/aeris-organization-chart';

@Component({
  imports: [AerisOrganizationChart],
  template: `
    <aeris-organization-chart
      [value]="nodes"
      selectionMode="single"
      [(selectionKeys)]="selectionKeys"
      [(collapsedKeys)]="collapsedKeys"
      (nodeSelected)="selectedKey.set($event.key)"
      (nodeCollapsed)="collapsedKey.set($event.key)"
    />
  `,
})
class OrganizationChartHost {
  readonly selectionKeys = signal<readonly string[]>([]);
  readonly collapsedKeys = signal<readonly string[]>([]);
  readonly selectedKey = signal('');
  readonly collapsedKey = signal('');
  readonly nodes: readonly AerisOrganizationChartNode[] = [
    {
      key: 'ceo',
      label: 'CEO',
      children: [
        { key: 'design', label: 'Design' },
        { key: 'engineering', label: 'Engineering' },
      ],
    },
  ];
}

describe('AerisOrganizationChart', () => {
  function setup(): ComponentFixture<OrganizationChartHost> {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(OrganizationChartHost);
    fixture.detectChanges();
    return fixture;
  }

  it('renders hierarchical nodes', () => {
    const fixture = setup();

    expect(fixture.nativeElement.textContent).toContain('CEO');
    expect(fixture.nativeElement.textContent).toContain('Design');
    expect(fixture.nativeElement.textContent).toContain('Engineering');
    const tree: HTMLElement = fixture.nativeElement.querySelector('[role="tree"]');
    const branch = tree.querySelector('[role="treeitem"]');
    expect(branch?.tagName).toBe('LI');
    expect(branch?.querySelector(':scope > [role="group"]')).not.toBeNull();
    expect(tree.querySelectorAll('li:not([role="treeitem"])')).toHaveLength(0);
  });

  it('selects a child exactly once without selecting its parent', () => {
    const fixture = setup();
    const nodes: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    nodes[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectionKeys()).toEqual(['design']);
    expect(fixture.componentInstance.selectedKey()).toBe('design');
    expect(nodes[0].getAttribute('aria-selected')).toBe('false');
    expect(nodes[1].getAttribute('aria-selected')).toBe('true');
  });

  it('focuses the tree items with Home and End without handling the key again in ancestors', () => {
    const fixture = setup();
    const nodes: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    nodes[1].focus();
    nodes[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(nodes[0]);
    nodes[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(nodes[2]);
    expect(fixture.componentInstance.selectionKeys()).toEqual([]);
  });

  it('selects a node', () => {
    const fixture = setup();
    const node = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;

    node.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectionKeys()).toEqual(['ceo']);
    expect(fixture.componentInstance.selectedKey()).toBe('ceo');
  });

  it('collapses child nodes', () => {
    const fixture = setup();
    const toggle = fixture.nativeElement.querySelector(
      '.aeris-organization-chart__toggle',
    ) as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.collapsedKeys()).toEqual(['ceo']);
    expect(fixture.componentInstance.collapsedKey()).toBe('ceo');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.textContent).not.toContain('Design');
    expect(fixture.componentInstance.selectionKeys()).toEqual([]);
  });
});
