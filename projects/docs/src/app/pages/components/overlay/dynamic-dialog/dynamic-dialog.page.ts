import { Component, inject, input, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AERIS_DYNAMIC_DIALOG_CONFIG,
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
  type AerisDynamicDialogCloseEvent,
  type AerisDynamicDialogResolvedConfig,
} from '@aeris-ui/core/dynamic-dialog';
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

interface ReleaseDialogData {
  readonly version: string;
  readonly tasks: readonly string[];
}

interface ReleaseDialogResult {
  readonly confirmed: boolean;
  readonly owner: string;
}

@Component({
  selector: 'app-basic-audit-dialog-content',
  imports: [AerisButton],
  template: `
    <div class="dynamic-dialog-content">
      <p>Review generated accessibility notes before publishing.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton id="audit-close" type="button" (click)="close()">Close audit</button>
      </div>
    </div>
  `,
  styles: `
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  `,
})
class BasicAuditDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('audit closed');
  }
}

@Component({
  selector: 'app-release-dialog-content',
  imports: [AerisButton],
  template: `
    <div class="dynamic-dialog-content">
      <p>Version {{ data.version }} is ready for release review.</p>
      <ul>
        @for (task of data.tasks; track task) {
          <li>{{ task }}</li>
        }
      </ul>
      <p class="dynamic-dialog-note">Owner: {{ owner() }}</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton type="button" (click)="cancel()">Cancel</button>
        <button aerisButton id="release-confirm" type="button" (click)="confirm()">Confirm release</button>
      </div>
    </div>
  `,
  styles: `
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-content ul { margin: 0; padding-inline-start: 1.2rem; }
    .dynamic-dialog-note { color: var(--aeris-text-3); font-size: 0.8125rem; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
  `,
})
class ReleaseDialogContent {
  readonly owner = input('Design systems');
  private readonly ref = inject<AerisDynamicDialogRef<ReleaseDialogResult>>(
    AerisDynamicDialogRef,
  );
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as ReleaseDialogData;

  protected confirm(): void {
    this.ref.close({ confirmed: true, owner: this.owner() });
  }

  protected cancel(): void {
    this.ref.close({ confirmed: false, owner: this.owner() });
  }
}

@Component({
  selector: 'app-audit-dialog-content',
  imports: [AerisButton],
  template: `
    <div class="dynamic-dialog-content">
      <p>{{ data.scope }} audit uses {{ config.size }} sizing and starts focus on the action button.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton id="audit-close" type="button" (click)="close()">Close audit</button>
      </div>
    </div>
  `,
  styles: `
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  `,
})
class AuditDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as { readonly scope: string };
  protected readonly config = inject(
    AERIS_DYNAMIC_DIALOG_CONFIG,
  ) as AerisDynamicDialogResolvedConfig<{ readonly scope: string }>;

  protected close(): void {
    this.ref.close('audit closed');
  }
}

@Component({
  selector: 'app-manage-dialog-content',
  imports: [AerisButton],
  template: `
    <div class="dynamic-dialog-content">
      <p>Each dynamic dialog receives its own reference and can close itself from the content.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton type="button" (click)="close()">Close this dialog</button>
      </div>
    </div>
  `,
  styles: `
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  `,
})
class ManageDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('closed');
  }
}

