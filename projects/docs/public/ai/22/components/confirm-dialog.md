# ConfirmDialog

> Confirmation dialog with service prompts, safe focus defaults, templates, and explicit accept or reject outcomes.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/confirm-dialog`
- Human-readable documentation: [https://aeris-ui.dev/components/confirm-dialog](https://aeris-ui.dev/components/confirm-dialog)
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
  AerisConfirmDialogModule,
  AerisConfirmDialogService,
} from '@aeris-ui/core/confirm-dialog';
```

## API

### Service Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `confirm(config)` | `AerisConfirmDialogConfig =&gt; AerisConfirmDialogRef` | `-` | Opens a service-created confirmation. When key is provided, opens the matching template host. |
| `closeAll()` | `() =&gt; void` | `-` | Dismisses active confirmations opened through the service. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | `''` | Matches service requests to a specific template host. Omit it for service-created dialogs. |
| `header` | `string` | `'Confirm action'` | Visible title for declarative usage. |
| `message` | `string` | `''` | Default confirmation message. |
| `data` | `unknown` | `undefined` | Context data exposed to templates and events. |
| `icon` | `AerisConfirmDialogIcon` | `'question'` | Built-in icon or none. |
| `severity` | `AerisConfirmDialogSeverity` | `'primary'` | Visual intent for icon and accept action. |
| `acceptLabel` | `string` | `'Confirm'` | Accept button text. |
| `rejectLabel` | `string` | `'Cancel'` | Reject button text. |
| `acceptVisible` | `boolean` | `true` | Renders the accept action. |
| `rejectVisible` | `boolean` | `true` | Renders the reject action. |
| `acceptDisabled` | `boolean` | `false` | Disables the accept action. |
| `rejectDisabled` | `boolean` | `false` | Disables the reject action. |
| `acceptAriaLabel` | `string` | `''` | Accessible label for the accept action; falls back to acceptLabel. |
| `rejectAriaLabel` | `string` | `''` | Accessible label for the reject action; falls back to rejectLabel. |
| `defaultFocus` | `AerisConfirmDialogDefaultFocus` | `'accept'` | Built-in first focus target. |
| `modal` | `boolean` | `true` | Enables modal dialog semantics. |
| `backdrop` | `boolean` | `true` | Shows the modal backdrop. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius with a CSS length. |
| `dismissibleMask` | `boolean` | `false` | Allows clicking the mask to dismiss. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to dismiss. |
| `closable` | `boolean` | `true` | Shows the header close action. |
| `blockScroll` | `boolean` | `true` | Locks page scrolling while modal. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the dialog. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the launcher after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the dialog after open. |
| `initialFocus` | `string` | `''` | Custom selector that overrides defaultFocus. |
| `position` | `AerisDialogPosition` | `'center'` | Places the dialog within the viewport. |
| `size` | `AerisDialogSize` | `'sm'` | Dialog width preset. |
| `width` | `string` | `''` | Custom dialog width. |
| `maxWidth` | `string` | `''` | Custom maximum width. |
| `mobileWidth` | `string` | `''` | Narrow viewport width. |
| `closeAriaLabel` | `string` | `'Close confirmation dialog'` | Accessible label for the close action. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the dialog. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the dialog. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the confirmation. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Controls declarative visibility. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visibleChange` | `boolean` | `-` | Emitted by the visible model. |
| `shown` | `AerisConfirmDialogActionEvent` | `-` | Emitted after the confirmation opens. |
| `accepted` | `AerisConfirmDialogActionEvent` | `-` | Emitted when the accept action runs. |
| `rejected` | `AerisConfirmDialogActionEvent` | `-` | Emitted when the reject action runs. |
| `closed` | `AerisConfirmDialogCloseEvent` | `-` | Emitted for accept, reject, and dismiss closes. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisConfirmDialogIcon` | `AerisConfirmDialogTemplateContext` | `built-in icon` | Custom decorative icon content. |
| `aerisConfirmDialogMessage` | `AerisConfirmDialogTemplateContext` | `message input` | Custom body message content. |
| `aerisConfirmDialogFooter` | `AerisConfirmDialogTemplateContext` | `default actions` | Custom footer actions with accept, reject, and close callbacks. |
| `aerisConfirmDialogHeadless` | `AerisConfirmDialogTemplateContext` | `-` | Replaces the built-in confirmation body and footer inside the dialog shell. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `accept(event?)` | `(Event &#124; null) =&gt; void` | `-` | Runs accept callbacks and closes with accept result. |
| `reject(event?)` | `(Event &#124; null) =&gt; void` | `-` | Runs reject callbacks and closes with reject result. |
| `close(event?)` | `(Event &#124; null) =&gt; void` | `-` | Dismisses the confirmation without accepting or rejecting. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus to the configured initial focus target. |
| `openWithConfig(config, ref)` | `(ResolvedConfig, AerisConfirmDialogRef) =&gt; void` | `-` | Opens a resolved configuration for a service-created host. |

