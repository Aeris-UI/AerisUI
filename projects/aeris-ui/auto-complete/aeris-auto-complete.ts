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
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisAutoCompleteSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisAutoCompleteAppearance = 'outline' | 'filled';
export type AerisAutoCompleteFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals';

export interface AerisAutoCompleteOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

export interface AerisAutoCompleteCompleteEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

export interface AerisAutoCompleteSelectEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisAutoCompleteOption;
}

interface AerisAutoCompleteOptionGroup {
  readonly label: string;
  readonly options: readonly AerisAutoCompleteOption[];
}

interface AerisAutoCompleteOptionContext {
  readonly $implicit: AerisAutoCompleteOption;
  readonly option: AerisAutoCompleteOption;
  readonly selected: boolean;
  readonly active: boolean;
}

interface AerisAutoCompleteGroupContext {
  readonly $implicit: string;
  readonly group: string;
}

@Directive({ selector: 'ng-template[aerisAutoCompleteOption]' })
export class AerisAutoCompleteOptionTemplate {
  readonly template = inject<TemplateRef<AerisAutoCompleteOptionContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisAutoCompleteOptionTemplate,
    context: unknown,
  ): context is AerisAutoCompleteOptionContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisAutoCompleteGroup]' })
export class AerisAutoCompleteGroupTemplate {
  readonly template = inject<TemplateRef<AerisAutoCompleteGroupContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisAutoCompleteGroupTemplate,
    context: unknown,
  ): context is AerisAutoCompleteGroupContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisAutoCompleteEmpty]' })
export class AerisAutoCompleteEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisAutoCompleteLoading]' })
export class AerisAutoCompleteLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let nextAutoCompleteId = 0;

