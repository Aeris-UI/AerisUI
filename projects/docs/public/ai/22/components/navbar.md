# Navbar

> Responsive native navigation with brand and action slots, inline mobile expansion, disclosures, and sticky positioning.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/navbar`
- Human-readable documentation: [https://aeris-ui.dev/components/navbar](https://aeris-ui.dev/components/navbar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisNavbarModule } from '@aeris-ui/core/navbar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `maxWidth` | `string` | `'72rem'` | Maximum inner content width. The header surface still spans its container. Use 100% for a full-width inner layout. |
| `alignment` | `'start' &#124; 'center' &#124; 'end'` | `'center'` | Desktop navigation alignment between the brand and actions. |
| `mode` | `AerisNavbarMode` | `'auto'` | Options: 'auto', 'desktop', 'mobile'. Auto observes this component's available width, not the whole browser. |
| `breakpoint` | `number &#124; 'auto'` | `768` | A number sets the maximum available width in pixels for mobile expansion. Use 'auto' to switch when the brand, links, actions and spacing no longer fit; it responds to content, fonts and container resizing. Applies only when mode is 'auto'. Defaults to 768; negative numbers use zero and non-finite numbers use 768. |
| `variant` | `AerisNavbarVariant` | `'standard'` | Options: 'standard', 'floating', 'transparent'. Changes only the container surface. |
| `sticky` | `boolean` | `false` | Uses CSS sticky positioning inside the nearest scrolling ancestor. Set --aeris-navbar-top for an offset. |
| `closeOnNavigate` | `boolean` | `true` | Closes mobile navigation and navigation dropdowns when an enabled item is activated. Modified and new-tab links remain open. |
| `closeOnOutsideClick` | `boolean` | `true` | Closes expanded mobile navigation on an outside pointer press. Does not trap focus or block the page. |
| `ariaLabel` | `string` | `'Primary navigation'` | Accessible name of the native navigation landmark. |
| `ariaLabelledBy` | `string` | `''` | Visible heading ID instead of ariaLabel. Keep the heading outside the collapsible region. |
| `openAriaLabel` | `string` | `'Open navigation'` | Name of the closed mobile toggle, including a custom toggle. |
| `closeAriaLabel` | `string` | `'Close navigation'` | Name of the expanded mobile toggle, including a custom toggle. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `expanded` | `boolean (model)` | `false` | Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible. |
| `expandedChange` | `boolean (output)` | `—` | Emits changes to expanded, including toggle, Escape, outside press and item activation. |
| `mobile` | `Signal&lt;boolean&gt;` | `derived` | Read-only effective mobile mode. |
| `navigationId` | `string` | `generated` | Unique navigation ID used by the built-in and custom toggle aria-controls. |
| `toggle()` | `() =&gt; void` | `—` | Toggles expanded in mobile mode. Does nothing in desktop mode. |
| `close()` | `() =&gt; void` | `—` | Clears expanded without hiding desktop navigation. |

### Items

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisNavbarItem` | `native a or button directive` | `—` | Preserves native links, RouterLink, buttons and Tab order. Consumer content supplies the accessible name. |
| `active` | `boolean` | `false` | Adds active styling and aria-current="page". Route state remains consumer-owned. |
| `disabled` | `boolean` | `false` | Disables native buttons and prevents links before RouterLink or consumer click handlers. Disabled links leave Tab order; previous tabindex is restored. |

### Disclosures

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `Signal&lt;boolean&gt; (read-only)` | `derived` | True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically. |
| `appendTo` | `AerisAppendTo` | `undefined` | Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef&lt;HTMLElement&gt;, TemplateRef&lt;unknown&gt;, null or undefined. Defaults to body; mobile dropdowns always expand inline. |
| `close(restoreFocus?)` | `(restoreFocus?: boolean) =&gt; void` | `false` | Closes the dropdown and optionally restores trigger focus. |
| `aeris-navbar-dropdown` | `dropdown component` | `—` | A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog. |
| `label` | `string` | `required` | Visible dropdown button and accessible name. |
| `expanded` | `boolean (model)` | `false` | Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open. |
| `expandedChange` | `boolean (output)` | `—` | Emits button, Escape, outside press and navigation changes. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisNavbarBrand` | `projected directive` | `—` | Brand content before navigation. Long text truncates visually without changing its accessible text. |
| `aerisNavbarLinks` | `projected directive` | `—` | Native navigation links and disclosures. Only one navigation tree is rendered. |
| `aerisNavbarActions` | `projected directive` | `—` | Actions remain visible while navigation collapses. At narrow widths they wrap onto their own row. |
| `aerisNavbarToggle` | `native button directive` | `—` | Optional custom toggle inside Navbar. Replaces the built-in toggle, supplies its state, name and controls relationship, and remains hidden on desktop. |
| `aerisNavbarIcon` | `projected directive` | `—` | Normalizes decorative icons from any library to Aeris icon geometry and hides them from assistive technology. |

