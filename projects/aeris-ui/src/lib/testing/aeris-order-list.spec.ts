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

    expect(options.length).toBe(3);
    expect(options[1].textContent).toContain('Beta');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
  });

  it('moves selected items up', () => {
    const fixture = setup();
    const host = fixture.componentInstance;

    host.orderList().moveSelectedUp();
    fixture.detectChanges();

    expect(host.items.map((item) => item.id)).toEqual(['b', 'a', 'c']);
    expect(host.reorderCount).toBe(1);
  });

  it('moves selected items to bottom', () => {
    const fixture = setup();
    const host = fixture.componentInstance;

    host.orderList().moveSelectedToBottom();
    fixture.detectChanges();

    expect(host.items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });
});
