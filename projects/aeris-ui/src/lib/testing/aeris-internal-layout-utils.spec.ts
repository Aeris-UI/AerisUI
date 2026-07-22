import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  aerisInternalClampColumnResizeDelta,
  aerisInternalColumnWidthPixels,
  aerisInternalSetColumnPairWidths,
} from '../aeris-column-resize';
import { aerisInternalCreateFrameScheduler } from '../aeris-frame-scheduler';
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
});
