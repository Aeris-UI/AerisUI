import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  alignSliderValue,
  normalizeSliderRange,
  sliderPercentage,
} from './aeris-slider.utils';

export type AerisSliderSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisSliderOrientation = 'horizontal' | 'vertical';
export type AerisSliderThumb = 'single' | 'lower' | 'upper';
export type AerisSliderValue = number | readonly [number, number];

export interface AerisSliderInputEvent {
  readonly originalEvent: PointerEvent | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}

export interface AerisSliderChangeEvent {
  readonly originalEvent: PointerEvent | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}

let sliderId = 0;

@Component({
  selector: 'aeris-slider',
  template: `
    <div
      class="aeris-slider"
      [attr.data-size]="size()"
      [attr.data-orientation]="orientation()"
      [attr.data-range]="range() || null"
      [attr.data-reversed]="reversed() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-invalid]="invalid() || null"
      [style.--aeris-slider-start]="startPercentage() + '%'"
      [style.--aeris-slider-end]="endPercentage() + '%'"
      [style.--aeris-slider-single]="singlePercentage() + '%'"
      [style.--aeris-slider-lower]="lowerPercentage() + '%'"
      [style.--aeris-slider-upper]="upperPercentage() + '%'"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="serializedValue()" />
      }

      @if (showValue()) {
        <div class="aeris-slider__values" aria-hidden="true">
          @if (range()) {
            <span>{{ formattedLowerValue() }}</span>
            <span>{{ formattedUpperValue() }}</span>
          } @else {
            <span>{{ formattedSingleValue() }}</span>
          }
        </div>
      }

      <div
        class="aeris-slider__track"
        (pointerdown)="handleTrackPointerDown($event)"
        (pointermove)="handleTrackPointerMove($event)"
        (pointerup)="handleTrackPointerUp($event)"
        (pointercancel)="handleTrackPointerUp($event)"
      >
        <span class="aeris-slider__rail" aria-hidden="true"></span>
        <span class="aeris-slider__fill" aria-hidden="true"></span>

        @if (showTicks()) {
          <span class="aeris-slider__ticks" aria-hidden="true">
            @for (tick of ticks(); track tick.value) {
              <span
                [style.--aeris-slider-tick-position]="tick.percentage + '%'"
                [attr.data-active]="tick.active || null"
              ></span>
            }
          </span>
        }

        @if (range()) {
          <button
            #thumbButton
            class="aeris-slider__thumb aeris-slider__thumb--lower"
            type="button"
            role="slider"
            [id]="lowerThumbId()"
            [attr.aria-label]="lowerAriaLabel()"
            [attr.aria-labelledby]="lowerAriaLabelledby() || null"
            [attr.aria-describedby]="ariaDescribedby() || null"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="upperValue() - effectiveMinRange()"
            [attr.aria-valuenow]="lowerValue()"
            [attr.aria-valuetext]="formattedLowerValue()"
            [attr.aria-orientation]="orientation()"
            [attr.aria-invalid]="invalid() || null"
            [attr.aria-readonly]="readonly() || null"
            [disabled]="effectiveDisabled()"
            [attr.data-active]="activeThumb() === 'lower' || null"
            (keydown)="handleThumbKeydown($event, 'lower')"
            (focus)="focused.emit($event)"
            (blur)="handleBlur($event)"
          >
            @if (showTooltip()) {
              <span class="aeris-slider__tooltip" aria-hidden="true">
                {{ formattedLowerValue() }}
              </span>
            }
          </button>
          <button
            #thumbButton
            class="aeris-slider__thumb aeris-slider__thumb--upper"
            type="button"
            role="slider"
            [id]="upperThumbId()"
            [attr.aria-label]="upperAriaLabel()"
            [attr.aria-labelledby]="upperAriaLabelledby() || null"
            [attr.aria-describedby]="ariaDescribedby() || null"
            [attr.aria-valuemin]="lowerValue() + effectiveMinRange()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="upperValue()"
            [attr.aria-valuetext]="formattedUpperValue()"
            [attr.aria-orientation]="orientation()"
            [attr.aria-invalid]="invalid() || null"
            [attr.aria-readonly]="readonly() || null"
            [disabled]="effectiveDisabled()"
            [attr.data-active]="activeThumb() === 'upper' || null"
            (keydown)="handleThumbKeydown($event, 'upper')"
            (focus)="focused.emit($event)"
            (blur)="handleBlur($event)"
          >
            @if (showTooltip()) {
              <span class="aeris-slider__tooltip" aria-hidden="true">
                {{ formattedUpperValue() }}
              </span>
            }
          </button>
        } @else {
          <button
            #thumbButton
            class="aeris-slider__thumb aeris-slider__thumb--single"
            type="button"
            role="slider"
            [id]="singleThumbId()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledby]="ariaLabelledby() || null"
            [attr.aria-describedby]="ariaDescribedby() || null"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="singleValue()"
            [attr.aria-valuetext]="formattedSingleValue()"
            [attr.aria-orientation]="orientation()"
            [attr.aria-invalid]="invalid() || null"
            [attr.aria-readonly]="readonly() || null"
            [disabled]="effectiveDisabled()"
            [attr.data-active]="activeThumb() === 'single' || null"
            (keydown)="handleThumbKeydown($event, 'single')"
            (focus)="focused.emit($event)"
            (blur)="handleBlur($event)"
          >
            @if (showTooltip()) {
              <span class="aeris-slider__tooltip" aria-hidden="true">
                {{ formattedSingleValue() }}
              </span>
            }
          </button>
        }
      </div>

      @if (showMinMax()) {
        <div class="aeris-slider__limits" aria-hidden="true">
          <span>{{ formatValue(min()) }}</span>
          <span>{{ formatValue(max()) }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-slider.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisSlider),
      multi: true,
    },
  ],
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class AerisSlider implements ControlValueAccessor {
  readonly value = model<AerisSliderValue>(0);
  readonly range = input(false, { transform: booleanAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly minRange = input(0, { transform: numberAttribute });
  readonly pageStep = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });
  readonly orientation = input<AerisSliderOrientation>('horizontal');
  readonly reversed = input(false, { transform: booleanAttribute });
  readonly size = input<AerisSliderSize>('md');
  readonly name = input('');
  readonly inputId = input('');
  readonly ariaLabel = input('Value');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly lowerAriaLabel = input('Minimum value');
  readonly upperAriaLabel = input('Maximum value');
  readonly lowerAriaLabelledby = input('');
  readonly upperAriaLabelledby = input('');
  readonly valueText = input<((value: number) => string) | null>(null);
  readonly showValue = input(false, { transform: booleanAttribute });
  readonly showTooltip = input(false, { transform: booleanAttribute });
  readonly showTicks = input(false, { transform: booleanAttribute });
  readonly maxTicks = input(101, { transform: numberAttribute });
  readonly showMinMax = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<AerisSliderValue>();
  readonly sliding = output<AerisSliderInputEvent>();
  readonly changed = output<AerisSliderChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly formDisabled = signal(false);
  protected readonly activeThumb = signal<AerisSliderThumb | null>(null);
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  protected readonly effectiveStep = computed(() =>
    this.step() > 0 ? this.step() : 1,
  );
  protected readonly effectiveMinRange = computed(() =>
    Math.min(
      this.normalizedMax() - this.normalizedMin(),
      Math.max(0, this.minRange()),
    ),
  );
  protected readonly normalizedValue = computed<AerisSliderValue>(() => {
    const min = this.normalizedMin();
    const max = this.normalizedMax();
    if (this.range()) {
      const current = this.value();
      const rangeValue: readonly [number, number] = Array.isArray(current)
        ? [Number(current[0]), Number(current[1])]
        : [min, Number(current)];
      return normalizeSliderRange(
        rangeValue,
        min,
        max,
        this.effectiveStep(),
        this.effectiveMinRange(),
      );
    }
    const current = this.value();
    return alignSliderValue(
      Array.isArray(current) ? Number(current[0]) : Number(current),
      min,
      max,
      this.effectiveStep(),
    );
  });
  protected readonly singleValue = computed(() => {
    const value = this.normalizedValue();
    return Array.isArray(value) ? value[0] : value;
  });
  protected readonly lowerValue = computed(() => {
    const value = this.normalizedValue();
    return Array.isArray(value) ? value[0] : this.normalizedMin();
  });
  protected readonly upperValue = computed(() => {
    const value = this.normalizedValue();
    return Array.isArray(value) ? value[1] : this.singleValue();
  });
  protected readonly startPercentage = computed(() => {
    const percentage = this.range()
      ? this.percentage(this.lowerValue())
      : 0;
    return this.reversed() ? 100 - this.endBasePercentage() : percentage;
  });
  protected readonly endPercentage = computed(() => {
    const percentage = this.endBasePercentage();
    return this.reversed()
      ? 100 - (this.range() ? this.percentage(this.lowerValue()) : 0)
      : percentage;
  });
  protected readonly singlePercentage = computed(() =>
    this.visualPercentage(this.singleValue()),
  );
  protected readonly lowerPercentage = computed(() =>
    this.visualPercentage(this.lowerValue()),
  );
  protected readonly upperPercentage = computed(() =>
    this.visualPercentage(this.upperValue()),
  );
  protected readonly formattedSingleValue = computed(() =>
    this.formatValue(this.singleValue()),
  );
  protected readonly formattedLowerValue = computed(() =>
    this.formatValue(this.lowerValue()),
  );
  protected readonly formattedUpperValue = computed(() =>
    this.formatValue(this.upperValue()),
  );
  protected readonly serializedValue = computed(() =>
    this.range()
      ? `${this.lowerValue()},${this.upperValue()}`
      : String(this.singleValue()),
  );
  protected readonly ticks = computed(() => {
    const count =
      Math.floor(
        (this.normalizedMax() - this.normalizedMin()) / this.effectiveStep(),
      ) + 1;
    if (!this.showTicks() || count > Math.max(2, this.maxTicks())) return [];
    return Array.from({ length: count }, (_, index) => {
      const value = alignSliderValue(
        this.normalizedMin() + index * this.effectiveStep(),
        this.normalizedMin(),
        this.normalizedMax(),
        this.effectiveStep(),
      );
      const percentage = this.visualPercentage(value);
      return {
        value,
        percentage,
        active: this.range()
          ? value >= this.lowerValue() && value <= this.upperValue()
          : value <= this.singleValue(),
      };
    });
  });

  private readonly generatedId = `aeris-slider-${++sliderId}`;
  protected readonly singleThumbId = computed(
    () => this.inputId() || this.generatedId,
  );
  protected readonly lowerThumbId = computed(
    () => `${this.inputId() || this.generatedId}-lower`,
  );
  protected readonly upperThumbId = computed(
    () => `${this.inputId() || this.generatedId}-upper`,
  );

  private readonly thumbButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('thumbButton');
  private dragThumb: AerisSliderThumb | null = null;
  private dragChanged = false;
  private onChange: (value: AerisSliderValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value.set(this.coerceValue(value));
  }

  registerOnChange(callback: (value: AerisSliderValue) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(thumb: AerisSliderThumb = this.range() ? 'lower' : 'single'): void {
    this.focusThumb(thumb);
  }

  reset(): void {
    this.setValue(this.range() ? [this.normalizedMin(), this.normalizedMax()] : this.normalizedMin());
  }

  protected formatValue(value: number): string {
    return this.valueText()?.(value) ?? String(value);
  }

  protected handleTrackPointerDown(event: PointerEvent): void {
    if (
      this.effectiveDisabled() ||
      this.readonly() ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    const track = event.currentTarget as HTMLElement;
    track.setPointerCapture(event.pointerId);
    const value = this.pointerValue(event, track);
    this.dragThumb = this.closestThumb(value);
    this.dragChanged = false;
    this.activeThumb.set(this.dragThumb);
    this.updateThumb(this.dragThumb, value, event, true);
    this.focusThumb(this.dragThumb);
  }

  protected handleTrackPointerMove(event: PointerEvent): void {
    if (!this.dragThumb) return;
    const track = event.currentTarget as HTMLElement;
    this.updateThumb(
      this.dragThumb,
      this.pointerValue(event, track),
      event,
      true,
    );
  }

  protected handleTrackPointerUp(event: PointerEvent): void {
    if (!this.dragThumb) return;
    const thumb = this.dragThumb;
    this.dragThumb = null;
    this.activeThumb.set(null);
    if (this.dragChanged) {
      this.changed.emit({
        originalEvent: event,
        value: this.normalizedValue(),
        thumb,
      });
    }
  }

  protected handleThumbKeydown(
    event: KeyboardEvent,
    thumb: AerisSliderThumb,
  ): void {
    if (this.effectiveDisabled() || this.readonly()) return;

    const direction = this.keyDirection(event.key);
    let next: number | null = null;
    const current = this.thumbValue(thumb);
    if (direction !== null) {
      next = current + direction * this.effectiveStep();
    } else if (event.key === 'PageUp') {
      next = current + this.resolvedPageStep();
    } else if (event.key === 'PageDown') {
      next = current - this.resolvedPageStep();
    } else if (event.key === 'Home') {
      next = thumb === 'upper' ? this.lowerValue() + this.effectiveMinRange() : this.normalizedMin();
    } else if (event.key === 'End') {
      next = thumb === 'lower' ? this.upperValue() - this.effectiveMinRange() : this.normalizedMax();
    }

    if (next === null) return;
    event.preventDefault();
    const changed = this.updateThumb(thumb, next, event, true);
    if (changed) {
      this.changed.emit({
        originalEvent: event,
        value: this.normalizedValue(),
        thumb,
      });
    }
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  private updateThumb(
    thumb: AerisSliderThumb,
    rawValue: number,
    event: PointerEvent | KeyboardEvent,
    emitInput: boolean,
  ): boolean {
    const aligned = alignSliderValue(
      rawValue,
      this.normalizedMin(),
      this.normalizedMax(),
      this.effectiveStep(),
    );
    let next: AerisSliderValue;

    if (!this.range() || thumb === 'single') {
      next = aligned;
    } else if (thumb === 'lower') {
      next = [
        Math.min(aligned, this.upperValue() - this.effectiveMinRange()),
        this.upperValue(),
      ];
    } else {
      next = [
        this.lowerValue(),
        Math.max(aligned, this.lowerValue() + this.effectiveMinRange()),
      ];
    }

    const changed = !sameSliderValue(this.normalizedValue(), next);
    if (!changed) return false;

    this.setValue(next);
    this.dragChanged = true;
    if (emitInput) {
      this.sliding.emit({ originalEvent: event, value: next, thumb });
    }
    return true;
  }

  private setValue(value: AerisSliderValue): void {
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private closestThumb(value: number): AerisSliderThumb {
    if (!this.range()) return 'single';
    const lowerDistance = Math.abs(value - this.lowerValue());
    const upperDistance = Math.abs(value - this.upperValue());
    return lowerDistance <= upperDistance ? 'lower' : 'upper';
  }

  private pointerValue(event: PointerEvent, track: HTMLElement): number {
    const rect = track.getBoundingClientRect();
    const ratio =
      this.orientation() === 'vertical'
        ? 1 - (event.clientY - rect.top) / Math.max(1, rect.height)
        : (event.clientX - rect.left) / Math.max(1, rect.width);
    const normalizedRatio = this.reversed() ? 1 - ratio : ratio;
    return (
      this.normalizedMin() +
      Math.min(1, Math.max(0, normalizedRatio)) *
        (this.normalizedMax() - this.normalizedMin())
    );
  }

  private keyDirection(key: string): -1 | 1 | null {
    if (key === 'ArrowRight' || key === 'ArrowUp') {
      return this.reversed() ? -1 : 1;
    }
    if (key === 'ArrowLeft' || key === 'ArrowDown') {
      return this.reversed() ? 1 : -1;
    }
    return null;
  }

  private resolvedPageStep(): number {
    return (
      this.pageStep() ??
      Math.max(
        this.effectiveStep(),
        (this.normalizedMax() - this.normalizedMin()) / 10,
      )
    );
  }

  private normalizedMin(): number {
    return Math.min(this.min(), this.max());
  }

  private normalizedMax(): number {
    return Math.max(this.min(), this.max());
  }

  private endBasePercentage(): number {
    return this.percentage(this.range() ? this.upperValue() : this.singleValue());
  }

  private percentage(value: number): number {
    return sliderPercentage(value, this.normalizedMin(), this.normalizedMax());
  }

  private visualPercentage(value: number): number {
    const percentage = this.percentage(value);
    return this.reversed() ? 100 - percentage : percentage;
  }

  private thumbValue(thumb: AerisSliderThumb): number {
    if (thumb === 'lower') return this.lowerValue();
    if (thumb === 'upper') return this.upperValue();
    return this.singleValue();
  }

  private focusThumb(thumb: AerisSliderThumb): void {
    const id =
      thumb === 'lower'
        ? this.lowerThumbId()
        : thumb === 'upper'
          ? this.upperThumbId()
          : this.singleThumbId();
    this.thumbButtons()
      .find((button) => button.nativeElement.id === id)
      ?.nativeElement.focus();
  }

  private coerceValue(value: unknown): AerisSliderValue {
    if (this.range()) {
      if (Array.isArray(value) && value.length >= 2) {
        return normalizeSliderRange(
          [Number(value[0]), Number(value[1])],
          this.normalizedMin(),
          this.normalizedMax(),
          this.effectiveStep(),
          this.effectiveMinRange(),
        );
      }
      return [this.normalizedMin(), this.normalizedMax()];
    }
    return alignSliderValue(
      typeof value === 'number' && Number.isFinite(value)
        ? value
        : this.normalizedMin(),
      this.normalizedMin(),
      this.normalizedMax(),
      this.effectiveStep(),
    );
  }

}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function sameSliderValue(left: AerisSliderValue, right: AerisSliderValue): boolean {
  if (Array.isArray(left) && Array.isArray(right)) {
    return left[0] === right[0] && left[1] === right[1];
  }
  return left === right;
}
