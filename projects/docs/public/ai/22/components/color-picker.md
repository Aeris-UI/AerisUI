# ColorPicker

> Visual color editing with format selection, opacity, presets, inline palettes, and forms support.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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
| `presentation` | `AerisColorPickerPresentation: 'picker' &#124; 'palette' &#124; 'area' &#124; 'slider'` | `'picker'` | Options: 'picker', 'palette', 'area', 'slider'. Picker opens the full editor; palette shows preset choices; area shows the saturation/brightness plane; slider edits one color channel. Inline presentations have no trigger or overlay and share value, format, events and forms support. |
| `channel` | `AerisColorPickerChannel` | `'hue'` | Channel edited by the slider presentation. Options: 'hue', 'saturation' (HSV), 'brightness' (HSV), 'lightness' (HSL), 'red', 'green', 'blue', 'alpha'. Alpha enables transparent values without requiring the alpha input. Other channels preserve the current opacity when alpha is enabled. |
| `orientation` | `AerisColorPickerOrientation` | `'horizontal'` | Slider layout. Options: 'horizontal', 'vertical'. Values increase left to right horizontally and bottom to top vertically, including in RTL layouts. |
| `showDots` | `boolean` | `false` | Shows a decorative precision grid on the area, inline or in the popup. The grid does not change color values. |
| `alpha` | `boolean` | `false` | Enables opacity editing and transparent colors. HEX output uses #RRGGBBAA below full opacity; RGB and HSL use rgba() and hsla(). Opaque values keep their existing format. |
| `opacityLabel` | `string` | `'Opacity'` | Visible label above the optional opacity slider. |
| `alphaAriaLabel` | `string` | `'Opacity'` | Accessible name for the optional opacity slider, which reports its value as a percentage. |
| `clearIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the clear icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `eyedropperIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the eyedropper icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `closeIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the close icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `appendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'self'` | Mounts the overlay locally by default and automatically moves it to document.body when a clipping ancestor is detected. Set 'self', 'body', or a DOM/template target explicitly to override detection. |
| `viewportMargin` | `number &#124; AerisOverlayCollisionPadding` | `8` | Keeps the panel inside the visual viewport. Per-edge values reserve fixed interface regions. |
| `value` | `string (model)` | `'#2c694b'` | Current color value with two-way binding and Forms support. |
| `format` | `AerisColorFormat (model)` | `'hex'` | Active output format. Users can change it from the panel when format selection is enabled. Options: 'hex', 'rgb', 'hsl'. |
| `inputId` | `string` | `generated` | ID assigned to the trigger, slider input, inline area, or palette group. Use ariaLabelledBy to label a non-native area or palette. |
| `name` | `string` | `''` | Native form field name submitted through a hidden input. |
| `formats` | `readonly AerisColorFormat[]` | `['hex', 'rgb', 'hsl']` | Formats offered by the panel format selector. Options: 'hex', 'rgb', 'hsl'. |
| `placeholder` | `string` | `'Enter color'` | Placeholder for the optional text input. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for the trigger or inline control when no visible label is available. Sliders otherwise use their channel label. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | IDs of visible elements that label the trigger or inline control. |
| `ariaDescribedBy` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
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
| `size` | `AerisColorPickerSize` | `'md'` | Control height and typography size. Options: 'xs', 'sm', 'md', 'lg'. |
| `appearance` | `AerisColorPickerAppearance` | `'outline'` | Outlined or filled visual treatment. Options: 'outline', 'filled'. |
| `presets` | `readonly (string &#124; AerisColorPickerPreset)[]` | `[]` | Preset colors in the panel or inline palette. Accepts color strings or objects with value, optional accessible label and disabled state. Invalid colors are omitted and equivalent presets are deduplicated. With alpha enabled, presets without explicit opacity inherit the current opacity; explicit alpha uses its own opacity, including #336699ff for full opacity. A check mark identifies the selected color without relying on hue. |
| `showInput` | `boolean` | `true` | Shows the editable text value input next to the trigger. |
| `showValue` | `boolean` | `true` | Shows the formatted color text inside the trigger. When false, the trigger becomes a square swatch button. |
| `showFormat` | `boolean` | `true` | Shows the format selector when more than one format is available. |
| `showEyeDropper` | `boolean` | `true` | Shows screen-color sampling when the secure-context EyeDropper API is available. |
| `clearable` | `boolean` | `false` | Shows a clear action while a value exists. |
| `disabled` | `boolean` | `false` | Disables interaction and form submission. |
| `readonly` | `boolean` | `false` | Allows the value to be read without editing. |
| `required` | `boolean` | `false` | Sets required semantics on the picker text input. For palette presentation, configure a required validator in your Angular form; the palette has no native text input. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `touched` | `boolean &#124; null` | `null` | Controls when invalid presentation is shown. Null preserves immediate manual invalid state; false defers it; true displays it. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string` | `-` | Emitted automatically by the value model. |
| `formatChange` | `AerisColorFormat` | `-` | Emitted automatically when the format model changes. Options: 'hex', 'rgb', 'hsl'. |
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
| `focus(options?)` | `void` | `-` | Moves focus to the trigger, inline area, channel slider, or current enabled preset in palette presentation. |
| `open()` | `void` | `-` | Opens the custom picker panel and focuses the color plane. Has no effect in palette, area, or slider presentation. |
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
type AerisColorPickerPresentation = 'picker' | 'palette' | 'area' | 'slider';
type AerisColorPickerChannel = 'hue' | 'saturation' | 'brightness' | 'lightness'
  | 'red' | 'green' | 'blue' | 'alpha';
type AerisColorPickerOrientation = 'horizontal' | 'vertical';

interface AerisColorPickerPreset {
  readonly value: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

interface AerisColorPickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly hex: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-color-picker-checker-light` | `CSS custom property` | — | Light transparency checker square. |
| `--aeris-color-picker-inline-width` | `CSS custom property` | — | Preferred width of inline areas and sliders, clamped to the container. The fluid input fills the available width. |
| `--aeris-color-picker-area-height` | `CSS custom property` | — | Height of the saturation and brightness area. |
| `--aeris-color-picker-slider-length` | `CSS custom property` | — | Length of a vertical color slider. |
| `--aeris-color-picker-checker-dark` | `CSS custom property` | — | Dark transparency checker square. |
| `--aeris-color-picker-preset-size` | `CSS custom property` | — | Square preset size; also supports local overrides for inline palettes. |
| `--aeris-color-picker-preset-gap` | `CSS custom property` | — | Spacing between wrapping preset choices. |
| `--aeris-color-picker-checker-size` | `CSS custom property` | — | Size of a repeating checker tile. |
| `--aeris-surface` | `CSS custom property` | — | Control, panel, and active format backgrounds. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled surface and clear hover. |
| `--aeris-border` | `CSS custom property` | — | Default field and swatch borders. |
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
        ariaDescribedBy="color-basic-help"
        value="#2c694b"
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerBasicDemo {
}
```

### Color area

Adjust saturation horizontally and brightness vertically. A linked hue slider shares the same color; the optional dot grid helps locate positions. Use the arrow keys for precise adjustment.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-area-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <span id="area-label">Saturation and brightness</span>
      <aeris-color-picker
        presentation="area"
        showDots
        ariaLabelledBy="area-label"
        [(value)]="areaColor"
      />
      <aeris-color-picker presentation="slider" channel="hue" [(value)]="areaColor" />
      <small aria-live="polite">Selected: {{ areaColor() }}</small>
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerAreaDemo {
  protected readonly areaColor = signal('#336699');
}
```