### Config Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | `''` | Matches service requests to a specific template host. Omit it for service-created dialogs. |
| `header` | `string` | `'Confirm action'` | Visible title for declarative usage. |
| `message` | `string` | `''` | Default confirmation message. |
| `data` | `unknown` | `undefined` | Context data exposed to templates and events. |
| `icon` | `AerisConfirmDialogIcon` | `'question'` | Built-in icon or none. |
| `severity` | `AerisConfirmDialogSeverity` | `'primary'` | Visual intent for icon and accept action. |
| `acceptLabel` | `string` | `'Confirm'` | Accept button text. |
| `rejectLabel` | `string` | `'Cancel'` | Reject button text. |
| `acceptVisible` | `boolean` | `true` | Renders the accept action. |
| `rejectVisible` | `boolean` | `true` | Renders the reject action. |
| `acceptDisabled` | `boolean` | `false` | Disables the accept action. |
| `rejectDisabled` | `boolean` | `false` | Disables the reject action. |
| `acceptAriaLabel` | `string` | `''` | Accessible label for the accept action; falls back to acceptLabel. |
| `rejectAriaLabel` | `string` | `''` | Accessible label for the reject action; falls back to rejectLabel. |
| `defaultFocus` | `AerisConfirmDialogDefaultFocus` | `'accept'` | Built-in first focus target. |
| `modal` | `boolean` | `true` | Enables modal dialog semantics. |
| `backdrop` | `boolean` | `true` | Shows the modal backdrop. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius with a CSS length. |
| `dismissibleMask` | `boolean` | `false` | Allows clicking the mask to dismiss. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to dismiss. |
| `closable` | `boolean` | `true` | Shows the header close action. |
| `blockScroll` | `boolean` | `true` | Locks page scrolling while modal. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the dialog. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the launcher after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the dialog after open. |
| `initialFocus` | `string` | `''` | Custom selector that overrides defaultFocus. |
| `position` | `AerisDialogPosition` | `'center'` | Places the dialog within the viewport. |
| `size` | `AerisDialogSize` | `'sm'` | Dialog width preset. |
| `width` | `string` | `''` | Custom dialog width. |
| `maxWidth` | `string` | `''` | Custom maximum width. |
| `mobileWidth` | `string` | `''` | Narrow viewport width. |
| `closeAriaLabel` | `string` | `'Close confirmation dialog'` | Accessible label for the close action. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the dialog. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the dialog. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the confirmation. |
| `accept` | `(AerisConfirmDialogActionEvent) =&gt; void` | `-` | Callback invoked before an accepted confirmation closes. |
| `reject` | `(AerisConfirmDialogActionEvent) =&gt; void` | `-` | Callback invoked before a rejected confirmation closes. |

