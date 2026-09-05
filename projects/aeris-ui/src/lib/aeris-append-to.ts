import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  InjectionToken,
  Renderer2,
  TemplateRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import {
  type AerisInternalOverlayAlignment,
  type AerisInternalOverlayPlacement,
  type AerisOverlayCollisionPadding,
  aerisInternalPositionAnchoredOverlay,
} from './aeris-overlay-position';

let nextAppendToZIndex = 1100;
const positionedTargets = new WeakMap<HTMLElement, { count: number; readonly previous: string }>();

export type AerisAppendTo =
  'self' | 'body' | HTMLElement | ElementRef<HTMLElement> | TemplateRef<unknown> | null | undefined;

export const AERIS_OVERLAY_APPEND_TO = new InjectionToken<AerisAppendTo>(
  'AERIS_OVERLAY_APPEND_TO',
  { factory: () => 'self' },
);

export function aerisInternalResolveAppendTo(
  appendTo: AerisAppendTo,
  document: Document,
): 'self' | HTMLElement {
  if (!appendTo || appendTo === 'self') return 'self';
  if (appendTo === 'body') return document.body;
  if (isHtmlElement(appendTo)) return appendTo;

  const nativeElement = elementRefNativeElement(appendTo);
  return isHtmlElement(nativeElement) ? nativeElement : 'self';
}

@Directive({ selector: '[aerisInternalAppendTo]' })
export class ɵAerisAppendTo {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly defaultAppendTo = inject(AERIS_OVERLAY_APPEND_TO);
  private frame: number | null = null;
  private originCaptured = false;
  private originParent: Node | null = null;
  private originNextSibling: Node | null = null;
  private unconstrainedPanelWidth = 0;
  private unconstrainedPanelHeight = 0;

  readonly aerisInternalAppendTo = input<AerisAppendTo>();
  readonly aerisInternalAppendToAnchor = input<HTMLElement | null>(null);
  readonly aerisInternalAppendToOffset = input(7);
  readonly aerisInternalAppendToMatchWidth = input(false);
  readonly aerisInternalAppendToPlacement = input<AerisInternalOverlayPlacement | 'auto'>('auto');
  readonly aerisInternalAppendToAlignment = input<AerisInternalOverlayAlignment | 'auto'>('auto');
  readonly aerisInternalAppendToCollisionPadding = input<number | AerisOverlayCollisionPadding>(8);
  readonly aerisInternalAppendToPositionSelf = input(true);
  readonly aerisInternalAppendToOutside = output<PointerEvent>();

  constructor() {
    effect((onCleanup) => {
      const target = aerisInternalResolveAppendTo(
        this.aerisInternalAppendTo() ?? this.defaultAppendTo,
        this.document,
      );
      const anchor = this.aerisInternalAppendToAnchor();
      const automaticallyPortaled =
        this.aerisInternalAppendTo() === undefined &&
        target === 'self' &&
        !!anchor &&
        this.hasClippingAncestor(anchor);
      const effectiveTarget = automaticallyPortaled ? this.document.body : target;
      this.captureOrigin();

      if (effectiveTarget === 'self') this.restoreToOrigin();
      if (
        effectiveTarget === 'self' &&
        (!anchor || !this.aerisInternalAppendToPositionSelf())
      ) {
        this.element.removeAttribute('data-aeris-append-to');
        this.element.removeAttribute('data-aeris-auto-portaled');
        return;
      }
      const positioningTarget =
        effectiveTarget === 'self' ? this.element.parentElement : effectiveTarget;
      if (!positioningTarget) return;

      const inheritedStyles = this.preserveInheritedStyles();
      const positioningStyles = this.preserveInlineStyles([
        'position',
        'inset',
        'inset-block-start',
        'inset-inline-start',
        'right',
        'bottom',
        'left',
        'top',
        'min-width',
        'max-width',
        'max-height',
        'overflow-x',
        'overflow-y',
        'overscroll-behavior',
        'z-index',
      ]);
      const targetPosition = this.ensurePositionedTarget(positioningTarget);
      if (effectiveTarget !== 'self') {
        this.renderer.appendChild(effectiveTarget, this.element);
        this.applyInheritedStyles(inheritedStyles);
        this.renderer.setAttribute(
          this.element,
          'data-aeris-append-to',
          effectiveTarget === this.document.body ? 'body' : 'target',
        );
        if (automaticallyPortaled) {
          this.renderer.setAttribute(this.element, 'data-aeris-auto-portaled', 'true');
        } else {
          this.element.removeAttribute('data-aeris-auto-portaled');
        }
        this.bringToFront();
      } else {
        this.element.removeAttribute('data-aeris-append-to');
        this.element.removeAttribute('data-aeris-auto-portaled');
      }

      const reposition = () => this.schedulePosition(anchor, positioningTarget);
      const pointerdown = (event: PointerEvent) => {
        const eventTarget = event.target;
        if (!isDomNode(eventTarget)) return;
        if (this.element.contains(eventTarget) || anchor?.contains(eventTarget)) return;
        this.aerisInternalAppendToOutside.emit(event);
      };
      const view = this.document.defaultView;
      const visualViewport = view?.visualViewport;
      view?.addEventListener('resize', reposition);
      visualViewport?.addEventListener('resize', reposition);
      visualViewport?.addEventListener('scroll', reposition);
      this.document.addEventListener('scroll', reposition, true);
      this.document.addEventListener('pointerdown', pointerdown, true);
      const resizeObserver =
        typeof ResizeObserver === 'undefined' || !anchor ? null : new ResizeObserver(reposition);
      if (anchor) resizeObserver?.observe(anchor);
      resizeObserver?.observe(this.element);
      if (anchor && view) this.positionConnectedOverlay(anchor, positioningTarget, view);

      onCleanup(() => {
        view?.removeEventListener('resize', reposition);
        visualViewport?.removeEventListener('resize', reposition);
        visualViewport?.removeEventListener('scroll', reposition);
        this.document.removeEventListener('scroll', reposition, true);
        this.document.removeEventListener('pointerdown', pointerdown, true);
        resizeObserver?.disconnect();
        this.cancelFrame();
        this.restoreInlineStyles(positioningStyles);
        this.element.removeAttribute('data-placement');
        this.element.removeAttribute('data-positioned');
        this.element.removeAttribute('data-viewport-constrained');
        this.element.removeAttribute('data-viewport-constrained-width');
        this.restoreInheritedStyles(inheritedStyles);
        targetPosition.restore();
        this.element.removeAttribute('data-aeris-append-to');
        this.element.removeAttribute('data-aeris-auto-portaled');
        if (effectiveTarget !== 'self') this.element.remove();
      });
    });

    this.destroyRef.onDestroy(() => {
      this.element.remove();
      queueMicrotask(() => this.element.remove());
    });
  }

