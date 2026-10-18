import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import {
  AerisListbox,
  AerisListboxComponent,
  type AerisListboxOption,
  type AerisListboxValue,
  type AerisListboxChangeEvent,
} from '@aeris-ui/core/listbox';

@Component({
  imports: [AerisListbox],
  template: `<aeris-listbox
    ariaLabel="Choices"
    [options]="options()"
    [(value)]="value"
    [selectionMode]="mode()"
    [disabled]="disabled()"
    [loading]="loading()"
    [invalid]="invalid()"
    [touched]="touched()"
    [filter]="filter()"
    [(query)]="query"
    (changed)="changes.push($event)"
    (touch)="touches = touches + 1"
  />`,
})
class Host {
  readonly options = signal<readonly AerisListboxOption[]>([
    { value: 'a', label: 'Alpha', description: 'First choice' },
    { value: 'b', label: 'Beta', disabled: true },
    { value: 'c', label: 'Charlie' },
    { value: 'd', label: 'Delta' },
  ]);
  readonly value = signal<AerisListboxValue>(null);
  readonly mode = signal<'single' | 'multiple'>('single');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly invalid = signal(false);
  readonly touched = signal<boolean | null>(null);
  readonly filter = signal(false);
  readonly query = signal('');
  readonly changes: AerisListboxChangeEvent[] = [];
  touches = 0;
}
@Component({
  imports: [AerisListbox, ReactiveFormsModule, FormsModule, FormField],
  template: `
    <aeris-listbox ariaLabel="Signal choice" [options]="options" [formField]="fields.choice" />
    <aeris-listbox
      ariaLabel="Signal array"
      selectionMode="multiple"
      [options]="options"
      [formField]="fields.many"
    />
    <aeris-listbox
      ariaLabel="Reactive choice"
      selectionMode="multiple"
      [options]="options"
      [formControl]="control"
    />
    <aeris-listbox ariaLabel="Template choice" [options]="options" [(ngModel)]="templateValue" />
  `,
})
class FormsHost {
  readonly options: readonly AerisListboxOption[] = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];
  readonly data = signal<{ choice: string; many: string[] }>({ choice: '', many: [] });
  readonly fields = form(this.data, (schema) => required(schema.choice));
  readonly control = new FormControl<AerisListboxValue>(['b']);
  templateValue: AerisListboxValue = 'a';
}
@Component({
  imports: [AerisListbox],
  template: `<aeris-listbox
    ariaLabel="Templates"
    [options]="options()"
    [loading]="loading()"
    [value]="'a'"
  >
    <ng-template aerisListboxOption let-option let-selected="selected" let-active="active"
      ><strong>{{ option.label }} / {{ selected }} / {{ active }}</strong></ng-template
    >
    <ng-template aerisListboxGroup let-group
      ><b>Section {{ group }}</b></ng-template
    >
    <ng-template aerisListboxEmpty>Nothing found</ng-template>
    <ng-template aerisListboxLoading>Please wait</ng-template>
  </aeris-listbox>`,
})
class TemplatesHost {
  readonly options = signal<readonly AerisListboxOption[]>([
    { value: 'a', label: 'Alpha', group: 'One', description: 'Details' },
    { value: 'b', label: 'Beta', group: 'Two' },
  ]);
  readonly loading = signal(false);
}

