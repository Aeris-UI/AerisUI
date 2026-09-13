import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, required, submit } from '@angular/forms/signals';

import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisSelect, type AerisSelectOption } from '../../../select/aeris-select';

@Component({
  imports: [FormField, AerisInputText, AerisSelect],
  template: `
    <input id="signal-name" aerisInputText [formField]="profileForm.name" />
    <aeris-select
      inputId="signal-role"
      ariaLabel="Role"
      [options]="roles"
      [formField]="profileForm.role"
    />

    <input id="manual-invalid" aerisInputText invalid />
    <input id="manual-untouched" aerisInputText invalid [touched]="false" />
  `,
})
class SignalFormsValidationHost {
  readonly profile = signal({ name: '', role: '' });
  readonly profileForm = form(this.profile, (path) => {
    required(path.name);
    required(path.role);
  });
  readonly roles: readonly AerisSelectOption[] = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
  ];
}

describe('Aeris Signal Forms validation presentation', () => {
  it('keeps required pristine controls neutral while retaining logical invalid state', async () => {
    const fixture = TestBed.createComponent(SignalFormsValidationHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#signal-name') as HTMLInputElement;
    const select = fixture.nativeElement.querySelector('aeris-select') as HTMLElement;
    const trigger = select.querySelector('.aeris-select__trigger') as HTMLButtonElement;

    expect(fixture.componentInstance.profileForm.name().invalid()).toBe(true);
    expect(fixture.componentInstance.profileForm.name().touched()).toBe(false);
    expect(input.classList).not.toContain('aeris-input-text--invalid');
    expect(input.getAttribute('aria-invalid')).toBeNull();

    expect(fixture.componentInstance.profileForm.role().invalid()).toBe(true);
    expect(fixture.componentInstance.profileForm.role().touched()).toBe(false);
    expect(select.querySelector('.aeris-select')?.getAttribute('data-invalid')).toBeNull();
    expect(trigger.getAttribute('aria-invalid')).toBeNull();
  });

  it('presents invalid state after blur and removes it after a valid value is entered', async () => {
    const fixture = TestBed.createComponent(SignalFormsValidationHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#signal-name') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().touched()).toBe(true);
    expect(input.classList).toContain('aeris-input-text--invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    input.value = 'Ada';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().invalid()).toBe(false);
    expect(input.classList).not.toContain('aeris-input-text--invalid');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('marks untouched invalid controls as touched when submission is attempted', async () => {
    const fixture = TestBed.createComponent(SignalFormsValidationHost);
    await fixture.whenStable();

    const submitted = await submit(fixture.componentInstance.profileForm, async () => undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#signal-name') as HTMLInputElement;
    const select = fixture.nativeElement.querySelector('aeris-select') as HTMLElement;
    const trigger = select.querySelector('.aeris-select__trigger') as HTMLButtonElement;

    expect(submitted).toBe(false);
    expect(fixture.componentInstance.profileForm.name().touched()).toBe(true);
    expect(fixture.componentInstance.profileForm.role().touched()).toBe(true);
    expect(input.classList).toContain('aeris-input-text--invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(select.querySelector('.aeris-select')?.getAttribute('data-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
  });

  it('preserves immediate manual invalid state unless touched is explicitly false', async () => {
    const fixture = TestBed.createComponent(SignalFormsValidationHost);
    await fixture.whenStable();

    const immediate = fixture.nativeElement.querySelector('#manual-invalid') as HTMLInputElement;
    const deferred = fixture.nativeElement.querySelector('#manual-untouched') as HTMLInputElement;

    expect(immediate.classList).toContain('aeris-input-text--invalid');
    expect(immediate.getAttribute('aria-invalid')).toBe('true');
    expect(deferred.classList).not.toContain('aeris-input-text--invalid');
    expect(deferred.getAttribute('aria-invalid')).toBeNull();
  });
});
