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
      [closeOnMouseLeave]="closeOnMouseLeave()"
      ariaLabel="Application menu"
      navAriaLabel="Primary"
      (itemSelected)="selected.set($event)"
    />
  `,
})
class MenubarHost {
  readonly menubar = viewChild.required<AerisMenubar>('menubar');
  readonly closeOnMouseLeave = signal(true);
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

@Component({
  imports: [AerisMenubarModule],
  template: `
    <aeris-menubar
      [model]="items"
      rootItemVariant="ghost"
      submenuItemVariant="outline"
      rootItemSeverity="info"
      submenuItemSeverity="secondary"
    >
      <ng-template
        aerisMenubarItem
        let-item
        let-current="current"
        let-variant="variant"
        let-severity="severity"
      >
        <span
          class="appearance-content"
          [attr.data-item-current]="current"
          [attr.data-item-variant]="variant"
          [attr.data-item-severity]="severity"
          >{{ item.label }}</span
        >
      </ng-template>
    </aeris-menubar>
  `,
})
class MenubarAppearanceHost {
  readonly items: readonly AerisMenubarItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      url: '/overview',
      active: true,
    },
    {
      id: 'manage',
      label: 'Manage',
      items: [
        { id: 'projects', label: 'Projects' },
        {
          id: 'remove',
          label: 'Remove',
          variant: 'danger',
          severity: 'danger',
          ariaCurrent: 'step',
        },
      ],
    },
  ];
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
    const toggle = fixture.nativeElement.querySelector(
      '.aeris-menubar__toggle',
    ) as HTMLButtonElement;

    expect(nav.getAttribute('aria-label')).toBe('Primary');
    expect(menubar.getAttribute('aria-label')).toBe('Application menu');
    expect(menubar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(roots.length).toBe(3);
    expect(roots[0]?.dataset['variant']).toBe('default');
    expect(roots[0]?.dataset['severity']).toBe('primary');
    expect(roots[0]?.hasAttribute('aria-current')).toBe(false);
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

    const submenuItem = fixture.nativeElement.querySelector('#new') as HTMLElement;
    expect(getComputedStyle(file).borderRadius).toBe(getComputedStyle(submenuItem).borderRadius);

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

  it('closes submenus on mouse leave by default and supports keeping them open', () => {
    const fixture = TestBed.createComponent(MenubarHost);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.aeris-menubar__nav') as HTMLElement;
    const file = fixture.nativeElement.querySelector('#file') as HTMLButtonElement;
    file.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#file-submenu')).not.toBeNull();

    nav.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#file-submenu')).toBeNull();

    fixture.componentInstance.closeOnMouseLeave.set(false);
    file.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    nav.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#file-submenu')).not.toBeNull();
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

  it('applies root, submenu, and item appearance without nesting controls', () => {
    const fixture = TestBed.createComponent(MenubarAppearanceHost);
    fixture.detectChanges();

    const overview = fixture.nativeElement.querySelector('#overview') as HTMLAnchorElement;
    const manage = fixture.nativeElement.querySelector('#manage') as HTMLButtonElement;

    expect(overview.tagName).toBe('A');
    expect(overview.dataset['variant']).toBe('ghost');
    expect(overview.dataset['severity']).toBe('info');
    expect(overview.getAttribute('aria-current')).toBe('page');
    expect(overview.closest('.aeris-menubar__item-shell')?.getAttribute('data-current')).toBe(
      'true',
    );
    expect(overview.querySelector('a, button')).toBeNull();
    expect(manage.dataset['variant']).toBe('ghost');
    expect(manage.dataset['severity']).toBe('info');

    manage.click();
    fixture.detectChanges();

    const projects = fixture.nativeElement.querySelector('#projects') as HTMLButtonElement;
    const remove = fixture.nativeElement.querySelector('#remove') as HTMLButtonElement;

    expect(projects.dataset['variant']).toBe('outline');
    expect(projects.dataset['severity']).toBe('secondary');
    expect(remove.dataset['variant']).toBe('danger');
    expect(remove.dataset['severity']).toBe('danger');
    expect(remove.getAttribute('aria-current')).toBe('step');
    expect(remove.querySelector('.appearance-content')?.getAttribute('data-item-current')).toBe(
      'true',
    );
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
