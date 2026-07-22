# Slider

> Single and range value selection with pointer, touch, and complete keyboard support.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/slider`
- Human-readable documentation: [https://aeris-ui.dev/components/slider](https://aeris-ui.dev/components/slider)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSlider } from '@aeris-ui/core/slider';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `AerisSliderValue (model)` | `0` | Single number or two-number range with two-way binding support. |
| `range` | `boolean` | `false` | Enables lower and upper thumbs. |
| `min` | `number` | `0` | Minimum slider value. |
| `max` | `number` | `100` | Maximum slider value. |
| `step` | `number` | `1` | Value interval used by pointer alignment and arrow keys. |
| `minRange` | `number` | `0` | Minimum permitted distance between range thumbs. |
| `pageStep` | `number &#124; undefined` | `10% of range` | Increment used by Page Up and Page Down. |
| `orientation` | `AerisSliderOrientation` | `'horizontal'` | Horizontal or vertical track layout. |
| `reversed` | `boolean` | `false` | Reverses visual direction and arrow-key increments. |
| `size` | `AerisSliderSize` | `'md'` | Track thickness and thumb size. |
| `name` | `string` | `''` | Hidden native form field name. |
| `inputId` | `string` | `generated` | Single-thumb ID or base ID for range thumbs. |
| `ariaLabel` | `string` | `'Value'` | Accessible name for a single slider thumb. |
| `ariaLabelledby` | `string` | `''` | IDs of external elements labelling a single thumb. |
| `ariaDescribedby` | `string` | `''` | IDs of shared instructions and validation messages. |
| `lowerAriaLabel` | `string` | `'Minimum value'` | Accessible name for the lower range thumb. |
| `upperAriaLabel` | `string` | `'Maximum value'` | Accessible name for the upper range thumb. |
| `lowerAriaLabelledby` | `string` | `''` | External label IDs for the lower thumb. |
| `upperAriaLabelledby` | `string` | `''` | External label IDs for the upper thumb. |
| `valueText` | `((value: number) =&gt; string) &#124; null` | `null` | Formats visible values, tooltips, and aria-valuetext. |
| `showValue` | `boolean` | `false` | Shows current values beside the track. |
| `showTooltip` | `boolean` | `false` | Shows a value tooltip on hover, focus, and drag. |
| `showTicks` | `boolean` | `false` | Shows one tick for each step when within maxTicks. |
| `maxTicks` | `number` | `101` | Prevents excessive tick rendering for dense ranges. |
| `showMinMax` | `boolean` | `false` | Shows formatted minimum and maximum labels. |
| `disabled` | `boolean` | `false` | Disables pointer, keyboard, and form interaction. |
| `readonly` | `boolean` | `false` | Keeps thumbs focusable while preventing changes. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Expands a horizontal slider to available width. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `AerisSliderValue` | `-` | Emitted automatically by the value model. |
| `valueInput` | `AerisSliderValue` | `-` | Emitted whenever interaction updates the value. |
| `sliding` | `AerisSliderInputEvent` | `-` | Continuous pointer and keyboard value updates. |
| `changed` | `AerisSliderChangeEvent` | `-` | Committed keyboard update or completed pointer drag. |
| `focused` | `FocusEvent` | `-` | Emitted when either thumb receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when a thumb loses focus. |
| `touch` | `void` | `-` | Emitted on thumb blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(thumb?)` | `void` | `-` | Focuses the single, lower, or upper thumb. |
| `reset()` | `void` | `-` | Resets a single slider to min or a range slider to [min, max]. |

## Interfaces and types

### Interfaces

```ts
type AerisSliderSize =
  | 'xs' | 'sm' | 'md' | 'lg';

type AerisSliderOrientation =
  | 'horizontal' | 'vertical';

type AerisSliderThumb =
  | 'single' | 'lower' | 'upper';

type AerisSliderValue =
  | number
  | readonly [number, number];

interface AerisSliderInputEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}

interface AerisSliderChangeEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-slider-rail-background` | `CSS custom property` | — | Inactive track surface. |
| `--aeris-slider-fill-background` | `CSS custom property` | — | Active track surface. |
| `--aeris-slider-thumb-background` | `CSS custom property` | — | Thumb surface. |
| `--aeris-slider-thumb-border` | `CSS custom property` | — | Thumb border. |
| `--aeris-slider-thumb-hover` | `CSS custom property` | — | Hovered and dragged thumb border. |
| `--aeris-slider-focus` | `CSS custom property` | — | Keyboard focus ring. |
| `--aeris-slider-tick` | `CSS custom property` | — | Inactive tick color. |
| `--aeris-slider-active-tick` | `CSS custom property` | — | Tick color over the active track. |
| `--aeris-slider-tooltip-background` | `CSS custom property` | — | Tooltip surface. |
| `--aeris-slider-tooltip-text` | `CSS custom property` | — | Tooltip text. |

## Examples

### Basic

Bind a numeric signal and associate a visible label through ariaLabelledby.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSlider, type AerisSliderValue } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-basic-demo',
  imports: [AerisSlider],
  template: `
    <div class="field">
      <span id="volume-label">Volume</span>
      <aeris-slider ariaLabelledby="volume-label" [(value)]="volume" showValue fluid />
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
export class SliderBasicBasicDemo {
  protected readonly volume =
    signal<AerisSliderValue>(42);
}
```

### Range

Two independently labelled thumbs select an ordered interval and can enforce a minimum distance.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSlider, type AerisSliderValue } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-range-demo',
  imports: [AerisSlider],
  templateUrl: './slider-range.demo.html',
  styleUrl: './slider-range.demo.scss'
})
export class SliderRangeRangeDemo {
  protected readonly priceRange =
    signal<AerisSliderValue>([25, 75]);
}
```