  restore(): void {
    this.restoreToOrigin();
  }

  private schedulePosition(anchor: HTMLElement | null, target: HTMLElement): void {
    if (!anchor || this.frame !== null) return;
    const view = this.document.defaultView;
    if (!view) return;
    this.frame = view.requestAnimationFrame(() => {
      this.frame = null;
      this.positionConnectedOverlay(anchor, target, view);
    });
  }

  private positionConnectedOverlay(anchor: HTMLElement, target: HTMLElement, view: Window): void {
    if (!anchor.isConnected || !this.element.isConnected) return;
    const anchorRect = anchor.getBoundingClientRect();
    this.element.style.position = target === this.document.body ? 'fixed' : 'absolute';
    this.element.style.inset = 'auto';
    this.element.style.insetBlockStart = 'auto';
    this.element.style.insetInlineStart = 'auto';
    this.element.style.right = 'auto';
    this.element.style.bottom = 'auto';
    const viewport = view.visualViewport;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    const collisionPadding = this.collisionPadding(view);
    const availableWidth = Math.max(
      0,
      (viewport?.width ?? view.innerWidth) -
        (collisionPadding.left ?? 0) -
        (collisionPadding.right ?? 0),
    );
    if (this.aerisInternalAppendToMatchWidth()) {
      this.element.style.minWidth = `${Math.min(anchorRect.width, availableWidth)}px`;
    }
    const availableHeight = Math.max(
      0,
      (viewport?.height ?? view.innerHeight) -
        (collisionPadding.top ?? 0) -
        (collisionPadding.bottom ?? 0),
    );
    let panelRect = this.element.getBoundingClientRect();
    const wasWidthConstrained = this.element.hasAttribute('data-viewport-constrained-width');
    const naturalWidth = wasWidthConstrained
      ? Math.max(this.unconstrainedPanelWidth, this.element.scrollWidth)
      : panelRect.width;
    this.unconstrainedPanelWidth = naturalWidth;
    if (naturalWidth > availableWidth && availableWidth > 0) {
      this.element.style.maxWidth = `${availableWidth}px`;
      this.element.style.overflowX = 'auto';
      this.element.style.overscrollBehavior = 'contain';
      this.element.setAttribute('data-viewport-constrained-width', 'true');
      panelRect = this.element.getBoundingClientRect();
    } else if (wasWidthConstrained) {
      this.element.style.removeProperty('max-width');
      this.element.style.removeProperty('overflow-x');
      this.element.removeAttribute('data-viewport-constrained-width');
      panelRect = this.element.getBoundingClientRect();
    }
    const wasHeightConstrained = this.element.hasAttribute('data-viewport-constrained');
    const naturalHeight = wasHeightConstrained
      ? Math.max(this.unconstrainedPanelHeight, this.element.scrollHeight)
      : panelRect.height;
    this.unconstrainedPanelHeight = naturalHeight;
    const direction = view.getComputedStyle(anchor).direction;
    const configuredAlignment = this.aerisInternalAppendToAlignment();
    const alignment =
      configuredAlignment === 'auto'
        ? direction === 'rtl'
          ? 'end'
          : 'start'
        : configuredAlignment;
    const position = (height = panelRect.height || this.element.offsetHeight) =>
      aerisInternalPositionAnchoredOverlay({
        target: anchorRect,
        width: panelRect.width || this.element.offsetWidth || anchorRect.width,
        height,
        placement: this.aerisInternalAppendToPlacement(),
        alignment,
        offset: this.aerisInternalAppendToOffset(),
        margin: 8,
        viewportWidth: viewport?.width ?? view.innerWidth,
        viewportHeight: viewport?.height ?? view.innerHeight,
        viewportLeft,
        viewportTop,
        collisionPadding,
        tetherToAnchor: true,
      });
    let point = position(naturalHeight);
    const viewportBounds = {
      top: viewportTop + (collisionPadding.top ?? 0),
      bottom:
        viewportTop +
        (viewport?.height ?? view.innerHeight) -
        (collisionPadding.bottom ?? 0),
    };
    const anchorIntersectsViewport =
      anchorRect.bottom > viewportBounds.top && anchorRect.top < viewportBounds.bottom;
    const placementHeight =
      anchorIntersectsViewport && point.placement === 'bottom'
        ? viewportBounds.bottom - anchorRect.bottom - this.aerisInternalAppendToOffset()
        : anchorIntersectsViewport && point.placement === 'top'
          ? anchorRect.top - viewportBounds.top - this.aerisInternalAppendToOffset()
          : availableHeight;
    const constrainedHeight = Math.max(0, Math.min(availableHeight, placementHeight));
    if (naturalHeight > constrainedHeight && constrainedHeight > 0) {
      this.element.style.maxHeight = `${Math.floor(constrainedHeight)}px`;
      this.element.style.overflowY = 'auto';
      this.element.style.overscrollBehavior = 'contain';
      this.element.setAttribute('data-viewport-constrained', 'true');
      panelRect = this.element.getBoundingClientRect();
    } else if (wasHeightConstrained) {
      this.element.style.removeProperty('max-height');
      this.element.style.removeProperty('overflow-y');
      this.element.removeAttribute('data-viewport-constrained');
      panelRect = this.element.getBoundingClientRect();
    }
    point = position();
    if (
      !this.element.hasAttribute('data-viewport-constrained') &&
      !this.element.hasAttribute('data-viewport-constrained-width')
    ) {
      this.element.style.removeProperty('overscroll-behavior');
    }

    if (target === this.document.body) {
      this.element.style.left = `${point.x}px`;
      this.element.style.top = `${point.y}px`;
    } else {
      const targetRect = target.getBoundingClientRect();
      this.element.style.left = `${point.x - targetRect.left - target.clientLeft + target.scrollLeft}px`;
      this.element.style.top = `${point.y - targetRect.top - target.clientTop + target.scrollTop}px`;
    }
    this.element.setAttribute('data-placement', point.placement);
    this.element.setAttribute('data-positioned', 'true');
  }

