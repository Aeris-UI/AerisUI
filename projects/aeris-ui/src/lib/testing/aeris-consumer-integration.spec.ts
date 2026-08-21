import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisFormField } from '../../../form-field/public-api';
import { AerisInputNumber } from '../../../input-number/public-api';
import { AerisMenubarModule, type AerisMenubarItem } from '../../../menubar/public-api';
import { AerisTabsModule } from '../../../tabs/public-api';

@Component({
  selector: 'aeris-consumer-statistics',
  template: `<button type="button" (click)="refreshes.update((value) => value + 1)">
    Refreshes {{ refreshes() }}
  </button>`,
})
class ConsumerStatistics {
  static created = 0;
  readonly refreshes = signal(0);

  constructor() {
    ConsumerStatistics.created += 1;
  }
}

@Component({
  imports: [
    AerisFormField,
    AerisInputNumber,
    AerisMenubarModule,
    AerisTabsModule,
    ConsumerStatistics,
  ],
  template: `
    <aeris-menubar ariaLabel="Workspace navigation" rootItemVariant="ghost" [model]="navigation" />

    <form class="profile-grid">
      <aeris-form-field required fluid>
        <label aerisFormLabel>Name</label>
        <input aerisFormControl required />
        <small aerisFormHint>Shown to workspace members.</small>
      </aeris-form-field>

      <aeris-form-field #heightField optional fluid>
        <label aerisFormLabel>Height</label>
        <aeris-input-number
          [inputId]="heightField.controlId()"
          [ariaLabelledby]="heightField.labelId()"
          [ariaDescribedby]="heightField.describedBy()"
        />
      </aeris-form-field>
    </form>

    <aeris-tabs ariaLabel="Workspace reports" [(value)]="activeReport">
      <aeris-tab-panel value="overview" label="Overview">Overview</aeris-tab-panel>
      <aeris-tab-panel value="statistics" label="Statistics">
        <ng-template aerisTabContent>
          <aeris-consumer-statistics />
        </ng-template>
      </aeris-tab-panel>
    </aeris-tabs>
  `,
  styles: `
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
  `,
})
class ConsumerIntegrationHost {
  readonly activeReport = signal('overview');
  readonly navigation: readonly AerisMenubarItem[] = [
    { id: 'overview', label: 'Overview', active: true },
    { id: 'projects', label: 'Projects' },
  ];
}

describe('Aeris consumer integration', () => {
  it('composes navigation, fields, and deferred reports through public entry points', () => {
    ConsumerStatistics.created = 0;
    const fixture = TestBed.createComponent(ConsumerIntegrationHost);
    fixture.detectChanges();

    const currentNavigationItem = fixture.nativeElement.querySelector('#overview') as HTMLElement;
    const fields = fixture.nativeElement.querySelectorAll(
      'aeris-form-field',
    ) as NodeListOf<HTMLElement>;
    const nameLabel = fields.item(0).querySelector('label') as HTMLLabelElement;
    const nameInput = fields.item(0).querySelector('input') as HTMLInputElement;
    const nameHint = fields.item(0).querySelector('small') as HTMLElement;
    const numberLabel = fields.item(1).querySelector('label') as HTMLLabelElement;
    const numberInput = fields.item(1).querySelector('input') as HTMLInputElement;

    expect(currentNavigationItem.dataset['variant']).toBe('ghost');
    expect(currentNavigationItem.getAttribute('aria-current')).toBe('page');
    expect(nameLabel.htmlFor).toBe(nameInput.id);
    expect(nameInput.getAttribute('aria-describedby')).toBe(nameHint.id);
    expect(nameInput.getAttribute('aria-required')).toBe('true');
    expect(numberLabel.htmlFor).toBe(numberInput.id);
    expect(ConsumerStatistics.created).toBe(0);

    fixture.componentInstance.activeReport.set('statistics');
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector(
      'aeris-consumer-statistics button',
    ) as HTMLButtonElement;
    refresh.click();
    fixture.detectChanges();

    fixture.componentInstance.activeReport.set('overview');
    fixture.detectChanges();
    fixture.componentInstance.activeReport.set('statistics');
    fixture.detectChanges();

    expect(ConsumerStatistics.created).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Refreshes 1');
  });
});
