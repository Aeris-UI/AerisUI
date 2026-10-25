import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisCheckbox } from '../../../checkbox/aeris-checkbox';
import { AerisRadioButton } from '../../../radio-button/aeris-radio-button';

@Component({
  imports: [AerisCheckbox, AerisRadioButton, ReactiveFormsModule],
  template: `
    <ng-template #icon><svg data-consumer-icon aria-hidden="true"></svg></ng-template>
    <aeris-checkbox
      appearance="card"
      label="Reports"
      description="Weekly activity summary"
      ariaDescribedBy="help"
      [iconTemplate]="icon"
      [formControl]="reports"
      (changed)="changes.update(increment)"
    />
    <aeris-radio-button
      appearance="card"
      name="delivery"
      value="standard"
      label="Standard"
      description="Three working days"
      [iconTemplate]="icon"
      [formControl]="delivery"
    />
    <aeris-radio-button
      appearance="card"
      name="delivery"
      value="express"
      label="Express"
      description="Next working day"
      [formControl]="delivery"
    />
    <span id="help">You can change this later.</span>
  `,
})
class ChoiceCardsHost {
  readonly reports = new FormControl(false, { nonNullable: true });
  readonly delivery = new FormControl('express', { nonNullable: true });
  readonly changes = signal(0);
  readonly increment = (value: number) => value + 1;
}

@Component({
  imports: [AerisCheckbox, FormField],
  template: `<aeris-checkbox
    appearance="card"
    label="Accept terms"
    description="Required to continue"
    [formField]="preferencesForm.terms"
  />`,
})
class SignalCardHost {
  readonly preferences = signal({ terms: false });
  readonly preferencesForm = form(this.preferences, (path) => required(path.terms));
}

describe('Selectable choice cards', () => {
  it('activates a whole card once using the existing checkbox value accessor', async () => {
    const fixture = TestBed.createComponent(ChoiceCardsHost);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('aeris-checkbox label').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.reports.value).toBe(true);
    expect(fixture.componentInstance.changes()).toBe(1);
    expect(fixture.nativeElement.querySelector('aeris-checkbox label').dataset.selected).toBe(
      'true',
    );
  });

  it('updates radio peers without introducing additional inputs or focus stops', async () => {
    const fixture = TestBed.createComponent(ChoiceCardsHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLLabelElement>('aeris-radio-button label')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.delivery.value).toBe('standard');
    expect(
      [...root.querySelectorAll<HTMLInputElement>('input[type=radio]')].map(
        (input) => input.checked,
      ),
    ).toEqual([true, false]);
    expect(root.querySelectorAll('input').length).toBe(3);
    expect(root.querySelectorAll('label :is(button, a, [tabindex]):not(input)').length).toBe(0);
  });

  it('associates titles and descriptions separately and projects decorative icons', async () => {
    const fixture = TestBed.createComponent(ChoiceCardsHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input');
    const labelledBy = input?.getAttribute('aria-labelledby');
    const describedBy = input?.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(root.querySelector(`[id="${labelledBy}"]`)?.textContent?.trim()).toBe('Reports');
    expect(describedBy).toContain('help');
    expect(describedBy.length).toBe(2);
    expect(root.querySelector(`[id="${describedBy[1]}"]`)?.textContent).toBe(
      'Weekly activity summary',
    );
    expect(root.querySelectorAll('[data-consumer-icon]').length).toBe(2);
  });

  it('does not activate disabled cards', async () => {
    const fixture = TestBed.createComponent(ChoiceCardsHost);
    fixture.componentInstance.reports.disable();
    fixture.componentInstance.delivery.disable();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelectorAll<HTMLLabelElement>('label').forEach((label) => label.click());
    expect(fixture.componentInstance.reports.value).toBe(false);
    expect(fixture.componentInstance.delivery.value).toBe('express');
    expect(fixture.componentInstance.changes()).toBe(0);
  });

  it('preserves mixed state and explicit accessible names', async () => {
    const fixture = TestBed.createComponent(AerisCheckbox);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('description', 'Details');
    fixture.componentRef.setInput('ariaLabel', 'Custom name');
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Custom name');
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    input.click();
    await fixture.whenStable();
    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(true);
  });

  it('retains Signal Forms validation timing and clears errors after a valid change', async () => {
    const fixture = TestBed.createComponent(SignalCardHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(fixture.componentInstance.preferencesForm.terms().invalid()).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    input.dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.preferencesForm.terms().touched()).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    input.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.preferences().terms).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows untouched invalid cards after Signal Forms submission', async () => {
    const fixture = TestBed.createComponent(SignalCardHost);
    await fixture.whenStable();
    expect(await submit(fixture.componentInstance.preferencesForm, async () => undefined)).toBe(
      false,
    );
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('label').getAttribute('data-invalid')).toBe('true');
  });

  it('keeps standard appearance as the default and respects explicit touched state', async () => {
    const fixture = TestBed.createComponent(AerisRadioButton);
    fixture.componentRef.setInput('value', 'option');
    fixture.componentRef.setInput('invalid', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.aeris-choice-card')).toBeNull();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('touched', false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.aeris-choice-card')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBeNull();
  });
});
