# ColorPicker

> Lightweight color input with native picker behavior, text entry, presets, and forms support.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/color-picker`
- Human-readable documentation: [https://aeris-ui.dev/components/color-picker](https://aeris-ui.dev/components/color-picker)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `'#879566'` | Current color value with two-way binding and Forms support. |
| `format` | `AerisColorFormat (model)` | `'hex'` | Active output format. Users can change it from the panel when format selection is enabled. |
| `inputId` | `string` | `generated` | ID assigned to the visible color-picker trigger for label association. |
| `name` | `string` | `''` | Native form field name submitted through a hidden input. |
| `formats` | `readonly AerisColorFormat[]` | `['hex', 'rgb', 'hsl']` | Formats offered by the panel format selector. |
| `placeholder` | `string` | `'Enter color'` | Placeholder for the optional text input. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for the visible trigger when no visible label is available. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of visible elements that label the trigger. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `triggerAriaLabel` | `string` | `'Choose color'` | Accessible name for the visible trigger button. |
| `nativeAriaLabel` | `string` | `'Color picker'` | Deprecated compatibility alias used when panelAriaLabel is empty. |
| `panelAriaLabel` | `string` | `''` | Accessible name for the custom picker dialog. |
| `textAriaLabel` | `string` | `'Color value'` | Accessible name for the text input. |
| `formatAriaLabel` | `string` | `'Color format'` | Accessible name for the format selector. |
| `hueAriaLabel` | `string` | `'Hue'` | Accessible name for the hue slider. |
| `planeAriaLabel` | `string` | `'Saturation and brightness'` | Accessible name for the two-dimensional color plane. |
| `presetsAriaLabel` | `string` | `'Preset colors'` | Accessible name for the preset list. |
| `presetsLabel` | `string` | `'Presets'` | Visible heading shown above preset colors in the panel. |
| `emptyLabel` | `string` | `'No color'` | Visible value text when the value is empty. |
| `clearButtonAriaLabel` | `string` | `'Clear color'` | Accessible name for the clear button. |
| `closeButtonAriaLabel` | `string` | `'Close color picker'` | Accessible name for panel dismissal controls. |
| `eyeDropperAriaLabel` | `string` | `'Pick a color from the screen'` | Accessible name for the optional browser-provided eyedropper action. |
| `size` | `AerisColorPickerSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisColorPickerAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `presets` | `readonly string[]` | `[]` | Preset colors shown inside the picker panel. Hex, rgb(), and hsl() strings are accepted. |
| `showInput` | `boolean` | `true` | Shows the editable text value input next to the trigger. |
| `showValue` | `boolean` | `true` | Shows the formatted color text inside the trigger. When false, the trigger becomes a square swatch button. |
| `showFormat` | `boolean` | `true` | Shows the format selector when more than one format is available. |
| `showEyeDropper` | `boolean` | `true` | Shows screen-color sampling when the secure-context EyeDropper API is available. |
| `clearable` | `boolean` | `false` | Shows a clear action while a value exists. |
| `disabled` | `boolean` | `false` | Disables interaction and form submission. |
| `readonly` | `boolean` | `false` | Allows the value to be read without editing. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string` | `-` | Emitted automatically by the value model. |
| `formatChange` | `AerisColorFormat` | `-` | Emitted automatically when the format model changes. |
| `valueInput` | `string` | `-` | Emitted when user interaction changes the value. |
| `changed` | `AerisColorPickerChangeEvent` | `-` | Emitted when the user commits a plane, hue, format, text, preset, or screen-sampled change. |
| `focused` | `FocusEvent` | `-` | Emitted when an editable picker control receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when an editable picker control loses focus. |
| `touch` | `void` | `-` | Emitted when focus leaves the complete picker. |
| `cleared` | `void` | `-` | Emitted after the clear action succeeds. |
| `opened` | `void` | `-` | Emitted after the custom picker panel opens. |
| `closed` | `void` | `-` | Emitted after the custom picker panel closes. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the visible trigger button. |
| `open()` | `void` | `-` | Opens the custom picker panel and focuses the color plane. |
| `close(restoreFocus?)` | `void` | `-` | Closes the panel and optionally restores trigger focus. |
| `toggle()` | `void` | `-` | Toggles the custom picker panel. |
| `clear()` | `void` | `-` | Clears the value and restores focus. |
| `reset()` | `void` | `-` | Restores the default Aeris palette color. |

## Interfaces and types

### Interfaces

```ts
type AerisColorPickerSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisColorPickerAppearance = 'outline' | 'filled';
type AerisColorFormat = 'hex' | 'rgb' | 'hsl';

