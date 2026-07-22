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
  output,
  signal,
  viewChildren,
} from '@angular/core';

export type AerisMegaMenuOrientation = 'horizontal' | 'vertical';
export type AerisMegaMenuSize = 'sm' | 'md' | 'lg';
export type AerisMegaMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';

export interface AerisMegaMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly badge?: string | number;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly items?: readonly AerisMegaMenuItem<T>[];
  readonly groups?: readonly AerisMegaMenuGroup<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMegaMenuItemEvent<T>) => void;
}

export interface AerisMegaMenuGroup<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly items: readonly AerisMegaMenuItem<T>[];
}

export interface AerisMegaMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMegaMenuItem<T>;
  readonly path: readonly number[];
  readonly root: AerisMegaMenuItem<T>;
  readonly group: AerisMegaMenuGroup<T> | null;
}

export interface AerisMegaMenuVisibilityEvent<T = unknown> {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly root: AerisMegaMenuItem<T> | null;
  readonly reason: AerisMegaMenuCloseReason;
}

export interface AerisMegaMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisMegaMenuItem<T>;
  readonly item: AerisMegaMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly root: boolean;
  readonly active: boolean;
  readonly open: boolean;
  readonly disabled: boolean;
  readonly hasPanel: boolean;
}

export type AerisMegaMenuNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisMegaMenuEntry<T> {
  readonly item: AerisMegaMenuItem<T>;
  readonly path: readonly number[];
  readonly pathKey: string;
  readonly id: string;
  readonly level: number;
  readonly disabled: boolean;
  readonly active: boolean;
  readonly open: boolean;
  readonly href: string | null;
  readonly panelGroups: readonly AerisMegaMenuGroup<T>[];
}

@Directive({ selector: 'ng-template[aerisMegaMenuItem]' })
export class AerisMegaMenuItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisMegaMenuItemTemplateContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisMegaMenuItemTemplate<T>,
    context: unknown,
  ): context is AerisMegaMenuItemTemplateContext<T> {
    return true;
  }
}

let nextMegaMenuId = 0;

