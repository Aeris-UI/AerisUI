import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import {
  AerisDialogModule,
  type AerisDialogVisibilityChangeEvent,
} from '@aeris-ui/core/dialog';
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
  selector: 'app-dialog-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisTextarea,
    AerisDialogModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './dialog.page.html',
  styleUrl: './dialog.page.scss',
})
export class DialogPage {
  protected readonly basicOpen = signal(false);
  protected readonly controlledOpen = signal(false);
  protected readonly dismissalOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly noBackdropBlurOpen = signal(false);
  protected readonly templateOpen = signal(false);
  protected readonly positionOpen = signal(false);
  protected readonly sizingOpen = signal(false);
  protected readonly responsiveOpen = signal(false);
  protected readonly utilityOpen = signal(false);
  protected readonly longContentOpen = signal(false);
  protected readonly confirmOpen = signal(false);
  protected readonly headlessOpen = signal(false);
  protected readonly maximized = signal(false);
  protected readonly currentPosition = signal<'center' | 'top-right' | 'bottom'>('center');
  protected readonly lastEvent = signal('Dialog is closed.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'dialog-basic', label: 'Basic' },
    { id: 'dialog-controlled', label: 'Controlled state' },
    { id: 'dialog-dismissal', label: 'Dismissal' },
    { id: 'dialog-templates', label: 'Templates' },
    { id: 'dialog-positions', label: 'Positions' },
    { id: 'dialog-sizing', label: 'Custom width' },
    { id: 'dialog-responsive', label: 'Responsive width' },
    { id: 'dialog-long-content', label: 'Long content' },
    { id: 'dialog-confirmation', label: 'Confirmation' },
    { id: 'dialog-headless', label: 'Headless' },
    { id: 'dialog-utilities', label: 'Maximize and drag' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'dialog-api-inputs', label: 'Inputs' },
    { id: 'dialog-api-models', label: 'Models' },
    { id: 'dialog-api-outputs', label: 'Outputs' },
    { id: 'dialog-api-templates', label: 'Templates' },
    { id: 'dialog-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisDialogModule } from '@aeris-ui/core/dialog';`;

  protected readonly basicTsCode = `protected readonly basicOpen = signal(false);`;

  protected readonly controlledTsCode = `protected readonly controlledOpen = signal(false);
protected readonly lastEvent = signal('Dialog is closed.');

protected recordDialogEvent(event: AerisDialogVisibilityChangeEvent): void {
  this.lastEvent.set(
    event.visible
      ? 'Dialog opened.'
      : \`Dialog closed by \${event.reason}.\`,
  );
}`;

  protected readonly dismissalTsCode = `protected readonly dismissalOpen = signal(false);
protected readonly noBackdropOpen = signal(false);
protected readonly noBackdropBlurOpen = signal(false);`;

  protected readonly templateTsCode = `protected readonly templateOpen = signal(false);`;

  protected readonly positionsTsCode = `protected readonly positionOpen = signal(false);
protected readonly currentPosition = signal<'center' | 'top-right' | 'bottom'>('center');

protected openAt(position: 'center' | 'top-right' | 'bottom'): void {
  this.currentPosition.set(position);
  this.positionOpen.set(true);
}`;

  protected readonly sizingTsCode = `protected readonly sizingOpen = signal(false);`;

  protected readonly responsiveTsCode = `protected readonly responsiveOpen = signal(false);`;

  protected readonly longContentTsCode = `protected readonly longContentOpen = signal(false);`;

  protected readonly confirmTsCode = `protected readonly confirmOpen = signal(false);`;

  protected readonly headlessTsCode = `protected readonly headlessOpen = signal(false);`;

  protected readonly utilityTsCode = `protected readonly utilityOpen = signal(false);
protected readonly maximized = signal(false);`;

  protected readonly controlsCssCode = `.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly templateCssCode = `.dialog-title-stack {
  display: grid;
  gap: 0.15rem;
}

.dialog-title-stack small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.dialog-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.dialog-close-icon::before,
.dialog-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.dialog-close-icon::before {
  transform: rotate(45deg);
}

.dialog-close-icon::after {
  transform: rotate(-45deg);
}`;

  protected readonly formCssCode = `.dialog-form {
  display: grid;
  gap: 0.75rem;
}

.dialog-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--text);
  font-weight: 700;
}

.dialog-form input,
.dialog-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.dialog-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.dialog-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}`;

  protected readonly headlessCssCode = `.headless-dialog {
  padding: 1.25rem;
  border-radius: var(--aeris-dialog-radius, var(--aeris-radius-lg));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), transparent 55%),
    var(--surface);
  color: var(--text);
}

.headless-dialog h3 {
  margin: 0;
  font-size: 1.125rem;
}

.headless-dialog p {
  margin: 0.5rem 0 1rem;
  color: var(--text-2);
}`;

  protected readonly interfacesCode = `type AerisDialogCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
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
type AerisDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
type AerisDialogRole = 'dialog' | 'alertdialog';

interface AerisDialogVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDialogCloseReason;
}

