import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  output,
  signal,
  runInInjectionContext,
  untracked,
  viewChild,
  viewChildren,
  TemplateRef,
  type WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';
import { transformedValue, type TransformedValueSignal } from '@angular/forms/signals';
import { ɵAerisDatePickerInput } from './aeris-date-picker-input';
import type { AerisDatePickerInputEditEvent } from './aeris-date-picker-input.utils';
import {
  ɵAerisIcon,
  ɵaerisDisplayInvalid,
  aerisInternalReadTime as timeFromDate,
  aerisInternalFormatTimeParts,
  aerisInternalLocaleFirstDay,
  aerisInternalToTwelveHour as toTwelveHour,
  aerisInternalFromTwelveHour as fromTwelveHour,
  aerisInternalParseDateParts,
  aerisInternalDateFromParts,
  type AerisInternalTimeParts as AerisTimeValue,
} from '@aeris-ui/core';
import {
  ɵAerisAppendTo,
  type AerisAppendTo,
  type AerisOverlayCollisionPadding,
} from '@aeris-ui/core';

import {
  addDays,
  addMonths,
  addYears,
  calendarCells,
  clampDate,
  dateAtMidnight,
  dateKey,
  isDateBetween,
  isValidDate,
  localDate,
  sameDate,
  weekdayLabels,
  weekNumber,
} from './aeris-date-picker.utils';

export type AerisDatePickerSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisDatePickerAppearance = 'outline' | 'filled';
export type AerisDatePickerSelectionMode = 'single' | 'multiple' | 'range';
export type AerisDatePickerView = 'day' | 'month' | 'year';
export type AerisDatePickerDateStyle = 'short' | 'medium' | 'long' | 'full';
export type AerisDatePickerMode = 'date' | 'dateTime' | 'time';
export type AerisDatePickerHourCycle = '12' | '24';

export interface AerisDateRange {
  readonly start: Date | null;
  readonly end: Date | null;
}

export type AerisDatePickerValue = Date | readonly Date[] | AerisDateRange | null;

export interface AerisDatePickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisDatePickerValue;
}

interface AerisRenderedDay {
  readonly date: Date;
  readonly key: string;
  readonly label: string;
  readonly day: number;
  readonly currentMonth: boolean;
  readonly selected: boolean;
  readonly rangeStart: boolean;
  readonly rangeEnd: boolean;
  readonly inRange: boolean;
  readonly disabled: boolean;
  readonly today: boolean;
}

interface AerisRenderedMonth {
  readonly key: string;
  readonly label: string;
  readonly days: readonly AerisRenderedDay[];
  readonly weeks: readonly number[];
}

let datePickerId = 0;

