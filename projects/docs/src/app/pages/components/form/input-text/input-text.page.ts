import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon } from '@lucide/angular';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-input-text-page',
  imports: [
    AerisButton,
    AerisInputText,
    LucideDynamicIcon,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './input-text.page.html',
  styleUrl: './input-text.page.scss',
})
export class InputTextPage {
  protected readonly icons = DOC_ICONS;
  protected readonly name = signal('');
  protected readonly search = signal('Aeris components');
  protected readonly reactiveText = new FormControl('Reactive value');
  protected templateText = 'Template value';
  protected readonly email = signal('alex@');
  protected readonly emailTouched = signal(false);
  protected readonly emailInvalid = computed(
    () => this.emailTouched() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'input-basic', label: 'Basic' },
    { id: 'input-types', label: 'Input types' },
    { id: 'input-sizes', label: 'Sizes' },
    { id: 'input-appearances', label: 'Appearances' },
    { id: 'input-states', label: 'States' },
    { id: 'input-validation', label: 'Validation' },
    { id: 'input-fluid', label: 'Fluid layout' },
    { id: 'input-affixes', label: 'Icons and affixes' },
    { id: 'input-signals', label: 'Signal state' },
    { id: 'input-clearable', label: 'Clear button' },
    { id: 'input-angular-forms', label: 'Angular Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'input-api-inputs', label: 'Inputs' },
    { id: 'input-api-native', label: 'Native API' },
    { id: 'input-api-wrapper', label: 'Wrapper inputs' },
  ];

  protected readonly importCode =
    `import { AerisInputText } from '@aeris-ui/core/input-text';`;
  protected readonly signalCode = `protected readonly name = signal('');

protected updateName(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.name.set(input.value);
}`;
  protected readonly formsCode = `protected readonly reactiveText =
  new FormControl('Reactive value');

protected templateText = 'Template value';`;
  protected readonly validationCode = `protected readonly email = signal('alex@');
protected readonly emailTouched = signal(false);
protected readonly emailInvalid = computed(
  () =>
    this.emailTouched() &&
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.email()),
);`;
  protected readonly affixCssCode = `.input-affix {
  display: flex;
  align-items: center;
  border: 1px solid var(--aeris-border-strong);
  border-radius: var(--aeris-radius-sm);
}

.input-affix:focus-within {
  border-color: var(--aeris-focus);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--aeris-focus) 18%, transparent);
}

.input-affix input {
  width: 100%;
  border: 0;
  background: transparent;
  box-shadow: none;
}`;
  protected readonly interfacesCode = `type AerisInputTextSize = 'xs' | 'sm' | 'md' | 'lg';

type AerisInputTextAppearance = 'outline' | 'filled';

// Deprecated compatibility alias
type AerisControlSize = AerisInputTextSize;`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'size',
      type: 'AerisInputTextSize',
      defaultValue: "'md'",
      description: 'Sets the input height, padding, and font size.',
    },
    {
      name: 'appearance',
      type: 'AerisInputTextAppearance',
      defaultValue: "'outline'",
      description: 'Selects an outlined or filled surface treatment.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Applies invalid styling and synchronizes aria-invalid.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Expands the native input to fill its available inline space.',
    },
  ];
  protected readonly componentInputs: readonly ApiRow[] = [
    { name: 'value', type: 'string (model)', defaultValue: "''", description: 'Text value with two-way binding and Signal Forms compatibility.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the internal native input.' },
    { name: 'type', type: 'string', defaultValue: "'text'", description: 'Native input type.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Native placeholder text.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'off'", description: 'Native autocomplete hint.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when no visible label is associated.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of elements that label the input.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help or validation messages.' },
    ...this.inputs,
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and clear action.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Allows focus and selection without editing.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required semantics.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows an inline clear button while a value is present.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear value'", description: 'Accessible name for the clear button.' },
  ];

  protected updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected updateEmail(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  protected clearSearch(input: HTMLInputElement): void {
    input.value = '';
    input.focus();
  }
}
