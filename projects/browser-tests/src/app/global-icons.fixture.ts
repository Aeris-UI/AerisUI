import { Component, signal } from '@angular/core';
import { provideAerisIcons } from '@aeris-ui/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTableModule } from '@aeris-ui/core/table';

@Component({
  selector: 'app-fixture-close-icon',
  template:
    '<svg data-global-close viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M6 18 18 6" /></svg>',
})
class CloseIcon {}
@Component({
  selector: 'app-fixture-chevron-icon',
  template:
    '<svg data-global-chevron viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>',
})
class ChevronIcon {}
@Component({
  selector: 'app-global-icons-fixture',
  imports: [
    AerisInputText,
    AerisDatePicker,
    AerisCheckbox,
    AerisSelect,
    AerisDialogModule,
    AerisButton,
    AerisTableModule,
  ],
  providers: [
    provideAerisIcons({
      close: CloseIcon,
      chevron: ChevronIcon,
      check: ChevronIcon,
      edit: CloseIcon,
    }),
  ],
  template: `
    <section data-fixture="global-icons" aria-label="Global icon controls">
      <ng-template #local
        ><svg data-local-close viewBox="0 0 24 24"><path d="M4 12h16" /></svg
      ></ng-template>
      <button aerisButton (click)="localOverride.set(!localOverride())">
        Toggle local icon override
      </button>
      <aeris-input-text
        ariaLabel="Global icon name"
        [(value)]="name"
        clearable
        [clearIconTemplate]="localOverride() ? local : undefined"
      />
      <aeris-date-picker ariaLabel="Global icon date" [(value)]="date" clearable />
      <aeris-checkbox label="Global icon check" [(checked)]="checked" />
      <aeris-select ariaLabel="Global icon select" [options]="options" />
      <aeris-table [columns]="columns" [data]="rows" editable />
      <button aerisButton (click)="dialog.show()">Open global icon dialog</button>
      <aeris-dialog #dialog header="Global icons" width="24rem"
        ><p>Close uses the same registered component.</p></aeris-dialog
      >
    </section>
  `,
  styles: `
    section {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      max-inline-size: 28rem;
    }
  `,
})
export class GlobalIconsFixture {
  protected readonly name = signal('Aeris');
  protected readonly checked = signal(true);
  protected readonly date = signal<Date | null>(new Date(2026, 5, 15));
  protected readonly localOverride = signal(false);
  protected readonly options = [{ label: 'Design', value: 'design' }];
  protected readonly columns = [{ field: 'name', header: 'Name' }];
  protected readonly rows = [{ name: 'Aeris' }];
}
