import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisDialogModule } from '../../../dialog/aeris-dialog';
import { AerisSelect } from '../../../select/aeris-select';
import {
  dismissTopAerisOverlay,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
} from '@aeris-ui/core';
import { aerisInternalObserveViewport, aerisInternalViewportBounds } from '../aeris-viewport';

@Component({
  imports: [AerisDialogModule, AerisSelect],
  template: `<aeris-dialog header="Mobile form" [(visible)]="open" [closeOnEscape]="dismissible()">
    <aeris-select ariaLabel="Role" [options]="options" />
  </aeris-dialog>`,
})
class MobileFormHost {
  readonly open = signal(true);
  readonly dismissible = signal(true);
  readonly options = [{ label: 'Designer', value: 'designer' }];
}

describe('Aeris mobile overlay foundation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles an empty or server-side stack without navigation side effects', () => {
    expect(dismissTopAerisOverlay(document.implementation.createHTMLDocument())).toBe('none');
  });

  it('dismisses only the top overlay and does not bypass a locked overlay', () => {
    const isolated = document.implementation.createHTMLDocument();
    const first = {},
      second = {};
    const dismiss = vi.fn(() => true);
    ɵregisterAerisOverlay(isolated, first, dismiss);
    ɵregisterAerisOverlay(isolated, second);
    expect(dismissTopAerisOverlay(isolated)).toBe('blocked');
    expect(dismiss).not.toHaveBeenCalled();
    ɵunregisterAerisOverlay(isolated, second);
    expect(dismissTopAerisOverlay(isolated)).toBe('dismissed');
    expect(dismiss).toHaveBeenCalledOnce();
    ɵunregisterAerisOverlay(isolated, first);
    expect(dismissTopAerisOverlay(isolated)).toBe('none');
  });

  it('closes a dropdown before its parent dialog and restores the trigger', async () => {
    const fixture = TestBed.createComponent(MobileFormHost);
    await fixture.whenStable();
    const trigger = document.body.querySelector<HTMLButtonElement>('[role="combobox"]');
    trigger?.click();
    await fixture.whenStable();
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    expect(dismissTopAerisOverlay(document)).toBe('dismissed');
    await fixture.whenStable();
    expect(document.body.querySelector('[role="listbox"]')).toBeNull();
    expect(fixture.componentInstance.open()).toBe(true);
    expect(document.activeElement).toBe(trigger);
    expect(dismissTopAerisOverlay(document)).toBe('dismissed');
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
    fixture.destroy();
  });

  it('respects the dialog dismissal setting', async () => {
    const fixture = TestBed.createComponent(MobileFormHost);
    fixture.componentInstance.dismissible.set(false);
    await fixture.whenStable();
    expect(dismissTopAerisOverlay(document)).toBe('blocked');
    expect(fixture.componentInstance.open()).toBe(true);
    fixture.destroy();
  });

  it('releases dropdown ownership synchronously when selection closes its panel', async () => {
    const fixture = TestBed.createComponent(MobileFormHost);
    await fixture.whenStable();
    document.body.querySelector<HTMLButtonElement>('[role="combobox"]')?.click();
    await fixture.whenStable();
    document.body.querySelector<HTMLElement>('[role="option"]')?.click();
    expect(dismissTopAerisOverlay(document)).toBe('dismissed');
    expect(fixture.componentInstance.open()).toBe(false);
    fixture.destroy();
  });

  it('uses visible viewport offsets and restores inline styles when disposed', () => {
    const viewport = new EventTarget();
    Object.assign(viewport, { offsetLeft: 12, offsetTop: 30, width: 320, height: 400 });
    const original = Object.getOwnPropertyDescriptor(window, 'visualViewport');
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
    const bounds = aerisInternalViewportBounds(window);
    expect(bounds.left).toBe(12);
    expect(bounds.top).toBe(30);
    expect(bounds.height).toBe(400);
    const element = document.createElement('div');
    element.style.setProperty('--_aeris-viewport-top', '3px');
    const dispose = aerisInternalObserveViewport(element, document);
    expect(element.style.getPropertyValue('--_aeris-viewport-top')).toBe('30px');
    expect(element.style.getPropertyValue('--_aeris-viewport-height')).toBe('400px');
    dispose();
    expect(element.style.getPropertyValue('--_aeris-viewport-top')).toBe('3px');
    expect(element.style.getPropertyValue('--_aeris-viewport-height')).toBe('');
    if (original) Object.defineProperty(window, 'visualViewport', original);
    else Reflect.deleteProperty(window, 'visualViewport');
  });
});
