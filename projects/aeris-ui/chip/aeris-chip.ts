import { ɵAerisIcon } from '@aeris-ui/core';
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
  signal,
  viewChild,
} from '@angular/core';

export type AerisChipSize = 'sm' | 'md' | 'lg';
export type AerisChipVariant = 'soft' | 'outline';
export type AerisChipTone = 'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export type AerisChipShape = 'pill' | 'rounded';

export interface AerisChipRemoveEvent {
  readonly originalEvent: Event | null;
  readonly label: string;
}

export interface AerisChipRemovingEvent extends AerisChipRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}

let nextChipId = 0;

export interface AerisChipRemoveIconContext {
  readonly $implicit: AerisChip;
  readonly disabled: boolean;
}

@Directive({
  selector: '[aerisChipLeading]',
  host: {
    class: 'aeris-chip__leading',
    'aria-hidden': 'true',
    '[style.inline-size]': '"100%"',
    '[style.block-size]': '"100%"',
  },
})
export class AerisChipLeading {}

@Directive({ selector: 'ng-template[aerisChipRemoveIcon]' })
export class AerisChipRemoveIconTemplate {
  readonly template = inject<TemplateRef<AerisChipRemoveIconContext>>(TemplateRef);
}

@Component({
  selector: 'aeris-chip',
  imports: [ɵAerisIcon, NgTemplateOutlet],
  template: `
    @if (visible()) {
      @if (showImage()) {
        <img
          class="aeris-chip__image"
          [src]="imageSrc()"
          [alt]="resolvedImageAlt()"
          loading="lazy"
          decoding="async"
          draggable="false"
          (error)="handleImageError()"
        />
      }

      <span class="aeris-chip__leading"><ng-content select="[aerisChipLeading]" /></span>

      @if (label()) {
        <span class="aeris-chip__label">{{ label() }}</span>
      }

      <span class="aeris-chip__content"><ng-content /></span>

      @if (removable()) {
        <button
          #removeButton
          class="aeris-chip__remove"
          type="button"
          [disabled]="disabled()"
          [attr.aria-label]="resolvedRemoveLabelledBy() ? null : resolvedRemoveAriaLabel()"
          [attr.aria-labelledby]="resolvedRemoveLabelledBy()"
          (click)="remove($event)"
          (keydown)="handleRemoveKeydown($event)"
        >
          @if (resolvedRemoveLabelledBy()) {
            <span [id]="removeLabelId" hidden>Remove</span>
          }
          @if (removeIconTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template.template"
              [ngTemplateOutletContext]="removeIconContext()"
            />
          } @else {
            <span
              aerisInternalIcon="close"
              class="aeris-chip__remove-icon"
              aria-hidden="true"
            ></span>
          }
        </button>
      }
    }
  `,
  styleUrl: './aeris-chip.scss',
  host: {
    class: 'aeris-chip',
    '[attr.data-visible]': 'visible() || null',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-removable]': 'removable() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.role]': 'semanticRole()',
    '[attr.aria-label]': 'semanticRole() ? ariaLabel() || label() || null : null',
    '[attr.aria-labelledby]': 'semanticRole() ? ariaLabelledBy() || null : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-hidden]': 'visible() ? null : "true"',
  },
})
export class AerisChip {
  readonly label = input('');
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly removable = input(false, { transform: booleanAttribute });
  readonly autoHide = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<AerisChipSize>('md');
  readonly variant = input<AerisChipVariant>('soft');
  readonly tone = input<AerisChipTone>('neutral');
  readonly shape = input<AerisChipShape>('pill');
  readonly removeAriaLabel = input('');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly visible = model(true);

  readonly removed = output<AerisChipRemoveEvent>();
  readonly removing = output<AerisChipRemovingEvent>();

  protected readonly removeIconTemplate = contentChild(AerisChipRemoveIconTemplate);
  protected readonly removeLabelId = `aeris-chip-remove-${++nextChipId}`;
  private readonly removeButton = viewChild<ElementRef<HTMLButtonElement>>('removeButton');
  private removalPending = false;
  private readonly failedImageSrc = signal('');
  protected readonly showImage = computed(
    () => !!this.imageSrc() && this.failedImageSrc() !== this.imageSrc(),
  );
  protected readonly resolvedImageAlt = computed(() =>
    this.label() || this.ariaLabel() || this.ariaLabelledBy() ? '' : this.imageAlt(),
  );
  protected readonly resolvedRemoveAriaLabel = computed(() => {
    const name = this.label().trim() || this.ariaLabel().trim();
    return this.removeAriaLabel().trim() || (name ? `Remove ${name}` : 'Remove chip');
  });
  protected readonly resolvedRemoveLabelledBy = computed(() =>
    !this.removeAriaLabel().trim() &&
    !this.label().trim() &&
    !this.ariaLabel().trim() &&
    this.ariaLabelledBy().trim()
      ? `${this.removeLabelId} ${this.ariaLabelledBy().trim()}`
      : null,
  );
  protected readonly semanticRole = computed(() =>
    this.ariaLabel() || this.ariaLabelledBy() ? 'group' : null,
  );
  protected readonly removeIconContext = computed<AerisChipRemoveIconContext>(() => ({
    $implicit: this,
    disabled: this.disabled(),
  }));

  remove(originalEvent: Event | null = null): void {
    if (this.removalPending || !this.removable() || this.disabled() || !this.visible()) return;
    this.removalPending = true;
    try {
      let prevented = false;
      const event: AerisChipRemovingEvent = {
        originalEvent,
        label: this.label(),
        get defaultPrevented() {
          return prevented;
        },
        preventDefault: () => {
          prevented = true;
        },
      };
      this.removing.emit(event);
      if (event.defaultPrevented || this.disabled() || !this.removable() || !this.visible()) return;
      if (this.autoHide()) this.visible.set(false);
      this.removed.emit({ originalEvent, label: event.label });
    } finally {
      this.removalPending = false;
    }
  }

  focus(options?: FocusOptions): void {
    if (!this.removable() || this.disabled() || !this.visible()) return;
    this.removeButton()?.nativeElement.focus(options);
  }

  protected handleRemoveKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;
    event.preventDefault();
    this.remove(event);
  }

  protected handleImageError(): void {
    this.failedImageSrc.set(this.imageSrc());
  }
}

export const AerisChipModule = [AerisChip, AerisChipLeading, AerisChipRemoveIconTemplate] as const;
