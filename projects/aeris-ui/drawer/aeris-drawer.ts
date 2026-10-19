import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  afterRenderEffect,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ɵAerisIcon,
  ɵAerisAppendTo,
  aerisInternalFocusInitialElement,
  aerisInternalTrapTabFocus,
  aerisInternalCreateFrameScheduler,
  aerisInternalViewportBounds,
  ɵisTopmostAerisOverlay,
  ɵlockAerisDocumentScroll,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
  ɵunlockAerisDocumentScroll,
  type AerisAppendTo,
} from '@aeris-ui/core';
import { AerisDrawerSwipe } from './aeris-drawer-swipe';
import {
  drawerSnapIndex,
  normalizeDrawerSnapPoints,
  type AerisDrawerSnapPoint,
} from './aeris-drawer-snap';

export type { AerisDrawerSnapPoint } from './aeris-drawer-snap';

export type AerisDrawerCloseReason = 'api' | 'close-button' | 'escape' | 'mask' | 'swipe';
export type AerisDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type AerisDrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type AerisDrawerFooterLayout = 'responsive' | 'wrap' | 'stack' | 'inline';

export interface AerisDrawerVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDrawerCloseReason;
}

export interface AerisDrawerTemplateContext {
  readonly $implicit: AerisDrawer;
  readonly close: (event?: Event) => void;
  readonly position: AerisDrawerPosition;
  readonly maximized: boolean;
}

@Directive({ selector: 'ng-template[aerisDrawerHeader]' })
export class AerisDrawerHeaderTemplate {
  readonly template = inject<TemplateRef<AerisDrawerTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDrawerFooter]' })
export class AerisDrawerFooterTemplate {
  readonly template = inject<TemplateRef<AerisDrawerTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDrawerCloseIcon]' })
export class AerisDrawerCloseIconTemplate {
  readonly template = inject<TemplateRef<AerisDrawerTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDrawerHeadless]' })
export class AerisDrawerHeadlessTemplate {
  readonly template = inject<TemplateRef<AerisDrawerTemplateContext>>(TemplateRef);
}

let nextDrawerId = 0;
const DRAWER_EXIT_DURATION_MS = 220;
const DRAWER_FOCUS_OPTIONS = {
  includeContentEditable: true,
  checkComputedVisibility: true,
} as const;

