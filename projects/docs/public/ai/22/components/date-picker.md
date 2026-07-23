# DatePicker

> Locale-aware date, range, month, and year selection with complete keyboard support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/date-picker`
- Human-readable documentation: [https://aeris-ui.dev/components/date-picker](https://aeris-ui.dev/components/date-picker)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `AerisDatePickerValue (model)` | `null` | Selected Date, date array, or range according to selectionMode. |
| `selectionMode` | `AerisDatePickerSelectionMode` | `'single'` | Selects one date, multiple independent dates, or a start/end range. |
| `view` | `AerisDatePickerView` | `'day'` | Chooses day, month, or year selection granularity. |
| `mode` | `AerisDatePickerMode` | `'date'` | Chooses date-only, date-and-time, or time-only entry. |
| `inputId` | `string` | `generated` | ID assigned to the popup trigger. |
| `name` | `string` | `''` | Native hidden field name. Values are serialized as local date, date-time, time, range, or list strings. |
| `placeholder` | `string` | `'Choose a date'` | Text shown while no value is selected. |
| `ariaLabel` | `string` | `''` | Accessible trigger name when no external label is used. |
| `ariaLabelledby` | `string` | `''` | IDs of elements that label the trigger. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `calendarAriaLabel` | `string` | `'Choose a date'` | Accessible name for the calendar dialog. |
| `size` | `AerisDatePickerSize` | `'md'` | Control density from extra small through large. |
| `appearance` | `AerisDatePickerAppearance` | `'outline'` | Outlined or filled field treatment. |
| `locale` | `string` | `'en-US'` | BCP 47 locale used for labels and formatted values. |
| `dateStyle` | `AerisDatePickerDateStyle` | `'medium'` | Intl.DateTimeFormat date style used in the trigger. |
| `hourCycle` | `AerisDatePickerHourCycle` | `'24'` | Formats and edits time with 24-hour or 12-hour controls. |
| `showSeconds` | `boolean` | `false` | Adds a seconds field to date-time and time-only modes. |
| `minuteStep` | `number` | `1` | Native step value for the minute input, clamped from 1 through 59. |
| `secondStep` | `number` | `1` | Native step value for the seconds input, clamped from 1 through 59. |
| `firstDayOfWeek` | `number &#124; null` | `locale` | Overrides the locale week start with Sunday 0 through Saturday 6. |
| `minDate` | `Date &#124; undefined` | `undefined` | Earliest selectable date. |
| `maxDate` | `Date &#124; undefined` | `undefined` | Latest selectable date. |
| `disabledDates` | `readonly Date[]` | `[]` | Specific dates that cannot be selected. |
| `disabledDays` | `readonly number[]` | `[]` | Recurring disabled weekdays from Sunday 0 through Saturday 6. |
| `dateDisabled` | `((date: Date) =&gt; boolean) &#124; null` | `null` | Predicate for application-specific disabled dates. |
| `numberOfMonths` | `number` | `1` | Visible month count, clamped from one through three. |
| `showOtherMonths` | `boolean` | `true` | Shows adjacent-month dates needed to complete the grid. |
| `selectOtherMonths` | `boolean` | `true` | Allows visible adjacent-month dates to be selected. |
| `showWeekNumbers` | `boolean` | `false` | Adds ISO week numbers to day grids. |
| `showButtonBar` | `boolean` | `false` | Shows Today and Clear actions below the calendar. |
| `showIcon` | `boolean` | `true` | Shows the built-in calendar mark instead of a chevron. |
| `clearable` | `boolean` | `false` | Shows an in-field clear action while a value exists. |
| `inline` | `boolean` | `false` | Renders the calendar permanently without a trigger. |
| `disabled` | `boolean` | `false` | Disables trigger, calendar interaction, and form updates. |
| `required` | `boolean` | `false` | Synchronizes required semantics to the trigger. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Expands the popup trigger to its container width. |
| `closeOnSelect` | `boolean` | `true` | Closes popup single selection and completed ranges. |
| `todayLabel` | `string` | `'Today'` | Localized Today action label. |
| `clearLabel` | `string` | `'Clear'` | Localized footer Clear action label. |
| `timeAriaLabel` | `string` | `'Choose a time'` | Accessible name for the time field group. |
| `hourLabel` | `string` | `'Hour'` | Visible label for the hour field. |
| `minuteLabel` | `string` | `'Minute'` | Visible label for the minute field. |
| `secondLabel` | `string` | `'Second'` | Visible label for the seconds field. |
| `periodLabel` | `string` | `'Period'` | Visible label for the AM/PM field in 12-hour mode. |
| `clearButtonAriaLabel` | `string` | `'Clear date'` | Accessible name for the in-field clear action. |
| `previousButtonAriaLabel` | `string` | `'Previous period'` | Accessible previous-navigation label. |
| `nextButtonAriaLabel` | `string` | `'Next period'` | Accessible next-navigation label. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `AerisDatePickerValue` | `-` | Emitted automatically by the value model. |
| `valueInput` | `AerisDatePickerValue` | `-` | Emitted when user interaction or a public method changes value. |
| `changed` | `AerisDatePickerChangeEvent` | `-` | Provides the original event and complete selected value. |
| `opened` | `void` | `-` | Emitted after the popup calendar opens. |
| `closed` | `void` | `-` | Emitted after the popup calendar closes. |
| `cleared` | `void` | `-` | Emitted when a selected value is cleared. |
| `monthChanged` | `Date` | `-` | Emitted when navigation changes the first visible month. |
| `focused` | `FocusEvent` | `-` | Emitted when the popup trigger receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when the popup trigger loses focus. |
| `touch` | `void` | `-` | Emitted on trigger blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the popup trigger. |
| `openPanel()` | `void` | `-` | Opens an enabled popup and focuses its active date. |
| `close(restoreFocus?)` | `void` | `-` | Closes the popup and optionally restores trigger focus. |
| `toggle()` | `void` | `-` | Toggles popup visibility. |
| `clear()` | `void` | `-` | Clears the selected value and notifies forms. |
| `reset()` | `void` | `-` | Clears value and closes the popup. |