## Interfaces and types

### Interfaces

```ts
type AerisNavbarMode = 'auto' | 'desktop' | 'mobile';
type AerisNavbarVariant = 'standard' | 'floating' | 'transparent';
```

## Examples

### Navigation

Items preserve native button or link behavior. This example controls active state; real destinations can use anchors or RouterLink.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

@Component({
  selector: 'app-navbar-basic-demo',
  imports: [AerisNavbarModule],
  templateUrl: './navbar-basic.demo.html',
  styleUrl: './navbar-basic.demo.scss'
})
export class NavbarBasicNavigationDemo {
  protected readonly active = signal('Overview');
}
```

#### HTML

```html
<div>
  <aeris-navbar [breakpoint]="480" ariaLabel="Basic example navigation">
    <strong aerisNavbarBrand class="navbar-demo-brand"
      ><span class="navbar-demo-mark" aria-hidden="true">W</span>
      <span>Workspace</span></strong>
    <div aerisNavbarLinks>
      @for (label of ['Overview', 'Projects', 'Settings']; track label) {
        <button
          aerisNavbarItem
          [active]="active() === label"
          (click)="active.set(label)"
        >
          {{ label }}
        </button>
      }
    </div>
  </aeris-navbar>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}
```

### Responsive expansion

Auto mode follows the Navbar's available width. Narrow this example to see the same links move below the brand. This example uses a 560px breakpoint; the default is 768px.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-responsive-demo',
  imports: [AerisButton, AerisNavbarModule],
  templateUrl: './navbar-responsive.demo.html',
  styleUrl: './navbar-responsive.demo.scss'
})
export class NavbarResponsiveResponsiveExpansionDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly compact = signal(false);

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <div class="navbar-preview-controls">
    <button
      aerisButton
      [variant]="compact() ? 'outline' : 'solid'"
      [attr.aria-pressed]="!compact()"
      (click)="compact.set(false)"
    >
      Available width
    </button>
    <button
      aerisButton
      [variant]="compact() ? 'solid' : 'outline'"
      [attr.aria-pressed]="compact()"
      (click)="compact.set(true)"
    >
      Compact width
    </button>
  </div>
  <div
    class="navbar-preview-frame"
    [style.inline-size]="compact() ? 'min(22rem, 100%)' : '100%'"
  >
    <aeris-navbar [breakpoint]="560" ariaLabel="Responsive example navigation">
      <strong aerisNavbarBrand class="navbar-demo-brand"
        ><span class="navbar-demo-mark" aria-hidden="true">W</span>
        <span>Workspace</span></strong>
      <div aerisNavbarLinks>
        @for (label of ['Overview', 'Projects', 'Settings']; track label) {
          <button
            aerisNavbarItem
            [active]="selections()['responsive'] === label"
            (click)="select('responsive', label)"
          >
            {{ label }}
          </button>
        }
      </div>
      <div aerisNavbarActions>
        <button aerisButton variant="ghost">Sign in</button>
      </div>
    </aeris-navbar>
  </div>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}

.navbar-preview-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1rem;
}

.navbar-preview-frame {
  inline-size: 100%;
  min-inline-size: 0;
}
```

### Automatic content fit

