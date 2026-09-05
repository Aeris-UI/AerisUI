import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  aerisInternalClampColumnResizeDelta,
  aerisInternalColumnWidthPixels,
  aerisInternalSetColumnPairWidths,
} from '../aeris-column-resize';
import { aerisInternalCreateFrameScheduler } from '../aeris-frame-scheduler';
import { aerisInternalFocusableElements } from '../aeris-focus';
import { aerisInternalPositionAnchoredOverlay } from '../aeris-overlay-position';

describe('Aeris internal layout utilities', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('positions and clamps anchored overlays within the viewport', () => {
    const position = aerisInternalPositionAnchoredOverlay({
      target: { top: 180, right: 300, bottom: 220, left: 260, width: 40, height: 40 },
      width: 160,
      height: 120,
      placement: 'auto',
      alignment: 'center',
      offset: 8,
      margin: 12,
      viewportWidth: 320,
      viewportHeight: 240,
    });

    expect(position).toEqual({ placement: 'top', x: 148, y: 52 });
  });

  it.each([
    ['top', { top: 2, right: 180, bottom: 42, left: 140, width: 40, height: 40 }, 'bottom'],
    ['right', { top: 80, right: 318, bottom: 120, left: 278, width: 40, height: 40 }, 'left'],
    ['bottom', { top: 198, right: 180, bottom: 238, left: 140, width: 40, height: 40 }, 'top'],
    ['left', { top: 80, right: 42, bottom: 120, left: 2, width: 40, height: 40 }, 'right'],
  ] as const)('flips %s overlays away from viewport edges', (preferred, target, expected) => {
    const position = aerisInternalPositionAnchoredOverlay({
      target,
      width: 120,
      height: 80,
      placement: preferred,
      alignment: 'center',
      offset: 8,
      margin: 8,
      viewportWidth: 320,
      viewportHeight: 240,
    });

    expect(position.placement).toBe(expected);
    expect(position.x).toBeGreaterThanOrEqual(8);
    expect(position.y).toBeGreaterThanOrEqual(8);
    expect(position.x + 120).toBeLessThanOrEqual(312);
    expect(position.y + 80).toBeLessThanOrEqual(232);
  });

  it('honors visual viewport offsets and per-edge exclusion zones', () => {
    const position = aerisInternalPositionAnchoredOverlay({
      target: { top: 390, right: 260, bottom: 430, left: 220, width: 40, height: 40 },
      width: 140,
      height: 100,
      placement: 'bottom',
      alignment: 'start',
      offset: 8,
      margin: 0,
      viewportLeft: 20,
      viewportTop: 200,
      viewportWidth: 360,
      viewportHeight: 280,
      collisionPadding: { top: 12, right: 16, bottom: 64, left: 10 },
    });

    expect(position).toEqual({ placement: 'top', x: 220, y: 282 });
  });

  it('keeps tethered overlays attached when their anchor scrolls beyond the viewport', () => {
    const position = aerisInternalPositionAnchoredOverlay({
      target: { top: -100, right: 160, bottom: -60, left: 80, width: 80, height: 40 },
      width: 180,
      height: 120,
      placement: 'auto',
      alignment: 'start',
      offset: 8,
      margin: 8,
      viewportWidth: 360,
      viewportHeight: 640,
      tetherToAnchor: true,
    });

    expect(position).toEqual({ placement: 'bottom', x: 80, y: -52 });
  });

  it('keeps paired column resizing within the configured minimum', () => {
    const delta = aerisInternalClampColumnResizeDelta(100, 160, 120, 96);
    const columns = aerisInternalSetColumnPairWidths(
      [
        { field: 'name', width: '160px' },
        { field: 'team', width: '120px' },
      ],
      'name',
      'team',
      160 + delta,
      120 - delta,
    );

    expect(delta).toBe(24);
    expect(columns.map((column) => column.width)).toEqual(['184px', '96px']);
    expect(aerisInternalColumnWidthPixels('10rem')).toBe(160);
  });

  it('coalesces repeated work into one animation frame', () => {
    let frameCallback: FrameRequestCallback | undefined;
    const request = vi.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 7;
    });
    vi.stubGlobal('requestAnimationFrame', request);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const callback = vi.fn();
    const scheduler = aerisInternalCreateFrameScheduler(callback);

    scheduler.schedule();
    scheduler.schedule();
    scheduler.schedule();
    expect(request).toHaveBeenCalledOnce();
    expect(callback).not.toHaveBeenCalled();

    frameCallback?.(16);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('excludes hidden, inert, disabled, and negative-tabindex controls from focus order', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button id="normal">Normal</button>
      <button id="later" tabindex="2">Later</button>
      <button id="first" tabindex="1">First</button>
      <button id="negative" tabindex="-1">Negative</button>
      <button id="hidden" hidden>Hidden</button>
      <button id="disabled" disabled>Disabled</button>
      <input id="hidden-input" type="hidden">
      <div inert><button id="inert-child">Inert child</button></div>
      <div aria-hidden="true"><button id="aria-hidden-child">Hidden child</button></div>
      <div style="display: none"><button id="display-none-child">Display none child</button></div>
      <details><button id="closed-details-child">Closed details child</button></details>
    `;
    document.body.append(root);

    try {
      expect(
        aerisInternalFocusableElements(root, { checkComputedVisibility: true }).map(
          (element) => element.id,
        ),
      ).toEqual(['first', 'later', 'normal']);
    } finally {
      root.remove();
    }
  });
});
