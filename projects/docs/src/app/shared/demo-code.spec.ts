import { buildAngularDemoSources } from './demo-code';

describe('Angular demo code imports', () => {
  it('includes the optional Button forms import only for classic toggle fields', () => {
    const classic = buildAngularDemoSources({
      anchor: 'toggle-classic',
      title: 'Classic toggle',
      template: '<button aerisButton aerisButtonToggle [formControl]="control">Enabled</button>',
      classCode: 'readonly control = new FormControl(false);',
    });
    const code = classic.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain("from '@aeris-ui/core/button/forms'");
    expect(code).toContain('imports: [AerisButtonForms, ReactiveFormsModule]');
    expect(code).not.toContain("from '@aeris-ui/core/button';");
    const signal = buildAngularDemoSources({
      anchor: 'toggle-signal',
      title: 'Signal toggle',
      template: '<button aerisButton aerisButtonToggle [(checked)]="enabled">Enabled</button>',
      classCode: 'readonly enabled = signal(false);',
    });
    expect(signal.find((source) => source.language === 'TypeScript')?.code).not.toContain(
      'button/forms',
    );
  });
  it('includes destruction guards for asynchronous consumer examples', () => {
    const sources = buildAngularDemoSources({
      anchor: 'async-action',
      title: 'Async action',
      template: '<button aerisButton type="button" (click)="run()">Run</button>',
      classCode:
        'private readonly destroyRef = inject(DestroyRef);\nprotected async run(): Promise<void> { await Promise.resolve(); if (this.destroyRef.destroyed) return; }',
    });
    const code = sources.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain('DestroyRef');
    expect(code).toContain('inject');
    expect(code).toContain("from '@angular/core'");
    expect(code).not.toContain('imports: [DestroyRef');
  });
  it('imports Signal Forms bindings and editable date pickers as Angular declarations', () => {
    const sources = buildAngularDemoSources({
      anchor: 'signal-date',
      title: 'Signal date',
      template: '<aeris-date-picker editable [formField]="fields.date" />',
      classCode:
        'readonly data = signal<{ date: Date | null }>({ date: null });\nreadonly fields = form(this.data, (path) => required(path.date));',
    });
    const code = sources[0]?.code ?? '';
    expect(code).toContain("from '@angular/forms/signals'");
    expect(code).toContain('imports: [AerisDatePicker, FormField]');
    expect(code).toContain('FormField, form, required');
  });
  it('imports chart presentation helpers as values, not Angular declarations', () => {
    const sources = buildAngularDemoSources({
      anchor: 'area-chart',
      title: 'Area chart',
      template: '<aeris-chart type="line" [data]="data" [plugins]="plugins" />',
      classCode: `protected readonly data: AerisChartData = { datasets: [{ data: [1, 2], fill: true, backgroundColor: createAerisChartAreaFill('#2563eb') }] };\nprotected readonly plugins = [createAerisChartComparisonGuide()];`,
    });
    const code = sources.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain('createAerisChartAreaFill, createAerisChartComparisonGuide');
    expect(code).toContain('imports: [AerisChartModule]');
    expect(code).not.toContain('imports: [AerisChartModule, createAeris');
  });
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
