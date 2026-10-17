import { Component, signal } from '@angular/core';
import { AerisButton, type AerisButtonSize, type AerisButtonVariant } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

/** Ordinary action buttons only; selection controls belong to their own entry points. */
@Component({
  selector: 'app-button-foundation-fixture',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <section data-fixture="button-foundation" aria-labelledby="button-foundation-title">
      <h2 id="button-foundation-title">Button selection foundation</h2>
      <p>These remain action buttons, without automatic selection or arrow-key navigation.</p>
      @for (size of sizes; track size) {
        <div class="samples" [attr.data-size]="size">
          @for (variant of variants; track variant) {
            <button aerisButton type="button" [size]="size" [variant]="variant">Action</button>
            <aeris-button [size]="size" [variant]="variant" label="Action" />
          }
        </div>
      }
      <div class="samples" data-sample="icons">
        <button aerisButton type="button" variant="outline">
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M12 5v14" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
          Create
        </button>
        <aeris-button label="Create" variant="outline" [iconTemplate]="icon" />
        <ng-template #icon>
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M12 5v14" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </ng-template>
      </div>
      <aeris-button-group ariaLabel="Foundation actions" responsive>
        <button aerisButton type="button" (click)="actions.update(increment)">Save</button>
        <aeris-button label="Preview" (clicked)="actions.update(increment)" />
        <button aerisButton type="button" disabled (click)="actions.update(increment)">
          Unavailable
        </button>
        <aeris-button label="Working" loading (clicked)="actions.update(increment)" />
        <button aerisButton type="button" (click)="actions.update(increment)">Finish</button>
      </aeris-button-group>
      <output aria-label="Foundation activations">{{ actions() }}</output>
      <button aerisButton type="button" variant="ghost">After actions</button>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    section {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      min-inline-size: 0;
    }
    .samples {
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      gap: 0.75rem;
    }
    aeris-button-group,
    section > button {
      justify-self: start;
    }
  `,
})
export class ButtonFoundationFixture {
  protected readonly sizes: readonly AerisButtonSize[] = ['xs', 'sm', 'md', 'lg'];
  protected readonly variants: readonly AerisButtonVariant[] = [
    'solid',
    'outline',
    'ghost',
    'link',
  ];
  protected readonly actions = signal(0);
  protected readonly increment = (count: number) => count + 1;
}
