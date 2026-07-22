# Toast

> Service-managed transient notifications with timing, grouping, positions, templates, and live-region semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/toast`
- Human-readable documentation: [https://aeris-ui.dev/components/toast](https://aeris-ui.dev/components/toast)
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
  AerisToastModule,
  AerisToastService,
} from '@aeris-ui/core/toast';
```

## API

### Component Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `AerisToastPosition` | `'top-right'` | Places the toast region on the viewport. |
| `group` | `string` | `''` | Renders only messages from the matching service group. |
| `mode` | `AerisToastMode` | `'stacked'` | Uses a compact stack that expands on hover/focus or an always-expanded list. |
| `visibleCount` | `number` | `4` | Controls how many messages are rendered in stacked and expanded modes. |
| `limit` | `number &#124; undefined` | `undefined` | Compatibility alias that overrides visibleCount when provided. |
| `newestOnTop` | `boolean` | `true` | Shows the newest message as the primary toast. Set false to keep the oldest message on top. |
| `pauseOnHover` | `boolean` | `true` | Pauses auto-dismiss timers while the toast region is hovered or focused. |
| `showClose` | `boolean` | `true` | Shows close buttons for closable messages. |
| `ariaLabel` | `string` | `'Notifications'` | Accessible name for the toast region. |
| `closeAriaLabel` | `string` | `'Close notification'` | Accessible label for each close button. |

### Component Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `closed` | `AerisToastCloseEvent` | `-` | Emits when a message rendered by this Toast closes by timeout, button, API, or clear. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisToastContent` | `TemplateRef&lt;AerisToastTemplateContext&gt;` | `-` | Replaces default summary/detail content for each rendered message. |
| `aerisToastIcon` | `TemplateRef&lt;AerisToastTemplateContext&gt;` | `-` | Replaces the built-in severity icon for each rendered message. |

### Service Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(message)` | `AerisToastMessage` | `-` | Adds or replaces one message and starts its timer when it is not sticky. |
| `showAll(messages)` | `readonly AerisToastMessage[]` | `-` | Adds multiple messages in order. |
| `remove(id, reason)` | `void` | `reason: 'api'` | Removes one message and emits a close event. |
| `clear(group)` | `void` | `group: ''` | Removes all messages in one group. |
| `clearAll()` | `void` | `-` | Removes every active message from every group. |
| `pause(id)` | `void` | `-` | Pauses a message auto-dismiss timer. |
| `resume(id)` | `void` | `-` | Resumes a paused message auto-dismiss timer. |

### Service Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `Signal&lt;readonly AerisToastMessage[]&gt;` | `[]` | Readonly signal containing the active queue. |
| `closed` | `AerisToastSubscribable&lt;AerisToastCloseEvent&gt;` | `-` | Subscribable close event stream for service-level coordination. |

## Interfaces and types

### Interfaces

```ts
type AerisToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

type AerisToastSeverity =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'secondary'
  | 'contrast';

type AerisToastMode = 'stacked' | 'expanded';
type AerisToastCloseReason = 'timeout' | 'close-button' | 'api' | 'clear';
type AerisToastLive = 'polite' | 'assertive';
type AerisToastRole = 'status' | 'alert';

interface AerisToastMessageInput<TData = unknown> {
  readonly id?: string;
  readonly group?: string;
  readonly severity?: AerisToastSeverity;
  readonly summary?: string;
  readonly detail?: string;
  readonly life?: number;
  readonly sticky?: boolean;
  readonly closable?: boolean;
  readonly data?: TData;
  readonly ariaLabel?: string;
  readonly ariaLive?: AerisToastLive;
  readonly role?: AerisToastRole;
}

interface AerisToastMessage<TData = unknown> {
  readonly id: string;
  readonly group: string;
  readonly severity: AerisToastSeverity;
  readonly summary: string;
  readonly detail: string;
  readonly life: number;
  readonly sticky: boolean;
  readonly closable: boolean;
  readonly data: TData | undefined;
  readonly ariaLabel: string;
  readonly ariaLive: AerisToastLive;
  readonly role: AerisToastRole;
  readonly createdAt: number;
}

interface AerisToastCloseEvent<TData = unknown> {
  readonly message: AerisToastMessage<TData>;
  readonly reason: AerisToastCloseReason;
}

interface AerisToastTemplateContext<TData = unknown> {
  readonly $implicit: AerisToastMessage<TData>;
  readonly message: AerisToastMessage<TData>;
  readonly close: () => void;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-z-toast` | `CSS custom property` | — | Toast viewport stacking layer. |
