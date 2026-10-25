import { Component, signal } from '@angular/core';
import { DeferBlockBehavior, TestBed, type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisDatePicker, type AerisDatePickerMode } from '../../../date-picker/aeris-date-picker';

@Component({
  imports: [AerisDatePicker, FormField],
  template: `<aeris-date-picker
    editable
    mode="time"
    hourCycle="12"
    showSeconds
    [formField]="fields.time"
  />`,
})
class SignalClockHost {
  readonly data = signal<{ time: Date | null }>({ time: null });
  readonly fields = form(this.data, (path) => required(path.time));
}
@Component({
  imports: [AerisDatePicker, ReactiveFormsModule],
  template: `<aeris-date-picker editable mode="dateTime" [formControl]="control" />`,
})
class ReactiveClockHost {
  readonly control = new FormControl<Date | null>(new Date(2026, 5, 11, 9, 15));
}
function segment<T>(fixture: ComponentFixture<T>, part: string): HTMLInputElement {
  return fixture.nativeElement.querySelector(`[data-segment="${part}"]`) as HTMLInputElement;
}
async function enter<T>(fixture: ComponentFixture<T>, part: string, value: string): Promise<void> {
  const input = segment(fixture, part);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
}
async function paste<T>(fixture: ComponentFixture<T>, value: string): Promise<void> {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => value } });
  fixture.nativeElement.querySelector('[data-segment]').dispatchEvent(event);
  await fixture.whenStable();
}
async function picker(
  mode: AerisDatePickerMode = 'time',
  cycle: '12' | '24' = '24',
  seconds = true,
) {
  const fixture = TestBed.createComponent(AerisDatePicker);
  fixture.componentRef.setInput('editable', true);
  fixture.componentRef.setInput('mode', mode);
  fixture.componentRef.setInput('hourCycle', cycle);
  fixture.componentRef.setInput('showSeconds', seconds);
  fixture.componentRef.setInput('name', 'clock');
  fixture.componentInstance.writeValue(new Date(2026, 5, 11, 0, 15, 27));
  await fixture.whenStable();
  return fixture;
}
function clock<T extends AerisDatePicker>(fixture: ComponentFixture<T>): readonly number[] {
  const value = fixture.componentInstance.value() as Date;
  return [
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    value.getHours(),
    value.getMinutes(),
    value.getSeconds(),
  ];
}

