import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
  afterRenderEffect,
} from '@angular/core';
import {
  ɵlockAerisDocumentScroll,
  ɵunlockAerisDocumentScroll,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
} from '@aeris-ui/core';

@Component({
  selector: 'aeris-block-ui',
  template: `
    <div
      #blockedContent
      class="aeris-block-ui__content"
      [attr.inert]="blocked() ? '' : null"
      [attr.aria-busy]="blocked()"
    >
      <ng-content />
    </div>

    @if (blocked()) {
      <div
        class="aeris-block-ui__overlay"
        aria-hidden="true"
        [attr.data-fullscreen]="fullScreen() || null"
        [attr.data-backdrop-blur]="backdropBlur() || null"
        [style.--aeris-block-ui-backdrop-blur]="backdropBlurAmount() || null"
        [style.border-radius]="fullScreen() ? null : targetRadius()"
      ></div>
    }
  `,
  styleUrl: './aeris-block-ui.scss',
  host: {
    class: 'aeris-block-ui',
    '[attr.data-blocked]': 'blocked() || null',
    '[attr.data-fullscreen]': 'fullScreen() || null',
    '[attr.aria-busy]': 'blocked()',
    '[attr.tabindex]': 'blocked() ? -1 : null',
  },
})
export class AerisBlockUI {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private scrollLocked = false;
  private readonly previouslyFocused = signal<HTMLElement | null>(null);
  private previousBlocked = false;
  protected readonly targetRadius = signal<string | null>(null);

  protected readonly blockedContent = viewChild<ElementRef<HTMLElement>>('blockedContent');

  readonly blocked = model(false);
  readonly fullScreen = input(false, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');

  constructor() {
    afterRenderEffect({
      read: () => {
        if (!this.blocked() || this.fullScreen()) return;
        const content = this.blockedContent()?.nativeElement;
        const view = this.document.defaultView;
        if (!content || !view) return;
        const hostRadius = view.getComputedStyle(this.host.nativeElement).borderRadius;
        const target = content.childElementCount === 1 ? content.firstElementChild : null;
        this.targetRadius.set(
          target && hostRadius === '0px'
            ? view.getComputedStyle(target).borderRadius
            : hostRadius || null,
        );
      },
    });
    this.destroyRef.onDestroy(() => this.unlockScroll());

    effect(() => {
      const blocked = this.blocked();
      if (blocked === this.previousBlocked) return;
      if (blocked) this.activate();
      else this.release();
      this.previousBlocked = blocked;
    });

    effect((onCleanup) => {
      if (!this.blocked() || !this.fullScreen()) return;
      ɵregisterAerisOverlay(this.document, this.host.nativeElement);
      const keydown = (event: KeyboardEvent) => this.guardFullscreenFocus(event);
      this.document.addEventListener('keydown', keydown);
      onCleanup(() => {
        ɵunregisterAerisOverlay(this.document, this.host.nativeElement);
        this.document.removeEventListener('keydown', keydown);
      });
    });
  }

  protected guardFullscreenFocus(event: KeyboardEvent): void {
    if (!this.blocked() || !this.fullScreen() || event.key !== 'Tab') return;
    event.preventDefault();
    this.host.nativeElement.focus();
  }

  private activate(): void {
    const active = this.activeElement();
    const content = this.blockedContent()?.nativeElement;
    const moveFocus = this.fullScreen() || (!!active && !!content?.contains(active));
    this.previouslyFocused.set(moveFocus ? active : null);
    if (this.fullScreen()) this.lockScroll();
    if (moveFocus) queueMicrotask(() => this.host.nativeElement.focus());
  }

  private release(): void {
    this.unlockScroll();
    const previous = this.previouslyFocused();
    this.previouslyFocused.set(null);
    if (previous) queueMicrotask(() => previous.focus());
  }

  private lockScroll(): void {
    if (this.scrollLocked) return;
    ɵlockAerisDocumentScroll(this.document);
    this.scrollLocked = true;
  }

  private unlockScroll(): void {
    if (!this.scrollLocked) return;
    ɵunlockAerisDocumentScroll(this.document);
    this.scrollLocked = false;
  }

  private activeElement(): HTMLElement | null {
    const active = this.document.activeElement;
    return active instanceof HTMLElement ? active : null;
  }
}

export const AerisBlockUIModule = [AerisBlockUI] as const;
