import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule, type AerisStyleClassEvent } from '@aeris-ui/core/style-class';
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
  selector: 'app-style-class-page',
  imports: [
    AerisButton,
    AerisStyleClassModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './style-class.page.html',
  styleUrl: './style-class.page.scss',
})
export class StyleClassPage {
  protected readonly methodStatus = signal('The notice is hidden.');

  protected readonly importCode = `import { AerisStyleClassModule } from '@aeris-ui/core/style-class';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'style-class-import', label: 'Import' },
    { id: 'style-class-toggle', label: 'Toggle classes' },
    { id: 'style-class-animation', label: 'Animation' },
    { id: 'style-class-selectors', label: 'Target selectors' },
    { id: 'style-class-resize', label: 'Resize dismissal' },
    { id: 'style-class-methods', label: 'Methods and events' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'style-class-import', label: 'Import' },
    { id: 'style-class-api-inputs', label: 'Inputs' },
    { id: 'style-class-api-properties', label: 'Properties' },
    { id: 'style-class-api-outputs', label: 'Outputs' },
    { id: 'style-class-api-methods', label: 'Methods' },
  ];

  protected readonly toggleCssCode = `.style-toggle-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-toggle-card {
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.style-toggle-card--active {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
  transform: translateY(-0.125rem);
}

@media (prefers-reduced-motion: reduce) {
  .style-toggle-card {
    transition: none;
  }
}`;

  protected readonly animationCssCode = `.style-animation-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-animation-panel {
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  opacity: 1;
  transform: translateY(0) scale(1);
}

.style-enter-from,
.style-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem) scale(0.98);
}

.style-enter-active,
.style-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.style-enter-to,
.style-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .style-enter-active,
  .style-leave-active {
    transition: none;
  }
}`;

  protected readonly selectorsCssCode = `.style-selector-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
}

