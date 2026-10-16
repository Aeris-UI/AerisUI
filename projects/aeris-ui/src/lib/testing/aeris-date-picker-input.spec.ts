import { Component, signal } from '@angular/core';
import { TestBed, DeferBlockBehavior, type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ɵAerisDatePickerInput as DatePickerInput } from '../../../date-picker/aeris-date-picker-input';
import { AerisDatePicker } from '../../../date-picker/aeris-date-picker';

@Component({
  imports: [AerisDatePicker, FormField],
  template: `<aeris-date-picker editable inputId="birthday" [formField]="fields.birthday" /><button
      type="button"
    >
      Next
    </button>`,
})
class SignalDateHost {
  readonly data = signal<{ birthday: Date | null }>({ birthday: null });
  readonly fields = form(this.data, (path) => required(path.birthday));
}
@Component({
  imports: [AerisDatePicker, FormField],
  template: `<aeris-date-picker inputId="delivery" editable [formField]="fields.delivery" /><button
      type="button"
    >
      Next
    </button>`,
})
class SignalPickerHost {
  readonly data = signal<{ delivery: Date | null }>({ delivery: new Date(2026, 5, 11) });
  readonly fields = form(this.data, (path) => required(path.delivery));
}
@Component({
  imports: [AerisDatePicker, ReactiveFormsModule],
  template: `<aeris-date-picker editable [formControl]="control" />`,
})
class ReactiveDateHost {
  readonly control = new FormControl<Date | null>(new Date(2026, 5, 11));
}

