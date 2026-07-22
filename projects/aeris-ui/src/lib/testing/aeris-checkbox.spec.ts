import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisCheckbox,
  type AerisCheckboxChangeEvent,
} from '../../../checkbox/aeris-checkbox';

@Component({
  imports: [AerisCheckbox],
  template: `
    <aeris-checkbox
      inputId="terms"
      name="terms"
      value="accepted"
      label="Accept terms"
      ariaDescribedby="terms-help"
      size="lg"
      labelPosition="start"
      [tabIndex]="-1"
      required
      invalid
      [(checked)]="checked"
      [(indeterminate)]="indeterminate"
      (changed)="lastChange.set($event)"
      (touch)="touches.update(count => count + 1)"
    />
  `,
})
class CheckboxTestHost {
  readonly checked = signal(false);
  readonly indeterminate = signal(true);
  readonly lastChange = signal<AerisCheckboxChangeEvent | null>(null);
  readonly touches = signal(0);
}

describe('AerisCheckbox', () => {
  it('forwards native form and accessibility attributes', async () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(input.id).toBe('terms');
    expect(input.name).toBe('terms');
    expect(input.value).toBe('accepted');
    expect(input.required).toBe(true);
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('terms-help');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.tabIndex).toBe(-1);
    expect(label.dataset['size']).toBe('lg');
    expect(label.dataset['labelPosition']).toBe('start');
    expect(label.textContent).toContain('Accept terms');
  });

  it('moves from mixed to checked and emits a typed change event', async () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.indeterminate()).toBe(false);
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(fixture.componentInstance.lastChange()?.checked).toBe(true);
    expect(fixture.componentInstance.lastChange()?.indeterminate).toBe(false);
    expect(fixture.componentInstance.lastChange()?.value).toBe('accepted');
  });

  it('emits touch when the native input blurs', async () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.touches()).toBe(1);
  });
});
