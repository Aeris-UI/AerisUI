import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisSelect,
  type AerisSelectChangeEvent,
  type AerisSelectLazyLoadEvent,
  type AerisSelectOption,
} from '@aeris-ui/core/select';
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
  selector: 'app-select-page',
  imports: [
    AerisSelect,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './select.page.html',
  styleUrl: './select.page.scss',
})
export class SelectPage {
  protected readonly role = signal<string | null>('engineer');
  protected readonly country = signal<string | null>(null);
  protected readonly invalidRole = signal<string | null>(null);
  protected readonly team = signal<string | null>('design');
  protected readonly clearableRole = signal<string | null>('designer');
  protected readonly editableRole = signal<string | null>('Custom specialist');
  protected readonly virtualRole = signal<string | null>(null);
  protected readonly virtualRange = signal('No range requested');
  protected readonly lastChange = signal('No interaction');
  protected readonly roleInvalid = computed(() => this.invalidRole() === null);
  protected readonly reactiveRole = new FormControl<string | null>('engineer');
  protected templateRole: string | null = 'designer';

  protected readonly roles: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Software engineer', value: 'engineer' },
    { label: 'Product manager', value: 'manager' },
    { label: 'Quality engineer', value: 'quality', disabled: true },
  ];
  protected readonly richRoles: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer', description: 'Designs product workflows and interfaces' },
    { label: 'Software engineer', value: 'engineer', description: 'Builds and maintains applications' },
    { label: 'Product manager', value: 'manager', description: 'Coordinates strategy and delivery' },
  ];

  protected readonly countries: readonly AerisSelectOption[] = [
    { label: 'Austria', value: 'at', group: 'Europe' },
    { label: 'Germany', value: 'de', group: 'Europe' },
    { label: 'Serbia', value: 'rs', group: 'Europe' },
    { label: 'Canada', value: 'ca', group: 'North America' },
    { label: 'Mexico', value: 'mx', group: 'North America' },
    { label: 'United States', value: 'us', group: 'North America' },
    { label: 'Japan', value: 'jp', group: 'Asia Pacific' },
    { label: 'New Zealand', value: 'nz', group: 'Asia Pacific' },
    { label: 'Singapore', value: 'sg', group: 'Asia Pacific' },
  ];

  protected readonly teams: readonly AerisSelectOption[] = [
    { label: 'Design system', value: 'design' },
    { label: 'Web platform', value: 'platform' },
    { label: 'Accessibility', value: 'a11y' },
  ];
  protected readonly largeOptions: readonly AerisSelectOption[] = Array.from(
    { length: 1000 },
    (_, index) => ({
      label: `Workspace ${String(index + 1).padStart(4, '0')}`,
      value: `workspace-${index + 1}`,
    }),
  );

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'select-basic', label: 'Basic' },
    { id: 'select-model', label: 'Signal model' },
    { id: 'select-checkmark', label: 'Selection mark' },
    { id: 'select-editable', label: 'Editable value' },
    { id: 'select-filter', label: 'Filtering' },
    { id: 'select-filter-options', label: 'Filter options' },
    { id: 'select-groups', label: 'Groups' },
    { id: 'select-descriptions', label: 'Option descriptions' },
    { id: 'select-templates', label: 'Templates' },
    { id: 'select-panel-content', label: 'Panel content' },
    { id: 'select-virtual-scroll', label: 'Virtual scrolling' },
    { id: 'select-clearable', label: 'Clear button' },
    { id: 'select-sizes', label: 'Sizes' },
    { id: 'select-states', label: 'Appearances and states' },
    { id: 'select-feedback', label: 'Loading and empty' },
    { id: 'select-native-form', label: 'Native form value' },
    { id: 'select-angular-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'select-api-inputs', label: 'Inputs' },
    { id: 'select-api-outputs', label: 'Outputs' },
    { id: 'select-api-templates', label: 'Templates' },
    { id: 'select-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';`;
  protected readonly modelCode = `protected readonly role = signal<string | null>('engineer');

protected readonly roles: readonly AerisSelectOption[] = [
  { label: 'Product designer', value: 'designer' },
  { label: 'Software engineer', value: 'engineer' },
  { label: 'Product manager', value: 'manager' },
];`;
  protected readonly groupedCode = `protected readonly country =
  signal<string | null>(null);

protected readonly countries: readonly AerisSelectOption[] = [
  { label: 'Austria', value: 'at', group: 'Europe' },
  { label: 'Canada', value: 'ca', group: 'North America' },
  { label: 'Japan', value: 'jp', group: 'Asia Pacific' },
];`;
  protected readonly richOptionsCode = `protected readonly richRoles:
  readonly AerisSelectOption[] = [
    {
      label: 'Product designer',
      value: 'designer',
      description: 'Designs product workflows and interfaces',
    },
  ];`;
  protected readonly templateCode = `protected readonly team =
  signal<string | null>('design');

protected readonly teams: readonly AerisSelectOption[] = [
  { label: 'Design system', value: 'design' },
  { label: 'Web platform', value: 'platform' },
  { label: 'Accessibility', value: 'a11y' },
];`;
  protected readonly templateCssCode = `.team-mark {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--primary);
}

.team-mark[data-team='platform'] {
  background: #80939b;
}

.team-mark[data-team='a11y'] {
  background: #8f5b34;
}

.selected-team,
.team-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}`;
  protected readonly stateCode = `protected readonly invalidRole =
  signal<string | null>(null);

