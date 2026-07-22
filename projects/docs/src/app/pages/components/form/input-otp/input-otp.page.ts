import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisInputOtp,
  type AerisInputOtpCompleteEvent,
} from '@aeris-ui/core/input-otp';
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
  selector: 'app-input-otp-page',
  imports: [
    AerisInputOtp,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './input-otp.page.html',
  styleUrl: './input-otp.page.scss',
})
export class InputOtpPage {
  protected readonly code = signal('');
  protected readonly sixDigitCode = signal('');
  protected readonly alphanumericCode = signal('A2');
  protected readonly maskedCode = signal('42');
  protected readonly groupedCode = signal('');
  protected readonly completedValue = signal('Not completed');
  protected readonly invalidCode = signal('');
  protected readonly touched = signal(false);
  protected readonly codeInvalid = computed(
    () => this.touched() && this.invalidCode().length !== 4,
  );
  protected readonly reactiveCode = new FormControl('1234');
  protected templateCode = '9876';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'otp-basic', label: 'Basic' },
    { id: 'otp-length', label: 'Length' },
    { id: 'otp-alphanumeric', label: 'Alphanumeric' },
    { id: 'otp-mask', label: 'Masking' },
    { id: 'otp-separator', label: 'Separator template' },
    { id: 'otp-paste', label: 'Paste and completion' },
    { id: 'otp-focus', label: 'Focus behavior' },
    { id: 'otp-sizes', label: 'Sizes' },
    { id: 'otp-states', label: 'States' },
    { id: 'otp-validation', label: 'Validation' },
    { id: 'otp-native-form', label: 'HTML form value' },
    { id: 'otp-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'otp-api-inputs', label: 'Inputs' },
    { id: 'otp-api-outputs', label: 'Outputs' },
    { id: 'otp-api-templates', label: 'Templates' },
    { id: 'otp-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisInputOtp } from '@aeris-ui/core/input-otp';`;

  protected readonly modelCode = `protected readonly code = signal('');`;

  protected readonly completeCode = `protected readonly completedValue =
  signal('Not completed');

protected handleComplete(event: AerisInputOtpCompleteEvent): void {
  this.completedValue.set(event.value);
}`;

  protected readonly validationCode = `protected readonly invalidCode = signal('');
protected readonly touched = signal(false);
protected readonly codeInvalid = computed(
  () => this.touched() && this.invalidCode().length !== 4,
);`;

  protected readonly formsCode = `protected readonly reactiveCode =
  new FormControl('1234');

protected templateCode = '9876';`;

  protected readonly separatorCssCode = `.otp-separator {
  color: var(--text-2);
  font-weight: 700;
}`;

  protected readonly interfacesCode = `type AerisInputOtpSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputOtpAppearance = 'outline' | 'filled';
type AerisInputOtpMode = 'numeric' | 'alphanumeric';

interface AerisInputOtpCompleteEvent {
  readonly originalEvent: Event;
  readonly value: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string (model)', defaultValue: "''", description: 'Accepted OTP characters with two-way binding and Forms support.' },
    { name: 'length', type: 'number', defaultValue: '4', description: 'Number of rendered character slots.' },
    { name: 'mode', type: 'numeric | alphanumeric', defaultValue: "'numeric'", description: 'Accepted character set and mobile keyboard hint.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the first slot for optional direct label association.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Creates a hidden native form value containing the complete current string.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'one-time-code'", description: 'Autocomplete hint applied to the first slot.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible group name when no visible label exists.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of visible elements that label the complete group.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages for the group.' },
    { name: 'slotAriaLabel', type: 'string', defaultValue: "'Character {0} of {1}'", description: 'Localized accessible label pattern for each slot.' },
    { name: 'size', type: 'AerisInputOtpSize', defaultValue: "'md'", description: 'Slot dimensions and typography size.' },
    { name: 'appearance', type: 'AerisInputOtpAppearance', defaultValue: "'outline'", description: 'Outlined or filled slot treatment.' },
    { name: 'mask', type: 'boolean', defaultValue: 'false', description: 'Masks each entered character using password input rendering.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: 'Focuses the first slot after the component renders.' },
    { name: 'selectOnFocus', type: 'boolean', defaultValue: 'true', description: 'Selects an existing slot value when that slot receives focus.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and native form submission.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Makes the slots read-only.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required validation semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline space.' },
  ];

  protected handleComplete(event: AerisInputOtpCompleteEvent): void {
    this.completedValue.set(event.value);
  }
}
