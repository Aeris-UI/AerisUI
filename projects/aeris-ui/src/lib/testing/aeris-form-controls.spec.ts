import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisCheckbox } from '../../../checkbox/aeris-checkbox';
import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisRadioButton } from '../../../radio-button/aeris-radio-button';
import { AerisSelect, type AerisSelectOption } from '../../../select/aeris-select';
import { AerisTextarea } from '../../../textarea/aeris-textarea';
import { AerisToggleSwitch } from '../../../toggle-switch/aeris-toggle-switch';

@Component({
  imports: [
    AerisCheckbox,
    AerisInputText,
    AerisRadioButton,
    AerisSelect,
    AerisTextarea,
    AerisToggleSwitch,
  ],
  template: `
    <input
      aerisInputText
      size="lg"
      appearance="filled"
      invalid
      fluid
      aria-label="Name"
    />
    <aeris-input-text
      inputId="search"
      ariaLabel="Search"
      clearable
      [(value)]="search"
      (valueInput)="lastTextInput.set($event)"
    />
    <textarea aerisTextarea aria-label="Notes"></textarea>
    <aeris-checkbox [(checked)]="checked">Updates</aeris-checkbox>
    <aeris-radio-button name="plan" value="pro" [(selected)]="plan">Pro</aeris-radio-button>
    <aeris-toggle-switch ariaLabel="Enabled" [(checked)]="enabled" />
    <aeris-select ariaLabel="Role" [options]="options" [(value)]="role" />
  `,
})
class FormControlsTestHost {
  readonly checked = signal(false);
  readonly search = signal('Aeris');
  readonly lastTextInput = signal('');
  readonly plan = signal<string | null>(null);
  readonly enabled = signal(false);
  readonly role = signal<string | null>(null);
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
  ];
}

describe('Aeris form controls', () => {
  it('applies native field classes and invalid semantics', async () => {
    const fixture = TestBed.createComponent(FormControlsTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[aerisInputText]') as HTMLInputElement;
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(input.classList).toContain('aeris-input-text');
    expect(input.classList).toContain('aeris-input-text--lg');
    expect(input.classList).toContain('aeris-input-text--filled');
    expect(input.classList).toContain('aeris-input-text--fluid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.classList).toContain('aeris-textarea');
  });

  it('updates checkbox, radio, and switch models', async () => {
    const fixture = TestBed.createComponent(FormControlsTestHost);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('aeris-checkbox input') as HTMLInputElement).click();
    (fixture.nativeElement.querySelector('aeris-radio-button input') as HTMLInputElement).click();
    (fixture.nativeElement.querySelector(
      'aeris-toggle-switch input',
    ) as HTMLInputElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.checked()).toBe(true);
    expect(fixture.componentInstance.plan()).toBe('pro');
    expect(fixture.componentInstance.enabled()).toBe(true);
  });

  it('clears the InputText wrapper value and restores focus', async () => {
    const fixture = TestBed.createComponent(FormControlsTestHost);
    await fixture.whenStable();

    const clear = fixture.nativeElement.querySelector(
      '.aeris-input-text-component__clear',
    ) as HTMLButtonElement;
    const input = fixture.nativeElement.querySelector('#search') as HTMLInputElement;
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.search()).toBe('');
    expect(fixture.componentInstance.lastTextInput()).toBe('');
    expect(document.activeElement).toBe(input);
    expect(fixture.nativeElement.querySelector('.aeris-input-text-component__clear')).toBeNull();
  });

  it('selects an option and exposes listbox semantics', async () => {
    const fixture = TestBed.createComponent(FormControlsTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      'aeris-select .aeris-select__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();

    const option = fixture.nativeElement.querySelectorAll(
      'aeris-select [role="option"]',
    )[1] as HTMLButtonElement;
    option.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.role()).toBe('engineer');
  });
});