@Component({
  selector: 'aeris-drawer',
  imports: [ɵAerisIcon, NgTemplateOutlet, ɵAerisAppendTo],
  template: `
    @if (rendered()) {
      <div
        class="aeris-drawer__overlay"
        [aerisInternalAppendTo]="appendTo()"
        aerisInternalAppendToDefault="body"
        [attr.data-modal]="modal() || null"
        [attr.data-backdrop]="backdrop() || null"
        [attr.data-backdrop-blur]="backdrop() && backdropBlur() ? true : null"
        [style.--aeris-drawer-backdrop-blur]="backdropBlurAmount() || null"
        [attr.data-position]="position()"
        [attr.data-maximized]="maximized() || null"
        [attr.data-state]="animationState()"
        [attr.data-swipe-enabled]="(swipeToClose() && !maximized()) || null"
        [attr.data-swiping]="swiping() || null"
        [style.--_aeris-drawer-swipe-progress]="swipeProgress()"
        [attr.aria-hidden]="visible() ? null : 'true'"
        [attr.inert]="visible() ? null : ''"
        (click)="handleOverlayClick($event)"
      >
        <section
          #drawerPanel
          class="aeris-drawer__panel"
          role="dialog"
          tabindex="-1"
          [attr.aria-modal]="visible() ? modal() : null"
          [attr.aria-label]="visible() && ariaLabel() ? ariaLabel() : null"
          [attr.aria-labelledby]="visible() ? computedAriaLabelledBy() : null"
          [attr.aria-describedby]="visible() && ariaDescribedBy() ? ariaDescribedBy() : null"
          [attr.data-position]="position()"
          [attr.data-size]="size()"
          [attr.data-state]="animationState()"
          [attr.data-headless]="headlessTemplate() ? true : null"
          [attr.data-mobile-fullscreen]="mobileFullScreen() || null"
          [attr.data-maximized]="maximized() || null"
          [attr.data-swipe-enabled]="((swipeToClose() || snapEnabled()) && !maximized()) || null"
          [attr.data-swipe-handle]="
            ((swipeToClose() || snapEnabled()) && swipeHandle() && !maximized()) || null
          "
          [attr.data-snap-points]="snapEnabled() || null"
          [attr.data-swiping]="swiping() || null"
          [style.transform]="swipeTransform()"
          [style.--aeris-drawer-width]="width() || null"
          [style.--aeris-drawer-height]="height() || null"
          [style.--aeris-drawer-max-width]="maxWidth() || null"
          [style.--aeris-drawer-max-height]="maxHeight() || null"
          [style.--aeris-drawer-mobile-width]="mobileWidth() || null"
          [style.--aeris-drawer-mobile-height]="mobileHeight() || null"
          [style.height.px]="snapEnabled() ? (snapDragHeight() ?? currentSnapHeight()) : null"
          [style.max-height.px]="snapEnabled() ? availableSnapHeight() : null"
          (keydown)="handlePanelKeydown($event)"
          (pointerdown)="startSwipe($event)"
          (pointermove)="swipe.move($event)"
          (pointerup)="swipe.end($event, swipeThreshold())"
          (pointercancel)="swipe.end($event, swipeThreshold())"
          (lostpointercapture)="swipe.end($event, swipeThreshold())"
        >
          @if (snapEnabled() && swipeHandle()) {
            <div
              class="aeris-drawer__swipe-handle"
              role="slider"
              tabindex="0"
              aria-orientation="vertical"
              [attr.aria-label]="snapAriaLabel()"
              [attr.aria-valuemin]="minimumSnapHeight()"
              [attr.aria-valuemax]="maximumSnapHeight()"
              [attr.aria-valuenow]="currentSnapHeight()"
              [attr.aria-valuetext]="snapValueText()"
              (keydown)="handleSnapKeydown($event)"
            >
              <span aria-hidden="true"></span>
            </div>
          } @else if (swipeToClose() && swipeHandle() && !maximized()) {
            <button
              type="button"
              class="aeris-drawer__swipe-handle"
              [attr.aria-label]="closeAriaLabel()"
              (click)="hide($event, 'close-button')"
            >
              <span aria-hidden="true"></span>
            </button>
          }
          @if (headlessTemplate(); as headlessTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="headlessTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            @if (hasHeader()) {
              <header class="aeris-drawer__header">
                <div class="aeris-drawer__title" [id]="titleId">
                  @if (headerTemplate(); as headerTemplateRef) {
                    <ng-container
                      [ngTemplateOutlet]="headerTemplateRef.template"
                      [ngTemplateOutletContext]="templateContext()"
                    />
                  } @else {
                    {{ header() }}
                  }
                </div>

                @if (maximizable() || closable()) {
                  <div class="aeris-drawer__actions">
                    @if (maximizable()) {
                      <button
                        type="button"
                        class="aeris-drawer__action"
                        [attr.aria-label]="maximized() ? 'Restore drawer size' : 'Maximize drawer'"
                        [attr.aria-pressed]="maximized()"
                        (click)="toggleMaximized()"
                      >
                        @if (maximizeIconTemplate(); as customIcon) {
                          <span
                            class="aeris-drawer__maximize-icon"
                            [attr.data-maximized]="maximized() || null"
                            aria-hidden="true"
                            data-aeris-custom-icon
                            ><ng-container
                              [ngTemplateOutlet]="customIcon"
                              [ngTemplateOutletContext]="templateContext()"
                          /></span>
                        } @else {
                          <span
                            class="aeris-drawer__maximize-icon"
                            [attr.data-maximized]="maximized() || null"
                            aria-hidden="true"
                          ></span>
                        }
                      </button>
                    }

                    @if (closable()) {
                      <button
                        type="button"
                        class="aeris-drawer__action aeris-drawer__close"
                        [attr.aria-label]="closeAriaLabel()"
                        (click)="hide($event, 'close-button')"
                      >
                        @if (resolvedCloseIconTemplate(); as closeIconTemplateRef) {
                          <span
                            class="aeris-drawer__close-icon"
                            aria-hidden="true"
                            data-aeris-custom-icon
                            ><ng-container
                              [ngTemplateOutlet]="closeIconTemplateRef"
                              [ngTemplateOutletContext]="templateContext()"
                          /></span>
                        } @else {
                          <span
                            aerisInternalIcon="close"
                            class="aeris-drawer__close-icon"
                            aria-hidden="true"
                          ></span>
                        }
                      </button>
                    }
                  </div>
                }
              </header>
            }

            <div class="aeris-drawer__body">
              <ng-content />
            </div>

            @if (footerTemplate(); as footerTemplateRef) {
              <footer class="aeris-drawer__footer" [attr.data-footer-layout]="footerLayout()">
                <ng-container
                  [ngTemplateOutlet]="footerTemplateRef.template"
                  [ngTemplateOutletContext]="templateContext()"
                />
              </footer>
            }
          }
        </section>
      </div>
    }
  `,
  styleUrl: './aeris-drawer.scss',
  host: {
    class: 'aeris-drawer',
    '[attr.data-open]': 'visible() || null',
    '[attr.data-block-scroll]': 'blockScroll() || null',
  },
})
export class AerisDrawer {
  readonly closeIconTemplate = input<TemplateRef<AerisDrawerTemplateContext>>();
  protected readonly resolvedCloseIconTemplate = computed(
    () => this.closeIconTemplate() ?? this.projectedCloseIconTemplate()?.template,
  );
  readonly maximizeIconTemplate = input<TemplateRef<AerisDrawerTemplateContext>>();

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlayToken = {};
  private scrollLocked = false;
  private readonly previouslyFocused = signal<HTMLElement | null>(null);
  private previousVisible = false;
  private pendingOriginalEvent: Event | null = null;
  private pendingCloseReason: AerisDrawerCloseReason = 'api';
  private closeRenderTimer: ReturnType<typeof setTimeout> | undefined;
  protected readonly availableSnapHeight = signal(0);
  protected readonly snapDragHeight = signal<number | null>(null);
  private snapStartHeight = 0;
  private readonly normalizedSnapPoints = computed(() =>
    normalizeDrawerSnapPoints(this.snapPoints(), this.availableSnapHeight()),
  );
  protected readonly snapEnabled = computed(
    () =>
      this.position() === 'bottom' &&
      !this.maximized() &&
      this.size() !== 'full' &&
      !this.mobileFullScreen() &&
      this.normalizedSnapPoints().length > 0,
  );
  private readonly snapIndex = computed(() =>
    drawerSnapIndex(
      this.normalizedSnapPoints(),
      this.activeSnapPoint(),
      this.availableSnapHeight(),
    ),
  );
  protected readonly currentSnapHeight = computed(
    () => this.normalizedSnapPoints()[this.snapIndex()]?.height ?? 0,
  );
  protected readonly minimumSnapHeight = computed(
    () => this.normalizedSnapPoints()[0]?.height ?? 0,
  );
  protected readonly maximumSnapHeight = computed(
    () => this.normalizedSnapPoints().at(-1)?.height ?? 0,
  );
  protected readonly snapValueText = computed(
    () =>
      `${Math.round((this.currentSnapHeight() / Math.max(1, this.availableSnapHeight())) * 100)}% of available height`,
  );
  protected readonly swiping = signal(false);
  private readonly swipeOffset = signal(0);
  protected readonly swipeProgress = signal(0);
  protected readonly swipeTransform = computed(() => {
    const offset = this.swipeOffset();
    if (!this.visible() || !offset) return null;
    return this.position() === 'left' || this.position() === 'right'
      ? `translate3d(${offset}px, 0, 0)`
      : `translate3d(0, ${offset}px, 0)`;
  });
  protected readonly swipe = new AerisDrawerSwipe(
    this.document,
    (offset, progress, dragging) => {
      if (!dragging) this.snapDragHeight.set(null);
      if (this.snapEnabled()) {
        this.swipeOffset.set(0);
        this.snapDragHeight.set(dragging ? Math.max(1, this.snapStartHeight - offset) : null);
        this.swiping.set(dragging);
        this.swipeProgress.set(
          dragging && this.swipeToClose()
            ? Math.max(
                0,
                (this.minimumSnapHeight() - (this.snapStartHeight - offset)) /
                  Math.max(1, this.minimumSnapHeight()),
              )
            : 0,
        );
        return;
      }
      this.swipeOffset.set(offset);
      this.swiping.set(dragging);
      if (this.visible()) this.swipeProgress.set(progress);
    },
    (event) => this.hide(event, 'swipe'),
    () => {
      if (!this.snapEnabled()) return null;
      this.snapStartHeight =
        this.drawerPanel()?.nativeElement.getBoundingClientRect().height ||
        this.currentSnapHeight();
      return {
        heights: this.normalizedSnapPoints().map((point) => point.height),
        dismissible: this.swipeToClose(),
        settled: (index: number) => {
          const point = this.normalizedSnapPoints()[index];
          if (point) this.activeSnapPoint.set(point.value);
        },
      };
    },
  );

