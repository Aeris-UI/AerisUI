import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisToastModule,
  AerisToastService,
  type AerisToastCloseEvent,
  type AerisToastMessage,
  type AerisToastPosition,
} from '@aeris-ui/core/toast';
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
  selector: 'app-toast-page',
  imports: [
    AerisTabsModule,
    AerisButton,
    AerisToastModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './toast.page.html',
  styleUrl: './toast.page.scss',
})
export class ToastPage {
  private readonly toast = inject(AerisToastService);
  protected readonly currentPosition = signal<AerisToastPosition>('top-right');
  protected readonly lastClosed = signal('No toast has closed yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'toast-basic', label: 'Basic' },
    { id: 'toast-severity', label: 'Severity' },
    { id: 'toast-sticky', label: 'Sticky and clear' },
    { id: 'toast-custom', label: 'Custom content' },
    { id: 'toast-stacked', label: 'Stacked preview' },
    { id: 'toast-positions', label: 'Positions' },
    { id: 'toast-expanded', label: 'Expanded stack' },
    { id: 'toast-loading', label: 'Loading pattern' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'toast-api-component', label: 'Component' },
    { id: 'toast-api-service', label: 'Service' },
    { id: 'toast-api-templates', label: 'Templates' },
    { id: 'toast-api-outputs', label: 'Outputs' },
  ];

  protected readonly importCode = `import {
  AerisToastModule,
  AerisToastService,
} from '@aeris-ui/core/toast';`;

  protected readonly actionsCssCode = `.toast-example-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}`;

  protected readonly customActionsCssCode = `.toast-example-content {
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
}`;

  protected readonly basicTsCode = `import { inject } from '@angular/core';
import { AerisToastService } from '@aeris-ui/core/toast';

private readonly toast = inject(AerisToastService);

protected showBasicToast(): void {
  this.toast.show({
    group: 'basic',
    severity: 'info',
    summary: 'Workspace saved',
    detail: 'Your notification preferences were updated.',
  });
}`;

  protected readonly severityTsCode = `import { inject } from '@angular/core';
import { AerisToastService } from '@aeris-ui/core/toast';

private readonly toast = inject(AerisToastService);

protected showSeverityToasts(): void {
  this.toast.showAll([
    { group: 'severity', severity: 'success', summary: 'Published', detail: 'The release notes are live.' },
    { group: 'severity', severity: 'info', summary: 'Sync running', detail: 'Assets are being checked.' },
    { group: 'severity', severity: 'warning', summary: 'Review needed', detail: 'One token changed contrast.' },
    { group: 'severity', severity: 'error', summary: 'Build failed', detail: 'Fix the failing test before release.' },
  ]);
}`;

  protected readonly stickyTsCode = `import { inject, signal } from '@angular/core';
import { AerisToastService, type AerisToastCloseEvent } from '@aeris-ui/core/toast';

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
  this.lastClosed.set(\`\${event.message.summary} closed by \${event.reason}.\`);
}`;

  protected readonly customTsCode = `import { inject } from '@angular/core';
import { AerisToastService, type AerisToastMessage } from '@aeris-ui/core/toast';

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
}`;

  protected readonly positionsTsCode = `import { inject, signal } from '@angular/core';
import { AerisToastService, type AerisToastPosition } from '@aeris-ui/core/toast';

private readonly toast = inject(AerisToastService);
protected readonly currentPosition = signal<AerisToastPosition>('top-right');

protected showAt(position: AerisToastPosition): void {
  this.currentPosition.set(position);
  this.toast.show({
    group: 'position',
    severity: 'neutral',
    summary: 'Position changed',
    detail: \`This toast is rendered at \${position}.\`,
  });
}`;

  protected readonly stackedTsCode = `import { inject } from '@angular/core';
import { AerisToastService } from '@aeris-ui/core/toast';

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
}`;

  protected readonly expandedTsCode = `import { inject } from '@angular/core';
import { AerisToastService } from '@aeris-ui/core/toast';

private readonly toast = inject(AerisToastService);

protected showExpandedStack(): void {
  this.toast.showAll([
    { group: 'expanded', severity: 'success', summary: 'Step 1 complete', detail: 'Schema validation passed.' },
    { group: 'expanded', severity: 'info', summary: 'Step 2 running', detail: 'Preview assets are uploading.' },
    { group: 'expanded', severity: 'warning', summary: 'Step 3 queued', detail: 'A reviewer must approve deployment.' },
    { group: 'expanded', severity: 'neutral', summary: 'Step 4 waiting', detail: 'Release notes are being generated.' },
    { group: 'expanded', severity: 'error', summary: 'Step 5 blocked', detail: 'A required owner is missing.' },
  ]);
}`;

  protected readonly loadingTsCode = `import { inject } from '@angular/core';
import { AerisToastService } from '@aeris-ui/core/toast';

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
}`;

  protected readonly interfacesCode = `type AerisToastPosition =
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
}`;

