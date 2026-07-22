# Accordion

> Stack related sections with controlled expansion, multiple mode, header templates, and accessible disclosure semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/accordion`
- Human-readable documentation: [https://aeris-ui.dev/components/accordion](https://aeris-ui.dev/components/accordion)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
```

## API

### Accordion Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | Allows more than one panel to be open at a time. |
| `collapsible` | `boolean` | `true` | Allows the last open panel to be collapsed. |
| `disabled` | `boolean` | `false` | Disables all panel headers. |
| `variant` | `outlined &#124; filled &#124; separated` | `'outlined'` | Controls the surface treatment. |
| `size` | `sm &#124; md &#124; lg` | `'md'` | Controls header height, spacing, and text size. |
| `iconPosition` | `start &#124; end` | `'end'` | Places the built-in disclosure icon before or after the label. |
| `headingLevel` | `1 &#124; 2 &#124; 3 &#124; 4 &#124; 5 &#124; 6` | `3` | ARIA heading level used for each accordion header. |
| `panelTabIndex` | `0 &#124; -1` | `0` | Controls whether expanded panels are directly focusable. |
| `ariaLabel` | `string` | `''` | Accessible name for the accordion container when needed. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the accordion container. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `AerisAccordionValue` | `''` | Open panel value in single mode or open panel values in multiple mode. |

### Panel Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string, required` | `-` | Stable identifier for the panel. |
| `header` | `string, required` | `-` | Default visible header text. |
| `disabled` | `boolean` | `false` | Disables this panel header and prevents expansion changes. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `AerisAccordionValue` | `-` | Emitted by the value model. |
| `changed` | `AerisAccordionChangeEvent` | `-` | Emitted after a panel expands or collapses. |
| `panelExpanded` | `AerisAccordionChangeEvent` | `-` | Emitted after a panel expands. |
| `panelCollapsed` | `AerisAccordionChangeEvent` | `-` | Emitted after a panel collapses. |
| `headerFocused` | `string` | `-` | Emitted when a panel header receives focus. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisAccordionHeader` | `AerisAccordionHeaderContext` | `header input` | Custom header content rendered inside the native disclosure button. |
| `aerisAccordionToggleIcon` | `AerisAccordionToggleIconContext` | `built-in chevron` | Custom decorative toggle icon for one panel or every panel when placed directly in the accordion. |
| `default panel content` | `content projection` | `-` | Panel body rendered when the panel is expanded. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `toggle(value, event?)` | `(string, Event &#124; null) =&gt; void` | `-` | Toggles an enabled panel by value. |
| `expand(value, event?)` | `(string, Event &#124; null) =&gt; void` | `-` | Expands an enabled panel by value. |
| `collapse(value, event?)` | `(string, Event &#124; null) =&gt; void` | `-` | Collapses an enabled panel by value when collapsible rules allow it. |
| `focusPanel(value, options?)` | `(string, FocusOptions) =&gt; void` | `-` | Moves focus to an enabled panel header. |

## Interfaces and types

### Interfaces

```ts
type AerisAccordionValue = string | readonly string[];
type AerisAccordionVariant = 'outlined' | 'filled' | 'separated';
type AerisAccordionSize = 'sm' | 'md' | 'lg';
type AerisAccordionIconPosition = 'start' | 'end';

interface AerisAccordionChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisAccordionValue;
  readonly previousValue: AerisAccordionValue;
  readonly changedValue: string;
  readonly expanded: boolean;
}

interface AerisAccordionHeaderContext {
  readonly $implicit: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly value: string;
}

interface AerisAccordionToggleIconContext {
  readonly $implicit: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-accordion-background` | `CSS custom property` | — | Panel item background. |
| `--aeris-accordion-filled-background` | `CSS custom property` | — | Filled variant surface. |
| `--aeris-accordion-border` | `CSS custom property` | — | Container and panel borders. |
| `--aeris-accordion-radius` | `CSS custom property` | — | Container and separated item radius. |
| `--aeris-accordion-trigger-color` | `CSS custom property` | — | Header button text. |
| `--aeris-accordion-hover-background` | `CSS custom property` | — | Header hover background. |
| `--aeris-accordion-hover-color` | `CSS custom property` | — | Header hover text. |
| `--aeris-accordion-icon-color` | `CSS custom property` | — | Collapsed disclosure icon. |
| `--aeris-accordion-active-icon-color` | `CSS custom property` | — | Expanded disclosure icon. |
| `--aeris-accordion-panel-color` | `CSS custom property` | — | Expanded panel body text. |
| `--aeris-accordion-focus` | `CSS custom property` | — | Header and panel focus ring. |
| `--aeris-accordion-separated-gap` | `CSS custom property` | — | Separated variant item gap. |

## Examples

### Basic

Use one panel per related section. The value model controls which section is open.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-basic-demo',
  imports: [AerisAccordionModule],
  template: `
    <div>
      <aeris-accordion ariaLabel="Project sections" value="overview">
        <aeris-accordion-panel value="overview" header="Overview">
          <p>Project status, ownership, and current milestone.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="activity" header="Activity">
          <p>Recent changes and review notes.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="members" header="Members">
          <p>People with access to this workspace.</p>
        </aeris-accordion-panel>
      </aeris-accordion>
    </div>
  `
})
export class AccordionBasicBasicDemo {
}
```

### Controlled state and events

Bind value when application state needs to drive expansion or react to user changes.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAccordionModule, type AerisAccordionChangeEvent, type AerisAccordionValue } from '@aeris-ui/core/accordion';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-accordion-controlled-demo',
  imports: [AerisAccordionModule, AerisButton],
  templateUrl: './accordion-controlled.demo.html',
  styleUrl: './accordion-controlled.demo.scss'
})
export class AccordionControlledControlledStateAndEventsDemo {
  protected readonly activeSections = signal<AerisAccordionValue>(['profile']);
  protected readonly controlledValues = ['profile', 'security', 'billing'] as const;
  protected readonly lastChange = signal('Profile is open.');

  protected expandAllSections(): void {
    this.activeSections.set([...this.controlledValues]);
    this.lastChange.set('All sections expanded.');
  }

  protected closeAllSections(): void {
    this.activeSections.set([]);
    this.lastChange.set('All sections closed.');
  }

  protected toggleControlledSection(value: string): void {
    const current = this.normalizeValue(this.activeSections());
    this.activeSections.set(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  protected recordChange(event: AerisAccordionChangeEvent): void {
    this.lastChange.set(
      event.expanded
        ? `${event.changedValue} expanded.`
        : `${event.changedValue} collapsed.`,
    );
  }

  private normalizeValue(value: AerisAccordionValue): readonly string[] {
    return typeof value === 'string' ? value ? [value] : [] : value;
  }
}
```

