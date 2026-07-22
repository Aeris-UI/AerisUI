import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisRating,
  type AerisRatingChangeEvent,
} from '../../../rating/aeris-rating';

@Component({
  imports: [AerisRating],
  template: `
    <aeris-rating
      #rating
      inputId="quality"
      name="quality"
      ariaLabel="Quality"
      ariaDescribedby="quality-help"
      [max]="10"
      allowHalf
      [(value)]="value"
      (changed)="lastChange.set($event)"
    />
  `,
})
class RatingTestHost {
  readonly rating = viewChild.required<AerisRating>('rating');
  readonly value = signal(4);
  readonly lastChange = signal<AerisRatingChangeEvent | null>(null);
}

describe('AerisRating', () => {
  it('exposes slider and native form semantics', async () => {
    const fixture = TestBed.createComponent(RatingTestHost);
    await fixture.whenStable();

    const control = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    const hidden = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(control.id).toBe('quality');
    expect(control.getAttribute('aria-label')).toBe('Quality');
    expect(control.getAttribute('aria-describedby')).toBe('quality-help');
    expect(control.getAttribute('aria-valuemin')).toBe('0');
    expect(control.getAttribute('aria-valuemax')).toBe('10');
    expect(control.getAttribute('aria-valuenow')).toBe('4');
    expect(hidden.name).toBe('quality');
    expect(hidden.value).toBe('4');
  });

  it('supports arrows, Home, End, and clear keys', async () => {
    const fixture = TestBed.createComponent(RatingTestHost);
    await fixture.whenStable();

    const control = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    const press = (key: string): void => {
      control.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
      fixture.detectChanges();
    };

    press('ArrowRight');
    expect(fixture.componentInstance.value()).toBe(4.5);
    press('ArrowUp');
    expect(fixture.componentInstance.value()).toBe(5);
    press('End');
    expect(fixture.componentInstance.value()).toBe(10);
    press('Home');
    expect(fixture.componentInstance.value()).toBe(0);
    press('Delete');
    expect(fixture.componentInstance.value()).toBe(0);
    expect(fixture.componentInstance.lastChange()?.value).toBe(0);
  });

  it('supports focus, clear, reset, forms writes, and disabled state', async () => {
    const fixture = TestBed.createComponent(RatingTestHost);
    await fixture.whenStable();

    const rating = fixture.componentInstance.rating();
    rating.focus();
    expect((document.activeElement as HTMLElement).id).toBe('quality');

    rating.writeValue(7.25);
    fixture.detectChanges();
    expect(rating.value()).toBe(7.25);
    expect(
      fixture.nativeElement
        .querySelector('[role="slider"]')
        .getAttribute('aria-valuenow'),
    ).toBe('7.5');

    rating.clear();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(0);

    rating.writeValue(5);
    rating.reset();
    fixture.detectChanges();
    expect(rating.value()).toBe(0);

    rating.setDisabledState(true);
    fixture.detectChanges();
    const control = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    expect(control.disabled).toBe(true);
  });

  it('can require a minimum value when clearing is disabled', async () => {
    const fixture = TestBed.createComponent(AerisRating);
    fixture.componentRef.setInput('allowClear', false);
    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    await fixture.whenStable();

    const control = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    expect(control.getAttribute('aria-valuemin')).toBe('1');
    expect(control.getAttribute('aria-valuenow')).toBe('1');
  });

  it('selects a whole star from the left side of its hit area', async () => {
    const fixture = TestBed.createComponent(AerisRating);
    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    await fixture.whenStable();

    const control = fixture.nativeElement.querySelector(
      '[role="slider"]',
    ) as HTMLButtonElement;
    control.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 24,
        right: 100,
        bottom: 24,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      }) as DOMRect;

    control.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 2, bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(1);
  });
});
