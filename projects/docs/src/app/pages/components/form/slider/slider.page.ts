import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisSlider,
  type AerisSliderChangeEvent,
  type AerisSliderInputEvent,
  type AerisSliderValue,
} from '@aeris-ui/core/slider';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-slider-page',
  imports: [
    AerisSlider,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './slider.page.html',
  styleUrl: './slider.page.scss',
})
export class SliderPage {
  protected readonly volume = signal<AerisSliderValue>(42);
  protected readonly priceRange = signal<AerisSliderValue>([25, 75]);
  protected readonly temperature = signal<AerisSliderValue>(20);
  protected readonly eventValue = signal<AerisSliderValue>(35);
  protected readonly liveEvent = signal('No interaction');
  protected readonly changeEvent = signal('No committed change');
  protected readonly reactiveValue = new FormControl<AerisSliderValue>(55);
  protected templateValue: AerisSliderValue = [20, 60];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'slider-basic', label: 'Basic' },
    { id: 'slider-range', label: 'Range' },
    { id: 'slider-step', label: 'Step and ticks' },
    { id: 'slider-values', label: 'Values and tooltips' },
    { id: 'slider-orientation', label: 'Orientation' },
    { id: 'slider-reversed', label: 'Reversed' },
    { id: 'slider-sizes', label: 'Sizes' },
    { id: 'slider-states', label: 'States' },
    { id: 'slider-events', label: 'Events' },
    { id: 'slider-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'slider-api-inputs', label: 'Inputs' },
    { id: 'slider-api-outputs', label: 'Outputs' },
    { id: 'slider-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisSlider } from '@aeris-ui/core/slider';`;

  protected readonly basicCode = `protected readonly volume =
  signal<AerisSliderValue>(42);`;

  protected readonly rangeCode = `protected readonly priceRange =
  signal<AerisSliderValue>([25, 75]);`;

  protected readonly formatterCode = `protected readonly formatCurrency = (
  value: number,
): string => \`$\${value}\`;`;

  protected readonly eventsCode = `protected handleSliding(
  event: AerisSliderInputEvent,
): void {
  this.liveEvent.set(
    \`\${event.thumb}: \${String(event.value)}\`,
  );
}

protected handleChanged(
  event: AerisSliderChangeEvent,
): void {
  this.changeEvent.set(
    \`\${event.thumb}: \${String(event.value)}\`,
  );
}`;

  protected readonly formsCode = `protected readonly reactiveValue =
  new FormControl<AerisSliderValue>(55);

protected templateValue: AerisSliderValue =
  [20, 60];`;

  protected readonly interfacesCode = `type AerisSliderSize =
  | 'xs' | 'sm' | 'md' | 'lg';

type AerisSliderOrientation =
  | 'horizontal' | 'vertical';

type AerisSliderThumb =
  | 'single' | 'lower' | 'upper';

type AerisSliderValue =
  | number
  | readonly [number, number];

interface AerisSliderInputEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}

interface AerisSliderChangeEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: AerisSliderValue;
  readonly thumb: AerisSliderThumb;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'AerisSliderValue (model)', defaultValue: '0', description: 'Single number or two-number range with two-way binding support.' },
    { name: 'range', type: 'boolean', defaultValue: 'false', description: 'Enables lower and upper thumbs.' },
    { name: 'min', type: 'number', defaultValue: '0', description: 'Minimum slider value.' },
    { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum slider value.' },
    { name: 'step', type: 'number', defaultValue: '1', description: 'Value interval used by pointer alignment and arrow keys.' },
    { name: 'minRange', type: 'number', defaultValue: '0', description: 'Minimum permitted distance between range thumbs.' },
    { name: 'pageStep', type: 'number | undefined', defaultValue: '10% of range', description: 'Increment used by Page Up and Page Down.' },
    { name: 'orientation', type: 'AerisSliderOrientation', defaultValue: "'horizontal'", description: 'Horizontal or vertical track layout.' },
    { name: 'reversed', type: 'boolean', defaultValue: 'false', description: 'Reverses visual direction and arrow-key increments.' },
    { name: 'size', type: 'AerisSliderSize', defaultValue: "'md'", description: 'Track thickness and thumb size.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Hidden native form field name.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'Single-thumb ID or base ID for range thumbs.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Value'", description: 'Accessible name for a single slider thumb.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of external elements labelling a single thumb.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of shared instructions and validation messages.' },
    { name: 'lowerAriaLabel', type: 'string', defaultValue: "'Minimum value'", description: 'Accessible name for the lower range thumb.' },
    { name: 'upperAriaLabel', type: 'string', defaultValue: "'Maximum value'", description: 'Accessible name for the upper range thumb.' },
    { name: 'lowerAriaLabelledby', type: 'string', defaultValue: "''", description: 'External label IDs for the lower thumb.' },
    { name: 'upperAriaLabelledby', type: 'string', defaultValue: "''", description: 'External label IDs for the upper thumb.' },
    { name: 'valueText', type: '((value: number) => string) | null', defaultValue: 'null', description: 'Formats visible values, tooltips, and aria-valuetext.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Shows current values beside the track.' },
    { name: 'showTooltip', type: 'boolean', defaultValue: 'false', description: 'Shows a value tooltip on hover, focus, and drag.' },
    { name: 'showTicks', type: 'boolean', defaultValue: 'false', description: 'Shows one tick for each step when within maxTicks.' },
    { name: 'maxTicks', type: 'number', defaultValue: '101', description: 'Prevents excessive tick rendering for dense ranges.' },
    { name: 'showMinMax', type: 'boolean', defaultValue: 'false', description: 'Shows formatted minimum and maximum labels.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables pointer, keyboard, and form interaction.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Keeps thumbs focusable while preventing changes.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Expands a horizontal slider to available width.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'AerisSliderValue', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'valueInput', type: 'AerisSliderValue', defaultValue: '-', description: 'Emitted whenever interaction updates the value.' },
    { name: 'sliding', type: 'AerisSliderInputEvent', defaultValue: '-', description: 'Continuous pointer and keyboard value updates.' },
    { name: 'changed', type: 'AerisSliderChangeEvent', defaultValue: '-', description: 'Committed keyboard update or completed pointer drag.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when either thumb receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when a thumb loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on thumb blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(thumb?)', type: 'void', defaultValue: '-', description: 'Focuses the single, lower, or upper thumb.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Resets a single slider to min or a range slider to [min, max].' },
  ];

  protected readonly formatCurrency = (value: number): string => `$${value}`;

  protected handleSliding(event: AerisSliderInputEvent): void {
    this.liveEvent.set(`${event.thumb}: ${String(event.value)}`);
  }

  protected handleChanged(event: AerisSliderChangeEvent): void {
    this.changeEvent.set(`${event.thumb}: ${String(event.value)}`);
  }
}
