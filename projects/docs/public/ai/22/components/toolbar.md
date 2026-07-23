# Toolbar

> Responsive action surface for grouping controls, status, and navigation with accessible toolbar semantics.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/toolbar`
- Human-readable documentation: [https://aeris-ui.dev/components/toolbar](https://aeris-ui.dev/components/toolbar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `''` | Optional ID for the toolbar host. |
| `variant` | `AerisToolbarVariant` | `'outlined'` | Outlined, filled, elevated, or plain surface treatment. |
| `size` | `AerisToolbarSize` | `'md'` | Controls toolbar padding and spacing density. |
| `orientation` | `AerisToolbarOrientation` | `'horizontal'` | Sets horizontal or vertical layout and toolbar orientation semantics. |
| `align` | `AerisToolbarAlign` | `'center'` | Aligns sections across the cross axis. |
| `wrap` | `boolean` | `true` | Allows horizontal toolbars to wrap when space is limited. |
| `fluid` | `boolean` | `true` | Makes the toolbar fill the available inline size. |
| `disabled` | `boolean` | `false` | Marks the toolbar disabled and makes projected controls inert. |
| `role` | `AerisToolbarRole` | `'toolbar'` | Semantic role for the host. Use group or null when toolbar semantics are not appropriate. |
| `ariaLabel` | `string` | `''` | Accessible name for the toolbar host. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the toolbar. |
| `ariaDescribedBy` | `string` | `''` | ID of text that describes the toolbar. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisToolbarStart` | `attribute directive` | `-` | Start-aligned section for primary navigation or leading actions. |
| `aerisToolbarCenter` | `attribute directive` | `-` | Centered section for status, segmented actions, or title content. |
| `aerisToolbarEnd` | `attribute directive` | `-` | End-aligned section for final or secondary actions. |
| `aerisToolbarGroup` | `attribute directive` | `-` | Inline group for related controls inside a section. |
| `aerisToolbarSpacer` | `attribute directive` | `-` | Flexible spacer for custom projected layouts. |

### Content Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Unslotted content rendered after the named toolbar sections. |

## Interfaces and types

### Interfaces

```ts
type AerisToolbarVariant = 'outlined' | 'filled' | 'elevated' | 'plain';
type AerisToolbarSize = 'sm' | 'md' | 'lg';
type AerisToolbarOrientation = 'horizontal' | 'vertical';
type AerisToolbarRole = 'toolbar' | 'group' | null;
type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-toolbar-background` | `color` | `--aeris-surface` | Toolbar surface color. |
| `--aeris-toolbar-color` | `color` | `--aeris-text` | Toolbar text color. |
| `--aeris-toolbar-border` | `color` | `--aeris-border` | Toolbar border color. |
| `--aeris-toolbar-border-width` | `length` | `1px` | Toolbar border width. |
| `--aeris-toolbar-radius` | `length` | `--aeris-radius-lg` | Toolbar corner radius. |
| `--aeris-toolbar-shadow` | `shadow` | `none` | Toolbar shadow. |
| `--aeris-toolbar-filled-background` | `color` | `surface mix` | Filled variant surface. |
| `--aeris-toolbar-elevated-shadow` | `shadow` | `soft elevation` | Elevated variant shadow. |
| `--aeris-toolbar-padding-block` | `length` | `0.75rem` | Default block padding. |
| `--aeris-toolbar-padding-inline` | `length` | `0.875rem` | Default inline padding. |
| `--aeris-toolbar-gap` | `length` | `0.75rem` | Gap between toolbar sections. |
| `--aeris-toolbar-section-gap` | `length` | `0.5rem` | Gap between controls inside sections and groups. |
| `--aeris-toolbar-min-height` | `length` | `3.25rem` | Minimum content row height. |
| `--aeris-toolbar-spacer-min-size` | `length` | `1rem` | Minimum size for flexible spacers. |
| `--aeris-toolbar-disabled-opacity` | `number` | `0.62` | Opacity when disabled. |

## Examples

### Basic

