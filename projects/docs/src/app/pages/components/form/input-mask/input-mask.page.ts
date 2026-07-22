import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputMask } from '@aeris-ui/core/input-mask';
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
  selector: 'app-input-mask-page',
  imports: [
    AerisInputMask,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './input-mask.page.html',
  styleUrl: './input-mask.page.scss',
})
export class InputMaskPage {
  protected readonly phone = signal('');
  protected readonly rawPhone = signal('');
  protected readonly serial = signal('AE42UI');
  protected readonly completedValue = signal('Not completed');
  protected readonly reactiveMask = new FormControl('123-456');
  protected templateMask = '987-654';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'mask-basic', label: 'Basic' },
    { id: 'mask-patterns', label: 'Mask tokens' },
    { id: 'mask-placeholder', label: 'Placeholder and slots' },
    { id: 'mask-unmasked', label: 'Unmasked value' },
    { id: 'mask-complete', label: 'Completion' },
    { id: 'mask-auto-clear', label: 'Auto clear' },
    { id: 'mask-clearable', label: 'Clear button' },
    { id: 'mask-sizes', label: 'Sizes' },
    { id: 'mask-states', label: 'States' },
    { id: 'mask-fluid', label: 'Fluid layout' },
    { id: 'mask-signals', label: 'Signal Forms contract' },
    { id: 'mask-angular-forms', label: 'Angular Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'mask-api-inputs', label: 'Inputs' },
    { id: 'mask-api-outputs', label: 'Outputs' },
    { id: 'mask-api-methods', label: 'Methods' },
    { id: 'mask-api-grammar', label: 'Mask grammar' },
  ];

  protected readonly importCode =
    `import { AerisInputMask } from '@aeris-ui/core/input-mask';`;
  protected readonly signalCode = `protected readonly phone = signal('');

// The value model structurally satisfies Angular 22 Signal Forms'
// FormValueControl<string> contract.
`;
  protected readonly formsCode = `protected readonly reactiveMask =
  new FormControl('123-456');

protected templateMask = '987-654';`;
  protected readonly completeCode = `protected readonly completedValue = signal('Not completed');

protected handleComplete(value: string): void {
  this.completedValue.set(value);
}`;
  protected readonly interfacesCode = `type AerisInputMaskSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputMaskAppearance = 'outline' | 'filled';

// Mask grammar
// 9  Unicode digit
// a  Unicode letter
// *  Unicode letter or digit
// \\  Escape the next mask character`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string (model)', defaultValue: "''", description: 'Formatted or raw value, depending on unmask.' },
    { name: 'mask', type: 'string', defaultValue: 'required', description: 'Mask grammar applied to user input.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the internal input.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Custom placeholder that overrides the generated mask placeholder.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'off'", description: 'Native autocomplete hint.' },
    { name: 'inputMode', type: 'string', defaultValue: "'text'", description: 'Virtual keyboard hint such as tel or numeric.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when no visible label is associated.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of elements that label the input.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'slotChar', type: 'string', defaultValue: "'_'", description: 'Character used for empty mask slots.' },
    { name: 'showMask', type: 'boolean', defaultValue: 'false', description: 'Displays all literals and empty slots in the field.' },
    { name: 'unmask', type: 'boolean', defaultValue: 'false', description: 'Stores only accepted slot characters in the value model.' },
    { name: 'autoClear', type: 'boolean', defaultValue: 'false', description: 'Clears incomplete input when focus leaves the field.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows an inline clear button while a value is present.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear value'", description: 'Accessible name for the clear button.' },
    { name: 'size', type: 'AerisInputMaskSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisInputMaskAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables input and clear interaction.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Allows focus and selection without editing.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
  ];
}
