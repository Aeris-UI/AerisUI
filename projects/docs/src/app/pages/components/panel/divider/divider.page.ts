import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';
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
  selector: 'app-divider-page',
  imports: [
    AerisDivider,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './divider.page.html',
  styleUrl: './divider.page.scss',
})
export class DividerPage {
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'divider-basic', label: 'Basic' },
    { id: 'divider-content', label: 'Content' },
    { id: 'divider-alignment', label: 'Alignment' },
    { id: 'divider-vertical', label: 'Vertical' },
    { id: 'divider-line-style', label: 'Line style' },
    { id: 'divider-decorative', label: 'Decorative' },
    { id: 'divider-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'divider-api-inputs', label: 'Inputs' },
    { id: 'divider-api-content', label: 'Content' },
  ];

  protected readonly importCode = `import { AerisDivider } from '@aeris-ui/core/divider';`;

  protected readonly verticalCssCode = `.vertical-layout {
  min-height: 7rem;
  display: flex;
  align-items: stretch;
  gap: 1rem;
}

.vertical-panel {
  min-width: 0;
  flex: 1;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-lg);
  background: var(--surface);
}`;

  protected readonly lineStyleCssCode = `.line-style-stack {
  display: grid;
  gap: 1rem;
}`;

  protected readonly decorativeCssCode = `.decorative-section {
  display: grid;
  gap: 0.75rem;
}`;

  protected readonly customCssCode = `.brand-divider {
  --aeris-divider-border: color-mix(
    in srgb,
    var(--aeris-primary) 54%,
    var(--aeris-border)
  );
  --aeris-divider-color: var(--aeris-primary-text);
  --aeris-divider-content-font-size: 0.75rem;
  --aeris-divider-content-gap: 1rem;
  --aeris-divider-line-size: 2px;
}`;

  protected readonly interfacesCode = `type AerisDividerOrientation = 'horizontal' | 'vertical';
type AerisDividerAlign = 'start' | 'center' | 'end';
type AerisDividerLineStyle = 'solid' | 'dashed' | 'dotted';
type AerisDividerSpacing = 'none' | 'sm' | 'md' | 'lg';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'orientation', type: 'AerisDividerOrientation', defaultValue: "'horizontal'", description: 'Sets horizontal or vertical separator layout.' },
    { name: 'align', type: 'AerisDividerAlign', defaultValue: "'center'", description: 'Places projected content near the start, center, or end of the separator.' },
    { name: 'lineStyle', type: 'AerisDividerLineStyle', defaultValue: "'solid'", description: 'Sets the separator line to solid, dashed, or dotted.' },
    { name: 'spacing', type: 'AerisDividerSpacing', defaultValue: "'md'", description: 'Controls outer spacing around the divider.' },
    { name: 'decorative', type: 'boolean', defaultValue: 'false', description: 'Removes separator semantics and hides the divider from assistive technology.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for a meaningful separator without visible naming text.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that names a meaningful separator.' },
  ];

  protected readonly content: readonly ApiRow[] = [
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Optional text, icon, or small label rendered between the separator lines.' },
  ];
}