@Component({
  selector: 'aeris-auto-complete',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-auto-complete"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="open() || null"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name()) {
        <input type="hidden" [name]="name()" [value]="value()" />
      }

      <div class="aeris-auto-complete__control">
        <input
          #textInput
          class="aeris-auto-complete__input"
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          [id]="resolvedInputId()"
          [value]="value()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [readOnly]="readonly()"
          [required]="required()"
          [disabled]="effectiveDisabled()"
          [attr.aria-autocomplete]="'list'"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          [attr.aria-activedescendant]="open() ? activeOptionId() : null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="ariaDescribedby() || null"
          [attr.aria-invalid]="invalid() || null"
          [attr.aria-required]="required() || null"
          (click)="handleInputClick()"
          (input)="handleInput($event)"
          (keydown)="handleInputKeydown($event)"
          (focus)="handleFocus($event)"
          (blur)="handleBlur($event)"
        />

        @if (showClearButton()) {
          <button
            type="button"
            class="aeris-auto-complete__clear"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="clear()"
          >
            <span aria-hidden="true"></span>
          </button>
        }

        @if (dropdown()) {
          <button
            type="button"
            class="aeris-auto-complete__dropdown"
            [attr.aria-label]="dropdownAriaLabel()"
            [attr.aria-expanded]="open()"
            [attr.aria-controls]="panelId"
            [disabled]="effectiveDisabled() || readonly()"
            (click)="togglePanel($event)"
          >
            <span aria-hidden="true"></span>
          </button>
        }
      </div>

      @if (open()) {
        <button
          type="button"
          class="aeris-auto-complete__dismiss"
          tabindex="-1"
          aria-hidden="true"
          (click)="closePanel()"
        ></button>

        <div
          class="aeris-auto-complete__panel"
          [id]="panelId"
          role="listbox"
          [attr.aria-label]="listboxAriaLabel()"
          [style.max-height]="panelMaxHeight()"
        >
          @if (loading()) {
            <div class="aeris-auto-complete__state">
              @if (loadingTemplate(); as template) {
                <ng-container [ngTemplateOutlet]="template.template" />
              } @else {
                {{ loadingMessage() }}
              }
            </div>
          } @else if (filteredOptions().length === 0) {
            <div class="aeris-auto-complete__state">
              @if (emptyTemplate(); as template) {
                <ng-container [ngTemplateOutlet]="template.template" />
              } @else {
                {{ emptyMessage() }}
              }
            </div>
          } @else if (grouped()) {
            @for (group of optionGroups(); track group.label) {
              <div class="aeris-auto-complete__group">
                @if (groupTemplate(); as template) {
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="{ $implicit: group.label, group: group.label }"
                  />
                } @else {
                  {{ group.label }}
                }
              </div>
              @for (option of group.options; track option.value) {
                <button
                  type="button"
                  role="option"
                  class="aeris-auto-complete__option"
                  [id]="optionId(option.value)"
                  [disabled]="option.disabled"
                  [attr.aria-selected]="isSelected(option)"
                  [attr.data-active]="isActive(option) || null"
                  (mousedown)="$event.preventDefault()"
                  (click)="selectOption(option, $event)"
                >
                  <ng-container
                    [ngTemplateOutlet]="optionContent"
                    [ngTemplateOutletContext]="{ $implicit: option, option, selected: isSelected(option), active: isActive(option) }"
                  />
                </button>
              }
            }
          } @else {
            @for (option of filteredOptions(); track option.value) {
              <button
                type="button"
                role="option"
                class="aeris-auto-complete__option"
                [id]="optionId(option.value)"
                [disabled]="option.disabled"
                [attr.aria-selected]="isSelected(option)"
                [attr.data-active]="isActive(option) || null"
                (mousedown)="$event.preventDefault()"
                (click)="selectOption(option, $event)"
              >
                <ng-container
                  [ngTemplateOutlet]="optionContent"
                  [ngTemplateOutletContext]="{ $implicit: option, option, selected: isSelected(option), active: isActive(option) }"
                />
              </button>
            }
          }
        </div>
      }
    </div>

    <ng-template #optionContent let-option="option" let-selected="selected" let-active="active">
      @if (optionTemplate(); as template) {
        <ng-container
          [ngTemplateOutlet]="template.template"
          [ngTemplateOutletContext]="{ $implicit: option, option, selected, active }"
        />
      } @else {
        <span class="aeris-auto-complete__option-label">{{ option.label }}</span>
        @if (option.description) {
          <span class="aeris-auto-complete__option-description">{{ option.description }}</span>
        }
      }
    </ng-template>
  `,
  styleUrl: './aeris-auto-complete.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisAutoComplete),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisAutoComplete implements ControlValueAccessor {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('textInput');
  private readonly generatedId = `aeris-auto-complete-${++nextAutoCompleteId}`;
  private readonly formDisabled = signal(false);
  private readonly activeValue = signal<string | null>(null);
  private readonly panelOpen = signal(false);
  private suppressNextFocusOpen = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model('');
  readonly suggestions = input<readonly AerisAutoCompleteOption[]>([]);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly listboxAriaLabel = input('Suggestions');
  readonly dropdownAriaLabel = input('Show suggestions');
  readonly clearButtonAriaLabel = input('Clear value');
  readonly emptyMessage = input('No suggestions found');
  readonly loadingMessage = input('Loading suggestions');
  readonly size = input<AerisAutoCompleteSize>('md');
  readonly appearance = input<AerisAutoCompleteAppearance>('outline');
  readonly filterMatchMode = input<AerisAutoCompleteFilterMatchMode>('contains');
  readonly minLength = input(1);
  readonly panelMaxHeight = input('16rem');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly dropdown = input(false, { transform: booleanAttribute });
  readonly completeOnFocus = input(false, { transform: booleanAttribute });
  readonly forceSelection = input(false, { transform: booleanAttribute });
  readonly autoHighlight = input(true, { transform: booleanAttribute });
  readonly grouped = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly valueInput = output<string>();
  readonly completed = output<AerisAutoCompleteCompleteEvent>();
  readonly selected = output<AerisAutoCompleteSelectEvent>();
  readonly cleared = output<void>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly optionTemplate = contentChild(AerisAutoCompleteOptionTemplate);
  protected readonly groupTemplate = contentChild(AerisAutoCompleteGroupTemplate);
  protected readonly emptyTemplate = contentChild(AerisAutoCompleteEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisAutoCompleteLoadingTemplate);
  protected readonly panelId = `${this.generatedId}-panel`;
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly open = computed(() => this.panelOpen());
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.value().length > 0 &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );
  protected readonly filteredOptions = computed(() => {
    const query = this.value().trim();

    if (!this.panelOpen() || (!this.completeOnFocus() && query.length < this.minLength())) {
      return [];
    }

    return this.suggestions().filter((option) => this.matchesOption(option, query));
  });
  protected readonly optionGroups = computed<readonly AerisAutoCompleteOptionGroup[]>(() => {
    const groups = new Map<string, AerisAutoCompleteOption[]>();

    for (const option of this.filteredOptions()) {
      const group = option.group || 'Options';
      groups.set(group, [...(groups.get(group) ?? []), option]);
    }

    return [...groups.entries()].map(([label, options]) => ({ label, options }));
  });
  protected readonly activeOptionId = computed(() => {
    const active = this.activeValue();
    return active ? this.optionId(active) : null;
  });

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : value == null ? '' : String(value));
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.inputElement()?.nativeElement.focus(options);
  }

  openPanel(event?: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    if (!this.panelOpen()) {
      this.panelOpen.set(true);
      this.opened.emit();
    }
    this.completed.emit({ originalEvent: event ?? new Event('complete'), query: this.value() });
    this.setInitialActiveOption();
  }

  closePanel(): void {
    if (!this.panelOpen()) return;
    this.panelOpen.set(false);
    this.activeValue.set(null);
    this.closed.emit();
  }

  togglePanel(event: Event): void {
    event.preventDefault();
    this.focus();
    if (this.panelOpen()) {
      this.closePanel();
    } else {
      this.openPanel(event);
    }
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.activeValue.set(null);
    this.cleared.emit();
    this.closePanel();
    this.focus();
  }

  reset(): void {
    this.setValue('');
    this.closePanel();
  }

  protected handleInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.setValue(query);
    this.openPanel(event);
  }

  protected handleInputClick(): void {
    if (this.completeOnFocus() || this.dropdown()) this.openPanel();
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
    if (this.suppressNextFocusOpen) {
      this.suppressNextFocusOpen = false;
      return;
    }
    if (this.completeOnFocus()) this.openPanel(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.applyForceSelection();
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!nextTarget || !currentTarget.contains(nextTarget)) {
      this.closePanel();
    }
  }

  protected handleInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openPanel(event);
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openPanel(event);
        this.moveActive(-1);
        break;
      case 'Home':
        if (this.panelOpen()) {
          event.preventDefault();
          this.setBoundaryActive('first');
        }
        break;
      case 'End':
        if (this.panelOpen()) {
          event.preventDefault();
          this.setBoundaryActive('last');
        }
        break;
      case 'Enter':
        if (this.panelOpen() && this.activeValue()) {
          event.preventDefault();
          const active = this.enabledOptions().find((option) => option.value === this.activeValue());
          if (active) this.selectOption(active, event);
        }
        break;
      case 'Escape':
        if (this.panelOpen()) {
          event.preventDefault();
          this.closePanel();
        }
        break;
      default:
        break;
    }
  }

  protected selectOption(option: AerisAutoCompleteOption, originalEvent: Event): void {
    if (option.disabled || this.effectiveDisabled() || this.readonly()) return;
    this.setValue(option.value);
    this.selected.emit({ originalEvent, value: option.value, option });
    this.closePanel();
    this.suppressNextFocusOpen = true;
    this.focus();
  }

  protected optionId(value: string): string {
    return `${this.panelId}-${this.sanitizeId(value)}`;
  }

  protected isSelected(option: AerisAutoCompleteOption): boolean {
    return this.value() === option.value;
  }

  protected isActive(option: AerisAutoCompleteOption): boolean {
    return this.activeValue() === option.value;
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private enabledOptions(): readonly AerisAutoCompleteOption[] {
    return this.filteredOptions().filter((option) => !option.disabled);
  }

  private setInitialActiveOption(): void {
    const options = this.enabledOptions();
    if (!this.autoHighlight() || options.length === 0) {
      this.activeValue.set(null);
      return;
    }

    const selected = options.find((option) => option.value === this.value());
    this.activeValue.set((selected ?? options[0]).value);
  }

  private moveActive(direction: 1 | -1): void {
    const options = this.enabledOptions();
    if (options.length === 0) {
      this.activeValue.set(null);
      return;
    }

    const currentIndex = options.findIndex((option) => option.value === this.activeValue());
    const nextIndex =
      currentIndex < 0
        ? direction > 0
          ? 0
          : options.length - 1
        : (currentIndex + direction + options.length) % options.length;

    this.activeValue.set(options[nextIndex]?.value ?? null);
  }

  private setBoundaryActive(boundary: 'first' | 'last'): void {
    const options = this.enabledOptions();
    this.activeValue.set(
      boundary === 'first'
        ? options[0]?.value ?? null
        : options.at(-1)?.value ?? null,
    );
  }

  private matchesOption(option: AerisAutoCompleteOption, query: string): boolean {
    if (query.length === 0) return true;

    const candidate = `${option.label} ${option.value} ${option.description ?? ''} ${option.group ?? ''}`
      .trim()
      .toLocaleLowerCase();
    const normalizedQuery = query.toLocaleLowerCase();

    switch (this.filterMatchMode()) {
      case 'startsWith':
        return candidate.startsWith(normalizedQuery);
      case 'endsWith':
        return candidate.endsWith(normalizedQuery);
      case 'equals':
        return candidate === normalizedQuery;
      case 'contains':
        return candidate.includes(normalizedQuery);
      default:
        return false;
    }
  }

  private applyForceSelection(): void {
    if (!this.forceSelection() || this.value().trim().length === 0) return;

    const normalizedValue = this.value().trim().toLocaleLowerCase();
    const match = this.suggestions().find(
      (option) =>
        option.value.toLocaleLowerCase() === normalizedValue ||
        option.label.toLocaleLowerCase() === normalizedValue,
    );

    if (!match) {
      this.setValue('');
    } else if (match.value !== this.value()) {
      this.setValue(match.value);
    }
  }

  private sanitizeId(value: string): string {
    const sanitized = value.toLocaleLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    return sanitized || 'option';
  }
}
