import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { AerisTree } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-icon-customization-fixture',
  imports: [AerisCheckbox, AerisDatePicker, AerisMultiSelect, AerisTree],
  template: `
    <section data-fixture="custom-icons" aria-label="Custom icon controls">
      <ng-template #artwork>
        <svg
          data-custom-artwork
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </ng-template>
      <aeris-date-picker
        ariaLabel="Custom calendar"
        [(value)]="date"
        clearable
        [calendarIconTemplate]="artwork"
        [clearIconTemplate]="artwork"
        [previousIconTemplate]="artwork"
        [nextIconTemplate]="artwork"
      />
      <aeris-multi-select
        ariaLabel="Custom choices"
        [options]="options"
        filter
        [dropdownIconTemplate]="artwork"
        [filterIconTemplate]="artwork"
      />
      <aeris-checkbox label="Custom check" [checked]="true" [checkIconTemplate]="artwork" />
      <aeris-tree ariaLabel="Custom tree" [value]="nodes" [toggleIconTemplate]="artwork" />
    </section>
  `,
  styles: `
    section {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      max-inline-size: 28rem;
    }
    aeris-date-picker,
    aeris-multi-select {
      min-inline-size: 0;
    }
  `,
})
export class IconCustomizationFixture {
  protected readonly date = signal<Date | null>(new Date(2026, 5, 15));
  protected readonly options = [{ label: 'Design', value: 'design' }];
  protected readonly nodes = [
    { key: 'workspace', label: 'Workspace', children: [{ key: 'files', label: 'Files' }] },
  ];
}
