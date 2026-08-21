import {
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';

export type AerisFormErrorLive = 'off' | 'polite' | 'assertive';

let nextFormFieldId = 0;

@Component({
  selector: 'aeris-form-field',
  template: `
    <ng-content select="[aerisFormLabel]" />
    <div class="aeris-form-field__control"><ng-content /></div>
    <div class="aeris-form-field__support">
      <ng-content select="[aerisFormHint], [aerisFormError]" />
    </div>
  `,
  styleUrl: './aeris-form-field.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-form-field',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-required]': 'required() || null',
    '[attr.data-optional]': 'showOptionalIndicator() || null',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-reserve-message-space]': 'reserveMessageSpace() || null',
  },
})
export class AerisFormFieldComponent {
  private readonly generatedControlId = `aeris-form-field-${++nextFormFieldId}-control`;
  private readonly label = contentChild(AerisFormLabelDirective);
  private readonly hint = contentChild(AerisFormHintDirective);
  private readonly error = contentChild(AerisFormErrorDirective);

  readonly controlId = input(this.generatedControlId);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly optionalText = input('Optional');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly reserveMessageSpace = input(false, { transform: booleanAttribute });
  readonly ariaDescribedby = input('');
  readonly errorLive = input<AerisFormErrorLive>('polite');

  readonly labelId = computed(() => `${this.controlId()}-label`);
  readonly hintId = computed(() => `${this.controlId()}-hint`);
  readonly errorId = computed(() => `${this.controlId()}-error`);
  readonly showOptionalIndicator = computed(() => this.optional() && !this.required());
  readonly describedBy = computed(() =>
    uniqueIds([
      this.ariaDescribedby(),
      this.hint()?.resolvedId() ?? '',
      this.invalid() ? (this.error()?.resolvedId() ?? '') : '',
    ]),
  );
}

@Directive({
  selector: '[aerisFormLabel]',
  host: {
    class: 'aeris-form-field__label',
    '[attr.id]': 'resolvedId()',
    '[attr.for]': 'resolvedFor()',
    '[attr.data-required]': 'field.required() || null',
    '[attr.data-optional]': 'field.showOptionalIndicator() || null',
    '[attr.data-optional-text]': 'field.showOptionalIndicator() ? field.optionalText() : null',
  },
})
export class AerisFormLabelDirective {
  protected readonly field = inject(AerisFormFieldComponent, { host: true });

  readonly id = input('', { alias: 'id' });
  readonly forId = input('', { alias: 'for' });

  readonly resolvedId = computed(() => this.id() || this.field.labelId());
  readonly resolvedFor = computed(() => this.forId() || this.field.controlId());
}

@Directive({
  selector: '[aerisFormControl]',
  host: {
    class: 'aeris-form-field__native-control',
    '[attr.id]': 'resolvedId()',
    '[attr.aria-describedby]': 'resolvedDescribedBy() || null',
    '[attr.aria-invalid]': 'field.invalid() || null',
    '[attr.aria-required]': 'field.required() || null',
    '[attr.data-fluid]': 'field.fluid() || null',
  },
})
export class AerisFormControlDirective {
  protected readonly field = inject(AerisFormFieldComponent, { host: true });

  readonly id = input('', { alias: 'id' });
  readonly ariaDescribedby = input('', { alias: 'aria-describedby' });

  readonly resolvedId = computed(() => this.id() || this.field.controlId());
  readonly resolvedDescribedBy = computed(() =>
    uniqueIds([this.ariaDescribedby(), this.field.describedBy()]),
  );
}

@Directive({
  selector: '[aerisFormHint]',
  host: {
    class: 'aeris-form-field__hint',
    '[attr.id]': 'resolvedId()',
  },
})
export class AerisFormHintDirective {
  private readonly field = inject(AerisFormFieldComponent, { host: true });

  readonly id = input('', { alias: 'id' });
  readonly resolvedId = computed(() => this.id() || this.field.hintId());
}

@Directive({
  selector: '[aerisFormError]',
  host: {
    class: 'aeris-form-field__error',
    '[attr.id]': 'resolvedId()',
    '[hidden]': 'hideWhenValid() && !field.invalid()',
    '[attr.aria-live]': 'resolvedLive()',
    '[attr.aria-atomic]': 'resolvedLive() ? "true" : null',
  },
})
export class AerisFormErrorDirective {
  protected readonly field = inject(AerisFormFieldComponent, { host: true });

  readonly id = input('', { alias: 'id' });
  readonly hideWhenValid = input(true, { transform: booleanAttribute });
  readonly live = input<AerisFormErrorLive | undefined>(undefined);

  readonly resolvedId = computed(() => this.id() || this.field.errorId());
  readonly resolvedLive = computed(() => {
    const live = this.live() ?? this.field.errorLive();
    return live === 'off' ? null : live;
  });
}

export const AerisFormField = [
  AerisFormFieldComponent,
  AerisFormLabelDirective,
  AerisFormControlDirective,
  AerisFormHintDirective,
  AerisFormErrorDirective,
] as const;

function uniqueIds(values: readonly string[]): string {
  return [...new Set(values.flatMap((value) => value.trim().split(/\s+/)).filter(Boolean))].join(
    ' ',
  );
}
