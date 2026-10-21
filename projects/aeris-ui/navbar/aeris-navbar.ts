import { DOCUMENT } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
  ElementRef,
  InjectionToken,
  Renderer2,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ɵAerisIcon,
  ɵAerisAppendTo,
  type AerisAppendTo,
  aerisInternalFocusableElements,
} from '@aeris-ui/core';

export type AerisNavbarMode = 'auto' | 'desktop' | 'mobile';
export type AerisNavbarVariant = 'standard' | 'floating' | 'transparent';

const navbarContext = new InjectionToken<AerisNavbar>('AerisNavbar context');
let nextNavbarId = 0;
let nextDisclosureId = 0;

@Directive({ selector: '[aerisNavbarBrand]', host: { class: 'aeris-navbar__brand' } })
export class AerisNavbarBrand {}
@Directive({ selector: '[aerisNavbarLinks]', host: { class: 'aeris-navbar__links' } })
export class AerisNavbarLinks {}
@Directive({ selector: '[aerisNavbarActions]', host: { class: 'aeris-navbar__actions' } })
export class AerisNavbarActions {}
@Directive({
  selector: '[aerisNavbarIcon]',
  host: { class: 'aeris-navbar__icon', 'aria-hidden': 'true' },
})
export class AerisNavbarIcon {}

@Directive({
  selector: 'button[aerisNavbarToggle]',
  host: {
    class: 'aeris-navbar__toggle',
    type: 'button',
    '[attr.aria-controls]': 'navbar.navigationId',
    '[attr.aria-expanded]': 'navbar.expanded()',
    '[attr.aria-label]': 'navbar.expanded() ? navbar.closeAriaLabel() : navbar.openAriaLabel()',
    '[hidden]': '!navbar.mobile()',
    '(click)': 'navbar.toggle()',
  },
})
export class AerisNavbarToggle {
  protected readonly navbar = inject(navbarContext);
}

