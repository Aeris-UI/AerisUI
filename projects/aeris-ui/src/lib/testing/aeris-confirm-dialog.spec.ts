import { Component, inject, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisConfirmDialog,
  AerisConfirmDialogModule,
  AerisConfirmDialogService,
  type AerisConfirmDialogActionEvent,
  type AerisConfirmDialogCloseEvent,
} from '../../../confirm-dialog/aeris-confirm-dialog';

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

@Component({
  imports: [AerisConfirmDialogModule],
  template: `
    <button type="button" id="launcher" (click)="confirmDelete()">Delete</button>
  `,
})
class ServiceConfirmDialogHost {
  private readonly confirmations = inject(AerisConfirmDialogService);
  readonly accepted = signal<AerisConfirmDialogActionEvent<{ readonly id: string }> | null>(null);
  readonly closed = signal<AerisConfirmDialogCloseEvent<{ readonly id: string }> | null>(null);
  readonly callbackMessage = signal('');

  confirmDelete(): void {
    const ref = this.confirmations.confirm<{ readonly id: string }>({
      header: 'Delete project?',
      message: 'This removes the project and its audit history.',
      data: { id: 'aeris' },
      severity: 'danger',
      icon: 'danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Keep project',
      defaultFocus: 'reject',
      accept: (event) => this.callbackMessage.set(`accepted ${event.data?.id}`),
    });
    ref.accepted.subscribe((event) => this.accepted.set(event));
    ref.closed.subscribe((event) => this.closed.set(event));
  }
}

@Component({
  imports: [AerisConfirmDialogModule],
  template: `
    <aeris-confirm-dialog
      #confirm
      header="Leave workflow?"
      message="Unsaved work will be discarded."
      acceptLabel="Leave"
      rejectLabel="Stay"
      severity="warning"
      defaultFocus="accept"
      [backdropBlur]="false"
      backdropBlurAmount="1rem"
      [(visible)]="open"
      (rejected)="rejected.set($event)"
      (closed)="closed.set($event)"
    />
  `,
})
class DeclarativeConfirmDialogHost {
  readonly confirm = viewChild.required<AerisConfirmDialog>('confirm');
  readonly open = signal(true);
  readonly rejected = signal<AerisConfirmDialogActionEvent | null>(null);
  readonly closed = signal<AerisConfirmDialogCloseEvent | null>(null);
}

@Component({
  imports: [AerisConfirmDialogModule],
  template: `
    <aeris-confirm-dialog
      header="Custom confirmation"
      [visible]="true"
      [data]="templateData"
      icon="none"
      acceptLabel="Apply"
      rejectLabel="Cancel"
    >
      <ng-template aerisConfirmDialogIcon>
        <span class="custom-icon">!</span>
      </ng-template>
      <ng-template aerisConfirmDialogMessage let-data="data">
        <strong class="custom-message">Template message {{ data?.scope }}</strong>
      </ng-template>
      <ng-template aerisConfirmDialogFooter let-accept="accept" let-reject="reject">
        <button type="button" id="template-reject" (click)="reject($event)">No</button>
        <button type="button" id="template-accept" (click)="accept($event)">Yes</button>
      </ng-template>
    </aeris-confirm-dialog>
  `,
})
class TemplatedConfirmDialogHost {
  readonly templateData = { scope: 'release' };
}

@Component({
  imports: [AerisConfirmDialogModule],
  template: `
    <aeris-confirm-dialog
      key="quiet"
      [backdrop]="false"
      header="Quiet confirm"
      message="The page remains locked even without a mask."
      [visible]="true"
    />
  `,
})
class BackdroplessConfirmDialogHost {}

describe('AerisConfirmDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.paddingInlineEnd = '';
  });

  it('opens confirmations from the service with alert dialog semantics and safe focus', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1017);
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
    document.body.style.paddingInlineEnd = '4px';

    const fixture = TestBed.createComponent(ServiceConfirmDialogHost);
    await fixture.whenStable();

    const launcher = fixture.nativeElement.querySelector('#launcher') as HTMLButtonElement;
    launcher.focus();
    launcher.click();
    fixture.detectChanges();
    await settle();

    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    const title = document.querySelector('.aeris-dialog__title') as HTMLElement;
    const reject = document.querySelector('.aeris-confirm-dialog__reject') as HTMLButtonElement;
    const accept = document.querySelector('.aeris-confirm-dialog__accept') as HTMLButtonElement;

    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toContain('aeris-confirm-dialog');
    expect(title.textContent).toContain('Delete project?');
    expect(document.querySelector('.aeris-confirm-dialog__message')?.textContent).toContain(
      'This removes the project',
    );
    expect(accept.textContent).toContain('Delete');
    expect(accept.getAttribute('data-severity')).toBe('danger');
    expect(accept.classList.contains('aeris-button')).toBe(true);
    expect(accept.classList.contains('aeris-button--severity-danger')).toBe(true);
    expect(reject.textContent).toContain('Keep project');
    expect(reject.classList.contains('aeris-button--secondary')).toBe(true);
    expect(document.activeElement).toBe(reject);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingInlineEnd).toBe('21px');

    accept.click();
    fixture.detectChanges();
    await settle();

    expect(fixture.componentInstance.callbackMessage()).toBe('accepted aeris');
    expect(fixture.componentInstance.accepted()?.data?.id).toBe('aeris');
    expect(fixture.componentInstance.closed()?.result).toBe('accept');
    expect(fixture.componentInstance.closed()?.reason).toBe('accept');
    expect(document.activeElement).toBe(launcher);
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingInlineEnd).toBe('4px');
    await settle();
    expect(document.querySelector('aeris-confirm-dialog')).toBeNull();
  });

  it('supports declarative state, reject events, public methods, and Escape dismissal', async () => {
    const fixture = TestBed.createComponent(DeclarativeConfirmDialogHost);
    await fixture.whenStable();
    await settle();

    const accept = fixture.nativeElement.querySelector(
      '.aeris-confirm-dialog__accept',
    ) as HTMLButtonElement;

    expect(document.activeElement).toBe(accept);
    expect(
      (fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement).hasAttribute(
        'data-backdrop-blur',
      ),
    ).toBe(false);
    expect(
      (fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement).style.getPropertyValue(
        '--aeris-dialog-backdrop-blur',
      ),
    ).toBe('1rem');

    fixture.componentInstance.confirm().reject();
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

  it('renders custom icon, message, and footer templates', async () => {
    const fixture = TestBed.createComponent(TemplatedConfirmDialogHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.custom-icon')?.textContent).toContain('!');
    expect(fixture.nativeElement.querySelector('.custom-message')?.textContent).toContain(
      'Template message',
    );
    expect(fixture.nativeElement.querySelector('#template-reject')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#template-accept')).toBeTruthy();
  });

  it('keeps modal scrolling locked when the backdrop is disabled', async () => {
    const fixture = TestBed.createComponent(BackdroplessConfirmDialogHost);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.aeris-dialog__overlay') as HTMLElement;

    expect(overlay.hasAttribute('data-backdrop')).toBe(false);
    expect(overlay.getAttribute('data-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
  });
});
