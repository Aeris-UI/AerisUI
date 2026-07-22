import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import {
  AerisMessageModule,
  type AerisMessageCloseEvent,
  type AerisMessageSeverity,
} from '@aeris-ui/core/message';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface DemoMessage {
  readonly id: number;
  readonly severity: AerisMessageSeverity;
  readonly text: string;
}

@Component({
  selector: 'app-message-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisMessageModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './message.page.html',
  styleUrl: './message.page.scss',
})
export class MessagePage {
  private nextMessageId = 0;
  protected readonly timedVisible = signal(false);
  protected readonly closeStatus = signal('Message is visible.');
  protected readonly dynamicMessages = signal<readonly DemoMessage[]>([]);
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

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'message-basic', label: 'Basic' },
    { id: 'message-severity', label: 'Severity' },
    { id: 'message-variants', label: 'Variants' },
    { id: 'message-sizes', label: 'Sizes' },
    { id: 'message-icons', label: 'Icons' },
    { id: 'message-closable', label: 'Closable' },
    { id: 'message-life', label: 'Life' },
    { id: 'message-dynamic', label: 'Dynamic' },
    { id: 'message-forms', label: 'Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'message-api-inputs', label: 'Inputs' },
    { id: 'message-api-models', label: 'Models' },
    { id: 'message-api-outputs', label: 'Outputs' },
    { id: 'message-api-templates', label: 'Templates' },
    { id: 'message-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisMessageModule } from '@aeris-ui/core/message';`;

  protected readonly stackCssCode = `.message-stack {
  display: grid;
  gap: 0.75rem;
}`;

  protected readonly inlineCssCode = `.message-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}`;

  protected readonly controlsCssCode = `.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

`;

  protected readonly lifeCssCode = `.message-life-demo {
  display: grid;
  gap: 0.75rem;
}

${this.controlsCssCode}`;

  protected readonly customIconCssCode = `.message-custom-icon {
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
}`;

  protected readonly statusCssCode = `.message-status {
  margin: 0;
  color: var(--text-2);
  font-size: 0.875rem;
}`;

  protected readonly formCssCode = `.message-form {
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
}`;

  protected readonly closableTsCode = `import { signal } from '@angular/core';
import { type AerisMessageCloseEvent } from '@aeris-ui/core/message';

protected readonly closeStatus = signal('Message is visible.');

protected recordClose(event: AerisMessageCloseEvent): void {
  this.closeStatus.set(\`Message closed by \${event.reason}.\`);
}`;

  protected readonly lifeTsCode = `import { signal } from '@angular/core';

protected readonly timedVisible = signal(false);

protected showTimedMessage(): void {
  this.timedVisible.set(true);
}`;

  protected readonly dynamicTsCode = `import { signal } from '@angular/core';
import { type AerisMessageSeverity } from '@aeris-ui/core/message';

interface DemoMessage {
  readonly id: number;
  readonly severity: AerisMessageSeverity;
  readonly text: string;
}

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
}`;

  protected readonly formTsCode = `import { computed, signal } from '@angular/core';

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
}`;

  protected readonly interfacesCode = `type AerisMessageSeverity =
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
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Sets the host element id.' },
    { name: 'severity', type: 'AerisMessageSeverity', defaultValue: "'info'", description: 'Sets visual tone and default live-region behavior.' },
    { name: 'variant', type: 'AerisMessageVariant', defaultValue: "'filled'", description: 'Sets filled, outlined, or simple presentation.' },
    { name: 'size', type: 'AerisMessageSize', defaultValue: "'md'", description: 'Sets compact, default, or large spacing and type scale.' },
    { name: 'text', type: 'string', defaultValue: "''", description: 'Renders plain message text when no content template is provided.' },
    { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Shows a native close button.' },
    { name: 'life', type: 'number', defaultValue: '0', description: 'Auto-closes the message after the provided number of milliseconds. Zero disables auto-close.' },
    { name: 'showIcon', type: 'boolean', defaultValue: 'true', description: 'Shows or hides the severity icon region.' },
    { name: 'role', type: "AerisMessageRole | ''", defaultValue: "''", description: 'Overrides the default alert/status role.' },
    { name: 'ariaLive', type: "AerisMessageLive | ''", defaultValue: "''", description: 'Overrides the default live-region politeness.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the message when visible text is not enough.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that names the message.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close message'", description: 'Accessible label for the close button.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'true', description: 'Controls whether the message is rendered.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'closed', type: 'AerisMessageCloseEvent', defaultValue: '-', description: 'Emits when close button, timeout, or API closes the message.' },
    { name: 'visibilityChanged', type: 'boolean', defaultValue: '-', description: 'Emits after show or close changes visible state.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisMessageIcon', type: 'TemplateRef<AerisMessageTemplateContext>', defaultValue: '-', description: 'Replaces the built-in severity icon.' },
    { name: 'aerisMessageContent', type: 'TemplateRef<AerisMessageTemplateContext>', defaultValue: '-', description: 'Replaces text/default projected content and receives close context.' },
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Projected content rendered when text and aerisMessageContent are not provided.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'close(originalEvent, reason)', type: 'void', defaultValue: "reason: 'api'", description: 'Closes the message and emits closed/visibility events.' },
    { name: 'show()', type: 'void', defaultValue: '-', description: 'Shows the message and emits visibilityChanged when it was hidden.' },
    { name: 'hide()', type: 'void', defaultValue: '-', description: 'Closes the message with the api reason.' },
  ];

  protected recordClose(event: AerisMessageCloseEvent): void {
    this.closeStatus.set(`Message closed by ${event.reason}.`);
  }

  protected showTimedMessage(): void {
    this.timedVisible.set(true);
  }

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

  protected submitForm(): void {
    this.usernameTouched.set(true);
    this.phoneTouched.set(true);
  }
}
