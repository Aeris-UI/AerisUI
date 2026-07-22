import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type AerisCarouselOrientation = 'horizontal' | 'vertical';
export type AerisCarouselChangeReason = 'next' | 'previous' | 'indicator' | 'keyboard' | 'swipe' | 'autoplay' | 'api';

export interface AerisCarouselResponsiveOption {
  readonly breakpoint: string;
  readonly numVisible?: number;
  readonly numScroll?: number;
}

export interface AerisCarouselItemContext<T = unknown> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly visible: boolean;
}

export interface AerisCarouselPageEvent {
  readonly page: number;
  readonly first: number;
  readonly last: number;
  readonly reason: AerisCarouselChangeReason;
}

interface AerisCarouselItemView<T> {
  readonly item: T;
  readonly index: number;
  readonly context: AerisCarouselItemContext<T>;
}

@Directive({ selector: 'ng-template[aerisCarouselItem]' })
export class AerisCarouselItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisCarouselItemContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisCarouselItemTemplate<T>,
    context: unknown,
  ): context is AerisCarouselItemContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisCarouselHeader]' })
export class AerisCarouselHeaderTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisCarouselFooter]' })
export class AerisCarouselFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Component({
  selector: 'aeris-carousel',
  imports: [NgTemplateOutlet],
  template: `
    <section class="aeris-carousel" [attr.aria-label]="ariaLabel()" [attr.aria-roledescription]="'carousel'">
      <ng-template #indicatorList>
        <div class="aeris-carousel__indicators" [attr.data-orientation]="orientation()" role="group" [attr.aria-label]="indicatorAriaLabel()">
          @for (indicator of indicators(); track indicator.page) {
            <button
              type="button"
              [attr.aria-label]="indicator.label"
              [attr.aria-current]="indicator.page === currentPage() ? 'page' : null"
              (click)="goToPage(indicator.page, 'indicator')"
            ></button>
          }
        </div>
      </ng-template>

      @if (headerTemplate(); as header) {
        <div class="aeris-carousel__header"><ng-container [ngTemplateOutlet]="header.template" /></div>
      }

      <div class="aeris-carousel__content" [attr.data-orientation]="orientation()">
        @if (showNavigators() && pageCount() > 1) {
          <button
            class="aeris-carousel__navigator aeris-carousel__navigator--previous"
            type="button"
            [attr.aria-label]="previousAriaLabel()"
            [disabled]="previousDisabled()"
            (click)="previous('previous')"
          ><span aria-hidden="true"></span></button>
        }

        <div
          class="aeris-carousel__viewport"
          tabindex="0"
          [attr.aria-live]="autoplayInterval() > 0 ? 'off' : 'polite'"
          [style.block-size]="orientation() === 'vertical' ? verticalViewportHeight() : null"
          (keydown)="handleViewportKeydown($event)"
          (pointerdown)="handlePointerDown($event)"
          (pointermove)="handlePointerMove($event)"
          (pointerup)="handlePointerUp($event)"
          (pointercancel)="clearPointer()"
          (pointerenter)="setHoverPaused(true)"
          (pointerleave)="setHoverPaused(false)"
          (focusin)="setFocusPaused(true)"
          (focusout)="handleFocusOut($event)"
        >
          <div
            class="aeris-carousel__track"
            [attr.data-orientation]="orientation()"
            [style.inline-size]="trackInlineSize()"
            [style.block-size]="trackBlockSize()"
            [style.transform]="trackTransform()"
            [attr.data-dragging]="dragging() || null"
          >
            @for (view of itemViews(); track view.index) {
              <article
                class="aeris-carousel__item"
                [attr.aria-hidden]="view.context.visible ? null : 'true'"
                [attr.inert]="view.context.visible ? null : ''"
                [style.--aeris-carousel-visible]="visibleCount()"
                [style.--aeris-carousel-item-count]="value().length"
              >
                @if (itemTemplate(); as template) {
                  <ng-container [ngTemplateOutlet]="template.template" [ngTemplateOutletContext]="view.context" />
                } @else {
                  <span class="aeris-carousel__default-item">{{ view.item }}</span>
                }
              </article>
            }
          </div>
        </div>

        @if (orientation() === 'vertical' && showIndicators() && pageCount() > 1) {
          <ng-container [ngTemplateOutlet]="indicatorList" />
        }

        @if (showNavigators() && pageCount() > 1) {
          <button
            class="aeris-carousel__navigator aeris-carousel__navigator--next"
            type="button"
            [attr.aria-label]="nextAriaLabel()"
            [disabled]="nextDisabled()"
            (click)="next('next')"
          ><span aria-hidden="true"></span></button>
        }
      </div>

      @if (orientation() === 'horizontal' && showIndicators() && pageCount() > 1) {
        <ng-container [ngTemplateOutlet]="indicatorList" />
      }

      @if (footerTemplate(); as footer) {
        <div class="aeris-carousel__footer"><ng-container [ngTemplateOutlet]="footer.template" /></div>
      }
    </section>
  `,
  styleUrl: './aeris-carousel.scss',
  host: {
    class: 'aeris-carousel-host',
    '[attr.data-orientation]': 'orientation()',
  },
})
export class AerisCarousel<T = unknown> {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly viewportWidth = signal(0);
  private readonly hoverPaused = signal(false);
  private readonly focusPaused = signal(false);
  private readonly autoplayStopped = signal(false);
  private readonly paused = computed(() =>
    this.hoverPaused() || this.focusPaused() || this.autoplayStopped(),
  );
  private readonly pointerStart = signal<number | null>(null);
  private readonly dragOffset = signal(0);
  protected readonly dragging = signal(false);
  private resizeObserver: ResizeObserver | null = null;

