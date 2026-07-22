import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisCheckbox,
  type AerisCheckboxChangeEvent,
} from '@aeris-ui/core/checkbox';
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

interface Interest {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'app-checkbox-page',
  imports: [
    AerisCheckbox,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './checkbox.page.html',
  styleUrl: './checkbox.page.scss',
})
export class CheckboxPage {
  protected readonly notifications = signal(true);
  protected readonly termsAccepted = signal(false);
  protected readonly lastChange = signal('No interaction');
  protected readonly reactiveChecked = new FormControl(false);
  protected templateChecked = true;
  protected readonly selectedInterests = signal<readonly string[]>(['accessibility']);
  protected readonly interests: readonly Interest[] = [
    { value: 'angular', label: 'Angular', description: 'Framework releases and patterns' },
    { value: 'accessibility', label: 'Accessibility', description: 'Inclusive interface guidance' },
    { value: 'performance', label: 'Performance', description: 'Rendering and delivery techniques' },
  ];
  protected readonly allSelected = computed(
    () => this.selectedInterests().length === this.interests.length,
  );
  protected readonly partiallySelected = computed(
    () => this.selectedInterests().length > 0 && !this.allSelected(),
  );

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'checkbox-basic', label: 'Basic' },
    { id: 'checkbox-model', label: 'Signal model' },
    { id: 'checkbox-indeterminate', label: 'Indeterminate' },
    { id: 'checkbox-group', label: 'Selection group' },
    { id: 'checkbox-sizes', label: 'Sizes' },
    { id: 'checkbox-label-position', label: 'Label position' },
    { id: 'checkbox-rich-label', label: 'Rich label' },
    { id: 'checkbox-states', label: 'States' },
    { id: 'checkbox-native-form', label: 'Native form values' },
    { id: 'checkbox-angular-forms', label: 'Angular Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'checkbox-api-inputs', label: 'Inputs' },
    { id: 'checkbox-api-outputs', label: 'Outputs' },
    { id: 'checkbox-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisCheckbox } from '@aeris-ui/core/checkbox';`;
  protected readonly modelCode = `protected readonly notifications = signal(true);`;
  protected readonly formsCode = `protected readonly reactiveChecked =
  new FormControl(false);

protected templateChecked = true;`;
  protected readonly groupCode = `protected readonly selectedInterests =
  signal<readonly string[]>(['accessibility']);

protected isInterestSelected(value: string): boolean {
  return this.selectedInterests().includes(value);
}

protected setInterest(value: string, checked: boolean): void {
  this.selectedInterests.update((current) =>
    checked
      ? [...current, value]
      : current.filter((item) => item !== value),
  );
}`;
  protected readonly indeterminateCode = `protected readonly allSelected = computed(
  () => this.selectedInterests().length === this.interests.length,
);

protected readonly partiallySelected = computed(
  () => this.selectedInterests().length > 0 && !this.allSelected(),
);`;
  protected readonly interfacesCode = `type AerisCheckboxSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisCheckboxLabelPosition = 'start' | 'end';

interface AerisCheckboxChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly indeterminate: boolean;
  readonly value: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'checked', type: 'boolean (model)', defaultValue: 'false', description: 'Boolean selection state and Angular Signal Forms checkbox contract.' },
    { name: 'indeterminate', type: 'boolean (model)', defaultValue: 'false', description: 'Mixed visual and native state. User activation clears it.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the native checkbox.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native form field name.' },
    { name: 'value', type: 'string', defaultValue: "'on'", description: 'Value submitted by a native form when checked.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Optional text label. Projected label content is also supported.' },
    { name: 'ariaLabel', type: 'string | undefined', defaultValue: 'undefined', description: 'Accessible name for a checkbox without visible label content.' },
    { name: 'ariaLabelledby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of external labeling elements.' },
    { name: 'ariaDescribedby', type: 'string | undefined', defaultValue: 'undefined', description: 'IDs of help and validation messages.' },
    { name: 'size', type: 'AerisCheckboxSize', defaultValue: "'md'", description: 'Control and label size.' },
    { name: 'labelPosition', type: 'AerisCheckboxLabelPosition', defaultValue: "'end'", description: 'Places the visible label before or after the control.' },
    { name: 'tabIndex', type: 'number', defaultValue: '0', description: 'Native tab order value for composite widgets that manage focus.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables native interaction and form submission.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes native required validation semantics.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
  ];

  protected isInterestSelected(value: string): boolean {
    return this.selectedInterests().includes(value);
  }

  protected setInterest(value: string, checked: boolean): void {
    this.selectedInterests.update((current) => {
      if (checked && !current.includes(value)) return [...current, value];
      if (!checked) return current.filter((item) => item !== value);
      return current;
    });
  }

  protected setAll(checked: boolean): void {
    this.selectedInterests.set(checked ? this.interests.map((item) => item.value) : []);
  }

  protected recordChange(event: AerisCheckboxChangeEvent): void {
    this.lastChange.set(`${event.value}: ${event.checked ? 'checked' : 'unchecked'}`);
  }
}
