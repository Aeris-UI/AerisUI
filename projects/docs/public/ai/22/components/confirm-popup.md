# ConfirmPopup

> Target-relative confirmation popup with service prompts, trigger ARIA state, templates, and explicit outcomes.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/confirm-popup`
- Human-readable documentation: [https://aeris-ui.dev/components/confirm-popup](https://aeris-ui.dev/components/confirm-popup)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import {
  AerisConfirmPopupModule,
  AerisConfirmPopupService,
} from '@aeris-ui/core/confirm-popup';
```

## API

### Service Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `confirm(config)` | `AerisConfirmPopupConfig =&gt; AerisConfirmPopupRef` | `-` | Opens a target-relative confirmation popup. |
| `closeAll()` | `() =&gt; void` | `-` | Dismisses active popups opened through the service. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | `''` | Matches service requests to a template host. |
| `target` | `AerisConfirmPopupTarget` | `required` | Element or trigger event used for positioning and trigger ARIA state. |
| `header` | `string` | `'Confirm action'` | Visible popup title. |
| `message` | `string` | `''` | Default confirmation message. |
| `data` | `unknown` | `undefined` | Context data exposed to templates and events. |
| `icon` | `AerisConfirmPopupIcon` | `'question'` | Built-in icon or none. |
| `severity` | `AerisConfirmPopupSeverity` | `'primary'` | Visual intent for icon and accept action. |
| `acceptLabel` | `string` | `'Confirm'` | Accept button text. |
| `rejectLabel` | `string` | `'Cancel'` | Reject button text. |
| `acceptVisible` | `boolean` | `true` | Renders the accept action. |
| `rejectVisible` | `boolean` | `true` | Renders the reject action. |
| `acceptDisabled` | `boolean` | `false` | Disables the accept action. |
| `rejectDisabled` | `boolean` | `false` | Disables the reject action. |
| `acceptAriaLabel` | `string` | `''` | Accessible label for the accept action; falls back to acceptLabel. |
| `rejectAriaLabel` | `string` | `''` | Accessible label for the reject action; falls back to rejectLabel. |
| `defaultFocus` | `AerisConfirmPopupDefaultFocus` | `'accept'` | Built-in first focus target. |
| `placement` | `AerisConfirmPopupPlacement` | `'auto'` | Preferred placement around the target. |
| `alignment` | `AerisConfirmPopupAlignment` | `'center'` | Alignment along the target edge. |
| `width` | `string` | `''` | Custom popup width. |
| `maxWidth` | `string` | `''` | Custom maximum popup width. |
| `offset` | `number` | `10` | Distance between target and popup in pixels. |
| `viewportMargin` | `number` | `8` | Minimum viewport edge gap in pixels. |
| `dismissible` | `boolean` | `true` | Allows outside pointerdown to dismiss. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to dismiss. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the popup. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the trigger after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the popup after open. |
| `initialFocus` | `string` | `''` | Custom selector that overrides defaultFocus. |
| `showArrow` | `boolean` | `true` | Shows the pointer arrow. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the popup. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the popup. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the confirmation. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Controls declarative visibility. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visibleChange` | `boolean` | `-` | Emitted by the visible model. |
| `shown` | `AerisConfirmPopupActionEvent` | `-` | Emitted after the popup opens. |
| `accepted` | `AerisConfirmPopupActionEvent` | `-` | Emitted when the accept action runs. |
| `rejected` | `AerisConfirmPopupActionEvent` | `-` | Emitted when the reject action runs. |
| `closed` | `AerisConfirmPopupCloseEvent` | `-` | Emitted for accept, reject, and dismiss closes. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisConfirmPopupIcon` | `AerisConfirmPopupTemplateContext` | `built-in icon` | Custom decorative icon content. |
| `aerisConfirmPopupMessage` | `AerisConfirmPopupTemplateContext` | `message input` | Custom body message content. |
| `aerisConfirmPopupFooter` | `AerisConfirmPopupTemplateContext` | `default actions` | Custom footer actions with accept, reject, and close callbacks. |
| `aerisConfirmPopupHeadless` | `AerisConfirmPopupTemplateContext` | `-` | Replaces all built-in popup UI while preserving popup behavior. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `accept(event?)` | `(Event &#124; null) =&gt; void` | `-` | Runs accept callbacks and closes with accept result. |
| `reject(event?)` | `(Event &#124; null) =&gt; void` | `-` | Runs reject callbacks and closes with reject result. |
| `close(event?)` | `(Event &#124; null) =&gt; void` | `-` | Dismisses the popup without accepting or rejecting. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus to the configured initial focus target. |
| `reposition()` | `() =&gt; void` | `-` | Recalculates target-relative popup position. |
| `openWithConfig(config, ref)` | `(ResolvedConfig, AerisConfirmPopupRef) =&gt; void` | `-` | Opens a resolved configuration for a service-created host. |

