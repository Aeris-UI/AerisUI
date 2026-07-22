import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisInplace,
  AerisInplaceContentTemplate,
  AerisInplaceDisplayTemplate,
  AerisInplaceModule,
  type AerisInplaceStateEvent,
} from '../../../inplace/aeris-inplace';

@Component({
  imports: [AerisInplaceModule],
  template: `
    <aeris-inplace
      #inplace
      label="Edit profile"
      closable
      [(active)]="active"
      (activated)="lastActivated.set($event)"
      (deactivated)="lastDeactivated.set($event)"
    >
      <input class="profile-input" aria-label="Profile name" value="Aeris User" />
    </aeris-inplace>
  `,
})
class InplaceHost {
  readonly active = signal(false);
  readonly lastActivated = signal<AerisInplaceStateEvent | null>(null);
  readonly lastDeactivated = signal<AerisInplaceStateEvent | null>(null);
  readonly inplace = viewChild.required<AerisInplace>('inplace');
}

@Component({
  imports: [AerisInplaceModule],
  template: `
    <aeris-inplace ariaLabel="Open account editor">
      <ng-template aerisInplaceDisplay>
        <strong class="custom-display">Account details</strong>
      </ng-template>
      <ng-template aerisInplaceContent let-close="close">
        <label for="account-name">Account name</label>
        <input id="account-name" />
        <button class="template-close" type="button" (click)="close()">Save and close</button>
      </ng-template>
    </aeris-inplace>
  `,
})
class TemplateInplaceHost {}

@Component({
  imports: [AerisInplaceModule],
  template: `<aeris-inplace label="Unavailable editor" disabled />`,
})
class DisabledInplaceHost {}

describe('AerisInplace', () => {
  it('renders an accessible native display button and activates lazy content', () => {
    const fixture = TestBed.createComponent(InplaceHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-inplace') as HTMLElement;
    const display = host.querySelector('.aeris-inplace__display') as HTMLButtonElement;

    expect(display.type).toBe('button');
    expect(display.textContent?.trim()).toBe('Edit profile');
    expect(display.getAttribute('aria-expanded')).toBe('false');
    expect(display.getAttribute('aria-controls')).toMatch(/^aeris-inplace-content-/);
    expect(host.querySelector('.profile-input')).toBeNull();

    display.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(true);
    expect(host.querySelector('.profile-input')).not.toBeNull();
    expect(fixture.componentInstance.lastActivated()?.reason).toBe('display');
    expect(fixture.componentInstance.lastActivated()?.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('moves focus into content and restores it after the owned close action', async () => {
    const fixture = TestBed.createComponent(InplaceHost);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.aeris-inplace__display') as HTMLButtonElement).click();
    fixture.detectChanges();
    await Promise.resolve();

    const input = fixture.nativeElement.querySelector('.profile-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);

    (fixture.nativeElement.querySelector('.aeris-inplace__close') as HTMLButtonElement).click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.active()).toBe(false);
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('.aeris-inplace__display'),
    );
    expect(fixture.componentInstance.lastDeactivated()?.reason).toBe('close');
  });

  it('closes with Escape and exposes the configured live region', async () => {
    const fixture = TestBed.createComponent(InplaceHost);
    fixture.componentInstance.active.set(true);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.aeris-inplace__content') as HTMLElement;

    expect(content.getAttribute('aria-live')).toBe('polite');
    content.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.active()).toBe(false);
    expect(fixture.componentInstance.lastDeactivated()?.reason).toBe('escape');
  });

  it('renders display and content templates and supports the close callback', () => {
    const fixture = TestBed.createComponent(TemplateInplaceHost);
    fixture.detectChanges();
    const display = fixture.nativeElement.querySelector(
      '.aeris-inplace__display',
    ) as HTMLButtonElement;

    expect(display.getAttribute('aria-label')).toBe('Open account editor');
    expect(display.querySelector('.custom-display')?.textContent).toBe('Account details');
    display.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#account-name')).not.toBeNull();

    (fixture.nativeElement.querySelector('.template-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-display')).not.toBeNull();
  });

  it('supports public methods and prevents activation while disabled', () => {
    const fixture = TestBed.createComponent(InplaceHost);
    fixture.detectChanges();
    fixture.componentInstance.inplace().activate();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(true);

    fixture.componentInstance.inplace().toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(false);

    const disabledFixture = TestBed.createComponent(DisabledInplaceHost);
    disabledFixture.detectChanges();
    const disabled = disabledFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
    disabled.click();
    disabledFixture.detectChanges();
    expect(disabledFixture.nativeElement.querySelector('.aeris-inplace__content')).toBeNull();
  });

  it('is responsive and exports every template helper through one import', () => {
    const fixture = TestBed.createComponent(InplaceHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-inplace') as HTMLElement;

    expect(getComputedStyle(host).maxInlineSize).toBe('100%');
    expect(getComputedStyle(host).minInlineSize).toBe('0px');
    expect(AerisInplaceModule).toEqual([
      AerisInplace,
      AerisInplaceDisplayTemplate,
      AerisInplaceContentTemplate,
    ]);
  });
});