interface AerisColorPickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly hex: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-surface` | `CSS custom property` | — | Control, panel, and active format backgrounds. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled surface and clear hover. |
| `--aeris-border-strong` | `CSS custom property` | — | Default field and swatch borders. |
| `--aeris-focus` | `CSS custom property` | — | Keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border. |
| `--aeris-text / --aeris-text-2` | `CSS custom property` | — | Value and secondary text. |
| `--aeris-color-picker-panel-width` | `CSS custom property` | — | Custom picker panel width. |
| `--aeris-color-picker-panel-background` | `CSS custom property` | — | Picker panel surface. |
| `--aeris-color-picker-panel-border` | `CSS custom property` | — | Picker panel border color. |
| `--aeris-color-picker-panel-radius` | `CSS custom property` | — | Picker panel and color-plane corner radius. |
| `--aeris-color-picker-panel-shadow` | `CSS custom property` | — | Picker panel elevation. |
| `--aeris-color-picker-panel-padding` | `CSS custom property` | — | Internal panel spacing. |
| `--aeris-color-picker-panel-z-index` | `CSS custom property` | — | Picker panel stacking level. |
| `--aeris-color-picker-dismiss-z-index` | `CSS custom property` | — | Outside-dismiss layer stacking level. |
| `--aeris-icon-eyedropper` | `CSS custom property` | — | Shared mask used by the optional screen-sampling action. |

## Examples

### Basic

Open the custom panel from a labeled trigger and connect help text through aria-describedby.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-basic-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-basic">Brand color</label>
      <aeris-color-picker
        inputId="color-basic"
        ariaDescribedby="color-basic-help"
        value="#879566"
      />
      <small id="color-basic-help">Choose the primary color for your interface.</small>
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
export class ColorPickerBasicBasicDemo {
}
```

### Signal value

Bind the color with a signal model and render the current value wherever it is useful.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-signal-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-signal">Theme color</label>
      <aeris-color-picker inputId="color-signal" [(value)]="brandColor" />
      <small aria-live="polite">Selected: {{ brandColor() }}</small>
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
export class ColorPickerSignalSignalValueDemo {
  protected readonly brandColor = signal('#879566');
}
```

### Selectable formats

Let users switch the bound value between hex, rgb(), and hsl() directly inside the picker.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker, type AerisColorFormat } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-formats-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-format">Interface color</label>
      <aeris-color-picker
        inputId="color-format"
        [(value)]="formatColor"
        [(format)]="selectedFormat"
      />
      <small aria-live="polite">
        {{ selectedFormat().toUpperCase() }} · {{ formatColor() }}
      </small>
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
export class ColorPickerFormatsSelectableFormatsDemo {
  protected readonly formatColor = signal('#879566');
  protected readonly selectedFormat = signal<AerisColorFormat>('hex');
}
```

### Screen sampling

In secure contexts, supported browsers add a pipette action that can sample a pixel from anywhere on screen. The action is omitted when the browser does not provide the EyeDropper API, while every other color input remains available.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-eyedropper-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-eyedropper">Sampled color</label>
      <aeris-color-picker
        inputId="color-eyedropper"
        value="#2f6f8f"
        eyeDropperAriaLabel="Sample a color from the screen"
      />
      <small
        >Open the picker and use the pipette action when it is available in your
        browser.</small
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
  `
})
export class ColorPickerEyedropperScreenSamplingDemo {
}
```

### Presets

Presets are simple color strings and remain keyboard reachable buttons.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-presets-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-presets">Palette color</label>
      <aeris-color-picker
        inputId="color-presets"
        [(value)]="accentColor"
        [presets]="presets"
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
export class ColorPickerPresetsPresetsDemo {
  protected readonly presets: readonly string[] = [
    '#e8dfe0',
    '#879566',
    '#80939b',
    '#dab692',
    '#8f5b34',
  ];
}
```

### Swatch only

Hide both value text and text entry when the UI only needs the square color trigger. The selected value remains available through value binding and forms.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-swatch-only-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-swatch-only.demo.html',
  styleUrl: './color-picker-swatch-only.demo.scss'
})
export class ColorPickerSwatchOnlySwatchOnlyDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="color-swatch-only">Compact color</label>
    <aeris-color-picker
      inputId="color-swatch-only"
      value="#879566"
      [showValue]="false"
      [showInput]="false"
      ariaLabel="Compact color"
    />
  </div>
  <div class="field">
    <label for="color-swatch-with-input">Swatch with input</label>
    <aeris-color-picker
      inputId="color-swatch-with-input"
      value="#dab692"
      [showValue]="false"
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

### Sizes

Four sizes align ColorPicker with the Aeris form density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-sizes-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field-grid">
      <aeris-color-picker size="xs" value="#e8dfe0" />
      <aeris-color-picker size="sm" value="#879566" />
      <aeris-color-picker size="md" value="#80939b" />
      <aeris-color-picker size="lg" value="#dab692" />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }
    
    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ColorPickerSizesSizesDemo {
}
```

### Appearances