## Interfaces and types

### Interfaces

```ts
type AerisDatePickerSize =
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-date-picker-background` | `CSS custom property` | — | Trigger surface. |
| `--aeris-date-picker-border` | `CSS custom property` | — | Trigger border. |
| `--aeris-date-picker-filled-background` | `CSS custom property` | — | Filled trigger surface. |
| `--aeris-date-picker-panel-background` | `CSS custom property` | — | Calendar panel surface. |
| `--aeris-date-picker-panel-border` | `CSS custom property` | — | Calendar panel border. |
| `--aeris-date-picker-panel-radius` | `CSS custom property` | — | Calendar panel corner radius. |
| `--aeris-date-picker-panel-shadow` | `CSS custom property` | — | Popup elevation. |
| `--aeris-date-picker-hover` | `CSS custom property` | — | Interactive hover and range tint. |
| `--aeris-date-picker-selected-background` | `CSS custom property` | — | Selected date surface. |
| `--aeris-date-picker-selected-text` | `CSS custom property` | — | Selected date text. |
| `--aeris-date-picker-selected-hover-background` | `CSS custom property` | — | Selected date hover and focus surface. |
| `--aeris-date-picker-selected-hover-text` | `CSS custom property` | — | Selected date hover and focus text. |
| `--aeris-date-picker-focus` | `CSS custom property` | — | Trigger focus border. |

## Examples

### Basic

Bind a Date value two ways, clear it from the field, and observe typed selection events.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisDatePicker, type AerisDatePickerChangeEvent, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-basic-demo',
  imports: [AerisDatePicker],
  template: `
    <div class="field-stack">
      <div class="field">
        <label for="basic-date">Project date</label>
        <aeris-date-picker
          inputId="basic-date"
          [(value)]="basicDate"
          clearable
          (changed)="recordChange($event)"
        />
        <small aria-live="polite">Last change: {{ lastChange() }}</small>
      </div>
    </div>
  `,
  styles: `
    .field-stack {
      width: 100%;
      display: grid;
      gap: 1rem;
    }
    
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class DatePickerBasicBasicDemo {
  protected readonly basicDate =
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
  }
}
```

