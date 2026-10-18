import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, validate } from '@angular/forms/signals';
import {
  AerisChipModule,
  AerisChipGroupComponent,
  type AerisChipGroupItem,
  type AerisChipGroupValue,
  type AerisChipGroupRemovingEvent,
} from '@aeris-ui/core/chip';

const items: readonly AerisChipGroupItem[] = [
  { id: 'one', label: 'One' },
  { id: 'two', label: 'Two', disabled: true },
  { id: 'three', label: 'Three' },
  { id: 'four', label: 'Four' },
];

@Component({
  imports: [AerisChipModule, FormField, ReactiveFormsModule],
  template: `
    <aeris-chip-group
      ariaLabel="Signal choices"
      selectionMode="multiple"
      [items]="items"
      [formField]="fields.choices"
    />
    <aeris-chip-group
      ariaLabel="Reactive choices"
      selectionMode="single"
      [items]="items"
      [formControl]="control"
    />
  `,
})
class FormsHost {
  readonly items = items;
  readonly data = signal<{ choices: readonly string[] }>({ choices: [] });
  readonly fields = form(this.data, (schema) =>
    validate(schema.choices, ({ value }) => {
      const choices = value();
      return Array.isArray(choices) && choices.length > 0
        ? undefined
        : { kind: 'required', message: 'Choose a value.' };
    }),
  );
  readonly control = new FormControl<AerisChipGroupValue>('three');
}

