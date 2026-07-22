import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AerisTimeline,
  AerisTimelineModule,
  type AerisTimelineItem,
} from '../../../timeline/aeris-timeline';

interface DeliveryData {
  readonly location: string;
}

const EVENTS: readonly AerisTimelineItem<DeliveryData>[] = [
  { id: 'ordered', title: 'Order confirmed', date: '09:20', status: 'success', markerColor: '#456789', data: { location: 'Online' } },
  { id: 'transit', title: 'In transit', date: '13:45', status: 'info', data: { location: 'Belgrade' } },
  { id: 'delivery', title: 'Delivery', date: 'Tomorrow', data: { location: 'Home' } },
];

@Component({
  imports: [AerisTimelineModule],
  template: `
    <aeris-timeline
      #timeline
      ariaLabel="Delivery progress"
      align="alternate"
      [activeIndex]="1"
      [orientation]="orientation()"
      [reverse]="reverse()"
      [value]="events()"
    />
  `,
})
class TimelineTestHost {
  readonly timeline = viewChild.required<AerisTimeline<DeliveryData>>('timeline');
  readonly events = signal(EVENTS);
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
  readonly reverse = signal(false);
}

@Component({
  imports: [AerisTimelineModule],
  template: `
    <aeris-timeline [value]="events">
      <ng-template aerisTimelineMarker let-status="status">
        <span class="custom-marker" [attr.data-status]="status"></span>
      </ng-template>
      <ng-template aerisTimelineContent let-item>
        <a class="custom-content" href="#details">{{ item.title }}</a>
      </ng-template>
      <ng-template aerisTimelineOpposite let-item>
        <span class="custom-opposite">{{ $any(item).data.location }}</span>
      </ng-template>
    </aeris-timeline>
  `,
})
class TimelineTemplateHost {
  readonly events = EVENTS;
}

@Component({
  imports: [AerisTimelineModule],
  template: `
    <aeris-timeline [value]="[]">
      <ng-template aerisTimelineEmpty><strong class="custom-empty">Nothing scheduled</strong></ng-template>
    </aeris-timeline>
  `,
})
class TimelineEmptyHost {}

describe('AerisTimeline', () => {
  function setup(): ComponentFixture<TimelineTestHost> {
    const fixture = TestBed.createComponent(TimelineTestHost);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a named semantic ordered list', () => {
    const fixture = setup();
    const list = fixture.nativeElement.querySelector('ol') as HTMLOListElement;
    const items = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>;

    expect(list.getAttribute('aria-label')).toBe('Delivery progress');
    expect(items.length).toBe(3);
    expect(items.item(0).textContent).toContain('Order confirmed');
    expect(items.item(0).textContent).toContain('09:20');
    expect(items.item(0).style.getPropertyValue('--aeris-timeline-marker-color')).toBe('#456789');
  });

  it('applies alternate alignment and progress semantics', () => {
    const fixture = setup();
    const items = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>;

    expect(items.item(0).dataset['side']).toBe('start');
    expect(items.item(1).dataset['side']).toBe('end');
    expect(items.item(0).dataset['state']).toBe('complete');
    expect(items.item(1).dataset['state']).toBe('current');
    expect(items.item(1).getAttribute('aria-current')).toBe('step');
    expect(items.item(2).dataset['state']).toBe('upcoming');
  });

  it('reverses display order without mutating the input collection', () => {
    const fixture = setup();
    fixture.componentInstance.reverse.set(true);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>;
    expect(items.item(0).textContent).toContain('Delivery');
    expect(fixture.componentInstance.events()[0]?.title).toBe('Order confirmed');
  });

  it('switches between vertical and horizontal orientation', () => {
    const fixture = setup();
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('.aeris-timeline') as HTMLElement;
    expect(timeline.dataset['orientation']).toBe('horizontal');
  });

  it('renders marker, content, and opposite templates', () => {
    const fixture = TestBed.createComponent(TimelineTemplateHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.custom-marker').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.aeris-timeline__marker')?.getAttribute('data-custom')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('.custom-content').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.custom-opposite')?.textContent).toContain('Online');
    expect(fixture.nativeElement.querySelector('.custom-content')?.getAttribute('href')).toBe('#details');
  });

  it('renders a custom empty state', () => {
    const fixture = TestBed.createComponent(TimelineEmptyHost);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.aeris-timeline__empty') as HTMLElement;
    expect(empty.getAttribute('role')).toBe('status');
    expect(empty.querySelector('.custom-empty')?.textContent).toContain('Nothing scheduled');
  });
});