  protected readonly drawerPanel = viewChild<ElementRef<HTMLElement>>('drawerPanel');
  private readonly overlayPortal = viewChild(ɵAerisAppendTo);
  protected readonly rendered = signal(false);
  protected readonly animationState = computed(() => (this.visible() ? 'open' : 'closed'));
  protected readonly headerTemplate = contentChild(AerisDrawerHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisDrawerFooterTemplate);
  private readonly projectedCloseIconTemplate = contentChild(AerisDrawerCloseIconTemplate);
  protected readonly headlessTemplate = contentChild(AerisDrawerHeadlessTemplate);
  protected readonly templateContext = computed<AerisDrawerTemplateContext>(() => ({
    $implicit: this,
    close: (event?: Event) => this.hide(event ?? null, 'api'),
    position: this.position(),
    maximized: this.maximized(),
  }));
  protected readonly hasHeader = computed(
    () => !!this.header() || !!this.headerTemplate() || this.closable() || this.maximizable(),
  );
  protected readonly computedAriaLabelledBy = computed(() => {
    const labelledBy = this.ariaLabelledBy();
    if (labelledBy) return labelledBy;
    if (this.ariaLabel()) return null;
    return this.hasHeader() && !this.headlessTemplate() ? this.titleId : null;
  });

  readonly visible = model(false);
  readonly maximized = model(false);
  readonly activeSnapPoint = model<AerisDrawerSnapPoint | null>(null);
  readonly snapPoints = input<readonly AerisDrawerSnapPoint[]>([]);
  readonly snapAriaLabel = input('Resize drawer');

