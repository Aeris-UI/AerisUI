import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import {
  AerisInputOtp,
  AerisInputOtpComponent,
  type AerisInputOtpCompleteEvent,
} from '../../../input-otp/aeris-input-otp';

@Component({
  imports: [AerisInputOtp, ReactiveFormsModule],
  template: `
    <span id="otp-label">Verification code</span>
    <aeris-input-otp
      inputId="verification-code"
      name="otp"
      ariaLabelledby="otp-label"
      [formControl]="code"
      (completed)="lastComplete.set($event)"
    />
  `,
})
class InputOtpTestHost {
  readonly code = new FormControl('');
  readonly lastComplete = signal<AerisInputOtpCompleteEvent | null>(null);
}

describe('AerisInputOtp', () => {
  it('exposes grouped accessible slots and native form serialization', async () => {
    const fixture = TestBed.createComponent(InputOtpTestHost);
    await fixture.whenStable();
    const group = fixture.nativeElement.querySelector('[role=group]') as HTMLElement;
    const inputs = fixture.nativeElement.querySelectorAll('.aeris-input-otp__slot') as NodeListOf<HTMLInputElement>;
    expect(group.getAttribute('aria-labelledby')).toBe('otp-label');
    expect(inputs.length).toBe(4);
    expect(inputs[0]?.id).toBe('verification-code');
    expect(inputs[0]?.getAttribute('aria-label')).toBe('Character 1 of 4');
    expect((fixture.nativeElement.querySelector('input[type=hidden]') as HTMLInputElement).name).toBe('otp');
  });

  it('accepts numeric input and advances focus', async () => {
    const fixture = TestBed.createComponent(InputOtpTestHost);
    await fixture.whenStable();
    const inputs = fixture.nativeElement.querySelectorAll('.aeris-input-otp__slot') as NodeListOf<HTMLInputElement>;
    const first = inputs[0] as HTMLInputElement;
    first.value = '5';
    first.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await Promise.resolve();
    expect(fixture.componentInstance.code.value).toBe('5');
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('distributes pasted content and emits completion', async () => {
    const fixture = TestBed.createComponent(InputOtpTestHost);
    await fixture.whenStable();
    const first = fixture.nativeElement.querySelector('.aeris-input-otp__slot') as HTMLInputElement;
    const paste = new Event('paste', { bubbles: true }) as ClipboardEvent;
    Object.defineProperty(paste, 'clipboardData', {
      value: { getData: () => '12 34' },
    });
    first.dispatchEvent(paste);
    fixture.detectChanges();
    expect(fixture.componentInstance.code.value).toBe('1234');
    expect(fixture.componentInstance.lastComplete()?.value).toBe('1234');
  });

  it('supports arrow navigation and backspace clearing', async () => {
    const fixture = TestBed.createComponent(InputOtpTestHost);
    fixture.componentInstance.code.setValue('1234');
    await fixture.whenStable();
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('.aeris-input-otp__slot') as NodeListOf<HTMLInputElement>;
    inputs[2]?.focus();
    inputs[2]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(inputs[1]);
    inputs[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.code.value).toBe('134');
  });

  it('supports alphanumeric and masked modes', async () => {
    const direct = TestBed.createComponent(AerisInputOtpComponent);
    direct.componentRef.setInput('mode', 'alphanumeric');
    direct.componentRef.setInput('mask', true);
    direct.componentRef.setInput('value', 'A2B4');
    direct.detectChanges();
    await direct.whenStable();
    const inputs = direct.nativeElement.querySelectorAll('.aeris-input-otp__slot') as NodeListOf<HTMLInputElement>;
    expect(inputs[0]?.type).toBe('password');
    expect(inputs[0]?.value).toBe('A');
  });
});
