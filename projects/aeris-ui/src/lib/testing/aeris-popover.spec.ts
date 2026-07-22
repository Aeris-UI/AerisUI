import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisPopover,
  AerisPopoverModule,
  type AerisPopoverVisibilityChangeEvent,
} from '../../../popover/aeris-popover';

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => undefined,
  }) as DOMRect;

@Component({
  imports: [AerisPopoverModule],
  template: `
    <button type="button" id="launcher" (click)="popover.toggle($event)">Show</button>
    <aeris-popover
      #popover
      header="Flight details"
      placement="bottom"
      initialFocus="#first-action"
      closable
      (shown)="shownCount.update((count) => count + 1)"
      (hidden)="lastHidden.set($event)"
    >
      <p id="copy">Track flight progress and gate changes.</p>
      <button type="button" id="first-action">Track flight</button>
      <button type="button" id="last-action">Close later</button>
    </aeris-popover>
  `,
})
class BasicPopoverHost {
  readonly shownCount = signal(0);
  readonly lastHidden = signal<AerisPopoverVisibilityChangeEvent | null>(null);
}

@Component({
  imports: [AerisPopoverModule],
  template: `
    <button #target type="button" id="target">Target</button>
    <aeris-popover
      #popover
      [target]="target"
      header="Controlled"
      [(visible)]="open"
      (hidden)="lastHidden.set($event)"
    >
      <button type="button" id="controlled-action">Action</button>
    </aeris-popover>
  `,
})
class ControlledPopoverHost {
  readonly popover = viewChild.required<AerisPopover>('popover');
  readonly open = signal(true);
  readonly lastHidden = signal<AerisPopoverVisibilityChangeEvent | null>(null);
}

@Component({
  imports: [AerisPopoverModule],
  template: `
    <button type="button" id="launcher" (click)="popover.show($event)">Show templates</button>
    <aeris-popover #popover closable>
      <ng-template aerisPopoverHeader>
        <strong class="custom-header">Template header</strong>
      </ng-template>
      <ng-template aerisPopoverCloseIcon>
        <span class="custom-close">x</span>
      </ng-template>
      <p>Template body</p>
      <ng-template aerisPopoverFooter let-close="close">
        <button type="button" id="template-close" (click)="close($event)">Done</button>
      </ng-template>
    </aeris-popover>
  `,
})
class TemplatedPopoverHost {}

@Component({
  imports: [AerisPopoverModule],
  template: `
    <button type="button" id="launcher" (click)="popover.show($event)">Show headless</button>
    <aeris-popover #popover>
      <ng-template aerisPopoverHeadless let-close="close">
        <div class="headless-shell">
          <p>Headless content</p>
          <button type="button" id="headless-close" (click)="close($event)">Close</button>
        </div>
      </ng-template>
    </aeris-popover>
  `,
})
class HeadlessPopoverHost {}

describe('AerisPopover', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens relative to a trigger with dialog semantics and restores trigger state on close', async () => {
    const fixture = TestBed.createComponent(BasicPopoverHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    vi.spyOn(launcher, 'getBoundingClientRect').mockReturnValue(rect(360, 120, 90, 34));
    launcher.focus();
    launcher.click();
    fixture.detectChanges();
    await settle();
    await settle();

    const popover = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-popover__title') as HTMLElement;
    const firstAction = fixture.nativeElement.querySelector('#first-action') as HTMLButtonElement;
    const close = fixture.nativeElement.querySelector('.aeris-popover__close') as HTMLButtonElement;

    expect(popover).toBeTruthy();
    expect(popover.getAttribute('aria-modal')).toBe('true');
    expect(popover.getAttribute('aria-labelledby')).toBe(title.id);
    expect(popover.getAttribute('data-placement')).toBe('bottom');
    expect(Number.parseFloat(popover.style.left)).toBeGreaterThan(0);
    expect(Number.parseFloat(popover.style.top)).toBeGreaterThan(0);
    expect(title.textContent).toContain('Flight details');
    expect(launcher.getAttribute('aria-haspopup')).toBe('dialog');
    expect(launcher.getAttribute('aria-expanded')).toBe('true');
    expect(launcher.getAttribute('aria-controls')).toBe(popover.id);
    expect(document.activeElement).toBe(firstAction);
    expect(fixture.componentInstance.shownCount()).toBe(1);

    close.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.componentInstance.lastHidden()?.reason).toBe('close-button');
    expect(launcher.getAttribute('aria-haspopup')).toBeNull();
    expect(launcher.getAttribute('aria-expanded')).toBeNull();
    expect(launcher.getAttribute('aria-controls')).toBeNull();
    expect(document.activeElement).toBe(launcher);
  });

  it('supports controlled visibility, public methods, Escape dismissal, and Tab trapping', async () => {
    const fixture = TestBed.createComponent(ControlledPopoverHost);
    await fixture.whenStable();
    await settle();
    await settle();

    const action = fixture.nativeElement.querySelector('#controlled-action') as HTMLButtonElement;
    expect(document.activeElement).toBe(action);

    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(action);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('escape');

    fixture.componentInstance.popover().show(fixture.nativeElement.querySelector('#target'));
    fixture.detectChanges();
    await settle();
    expect(fixture.componentInstance.open()).toBe(true);

    fixture.componentInstance.popover().hide();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('dismisses on outside pointerdown when dismissible', async () => {
    const fixture = TestBed.createComponent(BasicPopoverHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    await settle();

    expect(fixture.componentInstance.lastHidden()?.reason).toBe('outside');
  });

  it('renders header, close icon, and footer templates', async () => {
    const fixture = TestBed.createComponent(TemplatedPopoverHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain(
      'Template header',
    );
    expect(fixture.nativeElement.querySelector('.custom-close')?.textContent).toContain('x');
    expect(fixture.nativeElement.querySelector('#template-close')).toBeTruthy();
  });

  it('supports headless template content', async () => {
    const fixture = TestBed.createComponent(HeadlessPopoverHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.nativeElement.querySelector('.headless-shell')?.textContent).toContain(
      'Headless content',
    );
    expect(fixture.nativeElement.querySelector('#headless-close')).toBeTruthy();
  });
});
