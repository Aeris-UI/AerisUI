import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisSplitButton,
  type AerisSplitButtonItem,
} from '../../../split-button/aeris-split-button';

@Component({
  imports: [AerisSplitButton],
  template: `
    <aeris-split-button
      label="Save"
      icon="S"
      [model]="items"
      [(open)]="open"
      [loading]="loading()"
      (clicked)="primaryClicks.update(count => count + 1)"
      (itemSelected)="selected.set($event.item.label ?? '')"
    />
    <button id="outside" type="button">Outside</button>
  `,
})
class SplitButtonTestHost {
  readonly open = signal(false);
  readonly loading = signal(false);
  readonly primaryClicks = signal(0);
  readonly selected = signal('');
  readonly commands = signal(0);
  readonly items: readonly AerisSplitButtonItem[] = [
    { label: 'Save draft', icon: 'D', command: () => this.commands.update((count) => count + 1) },
    { separator: true },
    { label: 'Publish', icon: 'P', disabled: true },
    { label: 'Hidden', visible: false },
    { label: 'Open repository', icon: 'R', url: '/repository' },
  ];
}

describe('AerisSplitButton', () => {
  it('keeps the primary action independent from the popup menu', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    const primary = fixture.nativeElement.querySelector(
      '.aeris-split-button__primary',
    ) as HTMLButtonElement;
    primary.click();

    expect(fixture.componentInstance.primaryClicks()).toBe(1);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('connects the toggle to an accessible menu and renders the documented model', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector(
      '.aeris-split-button__toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector(
      '.aeris-split-button__menu',
    ) as HTMLElement;
    const items = menu.querySelectorAll('[role="menuitem"]');

    expect(toggle.getAttribute('aria-haspopup')).toBe('menu');
    expect(toggle.getAttribute('aria-controls')).toBe(menu.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.querySelector('[role="separator"]')).not.toBeNull();
    expect(items.length).toBe(3);
    expect(menu.textContent).not.toContain('Hidden');
  });

  it('invokes item commands, emits selection, closes, and restores toggle focus', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector(
      '.aeris-split-button__toggle',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    const firstItem = fixture.nativeElement.querySelector(
      '.aeris-split-button__item',
    ) as HTMLButtonElement;
    firstItem.click();
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.commands()).toBe(1);
    expect(fixture.componentInstance.selected()).toBe('Save draft');
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('skips separators and disabled entries during keyboard navigation', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector(
      '.aeris-split-button__toggle',
    ) as HTMLButtonElement;
    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await Promise.resolve();

    const items = fixture.nativeElement.querySelectorAll(
      '.aeris-split-button__item',
    ) as NodeListOf<HTMLElement>;
    expect(items.item(0).tabIndex).toBe(0);
    expect((items.item(1) as HTMLButtonElement).disabled).toBe(true);

    items.item(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    expect(items.item(2).tabIndex).toBe(0);

    items.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('supports reverse opening, Home, End, and Tab dismissal', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector(
      '.aeris-split-button__toggle',
    ) as HTMLButtonElement;
    toggle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    const items = fixture.nativeElement.querySelectorAll(
      '.aeris-split-button__item',
    ) as NodeListOf<HTMLElement>;
    expect(document.activeElement).toBe(items.item(2));

    items.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    await Promise.resolve();
    expect(document.activeElement).toBe(items.item(0));

    items.item(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    await Promise.resolve();
    expect(document.activeElement).toBe(items.item(2));

    items.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('closes on outside click and disables both actions while loading', async () => {
    const fixture = TestBed.createComponent(SplitButtonTestHost);
    await fixture.whenStable();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#outside') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.aeris-split-button__control button',
    ) as NodeListOf<HTMLButtonElement>;
    expect([...buttons].every((button) => button.disabled)).toBe(true);
    expect(buttons.item(0).getAttribute('aria-busy')).toBe('true');
  });

  it('uses native hrefs and an optional navigation handler for router links', async () => {
    const fixture = TestBed.createComponent(AerisSplitButton);
    const navigated: (string | readonly (string | number)[])[] = [];
    fixture.componentRef.setInput('label', 'Save');
    fixture.componentRef.setInput('model', [
      { label: 'Settings', routerLink: ['workspace', 42, 'settings'] },
    ]);
    fixture.componentRef.setInput(
      'navigationHandler',
      (link: string | readonly (string | number)[]) => navigated.push(link),
    );
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const item = fixture.nativeElement.querySelector(
      '.aeris-split-button__item',
    ) as HTMLAnchorElement;
    expect(item.getAttribute('href')).toBe('/workspace/42/settings');

    item.click();
    expect(navigated).toEqual([['workspace', 42, 'settings']]);
  });
});
