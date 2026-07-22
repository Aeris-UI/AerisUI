import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';
import { AerisButton } from '@aeris-ui/core/button';
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
  selector: 'app-block-ui-page',
  imports: [
    AerisBlockUIModule,
    AerisButton,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './block-ui.page.html',
  styleUrl: './block-ui.page.scss',
})
export class BlockUIPage {
  private readonly destroyRef = inject(DestroyRef);
  private screenTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly elementBlocked = signal(false);
  protected readonly screenBlocked = signal(false);
  protected readonly importCode = `import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'block-ui-import', label: 'Import' },
    { id: 'block-ui-element', label: 'Element' },
    { id: 'block-ui-screen', label: 'Full screen' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'block-ui-import', label: 'Import' },
    { id: 'block-ui-api-models', label: 'Models' },
    { id: 'block-ui-api-inputs', label: 'Inputs' },
    { id: 'block-ui-api-outputs', label: 'Outputs' },
    { id: 'block-ui-api-content', label: 'Content' },
  ];

  protected readonly elementTsCode = `protected readonly elementBlocked = signal(false);`;
  protected readonly screenTsCode = `import { DestroyRef, inject } from '@angular/core';

private readonly destroyRef = inject(DestroyRef);
private screenTimer: ReturnType<typeof setTimeout> | undefined;
protected readonly screenBlocked = signal(false);

constructor() {
  this.destroyRef.onDestroy(() => {
    if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
  });
}

protected blockScreen(): void {
  this.screenBlocked.set(true);
  if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
  this.screenTimer = globalThis.setTimeout(
    () => this.screenBlocked.set(false),
    2000,
  );
}`;

  protected readonly demoCssCode = `.block-ui-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.block-ui-panel {
  min-height: 12rem;
  padding: 1.25rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
}

.block-ui-panel h4 {
  margin: 0 0 0.5rem;
}

.block-ui-panel p {
  margin: 0;
  color: var(--aeris-text-2);
  line-height: 1.65;
}`;

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'blocked',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Two-way state controlling whether the blocking layer is visible.',
    },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'fullScreen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Blocks the full viewport instead of only the projected element.',
    },
    {
      name: 'backdropBlur',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Applies the default frosted-glass blur to the blocking layer.',
    },
    {
      name: 'backdropBlurAmount',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the blocking layer blur radius with a CSS length.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'blockedChange',
      type: 'boolean',
      defaultValue: '-',
      description: 'Implicit model output emitted whenever blocked changes.',
    },
  ];

  protected readonly content: readonly ApiRow[] = [
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '-',
      description: 'The element content covered and made inert while blocked.',
    },
  ];

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
    });
  }

  protected blockScreen(): void {
    this.screenBlocked.set(true);
    if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
    this.screenTimer = globalThis.setTimeout(() => this.screenBlocked.set(false), 2000);
  }
}
