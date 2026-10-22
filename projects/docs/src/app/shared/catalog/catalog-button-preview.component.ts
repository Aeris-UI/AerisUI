import { Component, input } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';
import { AerisSplitButton } from '@aeris-ui/core/split-button';
import { LucideDynamicIcon } from '@lucide/angular';
import { DOC_ICONS } from '../documentation/doc-icons';

@Component({
  selector: 'app-catalog-button-preview',
  host: { '[attr.data-active]': 'active()', '[attr.data-kind]': 'kind()' },
  imports: [AerisButton, AerisButtonGroup, AerisSpeedDial, AerisSplitButton, LucideDynamicIcon],
  styleUrl: './catalog-scene.scss',
  template: `
    @switch (kind()) {
      @case ('button-group') {
        <aeris-button-group size="sm" selectionMode="single" value="week" ariaLabel="Period"
          ><button aerisButton aerisButtonGroupItem value="day" variant="outline" size="sm">
            Day</button
          ><button aerisButton aerisButtonGroupItem value="week" variant="outline" size="sm">
            Week</button
          ><button aerisButton aerisButtonGroupItem value="month" variant="outline" size="sm">
            Month
          </button></aeris-button-group
        >
      }
      @case ('speed-dial') {
        <aeris-speed-dial [model]="actions" [visible]="active()" direction="right" size="sm">
          <ng-template #item let-index="index">
            <svg [lucideIcon]="index === 0 ? icons.Save : icons.Copy"></svg>
          </ng-template>
        </aeris-speed-dial>
      }
      @case ('split-button') {
        <aeris-split-button
          label="Save changes"
          [model]="actions"
          [open]="active()"
          appendTo="self"
          size="sm"
        />
      }
    }
  `,
})
export class CatalogButtonPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  protected readonly icons = DOC_ICONS;
  protected readonly actions = [{ label: 'Save draft' }, { label: 'Duplicate' }];
}
