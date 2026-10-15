import { NgTemplateOutlet } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  effect,
  viewChild,
  booleanAttribute,
  computed,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { aerisInternalObserveViewport } from '@aeris-ui/core';

export type AerisScrollTopBehavior = 'auto' | 'smooth';
export type AerisScrollTopPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type AerisScrollTopSize = 'sm' | 'md' | 'lg';
export type AerisScrollTopStrategy = 'fixed' | 'absolute';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'aeris-scroll-top',
  template: `
    @if (visible()) {
      <button
        #scrollButton
        class="aeris-scroll-top"
        type="button"
        [attr.data-position]="position()"
        [attr.data-size]="size()"
        [attr.data-strategy]="strategy()"
        [attr.aria-label]="ariaLabel()"
        (click)="scrollToTop($event)"
      >
        @if (iconTemplate(); as customIcon) {
          <span
            class="aeris-custom-icon"
            aria-hidden="true"
            focusable="false"
            data-aeris-custom-icon
            ><ng-container [ngTemplateOutlet]="customIcon"
          /></span>
        } @else {
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path d="m18 15-6-6-6 6" />
          </svg>
        }
      </button>
    }
  `,
  styleUrl: './aeris-scroll-top.scss',
  host: {
    '(window:scroll)': 'handleScroll()',
  },
})
export class AerisScrollTop {
  readonly iconTemplate = input<TemplateRef<void>>();

  private readonly scrollButton = viewChild<ElementRef<HTMLElement>>('scrollButton');
  constructor() {
    effect((onCleanup) => {
      const button = this.scrollButton()?.nativeElement;
      if (button && this.strategy() === 'fixed')
        onCleanup(aerisInternalObserveViewport(button, this.document));
    });
  }
  readonly threshold = input(320, { transform: numberAttribute });
  readonly behavior = input<AerisScrollTopBehavior>('smooth');
  readonly position = input<AerisScrollTopPosition>('bottom-right');
  readonly size = input<AerisScrollTopSize>('md');
  readonly strategy = input<AerisScrollTopStrategy>('fixed');
  readonly ariaLabel = input('Scroll to top');
  readonly alwaysVisible = input(false, { transform: booleanAttribute });

  readonly clicked = output<MouseEvent>();
  readonly visibilityChanged = output<boolean>();

  private readonly document = inject(DOCUMENT);
  private readonly overThreshold = signal(false);
  protected readonly visible = computed(() => this.alwaysVisible() || this.overThreshold());
  private lastVisible = false;

  handleScroll(): void {
    const nextVisible = this.scrollY() >= Math.max(0, this.threshold());
    this.overThreshold.set(nextVisible);
    const visible = this.visible();
    if (visible !== this.lastVisible) {
      this.lastVisible = visible;
      this.visibilityChanged.emit(visible);
    }
  }

  scrollToTop(event: MouseEvent): void {
    this.clicked.emit(event);
    this.document.defaultView?.scrollTo({
      top: 0,
      left: 0,
      behavior: this.behavior(),
    });
  }

  private scrollY(): number {
    const window = this.document.defaultView;
    return window?.scrollY ?? this.document.documentElement.scrollTop ?? 0;
  }
}
