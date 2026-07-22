import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisRadioButton,
  type AerisRadioButtonChangeEvent,
} from '../../../radio-button/aeris-radio-button';

@Component({
  imports: [AerisRadioButton],
  template: `
    <aeris-radio-button
      inputId="starter"
      name="plan"
      value="starter"
      required
      ariaDescribedby="plan-help"
      [(selected)]="plan"
      (changed)="lastChange.set($event)"
    >
      Starter
    </aeris-radio-button>
    <aeris-radio-button
      inputId="team"
      name="plan"
      value="team"
      [disabled]="teamDisabled()"
      [(selected)]="plan"
      (changed)="lastChange.set($event)"
    >
      Team
    </aeris-radio-button>
  `,
})
class RadioButtonTestHost {
  readonly plan = signal<string | null>('starter');
  readonly teamDisabled = signal(false);
  readonly lastChange = signal<AerisRadioButtonChangeEvent | null>(null);
}

describe('AerisRadioButton', () => {
  it('exposes native group, required, description, and checked semantics', async () => {
    const fixture = TestBed.createComponent(RadioButtonTestHost);
    await fixture.whenStable();

    const starter = fixture.nativeElement.querySelector('#starter') as HTMLInputElement;
    const team = fixture.nativeElement.querySelector('#team') as HTMLInputElement;

    expect(starter.type).toBe('radio');
    expect(starter.name).toBe('plan');
    expect(starter.required).toBe(true);
    expect(starter.getAttribute('aria-describedby')).toBe('plan-help');
    expect(starter.checked).toBe(true);
    expect(team.checked).toBe(false);
  });

  it('updates the selected model and emits a typed user change', async () => {
    const fixture = TestBed.createComponent(RadioButtonTestHost);
    await fixture.whenStable();

    const team = fixture.nativeElement.querySelector('#team') as HTMLInputElement;
    team.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.plan()).toBe('team');
    expect(fixture.componentInstance.lastChange()?.value).toBe('team');
    expect(team.checked).toBe(true);

    const starter = fixture.nativeElement.querySelector('#starter') as HTMLInputElement;
    starter.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.plan()).toBe('starter');
    expect(fixture.componentInstance.lastChange()?.value).toBe('starter');
  });

  it('prevents disabled options from changing selection', async () => {
    const fixture = TestBed.createComponent(RadioButtonTestHost);
    fixture.componentInstance.teamDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const team = fixture.nativeElement.querySelector('#team') as HTMLInputElement;
    expect(team.disabled).toBe(true);

    team.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.plan()).toBe('starter');
  });
});
