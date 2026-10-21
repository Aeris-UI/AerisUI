import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { COMPONENT_CATALOG } from '../data/component-catalog';
import { ComponentCatalogPage } from './component-catalog.page';
import { CatalogFormPreviewComponent } from '../shared/catalog/catalog-form-preview.component';

describe('ComponentCatalogPage previews', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    });
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(hover: hover)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  async function setup() {
    const fixture = TestBed.createComponent(ComponentCatalogPage);
    fixture.detectChanges();
    const blocks = await fixture.getDeferBlocks();
    return { fixture, blocks, element: fixture.nativeElement as HTMLElement };
  }

  it('previews autocomplete with a partial query and the first matching suggestion active', () => {
    const fixture = TestBed.createComponent(CatalogFormPreviewComponent);
    fixture.componentRef.setInput('kind', 'auto-complete');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('input')?.value).toBe('Des');
    expect(element.querySelectorAll('[role="option"]')).toHaveLength(0);

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    const options = element.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(2);
    expect(options[0].textContent?.trim()).toBe('Design systems');
    expect(options[1].textContent?.trim()).toBe('Design tokens');
    expect(options[0].getAttribute('data-active')).toBe('true');
    expect(options[1].hasAttribute('data-active')).toBe(false);
    expect(element.querySelector('input')?.value).toBe('Des');

    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(element.querySelectorAll('[role="option"]')).toHaveLength(0);
    expect(element.querySelector('input')?.value).toBe('Des');
  });

  it('keeps exactly one documentation link per component and defers real previews', async () => {
    const { fixture, blocks, element } = await setup();
    expect(blocks).toHaveLength(COMPONENT_CATALOG.length);
    expect(element.querySelector('app-catalog-preview')).toBeNull();
    expect(element.querySelectorAll('a[href^="/components/"]')).toHaveLength(
      COMPONENT_CATALOG.length,
    );

    await Promise.all(blocks.map((block) => block.render(DeferBlockState.Complete)));
    fixture.detectChanges();
    expect(element.querySelectorAll('app-catalog-preview')).toHaveLength(COMPONENT_CATALOG.length);
    for (const card of element.querySelectorAll('.catalog-preview-card')) {
      expect(card.tagName).toBe('AERIS-CARD');
      expect(card.querySelector('[aerisCardMedia]')).not.toBeNull();
      expect(card.querySelector('[aerisCardTitle]')).not.toBeNull();
      expect(card.querySelector('.catalog-preview-title')?.textContent?.trim()).toBe(
        card.querySelector('a')?.textContent?.trim(),
      );
      expect(card.querySelector('.catalog-preview-copy')).toBeNull();
      expect(card.querySelector('.catalog-preview-scene')?.hasAttribute('inert')).toBe(true);
      expect(card.querySelector('.catalog-preview-scene')?.getAttribute('aria-hidden')).toBe(
        'true',
      );
      expect(card.querySelector('a')?.querySelector('button, input')).toBeNull();
    }
  });

  it('expands on keyboard focus and resets when focus leaves', async () => {
    const { fixture, blocks, element } = await setup();
    await Promise.all(blocks.map((block) => block.render(DeferBlockState.Complete)));
    const card = element
      .querySelector('a[href="/components/accordion"]')
      ?.closest('.catalog-preview-card');
    card?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(card?.querySelector('[aria-expanded="true"]')).not.toBeNull();
    expect(card?.querySelector('.aeris-card')?.getAttribute('data-variant')).toBe('elevated');
    card?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(card?.querySelector('[aria-expanded="true"]')).toBeNull();
    expect(card?.querySelector('.aeris-card')?.getAttribute('data-variant')).toBe('filled');
  });

  it('keeps the accordion static when reduced motion is requested', async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { fixture, blocks, element } = await setup();
    await Promise.all(blocks.map((block) => block.render(DeferBlockState.Complete)));
    const card = element
      .querySelector('a[href="/components/accordion"]')
      ?.closest('.catalog-preview-card');
    card?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(card?.querySelector('[aria-expanded="true"]')).toBeNull();
  });

  it('does not start hover previews for touch pointers', async () => {
    const { fixture, blocks, element } = await setup();
    await Promise.all(blocks.map((block) => block.render(DeferBlockState.Complete)));
    const card = element
      .querySelector('a[href="/components/accordion"]')
      ?.closest('.catalog-preview-card');
    const event = new Event('pointerenter');
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    card?.dispatchEvent(event);
    fixture.detectChanges();
    expect(card?.querySelector('[aria-expanded="true"]')).toBeNull();
  });

  it('filters preview cards with the existing catalog search and category controls', async () => {
    const { fixture, element } = await setup();
    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'InputText';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelectorAll('.catalog-preview-card')).toHaveLength(1);
    expect(element.querySelector('.catalog-preview-card a')?.getAttribute('href')).toBe(
      '/components/input-text',
    );

    search.value = 'no-such-component';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelectorAll('.catalog-preview-card')).toHaveLength(0);
    expect(element.querySelector('.catalog-empty')).not.toBeNull();

    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    const menuCategory = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.catalog-controls button'),
    ).find((button) => button.textContent?.trim() === 'Menu');
    expect(menuCategory).toBeDefined();
    menuCategory?.click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.catalog-preview-card')).toHaveLength(8);
    expect(element.querySelector('a[href="/components/navbar"]')).not.toBeNull();
    expect(element.querySelector('a[href="/components/sidebar"]')).not.toBeNull();
    expect(element.querySelector('a[href="/components/menu"]')).not.toBeNull();
  });
});
