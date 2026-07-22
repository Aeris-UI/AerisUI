import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisMenu,
  AerisMenuModule,
  type AerisMenuExpandedKeys,
  type AerisMenuItem,
  type AerisMenuItemEvent,
} from '../../../menu/aeris-menu';

@Component({
  imports: [AerisMenuModule],
  template: `
    <aeris-menu
      #menu
      [model]="items"
      [(expandedKeys)]="expandedKeys"
      ariaLabel="Workspace menu"
      (itemSelected)="lastSelection.set($event)"
    />
  `,
})
class MenuTestHost {
  readonly menu = viewChild.required<AerisMenu>('menu');
  readonly expandedKeys = signal<AerisMenuExpandedKeys>({ workspace: true });
  readonly lastSelection = signal<AerisMenuItemEvent | null>(null);
  readonly items: readonly AerisMenuItem[] = [
    {
      id: 'account',
      label: 'Account',
      toggleable: false,
      items: [
        { id: 'profile', label: 'Profile', icon: 'P', badge: 'New', command: () => undefined },
        { separator: true },
        { id: 'disabled', label: 'Disabled', disabled: true },
      ],
    },
    {
      id: 'workspace',
      label: 'Workspace',
      items: [
        { id: 'projects', label: 'Projects', shortcut: '⌘ + P', command: () => undefined },
        { id: 'reports', label: 'Reports', routerLink: ['/reports'] },
      ],
    },
  ];
}

@Component({
  imports: [AerisMenuModule],
  template: `<aeris-menu [model]="items" ariaLabel="Default expanded menu" />`,
})
class MenuDefaultExpandedHost {
  readonly items: readonly AerisMenuItem[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      expanded: true,
      items: [{ id: 'projects', label: 'Projects' }],
    },
  ];
}

@Component({
  imports: [AerisMenuModule],
  template: `
    <button id="trigger" type="button" (click)="menu.toggle($event)">Actions</button>
    <aeris-menu
      #menu
      popup
      [model]="items"
      (hidden)="hiddenReason.set($event.reason)"
      (shown)="shown.set(true)"
      (itemSelected)="selected.set(true)"
    />
  `,
})
class MenuPopupTestHost {
  readonly menu = viewChild.required<AerisMenu>('menu');
  readonly shown = signal(false);
  readonly selected = signal(false);
  readonly hiddenReason = signal('');
  readonly items: readonly AerisMenuItem[] = [
    { id: 'new', label: 'New', command: () => undefined },
    { id: 'open', label: 'Open', command: () => undefined },
  ];
}

@Component({
  imports: [AerisMenuModule],
  template: `
    <aeris-menu [model]="items" ariaLabel="Template menu">
      <ng-template aerisMenuStart>
        <strong class="menu-start">Start slot</strong>
      </ng-template>
      <ng-template aerisMenuHeader let-item>
        <span class="custom-header">{{ item.label }}</span>
      </ng-template>
      <ng-template aerisMenuItem let-item let-expanded="expanded">
        <span class="custom-item">{{ item.label }} {{ expanded ? 'open' : 'closed' }}</span>
      </ng-template>
      <ng-template aerisMenuEnd>
        <strong class="menu-end">End slot</strong>
      </ng-template>
    </aeris-menu>
  `,
})
class MenuTemplateTestHost {
  readonly items: readonly AerisMenuItem[] = [
    { id: 'group', label: 'Group', toggleable: false, items: [{ id: 'child', label: 'Child' }] },
  ];
}

@Component({
  imports: [AerisMenuModule],
  template: `<aeris-menu [model]="items" ariaLabel="Link security" />`,
})
class MenuLinkSecurityHost {
  readonly items: readonly AerisMenuItem[] = [
    { label: 'External', url: 'https://example.com', target: '_blank' },
    { label: 'Unsafe', url: 'javascript:alert(1)' },
  ];
}

