import { Component, computed, signal } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
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
  selector: 'app-icon-field-page',
  imports: [
    AerisTextarea,
    AerisIconField,
    AerisInputText,
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
  templateUrl: './icon-field.page.html',
  styleUrl: './icon-field.page.scss',
})
export class IconFieldPage {
  protected readonly icons = DOC_ICONS;
  protected readonly search = signal('');
  protected readonly email = signal('alex@');
  protected readonly emailTouched = signal(false);
  protected readonly emailInvalid = computed(
    () => this.emailTouched() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );
  protected readonly reactiveSearch = new FormControl('Aeris');
  protected templateSearch = 'Components';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'icon-field-basic', label: 'Basic' },
    { id: 'icon-field-position', label: 'Icon position' },
    { id: 'icon-field-multiple', label: 'Multiple icons' },
    { id: 'icon-field-aeris-input', label: 'Aeris input' },
    { id: 'icon-field-sizes', label: 'Sizes' },
    { id: 'icon-field-states', label: 'States' },
    { id: 'icon-field-textarea', label: 'Textarea' },
    { id: 'icon-field-validation', label: 'Validation' },
    { id: 'icon-field-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'icon-field-api-inputs', label: 'Inputs' },
    { id: 'icon-field-api-directives', label: 'Directives' },
    { id: 'icon-field-api-outputs', label: 'Outputs' },
  ];

  protected readonly importCode =
    `import { AerisIconField } from '@aeris-ui/core/icon-field';`;

  protected readonly searchCode = `protected readonly search = signal('');`;

  protected readonly validationCode = `protected readonly email = signal('alex@');
protected readonly emailTouched = signal(false);
protected readonly emailInvalid = computed(
  () =>
    this.emailTouched() &&
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.email()),
);`;

  protected readonly formsCode = `protected readonly reactiveSearch =
  new FormControl('Aeris');

protected templateSearch = 'Components';`;

  protected readonly interfacesCode = `type AerisIconFieldSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisIconFieldAppearance = 'outline' | 'filled';
type AerisIconFieldDensity = 'comfortable' | 'compact';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Places content marked with aerisIcon before or after the projected control.' },
    { name: 'size', type: 'AerisIconFieldSize', defaultValue: "'md'", description: 'Controls height, padding, icon size, and text size.' },
    { name: 'appearance', type: 'AerisIconFieldAppearance', defaultValue: "'outline'", description: 'Outlined or filled field surface.' },
    { name: 'density', type: 'AerisIconFieldDensity', defaultValue: "'comfortable'", description: 'Adjusts spacing between icon and control.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid to the field wrapper.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Applies disabled field styling. Keep the projected control disabled as well.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Applies read-only field styling. Keep the projected control read-only as well.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Expands the field to fill the available inline space.' },
  ];
}
