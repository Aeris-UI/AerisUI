import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerisPickList, AerisPickListModule } from '../../../pick-list/aeris-pick-list';

interface TestItem extends Record<string, unknown> {
  readonly id: string;
  readonly label: string;
  readonly category: string;
}

@Component({
  imports: [AerisPickListModule],
  template: `
    <aeris-pick-list
      #pickList
      showFilter
      filterBy="label,category"
      [(source)]="source"
      [(target)]="target"
      [(sourceSelectedKeys)]="sourceSelectedKeys"
      [(targetSelectedKeys)]="targetSelectedKeys"
      (transferred)="transferCount += 1"
      (reordered)="reorderCount += 1"
    />
  `,
})
class PickListTestHost {
  readonly pickList = viewChild.required<AerisPickList<TestItem>>('pickList');
  source: readonly TestItem[] = [
    { id: 'a', label: 'Alpha', category: 'One' },
    { id: 'b', label: 'Beta', category: 'Two' },
    { id: 'c', label: 'Gamma', category: 'One' },
  ];
  target: readonly TestItem[] = [
    { id: 'd', label: 'Delta', category: 'Two' },
  ];
  sourceSelectedKeys: readonly string[] = [];
  targetSelectedKeys: readonly string[] = [];
  transferCount = 0;
  reorderCount = 0;
}

describe('AerisPickList', () => {
  function setup(): ComponentFixture<PickListTestHost> {
    const fixture = TestBed.createComponent(PickListTestHost);
    fixture.detectChanges();
    return fixture;
  }

  it('renders two named multi-select listboxes with draggable options', () => {
    const fixture = setup();
    const listboxes = fixture.nativeElement.querySelectorAll('[role="listbox"]') as NodeListOf<HTMLElement>;
    const options = fixture.nativeElement.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;

    expect(listboxes.length).toBe(2);
    expect(listboxes.item(0).getAttribute('aria-label')).toBe('Available items');
    expect(listboxes.item(1).getAttribute('aria-label')).toBe('Selected items');
    expect(listboxes.item(0).getAttribute('aria-multiselectable')).toBe('true');
    expect(options.length).toBe(4);
    expect(options.item(0).draggable).toBe(true);
  });

  it('places reorder controls outside each list viewport', () => {
    const fixture = setup();
    const paneBodies = fixture.nativeElement.querySelectorAll('.aeris-pick-list__pane-body') as NodeListOf<HTMLElement>;
    const sourceChildren = paneBodies.item(0).children;
    const targetChildren = paneBodies.item(1).children;

    expect(sourceChildren.item(0)?.classList.contains('aeris-pick-list__reorder-controls')).toBe(true);
    expect(sourceChildren.item(1)?.classList.contains('aeris-pick-list__viewport')).toBe(true);
    expect(targetChildren.item(0)?.classList.contains('aeris-pick-list__viewport')).toBe(true);
    expect(targetChildren.item(1)?.classList.contains('aeris-pick-list__reorder-controls')).toBe(true);
  });

  it('moves selected items between controlled collections', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    host.pickList().sourceSelectedKeys.set(['b']);
    fixture.detectChanges();

    host.pickList().moveSelectedToTarget();
    fixture.detectChanges();

    expect(host.source.map((item) => item.id)).toEqual(['a', 'c']);
    expect(host.target.map((item) => item.id)).toEqual(['d', 'b']);
    expect(host.sourceSelectedKeys).toEqual([]);
    expect(host.transferCount).toBe(1);
  });

  it('filters by multiple configured properties', () => {
    const fixture = setup();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="search"]') as NodeListOf<HTMLInputElement>;
    inputs.item(0).value = 'Two';
    inputs.item(0).dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const sourceOptions = fixture.nativeElement.querySelectorAll('.aeris-pick-list__pane:first-of-type [role="option"]') as NodeListOf<HTMLElement>;
    expect(sourceOptions.length).toBe(1);
    expect(sourceOptions.item(0).textContent).toContain('Beta');
  });

  it('supports active-option keyboard selection and transfer', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    const sourceListbox = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;

    sourceListbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    sourceListbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();
    expect(host.sourceSelectedKeys).toEqual(['a']);

    sourceListbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(host.target.map((item) => item.id)).toEqual(['d', 'a']);
  });

  it('reorders selected items within a pane', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    host.pickList().sourceSelectedKeys.set(['b']);
    fixture.detectChanges();

    host.pickList().moveSelectedUp('source');
    fixture.detectChanges();

    expect(host.source.map((item) => item.id)).toEqual(['b', 'a', 'c']);
    expect(host.reorderCount).toBe(1);
  });

  it('transfers items through DOM drag and drop', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    const sourceOption = fixture.nativeElement.querySelector('[role="option"]') as HTMLElement;
    const targetListbox = fixture.nativeElement.querySelectorAll('[role="listbox"]')[1] as HTMLElement;

    sourceOption.dispatchEvent(new Event('dragstart', { bubbles: true }));
    targetListbox.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    targetListbox.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    sourceOption.dispatchEvent(new Event('dragend', { bubbles: true }));
    fixture.detectChanges();

    expect(host.source.map((item) => item.id)).toEqual(['b', 'c']);
    expect(host.target.map((item) => item.id)).toEqual(['d', 'a']);
    expect(host.transferCount).toBe(1);
  });
});
