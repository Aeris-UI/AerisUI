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
  readonly value = signal('#879566');
  readonly format = signal<AerisColorFormat>('hex');
  readonly lastChange = signal<AerisColorPickerChangeEvent | null>(null);
  readonly openCount = signal(0);
  readonly closeCount = signal(0);
  readonly presets = ['#879566', '#dab692', '#8f5b34'];
}

@Component({
  imports: [AerisColorPicker, ReactiveFormsModule],
  template: `<aeris-color-picker [formControl]="control" format="rgb" />`,
})
class ColorPickerFormsHost {
  readonly control = new FormControl('#879566');
}

@Component({
  imports: [AerisColorPicker],
  template: `
    <aeris-color-picker
      value="#879566"
      [showValue]="false"
      [showInput]="false"
      ariaLabel="Compact color"
    />
  `,
})
class ColorPickerSwatchOnlyHost {}

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
    expect(textInput.value).toBe('#879566');

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
    expect(fixture.componentInstance.openCount()).toBe(1);
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

    expect(fixture.componentInstance.value()).toBe('#8f5b34');
    expect(fixture.componentInstance.lastChange()?.hex).toBe('#8f5b34');

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
    expect(fixture.componentInstance.value()).toBe('rgb(143, 91, 52)');
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
    textInput.value = 'rgb(218, 182, 146)';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#dab692');

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
    textInput.value = '#dab692';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('rgb(218, 182, 146)');
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
    expect(swatch.style.backgroundColor).toBe('rgb(135, 149, 102)');
    expect(getComputedStyle(swatch).borderTopWidth).toBe('0px');
    expect(getComputedStyle(swatch).boxShadow).not.toContain('inset');
  });
});

async function openPicker(fixture: ComponentFixture<ColorPickerHost>): Promise<void> {
  const trigger = fixture.nativeElement.querySelector(
    '.aeris-color-picker__trigger',
  ) as HTMLButtonElement;
  trigger.click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}