### Date and time

Use date-time mode when the calendar selection needs a time. Use time-only mode when the date section should be hidden.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-time-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-time.demo.html',
  styleUrl: './date-picker-time.demo.scss'
})
export class DatePickerTimeDateAndTimeDemo {
  protected readonly meetingDate =
    signal<AerisDatePickerValue>(
      new Date(2026, 5, 18, 14, 30),
    );

  protected readonly reminderTime =
    signal<AerisDatePickerValue>(
      new Date(2026, 5, 18, 9, 15),
    );
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="meeting-date">Meeting date and time</label>
    <aeris-date-picker
      inputId="meeting-date"
      mode="dateTime"
      hourCycle="12"
      showSeconds
      [(value)]="meetingDate"
      clearable
    />
  </div>
  <div class="field">
    <label for="reminder-time">Reminder time</label>
    <aeris-date-picker
      inputId="reminder-time"
      mode="time"
      [minuteStep]="15"
      [(value)]="reminderTime"
      clearable
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Selection modes

Range selection waits for both boundaries before closing. Multiple selection toggles independent dates and remains open.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-selection-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-selection.demo.html',
  styleUrl: './date-picker-selection.demo.scss'
})
export class DatePickerSelectionSelectionModesDemo {
  protected readonly range =
    signal<AerisDatePickerValue>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 12),
    });

  protected readonly multiple =
    signal<AerisDatePickerValue>([
      new Date(2026, 5, 4),
      new Date(2026, 5, 11),
      new Date(2026, 5, 25),
    ]);
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="range-date">Travel range</label>
    <aeris-date-picker
      inputId="range-date"
      selectionMode="range"
      [(value)]="range"
      clearable
    />
  </div>
  <div class="field">
    <label for="multiple-date">Available dates</label>
    <aeris-date-picker
      inputId="multiple-date"
      selectionMode="multiple"
      [(value)]="multiple"
      clearable
      showButtonBar
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Constraints and disabled dates

Combine minimum and maximum boundaries, recurring weekdays, explicit dates, and a predicate without preprocessing calendar data.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-constraints-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-constraints.demo.html',
  styleUrl: './date-picker-constraints.demo.scss'
})
export class DatePickerConstraintsConstraintsAndDisabledDatesDemo {
  protected readonly minDate =
    new Date(2026, 5, 5);
  protected readonly maxDate =
    new Date(2026, 6, 25);
  protected readonly disabledDates = [
    new Date(2026, 5, 12),
    new Date(2026, 5, 19),
  ];

  protected readonly disablePast = (
    date: Date,
  ): boolean => date < new Date(2026, 5, 11);
}
```

#### HTML

```html
<div class="field">
  <label for="constrained-date">Appointment date</label>
  <aeris-date-picker
    inputId="constrained-date"
    [(value)]="constrainedDate"
    [minDate]="minDate"
    [maxDate]="maxDate"
    [disabledDates]="disabledDates"
    [disabledDays]="[0, 6]"
    [dateDisabled]="disablePast"
    showButtonBar
    clearable
    fluid
  />
  <small>Weekends, June 12, June 19, and dates before June 11 are unavailable.</small>
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}
```

### Multiple months and week numbers

Show up to three months in one calendar. The layout collapses to one column on narrow screens instead of overflowing the page.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-multiple-months-demo',
  imports: [AerisDatePicker],
  template: `
    <div class="wide-calendar-demo">
      <aeris-date-picker
        [value]="range()"
        selectionMode="range"
        [numberOfMonths]="2"
        showWeekNumbers
        showButtonBar
        fluid
      />
    </div>
  `,
  styles: `
    .wide-calendar-demo,
    .inline-calendar-demo {
      width: 100%;
    }
    
    .wide-calendar-demo aeris-date-picker,
    .inline-calendar-demo aeris-date-picker {
      max-width: 100%;
    }
  `
})
export class DatePickerMultipleMonthsMultipleMonthsAndWeekNumbersDemo {
}
```