@Component({
  selector: 'app-dynamic-dialog-page',
  imports: [
    AerisButton,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './dynamic-dialog.page.html',
  styleUrl: './dynamic-dialog.page.scss',
})
export class DynamicDialogPage {
  private readonly dialogService = inject(AerisDynamicDialogService);

  protected readonly lastResult = signal('No dynamic dialog result yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'dynamic-dialog-basic', label: 'Basic' },
    { id: 'dynamic-dialog-data', label: 'Data and inputs' },
    { id: 'dynamic-dialog-result', label: 'Close result' },
    { id: 'dynamic-dialog-options', label: 'Dialog options' },
    { id: 'dynamic-dialog-manage', label: 'Manage refs' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'dynamic-dialog-api-service', label: 'Service' },
    { id: 'dynamic-dialog-api-config', label: 'Config' },
    { id: 'dynamic-dialog-api-ref', label: 'Reference' },
    { id: 'dynamic-dialog-api-tokens', label: 'Injection tokens' },
  ];

  protected readonly importCode = `import {
  AERIS_DYNAMIC_DIALOG_CONFIG,
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
} from '@aeris-ui/core/dynamic-dialog';`;

  protected readonly triggerCssCode = `.dynamic-dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dynamic-dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly basicTsCode = `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
} from '@aeris-ui/core/dynamic-dialog';

@Component({
  selector: 'app-audit-dialog-content',
  imports: [AerisButton],
  template: \`
    <div class="dynamic-dialog-content">
      <p>Review generated accessibility notes before publishing.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton id="audit-close" type="button" (click)="close()">Close audit</button>
      </div>
    </div>
  \`,
  styles: \`
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  \`,
})
class AuditDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('audit closed');
  }
}

private readonly dialogService = inject(AerisDynamicDialogService);

protected openAuditDialog(): void {
  this.dialogService.open<AuditDialogContent, unknown, string>(AuditDialogContent, {
    header: 'Accessibility audit',
    initialFocus: '#audit-close',
    width: '32rem',
  });
}`;

  protected readonly dataTsCode = `import { Component, inject, input } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
} from '@aeris-ui/core/dynamic-dialog';

interface ReleaseDialogData {
  readonly version: string;
  readonly tasks: readonly string[];
}

interface ReleaseDialogResult {
  readonly confirmed: boolean;
  readonly owner: string;
}

@Component({
  selector: 'app-release-dialog-content',
  imports: [AerisButton],
  template: \`
    <div class="dynamic-dialog-content">
      <p>Version {{ data.version }} is ready for release review.</p>
      <ul>
        @for (task of data.tasks; track task) {
          <li>{{ task }}</li>
        }
      </ul>
      <p class="dynamic-dialog-note">Owner: {{ owner() }}</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton type="button" (click)="cancel()">Cancel</button>
        <button aerisButton id="release-confirm" type="button" (click)="confirm()">Confirm release</button>
      </div>
    </div>
  \`,
  styles: \`
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-content ul { margin: 0; padding-inline-start: 1.2rem; }
    .dynamic-dialog-note { color: var(--aeris-text-3); font-size: 0.8125rem; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
  \`,
})
class ReleaseDialogContent {
  readonly owner = input('Design systems');
  private readonly ref = inject<AerisDynamicDialogRef<ReleaseDialogResult>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as ReleaseDialogData;

  protected confirm(): void {
    this.ref.close({ confirmed: true, owner: this.owner() });
  }

  protected cancel(): void {
    this.ref.close({ confirmed: false, owner: this.owner() });
  }
}

private readonly dialogService = inject(AerisDynamicDialogService);

protected openReleaseDialog(): void {
  this.dialogService.open<ReleaseDialogContent, ReleaseDialogData, ReleaseDialogResult>(
    ReleaseDialogContent,
    {
      header: 'Release review',
      data: {
        version: '4.2',
        tasks: ['Run tests', 'Verify accessibility', 'Publish docs'],
      },
      inputValues: { owner: 'Mira' },
      initialFocus: '#release-confirm',
      width: '34rem',
    },
  );
}`;

  protected readonly resultTsCode = `${this.dataTsCode}

protected readonly lastResult = signal('No dynamic dialog result yet.');

protected openResultDialog(): void {
  const ref = this.dialogService.open<ReleaseDialogContent, ReleaseDialogData, ReleaseDialogResult>(
    ReleaseDialogContent,
    {
      header: 'Release approval',
      data: {
        version: '4.2',
        tasks: ['Confirm changelog', 'Approve rollout'],
      },
      inputValues: { owner: 'Rin' },
      initialFocus: '#release-confirm',
    },
  );

  ref.closed.subscribe((event) => {
    this.lastResult.set(
      event.result?.confirmed
        ? \`Approved by \${event.result.owner}.\`
        : \`Closed by \${event.reason}.\`,
    );
  });
}`;

  protected readonly optionsTsCode = `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AERIS_DYNAMIC_DIALOG_CONFIG,
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
  type AerisDynamicDialogResolvedConfig,
} from '@aeris-ui/core/dynamic-dialog';

@Component({
  selector: 'app-audit-dialog-content',
  imports: [AerisButton],
  template: \`
    <div class="dynamic-dialog-content">
      <p>{{ data.scope }} audit uses {{ config.size }} sizing and starts focus on the action button.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton id="audit-close" type="button" (click)="close()">Close audit</button>
      </div>
    </div>
  \`,
  styles: \`
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  \`,
})
class AuditDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as { readonly scope: string };
  protected readonly config = inject(AERIS_DYNAMIC_DIALOG_CONFIG) as AerisDynamicDialogResolvedConfig<{ readonly scope: string }>;

  protected close(): void {
    this.ref.close('audit closed');
  }
}

private readonly dialogService = inject(AerisDynamicDialogService);

protected openUtilityDialog(): void {
  this.dialogService.open<AuditDialogContent, { readonly scope: string }, string>(
    AuditDialogContent,
    {
      header: 'Utility dialog',
      data: { scope: 'Release' },
      initialFocus: '#audit-close',
      position: 'top-right',
      size: 'lg',
      maximizable: true,
      draggable: true,
      resizable: true,
      width: '38rem',
      maxWidth: 'calc(100vw - 2rem)',
      mobileWidth: 'calc(100vw - 1rem)',
    },
  );
}`;

  protected readonly manageTsCode = `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
} from '@aeris-ui/core/dynamic-dialog';

@Component({
  selector: 'app-manage-dialog-content',
  imports: [AerisButton],
  template: \`
    <div class="dynamic-dialog-content">
      <p>Each dynamic dialog receives its own reference and can close itself from the content.</p>
      <div class="dynamic-dialog-actions">
        <button aerisButton type="button" (click)="close()">Close this dialog</button>
      </div>
    </div>
  \`,
  styles: \`
    .dynamic-dialog-content { display: grid; gap: 0.875rem; }
    .dynamic-dialog-content p { margin: 0; }
    .dynamic-dialog-actions { display: flex; justify-content: flex-end; }
  \`,
})
class ManageDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('closed');
  }
}

private readonly dialogService = inject(AerisDynamicDialogService);

protected openTwoDialogs(): void {
  this.dialogService.open(ManageDialogContent, {
    header: 'First dialog',
    position: 'left',
    width: '24rem',
  });
  this.dialogService.open(ManageDialogContent, {
    header: 'Second dialog',
    position: 'right',
    width: '24rem',
  });
}`;

  protected readonly interfacesCode = `interface AerisDynamicDialogConfig<TData = unknown> {
  readonly header?: string;
  readonly data?: TData;
  readonly inputValues?: Record<string, unknown>;
  readonly modal?: boolean;
  readonly backdrop?: boolean;
  readonly backdropBlur?: boolean;
  readonly backdropBlurAmount?: string;
  readonly dismissibleMask?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closable?: boolean;
  readonly maximizable?: boolean;
  readonly maximized?: boolean;
  readonly draggable?: boolean;
  readonly resizable?: boolean;
  readonly blockScroll?: boolean;
  readonly focusTrap?: boolean;
  readonly restoreFocus?: boolean;
  readonly autoFocus?: boolean;
  readonly initialFocus?: string;
  readonly position?: AerisDialogPosition;
  readonly size?: AerisDialogSize;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly height?: string;
  readonly maxHeight?: string;
  readonly mobileWidth?: string;
  readonly closeAriaLabel?: string;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly ariaDescribedBy?: string;
}

interface AerisDynamicDialogCloseEvent<TResult = unknown> {
  readonly originalEvent: Event | null;
  readonly reason: AerisDialogCloseReason;
  readonly result: TResult | undefined;
}

interface AerisDynamicDialogShowEvent {
  readonly originalEvent: Event | null;
}

interface AerisDynamicDialogSubscribable<T> {
  subscribe(next: (event: T) => void): { unsubscribe(): void };
}`;

  protected readonly serviceRows: readonly ApiRow[] = [
    { name: 'open(component, config?)', type: '<TComponent, TData, TResult>(Type<TComponent>, AerisDynamicDialogConfig<TData>) => AerisDynamicDialogRef<TResult>', defaultValue: '-', description: 'Creates a dynamic dialog and renders the provided component as content.' },
    { name: 'closeAll()', type: '() => void', defaultValue: '-', description: 'Closes every active dynamic dialog through the normal close lifecycle.' },
    { name: 'destroyAll()', type: '() => void', defaultValue: '-', description: 'Immediately destroys every active dynamic dialog without emitting close results.' },
  ];

  protected readonly configRows: readonly ApiRow[] = [
    { name: 'header', type: 'string', defaultValue: "''", description: 'Dialog title rendered by the shell.' },
    { name: 'data', type: 'TData', defaultValue: 'undefined', description: 'Typed payload available through AERIS_DYNAMIC_DIALOG_DATA.' },
    { name: 'inputValues', type: 'Record<string, unknown>', defaultValue: '{}', description: 'Input values applied to the dynamic content component.' },
    { name: 'modal', type: 'boolean', defaultValue: 'true', description: 'Enables modal semantics and scroll blocking.' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'true', description: 'Shows the visual backdrop.' },
    { name: 'backdropBlur', type: 'boolean', defaultValue: 'true', description: 'Applies the default frosted-glass blur to the backdrop.' },
    { name: 'backdropBlurAmount', type: 'string', defaultValue: "''", description: 'Overrides the backdrop blur radius with a CSS length.' },
    { name: 'dismissibleMask', type: 'boolean', defaultValue: 'false', description: 'Closes when the mask itself is pressed.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes when Escape is pressed.' },
    { name: 'closable', type: 'boolean', defaultValue: 'true', description: 'Shows the shell close button.' },
    { name: 'maximizable', type: 'boolean', defaultValue: 'false', description: 'Shows the maximize action.' },
    { name: 'maximized', type: 'boolean', defaultValue: 'false', description: 'Initial maximized state.' },
    { name: 'draggable', type: 'boolean', defaultValue: 'false', description: 'Allows dragging from the header.' },
    { name: 'resizable', type: 'boolean', defaultValue: 'false', description: 'Allows browser-native panel resizing.' },
    { name: 'blockScroll', type: 'boolean', defaultValue: 'true', description: 'Prevents body scroll while modal.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Keeps Tab navigation inside the dialog.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Restores focus to the previously focused element after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus into the dialog after open.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'Selector for the first focused element.' },
    { name: 'position', type: 'AerisDialogPosition', defaultValue: "'center'", description: 'Viewport placement.' },
    { name: 'size', type: 'AerisDialogSize', defaultValue: "'md'", description: 'Default shell size.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom CSS width.' },
    { name: 'minWidth', type: 'string', defaultValue: "''", description: 'Custom minimum width.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum width.' },
    { name: 'height', type: 'string', defaultValue: "''", description: 'Custom height.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Custom maximum height.' },
    { name: 'mobileWidth', type: 'string', defaultValue: "''", description: 'Width used on narrow viewports.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close dialog'", description: 'Accessible close button label.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible title labels the dialog.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the dialog.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that describes the dialog.' },
  ];

  protected readonly refRows: readonly ApiRow[] = [
    { name: 'closed', type: 'AerisDynamicDialogSubscribable<AerisDynamicDialogCloseEvent<TResult>>', defaultValue: '-', description: 'Emits once when the dialog closes through the normal lifecycle.' },
    { name: 'shown', type: 'AerisDynamicDialogSubscribable<AerisDynamicDialogShowEvent>', defaultValue: '-', description: 'Emits after the dialog opens.' },
    { name: 'close(result?, event?)', type: '(TResult | undefined, Event | null) => void', defaultValue: '-', description: 'Closes the dialog and emits an optional result.' },
    { name: 'destroy()', type: '() => void', defaultValue: '-', description: 'Immediately removes the dialog without emitting a close result.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus to the shell initial focus target.' },
    { name: 'maximize()', type: '() => void', defaultValue: '-', description: 'Maximizes the dialog.' },
    { name: 'restore()', type: '() => void', defaultValue: '-', description: 'Restores the dialog from maximized state.' },
    { name: 'toggleMaximized()', type: '() => void', defaultValue: '-', description: 'Toggles maximized state.' },
  ];

  protected readonly tokenRows: readonly ApiRow[] = [
    { name: 'AERIS_DYNAMIC_DIALOG_DATA', type: 'InjectionToken<unknown>', defaultValue: 'config.data', description: 'Injects the data payload inside the dynamic content component.' },
    { name: 'AERIS_DYNAMIC_DIALOG_CONFIG', type: 'InjectionToken<AerisDynamicDialogResolvedConfig>', defaultValue: 'resolved config', description: 'Injects the resolved dialog configuration inside the dynamic content component.' },
    { name: 'AerisDynamicDialogRef', type: 'class token', defaultValue: 'current ref', description: 'Injects the current dialog reference inside dynamic content.' },
  ];

  protected openAuditDialog(): void {
    this.dialogService.open<BasicAuditDialogContent, unknown, string>(
      BasicAuditDialogContent,
      {
        header: 'Accessibility audit',
        initialFocus: '#audit-close',
        width: '32rem',
      },
    );
  }

  protected openReleaseDialog(): void {
    this.dialogService.open<ReleaseDialogContent, ReleaseDialogData, ReleaseDialogResult>(
      ReleaseDialogContent,
      {
        header: 'Release review',
        data: {
          version: '4.2',
          tasks: ['Run tests', 'Verify accessibility', 'Publish docs'],
        },
        inputValues: { owner: 'Mira' },
        initialFocus: '#release-confirm',
        width: '34rem',
      },
    );
  }

  protected openResultDialog(): void {
    const ref = this.dialogService.open<ReleaseDialogContent, ReleaseDialogData, ReleaseDialogResult>(
      ReleaseDialogContent,
      {
        header: 'Release approval',
        data: {
          version: '4.2',
          tasks: ['Confirm changelog', 'Approve rollout'],
        },
        inputValues: { owner: 'Rin' },
        initialFocus: '#release-confirm',
      },
    );

    ref.closed.subscribe((event: AerisDynamicDialogCloseEvent<ReleaseDialogResult>) => {
      this.lastResult.set(
        event.result?.confirmed
          ? `Approved by ${event.result.owner}.`
          : `Closed by ${event.reason}.`,
      );
    });
  }

  protected openUtilityDialog(): void {
    this.dialogService.open<AuditDialogContent, { readonly scope: string }, string>(
      AuditDialogContent,
      {
        header: 'Utility dialog',
        data: { scope: 'Release' },
        initialFocus: '#audit-close',
        position: 'top-right',
        size: 'lg',
        maximizable: true,
        draggable: true,
        resizable: true,
        width: '38rem',
        maxWidth: 'calc(100vw - 2rem)',
        mobileWidth: 'calc(100vw - 1rem)',
      },
    );
  }

  protected openTwoDialogs(): void {
    this.dialogService.open(ManageDialogContent, {
      header: 'First dialog',
      position: 'left',
      width: '24rem',
    });
    this.dialogService.open(ManageDialogContent, {
      header: 'Second dialog',
      position: 'right',
      width: '24rem',
    });
  }
}