@Component({
  selector: 'aeris-navbar',
  imports: [ɵAerisIcon],
  providers: [{ provide: navbarContext, useExisting: forwardRef(() => AerisNavbar) }],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './aeris-navbar.scss',
  template: `
    <div #bar class="aeris-navbar__bar">
      <ng-content select="[aerisNavbarBrand]" />
      <nav
        #navigation
        class="aeris-navbar__navigation"
        [id]="navigationId"
        [attr.aria-label]="ariaLabelledBy() ? null : ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [hidden]="mobile() && !expanded()"
        (click)="handleNavigationClick($event)"
      >
        <ng-content select="[aerisNavbarLinks]" />
        @if (indicator(); as line) {
          <span
            class="aeris-navbar__indicator"
            aria-hidden="true"
            [attr.data-ready]="indicatorReady() || null"
            [style.width.px]="line.width"
            [style.transform]="'translate3d(' + line.x + 'px, ' + line.y + 'px, 0)'"
          ></span>
        }
      </nav>
      <ng-content select="[aerisNavbarActions]" />
      <ng-content select="[aerisNavbarToggle]" />
      @if (mobile() && !customToggle()) {
        <button
          #defaultToggle
          type="button"
          class="aeris-navbar__toggle"
          [attr.aria-controls]="navigationId"
          [attr.aria-expanded]="expanded()"
          [attr.aria-label]="expanded() ? closeAriaLabel() : openAriaLabel()"
          (click)="toggle()"
        >
          @if (expanded()) {
            <span
              aerisInternalIcon="close"
              class="aeris-navbar__close-icon"
              aria-hidden="true"
            ></span>
          } @else {
            <span
              aerisInternalIcon="menu"
              class="aeris-navbar__menu-icon"
              aria-hidden="true"
            ></span>
          }
        </button>
      }
    </div>
  `,
  host: {
    class: 'aeris-navbar',
    '[style.--aeris-navbar-max-width]': 'maxWidth()',
    '[attr.data-alignment]': 'alignment()',
    '[attr.data-mobile]': 'mobile() || null',
    '[attr.data-expanded]': '(mobile() && expanded()) || null',
    '[attr.data-sticky]': 'sticky() || null',
    '[attr.data-variant]': 'variant()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class AerisNavbar {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly navigation = viewChild<ElementRef<HTMLElement>>('navigation');
  private readonly bar = viewChild<ElementRef<HTMLElement>>('bar');
  private readonly defaultToggle = viewChild<ElementRef<HTMLButtonElement>>('defaultToggle');
  /** @internal */
  readonly ɵdropdowns = contentChildren(AerisNavbarDropdown, { descendants: true });
  private readonly dropdownElements = contentChildren(AerisNavbarDropdown, {
    descendants: true,
    read: ElementRef,
  });
  protected readonly customToggle = contentChild(AerisNavbarToggle);
  private readonly compact = signal(false);
  private readonly restoreFocus = signal<'toggle' | 'navigation' | null>(null);
  private readonly items = contentChildren(AerisNavbarItem, { descendants: true });
  private readonly itemElements = contentChildren(AerisNavbarItem, {
    descendants: true,
    read: ElementRef,
  });
  protected readonly indicator = signal<{ x: number; y: number; width: number } | null>(null);
  protected readonly indicatorReady = signal(false);
  readonly expanded = model(false);
  readonly mode = input<AerisNavbarMode>('auto');
  readonly breakpoint = input<number | 'auto'>(768);
  readonly variant = input<AerisNavbarVariant>('standard');
  readonly maxWidth = input('72rem');
  readonly alignment = input<'start' | 'center' | 'end'>('center');
  readonly sticky = input(false, { transform: booleanAttribute });
  readonly closeOnNavigate = input(true, { transform: booleanAttribute });
  readonly closeOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Primary navigation');
  readonly ariaLabelledBy = input('');
  readonly openAriaLabel = input('Open navigation');
  readonly closeAriaLabel = input('Close navigation');
  readonly navigationId = `aeris-navbar-${nextNavbarId++}`;
  readonly mobile = computed(
    () => this.mode() === 'mobile' || (this.mode() === 'auto' && this.compact()),
  );

  constructor() {
    afterRenderEffect((onCleanup) => {
      const navigation = this.navigation()?.nativeElement;
      const elements = this.itemElements();
      const active = this.items().findIndex(
        (item, index) =>
          item.active() &&
          !item.disabled() &&
          elements[index]?.nativeElement.parentElement?.matches('[aerisNavbarLinks]'),
      );
      const dropdownElements = this.dropdownElements();
      const activeDropdown = this.ɵdropdowns().findIndex(
        (dropdown, index) =>
          dropdown.active() &&
          dropdownElements[index]?.nativeElement.parentElement?.matches('[aerisNavbarLinks]'),
      );
      const target = (elements[active]?.nativeElement ??
        dropdownElements[activeDropdown]?.nativeElement.querySelector(
          '.aeris-navbar__dropdown-trigger',
        )) as HTMLElement | undefined;
      if (this.mobile() || !navigation || !target) {
        this.indicator.set(null);
        this.indicatorReady.set(false);
        return;
      }
      let frame = 0;
      let readyFrame = 0;
      const update = () => {
        this.indicator.set({
          x: target.offsetLeft + 12,
          y: target.offsetTop + target.offsetHeight,
          width: Math.max(2, target.offsetWidth - 24),
        });
        if (!untracked(this.indicatorReady)) {
          readyFrame = requestAnimationFrame(() => this.indicatorReady.set(true));
        }
      };
      frame = requestAnimationFrame(update);
      const observer =
        typeof ResizeObserver === 'function'
          ? new ResizeObserver(() => {
              cancelAnimationFrame(frame);
              frame = requestAnimationFrame(update);
            })
          : null;
      observer?.observe(navigation);
      for (const element of elements) {
        if (element.nativeElement.parentElement?.matches('[aerisNavbarLinks]'))
          observer?.observe(element.nativeElement);
      }
      for (const element of dropdownElements) {
        const trigger = element.nativeElement.querySelector('.aeris-navbar__dropdown-trigger');
        if (trigger && element.nativeElement.parentElement?.matches('[aerisNavbarLinks]'))
          observer?.observe(trigger);
      }
      onCleanup(() => {
        observer?.disconnect();
        cancelAnimationFrame(frame);
        cancelAnimationFrame(readyFrame);
      });
    });
    afterRenderEffect((onCleanup) => {
      if (this.mode() !== 'auto') return;
      const value = this.breakpoint();
      this.alignment();
      this.maxWidth();
      const bar = this.bar()?.nativeElement ?? this.host;
      const breakpoint = value !== 'auto' && Number.isFinite(value) ? Math.max(0, value) : 768;
      const update = () => {
        if (value === 'auto' && !bar.clientWidth) return;
        const compact =
          value === 'auto'
            ? this.contentOverflows(bar)
            : (bar.clientWidth || this.host.clientWidth) <= breakpoint;
        if (
          compact &&
          !this.mobile() &&
          this.navigation()?.nativeElement.contains(this.document.activeElement)
        )
          this.restoreFocus.set('toggle');
        this.compact.set(compact);
      };
      untracked(update);
      let frame = 0;
      let disposed = false;
      const schedule = () => {
        if (disposed || frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      };
      const observer = new ResizeObserver(value === 'auto' ? schedule : update);
      observer.observe(bar);
      const mutations = value === 'auto' ? new MutationObserver(schedule) : null;
      if (value === 'auto') {
        for (const element of bar.querySelectorAll<HTMLElement>(
          '.aeris-navbar__brand, .aeris-navbar__actions, [aerisNavbarLinks] > *',
        ))
          observer.observe(element);
        mutations?.observe(this.host, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'hidden', 'dir', 'data-active'],
        });
        this.document.fonts?.addEventListener('loadingdone', schedule);
        void this.document.fonts?.ready.then(schedule);
      }
      onCleanup(() => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        mutations?.disconnect();
        this.document.fonts?.removeEventListener('loadingdone', schedule);
      });
    });
    let previousMobile = false;
    effect(() => {
      const mobile = this.mobile();
      const expanded = this.expanded();
      if (!mobile && previousMobile) {
        if (this.host.querySelector('.aeris-navbar__toggle')?.contains(this.document.activeElement))
          this.restoreFocus.set('navigation');
        this.expanded.set(false);
      }
      if (
        mobile &&
        !expanded &&
        this.navigation()?.nativeElement.contains(this.document.activeElement)
      )
        this.restoreFocus.set('toggle');
      previousMobile = mobile;
    });
    afterRenderEffect(() => {
      const target = this.restoreFocus();
      if (target === 'toggle' && this.mobile()) {
        (
          this.defaultToggle()?.nativeElement ??
          this.host.querySelector<HTMLButtonElement>('button[aerisNavbarToggle]')
        )?.focus({ preventScroll: true });
      } else if (target === 'navigation' && !this.mobile()) {
        const navigation = this.navigation()?.nativeElement;
        if (navigation)
          aerisInternalFocusableElements(navigation, { checkComputedVisibility: true })[0]?.focus({
            preventScroll: true,
          });
      }
      this.restoreFocus.set(null);
    });
    effect((onCleanup) => {
      if (!this.mobile() || !this.expanded() || !this.closeOnOutsideClick()) return;
      onCleanup(
        this.renderer.listen(this.document, 'pointerdown', (event: PointerEvent) => {
          if (event.target instanceof Node && !this.host.contains(event.target))
            this.expanded.set(false);
        }),
      );
    });
  }
  private contentOverflows(bar: HTMLElement): boolean {
    // Measure the same projected content in its desktop layout, even when the mobile
    // navigation is hidden. Restore it synchronously before paint; no clones or focus changes.
    this.host.setAttribute('data-measuring', '');
    try {
      const view = this.document.defaultView;
      if (!view) return false;
      const width = (selector: string) => {
        const element = bar.querySelector<HTMLElement>(selector);
        if (!element) return 0;
        const style = view.getComputedStyle(element);
        return (
          element.offsetWidth +
          (parseFloat(style.marginLeft) || 0) +
          (parseFloat(style.marginRight) || 0)
        );
      };
      const brand = width(':scope > .aeris-navbar__brand');
      const actions = width(':scope > .aeris-navbar__actions');
      const navigation = width(':scope > .aeris-navbar__navigation');
      const style = view.getComputedStyle(bar);
      const spacing =
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.paddingRight) || 0) +
        2 * (parseFloat(style.columnGap) || 0);
      const sides = this.alignment() === 'center' ? 2 * Math.max(brand, actions) : brand + actions;
      return navigation + sides + spacing > bar.clientWidth + 0.5;
    } finally {
      this.host.removeAttribute('data-measuring');
    }
  }
  toggle(): void {
    if (this.mobile()) this.expanded.update((expanded) => !expanded);
  }
  close(): void {
    this.expanded.set(false);
  }
  protected handleNavigationClick(event: MouseEvent): void {
    if (!this.closeOnNavigate() || !normalActivation(event)) return;
    const item =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('.aeris-navbar__item')
        : null;
    if (
      item &&
      !item.hasAttribute('disabled') &&
      item.getAttribute('aria-disabled') !== 'true' &&
      !(item instanceof HTMLAnchorElement && item.target && item.target !== '_self')
    )
      this.close();
  }
  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.mobile() && this.expanded()) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
      this.restoreFocus.set('toggle');
    }
  }
}

