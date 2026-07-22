import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisCompareOrientation = 'horizontal' | 'vertical';
export type AerisCompareObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface AerisCompareContentContext {
  readonly $implicit: number;
  readonly value: number;
  readonly percentage: number;
}

export interface AerisCompareHandleContext extends AerisCompareContentContext {
  readonly orientation: AerisCompareOrientation;
  readonly disabled: boolean;
}

export interface AerisCompareInputEvent {
  readonly originalEvent: Event;
  readonly value: number;
}

@Directive({ selector: 'ng-template[aerisCompareBefore]' })
export class AerisCompareBeforeTemplate {
  readonly template = inject<TemplateRef<AerisCompareContentContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisCompareBeforeTemplate,
    context: unknown,
  ): context is AerisCompareContentContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisCompareAfter]' })
export class AerisCompareAfterTemplate {
  readonly template = inject<TemplateRef<AerisCompareContentContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisCompareAfterTemplate,
    context: unknown,
  ): context is AerisCompareContentContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisCompareHandle]' })
export class AerisCompareHandleTemplate {
  readonly template = inject<TemplateRef<AerisCompareHandleContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisCompareHandleTemplate,
    context: unknown,
  ): context is AerisCompareHandleContext {
    return true;
  }
}

let compareId = 0;