### Ref Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `accept(event?)` | `(Event &#124; null) =&gt; void` | `-` | Accepts the confirmation programmatically. |
| `reject(event?)` | `(Event &#124; null) =&gt; void` | `-` | Rejects the confirmation programmatically. |
| `close(event?)` | `(Event &#124; null) =&gt; void` | `-` | Dismisses the confirmation programmatically. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus into the active confirmation. |
| `accepted` | `Subscribable&lt;AerisConfirmDialogActionEvent&gt;` | `-` | Subscribe to accept actions. |
| `rejected` | `Subscribable&lt;AerisConfirmDialogActionEvent&gt;` | `-` | Subscribe to reject actions. |
| `closed` | `Subscribable&lt;AerisConfirmDialogCloseEvent&gt;` | `-` | Subscribe to the final close result. |
| `shown` | `Subscribable&lt;AerisConfirmDialogActionEvent&gt;` | `-` | Subscribe after the dialog opens. |

## Interfaces and types

### Interfaces

```ts
type AerisConfirmDialogSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';

type AerisConfirmDialogIcon =
  | 'question'
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'none';

type AerisConfirmDialogDefaultFocus =
  | 'accept'
  | 'reject'
  | 'close'
  | 'dialog'
  | 'none';

type AerisConfirmDialogResult = 'accept' | 'reject' | 'dismiss';

type AerisDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface AerisConfirmDialogConfig<TData = unknown> {
  readonly key?: string;
  readonly header?: string;
  readonly message?: string;
  readonly data?: TData;
  readonly severity?: AerisConfirmDialogSeverity;
  readonly icon?: AerisConfirmDialogIcon;
  readonly acceptLabel?: string;
  readonly rejectLabel?: string;
  readonly defaultFocus?: AerisConfirmDialogDefaultFocus;
  readonly backdrop?: boolean;
  readonly backdropBlur?: boolean;
  readonly backdropBlurAmount?: string;
  readonly dismissibleMask?: boolean;
  readonly position?: AerisDialogPosition;
  readonly width?: string;
  readonly blockScroll?: boolean;
  readonly accept?: (event: AerisConfirmDialogActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmDialogActionEvent<TData>) => void;
}

interface AerisConfirmDialogActionEvent<TData = unknown> {
  readonly originalEvent: Event | null;
  readonly data: TData | undefined;
  readonly config: AerisConfirmDialogResolvedConfig<TData>;
}

interface AerisConfirmDialogCloseEvent<TData = unknown>
  extends AerisConfirmDialogActionEvent<TData> {
  readonly result: AerisConfirmDialogResult;
  readonly reason: AerisDialogCloseReason | 'accept' | 'reject';
}

interface AerisConfirmDialogTemplateContext<TData = unknown> {
  readonly $implicit: AerisConfirmDialog;
  readonly config: AerisConfirmDialogResolvedConfig<TData>;
  readonly data: TData | undefined;
  readonly accept: (event?: Event) => void;
  readonly reject: (event?: Event) => void;
  readonly close: (event?: Event) => void;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-confirm-dialog-icon-size` | `CSS custom property` | — | Default icon container size. |
