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
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisPasswordSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisPasswordAppearance = 'outline' | 'filled';
export type AerisPasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export interface AerisPasswordRequirement {
  readonly label: string;
  readonly met: boolean;
}

export interface AerisPasswordStrengthResult {
  readonly score: 0 | 1 | 2 | 3;
  readonly strength: AerisPasswordStrength;
  readonly label: string;
  readonly requirements: readonly AerisPasswordRequirement[];
}

export type AerisPasswordStrengthEvaluator = (
  value: string,
  minLength: number,
) => AerisPasswordStrengthResult;

interface PasswordFeedbackContext {
  readonly $implicit: AerisPasswordStrengthResult;
  readonly result: AerisPasswordStrengthResult;
  readonly value: string;
}

@Directive({ selector: 'ng-template[aerisPasswordHeader]' })
export class AerisPasswordHeaderTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPasswordFeedback]' })
export class AerisPasswordFeedbackTemplate {
  readonly template = inject<TemplateRef<PasswordFeedbackContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPasswordFooter]' })
export class AerisPasswordFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

const scoreFor = (metCount: number): 0 | 1 | 2 | 3 => {
  if (metCount <= 2) return 1;
  if (metCount <= 4) return 2;
  return 3;
};

export const evaluateAerisPassword: AerisPasswordStrengthEvaluator = (
  value,
  minLength,
) => {
  const requirements: readonly AerisPasswordRequirement[] = [
    { label: `At least ${minLength} characters`, met: value.length >= minLength },
    { label: 'One uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'One lowercase letter', met: /[a-z]/.test(value) },
    { label: 'One number', met: /\d/.test(value) },
    { label: 'One symbol', met: /[^A-Za-z0-9\s]/.test(value) },
  ];

  if (!value) {
    return { score: 0, strength: 'empty', label: 'Enter a password', requirements };
  }

  const score = scoreFor(requirements.filter((requirement) => requirement.met).length);
  const strength = score === 1 ? 'weak' : score === 2 ? 'medium' : 'strong';
  const label = strength === 'weak' ? 'Weak password' : strength === 'medium' ? 'Medium password' : 'Strong password';
  return { score, strength, label, requirements };
};

let passwordId = 0;

@Component({
  selector: 'aeris-password',
  imports: [NgTemplateOutlet],
  template: `
    <span
      class="aeris-password"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      <span class="aeris-password__field">
        <input
          #passwordInput
          [id]="resolvedInputId()"
          [type]="visible() ? 'text' : 'password'"
          [name]="name()"
          [value]="value()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [minLength]="minLength()"
          [maxLength]="maxLength() ?? null"
          [disabled]="effectiveDisabled()"
          [readOnly]="readonly()"
          [required]="required()"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="resolvedAriaDescribedby()"
          [attr.aria-invalid]="invalid() || null"
          (input)="handleInput($event)"
          (focus)="handleFocus($event)"
          (blur)="handleInputBlur($event)"
        />

        <span class="aeris-password__actions">
          @if (showClearButton()) {
            <button
              type="button"
              class="aeris-password__action aeris-password__clear"
              [attr.aria-label]="clearButtonAriaLabel()"
              (click)="clear()"
            ><span aria-hidden="true"></span></button>
          }
          @if (toggleMask()) {
            <button
              type="button"
              class="aeris-password__action aeris-password__visibility"
              [attr.aria-label]="visible() ? hidePasswordAriaLabel() : showPasswordAriaLabel()"
              [attr.aria-pressed]="visible()"
              (click)="toggleVisibility()"
            >
              @if (visible()) {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.75" />
                </svg>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M9.4 6.4A10.6 10.6 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.8 3.4" />
                  <path d="M14.6 17.6a10.6 10.6 0 0 1-2.6.4c-6 0-9.5-6-9.5-6a15 15 0 0 1 2.8-3.4" />
                  <path d="M10.1 10.1a2.7 2.7 0 0 0 3.8 3.8" />
                  <path d="M4 4l16 16" />
                </svg>
              }
            </button>
          }
        </span>
      </span>

      @if (feedbackVisible()) {
        <span
          class="aeris-password__feedback"
          [id]="feedbackId"
        >
          @if (headerTemplate(); as header) {
            <span class="aeris-password__header">
              <ng-container [ngTemplateOutlet]="header.template" />
            </span>
          }

          @if (feedbackTemplate(); as customFeedback) {
            <ng-container
              [ngTemplateOutlet]="customFeedback.template"
              [ngTemplateOutletContext]="{
                $implicit: strengthResult(),
                result: strengthResult(),
                value: value()
              }"
            />
          } @else {
            <span class="aeris-password__strength-row">
              <strong role="status" aria-live="polite">{{ strengthResult().label }}</strong>
              <span>{{ strengthResult().score }}/3</span>
            </span>
            <span
              class="aeris-password__meter"
              [attr.data-strength]="strengthResult().strength"
              aria-hidden="true"
            ><span></span><span></span><span></span></span>

            @if (showRequirements()) {
              <span class="aeris-password__requirements">
                @for (requirement of strengthResult().requirements; track requirement.label) {
                  <span [attr.data-met]="requirement.met || null">
                    <i aria-hidden="true"></i>{{ requirement.label }}
                  </span>
                }
              </span>
            }
          }

          @if (footerTemplate(); as footer) {
            <span class="aeris-password__footer">
              <ng-container [ngTemplateOutlet]="footer.template" />
            </span>
          }
        </span>
      }
    </span>
  `,
  styleUrl: './aeris-password.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisPasswordComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisPasswordComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('passwordInput');
  private readonly generatedId = `aeris-password-${++passwordId}`;
  private readonly formDisabled = signal(false);
  private readonly hasFocus = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model('');
  readonly visible = model(false);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('current-password');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly size = input<AerisPasswordSize>('md');
  readonly appearance = input<AerisPasswordAppearance>('outline');
  readonly minLength = input(8);
  readonly maxLength = input<number>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly toggleMask = input(true, { transform: booleanAttribute });
  readonly feedback = input(true, { transform: booleanAttribute });
  readonly showRequirements = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear password');
  readonly showPasswordAriaLabel = input('Show password');
  readonly hidePasswordAriaLabel = input('Hide password');
  readonly strengthEvaluator = input<AerisPasswordStrengthEvaluator>(evaluateAerisPassword);

  readonly valueInput = output<string>();
  readonly visibilityChanged = output<boolean>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly feedbackId = `${this.generatedId}-feedback`;
  protected readonly headerTemplate = contentChild(AerisPasswordHeaderTemplate);
  protected readonly feedbackTemplate = contentChild(AerisPasswordFeedbackTemplate);
  protected readonly footerTemplate = contentChild(AerisPasswordFooterTemplate);
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly strengthResult = computed(() =>
    this.strengthEvaluator()(this.value(), this.minLength()),
  );
  protected readonly feedbackVisible = computed(
    () => this.feedback() && this.hasFocus() && !this.effectiveDisabled(),
  );
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.value().length > 0 &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );
  protected readonly resolvedAriaDescribedby = computed(() => {
    const ids = [
      this.ariaDescribedby(),
      this.feedbackVisible() ? this.feedbackId : '',
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  });

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : value == null ? '' : String(value));
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
    this.inputElement()?.nativeElement.focus(options);
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.focus();
  }

  show(): void {
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  toggleVisibility(): void {
    if (this.effectiveDisabled()) return;
    this.setVisible(!this.visible());
    queueMicrotask(() => this.focus());
  }

  protected handleInput(event: Event): void {
    this.setValue((event.target as HTMLInputElement).value);
  }

  protected handleFocus(event: FocusEvent): void {
    this.hasFocus.set(true);
    this.focused.emit(event);
  }

  protected handleInputBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.host.nativeElement.contains(nextTarget)) return;
    this.hasFocus.set(false);
    this.touch.emit();
    this.onTouched();
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private setVisible(visible: boolean): void {
    if (this.visible() === visible) return;
    this.visible.set(visible);
    this.visibilityChanged.emit(visible);
  }
}

export const AerisPassword = [
  AerisPasswordComponent,
  AerisPasswordHeaderTemplate,
  AerisPasswordFeedbackTemplate,
  AerisPasswordFooterTemplate,
] as const;
