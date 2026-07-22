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

export type AerisMenuSize = 'sm' | 'md' | 'lg';
export type AerisMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';
export type AerisMenuExpandedKeys = Readonly<Record<string, boolean>>;

export interface AerisMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
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
  readonly toggleable?: boolean;
  readonly expanded?: boolean;
  readonly items?: readonly AerisMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMenuItemEvent<T>) => void;
}

export interface AerisMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

export interface AerisMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisMenuCloseReason;
  readonly target: Element | null;
}

export interface AerisMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisMenuItem<T>;
  readonly item: AerisMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly active: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly hasChildren: boolean;
}

export interface AerisMenuHeaderTemplateContext<T = unknown> {
  readonly $implicit: AerisMenuItem<T>;
  readonly item: AerisMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly expanded: boolean;
  readonly toggleable: boolean;
}

export type AerisMenuNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisMenuEntry<T> {
  readonly item: AerisMenuItem<T>;
  readonly index: number;
  readonly id: string;
  readonly path: readonly number[];
  readonly key: string;
  readonly parentKey: string;
  readonly level: number;
  readonly href: string | null;
  readonly separator: boolean;
  readonly disabled: boolean;
  readonly active: boolean;
  readonly expanded: boolean;
  readonly toggleable: boolean;
  readonly children: readonly AerisMenuEntry<T>[];
}

interface AerisMenuCoordinates {
  readonly x: number;
  readonly y: number;
}

@Directive({ selector: 'ng-template[aerisMenuItem]' })
export class AerisMenuItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisMenuItemTemplateContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisMenuItemTemplate<T>,
    context: unknown,
  ): context is AerisMenuItemTemplateContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisMenuHeader]' })
export class AerisMenuHeaderTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisMenuHeaderTemplateContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisMenuHeaderTemplate<T>,
    context: unknown,
  ): context is AerisMenuHeaderTemplateContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisMenuStart]' })