| `--aeris-confirm-dialog-icon-background` | `CSS custom property` | — | Icon container background. |
| `--aeris-confirm-dialog-icon-color` | `CSS custom property` | — | Icon color. |
| `--aeris-confirm-dialog-message-color` | `CSS custom property` | — | Message text color. |
| `--aeris-confirm-dialog-focus` | `CSS custom property` | — | Action focus ring. |
| `--aeris-dialog-backdrop-blur` | `CSS custom property` | — | Backdrop blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-dialog-*` | `CSS custom property` | — | Dialog shell layout, mask, radius, shadow, and spacing. |

## Examples

### Basic

Open a confirmation through the service. No host element is required for standard confirmations.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-basic-demo',
  imports: [AerisButton],
  template: `
    <div>
      <div class="demo-actions">
        <button aerisButton severity="danger" type="button" (click)="confirmDelete()">
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
    
    .position-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;
      max-width: 28rem;
    }
    
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class ConfirmDialogBasicBasicDemo {
  private readonly confirmations = inject(AerisConfirmDialogService);
  protected readonly lastResult = signal('No confirmation has completed.');

  protected confirmDelete(): void {
    const ref = this.confirmations.confirm({
      header: 'Delete project?',
      message: 'This removes the project and its audit history.',
      severity: 'danger',
      icon: 'danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Keep project',
      defaultFocus: 'reject',
    });

    ref.closed.subscribe((event) => {
      this.lastResult.set(`Closed with ${event.result}.`);
    });
  }
}
```

### Severity

Use severity to communicate intent while keeping the same keyboard and focus behavior.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogService, type AerisConfirmDialogSeverity } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-severity-demo',
  imports: [AerisButton],
  templateUrl: './confirm-dialog-severity.demo.html',
  styleUrl: './confirm-dialog-severity.demo.scss'
})
export class ConfirmDialogSeveritySeverityDemo {
  private readonly confirmations = inject(AerisConfirmDialogService);
  protected readonly lastResult = signal('No confirmation has completed.');

  protected confirmSeverity(severity: AerisConfirmDialogSeverity): void {
    this.confirmations.confirm({
      header: `${severity} confirmation`,
      message: 'Each severity updates the icon, emphasis color, and accept action.',
      severity,
      icon: severity === 'danger' ? 'danger' : severity === 'success' ? 'success' : severity === 'warning' ? 'warning' : 'info',
      acceptLabel: 'Continue',
    }).closed.subscribe((event) => {
      this.lastResult.set(`${severity} closed with ${event.result}.`);
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
      (click)="confirmSeverity('info')"
    >
      Info
    </button>
    <button
      aerisButton
      severity="success"
      type="button"
      (click)="confirmSeverity('success')"
    >
      Success
    </button>
    <button
      aerisButton
      severity="warning"
      type="button"
      (click)="confirmSeverity('warning')"
    >
      Warning
    </button>
    <button
      aerisButton
      severity="danger"
      type="button"
      (click)="confirmSeverity('danger')"
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

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 28rem;
}

.demo-status {
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Positions

Open confirmations in every supported viewport position.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-positions-demo',
  imports: [AerisButton],
  templateUrl: './confirm-dialog-positions.demo.html',
  styleUrl: './confirm-dialog-positions.demo.scss'
})
export class ConfirmDialogPositionsPositionsDemo {
  private readonly confirmations = inject(AerisConfirmDialogService);

  protected confirmAt(
    position:
      | 'center'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right',
  ): void {
    this.confirmations.confirm({
      header: 'Confirm position',
      message: `This confirmation opened at ${position}.`,
      position,
      acceptLabel: 'Done',
    });
  }
}
```

#### HTML

```html
<div>
  <div class="position-grid">
    <button aerisButton type="button" (click)="confirmAt('top-left')">
      Top left
    </button>
    <button aerisButton type="button" (click)="confirmAt('top')">Top</button>
    <button aerisButton type="button" (click)="confirmAt('top-right')">
      Top right
    </button>
    <button aerisButton type="button" (click)="confirmAt('left')">Left</button>
    <button aerisButton type="button" (click)="confirmAt('center')">Center</button>
    <button aerisButton type="button" (click)="confirmAt('right')">Right</button>
    <button aerisButton type="button" (click)="confirmAt('bottom-left')">
      Bottom left
    </button>
    <button aerisButton type="button" (click)="confirmAt('bottom')">Bottom</button>
    <button aerisButton type="button" (click)="confirmAt('bottom-right')">
      Bottom right
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

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 28rem;
}

.demo-status {
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Controlled

Use the visible model directly when confirmation state belongs to the current component.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogModule, type AerisConfirmDialogCloseEvent } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-controlled-demo',
  imports: [AerisButton, AerisConfirmDialogModule],
  templateUrl: './confirm-dialog-controlled.demo.html',
  styleUrl: './confirm-dialog-controlled.demo.scss'
})
export class ConfirmDialogControlledControlledDemo {
  protected readonly controlledOpen = signal(false);
  protected readonly controlledResult = signal('Controlled confirmation is closed.');

  protected recordControlled(event: AerisConfirmDialogCloseEvent): void {
    this.controlledResult.set(`Controlled dialog closed with ${event.result}.`);
  }
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="controlledOpen.set(true)">
    Open controlled confirmation
  </button>
  <aeris-confirm-dialog
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

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 28rem;
}

.demo-status {
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Templates

Use a keyed template host only when projected templates are needed; the trigger still opens through the service.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogModule, AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-templates-demo',
  imports: [AerisButton, AerisConfirmDialogModule],
  templateUrl: './confirm-dialog-templates.demo.html',
  styleUrl: './confirm-dialog-templates.demo.scss'
})
export class ConfirmDialogTemplatesTemplatesDemo {
  private readonly confirmations = inject(AerisConfirmDialogService);
  protected readonly releaseName = 'Aeris UI 1.0';

  protected confirmRelease(): void {
    this.confirmations.confirm({
      key: 'release-template',
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
  <button aerisButton type="button" (click)="confirmRelease()">
    Open templated confirmation
  </button>
  <aeris-confirm-dialog key="release-template">
    <ng-template aerisConfirmDialogIcon>
      <span class="custom-confirm-icon" aria-hidden="true"></span>
    </ng-template>
    <ng-template aerisConfirmDialogMessage let-data="data">
      <span class="confirm-message">
        <strong>{{ data }}</strong>
        <span
          >Confirm that release notes, accessibility checks, and package metadata are
          ready.</span
        >
      </span>
    </ng-template>
    <ng-template aerisConfirmDialogFooter let-accept="accept" let-reject="reject">
      <div class="confirm-footer">
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
  </aeris-confirm-dialog>
</div>
```

