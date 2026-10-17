import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  AerisColorPicker,
  type AerisColorFormat,
  type AerisColorPickerChangeEvent,
} from '../../../color-picker/aeris-color-picker';

@Component({
  imports: [AerisColorPicker],
  template: `
    <label for="brand-color">Brand color</label>
    <aeris-color-picker
      inputId="brand-color"
      [(value)]="value"
      [(format)]="format"
      [presets]="presets"
      clearable
      (changed)="lastChange.set($event)"
      (opened)="openCount.update((count) => count + 1)"
      (closed)="closeCount.update((count) => count + 1)"
    />
  `,
})
class ColorPickerHost {
  readonly value = signal('#606c38');
  readonly format = signal<AerisColorFormat>('hex');
  readonly lastChange = signal<AerisColorPickerChangeEvent | null>(null);
  readonly openCount = signal(0);
  readonly closeCount = signal(0);
  readonly presets = ['#606c38', '#dda15e', '#283618'];
}

@Component({
  imports: [AerisColorPicker, ReactiveFormsModule],
  template: `<aeris-color-picker [formControl]="control" format="rgb" />`,
})
class ColorPickerFormsHost {
  readonly control = new FormControl('#606c38');
}

@Component({
  imports: [AerisColorPicker],
  template: `
    <aeris-color-picker
      value="#606c38"
      [showValue]="false"
      [showInput]="false"
      ariaLabel="Compact color"
    />
  `,
})
class ColorPickerSwatchOnlyHost {}

@Component({
  imports: [AerisColorPicker, ReactiveFormsModule],
  template: `<aeris-color-picker
    alpha
    [formControl]="control"
    [(format)]="format"
    [presets]="presets"
    (changed)="lastChange.set($event)"
  />`,
})
class AlphaColorPickerHost {
  readonly control = new FormControl('#33669980');
  readonly format = signal<AerisColorFormat>('hex');
  readonly presets = ['#ff0000', '#00ff0040', '#0000ffff', 'transparent', 'invalid'];
  readonly lastChange = signal<AerisColorPickerChangeEvent | null>(null);
}

