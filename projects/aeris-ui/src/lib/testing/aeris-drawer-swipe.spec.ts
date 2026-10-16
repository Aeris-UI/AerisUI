import { vi } from 'vitest';
import { AerisDrawerSwipe } from '../../../drawer/aeris-drawer-swipe';

function setup(snap?: ConstructorParameters<typeof AerisDrawerSwipe>[3]) {
  const handle = document.createElement('button');
  const captures = new Set<number>();
  handle.setPointerCapture = (id) => {
    captures.add(id);
  };
  handle.hasPointerCapture = (id) => captures.has(id);
  handle.releasePointerCapture = (id) => {
    captures.delete(id);
  };
  const changed = vi.fn<(offset: number, progress: number, dragging: boolean) => void>();
  const dismissed = vi.fn<(event: Event) => void>();
  const swipe = new AerisDrawerSwipe(document, changed, dismissed, snap);
  const pointer = (type: string, x: number, y: number, time = 0, id = 1) => {
    const event = new PointerEvent(type, {
      clientX: x,
      clientY: y,
      pointerId: id,
      isPrimary: true,
      button: 0,
      cancelable: true,
    });
    Object.defineProperty(event, 'currentTarget', { value: handle, configurable: true });
    Object.defineProperty(event, 'timeStamp', { value: time });
    return event;
  };
  return { swipe, pointer, captures, changed, dismissed };
}