| `--aeris-toast-width` | `CSS custom property` | — | Maximum notification width. |
| `--aeris-toast-offset` | `CSS custom property` | — | Distance from viewport edges. |
| `--aeris-toast-gap` | `CSS custom property` | — | Space between expanded messages. |
| `--aeris-toast-stack-peek` | `CSS custom property` | — | Visible sliver height for stacked messages under the primary toast. |
| `--aeris-toast-stack-card-height` | `CSS custom property` | — | Collapsed stacked-card measurement used to calculate overlap. |
| `--aeris-toast-expanded-message-max-height` | `CSS custom property` | — | Maximum animated message height when stacked messages expand. |
| `--aeris-toast-icon-size` | `CSS custom property` | — | Default icon box size. |
| `--aeris-success` | `CSS custom property` | — | Success accent. |
| `--aeris-info` | `CSS custom property` | — | Info accent. |
| `--aeris-warning` | `CSS custom property` | — | Warning accent. |
| `--aeris-danger` | `CSS custom property` | — | Error accent. |
| `--aeris-surface` | `CSS custom property` | — | Notification surface. |
| `--aeris-border` | `CSS custom property` | — | Notification border. |

## Examples

### Basic

Add a message through AerisToastService and render it with a Toast region.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-basic-demo',
  imports: [AerisButton, AerisToastModule],
  template: `
    <div>
      <div>
        <button aerisButton type="button" (click)="showBasicToast()">Show toast</button>
      </div>
      <aeris-toast group="basic" />
    </div>
  `
})
export class ToastBasicBasicDemo {
  private readonly toast = inject(AerisToastService);

  protected showBasicToast(): void {
    this.toast.show({
      group: 'basic',
      severity: 'info',
      summary: 'Workspace saved',
      detail: 'Your notification preferences were updated.',
    });
  }
}
```

### Severity

Use severity to communicate outcome while Toast assigns matching live-region politeness by default.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-severity-demo',
  imports: [AerisButton, AerisToastModule],
  template: `
    <div>
      <div>
        <button aerisButton type="button" (click)="showSeverityToasts()">
          Show severities
        </button>
      </div>
      <aeris-toast group="severity" position="top-left" mode="expanded" />
    </div>
  `
})
export class ToastSeveritySeverityDemo {
  private readonly toast = inject(AerisToastService);

  protected showSeverityToasts(): void {
    this.toast.showAll([
      { group: 'severity', severity: 'success', summary: 'Published', detail: 'The release notes are live.' },
      { group: 'severity', severity: 'info', summary: 'Sync running', detail: 'Assets are being checked.' },
      { group: 'severity', severity: 'warning', summary: 'Review needed', detail: 'One token changed contrast.' },
      { group: 'severity', severity: 'error', summary: 'Build failed', detail: 'Fix the failing test before release.' },
    ]);
  }
}
```

### Sticky and clear

Sticky messages stay visible until a close button, service removal, or group clear removes them.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService, type AerisToastCloseEvent } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-sticky-demo',
  imports: [AerisButton, AerisToastModule],
  templateUrl: './toast-sticky.demo.html',
  styleUrl: './toast-sticky.demo.scss'
})
export class ToastStickyStickyAndClearDemo {
  private readonly toast = inject(AerisToastService);
  protected readonly lastClosed = signal('No toast has closed yet.');

  protected showStickyToast(): void {
    this.toast.show({
      group: 'sticky',
      severity: 'warning',
      summary: 'Manual review required',
      detail: 'This notification remains until the user closes it or the group is cleared.',
      sticky: true,
    });
  }

  protected clearStickyToasts(): void {
    this.toast.clear('sticky');
  }

