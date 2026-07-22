import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisSlider,
  type AerisSliderChangeEvent,
  type AerisSliderInputEvent,
} from '../../../slider/aeris-slider';

@Component({
  imports: [AerisSlider],
  template: `
    <aeris-slider
      #slider
      inputId="volume"
      name="volume"
      ariaLabel="Volume"
      ariaDescribedby="volume-help"
      [min]="0"
      [max]="10"
      [step]="0.5"
      showValue
      showTicks
      [(value)]="volume"
      (sliding)="lastInput.set($event)"
      (changed)="lastChange.set($event)"
    />
  `,
})
class SliderTestHost {
  readonly slider = viewChild.required<AerisSlider>('slider');
  readonly volume = signal(4);
  readonly lastInput = signal<AerisSliderInputEvent | null>(null);
  readonly lastChange = signal<AerisSliderChangeEvent | null>(null);
}

@Component({
  imports: [AerisSlider],
  template: `
    <aeris-slider
      #slider
      inputId="price"
      range
      [min]="0"
      [max]="100"
      [step]="5"
      [minRange]="10"
      lowerAriaLabel="Minimum price"
      upperAriaLabel="Maximum price"
      [(value)]="price"
    />
  `,
})
class RangeSliderTestHost {
  readonly slider = viewChild.required<AerisSlider>('slider');
  readonly price = signal<readonly [number, number]>([20, 80]);
}

describe('AerisSlider', () => {
  it('exposes slider and native form semantics', async () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    await fixture.whenStable();

    const thumb = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    const hidden = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(thumb.id).toBe('volume');
    expect(thumb.getAttribute('aria-label')).toBe('Volume');
    expect(thumb.getAttribute('aria-describedby')).toBe('volume-help');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('10');
    expect(thumb.getAttribute('aria-valuenow')).toBe('4');
    expect(hidden.name).toBe('volume');
    expect(hidden.value).toBe('4');
  });

  it('supports arrows, Page Up, Page Down, Home, and End', async () => {
    const fixture = TestBed.createComponent(SliderTestHost);
    await fixture.whenStable();

    const thumb = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    const press = (key: string): void => {
      thumb.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
      fixture.detectChanges();
    };

    press('ArrowRight');
    expect(fixture.componentInstance.volume()).toBe(4.5);
    press('ArrowUp');
    expect(fixture.componentInstance.volume()).toBe(5);
    press('PageUp');
    expect(fixture.componentInstance.volume()).toBe(6);
    press('PageDown');
    expect(fixture.componentInstance.volume()).toBe(5);
    press('End');
    expect(fixture.componentInstance.volume()).toBe(10);
    press('Home');
    expect(fixture.componentInstance.volume()).toBe(0);
    expect(fixture.componentInstance.lastChange()?.thumb).toBe('single');
  });

  it('keeps range thumbs ordered and respects the minimum range', async () => {
    const fixture = TestBed.createComponent(RangeSliderTestHost);
    await fixture.whenStable();

    const thumbs = fixture.nativeElement.querySelectorAll(
      '[role="slider"]',
    ) as NodeListOf<HTMLButtonElement>;
    const lower = thumbs.item(0);
    const upper = thumbs.item(1);

    expect(lower.getAttribute('aria-valuemax')).toBe('70');
    expect(upper.getAttribute('aria-valuemin')).toBe('30');

    lower.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.price()).toEqual([70, 80]);

    upper.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.price()).toEqual([70, 80]);
  });

  it('supports focus, reset, forms writes, and disabled state', async () => {
    const fixture = TestBed.createComponent(RangeSliderTestHost);
    await fixture.whenStable();

    const slider = fixture.componentInstance.slider();
    slider.focus('upper');
    expect((document.activeElement as HTMLElement).id).toBe('price-upper');

    slider.reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.price()).toEqual([0, 100]);

    slider.writeValue([15, 45]);
    fixture.detectChanges();
    expect(slider.value()).toEqual([15, 45]);

    slider.setDisabledState(true);
    fixture.detectChanges();
    const thumbs = fixture.nativeElement.querySelectorAll(
      '[role="slider"]',
    ) as NodeListOf<HTMLButtonElement>;
    expect([...thumbs].every((thumb) => thumb.disabled)).toBe(true);
  });

  it('positions reversed single and range thumbs by their own values', async () => {
    const singleFixture = TestBed.createComponent(AerisSlider);
    singleFixture.componentRef.setInput('value', 30);
    singleFixture.componentRef.setInput('reversed', true);
    singleFixture.detectChanges();
    await singleFixture.whenStable();

    const singleRoot = singleFixture.nativeElement.querySelector(
      '.aeris-slider',
    ) as HTMLElement;
    expect(singleRoot.style.getPropertyValue('--aeris-slider-single')).toBe(
      '70%',
    );

    const rangeFixture = TestBed.createComponent(AerisSlider);
    rangeFixture.componentRef.setInput('range', true);
    rangeFixture.componentRef.setInput('value', [20, 80]);
    rangeFixture.componentRef.setInput('reversed', true);
    rangeFixture.detectChanges();
    await rangeFixture.whenStable();

    const rangeRoot = rangeFixture.nativeElement.querySelector(
      '.aeris-slider',
    ) as HTMLElement;
    expect(rangeRoot.style.getPropertyValue('--aeris-slider-lower')).toBe(
      '80%',
    );
    expect(rangeRoot.style.getPropertyValue('--aeris-slider-upper')).toBe(
      '20%',
    );
  });
});
