import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisContextMenu,
  AerisContextMenuModule,
  type AerisContextMenuItem,
  type AerisContextMenuItemEvent,
  type AerisContextMenuVisibilityEvent,
} from '../../../context-menu/aeris-context-menu';

const items: readonly AerisContextMenuItem[] = [
  { label: 'Open', icon: '↗', command: () => undefined },
  {
    label: 'Create',
    items: [
      { label: 'Component', badge: 2 },
      { label: 'Directive', disabled: true },
    ],
  },
  { separator: true },
  { label: 'Delete', shortcut: 'Del' },
];

@Component({
  imports: [AerisContextMenuModule],
  template: `
    <button #target type="button" id="target">Right-click target</button>
    <aeris-context-menu
      [target]="target"
      [model]="items"
      ariaLabel="Target actions"
      (shown)="shownEvents.push($event)"
      (hidden)="hiddenEvents.push($event)"
      (itemSelected)="selectedEvents.push($event)"
    />
  `,
})
class TargetContextMenuHost {
  readonly items = items;
  readonly shownEvents: AerisContextMenuVisibilityEvent[] = [];
  readonly hiddenEvents: AerisContextMenuVisibilityEvent[] = [];
  readonly selectedEvents: AerisContextMenuItemEvent[] = [];
}

@Component({
  imports: [AerisContextMenuModule],
  template: `
    <aeris-context-menu
      global
      [model]="items"
      [hideOnScroll]="true"
      (hidden)="hiddenEvents.push($event)"
    />
  `,
})
class GlobalContextMenuHost {
  readonly items = [{ label: 'Global action' }];
  readonly hiddenEvents: AerisContextMenuVisibilityEvent[] = [];
}

@Component({
  imports: [AerisContextMenuModule],
  template: `
    <button #target type="button">Template target</button>
    <aeris-context-menu [target]="target" [model]="items" size="lg" width="18rem">
      <ng-template aerisContextMenuItem let-item let-hasSubmenu="hasSubmenu" let-active="active">
        <span class="custom-item" [attr.data-active]="active || null">
          <span>{{ item.label }}</span>
          @if (hasSubmenu) {
            <span class="custom-submenu">More</span>
          }
        </span>
      </ng-template>
    </aeris-context-menu>
  `,
})
class TemplateContextMenuHost {
  readonly items = items;
}

@Component({
  imports: [AerisContextMenuModule],
  template: `
    <aeris-context-menu #menu [model]="items" [autoFocus]="false" />
  `,
})
class ProgrammaticContextMenuHost {
  readonly menu = viewChild.required<AerisContextMenu>('menu');
  readonly items = [{ label: 'Programmatic' }];
}

