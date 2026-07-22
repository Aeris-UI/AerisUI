import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type AerisStyleClassRelationship =
  | '@self'
  | '@next'
  | '@previous'
  | '@parent'
  | '@grandparent';
export type AerisStyleClassTarget = HTMLElement | AerisStyleClassRelationship | string;
export type AerisStyleClassResizeTarget = HTMLElement | 'window' | 'document' | string;
export type AerisStyleClassState = 'hidden' | 'entering' | 'shown' | 'leaving';
export type AerisStyleClassReason = 'trigger' | 'api' | 'outside' | 'escape' | 'resize';

export interface AerisStyleClassEvent {
  readonly target: HTMLElement;
  readonly reason: AerisStyleClassReason;
  readonly originalEvent: Event | null;
}

@Directive({
  selector: '[aerisStyleClass]',
  exportAs: 'aerisStyleClass',
  host: {
    '[attr.data-aeris-style-class-state]': 'state()',
    '(click)': 'handleTrigger($event)',
    '(document:pointerdown)': 'handleOutsidePointer($event)',
    '(document:keydown)': 'handleDocumentKeydown($event)',
  },
})
export class AerisStyleClassDirective {
  readonly target = input<AerisStyleClassTarget>('@next', { alias: 'aerisStyleClass' });
  readonly toggleClasses = input('', { alias: 'aerisStyleClassToggle' });
  readonly enterFromClasses = input('', { alias: 'aerisStyleClassEnterFrom' });
  readonly enterActiveClasses = input('', { alias: 'aerisStyleClassEnterActive' });
  readonly enterToClasses = input('', { alias: 'aerisStyleClassEnterTo' });
  readonly leaveFromClasses = input('', { alias: 'aerisStyleClassLeaveFrom' });
  readonly leaveActiveClasses = input('', { alias: 'aerisStyleClassLeaveActive' });
  readonly leaveToClasses = input('', { alias: 'aerisStyleClassLeaveTo' });
  readonly initiallyVisible = input(false, {
    alias: 'aerisStyleClassInitiallyVisible',
    transform: booleanAttribute,
  });
  readonly dismissOnOutside = input(false, {
    alias: 'aerisStyleClassDismissOnOutside',
    transform: booleanAttribute,
  });
  readonly dismissOnEscape = input(false, {
    alias: 'aerisStyleClassDismissOnEscape',
    transform: booleanAttribute,
  });
  readonly dismissOnResize = input(false, {
    alias: 'aerisStyleClassDismissOnResize',
    transform: booleanAttribute,
  });
  readonly resizeTarget = input<AerisStyleClassResizeTarget>('window', {
    alias: 'aerisStyleClassResizeTarget',
  });
  readonly disabled = input(false, {
    alias: 'aerisStyleClassDisabled',
    transform: booleanAttribute,
  });

  readonly shown = output<AerisStyleClassEvent>();
  readonly hidden = output<AerisStyleClassEvent>();

  private readonly internalState = signal<AerisStyleClassState>('hidden');
  readonly state = this.internalState.asReadonly();
  readonly visible = computed(() => {
    const state = this.internalState();
    return state === 'entering' || state === 'shown';
  });

  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private currentTarget: HTMLElement | null = null;
  private transitionId = 0;
  private pendingCancelers: Array<() => void> = [];

  constructor() {
    afterNextRender(() => this.prepareTarget());
    effect((onCleanup) => {
      const enabled = this.dismissOnResize() && this.visible() && !this.disabled();
      const resizeTarget = this.resizeTarget();
      if (!this.browser || !enabled) return;
      onCleanup(this.listenForResize(resizeTarget));
    });
    this.destroyRef.onDestroy(() => this.cancelTransition());
  }

  toggle(): boolean {
    return this.toggleWithContext(null, 'api');
  }

  show(): boolean {
    return this.showWithContext(null, 'api');
  }

  hide(): boolean {
    return this.hideWithContext(null, 'api');
  }

  protected handleTrigger(event: MouseEvent): void {
    this.toggleWithContext(event, 'trigger');
  }

