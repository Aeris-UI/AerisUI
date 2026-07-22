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

export type AerisCascadeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisCascadeSelectAppearance = 'outline' | 'filled';

export interface AerisCascadeSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly children?: readonly AerisCascadeSelectOption[];
}

export interface AerisCascadeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string | null;
  readonly option: AerisCascadeSelectOption | null;
  readonly path: readonly AerisCascadeSelectOption[];
}

interface AerisCascadeSelectColumn {
  readonly parent: AerisCascadeSelectOption | null;
  readonly options: readonly AerisCascadeSelectOption[];
}

interface AerisCascadeSelectOptionContext {
  readonly $implicit: AerisCascadeSelectOption;
  readonly option: AerisCascadeSelectOption;
  readonly active: boolean;
  readonly selected: boolean;
  readonly level: number;
  readonly hasChildren: boolean;
}

@Directive({ selector: 'ng-template[aerisCascadeSelectOption]' })
export class AerisCascadeSelectOptionTemplate {
  readonly template = inject<TemplateRef<AerisCascadeSelectOptionContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisCascadeSelectOptionTemplate,
    context: unknown,
  ): context is AerisCascadeSelectOptionContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisCascadeSelectEmpty]' })
export class AerisCascadeSelectEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let nextCascadeSelectId = 0;

