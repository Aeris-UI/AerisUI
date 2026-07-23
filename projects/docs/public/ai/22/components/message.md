# Message

> Inline feedback with severity, variants, templates, closable state, and live-region semantics.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/message`
- Human-readable documentation: [https://aeris-ui.dev/components/message](https://aeris-ui.dev/components/message)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMessageModule } from '@aeris-ui/core/message';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Sets the host element id. |
| `severity` | `AerisMessageSeverity` | `'info'` | Sets visual tone and default live-region behavior. |
| `variant` | `AerisMessageVariant` | `'filled'` | Sets filled, outlined, or simple presentation. |
| `size` | `AerisMessageSize` | `'md'` | Sets compact, default, or large spacing and type scale. |
| `text` | `string` | `''` | Renders plain message text when no content template is provided. |
| `closable` | `boolean` | `false` | Shows a native close button. |
| `life` | `number` | `0` | Auto-closes the message after the provided number of milliseconds. Zero disables auto-close. |
| `showIcon` | `boolean` | `true` | Shows or hides the severity icon region. |
| `role` | `AerisMessageRole &#124; ''` | `''` | Overrides the default alert/status role. |
| `ariaLive` | `AerisMessageLive &#124; ''` | `''` | Overrides the default live-region politeness. |
| `ariaLabel` | `string` | `''` | Accessible name for the message when visible text is not enough. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names the message. |
| `closeAriaLabel` | `string` | `'Close message'` | Accessible label for the close button. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Controls whether the message is rendered. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `closed` | `AerisMessageCloseEvent` | `-` | Emits when close button, timeout, or API closes the message. |
| `visibilityChanged` | `boolean` | `-` | Emits after show or close changes visible state. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisMessageIcon` | `TemplateRef&lt;AerisMessageTemplateContext&gt;` | `-` | Replaces the built-in severity icon. |
| `aerisMessageContent` | `TemplateRef&lt;AerisMessageTemplateContext&gt;` | `-` | Replaces text/default projected content and receives close context. |
| `default content` | `content projection` | `-` | Projected content rendered when text and aerisMessageContent are not provided. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `close(originalEvent, reason)` | `void` | `reason: 'api'` | Closes the message and emits closed/visibility events. |
| `show()` | `void` | `-` | Shows the message and emits visibilityChanged when it was hidden. |
| `hide()` | `void` | `-` | Closes the message with the api reason. |

## Interfaces and types

### Interfaces

```ts
type AerisMessageSeverity =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'secondary'
  | 'contrast';

type AerisMessageVariant = 'filled' | 'outlined' | 'simple';
type AerisMessageSize = 'sm' | 'md' | 'lg';
type AerisMessageCloseReason = 'api' | 'close-button' | 'timeout';
type AerisMessageLive = 'polite' | 'assertive' | 'off';
type AerisMessageRole = 'status' | 'alert' | 'note';

interface AerisMessageCloseEvent {
  readonly originalEvent: Event | null;
  readonly reason: AerisMessageCloseReason;
}

interface AerisMessageTemplateContext {
  readonly $implicit: AerisMessage;
  readonly message: AerisMessage;
  readonly close: (event?: Event) => void;
  readonly severity: AerisMessageSeverity;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-message-icon-size` | `CSS custom property` | — | Message icon box size. |
| `--aeris-success` | `CSS custom property` | — | Success accent. |
| `--aeris-info` | `CSS custom property` | — | Info accent. |
| `--aeris-warning` | `CSS custom property` | — | Warning accent. |
| `--aeris-danger` | `CSS custom property` | — | Error accent. |
| `--aeris-surface` | `CSS custom property` | — | Filled message surface. |
| `--aeris-border` | `CSS custom property` | — | Message border fallback. |
| `--aeris-text` | `CSS custom property` | — | Primary message text color. |
| `--aeris-text-2` | `CSS custom property` | — | Muted close-button color. |
| `--aeris-focus` | `CSS custom property` | — | Close-button focus outline. |

## Examples

### Basic

Use Message for inline feedback near the content or control it describes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-basic-demo',
  imports: [AerisMessageModule],
  template: `
    <div>
      <aeris-message text="Upgrade now and save 5%." />
    </div>
  `
})
export class MessageBasicBasicDemo {
}
```

### Severity

Use severity to communicate the tone of feedback and choose default live-region behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-severity-demo',
  imports: [AerisMessageModule],
  template: `
    <div>
      <div class="message-stack">
        <aeris-message severity="success" text="Your account is now ready." />
        <aeris-message severity="info" text="Upgrade now and save 5%." />
        <aeris-message severity="warning" text="Your subscription is about to expire." />
        <aeris-message severity="error" text="Something went wrong." />
        <aeris-message severity="neutral" text="Processing may take a few moments." />
        <aeris-message severity="contrast" text="You're currently in offline mode." />
      </div>
    </div>
  `,
  styles: `
    .message-stack {
      display: grid;
      gap: 0.75rem;
    }
  `
})
export class MessageSeveritySeverityDemo {
}
```

### Variants

Choose filled, outlined, or simple presentation without changing message semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-variants-demo',
  imports: [AerisMessageModule],
  template: `
    <div>
      <div class="message-stack">
        <aeris-message severity="success" text="Filled message." />
        <aeris-message severity="warning" variant="outlined" text="Outlined message." />
        <aeris-message severity="info" variant="simple" text="Simple inline message." />
      </div>
    </div>
  `,
  styles: `
    .message-stack {
      display: grid;
      gap: 0.75rem;
    }
  `
})
export class MessageVariantsVariantsDemo {
}
```

