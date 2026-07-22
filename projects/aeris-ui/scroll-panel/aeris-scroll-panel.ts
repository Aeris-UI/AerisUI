import {
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type AerisScrollPanelOrientation = 'vertical' | 'horizontal' | 'both';
export type AerisScrollPanelVariant = 'auto' | 'hover' | 'always' | 'hidden';
export type AerisScrollPanelRole = 'region' | 'group' | null;

export interface AerisScrollPanelEvent {
  readonly originalEvent: Event | null;
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly scrollHeight: number;
  readonly scrollWidth: number;
  readonly clientHeight: number;
  readonly clientWidth: number;
  readonly atTop: boolean;
  readonly atBottom: boolean;
  readonly atStart: boolean;
  readonly atEnd: boolean;
}

let nextScrollPanelId = 0;

@Component({
  selector: 'aeris-scroll-panel',
  template: `
    <div
      class="aeris-scroll-panel__frame"
      [style.block-size]="height() || null"
      [style.max-block-size]="maxHeight() || null"
      [style.inline-size]="width() || null"
      [style.max-inline-size]="maxWidth() || null"
    >
      <div
        #viewport
        class="aeris-scroll-panel__viewport"
        [id]="viewportId()"
        [attr.role]="role()"
        [attr.tabindex]="focusable() ? tabIndex() : null"
        [attr.aria-label]="resolvedAriaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        (scroll)="handleScroll($event)"
      >
        <div class="aeris-scroll-panel__content">
          <ng-content />
        </div>
      </div>
      <span class="aeris-scroll-panel__fade aeris-scroll-panel__fade--top" aria-hidden="true"></span>
      <span class="aeris-scroll-panel__fade aeris-scroll-panel__fade--bottom" aria-hidden="true"></span>
      <span class="aeris-scroll-panel__fade aeris-scroll-panel__fade--start" aria-hidden="true"></span>
      <span class="aeris-scroll-panel__fade aeris-scroll-panel__fade--end" aria-hidden="true"></span>
    </div>
  `,
  styleUrl: './aeris-scroll-panel.scss',
  host: {
    class: 'aeris-scroll-panel',
    '[attr.id]': 'id()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-fade]': 'fade() || null',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-scroll-top]': 'canScrollTop() || null',
    '[attr.data-scroll-bottom]': 'canScrollBottom() || null',
    '[attr.data-scroll-start]': 'canScrollStart() || null',
    '[attr.data-scroll-end]': 'canScrollEnd() || null',
  },
})
export class AerisScrollPanel {
  private readonly instanceId = ++nextScrollPanelId;
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  protected readonly canScrollTop = signal(false);
  protected readonly canScrollBottom = signal(false);
  protected readonly canScrollStart = signal(false);
  protected readonly canScrollEnd = signal(false);

  readonly id = input(`aeris-scroll-panel-${this.instanceId}`);
  readonly orientation = input<AerisScrollPanelOrientation>('vertical');
  readonly variant = input<AerisScrollPanelVariant>('auto');
  readonly fade = input(false, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly focusable = input(true, { transform: booleanAttribute });
  readonly tabIndex = input(0, { transform: numberAttribute });
  readonly height = input('14rem');
  readonly maxHeight = input('');
  readonly width = input('100%');
  readonly maxWidth = input('');
  readonly role = input<AerisScrollPanelRole>('region');
  readonly ariaLabel = input('Scrollable content');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly scrolled = output<AerisScrollPanelEvent>();
  readonly reachedTop = output<AerisScrollPanelEvent>();
  readonly reachedBottom = output<AerisScrollPanelEvent>();
  readonly reachedStart = output<AerisScrollPanelEvent>();
  readonly reachedEnd = output<AerisScrollPanelEvent>();

  protected readonly viewportId = computed(() => `${this.id()}-viewport`);
  protected readonly resolvedAriaLabel = computed(() =>
    this.ariaLabelledBy() ? null : this.ariaLabel() || null,
  );

  constructor() {
    afterNextRender(() => this.refresh());
  }

  scrollTo(options: ScrollToOptions): void {
    this.viewportElement()?.scrollTo(options);
  }

  scrollBy(options: ScrollToOptions): void {
    this.viewportElement()?.scrollBy(options);
  }

  scrollToTop(options: ScrollOptions = {}): void {
    this.scrollTo({ ...options, top: 0 });
  }

  scrollToBottom(options: ScrollOptions = {}): void {
    const viewport = this.viewportElement();
    if (!viewport) return;
    this.scrollTo({ ...options, top: viewport.scrollHeight - viewport.clientHeight });
  }

  scrollToStart(options: ScrollOptions = {}): void {
    this.scrollTo({ ...options, left: 0 });
  }

  scrollToEnd(options: ScrollOptions = {}): void {
    const viewport = this.viewportElement();
    if (!viewport) return;
    this.scrollTo({ ...options, left: viewport.scrollWidth - viewport.clientWidth });
  }

  refresh(): void {
    const viewport = this.viewportElement();
    if (!viewport) return;
    this.updateScrollState(this.createScrollEvent(viewport, null));
  }

  protected handleScroll(event: Event): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const scrollEvent = this.createScrollEvent(target, event);
    this.updateScrollState(scrollEvent);
    this.scrolled.emit(scrollEvent);
    if (scrollEvent.atTop) this.reachedTop.emit(scrollEvent);
    if (scrollEvent.atBottom) this.reachedBottom.emit(scrollEvent);
    if (scrollEvent.atStart) this.reachedStart.emit(scrollEvent);
    if (scrollEvent.atEnd) this.reachedEnd.emit(scrollEvent);
  }

  private viewportElement(): HTMLElement | null {
    return this.viewport()?.nativeElement ?? null;
  }

  private createScrollEvent(viewport: HTMLElement, originalEvent: Event | null): AerisScrollPanelEvent {
    const tolerance = 1;
    const maxTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const maxLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const scrollTop = viewport.scrollTop;
    const scrollLeft = viewport.scrollLeft;

    return {
      originalEvent,
      scrollTop,
      scrollLeft,
      scrollHeight: viewport.scrollHeight,
      scrollWidth: viewport.scrollWidth,
      clientHeight: viewport.clientHeight,
      clientWidth: viewport.clientWidth,
      atTop: scrollTop <= tolerance,
      atBottom: maxTop - scrollTop <= tolerance,
      atStart: scrollLeft <= tolerance,
      atEnd: maxLeft - scrollLeft <= tolerance,
    };
  }

  private updateScrollState(event: AerisScrollPanelEvent): void {
    this.canScrollTop.set(!event.atTop);
    this.canScrollBottom.set(!event.atBottom);
    this.canScrollStart.set(!event.atStart);
    this.canScrollEnd.set(!event.atEnd);
  }
}

export const AerisScrollPanelModule = [AerisScrollPanel] as const;
