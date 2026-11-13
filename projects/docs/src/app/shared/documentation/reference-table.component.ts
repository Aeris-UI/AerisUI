import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Directive({ selector: 'ng-template[appReferenceHeader]' })
export class ReferenceTableHeader {
  readonly label = input.required<string>({ alias: 'appReferenceHeader' });
}

@Directive({ selector: 'ng-template[appReferenceCell]' })
export class ReferenceTableCell {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: 'ng-container[appReferenceRow]' })
export class ReferenceTableRow {
  readonly cells = contentChildren(ReferenceTableCell, { descendants: true });
}

interface ReferenceRow extends AerisTableData {
  readonly id: string;
  readonly cells: Readonly<Record<string, TemplateRef<unknown>>>;
}

/** Projects rich documentation cells into the public Aeris Table API. */
@Component({
  selector: 'app-reference-table',
  imports: [NgTemplateOutlet, AerisTableModule],
  template: `
    <aeris-table
      [caption]="caption()"
      [columns]="columns()"
      [data]="data()"
      size="sm"
      [hoverable]="false"
      [rowNavigation]="false"
    >
      <ng-template aerisTableCell let-column="column" let-rowIndex="rowIndex">
        @if (data()[rowIndex]?.cells?.[column.field]; as cell) {
          <div class="reference-cell"><ng-container [ngTemplateOutlet]="cell" /></div>
        }
      </ng-template>
    </aeris-table>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    .reference-cell {
      min-inline-size: 0;
      white-space: normal;
      overflow-wrap: anywhere;
      line-height: 1.6;
    }
  `,
})
export class ReferenceTableComponent {
  readonly caption = input.required<string>();
  private readonly headers = contentChildren(ReferenceTableHeader, { descendants: true });
  private readonly rows = contentChildren(ReferenceTableRow, { descendants: true });
  protected readonly columns = computed<readonly AerisTableColumn[]>(() => {
    const headers = this.headers();
    const widths =
      headers.length === 5
        ? [32, 28, 12, 14, 14]
        : headers.length === 4
          ? [23, 28, 14, 35]
          : headers.length === 3
            ? [25, 35, 40]
            : headers.length === 2
              ? [30, 70]
              : [];
    return headers.map((header, index) => ({
      field: `cell${index}`,
      header: header.label(),
      width: `${widths[index] ?? 100 / headers.length}%`,
    }));
  });
  protected readonly data = computed<readonly ReferenceRow[]>(() =>
    this.rows().map((row, index) => ({
      id: String(index),
      cells: Object.fromEntries(
        row.cells().map((cell, cellIndex) => [`cell${cellIndex}`, cell.template]),
      ),
    })),
  );
}

export const ReferenceTableImports = [
  ReferenceTableComponent,
  ReferenceTableHeader,
  ReferenceTableRow,
  ReferenceTableCell,
] as const;
