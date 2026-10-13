import { TestBed } from '@angular/core/testing';
import { AerisCodeBlock, type AerisCodeSource } from '../../../code-block/aeris-code-block';
import { highlightAerisCode } from '../../../code-block/aeris-code-highlight';

describe('AerisCodeBlock', () => {
  const sources: readonly AerisCodeSource[] = [
    { label: 'main.ts', language: 'typescript', code: "const value = 'hello';" },
    { label: 'empty.json', language: 'json', code: '' },
    { label: 'main.html', language: 'html', code: '<button>Run</button>' },
  ];
  const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  afterEach(() => {
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
    vi.useRealTimers();
  });
  function setup(code = 'const answer = 42;\n// keep this comment', language = 'typescript') {
    const fixture = TestBed.createComponent(AerisCodeBlock);
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('language', language);
    fixture.detectChanges();
    return {
      fixture,
      component: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }
  function clipboard(writeText: (text: string) => Promise<void>) {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  }

  it('renders semantic, highlighted source text in a named focusable region', async () => {
    const { fixture, element } = setup();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector('pre')?.getAttribute('role')).toBe('region');
    expect(element.querySelector('pre')?.getAttribute('tabindex')).toBe('0');
    expect(element.querySelector('pre')?.getAttribute('aria-label')).toBe('Code example');
    expect(element.querySelector('code')?.textContent).toBe(
      'const answer = 42;\n// keep this comment',
    );
    const tokens = [...element.querySelectorAll<HTMLElement>('[data-token="highlighted"]')];
    expect(tokens.some((token) => token.textContent === 'const')).toBe(true);
    expect(tokens.some((token) => token.textContent === '42')).toBe(true);
    expect(
      new Set(tokens.map((token) => token.style.getPropertyValue('--_aeris-code-light'))).size,
    ).toBeGreaterThan(1);
    expect(element.querySelector('[role="tablist"]')).toBeNull();
  });
  it('escapes markup and script content instead of creating executable nodes', async () => {
    const code = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
    const { fixture, element } = setup(code, 'html');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector('code')?.textContent).toBe(code);
    expect(element.querySelector('img, script')).toBeNull();
    expect(element.querySelector('[data-token="highlighted"]')).not.toBeNull();
  });
  it('retains empty sources, unique IDs, and tab/panel relationships', () => {
    const { fixture, component, element } = setup();
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs).toHaveLength(3);
    const panel = element.querySelector('[role="tabpanel"]');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panel?.id);
    component.selectSource(1);
    fixture.detectChanges();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panel?.getAttribute('aria-labelledby')).toBe(tabs[1].id);
    expect(panel?.textContent).toBe('');
    const second = setup();
    expect(second.element.querySelector('pre')?.id).not.toBe(panel?.id);
  });
  it('moves focus and activates source tabs with arrows, Home, and End', () => {
    const { fixture, element } = setup();
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();
    const tabs = [...element.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs[2]);
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs[0]);
  });
  it('reverses arrow navigation in RTL without changing source direction', () => {
    const { fixture, element } = setup();
    fixture.componentRef.setInput('sources', sources);
    element.style.direction = 'rtl';
    fixture.detectChanges();
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tabs[1]);
    expect(getComputedStyle(element.querySelector('pre') as HTMLElement).direction).toBe('ltr');
  });
  it('supports controlled selection, input changes, and invalid indices', () => {
    const { fixture, component, element } = setup();
    fixture.componentRef.setInput('sources', sources);
    fixture.componentRef.setInput('activeSource', 2);
    fixture.detectChanges();
    expect(element.querySelector('code')?.textContent).toBe(sources[2].code);
    component.selectSource(-1);
    expect(component.activeSource()).toBe(2);
    const changed = vi.fn();
    component.activeSource.subscribe(changed);
    component.selectSource(0);
    fixture.detectChanges();
    expect(changed).toHaveBeenCalledWith(0);
    fixture.componentRef.setInput('sources', []);
    fixture.detectChanges();
    expect(element.querySelector('[role="tablist"]')).toBeNull();
  });
  it('adds decorative numbers and emphasized lines without modifying tokens', () => {
    const { fixture, element } = setup('first\nsecond\nthird', 'text');
    fixture.componentRef.setInput('lineNumbers', true);
    fixture.componentRef.setInput('highlightLines', [2, 99, -1]);
    fixture.detectChanges();
    expect(
      [...element.querySelectorAll('.aeris-code-block__number')].map((node) => node.textContent),
    ).toEqual(['1', '2', '3']);
    expect(element.querySelectorAll('.aeris-code-block__number[aria-hidden="true"]')).toHaveLength(
      3,
    );
    expect(element.querySelectorAll('[data-highlighted="true"]')).toHaveLength(1);
  });
  it('supports wrapping, explicit heights, custom labels, and plain text', () => {
    const { fixture, element } = setup();
    fixture.componentRef.setInput('wrap', true);
    fixture.componentRef.setInput('maxHeight', '10rem');
    fixture.componentRef.setInput('tabSize', 4);
    fixture.componentRef.setInput('label', 'example.ts');
    fixture.componentRef.setInput('highlight', false);
    fixture.detectChanges();
    expect(element.getAttribute('data-wrap')).toBe('true');
    expect(element.style.getPropertyValue('--_aeris-code-block-max-height')).toBe('10rem');
    expect(element.style.getPropertyValue('--aeris-code-block-tab-size')).toBe('4');
    expect(element.querySelector('.aeris-code-block__label')?.textContent).toBe('example.ts');
    expect(element.querySelector('[data-token="highlighted"]')).toBeNull();
  });
  it('copies the exact raw source and announces successful completion', async () => {
    vi.useFakeTimers();
    const code = 'one\r\ntwo\tthree\n';
    const writeText = vi.fn().mockResolvedValue(undefined);
    clipboard(writeText);
    const { fixture, component, element } = setup(code, 'text');
    fixture.componentRef.setInput('lineNumbers', true);
    fixture.detectChanges();
    const copied = vi.fn();
    component.copied.subscribe(copied);
    expect(await component.copy()).toBe(true);
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith(code);
    expect(copied).toHaveBeenCalledWith({ code, language: 'text', index: 0 });
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Code copied');
    vi.advanceTimersByTime(1800);
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('');
  });
  it('reports failures without throwing and retains manual copy access', async () => {
    clipboard(vi.fn().mockRejectedValue(new Error('Permission denied')));
    const { fixture, component, element } = setup();
    const failed = vi.fn();
    component.copyError.subscribe(failed);
    expect(await component.copy()).toBe(false);
    fixture.detectChanges();
    expect(failed).toHaveBeenCalled();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Unable to copy');
    expect(element.querySelector('code')?.textContent).toContain('const answer');
  });
  it('does not copy when copyable is false', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    clipboard(writeText);
    const { fixture, component, element } = setup();
    fixture.componentRef.setInput('copyable', false);
    fixture.detectChanges();
    expect(await component.copy()).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
    expect(element.querySelector('.aeris-code-block__copy')).toBeNull();
  });
  it('does not announce stale copy results on a different source or after destruction', async () => {
    let complete: (() => void) | undefined;
    clipboard(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    const { fixture, component, element } = setup();
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();
    const pending = component.copy();
    component.selectSource(1);
    fixture.detectChanges();
    complete?.();
    await pending;
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('');
    const second = component.copy();
    fixture.destroy();
    complete?.();
    expect(await second).toBe(true);
  });
});

