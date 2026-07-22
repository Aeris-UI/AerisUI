import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';

export type AerisBreadcrumbVariant = 'outlined' | 'filled' | 'plain';
export type AerisBreadcrumbSize = 'sm' | 'md' | 'lg';
export type AerisBreadcrumbAriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true';

export interface AerisBreadcrumbItem {
  readonly label?: string;
  readonly icon?: string;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly disabled?: boolean;
  readonly current?: boolean;
  readonly data?: unknown;
}

export interface AerisBreadcrumbItemEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
}

export interface AerisBreadcrumbEllipsisEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}

export interface AerisBreadcrumbItemTemplateContext {
  readonly $implicit: AerisBreadcrumbItem;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
  readonly disabled: boolean;
}

export interface AerisBreadcrumbSeparatorTemplateContext {
  readonly index: number;
  readonly item: AerisBreadcrumbItem;
  readonly nextItem: AerisBreadcrumbItem | null;
}

export interface AerisBreadcrumbEllipsisTemplateContext {
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}

interface AerisBreadcrumbEntry {
  readonly key: string;
  readonly kind: 'item' | 'ellipsis';
  readonly item: AerisBreadcrumbItem | null;
  readonly index: number;
  readonly current: boolean;
  readonly disabled: boolean;
  readonly accessibleLabel: string;
  readonly nextItem: AerisBreadcrumbItem | null;
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}

@Directive({ selector: 'ng-template[aerisBreadcrumbItem]' })
export class AerisBreadcrumbItemTemplate {
  readonly template = inject<TemplateRef<AerisBreadcrumbItemTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisBreadcrumbSeparator]' })
export class AerisBreadcrumbSeparatorTemplate {
  readonly template = inject<TemplateRef<AerisBreadcrumbSeparatorTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisBreadcrumbEllipsis]' })
export class AerisBreadcrumbEllipsisTemplate {
  readonly template = inject<TemplateRef<AerisBreadcrumbEllipsisTemplateContext>>(TemplateRef);
}

let nextBreadcrumbId = 0;

