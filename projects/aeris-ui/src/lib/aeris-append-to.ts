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

import { aerisInternalPositionAnchoredOverlay } from './aeris-overlay-position';

let nextAppendToZIndex = 1100;
const positionedTargets = new WeakMap<HTMLElement, { count: number; readonly previous: string }>();

export type AerisAppendTo =
  | 'self'
  | 'body'
  | HTMLElement
  | ElementRef<HTMLElement>
  | TemplateRef<unknown>
  | null
  | undefined;

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

  readonly aerisInternalAppendTo = input<AerisAppendTo>();
  readonly aerisInternalAppendToAnchor = input<HTMLElement | null>(null);
  readonly aerisInternalAppendToOffset = input(7);
  readonly aerisInternalAppendToMatchWidth = input(false);
  readonly aerisInternalAppendToOutside = output<PointerEvent>();

  constructor() {
    effect((onCleanup) => {
      const target = aerisInternalResolveAppendTo(
        this.aerisInternalAppendTo() ?? this.defaultAppendTo,
        this.document,
      );
      const anchor = this.aerisInternalAppendToAnchor();
      this.captureOrigin();

      if (target === 'self') {
        this.restoreToOrigin();
        this.element.removeAttribute('data-aeris-append-to');
        return;
      }

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
        'z-index',
      ]);
      const targetPosition = this.ensurePositionedTarget(target);
      this.renderer.appendChild(target, this.element);
      this.applyInheritedStyles(inheritedStyles);
      this.renderer.setAttribute(
        this.element,
        'data-aeris-append-to',
        target === this.document.body ? 'body' : 'target',
      );
      this.bringToFront();

      const reposition = () => this.schedulePosition(anchor, target);
      const pointerdown = (event: PointerEvent) => {
        const eventTarget = event.target;
        if (!isDomNode(eventTarget)) return;
        if (this.element.contains(eventTarget) || anchor?.contains(eventTarget)) return;
        this.aerisInternalAppendToOutside.emit(event);
      };
      const view = this.document.defaultView;
      view?.addEventListener('resize', reposition);
      this.document.addEventListener('scroll', reposition, true);
      this.document.addEventListener('pointerdown', pointerdown, true);
      const resizeObserver =
        typeof ResizeObserver === 'undefined' || !anchor ? null : new ResizeObserver(reposition);
      if (anchor) resizeObserver?.observe(anchor);
      resizeObserver?.observe(this.element);
      if (anchor && view) this.positionConnectedOverlay(anchor, target, view);

      onCleanup(() => {
        view?.removeEventListener('resize', reposition);
        this.document.removeEventListener('scroll', reposition, true);
        this.document.removeEventListener('pointerdown', pointerdown, true);
        resizeObserver?.disconnect();
        this.cancelFrame();
        this.restoreInlineStyles(positioningStyles);
        this.element.removeAttribute('data-placement');
        this.element.removeAttribute('data-positioned');
        this.restoreInheritedStyles(inheritedStyles);
        targetPosition.restore();
        this.element.removeAttribute('data-aeris-append-to');
        this.element.remove();
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
    if (!anchor) return;
    this.cancelFrame();
    const view = this.document.defaultView;
    if (!view) return;
    this.frame = view.requestAnimationFrame(() => {
      this.frame = null;
      this.positionConnectedOverlay(anchor, target, view);
    });
  }

  private positionConnectedOverlay(
    anchor: HTMLElement,
    target: HTMLElement,
    view: Window,
  ): void {
    if (!anchor.isConnected || !this.element.isConnected) return;
    const anchorRect = anchor.getBoundingClientRect();
    this.element.style.position = target === this.document.body ? 'fixed' : 'absolute';
    this.element.style.inset = 'auto';
    this.element.style.insetBlockStart = 'auto';
    this.element.style.insetInlineStart = 'auto';
    this.element.style.right = 'auto';
    this.element.style.bottom = 'auto';
    if (this.aerisInternalAppendToMatchWidth()) {
      this.element.style.minWidth = `${anchorRect.width}px`;
    }

    const panelRect = this.element.getBoundingClientRect();
    const direction = view.getComputedStyle(anchor).direction;
    const point = aerisInternalPositionAnchoredOverlay({
      target: anchorRect,
      width: panelRect.width || this.element.offsetWidth || anchorRect.width,
      height: panelRect.height || this.element.offsetHeight,
      placement: 'auto',
      alignment: direction === 'rtl' ? 'end' : 'start',
      offset: this.aerisInternalAppendToOffset(),
      margin: 8,
      viewportWidth: view.innerWidth,
      viewportHeight: view.innerHeight,
    });

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

function elementRefNativeElement(value: Exclude<AerisAppendTo, string | null | undefined>): unknown {
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
