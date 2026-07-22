import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisPassword,
  type AerisPasswordStrengthResult,
} from '@aeris-ui/core/password';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

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

@Component({
  selector: 'app-password-page',
  imports: [
    AerisPassword,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './password.page.html',
  styleUrl: './password.page.scss',
})
export class PasswordPage {
  protected readonly password = signal('');
  protected readonly visiblePassword = signal('Aeris2026!');
  protected readonly clearablePassword = signal('Temporary1!');
  protected readonly validatedPassword = signal('short');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () => this.validationTouched() && this.validatedPassword().length < 12,
  );
  protected readonly reactivePassword = new FormControl('Reactive1!');
  protected templatePassword = 'Template1!';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'password-basic', label: 'Basic' },
    { id: 'password-visibility', label: 'Visibility' },
    { id: 'password-feedback', label: 'Strength feedback' },
    { id: 'password-policy', label: 'Custom policy' },
    { id: 'password-templates', label: 'Templates' },
    { id: 'password-clear', label: 'Clear button' },
    { id: 'password-autocomplete', label: 'Autocomplete' },
    { id: 'password-sizes', label: 'Sizes' },
    { id: 'password-states', label: 'States' },
    { id: 'password-validation', label: 'Validation' },
    { id: 'password-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'password-api-inputs', label: 'Inputs' },
    { id: 'password-api-outputs', label: 'Outputs' },
    { id: 'password-api-templates', label: 'Templates' },
    { id: 'password-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisPassword } from '@aeris-ui/core/password';`;

  protected readonly modelCode = `protected readonly password = signal('');`;

  protected readonly policyCode = `import {
  type AerisPasswordStrengthResult,
} from '@aeris-ui/core/password';

protected readonly companyPolicy = (
  value: string,
  minLength: number,
): AerisPasswordStrengthResult => {
  const requirements = [
    { label: \`At least \${minLength} characters\`, met: value.length >= minLength },
    { label: 'Starts with AER-', met: value.startsWith('AER-') },
    { label: 'Contains a number', met: /\\d/.test(value) },
  ];
  const met = requirements.filter((item) => item.met).length;
  const score = met === 3 ? 3 : met >= 2 ? 2 : value ? 1 : 0;
  const strength = score === 3 ? 'strong' : score === 2 ? 'medium' : score === 1 ? 'weak' : 'empty';
  return {
    score,
    strength,
    label: score === 3 ? 'Policy satisfied' : 'Policy requirements',
    requirements,
  };
};`;

  protected readonly validationCode = `protected readonly validatedPassword = signal('short');
protected readonly validationTouched = signal(false);
protected readonly validationInvalid = computed(
  () =>
    this.validationTouched() &&
    this.validatedPassword().length < 12,
);`;

  protected readonly formsCode = `protected readonly reactivePassword =
  new FormControl('Reactive1!');

protected templatePassword = 'Template1!';`;

  protected readonly templateCssCode = `.custom-feedback {
  display: grid;
  gap: 0.375rem;
}

.custom-feedback strong {
  color: var(--primary-text);
}`;

  protected readonly interfacesCode = `type AerisPasswordSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisPasswordAppearance = 'outline' | 'filled';
type AerisPasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

interface AerisPasswordRequirement {
  readonly label: string;
  readonly met: boolean;
}

interface AerisPasswordStrengthResult {
  readonly score: 0 | 1 | 2 | 3;
  readonly strength: AerisPasswordStrength;
  readonly label: string;
  readonly requirements: readonly AerisPasswordRequirement[];
}

type AerisPasswordStrengthEvaluator = (
  value: string,
  minLength: number,
) => AerisPasswordStrengthResult;`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string (model)', defaultValue: "''", description: 'Password value with two-way binding and Forms support.' },
    { name: 'visible', type: 'boolean (model)', defaultValue: 'false', description: 'Controls whether the value is masked.' },
    { name: 'inputId', type: 'string', defaultValue: "''", description: 'Native input ID.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native form field name.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Native placeholder text.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'current-password'", description: 'Password-manager and browser autofill hint.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible label exists.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of visible elements that label the field.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
    { name: 'size', type: 'AerisPasswordSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisPasswordAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'minLength', type: 'number', defaultValue: '8', description: 'Native minimum length and default feedback requirement.' },
    { name: 'maxLength', type: 'number | undefined', defaultValue: 'undefined', description: 'Optional native maximum length.' },
    { name: 'toggleMask', type: 'boolean', defaultValue: 'true', description: 'Shows the visibility toggle.' },
    { name: 'feedback', type: 'boolean', defaultValue: 'true', description: 'Shows the strength panel while focus remains in the component.' },
    { name: 'showRequirements', type: 'boolean', defaultValue: 'true', description: 'Shows default requirement progress in the feedback panel.' },
    { name: 'strengthEvaluator', type: 'AerisPasswordStrengthEvaluator', defaultValue: 'evaluateAerisPassword', description: 'Replaces the default presentation-oriented strength policy.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear suffix action while editable content exists.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear password'", description: 'Accessible name for the clear action.' },
    { name: 'showPasswordAriaLabel', type: 'string', defaultValue: 'localized label', description: 'Accessible name for showing the password.' },
    { name: 'hidePasswordAriaLabel', type: 'string', defaultValue: 'localized label', description: 'Accessible name for hiding the password.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and native form submission.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Makes the native input read-only.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required validation semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline space.' },
  ];

  protected readonly companyPolicy = (
    value: string,
    minLength: number,
  ): AerisPasswordStrengthResult => {
    const requirements = [
      { label: `At least ${minLength} characters`, met: value.length >= minLength },
      { label: 'Starts with AER-', met: value.startsWith('AER-') },
      { label: 'Contains a number', met: /\d/.test(value) },
    ];
    const met = requirements.filter((item) => item.met).length;
    const score = met === 3 ? 3 : met >= 2 ? 2 : value ? 1 : 0;
    const strength = score === 3 ? 'strong' : score === 2 ? 'medium' : score === 1 ? 'weak' : 'empty';
    return {
      score,
      strength,
      label: score === 3 ? 'Policy satisfied' : 'Policy requirements',
      requirements,
    };
  };
}