Set breakpoint to auto to collapse only when the desktop content no longer fits. Change the available width or the labels: the same navigation expands again as soon as there is enough room. Numeric breakpoints remain available when you want a fixed threshold.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-content-fit-demo',
  imports: [AerisButton, AerisNavbarModule],
  templateUrl: './navbar-content-fit.demo.html',
  styleUrl: './navbar-content-fit.demo.scss'
})
export class NavbarContentFitAutomaticContentFitDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly fitCompact = signal(false);

  protected readonly fitLongLabels = signal(false);

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <div class="navbar-preview-controls">
    <button
      aerisButton
      variant="outline"
      [attr.aria-pressed]="fitCompact()"
      (click)="fitCompact.set(!fitCompact())"
    >
      {{ fitCompact() ? 'Widen container' : 'Narrow container' }}
    </button>
    <button
      aerisButton
      variant="outline"
      [attr.aria-pressed]="fitLongLabels()"
      (click)="fitLongLabels.set(!fitLongLabels())"
    >
      {{ fitLongLabels() ? 'Short labels' : 'Long labels' }}
    </button>
  </div>
  <div
    class="navbar-preview-frame"
    [style.inline-size]="fitCompact() ? 'min(24rem, 100%)' : 'min(38rem, 100%)'"
  >
    <aeris-navbar breakpoint="auto" ariaLabel="Content fit example navigation">
      <strong aerisNavbarBrand>Workspace</strong>
      <div aerisNavbarLinks>
        @for (
          label of fitLongLabels()
            ? ['Workspace overview', 'Active projects', 'Team permissions']
            : ['Overview', 'Projects', 'Team'];
          track $index
        ) {
          <button
            aerisNavbarItem
            [active]="selections()['fit'] === label"
            (click)="select('fit', label)"
          >
            {{ label }}
          </button>
        }
      </div>
      <div aerisNavbarActions>
        <button aerisButton variant="ghost">Sign in</button>
      </div>
    </aeris-navbar>
  </div>
</div>
```

#### CSS

```css
.navbar-preview-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1rem;
}

.navbar-preview-frame {
  inline-size: 100%;
  min-inline-size: 0;
}
```

### Controlled expansion

Control the mobile model from outside Navbar. Outside dismissal is disabled here so the external controls do not dismiss navigation before their click handlers run.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-controlled-demo',
  imports: [AerisButton, AerisNavbarModule],
  templateUrl: './navbar-controlled.demo.html',
  styleUrl: './navbar-controlled.demo.scss'
})
export class NavbarControlledControlledExpansionDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly navigationExpanded = signal(false);

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <div class="navbar-preview-controls">
    <button aerisButton (click)="navigationExpanded.set(true)">Expand</button>
    <button aerisButton variant="outline" (click)="navigationExpanded.set(false)">
      Collapse</button>
      <span role="status">{{ navigationExpanded() ? 'Expanded' : 'Collapsed' }}</span>
  </div>
  <aeris-navbar
    mode="mobile"
    [(expanded)]="navigationExpanded"
    [closeOnOutsideClick]="false"
    ariaLabel="Controlled example navigation"
  >
    <strong aerisNavbarBrand class="navbar-demo-brand"
      ><span class="navbar-demo-mark" aria-hidden="true">W</span>
      <span>Workspace</span></strong>
    <div aerisNavbarLinks>
      @for (label of ['Overview', 'Projects']; track label) {
        <button
          aerisNavbarItem
          [active]="selections()['controlled'] === label"
          (click)="select('controlled', label)"
        >
          {{ label }}
        </button>
      }
      <button aerisNavbarItem disabled>Unavailable</button>
    </div>
  </aeris-navbar>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}

.navbar-preview-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1rem;
}
```

### Disclosures

Desktop dropdowns open below the header; nested menus open beside their item and flip at viewport edges. Hover or use the directional arrow key to open a submenu. Mobile menus expand inline. Selecting a nested item keeps its top-level dropdown marked as active.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-disclosures-demo',
  imports: [AerisNavbarModule],
  templateUrl: './navbar-disclosures.demo.html',
  styleUrl: './navbar-disclosures.demo.scss'
})
export class NavbarDisclosuresDisclosuresDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly disclosure = signal(false);

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <aeris-navbar [breakpoint]="480" ariaLabel="Disclosure example navigation">
    <strong aerisNavbarBrand class="navbar-demo-brand"
      ><span class="navbar-demo-mark" aria-hidden="true">W</span>
      <span>Workspace</span></strong>
    <div aerisNavbarLinks>
      @for (label of ['Overview', 'Projects']; track label) {
        <button
          aerisNavbarItem
          [active]="selections()['disclosures'] === label"
          (click)="select('disclosures', label)"
        >
          {{ label }}
        </button>
      }
      <aeris-navbar-dropdown label="Resources" [(expanded)]="disclosure">
        @for (label of ['Documentation', 'Examples']; track label) {
          <button
            aerisNavbarItem
            [active]="selections()['disclosures'] === label"
            (click)="select('disclosures', label)"
          >
            {{ label }}
          </button>
        }
        <aeris-navbar-dropdown label="More resources">
          @for (label of ['Release notes', 'Support']; track label) {
            <button
              aerisNavbarItem
              [active]="selections()['disclosures'] === label"
              (click)="select('disclosures', label)"
            >
              {{ label }}
            </button>
          }
        </aeris-navbar-dropdown>
      </aeris-navbar-dropdown>
      <aeris-navbar-dropdown label="Company">
        @for (label of ['About', 'Contact']; track label) {
          <button
            aerisNavbarItem
            [active]="selections()['disclosures'] === label"
            (click)="select('disclosures', label)"
          >
            {{ label }}
          </button>
        }
      </aeris-navbar-dropdown>
    </div>
  </aeris-navbar>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}
