# Glass

> Apply configurable, theme-aware translucent backgrounds and backdrop blur to compatible surfaces.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/glass`
- Human-readable documentation: [https://aeris-ui.dev/components/glass](https://aeris-ui.dev/components/glass)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisGlassModule } from '@aeris-ui/core/glass';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisGlass` | `boolean` | `true` | Enables the glass treatment. A bare aerisGlass attribute enables it. |
| `aerisGlassBlur` | `string` | `''` | Optional CSS length that overrides the shared blur radius for this surface. |
| `aerisGlassBackground` | `string` | `''` | Optional translucent CSS color that overrides the shared glass background. |

### Supported Surfaces

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `Content surfaces` | `Card, Panel, Accordion` | `supported` | Applies blur to the owned surface while preserving projected content styling. |
| `Navigation surfaces` | `Breadcrumb, Toolbar, Menu, TieredMenu, ContextMenu, MegaMenu, Menubar` | `supported` | Applies to root surfaces and owned submenu panels where applicable. |
| `Overlay surfaces` | `Dialog, Drawer, Popover, ConfirmPopup` | `supported` | Styles the foreground surface independently from the backdrop blur. |
| `Picker surfaces` | `AutoComplete, CascadeSelect, Select, TreeSelect, DatePicker` | `supported` | Applies to the control and its owned panel without changing nested controls. |
| `Native containers` | `div, section, article, aside, nav, form, header, footer, main` | `supported` | Provides the same background and blur treatment to semantic application containers. |

## Examples

### Basic

Apply the default theme-aware glass treatment to a semantic container.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGlassModule } from '@aeris-ui/core/glass';

@Component({
  selector: 'app-glass-basic-demo',
  imports: [AerisGlassModule],
  template: `
    <div>
      <div class="glass-stage">
        <section aerisGlass class="glass-surface" aria-labelledby="glass-basic-heading">
          <h4 id="glass-basic-heading">Release overview</h4>
          <p>The content stays crisp while the colors behind the surface are softened.</p>
        </section>
      </div>
    </div>
  `,
  styles: `
    .glass-stage {
      position: relative;
      overflow: hidden;
      min-height: 16rem;
      display: grid;
      place-items: center;
      padding: 2rem;
      border-radius: var(--aeris-radius-xl);
      background: url('/abstract.jpg') center / cover no-repeat;
    }
    
    .glass-surface {
      width: min(100%, 30rem);
      padding: 1.5rem;
      border: 1px solid color-mix(in srgb, var(--aeris-border) 70%, transparent);
      border-radius: var(--aeris-radius-lg);
      box-shadow: var(--aeris-shadow-sm);
    }
  `
})
export class GlassBasicBasicDemo {
}
```

### Blur strength

Set a CSS length per surface or change the shared token for an application-wide default.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGlassModule } from '@aeris-ui/core/glass';

@Component({
  selector: 'app-glass-strength-demo',
  imports: [AerisGlassModule],
  templateUrl: './glass-strength.demo.html',
  styleUrl: './glass-strength.demo.scss'
})
export class GlassStrengthBlurStrengthDemo {
}
```

#### HTML

```html
<div>
  <div class="glass-strength-grid">
    <section aerisGlass>
      <h4>Default</h4>
      <p>0.25rem</p>
    </section>
    <section aerisGlass aerisGlassBlur="0.75rem">
      <h4>Medium</h4>
      <p>0.75rem</p>
    </section>
    <section aerisGlass aerisGlassBlur="1.5rem">
      <h4>Strong</h4>
      <p>1.5rem</p>
    </section>
  </div>
</div>
```

#### CSS

```css
.glass-strength-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding: 2rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-strength-grid section {
  min-width: 0;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--aeris-border) 70%, transparent);
  border-radius: var(--aeris-radius-lg);
}

.glass-strength-grid h4,
.glass-strength-grid p {
  margin: 0;
}

.glass-strength-grid p {
  margin-top: 0.375rem;
  color: var(--aeris-text-2);
}

@media (max-width: 42rem) {
  .glass-strength-grid {
    grid-template-columns: 1fr;
  }
}
```