  readonly header = input('');
  readonly appendTo = input<AerisAppendTo>();
  readonly position = input<AerisDrawerPosition>('right');
  readonly size = input<AerisDrawerSize>('md');
  readonly modal = input(true, { transform: booleanAttribute });
  readonly backdrop = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly closeOnBackdropClick = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly swipeToClose = input(false, { transform: booleanAttribute });
  readonly swipeHandle = input(false, { transform: booleanAttribute });
  readonly swipeThreshold = input(0.35);
  readonly closable = input(true, { transform: booleanAttribute });
  readonly maximizable = input(false, { transform: booleanAttribute });
  readonly blockScroll = input(true, { transform: booleanAttribute });
  readonly focusTrap = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input('');
  readonly width = input('');
  readonly height = input('');
  readonly maxWidth = input('');
  readonly maxHeight = input('');
  readonly mobileWidth = input('');
  readonly mobileHeight = input('');
  readonly mobileFullScreen = input(false, { transform: booleanAttribute });
  readonly footerLayout = input<AerisDrawerFooterLayout>('responsive');
  readonly closeAriaLabel = input('Close drawer');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly opened = output<AerisDrawerVisibilityChangeEvent>();
  readonly closed = output<AerisDrawerVisibilityChangeEvent>();

  readonly id = `aeris-drawer-${nextDrawerId++}`;
  readonly titleId = `${this.id}-title`;

