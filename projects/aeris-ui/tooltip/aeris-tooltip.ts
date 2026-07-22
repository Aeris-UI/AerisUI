import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  TemplateRef,
  booleanAttribute,
  computed,
  createComponent,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type AerisTooltipPosition = 'top' | 'right' | 'bottom' | 'left';
export type AerisTooltipEvent = 'hover' | 'focus' | 'both';
export type AerisTooltipContent = string | TemplateRef<AerisTooltipTemplateContext> | null | undefined;
export type AerisTooltipCloseReason = 'api' | 'escape' | 'blur' | 'pointerleave' | 'disabled';

export interface AerisTooltipTemplateContext {
  readonly $implicit: string;
}

export interface AerisTooltipVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisTooltipCloseReason | 'show';
}

let nextTooltipId = 0;

@Component({
  selector: 'aeris-tooltip-overlay',
  imports: [NgTemplateOutlet],
  template: `
    <div
      [class]="panelClass()"
      role="tooltip"
      [id]="id()"
      [attr.data-position]="position()"
      [attr.data-interactive]="interactive() || null"
      [style.left.px]="coordinates().x"
      [style.top.px]="coordinates().y"
      [style.--aeris-tooltip-max-width]="maxWidth() || null"
    >
      <span class="aeris-tooltip__arrow" aria-hidden="true"></span>
      @if (templateContent(); as template) {
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="templateContext()"
        />
      } @else {
        {{ text() }}
      }
    </div>
  `,
  styleUrl: './aeris-tooltip.scss',
})
export class AerisTooltipOverlay {
  readonly id = signal('');
  readonly text = signal('');
  readonly templateContent = signal<TemplateRef<AerisTooltipTemplateContext> | null>(null);
  readonly position = signal<AerisTooltipPosition>('top');
  readonly coordinates = signal({ x: 0, y: 0 });
  readonly interactive = signal(false);
  readonly maxWidth = signal('');
  readonly styleClass = signal('');
  protected readonly panelClass = computed(() =>
    ['aeris-tooltip__panel', this.styleClass()].filter(Boolean).join(' '),
  );
  protected readonly templateContext = computed<AerisTooltipTemplateContext>(() => ({
    $implicit: this.text(),
  }));
}

