import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisTabsModule, type AerisTabChangeEvent } from '../../../tabs/aeris-tabs';

@Component({
  imports: [AerisTabsModule],
  template: `
    <aeris-tabs ariaLabel="Account settings">
      <aeris-tab-panel value="profile" label="Profile">Profile content</aeris-tab-panel>
      <aeris-tab-panel value="security" label="Security">Security content</aeris-tab-panel>
      <aeris-tab-panel value="disabled" label="Disabled" disabled>Disabled content</aeris-tab-panel>
    </aeris-tabs>
  `,
})
class TabsTestHost {}

@Component({
  imports: [AerisTabsModule],
  template: `
    <aeris-tabs
      ariaLabel="Manual tabs"
      activationMode="manual"
      orientation="vertical"
      variant="pill"
      [(value)]="value"
      (changed)="lastChange.set($event)"
    >
      <aeris-tab-panel value="overview" label="Overview">
        <ng-template aerisTabHeader let-selected>
          Overview {{ selected ? 'active' : '' }}
        </ng-template>
        Overview content
      </aeris-tab-panel>
      <aeris-tab-panel value="activity" label="Activity">Activity content</aeris-tab-panel>
    </aeris-tabs>
  `,
})
class ManualTabsTestHost {
  readonly value = signal('overview');
  readonly lastChange = signal<AerisTabChangeEvent | null>(null);
}

@Component({
  imports: [AerisTabsModule],
  template: `
    <aeris-tabs ariaLabel="Documentation tabs">
      <aeris-tab-panel value="features" label="Features">
        <aeris-tabs ariaLabel="Inbox tabs">
          <aeris-tab-panel value="inbox" label="Inbox">
            <ng-template aerisTabHeader> Inbox <span>12</span> </ng-template>
            Inbox content
          </aeris-tab-panel>
          <aeris-tab-panel value="archive" label="Archive">Archive content</aeris-tab-panel>
        </aeris-tabs>
      </aeris-tab-panel>
      <aeris-tab-panel value="api" label="API">API content</aeris-tab-panel>
    </aeris-tabs>
  `,
})
class NestedTabsTestHost {}

@Component({
  imports: [AerisTabsModule],
  template: `
    <aeris-tabs ariaLabel="Responsive documentation tabs">
      <aeris-tab-panel value="features" label="Features">Features</aeris-tab-panel>
      <aeris-tab-panel value="api" label="API">API</aeris-tab-panel>
      <aeris-tab-panel value="interfaces" label="Interfaces">Interfaces</aeris-tab-panel>
      <aeris-tab-panel value="tokens" label="Tokens">Tokens</aeris-tab-panel>
      <aeris-tab-panel value="accessibility" label="Accessibility">Accessibility</aeris-tab-panel>
    </aeris-tabs>
  `,
})
class ResponsiveTabsTestHost {}

describe('AerisTabs', () => {
  it('renders an accessible tab relationship and selects tabs', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    await fixture.whenStable();

    const tabs = fixture.nativeElement.querySelectorAll(
      '[role="tab"]',
    ) as NodeListOf<HTMLButtonElement>;
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const panel = (): HTMLElement =>
      fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;

    expect(tablist.getAttribute('aria-label')).toBe('Account settings');
    expect(tablist.getAttribute('aria-orientation')).toBe('horizontal');
    expect(tabs.item(0).getAttribute('aria-selected')).toBe('true');
    expect(panel().textContent).toContain('Profile content');
    expect(tabs.item(0).getAttribute('aria-controls')).toBe(panel().id);
    expect(panel().getAttribute('aria-labelledby')).toBe(tabs.item(0).id);
    expect(panel().tabIndex).toBe(0);

    tabs.item(1).click();
    fixture.detectChanges();

    expect(tabs.item(1).getAttribute('aria-selected')).toBe('true');
    expect(panel().textContent).toContain('Security content');
    expect(tabs.item(2).disabled).toBe(true);
  });

  it('supports arrow-key selection', async () => {
    const fixture = TestBed.createComponent(TabsTestHost);
    await fixture.whenStable();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const tabs = fixture.nativeElement.querySelectorAll(
      '[role="tab"]',
    ) as NodeListOf<HTMLButtonElement>;

    tabs.item(0).focus();
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(tabs.item(1).getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs.item(1));

    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs.item(0));

    tabs.item(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs.item(1));

    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs.item(0));
  });

  it('supports manual activation, vertical keys, custom headers, and events', async () => {
    const fixture = TestBed.createComponent(ManualTabsTestHost);
    await fixture.whenStable();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const tabs = fixture.nativeElement.querySelectorAll(
      '[role="tab"]',
    ) as NodeListOf<HTMLButtonElement>;
    expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
    expect(tabs.item(0).textContent).toContain('Overview active');

    tabs.item(0).focus();
    tabs.item(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs.item(1));
    expect(fixture.componentInstance.value()).toBe('overview');

    tabs.item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('activity');
    expect(fixture.componentInstance.lastChange()?.previousValue).toBe('overview');
  });

  it('keeps nested tab panels scoped to their nearest tabs owner', async () => {
    const fixture = TestBed.createComponent(NestedTabsTestHost);
    await fixture.whenStable();

    const outerTablist = fixture.nativeElement.querySelector(
      '[aria-label="Documentation tabs"]',
    ) as HTMLElement;
    const outerTabs = Array.from(outerTablist.children).filter(
      (child): child is HTMLButtonElement => child.getAttribute('role') === 'tab',
    );

    expect(outerTabs.length).toBe(2);
    expect(outerTabs[0]?.textContent).toContain('Features');
    expect(outerTabs[1]?.textContent).toContain('API');
    expect(outerTabs[0]?.textContent).not.toContain('Inbox');

    const innerTablist = fixture.nativeElement.querySelector(
      '[aria-label="Inbox tabs"]',
    ) as HTMLElement;
    const innerTabs = Array.from(innerTablist.children).filter(
      (child): child is HTMLButtonElement => child.getAttribute('role') === 'tab',
    );

    expect(innerTabs.length).toBe(2);
    expect(innerTabs[0]?.textContent).toContain('Inbox');
  });

  it('shows scroll controls only while horizontal tabs overflow', async () => {
    const fixture = TestBed.createComponent(ResponsiveTabsTestHost);
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('.aeris-tabs__header') as HTMLElement;
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    let headerWidth = 320;
    let listWidth = 320;
    let listScrollWidth = 640;
    let scrollLeft = 0;

    Object.defineProperties(header, {
      clientWidth: { configurable: true, get: () => headerWidth },
    });
    Object.defineProperties(tablist, {
      clientWidth: { configurable: true, get: () => listWidth },
      scrollWidth: { configurable: true, get: () => listScrollWidth },
      scrollLeft: {
        configurable: true,
        get: () => scrollLeft,
        set: (value: number) => {
          scrollLeft = value;
        },
      },
    });

    tablist.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const previous = fixture.nativeElement.querySelector(
      '.aeris-tabs__scroll--previous',
    ) as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector(
      '.aeris-tabs__scroll--next',
    ) as HTMLButtonElement;
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    scrollLeft = listScrollWidth - listWidth;
    tablist.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);

    headerWidth = listScrollWidth;
    listWidth = listScrollWidth;
    tablist.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.aeris-tabs__scroll')).toBeNull();
  });
});
