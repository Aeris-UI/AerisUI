# MeterGroup

> Visualize multiple scalar contributions within a known range using responsive segments, legends, templates, and meter semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/meter-group`
- Human-readable documentation: [https://aeris-ui.dev/components/meter-group](https://aeris-ui.dev/components/meter-group)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMeterGroupModule } from '@aeris-ui/core/meter-group';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly AerisMeterGroupItem[]` | `[]` | Ordered scalar contributions rendered as meter segments. |
| `min` | `number` | `0` | Minimum combined meter value. |
| `max` | `number` | `100` | Maximum combined meter value and visual capacity. |
| `orientation` | `AerisMeterGroupOrientation` | `'horizontal'` | Sets a horizontal or vertical meter track. |
| `legendLayout` | `AerisMeterGroupLegendLayout` | `'auto'` | Sets row, column, or orientation-aware legend layout. |
| `legendPosition` | `AerisMeterGroupLegendPosition` | `'after'` | Places the legend before or after the meter track. |
| `size` | `AerisMeterGroupSize` | `'md'` | Sets the meter track thickness. |
| `showLegend` | `boolean` | `true` | Shows or visually hides the item legend. |
| `showValues` | `boolean` | `true` | Shows formatted values beside visible legend labels. |
| `rounded` | `boolean` | `true` | Uses pill corners for the meter track. |
| `valueSuffix` | `string` | `'%'` | Suffix used by the default item-value formatter. |
| `ariaLabel` | `string` | `'Meter group'` | Accessible name for the meter track. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the meter track. |
| `ariaValueText` | `string` | `''` | Overrides the generated combined measurement summary. |
| `valueFormatter` | `((context: AerisMeterGroupItemContext) =&gt; string) &#124; null` | `null` | Formats visible and accessible item values. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisMeterGroupLabel` | `TemplateRef&lt;AerisMeterGroupItemContext&gt;` | `-` | Custom visible content for each legend label. |
| `aerisMeterGroupSegment` | `TemplateRef&lt;AerisMeterGroupItemContext&gt;` | `-` | Decorative content rendered inside each visual segment. |
| `aerisMeterGroupHeader` | `TemplateRef&lt;AerisMeterGroupSummaryContext&gt;` | `-` | Content rendered before the meter layout. |
| `aerisMeterGroupFooter` | `TemplateRef&lt;AerisMeterGroupSummaryContext&gt;` | `-` | Content rendered after the meter layout. |

## Interfaces and types

### Interfaces

```ts
type AerisMeterGroupOrientation = 'horizontal' | 'vertical';
type AerisMeterGroupLegendLayout = 'auto' | 'row' | 'column';
type AerisMeterGroupLegendPosition = 'before' | 'after';
type AerisMeterGroupSize = 'sm' | 'md' | 'lg';
type AerisMeterGroupTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisMeterGroupItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
  readonly tone?: AerisMeterGroupTone;
}

interface AerisMeterGroupItemContext {
  readonly $implicit: AerisMeterGroupItem;
  readonly item: AerisMeterGroupItem;
  readonly index: number;
  readonly value: number;
  readonly percent: number;
  readonly formattedValue: string;
}

interface AerisMeterGroupSummaryContext {
  readonly $implicit: number;
  readonly total: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
  readonly remaining: number;
}
```

## Examples

### Basic

Render one scalar contribution against the default zero-to-one-hundred range.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-basic-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group ariaLabel="Space used" [items]="basicItems" />
    </div>
  `
})
export class MeterGroupBasicBasicDemo {
  protected readonly basicItems: readonly AerisMeterGroupItem[] = [
    { label: 'Space used', value: 45, tone: 'primary' },
  ];
}
```

### Multiple

Stack contributions in source order while preserving every label and value.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-multiple-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group ariaLabel="Disk usage" [items]="storageItems" />
    </div>
  `
})
export class MeterGroupMultipleMultipleDemo {
  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

### Colors

Use palette-aware tones by default or provide valid CSS colors for domain-specific data.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-colors-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group ariaLabel="Custom color distribution" [items]="colorItems" />
    </div>
  `
})
export class MeterGroupColorsColorsDemo {
  protected readonly colorItems: readonly AerisMeterGroupItem[] = [
    { label: 'Violet', value: 12, color: '#8b5cf6' },
    { label: 'Emerald', value: 14, color: '#10b981' },
    { label: 'Rose', value: 10, color: '#f43f5e' },
    { label: 'Blue', value: 8, color: '#3b82f6' },
    { label: 'Amber', value: 10, color: '#f59e0b' },
  ];
}
```

### Icons

Use the label template with any consumer icon library; these documentation examples use Lucide.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';
import { LucideAppWindow, LucideDynamicIcon, LucideImage, LucideMessageCircle, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-meter-group-icons-demo',
  imports: [AerisMeterGroupModule, LucideDynamicIcon],
  templateUrl: './meter-group-icons.demo.html',
  styleUrl: './meter-group-icons.demo.scss'
})
export class MeterGroupIconsIconsDemo {