### Aeris surfaces

Use the same directive with cards, panels, accordions, menus, and other compatible surfaces.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisGlassModule } from '@aeris-ui/core/glass';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisPanelModule } from '@aeris-ui/core/panel';

@Component({
  selector: 'app-glass-components-demo',
  imports: [AerisAccordionModule, AerisCardModule, AerisGlassModule, AerisMenuModule, AerisPanelModule],
  templateUrl: './glass-components.demo.html',
  styleUrl: './glass-components.demo.scss'
})
export class GlassComponentsAerisSurfacesDemo {
  protected readonly menuItems: readonly AerisMenuItem[] = [
    { label: 'Overview' },
    { label: 'Activity' },
    { label: 'Settings' },
  ];
}
```

#### HTML

```html
<div>
  <div class="glass-component-stage">
    <aeris-card aerisGlass>
      <h4 aerisCardTitle>Workspace health</h4>
      <p>All production systems are operating normally.</p>
    </aeris-card>

    <aeris-panel aerisGlass header="Latest activity">
      Three component releases were published this week.
    </aeris-panel>

    <aeris-accordion aerisGlass variant="separated">
      <aeris-accordion-panel value="delivery" header="Delivery">
        Review the release pipeline and deployment checks.
      </aeris-accordion-panel>
      <aeris-accordion-panel value="quality" header="Quality">
        Track accessibility, tests, and performance budgets.
      </aeris-accordion-panel>
    </aeris-accordion>

    <aeris-menu aerisGlass [model]="menuItems" ariaLabel="Workspace sections" />
  </div>
</div>
```

#### CSS

```css
.glass-component-stage {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 2rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-component-stage aeris-accordion,
.glass-component-stage aeris-menu {
  align-self: start;
}

@media (max-width: 44rem) {
  .glass-component-stage {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
```

### Controlled

Enable or disable the treatment without recreating the component or its content.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisGlassModule } from '@aeris-ui/core/glass';

@Component({
  selector: 'app-glass-controlled-demo',
  imports: [AerisButton, AerisCardModule, AerisGlassModule],
  templateUrl: './glass-controlled.demo.html',
  styleUrl: './glass-controlled.demo.scss'
})
export class GlassControlledControlledDemo {
  protected readonly glassEnabled = signal(true);
}
```

#### HTML

```html
<div>
  <div class="glass-controlled-stage">
    <button
      aerisButton
      type="button"
      variant="secondary"
      [attr.aria-pressed]="glassEnabled()"
      (click)="glassEnabled.update((enabled) => !enabled)"
    >
      {{ glassEnabled() ? 'Disable glass' : 'Enable glass' }}
    </button>
    <aeris-card [aerisGlass]="glassEnabled()">
      <h4 aerisCardTitle>Controlled surface</h4>
      <p aria-live="polite">
        Glass is {{ glassEnabled() ? 'enabled' : 'disabled' }}.
      </p>
    </aeris-card>
  </div>
</div>
```

#### CSS

```css
.glass-controlled-stage {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--aeris-radius-xl);
  background: url('/abstract.jpg') center / cover no-repeat;
}

.glass-controlled-stage aeris-card {
  width: min(100%, 32rem);
}
```

## Accessibility

- Glass changes presentation only and adds no role, focus target, or interaction.
- Text and controls retain their existing semantics and keyboard behavior.
- Keep the translucent background opaque enough to preserve WCAG 2.2 AA contrast over every color or image that may appear behind it.
- Avoid placing critical text over rapidly changing content because blur does not guarantee a uniform contrast ratio.
- Disabling Glass removes both its translucent surface and backdrop filter.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | Glass handles no keys. The host component or projected interactive elements retain their documented keyboard behavior. |