### Color sliders

Each slider edits its own color independently. Hue, saturation and brightness use HSV; lightness uses HSL. To synchronize sliders, bind them to the same value, as in the RGB example below. Mixing HSV and HSL on a shared color can move other sliders because the channel values are related.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-channels-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-channels.demo.html',
  styleUrl: './color-picker-channels.demo.scss'
})
export class ColorPickerChannelsDemo {
  protected readonly hueColor = signal('#336699');

  protected readonly saturationColor = signal('#336699');

  protected readonly brightnessColor = signal('#336699');

  protected readonly lightnessColor = signal('#336699');
}
```

#### HTML

```html
<div class="field">
  <aeris-color-picker presentation="slider" channel="hue" [(value)]="hueColor" />
  <aeris-color-picker
    presentation="slider"
    channel="saturation"
    [(value)]="saturationColor"
  />
  <aeris-color-picker
    presentation="slider"
    channel="brightness"
    [(value)]="brightnessColor"
  />
  <aeris-color-picker
    presentation="slider"
    channel="lightness"
    [(value)]="lightnessColor"
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
}
```

### RGB sliders

Edit red, green and blue independently from 0 to 255. All sliders update the same value, formatted here as rgb().

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-rgb-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-rgb.demo.html',
  styleUrl: './color-picker-rgb.demo.scss'
})
export class ColorPickerRgbDemo {
  protected readonly rgbColor = signal('#336699');
}
```

