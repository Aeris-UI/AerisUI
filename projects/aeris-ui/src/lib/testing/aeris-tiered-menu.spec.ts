import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisTieredMenu,
  AerisTieredMenuModule,
  type AerisTieredMenuItem,
  type AerisTieredMenuItemEvent,
  type AerisTieredMenuVisibilityEvent,
} from '../../../tiered-menu/aeris-tiered-menu';

const items: readonly AerisTieredMenuItem[] = [
  {
    label: 'File',
    icon: 'F',
    items: [
      { label: 'New', shortcut: 'Ctrl + N' },
      { label: 'Open', badge: 'Recent' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Copy' },
      { label: 'Paste', disabled: true },
    ],
  },
  { separator: true },
  { label: 'Search', command: () => undefined },
];

@Component({
  imports: [AerisTieredMenuModule],
  template: `
    <aeris-tiered-menu
      [model]="items"
      ariaLabel="Workspace actions"
      (itemSelected)="selectedEvents.push($event)"
    />
  `,
})
class StaticTieredMenuHost {
  readonly items = items;
  readonly selectedEvents: AerisTieredMenuItemEvent[] = [];
}

@Component({
  imports: [AerisTieredMenuModule],
  template: `
    <button #trigger type="button" id="trigger" (click)="menu.toggle($event)">Toggle</button>
    <aeris-tiered-menu
      #menu
      popup
      [model]="items"
      [autoFocus]="true"
      (shown)="shownEvents.push($event)"
      (hidden)="hiddenEvents.push($event)"
    />
  `,
})
class PopupTieredMenuHost {
  readonly menu = viewChild<AerisTieredMenu>('menu');
  readonly items = items;
  readonly shownEvents: AerisTieredMenuVisibilityEvent[] = [];
  readonly hiddenEvents: AerisTieredMenuVisibilityEvent[] = [];
}

@Component({
  imports: [AerisTieredMenuModule],
  template: `
    <aeris-tiered-menu
      [model]="items"
      size="lg"
      width="18rem"
      [navigationHandler]="navigate"
      (itemSelected)="selected.set($event.item.label ?? '')"
    >
      <ng-template aerisTieredMenuItem let-item let-hasSubmenu="hasSubmenu" let-open="open">
        <span class="custom-item" [attr.data-open]="open || null">
          <span>{{ item.label }}</span>
          @if (hasSubmenu) {
            <span class="custom-more">More</span>
          }
        </span>
      </ng-template>
    </aeris-tiered-menu>
  `,
})
class TemplateTieredMenuHost {
  readonly selected = signal('');
  readonly navigated = signal('');
  readonly items: readonly AerisTieredMenuItem[] = [
    {
      label: 'Project',
      items: [
        { label: 'Overview', routerLink: ['/components', 'tiered-menu'] },
        { label: 'External', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
      ],
    },
  ];
  readonly navigate = (link: string | readonly (string | number)[]): void => {
    this.navigated.set(typeof link === 'string' ? link : link.join('/'));
  };
}

@Component({
  imports: [AerisTieredMenuModule],
  template: `
    <aeris-tiered-menu #menu [model]="items" popup [autoFocus]="false" />
  `,
})
class ProgrammaticTieredMenuHost {
  readonly menu = viewChild.required<AerisTieredMenu>('menu');
  readonly items = [{ label: 'Programmatic' }];
}

describe('AerisTieredMenu', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir');
  });

  it('renders static menu semantics, separators, badges, shortcuts, and commands', () => {
    const fixture = TestBed.createComponent(StaticTieredMenuHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.aeris-tiered-menu__panel') as HTMLElement;
    const root = fixture.nativeElement.querySelector('.aeris-tiered-menu__list') as HTMLElement;
    const rootItems = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    const separator = fixture.nativeElement.querySelector('[role="separator"]') as HTMLElement;

    expect(panel).toBeTruthy();
    expect(root.getAttribute('role')).toBe('menubar');
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
    expect(root.getAttribute('aria-label')).toBe('Workspace actions');
    expect(rootItems.length).toBe(3);
    expect(separator).toBeTruthy();

    const fileItem = Array.from(rootItems).find((item) =>
      item.textContent?.includes('File'),
    );
    fileItem?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(panel.textContent).toContain('Recent');
    expect(panel.textContent).toContain('Ctrl + N');

    const search = Array.from(rootItems).find((item) => item.textContent?.includes('Search'));
    search?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedEvents.length).toBe(1);
    expect(fixture.componentInstance.selectedEvents[0]?.item.label).toBe('Search');
  });

  it('opens nested submenus with pointer and keyboard navigation', async () => {
    const fixture = TestBed.createComponent(StaticTieredMenuHost);
    fixture.detectChanges();

    const fileItem = menuItems(fixture.nativeElement).find((item) =>
      item.textContent?.includes('File'),
    );

    fileItem?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(fileItem?.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.aeris-tiered-menu__submenu')).toBeTruthy();

    fileItem?.dispatchEvent(keyEvent('ArrowRight'));
    fixture.detectChanges();
    await settle();

    const newItem = menuItems(fixture.nativeElement).find((item) =>
      item.textContent?.includes('New'),
    );
    expect(newItem).toBe(document.activeElement);

    newItem?.dispatchEvent(keyEvent('ArrowLeft'));
    fixture.detectChanges();
    await settle();

    expect(fileItem).toBe(document.activeElement);
  });

  it('uses the opposite arrow direction for RTL submenu navigation', async () => {
    document.documentElement.dir = 'rtl';
    const fixture = TestBed.createComponent(StaticTieredMenuHost);
    fixture.detectChanges();

    const fileItem = menuItems(fixture.nativeElement).find((item) =>
      item.textContent?.includes('File'),
    );

    fileItem?.dispatchEvent(keyEvent('ArrowLeft'));
    fixture.detectChanges();
    await settle();

    const newItem = menuItems(fixture.nativeElement).find((item) =>
      item.textContent?.includes('New'),
    );
    expect(newItem).toBe(document.activeElement);
  });

  it('supports popup toggle, positioning, restore focus, and close events', async () => {
    const fixture = TestBed.createComponent(PopupTieredMenuHost);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    mockRect(trigger, elementRect(40, 40, 120, 40));
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-tiered-menu__panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('data-popup')).toBe('true');
    expect(panel.getAttribute('data-positioned')).toBe('true');
    expect(panel.style.left).toBe('40px');
    expect(panel.style.top).toBe('86px');
    expect(fixture.componentInstance.shownEvents.length).toBe(1);

    mockRect(trigger, elementRect(64, 140, 120, 40));
    fixture.componentInstance.menu()?.reposition();
    fixture.detectChanges();

    expect(panel.style.left).toBe('64px');
    expect(panel.style.top).toBe('186px');

    document.dispatchEvent(keyEvent('Escape'));
    fixture.detectChanges();
    await settle();

    expect(document.querySelector('.aeris-tiered-menu__panel')).toBeNull();
    expect(fixture.componentInstance.hiddenEvents.at(-1)?.reason).toBe('escape');
    expect(document.activeElement).toBe(trigger);
  });

  it('supports item templates, size, width, links, and navigation handlers', () => {
    const fixture = TestBed.createComponent(TemplateTieredMenuHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.aeris-tiered-menu__panel') as HTMLElement;
    const project = fixture.nativeElement.querySelector('[role="menuitem"]') as HTMLElement;

    expect(panel.getAttribute('data-size')).toBe('lg');
    expect(panel.style.getPropertyValue('--aeris-tiered-menu-width')).toBe('18rem');
    expect(fixture.nativeElement.querySelector('.custom-item')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.custom-more')?.textContent).toContain('More');

    project.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    const overview = menuItems(fixture.nativeElement).find((item) =>
      item.textContent?.includes('Overview'),
    );
    const external = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>(
        'a[role="menuitem"]',
      ),
    ).find((item) => item.textContent?.includes('External'));

    expect(external?.href).toBe('https://angular.dev/');
    expect(external?.target).toBe('_blank');

    overview?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()).toBe('Overview');
    expect(fixture.componentInstance.navigated()).toBe('/components/tiered-menu');
  });

  it('can be opened programmatically from a trigger event', async () => {
    const fixture = TestBed.createComponent(ProgrammaticTieredMenuHost);
    fixture.detectChanges();

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 30,
      clientY: 40,
    });
    fixture.nativeElement.dispatchEvent(event);
    fixture.componentInstance.menu().show(event);
    fixture.detectChanges();
    await settle();

    expect(document.querySelector('.aeris-tiered-menu__panel')?.textContent).toContain('Programmatic');
  });
});

function keyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
}

function menuItems(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}

function elementRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
}

function mockRect(element: Element, rect: DOMRect): void {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => rect,
  });
}

async function settle(): Promise<void> {
  await Promise.resolve();
}
