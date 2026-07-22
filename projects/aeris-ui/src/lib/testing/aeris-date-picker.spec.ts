import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisDatePicker,
  type AerisDatePickerChangeEvent,
  type AerisDateRange,
} from '../../../date-picker/aeris-date-picker';

@Component({
  imports: [AerisDatePicker],
  template: `
    <label for="delivery-date">Delivery date</label>
    <aeris-date-picker
      #picker
      inputId="delivery-date"
      name="deliveryDate"
      placeholder="Select delivery date"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [disabledDates]="disabledDates"
      clearable
      required
      invalid
      ariaDescribedby="delivery-help"
      [(value)]="date"
      (changed)="lastChange.set($event)"
    />
  `,
})
class DatePickerTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly date = signal<Date | null>(new Date(2026, 5, 11));
  readonly lastChange = signal<AerisDatePickerChangeEvent | null>(null);
  readonly minDate = new Date(2026, 5, 1);
  readonly maxDate = new Date(2026, 5, 30);
  readonly disabledDates = [new Date(2026, 5, 15)];
}

@Component({
  imports: [AerisDatePicker],
  template: `
    <aeris-date-picker
      #picker
      selectionMode="range"
      [inline]="true"
      [(value)]="range"
    />
  `,
})
class DatePickerRangeTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly range = signal<AerisDateRange | null>(null);
}

@Component({
  imports: [AerisDatePicker],
  template: `
    <aeris-date-picker
      #picker
      inputId="keyboard-date"
      [(value)]="date"
    />
  `,
})
class DatePickerKeyboardTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly date = signal<Date | null>(new Date(2026, 5, 11));
}

@Component({
  imports: [AerisDatePicker],
  template: `
    <aeris-date-picker
      #picker
      inputId="month-date"
      view="month"
      [(value)]="date"
    />
  `,
})
class DatePickerMonthTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly date = signal<Date | null>(new Date(2026, 5, 1));
}

@Component({
  imports: [AerisDatePicker],
  template: `
    <aeris-date-picker
      #picker
      inputId="meeting-date"
      name="meetingDate"
      mode="dateTime"
      hourCycle="12"
      showSeconds
      [(value)]="date"
      (changed)="lastChange.set($event)"
    />
  `,
})
class DatePickerDateTimeTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly date = signal<Date | null>(new Date(2026, 5, 11, 14, 30, 15));
  readonly lastChange = signal<AerisDatePickerChangeEvent | null>(null);
}

@Component({
  imports: [AerisDatePicker],
  template: `
    <aeris-date-picker
      #picker
      inputId="alarm-time"
      name="alarmTime"
      mode="time"
      hourCycle="24"
      [minuteStep]="15"
      [(value)]="time"
      (changed)="lastChange.set($event)"
    />
  `,
})
class DatePickerTimeOnlyTestHost {
  readonly picker = viewChild.required<AerisDatePicker>('picker');
  readonly time = signal<Date | null>(new Date(2026, 5, 11, 9, 15));
  readonly lastChange = signal<AerisDatePickerChangeEvent | null>(null);
}