#### HTML

```html
<div>
  <div class="accordion-controls" aria-label="Accordion controls">
    <button aerisButton type="button" (click)="expandAllSections()">
      Expand all
    </button>
    <button aerisButton type="button" (click)="closeAllSections()">Close all</button>
    <button aerisButton type="button" (click)="toggleControlledSection('profile')">
      Profile
    </button>
    <button aerisButton type="button" (click)="toggleControlledSection('security')">
      Security
    </button>
    <button aerisButton type="button" (click)="toggleControlledSection('billing')">
      Billing
    </button>
  </div>
  <aeris-accordion
    ariaLabel="Account sections"
    multiple
    [(value)]="activeSections"
    (changed)="recordChange($event)"
  >
    <aeris-accordion-panel value="profile" header="Profile">
      <p>Public profile, display name, and contact preferences.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="security" header="Security">
      <p>Password, multi-factor authentication, and sessions.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="billing" header="Billing">
      <p>Plan, invoices, and payment details.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
  <p class="status-line" aria-live="polite">{{ lastChange() }}</p>
</div>
```

#### CSS

```css
.accordion-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-line {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Multiple panels

Enable multiple mode when sections should remain independently open.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAccordionModule, type AerisAccordionValue } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-multiple-demo',
  imports: [AerisAccordionModule],
  template: `
    <div>
      <aeris-accordion ariaLabel="Settings sections" multiple [(value)]="multiSections">
        <aeris-accordion-panel value="profile" header="Profile">
          <p>Display name, avatar, and profile visibility.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="security" header="Security">
          <p>Active sessions and authentication methods.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="billing" header="Billing">
          <p>Plan, invoices, and payment details.</p>
        </aeris-accordion-panel>
      </aeris-accordion>
    </div>
  `
})
export class AccordionMultipleMultiplePanelsDemo {
  protected readonly multiSections = signal<AerisAccordionValue>([
    'security',
    'billing',
  ]);
}
```