  private collisionPadding(view: Window): AerisOverlayCollisionPadding {
    const configured = this.aerisInternalAppendToCollisionPadding();
    const padding =
      typeof configured === 'number'
        ? { top: configured, right: configured, bottom: configured, left: configured }
        : configured;
    const rootStyles = view.getComputedStyle(this.document.documentElement);
    const value = (side: keyof AerisOverlayCollisionPadding): number => {
      const safeArea =
        Number.parseFloat(rootStyles.getPropertyValue(`--aeris-safe-area-${side}`)) || 0;
      return Math.max(0, padding[side] ?? 0) + safeArea;
    };
    return {
      top: value('top'),
      right: value('right'),
      bottom: value('bottom'),
      left: value('left'),
    };
  }

  private preserveInheritedStyles(): ReadonlyMap<
    string,
    { readonly source: string; readonly previous: string }
  > {
    const view = this.document.defaultView;
    if (!view) return new Map();
    const computed = view.getComputedStyle(this.element);
    const preserved = new Map<string, { readonly source: string; readonly previous: string }>();
    const properties = ['color', 'direction', 'font'];
    for (let index = 0; index < computed.length; index += 1) {
      const property = computed.item(index);
      if (property.startsWith('--aeris-') || property.startsWith('--_aeris-')) {
        properties.push(property);
      }
    }
    for (const property of properties) {
      const value = computed.getPropertyValue(property);
      if (!value) continue;
      preserved.set(property, {
        source: value,
        previous: this.element.style.getPropertyValue(property),
      });
    }
    return preserved;
  }

