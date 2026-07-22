import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisAccordionModule,
  type AerisAccordionChangeEvent,
  type AerisAccordionValue,
} from '@aeris-ui/core/accordion';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-accordion-page',
  imports: [
    AerisButton,
    AerisAccordionModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './accordion.page.html',
  styleUrl: './accordion.page.scss',
})
export class AccordionPage {
  protected readonly activeSections = signal<AerisAccordionValue>(['profile']);
  protected readonly multiSections = signal<AerisAccordionValue>(['security', 'billing']);
  protected readonly controlledValues = ['profile', 'security', 'billing'] as const;
  protected readonly lastChange = signal('Profile is open.');
  protected readonly dynamicPanels = [
    { value: 'planning', header: 'Planning', body: 'Roadmap, estimates, and ownership.' },
    { value: 'build', header: 'Build', body: 'Implementation notes and review status.' },
    { value: 'release', header: 'Release', body: 'Checklist, rollout plan, and changelog.' },
  ] as const;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'accordion-basic', label: 'Basic' },
    { id: 'accordion-controlled', label: 'Controlled state' },
    { id: 'accordion-multiple', label: 'Multiple panels' },
    { id: 'accordion-disabled', label: 'Disabled panel' },
    { id: 'accordion-non-collapsible', label: 'Non-collapsible' },
    { id: 'accordion-headers', label: 'Header templates' },
    { id: 'accordion-icons', label: 'Custom toggle icon' },
    { id: 'accordion-dynamic', label: 'Dynamic panels' },
    { id: 'accordion-variants', label: 'Variants' },
    { id: 'accordion-sizes', label: 'Sizes' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'accordion-api-inputs', label: 'Accordion inputs' },
    { id: 'accordion-api-models', label: 'Models' },
    { id: 'accordion-api-panel', label: 'Panel inputs' },
    { id: 'accordion-api-outputs', label: 'Outputs' },
    { id: 'accordion-api-templates', label: 'Templates' },
    { id: 'accordion-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisAccordionModule } from '@aeris-ui/core/accordion';`;

  protected readonly controlledTsCode = `protected readonly activeSections = signal<AerisAccordionValue>(['profile']);
protected readonly controlledValues = ['profile', 'security', 'billing'] as const;
protected readonly lastChange = signal('Profile is open.');

protected expandAllSections(): void {
  this.activeSections.set([...this.controlledValues]);
  this.lastChange.set('All sections expanded.');
}

protected closeAllSections(): void {
  this.activeSections.set([]);
  this.lastChange.set('All sections closed.');
}

protected toggleControlledSection(value: string): void {
  const current = this.normalizeValue(this.activeSections());
  this.activeSections.set(
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value],
  );
}

protected recordChange(event: AerisAccordionChangeEvent): void {
  this.lastChange.set(
    event.expanded
      ? \`\${event.changedValue} expanded.\`
      : \`\${event.changedValue} collapsed.\`,
  );
}

private normalizeValue(value: AerisAccordionValue): readonly string[] {
  return typeof value === 'string' ? value ? [value] : [] : value;
}`;

  protected readonly multipleTsCode = `protected readonly multiSections = signal<AerisAccordionValue>([
  'security',
  'billing',
]);`;

  protected readonly headerCssCode = `.accordion-meta-header {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.accordion-meta-header small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}`;

  protected readonly controlsCssCode = `.accordion-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-line {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly iconCssCode = `.custom-toggle-icon {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-grid;
  place-items: center;
  color: var(--primary-text);
  font-size: var(--aeris-icon-size, 1rem);
  font-weight: 800;
  line-height: 1;
}`;

  protected readonly dynamicTsCode = `protected readonly dynamicPanels = [
  { value: 'planning', header: 'Planning', body: 'Roadmap, estimates, and ownership.' },
  { value: 'build', header: 'Build', body: 'Implementation notes and review status.' },
  { value: 'release', header: 'Release', body: 'Checklist, rollout plan, and changelog.' },
] as const;`;

  protected readonly interfacesCode = `type AerisAccordionValue = string | readonly string[];
type AerisAccordionVariant = 'outlined' | 'filled' | 'separated';
type AerisAccordionSize = 'sm' | 'md' | 'lg';
type AerisAccordionIconPosition = 'start' | 'end';

interface AerisAccordionChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisAccordionValue;
  readonly previousValue: AerisAccordionValue;
  readonly changedValue: string;
  readonly expanded: boolean;
}

