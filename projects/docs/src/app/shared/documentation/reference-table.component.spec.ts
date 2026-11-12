import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReferenceTableImports } from './reference-table.component';

@Component({
  imports: [ReferenceTableImports],
  template: `
    <app-reference-table caption="Control inputs">
      <ng-template appReferenceHeader="Name" />
      <ng-template appReferenceHeader="Description" />
      @for (row of rows(); track row.name) {
        <ng-container appReferenceRow>
          <ng-template appReferenceCell
            ><code>{{ row.name }}</code></ng-template
          >
          <ng-template appReferenceCell
            ><a [href]="row.url">{{ row.description }}</a></ng-template
          >
        </ng-container>
      }
    </app-reference-table>
  `,
})
class ReferenceTableHost {
  readonly rows = signal([{ name: 'value', description: 'Selected value', url: '/guides/forms' }]);
}

describe('ReferenceTableComponent', () => {
  it('uses one real Aeris Table with native semantics and reactive rich cells', async () => {
    const fixture = TestBed.createComponent(ReferenceTableHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('aeris-table table')).toHaveLength(1);
    expect(root.querySelector('caption')?.textContent?.trim()).toBe('Control inputs');
    expect([...root.querySelectorAll('thead th')].map((cell) => cell.textContent?.trim())).toEqual([
      'Name',
      'Description',
    ]);
    expect(root.querySelector('tbody code')?.textContent).toBe('value');
    expect(root.querySelector('tbody a')?.getAttribute('href')).toBe('/guides/forms');
    fixture.componentInstance.rows.set([
      { name: 'disabled', description: 'Disable the control', url: '/guides/accessibility' },
    ]);
    await fixture.whenStable();
    expect(root.querySelector('tbody code')?.textContent).toBe('disabled');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(1);
  });
});
