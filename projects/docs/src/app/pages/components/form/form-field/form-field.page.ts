import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface DirectiveApiRow extends ApiRow {
  readonly owner: string;
}

@Component({
  selector: 'app-form-field-page',
  imports: [
    AerisButton,
    AerisDatePicker,
    AerisFormField,
    AerisInputNumber,
    AerisInputText,
    AerisSelect,
    AerisTabsModule,
    AerisTextarea,
    AerisToggleSwitch,
    FormsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './form-field.page.html',
  styleUrl: './form-field.page.scss',
})
export class FormFieldPage {
  protected readonly email = signal('alex@example.com');
  protected readonly profileName = signal('Alex Morgan');
  protected readonly birthDate = signal<AerisDatePickerValue>(new Date(1994, 6, 12));
  protected readonly height = signal<number | null>(178);
  protected readonly role = signal<string | null>('designer');
  protected readonly biography = signal('Product designer focused on accessible workflows.');
  protected readonly notifications = signal(true);
  protected readonly validationEmail = signal('alex@');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () => this.validationTouched() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.validationEmail()),
  );
  protected readonly roleOptions = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
    { label: 'Product manager', value: 'product-manager' },
  ] as const;

  protected readonly importCode = `import { AerisFormField } from '@aeris-ui/core/form-field';`;

  protected readonly basicCode = `protected readonly email = signal('alex@example.com');`;

  protected readonly profileCode = `protected readonly profileName = signal('Alex Morgan');
protected readonly birthDate = signal<AerisDatePickerValue>(new Date(1994, 6, 12));
protected readonly height = signal<number | null>(178);
protected readonly role = signal<string | null>('designer');
protected readonly biography = signal('Product designer focused on accessible workflows.');

protected readonly roleOptions = [
  { label: 'Designer', value: 'designer' },
  { label: 'Engineer', value: 'engineer' },
  { label: 'Product manager', value: 'product-manager' },
] as const;`;

  protected readonly validationCode = `protected readonly validationEmail = signal('alex@');
protected readonly validationTouched = signal(false);
protected readonly validationInvalid = computed(
  () =>
    this.validationTouched() &&
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.validationEmail()),
);`;

  protected readonly stateCode = `protected readonly notifications = signal(true);`;

  protected readonly basicCss = `.form-field-example {
  width: min(100%, 28rem);
}`;

  protected readonly profileCss = `.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.profile-form__wide {
  grid-column: 1 / -1;
}

@media (max-width: 42rem) {
  .profile-form {
    grid-template-columns: 1fr;
  }

  .profile-form__wide {
    grid-column: auto;
  }
}`;

  protected readonly validationCss = `.validation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.validation-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .validation-grid {
    grid-template-columns: 1fr;
  }

  .validation-actions {
    grid-column: auto;
  }
}`;

  protected readonly statesCss = `.field-state-stack {
  width: min(100%, 32rem);
  display: grid;
  gap: 1rem;
}`;

  protected readonly interfacesCode = `type AerisFormErrorLive = 'off' | 'polite' | 'assertive';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'form-field-import', label: 'Import' },
    { id: 'form-field-basic', label: 'Native control' },
    { id: 'form-field-profile', label: 'Responsive profile form' },
    { id: 'form-field-validation', label: 'Validation and alignment' },
    { id: 'form-field-states', label: 'Required, optional, and disabled' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'form-field-import', label: 'Import' },
    { id: 'form-field-api-inputs', label: 'Inputs' },
    { id: 'form-field-api-directives', label: 'Directives' },
    { id: 'form-field-api-properties', label: 'Properties' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'form-field-import', label: 'Import' },
    { id: 'form-field-interfaces-code', label: 'Types' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'form-field-import', label: 'Import' },
    { id: 'form-field-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'form-field-import', label: 'Import' },
    { id: 'form-field-a11y-associations', label: 'Associations' },
    { id: 'form-field-a11y-errors', label: 'Errors and announcements' },
    { id: 'form-field-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'controlId',
      type: 'string',
      defaultValue: 'generated',
      description: 'ID shared by the label and control. Exposed as a signal for Aeris controls.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Shows the error, applies invalid presentation, and includes its ID in describedBy().',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Applies disabled field presentation. Disable the projected control separately.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Shows the required indicator and sets aria-required on native aerisFormControl elements.',
    },
    {
      name: 'optional',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows an optional indicator unless required is also true.',
    },
    {
      name: 'optionalText',
      type: 'string',
      defaultValue: "'Optional'",
      description: 'Text displayed by the optional indicator for localization.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Makes the field and native aerisFormControl element fill available inline space.',
    },
    {
      name: 'reserveMessageSpace',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Reserves one message line so adjacent grid fields remain visually stable.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string',
      defaultValue: "''",
      description: 'Additional description IDs merged into the generated describedBy() value.',
    },
    {
      name: 'errorLive',
      type: 'AerisFormErrorLive',
      defaultValue: "'polite'",
      description: "Default error announcement behavior. Options: 'off', 'polite', 'assertive'.",
    },
  ];

  protected readonly directiveInputs: readonly DirectiveApiRow[] = [
    {
      owner: 'aerisFormLabel',
      name: 'id',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated label ID.',
    },
    {
      owner: 'aerisFormLabel',
      name: 'for',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated label target. The TypeScript property name is forId.',
    },
    {
      owner: 'aerisFormControl',
      name: 'id',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated native or host-semantic control ID.',
    },
    {
      owner: 'aerisFormControl',
      name: 'aria-describedby',
      type: 'string',
      defaultValue: "''",
      description:
        'Additional description IDs merged with the FormField IDs. The TypeScript property name is ariaDescribedby.',
    },
    {
      owner: 'aerisFormHint',
      name: 'id',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated hint ID.',
    },
    {
      owner: 'aerisFormError',
      name: 'id',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated error ID.',
    },
    {
      owner: 'aerisFormError',
      name: 'hideWhenValid',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Hides the projected error while FormField invalid is false.',
    },
    {
      owner: 'aerisFormError',
      name: 'live',
      type: 'AerisFormErrorLive | undefined',
      defaultValue: 'undefined',
      description:
        "Overrides the field announcement behavior. Options: 'off', 'polite', 'assertive', or undefined to inherit errorLive.",
    },
  ];

  protected readonly properties: readonly ApiRow[] = [
    {
      name: 'labelId',
      type: 'Signal<string>',
      defaultValue: 'derived',
      description: 'Generated label ID for ariaLabelledby on Aeris or custom controls.',
    },
    {
      name: 'hintId',
      type: 'Signal<string>',
      defaultValue: 'derived',
      description: 'Generated default hint ID.',
    },
    {
      name: 'errorId',
      type: 'Signal<string>',
      defaultValue: 'derived',
      description: 'Generated default error ID.',
    },
    {
      name: 'describedBy',
      type: 'Signal<string>',
      defaultValue: 'derived',
      description:
        'Deduplicated hint, active error, and external description IDs for control binding.',
    },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-form-field-gap',
      type: 'length',
      defaultValue: '0.45rem',
      description: 'Spacing between label, control, and support area.',
    },
    {
      name: '--aeris-form-field-color',
      type: 'color',
      defaultValue: '--aeris-text',
      description: 'Base field text color.',
    },
    {
      name: '--aeris-form-field-label-color',
      type: 'color',
      defaultValue: '--aeris-text',
      description: 'Label text color.',
    },
    {
      name: '--aeris-form-field-label-font-size',
      type: 'length',
      defaultValue: '0.875rem',
      description: 'Label font size.',
    },
    {
      name: '--aeris-form-field-label-font-weight',
      type: 'number',
      defaultValue: '700',
      description: 'Label font weight.',
    },
    {
      name: '--aeris-form-field-indicator-gap',
      type: 'length',
      defaultValue: '0.25rem',
      description: 'Gap before required or optional indicators.',
    },
    {
      name: '--aeris-form-field-required-color',
      type: 'color',
      defaultValue: '--aeris-danger',
      description: 'Required indicator color.',
    },
    {
      name: '--aeris-form-field-optional-color',
      type: 'color',
      defaultValue: '--aeris-text-2',
      description: 'Optional indicator color.',
    },
    {
      name: '--aeris-form-field-message-gap',
      type: 'length',
      defaultValue: '0.25rem',
      description: 'Gap between hint and error messages.',
    },
    {
      name: '--aeris-form-field-message-space',
      type: 'length',
      defaultValue: '1.2rem',
      description: 'Reserved support-area height.',
    },
    {
      name: '--aeris-form-field-message-font-size',
      type: 'length',
      defaultValue: '0.8125rem',
      description: 'Hint and error font size.',
    },
    {
      name: '--aeris-form-field-hint-color',
      type: 'color',
      defaultValue: '--aeris-text-2',
      description: 'Hint text color.',
    },
    {
      name: '--aeris-form-field-error-color',
      type: 'color',
      defaultValue: '--aeris-danger-text',
      description: 'Error text color.',
    },
    {
      name: '--aeris-form-field-disabled-opacity',
      type: 'number',
      defaultValue: '0.52',
      description: 'Disabled label and hint opacity.',
    },
  ];

  protected validateEmail(): void {
    this.validationTouched.set(true);
  }

  protected resetValidation(): void {
    this.validationEmail.set('alex@');
    this.validationTouched.set(false);
  }
}
