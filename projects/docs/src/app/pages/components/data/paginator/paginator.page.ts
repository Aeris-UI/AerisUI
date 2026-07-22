import { Component, signal } from '@angular/core';
import {
  AerisPaginator,
  type AerisPaginatorPageEvent,
} from '@aeris-ui/core/paginator';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-paginator-page',
  imports: [
    AerisPaginator,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './paginator.page.html',
  styleUrl: './paginator.page.scss',
})
export class PaginatorPage {
  protected readonly first = signal(0);
  protected readonly rows = signal(10);
  protected readonly eventText = signal('No page change yet');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'paginator-basic', label: 'Basic' },
    { id: 'paginator-rows', label: 'Rows per page' },
    { id: 'paginator-controlled', label: 'Controlled state' },
    { id: 'paginator-links', label: 'Page link count' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'paginator-api-inputs', label: 'Inputs' },
    { id: 'paginator-api-outputs', label: 'Outputs' },
  ];

  protected readonly importCode = `import { AerisPaginator } from '@aeris-ui/core/paginator';`;

  protected readonly stateCode = `protected readonly first = signal(0);
protected readonly rows = signal(10);
protected readonly eventText = signal('No page change yet');

protected handlePage(event: AerisPaginatorPageEvent): void {
  this.eventText.set(\`Page \${event.page + 1} of \${event.pageCount}\`);
}`;

  protected readonly interfacesCode = `interface AerisPaginatorPageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'first', type: 'number (model)', defaultValue: '0', description: 'Index of the first record in the current page.' },
    { name: 'rows', type: 'number (model)', defaultValue: '10', description: 'Number of records shown per page.' },
    { name: 'totalRecords', type: 'number', defaultValue: '0', description: 'Total number of records available for pagination.' },
    { name: 'pageLinkSize', type: 'number', defaultValue: '5', description: 'Maximum number of page number buttons shown at once.' },
    { name: 'rowsPerPageOptions', type: 'readonly number[]', defaultValue: '[]', description: 'Rows-per-page options. When empty, the menu is hidden.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Pagination'", description: 'Accessible name for the paginator navigation landmark.' },
    { name: 'rowsPerPageLabel', type: 'string', defaultValue: "'Rows per page'", description: 'Visible and accessible label for the rows menu.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'page', type: 'AerisPaginatorPageEvent', defaultValue: '-', description: 'Emitted when the user changes page or row count.' },
  ];

  protected handlePage(event: AerisPaginatorPageEvent): void {
    this.eventText.set(`Page ${event.page + 1} of ${event.pageCount}`);
  }
}