  protected readonly icons = { AppWindow: LucideAppWindow, Image: LucideImage, MessageCircle: LucideMessageCircle, Settings: LucideSettings };

  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

#### HTML

```html
<div>
  <aeris-meter-group ariaLabel="Storage categories" [items]="iconItems">
    <ng-template aerisMeterGroupLabel let-item>
      <span class="meter-icon-label">
        @switch (item.label) {
          @case ('Applications') {
            <svg [lucideIcon]="icons.AppWindow"></svg>
          }
          @case ('Messages') {
            <svg [lucideIcon]="icons.MessageCircle"></svg>
          }
          @case ('Media') {
            <svg [lucideIcon]="icons.Image"></svg>
          }
          @case ('System') {
            <svg [lucideIcon]="icons.Settings"></svg>
          }
        }
        {{ item.label }}
      </span>
    </ng-template>
  </aeris-meter-group>
</div>
```

#### CSS

```css
.meter-icon-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.meter-icon-label svg {
  width: 1rem;
  height: 1rem;
}
```

### Legend layouts

Arrange legend entries in a wrapping row or a compact column and place them before or after the track.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-labels-demo',
  imports: [AerisMeterGroupModule],
  templateUrl: './meter-group-labels.demo.html',
  styleUrl: './meter-group-labels.demo.scss'
})
export class MeterGroupLabelsLegendLayoutsDemo {
  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

#### HTML

```html
<div>
  <div class="meter-stack">
    <aeris-meter-group
      ariaLabel="Row legend after track"
      [items]="iconItems"
      legendLayout="row"
    />
    <aeris-meter-group
      ariaLabel="Column legend before track"
      [items]="iconItems"
      legendLayout="column"
      legendPosition="before"
    />
  </div>
</div>
```

#### CSS

```css
.meter-stack {
  display: grid;
  gap: 1.25rem;
}
```

### Vertical

Use a vertical track when the surrounding composition is taller than it is wide.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-vertical-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group
        ariaLabel="Vertical disk usage"
        [items]="iconItems"
        orientation="vertical"
        legendPosition="after"
      />
    </div>
  `
})
export class MeterGroupVerticalVerticalDemo {
  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

### Range

Set explicit boundaries and a value suffix for measurements that are not percentages.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-range-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group
        ariaLabel="Storage allocation"
        [items]="rangeItems"
        [max]="250"
        valueSuffix=" GB"
      />
    </div>
  `
})
export class MeterGroupRangeRangeDemo {
  protected readonly rangeItems: readonly AerisMeterGroupItem[] = [
    { label: 'Projects', value: 32, tone: 'primary' },
    { label: 'Assets', value: 18, tone: 'info' },
    { label: 'Backups', value: 44, tone: 'success' },
    { label: 'Archives', value: 21, tone: 'warning' },
  ];
}
```

### Sizes and corners

Match surrounding density with three track sizes and pill or theme-aware corners.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-options-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <div class="meter-stack">
        <aeris-meter-group ariaLabel="Small meter" [items]="iconItems" size="sm" />
        <aeris-meter-group ariaLabel="Medium meter" [items]="iconItems" />
        <aeris-meter-group
          ariaLabel="Large square meter"
          [items]="iconItems"
          size="lg"
          [rounded]="false"
        />
      </div>
    </div>
  `,
  styles: `
    .meter-stack {
      display: grid;
      gap: 1.25rem;
    }
  `
})
export class MeterGroupOptionsSizesAndCornersDemo {
  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

### Templates

Customize summary content, labels, segment decoration, and footer content with typed contexts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem, type AerisMeterGroupItemContext } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-templates-demo',
  imports: [AerisMeterGroupModule],
  templateUrl: './meter-group-templates.demo.html',
  styleUrl: './meter-group-templates.demo.scss'
})
export class MeterGroupTemplatesTemplatesDemo {
  protected readonly templateItems: readonly AerisMeterGroupItem[] = [
    { label: 'Projects', value: 25, tone: 'primary' },
    { label: 'Messages', value: 15, tone: 'info' },
    { label: 'Media', value: 20, tone: 'success' },
    { label: 'System', value: 10, tone: 'warning' },
  ];

