import { Component, inject, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisConfirmPopup,
  AerisConfirmPopupModule,
  AerisConfirmPopupService,
  type AerisConfirmPopupActionEvent,
  type AerisConfirmPopupCloseEvent,
} from '../../../confirm-popup/aeris-confirm-popup';

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
  imports: [AerisConfirmPopupModule],
  template: `
    <button type="button" id="launcher" (click)="confirmDelete($event)">Delete</button>
  `,
})
class ServiceConfirmPopupHost {
  private readonly confirmations = inject(AerisConfirmPopupService);
  readonly accepted = signal<AerisConfirmPopupActionEvent<{ readonly id: string }> | null>(null);
  readonly closed = signal<AerisConfirmPopupCloseEvent<{ readonly id: string }> | null>(null);
  readonly callbackMessage = signal('');

  confirmDelete(event: MouseEvent): void {
    const ref = this.confirmations.confirm<{ readonly id: string }>({
      target: event,
      header: 'Delete project?',
      message: 'This removes the project from the workspace.',
      data: { id: 'aeris' },
      severity: 'danger',
      icon: 'danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Keep',
      defaultFocus: 'reject',
      placement: 'bottom',
      accept: (action) => this.callbackMessage.set(`accepted ${action.data?.id}`),
    });
    ref.accepted.subscribe((action) => this.accepted.set(action));
    ref.closed.subscribe((close) => this.closed.set(close));
  }
}

@Component({
  imports: [AerisConfirmPopupModule],
  template: `
    <button #target type="button" id="target">Target</button>
    <aeris-confirm-popup
      #popup
      [target]="target"
      header="Leave workflow?"
      message="Unsaved work will be discarded."
      acceptLabel="Leave"
      rejectLabel="Stay"
      severity="warning"
      defaultFocus="accept"
      [(visible)]="open"
      (rejected)="rejected.set($event)"
      (closed)="closed.set($event)"
    />
  `,
})
class DeclarativeConfirmPopupHost {
  readonly popup = viewChild.required<AerisConfirmPopup>('popup');
  readonly open = signal(true);
  readonly rejected = signal<AerisConfirmPopupActionEvent | null>(null);
  readonly closed = signal<AerisConfirmPopupCloseEvent | null>(null);
}

@Component({
  imports: [AerisConfirmPopupModule],
  template: `
    <button type="button" id="launcher" (click)="confirm($event)">Save</button>
    <aeris-confirm-popup key="custom">
      <ng-template aerisConfirmPopupIcon>
        <span class="custom-icon">!</span>
      </ng-template>
      <ng-template aerisConfirmPopupMessage let-data="data">
        <strong class="custom-message">Template message {{ data?.scope }}</strong>
      </ng-template>
      <ng-template aerisConfirmPopupFooter let-accept="accept" let-reject="reject">
        <button type="button" id="template-reject" (click)="reject($event)">No</button>
        <button type="button" id="template-accept" (click)="accept($event)">Yes</button>
      </ng-template>
    </aeris-confirm-popup>
  `,
})
class TemplatedConfirmPopupHost {
  private readonly confirmations = inject(AerisConfirmPopupService);

  confirm(event: MouseEvent): void {
    this.confirmations.confirm({
      key: 'custom',
      target: event,
      header: 'Custom confirmation',
      data: { scope: 'release' },
      icon: 'none',
    });
  }
}

@Component({
  imports: [AerisConfirmPopupModule],
  template: `
    <button type="button" id="launcher" (click)="confirm($event)">Deploy</button>
    <aeris-confirm-popup key="headless">
      <ng-template aerisConfirmPopupHeadless let-accept="accept" let-close="close">
        <div class="headless-shell">
          <p>Headless confirmation</p>
          <button type="button" id="headless-close" (click)="close($event)">Close</button>
          <button type="button" id="headless-accept" (click)="accept($event)">Deploy</button>
        </div>
      </ng-template>
    </aeris-confirm-popup>
  `,
})
class HeadlessConfirmPopupHost {
  private readonly confirmations = inject(AerisConfirmPopupService);

  confirm(event: MouseEvent): void {
    this.confirmations.confirm({
      key: 'headless',
      target: event,
      header: 'Deploy?',
      message: 'Headless content replaces the default popup UI.',
    });
  }
}

