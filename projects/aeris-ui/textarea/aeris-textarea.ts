import {
  Component,
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisTextareaSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisTextareaAppearance = 'outline' | 'filled';
export type AerisTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

@Directive({
  selector: 'textarea[aerisTextarea]',
  host: {
    class: 'aeris-textarea',
    '[class.aeris-textarea--xs]': 'size() === "xs"',
    '[class.aeris-textarea--sm]': 'size() === "sm"',
    '[class.aeris-textarea--md]': 'size() === "md"',
    '[class.aeris-textarea--lg]': 'size() === "lg"',
    '[class.aeris-textarea--filled]': 'appearance() === "filled"',
    '[class.aeris-textarea--invalid]': 'invalid()',
    '[class.aeris-textarea--fluid]': 'fluid()',
    '[attr.data-resize]': 'resize()',
    '[attr.aria-invalid]': 'invalid() || null',
  },
})
export class AerisTextareaDirective {
  readonly size = input<AerisTextareaSize>('md');
  readonly appearance = input<AerisTextareaAppearance>('outline');
  readonly resize = input<AerisTextareaResize>('vertical');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
}

let textareaId = 0;

@Component({
  selector: 'aeris-textarea',
  imports: [AerisTextareaDirective],
  template: `
    <span
      class="aeris-textarea-component"
      [attr.data-size]="size()"
      [attr.data-fluid]="fluid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-invalid]="invalid() || null"
    >
      <span class="aeris-textarea-component__field">
        <textarea
          #textarea
          aerisTextarea
          [id]="resolvedInputId()"
          [name]="name()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [rows]="rows()"
          [cols]="cols() || null"
          [wrap]="wrap()"
          [value]="value()"
          [size]="size()"
          [appearance]="appearance()"
          [resize]="autoResize() ? 'none' : resize()"
          [invalid]="invalid()"
          [disabled]="effectiveDisabled()"
          [readOnly]="readonly()"
          [required]="required()"
          fluid
          [attr.minlength]="minLength() ?? null"
          [attr.maxlength]="maxLength() ?? null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="ariaDescribedby() || null"
          [attr.aria-required]="required() || null"
          [style.height.px]="autoResize() ? autoHeight() : null"
          [style.overflow-y]="autoResize() && atMaximumHeight() ? 'auto' : null"
          (input)="handleInput($event)"
          (focus)="focused.emit($event)"
          (blur)="handleBlur($event)"
          (scroll)="scrolled.emit($event)"
        ></textarea>

        @if (showClearButton()) {
          <button
            class="aeris-textarea-component__clear"
            type="button"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="clear()"
          >
            <span aria-hidden="true"></span>
          </button>
        }
      </span>

      @if (showCount()) {
        <span
          class="aeris-textarea-component__count"
          [attr.aria-live]="countLive() ? 'polite' : null"
        >
          @if (maxLength(); as maximum) {
            {{ characterCount() }} / {{ maximum }}
          } @else {
            {{ characterCount() }}
          }
        </span>
      }
    </span>
  `,
  styleUrl: './aeris-textarea-component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisTextareaComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisTextareaComponent implements ControlValueAccessor {
  readonly value = model('');
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly rows = input(3);
  readonly cols = input<number>();
  readonly wrap = input<'soft' | 'hard' | 'off'>('soft');
  readonly minLength = input<number>();
  readonly maxLength = input<number>();
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly size = input<AerisTextareaSize>('md');
  readonly appearance = input<AerisTextareaAppearance>('outline');
  readonly resize = input<AerisTextareaResize>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly autoResize = input(false, { transform: booleanAttribute });
  readonly minRows = input(3);
  readonly maxRows = input<number>();
  readonly showCount = input(false, { transform: booleanAttribute });
  readonly countLive = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear text');

  readonly valueInput = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly scrolled = output<Event>();
  readonly touch = output<void>();
  readonly cleared = output<void>();

  protected readonly formDisabled = signal(false);
  protected readonly autoHeight = signal<number | null>(null);
  protected readonly atMaximumHeight = signal(false);
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  private readonly generatedId = `aeris-textarea-${++textareaId}`;
  protected readonly resolvedInputId = computed(
    () => this.inputId() || this.generatedId,
  );
  protected readonly characterCount = computed(() =>
    Array.from(this.value()).length,
  );
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.value().length > 0 &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );

  private readonly textarea =
    viewChild<ElementRef<HTMLTextAreaElement>>('textarea');
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value.set(value == null ? '' : String(value));
    this.scheduleResize();
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.textarea()?.nativeElement.focus(options);
  }

  reset(): void {
    this.setValue('');
    this.scheduleResize();
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.cleared.emit();
    this.scheduleResize();
    queueMicrotask(() => this.focus());
  }

  resizeToContent(): void {
    if (!this.autoResize()) return;
    const element = this.textarea()?.nativeElement;
    if (!element) return;

    const styles = getComputedStyle(element);
    const rowHeight = cssPixelValue(
      styles,
      '--aeris-textarea-row-height',
      21,
    );
    const verticalPadding = cssPixelValue(
      styles,
      '--aeris-textarea-vertical-padding',
      20,
    );
    const minimum = Math.max(1, this.minRows()) * rowHeight + verticalPadding;
    const maximumRows = this.maxRows();
    const maximum =
      maximumRows === undefined
        ? Number.POSITIVE_INFINITY
        : Math.max(this.minRows(), maximumRows) * rowHeight +
          verticalPadding;
    const height = Math.min(maximum, Math.max(minimum, element.scrollHeight));

    this.autoHeight.set(height);
    this.atMaximumHeight.set(
      Number.isFinite(maximum) && element.scrollHeight > maximum,
    );
  }

  protected handleInput(event: Event): void {
    this.setValue((event.target as HTMLTextAreaElement).value);
    this.resizeToContent();
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private scheduleResize(): void {
    if (this.autoResize()) {
      queueMicrotask(() => this.resizeToContent());
    }
  }

}

export const AerisTextarea = [
  AerisTextareaDirective,
  AerisTextareaComponent,
] as const;

function cssPixelValue(
  styles: CSSStyleDeclaration,
  property: string,
  fallback: number,
): number {
  const value = Number.parseFloat(styles.getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
}
