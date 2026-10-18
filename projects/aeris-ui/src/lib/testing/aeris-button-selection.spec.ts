import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { AerisButtonForms } from '@aeris-ui/core/button/forms';
import {
  AerisButtonGroup,
  AerisButtonGroupComponent,
  type AerisButtonGroupValue,
} from '@aeris-ui/core/button-group';

@Component({
  imports: [AerisButtonForms, AerisButtonGroup, ReactiveFormsModule, FormField],
  template: `
    <button aerisButton>Action</button>
    <button
      aerisButton
      aerisButtonToggle
      [(checked)]="checked"
      [loading]="loading()"
      [invalid]="invalid()"
      [touched]="touched()"
    >
      Bold
    </button>
    <button aerisButton aerisButtonToggle [formControl]="toggleControl">Reactive toggle</button>
    <button aerisButton aerisButtonToggle [formField]="fields.enabled">Signal toggle</button>
    <aeris-button-group
      ariaLabel="Choices"
      [selectionMode]="mode()"
      [(value)]="selection"
      [disabled]="disabled()"
      [required]="required()"
      [allowEmpty]="allowEmpty()"
      [orientation]="orientation()"
      [invalid]="invalid()"
      [touched]="touched()"
    >
      @for (key of keys(); track key) {
        <button aerisButton aerisButtonGroupItem [value]="key" [disabled]="key === 'b'">
          {{ key }}
        </button>
      }
    </aeris-button-group>
    <aeris-button-group
      ariaLabel="Signal choices"
      selectionMode="single"
      [formField]="fields.choice"
    >
      <button aerisButton aerisButtonGroupItem value="one">One</button>
      <button aerisButton aerisButtonGroupItem value="two">Two</button>
    </aeris-button-group>
    <aeris-button-group
      ariaLabel="Reactive choices"
      selectionMode="multiple"
      [formControl]="groupControl"
    >
      <button aerisButton aerisButtonGroupItem value="one">First</button>
      <button aerisButton aerisButtonGroupItem value="two">Second</button>
    </aeris-button-group>
    <aeris-button-group
      ariaLabel="Typed array choices"
      selectionMode="multiple"
      [formField]="typedFields.many"
    >
      <button aerisButton aerisButtonGroupItem value="one">Array one</button>
    </aeris-button-group>
    <aeris-button-group
      ariaLabel="Typed string choice"
      selectionMode="single"
      [formField]="typedFields.single"
    >
      <button aerisButton aerisButtonGroupItem value="one">String one</button>
    </aeris-button-group>
    <button>After</button>
  `,
})
class Host {
  readonly checked = signal(false);
  readonly loading = signal(false);
  readonly selection = signal<AerisButtonGroupValue>('a');
  readonly mode = signal<'none' | 'single' | 'multiple'>('single');
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly disabled = signal(false);
  readonly required = signal(false);
  readonly allowEmpty = signal(false);
  readonly invalid = signal(false);
  readonly touched = signal<boolean | null>(null);
  readonly keys = signal(['a', 'b', 'c']);
  readonly toggleControl = new FormControl(false, { nonNullable: true });
  readonly groupControl = new FormControl<AerisButtonGroupValue>([]);
  readonly data = signal<{ enabled: boolean; choice: AerisButtonGroupValue }>({
    enabled: false,
    choice: null,
  });
  readonly fields = form(this.data, (schema) => required(schema.choice));
  readonly typedData = signal<{ many: string[]; single: string }>({ many: [], single: '' });
  readonly typedFields = form(this.typedData);
}

@Component({
  imports: [AerisButtonForms, AerisButtonGroup, FormsModule],
  template: `
    <button aerisButton aerisButtonToggle [(ngModel)]="enabled">Toggle</button>
    <aeris-button-group selectionMode="single" ariaLabel="ngModel choices" [(ngModel)]="choice">
      <button aerisButton aerisButtonGroupItem value="one">One</button>
      <button aerisButton aerisButtonGroupItem value="two">Two</button>
    </aeris-button-group>
  `,
})
class NgModelHost {
  readonly enabled = signal(false);
  readonly choice = signal<AerisButtonGroupValue>('one');
}

