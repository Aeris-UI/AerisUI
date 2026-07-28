import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
import { AerisThemeService } from '@aeris-ui/core/theming';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideDynamicIcon } from '@lucide/angular';
import { filter } from 'rxjs';

import {
  COMPONENT_CATALOG,
  COMPONENT_GROUPS,
  type ComponentCategory,
} from './data/component-catalog';
import { AERIS_CURRENT_VERSION } from './data/aeris-version';
import type { DocsPaletteId } from './data/docs-palettes';
import {
  GUIDE_GROUPS,
  GUIDE_SUMMARIES,
  GUIDE_SUMMARY_BY_ID,
  type GuideGroupTitle,
} from './pages/guides/guide-navigation';
import {
  DocsAppearanceService,
  type DocsDensityId,
  type DocsDirectionId,
  type DocsRadiusId,
} from './shared/appearance/docs-appearance.service';
import { AerisLogoMarkComponent } from './shared/branding/aeris-logo-mark.component';
import { DOC_ICONS } from './shared/documentation/doc-icons';
import { DocsSeoService } from './shared/seo/docs-seo.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgTemplateOutlet,
    AerisButton,
    AerisDialogModule,
    AerisDrawerModule,
    AerisIconField,
    AerisInputText,
    AerisScrollTop,
    AerisCardModule,
    AerisToolbarModule,
    LucideDynamicIcon,
    AerisLogoMarkComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:keydown)': 'handleGlobalKeydown($event)',
    '(document:click)': 'closeAppearanceMenu()',
    '(window:resize)': 'handleViewportResize()',
  },
})
export class App {
  private readonly appearanceTrigger =
    viewChild<ElementRef<HTMLButtonElement>>('appearanceTrigger');
  protected readonly icons = DOC_ICONS;
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly seo = inject(DocsSeoService);
  private readonly docsAppearance = inject(DocsAppearanceService);
  protected readonly themeService = inject(AerisThemeService);

  protected readonly sidebarOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly appearanceOpen = signal(false);
  protected readonly palettes = this.docsAppearance.palettes;
  protected readonly densities = this.docsAppearance.densities;
  protected readonly radii = this.docsAppearance.radii;
  protected readonly directions = this.docsAppearance.directions;
  protected readonly activePaletteId = this.docsAppearance.activePaletteId;
  protected readonly activePaletteName = this.docsAppearance.activePaletteName;
  protected readonly activeDensityId = this.docsAppearance.activeDensityId;
  protected readonly activeRadiusId = this.docsAppearance.activeRadiusId;
  protected readonly activeDirectionId = this.docsAppearance.activeDirectionId;
  protected readonly activeDensity = this.docsAppearance.activeDensity;
  protected readonly activeRadius = this.docsAppearance.activeRadius;
  protected readonly activeDirection = this.docsAppearance.activeDirection;
  protected readonly query = signal('');
  protected readonly theme = this.themeService.mode;
  protected readonly componentCount = COMPONENT_CATALOG.length;
  protected readonly currentVersion = AERIS_CURRENT_VERSION;
  protected readonly componentGroups = COMPONENT_GROUPS;
  protected readonly guideGroups = GUIDE_GROUPS;
  protected readonly guideArticleById = GUIDE_SUMMARY_BY_ID;
  protected readonly expandedGuideGroups = signal<ReadonlySet<GuideGroupTitle>>(
    new Set<GuideGroupTitle>(),
  );
  protected readonly expandedGroups = signal<ReadonlySet<ComponentCategory>>(
    new Set<ComponentCategory>(),
  );
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: null },
  );
  protected readonly isLandingPage = computed(() => {
    const event = this.navigationEnd();
    const path = (event?.urlAfterRedirects ?? this.router.url).split(/[?#]/)[0];
    return path === '' || path === '/';
  });
  private lastScrolledPath = '';

  constructor() {
    this.seo.initialize();
  }

  protected readonly searchResults = computed(() => {
    const query = this.query().trim().toLowerCase();
    const guides = GUIDE_SUMMARIES.map((guide) => ({
      name: guide.title,
      category: `Guide · ${guide.group}`,
      description: guide.description,
      path: guide.path,
    }));
    const components = COMPONENT_CATALOG.map((component) => ({
      name: component.name,
      category: component.category,
      description: component.description,
      path: `/components/${component.slug}`,
    }));
    const entries = [...guides, ...components];

    if (!query) return [...guides.slice(0, 5), ...components.slice(0, 3)];

    return entries
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      )
      .slice(0, 10);
  });

  private readonly expandActiveComponentGroup = effect(() => {
    this.navigationEnd();
    const slug = this.router.url.split(/[?#]/)[0]?.split('/')[2];
    const category = COMPONENT_CATALOG.find((item) => item.slug === slug)?.category;
    if (!category) return;

    this.expandedGroups.update((current) => {
      if (current.has(category)) return current;
      return new Set([...current, category]);
    });
  });

  private readonly expandActiveGuideGroup = effect(() => {
    const event = this.navigationEnd();
    const path = (event?.urlAfterRedirects ?? this.router.url).split(/[?#]/)[0];
    const group = GUIDE_SUMMARIES.find((guide) => guide.path === path)?.group;
    if (!group) return;

    this.expandedGuideGroups.update((current) => {
      if (current.has(group)) return current;
      return new Set([...current, group]);
    });
  });

  private readonly scrollToTopOnNavigation = effect(() => {
    const event = this.navigationEnd();
    if (!event) return;

    const nextPath = event.urlAfterRedirects.split(/[?#]/)[0];
    if (nextPath === this.lastScrolledPath) return;
    this.lastScrolledPath = nextPath;

    this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });

  protected cycleTheme(): void {
    this.themeService.setMode(this.themeService.resolvedMode() === 'light' ? 'dark' : 'light');
  }

  protected toggleAppearanceMenu(): void {
    this.appearanceOpen.update((open) => !open);
  }

  protected selectPalette(id: DocsPaletteId): void {
    this.docsAppearance.selectPalette(id);
  }

  protected selectDensity(id: DocsDensityId): void {
    this.docsAppearance.selectDensity(id);
  }

  protected selectRadius(id: DocsRadiusId): void {
    this.docsAppearance.selectRadius(id);
  }

  protected selectDirection(id: DocsDirectionId): void {
    this.docsAppearance.selectDirection(id);
  }

  protected closeAppearanceMenu(): void {
    this.appearanceOpen.set(false);
  }

  protected closeNavigation(): void {
    this.sidebarOpen.set(false);
  }

  protected toggleComponentGroup(category: ComponentCategory): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  protected toggleGuideGroup(group: GuideGroupTitle): void {
    this.expandedGuideGroups.update((current) => {
      const next = new Set(current);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }

  protected guideGroupId(group: GuideGroupTitle): string {
    return `sidebar-guides-${group.toLowerCase().replaceAll(' ', '-')}`;
  }

  protected componentGroupId(category: ComponentCategory): string {
    return `sidebar-components-${category.toLowerCase()}`;
  }

  protected handleGlobalKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchOpen.set(true);
    } else if (event.key === 'Escape') {
      const restoreAppearanceFocus = this.appearanceOpen();
      this.searchOpen.set(false);
      this.sidebarOpen.set(false);
      this.appearanceOpen.set(false);
      if (restoreAppearanceFocus) {
        this.appearanceTrigger()?.nativeElement.focus();
      }
    }
  }

  protected handleViewportResize(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) > 960) {
      this.sidebarOpen.set(false);
    }
  }
}
