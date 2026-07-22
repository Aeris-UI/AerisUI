import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInplaceModule, type AerisInplaceStateEvent } from '@aeris-ui/core/inplace';
import { AerisInputText } from '@aeris-ui/core/input-text';
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

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

interface ApiSection {
  readonly id: string;
  readonly title: string;
  readonly label: string;
  readonly rows: readonly ApiRow[];
}

@Component({
  selector: 'app-inplace-page',
  imports: [
    AerisButton,
    AerisInplaceModule,
    AerisInputText,
    AerisTabsModule,
    NgOptimizedImage,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './inplace.page.html',
  styleUrl: './inplace.page.scss',
})
export class InplacePage {
  protected readonly controlledActive = signal(false);
  protected readonly savedName = signal('Maya Chen');
  protected readonly draftName = signal('Maya Chen');
  protected readonly editStatus = signal('Profile name is Maya Chen.');
  protected readonly lazyLoaded = signal(false);
  protected readonly lazyActivations = signal(0);

  protected readonly importCode = `import { AerisInplaceModule } from '@aeris-ui/core/inplace';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'inplace-import', label: 'Import' },
    { id: 'inplace-basic', label: 'Basic' },
    { id: 'inplace-controlled', label: 'Controlled' },
    { id: 'inplace-input', label: 'Inline editing' },
    { id: 'inplace-media', label: 'Arbitrary content' },
    { id: 'inplace-lazy', label: 'Lazy content' },
    { id: 'inplace-tokens', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'inplace-import', label: 'Import' },
    { id: 'inplace-api-models', label: 'Models' },
    { id: 'inplace-api-inputs', label: 'Inputs' },
    { id: 'inplace-api-outputs', label: 'Outputs' },
    { id: 'inplace-api-templates', label: 'Templates' },
    { id: 'inplace-api-methods', label: 'Methods' },
  ];

  protected readonly basicCssCode = `.inplace-summary {
  display: grid;
  gap: 0.25rem;
}

.inplace-summary strong {
  font-size: 0.9375rem;
}

.inplace-summary span,
.inplace-details dt {
  color: var(--aeris-text-2);
}

.inplace-details {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 0.625rem 1rem;
  margin: 0;
}

.inplace-details dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}`;

  protected readonly controlledTsCode = `protected readonly controlledActive = signal(false);

protected activateControlled(): void {
  this.controlledActive.set(true);
}

protected deactivateControlled(): void {
  this.controlledActive.set(false);
}

protected toggleControlled(): void {
  this.controlledActive.update((active) => !active);
}`;

  protected readonly controlledCssCode = `.inplace-controlled {
  display: grid;
  gap: 1rem;
}

.inplace-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.inplace-note {
  margin: 0;
  color: var(--aeris-text-2);
}`;

  protected readonly inputTsCode = `protected readonly savedName = signal('Maya Chen');
protected readonly draftName = signal('Maya Chen');
protected readonly editStatus = signal('Profile name is Maya Chen.');

protected updateDraft(event: Event): void {
  this.draftName.set((event.target as HTMLInputElement).value);
}

protected saveName(close: () => void): void {
  const name = this.draftName().trim() || this.savedName();
  this.savedName.set(name);
  this.draftName.set(name);
  this.editStatus.set(\`Saved profile name as \${name}.\`);
  close();
}

protected cancelName(close: () => void): void {
  this.draftName.set(this.savedName());
  this.editStatus.set('Editing cancelled.');
  close();
}`;

  protected readonly inputCssCode = `.inplace-editor {
  display: grid;
  gap: 0.875rem;
}

.inplace-editor__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.inplace-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
}`;

  protected readonly mediaCssCode = `.inplace-photo-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.inplace-photo-trigger img {
  width: 3.375rem;
  height: 2.25rem;
  border-radius: var(--aeris-radius-md);
  object-fit: cover;
}

.inplace-photo {
  display: grid;
  grid-template-columns: minmax(0, 14rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
}

.inplace-photo img {
  width: 100%;
  height: auto;
  border-radius: var(--aeris-radius-lg);
}

.inplace-photo h4,
.inplace-photo p {
  margin: 0;
}

.inplace-photo p {
  margin-top: 0.375rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

@media (max-width: 36rem) {
  .inplace-photo {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly lazyTsCode = `import { type AerisInplaceStateEvent } from '@aeris-ui/core/inplace';

protected readonly lazyLoaded = signal(false);
protected readonly lazyActivations = signal(0);

protected loadActivity(event: AerisInplaceStateEvent): void {
  if (event.active) {
    this.lazyLoaded.set(true);
    this.lazyActivations.update((count) => count + 1);
  }
}`;

  protected readonly lazyCssCode = `.inplace-activity {
  display: grid;
  gap: 0.75rem;
}

.inplace-activity ul {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding-inline-start: 1.25rem;
}

.inplace-activity p {
  margin: 0;
  color: var(--aeris-text-2);
}`;

  protected readonly tokenCssCode = `.custom-inplace {
  --aeris-inplace-radius: 1rem;
  --aeris-inplace-display-hover: color-mix(
    in srgb,
    var(--aeris-primary) 14%,
    var(--aeris-surface)
  );
  --aeris-inplace-content-border: color-mix(
    in srgb,
    var(--aeris-primary) 48%,
    var(--aeris-border)
  );
  --aeris-inplace-content-padding: 1.5rem;
  --aeris-inplace-content-shadow: 0 1rem 2.5rem
    color-mix(in srgb, var(--aeris-primary) 18%, transparent);
}`;

  protected readonly interfacesCode = `type AerisInplaceChangeReason =
  | 'display'
  | 'close'
  | 'escape'
  | 'api';

type AerisInplaceAriaLive = 'off' | 'polite' | 'assertive';

interface AerisInplaceStateEvent {
  readonly active: boolean;
  readonly originalEvent: Event | null;
  readonly reason: AerisInplaceChangeReason;
}

interface AerisInplaceDisplayContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly activate: () => void;
}

interface AerisInplaceContentContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly close: () => void;
}`;

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'active',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Two-way state selecting display or content mode.',
    },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'label',
      type: 'string',
      defaultValue: "'Show content'",
      description: 'Fallback display button text when no display template is provided.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables activation from display mode.',
    },
    {
      name: 'closable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the Aeris-owned close button in content mode.',
    },
    {
      name: 'autofocusContent',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Moves focus to the first interactive content element after activation.',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Returns to display mode when Escape is pressed inside content.',
    },
    {
      name: 'closeAriaLabel',
      type: 'string',
      defaultValue: "'Close content'",
      description: 'Accessible name for the owned close button.',
    },
    {
      name: 'contentId',
      type: 'string',
      defaultValue: 'generated',
      description: 'ID used to associate the display button with content.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for the display button.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that names the display button.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of supplemental display-button instructions.',
    },
    {
      name: 'ariaLive',
      type: 'AerisInplaceAriaLive',
      defaultValue: "'polite'",
      description: 'Live-region politeness applied to newly rendered content.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'activeChange',
      type: 'boolean',
      defaultValue: '-',
      description: 'Implicit model output emitted whenever active changes.',
    },
    {
      name: 'activated',
      type: 'AerisInplaceStateEvent',
      defaultValue: '-',
      description: 'Emits after activation with the source event and reason.',
    },
    {
      name: 'deactivated',
      type: 'AerisInplaceStateEvent',
      defaultValue: '-',
      description: 'Emits after returning to display mode.',
    },
  ];

  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '-',
      description: 'Projected active content used when no content template is provided.',
    },
    {
      name: 'aerisInplaceDisplay',
      type: 'TemplateRef<AerisInplaceDisplayContext>',
      defaultValue: '-',
      description: 'Custom display-button content.',
    },
    {
      name: 'aerisInplaceContent',
      type: 'TemplateRef<AerisInplaceContentContext>',
      defaultValue: '-',
      description: 'Custom active content with a close callback.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'activate(originalEvent?, reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Activates content unless disabled or already active.',
    },
    {
      name: 'deactivate(originalEvent?, reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Returns to display mode and restores focus.',
    },
    {
      name: 'toggle(originalEvent?)',
      type: 'void',
      defaultValue: '-',
      description: 'Switches between display and content modes.',
    },
    {
      name: 'focusDisplay(options?)',
      type: 'void',
      defaultValue: '-',
      description: 'Focuses the display button when rendered.',
    },
    {
      name: 'focusContent(options?)',
      type: 'void',
      defaultValue: '-',
      description: 'Focuses the first enabled interactive content element or the content surface.',
    },
  ];

  protected readonly apiSections: readonly ApiSection[] = [
    { id: 'inplace-api-models', title: 'Models', label: 'Inplace models', rows: this.models },
    { id: 'inplace-api-inputs', title: 'Inputs', label: 'Inplace inputs', rows: this.inputs },
    { id: 'inplace-api-outputs', title: 'Outputs', label: 'Inplace outputs', rows: this.outputs },
    {
      id: 'inplace-api-templates',
      title: 'Content and templates',
      label: 'Inplace templates',
      rows: this.templates,
    },
    { id: 'inplace-api-methods', title: 'Methods', label: 'Inplace methods', rows: this.methods },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-inplace-text',
      purpose: 'Component foreground color.',
      fallback: '--aeris-text',
    },
    {
      name: '--aeris-inplace-radius',
      purpose: 'Display and content corner radius.',
      fallback: '--aeris-radius-control',
    },
    {
      name: '--aeris-inplace-display-min-height',
      purpose: 'Minimum display-button height.',
      fallback: '--aeris-control-height',
    },
    {
      name: '--aeris-inplace-display-padding-block',
      purpose: 'Display-button block padding.',
      fallback: '--aeris-item-padding-y',
    },
    {
      name: '--aeris-inplace-display-padding-inline',
      purpose: 'Display-button inline padding.',
      fallback: '--aeris-item-padding-x',
    },
    {
      name: '--aeris-inplace-display-border',
      purpose: 'Display-button hover border.',
      fallback: '--aeris-border',
    },
    {
      name: '--aeris-inplace-display-hover',
      purpose: 'Interactive hover background.',
      fallback: '--aeris-surface-2',
    },
    {
      name: '--aeris-inplace-content-background',
      purpose: 'Active content background.',
      fallback: '--aeris-surface',
    },
    {
      name: '--aeris-inplace-content-border',
      purpose: 'Active content border.',
      fallback: '--aeris-border',
    },
    {
      name: '--aeris-inplace-content-padding',
      purpose: 'Active content padding.',
      fallback: '1rem',
    },
    {
      name: '--aeris-inplace-content-shadow',
      purpose: 'Active content shadow.',
      fallback: '--aeris-shadow-sm',
    },
    {
      name: '--aeris-inplace-close-size',
      purpose: 'Owned close-button size.',
      fallback: '1.75rem',
    },
    {
      name: '--aeris-inplace-close-icon-size',
      purpose: 'Owned close-icon size.',
      fallback: '0.75rem',
    },
  ];

  protected updateDraft(event: Event): void {
    this.draftName.set((event.target as HTMLInputElement).value);
  }

  protected activateControlled(): void {
    this.controlledActive.set(true);
  }

  protected deactivateControlled(): void {
    this.controlledActive.set(false);
  }

  protected toggleControlled(): void {
    this.controlledActive.update((active) => !active);
  }

  protected saveName(close: () => void): void {
    const name = this.draftName().trim() || this.savedName();
    this.savedName.set(name);
    this.draftName.set(name);
    this.editStatus.set(`Saved profile name as ${name}.`);
    close();
  }

  protected cancelName(close: () => void): void {
    this.draftName.set(this.savedName());
    this.editStatus.set('Editing cancelled.');
    close();
  }

  protected loadActivity(event: AerisInplaceStateEvent): void {
    if (!event.active) return;
    this.lazyLoaded.set(true);
    this.lazyActivations.update((count) => count + 1);
  }
}
