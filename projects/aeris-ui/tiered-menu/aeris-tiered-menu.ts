import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
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

export type AerisTieredMenuSize = 'sm' | 'md' | 'lg';
export type AerisTieredMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';

export interface AerisTieredMenuItem<T = unknown> {
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
  readonly items?: readonly AerisTieredMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisTieredMenuItemEvent<T>) => void;
}

export interface AerisTieredMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisTieredMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

export interface AerisTieredMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisTieredMenuCloseReason;
  readonly target: Element | null;
}

export interface AerisTieredMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisTieredMenuItem<T>;
  readonly item: AerisTieredMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly active: boolean;
  readonly open: boolean;
  readonly disabled: boolean;
  readonly hasSubmenu: boolean;
}

export type AerisTieredMenuNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisTieredMenuEntry<T> {
  readonly item: AerisTieredMenuItem<T>;
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
  readonly children: readonly AerisTieredMenuEntry<T>[];
}

interface AerisTieredMenuCoordinates {
  readonly x: number;
  readonly y: number;
}

@Directive({ selector: 'ng-template[aerisTieredMenuItem]' })
export class AerisTieredMenuItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisTieredMenuItemTemplateContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisTieredMenuItemTemplate<T>,
    context: unknown,
  ): context is AerisTieredMenuItemTemplateContext<T> {
    return true;
  }
}

let nextTieredMenuId = 0;