@Component({
  selector: 'aeris-mega-menu',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #itemContent let-entry let-root="root" let-hasPanel="hasPanel">
      <ng-container
        [ngTemplateOutlet]="itemTemplate()?.template ?? defaultItemTemplate"
        [ngTemplateOutletContext]="itemContext(entry, root, hasPanel)"
      />
    </ng-template>

    <ng-template #defaultItemTemplate let-item let-root="root" let-hasPanel="hasPanel">
      @if (item.icon) {
        <span class="aeris-mega-menu__icon" aria-hidden="true">{{ item.icon }}</span>
      }
      <span class="aeris-mega-menu__copy">
        <span class="aeris-mega-menu__label">{{ item.label }}</span>
        @if (item.description) {
          <span class="aeris-mega-menu__description">{{ item.description }}</span>
        }
      </span>
      @if (item.badge !== undefined && item.badge !== null) {
        <span class="aeris-mega-menu__badge">{{ item.badge }}</span>
      }
      @if (hasPanel) {
        <svg class="aeris-mega-menu__chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m6.5 8 3.5 4 3.5-4" />
        </svg>
      }
    </ng-template>

    <ng-template
      #panelItems
      let-items
      let-root="root"
      let-group="group"
      let-groupIndex="groupIndex"
      let-prefix="prefix"
      let-level="level"
    >
      <ul class="aeris-mega-menu__panel-list" role="group">
        @for (item of visibleItems(items); track item.id ?? item.label ?? $index) {
          @if (item.separator) {
            <li class="aeris-mega-menu__separator" role="separator"></li>
          } @else {
            @let path = panelPath(root.path, groupIndex, $index, prefix);
            @let childEntry = panelEntry(item, path, level);
            <li role="none">
              @if (childEntry.href) {
                <a
                  #menuItem
                  class="aeris-mega-menu__panel-item"
                  role="menuitem"
                  [id]="childEntry.id"
                  [attr.href]="childEntry.disabled ? null : childEntry.href"
                  [attr.target]="item.target || null"
                  [attr.rel]="item.rel || (item.target === '_blank' ? 'noopener noreferrer' : null)"
                  [attr.aria-label]="item.ariaLabel ?? item.label"
                  [attr.aria-disabled]="childEntry.disabled || null"
                  [attr.tabindex]="childEntry.active && !childEntry.disabled ? 0 : -1"
                  [attr.data-aeris-mega-menu-path]="childEntry.pathKey"
                  (click)="activateItem($event, childEntry, root.item, group)"
                  (focus)="setActivePath(childEntry.path)"
                  (keydown)="handlePanelKeydown($event, childEntry)"
                >
                  <ng-container
                    [ngTemplateOutlet]="itemContent"
                    [ngTemplateOutletContext]="{
                      $implicit: childEntry,
                      root: false,
                      hasPanel: false,
                    }"
                  />
                </a>
              } @else {
                <button
                  #menuItem
                  type="button"
                  class="aeris-mega-menu__panel-item"
                  role="menuitem"
                  [id]="childEntry.id"
                  [disabled]="childEntry.disabled"
                  [attr.aria-label]="item.ariaLabel ?? item.label"
                  [attr.tabindex]="childEntry.active && !childEntry.disabled ? 0 : -1"
                  [attr.data-aeris-mega-menu-path]="childEntry.pathKey"
                  (click)="activateItem($event, childEntry, root.item, group)"
                  (focus)="setActivePath(childEntry.path)"
                  (keydown)="handlePanelKeydown($event, childEntry)"
                >
                  <ng-container
                    [ngTemplateOutlet]="itemContent"
                    [ngTemplateOutletContext]="{
                      $implicit: childEntry,
                      root: false,
                      hasPanel: false,
                    }"
                  />
                </button>
              }

              @if (item.items?.length) {
                <ng-container
                  [ngTemplateOutlet]="panelItems"
                  [ngTemplateOutletContext]="{
                    $implicit: item.items,
                    root,
                    group,
                    groupIndex,
                    prefix: childEntry.path,
                    level: level + 1,
                  }"
                />
              }
            </li>
          }
        }
      </ul>
    </ng-template>

    <nav
      class="aeris-mega-menu__nav"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
    >
      <ul class="aeris-mega-menu__root" role="menubar" [attr.aria-orientation]="orientation()">
        @for (entry of rootEntries(); track entry.id) {
          <li class="aeris-mega-menu__root-item" role="none" [attr.data-open]="entry.open || null">
            @if (entry.href) {
              <a
                #menuItem
                class="aeris-mega-menu__trigger"
                role="menuitem"
                [id]="entry.id"
                [attr.href]="entry.disabled ? null : entry.href"
                [attr.target]="entry.item.target || null"
                [attr.rel]="
                  entry.item.rel || (entry.item.target === '_blank' ? 'noopener noreferrer' : null)
                "
                [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                [attr.aria-disabled]="entry.disabled || null"
                [attr.aria-haspopup]="entry.panelGroups.length ? 'menu' : null"
                [attr.aria-expanded]="entry.panelGroups.length ? entry.open : null"
                [attr.aria-controls]="entry.panelGroups.length ? entry.id + '-panel' : null"
                [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                [attr.data-aeris-mega-menu-path]="entry.pathKey"
                (click)="activateRoot($event, entry)"
                (focus)="setActivePath(entry.path)"
                (mouseenter)="openRootFromPointer(entry)"
                (keydown)="handleRootKeydown($event, entry)"
              >
                <ng-container
                  [ngTemplateOutlet]="itemContent"
                  [ngTemplateOutletContext]="{
                    $implicit: entry,
                    root: true,
                    hasPanel: entry.panelGroups.length > 0,
                  }"
                />
              </a>
            } @else {
              <button
                #menuItem
                type="button"
                class="aeris-mega-menu__trigger"
                role="menuitem"
                [id]="entry.id"
                [disabled]="entry.disabled"
                [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
                [attr.aria-haspopup]="entry.panelGroups.length ? 'menu' : null"
                [attr.aria-expanded]="entry.panelGroups.length ? entry.open : null"
                [attr.aria-controls]="entry.panelGroups.length ? entry.id + '-panel' : null"
                [attr.tabindex]="entry.active && !entry.disabled ? 0 : -1"
                [attr.data-aeris-mega-menu-path]="entry.pathKey"
                (click)="activateRoot($event, entry)"
                (focus)="setActivePath(entry.path)"
                (mouseenter)="openRootFromPointer(entry)"
                (keydown)="handleRootKeydown($event, entry)"
              >
                <ng-container
                  [ngTemplateOutlet]="itemContent"
                  [ngTemplateOutletContext]="{
                    $implicit: entry,
                    root: true,
                    hasPanel: entry.panelGroups.length > 0,
                  }"
                />
              </button>
            }

            @if (entry.open && entry.panelGroups.length) {
              <div
                class="aeris-mega-menu__panel"
                role="menu"
                [id]="entry.id + '-panel'"
                [attr.aria-label]="entry.item.label ? entry.item.label + ' menu' : null"
              >
                <div class="aeris-mega-menu__panel-grid">
                  @for (group of entry.panelGroups; track group.id ?? group.label ?? $index) {
                    <section class="aeris-mega-menu__group">
                      @if (group.label || group.description) {
                        <header class="aeris-mega-menu__group-header">
                          @if (group.label) {
                            <h3>{{ group.label }}</h3>
                          }
                          @if (group.description) {
                            <p>{{ group.description }}</p>
                          }
                        </header>
                      }
                      <ng-container
                        [ngTemplateOutlet]="panelItems"
                        [ngTemplateOutletContext]="{
                          $implicit: group.items,
                          root: entry,
                          group,
                          groupIndex: $index,
                          prefix: [],
                          level: 1,
                        }"
                      />
                    </section>
                  }
                </div>
              </div>
            }
          </li>
        }
      </ul>
    </nav>
  `,
  styleUrl: './aeris-mega-menu.scss',
  host: {
    class: 'aeris-mega-menu',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-size]': 'size()',
  },
})
export class AerisMegaMenu<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly generatedId = `aeris-mega-menu-${++nextMegaMenuId}`;

  protected readonly itemTemplate = contentChild(AerisMegaMenuItemTemplate<T>, {
    descendants: false,
  });
  protected readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  protected readonly activePathKey = signal('0');
  protected readonly openRootIndex = signal<number | null>(null);

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisMegaMenuItem<T>[]>([]);
  readonly orientation = input<AerisMegaMenuOrientation>('horizontal');
  readonly size = input<AerisMegaMenuSize>('md');
  readonly ariaLabel = input('Mega menu');
  readonly ariaLabelledBy = input('');
  readonly openOnHover = input(true, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly navigationHandler = input<AerisMegaMenuNavigationHandler>();

  readonly itemSelected = output<AerisMegaMenuItemEvent<T>>();
  readonly opened = output<AerisMegaMenuVisibilityEvent<T>>();
  readonly closed = output<AerisMegaMenuVisibilityEvent<T>>();

  protected readonly rootEntries = computed(() =>
    this.visibleItems(this.model()).map((item, index) =>
      this.createEntry(item, [index], 0, this.openRootIndex() === index),
    ),
  );

  constructor() {
    effect((onCleanup) => {
      if (this.openRootIndex() === null) return;
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

  open(index: number, originalEvent: Event | null = null): void {
    const entry = this.rootEntries()[index];
    if (!entry || entry.disabled || !entry.panelGroups.length) return;
    this.openRootIndex.set(index);
    this.activePathKey.set(entry.pathKey);
    this.opened.emit({
      originalEvent,
      visible: true,
      root: entry.item,
      reason: 'api',
    });
  }

  close(originalEvent: Event | null = null, reason: AerisMegaMenuCloseReason = 'api'): void {
    const entry =
      this.openRootIndex() == null ? null : this.rootEntries()[this.openRootIndex() ?? -1];
    this.openRootIndex.set(null);
    this.closed.emit({
      originalEvent,
      visible: false,
      root: entry?.item ?? null,
      reason,
    });
  }

  toggle(index: number, originalEvent: Event | null = null): void {
    if (this.openRootIndex() === index) {
      this.close(originalEvent);
    } else {
      this.open(index, originalEvent);
    }
  }

  focus(): void {
    this.focusEntry(this.rootEntries().find((entry) => entry.active) ?? this.rootEntries()[0]);
  }

  protected visibleItems(
    items: readonly AerisMegaMenuItem<T>[] = [],
  ): readonly AerisMegaMenuItem<T>[] {
    return items.filter((item) => item.visible !== false);
  }

  protected activateRoot(event: MouseEvent | KeyboardEvent, entry: AerisMegaMenuEntry<T>): void {
    if (entry.disabled) {
      event.preventDefault();
      return;
    }

    if (entry.panelGroups.length) {
      event.preventDefault();
      this.toggle(entry.path[0] ?? 0, event);
      return;
    }

    this.activateItem(event, entry, entry.item, null);
  }

  protected activateItem(
    event: MouseEvent | KeyboardEvent,
    entry: AerisMegaMenuEntry<T>,
    root: AerisMegaMenuItem<T>,
    group: AerisMegaMenuGroup<T> | null,
  ): void {
    if (entry.disabled) {
      event.preventDefault();
      return;
    }

    const itemEvent = {
      originalEvent: event,
      item: entry.item,
      path: entry.path,
      root,
      group,
    };
    entry.item.command?.(itemEvent);
    this.itemSelected.emit(itemEvent);
    if (entry.item.routerLink && this.navigationHandler()) {
      event.preventDefault();
      this.navigationHandler()?.(entry.item.routerLink, event);
    }
    if (this.closeOnSelect()) this.close(event, 'select');
  }

  protected openRootFromPointer(entry: AerisMegaMenuEntry<T>): void {
    if (!this.openOnHover() || entry.disabled || !entry.panelGroups.length) return;
    this.open(entry.path[0] ?? 0);
  }

  protected setActivePath(path: readonly number[]): void {
    this.activePathKey.set(this.pathKey(path));
  }

  protected handleRootKeydown(event: KeyboardEvent, entry: AerisMegaMenuEntry<T>): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.focusRootSibling(entry, this.orientation() === 'horizontal' ? 1 : 0);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusRootSibling(entry, this.orientation() === 'horizontal' ? -1 : 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (entry.panelGroups.length) {
          this.open(entry.path[0] ?? 0, event);
          this.focusFirstPanelItem(entry);
        } else {
          this.focusRootSibling(entry, this.orientation() === 'vertical' ? 1 : 0);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.orientation() === 'vertical') {
          this.focusRootSibling(entry, -1);
        } else if (entry.panelGroups.length) {
          this.open(entry.path[0] ?? 0, event);
          this.focusLastPanelItem(entry);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusEntry(this.rootEntries()[0]);
        break;
      case 'End':
        event.preventDefault();
        this.focusEntry(this.rootEntries().at(-1));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateRoot(event, entry);
        break;
      case 'Escape':
        this.close(event, 'escape');
        break;
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent, entry: AerisMegaMenuEntry<T>): void {
    const items = this.panelFocusableEntries();
    const current = items.findIndex((item) => item.pathKey === entry.pathKey);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusEntry(items[(current + 1 + items.length) % items.length]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusEntry(items[(current - 1 + items.length) % items.length]);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusEntry(items[(current + 1 + items.length) % items.length]);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusEntry(items[(current - 1 + items.length) % items.length]);
        break;
      case 'Home':
        event.preventDefault();
        this.focusEntry(items[0]);
        break;
      case 'End':
        event.preventDefault();
        this.focusEntry(items.at(-1));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateItem(event, entry, this.openRootEntry()?.item ?? entry.item, null);
        break;
      case 'Escape':
        event.preventDefault();
        const root = this.openRootEntry();
        this.close(event, 'escape');
        this.focusEntry(root);
        break;
      case 'Tab':
        this.close(event, 'outside');
        break;
    }
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (this.openRootIndex() == null) return;
    const target = event.target;
    if (target instanceof Node && this.host.nativeElement.contains(target)) return;
    this.close(event, 'outside');
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || this.openRootIndex() == null) return;
    this.close(event, 'escape');
  }

  protected itemContext(
    entry: AerisMegaMenuEntry<T>,
    root: boolean,
    hasPanel: boolean,
  ): AerisMegaMenuItemTemplateContext<T> {
    return {
      $implicit: entry.item,
      item: entry.item,
      path: entry.path,
      level: entry.level,
      root,
      active: entry.active,
      open: entry.open,
      disabled: entry.disabled,
      hasPanel,
    };
  }

  protected panelPath(
    rootPath: readonly number[],
    groupIndex: number,
    index: number,
    prefix: readonly number[],
  ): readonly number[] {
    return [...rootPath, groupIndex, ...prefix, index];
  }

  protected panelEntry(
    item: AerisMegaMenuItem<T>,
    path: readonly number[],
    level: number,
  ): AerisMegaMenuEntry<T> {
    return this.createEntry(item, path, level, false);
  }

  private createEntry(
    item: AerisMegaMenuItem<T>,
    path: readonly number[],
    level: number,
    open: boolean,
  ): AerisMegaMenuEntry<T> {
    const key = this.pathKey(path);
    return {
      item,
      path,
      pathKey: key,
      id: item.id ?? `${this.id()}-item-${key.replace(/\./g, '-')}`,
      level,
      disabled: !!item.disabled,
      active: this.activePathKey() === key,
      open,
      href: this.resolveHref(item),
      panelGroups: level === 0 ? this.groupsFor(item) : [],
    };
  }

  private groupsFor(item: AerisMegaMenuItem<T> | undefined): readonly AerisMegaMenuGroup<T>[] {
    if (!item) return [];
    if (item.groups?.length) {
      return item.groups
        .filter((group) => group.items.some((child) => child.visible !== false))
        .map((group) => ({ ...group, items: this.visibleItems(group.items) }));
    }
    if (item.items?.length) {
      return [{ items: this.visibleItems(item.items) }];
    }
    return [];
  }

  private focusRootSibling(entry: AerisMegaMenuEntry<T>, step: -1 | 0 | 1): void {
    if (step === 0) return;
    const entries = this.rootEntries().filter((item) => !item.disabled);
    const current = entries.findIndex((item) => item.pathKey === entry.pathKey);
    this.focusEntry(entries[(current + step + entries.length) % entries.length]);
  }

  private focusFirstPanelItem(entry: AerisMegaMenuEntry<T>): void {
    afterNextRender(
      () => {
        this.focusEntry(this.panelFocusableEntries(entry)[0]);
      },
      { injector: this.injector },
    );
  }

  private focusLastPanelItem(entry: AerisMegaMenuEntry<T>): void {
    afterNextRender(
      () => {
        this.focusEntry(this.panelFocusableEntries(entry).at(-1));
      },
      { injector: this.injector },
    );
  }

  private focusEntry(entry: AerisMegaMenuEntry<T> | undefined): void {
    if (!entry) return;
    this.activePathKey.set(entry.pathKey);
    afterNextRender(
      () => {
        this.menuItems()
          .find(
            ({ nativeElement }) =>
              nativeElement.getAttribute('data-aeris-mega-menu-path') === entry.pathKey,
          )
          ?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  private panelFocusableEntries(root = this.openRootEntry()): readonly AerisMegaMenuEntry<T>[] {
    if (!root) return [];
    return root.panelGroups.flatMap((group, groupIndex) =>
      this.flattenPanelItems(group.items, root.path, group, groupIndex, []),
    );
  }

  private flattenPanelItems(
    items: readonly AerisMegaMenuItem<T>[],
    rootPath: readonly number[],
    group: AerisMegaMenuGroup<T>,
    groupIndex: number,
    prefix: readonly number[],
  ): readonly AerisMegaMenuEntry<T>[] {
    return this.visibleItems(items)
      .flatMap((item, index) => {
        if (item.separator) return [];
        const path = this.panelPath(rootPath, groupIndex, index, prefix);
        const entry = this.createEntry(item, path, prefix.length + 1, false);
        return [
          entry,
          ...this.flattenPanelItems(item.items ?? [], rootPath, group, groupIndex, [
            ...prefix,
            index,
          ]),
        ];
      })
      .filter((entry) => !entry.disabled);
  }

  private openRootEntry(): AerisMegaMenuEntry<T> | undefined {
    const index = this.openRootIndex();
    return index == null ? undefined : this.rootEntries()[index];
  }

  private resolveHref(item: AerisMegaMenuItem<T>): string | null {
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

export const AerisMegaMenuModule = [AerisMegaMenu, AerisMegaMenuItemTemplate] as const;
