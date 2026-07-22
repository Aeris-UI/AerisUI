import { Component, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AerisCompare,
  AerisCompareModule,
  type AerisCompareInputEvent,
} from '@aeris-ui/core/compare';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucideMoveHorizontal } from '@lucide/angular';

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
  selector: 'app-compare-page',
  imports: [
    AerisButton,
    AerisCompareModule,
    AerisTabsModule,
    ReactiveFormsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './compare.page.html',
  styleUrl: './compare.page.scss',
})
export class ComparePage {
  protected readonly moveHorizontalIcon = LucideMoveHorizontal;
  protected readonly controlledValue = signal(42);
  protected readonly hoverValue = signal(50);
  protected readonly controlledStatus = signal('Comparison position: 42%.');
  protected readonly formPosition = new FormControl(35, { nonNullable: true });
  protected readonly controlledCompare = viewChild.required<AerisCompare>('controlledCompare');

  protected setControlledValue(value: number): void {
    this.controlledCompare().setValue(value);
  }

  protected recordControlledChange(event: AerisCompareInputEvent): void {
    this.controlledStatus.set(`Comparison position: ${event.value}%.`);
  }

  protected readonly importCode = `import { AerisCompareModule } from '@aeris-ui/core/compare';`;
  protected readonly basicCode = `import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-basic-compare-demo',
  imports: [AerisCompareModule],
  template: \`
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      beforeLabel="Black and white"
      afterLabel="Color"
      showLabels
      ariaLabel="Car color comparison"
    />
  \`,
})
export class BasicCompareDemo {}`;
  protected readonly controlledCode = `import { Component, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisCompare,
  AerisCompareModule,
  type AerisCompareInputEvent,
} from '@aeris-ui/core/compare';

@Component({
  selector: 'app-controlled-compare-demo',
  imports: [AerisButton, AerisCompareModule],
  template: \`
    <div class="compare-demo-controls" aria-label="Comparison presets">
      <button aerisButton type="button" (click)="setControlledValue(25)">25%</button>
      <button aerisButton type="button" (click)="setControlledValue(50)">50%</button>
      <button aerisButton type="button" (click)="setControlledValue(75)">75%</button>
    </div>
    <aeris-compare
      #controlledCompare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      [(value)]="controlledValue"
      (changed)="recordControlledChange($event)"
      ariaLabel="Controlled car comparison"
    />
    <p class="compare-demo-status" aria-live="polite">{{ controlledStatus() }}</p>
  \`,
})
export class ControlledCompareDemo {
  readonly controlledValue = signal(42);
  readonly controlledStatus = signal('Comparison position: 42%.');
  readonly controlledCompare = viewChild.required<AerisCompare>('controlledCompare');

  setControlledValue(value: number): void {
    this.controlledCompare().setValue(value);
  }

  recordControlledChange(event: AerisCompareInputEvent): void {
    this.controlledStatus.set(\`Comparison position: \${event.value}%.\`);
  }
}`;
  protected readonly hoverCode = `import { Component, signal } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-hover-compare-demo',
  imports: [AerisCompareModule],
  template: \`
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      slideOnHover
      [(value)]="hoverValue"
      ariaLabel="Hover-controlled car comparison"
    />
  \`,
})
export class HoverCompareDemo {
  readonly hoverValue = signal(50);
}`;
  protected readonly verticalCode = `import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-vertical-compare-demo',
  imports: [AerisCompareModule],
  template: \`
    <aeris-compare
      class="compare-vertical"
      orientation="vertical"
      aspectRatio="4 / 5"
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      ariaLabel="Vertical car comparison"
    />
  \`,
})
export class VerticalCompareDemo {}`;
  protected readonly handleCode = `import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';
import { LucideDynamicIcon, LucideMoveHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-custom-handle-compare-demo',
  imports: [AerisCompareModule, LucideDynamicIcon],
  template: \`
    <aeris-compare
      class="compare-accent-handle"
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      ariaLabel="Car comparison with custom handle"
    >
      <ng-template aerisCompareHandle>
        <svg class="compare-handle-icon" [lucideIcon]="moveHorizontalIcon"></svg>
      </ng-template>
    </aeris-compare>
  \`,
})
export class CustomHandleCompareDemo {
  readonly moveHorizontalIcon = LucideMoveHorizontal;
}`;
  protected readonly templateCode = `import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-template-compare-demo',
  imports: [AerisCompareModule],
  templateUrl: './template-compare-demo.html',
  styleUrl: './template-compare-demo.css',
})
export class TemplateCompareDemo {}`;
  protected readonly statesCode = `import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-compare-states-demo',
  imports: [AerisCompareModule],
  templateUrl: './compare-states-demo.html',
  styleUrl: './compare-states-demo.css',
})
export class CompareStatesDemo {}`;
  protected readonly formsCode = `import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-compare-forms-demo',
  imports: [AerisCompareModule, ReactiveFormsModule],
  template: \`
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      [formControl]="formPosition"
      ariaLabel="Form-controlled car comparison"
    />
    <p class="compare-demo-status">Form value: {{ formPosition.value }}%</p>
  \`,
})
export class CompareFormsDemo {
  readonly formPosition = new FormControl(35, { nonNullable: true });
}`;

