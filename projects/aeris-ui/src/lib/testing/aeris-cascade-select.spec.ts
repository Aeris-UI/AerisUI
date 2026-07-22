import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import {
  AerisCascadeSelect,
  type AerisCascadeSelectChangeEvent,
  type AerisCascadeSelectOption,
} from '../../../cascade-select/aeris-cascade-select';

const options: readonly AerisCascadeSelectOption[] = [
  {
    label: 'Europe',
    value: 'europe',
    children: [
      {
        label: 'Portugal',
        value: 'portugal',
        children: [
          { label: 'Lisbon', value: 'lisbon' },
          { label: 'Porto', value: 'porto' },
        ],
      },
      {
        label: 'Serbia',
        value: 'serbia',
        children: [
          { label: 'Belgrade', value: 'belgrade' },
          { label: 'Novi Sad', value: 'novi-sad', disabled: true },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'north-america',
    children: [
      {
        label: 'United States',
        value: 'united-states',
        children: [{ label: 'Austin', value: 'austin' }],
      },
    ],
  },
];

@Component({
  imports: [AerisCascadeSelect],
  template: `
    <label for="location">Location</label>
    <aeris-cascade-select
      inputId="location"
      name="location"
      [(value)]="value"
      [options]="options"
      clearable
      required
      invalid
      ariaDescribedby="location-error"
      (changed)="lastChange.set($event)"
    />
  `,
})
class CascadeSelectHost {
  readonly value = signal<string | null>('lisbon');
  readonly lastChange = signal<AerisCascadeSelectChangeEvent | null>(null);
  readonly options = options;
}

@Component({
  imports: [AerisCascadeSelect],
  template: `
    <aeris-cascade-select
      ariaLabel="Region"
      [(value)]="value"
      [options]="options"
      selectBranches
    />
  `,
})
class CascadeSelectBranchesHost {
  readonly value = signal<string | null>(null);
  readonly options = options;
}

@Component({
  imports: [AerisCascadeSelect, ReactiveFormsModule],
  template: `<aeris-cascade-select [formControl]="control" [options]="options" />`,
})
class CascadeSelectFormsHost {
  readonly control = new FormControl<string | null>('lisbon');
  readonly options = options;
}

describe('AerisCascadeSelect', () => {
  it('exposes combobox relationships and form semantics', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe('location-error');
    expect(trigger.textContent).toContain('Europe / Portugal / Lisbon');
    expect(hiddenInput.name).toBe('location');
    expect(hiddenInput.value).toBe('lisbon');
  });

  it('opens columns and selects a leaf option with the mouse', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const northAmerica = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('North America')) as HTMLButtonElement;
    northAmerica.click();
    fixture.detectChanges();

    const unitedStates = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('United States')) as HTMLButtonElement;
    unitedStates.click();
    fixture.detectChanges();

    const austin = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Austin')) as HTMLButtonElement;
    austin.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('austin');
    expect(fixture.componentInstance.lastChange()?.path.map((option) => option.value)).toEqual([
      'north-america',
      'united-states',
      'austin',
    ]);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('navigates columns and selects through the keyboard', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    fixture.componentInstance.value.set(null);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-activedescendant')).toContain('europe');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-activedescendant')).toContain('portugal');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-activedescendant')).toContain('lisbon');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('lisbon');
  });

  it('opens with only the root column visible until a branch is active', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.aeris-cascade-select__column').length).toBe(1);

    const europe = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Europe')) as HTMLButtonElement;
    europe.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.aeris-cascade-select__column').length).toBe(2);
  });

  it('supports boundary keys and skips disabled options', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    fixture.componentInstance.value.set(null);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toContain('north-america');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toContain('europe');
  });

  it('can select branch options when enabled', async () => {
    const fixture = TestBed.createComponent(CascadeSelectBranchesHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const europe = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Europe')) as HTMLButtonElement;
    europe.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('europe');
  });

  it('clears the value and restores focus', async () => {
    const fixture = TestBed.createComponent(CascadeSelectHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#location') as HTMLButtonElement;
    const clear = fixture.nativeElement.querySelector(
      '.aeris-cascade-select__clear',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.value()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('works with Reactive Forms', async () => {
    const fixture = TestBed.createComponent(CascadeSelectFormsHost);
    await fixture.whenStable();

    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const europe = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Europe')) as HTMLButtonElement;
    europe.click();
    fixture.detectChanges();

    const serbia = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Serbia')) as HTMLButtonElement;
    serbia.click();
    fixture.detectChanges();

    const belgrade = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option) => option.textContent.includes('Belgrade')) as HTMLButtonElement;
    belgrade.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('belgrade');
  });
});
