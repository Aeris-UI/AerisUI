import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  AerisSidebar,
  AerisSidebarGroup,
  AerisSidebarModule,
} from '../../../sidebar/aeris-sidebar';

@Component({
  imports: [AerisSidebarModule, RouterLink, RouterLinkActive],
  template: `
    <button [aerisSidebarToggle]="sidebar" id="navigation-toggle">Navigation</button>
    <aeris-sidebar
      #sidebar
      [mode]="mode()"
      [(collapsed)]="collapsed"
      [(open)]="open"
      [closeOnNavigate]="closeOnNavigate()"
      [side]="side()"
      ariaLabel="Test navigation"
    >
      <strong aerisSidebarHeader>Workspace</strong>
      <a
        aerisSidebarItem
        label="Overview"
        routerLink="/overview"
        routerLinkActive
        #route="routerLinkActive"
        [active]="route.isActive"
        ><span aerisSidebarIcon>O</span></a
      >
      <aeris-sidebar-group #group label="Projects" [(expanded)]="expanded">
        <button aerisSidebarItem label="Current project">
          <span aerisSidebarIcon>P</span><span aerisSidebarBadge>3</span>
        </button>
        <aeris-sidebar-group label="Archived">
          <a
            aerisSidebarItem
            label="Disabled destination"
            [disabled]="true"
            routerLink="/disabled"
            (click)="disabledClicks.update(increment)"
            ><span aerisSidebarIcon>D</span></a
          >
        </aeris-sidebar-group>
      </aeris-sidebar-group>
      <footer aerisSidebarFooter>Account</footer>
    </aeris-sidebar>
    <button id="after">After navigation</button>
  `,
})
class SidebarHost {
  readonly sidebar = viewChild.required<AerisSidebar>('sidebar');
  readonly group = viewChild.required<AerisSidebarGroup>('group');
  readonly mode = signal<'desktop' | 'mobile' | 'auto'>('desktop');
  readonly collapsed = signal(false);
  readonly open = signal(false);
  readonly expanded = signal(true);
  readonly closeOnNavigate = signal(true);
  readonly side = signal<'start' | 'end'>('start');
  readonly disabledClicks = signal(0);
  readonly increment = (count: number) => count + 1;
}

describe('AerisSidebar', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'overview', children: [] },
          { path: 'disabled', children: [] },
        ]),
      ],
    }),
  );

  it('uses one native navigation landmark, projected slots and native links instead of menus', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('nav')).toHaveLength(1);
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Test navigation');
    expect(element.querySelector('[role="menu"]')).toBeNull();
    expect(element.querySelector('.aeris-sidebar__brand')?.textContent).toBe('Workspace');
    expect(element.querySelector('.aeris-sidebar__footer')?.textContent).toBe('Account');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/overview');
    expect(element.querySelector('button[aerisSidebarItem]')?.getAttribute('type')).toBe('button');
  });

  it('coordinates icon-only collapse and controlled nested group state without losing accessible names', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('aeris-sidebar')?.hasAttribute('data-reveal-labels')).toBe(false);
    const toggle = root.querySelector('#navigation-toggle') as HTMLButtonElement;
    const groupButton = root.querySelector('.aeris-sidebar__group-toggle') as HTMLButtonElement;
    groupButton.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(root.querySelector('.aeris-sidebar__group-content')?.hasAttribute('hidden')).toBe(true);
    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsed()).toBe(true);
    expect(root.querySelector('nav')?.getAttribute('data-icon-only')).toBe('true');
    expect(root.querySelectorAll('.aeris-sidebar__group-toggle')).toHaveLength(0);
    expect(root.querySelector('.aeris-sidebar__group-content')?.hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('a')?.getAttribute('aria-label')).toBe('Overview');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelector('aeris-sidebar')?.hasAttribute('data-reveal-labels')).toBe(true);
    expect(root.querySelector('.aeris-sidebar__group-content')?.hasAttribute('hidden')).toBe(true);
  });

  it('leaves routing consumer-owned and blocks disabled links before router and click handlers', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);
    const disabled = root.querySelector('a[aria-disabled="true"]') as HTMLAnchorElement;
    expect(disabled.tabIndex).toBe(-1);
    disabled.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.disabledClicks()).toBe(0);
    expect(router.url).toBe('/');
    (root.querySelector('a') as HTMLAnchorElement).click();
    await fixture.whenStable();
    expect(router.url).toBe('/overview');
    expect(root.querySelector('a')?.getAttribute('aria-current')).toBe('page');
  });

  it('composes Drawer for modal mobile focus, Escape dismissal and scroll locking', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    fixture.componentInstance.mode.set('mobile');
    await fixture.whenStable();
    expect(document.querySelector('nav[aria-label="Test navigation"]')).toBeNull();
    const toggle = fixture.nativeElement.querySelector('#navigation-toggle') as HTMLButtonElement;
    (fixture.nativeElement.querySelector('#after') as HTMLButtonElement).focus();
    toggle.click();
    await fixture.whenStable();
    const dialog = document.querySelector('.aeris-drawer__panel') as HTMLElement;
    expect(dialog.tagName).toBe('SECTION');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.querySelectorAll('nav')).toHaveLength(1);
    expect(document.body.style.overflow).toBe('hidden');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.activeElement).toBe(toggle);
  });

  it('closes mobile navigation on normal item activation but preserves it for modified clicks or opt-out', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    const item = document.querySelector('button[aerisSidebarItem]') as HTMLButtonElement;
    item.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    expect(fixture.componentInstance.open()).toBe(true);
    fixture.componentInstance.closeOnNavigate.set(false);
    fixture.detectChanges();
    item.click();
    expect(fixture.componentInstance.open()).toBe(true);
    fixture.componentInstance.closeOnNavigate.set(true);
    fixture.detectChanges();
    item.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('switches to desktop without duplicate navigation or a leaked modal scroll lock', async () => {
    const fixture = TestBed.createComponent(SidebarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    fixture.componentInstance.mode.set('desktop');
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.querySelectorAll('nav[aria-label="Test navigation"]')).toHaveLength(1);
    expect(document.querySelector('.aeris-drawer__panel')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    fixture.destroy();
    expect(document.querySelector('.aeris-drawer__overlay')).toBeNull();
  });
});
