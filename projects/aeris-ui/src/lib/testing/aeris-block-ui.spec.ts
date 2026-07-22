import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisBlockUI, AerisBlockUIModule } from '../../../block-ui/aeris-block-ui';

@Component({
  imports: [AerisBlockUIModule],
  template: `
    <button class="outside" type="button">Outside</button>
    <aeris-block-ui
      [backdropBlur]="blur()"
      backdropBlurAmount="0.875rem"
      [(blocked)]="blocked"
    >
      <button class="inside" type="button">Inside</button>
    </aeris-block-ui>
  `,
})
class TargetBlockHost {
  readonly blocked = signal(true);
  readonly blur = signal(true);
}

@Component({
  imports: [AerisBlockUIModule],
  template: `
    <button class="opener" type="button">Open</button>
    <aeris-block-ui fullScreen [(blocked)]="blocked" />
  `,
})
class FullScreenBlockHost {
  readonly blocked = signal(false);
}

afterEach(() => {
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-inline-end');
});

describe('AerisBlockUI', () => {
  it('blocks projected content and exposes busy semantics', () => {
    const fixture = TestBed.createComponent(TargetBlockHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-block-ui') as HTMLElement;
    const content = host.querySelector('.aeris-block-ui__content') as HTMLElement;
    const overlay = host.querySelector('.aeris-block-ui__overlay') as HTMLElement;

    expect(AerisBlockUIModule).toEqual([AerisBlockUI]);
    expect(host.dataset['blocked']).toBe('true');
    expect(host.getAttribute('aria-busy')).toBe('true');
    expect(content.hasAttribute('inert')).toBe(true);
    expect(content.getAttribute('aria-busy')).toBe('true');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.getAttribute('data-backdrop-blur')).toBe('true');
    expect(overlay.style.getPropertyValue('--aeris-block-ui-backdrop-blur')).toBe('0.875rem');
    expect(getComputedStyle(overlay).position).toBe('absolute');
    expect(getComputedStyle(host).isolation).toBe('isolate');

    fixture.componentInstance.blur.set(false);
    fixture.detectChanges();
    expect(overlay.hasAttribute('data-backdrop-blur')).toBe(false);
  });

  it('reacts to the blocked model and restores content interaction', () => {
    const fixture = TestBed.createComponent(TargetBlockHost);
    fixture.detectChanges();
    fixture.componentInstance.blocked.set(false);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-block-ui') as HTMLElement;
    const content = host.querySelector('.aeris-block-ui__content') as HTMLElement;

    expect(host.dataset['blocked']).toBeUndefined();
    expect(host.getAttribute('aria-busy')).toBe('false');
    expect(content.hasAttribute('inert')).toBe(false);
    expect(host.querySelector('.aeris-block-ui__overlay')).toBeNull();
  });

  it('moves focus out of a newly blocked target and restores it', async () => {
    const fixture = TestBed.createComponent(TargetBlockHost);
    fixture.componentInstance.blocked.set(false);
    fixture.detectChanges();
    const inside = fixture.nativeElement.querySelector('.inside') as HTMLButtonElement;
    inside.focus();

    fixture.componentInstance.blocked.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('aeris-block-ui') as HTMLElement;
    expect(document.activeElement).toBe(host);

    fixture.componentInstance.blocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(inside);
  });

  it('blocks the viewport, guards keyboard focus, and locks scrolling without layout shift', async () => {
    const fixture = TestBed.createComponent(FullScreenBlockHost);
    fixture.detectChanges();
    const opener = fixture.nativeElement.querySelector('.opener') as HTMLButtonElement;
    opener.focus();

    fixture.componentInstance.blocked.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('aeris-block-ui') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('.aeris-block-ui__overlay') as HTMLElement;
    expect(getComputedStyle(overlay).position).toBe('fixed');
    expect(getComputedStyle(host).isolation).toBe('auto');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(host);

    opener.focus();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(host);

    fixture.componentInstance.blocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
  });
});