describe('AerisConfirmPopup', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  it('opens from the service relative to a target with alert dialog semantics and trigger state', async () => {
    const fixture = TestBed.createComponent(ServiceConfirmPopupHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    vi.spyOn(launcher, 'getBoundingClientRect').mockReturnValue(rect(360, 120, 90, 34));
    launcher.focus();
    launcher.click();
    fixture.detectChanges();
    await settle();
    await settle();

    const popup = document.querySelector('[role="alertdialog"]') as HTMLElement;
    const title = document.querySelector('.aeris-confirm-popup__title') as HTMLElement;
    const reject = document.querySelector('.aeris-confirm-popup__reject') as HTMLButtonElement;
    const accept = document.querySelector('.aeris-confirm-popup__accept') as HTMLButtonElement;

    expect(popup).toBeTruthy();
    expect(popup.getAttribute('aria-modal')).toBe('true');
    expect(popup.getAttribute('aria-labelledby')).toBe(title.id);
    expect(popup.getAttribute('aria-describedby')).toContain('aeris-confirm-popup');
    expect(popup.getAttribute('data-placement')).toBe('bottom');
    expect(Number.parseFloat(popup.style.left)).toBeGreaterThan(0);
    expect(Number.parseFloat(popup.style.top)).toBeGreaterThan(0);
    expect(title.textContent).toContain('Delete project?');
    expect(document.querySelector('.aeris-confirm-popup__message')?.textContent).toContain(
      'This removes the project',
    );
    expect(accept.classList.contains('aeris-button')).toBe(true);
    expect(accept.classList.contains('aeris-button--severity-danger')).toBe(true);
    expect(reject.classList.contains('aeris-button--secondary')).toBe(true);
    expect(launcher.getAttribute('aria-haspopup')).toBe('dialog');
    expect(launcher.getAttribute('aria-expanded')).toBe('true');
    expect(launcher.getAttribute('aria-controls')).toBe(popup.id);
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(reject);

    accept.click();
    fixture.detectChanges();
    await settle();
    await settle();

    expect(fixture.componentInstance.callbackMessage()).toBe('accepted aeris');
    expect(fixture.componentInstance.accepted()?.data?.id).toBe('aeris');
    expect(fixture.componentInstance.closed()?.result).toBe('accept');
    expect(fixture.componentInstance.closed()?.reason).toBe('accept');
    expect(launcher.getAttribute('aria-haspopup')).toBeNull();
    expect(launcher.getAttribute('aria-expanded')).toBeNull();
    expect(launcher.getAttribute('aria-controls')).toBeNull();
    expect(document.activeElement).toBe(launcher);
    expect(document.querySelector('aeris-confirm-popup')).toBeNull();
  });

  it('supports declarative state, public methods, and Escape dismissal', async () => {
    const fixture = TestBed.createComponent(DeclarativeConfirmPopupHost);
    await fixture.whenStable();
    await settle();
    await settle();

    const accept = fixture.nativeElement.querySelector(
      '.aeris-confirm-popup__accept',
    ) as HTMLButtonElement;

    expect(document.activeElement).toBe(accept);

    fixture.componentInstance.popup().reject();
    fixture.detectChanges();

    expect(fixture.componentInstance.rejected()).toBeTruthy();
    expect(fixture.componentInstance.closed()?.result).toBe('reject');

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await settle();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.closed()?.result).toBe('dismiss');
    expect(fixture.componentInstance.closed()?.reason).toBe('escape');
  });

  it('dismisses on outside pointerdown when dismissible', async () => {
    const fixture = TestBed.createComponent(ServiceConfirmPopupHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    await settle();

    expect(fixture.componentInstance.closed()?.result).toBe('dismiss');
    expect(fixture.componentInstance.closed()?.reason).toBe('outside');
  });

  it('renders custom icon, message, and footer templates through a keyed host', async () => {
    const fixture = TestBed.createComponent(TemplatedConfirmPopupHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.nativeElement.querySelector('.custom-icon')?.textContent).toContain('!');
    expect(fixture.nativeElement.querySelector('.custom-message')?.textContent).toContain(
      'release',
    );
    expect(fixture.nativeElement.querySelector('#template-reject')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#template-accept')).toBeTruthy();
  });

  it('supports headless template content', async () => {
    const fixture = TestBed.createComponent(HeadlessConfirmPopupHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.nativeElement.querySelector('.headless-shell')?.textContent).toContain(
      'Headless confirmation',
    );
    expect(fixture.nativeElement.querySelector('#headless-close')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#headless-accept')).toBeTruthy();
  });
});
