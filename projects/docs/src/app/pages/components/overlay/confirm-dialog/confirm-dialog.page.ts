import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisConfirmDialogModule,
  AerisConfirmDialogService,
  type AerisConfirmDialogCloseEvent,
  type AerisConfirmDialogSeverity,
} from '@aeris-ui/core/confirm-dialog';
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
  selector: 'app-confirm-dialog-page',
  imports: [
    AerisButton,
    AerisConfirmDialogModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './confirm-dialog.page.html',
  styleUrl: './confirm-dialog.page.scss',
})
export class ConfirmDialogPage {
  private readonly confirmations = inject(AerisConfirmDialogService);

  protected readonly lastResult = signal('No confirmation has completed.');
  protected readonly controlledOpen = signal(false);
  protected readonly controlledResult = signal('Controlled confirmation is closed.');
  protected readonly releaseName = 'Aeris UI 1.0';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'confirm-dialog-basic', label: 'Basic' },
    { id: 'confirm-dialog-severity', label: 'Severity' },
    { id: 'confirm-dialog-positions', label: 'Positions' },
    { id: 'confirm-dialog-controlled', label: 'Controlled' },
    { id: 'confirm-dialog-templates', label: 'Templates' },
    { id: 'confirm-dialog-options', label: 'Options' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'confirm-dialog-api-service', label: 'Service' },
    { id: 'confirm-dialog-api-inputs', label: 'Inputs' },
    { id: 'confirm-dialog-api-models', label: 'Models' },
    { id: 'confirm-dialog-api-outputs', label: 'Outputs' },
    { id: 'confirm-dialog-api-templates', label: 'Templates' },
    { id: 'confirm-dialog-api-methods', label: 'Methods' },
    { id: 'confirm-dialog-api-config', label: 'Config' },
    { id: 'confirm-dialog-api-ref', label: 'Reference' },
  ];

  protected readonly importCode = `import {
  AerisConfirmDialogModule,
  AerisConfirmDialogService,
} from '@aeris-ui/core/confirm-dialog';`;

  protected readonly sharedCssCode = `.demo-actions {
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
}`;

  protected readonly templateCssCode = `.confirm-message {
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

`;

  protected readonly basicTsCode = `import { inject, signal } from '@angular/core';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

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
    this.lastResult.set(\`Closed with \${event.result}.\`);
  });
}`;

  protected readonly severityTsCode = `import { inject, signal } from '@angular/core';
import {
  AerisConfirmDialogService,
  type AerisConfirmDialogSeverity,
} from '@aeris-ui/core/confirm-dialog';

private readonly confirmations = inject(AerisConfirmDialogService);
protected readonly lastResult = signal('No confirmation has completed.');

protected confirmSeverity(severity: AerisConfirmDialogSeverity): void {
  this.confirmations.confirm({
    header: \`\${severity} confirmation\`,
    message: 'Each severity updates the icon, emphasis color, and accept action.',
    severity,
    icon: severity === 'danger' ? 'danger' : severity === 'success' ? 'success' : severity === 'warning' ? 'warning' : 'info',
    acceptLabel: 'Continue',
  }).closed.subscribe((event) => {
    this.lastResult.set(\`\${severity} closed with \${event.result}.\`);
  });
}`;

  protected readonly positionsTsCode = `import { inject } from '@angular/core';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

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
    message: \`This confirmation opened at \${position}.\`,
    position,
    acceptLabel: 'Done',
  });
}`;

  protected readonly controlledTsCode = `import { signal } from '@angular/core';
import { type AerisConfirmDialogCloseEvent } from '@aeris-ui/core/confirm-dialog';

protected readonly controlledOpen = signal(false);
protected readonly controlledResult = signal('Controlled confirmation is closed.');

protected recordControlled(event: AerisConfirmDialogCloseEvent): void {
  this.controlledResult.set(\`Controlled dialog closed with \${event.result}.\`);
}`;

  protected readonly templateTsCode = `import { inject } from '@angular/core';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

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
}`;

  protected readonly optionsTsCode = `import { inject } from '@angular/core';
import { AerisConfirmDialogService } from '@aeris-ui/core/confirm-dialog';

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
}`;

  protected readonly interfacesCode = `type AerisConfirmDialogSeverity =
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
}`;

  protected readonly serviceRows: readonly ApiRow[] = [
    { name: 'confirm(config)', type: 'AerisConfirmDialogConfig => AerisConfirmDialogRef', defaultValue: '-', description: 'Opens a service-created confirmation. When key is provided, opens the matching template host.' },
    { name: 'closeAll()', type: '() => void', defaultValue: '-', description: 'Dismisses active confirmations opened through the service.' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'key', type: 'string', defaultValue: "''", description: 'Matches service requests to a specific template host. Omit it for service-created dialogs.' },
    { name: 'header', type: 'string', defaultValue: "'Confirm action'", description: 'Visible title for declarative usage.' },
    { name: 'message', type: 'string', defaultValue: "''", description: 'Default confirmation message.' },
    { name: 'data', type: 'unknown', defaultValue: 'undefined', description: 'Context data exposed to templates and events.' },
    { name: 'icon', type: 'AerisConfirmDialogIcon', defaultValue: "'question'", description: 'Built-in icon or none.' },
    { name: 'severity', type: 'AerisConfirmDialogSeverity', defaultValue: "'primary'", description: 'Visual intent for icon and accept action.' },
    { name: 'acceptLabel', type: 'string', defaultValue: "'Confirm'", description: 'Accept button text.' },
    { name: 'rejectLabel', type: 'string', defaultValue: "'Cancel'", description: 'Reject button text.' },
    { name: 'acceptVisible', type: 'boolean', defaultValue: 'true', description: 'Renders the accept action.' },
    { name: 'rejectVisible', type: 'boolean', defaultValue: 'true', description: 'Renders the reject action.' },
    { name: 'acceptDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the accept action.' },
    { name: 'rejectDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the reject action.' },
    { name: 'acceptAriaLabel', type: 'string', defaultValue: "''", description: 'Accessible label for the accept action; falls back to acceptLabel.' },
    { name: 'rejectAriaLabel', type: 'string', defaultValue: "''", description: 'Accessible label for the reject action; falls back to rejectLabel.' },
    { name: 'defaultFocus', type: 'AerisConfirmDialogDefaultFocus', defaultValue: "'accept'", description: 'Built-in first focus target.' },
    { name: 'modal', type: 'boolean', defaultValue: 'true', description: 'Enables modal dialog semantics.' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'true', description: 'Shows the modal backdrop.' },
    { name: 'backdropBlur', type: 'boolean', defaultValue: 'true', description: 'Applies the default frosted-glass blur to the backdrop.' },
    { name: 'backdropBlurAmount', type: 'string', defaultValue: "''", description: 'Overrides the backdrop blur radius with a CSS length.' },
    { name: 'dismissibleMask', type: 'boolean', defaultValue: 'false', description: 'Allows clicking the mask to dismiss.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Allows Escape to dismiss.' },
    { name: 'closable', type: 'boolean', defaultValue: 'true', description: 'Shows the header close action.' },
    { name: 'blockScroll', type: 'boolean', defaultValue: 'true', description: 'Locks page scrolling while modal.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Keeps Tab navigation inside the dialog.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the launcher after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus into the dialog after open.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'Custom selector that overrides defaultFocus.' },
    { name: 'position', type: 'AerisDialogPosition', defaultValue: "'center'", description: 'Places the dialog within the viewport.' },
    { name: 'size', type: 'AerisDialogSize', defaultValue: "'sm'", description: 'Dialog width preset.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom dialog width.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum width.' },
    { name: 'mobileWidth', type: 'string', defaultValue: "''", description: 'Narrow viewport width.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close confirmation dialog'", description: 'Accessible label for the close action.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible title labels the dialog.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the dialog.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that describes the confirmation.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'false', description: 'Controls declarative visibility.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'visibleChange', type: 'boolean', defaultValue: '-', description: 'Emitted by the visible model.' },
    { name: 'shown', type: 'AerisConfirmDialogActionEvent', defaultValue: '-', description: 'Emitted after the confirmation opens.' },
    { name: 'accepted', type: 'AerisConfirmDialogActionEvent', defaultValue: '-', description: 'Emitted when the accept action runs.' },
    { name: 'rejected', type: 'AerisConfirmDialogActionEvent', defaultValue: '-', description: 'Emitted when the reject action runs.' },
    { name: 'closed', type: 'AerisConfirmDialogCloseEvent', defaultValue: '-', description: 'Emitted for accept, reject, and dismiss closes.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisConfirmDialogIcon', type: 'AerisConfirmDialogTemplateContext', defaultValue: 'built-in icon', description: 'Custom decorative icon content.' },
    { name: 'aerisConfirmDialogMessage', type: 'AerisConfirmDialogTemplateContext', defaultValue: 'message input', description: 'Custom body message content.' },
    { name: 'aerisConfirmDialogFooter', type: 'AerisConfirmDialogTemplateContext', defaultValue: 'default actions', description: 'Custom footer actions with accept, reject, and close callbacks.' },
    { name: 'aerisConfirmDialogHeadless', type: 'AerisConfirmDialogTemplateContext', defaultValue: '-', description: 'Replaces the built-in confirmation body and footer inside the dialog shell.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'accept(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Runs accept callbacks and closes with accept result.' },
    { name: 'reject(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Runs reject callbacks and closes with reject result.' },
    { name: 'close(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Dismisses the confirmation without accepting or rejecting.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus to the configured initial focus target.' },
    { name: 'openWithConfig(config, ref)', type: '(ResolvedConfig, AerisConfirmDialogRef) => void', defaultValue: '-', description: 'Opens a resolved configuration for a service-created host.' },
  ];

  protected readonly configRows: readonly ApiRow[] = [
    ...this.inputs,
    { name: 'accept', type: '(AerisConfirmDialogActionEvent) => void', defaultValue: '-', description: 'Callback invoked before an accepted confirmation closes.' },
    { name: 'reject', type: '(AerisConfirmDialogActionEvent) => void', defaultValue: '-', description: 'Callback invoked before a rejected confirmation closes.' },
  ];

  protected readonly refRows: readonly ApiRow[] = [
    { name: 'accept(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Accepts the confirmation programmatically.' },
    { name: 'reject(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Rejects the confirmation programmatically.' },
    { name: 'close(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Dismisses the confirmation programmatically.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus into the active confirmation.' },
    { name: 'accepted', type: 'Subscribable<AerisConfirmDialogActionEvent>', defaultValue: '-', description: 'Subscribe to accept actions.' },
    { name: 'rejected', type: 'Subscribable<AerisConfirmDialogActionEvent>', defaultValue: '-', description: 'Subscribe to reject actions.' },
    { name: 'closed', type: 'Subscribable<AerisConfirmDialogCloseEvent>', defaultValue: '-', description: 'Subscribe to the final close result.' },
    { name: 'shown', type: 'Subscribable<AerisConfirmDialogActionEvent>', defaultValue: '-', description: 'Subscribe after the dialog opens.' },
  ];

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

  protected confirmSeverity(severity: AerisConfirmDialogSeverity): void {
    this.confirmations.confirm({
      header: `${severity} confirmation`,
      message: 'Each severity updates the icon, emphasis color, and accept action.',
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
    }).closed.subscribe((event) => {
      this.lastResult.set(`${severity} closed with ${event.result}.`);
    });
  }

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

  protected confirmRelease(): void {
    this.confirmations.confirm({
      key: 'release-template',
      header: 'Release build?',
      data: this.releaseName,
      severity: 'warning',
      icon: 'none',
    });
  }

  protected recordControlled(event: AerisConfirmDialogCloseEvent): void {
    this.controlledResult.set(`Controlled dialog closed with ${event.result}.`);
  }

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
