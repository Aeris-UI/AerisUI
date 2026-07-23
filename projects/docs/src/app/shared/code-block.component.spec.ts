import { TestBed } from '@angular/core/testing';

import { CodeBlockComponent, type CodeSource } from './code-block.component';

describe('CodeBlockComponent', () => {
  const sources: readonly CodeSource[] = [
    {
      language: 'Shell',
      label: 'Pinned alpha (recommended)',
      code: 'npm install @aeris-ui/core@22.0.0-alpha.1',
    },
    {
      language: 'Shell',
      label: 'Repository tarball',
      code: 'npm install ./aeris-ui-core.tgz',
    },
  ];

  it('keeps language tabs and the copy action in separate header regions', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const header = element.querySelector('.code-block__header');
    const toolbar = header?.querySelector('.code-block__toolbar');
    const copy = header?.querySelector('.code-block__copy');

    expect(toolbar?.textContent).toContain('Pinned alpha (recommended)');
    expect(copy?.getAttribute('aria-label')).toBe('Copy code');
    expect(copy?.parentElement).toBe(header);
  });

  it('exposes a keyboard-focusable code panel and switches its source', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    tabs[1]?.click();
    fixture.detectChanges();

    const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(panel?.getAttribute('tabindex')).toBe('0');
    expect(panel?.getAttribute('aria-description')).toContain('Scroll horizontally');
    expect(panel?.textContent).toContain('aeris-ui-core.tgz');
  });
});