describe('AerisColorPicker opacity', () => {
  it('keeps a body-mounted panel open when focus transfers from its trigger into the panel', async () => {
    const fixture = TestBed.createComponent(AerisColorPicker);
    fixture.componentRef.setInput('alpha', true);
    fixture.componentRef.setInput('appendTo', 'body');
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    await fixture.whenStable();
    const panel = document.querySelector('.aeris-color-picker__panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.contains(document.activeElement)).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.querySelector('.aeris-color-picker__alpha')).not.toBeNull();
  });

  it('does not quantize fractional preset opacity before RGB output', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    fixture.componentInstance.format.set('rgb');
    fixture.componentInstance.presets.push('rgba(51, 102, 153, 0.12345678)');
    await openPicker(fixture);
    const presets = fixture.nativeElement.querySelectorAll(
      '.aeris-color-picker__presets button',
    ) as NodeListOf<HTMLButtonElement>;
    presets.item(presets.length - 1).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('rgba(51, 102, 153, 0.12345678)');
  });

  it('preserves decimal opacity without HEX quantization in RGB previews and HSL output', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    fixture.componentInstance.format.set('rgb');
    await fixture.whenStable();
    fixture.componentInstance.control.setValue('rgba(51, 102, 153, 0.12345678)');
    await openPicker(fixture);
    const swatch = fixture.nativeElement.querySelector(
      '.aeris-color-picker__swatch',
    ) as HTMLElement;
    expect(swatch.style.getPropertyValue('--aeris-color-picker-preview-color')).toBe(
      'rgba(51, 102, 153, 0.12345678)',
    );
    const formats = fixture.nativeElement.querySelectorAll(
      '.aeris-color-picker__formats button',
    ) as NodeListOf<HTMLButtonElement>;
    formats.item(2).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('hsla(210, 50%, 40%, 0.12345678)');
    formats.item(1).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('rgba(51, 102, 153, 0.12345678)');
  });

  it('retains opacity during screen sampling', async () => {
    vi.stubGlobal(
      'EyeDropper',
      class {
        open(): Promise<{ readonly sRGBHex: string }> {
          return Promise.resolve({ sRGBHex: '#2f6f8f' });
        }
      },
    );
    try {
      const fixture = TestBed.createComponent(AlphaColorPickerHost);
      await openPicker(fixture);
      (
        fixture.nativeElement.querySelector('.aeris-color-picker__eyedropper') as HTMLButtonElement
      ).click();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(fixture.componentInstance.control.value).toBe('#2f6f8f80');
      });
      expect(fixture.componentInstance.lastChange()?.hex).toBe('#2f6f8f80');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('supports localized labels, explicit reset, and readonly state', async () => {
    const fixture = TestBed.createComponent(AerisColorPicker);
    fixture.componentRef.setInput('alpha', true);
    fixture.componentRef.setInput('value', '#33669980');
    fixture.componentRef.setInput('opacityLabel', 'Transparency amount');
    fixture.componentRef.setInput('alphaAriaLabel', 'Overlay opacity');
    fixture.componentInstance.open();
    await fixture.whenStable();
    const range = fixture.nativeElement.querySelector(
      '.aeris-color-picker__alpha input',
    ) as HTMLInputElement;
    expect(range.getAttribute('aria-label')).toBe('Overlay opacity');
    expect(fixture.nativeElement.textContent).toContain('Transparency amount');
    fixture.componentInstance.reset();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('#2c694b');
    fixture.componentRef.setInput('readonly', true);
    await fixture.whenStable();
    range.value = '0';
    range.dispatchEvent(new Event('input'));
    fixture.componentInstance.open();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('#2c694b');
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBeNull();
  });

  it('is opt-in and keeps opaque controls unchanged', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__alpha')).toBeNull();
    const text = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    text.value = '#33669980';
    text.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('#606c38');
  });

  it('renders an accessible opacity slider and checkerboard previews', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await openPicker(fixture);
    const range = fixture.nativeElement.querySelector(
      '.aeris-color-picker__alpha input',
    ) as HTMLInputElement;
    expect(range.type).toBe('range');
    expect(range.min).toBe('0');
    expect(range.max).toBe('100');
    expect(range.value).toBe('50');
    expect(range.getAttribute('aria-label')).toBe('Opacity');
    expect(range.getAttribute('aria-valuetext')).toBe('50%');
    expect(
      fixture.nativeElement
        .querySelector('.aeris-color-picker__swatch')
        .hasAttribute('data-translucent'),
    ).toBe(true);
    range.value = '25';
    range.dispatchEvent(new Event('input'));
    range.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('#33669940');
    expect(fixture.componentInstance.lastChange()?.hex).toBe('#33669940');
  });

  it.each([
    ['#3698', '#33669988'],
    ['#33669900', '#33669900'],
    ['#336699ff', '#336699'],
    ['rgba(51, 102, 153, 0.5)', '#33669980'],
    ['rgb(51 102 153 / 25%)', '#33669940'],
    ['hsla(210, 50%, 40%, 0.5)', '#33669980'],
    ['hsl(210 50% 40% / 25%)', '#33669940'],
    ['transparent', '#00000000'],
  ])('accepts %s and serializes it as %s', async (input, expected) => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await fixture.whenStable();
    const text = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    text.value = input;
    text.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe(expected);
  });

  it.each([
    'rgba(51, 102, 153, -0.1)',
    'rgba(51, 102, 153, 1.1)',
    'rgba(256, 0, 0, .5)',
    'hsla(0, 101%, 50%, .5)',
    '#12345',
    'rgba(1, 2, 3, NaN)',
    'rgb(1 2 3 / 101%)',
  ])('rejects malformed or out-of-range %s without changing the model', async (input) => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await fixture.whenStable();
    const text = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    text.value = input;
    text.dispatchEvent(new Event('input'));
    text.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('#33669980');
    expect(text.getAttribute('aria-invalid')).toBe('true');
  });

  it('retains every HEX alpha byte through repeated RGB and HSL switches', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await openPicker(fixture);
    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-color-picker__formats button',
    ) as NodeListOf<HTMLButtonElement>;
    for (const byte of [0, 1, 64, 127, 128, 254, 255]) {
      const expected = `#336699${byte === 255 ? '' : byte.toString(16).padStart(2, '0')}`;
      fixture.componentInstance.control.setValue(expected);
      await fixture.whenStable();
      for (let cycle = 0; cycle < 3; cycle++) {
        for (const index of [1, 2, 0]) {
          buttons.item(index).click();
          await fixture.whenStable();
        }
        expect(fixture.componentInstance.control.value).toBe(expected);
      }
    }
  });

  it('preserves opacity for hue edits and opaque presets but honors explicit preset alpha', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await openPicker(fixture);
    const hue = fixture.nativeElement.querySelector(
      '.aeris-color-picker__hue input',
    ) as HTMLInputElement;
    hue.value = '120';
    hue.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value?.endsWith('80')).toBe(true);
    const presets = fixture.nativeElement.querySelectorAll(
      '.aeris-color-picker__presets button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(presets.length).toBe(4);
    for (const [index, expected] of [
      [0, '#ff000080'],
      [1, '#00ff0040'],
      [2, '#0000ff'],
      [3, '#00000000'],
    ] as const) {
      presets.item(index).click();
      await fixture.whenStable();
      expect(fixture.componentInstance.control.value).toBe(expected);
    }
  });

  it('supports fully transparent and opaque slider endpoints and disabled Forms state', async () => {
    const fixture = TestBed.createComponent(AlphaColorPickerHost);
    await openPicker(fixture);
    const range = fixture.nativeElement.querySelector(
      '.aeris-color-picker__alpha input',
    ) as HTMLInputElement;
    range.value = '0';
    range.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('#33669900');
    range.value = '100';
    range.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('#336699');
    expect(
      fixture.nativeElement
        .querySelector('.aeris-color-picker__swatch')
        .hasAttribute('data-translucent'),
    ).toBe(false);
    fixture.componentInstance.control.disable();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBeNull();
    expect(
      (fixture.nativeElement.querySelector('.aeris-color-picker__trigger') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});

describe('AerisColorPicker', () => {
  it('renders an Aeris trigger and opens a complete custom picker panel', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    const textInput = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;

    expect(fixture.nativeElement.querySelector('input[type="color"]')).toBeNull();
    expect(trigger.id).toBe('brand-color');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(textInput.value).toBe('#606c38');

    await openPicker(fixture);

    const panel = fixture.nativeElement.querySelector('.aeris-color-picker__panel') as HTMLElement;
    const plane = panel.querySelector('.aeris-color-picker__plane') as HTMLElement;
    const hue = panel.querySelector('input[type="range"]') as HTMLInputElement;
    const formats = panel.querySelectorAll('.aeris-color-picker__formats button');
    const presets = panel.querySelectorAll('.aeris-color-picker__presets button');

    expect(panel.getAttribute('role')).toBe('dialog');
    expect(plane.getAttribute('role')).toBe('slider');
    expect(plane.getAttribute('aria-valuetext')).toContain('Saturation');
    expect(hue.getAttribute('aria-label')).toBe('Hue');
    expect(formats.length).toBe(3);
    expect(presets.length).toBe(3);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__dismiss')).toBeNull();
    expect(fixture.componentInstance.openCount()).toBe(1);
  });

  it('closes when its trigger is pressed again', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBeNull();
  });

  it('anchors the panel to its trigger after the panel has rendered', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 96,
      y: 72,
      top: 72,
      right: 256,
      bottom: 112,
      left: 96,
      width: 160,
      height: 40,
      toJSON: () => ({}),
    });
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);

    await openPicker(fixture);

    const panel = fixture.nativeElement.querySelector('.aeris-color-picker__panel') as HTMLElement;
    expect(panel.hasAttribute('data-positioned')).toBe(true);
    expect(panel.style.left).toBe('96px');
    expect(panel.style.top).toBe('120px');
  });

  it('updates from presets and changes the public value format', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);

    const panel = fixture.nativeElement.querySelector('.aeris-color-picker__panel') as HTMLElement;
    const presets = panel.querySelectorAll(
      '.aeris-color-picker__presets button',
    ) as NodeListOf<HTMLButtonElement>;
    presets.item(2).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#283618');
    expect(fixture.componentInstance.lastChange()?.hex).toBe('#283618');

    const rgbButton = [
      ...panel.querySelectorAll<HTMLButtonElement>('.aeris-color-picker__formats button'),
    ].find((button) => button.textContent?.trim() === 'RGB');
    const formatOrder = () =>
      [...panel.querySelectorAll<HTMLButtonElement>('.aeris-color-picker__formats button')].map(
        (button) => button.textContent?.trim(),
      );
    expect(formatOrder()).toEqual(['HEX', 'RGB', 'HSL']);
    const plane = panel.querySelector('.aeris-color-picker__plane') as HTMLElement;
    rgbButton?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    plane.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
    );
    window.dispatchEvent(new MouseEvent('pointerup'));
    rgbButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.format()).toBe('rgb');
    expect(fixture.componentInstance.value()).toBe('rgb(40, 54, 24)');
    expect(rgbButton?.getAttribute('aria-pressed')).toBe('true');
    expect(formatOrder()).toEqual(['HEX', 'RGB', 'HSL']);
    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBe(panel);
  });

  it('samples a screen color without closing the open panel when EyeDropper is available', async () => {
    vi.stubGlobal(
      'EyeDropper',
      class {
        open(): Promise<{ readonly sRGBHex: string }> {
          return Promise.resolve({ sRGBHex: '#2f6f8f' });
        }
      },
    );

    try {
      const fixture = TestBed.createComponent(ColorPickerHost);
      await openPicker(fixture);
      const eyeDropper = fixture.nativeElement.querySelector(
        '.aeris-color-picker__eyedropper',
      ) as HTMLButtonElement;

      expect(eyeDropper.getAttribute('aria-label')).toBe('Pick a color from the screen');
      eyeDropper.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      eyeDropper.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      window.dispatchEvent(new MouseEvent('pointerup'));
      eyeDropper.click();
      eyeDropper.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );

      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(fixture.componentInstance.value()).toBe('#2f6f8f');
      });
      expect(fixture.componentInstance.lastChange()?.hex).toBe('#2f6f8f');
      expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).not.toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('preserves an eyedropper pixel when the public value uses HSL', async () => {
    vi.stubGlobal(
      'EyeDropper',
      class {
        open(): Promise<{ readonly sRGBHex: string }> {
          return Promise.resolve({ sRGBHex: '#2f6f8f' });
        }
      },
    );

    try {
      const fixture = TestBed.createComponent(ColorPickerHost);
      fixture.componentInstance.format.set('hsl');
      await openPicker(fixture);
      const eyeDropper = fixture.nativeElement.querySelector(
        '.aeris-color-picker__eyedropper',
      ) as HTMLButtonElement;

      eyeDropper.click();

      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(fixture.componentInstance.lastChange()?.hex).toBe('#2f6f8f');
      });

      const swatch = fixture.nativeElement.querySelector(
        '.aeris-color-picker__swatch',
      ) as HTMLElement;
      expect(swatch.style.backgroundColor).toBe('rgb(47, 111, 143)');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('closes when keyboard focus moves to a control outside the picker', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);
    const panel = fixture.nativeElement.querySelector('.aeris-color-picker__panel') as HTMLElement;
    const outsideButton = document.createElement('button');

    panel.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: outsideButton }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBeNull();
  });

  it('supports keyboard saturation and brightness adjustment', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);

    const plane = fixture.nativeElement.querySelector('.aeris-color-picker__plane') as HTMLElement;
    const initialValue = fixture.componentInstance.value();
    plane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).not.toBe(initialValue);
    expect(fixture.componentInstance.lastChange()?.value).toBe(fixture.componentInstance.value());
  });

  it('supports pointer selection across the color plane', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);

    const plane = fixture.nativeElement.querySelector(
      '.aeris-color-picker__plane',
    ) as HTMLElement & {
      setPointerCapture(pointerId: number): void;
      hasPointerCapture(pointerId: number): boolean;
    };
    vi.spyOn(plane, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 200,
      bottom: 100,
      left: 0,
      width: 200,
      height: 100,
      toJSON: () => ({}),
    });
    plane.setPointerCapture = () => undefined;
    plane.hasPointerCapture = () => false;
    const initialValue = fixture.componentInstance.value();

    plane.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 180, clientY: 10 }),
    );
    plane.dispatchEvent(
      new MouseEvent('pointerup', { bubbles: true, button: 0, clientX: 180, clientY: 10 }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).not.toBe(initialValue);
    expect(fixture.componentInstance.lastChange()?.value).toBe(fixture.componentInstance.value());
  });

  it('preserves hue while editing black colors', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await fixture.whenStable();
    const textInput = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    textInput.value = '#000000';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await openPicker(fixture);

    const hue = fixture.nativeElement.querySelector(
      '.aeris-color-picker__hue input',
    ) as HTMLInputElement;
    hue.value = '210';
    hue.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#000000');
    expect(hue.value).toBe('210');
  });

  it('accepts typed RGB values and the clear action', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await fixture.whenStable();

    const textInput = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    textInput.value = 'rgb(221, 161, 94)';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#dda15e');

    const clear = fixture.nativeElement.querySelector(
      '.aeris-color-picker__clear',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('');
  });

  it('works with Reactive Forms and output format conversion', async () => {
    const fixture = TestBed.createComponent(ColorPickerFormsHost);
    await fixture.whenStable();

    const textInput = fixture.nativeElement.querySelector(
      '.aeris-color-picker__text',
    ) as HTMLInputElement;
    textInput.value = '#dda15e';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('rgb(221, 161, 94)');
  });

  it('closes with Escape and restores focus to the trigger', async () => {
    const fixture = TestBed.createComponent(ColorPickerHost);
    await openPicker(fixture);

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('.aeris-color-picker__panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.aeris-color-picker__panel')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(fixture.componentInstance.closeCount()).toBe(1);
  });

  it('can render only the square color trigger', async () => {
    const fixture = TestBed.createComponent(ColorPickerSwatchOnlyHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-color-picker__trigger',
    ) as HTMLButtonElement;
    const textInput = fixture.nativeElement.querySelector('.aeris-color-picker__text');
    const value = fixture.nativeElement.querySelector('.aeris-color-picker__value');
    const swatch = fixture.nativeElement.querySelector(
      '.aeris-color-picker__swatch',
    ) as HTMLElement;

    expect(trigger.getAttribute('data-swatch-only')).toBe('true');
    expect(trigger.getAttribute('aria-label')).toBe('Compact color');
    expect(textInput).toBeNull();
    expect(value).toBeNull();
    expect(swatch.style.backgroundColor).toBe('rgb(96, 108, 56)');
    expect(getComputedStyle(swatch).borderTopWidth).toBe('0px');
    expect(getComputedStyle(swatch).boxShadow).not.toContain('inset');
  });
});

async function openPicker<T>(fixture: ComponentFixture<T>): Promise<void> {
  const trigger = fixture.nativeElement.querySelector(
    '.aeris-color-picker__trigger',
  ) as HTMLButtonElement;
  trigger.click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}