#### HTML

```html
<div class="field">
  <span>Price range</span>
  <aeris-slider
    range
    [min]="0"
    [max]="100"
    [step]="5"
    [minRange]="10"
    lowerAriaLabel="Minimum price"
    upperAriaLabel="Maximum price"
    [(value)]="priceRange"
    showValue
    showTooltip
    fluid
  />
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
```

### Step and ticks

Pointer and keyboard values align to the configured step. Tick rendering is automatically capped by maxTicks.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-step-demo',
  imports: [AerisSlider],
  template: `
    <div class="field">
      <span id="rating-label">Rating</span>
      <aeris-slider
        ariaLabelledby="rating-label"
        [value]="6"
        [min]="0"
        [max]="10"
        [step]="1"
        showTicks
        showMinMax
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
export class SliderStepStepAndTicksDemo {
}
```

### Formatted values and tooltips

One formatter controls visible labels, tooltip text, and aria-valuetext so assistive output stays synchronized.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-values-demo',
  imports: [AerisSlider],
  templateUrl: './slider-values.demo.html',
  styleUrl: './slider-values.demo.scss'
})
export class SliderValuesFormattedValuesAndTooltipsDemo {
  protected readonly formatCurrency = (
    value: number,
  ): string => `$${value}`;
}
```

#### HTML

```html
<div class="field">
  <span id="budget-label">Monthly budget</span>
  <aeris-slider
    ariaLabelledby="budget-label"
    [value]="65"
    [min]="0"
    [max]="100"
    [step]="5"
    [valueText]="formatCurrency"
    showValue
    showTooltip
    showMinMax
    fluid
  />
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
```

### Orientation

Vertical sliders retain the same pointer, keyboard, value, and range API.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-orientation-demo',
  imports: [AerisSlider],
  templateUrl: './slider-orientation.demo.html',
  styleUrl: './slider-orientation.demo.scss'
})
export class SliderOrientationOrientationDemo {
}
```

#### HTML

```html
<div class="vertical-sliders">
  <div class="field">
    <span id="temperature-label">Temperature</span>
    <aeris-slider
      orientation="vertical"
      ariaLabelledby="temperature-label"
      [min]="0"
      [max]="40"
      [(value)]="temperature"
      showValue
      showMinMax
    />
  </div>
  <div class="field">
    <span>Vertical range</span>
    <aeris-slider
      orientation="vertical"
      range
      [value]="[20, 70]"
      lowerAriaLabel="Lower vertical value"
      upperAriaLabel="Upper vertical value"
      showTooltip
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

.vertical-sliders {
  width: 100%;
  min-height: 18rem;
  display: flex;
  justify-content: center;
  gap: 5rem;
}

.vertical-sliders .field {
  justify-items: center;
}

@media (max-width: 36rem) {
  .vertical-sliders {
      gap: 2.5rem;
    }
}
```

### Reversed direction

Reverse visual and keyboard direction for descending scales while preserving min and max semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-reversed-demo',
  imports: [AerisSlider],
  template: `
    <div class="field">
      <span id="priority-label">Descending priority</span>
      <aeris-slider
        ariaLabelledby="priority-label"
        [value]="30"
        reversed
        showValue
        showMinMax
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
export class SliderReversedReversedDirectionDemo {
}
```

### Sizes

Four sizes adjust thumb and track dimensions while preserving a comfortable interactive hit area.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-sizes-demo',
  imports: [AerisSlider],
  template: `
    <div class="slider-size-stack">
      <aeris-slider ariaLabel="Extra small slider" size="xs" [value]="20" fluid />
      <aeris-slider ariaLabel="Small slider" size="sm" [value]="40" fluid />
      <aeris-slider ariaLabel="Medium slider" size="md" [value]="60" fluid />
      <aeris-slider ariaLabel="Large slider" size="lg" [value]="80" fluid />
    </div>
  `,
  styles: `
    .slider-size-stack {
      width: 100%;
      display: grid;
      gap: 1.25rem;
    }
  `
})
export class SliderSizesSizesDemo {
}
```

### States

Read-only sliders remain focusable, disabled sliders leave the tab order, and invalid state synchronizes visual and ARIA feedback.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-states-demo',
  imports: [AerisSlider],
  templateUrl: './slider-states.demo.html',
  styleUrl: './slider-states.demo.scss'
})
export class SliderStatesStatesDemo {
}
```

