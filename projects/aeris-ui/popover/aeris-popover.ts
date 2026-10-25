import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
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
  untracked,
  viewChild,
} from '@angular/core';
import {
  ɵAerisIcon,
  ɵAerisAppendTo,
  aerisInternalFocusInitialElement,
  aerisInternalFocusableElements,
  aerisInternalCreateFrameScheduler,
  aerisInternalPositionAnchoredOverlay,
  aerisInternalTrapTabFocus,
  type AerisAppendTo,
  type AerisOverlayCollisionPadding,
} from '@aeris-ui/core';
import { aerisInternalCreateHoverInteraction } from './aeris-hover-interaction';

export type AerisPopoverPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type AerisPopoverAlignment = 'start' | 'center' | 'end';
export type AerisPopoverTrigger = 'manual' | 'hover';
export type AerisPopoverCloseReason = 'api' | 'close-button' | 'escape' | 'outside' | 'interaction';
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
  imports: [ɵAerisIcon, NgTemplateOutlet, ɵAerisAppendTo],
  template: `
    @if (visible()) {
      <div
        class="aeris-popover__layer"
        [aerisInternalAppendTo]="appendTo()"
        [aerisInternalAppendToDismiss]="dismissOverlay"
        aerisInternalAppendToDefault="body"
        [attr.data-positioned]="positioned() || null"
      >
        <section
          #popoverPanel
          class="aeris-popover__panel"
          role="dialog"
          tabindex="-1"
          [id]="popoverId"
          [attr.aria-modal]="(trigger() === 'manual' && focusTrap()) || null"
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
          (pointerenter)="handleHoverEnter($event)"
          (pointerleave)="handleHoverLeave($event)"
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
                    @if (resolvedCloseIconTemplate(); as closeIconTemplateRef) {
                      <span
                        class="aeris-popover__close-icon"
                        aria-hidden="true"
                        data-aeris-custom-icon
                        ><ng-container
                          [ngTemplateOutlet]="closeIconTemplateRef"
                          [ngTemplateOutletContext]="templateContext()"
                      /></span>
                    } @else {
                      <span
                        aerisInternalIcon="close"
                        class="aeris-popover__close-icon"
                        aria-hidden="true"
                      ></span>
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
  readonly closeIconTemplate = input<TemplateRef<AerisPopoverTemplateContext>>();
  protected readonly resolvedCloseIconTemplate = computed(
    () => this.closeIconTemplate() ?? this.projectedCloseIconTemplate()?.template,
  );
  protected readonly dismissOverlay = (): boolean => {
    if (!this.closeOnEscape()) return false;
    this.hide(null, 'escape');
    return true;
  };
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;
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
  private pendingRestoreHoverFocus = false;
  private hoverContentFocused = false;
  private readonly hoverInteraction = aerisInternalCreateHoverInteraction({
    document: this.document,
    trigger: () => {
      const target = this.localTarget();
      return target instanceof HTMLElement ? target : null;
    },
    content: () => this.popoverPanel()?.nativeElement ?? null,
    isOpen: () => this.visible(),
    open: () => this.show(),
    close: () => this.hide(null, 'interaction'),
    openDelay: () => this.openDelay(),
    closeDelay: () => this.closeDelay(),
    ownsTarget: (target) => this.ownsHoverTarget(target),
  });

  protected readonly popoverPanel = viewChild<ElementRef<HTMLElement>>('popoverPanel');
  private readonly panelPortal = viewChild(ɵAerisAppendTo);
  protected readonly headerTemplate = contentChild(AerisPopoverHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisPopoverFooterTemplate);
  private readonly projectedCloseIconTemplate = contentChild(AerisPopoverCloseIconTemplate);
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
  readonly appendTo = input<AerisAppendTo>();
  readonly target = input<AerisPopoverTarget>(null);
  readonly trigger = input<AerisPopoverTrigger>('manual');
  readonly openDelay = input(200);
  readonly closeDelay = input(150);
  readonly header = input('');
  readonly placement = input<AerisPopoverPlacement>('auto');
  readonly alignment = input<AerisPopoverAlignment>('center');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly offset = input(10);
  readonly viewportMargin = input<number | AerisOverlayCollisionPadding>(8);
  readonly closeOnOutsideClick = input(true, { transform: booleanAttribute });
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

  readonly opened = output<AerisPopoverVisibilityChangeEvent>();
  readonly closed = output<AerisPopoverVisibilityChangeEvent>();

  readonly popoverId = `aeris-popover-${nextPopoverId++}`;
  readonly titleId = `${this.popoverId}-title`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.hoverInteraction.destroy();
      this.repositionFrame.cancel();
      this.updateTriggerAttributes(false);
    });
    effect((onCleanup) => {
      const mode = this.trigger();
      const target = this.resolveTarget(this.target());
      if (mode !== 'hover' || !target) return;
      const enter = (event: PointerEvent) => this.hoverInteraction.pointerEnter('trigger', event);
      const leave = (event: PointerEvent) => this.hoverInteraction.pointerLeave('trigger', event);
      const down = (event: PointerEvent) => {
        if (this.ownsHoverTarget(event.target)) this.hoverInteraction.pointerDown();
      };
      const focusIn = (event: FocusEvent) => {
        this.hoverContentFocused =
          this.ownsHoverTarget(event.target) &&
          event.target instanceof Node &&
          !target.contains(event.target);
        if (this.ownsHoverTarget(event.target)) this.hoverInteraction.focusIn();
      };
      const focusOut = (event: FocusEvent) => {
        if (this.ownsHoverTarget(event.target)) this.hoverInteraction.focusOut(event.relatedTarget);
      };
      const click = (event: MouseEvent) => {
        // Never intercept navigation or add activation to a link. Use a separate button instead.
        if (event.defaultPrevented || !(event.target instanceof Element)) return;
        if (event.target.closest('a[href]')) return;
        if (target instanceof HTMLButtonElement || target.getAttribute('role') === 'button')
          this.hoverInteraction.activate();
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key === 'Tab' && !event.shiftKey && this.visible() && !event.defaultPrevented) {
          const panel = this.popoverPanel()?.nativeElement;
          if (panel && this.panelPortal()?.isTopmost()) {
            event.preventDefault();
            this.focusInitial();
          }
        }
      };
      target.addEventListener('pointerenter', enter as EventListener);
      target.addEventListener('pointerleave', leave as EventListener);
      target.addEventListener('click', click as EventListener);
      target.addEventListener('keydown', keydown as EventListener);
      this.document.addEventListener('pointerdown', down, true);
      this.document.addEventListener('focusin', focusIn);
      this.document.addEventListener('focusout', focusOut);
      onCleanup(() => {
        target.removeEventListener('pointerenter', enter as EventListener);
        target.removeEventListener('pointerleave', leave as EventListener);
        target.removeEventListener('click', click as EventListener);
        target.removeEventListener('keydown', keydown as EventListener);
        this.document.removeEventListener('pointerdown', down, true);
        this.document.removeEventListener('focusin', focusIn);
        this.document.removeEventListener('focusout', focusOut);
        this.hoverInteraction.reset();
        this.hoverContentFocused = false;
        untracked(() => this.hide());
      });
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
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const reposition = this.repositionFrame.schedule;
      const view = this.document.defaultView;
      const viewport = view?.visualViewport;
      this.document.addEventListener('scroll', reposition, true);
      this.document.addEventListener('keydown', keydown);
      this.document.addEventListener('pointerdown', pointerdown);
      view?.addEventListener('resize', reposition);
      view?.addEventListener('scroll', reposition);
      viewport?.addEventListener('scroll', reposition);
      viewport?.addEventListener('resize', reposition);
      onCleanup(() => {
        this.document.removeEventListener('scroll', reposition, true);
        this.document.removeEventListener('keydown', keydown);
        this.document.removeEventListener('pointerdown', pointerdown);
        view?.removeEventListener('resize', reposition);
        view?.removeEventListener('scroll', reposition);
        viewport?.removeEventListener('scroll', reposition);
        viewport?.removeEventListener('resize', reposition);
        this.repositionFrame.cancel();
      });
    });
  }

  show(target: AerisPopoverTarget = null, originalEvent: Event | null = null): void {
    const resolvedTarget = this.resolveTarget(target) ?? this.localTarget();
    if (!resolvedTarget) {
      throw new Error('AerisPopover requires a target Element or trigger Event.');
    }

    const retargeting = this.visible() && this.activeTarget() !== resolvedTarget;
    if (retargeting) this.updateTriggerAttributes(false);
    this.activeTarget.set(resolvedTarget);
    if (retargeting) {
      this.updateTriggerAttributes(true);
      this.repositionFrame.schedule();
    }
    this.pendingOriginalEvent = originalEvent ?? (target instanceof Event ? target : null);
    this.visible.set(true);
  }

  hide(originalEvent: Event | null = null, reason: AerisPopoverCloseReason = 'api'): void {
    this.hoverInteraction.suppress();
    if (!this.visible()) return;
    this.pendingRestoreHoverFocus =
      reason !== 'outside' &&
      reason !== 'interaction' &&
      (reason === 'escape' || this.hoverContentFocused);
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
    const viewport = view.visualViewport;
    const { placement, x, y } = aerisInternalPositionAnchoredOverlay({
      target: targetRect,
      width,
      height,
      placement: this.placement(),
      alignment: this.alignment(),
      direction: view.getComputedStyle(target).direction === 'rtl' ? 'rtl' : 'ltr',
      offset: this.offset(),
      margin: 0,
      collisionPadding: this.viewportMargin(),
      viewportWidth: viewport?.width ?? view.innerWidth,
      viewportHeight: viewport?.height ?? view.innerHeight,
      viewportLeft: viewport?.offsetLeft ?? 0,
      viewportTop: viewport?.offsetTop ?? 0,
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
    if (this.trigger() === 'hover') {
      const panel = this.popoverPanel()?.nativeElement;
      if (
        event.key === 'Tab' &&
        event.shiftKey &&
        !event.defaultPrevented &&
        panel &&
        this.panelPortal()?.isTopmost() &&
        (this.document.activeElement === panel ||
          this.document.activeElement === aerisInternalFocusableElements(panel)[0])
      ) {
        event.preventDefault();
        const target = this.activeTarget();
        if (target instanceof HTMLElement) target.focus();
      }
      return;
    }
    if (
      event.defaultPrevented ||
      event.key !== 'Tab' ||
      !this.focusTrap() ||
      !this.panelPortal()?.isTopmost()
    )
      return;
    this.trapTab(event);
  }

  protected handleHoverEnter(event: PointerEvent): void {
    if (this.trigger() === 'hover') this.hoverInteraction.pointerEnter('content', event);
  }

  protected handleHoverLeave(event: PointerEvent): void {
    if (this.trigger() === 'hover') this.hoverInteraction.pointerLeave('content', event);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (
      !this.visible() ||
      event.defaultPrevented ||
      event.key !== 'Escape' ||
      !this.closeOnEscape() ||
      !this.panelPortal()?.isTopmost()
    )
      return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.visible() || !this.closeOnOutsideClick() || !this.panelPortal()?.isTopmost()) return;
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
    this.opened.emit(event);
    queueMicrotask(() => {
      if (this.destroyed || !this.visible()) return;
      this.reposition();
      if (this.trigger() === 'manual' && this.autoFocus()) this.focusInitial();
    });
  }

  private handleHidden(): void {
    this.panelPortal()?.restore();
    const target = this.activeTarget();
    const shouldRestoreFocus =
      this.restoreFocus() &&
      (this.trigger() === 'manual' ||
        this.pendingRestoreHoverFocus ||
        (this.pendingCloseReason === 'api' && this.hoverContentFocused) ||
        this.pendingCloseReason === 'escape');
    this.hoverInteraction.suppress();
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
    this.pendingRestoreHoverFocus = false;
    this.hoverContentFocused = false;
    this.activeTarget.set(null);
    this.closed.emit(event);

    if (shouldRestoreFocus && target instanceof HTMLElement) {
      queueMicrotask(() => {
        if (!this.destroyed && !this.visible() && target.isConnected) {
          if (this.trigger() === 'hover') this.hoverInteraction.pointerDown();
          target.focus();
          if (this.trigger() === 'hover') this.hoverInteraction.suppress();
        }
      });
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

  private ownsHoverTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) return false;
    const roots: Element[] = [];
    const trigger = this.localTarget();
    const panel = this.popoverPanel()?.nativeElement;
    if (trigger) roots.push(trigger);
    if (panel) roots.push(panel);
    const visited = new Set<Element>();
    // Follow only controls owned by this popover, including their portaled descendants.
    for (const root of roots) {
      if (visited.has(root)) continue;
      visited.add(root);
      if (root.contains(target)) return true;
      for (const controller of [root, ...root.querySelectorAll('[aria-controls]')]) {
        for (const id of controller.getAttribute('aria-controls')?.split(/\s+/) ?? []) {
          const owned = this.document.getElementById(id);
          if (owned && !visited.has(owned)) roots.push(owned);
        }
      }
    }
    return false;
  }
}

export const AerisPopoverModule = [
  AerisPopover,
  AerisPopoverHeaderTemplate,
  AerisPopoverFooterTemplate,
  AerisPopoverCloseIconTemplate,
  AerisPopoverHeadlessTemplate,
] as const;
