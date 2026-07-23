# DynamicDialog

> Service-created dialog shell that renders any Angular component as dynamic content.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/dynamic-dialog`
- Human-readable documentation: [https://aeris-ui.dev/components/dynamic-dialog](https://aeris-ui.dev/components/dynamic-dialog)
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
  AERIS_DYNAMIC_DIALOG_CONFIG,
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
} from '@aeris-ui/core/dynamic-dialog';
```

## API

### Service Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `open(component, config?)` | `&lt;TComponent, TData, TResult&gt;(Type&lt;TComponent&gt;, AerisDynamicDialogConfig&lt;TData&gt;) =&gt; AerisDynamicDialogRef&lt;TResult&gt;` | `-` | Creates a dynamic dialog and renders the provided component as content. |
| `closeAll()` | `() =&gt; void` | `-` | Closes every active dynamic dialog through the normal close lifecycle. |
| `destroyAll()` | `() =&gt; void` | `-` | Immediately destroys every active dynamic dialog without emitting close results. |

### Config Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | `''` | Dialog title rendered by the shell. |
| `data` | `TData` | `undefined` | Typed payload available through AERIS_DYNAMIC_DIALOG_DATA. |
| `inputValues` | `Record&lt;string, unknown&gt;` | `{}` | Input values applied to the dynamic content component. |
| `modal` | `boolean` | `true` | Enables modal semantics and scroll blocking. |
| `backdrop` | `boolean` | `true` | Shows the visual backdrop. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius with a CSS length. |
| `dismissibleMask` | `boolean` | `false` | Closes when the mask itself is pressed. |
| `closeOnEscape` | `boolean` | `true` | Closes when Escape is pressed. |
| `closable` | `boolean` | `true` | Shows the shell close button. |
| `maximizable` | `boolean` | `false` | Shows the maximize action. |
| `maximized` | `boolean` | `false` | Initial maximized state. |
| `draggable` | `boolean` | `false` | Allows dragging from the header. |
| `resizable` | `boolean` | `false` | Allows browser-native panel resizing. |
| `blockScroll` | `boolean` | `true` | Prevents body scroll while modal. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the dialog. |
| `restoreFocus` | `boolean` | `true` | Restores focus to the previously focused element after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the dialog after open. |
| `initialFocus` | `string` | `''` | Selector for the first focused element. |
| `position` | `AerisDialogPosition` | `'center'` | Viewport placement. |
| `size` | `AerisDialogSize` | `'md'` | Default shell size. |
| `width` | `string` | `''` | Custom CSS width. |
| `minWidth` | `string` | `''` | Custom minimum width. |
| `maxWidth` | `string` | `''` | Custom maximum width. |
| `height` | `string` | `''` | Custom height. |
| `maxHeight` | `string` | `''` | Custom maximum height. |
| `mobileWidth` | `string` | `''` | Width used on narrow viewports. |
| `closeAriaLabel` | `string` | `'Close dialog'` | Accessible close button label. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the dialog. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the dialog. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the dialog. |

### Ref Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `closed` | `AerisDynamicDialogSubscribable&lt;AerisDynamicDialogCloseEvent&lt;TResult&gt;&gt;` | `-` | Emits once when the dialog closes through the normal lifecycle. |
| `shown` | `AerisDynamicDialogSubscribable&lt;AerisDynamicDialogShowEvent&gt;` | `-` | Emits after the dialog opens. |
| `close(result?, event?)` | `(TResult &#124; undefined, Event &#124; null) =&gt; void` | `-` | Closes the dialog and emits an optional result. |
| `destroy()` | `() =&gt; void` | `-` | Immediately removes the dialog without emitting a close result. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus to the shell initial focus target. |
| `maximize()` | `() =&gt; void` | `-` | Maximizes the dialog. |
| `restore()` | `() =&gt; void` | `-` | Restores the dialog from maximized state. |
| `toggleMaximized()` | `() =&gt; void` | `-` | Toggles maximized state. |

## Interfaces and types

### Interfaces

```ts
interface AerisDynamicDialogConfig<TData = unknown> {
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `AERIS_DYNAMIC_DIALOG_DATA` | `InjectionToken&lt;unknown&gt;` | `config.data` | Injects the data payload inside the dynamic content component. |
| `AERIS_DYNAMIC_DIALOG_CONFIG` | `InjectionToken&lt;AerisDynamicDialogResolvedConfig&gt;` | `resolved config` | Injects the resolved dialog configuration inside the dynamic content component. |
| `AerisDynamicDialogRef` | `class token` | `current ref` | Injects the current dialog reference inside dynamic content. |
| `--aeris-dialog-z-index` | `CSS custom property` | — | Overlay stacking context. |
| `--aeris-dialog-mask-background` | `CSS custom property` | — | Modal mask color. |
| `--aeris-dialog-backdrop-blur` | `CSS custom property` | — | Backdrop blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-dialog-width` | `CSS custom property` | — | Custom panel width. |
| `--aeris-dialog-background` | `CSS custom property` | — | Panel surface. |
| `--aeris-dialog-color` | `CSS custom property` | — | Base text color. |
| `--aeris-dialog-border` | `CSS custom property` | — | Panel and section borders. |
| `--aeris-dialog-radius` | `CSS custom property` | — | Panel radius. |
| `--aeris-dialog-focus` | `CSS custom property` | — | Focus ring color. |
| `--aeris-dialog-header-padding` | `CSS custom property` | — | Header padding. |
| `--aeris-dialog-body-padding` | `CSS custom property` | — | Body padding around dynamic content. |