#### CSS

```css
.confirm-message {
  display: grid;
  gap: 0.35rem;
}

.confirm-message strong {
  color: var(--text);
}

.custom-confirm-icon {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--warning) 18%, transparent);
  color: var(--warning-text);
  font-weight: 900;
}

.custom-confirm-icon::before {
  width: 1.05rem;
  height: 0.55rem;
  border: solid currentColor;
  border-width: 0 0 2px 2px;
  transform: rotate(-45deg) translate(0.08rem, -0.08rem);
  content: '';
}

.confirm-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

### Options

Use Dialog positioning and modal options. Backdropless modal confirmations still block page scrolling, and dismissible masks close from an outside click.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog-options-demo',
  imports: [AerisButton],
  template: `
    <div>
      <div class="demo-actions">
        <button aerisButton type="button" (click)="confirmWithoutBackdrop()">
          Open without backdrop
        </button>
        <button aerisButton type="button" (click)="confirmDismissibleMask()">
          Dismissible mask
        </button>
      </div>
    </div>
  `,
  styles: `
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .position-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;
      max-width: 28rem;
    }
    
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class ConfirmDialogOptionsOptionsDemo {
  private readonly confirmations = inject(AerisConfirmDialogService);

  protected confirmWithoutBackdrop(): void {
    this.confirmations.confirm({
      header: 'Publish changes?',
      message: 'The backdrop is hidden, but page scrolling remains locked while this modal is open.',
      backdrop: false,
      position: 'top',
      width: 'min(34rem, calc(100vw - 2rem))',
      acceptLabel: 'Publish',
      rejectLabel: 'Review again',
    });
  }

  protected confirmDismissibleMask(): void {
    this.confirmations.confirm({
      header: 'Dismissible mask',
      message: 'Click outside the confirmation to dismiss without choosing an action.',
      dismissibleMask: true,
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
    });
  }
}
```

## Accessibility

- ConfirmDialog renders an alertdialog role with modal state by default.
- The visible header labels the dialog unless ariaLabel or ariaLabelledBy is provided.
- The message is connected as the dialog description unless ariaDescribedBy is provided.
- Focus moves to the configured defaultFocus. Use reject for destructive actions when the safest action should be first.
- Tab navigation is trapped while focusTrap is enabled, and focus returns to the launcher after close when restoreFocus is enabled.
- Escape dismissal is enabled by default. Mask dismissal is opt-in through dismissibleMask.
- Use clear button labels that describe the consequence of accepting or rejecting.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next focusable element inside the confirmation and wraps while focusTrap is enabled. |
| `Shift + Tab` | Moves to the previous focusable element and wraps while focusTrap is enabled. |
| `Escape` | Dismisses the confirmation when closeOnEscape is enabled. |
| `Enter / Space` | Activates the focused native button, including accept and reject actions. |