protected readonly roleInvalid = computed(
  () => this.invalidRole() === null,
);`;
  protected readonly virtualCode = `protected readonly virtualRole =
  signal<string | null>(null);

protected readonly largeOptions: readonly AerisSelectOption[] =
  Array.from({ length: 1000 }, (_, index) => ({
    label: \`Workspace \${String(index + 1).padStart(4, '0')}\`,
    value: \`workspace-\${index + 1}\`,
  }));

protected recordLazyRange(event: AerisSelectLazyLoadEvent): void {
  this.virtualRange.set(
    \`Requested \${event.first}–\${event.last}\`,
  );
}`;
  protected readonly formsCode = `protected readonly reactiveRole =
  new FormControl<string | null>('engineer');

protected templateRole: string | null = 'designer';`;
  protected readonly interfacesCode = `type AerisSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisSelectAppearance = 'outline' | 'filled';
type AerisSelectFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals';

interface AerisSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisSelectOption;
}

interface AerisSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'options', type: 'readonly AerisSelectOption[]', defaultValue: 'required', description: 'Available options in display order.' },
    { name: 'value', type: 'string | null (model)', defaultValue: 'null', description: 'Selected option value with two-way binding and Forms support.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the combobox trigger for visible labels.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Creates a hidden native form value when a selection exists.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Select an option'", description: 'Text displayed without a selection.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible label is associated.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of elements that label the combobox.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
    { name: 'listboxAriaLabel', type: 'string', defaultValue: "'Options'", description: 'Accessible name for the options list.' },
    { name: 'size', type: 'AerisSelectSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisSelectAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables opening, selection, clearing, and Forms interaction.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes aria-required for validation.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
    { name: 'checkmark', type: 'boolean', defaultValue: 'true', description: 'Shows a selection mark beside the selected option.' },
    { name: 'editable', type: 'boolean', defaultValue: 'false', description: 'Allows free-form values in addition to listed options.' },
    { name: 'filter', type: 'boolean', defaultValue: 'false', description: 'Adds an accessible search field to the options panel.' },
    { name: 'filterValue', type: 'string (model)', defaultValue: "''", description: 'Controlled filter query with two-way binding.' },
    { name: 'filterMatchMode', type: 'AerisSelectFilterMatchMode', defaultValue: "'contains'", description: 'Matching strategy for local filtering.' },
    { name: 'filterFields', type: "readonly ('label' | 'description' | 'group')[]", defaultValue: "['label']", description: 'Option fields included in local filtering.' },
    { name: 'filterLocale', type: 'string | undefined', defaultValue: 'undefined', description: 'Locale used for case normalization.' },
    { name: 'filterPlaceholder', type: 'string', defaultValue: "'Search options'", description: 'Visible filter placeholder.' },
    { name: 'filterAriaLabel', type: 'string', defaultValue: "'Search options'", description: 'Accessible name for the filter field.' },
    { name: 'showFilterClear', type: 'boolean', defaultValue: 'false', description: 'Shows a button that clears the current filter query.' },
    { name: 'filterClearAriaLabel', type: 'string', defaultValue: "'Clear search'", description: 'Accessible name for filter clearing.' },
    { name: 'resetFilterOnClose', type: 'boolean', defaultValue: 'true', description: 'Resets the filter whenever the panel closes.' },
    { name: 'autofocusFilter', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the filter when the panel opens.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No options available'", description: 'Message displayed when options is empty.' },
    { name: 'emptyFilterMessage', type: 'string', defaultValue: "'No matching options'", description: 'Message displayed when filtering has no matches.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a suffix button when a selection can be cleared.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear selection'", description: 'Accessible name for the clear button.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows busy state and prevents option rendering.' },
    { name: 'loadingMessage', type: 'string', defaultValue: "'Loading options'", description: 'Live status text during loading.' },
    { name: 'panelMaxHeight', type: 'string', defaultValue: "'18rem'", description: 'Maximum scrollable list height as a CSS length.' },
    { name: 'panelClass', type: 'string', defaultValue: "''", description: 'Additional class applied to the options panel.' },
    { name: 'focusOnHover', type: 'boolean', defaultValue: 'true', description: 'Updates the active option when the pointer moves over it.' },
    { name: 'selectOnFocus', type: 'boolean', defaultValue: 'false', description: 'Updates value whenever active option focus changes.' },
    { name: 'autoOptionFocus', type: 'boolean', defaultValue: 'true', description: 'Activates the selected or first enabled option on open.' },
    { name: 'autoDisplayFirst', type: 'boolean', defaultValue: 'false', description: 'Selects the first enabled option when opening an empty Select.' },
    { name: 'virtualScroll', type: 'boolean', defaultValue: 'false', description: 'Renders only the visible range for large flat option sets.' },
    { name: 'virtualItemSize', type: 'number', defaultValue: '40', description: 'Fixed option height in pixels used by virtualization.' },
    { name: 'virtualBuffer', type: 'number', defaultValue: '4', description: 'Extra options rendered above and below the viewport.' },
    { name: 'lazy', type: 'boolean', defaultValue: 'false', description: 'Emits lazyLoad ranges while a virtualized list scrolls.' },
  ];

  protected recordChange(event: AerisSelectChangeEvent): void {
    this.lastChange.set(`Selected ${event.option.label}`);
  }

  protected recordLazyRange(event: AerisSelectLazyLoadEvent): void {
    this.virtualRange.set(`Requested ${event.first}-${event.last}`);
  }
}