export class AerisMenuStartTemplate {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMenuEnd]' })
export class AerisMenuEndTemplate {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

let nextMenuId = 0;

@Component({
  selector: 'aeris-menu',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #defaultItemTemplate let-item let-hasChildren="hasChildren">
      @if (item.icon) {
        <span class="aeris-menu__icon" aria-hidden="true">{{ item.icon }}</span>
      }
      <span class="aeris-menu__copy">
        <span class="aeris-menu__label">{{ item.label }}</span>
        @if (item.description) {
          <span class="aeris-menu__description">{{ item.description }}</span>
        }
      </span>
      @if (item.badge !== undefined && item.badge !== null) {
        <span class="aeris-menu__badge">{{ item.badge }}</span>
      }
      @if (item.shortcut) {
        <kbd class="aeris-menu__shortcut">{{ item.shortcut }}</kbd>
      }
      @if (hasChildren) {
        <svg class="aeris-menu__chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m6 8 4 4 4-4" />
        </svg>
      }
    </ng-template>

    <ng-template #defaultHeaderTemplate let-item>
      <span class="aeris-menu__header-label">{{ item.label }}</span>
    </ng-template>

    <ng-template #menuList let-entries let-level="level">
      <ul
        class="aeris-menu__list"
        [attr.role]="level === 0 ? 'menu' : 'group'"
        [attr.aria-label]="level === 0 ? ariaLabel() || null : null"
        [attr.aria-labelledby]="level === 0 ? ariaLabelledBy() || null : null"
        [attr.data-level]="level"
      >
        @for (entry of entries; track entry.id) {
          @if (entry.separator) {
            <li class="aeris-menu__separator" role="separator"></li>
          } @else {
            <li
              class="aeris-menu__item-shell"
              role="none"
              [attr.data-active]="entry.active || null"
              [attr.data-expanded]="entry.expanded || null"
              [attr.data-disabled]="entry.disabled || null"
            >
              @if (entry.children.length && !entry.toggleable) {
                <div
                  class="aeris-menu__header"
                  [id]="entry.id"
                  [attr.data-custom-template]="headerTemplate() ? true : null"
                >
                  <ng-container
                    [ngTemplateOutlet]="headerTemplate()?.template ?? defaultHeaderTemplate"
                    [ngTemplateOutletContext]="headerContext(entry)"
                  />
                </div>
              } @else if (entry.href) {
                <a
                  #menuItem
                  class="aeris-menu__item"
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
                  [attr.aria-expanded]="entry.children.length ? entry.expanded : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-group' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-menu-key]="entry.key"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActiveKey(entry.key)"
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
                  class="aeris-menu__item"
                  role="menuitem"
                  [id]="entry.id"
                  [disabled]="entry.disabled"
                  [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                  [attr.aria-haspopup]="entry.children.length ? 'menu' : null"
                  [attr.aria-expanded]="entry.children.length ? entry.expanded : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-group' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-menu-key]="entry.key"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActiveKey(entry.key)"
                  (keydown)="handleItemKeydown($event, entry)"
                >
                  <ng-container
                    [ngTemplateOutlet]="itemTemplate()?.template ?? defaultItemTemplate"
                    [ngTemplateOutletContext]="itemContext(entry)"
                  />
                </button>
              }

              @if (entry.children.length && entry.expanded) {
                <div class="aeris-menu__group" [id]="entry.id + '-group'">
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
        class="aeris-menu__panel"
        [id]="menuId()"
        [class]="panelStyleClass()"
        [attr.data-popup]="popup() || null"
        [attr.data-positioned]="!popup() || positioned() ? true : null"
        [attr.data-size]="size()"
        [style.left.px]="popup() ? coordinates().x : null"
        [style.top.px]="popup() ? coordinates().y : null"
        [style.--aeris-menu-width]="width() || null"
        [style.--aeris-menu-max-height]="maxHeight() || null"
      >
        @if (startTemplate()) {
          <div class="aeris-menu__slot aeris-menu__slot--start">
            <ng-container [ngTemplateOutlet]="startTemplate()?.template ?? null" />
          </div>
        }

        <ng-container
          [ngTemplateOutlet]="menuList"
          [ngTemplateOutletContext]="{ $implicit: entries(), level: 0 }"
        />

        @if (endTemplate()) {
          <div class="aeris-menu__slot aeris-menu__slot--end">
            <ng-container [ngTemplateOutlet]="endTemplate()?.template ?? null" />
          </div>
        }
      </div>
    }
  `,
  styleUrl: './aeris-menu.scss',
  host: {
    class: 'aeris-menu',
    '[attr.data-popup]': 'popup() || null',
    '[attr.data-open]': 'panelVisible() || null',
  },
})
export class AerisMenu<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly injector = inject(Injector);
  private readonly generatedId = `aeris-menu-${++nextMenuId}`;
  private readonly activeTarget = signal<Element | null>(null);
  private readonly anchorPoint = signal<AerisMenuCoordinates>({ x: 0, y: 0 });

  protected readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  protected readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  protected readonly itemTemplate = contentChild(AerisMenuItemTemplate<T>, { descendants: false });
  protected readonly headerTemplate = contentChild(AerisMenuHeaderTemplate<T>, {
    descendants: false,
  });
  protected readonly startTemplate = contentChild(AerisMenuStartTemplate, { descendants: false });
  protected readonly endTemplate = contentChild(AerisMenuEndTemplate, { descendants: false });
  protected readonly activeKey = signal('');
  protected readonly positioned = signal(false);
  protected readonly coordinates = signal<AerisMenuCoordinates>({ x: 0, y: 0 });
  protected readonly panelVisible = computed(() => !this.popup() || this.open());
  protected readonly entries = computed(() =>
    this.buildEntries(this.model(), [], 0, this.activeKey()),
  );
  protected readonly menuId = computed(() => this.id());

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisMenuItem<T>[]>([]);
  readonly expandedKeys = model<AerisMenuExpandedKeys>({});
  readonly open = model(false);
  readonly popup = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<AerisMenuSize>('md');
  readonly width = input('');
  readonly maxHeight = input('');
  readonly viewportMargin = input(8);
  readonly hideOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Menu');
  readonly ariaLabelledBy = input('');
  readonly panelStyleClass = input('');
  readonly navigationHandler = input<AerisMenuNavigationHandler>();

  readonly shown = output<AerisMenuVisibilityEvent>();
  readonly hidden = output<AerisMenuVisibilityEvent>();
  readonly visibilityChanged = output<AerisMenuVisibilityEvent>();
  readonly itemSelected = output<AerisMenuItemEvent<T>>();

  constructor() {
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
      view?.addEventListener('scroll', reposition);
      onCleanup(() => {
        document.removeEventListener('pointerdown', pointerdown);
        document.removeEventListener('keydown', keydown);
        view?.removeEventListener('resize', reposition);
        view?.removeEventListener('scroll', reposition);
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
    reason: AerisMenuCloseReason = 'api',
    restoreFocus = this.restoreFocus(),
  ): void {
    if (!this.popup() || !this.open()) return;
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

  expandAll(): void {
    const expanded: Record<string, boolean> = {};
    for (const entry of this.flattenEntries(this.entries())) {
      if (entry.children.length && entry.toggleable) expanded[entry.key] = true;
    }
    this.updateExpandedKeys(expanded);
  }

  collapseAll(): void {
    const collapsed: Record<string, boolean> = {};
    for (const entry of this.flattenEntries(this.entries())) {
      if (entry.children.length && entry.toggleable) collapsed[entry.key] = false;
    }
    this.updateExpandedKeys(collapsed);
  }

  reposition(): void {
    if (!this.popup() || !this.open()) return;
    const panel = this.panel()?.nativeElement;
    const view = panel?.ownerDocument.defaultView;
    if (!panel || !view) return;

    const rect = panel.getBoundingClientRect();
    const width = rect.width || panel.offsetWidth || 240;
    const height = rect.height || panel.offsetHeight || 320;
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
    this.positioned.set(true);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.setAttribute('data-positioned', 'true');
  }

  protected setActiveKey(key: string): void {
    this.activeKey.set(key);
  }

  protected activateEntry(event: MouseEvent | KeyboardEvent, entry: AerisMenuEntry<T>): void {
    if (entry.disabled || entry.separator) {
      event.preventDefault();
      return;
    }

    if (entry.children.length && entry.toggleable) {
      event.preventDefault();
      this.toggleEntry(entry);
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
    if (this.popup() && this.closeOnSelect()) this.hide(event, 'select');
  }

  protected handleItemKeydown(event: KeyboardEvent, entry: AerisMenuEntry<T>): void {
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
        this.focusEdge('first');
        break;
      case 'End':
        event.preventDefault();
        this.focusEdge('last');
        break;
      case 'ArrowRight':
        if (entry.children.length && entry.toggleable && !entry.expanded) {
          event.preventDefault();
          this.toggleEntry(entry, true);
        }
        break;
      case 'ArrowLeft':
        if (entry.children.length && entry.toggleable && entry.expanded) {
          event.preventDefault();
          this.toggleEntry(entry, false);
        } else if (entry.parentKey) {
          event.preventDefault();
          this.focusEntry(this.findEntry(entry.parentKey));
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateEntry(event, entry);
        break;
      case 'Escape':
        if (this.popup() && this.closeOnEscape()) {
          event.preventDefault();
          this.hide(event, 'escape');
        }
        break;
    }
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.popup() || !this.open() || !this.hideOnOutsideClick()) return;
    const target = event.target;
    const panel = this.panel()?.nativeElement;
    if (target instanceof Node && panel?.contains(target)) return;
    this.hide(event, 'outside', false);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.popup() || !this.open() || event.key !== 'Escape' || !this.closeOnEscape()) return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  protected itemContext(entry: AerisMenuEntry<T>): AerisMenuItemTemplateContext<T> {
    return {
      $implicit: entry.item,
      item: entry.item,
      path: entry.path,
      level: entry.level,
      active: entry.active,
      expanded: entry.expanded,
      disabled: entry.disabled,
      hasChildren: entry.children.length > 0,
    };
  }

  protected headerContext(entry: AerisMenuEntry<T>): AerisMenuHeaderTemplateContext<T> {
    return {
      $implicit: entry.item,
      item: entry.item,
      path: entry.path,
      level: entry.level,
      expanded: entry.expanded,
      toggleable: entry.toggleable,
    };
  }

  private openAtTarget(target: EventTarget | null, originalEvent: Event): void {
    const element = target instanceof Element ? target : this.host.nativeElement;
    const rect = element.getBoundingClientRect();
    this.anchorPoint.set({ x: rect.left, y: rect.bottom + 6 });
    this.coordinates.set({ x: rect.left, y: rect.bottom + 6 });
    this.positioned.set(false);
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

  private buildEntries(
    items: readonly AerisMenuItem<T>[],
    parentPath: readonly number[],
    level: number,
    activeKey: string,
  ): readonly AerisMenuEntry<T>[] {
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.visible !== false)
      .map(({ item, index }) => {
        const path = [...parentPath, index];
        const key = item.id ?? this.pathKey(path);
        const parentKey = this.pathKey(parentPath);
        const children = this.buildEntries(item.items ?? [], path, level + 1, activeKey);
        const toggleable = children.length > 0 && item.toggleable !== false;
        const expanded = children.length > 0 && (!toggleable || this.isExpanded(item, key));
        return {
          item,
          index,
          id: `${this.id()}-item-${this.pathKey(path)}`,
          path,
          key,
          parentKey,
          level,
          href: this.resolveHref(item),
          separator: !!item.separator,
          disabled: !!item.disabled,
          active: activeKey === key,
          expanded,
          toggleable,
          children,
        };
      });
  }

  private isExpanded(item: AerisMenuItem<T>, key: string): boolean {
    const keys = this.expandedKeys();
    if (keys[key] !== undefined) return !!keys[key];
    return !!item.expanded;
  }

  private toggleEntry(entry: AerisMenuEntry<T>, force?: boolean): void {
    const next = { ...this.expandedKeys(), [entry.key]: force ?? !entry.expanded };
    this.updateExpandedKeys(next);
  }

  private updateExpandedKeys(keys: AerisMenuExpandedKeys): void {
    this.expandedKeys.set(keys);
  }

  private openInitialItem(): void {
    const first = this.firstEnabledEntry(this.visibleFocusableEntries());
    this.activeKey.set(first?.key ?? '');
  }

  private focusSibling(entry: AerisMenuEntry<T>, step: 1 | -1): void {
    const focusable = this.visibleFocusableEntries();
    if (!focusable.length) return;
    const current = focusable.findIndex((item) => item.key === entry.key);
    const next =
      current < 0
        ? step === 1
          ? 0
          : focusable.length - 1
        : (current + step + focusable.length) % focusable.length;
    this.focusEntry(focusable[next]);
  }

  private focusEdge(edge: 'first' | 'last'): void {
    const focusable = this.visibleFocusableEntries();
    this.focusEntry(edge === 'first' ? focusable[0] : focusable.at(-1));
  }

  private focusActiveItem(): void {
    this.focusEntry(
      this.findEntry(this.activeKey()) ?? this.firstEnabledEntry(this.visibleFocusableEntries()),
    );
  }

  private focusEntry(entry: AerisMenuEntry<T> | undefined): void {
    if (!entry) return;
    this.activeKey.set(entry.key);
    queueMicrotask(() => {
      this.menuItems()
        .find(
          ({ nativeElement }) => nativeElement.getAttribute('data-aeris-menu-key') === entry.key,
        )
        ?.nativeElement.focus();
    });
  }

  private visibleFocusableEntries(): readonly AerisMenuEntry<T>[] {
    return this.flattenVisibleEntries(this.entries()).filter(
      (entry) =>
        !entry.separator &&
        !entry.disabled &&
        (entry.toggleable || !entry.children.length || entry.href || entry.item.command),
    );
  }

  private firstEnabledEntry(entries: readonly AerisMenuEntry<T>[]): AerisMenuEntry<T> | undefined {
    return entries.find((entry) => !entry.separator && !entry.disabled);
  }

  private findEntry(key: string): AerisMenuEntry<T> | undefined {
    return this.flattenEntries(this.entries()).find((entry) => entry.key === key);
  }

  private flattenVisibleEntries(
    entries: readonly AerisMenuEntry<T>[],
  ): readonly AerisMenuEntry<T>[] {
    return entries.flatMap((entry) => [
      entry,
      ...(entry.expanded ? this.flattenVisibleEntries(entry.children) : []),
    ]);
  }

  private flattenEntries(entries: readonly AerisMenuEntry<T>[]): readonly AerisMenuEntry<T>[] {
    return entries.flatMap((entry) => [entry, ...this.flattenEntries(entry.children)]);
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisMenuCloseReason,
    originalEvent: Event | null,
  ): AerisMenuVisibilityEvent {
    return {
      originalEvent,
      visible,
      reason,
      target: this.activeTarget(),
    };
  }

  private resolveHref(item: AerisMenuItem<T>): string | null {
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

export const AerisMenuModule = [
  AerisMenu,
  AerisMenuItemTemplate,
  AerisMenuHeaderTemplate,
  AerisMenuStartTemplate,
  AerisMenuEndTemplate,
] as const;