```

### Brand and actions

Keep brand and action slots visible, and replace the mobile toggle with consumer-provided icons. The mobile toggle and primary action keep their space at narrow widths.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';
import { LucideDynamicIcon, LucideMenu, LucideX } from '@lucide/angular';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-custom-demo',
  imports: [AerisButton, AerisNavbarModule, LucideDynamicIcon],
  templateUrl: './navbar-custom.demo.html',
  styleUrl: './navbar-custom.demo.scss'
})
export class NavbarCustomBrandAndActionsDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly menuIcon = LucideMenu;

  protected readonly closeIcon = LucideX;

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <aeris-navbar #navbar mode="mobile" ariaLabel="Custom toggle example navigation">
    <strong aerisNavbarBrand class="navbar-demo-brand"
      ><span class="navbar-demo-mark" aria-hidden="true">W</span>
      <span>Workspace</span></strong>
    <div aerisNavbarLinks>
      @for (label of ['Overview', 'Projects']; track label) {
        <button
          aerisNavbarItem
          [active]="selections()['custom'] === label"
          (click)="select('custom', label)"
        >
          {{ label }}
        </button>
      }
    </div>
    <div aerisNavbarActions>
      <button aerisButton variant="ghost" class="navbar-secondary-action">
        Sign in</button>
        <button aerisButton>Get started</button>
    </div>
    <button aerisNavbarToggle>
      @if (navbar.expanded()) {
        <svg aerisNavbarIcon [lucideIcon]="closeIcon"></svg>
      } @else {
        <svg aerisNavbarIcon [lucideIcon]="menuIcon"></svg>
      }
    </button>
  </aeris-navbar>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}

@media (max-width: 40rem) {
  .navbar-secondary-action {
      display: none;
    }
}
```

### Variants

Standard, floating and transparent surfaces share the same navigation geometry and interaction behavior.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-variants-demo',
  imports: [AerisNavbarModule],
  templateUrl: './navbar-variants.demo.html',
  styleUrl: './navbar-variants.demo.scss'
})
export class NavbarVariantsVariantsDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly variants = ['standard', 'floating', 'transparent'] as const;

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div class="navbar-stack">
  @for (variant of variants; track variant) {
    <aeris-navbar
      [breakpoint]="480"
      [variant]="variant"
      [ariaLabel]="variant + ' example navigation'"
      ><strong aerisNavbarBrand>{{ variant }}</strong>
      <div aerisNavbarLinks>
        @for (label of ['Overview', 'Projects']; track label) {
          <button
            aerisNavbarItem
            [active]="selections()[variant] === label"
            (click)="select(variant, label)"
          >
            {{ label }}
          </button>
        }
      </div></aeris-navbar>
  }
</div>
```

#### CSS

```css
.navbar-stack {
  display: grid;
  gap: 1rem;
}
```

### Sticky positioning

Scroll this region. Sticky positioning stays within its scrolling ancestor, not fixed over the documentation header.

#### TS

```ts
import { Component, ElementRef, signal } from '@angular/core';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-navbar-sticky-demo',
  imports: [AerisNavbarModule],
  templateUrl: './navbar-sticky.demo.html',
  styleUrl: './navbar-sticky.demo.scss'
})
export class NavbarStickyStickyPositioningDemo {
  protected readonly active = signal('Overview');

  protected readonly selections = signal<Record<string, string>>({
      responsive: 'Overview',
      fit: 'Overview',
      controlled: 'Overview',
      disclosures: 'Overview',
      custom: 'Overview',
      standard: 'Overview',
      floating: 'Overview',
      transparent: 'Overview',
      sticky: 'Overview',
    });

  protected select(example: string, label: string): void {
      this.selections.update((current) => ({ ...current, [example]: label }));
    }