describe('AerisMenu', () => {
  it('renders accessible static menu groups, items, separators, badges, and disabled state', async () => {
    const fixture = TestBed.createComponent(MenuTestHost);
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    const disabled = [...items]
      .find((item) => item.textContent?.includes('Disabled')) as HTMLButtonElement;

    expect(root.getAttribute('aria-label')).toBe('Workspace menu');
    expect(items.length).toBe(5);
    expect(fixture.nativeElement.querySelector('[role="separator"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.aeris-menu__badge')?.textContent?.trim()).toBe('New');
    expect(disabled.disabled).toBe(true);
  });

  it('sanitizes unsafe URLs and protects new browsing contexts', async () => {
    const fixture = TestBed.createComponent(MenuLinkSecurityHost);
    await fixture.whenStable();
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;

    expect(links[0]?.rel).toContain('noopener');
    expect(links[0]?.rel).toContain('noreferrer');
    expect(links[1]?.getAttribute('href')).toContain('unsafe:');
  });

  it('activates commands and emits selected events', async () => {
    const fixture = TestBed.createComponent(MenuTestHost);
    await fixture.whenStable();

    const profile = [...fixture.nativeElement.querySelectorAll('[role="menuitem"]')]
      .find((item: HTMLElement) => item.textContent?.includes('Profile')) as HTMLButtonElement;
    profile.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastSelection()?.item.id).toBe('profile');
    expect(fixture.componentInstance.lastSelection()?.path).toEqual([0, 0]);
  });

  it('supports controlled expansion and public expand/collapse methods', async () => {
    const fixture = TestBed.createComponent(MenuTestHost);
    await fixture.whenStable();

    const workspace = [...fixture.nativeElement.querySelectorAll('[role="menuitem"]')]
      .find((item: HTMLElement) => item.textContent?.includes('Workspace')) as HTMLButtonElement;
    expect(workspace.getAttribute('aria-expanded')).toBe('true');

    workspace.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual({ workspace: false });

    fixture.componentInstance.menu().expandAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()['workspace']).toBe(true);

    fixture.componentInstance.menu().collapseAll();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedKeys()).toEqual({ workspace: false });
  });

  it('allows default-expanded groups to be collapsed by the user', async () => {
    const fixture = TestBed.createComponent(MenuDefaultExpandedHost);
    await fixture.whenStable();

    const workspace = fixture.nativeElement.querySelector('[role="menuitem"]') as HTMLButtonElement;
    expect(workspace.getAttribute('aria-expanded')).toBe('true');

    workspace.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(workspace.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.textContent).not.toContain('Projects');
  });

  it('moves focus with arrow, Home, and End keys', async () => {
    const fixture = TestBed.createComponent(MenuTestHost);
    await fixture.whenStable();

    fixture.componentInstance.menu().focus();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement?.textContent).toContain('Profile');
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement?.textContent).toContain('Workspace');

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement?.textContent).toContain('Reports');

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement?.textContent).toContain('Profile');
  });

  it('opens as a popup from a trigger, closes on selection, and restores trigger focus', async () => {
    const fixture = TestBed.createComponent(MenuPopupTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.shown()).toBe(true);
    expect(fixture.nativeElement.querySelector('.aeris-menu__panel[data-popup]')).not.toBeNull();
    expect(document.activeElement?.textContent).toContain('New');

    (document.activeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.selected()).toBe(true);
    expect(fixture.componentInstance.hiddenReason()).toBe('select');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes popup menus with Escape', async () => {
    const fixture = TestBed.createComponent(MenuPopupTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.hiddenReason()).toBe('escape');
    expect(document.activeElement).toBe(trigger);
  });

  it('renders start, item, header, and end templates', async () => {
    const fixture = TestBed.createComponent(MenuTemplateTestHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.menu-start')?.textContent).toContain('Start slot');
    expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain('Group');
    expect(fixture.nativeElement.querySelector('.custom-item')?.textContent).toContain('Child');
    expect(fixture.nativeElement.querySelector('.menu-end')?.textContent).toContain('End slot');
  });
});
