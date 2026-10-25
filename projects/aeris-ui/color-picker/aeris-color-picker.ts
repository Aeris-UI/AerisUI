import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵAerisIcon, ɵaerisDisplayInvalid } from '@aeris-ui/core';
import {
  ɵAerisAppendTo,
  type AerisAppendTo,
  type AerisOverlayCollisionPadding,
} from '@aeris-ui/core';

export type AerisColorPickerSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisColorPickerAppearance = 'outline' | 'filled';
export type AerisColorFormat = 'hex' | 'rgb' | 'hsl';
export type AerisColorPickerPresentation = 'picker' | 'palette' | 'area' | 'slider';
export type AerisColorPickerChannel =
  'hue' | 'saturation' | 'brightness' | 'lightness' | 'red' | 'green' | 'blue' | 'alpha';
export type AerisColorPickerOrientation = 'horizontal' | 'vertical';

export interface AerisColorPickerPreset {
  readonly value: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

interface PresetView {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly color: string;
  readonly selected: boolean;
  readonly translucent: boolean;
}

export interface AerisColorPickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly hex: string;
}

interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

interface HsvColor {
  readonly h: number;
  readonly s: number;
  readonly v: number;
}

interface HslColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

interface EyeDropperResult {
  readonly sRGBHex: string;
}

