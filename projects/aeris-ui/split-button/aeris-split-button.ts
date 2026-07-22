import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';

export type AerisSplitButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'link';
export type AerisSplitButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisSplitButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast';

export interface AerisSplitButtonCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSplitButtonItem<T>;
}

export interface AerisSplitButtonItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSplitButtonCommandEvent<T>) => void;
}

export interface AerisSplitButtonProps {
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly tabIndex?: number;
}

export type AerisSplitButtonNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

export interface AerisSplitButtonContentTemplateContext {
  readonly loading: boolean;
  readonly disabled: boolean;
}

export interface AerisSplitButtonIconTemplateContext {
  readonly loading: boolean;
}

export interface AerisSplitButtonItemTemplateContext<T = unknown> {
  readonly $implicit: AerisSplitButtonItem<T>;
  readonly item: AerisSplitButtonItem<T>;
  readonly index: number;
}

interface VisibleSplitButtonItem<T> {
  readonly item: AerisSplitButtonItem<T>;
  readonly index: number;
  readonly id: string;
  readonly href: string | null;
}

let splitButtonId = 0;

@Component({
  selector: 'aeris-split-button',
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-split-button__control">
      <button
        class="aeris-split-button__primary"
        [attr.data-variant]="effectiveVariant()"
        [attr.data-severity]="severity()"
        [attr.data-size]="size()"
        [attr.data-raised]="raised() || null"
        [attr.data-rounded]="rounded() || null"
        [attr.data-plain]="plain() || null"
        [type]="type()"
        [disabled]="effectiveDisabled()"
        [attr.aria-busy]="loading() || null"
        [attr.aria-label]="buttonProps()?.ariaLabel"
        [attr.title]="buttonProps()?.title"
        [attr.tabindex]="buttonProps()?.tabIndex"
        (click)="activatePrimary($event)"
      >
        @if (contentTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{ loading: loading(), disabled: effectiveDisabled() }"
          />
        } @else {
          @if (loading() && loadingIconContentTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ loading: true }"
            />
          } @else if (loading()) {
            <span class="aeris-split-button__spinner" aria-hidden="true"></span>
          } @else if (iconContentTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ loading: false }"
            />
          } @else if (icon()) {
            <span class="aeris-split-button__primary-icon" aria-hidden="true">{{ icon() }}</span>
          }
          <span>{{ label() }}</span>
        }
      </button>

      <button
        #toggle
        type="button"
        class="aeris-split-button__toggle"
        [attr.data-variant]="effectiveVariant()"
        [attr.data-severity]="severity()"
        [attr.data-size]="size()"
        [attr.data-raised]="raised() || null"
        [attr.data-rounded]="rounded() || null"
        [attr.data-plain]="plain() || null"
        [disabled]="effectiveDisabled()"
        [attr.aria-label]="menuButtonProps()?.ariaLabel ?? 'More actions'"
        [attr.title]="menuButtonProps()?.title"
        [attr.tabindex]="menuButtonProps()?.tabIndex"
        [attr.aria-controls]="menuId()"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
        (click)="toggleMenu($event)"
        (keydown)="onToggleKeydown($event)"
      >
        @if (dropdownIconContentTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{ loading: loading() }"
          />
        } @else {
          <span class="aeris-split-button__chevron" aria-hidden="true"></span>
        }
      </button>
    </div>

    @if (open()) {
      <div
        class="aeris-split-button__menu"
        [class]="menuStyleClass()"
        [id]="menuId()"
        role="menu"
        [attr.aria-label]="menuAriaLabel()"
        (keydown)="onMenuKeydown($event)"
      >
        @for (entry of visibleItems(); track entry.id) {
          @if (entry.item.separator) {
            <div class="aeris-split-button__separator" role="separator"></div>
          } @else if (entry.item.url || entry.item.routerLink) {
            <a
              #menuItem
              class="aeris-split-button__item"
              role="menuitem"
              [attr.id]="entry.id"
              [attr.href]="entry.item.disabled ? null : entry.href"
              [attr.target]="entry.item.target"
              [attr.rel]="entry.item.rel || (entry.item.target === '_blank' ? 'noopener noreferrer' : null)"
              [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
              [attr.aria-disabled]="entry.item.disabled || null"
              [attr.tabindex]="activeIndex() === entry.index && !entry.item.disabled ? 0 : -1"
              (click)="activateItem($event, entry)"
              (focus)="activeIndex.set(entry.index)"
            >
              <ng-container
                [ngTemplateOutlet]="itemContentTemplate()"
                [ngTemplateOutletContext]="itemContext(entry)"
              />
              @if (!itemContentTemplate()) {
                @if (entry.item.icon) {
                  <span class="aeris-split-button__item-icon" aria-hidden="true">{{ entry.item.icon }}</span>
                }
                <span>{{ entry.item.label }}</span>
              }
            </a>
          } @else {
            <button
              #menuItem
              type="button"
              class="aeris-split-button__item"
              role="menuitem"
              [attr.id]="entry.id"
              [attr.aria-label]="entry.item.ariaLabel ?? entry.item.label"
              [disabled]="entry.item.disabled"
              [attr.tabindex]="activeIndex() === entry.index && !entry.item.disabled ? 0 : -1"
              (click)="activateItem($event, entry)"
              (focus)="activeIndex.set(entry.index)"
            >
              <ng-container
                [ngTemplateOutlet]="itemContentTemplate()"
                [ngTemplateOutletContext]="itemContext(entry)"
              />
              @if (!itemContentTemplate()) {
                @if (entry.item.icon) {
                  <span class="aeris-split-button__item-icon" aria-hidden="true">{{ entry.item.icon }}</span>
                }
                <span>{{ entry.item.label }}</span>
              }
            </button>
          }
        }
      </div>
    }
  `,
  styleUrl: './aeris-split-button.scss',
  host: {
    class: 'aeris-split-button',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-open]': 'open() || null',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AerisSplitButton<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly generatedId = `aeris-split-button-${++splitButtonId}`;
  private readonly toggleButton =
    viewChild<ElementRef<HTMLButtonElement>>('toggle');
  private readonly menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');

  readonly id = input(this.generatedId);
  readonly label = input('');
  readonly icon = input('');
  readonly model = input<readonly AerisSplitButtonItem<T>[]>([]);
  readonly open = model(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<AerisSplitButtonVariant>('primary');
  readonly severity = input<AerisSplitButtonSeverity>('primary');
  readonly size = input<AerisSplitButtonSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly text = input(false, { transform: booleanAttribute });
  readonly plain = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly hideOnClickOutside = input(true, { transform: booleanAttribute });
  readonly menuAriaLabel = input('Additional actions');
  readonly menuStyleClass = input('');
  readonly buttonProps = input<AerisSplitButtonProps>();
  readonly menuButtonProps = input<AerisSplitButtonProps>();
  readonly contentTemplate = input<TemplateRef<AerisSplitButtonContentTemplateContext>>();
  readonly iconTemplate = input<TemplateRef<AerisSplitButtonIconTemplateContext>>();
  readonly loadingIconTemplate = input<TemplateRef<AerisSplitButtonIconTemplateContext>>();
  readonly dropdownIconTemplate = input<TemplateRef<AerisSplitButtonIconTemplateContext>>();
  readonly itemTemplate = input<TemplateRef<AerisSplitButtonItemTemplateContext<T>>>();
  readonly navigationHandler = input<AerisSplitButtonNavigationHandler>();

  readonly clicked = output<MouseEvent>();
  readonly dropdownClicked = output<MouseEvent>();
  readonly shown = output<Event>();
  readonly hidden = output<Event>();
  readonly itemSelected = output<AerisSplitButtonCommandEvent<T>>();

  protected readonly projectedContentTemplate =
    contentChild<TemplateRef<AerisSplitButtonContentTemplateContext>>('content');
  protected readonly projectedIconTemplate =
    contentChild<TemplateRef<AerisSplitButtonIconTemplateContext>>('icon');
  protected readonly projectedLoadingIconTemplate =
    contentChild<TemplateRef<AerisSplitButtonIconTemplateContext>>('loadingIcon');
  protected readonly projectedDropdownIconTemplate =
    contentChild<TemplateRef<AerisSplitButtonIconTemplateContext>>('dropdownIcon');
  protected readonly projectedItemTemplate =
    contentChild<TemplateRef<AerisSplitButtonItemTemplateContext<T>>>('item');
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.loading());
  protected readonly effectiveVariant = computed<AerisSplitButtonVariant>(() => {
    if (this.text()) return 'ghost';
    if (this.outlined()) return 'outline';
    return this.variant();
  });
  protected readonly menuId = computed(() => `${this.id()}-menu`);
  protected readonly visibleItems = computed<readonly VisibleSplitButtonItem<T>[]>(() =>
    this.model()
      .filter((item) => item.visible !== false)
      .map((item, index) => ({
        item,
        index,
        id: item.id ?? `${this.id()}-item-${index}`,
        href: this.resolveHref(item),
      })),
  );
  protected readonly activeIndex = linkedSignal(() =>
    this.open() ? this.firstEnabledIndex() : -1,
  );
  protected readonly iconContentTemplate = computed(
    () => this.iconTemplate() ?? this.projectedIconTemplate(),
  );
  protected readonly loadingIconContentTemplate = computed(
    () => this.loadingIconTemplate() ?? this.projectedLoadingIconTemplate(),
  );
  protected readonly dropdownIconContentTemplate = computed(
    () => this.dropdownIconTemplate() ?? this.projectedDropdownIconTemplate(),
  );
  protected readonly itemContentTemplate = computed(
    () => this.itemTemplate() ?? this.projectedItemTemplate(),
  );

  protected activatePrimary(event: MouseEvent): void {
    if (!this.effectiveDisabled()) this.clicked.emit(event);
  }

  protected toggleMenu(event: MouseEvent): void {
    this.dropdownClicked.emit(event);
    this.open() ? this.hide(event) : this.show(event);
  }

  protected show(event: Event): void {
    if (this.effectiveDisabled() || this.open()) return;
    this.open.set(true);
    this.shown.emit(event);
  }

  protected hide(event: Event, restoreFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    this.hidden.emit(event);
    if (restoreFocus) {
      queueMicrotask(() => this.toggleButton()?.nativeElement.focus());
    }
  }

  protected activateItem(
    event: MouseEvent | KeyboardEvent,
    entry: VisibleSplitButtonItem<T>,
  ): void {
    if (entry.item.disabled || entry.item.separator) {
      event.preventDefault();
      return;
    }
    const commandEvent = { originalEvent: event, item: entry.item };
    entry.item.command?.(commandEvent);
    this.itemSelected.emit(commandEvent);
    if (entry.item.routerLink && this.navigationHandler()) {
      event.preventDefault();
      this.navigationHandler()?.(entry.item.routerLink, event);
    }
    this.hide(event, true);
  }

  protected itemContext(
    entry: VisibleSplitButtonItem<T>,
  ): AerisSplitButtonItemTemplateContext<T> {
    return { $implicit: entry.item, item: entry.item, index: entry.index };
  }

  protected onToggleKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    this.show(event);
    this.activeIndex.set(
      event.key === 'ArrowUp' ? this.lastEnabledIndex() : this.firstEnabledIndex(),
    );
    this.focusActiveItem();
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(this.firstEnabledIndex());
        this.focusActiveItem();
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(this.lastEnabledIndex());
        this.focusActiveItem();
        break;
      case 'Escape':
        event.preventDefault();
        this.hide(event, true);
        break;
      case 'Tab':
        this.hide(event);
        break;
    }
  }

  protected onDocumentClick(event: Event): void {
    const target = event.target;
    if (
      this.open() &&
      this.hideOnClickOutside() &&
      target instanceof Node &&
      !this.host.nativeElement.contains(target)
    ) {
      this.hide(event);
    }
  }

  private enabledIndexes(): number[] {
    return this.visibleItems().flatMap((entry) =>
      entry.item.disabled || entry.item.separator ? [] : [entry.index],
    );
  }

  private firstEnabledIndex(): number {
    return this.enabledIndexes().at(0) ?? -1;
  }

  private lastEnabledIndex(): number {
    return this.enabledIndexes().at(-1) ?? -1;
  }

  private moveFocus(step: 1 | -1): void {
    const enabled = this.enabledIndexes();
    if (!enabled.length) return;
    const current = enabled.indexOf(this.activeIndex());
    const next = current < 0
      ? (step === 1 ? 0 : enabled.length - 1)
      : (current + step + enabled.length) % enabled.length;
    this.activeIndex.set(enabled[next]);
    this.focusActiveItem();
  }

  private focusActiveItem(): void {
    queueMicrotask(() => {
      const entry = this.visibleItems().find(
        ({ index }) => index === this.activeIndex(),
      );
      if (!entry) return;
      this.menuItems()
        .find(({ nativeElement }) => nativeElement.id === entry.id)
        ?.nativeElement.focus();
    });
  }

  private resolveHref(item: AerisSplitButtonItem<T>): string | null {
    if (item.url) return item.url;
    if (!item.routerLink) return null;
    if (typeof item.routerLink === 'string') return item.routerLink;
    return `/${item.routerLink
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/')}`;
  }
}
