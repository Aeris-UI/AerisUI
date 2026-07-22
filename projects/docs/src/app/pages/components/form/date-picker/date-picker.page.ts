import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisDatePicker,
  type AerisDatePickerChangeEvent,
  type AerisDatePickerValue,
} from '@aeris-ui/core/date-picker';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-date-picker-page',
  imports: [
    AerisDatePicker,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './date-picker.page.html',
  styleUrl: './date-picker.page.scss',
})
export class DatePickerPage {
  protected readonly basicDate = signal<AerisDatePickerValue>(
    new Date(2026, 5, 18),
  );
  protected readonly meetingDate = signal<AerisDatePickerValue>(
    new Date(2026, 5, 18, 14, 30),
  );
  protected readonly reminderTime = signal<AerisDatePickerValue>(
    new Date(2026, 5, 18, 9, 15),
  );
  protected readonly lastChange = signal('No selection change yet');
  protected readonly range = signal<AerisDatePickerValue>({
    start: new Date(2026, 5, 8),
    end: new Date(2026, 5, 12),
  });
  protected readonly multiple = signal<AerisDatePickerValue>([
    new Date(2026, 5, 4),
    new Date(2026, 5, 11),
    new Date(2026, 5, 25),
  ]);
  protected readonly constrainedDate = signal<AerisDatePickerValue>(null);
  protected readonly validationDate = signal<AerisDatePickerValue>(null);
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () => this.validationTouched() && this.validationDate() === null,
  );
  protected readonly reactiveDate = new FormControl<AerisDatePickerValue>(
    new Date(2026, 6, 3),
  );
  protected templateDate: AerisDatePickerValue = new Date(2026, 6, 14);

  protected readonly minDate = new Date(2026, 5, 5);
  protected readonly maxDate = new Date(2026, 6, 25);
  protected readonly disabledDates = [
    new Date(2026, 5, 12),
    new Date(2026, 5, 19),
  ];
  protected readonly disablePast = (date: Date): boolean =>
    date < new Date(2026, 5, 11);

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'date-picker-basic', label: 'Basic' },
    { id: 'date-picker-time', label: 'Date and time' },
    { id: 'date-picker-selection', label: 'Selection modes' },
    { id: 'date-picker-constraints', label: 'Constraints' },
    { id: 'date-picker-multiple-months', label: 'Multiple months' },
    { id: 'date-picker-views', label: 'Month and year views' },
    { id: 'date-picker-inline', label: 'Inline calendar' },
    { id: 'date-picker-localization', label: 'Localization' },
    { id: 'date-picker-sizes', label: 'Sizes' },
    { id: 'date-picker-states', label: 'Appearances and states' },
    { id: 'date-picker-validation', label: 'Validation' },
    { id: 'date-picker-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'date-picker-api-inputs', label: 'Inputs' },
    { id: 'date-picker-api-outputs', label: 'Outputs' },
    { id: 'date-picker-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisDatePicker } from '@aeris-ui/core/date-picker';`;

  protected readonly basicCode = `protected readonly basicDate =
  signal<AerisDatePickerValue>(
    new Date(2026, 5, 18),
  );

protected recordChange(
  event: AerisDatePickerChangeEvent,
): void {
  const value = event.value;
  this.lastChange.set(
    value instanceof Date
      ? value.toLocaleDateString()
      : 'Selection updated',
  );
}`;

  protected readonly selectionCode = `protected readonly range =
  signal<AerisDatePickerValue>({
    start: new Date(2026, 5, 8),
    end: new Date(2026, 5, 12),
  });

protected readonly multiple =
  signal<AerisDatePickerValue>([
    new Date(2026, 5, 4),
    new Date(2026, 5, 11),
    new Date(2026, 5, 25),
  ]);`;

  protected readonly timeCode = `protected readonly meetingDate =
  signal<AerisDatePickerValue>(
    new Date(2026, 5, 18, 14, 30),
  );

protected readonly reminderTime =
  signal<AerisDatePickerValue>(
    new Date(2026, 5, 18, 9, 15),
  );`;

  protected readonly constraintsCode = `protected readonly minDate =
  new Date(2026, 5, 5);
protected readonly maxDate =
  new Date(2026, 6, 25);
protected readonly disabledDates = [
  new Date(2026, 5, 12),
  new Date(2026, 5, 19),
];

protected readonly disablePast = (
  date: Date,
): boolean => date < new Date(2026, 5, 11);`;

  protected readonly validationCode = `protected readonly validationDate =
  signal<AerisDatePickerValue>(null);
protected readonly validationTouched = signal(false);
protected readonly validationInvalid = computed(
  () =>
    this.validationTouched() &&
    this.validationDate() === null,
);`;

  protected readonly formsCode = `protected readonly reactiveDate =
  new FormControl<AerisDatePickerValue>(
    new Date(2026, 6, 3),
  );

protected templateDate: AerisDatePickerValue =
  new Date(2026, 6, 14);`;

  protected readonly interfacesCode = `type AerisDatePickerSize =
  | 'xs' | 'sm' | 'md' | 'lg';

type AerisDatePickerAppearance =
  | 'outline' | 'filled';

type AerisDatePickerSelectionMode =
  | 'single' | 'multiple' | 'range';

type AerisDatePickerView =
  | 'day' | 'month' | 'year';

type AerisDatePickerDateStyle =
  | 'short' | 'medium' | 'long' | 'full';

type AerisDatePickerMode =
  | 'date' | 'dateTime' | 'time';

type AerisDatePickerHourCycle =
  | '12' | '24';

interface AerisDateRange {
  readonly start: Date | null;
  readonly end: Date | null;
}

type AerisDatePickerValue =
  | Date
  | readonly Date[]
  | AerisDateRange
  | null;

interface AerisDatePickerChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisDatePickerValue;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'AerisDatePickerValue (model)', defaultValue: 'null', description: 'Selected Date, date array, or range according to selectionMode.' },
    { name: 'selectionMode', type: 'AerisDatePickerSelectionMode', defaultValue: "'single'", description: 'Selects one date, multiple independent dates, or a start/end range.' },
    { name: 'view', type: 'AerisDatePickerView', defaultValue: "'day'", description: 'Chooses day, month, or year selection granularity.' },
    { name: 'mode', type: 'AerisDatePickerMode', defaultValue: "'date'", description: 'Chooses date-only, date-and-time, or time-only entry.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the popup trigger.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native hidden field name. Values are serialized as local date, date-time, time, range, or list strings.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Choose a date'", description: 'Text shown while no value is selected.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible trigger name when no external label is used.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of elements that label the trigger.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
    { name: 'calendarAriaLabel', type: 'string', defaultValue: "'Choose a date'", description: 'Accessible name for the calendar dialog.' },
    { name: 'size', type: 'AerisDatePickerSize', defaultValue: "'md'", description: 'Control density from extra small through large.' },
    { name: 'appearance', type: 'AerisDatePickerAppearance', defaultValue: "'outline'", description: 'Outlined or filled field treatment.' },
    { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'BCP 47 locale used for labels and formatted values.' },
    { name: 'dateStyle', type: 'AerisDatePickerDateStyle', defaultValue: "'medium'", description: 'Intl.DateTimeFormat date style used in the trigger.' },
    { name: 'hourCycle', type: 'AerisDatePickerHourCycle', defaultValue: "'24'", description: 'Formats and edits time with 24-hour or 12-hour controls.' },
    { name: 'showSeconds', type: 'boolean', defaultValue: 'false', description: 'Adds a seconds field to date-time and time-only modes.' },
    { name: 'minuteStep', type: 'number', defaultValue: '1', description: 'Native step value for the minute input, clamped from 1 through 59.' },
    { name: 'secondStep', type: 'number', defaultValue: '1', description: 'Native step value for the seconds input, clamped from 1 through 59.' },
    { name: 'firstDayOfWeek', type: 'number | null', defaultValue: 'locale', description: 'Overrides the locale week start with Sunday 0 through Saturday 6.' },
    { name: 'minDate', type: 'Date | undefined', defaultValue: 'undefined', description: 'Earliest selectable date.' },
    { name: 'maxDate', type: 'Date | undefined', defaultValue: 'undefined', description: 'Latest selectable date.' },
    { name: 'disabledDates', type: 'readonly Date[]', defaultValue: '[]', description: 'Specific dates that cannot be selected.' },
    { name: 'disabledDays', type: 'readonly number[]', defaultValue: '[]', description: 'Recurring disabled weekdays from Sunday 0 through Saturday 6.' },
    { name: 'dateDisabled', type: '((date: Date) => boolean) | null', defaultValue: 'null', description: 'Predicate for application-specific disabled dates.' },
    { name: 'numberOfMonths', type: 'number', defaultValue: '1', description: 'Visible month count, clamped from one through three.' },
    { name: 'showOtherMonths', type: 'boolean', defaultValue: 'true', description: 'Shows adjacent-month dates needed to complete the grid.' },
    { name: 'selectOtherMonths', type: 'boolean', defaultValue: 'true', description: 'Allows visible adjacent-month dates to be selected.' },
    { name: 'showWeekNumbers', type: 'boolean', defaultValue: 'false', description: 'Adds ISO week numbers to day grids.' },
    { name: 'showButtonBar', type: 'boolean', defaultValue: 'false', description: 'Shows Today and Clear actions below the calendar.' },
    { name: 'showIcon', type: 'boolean', defaultValue: 'true', description: 'Shows the built-in calendar mark instead of a chevron.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows an in-field clear action while a value exists.' },
    { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Renders the calendar permanently without a trigger.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables trigger, calendar interaction, and form updates.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Synchronizes required semantics to the trigger.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Expands the popup trigger to its container width.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: 'Closes popup single selection and completed ranges.' },
    { name: 'todayLabel', type: 'string', defaultValue: "'Today'", description: 'Localized Today action label.' },
    { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: 'Localized footer Clear action label.' },
    { name: 'timeAriaLabel', type: 'string', defaultValue: "'Choose a time'", description: 'Accessible name for the time field group.' },
    { name: 'hourLabel', type: 'string', defaultValue: "'Hour'", description: 'Visible label for the hour field.' },
    { name: 'minuteLabel', type: 'string', defaultValue: "'Minute'", description: 'Visible label for the minute field.' },
    { name: 'secondLabel', type: 'string', defaultValue: "'Second'", description: 'Visible label for the seconds field.' },
    { name: 'periodLabel', type: 'string', defaultValue: "'Period'", description: 'Visible label for the AM/PM field in 12-hour mode.' },
    { name: 'clearButtonAriaLabel', type: 'string', defaultValue: "'Clear date'", description: 'Accessible name for the in-field clear action.' },
    { name: 'previousButtonAriaLabel', type: 'string', defaultValue: "'Previous period'", description: 'Accessible previous-navigation label.' },
    { name: 'nextButtonAriaLabel', type: 'string', defaultValue: "'Next period'", description: 'Accessible next-navigation label.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'AerisDatePickerValue', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'valueInput', type: 'AerisDatePickerValue', defaultValue: '-', description: 'Emitted when user interaction or a public method changes value.' },
    { name: 'changed', type: 'AerisDatePickerChangeEvent', defaultValue: '-', description: 'Provides the original event and complete selected value.' },
    { name: 'opened', type: 'void', defaultValue: '-', description: 'Emitted after the popup calendar opens.' },
    { name: 'closed', type: 'void', defaultValue: '-', description: 'Emitted after the popup calendar closes.' },
    { name: 'cleared', type: 'void', defaultValue: '-', description: 'Emitted when a selected value is cleared.' },
    { name: 'monthChanged', type: 'Date', defaultValue: '-', description: 'Emitted when navigation changes the first visible month.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the popup trigger receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the popup trigger loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on trigger blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the popup trigger.' },
    { name: 'openPanel()', type: 'void', defaultValue: '-', description: 'Opens an enabled popup and focuses its active date.' },
    { name: 'close(restoreFocus?)', type: 'void', defaultValue: '-', description: 'Closes the popup and optionally restores trigger focus.' },
    { name: 'toggle()', type: 'void', defaultValue: '-', description: 'Toggles popup visibility.' },
    { name: 'clear()', type: 'void', defaultValue: '-', description: 'Clears the selected value and notifies forms.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Clears value and closes the popup.' },
  ];

  protected recordChange(event: AerisDatePickerChangeEvent): void {
    this.lastChange.set(
      event.value instanceof Date
        ? event.value.toLocaleDateString()
        : 'Selection updated',
    );
  }
}
