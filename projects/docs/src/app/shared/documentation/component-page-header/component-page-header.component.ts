import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';
import { AerisButton } from '@aeris-ui/core/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { COMPONENT_CATALOG } from '../../../data/component-catalog';
import { AERIS_CURRENT_VERSION } from '../../../data/aeris-version';
import { DOC_ICONS } from '../doc-icons';

@Component({
  selector: 'app-component-page-header',
  imports: [RouterLink, AerisBreadcrumbModule, AerisButton, LucideDynamicIcon],
  template: `
    <aeris-breadcrumb
      class="component-breadcrumb"
      variant="plain"
      size="sm"
      [items]="breadcrumbItems()"
      ariaLabel="Component breadcrumb"
    >
      <ng-template aerisBreadcrumbItem let-item let-current="current">
        @if (current) {
          <span>{{ item.label }}</span>
        } @else {
          <a class="component-breadcrumb__link" routerLink="/components">{{ item.label }}</a>
        }
      </ng-template>
    </aeris-breadcrumb>

    <header class="page-header">
      <div>
        <span class="kicker">{{ category() }}</span>
        <h1>{{ title() }}</h1>
        <p>
          <ng-content select="[componentPageDescription]">{{ description() }}</ng-content>
        </p>
        @if (component(); as item) {
          <div class="page-actions">
            <a
              aerisButton
              variant="ghost"
              size="sm"
              [href]="sourceUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg [lucideIcon]="icons.Code" aria-hidden="true"></svg>
              Source <span class="visually-hidden">(opens in a new tab)</span>
            </a>
            <button
              aerisButton
              variant="ghost"
              size="sm"
              [loading]="copyState() === 'copying'"
              (click)="copyMarkdown()"
            >
              <svg
                [lucideIcon]="copyState() === 'copied' ? icons.Check : icons.Copy"
                aria-hidden="true"
              ></svg>
              {{ copyState() === 'copied' ? 'Copied Markdown' : 'Copy Markdown' }}
            </button>
            <a class="markdown-link" [href]="markdownUrl()"
              >View Markdown<span class="visually-hidden"> for {{ item.name }}</span></a
            >
          </div>
          <span class="visually-hidden" role="status">{{ announcement() }}</span>
        }
      </div>
    </header>
  `,
  styleUrl: './component-page-header.component.scss',
  host: {
    '[attr.title]': 'null',
  },
})
export class ComponentPageHeaderComponent {
  readonly category = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
  protected readonly icons = DOC_ICONS;
  protected readonly copyState = signal<'idle' | 'copying' | 'copied' | 'error'>('idle');
  protected readonly announcement = computed(() =>
    this.copyState() === 'copied'
      ? 'Component documentation copied as Markdown.'
      : this.copyState() === 'error'
        ? 'Unable to copy. Use the View Markdown link to select and copy the documentation.'
        : '',
  );
  protected readonly component = computed(() => {
    const name = this.title()
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
    return COMPONENT_CATALOG.find(
      (item) => item.name.replace(/[^a-z0-9]/gi, '').toLowerCase() === name,
    );
  });
  protected readonly sourceUrl = computed(
    () =>
      `https://github.com/Aeris-UI/AerisUI/tree/main/projects/aeris-ui/${this.component()?.slug}`,
  );
  protected readonly markdownUrl = computed(
    () => `/ai/${AERIS_CURRENT_VERSION.split('.')[0]}/components/${this.component()?.slug}.md`,
  );
  private readonly abortController = new AbortController();
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.abortController.abort();
      clearTimeout(this.resetTimer);
    });
  }

  protected async copyMarkdown(): Promise<void> {
    if (!this.component() || this.copyState() === 'copying') return;
    this.copyState.set('copying');
    clearTimeout(this.resetTimer);
    try {
      if (!globalThis.navigator?.clipboard?.writeText) throw new Error('Clipboard unavailable.');
      const markdown = this.loadMarkdown();
      // Supply promised clipboard data during the click so Safari retains user activation
      // while the document is fetched. Older implementations can use writeText instead.
      if (typeof ClipboardItem !== 'undefined' && globalThis.navigator.clipboard.write) {
        await globalThis.navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': markdown.then((text) => new Blob([text], { type: 'text/plain' })),
          }),
        ]);
      } else {
        const text = await markdown;
        if (this.abortController.signal.aborted) return;
        await globalThis.navigator.clipboard.writeText(text);
      }
      if (this.abortController.signal.aborted) return;
      this.copyState.set('copied');
      this.resetTimer = setTimeout(() => this.copyState.set('idle'), 1800);
    } catch {
      if (!this.abortController.signal.aborted) this.copyState.set('error');
    }
  }
  private async loadMarkdown(): Promise<string> {
    const response = await fetch(this.markdownUrl(), { signal: this.abortController.signal });
    if (!response.ok) throw new Error('Documentation unavailable.');
    const markdown = await response.text();
    if (!markdown.startsWith('# ')) throw new Error('Invalid documentation response.');
    return markdown;
  }
  protected readonly breadcrumbItems = computed<readonly AerisBreadcrumbItem[]>(() => [
    { label: 'Components' },
    { label: this.title(), current: true },
  ]);
}
