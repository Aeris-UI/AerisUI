import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import {
  AerisListbox,
  type AerisListboxOption,
  type AerisListboxValue,
  type AerisListboxChangeEvent,
} from '@aeris-ui/core/listbox';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucidePalette } from '@lucide/angular';
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
  selector: 'app-listbox-page',
  imports: [
    AerisListbox,
    AerisButton,
    AerisMessageModule,
    AerisTabsModule,
    ReactiveFormsModule,
    FormField,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './listbox.page.html',
  styleUrl: './listbox.page.scss',
})
export class ListboxPage {
  protected readonly options: readonly AerisListboxOption[] = [
    { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
    { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
    { label: 'Research', value: 'research', description: 'Insights and discovery' },
    { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
  ];
  protected readonly groupedOptions: readonly AerisListboxOption[] = [
    { label: 'Design', value: 'design', group: 'Product' },
    { label: 'Engineering', value: 'engineering', group: 'Product' },
    { label: 'Research', value: 'research', group: 'Discovery' },
    { label: 'Analytics', value: 'analytics', group: 'Discovery' },
  ];
  protected readonly single = signal<AerisListboxValue>('design');
  protected readonly multiple = signal<AerisListboxValue>(['design']);
  protected readonly controlled = signal<AerisListboxValue>('design');
  protected readonly lastChange = signal('No selection change');
  protected readonly loading = signal(false);
  protected readonly longOptions: readonly AerisListboxOption[] = Array.from(
    { length: 60 },
    (_, index) => ({ value: `option-${index + 1}`, label: `Option ${index + 1}` }),
  );
  protected readonly selectionData = signal<{ choice: AerisListboxValue }>({ choice: null });
  protected readonly fields = form(this.selectionData, (schema) => required(schema.choice));
  protected readonly showError = computed(
    () => this.fields.choice().touched() && this.fields.choice().invalid(),
  );
  protected readonly reactive = new FormControl<AerisListboxValue>(['design']);
  protected readonly paletteIcon = LucidePalette;
  protected recordChange(event: AerisListboxChangeEvent): void {
    this.lastChange.set(event.options.map((option) => option.label).join(', ') || 'None');
  }
  protected readonly importCode = `import { AerisListbox } from '@aeris-ui/core/listbox';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'listbox-basic', label: 'Single selection' },
    { id: 'listbox-multiple', label: 'Multiple selection' },
    { id: 'listbox-groups', label: 'Groups' },
    { id: 'listbox-templates', label: 'Templates' },
    { id: 'listbox-filter', label: 'Filtering' },
    { id: 'listbox-states', label: 'States' },
    { id: 'listbox-controlled', label: 'Controlled selection' },
    { id: 'listbox-long', label: 'Scrolling' },
    { id: 'listbox-signal-forms', label: 'Signal Forms' },
    { id: 'listbox-reactive', label: 'Reactive Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'listbox-inputs', label: 'Inputs and models' },
    { id: 'listbox-outputs', label: 'Outputs' },
    { id: 'listbox-templates-api', label: 'Templates' },
    { id: 'listbox-methods', label: 'Methods' },
  ];
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'options',
      type: 'readonly AerisListboxOption[]',
      defaultValue: '[]',
      description:
        'Options with unique stable string values. Replace the array to update results. Missing selections remain in the controlled model; the control never silently discards them.',
    },
    {
      name: 'selectionMode',
      type: "'single' | 'multiple'",
      defaultValue: "'single'",
      description:
        'Single uses string or null; multiple uses a readonly string array. Set a matching value when changing mode.',
    },
    {
      name: 'value',
      type: 'AerisListboxValue (model)',
      defaultValue: 'null',
      description:
        'Controlled selection. Filtering never clears selected values. Disabled choices cannot be changed by user interaction.',
    },
    {
      name: 'filter',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Adds a search input. Case-insensitive contains matching across label, description and group.',
    },
    {
      name: 'query',
      type: 'string (model)',
      defaultValue: "''",
      description:
        'Filter query. Only applied when filter is enabled. For remote data, own cancellation and response ordering in the application and replace options.',
    },
    {
      name: 'filterPlaceholder',
      type: 'string',
      defaultValue: "'Search options'",
      description: 'Search input placeholder.',
    },
    {
      name: 'filterAriaLabel',
      type: 'string',
      defaultValue: "'Filter options'",
      description: 'Accessible name of the search input.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No options available'",
      description: 'Status when no options match.',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      defaultValue: "'Loading options'",
      description: 'Loading status text.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Marks the list busy and prevents selection changes; existing options remain visible.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables filtering, selection and the list tab stop.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Exposes aria-required. Configure form validators separately; multiple selection may still be cleared.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Explicit invalid state; synchronized with aria-invalid.',
    },
    {
      name: 'touched',
      type: 'boolean | null',
      defaultValue: 'null',
      description:
        'Null preserves immediate manual invalid styling; false hides errors until interaction. Signal Forms forwards this automatically.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'Accessible name when no visible label is associated.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'Space-separated IDs of visible labels; preferred over ariaLabel.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'Space-separated help and visible error IDs.',
    },
    {
      name: 'scrollHeight',
      type: 'string',
      defaultValue: "'16rem'",
      description:
        'CSS maximum list height. Native scrolling supports variable-height descriptions and templates; every option stays mounted, without virtualization.',
    },
  ];
  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'valueChange',
      type: 'AerisListboxValue',
      defaultValue: '—',
      description: 'Value model updates. Use two-way binding or handle controlled updates.',
    },
    {
      name: 'queryChange',
      type: 'string',
      defaultValue: '—',
      description: 'Query model updates from the search input.',
    },
    {
      name: 'changed',
      type: 'AerisListboxChangeEvent',
      defaultValue: '—',
      description:
        'User selection event, selected value and matching options. Pure focus movement and external value updates do not emit it.',
    },
    {
      name: 'touch',
      type: 'void',
      defaultValue: '—',
      description:
        'Focus left the whole control, not merely the search input. Signal Forms uses this to mark touched.',
    },
  ];
  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisListboxOption',
      type: 'AerisListboxOptionContext',
      defaultValue: 'Label and description',
      description:
        'let-option, let-selected="selected", let-active="active". Decorative content only; no nested links, buttons or inputs. Keep the label represented in the content.',
    },
    {
      name: 'aerisListboxGroup',
      type: 'AerisListboxGroupContext',
      defaultValue: 'Group label',
      description: 'let-group is the group string. Keep the group name readable.',
    },
    {
      name: 'aerisListboxEmpty',
      type: 'void',
      defaultValue: 'emptyMessage',
      description: 'Custom content in the empty status region.',
    },
    {
      name: 'aerisListboxLoading',
      type: 'void',
      defaultValue: 'loadingMessage',
      description: 'Custom content in the loading status region.',
    },
  ];
  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focus(options?)',
      type: '(options?: FocusOptions) => void',
      defaultValue: '—',
      description: 'Focus the list, preserving its active option. Does nothing when disabled.',
    },
  ];
  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-listbox-background',
      type: 'color',
      defaultValue: '--aeris-surface',
      description: 'Container background.',
    },
    {
      name: '--aeris-listbox-border',
      type: 'color',
      defaultValue: '--aeris-border',
      description: 'Container border.',
    },
    {
      name: '--aeris-listbox-radius',
      type: 'length',
      defaultValue: '--aeris-radius-surface',
      description: 'Container corners; options use the shared item radius.',
    },
    {
      name: '--aeris-listbox-padding',
      type: 'length',
      defaultValue: '0.35rem',
      description: 'List inset.',
    },
    {
      name: '--aeris-listbox-option-height',
      type: 'length',
      defaultValue: '--aeris-item-height',
      description: 'Minimum option height; content may grow.',
    },
    {
      name: '--aeris-listbox-selected-background',
      type: 'color',
      defaultValue: '--aeris-primary-soft',
      description: 'Selected background.',
    },
    {
      name: '--aeris-listbox-selected-color',
      type: 'color',
      defaultValue: '--aeris-on-primary-soft',
      description: 'Selected text color.',
    },
  ];
  protected readonly interfacesCode = `type AerisListboxSelectionMode = 'single' | 'multiple';
type AerisListboxValue = string | readonly string[] | null;

interface AerisListboxOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisListboxChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisListboxValue;
  readonly options: readonly AerisListboxOption[];
}

interface AerisListboxOptionContext {
  readonly $implicit: AerisListboxOption;
  readonly option: AerisListboxOption;
  readonly selected: boolean;
  readonly active: boolean;
}

interface AerisListboxGroupContext {
  readonly $implicit: string;
  readonly group: string;
}`;
}