  private applyInheritedStyles(
    preserved: ReadonlyMap<string, { readonly source: string; readonly previous: string }>,
  ): void {
    const computed = this.document.defaultView?.getComputedStyle(this.element);
    if (!computed) return;
    for (const [property, value] of preserved) {
      if (computed.getPropertyValue(property) !== value.source) {
        this.element.style.setProperty(property, value.source);
      }
    }
  }

  private restoreInheritedStyles(
    preserved: ReadonlyMap<string, { readonly source: string; readonly previous: string }>,
  ): void {
    for (const [property, value] of preserved) {
      if (value.previous) this.element.style.setProperty(property, value.previous);
      else this.element.style.removeProperty(property);
    }
  }

  private preserveInlineStyles(properties: readonly string[]): ReadonlyMap<string, string> {
    return new Map(
      properties.map((property) => [property, this.element.style.getPropertyValue(property)]),
    );
  }

  private restoreInlineStyles(previous: ReadonlyMap<string, string>): void {
    for (const [property, value] of previous) {
      if (value) this.element.style.setProperty(property, value);
      else this.element.style.removeProperty(property);
    }
  }

  private bringToFront(): void {
    const computedZIndex = Number.parseInt(
      this.document.defaultView?.getComputedStyle(this.element).zIndex ?? '',
      10,
    );
    const zIndex = Math.max(
      Number.isFinite(computedZIndex) ? computedZIndex : 0,
      nextAppendToZIndex,
    );
    nextAppendToZIndex = zIndex + 1;
    this.element.style.zIndex = String(zIndex);
  }

  private ensurePositionedTarget(target: HTMLElement): { readonly restore: () => void } {
    if (target === this.document.body || !this.document.defaultView) {
      return { restore: () => undefined };
    }
    const existing = positionedTargets.get(target);
    if (existing) {
      existing.count += 1;
      return { restore: () => this.releasePositionedTarget(target) };
    }
    if (this.document.defaultView.getComputedStyle(target).position !== 'static') {
      return { restore: () => undefined };
    }
    const previous = target.style.position;
    target.style.position = 'relative';
    positionedTargets.set(target, { count: 1, previous });
    return { restore: () => this.releasePositionedTarget(target) };
  }

  private releasePositionedTarget(target: HTMLElement): void {
    const entry = positionedTargets.get(target);
    if (!entry) return;
    entry.count -= 1;
    if (entry.count > 0) return;
    target.style.position = entry.previous;
    positionedTargets.delete(target);
  }

  private hasClippingAncestor(anchor: HTMLElement): boolean {
    const view = this.document.defaultView;
    if (!view) return false;
    let ancestor = anchor.parentElement;
    while (
      ancestor &&
      ancestor !== this.document.body &&
      ancestor !== this.document.documentElement
    ) {
      const style = view.getComputedStyle(ancestor);
      if (
        isClippingOverflow(style.overflow) ||
        isClippingOverflow(style.overflowX) ||
        isClippingOverflow(style.overflowY) ||
        hasPaintContainment(style.contain) ||
        (style.clipPath && style.clipPath !== 'none')
      ) {
        return true;
      }
      ancestor = ancestor.parentElement;
    }
    return false;
  }

  private cancelFrame(): void {
    if (this.frame === null) return;
    this.document.defaultView?.cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  private captureOrigin(): void {
    if (this.originCaptured) return;
    this.originCaptured = true;
    this.originParent = this.element.parentNode;
    this.originNextSibling = this.element.nextSibling;
  }

  private restoreToOrigin(): void {
    if (!this.originParent || this.element.parentNode === this.originParent) return;
    this.renderer.insertBefore(
      this.originParent,
      this.element,
      this.originNextSibling?.parentNode === this.originParent ? this.originNextSibling : null,
    );
  }
}

function elementRefNativeElement(
  value: Exclude<AerisAppendTo, string | null | undefined>,
): unknown {
  if ('nativeElement' in value) return value.nativeElement;
  if ('elementRef' in value) {
    const node = value.elementRef.nativeElement as unknown;
    if (isHtmlElement(node)) return node;
    if (typeof node === 'object' && node !== null && 'parentElement' in node) {
      return node.parentElement;
    }
  }
  return null;
}

function isHtmlElement(value: unknown): value is HTMLElement {
  return typeof value === 'object' && value !== null && 'nodeType' in value && value.nodeType === 1;
}

function isDomNode(value: unknown): value is Node {
  return typeof value === 'object' && value !== null && 'nodeType' in value;
}

function isClippingOverflow(value: string): boolean {
  return /^(auto|clip|hidden|overlay|scroll)$/.test(value.trim());
}

function hasPaintContainment(value: string): boolean {
  return value
    .trim()
    .split(/\s+/)
    .some((token) => token === 'paint' || token === 'content' || token === 'strict');
}