  protected readonly gigabyteFormatter = (
    context: AerisMeterGroupItemContext,
  ): string => `${context.value} GB`;
}
```

#### HTML

```html
<div>
  <aeris-meter-group
    ariaLabel="Templated storage allocation"
    [items]="templateItems"
    [valueFormatter]="gigabyteFormatter"
    valueSuffix=" GB"
  >
    <ng-template aerisMeterGroupHeader let-total let-percent="percent">
      <div class="meter-summary">
        <strong>Storage</strong>
        <span>{{ total }} GB · {{ percent }}% allocated</span>
      </div>
    </ng-template>
    <ng-template aerisMeterGroupLabel let-item let-formattedValue="formattedValue">
      <span class="meter-template-label">
        <strong>{{ item.label }}</strong>
        <small>{{ formattedValue }}</small>
      </span>
    </ng-template>
    <ng-template aerisMeterGroupSegment>
      <span class="meter-segment-pattern"></span>
    </ng-template>
    <ng-template aerisMeterGroupFooter let-remaining="remaining">
      <span class="meter-footer">{{ remaining }} GB available</span>
    </ng-template>
  </aeris-meter-group>
</div>
```

#### CSS

```css
.meter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.meter-summary strong {
  font-size: 1rem;
}

.meter-summary span,
.meter-footer,
.meter-template-label small {
  color: var(--aeris-text-2);
}

.meter-template-label {
  display: grid;
  gap: 0.125rem;
}

.meter-segment-pattern {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    135deg,
    transparent 0 4px,
    rgb(255 255 255 / 18%) 4px 7px
  );
}
```

### Token customization

Change track and legend geometry while retaining palette and accessibility behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

@Component({
  selector: 'app-meter-group-tokens-demo',
  imports: [AerisMeterGroupModule],
  template: `
    <div>
      <aeris-meter-group
        class="custom-meter-group"
        ariaLabel="Customized disk usage"
        [items]="storageItems"
      />
    </div>
  `,
  styles: `
    .custom-meter-group {
      --aeris-meter-group-track-size: 1.5rem;
      --aeris-meter-group-track-background: color-mix(
        in srgb,
        var(--aeris-primary) 8%,
        var(--aeris-surface)
      );
      --aeris-meter-group-track-border: color-mix(
        in srgb,
        var(--aeris-primary) 42%,
        var(--aeris-border)
      );
      --aeris-meter-group-legend-gap: 0.875rem 1.5rem;
      --aeris-meter-group-marker-size: 0.875rem;
      --aeris-meter-group-label-font-size: 0.9375rem;
    }
  `
})
export class MeterGroupTokensTokenCustomizationDemo {
  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
}
```

## Accessibility

- The visual track exposes native meter semantics with minimum, maximum, combined value, and readable value text.
- Every legend entry includes label and value text, so color is never the only way measurements are communicated.
- Custom label icons are decorative; the generated accessible item text remains available to assistive technology.
- Values that exceed capacity are visually capped without hiding their original legend values.
- MeterGroup is non-interactive and does not enter the tab order.
- Logical layout supports RTL, and segment reveal animation is disabled under reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | MeterGroup handles no keyboard input because it presents read-only measurements. Projected interactive header or footer content keeps its native behavior. |
