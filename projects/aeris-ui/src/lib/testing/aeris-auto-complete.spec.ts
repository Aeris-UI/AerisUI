import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import {
  AerisAutoComplete,
  type AerisAutoCompleteOption,
  type AerisAutoCompleteSelectEvent,
} from '../../../auto-complete/aeris-auto-complete';

@Component({
  imports: [AerisAutoComplete],
  template: `
    <label for="skill">Skill</label>
    <aeris-auto-complete
      inputId="skill"
      name="skill"
      [(value)]="value"
      [suggestions]="options"
      clearable
      dropdown
      completeOnFocus
      required
      invalid
      ariaDescribedby="skill-error"
      (selected)="lastSelection.set($event)"
    />
  `,
})
class AutoCompleteHost {
  readonly value = signal('Angular');
  readonly lastSelection = signal<AerisAutoCompleteSelectEvent | null>(null);
  readonly options: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', group: 'Frontend' },
    { label: 'TypeScript', value: 'TypeScript', group: 'Frontend' },
    { label: 'Node.js', value: 'Node.js', group: 'Backend', disabled: true },
    { label: 'Accessibility', value: 'Accessibility', group: 'Quality' },
  ];
}

@Component({
  imports: [AerisAutoComplete],
  template: `
    <aeris-auto-complete
      ariaLabel="Forced skill"
      [(value)]="value"
      [suggestions]="options"
      forceSelection
    />
  `,
})
class AutoCompleteForceHost {
  readonly value = signal('');
  readonly options: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular' },
    { label: 'TypeScript', value: 'TypeScript' },
  ];
}

@Component({
  imports: [AerisAutoComplete, ReactiveFormsModule],
  template: `<aeris-auto-complete [formControl]="control" [suggestions]="options" />`,
})
class AutoCompleteFormsHost {
  readonly control = new FormControl('Angular');
  readonly options: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular' },
    { label: 'Vue', value: 'Vue' },
  ];
}

describe('AerisAutoComplete', () => {
  it('exposes combobox relationships and form semantics', async () => {
    const fixture = TestBed.createComponent(AutoCompleteHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;
    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('skill-error');
    expect(hiddenInput.name).toBe('skill');
    expect(hiddenInput.value).toBe('Angular');
  });

  it('filters suggestions from text input', async () => {
    const fixture = TestBed.createComponent(AutoCompleteHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;
    input.value = 'type';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(options.length).toBe(1);
    expect(options[0]?.textContent).toContain('TypeScript');
  });

  it('navigates enabled suggestions and selects through the keyboard', async () => {
    const fixture = TestBed.createComponent(AutoCompleteHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('TypeScript');
    expect(fixture.componentInstance.lastSelection()?.option.value).toBe('TypeScript');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('skips disabled suggestions and supports boundary keys', async () => {
    const fixture = TestBed.createComponent(AutoCompleteHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();

    expect(input.getAttribute('aria-activedescendant')).toContain('accessibility');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    expect(input.getAttribute('aria-activedescendant')).toContain('angular');
  });

  it('clears the value and restores focus', async () => {
    const fixture = TestBed.createComponent(AutoCompleteHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#skill') as HTMLInputElement;
    const clear = fixture.nativeElement.querySelector(
      '.aeris-auto-complete__clear',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.value()).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('applies force selection on blur', async () => {
    const fixture = TestBed.createComponent(AutoCompleteForceHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Unknown';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('');

    input.value = 'angular';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('Angular');
  });

  it('works with Reactive Forms', async () => {
    const fixture = TestBed.createComponent(AutoCompleteFormsHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Vue';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('Vue');
  });
});
