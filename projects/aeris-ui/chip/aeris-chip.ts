import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type AerisChipSize = 'sm' | 'md' | 'lg';
export type AerisChipVariant = 'soft' | 'outline';
export type AerisChipTone = 'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export type AerisChipShape = 'pill' | 'rounded';

export interface AerisChipRemoveEvent {
  readonly originalEvent: Event | null;
  readonly label: string;
}

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
  imports: [NgTemplateOutlet],
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
          class="aeris-chip__remove"
          type="button"
          [disabled]="disabled()"
          [attr.aria-label]="resolvedRemoveAriaLabel()"
          (click)="remove($event)"
          (keydown)="handleRemoveKeydown($event)"
        >
          @if (removeIconTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template.template"
              [ngTemplateOutletContext]="removeIconContext()"
            />
          } @else {
            <span class="aeris-chip__remove-icon" aria-hidden="true"></span>
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

  protected readonly removeIconTemplate = contentChild(AerisChipRemoveIconTemplate);
  private readonly failedImageSrc = signal('');
  protected readonly showImage = computed(
    () => !!this.imageSrc() && this.failedImageSrc() !== this.imageSrc(),
  );
  protected readonly resolvedImageAlt = computed(() =>
    this.label() || this.ariaLabel() || this.ariaLabelledBy() ? '' : this.imageAlt(),
  );
  protected readonly resolvedRemoveAriaLabel = computed(
    () => this.removeAriaLabel() || (this.label() ? `Remove ${this.label()}` : 'Remove chip'),
  );
  protected readonly semanticRole = computed(() =>
    this.ariaLabel() || this.ariaLabelledBy() ? 'group' : null,
  );
  protected readonly removeIconContext = computed<AerisChipRemoveIconContext>(() => ({
    $implicit: this,
    disabled: this.disabled(),
  }));

  remove(originalEvent: Event | null = null): void {
    if (!this.removable() || this.disabled() || !this.visible()) return;
    this.visible.set(false);
    this.removed.emit({ originalEvent, label: this.label() });
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
