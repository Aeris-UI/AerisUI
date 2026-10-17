import {
  aerisInternalCreateHoverInteraction,
  aerisInternalWithinHoverBridge,
} from '../../../popover/aeris-hover-interaction';
import { aerisInternalPositionAnchoredOverlay } from '../aeris-overlay-position';

describe('hover interaction foundation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  function setup() {
    const trigger = document.createElement('button');
    const content = document.createElement('section');
    const action = document.createElement('button');
    content.append(action);
    document.body.append(trigger, content);
    let visible = false;
    const open = vi.fn(() => {
      visible = true;
    });
    const close = vi.fn(() => {
      visible = false;
    });
    const options = {
      document,
      trigger: () => trigger,
      content: () => content,
      isOpen: () => visible,
      open,
      close,
      openDelay: () => 100,
      closeDelay: () => 50,
    };
    const interaction = aerisInternalCreateHoverInteraction(options);
    vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      right: 200,
      top: 120,
      bottom: 200,
    } as DOMRect);
    return { trigger, content, action, open, close, interaction, options, isOpen: () => visible };
  }
  const pointer = (type = 'mouse', x = 130, y = 105, relatedTarget: EventTarget | null = null) =>
    new PointerEvent('pointerleave', {
      pointerType: type,
      pointerId: 1,
      clientX: x,
      clientY: y,
      relatedTarget,
    });

  it('cancels delayed opening when the pointer leaves or the owner resets', () => {
    const { interaction, open } = setup();
    interaction.pointerEnter('trigger', pointer());
    vi.advanceTimersByTime(99);
    expect(open).not.toHaveBeenCalled();
    interaction.pointerLeave('trigger', pointer());
    vi.runAllTimers();
    expect(open).not.toHaveBeenCalled();
    interaction.pointerEnter('trigger', pointer());
    interaction.reset();
    vi.runAllTimers();
    expect(open).not.toHaveBeenCalled();
  });

  it('opens on focus immediately without moving focus, and treats both focus regions as one owner', () => {
    const { interaction, trigger, action, open, close } = setup();
    trigger.focus();
    interaction.focusIn();
    expect(open).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
    interaction.focusOut(action);
    vi.runAllTimers();
    expect(close).not.toHaveBeenCalled();
    interaction.focusOut(document.body);
    vi.advanceTimersByTime(50);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('retains an overlay until both pointer and focus ownership end', () => {
    const { interaction, close } = setup();
    interaction.pointerEnter('content', pointer());
    vi.advanceTimersByTime(100);
    interaction.focusIn();
    interaction.focusOut(null);
    vi.advanceTimersByTime(500);
    expect(close).not.toHaveBeenCalled();
    interaction.pointerLeave('content', pointer());
    vi.runAllTimers();
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('keeps a diagonal gap transit open and cancels all transit work on entry', () => {
    const { interaction, content, close } = setup();
    interaction.pointerEnter('trigger', pointer());
    vi.advanceTimersByTime(100);
    interaction.pointerLeave('trigger', pointer('mouse', 90, 100));
    document.dispatchEvent(
      new PointerEvent('pointermove', { pointerId: 1, clientX: 110, clientY: 115 }),
    );
    vi.advanceTimersByTime(200);
    expect(close).not.toHaveBeenCalled();
    interaction.pointerEnter('content', pointer('mouse', 115, 125, content));
    vi.runAllTimers();
    expect(close).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    interaction.destroy();
  });

  it.each(['outside', 'timeout', 'cancel', 'scroll', 'resize', 'blur', 'destroy'])(
    'cleans a safe transit on %s',
    (reason) => {
      const { interaction, close } = setup();
      interaction.pointerEnter('trigger', pointer());
      vi.advanceTimersByTime(100);
      interaction.pointerLeave('trigger', pointer());
      if (reason === 'outside')
        document.dispatchEvent(
          new PointerEvent('pointermove', { pointerId: 1, clientX: 500, clientY: 500 }),
        );
      if (reason === 'cancel')
        document.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }));
      if (reason === 'scroll') document.dispatchEvent(new Event('scroll'));
      if (reason === 'resize' || reason === 'blur') window.dispatchEvent(new Event(reason));
      if (reason === 'destroy') interaction.destroy();
      vi.runAllTimers();
      expect(close).toHaveBeenCalledTimes(reason === 'destroy' ? 0 : 1);
      expect(vi.getTimerCount()).toBe(0);
      const count = close.mock.calls.length;
      document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1 }));
      vi.runAllTimers();
      expect(close).toHaveBeenCalledTimes(count);
    },
  );

  it('does not reopen after Escape while focus remains inside; a new ownership cycle works', () => {
    const { interaction, open, close } = setup();
    interaction.focusIn();
    interaction.dismiss();
    interaction.pointerEnter('trigger', pointer());
    vi.runAllTimers();
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    interaction.pointerLeave('trigger', pointer());
    interaction.focusOut(null);
    interaction.focusIn();
    expect(open).toHaveBeenCalledTimes(2);
  });

  it('rearms keyboard focus after dismissal while a synthesized hover still owns the trigger', () => {
    const { interaction, open } = setup();
    interaction.pointerEnter('trigger', pointer());
    interaction.focusIn();
    interaction.dismiss();
    interaction.focusOut(document.body);
    interaction.focusIn();
    expect(open).toHaveBeenCalledTimes(2);
    interaction.destroy();
  });

  it('ignores touch hover and supports explicit activation without preventing navigation', () => {
    const { interaction, open, close, trigger } = setup();
    const event = pointer('touch');
    interaction.pointerEnter('trigger', event);
    interaction.pointerLeave('trigger', event);
    vi.runAllTimers();
    expect(open).not.toHaveBeenCalled();
    trigger.focus();
    interaction.pointerDown();
    interaction.focusIn();
    expect(open).not.toHaveBeenCalled();
    interaction.activate();
    expect(open).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
    expect(event.defaultPrevented).toBe(false);
    interaction.activate();
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('cancels a pending close on re-entry and ignores all work after destruction', () => {
    const { interaction, open, close } = setup();
    interaction.focusIn();
    interaction.focusOut(null);
    vi.advanceTimersByTime(25);
    interaction.pointerEnter('trigger', pointer('pen'));
    vi.advanceTimersByTime(100);
    expect(close).not.toHaveBeenCalled();
    interaction.destroy();
    interaction.focusIn();
    interaction.activate();
    interaction.pointerEnter('trigger', pointer());
    vi.runAllTimers();
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
  });

  it('normalizes invalid delays and permits owned portaled focus descendants', () => {
    const { options, open, close } = setup();
    const child = document.createElement('button');
    document.body.append(child);
    const interaction = aerisInternalCreateHoverInteraction({
      ...options,
      openDelay: () => Number.NaN,
      closeDelay: () => -5,
      ownsTarget: (target) => target === child,
    });
    interaction.focusIn();
    interaction.focusOut(child);
    vi.runAllTimers();
    expect(close).not.toHaveBeenCalled();
    interaction.focusOut(null);
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe('hover bridge geometry and logical placement', () => {
  it.each([
    [
      { x: 90, y: 140 },
      { x: 100, y: 140 },
    ],
    [
      { x: 210, y: 140 },
      { x: 200, y: 140 },
    ],
    [
      { x: 150, y: 90 },
      { x: 150, y: 110 },
    ],
    [
      { x: 150, y: 210 },
      { x: 150, y: 200 },
    ],
  ])('accepts a physical transit in any direction: %j', (origin, point) => {
    const bounds = { left: 110, right: 190, top: 120, bottom: 190 };
    expect(aerisInternalWithinHoverBridge(point, origin, bounds)).toBe(true);
    expect(aerisInternalWithinHoverBridge({ x: 500, y: 500 }, origin, bounds)).toBe(false);
  });

  it('maps logical horizontal alignment in RTL without changing vertical alignment', () => {
    const base = {
      target: { left: 300, right: 380, top: 100, bottom: 140, width: 80, height: 40 },
      width: 160,
      height: 80,
      offset: 10,
      margin: 8,
      viewportWidth: 1000,
      viewportHeight: 700,
      placement: 'bottom',
      alignment: 'start',
    } as const;
    expect(aerisInternalPositionAnchoredOverlay(base).x).toBe(300);
    expect(aerisInternalPositionAnchoredOverlay({ ...base, direction: 'rtl' }).x).toBe(220);
    expect(
      aerisInternalPositionAnchoredOverlay({ ...base, direction: 'rtl', alignment: 'end' }).x,
    ).toBe(300);
    expect(
      aerisInternalPositionAnchoredOverlay({ ...base, direction: 'rtl', placement: 'right' }).y,
    ).toBe(100);
  });
});
