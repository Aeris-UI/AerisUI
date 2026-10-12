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
  viewChildren,
  afterNextRender,
  afterRenderEffect,
  DestroyRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
import {
  AERIS_OVERLAY_APPEND_TO,
  ɵAerisAppendTo,
  type AerisAppendTo,
  type AerisOverlayCollisionPadding,
} from '@aeris-ui/core';

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
  imports: [NgTemplateOutlet, ɵAerisAppendTo],
  template: `
    <ng-template #optionList let-items let-level="level">
      <ul class="aeris-cascade-select__options" role="presentation">
        @for (option of items; track option.value; let index = $index) {
          <li #optionAnchor class="aeris-cascade-select__item" role="none">
            <button
              type="button"
              role="treeitem"
              tabindex="-1"
              class="aeris-cascade-select__option"
              [id]="optionId(level, option.value)"
              [disabled]="option.disabled"
              [attr.aria-label]="option.label"
              [attr.aria-level]="level + 1"
              [attr.aria-posinset]="index + 1"
              [attr.aria-setsize]="items.length"
              [attr.aria-selected]="isSelected(option)"
              [attr.aria-expanded]="hasChildren(option) ? isInActivePath(option) : null"
              [attr.aria-owns]="
                hasChildren(option) && isInActivePath(option)
                  ? optionId(level, option.value) + '-children'
                  : null
              "
              [attr.data-active]="isActive(level, option) || null"
              [attr.data-has-children]="hasChildren(option) || null"
              (mouseenter)="handleOptionHover(level, option)"
              (mousedown)="$event.preventDefault()"
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
                    hasChildren: hasChildren(option),
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
            @if (hasChildren(option) && isInActivePath(option)) {
              <div
                #optionsPanel
                class="aeris-cascade-select__submenu"
                role="group"
                [id]="optionId(level, option.value) + '-children'"
                [attr.aria-label]="option.label"
                [aerisInternalAppendTo]="submenuTarget()"
                [aerisInternalAppendToAnchor]="optionAnchor"
                [aerisInternalAppendToPositionSelf]="!mobile()"
                [aerisInternalAppendToPlacement]="submenuPlacement()"
                aerisInternalAppendToAlignment="start"
                [aerisInternalAppendToOffset]="1"
                [aerisInternalAppendToCollisionPadding]="viewportMargin()"
                (aerisInternalAppendToOutside)="handleOutside($event)"
                [style.max-height]="mobile() ? null : panelMaxHeight()"
              >
                <ng-container
                  [ngTemplateOutlet]="optionList"
                  [ngTemplateOutletContext]="{ $implicit: option.children, level: level + 1 }"
                />
              </div>
            }
          </li>
        }
      </ul>
    </ng-template>
    <div
      class="aeris-cascade-select"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="open() || null"
      [attr.data-invalid]="displayInvalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name() && value() !== null) {
        <input type="hidden" [name]="name()" [value]="value()" />
      }

      <div #control class="aeris-cascade-select__control">
        <button
          #trigger
          class="aeris-cascade-select__trigger"
          type="button"
          role="combobox"
          aria-haspopup="tree"
          [id]="resolvedInputId()"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          [attr.aria-activedescendant]="open() ? activeOptionId() : null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledBy() || null"
          [attr.aria-describedby]="ariaDescribedBy() || null"
          [attr.aria-invalid]="displayInvalid() || null"
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
        <div
          #optionsPanel
          class="aeris-cascade-select__panel"
          [aerisInternalAppendTo]="appendTo()"
          [aerisInternalAppendToAnchor]="controlElement()?.nativeElement ?? null"
          [aerisInternalAppendToMatchWidth]="true"
          [aerisInternalAppendToCollisionPadding]="viewportMargin()"
          (aerisInternalAppendToOutside)="handleOutside($event)"
          [id]="panelId"
          role="tree"
          [attr.aria-label]="ariaLabel() || 'Options'"
          [style.max-height]="panelMaxHeight()"
        >
          @if (options().length === 0) {
            <div class="aeris-cascade-select__state">
              @if (emptyTemplate(); as template) {
                <ng-container [ngTemplateOutlet]="template.template" />
              } @else {
                {{ emptyMessage() }}
              }
            </div>
          } @else {
            <ng-container
              [ngTemplateOutlet]="optionList"
              [ngTemplateOutletContext]="{ $implicit: options(), level: 0 }"
            />
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
  protected readonly controlElement = viewChild<ElementRef<HTMLElement>>('control');
  protected readonly triggerElement = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panels = viewChildren<ElementRef<HTMLElement>>('optionsPanel');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly defaultAppendTo = inject(AERIS_OVERLAY_APPEND_TO);
  private readonly panelPortals = viewChildren(ɵAerisAppendTo);
  private readonly generatedId = `aeris-cascade-select-${++nextCascadeSelectId}`;
  private readonly formDisabled = signal(false);
  private readonly panelOpen = signal(false);
  private readonly activePath = signal<readonly AerisCascadeSelectOption[]>([]);
  private readonly expandedPath = signal<readonly AerisCascadeSelectOption[]>([]);
  protected readonly mobile = signal(false);
  private readonly activeLevel = signal(0);
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    afterRenderEffect(() => {
      const id = this.open() ? this.activeOptionId() : null;
      const option = id ? this.host.nativeElement.ownerDocument.getElementById(id) : null;
      const panel = option?.closest<HTMLElement>(
        this.mobile()
          ? '.aeris-cascade-select__panel'
          : '.aeris-cascade-select__panel, .aeris-cascade-select__submenu',
      );
      if (!option || !panel) return;
      const itemBounds = option.getBoundingClientRect();
      const panelBounds = panel.getBoundingClientRect();
      const delta =
        itemBounds.bottom > panelBounds.bottom
          ? itemBounds.bottom - panelBounds.bottom
          : itemBounds.top < panelBounds.top
            ? itemBounds.top - panelBounds.top
            : 0;
      if (delta) panel.scrollBy({ top: delta, behavior: 'instant' });
    });
    afterNextRender(() => {
      const query =
        this.host.nativeElement.ownerDocument.defaultView?.matchMedia?.('(max-width: 36rem)');
      if (!query) return;
      const update = () => this.mobile.set(query.matches);
      update();
      query.addEventListener('change', update);
      this.destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });
  }

  readonly value = model<string | null>(null);
  readonly options = input<readonly AerisCascadeSelectOption[]>([]);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Select an option');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly ariaDescribedBy = input<string>();
  readonly clearButtonAriaLabel = input('Clear value');
  readonly emptyMessage = input('No options available');
  readonly size = input<AerisCascadeSelectSize>('md');
  readonly appearance = input<AerisCascadeSelectAppearance>('outline');
  readonly separator = input(' / ');
  readonly panelMaxHeight = input('18rem');
  readonly appendTo = input<AerisAppendTo>();
  readonly viewportMargin = input<number | AerisOverlayCollisionPadding>(8);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
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
  protected readonly submenuPlacement = computed(() => {
    this.open();
    return this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
      this.host.nativeElement,
    ).direction === 'rtl'
      ? 'left'
      : 'right';
  });
  protected readonly submenuTarget = computed<AerisAppendTo>(() => {
    if (this.mobile()) return 'self';
    const target = this.appendTo() ?? this.defaultAppendTo;
    return target === 'self' ? this.host.nativeElement : (target ?? 'body');
  });
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly selectedPath = computed(() => this.findPathByValue(this.value()));
  protected readonly displayValue = computed(() =>
    this.selectedPath()
      .map((option) => option.label)
      .join(this.separator()),
  );
  protected readonly showClearButton = computed(
    () => this.clearable() && this.value() !== null && !this.effectiveDisabled(),
  );
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
      const selected = this.selectedPath();
      const first = this.firstEnabled(this.options());
      this.activePath.set(selected.length ? selected : first ? [first] : []);
      this.expandedPath.set(selected.slice(0, -1));
      this.activeLevel.set(Math.max(0, selected.length - 1));
      this.panelOpen.set(true);
      this.opened.emit();
    }
  }

  closePanel(): void {
    if (!this.panelOpen()) return;
    for (const portal of this.panelPortals()) portal.restore();
    this.panelOpen.set(false);
    this.activePath.set([]);
    this.expandedPath.set([]);
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
    if (
      !nextTarget ||
      (!currentTarget.contains(nextTarget) &&
        !this.panels().some((panel) => panel.nativeElement.contains(nextTarget)))
    ) {
      this.closePanel();
    }
  }

  protected handleOutside(event: PointerEvent): void {
    const target = event.target;
    if (
      target instanceof Node &&
      (this.host.nativeElement.contains(target) ||
        this.panels().some((panel) => panel.nativeElement.contains(target)))
    )
      return;
    this.closePanel();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.panelOpen()) {
          this.openPanel();
          break;
        }
        this.openPanel();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.panelOpen()) {
          this.openPanel();
          break;
        }
        this.openPanel();
        this.moveActive(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.openPanel();
        if (this.submenuPlacement() === 'left') this.leaveChildColumn();
        else this.enterChildColumn();
        break;
      case 'ArrowLeft':
        if (this.panelOpen()) {
          event.preventDefault();
          if (this.submenuPlacement() === 'left') this.enterChildColumn();
          else this.leaveChildColumn();
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
          this.focus();
        }
        break;
      case 'Tab':
        this.closePanel();
        break;
      default:
        break;
    }
  }

  protected activateOption(level: number, option: AerisCascadeSelectOption): void {
    if (option.disabled) return;
    this.activeLevel.set(level);
    this.activePath.update((path) => [...path.slice(0, level), option]);
    if (this.expandedPath()[level]?.value !== option.value) {
      this.expandedPath.update((path) => path.slice(0, level));
    }
  }

  protected handleOptionHover(level: number, option: AerisCascadeSelectOption): void {
    if (this.mobile() || option.disabled) return;
    this.activateOption(level, option);
    if (this.hasChildren(option)) this.expandedPath.set(this.activePath().slice(0, level + 1));
  }

  protected handleOptionClick(level: number, option: AerisCascadeSelectOption, event: Event): void {
    if (option.disabled) return;
    this.activateOption(level, option);
    if (this.hasChildren(option) && !this.selectBranches()) {
      if (this.expandedPath()[level]?.value === option.value) {
        this.expandedPath.update((path) => path.slice(0, level));
      } else this.expandedPath.set(this.activePath().slice(0, level + 1));
      this.focus();
      return;
    }
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
    return this.expandedPath().some((active) => active.value === option.value);
  }

  protected optionId(level: number, value: string): string {
    return `${this.panelId}-${level}-${this.sanitizeId(value)}`;
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
    if (!this.isInActivePath(active)) {
      this.expandedPath.set(this.activePath().slice(0, this.activeLevel() + 1));
      return;
    }
    const child = this.firstEnabled(active.children ?? []);
    if (!child) return;
    const nextLevel = this.activeLevel() + 1;
    this.activeLevel.set(nextLevel);
    this.activePath.update((path) => [...path.slice(0, nextLevel), child]);
  }

  private leaveChildColumn(): void {
    const active = this.activePath()[this.activeLevel()];
    if (active && this.isInActivePath(active)) {
      this.expandedPath.update((path) => path.slice(0, this.activeLevel()));
      return;
    }
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
    const options = level === 0 ? this.options() : (this.expandedPath()[level - 1]?.children ?? []);
    return options.filter((option) => !option.disabled);
  }

  private firstEnabled(
    options: readonly AerisCascadeSelectOption[],
  ): AerisCascadeSelectOption | null {
    return options.find((option) => !option.disabled) ?? null;
  }

  private findPathByValue(value: string | null): readonly AerisCascadeSelectOption[] {
    if (value === null) return [];
    return this.findPath(this.options(), value) ?? [];
  }

  private resolveOption(option: AerisCascadeSelectOption | null): AerisCascadeSelectOption | null {
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
    const readable = value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const exact = Array.from(value, (character) =>
      (character.codePointAt(0) ?? 0).toString(16),
    ).join('-');
    return `${readable || 'option'}--${exact || 'empty'}`;
  }
}
