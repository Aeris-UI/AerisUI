import { TestBed } from '@angular/core/testing';
import { ɵAerisDatePickerTimeControl } from '../../../date-picker/aeris-date-picker-time-control';

async function createControl(value = 15, step = 1) {
  const fixture = TestBed.createComponent(ɵAerisDatePickerTimeControl);
  fixture.componentRef.setInput('value', value);
  fixture.componentRef.setInput('label', 'Minute');
  fixture.componentRef.setInput('labelId', 'test-minute');
  fixture.componentRef.setInput('step', step);
  const changes: number[] = [];
  fixture.componentInstance.changed.subscribe((event) => {
    changes.push(event.value);
    fixture.componentRef.setInput('value', event.value);
  });
  await fixture.whenStable();
  const root = fixture.nativeElement as HTMLElement;
  const wheel = root.querySelector<HTMLElement>('.wheel')!;
  vi.spyOn(root.querySelector<HTMLElement>('.wheel-row')!, 'getBoundingClientRect').mockReturnValue(
    { height: 44 } as DOMRect,
  );
  // jsdom has no pointer capture; browser regressions exercise the native implementation.
  wheel.setPointerCapture = vi.fn();
  wheel.hasPointerCapture = vi.fn(() => true);
  wheel.releasePointerCapture = vi.fn();
  const pointer = (type: string, y: number, pointerId = 1) =>
    wheel.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId,
        isPrimary: true,
        button: 0,
        clientY: y,
      }),
    );
  return { fixture, root, wheel, changes, pointer };
}

describe('DatePicker popup time control', () => {
  it('labels the native field and wheel and uses Aeris chevrons instead of native arrows', async () => {
    const { root, wheel } = await createControl();
    expect(root.querySelector('input')?.getAttribute('aria-labelledby')).toBe('test-minute');
    expect(wheel.getAttribute('aria-labelledby')).toBe('test-minute');
    expect(wheel.getAttribute('aria-valuenow')).toBe('15');
    expect(root.querySelectorAll('[aerisInternalIcon="chevron"]').length).toBe(2);
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Increase Minute');
  });

  it('wraps stepped values and emits once for each button activation', async () => {
    const { fixture, root, changes } = await createControl(45, 15);
    const buttons = root.querySelectorAll('button');
    buttons[0].click();
    await fixture.whenStable();
    buttons[1].click();
    await fixture.whenStable();
    expect(changes).toEqual([0, 45]);
    expect(root.querySelector('input')?.value).toBe('45');
  });

  it('keeps empty typed values intermediate and permits off-step typed numbers', async () => {
    const { root, changes } = await createControl(15, 15);
    const input = root.querySelector('input')!;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(changes).toEqual([]);
    input.value = '23';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(changes).toEqual([23]);
  });

  it('wraps both supported hour ranges without changing the range contract', async () => {
    const { fixture, root, changes } = await createControl(23);
    fixture.componentRef.setInput('max', 23);
    await fixture.whenStable();
    root.querySelector('button')?.click();
    await fixture.whenStable();
    expect(changes).toEqual([0]);
    fixture.componentRef.setInput('min', 1);
    fixture.componentRef.setInput('max', 12);
    fixture.componentRef.setInput('value', 12);
    await fixture.whenStable();
    root.querySelector('button')?.click();
    await fixture.whenStable();
    expect(changes).toEqual([0, 1]);
  });

  it('supports arrow, Home and End keys without intercepting Tab or Escape', async () => {
    const { fixture, wheel, changes } = await createControl();
    for (const key of ['ArrowUp', 'ArrowDown', 'Home', 'End']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      wheel.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      await fixture.whenStable();
    }
    expect(changes).toEqual([16, 15, 0, 59]);
    for (const key of ['Tab', 'Escape']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      wheel.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
  });

  it('moves the number track with the pointer and commits one stepped value on release', async () => {
    const { fixture, root, wheel, changes, pointer } = await createControl(15, 5);
    pointer('pointerdown', 23);
    pointer('pointermove', -31);
    await fixture.whenStable();
    expect(wheel.getAttribute('data-dragging')).toBe('true');
    expect(wheel.getAttribute('aria-valuenow')).toBe('20');
    expect((root.querySelector('.wheel-track') as HTMLElement).style.translate).toBe('0 -10px');
    expect(changes).toEqual([]);
    pointer('pointerup', -31);
    await fixture.whenStable();
    expect(changes).toEqual([20]);
    expect(wheel.hasAttribute('data-dragging')).toBe(false);
    expect((root.querySelector('.wheel-track') as HTMLElement).style.translate).toBe('0 0px');
  });

  it('restores the value after pointer cancellation or lost capture', async () => {
    const { fixture, wheel, changes, pointer } = await createControl();
    for (const cancellation of ['pointercancel', 'lostpointercapture']) {
      pointer('pointerdown', 23);
      pointer('pointermove', 0);
      pointer(cancellation, 0);
      await fixture.whenStable();
      expect(wheel.getAttribute('aria-valuenow')).toBe('15');
      expect(wheel.hasAttribute('data-dragging')).toBe(false);
      expect(changes).toEqual([]);
    }
  });

  it('keeps taps on the selected number unchanged and rejects disabled interactions', async () => {
    const { fixture, wheel, changes, pointer } = await createControl();
    pointer('pointerdown', 23);
    pointer('pointerup', 23);
    await fixture.whenStable();
    expect(changes).toEqual([]);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    pointer('pointerdown', 23);
    pointer('pointermove', 0);
    pointer('pointerup', 0);
    wheel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(changes).toEqual([]);
    expect(wheel.getAttribute('aria-disabled')).toBe('true');
    expect(wheel.tabIndex).toBe(-1);
  });

  it('cancels a gesture if disabled before release and ignores other pointers', async () => {
    const { fixture, wheel, changes, pointer } = await createControl();
    pointer('pointerdown', 23);
    pointer('pointermove', 0, 2);
    await fixture.whenStable();
    expect(wheel.getAttribute('aria-valuenow')).toBe('15');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    pointer('pointerup', 0);
    await fixture.whenStable();
    expect(changes).toEqual([]);
    expect(wheel.hasAttribute('data-dragging')).toBe(false);
  });
});