  protected readonly itemTemplate = contentChild(AerisCarouselItemTemplate<T>);
  protected readonly headerTemplate = contentChild(AerisCarouselHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisCarouselFooterTemplate);

  readonly value = input<readonly T[]>([]);
  readonly page = model(0);
  readonly numVisible = input(1);
  readonly numScroll = input(1);
  readonly responsiveOptions = input<readonly AerisCarouselResponsiveOption[]>([]);
  readonly circular = input(false, { transform: booleanAttribute });
  readonly showNavigators = input(true, { transform: booleanAttribute });
  readonly showIndicators = input(true, { transform: booleanAttribute });
  readonly autoplayInterval = input(0);
  readonly pauseOnHover = input(true, { transform: booleanAttribute });
  readonly orientation = input<AerisCarouselOrientation>('horizontal');
  readonly verticalViewportHeight = input('20rem');
  readonly ariaLabel = input('Carousel');
  readonly indicatorAriaLabel = input('Carousel pages');
  readonly previousAriaLabel = input('Previous items');
  readonly nextAriaLabel = input('Next items');

  readonly pageChanged = output<AerisCarouselPageEvent>();

  protected readonly resolvedSettings = computed(() => {
    const base = {
      numVisible: this.safeCount(this.numVisible()),
      numScroll: this.safeCount(this.numScroll()),
    };
    const width = this.viewportWidth();
    if (!width) return base;

    const matching = [...this.responsiveOptions()]
      .map((option) => ({ option, pixels: this.breakpointPixels(option.breakpoint) }))
      .filter((option) => option.pixels > 0 && width <= option.pixels)
      .sort((left, right) => left.pixels - right.pixels)[0]?.option;

    return {
      numVisible: this.safeCount(matching?.numVisible ?? base.numVisible),
      numScroll: this.safeCount(matching?.numScroll ?? base.numScroll),
    };
  });