@Directive({
  selector: '[aerisTooltip]',
  exportAs: 'aerisTooltip',
  host: {
    '(pointerenter)': 'handlePointerEnter($event)',
    '(pointerleave)': 'handlePointerLeave($event)',
    '(focusin)': 'handleFocusIn($event)',
    '(focusout)': 'handleFocusOut($event)',
    '(keydown.escape)': 'handleEscape($event)',
  },
})
export class AerisTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private overlayRef: ComponentRef<AerisTooltipOverlay> | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private overlayPanel: HTMLElement | null = null;
  private overlayPointerInside = false;
  private visible = false;
  private readonly tooltipId = `aeris-tooltip-${nextTooltipId++}`;

  readonly content = input<AerisTooltipContent>('', { alias: 'aerisTooltip' });
  readonly position = input<AerisTooltipPosition>('top', { alias: 'aerisTooltipPosition' });
  readonly event = input<AerisTooltipEvent>('both', { alias: 'aerisTooltipEvent' });
  readonly showDelay = input(0, { alias: 'aerisTooltipShowDelay' });
  readonly hideDelay = input(0, { alias: 'aerisTooltipHideDelay' });
  readonly disabled = input(false, { alias: 'aerisTooltipDisabled', transform: booleanAttribute });
  readonly autoHide = input(true, { alias: 'aerisTooltipAutoHide', transform: booleanAttribute });
  readonly offset = input(8, { alias: 'aerisTooltipOffset' });
  readonly viewportMargin = input(6, { alias: 'aerisTooltipViewportMargin' });
  readonly maxWidth = input('', { alias: 'aerisTooltipMaxWidth' });
  readonly styleClass = input('', { alias: 'aerisTooltipStyleClass' });
  readonly truncatedOnly = input(false, {
    alias: 'aerisTooltipTruncatedOnly',
    transform: booleanAttribute,
  });

  readonly shown = output<AerisTooltipVisibilityEvent>({ alias: 'aerisTooltipShown' });
  readonly hidden = output<AerisTooltipVisibilityEvent>({ alias: 'aerisTooltipHidden' });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearShowTimer();
      this.clearHideTimer();
      this.removeTooltipDescription();
      this.destroyOverlay();
    });
  }

  show(originalEvent: Event | null = null): void {
    if (this.disabled() || !this.hasContent() || !this.canShowForSize()) {
      this.hide(originalEvent, 'disabled');
      return;
    }

    this.clearHideTimer();
    this.clearShowTimer();
    const delay = Math.max(0, this.showDelay());
    if (delay > 0) {
      this.showTimer = setTimeout(() => this.open(originalEvent), delay);
    } else {
      this.open(originalEvent);
    }
  }

  hide(
    originalEvent: Event | null = null,
    reason: AerisTooltipCloseReason = 'api',
  ): void {
    this.clearShowTimer();
    this.clearHideTimer();
    const delay = Math.max(0, this.hideDelay());
    if (delay > 0) {
      this.hideTimer = setTimeout(() => this.close(originalEvent, reason), delay);
    } else {
      this.close(originalEvent, reason);
    }
  }

  protected handlePointerEnter(event: PointerEvent): void {
    if (this.event() === 'focus') return;
    this.show(event);
  }

  protected handlePointerLeave(event: PointerEvent): void {
    if (this.event() === 'focus') return;
    if (!this.autoHide() && this.overlayPointerInside) return;
    this.hide(event, 'pointerleave');
  }

  protected handleFocusIn(event: FocusEvent): void {
    if (this.event() === 'hover') return;
    this.show(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (this.event() === 'hover') return;
    this.hide(event, 'blur');
  }

  protected handleEscape(event: Event): void {
    if (!this.visible) return;
    event.preventDefault();
    this.hide(event, 'escape');
  }

  private open(originalEvent: Event | null): void {
    if (this.disabled() || !this.hasContent() || !this.canShowForSize()) return;
    const overlay = this.ensureOverlay();
    const content = this.content();

    overlay.instance.id.set(this.tooltipId);
    overlay.instance.position.set(this.position());
    overlay.instance.interactive.set(!this.autoHide());
    overlay.instance.maxWidth.set(this.maxWidth());
    overlay.instance.styleClass.set(this.styleClass());
    if (content instanceof TemplateRef) {
      overlay.instance.templateContent.set(content);
      overlay.instance.text.set('');
    } else {
      overlay.instance.templateContent.set(null);
      overlay.instance.text.set(String(content ?? ''));
    }

    overlay.changeDetectorRef.detectChanges();
    this.bindOverlayPanel(overlay);
    this.reposition();
    this.addTooltipDescription();

    if (!this.visible) {
      this.visible = true;
      this.shown.emit({ originalEvent, visible: true, reason: 'show' });
    }
  }

  private close(originalEvent: Event | null, reason: AerisTooltipCloseReason): void {
    if (!this.overlayRef && !this.visible) return;
    this.removeTooltipDescription();
    this.destroyOverlay();
    if (!this.visible) return;
    this.visible = false;
    this.hidden.emit({ originalEvent, visible: false, reason });
  }

  private ensureOverlay(): ComponentRef<AerisTooltipOverlay> {
    if (this.overlayRef) return this.overlayRef;

    const overlayRef = createComponent(AerisTooltipOverlay, {
      environmentInjector: this.environmentInjector,
    });
    this.overlayRef = overlayRef;
    this.appRef.attachView(overlayRef.hostView);
    this.document.body.appendChild(this.rootNode(overlayRef));
    const element = this.rootElement(overlayRef);
    element.addEventListener('pointerenter', this.handleOverlayPointerEnter);
    element.addEventListener('pointerleave', this.handleOverlayPointerLeave);
    return overlayRef;
  }

  private destroyOverlay(): void {
    const overlayRef = this.overlayRef;
    if (!overlayRef) return;
    const element = this.rootElement(overlayRef);
    element.removeEventListener('pointerenter', this.handleOverlayPointerEnter);
    element.removeEventListener('pointerleave', this.handleOverlayPointerLeave);
    this.overlayPanel?.removeEventListener('pointerenter', this.handleOverlayPointerEnter);
    this.overlayPanel?.removeEventListener('pointerleave', this.handleOverlayPointerLeave);
    this.overlayPanel = null;
    this.appRef.detachView(overlayRef.hostView);
    overlayRef.destroy();
    this.overlayRef = null;
    this.overlayPointerInside = false;
  }

  private reposition(): void {
    const overlay = this.overlayRef;
    if (!overlay) return;
    const panel = this.rootElement(overlay).querySelector<HTMLElement>('.aeris-tooltip__panel');
    const view = this.document.defaultView;
    if (!panel || !view) return;

    const targetRect = this.host.nativeElement.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const width = panelRect.width || panel.offsetWidth || 160;
    const height = panelRect.height || panel.offsetHeight || 38;
    const offset = this.offset();
    const margin = this.viewportMargin();
    const raw = this.rawPosition(this.position(), targetRect, width, height, offset);
    const maxX = view.innerWidth - width - margin;
    const maxY = view.innerHeight - height - margin;
    const x = this.clamp(raw.x, margin, Math.max(margin, maxX));
    const y = this.clamp(raw.y, margin, Math.max(margin, maxY));

    overlay.instance.coordinates.set({ x, y });
    overlay.changeDetectorRef.detectChanges();
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
  }

  private bindOverlayPanel(overlayRef: ComponentRef<AerisTooltipOverlay>): void {
    const panel = this.rootElement(overlayRef).querySelector<HTMLElement>('.aeris-tooltip__panel');
    if (!panel || panel === this.overlayPanel) return;

    this.overlayPanel?.removeEventListener('pointerenter', this.handleOverlayPointerEnter);
    this.overlayPanel?.removeEventListener('pointerleave', this.handleOverlayPointerLeave);
    panel.addEventListener('pointerenter', this.handleOverlayPointerEnter);
    panel.addEventListener('pointerleave', this.handleOverlayPointerLeave);
    this.overlayPanel = panel;
  }

  private rawPosition(
    position: AerisTooltipPosition,
    targetRect: DOMRect,
    width: number,
    height: number,
    offset: number,
  ): { readonly x: number; readonly y: number } {
    switch (position) {
      case 'bottom':
        return { x: targetRect.left + targetRect.width / 2 - width / 2, y: targetRect.bottom + offset };
      case 'left':
        return { x: targetRect.left - width - offset, y: targetRect.top + targetRect.height / 2 - height / 2 };
      case 'right':
        return { x: targetRect.right + offset, y: targetRect.top + targetRect.height / 2 - height / 2 };
      case 'top':
      default:
        return { x: targetRect.left + targetRect.width / 2 - width / 2, y: targetRect.top - height - offset };
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private hasContent(): boolean {
    const content = this.content();
    return content instanceof TemplateRef || String(content ?? '').trim().length > 0;
  }

  private canShowForSize(): boolean {
    if (!this.truncatedOnly()) return true;
    const element = this.host.nativeElement;
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  }

  private addTooltipDescription(): void {
    const host = this.host.nativeElement;
    const ids = new Set((host.getAttribute('aria-describedby') ?? '').split(/\s+/u).filter(Boolean));
    ids.add(this.tooltipId);
    host.setAttribute('aria-describedby', [...ids].join(' '));
  }

  private removeTooltipDescription(): void {
    const host = this.host.nativeElement;
    const ids = (host.getAttribute('aria-describedby') ?? '')
      .split(/\s+/u)
      .filter((id) => id && id !== this.tooltipId);
    if (ids.length) {
      host.setAttribute('aria-describedby', ids.join(' '));
    } else {
      host.removeAttribute('aria-describedby');
    }
  }

  private clearShowTimer(): void {
    if (!this.showTimer) return;
    clearTimeout(this.showTimer);
    this.showTimer = null;
  }

  private clearHideTimer(): void {
    if (!this.hideTimer) return;
    clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }

  private rootNode(overlayRef: ComponentRef<AerisTooltipOverlay>): Node {
    const [node] = (overlayRef.hostView as EmbeddedViewRef<unknown>).rootNodes;
    return node instanceof Node ? node : this.document.createTextNode('');
  }

  private rootElement(overlayRef: ComponentRef<AerisTooltipOverlay>): HTMLElement {
    const node = this.rootNode(overlayRef);
    return node instanceof HTMLElement ? node : this.document.body;
  }

  private readonly handleOverlayPointerEnter = (): void => {
    this.overlayPointerInside = true;
    this.clearHideTimer();
  };

  private readonly handleOverlayPointerLeave = (event: Event): void => {
    this.overlayPointerInside = false;
    if (!this.autoHide()) this.hide(event, 'pointerleave');
  };
}

export const AerisTooltipModule = [AerisTooltip] as const;
