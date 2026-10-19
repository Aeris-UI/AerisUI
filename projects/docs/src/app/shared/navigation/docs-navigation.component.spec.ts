import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DocsNavigationComponent } from './docs-navigation.component';

@Component({ template: '' })
class Destination {}

describe('DocsNavigationComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Destination },
          { path: 'components/:slug', component: Destination },
          { path: 'guides/:id', component: Destination },
          { path: 'support', component: Destination },
        ]),
      ],
    }),
  );

  it('uses one real Sidebar with native links, groups and consumer-owned routing', async () => {
    const fixture = TestBed.createComponent(DocsNavigationComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('aeris-sidebar')).toHaveLength(1);
    expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Documentation');
    expect(root.querySelector('[role="menu"]')).toBeNull();
    expect(
      root.querySelector('a[href="/components"]')?.classList.contains('aeris-sidebar__item'),
    ).toBe(true);
    expect(root.querySelectorAll('aeris-sidebar-group').length).toBeGreaterThan(4);
    expect(root.querySelector('a[href="/components/input-text"]')).toBeNull();
  });

  it('expands the active route group and keeps disclosure state consumer-controlled', async () => {
    const fixture = TestBed.createComponent(DocsNavigationComponent);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/components/input-text');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const link = root.querySelector('a[href="/components/input-text"]');
    expect(link?.getAttribute('aria-current')).toBe('page');
    const group = link?.closest('aeris-sidebar-group');
    const toggle = group?.querySelector('button') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('a[href="/components/input-text"]')).toBeNull();
    toggle.click();
    await fixture.whenStable();
    expect(
      root.querySelector('a[href="/components/input-text"]')?.getAttribute('aria-current'),
    ).toBe('page');
    await router.navigateByUrl('/guides/theming');
    await fixture.whenStable();
    expect(root.querySelector('a[href="/guides/theming"]')?.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps the landing page drawer closed and footer links available after opening', async () => {
    const fixture = TestBed.createComponent(DocsNavigationComponent);
    fixture.componentRef.setInput('landing', true);
    await fixture.whenStable();
    expect(fixture.componentInstance.sidebar()?.mobile()).toBe(true);
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    const dialog = document.querySelector('[role="dialog"][aria-label="Documentation"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelectorAll('nav[aria-label="Documentation"]')).toHaveLength(1);
    const support = dialog?.querySelector('a[href="/support"]') as HTMLAnchorElement;
    expect(support).not.toBeNull();
    support.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
