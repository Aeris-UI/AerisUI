import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisAccordion,
  AerisAccordionModule,
  type AerisAccordionChangeEvent,
  type AerisAccordionValue,
} from '../../../accordion/aeris-accordion';

@Component({
  imports: [AerisAccordionModule],
  template: `
    <aeris-accordion ariaLabel="Product details">
      <aeris-accordion-panel value="overview" header="Overview">
        Overview content
      </aeris-accordion-panel>
      <aeris-accordion-panel value="activity" header="Activity">
        Activity content
      </aeris-accordion-panel>
      <aeris-accordion-panel value="disabled" header="Disabled" disabled>
        Disabled content
      </aeris-accordion-panel>
    </aeris-accordion>
  `,
})
class BasicAccordionHost {}

@Component({
  imports: [AerisAccordionModule],
  template: `
    <aeris-accordion
      multiple
      variant="separated"
      size="lg"
      iconPosition="start"
      [(value)]="value"
      (changed)="lastChange.set($event)"
      (panelExpanded)="expandedCount.update((count) => count + 1)"
      (panelCollapsed)="collapsedCount.update((count) => count + 1)"
    >
      <ng-template aerisAccordionToggleIcon let-expanded>
        <span class="custom-toggle-icon">{{ expanded ? 'minus' : 'plus' }}</span>
      </ng-template>
      <aeris-accordion-panel value="profile" header="Profile">
        <ng-template aerisAccordionHeader let-expanded let-value="value">
          {{ value }} {{ expanded ? 'open' : 'closed' }}
        </ng-template>
        Profile content
      </aeris-accordion-panel>
      <aeris-accordion-panel value="billing" header="Billing">
        Billing content
      </aeris-accordion-panel>
    </aeris-accordion>
  `,
})
class ControlledAccordionHost {
  readonly value = signal<AerisAccordionValue>(['profile']);
  readonly lastChange = signal<AerisAccordionChangeEvent | null>(null);
  readonly expandedCount = signal(0);
  readonly collapsedCount = signal(0);
}

@Component({
  imports: [AerisAccordionModule],
  template: `
    <aeris-accordion #accordion [collapsible]="false" [(value)]="value">
      <aeris-accordion-panel value="alpha" header="Alpha">Alpha content</aeris-accordion-panel>
      <aeris-accordion-panel value="beta" header="Beta">Beta content</aeris-accordion-panel>
    </aeris-accordion>
  `,
})
class MethodsAccordionHost {
  readonly accordion = viewChild.required<AerisAccordion>('accordion');
  readonly value = signal<AerisAccordionValue>('alpha');
}

@Component({
  imports: [AerisAccordionModule],
  template: `
    <aeris-accordion ariaLabel="Outer">
      <aeris-accordion-panel value="outer" header="Outer">
        <aeris-accordion ariaLabel="Inner">
          <aeris-accordion-panel value="inner" header="Inner">Inner content</aeris-accordion-panel>
        </aeris-accordion>
      </aeris-accordion-panel>
      <aeris-accordion-panel value="second" header="Second">Second content</aeris-accordion-panel>
    </aeris-accordion>
  `,
})
class NestedAccordionHost {}

describe('AerisAccordion', () => {
  it('renders accessible button and region relationships', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();

    const accordion = fixture.nativeElement.querySelector('aeris-accordion') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-accordion__trigger',
    ) as NodeListOf<HTMLButtonElement>;

    expect(accordion.getAttribute('aria-label')).toBe('Product details');
    expect(buttons.length).toBe(3);
    expect(buttons.item(0).getAttribute('aria-expanded')).toBe('false');
    expect(buttons.item(0).getAttribute('aria-controls')).toBeTruthy();
    expect(buttons.item(2).disabled).toBe(true);

    buttons.item(0).click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="region"]') as HTMLElement;
    expect(buttons.item(0).getAttribute('aria-expanded')).toBe('true');
    expect(panel.id).toBe(buttons.item(0).getAttribute('aria-controls'));
    expect(panel.getAttribute('aria-labelledby')).toBe(buttons.item(0).id);
    expect(panel.tabIndex).toBe(0);
    expect(panel.textContent).toContain('Overview content');
  });

  it('supports controlled multiple state, templates, events, and host variants', async () => {
    const fixture = TestBed.createComponent(ControlledAccordionHost);
    await fixture.whenStable();

    const accordion = fixture.nativeElement.querySelector('aeris-accordion') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-accordion__trigger',
    ) as NodeListOf<HTMLButtonElement>;

    expect(accordion.getAttribute('data-variant')).toBe('separated');
    expect(accordion.getAttribute('data-size')).toBe('lg');
    expect(accordion.getAttribute('data-icon-position')).toBe('start');
    expect(buttons.item(0).textContent).toContain('profile open');
    expect(buttons.item(0).querySelector('.custom-toggle-icon')?.textContent).toContain('minus');
    expect(buttons.item(1).querySelector('.custom-toggle-icon')?.textContent).toContain('plus');
    expect(buttons.item(0).querySelector('.aeris-accordion__default-icon')).toBeNull();

    buttons.item(1).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['profile', 'billing']);
    expect(fixture.componentInstance.lastChange()?.changedValue).toBe('billing');
    expect(fixture.componentInstance.lastChange()?.expanded).toBe(true);
    expect(fixture.componentInstance.expandedCount()).toBe(1);
    expect(buttons.item(1).querySelector('.custom-toggle-icon')?.textContent).toContain('minus');

    buttons.item(0).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['billing']);
    expect(fixture.componentInstance.collapsedCount()).toBe(1);
  });

  it('supports keyboard focus movement across enabled headers', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-accordion__trigger',
    ) as NodeListOf<HTMLButtonElement>;

    buttons.item(0).focus();
    buttons.item(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons.item(1));

    buttons.item(1).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons.item(0));

    buttons.item(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons.item(1));

    buttons.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons.item(0));
  });

  it('supports public methods and non-collapsible state', async () => {
    const fixture = TestBed.createComponent(MethodsAccordionHost);
    await fixture.whenStable();

    const accordion = fixture.componentInstance.accordion();
    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-accordion__trigger',
    ) as NodeListOf<HTMLButtonElement>;

    accordion.collapse('alpha');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('alpha');

    accordion.expand('beta');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('beta');

    accordion.focusPanel('alpha');
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons.item(0));
  });

  it('keeps nested accordion panels scoped to their nearest accordion owner', async () => {
    const fixture = TestBed.createComponent(NestedAccordionHost);
    await fixture.whenStable();

    const outer = fixture.nativeElement.querySelector('[aria-label="Outer"]') as HTMLElement;
    const outerButtons = Array.from(
      outer.querySelectorAll(':scope > .aeris-accordion__item > .aeris-accordion__heading > button'),
    ) as HTMLButtonElement[];

    expect(outerButtons.length).toBe(2);
    expect(outerButtons[0]?.textContent).toContain('Outer');
    expect(outerButtons[1]?.textContent).toContain('Second');
    expect(outerButtons[0]?.textContent).not.toContain('Inner');
  });
});
