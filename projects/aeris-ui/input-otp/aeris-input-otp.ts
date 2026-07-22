import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  afterNextRender,
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
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisInputOtpSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisInputOtpAppearance = 'outline' | 'filled';
export type AerisInputOtpMode = 'numeric' | 'alphanumeric';

export interface AerisInputOtpCompleteEvent {
  readonly originalEvent: Event;
  readonly value: string;
}

interface InputOtpSeparatorContext {
  readonly $implicit: number;
  readonly index: number;
}

interface InputOtpSlot {
  readonly index: number;
  readonly position: number;
  readonly id: string;
  readonly value: string;
  readonly ariaLabel: string;
}

@Directive({ selector: 'ng-template[aerisInputOtpSeparator]' })
export class AerisInputOtpSeparatorTemplate {
  readonly template = inject<TemplateRef<InputOtpSeparatorContext>>(TemplateRef);
}

const normalizeLength = (value: unknown): number =>
  Math.max(1, Math.floor(numberAttribute(value, 4)));

let inputOtpId = 0;

@Component({
  selector: 'aeris-input-otp',
  imports: [NgTemplateOutlet],
  template: `
    <span
      class="aeris-input-otp"
      role="group"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-fluid]="fluid() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledby() || null"
      [attr.aria-describedby]="ariaDescribedby() || null"
      [attr.aria-invalid]="invalid() || null"
      [attr.aria-required]="required() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="normalizedValue()" />
      }

      @for (slot of slots(); track slot.index) {
        <input
          #otpInput
          class="aeris-input-otp__slot"
          [id]="slot.id"
          [type]="mask() ? 'password' : 'text'"
          [value]="slot.value"
          [inputMode]="effectiveInputMode()"
          [autocomplete]="slot.index === 0 ? autocomplete() : 'off'"
          maxlength="1"
          [disabled]="effectiveDisabled()"
          [readOnly]="readonly()"
          [attr.aria-label]="slot.ariaLabel"
          [attr.aria-invalid]="invalid() || null"
          (beforeinput)="handleBeforeInput($event, slot.index)"
          (input)="handleInput($event, slot.index)"
          (keydown)="handleKeydown($event, slot.index)"
          (paste)="handlePaste($event, slot.index)"
          (focus)="handleFocus($event)"
          (blur)="blurred.emit($event)"
        />

        @if (slot.index < length() - 1 && separatorTemplate(); as separator) {
          <span class="aeris-input-otp__separator" aria-hidden="true">
            <ng-container
              [ngTemplateOutlet]="separator.template"
              [ngTemplateOutletContext]="{ $implicit: slot.index, index: slot.index }"
            />
          </span>
        }
      }
    </span>
  `,
  styleUrl: './aeris-input-otp.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisInputOtpComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisInputOtpComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly inputElements = viewChildren<ElementRef<HTMLInputElement>>('otpInput');
  private readonly generatedId = `aeris-input-otp-${++inputOtpId}`;
  private readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model('');
  readonly length = input(4, { transform: normalizeLength });
  readonly mode = input<AerisInputOtpMode>('numeric');
  readonly inputId = input('');
  readonly name = input('');
  readonly autocomplete = input('one-time-code');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly slotAriaLabel = input('Character {0} of {1}');
  readonly size = input<AerisInputOtpSize>('md');
  readonly appearance = input<AerisInputOtpAppearance>('outline');
  readonly mask = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly selectOnFocus = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<string>();
  readonly completed = output<AerisInputOtpCompleteEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly separatorTemplate = contentChild(AerisInputOtpSeparatorTemplate);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly effectiveInputMode = computed(() =>
    this.mode() === 'numeric' ? 'numeric' : 'text',
  );
  protected readonly slots = computed<readonly InputOtpSlot[]>(() => {
    const value = this.normalizedValue();
    return Array.from({ length: this.length() }, (_, index) => ({
      index,
      position: index + 1,
      id: index === 0 && this.inputId() ? this.inputId() : `${this.generatedId}-${index + 1}`,
      value: value[index] ?? '',
      ariaLabel: this.slotAriaLabel()
        .replace('{0}', String(index + 1))
        .replace('{1}', String(this.length())),
    }));
  });
  protected readonly normalizedValue = computed(() =>
    this.filterCharacters(this.value()).slice(0, this.length()),
  );

  constructor() {
    afterNextRender(() => {
      if (this.autoFocus() && !this.effectiveDisabled()) this.focus();
    });
  }

  writeValue(value: unknown): void {
    const next = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    this.value.set(this.filterCharacters(next).slice(0, this.length()));
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

  focus(index = 0, options?: FocusOptions): void {
    const targetIndex = Math.min(Math.max(index, 0), this.length() - 1);
    this.inputElements()[targetIndex]?.nativeElement.focus(options);
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.commit('', new Event('clear'));
    queueMicrotask(() => this.focus());
  }

  protected handleBeforeInput(event: InputEvent, index: number): void {
    if (event.inputType.startsWith('delete') || !event.data) return;
    const accepted = this.filterCharacters(event.data);
    if (!accepted) {
      event.preventDefault();
      return;
    }
    if (accepted.length > 1) {
      event.preventDefault();
      this.insertCharacters(accepted, index, event);
    }
  }

  protected handleInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const accepted = this.filterCharacters(inputElement.value);
    if (!accepted) {
      inputElement.value = this.normalizedValue()[index] ?? '';
      return;
    }
    this.insertCharacters(accepted, index, event);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    if (this.effectiveDisabled() || this.readonly()) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focus(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focus(index + 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      this.focus(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.focus(this.length() - 1);
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      const currentValue = this.normalizedValue();
      const targetIndex = currentValue[index] ? index : Math.max(0, index - 1);
      this.removeAt(targetIndex, event);
      queueMicrotask(() => this.focus(targetIndex));
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      this.removeAt(index, event);
    }
  }

  protected handlePaste(event: ClipboardEvent, index: number): void {
    const pasted = this.filterCharacters(event.clipboardData?.getData('text') ?? '');
    if (!pasted) return;
    event.preventDefault();
    this.insertCharacters(pasted, index, event);
  }

  protected handleFocus(event: FocusEvent): void {
    if (this.selectOnFocus()) {
      (event.target as HTMLInputElement).select();
    }
    this.focused.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.host.nativeElement.contains(nextTarget)) return;
    this.touch.emit();
    this.onTouched();
  }

  private insertCharacters(characters: string, index: number, event: Event): void {
    const slots = Array.from({ length: this.length() }, (_, slotIndex) =>
      this.normalizedValue()[slotIndex] ?? '',
    );
    let nextIndex = index;
    for (const character of characters) {
      if (nextIndex >= slots.length) break;
      slots[nextIndex] = character;
      nextIndex += 1;
    }
    const nextValue = slots.join('');
    this.commit(nextValue, event);
    queueMicrotask(() => this.focus(Math.min(nextIndex, this.length() - 1)));
  }

  private removeAt(index: number, event: Event): void {
    const slots = Array.from({ length: this.length() }, (_, slotIndex) =>
      this.normalizedValue()[slotIndex] ?? '',
    );
    slots[index] = '';
    this.commit(slots.join(''), event);
  }

  private commit(value: string, event: Event): void {
    const nextValue = this.filterCharacters(value).slice(0, this.length());
    const wasComplete = this.normalizedValue().length === this.length();
    if (this.value() !== nextValue) {
      this.value.set(nextValue);
      this.valueInput.emit(nextValue);
      this.onChange(nextValue);
    }
    if (!wasComplete && nextValue.length === this.length()) {
      this.completed.emit({ originalEvent: event, value: nextValue });
    }
  }

  private filterCharacters(value: string): string {
    const pattern = this.mode() === 'numeric' ? /[0-9]/g : /[A-Za-z0-9]/g;
    return value.match(pattern)?.join('') ?? '';
  }
}

export const AerisInputOtp = [
  AerisInputOtpComponent,
  AerisInputOtpSeparatorTemplate,
] as const;
