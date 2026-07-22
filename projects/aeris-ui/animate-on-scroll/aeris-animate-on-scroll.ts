import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';

export type AerisAnimateOnScrollEffect =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide-start'
  | 'slide-end'
  | 'scale';

export interface AerisAnimateOnScrollEvent {
  readonly element: HTMLElement;
  readonly entry: IntersectionObserverEntry | null;
}

type AerisAnimateOnScrollState = 'hidden' | 'visible';

function animationAttribute(
  value: AerisAnimateOnScrollEffect | '' | null,
): AerisAnimateOnScrollEffect {
  return value || 'fade-up';
}

@Directive({
  selector: '[aerisAnimateOnScroll]',
  exportAs: 'aerisAnimateOnScroll',
  host: {
    class: 'aeris-animate-on-scroll',
    '[attr.data-aeris-effect]': 'animation() || "fade-up"',
    '[attr.data-aeris-state]': 'state()',
    '[style.--aeris-animate-on-scroll-duration]': 'durationStyle()',
    '[style.--aeris-animate-on-scroll-delay]': 'delayStyle()',
    '[style.--aeris-animate-on-scroll-easing]': 'easing()',
  },
})
export class AerisAnimateOnScrollDirective {
  readonly animation = input<AerisAnimateOnScrollEffect, AerisAnimateOnScrollEffect | '' | null>(
    'fade-up',
    {
      alias: 'aerisAnimateOnScroll',
      transform: animationAttribute,
    },
  );
  readonly threshold = input(0.2, { transform: numberAttribute });
  readonly rootMargin = input('0px 0px -10% 0px');
  readonly once = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly duration = input(480, { transform: numberAttribute });
  readonly delay = input(0, { transform: numberAttribute });
  readonly easing = input('cubic-bezier(0.22, 1, 0.36, 1)');

  readonly entered = output<AerisAnimateOnScrollEvent>();
  readonly left = output<AerisAnimateOnScrollEvent>();

  protected readonly state = signal<AerisAnimateOnScrollState>('hidden');
  protected readonly durationStyle = computed(() => `${this.clampTime(this.duration())}ms`);
  protected readonly delayStyle = computed(() => `${this.clampTime(this.delay())}ms`);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect((onCleanup) => {
      const disabled = this.disabled();
      const once = this.once();
      const threshold = this.clampThreshold(this.threshold());
      const rootMargin = this.rootMargin().trim() || '0px';

      if (!isPlatformBrowser(this.platformId) || disabled) {
        this.state.set('visible');
        return;
      }

      const Observer = this.element.ownerDocument.defaultView?.IntersectionObserver;
      if (!Observer) {
        this.state.set('visible');
        return;
      }

      this.state.set('hidden');
      let observer: IntersectionObserver;

      const handleIntersections: IntersectionObserverCallback = (entries) => {
        const entry = entries.find((candidate) => candidate.target === this.element);
        if (!entry) return;

        const isVisible = entry.isIntersecting && entry.intersectionRatio >= threshold;

        if (isVisible) {
          if (this.state() !== 'visible') {
            this.state.set('visible');
            this.entered.emit({ element: this.element, entry });
          }

          if (once) observer.disconnect();
          return;
        }

        if (!once && this.state() === 'visible') {
          this.state.set('hidden');
          this.left.emit({ element: this.element, entry });
        }
      };

      try {
        observer = new Observer(handleIntersections, { threshold, rootMargin });
      } catch {
        observer = new Observer(handleIntersections, { threshold });
      }

      observer.observe(this.element);
      onCleanup(() => observer.disconnect());
    });
  }

  private clampThreshold(value: number): number {
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.2;
  }

  private clampTime(value: number): number {
    return Number.isFinite(value) ? Math.min(60_000, Math.max(0, value)) : 0;
  }
}

export const AerisAnimateOnScrollModule = [AerisAnimateOnScrollDirective] as const;
