# Tabs

> Accessible automatic and manual tab navigation with responsive layouts and custom headers.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tabs`
- Human-readable documentation: [https://aeris-ui.dev/components/tabs](https://aeris-ui.dev/components/tabs)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTabsModule } from '@aeris-ui/core/tabs';
```

## API

### Tabs Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Selected panel value with two-way binding. |
| `ariaLabel` | `string` | `''` | Accessible name for the tab list. |
| `ariaLabelledBy` | `string` | `''` | ID reference to visible text that labels the tab list. |
| `orientation` | `horizontal &#124; vertical` | `'horizontal'` | Visual layout and matching arrow-key direction. |
| `activationMode` | `automatic &#124; manual` | `'automatic'` | Selects on focus, or waits for Enter or Space. |
| `variant` | `line &#124; pill` | `'line'` | Underline or contained visual treatment. |
| `size` | `sm &#124; md &#124; lg` | `'md'` | Tab height, padding, and typography. |
| `justify` | `start &#124; center &#124; end &#124; stretch` | `'start'` | Horizontal tab alignment. |
| `scrollable` | `boolean` | `true` | Keeps horizontal tabs contained and shows scroll controls only when the tab list overflows. |
| `panelTabIndex` | `0 &#124; -1` | `0` | Controls whether the active tabpanel is directly focusable. |

### TabPanel inputs

| Name | Type | Description |
| --- | --- | --- |
| value | string, required | Stable selection identifier. |
| label | string, required | Default visible tab label. |
| disabled | boolean | Disables and removes the tab from keyboard navigation. |

### Tabs outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | string | Emitted by the value model. |
| changed | AerisTabChangeEvent | Selected, previous, and original event data. |
| tabFocused | string | Value of the tab that received focus. |

### Tabs templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisTabHeader | selected, disabled | Custom content inside the native tab button. |

### Tabs methods

| Name | Signature | Description |
| --- | --- | --- |
| select | (value: string, event?: Event) =&gt; void | Selects an enabled panel by value. |
| focusTab | (value: string, options?: FocusOptions) =&gt; void | Moves focus to an enabled tab by value. |

## Interfaces and types

### Interfaces

```ts
type AerisTabsOrientation = 'horizontal' | 'vertical';
type AerisTabsActivationMode = 'automatic' | 'manual';
type AerisTabsVariant = 'line' | 'pill';
type AerisTabsSize = 'sm' | 'md' | 'lg';
type AerisTabsJustify = 'start' | 'center' | 'end' | 'stretch';

interface AerisTabChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-tabs-border` | `CSS custom property` | — | Line and scroll-control borders. |
| `--aeris-tabs-text` | `CSS custom property` | — | Inactive tab text. |
| `--aeris-tabs-active-text` | `CSS custom property` | — | Selected line-tab text. |
| `--aeris-tabs-indicator` | `CSS custom property` | — | Selected line indicator. |
| `--aeris-tabs-hover` | `CSS custom property` | — | Hover surface. |
| `--aeris-tabs-list-background` | `CSS custom property` | — | Pill-list surface. |
| `--aeris-tabs-active-background` | `CSS custom property` | — | Selected pill surface. |
| `--aeris-tabs-radius` | `CSS custom property` | — | Tab and list corner radius. |
| `--aeris-tabs-panel-padding` | `CSS custom property` | — | Space between the tab strip and active panel. |

## Examples

### Basic

Each panel has a stable value and label. The first enabled panel is displayed when no value is provided.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-basic-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-basic.demo.html',
  styleUrl: './tabs-basic.demo.scss'
})
export class TabsBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <aeris-tabs ariaLabel="Project details">
    <aeris-tab-panel value="summary" label="Summary"
      ><div class="tabs-demo-panel">
        Project summary and current status.
      </div></aeris-tab-panel
    >
    <aeris-tab-panel value="activity" label="Activity"
      ><div class="tabs-demo-panel">Recent project activity.</div></aeris-tab-panel
    >
    <aeris-tab-panel value="members" label="Members"
      ><div class="tabs-demo-panel">
        Project members and permissions.
      </div></aeris-tab-panel
    >
  </aeris-tabs>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}
```

### Controlled state and events

Bind the active value and consume typed change metadata when application state needs to react.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-controlled-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-controlled.demo.html',
  styleUrl: './tabs-controlled.demo.scss'
})
export class TabsControlledControlledStateAndEventsDemo {
  protected readonly accountTab =
    signal('profile');

  protected readonly lastChange = signal('No tab change yet');

  protected recordChange(event: AerisTabChangeEvent): void {
    this.lastChange.set(
      `Changed from ${event.previousValue} to ${event.value}`,
    );
  }
}
```

