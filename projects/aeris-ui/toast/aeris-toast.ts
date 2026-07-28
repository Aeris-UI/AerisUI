import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  Service,
  signal,
  viewChildren,
} from '@angular/core';
import { aerisInternalCreateFrameScheduler } from '@aeris-ui/core';

export type AerisToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

export type AerisToastSeverity =
  'info' | 'success' | 'warning' | 'error' | 'neutral' | 'secondary' | 'contrast';

export type AerisToastMode = 'stacked' | 'expanded';
export type AerisToastSwipeDirection = 'up' | 'down' | 'left' | 'right';
export type AerisToastCloseReason = 'timeout' | 'close-button' | 'swipe' | 'api' | 'clear';
export type AerisToastLive = 'polite' | 'assertive';
export type AerisToastRole = 'status' | 'alert';

export interface AerisToastMessageInput<TData = unknown> {
  readonly id?: string;
  readonly group?: string;
  readonly severity?: AerisToastSeverity;
  readonly summary?: string;
  readonly detail?: string;
  readonly life?: number;
  readonly sticky?: boolean;
  readonly closable?: boolean;
  readonly data?: TData;
  readonly ariaLabel?: string;
  readonly ariaLive?: AerisToastLive;
  readonly role?: AerisToastRole;
}

export interface AerisToastMessage<TData = unknown> {
  readonly id: string;
  readonly group: string;
  readonly severity: AerisToastSeverity;
  readonly summary: string;
  readonly detail: string;
  readonly life: number;
  readonly sticky: boolean;
  readonly closable: boolean;
  readonly data: TData | undefined;
  readonly ariaLabel: string;
  readonly ariaLive: AerisToastLive;
  readonly role: AerisToastRole;
  readonly createdAt: number;
}

export interface AerisToastCloseEvent<TData = unknown> {
  readonly message: AerisToastMessage<TData>;
  readonly reason: AerisToastCloseReason;
}

export interface AerisToastSubscription {
  unsubscribe(): void;
}

export interface AerisToastSubscribable<T> {
  subscribe(next: (event: T) => void): AerisToastSubscription;
}

export interface AerisToastTemplateContext<TData = unknown> {
  readonly $implicit: AerisToastMessage<TData>;
  readonly message: AerisToastMessage<TData>;
  readonly close: () => void;
}

interface AerisToastStackItem {
  readonly message: AerisToastMessage;
  readonly stackIndex: number;
  readonly stackIndexValue: string;
  readonly stackSizeValue: string;
  readonly heightValue: string;
  readonly frontHeightValue: string;
  readonly heightOffsetValue: string;
  readonly primary: boolean;
  readonly swipeXValue: string;
  readonly swipeYValue: string;
  readonly swipeDirection: AerisToastSwipeDirection | undefined;
  readonly swiping: boolean;
  readonly swipeDismissing: boolean;
}

interface AerisToastSwipeVisual {
  readonly x: number;
  readonly y: number;
  readonly direction: AerisToastSwipeDirection | undefined;
  readonly phase: 'dragging' | 'dismissing';
}

interface AerisToastSwipeSession {
  readonly message: AerisToastMessage;
  readonly pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  baselineX: number;
  baselineY: number;
  deltaX: number;
  deltaY: number;
  visualX: number;
  visualY: number;
  firstMove: boolean;
  realSwipe: boolean;
  lockedAxis: 'horizontal' | 'vertical' | null;
  intendedDirection: AerisToastSwipeDirection | undefined;
  maxDisplacement: number;
  cancelled: boolean;
}

interface AerisToastTimer {
  readonly message: AerisToastMessage;
  handle: ReturnType<typeof setTimeout> | null;
  startedAt: number;
  remaining: number;
  paused: boolean;
}

class AerisToastEventStream<T> implements AerisToastSubscribable<T> {
  private readonly listeners = new Set<(event: T) => void>();

  subscribe(next: (event: T) => void): AerisToastSubscription {
    this.listeners.add(next);
    return {
      unsubscribe: () => {
        this.listeners.delete(next);
      },
    };
  }

  next(event: T): void {
    for (const listener of [...this.listeners]) listener(event);
  }
}

