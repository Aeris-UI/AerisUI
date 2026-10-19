import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
import { AerisThemeService } from '@aeris-ui/core/theming';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideDynamicIcon } from '@lucide/angular';
import { filter } from 'rxjs';

import { COMPONENT_CATALOG } from './data/component-catalog';
import { AERIS_CURRENT_VERSION } from './data/aeris-version';
import type { DocsPaletteId } from './data/docs-palettes';
import { GUIDE_SUMMARIES } from './pages/guides/guide-navigation';
import {
  DocsAppearanceService,
  type DocsDensityId,
  type DocsDirectionId,
  type DocsRadiusId,
} from './shared/appearance/docs-appearance.service';
import { AerisLogoMarkComponent } from './shared/branding/aeris-logo-mark.component';
import { DOC_ICONS } from './shared/documentation/doc-icons';
import { DocsRouteOutletComponent } from './shared/navigation/docs-route-outlet.component';
import { DocsNavigationComponent } from './shared/navigation/docs-navigation.component';
import { DocsSeoService } from './shared/seo/docs-seo.service';
import {
  DocsSearchDialogComponent,
  type DocsSearchEntry,
} from './shared/search/docs-search-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    DocsRouteOutletComponent,
    AerisButton,
    DocsSearchDialogComponent,
    DocsNavigationComponent,
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
  private readonly appearanceTrigger = viewChild('appearanceTrigger', {
    read: ElementRef<HTMLButtonElement>,
  });
  private readonly navigationTrigger = viewChild('navigationTrigger', {
    read: ElementRef<HTMLButtonElement>,
  });
  protected readonly navigation = viewChild<DocsNavigationComponent>('docsSidebarShell');
  protected readonly icons = DOC_ICONS;
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly seo = inject(DocsSeoService);
  private readonly docsAppearance = inject(DocsAppearanceService);
  protected readonly themeService = inject(AerisThemeService);

  protected readonly sidebarOpen = signal(false);
  protected readonly navigationBreakpoint = 1120;
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
  protected readonly currentVersion = AERIS_CURRENT_VERSION;
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
  protected readonly isEmbeddedPreview = computed(() => {
    const url = this.navigationEnd()?.urlAfterRedirects ?? this.router.url;
    return (
      url.split(/[?#]/)[0] === '/components/sidebar' &&
      this.router.parseUrl(url).queryParams['preview'] === 'responsive-sidebar'
    );
  });
  private lastScrolledPath = '';

  constructor() {
    this.seo.initialize();
  }

  protected readonly searchResults = computed<readonly DocsSearchEntry[]>(() => {
    const query = this.query().trim().toLowerCase();
    const guides = GUIDE_SUMMARIES.map((guide) => ({
      name: guide.title,
      category: `Guide · ${guide.group}`,
      description: guide.description,
      path: guide.path,
      kind: 'guide' as const,
    }));
    const components = COMPONENT_CATALOG.map((component) => ({
      name: component.name,
      category: component.category,
      description: component.description,
      path: `/components/${component.slug}`,
      kind: 'component' as const,
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
    const width = this.document.defaultView?.innerWidth ?? 0;
    const sidebar = this.navigation()?.sidebar();
    if (
      width <= this.navigationBreakpoint &&
      sidebar &&
      !sidebar.mobile() &&
      this.document.getElementById(sidebar.navigationId)?.contains(this.document.activeElement)
    ) {
      this.navigationTrigger()?.nativeElement.focus({ preventScroll: true });
    }
    if (this.isLandingPage() && width > this.navigationBreakpoint) {
      this.sidebarOpen.set(false);
    }
  }
  protected toggleNavigation(event: MouseEvent): void {
    // Pointer activation must also provide a reliable Drawer return target in Safari.
    if (event.currentTarget instanceof HTMLElement)
      event.currentTarget.focus({ preventScroll: true });
    this.sidebarOpen.update((open) => !open);
  }
}
