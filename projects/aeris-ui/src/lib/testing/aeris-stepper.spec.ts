import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisStepper,
  AerisStepperModule,
  type AerisStepperChangeEvent,
} from '../../../stepper/aeris-stepper';

@Component({
  imports: [AerisStepperModule],
  template: `
    <aeris-stepper
      #stepper
      ariaLabel="Checkout"
      [(value)]="value"
      (changed)="lastChange.set($event)"
      (stepFocused)="focused.set($event)"
    >
      <aeris-step value="account" label="Account" description="Your profile" completed>
        <p id="account-content">Account content</p>
      </aeris-step>
      <aeris-step value="shipping" label="Shipping" optional>
        <p>Shipping content</p>
      </aeris-step>
      <aeris-step value="payment" label="Payment" invalid>
        <p>Payment content</p>
      </aeris-step>
      <aeris-step value="review" label="Review" disabled>
        <p>Review content</p>
      </aeris-step>
    </aeris-stepper>
  `,
})
class BasicStepperHost {
  readonly stepper = viewChild.required<AerisStepper>('stepper');
  readonly value = signal('shipping');
  readonly focused = signal('');
  readonly lastChange = signal<AerisStepperChangeEvent | null>(null);
}

@Component({
  imports: [AerisStepperModule],
  template: `
    <aeris-stepper
      #stepper
      ariaLabel="Setup"
      [(value)]="value"
      linear
      activationMode="manual"
      orientation="vertical"
      variant="contained"
      size="lg"
    >
      <ng-template aerisStepIndicator let-index="index" let-selected="selected">
        <span class="global-indicator" [attr.data-selected]="selected">{{ index + 1 }}</span>
      </ng-template>
      <aeris-step value="profile" label="Profile" completed>
        <p>Profile content</p>
      </aeris-step>
      <aeris-step value="team" label="Team">
        <ng-template aerisStepHeader let-label="label" let-optional="optional">
          <span class="custom-header">{{ label }} {{ optional ? 'optional' : '' }}</span>
        </ng-template>
        <p>Team content</p>
      </aeris-step>
      <aeris-step value="billing" label="Billing">
        <ng-template aerisStepIndicator let-invalid="invalid">
          <span class="custom-indicator">{{ invalid ? '!' : 'B' }}</span>
        </ng-template>
        <p>Billing content</p>
      </aeris-step>
    </aeris-stepper>
  `,
})
class LinearStepperHost {
  readonly stepper = viewChild.required<AerisStepper>('stepper');
  readonly value = signal('team');
}

@Component({
  imports: [AerisStepperModule],
  template: `
    <aeris-stepper
      ariaLabel="Release progress"
      [(value)]="value"
      stepsOnly
      (changed)="lastChange.set($event)"
    >
      <aeris-step value="plan" label="Plan" description="Hidden supporting text" completed></aeris-step>
      <aeris-step value="build" label="Build" description="Hidden supporting text"></aeris-step>
      <aeris-step value="ship" label="Ship" description="Hidden supporting text"></aeris-step>
    </aeris-stepper>
  `,
})
class StepsOnlyStepperHost {
  readonly value = signal('build');
  readonly lastChange = signal<AerisStepperChangeEvent | null>(null);
}

describe('AerisStepper', () => {
  it('renders accessible step tabs and the active panel', () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('aeris-stepper') as HTMLElement;
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;

    expect(stepper.dataset['orientation']).toBe('horizontal');
    expect(tablist.getAttribute('aria-label')).toBe('Checkout');
    expect(tablist.getAttribute('aria-orientation')).toBe('horizontal');
    expect(tabs.length).toBe(4);
    expect(tabs.item(1).getAttribute('aria-selected')).toBe('true');
    expect(tabs.item(1).getAttribute('aria-current')).toBe('step');
    expect(tabs.item(2).getAttribute('aria-invalid')).toBe('true');
    expect(tabs.item(3).disabled).toBe(true);
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs.item(1).id);
    expect(panel.textContent).toContain('Shipping content');
    expect(fixture.nativeElement.textContent).toContain('Optional');
  });

  it('selects reachable steps and emits change events', () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    fixture.detectChanges();

    const payment = fixture.nativeElement.querySelectorAll('[role="tab"]').item(2) as HTMLButtonElement;
    payment.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('payment');
    expect(fixture.componentInstance.lastChange()?.previousValue).toBe('shipping');
    expect(fixture.componentInstance.lastChange()?.value).toBe('payment');
    expect(fixture.componentInstance.lastChange()?.index).toBe(2);
  });

  it('supports keyboard navigation and focus events', () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    tabs.item(1).focus();
    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('payment');
    expect(document.activeElement).toBe(tabs.item(2));
    expect(fixture.componentInstance.focused()).toBe('payment');

    tabs.item(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('account');
    expect(document.activeElement).toBe(tabs.item(0));
  });

  it('supports linear mode, manual activation, variants, templates, and methods', () => {
    const fixture = TestBed.createComponent(LinearStepperHost);
    fixture.detectChanges();

    const stepper = fixture.componentInstance.stepper();
    const host = fixture.nativeElement.querySelector('aeris-stepper') as HTMLElement;
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;

    expect(host.dataset['orientation']).toBe('vertical');
    expect(host.dataset['variant']).toBe('contained');
    expect(host.dataset['size']).toBe('lg');
    expect(host.hasAttribute('data-linear')).toBe(true);
    expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain('Team');
    expect(fixture.nativeElement.querySelector('.custom-indicator')?.textContent).toContain('B');
    expect(fixture.nativeElement.querySelectorAll('.global-indicator').length).toBe(2);
    expect(tabs.item(2).disabled).toBe(false);

    fixture.componentInstance.value.set('profile');
    fixture.detectChanges();
    expect(tabs.item(2).disabled).toBe(true);

    fixture.componentInstance.value.set('team');
    fixture.detectChanges();
    expect(tabs.item(2).disabled).toBe(false);

    tabs.item(1).focus();
    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('team');
    expect(document.activeElement).toBe(tabs.item(2));

    tabs.item(1).focus();
    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs.item(2));
    tabs.item(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('billing');

    stepper.previous();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('team');

    stepper.next();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('billing');

    stepper.focusStep('profile');
    expect(document.activeElement).toBe(tabs.item(0));
  });

  it('supports steps-only mode without tab panels', () => {
    const fixture = TestBed.createComponent(StepsOnlyStepperHost);
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('aeris-stepper') as HTMLElement;
    const list = fixture.nativeElement.querySelector('.aeris-stepper__list') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('[role="listitem"]') as NodeListOf<HTMLElement>;
    const buttons = fixture.nativeElement.querySelectorAll('.aeris-stepper__trigger') as NodeListOf<HTMLButtonElement>;

    expect(stepper.hasAttribute('data-steps-only')).toBe(true);
    expect(list.getAttribute('role')).toBe('list');
    expect(list.getAttribute('aria-label')).toBe('Release progress');
    expect(list.hasAttribute('aria-orientation')).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="tab"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.aeris-stepper__description')).toBeNull();
    expect(items.length).toBe(3);
    expect(buttons.length).toBe(3);
    expect(buttons.item(1).getAttribute('aria-current')).toBe('step');
    expect(buttons.item(1).hasAttribute('aria-selected')).toBe(false);
    expect(buttons.item(1).hasAttribute('aria-controls')).toBe(false);

    buttons.item(2).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('ship');
    expect(fixture.componentInstance.lastChange()?.previousValue).toBe('build');
    expect(fixture.componentInstance.lastChange()?.value).toBe('ship');
  });
});
