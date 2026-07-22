import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisInputNumber } from '../../../input-number/aeris-input-number';

@Component({
  imports: [AerisInputNumber],
  template: `
    <aeris-input-number
      inputId="quantity"
      ariaLabel="Quantity"
      locale="en-US"
      [min]="0"
      [max]="10"
      [step]="0.5"
      [maxFractionDigits]="1"
      showButtons
      clearable
      [(value)]="quantity"
      (valueInput)="lastInput.set($event)"
    />
  `,
})
class InputNumberTestHost {
  readonly quantity = signal<number | null>(2);
  readonly lastInput = signal<number | null>(null);
}

describe('AerisInputNumber', () => {
  it('formats the model and exposes native spinbutton semantics', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.id).toBe('quantity');
    expect(input.value).toBe('2');
    expect(input.getAttribute('role')).toBe('spinbutton');
    expect(input.getAttribute('aria-label')).toBe('Quantity');
    expect(input.getAttribute('aria-valuemin')).toBe('0');
    expect(input.getAttribute('aria-valuemax')).toBe('10');
    expect(input.getAttribute('aria-valuenow')).toBe('2');
  });

  it('increments and decrements through accessible controls', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const increment = fixture.nativeElement.querySelector(
      '.aeris-input-number__button--increment',
    ) as HTMLButtonElement;
    const decrement = fixture.nativeElement.querySelector(
      '.aeris-input-number__button--decrement',
    ) as HTMLButtonElement;

    increment.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(2.5);
    expect(fixture.componentInstance.lastInput()).toBe(2.5);

    decrement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(2);
  });

  it('supports keyboard stepping and clamps values to constraints', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.quantity()).toBe(10);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(10);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(9.5);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(0);
  });

  it('parses typed values and permits an empty model', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = '7.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBe(7.5);

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity()).toBeNull();
  });

  it('clears the value and restores focus through the suffix button', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const clear = fixture.nativeElement.querySelector(
      '.aeris-input-number__clear',
    ) as HTMLButtonElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(clear.getAttribute('aria-label')).toBe('Clear value');
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.quantity()).toBeNull();
    expect(fixture.componentInstance.lastInput()).toBeNull();
    expect(document.activeElement).toBe(input);
    expect(fixture.nativeElement.querySelector('.aeris-input-number__clear')).toBeNull();
  });
});