#### HTML

```html
<div class="field-stack">
  <div class="field">
    <span id="readonly-slider-label">Read-only</span>
    <aeris-slider
      ariaLabelledby="readonly-slider-label"
      [value]="35"
      readonly
      fluid
    />
  </div>
  <div class="field">
    <span id="disabled-slider-label">Disabled</span>
    <aeris-slider
      ariaLabelledby="disabled-slider-label"
      [value]="50"
      disabled
      fluid
    />
  </div>
  <div class="field">
    <span id="invalid-slider-label">Invalid</span>
    <aeris-slider
      ariaLabelledby="invalid-slider-label"
      ariaDescribedby="slider-error"
      [value]="90"
      invalid
      fluid
    />
    <small id="slider-error" class="error">Choose a value of 80 or less.</small>
  </div>
</div>
```

#### CSS

```css
.field-stack {
  width: 100%;
  display: grid;
  gap: 1rem;
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

.field small.error {
  color: var(--aeris-danger);
}
```

### Input and committed events

sliding reports continuous updates. changed fires for each keyboard update and once when a pointer drag ends.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSlider, type AerisSliderChangeEvent, type AerisSliderInputEvent } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-events-demo',
  imports: [AerisSlider],
  template: `
    <div class="field-stack">
      <aeris-slider
        ariaLabel="Event value"
        [(value)]="eventValue"
        (sliding)="handleSliding($event)"
        (changed)="handleChanged($event)"
        fluid
      />
      <small aria-live="polite">Input: {{ liveEvent() }}</small>
      <small aria-live="polite">Changed: {{ changeEvent() }}</small>
    </div>
  `,
  styles: `
    .field-stack {
      width: 100%;
      display: grid;
      gap: 1rem;
    }
  `
})
export class SliderEventsInputAndCommittedEventsDemo {
  protected handleSliding(
    event: AerisSliderInputEvent,
  ): void {
    this.liveEvent.set(
      `${event.thumb}: ${String(event.value)}`,
    );
  }

  protected handleChanged(
    event: AerisSliderChangeEvent,
  ): void {
    this.changeEvent.set(
      `${event.thumb}: ${String(event.value)}`,
    );
  }
}
```

### Reactive and template-driven forms

ControlValueAccessor synchronizes single and range values, touched state, and disabled state with both Angular Forms approaches.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisSlider, type AerisSliderValue } from '@aeris-ui/core/slider';

@Component({
  selector: 'app-slider-forms-demo',
  imports: [AerisSlider, FormsModule, ReactiveFormsModule],
  templateUrl: './slider-forms.demo.html',
  styleUrl: './slider-forms.demo.scss'
})
export class SliderFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveValue =
    new FormControl<AerisSliderValue>(55);

  protected templateValue: AerisSliderValue =
    [20, 60];
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span id="reactive-slider-label">Reactive Forms</span>
    <aeris-slider
      ariaLabelledby="reactive-slider-label"
      [formControl]="reactiveValue"
      showValue
      fluid
    />
  </div>
  <div class="field">
    <span>Template-driven range</span>
    <aeris-slider
      name="templateRange"
      range
      lowerAriaLabel="Template minimum"
      upperAriaLabel="Template maximum"
      [(ngModel)]="templateValue"
      showValue
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

## Accessibility

- Each thumb exposes role="slider", orientation, current value, bounds, and formatted value text.
- Range thumbs receive independent accessible names and dynamic bounds that describe the permitted interval.
- Use ariaLabelledby with a visible label for single sliders. Use the lower and upper label inputs for range sliders.
- valueText keeps visible formatting and aria-valuetext synchronized for units such as currency or temperature.
- Pointer dragging uses capture, supports touch input, and aligns every value to the configured step.
- Read-only thumbs remain focusable and expose their value. Disabled thumbs use native disabled behavior.
- ControlValueAccessor synchronizes single and range values, touched state, and disabled state with Angular Forms.
- Focus indicators meet WCAG 2.2 requirements and motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves to the slider thumb or between lower and upper range thumbs. |
| `Arrow Right / Arrow Up` | Increases the focused thumb by one step. Reversed sliders use the opposite direction. |
| `Arrow Left / Arrow Down` | Decreases the focused thumb by one step. Reversed sliders use the opposite direction. |
| `Page Up` | Increases by pageStep or ten percent of the range. |
| `Page Down` | Decreases by pageStep or ten percent of the range. |
| `Home` | Moves to the minimum permitted value for the focused thumb. |
| `End` | Moves to the maximum permitted value for the focused thumb. |
