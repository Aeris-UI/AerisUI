import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import {
  AerisNavbar,
  AerisNavbarDropdown,
  AerisNavbarModule,
  type AerisNavbarMode,
} from '../../../navbar/aeris-navbar';

@Component({
  imports: [AerisNavbarModule, RouterLink],
  template: `
    <aeris-navbar
      #navbar
      [mode]="mode()"
      [(expanded)]="expanded"
      [breakpoint]="breakpoint()"
      [alignment]="alignment()"
      [closeOnNavigate]="closeOnNavigate()"
      [closeOnOutsideClick]="outside()"
      [sticky]="sticky()"
      [variant]="variant()"
      ariaLabel="Test navigation"
      [ariaLabelledBy]="labelledBy()"
    >
      <strong aerisNavbarBrand>Workspace</strong>
      <div aerisNavbarLinks>
        <a aerisNavbarItem routerLink="/overview" active>Overview</a>
        <a
          aerisNavbarItem
          routerLink="/disabled"
          [disabled]="disabled()"
          tabindex="2"
          (click)="clicks.set(clicks() + 1)"
          >Disabled</a
        >
        <button aerisNavbarItem [disabled]="disabled()">Action</button>
        <a aerisNavbarItem href="/new-tab" target="_blank">New tab</a>
        <aeris-navbar-dropdown #disclosure label="Resources" [(expanded)]="disclosed">
          <button aerisNavbarItem>Guide</button>
        </aeris-navbar-dropdown>
      </div>
      <div aerisNavbarActions><button id="account">Account</button></div>
      @if (customToggle()) {
        <button aerisNavbarToggle><span aerisNavbarIcon>+</span></button>
      }
    </aeris-navbar>
    <button id="after" (click)="outsideClicks.update((count) => count + 1)">After</button>
  `,
})
class NavbarHost {
  readonly navbar = viewChild.required<AerisNavbar>('navbar');
  readonly disclosure = viewChild.required<AerisNavbarDropdown>('disclosure');
  readonly mode = signal<AerisNavbarMode>('desktop');
  readonly expanded = signal(false);
  readonly disclosed = signal(false);
  readonly closeOnNavigate = signal(true);
  readonly outside = signal(true);
  readonly customToggle = signal(false);
  readonly disabled = signal(true);
  readonly sticky = signal(false);
  readonly variant = signal<'standard' | 'floating' | 'transparent'>('standard');
  readonly labelledBy = signal('');
  readonly breakpoint = signal<number | 'auto'>(768);
  readonly alignment = signal<'start' | 'center' | 'end'>('center');
  readonly clicks = signal(0);
  readonly outsideClicks = signal(0);
}

@Component({
  imports: [AerisNavbarModule],
  template: `
    <aeris-navbar mode="desktop">
      <div aerisNavbarLinks>
        <button aerisNavbarItem [active]="selected() === 'overview'">Overview</button>
        <aeris-navbar-dropdown #resources label="Resources">
          <button aerisNavbarItem [active]="selected() === 'guide'">Guide</button>
          <aeris-navbar-dropdown #nested label="More">
            <button aerisNavbarItem [active]="selected() === 'support'" [disabled]="disabled()">
              Support
            </button>
          </aeris-navbar-dropdown>
        </aeris-navbar-dropdown>
      </div>
    </aeris-navbar>
  `,
})
class ActiveNavbarHost {
  readonly selected = signal('overview');
  readonly disabled = signal(false);
  readonly resources = viewChild.required<AerisNavbarDropdown>('resources');
  readonly nested = viewChild.required<AerisNavbarDropdown>('nested');
}