describe('AerisChipGroup', () => {
  function setup(mode: 'none' | 'single' | 'multiple' = 'single') {
    const fixture = TestBed.createComponent(AerisChipGroupComponent);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('selectionMode', mode);
    fixture.componentRef.setInput('ariaLabel', 'Choices');
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const buttons = () => [
      ...root.querySelectorAll<HTMLButtonElement>('.aeris-chip-group__choice'),
    ];
    const key = (target: HTMLElement, value: string) => {
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };
    return { fixture, group: fixture.componentInstance, root, buttons, key };
  }

  it('uses native pressed choices without nested buttons and one entry stop', () => {
    const { root, buttons } = setup();
    expect(root.getAttribute('role')).toBe('toolbar');
    expect(root.getAttribute('aria-label')).toBe('Choices');
    expect(buttons().map((button) => button.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(buttons()[1].disabled).toBe(true);
    expect(root.querySelector('button button')).toBeNull();
  });

  it('toggles a single value without selecting during arrow navigation', () => {
    const { group, fixture, buttons, key } = setup();
    group.focus();
    key(buttons()[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[2]);
    expect(group.value()).toBeNull();
    buttons()[2].click();
    fixture.detectChanges();
    expect(group.value()).toBe('three');
    expect(buttons()[2].getAttribute('aria-pressed')).toBe('true');
    buttons()[2].click();
    fixture.detectChanges();
    expect(group.value()).toBeNull();
    key(buttons()[2], 'End');
    expect(document.activeElement).toBe(buttons()[3]);
    key(buttons()[3], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[0]);
  });

  it('toggles multiple values and retains unrelated controlled keys', () => {
    const { group, fixture, buttons } = setup('multiple');
    group.value.set(['missing']);
    buttons()[0].click();
    buttons()[2].click();
    fixture.detectChanges();
    expect(group.value()).toEqual(['missing', 'one', 'three']);
    buttons()[0].click();
    fixture.detectChanges();
    expect(group.value()).toEqual(['missing', 'three']);
    buttons()[1].click();
    expect(group.value()).toEqual(['missing', 'three']);
  });

  it('uses RTL and vertical navigation, skipping disabled members', () => {
    const { fixture, group, root, buttons, key } = setup();
    root.dir = 'rtl';
    group.focus();
    key(buttons()[0], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons()[2]);
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    key(buttons()[2], 'ArrowUp');
    expect(document.activeElement).toBe(buttons()[0]);
  });

  it('removes once, prunes selection and focuses next, previous, then the empty entry', () => {
    const { fixture, group, root, buttons, key } = setup('multiple');
    fixture.componentRef.setInput('removable', true);
    group.items.set(items.filter((item) => !item.disabled));
    group.value.set(['one', 'three']);
    fixture.detectChanges();
    const removed = vi.fn();
    group.removed.subscribe(removed);
    group.focus();
    key(buttons()[0], 'Delete');
    expect(group.items().map((item) => item.id)).toEqual(['three', 'four']);
    expect(group.value()).toEqual(['three']);
    expect(document.activeElement).toBe(buttons()[0]);
    key(buttons()[0], 'End');
    key(buttons()[1], 'Backspace');
    expect(document.activeElement).toBe(buttons()[0]);
    key(buttons()[0], 'Delete');
    expect(document.activeElement).toBe(root);
    expect(root.tabIndex).toBe(0);
    expect(removed).toHaveBeenCalledTimes(3);
  });

  it('cancellation retains items, selection and focus for keyboard removal', () => {
    const { fixture, group, buttons, key } = setup();
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    const request = vi.fn((event: AerisChipGroupRemovingEvent) => event.preventDefault());
    group.removing.subscribe(request);
    const removed = vi.fn();
    group.removed.subscribe(removed);
    group.focus();
    key(buttons()[0], 'Delete');
    expect(group.items()).toEqual(items);
    expect(document.activeElement).toBe(buttons()[0]);
    expect(request).toHaveBeenCalledTimes(1);
    expect(removed).not.toHaveBeenCalled();
  });

  it('roves native remove buttons in no-selection mode without introducing pressed state', () => {
    const { fixture, group, root, key } = setup('none');
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    expect(root.getAttribute('role')).toBe('group');
    expect(root.querySelector('[aria-pressed]')).toBeNull();
    group.focus();
    const remove = [...root.querySelectorAll<HTMLButtonElement>('.aeris-chip__remove')];
    expect(document.activeElement).toBe(remove[0]);
    expect(remove.map((button) => button.tabIndex)).toEqual([0, -1, -1, -1]);
    key(remove[0], 'ArrowRight');
    expect(document.activeElement).toBe(remove[2]);
    key(remove[2], 'Delete');
    expect(group.items()).toHaveLength(3);
    expect(group.value()).toBeNull();
  });

  it('repairs focus after external removal/disable but never after leaving the group', () => {
    const { fixture, group, buttons } = setup();
    group.focus();
    group.items.set(items.slice(1));
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons()[1]);
    group.items.update((current) =>
      current.map((item) => (item.id === 'three' ? { ...item, disabled: true } : item)),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons()[2]);
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    try {
      outside.focus();
      group.items.set([items[3]]);
      fixture.detectChanges();
      expect(document.activeElement).toBe(outside);
    } finally {
      outside.remove();
    }
  });

  it('supports explicit invalid/touched and disables every action', () => {
    const { fixture, group, root, buttons } = setup();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(root.getAttribute('aria-invalid')).toBe('true');
    fixture.componentRef.setInput('touched', false);
    fixture.detectChanges();
    expect(root.hasAttribute('aria-invalid')).toBe(false);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    group.focus();
    expect(buttons().every((button) => button.disabled)).toBe(true);
    expect(root.hasAttribute('tabindex')).toBe(false);
    buttons()[0].click();
    expect(group.value()).toBeNull();
  });

  it('integrates Signal Forms validation and classic form values/disabled state', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    const hosts = fixture.debugElement.queryAll(By.directive(AerisChipGroupComponent));
    const signalGroup = hosts[0].nativeElement as HTMLElement;
    expect(fixture.componentInstance.fields.choices().invalid()).toBe(true);
    expect(signalGroup.hasAttribute('aria-invalid')).toBe(false);
    fixture.componentInstance.fields.choices().markAsTouched();
    fixture.detectChanges();
    expect(signalGroup.getAttribute('aria-invalid')).toBe('true');
    signalGroup.querySelector<HTMLButtonElement>('.aeris-chip-group__choice')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.data().choices).toEqual(['one']);
    expect(signalGroup.hasAttribute('aria-invalid')).toBe(false);
    const classic = hosts[1].componentInstance as AerisChipGroupComponent;
    expect(classic.value()).toBe('three');
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect((hosts[1].nativeElement as HTMLElement).getAttribute('aria-disabled')).toBe('true');
  });
});
