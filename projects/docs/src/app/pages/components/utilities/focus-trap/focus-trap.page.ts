import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
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
  selector: 'app-focus-trap-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisCheckbox,
    AerisFocusTrapModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './focus-trap.page.html',
  styleUrl: './focus-trap.page.scss',
})
export class FocusTrapPage {
  protected readonly trapEnabled = signal(true);
  protected readonly secondaryFieldVisible = signal(false);

  protected readonly importCode = `import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'focus-trap-import', label: 'Import' },
    { id: 'focus-trap-basic', label: 'Basic' },
    { id: 'focus-trap-controlled', label: 'Controlled' },
    { id: 'focus-trap-dynamic', label: 'Dynamic content' },
    { id: 'focus-trap-methods', label: 'Focus methods' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'focus-trap-import', label: 'Import' },
    { id: 'focus-trap-api-inputs', label: 'Inputs' },
    { id: 'focus-trap-api-methods', label: 'Methods' },
  ];

  private readonly cardCssCode = `.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
    padding: 0.875rem;
  }
}`;

  protected readonly basicCssCode = `.focus-trap-flow {
  display: grid;
  gap: 0.875rem;
}

.focus-trap-flow > button {
  justify-self: start;
}

${this.cardCssCode}


@media (max-width: 30rem) {
  .focus-trap-flow > button {
    width: 100%;
  }
}`;

  protected readonly controlledTsCode = `protected readonly trapEnabled = signal(true);

protected toggleTrap(): void {
  this.trapEnabled.update((enabled) => !enabled);
}`;

  protected readonly controlledCssCode = `.controlled-trap-demo {
  display: grid;
  gap: 1rem;
}

.controlled-trap-demo > button {
  justify-self: start;
}

${this.cardCssCode}

.controlled-trap-status {
  margin: 0;
  color: var(--aeris-text-2);
}

@media (max-width: 30rem) {
  .controlled-trap-demo > button {
    width: 100%;
  }
}`;

  protected readonly dynamicTsCode = `protected readonly secondaryFieldVisible = signal(false);

protected toggleSecondaryField(): void {
  this.secondaryFieldVisible.update((visible) => !visible);
}`;

  protected readonly dynamicCssCode = `${this.cardCssCode}

.dynamic-trap-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .dynamic-trap-actions > button {
    width: 100%;
  }
}`;

  protected readonly methodsCssCode = `.focus-method-demo {
  display: grid;
  gap: 1rem;
}

${this.cardCssCode}

.focus-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .focus-method-actions > button {
    width: 100%;
  }
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisFocusTrap',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Keeps forward and backward tab navigation within the host while enabled.',
    },
    {
      name: 'aerisFocusTrapPreventScroll',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Prevents viewport movement when focus wraps or a focus method is called.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focusFirst(options?)',
      type: '(options?: FocusOptions) => boolean',
      defaultValue: '—',
      description: 'Focuses the first eligible descendant and reports whether focus succeeded.',
    },
    {
      name: 'focusLast(options?)',
      type: '(options?: FocusOptions) => boolean',
      defaultValue: '—',
      description: 'Focuses the last eligible descendant and reports whether focus succeeded.',
    },
  ];

  protected toggleTrap(): void {
    this.trapEnabled.update((enabled) => !enabled);
  }

  protected toggleSecondaryField(): void {
    this.secondaryFieldVisible.update((visible) => !visible);
  }
}
