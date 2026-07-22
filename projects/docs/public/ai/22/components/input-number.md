# InputNumber

> Accessible inputnumber component for Angular.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/input-number`
- Human-readable documentation: [https://aeris-ui.dev/components/input-number](https://aeris-ui.dev/components/input-number)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInputNumber } from '@aeris-ui/core/input-number';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number &#124; null (model)` | `null` | Numeric value with two-way binding and Signal Forms compatibility. |
| `inputId` | `string` | `generated` | ID assigned to the internal native input. |
| `name` | `string` | `''` | Native input name. |
| `placeholder` | `string` | `''` | Native placeholder text. |
| `autocomplete` | `string` | `'off'` | Native autocomplete hint. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when a visible label cannot be associated. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of elements that label the input. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `locale` | `string` | `'en-US'` | BCP 47 locale used by Intl.NumberFormat. |
| `mode` | `'decimal' &#124; 'currency'` | `'decimal'` | Number formatting mode. |
| `currency` | `string` | `'USD'` | ISO 4217 currency code used in currency mode. |
| `currencyDisplay` | `AerisInputNumberCurrencyDisplay` | `'symbol'` | Currency label style. |
| `prefix` | `string` | `''` | Text displayed before the editable value. |
| `suffix` | `string` | `''` | Text displayed after the editable value. |
| `min` | `number &#124; undefined` | `undefined` | Minimum committed and stepped value. |
| `max` | `number &#124; undefined` | `undefined` | Maximum committed and stepped value. |
| `step` | `number` | `1` | Increment used by buttons and arrow keys. |
| `minFractionDigits` | `number &#124; undefined` | `undefined` | Minimum displayed fraction digits. |
| `maxFractionDigits` | `number &#124; undefined` | `undefined` | Maximum displayed fraction digits. |
| `useGrouping` | `boolean` | `true` | Displays locale grouping separators. |
| `allowEmpty` | `boolean` | `true` | Allows the model to become null when cleared. |
| `clearable` | `boolean` | `false` | Shows an inline suffix button while a value is present. |
| `clearButtonAriaLabel` | `string` | `'Clear value'` | Accessible name for the clear button. |
| `showButtons` | `boolean` | `false` | Shows increment and decrement controls. |
| `buttonLayout` | `AerisInputNumberButtonLayout` | `'stacked'` | Positions the step controls. |
| `buttonTabIndex` | `number` | `-1` | Tab index for step buttons; the input remains the primary tab stop. |
| `incrementButtonAriaLabel` | `string` | `'Increase value'` | Accessible name for increment. |
| `decrementButtonAriaLabel` | `string` | `'Decrease value'` | Accessible name for decrement. |
| `size` | `AerisInputNumberSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisInputNumberAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `disabled` | `boolean` | `false` | Disables all interaction. |
| `readonly` | `boolean` | `false` | Allows focus and selection without editing. |
| `required` | `boolean` | `false` | Exposes required semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |

### InputNumber outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | number &#124; null | Emitted automatically by the value model for two-way binding. |
| valueInput | number &#124; null | Emitted when user interaction changes the parsed numeric value. |
| focused | FocusEvent | Emitted when the internal input receives focus. |
| blurred | FocusEvent | Emitted after blur normalization and constraint handling. |
| touch | void | Emitted on blur for Angular Signal Forms integration. |

### InputNumber methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the internal input. |
| reset | () =&gt; void | Clears the model and editable text. |
| clear | () =&gt; void | Clears an enabled, editable value and restores input focus. |

## Interfaces and types

### Interfaces

```ts
type AerisInputNumberSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputNumberAppearance = 'outline' | 'filled';
type AerisInputNumberMode = 'decimal' | 'currency';
type AerisInputNumberButtonLayout =
  | 'stacked'
  | 'horizontal'
  | 'vertical';
