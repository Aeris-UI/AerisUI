import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisPopoverModule,
  type AerisPopoverPlacement,
  type AerisPopoverVisibilityChangeEvent,
} from '@aeris-ui/core/popover';
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
  selector: 'app-popover-page',
  imports: [
    AerisButton,
    AerisPopoverModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './popover.page.html',
  styleUrl: './popover.page.scss',
})
export class PopoverPage {
  protected readonly controlledOpen = signal(false);
  protected readonly controlledTarget = signal<EventTarget | null>(null);
  protected readonly lastEvent = signal('Popover is closed.');
  protected readonly selectedFlight = signal('Aeris 482');
  protected readonly activePlacement = signal<AerisPopoverPlacement>('auto');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'popover-basic', label: 'Basic' },
    { id: 'popover-controlled', label: 'Controlled' },
    { id: 'popover-placement', label: 'Placement' },
    { id: 'popover-templates', label: 'Templates' },
    { id: 'popover-headless', label: 'Headless' },
    { id: 'popover-options', label: 'Options' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'popover-api-inputs', label: 'Inputs' },
    { id: 'popover-api-models', label: 'Models' },
    { id: 'popover-api-outputs', label: 'Outputs' },
    { id: 'popover-api-templates', label: 'Templates' },
    { id: 'popover-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisPopoverModule } from '@aeris-ui/core/popover';`;

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

.popover-card {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong {
  color: var(--text);
}

.popover-card p {
  margin: 0;
  color: var(--text-2);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly templateCssCode = `.popover-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.popover-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--success);
}

.popover-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

`;

  protected readonly headlessCssCode = `.headless-popover {
  display: grid;
  gap: 0.75rem;
  min-width: 16rem;
}

.headless-popover strong {
  color: var(--text);
}

.headless-popover p {
  margin: 0;
  color: var(--text-2);
}

.headless-popover .aeris-button {
  justify-self: end;
}`;

  protected readonly controlledTsCode = `import { signal } from '@angular/core';
import { type AerisPopoverVisibilityChangeEvent } from '@aeris-ui/core/popover';

protected readonly controlledOpen = signal(false);
protected readonly controlledTarget = signal<EventTarget | null>(null);
protected readonly lastEvent = signal('Popover is closed.');

protected openControlled(event: Event): void {
  this.controlledTarget.set(event.currentTarget);
  this.controlledOpen.set(true);
}

protected recordEvent(event: AerisPopoverVisibilityChangeEvent): void {
  this.lastEvent.set(
    event.visible ? 'Popover opened.' : \`Popover closed by \${event.reason}.\`,
  );
}`;

protected readonly placementTsCode = `import { signal } from '@angular/core';
import { type AerisPopover, type AerisPopoverPlacement } from '@aeris-ui/core/popover';

protected readonly activePlacement = signal<AerisPopoverPlacement>('auto');

protected openPlacement(
  popover: AerisPopover,
  event: MouseEvent,
  placement: AerisPopoverPlacement,
): void {
  this.activePlacement.set(placement);
  popover.show(event);
}`;

  protected readonly templateTsCode = `import { signal } from '@angular/core';

protected readonly selectedFlight = signal('Aeris 482');`;

  protected readonly interfacesCode = `type AerisPopoverPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
type AerisPopoverAlignment = 'start' | 'center' | 'end';
type AerisPopoverCloseReason = 'api' | 'close-button' | 'escape' | 'outside';
type AerisPopoverTarget = Element | EventTarget | Event | null | undefined;

interface AerisPopoverVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisPopoverCloseReason;
  readonly target: Element | null;
}

interface AerisPopoverTemplateContext {
  readonly $implicit: AerisPopover;
  readonly close: (event?: Event) => void;
  readonly placement: Exclude<AerisPopoverPlacement, 'auto'>;
  readonly target: Element | null;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'target', type: 'AerisPopoverTarget', defaultValue: 'null', description: 'Element or trigger event used when visible is controlled directly.' },
    { name: 'header', type: 'string', defaultValue: "''", description: 'Visible popover title.' },
    { name: 'placement', type: 'AerisPopoverPlacement', defaultValue: "'auto'", description: 'Preferred placement around the target.' },
    { name: 'alignment', type: 'AerisPopoverAlignment', defaultValue: "'center'", description: 'Alignment along the target edge.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Custom popover width.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum width.' },
    { name: 'offset', type: 'number', defaultValue: '10', description: 'Distance between target and popover in pixels.' },
    { name: 'viewportMargin', type: 'number', defaultValue: '8', description: 'Minimum viewport edge gap in pixels.' },
    { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Allows outside pointerdown to close.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Allows Escape to close.' },
    { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Shows the built-in close button.' },
    { name: 'focusTrap', type: 'boolean', defaultValue: 'true', description: 'Keeps Tab navigation inside the popover.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the trigger after close.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus into the popover after open.' },
    { name: 'initialFocus', type: 'string', defaultValue: "''", description: 'Selector for the initial focus target.' },
    { name: 'showArrow', type: 'boolean', defaultValue: 'true', description: 'Shows the pointer arrow.' },
    { name: 'closeAriaLabel', type: 'string', defaultValue: "'Close popover'", description: 'Accessible label for the close button.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible title labels the popover.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the popover.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that describes the popover.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'visible', type: 'boolean', defaultValue: 'false', description: 'Controls whether the popover is open.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'visibleChange', type: 'boolean', defaultValue: '-', description: 'Emitted by the visible model.' },
    { name: 'shown', type: 'AerisPopoverVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after the popover opens.' },
    { name: 'hidden', type: 'AerisPopoverVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after the popover closes.' },
    { name: 'visibilityChanged', type: 'AerisPopoverVisibilityChangeEvent', defaultValue: '-', description: 'Emitted after either open or close.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisPopoverHeader', type: 'AerisPopoverTemplateContext', defaultValue: 'header input', description: 'Custom header content.' },
    { name: 'aerisPopoverFooter', type: 'AerisPopoverTemplateContext', defaultValue: '-', description: 'Footer content with access to the close callback.' },
    { name: 'aerisPopoverCloseIcon', type: 'AerisPopoverTemplateContext', defaultValue: 'built-in close icon', description: 'Custom decorative close icon.' },
    { name: 'aerisPopoverHeadless', type: 'AerisPopoverTemplateContext', defaultValue: '-', description: 'Replaces all built-in chrome while keeping positioning and focus behavior.' },
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Popover body content.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(targetOrEvent?, originalEvent?)', type: '(AerisPopoverTarget, Event | null) => void', defaultValue: '-', description: 'Opens the popover relative to a target.' },
    { name: 'hide(event?, reason?)', type: '(Event | null, AerisPopoverCloseReason) => void', defaultValue: "reason: 'api'", description: 'Closes the popover and records the close reason.' },
    { name: 'toggle(targetOrEvent?, originalEvent?)', type: '(AerisPopoverTarget, Event | null) => void', defaultValue: '-', description: 'Opens when closed or closes when open.' },
    { name: 'focus(options?)', type: '(FocusOptions) => void', defaultValue: '-', description: 'Moves focus to the configured initial focus target.' },
    { name: 'reposition()', type: '() => void', defaultValue: '-', description: 'Recalculates target-relative position.' },
  ];

  protected openControlled(event: Event): void {
    this.controlledTarget.set(event.currentTarget);
    this.controlledOpen.set(true);
  }

  protected recordEvent(event: AerisPopoverVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible ? 'Popover opened.' : `Popover closed by ${event.reason}.`,
    );
  }

  protected openPlacement(
    popover: { show: (target: MouseEvent) => void },
    event: MouseEvent,
    placement: AerisPopoverPlacement,
  ): void {
    this.activePlacement.set(placement);
    popover.show(event);
  }
}
