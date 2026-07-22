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
  model,
  numberAttribute,
  output,
} from '@angular/core';

export type AerisMessageSeverity =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'secondary'
  | 'contrast';

export type AerisMessageVariant = 'filled' | 'outlined' | 'simple';
export type AerisMessageSize = 'sm' | 'md' | 'lg';
export type AerisMessageCloseReason = 'api' | 'close-button' | 'timeout';
export type AerisMessageLive = 'polite' | 'assertive' | 'off';
export type AerisMessageRole = 'status' | 'alert' | 'note';

export interface AerisMessageCloseEvent {
  readonly originalEvent: Event | null;
  readonly reason: AerisMessageCloseReason;
}

export interface AerisMessageTemplateContext {
  readonly $implicit: AerisMessage;
  readonly message: AerisMessage;
  readonly close: (event?: Event) => void;
  readonly severity: AerisMessageSeverity;
}

@Directive({ selector: 'ng-template[aerisMessageIcon]' })
export class AerisMessageIconTemplate {
  readonly template = inject<TemplateRef<AerisMessageTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMessageContent]' })
export class AerisMessageContentTemplate {
  readonly template = inject<TemplateRef<AerisMessageTemplateContext>>(TemplateRef);
}

let nextMessageId = 0;

@Component({
  selector: 'aeris-message',
  imports: [NgTemplateOutlet],
  template: `
    @if (visible()) {
      @if (showIcon()) {
        <span class="aeris-message__icon" aria-hidden="true">
          @if (iconTemplate(); as iconTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="iconTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            <span class="aeris-message__default-icon"></span>
          }
        </span>
      }

      <span class="aeris-message__content">
        @if (contentTemplate(); as contentTemplateRef) {
          <ng-container
            [ngTemplateOutlet]="contentTemplateRef.template"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else if (text()) {
          {{ text() }}
        } @else {
          <ng-content />
        }
      </span>

      @if (closable()) {
        <button
          type="button"
          class="aeris-message__close"
          [attr.aria-label]="closeAriaLabel()"
          (click)="close($event, 'close-button')"
        >
          <span aria-hidden="true"></span>
        </button>
      }
    }
  `,
  styleUrl: './aeris-message.scss',
  host: {
    class: 'aeris-message',
    '[attr.id]': 'id()',
    '[attr.role]': 'visible() ? resolvedRole() : null',
    '[attr.aria-live]': 'visible() ? resolvedLive() : null',
    '[attr.aria-atomic]': 'visible() ? "true" : null',
    '[attr.aria-label]': 'visible() && ariaLabel() ? ariaLabel() : null',
    '[attr.aria-labelledby]': 'visible() && ariaLabelledBy() ? ariaLabelledBy() : null',
    '[attr.data-visible]': 'visible() || null',
    '[attr.data-severity]': 'severity()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-closable]': 'closable() || null',
    '[attr.data-icon]': 'showIcon() || null',
  },
})
export class AerisMessage {
  private readonly generatedId = `aeris-message-${++nextMessageId}`;
  protected readonly iconTemplate = contentChild(AerisMessageIconTemplate);
  protected readonly contentTemplate = contentChild(AerisMessageContentTemplate);
  private lifeTimer: ReturnType<typeof setTimeout> | undefined;

  readonly visible = model(true);

  readonly id = input(this.generatedId);
  readonly severity = input<AerisMessageSeverity>('info');
  readonly variant = input<AerisMessageVariant>('filled');
  readonly size = input<AerisMessageSize>('md');
  readonly text = input('');
  readonly closable = input(false, { transform: booleanAttribute });
  readonly life = input(0, { transform: numberAttribute });
  readonly showIcon = input(true, { transform: booleanAttribute });
  readonly role = input<AerisMessageRole | ''>('');
  readonly ariaLive = input<AerisMessageLive | ''>('');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly closeAriaLabel = input('Close message');

  readonly closed = output<AerisMessageCloseEvent>();
  readonly visibilityChanged = output<boolean>();

  protected readonly resolvedRole = computed<AerisMessageRole>(() => {
    const role = this.role();
    if (role) return role;
    return this.severity() === 'error' || this.severity() === 'warning' ? 'alert' : 'status';
  });

  protected readonly resolvedLive = computed<AerisMessageLive>(() => {
    const live = this.ariaLive();
    if (live) return live;
    return this.resolvedRole() === 'alert' ? 'assertive' : 'polite';
  });

  protected readonly templateContext = computed<AerisMessageTemplateContext>(() => ({
    $implicit: this,
    message: this,
    close: (event?: Event) => this.close(event ?? null, 'api'),
    severity: this.severity(),
  }));

  constructor() {
    effect((onCleanup) => {
      if (!this.visible()) {
        this.clearLifeTimer();
        return;
      }

      const life = this.life();
      if (Number.isFinite(life) && life > 0) {
        this.lifeTimer = globalThis.setTimeout(() => this.close(null, 'timeout'), life);
      }

      onCleanup(() => this.clearLifeTimer());
    });
  }

  close(originalEvent: Event | null = null, reason: AerisMessageCloseReason = 'api'): void {
    if (!this.visible()) return;

    this.clearLifeTimer();
    this.visible.set(false);
    this.visibilityChanged.emit(false);
    this.closed.emit({ originalEvent, reason });
  }

  show(): void {
    if (this.visible()) return;
    this.visible.set(true);
    this.visibilityChanged.emit(true);
  }

  hide(): void {
    this.close(null, 'api');
  }

  private clearLifeTimer(): void {
    if (!this.lifeTimer) return;
    globalThis.clearTimeout(this.lifeTimer);
    this.lifeTimer = undefined;
  }
}

export const AerisMessageModule = [
  AerisMessage,
  AerisMessageIconTemplate,
  AerisMessageContentTemplate,
] as const;
