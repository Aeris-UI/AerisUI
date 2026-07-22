import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
} from '@angular/core';

export type AerisOrderListItem = object;

export interface AerisOrderListReorderEvent<TItem = AerisOrderListItem> {
  readonly items: readonly TItem[];
  readonly selectedKeys: readonly string[];
}

export interface AerisOrderListSelectionEvent<TItem = AerisOrderListItem> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly selectedItems: readonly TItem[];
}

interface AerisOrderListItemContext<TItem = AerisOrderListItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly selected: boolean;
  readonly index: number;
}

@Directive({ selector: 'ng-template[aerisOrderListItem]' })
export class AerisOrderListItemTemplate<TItem = AerisOrderListItem> {
  readonly template = inject<TemplateRef<AerisOrderListItemContext<TItem>>>(TemplateRef);

  static ngTemplateContextGuard<TItem>(
    _directive: AerisOrderListItemTemplate<TItem>,
    context: unknown,
  ): context is AerisOrderListItemContext<TItem> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisOrderListEmpty]' })
export class AerisOrderListEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Component({
  selector: 'aeris-order-list',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-order-list"
      [attr.data-fluid]="fluid() || null"
      [attr.data-disabled]="disabled() || null"
    >
      @if (header()) {
        <div class="aeris-order-list__header">{{ header() }}</div>
      }

      <div class="aeris-order-list__body">
        @if (showControls()) {
          <div class="aeris-order-list__controls" aria-label="Reorder controls">
            <button type="button" [disabled]="!canMoveUp()" [attr.aria-label]="moveTopAriaLabel()" (click)="moveSelectedToTop()">
              <span aria-hidden="true" data-icon="top"></span>
            </button>
            <button type="button" [disabled]="!canMoveUp()" [attr.aria-label]="moveUpAriaLabel()" (click)="moveSelectedUp()">
              <span aria-hidden="true" data-icon="up"></span>
            </button>
            <button type="button" [disabled]="!canMoveDown()" [attr.aria-label]="moveDownAriaLabel()" (click)="moveSelectedDown()">
              <span aria-hidden="true" data-icon="down"></span>
            </button>
            <button type="button" [disabled]="!canMoveDown()" [attr.aria-label]="moveBottomAriaLabel()" (click)="moveSelectedToBottom()">
              <span aria-hidden="true" data-icon="bottom"></span>
            </button>
          </div>
        }

        <div
          class="aeris-order-list__viewport"
          role="listbox"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-multiselectable]="multiple() || null"
          [attr.tabindex]="disabled() ? null : 0"
          (keydown)="handleListKeydown($event)"
        >
          @if (items().length) {
            @for (item of items(); track itemKey(item, $index); let index = $index) {
              <button
                class="aeris-order-list__item"
                type="button"
                role="option"
                [attr.aria-selected]="isSelected(itemKey(item, index))"
                [attr.data-selected]="isSelected(itemKey(item, index)) || null"
                [disabled]="disabled()"
                (click)="toggleItem(item, index, $event)"
              >
                @if (itemTemplate(); as customItem) {
                  <ng-container
                    [ngTemplateOutlet]="customItem.template"
                    [ngTemplateOutletContext]="{
                      $implicit: item,
                      item,
                      selected: isSelected(itemKey(item, index)),
                      index
                    }"
                  />
                } @else {
                  <span>{{ itemLabel(item) }}</span>
                }
              </button>
            }
          } @else {
            <div class="aeris-order-list__empty" role="status">
              @if (emptyTemplate(); as customEmpty) {
                <ng-container [ngTemplateOutlet]="customEmpty.template" />
              } @else {
                {{ emptyMessage() }}
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './aeris-order-list.scss',
})
export class AerisOrderList<TItem extends AerisOrderListItem = AerisOrderListItem> {
  readonly items = model<readonly TItem[]>([]);
  readonly selectedKeys = model<readonly string[]>([]);
  readonly optionLabel = input('label');
  readonly dataKey = input('id');
  readonly header = input('');
  readonly emptyMessage = input('No items available');
  readonly ariaLabel = input('Ordered list');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly showControls = input(true, { transform: booleanAttribute });
  readonly moveTopAriaLabel = input('Move selected items to top');
  readonly moveUpAriaLabel = input('Move selected items up');
  readonly moveDownAriaLabel = input('Move selected items down');
  readonly moveBottomAriaLabel = input('Move selected items to bottom');

