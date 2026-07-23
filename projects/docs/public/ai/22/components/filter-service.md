# FilterService

> Filter values and typed collections with locale-aware built-ins, nested fields, and custom match constraints.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/filter-service`
- Human-readable documentation: [https://aeris-ui.dev/components/filter-service](https://aeris-ui.dev/components/filter-service)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisFilterService } from '@aeris-ui/core/filter-service';
```

## API

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `AERIS_FILTER_MODES` | `readonly AerisBuiltInFilterMode[]` | `15 modes` | Exported readonly list of every built-in mode name. |
| `constraints` | `Signal&lt;ReadonlyMap&lt;string, AerisFilterConstraint&gt;&gt;` | `built-in modes` | Readonly reactive registry of every active built-in and custom constraint. |

## Interfaces and types

### Interfaces

```ts
export const AERIS_FILTER_MODES = [
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
}
```

## Examples

### Collection filtering

Search several fields at once while preserving source order and leaving the original collection unchanged. Text matching ignores case and diacritic marks.

#### TS

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { AerisInputText } from '@aeris-ui/core/input-text';

interface Product {
  readonly name: string;
  readonly category: string;
}

@Component({
  selector: 'app-filter-service-basic-demo',
  imports: [AerisCardModule, AerisInputText],
  templateUrl: './filter-service-basic.demo.html',
  styleUrl: './filter-service-basic.demo.scss'
})
export class FilterServiceBasicCollectionFilteringDemo {
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
  );
}
```

#### HTML

```html
<div class="filter-demo">
  <label for="filter-service-query">Search products</label>
  <aeris-input-text
    inputId="filter-service-query"
    type="search"
    fluid
    [(value)]="query"
  />
  <p class="filter-summary" role="status" aria-live="polite">
    {{ basicResults().length }} products found
  </p>
  <ul class="filter-results">
    @for (product of basicResults(); track product.id) {
      <li>
        <aeris-card padding="sm" variant="filled">
          <div class="filter-result-row">
            <strong>{{ product.name }}</strong
            ><span>{{ product.category }}</span>
          </div>
        </aeris-card>
      </li>
    }
  </ul>
</div>
```

#### CSS

```css
.filter-demo {
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
}
```

### Match modes

Choose a built-in mode per operation. Empty text queries intentionally return the full source collection.

#### TS

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { AerisFilterService, type AerisFilterMode } from '@aeris-ui/core/filter-service';

@Component({
  selector: 'app-filter-service-modes-demo',
  imports: [],
  template: `
    {{ modeQuery() }}
  `,
  styles: `
    .filter-demo {
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
    }
  `
})
export class FilterServiceModesMatchModesDemo {
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
  );
}
```

### Numbers and dates

Use selector fields to compare typed values, and before or after for Date instances, timestamps, and date strings.

#### TS

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-filter-service-comparisons-demo',
  imports: [AerisCardModule, AerisDatePicker, AerisInputNumber],
  templateUrl: './filter-service-comparisons.demo.html',
  styleUrl: './filter-service-comparisons.demo.scss'
})
export class FilterServiceComparisonsNumbersAndDatesDemo {
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
  });
}
```

#### HTML

```html
<div class="comparison-grid">
  <aeris-card role="group" ariaLabelledBy="filter-price-title">
    <header aerisCardHeader>
      <h3 id="filter-price-title" aerisCardTitle>Price threshold</h3>
    </header>
    <div class="comparison-content">
      <label for="filter-service-price">
        Minimum price
        <aeris-input-number
          inputId="filter-service-price"
          mode="currency"
          currency="EUR"
          [min]="0"
          [step]="10"
          showButtons
          fluid
          [(value)]="minimumPrice"
        />
      </label>
      <p class="filter-summary" role="status" aria-live="polite">
        @if (minimumPrice() === null) {
          {{ comparisonResults().length }} products across all prices
        } @else {
          {{ comparisonResults().length }} products at or above EUR
          {{ minimumPrice() }}
        }
      </p>
      <ul>
        @for (product of comparisonResults(); track product.id) {
          <li>{{ product.name }} — EUR {{ product.price }}</li>
        }
      </ul>
    </div>
  </aeris-card>
  <aeris-card role="group" ariaLabelledBy="filter-date-title">
    <header aerisCardHeader>
      <h3 id="filter-date-title" aerisCardTitle>Date threshold</h3>
    </header>
    <div class="comparison-content">
      <label for="filter-service-date">
        Added after
        <aeris-date-picker
          inputId="filter-service-date"
          clearable
          fluid
          [(value)]="addedAfter"
        />
      </label>
      <p class="filter-summary" role="status" aria-live="polite">
        {{ dateResults().length }} products added after {{ addedAfterLabel() }}
      </p>
      <ul>
        @for (product of dateResults(); track product.id) {
          <li>{{ product.name }} — {{ product.added }}</li>
        }
      </ul>
    </div>
  </aeris-card>
