import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';
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
  selector: 'app-skeleton-page',
  imports: [
    AerisSkeletonModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './skeleton.page.html',
  styleUrl: './skeleton.page.scss',
})
export class SkeletonPage {
  protected readonly importCode = `import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'skeleton-import', label: 'Import' },
    { id: 'skeleton-basic', label: 'Basic' },
    { id: 'skeleton-shapes', label: 'Shapes' },
    { id: 'skeleton-animation', label: 'Animation' },
    { id: 'skeleton-card', label: 'Card' },
    { id: 'skeleton-grid', label: 'Grid' },
    { id: 'skeleton-list', label: 'List' },
    { id: 'skeleton-table', label: 'Table' },
    { id: 'skeleton-tokens', label: 'Tokens' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'skeleton-import', label: 'Import' },
    { id: 'skeleton-api-inputs', label: 'Inputs' },
  ];

  protected readonly basicCssCode = `.skeleton-profile {
  max-width: 32rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
}

.skeleton-profile__lines {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}

.skeleton-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`;

  protected readonly shapesCssCode = `.skeleton-shapes {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1.5rem;
}

.skeleton-shape {
  display: grid;
  justify-items: start;
  gap: 0.5rem;
}

.skeleton-shape span {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}`;

  protected readonly animationCssCode = `.skeleton-animation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.skeleton-animation-grid div {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}

.skeleton-animation-grid span {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

@media (max-width: 36rem) {
  .skeleton-animation-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly cardCssCode = `.skeleton-card {
  max-width: 24rem;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
}

.skeleton-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.skeleton-card__lines,
.skeleton-card__body {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}`;

  protected readonly gridCssCode = `.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 1rem;
}

.skeleton-grid__card {
  min-width: 0;
  display: grid;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}`;

  protected readonly listCssCode = `.skeleton-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skeleton-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.875rem;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--aeris-border);
}

.skeleton-list__lines {
  min-width: 0;
  display: grid;
  gap: 0.5rem;
}`;

  protected readonly tableCssCode = `.skeleton-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.skeleton-table {
  width: 100%;
  min-width: 34rem;
  border-collapse: collapse;
}

.skeleton-table th,
.skeleton-table td {
  padding: 0.875rem;
  border-bottom: 1px solid var(--aeris-border);
  text-align: start;
}

.skeleton-table th {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
  text-transform: uppercase;
}`;

  protected readonly tokenCssCode = `.custom-skeleton {
  --aeris-skeleton-background: color-mix(
    in srgb,
    var(--aeris-primary) 16%,
    var(--aeris-surface)
  );
  --aeris-skeleton-highlight: color-mix(
    in srgb,
    var(--aeris-primary) 36%,
    var(--aeris-surface)
  );
  --aeris-skeleton-rectangle-radius: 1.25rem;
  --aeris-skeleton-duration: 900ms;
}`;

  protected readonly interfacesCode = `type AerisSkeletonShape = 'text' | 'rectangle' | 'circle';
type AerisSkeletonAnimation = 'wave' | 'pulse' | 'none';`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'shape',
      type: 'AerisSkeletonShape',
      defaultValue: "'text'",
      description: 'Sets text, rectangular, or circular geometry.',
    },
    {
      name: 'animation',
      type: 'AerisSkeletonAnimation',
      defaultValue: "'wave'",
      description: 'Sets wave, pulse, or static presentation.',
    },
    {
      name: 'width',
      type: 'string',
      defaultValue: "'100%'",
      description: 'Sets CSS inline size while remaining container-safe.',
    },
    {
      name: 'height',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the shape-aware default block size.',
    },
    {
      name: 'radius',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the theme-aware border radius.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-skeleton-background',
      purpose: 'Placeholder base color.',
      fallback: '--aeris-surface-2',
    },
    {
      name: '--aeris-skeleton-highlight',
      purpose: 'Wave highlight color.',
      fallback: '72% --aeris-surface',
    },
    {
      name: '--aeris-skeleton-radius',
      purpose: 'Text placeholder radius.',
      fallback: '--aeris-radius-pill',
    },
    {
      name: '--aeris-skeleton-rectangle-radius',
      purpose: 'Rectangle placeholder radius.',
      fallback: '--aeris-radius-md',
    },
    {
      name: '--aeris-skeleton-duration',
      purpose: 'Wave and pulse animation duration.',
      fallback: '1.45s',
    },
    { name: '--aeris-skeleton-pulse-opacity', purpose: 'Lowest pulse opacity.', fallback: '0.48' },
  ];
}
