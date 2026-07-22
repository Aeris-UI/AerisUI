import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

export type AerisInplaceChangeReason = 'display' | 'close' | 'escape' | 'api';
export type AerisInplaceAriaLive = 'off' | 'polite' | 'assertive';

export interface AerisInplaceStateEvent {
  readonly active: boolean;
  readonly originalEvent: Event | null;
  readonly reason: AerisInplaceChangeReason;
}

export interface AerisInplaceDisplayContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly activate: () => void;
}

export interface AerisInplaceContentContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly close: () => void;
}

@Directive({ selector: 'ng-template[aerisInplaceDisplay]' })
export class AerisInplaceDisplayTemplate {
  readonly template = inject<TemplateRef<AerisInplaceDisplayContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisInplaceContent]' })
export class AerisInplaceContentTemplate {
  readonly template = inject<TemplateRef<AerisInplaceContentContext>>(TemplateRef);
}

@Component({
  selector: 'aeris-inplace',
  imports: [NgTemplateOutlet],
  template: `
    @if (!active()) {
      <button
        #displayButton
        class="aeris-inplace__display"
        type="button"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-expanded]="false"
        [attr.aria-controls]="contentId()"
        (click)="activate($event, 'display')"
      >
        @if (displayTemplate(); as display) {
          <ng-container
            [ngTemplateOutlet]="display.template"
            [ngTemplateOutletContext]="displayContext()"
          />
        } @else {
          <span class="aeris-inplace__label">{{ label() }}</span>
        }
      </button>
    } @else {
      <div
        #contentPanel
        class="aeris-inplace__content"
        [class.aeris-inplace__content--closable]="closable()"
        [id]="contentId()"
        [attr.tabindex]="autofocusContent() ? -1 : null"
        [attr.aria-live]="ariaLive()"
        (keydown)="handleContentKeydown($event)"
      >
        <div class="aeris-inplace__body">
          @if (contentTemplate(); as content) {
            <ng-container
              [ngTemplateOutlet]="content.template"
              [ngTemplateOutletContext]="contentContext()"
            />
          } @else {
            <ng-content />
          }
        </div>

        @if (closable()) {
          <button
            class="aeris-inplace__close"
            type="button"
            [attr.aria-label]="closeAriaLabel()"
            (click)="deactivate($event, 'close')"
          >
            <span class="aeris-inplace__close-icon" aria-hidden="true"></span>
          </button>
        }
      </div>
    }
  `,
  styleUrl: './aeris-inplace.scss',
  host: {
    class: 'aeris-inplace',
    '[attr.data-active]': 'active() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-closable]': 'closable() || null',
  },
})
export class AerisInplace {
  private static nextId = 0;
  private readonly displayButton = viewChild<ElementRef<HTMLButtonElement>>('displayButton');
  private readonly contentPanel = viewChild<ElementRef<HTMLElement>>('contentPanel');
  private readonly generatedContentId = `aeris-inplace-content-${++AerisInplace.nextId}`;
  private readonly activateCallback = (): void => this.activate();
  private readonly closeCallback = (): void => this.deactivate();

  readonly active = model(false);
  readonly label = input('Show content');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly closable = input(false, { transform: booleanAttribute });
  readonly autofocusContent = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeAriaLabel = input('Close content');
  readonly contentId = input(this.generatedContentId);
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly ariaLive = input<AerisInplaceAriaLive>('polite');

  readonly activated = output<AerisInplaceStateEvent>();
  readonly deactivated = output<AerisInplaceStateEvent>();

  protected readonly displayTemplate = contentChild(AerisInplaceDisplayTemplate);
  protected readonly contentTemplate = contentChild(AerisInplaceContentTemplate);
  protected readonly displayContext = computed<AerisInplaceDisplayContext>(() => ({
    $implicit: this,
    active: this.active(),
    activate: this.activateCallback,
  }));
  protected readonly contentContext = computed<AerisInplaceContentContext>(() => ({
    $implicit: this,
    active: this.active(),
    close: this.closeCallback,
  }));

  activate(originalEvent: Event | null = null, reason: AerisInplaceChangeReason = 'api'): void {
    if (this.disabled() || this.active()) return;
    this.active.set(true);
    this.activated.emit({ active: true, originalEvent, reason });
    if (this.autofocusContent()) queueMicrotask(() => this.focusContent());
  }

  deactivate(originalEvent: Event | null = null, reason: AerisInplaceChangeReason = 'api'): void {
    if (!this.active()) return;
    this.active.set(false);
    this.deactivated.emit({ active: false, originalEvent, reason });
    queueMicrotask(() => this.focusDisplay());
  }

  toggle(originalEvent: Event | null = null): void {
    if (this.active()) this.deactivate(originalEvent);
    else this.activate(originalEvent);
  }

  focusDisplay(options?: FocusOptions): void {
    this.displayButton()?.nativeElement.focus(options);
  }

  focusContent(options?: FocusOptions): void {
    const panel = this.contentPanel()?.nativeElement;
    if (!panel) return;
    const target = panel.querySelector<HTMLElement>(
      'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    (target ?? panel).focus(options);
  }

  protected handleContentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.closeOnEscape()) return;
    event.preventDefault();
    event.stopPropagation();
    this.deactivate(event, 'escape');
  }
}

export const AerisInplaceModule = [
  AerisInplace,
  AerisInplaceDisplayTemplate,
  AerisInplaceContentTemplate,
] as const;
