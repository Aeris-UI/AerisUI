# Rating

> Accessible star rating input with half values, clearing, keyboard support, and forms integration.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/rating`
- Human-readable documentation: [https://aeris-ui.dev/components/rating](https://aeris-ui.dev/components/rating)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisRating } from '@aeris-ui/core/rating';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number (model)` | `0` | Numeric rating value with two-way binding support. |
| `max` | `number` | `5` | Number of rating items. |
| `allowHalf` | `boolean` | `false` | Allows half-step values. |
| `allowClear` | `boolean` | `true` | Allows setting the rating to zero with repeat click, Home, Delete, Backspace, clear(), or reset(). |
| `disabled` | `boolean` | `false` | Disables pointer, keyboard, and form interaction. |
| `required` | `boolean` | `false` | Sets aria-required for validation flows. |
| `size` | `AerisRatingSize` | `'md'` | Visual star size. |
| `showValue` | `boolean` | `false` | Shows formatted value text next to the rating. |
| `name` | `string` | `''` | Hidden native form field name. |
| `inputId` | `string` | `generated` | ID applied to the focusable rating control. |
| `ariaLabel` | `string` | `'Rating'` | Accessible name when no external label is used. |
| `ariaLabelledby` | `string` | `''` | IDs of external label elements. |
| `ariaDescribedby` | `string` | `''` | IDs of help text or validation messages. |
| `valueText` | `((value: number, max: number) =&gt; string) &#124; null` | `null` | Formats visible value text and aria-valuetext. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `number` | `-` | Emitted automatically by the value model. |
| `valueInput` | `number` | `-` | Emitted whenever interaction updates the value. |
| `changed` | `AerisRatingChangeEvent` | `-` | Committed keyboard or pointer value change. |
| `focused` | `FocusEvent` | `-` | Emitted when the rating receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when the rating loses focus. |
| `touch` | `void` | `-` | Emitted on blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Focuses the rating control. |
| `reset()` | `void` | `-` | Resets the value to zero or the minimum permitted value. |
| `clear()` | `void` | `-` | Clears the value when allowClear is enabled. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `#activeIcon` | `TemplateRef&lt;RatingIconContext&gt;` | `star` | Projected template used for selected rating items. |
| `#inactiveIcon` | `TemplateRef&lt;RatingIconContext&gt;` | `star` | Projected template used for unselected rating items. |

## Interfaces and types

### Interfaces

```ts
type AerisRatingSize =
  | 'xs' | 'sm' | 'md' | 'lg';

interface AerisRatingChangeEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: number;
}

interface RatingIconContext {
  readonly $implicit: number;
  readonly index: number;
  readonly active: boolean;
  readonly value: number;
  readonly max: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-rating-empty` | `CSS custom property` | — | Unselected star color. |
| `--aeris-rating-active` | `CSS custom property` | — | Selected star color. |
| `--aeris-rating-focus` | `CSS custom property` | — | Focus ring color. |
| `--aeris-rating-value-text` | `CSS custom property` | — | Visible value text color. |

## Examples

### Basic

Bind a numeric value and label the control with visible text.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-basic-demo',
  imports: [AerisRating],
  template: `
    <div class="field">
      <span id="rating-quality-label">Quality</span>
      <aeris-rating ariaLabelledby="rating-quality-label" [(value)]="quality" />
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
export class RatingBasicBasicDemo {
  protected readonly quality = signal(3);
}
```

### Half values

Enable half-step ratings for more precise feedback.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-half-demo',
  imports: [AerisRating],
  template: `
    <div class="field">
      <span id="rating-half-label">Detailed score</span>
      <aeris-rating
        ariaLabelledby="rating-half-label"
        allowHalf
        showValue
        [(value)]="halfRating"
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
export class RatingHalfHalfValuesDemo {
  protected readonly halfRating = signal(3.5);
}
```

### Clear behavior

