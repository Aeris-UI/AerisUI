import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AERIS_OVERLAY_APPEND_TO } from '@aeris-ui/core';

import {
  AerisSelect,
  type AerisSelectChangeEvent,
  type AerisSelectLazyLoadEvent,
  type AerisSelectOption,
} from '../../../select/aeris-select';

@Component({
  imports: [AerisSelect],
  template: `
    <label for="role">Role</label>
    <aeris-select
      inputId="role"
      name="role"
      [options]="options"
      [(value)]="role"
      filter
      clearable
      required
      invalid
      ariaDescribedby="role-error"
      (changed)="lastChange.set($event)"
    />
  `,
})
class SelectTestHost {
  readonly role = signal<string | null>('designer');
  readonly lastChange = signal<AerisSelectChangeEvent | null>(null);
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer', group: 'Product' },
    { label: 'Quality engineer', value: 'quality', disabled: true, group: 'Engineering' },
    { label: 'Software engineer', value: 'engineer', group: 'Engineering' },
    { label: 'Product manager', value: 'manager', group: 'Product' },
  ];
}

@Component({
  imports: [AerisSelect],
  template: `
    <aeris-select
      inputId="editable"
      ariaLabel="Editable role"
      [options]="options"
      [(value)]="customValue"
      editable
    />
    <aeris-select
      inputId="virtual"
      ariaLabel="Virtual list"
      [options]="largeOptions"
      virtualScroll
      lazy
      [virtualItemSize]="40"
      (lazyLoad)="lastLazyLoad.set($event)"
    />
  `,
})
class SelectAdvancedTestHost {
  readonly customValue = signal<string | null>('Custom role');
  readonly lastLazyLoad = signal<AerisSelectLazyLoadEvent | null>(null);
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
  ];
  readonly largeOptions: readonly AerisSelectOption[] = Array.from({ length: 500 }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: `option-${index + 1}`,
  }));
}

@Component({
  imports: [AerisSelect],
  template: `
    <aeris-select inputId="typeahead" ariaLabel="Role" [options]="options" [(value)]="role" />
  `,
})
class SelectTypeaheadTestHost {
  readonly role = signal<string | null>('designer');
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Software engineer', value: 'engineer' },
  ];
}

@Component({
  imports: [AerisSelect],
  template: `
    <div #overlayTarget id="select-overlay-target"></div>
    <aeris-select
      inputId="body-select"
      ariaLabel="Body mounted select"
      [options]="options"
      [(value)]="bodyValue"
      appendTo="body"
    />
    <aeris-select
      inputId="target-select"
      ariaLabel="Target mounted select"
      [options]="options"
      [(value)]="targetValue"
      [appendTo]="overlayTarget"
    />
  `,
})
class SelectAppendToTestHost {
  readonly bodyValue = signal<string | null>(null);
  readonly targetValue = signal<string | null>(null);
  readonly options: readonly AerisSelectOption[] = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
  ];
}

