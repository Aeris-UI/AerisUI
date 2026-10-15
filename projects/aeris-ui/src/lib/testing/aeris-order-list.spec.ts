import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AerisOrderList } from '../../../order-list/aeris-order-list';

interface TestItem extends Record<string, unknown> {
  readonly id: string;
  readonly label: string;
}

@Component({
  imports: [AerisOrderList],
  template: `
    <aeris-order-list
      #orderList
      multiple
      [(items)]="items"
      [(selectedKeys)]="selectedKeys"
      (reordered)="reorderCount += 1"
    />
  `,
})
class OrderListHost {
  readonly orderList = viewChild.required<AerisOrderList<TestItem>>('orderList');
  items: readonly TestItem[] = [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
    { id: 'c', label: 'Gamma' },
  ];
  selectedKeys: readonly string[] = ['b'];
  reorderCount = 0;
}

describe('AerisOrderList', () => {
  function setup(): ComponentFixture<OrderListHost> {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(OrderListHost);
    fixture.detectChanges();
    return fixture;
  }

  it('renders listbox options from items', () => {
    const fixture = setup();
    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    const controlIcons = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.aeris-order-list__controls [data-icon]',
      ) as NodeListOf<HTMLElement>,
      (icon) => icon.dataset['icon'],
    );
    const controlIconPaths = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.aeris-order-list__controls svg path',
      ) as NodeListOf<SVGPathElement>,
      (path) => path.getAttribute('d'),
    );

    expect(options.length).toBe(3);
    expect(options[1].textContent).toContain('Beta');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    const itemRadius = getComputedStyle(options[0] as HTMLElement).borderRadius;
    expect(itemRadius).toContain('--aeris-radius-item');
    expect(controlIcons).toEqual(['top', 'up', 'down', 'bottom']);
    expect(controlIconPaths).toEqual([
      'm17 11-5-5-5 5',
      'm17 18-5-5-5 5',
      'm18 15-6-6-6 6',
      'm6 9 6 6 6-6',
      'm7 6 5 5 5-5',
      'm7 13 5 5 5-5',
    ]);
  });

  it('moves selected items up', () => {
    const fixture = setup();
    const host = fixture.componentInstance;

    host.orderList().moveSelectedUp();
    fixture.detectChanges();

    expect(host.items.map((item) => item.id)).toEqual(['b', 'a', 'c']);
    expect(host.reorderCount).toBe(1);
  });

  it('keeps the viewport in the flexible content column without reorder controls', () => {
    const fixture = TestBed.createComponent(AerisOrderList);
    fixture.componentRef.setInput('items', [{ id: 'a', label: 'Alpha' }]);
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector(
      '.aeris-order-list__viewport',
    ) as HTMLElement;
    expect(fixture.nativeElement.querySelector('.aeris-order-list__controls')).toBeNull();
    expect(getComputedStyle(viewport).gridColumn).toMatch(/^-2\s*\/\s*-1$/);
    fixture.componentRef.setInput('showControls', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.aeris-order-list__controls')).not.toBeNull();
    expect(getComputedStyle(viewport).gridColumn).toMatch(/^-2\s*\/\s*-1$/);
  });

  it('moves selected items to bottom', () => {
    const fixture = setup();
    const host = fixture.componentInstance;

    host.orderList().moveSelectedToBottom();
    fixture.detectChanges();

    expect(host.items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });
});