Group primary and secondary actions in a semantic toolbar.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-basic-demo',
  imports: [AerisButton, AerisToolbarModule],
  template: `
    <div>
      <aeris-toolbar ariaLabel="Editor actions">
        <div aerisToolbarStart>
          <div class="toolbar-actions">
            <button aerisButton type="button" variant="secondary">Cancel</button>
            <button aerisButton type="button">Save</button>
          </div>
        </div>
      </aeris-toolbar>
    </div>
  `,
  styles: `
    .toolbar-actions {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `
})
export class ToolbarBasicBasicDemo {
}
```

### Sections

Use start, center, and end sections for balanced toolbar layouts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-sections-demo',
  imports: [AerisButton, AerisToolbarModule],
  templateUrl: './toolbar-sections.demo.html',
  styleUrl: './toolbar-sections.demo.scss'
})
export class ToolbarSectionsSectionsDemo {
}
```

#### HTML

```html
<div>
  <aeris-toolbar ariaLabel="Project toolbar">
    <div aerisToolbarStart>
      <div class="toolbar-title">
        <strong>Website refresh</strong>
        <span>Draft saved 2 minutes ago</span>
      </div>
    </div>
    <div aerisToolbarCenter>
      <span class="toolbar-status">Review mode</span>
    </div>
    <div aerisToolbarEnd>
      <button aerisButton type="button" size="sm" variant="secondary">Preview</button>
      <button aerisButton type="button" size="sm">Publish</button>
    </div>
  </aeris-toolbar>
</div>
```

#### CSS

```css
.toolbar-title {
  display: grid;
  gap: 0.125rem;
  min-width: 0;
}

.toolbar-title strong {
  color: var(--text);
}

.toolbar-title span,
.toolbar-status {
  color: var(--text-2);
  font-size: 0.8125rem;
}

.toolbar-status {
  white-space: nowrap;
}
```

### Groups

Group related controls and use spacers for custom projected layouts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-groups-demo',
  imports: [AerisButton, AerisInputText, AerisToolbarModule],
  templateUrl: './toolbar-groups.demo.html',
  styleUrl: './toolbar-groups.demo.scss'
})
export class ToolbarGroupsGroupsDemo {
}
```

#### HTML

```html
<div>
  <aeris-toolbar ariaLabel="Formatting toolbar">
    <div aerisToolbarStart>
      <div aerisToolbarGroup aria-label="Text style">
        <button aerisButton type="button" size="sm" variant="secondary">Bold</button>
        <button aerisButton type="button" size="sm" variant="secondary">
          Italic
        </button>
        <button aerisButton type="button" size="sm" variant="secondary">Link</button>
      </div>
      <span aerisToolbarSpacer></span>
      <input
        aerisInputText
        class="toolbar-search"
        type="search"
        aria-label="Search document"
        placeholder="Search document"
      />
    </div>
  </aeris-toolbar>
</div>
```

#### CSS

```css
.toolbar-search {
  min-width: 12rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
}

.toolbar-search:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--aeris-focus) 38%, transparent);
  outline-offset: 2px;
}
```

### Wrapping

Allow wrapping for responsive layouts or disable it when horizontal scrolling is preferred.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-wrapping-demo',
  imports: [AerisButton, AerisToolbarModule],
  templateUrl: './toolbar-wrapping.demo.html',
  styleUrl: './toolbar-wrapping.demo.scss'
})
export class ToolbarWrappingWrappingDemo {
}
```

#### HTML

```html
<div>
  <aeris-toolbar ariaLabel="Wrapping toolbar" [wrap]="false">
    <div aerisToolbarStart>
      <button
        class="toolbar-wide-item"
        aerisButton
        type="button"
        size="sm"
        variant="secondary"
      >
        Dashboard
      </button>
      <button
        class="toolbar-wide-item"
        aerisButton
        type="button"
        size="sm"
        variant="secondary"
      >
        Reports
      </button>
      <button
        class="toolbar-wide-item"
        aerisButton
        type="button"
        size="sm"
        variant="secondary"
      >
        Automation
      </button>
      <button class="toolbar-wide-item" aerisButton type="button" size="sm">
        Create task
      </button>
    </div>
  </aeris-toolbar>
</div>
```

#### CSS

```css
.toolbar-wide-item {
  min-width: 10rem;
}
```

### Vertical