interface AerisDialogTemplateContext {
  readonly $implicit: AerisDialog;
  readonly close: (event?: Event) => void;
  readonly maximized: boolean;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'header', type: 'string', defaultValue: "''", description: 'Default dialog title rendered in the header.' },
    { name: 'role', type: 'AerisDialogRole', defaultValue: "'dialog'", description: 'Dialog landmark role. Use alertdialog only for interruptive confirmation-style surfaces.' },
    { name: 'modal', type: 'boolean', defaultValue: 'true', description: 'Enables modal semantics, focus handling, and optional scroll blocking.' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'true', description: 'Shows the modal backdrop. Set false for a modal dialog without the visual mask.' },
    { name: 'backdropBlur', type: 'boolean', defaultValue: 'true', description: 'Applies the default frosted-glass blur to the visible backdrop.' },
    { name: 'backdropBlurAmount', type: 'string', defaultValue: "''", description: 'Overrides the backdrop blur radius for this dialog with a CSS length.' },
    { name: 'dismissibleMask', type: 'boolean', defaultValue: 'false', description: 'Closes the dialog when the mask itself is pressed.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes the dialog when Escape is pressed.' },
    { name: 'closable', type: 'boolean', defaultValue: 'true', description: 'Shows the close button in the header.' },
    { name: 'maximizable', type: 'boolean', defaultValue: 'false', description: 'Shows a header action that toggles maximized layout.' },
    { name: 'draggable', type: 'boolean', defaultValue: 'false', description: 'Allows pointer dragging from the header when not maximized.' },
    { name: 'resizable', type: 'boolean', defaultValue: 'false', description: 'Allows browser-native resizing of the dialog surface.' },
    { name: 'blockScroll', type: 'boolean', defaultValue: 'true', description: 'Prevents body scrolling while a modal dialog is open.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Keeps Tab navigation inside the open dialog.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the previously focused element after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus into the dialog after it opens.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'Optional selector for the first element to focus.' },
    { name: 'position', type: 'AerisDialogPosition', defaultValue: "'center'", description: 'Places the dialog within the viewport.' },
    { name: 'size', type: 'AerisDialogSize', defaultValue: "'md'", description: 'Controls the default dialog width.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom dialog width such as 42rem, 60vw, or min(40rem, 100%).' },
    { name: 'minWidth', type: 'string', defaultValue: "''", description: 'Custom minimum dialog width.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum dialog width.' },
    { name: 'height', type: 'string', defaultValue: "''", description: 'Custom dialog height.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Custom maximum dialog height.' },
    { name: 'mobileWidth', type: 'string', defaultValue: "''", description: 'Width used by the built-in narrow viewport media query.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close dialog'", description: 'Accessible label for the close button.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible title should label the dialog.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the dialog.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that describes the dialog.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'false', description: 'Controls whether the dialog is rendered.' },
    { name: 'maximized', type: 'boolean', defaultValue: 'false', description: 'Controls maximized layout state.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'visibleChange', type: 'boolean', defaultValue: '-', description: 'Emitted by the visible model.' },
    { name: 'maximizedChange', type: 'boolean', defaultValue: '-', description: 'Emitted by the maximized model.' },
    { name: 'shown', type: 'AerisDialogVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after the dialog opens.' },
    { name: 'hidden', type: 'AerisDialogVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after the dialog closes.' },
    { name: 'visibilityChanged', type: 'AerisDialogVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after either open or close.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisDialogHeader', type: 'AerisDialogTemplateContext', defaultValue: 'header input', description: 'Custom header content rendered before header actions.' },
    { name: 'aerisDialogFooter', type: 'AerisDialogTemplateContext', defaultValue: '-', description: 'Footer content with access to the close callback.' },
    { name: 'aerisDialogCloseIcon', type: 'AerisDialogTemplateContext', defaultValue: 'built-in close icon', description: 'Custom decorative close icon inside the close button.' },
    { name: 'aerisDialogHeadless', type: 'AerisDialogTemplateContext', defaultValue: '-', description: 'Replaces the built-in header, body, and footer layout while preserving dialog semantics.' },
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Dialog body content.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Opens the dialog.' },
    { name: 'hide(event?, reason?)', type: '(Event | null, AerisDialogCloseReason) => void', defaultValue: '-', description: 'Closes the dialog and records the close reason.' },
    { name: 'toggle(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Opens or closes the dialog.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus to the initial focus target or first focusable control.' },
    { name: 'toggleMaximized()', type: '() => void', defaultValue: '-', description: 'Toggles maximized layout.' },
    { name: 'maximize()', type: '() => void', defaultValue: '-', description: 'Enters maximized layout.' },
    { name: 'restore()', type: '() => void', defaultValue: '-', description: 'Leaves maximized layout.' },
  ];

  protected recordDialogEvent(event: AerisDialogVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible ? 'Dialog opened.' : `Dialog closed by ${event.reason}.`,
    );
  }

  protected openAt(position: 'center' | 'top-right' | 'bottom'): void {
    this.currentPosition.set(position);
    this.positionOpen.set(true);
  }
}
