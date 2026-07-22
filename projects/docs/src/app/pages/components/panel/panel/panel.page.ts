import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisPanelModule,
  type AerisPanelToggleEvent,
} from '@aeris-ui/core/panel';
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
  selector: 'app-panel-page',
  imports: [
    AerisButton,
    AerisPanelModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './panel.page.html',
  styleUrl: './panel.page.scss',
})
export class PanelPage {
  protected controlledCollapsed = true;
  protected readonly toggleEvents: string[] = [];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'panel-basic', label: 'Basic' },
    { id: 'panel-toggleable', label: 'Toggleable' },
    { id: 'panel-controlled', label: 'Controlled' },
    { id: 'panel-actions', label: 'Header actions' },
    { id: 'panel-indicator', label: 'Indicator' },
    { id: 'panel-template', label: 'Template' },
    { id: 'panel-variants', label: 'Variants' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'panel-api-inputs', label: 'Inputs' },
    { id: 'panel-api-models', label: 'Models' },
    { id: 'panel-api-outputs', label: 'Outputs' },
    { id: 'panel-api-templates', label: 'Templates' },
    { id: 'panel-api-slots', label: 'Slots' },
    { id: 'panel-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisPanelModule } from '@aeris-ui/core/panel';`;

  protected readonly actionsCssCode = `.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 0 0.875rem;
}

.panel-event-log {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}`;

  protected readonly summaryCssCode = `.summary-list {
  display: grid;
  gap: 0.625rem;
  margin: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summary-total {
  margin-block-start: 0.75rem;
  padding-block-start: 0.75rem;
  border-block-start: 1px solid var(--border);
  font-weight: 800;
}`;

  protected readonly gridCssCode = `.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 42rem) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly indicatorCssCode = `.panel-plus-icon {
  position: relative;
  display: inline-block;
  width: 1rem;
  height: 1rem;
}

.panel-plus-icon::before,
.panel-plus-icon::after {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 0.875rem;
  height: 0.125rem;
  border-radius: 999px;
  background: currentColor;
  content: "";
  transform: translate(-50%, -50%);
}

.panel-plus-icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
  transition: transform 160ms ease;
}

.panel-plus-icon[data-collapsed="false"]::after {
  transform: translate(-50%, -50%) rotate(0deg);
}`;

  protected readonly templateCssCode = `.profile-panel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-avatar {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--aeris-primary) 18%, var(--surface));
  color: var(--aeris-primary-text);
  font-weight: 800;
}

.profile-meta {
  display: grid;
  gap: 0.125rem;
}

.profile-meta span {
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 600;
}`;

  protected readonly controlledTsCode = `import { type AerisPanelToggleEvent } from '@aeris-ui/core/panel';

protected controlledCollapsed = true;
protected readonly toggleEvents: string[] = [];

protected openPanel(): void {
  this.controlledCollapsed = false;
}

protected closePanel(): void {
  this.controlledCollapsed = true;
}

protected togglePanel(): void {
  this.controlledCollapsed = !this.controlledCollapsed;
}

protected recordToggle(event: AerisPanelToggleEvent): void {
  const next = event.collapsed ? 'Collapsed' : 'Expanded';
  this.toggleEvents.unshift(next);
}`;

  protected readonly interfacesCode = `type AerisPanelVariant = 'outlined' | 'elevated' | 'filled' | 'plain';
type AerisPanelSize = 'sm' | 'md' | 'lg';
type AerisPanelRole = 'region' | 'group' | 'article' | null;

interface AerisPanelToggleEvent {
  readonly originalEvent: Event | null;
  readonly collapsed: boolean;
  readonly previousCollapsed: boolean;
}

interface AerisPanelHeaderContext {
  readonly $implicit: boolean;
  readonly collapsed: boolean;
  readonly expanded: boolean;
  readonly toggleable: boolean;
  readonly disabled: boolean;
}

interface AerisPanelToggleIconContext extends AerisPanelHeaderContext {}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Host ID used to derive header and content IDs.' },
    { name: 'header', type: 'string', defaultValue: "''", description: 'Default header text.' },
    { name: 'toggleable', type: 'boolean', defaultValue: 'false', description: 'Adds a native disclosure button for showing and hiding content.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the toggle button without hiding content.' },
    { name: 'variant', type: 'AerisPanelVariant', defaultValue: "'outlined'", description: 'Outlined, elevated, filled, or plain surface treatment.' },
    { name: 'size', type: 'AerisPanelSize', defaultValue: "'md'", description: 'Controls header and content density.' },
    { name: 'animated', type: 'boolean', defaultValue: 'true', description: 'Enables content and indicator transitions.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '3', description: 'ARIA heading level for the panel header.' },
    { name: 'role', type: 'AerisPanelRole', defaultValue: 'null', description: 'Optional semantic role for the panel host.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the panel host when no visible label is referenced.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the panel host.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of text that describes the panel host.' },
    { name: 'toggleButtonLabel', type: 'string', defaultValue: "''", description: 'Optional accessible name for the toggle button when header text is not enough.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'collapsed', type: 'boolean', defaultValue: 'false', description: 'Two-way collapse state for controlled panels.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'toggled', type: 'AerisPanelToggleEvent', defaultValue: '-', description: 'Emitted whenever the panel changes collapse state.' },
    { name: 'panelExpanded', type: 'AerisPanelToggleEvent', defaultValue: '-', description: 'Emitted when content becomes visible.' },
    { name: 'panelCollapsed', type: 'AerisPanelToggleEvent', defaultValue: '-', description: 'Emitted when content becomes hidden.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisPanelHeader', type: 'AerisPanelHeaderContext', defaultValue: 'header text', description: 'Custom header content rendered inside the heading or toggle button.' },
    { name: 'aerisPanelToggleIcon', type: 'AerisPanelToggleIconContext', defaultValue: 'centered chevron icon', description: 'Custom indicator for toggleable panels.' },
  ];

  protected readonly slots: readonly ApiRow[] = [
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Panel body content.' },
    { name: 'aerisPanelHeaderActions', type: 'attribute directive', defaultValue: '-', description: 'Action area aligned beside the header.' },
    { name: 'aerisPanelFooter', type: 'attribute directive', defaultValue: '-', description: 'Footer content rendered after the body.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'toggle', type: '(originalEvent?: Event | null) => void', defaultValue: '-', description: 'Toggles a toggleable, enabled panel.' },
    { name: 'expand', type: '(originalEvent?: Event | null) => void', defaultValue: '-', description: 'Shows content when the panel is toggleable and enabled.' },
    { name: 'collapse', type: '(originalEvent?: Event | null) => void', defaultValue: '-', description: 'Hides content when the panel is toggleable and enabled.' },
  ];

  protected openPanel(): void {
    this.controlledCollapsed = false;
  }

  protected closePanel(): void {
    this.controlledCollapsed = true;
  }

  protected togglePanel(): void {
    this.controlledCollapsed = !this.controlledCollapsed;
  }

  protected recordToggle(event: AerisPanelToggleEvent): void {
    const next = event.collapsed ? 'Collapsed' : 'Expanded';
    this.toggleEvents.unshift(next);
  }
}
