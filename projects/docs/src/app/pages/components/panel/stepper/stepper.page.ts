import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisStepperModule,
  type AerisStepperChangeEvent,
} from '@aeris-ui/core/stepper';
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
  selector: 'app-stepper-page',
  imports: [
    AerisButton,
    AerisStepperModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './stepper.page.html',
  styleUrl: './stepper.page.scss',
})
export class StepperPage {
  protected readonly basicStep = signal('account');
  protected readonly stepsOnlyStep = signal('build');
  protected readonly controlledStep = signal('profile');
  protected readonly linearStep = signal('details');
  protected readonly verticalStep = signal('draft');
  protected readonly templateStep = signal('plan');
  protected readonly validationStep = signal('shipping');
  protected readonly disabledStep = signal('details');
  protected readonly customStep = signal('scope');
  protected readonly eventText = signal('Profile is active.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'stepper-basic', label: 'Basic' },
    { id: 'stepper-steps-only', label: 'Steps only' },
    { id: 'stepper-controlled', label: 'Controlled state' },
    { id: 'stepper-linear', label: 'Linear flow' },
    { id: 'stepper-vertical', label: 'Vertical' },
    { id: 'stepper-templates', label: 'Templates' },
    { id: 'stepper-validation', label: 'Validation state' },
    { id: 'stepper-disabled', label: 'Disabled state' },
    { id: 'stepper-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'stepper-api-inputs', label: 'Stepper inputs' },
    { id: 'stepper-api-models', label: 'Models' },
    { id: 'stepper-api-outputs', label: 'Outputs' },
    { id: 'stepper-api-step-inputs', label: 'Step inputs' },
    { id: 'stepper-api-templates', label: 'Templates' },
    { id: 'stepper-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisStepperModule } from '@aeris-ui/core/stepper';`;

  protected readonly basicTsCode = `protected readonly basicStep = signal('account');`;

  protected readonly stepsOnlyTsCode = `protected readonly stepsOnlyStep = signal('build');`;

  protected readonly controlledTsCode = `protected readonly controlledStep = signal('profile');
protected readonly eventText = signal('Profile is active.');

protected recordStepChange(event: AerisStepperChangeEvent): void {
  this.eventText.set(\`\${event.value} is active.\`);
}`;

  protected readonly linearTsCode = `protected readonly linearStep = signal('details');`;

  protected readonly verticalTsCode = `protected readonly verticalStep = signal('draft');`;

  protected readonly templateTsCode = `protected readonly templateStep = signal('plan');`;

  protected readonly validationTsCode = `protected readonly validationStep = signal('shipping');`;

  protected readonly disabledTsCode = `protected readonly disabledStep = signal('details');`;

  protected readonly customTsCode = `protected readonly customStep = signal('scope');`;

  protected readonly controlsCssCode = `.stepper-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stepper-status {
  margin-top: 0.75rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly verticalCssCode = `.vertical-stepper-demo {
  min-height: 16rem;
}`;

  protected readonly templateCssCode = `.custom-step-header {
  display: grid;
  gap: 0.15rem;
}

.custom-step-header strong {
  color: var(--text);
}

.custom-step-header small {
  color: var(--text-3);
  font-size: 0.75rem;
}

.custom-step-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: currentColor;
}`;

  protected readonly customCssCode = `.brand-stepper {
  --aeris-stepper-active-border: var(--aeris-primary);
  --aeris-stepper-active-background: color-mix(
    in srgb,
    var(--aeris-primary) 18%,
    var(--aeris-surface)
  );
  --aeris-stepper-complete-border: var(--aeris-primary-text);
  --aeris-stepper-panel-background: color-mix(
    in srgb,
    var(--aeris-primary) 7%,
    var(--aeris-surface)
  );
  --aeris-stepper-panel-radius: 1.35rem;
}`;

  protected readonly interfacesCode = `type AerisStepperOrientation = 'horizontal' | 'vertical';
type AerisStepperActivationMode = 'automatic' | 'manual';
type AerisStepperSize = 'sm' | 'md' | 'lg';
type AerisStepperVariant = 'line' | 'contained';

interface AerisStepperChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
  readonly index: number;
}

interface AerisStepTemplateContext {
  readonly $implicit: boolean;
  readonly selected: boolean;
  readonly active: boolean;
  readonly completed: boolean;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly optional: boolean;
  readonly index: number;
  readonly value: string;
  readonly label: string;
  readonly description: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'orientation', type: 'AerisStepperOrientation', defaultValue: "'horizontal'", description: 'Lays out step headers horizontally or vertically.' },
    { name: 'activationMode', type: 'AerisStepperActivationMode', defaultValue: "'automatic'", description: 'Selects focused steps automatically or waits for Enter/Space in manual mode.' },
    { name: 'linear', type: 'boolean', defaultValue: 'false', description: 'Prevents skipping ahead by allowing only previous steps, the active step, and the immediate next step.' },
    { name: 'stepsOnly', type: 'boolean', defaultValue: 'false', description: 'Shows only the step indicators and labels without rendering an active content panel.' },
    { name: 'size', type: 'AerisStepperSize', defaultValue: "'md'", description: 'Controls trigger and indicator sizing.' },
    { name: 'variant', type: 'AerisStepperVariant', defaultValue: "'line'", description: 'Uses an open line layout or contained header surface.' },
    { name: 'optionalLabel', type: 'string', defaultValue: "'Optional'", description: 'Text rendered for optional steps without a custom header.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the step list.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that names the step list.' },
    { name: 'panelTabIndex', type: '0 | -1', defaultValue: '0', description: 'Tab index applied to the active step panel.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'value', type: 'string', defaultValue: "''", description: 'Current active step value.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'string', defaultValue: '-', description: 'Emitted by the value model.' },
    { name: 'changed', type: 'AerisStepperChangeEvent', defaultValue: '-', description: 'Emitted after the active step changes.' },
    { name: 'stepFocused', type: 'string', defaultValue: '-', description: 'Emitted when a step trigger receives focus.' },
  ];

