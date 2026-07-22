import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisDialog,
  AerisDialogModule,
  type AerisDialogVisibilityChangeEvent,
} from '../../../dialog/aeris-dialog';

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

@Component({
  imports: [AerisDialogModule],
  template: `
    <button type="button" id="launcher" (click)="open.set(true)">Open</button>
    <aeris-dialog
      header="Project details"
      ariaDescribedBy="dialog-description"
      [backdropBlur]="blur()"
      backdropBlurAmount="1.25rem"
      [(visible)]="open"
      (shown)="shownCount.update((count) => count + 1)"
      (hidden)="lastHidden.set($event)"
    >
      <p id="dialog-description">Review the project before publishing.</p>
      <button type="button" id="first-action">First action</button>
      <button type="button" id="last-action">Last action</button>
    </aeris-dialog>
  `,
})
class BasicDialogHost {
  readonly open = signal(false);
  readonly blur = signal(true);
  readonly shownCount = signal(0);
  readonly lastHidden = signal<AerisDialogVisibilityChangeEvent | null>(null);
}

@Component({
  imports: [AerisDialogModule],
  template: `
    <aeris-dialog
      #dialog
      ariaLabel="Templated dialog"
      position="top-right"
      size="lg"
      [modal]="false"
      [backdrop]="false"
      width="38rem"
      minWidth="20rem"
      maxWidth="calc(100vw - 3rem)"
      height="24rem"
      maxHeight="80vh"
      mobileWidth="calc(100vw - 1rem)"
      dismissibleMask
      maximizable
      draggable
      resizable
      [(visible)]="open"
      [(maximized)]="maximized"
      (visibilityChanged)="events.update((items) => [...items, $event])"
    >
      <ng-template aerisDialogHeader let-maximized="maximized">
        Template header {{ maximized ? 'maximized' : 'normal' }}
      </ng-template>
      <ng-template aerisDialogCloseIcon>
        <span class="custom-close">close</span>
      </ng-template>
      <p>Templated body.</p>
      <ng-template aerisDialogFooter let-close="close">
        <button type="button" id="footer-close" (click)="close($event)">Done</button>
      </ng-template>
    </aeris-dialog>
  `,
})
class TemplatedDialogHost {
  readonly dialog = viewChild.required<AerisDialog>('dialog');
  readonly open = signal(true);
  readonly maximized = signal(false);
  readonly events = signal<readonly AerisDialogVisibilityChangeEvent[]>([]);
}

@Component({
  imports: [AerisDialogModule],
  template: `
    <button id="before" type="button">Before</button>
    <aeris-dialog header="Focus trap" [visible]="true" initialFocus="#target">
      <button id="target" type="button">Target</button>
      <button id="second" type="button">Second</button>
    </aeris-dialog>
  `,
})
class FocusDialogHost {}

@Component({
  imports: [AerisDialogModule],
  template: `
    <aeris-dialog ariaLabel="Invalid focus selector" [visible]="true" initialFocus="[invalid">
      <button id="safe-fallback" type="button">Fallback</button>
    </aeris-dialog>
  `,
})
class InvalidFocusDialogHost {}

@Component({
  imports: [AerisDialogModule],
  template: `
    <aeris-dialog ariaLabel="Headless dialog" [visible]="true">
      <ng-template aerisDialogHeadless let-close="close">
        <div class="headless-shell">
          <p>Headless content</p>
          <button type="button" id="headless-close" (click)="close($event)">Close</button>
        </div>
      </ng-template>
    </aeris-dialog>
  `,
})
class HeadlessDialogHost {}

