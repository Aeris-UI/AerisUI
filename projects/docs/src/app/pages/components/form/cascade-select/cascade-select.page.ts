import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisCascadeSelect,
  type AerisCascadeSelectChangeEvent,
  type AerisCascadeSelectOption,
} from '@aeris-ui/core/cascade-select';
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
  selector: 'app-cascade-select-page',
  imports: [
    AerisCascadeSelect,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './cascade-select.page.html',
  styleUrl: './cascade-select.page.scss',
})
export class CascadeSelectPage {
  protected readonly locationValue = signal<string | null>(null);
  protected readonly branchValue = signal<string | null>(null);
  protected readonly invalidValue = signal<string | null>(null);
  protected readonly touched = signal(false);
  protected readonly lastEvent = signal('No selection yet');
  protected readonly reactiveLocation = new FormControl<string | null>('lisbon');
  protected templateLocation: string | null = 'belgrade';
  protected readonly invalid = computed(() => this.touched() && this.invalidValue() === null);

  protected readonly locations: readonly AerisCascadeSelectOption[] = [
    {
      label: 'Europe',
      value: 'europe',
      children: [
        {
          label: 'Portugal',
          value: 'portugal',
          children: [
            { label: 'Lisbon', value: 'lisbon', description: 'Capital city' },
            { label: 'Porto', value: 'porto' },
          ],
        },
        {
          label: 'Serbia',
          value: 'serbia',
          children: [
            { label: 'Belgrade', value: 'belgrade', description: 'Aeris docs timezone' },
            { label: 'Novi Sad', value: 'novi-sad' },
          ],
        },
      ],
    },
    {
      label: 'North America',
      value: 'north-america',
      children: [
        {
          label: 'United States',
          value: 'united-states',
          children: [
            { label: 'Austin', value: 'austin' },
            { label: 'San Francisco', value: 'san-francisco' },
          ],
        },
        {
          label: 'Canada',
          value: 'canada',
          children: [
            { label: 'Toronto', value: 'toronto' },
            { label: 'Vancouver', value: 'vancouver', disabled: true },
          ],
        },
      ],
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'cascade-basic', label: 'Basic' },
    { id: 'cascade-signal', label: 'Signal value' },
    { id: 'cascade-branches', label: 'Branch selection' },
    { id: 'cascade-templates', label: 'Templates' },
    { id: 'cascade-clear', label: 'Clear button' },
    { id: 'cascade-states', label: 'States' },
    { id: 'cascade-sizes', label: 'Sizes' },
    { id: 'cascade-forms', label: 'Angular Forms' },
    { id: 'cascade-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'cascade-api-inputs', label: 'Inputs' },
    { id: 'cascade-api-outputs', label: 'Outputs' },
    { id: 'cascade-api-methods', label: 'Methods' },
    { id: 'cascade-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';`;

  protected readonly optionsCode = `protected readonly locations: readonly AerisCascadeSelectOption[] = [
  {
    label: 'Europe',
    value: 'europe',
    children: [
      {
        label: 'Portugal',
        value: 'portugal',
        children: [
          { label: 'Lisbon', value: 'lisbon', description: 'Capital city' },
          { label: 'Porto', value: 'porto' },
        ],
      },
    ],
  },
];`;

  protected readonly signalCode = `protected readonly locationValue = signal<string | null>(null);`;

  protected readonly formsCode = `protected readonly reactiveLocation =
  new FormControl<string | null>('lisbon');

protected templateLocation: string | null = 'belgrade';`;

  protected readonly validationCode = `protected readonly invalidValue = signal<string | null>(null);
protected readonly touched = signal(false);
protected readonly invalid = computed(
  () => this.touched() && this.invalidValue() === null,
);`;

  protected readonly eventsCode = `protected readonly lastEvent = signal('No selection yet');

protected recordChange(event: AerisCascadeSelectChangeEvent): void {
  const path = event.path.map((option) => option.label).join(' / ');
  this.lastEvent.set(path ? \`Selected \${path}\` : 'Selection cleared');
}`;

  protected readonly interfacesCode = `type AerisCascadeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisCascadeSelectAppearance = 'outline' | 'filled';

interface AerisCascadeSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly children?: readonly AerisCascadeSelectOption[];
}

interface AerisCascadeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string | null;
  readonly option: AerisCascadeSelectOption | null;
  readonly path: readonly AerisCascadeSelectOption[];
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string | null (model)', defaultValue: 'null', description: 'Selected option value with two-way binding and Forms support.' },
    { name: 'options', type: 'readonly AerisCascadeSelectOption[]', defaultValue: '[]', description: 'Hierarchical option tree rendered by the cascading columns.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the trigger button.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native form field name submitted through a hidden input when a value is selected.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Select an option'", description: 'Text shown while no value is selected.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when no visible label is available.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of visible elements that label the trigger.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear value'", description: 'Accessible name for the clear button.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No options available'", description: 'Message shown when the options tree is empty.' },
    { name: 'size', type: 'AerisCascadeSelectSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisCascadeSelectAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'separator', type: 'string', defaultValue: "' / '", description: 'Text used between labels in the selected path.' },
    { name: 'panelMaxHeight', type: 'string', defaultValue: "'18rem'", description: 'Maximum dropdown panel height.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and form submission.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes required semantics to forms and assistive technology.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline space.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear action while a value exists.' },
    { name: 'selectBranches', type: 'boolean', defaultValue: 'false', description: 'Allows branch options with children to be selected instead of only opening the next level.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'string | null', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'changed', type: 'AerisCascadeSelectChangeEvent', defaultValue: '-', description: 'Emitted after selection or clearing changes the value.' },
    { name: 'cleared', type: 'void', defaultValue: '-', description: 'Emitted after the clear action succeeds.' },
    { name: 'opened', type: 'void', defaultValue: '-', description: 'Emitted when the panel opens.' },
    { name: 'closed', type: 'void', defaultValue: '-', description: 'Emitted when the panel closes.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the trigger receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the trigger loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the trigger button.' },
    { name: 'openPanel()', type: 'void', defaultValue: '-', description: 'Opens the cascading panel and syncs the active path.' },
    { name: 'closePanel()', type: 'void', defaultValue: '-', description: 'Closes the cascading panel.' },
    { name: 'toggle()', type: 'void', defaultValue: '-', description: 'Toggles the panel.' },
    { name: 'clear()', type: 'void', defaultValue: '-', description: 'Clears the selected value and restores focus.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Clears the value and closes the panel.' },
  ];

  protected recordChange(event: AerisCascadeSelectChangeEvent): void {
    const path = event.path.map((option) => option.label).join(' / ');
    this.lastEvent.set(path ? `Selected ${path}` : 'Selection cleared');
  }
}