@Component({
  selector: 'aeris-compare',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-compare"
      [attr.data-orientation]="orientation()"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [style.aspect-ratio]="aspectRatio()"
      [style.--_aeris-compare-position]="percentage() + '%'"
      [style.--_aeris-compare-object-fit]="objectFit()"
      (pointermove)="handleHover($event)"
    >
      <div class="aeris-compare__layer aeris-compare__layer--after">
        @if (afterTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template.template"
            [ngTemplateOutletContext]="contentContext()"
          />
        } @else if (afterSrc()) {
          <img
            class="aeris-compare__image"
            [src]="afterSrc()"
            [alt]="afterAlt()"
            [attr.loading]="loading()"
            decoding="async"
            draggable="false"
          />
        } @else {
          <span class="aeris-compare__empty">{{ afterLabel() }}</span>
        }
      </div>

      <div class="aeris-compare__layer aeris-compare__layer--before">
        @if (beforeTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template.template"
            [ngTemplateOutletContext]="contentContext()"
          />
        } @else if (beforeSrc()) {
          <img
            class="aeris-compare__image"
            [src]="beforeSrc()"
            [alt]="beforeAlt()"
            [attr.loading]="loading()"
            decoding="async"
            draggable="false"
          />
        } @else {
          <span class="aeris-compare__empty">{{ beforeLabel() }}</span>
        }
      </div>

      @if (showLabels()) {
        <span class="aeris-compare__label aeris-compare__label--before" aria-hidden="true">
          {{ beforeLabel() }}
        </span>
        <span class="aeris-compare__label aeris-compare__label--after" aria-hidden="true">
          {{ afterLabel() }}
        </span>
      }

      <span class="aeris-compare__divider" aria-hidden="true"></span>
      <span class="aeris-compare__handle" aria-hidden="true">
        @if (handleTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template.template"
            [ngTemplateOutletContext]="handleContext()"
          />
        } @else {
          <span class="aeris-compare__handle-icon"></span>
        }
      </span>

      <input
        #rangeInput
        class="aeris-compare__input"
        type="range"
        [id]="resolvedInputId()"
        [name]="name() || null"
        [min]="normalizedMin()"
        [max]="normalizedMax()"
        [step]="effectiveStep()"
        [value]="normalizedValue()"
        [disabled]="effectiveDisabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledby() || null"
        [attr.aria-describedby]="ariaDescribedby() || null"
        [attr.aria-valuetext]="resolvedValueText()"
        [attr.aria-orientation]="orientation()"
        [attr.aria-readonly]="readonly() || null"
        (keydown)="handleKeydown($event)"
        (input)="handleInput($event)"
        (change)="handleChange($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
    </div>
  `,
  styleUrl: './aeris-compare.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisCompare),
      multi: true,
    },
  ],
  host: {
    class: 'aeris-compare-host',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class AerisCompare implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly rangeInput = viewChild.required<ElementRef<HTMLInputElement>>('rangeInput');
  protected readonly beforeTemplate = contentChild(AerisCompareBeforeTemplate);
  protected readonly afterTemplate = contentChild(AerisCompareAfterTemplate);
  protected readonly handleTemplate = contentChild(AerisCompareHandleTemplate);
  private readonly generatedInputId = `aeris-compare-${++compareId}`;

  readonly value = model(50);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly orientation = input<AerisCompareOrientation>('horizontal');
  readonly slideOnHover = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly beforeSrc = input('');
  readonly afterSrc = input('');
  readonly beforeAlt = input('');
  readonly afterAlt = input('');
  readonly beforeLabel = input('Before');
  readonly afterLabel = input('After');
  readonly showLabels = input(false, { transform: booleanAttribute });
  readonly objectFit = input<AerisCompareObjectFit>('cover');
  readonly aspectRatio = input('16 / 9');
  readonly loading = input<'eager' | 'lazy'>('lazy');
  readonly name = input('');
  readonly inputId = input('');
  readonly ariaLabel = input('Comparison position');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly valueText = input<((value: number) => string) | null>(null);

  readonly valueInput = output<AerisCompareInputEvent>();
  readonly changed = output<AerisCompareInputEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly formDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly normalizedMin = computed(() => this.finiteNumber(this.min(), 0));
  protected readonly normalizedMax = computed(() => {
    const maximum = this.finiteNumber(this.max(), 100);
    return maximum > this.normalizedMin() ? maximum : this.normalizedMin() + 1;
  });
  protected readonly effectiveStep = computed(() => {
    const step = this.finiteNumber(this.step(), 1);
    return step > 0 ? step : 1;
  });
  protected readonly normalizedValue = computed(() => this.alignValue(this.value()));
  protected readonly percentage = computed(
    () =>
      ((this.normalizedValue() - this.normalizedMin()) /
        (this.normalizedMax() - this.normalizedMin())) *
      100,
  );
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedInputId);
  protected readonly contentContext = computed<AerisCompareContentContext>(() => ({
    $implicit: this.normalizedValue(),
    value: this.normalizedValue(),
    percentage: this.percentage(),
  }));
  protected readonly handleContext = computed<AerisCompareHandleContext>(() => ({
    ...this.contentContext(),
    orientation: this.orientation(),
    disabled: this.effectiveDisabled(),
  }));
  protected readonly resolvedValueText = computed(() => {
    const formatter = this.valueText();
    return formatter ? formatter(this.normalizedValue()) : `${Math.round(this.percentage())}%`;
  });

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  setValue(value: number, emitChange = true): void {
    const next = this.alignValue(value);
    if (next === this.normalizedValue()) return;
    this.value.set(next);
    this.onChange(next);
    if (emitChange) {
      this.changed.emit({ originalEvent: new Event('change'), value: next });
    }
  }

  focus(): void {
    this.rangeInput().nativeElement.focus();
  }

  writeValue(value: number | null): void {
    if (value !== null) this.value.set(this.alignValue(value));
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

  protected handleInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    if (this.readonly()) {
      input.value = `${this.normalizedValue()}`;
      return;
    }
    const next = this.alignValue(input.valueAsNumber);
    this.updateValue(next);
    this.valueInput.emit({ originalEvent: event, value: next });
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const pageStep = this.effectiveStep() * 10;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = this.normalizedValue() - this.effectiveStep();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = this.normalizedValue() + this.effectiveStep();
        break;
      case 'PageDown':
        next = this.normalizedValue() - pageStep;
        break;
      case 'PageUp':
        next = this.normalizedValue() + pageStep;
        break;
      case 'Home':
        next = this.normalizedMin();
        break;
      case 'End':
        next = this.normalizedMax();
        break;
      default:
        return;
    }

    event.preventDefault();
    if (this.readonly()) return;
    const aligned = this.alignValue(next);
    if (aligned === this.normalizedValue()) return;
    this.updateValue(aligned);
    const detail = { originalEvent: event, value: aligned };
    this.valueInput.emit(detail);
    this.changed.emit(detail);
  }

  protected handleChange(event: Event): void {
    if (this.readonly()) return;
    const next = this.alignValue((event.currentTarget as HTMLInputElement).valueAsNumber);
    this.updateValue(next);
    this.changed.emit({ originalEvent: event, value: next });
    this.markTouched();
  }

  protected handleHover(event: PointerEvent): void {
    if (
      !this.slideOnHover() ||
      this.effectiveDisabled() ||
      this.readonly() ||
      event.pointerType === 'touch' ||
      event.buttons !== 0
    ) {
      return;
    }

    const bounds = this.host.nativeElement.getBoundingClientRect();
    let ratio: number;
    if (this.orientation() === 'vertical') {
      ratio = 1 - (event.clientY - bounds.top) / bounds.height;
    } else {
      ratio = (event.clientX - bounds.left) / bounds.width;
      const direction = getComputedStyle(this.host.nativeElement).direction;
      if (direction === 'rtl') ratio = 1 - ratio;
    }
    const next = this.alignValue(
      this.normalizedMin() +
        Math.min(1, Math.max(0, ratio)) * (this.normalizedMax() - this.normalizedMin()),
    );
    if (next === this.normalizedValue()) return;
    this.updateValue(next);
    this.valueInput.emit({ originalEvent: event, value: next });
  }

  protected handleBlur(event: FocusEvent): void {
    this.markTouched();
    this.blurred.emit(event);
  }

  private updateValue(value: number): void {
    this.value.set(value);
    this.onChange(value);
  }

  private markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  private alignValue(value: number): number {
    const minimum = this.normalizedMin();
    const maximum = this.normalizedMax();
    const finite = this.finiteNumber(value, minimum);
    const aligned =
      minimum + Math.round((finite - minimum) / this.effectiveStep()) * this.effectiveStep();
    const precision = Math.max(
      this.decimalPlaces(minimum),
      this.decimalPlaces(maximum),
      this.decimalPlaces(this.effectiveStep()),
    );
    return Number(Math.min(maximum, Math.max(minimum, aligned)).toFixed(precision));
  }

  private finiteNumber(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
  }

  private decimalPlaces(value: number): number {
    const exponent = value.toString().split(/[eE]/u);
    if (exponent.length > 1) {
      return Math.max(0, (exponent[0]?.split('.')[1]?.length ?? 0) - Number(exponent[1]));
    }
    return value.toString().split('.')[1]?.length ?? 0;
  }
}

export const AerisCompareModule = [
  AerisCompare,
  AerisCompareBeforeTemplate,
  AerisCompareAfterTemplate,
  AerisCompareHandleTemplate,
] as const;
