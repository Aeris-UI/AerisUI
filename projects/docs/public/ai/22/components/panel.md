# Panel

> Composable content container with optional collapse behavior, templates, actions, and accessible disclosure semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/panel`
- Human-readable documentation: [https://aeris-ui.dev/components/panel](https://aeris-ui.dev/components/panel)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisPanelModule } from '@aeris-ui/core/panel';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Host ID used to derive header and content IDs. |
| `header` | `string` | `''` | Default header text. |
| `toggleable` | `boolean` | `false` | Adds a native disclosure button for showing and hiding content. |
| `disabled` | `boolean` | `false` | Disables the toggle button without hiding content. |
| `variant` | `AerisPanelVariant` | `'outlined'` | Outlined, elevated, filled, or plain surface treatment. |
| `size` | `AerisPanelSize` | `'md'` | Controls header and content density. |
| `animated` | `boolean` | `true` | Enables content and indicator transitions. |
| `headingLevel` | `1 &#124; 2 &#124; 3 &#124; 4 &#124; 5 &#124; 6` | `3` | ARIA heading level for the panel header. |
| `role` | `AerisPanelRole` | `null` | Optional semantic role for the panel host. |
| `ariaLabel` | `string` | `''` | Accessible name for the panel host when no visible label is referenced. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the panel host. |
| `ariaDescribedBy` | `string` | `''` | ID of text that describes the panel host. |
| `toggleButtonLabel` | `string` | `''` | Optional accessible name for the toggle button when header text is not enough. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | `false` | Two-way collapse state for controlled panels. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `toggled` | `AerisPanelToggleEvent` | `-` | Emitted whenever the panel changes collapse state. |
| `panelExpanded` | `AerisPanelToggleEvent` | `-` | Emitted when content becomes visible. |
| `panelCollapsed` | `AerisPanelToggleEvent` | `-` | Emitted when content becomes hidden. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisPanelHeader` | `AerisPanelHeaderContext` | `header text` | Custom header content rendered inside the heading or toggle button. |
| `aerisPanelToggleIcon` | `AerisPanelToggleIconContext` | `centered chevron icon` | Custom indicator for toggleable panels. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Panel body content. |
| `aerisPanelHeaderActions` | `attribute directive` | `-` | Action area aligned beside the header. |
| `aerisPanelFooter` | `attribute directive` | `-` | Footer content rendered after the body. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `toggle` | `(originalEvent?: Event &#124; null) =&gt; void` | `-` | Toggles a toggleable, enabled panel. |
| `expand` | `(originalEvent?: Event &#124; null) =&gt; void` | `-` | Shows content when the panel is toggleable and enabled. |
| `collapse` | `(originalEvent?: Event &#124; null) =&gt; void` | `-` | Hides content when the panel is toggleable and enabled. |

## Interfaces and types

### Interfaces

```ts
type AerisPanelVariant = 'outlined' | 'elevated' | 'filled' | 'plain';
type AerisPanelSize = 'sm' | 'md' | 'lg';
type AerisPanelRole = 'region' | 'group' | 'article' | null;

interface AerisPanelToggleEvent {
  readonly originalEvent: Event | null;
  readonly collapsed: boolean;
  readonly previousCollapsed: boolean;
}

interface AerisPanelHeaderContext {
  readonly $implicit: boolean;
  readonly collapsed: boolean;
  readonly expanded: boolean;
  readonly toggleable: boolean;
  readonly disabled: boolean;
}

interface AerisPanelToggleIconContext extends AerisPanelHeaderContext {}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-panel-background` | `CSS custom property` | `--aeris-surface` | Panel surface. |
| `--aeris-panel-border` | `CSS custom property` | `--aeris-border` | Outer border. |
| `--aeris-panel-radius` | `CSS custom property` | `--aeris-radius-lg` | Outer corner radius. |
| `--aeris-panel-shadow` | `CSS custom property` | `none` | Default elevation. |
| `--aeris-panel-header-background` | `CSS custom property` | `surface mix` | Header surface. |
| `--aeris-panel-header-border` | `CSS custom property` | `--aeris-border` | Header separator. |
| `--aeris-panel-title-color` | `CSS custom property` | `--aeris-text` | Header title color. |
| `--aeris-panel-content-color` | `CSS custom property` | `--aeris-text-2` | Body text color. |
| `--aeris-panel-icon-size` | `CSS custom property` | `1.25rem` | Default toggle icon box. |
| `--aeris-panel-footer-gap` | `CSS custom property` | `0.625rem` | Footer action spacing. |

## Examples

### Basic

Use Panel as a titled content surface without adding interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-basic-demo',
  imports: [AerisPanelModule],
  templateUrl: './panel-basic.demo.html',
  styleUrl: './panel-basic.demo.scss'
})
export class PanelBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <aeris-panel header="Order summary" role="region">
    <dl class="summary-list">
      <div class="summary-row">
        <dt>Wireless headphones</dt>
        <dd>$79.00</dd>
      </div>
      <div class="summary-row">
        <dt>Phone case</dt>
        <dd>$15.00</dd>
      </div>
      <div class="summary-row">
        <dt>Shipping</dt>
        <dd>$5.99</dd>
      </div>
      <div class="summary-row summary-total">
        <dt>Total</dt>
        <dd>$99.99</dd>
      </div>
    </dl>
  </aeris-panel>