### Sizes

Use compact or large sizing when message density needs to match nearby controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-sizes-demo',
  imports: [AerisMessageModule],
  template: `
    <div>
      <div class="message-inline">
        <aeris-message size="sm" text="Small message." />
        <aeris-message text="Default message." />
        <aeris-message size="lg" text="Large message." />
      </div>
    </div>
  `,
  styles: `
    .message-inline {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class MessageSizesSizesDemo {
}
```

### Icons

Use the built-in severity icon, hide the icon, or provide a consumer-owned icon template.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-icons-demo',
  imports: [AerisMessageModule],
  templateUrl: './message-icons.demo.html',
  styleUrl: './message-icons.demo.scss'
})
export class MessageIconsIconsDemo {
}
```

#### HTML

```html
<div>
  <div class="message-stack">
    <aeris-message severity="warning" text="Your subscription is about to expire." />
    <aeris-message
      severity="neutral"
      [showIcon]="false"
      text="This message has no icon."
    />
    <aeris-message severity="success">
      <ng-template aerisMessageIcon>
        <span class="message-custom-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </ng-template>
      Custom icon template.
    </aeris-message>
  </div>
</div>
```

#### CSS

```css
.message-stack {
  display: grid;
  gap: 0.75rem;
}

.message-custom-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-grid;
  place-items: center;
}

.message-custom-icon svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.message-stack {
  display: grid;
  gap: 0.75rem;
}

.message-custom-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-grid;
  place-items: center;
}

.message-custom-icon svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

### Closable

Enable a native close button and listen for close reasons when application state needs to react.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisMessageModule, type AerisMessageCloseEvent } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-closable-demo',
  imports: [AerisMessageModule],
  template: `
    <div>
      <div class="message-stack">
        <aeris-message
          severity="warning"
          text="This is a closable message."
          closable
          (closed)="recordClose($event)"
        />
        <p class="message-status" aria-live="polite">{{ closeStatus() }}</p>
      </div>
    </div>
  `,
  styles: `
    .message-stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .message-status {
      margin: 0;
      color: var(--aeris-text-2);
      font-size: 0.875rem;
    }
    
    .message-stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .message-status {
      margin: 0;
      color: var(--text-2);
      font-size: 0.875rem;
    }
  `
})
export class MessageClosableClosableDemo {
  protected readonly closeStatus = signal('Message is visible.');

  protected recordClose(event: AerisMessageCloseEvent): void {
    this.closeStatus.set(`Message closed by ${event.reason}.`);
  }
}
```

### Life

Use life when temporary inline feedback should dismiss itself after a defined delay.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-life-demo',
  imports: [AerisButton, AerisMessageModule],
  templateUrl: './message-life.demo.html',
  styleUrl: './message-life.demo.scss'
})
export class MessageLifeLifeDemo {
  protected readonly timedVisible = signal(false);

  protected showTimedMessage(): void {
    this.timedVisible.set(true);
  }
}
```

#### HTML

```html
<div>
  <div class="message-life-demo">
    <div class="message-actions">
      <button aerisButton type="button" (click)="showTimedMessage()">
        Show timed message
      </button>
    </div>
    <aeris-message
      severity="info"
      text="This message closes after three seconds."
      [life]="3000"
      [(visible)]="timedVisible"
    />
  </div>
</div>
```

#### CSS

```css
.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.message-life-demo {
  display: grid;
  gap: 0.75rem;
}

.message-life-demo {
  display: grid;
  gap: 0.75rem;
}

.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
```

### Dynamic

Render multiple messages from application state and remove individual rows with closable messages.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMessageModule, type AerisMessageSeverity } from '@aeris-ui/core/message';

interface DemoMessage {
  readonly id: number;
  readonly severity: AerisMessageSeverity;
  readonly text: string;
}

@Component({
  selector: 'app-message-dynamic-demo',
  imports: [AerisButton, AerisMessageModule],
  templateUrl: './message-dynamic.demo.html',
  styleUrl: './message-dynamic.demo.scss'
})
export class MessageDynamicDynamicDemo {
  private nextMessageId = 0;
  protected readonly dynamicMessages = signal<readonly DemoMessage[]>([]);

