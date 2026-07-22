import {
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  contentChild,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisRatingSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AerisRatingChangeEvent {
  readonly originalEvent: PointerEvent | KeyboardEvent;
  readonly value: number;
}

let ratingId = 0;

@Component({
  selector: 'aeris-rating',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-rating"
      [attr.data-size]="size()"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-focused]="focusedState() || null"
      [style.--aeris-rating-progress]="visualFillWidth()"
      [style.--aeris-rating-max]="maxStars()"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="normalizedValue()" />
      }

      <button
        #ratingControl
        class="aeris-rating__control"
        type="button"
        role="slider"
        [id]="resolvedInputId()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby() || null"
        [attr.aria-describedby]="ariaDescribedby() || null"
        [attr.aria-valuemin]="allowClear() ? 0 : effectiveStep()"
        [attr.aria-valuemax]="maxStars()"
        [attr.aria-valuenow]="normalizedValue()"
        [attr.aria-valuetext]="formattedValue()"
        [attr.aria-required]="required() || null"
        [disabled]="effectiveDisabled()"
        (pointerdown)="handlePointer($event)"
        (pointermove)="handlePointerPreview($event)"
        (pointerleave)="clearPreview()"
        (keydown)="handleKeydown($event)"
        (focus)="handleFocus($event)"
        (blur)="handleBlur($event)"
      >
        <span class="aeris-rating__stars" aria-hidden="true">
          <span class="aeris-rating__layer aeris-rating__layer--empty">
            @for (item of stars(); track item) {
              <span class="aeris-rating__star">
                @if (inactiveIconTemplate(); as inactiveIcon) {
                  <ng-container
                    [ngTemplateOutlet]="inactiveIcon"
                    [ngTemplateOutletContext]="iconContext(item, false)"
                  />
                } @else {
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path [attr.d]="starPath" />
                  </svg>
                }
              </span>
            }
          </span>
          <span class="aeris-rating__layer aeris-rating__layer--active">
            <span class="aeris-rating__layer-inner">
              @for (item of stars(); track item) {
                <span class="aeris-rating__star">
                  @if (activeIconTemplate(); as activeIcon) {
                    <ng-container
                      [ngTemplateOutlet]="activeIcon"
                      [ngTemplateOutletContext]="iconContext(item, true)"
                    />
                  } @else {
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                      <path [attr.d]="starPath" />
                    </svg>
                  }
                </span>
              }
            </span>
          </span>
        </span>
      </button>

      @if (showValue()) {
        <span class="aeris-rating__value" aria-hidden="true">
          {{ formattedValue() }}
        </span>
      }
    </div>
  `,
  styleUrl: './aeris-rating.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisRating),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class AerisRating implements ControlValueAccessor {
  protected readonly starPath =
    'M12 2.9 14.8 8.6 21.1 9.5 16.5 14 17.6 20.3 12 17.3 6.4 20.3 7.5 14 2.9 9.5 9.2 8.6 12 2.9Z';

  readonly value = model(0);
  readonly max = input(5, { transform: numberAttribute });
  readonly allowHalf = input(false, { transform: booleanAttribute });
  readonly allowClear = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly size = input<AerisRatingSize>('md');
  readonly showValue = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly inputId = input('');
  readonly ariaLabel = input('Rating');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly valueText = input<((value: number, max: number) => string) | null>(null);

  readonly valueInput = output<number>();
  readonly changed = output<AerisRatingChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly formDisabled = signal(false);
  protected readonly previewValue = signal<number | null>(null);
  protected readonly focusedState = signal(false);
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  protected readonly maxStars = computed(() =>
    Math.max(1, Math.floor(this.max())),
  );
  protected readonly effectiveStep = computed(() => (this.allowHalf() ? 0.5 : 1));
  protected readonly normalizedValue = computed(() =>
    this.normalizeValue(this.value()),
  );
  protected readonly visualValue = computed(
    () => this.previewValue() ?? this.normalizedValue(),
  );
  protected readonly visualFillWidth = computed(() =>
    this.fillWidth(this.visualValue()),
  );
  protected readonly formattedValue = computed(() =>
    this.valueText()?.(this.normalizedValue(), this.maxStars()) ??
    `${this.normalizedValue()} of ${this.maxStars()}`,
  );
  protected readonly stars = computed(() =>
    Array.from({ length: this.maxStars() }, (_, index) => index + 1),
  );

  private readonly control =
    viewChild<ElementRef<HTMLButtonElement>>('ratingControl');
  protected readonly activeIconTemplate = contentChild<TemplateRef<RatingIconContext>>(
    'activeIcon',
  );
  protected readonly inactiveIconTemplate = contentChild<TemplateRef<RatingIconContext>>(
    'inactiveIcon',
  );
  private readonly generatedId = `aeris-rating-${++ratingId}`;
  protected readonly resolvedInputId = computed(
    () => this.inputId() || this.generatedId,
  );

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value.set(this.coerceValue(value));
  }

  registerOnChange(callback: (value: number) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.control()?.nativeElement.focus(options);
  }

  reset(): void {
    this.setValue(0);
  }

  clear(): void {
    if (!this.allowClear() || this.effectiveDisabled()) return;
    this.setValue(0);
    this.focus();
  }

  protected handlePointer(event: PointerEvent): void {
    if (this.effectiveDisabled()) return;
    event.preventDefault();
    const next = this.valueFromPointer(event);
    const value = this.allowClear() && next === this.normalizedValue() ? 0 : next;
    if (this.setValue(value)) {
      this.changed.emit({ originalEvent: event, value: this.normalizedValue() });
    }
    this.focus();
  }

  protected handlePointerPreview(event: PointerEvent): void {
    if (this.effectiveDisabled()) return;
    this.previewValue.set(this.valueFromPointer(event));
  }

  protected clearPreview(): void {
    this.previewValue.set(null);
  }

  protected iconContext(item: number, active: boolean): RatingIconContext {
    return {
      $implicit: item,
      index: item - 1,
      active,
      value: this.normalizedValue(),
      max: this.maxStars(),
    };
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = this.normalizedValue() + this.effectiveStep();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = this.normalizedValue() - this.effectiveStep();
    } else if (event.key === 'Home') {
      next = this.allowClear() ? 0 : this.effectiveStep();
    } else if (event.key === 'End') {
      next = this.maxStars();
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      if (this.allowClear()) next = 0;
    }

    if (next === null) return;
    event.preventDefault();
    if (this.setValue(next)) {
      this.changed.emit({ originalEvent: event, value: this.normalizedValue() });
    }
  }

  protected handleFocus(event: FocusEvent): void {
    this.focusedState.set(true);
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.focusedState.set(false);
    this.previewValue.set(null);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  private valueFromPointer(event: PointerEvent): number {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width)),
    );
    const raw = ratio * this.maxStars();
    if (this.allowHalf()) {
      return this.normalizeValue(raw);
    }
    return this.normalizeValue(Math.ceil(raw));
  }

  private setValue(value: number): boolean {
    const next = this.normalizeValue(value);
    if (next === this.normalizedValue()) return false;
    this.value.set(next);
    this.valueInput.emit(next);
    this.onChange(next);
    return true;
  }

  private fillWidth(value: number): string {
    const normalized = Math.min(this.maxStars(), Math.max(0, value));
    if (normalized <= 0) return '0px';

    const fullStars = Math.floor(normalized);
    const partialStar = Number((normalized - fullStars).toFixed(1));
    const starUnits = partialStar > 0 ? fullStars + partialStar : fullStars;
    const gapUnits =
      partialStar > 0 ? fullStars : Math.max(0, fullStars - 1);

    return `calc(${starUnits} * var(--_star-size) + ${gapUnits} * var(--_gap))`;
  }

  private normalizeValue(value: number): number {
    const min = this.allowClear() ? 0 : this.effectiveStep();
    const max = this.maxStars();
    const clamped = Math.min(max, Math.max(min, this.coerceValue(value)));
    const step = this.effectiveStep();
    return Number((Math.round(clamped / step) * step).toFixed(1));
  }

  private coerceValue(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }
}

interface RatingIconContext {
  readonly $implicit: number;
  readonly index: number;
  readonly active: boolean;
  readonly value: number;
  readonly max: number;
}