#### HTML

```html
<div>
  <aeris-tabs
    ariaLabel="Account settings"
    [(value)]="accountTab"
    (changed)="recordChange($event)"
  >
    <aeris-tab-panel value="profile" label="Profile"
      ><div class="tabs-demo-panel">Profile settings.</div></aeris-tab-panel
    >
    <aeris-tab-panel value="security" label="Security"
      ><div class="tabs-demo-panel">Security settings.</div></aeris-tab-panel
    >
  </aeris-tabs>
  <small aria-live="polite">{{ lastChange() }}</small>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}
```

### Disabled tabs

Disabled tabs use native button semantics and are skipped by arrow, Home, and End navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-disabled-demo',
  imports: [AerisTabsModule],
  template: `
    <div>
      <aeris-tabs ariaLabel="Release stages">
        <aeris-tab-panel value="draft" label="Draft"
          ><div class="tabs-demo-panel">Draft release.</div></aeris-tab-panel
        >
        <aeris-tab-panel value="review" label="Review" disabled
          ><div class="tabs-demo-panel">Review unavailable.</div></aeris-tab-panel
        >
        <aeris-tab-panel value="published" label="Published"
          ><div class="tabs-demo-panel">Published release.</div></aeris-tab-panel
        >
      </aeris-tabs>
    </div>
  `,
  styles: `
    .tabs-demo-panel {
      min-height: 6rem;
      padding: 1.25rem;
      color: var(--aeris-text-2);
      line-height: 1.6;
    }
  `
})
export class TabsDisabledDisabledTabsDemo {
}
```

### Manual activation

Arrow keys move focus without changing content. Enter or Space activates the focused tab.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-manual-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-manual.demo.html',
  styleUrl: './tabs-manual.demo.scss'
})
export class TabsManualManualActivationDemo {
}
```

#### HTML

```html
<div>
  <aeris-tabs
    ariaLabel="Manual activation example"
    activationMode="manual"
    [(value)]="manualTab"
  >
    <aeris-tab-panel value="overview" label="Overview"
      ><div class="tabs-demo-panel">
        Overview remains selected until activation.
      </div></aeris-tab-panel
    >
    <aeris-tab-panel value="metrics" label="Metrics"
      ><div class="tabs-demo-panel">Metrics content.</div></aeris-tab-panel
    >
  </aeris-tabs>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}
```

### Vertical tabs

Vertical orientation uses Up and Down navigation and returns to horizontal layout on narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-vertical-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-vertical.demo.html',
  styleUrl: './tabs-vertical.demo.scss'
})
export class TabsVerticalVerticalTabsDemo {
}
```

#### HTML

```html
<div>
  <aeris-tabs
    class="vertical-demo"
    ariaLabel="Workspace settings"
    orientation="vertical"
  >
    <aeris-tab-panel value="general" label="General"
      ><div class="tabs-demo-panel">General workspace settings.</div></aeris-tab-panel
    >
    <aeris-tab-panel value="people" label="People"
      ><div class="tabs-demo-panel">People and access settings.</div></aeris-tab-panel
    >
    <aeris-tab-panel value="billing" label="Billing"
      ><div class="tabs-demo-panel">Billing settings.</div></aeris-tab-panel
    >
  </aeris-tabs>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

.vertical-demo {
  min-height: 12rem;
}
```

### Line and pill variants

Use line tabs for page sections and pill tabs for compact local switching.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-variants-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-variants.demo.html',
  styleUrl: './tabs-variants.demo.scss'
})
export class TabsVariantsLineAndPillVariantsDemo {
}
```

#### HTML

```html
<div class="variant-stack">
  <aeris-tabs ariaLabel="Line tabs" variant="line"
    ><aeris-tab-panel value="one" label="Overview"
      ><div class="tabs-demo-panel">Line variant.</div></aeris-tab-panel
    ><aeris-tab-panel value="two" label="Details"
      ><div class="tabs-demo-panel">Details.</div></aeris-tab-panel
    ></aeris-tabs
  >
  <aeris-tabs ariaLabel="Pill tabs" variant="pill"
    ><aeris-tab-panel value="one" label="Monthly"
      ><div class="tabs-demo-panel">Monthly data.</div></aeris-tab-panel
    ><aeris-tab-panel value="two" label="Yearly"
      ><div class="tabs-demo-panel">Yearly data.</div></aeris-tab-panel
    ></aeris-tabs
  >
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

.variant-stack {
  width: 100%;
  display: grid;
  gap: 2rem;
}
```

### Header templates