@Component({
  selector: 'aeris-tiered-menu',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #defaultItemTemplate let-item let-hasSubmenu="hasSubmenu">
      @if (item.icon) {
        <span class="aeris-tiered-menu__icon" aria-hidden="true">{{ item.icon }}</span>
      }
      <span class="aeris-tiered-menu__label">{{ item.label }}</span>
      @if (item.badge !== undefined && item.badge !== null) {
        <span class="aeris-tiered-menu__badge">{{ item.badge }}</span>
      }
      @if (item.shortcut) {
        <kbd class="aeris-tiered-menu__shortcut">{{ item.shortcut }}</kbd>
      }
      @if (hasSubmenu) {
        <svg class="aeris-tiered-menu__submenu-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m7.5 4.5 5 5.5-5 5.5" />
        </svg>
      }
    </ng-template>

    <ng-template #menuList let-entries let-level="level">
      <ul
        class="aeris-tiered-menu__list"
        [attr.role]="level === 0 ? 'menubar' : 'menu'"
        [attr.aria-orientation]="level === 0 ? 'vertical' : null"
        [attr.aria-label]="level === 0 ? ariaLabel() || null : null"
        [attr.aria-labelledby]="level === 0 ? ariaLabelledBy() || null : null"
        [attr.data-level]="level"
      >
        @for (entry of entries; track entry.id) {
          @if (entry.separator) {
            <li class="aeris-tiered-menu__separator" role="separator"></li>
          } @else {
            <li
              class="aeris-tiered-menu__item-shell"
              role="none"
              [attr.data-open]="entry.open || null"
              [attr.data-active]="entry.active || null"
              [attr.data-disabled]="entry.disabled || null"
            >
              @if (entry.href) {
                <a
                  #menuItem
                  class="aeris-tiered-menu__item"
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
                  [attr.data-aeris-tiered-menu-path]="entry.pathKey"
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
                  class="aeris-tiered-menu__item"
                  role="menuitem"
                  [id]="entry.id"
                  [disabled]="entry.disabled"
                  [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                  [attr.aria-haspopup]="entry.children.length ? 'menu' : null"
                  [attr.aria-expanded]="entry.children.length ? entry.open : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-submenu' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-tiered-menu-path]="entry.pathKey"
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
                  class="aeris-tiered-menu__submenu"
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

    @if (panelVisible()) {
      <div
        #panel
        class="aeris-tiered-menu__panel"
        [id]="id()"
        [class]="panelStyleClass()"
        [attr.data-popup]="popup() || null"
        [attr.data-positioned]="!popup() || positioned() ? true : null"
        [attr.data-size]="size()"
        [style.left.px]="popup() ? coordinates().x : null"
        [style.top.px]="popup() ? coordinates().y : null"
        [style.--aeris-tiered-menu-width]="width() || null"
        [style.--aeris-tiered-menu-max-width]="maxWidth() || null"
        (contextmenu)="suppressNativeMenu($event)"
      >
        <ng-container
          [ngTemplateOutlet]="menuList"
          [ngTemplateOutletContext]="{ $implicit: entries(), level: 0 }"
        />
      </div>
    }
  `,
  styleUrl: './aeris-tiered-menu.scss',
  host: {
    class: 'aeris-tiered-menu',
    '[attr.data-popup]': 'popup() || null',
    '[attr.data-open]': 'panelVisible() || null',
  },
})
export class AerisTieredMenu<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly generatedId = `aeris-tiered-menu-${++nextTieredMenuId}`;
  private readonly activeTarget = signal<Element | null>(null);
  private readonly anchorPoint = signal<AerisTieredMenuCoordinates>({ x: 0, y: 0 });
  private scrollCleanup: (() => void) | null = null;

  protected readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  protected readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  protected readonly itemTemplate = contentChild(AerisTieredMenuItemTemplate<T>, {
    descendants: false,
  });
  protected readonly activePathKey = signal('');
  protected readonly openPathKey = signal('');
  protected readonly coordinates = signal<AerisTieredMenuCoordinates>({ x: 0, y: 0 });
  protected readonly positioned = signal(false);
  protected readonly submenuSide = signal<'start' | 'end'>('end');
  protected readonly panelVisible = computed(() => !this.popup() || this.open());
  protected readonly entries = computed(() =>
    this.buildEntries(this.model(), [], 0, this.activePathKey(), this.openPathKey()),
  );

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisTieredMenuItem<T>[]>([]);
  readonly open = model(false);
  readonly popup = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<AerisTieredMenuSize>('md');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly viewportMargin = input(8);
  readonly hideOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Tiered menu');
  readonly ariaLabelledBy = input('');
  readonly panelStyleClass = input('');
  readonly navigationHandler = input<AerisTieredMenuNavigationHandler>();

  readonly shown = output<AerisTieredMenuVisibilityEvent>();
  readonly hidden = output<AerisTieredMenuVisibilityEvent>();
  readonly visibilityChanged = output<AerisTieredMenuVisibilityEvent>();
  readonly itemSelected = output<AerisTieredMenuItemEvent<T>>();

  constructor() {
    this.destroyRef.onDestroy(() => this.stopScrollTracking());
    effect((onCleanup) => {
      if (!this.popup() || !this.open()) return;
      const document = this.host.nativeElement.ownerDocument;
      const view = document.defaultView;
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const keydown = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
      const reposition = this.repositionFrame.schedule;
      document.addEventListener('pointerdown', pointerdown);
      document.addEventListener('keydown', keydown);
      view?.addEventListener('resize', reposition);
      onCleanup(() => {
        document.removeEventListener('pointerdown', pointerdown);
        document.removeEventListener('keydown', keydown);
        view?.removeEventListener('resize', reposition);
        this.repositionFrame.cancel();
      });
    });
  }

  show(event: MouseEvent | PointerEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.activeTarget.set(
      event.currentTarget instanceof Element ? event.currentTarget : this.host.nativeElement,
    );
    this.openAtTarget(event.currentTarget, event);
  }

  hide(
    originalEvent: Event | null = null,
    reason: AerisTieredMenuCloseReason = 'api',
    restoreFocus = this.restoreFocus(),
  ): void {
    this.openPathKey.set('');
    if (!this.popup() || !this.open()) return;
    this.stopScrollTracking();
    this.open.set(false);
    this.positioned.set(false);
    const event = this.visibilityEvent(false, reason, originalEvent);
    const target = this.activeTarget();
    this.hidden.emit(event);
    this.visibilityChanged.emit(event);
    this.activeTarget.set(null);
    if (restoreFocus && target instanceof HTMLElement) queueMicrotask(() => target.focus());
  }

  toggle(event: MouseEvent | PointerEvent): void {
    if (this.open()) this.hide(event);
    else this.show(event);
  }

  focus(): void {
    this.openInitialItem();
    this.focusActiveItem();
  }

  reposition(): void {
    if (!this.popup() || !this.open()) return;
    const panel = this.panel()?.nativeElement;
    const view = panel?.ownerDocument.defaultView;
    if (!panel || !view) return;

    const rect = panel.getBoundingClientRect();
    const width = rect.width || panel.offsetWidth || 240;
    const height = rect.height || panel.offsetHeight || 260;
    const anchor = this.currentAnchorPoint();
    const { x, y } = aerisInternalClampOverlayPoint(
      anchor,
      width,
      height,
      view.innerWidth,
      view.innerHeight,
      this.viewportMargin(),
    );
    this.anchorPoint.set(anchor);
    this.coordinates.set({ x, y });
    this.submenuSide.set(anchor.x > view.innerWidth / 2 ? 'start' : 'end');
    this.positioned.set(true);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.setAttribute('data-positioned', 'true');
  }

  protected suppressNativeMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  protected setActivePath(path: readonly number[]): void {
    this.activePathKey.set(this.pathKey(path));
  }

  protected handleEntryPointerEnter(entry: AerisTieredMenuEntry<T>): void {
    if (entry.disabled || entry.separator) return;
    this.activePathKey.set(entry.pathKey);
    this.openPathKey.set(entry.children.length ? entry.pathKey : entry.parentPathKey);
  }

  protected activateEntry(event: MouseEvent | KeyboardEvent, entry: AerisTieredMenuEntry<T>): void {
    if (this.disabled() || entry.disabled || entry.separator) {
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
    if (this.closeOnSelect()) this.hide(event, 'select');
  }

  protected handleItemKeydown(event: KeyboardEvent, entry: AerisTieredMenuEntry<T>): void {
    const openKey = this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = this.isRtl() ? 'ArrowRight' : 'ArrowLeft';

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
      case openKey:
        event.preventDefault();
        if (entry.children.length) {
          this.openPathKey.set(entry.pathKey);
          this.focusFirstChild(entry);
        }
        break;
      case closeKey:
        event.preventDefault();
        this.closeSubmenu(entry);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateEntry(event, entry);
        break;
      case 'Escape':
        if (!this.closeOnEscape()) return;
        event.preventDefault();
        if (entry.parentPathKey) {
          this.closeSubmenu(entry);
        } else {
          this.hide(event, 'escape');
        }
        break;
      case 'Tab':
        this.hide(event, 'outside', false);
        break;
    }
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.panelVisible() || !this.hideOnOutsideClick()) return;
    const target = event.target;
    if (target instanceof Node && this.host.nativeElement.contains(target)) return;
    this.hide(event, 'outside', false);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.closeOnEscape()) return;
    if (!this.openPathKey() && (!this.popup() || !this.open())) return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected itemContext(entry: AerisTieredMenuEntry<T>): AerisTieredMenuItemTemplateContext<T> {
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

  private openAtTarget(target: EventTarget | null, originalEvent: Event): void {
    const element = target instanceof Element ? target : this.host.nativeElement;
    const rect = element.getBoundingClientRect();
    const y = rect.bottom + 6;
    this.anchorPoint.set({ x: rect.left, y });
    this.coordinates.set({ x: rect.left, y });
    this.positioned.set(false);
    this.open.set(true);
    this.startScrollTracking();
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

  private currentAnchorPoint(): AerisTieredMenuCoordinates {
    const target = this.activeTarget();
    if (!target) return this.anchorPoint();

    const rect = target.getBoundingClientRect();
    return { x: rect.left, y: rect.bottom + 6 };
  }

  private startScrollTracking(): void {
    if (this.scrollCleanup) return;
    const document = this.host.nativeElement.ownerDocument;
    const handleScroll = this.repositionFrame.schedule;
    document.addEventListener('scroll', handleScroll, true);
    this.scrollCleanup = (): void => {
      document.removeEventListener('scroll', handleScroll, true);
      this.repositionFrame.cancel();
      this.scrollCleanup = null;
    };
  }

  private stopScrollTracking(): void {
    this.scrollCleanup?.();
  }

  private buildEntries(
    items: readonly AerisTieredMenuItem<T>[],
    parentPath: readonly number[],
    level: number,
    activePathKey: string,
    openPathKey: string,
  ): readonly AerisTieredMenuEntry<T>[] {
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.visible !== false)
      .map(({ item, index }) => {
        const path = [...parentPath, index];
        const key = this.pathKey(path);
        const children = this.buildEntries(
          item.items ?? [],
          path,
          level + 1,
          activePathKey,
          openPathKey,
        );
        return {
          item,
          id: item.id ?? `${this.id()}-item-${key.replace(/\./g, '-')}`,
          path,
          pathKey: key,
          parentPathKey: this.pathKey(parentPath),
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

  private openInitialItem(): void {
    this.activePathKey.set(this.firstEnabledEntry(this.entries())?.pathKey ?? '');
  }

  private focusSibling(entry: AerisTieredMenuEntry<T>, step: 1 | -1): void {
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

  private focusEdge(entry: AerisTieredMenuEntry<T>, edge: 'first' | 'last'): void {
    const siblings = this.enabledEntriesForParent(entry.parentPathKey);
    this.focusEntry(edge === 'first' ? siblings[0] : siblings.at(-1));
  }

  private focusFirstChild(entry: AerisTieredMenuEntry<T>): void {
    afterNextRender(() => this.focusEntry(this.firstEnabledEntry(entry.children)), {
      injector: this.injector,
    });
  }

  private closeSubmenu(entry: AerisTieredMenuEntry<T>): void {
    if (!entry.parentPathKey) return;
    const parent = this.findEntry(entry.parentPathKey);
    this.openPathKey.set(parent?.parentPathKey ?? '');
    this.focusEntry(parent);
  }

  private focusActiveItem(): void {
    this.focusEntry(this.findEntry(this.activePathKey()) ?? this.firstEnabledEntry(this.entries()));
  }

  private focusEntry(entry: AerisTieredMenuEntry<T> | undefined): void {
    if (!entry) return;
    this.activePathKey.set(entry.pathKey);
    queueMicrotask(() => {
      this.menuItems()
        .find(
          ({ nativeElement }) =>
            nativeElement.getAttribute('data-aeris-tiered-menu-path') === entry.pathKey,
        )
        ?.nativeElement.focus();
    });
  }

  private enabledEntriesForParent(parentPathKey: string): readonly AerisTieredMenuEntry<T>[] {
    return this.flattenEntries(this.entries()).filter(
      (entry) => entry.parentPathKey === parentPathKey && !entry.separator && !entry.disabled,
    );
  }

  private firstEnabledEntry(
    entries: readonly AerisTieredMenuEntry<T>[],
  ): AerisTieredMenuEntry<T> | undefined {
    return entries.find((entry) => !entry.separator && !entry.disabled);
  }

  private findEntry(pathKey: string): AerisTieredMenuEntry<T> | undefined {
    return this.flattenEntries(this.entries()).find((entry) => entry.pathKey === pathKey);
  }

  private flattenEntries(
    entries: readonly AerisTieredMenuEntry<T>[],
  ): readonly AerisTieredMenuEntry<T>[] {
    return entries.flatMap((entry) => [entry, ...this.flattenEntries(entry.children)]);
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisTieredMenuCloseReason,
    originalEvent: Event | null,
  ): AerisTieredMenuVisibilityEvent {
    return {
      originalEvent,
      visible,
      reason,
      target: this.activeTarget(),
    };
  }

  private resolveHref(item: AerisTieredMenuItem<T>): string | null {
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

  private isRtl(): boolean {
    return this.host.nativeElement.ownerDocument.documentElement.dir === 'rtl';
  }

}

export const AerisTieredMenuModule = [AerisTieredMenu, AerisTieredMenuItemTemplate] as const;
