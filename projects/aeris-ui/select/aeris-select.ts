import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
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

export type { AerisSelectFilterMatchMode, AerisSelectOption } from '@aeris-ui/core';

export type AerisSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisSelectAppearance = 'outline' | 'filled';
export interface AerisSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisSelectOption;
}

export interface AerisSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

export interface AerisSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}

interface AerisSelectOptionContext {
  readonly $implicit: AerisSelectOption;
  readonly option: AerisSelectOption;
  readonly selected: boolean;
  readonly active: boolean;
}

interface AerisSelectSelectedContext {
  readonly $implicit: AerisSelectOption;
  readonly option: AerisSelectOption;
}

interface AerisSelectGroupContext {
  readonly $implicit: string;
  readonly group: string;
}

@Directive({ selector: 'ng-template[aerisSelectOption]' })
export class AerisSelectOptionTemplate {
  readonly template = inject<TemplateRef<AerisSelectOptionContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisSelectOptionTemplate,
    context: unknown,
  ): context is AerisSelectOptionContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisSelectSelected]' })
export class AerisSelectSelectedTemplate {
  readonly template = inject<TemplateRef<AerisSelectSelectedContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisSelectSelectedTemplate,
    context: unknown,
  ): context is AerisSelectSelectedContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisSelectGroup]' })
export class AerisSelectGroupTemplate {
  readonly template = inject<TemplateRef<AerisSelectGroupContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectHeader]' })
export class AerisSelectHeaderTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectFooter]' })
export class AerisSelectFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectEmpty]' })
export class AerisSelectEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectEmptyFilter]' })
export class AerisSelectEmptyFilterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectDropdownIcon]' })
export class AerisSelectDropdownIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectClearIcon]' })
export class AerisSelectClearIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectFilterIcon]' })
export class AerisSelectFilterIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisSelectLoadingIcon]' })
export class AerisSelectLoadingIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let nextSelectId = 0;