describe('AerisContextMenu', () => {
  it('opens from the configured target, prevents the native menu, renders menu semantics, and emits selection', async () => {
    const fixture = TestBed.createComponent(TargetContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    const event = contextMenuEvent(140, 160);
    const prevented = !target.dispatchEvent(event);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;
    const menu = document.querySelector('.aeris-context-menu__list') as HTMLElement;
    const menuItems = document.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    const separator = document.querySelector('[role="separator"]') as HTMLElement;

    expect(prevented).toBe(true);
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('data-positioned')).toBe('true');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Target actions');
    expect(menuItems.length).toBe(3);
    expect(separator).toBeTruthy();
    expect(fixture.componentInstance.shownEvents.length).toBe(1);
    expect(fixture.componentInstance.shownEvents[0]?.target).toBe(target);

    menuItems[0]?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedEvents.length).toBe(1);
    expect(fixture.componentInstance.selectedEvents[0]?.item.label).toBe('Open');
    expect(fixture.componentInstance.hiddenEvents.at(-1)?.reason).toBe('select');
    expect(document.querySelector('.aeris-context-menu__panel')).toBeNull();
  });

  it('supports nested submenus and keyboard navigation', async () => {
    const fixture = TestBed.createComponent(TargetContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    target.dispatchEvent(contextMenuEvent(80, 90));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const rootItems = () => Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    const createItem = rootItems().find((item) => item.textContent?.includes('Create'));
    expect(createItem).toBeTruthy();

    createItem?.dispatchEvent(keyEvent('keydown', 'ArrowRight'));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const submenu = document.querySelector('.aeris-context-menu__submenu') as HTMLElement;
    const component = rootItems().find((item) => item.textContent?.includes('Component'));
    const directive = rootItems().find((item) => item.textContent?.includes('Directive'));

    expect(submenu).toBeTruthy();
    expect(createItem?.getAttribute('aria-expanded')).toBe('true');
    expect(component).toBe(document.activeElement);
    expect(directive?.getAttribute('disabled')).toBe('');

    component?.dispatchEvent(keyEvent('keydown', 'ArrowLeft'));
    fixture.detectChanges();
    await settle();

    expect(createItem).toBe(document.activeElement);
  });

  it('positions itself after opening without requiring another change detection trigger', async () => {
    const fixture = TestBed.createComponent(TargetContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    target.dispatchEvent(contextMenuEvent(120, 130));
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;
    expect(panel).toBeTruthy();

    await settle();

    expect(panel.getAttribute('data-positioned')).toBe('true');
    expect(panel.style.left).toContain('px');
    expect(panel.style.top).toContain('px');
  });

  it('positions after a document contextmenu event even when the panel renders after the event turn', async () => {
    const fixture = TestBed.createComponent(TargetContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    target.dispatchEvent(contextMenuEvent(120, 130));

    await settle();
    fixture.detectChanges();
    await settle();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('data-positioned')).toBe('true');
    expect(panel.style.left).toContain('px');
    expect(panel.style.top).toContain('px');
  });

  it('keeps submenus outside the root scroll container so they are not clipped', async () => {
    const fixture = TestBed.createComponent(TargetContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    target.dispatchEvent(contextMenuEvent(80, 90));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const createItem = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      .find((item) => item.textContent?.includes('Create'));

    createItem?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    const rootList = document.querySelector(
      '.aeris-context-menu__list[data-level="0"]',
    ) as HTMLElement;
    const submenu = document.querySelector('.aeris-context-menu__submenu') as HTMLElement;

    expect(submenu).toBeTruthy();
    expect(getComputedStyle(rootList).overflow).toBe('visible');
  });

  it('opens globally and can hide on scroll', async () => {
    const fixture = TestBed.createComponent(GlobalContextMenuHost);
    fixture.detectChanges();

    document.dispatchEvent(contextMenuEvent(220, 240));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    expect(document.querySelector('.aeris-context-menu__panel')).toBeTruthy();

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.componentInstance.hiddenEvents.at(-1)?.reason).toBe('scroll');
    expect(document.querySelector('.aeris-context-menu__panel')).toBeNull();
  });

  it('supports item templates, sizing, and width tokens', async () => {
    const fixture = TestBed.createComponent(TemplateContextMenuHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    target.dispatchEvent(contextMenuEvent(100, 110));
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;
    const customItems = document.querySelectorAll('.custom-item') as NodeListOf<HTMLElement>;
    const renderedItems = document.querySelectorAll(
      '.aeris-context-menu__item[data-custom-template="true"]',
    ) as NodeListOf<HTMLElement>;

    expect(panel.getAttribute('data-size')).toBe('lg');
    expect(panel.style.getPropertyValue('--aeris-context-menu-width')).toBe('18rem');
    expect(customItems.length).toBe(3);
    expect(renderedItems.length).toBe(3);
    expect(getComputedStyle(renderedItems[0] as HTMLElement).display).toBe('block');
    expect(document.querySelector('.custom-submenu')?.textContent).toContain('More');
  });

  it('can be opened programmatically at coordinates', async () => {
    const fixture = TestBed.createComponent(ProgrammaticContextMenuHost);
    fixture.detectChanges();

    fixture.componentInstance.menu().openAt(20, 30);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const panel = document.querySelector('.aeris-context-menu__panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(Number(panel.style.left.replace('px', ''))).toBeGreaterThanOrEqual(0);
    expect(panel.textContent).toContain('Programmatic');
  });
});

function contextMenuEvent(x: number, y: number): MouseEvent {
  return new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
}

function keyEvent(type: string, key: string): KeyboardEvent {
  return new KeyboardEvent(type, { bubbles: true, cancelable: true, key });
}

async function settle(): Promise<void> {
  await Promise.resolve();
}
