import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComponentPageHeaderComponent } from './component-page-header.component';
import { COMPONENT_CATALOG } from '../../../data/component-catalog';

describe('ComponentPageHeaderComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  beforeEach(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    }),
  );
  afterEach(() => {
    vi.restoreAllMocks();
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  function createHeader(title = 'InputText') {
    const fixture = TestBed.createComponent(ComponentPageHeaderComponent);
    fixture.componentRef.setInput('category', 'Form');
    fixture.componentRef.setInput('title', title);
    fixture.componentRef.setInput('description', 'Text field.');
    fixture.detectChanges();
    return fixture;
  }

  it('links to implementation source and the canonical Markdown without fetching eagerly', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const fixture = createHeader();
    const element = fixture.nativeElement as HTMLElement;
    const source = element.querySelector<HTMLAnchorElement>('a[target="_blank"]');
    expect(source?.href).toBe(
      'https://github.com/Aeris-UI/AerisUI/tree/main/projects/aeris-ui/input-text',
    );
    expect(source?.rel).toBe('noopener noreferrer');
    expect(element.querySelector('.markdown-link')?.getAttribute('href')).toBe(
      '/ai/22/components/input-text.md',
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('copies the complete canonical document, including API and accessibility', async () => {
    const markdown = '# InputText\n\n## API\n\n## Accessibility';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(markdown));
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);
    const fixture = createHeader();
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith(markdown);
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')?.textContent,
    ).toContain('copied as Markdown');
    fixture.destroy();
  });

  it('announces fetch failure and keeps a manual fallback link available', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Missing', { status: 404 }));

    const fixture = createHeader();
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')?.textContent,
    ).toContain('Unable to copy');
    expect((fixture.nativeElement as HTMLElement).querySelector('.markdown-link')).not.toBeNull();
  });

  it('rejects SPA fallback HTML rather than copying it as documentation', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<!doctype html>'));
    const writeText = vi.fn();
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);
    const fixture = createHeader();
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(writeText).not.toHaveBeenCalled();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')?.textContent,
    ).toContain('Unable to copy');
  });

  it('does not show broken actions for an unknown component', () => {
    const fixture = createHeader('Unknown component');
    expect((fixture.nativeElement as HTMLElement).querySelector('.page-actions')).toBeNull();
  });

  it('resolves source and Markdown links for every catalog component', () => {
    for (const item of COMPONENT_CATALOG) {
      const fixture = createHeader(item.name);
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('.markdown-link')?.getAttribute('href')).toBe(
        `/ai/22/components/${item.slug}.md`,
      );
      expect(element.querySelector('a[target="_blank"]')?.getAttribute('href')).toBe(
        `https://github.com/Aeris-UI/AerisUI/tree/main/projects/aeris-ui/${item.slug}`,
      );
      fixture.destroy();
    }
  });

  it('aborts pending loads on destruction and does not copy into a different page', async () => {
    let resolveResponse: ((value: Response) => void) | undefined;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve;
        }),
    );
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    const fixture = createHeader();
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    const signal = fetchSpy.mock.calls[0]?.[1]?.signal;
    fixture.destroy();
    expect(signal?.aborted).toBe(true);
    resolveResponse?.(new Response('# InputText'));
    await Promise.resolve();
    await Promise.resolve();
    expect(writeText).not.toHaveBeenCalled();
  });
});