### Month and year views

Use a coarser selection view when a precise day would add unnecessary input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-views-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-views.demo.html',
  styleUrl: './date-picker-views.demo.scss'
})
export class DatePickerViewsMonthAndYearViewsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="billing-month">Billing month</label>
    <aeris-date-picker
      inputId="billing-month"
      view="month"
      placeholder="Choose month"
    />
  </div>
  <div class="field">
    <label for="reporting-year">Reporting year</label>
    <aeris-date-picker
      inputId="reporting-year"
      view="year"
      placeholder="Choose year"
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Inline calendar

Inline mode keeps the calendar visible and removes popup-only focus and dismissal behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-inline-demo',
  imports: [AerisDatePicker],
  template: `
    <div class="inline-calendar-demo">
      <aeris-date-picker [value]="basicDate()" inline showButtonBar showWeekNumbers />
    </div>
  `,
  styles: `
    .wide-calendar-demo,
    .inline-calendar-demo {
      width: 100%;
    }
    
    .wide-calendar-demo aeris-date-picker,
    .inline-calendar-demo aeris-date-picker {
      max-width: 100%;
    }
  `
})
export class DatePickerInlineInlineCalendarDemo {
}
```

### Localization

Locale controls formatted values, month names, weekday labels, and the default first day of the week. Action labels remain explicitly customizable.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-localization-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-localization.demo.html',
  styleUrl: './date-picker-localization.demo.scss'
})
export class DatePickerLocalizationLocalizationDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="german-date">German</label>
    <aeris-date-picker
      inputId="german-date"
      locale="de-DE"
      dateStyle="long"
      todayLabel="Heute"
      clearLabel="Leeren"
      [value]="basicDate()"
      showButtonBar
    />
  </div>
  <div class="field">
    <label for="japanese-date">Japanese</label>
    <aeris-date-picker
      inputId="japanese-date"
      locale="ja-JP"
      dateStyle="full"
      [value]="basicDate()"
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Sizes

Four trigger sizes align DatePicker with the Aeris form-control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-sizes-demo',
  imports: [AerisDatePicker],
  template: `
    <div class="field-row">
      <aeris-date-picker size="xs" placeholder="Extra small" />
      <aeris-date-picker size="sm" placeholder="Small" />
      <aeris-date-picker size="md" placeholder="Medium" />
      <aeris-date-picker size="lg" placeholder="Large" />
    </div>
  `,
  styles: `
    .field-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 1rem;
    }
    
    @media (max-width: 42rem) {
      .field-row {
        align-items: stretch;
      }
    }
  `
})
export class DatePickerSizesSizesDemo {
}
```

### Appearances and states

Filled, invalid, disabled, icon-free, and fluid states preserve the same semantics and interaction model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-states-demo',
  imports: [AerisDatePicker],
  template: `
    <div class="field-grid">
      <aeris-date-picker appearance="filled" placeholder="Filled" />
      <aeris-date-picker invalid placeholder="Invalid" ariaLabel="Invalid date" />
      <aeris-date-picker disabled placeholder="Disabled" ariaLabel="Disabled date" />
      <aeris-date-picker
        [showIcon]="false"
        placeholder="Chevron"
        ariaLabel="Date with chevron"
      />
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }
    
    @media (max-width: 42rem) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class DatePickerStatesAppearancesAndStatesDemo {
}
```

### Validation

