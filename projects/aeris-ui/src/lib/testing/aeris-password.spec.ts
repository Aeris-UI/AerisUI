import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import {
  AerisPassword,
  AerisPasswordComponent,
  evaluateAerisPassword,
} from '../../../password/aeris-password';

@Component({
  imports: [AerisPassword, ReactiveFormsModule],
  template: `
    <label for="account-password">Password</label>
    <aeris-password
      inputId="account-password"
      [formControl]="password"
      clearable
      required
      [invalid]="invalid()"
    />
  `,
})
class PasswordTestHost {
  readonly password = new FormControl('Secret1!');
  readonly invalid = signal(false);
}

describe('AerisPassword', () => {
  it('preserves password semantics and accessible state', async () => {
    const fixture = TestBed.createComponent(PasswordTestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.required).toBe(true);
    expect(input.autocomplete).toBe('current-password');
    expect(input.value).toBe('Secret1!');
  });

  it('toggles visibility and restores input focus', async () => {
    const fixture = TestBed.createComponent(PasswordTestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const toggle = fixture.nativeElement.querySelector('.aeris-password__visibility') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    await Promise.resolve();
    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  it('shows feedback while focused and exposes it as a description', async () => {
    const fixture = TestBed.createComponent(PasswordTestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const feedback = fixture.nativeElement.querySelector('.aeris-password__feedback') as HTMLElement;
    expect(feedback).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toContain(feedback.id);
    expect(feedback.textContent).toContain('Strong password');
  });

  it('clears the value through ControlValueAccessor', async () => {
    const fixture = TestBed.createComponent(PasswordTestHost);
    await fixture.whenStable();
    const clear = fixture.nativeElement.querySelector('.aeris-password__clear') as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.password.value).toBe('');
  });

  it('supports a deterministic default strength evaluator', () => {
    expect(evaluateAerisPassword('', 8).strength).toBe('empty');
    expect(evaluateAerisPassword('short', 8).strength).toBe('weak');
    expect(evaluateAerisPassword('LongPassword1!', 8).strength).toBe('strong');
  });

  it('honors disabled form state for input and actions', async () => {
    const fixture = TestBed.createComponent(AerisPasswordComponent);
    fixture.componentRef.setInput('value', 'Secret1!');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).disabled).toBe(true);
    fixture.componentInstance.toggleVisibility();
    fixture.componentInstance.clear();
    expect(fixture.componentInstance.visible()).toBe(false);
    expect(fixture.componentInstance.value()).toBe('Secret1!');
  });
});