### Config Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | `''` | Matches service requests to a template host. |
| `target` | `AerisConfirmPopupTarget` | `required` | Element or trigger event used for positioning and trigger ARIA state. |
| `header` | `string` | `'Confirm action'` | Visible popup title. |
| `message` | `string` | `''` | Default confirmation message. |
| `data` | `unknown` | `undefined` | Context data exposed to templates and events. |
| `icon` | `AerisConfirmPopupIcon` | `'question'` | Built-in icon or none. |
| `severity` | `AerisConfirmPopupSeverity` | `'primary'` | Visual intent for icon and accept action. |
| `acceptLabel` | `string` | `'Confirm'` | Accept button text. |
| `rejectLabel` | `string` | `'Cancel'` | Reject button text. |
| `acceptVisible` | `boolean` | `true` | Renders the accept action. |
| `rejectVisible` | `boolean` | `true` | Renders the reject action. |
| `acceptDisabled` | `boolean` | `false` | Disables the accept action. |
| `rejectDisabled` | `boolean` | `false` | Disables the reject action. |
| `acceptAriaLabel` | `string` | `''` | Accessible label for the accept action; falls back to acceptLabel. |
| `rejectAriaLabel` | `string` | `''` | Accessible label for the reject action; falls back to rejectLabel. |
| `defaultFocus` | `AerisConfirmPopupDefaultFocus` | `'accept'` | Built-in first focus target. |
| `placement` | `AerisConfirmPopupPlacement` | `'auto'` | Preferred placement around the target. |
| `alignment` | `AerisConfirmPopupAlignment` | `'center'` | Alignment along the target edge. |
| `width` | `string` | `''` | Custom popup width. |
| `maxWidth` | `string` | `''` | Custom maximum popup width. |
| `offset` | `number` | `10` | Distance between target and popup in pixels. |
| `viewportMargin` | `number` | `8` | Minimum viewport edge gap in pixels. |
| `dismissible` | `boolean` | `true` | Allows outside pointerdown to dismiss. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to dismiss. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the popup. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the trigger after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the popup after open. |
| `initialFocus` | `string` | `''` | Custom selector that overrides defaultFocus. |
| `showArrow` | `boolean` | `true` | Shows the pointer arrow. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the popup. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the popup. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the confirmation. |
| `accept` | `(AerisConfirmPopupActionEvent) =&gt; void` | `-` | Callback invoked before an accepted popup closes. |
| `reject` | `(AerisConfirmPopupActionEvent) =&gt; void` | `-` | Callback invoked before a rejected popup closes. |

### Ref Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `accept(event?)` | `(Event &#124; null) =&gt; void` | `-` | Accepts the popup programmatically. |
| `reject(event?)` | `(Event &#124; null) =&gt; void` | `-` | Rejects the popup programmatically. |
| `close(event?)` | `(Event &#124; null) =&gt; void` | `-` | Dismisses the popup programmatically. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus into the active popup. |
| `reposition()` | `() =&gt; void` | `-` | Recalculates the active popup position. |
| `accepted` | `Subscribable&lt;AerisConfirmPopupActionEvent&gt;` | `-` | Subscribe to accept actions. |
| `rejected` | `Subscribable&lt;AerisConfirmPopupActionEvent&gt;` | `-` | Subscribe to reject actions. |
| `closed` | `Subscribable&lt;AerisConfirmPopupCloseEvent&gt;` | `-` | Subscribe to the final close result. |
| `shown` | `Subscribable&lt;AerisConfirmPopupActionEvent&gt;` | `-` | Subscribe after the popup opens. |

## Interfaces and types

### Interfaces

