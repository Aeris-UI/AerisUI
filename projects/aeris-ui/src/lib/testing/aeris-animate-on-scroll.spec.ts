import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisAnimateOnScrollDirective,
  AerisAnimateOnScrollModule,
} from '../../../animate-on-scroll/aeris-animate-on-scroll';

interface ObserverRecord {
  readonly callback: IntersectionObserverCallback;
  readonly options?: IntersectionObserverInit;
  readonly observed: Element[];
  disconnected: boolean;
}

const observers: ObserverRecord[] = [];

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [0];
  private readonly record: ObserverRecord;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.record = { callback, options, observed: [], disconnected: false };
    observers.push(this.record);
  }

  observe(target: Element): void {
    this.record.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {
    this.record.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

@Component({
  imports: [AerisAnimateOnScrollModule],
  template: `
    <article
      [aerisAnimateOnScroll]="animation()"
      [threshold]="threshold()"
      [rootMargin]="rootMargin()"
      [once]="once()"
      [duration]="duration()"
      [delay]="delay()"
      (entered)="entered.update((value) => value + 1)"
      (left)="left.update((value) => value + 1)"
    >
      Content
    </article>
  `,
})
class AnimatedHost {
  readonly animation = signal<'slide-start'>('slide-start');
  readonly threshold = signal(1.5);
  readonly rootMargin = signal('12px');
  readonly once = signal(false);
  readonly duration = signal(700);
  readonly delay = signal(80);
  readonly entered = signal(0);
  readonly left = signal(0);
}

@Component({
  imports: [AerisAnimateOnScrollModule],
  template: `<div aerisAnimateOnScroll disabled>Always visible</div>`,
})
class DisabledHost {}

function entry(
  target: Element,
  isIntersecting: boolean,
  intersectionRatio = isIntersecting ? 1 : 0,
): IntersectionObserverEntry {
  return { target, isIntersecting, intersectionRatio } as IntersectionObserverEntry;
}

describe('AerisAnimateOnScroll', () => {
  beforeEach(() => {
    observers.length = 0;
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverMock,
    });
  });

  it('observes the host with normalized options and prefixed state hooks', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('article') as HTMLElement;

    expect(element.classList.contains('aeris-animate-on-scroll')).toBe(true);
    expect(element.dataset['aerisEffect']).toBe('slide-start');
    expect(element.dataset['aerisState']).toBe('hidden');
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('tabindex')).toBeNull();
    expect(element.style.getPropertyValue('--aeris-animate-on-scroll-duration')).toBe('700ms');
    expect(element.style.getPropertyValue('--aeris-animate-on-scroll-delay')).toBe('80ms');
    expect(observers.at(-1)?.options).toEqual({ threshold: 1, rootMargin: '12px' });
    expect(observers.at(-1)?.observed).toEqual([element]);
  });

  it('emits enter and leave events when replay is enabled', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('article') as HTMLElement;
    const observer = observers.at(-1);
    expect(observer).toBeDefined();

    observer?.callback([entry(element, true)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(element.dataset['aerisState']).toBe('visible');
    expect(fixture.componentInstance.entered()).toBe(1);

    observer?.callback([entry(element, false)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(element.dataset['aerisState']).toBe('hidden');
    expect(fixture.componentInstance.left()).toBe(1);
  });

  it('resets when visibility falls below the configured threshold', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    fixture.componentInstance.threshold.set(0.6);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('article') as HTMLElement;
    const observer = observers.at(-1);

    observer?.callback([entry(element, true, 0.8)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(element.dataset['aerisState']).toBe('visible');

    observer?.callback([entry(element, true, 0.4)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(element.dataset['aerisState']).toBe('hidden');
    expect(fixture.componentInstance.left()).toBe(1);
  });

  it('disconnects after the first entrance by default', async () => {
    @Component({
      imports: [AerisAnimateOnScrollModule],
      template: `<div aerisAnimateOnScroll>Once</div>`,
    })
    class OnceHost {}

    const fixture = TestBed.createComponent(OnceHost);
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;
    const observer = observers.at(-1);
    observer?.callback([entry(element, true)], {} as IntersectionObserver);
    fixture.detectChanges();

    expect(observer?.disconnected).toBe(true);
    expect(element.dataset['aerisState']).toBe('visible');
  });

  it('reveals disabled content without creating an observer', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    expect(element.dataset['aerisState']).toBe('visible');
    expect(observers).toHaveLength(0);
  });

  it('clamps negative timing values without affecting host layout', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    fixture.componentInstance.duration.set(-100);
    fixture.componentInstance.delay.set(-20);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('article') as HTMLElement;

    expect(element.style.getPropertyValue('--aeris-animate-on-scroll-duration')).toBe('0ms');
    expect(element.style.getPropertyValue('--aeris-animate-on-scroll-delay')).toBe('0ms');
    expect(element.style.width).toBe('');
    expect(element.style.overflow).toBe('');
  });

  it('exports the directive through one module-array import', () => {
    expect(AerisAnimateOnScrollModule).toEqual([AerisAnimateOnScrollDirective]);
  });
});
