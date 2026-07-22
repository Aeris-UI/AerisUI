import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisMenubar,
  AerisMenubarModule,
  type AerisMenubarItem,
  type AerisMenubarItemEvent,
} from '../../../menubar/aeris-menubar';

const items: readonly AerisMenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New file', shortcut: '⌘ + N', command: () => undefined },
      { id: 'open', label: 'Open', disabled: true },
      { separator: true },
      {
        id: 'recent',
        label: 'Open recent',
        items: [
          { id: 'alpha', label: 'alpha.md' },
          { id: 'beta', label: 'beta.md' },
        ],
      },
    ],
  },
  { id: 'edit', label: 'Edit', items: [{ id: 'copy', label: 'Copy' }] },
  { id: 'docs', label: 'Docs', routerLink: ['/components', 'menubar'] },
];

@Component({
  imports: [AerisMenubarModule],
  template: `
    <aeris-menubar
      #menubar
      [model]="items"
      ariaLabel="Application menu"
      navAriaLabel="Primary"
      (itemSelected)="selected.set($event)"
    />
  `,
})
class MenubarHost {
  readonly menubar = viewChild.required<AerisMenubar>('menubar');
  readonly selected = signal<AerisMenubarItemEvent | null>(null);
  readonly items = items;
}

@Component({
  imports: [AerisMenubarModule],
  template: `
    <aeris-menubar [model]="items">
      <ng-template aerisMenubarStart>
        <strong class="start">Aeris</strong>
      </ng-template>
      <ng-template aerisMenubarItem let-item let-hasSubmenu="hasSubmenu">
        <span class="custom-item">{{ item.label }}{{ hasSubmenu ? ' +' : '' }}</span>
      </ng-template>
      <ng-template aerisMenubarEnd>
        <button class="end" type="button">Profile</button>
      </ng-template>
    </aeris-menubar>
  `,
})
class MenubarTemplateHost {
  readonly items = items;
}

describe('AerisMenubar', () => {
  it('renders menubar semantics, root items, and responsive toggle button', async () => {
    const fixture = TestBed.createComponent(MenubarHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const menubar = fixture.nativeElement.querySelector('[role="menubar"]') as HTMLElement;
    const roots = fixture.nativeElement.querySelectorAll(
      '.aeris-menubar__root > .aeris-menubar__item-shell > .aeris-menubar__item',
    ) as NodeListOf<HTMLElement>;
    const toggle = fixture.nativeElement.querySelector('.aeris-menubar__toggle') as HTMLButtonElement;

    expect(nav.getAttribute('aria-label')).toBe('Primary');
    expect(menubar.getAttribute('aria-label')).toBe('Application menu');
    expect(menubar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(roots.length).toBe(3);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('opens nested submenus and activates leaf commands', async () => {
    const fixture = TestBed.createComponent(MenubarHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const file = fixture.nativeElement.querySelector('#file') as HTMLButtonElement;
    file.click();
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('#file-submenu')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Open recent');

    const recent = fixture.nativeElement.querySelector('#recent') as HTMLButtonElement;
    recent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#recent-submenu')).not.toBeNull();

    const newFile = fixture.nativeElement.querySelector('#new') as HTMLButtonElement;
    newFile.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()?.item.id).toBe('new');
    expect(fixture.nativeElement.querySelector('#file-submenu')).toBeNull();
  });

  it('supports keyboard navigation and closes submenu focus back to root', async () => {
    const fixture = TestBed.createComponent(MenubarHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const file = fixture.nativeElement.querySelector('#file') as HTMLButtonElement;
    file.dispatchEvent(keyEvent('ArrowDown'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('#file-submenu')).not.toBeNull();
    expect(document.activeElement?.textContent).toContain('New file');

    document.activeElement?.dispatchEvent(keyEvent('ArrowDown'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement?.textContent).toContain('Open recent');

    document.activeElement?.dispatchEvent(keyEvent('Escape'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('#file-submenu')).toBeNull();
    expect(document.activeElement).toBe(file);
  });

  it('supports public methods, links, disabled state, and templates', async () => {
    const fixture = TestBed.createComponent(MenubarTemplateHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const docs = Array.from<HTMLAnchorElement>(
      fixture.nativeElement.querySelectorAll('.aeris-menubar__item'),
    ).find((item) => item.textContent?.includes('Docs'));

    expect(fixture.nativeElement.querySelector('.start')?.textContent).toContain('Aeris');
    expect(fixture.nativeElement.querySelector('.end')?.textContent).toContain('Profile');
    expect(fixture.nativeElement.querySelector('.custom-item')?.textContent).toContain('File +');
    expect(docs?.getAttribute('href')).toBe('/components/menubar');
  });

  it('opens and closes through the public API', async () => {
    const fixture = TestBed.createComponent(MenubarHost);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.menubar().open('0');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#file-submenu')).not.toBeNull();

    fixture.componentInstance.menubar().close();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#file-submenu')).toBeNull();
  });
});

function keyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
}
