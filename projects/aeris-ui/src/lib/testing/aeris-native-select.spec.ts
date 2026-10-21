import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisNativeSelect, type AerisNativeSelectSize } from '@aeris-ui/core/select/native';

@Component({
  imports: [AerisNativeSelect],
  template: `<form>
    <label for="native-region">Region</label>
    <select
      id="native-region"
      name="region"
      aerisNativeSelect
      [controlSize]="size()"
      [invalid]="invalid()"
      [touched]="touched()"
      [disabled]="disabled()"
      required
      fluid
    >
      <option value="">Choose a region</option>
      <optgroup label="Europe">
        <option value="rs">Serbia</option>
        <option value="de" disabled>Germany</option>
      </optgroup>
    </select>
    <select id="plain">
      <option>Unstyled</option>
    </select>
  </form>`,
})
class NativeHost {
  readonly size = signal<AerisNativeSelectSize>('md');
  readonly invalid = signal(false);
  readonly touched = signal<boolean | null>(null);
  readonly disabled = signal(false);
}

@Component({
  imports: [AerisNativeSelect, ReactiveFormsModule],
  template: `<form>
    <select
      aerisNativeSelect
      name="regions"
      multiple
      [size]="4"
      controlSize="sm"
      [formControl]="control"
      aria-label="Regions"
    >
      <option value="rs">Serbia</option>
      <option value="de">Germany</option>
      <option value="jp">Japan</option>
    </select>
  </form>`,
})
class NativeMultipleHost {
  readonly control = new FormControl<readonly string[]>(['rs'], { nonNullable: true });
}

@Component({
  imports: [AerisNativeSelect, FormField],
  template: `<select aerisNativeSelect [formField]="fields.region" aria-label="Required region">
    <option value="">Choose</option>
    <option value="rs">Serbia</option>
  </select>`,
})
class NativeSignalHost {
  readonly data = signal({ region: '' });
  readonly fields = form(this.data, (path) => required(path.region));
}

describe('AerisNativeSelect', () => {
  it('retains the native element, options, optgroups, required state and successful form values', async () => {
    const fixture = TestBed.createComponent(NativeHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const select = root.querySelector('select') as HTMLSelectElement;
    expect(select.classList).toContain('aeris-native-select');
    expect(select.getAttribute('data-control-size')).toBe('md');
    expect(select.getAttribute('role')).toBeNull();
    expect(select.getAttribute('tabindex')).toBeNull();
    expect(select.required).toBe(true);
    expect(select.validity.valueMissing).toBe(true);
    expect(select.getAttribute('aria-invalid')).toBeNull();
    expect(select.classList.contains('aeris-native-select--invalid')).toBe(false);
    expect(select.options.length).toBe(3);
    expect(select.querySelector('optgroup')?.label).toBe('Europe');
    expect(select.options[2].disabled).toBe(true);
    expect(root.querySelector('#plain')?.className).toBe('');
    select.value = 'rs';
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(new FormData(root.querySelector('form') as HTMLFormElement).get('region')).toBe('rs');
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(new FormData(root.querySelector('form') as HTMLFormElement).has('region')).toBe(false);
    fixture.componentInstance.size.set('lg');
    await fixture.whenStable();
    expect(select.getAttribute('data-control-size')).toBe('lg');
    expect(select.size).toBe(0);
  });

  it('keeps multiple selection, native size and the built-in Angular value accessor', async () => {
    const fixture = TestBed.createComponent(NativeMultipleHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const select = root.querySelector('select') as HTMLSelectElement;
    expect(select.size).toBe(4);
    expect(select.multiple).toBe(true);
    expect(select.getAttribute('data-control-size')).toBe('sm');
    expect(select.selectedOptions[0].textContent).toBe('Serbia');
    select.options[2].selected = true;
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toEqual(['rs', 'jp']);
    expect(new FormData(root.querySelector('form') as HTMLFormElement).getAll('regions')).toEqual(
      Array.from(select.selectedOptions, (option) => option.value),
    );
    fixture.componentInstance.control.setValue(['de']);
    await fixture.whenStable();
    expect(select.selectedOptions[0].textContent).toBe('Germany');
  });

  it('synchronizes manual invalid presentation without swallowing native keyboard events', async () => {
    const fixture = TestBed.createComponent(NativeHost);
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.classList).toContain('aeris-native-select--invalid');
    fixture.componentInstance.touched.set(false);
    await fixture.whenStable();
    expect(select.getAttribute('aria-invalid')).toBeNull();
    fixture.componentInstance.touched.set(true);
    await fixture.whenStable();
    expect(select.getAttribute('aria-invalid')).toBe('true');
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape']) {
      const event = new KeyboardEvent('keydown', { key, cancelable: true });
      select.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
  });

  it('integrates with native Signal Forms required, blur, submission and value handling', async () => {
    const fixture = TestBed.createComponent(NativeSignalHost);
    await fixture.whenStable();
    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;
    const field = fixture.componentInstance.fields.region();
    expect(field.invalid()).toBe(true);
    expect(field.touched()).toBe(false);
    expect(select.getAttribute('aria-invalid')).toBeNull();
    select.dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(field.touched()).toBe(true);
    expect(select.getAttribute('aria-invalid')).toBe('true');
    field.reset('');
    await fixture.whenStable();
    expect(select.getAttribute('aria-invalid')).toBeNull();
    await submit(fixture.componentInstance.fields, async () => undefined);
    await fixture.whenStable();
    expect(select.getAttribute('aria-invalid')).toBe('true');
    select.value = 'rs';
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.data().region).toBe('rs');
    expect(select.getAttribute('aria-invalid')).toBeNull();
  });
});
