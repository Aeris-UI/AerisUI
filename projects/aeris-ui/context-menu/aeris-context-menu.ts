import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  Injector,
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
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  aerisInternalClampOverlayPoint,
  aerisInternalCreateFrameScheduler,
} from '@aeris-ui/core';

export type AerisContextMenuSize = 'sm' | 'md' | 'lg';
export type AerisContextMenuCloseReason =
  'api' | 'escape' | 'outside' | 'scroll' | 'select' | 'target';
export type AerisContextMenuTarget = Element | EventTarget | null | undefined;

export interface AerisContextMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly badge?: string | number;
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly items?: readonly AerisContextMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisContextMenuItemEvent<T>) => void;
}

export interface AerisContextMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisContextMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

export interface AerisContextMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisContextMenuCloseReason;
  readonly target: Element | null;
}

export interface AerisContextMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisContextMenuItem<T>;
  readonly item: AerisContextMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly active: boolean;
  readonly open: boolean;
  readonly disabled: boolean;
  readonly hasSubmenu: boolean;
}

export type AerisContextMenuNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisContextMenuEntry<T> {
  readonly item: AerisContextMenuItem<T>;
  readonly index: number;
  readonly id: string;
  readonly path: readonly number[];
  readonly pathKey: string;
  readonly parentPathKey: string;
  readonly level: number;
  readonly href: string | null;
  readonly separator: boolean;
  readonly disabled: boolean;
  readonly active: boolean;
  readonly open: boolean;
  readonly children: readonly AerisContextMenuEntry<T>[];
}

interface AerisContextMenuCoordinates {
  readonly x: number;
  readonly y: number;
}

@Directive({ selector: 'ng-template[aerisContextMenuItem]' })
export class AerisContextMenuItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisContextMenuItemTemplateContext<T>>>(TemplateRef);
}

let nextContextMenuId = 0;

