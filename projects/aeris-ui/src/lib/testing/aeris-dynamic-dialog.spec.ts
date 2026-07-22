import { ApplicationRef, Component, inject, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AERIS_DYNAMIC_DIALOG_CONFIG,
  AERIS_DYNAMIC_DIALOG_DATA,
  AerisDynamicDialogRef,
  AerisDynamicDialogService,
  type AerisDynamicDialogCloseEvent,
  type AerisDynamicDialogResolvedConfig,
  type AerisDynamicDialogShowEvent,
} from '../../../dynamic-dialog/aeris-dynamic-dialog';

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

interface AssignmentData {
  readonly project: string;
}

interface AssignmentResult {
  readonly accepted: boolean;
  readonly assignee: string;
}

@Component({
  selector: 'aeris-dynamic-assignment-content',
  template: `
    <h2 id="assignment-title">Assign {{ assignee() }}</h2>
    <p id="assignment-description">{{ data.project }} uses {{ config.size }} dialog sizing.</p>
    <button id="assignment-submit" type="button" (click)="submit()">Assign</button>
  `,
})
class AssignmentDialogContent {
  readonly assignee = input('');
  private readonly ref = inject<AerisDynamicDialogRef<AssignmentResult>>(AerisDynamicDialogRef);
  protected readonly data = inject(AERIS_DYNAMIC_DIALOG_DATA) as AssignmentData;
  protected readonly config = inject(
    AERIS_DYNAMIC_DIALOG_CONFIG,
  ) as AerisDynamicDialogResolvedConfig<AssignmentData>;

  protected submit(): void {
    this.ref.close({ accepted: true, assignee: this.assignee() });
  }
}

@Component({
  selector: 'aeris-dynamic-simple-content',
  template: `<button id="simple-close" type="button" (click)="close()">Close</button>`,
})
class SimpleDialogContent {
  private readonly ref = inject<AerisDynamicDialogRef<string>>(AerisDynamicDialogRef);

  protected close(): void {
    this.ref.close('done');
  }
}

