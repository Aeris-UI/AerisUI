import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisDrawer,
  AerisDrawerModule,
  type AerisDrawerVisibilityChangeEvent,
} from '../../../drawer/aeris-drawer';

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));
const DRAWER_EXIT_DURATION_MS = 220;

@Component({
  imports: [AerisDrawerModule],
  template: `
    <button type="button" id="launcher" (click)="open.set(true)">Open</button>
    <aeris-drawer
      header="Navigation"
      ariaDescribedBy="drawer-description"
      [backdropBlur]="blur()"
      backdropBlurAmount="1rem"
      [(visible)]="open"
      (shown)="shownCount.update((count) => count + 1)"
      (hidden)="lastHidden.set($event)"
    >
      <p id="drawer-description">Choose a destination.</p>
      <button type="button" id="first-action">First action</button>
      <button type="button" id="last-action">Last action</button>
    </aeris-drawer>
  `,
})
class BasicDrawerHost {
  readonly open = signal(false);
  readonly blur = signal(true);
  readonly shownCount = signal(0);
  readonly lastHidden = signal<AerisDrawerVisibilityChangeEvent | null>(null);
}

@Component({
  imports: [AerisDrawerModule],
  template: `
    <aeris-drawer
      #drawer
      ariaLabel="Templated drawer"
      position="left"
      size="lg"
      [modal]="false"
      [backdrop]="false"
      width="30rem"
      height="18rem"
      maxWidth="calc(100vw - 2rem)"
      maxHeight="80vh"
      mobileWidth="100vw"
      mobileHeight="100vh"
      mobileFullScreen
      maximizable
      dismissibleMask
      [(visible)]="open"
      [(maximized)]="maximized"
      (visibilityChanged)="events.update((items) => [...items, $event])"
    >
      <ng-template aerisDrawerHeader let-position="position" let-maximized="maximized">
        Template header {{ position }} {{ maximized ? 'maximized' : 'normal' }}
      </ng-template>
      <ng-template aerisDrawerCloseIcon>
        <span class="custom-close">close</span>
      </ng-template>
      <p>Templated body.</p>
      <ng-template aerisDrawerFooter let-close="close">
        <button type="button" id="footer-close" (click)="close($event)">Done</button>
      </ng-template>
    </aeris-drawer>
  `,
})
class TemplatedDrawerHost {
  readonly drawer = viewChild.required<AerisDrawer>('drawer');
  readonly open = signal(true);
  readonly maximized = signal(false);
  readonly events = signal<readonly AerisDrawerVisibilityChangeEvent[]>([]);
}

@Component({
  imports: [AerisDrawerModule],
  template: `
    <button id="before" type="button">Before</button>
    <aeris-drawer header="Focus trap" [visible]="true" initialFocus="#target">
      <button id="target" type="button">Target</button>
      <button id="second" type="button">Second</button>
    </aeris-drawer>
  `,
})
class FocusDrawerHost {}

@Component({
  imports: [AerisDrawerModule],
  template: `
    <aeris-drawer header="Backdropless" [visible]="true" [backdrop]="false">
      <p>Body stays locked without a visible mask.</p>
    </aeris-drawer>
  `,
})
class BackdroplessDrawerHost {}

@Component({
  imports: [AerisDrawerModule],
  template: `
    <aeris-drawer ariaLabel="Headless drawer" [visible]="true">
      <ng-template aerisDrawerHeadless let-close="close">
        <div class="headless-shell">
          <p>Headless content</p>
          <button type="button" id="headless-close" (click)="close($event)">Close</button>
        </div>
      </ng-template>
    </aeris-drawer>
  `,
})
class HeadlessDrawerHost {}

