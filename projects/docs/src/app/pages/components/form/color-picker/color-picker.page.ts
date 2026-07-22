import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisColorPicker,
  type AerisColorFormat,
  type AerisColorPickerChangeEvent,
} from '@aeris-ui/core/color-picker';
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
  selector: 'app-color-picker-page',
  imports: [
    AerisColorPicker,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './color-picker.page.html',
  styleUrl: './color-picker.page.scss',
})
export class ColorPickerPage {
  protected readonly brandColor = signal('#879566');
  protected readonly accentColor = signal('#dab692');
  protected readonly formatColor = signal('#879566');
  protected readonly selectedFormat = signal<AerisColorFormat>('hex');
  protected readonly invalidColor = signal('');
  protected readonly touched = signal(false);
  protected readonly lastChange = signal('No color change yet');
  protected readonly reactiveColor = new FormControl('#80939b');
  protected templateColor = '#8f5b34';
  protected readonly invalid = computed(
    () => this.touched() && this.invalidColor().trim().length === 0,
  );

  protected readonly presets: readonly string[] = [
    '#e8dfe0',
    '#879566',
    '#80939b',
    '#dab692',
    '#8f5b34',
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'color-picker-basic', label: 'Basic' },
    { id: 'color-picker-signal', label: 'Signal value' },
    { id: 'color-picker-formats', label: 'Selectable formats' },
    { id: 'color-picker-eyedropper', label: 'Screen sampling' },
    { id: 'color-picker-presets', label: 'Presets' },
    { id: 'color-picker-swatch-only', label: 'Swatch only' },
    { id: 'color-picker-sizes', label: 'Sizes' },
    { id: 'color-picker-appearances', label: 'Appearances' },
    { id: 'color-picker-clear', label: 'Clear button' },
    { id: 'color-picker-states', label: 'States' },
    { id: 'color-picker-validation', label: 'Validation' },
    { id: 'color-picker-forms', label: 'Angular Forms' },
    { id: 'color-picker-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'color-picker-api-inputs', label: 'Inputs' },
    { id: 'color-picker-api-outputs', label: 'Outputs' },
    { id: 'color-picker-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisColorPicker } from '@aeris-ui/core/color-picker';`;

  protected readonly signalCode = `protected readonly brandColor = signal('#879566');`;

  protected readonly formatCode = `protected readonly formatColor = signal('#879566');
protected readonly selectedFormat = signal<AerisColorFormat>('hex');`;

  protected readonly presetsCode = `protected readonly presets: readonly string[] = [
  '#e8dfe0',
  '#879566',
  '#80939b',
  '#dab692',
  '#8f5b34',
];`;

  protected readonly validationCode = `protected readonly invalidColor = signal('');
protected readonly touched = signal(false);
protected readonly invalid = computed(
  () => this.touched() && this.invalidColor().trim().length === 0,
);`;

  protected readonly formsCode = `protected readonly reactiveColor =
  new FormControl('#80939b');

protected templateColor = '#8f5b34';`;

  protected readonly eventsCode = `protected readonly lastChange = signal('No color change yet');

protected recordChange(event: AerisColorPickerChangeEvent): void {
  this.lastChange.set(\`Selected \${event.value}\`);
}`;

  protected readonly interfacesCode = `type AerisColorPickerSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisColorPickerAppearance = 'outline' | 'filled';
type AerisColorFormat = 'hex' | 'rgb' | 'hsl';

interface AerisColorPickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly hex: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'string (model)',
      defaultValue: "'#879566'",
      description: 'Current color value with two-way binding and Forms support.',
    },
    {
      name: 'format',
      type: 'AerisColorFormat (model)',
      defaultValue: "'hex'",
      description:
        'Active output format. Users can change it from the panel when format selection is enabled.',
    },
    {
      name: 'inputId',
      type: 'string',
      defaultValue: 'generated',
      description: 'ID assigned to the visible color-picker trigger for label association.',
    },
    {
      name: 'name',
      type: 'string',
      defaultValue: "''",
      description: 'Native form field name submitted through a hidden input.',
    },
    {
      name: 'formats',
      type: 'readonly AerisColorFormat[]',
      defaultValue: "['hex', 'rgb', 'hsl']",
      description: 'Formats offered by the panel format selector.',
    },
    {
      name: 'placeholder',
      type: 'string',
      defaultValue: "'Enter color'",
      description: 'Placeholder for the optional text input.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'Accessible name for the visible trigger when no visible label is available.',
    },
    {
      name: 'ariaLabelledby',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'IDs of visible elements that label the trigger.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string | undefined',
      defaultValue: 'undefined',
      description: 'IDs of help and validation messages.',
    },
    {
      name: 'triggerAriaLabel',
      type: 'string',
      defaultValue: "'Choose color'",
      description: 'Accessible name for the visible trigger button.',
    },
    {
      name: 'nativeAriaLabel',
      type: 'string',
      defaultValue: "'Color picker'",
      description: 'Deprecated compatibility alias used when panelAriaLabel is empty.',
    },
    {
      name: 'panelAriaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for the custom picker dialog.',
    },
    {
      name: 'textAriaLabel',
      type: 'string',
      defaultValue: "'Color value'",
      description: 'Accessible name for the text input.',
    },
    {
      name: 'formatAriaLabel',
      type: 'string',
      defaultValue: "'Color format'",
      description: 'Accessible name for the format selector.',
    },
    {
      name: 'hueAriaLabel',
      type: 'string',
      defaultValue: "'Hue'",
      description: 'Accessible name for the hue slider.',
    },
    {
      name: 'planeAriaLabel',
      type: 'string',
      defaultValue: "'Saturation and brightness'",
      description: 'Accessible name for the two-dimensional color plane.',
    },
    {
      name: 'presetsAriaLabel',
      type: 'string',
      defaultValue: "'Preset colors'",
      description: 'Accessible name for the preset list.',
    },
    {
      name: 'presetsLabel',
      type: 'string',
      defaultValue: "'Presets'",
      description: 'Visible heading shown above preset colors in the panel.',
    },
    {
      name: 'emptyLabel',
      type: 'string',
      defaultValue: "'No color'",
      description: 'Visible value text when the value is empty.',
    },
    {
      name: 'clearButtonAriaLabel',
      type: 'string',
      defaultValue: "'Clear color'",
      description: 'Accessible name for the clear button.',
    },
    {
      name: 'closeButtonAriaLabel',
      type: 'string',
      defaultValue: "'Close color picker'",
      description: 'Accessible name for panel dismissal controls.',
    },
    {
      name: 'eyeDropperAriaLabel',
      type: 'string',
      defaultValue: "'Pick a color from the screen'",
      description: 'Accessible name for the optional browser-provided eyedropper action.',
    },
    {
      name: 'size',
      type: 'AerisColorPickerSize',
      defaultValue: "'md'",
      description: 'Control height and typography size.',
    },
    {
      name: 'appearance',
      type: 'AerisColorPickerAppearance',
      defaultValue: "'outline'",
      description: 'Outlined or filled visual treatment.',
    },
    {
      name: 'presets',
      type: 'readonly string[]',
      defaultValue: '[]',
      description:
        'Preset colors shown inside the picker panel. Hex, rgb(), and hsl() strings are accepted.',
    },
    {
      name: 'showInput',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the editable text value input next to the trigger.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Shows the formatted color text inside the trigger. When false, the trigger becomes a square swatch button.',
    },
    {
      name: 'showFormat',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the format selector when more than one format is available.',
    },
    {
      name: 'showEyeDropper',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Shows screen-color sampling when the secure-context EyeDropper API is available.',
    },
    {
      name: 'clearable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows a clear action while a value exists.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables interaction and form submission.',
    },
    {
      name: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Allows the value to be read without editing.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Exposes native required validation semantics.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Applies invalid styling and synchronizes aria-invalid.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Fills the available inline space.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'valueChange',
      type: 'string',
      defaultValue: '-',
      description: 'Emitted automatically by the value model.',
    },
    {
      name: 'formatChange',
      type: 'AerisColorFormat',
      defaultValue: '-',
      description: 'Emitted automatically when the format model changes.',
    },
    {
      name: 'valueInput',
      type: 'string',
      defaultValue: '-',
      description: 'Emitted when user interaction changes the value.',
    },
    {
      name: 'changed',
      type: 'AerisColorPickerChangeEvent',
      defaultValue: '-',
      description:
        'Emitted when the user commits a plane, hue, format, text, preset, or screen-sampled change.',
    },
    {
      name: 'focused',
      type: 'FocusEvent',
      defaultValue: '-',
      description: 'Emitted when an editable picker control receives focus.',
    },
    {
      name: 'blurred',
      type: 'FocusEvent',
      defaultValue: '-',
      description: 'Emitted when an editable picker control loses focus.',
    },
    {
      name: 'touch',
      type: 'void',
      defaultValue: '-',
      description: 'Emitted when focus leaves the complete picker.',
    },
    {
      name: 'cleared',
      type: 'void',
      defaultValue: '-',
      description: 'Emitted after the clear action succeeds.',
    },
    {
      name: 'opened',
      type: 'void',
      defaultValue: '-',
      description: 'Emitted after the custom picker panel opens.',
    },
    {
      name: 'closed',
      type: 'void',
      defaultValue: '-',
      description: 'Emitted after the custom picker panel closes.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focus(options?)',
      type: 'void',
      defaultValue: '-',
      description: 'Moves focus to the visible trigger button.',
    },
    {
      name: 'open()',
      type: 'void',
      defaultValue: '-',
      description: 'Opens the custom picker panel and focuses the color plane.',
    },
    {
      name: 'close(restoreFocus?)',
      type: 'void',
      defaultValue: '-',
      description: 'Closes the panel and optionally restores trigger focus.',
    },
    {
      name: 'toggle()',
      type: 'void',
      defaultValue: '-',
      description: 'Toggles the custom picker panel.',
    },
    {
      name: 'clear()',
      type: 'void',
      defaultValue: '-',
      description: 'Clears the value and restores focus.',
    },
    {
      name: 'reset()',
      type: 'void',
      defaultValue: '-',
      description: 'Restores the default Aeris palette color.',
    },
  ];

  protected recordChange(event: AerisColorPickerChangeEvent): void {
    this.lastChange.set(`Selected ${event.value}`);
  }
}
