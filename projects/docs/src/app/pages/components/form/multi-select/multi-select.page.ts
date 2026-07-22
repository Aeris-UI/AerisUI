import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisMultiSelect,
  type AerisMultiSelectChangeEvent,
  type AerisMultiSelectLazyLoadEvent,
  type AerisSelectOption,
} from '@aeris-ui/core/multi-select';
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
  selector: 'app-multi-select-page',
  imports: [
    AerisMultiSelect,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './multi-select.page.html',
  styleUrl: './multi-select.page.scss',
})
export class MultiSelectPage {
  protected readonly skills = signal<readonly string[]>(['angular', 'typescript']);
  protected readonly chipSkills = signal<readonly string[]>(['angular', 'accessibility']);
  protected readonly countries = signal<readonly string[]>(['rs', 'at']);
  protected readonly teams = signal<readonly string[]>(['design']);
  protected readonly limitedSkills = signal<readonly string[]>([]);
  protected readonly virtualValues = signal<readonly string[]>([]);
  protected readonly invalidValues = signal<readonly string[]>([]);
  protected readonly lastChange = signal('No interaction');
  protected readonly virtualRange = signal('No range requested');
  protected readonly reactiveSkills = new FormControl<readonly string[]>(['angular']);
  protected templateSkills: readonly string[] = ['typescript'];

