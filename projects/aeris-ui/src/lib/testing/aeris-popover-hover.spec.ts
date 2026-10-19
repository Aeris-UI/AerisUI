import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisPopoverModule, AerisPopover } from '../../../popover/aeris-popover';

@Component({
  imports: [AerisPopoverModule],
  template: `
    <button #first type="button" id="hover-first">Preview</button>
    <button #second type="button" id="hover-second">Other preview</button>
    <a #link href="#destination" id="hover-link">Destination</a>
    <button id="outside" type="button">Outside</button>
    <aeris-popover
      #popover
      trigger="hover"
      [target]="useLink() ? link : other() ? second : first"
      [(visible)]="visible"
      [appendTo]="mount()"
      [openDelay]="100"
      [closeDelay]="50"
      header="Preview"
      closable
    >
      <button id="preview-first" type="button">First action</button>
      <button id="preview-last" type="button" aria-controls="owned-panel">Last action</button>
      <button #nestedTarget id="nested-preview" type="button" (click)="nested.show(nestedTarget)">
        Nested
      </button>
      <aeris-popover #nested header="Nested preview"
        ><button id="nested-action">Nested action</button></aeris-popover
      >
    </aeris-popover>
  `,
})
class HoverHost {
  readonly popover = viewChild.required<AerisPopover>('popover');
  readonly visible = signal(false);
  readonly other = signal(false);
  readonly useLink = signal(false);
  readonly mount = signal<'body' | 'self'>('body');
}