</div>
```

#### CSS

```css
.summary-list {
  display: grid;
  gap: 0.625rem;
  margin: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summary-total {
  margin-block-start: 0.75rem;
  padding-block-start: 0.75rem;
  border-block-start: 1px solid var(--border);
  font-weight: 800;
}
```

### Toggleable

Add a native disclosure button when the content should collapse.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-toggleable-demo',
  imports: [AerisPanelModule],
  templateUrl: './panel-toggleable.demo.html',
  styleUrl: './panel-toggleable.demo.scss'
})
export class PanelToggleableToggleableDemo {
}
```

#### HTML

```html
<div>
  <aeris-panel header="Order summary" toggleable>
    <dl class="summary-list">
      <div class="summary-row">
        <dt>Wireless headphones</dt>
        <dd>$79.00</dd>
      </div>
      <div class="summary-row">
        <dt>Phone case</dt>
        <dd>$15.00</dd>
      </div>
      <div class="summary-row summary-total">
        <dt>Total</dt>
        <dd>$94.00</dd>
      </div>
    </dl>
  </aeris-panel>
</div>
```

#### CSS

```css
.summary-list {
  display: grid;
  gap: 0.625rem;
  margin: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summary-total {
  margin-block-start: 0.75rem;
  padding-block-start: 0.75rem;
  border-block-start: 1px solid var(--border);
  font-weight: 800;
}
```

### Controlled

Bind the collapsed model and update it from external controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPanelModule, type AerisPanelToggleEvent } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-controlled-demo',
  imports: [AerisButton, AerisPanelModule],
  templateUrl: './panel-controlled.demo.html',
  styleUrl: './panel-controlled.demo.scss'
})
export class PanelControlledControlledDemo {
  protected controlledCollapsed = true;
  protected readonly toggleEvents: string[] = [];

  protected openPanel(): void {
    this.controlledCollapsed = false;
  }

  protected closePanel(): void {
    this.controlledCollapsed = true;
  }

  protected togglePanel(): void {
    this.controlledCollapsed = !this.controlledCollapsed;
  }

  protected recordToggle(event: AerisPanelToggleEvent): void {
    const next = event.collapsed ? 'Collapsed' : 'Expanded';
    this.toggleEvents.unshift(next);
  }
}
```

#### HTML

```html
<div>
  <div class="panel-actions">
    <button aerisButton type="button" size="sm" (click)="openPanel()">Open</button>
    <button
      aerisButton
      type="button"
      size="sm"
      variant="secondary"
      (click)="closePanel()"
    >
      Close
    </button>
    <button
      aerisButton
      type="button"
      size="sm"
      variant="ghost"
      (click)="togglePanel()"
    >
      Toggle
    </button>
  </div>
  <aeris-panel
    header="Release checklist"
    toggleable
    [(collapsed)]="controlledCollapsed"
    (toggled)="recordToggle($event)"
  >
    <p>
      Review accessibility notes, run the test suite, and publish migration guidance.
    </p>
  </aeris-panel>
  <p class="panel-event-log">
    State: {{ controlledCollapsed ? 'Closed' : 'Open' }} · Last event:
    {{ toggleEvents[0] || 'None' }}
  </p>
</div>
```

#### CSS

```css
.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 0 0.875rem;
}