  readonly selectionChanged = output<AerisOrderListSelectionEvent<TItem>>();
  readonly reordered = output<AerisOrderListReorderEvent<TItem>>();

  protected readonly itemTemplate = contentChild(AerisOrderListItemTemplate<TItem>);
  protected readonly emptyTemplate = contentChild(AerisOrderListEmptyTemplate);

  protected readonly selectedIndexes = computed(() =>
    this.items()
      .map((item, index) => ({ key: this.itemKey(item, index), index }))
      .filter((entry) => this.selectedKeys().includes(entry.key))
      .map((entry) => entry.index),
  );

  protected readonly canMoveUp = computed(() => {
    if (this.disabled()) return false;
    const indexes = this.selectedIndexes();
    return indexes.length > 0 && Math.min(...indexes) > 0;
  });

  protected readonly canMoveDown = computed(() => {
    if (this.disabled()) return false;
    const indexes = this.selectedIndexes();
    return indexes.length > 0 && Math.max(...indexes) < this.items().length - 1;
  });

  protected itemKey(item: TItem, index: number): string {
    const value = this.propertyValue(item, this.dataKey());
    return value == null ? String(index) : String(value);
  }

  protected itemLabel(item: TItem): string {
    const value = this.propertyValue(item, this.optionLabel());
    return value == null ? '' : String(value);
  }

  protected isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  protected toggleItem(item: TItem, index: number, originalEvent: Event): void {
    if (this.disabled()) return;
    const key = this.itemKey(item, index);
    const next = this.multiple()
      ? this.isSelected(key)
        ? this.selectedKeys().filter((selectedKey) => selectedKey !== key)
        : [...this.selectedKeys(), key]
      : this.isSelected(key)
        ? []
        : [key];
    this.selectedKeys.set(next);
    this.emitSelection(originalEvent);
  }

  protected handleListKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.altKey && event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveSelectedUp();
    } else if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveSelectedDown();
    } else if (event.altKey && event.key === 'Home') {
      event.preventDefault();
      this.moveSelectedToTop();
    } else if (event.altKey && event.key === 'End') {
      event.preventDefault();
      this.moveSelectedToBottom();
    }
  }

  moveSelectedUp(): void {
    if (!this.canMoveUp()) return;
    this.reorder(-1);
  }

  moveSelectedDown(): void {
    if (!this.canMoveDown()) return;
    this.reorder(1);
  }

  moveSelectedToTop(): void {
    if (!this.canMoveUp()) return;
    const keys = new Set(this.selectedKeys());
    const selected = this.items().filter((item, index) => keys.has(this.itemKey(item, index)));
    const unselected = this.items().filter((item, index) => !keys.has(this.itemKey(item, index)));
    this.setReorderedItems([...selected, ...unselected]);
  }

  moveSelectedToBottom(): void {
    if (!this.canMoveDown()) return;
    const keys = new Set(this.selectedKeys());
    const selected = this.items().filter((item, index) => keys.has(this.itemKey(item, index)));
    const unselected = this.items().filter((item, index) => !keys.has(this.itemKey(item, index)));
    this.setReorderedItems([...unselected, ...selected]);
  }

  private reorder(direction: -1 | 1): void {
    const keys = new Set(this.selectedKeys());
    const next = [...this.items()];
    const indexes =
      direction === -1
        ? this.selectedIndexes()
        : [...this.selectedIndexes()].sort((left, right) => right - left);

    for (const index of indexes) {
      const target = index + direction;
      if (target < 0 || target >= next.length) continue;
      if (keys.has(this.itemKey(next[target], target))) continue;
      [next[index], next[target]] = [next[target], next[index]];
    }

    this.setReorderedItems(next);
  }

  private setReorderedItems(items: readonly TItem[]): void {
    this.items.set(items);
    this.reordered.emit({
      items,
      selectedKeys: this.selectedKeys(),
    });
  }

  private emitSelection(originalEvent: Event): void {
    const keys = new Set(this.selectedKeys());
    this.selectionChanged.emit({
      originalEvent,
      selectedKeys: this.selectedKeys(),
      selectedItems: this.items().filter((item, index) => keys.has(this.itemKey(item, index))),
    });
  }

  private propertyValue(item: TItem, property: string): unknown {
    return Object.prototype.hasOwnProperty.call(item, property)
      ? (item as Record<string, unknown>)[property]
      : undefined;
  }
}

export const AerisOrderListModule = [
  AerisOrderList,
  AerisOrderListItemTemplate,
  AerisOrderListEmptyTemplate,
] as const;
