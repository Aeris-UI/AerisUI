import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import {
  AerisDrawerModule,
  type AerisDrawerPosition,
  type AerisDrawerVisibilityChangeEvent,
} from '@aeris-ui/core/drawer';
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
  selector: 'app-drawer-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisTextarea,
    AerisDrawerModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './drawer.page.html',
  styleUrl: './drawer.page.scss',
})
export class DrawerPage {
  protected readonly basicOpen = signal(false);
  protected readonly controlledOpen = signal(false);
  protected readonly dismissibleOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly noBackdropBlurOpen = signal(false);
  protected readonly positionOpen = signal(false);
  protected readonly templateOpen = signal(false);
  protected readonly responsiveOpen = signal(false);
  protected readonly maximizableOpen = signal(false);
  protected readonly fullscreenOpen = signal(false);
  protected readonly drawerMaximized = signal(false);
  protected readonly longContentOpen = signal(false);
  protected readonly headlessOpen = signal(false);
  protected readonly currentPosition = signal<AerisDrawerPosition>('right');
  protected readonly lastEvent = signal('Drawer is closed.');
  protected readonly filterGroups = [
    'Status',
    'Owner',
    'Priority',
    'Release',
    'Team',
    'Date range',
    'Tags',
    'Archived',
    'Created by',
    'Updated by',
    'Sprint',
    'Risk',
    'Customer',
    'Environment',
    'Review state',
    'Deployment window',
  ] as const;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'drawer-basic', label: 'Basic' },
    { id: 'drawer-controlled', label: 'Controlled state' },
    { id: 'drawer-positions', label: 'Positions' },
    { id: 'drawer-dismissal', label: 'Dismissal' },
    { id: 'drawer-templates', label: 'Templates' },
    { id: 'drawer-responsive', label: 'Responsive' },
    { id: 'drawer-fullscreen', label: 'Full screen' },
    { id: 'drawer-long-content', label: 'Long content' },
    { id: 'drawer-headless', label: 'Headless' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'drawer-api-inputs', label: 'Inputs' },
    { id: 'drawer-api-models', label: 'Models' },
    { id: 'drawer-api-outputs', label: 'Outputs' },
    { id: 'drawer-api-templates', label: 'Templates' },
    { id: 'drawer-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisDrawerModule } from '@aeris-ui/core/drawer';`;

  protected readonly basicTsCode = `protected readonly basicOpen = signal(false);`;

  protected readonly controlledTsCode = `import { type AerisDrawerVisibilityChangeEvent } from '@aeris-ui/core/drawer';

protected readonly controlledOpen = signal(false);
protected readonly lastEvent = signal('Drawer is closed.');

protected recordDrawerEvent(event: AerisDrawerVisibilityChangeEvent): void {
  this.lastEvent.set(
    event.visible
      ? 'Drawer opened.'
      : \`Drawer closed by \${event.reason}.\`,
  );
}`;

  protected readonly positionsTsCode = `import { type AerisDrawerPosition } from '@aeris-ui/core/drawer';

protected readonly positionOpen = signal(false);
protected readonly currentPosition = signal<AerisDrawerPosition>('right');

protected openDrawerAt(position: AerisDrawerPosition): void {
  this.currentPosition.set(position);
  this.positionOpen.set(true);
}`;

  protected readonly dismissalTsCode = `protected readonly dismissibleOpen = signal(false);
protected readonly noBackdropOpen = signal(false);
protected readonly noBackdropBlurOpen = signal(false);`;

  protected readonly templateTsCode = `protected readonly templateOpen = signal(false);`;

  protected readonly responsiveTsCode = `protected readonly responsiveOpen = signal(false);`;

  protected readonly fullscreenTsCode = `protected readonly maximizableOpen = signal(false);
protected readonly fullscreenOpen = signal(false);
protected readonly drawerMaximized = signal(false);`;

  protected readonly longContentTsCode = `protected readonly longContentOpen = signal(false);
protected readonly filterGroups = [
  'Status',
  'Owner',
  'Priority',
  'Release',
  'Team',
  'Date range',
  'Tags',
  'Archived',
  'Created by',
  'Updated by',
  'Sprint',
  'Risk',
  'Customer',
  'Environment',
  'Review state',
  'Deployment window',
] as const;`;

  protected readonly headlessTsCode = `protected readonly headlessOpen = signal(false);`;

  protected readonly controlsCssCode = `.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly formCssCode = `.drawer-form {
  display: grid;
  gap: 0.75rem;
}

.drawer-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--text);
  font-weight: 700;
}

.drawer-form input,
.drawer-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.drawer-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.drawer-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}`;

  protected readonly templateCssCode = `.drawer-title-stack {
  display: grid;
  gap: 0.15rem;
}

.drawer-title-stack small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.drawer-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.drawer-close-icon::before,
.drawer-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.drawer-close-icon::before {
  transform: rotate(45deg);
}

.drawer-close-icon::after {
  transform: rotate(-45deg);
}`;

  protected readonly contentCssCode = `.drawer-stack {
  display: grid;
  gap: 0.875rem;
}

.drawer-card {
  padding: 0.875rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface-2);
}

.drawer-card p {
  margin: 0.25rem 0 0;
}`;

  protected readonly headlessCssCode = `.headless-drawer {
  min-height: 100%;
  display: grid;
  align-content: center;
  gap: 1rem;
  padding: 1.25rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), transparent 55%),
    var(--surface);
  color: var(--text);
}

.headless-drawer h3,
.headless-drawer p {
  margin: 0;
}

.headless-drawer p {
  color: var(--text-2);
}