@Directive({
  selector: 'a[aerisNavbarItem], button[aerisNavbarItem]',
  host: {
    class: 'aeris-navbar__item',
    '[attr.data-active]': 'active() || null',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.disabled]': 'isButton && disabled() ? "" : null',
    '[attr.type]': 'isButton ? "button" : null',
  },
})
export class AerisNavbarItem {
  private readonly element =
    inject<ElementRef<HTMLAnchorElement | HTMLButtonElement>>(ElementRef).nativeElement;
  protected readonly isButton = this.element.tagName === 'BUTTON';
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  constructor() {
    const renderer = inject(Renderer2);
    const stop = renderer.listen(
      this.element,
      'click',
      (event: MouseEvent) => {
        if (this.disabled()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    inject(DestroyRef).onDestroy(stop);
    effect((onCleanup) => {
      if (!this.disabled() || this.isButton) return;
      const previous = this.element.getAttribute('tabindex');
      renderer.setAttribute(this.element, 'tabindex', '-1');
      onCleanup(() => {
        if (previous === null) renderer.removeAttribute(this.element, 'tabindex');
        else renderer.setAttribute(this.element, 'tabindex', previous);
      });
    });
  }
}

@Component({
  selector: 'aeris-navbar-dropdown',
  imports: [ɵAerisIcon, ɵAerisAppendTo],
  template: `
    <button
      #trigger
      type="button"
      class="aeris-navbar__dropdown-trigger"
      [attr.data-active]="active() || null"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="expanded() ? contentId : null"
      (click)="handleTriggerClick($event)"
      (keydown)="handleTriggerKeydown($event)"
    >
      {{ label() }}
      <span aerisInternalIcon="chevron" class="aeris-navbar__chevron"></span>
    </button>
    @if (expanded()) {
      <div
        #panel
        class="aeris-navbar__dropdown"
        role="group"
        [attr.aria-label]="label()"
        [id]="contentId"
        [attr.data-inline]="navbar.mobile() || null"
        [aerisInternalAppendTo]="navbar.mobile() ? 'self' : appendTo()"
        [aerisInternalAppendToAnchor]="navbar.mobile() ? null : trigger"
        [aerisInternalAppendToPositionSelf]="!navbar.mobile()"
        [aerisInternalAppendToDismiss]="dismiss"
        aerisInternalAppendToDefault="body"
        [aerisInternalAppendToPlacement]="
          parent && !navbar.mobile() ? (rtl() ? 'left' : 'right') : 'bottom'
        "
        [aerisInternalAppendToOffset]="parent ? 6 : 7"
        aerisInternalAppendToAlignment="start"
        (aerisInternalAppendToOutside)="closeOutside($event)"
        (pointerenter)="handlePointerEnter($event)"
        (pointerleave)="handlePointerLeave($event)"
        (keydown)="handleKeydown($event)"
        (click)="handleClick($event)"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'aeris-navbar__disclosure',
    '[attr.data-expanded]': 'expanded() || null',
    '[attr.data-nested]': '!!parent || null',
    '[attr.data-mobile]': 'navbar.mobile() || null',
    '[attr.data-rtl]': 'rtl() || null',
    '(keydown)': 'handleKeydown($event)',
    '(pointerenter)': 'handlePointerEnter($event)',
    '(pointerleave)': 'handlePointerLeave($event)',
  },
})
export class AerisNavbarDropdown {
  protected readonly navbar = inject(navbarContext);
  private readonly document = inject(DOCUMENT);
  protected readonly parent = inject(AerisNavbarDropdown, { optional: true, skipSelf: true });
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly focusFirst = signal(false);
  protected readonly rtl = signal(false);
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly label = input.required<string>();
  readonly expanded = model(false);
  readonly appendTo = input<AerisAppendTo>();
  private readonly items = contentChildren(AerisNavbarItem, { descendants: true });
  readonly active = computed(() => this.items().some((item) => item.active() && !item.disabled()));
  protected readonly contentId = `aeris-navbar-dropdown-${nextDisclosureId++}`;
  protected readonly dismiss = () => {
    if (!this.expanded()) return false;
    this.close(true);
    return true;
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.closeTimer));
    afterRenderEffect(() => {
      this.expanded();
      this.navbar.mobile();
      const trigger = this.trigger()?.nativeElement;
      if (trigger)
        this.rtl.set(this.document.defaultView?.getComputedStyle(trigger).direction === 'rtl');
    });
    afterRenderEffect(() => {
      if (!this.focusFirst()) return;
      const panel = this.panel()?.nativeElement;
      if (this.expanded() && panel)
        aerisInternalFocusableElements(panel)[0]?.focus({ preventScroll: true });
      this.focusFirst.set(false);
    });
    effect(() => {
      if (!this.expanded()) return;
      for (const dropdown of this.navbar.ɵdropdowns()) {
        if (dropdown !== this && dropdown.parent === this.parent) dropdown.close(false);
      }
    });
    effect(() => {
      if (
        (this.parent && !this.parent.expanded()) ||
        (this.navbar.mobile() && !this.navbar.expanded())
      )
        this.expanded.set(false);
    });
    effect((onCleanup) => {
      if (!this.expanded()) return;
      const onFocus = (event: FocusEvent) => {
        const target = event.target;
        if (target instanceof Node && !this.containsTarget(target)) this.close(false);
      };
      this.document.addEventListener('focusin', onFocus);
      onCleanup(() => this.document.removeEventListener('focusin', onFocus));
    });
  }
  close(restoreFocus = false): void {
    clearTimeout(this.closeTimer);
    this.expanded.set(false);
    if (restoreFocus) this.trigger()?.nativeElement.focus({ preventScroll: true });
  }
  protected closeOutside(event: PointerEvent): void {
    if (event.target instanceof Node && this.containsTarget(event.target)) return;
    this.close(false);
  }
  private containsTarget(target: Node): boolean {
    return (
      this.host.contains(target) ||
      !!this.panel()?.nativeElement.contains(target) ||
      this.navbar
        .ɵdropdowns()
        .some((child) => child.parent === this && child.containsTarget(target))
    );
  }
  protected handlePointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.navbar.mobile()) return;
    for (let dropdown: AerisNavbarDropdown | null = this; dropdown; dropdown = dropdown.parent)
      clearTimeout(dropdown.closeTimer);
    if (this.parent) this.expanded.set(true);
  }
  protected handlePointerLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.navbar.mobile() || !this.parent) return;
    if (event.relatedTarget instanceof Node && this.containsTarget(event.relatedTarget)) return;
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.close(false), 150);
  }
  protected handleTriggerClick(event: MouseEvent): void {
    if (
      this.parent &&
      !this.navbar.mobile() &&
      this.expanded() &&
      event instanceof PointerEvent &&
      event.pointerType === 'mouse'
    )
      return;
    this.expanded.update((expanded) => !expanded);
  }
  protected handleKeydown(event: KeyboardEvent): void {
    if (
      (event.key === 'Escape' ||
        (this.parent && event.key === (this.rtl() ? 'ArrowRight' : 'ArrowLeft'))) &&
      this.expanded()
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    } else if (event.key === 'Tab' && !this.navbar.mobile()) {
      const panel = this.panel()?.nativeElement;
      if (!panel) return;
      const items = aerisInternalFocusableElements(panel);
      if (event.shiftKey && this.document.activeElement === items[0]) {
        event.preventDefault();
        this.trigger()?.nativeElement.focus();
      } else if (!event.shiftKey && this.document.activeElement === items.at(-1)) {
        event.preventDefault();
        event.stopPropagation();
        this.focusAfterBranch();
      }
    }
  }
  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'ArrowDown' ||
      (this.parent && event.key === (this.rtl() ? 'ArrowLeft' : 'ArrowRight'))
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.expanded.set(true);
      this.focusFirst.set(true);
    } else if (event.key === 'Tab' && !event.shiftKey && this.expanded() && !this.navbar.mobile()) {
      const panel = this.panel()?.nativeElement;
      const first = panel ? aerisInternalFocusableElements(panel)[0] : undefined;
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  private focusAfterBranch(): void {
    const scope = this.parent?.panel()?.nativeElement ?? this.document.body;
    const trigger = this.trigger()?.nativeElement;
    const others = aerisInternalFocusableElements(scope).filter(
      (item) => item === trigger || !this.containsTarget(item),
    );
    const next = trigger ? others[others.indexOf(trigger) + 1] : undefined;
    this.close();
    if (next) next.focus();
    else this.parent?.focusAfterBranch();
  }
  protected handleClick(event: MouseEvent): void {
    if (
      !this.navbar.closeOnNavigate() ||
      !normalActivation(event) ||
      !(event.target instanceof Element)
    )
      return;
    const item = event.target.closest<HTMLAnchorElement | HTMLButtonElement>('.aeris-navbar__item');
    if (item && !(item instanceof HTMLAnchorElement && item.target && item.target !== '_self')) {
      let top: AerisNavbarDropdown = this;
      for (let dropdown: AerisNavbarDropdown | null = this; dropdown; dropdown = dropdown.parent) {
        dropdown.close();
        top = dropdown;
      }
      top.close(true);
      this.navbar.close();
    }
  }
}

function normalActivation(event: MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
}

export const AerisNavbarModule = [
  AerisNavbar,
  AerisNavbarBrand,
  AerisNavbarLinks,
  AerisNavbarActions,
  AerisNavbarIcon,
  AerisNavbarToggle,
  AerisNavbarItem,
  AerisNavbarDropdown,
] as const;
