import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

export interface PageTocLink {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-page-toc',
  template: `
    <aside [attr.aria-label]="ariaLabel()">
      <span>{{ title() }}</span>
      <nav>
        @if (showTopLink()) {
          <a
            href="#"
            [attr.aria-current]="activeId() === topLinkId ? 'location' : null"
            (click)="navigateToTop($event)"
          >
            {{ topLinkLabel() }}
          </a>
        }
        @for (link of visibleLinks(); track link.id) {
          <a
            [href]="'#' + link.id"
            [attr.aria-current]="activeId() === link.id ? 'location' : null"
            (click)="navigate($event, link.id)"
          >
            {{ link.label }}
          </a>
        }
      </nav>
    </aside>
  `,
  styleUrl: './page-toc.component.scss',
  host: {
    '[attr.title]': 'null',
  },
})
export class PageTocComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private animationFrame: number | undefined;

  protected readonly topLinkId = '__page_top__';

  readonly title = input.required<string>();
  readonly ariaLabel = input.required<string>();
  readonly links = input.required<readonly PageTocLink[]>();
  readonly showTopLink = input(true);
  readonly topLinkLabel = input('Import');

  protected readonly activeId = signal<string | null>(null);

  protected readonly visibleLinks = computed(() =>
    this.links().filter((link) => link.label.trim().toLowerCase() !== 'import'),
  );

  private readonly refreshAfterRender = afterRenderEffect(() => {
    this.visibleLinks();
    this.showTopLink();
    this.scheduleActiveSectionUpdate();
  });

  protected navigateToTop(event: MouseEvent): void {
    event.preventDefault();
    this.activeId.set(this.topLinkId);
    this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: this.scrollBehavior() });
    this.document.defaultView?.history.replaceState(
      null,
      '',
      `${this.document.location.pathname}${this.document.location.search}`,
    );
    this.document.getElementById('docs-content')?.focus({ preventScroll: true });
  }

  protected navigate(event: MouseEvent, targetId: string): void {
    event.preventDefault();
    const target = this.document.getElementById(targetId);
    if (!target) return;

    const window = this.document.defaultView;
    const scrollY = window?.scrollY ?? this.document.documentElement.scrollTop ?? 0;
    const top = Math.max(0, target.getBoundingClientRect().top + scrollY - this.headerOffset());

    this.activeId.set(targetId);
    window?.scrollTo({ top, left: 0, behavior: this.scrollBehavior() });
    this.document.defaultView?.history.replaceState(
      null,
      '',
      `${this.document.location.pathname}${this.document.location.search}#${targetId}`,
    );
    target.focus({ preventScroll: true });
  }

  private headerOffset(): number {
    const header = this.document.querySelector<HTMLElement>('.docs-header');
    const tabs = this.document.querySelector<HTMLElement>('.aeris-tabs__list');
    return (
      (header?.getBoundingClientRect().height ?? 0) +
      (tabs?.getBoundingClientRect().height ?? 0) +
      24
    );
  }

  private scheduleActiveSectionUpdate(): void {
    const window = this.document.defaultView;
    if (!window || this.animationFrame !== undefined) return;

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.updateActiveSection();
    });
  }

  private updateActiveSection(): void {
    const window = this.document.defaultView;
    if (!window) return;

    const targets = this.visibleLinks()
      .map((link) => ({ link, element: this.document.getElementById(link.id) }))
      .filter(
        (entry): entry is { link: PageTocLink; element: HTMLElement } =>
          entry.element !== null && entry.element.getClientRects().length > 0,
      );
    if (!targets.length) {
      this.activeId.set(this.showTopLink() ? this.topLinkId : null);
      return;
    }

    const trackingLine = this.headerOffset() + 8;
    let active = this.showTopLink() ? this.topLinkId : targets[0]!.link.id;
    for (const target of targets) {
      if (target.element.getBoundingClientRect().top > trackingLine) break;
      active = target.link.id;
    }

    const atPageEnd =
      window.scrollY + window.innerHeight >= this.document.documentElement.scrollHeight - 2;
    if (atPageEnd) active = targets.at(-1)!.link.id;
    this.activeId.set(active);
  }

  private scrollBehavior(): ScrollBehavior {
    return this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
  }

  constructor() {
    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;

      const update = (): void => this.scheduleActiveSectionUpdate();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      this.scheduleActiveSectionUpdate();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        if (this.animationFrame !== undefined) {
          window.cancelAnimationFrame(this.animationFrame);
        }
      });
    });
  }
}