type AerisInputNumberCurrencyDisplay =
  | 'symbol'
  | 'narrowSymbol'
  | 'code'
  | 'name';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium field and button height. |
| `--aeris-radius-sm` | `CSS custom property` | — | Field and connected button radius. |
| `--aeris-surface` | `CSS custom property` | — | Outlined field background. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled field and button background. |
| `--aeris-border-strong` | `CSS custom property` | — | Field and button border. |
| `--aeris-focus` | `CSS custom property` | — | Visible keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and focus ring. |

## Examples

### Basic

Bind the numeric value through the signal model and associate a visible label with inputId.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-basic-demo',
  imports: [AerisInputNumber],
  template: `
    <div class="field">
      <label for="quantity">Quantity</label>
      <aeris-input-number inputId="quantity" [(value)]="quantity" />
      <small class="number-result" aria-live="polite"
        >Value: {{ quantity() ?? 'Empty' }}</small
      >
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
    
    .number-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }
  `
})
export class NumberBasicBasicDemo {
}
```

### Decimals

Control grouping and the minimum and maximum number of fraction digits.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-decimals-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-decimals.demo.html',
  styleUrl: './number-decimals.demo.scss'
})
export class NumberDecimalsDecimalsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="decimal-grouped">Grouped decimal</label>
    <aeris-input-number
      inputId="decimal-grouped"
      [value]="1234567.5"
      [minFractionDigits]="2"
      [maxFractionDigits]="2"
      fluid
    />
  </div>
  <div class="field">
    <label for="decimal-plain">Without grouping</label>
    <aeris-input-number
      inputId="decimal-plain"
      [value]="1234567.5"
      [useGrouping]="false"
      [maxFractionDigits]="3"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Currency

Currency mode uses Intl.NumberFormat and an ISO 4217 currency code.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-currency-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-currency.demo.html',
  styleUrl: './number-currency.demo.scss'
})
export class NumberCurrencyCurrencyDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="currency-usd">Price in USD</label>
    <aeris-input-number
      inputId="currency-usd"
      mode="currency"
      currency="USD"
      [(value)]="price"
      fluid
    />
  </div>
  <div class="field">
    <label for="currency-eur">Price in EUR</label>
    <aeris-input-number
      inputId="currency-eur"
      mode="currency"
      currency="EUR"
      locale="de-DE"
      [value]="1299.5"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Locales

Locale controls decimal, grouping, currency placement, and localized formatting.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-locale-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-locale.demo.html',
  styleUrl: './number-locale.demo.scss'
})
export class NumberLocaleLocalesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="locale-en">English, United States</label>
    <aeris-input-number
      inputId="locale-en"
      locale="en-US"
      [value]="9876543.21"
      fluid
    />
  </div>
  <div class="field">
    <label for="locale-de">German, Germany</label>
    <aeris-input-number
      inputId="locale-de"
      locale="de-DE"
      [value]="9876543.21"
      fluid
    />
  </div>
  <div class="field">
    <label for="locale-fr">French, France</label>
    <aeris-input-number
      inputId="locale-fr"
      locale="fr-FR"
      [value]="9876543.21"
      fluid
    />
  </div>
  <div class="field">
    <label for="locale-sr">Serbian, Serbia</label>
    <aeris-input-number
      inputId="locale-sr"
      locale="sr-RS"
      [value]="9876543.21"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Prefix and suffix

Add visible context without including affix text in the numeric model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-affixes-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-affixes.demo.html',
  styleUrl: './number-affixes.demo.scss'
})
export class NumberAffixesPrefixAndSuffixDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="number-prefix">Invoice</label>
    <aeris-input-number
      inputId="number-prefix"
      prefix="INV-"
      [value]="1042"
      [useGrouping]="false"
      fluid
    />
  </div>
  <div class="field">
    <label for="number-suffix">Completion</label>
    <aeris-input-number
      inputId="number-suffix"
      suffix="%"
      [(value)]="percentage"
      [min]="0"
      [max]="100"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Button layouts

Optional icon controls can be stacked, horizontal, or vertical. Arrow keys remain available in every layout.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-buttons-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-buttons.demo.html',
  styleUrl: './number-buttons.demo.scss'
})
export class NumberButtonsButtonLayoutsDemo {
}
```

