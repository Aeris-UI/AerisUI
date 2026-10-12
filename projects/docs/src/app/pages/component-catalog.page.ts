import {
  Component,
  computed,
  signal,
  afterNextRender,
  afterRenderEffect,
  DestroyRef,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon } from '@lucide/angular';

import {
  COMPONENT_CATALOG,
  COMPONENT_CATEGORIES,
  type ComponentCategory,
} from '../data/component-catalog';
import { CatalogPreviewComponent } from '../shared/catalog/catalog-preview.component';
import { DOC_ICONS } from '../shared/documentation/doc-icons';

@Component({
  selector: 'app-component-catalog-page',
  imports: [
    RouterLink,
    AerisButton,
    AerisCardModule,
    AerisIconField,
    AerisInputText,
    LucideDynamicIcon,
    CatalogPreviewComponent,
  ],
  templateUrl: './component-catalog.page.html',
  styleUrl: './component-catalog.page.scss',
})
export class ComponentCatalogPage {
  protected readonly icons = DOC_ICONS;
  protected readonly catalog = COMPONENT_CATALOG;
  protected readonly categories = COMPONENT_CATEGORIES;
  protected readonly query = signal('');
  protected readonly category = signal<ComponentCategory | 'All'>('All');
  protected readonly activePreview = signal<string | null>(null);
  protected readonly elevatedPreview = signal<string | null>(null);
  protected readonly mobilePreviews = signal<ReadonlySet<string>>(new Set());
  private readonly mobileMotion = signal(false);
  private readonly cards = viewChildren('previewCard', {
    read: ElementRef<HTMLElement>,
  });
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    return this.catalog.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (!query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)),
    );
  });

  constructor() {
    afterNextRender(() => {
      const touch = matchMedia('(hover: none)');
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => this.mobileMotion.set(touch.matches && !reduced.matches);
      update();
      touch.addEventListener('change', update);
      reduced.addEventListener('change', update);
      this.destroyRef.onDestroy(() => {
        touch.removeEventListener('change', update);
        reduced.removeEventListener('change', update);
      });
    });
    afterRenderEffect((onCleanup) => {
      const cards = this.cards();
      if (!this.mobileMotion() || typeof IntersectionObserver === 'undefined') return;
      const headerHeight =
        this.document.querySelector('.docs-header')?.getBoundingClientRect().height ?? 0;
      const observer = new IntersectionObserver(
        (entries) => {
          this.mobilePreviews.update((current) => {
            const next = new Set(current);
            for (const entry of entries) {
              const kind = (entry.target as HTMLElement).dataset['previewKind'];
              if (!kind) continue;
              if (entry.intersectionRatio === 1) next.add(kind);
              else if (!entry.isIntersecting) next.delete(kind);
            }
            return next;
          });
        },
        { threshold: [0, 1], rootMargin: `-${headerHeight}px 0px 0px` },
      );
      for (const card of cards) observer.observe(card.nativeElement);
      onCleanup(() => {
        observer.disconnect();
        this.mobilePreviews.set(new Set());
      });
    });
  }

  protected handleQueryInput(event: Event): void {
    if (event.target instanceof HTMLInputElement) this.query.set(event.target.value);
  }

  protected activatePreview(kind: string, event?: PointerEvent): void {
    if (
      typeof matchMedia === 'undefined' ||
      (event && (event.pointerType !== 'mouse' || !matchMedia('(hover: hover)').matches))
    )
      return;
    this.elevatedPreview.set(kind);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this.activePreview.set(kind);
  }

  protected resetPreview(): void {
    this.activePreview.set(null);
    this.elevatedPreview.set(null);
  }
}
