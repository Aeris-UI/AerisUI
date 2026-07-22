import { Component, signal } from '@angular/core';
import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';

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
  selector: 'app-auto-focus-page',
  imports: [
    AerisAutoFocusModule,
    AerisButton,
    AerisInputText,
    AerisTabsModule,
    AerisTextarea,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './auto-focus.page.html',
  styleUrl: './auto-focus.page.scss',
})
export class AutoFocusPage {
  protected readonly formVisible = signal(false);
  protected readonly controlledFocus = signal(false);
  protected readonly controlledStatus = signal('Automatic focus is disabled.');

  protected readonly importCode = `import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'auto-focus-import', label: 'Import' },
    { id: 'auto-focus-basic', label: 'Basic' },
    { id: 'auto-focus-conditional', label: 'Conditional content' },
    { id: 'auto-focus-controlled', label: 'Controlled' },
    { id: 'auto-focus-method', label: 'Focus method' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'auto-focus-import', label: 'Import' },
    { id: 'auto-focus-api-inputs', label: 'Inputs' },
    { id: 'auto-focus-api-methods', label: 'Methods' },
  ];

  protected readonly basicCssCode = `.auto-focus-field {
  width: min(100%, 24rem);
  display: grid;
  gap: 0.5rem;
}`;

  protected readonly conditionalTsCode = `protected readonly formVisible = signal(false);

protected toggleForm(): void {
  this.formVisible.update((visible) => !visible);
}`;

  protected readonly conditionalCssCode = `.conditional-demo {
  display: grid;
  gap: 1rem;
}

.conditional-form {
  max-width: 28rem;
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.conditional-form label {
  display: grid;
  gap: 0.5rem;
}`;

  protected readonly controlledTsCode = `protected readonly controlledFocus = signal(false);
protected readonly controlledStatus = signal('Automatic focus is disabled.');

protected focusSearch(): void {
  this.controlledFocus.set(false);
  this.controlledStatus.set('Preparing focus…');
  queueMicrotask(() => this.controlledFocus.set(true));
}

protected disableControlledFocus(): void {
  this.controlledFocus.set(false);
  this.controlledStatus.set('Automatic focus is disabled.');
}

protected recordControlledFocus(): void {
  this.controlledStatus.set('The search field received focus.');
}`;

  protected readonly controlledCssCode = `.controlled-demo {
  display: grid;
  gap: 0.875rem;
}

.auto-focus-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}`;

  protected readonly methodCssCode = `.method-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.method-demo textarea {
  width: min(100%, 30rem);
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisAutoFocus',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Focuses the host after rendering and whenever the value changes from false to true.',
    },
    {
      name: 'aerisAutoFocusPreventScroll',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Prevents the browser from scrolling while automatic focus is applied.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focus(options?)',
      type: '(options?: FocusOptions) => boolean',
      defaultValue: '—',
      description:
        'Focuses the host with optional native focus options and reports whether focus succeeded.',
    },
  ];

  protected toggleForm(): void {
    this.formVisible.update((visible) => !visible);
  }

  protected focusSearch(): void {
    this.controlledFocus.set(false);
    this.controlledStatus.set('Preparing focus…');
    queueMicrotask(() => this.controlledFocus.set(true));
  }

  protected disableControlledFocus(): void {
    this.controlledFocus.set(false);
    this.controlledStatus.set('Automatic focus is disabled.');
  }

  protected recordControlledFocus(): void {
    this.controlledStatus.set('The search field received focus.');
  }
}
