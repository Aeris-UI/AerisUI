import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { AerisCheckbox } from '../../../checkbox/aeris-checkbox';
import { AerisInputMask } from '../../../input-mask/aeris-input-mask';
import { AerisInputNumber } from '../../../input-number/aeris-input-number';
import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisRadioButton } from '../../../radio-button/aeris-radio-button';
import {
  AerisSelect,
  type AerisSelectOption,
} from '../../../select/aeris-select';
import { AerisTextarea } from '../../../textarea/aeris-textarea';
import { AerisToggleSwitch } from '../../../toggle-switch/aeris-toggle-switch';

@Component({
  imports: [
    ReactiveFormsModule,
    AerisInputText,
    AerisInputNumber,
    AerisInputMask,
    AerisCheckbox,
    AerisRadioButton,
    AerisSelect,
    AerisTextarea,
    AerisToggleSwitch,
  ],
  template: `
    <input id="native-text" aerisInputText [formControl]="nativeText" />
    <textarea
      id="native-textarea"
      aerisTextarea
      [formControl]="nativeTextarea"
    ></textarea>
    <aeris-input-text inputId="text" [formControl]="text" />
    <aeris-textarea inputId="textarea" [formControl]="textarea" />
    <aeris-toggle-switch
      inputId="toggle"
      ariaLabel="Reactive setting"
      [formControl]="toggle"
    />
    <aeris-input-number inputId="number" [formControl]="number" />
    <aeris-input-mask inputId="mask" mask="999-999" [formControl]="mask" />
    <aeris-checkbox inputId="checkbox" [formControl]="checkbox">
      Enabled
    </aeris-checkbox>
    <aeris-radio-button
      inputId="reactive-starter"
      name="reactive-plan"
      value="starter"
      [formControl]="plan"
    >
      Starter
    </aeris-radio-button>
    <aeris-radio-button
      inputId="reactive-team"
      name="reactive-plan"
      value="team"
      [formControl]="plan"
    >
      Team
    </aeris-radio-button>
    <aeris-select
      inputId="reactive-role"
      ariaLabel="Reactive role"
      [options]="roles"
      [formControl]="role"
    />
  `,
})
class ReactiveFormsTestHost {
  readonly nativeText = new FormControl('native');
  readonly nativeTextarea = new FormControl('native multiline');
  readonly text = new FormControl('Aeris');
  readonly textarea = new FormControl('Aeris multiline');
  readonly toggle = new FormControl(false);
  readonly number = new FormControl<number | null>(4);
  readonly mask = new FormControl('123456');
  readonly checkbox = new FormControl(false);
  readonly plan = new FormControl<string | null>('starter');
  readonly role = new FormControl<string | null>('designer');
  readonly roles: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Software engineer', value: 'engineer' },
  ];
}

@Component({
  imports: [
    FormsModule,
    AerisInputText,
    AerisInputNumber,
    AerisInputMask,
    AerisCheckbox,
    AerisRadioButton,
    AerisSelect,
    AerisTextarea,
    AerisToggleSwitch,
  ],
  template: `
    <aeris-input-text inputId="text" name="text" [(ngModel)]="text" />
    <aeris-textarea
      inputId="textarea"
      name="textarea"
      [(ngModel)]="textarea"
    />
    <aeris-toggle-switch
      inputId="toggle"
      name="toggle"
      ariaLabel="Template setting"
      [(ngModel)]="toggle"
    />
    <aeris-input-number inputId="number" name="number" [(ngModel)]="number" />
    <aeris-input-mask
      inputId="mask"
      name="mask"
      mask="999-999"
      [(ngModel)]="mask"
    />
    <aeris-checkbox inputId="checkbox" name="checkbox" [(ngModel)]="checkbox">
      Enabled
    </aeris-checkbox>
    <aeris-radio-button
      inputId="template-starter"
      name="templatePlan"
      value="starter"
      [(ngModel)]="plan"
    >
      Starter
    </aeris-radio-button>
    <aeris-radio-button
      inputId="template-team"
      name="templatePlan"
      value="team"
      [(ngModel)]="plan"
    >
      Team
    </aeris-radio-button>
    <aeris-select
      inputId="template-role"
      name="role"
      ariaLabel="Template role"
      [options]="roles"
      [(ngModel)]="role"
    />
  `,
})
class TemplateFormsTestHost {
  text = 'Aeris';
  textarea = 'Aeris multiline';
  toggle = false;
  number: number | null = 4;
  mask = '123-456';
  checkbox = false;
  plan: string | null = 'starter';
  role: string | null = 'designer';
  readonly roles: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Software engineer', value: 'engineer' },
  ];
}

