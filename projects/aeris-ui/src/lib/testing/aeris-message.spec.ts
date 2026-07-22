import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisMessage,
  AerisMessageModule,
  type AerisMessageCloseEvent,
} from '../../../message/aeris-message';

@Component({
  imports: [AerisMessageModule],
  template: `
    <aeris-message
      #message
      severity="warning"
      variant="outlined"
      size="lg"
      text="Review your subscription."
      closable
      closeAriaLabel="Dismiss message"
      (closed)="closedEvents.push($event)"
      (visibilityChanged)="visibleChanges.push($event)"
    />
  `,
})
class MessageHost {
  readonly message = viewChild.required<AerisMessage>('message');
  readonly closedEvents: AerisMessageCloseEvent[] = [];
  readonly visibleChanges: boolean[] = [];
}

@Component({
  imports: [AerisMessage],
  template: `
    <aeris-message
      severity="success"
      ariaLabel="Saved notification"
      role="note"
      ariaLive="polite"
    >
      <strong>Saved</strong>
    </aeris-message>
  `,
})
class ProjectedMessageHost {}

@Component({
  imports: [AerisMessageModule],
  template: `
    <aeris-message severity="error">
      <ng-template aerisMessageIcon let-severity="severity">
        <span class="custom-icon">{{ severity }}</span>
      </ng-template>
      <ng-template aerisMessageContent let-close="close">
        <span id="custom-content">Custom content</span>
        <button type="button" id="custom-close" (click)="close()">Close custom</button>
      </ng-template>
    </aeris-message>
  `,
})
class TemplateMessageHost {}

@Component({
  imports: [AerisMessage],
  template: `
    <aeris-message
      #message
      text="This message expires."
      [life]="500"
      (closed)="closed.set($event.reason)"
    />
  `,
})
class TimedMessageHost {
  readonly message = viewChild.required<AerisMessage>('message');
  readonly closed = signal('');
}

describe('AerisMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders text with severity, variant, size, and accessible live-region semantics', () => {
    const fixture = TestBed.createComponent(MessageHost);
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('aeris-message') as HTMLElement;
    const close = fixture.nativeElement.querySelector('.aeris-message__close') as HTMLButtonElement;

    expect(message.textContent).toContain('Review your subscription.');
    expect(message.getAttribute('role')).toBe('alert');
    expect(message.getAttribute('aria-live')).toBe('assertive');
    expect(message.getAttribute('aria-atomic')).toBe('true');
    expect(message.dataset['severity']).toBe('warning');
    expect(message.dataset['variant']).toBe('outlined');
    expect(message.dataset['size']).toBe('lg');
    expect(close.getAttribute('aria-label')).toBe('Dismiss message');
  });

  it('closes from the native close button and emits close state', () => {
    const fixture = TestBed.createComponent(MessageHost);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector('.aeris-message__close') as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('aeris-message') as HTMLElement;
    expect(message.hasAttribute('data-visible')).toBe(false);
    expect(fixture.componentInstance.closedEvents.at(-1)?.reason).toBe('close-button');
    expect(fixture.componentInstance.visibleChanges).toEqual([false]);

    fixture.componentInstance.message().show();
    fixture.detectChanges();
    expect(message.hasAttribute('data-visible')).toBe(true);
    expect(fixture.componentInstance.visibleChanges).toEqual([false, true]);
  });

  it('supports projected content and explicit accessibility attributes', () => {
    const fixture = TestBed.createComponent(ProjectedMessageHost);
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('aeris-message') as HTMLElement;
    const strong = fixture.nativeElement.querySelector('strong') as HTMLElement;

    expect(message.getAttribute('role')).toBe('note');
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect(message.getAttribute('aria-label')).toBe('Saved notification');
    expect(strong.textContent).toBe('Saved');
  });

  it('supports icon and content templates with close context', () => {
    const fixture = TestBed.createComponent(TemplateMessageHost);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.custom-icon') as HTMLElement;
    const content = fixture.nativeElement.querySelector('#custom-content') as HTMLElement;
    const close = fixture.nativeElement.querySelector('#custom-close') as HTMLButtonElement;

    expect(icon.textContent).toContain('error');
    expect(content.textContent).toBe('Custom content');

    close.click();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('aeris-message') as HTMLElement;
    expect(message.hasAttribute('data-visible')).toBe(false);
  });

  it('can auto-close after the configured life', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TimedMessageHost);
    fixture.detectChanges();

    vi.advanceTimersByTime(499);
    fixture.detectChanges();
    expect(fixture.componentInstance.message().visible()).toBe(true);

    vi.advanceTimersByTime(1);
    fixture.detectChanges();

    expect(fixture.componentInstance.message().visible()).toBe(false);
    expect(fixture.componentInstance.closed()).toBe('timeout');
  });
});
