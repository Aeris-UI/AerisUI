import { Component } from '@angular/core';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

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
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'group-basic', label: 'Basic' },
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
  ];

  protected readonly importCode =
    `import { AerisButtonGroup } from '@aeris-ui/core/button-group';`;

  protected readonly interfacesCode = `type AerisButtonGroupOrientation =
  | 'horizontal'
  | 'vertical';`;

  protected readonly inputs: readonly ApiRow[] = [
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
      description: 'Connects child controls horizontally or vertically.',
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