  protected addMessages(): void {
    this.dynamicMessages.set([
      { id: ++this.nextMessageId, severity: 'success', text: 'Profile saved.' },
      { id: ++this.nextMessageId, severity: 'info', text: 'Sync started.' },
      { id: ++this.nextMessageId, severity: 'warning', text: 'Review billing details.' },
    ]);
  }

  protected clearMessages(): void {
    this.dynamicMessages.set([]);
  }

  protected removeMessage(id: number): void {
    this.dynamicMessages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
```

#### HTML

```html
<div>
  <div class="message-stack">
    <div class="message-actions">
      <button aerisButton type="button" (click)="addMessages()">Add messages</button>
      <button aerisButton type="button" (click)="clearMessages()">
        Clear messages
      </button>
    </div>
    @for (message of dynamicMessages(); track message.id) {
      <aeris-message
        [severity]="message.severity"
        [text]="message.text"
        closable
        (closed)="removeMessage(message.id)"
      />
    }
  </div>
</div>
```

#### CSS

```css
.message-stack {
  display: grid;
  gap: 0.75rem;
}

.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.message-stack {
  display: grid;
  gap: 0.75rem;
}

.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
```

### Forms

Place error messages near invalid fields and keep the message text specific to the correction needed.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMessageModule } from '@aeris-ui/core/message';

@Component({
  selector: 'app-message-forms-demo',
  imports: [AerisButton, AerisInputText, AerisMessageModule],
  templateUrl: './message-forms.demo.html',
  styleUrl: './message-forms.demo.scss'
})
export class MessageFormsFormsDemo {
  protected readonly usernameTouched = signal(false);
  protected readonly phoneTouched = signal(false);
  protected readonly username = signal('');
  protected readonly phone = signal('');

  protected readonly formErrors = computed(() => [
    ...(this.usernameTouched() && !this.username().trim()
      ? ['Username is required.']
      : []),
    ...(this.phoneTouched() && !this.phone().trim()
      ? ['Phone number is required.']
      : []),
  ]);

  protected submitForm(): void {
    this.usernameTouched.set(true);
    this.phoneTouched.set(true);
  }
}
```

#### HTML

```html
<div>
  <form class="message-form" (submit)="$event.preventDefault(); submitForm()">
    <label>
      Username
      <input
        aerisInputText
        type="text"
        [value]="username()"
        aria-describedby="form-errors"
        (input)="username.set($any($event.target).value)"
        (blur)="usernameTouched.set(true)"
      />
    </label>
    <label>
      Phone number
      <input
        aerisInputText
        type="tel"
        [value]="phone()"
        aria-describedby="form-errors"
        (input)="phone.set($any($event.target).value)"
        (blur)="phoneTouched.set(true)"
      />
    </label>
    <button aerisButton type="submit">Validate</button>
    <div id="form-errors" class="message-stack" aria-live="polite">
      @for (error of formErrors(); track error) {
        <aeris-message severity="error" variant="outlined" [text]="error" />
      }
    </div>
  </form>
</div>
```

#### CSS

```css
.message-stack {
  display: grid;
  gap: 0.75rem;
}

.message-form {
  width: min(100%, 34rem);
  display: grid;
  gap: 0.9rem;
}

.message-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  font-weight: 700;
}

.message-form input {
  min-height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-surface);
  color: var(--aeris-text);
  font: inherit;
}

.message-form input:focus {
  border-color: var(--aeris-focus);
  outline: 3px solid color-mix(in srgb, var(--aeris-focus) 24%, transparent);
}

.message-form {
  width: min(100%, 34rem);
  display: grid;
  gap: 0.9rem;
}

.message-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 700;
}

.message-form input {
  min-height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.message-form input:focus {
  border-color: var(--focus);
  outline: 3px solid color-mix(in srgb, var(--focus) 24%, transparent);
}

.message-stack {
  display: grid;
  gap: 0.75rem;
}
```

## Accessibility

- Message uses role="status" and aria-live="polite" by default for non-critical feedback.
- Warning and error severities default to role="alert" and aria-live="assertive".
- Every visible message sets aria-atomic="true" so the whole message is announced together.
- Use role and ariaLive to override announcement behavior when the surrounding page already manages announcements.
- The close control is a native button with a configurable accessible label.
- Timed messages should be reserved for low-risk feedback. Use closable persistent messages for important errors.
- Message motion is disabled for users who request reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to the close button and any projected native interactive elements. |
| `Enter / Space` | Activates the focused native button, including the built-in close button. |
| `Escape` | No built-in behavior. Provide an explicit close button or application shortcut when dismissal by keyboard shortcut is required. |
