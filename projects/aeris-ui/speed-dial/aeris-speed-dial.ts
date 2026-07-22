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
  viewChildren,
} from '@angular/core';

export type AerisSpeedDialDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

export type AerisSpeedDialType =
  | 'linear'
  | 'circle'
  | 'semi-circle'
  | 'quarter-circle';

export const AERIS_SPEED_DIAL_ITEM_LIMITS: Readonly<Record<AerisSpeedDialType, number>> = {
  linear: 5,
  circle: 8,
  'semi-circle': 7,
  'quarter-circle': 5,
};

export interface AerisSpeedDialCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSpeedDialItem<T>;
}

export interface AerisSpeedDialItem<T = unknown> {
  readonly id?: string;
  readonly label: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSpeedDialCommandEvent<T>) => void;
}

export interface AerisSpeedDialButtonProps {
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

export type AerisSpeedDialNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

export interface AerisSpeedDialItemTemplateContext<T = unknown> {
  readonly $implicit: AerisSpeedDialItem<T>;
  readonly item: AerisSpeedDialItem<T>;
  readonly index: number;
}

export interface AerisSpeedDialIconTemplateContext {
  readonly open: boolean;
  readonly toggle: (event: MouseEvent) => void;
}

interface PositionedSpeedDialItem<T> {
  readonly item: AerisSpeedDialItem<T>;
  readonly index: number;
  readonly id: string;
  readonly delay: string;
  readonly left: string | null;
  readonly right: string | null;
  readonly top: string | null;
  readonly bottom: string | null;
  readonly href: string | null;
}

let speedDialId = 0;

@Component({
  selector: 'aeris-speed-dial',
  imports: [NgTemplateOutlet],
  template: `
    @if (mask() && visible()) {
      <button
        type="button"
        class="aeris-speed-dial__mask"
        [class]="maskClass()"
        [attr.data-backdrop-blur]="backdropBlur() || null"
        [style.--aeris-speed-dial-backdrop-blur]="backdropBlurAmount() || null"
        tabindex="-1"
        aria-label="Close action menu"
        (click)="hide($event)"
      ></button>
    }

    <div class="aeris-speed-dial__container">
      <ul
        class="aeris-speed-dial__list"
        [id]="menuId()"
        role="menu"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [attr.aria-hidden]="!visible()"
        [attr.inert]="visible() ? null : ''"
        (keydown)="onMenuKeydown($event)"
      >
        @for (positioned of positionedItems(); track positioned.id) {
          <li
            class="aeris-speed-dial__item"
            [attr.data-visible]="visible() || null"
            [style.--aeris-speed-dial-delay]="positioned.delay"
            [style.--aeris-speed-dial-index]="positioned.index"
            [style.left]="positioned.left"
            [style.right]="positioned.right"
            [style.top]="positioned.top"
            [style.bottom]="positioned.bottom"
          >
            @if (positioned.item.url || positioned.item.routerLink) {
              <a
                #action
                class="aeris-speed-dial__action"
                [class.aeris-speed-dial__action--disabled]="positioned.item.disabled"
                role="menuitem"
                [attr.id]="positioned.id"
                [attr.href]="positioned.item.disabled ? null : positioned.href"
                [attr.target]="positioned.item.target"
                [attr.rel]="positioned.item.rel || (positioned.item.target === '_blank' ? 'noopener noreferrer' : null)"
                [attr.aria-label]="positioned.item.ariaLabel ?? positioned.item.label"
                [attr.aria-disabled]="positioned.item.disabled || null"
                [attr.tabindex]="visible() && focusedIndex() === positioned.index && !positioned.item.disabled ? 0 : -1"
                (click)="activate($event, positioned)"
                (focus)="focusedIndex.set(positioned.index)"
              >
                <ng-container
                  [ngTemplateOutlet]="itemContentTemplate()"
                  [ngTemplateOutletContext]="itemContext(positioned)"
                />
                @if (!itemContentTemplate()) {
                  <span class="aeris-speed-dial__action-icon" aria-hidden="true">
                    {{ positioned.item.icon ?? positioned.item.label.slice(0, 1) }}
                  </span>
                }
              </a>
            } @else {
              <button
                #action
                type="button"
                class="aeris-speed-dial__action"
                role="menuitem"
                [attr.id]="positioned.id"
                [attr.aria-label]="positioned.item.ariaLabel ?? positioned.item.label"
                [disabled]="positioned.item.disabled"
                [attr.tabindex]="visible() && focusedIndex() === positioned.index && !positioned.item.disabled ? 0 : -1"
                (click)="activate($event, positioned)"
                (focus)="focusedIndex.set(positioned.index)"
              >
                <ng-container
                  [ngTemplateOutlet]="itemContentTemplate()"
                  [ngTemplateOutletContext]="itemContext(positioned)"
                />
                @if (!itemContentTemplate()) {
                  <span class="aeris-speed-dial__action-icon" aria-hidden="true">
                    {{ positioned.item.icon ?? positioned.item.label.slice(0, 1) }}
                  </span>
                }
              </button>
            }

          </li>
        }
      </ul>

      @if (buttonContentTemplate(); as template) {
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="{ open: visible(), toggle: toggleCallback }"
        />
      } @else {
        <button
          #trigger
          type="button"
          class="aeris-speed-dial__trigger"
          [class]="buttonClass()"
          [attr.data-size]="buttonProps()?.size ?? 'md'"
          [attr.title]="buttonProps()?.title"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.aria-controls]="menuId()"
          [attr.aria-expanded]="visible()"
          aria-haspopup="menu"
          [disabled]="disabled()"
          (click)="toggle($event)"
          (keydown)="onTriggerKeydown($event)"
        >
          @if (iconContentTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ open: visible(), toggle: toggleCallback }"
            />
          } @else {
            <span
              class="aeris-speed-dial__trigger-icon"
              [attr.data-rotate]="rotateAnimation() && !hideIcon() ? true : null"
              aria-hidden="true"
            >{{ visible() && hideIcon() ? hideIcon() : showIcon() }}</span>
          }
        </button>
      }
    </div>
  `,
  styleUrl: './aeris-speed-dial.scss',
  host: {
    class: 'aeris-speed-dial',
    '[attr.data-type]': 'type()',
    '[attr.data-direction]': 'direction()',
    '[attr.data-open]': 'visible() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-truncated]': 'hasOverflowItems() || null',
    '[style.--aeris-speed-dial-radius]': 'radius() + "px"',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AerisSpeedDial<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly generatedId = `aeris-speed-dial-${++speedDialId}`;
  private readonly actions = viewChildren<ElementRef<HTMLElement>>('action');
  private readonly trigger = viewChildren<ElementRef<HTMLButtonElement>>('trigger');

  readonly id = input(this.generatedId);
  readonly model = input<readonly AerisSpeedDialItem<T>[]>([]);
  readonly visible = model(false);
  readonly direction = input<AerisSpeedDialDirection>('up');
  readonly transitionDelay = input(30);
  readonly type = input<AerisSpeedDialType>('linear');
  readonly maxItems = input<number>();
  readonly radius = input(0);
  readonly mask = input(false, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hideOnClickOutside = input(true, { transform: booleanAttribute });
  readonly buttonClass = input('');
  readonly maskClass = input('');
  readonly showIcon = input('+');
  readonly hideIcon = input('');
  readonly rotateAnimation = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Open actions');
  readonly ariaLabelledBy = input<string>();
  readonly buttonProps = input<AerisSpeedDialButtonProps>();
  readonly buttonTemplate = input<TemplateRef<AerisSpeedDialIconTemplateContext>>();
  readonly itemTemplate = input<TemplateRef<AerisSpeedDialItemTemplateContext<T>>>();
  readonly iconTemplate = input<TemplateRef<AerisSpeedDialIconTemplateContext>>();
  readonly navigationHandler = input<AerisSpeedDialNavigationHandler>();

  readonly clicked = output<MouseEvent>();
  readonly shown = output<Event>();
  readonly hidden = output<Event>();
  readonly itemSelected = output<AerisSpeedDialCommandEvent<T>>();

  protected readonly projectedButtonTemplate =
    contentChild<TemplateRef<AerisSpeedDialIconTemplateContext>>('button');
  protected readonly projectedItemTemplate =
    contentChild<TemplateRef<AerisSpeedDialItemTemplateContext<T>>>('item');
  protected readonly projectedIconTemplate =
    contentChild<TemplateRef<AerisSpeedDialIconTemplateContext>>('icon');
  protected readonly toggleCallback = (event: MouseEvent): void => this.toggle(event);
  protected readonly menuId = computed(() => `${this.id()}-menu`);
  protected readonly buttonContentTemplate = computed(
    () => this.buttonTemplate() ?? this.projectedButtonTemplate(),
  );
  protected readonly itemContentTemplate = computed(
    () => this.itemTemplate() ?? this.projectedItemTemplate(),
  );
  protected readonly iconContentTemplate = computed(
    () => this.iconTemplate() ?? this.projectedIconTemplate(),
  );
  protected readonly layoutItemLimit = computed(() => {
    const layoutLimit = AERIS_SPEED_DIAL_ITEM_LIMITS[this.type()];
    const requestedLimit = this.maxItems();
    if (requestedLimit === undefined || !Number.isFinite(requestedLimit)) {
      return layoutLimit;
    }
    return Math.max(0, Math.min(Math.floor(requestedLimit), layoutLimit));
  });
  protected readonly availableItems = computed(() =>
    this.model().filter((item) => item.visible !== false),
  );
  protected readonly visibleItems = computed(() =>
    this.availableItems().slice(0, this.layoutItemLimit()),
  );
  protected readonly hasOverflowItems = computed(
    () => this.availableItems().length > this.layoutItemLimit(),
  );
  protected readonly focusedIndex = linkedSignal(() =>
    this.visible() ? this.firstEnabledIndex() : -1,
  );
  protected readonly positionedItems = computed<readonly PositionedSpeedDialItem<T>[]>(() => {
    const items = this.visibleItems();
    return items.map((item, index) => {
      const point = this.calculatePoint(index, items.length);
      const delayIndex = this.visible() ? index : items.length - index - 1;
      return {
        item,
        index,
        id: item.id ?? `${this.id()}-item-${index}`,
        delay: `${Math.max(0, delayIndex * this.transitionDelay())}ms`,
        href: this.resolveHref(item),
        ...point,
      };
    });
  });

  protected itemContext(
    positioned: PositionedSpeedDialItem<T>,
  ): AerisSpeedDialItemTemplateContext<T> {
    return {
      $implicit: positioned.item,
      item: positioned.item,
      index: positioned.index,
    };
  }

  protected toggle(event: MouseEvent): void {
    this.clicked.emit(event);
    this.visible() ? this.hide(event) : this.show(event);
  }

  protected show(event: Event): void {
    if (this.disabled() || this.visible()) return;
    this.visible.set(true);
    const index = this.firstEnabledIndex();
    this.focusedIndex.set(index);
    this.shown.emit(event);
  }

  protected hide(event: Event, restoreFocus = false): void {
    if (!this.visible()) return;
    this.visible.set(false);
    this.focusedIndex.set(-1);
    this.hidden.emit(event);
    if (restoreFocus) {
      queueMicrotask(() => this.trigger().at(0)?.nativeElement.focus());
    }
  }

  protected activate(
    event: MouseEvent | KeyboardEvent,
    positioned: PositionedSpeedDialItem<T>,
  ): void {
    if (positioned.item.disabled) {
      event.preventDefault();
      return;
    }
    const commandEvent = { originalEvent: event, item: positioned.item };
    positioned.item.command?.(commandEvent);
    this.itemSelected.emit(commandEvent);
    if (positioned.item.routerLink && this.navigationHandler()) {
      event.preventDefault();
      this.navigationHandler()?.(positioned.item.routerLink, event);
    }
    this.hide(event, true);
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    this.show(event);
    const useLast = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    this.focusedIndex.set(useLast ? this.lastEnabledIndex() : this.firstEnabledIndex());
    this.focusActiveItem();
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusedIndex.set(this.firstEnabledIndex());
        this.focusActiveItem();
        break;
      case 'End':
        event.preventDefault();
        this.focusedIndex.set(this.lastEnabledIndex());
        this.focusActiveItem();
        break;
      case 'Escape':
        event.preventDefault();
        this.hide(event, true);
        break;
    }
  }

  protected onDocumentClick(event: Event): void {
    const target = event.target;
    const host = this.host.nativeElement;
    if (
      this.visible() &&
      this.hideOnClickOutside() &&
      target instanceof Node &&
      host &&
      !host.contains(target)
    ) {
      this.hide(event);
    }
  }

  private moveFocus(step: 1 | -1): void {
    const enabled = this.enabledIndexes();
    if (!enabled.length) return;
    const current = enabled.indexOf(this.focusedIndex());
    const next = current < 0
      ? (step === 1 ? 0 : enabled.length - 1)
      : (current + step + enabled.length) % enabled.length;
    this.focusedIndex.set(enabled[next]);
    this.focusActiveItem();
  }

  private focusActiveItem(): void {
    queueMicrotask(() => this.actions().at(this.focusedIndex())?.nativeElement.focus());
  }

  private enabledIndexes(): number[] {
    return this.visibleItems().flatMap((item, index) => item.disabled ? [] : [index]);
  }

  private firstEnabledIndex(): number {
    return this.enabledIndexes().at(0) ?? -1;
  }

  private lastEnabledIndex(): number {
    return this.enabledIndexes().at(-1) ?? -1;
  }

  private calculatePoint(
    index: number,
    length: number,
  ): Pick<PositionedSpeedDialItem<T>, 'left' | 'right' | 'top' | 'bottom'> {
    if (this.type() === 'linear') {
      const offset = `calc(
        (var(--aeris-speed-dial-size) + var(--aeris-speed-dial-item-size)) / 2
        + var(--aeris-speed-dial-gap)
        + (var(--aeris-speed-dial-item-size) + var(--aeris-speed-dial-gap)) * ${index}
      )`;
      if (this.direction() === 'up') {
        return { left: '0px', top: `calc(-1 * ${offset})`, right: null, bottom: null };
      }
      if (this.direction() === 'down') {
        return { left: '0px', top: offset, right: null, bottom: null };
      }
      if (this.direction() === 'left') {
        return { left: `calc(-1 * ${offset})`, top: '0px', right: null, bottom: null };
      }
      return { left: offset, top: '0px', right: null, bottom: null };
    }

    const radius = this.radius() || length * 24;
    const safeLength = Math.max(length - 1, 1);
    let x = 0;
    let y = 0;

    if (this.type() === 'circle') {
      const angle = (2 * Math.PI * index) / Math.max(length, 1);
      x = radius * Math.cos(angle);
      y = radius * Math.sin(angle);
    } else if (this.type() === 'semi-circle') {
      const angle = (Math.PI * index) / safeLength;
      x = radius * Math.cos(angle);
      y = radius * Math.sin(angle);
    } else {
      const angle = (Math.PI * index) / (2 * safeLength);
      x = radius * Math.cos(angle);
      y = radius * Math.sin(angle);
    }

    return this.orientPoint(x, y);
  }

  private resolveHref(item: AerisSpeedDialItem<T>): string | null {
    if (item.url) return item.url;
    if (!item.routerLink) return null;
    if (typeof item.routerLink === 'string') return item.routerLink;
    return `/${item.routerLink
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/')}`;
  }

  private orientPoint(
    x: number,
    y: number,
  ): Pick<PositionedSpeedDialItem<T>, 'left' | 'right' | 'top' | 'bottom'> {
    const px = (value: number) => `${Math.round(value * 100) / 100}px`;
    const direction = this.direction();
    const point = (left: number, top: number) => ({
      left: px(left),
      top: px(top),
      right: null,
      bottom: null,
    });

    if (this.type() === 'circle') {
      return point(x, y);
    }
    if (this.type() === 'semi-circle') {
      if (direction === 'down') return point(x, y);
      if (direction === 'left') return point(-y, x);
      if (direction === 'right') return point(y, x);
      return point(x, -y);
    }
    if (direction === 'up-left') return point(-x, -y);
    if (direction === 'up-right') return point(x, -y);
    if (direction === 'down-left') return point(-x, y);
    return point(x, y);
  }
}