  protected readonly visibleCount = computed(() =>
    Math.min(this.value().length || 1, this.resolvedSettings().numVisible),
  );
  protected readonly pageCount = computed(() => {
    const length = this.value().length;
    if (length <= this.visibleCount()) return 1;
    return Math.ceil((length - this.visibleCount()) / this.resolvedSettings().numScroll) + 1;
  });
  protected readonly currentPage = computed(() =>
    Math.min(Math.max(this.page(), 0), this.pageCount() - 1),
  );
  protected readonly firstVisibleIndex = computed(() =>
    Math.min(
      this.currentPage() * this.resolvedSettings().numScroll,
      Math.max(0, this.value().length - this.visibleCount()),
    ),
  );
  protected readonly lastVisibleIndex = computed(() =>
    Math.min(this.value().length - 1, this.firstVisibleIndex() + this.visibleCount() - 1),
  );
  protected readonly itemViews = computed<readonly AerisCarouselItemView<T>[]>(() => {
    const first = this.firstVisibleIndex();
    const last = this.lastVisibleIndex();
    return this.value().map((item, index) => ({
      item,
      index,
      context: { $implicit: item, item, index, visible: index >= first && index <= last },
    }));
  });
  protected readonly indicators = computed(() =>
    Array.from({ length: this.pageCount() }, (_, page) => ({
      page,
      label: `Show items ${this.indicatorRange(page)}`,
    })),
  );
  protected readonly previousDisabled = computed(() => !this.circular() && this.currentPage() === 0);
  protected readonly nextDisabled = computed(() =>
    !this.circular() && this.currentPage() >= this.pageCount() - 1,
  );
  protected readonly trackInlineSize = computed(() =>
    this.orientation() === 'horizontal' ? `${(this.value().length / this.visibleCount()) * 100}%` : null,
  );
  protected readonly trackBlockSize = computed(() =>
    this.orientation() === 'vertical' ? `${(this.value().length / this.visibleCount()) * 100}%` : null,
  );
  protected readonly trackTransform = computed(() => {
    const total = Math.max(1, this.value().length);
    const offset = (this.firstVisibleIndex() / total) * 100;
    const dragOffset = this.dragOffset();
    if (this.orientation() === 'vertical') return `translate3d(0, calc(-${offset}% + ${dragOffset}px), 0)`;
    const direction = this.isRtl() ? offset : -offset;
    return `translate3d(calc(${direction}% + ${dragOffset}px), 0, 0)`;
  });

  constructor() {
    afterNextRender(() => this.observeSize());
    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());