```ts
type AerisConfirmPopupSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';

type AerisConfirmPopupIcon =
  | 'question'
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'none';

type AerisConfirmPopupPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
type AerisConfirmPopupAlignment = 'start' | 'center' | 'end';
type AerisConfirmPopupDefaultFocus = 'accept' | 'reject' | 'popup' | 'none';
type AerisConfirmPopupResult = 'accept' | 'reject' | 'dismiss';
type AerisConfirmPopupCloseReason = 'api' | 'accept' | 'reject' | 'escape' | 'outside';
type AerisConfirmPopupTarget = Element | EventTarget | Event | null | undefined;

interface AerisConfirmPopupConfig<TData = unknown> {
  readonly key?: string;
  readonly target: AerisConfirmPopupTarget;
  readonly header?: string;
  readonly message?: string;
  readonly data?: TData;
  readonly severity?: AerisConfirmPopupSeverity;
  readonly icon?: AerisConfirmPopupIcon;
  readonly acceptLabel?: string;
  readonly rejectLabel?: string;
  readonly defaultFocus?: AerisConfirmPopupDefaultFocus;
  readonly placement?: AerisConfirmPopupPlacement;
  readonly alignment?: AerisConfirmPopupAlignment;
  readonly dismissible?: boolean;
  readonly closeOnEscape?: boolean;
  readonly focusTrap?: boolean;
  readonly restoreFocus?: boolean;
  readonly accept?: (event: AerisConfirmPopupActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmPopupActionEvent<TData>) => void;
}

interface AerisConfirmPopupActionEvent<TData = unknown> {
  readonly originalEvent: Event | null;
  readonly data: TData | undefined;
  readonly config: AerisConfirmPopupResolvedConfig<TData>;
}

interface AerisConfirmPopupCloseEvent<TData = unknown>
  extends AerisConfirmPopupActionEvent<TData> {
  readonly result: AerisConfirmPopupResult;
  readonly reason: AerisConfirmPopupCloseReason;
}

interface AerisConfirmPopupTemplateContext<TData = unknown> {
  readonly $implicit: AerisConfirmPopup;
  readonly config: AerisConfirmPopupResolvedConfig<TData>;
  readonly data: TData | undefined;
  readonly accept: (event?: Event) => void;
  readonly reject: (event?: Event) => void;
  readonly close: (event?: Event) => void;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-confirm-popup-z-index` | `CSS custom property` | `1040` | Overlay stacking context. |
| `--aeris-confirm-popup-width` | `CSS custom property` | `min(22rem, calc(100vw - 1rem))` | Popup width. |
| `--aeris-confirm-popup-max-width` | `CSS custom property` | `calc(100vw - 1rem)` | Maximum popup width. |
| `--aeris-confirm-popup-padding` | `CSS custom property` | `1rem` | Internal spacing. |
| `--aeris-confirm-popup-background` | `CSS custom property` | `var(--aeris-surface)` | Popup surface. |
| `--aeris-confirm-popup-border` | `CSS custom property` | `var(--aeris-border)` | Popup border. |
| `--aeris-confirm-popup-radius` | `CSS custom property` | `var(--aeris-radius-lg)` | Popup radius. |
| `--aeris-confirm-popup-shadow` | `CSS custom property` | `component shadow` | Popup elevation. |
| `--aeris-confirm-popup-focus` | `CSS custom property` | `var(--aeris-focus)` | Focus ring color. |
| `--aeris-confirm-popup-icon-size` | `CSS custom property` | `2rem` | Built-in icon container size. |

## Examples

### Basic

Open a target-relative confirmation through the service. Standard popups do not need a host element.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-basic-demo',
  imports: [AerisButton],
  template: `
    <div>
      <div class="demo-actions">
        <button
          aerisButton
          severity="danger"
          type="button"
          (click)="confirmDelete($event)"
        >
          Delete project
        </button>
      </div>
      <p class="demo-status" aria-live="polite">{{ lastResult() }}</p>
    </div>
  `,
  styles: `
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .placement-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.5rem;
      max-width: 34rem;
    }
    
    .demo-status {
      width: 100%;
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class ConfirmPopupBasicBasicDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);
  protected readonly lastResult = signal('No popup has completed.');

  protected confirmDelete(event: MouseEvent): void {
    const ref = this.confirmations.confirm({
      target: event,
      header: 'Delete project?',
      message: 'This removes the project from the workspace.',
      severity: 'danger',
      icon: 'danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Keep project',
      defaultFocus: 'reject',
    });

    ref.closed.subscribe((close) => {
      this.lastResult.set(`Closed with ${close.result}.`);
    });
  }
}
```

### Severity