describe('Aeris Angular Forms integration', () => {
  it('synchronizes Reactive Forms values, touched state, and disabled state', async () => {
    const fixture = TestBed.createComponent(ReactiveFormsTestHost);
    await fixture.whenStable();

    const text = fixture.nativeElement.querySelector('#text') as HTMLInputElement;
    const textarea = fixture.nativeElement.querySelector('#textarea') as HTMLTextAreaElement;
    const toggle = fixture.nativeElement.querySelector('#toggle') as HTMLInputElement;
    const number = fixture.nativeElement.querySelector('#number') as HTMLInputElement;
    const mask = fixture.nativeElement.querySelector('#mask') as HTMLInputElement;
    const checkbox = fixture.nativeElement.querySelector('#checkbox') as HTMLInputElement;
    const starter = fixture.nativeElement.querySelector('#reactive-starter') as HTMLInputElement;
    const team = fixture.nativeElement.querySelector('#reactive-team') as HTMLInputElement;
    const role = fixture.nativeElement.querySelector('#reactive-role') as HTMLButtonElement;

    expect(text.value).toBe('Aeris');
    expect(textarea.value).toBe('Aeris multiline');
    expect(toggle.checked).toBe(false);
    expect(number.value).toBe('4');
    expect(mask.value).toBe('123-456');
    expect(checkbox.checked).toBe(false);
    expect(starter.checked).toBe(true);
    expect(team.checked).toBe(false);
    expect(role.textContent).toContain('Product designer');

    text.value = 'Modern';
    text.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.value = 'Modern multiline';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    toggle.click();
    number.dispatchEvent(new FocusEvent('focus'));
    number.value = '8';
    number.dispatchEvent(new Event('input', { bubbles: true }));
    mask.value = '654321';
    mask.dispatchEvent(new Event('input', { bubbles: true }));
    checkbox.click();
    team.click();
    role.click();
    fixture.detectChanges();
    const reactiveRoleOption = fixture.nativeElement.querySelectorAll(
      '.aeris-select__panel [role="option"]',
    )[1] as HTMLElement;
    reactiveRoleOption.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.text.value).toBe('Modern');
    expect(fixture.componentInstance.textarea.value).toBe('Modern multiline');
    expect(fixture.componentInstance.toggle.value).toBe(true);
    expect(fixture.componentInstance.number.value).toBe(8);
    expect(fixture.componentInstance.mask.value).toBe('654-321');
    expect(fixture.componentInstance.checkbox.value).toBe(true);
    expect(fixture.componentInstance.plan.value).toBe('team');
    expect(starter.checked).toBe(false);
    expect(team.checked).toBe(true);
    expect(fixture.componentInstance.role.value).toBe('engineer');

    text.dispatchEvent(new FocusEvent('blur'));
    expect(fixture.componentInstance.text.touched).toBe(true);

    fixture.componentInstance.number.disable();
    fixture.componentInstance.textarea.disable();
    fixture.componentInstance.toggle.disable();
    fixture.componentInstance.plan.disable();
    fixture.componentInstance.role.disable();
    fixture.detectChanges();
    expect(number.disabled).toBe(true);
    expect(textarea.disabled).toBe(true);
    expect(toggle.disabled).toBe(true);
    expect(starter.disabled).toBe(true);
    expect(team.disabled).toBe(true);
    expect(role.disabled).toBe(true);
  });

  it('keeps native InputText compatible with Reactive Forms', async () => {
    const fixture = TestBed.createComponent(ReactiveFormsTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#native-text') as HTMLInputElement;
    input.value = 'updated';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.nativeText.value).toBe('updated');
  });

  it('keeps native Textarea compatible with Reactive Forms', async () => {
    const fixture = TestBed.createComponent(ReactiveFormsTestHost);
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector(
      '#native-textarea',
    ) as HTMLTextAreaElement;
    textarea.value = 'updated multiline';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.nativeTextarea.value).toBe(
      'updated multiline',
    );
  });

  it('synchronizes template-driven ngModel values', async () => {
    const fixture = TestBed.createComponent(TemplateFormsTestHost);
    await fixture.whenStable();

    const text = fixture.nativeElement.querySelector('#text') as HTMLInputElement;
    const textarea = fixture.nativeElement.querySelector('#textarea') as HTMLTextAreaElement;
    const toggle = fixture.nativeElement.querySelector('#toggle') as HTMLInputElement;
    const number = fixture.nativeElement.querySelector('#number') as HTMLInputElement;
    const mask = fixture.nativeElement.querySelector('#mask') as HTMLInputElement;
    const checkbox = fixture.nativeElement.querySelector('#checkbox') as HTMLInputElement;
    const starter = fixture.nativeElement.querySelector('#template-starter') as HTMLInputElement;
    const team = fixture.nativeElement.querySelector('#template-team') as HTMLInputElement;
    const role = fixture.nativeElement.querySelector('#template-role') as HTMLButtonElement;

    text.value = 'Library';
    text.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.value = 'Library multiline';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    toggle.click();
    number.dispatchEvent(new FocusEvent('focus'));
    number.value = '12';
    number.dispatchEvent(new Event('input', { bubbles: true }));
    mask.value = '987654';
    mask.dispatchEvent(new Event('input', { bubbles: true }));
    checkbox.click();
    team.click();
    role.click();
    fixture.detectChanges();
    const templateRoleOption = fixture.nativeElement.querySelectorAll(
      '.aeris-select__panel [role="option"]',
    )[1] as HTMLElement;
    templateRoleOption.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.text).toBe('Library');
    expect(fixture.componentInstance.textarea).toBe('Library multiline');
    expect(fixture.componentInstance.toggle).toBe(true);
    expect(fixture.componentInstance.number).toBe(12);
    expect(fixture.componentInstance.mask).toBe('987-654');
    expect(fixture.componentInstance.checkbox).toBe(true);
    expect(fixture.componentInstance.plan).toBe('team');
    expect(starter.checked).toBe(false);
    expect(team.checked).toBe(true);
    expect(fixture.componentInstance.role).toBe('engineer');
  });
});
