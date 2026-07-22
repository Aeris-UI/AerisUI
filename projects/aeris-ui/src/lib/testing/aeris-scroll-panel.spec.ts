import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisScrollPanel,
  AerisScrollPanelModule,
  type AerisScrollPanelEvent,
} from '../../../scroll-panel/aeris-scroll-panel';

@Component({
  imports: [AerisScrollPanelModule],
  template: `
    <aeris-scroll-panel ariaLabel="Activity feed" height="12rem" maxHeight="18rem">
      <p>First activity</p>
      <p>Second activity</p>
    </aeris-scroll-panel>
  `,
})
class BasicScrollPanelHost {}

@Component({
  imports: [AerisScrollPanelModule],
  template: `
    <aeris-scroll-panel
      orientation="both"
      variant="hover"
      fade
      [tabIndex]="2"
      width="24rem"
      height="10rem"
      (scrolled)="events.push($event)"
      (reachedTop)="topEvents.push($event)"
      (reachedBottom)="bottomEvents.push($event)"
      (reachedStart)="startEvents.push($event)"
      (reachedEnd)="endEvents.push($event)"
    >
      <div class="wide-content">Wide content</div>
    </aeris-scroll-panel>
  `,
})
class ConfiguredScrollPanelHost {
  readonly events: AerisScrollPanelEvent[] = [];
  readonly topEvents: AerisScrollPanelEvent[] = [];
  readonly bottomEvents: AerisScrollPanelEvent[] = [];
  readonly startEvents: AerisScrollPanelEvent[] = [];
  readonly endEvents: AerisScrollPanelEvent[] = [];
}

@Component({
  imports: [AerisScrollPanelModule],
  template: `
    <aeris-scroll-panel #panel ariaLabelledBy="feed-title" variant="hidden">
      Hidden scrollbars
    </aeris-scroll-panel>
  `,
})
class MethodScrollPanelHost {
  readonly panel = viewChild.required<AerisScrollPanel>('panel');
}

describe('AerisScrollPanel', () => {
  it('renders a focusable named scroll region with projected content and sizing', () => {
    const fixture = TestBed.createComponent(BasicScrollPanelHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-scroll-panel') as HTMLElement;
    const frame = fixture.nativeElement.querySelector('.aeris-scroll-panel__frame') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-scroll-panel__viewport') as HTMLElement;

    expect(host.getAttribute('data-orientation')).toBe('vertical');
    expect(host.getAttribute('data-variant')).toBe('auto');
    expect(viewport.getAttribute('role')).toBe('region');
    expect(viewport.getAttribute('aria-label')).toBe('Activity feed');
    expect(viewport.tabIndex).toBe(0);
    expect(frame.style.blockSize).toBe('12rem');
    expect(frame.style.maxBlockSize).toBe('18rem');
    expect(fixture.nativeElement.textContent).toContain('First activity');
  });

  it('applies orientation, variant, fade, and tabindex attributes', () => {
    const fixture = TestBed.createComponent(ConfiguredScrollPanelHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-scroll-panel') as HTMLElement;
    const frame = fixture.nativeElement.querySelector('.aeris-scroll-panel__frame') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-scroll-panel__viewport') as HTMLElement;

    expect(host.getAttribute('data-orientation')).toBe('both');
    expect(host.getAttribute('data-variant')).toBe('hover');
    expect(host.getAttribute('data-fade')).toBe('true');
    expect(viewport.tabIndex).toBe(2);
    expect(frame.style.inlineSize).toBe('24rem');
    expect(frame.style.blockSize).toBe('10rem');
    expect(fixture.nativeElement.querySelector('.aeris-scroll-panel__fade--bottom')).not.toBeNull();
  });

  it('emits scroll state and boundary events', () => {
    const fixture = TestBed.createComponent(ConfiguredScrollPanelHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-scroll-panel') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-scroll-panel__viewport') as HTMLElement;
    defineScrollMetrics(viewport, {
      scrollTop: 200,
      scrollLeft: 300,
      scrollHeight: 300,
      scrollWidth: 500,
      clientHeight: 100,
      clientWidth: 200,
    });

    viewport.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const event = fixture.componentInstance.events[0];
    expect(event?.scrollTop).toBe(200);
    expect(event?.scrollLeft).toBe(300);
    expect(event?.atBottom).toBe(true);
    expect(event?.atEnd).toBe(true);
    expect(fixture.componentInstance.bottomEvents.length).toBe(1);
    expect(fixture.componentInstance.endEvents.length).toBe(1);
    expect(fixture.componentInstance.topEvents.length).toBe(0);
    expect(fixture.componentInstance.startEvents.length).toBe(0);
    expect(host.getAttribute('data-scroll-top')).toBe('true');
    expect(host.getAttribute('data-scroll-bottom')).toBeNull();
    expect(host.getAttribute('data-scroll-start')).toBe('true');
    expect(host.getAttribute('data-scroll-end')).toBeNull();
  });

  it('supports aria-labelledby, hidden variant, and public scroll methods', () => {
    const fixture = TestBed.createComponent(MethodScrollPanelHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-scroll-panel') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-scroll-panel__viewport') as HTMLElement & {
      scrollTo: (options: ScrollToOptions) => void;
      scrollBy: (options: ScrollToOptions) => void;
    };
    const scrollToCalls: ScrollToOptions[] = [];
    const scrollByCalls: ScrollToOptions[] = [];
    viewport.scrollTo = (options: ScrollToOptions) => scrollToCalls.push(options);
    viewport.scrollBy = (options: ScrollToOptions) => scrollByCalls.push(options);
    defineScrollMetrics(viewport, {
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 400,
      scrollWidth: 600,
      clientHeight: 100,
      clientWidth: 200,
    });

    expect(host.getAttribute('data-variant')).toBe('hidden');
    expect(viewport.getAttribute('aria-label')).toBeNull();
    expect(viewport.getAttribute('aria-labelledby')).toBe('feed-title');

    fixture.componentInstance.panel().scrollToTop({ behavior: 'smooth' });
    fixture.componentInstance.panel().scrollToBottom();
    fixture.componentInstance.panel().scrollToStart();
    fixture.componentInstance.panel().scrollToEnd({ behavior: 'smooth' });
    fixture.componentInstance.panel().scrollBy({ top: 20 });

    expect(scrollToCalls).toEqual([
      { behavior: 'smooth', top: 0 },
      { top: 300 },
      { left: 0 },
      { behavior: 'smooth', left: 400 },
    ]);
    expect(scrollByCalls).toEqual([{ top: 20 }]);
  });
});

function defineScrollMetrics(
  viewport: HTMLElement,
  metrics: {
    readonly scrollTop: number;
    readonly scrollLeft: number;
    readonly scrollHeight: number;
    readonly scrollWidth: number;
    readonly clientHeight: number;
    readonly clientWidth: number;
  },
): void {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(viewport, key, {
      configurable: true,
      value,
    });
  }
}
