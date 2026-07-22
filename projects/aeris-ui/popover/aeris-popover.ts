import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
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
  aerisInternalCreateFrameScheduler,
  aerisInternalPositionAnchoredOverlay,
  aerisInternalTrapTabFocus,
} from '@aeris-ui/core';

export type AerisPopoverPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type AerisPopoverAlignment = 'start' | 'center' | 'end';
export type AerisPopoverCloseReason = 'api' | 'close-button' | 'escape' | 'outside';
export type AerisPopoverTarget = Element | EventTarget | Event | null | undefined;

export interface AerisPopoverVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisPopoverCloseReason;
  readonly target: Element | null;
}

export interface AerisPopoverTemplateContext {
  readonly $implicit: AerisPopover;
  readonly close: (event?: Event) => void;
  readonly placement: Exclude<AerisPopoverPlacement, 'auto'>;
  readonly target: Element | null;
}

@Directive({ selector: 'ng-template[aerisPopoverHeader]' })
export class AerisPopoverHeaderTemplate {
  readonly template = inject<TemplateRef<AerisPopoverTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPopoverFooter]' })
export class AerisPopoverFooterTemplate {
  readonly template = inject<TemplateRef<AerisPopoverTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPopoverCloseIcon]' })
export class AerisPopoverCloseIconTemplate {
  readonly template = inject<TemplateRef<AerisPopoverTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPopoverHeadless]' })
export class AerisPopoverHeadlessTemplate {
  readonly template = inject<TemplateRef<AerisPopoverTemplateContext>>(TemplateRef);
}

let nextPopoverId = 0;