describe('AerisDatePicker', () => {
  it('exposes combobox, form, and accessibility semantics', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '#delivery-date',
    ) as HTMLButtonElement;
    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe('delivery-help');
    expect(hiddenInput.name).toBe('deliveryDate');
    expect(hiddenInput.value).toBe('2026-06-11');
  });

  it('opens, selects an enabled date, and emits a typed event', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '#delivery-date',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const day = fixture.nativeElement.querySelector(
      '[data-date="2026-06-12"]',
    ) as HTMLButtonElement;
    day.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.date()?.getDate()).toBe(12);
    expect(
      (fixture.componentInstance.lastChange()?.value as Date).getDate(),
    ).toBe(12);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens from the keyboard and focuses the selected date', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '#delivery-date',
    ) as HTMLButtonElement;
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect((document.activeElement as HTMLElement).dataset['date']).toBe(
      '2026-06-11',
    );
  });

  it('supports arrow, Home, End, Page Up, and Page Down navigation', async () => {
    const fixture = TestBed.createComponent(DatePickerKeyboardTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const press = async (key: string, shiftKey = false): Promise<string | undefined> => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }),
      );
      fixture.detectChanges();
      await fixture.whenStable();
      return (document.activeElement as HTMLElement).dataset['date'];
    };

    expect(await press('ArrowRight')).toBe('2026-06-12');
    expect(await press('ArrowDown')).toBe('2026-06-19');
    expect(await press('ArrowLeft')).toBe('2026-06-18');
    expect(await press('ArrowUp')).toBe('2026-06-11');
    expect(await press('Home')).toBe('2026-06-07');
    expect(await press('End')).toBe('2026-06-13');
    expect(await press('PageDown')).toBe('2026-07-13');
    expect(await press('PageUp')).toBe('2026-06-13');
    expect(await press('PageDown', true)).toBe('2027-06-13');
    expect(await press('PageUp', true)).toBe('2026-06-13');
  });

  it('selects with Enter and closes with Escape while restoring focus', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '#delivery-date',
    ) as HTMLButtonElement;
    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Tab without preventing normal focus navigation', async () => {
    const fixture = TestBed.createComponent(DatePickerKeyboardTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '#keyboard-date',
    ) as HTMLButtonElement;
    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    document.activeElement?.dispatchEvent(event);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
  });

  it('uses roving arrow navigation in month selection view', async () => {
    const fixture = TestBed.createComponent(DatePickerMonthTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll(
      '[role="option"]',
    ) as NodeListOf<HTMLButtonElement>;
    expect(document.activeElement).toBe(options.item(5));
    expect(options.item(5).tabIndex).toBe(0);

    options.item(5).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(options.item(8));

    options.item(8).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(options.item(0));
  });

  it('renders date and time controls and preserves time when selecting a date', async () => {
    const fixture = TestBed.createComponent(DatePickerDateTimeTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const day = fixture.nativeElement.querySelector(
      '[data-date="2026-06-12"]',
    ) as HTMLButtonElement;
    day.click();
    fixture.detectChanges();

    const value = fixture.componentInstance.date();
    expect(value?.getDate()).toBe(12);
    expect(value?.getHours()).toBe(14);
    expect(value?.getMinutes()).toBe(30);
    expect(value?.getSeconds()).toBe(15);
  });

  it('updates date-time values from 12-hour time controls', async () => {
    const fixture = TestBed.createComponent(DatePickerDateTimeTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll(
      '.aeris-date-picker__time input',
    ) as NodeListOf<HTMLInputElement>;
    const period = fixture.nativeElement.querySelector(
      '.aeris-date-picker__time select',
    ) as HTMLSelectElement;

    inputs.item(0).value = '03';
    inputs.item(0).dispatchEvent(new Event('input', { bubbles: true }));
    period.value = 'AM';
    period.dispatchEvent(new Event('change', { bubbles: true }));
    inputs.item(1).value = '45';
    inputs.item(1).dispatchEvent(new Event('input', { bubbles: true }));
    inputs.item(2).value = '20';
    inputs.item(2).dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const value = fixture.componentInstance.date();
    expect(value?.getHours()).toBe(3);
    expect(value?.getMinutes()).toBe(45);
    expect(value?.getSeconds()).toBe(20);
    expect(
      (fixture.componentInstance.lastChange()?.value as Date).getMinutes(),
    ).toBe(45);
  });

  it('supports time-only mode without rendering a calendar grid', async () => {
    const fixture = TestBed.createComponent(DatePickerTimeOnlyTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('.aeris-date-picker__calendar'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.aeris-date-picker__time'),
    ).not.toBeNull();
    expect((document.activeElement as HTMLInputElement).id).toBe('');

    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hiddenInput.value).toBe('09:15');
  });

  it('serializes time-only changes and respects minute steps on the input', async () => {
    const fixture = TestBed.createComponent(DatePickerTimeOnlyTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll(
      '.aeris-date-picker__time input',
    ) as NodeListOf<HTMLInputElement>;
    expect(inputs.item(1).step).toBe('15');

    inputs.item(0).value = '18';
    inputs.item(0).dispatchEvent(new Event('input', { bubbles: true }));
    inputs.item(1).value = '45';
    inputs.item(1).dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const value = fixture.componentInstance.time();
    expect(value?.getHours()).toBe(18);
    expect(value?.getMinutes()).toBe(45);
    expect(
      (fixture.componentInstance.lastChange()?.value as Date).getHours(),
    ).toBe(18);

    const hiddenInput = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hiddenInput.value).toBe('18:45');
  });

  it('disables constrained dates', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    fixture.componentInstance.picker().openPanel();
    fixture.detectChanges();

    const disabled = fixture.nativeElement.querySelector(
      '[data-date="2026-06-15"]',
    ) as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
  });

  it('selects an ordered range in inline mode', async () => {
    const fixture = TestBed.createComponent(DatePickerRangeTestHost);
    await fixture.whenStable();

    const picker = fixture.componentInstance.picker();
    picker.writeValue({ start: new Date(2026, 5, 11), end: null });
    fixture.detectChanges();

    const end = fixture.nativeElement.querySelector(
      '[data-date="2026-06-14"]',
    ) as HTMLButtonElement;
    end.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.range()?.start?.getDate()).toBe(11);
    expect(fixture.componentInstance.range()?.end?.getDate()).toBe(14);
  });

  it('supports clear and reset methods', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    await fixture.whenStable();

    const picker = fixture.componentInstance.picker();
    picker.clear();
    fixture.detectChanges();
    expect(fixture.componentInstance.date()).toBeNull();

    picker.writeValue(new Date(2026, 5, 18));
    picker.reset();
    fixture.detectChanges();
    expect(picker.value()).toBeNull();
  });
});