  protected recordClosed(event: AerisToastCloseEvent): void {
    this.lastClosed.set(`${event.message.summary} closed by ${event.reason}.`);
  }
}
```

#### HTML

```html
<div>
  <div class="toast-example-actions">
    <button aerisButton type="button" (click)="showStickyToast()">
      Show sticky toast
    </button>
    <button
      aerisButton
      variant="secondary"
      type="button"
      (click)="clearStickyToasts()"
    >
      Clear sticky group
    </button>
  </div>
  <aeris-toast
    group="sticky"
    position="bottom-right"
    (closed)="recordClosed($event)"
  />
  <p aria-live="polite">{{ lastClosed() }}</p>
</div>
```

#### CSS

```css
.toast-example-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Custom content

Replace message content and icons while keeping the close context and notification semantics.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService, type AerisToastMessage } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-custom-demo',
  imports: [AerisButton, AerisToastModule],
  templateUrl: './toast-custom.demo.html',
  styleUrl: './toast-custom.demo.scss'
})
export class ToastCustomCustomContentDemo {
  private readonly toast = inject(AerisToastService);

  protected showActionToast(): void {
    this.toast.show({
      group: 'action',
      severity: 'success',
      summary: 'File archived',
      detail: 'The file moved to archive.',
      sticky: true,
    });
  }

  protected undoArchive(message: AerisToastMessage): void {
    this.toast.remove(message.id);
    this.toast.show({
      group: 'action',
      severity: 'info',
      summary: 'Archive undone',
      detail: 'The file was restored.',
    });
  }
}
```

#### HTML

```html
<div>
  <div>
    <button aerisButton type="button" (click)="showActionToast()">
      Show action toast
    </button>
  </div>
  <aeris-toast group="action" position="top-center" mode="expanded">
    <ng-template aerisToastIcon let-message>
      <span aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </span>
    </ng-template>
    <ng-template aerisToastContent let-message let-close="close">
      <div class="toast-example-content">
        <strong>{{ message.summary }}</strong>
        <p>{{ message.detail }}</p>
        <div class="toast-example-actions">
          <button aerisButton size="sm" type="button" (click)="undoArchive(message)">
            Undo
          </button>
          <button
            aerisButton
            size="sm"
            variant="secondary"
            type="button"
            (click)="close()"
          >
            Dismiss
          </button>
        </div>
      </div>
    </ng-template>
  </aeris-toast>
</div>
```

#### CSS

```css
.toast-example-content {
  display: grid;
  gap: 0.5rem;
}

.toast-example-content p {
  margin: 0;
}

.toast-example-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Stacked preview

Stacked mode shows one primary notification and keeps the next visible messages tucked underneath. Hover or focus the stack to expand the visible window.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-stacked-demo',
  imports: [AerisButton, AerisToastModule],
  template: `
    <div>
      <div>
        <button aerisButton type="button" (click)="showStackedToasts()">
          Show stacked toasts
        </button>
      </div>
      <aeris-toast group="stacked" position="top-right" [visibleCount]="4" newestOnTop />
    </div>
  `
})
export class ToastStackedStackedPreviewDemo {
  private readonly toast = inject(AerisToastService);

  protected showStackedToasts(): void {
    this.toast.showAll([
      { group: 'stacked', severity: 'success', summary: 'Saved', detail: 'Workspace settings were stored.' },
      { group: 'stacked', severity: 'info', summary: 'Queued', detail: 'A preview build is waiting.' },
      { group: 'stacked', severity: 'warning', summary: 'Review', detail: 'A token needs contrast review.' },
      { group: 'stacked', severity: 'neutral', summary: 'Synced', detail: 'Design assets are current.' },
      { group: 'stacked', severity: 'error', summary: 'Failed', detail: 'One job needs attention.' },
      { group: 'stacked', severity: 'info', summary: 'Assigned', detail: 'A reviewer was notified.' },
    ]);
  }
}
```

### Positions

Bind the position input when a workflow needs notifications near a viewport edge or centered.

#### TS

```ts
import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService, type AerisToastPosition } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-positions-demo',
  imports: [AerisButton, AerisToastModule],
  templateUrl: './toast-positions.demo.html',
  styleUrl: './toast-positions.demo.scss'
})
export class ToastPositionsPositionsDemo {
  private readonly toast = inject(AerisToastService);
  protected readonly currentPosition = signal<AerisToastPosition>('top-right');

