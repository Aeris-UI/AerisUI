import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  aerisInternalFocusInitialElement,
  aerisInternalTrapTabFocus,
  ɵisTopmostAerisOverlay,
  ɵlockAerisDocumentScroll,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
  ɵunlockAerisDocumentScroll,
} from '@aeris-ui/core';

export type AerisDrawerCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
export type AerisDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type AerisDrawerSize = 'sm' | 'md' | 'lg' | 'full';

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
  imports: [NgTemplateOutlet],
  template: `
    @if (rendered()) {
      <div
        class="aeris-drawer__overlay"
        [attr.data-modal]="modal() || null"
        [attr.data-backdrop]="backdrop() || null"
        [attr.data-backdrop-blur]="backdrop() && backdropBlur() ? true : null"
        [style.--aeris-drawer-backdrop-blur]="backdropBlurAmount() || null"
        [attr.data-position]="position()"
        [attr.data-maximized]="maximized() || null"
        [attr.data-state]="animationState()"
        [attr.aria-hidden]="visible() ? null : 'true'"
        [attr.inert]="visible() ? null : ''"
        (pointerdown)="handleOverlayPointerdown($event)"
      >
        <aside
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
          [style.--aeris-drawer-width]="width() || null"
          [style.--aeris-drawer-height]="height() || null"
          [style.--aeris-drawer-max-width]="maxWidth() || null"
          [style.--aeris-drawer-max-height]="maxHeight() || null"
          [style.--aeris-drawer-mobile-width]="mobileWidth() || null"
          [style.--aeris-drawer-mobile-height]="mobileHeight() || null"
          (keydown)="handlePanelKeydown($event)"
        >
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
                        <span
                          class="aeris-drawer__maximize-icon"
                          [attr.data-maximized]="maximized() || null"
                          aria-hidden="true"
                        ></span>
                      </button>
                    }

                    @if (closable()) {
                      <button
                        type="button"
                        class="aeris-drawer__action aeris-drawer__close"
                        [attr.aria-label]="closeAriaLabel()"
                        (click)="hide($event, 'close-button')"
                      >
                        @if (closeIconTemplate(); as closeIconTemplateRef) {
                          <ng-container
                            [ngTemplateOutlet]="closeIconTemplateRef.template"
                            [ngTemplateOutletContext]="templateContext()"
                          />
                        } @else {
                          <span class="aeris-drawer__close-icon" aria-hidden="true"></span>
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
              <footer class="aeris-drawer__footer">
                <ng-container
                  [ngTemplateOutlet]="footerTemplateRef.template"
                  [ngTemplateOutletContext]="templateContext()"
                />
              </footer>
            }
          }
        </aside>
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
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlayToken = {};
  private scrollLocked = false;
  private readonly previouslyFocused = signal<HTMLElement | null>(null);
  private previousVisible = false;
  private pendingOriginalEvent: Event | null = null;
  private pendingCloseReason: AerisDrawerCloseReason = 'api';
  private closeRenderTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly drawerPanel = viewChild<ElementRef<HTMLElement>>('drawerPanel');
  protected readonly rendered = signal(false);
  protected readonly animationState = computed(() => (this.visible() ? 'open' : 'closed'));
  protected readonly headerTemplate = contentChild(AerisDrawerHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisDrawerFooterTemplate);
  protected readonly closeIconTemplate = contentChild(AerisDrawerCloseIconTemplate);
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

  readonly header = input('');
  readonly position = input<AerisDrawerPosition>('right');
  readonly size = input<AerisDrawerSize>('md');
  readonly modal = input(true, { transform: booleanAttribute });
  readonly backdrop = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly dismissibleMask = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
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
  readonly closeAriaLabel = input('Close drawer');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly shown = output<AerisDrawerVisibilityChangeEvent>();
  readonly hidden = output<AerisDrawerVisibilityChangeEvent>();
  readonly visibilityChanged = output<AerisDrawerVisibilityChangeEvent>();

  readonly id = `aeris-drawer-${nextDrawerId++}`;
  readonly titleId = `${this.id}-title`;

  constructor() {
    this.destroyRef.onDestroy(() => {
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

  protected handleOverlayPointerdown(event: PointerEvent): void {
    if (!this.visible()) return;
    if (!this.dismissibleMask() || event.target !== event.currentTarget) return;
    this.hide(event, 'mask');
  }

  private scheduleRenderRemoval(): void {
    this.clearRenderTimer();
    this.closeRenderTimer = globalThis.setTimeout(() => {
      if (!this.visible()) {
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
    this.previouslyFocused.set(this.activeHtmlElement());
    ɵregisterAerisOverlay(this.document, this.overlayToken);
    this.lockScroll();
    const event = this.visibilityEvent(true, 'api', this.pendingOriginalEvent);
    this.pendingOriginalEvent = null;
    this.shown.emit(event);
    this.visibilityChanged.emit(event);
    if (!this.autoFocus()) return;
    queueMicrotask(() => this.focusInitial());
  }

  private handleHidden(): void {
    const restoreFocus = ɵisTopmostAerisOverlay(this.document, this.overlayToken);
    ɵunregisterAerisOverlay(this.document, this.overlayToken);
    this.unlockScroll();
    const event = this.visibilityEvent(false, this.pendingCloseReason, this.pendingOriginalEvent);
    this.pendingOriginalEvent = null;
    this.pendingCloseReason = 'api';
    this.hidden.emit(event);
    this.visibilityChanged.emit(event);
    if (!this.restoreFocus() || !restoreFocus) return;
    queueMicrotask(() => this.previouslyFocused()?.focus());
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