describe('Drawer swipe gestures', () => {
  it('settles bottom drawers to neighboring snap points in either direction', () => {
    const settled = vi.fn();
    const { swipe, pointer, dismissed } = setup(() => ({
      heights: [100, 200, 300],
      dismissible: false,
      settled,
    }));
    swipe.start(pointer('pointerdown', 0, 200), 'bottom', 200);
    swipe.move(pointer('pointermove', 0, 100, 200));
    swipe.end(pointer('pointerup', 0, 100, 400), 0.35);
    expect(settled).toHaveBeenLastCalledWith(2, expect.any(Event));
    swipe.start(pointer('pointerdown', 0, 200), 'bottom', 200);
    swipe.move(pointer('pointermove', 0, 280, 200));
    swipe.end(pointer('pointerup', 0, 280, 400), 0.35);
    expect(settled).toHaveBeenLastCalledWith(0, expect.any(Event));
    expect(dismissed).not.toHaveBeenCalled();
  });

  it('never dismisses below the smallest point unless swipe dismissal is enabled', () => {
    for (const dismissible of [false, true]) {
      const settled = vi.fn();
      const { swipe, pointer, dismissed } = setup(() => ({
        heights: [100, 200, 300],
        dismissible,
        settled,
      }));
      swipe.start(pointer('pointerdown', 0, 100), 'bottom', 200);
      swipe.move(pointer('pointermove', 0, 300, 200));
      swipe.end(pointer('pointerup', 0, 300, 400), 0.35);
      expect(dismissed).toHaveBeenCalledTimes(dismissible ? 1 : 0);
      expect(settled).toHaveBeenCalledTimes(dismissible ? 0 : 1);
    }
  });

  it('cancels snap gestures without committing a point or dismissal', () => {
    const settled = vi.fn();
    const { swipe, pointer, dismissed, changed } = setup(() => ({
      heights: [100, 200, 300],
      dismissible: true,
      settled,
    }));
    swipe.start(pointer('pointerdown', 0, 200), 'bottom', 200);
    swipe.move(pointer('pointermove', 0, 100, 200));
    swipe.end(pointer('pointercancel', 0, 100, 400), 0.35);
    expect(settled).not.toHaveBeenCalled();
    expect(dismissed).not.toHaveBeenCalled();
    expect(changed).toHaveBeenLastCalledWith(0, 0, false);
  });

  it('leaves upward body scrolling native at the largest snap point', () => {
    const settled = vi.fn();
    const { swipe, pointer } = setup(() => ({
      heights: [100, 200, 300],
      dismissible: false,
      settled,
    }));
    swipe.start(pointer('pointerdown', 0, 200), 'bottom', 300);
    expect(swipe.move(pointer('pointermove', 0, 100, 200))).toBe(false);
    swipe.end(pointer('pointerup', 0, 100, 400), 0.35);
    expect(settled).not.toHaveBeenCalled();
  });
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    document.getSelection()?.removeAllRanges();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('retains eligible pointers near screen edges without moving before intent', () => {
    const { swipe, pointer, captures, changed } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'right', 200);
    expect(captures.size).toBe(1);
    swipe.move(pointer('pointermove', 3, 0, 10));
    expect(changed).not.toHaveBeenCalled();
    swipe.move(pointer('pointermove', 20, 0, 20));
    expect(captures.size).toBe(1);
    swipe.cancel();
  });

  it('excludes interactive and custom gesture descendants without preventing their events', () => {
    for (const markup of [
      '<input>',
      '<button>Action</button>',
      '<a href="#">Link</a>',
      '<div contenteditable="true">Edit</div>',
      '<div role="slider"></div>',
      '<div data-aeris-swipe-ignore>Custom</div>',
    ]) {
      const { swipe, pointer, changed, dismissed } = setup();
      const surface = document.createElement('div');
      surface.innerHTML = markup;
      const event = pointer('pointerdown', 0, 0);
      Object.defineProperty(event, 'currentTarget', { value: surface });
      Object.defineProperty(event, 'target', { value: surface.firstElementChild });
      swipe.start(event, 'right', 200);
      const move = pointer('pointermove', 150, 0, 100);
      swipe.move(move);
      swipe.end(pointer('pointerup', 150, 0, 110), 0.35);
      expect(move.defaultPrevented).toBe(false);
      expect(changed).not.toHaveBeenCalled();
      expect(dismissed).not.toHaveBeenCalled();
    }
  });

  it('preserves vertical scrolling until its dismissal boundary, then accepts a new touch gesture', () => {
    const { swipe, changed, dismissed } = setup();
    const surface = document.createElement('div');
    const scroll = document.createElement('div');
    scroll.style.overflowY = 'auto';
    Object.defineProperties(scroll, { scrollHeight: { value: 500 }, clientHeight: { value: 100 } });
    surface.append(scroll);
    surface.getBoundingClientRect = () => new DOMRect(0, 0, 200, 200);
    document.body.append(surface);
    const cleanup = swipe.listenForTouch(
      surface,
      'bottom',
      () => 0.35,
      () => true,
    );
    const touch = (type: string, y: number, time: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      const point = { identifier: 7, clientX: 0, clientY: y, target: scroll };
      Object.defineProperties(event, {
        touches: { value: type === 'touchend' ? [] : [point] },
        changedTouches: { value: [point] },
        timeStamp: { value: time },
      });
      scroll.dispatchEvent(event);
      return event;
    };
    try {
      scroll.scrollTop = 50;
      touch('touchstart', 0, 0);
      expect(touch('touchmove', 150, 100).defaultPrevented).toBe(false);
      touch('touchend', 150, 120);
      expect(dismissed).not.toHaveBeenCalled();
      expect(changed).not.toHaveBeenCalled();
      scroll.scrollTop = 0;
      touch('touchstart', 0, 200);
      expect(touch('touchmove', 150, 300).defaultPrevented).toBe(true);
      touch('touchend', 150, 320);
      expect(dismissed).toHaveBeenCalledOnce();
    } finally {
      cleanup();
      swipe.cancel();
      surface.remove();
    }
  });

  for (const [position, x, y] of [
    ['left', -100, 0],
    ['right', 100, 0],
    ['top', 0, -100],
    ['bottom', 0, 100],
  ] as const) {
    it(`dismisses toward the physical ${position} edge`, () => {
      const { swipe, pointer, dismissed, captures } = setup();
      swipe.start(pointer('pointerdown', 0, 0), position, 200);
      swipe.move(pointer('pointermove', x, y, 200));
      swipe.end(pointer('pointerup', x, y, 210), 0.35);
      expect(dismissed).toHaveBeenCalledOnce();
      expect(captures.size).toBe(0);
    });
  }

  it('returns short and held drags rather than treating them as flicks', () => {
    const { swipe, pointer, dismissed, changed } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'bottom', 400);
    swipe.move(pointer('pointermove', 0, 20, 10));
    swipe.end(pointer('pointerup', 0, 20, 20), 0.35);
    expect(dismissed).not.toHaveBeenCalled();
    expect(changed).toHaveBeenLastCalledWith(0, 0, false);
    swipe.start(pointer('pointerdown', 0, 0), 'bottom', 400);
    swipe.move(pointer('pointermove', 0, 50, 20));
    swipe.end(pointer('pointerup', 0, 50, 300), 0.35);
    expect(dismissed).not.toHaveBeenCalled();
  });

  it('accepts deliberate flicks and normalizes invalid thresholds', () => {
    const { swipe, pointer, dismissed } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'right', 400);
    swipe.move(pointer('pointermove', 40, 0, 20));
    swipe.end(pointer('pointerup', 40, 0, 30), Number.NaN);
    expect(dismissed).toHaveBeenCalledOnce();
  });

  it('does not activate perpendicular or opposite-direction movement', () => {
    for (const [x, y] of [
      [0, 30],
      [-30, 0],
    ]) {
      const { swipe, pointer, dismissed, changed, captures } = setup();
      swipe.start(pointer('pointerdown', 0, 0), 'right', 200);
      swipe.move(pointer('pointermove', x, y, 100));
      swipe.end(pointer('pointerup', x, y, 110), 0.35);
      expect(dismissed).not.toHaveBeenCalled();
      expect(changed).toHaveBeenLastCalledWith(0, 0, false);
      expect(captures.size).toBe(0);
    }
  });

  it('cancels pointer cancellation, lost capture, and additional pointers', () => {
    for (const end of ['pointercancel', 'lostpointercapture']) {
      const { swipe, pointer, dismissed, captures } = setup();
      swipe.start(pointer('pointerdown', 0, 0), 'bottom', 200);
      swipe.move(pointer('pointermove', 0, 150, 100));
      swipe.end(pointer(end, 0, 150, 120), 0.35);
      expect(dismissed).not.toHaveBeenCalled();
      expect(captures.size).toBe(0);
    }
    const { swipe, pointer, dismissed, captures } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'bottom', 200);
    swipe.start(pointer('pointerdown', 0, 0, 1, 2), 'bottom', 200);
    swipe.end(pointer('pointerup', 0, 150, 100), 0.35);
    expect(dismissed).not.toHaveBeenCalled();
    expect(captures.size).toBe(0);
  });

  it('coalesces pointer moves into one animation frame and cancels pending work', () => {
    const { swipe, pointer, changed, dismissed } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'right', 200);
    for (let x = 10; x <= 50; x += 10) swipe.move(pointer('pointermove', x, 0, x));
    expect(changed).not.toHaveBeenCalled();
    vi.advanceTimersByTime(20);
    expect(changed).toHaveBeenCalledOnce();
    expect(changed).toHaveBeenLastCalledWith(50, 0.25, true);
    swipe.move(pointer('pointermove', 60, 0, 60));
    swipe.cancel();
    vi.advanceTimersByTime(20);
    expect(changed).toHaveBeenLastCalledWith(0, 0, false);
    expect(dismissed).not.toHaveBeenCalled();
  });

  it('suppresses the release click without swallowing a subsequent intentional action', () => {
    const { swipe, pointer } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'right', 200);
    swipe.move(pointer('pointermove', 150, 0, 100));
    swipe.end(pointer('pointerup', 150, 0, 120), 0.35);
    const click = new MouseEvent('click', { detail: 1, cancelable: true });
    document.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    document.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 2 }));
    const next = new MouseEvent('click', { detail: 1, cancelable: true });
    document.dispatchEvent(next);
    expect(next.defaultPrevented).toBe(false);
    vi.advanceTimersByTime(750);
  });

  it('ignores secondary buttons and never captures an invalid extent', () => {
    const { swipe, pointer, captures } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'left', 0);
    expect(captures.size).toBe(0);
    const secondary = pointer('pointerdown', 0, 0);
    Object.defineProperty(secondary, 'button', { value: 2 });
    swipe.start(secondary, 'left', 200);
    expect(captures.size).toBe(0);
    swipe.cancel();
  });

  it('rejects release after viewport changes even before its resize event arrives', () => {
    const { swipe, pointer, dismissed } = setup();
    swipe.start(pointer('pointerdown', 0, 0), 'bottom', 200);
    swipe.move(pointer('pointermove', 0, 150, 100));
    const height = window.innerHeight;
    try {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: height - 20 });
      swipe.end(pointer('pointerup', 0, 150, 120), 0.35);
      expect(dismissed).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
    }
  });
});
