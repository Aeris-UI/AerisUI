import { Component, inject, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisToast,
  AerisToastModule,
  AerisToastService,
  type AerisToastCloseEvent,
} from '../../../toast/aeris-toast';

@Component({
  imports: [AerisToastModule],
  template: `
    <aeris-toast
      #toast
      group="workspace"
      position="bottom-left"
      mode="expanded"
      [limit]="2"
      newestOnTop
      (closed)="closedEvents.push($event)"
    />
  `,
})
class ToastHost {
  readonly service = inject(AerisToastService);
  readonly toast = viewChild.required<AerisToast>('toast');
  readonly closedEvents: AerisToastCloseEvent[] = [];
}

@Component({
  imports: [AerisToastModule],
  template: `
    <aeris-toast group="custom" closeAriaLabel="Dismiss alert">
      <ng-template aerisToastIcon let-message>
        <span class="custom-icon">{{ message.severity }}</span>
      </ng-template>
      <ng-template aerisToastContent let-message let-close="close">
        <strong>{{ message.summary }}</strong>
        <button type="button" id="custom-dismiss" (click)="close()">Dismiss custom</button>
      </ng-template>
    </aeris-toast>
  `,
})
class CustomToastHost {
  readonly service = inject(AerisToastService);
}

@Component({
  imports: [AerisToastModule],
  template: `<aeris-toast group="stack" />`,
})
class StackedToastHost {
  readonly service = inject(AerisToastService);
}

@Component({
  imports: [AerisToastModule],
  template: `<aeris-toast group="stack" [newestOnTop]="false" />`,
})
class OldestFirstStackedToastHost {
  readonly service = inject(AerisToastService);
}

describe('AerisToast', () => {
  let service: AerisToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AerisToastService);
  });

  afterEach(() => {
    service.clearAll();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders grouped toast messages with accessible live-region semantics', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();

    service.show({
      group: 'workspace',
      severity: 'success',
      summary: 'Saved',
      detail: 'Your settings were updated.',
      life: 10000,
    });
    service.show({
      group: 'workspace',
      severity: 'error',
      summary: 'Failed',
      detail: 'Try again.',
      sticky: true,
    });
    service.show({ group: 'other', summary: 'Hidden' });
    fixture.detectChanges();

    const region = fixture.nativeElement.querySelector('.aeris-toast__region') as HTMLElement;
    const messages = fixture.nativeElement.querySelectorAll('.aeris-toast__message');
    const closeButton = fixture.nativeElement.querySelector('.aeris-toast__close') as HTMLButtonElement;

    expect(region.getAttribute('aria-label')).toBe('Notifications');
    expect(region.dataset['position']).toBe('bottom-left');
    expect(region.dataset['mode']).toBe('expanded');
    expect(messages.length).toBe(2);
    expect(messages[0].getAttribute('data-severity')).toBe('error');
    expect(messages[0].getAttribute('role')).toBe('alert');
    expect(messages[0].getAttribute('aria-live')).toBe('assertive');
    expect(messages[1].getAttribute('data-severity')).toBe('success');
    expect(messages[1].getAttribute('role')).toBe('status');
    expect(messages[1].textContent).toContain('Saved');
    expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
  });

  it('closes from the close button and emits a close event', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();
    const message = service.show({ group: 'workspace', summary: 'Closable', sticky: true });
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.aeris-toast__close') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(service.messages().some((item) => item.id === message.id)).toBe(false);
    expect(fixture.componentInstance.closedEvents.at(-1)?.reason).toBe('close-button');
    expect(fixture.nativeElement.querySelector('.aeris-toast__message')).toBeNull();
  });

  it('auto-dismisses non-sticky messages and pauses while the region is hovered', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();
    const message = service.show({ group: 'workspace', summary: 'Timed', life: 1000 });
    fixture.detectChanges();
    const region = fixture.nativeElement.querySelector('.aeris-toast__region') as HTMLElement;

    vi.advanceTimersByTime(400);
    region.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(service.messages().some((item) => item.id === message.id)).toBe(true);

    region.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(600);
    fixture.detectChanges();

    expect(service.messages().some((item) => item.id === message.id)).toBe(false);
    expect(fixture.componentInstance.closedEvents.at(-1)?.reason).toBe('timeout');
  });

  it('supports custom content and icon templates with close context', () => {
    const fixture = TestBed.createComponent(CustomToastHost);
    fixture.detectChanges();
    service.show({
      group: 'custom',
      severity: 'warning',
      summary: 'Needs review',
      sticky: true,
    });
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.custom-icon') as HTMLElement;
    const dismiss = fixture.nativeElement.querySelector('#custom-dismiss') as HTMLButtonElement;

    expect(icon.textContent).toContain('warning');
    expect(fixture.nativeElement.textContent).toContain('Needs review');

    dismiss.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    dismiss.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-toast__message')).toBeNull();
  });

  it('renders a stacked preview with four visible messages by default and reveals queued messages', () => {
    const fixture = TestBed.createComponent(StackedToastHost);
    fixture.detectChanges();
    service.showAll([
      { group: 'stack', summary: 'One', sticky: true },
      { group: 'stack', summary: 'Two', sticky: true },
      { group: 'stack', summary: 'Three', sticky: true },
      { group: 'stack', summary: 'Four', sticky: true },
      { group: 'stack', summary: 'Five', sticky: true },
    ]);
    fixture.detectChanges();

    let messages = [
      ...fixture.nativeElement.querySelectorAll('.aeris-toast__message'),
    ] as HTMLElement[];
    const overflow = fixture.nativeElement.querySelector('.aeris-toast__overflow') as HTMLElement;

    expect(messages.length).toBe(4);
    expect(messages[0].getAttribute('data-primary')).toBe('true');
    expect(messages.map((message) => message.textContent?.trim())).toEqual([
      'Five',
      'Four',
      'Three',
      'Two',
    ]);
    expect(overflow.textContent).toContain('+1');

    const closeButton = messages[0].querySelector('.aeris-toast__close') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    messages = [...fixture.nativeElement.querySelectorAll('.aeris-toast__message')] as HTMLElement[];
    expect(messages.map((message) => message.textContent?.trim())).toEqual([
      'Four',
      'Three',
      'Two',
      'One',
    ]);
    expect(fixture.nativeElement.querySelector('.aeris-toast__overflow')).toBeNull();
  });

  it('can keep the oldest toast as the primary stacked message', () => {
    const fixture = TestBed.createComponent(OldestFirstStackedToastHost);
    fixture.detectChanges();
    service.showAll([
      { group: 'stack', summary: 'One', sticky: true },
      { group: 'stack', summary: 'Two', sticky: true },
      { group: 'stack', summary: 'Three', sticky: true },
    ]);
    fixture.detectChanges();

    const messages = [
      ...fixture.nativeElement.querySelectorAll('.aeris-toast__message'),
    ] as HTMLElement[];

    expect(messages[0].getAttribute('data-primary')).toBe('true');
    expect(messages.map((message) => message.textContent?.trim())).toEqual([
      'One',
      'Two',
      'Three',
    ]);
  });

  it('supports service addAll, clear by group, and clearAll', () => {
    service.showAll([
      { group: 'workspace', summary: 'One', sticky: true },
      { group: 'workspace', summary: 'Two', sticky: true },
      { group: 'custom', summary: 'Three', sticky: true },
    ]);

    expect(service.messages().length).toBe(3);

    service.clear('workspace');
    expect(service.messages().map((message) => message.summary)).toEqual(['Three']);

    service.clearAll();
    expect(service.messages()).toEqual([]);
  });
});