describe('AerisDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.paddingInlineEnd = '';
  });

  it('renders accessible modal dialog semantics and restores focus on close', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1017);
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
    document.body.style.paddingInlineEnd = '4px';

    const fixture = TestBed.createComponent(BasicDialogHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.focus();
    launcher.click();
    fixture.detectChanges();
    await settle();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-dialog__title') as HTMLElement;
    const close = fixture.nativeElement.querySelector('.aeris-dialog__action') as HTMLButtonElement;

    const overlay = fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement;
    expect(overlay.getAttribute('data-backdrop')).toBe('true');
    expect(overlay.getAttribute('data-backdrop-blur')).toBe('true');
    expect(overlay.style.getPropertyValue('--aeris-dialog-backdrop-blur')).toBe('1.25rem');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe('dialog-description');
    expect(title.textContent).toContain('Project details');
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
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('close-button');
    expect(document.activeElement).toBe(launcher);
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingInlineEnd).toBe('4px');
  });

  it('falls back safely when initialFocus is not a valid selector', async () => {
    const fixture = TestBed.createComponent(InvalidFocusDialogHost);
    await fixture.whenStable();
    await settle();

    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.contains(document.activeElement)).toBe(true);
  });

  it('supports templates, attributes, maximized state, footer close callback, and methods', async () => {
    const fixture = TestBed.createComponent(TemplatedDialogHost);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement;
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-dialog__title') as HTMLElement;
    const maximize = fixture.nativeElement.querySelector(
      '.aeris-dialog__action[aria-pressed]',
    ) as HTMLButtonElement;

    expect(overlay.getAttribute('data-position')).toBe('top-right');
    expect(overlay.hasAttribute('data-modal')).toBe(false);
    expect(overlay.hasAttribute('data-backdrop')).toBe(false);
    expect(dialog.getAttribute('aria-label')).toBe('Templated dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
    expect(dialog.getAttribute('data-size')).toBe('lg');
    expect(dialog.getAttribute('data-draggable')).toBe('true');
    expect(dialog.getAttribute('data-resizable')).toBe('true');
    expect(dialog.style.getPropertyValue('--aeris-dialog-width')).toBe('38rem');
    expect(dialog.style.getPropertyValue('--aeris-dialog-min-width')).toBe('20rem');
    expect(dialog.style.getPropertyValue('--aeris-dialog-max-width')).toBe('calc(100vw - 3rem)');
    expect(dialog.style.getPropertyValue('--aeris-dialog-height')).toBe('24rem');
    expect(dialog.style.getPropertyValue('--aeris-dialog-max-height')).toBe('80vh');
    expect(dialog.style.getPropertyValue('--aeris-dialog-mobile-width')).toBe('calc(100vw - 1rem)');
    expect(title.textContent).toContain('Template header normal');
    expect(fixture.nativeElement.querySelector('.custom-close')?.textContent).toContain('close');

    maximize.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.maximized()).toBe(true);
    expect(overlay.getAttribute('data-maximized')).toBe('true');
    expect(title.textContent).toContain('Template header maximized');

    const footerClose = fixture.nativeElement.querySelector('#footer-close') as HTMLButtonElement;
    footerClose.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.visible).toBe(false);
  });

  it('dismisses with Escape and mask only when enabled', async () => {
    const fixture = TestBed.createComponent(TemplatedDialogHost);
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.reason).toBe('escape');

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await settle();

    const overlay = fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement;
    overlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.events().at(-1)?.reason).toBe('mask');
  });

  it('traps Tab inside the dialog and supports initialFocus', async () => {
    const fixture = TestBed.createComponent(FocusDialogHost);
    await fixture.whenStable();
    await settle();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    const second = fixture.nativeElement.querySelector('#second') as HTMLButtonElement;
    const close = fixture.nativeElement.querySelector('.aeris-dialog__action') as HTMLButtonElement;

    expect(document.activeElement).toBe(target);

    second.focus();
    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(close);

    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
  });

  it('supports public show, hide, toggle, focus, maximize, and restore methods', async () => {
    const fixture = TestBed.createComponent(TemplatedDialogHost);
    await fixture.whenStable();

    const dialog = fixture.componentInstance.dialog();
    dialog.hide();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);

    dialog.show();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);

    dialog.maximize();
    expect(fixture.componentInstance.maximized()).toBe(true);

    dialog.restore();
    expect(fixture.componentInstance.maximized()).toBe(false);

    dialog.focus();
    await settle();
    expect(
      (fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement).contains(
        document.activeElement,
      ),
    ).toBe(true);

    dialog.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('supports headless composition with dialog semantics and close callback', async () => {
    const fixture = TestBed.createComponent(HeadlessDialogHost);
    await fixture.whenStable();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const close = fixture.nativeElement.querySelector('#headless-close') as HTMLButtonElement;

    expect(dialog.getAttribute('data-headless')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Headless dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
    expect(fixture.nativeElement.querySelector('.aeris-dialog__header')).toBeNull();
    expect(fixture.nativeElement.querySelector('.headless-shell')?.textContent).toContain(
      'Headless content',
    );

    close.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });
});
