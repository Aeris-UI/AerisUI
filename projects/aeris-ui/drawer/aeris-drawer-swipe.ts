import { aerisInternalCreateFrameScheduler } from '@aeris-ui/core';
import type { AerisDrawerPosition } from './aeris-drawer';

interface SwipeSession {
  readonly id: number;
  readonly handle: HTMLElement;
  readonly position: AerisDrawerPosition;
  readonly extent: number;
  readonly viewport: string;
  readonly capture: boolean;
  readonly x: number;
  readonly y: number;
  dragging: boolean;
  distance: number;
  velocity: number;
  time: number;
}

type SwipeInput =
  | PointerEvent
  | (Pick<
      PointerEvent,
      | 'pointerId'
      | 'isPrimary'
      | 'button'
      | 'clientX'
      | 'clientY'
      | 'timeStamp'
      | 'type'
      | 'preventDefault'
    > & { readonly originalEvent: TouchEvent });

/** Drawer-local gesture lifecycle. Native scrolling wins when it can consume the gesture. */
export class AerisDrawerSwipe {
  private session: SwipeSession | null = null;
  private readonly frame = aerisInternalCreateFrameScheduler(() => this.flush());

  constructor(
    private readonly document: Document,
    private readonly changed: (offset: number, progress: number, dragging: boolean) => void,
    private readonly dismissed: (event: Event) => void,
  ) {}

  start(event: PointerEvent, position: AerisDrawerPosition, extent: number): void {
    if (event.pointerType === 'touch') return; // Native touch listeners arbitrate scrolling before capture.
    this.begin(
      event,
      position,
      extent,
      event.currentTarget as HTMLElement,
      event.target as Element | null,
      true,
    );
  }

  private begin(
    event: SwipeInput,
    position: AerisDrawerPosition,
    extent: number,
    surface: HTMLElement,
    target: Element | null,
    capture: boolean,
  ): void {
    if (this.session) {
      if (event.pointerId !== this.session.id) this.cancel(true);
      return;
    }
    if (!event.isPrimary || event.button !== 0 || extent <= 0) return;
    const handle = target?.closest('.aeris-drawer__swipe-handle');
    if (!handle && !this.canStart(surface, target, position)) return;
    this.session = {
      id: event.pointerId,
      handle: (handle as HTMLElement | null) ?? surface,
      capture,
      position,
      extent,
      viewport: this.viewportKey(),
      x: event.clientX,
      y: event.clientY,
      dragging: false,
      distance: 0,
      velocity: 0,
      time: event.timeStamp,
    };
    // Eligible mouse/pen starts near a screen edge must retain the pointer before it leaves
    // the viewport. Touch stays uncaptured so native scrolling can win.
    if (capture) this.session.handle.setPointerCapture?.(event.pointerId);
  }

  move(event: SwipeInput): boolean {
    if ('pointerType' in event && event.pointerType === 'touch') return false;
    const session = this.session;
    if (!session || session.id !== event.pointerId) return false;
    const horizontal = session.position === 'left' || session.position === 'right';
    const direction = session.position === 'left' || session.position === 'top' ? -1 : 1;
    const x = event.clientX - session.x;
    const y = event.clientY - session.y;
    const distance = (horizontal ? x : y) * direction;
    if (!session.dragging) {
      if (Math.max(Math.abs(x), Math.abs(y)) < 8)
        return distance > 0 && distance > Math.abs(horizontal ? y : x) * 1.2;
      if (distance <= 0 || distance < Math.abs(horizontal ? y : x) * 1.2) {
        this.cancel(true);
        return false;
      }
      const selection = this.document.getSelection();
      if (selection && !selection.isCollapsed) {
        this.cancel();
        return false;
      }
      session.dragging = true;
    }
    event.preventDefault();
    const next = Math.max(0, Math.min(session.extent, distance));
    if (next !== session.distance) {
      session.velocity = (next - session.distance) / Math.max(1, event.timeStamp - session.time);
      session.distance = next;
      session.time = event.timeStamp;
    }
    this.frame.schedule();
    return true;
  }

  end(event: SwipeInput, threshold: number): void {
    if ('pointerType' in event && event.pointerType === 'touch') return;
    const session = this.session;
    if (!session || session.id !== event.pointerId) return;
    const cancelled = event.type !== 'pointerup' || session.viewport !== this.viewportKey();
    if (!cancelled && session.dragging) this.move(event);
    this.frame.cancel();
    this.session = null;
    this.release(session);
    if (!session.dragging) return;
    guardReleaseClick(this.document, session.capture ? session.id : null);
    const fraction = Number.isFinite(threshold) ? Math.min(1, Math.max(0.1, threshold)) : 0.35;
    const flick =
      session.distance >= 32 && session.velocity >= 0.5 && event.timeStamp - session.time < 100;
    const dismiss = !cancelled && (session.distance >= session.extent * fraction || flick);
    const direction = session.position === 'left' || session.position === 'top' ? -1 : 1;
    this.changed(
      dismiss ? session.distance * direction : 0,
      dismiss ? session.distance / session.extent : 0,
      false,
    );
    if (dismiss) this.dismissed('originalEvent' in event ? event.originalEvent : event);
  }