Set vertical orientation when actions should stack beside content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-vertical-demo',
  imports: [AerisButton, AerisToolbarModule],
  templateUrl: './toolbar-vertical.demo.html',
  styleUrl: './toolbar-vertical.demo.scss'
})
export class ToolbarVerticalVerticalDemo {
}
```

#### HTML

```html
<div>
  <div class="vertical-toolbar-demo">
    <aeris-toolbar orientation="vertical" [fluid]="false" ariaLabel="Canvas tools">
      <div aerisToolbarStart>
        <button aerisButton type="button" size="sm" variant="secondary">
          Select
        </button>
        <button aerisButton type="button" size="sm" variant="secondary">Move</button>
        <button aerisButton type="button" size="sm">Export</button>
      </div>
    </aeris-toolbar>
    <div class="vertical-preview">
      <h4>Canvas</h4>
      <p>Vertical toolbars keep compact action sets close to the working surface.</p>
    </div>
  </div>
</div>
```

#### CSS

```css
.vertical-toolbar-demo {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.vertical-preview {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-lg);
  background: var(--surface);
}

.vertical-preview h4 {
  margin: 0 0 0.375rem;
  color: var(--text);
}

.vertical-preview p {
  margin: 0;
  color: var(--text-2);
}
```

### Variants

Match surrounding surfaces with outlined, filled, elevated, or plain toolbars.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-variants-demo',
  imports: [AerisButton, AerisToolbarModule],
  templateUrl: './toolbar-variants.demo.html',
  styleUrl: './toolbar-variants.demo.scss'
})
export class ToolbarVariantsVariantsDemo {
}
```

#### HTML

```html
<div>
  <div class="toolbar-grid">
    <aeris-toolbar ariaLabel="Outlined toolbar">
      <div aerisToolbarStart>
        <button aerisButton type="button" size="sm">Outlined</button>
      </div>
    </aeris-toolbar>
    <aeris-toolbar variant="filled" ariaLabel="Filled toolbar">
      <div aerisToolbarStart>
        <button aerisButton type="button" size="sm">Filled</button>
      </div>
    </aeris-toolbar>
    <aeris-toolbar variant="elevated" ariaLabel="Elevated toolbar">
      <div aerisToolbarStart>
        <button aerisButton type="button" size="sm">Elevated</button>
      </div>
    </aeris-toolbar>
    <aeris-toolbar variant="plain" size="lg" ariaLabel="Plain toolbar">
      <div aerisToolbarStart>
        <button aerisButton type="button" size="sm">Plain</button>
      </div>
    </aeris-toolbar>
  </div>
</div>
```

#### CSS

```css
.toolbar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 42rem) {
  .toolbar-grid {
    grid-template-columns: 1fr;
  }
}
```

### Token customization

Use component tokens to tune surface, border, radius, padding, and gaps.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-custom-demo',
  imports: [AerisButton, AerisToolbarModule],
  template: `
    <div>
      <aeris-toolbar class="brand-toolbar" ariaLabel="Custom toolbar">
        <div aerisToolbarStart>
          <button aerisButton type="button" size="sm" variant="secondary">Archive</button>
        </div>
        <div aerisToolbarEnd>
          <button aerisButton type="button" size="sm">Share</button>
        </div>
      </aeris-toolbar>
    </div>
  `,
  styles: `
    .brand-toolbar {
      --aeris-toolbar-background: color-mix(in srgb, var(--aeris-primary) 10%, var(--surface));
      --aeris-toolbar-border-width: 2px;
      --aeris-toolbar-border: color-mix(in srgb, var(--aeris-primary) 72%, var(--border));
      --aeris-toolbar-radius: 1.5rem;
      --aeris-toolbar-gap: 1rem;
      --aeris-toolbar-section-gap: 0.75rem;
      --aeris-toolbar-padding-block: 1rem;
      --aeris-toolbar-padding-inline: 1.125rem;
    }
  `
})
export class ToolbarCustomTokenCustomizationDemo {
}
```

## Accessibility

- The host uses role="toolbar" by default and sets aria-orientation from the orientation input.
- Use ariaLabel or ariaLabelledBy when the toolbar needs a clear accessible name.
- Use role="group" or [role]="null" when the surface is only visual grouping.
- Projected controls keep their own native semantics, names, states, validation, and focus behavior.
- The disabled state marks the toolbar with aria-disabled and applies inert to the projected subtree.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Projected interactive controls |
| `Shift + Tab` | Projected interactive controls |
| `Enter` | Projected buttons or links |
| `Space` | Projected buttons and checkbox-like controls |
| `Arrow keys` | Projected controls |
