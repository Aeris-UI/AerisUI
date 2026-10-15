import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipRemovingEvent } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-removal-fixture',
  imports: [AerisButton, AerisChipModule],
  template: `
    <section data-fixture="chip-removal" aria-labelledby="chip-removal-title">
      <h2 id="chip-removal-title">Chip removal</h2>
      <div class="chips">
        <aeris-chip
          label="Controlled filter"
          removable
          [autoHide]="false"
          (removing)="guard($event)"
          (removed)="requests.update(increment)"
        />
        <button
          aerisButton
          type="button"
          [attr.aria-pressed]="allowed()"
          (click)="allowed.set(!allowed())"
        >
          Allow chip removal
        </button>
        <output aria-label="Chip removal requests">{{ requests() }}</output>
      </div>
      <div class="chips">
        <aeris-chip
          label="Standalone filter"
          removable
          [(visible)]="standaloneVisible"
          (removed)="focusRestore()"
        />
        <button #restore aerisButton type="button" (click)="standaloneVisible.set(true)">
          Restore standalone chip
        </button>
      </div>
      <div class="chips">
        <aeris-chip ariaLabelledBy="projected-chip-title" removable
          ><span id="projected-chip-title">Projected filter</span></aeris-chip
        >
        <aeris-chip
          class="long"
          label="A very long category label that remains readable to assistive technology"
          removable
        />
        <aeris-chip label="Static filter" />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin-block: 1rem;
    }
    :host .long {
      max-inline-size: 12rem;
    }
  `,
})
export class ChipRemovalFixture {
  private readonly restoreElement = viewChild('restore', {
    read: ElementRef<HTMLButtonElement>,
  });
  protected readonly allowed = signal(false);
  protected readonly requests = signal(0);
  protected readonly standaloneVisible = signal(true);
  protected readonly increment = (value: number) => value + 1;
  protected focusRestore(): void {
    this.restoreElement()?.nativeElement.focus();
  }
  protected guard(event: AerisChipRemovingEvent): void {
    if (!this.allowed()) event.preventDefault();
  }
}