  protected readonly state: readonly ApiRow[] = [
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description:
          'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
      },
      {
        name: 'mobile',
        type: 'Signal<boolean>',
        defaultValue: 'derived',
        description: 'Read-only effective mobile mode.',
      },
      {
        name: 'navigationId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
      },
      {
        name: 'toggle()',
        type: '() => void',
        defaultValue: '—',
        description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
      },
      {
        name: 'close()',
        type: '() => void',
        defaultValue: '—',
        description: 'Clears expanded without hiding desktop navigation.',
      },
    ];

  protected readonly disclosures: readonly ApiRow[] = [
      {
        name: 'active',
        type: 'Signal<boolean> (read-only)',
        defaultValue: 'derived',
        description:
          'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
      },
      {
        name: 'appendTo',
        type: 'AerisAppendTo',
        defaultValue: 'undefined',
        description:
          "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
      },
      {
        name: 'close(restoreFocus?)',
        type: '(restoreFocus?: boolean) => void',
        defaultValue: 'false',
        description: 'Closes the dropdown and optionally restores trigger focus.',
      },
      {
        name: 'aeris-navbar-dropdown',
        type: 'dropdown component',
        defaultValue: '—',
        description:
          'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: 'required',
        description: 'Visible dropdown button and accessible name.',
      },
      {
        name: 'expanded',
        type: 'boolean (model)',
        defaultValue: 'false',
        description:
          'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
      },
      {
        name: 'expandedChange',
        type: 'boolean (output)',
        defaultValue: '—',
        description: 'Emits button, Escape, outside press and navigation changes.',
      },
    ];
}
```

#### HTML

```html
<div>
  <div class="navbar-scroll-region">
    <aeris-navbar sticky ariaLabel="Sticky example navigation"
      ><strong aerisNavbarBrand class="navbar-demo-brand"
        ><span class="navbar-demo-mark" aria-hidden="true">W</span>
        <span>Workspace</span></strong>
      <div aerisNavbarLinks>
        @for (label of ['Overview', 'Projects']; track label) {
          <button
            aerisNavbarItem
            [active]="selections()['sticky'] === label"
            (click)="select('sticky', label)"
          >
            {{ label }}
          </button>
        }
      </div></aeris-navbar>
    <div class="navbar-scroll-content">
      @for (section of [1, 2, 3, 4, 5, 6, 7, 8]; track section) {
        <p>
          Section {{ section }}. Scroll to see the navigation stay within this region.
        </p>
      }
    </div>
  </div>
</div>
```

#### CSS

```css
.navbar-demo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.navbar-demo-mark {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.625rem;
  block-size: 1.625rem;
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-text);
  color: var(--aeris-surface);
  font-size: 0.8125rem;
  letter-spacing: -0.08em;
}

@container (max-width: 22rem) {
  .navbar-demo-brand > span:last-child {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
}

.navbar-scroll-region {
  block-size: 16rem;
  overflow: auto;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-surface);
}

.navbar-scroll-content {
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
}

.navbar-scroll-content p {
  margin: 0;
}
```

## Accessibility

- Navbar uses a named native navigation landmark. Links and buttons keep their native semantics and Tab order; no menu roles or arrow-key menu model are added. Give every action an accessible name and provide distinct labels for multiple navigation regions.
- Mobile navigation expands inline. It does not trap focus, blur the page, or block scrolling. Collapsed links leave the keyboard sequence. The toggle exposes expanded state and its controls relationship. Escape and controlled closing return focus to the toggle when focus would otherwise be hidden. Actions remain visible.
- Dropdown buttons expose names and expanded state. Desktop panels can be portaled without losing keyboard access: Tab enters an open panel and returns to the next header control after its last item. Escape closes only the current dropdown before closing mobile navigation on a second press. Disabled items cannot activate or receive Tab focus. Decorative icons are hidden from assistive technology; default artwork supports provideAerisIcons, including menu, close and chevron.
- Reduced motion disables the entrance and chevron transitions. Sticky content stays inside its scrolling ancestor; use a top token if your application already has a fixed header.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift+Tab` | Moves between visible native controls. Focus is not trapped. |
| `Enter` | Activates links, buttons and dropdown buttons. |
| `Space` | Activates buttons and dropdown buttons. |
| `Escape` | Closes the active disclosure and focuses its trigger, or closes expanded mobile navigation and focuses the toggle. |
| `Arrow keys` | Arrow Down opens a dropdown and focuses its first item. Arrow Right opens a nested submenu; Arrow Left closes it and returns focus to its trigger. These horizontal keys are reversed in RTL. |