Allow clear lets users return to zero. Disable it when one item must always be selected.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-clear-demo',
  imports: [AerisRating],
  templateUrl: './rating-clear.demo.html',
  styleUrl: './rating-clear.demo.scss'
})
export class RatingClearClearBehaviorDemo {
}
```

#### HTML

```html
<div class="rating-grid">
  <div class="rating-card">
    <span>Can clear</span>
    <aeris-rating [value]="3" ariaLabel="Clearable rating" />
  </div>
  <div class="rating-card">
    <span>Required choice</span>
    <aeris-rating
      [value]="3"
      [allowClear]="false"
      required
      ariaLabel="Required rating"
    />
  </div>
</div>
```

#### CSS

```css
.rating-row,
.rating-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.rating-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rating-card {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
}

.rating-card span {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

@media (max-width: 42rem) {
  .rating-grid {
      grid-template-columns: 1fr;
    }
}
```

### Sizes

Four sizes scale the rating without changing interaction behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-sizes-demo',
  imports: [AerisRating],
  templateUrl: './rating-sizes.demo.html',
  styleUrl: './rating-sizes.demo.scss'
})
export class RatingSizesSizesDemo {
}
```

#### HTML

```html
<div class="rating-row">
  <div class="rating-card">
    <span>Extra small</span
    ><aeris-rating size="xs" [value]="3" ariaLabel="Extra small rating" />
  </div>
  <div class="rating-card">
    <span>Small</span><aeris-rating size="sm" [value]="3" ariaLabel="Small rating" />
  </div>
  <div class="rating-card">
    <span>Medium</span
    ><aeris-rating size="md" [value]="3" ariaLabel="Medium rating" />
  </div>
  <div class="rating-card">
    <span>Large</span><aeris-rating size="lg" [value]="3" ariaLabel="Large rating" />
  </div>
</div>
```

#### CSS

```css
.rating-row,
.rating-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.rating-card {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
}

.rating-card span {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}
```

### Custom icons

Project templates for active and inactive icons. Half values clip the active icon layer, so matching icon shapes give the cleanest result.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';
import { LucideDynamicIcon, LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-rating-icons-demo',
  imports: [AerisRating, LucideDynamicIcon],
  templateUrl: './rating-icons.demo.html',
  styleUrl: './rating-icons.demo.scss'
})
export class RatingIconsCustomIconsDemo {

  protected readonly icons = { Heart: LucideHeart };
}
```

#### HTML

```html
<div class="rating-grid">
  <div class="rating-card">
    <span id="rating-mood-label">Whole value</span>
    <aeris-rating
      class="mood-rating"
      ariaLabelledby="rating-mood-label"
      [value]="3"
      [max]="5"
    >
      <ng-template #inactiveIcon>
        <svg
          class="rating-template-icon rating-template-icon--inactive"
          [lucideIcon]="icons.Heart"
        ></svg>
      </ng-template>
      <ng-template #activeIcon>
        <svg
          class="rating-template-icon rating-template-icon--active"
          data-fill="current"
          [lucideIcon]="icons.Heart"
        ></svg>
      </ng-template>
    </aeris-rating>
  </div>
  <div class="rating-card">
    <span id="rating-half-mood-label">Half value</span>
    <aeris-rating
      class="mood-rating"
      ariaLabelledby="rating-half-mood-label"
      [value]="3.5"
      [max]="5"
      allowHalf
    >
      <ng-template #inactiveIcon>
        <svg
          class="rating-template-icon rating-template-icon--inactive"
          [lucideIcon]="icons.Heart"
        ></svg>
      </ng-template>
      <ng-template #activeIcon>
        <svg
          class="rating-template-icon rating-template-icon--active"
          data-fill="current"
          [lucideIcon]="icons.Heart"
        ></svg>
      </ng-template>
    </aeris-rating>
  </div>
</div>
```

#### CSS

```css
.rating-row,
.rating-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.rating-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rating-card {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
}