describe('AerisPopover hover and focus', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'queueMicrotask'] }));
  afterEach(() => vi.useRealTimers());

  function setup(mount: 'body' | 'self' = 'body') {
    const fixture = TestBed.createComponent(HoverHost);
    fixture.componentInstance.mount.set(mount);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('#hover-first') as HTMLButtonElement;
    const outside = fixture.nativeElement.querySelector('#outside') as HTMLButtonElement;
    const flush = () => {
      fixture.detectChanges();
      vi.runAllTicks();
      fixture.detectChanges();
    };
    const pointer = (
      element: Element,
      type: string,
      pointerType = 'mouse',
      relatedTarget: EventTarget | null = null,
    ) => {
      element.dispatchEvent(new PointerEvent(type, { pointerType, pointerId: 1, relatedTarget }));
      flush();
    };
    return {
      fixture,
      trigger,
      outside,
      flush,
      pointer,
      popover: fixture.componentInstance.popover(),
    };
  }

  it.each(['body', 'self'] as const)(
    'delays pointer opening without autofocus or aria-modal (%s)',
    (mount) => {
      const { trigger, outside, pointer, flush, popover } = setup(mount);
      outside.focus();
      pointer(trigger, 'pointerenter');
      vi.advanceTimersByTime(99);
      flush();
      expect(popover.visible()).toBe(false);
      vi.advanceTimersByTime(1);
      flush();
      expect(popover.visible()).toBe(true);
      expect(document.activeElement).toBe(outside);
      const panel = document.querySelector('.aeris-popover__panel');
      expect(panel?.getAttribute('role')).toBe('dialog');
      expect(panel?.hasAttribute('aria-modal')).toBe(false);
      expect(trigger.getAttribute('aria-controls')).toBe(panel?.id);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    },
  );

  it('cancels delayed opening on departure, retargeting and destruction', () => {
    const { fixture, trigger, pointer, flush, popover } = setup();
    pointer(trigger, 'pointerenter');
    pointer(trigger, 'pointerleave');
    vi.advanceTimersByTime(100);
    flush();
    expect(popover.visible()).toBe(false);
    pointer(trigger, 'pointerenter');
    fixture.componentInstance.other.set(true);
    flush();
    vi.advanceTimersByTime(100);
    flush();
    expect(popover.visible()).toBe(false);
    pointer(fixture.nativeElement.querySelector('#hover-second'), 'pointerenter');
    fixture.destroy();
    vi.runAllTimers();
    expect(document.querySelector('.aeris-popover__panel')).toBeNull();
  });

  it('opens immediately on keyboard focus and permits Tab entry and Shift+Tab return', () => {
    const { trigger, flush, popover } = setup();
    trigger.focus();
    flush();
    expect(popover.visible()).toBe(true);
    expect(document.activeElement).toBe(trigger);
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    flush();
    const first = document.querySelector('.aeris-popover__close') as HTMLButtonElement;
    expect(document.activeElement).toBe(first);
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    );
    flush();
    expect(document.activeElement).toBe(trigger);
  });

  it('keeps focus in owned portaled content and closes after it leaves without stealing focus', () => {
    const { trigger, outside, flush, popover } = setup();
    trigger.focus();
    flush();
    const owned = document.createElement('div');
    owned.id = 'owned-panel';
    const action = document.createElement('button');
    owned.append(action);
    document.body.append(owned);
    try {
      action.focus();
      vi.advanceTimersByTime(1000);
      flush();
      expect(popover.visible()).toBe(true);
      outside.focus();
      vi.advanceTimersByTime(49);
      flush();
      expect(popover.visible()).toBe(true);
      vi.advanceTimersByTime(1);
      flush();
      expect(popover.visible()).toBe(false);
      expect(document.activeElement).toBe(outside);
    } finally {
      owned.remove();
    }
  });

  it('suppresses Escape reopening until a fresh focus cycle', () => {
    const { trigger, outside, flush, popover } = setup();
    trigger.focus();
    flush();
    (document.querySelector('#preview-first') as HTMLButtonElement).focus();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    flush();
    vi.advanceTimersByTime(1000);
    flush();
    expect(popover.visible()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    outside.focus();
    trigger.focus();
    flush();
    expect(popover.visible()).toBe(true);
  });

  it('ignores touch hover, toggles with a button click and preserves link navigation', () => {
    const { fixture, trigger, pointer, flush, popover } = setup();
    pointer(trigger, 'pointerenter', 'touch');
    vi.advanceTimersByTime(200);
    flush();
    expect(popover.visible()).toBe(false);
    pointer(trigger, 'pointerdown', 'touch');
    trigger.focus();
    flush();
    expect(popover.visible()).toBe(false);
    trigger.click();
    flush();
    expect(popover.visible()).toBe(true);
    trigger.click();
    flush();
    expect(popover.visible()).toBe(false);
    fixture.componentInstance.useLink.set(true);
    flush();
    const link = fixture.nativeElement.querySelector('#hover-link') as HTMLAnchorElement;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    expect(link.dispatchEvent(click)).toBe(true);
    expect(click.defaultPrevented).toBe(false);
    expect(popover.visible()).toBe(false);
  });

  it('cancels delayed work when controlled visibility closes and removes trigger listeners', () => {
    const { fixture, trigger, pointer, flush, popover } = setup();
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(100);
    flush();
    fixture.componentInstance.visible.set(false);
    flush();
    vi.advanceTimersByTime(1000);
    flush();
    expect(popover.visible()).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    fixture.destroy();
    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    vi.runAllTimers();
    expect(document.querySelector('.aeris-popover__panel')).toBeNull();
  });

  it('keeps a nested body-mounted popover open and lets Escape dismiss only that layer', () => {
    const { trigger, flush, popover } = setup();
    trigger.focus();
    flush();
    (document.querySelector('#nested-preview') as HTMLButtonElement).click();
    flush();
    vi.advanceTimersByTime(1000);
    flush();
    expect(document.activeElement?.id).toBe('nested-action');
    expect(popover.visible()).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    flush();
    expect(popover.visible()).toBe(true);
    expect(document.querySelectorAll('.aeris-popover__panel')).toHaveLength(1);
    expect(document.activeElement?.id).toBe('nested-preview');
  });

  it('restores focus for a controlled close but not for an outside pointer dismissal', () => {
    const { fixture, trigger, outside, flush, popover } = setup();
    trigger.focus();
    flush();
    (document.querySelector('#preview-first') as HTMLButtonElement).focus();
    fixture.componentInstance.visible.set(false);
    flush();
    expect(document.activeElement).toBe(trigger);
    outside.focus();
    trigger.focus();
    flush();
    (document.querySelector('#preview-first') as HTMLButtonElement).focus();
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    outside.focus();
    flush();
    expect(popover.visible()).toBe(false);
    expect(document.activeElement).toBe(outside);
  });
});