@Component({
  selector: 'aeris-breadcrumb',
  imports: [NgTemplateOutlet],
  template: `
    <nav
      class="aeris-breadcrumb__nav"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-describedby]="ariaDescribedBy() || null"
    >
      <ol class="aeris-breadcrumb__list">
        @for (entry of visibleEntries(); track entry.key; let last = $last) {
          <li class="aeris-breadcrumb__list-item" [attr.data-current]="entry.current || null">
            @if (entry.kind === 'ellipsis') {
              <button
                class="aeris-breadcrumb__item aeris-breadcrumb__item--ellipsis"
                type="button"
                [attr.aria-label]="ellipsisLabel()"
                (click)="handleEllipsisClick($event, entry.hiddenItems)"
              >
                @if (ellipsisTemplate(); as template) {
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="{ hiddenItems: entry.hiddenItems }"
                  />
                } @else {
                  <span aria-hidden="true">…</span>
                }
              </button>
            } @else if (entry.item; as item) {
              @if (itemTemplate(); as template) {
                <span
                  class="aeris-breadcrumb__item aeris-breadcrumb__item--custom"
                  [attr.aria-label]="entry.accessibleLabel || null"
                  [attr.aria-current]="entry.current ? ariaCurrent() : null"
                  [attr.aria-disabled]="entry.disabled || null"
                >
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="{
                      $implicit: item,
                      item,
                      index: entry.index,
                      current: entry.current,
                      disabled: entry.disabled
                    }"
                  />
                </span>
              } @else if (entry.current || entry.disabled) {
                <span
                  class="aeris-breadcrumb__item"
                  [attr.aria-label]="entry.accessibleLabel || null"
                  [attr.aria-current]="entry.current ? ariaCurrent() : null"
                  [attr.aria-disabled]="entry.disabled || null"
                >
                  @if (item.icon) {
                    <span class="aeris-breadcrumb__item-icon" aria-hidden="true">{{ item.icon }}</span>
                  }
                  @if (item.label) {
                    <span>{{ item.label }}</span>
                  }
                </span>
              } @else if (item.href) {
                <a
                  class="aeris-breadcrumb__item"
                  [href]="item.href"
                  [target]="item.target || null"
                  [rel]="item.rel || (item.target === '_blank' ? 'noopener noreferrer' : null)"
                  [attr.aria-label]="entry.accessibleLabel || null"
                  (click)="handleItemClick($event, item, entry.index, entry.current)"
                >
                  @if (item.icon) {
                    <span class="aeris-breadcrumb__item-icon" aria-hidden="true">{{ item.icon }}</span>
                  }
                  @if (item.label) {
                    <span>{{ item.label }}</span>
                  }
                </a>
              } @else {
                <button
                  class="aeris-breadcrumb__item"
                  type="button"
                  [attr.aria-label]="entry.accessibleLabel || null"
                  (click)="handleItemClick($event, item, entry.index, entry.current)"
                >
                  @if (item.icon) {
                    <span class="aeris-breadcrumb__item-icon" aria-hidden="true">{{ item.icon }}</span>
                  }
                  @if (item.label) {
                    <span>{{ item.label }}</span>
                  }
                </button>
              }
            }

            @if (!last && entry.item; as item) {
              <span class="aeris-breadcrumb__separator" aria-hidden="true">
                @if (separatorTemplate(); as template) {
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="{
                      index: entry.index,
                      item,
                      nextItem: entry.nextItem
                    }"
                  />
                } @else if (separator()) {
                  {{ separator() }}
                } @else {
                  <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                    <path d="m7.5 4.5 5 5.5-5 5.5" />
                  </svg>
                }
              </span>
            } @else if (!last) {
              <span class="aeris-breadcrumb__separator" aria-hidden="true">
                @if (separator()) {
                  {{ separator() }}
                } @else {
                  <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                    <path d="m7.5 4.5 5 5.5-5 5.5" />
                  </svg>
                }
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './aeris-breadcrumb.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-breadcrumb',
    '[attr.id]': 'id()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-wrap]': 'wrap()',
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisBreadcrumb {
  private readonly instanceId = ++nextBreadcrumbId;

  readonly id = input(`aeris-breadcrumb-${this.instanceId}`);
  readonly items = input<readonly AerisBreadcrumbItem[]>([]);
  readonly home = input<AerisBreadcrumbItem | null>(null);
  readonly variant = input<AerisBreadcrumbVariant>('outlined');
  readonly size = input<AerisBreadcrumbSize>('md');
  readonly separator = input('');
  readonly maxItems = input<number | null>(null, { transform: nullableNumberAttribute });
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Breadcrumb');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly ariaCurrent = input<AerisBreadcrumbAriaCurrent>('page');
  readonly ellipsisLabel = input('Show hidden breadcrumb items');

  readonly itemSelected = output<AerisBreadcrumbItemEvent>();
  readonly ellipsisSelected = output<AerisBreadcrumbEllipsisEvent>();

  protected readonly itemTemplate = contentChild(AerisBreadcrumbItemTemplate, {
    descendants: false,
  });
  protected readonly separatorTemplate = contentChild(AerisBreadcrumbSeparatorTemplate, {
    descendants: false,
  });
  protected readonly ellipsisTemplate = contentChild(AerisBreadcrumbEllipsisTemplate, {
    descendants: false,
  });
  protected readonly allItems = computed(() => {
    const home = this.home();
    return home ? [home, ...this.items()] : [...this.items()];
  });
  protected readonly visibleEntries = computed(() => this.buildEntries(this.allItems()));

  protected handleItemClick(
    event: MouseEvent | KeyboardEvent,
    item: AerisBreadcrumbItem,
    index: number,
    current: boolean,
  ): void {
    if (item.disabled || current) {
      event.preventDefault();
      return;
    }

    this.itemSelected.emit({ originalEvent: event, item, index, current });
  }

  protected handleEllipsisClick(event: MouseEvent, hiddenItems: readonly AerisBreadcrumbItem[]): void {
    this.ellipsisSelected.emit({ originalEvent: event, hiddenItems });
  }

  private buildEntries(items: readonly AerisBreadcrumbItem[]): readonly AerisBreadcrumbEntry[] {
    const currentIndex = this.currentIndex(items);
    const visible = this.visibleIndexes(items);
    const hiddenItems = items.filter((_, index) => !visible.has(index));
    const entries: AerisBreadcrumbEntry[] = [];

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (!item || !visible.has(index)) {
        if (hiddenItems.length > 0 && entries.at(-1)?.kind !== 'ellipsis') {
          entries.push({
            key: 'ellipsis',
            kind: 'ellipsis',
            item: null,
            index: -1,
            current: false,
            disabled: false,
            accessibleLabel: '',
            nextItem: item,
            hiddenItems,
          });
        }
        continue;
      }

      const accessibleLabel = item.ariaLabel ?? item.label ?? item.icon ?? '';

      entries.push({
        key: `${index}-${accessibleLabel || 'item'}`,
        kind: 'item',
        item,
        index,
        current: index === currentIndex,
        disabled: !!item.disabled,
        accessibleLabel,
        nextItem: this.nextVisibleItem(items, visible, index),
        hiddenItems: [],
      });
    }

    return entries;
  }

  private visibleIndexes(items: readonly AerisBreadcrumbItem[]): ReadonlySet<number> {
    const maxItems = this.maxItems();
    if (!maxItems || maxItems < 3 || items.length <= maxItems) {
      return new Set(items.map((_, index) => index));
    }

    const visible = new Set<number>([0]);
    const tailCount = Math.max(1, maxItems - 2);
    for (let index = Math.max(1, items.length - tailCount); index < items.length; index += 1) {
      visible.add(index);
    }
    return visible;
  }

  private currentIndex(items: readonly AerisBreadcrumbItem[]): number {
    const explicitIndex = items.findIndex((item) => item.current);
    return explicitIndex >= 0 ? explicitIndex : Math.max(0, items.length - 1);
  }

  private nextVisibleItem(
    items: readonly AerisBreadcrumbItem[],
    visible: ReadonlySet<number>,
    currentIndex: number,
  ): AerisBreadcrumbItem | null {
    for (let index = currentIndex + 1; index < items.length; index += 1) {
      if (visible.has(index)) return items[index] ?? null;
    }
    return null;
  }
}

function nullableNumberAttribute(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = numberAttribute(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export const AerisBreadcrumbModule = [
  AerisBreadcrumb,
  AerisBreadcrumbItemTemplate,
  AerisBreadcrumbSeparatorTemplate,
  AerisBreadcrumbEllipsisTemplate,
] as const;