describe('AerisDrawer', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.paddingInlineEnd = '';
  });

  it('renders accessible modal drawer semantics and restores focus on close', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1017);
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
    document.body.style.paddingInlineEnd = '4px';

    const fixture = TestBed.createComponent(BasicDrawerHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.focus();
    launcher.click();
    fixture.detectChanges();
    await settle();

    const drawer = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-drawer__title') as HTMLElement;
    const close = fixture.nativeElement.querySelector('.aeris-drawer__close') as HTMLButtonElement;

    const overlay = fixture.nativeElement.querySelector('.aeris-drawer__overlay') as HTMLElement;
    expect(overlay.getAttribute('data-backdrop')).toBe('true');
    expect(overlay.getAttribute('data-backdrop-blur')).toBe('true');
    expect(overlay.style.getPropertyValue('--aeris-drawer-backdrop-blur')).toBe('1rem');
    expect(drawer.getAttribute('aria-modal')).toBe('true');
    expect(drawer.getAttribute('aria-labelledby')).toBe(title.id);
    expect(drawer.getAttribute('aria-describedby')).toBe('drawer-description');
    expect(drawer.getAttribute('data-position')).toBe('right');
    expect(drawer.getAttribute('data-state')).toBe('open');
    expect(title.textContent).toContain('Navigation');
    expect(fixture.componentInstance.shownCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingInlineEnd).toBe('21px');

    fixture.componentInstance.blur.set(false);
    fixture.detectChanges();
    expect(overlay.hasAttribute('data-backdrop-blur')).toBe(false);

    close.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(drawer.getAttribute('data-state')).toBe('closed');
    expect(fixture.nativeElement.querySelector('.aeris-drawer__overlay')?.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelector('.aeris-drawer__overlay')?.hasAttribute('inert')).toBe(true);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('close-button');
    expect(document.activeElement).toBe(launcher);
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingInlineEnd).toBe('4px');
  });

  it('keeps page scrolling locked when the backdrop is disabled on a modal drawer', async () => {
    const fixture = TestBed.createComponent(BackdroplessDrawerHost);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.aeris-drawer__overlay') as HTMLElement;

    expect(overlay.hasAttribute('data-backdrop')).toBe(false);
    expect(overlay.getAttribute('data-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('supports templates, sizing attributes, mobile fullscreen, footer close callback, and non-modal mode', async () => {
    const fixture = TestBed.createComponent(TemplatedDrawerHost);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.aeris-drawer__overlay') as HTMLElement;
    const drawer = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-drawer__title') as HTMLElement;
    const maximize = fixture.nativeElement.querySelector(
      '.aeris-drawer__action[aria-pressed]',
    ) as HTMLButtonElement;

    expect(overlay.getAttribute('data-position')).toBe('left');
    expect(overlay.hasAttribute('data-modal')).toBe(false);
    expect(overlay.hasAttribute('data-backdrop')).toBe(false);
    expect(drawer.getAttribute('aria-label')).toBe('Templated drawer');
    expect(drawer.getAttribute('aria-labelledby')).toBeNull();
    expect(drawer.getAttribute('data-size')).toBe('lg');
    expect(drawer.getAttribute('data-mobile-fullscreen')).toBe('true');
    expect(drawer.style.getPropertyValue('--aeris-drawer-width')).toBe('30rem');
    expect(drawer.style.getPropertyValue('--aeris-drawer-height')).toBe('18rem');
    expect(drawer.style.getPropertyValue('--aeris-drawer-max-width')).toBe('calc(100vw - 2rem)');
    expect(drawer.style.getPropertyValue('--aeris-drawer-max-height')).toBe('80vh');
    expect(drawer.style.getPropertyValue('--aeris-drawer-mobile-width')).toBe('100vw');
    expect(drawer.style.getPropertyValue('--aeris-drawer-mobile-height')).toBe('100vh');
    expect(title.textContent).toContain('Template header left normal');
    expect(fixture.nativeElement.querySelector('.custom-close')?.textContent).toContain('close');

    maximize.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.maximized()).toBe(true);
    expect(drawer.getAttribute('data-maximized')).toBe('true');
    expect(overlay.getAttribute('data-maximized')).toBe('true');
    expect(title.textContent).toContain('Template header left maximized');

    const footerClose = fixture.nativeElement.querySelector('#footer-close') as HTMLButtonElement;
    footerClose.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.visible).toBe(false);
  });

  it('dismisses with Escape and mask only when enabled', async () => {
    const fixture = TestBed.createComponent(TemplatedDrawerHost);
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.reason).toBe('escape');

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await settle();

    const overlay = fixture.nativeElement.querySelector('.aeris-drawer__overlay') as HTMLElement;
    overlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.reason).toBe('mask');
  });

  it('traps Tab inside the drawer and supports initialFocus', async () => {
    const fixture = TestBed.createComponent(FocusDrawerHost);
    await fixture.whenStable();
    await settle();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    const second = fixture.nativeElement.querySelector('#second') as HTMLButtonElement;
    const close = fixture.nativeElement.querySelector('.aeris-drawer__close') as HTMLButtonElement;

    expect(document.activeElement).toBe(target);

    second.focus();
    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(close);

    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
  });

  it('supports public show, hide, toggle, and focus methods', async () => {
    const fixture = TestBed.createComponent(TemplatedDrawerHost);
    await fixture.whenStable();

    const drawer = fixture.componentInstance.drawer();
    drawer.hide();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);

    drawer.show();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);

    drawer.focus();
    await settle();
    expect(
      (fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement).contains(
        document.activeElement,
      ),
    ).toBe(true);

    drawer.maximize();
    fixture.detectChanges();
    expect(fixture.componentInstance.maximized()).toBe(true);

    drawer.restore();
    fixture.detectChanges();
    expect(fixture.componentInstance.maximized()).toBe(false);

    drawer.toggleMaximized();
    fixture.detectChanges();
    expect(fixture.componentInstance.maximized()).toBe(true);

    drawer.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('supports headless composition with drawer semantics and close callback', async () => {
    const fixture = TestBed.createComponent(HeadlessDrawerHost);
    await fixture.whenStable();

    const drawer = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const close = fixture.nativeElement.querySelector('#headless-close') as HTMLButtonElement;

    expect(drawer.getAttribute('data-headless')).toBe('true');
    expect(drawer.getAttribute('aria-label')).toBe('Headless drawer');
    expect(drawer.getAttribute('aria-labelledby')).toBeNull();
    expect(fixture.nativeElement.querySelector('.aeris-drawer__header')).toBeNull();
    expect(fixture.nativeElement.querySelector('.headless-shell')?.textContent).toContain(
      'Headless content',
    );

    vi.useFakeTimers();
    close.click();
    fixture.detectChanges();

    expect(drawer.getAttribute('data-state')).toBe('closed');
    vi.advanceTimersByTime(DRAWER_EXIT_DURATION_MS);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });
});
