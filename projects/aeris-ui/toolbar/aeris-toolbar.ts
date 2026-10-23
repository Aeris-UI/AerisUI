import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  HostAttributeToken,
  ViewEncapsulation,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { aerisInternalCreateFrameScheduler, ɵAerisAppendTo } from '@aeris-ui/core';

export type AerisToolbarVariant = 'outlined' | 'filled' | 'elevated' | 'plain';
export type AerisToolbarSize = 'sm' | 'md' | 'lg';
export type AerisToolbarOrientation = 'horizontal' | 'vertical';
export type AerisToolbarRole = 'toolbar' | 'group' | null;
export type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';
export type AerisToolbarSelectionMode = 'none' | 'single' | 'multiple';
export type AerisToolbarValue = string | readonly string[] | null;
export type AerisToolbarPosition = 'top' | 'bottom';
export type AerisToolbarFloatingScope = 'viewport' | 'container';

/** Establishes the containing block for a container-scoped floating toolbar. */
@Directive({ selector: '[aerisToolbarContainer]', host: { class: 'aeris-toolbar-container' } })
export class AerisToolbarContainer {}

/** Keeps action text accessible when visually collapsed on narrow screens. */
@Directive({ selector: '[aerisToolbarLabel]', host: { class: 'aeris-toolbar__label' } })
export class AerisToolbarLabel {}

@Directive({
  selector: '[aerisToolbarStart]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--start' },
})
export class AerisToolbarStart {}

@Directive({
  selector: '[aerisToolbarCenter]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--center' },
})
export class AerisToolbarCenter {}

@Directive({
  selector: '[aerisToolbarEnd]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--end' },
})
export class AerisToolbarEnd {}

@Directive({
  selector: '[aerisToolbarGroup]',
  host: {
    class: 'aeris-toolbar__group',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-attached]': 'attached() || null',
    '[attr.data-selection]': 'selectionMode()',
  },
})
export class AerisToolbarGroup {
  /** @internal */
  readonly toolbar = inject(AerisToolbar);
  readonly ariaLabel = input(
    inject(new HostAttributeToken('aria-label'), { optional: true }) ?? '',
  );
  readonly ariaLabelledBy = input('');
  readonly attached = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly selectionMode = input<AerisToolbarSelectionMode>('none');
  readonly value = model<AerisToolbarValue>(null);
  readonly allowEmpty = input(false, { transform: booleanAttribute });

  /** @internal */
  isPressed(key: string | null): boolean {
    if (key === null) return false;
    const value = this.value();
    return this.selectionMode() === 'single'
      ? value === key
      : this.selectionMode() === 'multiple' && Array.isArray(value) && value.includes(key);
  }

  /** @internal */
  activate(key: string | null): void {
    if (this.disabled() || key === null || this.selectionMode() === 'none') return;
    if (this.selectionMode() === 'single') {
      if (this.value() !== key) this.value.set(key);
      else if (this.allowEmpty()) this.value.set(null);
    } else {
      const value = this.value();
      const values: readonly string[] = Array.isArray(value) ? value : [];
      this.value.set(
        values.includes(key) ? values.filter((item) => item !== key) : [...values, key],
      );
    }
  }
}

@Directive({
  selector: '[aerisToolbarSeparator]',
  host: {
    class: 'aeris-toolbar__separator',
    role: 'separator',
    '[attr.aria-orientation]': 'toolbar.orientation() === "horizontal" ? "vertical" : "horizontal"',
  },
})
export class AerisToolbarSeparator {
  protected readonly toolbar = inject(AerisToolbar);
}

@Directive({
  selector: '[aerisToolbarSpacer]',
  host: {
    class: 'aeris-toolbar__spacer',
    'aria-hidden': 'true',
  },
})
export class AerisToolbarSpacer {}

