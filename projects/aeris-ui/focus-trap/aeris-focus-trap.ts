import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  Renderer2,
  booleanAttribute,
  effect,
  inject,
  input,
} from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

@Directive({
  selector: '[aerisFocusTrap]',
  exportAs: 'aerisFocusTrap',
  host: {
    '[attr.data-aeris-focus-trap]': 'enabled() ? "true" : null',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class AerisFocusTrapDirective {
  readonly enabled = input<boolean, boolean | string | null>(true, {
    alias: 'aerisFocusTrap',
    transform: booleanAttribute,
  });
  readonly preventScroll = input<boolean, boolean | string | null>(true, {
    alias: 'aerisFocusTrapPreventScroll',
    transform: booleanAttribute,
  });

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private ownsHostTabIndex = false;

  constructor() {
    effect(() => {
      if (!this.enabled()) this.releaseHostTabIndex();
    });
    this.destroyRef.onDestroy(() => this.releaseHostTabIndex());
  }

  focusFirst(options?: FocusOptions): boolean {
    return this.focusBoundary('first', options);
  }

  focusLast(options?: FocusOptions): boolean {
    return this.focusBoundary('last', options);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (
      !this.enabled() ||
      !this.isBrowser ||
      event.defaultPrevented ||
      event.key !== 'Tab' ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !this.isNearestActiveTrap(event.target)
    ) {
      return;
    }

    const focusable = this.focusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.focusHost();
      return;
    }

    this.releaseHostTabIndex();
    const active = this.activeElement();
    if (!this.shouldWrap(active, focusable, event.shiftKey)) return;

    event.preventDefault();
    const target = event.shiftKey ? focusable.at(-1) : focusable[0];
    if (target) this.focusElement(target);
  }

  private focusBoundary(boundary: 'first' | 'last', options?: FocusOptions): boolean {
    if (!this.isBrowser) return false;
    const focusable = this.focusableElements();
    const target = boundary === 'first' ? focusable[0] : focusable.at(-1);
    if (target) {
      this.releaseHostTabIndex();
      return this.focusElement(target, options);
    }
    return this.focusHost(options);
  }

  private focusableElements(): readonly HTMLElement[] {
    return [...this.element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      .filter((element) => this.isFocusable(element))
      .sort((left, right) => {
        const leftOrder = left.tabIndex > 0 ? left.tabIndex : Number.MAX_SAFE_INTEGER;
        const rightOrder = right.tabIndex > 0 ? right.tabIndex : Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
      });
  }

  private isFocusable(element: HTMLElement): boolean {
    if (!this.isAvailable(element)) return false;
    return !(element instanceof HTMLInputElement) || this.isRadioTabStop(element);
  }

  private isAvailable(element: HTMLElement): boolean {
    if (element.tabIndex < 0 || element.matches(':disabled') || element.hidden || element.inert) {
      return false;
    }
    if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
    if (element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;

    const closedDetails = element.closest('details:not([open])');
    if (closedDetails && closedDetails.querySelector('summary') !== element) return false;

    const view = this.document.defaultView;
    for (let current: HTMLElement | null = element; current; current = current.parentElement) {
      const style = view?.getComputedStyle(current);
      if (
        style?.display === 'none' ||
        style?.visibility === 'hidden' ||
        style?.visibility === 'collapse'
      ) {
        return false;
      }
      if (current === this.element) break;
    }
    return true;
  }

  private isRadioTabStop(element: HTMLInputElement): boolean {
    if (element.type !== 'radio' || !element.name) return true;

    const group = [
      ...this.element.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ].filter(
      (radio) =>
        radio.name === element.name && radio.form === element.form && this.isAvailable(radio),
    );
    const checked = group.find((radio) => radio.checked);
    return checked ? checked === element : group[0] === element;
  }

  private shouldWrap(
    active: Element | null,
    focusable: readonly HTMLElement[],
    reverse: boolean,
  ): boolean {
    if (!active || active === this.element || !this.element.contains(active)) return true;

    const boundary = reverse ? focusable[0] : focusable.at(-1);
    if (active === boundary) return true;
    if (focusable.includes(active as HTMLElement)) return false;

    const direction = reverse ? 2 : 4;
    return !focusable.some((candidate) => active.compareDocumentPosition(candidate) & direction);
  }

  private isNearestActiveTrap(target: EventTarget | null): boolean {
    const targetElement = target instanceof Element ? target : this.element;
    return targetElement.closest('[data-aeris-focus-trap="true"]') === this.element;
  }

  private focusElement(element: HTMLElement, options?: FocusOptions): boolean {
    element.focus(options ?? { preventScroll: this.preventScroll() });
    return this.activeElement() === element;
  }

  private focusHost(options?: FocusOptions): boolean {
    if (!this.element.hasAttribute('tabindex')) {
      this.renderer.setAttribute(this.element, 'tabindex', '-1');
      this.ownsHostTabIndex = true;
    }
    return this.focusElement(this.element, options);
  }

  private releaseHostTabIndex(): void {
    if (!this.ownsHostTabIndex) return;
    this.renderer.removeAttribute(this.element, 'tabindex');
    this.ownsHostTabIndex = false;
  }

  private activeElement(): Element | null {
    return this.document.activeElement;
  }
}

export const AerisFocusTrapModule = [AerisFocusTrapDirective] as const;