### Disabled panel

Disabled panels use native disabled button semantics and are skipped by arrow-key header navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-disabled-demo',
  imports: [AerisAccordionModule],
  template: `
    <div>
      <aeris-accordion ariaLabel="Release checklist" value="draft">
        <aeris-accordion-panel value="draft" header="Draft">
          <p>Initial release notes are ready.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="approval" header="Approval" disabled>
          <p>Approval opens after review is complete.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="publish" header="Publish">
          <p>Final publication tasks.</p>
        </aeris-accordion-panel>
      </aeris-accordion>
    </div>
  `
})
export class AccordionDisabledDisabledPanelDemo {
}
```

### Non-collapsible

Set collapsible to false when one open panel must remain visible after a user opens it.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-non-collapsible-demo',
  imports: [AerisAccordionModule],
  template: `
    <div>
      <aeris-accordion ariaLabel="Required details" value="summary" [collapsible]="false">
        <aeris-accordion-panel value="summary" header="Summary">
          <p>This section cannot be closed while it is the only open panel.</p>
        </aeris-accordion-panel>
        <aeris-accordion-panel value="details" header="Details">
          <p>Opening this panel moves the single active section.</p>
        </aeris-accordion-panel>
      </aeris-accordion>
    </div>
  `
})
export class AccordionNonCollapsibleNonCollapsibleDemo {
}
```

### Header templates

Customize header content while Accordion keeps the native button and ARIA state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-headers-demo',
  imports: [AerisAccordionModule],
  templateUrl: './accordion-headers.demo.html',
  styleUrl: './accordion-headers.demo.scss'
})
export class AccordionHeadersHeaderTemplatesDemo {
}
```

#### HTML

```html
<div>
  <aeris-accordion ariaLabel="Billing details" value="payment">
    <aeris-accordion-panel value="payment" header="Payment">
      <ng-template aerisAccordionHeader>
        <span class="accordion-meta-header">
          <span>Payment</span>
          <small>2 cards</small>
        </span>
      </ng-template>
      <p>Default card and invoice email.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="invoices" header="Invoices">
      <p>Invoice history and tax details.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
</div>
```

#### CSS

```css
.accordion-meta-header {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.accordion-meta-header small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}
```

### Custom toggle icon

Provide a decorative toggle icon template for every panel or override it for one panel.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-icons-demo',
  imports: [AerisAccordionModule],
  templateUrl: './accordion-icons.demo.html',
  styleUrl: './accordion-icons.demo.scss'
})
export class AccordionIconsCustomToggleIconDemo {
}
```

#### HTML

```html
<div>
  <aeris-accordion ariaLabel="Custom icon sections" value="details">
    <ng-template aerisAccordionToggleIcon let-expanded>
      <span class="custom-toggle-icon">{{ expanded ? '−' : '+' }}</span>
    </ng-template>
    <aeris-accordion-panel value="details" header="Details">
      <p>The same icon template is used by each panel in this accordion.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="history" header="History">
      <p>Consumers can render any decorative icon markup.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="access" header="Access">
      <p>The button keeps its accessible expanded state.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
</div>
```

#### CSS

```css
.custom-toggle-icon {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-grid;
  place-items: center;
  color: var(--primary-text);
  font-size: var(--aeris-icon-size, 1rem);
  font-weight: 800;
  line-height: 1;
}
```

### Dynamic panels

