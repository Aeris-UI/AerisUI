import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  InjectionToken,
  Renderer2,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ɵAerisIcon, aerisInternalFocusableElements } from '@aeris-ui/core';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';
import { AerisTooltip } from '@aeris-ui/core/tooltip';

export type AerisSidebarMode = 'auto' | 'desktop' | 'mobile';
export type AerisSidebarSide = 'start' | 'end';

const sidebarContext = new InjectionToken<AerisSidebar>('AerisSidebar context');
const toggleElements = new WeakMap<AerisSidebar, Set<HTMLElement>>();
let nextSidebarId = 0;
let nextGroupId = 0;

@Directive({ selector: '[aerisSidebarHeader]', host: { class: 'aeris-sidebar__brand' } })
export class AerisSidebarHeader {}

@Directive({ selector: '[aerisSidebarFooter]', host: { class: 'aeris-sidebar__footer' } })
export class AerisSidebarFooter {}

@Directive({
  selector: '[aerisSidebarIcon]',
  host: { class: 'aeris-sidebar__icon', 'aria-hidden': 'true' },
})
export class AerisSidebarIcon {}

@Directive({ selector: '[aerisSidebarBadge]', host: { class: 'aeris-sidebar__badge' } })
export class AerisSidebarBadge {}

@Component({
  selector: 'aeris-sidebar',
  imports: [NgTemplateOutlet, ɵAerisIcon, AerisDrawerModule],
  providers: [{ provide: sidebarContext, useExisting: forwardRef(() => AerisSidebar) }],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #navigation>
      <nav
        #navigationElement
        class="aeris-sidebar__navigation"
        [id]="navigationId"
        [attr.aria-label]="ariaLabelledBy() ? null : ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.data-icon-only]="iconOnly() || null"
        [attr.data-side]="side()"
        [attr.dir]="inheritedDirection()"
        [attr.data-mobile]="mobile() || null"
      >
        <header class="aeris-sidebar__header">
          <ng-content select="[aerisSidebarHeader]" />
          @if (mobile() || collapsible()) {
            <button
              class="aeris-sidebar__collapse"
              type="button"
              [attr.aria-label]="
                mobile() ? closeAriaLabel() : collapsed() ? expandAriaLabel() : collapseAriaLabel()
              "
              [attr.aria-expanded]="mobile() ? open() : !collapsed()"
              [attr.aria-controls]="navigationId"
              (click)="toggle()"
            >
              @if (mobile()) {
                <span
                  aerisInternalIcon="close"
                  class="aeris-sidebar__close-icon"
                  aria-hidden="true"
                ></span>
              } @else {
                <span
                  aerisInternalIcon="chevronRight"
                  class="aeris-sidebar__collapse-icon"
                  aria-hidden="true"
                ></span>
              }
            </button>
          }
        </header>
        <div class="aeris-sidebar__body"><ng-content /></div>
        <ng-content select="[aerisSidebarFooter]" />
      </nav>
    </ng-template>
    @if (mobile()) {
      <aeris-drawer
        [visible]="open()"
        (visibleChange)="open.set($event)"
        [position]="drawerPosition()"
        [ariaLabel]="ariaLabel()"
        [ariaLabelledBy]="ariaLabelledBy()"
        [width]="mobileWidth()"
        [mobileFullScreen]="false"
        [swipeToClose]="swipeToClose()"
      >
        <ng-template aerisDrawerHeadless
          ><ng-container [ngTemplateOutlet]="navigation"
        /></ng-template>
      </aeris-drawer>
    } @else {
      <ng-container [ngTemplateOutlet]="navigation" />
    }
  `,
  styleUrl: './aeris-sidebar.scss',
  host: {
    class: 'aeris-sidebar',
    '[attr.data-mobile]': 'mobile() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.data-reveal-labels]': '(hasCollapsed() && !iconOnly() && !mobile()) || null',
    '[style.--aeris-sidebar-width]': 'width() || null',
    '[style.--aeris-sidebar-collapsed-width]': 'collapsedWidth() || null',
  },
})
export class AerisSidebar {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly navigation = viewChild<ElementRef<HTMLElement>>('navigationElement');
  private readonly responsiveMobile = signal(false);
  protected readonly inheritedDirection = signal<'ltr' | 'rtl' | null>(null);
  readonly direction = computed(
    () =>
      this.inheritedDirection() ??
      (this.document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'),
  );
  private readonly pendingFocus = signal<'toggle' | 'navigation' | null>(null);

  readonly collapsed = model(false);
  readonly open = model(false);
  readonly mode = input<AerisSidebarMode>('auto');
  readonly breakpoint = input(768);
  readonly side = input<AerisSidebarSide>('start');
  readonly width = input('');
  readonly collapsedWidth = input('');
  readonly mobileWidth = input('min(20rem, calc(100vw - 2rem))');
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly closeOnNavigate = input(true, { transform: booleanAttribute });
  readonly swipeToClose = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Navigation');
  readonly ariaLabelledBy = input('');
  readonly collapseAriaLabel = input('Collapse navigation');
  readonly expandAriaLabel = input('Expand navigation');
  readonly closeAriaLabel = input('Close navigation');
  readonly navigationId = `aeris-sidebar-${nextSidebarId++}`;
  readonly mobile = computed(
    () => this.mode() === 'mobile' || (this.mode() === 'auto' && this.responsiveMobile()),
  );
  readonly iconOnly = computed(() => !this.mobile() && this.collapsed());
  // Initial expanded navigation renders immediately; only expansion reveals labels.
  protected readonly hasCollapsed = linkedSignal<boolean, boolean>({
    source: this.iconOnly,
    computation: (iconOnly, previous) => iconOnly || previous?.value === true,
  });
  protected readonly drawerPosition = computed(() =>
    (this.side() === 'start') === (this.direction() === 'ltr') ? 'left' : 'right',
  );

  constructor() {
    // Match after render so the initial server and hydration markup agree.
    afterRenderEffect((onCleanup) => {
      const breakpoint = this.breakpoint();
      if (this.mode() !== 'auto') return;
      const view = this.document.defaultView;
      if (!view?.matchMedia) return;
      const pixels = Number.isFinite(breakpoint) ? Math.max(0, breakpoint) : 768;
      const query = view.matchMedia(`(max-width: ${pixels}px)`);
      const update = () => {
        if (query.matches && this.host.contains(this.document.activeElement))
          this.pendingFocus.set('toggle');
        this.responsiveMobile.set(query.matches);
      };
      update();
      query.addEventListener('change', update);
      onCleanup(() => query.removeEventListener('change', update));
    });
    afterRenderEffect((onCleanup) => {
      const view = this.document.defaultView;
      if (!view) return;
      const update = () =>
        this.inheritedDirection.set(
          view.getComputedStyle(this.host).direction === 'rtl' ? 'rtl' : 'ltr',
        );
      update();
      const observer = new MutationObserver(update);
      for (let node: HTMLElement | null = this.host; node; node = node.parentElement)
        observer.observe(node, { attributes: true, attributeFilter: ['dir'] });
      onCleanup(() => observer.disconnect());
    });
    let previousMobile = false;
    effect(() => {
      const mobile = this.mobile();
      if (mobile === previousMobile) return;
      const focused = this.navigation()?.nativeElement.contains(this.document.activeElement);
      if (!mobile && this.open()) {
        this.pendingFocus.set('navigation');
        this.open.set(false);
      }
      if (focused) this.pendingFocus.set(mobile ? 'toggle' : 'navigation');
      previousMobile = mobile;
    });
    afterRenderEffect(() => {
      const destination = this.pendingFocus();
      if (!destination) return;
      const navigation = this.navigation()?.nativeElement;
      if (destination === 'navigation' && navigation) {
        const active = navigation.querySelector<HTMLElement>('[aria-current="page"]');
        (active ?? aerisInternalFocusableElements(navigation)[0])?.focus();
      } else {
        const toggles = toggleElements.get(this);
        if (toggles)
          for (const toggle of toggles) {
            if (toggle.isConnected && toggle.getClientRects().length) {
              toggle.focus();
              break;
            }
          }
      }
      this.pendingFocus.set(null);
    });
  }

  toggle(): void {
    if (this.mobile()) this.open.update((open) => !open);
    else if (this.collapsible()) this.collapsed.update((collapsed) => !collapsed);
  }
}

@Directive({
  selector: 'button[aerisSidebarToggle]',
  host: {
    type: 'button',
    '[attr.aria-controls]': 'sidebar().navigationId',
    '[attr.aria-expanded]': 'sidebar().mobile() ? sidebar().open() : !sidebar().collapsed()',
    '[attr.aria-label]':
      'label() || (sidebar().mobile() ? (sidebar().open() ? sidebar().closeAriaLabel() : sidebar().expandAriaLabel()) : (sidebar().collapsed() ? sidebar().expandAriaLabel() : sidebar().collapseAriaLabel()))',
    '(click)': 'handleClick()',
  },
})
export class AerisSidebarToggle {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly sidebar = input.required<AerisSidebar>({ alias: 'aerisSidebarToggle' });
  readonly label = input('', { alias: 'aerisSidebarToggleLabel' });
  constructor() {
    const element = this.element;
    effect((onCleanup) => {
      const sidebar = this.sidebar();
      const toggles = toggleElements.get(sidebar) ?? new Set<HTMLElement>();
      toggles.add(element);
      toggleElements.set(sidebar, toggles);
      onCleanup(() => {
        toggles.delete(element);
      });
    });
  }
  protected handleClick(): void {
    const sidebar = this.sidebar();
    // Safari does not focus buttons on pointer activation; give Drawer a reliable return target.
    if (sidebar.mobile() && !sidebar.open()) this.element.focus({ preventScroll: true });
    sidebar.toggle();
  }
}

@Component({
  selector: 'a[aerisSidebarItem], button[aerisSidebarItem]',
  imports: [AerisTooltip],
  template: `
    <span
      class="aeris-sidebar__item-content"
      [aerisTooltip]="iconOnly() ? label() : ''"
      aerisTooltipEvent="hover"
      [aerisTooltipPosition]="tooltipPosition()"
    >
      <ng-content select="[aerisSidebarIcon]" />
      <span class="aeris-sidebar__label">{{ label() }}</span>
      <ng-content select="[aerisSidebarBadge]" />
    </span>
  `,
  host: {
    class: 'aeris-sidebar__item',
    '[attr.data-active]': 'active() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.aria-label]': 'iconOnly() ? label() : null',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.disabled]': 'isButton && disabled() ? "" : null',
    '[attr.type]': 'isButton ? "button" : null',
    '(click)': 'handleClick($event)',
    '(focusin)': 'showTooltip()',
    '(focusout)': 'hideTooltip()',
  },
})
export class AerisSidebarItem {
  protected readonly sidebar = inject(sidebarContext, { optional: true });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly tooltip = viewChild(AerisTooltip);
  protected readonly isButton = this.element.tagName === 'BUTTON';
  readonly label = input.required<string>();
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  protected readonly iconOnly = computed(() => this.sidebar?.iconOnly() ?? false);
  protected readonly tooltipPosition = computed(() =>
    (this.sidebar?.side() === 'end') !== (this.sidebar?.direction() === 'rtl') ? 'left' : 'right',
  );
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
    effect(() => {
      if (!this.iconOnly()) this.tooltip()?.hide();
    });
  }
  protected handleClick(event: Event): void {
    if (!(event instanceof MouseEvent)) return;
    if (
      this.disabled() ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      (this.element instanceof HTMLAnchorElement &&
        this.element.target &&
        this.element.target !== '_self')
    )
      return;
    if (this.sidebar?.mobile() && this.sidebar.closeOnNavigate()) this.sidebar.open.set(false);
  }
  protected showTooltip(): void {
    if (this.iconOnly()) this.tooltip()?.show();
  }
  protected hideTooltip(): void {
    this.tooltip()?.hide();
  }
}

@Component({
  selector: 'aeris-sidebar-group',
  imports: [ɵAerisIcon],
  template: `
    @if (!iconOnly()) {
      @if (collapsible()) {
        <button
          class="aeris-sidebar__group-toggle"
          type="button"
          [attr.aria-expanded]="expanded()"
          [attr.aria-controls]="contentId"
          (click)="expanded.update(toggleExpanded)"
        >
          <span class="aeris-sidebar__group-label">{{ label() }}</span>
          <span
            aerisInternalIcon="chevronRight"
            class="aeris-sidebar__group-chevron"
            [attr.data-expanded]="expanded() || null"
            aria-hidden="true"
          ></span>
        </button>
      } @else {
        <div class="aeris-sidebar__group-label aeris-sidebar__group-heading">{{ label() }}</div>
      }
    }
    <div
      class="aeris-sidebar__group-content"
      [id]="contentId"
      [hidden]="!iconOnly() && !expanded() && collapsible()"
    >
      <ng-content />
    </div>
  `,
  host: { class: 'aeris-sidebar__group', '[attr.data-icon-only]': 'iconOnly() || null' },
})
export class AerisSidebarGroup {
  private readonly sidebar = inject(sidebarContext, { optional: true });
  readonly label = input.required<string>();
  readonly expanded = model(true);
  readonly collapsible = input(true, { transform: booleanAttribute });
  protected readonly iconOnly = computed(() => this.sidebar?.iconOnly() ?? false);
  protected readonly contentId = `aeris-sidebar-group-${nextGroupId++}`;
  protected readonly toggleExpanded = (expanded: boolean) => !expanded;
}

export const AerisSidebarModule = [
  AerisSidebar,
  AerisSidebarItem,
  AerisSidebarGroup,
  AerisSidebarToggle,
  AerisSidebarHeader,
  AerisSidebarFooter,
  AerisSidebarIcon,
  AerisSidebarBadge,
] as const;