  cancel(suppressClick = false): void {
    const session = this.session;
    this.session = null;
    this.frame.cancel();
    if (session) {
      this.release(session);
      if (session.dragging || suppressClick)
        guardReleaseClick(this.document, session.capture ? session.id : null);
    }
    this.changed(0, 0, false);
  }

  private flush(): void {
    const session = this.session;
    if (!session?.dragging) return;
    const direction = session.position === 'left' || session.position === 'top' ? -1 : 1;
    this.changed(session.distance * direction, session.distance / session.extent, true);
  }

  private release(session: SwipeSession): void {
    if (session.capture && session.handle.hasPointerCapture?.(session.id))
      session.handle.releasePointerCapture(session.id);
  }

  /** Non-passive touchmove is restricted to this opt-in surface, not the document. */
  listenForTouch(
    surface: HTMLElement,
    position: AerisDrawerPosition,
    threshold: () => number,
    enabled: () => boolean,
  ): () => void {
    const input = (event: TouchEvent, touch: Touch): SwipeInput => ({
      pointerId: touch.identifier,
      isPrimary: true,
      button: 0,
      clientX: touch.clientX,
      clientY: touch.clientY,
      timeStamp: event.timeStamp,
      type:
        event.type === 'touchend'
          ? 'pointerup'
          : event.type === 'touchcancel'
            ? 'pointercancel'
            : event.type,
      preventDefault: () => event.preventDefault(),
      originalEvent: event,
    });
    const start = (event: TouchEvent) => {
      if (!enabled()) return;
      if (event.touches.length !== 1) {
        this.cancel();
        return;
      }
      const touch = event.touches[0];
      const bounds = surface.getBoundingClientRect();
      this.begin(
        input(event, touch),
        position,
        position === 'left' || position === 'right' ? bounds.width : bounds.height,
        surface,
        touch.target as Element,
        false,
      );
    };
    const move = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !event.cancelable) {
        this.cancel();
        return;
      }
      if (this.move(input(event, event.touches[0]))) event.preventDefault();
    };
    const end = (event: TouchEvent) => {
      for (const touch of Array.from(event.changedTouches))
        this.end(input(event, touch), threshold());
    };
    surface.addEventListener('touchstart', start, { passive: true });
    surface.addEventListener('touchmove', move, { passive: false });
    surface.addEventListener('touchend', end);
    surface.addEventListener('touchcancel', end);
    return () => {
      surface.removeEventListener('touchstart', start);
      surface.removeEventListener('touchmove', move);
      surface.removeEventListener('touchend', end);
      surface.removeEventListener('touchcancel', end);
    };
  }

  private canStart(
    surface: HTMLElement,
    target: Element | null,
    position: AerisDrawerPosition,
  ): boolean {
    if (!target || !surface.contains(target)) return true;
    if (
      target.closest(
        'button, a, input, textarea, select, label, [contenteditable]:not([contenteditable="false"]), [draggable="true"], [role="button"], [role="slider"], [role="spinbutton"], [role="combobox"], [role="listbox"], canvas, video, audio, [data-aeris-swipe-ignore]',
      )
    )
      return false;
    const horizontal = position === 'left' || position === 'right';
    for (
      let node: Element | null = target;
      node && surface.contains(node);
      node = node.parentElement
    ) {
      const style = this.document.defaultView?.getComputedStyle(node);
      if (!style) continue;
      if (
        horizontal &&
        /auto|scroll/.test(style.overflowX) &&
        node.scrollWidth > node.clientWidth + 1
      )
        return false;
      if (
        !horizontal &&
        /auto|scroll/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight + 1
      ) {
        if (
          position === 'bottom'
            ? node.scrollTop > 1
            : node.scrollTop < node.scrollHeight - node.clientHeight - 1
        )
          return false;
      }
    }
    return true;
  }

  private viewportKey(): string {
    const view = this.document.defaultView;
    return [
      view?.innerWidth,
      view?.innerHeight,
      view?.visualViewport?.width,
      view?.visualViewport?.height,
    ].join(':');
  }
}

// Survives a consumer destroying the drawer in `closed`; bounded to this pointer release.
function guardReleaseClick(document: Document, pointerId: number | null): void {
  const clear = () => {
    document.removeEventListener('click', click, true);
    document.removeEventListener('pointerdown', clear, true);
    globalThis.clearTimeout(timer);
  };
  const click = (event: MouseEvent) => {
    if (
      !event.detail ||
      (pointerId !== null && 'pointerId' in event && event.pointerId !== pointerId)
    )
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    clear();
  };
  const timer = globalThis.setTimeout(clear, 750);
  document.addEventListener('click', click, true);
  document.addEventListener('pointerdown', clear, true);
}