.style-selector-case,
.style-selector-target {
  display: grid;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.style-selector-target {
  background: var(--aeris-surface-2);
}

.style-selector-target--selected {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
}

@media (max-width: 40rem) {
  .style-selector-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly resizeCssCode = `.style-resize-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-resize-panel {
  display: none;
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.style-resize-panel--visible {
  display: block;
}`;

  protected readonly methodsTsCode = `protected readonly methodStatus = signal('The notice is hidden.');

protected recordMethodShown(event: AerisStyleClassEvent): void {
  this.methodStatus.set(\`Notice shown via \${event.reason}.\`);
}

protected recordMethodHidden(event: AerisStyleClassEvent): void {
  this.methodStatus.set(\`Notice hidden via \${event.reason}.\`);
}`;

  protected readonly methodsCssCode = `.style-method-demo {
  display: grid;
  gap: 0.875rem;
}

.style-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.style-method-notice {
  display: none;
  width: min(100%, 34rem);
  padding: 1rem;
  border-inline-start: 0.25rem solid var(--aeris-primary);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-primary-soft);
}

.style-method-notice--visible {
  display: block;
}

.style-method-status {
  margin: 0;
  color: var(--aeris-text-2);
}

@media (max-width: 30rem) {
  .style-method-actions > button {
    width: 100%;
  }
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisStyleClass',
      type: 'AerisStyleClassTarget',
      defaultValue: "'@next'",
      description: 'Target element, CSS selector, or supported relationship keyword.',
    },
    {
      name: 'aerisStyleClassToggle',
      type: 'string',
      defaultValue: "''",
      description:
        'Whitespace-separated classes added and removed in toggle mode. When present, this mode takes precedence over transition classes.',
    },
    {
      name: 'aerisStyleClassEnterFrom',
      type: 'string',
      defaultValue: "''",
      description: 'Starting classes for an enter transition.',
    },
    {
      name: 'aerisStyleClassEnterActive',
      type: 'string',
      defaultValue: "''",
      description: 'Classes retained for the complete enter transition.',
    },
    {
      name: 'aerisStyleClassEnterTo',
      type: 'string',
      defaultValue: "''",
      description: 'Destination classes for an enter transition.',
    },
    {
      name: 'aerisStyleClassLeaveFrom',
      type: 'string',
      defaultValue: "''",
      description: 'Starting classes for a leave transition.',
    },
    {
      name: 'aerisStyleClassLeaveActive',
      type: 'string',
      defaultValue: "''",
      description: 'Classes retained for the complete leave transition.',
    },
    {
      name: 'aerisStyleClassLeaveTo',
      type: 'string',
      defaultValue: "''",
      description: 'Destination classes for a leave transition.',
    },
    {
      name: 'aerisStyleClassInitiallyVisible',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Starts a transition-mode target visible instead of hidden.',
    },
    {
      name: 'aerisStyleClassDismissOnOutside',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Hides a shown target after pointer input outside the trigger and target.',
    },
    {
      name: 'aerisStyleClassDismissOnEscape',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Hides a shown target when Escape is pressed.',
    },
    {
      name: 'aerisStyleClassDismissOnResize',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Hides a shown target after its configured resize source changes.',
    },
    {
      name: 'aerisStyleClassResizeTarget',
      type: 'AerisStyleClassResizeTarget',
      defaultValue: "'window'",
      description: 'Window, document, element, or CSS selector observed for resize dismissal.',
    },
    {
      name: 'aerisStyleClassDisabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables trigger, method, dismissal, and resize behavior.',
    },
  ];

  protected readonly properties: readonly ApiRow[] = [
    {
      name: 'state',
      type: 'Signal<AerisStyleClassState>',
      defaultValue: "'hidden'",
      description: 'Readonly lifecycle state: hidden, entering, shown, or leaving.',
    },
    {
      name: 'visible',
      type: 'Signal<boolean>',
      defaultValue: 'false',
      description: 'Readonly state that is true while entering or fully shown.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'shown',
      type: 'AerisStyleClassEvent',
      defaultValue: '—',
      description: 'Emits after toggle classes are added or an enter transition completes.',
    },
    {
      name: 'hidden',
      type: 'AerisStyleClassEvent',
      defaultValue: '—',
      description: 'Emits after toggle classes are removed or a leave transition completes.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'show()',
      type: '() => boolean',
      defaultValue: '—',
      description: 'Shows the resolved target and reports whether a state change started.',
    },
    {
      name: 'hide()',
      type: '() => boolean',
      defaultValue: '—',
      description: 'Hides the resolved target and reports whether a state change started.',
    },
    {
      name: 'toggle()',
      type: '() => boolean',
      defaultValue: '—',
      description: 'Shows or hides the resolved target from its current state.',
    },
  ];

  protected readonly interfacesCode = `export type AerisStyleClassRelationship =
  | '@self'
  | '@next'
  | '@previous'
  | '@parent'
  | '@grandparent';

export type AerisStyleClassTarget =
  | HTMLElement
  | AerisStyleClassRelationship
  | string;

export type AerisStyleClassResizeTarget =
  | HTMLElement
  | 'window'
  | 'document'
  | string;

export type AerisStyleClassState =
  | 'hidden'
  | 'entering'
  | 'shown'
  | 'leaving';

export type AerisStyleClassReason =
  | 'trigger'
  | 'api'
  | 'outside'
  | 'escape'
  | 'resize';

export interface AerisStyleClassEvent {
  readonly target: HTMLElement;
  readonly reason: AerisStyleClassReason;
  readonly originalEvent: Event | null;
}`;

  protected recordMethodShown(event: AerisStyleClassEvent): void {
    this.methodStatus.set(`Notice shown via ${event.reason}.`);
  }

  protected recordMethodHidden(event: AerisStyleClassEvent): void {
    this.methodStatus.set(`Notice hidden via ${event.reason}.`);
  }
}
