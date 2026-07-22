import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisInputMask } from '../../../input-mask/aeris-input-mask';

@Component({
  imports: [AerisInputMask],
  template: `
    <aeris-input-mask
      inputId="phone"
      ariaLabel="Phone number"
      mask="+9 (999) 999-9999"
      inputMode="tel"
      clearable
      [(value)]="phone"
      (completed)="completedValue.set($event)"
      (valueInput)="lastInput.set($event)"
    />
  `,
})
class InputMaskTestHost {
  readonly phone = signal('');
  readonly completedValue = signal('');
  readonly lastInput = signal('');
}

@Component({
  imports: [AerisInputMask],
  template: `
    <aeris-input-mask
      mask="aa-999"
      unmask
      autoClear
      showMask
      [(value)]="code"
    />
    <aeris-input-mask mask="\\9-99" [value]="'912'" ariaLabel="Escaped mask" />
  `,
})
class InputMaskOptionsTestHost {
  readonly code = signal('');
}

describe('AerisInputMask', () => {
  it('formats accepted characters and filters invalid input', async () => {
    const fixture = TestBed.createComponent(InputMaskTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '1a2345678901';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.phone()).toBe('+1 (234) 567-8901');
    expect(fixture.componentInstance.lastInput()).toBe('+1 (234) 567-8901');
    expect(input.value).toBe('+1 (234) 567-8901');
    expect(fixture.componentInstance.completedValue()).toBe('+1 (234) 567-8901');
  });

  it('exposes labels and shows a clear suffix only while populated', async () => {
    const fixture = TestBed.createComponent(InputMaskTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.id).toBe('phone');
    expect(input.getAttribute('aria-label')).toBe('Phone number');

    input.value = '123';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const clear = fixture.nativeElement.querySelector(
      '.aeris-input-mask__clear',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.phone()).toBe('');
    expect(document.activeElement).toBe(input);
    expect(fixture.nativeElement.querySelector('.aeris-input-mask__clear')).toBeNull();
  });

  it('supports unmasked models, slot display, and automatic clearing', async () => {
    const fixture = TestBed.createComponent(InputMaskOptionsTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('__-___');

    input.value = 'ab12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.code()).toBe('ab12');
    expect(input.value).toBe('ab-12_');

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.code()).toBe('');
  });

  it('supports escaped mask symbols as literals', async () => {
    const fixture = TestBed.createComponent(InputMaskOptionsTestHost);
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    expect(inputs[1]?.value).toBe('9-12');
  });
});
