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

  it('keeps one node in the tab order and navigates visible nodes without selecting', () => {
    const fixture = setup();
    const nodes = [...fixture.nativeElement.querySelectorAll('[role="treeitem"]')] as HTMLElement[];
    const press = (key: string) => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };
    expect(nodes.map((node) => node.tabIndex)).toEqual([0, -1, -1]);
    expect(fixture.nativeElement.querySelector('.aeris-organization-chart__toggle').tabIndex).toBe(
      -1,
    );
    nodes[0].focus();
    press('ArrowDown');
    expect(document.activeElement).toBe(nodes[1]);
    expect(nodes.map((node) => node.tabIndex)).toEqual([-1, 0, -1]);
    press('ArrowDown');
    expect(document.activeElement).toBe(nodes[2]);
    press('ArrowDown');
    expect(document.activeElement).toBe(nodes[2]);
    press('ArrowUp');
    expect(document.activeElement).toBe(nodes[1]);
    press('ArrowLeft');
    expect(document.activeElement).toBe(nodes[0]);
    press('ArrowRight');
    expect(document.activeElement).toBe(nodes[1]);
    expect(fixture.componentInstance.selectionKeys()).toEqual([]);
  });

  it('expands branches before entering children and collapses before moving to a parent', () => {
    const fixture = setup();
    const parent = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;
    parent.focus();
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsedKeys()).toEqual(['ceo']);
    expect(parent.getAttribute('aria-expanded')).toBe('false');
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsedKeys()).toEqual([]);
    expect(document.activeElement).toBe(parent);
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect((document.activeElement as HTMLElement).dataset['aerisKey']).toBe('design');
  });

  it('restores a focused descendant to its visible parent on controlled collapse', () => {
    const fixture = setup();
    const child = fixture.nativeElement.querySelector('[data-aeris-key="design"]') as HTMLElement;
    child.focus();
    fixture.detectChanges();
    fixture.componentInstance.collapsedKeys.set(['ceo']);
    fixture.detectChanges();
    const parent = fixture.nativeElement.querySelector('[data-aeris-key="ceo"]') as HTMLElement;
    expect(document.activeElement).toBe(parent);
    expect(parent.tabIndex).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(
      1,
    );
  });

  it('mirrors expansion arrows in RTL and supports label navigation', () => {
    const fixture = setup();
    const chart = fixture.nativeElement.querySelector('aeris-organization-chart') as HTMLElement;
    chart.style.direction = 'rtl';
    const parent = chart.querySelector('[role="treeitem"]') as HTMLElement;
    parent.focus();
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsedKeys()).toEqual(['ceo']);
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
    fixture.detectChanges();
    expect((document.activeElement as HTMLElement).dataset['aerisKey']).toBe('engineering');
  });

  it('respects non-collapsible charts and exposes multiple selection', async () => {
    const fixture = TestBed.createComponent(AerisOrganizationChart);
    fixture.componentRef.setInput('value', [
      { key: 'root', label: 'Root', children: [{ key: 'child', label: 'Child' }] },
    ]);
    fixture.componentRef.setInput('collapsible', false);
    fixture.componentRef.setInput('selectionMode', 'multiple');
    await fixture.whenStable();
    const parent = fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLElement;
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(parent.getAttribute('aria-expanded')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('[role="tree"]').getAttribute('aria-multiselectable'),
    ).toBe('true');
  });

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
