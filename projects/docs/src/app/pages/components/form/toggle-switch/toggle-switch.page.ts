import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisToggleSwitch,
  type AerisToggleSwitchChangeEvent,
} from '@aeris-ui/core/toggle-switch';
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
  selector: 'app-toggle-switch-page',
  imports: [
    AerisToggleSwitch,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './toggle-switch.page.html',
  styleUrl: './toggle-switch.page.scss',
})
export class ToggleSwitchPage {
  protected readonly notifications = signal(true);
  protected readonly lastChange = signal('No interaction');
  protected readonly consent = signal(false);
  protected readonly consentTouched = signal(false);
  protected readonly consentInvalid = computed(
    () => this.consentTouched() && !this.consent(),
  );
  protected readonly reactiveEnabled = new FormControl(false);
  protected templateEnabled = true;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'toggle-switch-basic', label: 'Basic' },
    { id: 'toggle-switch-model', label: 'Signal model' },
    { id: 'toggle-switch-sizes', label: 'Sizes' },
    { id: 'toggle-switch-label-position', label: 'Label position' },
    { id: 'toggle-switch-rich-label', label: 'Rich label' },
    { id: 'toggle-switch-states', label: 'States' },
    { id: 'toggle-switch-validation', label: 'Validation' },
    { id: 'toggle-switch-native-form', label: 'Native form values' },
    { id: 'toggle-switch-angular-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'toggle-switch-api-inputs', label: 'Inputs' },
    { id: 'toggle-switch-api-outputs', label: 'Outputs' },
    { id: 'toggle-switch-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';`;

  protected readonly modelCode = `protected readonly notifications = signal(true);
protected readonly lastChange = signal('No interaction');

protected recordChange(
  event: AerisToggleSwitchChangeEvent,
): void {
  this.lastChange.set(
    event.checked ? 'Notifications enabled' : 'Notifications disabled',
  );
}`;

  protected readonly validationCode = `protected readonly consent = signal(false);
protected readonly consentTouched = signal(false);
protected readonly consentInvalid = computed(
  () => this.consentTouched() && !this.consent(),
);`;

  protected readonly formsCode = `protected readonly reactiveEnabled =
  new FormControl(false);

protected templateEnabled = true;`;

  protected readonly interfacesCode = `type AerisToggleSwitchSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

type AerisToggleSwitchLabelPosition =
  | 'start'
  | 'end';

interface AerisToggleSwitchChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly value: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'checked', type: 'boolean (model)', defaultValue: 'false', description: 'Current on/off state with two-way binding support.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the internal native checkbox.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native form field name.' },
    { name: 'value', type: 'string', defaultValue: "'on'", description: 'Value submitted by a native form while checked.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Optional visible text label. Projected label content is also supported.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name when no visible label content exists.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of external elements that label the switch.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'size', type: 'AerisToggleSwitchSize', defaultValue: "'md'", description: 'Track, thumb, gap, and label size.' },
    { name: 'labelPosition', type: 'AerisToggleSwitchLabelPosition', defaultValue: "'end'", description: 'Places visible label content before or after the control.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction and native form submission.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required validation semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and synchronizes aria-invalid.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'checkedChange', type: 'boolean', defaultValue: '-', description: 'Emitted automatically by the checked model.' },
    { name: 'checkedInput', type: 'boolean', defaultValue: '-', description: 'Emitted when user interaction or a public method changes state.' },
    { name: 'changed', type: 'AerisToggleSwitchChangeEvent', defaultValue: '-', description: 'Provides the native event, checked state, and submitted value.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the native switch receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the native switch loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the native switch.' },
    { name: 'toggle()', type: 'void', defaultValue: '-', description: 'Toggles an enabled switch and moves focus to it.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Sets checked state to false.' },
  ];

  protected recordChange(event: AerisToggleSwitchChangeEvent): void {
    this.lastChange.set(
      event.checked ? 'Notifications enabled' : 'Notifications disabled',
    );
  }
}
