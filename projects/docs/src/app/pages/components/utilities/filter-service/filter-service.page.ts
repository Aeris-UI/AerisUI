import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import {
  AerisFilterService,
  type AerisFilterFieldOperator,
  type AerisFilterMode,
} from '@aeris-ui/core/filter-service';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { AerisTableModule, type AerisTableColumn } from '@aeris-ui/core/table';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface Product {
  readonly [key: string]: unknown;
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly added: string;
  readonly supplier: {
    readonly country: string;
  };
}

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface MethodRow {
  readonly name: string;
  readonly signature: string;
  readonly description: string;
}

interface ModeRow {
  readonly name: AerisFilterMode;
  readonly description: string;
}

@Component({
  selector: 'app-filter-service-page',
  imports: [
    AerisButton,
    AerisCardModule,
    AerisDatePicker,
    AerisInputNumber,
    AerisInputText,
    AerisMessageModule,
    AerisTableModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './filter-service.page.html',
  styleUrl: './filter-service.page.scss',
})
export class FilterServicePage {
  private readonly filterService = inject(AerisFilterService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly products: readonly Product[] = [
    {
      id: 1,
      name: 'Halo desk lamp',
      category: 'Lighting',
      price: 68,
      added: '2026-01-12',
      supplier: { country: 'Denmark' },
    },
    {
      id: 2,
      name: 'Mora wool throw',
      category: 'Textiles',
      price: 120,
      added: '2026-02-08',
      supplier: { country: 'Iceland' },
    },
    {
      id: 3,
      name: 'Arc pendant light',
      category: 'Lighting',
      price: 210,
      added: '2026-03-03',
      supplier: { country: 'Sweden' },
    },
    {
      id: 4,
      name: 'Luma side table',
      category: 'Furniture',
      price: 185,
      added: '2026-03-18',
      supplier: { country: 'Denmark' },
    },
  ];
  protected readonly query = signal('light');
  protected readonly basicResults = computed(() =>
    this.filterService.filter(this.products, {
      query: this.query(),
      fields: ['name', 'category'],
      mode: 'contains',
    }),
  );
  protected readonly selectedMode = signal<AerisFilterMode>('starts-with');
  protected readonly modeQuery = signal('lu');
  protected readonly modeResults = computed(() =>
    this.filterService.filter(this.products, {
      query: this.modeQuery(),
      fields: ['name'],
      mode: this.selectedMode(),
    }),
  );
  protected readonly minimumPrice = signal<number | null>(150);
  protected readonly addedAfter = signal<AerisDatePickerValue>(new Date(2026, 2, 1));
  protected readonly comparisonResults = computed(() =>
    this.filterService.filter(this.products, {
      query: this.minimumPrice(),
      fields: [(product) => product.price],
      mode: 'greater-than-or-equal',
    }),
  );
  protected readonly dateResults = computed(() =>
    this.filterService.filter(this.products, {
      query: this.addedAfter(),
      fields: [(product) => product.added],
      mode: 'after',
    }),
  );
  protected readonly addedAfterLabel = computed(() => {
    const value = this.addedAfter();
    return value instanceof Date
      ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(value)
      : 'any date';
  });
  protected readonly fieldProducts: readonly Product[] = [
    {
      id: 1,
      name: 'Denmark desk lamp',
      category: 'Lighting',
      price: 68,
      added: '2026-01-12',
      supplier: { country: 'Denmark' },
    },
    ...this.products.slice(1),
  ];
  protected readonly fieldQuery = signal('den');
  protected readonly fieldOperator = signal<AerisFilterFieldOperator>('or');
  protected readonly fieldResults = computed(() =>
    this.filterService.filter(this.fieldProducts, {
      query: this.fieldQuery(),
      fields: ['supplier.country', (product) => product.name],
      fieldOperator: this.fieldOperator(),
    }),
  );
  protected readonly customCode = signal('UI-314');
  protected readonly customCodes = ['AE-103', 'AE-208', 'UI-314', 'UI-420'] as const;
  protected readonly customMatches = computed(() =>
    this.filterService.matches(this.customCode(), true, 'even-suffix'),
  );
  protected readonly tableQuery = signal('');
  protected readonly tableRows = computed(() =>
    this.filterService.filter(this.products, {
      query: this.tableQuery(),
      fields: ['name', 'category', 'supplier.country'],
    }),
  );
  protected readonly tableColumns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Product', width: '50%' },
    { field: 'category', header: 'Category', width: '32%' },
    { field: 'price', header: 'Price', align: 'end', width: '7rem' },
  ];

  protected readonly importCode = `import { AerisFilterService } from '@aeris-ui/core/filter-service';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'filter-service-import', label: 'Import' },
    { id: 'filter-service-basic', label: 'Collection filtering' },
    { id: 'filter-service-modes', label: 'Match modes' },
    { id: 'filter-service-comparisons', label: 'Comparisons' },
    { id: 'filter-service-fields', label: 'Fields and operators' },
    { id: 'filter-service-custom', label: 'Custom constraint' },
    { id: 'filter-service-table', label: 'Table integration' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'filter-service-import', label: 'Import' },
    { id: 'filter-service-api-properties', label: 'Properties' },
    { id: 'filter-service-api-methods', label: 'Methods' },
    { id: 'filter-service-api-modes', label: 'Built-in modes' },
  ];

  protected readonly basicTsCode = `import { computed, inject, signal } from '@angular/core';
import { AerisFilterService } from '@aeris-ui/core/filter-service';

interface Product {
  readonly name: string;
  readonly category: string;
}

private readonly filterService = inject(AerisFilterService);

protected readonly products: readonly Product[] = [
  { name: 'Halo desk lamp', category: 'Lighting' },
  { name: 'Mora wool throw', category: 'Textiles' },
  { name: 'Arc pendant light', category: 'Lighting' },
  { name: 'Luma side table', category: 'Furniture' },
];
protected readonly query = signal('light');
protected readonly results = computed(() =>
  this.filterService.filter(this.products, {
    query: this.query(),
    fields: ['name', 'category'],
    mode: 'contains',
  }),
);`;
  protected readonly basicCssCode = `.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-demo > label {
  font-weight: 650;
}

.filter-summary {
  margin: 0;
  color: var(--aeris-text-muted);
}

.filter-results {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.filter-results li {
  min-width: 0;
}

.filter-result-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.filter-results span {
  color: var(--aeris-text-muted);
}

@media (max-width: 42rem) {
  .filter-result-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }
}`;

  protected readonly modesTsCode = `import { computed, inject, signal } from '@angular/core';
import {
  AerisFilterService,
  type AerisFilterMode,
} from '@aeris-ui/core/filter-service';

private readonly filterService = inject(AerisFilterService);
protected readonly selectedMode = signal<AerisFilterMode>('starts-with');
protected readonly query = signal('lu');
protected readonly products = [
  { name: 'Halo desk lamp' },
  { name: 'Mora wool throw' },
  { name: 'Arc pendant light' },
  { name: 'Luma side table' },
];
protected readonly results = computed(() =>
  this.filterService.filter(this.products, {
    query: this.query(),
    fields: ['name'],
    mode: this.selectedMode(),
  }),
);`;
  protected readonly modesCssCode = `.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.filter-demo > label {
  font-weight: 650;
}

.filter-demo p {
  margin: 0;
  color: var(--aeris-text-muted);
}

.filter-results {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.filter-results li {
  min-width: 0;
}`;

  protected readonly comparisonTsCode = `import { computed, inject, signal } from '@angular/core';
import { type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import { AerisFilterService } from '@aeris-ui/core/filter-service';

private readonly filterService = inject(AerisFilterService);
protected readonly products = [
  { name: 'Halo desk lamp', price: 68, added: '2026-01-12' },
  { name: 'Mora wool throw', price: 120, added: '2026-02-08' },
  { name: 'Arc pendant light', price: 210, added: '2026-03-03' },
  { name: 'Luma side table', price: 185, added: '2026-03-18' },
];
protected readonly minimumPrice = signal<number | null>(150);
protected readonly addedAfter = signal<AerisDatePickerValue>(new Date(2026, 2, 1));
protected readonly premium = computed(() =>
  this.filterService.filter(this.products, {
    query: this.minimumPrice(),
    fields: [(product) => product.price],
    mode: 'greater-than-or-equal',
  }),
);
protected readonly recent = computed(() =>
  this.filterService.filter(this.products, {
    query: this.addedAfter(),
    fields: [(product) => product.added],
    mode: 'after',
  }),
);
protected readonly addedAfterLabel = computed(() => {
  const value = this.addedAfter();
  return value instanceof Date
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(value)
    : 'any date';
});`;
  protected readonly comparisonCssCode = `.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.comparison-content {
  display: grid;
  gap: 0.75rem;
}

.comparison-grid label {
  display: grid;
  gap: 0.375rem;
  font-weight: 650;
}

.filter-summary {
  margin: 0;
  color: var(--aeris-text-muted);
}

.comparison-grid ul {
  display: grid;
  gap: 0.375rem;
  margin: 0;
  margin-block-end: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 42rem) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly fieldsTsCode = `import { computed, inject, signal } from '@angular/core';
import {
  AerisFilterService,
  type AerisFilterFieldOperator,
} from '@aeris-ui/core/filter-service';

private readonly filterService = inject(AerisFilterService);
protected readonly products = [
  { name: 'Denmark desk lamp', supplier: { country: 'Denmark' } },
  { name: 'Mora wool throw', supplier: { country: 'Iceland' } },
  { name: 'Arc pendant light', supplier: { country: 'Sweden' } },
  { name: 'Luma side table', supplier: { country: 'Denmark' } },
];
protected readonly query = signal('den');
protected readonly operator = signal<AerisFilterFieldOperator>('or');
protected readonly results = computed(() =>
  this.filterService.filter(this.products, {
    query: this.query(),
    fields: ['supplier.country', (product) => product.name],
    fieldOperator: this.operator(),
  }),
);`;
  protected readonly fieldsCssCode = `.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-demo p {
  margin: 0;
  color: var(--aeris-text-muted);
}

.filter-demo > label {
  font-weight: 650;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.filter-results {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.filter-results li {
  min-width: 0;
}

.filter-result-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.filter-results span {
  color: var(--aeris-text-muted);
}

@media (max-width: 42rem) {
  .filter-result-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }
}`;

  protected readonly customTsCode = `import { DestroyRef, computed, inject, signal } from '@angular/core';
import { AerisFilterService } from '@aeris-ui/core/filter-service';

private readonly filterService = inject(AerisFilterService);
private readonly destroyRef = inject(DestroyRef);
protected readonly code = signal('UI-314');
protected readonly codes = ['AE-103', 'AE-208', 'UI-314', 'UI-420'] as const;
protected readonly matches = computed(() =>
  this.filterService.matches(this.code(), true, 'even-suffix'),
);

constructor() {
  const unregister = this.filterService.register('even-suffix', (value) => {
    const suffix = /-(\\d+)$/.exec(String(value))?.[1];
    return suffix !== undefined && Number(suffix) % 2 === 0;
  });
  this.destroyRef.onDestroy(unregister);
}`;
  protected readonly customCssCode = `.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-demo > label {
  font-weight: 650;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}`;

  protected readonly tableTsCode = `import { computed, inject, signal } from '@angular/core';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { type AerisTableColumn } from '@aeris-ui/core/table';

private readonly filterService = inject(AerisFilterService);
protected readonly query = signal('');
protected readonly products = [
  { name: 'Halo desk lamp', category: 'Lighting', price: 68 },
  { name: 'Mora wool throw', category: 'Textiles', price: 120 },
  { name: 'Arc pendant light', category: 'Lighting', price: 210 },
  { name: 'Luma side table', category: 'Furniture', price: 185 },
];
protected readonly rows = computed(() =>
  this.filterService.filter(this.products, {
    query: this.query(),
    fields: ['name', 'category'],
  }),
);
protected readonly columns: readonly AerisTableColumn[] = [
  { field: 'name', header: 'Product', width: '50%' },
  { field: 'category', header: 'Category', width: '32%' },
  { field: 'price', header: 'Price', align: 'end', width: '7rem' },
];`;
  protected readonly tableCssCode = `.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-demo > label {
  font-weight: 650;
}

`;

  protected readonly properties: readonly ApiRow[] = [
    {
      name: 'AERIS_FILTER_MODES',
      type: 'readonly AerisBuiltInFilterMode[]',
      defaultValue: '15 modes',
      description: 'Exported readonly list of every built-in mode name.',
    },
    {
      name: 'constraints',
      type: 'Signal<ReadonlyMap<string, AerisFilterConstraint>>',
      defaultValue: 'built-in modes',
      description: 'Readonly reactive registry of every active built-in and custom constraint.',
    },
  ];
  protected readonly methods: readonly MethodRow[] = [
    {
      name: 'filter',
      signature: 'filter<T>(values, options): T[]',
      description: 'Returns a new ordered array containing items that satisfy the selected mode.',
    },
    {
      name: 'matches',
      signature: 'matches(value, filter, mode?, locale?): boolean',
      description: 'Tests one value against a built-in or registered constraint.',
    },
    {
      name: 'register',
      signature: 'register(name, constraint): () => void',
      description: 'Adds or overrides a constraint and returns an idempotent restoration function.',
    },
    {
      name: 'unregister',
      signature: 'unregister(name): boolean',
      description: 'Removes a custom constraint or restores an overridden built-in.',
    },
    {
      name: 'has',
      signature: 'has(name): boolean',
      description: 'Reports whether a normalized constraint name is registered.',
    },
    {
      name: 'constraintNames',
      signature: 'constraintNames(): readonly string[]',
      description: 'Returns all active constraint names in alphabetical order.',
    },
  ];
  protected readonly modes: readonly ModeRow[] = [
    { name: 'starts-with', description: 'Text begins with the query.' },
    { name: 'contains', description: 'Text contains the query.' },
    { name: 'not-contains', description: 'Text does not contain the query.' },
    { name: 'ends-with', description: 'Text ends with the query.' },
    { name: 'equals', description: 'Values are equal; strings ignore case and accents.' },
    { name: 'not-equals', description: 'Values are not equal.' },
    { name: 'is', description: 'Alias of equals.' },
    { name: 'is-not', description: 'Alias of not-equals.' },
    { name: 'one-of', description: 'Value equals one member of the query array.' },
    { name: 'less-than', description: 'Value sorts before the query.' },
    { name: 'less-than-or-equal', description: 'Value sorts before or equals the query.' },
    { name: 'greater-than', description: 'Value sorts after the query.' },
    { name: 'greater-than-or-equal', description: 'Value sorts after or equals the query.' },
    { name: 'before', description: 'Date value occurs before the query date.' },
    { name: 'after', description: 'Date value occurs after the query date.' },
  ];
  protected readonly interfacesCode = `export const AERIS_FILTER_MODES = [
  'starts-with', 'contains', 'not-contains', 'ends-with',
  'equals', 'not-equals', 'is', 'is-not', 'one-of',
  'less-than', 'less-than-or-equal', 'greater-than',
  'greater-than-or-equal', 'before', 'after',
] as const;

export type AerisBuiltInFilterMode = (typeof AERIS_FILTER_MODES)[number];
export type AerisFilterMode = AerisBuiltInFilterMode | string;
export type AerisFilterLocale = string | readonly string[];
export type AerisFilterField<T> = string | ((item: T) => unknown);
export type AerisFilterFieldOperator = 'or' | 'and';

export interface AerisFilterContext {
  readonly mode: string;
  readonly locale?: AerisFilterLocale;
}

export type AerisFilterConstraint = (
  value: unknown,
  filter: unknown,
  context: AerisFilterContext,
) => boolean;

export interface AerisFilterOptions<T> {
  readonly query: unknown;
  readonly fields?: readonly AerisFilterField<T>[];
  readonly mode?: AerisFilterMode;
  readonly locale?: AerisFilterLocale;
  readonly fieldOperator?: AerisFilterFieldOperator;
}`;

  constructor() {
    const unregister = this.filterService.register('even-suffix', (value) => {
      const suffix = /-(\d+)$/.exec(String(value))?.[1];
      return suffix !== undefined && Number(suffix) % 2 === 0;
    });
    this.destroyRef.onDestroy(unregister);
  }
}