describe('AerisListbox', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const list = root.querySelector<HTMLElement>('[role="listbox"]');
    if (!list) throw new Error('Missing listbox');
    const options = () => [...root.querySelectorAll<HTMLElement>('[role="option"]')];
    const key = async (key: string, init: KeyboardEventInit = {}) => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
      await fixture.whenStable();
    };
    const click = async (index: number, init: MouseEventInit = {}) => {
      options()[index]?.dispatchEvent(new MouseEvent('click', { bubbles: true, ...init }));
      await fixture.whenStable();
    };
    return { fixture, host: fixture.componentInstance, root, list, options, key, click };
  }
  it('renders labels, descriptions, disabled semantics and a valid active reference', async () => {
    const { root, list, options } = await setup();
    expect(list.getAttribute('aria-label')).toBe('Choices');
    expect(options()).toHaveLength(4);
    expect(options()[1]?.getAttribute('aria-disabled')).toBe('true');
    expect(
      root.querySelector(`#${list.getAttribute('aria-activedescendant')}`)?.textContent,
    ).toContain('Alpha');
    const describedBy = options()[0]?.getAttribute('aria-describedby');
    expect(root.querySelector(`#${describedBy}`)?.textContent).toBe('First choice');
  });
  it('distinguishes keyboard focus from selection and skips disabled options', async () => {
    const { host, list, options, key } = await setup();
    list.focus();
    await key('ArrowDown');
    expect(options()[2]?.id).toBe(list.getAttribute('aria-activedescendant'));
    expect(host.value()).toBeNull();
    expect(host.changes).toHaveLength(0);
    await key(' ');
    expect(host.value()).toBe('c');
    expect(options()[2]?.getAttribute('aria-selected')).toBe('true');
    expect(host.changes[0]?.options[0]?.label).toBe('Charlie');
    await key('End');
    await key('ArrowDown');
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[0]?.id);
    await key('Home');
    await key('ArrowUp');
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[3]?.id);
    await key('Enter');
    expect(host.value()).toBe('d');
  });
  it('supports modifier-free multiple selection without checkboxes or lost active focus', async () => {
    const { host, fixture, click, options, list } = await setup();
    host.mode.set('multiple');
    host.value.set([]);
    await fixture.whenStable();
    await click(0);
    await click(2);
    expect(host.value()).toEqual(['a', 'c']);
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[2]?.id);
    expect(list.getAttribute('aria-multiselectable')).toBe('true');
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]')).toBeNull();
    await click(0);
    expect(host.value()).toEqual(['c']);
    await click(1);
    expect(host.value()).toEqual(['c']);
  });
  it('selects ranges while skipping disabled options', async () => {
    const { host, fixture, click, key } = await setup();
    host.mode.set('multiple');
    host.value.set([]);
    await fixture.whenStable();
    await click(0);
    await key('End', { shiftKey: true });
    expect(host.value()).toEqual(['a', 'c', 'd']);
    await click(2, { shiftKey: true });
    expect(host.value()).toEqual(['a', 'c']);
  });
  it('filters descriptions and toggles all visible enabled options without dropping hidden values', async () => {
    const { host, fixture, root, key, options } = await setup();
    host.mode.set('multiple');
    host.value.set(['c']);
    host.filter.set(true);
    await fixture.whenStable();
    const input = root.querySelector<HTMLInputElement>('input');
    if (!input) throw new Error('Missing search');
    input.value = 'First choice';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.query()).toBe('First choice');
    expect(options()).toHaveLength(1);
    await key('a', { ctrlKey: true });
    expect(host.value()).toEqual(['c', 'a']);
    await key('a', { metaKey: true });
    expect(host.value()).toEqual(['c']);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(root.ownerDocument.activeElement?.getAttribute('role')).toBe('listbox');
  });
  it('supports typeahead, repeat cycling and IME/modifier guards', async () => {
    const { host, fixture, key, options, list } = await setup();
    host.options.set([
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Alpine' },
      { value: 'c', label: 'Charlie' },
    ]);
    await fixture.whenStable();
    await key('a');
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[1]?.id);
    await key('a');
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[0]?.id);
    await key('End', { isComposing: true });
    await key('End', { altKey: true });
    expect(list.getAttribute('aria-activedescendant')).toBe(options()[0]?.id);
    expect(host.value()).toBeNull();
  });
  it('recovers active references after filtering, removal and controlled updates without emitting changes', async () => {
    const { host, fixture, list, root } = await setup();
    host.value.set('c');
    await fixture.whenStable();
    expect(
      root.querySelector(`#${list.getAttribute('aria-activedescendant')}`)?.textContent,
    ).toContain('Charlie');
    host.options.set([{ value: 'd', label: 'Delta' }]);
    await fixture.whenStable();
    expect(host.value()).toBe('c');
    expect(
      root.querySelector(`#${list.getAttribute('aria-activedescendant')}`)?.textContent,
    ).toContain('Delta');
    host.options.set([]);
    await fixture.whenStable();
    expect(list.hasAttribute('aria-activedescendant')).toBe(false);
    expect(host.changes).toHaveLength(0);
  });
  it('blocks loading and disabled changes and exposes busy/disabled states', async () => {
    const { host, fixture, click, key, list, root } = await setup();
    host.loading.set(true);
    await fixture.whenStable();
    await click(0);
    await key('Enter');
    expect(host.value()).toBeNull();
    expect(list.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Loading');
    host.loading.set(false);
    host.disabled.set(true);
    await fixture.whenStable();
    await click(0);
    await key('Enter');
    expect(host.value()).toBeNull();
    expect(list.tabIndex).toBe(-1);
  });
  it('gates visible and semantic invalid state with nullable touched', async () => {
    const { host, fixture, list, root } = await setup();
    host.invalid.set(true);
    await fixture.whenStable();
    expect(list.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('aeris-listbox')?.hasAttribute('data-invalid')).toBe(true);
    host.touched.set(false);
    await fixture.whenStable();
    expect(list.hasAttribute('aria-invalid')).toBe(false);
    host.touched.set(true);
    await fixture.whenStable();
    expect(list.getAttribute('aria-invalid')).toBe('true');
  });
  it('marks touched only when focus leaves the complete control', async () => {
    const { host, fixture, root, list } = await setup();
    host.filter.set(true);
    await fixture.whenStable();
    root
      .querySelector('input')
      ?.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: list }));
    expect(host.touches).toBe(0);
    list.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(host.touches).toBe(1);
  });
  it('supports empty string keys and all-disabled collections', async () => {
    const { host, fixture, key, list } = await setup();
    host.options.set([
      { value: '', label: 'Empty key' },
      { value: 'x', label: 'Other' },
    ]);
    await fixture.whenStable();
    await key('End');
    await key('Home');
    await key('Enter');
    expect(host.value()).toBe('');
    host.options.set([{ value: 'x', label: 'Disabled', disabled: true }]);
    await fixture.whenStable();
    await key('End');
    expect(list.hasAttribute('aria-activedescendant')).toBe(false);
  });
  it('reveals an externally selected offscreen option when focus enters', async () => {
    const { host, fixture, list, options } = await setup();
    host.value.set('d');
    await fixture.whenStable();
    const option = options()[3];
    if (!option) throw new Error('Missing final option');
    Object.defineProperty(list, 'clientHeight', { value: 160 });
    Object.defineProperty(option, 'offsetTop', { value: 500 });
    Object.defineProperty(option, 'offsetHeight', { value: 40 });
    list.focus();
    expect(list.scrollTop).toBe(380);
  });
  it('renders typed option/group templates and custom loading/empty states', async () => {
    const fixture = TestBed.createComponent(TemplatesHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[role="group"]')?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(root.textContent).toContain('Section One');
    expect(root.textContent).toContain('Alpha / true / true');
    expect(root.querySelector('[role="option"]')?.getAttribute('aria-describedby')).toBeTruthy();
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Please wait');
    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.options.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Nothing found');
  });
  it('integrates Signal Forms value, touched and required validation without pristine errors', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    await fixture.whenStable();
    const lists = fixture.debugElement.queryAll(By.directive(AerisListboxComponent));
    const first = lists[0];
    if (!first) throw new Error('Missing form list');
    const list: HTMLElement = first.nativeElement.querySelector('[role="listbox"]');
    const field = fixture.componentInstance.fields.choice();
    expect(field.invalid()).toBe(true);
    expect(field.touched()).toBe(false);
    expect(list.hasAttribute('aria-invalid')).toBe(false);
    expect(list.getAttribute('aria-required')).toBe('true');
    list.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await fixture.whenStable();
    expect(field.touched()).toBe(true);
    expect(list.getAttribute('aria-invalid')).toBe('true');
    (first.nativeElement.querySelector('[role="option"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.data().choice).toBe('a');
    expect(list.hasAttribute('aria-invalid')).toBe(false);
    fixture.componentInstance.data.set({ choice: '', many: [] });
    field.markAsTouched();
    await fixture.whenStable();
    expect(list.getAttribute('aria-invalid')).toBe('true');
    (lists[1]?.nativeElement.querySelector('[role="option"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.data().many).toEqual(['a']);
  });
  it('synchronizes classic forms without emitting user events for programmatic writes', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    await fixture.whenStable();
    const lists = fixture.debugElement.queryAll(By.directive(AerisListboxComponent));
    const reactive = lists[2];
    if (!reactive) throw new Error('Missing reactive list');
    const control = fixture.componentInstance.control;
    expect(reactive.nativeElement.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
    (reactive.nativeElement.querySelector('[role="option"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(control.value).toEqual(['b', 'a']);
    control.disable();
    await fixture.whenStable();
    expect(reactive.nativeElement.querySelector('[role="listbox"]').tabIndex).toBe(-1);
    control.enable();
    control.setValue([]);
    await fixture.whenStable();
    expect(reactive.nativeElement.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
    reactive.nativeElement
      .querySelector('[role="listbox"]')
      .dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(control.touched).toBe(true);
    (lists[3]?.nativeElement.querySelectorAll('[role="option"]')[1] as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.templateValue).toBe('b');
  });
});
