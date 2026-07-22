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
    const toggle = fixture.nativeElement.querySelector('.aeris-organization-chart__toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.collapsedKeys()).toEqual(['ceo']);
    expect(fixture.componentInstance.collapsedKey()).toBe('ceo');
    expect(fixture.nativeElement.textContent).not.toContain('Design');
  });
});