@Component({
  selector: 'aeris-toolbar',
  hostDirectives: [ɵAerisAppendTo],
  template: `
    <div
      #viewport
      class="aeris-toolbar__viewport"
      [attr.data-dragging]="dragging() || null"
      (scroll)="scheduleOverflow()"
      (pointerdown)="startDrag($event)"
      (pointermove)="moveDrag($event)"
      (pointerup)="endDrag($event)"
      (pointercancel)="endDrag($event)"
      (pointerleave)="leaveDrag($event)"
      (lostpointercapture)="endDrag($event)"
    >
      <div #content class="aeris-toolbar__content">
        <ng-content />
      </div>
    </div>
    <span class="aeris-toolbar__fade aeris-toolbar__fade--start" aria-hidden="true"></span>
    <span class="aeris-toolbar__fade aeris-toolbar__fade--end" aria-hidden="true"></span>
  `,
  styleUrl: './aeris-toolbar.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-toolbar',
    '[attr.id]': 'id() || null',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
    '[attr.aria-orientation]': 'role() === "toolbar" ? orientation() : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.inert]': 'disabled() || !visible() ? "" : null',
    '[attr.aria-hidden]': '!visible() ? "true" : null',
    '[attr.data-visible]': 'visible()',
    '[attr.data-floating]': 'floating() || null',
    '[attr.data-floating-scope]': 'floatingScope()',
    '[attr.data-position]': 'position()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-align]': 'align()',
    '[attr.data-wrap]': 'wrap()',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-attached]': 'attached() || null',
    '[attr.data-scroll-start]': 'canScrollStart() || null',
    '[attr.data-scroll-end]': 'canScrollEnd() || null',
    '(focusin)': 'rememberFocus()',
    '(focusout)': 'trackFocusExit($event)',
  },
})
export class AerisToolbar {
  readonly id = input('');
  readonly variant = input<AerisToolbarVariant>('plain');
  readonly attached = input(false, { transform: booleanAttribute });
  readonly size = input<AerisToolbarSize>('md');
  readonly orientation = input<AerisToolbarOrientation>('horizontal');
  readonly align = input<AerisToolbarAlign>('center');
  readonly wrap = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly role = input<AerisToolbarRole>('toolbar');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly floating = input(false, { transform: booleanAttribute });
  readonly visible = input(true, { transform: booleanAttribute });
  readonly position = input<AerisToolbarPosition>('bottom');
  readonly floatingScope = input<AerisToolbarFloatingScope>('viewport');
  readonly restoreFocusTo = input<HTMLElement | null>(null);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly portal = inject(ɵAerisAppendTo);
  private previouslyVisible = false;
  private focusWithin = false;
  private returnFocusTarget: HTMLElement | null = null;
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly items = contentChildren(AerisToolbarItem, { descendants: true });
  private readonly active = signal<AerisToolbarItem | null>(null);
  private readonly enabledItems = computed(() =>
    this.items().filter((item) => item.toolbar === this && !item.effectiveDisabled()),
  );
  /** @internal */
  readonly tabStop = computed(() => {
    const items = this.enabledItems();
    const active = this.active();
    return (active && items.includes(active) ? active : null) ?? items[0] ?? null;
  });
  protected readonly canScrollStart = signal(false);
  protected readonly canScrollEnd = signal(false);
  private readonly overflowFrame = aerisInternalCreateFrameScheduler(() => this.readOverflow());
  protected readonly dragging = signal(false);
  private drag: {
    id: number;
    start: number;
    scroll: number;
    vertical: boolean;
    moved: boolean;
  } | null = null;
  private suppressClick = false;

