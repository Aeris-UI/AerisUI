import { Component, signal } from '@angular/core';
import {
  AerisButton,
  type AerisButtonSeverity,
} from '@aeris-ui/core/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { ButtonDemoComponent } from '../shared/button-demo.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-button-page',
  imports: [
    AerisButton,
    LucideDynamicIcon,
    AerisTabsModule,
    ButtonDemoComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    CodeBlockComponent,
    ProjectedCode,
  ],
  templateUrl: './button.page.html',
  styleUrl: '../shared/button-docs.scss',
})
export class ButtonPage {
  protected readonly icons = DOC_ICONS;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'feature-basic', label: 'Basic' },
    { id: 'feature-wrapper', label: 'Wrapper component' },
    { id: 'feature-variants', label: 'Variants' },
    { id: 'feature-severity', label: 'Severity' },
    { id: 'feature-sizes', label: 'Sizes' },
    { id: 'feature-icons', label: 'Icons and positions' },
    { id: 'feature-loading', label: 'Loading' },
    { id: 'feature-shape', label: 'Raised, rounded, fluid' },
    { id: 'feature-badge', label: 'Badge' },
    { id: 'feature-templates', label: 'Custom templates' },
    { id: 'feature-links', label: 'Native links' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'api-directive-inputs', label: 'Directive inputs' },
    { id: 'api-component-inputs', label: 'Component inputs' },
    { id: 'api-emitters', label: 'Emitters' },
    { id: 'api-templates', label: 'Templates' },
  ];
  protected readonly importCode =
    `import { AerisButton } from '@aeris-ui/core/button';`;
  protected readonly wrapperTsCode = `protected readonly clickCount = signal(0);

protected createProject(event: MouseEvent): void {
  this.clickCount.update((count) => count + 1);
  // Create the project here.
}`;
  protected readonly loadingTsCode = `protected readonly saving = signal(false);

protected save(): void {
  this.saving.set(true);

  this.projectService.save().subscribe({
    complete: () => this.saving.set(false),
    error: () => this.saving.set(false),
  });
}`;
  protected readonly interfacesCode = `type AerisButtonVariant =
  | 'primary' | 'secondary' | 'outline'
  | 'ghost' | 'danger' | 'link';

type AerisButtonSeverity =
  | 'primary' | 'secondary' | 'success' | 'info'
  | 'warning' | 'danger' | 'contrast';

type AerisButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

interface AerisButtonIconTemplateContext {
  readonly loading: boolean;
}

interface AerisButtonContentTemplateContext {
  readonly loading: boolean;
  readonly disabled: boolean;
}`;
  protected readonly loading = signal(false);
  protected readonly clickCount = signal(0);
  protected readonly severities: readonly AerisButtonSeverity[] = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'contrast',
  ];

  protected readonly directiveInputs: readonly ApiRow[] = [
    { name: 'variant', type: 'AerisButtonVariant', defaultValue: "'primary'", description: 'Visual treatment of the button.' },
    { name: 'severity', type: 'AerisButtonSeverity', defaultValue: "'primary'", description: 'Semantic color applied to the selected variant.' },
    { name: 'size', type: 'AerisButtonSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'iconPosition', type: 'AerisButtonIconPosition', defaultValue: "'left'", description: 'Sets icon layout direction. Native projected content follows DOM order; wrapper icon templates are positioned automatically.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Displays progress and exposes aria-busy.' },
    { name: 'showSpinner', type: 'boolean', defaultValue: 'true', description: 'Controls the built-in loading spinner.' },
    { name: 'iconOnly', type: 'boolean', defaultValue: 'false', description: 'Creates a square icon button. Requires an accessible name.' },
    { name: 'raised', type: 'boolean', defaultValue: 'false', description: 'Adds elevation.' },
    { name: 'rounded', type: 'boolean', defaultValue: 'false', description: 'Uses a pill-shaped radius.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
    { name: 'plain', type: 'boolean', defaultValue: 'false', description: 'Overrides semantic colors with a neutral treatment.' },
    { name: 'text', type: 'boolean', defaultValue: 'false', description: "Compatibility alias for variant='ghost'." },
    { name: 'outlined', type: 'boolean', defaultValue: 'false', description: "Compatibility alias for variant='outline'." },
    { name: 'link', type: 'boolean', defaultValue: 'false', description: "Compatibility alias for variant='link'." },
  ];

  protected readonly componentInputs: readonly ApiRow[] = [
    { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: 'Native button type.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Text rendered inside the button.' },
    { name: 'badge', type: 'string | undefined', defaultValue: 'undefined', description: 'Optional badge value.' },
    { name: 'badgeSeverity', type: 'AerisButtonSeverity', defaultValue: "'secondary'", description: 'Semantic badge color.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name, required for icon-only wrapper buttons.' },
    { name: 'tabIndex', type: 'number | undefined', defaultValue: 'undefined', description: 'Native tabindex override.' },
    { name: 'autofocus', type: 'boolean', defaultValue: 'false', description: 'Requests focus when rendered.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction.' },
    ...this.directiveInputs.filter((row) => row.name !== 'showSpinner'),
    { name: 'contentTemplate', type: 'TemplateRef<AerisButtonContentTemplateContext>', defaultValue: 'undefined', description: 'Replaces all default content and receives effective loading and disabled state.' },
    { name: 'iconTemplate', type: 'TemplateRef<AerisButtonIconTemplateContext>', defaultValue: 'undefined', description: 'Custom idle icon.' },
    { name: 'loadingIconTemplate', type: 'TemplateRef<AerisButtonIconTemplateContext>', defaultValue: 'undefined', description: 'Custom loading indicator.' },
  ];

  protected toggleLoading(): void {
    this.loading.set(true);
    globalThis.setTimeout(() => this.loading.set(false), 1600);
  }

  protected createProject(_event: MouseEvent): void {
    this.clickCount.update((count) => count + 1);
  }

}