@Component({
  selector: 'aeris-select',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-select"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="open() || null"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name() && value() !== null) {
        <input type="hidden" [name]="name()" [value]="value()" />
      }

      <div class="aeris-select__control">
        @if (editable()) {
          <input
            #trigger
            class="aeris-select__trigger aeris-select__editable"
            type="text"
            role="combobox"
            aria-haspopup="listbox"
            autocomplete="off"
            [id]="resolvedInputId()"
            [value]="editableDisplayValue()"
            [placeholder]="placeholder()"
            [attr.aria-expanded]="open()"
            [attr.aria-controls]="panelId"
            [attr.aria-activedescendant]="open() ? activeOptionId() : null"
            [attr.aria-label]="ariaLabel() || null"
            [attr.aria-labelledby]="ariaLabelledby() || null"
            [attr.aria-describedby]="ariaDescribedby() || null"
            [attr.aria-invalid]="invalid() || null"
            [attr.aria-required]="required() || null"
            [disabled]="effectiveDisabled()"
            (click)="openPanel()"
            (input)="handleEditableInput($event)"
            (keydown)="handleTriggerKeydown($event)"
            (focus)="focused.emit($event)"
          />
        } @else {
          <button
            #trigger
            class="aeris-select__trigger"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            [id]="resolvedInputId()"
            [attr.aria-expanded]="open()"
            [attr.aria-controls]="panelId"
            [attr.aria-activedescendant]="open() ? activeOptionId() : null"
            [attr.aria-label]="ariaLabel() || null"
            [attr.aria-labelledby]="ariaLabelledby() || null"
            [attr.aria-describedby]="ariaDescribedby() || null"
            [attr.aria-invalid]="invalid() || null"
            [attr.aria-required]="required() || null"
            [disabled]="effectiveDisabled()"
            (click)="toggle()"
            (keydown)="handleTriggerKeydown($event)"
            (focus)="focused.emit($event)"
          >
            <span class="aeris-select__value" [class.aeris-select__placeholder]="!selectedOption()">
              @if (selectedOption(); as option) {
                @if (selectedTemplate(); as selected) {
                  <ng-container
                    [ngTemplateOutlet]="selected.template"
                    [ngTemplateOutletContext]="{ $implicit: option, option }"
                  />
                } @else {
                  <span class="aeris-select__value-label">{{ option.label }}</span>
                }
              } @else {
                <span class="aeris-select__value-label">{{ placeholder() }}</span>
              }
            </span>
          </button>
        }

        @if (showClearButton()) {
          <button
            class="aeris-select__clear"
            type="button"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="handleClearClick($event)"
          >
            @if (clearIconTemplate(); as clearIcon) {
              <ng-container [ngTemplateOutlet]="clearIcon.template" />
            } @else {
              <span aria-hidden="true"></span>
            }
          </button>
        }
        <span class="aeris-select__actions">
          @if (loading()) {
            @if (loadingIconTemplate(); as loadingIcon) {
              <ng-container [ngTemplateOutlet]="loadingIcon.template" />
            } @else {
              <span class="aeris-select__spinner" aria-hidden="true"></span>
            }
          }
          @if (dropdownIconTemplate(); as dropdownIcon) {
            <ng-container [ngTemplateOutlet]="dropdownIcon.template" />
          } @else {
            <span class="aeris-select__chevron" aria-hidden="true"></span>
          }
        </span>
      </div>

      @if (open()) {
        <button
          class="aeris-select__dismiss"
          type="button"
          tabindex="-1"
          aria-label="Close options"
          (click)="closePanel(true)"
        ></button>

        <div
          class="aeris-select__panel"
          [id]="panelId"
          [class]="panelClass()"
          [style.--aeris-select-panel-max-height]="panelMaxHeight()"
        >
          @if (headerTemplate(); as header) {
            <div class="aeris-select__header">
              <ng-container [ngTemplateOutlet]="header.template" />
            </div>
          }
          @if (filter()) {
            <div class="aeris-select__filter-wrap">
              @if (filterIconTemplate(); as filterIcon) {
                <ng-container [ngTemplateOutlet]="filterIcon.template" />
              } @else {
                <span class="aeris-select__search-mark" aria-hidden="true"></span>
              }
              <input
                #filterInput
                class="aeris-select__filter"
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
              @if (showFilterClear() && filterValue()) {
                <button
                  class="aeris-select__filter-clear"
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
            class="aeris-select__list"
            [id]="listboxId"
            role="listbox"
            [attr.aria-label]="listboxAriaLabel()"
            [attr.aria-labelledby]="listboxAriaLabel() ? null : ariaLabelledby() || null"
            [attr.aria-busy]="loading() || null"
            (scroll)="handleListScroll($event)"
          >
            @if (loading()) {
              <div class="aeris-select__message" role="status">
                @if (loadingIconTemplate(); as loadingIcon) {
                  <ng-container [ngTemplateOutlet]="loadingIcon.template" />
                } @else {
                  <span class="aeris-select__spinner" aria-hidden="true"></span>
                }
                {{ loadingMessage() }}
              </div>
            } @else if (!filteredOptions().length) {
              <div class="aeris-select__message" role="status">
                @if (filterValue() && emptyFilterTemplate(); as emptyFilter) {
                  <ng-container [ngTemplateOutlet]="emptyFilter.template" />
                } @else if (!filterValue() && emptyTemplate(); as empty) {
                  <ng-container [ngTemplateOutlet]="empty.template" />
                } @else {
                  {{ filterValue() ? emptyFilterMessage() : emptyMessage() }}
                }
              </div>
            } @else {
              <div
                class="aeris-select__virtual-content"
                [style.padding-top.px]="virtualTopPadding()"
                [style.padding-bottom.px]="virtualBottomPadding()"
              >
                @for (group of renderedGroups(); track group.label ?? 'ungrouped') {
                  @if (group.label) {
                    <div class="aeris-select__group-label" role="presentation">
                      @if (groupTemplate(); as customGroup) {
                        <ng-container
                          [ngTemplateOutlet]="customGroup.template"
                          [ngTemplateOutletContext]="{ $implicit: group.label, group: group.label }"
                        />
                      } @else {
                        {{ group.label }}
                      }
                    </div>
                  }
                  @for (option of group.options; track option.value) {
                    <div
                      class="aeris-select__option"
                      role="option"
                      [id]="optionId(option)"
                      [attr.aria-selected]="value() === option.value"
                      [attr.aria-disabled]="option.disabled || null"
                      [class.aeris-select__option--active]="activeValue() === option.value"
                      [class.aeris-select__option--selected]="value() === option.value"
                      [class.aeris-select__option--disabled]="option.disabled"
                      (mouseenter)="activate(option)"
                      (mousedown)="$event.preventDefault()"
                      (click)="select(option, $event)"
                    >
                      <span class="aeris-select__option-content">
                        @if (optionTemplate(); as customOption) {
                          <ng-container
                            [ngTemplateOutlet]="customOption.template"
                            [ngTemplateOutletContext]="{
                              $implicit: option,
                              option,
                              selected: value() === option.value,
                              active: activeValue() === option.value,
                            }"
                          />
                        } @else {
                          <span class="aeris-select__option-copy">
                            <span>{{ option.label }}</span>
                            @if (option.description) {
                              <small>{{ option.description }}</small>
                            }
                          </span>
                        }
                      </span>
                      @if (checkmark() && value() === option.value) {
                        <span class="aeris-select__check" aria-hidden="true"></span>
                      }
                    </div>
                  }
                }
              </div>
            }
          </div>
          @if (footerTemplate(); as footer) {
            <div class="aeris-select__footer">
              <ng-container [ngTemplateOutlet]="footer.template" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisSelectComponent implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);
  readonly options = input.required<readonly AerisSelectOption[]>();
  readonly value = model<string | null>(null);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Select an option');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly listboxAriaLabel = input('Options');
  readonly size = input<AerisSelectSize>('md');
  readonly appearance = input<AerisSelectAppearance>('outline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly checkmark = input(true, { transform: booleanAttribute });
  readonly editable = input(false, { transform: booleanAttribute });
  readonly filter = input(false, { transform: booleanAttribute });
  readonly filterValue = model('');
  readonly filterMatchMode = input<AerisSelectFilterMatchMode>('contains');
  readonly filterFields = input<readonly ('label' | 'description' | 'group')[]>(['label']);
  readonly filterLocale = input<string>();
  readonly filterPlaceholder = input('Search options');
  readonly filterAriaLabel = input('Search options');
  readonly showFilterClear = input(false, { transform: booleanAttribute });
  readonly filterClearAriaLabel = input('Clear search');
  readonly resetFilterOnClose = input(true, { transform: booleanAttribute });
  readonly autofocusFilter = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input('No options available');
  readonly emptyFilterMessage = input('No matching options');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear selection');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading options');
  readonly panelMaxHeight = input('18rem');
  readonly panelClass = input('');
  readonly focusOnHover = input(true, { transform: booleanAttribute });
  readonly selectOnFocus = input(false, { transform: booleanAttribute });
  readonly autoOptionFocus = input(true, { transform: booleanAttribute });
  readonly autoDisplayFirst = input(false, { transform: booleanAttribute });
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly virtualItemSize = input(40);
  readonly virtualBuffer = input(4);
  readonly lazy = input(false, { transform: booleanAttribute });

  readonly valueInput = output<string | null>();
  readonly changed = output<AerisSelectChangeEvent>();
  readonly filterChanged = output<AerisSelectFilterEvent>();
  readonly lazyLoad = output<AerisSelectLazyLoadEvent>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly open = signal(false);
  protected readonly virtualStart = signal(0);
  protected readonly activeValue = signal<string | null>(null);
  protected readonly formDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );
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
  protected readonly renderedGroups = computed<readonly AerisSelectOptionGroup[]>(() => {
    if (!this.virtualScroll()) return this.groupedOptions();
    return [{ label: null, options: this.renderedOptions() }];
  });
  protected readonly virtualTopPadding = computed(() =>
    this.virtualScroll() ? this.virtualRange().topPadding : 0,
  );
  protected readonly virtualBottomPadding = computed(() =>
    this.virtualScroll() ? this.virtualRange().bottomPadding : 0,
  );
  protected readonly activeOptionId = computed(() => {
    const option = this.options().find((candidate) => candidate.value === this.activeValue());
    return option ? this.optionId(option) : null;
  });
  protected readonly showClearButton = computed(
    () => this.clearable() && this.value() !== null && !this.effectiveDisabled() && !this.loading(),
  );
  protected readonly editableDisplayValue = computed(
    () => this.selectedOption()?.label ?? this.value() ?? '',
  );

  protected readonly panelId = `aeris-select-panel-${++nextSelectId}`;
  protected readonly listboxId = `${this.panelId}-listbox`;
  protected readonly resolvedInputId = computed(() => this.inputId() || `${this.panelId}-trigger`);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  protected readonly optionTemplate = contentChild(AerisSelectOptionTemplate);
  protected readonly selectedTemplate = contentChild(AerisSelectSelectedTemplate);
  protected readonly groupTemplate = contentChild(AerisSelectGroupTemplate);
  protected readonly headerTemplate = contentChild(AerisSelectHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisSelectFooterTemplate);
  protected readonly emptyTemplate = contentChild(AerisSelectEmptyTemplate);
  protected readonly emptyFilterTemplate = contentChild(AerisSelectEmptyFilterTemplate);
  protected readonly dropdownIconTemplate = contentChild(AerisSelectDropdownIconTemplate);
  protected readonly clearIconTemplate = contentChild(AerisSelectClearIconTemplate);
  protected readonly filterIconTemplate = contentChild(AerisSelectFilterIconTemplate);
  protected readonly loadingIconTemplate = contentChild(AerisSelectLoadingIconTemplate);
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    });
  }

  writeValue(value: unknown): void {
    this.value.set(value == null ? null : String(value));
  }

  registerOnChange(callback: (value: string | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) {
      this.closePanel(false);
    }
  }

  focus(options?: FocusOptions): void {
    this.trigger()?.nativeElement.focus(options);
  }

  openPanel(): void {
    if (this.effectiveDisabled() || this.open()) {
      return;
    }

    if (this.resetFilterOnClose()) {
      this.filterValue.set('');
    }
    this.setInitialActiveOption();
    this.open.set(true);
    this.opened.emit();
    if (this.virtualScroll() && this.lazy()) {
      this.lazyLoad.emit({
        first: this.virtualStart(),
        last: Math.min(this.filteredOptions().length, this.renderedOptions().length),
        query: this.filterValue(),
      });
    }

    if (this.filter() && this.autofocusFilter()) {
      queueMicrotask(() => this.filterInput()?.nativeElement.focus());
    }
  }

  closePanel(restoreFocus = false): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    if (this.resetFilterOnClose()) {
      this.filterValue.set('');
    }
    this.closed.emit();

    if (restoreFocus) {
      queueMicrotask(() => this.focus());
    }
  }

  toggle(): void {
    if (this.open()) {
      this.closePanel(false);
    } else {
      this.openPanel();
    }
  }

  clear(): void {
    if (!this.showClearButton()) {
      return;
    }

    this.setValue(null);
    this.activeValue.set(this.firstEnabledOption()?.value ?? null);
    this.cleared.emit();
    queueMicrotask(() => this.focus());
  }

  reset(): void {
    if (this.effectiveDisabled()) {
      return;
    }

    this.setValue(null);
    this.filterValue.set('');
    this.closePanel(false);
  }

  protected handleClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clear();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) {
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
      if (!this.open()) {
        this.openPanel();
      } else {
        this.moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
      }
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      if (!this.open()) {
        return;
      }
      event.preventDefault();
      this.moveToBoundary(event.key === 'Home' ? 'start' : 'end');
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open()) {
        this.openPanel();
      } else {
        this.selectActive(event);
      }
      return;
    }

    if (
      !this.filter() &&
      !this.editable() &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      this.handleTypeahead(event.key);
    }
  }

  protected handleFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel(true);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.moveToBoundary(event.key === 'Home' ? 'start' : 'end');
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.selectActive(event);
    }
  }

  protected handleFilterInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterValue.set(inputElement.value);
    this.virtualStart.set(0);
    this.activeValue.set(this.firstEnabledOption()?.value ?? null);
    this.filterChanged.emit({
      originalEvent: event,
      query: inputElement.value,
    });
  }

  protected handleEditableInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.setValue(inputElement.value || null);
    if (!this.open()) this.openPanel();
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.host.nativeElement.contains(nextTarget)) {
      return;
    }

    this.closePanel(false);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  protected activate(option: AerisSelectOption): void {
    if (!option.disabled && this.focusOnHover()) {
      this.activeValue.set(option.value);
      if (this.selectOnFocus()) {
        this.setValue(option.value);
      }
    }
  }

  clearFilter(): void {
    this.filterValue.set('');
    this.virtualStart.set(0);
    this.activeValue.set(this.firstEnabledOption()?.value ?? null);
    queueMicrotask(() => this.filterInput()?.nativeElement.focus());
  }

  protected handleListScroll(event: Event): void {
    if (!this.virtualScroll()) return;
    const list = event.currentTarget as HTMLElement;
    const first = Math.max(
      0,
      Math.floor(list.scrollTop / Math.max(1, this.virtualItemSize())) - this.virtualBuffer(),
    );
    if (first === this.virtualStart()) return;
    this.virtualStart.set(first);
    if (this.lazy()) {
      this.lazyLoad.emit({
        first,
        last: Math.min(this.filteredOptions().length, first + this.renderedOptions().length),
        query: this.filterValue(),
      });
    }
  }

  protected select(option: AerisSelectOption, event: Event): void {
    if (option.disabled) {
      return;
    }

    this.setValue(option.value);
    this.changed.emit({
      originalEvent: event,
      value: option.value,
      option,
    });
    this.closePanel(true);
  }

  protected optionId(option: AerisSelectOption): string {
    const index = this.options().indexOf(option);
    return `${this.listboxId}-option-${index}`;
  }

  private setValue(value: string | null): void {
    if (this.value() === value) {
      return;
    }

    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private selectActive(event: Event): void {
    const option = this.filteredOptions().find(
      (candidate) => candidate.value === this.activeValue(),
    );
    if (option) {
      this.select(option, event);
    }
  }

  private setInitialActiveOption(): void {
    const selected = this.selectedOption();
    if (selected && !selected.disabled) {
      this.activeValue.set(selected.value);
      return;
    }

    const first = this.firstEnabledOption();
    this.activeValue.set(this.autoOptionFocus() ? (first?.value ?? null) : null);
    if (this.autoDisplayFirst() && this.value() === null && first && !this.editable()) {
      this.setValue(first.value);
    }
  }

  private firstEnabledOption(): AerisSelectOption | undefined {
    return this.filteredOptions().find((option) => !option.disabled);
  }

  private moveActiveOption(direction: 1 | -1): void {
    const options = this.filteredOptions();
    const value = nextEnabledSelectValue(options, this.activeValue(), direction);
    this.activeValue.set(value);
    if (this.selectOnFocus()) {
      this.setValue(value);
    }
  }

  private moveToBoundary(boundary: 'start' | 'end'): void {
    const value = boundarySelectValue(this.filteredOptions(), boundary);
    this.activeValue.set(value);
    if (this.selectOnFocus()) {
      this.setValue(value);
    }
  }

  private handleTypeahead(character: string): void {
    if (this.typeaheadTimer) {
      clearTimeout(this.typeaheadTimer);
    }

    this.typeahead += character.toLocaleLowerCase();
    const match = this.options().find(
      (option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(this.typeahead),
    );

    if (match) {
      this.activeValue.set(match.value);
      if (!this.open()) {
        this.setValue(match.value);
      }
    }

    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = '';
      this.typeaheadTimer = undefined;
    }, 650);
  }
}

export const AerisSelect = [
  AerisSelectComponent,
  AerisSelectOptionTemplate,
  AerisSelectSelectedTemplate,
  AerisSelectGroupTemplate,
  AerisSelectHeaderTemplate,
  AerisSelectFooterTemplate,
  AerisSelectEmptyTemplate,
  AerisSelectEmptyFilterTemplate,
  AerisSelectDropdownIconTemplate,
  AerisSelectClearIconTemplate,
  AerisSelectFilterIconTemplate,
  AerisSelectLoadingIconTemplate,
] as const;
