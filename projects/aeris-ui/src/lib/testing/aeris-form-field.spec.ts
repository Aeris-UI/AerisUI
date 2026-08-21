import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisFormField } from '../../../form-field/aeris-form-field';
import { AerisInputNumber } from '../../../input-number/aeris-input-number';

@Component({
  imports: [AerisFormField, AerisInputNumber],
  template: `
    <div class="profile-grid">
      <aeris-form-field
        #nameField
        ariaDescribedby="profile-context"
        required
        fluid
        reserveMessageSpace
        [invalid]="invalid()"
      >
        <label aerisFormLabel>Name</label>
        <input aerisFormControl type="text" />
        <small aerisFormHint>Shown on your profile.</small>
        <small aerisFormError>Enter a name.</small>
      </aeris-form-field>

      <aeris-form-field #heightField optional optionalText="Not required" disabled fluid>
        <label aerisFormLabel>Height</label>
        <aeris-input-number
          [inputId]="heightField.controlId()"
          [ariaLabelledby]="heightField.labelId()"
          [ariaDescribedby]="heightField.describedBy()"
          fluid
        />
        <small aerisFormHint>Used to calculate BMI.</small>
      </aeris-form-field>
    </div>
  `,
  styles: `
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: stretch;
    }
  `,
})
class FormFieldHost {
  readonly invalid = signal(false);
}

describe('AerisFormField', () => {
  it('keeps projected field rows top-aligned with stable spacing', () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    fixture.detectChanges();

    const fields = fixture.nativeElement.querySelectorAll(
      'aeris-form-field',
    ) as NodeListOf<HTMLElement>;
    const firstStyle = getComputedStyle(fields[0] as HTMLElement);

    expect(firstStyle.display).toBe('grid');
    expect(firstStyle.alignContent).toBe('start');
    expect(firstStyle.gridAutoRows).toBe('max-content');
    expect(firstStyle.gap).toContain('--aeris-form-field-gap');
    expect(fields[0]?.getAttribute('data-fluid')).toBe('true');
    expect(fields[0]?.getAttribute('data-reserve-message-space')).toBe('true');
    expect(fields[0]?.querySelector('.aeris-form-field__control')).not.toBeNull();
    expect(fields[0]?.querySelector('.aeris-form-field__support')).not.toBeNull();
  });

  it('generates native label, description, required, and validation relationships', () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    fixture.detectChanges();

    const field = fixture.nativeElement.querySelector('aeris-form-field') as HTMLElement;
    const label = field.querySelector('label') as HTMLLabelElement;
    const input = field.querySelector('input') as HTMLInputElement;
    const hint = field.querySelector('[aerisFormHint]') as HTMLElement;
    const error = field.querySelector('[aerisFormError]') as HTMLElement;

    expect(input.id).toMatch(/^aeris-form-field-\d+-control$/);
    expect(label.htmlFor).toBe(input.id);
    expect(label.id).toBe(`${input.id}-label`);
    expect(hint.id).toBe(`${input.id}-hint`);
    expect(error.id).toBe(`${input.id}-error`);
    expect(input.getAttribute('aria-describedby')).toBe(`profile-context ${hint.id}`);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(label.getAttribute('data-required')).toBe('true');
    expect(error.hidden).toBe(true);
    expect(error.getAttribute('aria-live')).toBe('polite');

    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(input.getAttribute('aria-describedby')).toBe(`profile-context ${hint.id} ${error.id}`);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(error.hidden).toBe(false);
  });

  it('exposes IDs for Aeris controls and supports optional and disabled presentation', () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    fixture.detectChanges();

    const fields = fixture.nativeElement.querySelectorAll(
      'aeris-form-field',
    ) as NodeListOf<HTMLElement>;
    const field = fields[1] as HTMLElement;
    const label = field.querySelector('label') as HTMLLabelElement;
    const input = field.querySelector('input') as HTMLInputElement;
    const hint = field.querySelector('[aerisFormHint]') as HTMLElement;

    expect(label.htmlFor).toBe(input.id);
    expect(input.getAttribute('aria-labelledby')).toBe(label.id);
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(label.getAttribute('data-optional-text')).toBe('Not required');
    expect(field.getAttribute('data-disabled')).toBe('true');
    expect(field.getAttribute('data-fluid')).toBe('true');
  });

  it('creates unique control IDs for separate fields', () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    fixture.detectChanges();

    const ids = Array.from<HTMLInputElement>(fixture.nativeElement.querySelectorAll('input')).map(
      (input) => input.id,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });
});