async function enter<T>(fixture: ComponentFixture<T>, part: string, value: string): Promise<void> {
  const input = fixture.nativeElement.querySelector(`[data-segment="${part}"]`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
}
function segment<T>(fixture: ComponentFixture<T>, part: string): HTMLInputElement {
  return fixture.nativeElement.querySelector(`[data-segment="${part}"]`) as HTMLInputElement;
}
async function paste<T>(fixture: ComponentFixture<T>, text: string): Promise<void> {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
  segment(fixture, 'year').dispatchEvent(event);
  await fixture.whenStable();
}

describe('DatePicker segmented input', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Playthrough }),
  );
  it('never repairs an impossible localized paste into a different valid date on blur', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentRef.setInput('locale', 'de-DE');
    fixture.componentInstance.writeValue('2024-06-11');
    await fixture.whenStable();
    await paste(fixture, '29.02.2025');
    segment(fixture, 'year').dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.validationError()).toBe('invalid');
    expect(fixture.componentInstance.value()).toBe('2024-06-11');
  });
  it.each([
    ['en-US', ['month', 'day', 'year']],
    ['en-GB', ['day', 'month', 'year']],
    ['ja-JP', ['year', 'month', 'day']],
  ] as const)(
    'uses locale order for %s without changing its canonical value',
    async (locale, expected) => {
      const fixture = TestBed.createComponent(DatePickerInput);
      fixture.componentRef.setInput('locale', locale);
      fixture.componentInstance.writeValue('2026-06-11');
      await fixture.whenStable();
      expect(
        Array.from(
          fixture.nativeElement.querySelectorAll('[data-segment]') as NodeListOf<HTMLInputElement>,
          (input) => input.dataset['segment'],
        ),
      ).toEqual(expected);
      expect(fixture.componentInstance.value()).toBe('2026-06-11');
    },
  );
  it('keeps incomplete and impossible drafts visible without committing a fabricated date', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentInstance.writeValue('2026-06-11');
    await fixture.whenStable();
    await enter(fixture, 'year', '');
    expect(fixture.componentInstance.value()).toBe('2026-06-11');
    expect(fixture.componentInstance.validationError()).toBe('incomplete');
    await enter(fixture, 'year', '2025');
    await enter(fixture, 'month', '02');
    await enter(fixture, 'day', '29');
    expect(fixture.componentInstance.validationError()).toBe('invalid');
    expect(segment(fixture, 'day').value).toBe('29');
    await enter(fixture, 'year', '2024');
    expect(fixture.componentInstance.value()).toBe('2024-02-29');
  });
  it('enforces bounds, disabled dates and malformed configuration', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentRef.setInput('min', '2026-06-10');
    fixture.componentRef.setInput('max', '2026-06-20');
    fixture.componentRef.setInput('dateDisabled', (value: string) => value === '2026-06-15');
    await fixture.whenStable();
    await paste(fixture, '2026-06-09');
    expect(fixture.componentInstance.validationError()).toBe('min');
    await paste(fixture, '2026-06-21');
    expect(fixture.componentInstance.validationError()).toBe('max');
    await paste(fixture, '2026-06-15');
    expect(fixture.componentInstance.validationError()).toBe('unavailable');
    await paste(fixture, '2026-06-12');
    expect(fixture.componentInstance.value()).toBe('2026-06-12');
    fixture.componentRef.setInput('min', 'not a date');
    await fixture.whenStable();
    expect(fixture.componentInstance.validationError()).toBe('configuration');
  });
  it('supports localized paste and digits, rejecting ambiguous or invalid full values', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentRef.setInput('locale', 'de-DE');
    await fixture.whenStable();
    await paste(fixture, '31.12.2025');
    expect(fixture.componentInstance.value()).toBe('2025-12-31');
    await paste(fixture, '12/31/2025');
    expect(fixture.componentInstance.validationError()).toBe('invalid');
    fixture.componentRef.setInput('locale', 'ar-EG');
    await fixture.whenStable();
    await paste(fixture, '٢٠٢٤-٠٢-٢٩');
    expect(fixture.componentInstance.value()).toBe('2024-02-29');
    expect(segment(fixture, 'year').value).toBe('٢٠٢٤');
  });
  it('pads deliberate short years on blur without guessing a century', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentInstance.writeValue('2026-06-11');
    await fixture.whenStable();
    await enter(fixture, 'year', '25');
    expect(fixture.componentInstance.validationError()).toBe('incomplete');
    segment(fixture, 'year').dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('0025-06-11');
  });
  it('steps a segment, clamps the day on month/year changes and supports Home/End', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentInstance.writeValue('2024-01-31');
    await fixture.whenStable();
    segment(fixture, 'month').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('2024-02-29');
    segment(fixture, 'day').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    await fixture.whenStable();
    expect(segment(fixture, 'day').getAttribute('aria-valuemax')).toBe('29');
    segment(fixture, 'day').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('2024-02-01');
    segment(fixture, 'month').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('2024-01-01');
  });
  it.each(['year', 'month'] as const)(
    'normalizes %s entry to its first calendar day',
    async (granularity) => {
      const fixture = TestBed.createComponent(DatePickerInput);
      fixture.componentRef.setInput('granularity', granularity);
      await fixture.whenStable();
      await paste(fixture, granularity === 'year' ? '2025' : '2025-10');
      expect(fixture.componentInstance.value()).toBe(
        granularity === 'year' ? '2025-01-01' : '2025-10-01',
      );
      await paste(fixture, '2025-10-16');
      expect(fixture.componentInstance.validationError()).toBe('invalid');
    },
  );
  it('honors disabled/read-only and restores a cleared draft on writeValue', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentInstance.writeValue('2026-06-11');
    await fixture.whenStable();
    fixture.componentRef.setInput('readonly', true);
    await fixture.whenStable();
    await enter(fixture, 'year', '2025');
    segment(fixture, 'year').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
    );
    expect(fixture.componentInstance.value()).toBe('2026-06-11');
    expect(segment(fixture, 'year').readOnly).toBe(true);
    fixture.componentRef.setInput('readonly', false);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(segment(fixture, 'year').disabled).toBe(true);
    fixture.componentRef.setInput('disabled', false);
    await fixture.whenStable();
    fixture.componentInstance.writeValue(null);
    await fixture.whenStable();
    expect(segment(fixture, 'year').value).toBe('');
    fixture.componentInstance.writeValue('2025-07-02');
    await fixture.whenStable();
    expect(segment(fixture, 'year').value).toBe('2025');
  });
  it('supports immediately visible manual validation and explicit untouched state', async () => {
    const fixture = TestBed.createComponent(DatePickerInput);
    fixture.componentRef.setInput('invalid', true);
    await fixture.whenStable();
    expect(segment(fixture, 'year').getAttribute('aria-invalid')).toBe('true');
    fixture.componentRef.setInput('touched', false);
    await fixture.whenStable();
    expect(segment(fixture, 'year').hasAttribute('aria-invalid')).toBe(false);
  });
  it('integrates with Signal Forms, defers errors, blocks submission and clears errors on valid input', async () => {
    const fixture = TestBed.createComponent(SignalDateHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.fields.birthday().invalid()).toBe(true);
    expect(segment(fixture, 'year').hasAttribute('aria-invalid')).toBe(false);
    let submitted = false;
    await submit(fixture.componentInstance.fields, async () => {
      submitted = true;
    });
    await fixture.whenStable();
    expect(submitted).toBe(false);
    expect(segment(fixture, 'year').getAttribute('aria-invalid')).toBe('true');
    await paste(fixture, '2024-02-29');
    expect(fixture.componentInstance.data().birthday).toEqual(new Date(2024, 1, 29));
    expect(fixture.componentInstance.fields.birthday().invalid()).toBe(false);
    await enter(fixture, 'year', '');
    expect(fixture.componentInstance.data().birthday).toEqual(new Date(2024, 1, 29));
    expect(fixture.componentInstance.fields.birthday().invalid()).toBe(true);
  });
  it('exposes incomplete parsing through Reactive Forms validation and resets cleanly', async () => {
    const fixture = TestBed.createComponent(ReactiveDateHost);
    await fixture.whenStable();
    await enter(fixture, 'day', '');
    expect(fixture.componentInstance.control.invalid).toBe(true);
    expect(fixture.componentInstance.control.value).toEqual(new Date(2026, 5, 11));
    fixture.componentInstance.control.reset(new Date(2025, 0, 1));
    await fixture.whenStable();
    expect(segment(fixture, 'day').value).toBe('01');
    expect(fixture.componentInstance.control.valid).toBe(true);
  });
});
describe('editable DatePicker', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Playthrough }),
  );
  it('focuses the first locale segment from the field surface without redirecting direct segment clicks', async () => {
    const fixture = TestBed.createComponent(AerisDatePicker);
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('locale', 'en-GB');
    await fixture.whenStable();
    const surface = fixture.nativeElement.querySelector('.aeris-date-picker-input') as HTMLElement;
    surface.click();
    expect(document.activeElement).toBe(segment(fixture, 'day'));
    segment(fixture, 'year').focus();
    segment(fixture, 'year').click();
    expect(document.activeElement).toBe(segment(fixture, 'year'));
    (
      fixture.nativeElement.querySelector('.aeris-date-picker-input__literal') as HTMLElement
    ).click();
    expect(document.activeElement).toBe(segment(fixture, 'day'));
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    const focus = vi.spyOn(segment(fixture, 'day'), 'focus');
    surface.click();
    expect(focus).not.toHaveBeenCalled();
  });
  it('keeps calendar and clear button activation independent of surface focus', async () => {
    const fixture = TestBed.createComponent(AerisDatePicker);
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('clearable', true);
    fixture.componentInstance.writeValue(new Date(2026, 5, 11));
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector(
      '.aeris-date-picker__entry-trigger',
    ) as HTMLButtonElement;
    expect(button.querySelector('.aeris-date-picker__entry-icon')).not.toBeNull();
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fixture.componentInstance.close();
    (fixture.nativeElement.querySelector('.aeris-date-picker__clear') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBeNull();
    fixture.componentRef.setInput('showIcon', false);
    await fixture.whenStable();
    expect(button.querySelector('.aeris-date-picker__entry-icon--chevron')).not.toBeNull();
  });
  it('uses January 1 for calendar year selections and compares year bounds at year precision', async () => {
    const fixture = TestBed.createComponent(AerisDatePicker);
    fixture.componentRef.setInput('view', 'year');
    fixture.componentRef.setInput('minDate', new Date(2025, 5, 11));
    fixture.componentRef.setInput('maxDate', new Date(2026, 8, 15));
    fixture.componentInstance.writeValue(new Date(2025, 9, 16));
    await fixture.whenStable();
    fixture.componentInstance.openPanel();
    await fixture.whenStable();
    const option = Array.from(
      fixture.nativeElement.querySelectorAll('[role="option"]') as NodeListOf<HTMLButtonElement>,
    ).find((item) => item.textContent?.trim() === '2025');
    expect(option?.disabled).toBe(false);
    option?.click();
    await fixture.whenStable();
    const value = fixture.componentInstance.value() as Date;
    expect([value.getFullYear(), value.getMonth(), value.getDate()]).toEqual([2025, 0, 1]);
  });
  it('shares typed entry with the Date model and reports incomplete drafts to Signal Forms', async () => {
    const fixture = TestBed.createComponent(SignalPickerHost);
    await fixture.whenStable();
    await enter(fixture, 'month', '07');
    expect(fixture.componentInstance.data().delivery?.getMonth()).toBe(6);
    await enter(fixture, 'year', '');
    expect(fixture.componentInstance.data().delivery?.getFullYear()).toBe(2026);
    expect(fixture.componentInstance.fields.delivery().invalid()).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('input[type="hidden"]') as HTMLInputElement | null)
        ?.value ?? '',
    ).toBe('');
    let submitted = false;
    await submit(fixture.componentInstance.fields, async () => {
      submitted = true;
    });
    await fixture.whenStable();
    expect(submitted).toBe(false);
    expect(segment(fixture, 'year').getAttribute('aria-invalid')).toBe('true');
    await enter(fixture, 'year', '2028');
    expect(fixture.componentInstance.fields.delivery().invalid()).toBe(false);
    expect(fixture.componentInstance.data().delivery?.getFullYear()).toBe(2028);
  });
  it('clears partial entry even when its committed model is already null', async () => {
    const fixture = TestBed.createComponent(AerisDatePicker);
    fixture.componentRef.setInput('editable', true);
    await fixture.whenStable();
    await enter(fixture, 'month', '02');
    expect(fixture.componentInstance.validate()).not.toBeNull();
    fixture.componentInstance.clear();
    await fixture.whenStable();
    expect(fixture.componentInstance.validate()).toBeNull();
    expect(segment(fixture, 'month').value).toBe('');
  });
});