  protected readonly componentInputs: readonly ApiRow[] = [
    { name: 'position', type: 'AerisToastPosition', defaultValue: "'top-right'", description: 'Places the toast region on the viewport.' },
    { name: 'group', type: 'string', defaultValue: "''", description: 'Renders only messages from the matching service group.' },
    { name: 'mode', type: 'AerisToastMode', defaultValue: "'stacked'", description: 'Uses a compact stack that expands on hover/focus or an always-expanded list.' },
    { name: 'visibleCount', type: 'number', defaultValue: '4', description: 'Controls how many messages are rendered in stacked and expanded modes.' },
    { name: 'limit', type: 'number | undefined', defaultValue: 'undefined', description: 'Compatibility alias that overrides visibleCount when provided.' },
    { name: 'newestOnTop', type: 'boolean', defaultValue: 'true', description: 'Shows the newest message as the primary toast. Set false to keep the oldest message on top.' },
    { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: 'Pauses auto-dismiss timers while the toast region is hovered or focused.' },
    { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Shows close buttons for closable messages.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Notifications'", description: 'Accessible name for the toast region.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close notification'", description: 'Accessible label for each close button.' },
  ];

  protected readonly componentOutputs: readonly ApiRow[] = [
    { name: 'closed', type: 'AerisToastCloseEvent', defaultValue: '-', description: 'Emits when a message rendered by this Toast closes by timeout, button, API, or clear.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisToastContent', type: 'TemplateRef<AerisToastTemplateContext>', defaultValue: '-', description: 'Replaces default summary/detail content for each rendered message.' },
    { name: 'aerisToastIcon', type: 'TemplateRef<AerisToastTemplateContext>', defaultValue: '-', description: 'Replaces the built-in severity icon for each rendered message.' },
  ];

  protected readonly serviceMethods: readonly ApiRow[] = [
    { name: 'show(message)', type: 'AerisToastMessage', defaultValue: '-', description: 'Adds or replaces one message and starts its timer when it is not sticky.' },
    { name: 'showAll(messages)', type: 'readonly AerisToastMessage[]', defaultValue: '-', description: 'Adds multiple messages in order.' },
    { name: 'remove(id, reason)', type: 'void', defaultValue: "reason: 'api'", description: 'Removes one message and emits a close event.' },
    { name: 'clear(group)', type: 'void', defaultValue: "group: ''", description: 'Removes all messages in one group.' },
    { name: 'clearAll()', type: 'void', defaultValue: '-', description: 'Removes every active message from every group.' },
    { name: 'pause(id)', type: 'void', defaultValue: '-', description: 'Pauses a message auto-dismiss timer.' },
    { name: 'resume(id)', type: 'void', defaultValue: '-', description: 'Resumes a paused message auto-dismiss timer.' },
  ];

  protected readonly serviceProperties: readonly ApiRow[] = [
    { name: 'messages', type: 'Signal<readonly AerisToastMessage[]>', defaultValue: '[]', description: 'Readonly signal containing the active queue.' },
    { name: 'closed', type: 'AerisToastSubscribable<AerisToastCloseEvent>', defaultValue: '-', description: 'Subscribable close event stream for service-level coordination.' },
  ];

  protected showBasicToast(): void {
    this.toast.show({
      group: 'basic',
      severity: 'info',
      summary: 'Workspace saved',
      detail: 'Your notification preferences were updated.',
    });
  }

  protected showSeverityToasts(): void {
    this.toast.showAll([
      { group: 'severity', severity: 'success', summary: 'Published', detail: 'The release notes are live.' },
      { group: 'severity', severity: 'info', summary: 'Sync running', detail: 'Assets are being checked.' },
      { group: 'severity', severity: 'warning', summary: 'Review needed', detail: 'One token changed contrast.' },
      { group: 'severity', severity: 'error', summary: 'Build failed', detail: 'Fix the failing test before release.' },
    ]);
  }

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

  protected showAt(position: AerisToastPosition): void {
    this.currentPosition.set(position);
    this.toast.show({
      group: 'position',
      severity: 'neutral',
      summary: 'Position changed',
      detail: `This toast is rendered at ${position}.`,
    });
  }

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

  protected showExpandedStack(): void {
    this.toast.showAll([
      { group: 'expanded', severity: 'success', summary: 'Step 1 complete', detail: 'Schema validation passed.' },
      { group: 'expanded', severity: 'info', summary: 'Step 2 running', detail: 'Preview assets are uploading.' },
      { group: 'expanded', severity: 'warning', summary: 'Step 3 queued', detail: 'A reviewer must approve deployment.' },
      { group: 'expanded', severity: 'neutral', summary: 'Step 4 waiting', detail: 'Release notes are being generated.' },
      { group: 'expanded', severity: 'error', summary: 'Step 5 blocked', detail: 'A required owner is missing.' },
    ]);
  }

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