describe('Button selection', () => {
  it('supports ngModel without changing the parent on initial value writes', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.enabled()).toBe(false);
    expect(fixture.componentInstance.choice()).toBe('one');
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.enabled()).toBe(true);
    expect(fixture.componentInstance.choice()).toBe('two');
    fixture.componentInstance.enabled.set(false);
    fixture.componentInstance.choice.set('one');
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-checked')).toBe('true');
  });
  it('accepts specific Signal Forms string/array models without widening consumer data', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('[aria-label="Typed array choices"] button').click();
    fixture.nativeElement.querySelector('[aria-label="Typed string choice"] button').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.typedData()).toEqual({ many: ['one'], single: 'one' });
  });
  const setup = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const group = fixture.nativeElement.querySelector('aeris-button-group') as HTMLElement;
    const items = () => Array.from(group.querySelectorAll('button'));
    return { fixture, host: fixture.componentInstance, buttons, group, items };
  };

  it('leaves action buttons unchanged and toggles a controlled pressed state', async () => {
    const { fixture, host, buttons } = await setup();
    expect(buttons[0].hasAttribute('aria-pressed')).toBe(false);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    buttons[1].click();
    await fixture.whenStable();
    expect(host.checked()).toBe(true);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    buttons[1].click();
    await fixture.whenStable();
    expect(host.checked()).toBe(false);
  });

  it('does not activate loading toggles', async () => {
    const { fixture, host, buttons } = await setup();
    host.loading.set(true);
    await fixture.whenStable();
    expect(buttons[1].disabled).toBe(true);
    buttons[1].click();
    expect(host.checked()).toBe(false);
  });

  it('keeps explicit manual invalid immediate unless an untouched state is supplied', async () => {
    const { fixture, host, buttons } = await setup();
    host.invalid.set(true);
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-invalid')).toBe('true');
    host.touched.set(false);
    await fixture.whenStable();
    expect(buttons[1].hasAttribute('aria-invalid')).toBe(false);
    host.touched.set(true);
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-invalid')).toBe('true');
    host.invalid.set(false);
    await fixture.whenStable();
    expect(buttons[1].hasAttribute('aria-invalid')).toBe(false);
  });

  it('supports Reactive Forms, touch and disabled propagation for toggles', async () => {
    const { fixture, host, buttons } = await setup();
    buttons[2].click();
    await fixture.whenStable();
    expect(host.toggleControl.value).toBe(true);
    buttons[2].dispatchEvent(new FocusEvent('blur'));
    expect(host.toggleControl.touched).toBe(true);
    host.toggleControl.disable();
    await fixture.whenStable();
    expect(buttons[2].disabled).toBe(true);
    host.toggleControl.enable();
    host.toggleControl.setValue(false);
    await fixture.whenStable();
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('discovers the Signal Forms checked model automatically', async () => {
    const { fixture, host, buttons } = await setup();
    buttons[3].click();
    await fixture.whenStable();
    expect(host.data().enabled).toBe(true);
    buttons[3].dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(host.fields.enabled().touched()).toBe(true);
  });

  it('uses radio semantics and one tab stop for single selection', async () => {
    const { group, items } = await setup();
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(items().map((item) => item.getAttribute('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(items().map((item) => item.tabIndex)).toEqual([0, -1, -1]);
    expect(items()[1].disabled).toBe(true);
    expect(items()[0].hasAttribute('aria-pressed')).toBe(false);
  });

  it('updates radio entry after an external value change and exposes focus for forms', async () => {
    const { fixture, host, items } = await setup();
    items()[0].focus();
    host.selection.set('c');
    await fixture.whenStable();
    expect(items().map((item) => item.tabIndex)).toEqual([-1, -1, 0]);
    const controller = fixture.debugElement.query(By.directive(AerisButtonGroupComponent))
      .componentInstance as AerisButtonGroupComponent;
    controller.focus();
    expect(document.activeElement).toBe(items()[2]);
    host.disabled.set(true);
    await fixture.whenStable();
    const focus = vi.spyOn(items()[0], 'focus');
    controller.focus();
    expect(focus).not.toHaveBeenCalled();
  });

  it('moves focus/selection with arrows, skips disabled items and wraps', async () => {
    const { fixture, host, items } = await setup();
    items()[0].focus();
    items()[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(host.selection()).toBe('c');
    expect(document.activeElement).toBe(items()[2]);
    items()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fixture.whenStable();
    expect(host.selection()).toBe('a');
    items()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(host.selection()).toBe('c');
  });

  it('uses vertical navigation and repairs the tab stop when an active item is removed', async () => {
    const { fixture, host, items } = await setup();
    host.orientation.set('vertical');
    await fixture.whenStable();
    items()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(host.selection()).toBe('c');
    host.keys.set(['a', 'b']);
    await fixture.whenStable();
    expect(items()[0].tabIndex).toBe(0);
  });

  it('keeps a radio selected by default and permits explicit optional clearing', async () => {
    const { fixture, host, items } = await setup();
    items()[0].click();
    await fixture.whenStable();
    expect(host.selection()).toBe('a');
    host.allowEmpty.set(true);
    await fixture.whenStable();
    items()[0].click();
    await fixture.whenStable();
    expect(host.selection()).toBeNull();
    items()[2].click();
    host.required.set(true);
    await fixture.whenStable();
    items()[2].click();
    await fixture.whenStable();
    expect(host.selection()).toBe('c');
  });

  it('uses pressed semantics for multiple choices and separates navigation from selection', async () => {
    const { fixture, host, group, items } = await setup();
    host.mode.set('multiple');
    host.selection.set([]);
    await fixture.whenStable();
    expect(group.getAttribute('role')).toBe('group');
    items()[0].click();
    items()[2].click();
    await fixture.whenStable();
    expect(host.selection()).toEqual(['a', 'c']);
    expect(items()[0].getAttribute('aria-pressed')).toBe('true');
    expect(items()[0].hasAttribute('aria-checked')).toBe(false);
    items()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fixture.whenStable();
    expect(host.selection()).toEqual(['a', 'c']);
    items()[0].click();
    await fixture.whenStable();
    expect(host.selection()).toEqual(['c']);
    host.required.set(true);
    await fixture.whenStable();
    items()[2].click();
    expect(host.selection()).toEqual(['c']);
  });

  it('propagates group disabled and validation state without marking pristine fields invalid', async () => {
    const { fixture, host, group, items } = await setup();
    host.invalid.set(true);
    host.touched.set(false);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    expect(items().every((item) => item.disabled)).toBe(true);
    host.touched.set(true);
    host.disabled.set(false);
    await fixture.whenStable();
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(items()[0].disabled).toBe(false);
    expect(items()[1].disabled).toBe(true);
  });

  it('supports group Reactive Forms and marks touched only on group exit', async () => {
    const { fixture, host } = await setup();
    const group = fixture.nativeElement.querySelector(
      '[aria-label="Reactive choices"]',
    ) as HTMLElement;
    const items = group.querySelectorAll('button');
    items[0].click();
    await fixture.whenStable();
    expect(host.groupControl.value).toEqual(['one']);
    items[0].dispatchEvent(new FocusEvent('focusout', { relatedTarget: items[1], bubbles: true }));
    expect(host.groupControl.touched).toBe(false);
    items[1].dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(host.groupControl.touched).toBe(true);
    host.groupControl.disable();
    await fixture.whenStable();
    expect(items[1].disabled).toBe(true);
  });

  it('receives Signal Forms invalid/touched state and updates its model', async () => {
    const { fixture, host } = await setup();
    const group = fixture.nativeElement.querySelector(
      '[aria-label="Signal choices"]',
    ) as HTMLElement;
    expect(host.fields.choice().invalid()).toBe(true);
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    group.querySelector('button')?.click();
    await fixture.whenStable();
    expect(host.data().choice).toBe('one');
    expect(host.fields.choice().invalid()).toBe(false);
  });

  it('does not add radio/toggle semantics to an action-only group', async () => {
    const { fixture, host, group, items } = await setup();
    host.mode.set('none');
    await fixture.whenStable();
    expect(group.getAttribute('role')).toBe('group');
    for (const item of items()) {
      expect(item.hasAttribute('aria-checked')).toBe(false);
      expect(item.hasAttribute('aria-pressed')).toBe(false);
      expect(item.hasAttribute('tabindex')).toBe(false);
    }
  });
});
