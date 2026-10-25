import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, min, max, readonly, disabled } from '@angular/forms/signals';

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
      (valueChange)="lastInput.set($event)"
    />
    <aeris-input-number
      inputId="localized"
      ariaLabel="Localized amount"
      locale="de-DE"
      [(value)]="localizedAmount"
    />
  `,
})
class InputNumberTestHost {
  readonly quantity = signal<number | null>(2);
  readonly localizedAmount = signal<number | null>(null);
  readonly lastInput = signal<number | null>(null);
}

@Component({
  imports: [AerisInputNumber, FormField],
  template: `
    <aeris-input-number
      inputId="compact"
      ariaLabel="Numeric value"
      [formField]="numberForm.amount"
      [step]="1"
      [maxFractionDigits]="0"
      [allowEmpty]="false"
      size="sm"
      showButtons
      buttonLayout="horizontal"
      [buttonTabIndex]="0"
      incrementButtonAriaLabel="Increase amount"
      decrementButtonAriaLabel="Decrease amount"
    />
  `,
})
class SignalNumberHost {
  readonly numberModel = signal({ amount: 3 as number | null });
  readonly readonly = signal(false);
  readonly disabled = signal(false);
  readonly numberForm = form(this.numberModel, (path) => {
    min(path.amount, 1);
    max(path.amount, 5);
    readonly(path.amount, { when: () => this.readonly() });
    disabled(path.amount, { when: () => this.disabled() });
  });
}

describe('AerisInputNumber', () => {
  it('supports a Signal Forms stepper with named buttons and bounded values', async () => {
    const fixture = TestBed.createComponent(SignalNumberHost);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const add = host.querySelector('[aria-label="Increase amount"]') as HTMLButtonElement;
    const remove = host.querySelector('[aria-label="Decrease amount"]') as HTMLButtonElement;
    expect(add.tabIndex).toBe(0);
    expect(remove.tabIndex).toBe(0);
    expect(input.inputMode).toBe('decimal');
    add.click();
    add.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.numberModel().amount).toBe(5);
    expect(add.disabled).toBe(true);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.numberModel().amount).toBe(1);
    expect(remove.disabled).toBe(true);
    fixture.componentInstance.numberModel.set({ amount: 4 });
    await fixture.whenStable();
    expect(input.value).toBe('4');
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = '99 amount';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    await fixture.whenStable();
    expect(input.value).toBe('99');
    input.dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.numberModel().amount).toBe(5);
    expect(fixture.componentInstance.numberForm.amount().touched()).toBe(true);
  });

  it('keeps compact read-only and disabled steppers non-interactive', async () => {
    const fixture = TestBed.createComponent(SignalNumberHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    fixture.componentInstance.readonly.set(true);
    await fixture.whenStable();
    expect(input.readOnly).toBe(true);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(fixture.componentInstance.numberModel().amount).toBe(3);
    fixture.componentInstance.readonly.set(false);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
    expect(buttons.every((button) => button.disabled)).toBe(true);
  });
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

  it('sanitizes malformed typed input while preserving intermediate values', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#quantity') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = '7x.5.9';
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    fixture.detectChanges();

    expect(input.value).toBe('7.59');
    expect(input.selectionStart).toBe(4);
    expect(fixture.componentInstance.quantity()).toBe(7.59);

    input.value = '-';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    fixture.detectChanges();
    expect(input.value).toBe('-');
    expect(fixture.componentInstance.quantity()).toBe(7.59);

    input.value = '-.';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    fixture.detectChanges();
    expect(input.value).toBe('-.');
    expect(fixture.componentInstance.quantity()).toBe(7.59);
  });

  it('sanitizes pasted values with locale-aware separators', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#localized') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = 'EUR 1.234,5.6';
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    fixture.detectChanges();

    expect(input.value).toBe('1234,56');
    expect(fixture.componentInstance.localizedAmount()).toBe(1234.56);
  });

  it('rejects scientific notation instead of converting it to another value', async () => {
    const fixture = TestBed.createComponent(InputNumberTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#quantity') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = '1e3';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    fixture.detectChanges();

    expect(input.value).toBe('2');
    expect(fixture.componentInstance.quantity()).toBe(2);
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