describe('AerisSelect', () => {
  afterEach(() => {
    document.querySelectorAll('[data-aeris-append-to]').forEach((element) => element.remove());
  });

  it('exposes combobox relationships and form semantics', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe('role-error');
    expect(hiddenInput.name).toBe('role');
    expect(hiddenInput.value).toBe('designer');
  });

  it('navigates enabled options and selects through the keyboard', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    const activeId = trigger.getAttribute('aria-activedescendant');
    const activeOption = fixture.nativeElement.querySelector(`#${activeId}`) as HTMLElement;
    expect(activeOption.textContent).toContain('Software engineer');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.role()).toBe('engineer');
    expect(fixture.componentInstance.lastChange()?.option.value).toBe('engineer');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the options panel after pointer selection', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const option = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('[role="option"]'),
    ).find((element) => element.textContent?.includes('Product manager'));
    option?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.role()).toBe('manager');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();
  });

  it('supports reverse navigation, boundaries, and Tab dismissal', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-activedescendant')).toContain('option-3');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-activedescendant')).toContain('option-0');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports typeahead when filtering and editable mode are disabled', async () => {
    const fixture = TestBed.createComponent(SelectTypeaheadTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#typeahead') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.role()).toBe('engineer');
  });

  it('filters options and reports an empty result', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await Promise.resolve();

    const filter = fixture.nativeElement.querySelector('.aeris-select__filter') as HTMLInputElement;
    filter.value = 'manager';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '[role="option"]',
    ) as NodeListOf<HTMLElement>;
    expect(options.length).toBe(1);
    expect(options[0]?.textContent).toContain('Product manager');
    expect(getComputedStyle(options.item(0)).borderRadius).toContain('--aeris-radius-item');

    filter.value = 'no result';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No matching options');
  });

  it('clears the value and restores combobox focus', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const clear = fixture.nativeElement.querySelector('.aeris-select__clear') as HTMLButtonElement;
    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.role()).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(fixture.nativeElement.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('closes on Escape without changing the value', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#role') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const filter = fixture.nativeElement.querySelector('.aeris-select__filter') as HTMLInputElement;
    filter.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await Promise.resolve();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.role()).toBe('designer');
    expect(document.activeElement).toBe(trigger);
  });

  it('supports editable values outside the option list', async () => {
    const fixture = TestBed.createComponent(SelectAdvancedTestHost);
    await fixture.whenStable();

    const editable = fixture.nativeElement.querySelector('#editable') as HTMLInputElement;
    expect(editable.value).toBe('Custom role');

    editable.value = 'Research specialist';
    editable.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.customValue()).toBe('Research specialist');
    expect(editable.getAttribute('role')).toBe('combobox');
  });

  it('virtualizes large lists and emits lazy viewport ranges', async () => {
    const fixture = TestBed.createComponent(SelectAdvancedTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#virtual') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const virtualSelect = fixture.nativeElement.querySelectorAll('aeris-select')[1] as HTMLElement;
    const rendered = virtualSelect.querySelectorAll('[role="option"]');
    expect(rendered.length).toBeLessThan(500);
    expect(fixture.componentInstance.lastLazyLoad()?.first).toBe(0);

    const list = virtualSelect.querySelector('[role="listbox"]') as HTMLElement;
    Object.defineProperty(list, 'scrollTop', { value: 800, configurable: true });
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.componentInstance.lastLazyLoad()?.first).toBeGreaterThan(0);
  });

  it('mounts, restores, and reopens its panel when appendTo is body', async () => {
    const fixture = TestBed.createComponent(SelectAppendToTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#body-select') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    let panel = document.body.querySelector(
      '.aeris-select__panel[data-aeris-append-to="body"]',
    ) as HTMLElement;
    expect(panel).toBeTruthy();
    expect(fixture.nativeElement.contains(panel)).toBe(false);

    (panel.querySelectorAll('[role="option"]')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.bodyValue()).toBe('engineer');
    expect(document.body.querySelector('.aeris-select__panel[data-aeris-append-to]')).toBeNull();

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    panel = document.body.querySelector(
      '.aeris-select__panel[data-aeris-append-to="body"]',
    ) as HTMLElement;
    expect(panel).toBeTruthy();
  });

  it('mounts its panel into an HTMLElement target', async () => {
    const fixture = TestBed.createComponent(SelectAppendToTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#target-select') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('#select-overlay-target') as HTMLElement;
    const panel = target.querySelector('.aeris-select__panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('data-aeris-append-to')).toBe('target');
  });

  it('uses the configured global overlay append target when appendTo is omitted', async () => {
    TestBed.overrideProvider(AERIS_OVERLAY_APPEND_TO, { useValue: 'body' });
    const fixture = TestBed.createComponent(SelectTestHost);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('#role') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      document.body.querySelector('.aeris-select__panel[data-aeris-append-to="body"]'),
    ).toBeTruthy();
  });
});