</div>
```

#### CSS

```css
.comparison-grid {
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
}
```

### Fields and operators

Resolve safe own-property paths or typed selector functions. Field matches use OR by default and can require every field with AND.

#### TS

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { AerisFilterService, type AerisFilterFieldOperator } from '@aeris-ui/core/filter-service';

@Component({
  selector: 'app-filter-service-fields-demo',
  imports: [],
  template: `
    {{ fieldQuery() }}
  `,
  styles: `
    .filter-summary {
      margin: 0.5rem 0 0 0;
      color: var(--aeris-text-muted);
    }
    
    .filter-demo {
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
    }
  `
})
export class FilterServiceFieldsFieldsAndOperatorsDemo {
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
  );
}
```

### Custom constraint

Register application logic under a normalized name. The returned cleanup function restores an overridden constraint or removes a new one.

#### TS

```ts
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-filter-service-custom-demo',
  imports: [AerisButton, AerisInputText, AerisMessageModule],
  templateUrl: './filter-service-custom.demo.html',
  styleUrl: './filter-service-custom.demo.scss'
})
export class FilterServiceCustomCustomConstraintDemo {
  private readonly filterService = inject(AerisFilterService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly code = signal('UI-314');
  protected readonly codes = ['AE-103', 'AE-208', 'UI-314', 'UI-420'] as const;
  protected readonly matches = computed(() =>
    this.filterService.matches(this.code(), true, 'even-suffix'),
  );

  constructor() {
    const unregister = this.filterService.register('even-suffix', (value) => {
      const suffix = /-(\d+)$/.exec(String(value))?.[1];
      return suffix !== undefined && Number(suffix) % 2 === 0;
    });
    this.destroyRef.onDestroy(unregister);
  }
}
```

#### HTML

```html
<div class="filter-demo">
  <label for="filter-service-custom-code">Inventory code</label>
  <aeris-input-text
    inputId="filter-service-custom-code"
    type="text"
    fluid
    [(value)]="customCode"
  />
  <div class="filter-actions" role="group" aria-label="Example inventory codes">
    @for (code of customCodes; track code) {
      <button
        aerisButton
        type="button"
        size="sm"
        variant="outline"
        (click)="customCode.set(code)"
      >
        {{ code }}
      </button>
    }
  </div>
  <aeris-message
    size="sm"
    variant="outlined"
    [severity]="customMatches() ? 'success' : 'warning'"
  >
    <strong>{{ customCode() || 'Empty code' }}</strong>
    {{ customMatches() ? 'has an even numeric suffix.' : 'does not match.' }}
  </aeris-message>
</div>
```

#### CSS

```css
.filter-demo {
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
}
```

### Table integration

Derive table data with FilterService when an application needs shared custom constraints beyond a component's built-in filter UI.

#### TS

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTableModule, type AerisTableColumn } from '@aeris-ui/core/table';

@Component({
  selector: 'app-filter-service-table-demo',
  imports: [AerisInputText, AerisTableModule],
  templateUrl: './filter-service-table.demo.html',
  styleUrl: './filter-service-table.demo.scss'
})
export class FilterServiceTableTableIntegrationDemo {
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
  ];
}
```

#### HTML

```html
<div class="filter-demo">
  <label for="filter-service-table-query">Search the table</label>
  <aeris-input-text
    inputId="filter-service-table-query"
    type="search"
    fluid
    [(value)]="tableQuery"
  />
  <aeris-table
    caption="Filtered products"
    [data]="tableRows()"
    [columns]="tableColumns"
    responsiveMode="stack"
    striped
  />
</div>
```

#### CSS

```css
.filter-demo {
  display: grid;
  gap: 0.75rem;
}

.filter-demo > label {
  font-weight: 650;
}
```

## Accessibility

- The service renders no DOM, changes no focus, and adds no keyboard behavior.
- Give every filter control a persistent accessible label and clear instructions.
- Announce result-count changes with a polite status region without moving keyboard focus.
- Keep the query and currently focused control stable while results update, and provide an explicit way to clear active filters.
- Do not communicate matching state by color alone. Empty-state text should explain whether no items exist or no items match.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | FilterService handles no keyboard input. The application's native controls retain their standard keyboard behavior. |
