import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AerisAccordion } from '@aeris-ui/core/accordion';
import { AerisButtonDirective } from '@aeris-ui/core/button';
import { AerisInputTextDirective } from '@aeris-ui/core/input-text';
import { AerisAnimateOnScrollDirective } from '@aeris-ui/core/animate-on-scroll';

import { CatalogPreviewComponent } from './catalog-preview.component';
import type { ComponentCategory } from '../../data/component-catalog';

describe('CatalogPreviewComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    });
  });

  const families: readonly { kind: string; category: ComponentCategory; selector: string }[] = [
    { kind: 'select', category: 'Form', selector: 'aeris-select' },
    { kind: 'listbox', category: 'Form', selector: 'aeris-listbox' },
    { kind: 'command-palette', category: 'Overlay', selector: 'aeris-command-palette' },
    { kind: 'split-button', category: 'Button', selector: 'aeris-split-button' },
    { kind: 'table', category: 'Data', selector: 'aeris-table' },
    { kind: 'tabs', category: 'Panel', selector: 'aeris-tabs' },
    { kind: 'menu', category: 'Menu', selector: 'aeris-menu' },
    { kind: 'sidebar', category: 'Menu', selector: 'aeris-sidebar' },
    { kind: 'navbar', category: 'Menu', selector: 'aeris-navbar' },
    { kind: 'carousel', category: 'Media', selector: 'aeris-carousel' },
    { kind: 'avatar', category: 'Misc', selector: 'aeris-avatar' },
    { kind: 'glass', category: 'Utilities', selector: 'aeris-card[aerisGlass]' },
    { kind: 'dialog', category: 'Overlay', selector: 'aeris-dialog' },
    { kind: 'message', category: 'Messages', selector: 'aeris-message' },
    { kind: 'editor', category: 'Form', selector: 'aeris-editor' },
    { kind: 'file-upload', category: 'File', selector: 'aeris-file-upload' },
  ];
  for (const preview of families) {
    it(`defers and renders the real ${preview.kind} scene`, async () => {
      const fixture = TestBed.createComponent(CatalogPreviewComponent);
      fixture.componentRef.setInput('kind', preview.kind);
      fixture.componentRef.setInput('category', preview.category);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector(preview.selector)).toBeNull();
      const blocks = await fixture.getDeferBlocks();
      expect(blocks).toHaveLength(1);
      await blocks[0].render(DeferBlockState.Complete);
      fixture.detectChanges();
      expect(element.querySelector(preview.selector)).not.toBeNull();
    }, 30_000);
  }
  it('renders real Aeris buttons without actionable preview tab stops', () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'button');
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.directive(AerisButtonDirective));
    expect(buttons).toHaveLength(2);
    expect(buttons[1]?.nativeElement.classList.contains('aeris-button--outline')).toBe(true);
    expect(buttons.every((button) => button.nativeElement.tabIndex === -1)).toBe(true);
  });
  it('expands the real Navbar preview only during playback', async () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'navbar');
    fixture.componentRef.setInput('category', 'Menu');
    fixture.detectChanges();
    await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
    fixture.detectChanges();
    const navbar = (fixture.nativeElement as HTMLElement).querySelector('aeris-navbar');
    expect(navbar?.querySelector('nav')?.hidden).toBe(true);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(navbar?.querySelector('nav')?.hidden).toBe(false);
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(navbar?.querySelector('nav')?.hidden).toBe(true);
  });
  it('shows a real icon-only Sidebar and expands the same navigation when activated', async () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'sidebar');
    fixture.componentRef.setInput('category', 'Menu');
    fixture.detectChanges();
    await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const sidebar = element.querySelector('aeris-sidebar');
    expect(sidebar?.hasAttribute('data-icon-only')).toBe(true);
    expect(sidebar?.querySelector('.aeris-sidebar__collapse')?.getAttribute('aria-label')).toBe(
      'Expand navigation',
    );
    expect(sidebar?.querySelectorAll('svg[aerisSidebarIcon]')).toHaveLength(4);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(sidebar?.hasAttribute('data-icon-only')).toBe(false);
    expect(sidebar?.querySelector('.aeris-sidebar__collapse')?.getAttribute('aria-label')).toBe(
      'Collapse navigation',
    );
    expect(sidebar?.textContent).toContain('Workspace');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(sidebar?.hasAttribute('data-icon-only')).toBe(true);
  });

  const hoverScenes: readonly { kind: string; category: ComponentCategory; selector: string }[] = [
    { kind: 'date-picker', category: 'Form', selector: '.aeris-date-picker__panel' },
    { kind: 'color-picker', category: 'Form', selector: '.aeris-color-picker__panel' },
    { kind: 'select', category: 'Form', selector: '.aeris-select__panel' },
    { kind: 'multi-select', category: 'Form', selector: '.aeris-multi-select__panel' },
    { kind: 'auto-complete', category: 'Form', selector: '.aeris-auto-complete__panel' },
    { kind: 'block-ui', category: 'Misc', selector: '.aeris-block-ui__overlay' },
  ];
  for (const scene of hoverScenes) {
    it(`activates and resets the real ${scene.kind} demonstration`, async () => {
      const fixture = TestBed.createComponent(CatalogPreviewComponent);
      fixture.componentRef.setInput('kind', scene.kind);
      fixture.componentRef.setInput('category', scene.category);
      fixture.detectChanges();
      await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.dataset['active']).toBe('false');
      expect(element.querySelector(scene.selector)).toBeNull();
      for (let repeat = 0; repeat < 2; repeat++) {
        fixture.componentRef.setInput('active', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(element.querySelector(scene.selector)).not.toBeNull();
        fixture.componentRef.setInput('active', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(element.querySelector(scene.selector)).toBeNull();
      }
    }, 30_000);
  }

  for (const kind of ['dialog', 'drawer', 'confirm-dialog', 'popover', 'confirm-popup']) {
    it(`keeps the real ${kind} visible before and after hover`, async () => {
      const fixture = TestBed.createComponent(CatalogPreviewComponent);
      fixture.componentRef.setInput('kind', kind);
      fixture.componentRef.setInput('category', 'Overlay');
      fixture.detectChanges();
      await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      const selector =
        '.aeris-dialog__panel,.aeris-drawer__panel,.aeris-popover__panel,.aeris-confirm-popup__panel';
      expect(element.querySelector(selector)).not.toBeNull();
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(element.querySelector(selector)).not.toBeNull();
      fixture.componentRef.setInput('active', false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(element.querySelector(selector)).not.toBeNull();
    }, 30_000);
  }

  it('renders a real read-only Aeris text input', () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'input-text');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.directive(AerisInputTextDirective))
      .nativeElement as HTMLInputElement;
    expect(input.value).toBe('Untitled project');
    expect(input.readOnly).toBe(true);
    expect(input.tabIndex).toBe(-1);
  });

  it('shows three real cards with staggered scroll entrances and resets on hover exit', async () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'animate-on-scroll');
    fixture.componentRef.setInput('category', 'Utilities');
    fixture.detectChanges();
    await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
    fixture.detectChanges();

    const entrances = fixture.debugElement
      .queryAll(By.directive(AerisAnimateOnScrollDirective))
      .map((element) => element.injector.get(AerisAnimateOnScrollDirective));
    expect(entrances).toHaveLength(3);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('aeris-card')).toHaveLength(3);
    expect(entrances.map((entrance) => entrance.animation())).toEqual([
      'slide-start',
      'fade-up',
      'slide-end',
    ]);
    expect(entrances.map((entrance) => entrance.delay())).toEqual([0, 100, 200]);
    expect(entrances.every((entrance) => entrance.disabled() && !entrance.once())).toBe(true);
    for (let repeat = 0; repeat < 2; repeat++) {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();
      expect(entrances.every((entrance) => !entrance.disabled())).toBe(true);
      fixture.componentRef.setInput('active', false);
      fixture.detectChanges();
      expect(entrances.every((entrance) => entrance.disabled())).toBe(true);
    }
  });

  it('uses the real accordion expansion and resets without a timer or loop', () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'accordion');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(AerisAccordion))).not.toBeNull();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[aria-expanded="true"]')).toBeNull();

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(element.querySelectorAll('[aria-expanded="true"]')).toHaveLength(1);
    expect(element.querySelector('[role="region"]')?.textContent).toContain(
      'Everything in one place.',
    );

    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(element.querySelector('[role="region"]')).toBeNull();
  });

  it('replays editor text formatting with the real toolbar state without taking focus', async () => {
    const fixture = TestBed.createComponent(CatalogPreviewComponent);
    fixture.componentRef.setInput('kind', 'editor');
    fixture.componentRef.setInput('category', 'Form');
    fixture.detectChanges();
    await (await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const bold = element.querySelector('[aria-label="Bold"]') as HTMLButtonElement;
    const textbox = element.querySelector('[role="textbox"]') as HTMLElement;
    const focused = document.activeElement;
    await vi.waitFor(() => {
      expect(textbox.textContent).toBe('Make room for better ideas.');
      expect(textbox.querySelector('strong')).toBeNull();
      expect(bold.getAttribute('aria-pressed')).toBe('false');
    });
    for (let repeat = 0; repeat < 2; repeat++) {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();
      await fixture.whenStable();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(textbox.querySelector('strong')?.textContent).toBe('better ideas');
        expect(bold.getAttribute('aria-pressed')).toBe('true');
      });
      fixture.componentRef.setInput('active', false);
      fixture.detectChanges();
      await fixture.whenStable();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(textbox.querySelector('strong')).toBeNull();
        expect(bold.getAttribute('aria-pressed')).toBe('false');
      });
      expect(document.activeElement).toBe(focused);
    }
  });
});
