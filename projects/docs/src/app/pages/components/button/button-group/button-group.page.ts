import { Component, computed, signal } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { AerisButtonGroup, type AerisButtonGroupValue } from '@aeris-ui/core/button-group';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideAlignCenter,
  LucideAlignLeft,
  LucideAlignRight,
  LucideDynamicIcon,
} from '@lucide/angular';

import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { ButtonDemoComponent } from '../shared/button-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-button-group-page',
  imports: [
    AerisButtonGroup,
    AerisMessageModule,
    FormField,
    ReactiveFormsModule,
    LucideDynamicIcon,
    AerisTabsModule,
    ButtonDemoComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    CodeBlockComponent,
    ProjectedCode,
  ],
  templateUrl: './button-group.page.html',
  styleUrl: '../shared/button-docs.scss',
})
export class ButtonGroupPage {
  protected readonly single = signal<AerisButtonGroupValue>('day');
  protected readonly multiple = signal<AerisButtonGroupValue>(['bold']);
  protected readonly optional = signal<AerisButtonGroupValue>(null);
  protected readonly controlled = signal<AerisButtonGroupValue>('one');
  protected readonly groupDisabled = signal(false);
  protected readonly selectionData = signal<{ choice: AerisButtonGroupValue }>({ choice: null });
  protected readonly selectionForm = form(this.selectionData, (schema) => required(schema.choice));
  protected readonly selectionError = computed(
    () => this.selectionForm.choice().touched() && this.selectionForm.choice().invalid(),
  );
  protected readonly selectionControl = new FormControl<AerisButtonGroupValue>(['one']);
  protected readonly itemApi: readonly ApiRow[] = [
    {
      name: 'aerisButtonGroupItem',
      type: 'directive',
      defaultValue: 'not applied',
      description:
        'Opt-in native button[aerisButton] member. Direct child of a ButtonGroup; sets type=button. Do not combine with aerisButtonToggle or child form registrations. Ordinary wrappers/links remain action-only.',
    },
    {
      name: 'value',
      type: 'string',
      defaultValue: 'required',
      description: 'Unique stable item identity; required for each selectable member.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Disables this item and removes it from arrow navigation; group disabled also applies.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Uses existing Button loading presentation and skips this item during navigation.',
    },
    {
      name: 'focus(options?)',
      type: 'method: void',
      defaultValue: '—',
      description: 'Focuses the native member. A disabled native button cannot receive focus.',
    },
  ];
  protected readonly icons = {
    AlignLeft: LucideAlignLeft,
    AlignCenter: LucideAlignCenter,
    AlignRight: LucideAlignRight,
  };

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'group-basic', label: 'Basic' },
    { id: 'group-single', label: 'Single selection' },
    { id: 'group-multiple', label: 'Multiple selection' },
    { id: 'group-optional', label: 'Empty selection' },
    { id: 'group-controlled', label: 'Controlled selection' },
    { id: 'group-signal-forms', label: 'Signal Forms' },
    { id: 'group-reactive-forms', label: 'Reactive Forms' },
    { id: 'group-wrapper', label: 'Wrapper buttons' },
    { id: 'group-mixed', label: 'Mixed treatments' },
    { id: 'group-icons', label: 'Icons' },
    { id: 'group-vertical', label: 'Vertical' },
    { id: 'group-fluid', label: 'Fluid' },
    { id: 'group-responsive', label: 'Responsive stacking' },
    { id: 'group-states', label: 'States' },
    { id: 'group-links', label: 'Buttons and links' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'group-api-inputs', label: 'Inputs' },
    { id: 'group-api-outputs', label: 'Outputs' },
    { id: 'group-api-content', label: 'Content' },
    { id: 'group-api-items', label: 'Selection items' },
    { id: 'group-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisButtonGroup } from '@aeris-ui/core/button-group';`;

  protected readonly interfacesCode = `type AerisButtonGroupOrientation =
  | 'horizontal'
  | 'vertical';

type AerisButtonGroupSelectionMode = 'none' | 'single' | 'multiple';
type AerisButtonGroupValue = string | readonly string[] | null;`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'selectionMode',
      type: 'AerisButtonGroupSelectionMode',
      defaultValue: "'none'",
      description:
        "Options: 'none', 'single', 'multiple'. Opt in with native aerisButtonGroupItem children; none preserves independent actions.",
    },
    {
      name: 'value',
      type: 'model<AerisButtonGroupValue>',
      defaultValue: 'null',
      description:
        'single: string or null. multiple: readonly string[] (bind [] initially). Controlled updates and Signal Forms share this model; mode changes do not rewrite supplied values.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Disables selectable members; also receives forms-disabled state. Does not disable ordinary action groups.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Prevents clearing the final selection. Use Signal Forms required or Angular Validators.required for validity; this input is not itself a validator.',
    },
    {
      name: 'allowEmpty',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'In single mode, permits clicking the selected item to clear it unless required is true. Multiple mode permits clearing unless required.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Invalid appearance and aria-invalid for selection groups, gated by touched when provided.',
    },
    {
      name: 'touched',
      type: 'boolean | null',
      defaultValue: 'null',
      description:
        'false hides invalid presentation; true reveals it; null preserves manual invalid=true behavior. Signal Forms supplies it automatically.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of existing hint/error text describing the group.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'Accessible name for the group when no visible label exists.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'ID of visible text that labels the group.',
    },
    {
      name: 'orientation',
      type: 'AerisButtonGroupOrientation',
      defaultValue: "'horizontal'",
      description:
        "Connects child controls horizontally or vertically. Options: 'horizontal', 'vertical'.",
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Fills the available width and distributes children evenly.',
    },
    {
      name: 'responsive',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Stacks a horizontal group vertically below 40rem.',
    },
  ];
}
