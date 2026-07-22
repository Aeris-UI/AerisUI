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
  viewChildren,
} from '@angular/core';

export type AerisMenubarSize = 'sm' | 'md' | 'lg';
export type AerisMenubarCloseReason = 'api' | 'escape' | 'outside' | 'select';

export interface AerisMenubarItem<T = unknown> {
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
  readonly items?: readonly AerisMenubarItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMenubarItemEvent<T>) => void;
}

export interface AerisMenubarItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMenubarItem<T>;
  readonly path: readonly number[];
}

export interface AerisMenubarVisibilityEvent<T = unknown> {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisMenubarCloseReason;
  readonly item: AerisMenubarItem<T> | null;
  readonly path: readonly number[];
}

export interface AerisMenubarItemTemplateContext<T = unknown> {
  readonly $implicit: AerisMenubarItem<T>;
  readonly item: AerisMenubarItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly root: boolean;
  readonly active: boolean;
  readonly open: boolean;
  readonly disabled: boolean;
  readonly hasSubmenu: boolean;
}

export type AerisMenubarNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisMenubarEntry<T> {
  readonly item: AerisMenubarItem<T>;
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
  readonly children: readonly AerisMenubarEntry<T>[];
}

@Directive({ selector: 'ng-template[aerisMenubarItem]' })
export class AerisMenubarItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisMenubarItemTemplateContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisMenubarItemTemplate<T>,
    context: unknown,
  ): context is AerisMenubarItemTemplateContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisMenubarStart]' })