describe('AerisDynamicDialogService', () => {
  let service: AerisDynamicDialogService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AerisDynamicDialogService);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    service.destroyAll();
    document.body.style.overflow = '';
  });

  it('creates a dialog with dynamic component content, data, inputs, and close results', async () => {
    let closeEvent: AerisDynamicDialogCloseEvent<AssignmentResult> | undefined;
    let showEvent: AerisDynamicDialogShowEvent | undefined;

    const ref = service.open<AssignmentDialogContent, AssignmentData, AssignmentResult>(
      AssignmentDialogContent,
      {
        header: 'Assign owner',
        data: { project: 'Atlas' },
        inputValues: { assignee: 'Mira' },
        ariaDescribedBy: 'assignment-description',
        initialFocus: '#assignment-submit',
        size: 'lg',
        width: '34rem',
      },
    );
    ref.shown.subscribe((event) => {
      showEvent = event;
    });
    ref.closed.subscribe((event) => {
      closeEvent = event;
    });
    await settle();

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    const title = document.body.querySelector('.aeris-dialog__title') as HTMLElement;
    const description = document.body.querySelector('#assignment-description') as HTMLElement;
    const submit = document.body.querySelector('#assignment-submit') as HTMLButtonElement;

    expect(showEvent).toEqual({ originalEvent: null });
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe('assignment-description');
    expect(dialog.getAttribute('data-size')).toBe('lg');
    expect(dialog.style.getPropertyValue('--aeris-dialog-width')).toBe('34rem');
    expect(title.textContent).toContain('Assign owner');
    expect(description.textContent).toContain('Atlas uses lg dialog sizing');
    expect(document.body.textContent).toContain('Assign Mira');
    expect(document.activeElement).toBe(submit);

    submit.click();
    await settle();
    await settle();

    expect(closeEvent?.reason).toBe('api');
    expect(closeEvent?.result).toEqual({ accepted: true, assignee: 'Mira' });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it('passes dialog options through to the Aeris dialog shell', async () => {
    const ref = service.open(SimpleDialogContent, {
      header: 'Utility dialog',
      modal: false,
      backdrop: true,
      backdropBlur: true,
      backdropBlurAmount: '1.375rem',
      position: 'top-right',
      maximizable: true,
      maximized: true,
      draggable: true,
      resizable: true,
      minWidth: '20rem',
      maxWidth: 'calc(100vw - 3rem)',
      height: '24rem',
      maxHeight: '80vh',
      mobileWidth: 'calc(100vw - 1rem)',
    });
    await settle();

    const overlay = document.body.querySelector('.aeris-dialog__overlay') as HTMLElement;
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;

    expect(overlay.getAttribute('data-position')).toBe('top-right');
    expect(overlay.hasAttribute('data-modal')).toBe(false);
    expect(overlay.getAttribute('data-backdrop')).toBe('true');
    expect(overlay.getAttribute('data-backdrop-blur')).toBe('true');
    expect(overlay.style.getPropertyValue('--aeris-dialog-backdrop-blur')).toBe('1.375rem');
    expect(overlay.getAttribute('data-maximized')).toBe('true');
    expect(dialog.getAttribute('data-draggable')).toBe('true');
    expect(dialog.getAttribute('data-resizable')).toBe('true');
    expect(dialog.style.getPropertyValue('--aeris-dialog-min-width')).toBe('20rem');
    expect(dialog.style.getPropertyValue('--aeris-dialog-max-width')).toBe('calc(100vw - 3rem)');
    expect(dialog.style.getPropertyValue('--aeris-dialog-height')).toBe('24rem');
    expect(dialog.style.getPropertyValue('--aeris-dialog-max-height')).toBe('80vh');
    expect(dialog.style.getPropertyValue('--aeris-dialog-mobile-width')).toBe('calc(100vw - 1rem)');

    ref.destroy();
    await settle();
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes from Escape, mask, and closeAll with cleanup', async () => {
    const escapeEvents: AerisDynamicDialogCloseEvent<string>[] = [];
    const escapeRef = service.open<SimpleDialogContent, unknown, string>(SimpleDialogContent);
    escapeRef.closed.subscribe((event) => escapeEvents.push(event));
    await settle();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    appRef.tick();
    await settle();
    await settle();

    expect(escapeEvents.at(-1)?.reason).toBe('escape');
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();

    const maskEvents: AerisDynamicDialogCloseEvent<string>[] = [];
    const maskRef = service.open<SimpleDialogContent, unknown, string>(SimpleDialogContent, {
      dismissibleMask: true,
    });
    maskRef.closed.subscribe((event) => maskEvents.push(event));
    await settle();

    const overlay = document.body.querySelector('.aeris-dialog__overlay') as HTMLElement;
    overlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    appRef.tick();
    await settle();
    await settle();

    expect(maskEvents.at(-1)?.reason).toBe('mask');
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();

    service.open(SimpleDialogContent);
    service.open(SimpleDialogContent);
    await settle();
    expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(2);

    service.closeAll();
    appRef.tick();
    await settle();
    await settle();
    expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(0);
  });

  it('keeps page scrolling locked until the final overlapping dialog closes', async () => {
    const firstRef = service.open(SimpleDialogContent);
    const secondRef = service.open(SimpleDialogContent);
    await settle();

    expect(document.body.style.overflow).toBe('hidden');

    firstRef.close();
    appRef.tick();
    await settle();
    await settle();

    expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    secondRef.close();
    appRef.tick();
    await settle();
    await settle();

    expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });

  it('dismisses only the topmost overlapping dialog with Escape', async () => {
    service.open(SimpleDialogContent);
    service.open(SimpleDialogContent);
    await settle();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    appRef.tick();
    await settle();
    await settle();

    expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