.headless-drawer .aeris-button {
  justify-self: start;
}`;

  protected readonly customTokenCssCode = `.settings-drawer {
  --aeris-drawer-width: 28rem;
  --aeris-drawer-radius: 1.25rem;
  --aeris-drawer-header-background: color-mix(
    in srgb,
    var(--aeris-primary) 10%,
    var(--aeris-surface)
  );
}`;

  protected readonly interfacesCode = `type AerisDrawerCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
type AerisDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type AerisDrawerSize = 'sm' | 'md' | 'lg' | 'full';

interface AerisDrawerVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDrawerCloseReason;
}

interface AerisDrawerTemplateContext {
  readonly $implicit: AerisDrawer;
  readonly close: (event?: Event) => void;
  readonly position: AerisDrawerPosition;
  readonly maximized: boolean;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'header', type: 'string', defaultValue: "''", description: 'Default drawer title rendered in the header.' },
    { name: 'position', type: 'AerisDrawerPosition', defaultValue: "'right'", description: 'Anchors the drawer to the left, right, top, or bottom viewport edge.' },
    { name: 'size', type: 'AerisDrawerSize', defaultValue: "'md'", description: 'Applies preset width or height based on position.' },
    { name: 'modal', type: 'boolean', defaultValue: 'true', description: 'Enables modal semantics, focus handling, and optional scroll blocking.' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'true', description: 'Shows the modal backdrop. Set false for a modal drawer without the visual mask.' },
    { name: 'backdropBlur', type: 'boolean', defaultValue: 'true', description: 'Applies the default frosted-glass blur to the visible backdrop.' },
    { name: 'backdropBlurAmount', type: 'string', defaultValue: "''", description: 'Overrides the backdrop blur radius for this drawer with a CSS length.' },
    { name: 'dismissibleMask', type: 'boolean', defaultValue: 'false', description: 'Closes the drawer when the mask itself is pressed.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes the drawer when Escape is pressed.' },
    { name: 'closable', type: 'boolean', defaultValue: 'true', description: 'Shows the close button in the header.' },
    { name: 'maximizable', type: 'boolean', defaultValue: 'false', description: 'Shows a header action that toggles full-screen drawer layout.' },
    { name: 'blockScroll', type: 'boolean', defaultValue: 'true', description: 'Locks body scroll while a modal drawer is open.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Cycles Tab and Shift + Tab inside the drawer while open.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the previously focused element after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Focuses the initial target or first focusable element after open.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'CSS selector for the first element to focus inside the drawer.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom width for left and right drawers.' },
    { name: 'height', type: 'string', defaultValue: "''", description: 'Custom height for top and bottom drawers.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Maximum drawer width.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Maximum drawer height.' },
    { name: 'mobileWidth', type: 'string', defaultValue: "''", description: 'Width used by side drawers on narrow viewports.' },
    { name: 'mobileHeight', type: 'string', defaultValue: "''", description: 'Height used by top or bottom drawers on narrow viewports.' },
    { name: 'mobileFullScreen', type: 'boolean', defaultValue: 'false', description: 'Makes the drawer full viewport below the built-in narrow breakpoint.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close drawer'", description: 'Accessible label for the built-in close button.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name used when no visible header labels the drawer.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the drawer.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'IDs of elements that describe the drawer content.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'false', description: 'Controls whether the drawer is rendered.' },
    { name: 'maximized', type: 'boolean', defaultValue: 'false', description: 'Controls whether the drawer fills the viewport.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'shown', type: 'AerisDrawerVisibilityChangeEvent', defaultValue: '-', description: 'Emits after the drawer becomes visible.' },
    { name: 'hidden', type: 'AerisDrawerVisibilityChangeEvent', defaultValue: '-', description: 'Emits after the drawer is hidden.' },
    { name: 'visibilityChanged', type: 'AerisDrawerVisibilityChangeEvent', defaultValue: '-', description: 'Emits for both open and close transitions.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisDrawerHeader', type: 'TemplateRef<AerisDrawerTemplateContext>', defaultValue: '-', description: 'Replaces the default header title area.' },
    { name: 'aerisDrawerFooter', type: 'TemplateRef<AerisDrawerTemplateContext>', defaultValue: '-', description: 'Renders a footer below the scrollable body.' },
    { name: 'aerisDrawerCloseIcon', type: 'TemplateRef<AerisDrawerTemplateContext>', defaultValue: '-', description: 'Replaces the built-in close icon inside the native close button.' },
    { name: 'aerisDrawerHeadless', type: 'TemplateRef<AerisDrawerTemplateContext>', defaultValue: '-', description: 'Replaces all internal chrome while keeping drawer semantics and focus behavior.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(originalEvent)', type: 'void', defaultValue: 'originalEvent: null', description: 'Opens the drawer.' },
    { name: 'hide(originalEvent, reason)', type: 'void', defaultValue: "reason: 'api'", description: 'Closes the drawer and emits the close reason.' },
    { name: 'toggle(originalEvent)', type: 'void', defaultValue: 'originalEvent: null', description: 'Opens the drawer when closed or closes it when open.' },
    { name: 'focus(options)', type: 'void', defaultValue: '-', description: 'Moves focus to the configured initial target or first focusable element.' },
    { name: 'toggleMaximized()', type: 'void', defaultValue: '-', description: 'Toggles full-screen drawer layout.' },
    { name: 'maximize()', type: 'void', defaultValue: '-', description: 'Sets the drawer to full-screen layout.' },
    { name: 'restore()', type: 'void', defaultValue: '-', description: 'Restores the drawer to its configured edge size.' },
  ];

  protected openDrawerAt(position: AerisDrawerPosition): void {
    this.currentPosition.set(position);
    this.positionOpen.set(true);
  }

  protected recordDrawerEvent(event: AerisDrawerVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible ? 'Drawer opened.' : `Drawer closed by ${event.reason}.`,
    );
  }
}