  protected showAt(position: AerisToastPosition): void {
    this.currentPosition.set(position);
    this.toast.show({
      group: 'position',
      severity: 'neutral',
      summary: 'Position changed',
      detail: `This toast is rendered at ${position}.`,
    });
  }
}
```

#### HTML

```html
<div>
  <div class="toast-example-actions">
    <button aerisButton type="button" (click)="showAt('top-left')">Top left</button>
    <button aerisButton type="button" (click)="showAt('top-center')">
      Top center
    </button>
    <button aerisButton type="button" (click)="showAt('top-right')">Top right</button>
    <button aerisButton type="button" (click)="showAt('bottom-left')">
      Bottom left
    </button>
    <button aerisButton type="button" (click)="showAt('bottom-center')">
      Bottom center
    </button>
    <button aerisButton type="button" (click)="showAt('bottom-right')">
      Bottom right
    </button>
    <button aerisButton type="button" (click)="showAt('center')">Center</button>
  </div>
  <aeris-toast group="position" [position]="currentPosition()" />
</div>
```

#### CSS

```css
.toast-example-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Expanded stack

Set mode to expanded when the visible window should remain open without requiring hover or focus.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-expanded-demo',
  imports: [AerisButton, AerisToastModule],
  template: `
    <div>
      <div>
        <button aerisButton type="button" (click)="showExpandedStack()">
          Show expanded stack
        </button>
      </div>
      <aeris-toast
        group="expanded"
        position="bottom-center"
        mode="expanded"
        [visibleCount]="4"
      />
    </div>
  `
})
export class ToastExpandedExpandedStackDemo {
  private readonly toast = inject(AerisToastService);

  protected showExpandedStack(): void {
    this.toast.showAll([
      { group: 'expanded', severity: 'success', summary: 'Step 1 complete', detail: 'Schema validation passed.' },
      { group: 'expanded', severity: 'info', summary: 'Step 2 running', detail: 'Preview assets are uploading.' },
      { group: 'expanded', severity: 'warning', summary: 'Step 3 queued', detail: 'A reviewer must approve deployment.' },
      { group: 'expanded', severity: 'neutral', summary: 'Step 4 waiting', detail: 'Release notes are being generated.' },
      { group: 'expanded', severity: 'error', summary: 'Step 5 blocked', detail: 'A required owner is missing.' },
    ]);
  }
}
```

### Loading pattern

Use a stable message id for a sticky loading toast, then replace it with the completion result.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';

@Component({
  selector: 'app-toast-loading-demo',
  imports: [AerisButton, AerisToastModule],
  template: `
    <div>
      <div>
        <button aerisButton type="button" (click)="startUpload()">Start upload</button>
      </div>
      <aeris-toast group="loading" position="top-right" />
    </div>
  `
})
export class ToastLoadingLoadingPatternDemo {
  private readonly toast = inject(AerisToastService);

  protected startUpload(): void {
    const id = 'upload-toast';
    this.toast.show({
      id,
      group: 'loading',
      severity: 'neutral',
      summary: 'Uploading assets',
      detail: 'Please keep this tab open.',
      sticky: true,
      closable: false,
    });

    globalThis.setTimeout(() => {
      this.toast.remove(id);
      this.toast.show({
        group: 'loading',
        severity: 'success',
        summary: 'Upload complete',
        detail: 'All assets are ready for review.',
      });
    }, 1600);
  }
}
```

## Accessibility

- Toast renders a named notification region only while matching messages are active.
- Success, info, neutral, secondary, and contrast messages default to role="status" and aria-live="polite".
- Warning and error messages default to role="alert" and aria-live="assertive".
- Each message uses aria-atomic="true" so summary and detail are announced together.
- Close controls are native buttons with configurable accessible labels.
- Stacked mode renders a limited visible window. Messages outside that window remain queued and appear as visible messages are dismissed.
- Use newestOnTop to control whether the newest or oldest queued message is the primary visible toast.
- Auto-dismiss timers pause while the region is hovered or focused when pauseOnHover is enabled.
- Messages outside the visible window are paused until they become visible so they are not dismissed before users can perceive them.
- Use sticky messages for critical information that must remain available until dismissed.
- Toast motion is disabled for users who request reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus through close buttons and any projected native interactive elements. |
| `Enter / Space` | Activates the focused native button, including the built-in close button. |
| `Escape` | No built-in global behavior. Provide explicit buttons or service actions for dismissal. |
