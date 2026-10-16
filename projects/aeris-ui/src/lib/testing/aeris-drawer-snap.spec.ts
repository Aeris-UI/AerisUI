import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AerisDrawer,
  AerisDrawerModule,
  type AerisDrawerSnapPoint,
} from '../../../drawer/aeris-drawer';
import { drawerSnapIndex, normalizeDrawerSnapPoints } from '../../../drawer/aeris-drawer-snap';

@Component({
  imports: [AerisDrawerModule],
  template: `
    <aeris-drawer
      header="Snap drawer"
      [position]="position()"
      [snapPoints]="points()"
      [(activeSnapPoint)]="point"
      [(visible)]="open"
      [maximized]="maximized()"
      [swipeToClose]="dismissible()"
      swipeHandle
      [closeOnEscape]="false"
      (activeSnapPointChange)="changes.update((count) => count + 1)"
    >
      <input aria-label="Project" />
      <p>Scrollable content remains native.</p>
      <aeris-drawer header="Nested drawer" [(visible)]="nestedOpen" />
    </aeris-drawer>
  `,
})
class SnapHost {
  readonly drawer = viewChild(AerisDrawer);
  readonly points = signal<readonly AerisDrawerSnapPoint[]>([0.3, 0.6, 0.9]);
  readonly point = signal<AerisDrawerSnapPoint | null>(null);
  readonly position = signal<'bottom' | 'right'>('bottom');
  readonly open = signal(true);
  readonly maximized = signal(false);
  readonly dismissible = signal(false);
  readonly changes = signal(0);
  readonly nestedOpen = signal(false);
}

describe('Drawer snap points', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('normalizes units, sorts, caps pixels and removes invalid/equivalent heights', () => {
    expect(
      normalizeDrawerSnapPoints([0.8, '200px', 0.2, 0, -1, 2, NaN, Infinity, '2000px'], 1000),
    ).toEqual([
      { value: '200px', height: 200 },
      { value: 0.8, height: 800 },
      { value: '2000px', height: 1000 },
    ]);
    expect(normalizeDrawerSnapPoints([0.5], 0)).toEqual([]);
    expect(normalizeDrawerSnapPoints([0.5], NaN)).toEqual([]);
    expect(normalizeDrawerSnapPoints(['20%' as AerisDrawerSnapPoint, '-1px', '0px'], 800)).toEqual(
      [],
    );
    expect(drawerSnapIndex(normalizeDrawerSnapPoints([0.2, 0.8], 1000), '200px', 1000)).toBe(0);
  });

  it('defaults to the smallest point without rewriting consumer state and exposes slider semantics', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    const handle = document.querySelector('[role="slider"]');
    expect(handle?.getAttribute('aria-label')).toBe('Resize drawer');
    expect(Number(handle?.getAttribute('aria-valuenow'))).toBeCloseTo(window.innerHeight * 0.3);
    expect(handle?.getAttribute('aria-valuetext')).toBe('30% of available height');
    expect(fixture.componentInstance.point()).toBeNull();
    expect(fixture.componentInstance.changes()).toBe(0);
  });

  it('supports arrows, page keys and Home/End without dismissing at either boundary', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    const handle = document.querySelector('[role="slider"]') as HTMLElement;
    for (const [key, expected] of [
      ['ArrowUp', 0.6],
      ['End', 0.9],
      ['ArrowUp', 0.9],
      ['PageDown', 0.6],
      ['Home', 0.3],
      ['ArrowDown', 0.3],
    ] as const) {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      await fixture.whenStable();
      expect(fixture.componentInstance.point()).toBe(expected);
      expect(fixture.componentInstance.open()).toBe(true);
    }
  });

  it('supports controlled updates, configured snapTo, invalid requests and maximize/restore', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.point.set(0.9);
    await fixture.whenStable();
    expect(document.querySelector('[role="slider"]')?.getAttribute('aria-valuetext')).toBe(
      '90% of available height',
    );
    host.drawer()?.snapTo(0.6);
    await fixture.whenStable();
    expect(host.point()).toBe(0.6);
    host.drawer()?.snapTo(0.4);
    expect(host.point()).toBe(0.6);
    host.maximized.set(true);
    await fixture.whenStable();
    expect(document.querySelector('[role="slider"]')).toBeNull();
    host.maximized.set(false);
    await fixture.whenStable();
    expect(document.querySelector('[role="slider"]')?.getAttribute('aria-valuetext')).toBe(
      '60% of available height',
    );
  });

  it('ignores unsupported edges and invalid configuration, retaining the ordinary drawer', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    fixture.componentInstance.position.set('right');
    await fixture.whenStable();
    expect(document.querySelector('[role="slider"]')).toBeNull();
    fixture.componentInstance.position.set('bottom');
    fixture.componentInstance.points.set([0, -1, NaN]);
    await fixture.whenStable();
    expect(document.querySelector('.aeris-drawer__panel')?.hasAttribute('data-snap-points')).toBe(
      false,
    );
  });

  it('does not change an underlying drawer while a nested overlay owns interaction', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    const handle = document.querySelector('[role="slider"]') as HTMLElement;
    fixture.componentInstance.nestedOpen.set(true);
    await fixture.whenStable();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.point()).toBeNull();
    fixture.componentInstance.nestedOpen.set(false);
    await fixture.whenStable();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.point()).toBe(0.9);
  });

  it('clears dismissal translation when snap points are enabled during a drag', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    const host = fixture.componentInstance;
    host.points.set([]);
    host.dismissible.set(true);
    await fixture.whenStable();
    const panel = document.querySelector('.aeris-drawer__panel') as HTMLElement;
    panel.getBoundingClientRect = () => new DOMRect(0, 0, 300, 300);
    const handle = panel.querySelector('.aeris-drawer__swipe-handle') as HTMLElement;
    for (const [type, y] of [
      ['pointerdown', 100],
      ['pointermove', 140],
    ] as const) {
      handle.dispatchEvent(
        new PointerEvent(type, {
          pointerId: 1,
          isPrimary: true,
          button: 0,
          clientY: y,
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await fixture.whenStable();
    expect(panel.style.transform).toContain('40px');
    host.points.set([0.3, 0.6, 0.9]);
    await fixture.whenStable();
    expect(panel.style.transform).toBe('');
    expect(panel.hasAttribute('data-swiping')).toBe(false);
    expect(host.open()).toBe(true);
  });

  it('recalculates fractional heights on viewport resize without emitting a point change', async () => {
    const fixture = TestBed.createComponent(SnapHost);
    await fixture.whenStable();
    const old = Object.getOwnPropertyDescriptor(window, 'innerHeight');
    try {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
      window.dispatchEvent(new Event('resize'));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await fixture.whenStable();
      expect(Number(document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow'))).toBe(
        180,
      );
      expect(fixture.componentInstance.changes()).toBe(0);
    } finally {
      if (old) Object.defineProperty(window, 'innerHeight', old);
    }
  });
});