    effect((onCleanup) => {
      const interval = this.autoplayInterval();
      const canPlay = interval > 0 && this.pageCount() > 1 && !this.paused();
      if (!canPlay || !this.browser) return;

      const timer = setInterval(() => this.next('autoplay'), interval);
      onCleanup(() => clearInterval(timer));
    });
  }

  next(reason: AerisCarouselChangeReason = 'api'): void {
    const pageCount = this.pageCount();
    if (pageCount <= 1) return;
    const current = this.currentPage();
    if (current >= pageCount - 1 && !this.circular()) return;
    this.changePage(current >= pageCount - 1 ? 0 : current + 1, reason);
  }

  previous(reason: AerisCarouselChangeReason = 'api'): void {
    const pageCount = this.pageCount();
    if (pageCount <= 1) return;
    const current = this.currentPage();
    if (current <= 0 && !this.circular()) return;
    this.changePage(current <= 0 ? pageCount - 1 : current - 1, reason);
  }

  goToPage(page: number, reason: AerisCarouselChangeReason = 'api'): void {
    const target = Math.min(Math.max(0, Math.floor(page)), this.pageCount() - 1);
    if (target === this.currentPage()) return;
    this.changePage(target, reason);
  }

  startAutoplay(): void {
    this.autoplayStopped.set(false);
  }

  stopAutoplay(): void {
    this.autoplayStopped.set(true);
  }

  protected handleViewportKeydown(event: KeyboardEvent): void {
    const nextKey = this.orientation() === 'vertical' ? 'ArrowDown' : this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = this.orientation() === 'vertical' ? 'ArrowUp' : this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === nextKey) {
      event.preventDefault();
      this.next('keyboard');
    } else if (event.key === previousKey) {
      event.preventDefault();
      this.previous('keyboard');
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.goToPage(0, 'keyboard');
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goToPage(this.pageCount() - 1, 'keyboard');
    }
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.pointerStart.set(this.orientation() === 'vertical' ? event.clientY : event.clientX);
    this.dragOffset.set(0);
    this.dragging.set(true);
  }

  protected handlePointerMove(event: PointerEvent): void {
    const start = this.pointerStart();
    if (start === null) return;
    event.preventDefault();
    const point = this.orientation() === 'vertical' ? event.clientY : event.clientX;
    this.dragOffset.set(point - start);
  }

  protected handlePointerUp(event: PointerEvent): void {
    const start = this.pointerStart();
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget.hasPointerCapture?.(event.pointerId)) currentTarget.releasePointerCapture(event.pointerId);
    if (start === null) {
      this.clearPointer();
      return;
    }
    const end = this.orientation() === 'vertical' ? event.clientY : event.clientX;
    const distance = end - start;
    this.clearPointer();
    if (Math.abs(distance) < 32) return;

    const viewportSize = this.orientation() === 'vertical'
      ? currentTarget.clientHeight
      : currentTarget.clientWidth;
    const stepSize = viewportSize > 0
      ? (viewportSize / this.visibleCount()) * this.resolvedSettings().numScroll
      : 80;
    const pageDelta = Math.max(1, Math.round(Math.abs(distance) / stepSize));
    const direction = this.dragDirection(distance);
    this.goToPage(this.dragTargetPage(this.currentPage() + direction * pageDelta), 'swipe');
  }

  protected clearPointer(): void {
    this.pointerStart.set(null);
    this.dragOffset.set(0);
    this.dragging.set(false);
  }

  protected setHoverPaused(paused: boolean): void {
    if (this.pauseOnHover()) this.hoverPaused.set(paused);
  }

  protected setFocusPaused(paused: boolean): void {
    if (this.pauseOnHover()) this.focusPaused.set(paused);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.host.nativeElement.contains(next)) return;
    this.setFocusPaused(false);
  }

  private changePage(page: number, reason: AerisCarouselChangeReason): void {
    this.page.set(page);
    this.pageChanged.emit({
      page,
      first: Math.min(page * this.resolvedSettings().numScroll, Math.max(0, this.value().length - this.visibleCount())),
      last: Math.min(this.value().length - 1, page * this.resolvedSettings().numScroll + this.visibleCount() - 1),
      reason,
    });
  }

  private dragDirection(distance: number): number {
    const direction = distance < 0 ? 1 : -1;
    return this.orientation() === 'horizontal' && this.isRtl() ? -direction : direction;
  }

  private dragTargetPage(page: number): number {
    const pageCount = this.pageCount();
    if (!this.circular()) return Math.min(Math.max(0, page), pageCount - 1);
    return ((page % pageCount) + pageCount) % pageCount;
  }

  private observeSize(): void {
    if (!this.browser || typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) this.viewportWidth.set(width);
    });
    this.resizeObserver.observe(this.host.nativeElement);
  }

  private safeCount(value: number): number {
    return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
  }

  private breakpointPixels(value: string): number {
    const match = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(value.trim());
    if (!match) return 0;
    const amount = Number(match[1]);
    const unit = match[2] ?? 'px';
    if (unit === 'px') return amount;
    const rootSize = Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize) || 16;
    return amount * rootSize;
  }

  private indicatorRange(page: number): string {
    const first = Math.min(page * this.resolvedSettings().numScroll, Math.max(0, this.value().length - this.visibleCount()));
    const last = Math.min(this.value().length, first + this.visibleCount());
    return `${first + 1} to ${last}`;
  }

  private isRtl(): boolean {
    return this.document.documentElement.dir === 'rtl';
  }
}

export const AerisCarouselModule = [
  AerisCarousel,
  AerisCarouselItemTemplate,
  AerisCarouselHeaderTemplate,
  AerisCarouselFooterTemplate,
] as const;
