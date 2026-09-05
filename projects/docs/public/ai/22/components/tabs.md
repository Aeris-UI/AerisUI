# Tabs

> Accessible automatic and manual tab navigation with responsive layouts and custom headers.

Aeris 22.0.0-alpha.6 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Panel Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string, required` | `required` | Stable selection identifier. |
| `label` | `string, required` | `required` | Default visible tab label. |
| `disabled` | `boolean` | `false` | Disables and removes the tab from keyboard navigation. |

### Content Template Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTabContent` | `preserve &#124; active` | `'preserve'` | Controls deferred template lifetime. preserve creates content on first activation and keeps it mounted; active creates it on activation and destroys it on deactivation. |

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
| aerisTabContent | none | Marks the exact content Angular should defer. Without a value, it creates the content on first activation and preserves it. Set it to active to destroy the content on deactivation. |

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
type AerisTabContentStrategy = 'preserve' | 'active';

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

Plain panel content is eager: Angular creates every panel's content during the initial render and keeps it mounted while tabs change.

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

### Deferred and preserved content

A bare aerisTabContent template creates Statistics only the first time it opens. The charts then remain mounted, so their state survives later tab changes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-lazy-demo',
  imports: [AerisChartModule, AerisTabsModule],
  templateUrl: './tabs-lazy.demo.html',
  styleUrl: './tabs-lazy.demo.scss'
})
export class TabsLazyDeferredAndPreservedContentDemo {
  protected readonly trafficData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sessions',
        data: [1240, 1580, 1470, 1920, 2180, 1760, 2340],
        tension: 0.35,
        fill: true,
      },
    ],
  };

  protected readonly conversionData: AerisChartData = {
    labels: ['Direct', 'Search', 'Social', 'Referral'],
    datasets: [
      { label: 'Conversions', data: [420, 680, 310, 250], borderRadius: 7 },
    ],
  };

  protected readonly statisticsOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };
}
```

#### HTML

```html
<div>
  <aeris-tabs ariaLabel="Workspace analytics">
    <aeris-tab-panel value="summary" label="Summary">
      <div class="statistics-summary">
        <div>
          <strong>Analytics overview</strong>
          <p>Open Statistics to initialize the detailed charts.</p>
        </div>
      </div>
    </aeris-tab-panel>
    <aeris-tab-panel value="statistics" label="Statistics">
      <ng-template aerisTabContent>
        <div class="statistics-grid">
          <section class="statistics-card">
            <h4>Weekly traffic</h4>
            <aeris-chart
              type="line"
              [data]="trafficData"
              [options]="statisticsOptions"
              height="17rem"
              ariaLabel="Weekly sessions"
              ariaDescription="Sessions rise overall from Monday to Sunday."
            />
          </section>
          <section class="statistics-card">
            <h4>Conversions by source</h4>
            <aeris-chart
              type="bar"
              [data]="conversionData"
              [options]="statisticsOptions"
              height="17rem"
              ariaLabel="Conversions by traffic source"
              ariaDescription="Search produces the most conversions."
            />
          </section>
        </div>
      </ng-template>
    </aeris-tab-panel>
  </aeris-tabs>
</div>
```

#### CSS

```css
.statistics-summary {
  min-height: 15rem;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  text-align: center;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.statistics-card {
  min-width: 0;
  padding: 1rem;
  border-radius: var(--aeris-radius-container);
  background: var(--aeris-surface-2);
}

.statistics-card h4 {
  margin: 0 0 0.75rem;
}

@media (max-width: 44rem) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }
}
```

### Active-only content

Set aerisTabContent to active when content should exist only while its tab is selected. Angular destroys it on exit, runs normal cleanup hooks, and creates a fresh instance when the tab opens again.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'app-tabs-active-content-demo',
  imports: [AerisInputText, AerisTabsModule],
  templateUrl: './tabs-active-content.demo.html',
  styleUrl: './tabs-active-content.demo.scss'
})
export class TabsActiveContentActiveOnlyContentDemo {
}
```

#### HTML

```html
<div>
  <aeris-tabs ariaLabel="Active-only content example">
    <aeris-tab-panel value="instructions" label="Instructions">
      <div class="tabs-demo-panel">
        Open Temporary editor, enter text, leave the tab, and return. The field resets
        because its content was destroyed.
      </div>
    </aeris-tab-panel>
    <aeris-tab-panel value="editor" label="Temporary editor">
      <ng-template aerisTabContent="active">
        <div class="active-only-panel">
          <label for="temporary-draft">Temporary draft</label>
          <input
            id="temporary-draft"
            aerisInputText
            placeholder="This value resets when you leave"
          />
          <small>
            Leaving this tab destroys the input and any local component state inside
            this template.
          </small>
        </div>
      </ng-template>
    </aeris-tab-panel>
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

.active-only-panel {
  min-height: 9rem;
  display: grid;
  align-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
}

.active-only-panel label {
  font-weight: 600;
}

.active-only-panel small {
  color: var(--aeris-text-2);
  line-height: 1.5;
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
- Deferred panels keep their stable tabpanel element and ARIA relationship before their content is initialized. Use <ng-template aerisTabContent> to preserve content after first activation, or aerisTabContent="active" to destroy it on exit. Rendering strategy does not change keyboard behavior.
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