@Component({
  selector: 'aeris-popover',
  imports: [NgTemplateOutlet],
  template: `
    @if (visible()) {
      <div class="aeris-popover__layer" [attr.data-positioned]="positioned() || null">
        <section
          #popoverPanel
          class="aeris-popover__panel"
          role="dialog"
          tabindex="-1"
          [id]="popoverId"
          [attr.aria-modal]="focusTrap() || null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="computedAriaLabelledBy()"
          [attr.aria-describedby]="ariaDescribedBy() || null"
          [attr.data-placement]="actualPlacement()"
          [attr.data-headless]="headlessTemplate() ? true : null"
          [style.left.px]="coordinates().x"
          [style.top.px]="coordinates().y"
          [style.--aeris-popover-width]="width() || null"
          [style.--aeris-popover-max-width]="maxWidth() || null"
          (keydown)="handlePanelKeydown($event)"
        >
          @if (showArrow()) {
            <span class="aeris-popover__arrow" aria-hidden="true"></span>
          }

          @if (headlessTemplate(); as headlessTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="headlessTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            @if (hasHeader()) {
              <header class="aeris-popover__header">
                <div class="aeris-popover__title" [id]="titleId">
                  @if (headerTemplate(); as headerTemplateRef) {
                    <ng-container
                      [ngTemplateOutlet]="headerTemplateRef.template"
                      [ngTemplateOutletContext]="templateContext()"
                    />
                  } @else {
                    {{ header() }}
                  }
                </div>

                @if (closable()) {
                  <button
                    type="button"
                    class="aeris-popover__close"
                    [attr.aria-label]="closeAriaLabel()"
                    (click)="hide($event, 'close-button')"
                  >
                    @if (closeIconTemplate(); as closeIconTemplateRef) {
                      <ng-container
                        [ngTemplateOutlet]="closeIconTemplateRef.template"
                        [ngTemplateOutletContext]="templateContext()"
                      />
                    } @else {
                      <span class="aeris-popover__close-icon" aria-hidden="true"></span>
                    }
                  </button>
                }
              </header>
            }

            <div class="aeris-popover__body">
              <ng-content />
            </div>

            @if (footerTemplate(); as footerTemplateRef) {
              <footer class="aeris-popover__footer">
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
  styleUrl: './aeris-popover.scss',
  host: {
    class: 'aeris-popover',
    '[attr.data-open]': 'visible() || null',
  },
})
export class AerisPopover {
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly document = inject(DOCUMENT);
  private readonly activeTarget = signal<Element | null>(null);
  private readonly triggerAttributes = signal<{
    readonly target: Element;
    readonly expanded: string | null;
    readonly controls: string | null;
    readonly haspopup: string | null;
  } | null>(null);
  private previousVisible = false;
  private pendingOriginalEvent: Event | null = null;
  private pendingCloseReason: AerisPopoverCloseReason = 'api';

  protected readonly popoverPanel = viewChild<ElementRef<HTMLElement>>('popoverPanel');
  protected readonly headerTemplate = contentChild(AerisPopoverHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisPopoverFooterTemplate);
  protected readonly closeIconTemplate = contentChild(AerisPopoverCloseIconTemplate);
  protected readonly headlessTemplate = contentChild(AerisPopoverHeadlessTemplate);
  protected readonly positioned = signal(false);
  protected readonly actualPlacement = signal<Exclude<AerisPopoverPlacement, 'auto'>>('bottom');
  protected readonly coordinates = signal({ x: 0, y: 0 });
  protected readonly hasHeader = computed(
    () => !!this.header() || !!this.headerTemplate() || this.closable(),
  );
  protected readonly computedAriaLabelledBy = computed(() => {
    const labelledBy = this.ariaLabelledBy();
    if (labelledBy) return labelledBy;
    if (this.ariaLabel()) return null;
    return this.hasHeader() && !this.headlessTemplate() ? this.titleId : null;
  });
  protected readonly templateContext = computed<AerisPopoverTemplateContext>(() => ({
    $implicit: this,
    close: (event?: Event) => this.hide(event ?? null),
    placement: this.actualPlacement(),
    target: this.activeTarget(),
  }));

  readonly visible = model(false);
  readonly target = input<AerisPopoverTarget>(null);
  readonly header = input('');
  readonly placement = input<AerisPopoverPlacement>('auto');
  readonly alignment = input<AerisPopoverAlignment>('center');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly offset = input(10);
  readonly viewportMargin = input(8);
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closable = input(false, { transform: booleanAttribute });
  readonly focusTrap = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input('');
  readonly showArrow = input(true, { transform: booleanAttribute });
  readonly closeAriaLabel = input('Close popover');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly shown = output<AerisPopoverVisibilityChangeEvent>();
  readonly hidden = output<AerisPopoverVisibilityChangeEvent>();
  readonly visibilityChanged = output<AerisPopoverVisibilityChangeEvent>();

  readonly popoverId = `aeris-popover-${nextPopoverId++}`;
  readonly titleId = `${this.popoverId}-title`;

  constructor() {
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
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const reposition = this.repositionFrame.schedule;
      const view = this.document.defaultView;
      this.document.addEventListener('keydown', keydown);
      this.document.addEventListener('pointerdown', pointerdown);
      view?.addEventListener('resize', reposition);
      view?.addEventListener('scroll', reposition);
      onCleanup(() => {
        this.document.removeEventListener('keydown', keydown);
        this.document.removeEventListener('pointerdown', pointerdown);
        view?.removeEventListener('resize', reposition);
        view?.removeEventListener('scroll', reposition);
        this.repositionFrame.cancel();
      });
    });
  }

  show(target: AerisPopoverTarget = null, originalEvent: Event | null = null): void {
    const resolvedTarget = this.resolveTarget(target) ?? this.localTarget();
    if (!resolvedTarget) {
      throw new Error('AerisPopover requires a target Element or trigger Event.');
    }

    this.activeTarget.set(resolvedTarget);
    this.pendingOriginalEvent = originalEvent ?? (target instanceof Event ? target : null);
    this.visible.set(true);
  }

  hide(originalEvent: Event | null = null, reason: AerisPopoverCloseReason = 'api'): void {
    if (!this.visible()) return;
    this.pendingOriginalEvent = originalEvent;
    this.pendingCloseReason = reason;
    this.visible.set(false);
  }

  toggle(target: AerisPopoverTarget = null, originalEvent: Event | null = null): void {
    if (this.visible()) {
      this.hide(originalEvent ?? (target instanceof Event ? target : null));
    } else {
      this.show(target, originalEvent);
    }
  }

  focus(options?: FocusOptions): void {
    this.focusInitial(options);
  }

  reposition(): void {
    if (!this.visible()) return;
    const panel = this.popoverPanel()?.nativeElement;
    const target = this.activeTarget();
    const view = target?.ownerDocument.defaultView;
    if (!panel || !target || !view) return;

    const targetRect = target.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const width = panelRect.width || panel.offsetWidth || 320;
    const height = panelRect.height || panel.offsetHeight || 160;
    const { placement, x, y } = aerisInternalPositionAnchoredOverlay({
      target: targetRect,
      width,
      height,
      placement: this.placement(),
      alignment: this.alignment(),
      offset: this.offset(),
      margin: this.viewportMargin(),
      viewportWidth: view.innerWidth,
      viewportHeight: view.innerHeight,
    });

    this.actualPlacement.set(placement);
    this.coordinates.set({ x, y });
    this.positioned.set(true);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.setAttribute('data-placement', placement);
    panel.parentElement?.setAttribute('data-positioned', 'true');
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.focusTrap()) return;
    this.trapTab(event);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.visible() || event.key !== 'Escape' || !this.closeOnEscape()) return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.visible() || !this.dismissible()) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    const panel = this.popoverPanel()?.nativeElement;
    const activeTarget = this.activeTarget();
    if (panel?.contains(target) || activeTarget?.contains(target)) return;
    this.hide(event, 'outside');
  }

  private handleShown(): void {
    if (!this.activeTarget()) {
      const target = this.localTarget();
      if (!target) {
        this.visible.set(false);
        throw new Error('AerisPopover requires a target Element or trigger Event.');
      }
      this.activeTarget.set(target);
    }

    const target = this.activeTarget();
    this.positioned.set(false);
    this.updateTriggerAttributes(true);
    const event = this.visibilityEvent(true, 'api', this.pendingOriginalEvent, target);
    this.pendingOriginalEvent = null;
    this.shown.emit(event);
    this.visibilityChanged.emit(event);
    queueMicrotask(() => {
      this.reposition();
      if (this.autoFocus()) this.focusInitial();
    });
  }

  private handleHidden(): void {
    const target = this.activeTarget();
    const shouldRestoreFocus = this.restoreFocus();
    const event = this.visibilityEvent(
      false,
      this.pendingCloseReason,
      this.pendingOriginalEvent,
      target,
    );
    this.updateTriggerAttributes(false);
    this.positioned.set(false);
    this.pendingOriginalEvent = null;
    this.pendingCloseReason = 'api';
    this.activeTarget.set(null);
    this.hidden.emit(event);
    this.visibilityChanged.emit(event);

    if (shouldRestoreFocus && target instanceof HTMLElement) {
      queueMicrotask(() => target.focus());
    }
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisPopoverCloseReason,
    originalEvent: Event | null,
    target: Element | null,
  ): AerisPopoverVisibilityChangeEvent {
    return {
      originalEvent,
      visible,
      reason,
      target,
    };
  }

  private updateTriggerAttributes(open: boolean): void {
    const target = this.activeTarget();
    if (!target) return;

    if (open) {
      this.triggerAttributes.set({
        target,
        expanded: target.getAttribute('aria-expanded'),
        controls: target.getAttribute('aria-controls'),
        haspopup: target.getAttribute('aria-haspopup'),
      });
      target.setAttribute('aria-haspopup', 'dialog');
      target.setAttribute('aria-expanded', 'true');
      target.setAttribute('aria-controls', this.popoverId);
      return;
    }

    const previous = this.triggerAttributes();
    if (!previous) return;
    if (previous.expanded === null) {
      previous.target.removeAttribute('aria-expanded');
    } else {
      previous.target.setAttribute('aria-expanded', previous.expanded);
    }
    if (previous.controls === null) {
      previous.target.removeAttribute('aria-controls');
    } else {
      previous.target.setAttribute('aria-controls', previous.controls);
    }
    if (previous.haspopup === null) {
      previous.target.removeAttribute('aria-haspopup');
    } else {
      previous.target.setAttribute('aria-haspopup', previous.haspopup);
    }
    this.triggerAttributes.set(null);
  }

  private focusInitial(options?: FocusOptions): void {
    const panel = this.popoverPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalFocusInitialElement(panel, this.initialFocus(), options);
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.popoverPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalTrapTabFocus(event, panel, this.activeHtmlElement());
  }

  private activeHtmlElement(): HTMLElement | null {
    const active = this.activeTarget()?.ownerDocument.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  private localTarget(): Element | null {
    return this.resolveTarget(this.target());
  }

  private resolveTarget(target: AerisPopoverTarget): Element | null {
    if (target instanceof Element) return target;
    if (target instanceof Event) {
      return this.resolveTarget(target.currentTarget ?? target.target);
    }
    return target instanceof Element ? target : null;
  }
}

export const AerisPopoverModule = [
  AerisPopover,
  AerisPopoverHeaderTemplate,
  AerisPopoverFooterTemplate,
  AerisPopoverCloseIconTemplate,
  AerisPopoverHeadlessTemplate,
] as const;
