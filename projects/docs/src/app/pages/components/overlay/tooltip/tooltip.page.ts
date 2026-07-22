import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisTooltipModule,
  type AerisTooltipVisibilityEvent,
} from '@aeris-ui/core/tooltip';
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
  selector: 'app-tooltip-page',
  imports: [
    AerisButton,
    AerisTooltipModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './tooltip.page.html',
  styleUrl: './tooltip.page.scss',
})
export class TooltipPage {
  protected readonly lastTooltipEvent = signal('Tooltip has not opened yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tooltip-basic', label: 'Basic' },
    { id: 'tooltip-position', label: 'Position' },
    { id: 'tooltip-delay', label: 'Delay' },
    { id: 'tooltip-events', label: 'Events' },
    { id: 'tooltip-methods', label: 'Methods' },
    { id: 'tooltip-template', label: 'Template' },
    { id: 'tooltip-options', label: 'Options' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tooltip-api-inputs', label: 'Inputs' },
    { id: 'tooltip-api-outputs', label: 'Outputs' },
    { id: 'tooltip-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisTooltipModule } from '@aeris-ui/core/tooltip';`;

  protected readonly sharedCssCode = `.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly templateCssCode = `.tooltip-card {
  display: grid;
  gap: 0.35rem;
}

.tooltip-card strong {
  color: var(--aeris-tooltip-color, currentColor);
}

.tooltip-card p {
  margin: 0;
}`;

  protected readonly templateDemoCssCode = `${this.sharedCssCode}

${this.templateCssCode}`;

  protected readonly basicTsCode = `import { signal } from '@angular/core';
import { type AerisTooltipVisibilityEvent } from '@aeris-ui/core/tooltip';

protected readonly lastTooltipEvent = signal('Tooltip has not opened yet.');

protected recordTooltip(event: AerisTooltipVisibilityEvent): void {
  this.lastTooltipEvent.set(
    event.visible ? 'Tooltip opened.' : \`Tooltip closed by \${event.reason}.\`,
  );
}`;

  protected readonly interfacesCode = `type AerisTooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type AerisTooltipEvent = 'hover' | 'focus' | 'both';
type AerisTooltipCloseReason = 'api' | 'escape' | 'blur' | 'pointerleave' | 'disabled';
type AerisTooltipContent =
  | string
  | TemplateRef<AerisTooltipTemplateContext>
  | null
  | undefined;

interface AerisTooltipTemplateContext {
  readonly $implicit: string;
}

interface AerisTooltipVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisTooltipCloseReason | 'show';
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'aerisTooltip', type: 'AerisTooltipContent', defaultValue: "''", description: 'String or template content rendered in the tooltip.' },
    { name: 'aerisTooltipPosition', type: 'AerisTooltipPosition', defaultValue: "'top'", description: 'Preferred edge around the target.' },
    { name: 'aerisTooltipEvent', type: 'AerisTooltipEvent', defaultValue: "'both'", description: 'Trigger mode: pointer hover, focus, or both.' },
    { name: 'aerisTooltipShowDelay', type: 'number', defaultValue: '0', description: 'Delay before opening in milliseconds.' },
    { name: 'aerisTooltipHideDelay', type: 'number', defaultValue: '0', description: 'Delay before closing in milliseconds.' },
    { name: 'aerisTooltipDisabled', type: 'boolean', defaultValue: 'false', description: 'Prevents the tooltip from opening and closes an open tooltip.' },
    { name: 'aerisTooltipAutoHide', type: 'boolean', defaultValue: 'true', description: 'Closes when the pointer leaves the target. Set false when pointer text selection inside the tooltip is needed.' },
    { name: 'aerisTooltipOffset', type: 'number', defaultValue: '8', description: 'Distance from the target in pixels.' },
    { name: 'aerisTooltipViewportMargin', type: 'number', defaultValue: '6', description: 'Minimum viewport edge gap in pixels.' },
    { name: 'aerisTooltipMaxWidth', type: 'string', defaultValue: "''", description: 'Custom maximum tooltip width.' },
    { name: 'aerisTooltipStyleClass', type: 'string', defaultValue: "''", description: 'Additional CSS class applied to the tooltip panel.' },
    { name: 'aerisTooltipTruncatedOnly', type: 'boolean', defaultValue: 'false', description: 'Opens only when the target content overflows its visible dimensions.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'aerisTooltipShown', type: 'AerisTooltipVisibilityEvent', defaultValue: '-', description: 'Emitted after the tooltip becomes visible.' },
    { name: 'aerisTooltipHidden', type: 'AerisTooltipVisibilityEvent', defaultValue: '-', description: 'Emitted after the tooltip closes.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(originalEvent?)', type: '(Event | null) => void', defaultValue: '-', description: 'Opens the tooltip programmatically using the configured delay.' },
    { name: 'hide(originalEvent?, reason?)', type: '(Event | null, AerisTooltipCloseReason) => void', defaultValue: "reason: 'api'", description: 'Closes the tooltip programmatically using the configured delay.' },
  ];

  protected recordTooltip(event: AerisTooltipVisibilityEvent): void {
    this.lastTooltipEvent.set(
      event.visible ? 'Tooltip opened.' : `Tooltip closed by ${event.reason}.`,
    );
  }
}