  constructor() {
    this.portal.setTarget('self');
    afterRenderEffect(() =>
      this.portal.setTarget(
        this.floating() && this.floatingScope() === 'viewport' ? 'body' : 'self',
      ),
    );
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const viewport = this.viewport()?.nativeElement;
      const content = this.content()?.nativeElement;
      if (!viewport || !content) return;
      const observer =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver(() => this.scheduleOverflow());
      observer?.observe(viewport);
      observer?.observe(content);
      this.readOverflow();
      const cancelDragClick = (event: MouseEvent): void => {
        if (!this.suppressClick || event.detail === 0) return;
        this.suppressClick = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      viewport.addEventListener('click', cancelDragClick, true);
      destroyRef.onDestroy(() => {
        observer?.disconnect();
        viewport.removeEventListener('click', cancelDragClick, true);
      });
    });
    afterRenderEffect(() => {
      this.orientation();
      this.wrap();
      this.items();
      this.scheduleOverflow();
    });
    afterRenderEffect(() => {
      const visible = this.visible();
      const host = this.element.nativeElement;
      const document = host.ownerDocument;
      if (visible === this.previouslyVisible) return;
      this.previouslyVisible = visible;
      if (visible) {
        const active = document.activeElement;
        this.returnFocusTarget =
          active instanceof HTMLElement && !host.contains(active) ? active : null;
        this.scheduleOverflow();
      } else if (
        this.focusWithin &&
        (host.contains(document.activeElement) || document.activeElement === document.body)
      ) {
        const target = this.restoreFocusTo() ?? this.returnFocusTarget;
        if (target?.isConnected && !target.closest('[hidden], [inert]'))
          target.focus({ preventScroll: true });
        this.focusWithin = false;
      }
    });
    destroyRef.onDestroy(() => this.overflowFrame.cancel());
  }

  protected rememberFocus(): void {
    this.focusWithin = true;
  }

  protected trackFocusExit(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      !this.element.nativeElement.contains(event.relatedTarget)
    ) {
      this.focusWithin = false;
    }
  }

  protected scheduleOverflow(): void {
    this.overflowFrame.schedule();
  }

  protected startDrag(event: PointerEvent): void {
    this.suppressClick = false;
    const viewport = this.viewport()?.nativeElement;
    if (
      !viewport ||
      this.disabled() ||
      this.drag ||
      event.pointerType !== 'mouse' ||
      event.button !== 0
    )
      return;
    const target = event.target;
    if (target instanceof Element && target.closest('.aeris-toolbar__viewport') !== viewport)
      return;
    if (
      target instanceof Element &&
      target.closest(
        'button:not([aerisToolbarItem]), a, input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="spinbutton"], [draggable="true"]',
      )
    )
      return;
    const vertical = this.orientation() === 'vertical';
    if (
      (vertical
        ? viewport.scrollHeight - viewport.clientHeight
        : viewport.scrollWidth - viewport.clientWidth) <= 1
    )
      return;
    this.drag = {
      id: event.pointerId,
      start: vertical ? event.clientY : event.clientX,
      scroll: vertical ? viewport.scrollTop : viewport.scrollLeft,
      vertical,
      moved: false,
    };
    // Keep a partial button from moving under the pointer through native focus scrolling.
    event.preventDefault();
  }

  protected moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    const viewport = this.viewport()?.nativeElement;
    if (!drag || !viewport || drag.id !== event.pointerId) return;
    const position = drag.vertical ? event.clientY : event.clientX;
    const distance = position - drag.start;
    if (!drag.moved && Math.abs(distance) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      this.dragging.set(true);
      viewport.setPointerCapture?.(event.pointerId);
    }
    event.preventDefault();
    if (drag.vertical) viewport.scrollTop = drag.scroll - distance;
    else viewport.scrollLeft = drag.scroll - distance;
    drag.start = position;
    drag.scroll = drag.vertical ? viewport.scrollTop : viewport.scrollLeft;
  }

  protected endDrag(event: PointerEvent): void {
    if (this.drag?.id !== event.pointerId) return;
    this.suppressClick = this.drag.moved;
    this.drag = null;
    this.dragging.set(false);
    const viewport = this.viewport()?.nativeElement;
    if (viewport?.hasPointerCapture?.(event.pointerId))
      viewport.releasePointerCapture(event.pointerId);
  }

  protected leaveDrag(event: PointerEvent): void {
    if (!this.drag?.moved) this.endDrag(event);
  }

  private readOverflow(): void {
    const viewport = this.viewport()?.nativeElement;
    if (!viewport || this.wrap()) {
      this.canScrollStart.set(false);
      this.canScrollEnd.set(false);
      return;
    }
    const vertical = this.orientation() === 'vertical';
    const offset = vertical ? viewport.scrollTop : Math.abs(viewport.scrollLeft);
    const maximum = vertical
      ? viewport.scrollHeight - viewport.clientHeight
      : viewport.scrollWidth - viewport.clientWidth;
    this.canScrollStart.set(offset > 1);
    this.canScrollEnd.set(maximum - offset > 1);
  }

  /** Focus the last available toolbar item, or the first enabled item on first entry. */
  focus(options?: FocusOptions): void {
    if (!this.visible() || this.disabled()) return;
    this.tabStop()?.focus(options);
  }

  /** @internal */
  focusItem(item: AerisToolbarItem): void {
    this.active.set(item);
  }

  /** @internal Reveal the item with a glimpse of its next neighbor, without moving the page. */
  revealItem(item: AerisToolbarItem, direction = 1): void {
    const viewport = this.viewport()?.nativeElement;
    if (!viewport || this.wrap()) return;
    const vertical = this.orientation() === 'vertical';
    const bounds = item.element.nativeElement.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    const available = Math.max(
      0,
      vertical ? frame.height - bounds.height : frame.width - bounds.width,
    );
    const items = this.items().filter(
      (candidate) =>
        candidate.toolbar === this &&
        !candidate.element.nativeElement.closest('[hidden], [inert], [aria-hidden="true"]'),
    );
    const index = items.indexOf(item);
    const before = index > 0;
    const after = index >= 0 && index < items.length - 1;
    const leading = before ? Math.min(direction < 0 ? 48 : 32, available / 2) : 0;
    const trailing = after ? Math.min(direction < 0 ? 32 : 48, available - leading) : 0;
    const rtl =
      !vertical &&
      this.element.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.element.nativeElement,
      ).direction === 'rtl';
    const start = (vertical ? frame.top : frame.left) + (rtl ? trailing : leading);
    const end = (vertical ? frame.bottom : frame.right) - (rtl ? leading : trailing);
    const itemStart = vertical ? bounds.top : bounds.left;
    const itemEnd = vertical ? bounds.bottom : bounds.right;
    const distance = itemStart < start ? itemStart - start : itemEnd > end ? itemEnd - end : 0;
    if (vertical) viewport.scrollTop += distance;
    else viewport.scrollLeft += distance;
  }

  /** @internal */
  navigate(event: KeyboardEvent, item: AerisToolbarItem): void {
    if (
      this.role() !== 'toolbar' ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      item.expanded()
    )
      return;
    const vertical = this.orientation() === 'vertical';
    if (item.menu() && !vertical && event.key === 'ArrowDown') {
      event.preventDefault();
      item.element.nativeElement.click();
      return;
    }
    const rtl =
      this.element.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.element.nativeElement,
      ).direction === 'rtl';
    let delta = 0;
    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) delta = vertical || !rtl ? 1 : -1;
    if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) delta = vertical || !rtl ? -1 : 1;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    const items = this.enabledItems().filter(
      (candidate) =>
        !candidate.element.nativeElement.closest('[hidden], [inert], [aria-hidden="true"]'),
    );
    if (!items.length || item.effectiveDisabled()) return;
    event.preventDefault();
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : (items.indexOf(item) + delta + items.length) % items.length;
    const next = items[index];
    if (!next) return;
    this.active.set(next);
    next.focus({ preventScroll: true });
    this.revealItem(next, delta || (event.key === 'Home' ? -1 : 1));
  }
}

