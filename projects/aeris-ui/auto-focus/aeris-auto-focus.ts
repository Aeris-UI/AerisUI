import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';

@Directive({
  selector: '[aerisAutoFocus]',
  exportAs: 'aerisAutoFocus',
  host: {
    '[attr.data-aeris-auto-focus]': 'enabled() ? "true" : "false"',
  },
})
export class AerisAutoFocusDirective {
  readonly enabled = input<boolean, boolean | string | null>(true, {
    alias: 'aerisAutoFocus',
    transform: booleanAttribute,
  });
  readonly preventScroll = input<boolean, boolean | string | null>(true, {
    alias: 'aerisAutoFocusPreventScroll',
    transform: booleanAttribute,
  });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private rendered = false;

  constructor() {
    afterNextRender(() => {
      this.rendered = true;
      if (this.enabled()) this.focus();
    });

    let wasEnabled = this.enabled();
    effect(() => {
      const enabled = this.enabled();
      const shouldFocus = this.rendered && enabled && !wasEnabled;
      wasEnabled = enabled;

      if (shouldFocus) untracked(() => this.focus());
    });
  }

  focus(options?: FocusOptions): boolean {
    if (!isPlatformBrowser(this.platformId) || !this.canFocus()) return false;

    this.element.focus(options ?? { preventScroll: this.preventScroll() });
    return this.element.ownerDocument.activeElement === this.element;
  }

  private canFocus(): boolean {
    if (!this.element.isConnected || this.element.hidden || this.element.inert) return false;
    if (this.element.getAttribute('aria-hidden') === 'true') return false;
    if ('disabled' in this.element && Boolean(this.element.disabled)) return false;
    return true;
  }
}

export const AerisAutoFocusModule = [AerisAutoFocusDirective] as const;
