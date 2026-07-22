import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';
import { LucideDynamicIcon } from '@lucide/angular';
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
  selector: 'app-input-group-page',
  imports: [
    AerisButton,
    AerisCheckbox,
    AerisInputGroup,
    AerisInputText,
    AerisRadioButton,
    LucideDynamicIcon,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './input-group.page.html',
  styleUrl: './input-group.page.scss',
})
export class InputGroupPage {
  protected readonly icons = DOC_ICONS;
  protected readonly username = signal('');
  protected readonly price = signal('129');
  protected readonly selectedVisibility = signal('public');
  protected readonly includeArchived = signal(false);
  protected readonly email = signal('alex@');
  protected readonly emailTouched = signal(false);
  protected readonly emailInvalid = computed(
    () => this.emailTouched() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );
  protected readonly reactiveUrl = new FormControl('aeris-ui.dev');
  protected templateAmount = '250';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'input-group-basic', label: 'Basic' },
    { id: 'input-group-prefix-suffix', label: 'Prefix and suffix' },
    { id: 'input-group-icons', label: 'Icon addons' },
    { id: 'input-group-button', label: 'Button action' },
    { id: 'input-group-selection', label: 'Selection addons' },
    { id: 'input-group-stacked', label: 'Stacked addons' },
    { id: 'input-group-multiple', label: 'Multiple controls' },
    { id: 'input-group-sizes', label: 'Sizes' },
    { id: 'input-group-states', label: 'States' },
    { id: 'input-group-vertical', label: 'Vertical layout' },
    { id: 'input-group-validation', label: 'Validation' },
    { id: 'input-group-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'input-group-api-inputs', label: 'Inputs' },
    { id: 'input-group-api-addons', label: 'Addons' },
    { id: 'input-group-api-outputs', label: 'Outputs' },
  ];

  protected readonly importCode =
    `import { AerisInputGroup } from '@aeris-ui/core/input-group';`;

  protected readonly usernameCode = `protected readonly username = signal('');`;

  protected readonly validationCode = `protected readonly email = signal('alex@');
protected readonly emailTouched = signal(false);
protected readonly emailInvalid = computed(
  () =>
    this.emailTouched() &&
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.email()),
);`;

  protected readonly formsCode = `protected readonly reactiveUrl =
  new FormControl('aeris-ui.dev');

protected templateAmount = '250';`;

  protected readonly interfacesCode = `type AerisInputGroupSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputGroupAppearance = 'outline' | 'filled';
type AerisInputGroupMode = 'attached' | 'embedded';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'size', type: 'AerisInputGroupSize', defaultValue: "'md'", description: 'Controls addon height, font size, and grouped native-control size.' },
    { name: 'appearance', type: 'AerisInputGroupAppearance', defaultValue: "'outline'", description: 'Outlined or filled treatment for grouped controls, addons, and attached buttons.' },
    { name: 'mode', type: 'AerisInputGroupMode', defaultValue: "'attached'", description: 'Attached creates shared-addon groups. Embedded positions icon addons inside a normal-looking input.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Stacks group items vertically when horizontal space is constrained or the design needs stacked controls.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid to the group wrapper.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Applies disabled group styling. Keep projected controls disabled as well.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Expands the group to fill available inline space.' },
  ];
}
