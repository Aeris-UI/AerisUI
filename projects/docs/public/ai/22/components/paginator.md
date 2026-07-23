# Paginator

> Navigate large record sets with page links, row count selection, and controlled state.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/paginator`
- Human-readable documentation: [https://aeris-ui.dev/components/paginator](https://aeris-ui.dev/components/paginator)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisPaginator } from '@aeris-ui/core/paginator';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `first` | `number (model)` | `0` | Index of the first record in the current page. |
| `rows` | `number (model)` | `10` | Number of records shown per page. |
| `totalRecords` | `number` | `0` | Total number of records available for pagination. |
| `pageLinkSize` | `number` | `5` | Maximum number of page number buttons shown at once. |
| `rowsPerPageOptions` | `readonly number[]` | `[]` | Rows-per-page options. When empty, the menu is hidden. |
| `ariaLabel` | `string` | `'Pagination'` | Accessible name for the paginator navigation landmark. |
| `rowsPerPageLabel` | `string` | `'Rows per page'` | Visible and accessible label for the rows menu. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `AerisPaginatorPageEvent` | `-` | Emitted when the user changes page or row count. |

## Interfaces and types

### Interfaces

```ts
interface AerisPaginatorPageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-surface` | `CSS custom property` | — | Buttons and rows menu surface. |
| `--aeris-border` | `CSS custom property` | — | Button and popup borders. |
| `--aeris-primary` | `CSS custom property` | — | Current page and selected row option. |
| `--aeris-focus` | `CSS custom property` | — | Visible keyboard focus ring. |

## Examples

### Basic

Paginator shows first, previous, page number, next, and last controls with the current page highlighted.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPaginator } from '@aeris-ui/core/paginator';

@Component({
  selector: 'app-paginator-basic-demo',
  imports: [AerisPaginator],
  template: `
    <div class="paginator-demo">
      <aeris-paginator ariaLabel="Basic records pagination" [totalRecords]="92" />
    </div>
  `,
  styles: `
    .paginator-demo {
      width: 100%;
    }
    
    .paginator-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PaginatorBasicBasicDemo {
}
```

### Rows per page

Rows-per-page options use the Aeris popup style instead of the browser default select menu.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPaginator } from '@aeris-ui/core/paginator';

@Component({
  selector: 'app-paginator-rows-demo',
  imports: [AerisPaginator],
  template: `
    <div class="paginator-demo">
      <aeris-paginator
        ariaLabel="Rows menu pagination"
        [totalRecords]="92"
        [rowsPerPageOptions]="[5, 10, 20, 50]"
      />
    </div>
  `,
  styles: `
    .paginator-demo {
      width: 100%;
    }
    
    .paginator-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PaginatorRowsRowsPerPageDemo {
}
```

### Controlled state

Bind first and rows with models when application state, URL state, or server requests need to track pagination.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisPaginator, type AerisPaginatorPageEvent } from '@aeris-ui/core/paginator';

@Component({
  selector: 'app-paginator-controlled-demo',
  imports: [AerisPaginator],
  template: `
    <div class="paginator-demo paginator-demo--stack">
      <aeris-paginator
        ariaLabel="Controlled pagination"
        [(first)]="first"
        [(rows)]="rows"
        [totalRecords]="92"
        [rowsPerPageOptions]="[5, 10, 20]"
        (page)="handlePage($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .paginator-demo {
      width: 100%;
    }
    
    .paginator-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .paginator-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PaginatorControlledControlledStateDemo {
  protected readonly first = signal(0);
  protected readonly rows = signal(10);
  protected readonly eventText = signal('No page change yet');

  protected handlePage(event: AerisPaginatorPageEvent): void {
    this.eventText.set(`Page ${event.page + 1} of ${event.pageCount}`);
  }
}
```

### Page link count

pageLinkSize controls how many numbered page buttons remain visible around the current page.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPaginator } from '@aeris-ui/core/paginator';

@Component({
  selector: 'app-paginator-links-demo',
  imports: [AerisPaginator],
  template: `
    <div class="paginator-demo">
      <aeris-paginator
        ariaLabel="Compact pagination"
        [totalRecords]="260"
        [rows]="10"
        [pageLinkSize]="3"
      />
    </div>
  `,
  styles: `
    .paginator-demo {
      width: 100%;
    }
    
    .paginator-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PaginatorLinksPageLinkCountDemo {
}
```

## Accessibility

- Paginator is a native nav landmark with a configurable accessible label.
- Page buttons are native buttons and the active page uses aria-current="page".
- The current range is announced through polite live text.
- The rows-per-page menu uses listbox semantics and closes when focus leaves the control.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through page controls and the rows menu. |
| `Enter / Space` | Activates a page button or opens the rows menu trigger. |
| `ArrowDown` | Opens the rows menu from the trigger. |
| `Escape` | Closes the rows menu. |