Custom headers receive selected and disabled state while Tabs retains the button and ARIA relationship.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-headers-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-headers.demo.html',
  styleUrl: './tabs-headers.demo.scss'
})
export class TabsHeadersHeaderTemplatesDemo {
}
```

#### HTML

```html
<div>
  <aeris-tabs ariaLabel="Inbox sections">
    <aeris-tab-panel value="inbox" label="Inbox">
      <ng-template aerisTabHeader
        ><span class="tab-header"
          >Inbox <span class="tab-count">12</span></span
        ></ng-template
      >
      <div class="tabs-demo-panel">Unread messages.</div>
    </aeris-tab-panel>
    <aeris-tab-panel value="archive" label="Archive"
      ><div class="tabs-demo-panel">Archived messages.</div></aeris-tab-panel
    >
  </aeris-tabs>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

.tab-header {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.tab-count {
  min-width: 1.25rem;
  min-height: 1.25rem;
  display: inline-grid;
  place-items: center;
  padding-inline: 0.3rem;
  border-radius: 99px;
  background: var(--primary-soft);
  color: var(--aeris-primary-text);
  font-size: 0.6875rem;
}
```

### Sizes and alignment

Three sizes and four alignment modes cover compact tools through full-width page navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-sizes-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-sizes.demo.html',
  styleUrl: './tabs-sizes.demo.scss'
})
export class TabsSizesSizesAndAlignmentDemo {
}
```

#### HTML

```html
<div class="variant-stack">
  <aeris-tabs ariaLabel="Small centered tabs" size="sm" justify="center"
    ><aeris-tab-panel value="one" label="Small"
      ><div class="tabs-demo-panel">Small centered tabs.</div></aeris-tab-panel
    ><aeris-tab-panel value="two" label="Tabs"
      ><div class="tabs-demo-panel">Second panel.</div></aeris-tab-panel
    ></aeris-tabs
  >
  <aeris-tabs ariaLabel="Stretched tabs" size="lg" justify="stretch"
    ><aeris-tab-panel value="one" label="Overview"
      ><div class="tabs-demo-panel">Large stretched tabs.</div></aeris-tab-panel
    ><aeris-tab-panel value="two" label="Analytics"
      ><div class="tabs-demo-panel">Analytics.</div></aeris-tab-panel
    ></aeris-tabs
  >
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

.variant-stack {
  width: 100%;
  display: grid;
  gap: 2rem;
}
```

### Scrollable tabs

Constrained horizontal lists use accessible previous and next controls while focused tabs scroll into view.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-scrollable-demo',
  imports: [AerisTabsModule],
  templateUrl: './tabs-scrollable.demo.html',
  styleUrl: './tabs-scrollable.demo.scss'
})
export class TabsScrollableScrollableTabsDemo {
}
```

#### HTML

```html
<div class="scroll-demo">
  <aeris-tabs ariaLabel="Report sections" scrollable>
    @for (
      label of [
        'Overview',
        'Performance',
        'Accessibility',
        'Security',
        'Releases',
        'Members',
        'Settings',
        'Integrations',
        'Billing',
        'Audit log',
        'Notifications',
        'Automation',
      ];
      track label
    ) {
      <aeris-tab-panel [value]="label" [label]="label"
        ><div class="tabs-demo-panel">{{ label }} content.</div></aeris-tab-panel
      >
    }
  </aeris-tabs>
</div>
```

#### CSS

```css
.tabs-demo-panel {
  min-height: 6rem;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

.scroll-demo {
  width: min(100%, 25rem);
}
```

## Accessibility

- Tabs uses the ARIA tablist, tab, and tabpanel relationship with stable IDs and aria-controls.
- Only one enabled tab participates in the page tab order. Disabled tabs use native disabled buttons.
- Automatic activation follows focus. Manual activation allows focus review before Enter or Space changes content.
- Horizontal and vertical orientations expose aria-orientation and use matching arrow keys.
- Custom headers remain inside native buttons, so they must not contain nested interactive elements.
- The active panel is focusable by default for keyboard and screen-reader navigation.
- Scrollable tabs retain keyboard operation and provide labeled native scroll buttons.

### Keyboard support

| Key | Function |
| --- | --- |
| `Arrow Left / Arrow Right` | Moves through enabled horizontal tabs and wraps at boundaries. |
| `Arrow Up / Arrow Down` | Moves through enabled vertical tabs and wraps at boundaries. |
| `Home` | Moves to the first enabled tab. |
| `End` | Moves to the last enabled tab. |
| `Enter / Space` | Activates the focused tab when manual activation is enabled. |
| `Tab` | Moves from the active tab into the active panel or next focusable control. |
