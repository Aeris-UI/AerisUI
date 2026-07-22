import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  boundarySelectValue,
  filterSelectOptions,
  groupSelectOptions,
  nextEnabledSelectValue,
  selectVirtualRange,
  type AerisSelectFilterMatchMode,
  type AerisSelectOption,
  type AerisSelectOptionGroup,
} from '@aeris-ui/core';

export type AerisMultiSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisMultiSelectAppearance = 'outline' | 'filled';
export type AerisMultiSelectDisplay = 'summary' | 'chips';

export interface AerisMultiSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: readonly string[];
  readonly option: AerisSelectOption | null;
  readonly selected: boolean;
}

export interface AerisMultiSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

export interface AerisMultiSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}

interface MultiSelectOptionContext {
  readonly $implicit: AerisSelectOption;
  readonly option: AerisSelectOption;
  readonly selected: boolean;
  readonly active: boolean;
}

interface MultiSelectChipContext {
  readonly $implicit: AerisSelectOption;
  readonly option: AerisSelectOption;
  readonly remove: () => void;
}

@Directive({ selector: 'ng-template[aerisMultiSelectOption]' })
export class AerisMultiSelectOptionTemplate {
  readonly template = inject<TemplateRef<MultiSelectOptionContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMultiSelectChip]' })
export class AerisMultiSelectChipTemplate {
  readonly template = inject<TemplateRef<MultiSelectChipContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMultiSelectHeader]' })
export class AerisMultiSelectHeaderTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMultiSelectFooter]' })
export class AerisMultiSelectFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMultiSelectEmpty]' })
export class AerisMultiSelectEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let multiSelectId = 0;

