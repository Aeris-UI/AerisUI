import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type AerisSelectOption } from '../../../select/aeris-select';
import {
  AerisMultiSelect,
  AerisMultiSelectComponent,
  type AerisMultiSelectChangeEvent,
} from '../../../multi-select/aeris-multi-select';

@Component({
  imports: [AerisMultiSelect],
  template: `
    <label for="skills">Skills</label>
    <aeris-multi-select
      #multi
      inputId="skills"
      name="skills"
      [options]="options"
      [(value)]="skills"
      filter
      clearable
      required
      invalid
      ariaDescribedby="skills-help"
      (changed)="lastChange.set($event)"
    />
  `,
})
class MultiSelectTestHost {
  readonly multi = viewChild.required<AerisMultiSelectComponent>('multi');
  readonly skills = signal<readonly string[]>(['design']);
  readonly lastChange = signal<AerisMultiSelectChangeEvent | null>(null);
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Design', value: 'design', group: 'Product' },
    { label: 'Quality', value: 'quality', disabled: true, group: 'Engineering' },
    { label: 'Engineering', value: 'engineering', group: 'Engineering' },
    { label: 'Research', value: 'research', group: 'Product' },
  ];
}

describe('AerisMultiSelect', () => {
  it('exposes combobox, multiselect listbox, and native form semantics', async () => {
    const fixture = TestBed.createComponent(MultiSelectTestHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('#skills') as HTMLElement;
    const hidden = fixture.nativeElement.querySelector('input[type=hidden]') as HTMLInputElement;
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(hidden.value).toBe('design');
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=listbox]').getAttribute('aria-multiselectable')).toBe('true');
  });

  it('keeps the panel open while toggling options with the keyboard', async () => {
    const fixture = TestBed.createComponent(MultiSelectTestHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('#skills') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.skills()).toEqual(['design', 'engineering']);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.lastChange()?.selected).toBe(true);
  });

  it('filters, selects all enabled results, and clears values', async () => {
    const fixture = TestBed.createComponent(MultiSelectTestHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('#skills') as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    await Promise.resolve();
    const filter = fixture.nativeElement.querySelector('.aeris-multi-select__filter') as HTMLInputElement;
    filter.value = 'research';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.aeris-multi-select__select-all') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.skills()).toEqual(['design', 'research']);
    fixture.componentInstance.multi().clear();
    expect(fixture.componentInstance.skills()).toEqual([]);
  });

  it('enforces selection limits without preventing removal', async () => {
    const fixture = TestBed.createComponent(AerisMultiSelectComponent);
    fixture.componentRef.setInput('options', [
      { label: 'One', value: 'one' },
      { label: 'Two', value: 'two' },
      { label: 'Three', value: 'three' },
    ]);
    fixture.componentRef.setInput('selectionLimit', 2);
    fixture.componentRef.setInput('value', ['one', 'two']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.openPanel();
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll('[role=option]') as NodeListOf<HTMLElement>;
    expect(options.item(2).getAttribute('aria-disabled')).toBe('true');
    options.item(0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['two']);
  });

  it('removes the last chip with Backspace or Delete', async () => {
    const fixture = TestBed.createComponent(AerisMultiSelectComponent);
    fixture.componentRef.setInput('options', [
      { label: 'One', value: 'one' },
      { label: 'Two', value: 'two' },
    ]);
    fixture.componentRef.setInput('display', 'chips');
    fixture.componentRef.setInput('value', ['one', 'two']);
    fixture.detectChanges();
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('[role=combobox]') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['one']);
  });
});
