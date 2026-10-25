import { Component, computed, inject, input, model } from '@angular/core';
import { Router } from '@angular/router';
import {
  AerisCommandPalette,
  type AerisCommandPaletteCommand,
  type AerisCommandPaletteExecuteEvent,
} from '@aeris-ui/core/command-palette';
import {
  LucideDynamicIcon,
  LucideBookOpen,
  LucidePackage,
  LucideChevronRight,
} from '@lucide/angular';

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
  imports: [AerisCommandPalette, LucideDynamicIcon],
  templateUrl: './docs-search-dialog.component.html',
  styleUrl: './docs-search-dialog.component.scss',
})
export class DocsSearchDialogComponent {
  readonly visible = model(false);
  readonly query = model('');
  readonly results = input.required<readonly DocsSearchEntry[]>();
  protected readonly icons = {
    BookOpen: LucideBookOpen,
    Package: LucidePackage,
    ChevronRight: LucideChevronRight,
  };
  protected readonly commands = computed<readonly AerisCommandPaletteCommand[]>(() =>
    this.results().map((entry) => ({
      id: entry.path,
      label: entry.name,
      description: entry.category,
      icon: entry.kind,
    })),
  );
  private readonly prefetcher = inject(DocsRoutePrefetchService);
  private readonly router = inject(Router);

  protected prefetchRoute(path: string): void {
    this.prefetcher.prefetch(path);
  }

  protected navigate(event: AerisCommandPaletteExecuteEvent): void {
    // Resolve against current results rather than retaining stale search entries.
    const entry = this.results().find((entry) => entry.path === event.command.id);
    if (!entry) return;
    this.prefetchRoute(entry.path);
    void this.router.navigateByUrl(entry.path);
  }
}
