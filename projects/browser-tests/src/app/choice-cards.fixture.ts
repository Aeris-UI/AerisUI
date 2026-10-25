import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-choice-cards-fixture',
  imports: [AerisCheckbox, AerisRadioButton],
  template: `
    <section data-fixture="choice-cards" aria-labelledby="choice-cards-title">
      <h2 id="choice-cards-title">Selectable cards</h2>
      <fieldset>
        <legend>Report preferences</legend>
        <aeris-checkbox
          appearance="card"
          label="Weekly summary"
          description="Workspace activity and completed work, delivered every Monday."
          [(checked)]="reports"
          (changed)="changes.update(increment)"
        />
        <aeris-checkbox
          appearance="card"
          label="Managed reports"
          description="Only your administrator can change this setting."
          disabled
        />
        <output aria-label="Card changes">{{ changes() }}</output>
      </fieldset>
      <fieldset>
        <legend>Card delivery</legend>
        <aeris-radio-button
          appearance="card"
          name="card-delivery"
          value="standard"
          label="Regular shipping"
          description="Tracking included. Delivery within three to five working days."
          [(selected)]="delivery"
        />
        <aeris-radio-button
          appearance="card"
          name="card-delivery"
          value="express"
          label="Next day shipping"
          description="Order by noon for delivery on the next working day."
          [(selected)]="delivery"
          labelPosition="start"
        />
        <aeris-radio-button
          appearance="card"
          name="card-delivery"
          value="collection"
          label="Local pickup"
          description="Not currently available."
          [(selected)]="delivery"
          disabled
        />
      </fieldset>
    </section>
  `,
  styles: `
    fieldset {
      display: grid;
      gap: 0.75rem;
      min-inline-size: 0;
      margin-block: 1rem;
      padding: 0;
      border: 0;
    }
    legend {
      margin-block-end: 0.5rem;
    }
  `,
})
export class ChoiceCardsFixture {
  protected readonly reports = signal(false);
  protected readonly delivery = signal<string | null>('standard');
  protected readonly changes = signal(0);
  protected readonly increment = (value: number) => value + 1;
}
