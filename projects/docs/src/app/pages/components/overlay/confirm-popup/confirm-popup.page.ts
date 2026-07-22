import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisConfirmPopupModule,
  AerisConfirmPopupService,
  type AerisConfirmPopupCloseEvent,
  type AerisConfirmPopupPlacement,
  type AerisConfirmPopupSeverity,
} from '@aeris-ui/core/confirm-popup';
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

@Component({
  selector: 'app-confirm-popup-page',
  imports: [
    AerisButton,
    AerisConfirmPopupModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './confirm-popup.page.html',
  styleUrl: './confirm-popup.page.scss',
})
export class ConfirmPopupPage {
  private readonly confirmations = inject(AerisConfirmPopupService);

  protected readonly lastResult = signal('No popup has completed.');
  protected readonly controlledOpen = signal(false);
  protected readonly controlledTarget = signal<EventTarget | null>(null);
  protected readonly controlledResult = signal('Controlled popup is closed.');
  protected readonly releaseName = 'Aeris UI 1.0';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'confirm-popup-basic', label: 'Basic' },
    { id: 'confirm-popup-severity', label: 'Severity' },
    { id: 'confirm-popup-placement', label: 'Placement' },
    { id: 'confirm-popup-controlled', label: 'Controlled' },
    { id: 'confirm-popup-templates', label: 'Templates' },
    { id: 'confirm-popup-headless', label: 'Headless' },
    { id: 'confirm-popup-options', label: 'Options' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'confirm-popup-api-service', label: 'Service' },
    { id: 'confirm-popup-api-inputs', label: 'Inputs' },
    { id: 'confirm-popup-api-models', label: 'Models' },
    { id: 'confirm-popup-api-outputs', label: 'Outputs' },
    { id: 'confirm-popup-api-templates', label: 'Templates' },
    { id: 'confirm-popup-api-methods', label: 'Methods' },
    { id: 'confirm-popup-api-config', label: 'Config' },
    { id: 'confirm-popup-api-ref', label: 'Reference' },
  ];

  protected readonly importCode = `import {
  AerisConfirmPopupModule,
  AerisConfirmPopupService,
} from '@aeris-ui/core/confirm-popup';`;

  protected readonly sharedCssCode = `.demo-actions {
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
}`;

  protected readonly templateCssCode = `.confirm-popup-message {
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

`;

  protected readonly headlessCssCode = `.headless-popup {
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

`;

  protected readonly basicTsCode = `import { inject, signal } from '@angular/core';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

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
    this.lastResult.set(\`Closed with \${close.result}.\`);
  });
}`;

  protected readonly severityTsCode = `import { inject, signal } from '@angular/core';
import {
  AerisConfirmPopupService,
  type AerisConfirmPopupSeverity,
} from '@aeris-ui/core/confirm-popup';

private readonly confirmations = inject(AerisConfirmPopupService);
protected readonly lastResult = signal('No popup has completed.');

protected confirmSeverity(event: MouseEvent, severity: AerisConfirmPopupSeverity): void {
  this.confirmations.confirm({
    target: event,
    header: \`\${severity} confirmation\`,
    message: 'Severity updates the icon, emphasis color, and accept action.',
    severity,
    icon: severity === 'danger' ? 'danger' : severity === 'success' ? 'success' : severity === 'warning' ? 'warning' : 'info',
    acceptLabel: 'Continue',
  }).closed.subscribe((close) => {
    this.lastResult.set(\`\${severity} closed with \${close.result}.\`);
  });
}`;

  protected readonly placementTsCode = `import { inject } from '@angular/core';
import {
  AerisConfirmPopupService,
  type AerisConfirmPopupPlacement,
} from '@aeris-ui/core/confirm-popup';

private readonly confirmations = inject(AerisConfirmPopupService);

protected confirmAt(event: MouseEvent, placement: AerisConfirmPopupPlacement): void {
  this.confirmations.confirm({
    target: event,
    header: 'Confirm placement',
    message: \`This popup opened with \${placement} placement.\`,
    placement,
    acceptLabel: 'Done',
  });
}`;

  protected readonly controlledTsCode = `import { signal } from '@angular/core';
import { type AerisConfirmPopupCloseEvent } from '@aeris-ui/core/confirm-popup';

protected readonly controlledOpen = signal(false);
protected readonly controlledTarget = signal<EventTarget | null>(null);
protected readonly controlledResult = signal('Controlled popup is closed.');

protected openControlled(event: Event): void {
  this.controlledTarget.set(event.currentTarget);
  this.controlledOpen.set(true);
}

protected recordControlled(event: AerisConfirmPopupCloseEvent): void {
  this.controlledResult.set(\`Controlled popup closed with \${event.result}.\`);
}`;

  protected readonly templateTsCode = `import { inject } from '@angular/core';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

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
}`;

  protected readonly headlessTsCode = `import { inject } from '@angular/core';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

private readonly confirmations = inject(AerisConfirmPopupService);

protected confirmHeadless(event: MouseEvent): void {
  this.confirmations.confirm({
    key: 'headless-popup',
    target: event,
    header: 'Deploy build?',
    message: 'Headless content replaces the default popup chrome.',
  });
}`;

  protected readonly optionsTsCode = `import { inject } from '@angular/core';
import { AerisConfirmPopupService } from '@aeris-ui/core/confirm-popup';

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
}`;

  protected readonly interfacesCode = `type AerisConfirmPopupSeverity =
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
}`;

  protected readonly serviceRows: readonly ApiRow[] = [
    { name: 'confirm(config)', type: 'AerisConfirmPopupConfig => AerisConfirmPopupRef', defaultValue: '-', description: 'Opens a target-relative confirmation popup.' },
    { name: 'closeAll()', type: '() => void', defaultValue: '-', description: 'Dismisses active popups opened through the service.' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'key', type: 'string', defaultValue: "''", description: 'Matches service requests to a template host.' },
    { name: 'target', type: 'AerisConfirmPopupTarget', defaultValue: 'required', description: 'Element or trigger event used for positioning and trigger ARIA state.' },
    { name: 'header', type: 'string', defaultValue: "'Confirm action'", description: 'Visible popup title.' },
    { name: 'message', type: 'string', defaultValue: "''", description: 'Default confirmation message.' },
    { name: 'data', type: 'unknown', defaultValue: 'undefined', description: 'Context data exposed to templates and events.' },
    { name: 'icon', type: 'AerisConfirmPopupIcon', defaultValue: "'question'", description: 'Built-in icon or none.' },
    { name: 'severity', type: 'AerisConfirmPopupSeverity', defaultValue: "'primary'", description: 'Visual intent for icon and accept action.' },
    { name: 'acceptLabel', type: 'string', defaultValue: "'Confirm'", description: 'Accept button text.' },
    { name: 'rejectLabel', type: 'string', defaultValue: "'Cancel'", description: 'Reject button text.' },
    { name: 'acceptVisible', type: 'boolean', defaultValue: 'true', description: 'Renders the accept action.' },
    { name: 'rejectVisible', type: 'boolean', defaultValue: 'true', description: 'Renders the reject action.' },
    { name: 'acceptDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the accept action.' },
    { name: 'rejectDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the reject action.' },
    { name: 'acceptAriaLabel', type: 'string', defaultValue: "''", description: 'Accessible label for the accept action; falls back to acceptLabel.' },
    { name: 'rejectAriaLabel', type: 'string', defaultValue: "''", description: 'Accessible label for the reject action; falls back to rejectLabel.' },
    { name: 'defaultFocus', type: 'AerisConfirmPopupDefaultFocus', defaultValue: "'accept'", description: 'Built-in first focus target.' },
    { name: 'placement', type: 'AerisConfirmPopupPlacement', defaultValue: "'auto'", description: 'Preferred placement around the target.' },
    { name: 'alignment', type: 'AerisConfirmPopupAlignment', defaultValue: "'center'", description: 'Alignment along the target edge.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom popup width.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum popup width.' },
    { name: 'offset', type: 'number', defaultValue: '10', description: 'Distance between target and popup in pixels.' },
    { name: 'viewportMargin', type: 'number', defaultValue: '8', description: 'Minimum viewport edge gap in pixels.' },
    { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Allows outside pointerdown to dismiss.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Allows Escape to dismiss.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Keeps Tab navigation inside the popup.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the trigger after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus into the popup after open.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'Custom selector that overrides defaultFocus.' },
    { name: 'showArrow', type: 'boolean', defaultValue: 'true', description: 'Shows the pointer arrow.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible title labels the popup.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the popup.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that describes the confirmation.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'false', description: 'Controls declarative visibility.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'visibleChange', type: 'boolean', defaultValue: '-', description: 'Emitted by the visible model.' },
    { name: 'shown', type: 'AerisConfirmPopupActionEvent', defaultValue: '-', description: 'Emitted after the popup opens.' },
    { name: 'accepted', type: 'AerisConfirmPopupActionEvent', defaultValue: '-', description: 'Emitted when the accept action runs.' },
    { name: 'rejected', type: 'AerisConfirmPopupActionEvent', defaultValue: '-', description: 'Emitted when the reject action runs.' },
    { name: 'closed', type: 'AerisConfirmPopupCloseEvent', defaultValue: '-', description: 'Emitted for accept, reject, and dismiss closes.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisConfirmPopupIcon', type: 'AerisConfirmPopupTemplateContext', defaultValue: 'built-in icon', description: 'Custom decorative icon content.' },
    { name: 'aerisConfirmPopupMessage', type: 'AerisConfirmPopupTemplateContext', defaultValue: 'message input', description: 'Custom body message content.' },
    { name: 'aerisConfirmPopupFooter', type: 'AerisConfirmPopupTemplateContext', defaultValue: 'default actions', description: 'Custom footer actions with accept, reject, and close callbacks.' },
    { name: 'aerisConfirmPopupHeadless', type: 'AerisConfirmPopupTemplateContext', defaultValue: '-', description: 'Replaces all built-in popup UI while preserving popup behavior.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'accept(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Runs accept callbacks and closes with accept result.' },
    { name: 'reject(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Runs reject callbacks and closes with reject result.' },
    { name: 'close(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Dismisses the popup without accepting or rejecting.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus to the configured initial focus target.' },
    { name: 'reposition()', type: '() => void', defaultValue: '-', description: 'Recalculates target-relative popup position.' },
    { name: 'openWithConfig(config, ref)', type: '(ResolvedConfig, AerisConfirmPopupRef) => void', defaultValue: '-', description: 'Opens a resolved configuration for a service-created host.' },
  ];

  protected readonly configRows: readonly ApiRow[] = [
    ...this.inputs,
    { name: 'accept', type: '(AerisConfirmPopupActionEvent) => void', defaultValue: '-', description: 'Callback invoked before an accepted popup closes.' },
    { name: 'reject', type: '(AerisConfirmPopupActionEvent) => void', defaultValue: '-', description: 'Callback invoked before a rejected popup closes.' },
  ];

  protected readonly refRows: readonly ApiRow[] = [
    { name: 'accept(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Accepts the popup programmatically.' },
    { name: 'reject(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Rejects the popup programmatically.' },
    { name: 'close(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Dismisses the popup programmatically.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus into the active popup.' },
    { name: 'reposition()', type: '() => void', defaultValue: '-', description: 'Recalculates the active popup position.' },
    { name: 'accepted', type: 'Subscribable<AerisConfirmPopupActionEvent>', defaultValue: '-', description: 'Subscribe to accept actions.' },
    { name: 'rejected', type: 'Subscribable<AerisConfirmPopupActionEvent>', defaultValue: '-', description: 'Subscribe to reject actions.' },
    { name: 'closed', type: 'Subscribable<AerisConfirmPopupCloseEvent>', defaultValue: '-', description: 'Subscribe to the final close result.' },
    { name: 'shown', type: 'Subscribable<AerisConfirmPopupActionEvent>', defaultValue: '-', description: 'Subscribe after the popup opens.' },
  ];

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

  protected confirmSeverity(event: MouseEvent, severity: AerisConfirmPopupSeverity): void {
    this.confirmations.confirm({
      target: event,
      header: `${severity} confirmation`,
      message: 'Severity updates the icon, emphasis color, and accept action.',
      severity,
      icon:
        severity === 'danger'
          ? 'danger'
          : severity === 'success'
            ? 'success'
            : severity === 'warning'
              ? 'warning'
              : 'info',
      acceptLabel: 'Continue',
    }).closed.subscribe((close) => {
      this.lastResult.set(`${severity} closed with ${close.result}.`);
    });
  }

  protected confirmAt(event: MouseEvent, placement: AerisConfirmPopupPlacement): void {
    this.confirmations.confirm({
      target: event,
      header: 'Confirm placement',
      message: `This popup opened with ${placement} placement.`,
      placement,
      acceptLabel: 'Done',
    });
  }

  protected openControlled(event: Event): void {
    this.controlledTarget.set(event.currentTarget);
    this.controlledOpen.set(true);
  }

  protected recordControlled(event: AerisConfirmPopupCloseEvent): void {
    this.controlledResult.set(`Controlled popup closed with ${event.result}.`);
  }

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

  protected confirmHeadless(event: MouseEvent): void {
    this.confirmations.confirm({
      key: 'headless-popup',
      target: event,
      header: 'Deploy build?',
      message: 'Headless content replaces the default popup chrome.',
    });
  }

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
