import { Component, inject, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon } from '@lucide/angular';

import { DOC_ICONS } from '../documentation/doc-icons';
import { DocsRoutePrefetchService } from '../navigation/docs-route-prefetch.service';

export interface DocsSearchEntry {
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly path: string;
  readonly kind: 'guide' | 'component';
}

@Component({
  selector: 'app-docs-search-dialog',
  imports: [
    RouterLink,
    AerisButton,
    AerisDialogModule,
    AerisIconField,
    AerisInputText,
    LucideDynamicIcon,
  ],
  templateUrl: './docs-search-dialog.component.html',
  styleUrl: './docs-search-dialog.component.scss',
})
export class DocsSearchDialogComponent {
  readonly visible = model(false);
  readonly query = model('');
  readonly results = input.required<readonly DocsSearchEntry[]>();
  protected readonly icons = DOC_ICONS;
  private readonly prefetcher = inject(DocsRoutePrefetchService);

  protected prefetchRoute(path: string): void {
    this.prefetcher.prefetch(path);
  }
}