#### HTML

```html
<div class="field">
  <aeris-color-picker
    presentation="slider"
    channel="red"
    format="rgb"
    [(value)]="rgbColor"
  />
  <aeris-color-picker
    presentation="slider"
    channel="green"
    format="rgb"
    [(value)]="rgbColor"
  />
  <aeris-color-picker
    presentation="slider"
    channel="blue"
    format="rgb"
    [(value)]="rgbColor"
  />
  <small aria-live="polite">Selected: {{ rgbColor() }}</small>
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
}
```

### Opacity slider

The alpha channel automatically accepts transparency. Its checkerboard track previews opacity from 0 to 100 percent. Enable alpha on linked non-alpha controls to preserve transparency.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-slider-opacity-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <aeris-color-picker
        presentation="area"
        alpha
        ariaLabel="Transparent color saturation and brightness"
        [(value)]="sliderOpacity"
      />
      <aeris-color-picker presentation="slider" channel="alpha" [(value)]="sliderOpacity" />
      <small aria-live="polite">Selected: {{ sliderOpacity() }}</small>
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerSliderOpacityDemo {
  protected readonly sliderOpacity = signal('#33669980');
}
```

### Slider layout and states

Vertical sliders increase from bottom to top. Read-only controls remain focusable without changing; disabled controls are skipped during keyboard navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-slider-states-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-slider-states.demo.html',
  styleUrl: './color-picker-slider-states.demo.scss'
})
export class ColorPickerSliderStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <aeris-color-picker
    presentation="slider"
    orientation="vertical"
    channel="hue"
    value="#336699"
  />
  <div class="field">
    <aeris-color-picker
      presentation="slider"
      channel="hue"
      value="#336699"
      readonly
      ariaLabel="Read-only hue"
    />
    <aeris-color-picker
      presentation="slider"
      channel="hue"
      value="#336699"
      disabled
      ariaLabel="Disabled hue"
    />
    <aeris-color-picker
      presentation="area"
      value="#336699"
      disabled
      ariaLabel="Disabled saturation and brightness"
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field-grid {
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  align-items: start;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerSignalDemo {
  protected readonly brandColor = signal('#2c694b');
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerFormatsDemo {
  protected readonly formatColor = signal('#2c694b');
  protected readonly selectedFormat = signal<AerisColorFormat>('hex');
}
```

### Opacity

