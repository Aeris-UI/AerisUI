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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  aerisInternalClampOverlayPoint,
  aerisInternalCreateFrameScheduler,
} from '@aeris-ui/core';

export type AerisColorPickerSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisColorPickerAppearance = 'outline' | 'filled';
export type AerisColorFormat = 'hex' | 'rgb' | 'hsl';

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

interface EyeDropperResult {
  readonly sRGBHex: string;
}

interface EyeDropperInstance {
  open(options?: { readonly signal?: AbortSignal }): Promise<EyeDropperResult>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

interface PanelPosition {
  readonly top: number;
  readonly left: number;
}

let colorPickerId = 0;

@Component({
  selector: 'aeris-color-picker',
  template: `
    <div
      class="aeris-color-picker"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-invalid]="invalid() || null"
      [attr.data-fluid]="fluid() || null"
      [attr.data-open]="isOpen() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="value()" [disabled]="effectiveDisabled()" />
      }

      <button
        #triggerButton
        class="aeris-color-picker__trigger"
        type="button"
        [id]="resolvedInputId()"
        [disabled]="effectiveDisabled() || readonly()"
        [attr.aria-label]="ariaLabel() || triggerAriaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-describedby]="ariaDescribedby()"
        [attr.aria-invalid]="invalid() || null"
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
          [style.background-color]="hexValue()"
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
          [attr.aria-describedby]="ariaDescribedby()"
          [attr.aria-invalid]="invalid() || textInvalid() || null"
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
          <span aria-hidden="true"></span>
        </button>
      }

      @if (isOpen()) {
        <button
          class="aeris-color-picker__dismiss"
          type="button"
          tabindex="-1"
          [attr.aria-label]="closeButtonAriaLabel()"
          (click)="close(true)"
        ></button>
        <section
          #pickerPanel
          class="aeris-color-picker__panel"
          role="dialog"
          [id]="panelId"
          [attr.aria-label]="resolvedPanelAriaLabel()"
          [attr.data-positioned]="panelPositioned() || null"
          [style.top.px]="panelTop()"
          [style.left.px]="panelLeft()"
          (pointerdown)="handlePanelPointerDown()"
          (keydown)="handlePanelKeydown($event)"
        >
          <header class="aeris-color-picker__panel-header">
            <span
              class="aeris-color-picker__preview"
              [style.background-color]="hexValue()"
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
                  <span aria-hidden="true"></span>
                </button>
              }
              <button
                class="aeris-color-picker__close"
                type="button"
                [attr.aria-label]="closeButtonAriaLabel()"
                (click)="close(true)"
              >
                <span aria-hidden="true"></span>
              </button>
            </span>
          </header>

          <div
            #colorPlane
            class="aeris-color-picker__plane"
            role="slider"
            tabindex="0"
            aria-orientation="horizontal"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-label]="planeAriaLabel()"
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
              <div
                class="aeris-color-picker__presets"
                role="group"
                [attr.aria-label]="presetsAriaLabel()"
              >
                @for (preset of normalizedPresets(); track preset) {
                  <button
                    type="button"
                    [attr.aria-label]="'Select ' + preset"
                    [attr.aria-pressed]="preset === hexValue()"
                    [style.background-color]="preset"
                    (click)="selectPreset(preset, $event)"
                  ></button>
                }
              </div>
            </div>
          }
        </section>
      }
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.positionPanel());
  private readonly injector = inject(Injector);
  private readonly pickerPanel = viewChild<ElementRef<HTMLElement>>('pickerPanel');
  private readonly colorPlane = viewChild<ElementRef<HTMLElement>>('colorPlane');
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  private readonly generatedId = `aeris-color-picker-${++colorPickerId}`;
  private readonly formDisabled = signal(false);
  private readonly textDraft = signal('');
  private readonly planeDragging = signal(false);
  private readonly hsvDraft = signal<HsvColor | null>(null);
  private panelPointerInteraction = false;
  private eyeDropperAbortController: AbortController | null = null;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly panelId = `${this.generatedId}-panel`;
  readonly value = model('#879566');
  readonly format = model<AerisColorFormat>('hex');
  readonly inputId = input('');
  readonly name = input('');
  readonly formats = input<readonly AerisColorFormat[]>(['hex', 'rgb', 'hsl']);
  readonly placeholder = input('Enter color');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly triggerAriaLabel = input('Choose color');
  /** @deprecated Use panelAriaLabel instead. */
  readonly nativeAriaLabel = input('Color picker');
  readonly panelAriaLabel = input('');
  readonly textAriaLabel = input('Color value');
  readonly formatAriaLabel = input('Color format');
  readonly hueAriaLabel = input('Hue');
  readonly planeAriaLabel = input('Saturation and brightness');
  readonly presetsAriaLabel = input('Preset colors');
  readonly presetsLabel = input('Presets');
  readonly emptyLabel = input('No color');
  readonly clearButtonAriaLabel = input('Clear color');
  readonly closeButtonAriaLabel = input('Close color picker');
  readonly eyeDropperAriaLabel = input('Pick a color from the screen');
  readonly size = input<AerisColorPickerSize>('md');
  readonly appearance = input<AerisColorPickerAppearance>('outline');
  readonly presets = input<readonly string[]>([]);
  readonly showInput = input(true, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly showFormat = input(true, { transform: booleanAttribute });
  readonly showEyeDropper = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<string>();
  readonly changed = output<AerisColorPickerChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();
  readonly cleared = output<void>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly isOpen = signal(false);
  protected readonly panelPositioned = signal(false);
  protected readonly panelTop = signal(0);
  protected readonly panelLeft = signal(0);
  protected readonly eyeDropperAvailable = signal(false);
  protected readonly eyeDropperActive = signal(false);
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly resolvedPanelAriaLabel = computed(
    () => this.panelAriaLabel() || this.nativeAriaLabel(),
  );
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly parsedValue = computed(() => parseColor(this.value()));
  protected readonly hexValue = computed(() => this.parsedValue()?.hex ?? '#000000');
  protected readonly hsvValue = computed(() => {
    const parsed = this.parsedValue();
    const draft = this.hsvDraft();
    if (parsed && draft && rgbToHex(hsvToRgb(draft)) === parsed.hex) return draft;
    return rgbToHsv(parsed?.rgb ?? { r: 0, g: 0, b: 0 });
  });
  protected readonly hueColor = computed(() => `hsl(${this.hsvValue().h}, 100%, 50%)`);
  protected readonly planeAriaValue = computed(
    () => `Saturation ${this.hsvValue().s}%, brightness ${this.hsvValue().v}%`,
  );
  protected readonly textValue = computed(() => this.textDraft() || this.value());
  protected readonly textInvalid = computed(
    () => Boolean(this.textDraft()) && !parseColor(this.textDraft()),
  );
  protected readonly normalizedFormats = computed<readonly AerisColorFormat[]>(() => {
    const configuredFormats = [...new Set(this.formats().filter(isColorFormat))];
    return configuredFormats.includes(this.format())
      ? configuredFormats
      : [...configuredFormats, this.format()];
  });
  protected readonly normalizedPresets = computed(() => [
    ...new Set(
      this.presets()
        .map((preset) => parseColor(preset)?.hex)
        .filter((preset): preset is string => Boolean(preset)),
    ),
  ]);
  private readonly closeUnavailablePanel = effect(() => {
    if ((this.effectiveDisabled() || this.readonly()) && this.isOpen()) this.close(false);
  });

  constructor() {
    afterNextRender({
      write: () => this.eyeDropperAvailable.set(Boolean(getEyeDropperConstructor())),
    });
    effect((onCleanup) => {
      if (!this.isOpen()) return;
      const view = this.host.nativeElement.ownerDocument.defaultView;
      const reposition = this.repositionFrame.schedule;
      const endPointerInteraction = () => this.endPanelPointerInteraction();
      view?.addEventListener('resize', reposition);
      view?.addEventListener('scroll', reposition);
      view?.addEventListener('pointerup', endPointerInteraction);
      view?.addEventListener('pointercancel', endPointerInteraction);
      onCleanup(() => {
        view?.removeEventListener('resize', reposition);
        view?.removeEventListener('scroll', reposition);
        view?.removeEventListener('pointerup', endPointerInteraction);
        view?.removeEventListener('pointercancel', endPointerInteraction);
        this.repositionFrame.cancel();
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
    this.triggerButton()?.nativeElement.focus(options);
  }

  open(): void {
    if (this.effectiveDisabled() || this.readonly() || this.isOpen()) return;
    this.panelPositioned.set(false);
    this.isOpen.set(true);
    this.opened.emit();
    afterNextRender(
      {
        earlyRead: () => this.calculatePanelPosition(),
        write: (position) => {
          this.applyPanelPosition(position);
          this.colorPlane()?.nativeElement.focus();
        },
      },
      { injector: this.injector },
    );
  }

  close(restoreFocus = false): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.panelPositioned.set(false);
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
    this.setFromHex('#879566');
    this.textDraft.set('');
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.textDraft.set('');
    this.cleared.emit();
    this.focus();
  }

  protected positionPanel(): void {
    this.applyPanelPosition(this.calculatePanelPosition());
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

  private calculatePanelPosition(): PanelPosition | null {
    if (!this.isOpen()) return null;
    const trigger = this.triggerButton()?.nativeElement;
    const panel = this.pickerPanel()?.nativeElement;
    if (!trigger || !panel) return null;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const margin = 8;
    const gap = 8;
    const below = triggerRect.bottom + gap;
    const above = triggerRect.top - panelRect.height - gap;
    const top =
      below + panelRect.height <= viewportHeight - margin ? below : Math.max(margin, above);
    const position = aerisInternalClampOverlayPoint(
      { x: triggerRect.left, y: top },
      panelRect.width,
      panelRect.height,
      viewportWidth,
      viewportHeight,
      margin,
    );

    return { left: Math.round(position.x), top: Math.round(position.y) };
  }

  private applyPanelPosition(position: PanelPosition | null): void {
    if (!position || !this.isOpen()) return;
    this.panelLeft.set(position.left);
    this.panelTop.set(position.top);
    this.panelPositioned.set(true);
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
    if (event.button !== 0) return;
    event.preventDefault();
    const plane = event.currentTarget as HTMLElement;
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
    const hue = Number((event.target as HTMLInputElement).value);
    const current = this.hsvValue();
    this.setFromHsv({ ...current, h: hue });
  }

  protected handleTextInput(event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const draft = (event.target as HTMLInputElement).value;
    this.textDraft.set(draft);
    const parsed = parseColor(draft);
    if (parsed && isContinuousCommitValue(draft)) {
      this.setValue(formatColor(parsed.rgb, this.format()));
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
    if (nextTarget instanceof Node && this.host.nativeElement.contains(nextTarget)) return;
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
    if (this.format() === nextFormat) return;
    const parsed = this.parsedValue();
    this.format.set(nextFormat);
    if (parsed) this.setValue(formatColor(parsed.rgb, nextFormat));
    this.textDraft.set('');
    this.emitCommitted(event);
  }

  protected selectPreset(hex: string, event: Event): void {
    this.setFromHex(hex);
    this.emitCommitted(event);
  }

  protected emitCommitted(event: Event): void {
    const parsed = this.parsedValue();
    if (!parsed) return;
    this.changed.emit({ originalEvent: event, value: this.value(), hex: parsed.hex });
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
    const parsed = parseColor(draft);
    if (!parsed) return;
    this.setValue(formatColor(parsed.rgb, this.format()));
    this.textDraft.set('');
    this.emitCommitted(event);
  }

  private setFromHex(hex: string): void {
    const parsed = parseColor(hex);
    if (!parsed) return;
    this.setValue(formatColor(parsed.rgb, this.format()));
  }

  private setFromHsv(color: HsvColor): void {
    this.hsvDraft.set(color);
    this.setValue(formatColor(hsvToRgb(color), this.format()));
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private coerceValue(value: unknown): string {
    if (typeof value !== 'string') return '';
    const parsed = parseColor(value);
    return parsed ? formatColor(parsed.rgb, this.format()) : value;
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
  return /^#?[\da-f]{6}$/i.test(trimmed) || /^rgb\(/i.test(trimmed) || /^hsl\(/i.test(trimmed);
}

function parseColor(value: string): { readonly hex: string; readonly rgb: RgbColor } | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hex = parseHex(trimmed);
  if (hex) return { hex, rgb: hexToRgb(hex) };
  const rgb = parseRgb(trimmed) ?? parseHsl(trimmed);
  return rgb ? { hex: rgbToHex(rgb), rgb } : null;
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

function formatColor(color: RgbColor, format: AerisColorFormat): string {
  if (format === 'rgb') return `rgb(${color.r}, ${color.g}, ${color.b})`;
  if (format === 'hsl') {
    const hsl = rgbToHsl(color);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
  return rgbToHex(color);
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