Use outline for clear field boundaries or filled for a quieter surface.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-appearances-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field-grid">
      <aeris-color-picker appearance="outline" value="#879566" />
      <aeris-color-picker appearance="filled" value="#879566" />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }
    
    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ColorPickerAppearancesAppearancesDemo {
}
```

### Clear button

Enable the clear action when empty values are allowed by the surrounding form.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-clear-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-clear">Optional accent</label>
      <aeris-color-picker inputId="color-clear" value="#8f5b34" clearable />
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
export class ColorPickerClearClearButtonDemo {
}
```

### Disabled and read-only

Disabled controls block interaction and form submission; read-only controls keep the value visible without editing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-states-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field-grid">
      <aeris-color-picker value="#879566" disabled />
      <aeris-color-picker value="#dab692" readonly />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }
    
    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ColorPickerStatesDisabledAndReadOnlyDemo {
}
```

### Validation

Use invalid with stable help text and aria-describedby. Do not rely on color alone to explain an error.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-validation-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-validation.demo.html',
  styleUrl: './color-picker-validation.demo.scss'
})
export class ColorPickerValidationValidationDemo {
  protected readonly invalidColor = signal('');
  protected readonly touched = signal(false);
  protected readonly invalid = computed(
    () => this.touched() && this.invalidColor().trim().length === 0,
  );
}
```

#### HTML

```html
<div class="field">
  <label for="color-validation">Required color</label>
  <aeris-color-picker
    inputId="color-validation"
    [(value)]="invalidColor"
    [invalid]="invalid()"
    required
    clearable
    ariaDescribedby="color-validation-message"
    (blurred)="touched.set(true)"
  />
  <small
    id="color-validation-message"
    class="validation-message"
    [class.error]="invalid()"
    aria-live="polite"
    >{{ invalid() ? 'Select a color.' : 'Required.' }}</small
  >
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

.validation-message.error {
  color: var(--aeris-danger);
  font-weight: 700;
}
```

### Reactive and template-driven forms

ColorPicker implements ControlValueAccessor and works with Reactive Forms and template-driven forms.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-forms-demo',
  imports: [AerisColorPicker, FormsModule, ReactiveFormsModule],
  templateUrl: './color-picker-forms.demo.html',
  styleUrl: './color-picker-forms.demo.scss'
})
export class ColorPickerFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveColor =
    new FormControl('#80939b');

  protected templateColor = '#8f5b34';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="color-reactive">Reactive Forms</label>
    <aeris-color-picker inputId="color-reactive" [formControl]="reactiveColor" />
    <small>Value: {{ reactiveColor.value }}</small>
  </div>
  <div class="field">
    <label for="color-template">Template-driven forms</label>
    <aeris-color-picker
      inputId="color-template"
      name="templateColor"
      [(ngModel)]="templateColor"
    />
    <small>Value: {{ templateColor }}</small>
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

### Events

Use changed when you need committed metadata including the normalized hex value.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker, type AerisColorPickerChangeEvent } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-events-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-events">Event color</label>
      <aeris-color-picker
        inputId="color-events"
        value="#80939b"
        (changed)="recordChange($event)"
      />
      <small aria-live="polite">{{ lastChange() }}</small>
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
export class ColorPickerEventsEventsDemo {
  protected readonly lastChange = signal('No color change yet');

  protected recordChange(event: AerisColorPickerChangeEvent): void {
    this.lastChange.set(`Selected ${event.value}`);
  }
}
```

## Accessibility

- The trigger exposes aria-haspopup="dialog", expanded state, and a stable relationship to the custom picker panel.
- Use a visible label and connect it with inputId. Use ariaDescribedby for help and validation text.
- Text entry accepts hex, rgb(), and hsl() strings so color can be edited without pointer interaction.
- The color plane reports saturation and brightness through slider semantics and supports full keyboard adjustment.
- Hue uses a native range input. Format choices and preset colors are native buttons with pressed state.
- Where supported, screen sampling uses the browser-provided EyeDropper API after an explicit button press. Canceling it does not change the selected color.
- Do not rely on a color swatch alone when naming presets in surrounding application UI.
- Invalid state is visual and semantic through aria-invalid; pair it with text that explains the problem.
- ColorPicker implements ControlValueAccessor for Reactive Forms and template-driven forms.
- The panel remains within the viewport at narrow sizes, and its opening animation is removed when reduced motion is requested.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through the trigger, text input, plane, hue slider, format choices, and presets. |
| `Enter / Space` | Opens the panel from the trigger or activates the focused eyedropper, format, preset, clear, or close button. |
| `Arrow Left / Arrow Right` | Decreases or increases saturation on the color plane. Native arrow behavior adjusts hue on its slider. |
| `Arrow Up / Arrow Down` | Increases or decreases brightness on the color plane. |
| `Shift + Arrow` | Adjusts saturation or brightness in ten-percent steps. |
| `Home / End` | Moves saturation to its minimum or maximum on the color plane. |
| `Page Up / Page Down` | Adjusts brightness in ten-percent steps. |
| `Escape` | Closes the panel and restores focus to its trigger. |
| `Backspace / Delete` | Edits the focused text input using native browser behavior. |