interface EyeDropperInstance {
  open(options?: { readonly signal?: AbortSignal }): Promise<EyeDropperResult>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

let colorPickerId = 0;

@Component({
  selector: 'aeris-color-picker',
  imports: [ɵAerisIcon, NgTemplateOutlet, ɵAerisAppendTo],
  template: `
    <div
      class="aeris-color-picker"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-invalid]="displayInvalid() || null"
      [attr.data-fluid]="fluid() || null"
      [attr.data-open]="isOpen() || null"
      [attr.data-presentation]="presentation()"
      (focusout)="handleFocusOut($event)"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="value()" [disabled]="effectiveDisabled()" />
      }

      @if (presentation() === 'palette') {
        <ng-container [ngTemplateOutlet]="presetPalette" />
      } @else if (presentation() === 'area') {
        <ng-container [ngTemplateOutlet]="colorArea" />
      } @else if (presentation() === 'slider') {
        <label
          class="aeris-color-picker__hue aeris-color-picker__channel"
          [attr.data-orientation]="orientation()"
          [attr.data-alpha]="channel() === 'alpha' || null"
          [style.--aeris-color-picker-channel-gradient]="channelGradient()"
          [style.--aeris-color-picker-hue-color]="previewColor()"
        >
          <span
            >{{ channelLabel() }} <output>{{ channelText() }}</output></span
          >
          <input
            #channelInput
            type="range"
            [id]="resolvedInputId()"
            min="0"
            [max]="channelMax()"
            step="1"
            [value]="channelValue()"
            [disabled]="effectiveDisabled()"
            [attr.aria-readonly]="readonly() || null"
            [attr.aria-label]="ariaLabel() || channelLabel()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-invalid]="displayInvalid() || null"
            [attr.aria-valuetext]="channelText()"
            [attr.aria-orientation]="orientation()"
            (keydown)="handleChannelKeydown($event)"
            (pointerdown)="guardReadonlySlider($event)"
            (input)="handleChannelInput($event)"
            (change)="emitCommitted($event)"
            (focus)="focused.emit($event)"
            (blur)="handleBlur($event)"
          />
        </label>
      } @else {
        <button
          #triggerButton
          class="aeris-color-picker__trigger"
          type="button"
          [id]="resolvedInputId()"
          [disabled]="effectiveDisabled() || readonly()"
          [attr.aria-label]="ariaLabel() || triggerAriaLabel()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-invalid]="displayInvalid() || null"
          [attr.aria-required]="required() || null"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-controls]="panelId"
          aria-haspopup="dialog"
          [attr.data-swatch-only]="!showValue() || null"
          (click)="toggle()"
          (keydown)="handleTriggerKeydown($event)"
          (focus)="focused.emit($event)"
          (blur)="handleBlur($event)"
        >
          <span
            class="aeris-color-picker__swatch"
            [style.background-color]="previewColor()"
            [style.--aeris-color-picker-preview-color]="previewColor()"
            [attr.data-translucent]="opacity() < 1 || null"
            aria-hidden="true"
          ></span>
          @if (showValue()) {
            <span class="aeris-color-picker__value">{{ value() || emptyLabel() }}</span>
          }
          <span class="aeris-color-picker__indicator" aria-hidden="true"></span>
        </button>

        @if (showInput()) {
          <input
            class="aeris-color-picker__text"
            type="text"
            [value]="textValue()"
            [placeholder]="placeholder()"
            [disabled]="effectiveDisabled()"
            [readOnly]="readonly()"
            [required]="required()"
            [attr.aria-label]="textAriaLabel()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-invalid]="displayInvalid() || textInvalid() || null"
            autocomplete="off"
            spellcheck="false"
            (input)="handleTextInput($event)"
            (change)="handleTextChange($event)"
            (keydown)="handleTextKeydown($event)"
            (focus)="focused.emit($event)"
            (blur)="handleBlur($event)"
          />
        }

        @if (clearable() && value()) {
          <button
            class="aeris-color-picker__clear"
            type="button"
            [disabled]="effectiveDisabled() || readonly()"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="clear()"
          >
            @if (clearIconTemplate(); as customIcon) {
              <span aria-hidden="true" data-aeris-custom-icon
                ><ng-container [ngTemplateOutlet]="customIcon"
              /></span>
            } @else {
              <span aerisInternalIcon="close" aria-hidden="true"></span>
            }
          </button>
        }

        @if (isOpen()) {
          <section
            #pickerPanel
            class="aeris-color-picker__panel"
            [aerisInternalAppendTo]="appendTo()"
            [aerisInternalAppendToDismiss]="dismissOverlay"
            [aerisInternalAppendToAnchor]="this.triggerButton()?.nativeElement ?? null"
            [aerisInternalAppendToCollisionPadding]="viewportMargin()"
            [aerisInternalAppendToOffset]="8"
            (aerisInternalAppendToOutside)="close(false)"
            role="dialog"
            [id]="panelId"
            [attr.aria-label]="resolvedPanelAriaLabel()"
            (pointerdown)="handlePanelPointerDown()"
            (keydown)="handlePanelKeydown($event)"
          >
            <header class="aeris-color-picker__panel-header">
              <span
                class="aeris-color-picker__preview"
                [style.background-color]="previewColor()"
                [style.--aeris-color-picker-preview-color]="previewColor()"
                [attr.data-translucent]="opacity() < 1 || null"
                aria-hidden="true"
              ></span>
              <span>
                <strong>{{ value() || emptyLabel() }}</strong>
                <small>{{ format().toUpperCase() }} color</small>
              </span>
              <span class="aeris-color-picker__panel-actions">
                @if (showEyeDropper() && eyeDropperAvailable()) {
                  <button
                    class="aeris-color-picker__eyedropper"
                    type="button"
                    [disabled]="eyeDropperActive()"
                    [attr.aria-label]="eyeDropperAriaLabel()"
                    [attr.aria-busy]="eyeDropperActive() || null"
                    (click)="openEyeDropper($event)"
                  >
                    @if (eyedropperIconTemplate(); as customIcon) {
                      <span aria-hidden="true" data-aeris-custom-icon
                        ><ng-container [ngTemplateOutlet]="customIcon"
                      /></span>
                    } @else {
                      <span aerisInternalIcon="eyedropper" aria-hidden="true"></span>
                    }
                  </button>
                }
                <button
                  class="aeris-color-picker__close"
                  type="button"
                  [attr.aria-label]="closeButtonAriaLabel()"
                  (click)="close(true)"
                >
                  @if (closeIconTemplate(); as customIcon) {
                    <span aria-hidden="true" data-aeris-custom-icon
                      ><ng-container [ngTemplateOutlet]="customIcon"
                    /></span>
                  } @else {
                    <span aerisInternalIcon="close" aria-hidden="true"></span>
                  }
                </button>
              </span>
            </header>

            <ng-container [ngTemplateOutlet]="colorArea" />

            <label class="aeris-color-picker__hue">
              <span
                >Hue <output>{{ hsvValue().h }}°</output></span
              >
              <input
                type="range"
                min="0"
                max="359"
                step="1"
                [value]="hsvValue().h"
                [attr.aria-label]="hueAriaLabel()"
                [style.--aeris-color-picker-hue-color]="hueColor()"
                (input)="handleHueInput($event)"
                (change)="emitCommitted($event)"
                (focus)="focused.emit($event)"
                (blur)="handleBlur($event)"
              />
            </label>

            @if (alpha()) {
              <label class="aeris-color-picker__hue aeris-color-picker__alpha">
                <span
                  >{{ opacityLabel() }} <output>{{ opacityPercent() }}%</output></span
                >
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  [value]="opacityPercent()"
                  [attr.aria-label]="alphaAriaLabel()"
                  [attr.aria-valuetext]="opacityPercent() + '%'"
                  [style.--aeris-color-picker-alpha-color]="opaqueHex()"
                  [style.--aeris-color-picker-hue-color]="opaqueHex()"
                  (input)="handleAlphaInput($event)"
                  (change)="emitCommitted($event)"
                  (focus)="focused.emit($event)"
                  (blur)="handleBlur($event)"
                />
              </label>
            }

            @if (showFormat() && normalizedFormats().length > 1) {
              <div
                class="aeris-color-picker__formats"
                role="group"
                [attr.aria-label]="formatAriaLabel()"
              >
                @for (option of normalizedFormats(); track option) {
                  <button
                    type="button"
                    [attr.aria-pressed]="format() === option"
                    (click)="selectFormat(option, $event)"
                  >
                    {{ option.toUpperCase() }}
                  </button>
                }
              </div>
            }

            <label class="aeris-color-picker__panel-value">
              <span>{{ format().toUpperCase() }} value</span>
              <input
                type="text"
                [value]="textValue()"
                [placeholder]="placeholder()"
                [attr.aria-invalid]="textInvalid() || null"
                autocomplete="off"
                spellcheck="false"
                (input)="handleTextInput($event)"
                (change)="handleTextChange($event)"
                (keydown)="handleTextKeydown($event)"
                (focus)="focused.emit($event)"
                (blur)="handleBlur($event)"
              />
            </label>

            @if (normalizedPresets().length) {
              <div class="aeris-color-picker__preset-section">
                <span>{{ presetsLabel() }}</span>
                <ng-container [ngTemplateOutlet]="presetPalette" />
              </div>
            }
          </section>
        }
      }
      <ng-template #colorArea>
        <div
          #colorPlane
          class="aeris-color-picker__plane"
          role="slider"
          [id]="presentation() === 'area' ? resolvedInputId() : null"
          [tabIndex]="effectiveDisabled() ? -1 : 0"
          aria-orientation="horizontal"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-label]="
            presentation() === 'area' ? ariaLabel() || planeAriaLabel() : planeAriaLabel()
          "
          [attr.aria-labelledby]="presentation() === 'area' ? ariaLabelledBy() : null"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-disabled]="effectiveDisabled() || null"
          [attr.aria-readonly]="readonly() || null"
          [attr.aria-invalid]="displayInvalid() || null"
          [attr.data-dots]="showDots() || null"
          [attr.aria-valuenow]="hsvValue().v"
          [attr.aria-valuetext]="planeAriaValue()"
          [style.--aeris-color-picker-plane-hue]="hueColor()"
          (pointerdown)="handlePlanePointerDown($event)"
          (pointermove)="handlePlanePointerMove($event)"
          (pointerup)="handlePlanePointerUp($event)"
          (pointercancel)="handlePlanePointerCancel($event)"
          (keydown)="handlePlaneKeydown($event)"
          (focus)="focused.emit($event)"
          (blur)="handleBlur($event)"
        >
          <span
            class="aeris-color-picker__plane-thumb"
            [style.left.%]="hsvValue().s"
            [style.top.%]="100 - hsvValue().v"
            aria-hidden="true"
          ></span>
        </div>
      </ng-template>
      <ng-template #presetPalette>
        <div
          class="aeris-color-picker__presets"
          role="group"
          [id]="presentation() === 'palette' ? resolvedInputId() : null"
          [attr.aria-label]="
            presentation() === 'palette' ? ariaLabel() || presetsAriaLabel() : presetsAriaLabel()
          "
          [attr.aria-labelledby]="presentation() === 'palette' ? ariaLabelledBy() : null"
          [attr.aria-describedby]="presentation() === 'palette' ? ariaDescribedBy() : null"
          [attr.aria-invalid]="displayInvalid() || null"
          (keydown)="handlePresetKeydown($event)"
        >
          @for (preset of normalizedPresets(); track preset.value) {
            <button
              type="button"
              [disabled]="effectiveDisabled() || readonly() || preset.disabled"
              [tabIndex]="preset.value === presetTabStop() ? 0 : -1"
              [attr.aria-label]="preset.label"
              [attr.aria-pressed]="preset.selected"
              [style.background-color]="preset.color"
              [style.--aeris-color-picker-preview-color]="preset.color"
              [attr.data-translucent]="preset.translucent || null"
              (focus)="presetFocus.set(preset.value); focused.emit($event)"
              (blur)="handleBlur($event)"
              (click)="selectPreset(preset, $event)"
            >
              @if (preset.selected) {
                <span class="aeris-color-picker__preset-check" aria-hidden="true"
                  ><span aerisInternalIcon="check"></span
                ></span>
              }
            </button>
          }
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './aeris-color-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisColorPicker),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisColorPicker implements ControlValueAccessor {
  readonly clearIconTemplate = input<TemplateRef<void>>();
  readonly eyedropperIconTemplate = input<TemplateRef<void>>();
  readonly closeIconTemplate = input<TemplateRef<void>>();

  protected readonly dismissOverlay = (): boolean => {
    this.close(true);
    return true;
  };

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly pickerPanel = viewChild<ElementRef<HTMLElement>>('pickerPanel');
  private readonly panelPortal = viewChild(ɵAerisAppendTo);
  private readonly colorPlane = viewChild<ElementRef<HTMLElement>>('colorPlane');
  private readonly channelInput = viewChild<ElementRef<HTMLInputElement>>('channelInput');
  protected readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  private readonly generatedId = `aeris-color-picker-${++colorPickerId}`;
  private readonly formDisabled = signal(false);
  private readonly textDraft = signal('');
  private readonly planeDragging = signal(false);
  private readonly hsvDraft = signal<HsvColor | null>(null);
  private readonly hslDraft = signal<HslColor | null>(null);
  private panelPointerInteraction = false;
  private eyeDropperAbortController: AbortController | null = null;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly panelId = `${this.generatedId}-panel`;
  readonly value = model('#2c694b');
  readonly format = model<AerisColorFormat>('hex');
  readonly inputId = input('');
  readonly name = input('');
  readonly formats = input<readonly AerisColorFormat[]>(['hex', 'rgb', 'hsl']);
  readonly appendTo = input<AerisAppendTo>();
  readonly viewportMargin = input<number | AerisOverlayCollisionPadding>(8);
  readonly placeholder = input('Enter color');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly ariaDescribedBy = input<string>();
  readonly triggerAriaLabel = input('Choose color');
  /** @deprecated Use panelAriaLabel instead. */
  readonly nativeAriaLabel = input('Color picker');
  readonly panelAriaLabel = input('');
  readonly textAriaLabel = input('Color value');
  readonly formatAriaLabel = input('Color format');
  readonly hueAriaLabel = input('Hue');
  readonly alpha = input(false, { transform: booleanAttribute });
  readonly opacityLabel = input('Opacity');
  readonly alphaAriaLabel = input('Opacity');
  readonly planeAriaLabel = input('Saturation and brightness');
  readonly presetsAriaLabel = input('Preset colors');
  readonly presetsLabel = input('Presets');
  readonly emptyLabel = input('No color');
  readonly clearButtonAriaLabel = input('Clear color');
  readonly closeButtonAriaLabel = input('Close color picker');
  readonly eyeDropperAriaLabel = input('Pick a color from the screen');
  readonly size = input<AerisColorPickerSize>('md');
  readonly appearance = input<AerisColorPickerAppearance>('outline');
  readonly presentation = input<AerisColorPickerPresentation>('picker');
  readonly channel = input<AerisColorPickerChannel>('hue');
  readonly orientation = input<AerisColorPickerOrientation>('horizontal');
  readonly showDots = input(false, { transform: booleanAttribute });
  readonly presets = input<readonly (string | AerisColorPickerPreset)[]>([]);
  readonly showInput = input(true, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly showFormat = input(true, { transform: booleanAttribute });
  readonly showEyeDropper = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly changed = output<AerisColorPickerChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();
  readonly cleared = output<void>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly isOpen = signal(false);
  protected readonly presetFocus = signal<string | null>(null);
  private readonly selectedPreset = signal<string | null>(null);
  protected readonly eyeDropperAvailable = signal(false);
  protected readonly eyeDropperActive = signal(false);
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly resolvedPanelAriaLabel = computed(
    () => this.panelAriaLabel() || this.nativeAriaLabel(),
  );
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  private readonly opacityEnabled = computed(
    () => this.alpha() || (this.presentation() === 'slider' && this.channel() === 'alpha'),
  );
  protected readonly parsedValue = computed(() => parseColor(this.value(), this.opacityEnabled()));
  protected readonly opacity = computed(() => this.parsedValue()?.alpha ?? 1);
  protected readonly opacityPercent = computed(() => Math.round(this.opacity() * 100));
  protected readonly opaqueHex = computed(() => this.parsedValue()?.hex ?? '#000000');
  protected readonly hexValue = computed(() => {
    const parsed = this.parsedValue();
    return parsed ? formatColor(parsed.rgb, 'hex', parsed.alpha) : '#000000';
  });
  protected readonly previewColor = computed(() => {
    const parsed = this.parsedValue();
    return parsed
      ? formatColor(parsed.rgb, parsed.alpha < 1 ? 'rgb' : 'hex', parsed.alpha)
      : '#000000';
  });
  protected readonly hsvValue = computed(() => {
    const parsed = this.parsedValue();
    const draft = this.hsvDraft();
    if (parsed && draft && rgbToHex(hsvToRgb(draft)) === parsed.hex) return draft;
    return rgbToHsv(parsed?.rgb ?? { r: 0, g: 0, b: 0 });
  });
  protected readonly hueColor = computed(() => `hsl(${this.hsvValue().h}, 100%, 50%)`);
  private readonly hslValue = computed(() => {
    const rgb = this.parsedValue()?.rgb ?? { r: 0, g: 0, b: 0 };
    const draft = this.hslDraft();
    const draftRgb = draft && hslToRgb(draft.h, draft.s, draft.l);
    return draft && draftRgb && rgbToHex(draftRgb) === rgbToHex(rgb) ? draft : rgbToHsl(rgb);
  });
  protected readonly channelLabel = computed(() => {
    const channel = this.channel();
    return channel === 'alpha' ? this.opacityLabel() : channel[0].toUpperCase() + channel.slice(1);
  });
  protected readonly channelMax = computed(() =>
    this.channel() === 'hue' ? 359 : ['red', 'green', 'blue'].includes(this.channel()) ? 255 : 100,
  );
  protected readonly channelValue = computed(() => {
    const rgb = this.parsedValue()?.rgb ?? { r: 0, g: 0, b: 0 };
    switch (this.channel()) {
      case 'hue':
        return this.hsvValue().h;
      case 'saturation':
        return this.hsvValue().s;
      case 'brightness':
        return this.hsvValue().v;
      case 'lightness':
        return this.hslValue().l;
      case 'red':
        return rgb.r;
      case 'green':
        return rgb.g;
      case 'blue':
        return rgb.b;
      case 'alpha':
        return this.opacityPercent();
    }
  });
  protected readonly channelText = computed(
    () =>
      `${Math.round(this.channelValue())}${this.channel() === 'hue' ? '°' : this.channelMax() === 100 ? '%' : ''}`,
  );
  protected readonly channelGradient = computed(() => {
    const colors =
      this.channel() === 'hue'
        ? ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00']
        : (this.channel() === 'lightness' ? [0, 50, 100] : [0, this.channelMax()]).map((value) => {
            const color = this.colorForChannel(value);
            return formatColor(color.rgb, 'rgb', color.alpha);
          });
    return `linear-gradient(${this.orientation() === 'vertical' ? 'to top' : 'to right'}, ${colors.join(', ')})`;
  });
  protected readonly planeAriaValue = computed(
    () => `Saturation ${this.hsvValue().s}%, brightness ${this.hsvValue().v}%`,
  );
  protected readonly textValue = computed(() => this.textDraft() || this.value());
  protected readonly textInvalid = computed(
    () => Boolean(this.textDraft()) && !parseColor(this.textDraft(), this.opacityEnabled()),
  );
  protected readonly normalizedFormats = computed<readonly AerisColorFormat[]>(() => {
    const configuredFormats = [...new Set(this.formats().filter(isColorFormat))];
    return configuredFormats.includes(this.format())
      ? configuredFormats
      : [...configuredFormats, this.format()];
  });
  protected readonly normalizedPresets = computed(() => {
    const unique = new Map<string, PresetView>();
    for (const preset of this.presets()) {
      const entry = typeof preset === 'string' ? { value: preset } : preset;
      const parsed = parseColor(entry.value, this.opacityEnabled());
      if (!parsed) continue;
      // Keep explicit alpha (including 1) and decimal precision when a preset is activated.
      const value = parsed.hasAlpha ? entry.value.trim() : parsed.hex;
      const opacity = parsed.hasAlpha ? parsed.alpha : this.opacity();
      unique.set(`${parsed.hex}:${parsed.hasAlpha ? parsed.alpha : 'inherit'}`, {
        value,
        label: entry.label?.trim() || `Select ${value}`,
        disabled: entry.disabled ?? false,
        color: formatColor(parsed.rgb, opacity < 1 ? 'rgb' : 'hex', opacity),
        selected:
          Boolean(this.parsedValue()) &&
          parsed.hex === this.opaqueHex() &&
          (!parsed.hasAlpha || Math.abs(parsed.alpha - this.opacity()) <= 0.00000001),
        translucent: opacity < 1,
      });
    }
    const candidates = [...unique.values()];
    const selected =
      candidates.find((preset) => preset.selected && preset.value === this.selectedPreset()) ??
      candidates.find((preset) => preset.selected);
    return candidates.map((preset) => ({ ...preset, selected: preset === selected }));
  });
  protected readonly presetTabStop = computed(() => {
    if (this.effectiveDisabled() || this.readonly()) return null;
    const enabled = this.normalizedPresets().filter((preset) => !preset.disabled);
    return (
      (
        enabled.find((preset) => preset.value === this.presetFocus()) ??
        enabled.find((preset) => preset.selected) ??
        enabled[0]
      )?.value ?? null
    );
  });
  private readonly closeUnavailablePanel = effect(() => {
    if (
      (this.effectiveDisabled() || this.readonly() || this.presentation() !== 'picker') &&
      this.isOpen()
    )
      this.close(false);
  });

  constructor() {
    afterNextRender({
      write: () => this.eyeDropperAvailable.set(Boolean(getEyeDropperConstructor())),
    });
    effect((onCleanup) => {
      if (!this.isOpen()) return;
      const view = this.host.nativeElement.ownerDocument.defaultView;
      const endPointerInteraction = () => this.endPanelPointerInteraction();
      view?.addEventListener('pointerup', endPointerInteraction);
      view?.addEventListener('pointercancel', endPointerInteraction);
      onCleanup(() => {
        view?.removeEventListener('pointerup', endPointerInteraction);
        view?.removeEventListener('pointercancel', endPointerInteraction);
      });
    });
  }

  writeValue(value: unknown): void {
    this.value.set(this.coerceValue(value));
    this.textDraft.set('');
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) this.close(false);
  }

  focus(options?: FocusOptions): void {
    if (this.presentation() === 'area') {
      this.colorPlane()?.nativeElement.focus(options);
      return;
    }
    if (this.presentation() === 'slider') {
      this.channelInput()?.nativeElement.focus(options);
      return;
    }
    if (this.presentation() === 'palette') {
      this.host.nativeElement
        .querySelector<HTMLButtonElement>('.aeris-color-picker__presets button[tabindex="0"]')
        ?.focus(options);
      return;
    }
    this.triggerButton()?.nativeElement.focus(options);
  }

  open(): void {
    if (
      this.effectiveDisabled() ||
      this.readonly() ||
      this.isOpen() ||
      this.presentation() !== 'picker'
    )
      return;
    this.isOpen.set(true);
    this.opened.emit();
    afterNextRender(
      {
        write: () => {
          this.colorPlane()?.nativeElement.focus();
        },
      },
      { injector: this.injector },
    );
  }

  close(restoreFocus = false): void {
    if (!this.isOpen()) return;
    this.panelPortal()?.restore();
    this.isOpen.set(false);
    this.planeDragging.set(false);
    this.panelPointerInteraction = false;
    this.textDraft.set('');
    this.eyeDropperAbortController?.abort();
    this.eyeDropperAbortController = null;
    this.eyeDropperActive.set(false);
    this.closed.emit();
    if (restoreFocus) queueMicrotask(() => this.focus());
  }

  toggle(): void {
    if (this.isOpen()) this.close(false);
    else this.open();
  }

  reset(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue(formatColor({ r: 44, g: 105, b: 75 }, this.format()));
    this.textDraft.set('');
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.textDraft.set('');
    this.cleared.emit();
    this.focus();
  }

  protected openEyeDropper(event: Event): void {
    if (this.effectiveDisabled() || this.readonly() || this.eyeDropperActive()) return;
    const EyeDropper = getEyeDropperConstructor();
    if (!EyeDropper) return;

    const controller = new AbortController();
    this.eyeDropperAbortController = controller;
    this.eyeDropperActive.set(true);

    void new EyeDropper()
      .open({ signal: controller.signal })
      .then(({ sRGBHex }) => {
        if (controller.signal.aborted) return;
        this.setFromHex(sRGBHex);
        this.emitCommitted(event);
      })
      .catch(() => undefined)
      .finally(() => {
        if (this.eyeDropperAbortController !== controller) return;
        this.eyeDropperAbortController = null;
        this.eyeDropperActive.set(false);
        if (this.isOpen()) queueMicrotask(() => this.colorPlane()?.nativeElement.focus());
      });
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open();
    } else if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.close(false);
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.close(true);
  }

  protected handlePanelPointerDown(): void {
    this.panelPointerInteraction = true;
  }

  protected endPanelPointerInteraction(): void {
    this.panelPointerInteraction = false;
  }

  protected handlePlanePointerDown(event: PointerEvent): void {
    if (event.button !== 0 || this.effectiveDisabled() || this.readonly()) return;
    event.preventDefault();
    const plane = event.currentTarget as HTMLElement;
    plane.focus({ preventScroll: true });
    plane.setPointerCapture(event.pointerId);
    this.planeDragging.set(true);
    this.updateFromPlanePointer(event);
  }

  protected handlePlanePointerMove(event: PointerEvent): void {
    if (!this.planeDragging()) return;
    this.updateFromPlanePointer(event);
  }

  protected handlePlanePointerUp(event: PointerEvent): void {
    if (!this.planeDragging()) return;
    this.updateFromPlanePointer(event);
    this.planeDragging.set(false);
    const plane = event.currentTarget as HTMLElement;
    if (plane.hasPointerCapture(event.pointerId)) plane.releasePointerCapture(event.pointerId);
    this.emitCommitted(event);
  }

  protected handlePlanePointerCancel(event: PointerEvent): void {
    this.planeDragging.set(false);
    const plane = event.currentTarget as HTMLElement;
    if (plane.hasPointerCapture(event.pointerId)) plane.releasePointerCapture(event.pointerId);
  }

  protected handlePlaneKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const current = this.hsvValue();
    const step = event.shiftKey ? 10 : 1;
    let saturation = current.s;
    let brightness = current.v;

    if (event.key === 'ArrowLeft') saturation -= step;
    else if (event.key === 'ArrowRight') saturation += step;
    else if (event.key === 'ArrowUp') brightness += step;
    else if (event.key === 'ArrowDown') brightness -= step;
    else if (event.key === 'Home') saturation = 0;
    else if (event.key === 'End') saturation = 100;
    else if (event.key === 'PageUp') brightness += 10;
    else if (event.key === 'PageDown') brightness -= 10;
    else return;

    event.preventDefault();
    this.setFromHsv({
      h: current.h,
      s: clamp(saturation, 0, 100),
      v: clamp(brightness, 0, 100),
    });
    this.emitCommitted(event);
  }

  protected handleHueInput(event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const hue = Number((event.target as HTMLInputElement).value);
    const current = this.hsvValue();
    this.setFromHsv({ ...current, h: hue });
  }

  protected guardReadonlySlider(event: PointerEvent): void {
    if (this.readonly()) event.preventDefault();
  }

  protected handleChannelKeydown(event: KeyboardEvent): void {
    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (this.effectiveDisabled() || this.readonly()) return;
    const step = event.shiftKey || event.key.startsWith('Page') ? 10 : 1;
    const value =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? this.channelMax()
          : this.channelValue() +
            (['ArrowLeft', 'ArrowDown', 'PageDown'].includes(event.key) ? -step : step);
    this.setChannel(clamp(value, 0, this.channelMax()));
    this.emitCommitted(event);
  }

  protected handleChannelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.effectiveDisabled() || this.readonly()) {
      target.value = String(this.channelValue());
      return;
    }
    const value = Number(target.value);
    if (Number.isFinite(value)) this.setChannel(clamp(value, 0, this.channelMax()));
  }

  private setChannel(value: number): void {
    const channel = this.channel();
    if (channel === 'hue' || channel === 'saturation' || channel === 'brightness') {
      const key = channel === 'hue' ? 'h' : channel === 'saturation' ? 's' : 'v';
      this.setFromHsv({ ...this.hsvValue(), [key]: value });
    } else {
      const color = this.colorForChannel(value);
      this.hsvDraft.set(null);
      this.hslDraft.set(channel === 'lightness' ? { ...this.hslValue(), l: value } : null);
      this.setValue(formatColor(color.rgb, this.format(), color.alpha));
    }
    this.textDraft.set('');
  }

  private colorForChannel(value: number): { readonly rgb: RgbColor; readonly alpha: number } {
    const rgb = this.parsedValue()?.rgb ?? { r: 0, g: 0, b: 0 };
    const alpha = this.opacity();
    switch (this.channel()) {
      case 'alpha':
        return { rgb, alpha: value / 100 };
      case 'red':
        return { rgb: { ...rgb, r: value }, alpha };
      case 'green':
        return { rgb: { ...rgb, g: value }, alpha };
      case 'blue':
        return { rgb: { ...rgb, b: value }, alpha };
      case 'lightness': {
        const hsl = this.hslValue();
        return { rgb: hslToRgb(hsl.h, hsl.s, value) ?? rgb, alpha };
      }
      case 'hue':
        return { rgb: hsvToRgb({ ...this.hsvValue(), h: value }), alpha };
      case 'saturation':
        return { rgb: hsvToRgb({ ...this.hsvValue(), s: value }), alpha };
      case 'brightness':
        return { rgb: hsvToRgb({ ...this.hsvValue(), v: value }), alpha };
    }
  }

  protected handleAlphaInput(event: Event): void {
    if (!this.opacityEnabled() || this.effectiveDisabled() || this.readonly()) return;
    const opacity = Number((event.target as HTMLInputElement).value) / 100;
    if (!Number.isFinite(opacity)) return;
    this.setValue(
      formatColor(
        this.parsedValue()?.rgb ?? { r: 0, g: 0, b: 0 },
        this.format(),
        clamp(opacity, 0, 1),
      ),
    );
    this.textDraft.set('');
  }

  protected handleTextInput(event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const draft = (event.target as HTMLInputElement).value;
    this.textDraft.set(draft);
    const parsed = parseColor(draft, this.opacityEnabled());
    if (parsed && isContinuousCommitValue(draft)) {
      this.setValue(formatColor(parsed.rgb, this.format(), parsed.alpha));
      this.textDraft.set('');
    }
  }

  protected handleTextChange(event: Event): void {
    this.commitText((event.target as HTMLInputElement).value, event);
  }

  protected handleTextKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitText((event.target as HTMLInputElement).value, event);
    } else if (event.key === 'Escape' && !this.isOpen()) {
      this.textDraft.set('');
    }
  }

  protected handleBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      (this.host.nativeElement.contains(nextTarget) ||
        this.pickerPanel()?.nativeElement.contains(nextTarget))
    )
      return;
    if (this.eyeDropperActive() || this.panelPointerInteraction) return;

    // Browsers may report no related target while a pointer activates an internal
    // button or transfers focus into the native eyedropper UI. Outside pointer
    // dismissal is handled by the dedicated dismiss layer, so this ambiguous
    // transition must not close the panel before the click can complete.
    if (this.isOpen() && nextTarget === null) return;

    this.close(false);
    this.onTouched();
    this.touch.emit();
  }

  protected selectFormat(nextFormat: AerisColorFormat, event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    if (this.format() === nextFormat) return;
    const parsed = this.parsedValue();
    this.format.set(nextFormat);
    if (parsed) this.setValue(formatColor(parsed.rgb, nextFormat, parsed.alpha));
    this.textDraft.set('');
    this.emitCommitted(event);
  }

  protected selectPreset(preset: PresetView, event: Event): void {
    if (this.effectiveDisabled() || this.readonly() || preset.disabled) return;
    this.selectedPreset.set(preset.value);
    this.setFromHex(preset.value);
    this.emitCommitted(event);
  }

  protected handlePresetKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const group = event.currentTarget as HTMLElement;
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    const current = buttons.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    const rtl = group.ownerDocument.defaultView?.getComputedStyle(group).direction === 'rtl';
    let next: number;
    switch (event.key) {
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = buttons.length - 1;
        break;
      case 'ArrowRight':
        next = current + (rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        next = current + (rtl ? 1 : -1);
        break;
      case 'ArrowDown':
        next = current + 1;
        break;
      case 'ArrowUp':
        next = current - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons[(next + buttons.length) % buttons.length]?.focus();
  }

  protected emitCommitted(event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const parsed = this.parsedValue();
    if (!parsed) return;
    this.changed.emit({ originalEvent: event, value: this.value(), hex: this.hexValue() });
  }

  private updateFromPlanePointer(event: PointerEvent): void {
    const plane = event.currentTarget as HTMLElement;
    const rect = plane.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const saturation = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const brightness = clamp((1 - (event.clientY - rect.top) / rect.height) * 100, 0, 100);
    this.setFromHsv({
      h: this.hsvValue().h,
      s: Math.round(saturation),
      v: Math.round(brightness),
    });
  }

  private commitText(draft: string, event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const parsed = parseColor(draft, this.opacityEnabled());
    if (!parsed) return;
    this.setValue(formatColor(parsed.rgb, this.format(), parsed.alpha));
    this.textDraft.set('');
    this.emitCommitted(event);
  }

  private setFromHex(hex: string): void {
    const parsed = parseColor(hex, this.opacityEnabled());
    if (!parsed) return;
    this.setValue(
      formatColor(parsed.rgb, this.format(), parsed.hasAlpha ? parsed.alpha : this.opacity()),
    );
  }

  private setFromHsv(color: HsvColor): void {
    this.hslDraft.set(null);
    this.hsvDraft.set(color);
    this.setValue(formatColor(hsvToRgb(color), this.format(), this.opacity()));
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
  }

  private coerceValue(value: unknown): string {
    if (typeof value !== 'string') return '';
    const parsed = parseColor(value, this.opacityEnabled());
    return parsed ? formatColor(parsed.rgb, this.format(), parsed.alpha) : value;
  }
}

function isColorFormat(value: string): value is AerisColorFormat {
  return value === 'hex' || value === 'rgb' || value === 'hsl';
}

function getEyeDropperConstructor(): EyeDropperConstructor | undefined {
  return (
    globalThis as typeof globalThis & {
      readonly EyeDropper?: EyeDropperConstructor;
    }
  ).EyeDropper;
}

function isContinuousCommitValue(value: string): boolean {
  const trimmed = value.trim();
  return /^#?(?:[\da-f]{6}|[\da-f]{8})$/i.test(trimmed) || /^(?:rgba?|hsla?)\(/i.test(trimmed);
}

interface ParsedColor {
  readonly hex: string;
  readonly rgb: RgbColor;
  readonly alpha: number;
  readonly hasAlpha: boolean;
}

function parseColor(value: string, allowAlpha = false): ParsedColor | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (allowAlpha) {
    if (trimmed.toLowerCase() === 'transparent') {
      return { hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, alpha: 0, hasAlpha: true };
    }
    const hexAlpha = /^#?([\da-f]{4}|[\da-f]{8})$/i.exec(trimmed)?.[1];
    if (hexAlpha) {
      const expanded =
        hexAlpha.length === 4 ? [...hexAlpha].map((digit) => digit + digit).join('') : hexAlpha;
      const hex = `#${expanded.slice(0, 6).toLowerCase()}`;
      return {
        hex,
        rgb: hexToRgb(hex),
        alpha: Number.parseInt(expanded.slice(6), 16) / 255,
        hasAlpha: true,
      };
    }
    const functional = /^(rgba?|hsla?)\(([^()]+)\)$/i.exec(trimmed);
    if (functional) {
      const name = functional[1]?.toLowerCase() ?? '';
      const body = functional[2] ?? '';
      const parts = body.includes(',')
        ? body.split(',').map((part) => part.trim())
        : body.trim().split(/\s*\/\s*|\s+/);
      if (parts.length === 4) {
        const rawAlpha = parts[3] ?? '';
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)%?$/.test(rawAlpha)) return null;
        const alpha = Number.parseFloat(rawAlpha) / (rawAlpha.endsWith('%') ? 100 : 1);
        if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;
        const rgb = name.startsWith('rgb')
          ? parseRgb(`rgb(${parts.slice(0, 3).join(',')})`)
          : parseHsl(`hsl(${parts.slice(0, 3).join(',')})`);
        return rgb ? { hex: rgbToHex(rgb), rgb, alpha, hasAlpha: true } : null;
      }
    }
  }
  const hex = parseHex(trimmed);
  if (hex) return { hex, rgb: hexToRgb(hex), alpha: 1, hasAlpha: false };
  const rgb = parseRgb(trimmed) ?? parseHsl(trimmed);
  return rgb ? { hex: rgbToHex(rgb), rgb, alpha: 1, hasAlpha: false } : null;
}

