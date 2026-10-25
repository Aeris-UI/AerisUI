import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  DestroyRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵaerisDisplayInvalid,
  filterSelectOptions,
  groupSelectOptions,
  boundarySelectValue,
  nextEnabledSelectValue,
  type AerisSelectOption,
} from '@aeris-ui/core';

export type AerisListboxOption = AerisSelectOption;
export type AerisListboxSelectionMode = 'single' | 'multiple';
export type AerisListboxValue = string | readonly string[] | null;
export interface AerisListboxChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisListboxValue;
  readonly options: readonly AerisListboxOption[];
}
export interface AerisListboxOptionContext {
  readonly $implicit: AerisListboxOption;
  readonly option: AerisListboxOption;
  readonly selected: boolean;
  readonly active: boolean;
}
export interface AerisListboxGroupContext {
  readonly $implicit: string;
  readonly group: string;
}

@Directive({ selector: 'ng-template[aerisListboxOption]' })
export class AerisListboxOptionTemplate {
  readonly template = inject<TemplateRef<AerisListboxOptionContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: AerisListboxOptionTemplate,
    context: unknown,
  ): context is AerisListboxOptionContext {
    return true;
  }
}
@Directive({ selector: 'ng-template[aerisListboxGroup]' })
export class AerisListboxGroupTemplate {
  readonly template = inject<TemplateRef<AerisListboxGroupContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: AerisListboxGroupTemplate,
    context: unknown,
  ): context is AerisListboxGroupContext {
    return true;
  }
}
@Directive({ selector: 'ng-template[aerisListboxEmpty]' })
export class AerisListboxEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}
@Directive({ selector: 'ng-template[aerisListboxLoading]' })
export class AerisListboxLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let nextListboxId = 0;