@Component({
  selector: 'aeris-context-menu',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #menuList let-entries let-level="level">
      <ul
        class="aeris-context-menu__list"
        [attr.role]="level === 0 ? rootRole() : 'menu'"
        [attr.aria-label]="level === 0 ? ariaLabel() || null : null"
        [attr.aria-labelledby]="level === 0 ? ariaLabelledBy() || null : null"
        [attr.aria-orientation]="level === 0 ? 'vertical' : null"
        [attr.data-level]="level"
      >
        @for (entry of entries; track entry.id) {
          @if (entry.separator) {
            <li class="aeris-context-menu__separator" role="separator"></li>
          } @else {
            <li
              class="aeris-context-menu__item-shell"
              role="none"
              [attr.data-open]="entry.open || null"
              [attr.data-active]="entry.active || null"
              [attr.data-disabled]="entry.disabled || null"
            >
              @if (entry.href) {
                <a
                  #menuItem
                  class="aeris-context-menu__item"
                  role="menuitem"
                  [id]="entry.id"
                  [attr.href]="entry.disabled ? null : entry.href"
                  [attr.target]="entry.item.target || null"
                  [attr.rel]="
                    entry.item.rel ||
                    (entry.item.target === '_blank' ? 'noopener noreferrer' : null)
                  "
                  [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                  [attr.aria-disabled]="entry.disabled || null"
                  [attr.aria-haspopup]="entry.children.length ? 'menu' : null"
                  [attr.aria-expanded]="entry.children.length ? entry.open : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-submenu' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-context-menu-path]="entry.pathKey"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActivePath(entry.path)"
                  (mouseenter)="handleEntryPointerEnter(entry)"
                  (keydown)="handleItemKeydown($event, entry)"
                >
                  <ng-container
                    [ngTemplateOutlet]="itemTemplate()?.template ?? defaultItemTemplate"
                    [ngTemplateOutletContext]="itemContext(entry)"
                  />
                </a>
              } @else {
                <button
                  #menuItem
                  type="button"
                  class="aeris-context-menu__item"
                  role="menuitem"
                  [id]="entry.id"
                  [disabled]="entry.disabled"
                  [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                  [attr.aria-haspopup]="entry.children.length ? 'menu' : null"
                  [attr.aria-expanded]="entry.children.length ? entry.open : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-submenu' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-context-menu-path]="entry.pathKey"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActivePath(entry.path)"
                  (mouseenter)="handleEntryPointerEnter(entry)"
                  (keydown)="handleItemKeydown($event, entry)"
                >
                  <ng-container
                    [ngTemplateOutlet]="itemTemplate()?.template ?? defaultItemTemplate"
                    [ngTemplateOutletContext]="itemContext(entry)"
                  />
                </button>
              }

              @if (entry.children.length && entry.open) {
                <div
                  class="aeris-context-menu__submenu"
                  [id]="entry.id + '-submenu'"
                  [attr.data-side]="submenuSide()"
                >
                  <ng-container
                    [ngTemplateOutlet]="menuList"
                    [ngTemplateOutletContext]="{
                      $implicit: entry.children,
                      level: entry.level + 1,
                    }"
                  />
                </div>
              }
            </li>
          }
        }
      </ul>
    </ng-template>

    <ng-template #defaultItemTemplate let-item let-hasSubmenu="hasSubmenu">
      @if (item.icon) {
        <span class="aeris-context-menu__icon" aria-hidden="true">{{ item.icon }}</span>
      }
      <span class="aeris-context-menu__label">{{ item.label }}</span>
      @if (item.badge !== undefined && item.badge !== null) {
        <span class="aeris-context-menu__badge">{{ item.badge }}</span>
      }
      @if (item.shortcut) {
        <kbd class="aeris-context-menu__shortcut">{{ item.shortcut }}</kbd>
      }
      @if (hasSubmenu) {
        <svg class="aeris-context-menu__submenu-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m7.5 4.5 5 5.5-5 5.5" />
        </svg>
      }
    </ng-template>

    @if (open()) {
      <div class="aeris-context-menu__layer" (contextmenu)="suppressNativeMenu($event)">
        <div
          #panel
          class="aeris-context-menu__panel"
          [id]="menuId()"
          [class]="panelStyleClass()"
          [attr.data-positioned]="positioned() || null"
          [attr.data-size]="size()"
          [style.left.px]="coordinates().x"
          [style.top.px]="coordinates().y"
          [style.--aeris-context-menu-width]="width() || null"
          [style.--aeris-context-menu-max-width]="maxWidth() || null"
        >
          <ng-container
            [ngTemplateOutlet]="menuList"
            [ngTemplateOutletContext]="{ $implicit: entries(), level: 0 }"
          />
        </div>
      </div>
    }
  `,
  styleUrl: './aeris-context-menu.scss',
  host: {
    class: 'aeris-context-menu',
    '[attr.data-open]': 'open() || null',
    '(document:contextmenu)': 'handleDocumentContextMenu($event)',
  },
})
export class AerisContextMenu<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly injector = inject(Injector);
  private readonly generatedId = `aeris-context-menu-${++nextContextMenuId}`;
  private readonly activeTarget = signal<Element | null>(null);
  private readonly anchorPoint = signal<AerisContextMenuCoordinates>({ x: 0, y: 0 });
  private pendingOriginalEvent: Event | null = null;
  private pendingCloseReason: AerisContextMenuCloseReason = 'api';

  protected readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  protected readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  protected readonly itemTemplate = contentChild(AerisContextMenuItemTemplate<T>, {
    descendants: false,
  });
  protected readonly activePathKey = signal('');
  protected readonly openPathKey = signal('');
  protected readonly coordinates = signal<AerisContextMenuCoordinates>({ x: 0, y: 0 });
  protected readonly positioned = signal(false);
  protected readonly submenuSide = signal<'start' | 'end'>('end');
  protected readonly entries = computed(() =>
    this.buildEntries(this.model(), [], 0, this.activePathKey(), this.openPathKey()),
  );
  protected readonly rootRole = computed(() => (this.useMenubarRole() ? 'menubar' : 'menu'));

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisContextMenuItem<T>[]>([]);
  readonly open = model(false);
  readonly target = input<AerisContextMenuTarget>(null);
  readonly global = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<AerisContextMenuSize>('md');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly viewportMargin = input(8);
  readonly hideOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly hideOnScroll = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly useMenubarRole = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Context menu');
  readonly ariaLabelledBy = input('');
  readonly panelStyleClass = input('');
  readonly navigationHandler = input<AerisContextMenuNavigationHandler>();

  readonly shown = output<AerisContextMenuVisibilityEvent>();
  readonly hidden = output<AerisContextMenuVisibilityEvent>();
  readonly visibilityChanged = output<AerisContextMenuVisibilityEvent>();
  readonly itemSelected = output<AerisContextMenuItemEvent<T>>();

  protected readonly menuId = computed(() => this.id());

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) return;
      const document = this.host.nativeElement.ownerDocument;
      const view = document.defaultView;
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const keydown = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
      const resize = this.repositionFrame.schedule;
      const scroll = (event: Event) => this.handleWindowScroll(event);
      document.addEventListener('pointerdown', pointerdown);
      document.addEventListener('keydown', keydown);
      view?.addEventListener('resize', resize);
      view?.addEventListener('scroll', scroll);
      onCleanup(() => {
        document.removeEventListener('pointerdown', pointerdown);
        document.removeEventListener('keydown', keydown);
        view?.removeEventListener('resize', resize);
        view?.removeEventListener('scroll', scroll);
        this.repositionFrame.cancel();
      });
    });
  }

  show(event: MouseEvent | PointerEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.openAt(event.clientX, event.clientY, event);
  }

  openAt(x: number, y: number, originalEvent: Event | null = null): void {
    if (this.disabled()) return;
    this.pendingOriginalEvent = originalEvent;
    this.pendingCloseReason = 'api';
    this.anchorPoint.set({ x, y });
    this.coordinates.set({ x, y });
    this.positioned.set(false);
    this.activeTarget.set(this.resolveEventTarget(originalEvent));
    this.open.set(true);
    this.openInitialItem();
    const event = this.visibilityEvent(true, 'api', originalEvent);
    this.shown.emit(event);
    this.visibilityChanged.emit(event);
    afterNextRender(
      () => {
        this.reposition();
        if (this.autoFocus()) this.focusActiveItem();
      },
      { injector: this.injector },
    );
  }

  hide(
    originalEvent: Event | null = null,
    reason: AerisContextMenuCloseReason = 'api',
    restoreFocus = this.restoreFocus(),
  ): void {
    if (!this.open()) return;
    this.pendingOriginalEvent = originalEvent;
    this.pendingCloseReason = reason;
    this.open.set(false);
    this.positioned.set(false);
    this.activePathKey.set('');
    this.openPathKey.set('');
    const event = this.visibilityEvent(false, reason, originalEvent);
    const target = this.activeTarget();
    this.hidden.emit(event);
    this.visibilityChanged.emit(event);
    this.activeTarget.set(null);
    if (restoreFocus && target instanceof HTMLElement) {
      queueMicrotask(() => target.focus());
    }
  }

  toggle(event: MouseEvent | PointerEvent): void {
    if (this.open()) {
      this.hide(event);
    } else {
      this.show(event);
    }
  }

  focus(): void {
    this.focusActiveItem();
  }

  reposition(): void {
    if (!this.open()) return;
    const panel = this.panel()?.nativeElement;
    const view = panel?.ownerDocument.defaultView;
    if (!panel || !view) return;

    const rect = panel.getBoundingClientRect();
    const width = rect.width || panel.offsetWidth || 240;
    const height = rect.height || panel.offsetHeight || 260;
    const anchor = this.anchorPoint();
    const { x, y } = aerisInternalClampOverlayPoint(
      anchor,
      width,
      height,
      view.innerWidth,
      view.innerHeight,
      this.viewportMargin(),
    );

    this.coordinates.set({ x, y });
    this.submenuSide.set(anchor.x > view.innerWidth / 2 ? 'start' : 'end');
    this.positioned.set(true);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.setAttribute('data-positioned', 'true');
  }

  protected handleDocumentContextMenu(event: MouseEvent): void {
    if (this.disabled()) return;
    if (this.global()) {
      this.show(event);
      return;
    }

    const target = this.resolveTarget(this.target());
    const eventTarget = event.target;
    if (target && eventTarget instanceof Node && target.contains(eventTarget)) {
      this.show(event);
    }
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.open() || !this.hideOnOutsideClick()) return;
    const target = event.target;
    const panel = this.panel()?.nativeElement;
    if (target instanceof Node && panel?.contains(target)) return;
    this.hide(event, 'outside', false);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open() || event.key !== 'Escape' || !this.closeOnEscape()) return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected handleWindowScroll(event: Event): void {
    if (!this.open()) return;
    if (this.hideOnScroll()) {
      this.hide(event, 'scroll', false);
    } else {
      this.repositionFrame.schedule();
    }
  }

  protected suppressNativeMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  protected setActivePath(path: readonly number[]): void {
    this.activePathKey.set(this.pathKey(path));
  }

  protected handleEntryPointerEnter(entry: AerisContextMenuEntry<T>): void {
    if (entry.disabled || entry.separator) return;
    this.activePathKey.set(entry.pathKey);
    this.openPathKey.set(entry.children.length ? entry.pathKey : entry.parentPathKey);
  }

  protected activateEntry(
    event: MouseEvent | KeyboardEvent,
    entry: AerisContextMenuEntry<T>,
  ): void {
    if (entry.disabled || entry.separator) {
      event.preventDefault();
      return;
    }

    if (entry.children.length) {
      event.preventDefault();
      this.openPathKey.set(entry.open ? entry.parentPathKey : entry.pathKey);
      this.activePathKey.set(entry.pathKey);
      if (!entry.open) this.focusFirstChild(entry);
      return;
    }

    const itemEvent = {
      originalEvent: event,
      item: entry.item,
      path: entry.path,
      target: this.activeTarget(),
    };
    entry.item.command?.(itemEvent);
    this.itemSelected.emit(itemEvent);
    if (entry.item.routerLink && this.navigationHandler()) {
      event.preventDefault();
      this.navigationHandler()?.(entry.item.routerLink, event);
    }
    this.hide(event, 'select');
  }

  protected handleItemKeydown(event: KeyboardEvent, entry: AerisContextMenuEntry<T>): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusSibling(entry, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusSibling(entry, -1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusEdge(entry, 'first');
        break;
      case 'End':
        event.preventDefault();
        this.focusEdge(entry, 'last');
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (entry.children.length) {
          this.openPathKey.set(entry.pathKey);
          this.focusFirstChild(entry);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.closeSubmenu(entry);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateEntry(event, entry);
        break;
      case 'Tab':
        this.hide(event, 'outside', false);
        break;
    }
  }

  protected itemContext(entry: AerisContextMenuEntry<T>): AerisContextMenuItemTemplateContext<T> {
    return {
      $implicit: entry.item,
      item: entry.item,
      path: entry.path,
      level: entry.level,
      active: entry.active,
      open: entry.open,
      disabled: entry.disabled,
      hasSubmenu: entry.children.length > 0,
    };
  }

  private openInitialItem(): void {
    const first = this.firstEnabledEntry(this.entries());
    this.activePathKey.set(first?.pathKey ?? '');
    this.openPathKey.set('');
  }

  private buildEntries(
    items: readonly AerisContextMenuItem<T>[],
    parentPath: readonly number[],
    level: number,
    activePathKey: string,
    openPathKey: string,
  ): readonly AerisContextMenuEntry<T>[] {
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.visible !== false)
      .map(({ item, index }) => {
        const path = [...parentPath, index];
        const key = this.pathKey(path);
        const parentKey = this.pathKey(parentPath);
        const children = this.buildEntries(
          item.items ?? [],
          path,
          level + 1,
          activePathKey,
          openPathKey,
        );
        return {
          item,
          index,
          id: item.id ?? `${this.id()}-item-${key || index}`,
          path,
          pathKey: key,
          parentPathKey: parentKey,
          level,
          href: this.resolveHref(item),
          separator: !!item.separator,
          disabled: !!item.disabled,
          active: activePathKey === key,
          open: openPathKey === key || openPathKey.startsWith(`${key}.`),
          children,
        };
      });
  }

  private focusSibling(entry: AerisContextMenuEntry<T>, step: 1 | -1): void {
    const siblings = this.enabledEntriesForParent(entry.parentPathKey);
    if (!siblings.length) return;
    const current = siblings.findIndex((item) => item.pathKey === entry.pathKey);
    const next =
      current < 0
        ? step === 1
          ? 0
          : siblings.length - 1
        : (current + step + siblings.length) % siblings.length;
    this.focusEntry(siblings[next]);
  }

  private focusEdge(entry: AerisContextMenuEntry<T>, edge: 'first' | 'last'): void {
    const siblings = this.enabledEntriesForParent(entry.parentPathKey);
    this.focusEntry(edge === 'first' ? siblings[0] : siblings.at(-1));
  }

  private focusFirstChild(entry: AerisContextMenuEntry<T>): void {
    this.focusEntry(this.firstEnabledEntry(entry.children));
  }

  private closeSubmenu(entry: AerisContextMenuEntry<T>): void {
    if (!entry.parentPathKey) return;
    const parent = this.findEntry(entry.parentPathKey);
    this.openPathKey.set(parent?.parentPathKey ?? '');
    this.focusEntry(parent);
  }

  private focusEntry(entry: AerisContextMenuEntry<T> | undefined): void {
    if (!entry) return;
    this.activePathKey.set(entry.pathKey);
    queueMicrotask(() => {
      this.menuItems()
        .find(
          ({ nativeElement }) =>
            nativeElement.getAttribute('data-aeris-context-menu-path') === entry.pathKey,
        )
        ?.nativeElement.focus();
    });
  }

  private focusActiveItem(): void {
    const active = this.findEntry(this.activePathKey()) ?? this.firstEnabledEntry(this.entries());
    this.focusEntry(active);
  }

  private enabledEntriesForParent(parentPathKey: string): readonly AerisContextMenuEntry<T>[] {
    return this.flattenEntries(this.entries()).filter(
      (entry) => entry.parentPathKey === parentPathKey && !entry.separator && !entry.disabled,
    );
  }

  private firstEnabledEntry(
    entries: readonly AerisContextMenuEntry<T>[],
  ): AerisContextMenuEntry<T> | undefined {
    return entries.find((entry) => !entry.separator && !entry.disabled);
  }

  private findEntry(pathKey: string): AerisContextMenuEntry<T> | undefined {
    return this.flattenEntries(this.entries()).find((entry) => entry.pathKey === pathKey);
  }

  private flattenEntries(
    entries: readonly AerisContextMenuEntry<T>[],
  ): readonly AerisContextMenuEntry<T>[] {
    return entries.flatMap((entry) => [entry, ...this.flattenEntries(entry.children)]);
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisContextMenuCloseReason,
    originalEvent: Event | null,
  ): AerisContextMenuVisibilityEvent {
    return {
      originalEvent,
      visible,
      reason,
      target: this.activeTarget(),
    };
  }

  private resolveTarget(target: AerisContextMenuTarget): Element | null {
    return target instanceof Element ? target : null;
  }

  private resolveEventTarget(event: Event | null): Element | null {
    const target = event?.target;
    if (target instanceof Element) return target;
    return this.resolveTarget(this.target()) ?? this.host.nativeElement;
  }

  private resolveHref(item: AerisContextMenuItem<T>): string | null {
    if (item.url) return item.url;
    if (!item.routerLink) return null;
    if (typeof item.routerLink === 'string') return item.routerLink;
    return `/${item.routerLink
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/')}`;
  }

  private pathKey(path: readonly number[]): string {
    return path.join('.');
  }

}

export const AerisContextMenuModule = [AerisContextMenu, AerisContextMenuItemTemplate] as const;