@Component({
  selector: 'aeris-date-picker',
  imports: [ɵAerisIcon, NgTemplateOutlet, ɵAerisAppendTo, ɵAerisDatePickerInput],
  template: `
    <div
      class="aeris-date-picker"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="panelVisible() || null"
      [attr.data-inline]="inline() || null"
      [attr.data-invalid]="displayInvalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
    >
      @if (name() && serializedValue()) {
        <input
          type="hidden"
          [name]="name()"
          [value]="typedError() ? '' : serializedValue()"
          [disabled]="effectiveDisabled()"
        />
      }

      @if (!inline()) {
        <div #control class="aeris-date-picker__control">
          @if (usesEditableField()) {
            @defer (when usesEditableField()) {
              <aeris-internal-date-picker-input
                #datePickerInput
                [inputId]="resolvedInputId()"
                [value]="typedDateValue()"
                [granularity]="view()"
                [locale]="locale()"
                [min]="typedMinimum()"
                [max]="typedMaximum()"
                [dateDisabled]="typedDateDisabled"
                [disabled]="effectiveDisabled()"
                [readonly]="readonly()"
                [required]="required()"
                [invalid]="displayInvalid()"
                [touched]="touched() ?? interactionTouched()"
                [ariaLabel]="ariaLabel() || calendarAriaLabel()"
                [ariaLabelledBy]="ariaLabelledBy()"
                [ariaDescribedBy]="ariaDescribedBy()"
                [size]="size()"
                [appearance]="appearance()"
                (edited)="handleTypedDate($event)"
                (focused)="focused.emit($event)"
                (blurred)="handleEditableBlur($event)"
                (keydown)="handleEditableKeydown($event)"
              />
            } @placeholder {
              <button
                type="button"
                class="aeris-date-picker__trigger"
                disabled
                [id]="resolvedInputId()"
              >
                {{ displayValue() || placeholder() }}
              </button>
            }
            <button
              #trigger
              class="aeris-date-picker__entry-trigger"
              type="button"
              aria-haspopup="dialog"
              [attr.aria-label]="calendarAriaLabel()"
              [attr.aria-expanded]="open()"
              [attr.aria-controls]="panelId"
              [disabled]="effectiveDisabled() || readonly()"
              (click)="toggleFromEntryButton()"
              (blur)="handleEditableBlur($event)"
            >
              @if (showIcon() ? calendarIconTemplate() : dropdownIconTemplate(); as customIcon) {
                <span aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <span
                  class="aeris-date-picker__entry-icon"
                  [class.aeris-date-picker__entry-icon--chevron]="!showIcon()"
                  [aerisInternalIcon]="showIcon() ? 'calendar' : 'chevron'"
                  aria-hidden="true"
                ></span>
              }
            </button>
          } @else {
            <button
              #trigger
              class="aeris-date-picker__trigger"
              type="button"
              role="combobox"
              aria-haspopup="dialog"
              [id]="resolvedInputId()"
              [attr.aria-expanded]="open()"
              [attr.aria-controls]="panelId"
              [attr.aria-label]="ariaLabel() || null"
              [attr.aria-labelledby]="ariaLabelledBy() || null"
              [attr.aria-describedby]="ariaDescribedBy() || null"
              [attr.aria-invalid]="displayInvalid() || null"
              [attr.aria-required]="required() || null"
              [disabled]="effectiveDisabled() || readonly()"
              (click)="toggle()"
              (keydown)="handleTriggerKeydown($event)"
              (focus)="focused.emit($event)"
              (blur)="handleBlur($event)"
            >
              <span
                class="aeris-date-picker__value"
                [class.aeris-date-picker__placeholder]="!displayValue()"
                >{{ displayValue() || placeholder() }}</span
              >
            </button>
          }

          @if (showClearButton()) {
            <button
              class="aeris-date-picker__clear"
              type="button"
              [attr.aria-label]="clearButtonAriaLabel()"
              (click)="handleClearClick($event)"
            >
              @if (clearIconTemplate(); as customIcon) {
                <span aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <span aerisInternalIcon="close" aria-hidden="true"></span>
              }
            </button>
          }

          @if (!usesEditableField()) {
            @if (showIcon()) {
              @if (calendarIconTemplate(); as customIcon) {
                <span
                  class="aeris-date-picker__calendar-icon"
                  aria-hidden="true"
                  data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <span
                  aerisInternalIcon="calendar"
                  class="aeris-date-picker__calendar-icon"
                  aria-hidden="true"
                ></span>
              }
            } @else {
              @if (dropdownIconTemplate(); as customIcon) {
                <span class="aeris-date-picker__chevron" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <span
                  aerisInternalIcon="chevron"
                  class="aeris-date-picker__chevron"
                  aria-hidden="true"
                ></span>
              }
            }
          }
        </div>
      }

      @if (panelVisible()) {
        <div
          #panelRoot
          class="aeris-date-picker__panel"
          [aerisInternalAppendTo]="inline() ? 'self' : appendTo()"
          [aerisInternalAppendToDismiss]="inline() ? null : dismissOverlay"
          [aerisInternalAppendToAnchor]="this.control()?.nativeElement ?? null"
          [aerisInternalAppendToCollisionPadding]="viewportMargin()"
          (aerisInternalAppendToOutside)="close(false)"
          [id]="panelId"
          role="dialog"
          aria-modal="false"
          [attr.aria-label]="panelAriaLabel()"
          (keydown)="handlePanelKeydown($event)"
          (focusout)="handlePanelFocusOut($event)"
        >
          @if (!timeOnly()) {
            <div class="aeris-date-picker__header">
              <button
                class="aeris-date-picker__nav aeris-date-picker__nav--previous"
                type="button"
                [attr.aria-label]="previousButtonAriaLabel()"
                [disabled]="previousDisabled()"
                (click)="navigate(-1)"
              >
                @if (previousIconTemplate(); as customIcon) {
                  <span aria-hidden="true" data-aeris-custom-icon
                    ><ng-container [ngTemplateOutlet]="customIcon"
                  /></span>
                } @else {
                  <span aerisInternalIcon="chevron" aria-hidden="true"></span>
                }
              </button>

              <div class="aeris-date-picker__heading">
                @if (panelView() === 'day') {
                  <button type="button" (click)="showMonthView()">
                    {{ visibleMonthLabel() }}
                  </button>
                  <button type="button" (click)="showYearView()">
                    {{ visibleYear() }}
                  </button>
                } @else if (panelView() === 'month') {
                  <span>{{ visibleYear() }}</span>
                } @else {
                  <span>{{ yearRangeLabel() }}</span>
                }
              </div>

              <button
                class="aeris-date-picker__nav aeris-date-picker__nav--next"
                type="button"
                [attr.aria-label]="nextButtonAriaLabel()"
                [disabled]="nextDisabled()"
                (click)="navigate(1)"
              >
                @if (nextIconTemplate(); as customIcon) {
                  <span aria-hidden="true" data-aeris-custom-icon
                    ><ng-container [ngTemplateOutlet]="customIcon"
                  /></span>
                } @else {
                  <span aerisInternalIcon="chevron" aria-hidden="true"></span>
                }
              </button>
            </div>

            @if (panelView() === 'day') {
              <div
                class="aeris-date-picker__months"
                [style.--aeris-date-picker-month-count]="visibleMonthCount()"
              >
                @for (month of renderedMonths(); track month.key) {
                  <section class="aeris-date-picker__month" [attr.aria-label]="month.label">
                    @if (visibleMonthCount() > 1) {
                      <h3>{{ month.label }}</h3>
                    }
                    <div class="aeris-date-picker__weekdays" aria-hidden="true">
                      @if (showWeekNumbers()) {
                        <span class="aeris-date-picker__week-label">Wk</span>
                      }
                      @for (weekday of weekdays(); track $index) {
                        <span>{{ weekday }}</span>
                      }
                    </div>
                    <div class="aeris-date-picker__calendar" role="grid">
                      @for (week of [0, 1, 2, 3, 4, 5]; track week) {
                        <div class="aeris-date-picker__week" role="row">
                          @if (showWeekNumbers()) {
                            <span class="aeris-date-picker__week-number" role="rowheader">
                              {{ month.weeks[week] }}
                            </span>
                          }
                          @for (day of month.days.slice(week * 7, week * 7 + 7); track day.key) {
                            <button
                              #dayButton
                              class="aeris-date-picker__day"
                              type="button"
                              role="gridcell"
                              [attr.data-date]="day.key"
                              [attr.aria-label]="day.label"
                              [attr.aria-selected]="day.selected"
                              [attr.aria-current]="day.today ? 'date' : null"
                              [attr.data-other-month]="!day.currentMonth || null"
                              [attr.data-selected]="day.selected || null"
                              [attr.data-range-start]="day.rangeStart || null"
                              [attr.data-range-end]="day.rangeEnd || null"
                              [attr.data-in-range]="day.inRange || null"
                              [attr.data-today]="day.today || null"
                              [disabled]="day.disabled"
                              [tabindex]="sameActiveDate(day.date) ? 0 : -1"
                              (click)="selectDay(day, $event)"
                              (focus)="activeDate.set(day.date)"
                              (keydown)="handleDayKeydown($event, day.date)"
                            >
                              {{ day.day }}
                            </button>
                          }
                        </div>
                      }
                    </div>
                  </section>
                }
              </div>
            } @else if (panelView() === 'month') {
              <div class="aeris-date-picker__choice-grid" role="listbox" aria-label="Choose month">
                @for (month of monthChoices(); track month.value; let index = $index) {
                  <button
                    #choiceButton
                    type="button"
                    role="option"
                    [attr.aria-selected]="month.selected"
                    [attr.data-selected]="month.selected || null"
                    [disabled]="month.disabled"
                    [tabindex]="choiceIndex() === index ? 0 : -1"
                    (click)="selectMonth(month.value, $event)"
                    (keydown)="handleChoiceKeydown($event, index)"
                  >
                    {{ month.label }}
                  </button>
                }
              </div>
            } @else {
              <div class="aeris-date-picker__choice-grid" role="listbox" aria-label="Choose year">
                @for (year of yearChoices(); track year.value; let index = $index) {
                  <button
                    #choiceButton
                    type="button"
                    role="option"
                    [attr.aria-selected]="year.selected"
                    [attr.data-selected]="year.selected || null"
                    [disabled]="year.disabled"
                    [tabindex]="choiceIndex() === index ? 0 : -1"
                    (click)="selectYear(year.value, $event)"
                    (keydown)="handleChoiceKeydown($event, index)"
                  >
                    {{ year.value }}
                  </button>
                }
              </div>
            }
          }

          @if (showsTimeControls()) {
            <div
              class="aeris-date-picker__time"
              role="group"
              [attr.aria-label]="timeAriaLabel()"
              [attr.data-time-only]="timeOnly() || null"
            >
              <label class="aeris-date-picker__time-field">
                <span>{{ hourLabel() }}</span>
                <input
                  #hourInput
                  type="number"
                  inputmode="numeric"
                  [min]="hourMinimum()"
                  [max]="hourMaximum()"
                  step="1"
                  [value]="timeDisplayParts().hour"
                  [disabled]="effectiveDisabled()"
                  (input)="handleHourInput($event)"
                />
              </label>

              <span class="aeris-date-picker__time-separator" aria-hidden="true">:</span>

              <label class="aeris-date-picker__time-field">
                <span>{{ minuteLabel() }}</span>
                <input
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="59"
                  [step]="normalizedMinuteStep()"
                  [value]="timeDisplayParts().minute"
                  [disabled]="effectiveDisabled()"
                  (input)="handleMinuteInput($event)"
                />
              </label>

              @if (showSeconds()) {
                <span class="aeris-date-picker__time-separator" aria-hidden="true">:</span>

                <label class="aeris-date-picker__time-field">
                  <span>{{ secondLabel() }}</span>
                  <input
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="59"
                    [step]="normalizedSecondStep()"
                    [value]="timeDisplayParts().second"
                    [disabled]="effectiveDisabled()"
                    (input)="handleSecondInput($event)"
                  />
                </label>
              }

              @if (hourCycle() === '12') {
                <label class="aeris-date-picker__time-field aeris-date-picker__time-field--period">
                  <span>{{ periodLabel() }}</span>
                  <select
                    [value]="timePeriod()"
                    [disabled]="effectiveDisabled()"
                    (change)="handlePeriodChange($event)"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              }
            </div>
          }

          @if (showButtonBar()) {
            <div class="aeris-date-picker__footer">
              @if (!timeOnly()) {
                <button type="button" [disabled]="todayDisabled()" (click)="selectToday($event)">
                  {{ todayLabel() }}
                </button>
              }
              <button type="button" [disabled]="!hasValue()" (click)="clear()">
                {{ clearLabel() }}
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-date-picker.scss',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AerisDatePicker), multi: true },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisDatePicker),
      multi: true,
    },
  ],
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-inline]': 'inline() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisDatePicker implements ControlValueAccessor, Validator {
  readonly clearIconTemplate = input<TemplateRef<void>>();
  readonly calendarIconTemplate = input<TemplateRef<void>>();
  readonly dropdownIconTemplate = input<TemplateRef<void>>();
  readonly previousIconTemplate = input<TemplateRef<void>>();
  readonly nextIconTemplate = input<TemplateRef<void>>();

  protected readonly dismissOverlay = (): boolean => {
    if (this.inline()) return false;
    this.close(true);
    return true;
  };

  readonly value = model<AerisDatePickerValue>(null);
  readonly selectionMode = input<AerisDatePickerSelectionMode>('single');
  readonly view = input<AerisDatePickerView>('day');
  readonly editable = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly mode = input<AerisDatePickerMode>('date');
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Choose a date');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly calendarAriaLabel = input('Choose a date');
  readonly timeAriaLabel = input('Choose a time');
  readonly size = input<AerisDatePickerSize>('md');
  readonly appearance = input<AerisDatePickerAppearance>('outline');
  readonly locale = input('en-US');
  readonly dateStyle = input<AerisDatePickerDateStyle>('medium');
  readonly hourCycle = input<AerisDatePickerHourCycle>('24');
  readonly showSeconds = input(false, { transform: booleanAttribute });
  readonly minuteStep = input(1, { transform: numberAttribute });
  readonly secondStep = input(1, { transform: numberAttribute });
  readonly firstDayOfWeek = input<number | null>(null);
  readonly minDate = input<Date>();
  readonly maxDate = input<Date>();
  readonly disabledDates = input<readonly Date[]>([]);
  readonly disabledDays = input<readonly number[]>([]);
  readonly dateDisabled = input<((date: Date) => boolean) | null>(null);
  readonly numberOfMonths = input(1, { transform: numberAttribute });
  readonly showOtherMonths = input(true, { transform: booleanAttribute });
  readonly selectOtherMonths = input(true, { transform: booleanAttribute });
  readonly showWeekNumbers = input(false, { transform: booleanAttribute });
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  readonly showIcon = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly inline = input(false, { transform: booleanAttribute });
  readonly appendTo = input<AerisAppendTo>();
  readonly viewportMargin = input<number | AerisOverlayCollisionPadding>(8);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(
    () =>
      ɵaerisDisplayInvalid(this.invalid(), this.touched()) ||
      Boolean(this.typedError() && (this.touched() ?? this.interactionTouched())),
  );
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly todayLabel = input('Today');
  readonly clearLabel = input('Clear');
  readonly hourLabel = input('Hour');
  readonly minuteLabel = input('Minute');
  readonly secondLabel = input('Second');
  readonly periodLabel = input('Period');
  readonly clearButtonAriaLabel = input('Clear date');
  readonly previousButtonAriaLabel = input('Previous period');
  readonly nextButtonAriaLabel = input('Next period');

  readonly changed = output<AerisDatePickerChangeEvent>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly monthChanged = output<Date>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly open = signal(false);
  protected readonly formDisabled = signal(false);
  protected readonly interactionTouched = signal(false);
  protected readonly usesEditableField = computed(
    () =>
      this.editable() &&
      !this.inline() &&
      this.selectionMode() === 'single' &&
      this.mode() === 'date',
  );
  protected readonly typedDateValue = computed(() => {
    const value = this.value();
    return isValidDate(value) ? dateKey(value) : null;
  });
  protected readonly typedMinimum = computed(() =>
    this.minDate() ? dateKey(this.minDate()!) : null,
  );
  protected readonly typedMaximum = computed(() =>
    this.maxDate() ? dateKey(this.maxDate()!) : null,
  );
  private readonly initialTypedState = linkedSignal<
    Pick<AerisDatePickerInputEditEvent, 'value' | 'error'>
  >(() => ({ value: this.typedDateValue(), error: null }));
  private readonly typedParser = signal<TransformedValueSignal<
    Pick<AerisDatePickerInputEditEvent, 'value' | 'error'>
  > | null>(null);
  private get typedDateState(): WritableSignal<
    Pick<AerisDatePickerInputEditEvent, 'value' | 'error'>
  > {
    return this.typedParser() ?? this.initialTypedState;
  }
  private readonly createTypedParser = () =>
    transformedValue(this.value, {
      format: (value) => ({
        value: isValidDate(value) ? dateKey(value) : null,
        error: null as AerisDatePickerInputEditEvent['error'],
      }),
      parse: (state: Pick<AerisDatePickerInputEditEvent, 'value' | 'error'>) => {
        if (state.error === 'required') return { error: { kind: 'dateRequired' } };
        if (state.error) return { error: { kind: `date${state.error}` } };
        if (state.value === null) return { value: null };
        const parts = aerisInternalParseDateParts(state.value);
        const date = parts
          ? aerisInternalDateFromParts(
              parts,
              this.mode() === 'dateTime' ? this.timeValue() : undefined,
            )
          : null;
        const current = this.value();
        return date
          ? { value: isValidDate(current) && current.getTime() === date.getTime() ? current : date }
          : { error: { kind: 'dateInvalid' } };
      },
    });
  protected readonly typedError = computed(
    () => this.usesEditableField() && Boolean(this.typedParser()?.parseErrors().length),
  );
  protected readonly typedDateDisabled = (value: string): boolean => {
    const parts = aerisInternalParseDateParts(value);
    const date = parts
      ? aerisInternalDateFromParts(parts, this.mode() === 'dateTime' ? this.timeValue() : undefined)
      : null;
    return !date || this.isDisabled(date);
  };
  protected readonly visibleDate = signal(
    localDate(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  protected readonly activeDate = signal(dateAtMidnight(new Date()));
  protected readonly panelView = signal<AerisDatePickerView>('day');
  protected readonly choiceIndex = signal(0);
  private readonly fallbackTime = signal<AerisTimeValue>(timeFromDate(new Date()));
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly panelVisible = computed(() => this.inline() || this.open());
  protected readonly timeOnly = computed(() => this.mode() === 'time');
  protected readonly showsTimeControls = computed(() => this.mode() !== 'date');
  protected readonly panelAriaLabel = computed(() =>
    this.timeOnly() ? this.timeAriaLabel() : this.calendarAriaLabel(),
  );
  protected readonly resolvedFirstDay = computed(
    () => this.firstDayOfWeek() ?? aerisInternalLocaleFirstDay(this.locale()),
  );
  protected readonly weekdays = computed(() =>
    weekdayLabels(this.locale(), this.resolvedFirstDay()),
  );
  protected readonly visibleMonthCount = computed(() =>
    Math.max(1, Math.min(3, Math.trunc(this.numberOfMonths()) || 1)),
  );
  protected readonly renderedMonths = computed<readonly AerisRenderedMonth[]>(() =>
    Array.from({ length: this.visibleMonthCount() }, (_, index) => {
      const monthDate = addMonths(this.visibleDate(), index);
      const days = calendarCells(monthDate, this.resolvedFirstDay(), this.locale()).map((cell) =>
        this.renderDay(cell),
      );
      return {
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        label: new Intl.DateTimeFormat(this.locale(), {
          month: 'long',
          year: 'numeric',
        }).format(monthDate),
        days,
        weeks: Array.from({ length: 6 }, (_, week) =>
          weekNumber(days[week * 7]?.date ?? monthDate),
        ),
      };
    }),
  );
  protected readonly visibleMonthLabel = computed(() =>
    new Intl.DateTimeFormat(this.locale(), { month: 'long' }).format(this.visibleDate()),
  );
  protected readonly visibleYear = computed(() => this.visibleDate().getFullYear());
  protected readonly yearRangeStart = computed(() => Math.floor(this.visibleYear() / 12) * 12);
  protected readonly yearRangeLabel = computed(
    () => `${this.yearRangeStart()}–${this.yearRangeStart() + 11}`,
  );
  protected readonly monthChoices = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'short' });
    return Array.from({ length: 12 }, (_, month) => {
      const date = localDate(this.visibleYear(), month, 1);
      return {
        value: month,
        label: formatter.format(date),
        selected: this.selectedDates().some(
          (selected) =>
            selected.getFullYear() === date.getFullYear() && selected.getMonth() === month,
        ),
        disabled:
          this.view() === 'month'
            ? this.isDisabled(date)
            : !this.periodHasEnabledDate(date, 'month'),
      };
    });
  });
  protected readonly yearChoices = computed(() =>
    Array.from({ length: 12 }, (_, index) => {
      const value = this.yearRangeStart() + index;
      return {
        value,
        selected: this.selectedDates().some((selected) => selected.getFullYear() === value),
        disabled:
          this.view() === 'year'
            ? this.isDisabled(localDate(value, 0, 1))
            : !this.periodHasEnabledDate(localDate(value, 0, 1), 'year'),
      };
    }),
  );
  protected readonly previousDisabled = computed(() => this.timeOnly() || !this.canNavigate(-1));
  protected readonly nextDisabled = computed(() => this.timeOnly() || !this.canNavigate(1));
  protected readonly hasValue = computed(() => this.selectedDates().length > 0);
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      (this.hasValue() || this.typedError()) &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );
  protected readonly todayDisabled = computed(() => this.isDisabled(new Date()));
  protected readonly displayValue = computed(() => this.formatValue(this.value()));
  protected readonly serializedValue = computed(() => this.serializeValue(this.value()));
  protected readonly normalizedMinuteStep = computed(() => this.normalizeStep(this.minuteStep()));
  protected readonly normalizedSecondStep = computed(() => this.normalizeStep(this.secondStep()));
  protected readonly hourMinimum = computed(() => (this.hourCycle() === '12' ? 1 : 0));
  protected readonly hourMaximum = computed(() => (this.hourCycle() === '12' ? 12 : 23));
  protected readonly timeValue = computed(() => {
    const value = this.value();
    return isValidDate(value) ? timeFromDate(value) : this.fallbackTime();
  });
  protected readonly timePeriod = computed(() => (this.timeValue().hours >= 12 ? 'PM' : 'AM'));
  protected readonly timeDisplayParts = computed(() => {
    const time = this.timeValue();
    const hour = this.hourCycle() === '12' ? toTwelveHour(time.hours) : time.hours;
    return {
      hour: String(hour).padStart(2, '0'),
      minute: String(time.minutes).padStart(2, '0'),
      second: String(time.seconds).padStart(2, '0'),
    };
  });

  protected readonly panelId = `aeris-date-picker-panel-${++datePickerId}`;
  protected readonly resolvedInputId = computed(() => this.inputId() || `${this.panelId}-trigger`);

  protected readonly control = viewChild<ElementRef<HTMLElement>>('control');
  protected readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly datePickerInput = viewChild<ɵAerisDatePickerInput>('datePickerInput');
  private readonly panelRoot = viewChild<ElementRef<HTMLElement>>('panelRoot');
  private readonly panelPortal = viewChild(ɵAerisAppendTo);
  private readonly hourInput = viewChild<ElementRef<HTMLInputElement>>('hourInput');
  private readonly dayButtons = viewChildren<ElementRef<HTMLButtonElement>>('dayButton');
  private readonly choiceButtons = viewChildren<ElementRef<HTMLButtonElement>>('choiceButton');
  private readonly injector = inject(Injector);
  private onChange: (value: AerisDatePickerValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private onValidatorChange: () => void = () => undefined;
  private returnFocusTo: HTMLElement | null = null;

  ngOnInit(): void {
    this.typedParser.set(runInInjectionContext(this.injector, this.createTypedParser));
  }

  constructor() {
    effect(() => {
      if (this.readonly() || this.effectiveDisabled()) untracked(() => this.close(false));
    });
    effect(() => {
      const field = this.datePickerInput();
      const error = field?.validationError();
      const value = this.typedDateValue();
      if (field && this.usesEditableField())
        untracked(() => {
          this.typedDateState.set({ value: value ?? null, error: error ?? null });
          this.onValidatorChange();
        });
    });
  }
  validate(): ValidationErrors | null {
    return this.typedError() ? { aerisDate: true } : null;
  }
  registerOnValidatorChange(callback: () => void): void {
    this.onValidatorChange = callback;
  }

  writeValue(value: unknown): void {
    const normalized = this.normalizeValue(value);
    this.value.set(normalized);
    this.datePickerInput()?.writeValue(isValidDate(normalized) ? dateKey(normalized) : null);
    const first = this.datesFromValue(normalized)[0];
    if (first) this.syncVisibleDate(first);
  }

  registerOnChange(callback: (value: AerisDatePickerValue) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) this.close(false);
  }

  focus(options?: FocusOptions): void {
    if (this.usesEditableField()) this.datePickerInput()?.focus(options);
    else this.trigger()?.nativeElement.focus(options);
  }

  openPanel(): void {
    if (this.effectiveDisabled() || this.readonly() || this.inline() || this.open()) return;
    const active = this.control()?.nativeElement.ownerDocument.activeElement;
    this.returnFocusTo =
      active instanceof HTMLElement && this.control()?.nativeElement.contains(active)
        ? active
        : null;
    const initial =
      this.selectedDates()[0] ?? clampDate(new Date(), this.minDate(), this.maxDate());
    this.activeDate.set(initial);
    this.syncVisibleDate(initial);
    const initialView = this.timeOnly() ? 'day' : this.view();
    this.panelView.set(initialView);
    this.open.set(true);
    this.opened.emit();
    if (this.timeOnly()) {
      this.scheduleTimeFocus();
    } else if (initialView === 'day') {
      this.scheduleActiveDayFocus();
    } else {
      this.prepareChoiceFocus(initialView);
    }
  }

  close(restoreFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    this.panelPortal()?.restore();
    this.closed.emit();
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (restoreFocus)
      queueMicrotask(() => {
        if (this.open()) return;
        if (target?.isConnected) target.focus();
        else this.focus();
      });
  }

  toggle(): void {
    if (this.open()) this.close(false);
    else this.openPanel();
  }
  protected toggleFromEntryButton(): void {
    this.toggle();
    if (this.open()) this.returnFocusTo = this.trigger()?.nativeElement ?? null;
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly() || (!this.hasValue() && !this.typedError()))
      return;
    this.setValue(null);
    this.cleared.emit();
    if (!this.inline()) queueMicrotask(() => this.focus());
  }

  reset(): void {
    if (this.effectiveDisabled()) return;
    this.setValue(null);
    this.close(false);
  }

  protected sameActiveDate(date: Date): boolean {
    return sameDate(this.activeDate(), date);
  }

  protected selectDay(day: AerisRenderedDay, event: Event): void {
    if (day.disabled) return;
    this.selectDate(day.date, event);
  }

  protected selectMonth(month: number, event: Event): void {
    const date = localDate(this.visibleYear(), month, 1);
    this.visibleDate.set(date);
    this.activeDate.set(date);
    if (this.view() === 'month') this.selectDate(date, event);
    else {
      this.panelView.set('day');
      this.scheduleActiveDayFocus();
    }
  }

  protected selectYear(year: number, event: Event): void {
    const date = localDate(year, this.view() === 'year' ? 0 : this.visibleDate().getMonth(), 1);
    this.visibleDate.set(date);
    this.activeDate.set(date);
    if (this.view() === 'year') this.selectDate(date, event);
    else {
      this.panelView.set('month');
      this.prepareChoiceFocus('month');
    }
  }

  protected showMonthView(): void {
    this.panelView.set('month');
    this.prepareChoiceFocus('month');
  }

  protected showYearView(): void {
    this.panelView.set('year');
    this.prepareChoiceFocus('year');
  }

  protected navigate(direction: -1 | 1): void {
    if (!this.canNavigate(direction)) return;
    const view = this.panelView();
    const next =
      view === 'year'
        ? addYears(this.visibleDate(), direction * 12)
        : view === 'month'
          ? addYears(this.visibleDate(), direction)
          : addMonths(this.visibleDate(), direction);
    this.visibleDate.set(next);
    this.monthChanged.emit(next);
    if (view !== 'day') this.prepareChoiceFocus(view);
  }

  protected selectToday(event: Event): void {
    if (!this.todayDisabled()) this.selectDate(new Date(), event);
  }

  protected handleClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clear();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.openPanel();
    } else if (event.key === 'Escape') {
      if (this.open()) {
        event.preventDefault();
        event.stopPropagation();
        this.close(false);
      }
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !this.inline()) {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    }
  }

  protected handlePanelFocusOut(event: FocusEvent): void {
    if (this.inline()) return;
    const panel = event.currentTarget as HTMLElement;
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      (panel.contains(nextTarget) || this.control()?.nativeElement.contains(nextTarget))
    ) {
      return;
    }

    // Switching between day, month, and year views removes the focused control before the
    // replacement view receives focus. Browsers report that transient destination inconsistently
    // as null or document.body, so verify the final focus location after the render completes.
    afterNextRender(
      () => {
        panel.ownerDocument.defaultView?.requestAnimationFrame(() => {
          if (!panel.isConnected || !this.open()) return;
          const activeElement = panel.ownerDocument.activeElement;
          if (
            activeElement instanceof Node &&
            (panel.contains(activeElement) ||
              Boolean(this.control()?.nativeElement.contains(activeElement)))
          ) {
            return;
          }
          if (this.usesEditableField()) this.handleBlur(event);
          this.close(false);
        });
      },
      { injector: this.injector },
    );
  }

  protected handleDayKeydown(event: KeyboardEvent, date: Date): void {
    let target: Date | null = null;
    if (event.key === 'ArrowLeft') target = addDays(date, -1);
    else if (event.key === 'ArrowRight') target = addDays(date, 1);
    else if (event.key === 'ArrowUp') target = addDays(date, -7);
    else if (event.key === 'ArrowDown') target = addDays(date, 7);
    else if (event.key === 'Home') {
      target = addDays(date, -((date.getDay() - this.resolvedFirstDay() + 7) % 7));
    } else if (event.key === 'End') {
      target = addDays(date, 6 - ((date.getDay() - this.resolvedFirstDay() + 7) % 7));
    } else if (event.key === 'PageUp') {
      target = event.shiftKey ? addYears(date, -1) : addMonths(date, -1);
    } else if (event.key === 'PageDown') {
      target = event.shiftKey ? addYears(date, 1) : addMonths(date, 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isDisabled(date)) this.selectDate(date, event);
      return;
    }

    if (!target) return;
    event.preventDefault();
    this.moveActiveDate(target);
  }

  protected handleChoiceKeydown(event: KeyboardEvent, currentIndex: number): void {
    let targetIndex: number | null = null;
    if (event.key === 'ArrowLeft') targetIndex = currentIndex - 1;
    else if (event.key === 'ArrowRight') targetIndex = currentIndex + 1;
    else if (event.key === 'ArrowUp') targetIndex = currentIndex - 3;
    else if (event.key === 'ArrowDown') targetIndex = currentIndex + 3;
    else if (event.key === 'Home') targetIndex = 0;
    else if (event.key === 'End') targetIndex = 11;
    else if (event.key === 'PageUp') {
      event.preventDefault();
      this.navigate(-1);
      return;
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      this.navigate(1);
      return;
    }

    if (targetIndex === null) return;
    event.preventDefault();
    this.moveChoiceFocus(targetIndex);
  }

  protected handleHourInput(event: Event): void {
    const rawValue = this.numberFromEvent(event);
    if (rawValue === null) return;
    const displayHour = this.clamp(rawValue, this.hourMinimum(), this.hourMaximum());
    const hours =
      this.hourCycle() === '12' ? fromTwelveHour(displayHour, this.timePeriod()) : displayHour;
    this.updateTime({ ...this.timeValue(), hours }, event);
  }

  protected handleMinuteInput(event: Event): void {
    const rawValue = this.numberFromEvent(event);
    if (rawValue === null) return;
    this.updateTime({ ...this.timeValue(), minutes: this.clamp(rawValue, 0, 59) }, event);
  }

  protected handleSecondInput(event: Event): void {
    const rawValue = this.numberFromEvent(event);
    if (rawValue === null) return;
    this.updateTime({ ...this.timeValue(), seconds: this.clamp(rawValue, 0, 59) }, event);
  }

  protected handlePeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const period = select?.value === 'PM' ? 'PM' : 'AM';
    const displayHour = toTwelveHour(this.timeValue().hours);
    this.updateTime({ ...this.timeValue(), hours: fromTwelveHour(displayHour, period) }, event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.interactionTouched.set(true);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  protected handleEditableKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.openPanel();
    } else if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close(false);
    }
  }
  protected handleEditableBlur(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (
      next instanceof Node &&
      (this.control()?.nativeElement.contains(next) ||
        this.panelRoot()?.nativeElement.contains(next))
    )
      return;
    this.handleBlur(event);
  }
  protected handleTypedDate(event: AerisDatePickerInputEditEvent): void {
    if (event.originalEvent.type === 'invalid') {
      this.interactionTouched.set(true);
      this.onTouched();
      this.touch.emit();
    }
    const previous = this.value();
    if (event.error === 'required') this.value.set(null);
    this.typedDateState.set(event);
    this.onValidatorChange();
    if (event.error && event.error !== 'required') return;
    const value = this.value();
    if (
      (isValidDate(previous) && isValidDate(value) && previous.getTime() === value.getTime()) ||
      (previous === null && value === null)
    )
      return;
    this.onChange(value);
    if (isValidDate(value)) {
      this.activeDate.set(value);
      this.syncVisibleDate(value);
    }
    this.changed.emit({ originalEvent: event.originalEvent, value });
  }

  private selectDate(date: Date, event: Event): void {
    const normalized = dateAtMidnight(date);
    if (this.view() === 'year') normalized.setMonth(0, 1);
    else if (this.view() === 'month') normalized.setDate(1);
    if (this.isDisabled(normalized)) return;

    let next: AerisDatePickerValue;
    if (this.selectionMode() === 'multiple') {
      const current = this.selectedDates();
      next = current.some((selected) => sameDate(selected, normalized))
        ? current.filter((selected) => !sameDate(selected, normalized))
        : [...current, normalized].sort((left, right) => left.getTime() - right.getTime());
    } else if (this.selectionMode() === 'range') {
      const range = this.rangeValue();
      if (!range.start || range.end) {
        next = { start: normalized, end: null };
      } else if (normalized < range.start) {
        next = { start: normalized, end: range.start };
      } else {
        next = { start: range.start, end: normalized };
      }
    } else {
      next = this.mode() === 'dateTime' ? this.withTime(normalized, this.timeValue()) : normalized;
    }

    this.activeDate.set(normalized);
    this.syncVisibleDate(normalized);
    this.setValue(next);
    this.changed.emit({ originalEvent: event, value: next });

    const rangeComplete =
      this.selectionMode() !== 'range' || Boolean(this.rangeValueFrom(next).end);
    if (
      !this.inline() &&
      this.closeOnSelect() &&
      this.selectionMode() !== 'multiple' &&
      this.mode() !== 'dateTime' &&
      rangeComplete
    ) {
      this.close(true);
    }
  }

  private setValue(value: AerisDatePickerValue): void {
    this.value.set(value);
    if (this.usesEditableField()) {
      const date = isValidDate(value) ? dateKey(value) : null;
      this.typedDateState.set({ value: date, error: null });
      this.datePickerInput()?.writeValue(date);
    }
    this.onChange(value);
  }

  private selectedDates(): readonly Date[] {
    return this.datesFromValue(this.value());
  }

  private datesFromValue(value: AerisDatePickerValue): readonly Date[] {
    if (isValidDate(value)) return [value];
    if (Array.isArray(value)) return value.filter(isValidDate);
    if (this.isRange(value)) {
      return [value.start, value.end].filter(isValidDate);
    }
    return [];
  }

  private rangeValue(): AerisDateRange {
    return this.rangeValueFrom(this.value());
  }

  private rangeValueFrom(value: AerisDatePickerValue): AerisDateRange {
    return this.isRange(value) ? value : { start: null, end: null };
  }

  private isRange(value: unknown): value is AerisDateRange {
    return Boolean(
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      'start' in value &&
      'end' in value,
    );
  }

  private normalizeValue(value: unknown): AerisDatePickerValue {
    if (isValidDate(value)) {
      return this.mode() === 'date' ? dateAtMidnight(value) : new Date(value);
    }
    if (Array.isArray(value)) {
      return value.filter(isValidDate).map(dateAtMidnight);
    }
    if (this.isRange(value)) {
      return {
        start: isValidDate(value.start) ? dateAtMidnight(value.start) : null,
        end: isValidDate(value.end) ? dateAtMidnight(value.end) : null,
      };
    }
    return null;
  }

  private renderDay(cell: ReturnType<typeof calendarCells>[number]): AerisRenderedDay {
    const range = this.rangeValue();
    const selected = this.selectedDates().some((date) => sameDate(date, cell.date));
    const visible = cell.currentMonth || this.showOtherMonths();
    return {
      ...cell,
      selected,
      rangeStart: sameDate(range.start, cell.date),
      rangeEnd: sameDate(range.end, cell.date),
      inRange: isDateBetween(cell.date, range.start, range.end),
      disabled:
        !visible || (!cell.currentMonth && !this.selectOtherMonths()) || this.isDisabled(cell.date),
      today: sameDate(new Date(), cell.date),
    };
  }

  private isDisabled(date: Date): boolean {
    const normalized = dateAtMidnight(date);
    const min = this.minDate();
    const max = this.maxDate();
    return Boolean(
      (this.view() === 'day' && min && normalized < dateAtMidnight(min)) ||
      (this.view() === 'day' && max && normalized > dateAtMidnight(max)) ||
      (this.view() !== 'day' &&
        !this.periodHasEnabledDate(normalized, this.view() === 'year' ? 'year' : 'month')) ||
      this.disabledDays().includes(normalized.getDay()) ||
      this.disabledDates().some((disabled) => sameDate(disabled, normalized)) ||
      this.dateDisabled()?.(normalized),
    );
  }

  private periodHasEnabledDate(date: Date, period: 'month' | 'year'): boolean {
    const start =
      period === 'year'
        ? localDate(date.getFullYear(), 0, 1)
        : localDate(date.getFullYear(), date.getMonth(), 1);
    const end =
      period === 'year'
        ? localDate(date.getFullYear(), 11, 31)
        : localDate(date.getFullYear(), date.getMonth() + 1, 0);
    const min = this.minDate() ? dateAtMidnight(this.minDate()!) : null;
    const max = this.maxDate() ? dateAtMidnight(this.maxDate()!) : null;
    return !(max && start > max) && !(min && end < min);
  }

  private formatValue(value: AerisDatePickerValue): string {
    const dateOptions: Intl.DateTimeFormatOptions =
      this.view() === 'year'
        ? { year: 'numeric' }
        : this.view() === 'month'
          ? { year: 'numeric', month: 'long' }
          : { dateStyle: this.dateStyle() };
    const dateFormatter = new Intl.DateTimeFormat(this.locale(), dateOptions);
    const timeFormatter = new Intl.DateTimeFormat(this.locale(), {
      hour: '2-digit',
      minute: '2-digit',
      second: this.showSeconds() ? '2-digit' : undefined,
      hourCycle: this.hourCycle() === '12' ? 'h12' : 'h23',
    });
    if (isValidDate(value)) {
      if (this.mode() === 'time') return timeFormatter.format(value);
      if (this.mode() === 'dateTime') {
        return `${dateFormatter.format(value)} ${timeFormatter.format(value)}`;
      }
      return dateFormatter.format(value);
    }
    if (Array.isArray(value))
      return value
        .filter(isValidDate)
        .map((date) => dateFormatter.format(date))
        .join(', ');
    if (this.isRange(value)) {
      if (!value.start) return '';
      return value.end
        ? `${dateFormatter.format(value.start)} - ${dateFormatter.format(value.end)}`
        : `${dateFormatter.format(value.start)} -`;
    }
    return '';
  }

  private serializeValue(value: AerisDatePickerValue): string {
    if (isValidDate(value)) {
      if (this.mode() === 'time') return this.timeKey(value);
      if (this.mode() === 'dateTime') {
        return `${dateKey(value)}T${this.timeKey(value)}`;
      }
      return dateKey(value);
    }
    return this.selectedDates()
      .map((date) => dateKey(date))
      .join(',');
  }

  private updateTime(time: AerisTimeValue, event: Event): void {
    const normalized = {
      hours: this.clamp(time.hours, 0, 23),
      minutes: this.clamp(time.minutes, 0, 59),
      seconds: this.clamp(time.seconds, 0, 59),
    };
    this.fallbackTime.set(normalized);
    const next = this.withTime(this.singleDateBase(), normalized);
    this.setValue(next);
    this.changed.emit({ originalEvent: event, value: next });
  }

  private singleDateBase(): Date {
    const value = this.value();
    if (isValidDate(value)) return dateAtMidnight(value);
    return dateAtMidnight(this.activeDate());
  }

  private withTime(date: Date, time: AerisTimeValue): Date {
    const result = dateAtMidnight(date);
    result.setHours(time.hours, time.minutes, this.showSeconds() ? time.seconds : 0, 0);
    return result;
  }

  private timeKey(date: Date): string {
    return aerisInternalFormatTimeParts(timeFromDate(date), this.showSeconds());
  }

  private numberFromEvent(event: Event): number | null {
    const inputElement = event.target as HTMLInputElement | null;
    const rawValue = inputElement?.value;
    if (!rawValue?.trim()) return null;
    const value = Number(rawValue);
    return Number.isFinite(value) ? Math.trunc(value) : null;
  }

  private normalizeStep(value: number): number {
    return this.clamp(Math.trunc(value) || 1, 1, 59);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private canNavigate(direction: -1 | 1): boolean {
    const view = this.panelView();
    const target =
      view === 'year'
        ? addYears(this.visibleDate(), direction * 12)
        : view === 'month'
          ? addYears(this.visibleDate(), direction)
          : addMonths(this.visibleDate(), direction);
    return view === 'year'
      ? this.periodHasEnabledDate(target, 'year')
      : this.periodHasEnabledDate(target, view === 'month' ? 'year' : 'month');
  }

  private moveActiveDate(target: Date): void {
    let candidate = clampDate(target, this.minDate(), this.maxDate());
    const direction = candidate < this.activeDate() ? -1 : 1;
    for (let attempts = 0; attempts < 366 && this.isDisabled(candidate); attempts += 1) {
      candidate = addDays(candidate, direction);
    }
    this.activeDate.set(candidate);
    this.syncVisibleDate(candidate);
    this.scheduleActiveDayFocus();
  }

  private syncVisibleDate(date: Date): void {
    const firstVisible = this.visibleDate();
    const lastVisible = addMonths(firstVisible, this.visibleMonthCount() - 1);
    const month = localDate(date.getFullYear(), date.getMonth(), 1);
    if (month < firstVisible || month > lastVisible) {
      this.visibleDate.set(month);
      this.monthChanged.emit(month);
    }
  }

  private focusActiveDay(): void {
    const key = dateKey(this.activeDate());
    this.dayButtons()
      .find(
        (button) => button.nativeElement.dataset['date'] === key && !button.nativeElement.disabled,
      )
      ?.nativeElement.focus();
  }

  private scheduleActiveDayFocus(): void {
    afterNextRender(() => this.focusActiveDay(), { injector: this.injector });
  }

  private scheduleTimeFocus(): void {
    afterNextRender(() => this.hourInput()?.nativeElement.focus(), { injector: this.injector });
  }

  private prepareChoiceFocus(view: 'month' | 'year'): void {
    this.choiceIndex.set(
      view === 'month' ? this.visibleDate().getMonth() : this.visibleYear() - this.yearRangeStart(),
    );
    this.scheduleChoiceFocus();
  }

  private moveChoiceFocus(targetIndex: number): void {
    const buttons = this.choiceButtons();
    if (!buttons.length) return;

    const direction = targetIndex < this.choiceIndex() ? -1 : 1;
    let index = Math.max(0, Math.min(buttons.length - 1, targetIndex));
    while (buttons[index]?.nativeElement.disabled) {
      const next = index + direction;
      if (next < 0 || next >= buttons.length) return;
      index = next;
    }

    this.choiceIndex.set(index);
    buttons[index]?.nativeElement.focus();
  }

  private scheduleChoiceFocus(): void {
    afterNextRender(() => this.moveChoiceFocus(this.choiceIndex()), { injector: this.injector });
  }
}