Reserve message space and synchronize visible invalid state with aria-invalid and touched state.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-validation-demo',
  imports: [AerisDatePicker],
  templateUrl: './date-picker-validation.demo.html',
  styleUrl: './date-picker-validation.demo.scss'
})
export class DatePickerValidationValidationDemo {
  protected readonly validationDate =
    signal<AerisDatePickerValue>(null);
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () =>
      this.validationTouched() &&
      this.validationDate() === null,
  );
}
```

#### HTML

```html
<div class="field">
  <label for="required-date">Required milestone</label>
  <aeris-date-picker
    inputId="required-date"
    required
    [invalid]="validationInvalid()"
    ariaDescribedby="required-date-message"
    [(value)]="validationDate"
    (blurred)="validationTouched.set(true)"
    fluid
  />
  <small
    id="required-date-message"
    class="validation-message"
    [class.error]="validationInvalid()"
    aria-live="polite"
    >{{
      validationInvalid() ? 'Choose a milestone date.' : 'A date is required.'
    }}</small
  >
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

.validation-message {
  min-height: 1.25rem;
}
```

### Reactive and template-driven forms

ControlValueAccessor synchronizes Date values, disabled state, touched state, and validation with both Angular Forms approaches.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';

@Component({
  selector: 'app-date-picker-forms-demo',
  imports: [AerisDatePicker, FormsModule, ReactiveFormsModule],
  templateUrl: './date-picker-forms.demo.html',
  styleUrl: './date-picker-forms.demo.scss'
})
export class DatePickerFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveDate =
    new FormControl<AerisDatePickerValue>(
      new Date(2026, 6, 3),
    );

  protected templateDate: AerisDatePickerValue =
    new Date(2026, 6, 14);
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-date">Reactive Forms</label>
    <aeris-date-picker inputId="reactive-date" [formControl]="reactiveDate" />
    <small>Control is {{ reactiveDate.valid ? 'valid' : 'invalid' }}.</small>
  </div>
  <div class="field">
    <label for="template-date">Template-driven forms</label>
    <aeris-date-picker
      inputId="template-date"
      name="templateDate"
      [(ngModel)]="templateDate"
    />
    <small>The model stores a native Date value.</small>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

- The popup trigger exposes combobox state and its relationship to the labelled calendar dialog.
- The day calendar uses grid, row, and gridcell semantics with one roving tab stop.
- Selected dates use aria-selected, today uses aria-current="date", and unavailable dates use native disabled behavior.
- Every date receives a complete locale-formatted accessible name rather than exposing only its day number.
- Date-time mode keeps the calendar semantics and adds labelled native time fields. Time-only mode removes the calendar grid and focuses the hour field when opened.
- Visible labels should use inputId. Otherwise provide ariaLabel or ariaLabelledby.
- Use ariaDescribedby for help and validation messages. Required and invalid state are synchronized with ARIA.
- Multiple-month layouts collapse on narrow screens and all pointer targets retain clear focus indicators.
- DatePicker uses native Date values with Reactive Forms and template-driven forms.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter` | Opens the popup trigger or selects the focused date. |
| `Space` | Opens the popup trigger or selects the focused date. |
| `Arrow Down` | Opens the popup from its trigger, or moves focus one week forward in the day grid. |
| `Arrow Up` | Moves focus one week backward. |
| `Arrow Left` | Moves focus one day backward. |
| `Arrow Right` | Moves focus one day forward. |
| `Home` | Moves focus to the first day of the current week. |
| `End` | Moves focus to the last day of the current week. |
| `Page Up` | Moves focus to the previous month. |
| `Page Down` | Moves focus to the next month. |
| `Shift + Page Up` | Moves focus to the previous year. |
| `Shift + Page Down` | Moves focus to the next year. |
| `Arrow keys in month or year view` | Moves through the month or year options using the visual grid direction. |
| `Home / End in month or year view` | Moves to the first or last option in the visible period. |
| `Native input keys in time fields` | Edit hours, minutes, seconds, or AM/PM using browser-native number and select behavior. |
| `Escape` | Closes a popup calendar and restores focus to its trigger. |
| `Tab` | Moves to the next focusable control and closes a popup calendar. |
