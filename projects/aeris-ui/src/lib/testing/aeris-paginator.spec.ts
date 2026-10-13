import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisPaginator,
  type AerisPaginatorPageEvent,
} from '../../../paginator/aeris-paginator';

@Component({
  imports: [AerisPaginator],
  template: `
    <aeris-paginator
      ariaLabel="Members pages"
      [(first)]="first"
      [(rows)]="rows"
      [totalRecords]="42"
      [rowsPerPageOptions]="[5, 10, 20]"
      (page)="lastPage.set($event)"
    />
  `,
})
class PaginatorTestHost {
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly lastPage = signal<AerisPaginatorPageEvent | null>(null);
}

describe('AerisPaginator', () => {
  it('renders first, previous, page links, next, last, and rows menu', async () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    await fixture.whenStable();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.aeris-paginator__pages button'),
    ) as HTMLButtonElement[];
    const rowsTrigger = fixture.nativeElement.querySelector(
      '.aeris-paginator__rows-trigger',
    ) as HTMLButtonElement;

    expect(nav.getAttribute('aria-label')).toBe('Members pages');
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'First page',
      'Previous page',
      'Page 1',
      'Page 2',
      'Page 3',
      'Page 4',
      'Page 5',
      'Next page',
      'Last page',
    ]);
    expect(
      fixture.nativeElement.querySelectorAll('.aeris-paginator__page-icon').length,
    ).toBe(4);
    expect(rowsTrigger.textContent).toContain('10');
    expect(buttons[2]?.getAttribute('aria-current')).toBe('page');
  });

  it('changes pages and rows per page', async () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    await fixture.whenStable();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.aeris-paginator__pages button'),
    ) as HTMLButtonElement[];
    buttons[3]?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.first()).toBe(10);
    expect(fixture.componentInstance.lastPage()?.page).toBe(1);

    const rowsTrigger = fixture.nativeElement.querySelector(
      '.aeris-paginator__rows-trigger',
    ) as HTMLButtonElement;
    rowsTrigger.click();
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      '[role="option"]',
    ) as NodeListOf<HTMLButtonElement>;
    options.item(2).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.rows()).toBe(20);
    expect(fixture.componentInstance.first()).toBe(0);
  });

  it('anchors the rows menu to its trigger and toggles it closed', async () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    await fixture.whenStable();

    const rowsTrigger = fixture.nativeElement.querySelector(
      '.aeris-paginator__rows-trigger',
    ) as HTMLButtonElement;
    vi.spyOn(rowsTrigger, 'getBoundingClientRect').mockReturnValue({
      x: 700,
      y: 100,
      top: 100,
      right: 780,
      bottom: 132,
      left: 700,
      width: 80,
      height: 32,
      toJSON: () => ({}),
    });

    rowsTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = fixture.nativeElement.querySelector(
      '.aeris-paginator__rows-panel',
    ) as HTMLElement;
    expect(panel).not.toBeNull();
    expect(Number.parseFloat(panel.style.left)).toBeGreaterThan(600);

    rowsTrigger.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    rowsTrigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-paginator__rows-panel')).toBeNull();
    expect(rowsTrigger.getAttribute('aria-expanded')).toBe('false');
  });
});