## Examples

### Basic

Open a dialog by passing a component type to the service.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDynamicDialogRef, AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';

@Component({
  selector: 'app-audit-dialog-content',
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
class AuditDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('audit closed');
  }
}

@Component({
  selector: 'app-dynamic-dialog-basic-demo',
  imports: [AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="openAuditDialog()">
        Open dynamic dialog
      </button>
    </div>
  `,
  styles: `
    .dynamic-dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dynamic-dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DynamicDialogBasicBasicDemo {
  private readonly dialogService = inject(AerisDynamicDialogService);

  protected openAuditDialog(): void {
    this.dialogService.open<AuditDialogContent, unknown, string>(AuditDialogContent, {
      header: 'Accessibility audit',
      initialFocus: '#audit-close',
      width: '32rem',
    });
  }
}
```

### Data and inputs

Pass injected data and component input values to the dynamic content.

#### TS

```ts
import { Component, inject, input } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AERIS_DYNAMIC_DIALOG_DATA, AerisDynamicDialogRef, AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';

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
  private readonly ref = inject<AerisDynamicDialogRef<ReleaseDialogResult>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as ReleaseDialogData;

  protected confirm(): void {
    this.ref.close({ confirmed: true, owner: this.owner() });
  }

  protected cancel(): void {
    this.ref.close({ confirmed: false, owner: this.owner() });
  }
}

@Component({
  selector: 'app-dynamic-dialog-data-demo',
  imports: [AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="openReleaseDialog()">
        Open release dialog
      </button>
    </div>
  `,
  styles: `
    .dynamic-dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dynamic-dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DynamicDialogDataDataAndInputsDemo {
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
  }
}
```

### Close result

Subscribe to the returned reference to receive typed close results and close reasons.

#### TS

```ts
import { Component, inject, input, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AERIS_DYNAMIC_DIALOG_DATA, AerisDynamicDialogRef, AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';

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
  private readonly ref = inject<AerisDynamicDialogRef<ReleaseDialogResult>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as ReleaseDialogData;

  protected confirm(): void {
    this.ref.close({ confirmed: true, owner: this.owner() });
  }

  protected cancel(): void {
    this.ref.close({ confirmed: false, owner: this.owner() });
  }
}

@Component({
  selector: 'app-dynamic-dialog-result-demo',
  imports: [AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="openResultDialog()">
        Open approval dialog
      </button>
      <p class="dynamic-dialog-status" aria-live="polite">{{ lastResult() }}</p>
    </div>
  `,
  styles: `
    .dynamic-dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dynamic-dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DynamicDialogResultCloseResultDemo {
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
  }

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
          ? `Approved by ${event.result.owner}.`
          : `Closed by ${event.reason}.`,
      );
    });
  }
}
```

### Dialog options

Use the same sizing, positioning, backdrop, focus, maximize, drag, and resize options as Dialog.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AERIS_DYNAMIC_DIALOG_CONFIG, AERIS_DYNAMIC_DIALOG_DATA, AerisDynamicDialogRef, AerisDynamicDialogService, type AerisDynamicDialogResolvedConfig } from '@aeris-ui/core/dynamic-dialog';

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
  protected readonly config = inject(AERIS_DYNAMIC_DIALOG_CONFIG) as AerisDynamicDialogResolvedConfig<{ readonly scope: string }>;

  protected close(): void {
    this.ref.close('audit closed');
  }
}

@Component({
  selector: 'app-dynamic-dialog-options-demo',
  imports: [AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="openUtilityDialog()">
        Open utility dialog
      </button>
    </div>
  `,
  styles: `
    .dynamic-dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dynamic-dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DynamicDialogOptionsDialogOptionsDemo {
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
  }
}
```

### Manage references

Open multiple dialogs and let each dynamic content component close itself through its injected reference.

#### TS

```ts
import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDynamicDialogRef, AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';

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
  selector: 'app-dynamic-dialog-manage-demo',
  imports: [AerisButton],
  template: `
    <div>
      <div class="dynamic-dialog-controls">
        <button aerisButton type="button" (click)="openTwoDialogs()">
          Open two dialogs
        </button>
      </div>
    </div>
  `,
  styles: `
    .dynamic-dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dynamic-dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DynamicDialogManageManageReferencesDemo {
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
  }
}
```

## Accessibility

- DynamicDialog renders the same accessible dialog shell as Dialog, including role="dialog", modal state, focus trapping, and focus restoration.
- Provide header, ariaLabel, or ariaLabelledBy so every dynamic dialog has an accessible name.
- Use ariaDescribedBy when dynamic content includes explanatory text that should describe the dialog.
- Use initialFocus to place focus on the safest first action for confirmations and forms.
- The dynamic content component is responsible for semantic headings, form labels, validation messages, and any custom keyboard behavior it introduces.
- Escape dismissal is enabled by default. Mask dismissal is opt-in through dismissibleMask.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next focusable item inside the dynamic dialog; wraps to the first item from the last item while focusTrap is enabled. |
| `Shift + Tab` | Moves to the previous focusable item inside the dynamic dialog; wraps to the last item from the first item while focusTrap is enabled. |
| `Escape` | Closes the dialog when closeOnEscape is enabled. |
| `Enter / Space` | Activates focused native controls inside the shell or dynamic content. |