function parseHex(value: string): string | null {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(value);
  if (!match) return null;
  const raw = match[1] ?? '';
  if (raw.length === 3) {
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toLowerCase();
  }
  return `#${raw}`.toLowerCase();
}

function parseRgb(value: string): RgbColor | null {
  const match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(value);
  if (!match) return null;
  const rgb = {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
  return isRgb(rgb) ? rgb : null;
}

function parseHsl(value: string): RgbColor | null {
  const match =
    /^hsl\(\s*(-?(?:\d{1,3}(?:\.\d+)?|\.\d+))\s*,\s*((?:\d{1,3}(?:\.\d+)?|\.\d+))%\s*,\s*((?:\d{1,3}(?:\.\d+)?|\.\d+))%\s*\)$/i.exec(
      value,
    );
  if (!match) return null;
  return hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]));
}

function isRgb(value: RgbColor): boolean {
  return [value.r, value.g, value.b].every(
    (item) => Number.isInteger(item) && item >= 0 && item <= 255,
  );
}

function hexToRgb(hex: string): RgbColor {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex(color: RgbColor): string {
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function toHex(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0');
}

function formatColor(color: RgbColor, format: AerisColorFormat, alpha = 1): string {
  // Eight decimal places retain every 8-bit HEX alpha during format round trips.
  const opacity = Math.round(alpha * 100_000_000) / 100_000_000;
  if (format === 'rgb')
    return alpha < 1
      ? `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`
      : `rgb(${color.r}, ${color.g}, ${color.b})`;
  if (format === 'hsl') {
    const hsl = rgbToHsl(color);
    return alpha < 1
      ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${opacity})`
      : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
  return `${rgbToHex(color)}${alpha < 1 ? toHex(alpha * 255) : ''}`;
}

function rgbToHsl(color: RgbColor): { readonly h: number; readonly s: number; readonly l: number } {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: roundColorValue(l * 100) };
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === r
      ? (g - b) / delta + (g < b ? 6 : 0)
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return {
    h: roundColorValue(h * 60),
    s: roundColorValue(s * 100),
    l: roundColorValue(l * 100),
  };
}

function roundColorValue(value: number): number {
  return Math.round(value * 100) / 100;
}

function rgbToHsv(color: RgbColor): HsvColor {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return {
    h: Math.round(hue) % 360,
    s: Math.round((max === 0 ? 0 : delta / max) * 100),
    v: Math.round(max * 100),
  };
}

function hsvToRgb(color: HsvColor): RgbColor {
  const hue = ((color.h % 360) + 360) % 360;
  const saturation = clamp(color.s, 0, 100) / 100;
  const value = clamp(color.v, 0, 100) / 100;
  const chroma = value * saturation;
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const offset = value - chroma;
  const [r, g, b] =
    segment < 1
      ? [chroma, secondary, 0]
      : segment < 2
        ? [secondary, chroma, 0]
        : segment < 3
          ? [0, chroma, secondary]
          : segment < 4
            ? [0, secondary, chroma]
            : segment < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];
  return {
    r: Math.round((r + offset) * 255),
    g: Math.round((g + offset) * 255),
    b: Math.round((b + offset) * 255),
  };
}

function hslToRgb(hue: number, saturation: number, lightness: number): RgbColor | null {
  if (
    !Number.isFinite(hue) ||
    !Number.isFinite(saturation) ||
    !Number.isFinite(lightness) ||
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100
  ) {
    return null;
  }
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

function hueToRgb(p: number, q: number, t: number): number {
  let next = t;
  if (next < 0) next += 1;
  if (next > 1) next -= 1;
  if (next < 1 / 6) return p + (q - p) * 6 * next;
  if (next < 1 / 2) return q;
  if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
  return p;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