.rating-card span {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

.rating-template-icon {
  width: 1em;
  height: 1em;
}

@media (max-width: 42rem) {
  .rating-grid {
      grid-template-columns: 1fr;
    }
}

.mood-rating {
  --aeris-rating-empty: #9aa09a;
  --aeris-rating-active: #f6c343;
}

.rating-template-icon--inactive {
  color: #9aa09a;
}

.rating-template-icon--active {
  color: #f6c343;
}
```

### Formatted value

Use valueText to keep visible value text and aria-valuetext synchronized.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-formatting-demo',
  imports: [AerisRating],
  template: `
    <div class="field">
      <span id="rating-score-label">Score</span>
      <aeris-rating
        ariaLabelledby="rating-score-label"
        [value]="4"
        [max]="10"
        [valueText]="formatScore"
        showValue
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
export class RatingFormattingFormattedValueDemo {
  protected readonly formatScore = (
    value: number,
    max: number,
  ): string => `${value}/${max} score`;
}
```

### Disabled state

Disabled ratings are visible but unavailable for pointer, keyboard, and form interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-disabled-demo',
  imports: [AerisRating],
  template: `
    <div class="field">
      <span id="rating-disabled-label">Locked score</span>
      <aeris-rating ariaLabelledby="rating-disabled-label" [value]="3" disabled />
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
export class RatingDisabledDisabledStateDemo {
}
```

### Events

Use changed when a pointer or keyboard interaction commits a new rating.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRating, type AerisRatingChangeEvent } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-events-demo',
  imports: [AerisRating],
  template: `
    <div class="field">
      <aeris-rating
        ariaLabel="Event rating"
        [(value)]="eventRating"
        (changed)="handleChanged($event)"
      />
      <small aria-live="polite">{{ lastEvent() }}</small>
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
export class RatingEventsEventsDemo {
  protected handleChanged(
    event: AerisRatingChangeEvent,
  ): void {
    this.lastEvent.set(`Rating changed to ${event.value}`);
  }
}
```

### Reactive and template-driven forms

Rating implements Angular Forms value access for reactive and template-driven forms.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisRating } from '@aeris-ui/core/rating';

@Component({
  selector: 'app-rating-forms-demo',
  imports: [AerisRating, FormsModule, ReactiveFormsModule],
  templateUrl: './rating-forms.demo.html',
  styleUrl: './rating-forms.demo.scss'
})
export class RatingFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveValue =
    new FormControl(4);

  protected templateValue = 2.5;
}
```

#### HTML

```html
<div class="rating-grid">
  <div class="rating-card">
    <span id="rating-reactive-label">Reactive Forms</span>
    <aeris-rating
      ariaLabelledby="rating-reactive-label"
      [formControl]="reactiveValue"
    />
    <small>Value: {{ reactiveValue.value }}</small>
  </div>
  <div class="rating-card">
    <span id="rating-template-label">Template-driven forms</span>
    <aeris-rating
      ariaLabelledby="rating-template-label"
      name="templateRating"
      allowHalf
      [(ngModel)]="templateValue"
    />
    <small>Value: {{ templateValue }}</small>
  </div>
</div>
```

#### CSS

```css
.rating-row,
.rating-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.rating-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rating-card {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
}

.rating-card span {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

@media (max-width: 42rem) {
  .rating-grid {
      grid-template-columns: 1fr;
    }
}
```

## Accessibility

- Rating uses role="slider" with synchronized aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.
- Provide a visible label with ariaLabelledby or a concise ariaLabel.
- Use valueText when the default value text is not descriptive enough for the product context.
- Use ariaDescribedby for help text and validation messages.
- Disabled ratings are removed from pointer, keyboard, and form interaction.

### Keyboard support

| Key | Function |
| --- | --- |
| `ArrowRight / ArrowUp` | Increase the rating by one step. |
| `ArrowLeft / ArrowDown` | Decrease the rating by one step. |
| `Home` | Move to zero when clearing is enabled, otherwise to the first step. |
| `End` | Move to the maximum rating. |
| `Delete / Backspace` | Clear the rating when allowClear is enabled. |