  protected readonly controlsCss = `.compare-demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.compare-demo-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
}`;
  protected readonly verticalCss = `.compare-vertical {
  width: min(100%, 28rem);
  margin-inline: auto;
}`;
  protected readonly handleCss = `.compare-accent-handle {
  --aeris-compare-handle-background: var(--aeris-primary);
  --aeris-compare-handle-color: var(--aeris-primary-contrast);
  --aeris-compare-handle-border: var(--aeris-surface);
}

.compare-handle-icon {
  width: 1.2rem;
  height: 1.2rem;
}`;
  protected readonly templateCss = `.compare-template-layer {
  display: grid;
  width: 100%;
  height: 100%;
  align-content: center;
  gap: 0.35rem;
  padding: clamp(1.25rem, 5vw, 3rem);
}

.compare-template-layer--manual {
  background: linear-gradient(145deg, #282c34, #15171c);
  color: #f6f7f9;
}

.compare-template-layer--automated {
  background: linear-gradient(145deg, #e7f8cf, #c8ecad);
  color: #17200d;
}

.compare-template-layer p,
.compare-template-layer span,
.compare-template-layer ul {
  margin: 0;
}

.compare-template-layer p {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.compare-template-layer strong {
  font-size: clamp(2rem, 7vw, 4rem);
  letter-spacing: -0.06em;
  line-height: 1;
}

.compare-template-layer span {
  opacity: 0.72;
}

.compare-template-layer ul {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.compare-template-layer li::before {
  margin-inline-end: 0.45rem;
  content: '—';
}`;
  protected readonly statesCss = `.compare-state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.compare-state-grid h4 {
  margin: 0 0 0.625rem;
}

@media (max-width: 40rem) {
  .compare-state-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'compare-import', label: 'Import' },
    { id: 'compare-basic', label: 'Basic' },
    { id: 'compare-controlled', label: 'Controlled' },
    { id: 'compare-hover', label: 'Hover' },
    { id: 'compare-vertical', label: 'Vertical' },
    { id: 'compare-handle', label: 'Custom handle' },
    { id: 'compare-template', label: 'Templates' },
    { id: 'compare-states', label: 'States' },
    { id: 'compare-forms', label: 'Forms' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'compare-import', label: 'Import' },
    { id: 'compare-api-inputs', label: 'Inputs' },
    { id: 'compare-api-models', label: 'Models' },
    { id: 'compare-api-outputs', label: 'Outputs' },
    { id: 'compare-api-templates', label: 'Templates' },
    { id: 'compare-api-methods', label: 'Methods' },
  ];
  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'compare-import', label: 'Import' },
    { id: 'compare-interfaces', label: 'Interfaces' },
  ];
  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'compare-import', label: 'Import' },
    { id: 'compare-tokens', label: 'Tokens' },
  ];
  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'compare-import', label: 'Import' },
    { id: 'compare-semantics', label: 'Semantics' },
    { id: 'compare-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'min', type: 'number', defaultValue: '0', description: 'Minimum comparison value.' },
    { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum comparison value.' },
    {
      name: 'step',
      type: 'number',
      defaultValue: '1',
      description: 'Pointer and keyboard increment.',
    },
    {
      name: 'orientation',
      type: 'AerisCompareOrientation',
      defaultValue: "'horizontal'",
      description: 'Direction of the reveal and divider.',
    },
    {
      name: 'slideOnHover',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Updates from mouse or pen hover without requiring a press.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables focus and all interaction.',
    },
    {
      name: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Keeps the slider focusable while preventing changes.',
    },
    {
      name: 'beforeSrc',
      type: 'string',
      defaultValue: "''",
      description: 'Source for the library-rendered before image.',
    },
    {
      name: 'afterSrc',
      type: 'string',
      defaultValue: "''",
      description: 'Source for the library-rendered after image.',
    },
    {
      name: 'beforeAlt',
      type: 'string',
      defaultValue: "''",
      description: 'Alternative text for the before image.',
    },
    {
      name: 'afterAlt',
      type: 'string',
      defaultValue: "''",
      description: 'Alternative text for the after image.',
    },
    {
      name: 'beforeLabel',
      type: 'string',
      defaultValue: "'Before'",
      description: 'Before label and empty-state text.',
    },
    {
      name: 'afterLabel',
      type: 'string',
      defaultValue: "'After'",
      description: 'After label and empty-state text.',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Displays compact before and after labels.',
    },
    {
      name: 'objectFit',
      type: 'AerisCompareObjectFit',
      defaultValue: "'cover'",
      description: 'Fit used by built-in images.',
    },
    {
      name: 'aspectRatio',
      type: 'string',
      defaultValue: "'16 / 9'",
      description: 'CSS aspect ratio of the comparison surface.',
    },
    {
      name: 'loading',
      type: "'eager' | 'lazy'",
      defaultValue: "'lazy'",
      description: 'Loading behavior for built-in images.',
    },
    {
      name: 'name',
      type: 'string',
      defaultValue: "''",
      description: 'Native range name for form submission.',
    },
    {
      name: 'inputId',
      type: 'string',
      defaultValue: 'Generated',
      description: 'ID assigned to the native range input.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Comparison position'",
      description: 'Accessible name when ariaLabelledby is not used.',
    },
    {
      name: 'ariaLabelledby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of elements that label the range.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of elements that describe the range.',
    },
    {
      name: 'valueText',
      type: '((value: number) => string) | null',
      defaultValue: 'null',
      description: 'Formats the announced aria-valuetext.',
    },
  ];
  protected readonly models: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'number',
      defaultValue: '50',
      description: 'Controlled comparison value with valueChange output.',
    },
  ];
  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'valueInput',
      type: 'AerisCompareInputEvent',
      defaultValue: '—',
      description: 'Emits during drag, hover, or keyboard updates.',
    },
    {
      name: 'changed',
      type: 'AerisCompareInputEvent',
      defaultValue: '—',
      description:
        'Emits when a native change commits, a keyboard command runs, or setValue emits.',
    },
    {
      name: 'focused',
      type: 'FocusEvent',
      defaultValue: '—',
      description: 'Emits when the native range receives focus.',
    },
    {
      name: 'blurred',
      type: 'FocusEvent',
      defaultValue: '—',
      description: 'Emits when the native range loses focus.',
    },
    {
      name: 'touch',
      type: 'void',
      defaultValue: '—',
      description: 'Emits when the control is marked touched.',
    },
  ];
  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisCompareBefore',
      type: 'AerisCompareContentContext',
      defaultValue: 'Built-in image or label',
      description: 'Replaces the before layer.',
    },
    {
      name: 'aerisCompareAfter',
      type: 'AerisCompareContentContext',
      defaultValue: 'Built-in image or label',
      description: 'Replaces the after layer.',
    },
    {
      name: 'aerisCompareHandle',
      type: 'AerisCompareHandleContext',
      defaultValue: 'Aeris bidirectional icon',
      description: 'Replaces the handle content while retaining the accessible range.',
    },
  ];
  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'setValue(value, emitChange?)',
      type: 'void',
      defaultValue: 'emitChange = true',
      description: 'Clamps, aligns, and updates the comparison value.',
    },
    {
      name: 'focus()',
      type: 'void',
      defaultValue: '—',
      description: 'Moves focus to the native range.',
    },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-compare-min-height',
      type: '<length>',
      defaultValue: '12rem',
      description: 'Minimum comparison height.',
    },
    {
      name: '--aeris-compare-mobile-min-height',
      type: '<length>',
      defaultValue: '10rem',
      description: 'Minimum height below 32rem.',
    },
    {
      name: '--aeris-compare-border-width',
      type: '<length>',
      defaultValue: '1px',
      description: 'Surface border width.',
    },
    {
      name: '--aeris-compare-border',
      type: '<color>',
      defaultValue: 'var(--aeris-border)',
      description: 'Surface border color.',
    },
    {
      name: '--aeris-compare-radius',
      type: '<length>',
      defaultValue: 'var(--aeris-radius-lg)',
      description: 'Surface corner radius.',
    },
    {
      name: '--aeris-compare-background',
      type: '<color>',
      defaultValue: 'var(--aeris-surface-2)',
      description: 'Surface background.',
    },
    {
      name: '--aeris-compare-color',
      type: '<color>',
      defaultValue: 'var(--aeris-text)',
      description: 'Fallback content color.',
    },
    {
      name: '--aeris-compare-empty-padding',
      type: '<length>',
      defaultValue: '1.5rem',
      description: 'Empty-layer padding.',
    },
    {
      name: '--aeris-compare-empty-background',
      type: '<color>',
      defaultValue: 'var(--aeris-surface-2)',
      description: 'After empty-layer background.',
    },
    {
      name: '--aeris-compare-before-empty-background',
      type: '<color>',
      defaultValue: 'Primary surface mix',
      description: 'Before empty-layer background.',
    },
    {
      name: '--aeris-compare-muted-color',
      type: '<color>',
      defaultValue: 'var(--aeris-text-2)',
      description: 'Empty-layer text color.',
    },
    {
      name: '--aeris-compare-divider-size',
      type: '<length>',
      defaultValue: '2px',
      description: 'Divider thickness.',
    },
    {
      name: '--aeris-compare-divider-color',
      type: '<color>',
      defaultValue: '#fff',
      description: 'Divider color.',
    },
    {
      name: '--aeris-compare-divider-shadow',
      type: '<shadow>',
      defaultValue: 'Soft dark shadow',
      description: 'Divider shadow.',
    },
    {
      name: '--aeris-compare-handle-size',
      type: '<length>',
      defaultValue: '2.25rem',
      description: 'Handle width and height.',
    },
    {
      name: '--aeris-compare-mobile-handle-size',
      type: '<length>',
      defaultValue: '2rem',
      description: 'Handle size below 32rem.',
    },
    {
      name: '--aeris-compare-handle-border-width',
      type: '<length>',
      defaultValue: '2px',
      description: 'Handle border width.',
    },
    {
      name: '--aeris-compare-handle-border',
      type: '<color>',
      defaultValue: '#fff',
      description: 'Handle border color.',
    },
    {
      name: '--aeris-compare-handle-radius',
      type: '<length>',
      defaultValue: '999px',
      description: 'Handle corner radius.',
    },
    {
      name: '--aeris-compare-handle-background',
      type: '<color>',
      defaultValue: 'Translucent dark',
      description: 'Handle background.',
    },
    {
      name: '--aeris-compare-handle-color',
      type: '<color>',
      defaultValue: '#fff',
      description: 'Handle icon color.',
    },
    {
      name: '--aeris-compare-handle-shadow',
      type: '<shadow>',
      defaultValue: 'Soft dark shadow',
      description: 'Handle shadow.',
    },
    {
      name: '--aeris-compare-handle-hover-background',
      type: '<color>',
      defaultValue: 'var(--aeris-compare-handle-background)',
      description: 'Hover handle background.',
    },
    {
      name: '--aeris-compare-handle-focus-background',
      type: '<color>',
      defaultValue: 'var(--aeris-compare-handle-background)',
      description: 'Focus handle background.',
    },
    {
      name: '--aeris-compare-label-inset',
      type: '<length>',
      defaultValue: '0.75rem',
      description: 'Label inset from edges.',
    },
    {
      name: '--aeris-compare-label-padding',
      type: '<length>',
      defaultValue: '0.35rem 0.625rem',
      description: 'Label padding.',
    },
    {
      name: '--aeris-compare-label-border',
      type: '<color>',
      defaultValue: 'Translucent white',
      description: 'Label border color.',
    },
    {
      name: '--aeris-compare-label-radius',
      type: '<length>',
      defaultValue: 'var(--aeris-radius-control)',
      description: 'Label corner radius.',
    },
    {
      name: '--aeris-compare-label-background',
      type: '<color>',
      defaultValue: 'Translucent dark',
      description: 'Label background.',
    },
    {
      name: '--aeris-compare-label-color',
      type: '<color>',
      defaultValue: '#fff',
      description: 'Label text color.',
    },
    {
      name: '--aeris-compare-label-font-size',
      type: '<length>',
      defaultValue: '0.75rem',
      description: 'Label font size.',
    },
    {
      name: '--aeris-compare-focus-offset',
      type: '<length>',
      defaultValue: '3px',
      description: 'Focus outline offset.',
    },
    {
      name: '--aeris-compare-disabled-opacity',
      type: '<number>',
      defaultValue: '0.52',
      description: 'Disabled surface opacity.',
    },
  ];

  protected readonly interfacesCode = `export type AerisCompareOrientation = 'horizontal' | 'vertical';
export type AerisCompareObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface AerisCompareContentContext {
  readonly $implicit: number;
  readonly value: number;
  readonly percentage: number;
}

export interface AerisCompareHandleContext extends AerisCompareContentContext {
  readonly orientation: AerisCompareOrientation;
  readonly disabled: boolean;
}

export interface AerisCompareInputEvent {
  readonly originalEvent: Event;
  readonly value: number;
}`;
}