@Component({
  selector: 'aeris-cascade-select',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-cascade-select"
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

      <div class="aeris-cascade-select__control">
        <button
          #trigger
          class="aeris-cascade-select__trigger"
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
          (keydown)="handleKeydown($event)"
          (focus)="focused.emit($event)"
          (blur)="handleBlur($event)"
        >
          <span
            class="aeris-cascade-select__value"
            [class.aeris-cascade-select__placeholder]="!selectedPath().length"
          >
            @if (selectedPath().length) {
              {{ displayValue() }}
            } @else {
              {{ placeholder() }}
            }
          </span>
        </button>

        @if (showClearButton()) {
          <button
            type="button"
            class="aeris-cascade-select__clear"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="clear()"
          >
            <span aria-hidden="true"></span>
          </button>
        }

        <span class="aeris-cascade-select__chevron" aria-hidden="true"></span>
      </div>

      @if (open()) {
        <button
          type="button"
          class="aeris-cascade-select__dismiss"
          tabindex="-1"
          aria-hidden="true"
          (click)="closePanel()"
        ></button>

        <div
          class="aeris-cascade-select__panel"
          [id]="panelId"
          [style.max-height]="panelMaxHeight()"
        >
          @if (columns().length === 0) {
            <div class="aeris-cascade-select__state">
              @if (emptyTemplate(); as template) {
                <ng-container [ngTemplateOutlet]="template.template" />
              } @else {
                {{ emptyMessage() }}
              }
            </div>
          } @else {
            @for (column of columns(); track columnKey(column, $index); let level = $index) {
              <div
                class="aeris-cascade-select__column"
                role="listbox"
                [attr.aria-label]="columnLabel(level)"
              >
                @for (option of column.options; track option.value) {
                  <button
                    type="button"
                    role="option"
                    class="aeris-cascade-select__option"
                    [id]="optionId(level, option.value)"
                    [disabled]="option.disabled"
                    [attr.aria-selected]="isSelected(option)"
                    [attr.aria-expanded]="hasChildren(option) ? isInActivePath(option) : null"
                    [attr.data-active]="isActive(level, option) || null"
                    [attr.data-has-children]="hasChildren(option) || null"
                    (mouseenter)="activateOption(level, option)"
                    (focus)="activateOption(level, option)"
                    (click)="handleOptionClick(level, option, $event)"
                  >
                    @if (optionTemplate(); as template) {
                      <ng-container
                        [ngTemplateOutlet]="template.template"
                        [ngTemplateOutletContext]="{
                          $implicit: option,
                          option,
                          active: isActive(level, option),
                          selected: isSelected(option),
                          level,
                          hasChildren: hasChildren(option)
                        }"
                      />
                    } @else {
                      <span class="aeris-cascade-select__option-copy">
                        <span>{{ option.label }}</span>
                        @if (option.description) {
                          <small>{{ option.description }}</small>
                        }
                      </span>
                      @if (hasChildren(option)) {
                        <span class="aeris-cascade-select__option-chevron" aria-hidden="true"></span>
                      }
                    }
                  </button>
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-cascade-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisCascadeSelect),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisCascadeSelect implements ControlValueAccessor {
  private readonly triggerElement = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly generatedId = `aeris-cascade-select-${++nextCascadeSelectId}`;
  private readonly formDisabled = signal(false);
  private readonly panelOpen = signal(false);
  private readonly activePath = signal<readonly AerisCascadeSelectOption[]>([]);
  private readonly activeLevel = signal(0);
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model<string | null>(null);
  readonly options = input<readonly AerisCascadeSelectOption[]>([]);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Select an option');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly clearButtonAriaLabel = input('Clear value');
  readonly emptyMessage = input('No options available');
  readonly size = input<AerisCascadeSelectSize>('md');
  readonly appearance = input<AerisCascadeSelectAppearance>('outline');
  readonly separator = input(' / ');
  readonly panelMaxHeight = input('18rem');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly selectBranches = input(false, { transform: booleanAttribute });

  readonly changed = output<AerisCascadeSelectChangeEvent>();
  readonly cleared = output<void>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly optionTemplate = contentChild(AerisCascadeSelectOptionTemplate);
  protected readonly emptyTemplate = contentChild(AerisCascadeSelectEmptyTemplate);
  protected readonly panelId = `${this.generatedId}-panel`;
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly open = computed(() => this.panelOpen());
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly selectedPath = computed(() => this.findPathByValue(this.value()));
  protected readonly displayValue = computed(() =>
    this.selectedPath().map((option) => option.label).join(this.separator()),
  );
  protected readonly showClearButton = computed(
    () => this.clearable() && this.value() !== null && !this.effectiveDisabled(),
  );
  protected readonly columns = computed<readonly AerisCascadeSelectColumn[]>(() => {
    const root = this.options();
    if (root.length === 0) return [];

    const path = this.activePath();
    const columns: AerisCascadeSelectColumn[] = [{ parent: null, options: root }];

    for (const option of path) {
      if (!this.hasChildren(option)) break;
      columns.push({ parent: option, options: option.children ?? [] });
    }

    return columns;
  });
  protected readonly activeOptionId = computed(() => {
    const option = this.activePath()[this.activeLevel()];
    return option ? this.optionId(this.activeLevel(), option.value) : null;
  });

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : value == null ? null : String(value));
  }

  registerOnChange(callback: (value: string | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.triggerElement()?.nativeElement.focus(options);
  }

  openPanel(): void {
    if (this.effectiveDisabled()) return;
    if (!this.panelOpen()) {
      this.activePath.set([]);
      this.activeLevel.set(0);
      this.panelOpen.set(true);
      this.opened.emit();
    }
  }

  closePanel(): void {
    if (!this.panelOpen()) return;
    this.panelOpen.set(false);
    this.activePath.set([]);
    this.activeLevel.set(0);
    this.closed.emit();
  }

  toggle(): void {
    if (this.panelOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  clear(): void {
    if (this.effectiveDisabled()) return;
    this.setValue(null, null, new Event('clear'));
    this.activePath.set([]);
    this.cleared.emit();
    this.closePanel();
    this.focus();
  }

  reset(): void {
    this.setValue(null, null, new Event('reset'));
    this.activePath.set([]);
    this.closePanel();
  }

  protected handleBlur(event: FocusEvent): void {
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!nextTarget || !currentTarget.contains(nextTarget)) this.closePanel();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openPanel();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openPanel();
        this.moveActive(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.openPanel();
        this.enterChildColumn();
        break;
      case 'ArrowLeft':
        if (this.panelOpen()) {
          event.preventDefault();
          this.leaveChildColumn();
        }
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
      case ' ':
        event.preventDefault();
        if (!this.panelOpen()) {
          this.openPanel();
          return;
        }
        this.commitActiveOption(event);
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

  protected activateOption(level: number, option: AerisCascadeSelectOption): void {
    if (option.disabled) return;
    this.activeLevel.set(level);
    this.activePath.update((path) => [...path.slice(0, level), option]);
  }

  protected handleOptionClick(
    level: number,
    option: AerisCascadeSelectOption,
    event: Event,
  ): void {
    if (option.disabled) return;
    this.activateOption(level, option);
    if (this.hasChildren(option) && !this.selectBranches()) return;
    this.selectOption(option, event);
  }

  protected hasChildren(option: AerisCascadeSelectOption): boolean {
    return (option.children?.length ?? 0) > 0;
  }

  protected isSelected(option: AerisCascadeSelectOption): boolean {
    return this.value() === option.value;
  }

  protected isActive(level: number, option: AerisCascadeSelectOption): boolean {
    return this.activePath()[level]?.value === option.value;
  }

  protected isInActivePath(option: AerisCascadeSelectOption): boolean {
    return this.activePath().some((active) => active.value === option.value);
  }

  protected optionId(level: number, value: string): string {
    return `${this.panelId}-${level}-${this.sanitizeId(value)}`;
  }

  protected columnLabel(level: number): string {
    return level === 0 ? 'Root options' : `Level ${level + 1} options`;
  }

  protected columnKey(column: AerisCascadeSelectColumn, index: number): string {
    return `${index}-${column.parent?.value ?? 'root'}`;
  }

  private moveActive(direction: 1 | -1): void {
    const options = this.enabledOptionsAtLevel(this.activeLevel());
    if (options.length === 0) return;

    const current = this.activePath()[this.activeLevel()];
    const currentIndex = options.findIndex((option) => option.value === current?.value);
    const nextIndex =
      currentIndex < 0
        ? direction > 0
          ? 0
          : options.length - 1
        : (currentIndex + direction + options.length) % options.length;
    const next = options[nextIndex];
    if (next) this.activateOption(this.activeLevel(), next);
  }

  private setBoundaryActive(boundary: 'first' | 'last'): void {
    const options = this.enabledOptionsAtLevel(this.activeLevel());
    const next = boundary === 'first' ? options[0] : options.at(-1);
    if (next) this.activateOption(this.activeLevel(), next);
  }

  private enterChildColumn(): void {
    const active = this.resolveOption(this.activePath()[this.activeLevel()] ?? null);
    if (!active || !this.hasChildren(active)) return;
    const child = this.firstEnabled(active.children ?? []);
    if (!child) return;
    const nextLevel = this.activeLevel() + 1;
    this.activeLevel.set(nextLevel);
    this.activePath.update((path) => [...path.slice(0, nextLevel), child]);
  }

  private leaveChildColumn(): void {
    if (this.activeLevel() === 0) return;
    this.activeLevel.update((level) => level - 1);
    this.activePath.update((path) => path.slice(0, this.activeLevel() + 1));
  }

  private commitActiveOption(event: Event): void {
    const active = this.resolveOption(this.activePath()[this.activeLevel()] ?? null);
    if (!active || active.disabled) return;
    if (this.hasChildren(active) && !this.selectBranches()) {
      this.enterChildColumn();
      return;
    }
    this.selectOption(active, event);
  }

  private selectOption(option: AerisCascadeSelectOption, originalEvent: Event): void {
    this.setValue(option.value, option, originalEvent);
    this.closePanel();
    this.focus();
  }

  private setValue(
    value: string | null,
    option: AerisCascadeSelectOption | null,
    originalEvent: Event,
  ): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
    this.changed.emit({
      originalEvent,
      value,
      option,
      path: value === null ? [] : this.findPathByValue(value),
    });
  }

  private enabledOptionsAtLevel(level: number): readonly AerisCascadeSelectOption[] {
    return (this.columns()[level]?.options ?? []).filter((option) => !option.disabled);
  }

  private firstEnabled(options: readonly AerisCascadeSelectOption[]): AerisCascadeSelectOption | null {
    return options.find((option) => !option.disabled) ?? null;
  }

  private findPathByValue(value: string | null): readonly AerisCascadeSelectOption[] {
    if (value === null) return [];
    return this.findPath(this.options(), value) ?? [];
  }

  private resolveOption(
    option: AerisCascadeSelectOption | null,
  ): AerisCascadeSelectOption | null {
    if (!option) return null;
    return this.findPathByValue(option.value).at(-1) ?? option;
  }

  private findPath(
    options: readonly AerisCascadeSelectOption[],
    value: string,
    path: readonly AerisCascadeSelectOption[] = [],
  ): readonly AerisCascadeSelectOption[] | null {
    for (const option of options) {
      const nextPath = [...path, option];
      if (option.value === value) return nextPath;
      const childPath = this.findPath(option.children ?? [], value, nextPath);
      if (childPath) return childPath;
    }
    return null;
  }

  private sanitizeId(value: string): string {
    const sanitized = value.toLocaleLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    return sanitized || 'option';
  }
}