Use severity to communicate intent while keeping the same focus and keyboard behavior.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupService, type AerisConfirmPopupSeverity } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-severity-demo',
  imports: [AerisButton],
  templateUrl: './confirm-popup-severity.demo.html',
  styleUrl: './confirm-popup-severity.demo.scss'
})
export class ConfirmPopupSeveritySeverityDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);
  protected readonly lastResult = signal('No popup has completed.');

  protected confirmSeverity(event: MouseEvent, severity: AerisConfirmPopupSeverity): void {
    this.confirmations.confirm({
      target: event,
      header: `${severity} confirmation`,
      message: 'Severity updates the icon, emphasis color, and accept action.',
      severity,
      icon: severity === 'danger' ? 'danger' : severity === 'success' ? 'success' : severity === 'warning' ? 'warning' : 'info',
      acceptLabel: 'Continue',
    }).closed.subscribe((close) => {
      this.lastResult.set(`${severity} closed with ${close.result}.`);
    });
  }
}
```

#### HTML

```html
<div>
  <div class="demo-actions">
    <button
      aerisButton
      severity="info"
      type="button"
      (click)="confirmSeverity($event, 'info')"
    >
      Info
    </button>
    <button
      aerisButton
      severity="success"
      type="button"
      (click)="confirmSeverity($event, 'success')"
    >
      Success
    </button>
    <button
      aerisButton
      severity="warning"
      type="button"
      (click)="confirmSeverity($event, 'warning')"
    >
      Warning
    </button>
    <button
      aerisButton
      severity="danger"
      type="button"
      (click)="confirmSeverity($event, 'danger')"
    >
      Danger
    </button>
  </div>
  <p class="demo-status" aria-live="polite">{{ lastResult() }}</p>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Placement

Choose a preferred edge or allow auto placement to fit the viewport.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupService, type AerisConfirmPopupPlacement } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-placement-demo',
  imports: [AerisButton],
  templateUrl: './confirm-popup-placement.demo.html',
  styleUrl: './confirm-popup-placement.demo.scss'
})
export class ConfirmPopupPlacementPlacementDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);

  protected confirmAt(event: MouseEvent, placement: AerisConfirmPopupPlacement): void {
    this.confirmations.confirm({
      target: event,
      header: 'Confirm placement',
      message: `This popup opened with ${placement} placement.`,
      placement,
      acceptLabel: 'Done',
    });
  }
}
```

#### HTML

```html
<div>
  <div class="placement-grid">
    <button aerisButton type="button" (click)="confirmAt($event, 'auto')">
      Auto
    </button>
    <button aerisButton type="button" (click)="confirmAt($event, 'top')">Top</button>
    <button aerisButton type="button" (click)="confirmAt($event, 'right')">
      Right
    </button>
    <button aerisButton type="button" (click)="confirmAt($event, 'bottom')">
      Bottom
    </button>
    <button aerisButton type="button" (click)="confirmAt($event, 'left')">
      Left
    </button>
  </div>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Controlled

Use the visible model directly when popup state belongs to the current component.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupModule, type AerisConfirmPopupCloseEvent } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-controlled-demo',
  imports: [AerisButton, AerisConfirmPopupModule],
  templateUrl: './confirm-popup-controlled.demo.html',
  styleUrl: './confirm-popup-controlled.demo.scss'
})
export class ConfirmPopupControlledControlledDemo {
  protected readonly controlledOpen = signal(false);
  protected readonly controlledTarget = signal<EventTarget | null>(null);
  protected readonly controlledResult = signal('Controlled popup is closed.');

  protected openControlled(event: Event): void {
    this.controlledTarget.set(event.currentTarget);
    this.controlledOpen.set(true);
  }

  protected recordControlled(event: AerisConfirmPopupCloseEvent): void {
    this.controlledResult.set(`Controlled popup closed with ${event.result}.`);
  }
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="openControlled($event)">
    Open controlled popup
  </button>
  <aeris-confirm-popup
    [target]="controlledTarget()"
    header="Leave workflow?"
    message="Unsaved work will be discarded."
    acceptLabel="Leave"
    rejectLabel="Stay"
    severity="warning"
    defaultFocus="reject"
    [(visible)]="controlledOpen"
    (closed)="recordControlled($event)"
  />
  <p class="demo-status" aria-live="polite">{{ controlledResult() }}</p>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Templates

Use a keyed host only when projected templates are needed; the trigger still opens through the service.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupModule, AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-templates-demo',
  imports: [AerisButton, AerisConfirmPopupModule],
  templateUrl: './confirm-popup-templates.demo.html',
  styleUrl: './confirm-popup-templates.demo.scss'
})
export class ConfirmPopupTemplatesTemplatesDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);
  protected readonly releaseName = 'Aeris UI 1.0';

  protected confirmRelease(event: MouseEvent): void {
    this.confirmations.confirm({
      key: 'release-popup',
      target: event,
      header: 'Release build?',
      data: this.releaseName,
      severity: 'warning',
      icon: 'none',
    });
  }
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="confirmRelease($event)">
    Open templated popup
  </button>
  <aeris-confirm-popup key="release-popup">
    <ng-template aerisConfirmPopupIcon>
      <span class="custom-popup-icon" aria-hidden="true"></span>
    </ng-template>
    <ng-template aerisConfirmPopupMessage let-data="data">
      <span class="confirm-popup-message">
        <strong>{{ data }}</strong>
        <span
          >Confirm that release notes, accessibility checks, and package metadata are
          ready.</span
        >
      </span>
    </ng-template>
    <ng-template aerisConfirmPopupFooter let-accept="accept" let-reject="reject">
      <div class="confirm-popup-footer">
        <button
          aerisButton
          variant="secondary"
          type="button"
          (click)="reject($event)"
        >
          Review again
        </button>
        <button aerisButton severity="warning" type="button" (click)="accept($event)">
          Release
        </button>
      </div>
    </ng-template>
  </aeris-confirm-popup>