/** Native toolbar control with independent action, toggle, or group-selection behavior. */
@Directive({
  selector: 'button[aerisToolbarItem]',
  host: {
    class: 'aeris-toolbar__item',
    type: 'button',
    '[disabled]': 'effectiveDisabled()',
    '[attr.tabindex]': 'toolbar.role() === "toolbar" ? toolbar.tabStop() === this ? 0 : -1 : null',
    '[attr.aria-pressed]': 'toggleable() ? selected() : null',
    '[attr.aria-haspopup]': 'menu() ? "menu" : null',
    '[attr.aria-expanded]': 'menu() ? expanded() : null',
    '[attr.aria-controls]': 'ariaControls() || null',
    '[attr.data-pressed]': 'selected() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '(click)': 'activate($event)',
    '(keydown)': 'toolbar.navigate($event, this)',
    '(focus)': 'toolbar.focusItem(this)',
  },
})
export class AerisToolbarItem {
  /** @internal */
  readonly toolbar = inject(AerisToolbar);
  /** @internal */
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly parentGroup = inject(AerisToolbarGroup, { optional: true });
  private readonly group = this.parentGroup?.toolbar === this.toolbar ? this.parentGroup : null;
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly pressed = model<boolean | null>(null);
  readonly value = input<string | null>(null);
  readonly menu = input(false, { transform: booleanAttribute });
  readonly expanded = input(false, { transform: booleanAttribute });
  readonly ariaControls = input('');
  /** @internal */
  readonly effectiveDisabled = computed(
    () => this.disabled() || this.toolbar.disabled() || (this.group?.disabled() ?? false),
  );
  protected readonly toggleable = computed(
    () => (this.group?.selectionMode() ?? 'none') !== 'none' || this.pressed() !== null,
  );
  protected readonly selected = computed(() =>
    this.group && this.group.selectionMode() !== 'none'
      ? this.group.isPressed(this.value())
      : this.pressed() === true,
  );

  protected activate(event: MouseEvent): void {
    if (this.effectiveDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.detail > 0) this.focus({ preventScroll: true });
    this.toolbar.revealItem(this);
    if (this.group && this.group.selectionMode() !== 'none') this.group.activate(this.value());
    else if (this.pressed() !== null) this.pressed.set(!this.pressed());
  }

  /** Focus this control without activating it. */
  focus(options?: FocusOptions): void {
    this.element.nativeElement.focus(options);
  }
}

export const AerisToolbarModule = [
  AerisToolbar,
  AerisToolbarContainer,
  AerisToolbarLabel,
  AerisToolbarStart,
  AerisToolbarCenter,
  AerisToolbarEnd,
  AerisToolbarGroup,
  AerisToolbarSpacer,
  AerisToolbarSeparator,
  AerisToolbarItem,
] as const;
