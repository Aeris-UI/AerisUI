import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisRadioButton,
  type AerisRadioButtonChangeEvent,
} from '@aeris-ui/core/radio-button';
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

interface Plan {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'app-radio-button-page',
  imports: [
    AerisRadioButton,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './radio-button.page.html',
  styleUrl: './radio-button.page.scss',
})
export class RadioButtonPage {
  protected readonly visibility = signal<string | null>('private');
  protected readonly selectedPlan = signal<string | null>('team');
  protected readonly notificationChannel = signal<string | null>('email');
  protected readonly lastChange = signal('No interaction');
  protected readonly reactivePlan = new FormControl<string | null>('team');
  protected templatePlan: string | null = 'starter';

  protected readonly plans: readonly Plan[] = [
    {
      value: 'starter',
      label: 'Starter',
      description: 'Essential controls for a small product.',
    },
    {
      value: 'team',
      label: 'Team',
      description: 'Collaboration and shared configuration.',
    },
    {
      value: 'scale',
      label: 'Scale',
      description: 'Governance for larger design systems.',
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'radio-basic', label: 'Basic group' },
    { id: 'radio-model', label: 'Signal model' },
    { id: 'radio-rich-options', label: 'Rich options' },
    { id: 'radio-sizes', label: 'Sizes' },
    { id: 'radio-label-position', label: 'Label position' },
    { id: 'radio-states', label: 'States' },
    { id: 'radio-native-form', label: 'Native form values' },
    { id: 'radio-angular-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'radio-api-inputs', label: 'Inputs' },
    { id: 'radio-api-outputs', label: 'Outputs' },
    { id: 'radio-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisRadioButton } from '@aeris-ui/core/radio-button';`;
  protected readonly basicCode =
    `protected readonly visibility = signal<string | null>('private');`;
  protected readonly modelCode =
    `protected readonly notificationChannel = signal<string | null>('email');`;
  protected readonly richOptionsCode = `interface Plan {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

protected readonly selectedPlan = signal<string | null>('team');
protected readonly plans: readonly Plan[] = [
  { value: 'starter', label: 'Starter', description: 'Essential controls.' },
  { value: 'team', label: 'Team', description: 'Shared configuration.' },
  { value: 'scale', label: 'Scale', description: 'Design-system governance.' },
];`;
  protected readonly formsCode = `protected readonly reactivePlan =
  new FormControl<string | null>('team');

protected templatePlan: string | null = 'starter';`;
  protected readonly interfacesCode = `type AerisRadioButtonSize =
  'xs' | 'sm' | 'md' | 'lg';

type AerisRadioButtonLabelPosition = 'start' | 'end';

interface AerisRadioButtonChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'selected', type: 'string | null (model)', defaultValue: 'null', description: 'Selected value shared by every radio in a group.' },
    { name: 'value', type: 'string', defaultValue: 'required', description: 'Value selected and submitted by this option.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native radio group name. Use the same value for related options.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the native radio input.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Optional text label. Projected label content is also supported.' },
    { name: 'size', type: 'AerisRadioButtonSize', defaultValue: "'md'", description: 'Control and label size.' },
    { name: 'labelPosition', type: 'AerisRadioButtonLabelPosition', defaultValue: "'end'", description: 'Places the visible label before or after the control.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables native interaction and form participation.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Applies native required validation to the group.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for an option without visible label content.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of external labeling elements.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
  ];

  protected recordChange(event: AerisRadioButtonChangeEvent): void {
    this.lastChange.set(`Selected ${event.value}`);
  }
}