  constructor() {
    afterRenderEffect(() => {
      if (!this.visible() || !this.snapEnabled() || this.swiping()) return;
      this.availableSnapHeight();
      this.currentSnapHeight();
      const active = this.document.activeElement;
      if (
        active instanceof HTMLElement &&
        this.drawerPanel()?.nativeElement.contains(active) &&
        active.matches('input, textarea, select, [contenteditable="true"]')
      )
        active.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    });
    this.destroyRef.onDestroy(() => {
      this.swipe.cancel();
      this.clearRenderTimer();
      ɵunregisterAerisOverlay(this.document, this.overlayToken);
      this.unlockScroll();
    });

    effect(() => {
      const visible = this.visible();
      if (visible === this.previousVisible) return;

      if (visible) {
        this.clearRenderTimer();
        this.rendered.set(true);
        this.handleShown();
      } else {
        this.handleHidden();
        this.scheduleRenderRemoval();
      }
      this.previousVisible = visible;
    });

    effect((onCleanup) => {
      if (!this.visible()) return;
      const keydown = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
      this.document.addEventListener('keydown', keydown);
      onCleanup(() => this.document.removeEventListener('keydown', keydown));
    });

    effect((onCleanup) => {
      if (!this.visible() || this.position() !== 'bottom' || !this.snapPoints().length) return;
      const panel = this.drawerPanel()?.nativeElement;
      const view = this.document.defaultView;
      if (!panel || !view) return;
      let previousWidth = 0;
      const measure = () => {
        const viewport = aerisInternalViewportBounds(view);
        const container = panel.parentElement?.getBoundingClientRect();
        const height = Math.min(viewport.height, container?.height || viewport.height);
        const width = container?.width || viewport.width;
        if (height !== untracked(this.availableSnapHeight) || width !== previousWidth) {
          untracked(() => this.swipe.cancel());
          this.availableSnapHeight.set(height);
          previousWidth = width;
        }
      };
      const frame = aerisInternalCreateFrameScheduler(measure);
      measure();
      const observer =
        typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(frame.schedule);
      if (panel.parentElement) observer?.observe(panel.parentElement);
      view.addEventListener('resize', frame.schedule);
      view.visualViewport?.addEventListener('resize', frame.schedule);
      onCleanup(() => {
        frame.cancel();
        observer?.disconnect();
        view.removeEventListener('resize', frame.schedule);
        view.visualViewport?.removeEventListener('resize', frame.schedule);
      });
    });

    effect((onCleanup) => {
      const snapping = this.snapEnabled();
      // Changes to controlled point/configuration cancel an in-flight gesture.
      this.activeSnapPoint();
      this.snapPoints();
      const enabled = this.visible() && (this.swipeToClose() || snapping) && !this.maximized();
      const position = this.position();
      const panel = this.drawerPanel()?.nativeElement;
      if (!enabled || !panel) return;
      const view = this.document.defaultView;
      const cancel = () => this.swipe.cancel();
      const visibility = () => {
        if (this.document.hidden) cancel();
      };
      const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(cancel);
      const stopTouch = this.swipe.listenForTouch(
        panel,
        position,
        () => this.swipeThreshold(),
        () =>
          this.visible() &&
          (this.swipeToClose() || this.snapEnabled()) &&
          !this.maximized() &&
          ɵisTopmostAerisOverlay(this.document, this.overlayToken),
      );
      if (!snapping) observer?.observe(panel);
      view?.addEventListener('resize', cancel);
      view?.addEventListener('blur', cancel);
      view?.visualViewport?.addEventListener('resize', cancel);
      this.document.addEventListener('visibilitychange', visibility);
      onCleanup(() => {
        this.swipe.cancel();
        stopTouch();
        observer?.disconnect();
        view?.removeEventListener('resize', cancel);
        view?.removeEventListener('blur', cancel);
        view?.visualViewport?.removeEventListener('resize', cancel);
        this.document.removeEventListener('visibilitychange', visibility);
      });
    });
  }

  protected startSwipe(event: PointerEvent): void {
    if (
      !this.visible() ||
      !(this.swipeToClose() || this.snapEnabled()) ||
      this.maximized() ||
      !ɵisTopmostAerisOverlay(this.document, this.overlayToken)
    )
      return;
    const bounds = this.drawerPanel()?.nativeElement.getBoundingClientRect();
    if (!bounds) return;
    this.swipe.start(
      event,
      this.position(),
      this.position() === 'left' || this.position() === 'right' ? bounds.width : bounds.height,
    );
  }

  show(originalEvent: Event | null = null): void {
    if (this.visible()) return;
    this.previouslyFocused.set(this.activeHtmlElement());
    this.pendingOriginalEvent = originalEvent;
    this.visible.set(true);
  }

  hide(originalEvent: Event | null = null, reason: AerisDrawerCloseReason = 'api'): void {
    if (!this.visible()) return;
    this.pendingOriginalEvent = originalEvent;
    this.pendingCloseReason = reason;
    this.visible.set(false);
  }

  toggle(originalEvent: Event | null = null): void {
    if (this.visible()) {
      this.hide(originalEvent);
    } else {
      this.show(originalEvent);
    }
  }

  focus(options?: FocusOptions): void {
    this.focusInitial(options);
  }

  toggleMaximized(): void {
    this.maximized.update((value) => !value);
  }

  maximize(): void {
    this.maximized.set(true);
  }

  restore(): void {
    this.maximized.set(false);
  }