@Component({
  selector: 'aeris-multi-select',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-multi-select"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="open() || null"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name() && value().length) {
        <input type="hidden" [name]="name()" [value]="value().join(valueSeparator())" />
      }

      <div class="aeris-multi-select__control">
        <div
          #trigger
          class="aeris-multi-select__trigger"
          role="combobox"
          aria-haspopup="listbox"
          [attr.tabindex]="effectiveDisabled() ? -1 : 0"
          [id]="resolvedInputId()"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          [attr.aria-activedescendant]="open() ? activeOptionId() : null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="ariaDescribedby() || null"
          [attr.aria-invalid]="invalid() || null"
          [attr.aria-required]="required() || null"
          [attr.aria-disabled]="effectiveDisabled() || null"
          (click)="toggle()"
          (keydown)="handleTriggerKeydown($event)"
          (focus)="focused.emit($event)"
        >
          @if (!selectedOptions().length) {
            <span class="aeris-multi-select__placeholder">{{ placeholder() }}</span>
          } @else if (display() === 'chips') {
            <span class="aeris-multi-select__chips">
              @for (option of visibleSelectedOptions(); track option.value) {
                <span class="aeris-multi-select__chip">
                  @if (chipTemplate(); as chip) {
                    <ng-container
                      [ngTemplateOutlet]="chip.template"
                      [ngTemplateOutletContext]="{
                        $implicit: option,
                        option,
                        remove: removeCallback(option),
                      }"
                    />
                  } @else {
                    <span>{{ option.label }}</span>
                  }
                  <button
                    class="aeris-multi-select__chip-remove"
                    type="button"
                    [attr.aria-label]="'Remove ' + option.label"
                    [disabled]="effectiveDisabled()"
                    (click)="removeChip(option, $event)"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                </span>
              }
              @if (hiddenSelectedCount() > 0) {
                <span class="aeris-multi-select__chip aeris-multi-select__chip--count">
                  +{{ hiddenSelectedCount() }}
                </span>
              }
            </span>
          } @else {
            <span class="aeris-multi-select__summary">{{ selectionSummary() }}</span>
          }
        </div>

        @if (showClearButton()) {
          <button
            class="aeris-multi-select__clear"
            type="button"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="handleClearClick($event)"
          >
            <span aria-hidden="true"></span>
          </button>
        }
        <span class="aeris-multi-select__chevron" aria-hidden="true"></span>
      </div>

      @if (open()) {
        <button
          class="aeris-multi-select__dismiss"
          type="button"
          tabindex="-1"
          aria-label="Close options"
          (click)="closePanel(true)"
        ></button>

        <div
          class="aeris-multi-select__panel"
          [id]="panelId"
          [style.--aeris-multi-select-panel-max-height]="panelMaxHeight()"
        >
          @if (headerTemplate(); as header) {
            <div class="aeris-multi-select__header">
              <ng-container [ngTemplateOutlet]="header.template" />
            </div>
          }

          @if (showSelectAll()) {
            <button
              class="aeris-multi-select__select-all"
              type="button"
              [disabled]="selectAllDisabled()"
              [attr.aria-pressed]="allFilteredSelected()"
              (click)="toggleSelectAll($event)"
            >
              <span
                class="aeris-multi-select__checkbox"
                [attr.data-checked]="allFilteredSelected() || null"
                [attr.data-mixed]="someFilteredSelected() || null"
                aria-hidden="true"
                ><span></span
              ></span>
              <span>{{ selectAllLabel() }}</span>
              <small>{{ selectedOptions().length }}/{{ selectableOptions().length }}</small>
            </button>
          }

          @if (filter()) {
            <div class="aeris-multi-select__filter-wrap">
              <span class="aeris-multi-select__search-mark" aria-hidden="true"></span>
              <input
                #filterInput
                class="aeris-multi-select__filter"
                type="search"
                role="searchbox"
                autocomplete="off"
                [value]="filterValue()"
                [placeholder]="filterPlaceholder()"
                [attr.aria-label]="filterAriaLabel()"
                [attr.aria-controls]="listboxId"
                [attr.aria-activedescendant]="activeOptionId()"
                (input)="handleFilterInput($event)"
                (keydown)="handleFilterKeydown($event)"
              />
              @if (filterValue()) {
                <button
                  class="aeris-multi-select__filter-clear"
                  type="button"
                  [attr.aria-label]="filterClearAriaLabel()"
                  (click)="clearFilter()"
                >
                  <span aria-hidden="true"></span>
                </button>
              }
            </div>
          }

          <div
            class="aeris-multi-select__list"
            [id]="listboxId"
            role="listbox"
            aria-multiselectable="true"
            [attr.aria-label]="listboxAriaLabel()"
            [attr.aria-busy]="loading() || null"
            (scroll)="handleListScroll($event)"
          >
            @if (loading()) {
              <div class="aeris-multi-select__message" role="status">
                <span class="aeris-multi-select__spinner" aria-hidden="true"></span>
                {{ loadingMessage() }}
              </div>
            } @else if (!filteredOptions().length) {
              <div class="aeris-multi-select__message" role="status">
                @if (emptyTemplate(); as empty) {
                  <ng-container [ngTemplateOutlet]="empty.template" />
                } @else {
                  {{ filterValue() ? emptyFilterMessage() : emptyMessage() }}
                }
              </div>
            } @else {
              <div
                [style.padding-top.px]="virtualTopPadding()"
                [style.padding-bottom.px]="virtualBottomPadding()"
              >
                @for (group of renderedGroups(); track group.label ?? 'ungrouped') {
                  @if (group.label) {
                    <div class="aeris-multi-select__group">{{ group.label }}</div>
                  }
                  @for (option of group.options; track option.value) {
                    <div
                      class="aeris-multi-select__option"
                      role="option"
                      [id]="optionId(option)"
                      [attr.aria-selected]="isSelected(option)"
                      [attr.aria-disabled]="optionUnavailable(option) || null"
                      [attr.data-active]="activeValue() === option.value || null"
                      [attr.data-selected]="isSelected(option) || null"
                      [attr.data-disabled]="optionUnavailable(option) || null"
                      (mouseenter)="activate(option)"
                      (mousedown)="$event.preventDefault()"
                      (click)="toggleOption(option, $event)"
                    >
                      <span
                        class="aeris-multi-select__checkbox"
                        [attr.data-checked]="isSelected(option) || null"
                        aria-hidden="true"
                        ><span></span
                      ></span>
                      <span class="aeris-multi-select__option-content">
                        @if (optionTemplate(); as customOption) {
                          <ng-container
                            [ngTemplateOutlet]="customOption.template"
                            [ngTemplateOutletContext]="{
                              $implicit: option,
                              option,
                              selected: isSelected(option),
                              active: activeValue() === option.value,
                            }"
                          />
                        } @else {
                          <span>{{ option.label }}</span>
                          @if (option.description) {
                            <small>{{ option.description }}</small>
                          }
                        }
                      </span>
                    </div>
                  }
                }
              </div>
            }
          </div>

          @if (selectionLimitReached()) {
            <div class="aeris-multi-select__limit" role="status">
              {{ selectionLimitMessage() }}
            </div>
          }
          @if (footerTemplate(); as footer) {
            <div class="aeris-multi-select__footer">
              <ng-container [ngTemplateOutlet]="footer.template" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-multi-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisMultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisMultiSelectComponent implements ControlValueAccessor {
  readonly options = input.required<readonly AerisSelectOption[]>();
  readonly value = model<readonly string[]>([]);
  readonly inputId = input('');
  readonly name = input('');
  readonly valueSeparator = input(',');
  readonly placeholder = input('Select options');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly listboxAriaLabel = input('Options');
  readonly size = input<AerisMultiSelectSize>('md');
  readonly appearance = input<AerisMultiSelectAppearance>('outline');
  readonly display = input<AerisMultiSelectDisplay>('summary');
  readonly selectedItemsLabel = input('{0} items selected');
  readonly maxSelectedLabels = input(3, { transform: numberAttribute });
  readonly selectionLimit = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });
  readonly selectionLimitMessage = input('Selection limit reached');
  readonly showSelectAll = input(true, { transform: booleanAttribute });
  readonly selectAllLabel = input('Select all');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear selections');
  readonly filter = input(false, { transform: booleanAttribute });
  readonly filterValue = model('');
  readonly filterMatchMode = input<AerisSelectFilterMatchMode>('contains');
  readonly filterFields = input<readonly ('label' | 'description' | 'group')[]>(['label']);
  readonly filterLocale = input<string>();
  readonly filterPlaceholder = input('Search options');
  readonly filterAriaLabel = input('Search options');
  readonly filterClearAriaLabel = input('Clear search');
  readonly resetFilterOnClose = input(true, { transform: booleanAttribute });
  readonly autofocusFilter = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input('No options available');
  readonly emptyFilterMessage = input('No matching options');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading options');
  readonly panelMaxHeight = input('18rem');
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly virtualItemSize = input(40, { transform: numberAttribute });
  readonly virtualBuffer = input(4, { transform: numberAttribute });
  readonly lazy = input(false, { transform: booleanAttribute });
  readonly closeOnSelect = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<readonly string[]>();
  readonly changed = output<AerisMultiSelectChangeEvent>();
  readonly filterChanged = output<AerisMultiSelectFilterEvent>();
  readonly lazyLoad = output<AerisMultiSelectLazyLoadEvent>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly open = signal(false);
  protected readonly activeValue = signal<string | null>(null);
  protected readonly virtualStart = signal(0);
  protected readonly formDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly selectedOptions = computed(() => {
    const values = new Set(this.value());
    return this.options().filter((option) => values.has(option.value));
  });
  protected readonly visibleSelectedOptions = computed(() =>
    this.selectedOptions().slice(0, Math.max(0, this.maxSelectedLabels())),
  );
  protected readonly hiddenSelectedCount = computed(() =>
    Math.max(0, this.selectedOptions().length - this.visibleSelectedOptions().length),
  );
  protected readonly selectionSummary = computed(() => {
    const selected = this.selectedOptions();
    if (selected.length <= Math.max(1, this.maxSelectedLabels())) {
      return selected.map((option) => option.label).join(', ');
    }
    return this.selectedItemsLabel().replace('{0}', String(selected.length));
  });
  protected readonly filteredOptions = computed(() =>
    filterSelectOptions(
      this.options(),
      this.filterValue(),
      this.filterFields(),
      this.filterMatchMode(),
      this.filterLocale(),
    ),
  );
  protected readonly groupedOptions = computed(() => groupSelectOptions(this.filteredOptions()));
  protected readonly virtualRange = computed(() =>
    selectVirtualRange(
      this.filteredOptions().length,
      this.virtualStart(),
      this.panelMaxHeight(),
      this.virtualItemSize(),
      this.virtualBuffer(),
    ),
  );
  protected readonly renderedOptions = computed(() => {
    if (!this.virtualScroll()) return this.filteredOptions();
    const range = this.virtualRange();
    return this.filteredOptions().slice(range.start, range.end);
  });
  protected readonly renderedGroups = computed<readonly AerisSelectOptionGroup[]>(() =>
    this.virtualScroll()
      ? [{ label: null, options: this.renderedOptions() }]
      : this.groupedOptions(),
  );
  protected readonly virtualTopPadding = computed(() =>
    this.virtualScroll() ? this.virtualRange().topPadding : 0,
  );
  protected readonly virtualBottomPadding = computed(() =>
    this.virtualScroll() ? this.virtualRange().bottomPadding : 0,
  );
  protected readonly selectableOptions = computed(() =>
    this.options().filter((option) => !option.disabled),
  );
  protected readonly filteredSelectableOptions = computed(() =>
    this.filteredOptions().filter((option) => !option.disabled),
  );
  protected readonly allFilteredSelected = computed(() => {
    const values = new Set(this.value());
    const options = this.filteredSelectableOptions();
    return options.length > 0 && options.every((option) => values.has(option.value));
  });
  protected readonly someFilteredSelected = computed(() => {
    const values = new Set(this.value());
    const count = this.filteredSelectableOptions().filter((option) =>
      values.has(option.value),
    ).length;
    return count > 0 && count < this.filteredSelectableOptions().length;
  });
  protected readonly selectionLimitReached = computed(() => {
    const limit = this.selectionLimit();
    return limit !== undefined && this.value().length >= limit;
  });
  protected readonly selectAllDisabled = computed(
    () =>
      !this.allFilteredSelected() &&
      this.filteredSelectableOptions().every((option) => this.optionUnavailable(option)),
  );
  protected readonly showClearButton = computed(
    () => this.clearable() && this.value().length > 0 && !this.effectiveDisabled(),
  );
  protected readonly activeOptionId = computed(() => {
    const option = this.options().find((candidate) => candidate.value === this.activeValue());
    return option ? this.optionId(option) : null;
  });

  protected readonly panelId = `aeris-multi-select-panel-${++multiSelectId}`;
  protected readonly listboxId = `${this.panelId}-listbox`;
  protected readonly resolvedInputId = computed(() => this.inputId() || `${this.panelId}-trigger`);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  protected readonly optionTemplate = contentChild(AerisMultiSelectOptionTemplate);
  protected readonly chipTemplate = contentChild(AerisMultiSelectChipTemplate);
  protected readonly headerTemplate = contentChild(AerisMultiSelectHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisMultiSelectFooterTemplate);
  protected readonly emptyTemplate = contentChild(AerisMultiSelectEmptyTemplate);
  private onChange: (value: readonly string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value.set(Array.isArray(value) ? [...new Set(value.map(String))] : []);
  }

  registerOnChange(callback: (value: readonly string[]) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) this.closePanel(false);
  }

  focus(options?: FocusOptions): void {
    this.trigger()?.nativeElement.focus(options);
  }

  openPanel(): void {
    if (this.effectiveDisabled() || this.open()) return;
    if (this.resetFilterOnClose()) this.filterValue.set('');
    this.activeValue.set(this.initialActiveValue());
    this.open.set(true);
    this.opened.emit();
    this.emitLazyRange();
    if (this.filter() && this.autofocusFilter()) {
      queueMicrotask(() => this.filterInput()?.nativeElement.focus());
    }
  }

  closePanel(restoreFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (this.resetFilterOnClose()) this.filterValue.set('');
    this.closed.emit();
    if (restoreFocus) queueMicrotask(() => this.focus());
  }

  toggle(): void {
    this.open() ? this.closePanel(false) : this.openPanel();
  }

  clear(): void {
    if (!this.value().length || this.effectiveDisabled()) return;
    this.setValue([]);
    this.cleared.emit();
    queueMicrotask(() => this.focus());
  }

  reset(): void {
    if (this.effectiveDisabled()) return;
    this.setValue([]);
    this.filterValue.set('');
    this.closePanel(false);
  }

  selectAll(): void {
    if (this.selectAllDisabled()) return;
    const next = new Set(this.value());
    for (const option of this.filteredSelectableOptions()) {
      if (!this.optionUnavailable(option)) next.add(option.value);
    }
    this.setValue([...next]);
  }

  protected isSelected(option: AerisSelectOption): boolean {
    return this.value().includes(option.value);
  }

  protected optionUnavailable(option: AerisSelectOption): boolean {
    return Boolean(option.disabled || (!this.isSelected(option) && this.selectionLimitReached()));
  }

  protected activate(option: AerisSelectOption): void {
    if (!this.optionUnavailable(option)) this.activeValue.set(option.value);
  }

  protected toggleOption(option: AerisSelectOption, event: Event): void {
    if (this.optionUnavailable(option)) return;
    const selected = this.isSelected(option);
    const next = selected
      ? this.value().filter((value) => value !== option.value)
      : [...this.value(), option.value];
    this.setValue(next);
    this.changed.emit({ originalEvent: event, value: next, option, selected: !selected });
    if (this.closeOnSelect()) this.closePanel(true);
  }

  protected toggleSelectAll(event: Event): void {
    if (this.allFilteredSelected()) {
      const filtered = new Set(this.filteredSelectableOptions().map((option) => option.value));
      const next = this.value().filter((value) => !filtered.has(value));
      this.setValue(next);
      this.changed.emit({ originalEvent: event, value: next, option: null, selected: false });
    } else {
      const before = this.value();
      this.selectAll();
      this.changed.emit({
        originalEvent: event,
        value: this.value(),
        option: null,
        selected: this.value().length > before.length,
      });
    }
  }

  protected removeChip(option: AerisSelectOption, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleOption(option, event);
    this.focus();
  }

  protected removeCallback(option: AerisSelectOption): () => void {
    return () => {
      if (this.isSelected(option)) {
        const next = this.value().filter((value) => value !== option.value);
        this.setValue(next);
      }
    };
  }

  protected handleClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clear();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      this.display() === 'chips' &&
      this.selectedOptions().length > 0
    ) {
      event.preventDefault();
      const option = this.selectedOptions().at(-1);
      if (option) {
        this.toggleOption(option, event);
      }
      return;
    }

    if (event.key === 'Escape') {
      if (this.open()) {
        event.preventDefault();
        this.closePanel(false);
      }
      return;
    }
    if (event.key === 'Tab') {
      this.closePanel(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open()) this.openPanel();
      else this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      if (!this.open()) return;
      event.preventDefault();
      this.activeValue.set(
        boundarySelectValue(this.availableActiveOptions(), event.key === 'Home' ? 'start' : 'end'),
      );
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open()) this.openPanel();
      else this.toggleActive(event);
    }
  }

  protected handleFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel(true);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.activeValue.set(
        boundarySelectValue(this.availableActiveOptions(), event.key === 'Home' ? 'start' : 'end'),
      );
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleActive(event);
    }
  }

  protected handleFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue.set(value);
    this.virtualStart.set(0);
    this.activeValue.set(this.initialActiveValue());
    this.filterChanged.emit({ originalEvent: event, query: value });
  }

  protected clearFilter(): void {
    this.filterValue.set('');
    this.virtualStart.set(0);
    this.activeValue.set(this.initialActiveValue());
    queueMicrotask(() => this.filterInput()?.nativeElement.focus());
  }

  protected handleListScroll(event: Event): void {
    if (!this.virtualScroll()) return;
    const list = event.currentTarget as HTMLElement;
    const start = Math.max(
      0,
      Math.floor(list.scrollTop / Math.max(1, this.virtualItemSize())) - this.virtualBuffer(),
    );
    if (start === this.virtualStart()) return;
    this.virtualStart.set(start);
    this.emitLazyRange();
  }

  protected handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.host.nativeElement.contains(next)) return;
    this.closePanel(false);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  protected optionId(option: AerisSelectOption): string {
    return `${this.listboxId}-option-${this.options().indexOf(option)}`;
  }

  private setValue(value: readonly string[]): void {
    const unique = [...new Set(value)];
    this.value.set(unique);
    this.valueInput.emit(unique);
    this.onChange(unique);
  }

  private availableActiveOptions(): readonly AerisSelectOption[] {
    return this.filteredOptions().map((option) => ({
      ...option,
      disabled: this.optionUnavailable(option),
    }));
  }

  private initialActiveValue(): string | null {
    const selected = this.filteredOptions().find(
      (option) => this.isSelected(option) && !this.optionUnavailable(option),
    );
    return selected?.value ?? boundarySelectValue(this.availableActiveOptions(), 'start');
  }

  private moveActive(direction: 1 | -1): void {
    this.activeValue.set(
      nextEnabledSelectValue(this.availableActiveOptions(), this.activeValue(), direction),
    );
  }

  private toggleActive(event: Event): void {
    const option = this.options().find((candidate) => candidate.value === this.activeValue());
    if (option) this.toggleOption(option, event);
  }

  private emitLazyRange(): void {
    if (!this.virtualScroll() || !this.lazy()) return;
    this.lazyLoad.emit({
      first: this.virtualRange().start,
      last: this.virtualRange().end,
      query: this.filterValue(),
    });
  }
}

export const AerisMultiSelect = [
  AerisMultiSelectComponent,
  AerisMultiSelectOptionTemplate,
  AerisMultiSelectChipTemplate,
  AerisMultiSelectHeaderTemplate,
  AerisMultiSelectFooterTemplate,
  AerisMultiSelectEmptyTemplate,
] as const;

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : undefined;
}