@Directive({ selector: 'ng-template[aerisToastContent]' })
export class AerisToastContentTemplate {
  readonly template = inject<TemplateRef<AerisToastTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisToastIcon]' })
export class AerisToastIconTemplate {
  readonly template = inject<TemplateRef<AerisToastTemplateContext>>(TemplateRef);
}

let nextToastId = 0;

@Service()
export class AerisToastService {
  private readonly store = signal<readonly AerisToastMessage[]>([]);
  private readonly timers = new Map<string, AerisToastTimer>();
  private readonly closedStream = new AerisToastEventStream<AerisToastCloseEvent>();

  readonly messages = this.store.asReadonly();
  readonly closed: AerisToastSubscribable<AerisToastCloseEvent> = this.closedStream;

  show<TData = unknown>(message: AerisToastMessageInput<TData>): AerisToastMessage<TData> {
    const resolved = this.resolveMessage(message);
    this.store.update((messages) => [
      ...messages.filter((item) => item.id !== resolved.id),
      resolved,
    ]);
    this.clearTimer(resolved.id);
    this.schedule(resolved);
    return resolved;
  }

  showAll<TData = unknown>(
    messages: readonly AerisToastMessageInput<TData>[],
  ): readonly AerisToastMessage<TData>[] {
    const resolved = messages.map((message) => this.resolveMessage(message));
    const resolvedIds = new Set(resolved.map((message) => message.id));

    this.store.update((current) => [
      ...current.filter((message) => !resolvedIds.has(message.id)),
      ...resolved,
    ]);

    for (const message of resolved) {
      this.clearTimer(message.id);
      this.schedule(message);
    }

    return resolved;
  }

  remove(id: string, reason: AerisToastCloseReason = 'api'): void {
    const message = this.store().find((item) => item.id === id);
    if (!message) return;

    this.store.update((messages) => messages.filter((item) => item.id !== id));
    this.clearTimer(id);
    this.closedStream.next({ message, reason });
  }

  clear(group = ''): void {
    const targets = this.store().filter((message) => message.group === group);
    this.removeMany(targets, 'clear');
  }

  clearAll(): void {
    this.removeMany(this.store(), 'clear');
  }

  pause(id: string): void {
    const timer = this.timers.get(id);
    if (!timer || timer.paused || !timer.handle) return;

    globalThis.clearTimeout(timer.handle);
    timer.handle = null;
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
    timer.paused = true;
  }

  resume(id: string): void {
    const timer = this.timers.get(id);
    if (!timer || !timer.paused) return;

    timer.paused = false;
    timer.startedAt = Date.now();
    timer.handle = globalThis.setTimeout(() => this.remove(id, 'timeout'), timer.remaining);
  }

  private schedule(message: AerisToastMessage): void {
    if (message.sticky || message.life <= 0) return;

    this.timers.set(message.id, {
      message,
      handle: globalThis.setTimeout(() => this.remove(message.id, 'timeout'), message.life),
      startedAt: Date.now(),
      remaining: message.life,
      paused: false,
    });
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer?.handle) globalThis.clearTimeout(timer.handle);
    this.timers.delete(id);
  }

  private removeMany(targets: readonly AerisToastMessage[], reason: AerisToastCloseReason): void {
    if (targets.length === 0) return;
    const targetIds = new Set(targets.map((message) => message.id));
    this.store.update((messages) => messages.filter((message) => !targetIds.has(message.id)));

    for (const message of targets) {
      this.clearTimer(message.id);
      this.closedStream.next({ message, reason });
    }
  }

  private resolveMessage<TData>(input: AerisToastMessageInput<TData>): AerisToastMessage<TData> {
    const severity = input.severity ?? 'info';
    const role =
      input.role ?? (severity === 'error' || severity === 'warning' ? 'alert' : 'status');
    return {
      id: input.id ?? `aeris-toast-${++nextToastId}`,
      group: input.group ?? '',
      severity,
      summary: input.summary ?? '',
      detail: input.detail ?? '',
      life: input.life ?? 5000,
      sticky: input.sticky ?? false,
      closable: input.closable ?? true,
      data: input.data,
      ariaLabel: input.ariaLabel ?? '',
      ariaLive: input.ariaLive ?? (role === 'alert' ? 'assertive' : 'polite'),
      role,
      createdAt: Date.now(),
    };
  }
}