Generate panels from application data while preserving stable values and labels.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-dynamic-demo',
  imports: [AerisAccordionModule],
  template: `
    <div>
      <aeris-accordion ariaLabel="Release phases" value="planning">
        @for (panel of dynamicPanels; track panel.value) {
          <aeris-accordion-panel [value]="panel.value" [header]="panel.header">
            <p>{{ panel.body }}</p>
          </aeris-accordion-panel>
        }
      </aeris-accordion>
    </div>
  `
})
export class AccordionDynamicDynamicPanelsDemo {
  protected readonly dynamicPanels = [
    { value: 'planning', header: 'Planning', body: 'Roadmap, estimates, and ownership.' },
    { value: 'build', header: 'Build', body: 'Implementation notes and review status.' },
    { value: 'release', header: 'Release', body: 'Checklist, rollout plan, and changelog.' },
  ] as const;
}
```

### Variants

Use outlined for structured surfaces, filled for subtle grouping, and separated for independent cards.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-variants-demo',
  imports: [AerisAccordionModule],
  templateUrl: './accordion-variants.demo.html',
  styleUrl: './accordion-variants.demo.scss'
})
export class AccordionVariantsVariantsDemo {
}
```

#### HTML

```html
<div class="accordion-stack">
  <aeris-accordion ariaLabel="Outlined accordion" value="one">
    <aeris-accordion-panel value="one" header="Outlined">
      <p>Default bordered surface.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="two" header="Second panel">
      <p>Connected by shared borders.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
  <aeris-accordion ariaLabel="Filled accordion" variant="filled" value="one">
    <aeris-accordion-panel value="one" header="Filled">
      <p>Soft background treatment.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="two" header="Second panel">
      <p>Grouped on a quiet surface.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
  <aeris-accordion ariaLabel="Separated accordion" variant="separated" value="one">
    <aeris-accordion-panel value="one" header="Separated">
      <p>Each section has its own border radius.</p>
    </aeris-accordion-panel>
    <aeris-accordion-panel value="two" header="Second panel">
      <p>Useful for card-like sections.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
</div>
```

#### CSS

```css
.accordion-stack {
  width: 100%;
  display: grid;
  gap: 1rem;
}
```

### Sizes and icon position

Size controls header density. The disclosure icon can sit before or after header content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';

@Component({
  selector: 'app-accordion-sizes-demo',
  imports: [AerisAccordionModule],
  templateUrl: './accordion-sizes.demo.html',
  styleUrl: './accordion-sizes.demo.scss'
})
export class AccordionSizesSizesAndIconPositionDemo {
}
```

#### HTML

```html
<div class="accordion-stack">
  <aeris-accordion
    ariaLabel="Small accordion"
    size="sm"
    iconPosition="start"
    value="small"
  >
    <aeris-accordion-panel value="small" header="Small start icon">
      <p>Compact spacing for dense layouts.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
  <aeris-accordion ariaLabel="Large accordion" size="lg" value="large">
    <aeris-accordion-panel value="large" header="Large end icon">
      <p>Roomier spacing for prominent content.</p>
    </aeris-accordion-panel>
  </aeris-accordion>
</div>
```

#### CSS

```css
.accordion-stack {
  width: 100%;
  display: grid;
  gap: 1rem;
}
```

## Accessibility

- Each header is a native button with aria-expanded and aria-controls.
- Expanded content uses a region labelled by the matching header button.
- Header wrappers expose the configured ARIA heading level for screen-reader navigation.
- Disabled panels use native disabled buttons and are skipped by optional arrow-key navigation.
- Header templates render inside the button; do not place links, buttons, inputs, or other interactive controls inside custom headers.
- The disclosure icon is decorative and hidden from assistive technology.
- Motion is limited to icon rotation and is disabled when reduced motion is requested.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Toggles the focused panel header through native button behavior. |
| `Arrow Down` | Moves focus to the next enabled panel header and wraps at the end. |
| `Arrow Up` | Moves focus to the previous enabled panel header and wraps at the beginning. |
| `Home` | Moves focus to the first enabled panel header. |
| `End` | Moves focus to the last enabled panel header. |
| `Tab` | Moves through every enabled header and any focusable content in expanded panels using normal page order. |