describe('DatePicker typed time entry', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Playthrough }),
  );
  it.each(['time', 'dateTime'] as const)(
    'does not normalize hidden milliseconds or emit changes when %s first renders',
    async (mode) => {
      const fixture = TestBed.createComponent(AerisDatePicker);
      fixture.componentRef.setInput('editable', true);
      fixture.componentRef.setInput('mode', mode);
      const date = new Date(2026, 5, 11, 14, 30, 27, 123);
      const changed = vi.fn();
      fixture.componentInstance.changed.subscribe(changed);
      fixture.componentInstance.writeValue(date);
      await fixture.whenStable();
      expect((fixture.componentInstance.value() as Date).getTime()).toBe(date.getTime());
      expect(changed).not.toHaveBeenCalled();
    },
  );

  it.each(['time', 'dateTime'] as const)(
    'edits %s without changing its Date model or calendar carrier',
    async (mode) => {
      const fixture = await picker(mode);
      expect(segment(fixture, 'hour').value).toBe('00');
      await enter(fixture, 'hour', '23');
      await enter(fixture, 'minute', '59');
      await enter(fixture, 'second', '58');
      expect(clock(fixture)).toEqual([2026, 5, 11, 23, 59, 58]);
      expect(fixture.nativeElement.querySelector('input[name="clock"]').value).toBe(
        mode === 'time' ? '23:59:58' : '2026-06-11T23:59:58',
      );
      expect(fixture.nativeElement.querySelectorAll('[data-segment]')).toHaveLength(
        mode === 'time' ? 3 : 6,
      );
    },
  );
  it('handles midnight/noon and explicit period typing, arrows, Home and End', async () => {
    const fixture = await picker('time', '12');
    expect(segment(fixture, 'hour').value).toBe('12');
    expect(segment(fixture, 'dayPeriod').value).toBe('AM');
    await enter(fixture, 'dayPeriod', 'p');
    expect(clock(fixture).slice(3)).toEqual([12, 15, 27]);
    segment(fixture, 'dayPeriod').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    await fixture.whenStable();
    expect(clock(fixture)[3]).toBe(0);
    segment(fixture, 'dayPeriod').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    await fixture.whenStable();
    expect(clock(fixture)[3]).toBe(12);
    segment(fixture, 'hour').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    await fixture.whenStable();
    expect(clock(fixture)[3]).toBe(13);
    expect(segment(fixture, 'dayPeriod').getAttribute('aria-valuetext')).toBe('PM');
  });
  it('preserves incomplete and invalid drafts, rejects overflow and clears all parts to null', async () => {
    const fixture = await picker();
    await enter(fixture, 'minute', '');
    expect(clock(fixture).slice(3)).toEqual([0, 15, 27]);
    expect(fixture.componentInstance.validate()).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input[name="clock"]').value).toBe('');
    await enter(fixture, 'minute', '65');
    expect(segment(fixture, 'minute').value).toBe('65');
    expect(clock(fixture)[4]).toBe(15);
    await enter(fixture, 'minute', '30');
    expect(fixture.componentInstance.validate()).toBeNull();
    for (const part of ['hour', 'minute', 'second']) await enter(fixture, part, '');
    expect(fixture.componentInstance.value()).toBeNull();
  });
  it('preserves hidden seconds, applies keyboard steps without rounding typed values, and switches hour cycles', async () => {
    const fixture = await picker('time', '24', false);
    fixture.componentRef.setInput('minuteStep', 15);
    await fixture.whenStable();
    await enter(fixture, 'hour', '14');
    await enter(fixture, 'minute', '17');
    expect(clock(fixture).slice(3)).toEqual([14, 17, 27]);
    segment(fixture, 'minute').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    await fixture.whenStable();
    expect(clock(fixture)[4]).toBe(32);
    await enter(fixture, 'minute', '');
    fixture.componentRef.setInput('hourCycle', '12');
    await fixture.whenStable();
    expect(segment(fixture, 'hour').value).toBe('02');
    expect(segment(fixture, 'dayPeriod').value).toBe('PM');
    expect(segment(fixture, 'minute').value).toBe('');
    await enter(fixture, 'minute', '20');
    fixture.componentRef.setInput('showSeconds', true);
    await fixture.whenStable();
    expect(segment(fixture, 'second').value).toBe('27');
    expect(clock(fixture).slice(3)).toEqual([14, 20, 27]);
  });
  it('accepts canonical and locale time/date-time paste, never Date.parse guesses', async () => {
    const fixture = await picker('dateTime', '12');
    await paste(fixture, '2025-12-31T23:59:10');
    expect(clock(fixture)).toEqual([2025, 11, 31, 23, 59, 10]);
    await paste(fixture, '12/31/2025, 11:59:12 PM');
    expect(clock(fixture).slice(3)).toEqual([23, 59, 12]);
    await paste(fixture, '2025-02-30T23:59:10');
    expect(fixture.componentInstance.validate()).not.toBeNull();
    expect(clock(fixture)).toEqual([2025, 11, 31, 23, 59, 12]);
    fixture.componentRef.setInput('mode', 'time');
    fixture.componentRef.setInput('locale', 'ar-EG');
    await fixture.whenStable();
    const localized = new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h12',
    }).format(new Date(2026, 5, 11, 22, 43, 12));
    await paste(fixture, localized);
    expect(clock(fixture).slice(3)).toEqual([22, 43, 12]);
    expect(segment(fixture, 'hour').value).toBe('١٠');
  });
  it('keeps calendar selection, popup clock edits and segment entry synchronized', async () => {
    const fixture = await picker('dateTime');
    await enter(fixture, 'hour', '14');
    fixture.componentInstance.openPanel();
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[data-date="2026-06-12"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(clock(fixture)).toEqual([2026, 5, 12, 14, 15, 27]);
    const input = fixture.nativeElement.querySelectorAll(
      '.aeris-date-picker__time-field input',
    )[1] as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(segment(fixture, 'minute').value).toBe('42');
    expect(clock(fixture)[4]).toBe(42);
  });
  it('honors readonly, disabled, date bounds and external resets', async () => {
    const fixture = await picker('dateTime');
    fixture.componentRef.setInput('readonly', true);
    await fixture.whenStable();
    await enter(fixture, 'hour', '18');
    expect(clock(fixture)[3]).toBe(0);
    fixture.componentRef.setInput('readonly', false);
    fixture.componentRef.setInput('minDate', new Date(2026, 5, 10));
    fixture.componentRef.setInput('maxDate', new Date(2026, 5, 20));
    await fixture.whenStable();
    await paste(fixture, '2026-06-21T12:00:00');
    expect(fixture.componentInstance.validate()).not.toBeNull();
    fixture.componentInstance.writeValue(new Date(2026, 5, 15, 17, 30));
    await fixture.whenStable();
    expect(fixture.componentInstance.validate()).toBeNull();
    expect(segment(fixture, 'hour').value).toBe('17');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(segment(fixture, 'hour').disabled).toBe(true);
  });
  it('forwards time draft validity and touched state to real Signal Forms', async () => {
    const fixture = TestBed.createComponent(SignalClockHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.fields.time().invalid()).toBe(true);
    expect(segment(fixture, 'hour').hasAttribute('aria-invalid')).toBe(false);
    let saved = false;
    await submit(fixture.componentInstance.fields, async () => {
      saved = true;
    });
    await fixture.whenStable();
    expect(saved).toBe(false);
    expect(segment(fixture, 'hour').getAttribute('aria-invalid')).toBe('true');
    await paste(fixture, '23:59:12');
    expect(fixture.componentInstance.fields.time().invalid()).toBe(false);
    expect(fixture.componentInstance.data().time?.getHours()).toBe(23);
    await enter(fixture, 'minute', '');
    expect(fixture.componentInstance.fields.time().invalid()).toBe(true);
    expect(fixture.componentInstance.data().time?.getMinutes()).toBe(59);
  });
  it('exposes parse errors through Reactive Forms and resets without a stale draft', async () => {
    const fixture = TestBed.createComponent(ReactiveClockHost);
    await fixture.whenStable();
    await enter(fixture, 'hour', '');
    expect(fixture.componentInstance.control.invalid).toBe(true);
    fixture.componentInstance.control.reset(new Date(2025, 11, 31, 23, 59));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.valid).toBe(true);
    expect(segment(fixture, 'hour').value).toBe('23');
  });
});
