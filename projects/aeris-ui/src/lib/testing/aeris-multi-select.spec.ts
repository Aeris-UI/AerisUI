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
      ariaDescribedBy="skills-help"
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

@Component({
  imports: [AerisMultiSelect],
  template: `
    <aeris-multi-select
      [options]="options"
      [(value)]="value"
      display="chips"
      ariaLabel="Chip skills"
      [disabled]="disabled()"
    >
      <ng-template aerisMultiSelectChip let-option let-remove="remove">
        <button type="button" (click)="remove()">Discard {{ option.label }}</button>
      </ng-template>
    </aeris-multi-select>
  `,
})
class CustomChipHost {
  readonly options = [{ label: 'Design', value: 'design' }];
  readonly value = signal<readonly string[]>(['design']);
  readonly disabled = signal(false);
}

describe('AerisMultiSelect', () => {
  it('keeps custom chip removal callbacks disabled with their parent control', async () => {
    const fixture = TestBed.createComponent(CustomChipHost);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    const customRemove = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    customRemove.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual(['design']);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    customRemove.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('removes a default chip once without opening its dropdown', async () => {
    const fixture = TestBed.createComponent(AerisMultiSelectComponent);
    fixture.componentRef.setInput('options', [{ label: 'Design', value: 'design' }]);
    fixture.componentRef.setInput('value', ['design']);
    fixture.componentRef.setInput('display', 'chips');
    await fixture.whenStable();
    let changes = 0;
    fixture.componentInstance.changed.subscribe(() => changes++);
    fixture.nativeElement.querySelector('.aeris-multi-select__chip-remove').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual([]);
    expect(changes).toBe(1);
    expect(fixture.nativeElement.querySelector('[role=listbox]')).toBeNull();
  });

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
    expect(fixture.nativeElement.querySelector('.aeris-multi-select__dismiss')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[role=listbox]').getAttribute('aria-multiselectable'),
    ).toBe('true');
  });

  it('toggles a touch-selected option while keeping the panel open', async () => {
    const fixture = TestBed.createComponent(MultiSelectTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#skills') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const option = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('[role=option]'),
    ).find((element) => element.textContent?.includes('Engineering')) as HTMLElement;
    const pointerdown = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerType: 'touch',
    });
    option.dispatchEvent(pointerdown);
    const filter = fixture.nativeElement.querySelector(
      '.aeris-multi-select__filter',
    ) as HTMLInputElement;
    filter.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: fixture.nativeElement }),
    );
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    option.click();
    fixture.detectChanges();

    expect(pointerdown.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.skills()).toEqual(['design', 'engineering']);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps a body-mounted panel open across repeated touch selections and dismisses outside', async () => {
    const fixture = TestBed.createComponent(AerisMultiSelectComponent);
    fixture.componentRef.setInput('options', [
      { label: 'Design', value: 'design' },
      { label: 'Research', value: 'research' },
    ]);
    fixture.componentRef.setInput('appendTo', 'body');
    fixture.componentRef.setInput('filter', true);
    await fixture.whenStable();
    fixture.componentInstance.openPanel();
    await fixture.whenStable();

    const panel = document.body.querySelector('.aeris-multi-select__panel') as HTMLElement;
    const filter = panel.querySelector('input') as HTMLInputElement;
    for (const option of panel.querySelectorAll<HTMLElement>('[role=option]')) {
      option.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
      );
      filter.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      fixture.detectChanges();
      expect(document.body.contains(option)).toBe(true);
      option.click();
      await fixture.whenStable();
      expect(document.body.contains(panel)).toBe(true);
    }
    expect(fixture.componentInstance.value()).toEqual(['design', 'research']);
    document.body.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
    );
    await fixture.whenStable();
    expect(document.body.contains(panel)).toBe(false);
  });

  it('still dismisses on focus moving outside and honors closeOnSelect', async () => {
    const fixture = TestBed.createComponent(MultiSelectTestHost);
    await fixture.whenStable();
    const multi = fixture.componentInstance.multi();
    multi.openPanel();
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('#skills') as HTMLElement;
    trigger.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
    );
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const componentFixture = TestBed.createComponent(AerisMultiSelectComponent);
    componentFixture.componentRef.setInput('options', [{ label: 'Design', value: 'design' }]);
    componentFixture.componentRef.setInput('closeOnSelect', true);
    await componentFixture.whenStable();
    componentFixture.componentInstance.openPanel();
    await componentFixture.whenStable();
    const option = componentFixture.nativeElement.querySelector('[role=option]') as HTMLElement;
    option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
    option.click();
    await componentFixture.whenStable();
    expect(componentFixture.componentInstance.value()).toEqual(['design']);
    expect(componentFixture.nativeElement.querySelector('[role=listbox]')).toBeNull();
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
    const filter = fixture.nativeElement.querySelector(
      '.aeris-multi-select__filter',
    ) as HTMLInputElement;
    filter.value = 'research';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.aeris-multi-select__select-all') as HTMLButtonElement
    ).click();
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
    const options = fixture.nativeElement.querySelectorAll(
      '[role=option]',
    ) as NodeListOf<HTMLElement>;
    expect(options.item(2).getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(options.item(0)).borderRadius).toContain('--aeris-radius-item');
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