describe('AerisNavbar', () => {
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
  afterEach(() => vi.unstubAllGlobals());

  it('measures content fit in both modes and rechecks hidden navigation without layout oscillation', async () => {
    const observers: { callback: () => void; elements: Set<Element> }[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        private readonly entry: { callback: () => void; elements: Set<Element> };
        constructor(callback: () => void) {
          this.entry = { callback, elements: new Set() };
          observers.push(this.entry);
        }
        observe(element: Element) {
          this.entry.elements.add(element);
        }
        disconnect() {
          this.entry.elements.clear();
        }
      },
    );
    const fixture = TestBed.createComponent(NavbarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const bar = root.querySelector<HTMLElement>('.aeris-navbar__bar');
    const navigation = root.querySelector<HTMLElement>('nav');
    const brand = root.querySelector<HTMLElement>('[aerisNavbarBrand]');
    const actions = root.querySelector<HTMLElement>('[aerisNavbarActions]');
    expect(bar && navigation && brand && actions).toBeTruthy();
    let available = 600;
    let content = 200;
    Object.defineProperty(bar, 'clientWidth', { get: () => available });
    Object.defineProperty(navigation, 'offsetWidth', { get: () => content });
    Object.defineProperty(brand, 'offsetWidth', { get: () => 80 });
    Object.defineProperty(actions, 'offsetWidth', { get: () => 40 });
    if (bar) {
      bar.style.padding = '0px';
      bar.style.columnGap = '0px';
    }
    fixture.componentInstance.breakpoint.set('auto');
    fixture.componentInstance.mode.set('auto');
    await fixture.whenStable();
    expect(fixture.componentInstance.navbar().mobile()).toBe(false);
    (root.querySelector('a') as HTMLAnchorElement).focus();
    available = 300;
    observers.find((observer) => bar && observer.elements.has(bar))?.callback();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.navbar().mobile()).toBe(true);
    });
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelector('.aeris-navbar__toggle'));
    available = 600;
    observers.find((observer) => bar && observer.elements.has(bar))?.callback();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.navbar().mobile()).toBe(false);
    });
    content = 500;
    root.querySelector('a')?.append(' with a longer label');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.navbar().mobile()).toBe(true);
    });
    content = 200;
    root.querySelector('a')?.append(' changed');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.navbar().mobile()).toBe(false);
    });
    expect(root.querySelector('[data-measuring]')).toBeNull();
    available = 340;
    observers.find((observer) => bar && observer.elements.has(bar))?.callback();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.navbar().mobile()).toBe(true);
    });
    fixture.componentInstance.alignment.set('start');
    await fixture.whenStable();
    expect(fixture.componentInstance.navbar().mobile()).toBe(false);
    fixture.destroy();
    expect(observers.every((observer) => observer.elements.size === 0)).toBe(true);
  });

  it('opens nested flyouts with directional keys and returns focus without closing the parent', async () => {
    const fixture = TestBed.createComponent(ActiveNavbarHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.resources().expanded.set(true);
    await fixture.whenStable();
    const resources = document.querySelector<HTMLElement>(
      '.aeris-navbar__dropdown[aria-label="Resources"]',
    );
    const trigger = resources?.querySelector<HTMLButtonElement>('aeris-navbar-dropdown > button');
    expect(trigger).toBeTruthy();
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    const nested = document.querySelector<HTMLElement>(
      '.aeris-navbar__dropdown[aria-label="More"]',
    );
    expect(host.nested().expanded()).toBe(true);
    expect(nested?.getAttribute('data-aeris-append-to')).toBe('body');
    expect(nested?.hasAttribute('data-inline')).toBe(false);
    expect(document.activeElement?.textContent?.trim()).toBe('Support');
    nested?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(host.nested().expanded()).toBe(false);
    expect(host.resources().expanded()).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('derives dropdown active state from enabled descendants even while closed', async () => {
    const fixture = TestBed.createComponent(ActiveNavbarHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    expect(host.resources().active()).toBe(false);
    host.selected.set('guide');
    await fixture.whenStable();
    expect(host.resources().active()).toBe(true);
    expect(host.nested().active()).toBe(false);
    expect(
      fixture.nativeElement
        .querySelector('.aeris-navbar__dropdown-trigger')
        .hasAttribute('data-active'),
    ).toBe(true);
    host.selected.set('support');
    await fixture.whenStable();
    expect(host.resources().active()).toBe(true);
    expect(host.nested().active()).toBe(true);
    host.resources().expanded.set(true);
    await fixture.whenStable();
    host.resources().close();
    await fixture.whenStable();
    expect(host.resources().active()).toBe(true);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(host.resources().active()).toBe(false);
    expect(host.nested().active()).toBe(false);
    host.selected.set('overview');
    await fixture.whenStable();
    expect(host.resources().active()).toBe(false);
  });

  it('renders a single named native navigation tree and projected brand/actions', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Test navigation');
    expect(root.querySelector('nav')?.hidden).toBe(false);
    expect(root.querySelector('[role="menu"]')).toBeNull();
    expect(root.querySelector('.aeris-navbar__brand')?.textContent).toBe('Workspace');
    expect(root.querySelector('.aeris-navbar__actions')?.textContent).toContain('Account');
    expect(root.querySelector('a')?.getAttribute('aria-current')).toBe('page');
    expect(root.querySelector('button[aerisNavbarItem]')?.getAttribute('type')).toBe('button');
    fixture.componentInstance.labelledBy.set('heading');
    await fixture.whenStable();
    expect(root.querySelector('nav')?.hasAttribute('aria-label')).toBe(false);
    expect(root.querySelector('nav')?.getAttribute('aria-labelledby')).toBe('heading');
  });

  it('controls mobile expansion with one toggle and keeps brand/actions visible', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const toggle = root.querySelector('.aeris-navbar__toggle') as HTMLButtonElement;
    expect(root.querySelector('nav')?.hidden).toBe(true);
    expect(toggle.getAttribute('aria-controls')).toBe(root.querySelector('nav')?.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.querySelector('[aerisInternalIcon="menu"]')).not.toBeNull();
    toggle.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(true);
    expect(root.querySelector('nav')?.hidden).toBe(false);
    expect(toggle.getAttribute('aria-label')).toBe('Close navigation');
    expect(toggle.querySelector('[aerisInternalIcon="close"]')).not.toBeNull();
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    fixture.componentInstance.navbar().close();
    await fixture.whenStable();
    expect(root.querySelector('nav')?.hidden).toBe(true);
    expect(root.querySelector('#account')?.closest('[hidden]')).toBeNull();
  });

  it('supports custom projected toggle artwork without adding a second toggle', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.customToggle.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('.aeris-navbar__toggle')).toHaveLength(1);
    const toggle = root.querySelector('button[aerisNavbarToggle]') as HTMLButtonElement;
    expect(toggle.querySelector('[aerisNavbarIcon]')?.getAttribute('aria-hidden')).toBe('true');
    toggle.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(true);
    fixture.componentInstance.mode.set('desktop');
    await fixture.whenStable();
    expect(toggle.hidden).toBe(true);
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(root.querySelector('nav')?.hidden).toBe(false);
  });

  it('closes on Escape and restores focus, including controlled closure from inside navigation', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const item = root.querySelector('a') as HTMLAnchorElement;
    const toggle = root.querySelector('.aeris-navbar__toggle') as HTMLButtonElement;
    item.focus();
    item.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(document.activeElement).toBe(toggle);
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    item.focus();
    fixture.componentInstance.expanded.set(false);
    await fixture.whenStable();
    expect(document.activeElement).toBe(toggle);
  });

  it('preserves routing while preventing disabled links before RouterLink and click handlers', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const disabled = root.querySelector('a[aria-disabled="true"]') as HTMLAnchorElement;
    expect(disabled.tabIndex).toBe(-1);
    expect((root.querySelector('button[aerisNavbarItem]') as HTMLButtonElement).disabled).toBe(
      true,
    );
    disabled.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/');
    expect(fixture.componentInstance.clicks()).toBe(0);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    expect(disabled.tabIndex).toBe(2);
    (root.querySelector('a') as HTMLAnchorElement).click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/overview');
  });

  it('moves focus into desktop navigation when the focused mobile toggle disappears', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    (root.querySelector('.aeris-navbar__toggle') as HTMLButtonElement).focus();
    fixture.componentInstance.mode.set('desktop');
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelector('a'));
    fixture.componentInstance.navbar().toggle();
    expect(fixture.componentInstance.expanded()).toBe(false);
  });

  it('makes navigation dismissal configurable and preserves modified or new-tab activations', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.expanded.set(true);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const action = root.querySelector('button[aerisNavbarItem]') as HTMLButtonElement;
    action.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    root.querySelector('a[target]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(true);
    fixture.componentInstance.closeOnNavigate.set(false);
    await fixture.whenStable();
    action.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(true);
    fixture.componentInstance.closeOnNavigate.set(true);
    await fixture.whenStable();
    action.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
  });

  it('dismisses on committed outside clicks only when enabled and cleans listeners on destruction', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector('#account')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.expanded()).toBe(true);
    root.querySelector('#after')?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(fixture.componentInstance.expanded()).toBe(true);
    root.querySelector('#after')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(fixture.componentInstance.outsideClicks()).toBe(1);
    fixture.componentInstance.outside.set(false);
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    root.querySelector('#after')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.expanded()).toBe(true);
    fixture.destroy();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.expanded()).toBe(true);
  });

  it('observes component width, returns focus when collapsing and resets expansion on desktop', async () => {
    let update: (() => void) | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          update = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('auto');
    const root = fixture.nativeElement as HTMLElement;
    let width = 900;
    Object.defineProperty(root.querySelector('aeris-navbar'), 'clientWidth', { get: () => width });
    await fixture.whenStable();
    expect(fixture.componentInstance.navbar().mobile()).toBe(false);
    (root.querySelector('a') as HTMLAnchorElement).focus();
    width = 400;
    update?.();
    await fixture.whenStable();
    expect(fixture.componentInstance.navbar().mobile()).toBe(true);
    expect(document.activeElement).toBe(root.querySelector('.aeris-navbar__toggle'));
    fixture.componentInstance.navbar().toggle();
    await fixture.whenStable();
    width = 900;
    update?.();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(root.querySelector('nav')?.hidden).toBe(false);
    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });

  it('normalizes nonfinite breakpoints and renders variant/sticky state without JavaScript scrolling', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('auto');
    fixture.componentInstance.breakpoint.set(NaN);
    fixture.componentInstance.sticky.set(true);
    fixture.componentInstance.variant.set('floating');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.navbar().mobile()).toBe(true);
    expect(root.querySelector('aeris-navbar')?.getAttribute('data-sticky')).toBe('true');
    expect(root.querySelector('aeris-navbar')?.getAttribute('data-variant')).toBe('floating');
  });

  it('uses the constrained inner header width when maxWidth is narrower than its host', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    const fixture = TestBed.createComponent(NavbarHost);
    await fixture.whenStable();
    fixture.componentInstance.mode.set('auto');
    const root = fixture.nativeElement as HTMLElement;
    Object.defineProperty(root.querySelector('aeris-navbar'), 'clientWidth', { get: () => 1200 });
    Object.defineProperty(root.querySelector('.aeris-navbar__bar'), 'clientWidth', {
      get: () => 400,
    });
    await fixture.whenStable();
    expect(fixture.componentInstance.navbar().mobile()).toBe(true);
  });

  it('controls dropdowns without native toggle races and closes them before mobile navigation', async () => {
    const fixture = TestBed.createComponent(NavbarHost);
    fixture.componentInstance.mode.set('mobile');
    fixture.componentInstance.expanded.set(true);
    fixture.componentInstance.disclosed.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const dropdown = root.querySelector('aeris-navbar-dropdown') as HTMLElement;
    const trigger = dropdown.querySelector('.aeris-navbar__dropdown-trigger') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(
      dropdown.querySelector('.aeris-navbar__dropdown')?.id,
    );
    dropdown
      .querySelector('.aeris-navbar__dropdown button')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.disclosed()).toBe(false);
    expect(fixture.componentInstance.expanded()).toBe(true);
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.disclosed()).toBe(true);
    trigger.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.disclosed()).toBe(false);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
  });
});
