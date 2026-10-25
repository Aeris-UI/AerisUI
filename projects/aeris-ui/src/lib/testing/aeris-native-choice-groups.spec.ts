import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, required, submit, validate } from '@angular/forms/signals';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  imports: [AerisCheckbox, AerisRadioButton],
  template: `
    <form id="first-form">
      <fieldset [disabled]="disabled()">
        <legend>Choices <aeris-checkbox label="Legend exception" [(checked)]="legend" /></legend>
        <aeris-checkbox
          name="options"
          value="one"
          label="One"
          [appearance]="appearance()"
          [(checked)]="checked"
          ariaDescribedBy="help"
        />
        <aeris-checkbox name="options" value="locked" label="Locked checkbox" disabled />
        <aeris-radio-button
          name="choice"
          value="first"
          label="First"
          required
          [appearance]="appearance()"
          [(selected)]="selection"
          ariaDescribedBy="help"
        />
        <aeris-radio-button
          name="choice"
          value="second"
          label="Second"
          [appearance]="appearance()"
          [(selected)]="selection"
          ariaDescribedBy="help"
        />
        <aeris-radio-button
          name="choice"
          value="locked"
          label="Locked radio"
          disabled
          [(selected)]="selection"
        />
      </fieldset>
      <p id="help">Choose any checkbox and one radio.</p>
    </form>
    <form id="other-form">
      <aeris-radio-button name="choice" value="other" label="Other form" [(selected)]="other" />
    </form>
  `,
})
class NativeGroupsHost {
  readonly disabled = signal(false);
  readonly appearance = signal<'standard' | 'card'>('standard');
  readonly checked = signal(true);
  readonly legend = signal(false);
  readonly selection = signal<string | null>(null);
  readonly other = signal<string | null>(null);
}

@Component({
  imports: [AerisCheckbox, AerisRadioButton, FormField],
  template: `
    <fieldset>
      <legend>One choice</legend>
      <aeris-radio-button
        name="signal-choice"
        value="first"
        label="First"
        [formField]="fields.choice"
        [appearance]="appearance()"
        ariaDescribedBy="choice-error"
      />
      <aeris-radio-button
        name="signal-choice"
        value="second"
        label="Second"
        [formField]="fields.choice"
        [appearance]="appearance()"
        ariaDescribedBy="choice-error"
      />
    </fieldset>
    <fieldset aria-describedby="group-help">
      <legend>At least one checkbox</legend>
      <aeris-checkbox
        label="Alpha"
        [formField]="fields.options.alpha"
        [appearance]="appearance()"
        ariaDescribedBy="group-help"
      />
      <aeris-checkbox
        label="Beta"
        [formField]="fields.options.beta"
        [appearance]="appearance()"
        ariaDescribedBy="group-help"
      />
    </fieldset>
    <p id="choice-error">Choose one radio.</p>
    <p id="group-help">Choose at least one checkbox.</p>
  `,
})
class SignalGroupsHost {
  readonly appearance = signal<'standard' | 'card'>('standard');
  readonly data = signal({ choice: '', options: { alpha: false, beta: false } });
  readonly fields = form(this.data, (schema) => {
    required(schema.choice);
    validate(schema.options, ({ value }) =>
      value().alpha || value().beta
        ? undefined
        : { kind: 'minimumSelection', message: 'Choose at least one.' },
    );
  });
}

describe('Native Checkbox and RadioButton groups', () => {
  for (const appearance of ['standard', 'card'] as const) {
    it(`${appearance}: inherits fieldset disabled state and preserves the first-legend exception`, async () => {
      const fixture = TestBed.createComponent(NativeGroupsHost);
      document.body.appendChild(fixture.nativeElement);
      fixture.componentInstance.appearance.set(appearance);
      fixture.componentInstance.disabled.set(true);
      await fixture.whenStable();
      const inputs = [
        ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
          '#first-form input',
        ),
      ];
      expect(inputs[0].matches(':disabled')).toBe(false);
      for (const input of inputs.slice(1)) {
        expect(input.matches(':disabled')).toBe(true);
        input.click();
      }
      expect(fixture.componentInstance.checked()).toBe(true);
      expect(fixture.componentInstance.selection()).toBeNull();
      inputs[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.legend()).toBe(true);
      fixture.componentInstance.disabled.set(false);
      await fixture.whenStable();
      expect(inputs[1].matches(':disabled')).toBe(false);
      expect(inputs[2].matches(':disabled')).toBe(true);
      expect(inputs[5].matches(':disabled')).toBe(true);
    });

    it(`${appearance}: shares radio values, isolates form owners, and uses native required/serialization semantics`, async () => {
      const fixture = TestBed.createComponent(NativeGroupsHost);
      document.body.appendChild(fixture.nativeElement);
      fixture.componentInstance.appearance.set(appearance);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const radios = [...root.querySelectorAll<HTMLInputElement>('#first-form input[type=radio]')];
      expect(radios[0].validity.valueMissing).toBe(true);
      radios[1].click();
      await fixture.whenStable();
      expect(fixture.componentInstance.selection()).toBe('second');
      expect(radios[0].validity.valueMissing).toBe(false);
      const other = root.querySelector<HTMLInputElement>('#other-form input');
      other?.click();
      await fixture.whenStable();
      expect(radios[1].checked).toBe(true);
      expect(other?.checked).toBe(true);
      const form = root.querySelector<HTMLFormElement>('#first-form');
      if (!form) throw new Error('Missing native form');
      const data = new FormData(form);
      expect(data.get('choice')).toBe('second');
      expect(data.getAll('options')).toEqual(['one']);
      expect(radios[1].getAttribute('aria-describedby')).toBe('help');
    });

    it(`${appearance}: supports Signal Forms required radios and a consumer-owned checkbox minimum`, async () => {
      const fixture = TestBed.createComponent(SignalGroupsHost);
      fixture.componentInstance.appearance.set(appearance);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const radios = [...root.querySelectorAll<HTMLInputElement>('input[type=radio]')];
      const checks = [...root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
      const fields = fixture.componentInstance.fields;
      expect(fields.choice().invalid()).toBe(true);
      expect(fields.options().getError('minimumSelection')).toBeDefined();
      expect(radios[0].getAttribute('aria-invalid')).toBeNull();
      expect(await submit(fields, async () => undefined)).toBe(false);
      await fixture.whenStable();
      expect(radios[0].getAttribute('aria-invalid')).toBe('true');
      expect(fields.options.alpha().touched()).toBe(true);
      radios[1].click();
      checks[0].click();
      await fixture.whenStable();
      expect(fixture.componentInstance.data()).toEqual({
        choice: 'second',
        options: { alpha: true, beta: false },
      });
      expect(radios[1].checked).toBe(true);
      expect(radios[0].checked).toBe(false);
      expect(fields().valid()).toBe(true);
      expect(radios[0].getAttribute('aria-invalid')).toBeNull();
      expect(checks[0].getAttribute('aria-describedby')).toBe('group-help');
    });
  }
});