@Component({
  selector: 'aeris-toast',
  imports: [NgTemplateOutlet],
  template: `
    <section
      class="aeris-toast__region"
      [attr.aria-label]="hasVisibleMessages() ? ariaLabel() : null"
      [attr.data-empty]="!hasVisibleMessages() || null"
      [attr.data-position]="position()"
      [attr.data-mode]="mode()"
      [attr.data-newest-on-top]="newestOnTop() || null"
      [attr.data-overflow]="hiddenCount() > 0 || null"
      [style.--aeris-toast-stack-size]="visibleStackSize()"
      (pointerenter)="pauseVisible()"
      (pointerleave)="resumeVisible()"
      (focusin)="pauseVisible()"
      (focusout)="resumeVisible()"
    >
      @for (item of visibleStack(); track item.message.id) {
        <div
          class="aeris-toast__item"
          [attr.data-stack-index]="item.stackIndex"
          [attr.data-primary]="item.primary || null"
          [attr.data-swiping]="item.swiping || null"
          [attr.data-swipe-direction]="item.swipeDirection || null"
          [attr.data-swipe-dismissing]="item.swipeDismissing || null"
          [style.--aeris-toast-stack-index]="item.stackIndexValue"
          [style.--aeris-toast-stack-size]="item.stackSizeValue"
          [style.--aeris-toast-height]="item.heightValue"
          [style.--aeris-toast-front-height]="item.frontHeightValue"
          [style.--aeris-toast-height-offset]="item.heightOffsetValue"
          [style.--aeris-toast-swipe-x]="item.swipeXValue"
          [style.--aeris-toast-swipe-y]="item.swipeYValue"
          animate.leave="aeris-toast__item--leaving"
          (pointerdown)="handlePointerDown($event, item.message)"
          (pointermove)="handlePointerMove($event)"
          (pointerup)="handlePointerEnd($event)"
          (pointercancel)="handlePointerEnd($event)"
        >
          <article
            class="aeris-toast__message"
            [attr.data-severity]="item.message.severity"
            [attr.data-stack-index]="item.stackIndex"
            [attr.data-primary]="item.primary || null"
            [attr.role]="item.message.role"
            [attr.aria-live]="item.message.ariaLive"
            aria-atomic="true"
            [attr.aria-label]="item.message.ariaLabel || null"
          >
            <div
              #toastMessage
              class="aeris-toast__body"
              [attr.data-behind]="!item.primary || null"
              [attr.data-toast-id]="item.message.id"
            >
              <div class="aeris-toast__icon" aria-hidden="true">
                @if (iconTemplate(); as icon) {
                  <ng-container
                    [ngTemplateOutlet]="icon.template"
                    [ngTemplateOutletContext]="templateContexts()[item.message.id]"
                  />
                } @else {
                  <span class="aeris-toast__default-icon"></span>
                }
              </div>

              <div class="aeris-toast__content">
                @if (contentTemplate(); as content) {
                  <ng-container
                    [ngTemplateOutlet]="content.template"
                    [ngTemplateOutletContext]="templateContexts()[item.message.id]"
                  />
                } @else {
                  @if (item.message.summary) {
                    <p class="aeris-toast__summary">{{ item.message.summary }}</p>
                  }
                  @if (item.message.detail) {
                    <p class="aeris-toast__detail">{{ item.message.detail }}</p>
                  }
                }
              </div>

              @if (item.message.closable && showClose()) {
                <button
                  type="button"
                  class="aeris-toast__close"
                  [attr.aria-label]="closeAriaLabel()"
                  (click)="close(item.message)"
                >
                  <span aria-hidden="true"></span>
                </button>
              }
            </div>
          </article>
        </div>
      }

      @if (hiddenCount() > 0) {
        <span
          class="aeris-toast__overflow"
          aria-hidden="true"
          animate.enter="aeris-toast__overflow--entering"
          animate.leave="aeris-toast__overflow--leaving"
        >
          +{{ hiddenCount() }}
        </span>
      }
    </section>
  `,
  styleUrl: './aeris-toast.scss',
  host: {
    class: 'aeris-toast',
    '[attr.data-position]': 'position()',
  },
})
export class AerisToast {
  private static readonly fallbackHeight = 72;
  private static readonly swipeRemovalDelay = 550;
  private static readonly reverseCancelThreshold = 10;
  private static readonly minimumDragThreshold = 1;
  private readonly toastService = inject(AerisToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageElements = viewChildren<ElementRef<HTMLElement>>('toastMessage');
  private readonly measuredHeights = signal<Readonly<Record<string, number>>>({});
  private readonly swipeVisuals = signal<Readonly<Record<string, AerisToastSwipeVisual>>>({});
  private readonly swipeCleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly pendingSwipeRemovals = new Map<string, () => void>();
  private readonly measureFrame = aerisInternalCreateFrameScheduler(() => this.measureMessages());
  private readonly swipeFrame = aerisInternalCreateFrameScheduler(() => this.flushSwipeVisual());
  private swipeSession: AerisToastSwipeSession | null = null;
  protected readonly contentTemplate = contentChild(AerisToastContentTemplate);
  protected readonly iconTemplate = contentChild(AerisToastIconTemplate);

  readonly position = input<AerisToastPosition>('bottom-right');
  readonly group = input('');
  readonly mode = input<AerisToastMode>('stacked');
  readonly visibleCount = input(4, { transform: numberAttribute });
  readonly limit = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly newestOnTop = input(true, { transform: booleanAttribute });
  readonly pauseOnHover = input(true, { transform: booleanAttribute });
  readonly showClose = input(true, { transform: booleanAttribute });
  readonly swipeDirection = input<AerisToastSwipeDirection | readonly AerisToastSwipeDirection[]>([
    'down',
    'right',
  ]);
  readonly swipeThreshold = input(40, { transform: numberAttribute });
  readonly ariaLabel = input('Notifications');
  readonly closeAriaLabel = input('Close notification');

  readonly closed = output<AerisToastCloseEvent>();
  private readonly stackHovered = signal(false);
  private readonly resolvedSwipeDirections = computed<readonly AerisToastSwipeDirection[]>(() => {
    const value = this.swipeDirection();
    const directions = Array.isArray(value) ? value : [value];
    return [...new Set(directions)].filter(
      (direction): direction is AerisToastSwipeDirection =>
        direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right',
    );
  });
  private readonly resolvedSwipeThreshold = computed(() => {
    const threshold = this.swipeThreshold();
    return Number.isFinite(threshold) && threshold >= 0 ? threshold : 40;
  });

  protected readonly orderedMessages = computed(() => {
    const group = this.group();
    const filtered = this.toastService.messages().filter((message) => message.group === group);
    return this.newestOnTop() ? [...filtered].reverse() : filtered;
  });

  protected readonly effectiveVisibleCount = computed(() => {
    const limit = this.limit();
    const visibleCount = this.visibleCount();
    const count =
      typeof limit === 'number' && Number.isFinite(limit)
        ? limit
        : typeof visibleCount === 'number' && Number.isFinite(visibleCount)
          ? visibleCount
          : 4;
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 4;
  });

  protected readonly visibleMessages = computed(() =>
    this.orderedMessages().slice(0, this.effectiveVisibleCount()),
  );

  protected readonly hiddenCount = computed(() =>
    Math.max(0, this.orderedMessages().length - this.visibleMessages().length),
  );

  protected readonly visibleStackSize = computed(() => `${this.visibleMessages().length}`);
  protected readonly hasVisibleMessages = computed(() => this.visibleMessages().length > 0);

  protected readonly visibleStack = computed<readonly AerisToastStackItem[]>(() => {
    const messages = this.visibleMessages();
    const heights = this.measuredHeights();
    const swipeVisuals = this.swipeVisuals();
    const frontHeight = messages[0]
      ? (heights[messages[0].id] ?? AerisToast.fallbackHeight)
      : AerisToast.fallbackHeight;
    let heightOffset = 0;

    return messages.map((message, stackIndex) => {
      const height = heights[message.id] ?? AerisToast.fallbackHeight;
      const swipe = swipeVisuals[message.id];
      const item = {
        message,
        stackIndex,
        stackIndexValue: `${stackIndex}`,
        stackSizeValue: `${messages.length}`,
        heightValue: `${height}px`,
        frontHeightValue: `${frontHeight}px`,
        heightOffsetValue: `${heightOffset}px`,
        primary: stackIndex === 0,
        swipeXValue: `${swipe?.x ?? 0}px`,
        swipeYValue: `${swipe?.y ?? 0}px`,
        swipeDirection: swipe?.direction,
        swiping: swipe?.phase === 'dragging',
        swipeDismissing: swipe?.phase === 'dismissing',
      };
      heightOffset += height;
      return item;
    });
  });

  protected readonly templateContexts = computed(() => {
    const contexts: Record<string, AerisToastTemplateContext> = {};
    for (const message of this.visibleMessages()) {
      contexts[message.id] = {
        $implicit: message,
        message,
        close: () => this.close(message),
      };
    }
    return contexts;
  });

  constructor() {
    effect((onCleanup) => {
      const elements = this.messageElements().map((element) => element.nativeElement);
      this.measureFrame.schedule();

      if (typeof globalThis.ResizeObserver !== 'function') return;
      const observer = new ResizeObserver(() => this.measureFrame.schedule());
      for (const element of elements) observer.observe(element);
      onCleanup(() => {
        observer.disconnect();
        this.measureFrame.cancel();
      });
    });

    effect((onCleanup) => {
      const group = this.group();
      const subscription = this.toastService.closed.subscribe((event) => {
        if (event.message.group !== group) return;
        this.closed.emit(event);
      });
      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      const visibleIds = new Set(this.visibleMessages().map((message) => message.id));
      const gestureIds = new Set(Object.keys(this.swipeVisuals()));
      const pauseVisible = this.stackHovered() && this.pauseOnHover();

      for (const message of this.orderedMessages()) {
        if (visibleIds.has(message.id) && !pauseVisible && !gestureIds.has(message.id)) {
          this.toastService.resume(message.id);
        } else {
          this.toastService.pause(message.id);
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      this.measureFrame.cancel();
      this.swipeFrame.cancel();
      for (const cancel of this.pendingSwipeRemovals.values()) cancel();
      for (const timer of this.swipeCleanupTimers.values()) globalThis.clearTimeout(timer);
      this.pendingSwipeRemovals.clear();
      this.swipeCleanupTimers.clear();
      this.swipeSession = null;
    });
  }

  protected close(message: AerisToastMessage): void {
    this.toastService.remove(message.id, 'close-button');
  }

  protected pauseVisible(): void {
    this.stackHovered.set(true);
    if (!this.pauseOnHover()) return;
    for (const message of this.visibleMessages()) this.toastService.pause(message.id);
  }

  protected resumeVisible(): void {
    this.stackHovered.set(false);
    if (!this.pauseOnHover()) return;
    const gestureIds = new Set(Object.keys(this.swipeVisuals()));
    for (const message of this.visibleMessages()) {
      if (!gestureIds.has(message.id)) this.toastService.resume(message.id);
    }
  }

  protected handlePointerDown(event: PointerEvent, message: AerisToastMessage): void {
    if (this.resolvedSwipeDirections().length === 0 || this.swipeSession) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.target as Element | null;
    if (
      target?.closest(
        'button,a,input,textarea,select,[role="button"],[data-aeris-toast-swipe-ignore]',
      )
    ) {
      return;
    }

    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.toastService.pause(message.id);
    this.swipeSession = {
      message,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      baselineX: event.clientX,
      baselineY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      visualX: 0,
      visualY: 0,
      firstMove: true,
      realSwipe: false,
      lockedAxis: null,
      intendedDirection: undefined,
      maxDisplacement: 0,
      cancelled: false,
    };
    this.setSwipeVisual(message.id, {
      x: 0,
      y: 0,
      direction: undefined,
      phase: 'dragging',
    });
  }

  protected handlePointerMove(event: PointerEvent): void {
    const session = this.swipeSession;
    if (!session || event.pointerId !== session.pointerId) return;
    event.preventDefault();
    this.updateSwipeSession(session, event.clientX, event.clientY);
    this.swipeFrame.schedule();
  }

  protected handlePointerEnd(event: PointerEvent): void {
    const session = this.swipeSession;
    if (!session || event.pointerId !== session.pointerId) return;

    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);

    this.swipeFrame.cancel();
    if (!session.firstMove) this.updateSwipeSession(session, event.clientX, event.clientY);
    this.flushSwipeVisual();

    const dismissDirection =
      event.type === 'pointercancel' || session.cancelled
        ? undefined
        : this.resolvedSwipeDirections().find(
            (direction) =>
              this.swipeDisplacement(direction, session.deltaX, session.deltaY) >
              this.resolvedSwipeThreshold(),
          );

    this.swipeSession = null;
    if (dismissDirection) {
      this.setSwipeVisual(session.message.id, {
        x: session.visualX,
        y: session.visualY,
        direction: dismissDirection,
        phase: 'dismissing',
      });
      this.scheduleSwipeRemoval(session.message);
      return;
    }

    this.removeSwipeVisual(session.message.id);
    if (!(this.stackHovered() && this.pauseOnHover())) {
      this.toastService.resume(session.message.id);
    }
  }

  private measureMessages(): void {
    const measurements: Record<string, number> = {};

    for (const reference of this.messageElements()) {
      const element = reference.nativeElement;
      const id = element.dataset['toastId'];
      if (!id) continue;

      const contentHeight = Math.max(element.scrollHeight, element.getBoundingClientRect().height);
      if (contentHeight > 0) measurements[id] = Math.ceil(contentHeight + 2);
    }

    this.measuredHeights.update((current) => {
      const ids = Object.keys(measurements);
      const unchanged =
        ids.length === Object.keys(current).length &&
        ids.every((id) => current[id] === measurements[id]);
      return unchanged ? current : measurements;
    });
  }

  private updateSwipeSession(
    session: AerisToastSwipeSession,
    clientX: number,
    clientY: number,
  ): void {
    if (session.firstMove) {
      session.startX = clientX;
      session.startY = clientY;
      session.lastX = clientX;
      session.lastY = clientY;
      session.baselineX = clientX;
      session.baselineY = clientY;
      session.firstMove = false;
      return;
    }

    const movementX = clientX - session.lastX;
    const movementY = clientY - session.lastY;
    session.lastX = clientX;
    session.lastY = clientY;

    if (
      (movementY < 0 && clientY > session.baselineY) ||
      (movementY > 0 && clientY < session.baselineY)
    ) {
      session.baselineY = clientY;
    }
    if (
      (movementX < 0 && clientX > session.baselineX) ||
      (movementX > 0 && clientX < session.baselineX)
    ) {
      session.baselineX = clientX;
    }

    const deltaX = clientX - session.startX;
    const deltaY = clientY - session.startY;
    session.deltaX = deltaX;
    session.deltaY = deltaY;

    const directions = this.resolvedSwipeDirections();
    const hasHorizontal = directions.includes('left') || directions.includes('right');
    const hasVertical = directions.includes('up') || directions.includes('down');

    if (!session.realSwipe) {
      const distance = Math.hypot(deltaX, deltaY);
      if (distance >= AerisToast.minimumDragThreshold) {
        session.realSwipe = true;
        if (hasHorizontal && hasVertical) {
          session.lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
        }
      }
    }

    if (!session.intendedDirection) {
      const candidate = this.swipeCandidate(session.lockedAxis, deltaX, deltaY);
      if (candidate && directions.includes(candidate)) {
        session.intendedDirection = candidate;
        session.maxDisplacement = this.swipeDisplacement(candidate, deltaX, deltaY);
      }
    } else {
      const cancelDeltaX = clientX - session.baselineX;
      const cancelDeltaY = clientY - session.baselineY;
      const currentDisplacement = this.swipeDisplacement(
        session.intendedDirection,
        cancelDeltaX,
        cancelDeltaY,
      );
      const displacement = this.swipeDisplacement(session.intendedDirection, deltaX, deltaY);
      session.maxDisplacement = Math.max(session.maxDisplacement, displacement);

      if (currentDisplacement > this.resolvedSwipeThreshold()) {
        session.cancelled = false;
      } else if (
        !this.hasOppositeSwipeDirection(session.intendedDirection, directions) &&
        session.maxDisplacement - currentDisplacement >= AerisToast.reverseCancelThreshold
      ) {
        session.cancelled = true;
      }
    }

    const dampedX = this.dampedSwipeDelta(deltaX, 'left', 'right', directions);
    const dampedY = this.dampedSwipeDelta(deltaY, 'up', 'down', directions);
    session.visualX = session.lockedAxis !== 'vertical' && hasHorizontal ? dampedX : 0;
    session.visualY = session.lockedAxis !== 'horizontal' && hasVertical ? dampedY : 0;
  }

  private flushSwipeVisual(): void {
    const session = this.swipeSession;
    if (!session) return;
    this.setSwipeVisual(session.message.id, {
      x: session.visualX,
      y: session.visualY,
      direction: session.cancelled ? undefined : session.intendedDirection,
      phase: 'dragging',
    });
  }

  private setSwipeVisual(id: string, visual: AerisToastSwipeVisual): void {
    this.swipeVisuals.update((current) => ({ ...current, [id]: visual }));
  }

  private removeSwipeVisual(id: string): void {
    this.swipeVisuals.update((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  private scheduleSwipeRemoval(message: AerisToastMessage): void {
    this.pendingSwipeRemovals.get(message.id)?.();

    const remove = (): void => {
      this.pendingSwipeRemovals.delete(message.id);
      this.toastService.remove(message.id, 'swipe');
      const cleanup = globalThis.setTimeout(() => {
        this.swipeCleanupTimers.delete(message.id);
        this.removeSwipeVisual(message.id);
      }, AerisToast.swipeRemovalDelay);
      this.swipeCleanupTimers.set(message.id, cleanup);
    };

    if (typeof globalThis.requestAnimationFrame === 'function') {
      const frame = globalThis.requestAnimationFrame(remove);
      this.pendingSwipeRemovals.set(message.id, () => globalThis.cancelAnimationFrame?.(frame));
    } else {
      const timer = globalThis.setTimeout(remove, 0);
      this.pendingSwipeRemovals.set(message.id, () => globalThis.clearTimeout(timer));
    }
  }

  private swipeCandidate(
    lockedAxis: 'horizontal' | 'vertical' | null,
    deltaX: number,
    deltaY: number,
  ): AerisToastSwipeDirection | undefined {
    if (lockedAxis === 'vertical') return deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : undefined;
    if (lockedAxis === 'horizontal') {
      return deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : undefined;
    }
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : undefined;
    }
    return deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : undefined;
  }

  private swipeDisplacement(
    direction: AerisToastSwipeDirection,
    deltaX: number,
    deltaY: number,
  ): number {
    if (direction === 'right') return deltaX;
    if (direction === 'left') return -deltaX;
    if (direction === 'down') return deltaY;
    return -deltaY;
  }

  private dampedSwipeDelta(
    delta: number,
    negativeDirection: AerisToastSwipeDirection,
    positiveDirection: AerisToastSwipeDirection,
    directions: readonly AerisToastSwipeDirection[],
  ): number {
    const unsupported =
      (delta > 0 && !directions.includes(positiveDirection)) ||
      (delta < 0 && !directions.includes(negativeDirection));
    if (!unsupported) return delta;
    return Math.sign(delta) * Math.sqrt(Math.abs(delta));
  }

  private hasOppositeSwipeDirection(
    direction: AerisToastSwipeDirection,
    directions: readonly AerisToastSwipeDirection[],
  ): boolean {
    if (direction === 'left') return directions.includes('right');
    if (direction === 'right') return directions.includes('left');
    if (direction === 'up') return directions.includes('down');
    return directions.includes('up');
  }
}

export const AerisToastModule = [
  AerisToast,
  AerisToastContentTemplate,
  AerisToastIconTemplate,
] as const;
