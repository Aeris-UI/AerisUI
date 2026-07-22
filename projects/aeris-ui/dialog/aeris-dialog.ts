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

export type AerisDialogCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
export type AerisDialogRole = 'dialog' | 'alertdialog';
export type AerisDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
export type AerisDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface AerisDialogVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDialogCloseReason;
}

export interface AerisDialogTemplateContext {
  readonly $implicit: AerisDialog;
  readonly close: (event?: Event) => void;
  readonly maximized: boolean;
}

@Directive({ selector: 'ng-template[aerisDialogHeader]' })
export class AerisDialogHeaderTemplate {
  readonly template = inject<TemplateRef<AerisDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDialogFooter]' })
export class AerisDialogFooterTemplate {
  readonly template = inject<TemplateRef<AerisDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDialogCloseIcon]' })
export class AerisDialogCloseIconTemplate {
  readonly template = inject<TemplateRef<AerisDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisDialogHeadless]' })
export class AerisDialogHeadlessTemplate {
  readonly template = inject<TemplateRef<AerisDialogTemplateContext>>(TemplateRef);
}

let nextDialogId = 0;
const DIALOG_FOCUS_OPTIONS = {
  includeContentEditable: true,
  checkComputedVisibility: true,
} as const;

@Component({
  selector: 'aeris-dialog',
  imports: [NgTemplateOutlet],
  template: `
    @if (visible()) {
      <div
        class="aeris-dialog__overlay"
        [attr.data-modal]="modal() || null"
        [attr.data-backdrop]="backdrop() || null"
        [attr.data-backdrop-blur]="backdrop() && backdropBlur() ? true : null"
        [style.--aeris-dialog-backdrop-blur]="backdropBlurAmount() || null"
        [attr.data-position]="position()"
        [attr.data-maximized]="maximized() || null"
        (pointerdown)="handleOverlayPointerdown($event)"
      >
        <section
          #dialogPanel
          class="aeris-dialog__panel"
          [attr.role]="role()"
          tabindex="-1"
          [attr.aria-modal]="modal()"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="computedAriaLabelledBy()"
          [attr.aria-describedby]="ariaDescribedBy() || null"
          [attr.data-size]="size()"
          [attr.data-draggable]="draggable() || null"
          [attr.data-resizable]="resizable() || null"
          [attr.data-headless]="headlessTemplate() ? true : null"
          [style.--aeris-dialog-width]="width() || null"
          [style.--aeris-dialog-min-width]="minWidth() || null"
          [style.--aeris-dialog-max-width]="maxWidth() || null"
          [style.--aeris-dialog-height]="height() || null"
          [style.--aeris-dialog-max-height]="maxHeight() || null"
          [style.--aeris-dialog-mobile-width]="mobileWidth() || null"
          [style.--aeris-dialog-drag-x]="dragOffset().x + 'px'"
          [style.--aeris-dialog-drag-y]="dragOffset().y + 'px'"
          (keydown)="handlePanelKeydown($event)"
        >
          @if (headlessTemplate(); as headlessTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="headlessTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            @if (hasHeader()) {
              <header
                class="aeris-dialog__header"
                [attr.data-draggable]="draggable() || null"
                (pointerdown)="startDrag($event)"
              >
                <div class="aeris-dialog__title" [id]="titleId">
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
                  <div class="aeris-dialog__actions">
                    @if (maximizable()) {
                      <button
                        type="button"
                        class="aeris-dialog__action"
                        [attr.aria-label]="maximized() ? 'Restore dialog size' : 'Maximize dialog'"
                        [attr.aria-pressed]="maximized()"
                        (click)="toggleMaximized()"
                      >
                        <span
                          class="aeris-dialog__maximize-icon"
                          [attr.data-maximized]="maximized() || null"
                          aria-hidden="true"
                        ></span>
                      </button>
                    }

                    @if (closable()) {
                      <button
                        type="button"
                        class="aeris-dialog__action"
                        [attr.aria-label]="closeAriaLabel()"
                        (click)="hide($event, 'close-button')"
                      >
                        @if (closeIconTemplate(); as closeIconTemplateRef) {
                          <ng-container
                            [ngTemplateOutlet]="closeIconTemplateRef.template"
                            [ngTemplateOutletContext]="templateContext()"
                          />
                        } @else {
                          <span class="aeris-dialog__close-icon" aria-hidden="true"></span>
                        }
                      </button>
                    }
                  </div>
                }
              </header>
            }

            <div class="aeris-dialog__body">
              <ng-content />
            </div>

            @if (footerTemplate(); as footerTemplateRef) {
              <footer class="aeris-dialog__footer">
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
  styleUrl: './aeris-dialog.scss',
  host: {
    class: 'aeris-dialog',
    '[attr.data-open]': 'visible() || null',
    '[attr.data-block-scroll]': 'blockScroll() || null',
  },
})
export class AerisDialog {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlayToken = {};
  private scrollLocked = false;
  private readonly previouslyFocused = signal<HTMLElement | null>(null);
  private readonly dragging = signal<{
    readonly startX: number;
    readonly startY: number;
    readonly originX: number;
    readonly originY: number;
  } | null>(null);
  private previousVisible = false;
  private pendingOriginalEvent: Event | null = null;
  private pendingCloseReason: AerisDialogCloseReason = 'api';

  protected readonly dialogPanel = viewChild<ElementRef<HTMLElement>>('dialogPanel');
  protected readonly headerTemplate = contentChild(AerisDialogHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisDialogFooterTemplate);
  protected readonly closeIconTemplate = contentChild(AerisDialogCloseIconTemplate);
  protected readonly headlessTemplate = contentChild(AerisDialogHeadlessTemplate);
  protected readonly dragOffset = signal({ x: 0, y: 0 });
  protected readonly templateContext = computed<AerisDialogTemplateContext>(() => ({
    $implicit: this,
    close: (event?: Event) => this.hide(event ?? null, 'api'),
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
  readonly role = input<AerisDialogRole>('dialog');
  readonly modal = input(true, { transform: booleanAttribute });
  readonly backdrop = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly dismissibleMask = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closable = input(true, { transform: booleanAttribute });
  readonly maximizable = input(false, { transform: booleanAttribute });
  readonly draggable = input(false, { transform: booleanAttribute });
  readonly resizable = input(false, { transform: booleanAttribute });
  readonly blockScroll = input(true, { transform: booleanAttribute });
  readonly focusTrap = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input('');
  readonly position = input<AerisDialogPosition>('center');
  readonly size = input<AerisDialogSize>('md');
  readonly width = input('');
  readonly minWidth = input('');
  readonly maxWidth = input('');
  readonly height = input('');
  readonly maxHeight = input('');
  readonly mobileWidth = input('');
  readonly closeAriaLabel = input('Close dialog');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly shown = output<AerisDialogVisibilityChangeEvent>();
  readonly hidden = output<AerisDialogVisibilityChangeEvent>();
  readonly visibilityChanged = output<AerisDialogVisibilityChangeEvent>();

  readonly id = `aeris-dialog-${nextDialogId++}`;
  readonly titleId = `${this.id}-title`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopDrag();
      ɵunregisterAerisOverlay(this.document, this.overlayToken);
      this.unlockScroll();
    });

    effect(() => {
      const visible = this.visible();
      if (visible === this.previousVisible) return;

      if (visible) {
        this.handleShown();
      } else {
        this.handleHidden();
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
      if (!this.dragging()) return;
      const pointermove = (event: PointerEvent) => this.handleDocumentPointermove(event);
      const stop = () => this.stopDrag();
      this.document.addEventListener('pointermove', pointermove);
      this.document.addEventListener('pointerup', stop);
      this.document.addEventListener('pointercancel', stop);
      onCleanup(() => {
        this.document.removeEventListener('pointermove', pointermove);
        this.document.removeEventListener('pointerup', stop);
        this.document.removeEventListener('pointercancel', stop);
      });
    });
  }

  show(originalEvent: Event | null = null): void {
    if (this.visible()) return;
    this.previouslyFocused.set(this.activeHtmlElement());
    this.pendingOriginalEvent = originalEvent;
    this.visible.set(true);
  }

  hide(originalEvent: Event | null = null, reason: AerisDialogCloseReason = 'api'): void {
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
    if (this.maximized()) this.dragOffset.set({ x: 0, y: 0 });
  }

  maximize(): void {
    this.maximized.set(true);
    this.dragOffset.set({ x: 0, y: 0 });
  }

  restore(): void {
    this.maximized.set(false);
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
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
    if (!this.dismissibleMask() || event.target !== event.currentTarget) return;
    this.hide(event, 'mask');
  }

  protected startDrag(event: PointerEvent): void {
    if (!this.draggable() || this.maximized()) return;
    if ((event.target as Element | null)?.closest('button, a, input, select, textarea')) return;
    event.preventDefault();
    const current = this.dragOffset();
    this.dragging.set({
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
    });
  }

  protected handleDocumentPointermove(event: PointerEvent): void {
    const drag = this.dragging();
    if (!drag) return;
    event.preventDefault();
    this.dragOffset.set({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    });
  }

  protected stopDrag(): void {
    this.dragging.set(null);
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
    this.stopDrag();
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
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalFocusInitialElement(panel, this.initialFocus(), options, DIALOG_FOCUS_OPTIONS);
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalTrapTabFocus(event, panel, this.activeHtmlElement(), DIALOG_FOCUS_OPTIONS);
  }

  private activeHtmlElement(): HTMLElement | null {
    const active = this.document.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisDialogCloseReason,
    originalEvent: Event | null,
  ): AerisDialogVisibilityChangeEvent {
    return { originalEvent, visible, reason };
  }
}

export const AerisDialogModule = [
  AerisDialog,
  AerisDialogHeaderTemplate,
  AerisDialogFooterTemplate,
  AerisDialogCloseIconTemplate,
  AerisDialogHeadlessTemplate,
] as const;