export class AerisMenubarStartTemplate {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMenubarEnd]' })
export class AerisMenubarEndTemplate {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

let nextMenubarId = 0;

@Component({
  selector: 'aeris-menubar',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #defaultItemTemplate let-item let-root="root" let-hasSubmenu="hasSubmenu">
      @if (item.icon) {
        <span class="aeris-menubar__icon" aria-hidden="true">{{ item.icon }}</span>
      }
      <span class="aeris-menubar__copy">
        <span class="aeris-menubar__label">{{ item.label }}</span>
        @if (item.description) {
          <span class="aeris-menubar__description">{{ item.description }}</span>
        }
      </span>
      @if (item.badge !== undefined && item.badge !== null) {
        <span class="aeris-menubar__badge">{{ item.badge }}</span>
      }
      @if (item.shortcut) {
        <kbd class="aeris-menubar__shortcut">{{ item.shortcut }}</kbd>
      }
      @if (hasSubmenu) {
        <svg
          class="aeris-menubar__chevron"
          [attr.data-root]="root || null"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
        </svg>
      }
    </ng-template>

    <ng-template #menuList let-entries let-level="level">
      <ul
        [class]="level === 0 ? 'aeris-menubar__root' : 'aeris-menubar__submenu-list'"
        [attr.role]="level === 0 ? 'menubar' : 'menu'"
        [attr.aria-orientation]="level === 0 ? 'horizontal' : 'vertical'"
        [attr.aria-label]="level === 0 ? ariaLabel() || null : null"
        [attr.aria-labelledby]="level === 0 ? ariaLabelledBy() || null : null"
        [attr.data-level]="level"
      >
        @for (entry of entries; track entry.id) {
          @if (entry.separator) {
            <li class="aeris-menubar__separator" role="separator"></li>
          } @else {
            <li
              class="aeris-menubar__item-shell"
              role="none"
              [attr.data-root]="entry.level === 0 || null"
              [attr.data-open]="entry.open || null"
              [attr.data-active]="entry.active || null"
              [attr.data-disabled]="entry.disabled || null"
            >
              @if (entry.href) {
                <a
                  #menuItem
                  class="aeris-menubar__item"
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
                  [attr.data-aeris-menubar-path]="entry.pathKey"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActivePath(entry.path)"
                  (mouseenter)="handlePointerEnter(entry)"
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
                  class="aeris-menubar__item"
                  role="menuitem"
                  [id]="entry.id"
                  [disabled]="entry.disabled"
                  [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                  [attr.aria-haspopup]="entry.children.length ? 'menu' : null"
                  [attr.aria-expanded]="entry.children.length ? entry.open : null"
                  [attr.aria-controls]="entry.children.length ? entry.id + '-submenu' : null"
                  [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                  [attr.data-aeris-menubar-path]="entry.pathKey"
                  [attr.data-custom-template]="itemTemplate() ? true : null"
                  (click)="activateEntry($event, entry)"
                  (focus)="setActivePath(entry.path)"
                  (mouseenter)="handlePointerEnter(entry)"
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
                  class="aeris-menubar__submenu"
                  [id]="entry.id + '-submenu'"
                  [attr.data-level]="entry.level + 1"
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

    <nav
      class="aeris-menubar__nav"
      [attr.aria-label]="navAriaLabel() || null"
      [attr.aria-labelledby]="navAriaLabelledBy() || null"
    >
      <div class="aeris-menubar__surface">
        @if (startTemplate()) {
          <div class="aeris-menubar__slot aeris-menubar__slot--start">
            <ng-container [ngTemplateOutlet]="startTemplate()?.template ?? null" />
          </div>
        }

        @if (collapsible()) {
          <button
            type="button"
            class="aeris-menubar__toggle"
            [attr.aria-label]="toggleAriaLabel()"
            [attr.aria-expanded]="mobileOpen()"
            [attr.aria-controls]="id() + '-menu'"
            (click)="toggleMobile()"
          >
            <span aria-hidden="true"></span>
          </button>
        }

        <div class="aeris-menubar__menu" [id]="id() + '-menu'">
          <ng-container
            [ngTemplateOutlet]="menuList"
            [ngTemplateOutletContext]="{ $implicit: entries(), level: 0 }"
          />
        </div>

        @if (endTemplate()) {
          <div class="aeris-menubar__slot aeris-menubar__slot--end">
            <ng-container [ngTemplateOutlet]="endTemplate()?.template ?? null" />
          </div>
        }
      </div>
    </nav>
  `,
  styleUrl: './aeris-menubar.scss',
  host: {
    class: 'aeris-menubar',
    '[attr.data-size]': 'size()',
    '[attr.data-collapsible]': 'collapsible() || null',
    '[attr.data-mobile-open]': 'mobileOpen() || null',
  },
})
export class AerisMenubar<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly generatedId = `aeris-menubar-${++nextMenubarId}`;

  protected readonly itemTemplate = contentChild(AerisMenubarItemTemplate<T>, {
    descendants: false,
  });
  protected readonly startTemplate = contentChild(AerisMenubarStartTemplate, {
    descendants: false,
  });
  protected readonly endTemplate = contentChild(AerisMenubarEndTemplate, { descendants: false });
  protected readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  protected readonly activePathKey = signal('0');

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisMenubarItem<T>[]>([]);
  readonly openPath = model('');
  readonly mobileOpen = model(false);
  readonly size = input<AerisMenubarSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly openOnHover = input(true, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly hideOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Menubar');
  readonly ariaLabelledBy = input('');
  readonly navAriaLabel = input('');
  readonly navAriaLabelledBy = input('');
  readonly toggleAriaLabel = input('Toggle navigation menu');
  readonly navigationHandler = input<AerisMenubarNavigationHandler>();

  readonly opened = output<AerisMenubarVisibilityEvent<T>>();
  readonly closed = output<AerisMenubarVisibilityEvent<T>>();
  readonly itemSelected = output<AerisMenubarItemEvent<T>>();

  protected readonly entries = computed(() =>
    this.buildEntries(this.model(), [], 0, this.activePathKey(), this.openPath()),
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.openPath() && !this.mobileOpen()) return;
      const document = this.host.nativeElement.ownerDocument;
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const keydown = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
      document.addEventListener('pointerdown', pointerdown);
      document.addEventListener('keydown', keydown);
      onCleanup(() => {
        document.removeEventListener('pointerdown', pointerdown);
        document.removeEventListener('keydown', keydown);
      });
    });
  }

  open(path: string | readonly number[], originalEvent: Event | null = null): void {
    const key = typeof path === 'string' ? path : this.pathKey(path);
    const entry = this.findEntry(key);
    if (!entry || entry.disabled || !entry.children.length) return;
    this.openPath.set(key);
    this.opened.emit(this.visibilityEvent(true, 'api', originalEvent, entry));
  }

  close(originalEvent: Event | null = null, reason: AerisMenubarCloseReason = 'api'): void {
    const entry = this.findEntry(this.openPath());
    this.openPath.set('');
    this.closed.emit(this.visibilityEvent(false, reason, originalEvent, entry));
  }

  focus(): void {
    this.focusEntry(this.findEntry(this.activePathKey()) ?? this.firstEnabledEntry(this.entries()));
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected setActivePath(path: readonly number[]): void {
    this.activePathKey.set(this.pathKey(path));
  }

  protected handlePointerEnter(entry: AerisMenubarEntry<T>): void {
    if (!this.openOnHover() || this.disabled() || entry.disabled || entry.separator) return;
    this.activePathKey.set(entry.pathKey);
    if (entry.children.length) {
      this.openPath.set(entry.pathKey);
    } else if (entry.level > 0) {
      this.openPath.set(entry.parentPathKey);
    }
  }

  protected activateEntry(event: MouseEvent | KeyboardEvent, entry: AerisMenubarEntry<T>): void {
    if (this.disabled() || entry.disabled || entry.separator) {
      event.preventDefault();
      return;
    }

    if (entry.children.length) {
      event.preventDefault();
      const next = entry.open ? entry.parentPathKey : entry.pathKey;
      this.openPath.set(next);
      if (!entry.open) this.opened.emit(this.visibilityEvent(true, 'api', event, entry));
      return;
    }

    const itemEvent = {
      originalEvent: event,
      item: entry.item,
      path: entry.path,
    };
    entry.item.command?.(itemEvent);
    this.itemSelected.emit(itemEvent);
    if (entry.item.routerLink && this.navigationHandler()) {
      event.preventDefault();
      this.navigationHandler()?.(entry.item.routerLink, event);
    }
    if (this.closeOnSelect()) {
      this.mobileOpen.set(false);
      this.close(event, 'select');
    }
  }

  protected handleItemKeydown(event: KeyboardEvent, entry: AerisMenubarEntry<T>): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (entry.level === 0) {
          this.focusRootSibling(entry, 1);
        } else if (entry.children.length) {
          this.openPath.set(entry.pathKey);
          this.focusFirstChild(entry);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (entry.level === 0) {
          this.focusRootSibling(entry, -1);
        } else {
          this.closeSubmenu(entry);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (entry.level === 0 && entry.children.length) {
          this.openPath.set(entry.pathKey);
          this.focusFirstChild(entry);
        } else {
          this.focusSibling(entry, 1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (entry.level === 0 && entry.children.length) {
          this.openPath.set(entry.pathKey);
          this.focusLastChild(entry);
        } else {
          this.focusSibling(entry, -1);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusEdge(entry, 'first');
        break;
      case 'End':
        event.preventDefault();
        this.focusEdge(entry, 'last');
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateEntry(event, entry);
        if (entry.children.length) this.focusFirstChild(entry);
        break;
      case 'Escape':
        if (!this.closeOnEscape()) return;
        event.preventDefault();
        if (entry.level > 0) {
          const root = this.rootEntryFor(entry);
          this.close(event, 'escape');
          this.focusEntry(root);
        } else {
          this.close(event, 'escape');
        }
        break;
      case 'Tab':
        this.close(event, 'outside');
        break;
    }
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.hideOnOutsideClick() || (!this.openPath() && !this.mobileOpen())) return;
    const target = event.target;
    if (target instanceof Node && this.host.nativeElement.contains(target)) return;
    this.mobileOpen.set(false);
    this.close(event, 'outside');
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.closeOnEscape()) return;
    if (!this.openPath() && !this.mobileOpen()) return;
    this.mobileOpen.set(false);
    this.close(event, 'escape');
  }

  protected itemContext(entry: AerisMenubarEntry<T>): AerisMenubarItemTemplateContext<T> {
    return {
      $implicit: entry.item,
      item: entry.item,
      path: entry.path,
      level: entry.level,
      root: entry.level === 0,
      active: entry.active,
      open: entry.open,
      disabled: entry.disabled,
      hasSubmenu: entry.children.length > 0,
    };
  }

  private buildEntries(
    items: readonly AerisMenubarItem<T>[],
    parentPath: readonly number[],
    level: number,
    activePathKey: string,
    openPathKey: string,
  ): readonly AerisMenubarEntry<T>[] {
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
          index,
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

  private focusRootSibling(entry: AerisMenubarEntry<T>, step: 1 | -1): void {
    const roots = this.enabledEntriesForParent('');
    const current = roots.findIndex((item) => item.pathKey === entry.pathKey);
    this.focusEntry(roots[(current + step + roots.length) % roots.length]);
  }

  private focusSibling(entry: AerisMenubarEntry<T>, step: 1 | -1): void {
    const siblings = this.enabledEntriesForParent(entry.parentPathKey);
    const current = siblings.findIndex((item) => item.pathKey === entry.pathKey);
    this.focusEntry(siblings[(current + step + siblings.length) % siblings.length]);
  }

  private focusEdge(entry: AerisMenubarEntry<T>, edge: 'first' | 'last'): void {
    const siblings = this.enabledEntriesForParent(entry.parentPathKey);
    this.focusEntry(edge === 'first' ? siblings[0] : siblings.at(-1));
  }

  private focusFirstChild(entry: AerisMenubarEntry<T>): void {
    afterNextRender(() => this.focusEntry(this.firstEnabledEntry(entry.children)), {
      injector: this.injector,
    });
  }

  private focusLastChild(entry: AerisMenubarEntry<T>): void {
    afterNextRender(() => this.focusEntry(this.lastEnabledEntry(entry.children)), {
      injector: this.injector,
    });
  }

  private closeSubmenu(entry: AerisMenubarEntry<T>): void {
    const parent = this.findEntry(entry.parentPathKey);
    this.openPath.set(parent?.parentPathKey ?? '');
    this.focusEntry(parent);
  }

  private focusEntry(entry: AerisMenubarEntry<T> | undefined): void {
    if (!entry) return;
    this.activePathKey.set(entry.pathKey);
    queueMicrotask(() => {
      this.menuItems()
        .find(
          ({ nativeElement }) =>
            nativeElement.getAttribute('data-aeris-menubar-path') === entry.pathKey,
        )
        ?.nativeElement.focus();
    });
  }

  private rootEntryFor(entry: AerisMenubarEntry<T>): AerisMenubarEntry<T> | undefined {
    return this.findEntry(String(entry.path[0] ?? '0'));
  }

  private enabledEntriesForParent(parentPathKey: string): readonly AerisMenubarEntry<T>[] {
    return this.flattenEntries(this.entries()).filter(
      (entry) => entry.parentPathKey === parentPathKey && !entry.separator && !entry.disabled,
    );
  }

  private firstEnabledEntry(
    entries: readonly AerisMenubarEntry<T>[],
  ): AerisMenubarEntry<T> | undefined {
    return entries.find((entry) => !entry.separator && !entry.disabled);
  }

  private lastEnabledEntry(
    entries: readonly AerisMenubarEntry<T>[],
  ): AerisMenubarEntry<T> | undefined {
    return entries.filter((entry) => !entry.separator && !entry.disabled).at(-1);
  }

  private findEntry(pathKey: string): AerisMenubarEntry<T> | undefined {
    return this.flattenEntries(this.entries()).find((entry) => entry.pathKey === pathKey);
  }

  private flattenEntries(
    entries: readonly AerisMenubarEntry<T>[],
  ): readonly AerisMenubarEntry<T>[] {
    return entries.flatMap((entry) => [entry, ...this.flattenEntries(entry.children)]);
  }

  private visibilityEvent(
    visible: boolean,
    reason: AerisMenubarCloseReason,
    originalEvent: Event | null,
    entry: AerisMenubarEntry<T> | undefined,
  ): AerisMenubarVisibilityEvent<T> {
    return {
      originalEvent,
      visible,
      reason,
      item: entry?.item ?? null,
      path: entry?.path ?? [],
    };
  }

  private resolveHref(item: AerisMenubarItem<T>): string | null {
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

export const AerisMenubarModule = [
  AerisMenubar,
  AerisMenubarItemTemplate,
  AerisMenubarStartTemplate,
  AerisMenubarEndTemplate,
] as const;
