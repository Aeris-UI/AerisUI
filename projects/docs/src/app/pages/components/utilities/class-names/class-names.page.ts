import { Component, computed, signal } from '@angular/core';
import { AerisClassNamesModule, type AerisClassNamesValue } from '@aeris-ui/core/class-names';
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
  selector: 'app-class-names-page',
  imports: [
    AerisButton,
    AerisClassNamesModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './class-names.page.html',
  styleUrl: './class-names.page.scss',
})
export class ClassNamesPage {
  protected readonly selected = signal(false);
  protected readonly busy = signal(false);
  protected readonly emphasized = signal(true);
  protected readonly statusClasses = computed<AerisClassNamesValue>(() => ({
    'state-card--selected': this.selected(),
    'state-card--busy': this.busy(),
    'state-card--emphasized': this.emphasized(),
  }));
  protected readonly composedClasses: AerisClassNamesValue = [
    'composed-card composed-card--surface',
    ['composed-card--spacious', ['composed-card--interactive']],
    { 'composed-card--accent': true, 'composed-card--disabled': false },
  ];

  protected readonly importCode = `import { AerisClassNamesModule } from '@aeris-ui/core/class-names';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'class-names-import', label: 'Import' },
    { id: 'class-names-string', label: 'String' },
    { id: 'class-names-array', label: 'Array' },
    { id: 'class-names-conditional', label: 'Conditional map' },
    { id: 'class-names-nested', label: 'Nested composition' },
    { id: 'class-names-frameworks', label: 'CSS frameworks' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'class-names-import', label: 'Import' },
    { id: 'class-names-api-inputs', label: 'Inputs' },
  ];

  protected readonly stringCssCode = `.string-card {
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.string-card--surface {
  background: var(--aeris-surface-2);
}

.string-card--raised {
  box-shadow: var(--aeris-shadow-md);
}`;

  protected readonly arrayCssCode = `.array-card {
  max-width: 30rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-xl);
}

.array-card--surface {
  background: var(--aeris-primary-soft);
}

.array-card--accent {
  border-inline-start: 0.25rem solid var(--aeris-primary);
}

.array-card--compact {
  line-height: 1.45;
}`;

  protected readonly conditionalTsCode = `protected readonly selected = signal(false);
protected readonly busy = signal(false);
protected readonly emphasized = signal(true);

protected readonly statusClasses = computed<AerisClassNamesValue>(() => ({
  'state-card--selected': this.selected(),
  'state-card--busy': this.busy(),
  'state-card--emphasized': this.emphasized(),
}));

protected toggleSelected(): void {
  this.selected.update((value) => !value);
}

protected toggleBusy(): void {
  this.busy.update((value) => !value);
}

protected toggleEmphasized(): void {
  this.emphasized.update((value) => !value);
}`;

  protected readonly conditionalCssCode = `.class-names-demo {
  display: grid;
  gap: 1rem;
}

.class-names-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.state-card {
  padding: 1.25rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
  transition: border-color 160ms ease, background 160ms ease, opacity 160ms ease;
}

.state-card--selected {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
}

.state-card--busy {
  opacity: 0.55;
}

.state-card--emphasized {
  box-shadow: inset 0 0 0 1px var(--aeris-border-strong);
}`;

  protected readonly nestedTsCode = `protected readonly composedClasses: AerisClassNamesValue = [
  'composed-card composed-card--surface',
  ['composed-card--spacious', ['composed-card--interactive']],
  {
    'composed-card--accent': true,
    'composed-card--disabled': false,
  },
];`;

  protected readonly nestedCssCode = `.composed-card {
  max-width: 32rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-xl);
}

.composed-card--surface {
  background: var(--aeris-surface-2);
}

.composed-card--spacious {
  padding: 1.5rem;
}

.composed-card--interactive {
  transition: transform 160ms ease, border-color 160ms ease;
}

.composed-card--interactive:hover {
  border-color: var(--aeris-primary);
  transform: translateY(-0.125rem);
}

.composed-card--accent {
  color: var(--aeris-primary-text);
}`;

  protected readonly frameworksCssCode = `.framework-example {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.utility-surface {
  padding: 0.75rem 1rem;
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.utility-accent {
  color: var(--aeris-primary-text);
  border: 1px solid var(--aeris-primary);
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisClassNames',
      type: 'AerisClassNamesValue',
      defaultValue: 'null',
      description:
        'String, conditional map, nested array, or any supported composition of these values.',
    },
  ];

  protected readonly interfacesCode = `export type AerisClassNamesMap = Readonly<
  Record<string, boolean | null | undefined>
>;

export type AerisClassNamesValue =
  | string
  | AerisClassNamesMap
  | readonly AerisClassNamesValue[]
  | false
  | null
  | undefined;`;

  protected toggleSelected(): void {
    this.selected.update((value) => !value);
  }

  protected toggleBusy(): void {
    this.busy.update((value) => !value);
  }

  protected toggleEmphasized(): void {
    this.emphasized.update((value) => !value);
  }
}
