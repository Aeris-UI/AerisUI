import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-native-choice-groups-fixture',
  imports: [AerisButton, AerisCheckbox, AerisRadioButton],
  template: `
    <section data-fixture="native-choice-groups" aria-label="Native choice groups">
      <button aerisButton type="button" (click)="disabled.set(!disabled())">
        {{ disabled() ? 'Enable fieldsets' : 'Disable fieldsets' }}
      </button>
      @for (entry of groups; track entry.appearance) {
        <form>
          <fieldset [disabled]="disabled()" [attr.data-appearance]="entry.appearance">
            <legend>
              {{ entry.appearance }} choices
              <aeris-checkbox
                [label]="entry.appearance + ' legend exception'"
                [(checked)]="entry.legend"
              />
            </legend>
            <aeris-checkbox
              [appearance]="entry.appearance"
              label="Enabled checkbox"
              [(checked)]="entry.checked"
              ariaDescribedBy="native-choice-help"
            />
            <aeris-checkbox [appearance]="entry.appearance" label="Locked checkbox" disabled />
            <aeris-radio-button
              [appearance]="entry.appearance"
              name="native-choice"
              value="first"
              label="First choice"
              required
              [(selected)]="entry.selected"
              ariaDescribedBy="native-choice-help"
            />
            <aeris-radio-button
              [appearance]="entry.appearance"
              name="native-choice"
              value="locked"
              label="Locked choice"
              disabled
              [(selected)]="entry.selected"
            />
            <aeris-radio-button
              [appearance]="entry.appearance"
              name="native-choice"
              value="last"
              label="Last choice"
              [(selected)]="entry.selected"
              ariaDescribedBy="native-choice-help"
            />
          </fieldset>
        </form>
      }
      <p id="native-choice-help">Checkboxes are independent; choose one radio per form.</p>
    </section>
  `,
  styles: `
    section,
    fieldset {
      display: grid;
      gap: 0.75rem;
      min-inline-size: 0;
    }
    form {
      min-inline-size: 0;
    }
    fieldset {
      margin: 0;
      border: 0;
      padding: 0.75rem;
    }
    legend {
      padding: 0;
    }
  `,
})
export class NativeChoiceGroupsFixture {
  readonly disabled = signal(false);
  readonly groups = (['standard', 'card'] as const).map((appearance) => ({
    appearance,
    legend: signal(false),
    checked: signal(false),
    selected: signal<string | null>(null),
  }));
}
