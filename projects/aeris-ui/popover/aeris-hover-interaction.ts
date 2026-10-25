/** @internal Preview interaction only: callers retain visibility, semantics, portals and focus policy. */
export interface AerisInternalHoverOptions {
  readonly document: Document;
  readonly trigger: () => HTMLElement | null;
  readonly content: () => HTMLElement | null;
  readonly isOpen: () => boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly openDelay: () => number;
  readonly closeDelay: () => number;
  /** Include owned portaled descendants without querying unrelated overlays. */
  readonly ownsTarget?: (target: EventTarget | null) => boolean;
}

type Point = { readonly x: number; readonly y: number };
type Bounds = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;
type Region = 'trigger' | 'content';

/** @internal Physical geometry works unchanged for flipped placements and RTL. */
export function aerisInternalWithinHoverBridge(
  point: Point,
  origin: Point,
  bounds: Bounds,
): boolean {
  const padding = 6;
  if (Math.abs(point.x - origin.x) <= padding && Math.abs(point.y - origin.y) <= padding)
    return true;
  const left = bounds.left - padding;
  const right = bounds.right + padding;
  const top = bounds.top - padding;
  const bottom = bounds.bottom + padding;
  if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom) return true;
  const corners = [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ];
  return corners.some((corner, index) => {
    const next = corners[(index + 1) % corners.length];
    if (!next || Math.abs(cross(origin, corner, next)) < 0.001) return false;
    const signs = [
      cross(point, origin, corner),
      cross(point, corner, next),
      cross(point, next, origin),
    ];
    return signs.every((value) => value >= -0.001) || signs.every((value) => value <= 0.001);
  });
}

function cross(point: Point, a: Point, b: Point): number {
  return (a.x - point.x) * (b.y - point.y) - (a.y - point.y) * (b.x - point.x);
}

/**
 * @internal No automatic event binding to triggers or focus stealing. The owning
 * popover forwards its region events and suppresses pending work when visibility closes.
 * Touch hover is ignored: activate() belongs on an explicit preview action, not a link.
 */
export function aerisInternalCreateHoverInteraction(options: AerisInternalHoverOptions) {
  const pointer = { trigger: false, content: false };
  let focused = false;
  let suppressed = false;
  let destroyed = false;
  let pointerFocus = false;
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let stopTransit: (() => void) | null = null;
  const owns = (target: EventTarget | null): boolean => {
    if (options.ownsTarget?.(target)) return true;
    if (!target || !('nodeType' in target)) return false;
    return !!(
      options.trigger()?.contains(target as Node) || options.content()?.contains(target as Node)
    );
  };
  const occupied = () => focused || pointer.trigger || pointer.content;
  const cancelTimers = () => {
    if (openTimer !== null) clearTimeout(openTimer);
    if (closeTimer !== null) clearTimeout(closeTimer);
    openTimer = closeTimer = null;
  };
  const clearTransit = () => {
    stopTransit?.();
    stopTransit = null;
  };
  const requestOpen = (immediate = false) => {
    cancelTimers();
    clearTransit();
    if (destroyed || suppressed || options.isOpen()) return;
    const open = () => {
      openTimer = null;
      if (!destroyed && !suppressed && occupied() && !options.isOpen()) options.open();
    };
    const delay = immediate ? 0 : finiteDelay(options.openDelay());
    if (delay) openTimer = setTimeout(open, delay);
    else open();
  };
  const requestClose = () => {
    cancelTimers();
    if (!occupied()) suppressed = false;
    if (destroyed || occupied() || stopTransit || !options.isOpen()) return;
    const close = () => {
      closeTimer = null;
      if (!destroyed && !occupied() && options.isOpen()) options.close();
    };
    const delay = finiteDelay(options.closeDelay());
    if (delay) closeTimer = setTimeout(close, delay);
    else close();
  };
  const endTransit = () => {
    clearTransit();
    requestClose();
  };
  const beginTransit = (event: PointerEvent, destination: HTMLElement) => {
    clearTransit();
    const origin = { x: event.clientX, y: event.clientY };
    const bounds = destination.getBoundingClientRect();
    const move = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return;
      if (owns(next.target)) {
        clearTransit();
        return;
      }
      if (!aerisInternalWithinHoverBridge({ x: next.clientX, y: next.clientY }, origin, bounds))
        endTransit();
    };
    const cancel = (next: PointerEvent) => {
      if (next.pointerId === event.pointerId) endTransit();
    };
    // Transit is bounded: a stationary pointer in the gap cannot hold the preview open forever.
    const timer = setTimeout(endTransit, 300);
    const view = options.document.defaultView;
    const viewport = view?.visualViewport;
    options.document.addEventListener('pointermove', move, true);
    options.document.addEventListener('pointercancel', cancel, true);
    options.document.addEventListener('scroll', endTransit, true);
    view?.addEventListener('resize', endTransit);
    view?.addEventListener('blur', endTransit);
    viewport?.addEventListener('scroll', endTransit);
    viewport?.addEventListener('resize', endTransit);
    stopTransit = () => {
      clearTimeout(timer);
      options.document.removeEventListener('pointermove', move, true);
      options.document.removeEventListener('pointercancel', cancel, true);
      options.document.removeEventListener('scroll', endTransit, true);
      view?.removeEventListener('resize', endTransit);
      view?.removeEventListener('blur', endTransit);
      viewport?.removeEventListener('scroll', endTransit);
      viewport?.removeEventListener('resize', endTransit);
    };
  };
  const reset = () => {
    cancelTimers();
    clearTransit();
    pointer.trigger = pointer.content = focused = suppressed = pointerFocus = false;
  };
  const suppress = () => {
    cancelTimers();
    clearTransit();
    suppressed = occupied();
  };
  return {
    suppress,
    /** Forward pointerdown so focus preceding an explicit activation cannot open then toggle shut. */
    pointerDown(): void {
      if (!destroyed) pointerFocus = true;
    },
    pointerEnter(region: Region, event: PointerEvent): void {
      if (destroyed || event.pointerType === 'touch') return;
      pointer[region] = true;
      requestOpen();
    },
    pointerLeave(region: Region, event: PointerEvent): void {
      if (destroyed || event.pointerType === 'touch') return;
      pointer[region] = false;
      cancelTimers();
      clearTransit();
      if (owns(event.relatedTarget)) return;
      if (!pointer.trigger && !pointer.content) suppressed = false;
      const destination = region === 'trigger' ? options.content() : options.trigger();
      if (!occupied() && options.isOpen() && destination?.isConnected)
        beginTransit(event, destination);
      else requestClose();
    },
    focusIn(): void {
      if (destroyed) return;
      focused = true;
      if (!pointerFocus) requestOpen(true);
    },
    focusOut(relatedTarget: EventTarget | null): void {
      if (destroyed || owns(relatedTarget)) return;
      focused = false;
      pointerFocus = false;
      // A fresh keyboard focus cycle is new intent even if a mouse still hovers the trigger.
      suppressed = false;
      requestClose();
    },
    /** Invoke only for an explicit action; never prevent the trigger's normal navigation. */
    activate(): void {
      if (destroyed) return;
      pointerFocus = false;
      cancelTimers();
      clearTransit();
      if (options.isOpen()) {
        suppressed = occupied();
        options.close();
      } else {
        suppressed = false;
        options.open();
      }
    },
    dismiss(): void {
      if (destroyed) return;
      suppress();
      if (options.isOpen()) options.close();
    },
    reset,
    destroy(): void {
      reset();
      destroyed = true;
    },
  };
}

function finiteDelay(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