#### HTML

```html
<div class="number-button-layouts">
  <div class="field">
    <span>Stacked</span>
    <aeris-input-number ariaLabel="Stacked quantity" [value]="4" showButtons />
  </div>
  <div class="field">
    <span>Horizontal</span>
    <aeris-input-number
      ariaLabel="Horizontal quantity"
      [value]="4"
      showButtons
      buttonLayout="horizontal"
    />
  </div>
  <div class="field">
    <span>Vertical</span>
    <aeris-input-number
      ariaLabel="Vertical quantity"
      [value]="4"
      showButtons
      buttonLayout="vertical"
    />
  </div>
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

.number-button-layouts {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.number-button-layouts .field {
  justify-items: center;
}

.number-button-layouts .field > span {
  justify-self: start;
}

@media (max-width: 48rem) {
  .number-button-layouts {
      grid-template-columns: 1fr;
    }
  
  .number-button-layouts .field {
      justify-items: stretch;
    }
}
```

### Clear button

An optional suffix button clears the numeric model to null and returns focus to the input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-clearable-demo',
  imports: [AerisInputNumber],
  template: `
    <div class="field">
      <label for="clearable-price">Project budget</label>
      <aeris-input-number
        inputId="clearable-price"
        mode="currency"
        currency="USD"
        clearable
        fluid
        [(value)]="price"
      />
      <small aria-live="polite">Numeric value: {{ price() ?? 'Empty' }}</small>
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class NumberClearableClearButtonDemo {
}
```

### Min, max, and step

Committed and stepped values are clamped to bounds; Home and End jump to defined limits.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-bounds-demo',
  imports: [AerisInputNumber],
  template: `
    <div class="field">
      <label for="bounded-number">Team size</label>
      <aeris-input-number
        inputId="bounded-number"
        [value]="5"
        [min]="1"
        [max]="20"
        [step]="1"
        showButtons
        fluid
      />
      <small>Choose between 1 and 20 members.</small>
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class NumberBoundsMinMaxAndStepDemo {
}
```

### Sizes

Four sizes align with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-sizes-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-sizes.demo.html',
  styleUrl: './number-sizes.demo.scss'
})
export class NumberSizesSizesDemo {
}
```

#### HTML

```html
<div class="field-row">
  <label class="size-sample"
    ><span>Extra small</span
    ><aeris-input-number ariaLabel="Extra small number" size="xs" [value]="12"
  /></label>
  <label class="size-sample"
    ><span>Small</span
    ><aeris-input-number ariaLabel="Small number" size="sm" [value]="12"
  /></label>
  <label class="size-sample"
    ><span>Medium</span><aeris-input-number ariaLabel="Medium number" [value]="12"
  /></label>
  <label class="size-sample"
    ><span>Large</span
    ><aeris-input-number ariaLabel="Large number" size="lg" [value]="12"
  /></label>
</div>
```

#### CSS

```css
.field-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
}

.size-sample {
  display: grid;
  gap: 0.4rem;
}