interface AerisAccordionHeaderContext {
  readonly $implicit: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly value: string;
}

interface AerisAccordionToggleIconContext {
  readonly $implicit: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly value: string;
}`;

  protected readonly accordionInputs: readonly ApiRow[] = [
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allows more than one panel to be open at a time.' },
    { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Allows the last open panel to be collapsed.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables all panel headers.' },
    { name: 'variant', type: 'outlined | filled | separated', defaultValue: "'outlined'", description: 'Controls the surface treatment.' },
    { name: 'size', type: 'sm | md | lg', defaultValue: "'md'", description: 'Controls header height, spacing, and text size.' },
    { name: 'iconPosition', type: 'start | end', defaultValue: "'end'", description: 'Places the built-in disclosure icon before or after the label.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '3', description: 'ARIA heading level used for each accordion header.' },
    { name: 'panelTabIndex', type: '0 | -1', defaultValue: '0', description: 'Controls whether expanded panels are directly focusable.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the accordion container when needed.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the accordion container.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'value', type: 'AerisAccordionValue', defaultValue: "''", description: 'Open panel value in single mode or open panel values in multiple mode.' },
  ];

  protected readonly panelInputs: readonly ApiRow[] = [
    { name: 'value', type: 'string, required', defaultValue: '-', description: 'Stable identifier for the panel.' },
    { name: 'header', type: 'string, required', defaultValue: '-', description: 'Default visible header text.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables this panel header and prevents expansion changes.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'AerisAccordionValue', defaultValue: '-', description: 'Emitted by the value model.' },
    { name: 'changed', type: 'AerisAccordionChangeEvent', defaultValue: '-', description: 'Emitted after a panel expands or collapses.' },
    { name: 'panelExpanded', type: 'AerisAccordionChangeEvent', defaultValue: '-', description: 'Emitted after a panel expands.' },
    { name: 'panelCollapsed', type: 'AerisAccordionChangeEvent', defaultValue: '-', description: 'Emitted after a panel collapses.' },
    { name: 'headerFocused', type: 'string', defaultValue: '-', description: 'Emitted when a panel header receives focus.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisAccordionHeader', type: 'AerisAccordionHeaderContext', defaultValue: 'header input', description: 'Custom header content rendered inside the native disclosure button.' },
    { name: 'aerisAccordionToggleIcon', type: 'AerisAccordionToggleIconContext', defaultValue: 'built-in chevron', description: 'Custom decorative toggle icon for one panel or every panel when placed directly in the accordion.' },
    { name: 'default panel content', type: 'content projection', defaultValue: '-', description: 'Panel body rendered when the panel is expanded.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'toggle(value, event?)', type: '(string, Event | null) => void', defaultValue: '-', description: 'Toggles an enabled panel by value.' },
    { name: 'expand(value, event?)', type: '(string, Event | null) => void', defaultValue: '-', description: 'Expands an enabled panel by value.' },
    { name: 'collapse(value, event?)', type: '(string, Event | null) => void', defaultValue: '-', description: 'Collapses an enabled panel by value when collapsible rules allow it.' },
    { name: 'focusPanel(value, options?)', type: '(string, FocusOptions) => void', defaultValue: '-', description: 'Moves focus to an enabled panel header.' },
  ];

  protected recordChange(event: AerisAccordionChangeEvent): void {
    this.lastChange.set(
      event.expanded
        ? `${event.changedValue} expanded.`
        : `${event.changedValue} collapsed.`,
    );
  }

  protected expandAllSections(): void {
    this.activeSections.set([...this.controlledValues]);
    this.lastChange.set('All sections expanded.');
  }

  protected closeAllSections(): void {
    this.activeSections.set([]);
    this.lastChange.set('All sections closed.');
  }

  protected toggleControlledSection(value: string): void {
    const current = this.normalizeValue(this.activeSections());
    this.activeSections.set(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  private normalizeValue(value: AerisAccordionValue): readonly string[] {
    return typeof value === 'string' ? value ? [value] : [] : value;
  }
}
