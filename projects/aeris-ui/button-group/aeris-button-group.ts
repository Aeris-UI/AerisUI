import {
  Component,
  Directive,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
import { AerisButton, aerisInternalButtonSelection } from '@aeris-ui/core/button';

export type AerisButtonGroupOrientation = 'horizontal' | 'vertical';
export type AerisButtonGroupSelectionMode = 'none' | 'single' | 'multiple';
export type AerisButtonGroupValue = string | readonly string[] | null;

@Component({
  selector: 'aeris-button-group',
  template: '<ng-content />',
  styleUrl: './aeris-button-group.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisButtonGroupComponent),
      multi: true,
    },
  ],
  host: {
    class: 'aeris-button-group',
    '[attr.role]': 'selectionMode() === "single" ? "radiogroup" : "group"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
    '[attr.aria-orientation]': 'selectionMode() === "single" ? orientation() : null',
    '[attr.aria-required]': 'selectionMode() === "single" && required() || null',
    '[attr.aria-disabled]': 'selectionMode() !== "none" && effectiveDisabled() || null',
    '[attr.aria-invalid]': 'displayInvalid() || null',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-responsive]': 'responsive() || null',
    '[attr.data-selection]': 'selectionMode() === "none" ? null : selectionMode()',
    '(focusout)': 'handleFocusOut($event)',
  },
})
export class AerisButtonGroupComponent
  implements Pick<FormValueControl<AerisButtonGroupValue>, 'value'>, ControlValueAccessor
{
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly ariaDescribedBy = input('');
  readonly orientation = input<AerisButtonGroupOrientation>('horizontal');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly responsive = input(false, { transform: booleanAttribute });
  readonly selectionMode = input<AerisButtonGroupSelectionMode>('none');
  readonly value = model<AerisButtonGroupValue>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly allowEmpty = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  readonly touch = output<void>();
  private readonly formDisabled = signal(false);
  /** @internal Shared with selection members. */
  readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly displayInvalid = computed(
    () => this.selectionMode() !== 'none' && ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly items = contentChildren(AerisButtonGroupItem);
  private readonly enabledItems = computed(() =>
    this.items().filter((item) => !item.selectionDisabled()),
  );
  private readonly active = signal<AerisButtonGroupItem | null>(null);
  /** @internal Roving focus target for selection members. */
  readonly tabStop = computed(() => {
    const items = this.enabledItems();
    const active = this.active();
    const selected = items.find((item) => this.isSelected(item.value()));
    if (this.selectionMode() === 'single' && selected) return selected;
    return (active && items.includes(active) ? active : null) ?? selected ?? items[0] ?? null;
  });
  private onChange: (value: AerisButtonGroupValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  /** @internal */
  isSelected(key: string): boolean {
    const value = this.value();
    return this.selectionMode() === 'single'
      ? value === key
      : this.selectionMode() === 'multiple' && Array.isArray(value) && value.includes(key);
  }

  /** @internal */
  activate(item: AerisButtonGroupItem): void {
    if (this.selectionMode() === 'none' || item.selectionDisabled()) return;
    this.active.set(item);
    const key = item.value();
    let next: AerisButtonGroupValue;
    if (this.selectionMode() === 'single') {
      if (this.value() === key && (!this.allowEmpty() || this.required())) return;
      next = this.value() === key ? null : key;
    } else {
      const value = this.value();
      const values: readonly string[] = Array.isArray(value) ? value : [];
      if (this.required() && values.length === 1 && values.includes(key)) return;
      next = values.includes(key) ? values.filter((value) => value !== key) : [...values, key];
    }
    this.updateValue(next);
  }

  /** @internal */
  focusItem(item: AerisButtonGroupItem): void {
    this.active.set(item);
  }

  /** @internal */
  navigate(event: KeyboardEvent, item: AerisButtonGroupItem): void {
    if (
      this.selectionMode() === 'none' ||
      item.selectionDisabled() ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const vertical = this.orientation() === 'vertical';
    const rtl =
      this.element.nativeElement.ownerDocument.defaultView?.getComputedStyle(
        this.element.nativeElement,
      ).direction === 'rtl';
    let delta = 0;
    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) delta = vertical || !rtl ? 1 : -1;
    if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) delta = vertical || !rtl ? -1 : 1;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    const items = this.enabledItems();
    if (!items.length) return;
    event.preventDefault();
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : (items.indexOf(item) + delta + items.length) % items.length;
    const target = items[index];
    if (!target) return;
    this.active.set(target);
    target.focus();
    if (this.selectionMode() === 'single' && !this.isSelected(target.value()))
      this.updateValue(target.value());
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (
      this.selectionMode() === 'none' ||
      (event.relatedTarget instanceof Node &&
        this.element.nativeElement.contains(event.relatedTarget))
    )
      return;
    this.onTouched();
    this.touch.emit();
  }

  focus(options?: FocusOptions): void {
    if (this.selectionMode() !== 'none') this.tabStop()?.focus(options);
  }

  writeValue(value: unknown): void {
    this.value.set(
      typeof value === 'string'
        ? value
        : Array.isArray(value)
          ? [...new Set(value.filter((item): item is string => typeof item === 'string'))]
          : null,
    );
  }
  registerOnChange(fn: (value: AerisButtonGroupValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  private updateValue(value: AerisButtonGroupValue): void {
    this.value.set(value);
    this.onChange(value);
  }
}

/** Selection is opt-in on native buttons, not navigation links or action wrappers. */
@Directive({
  selector: 'button[aerisButton][aerisButtonGroupItem]',
  providers: [
    { provide: aerisInternalButtonSelection, useExisting: forwardRef(() => AerisButtonGroupItem) },
  ],
  host: {
    type: 'button',
    '[attr.role]': 'group.selectionMode() === "single" ? "radio" : null',
    '[attr.aria-checked]': 'group.selectionMode() === "single" ? selected() : null',
    '[attr.aria-pressed]': 'group.selectionMode() === "multiple" ? selected() : null',
    '[attr.data-selected]': 'group.selectionMode() === "none" ? null : selected()',
    '[attr.tabindex]':
      'group.selectionMode() === "none" ? null : group.tabStop() === this ? 0 : -1',
    '(click)': 'activate()',
    '(keydown)': 'group.navigate($event, this)',
    '(focus)': 'group.focusItem(this)',
  },
})
export class AerisButtonGroupItem {
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  protected readonly group = inject(AerisButtonGroupComponent);
  readonly selectionDisabled = computed(
    () =>
      this.disabled() ||
      this.loading() ||
      (this.group.selectionMode() !== 'none' && this.group.effectiveDisabled()),
  );
  protected readonly selected = computed(() => this.group.isSelected(this.value()));
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  protected activate(): void {
    if (!this.element.nativeElement.disabled) this.group.activate(this);
  }
  focus(options?: FocusOptions): void {
    this.element.nativeElement.focus(options);
  }
}

export const AerisButtonGroup = [
  AerisButtonGroupComponent,
  AerisButton,
  AerisButtonGroupItem,
] as const;