describe('CodeBlock syntax coloring', () => {
  it.each(['html', 'typescript', 'javascript', 'css', 'scss', 'json', 'shell', 'text', 'unknown'])(
    'preserves all source characters for %s',
    async (language) => {
      const code = '/* first\nsecond */\r\nconst name = "hello";\n<tag>{{ value }}</tag>\n';
      const lines = await highlightAerisCode(code, language);
      expect(
        lines.map((line) => line.tokens.map((token) => token.text).join('') + line.ending).join(''),
      ).toBe(code);
    },
  );
  it('carries multiline comments across line boundaries and supports aliases', async () => {
    const lines = await highlightAerisCode('/* first\nsecond */\nconst value = 2;', 'TS');
    expect(lines[0].tokens[0].light).toBeTruthy();
    expect(lines[0].tokens[0].light).toBe(lines[1].tokens[0].light);
    expect(
      lines[2].tokens.some(
        (token) => token.text === 'const' && token.light !== lines[0].tokens[0].light,
      ),
    ).toBe(true);
  });
  it('uses bounded highlighting for oversized source', async () => {
    const lines = await highlightAerisCode('x'.repeat(100_001), 'typescript');
    expect(lines[0].tokens).toEqual([{ text: 'x'.repeat(100_001) }]);
  });
});