Enable alpha to edit opacity with a percentage slider or text. The checkerboard distinguishes transparent colors from opaque colors.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-opacity-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <label for="color-opacity">Overlay color</label>
      <aeris-color-picker
        inputId="color-opacity"
        alpha
        format="rgb"
        [(value)]="translucentColor"
        [presets]="['#336699', '#33669940', '#336699ff', 'transparent']"
      />
      <small aria-live="polite">Selected: {{ translucentColor() }}</small>
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerOpacityDemo {
  protected readonly translucentColor = signal('rgba(51, 102, 153, 0.5)');
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
      <small>
        Open the picker and use the pipette action when it is available in your browser.
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerEyedropperDemo {
}
```

### Presets

Presets are simple color strings and remain keyboard reachable buttons.

#### TS

```ts
import { Component, signal } from '@angular/core';
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerPresetsDemo {
  protected readonly accentColor = signal('#a88245');

  protected readonly presets: readonly string[] = [
    '#f1f4f2',
    '#2c694b',
    '#52685b',
    '#a88245',
    '#343b37',
  ];
}
```

### Inline palette

Show a fixed palette without opening a popup. Named presets provide accessible labels; disabled colors cannot be selected. The check mark identifies the current choice independently of its color.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker, type AerisColorPickerPreset } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-palette-demo',
  imports: [AerisColorPicker],
  template: `
    <div class="field">
      <span id="palette-label">Accent color</span>
      <aeris-color-picker
        presentation="palette"
        ariaLabelledBy="palette-label"
        [(value)]="paletteColor"
        [presets]="namedPresets"
      />
      <small aria-live="polite">Selected: {{ paletteColor() }}</small>
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerPaletteDemo {
  protected readonly paletteColor = signal('#2c694b');

  protected readonly namedPresets: readonly AerisColorPickerPreset[] = [
      { value: '#2c694b', label: 'Forest' },
      { value: '#bc6c25', label: 'Copper' },
      { value: '#336699', label: 'Ocean' },
      { value: '#171717', label: 'Ink' },
      { value: '#fafafa', label: 'Paper' },
      { value: '#dda15e', label: 'Caramel (unavailable)', disabled: true },
    ];
}
```

### Palette opacity

Presets without explicit alpha inherit the current value's opacity. Explicit alpha selects that exact opacity, including fully opaque and fully transparent colors.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-palette-opacity-demo',
  imports: [AerisColorPicker],
  templateUrl: './color-picker-palette-opacity.demo.html',
  styleUrl: './color-picker-palette-opacity.demo.scss'
})
export class ColorPickerPaletteOpacityDemo {
  protected readonly paletteOpacity = signal('rgba(51, 102, 153, 0.5)');
}
```

#### HTML

```html
<div class="field">
  <span id="palette-opacity-label">Transparent colors</span>
  <aeris-color-picker
    presentation="palette"
    alpha
    format="rgb"
    ariaLabelledBy="palette-opacity-label"
    [(value)]="paletteOpacity"
    [presets]="[
      { value: '#336699', label: 'Ocean, inherited opacity' },
      { value: '#993366', label: 'Plum, inherited opacity' },
      { value: '#33669940', label: 'Ocean, quarter opacity' },
      { value: '#336699ff', label: 'Ocean, full opacity' },
      { value: 'transparent', label: 'Transparent' },
    ]"
  />
  <small aria-live="polite">Selected: {{ paletteOpacity() }}</small>
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
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
export class ColorPickerSwatchOnlyDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="color-swatch-only">Compact color</label>
    <aeris-color-picker
      inputId="color-swatch-only"
      value="#2c694b"
      [showValue]="false"
      [showInput]="false"
      ariaLabel="Compact color"
    />
  </div>
  <div class="field">
    <label for="color-swatch-with-input">Swatch with input</label>
    <aeris-color-picker
      inputId="color-swatch-with-input"
      value="#a88245"
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field-grid {
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  align-items: start;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
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
      <aeris-color-picker size="xs" value="#f1f4f2" />
      <aeris-color-picker size="sm" value="#2c694b" />
      <aeris-color-picker size="md" value="#52685b" />
      <aeris-color-picker size="lg" value="#a88245" />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field-grid {
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerSizesDemo {
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
      <aeris-color-picker appearance="outline" value="#2c694b" />
      <aeris-color-picker appearance="filled" value="#2c694b" />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field-grid {
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerAppearancesDemo {
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
      <aeris-color-picker inputId="color-clear" value="#343b37" clearable />
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerClearDemo {
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
      <aeris-color-picker value="#2c694b" disabled />
      <aeris-color-picker value="#a88245" readonly />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field-grid {
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      align-items: start;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerStatesDemo {
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
export class ColorPickerValidationDemo {
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
    ariaDescribedBy="color-validation-message"
    (blurred)="touched.set(true)"
  />
  <small
    id="color-validation-message"
    class="validation-message"
    [class.error]="invalid()"
    aria-live="polite"
  >
    {{ invalid() ? 'Select a color.' : 'Required.' }}
  </small>
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
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
export class ColorPickerFormsDemo {
  protected readonly reactiveColor =
    new FormControl('#52685b');

  protected templateColor = '#343b37';
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 28rem);
}

.field,
.field-grid {
  display: grid;
  gap: 0.55rem;
}

.field-grid {
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  align-items: start;
}

.field label,
.field-grid label {
  color: var(--aeris-text);
  font-weight: 700;
}

.field small,
.field-grid small {
  color: var(--aeris-text-2);
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
        value="#52685b"
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

    .field {
      width: min(100%, 28rem);
    }

    .field,
    .field-grid {
      display: grid;
      gap: 0.55rem;
    }

    .field label,
    .field-grid label {
      color: var(--aeris-text);
      font-weight: 700;
    }

    .field small,
    .field-grid small {
      color: var(--aeris-text-2);
    }
  `
})
export class ColorPickerEventsDemo {
  protected readonly lastChange = signal('No color change yet');