  protected handleOutsidePointer(event: PointerEvent): void {
    if (!this.dismissOnOutside() || !this.visible() || this.disabled()) return;
    const target = event.target as Node | null;
    const controlled = this.resolveTarget();
    if (!target || this.host.contains(target) || controlled?.contains(target)) return;
    this.hideWithContext(event, 'outside');
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      !this.dismissOnEscape() ||
      !this.visible() ||
      this.disabled()
    ) {
      return;
    }
    if (this.hideWithContext(event, 'escape')) event.preventDefault();
  }

  private toggleWithContext(event: Event | null, reason: AerisStyleClassReason): boolean {
    return this.visible()
      ? this.hideWithContext(event, reason)
      : this.showWithContext(event, reason);
  }

  private showWithContext(event: Event | null, reason: AerisStyleClassReason): boolean {
    if (!this.browser || this.disabled() || this.visible()) return false;
    const target = this.prepareTarget();
    if (!target) return false;

    const toggleClasses = this.tokens(this.toggleClasses());
    if (toggleClasses.length > 0) {
      this.cancelTransition();
      for (const className of toggleClasses) this.renderer.addClass(target, className);
      this.complete(target, 'shown', event, reason);
      return true;
    }

    this.runTransition(target, 'enter', event, reason);
    return true;
  }

  private hideWithContext(event: Event | null, reason: AerisStyleClassReason): boolean {
    if (!this.browser || this.disabled() || !this.visible()) return false;
    const target = this.prepareTarget();
    if (!target) return false;

    const toggleClasses = this.tokens(this.toggleClasses());
    if (toggleClasses.length > 0) {
      this.cancelTransition();
      for (const className of toggleClasses) this.renderer.removeClass(target, className);
      this.complete(target, 'hidden', event, reason);
      return true;
    }

    this.runTransition(target, 'leave', event, reason);
    return true;
  }

  private prepareTarget(): HTMLElement | null {
    if (!this.browser) return null;
    const target = this.resolveTarget();
    if (!target || target === this.currentTarget) return target;

    this.cancelTransition();
    this.currentTarget = target;
    const toggleClasses = this.tokens(this.toggleClasses());
    if (toggleClasses.length > 0) {
      const active = toggleClasses.every((className) => target.classList.contains(className));
      this.internalState.set(active ? 'shown' : 'hidden');
      return target;
    }

    this.clearTransitionClasses(target);
    target.hidden = !this.initiallyVisible();
    this.internalState.set(this.initiallyVisible() ? 'shown' : 'hidden');
    return target;
  }

  private resolveTarget(): HTMLElement | null {
    const value = this.target();
    if (typeof value !== 'string') return value;

    const selector = value.trim();
    if (!selector) return null;
    if (selector === '@self') return this.host;
    if (selector === '@next') return this.host.nextElementSibling as HTMLElement | null;
    if (selector === '@previous') return this.host.previousElementSibling as HTMLElement | null;
    if (selector === '@parent') return this.host.parentElement;
    if (selector === '@grandparent') return this.host.parentElement?.parentElement ?? null;

    try {
      return this.document.querySelector<HTMLElement>(selector);
    } catch {
      return null;
    }
  }

  private runTransition(
    target: HTMLElement,
    direction: 'enter' | 'leave',
    event: Event | null,
    reason: AerisStyleClassReason,
  ): void {
    this.cancelTransition();
    const id = ++this.transitionId;
    const entering = direction === 'enter';
    const from = this.tokens(entering ? this.enterFromClasses() : this.leaveFromClasses());
    const active = this.tokens(entering ? this.enterActiveClasses() : this.leaveActiveClasses());
    const to = this.tokens(entering ? this.enterToClasses() : this.leaveToClasses());

    this.clearTransitionClasses(target);
    for (const className of [...from, ...active]) this.renderer.addClass(target, className);
    target.hidden = false;
    this.internalState.set(entering ? 'entering' : 'leaving');

    if (this.prefersReducedMotion(target)) {
      this.completeTransition(id, target, entering, event, reason);
      return;
    }

    target.getBoundingClientRect();
    this.scheduleFrame(target, () => {
      if (id !== this.transitionId) return;
      for (const className of from) this.renderer.removeClass(target, className);
      for (const className of to) this.renderer.addClass(target, className);

      const duration = this.motionDuration(target);
      if (duration <= 0) {
        queueMicrotask(() => this.completeTransition(id, target, entering, event, reason));
        return;
      }
      const view = target.ownerDocument.defaultView;
      if (!view) {
        this.completeTransition(id, target, entering, event, reason);
        return;
      }
      const timer = view.setTimeout(
        () => this.completeTransition(id, target, entering, event, reason),
        duration,
      );
      this.pendingCancelers.push(() => view.clearTimeout(timer));
    });
  }

  private completeTransition(
    id: number,
    target: HTMLElement,
    entering: boolean,
    event: Event | null,
    reason: AerisStyleClassReason,
  ): void {
    if (id !== this.transitionId) return;
    this.cancelPending();
    this.clearTransitionClasses(target);
    target.hidden = !entering;
    this.complete(target, entering ? 'shown' : 'hidden', event, reason);
  }

  private complete(
    target: HTMLElement,
    state: 'shown' | 'hidden',
    originalEvent: Event | null,
    reason: AerisStyleClassReason,
  ): void {
    this.internalState.set(state);
    const event = { target, reason, originalEvent } satisfies AerisStyleClassEvent;
    if (state === 'shown') this.shown.emit(event);
    else this.hidden.emit(event);
  }

  private scheduleFrame(target: HTMLElement, callback: () => void): void {
    const view = target.ownerDocument.defaultView;
    if (!view) {
      callback();
      return;
    }
    if (typeof view.requestAnimationFrame === 'function') {
      const frame = view.requestAnimationFrame(callback);
      this.pendingCancelers.push(() => view.cancelAnimationFrame(frame));
      return;
    }
    const timer = view.setTimeout(callback, 16);
    this.pendingCancelers.push(() => view.clearTimeout(timer));
  }

  private listenForResize(value: AerisStyleClassResizeTarget): () => void {
    if (value === 'window' || value === 'document') {
      return this.renderer.listen('window', 'resize', (event: Event) =>
        this.hideWithContext(event, 'resize'),
      );
    }

    const observed = this.resolveResizeTarget(value);
    const view = this.document.defaultView;
    const Observer = view?.ResizeObserver;
    if (!observed || !Observer) {
      return this.renderer.listen('window', 'resize', (event: Event) =>
        this.hideWithContext(event, 'resize'),
      );
    }

    let previousSize: { readonly width: number; readonly height: number } | null = null;
    const observer = new Observer((entries) => {
      const entry = entries.find((candidate) => candidate.target === observed);
      if (!entry) return;
      const size = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (
        previousSize &&
        (size.width !== previousSize.width || size.height !== previousSize.height)
      ) {
        this.hideWithContext(null, 'resize');
      }
      previousSize = size;
    });
    observer.observe(observed);
    return () => observer.disconnect();
  }

  private resolveResizeTarget(value: HTMLElement | string): HTMLElement | null {
    if (typeof value !== 'string') return value;
    try {
      return this.document.querySelector<HTMLElement>(value);
    } catch {
      return null;
    }
  }

  private prefersReducedMotion(target: HTMLElement): boolean {
    return (
      target.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
      false
    );
  }

  private motionDuration(target: HTMLElement): number {
    const style = target.ownerDocument.defaultView?.getComputedStyle(target);
    if (!style) return 0;
    return Math.max(
      this.maxTime(style.transitionDuration, style.transitionDelay),
      this.maxTime(style.animationDuration, style.animationDelay),
    );
  }

  private maxTime(durations: string, delays: string): number {
    const durationValues = this.parseTimes(durations);
    const delayValues = this.parseTimes(delays);
    return durationValues.reduce(
      (maximum, duration, index) =>
        Math.max(maximum, duration + (delayValues[index % Math.max(1, delayValues.length)] ?? 0)),
      0,
    );
  }

  private parseTimes(value: string): readonly number[] {
    return value.split(',').map((part) => {
      const time = part.trim();
      const number = Number.parseFloat(time);
      if (!Number.isFinite(number)) return 0;
      return time.endsWith('ms') ? number : number * 1000;
    });
  }

  private clearTransitionClasses(target: HTMLElement): void {
    const classes = [
      this.enterFromClasses(),
      this.enterActiveClasses(),
      this.enterToClasses(),
      this.leaveFromClasses(),
      this.leaveActiveClasses(),
      this.leaveToClasses(),
    ];
    for (const className of classes.flatMap((value) => this.tokens(value))) {
      this.renderer.removeClass(target, className);
    }
  }

  private cancelTransition(): void {
    this.transitionId += 1;
    this.cancelPending();
    if (this.currentTarget) this.clearTransitionClasses(this.currentTarget);
  }

  private cancelPending(): void {
    for (const cancel of this.pendingCancelers.splice(0)) cancel();
  }

  private tokens(value: string): readonly string[] {
    return value.split(/\s+/u).filter(Boolean);
  }
}

export const AerisStyleClassModule = [AerisStyleClassDirective] as const;