  protected readonly skillOptions: readonly AerisSelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Accessibility', value: 'accessibility' },
    { label: 'Design systems', value: 'design-systems' },
    { label: 'Performance', value: 'performance' },
    { label: 'Legacy platform', value: 'legacy', disabled: true },
  ];

  protected readonly countryOptions: readonly AerisSelectOption[] = [
    { label: 'Austria', value: 'at', group: 'Europe' },
    { label: 'Germany', value: 'de', group: 'Europe' },
    { label: 'Serbia', value: 'rs', group: 'Europe' },
    { label: 'Canada', value: 'ca', group: 'North America' },
    { label: 'Mexico', value: 'mx', group: 'North America' },
    { label: 'Japan', value: 'jp', group: 'Asia Pacific' },
  ];

  protected readonly richOptions: readonly AerisSelectOption[] = [
    { label: 'Design system', value: 'design', description: 'Builds shared UI foundations' },
    { label: 'Web platform', value: 'platform', description: 'Owns application infrastructure' },
    { label: 'Accessibility', value: 'a11y', description: 'Reviews inclusive interaction' },
  ];

  protected readonly largeOptions: readonly AerisSelectOption[] = Array.from(
    { length: 1000 },
    (_, index) => ({
      label: `Workspace ${String(index + 1).padStart(4, '0')}`,
      value: `workspace-${index + 1}`,
    }),
  );

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'multi-select-basic', label: 'Basic' },
    { id: 'multi-select-chips', label: 'Chips' },
    { id: 'multi-select-filter', label: 'Filtering' },
    { id: 'multi-select-groups', label: 'Groups' },
    { id: 'multi-select-descriptions', label: 'Descriptions' },
    { id: 'multi-select-templates', label: 'Templates' },
    { id: 'multi-select-select-all', label: 'Select all' },
    { id: 'multi-select-limit', label: 'Selection limit' },
    { id: 'multi-select-virtual', label: 'Virtual scrolling' },
    { id: 'multi-select-sizes', label: 'Sizes' },
    { id: 'multi-select-states', label: 'States' },
    { id: 'multi-select-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'multi-select-api-inputs', label: 'Inputs' },
    { id: 'multi-select-api-outputs', label: 'Outputs' },
    { id: 'multi-select-api-templates', label: 'Templates' },
    { id: 'multi-select-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisMultiSelect, type AerisSelectOption } from '@aeris-ui/core/multi-select';`;

  protected readonly optionsCode = `protected readonly skills =
  signal<readonly string[]>(['angular', 'typescript']);

protected readonly skillOptions: readonly AerisSelectOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Accessibility', value: 'accessibility' },
  { label: 'Design systems', value: 'design-systems' },
  { label: 'Performance', value: 'performance' },
];`;

  protected readonly groupCode = `protected readonly countries =
  signal<readonly string[]>(['rs', 'at']);

protected readonly countryOptions: readonly AerisSelectOption[] = [
  { label: 'Austria', value: 'at', group: 'Europe' },
  { label: 'Serbia', value: 'rs', group: 'Europe' },
  { label: 'Canada', value: 'ca', group: 'North America' },
];`;

  protected readonly richCode = `protected readonly richOptions:
  readonly AerisSelectOption[] = [
    {
      label: 'Design system',
      value: 'design',
      description: 'Builds shared UI foundations',
    },
  ];`;

  protected readonly templateCssCode = `.team-option {
  display: grid;
  gap: 0.125rem;
}

.team-option small {
  color: var(--text-2);
}`;

  protected readonly virtualCode = `protected readonly virtualValues =
  signal<readonly string[]>([]);

protected readonly largeOptions: readonly AerisSelectOption[] =
  Array.from({ length: 1000 }, (_, index) => ({
    label: \`Workspace \${String(index + 1).padStart(4, '0')}\`,
    value: \`workspace-\${index + 1}\`,
  }));

protected recordLazyRange(event: AerisMultiSelectLazyLoadEvent): void {
  this.virtualRange.set(\`Requested \${event.first}-\${event.last}\`);
}`;

  protected readonly formsCode = `protected readonly reactiveSkills =
  new FormControl<readonly string[]>(['angular']);

protected templateSkills: readonly string[] = ['typescript'];`;

  protected readonly interfacesCode = `type AerisMultiSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisMultiSelectAppearance = 'outline' | 'filled';
type AerisMultiSelectDisplay = 'summary' | 'chips';

interface AerisSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisMultiSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: readonly string[];
  readonly option: AerisSelectOption | null;
  readonly selected: boolean;
}

interface AerisMultiSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisMultiSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'options', type: 'readonly AerisSelectOption[]', defaultValue: 'required', description: 'Available options in display order.' },
    { name: 'value', type: 'readonly string[] (model)', defaultValue: '[]', description: 'Selected option values with two-way binding and Forms support.' },
    { name: 'inputId', type: 'string', defaultValue: "''", description: 'Visible-label association.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Optional HTML form field name.' },
    { name: 'valueSeparator', type: 'string', defaultValue: "','", description: 'Separator used by the hidden HTML form value.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Select options'", description: 'Text displayed when no option is selected.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible label exists.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of visible elements that label the field.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
    { name: 'listboxAriaLabel', type: 'string', defaultValue: "'Options'", description: 'Accessible name for the multi-select listbox.' },
    { name: 'size', type: 'AerisMultiSelectSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisMultiSelectAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'display', type: 'AerisMultiSelectDisplay', defaultValue: "'summary'", description: 'Displays a text summary or removable chips.' },
    { name: 'selectedItemsLabel', type: 'string', defaultValue: "'{0} items selected'", description: 'Summary used after the visible label threshold.' },
    { name: 'maxSelectedLabels', type: 'number', defaultValue: '3', description: 'Maximum labels or chips shown before a count is used.' },
    { name: 'selectionLimit', type: 'number | undefined', defaultValue: 'undefined', description: 'Maximum number of selected values.' },
    { name: 'selectionLimitMessage', type: 'string', defaultValue: "'Selection limit reached'", description: 'Status text shown when the limit is reached.' },
    { name: 'showSelectAll', type: 'boolean', defaultValue: 'true', description: 'Shows the filtered select-all action.' },
    { name: 'selectAllLabel', type: 'string', defaultValue: "'Select all'", description: 'Visible label for the select-all action.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows the clear suffix button.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear selections'", description: 'Accessible name for the clear suffix button.' },
    { name: 'filter', type: 'boolean', defaultValue: 'false', description: 'Adds a search field to the panel.' },
    { name: 'filterValue', type: 'string (model)', defaultValue: "''", description: 'Controlled filter query.' },
    { name: 'filterMatchMode', type: 'contains | startsWith | endsWith | equals', defaultValue: "'contains'", description: 'Local matching strategy.' },
    { name: 'filterFields', type: "readonly ('label' | 'description' | 'group')[]", defaultValue: "['label']", description: 'Option fields included in filtering.' },
    { name: 'filterLocale', type: 'string | undefined', defaultValue: 'undefined', description: 'Locale used for case normalization.' },
    { name: 'filterPlaceholder', type: 'string', defaultValue: "'Search options'", description: 'Visible filter placeholder.' },
    { name: 'filterAriaLabel', type: 'string', defaultValue: "'Search options'", description: 'Accessible name for the filter field.' },
    { name: 'filterClearAriaLabel', type: 'string', defaultValue: "'Clear search'", description: 'Accessible name for clearing the filter.' },
    { name: 'resetFilterOnClose', type: 'boolean', defaultValue: 'true', description: 'Clears the filter when the panel closes.' },
    { name: 'autofocusFilter', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the filter field when opened.' },
    { name: 'emptyMessage', type: 'string', defaultValue: 'localized text', description: 'Message shown when no options exist.' },
    { name: 'emptyFilterMessage', type: 'string', defaultValue: 'localized text', description: 'Message shown when filtering returns no matches.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows a busy state.' },
    { name: 'loadingMessage', type: 'string', defaultValue: "'Loading options'", description: 'Status text shown while loading.' },
    { name: 'panelMaxHeight', type: 'string', defaultValue: "'18rem'", description: 'Maximum scrollable list height.' },
    { name: 'virtualScroll', type: 'boolean', defaultValue: 'false', description: 'Renders a window of a large flat option list.' },
    { name: 'virtualItemSize', type: 'number', defaultValue: '40', description: 'Virtual row height.' },
    { name: 'virtualBuffer', type: 'number', defaultValue: '4', description: 'Virtual overscan count.' },
    { name: 'lazy', type: 'boolean', defaultValue: 'false', description: 'Emits requested virtual viewport ranges.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'false', description: 'Closes the panel after each selection.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and native form submission.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required validation semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline space.' },
  ];

  protected recordChange(event: AerisMultiSelectChangeEvent): void {
    this.lastChange.set(
      event.option
        ? `${event.selected ? 'Selected' : 'Removed'} ${event.option.label}`
        : 'Selection changed',
    );
  }

  protected recordLazyRange(event: AerisMultiSelectLazyLoadEvent): void {
    this.virtualRange.set(`Requested ${event.first}-${event.last}`);
  }
}