  protected recordChange(event: AerisColorPickerChangeEvent): void {
    this.lastChange.set(`Selected ${event.value}`);
  }
}
```

## Accessibility

- The trigger exposes aria-haspopup="dialog", expanded state, and a stable relationship to the custom picker panel.
- For the picker, use a visible label and connect it with inputId. Inline palettes use ariaLabelledBy to reference a visible label. Use ariaDescribedBy for help and validation text.
- Text entry accepts hex, rgb(), and hsl() strings so color can be edited without pointer interaction.
- The color plane reports saturation and brightness through slider semantics and supports full keyboard adjustment.
- Hue and optional opacity use native range inputs. Opacity is announced as a percentage. Format choices and preset colors are native buttons with pressed state.
- Where supported, screen sampling uses the browser-provided EyeDropper API after an explicit button press. Canceling it does not change the selected color.
- Do not rely on a color swatch alone when naming presets in surrounding application UI. Use preset objects with a readable label. Inline palettes accept ariaLabel or ariaLabelledBy for the group; the selected preset has pressed state and a visible check mark.
- Invalid state is visual and semantic through aria-invalid; pair it with text that explains the problem.
- ColorPicker implements ControlValueAccessor for Reactive Forms and template-driven forms.
- The panel remains within the viewport at narrow sizes, and its opening animation is removed when reduced motion is requested.
- Inline areas and sliders use the same value model and Angular Forms integration as the popup. Label areas with ariaLabel or ariaLabelledBy. Sliders show a channel label by default; these naming inputs can override its accessible name. Read-only controls can receive focus but do not change; disabled controls cannot receive keyboard focus.

### Keyboard support

| Key | Function |
| --- | --- |
| `Slider arrows / Shift + arrows` | Increase or decrease the channel by 1 or 10 units. Left/Down decrease; Right/Up increase. |
| `Slider Home / End / Page Up / Page Down` | Jump to the minimum or maximum, or adjust by 10 units. Pointer input updates value continuously; changed emits on release or a keyboard adjustment. |
| `Tab / Shift + Tab` | Moves through the trigger, text input, plane, hue slider, format choices, and presets. Each preset group has one tab stop; disabled presets are skipped. |
| `Arrow keys; Home / End (presets)` | Moves focus between enabled presets without changing the value. Left/Right follow text direction; Up/Down move to the previous/next preset. Home/End focus the first/last enabled preset. Enter or Space selects it. |
| `Enter / Space` | Opens the panel from the trigger or activates the focused eyedropper, format, preset, clear, or close button. |
| `Arrow Left / Arrow Right` | Decreases or increases saturation on the color plane. Native arrow behavior adjusts hue or opacity on its slider. |
| `Arrow Up / Arrow Down` | Increases or decreases brightness on the color plane. |
| `Shift + Arrow` | Adjusts saturation or brightness in ten-percent steps. |
| `Home / End` | Moves saturation to its minimum or maximum on the color plane, or moves a native slider to its minimum or maximum. |
| `Page Up / Page Down` | Adjusts brightness in ten-percent steps. |
| `Escape` | Closes the panel and restores focus to its trigger. |
| `Backspace / Delete` | Edits the focused text input using native browser behavior. |
