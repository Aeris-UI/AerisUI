import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisAvatar } from '@aeris-ui/core/avatar';
import {
  AerisAutoComplete,
  type AerisAutoCompleteCompleteEvent,
  type AerisAutoCompleteOption,
  type AerisAutoCompleteSelectEvent,
} from '@aeris-ui/core/auto-complete';
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
  selector: 'app-auto-complete-page',
  imports: [
    AerisAvatar,
    AerisAutoComplete,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './auto-complete.page.html',
  styleUrl: './auto-complete.page.scss',
})
export class AutoCompletePage {
  protected readonly frameworkValue = signal('');
  protected readonly skillValue = signal('');
  protected readonly forcedValue = signal('');
  protected readonly invalidValue = signal('');
  protected readonly touched = signal(false);
  protected readonly lastEvent = signal('No selection yet');
  protected readonly reactiveSkill = new FormControl('Angular');
  protected templateSkill = 'TypeScript';
  protected readonly invalid = computed(
    () => this.touched() && this.invalidValue().trim().length === 0,
  );

  protected readonly frameworks: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular' },
    { label: 'Astro', value: 'Astro' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'Nuxt', value: 'Nuxt' },
    { label: 'SvelteKit', value: 'SvelteKit' },
    { label: 'Vue', value: 'Vue' },
  ];

  protected readonly skills: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', group: 'Frontend' },
    { label: 'TypeScript', value: 'TypeScript', group: 'Frontend' },
    { label: 'RxJS', value: 'RxJS', group: 'Frontend' },
    { label: 'Node.js', value: 'Node.js', group: 'Backend' },
    { label: 'PostgreSQL', value: 'PostgreSQL', group: 'Backend' },
    { label: 'Accessibility', value: 'Accessibility', group: 'Quality' },
    { label: 'Performance', value: 'Performance', group: 'Quality' },
  ];

  protected readonly describedOptions: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', description: 'Application framework' },
    { label: 'TypeScript', value: 'TypeScript', description: 'Typed JavaScript' },
    { label: 'A11y', value: 'A11y', description: 'Accessible product work' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'autocomplete-basic', label: 'Basic' },
    { id: 'autocomplete-signal', label: 'Signal value' },
    { id: 'autocomplete-dropdown', label: 'Dropdown trigger' },
    { id: 'autocomplete-force', label: 'Force selection' },
    { id: 'autocomplete-groups', label: 'Grouped suggestions' },
    { id: 'autocomplete-description', label: 'Descriptions' },
    { id: 'autocomplete-templates', label: 'Templates' },
    { id: 'autocomplete-clear', label: 'Clear button' },
    { id: 'autocomplete-states', label: 'States' },
    { id: 'autocomplete-sizes', label: 'Sizes' },
    { id: 'autocomplete-forms', label: 'Angular Forms' },
    { id: 'autocomplete-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'autocomplete-api-inputs', label: 'Inputs' },
    { id: 'autocomplete-api-outputs', label: 'Outputs' },
    { id: 'autocomplete-api-methods', label: 'Methods' },
    { id: 'autocomplete-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';`;

  protected readonly optionsCode = `protected readonly frameworks: readonly AerisAutoCompleteOption[] = [
  { label: 'Angular', value: 'Angular' },
  { label: 'Astro', value: 'Astro' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'Nuxt', value: 'Nuxt' },
  { label: 'SvelteKit', value: 'SvelteKit' },
  { label: 'Vue', value: 'Vue' },
];`;

  protected readonly signalCode = `protected readonly frameworkValue = signal('');`;

  protected readonly groupedCode = `protected readonly skills: readonly AerisAutoCompleteOption[] = [
  { label: 'Angular', value: 'Angular', group: 'Frontend' },
  { label: 'TypeScript', value: 'TypeScript', group: 'Frontend' },
  { label: 'Node.js', value: 'Node.js', group: 'Backend' },
  { label: 'Accessibility', value: 'Accessibility', group: 'Quality' },
];`;

  protected readonly descriptionCode = `protected readonly describedOptions: readonly AerisAutoCompleteOption[] = [
  { label: 'Angular', value: 'Angular', description: 'Application framework' },
  { label: 'TypeScript', value: 'TypeScript', description: 'Typed JavaScript' },
  { label: 'A11y', value: 'A11y', description: 'Accessible product work' },
];`;

  protected readonly formsCode = `protected readonly reactiveSkill = new FormControl('Angular');
protected templateSkill = 'TypeScript';`;

  protected readonly eventsCode = `protected readonly lastEvent = signal('No selection yet');

protected recordComplete(event: AerisAutoCompleteCompleteEvent): void {
  this.lastEvent.set(\`Searching for "\${event.query}"\`);
}

protected recordSelection(event: AerisAutoCompleteSelectEvent): void {
  this.lastEvent.set(\`Selected \${event.option.label}\`);
}`;

  protected readonly validationCode = `protected readonly invalidValue = signal('');
protected readonly touched = signal(false);
protected readonly invalid = computed(
  () => this.touched() && this.invalidValue().trim().length === 0,
);`;

  protected readonly interfacesCode = `type AerisAutoCompleteSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisAutoCompleteAppearance = 'outline' | 'filled';
type AerisAutoCompleteFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals';

interface AerisAutoCompleteOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisAutoCompleteCompleteEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisAutoCompleteSelectEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisAutoCompleteOption;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string (model)', defaultValue: "''", description: 'Current text value with two-way binding and Forms support.' },
    { name: 'suggestions', type: 'readonly AerisAutoCompleteOption[]', defaultValue: '[]', description: 'Suggestion records used by local filtering and option rendering.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the internal text input.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native form field name submitted through a hidden input.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Placeholder text shown while the value is empty.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'off'", description: 'Native browser autocomplete hint for the input.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when no visible label is available.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of visible elements that label the input.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'listboxAriaLabel', type: 'string', defaultValue: "'Suggestions'", description: 'Accessible name for the suggestion listbox.' },
    { name: 'dropdownAriaLabel', type: 'string', defaultValue: "'Show suggestions'", description: 'Accessible name for the optional dropdown trigger.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear value'", description: 'Accessible name for the clear button.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No suggestions found'", description: 'Message shown when filtering returns no enabled suggestions.' },
    { name: 'loadingMessage', type: 'string', defaultValue: "'Loading suggestions'", description: 'Message shown while loading is true.' },
    { name: 'size', type: 'AerisAutoCompleteSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisAutoCompleteAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'filterMatchMode', type: 'AerisAutoCompleteFilterMatchMode', defaultValue: "'contains'", description: 'Local filtering strategy applied to label, value, description, and group.' },
    { name: 'minLength', type: 'number', defaultValue: '1', description: 'Minimum query length before suggestions are shown unless completeOnFocus is enabled.' },
    { name: 'panelMaxHeight', type: 'string', defaultValue: "'16rem'", description: 'Maximum dropdown panel height.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and form submission.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Allows reading the value without editing.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes required semantics to forms and assistive technology.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline space.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear action while a value exists.' },
    { name: 'dropdown', type: 'boolean', defaultValue: 'false', description: 'Shows a suffix button that opens and closes the suggestion panel.' },
    { name: 'completeOnFocus', type: 'boolean', defaultValue: 'false', description: 'Opens suggestions when the input receives focus.' },
    { name: 'forceSelection', type: 'boolean', defaultValue: 'false', description: 'Clears unmatched text on blur unless it matches a suggestion label or value.' },
    { name: 'autoHighlight', type: 'boolean', defaultValue: 'true', description: 'Highlights the first enabled suggestion when the panel opens.' },
    { name: 'grouped', type: 'boolean', defaultValue: 'false', description: 'Groups suggestions by the option group property.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows the loading message or template instead of suggestions.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'string', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'valueInput', type: 'string', defaultValue: '-', description: 'Emitted when user input changes the text value.' },
    { name: 'completed', type: 'AerisAutoCompleteCompleteEvent', defaultValue: '-', description: 'Emitted when a query should be completed by local or remote suggestions.' },
    { name: 'selected', type: 'AerisAutoCompleteSelectEvent', defaultValue: '-', description: 'Emitted after the user selects a suggestion.' },
    { name: 'cleared', type: 'void', defaultValue: '-', description: 'Emitted after the clear action succeeds.' },
    { name: 'opened', type: 'void', defaultValue: '-', description: 'Emitted when the suggestion panel opens.' },
    { name: 'closed', type: 'void', defaultValue: '-', description: 'Emitted when the suggestion panel closes.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the input receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the input loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the internal text input.' },
    { name: 'openPanel(event?)', type: 'void', defaultValue: '-', description: 'Opens the suggestion panel and emits completed.' },
    { name: 'closePanel()', type: 'void', defaultValue: '-', description: 'Closes the suggestion panel.' },
    { name: 'togglePanel(event)', type: 'void', defaultValue: '-', description: 'Toggles the suggestion panel from a user event.' },
    { name: 'clear()', type: 'void', defaultValue: '-', description: 'Clears the value and restores focus.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Clears the value and closes the panel.' },
  ];

  protected recordComplete(event: AerisAutoCompleteCompleteEvent): void {
    this.lastEvent.set(`Searching for "${event.query}"`);
  }

  protected recordSelection(event: AerisAutoCompleteSelectEvent): void {
    this.lastEvent.set(`Selected ${event.option.label}`);
  }
}