  /** Select a configured point. Invalid or unavailable requests leave the current point unchanged. */
  snapTo(point: AerisDrawerSnapPoint): void {
    if (!this.snapEnabled()) return;
    const requested = normalizeDrawerSnapPoints([point], this.availableSnapHeight())[0];
    const match =
      requested &&
      this.normalizedSnapPoints().find(
        (candidate) => Math.abs(candidate.height - requested.height) < 0.5,
      );
    if (!match) return;
    this.swipe.cancel();
    this.activeSnapPoint.set(match.value);
  }

  protected handleSnapKeydown(event: KeyboardEvent): void {
    if (!this.snapEnabled() || !ɵisTopmostAerisOverlay(this.document, this.overlayToken)) return;
    const points = this.normalizedSnapPoints();
    let index = this.snapIndex();
    switch (event.key) {
      case 'ArrowUp':
      case 'PageUp':
        index++;
        break;
      case 'ArrowDown':
      case 'PageDown':
        index--;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = points.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const point = points[Math.max(0, Math.min(points.length - 1, index))];
    if (point) this.snapTo(point.value);
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (!this.visible()) return;
    if (event.key !== 'Tab' || !this.focusTrap()) return;
    this.trapTab(event);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (
      !this.visible() ||
      event.key !== 'Escape' ||
      !this.closeOnEscape() ||
      !ɵisTopmostAerisOverlay(this.document, this.overlayToken)
    )
      return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected handleOverlayClick(event: MouseEvent): void {
    if (!this.visible()) return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.closeOnBackdropClick()) return;
    this.hide(event, 'mask');
  }

  private scheduleRenderRemoval(): void {
    this.clearRenderTimer();
    this.closeRenderTimer = globalThis.setTimeout(() => {
      if (!this.visible()) {
        this.swipeProgress.set(0);
        this.overlayPortal()?.restore();
        this.rendered.set(false);
      }
      this.closeRenderTimer = undefined;
    }, DRAWER_EXIT_DURATION_MS);
  }

  private clearRenderTimer(): void {
    if (!this.closeRenderTimer) return;
    globalThis.clearTimeout(this.closeRenderTimer);
    this.closeRenderTimer = undefined;
  }

  private handleShown(): void {
    this.swipe.cancel();
    this.previouslyFocused.set(this.activeHtmlElement());
    ɵregisterAerisOverlay(this.document, this.overlayToken, () => {
      if (!this.visible() || !this.closeOnEscape()) return false;
      this.hide();
      return true;
    });
    this.lockScroll();
    const event = this.visibilityEvent(true, 'api', this.pendingOriginalEvent);
    this.pendingOriginalEvent = null;
    this.opened.emit(event);
    if (!this.autoFocus()) return;
    queueMicrotask(() => this.focusInitial());
  }

  private handleHidden(): void {
    this.swipe.cancel();
    const restoreFocus = ɵisTopmostAerisOverlay(this.document, this.overlayToken);
    ɵunregisterAerisOverlay(this.document, this.overlayToken);
    this.unlockScroll();
    const event = this.visibilityEvent(false, this.pendingCloseReason, this.pendingOriginalEvent);
    this.pendingOriginalEvent = null;
    this.pendingCloseReason = 'api';
    this.closed.emit(event);
    if (!this.restoreFocus() || !restoreFocus) return;
    queueMicrotask(() => {
      if (!this.visible()) this.previouslyFocused()?.focus();
    });
  }

  private lockScroll(): void {
    if (!this.modal() || !this.blockScroll() || this.scrollLocked) return;
    ɵlockAerisDocumentScroll(this.document);
    this.scrollLocked = true;
  }

  private unlockScroll(): void {
    if (!this.scrollLocked) return;
    ɵunlockAerisDocumentScroll(this.document);
    this.scrollLocked = false;
  }

  private focusInitial(options?: FocusOptions): void {
    if (!this.visible()) return;
    const panel = this.drawerPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalFocusInitialElement(panel, this.initialFocus(), options, DRAWER_FOCUS_OPTIONS);
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.drawerPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalTrapTabFocus(event, panel, this.activeHtmlElement(), DRAWER_FOCUS_OPTIONS);
  }

  private activeHtmlElement(): HTMLElement | null {
    const active = this.document.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisDrawerCloseReason,
    originalEvent: Event | null,
  ): AerisDrawerVisibilityChangeEvent {
    return { originalEvent, visible, reason };
  }
}

export const AerisDrawerModule = [
  AerisDrawer,
  AerisDrawerHeaderTemplate,
  AerisDrawerFooterTemplate,
  AerisDrawerCloseIconTemplate,
  AerisDrawerHeadlessTemplate,
] as const;