  protected readonly stepInputs: readonly ApiRow[] = [
    { name: 'value', type: 'string', defaultValue: 'required', description: 'Unique step value used for selection and events.' },
    { name: 'label', type: 'string', defaultValue: 'required', description: 'Default visible step label.' },
    { name: 'description', type: 'string', defaultValue: "''", description: 'Optional supporting text below the label.' },
    { name: 'optional', type: 'boolean', defaultValue: 'false', description: 'Marks the step with optional supporting text.' },
    { name: 'completed', type: 'boolean', defaultValue: 'false', description: 'Marks the step as complete.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Marks the step with invalid state and aria-invalid.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables step selection and keyboard focus.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisStepHeader', type: 'AerisStepTemplateContext', defaultValue: 'label, description, optional label', description: 'Custom header content for a single step.' },
    { name: 'aerisStepIndicator', type: 'AerisStepTemplateContext', defaultValue: 'step number or check mark', description: 'Custom indicator for a single step or all steps when placed directly under Stepper.' },
    { name: 'default step content', type: 'content projection', defaultValue: '-', description: 'Active panel content rendered for the selected step unless stepsOnly is enabled.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'select(value, event?)', type: '(string, Event | null) => void', defaultValue: '-', description: 'Selects a reachable step by value.' },
    { name: 'next(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Moves to the next reachable enabled step.' },
    { name: 'previous(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Moves to the previous enabled step.' },
    { name: 'focusStep(value, options?)', type: '(string, FocusOptions) => void', defaultValue: '-', description: 'Moves focus to a reachable enabled step trigger.' },
  ];

  protected recordStepChange(event: AerisStepperChangeEvent): void {
    this.eventText.set(`${event.value} is active.`);
  }
}
