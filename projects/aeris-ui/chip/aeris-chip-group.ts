import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
import {
  AerisChip,
  type AerisChipRemovingEvent,
  type AerisChipShape,
  type AerisChipSize,
  type AerisChipTone,
  type AerisChipVariant,
} from './aeris-chip';

export type AerisChipGroupSelectionMode = 'none' | 'single' | 'multiple';
export type AerisChipGroupValue = string | readonly string[] | null;
export interface AerisChipGroupItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  /** Overrides the group default for this item. */
  readonly removable?: boolean;
}
export interface AerisChipGroupRemoveEvent {
  readonly originalEvent: Event | null;
  readonly item: AerisChipGroupItem;
}
export interface AerisChipGroupRemovingEvent extends AerisChipGroupRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}
export interface AerisChipGroupChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisChipGroupValue;
}

/** Optional collection companion. Standalone Chip does not own selection or sibling focus. */
@Component({
  selector: 'aeris-chip-group',
  imports: [AerisChip],
  templateUrl: './aeris-chip-group.html',
  styleUrl: './aeris-chip-group.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisChipGroupComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.role]': 'selectionMode() === "none" ? "group" : "toolbar"',
    '[attr.aria-label]': 'ariaLabelledBy() ? null : ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
    '[attr.aria-orientation]': 'selectionMode() === "none" ? null : orientation()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-invalid]': 'displayInvalid() || null',
    '[attr.data-invalid]': 'displayInvalid() || null',
    '[attr.data-orientation]': 'orientation()',
    '[attr.tabindex]': '!isDisabled() && !enabledItems().length ? 0 : null',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class AerisChipGroupComponent
  implements Pick<FormValueControl<AerisChipGroupValue>, 'value'>, ControlValueAccessor
{
  readonly items = model<readonly AerisChipGroupItem[]>([]);
  readonly value = model<AerisChipGroupValue>(null);
  readonly selectionMode = input<AerisChipGroupSelectionMode>('none');
  readonly removable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input('Chips');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly emptyMessage = input('No chips');
  readonly size = input<AerisChipSize>('md');
  readonly variant = input<AerisChipVariant>('soft');
  readonly tone = input<AerisChipTone>('neutral');
  readonly shape = input<AerisChipShape>('pill');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  readonly touch = output<void>();
  readonly changed = output<AerisChipGroupChangeEvent>();
  readonly removing = output<AerisChipGroupRemovingEvent>();
  readonly removed = output<AerisChipGroupRemoveEvent>();

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly chips = viewChildren(AerisChip);
  private readonly choices = viewChildren<ElementRef<HTMLButtonElement>>('choice');
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly displayInvalid = computed(
    () => this.selectionMode() !== 'none' && ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  protected readonly enabledItems = computed(() =>
    this.isDisabled()
      ? []
      : this.items().filter(
          (item) =>
            !item.disabled &&
            (this.selectionMode() !== 'none' || (item.removable ?? this.removable())),
        ),
  );
  private readonly active = signal<string | null>(null);
  private readonly focusedWithin = signal(false);
  private focusedIndex = 0;
  private readonly selectedKeys = computed<ReadonlySet<string>>(() => {
    const value = this.value();
    return new Set(
      this.selectionMode() === 'single' && typeof value === 'string'
        ? [value]
        : this.selectionMode() === 'multiple' && Array.isArray(value)
          ? value
          : [],
    );
  });
  private readonly tabStop = computed(() => {
    const enabled = this.enabledItems();
    return (
      enabled.find((item) => item.id === this.active())?.id ??
      enabled.find((item) => this.selectedKeys().has(item.id))?.id ??
      enabled[0]?.id ??
      null
    );
  });
  protected readonly renderedItems = computed(() =>
    this.items().map((item) => ({
      item,
      disabled: this.isDisabled() || !!item.disabled,
      removable: item.removable ?? this.removable(),
      selected: this.selectedKeys().has(item.id),
      tabIndex: item.id === this.tabStop() ? 0 : -1,
    })),
  );
  private onChange: (value: AerisChipGroupValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    afterRenderEffect(() => {
      // Queries must be read before recovery so newly rendered buttons are ready.
      this.choices();
      this.chips();
      if (!this.focusedWithin() || this.isDisabled()) return;
      const enabled = this.enabledItems();
      if (enabled.some((item) => item.id === this.active())) return;
      const items = this.items();
      const next =
        enabled.find((item) => items.indexOf(item) >= this.focusedIndex) ??
        enabled[enabled.length - 1];
      this.focusKey(next?.id ?? null, { preventScroll: true });
    });
  }

  focus(options?: FocusOptions): void {
    if (!this.isDisabled()) this.focusKey(this.tabStop(), options);
  }
  writeValue(value: AerisChipGroupValue): void {
    this.value.set(value);
  }
  registerOnChange(fn: (value: AerisChipGroupValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected activate(id: string): void {
    if (!this.enabledItems().some((item) => item.id === id)) return;
    this.active.set(id);
    this.focusedIndex = this.items().findIndex((item) => item.id === id);
    this.focusedWithin.set(true);
  }
  protected choose(originalEvent: Event, id: string): void {
    if (this.selectionMode() === 'none' || !this.enabledItems().some((item) => item.id === id))
      return;
    this.activate(id);
    const keys = this.selectedKeys();
    this.commit(
      originalEvent,
      this.selectionMode() === 'single'
        ? keys.has(id)
          ? null
          : id
        : keys.has(id)
          ? [...keys].filter((key) => key !== id)
          : [...keys, id],
    );
  }
  protected requestRemoval(event: AerisChipRemovingEvent, id: string): void {
    const item = this.items().find((item) => item.id === id);
    if (!item || this.isDisabled() || item.disabled) {
      event.preventDefault();
      return;
    }
    this.removing.emit({
      originalEvent: event.originalEvent,
      item,
      get defaultPrevented() {
        return event.defaultPrevented;
      },
      preventDefault: () => event.preventDefault(),
    });
    // A synchronous consumer may disable or remove the item during the request.
    const current = this.items().find((candidate) => candidate.id === id);
    if (
      !current ||
      this.isDisabled() ||
      current.disabled ||
      !(current.removable ?? this.removable())
    )
      event.preventDefault();
  }
  protected removeItem(originalEvent: Event | null, id: string): void {
    const item = this.items().find((item) => item.id === id);
    if (!item || this.isDisabled() || item.disabled) return;
    const previousValue = this.value();
    if (this.selectedKeys().has(id))
      this.commit(
        originalEvent,
        Array.isArray(previousValue) ? previousValue.filter((key) => key !== id) : null,
      );
    this.items.update((items) => items.filter((candidate) => candidate.id !== id));
    this.removed.emit({ originalEvent, item });
  }
  protected onKeydown(event: KeyboardEvent, id: string): void {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      this.isDisabled()
    )
      return;
    const items = this.enabledItems();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const currentIndex = this.items().findIndex((item) => item.id === id);
      const item = this.items()[currentIndex];
      if (item && (item.removable ?? this.removable())) {
        event.preventDefault();
        if (!event.repeat) this.chips()[currentIndex]?.remove(event);
      }
      return;
    }
    const rtl =
      this.document.defaultView?.getComputedStyle(this.element.nativeElement).direction === 'rtl';
    const forward =
      this.orientation() === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward =
      this.orientation() === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === forward
            ? (index + 1) % items.length
            : event.key === backward
              ? (index - 1 + items.length) % items.length
              : null;
    if (next !== null) {
      event.preventDefault();
      this.focusKey(items[next].id);
    }
  }
  protected onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      this.element.nativeElement.contains(event.relatedTarget)
    )
      return;
    // Keep recovery armed when the focused member was removed or disabled by a data update.
    if (
      event.relatedTarget !== null ||
      this.enabledItems().some((item) => item.id === this.active())
    )
      this.focusedWithin.set(false);
    this.onTouched();
    this.touch.emit();
  }
  private focusKey(id: string | null, options?: FocusOptions): void {
    const index = this.items().findIndex((item) => item.id === id);
    if (index < 0 || id === null) {
      this.element.nativeElement.focus(options);
      return;
    }
    this.activate(id);
    if (this.selectionMode() === 'none') this.chips()[index]?.focus(options);
    else this.choices()[index]?.nativeElement.focus(options);
  }
  private commit(originalEvent: Event | null, value: AerisChipGroupValue): void {
    this.value.set(value);
    this.onChange(value);
    this.changed.emit({ originalEvent, value });
  }
}
