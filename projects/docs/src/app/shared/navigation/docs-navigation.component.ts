import {
  Component,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AerisSidebarModule, type AerisSidebar } from '@aeris-ui/core/sidebar';
import { AerisButton } from '@aeris-ui/core/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { filter } from 'rxjs';
import {
  COMPONENT_CATALOG,
  COMPONENT_GROUPS,
  type ComponentCategory,
} from '../../data/component-catalog';
import { AERIS_CURRENT_VERSION } from '../../data/aeris-version';
import {
  GUIDE_GROUPS,
  GUIDE_SUMMARIES,
  GUIDE_SUMMARY_BY_ID,
  type GuideGroupTitle,
} from '../../pages/guides/guide-navigation';
import { DOC_ICONS } from '../documentation/doc-icons';
import { DocsRoutePrefetchService } from './docs-route-prefetch.service';

@Component({
  selector: 'app-docs-navigation',
  imports: [AerisSidebarModule, AerisButton, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './docs-navigation.component.html',
  styleUrl: './docs-navigation.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: { '[attr.data-mobile]': 'sidebar()?.mobile() || null' },
})
export class DocsNavigationComponent {
  readonly open = model(false);
  readonly landing = input(false);
  readonly breakpoint = input(1120);
  readonly sidebar = viewChild<AerisSidebar>('sidebar');
  protected readonly icons = DOC_ICONS;
  protected readonly currentVersion = AERIS_CURRENT_VERSION;
  protected readonly componentCount = COMPONENT_CATALOG.length;
  protected readonly componentGroups = COMPONENT_GROUPS;
  protected readonly guideGroups = GUIDE_GROUPS;
  protected readonly guideArticleById = GUIDE_SUMMARY_BY_ID;
  protected readonly expandedGroups = signal<ReadonlySet<ComponentCategory>>(new Set());
  protected readonly expandedGuideGroups = signal<ReadonlySet<GuideGroupTitle>>(new Set());
  private readonly router = inject(Router);
  private readonly prefetcher = inject(DocsRoutePrefetchService);
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const path = (this.navigationEnd()?.urlAfterRedirects ?? this.router.url).split(/[?#]/)[0];
      const category = COMPONENT_CATALOG.find(
        (item) => path === `/components/${item.slug}`,
      )?.category;
      const guideGroup = GUIDE_SUMMARIES.find((guide) => guide.path === path)?.group;
      if (category) this.setComponentGroupExpanded(category, true);
      if (guideGroup) this.setGuideGroupExpanded(guideGroup, true);
    });
  }

  protected setComponentGroupExpanded(category: ComponentCategory, expanded: boolean): void {
    this.expandedGroups.update((current) => {
      if (current.has(category) === expanded) return current;
      const next = new Set(current);
      if (expanded) next.add(category);
      else next.delete(category);
      return next;
    });
  }
  protected setGuideGroupExpanded(group: GuideGroupTitle, expanded: boolean): void {
    this.expandedGuideGroups.update((current) => {
      if (current.has(group) === expanded) return current;
      const next = new Set(current);
      if (expanded) next.add(group);
      else next.delete(group);
      return next;
    });
  }
  protected prefetchRoute(path: string): void {
    this.prefetcher.prefetch(path);
  }
}