.size-sample span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .field-row {
    align-items: stretch;
  }

  .size-sample,
  .field-row > input {
    width: 100%;
  }
}
```

### Appearances and states

Filled, invalid, read-only, and disabled states preserve clear semantics and contrast.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-states-demo',
  imports: [AerisInputNumber],
  templateUrl: './number-states.demo.html',
  styleUrl: './number-states.demo.scss'
})
export class NumberStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="number-filled">Filled</label
    ><aeris-input-number
      inputId="number-filled"
      appearance="filled"
      [value]="42"
      fluid
    />
  </div>
  <div class="field">
    <label for="number-invalid">Invalid</label
    ><aeris-input-number
      inputId="number-invalid"
      [value]="150"
      invalid
      ariaDescribedby="number-error"
      fluid
    /><small id="number-error" class="error">Value must be 100 or less.</small>
  </div>
  <div class="field">
    <label for="number-readonly">Read-only</label
    ><aeris-input-number inputId="number-readonly" [value]="2026" readonly fluid />
  </div>
  <div class="field">
    <label for="number-disabled">Disabled</label
    ><aeris-input-number
      inputId="number-disabled"
      [value]="8"
      disabled
      showButtons
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}

.field small.error {
  color: var(--aeris-danger);
}
```

### Fluid layout

Fluid InputNumber controls fill their parent and adapt to narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-fluid-demo',
  imports: [AerisInputNumber],
  template: `
    <div class="field">
      <label for="number-fluid-example">Monthly budget</label>
      <aeris-input-number
        inputId="number-fluid-example"
        mode="currency"
        currency="USD"
        [value]="5000"
        fluid
      />
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class NumberFluidFluidLayoutDemo {
}
```

### Signal Forms contract

The value model supports direct signal binding and structurally satisfies Angular 22 FormValueControl.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-signals-demo',
  imports: [AerisInputNumber],
  template: `
    <div class="field">
      <label for="number-signal">Quantity</label>
      <aeris-input-number inputId="number-signal" [(value)]="quantity" showButtons />
      <small aria-live="polite">Current value: {{ quantity() ?? 'Empty' }}</small>
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class NumberSignalsSignalFormsContractDemo {
  protected readonly quantity = signal<number | null>(4);

  // The value model also satisfies Angular 22 Signal Forms'
  // FormValueControl<number | null> contract.
}
```

### Reactive and template-driven forms

InputNumber implements ControlValueAccessor while retaining its signal model and Signal Forms contract.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputNumber } from '@aeris-ui/core/input-number';

@Component({
  selector: 'app-number-angular-forms-demo',
  imports: [AerisInputNumber, FormsModule, ReactiveFormsModule],
  templateUrl: './number-angular-forms.demo.html',
  styleUrl: './number-angular-forms.demo.scss'
})
export class NumberAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveNumber =
    new FormControl<number | null>(24);

  protected templateNumber: number | null = 12;
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-number">Reactive Forms</label>
    <aeris-input-number
      inputId="reactive-number"
      [formControl]="reactiveNumber"
      fluid
    />
    <small>Value: {{ reactiveNumber.value ?? 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="template-number">Template-driven forms</label>
    <aeris-input-number
      inputId="template-number"
      name="templateNumber"
      [(ngModel)]="templateNumber"
      fluid
    />
    <small>Value: {{ templateNumber ?? 'Empty' }}</small>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

- The editable control exposes native text input behavior with role="spinbutton".
- aria-valuenow, aria-valuemin, aria-valuemax, and localized aria-valuetext describe numeric state.
- Arrow Up and Arrow Down step the value. Home and End use configured bounds.
- Associate a visible label through inputId, or provide ariaLabel when no visible label exists.
- Connect help and error messages through ariaDescribedby. The invalid input synchronizes aria-invalid.
- Increment and decrement controls use SVG icons with configurable accessible names and are excluded from the default tab order.
- The clear button has a configurable accessible name, appears only when usable, and restores focus after clearing.
- ControlValueAccessor support synchronizes values, touched state, and disabled state with Reactive Forms and template-driven forms.
- Disabled and read-only behavior are exposed on the internal input; motion transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the numeric input and clear action. |
| `Arrow Up` | Increases the value by the configured step. |
| `Arrow Down` | Decreases the value by the configured step. |
| `Home` | Sets the configured minimum value when min is present. |
| `End` | Sets the configured maximum value when max is present. |
| `Enter / Space` | Activates the clear button when that button is focused. |
