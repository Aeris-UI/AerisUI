import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisProgressBarModule,
  type AerisProgressBarStep,
  type AerisProgressBarValueContext,
} from '@aeris-ui/core/progress-bar';
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
  selector: 'app-progress-bar-page',
  imports: [
    AerisButton,
    AerisProgressBarModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './progress-bar.page.html',
  styleUrl: './progress-bar.page.scss',
})
export class ProgressBarPage {
  protected readonly uploadValue = signal(35);
  protected readonly uploadStatus = computed(() => `${this.uploadValue()}% uploaded`);
  protected readonly orderStep = signal(1);
  protected readonly orderProgress = computed(() => this.orderStep() * 50);
  protected readonly steps: readonly AerisProgressBarStep[] = [
    { label: 'Queued', value: 0 },
    { label: 'Uploading', value: 50 },
    { label: 'Done', value: 100 },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'progress-bar-basic', label: 'Basic' },
    { id: 'progress-bar-dynamic', label: 'Dynamic' },
    { id: 'progress-bar-severity', label: 'Severity' },
    { id: 'progress-bar-template', label: 'Template' },
    { id: 'progress-bar-indeterminate', label: 'Indeterminate' },
    { id: 'progress-bar-steps', label: 'Steps' },
    { id: 'progress-bar-options', label: 'Options' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'progress-bar-api-inputs', label: 'Inputs' },
    { id: 'progress-bar-api-templates', label: 'Templates' },
    { id: 'progress-bar-api-content', label: 'Content' },
  ];

  protected readonly importCode = `import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';`;

  protected readonly actionsCssCode = `.progress-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

`;

  protected readonly stackCssCode = `.progress-stack {
  display: grid;
  gap: 1rem;
}`;

  protected readonly templateCssCode = `.progress-template-stack {
  display: grid;
  gap: 1rem;
}

.progress-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 700;
}`;

  protected readonly dynamicTsCode = `import { computed, signal } from '@angular/core';

protected readonly uploadValue = signal(35);
protected readonly uploadStatus = computed(() => \`\${this.uploadValue()}% uploaded\`);

protected increaseUpload(): void {
  this.uploadValue.update((value) => Math.min(100, value + 15));
}

protected resetUpload(): void {
  this.uploadValue.set(0);
}`;

  protected readonly templateTsCode = `import { type AerisProgressBarValueContext } from '@aeris-ui/core/progress-bar';

protected readonly fileSizeFormatter = (context: AerisProgressBarValueContext): string => {
  const total = 5000;
  const current = Math.round((context.percent / 100) * total);
  return \`\${current.toLocaleString()} KB / \${total.toLocaleString()} KB\`;
};`;

  protected readonly stepsTsCode = `import { computed, signal } from '@angular/core';
import { type AerisProgressBarStep } from '@aeris-ui/core/progress-bar';

protected readonly orderStep = signal(1);
protected readonly orderProgress = computed(() => this.orderStep() * 50);
protected readonly steps: readonly AerisProgressBarStep[] = [
  { label: 'Queued', value: 0 },
  { label: 'Uploading', value: 50 },
  { label: 'Done', value: 100 },
];

protected previousStep(): void {
  this.orderStep.update((step) => Math.max(0, step - 1));
}

protected nextStep(): void {
  this.orderStep.update((step) => Math.min(this.steps.length - 1, step + 1));
}`;

  protected readonly interfacesCode = `type AerisProgressBarMode = 'determinate' | 'indeterminate';
type AerisProgressBarSize = 'sm' | 'md' | 'lg';
type AerisProgressBarSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisProgressBarStep {
  readonly label: string;
  readonly value?: number;
}

interface AerisProgressBarValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}

interface AerisProgressBarStepContext {
  readonly $implicit: AerisProgressBarStep;
  readonly step: AerisProgressBarStep;
  readonly index: number;
  readonly active: boolean;
  readonly complete: boolean;
  readonly percent: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Host element ID.' },
    { name: 'value', type: 'number', defaultValue: '0', description: 'Current determinate value.' },
    { name: 'min', type: 'number', defaultValue: '0', description: 'Minimum determinate value.' },
    { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum determinate value.' },
    { name: 'mode', type: 'AerisProgressBarMode', defaultValue: "'determinate'", description: 'Determinate percentage or indeterminate activity.' },
    { name: 'severity', type: 'AerisProgressBarSeverity', defaultValue: "'primary'", description: 'Color accent for the filled track and completed steps.' },
    { name: 'size', type: 'AerisProgressBarSize', defaultValue: "'md'", description: 'Track height.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'true', description: 'Shows the value text inside determinate bars.' },
    { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Applies striped fill styling.' },
    { name: 'animated', type: 'boolean', defaultValue: 'false', description: 'Animates striped fill when enabled.' },
    { name: 'rounded', type: 'boolean', defaultValue: 'true', description: 'Uses pill-shaped track corners.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible label names the bar.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the bar.' },
    { name: 'ariaValueText', type: 'string', defaultValue: "''", description: 'Custom accessible value text.' },
    { name: 'steps', type: 'readonly AerisProgressBarStep[]', defaultValue: '[]', description: 'Optional visual step markers.' },
    { name: 'activeStep', type: 'number | null', defaultValue: 'null', description: 'Optional explicit active step index.' },
    { name: 'valueFormatter', type: '(AerisProgressBarValueContext) => string | null', defaultValue: 'null', description: 'Formats visible and accessible value text when no value template is used.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisProgressBarValue', type: 'AerisProgressBarValueContext', defaultValue: 'percentage text', description: 'Custom visible value content.' },
    { name: 'aerisProgressBarStep', type: 'AerisProgressBarStepContext', defaultValue: 'step label', description: 'Custom visual step label content.' },
  ];

  protected readonly content: readonly ApiRow[] = [
    { name: 'default content', type: 'none', defaultValue: '-', description: 'ProgressBar renders from inputs and templates only.' },
  ];

  protected readonly fileSizeFormatter = (context: AerisProgressBarValueContext): string => {
    const total = 5000;
    const current = Math.round((context.percent / 100) * total);
    return `${current.toLocaleString()} KB / ${total.toLocaleString()} KB`;
  };

  protected increaseUpload(): void {
    this.uploadValue.update((value) => Math.min(100, value + 15));
  }

  protected resetUpload(): void {
    this.uploadValue.set(0);
  }

  protected previousStep(): void {
    this.orderStep.update((step) => Math.max(0, step - 1));
  }

  protected nextStep(): void {
    this.orderStep.update((step) => Math.min(this.steps.length - 1, step + 1));
  }
}