</div>
```

#### CSS

```css
.confirm-popup-message {
  display: grid;
  gap: 0.35rem;
}

.confirm-popup-message strong {
  color: var(--text);
}

.custom-popup-icon {
  position: relative;
  width: 2rem;
  height: 2rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--warning) 18%, transparent);
  color: var(--warning-text);
}

.custom-popup-icon::before {
  width: 0.9rem;
  height: 0.45rem;
  border: solid currentColor;
  border-width: 0 0 2px 2px;
  transform: rotate(-45deg) translate(0.06rem, -0.06rem);
  content: '';
}

.confirm-popup-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

### Headless

Replace the built-in popup body while keeping target positioning, focus management, and service outcomes.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupModule, AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-headless-demo',
  imports: [AerisButton, AerisConfirmPopupModule],
  templateUrl: './confirm-popup-headless.demo.html',
  styleUrl: './confirm-popup-headless.demo.scss'
})
export class ConfirmPopupHeadlessHeadlessDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);

  protected confirmHeadless(event: MouseEvent): void {
    this.confirmations.confirm({
      key: 'headless-popup',
      target: event,
      header: 'Deploy build?',
      message: 'Headless content replaces the default popup chrome.',
    });
  }
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="confirmHeadless($event)">
    Open headless popup
  </button>
  <aeris-confirm-popup key="headless-popup">
    <ng-template aerisConfirmPopupHeadless let-accept="accept" let-close="close">
      <div class="headless-popup">
        <strong>Deploy build?</strong>
        <p>Run the final release workflow for the selected environment.</p>
        <div class="headless-popup-actions">
          <button
            aerisButton
            variant="secondary"
            type="button"
            (click)="close($event)"
          >
            Cancel
          </button>
          <button aerisButton type="button" (click)="accept($event)">Deploy</button>
        </div>
      </div>
    </ng-template>
  </aeris-confirm-popup>
</div>
```

#### CSS

```css
.headless-popup {
  display: grid;
  gap: 0.75rem;
  min-width: 16rem;
}

.headless-popup strong {
  color: var(--text);
}

.headless-popup p {
  margin: 0;
  color: var(--text-2);
}

.headless-popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

### Options

Tune dismissal, arrow rendering, and width per confirmation.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

@Component({
  selector: 'app-confirm-popup-options-demo',
  imports: [AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="confirmSticky($event)">
        Open sticky popup
      </button>
    </div>
  `,
  styles: `
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .placement-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.5rem;
      max-width: 34rem;
    }
    
    .demo-status {
      width: 100%;
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class ConfirmPopupOptionsOptionsDemo {
  private readonly confirmations = inject(AerisConfirmPopupService);

  protected confirmSticky(event: MouseEvent): void {
    this.confirmations.confirm({
      target: event,
      header: 'Pinned confirmation',
      message: 'Outside clicks are ignored; use an action or Escape.',
      dismissible: false,
      showArrow: false,
      width: '18rem',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
    });
  }
}
```

## Accessibility

- The popup uses role="alertdialog" because it asks for an explicit confirmation.
- The trigger receives aria-haspopup="dialog", aria-expanded, and aria-controls while the popup is open, then its previous values are restored.
- Focus moves into the popup by default, remains trapped while open, and returns to the trigger when closed.
- Outside dismissal is enabled by default through dismissible. Escape dismissal is enabled by default through closeOnEscape.
- Use a native button or another keyboard-focusable element as the target.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next focusable control inside the popup. |
| `Shift + Tab` | Moves to the previous focusable control inside the popup. |
| `Escape` | Dismisses the popup when closeOnEscape is enabled and restores trigger focus. |
| `Enter` | Activates the focused button and closes with that action. |
| `Space` | Activates the focused button and closes with that action. |