.panel-event-log {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}
```

### Header actions

Project native controls into the header action area without making the whole header interactive.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-actions-demo',
  imports: [AerisButton, AerisPanelModule],
  template: `
    <div>
      <aeris-panel header="Team activity">
        <div aerisPanelHeaderActions>
          <button aerisButton type="button" size="sm" variant="secondary">Refresh</button>
        </div>
        <p>Seven updates were added since the last review.</p>
      </aeris-panel>
    </div>
  `
})
export class PanelActionsHeaderActionsDemo {
}
```

### Indicator

Customize the toggle indicator with a template that receives collapse state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-indicator-demo',
  imports: [AerisPanelModule],
  template: `
    <div>
      <aeris-panel header="Advanced settings" toggleable>
        <ng-template aerisPanelToggleIcon let-collapsed="collapsed">
          <span class="panel-plus-icon" [attr.data-collapsed]="collapsed"></span>
        </ng-template>
        <p>Manage diagnostics, audit logging, and release flags.</p>
      </aeris-panel>
    </div>
  `,
  styles: `
    .panel-plus-icon {
      position: relative;
      display: inline-block;
      width: 1rem;
      height: 1rem;
    }
    
    .panel-plus-icon::before,
    .panel-plus-icon::after {
      position: absolute;
      inset: 50% auto auto 50%;
      width: 0.875rem;
      height: 0.125rem;
      border-radius: 999px;
      background: currentColor;
      content: "";
      transform: translate(-50%, -50%);
    }
    
    .panel-plus-icon::after {
      transform: translate(-50%, -50%) rotate(90deg);
      transition: transform 160ms ease;
    }
    
    .panel-plus-icon[data-collapsed="false"]::after {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  `
})
export class PanelIndicatorIndicatorDemo {
}
```

### Template

Replace the header content and add a footer while keeping Panel semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-template-demo',
  imports: [AerisButton, AerisPanelModule],
  templateUrl: './panel-template.demo.html',
  styleUrl: './panel-template.demo.scss'
})
export class PanelTemplateTemplateDemo {
}
```

#### HTML

```html
<div>
  <aeris-panel toggleable>
    <ng-template aerisPanelHeader>
      <span class="profile-panel-header">
        <span class="profile-avatar" aria-hidden="true">AE</span>
        <span class="profile-meta">
          <strong>Amy Evans</strong>
          <span>Product design lead</span>
        </span>
      </span>
    </ng-template>
    <p>
      Amy is reviewing accessibility findings and preparing handoff notes for the
      release.
    </p>
    <div aerisPanelFooter>
      <button aerisButton type="button" size="sm">View profile</button>
      <button aerisButton type="button" size="sm" variant="secondary">Message</button>
    </div>
  </aeris-panel>
</div>
```

#### CSS

```css
.profile-panel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-avatar {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--aeris-primary) 18%, var(--surface));
  color: var(--aeris-primary-text);
  font-weight: 800;
}

.profile-meta {
  display: grid;
  gap: 0.125rem;
}

.profile-meta span {
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 600;
}
```

### Variants

Use variants and sizes to match the surrounding layout density.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-panel-variants-demo',
  imports: [AerisPanelModule],
  templateUrl: './panel-variants.demo.html',
  styleUrl: './panel-variants.demo.scss'
})
export class PanelVariantsVariantsDemo {
}
```

#### HTML

```html
<div>
  <div class="panel-grid">
    <aeris-panel header="Outlined" variant="outlined" size="sm"
      ><p>Quiet bordered surface.</p></aeris-panel
    >
    <aeris-panel header="Elevated" variant="elevated"
      ><p>Raised container for prominence.</p></aeris-panel
    >
    <aeris-panel header="Filled" variant="filled"
      ><p>Soft background grouping.</p></aeris-panel
    >
    <aeris-panel header="Plain" variant="plain" size="lg"
      ><p>Header and content without an outer card.</p></aeris-panel
    >
  </div>
</div>
```

#### CSS

```css
.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 42rem) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

- Panel is semantic-neutral by default; use role when the panel is a meaningful region, group, or article.
- Toggleable panels use a native button with aria-expanded and aria-controls.
- The content region references the header with aria-labelledby when the panel is toggleable.
- Collapsed content is marked with aria-hidden and inert so projected controls are not reachable while hidden.
- The header uses a configurable ARIA heading level. Choose a level that matches the surrounding document hierarchy.
- Animations respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to the toggle button and projected interactive elements that are currently visible. |
| `Enter` | Toggles content when focus is on the toggle button. |
| `Space` | Toggles content when focus is on the toggle button. |
| `Escape` | No built-in behavior. |
