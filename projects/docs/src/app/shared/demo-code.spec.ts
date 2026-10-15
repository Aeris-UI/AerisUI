import { buildAngularDemoSources } from './demo-code';

describe('Angular demo code imports', () => {
  it('includes native-element queries used for consumer focus recovery', () => {
    const sources = buildAngularDemoSources({
      anchor: 'focus-recovery',
      title: 'Focus recovery',
      template: '<button #restore aerisButton type="button">Restore</button>',
      classCode: `private readonly restore = viewChild('restore', { read: ElementRef<HTMLButtonElement> });
protected focusRestore(): void { this.restore()?.nativeElement.focus(); }`,
    });
    const code = sources.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain("import { Component, ElementRef, viewChild } from '@angular/core';");
    expect(code).toContain('ElementRef<HTMLButtonElement>');
  });

  it('does not add native-element query imports to ordinary chip examples', () => {
    const sources = buildAngularDemoSources({
      anchor: 'plain-chip',
      title: 'Plain chip',
      template: '<aeris-chip label="Angular" />',
    });
    expect(sources[0]?.code).not.toContain('ElementRef');
    expect(sources[0]?.code).not.toContain('viewChild');
  });
});
