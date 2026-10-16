import { Component, computed, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-date-entry-fixture',
  imports: [AerisDatePicker, AerisButton, AerisDialogModule, FormField],
  template: `
    <section data-fixture="date-entry">
      <h2>Segmented date entry</h2>
      <form data-date-form (submit)="saveNative($event)">
        <label id="native-birthday-label" for="native-birthday">Native birthday</label>
        <aeris-date-picker
          editable
          inputId="native-birthday"
          ariaLabelledBy="native-birthday-label"
          name="nativeBirthday"
          required
          [(value)]="birthday"
        />
        <button aerisButton type="submit">Submit date</button>
        <output aria-label="Native submissions">{{ nativeSaves() }}</output>
      </form>
      <form (submit)="saveSignal($event)">
        <label id="signal-birthday-label" for="signal-birthday">Signal birthday</label>
        <aeris-date-picker
          editable
          inputId="signal-birthday"
          ariaLabelledBy="signal-birthday-label"
          [formField]="fields.birthday"
        />
        <button aerisButton type="submit">Save signal date</button>
        <output aria-label="Signal date value">{{ signalDate() }}</output>
      </form>
      <div style="width: min(100%, 19rem)">
        <label id="typed-booking-label" for="typed-booking">Typed booking</label>
        <aeris-date-picker
          inputId="typed-booking"
          ariaLabelledBy="typed-booking-label"
          calendarAriaLabel="Choose booking date"
          editable
          clearable
          name="typedBooking"
          [(value)]="booking"
        />
      </div>
      <label for="typed-year">Typed year</label>
      <aeris-date-picker
        inputId="typed-year"
        ariaLabel="Typed year"
        calendarAriaLabel="Choose reporting year"
        view="year"
        editable
        name="typedYear"
        [(value)]="year"
      />
      <label id="german-label" for="german-entry">German entry</label>
      <aeris-date-picker
        editable
        inputId="german-entry"
        ariaLabelledBy="german-label"
        locale="de-DE"
        [value]="localeDate"
      />
      <div dir="rtl">
        <label id="arabic-label" for="arabic-entry">Arabic entry</label
        ><aeris-date-picker
          editable
          inputId="arabic-entry"
          ariaLabelledBy="arabic-label"
          locale="ar-EG"
          [value]="localeDate"
        />
      </div>
      <button aerisButton type="button" (click)="dialog.set(true)">Edit date in dialog</button>
      <aeris-dialog header="Booking details" [(visible)]="dialog">
        <label id="dialog-date-label" for="dialog-date">Dialog date</label>
        <aeris-date-picker
          inputId="dialog-date"
          ariaLabelledBy="dialog-date-label"
          calendarAriaLabel="Choose dialog date"
          editable
          appendTo="body"
          [(value)]="booking"
        />
      </aeris-dialog>
    </section>
  `,
})
export class DateEntryFixture {
  protected readonly birthday = signal<Date | null>(new Date(2026, 5, 11));
  protected readonly nativeSaves = signal(0);
  protected readonly data = signal<{ birthday: Date | null }>({ birthday: null });
  protected readonly localeDate = new Date(2026, 5, 11);
  protected readonly signalDate = computed(
    () => this.data().birthday?.toLocaleDateString('sv-SE') || 'empty',
  );
  protected readonly fields = form(this.data, (path) => required(path.birthday));
  protected readonly booking = signal<Date | null>(new Date(2026, 5, 11));
  protected readonly year = signal<Date | null>(new Date(2026, 9, 16));
  protected readonly dialog = signal(false);
  protected saveNative(event: Event): void {
    event.preventDefault();
    this.nativeSaves.update((count) => count + 1);
  }
  protected saveSignal(event: Event): void {
    event.preventDefault();
    void submit(this.fields, async () => undefined);
  }
}
