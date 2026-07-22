import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
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
  selector: 'app-input-number-page',
  imports: [
    AerisInputNumber,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './input-number.page.html',
  styleUrl: './input-number.page.scss',
})
export class InputNumberPage {
  protected readonly quantity = signal<number | null>(4);
  protected readonly price = signal<number | null>(1299.5);
  protected readonly percentage = signal<number | null>(72);
  protected readonly reactiveNumber = new FormControl<number | null>(24);
  protected templateNumber: number | null = 12;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'number-basic', label: 'Basic' },
    { id: 'number-decimals', label: 'Decimals' },
    { id: 'number-currency', label: 'Currency' },
    { id: 'number-locale', label: 'Locales' },
    { id: 'number-affixes', label: 'Prefix and suffix' },
    { id: 'number-buttons', label: 'Button layouts' },
    { id: 'number-clearable', label: 'Clear button' },
    { id: 'number-bounds', label: 'Min and max' },
    { id: 'number-sizes', label: 'Sizes' },
    { id: 'number-states', label: 'States' },
    { id: 'number-fluid', label: 'Fluid layout' },
    { id: 'number-signals', label: 'Signal Forms contract' },
    { id: 'number-angular-forms', label: 'Angular Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'number-api-inputs', label: 'Inputs' },
    { id: 'number-api-outputs', label: 'Outputs' },
    { id: 'number-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisInputNumber } from '@aeris-ui/core/input-number';`;
  protected readonly signalCode = `protected readonly quantity = signal<number | null>(4);

// The value model also satisfies Angular 22 Signal Forms'
// FormValueControl<number | null> contract.
`;
  protected readonly formsCode = `protected readonly reactiveNumber =
  new FormControl<number | null>(24);

protected templateNumber: number | null = 12;`;
  protected readonly interfacesCode = `type AerisInputNumberSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputNumberAppearance = 'outline' | 'filled';
type AerisInputNumberMode = 'decimal' | 'currency';
type AerisInputNumberButtonLayout =
  | 'stacked'
  | 'horizontal'
  | 'vertical';
type AerisInputNumberCurrencyDisplay =
  | 'symbol'
  | 'narrowSymbol'
  | 'code'
  | 'name';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'number | null (model)', defaultValue: 'null', description: 'Numeric value with two-way binding and Signal Forms compatibility.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the internal native input.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Native placeholder text.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'off'", description: 'Native autocomplete hint.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when a visible label cannot be associated.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of elements that label the input.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'BCP 47 locale used by Intl.NumberFormat.' },
    { name: 'mode', type: "'decimal' | 'currency'", defaultValue: "'decimal'", description: 'Number formatting mode.' },
    { name: 'currency', type: 'string', defaultValue: "'USD'", description: 'ISO 4217 currency code used in currency mode.' },
    { name: 'currencyDisplay', type: 'AerisInputNumberCurrencyDisplay', defaultValue: "'symbol'", description: 'Currency label style.' },
    { name: 'prefix', type: 'string', defaultValue: "''", description: 'Text displayed before the editable value.' },
    { name: 'suffix', type: 'string', defaultValue: "''", description: 'Text displayed after the editable value.' },
    { name: 'min', type: 'number | undefined', defaultValue: 'undefined', description: 'Minimum committed and stepped value.' },
    { name: 'max', type: 'number | undefined', defaultValue: 'undefined', description: 'Maximum committed and stepped value.' },
    { name: 'step', type: 'number', defaultValue: '1', description: 'Increment used by buttons and arrow keys.' },
    { name: 'minFractionDigits', type: 'number | undefined', defaultValue: 'undefined', description: 'Minimum displayed fraction digits.' },
    { name: 'maxFractionDigits', type: 'number | undefined', defaultValue: 'undefined', description: 'Maximum displayed fraction digits.' },
    { name: 'useGrouping', type: 'boolean', defaultValue: 'true', description: 'Displays locale grouping separators.' },
    { name: 'allowEmpty', type: 'boolean', defaultValue: 'true', description: 'Allows the model to become null when cleared.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows an inline suffix button while a value is present.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear value'", description: 'Accessible name for the clear button.' },
    { name: 'showButtons', type: 'boolean', defaultValue: 'false', description: 'Shows increment and decrement controls.' },
    { name: 'buttonLayout', type: 'AerisInputNumberButtonLayout', defaultValue: "'stacked'", description: 'Positions the step controls.' },
    { name: 'buttonTabIndex', type: 'number', defaultValue: '-1', description: 'Tab index for step buttons; the input remains the primary tab stop.' },
    { name: 'incrementButtonAriaLabel', type: 'string', defaultValue: "'Increase value'", description: 'Accessible name for increment.' },
    { name: 'decrementButtonAriaLabel', type: 'string', defaultValue: "'Decrease value'", description: 'Accessible name for decrement.' },
    { name: 'size', type: 'AerisInputNumberSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisInputNumberAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables all interaction.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Allows focus and selection without editing.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes required semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
  ];
}
