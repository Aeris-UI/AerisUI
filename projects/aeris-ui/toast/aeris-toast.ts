import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
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
} from '@angular/core';

export type AerisToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

export type AerisToastSeverity =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'secondary'
  | 'contrast';

export type AerisToastMode = 'stacked' | 'expanded';
export type AerisToastCloseReason = 'timeout' | 'close-button' | 'api' | 'clear';
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
  readonly stackOpacityValue: string;
  readonly stackScaleValue: string;
  readonly stackOffsetValue: string;
  readonly stackOffsetInverseValue: string;
  readonly primary: boolean;
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
    this.store.update((messages) => [...messages.filter((item) => item.id !== resolved.id), resolved]);
    this.clearTimer(resolved.id);
    this.schedule(resolved);
    return resolved;
  }

  showAll<TData = unknown>(
    messages: readonly AerisToastMessageInput<TData>[],
  ): readonly AerisToastMessage<TData>[] {
    return messages.map((message) => this.show(message));
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
    for (const message of targets) this.remove(message.id, 'clear');
  }

  clearAll(): void {
    const targets = this.store();
    for (const message of targets) this.remove(message.id, 'clear');
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

  private resolveMessage<TData>(input: AerisToastMessageInput<TData>): AerisToastMessage<TData> {
    const severity = input.severity ?? 'info';
    const role = input.role ?? (severity === 'error' || severity === 'warning' ? 'alert' : 'status');
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
    @if (visibleStack().length > 0) {
      <section
        class="aeris-toast__region"
        [attr.aria-label]="ariaLabel()"
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
          <article
            class="aeris-toast__message"
            [attr.data-severity]="item.message.severity"
            [attr.data-stack-index]="item.stackIndex"
            [attr.data-primary]="item.primary || null"
            [attr.role]="item.message.role"
            [attr.aria-live]="item.message.ariaLive"
            aria-atomic="true"
            [attr.aria-label]="item.message.ariaLabel || null"
            [style.--aeris-toast-stack-index]="item.stackIndexValue"
            [style.--aeris-toast-stack-size]="item.stackSizeValue"
            [style.--aeris-toast-stack-opacity]="item.stackOpacityValue"
            [style.--aeris-toast-stack-scale]="item.stackScaleValue"
            [style.--aeris-toast-stack-offset]="item.stackOffsetValue"
            [style.--aeris-toast-stack-offset-inverse]="item.stackOffsetInverseValue"
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
          </article>
        }

        @if (hiddenCount() > 0) {
          <span class="aeris-toast__overflow" aria-hidden="true">+{{ hiddenCount() }}</span>
        }
      </section>
    }
  `,
  styleUrl: './aeris-toast.scss',
  host: {
    class: 'aeris-toast',
    '[attr.data-position]': 'position()',
  },
})
export class AerisToast {
  private readonly toastService = inject(AerisToastService);
  protected readonly contentTemplate = contentChild(AerisToastContentTemplate);
  protected readonly iconTemplate = contentChild(AerisToastIconTemplate);

  readonly position = input<AerisToastPosition>('top-right');
  readonly group = input('');
  readonly mode = input<AerisToastMode>('stacked');
  readonly visibleCount = input(4, { transform: numberAttribute });
  readonly limit = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly newestOnTop = input(true, { transform: booleanAttribute });
  readonly pauseOnHover = input(true, { transform: booleanAttribute });
  readonly showClose = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Notifications');
  readonly closeAriaLabel = input('Close notification');

  readonly closed = output<AerisToastCloseEvent>();
  private readonly stackHovered = signal(false);

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

  protected readonly visibleStack = computed<readonly AerisToastStackItem[]>(() => {
    const messages = this.visibleMessages();
    return messages.map((message, stackIndex) => ({
      message,
      stackIndex,
      stackIndexValue: `${stackIndex}`,
      stackSizeValue: `${messages.length}`,
      stackOpacityValue: `${Math.max(0.64, 1 - stackIndex * 0.12)}`,
      stackScaleValue: `${Math.max(0.9, 1 - stackIndex * 0.025)}`,
      stackOffsetValue: `${stackIndex * 0.08}rem`,
      stackOffsetInverseValue: `${stackIndex * -0.08}rem`,
      primary: stackIndex === 0,
    }));
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
      const group = this.group();
      const subscription = this.toastService.closed.subscribe((event) => {
        if (event.message.group !== group) return;
        this.closed.emit(event);
      });
      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      const visibleIds = new Set(this.visibleMessages().map((message) => message.id));
      const pauseVisible = this.stackHovered() && this.pauseOnHover();

      for (const message of this.orderedMessages()) {
        if (visibleIds.has(message.id) && !pauseVisible) {
          this.toastService.resume(message.id);
        } else {
          this.toastService.pause(message.id);
        }
      }
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
    for (const message of this.visibleMessages()) this.toastService.resume(message.id);
  }
}

export const AerisToastModule = [
  AerisToast,
  AerisToastContentTemplate,
  AerisToastIconTemplate,
] as const;
