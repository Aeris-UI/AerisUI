import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AERIS_CURRENT_VERSION } from '../../data/aeris-version';
import { COMPONENT_CATALOG } from '../../data/component-catalog';
import { GUIDE_SUMMARIES } from '../../pages/guides/guide-navigation';

const SITE_URL = 'https://aeris-ui.dev';
const SITE_NAME = 'Aeris UI';
const SOCIAL_IMAGE_URL = `${SITE_URL}/android-chrome-512x512.png`;
const DEFAULT_DESCRIPTION =
  'Aeris UI is an accessible, responsive, themeable Angular 22 component library currently in alpha.';

export interface DocsSeoMetadata {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly kind: 'home' | 'collection' | 'article' | 'page' | 'not-found';
  readonly noIndex?: boolean;
}

function normalizePath(url: string): string {
  const path = url.split(/[?#]/)[0]?.replace(/\/+$/, '') ?? '';
  return path && path.startsWith('/') ? path : `/${path}`;
}

export function resolveDocsSeo(url: string): DocsSeoMetadata {
  const path = normalizePath(url);

  if (path === '/') {
    return {
      title: 'Aeris UI - Accessible Angular 22 Component Library',
      description: DEFAULT_DESCRIPTION,
      path,
      kind: 'home',
    };
  }

  if (path === '/guides') {
    return {
      title: 'Angular UI Library Guides - Aeris UI',
      description:
        'Learn how to install, configure, theme, integrate, secure, and update Aeris UI in Angular applications.',
      path,
      kind: 'collection',
    };
  }

  const guide = GUIDE_SUMMARIES.find((item) => item.path === path);
  if (guide) {
    return {
      title: `${guide.title} Guide - Aeris UI`,
      description: guide.description,
      path,
      kind: 'article',
    };
  }

  if (path === '/components') {
    return {
      title: 'Angular Components - Aeris UI',
      description:
        'Browse accessible Angular 22 components with live examples, complete APIs, design tokens, and keyboard guidance.',
      path,
      kind: 'collection',
    };
  }

  if (path.startsWith('/components/')) {
    const slug = path.slice('/components/'.length);
    const component = COMPONENT_CATALOG.find((item) => item.slug === slug);

    if (component) {
      return {
        title: `${component.name} Angular Component - Aeris UI`,
        description: component.description,
        path,
        kind: 'article',
      };
    }

    return {
      title: 'Component not found - Aeris UI',
      description: 'The requested Aeris UI component documentation could not be found.',
      path,
      kind: 'not-found',
      noIndex: true,
    };
  }

  if (path === '/design-lab') {
    return {
      title: 'Angular Theme Design Lab - Aeris UI',
      description:
        'Create and preview an Aeris UI theme, test its contrast, and generate configuration for your Angular application.',
      path,
      kind: 'page',
    };
  }

  if (path === '/third-party-notices') {
    return {
      title: 'Third-party Notices - Aeris UI',
      description: 'Review third-party software and asset notices for the Aeris UI documentation.',
      path,
      kind: 'page',
    };
  }

  return {
    title: 'Page not found - Aeris UI',
    description: 'The requested Aeris UI documentation page could not be found.',
    path,
    kind: 'not-found',
    noIndex: true,
  };
}

@Injectable({ providedIn: 'root' })
export class DocsSeoService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.update(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.update(event.urlAfterRedirects));
  }

  private update(url: string): void {
    const seo = resolveDocsSeo(url);
    const canonicalUrl = `${SITE_URL}${seo.path}`;
    const robots = seo.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    this.title.setTitle(seo.title);
    this.updateNamedMeta('description', seo.description);
    this.updateNamedMeta('robots', robots);
    this.updateNamedMeta('author', SITE_NAME);
    this.updateNamedMeta('twitter:card', 'summary');
    this.updateNamedMeta('twitter:title', seo.title);
    this.updateNamedMeta('twitter:description', seo.description);
    this.updateNamedMeta('twitter:image', SOCIAL_IMAGE_URL);
    this.updateNamedMeta('twitter:image:alt', 'Aeris UI logo');
    this.updatePropertyMeta('og:site_name', SITE_NAME);
    this.updatePropertyMeta('og:locale', 'en_US');
    this.updatePropertyMeta('og:type', seo.kind === 'article' ? 'article' : 'website');
    this.updatePropertyMeta('og:title', seo.title);
    this.updatePropertyMeta('og:description', seo.description);
    this.updatePropertyMeta('og:url', canonicalUrl);
    this.updatePropertyMeta('og:image', SOCIAL_IMAGE_URL);
    this.updatePropertyMeta('og:image:width', '512');
    this.updatePropertyMeta('og:image:height', '512');
    this.updatePropertyMeta('og:image:alt', 'Aeris UI logo');
    this.updateCanonical(canonicalUrl);
    this.updateStructuredData(seo, canonicalUrl);
  }

  private updateNamedMeta(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name=${name}`);
  }

  private updatePropertyMeta(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property=${property}`);
  }

  private updateCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel=canonical]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.append(canonical);
    }
    canonical.href = url;
  }

  private updateStructuredData(seo: DocsSeoMetadata, canonicalUrl: string): void {
    let script = this.document.head.querySelector<HTMLScriptElement>('#aeris-structured-data');

    if (seo.noIndex) {
      script?.remove();
      return;
    }

    if (!script) {
      script = this.document.createElement('script');
      script.id = 'aeris-structured-data';
      script.type = 'application/ld+json';
      this.document.head.append(script);
    }

    script.textContent = JSON.stringify(this.createStructuredData(seo, canonicalUrl));
  }

  private createStructuredData(seo: DocsSeoMetadata, canonicalUrl: string): object {
    const organizationId = `${SITE_URL}/#organization`;
    const websiteId = `${SITE_URL}/#website`;
    const softwareId = `${SITE_URL}/#software`;
    const pageId = `${canonicalUrl}#webpage`;
    const graph: object[] = [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        sameAs: ['https://github.com/Aeris-UI/AerisUI'],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: `${SITE_NAME} Documentation`,
        url: `${SITE_URL}/`,
        description: DEFAULT_DESCRIPTION,
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': softwareId,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        codeRepository: 'https://github.com/Aeris-UI/AerisUI',
        license: 'https://opensource.org/license/mit',
        programmingLanguage: ['TypeScript', 'HTML', 'SCSS'],
        runtimePlatform: 'Angular 22',
        softwareVersion: AERIS_CURRENT_VERSION,
        isAccessibleForFree: true,
        author: { '@id': organizationId },
      },
      {
        '@type': seo.kind === 'collection' ? 'CollectionPage' : 'WebPage',
        '@id': pageId,
        name: seo.title,
        description: seo.description,
        url: canonicalUrl,
        isPartOf: { '@id': websiteId },
        about: { '@id': softwareId },
        inLanguage: 'en',
      },
    ];

    if (seo.kind === 'article') {
      graph.push({
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        headline: seo.title,
        description: seo.description,
        url: canonicalUrl,
        mainEntityOfPage: { '@id': pageId },
        isPartOf: { '@id': websiteId },
        about: { '@id': softwareId },
        author: { '@id': organizationId },
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      });
    }

    const breadcrumbs = this.createBreadcrumbs(seo);
    if (breadcrumbs.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  private createBreadcrumbs(seo: DocsSeoMetadata): readonly { name: string; path: string }[] {
    const breadcrumbs = [{ name: SITE_NAME, path: '/' }];

    if (seo.path === '/guides') return [...breadcrumbs, { name: 'Guides', path: '/guides' }];
    if (seo.path.startsWith('/guides/')) {
      return [
        ...breadcrumbs,
        { name: 'Guides', path: '/guides' },
        { name: seo.title.replace(' Guide - Aeris UI', ''), path: seo.path },
      ];
    }
    if (seo.path === '/components') {
      return [...breadcrumbs, { name: 'Components', path: '/components' }];
    }
    if (seo.path.startsWith('/components/')) {
      return [
        ...breadcrumbs,
        { name: 'Components', path: '/components' },
        { name: seo.title.replace(' Angular Component - Aeris UI', ''), path: seo.path },
      ];
    }

    return [...breadcrumbs, { name: seo.title.replace(' - Aeris UI', ''), path: seo.path }];
  }
}