@Component({
  selector: 'aeris-listbox',
  imports: [NgTemplateOutlet],
  templateUrl: './aeris-listbox.html',
  styleUrl: './aeris-listbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisListboxComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-invalid]': 'displayInvalid() || null',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class AerisListboxComponent implements ControlValueAccessor {
  readonly options = input<readonly AerisListboxOption[]>([]);
  readonly selectionMode = input<AerisListboxSelectionMode>('single');
  readonly value = model<AerisListboxValue>(null);
  readonly filter = input(false, { transform: booleanAttribute });
  readonly query = model('');
  readonly filterPlaceholder = input('Search options');
  readonly filterAriaLabel = input('Filter options');
  readonly emptyMessage = input('No options available');
  readonly loadingMessage = input('Loading options');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledBy = input<string | undefined>(undefined);
  readonly ariaDescribedBy = input<string | undefined>(undefined);
  readonly scrollHeight = input('16rem');
  readonly changed = output<AerisListboxChangeEvent>();
  readonly touch = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formDisabled = signal(false);
  protected readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly optionElements = viewChildren<ElementRef<HTMLElement>>('optionElement');
  protected readonly optionTemplate = contentChild(AerisListboxOptionTemplate);
  protected readonly groupTemplate = contentChild(AerisListboxGroupTemplate);
  protected readonly emptyTemplate = contentChild(AerisListboxEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisListboxLoadingTemplate);
  protected readonly id = `aeris-listbox-${nextListboxId++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  protected readonly filteredOptions = computed(() =>
    filterSelectOptions(
      this.options(),
      this.filter() ? this.query() : '',
      ['label', 'description', 'group'],
      'contains',
    ),
  );
  protected readonly orderedOptions = computed(() =>
    groupSelectOptions(this.filteredOptions()).flatMap((group) => group.options),
  );
  private readonly selectedKeys = computed(() => {
    const value = this.value();
    return new Set(typeof value === 'string' ? [value] : (value ?? []));
  });
  protected readonly activeValue = linkedSignal(() => {
    const options = this.orderedOptions();
    return (
      options.find((option) => !option.disabled && this.selectedKeys().has(option.value))?.value ??
      boundarySelectValue(options, 'start')
    );
  });
  protected readonly groups = computed(() => {
    const selected = this.selectedKeys();
    const active = this.activeValue();
    let index = 0;
    return groupSelectOptions(this.filteredOptions()).map((group, groupIndex) => ({
      ...group,
      id: `${this.id}-group-${groupIndex}`,
      context: { $implicit: group.label ?? '', group: group.label ?? '' },
      items: group.options.map((option) => ({
        option,
        id: `${this.id}-option-${index++}`,
        selected: selected.has(option.value),
        active: active === option.value,
        context: {
          $implicit: option,
          option,
          selected: selected.has(option.value),
          active: active === option.value,
        },
      })),
    }));
  });
  protected readonly activeId = computed(
    () =>
      this.groups()
        .flatMap((group) => group.items)
        .find((item) => item.active)?.id ?? null,
  );
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
  private rangeAnchor: string | null = null;
  private onChange: (value: AerisListboxValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    afterRenderEffect(() => this.revealActive());
    this.destroyRef.onDestroy(() => clearTimeout(this.typeaheadTimer));
  }

  protected revealActive(): void {
    const activeId = this.activeId();
    const list = this.list()?.nativeElement;
    const option = this.optionElements().find(
      (element) => element.nativeElement.id === activeId,
    )?.nativeElement;
    if (!list || !option || list.ownerDocument.activeElement !== list) return;
    // Scroll only the list, never the document or a containing dialog.
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }

  focus(options?: FocusOptions): void {
    if (!this.isDisabled()) this.list()?.nativeElement.focus(options);
  }
  writeValue(value: unknown): void {
    this.value.set(
      typeof value === 'string'
        ? value
        : Array.isArray(value)
          ? value.filter((item): item is string => typeof item === 'string')
          : null,
    );
  }
  registerOnChange(callback: (value: AerisListboxValue) => void): void {
    this.onChange = callback;
  }
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Node &&
      this.host.nativeElement.contains(event.relatedTarget)
    )
      return;
    this.onTouched();
    this.touch.emit();
  }
  protected onFilter(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  protected onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !event.isComposing) {
      event.preventDefault();
      this.focus();
    }
  }
  protected choose(event: Event, option: AerisListboxOption): void {
    if (this.isDisabled() || this.loading() || option.disabled) return;
    this.focus({ preventScroll: true });
    this.activeValue.set(option.value);
    if (this.selectionMode() === 'multiple') {
      if (event instanceof MouseEvent && event.shiftKey) {
        this.selectRange(event, option.value);
        return;
      }
      const values = new Set(this.selectedKeys());
      if (values.has(option.value)) values.delete(option.value);
      else values.add(option.value);
      this.commit(event, [...values]);
    } else this.commit(event, option.value);
    this.rangeAnchor = option.value;
  }
  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.loading() || event.isComposing || event.altKey) return;
    const options = this.orderedOptions();
    let next: string | null | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = nextEnabledSelectValue(options, this.activeValue(), 1);
        break;
      case 'ArrowUp':
        next = nextEnabledSelectValue(options, this.activeValue(), -1);
        break;
      case 'Home':
        next = boundarySelectValue(options, 'start');
        break;
      case 'End':
        next = boundarySelectValue(options, 'end');
        break;
      case ' ':
      case 'Enter': {
        event.preventDefault();
        const option = options.find((option) => option.value === this.activeValue());
        if (option) this.choose(event, option);
        return;
      }
      default: {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'a' &&
          this.selectionMode() === 'multiple'
        ) {
          event.preventDefault();
          const values = new Set(this.selectedKeys());
          const enabled = options.filter((option) => !option.disabled);
          const allSelected = enabled.every((option) => values.has(option.value));
          for (const option of enabled) {
            if (allSelected) values.delete(option.value);
            else values.add(option.value);
          }
          this.commit(event, [...values]);
        } else if (!event.ctrlKey && !event.metaKey && event.key.length === 1) {
          event.preventDefault();
          clearTimeout(this.typeaheadTimer);
          this.typeahead += event.key.toLocaleLowerCase();
          this.typeaheadTimer = setTimeout(() => {
            this.typeahead = '';
          }, 500);
          const query = [...this.typeahead].every((character) => character === this.typeahead[0])
            ? event.key.toLocaleLowerCase()
            : this.typeahead;
          const start = options.findIndex((option) => option.value === this.activeValue());
          const rotated = [...options.slice(start + 1), ...options.slice(0, start + 1)];
          next = rotated.find(
            (option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(query),
          )?.value;
        }
      }
    }
    if (next !== null && next !== undefined) {
      event.preventDefault();
      const previous = this.activeValue();
      this.activeValue.set(next);
      if (event.shiftKey && this.selectionMode() === 'multiple') {
        this.rangeAnchor ??= previous;
        this.selectRange(event, next);
      }
    }
  }
  private selectRange(event: Event, end: string): void {
    const options = this.orderedOptions();
    const startIndex = options.findIndex((option) => option.value === (this.rangeAnchor ?? end));
    const endIndex = options.findIndex((option) => option.value === end);
    const start = startIndex < 0 ? endIndex : startIndex;
    const enabled = new Set(
      options.filter((option) => !option.disabled).map((option) => option.value),
    );
    const retained = [...this.selectedKeys()].filter((value) => !enabled.has(value));
    this.commit(event, [
      ...retained,
      ...options
        .slice(Math.min(start, endIndex), Math.max(start, endIndex) + 1)
        .filter((option) => !option.disabled)
        .map((option) => option.value),
    ]);
  }
  private commit(originalEvent: Event, value: AerisListboxValue): void {
    const active = this.activeValue();
    this.value.set(value);
    this.activeValue.set(active);
    this.onChange(value);
    this.changed.emit({
      originalEvent,
      value,
      options: this.options().filter((option) => this.selectedKeys().has(option.value)),
    });
  }
}

export const AerisListbox = [
  AerisListboxComponent,
  AerisListboxOptionTemplate,
  AerisListboxGroupTemplate,
  AerisListboxEmptyTemplate,
  AerisListboxLoadingTemplate,
] as const;
