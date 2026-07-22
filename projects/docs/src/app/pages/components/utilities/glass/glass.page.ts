import { Component, signal } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisGlassModule } from '@aeris-ui/core/glass';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisPanelModule } from '@aeris-ui/core/panel';
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

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-glass-page',
  imports: [
    AerisAccordionModule,
    AerisButton,
    AerisCardModule,
    AerisGlassModule,
    AerisMenuModule,
    AerisPanelModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './glass.page.html',
  styleUrl: './glass.page.scss',
})
export class GlassPage {
  protected readonly glassEnabled = signal(true);
  protected readonly importCode = `import { AerisGlassModule } from '@aeris-ui/core/glass';`;

  protected readonly menuItems: readonly AerisMenuItem[] = [
    { label: 'Overview' },
    { label: 'Activity' },
    { label: 'Settings' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'glass-import', label: 'Import' },
    { id: 'glass-basic', label: 'Basic' },
    { id: 'glass-strength', label: 'Blur strength' },
    { id: 'glass-components', label: 'Aeris surfaces' },
    { id: 'glass-controlled', label: 'Controlled' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'glass-import', label: 'Import' },
    { id: 'glass-api-inputs', label: 'Inputs' },
    { id: 'glass-api-support', label: 'Supported surfaces' },
  ];

  protected readonly basicCssCode = `.glass-stage {
  position: relative;
  overflow: hidden;
  min-height: 16rem;
  display: grid;
  place-items: center;
  padding: 2rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-surface {
  width: min(100%, 30rem);
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--aeris-border) 70%, transparent);
  border-radius: var(--aeris-radius-lg);
  box-shadow: var(--aeris-shadow-sm);
}`;

  protected readonly strengthCssCode = `.glass-strength-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding: 2rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-strength-grid section {
  min-width: 0;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--aeris-border) 70%, transparent);
  border-radius: var(--aeris-radius-lg);
}

.glass-strength-grid h4,
.glass-strength-grid p {
  margin: 0;
}

.glass-strength-grid p {
  margin-top: 0.375rem;
  color: var(--aeris-text-2);
}

@media (max-width: 42rem) {
  .glass-strength-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly componentsTsCode = `protected readonly menuItems: readonly AerisMenuItem[] = [
  { label: 'Overview' },
  { label: 'Activity' },
  { label: 'Settings' },
];`;

  protected readonly componentsCssCode = `.glass-component-stage {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 2rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-component-stage aeris-accordion,
.glass-component-stage aeris-menu {
  align-self: start;
}

@media (max-width: 44rem) {
  .glass-component-stage {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`;

  protected readonly controlledTsCode = `protected readonly glassEnabled = signal(true);`;

  protected readonly controlledCssCode = `.glass-controlled-stage {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-controlled-stage aeris-card {
  width: min(100%, 32rem);
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisGlass',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables the glass treatment. A bare aerisGlass attribute enables it.',
    },
    {
      name: 'aerisGlassBlur',
      type: 'string',
      defaultValue: "''",
      description: 'Optional CSS length that overrides the shared blur radius for this surface.',
    },
    {
      name: 'aerisGlassBackground',
      type: 'string',
      defaultValue: "''",
      description: 'Optional translucent CSS color that overrides the shared glass background.',
    },
  ];

  protected readonly supportedSurfaces: readonly ApiRow[] = [
    {
      name: 'Content surfaces',
      type: 'Card, Panel, Accordion',
      defaultValue: 'supported',
      description: 'Applies blur to the owned surface while preserving projected content styling.',
    },
    {
      name: 'Navigation surfaces',
      type: 'Breadcrumb, Toolbar, Menu, TieredMenu, ContextMenu, MegaMenu, Menubar',
      defaultValue: 'supported',
      description: 'Applies to root surfaces and owned submenu panels where applicable.',
    },
    {
      name: 'Overlay surfaces',
      type: 'Dialog, Drawer, Popover, ConfirmPopup',
      defaultValue: 'supported',
      description: 'Styles the foreground surface independently from the backdrop blur.',
    },
    {
      name: 'Picker surfaces',
      type: 'AutoComplete, CascadeSelect, Select, TreeSelect, DatePicker',
      defaultValue: 'supported',
      description: 'Applies to the control and its owned panel without changing nested controls.',
    },
    {
      name: 'Native containers',
      type: 'div, section, article, aside, nav, form, header, footer, main',
      defaultValue: 'supported',
      description: 'Provides the same background and blur treatment to semantic application containers.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-glass-blur',
      purpose: 'Default blur radius for glass surfaces.',
      fallback: '0.25rem',
    },
    {
      name: '--aeris-glass-saturation',
      purpose: 'Backdrop color saturation applied with the blur.',
      fallback: '125%',
    },
    {
      name: '--aeris-glass-background',
      purpose: 'Translucent surface color shared by compatible surfaces.',
      fallback: '76% surface color',
    },
    {
      name: '--aeris-backdrop-blur',
      purpose: 'Default blur radius for modal masks and other blocking backdrops.',
      fallback: '0.25rem',
    },
  ];
}
