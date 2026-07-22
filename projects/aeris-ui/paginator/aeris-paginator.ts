import { Component, computed, input, model, output, signal } from '@angular/core';

export interface AerisPaginatorPageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}

@Component({
  selector: 'aeris-paginator',
  template: `
    <nav class="aeris-paginator" [attr.aria-label]="ariaLabel()">
      <span class="aeris-paginator__report" aria-live="polite">{{ pageReport() }}</span>

      <div class="aeris-paginator__pages">
        <button type="button" aria-label="First page" [disabled]="currentPage() === 0" (click)="goToPage(0)">
          <span class="aeris-paginator__page-icon aeris-paginator__page-icon--first" aria-hidden="true"></span>
        </button>
        <button type="button" aria-label="Previous page" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">
          <span class="aeris-paginator__page-icon aeris-paginator__page-icon--previous" aria-hidden="true"></span>
        </button>

        @for (page of visiblePages(); track page) {
          <button
            type="button"
            [attr.aria-label]="'Page ' + (page + 1)"
            [attr.aria-current]="page === currentPage() ? 'page' : null"
            (click)="goToPage(page)"
          >
            {{ page + 1 }}
          </button>
        }

        <button type="button" aria-label="Next page" [disabled]="currentPage() >= pageCount() - 1" (click)="goToPage(currentPage() + 1)">
          <span class="aeris-paginator__page-icon aeris-paginator__page-icon--next" aria-hidden="true"></span>
        </button>
        <button type="button" aria-label="Last page" [disabled]="currentPage() >= pageCount() - 1" (click)="goToPage(pageCount() - 1)">
          <span class="aeris-paginator__page-icon aeris-paginator__page-icon--last" aria-hidden="true"></span>
        </button>
      </div>

      @if (rowsPerPageOptions().length) {
        <div class="aeris-paginator__rows" (focusout)="handleRowsFocusOut($event)">
          <span [id]="rowsLabelId">{{ rowsPerPageLabel() }}</span>
          <button
            class="aeris-paginator__rows-trigger"
            type="button"
            aria-haspopup="listbox"
            [attr.aria-labelledby]="rowsLabelId + ' ' + rowsValueId"
            [attr.aria-expanded]="rowsPanelOpen()"
            [attr.aria-controls]="rowsListboxId"
            (click)="toggleRowsPanel()"
            (keydown)="handleRowsTriggerKeydown($event)"
          >
            <span [id]="rowsValueId">{{ rows() }}</span>
            <span class="aeris-paginator__chevron" aria-hidden="true"></span>
          </button>

          @if (rowsPanelOpen()) {
            <div
              class="aeris-paginator__rows-panel"
              [id]="rowsListboxId"
              role="listbox"
              [attr.aria-labelledby]="rowsLabelId"
              (keydown)="handleRowsPanelKeydown($event)"
            >
              @for (option of rowsPerPageOptions(); track option) {
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="option === rows()"
                  (click)="selectRows(option)"
                >
                  <span>{{ option }}</span>
                  @if (option === rows()) {
                    <span class="aeris-paginator__check" aria-hidden="true"></span>
                  }
                </button>
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
  styleUrl: './aeris-paginator.scss',
})
export class AerisPaginator {
  private static nextId = 0;
  readonly first = model(0);
  readonly rows = model(10);
  readonly totalRecords = input(0);
  readonly pageLinkSize = input(5);
  readonly rowsPerPageOptions = input<readonly number[]>([]);
  readonly ariaLabel = input('Pagination');
  readonly rowsPerPageLabel = input('Rows per page');
  readonly page = output<AerisPaginatorPageEvent>();
  protected readonly rowsPanelOpen = signal(false);
  protected readonly rowsLabelId = `aeris-paginator-rows-label-${AerisPaginator.nextId++}`;
  protected readonly rowsValueId = `${this.rowsLabelId}-value`;
  protected readonly rowsListboxId = `${this.rowsLabelId}-listbox`;

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / Math.max(1, this.rows()))),
  );
  protected readonly currentPage = computed(() =>
    Math.min(
      this.pageCount() - 1,
      Math.max(0, Math.floor(this.first() / Math.max(1, this.rows()))),
    ),
  );
  protected readonly visiblePages = computed(() => {
    const count = this.pageCount();
    const size = Math.max(1, this.pageLinkSize());
    const half = Math.floor(size / 2);
    const start = Math.min(
      Math.max(0, this.currentPage() - half),
      Math.max(0, count - size),
    );
    const end = Math.min(count, start + size);
    return Array.from({ length: end - start }, (_, index) => start + index);
  });
  protected readonly pageReport = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return '0 of 0';
    const start = Math.min(this.first() + 1, total);
    const end = Math.min(this.first() + this.rows(), total);
    return `${start}-${end} of ${total}`;
  });

  protected goToPage(page: number): void {
    const safePage = Math.min(Math.max(page, 0), this.pageCount() - 1);
    this.first.set(safePage * this.rows());
    this.emitPage();
  }

  protected toggleRowsPanel(): void {
    this.rowsPanelOpen.update((open) => !open);
  }

  protected selectRows(rows: number): void {
    this.rows.set(rows);
    this.first.set(0);
    this.rowsPanelOpen.set(false);
    this.emitPage();
  }

  protected handleRowsTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.rowsPanelOpen.set(false);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.rowsPanelOpen.set(true);
    }
  }

  protected handleRowsPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.rowsPanelOpen.set(false);
  }

  protected handleRowsFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && (event.currentTarget as HTMLElement).contains(nextTarget)) {
      return;
    }
    this.rowsPanelOpen.set(false);
  }

  private emitPage(): void {
    this.page.emit({
      first: this.first(),
      rows: this.rows(),
      page: this.currentPage(),
      pageCount: this.pageCount(),
    });
  }
}
