import { buildAngularDemoSources } from './demo-code';
import { DOC_EXAMPLE_CODE } from './generated-example-code';

describe('Angular demo code imports', () => {
  it('imports only the native Select directive for native consumer examples', () => {
    const sources = buildAngularDemoSources({
      anchor: 'select-native-example',
      title: 'Native Select',
      template: '<select aerisNativeSelect controlSize="sm"><option>Design</option></select>',
    });
    expect(sources[0]?.code).toContain("from '@aeris-ui/core/select/native'");
    expect(sources[0]?.code).not.toContain("from '@aeris-ui/core/select';");
    expect(sources[0]?.code).toContain('imports: [AerisNativeSelect]');
  });
  it('imports the native keyboard hint family for consumer examples', () => {
    const sources = buildAngularDemoSources({
      anchor: 'kbd-example',
      title: 'Keyboard hint',
      template: '<kbd aerisKbd size="sm">Escape</kbd>',
    });
    expect(sources[0]?.code).toContain("from '@aeris-ui/core/kbd'");
    expect(sources[0]?.code).toContain('imports: [AerisKbdModule]');
  });
  it('imports the keyboard family for standalone key symbols and content parts', () => {
    for (const template of [
      '<span aerisKbdKey="enter"></span>',
      '<span [aerisKbdKey]="key"></span>',
      '<span aerisKbdContent>K</span>',
    ]) {
      const sources = buildAngularDemoSources({ anchor: 'kbd-part', title: 'Key part', template });
      expect(sources[0]?.code).toContain("from '@aeris-ui/core/kbd'");
      expect(sources[0]?.code).toContain('imports: [AerisKbdModule]');
    }
  });
  it('keeps generated form signals before the fields initialized from them', () => {
    const code = DOC_EXAMPLE_CODE['chip-group-forms'];
    expect(code).toContain('readonly groupData');
    expect(code.indexOf('readonly groupData')).toBeLessThan(code.indexOf('readonly groupFields'));
  });
  it('imports group companions and Signal Forms custom validators', () => {
    const sources = buildAngularDemoSources({
      anchor: 'chip-group-validation',
      title: 'Chip group validation',
      template: '<aeris-chip-group selectionMode="multiple" [formField]="fields.choices" />',
      classCode: `readonly data = signal({ choices: [] as string[] });
readonly fields = form(this.data, (path) => validate(path.choices, ({ value }) =>
  value().length ? undefined : { kind: 'required' }));`,
    });
    const code = sources[0]?.code ?? '';
    expect(code).toContain('AerisChipModule');
    expect(code).toContain('validate');
    expect(code).toContain('FormField, form, validate');
    expect(code).not.toContain('AerisChipGroup');
  });
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
  it('uses one Sidebar family import for native items, groups, slots and the toggle', () => {
    const sources = buildAngularDemoSources({
      anchor: 'sidebar-basic',
      title: 'Sidebar',
      template:
        '<button [aerisSidebarToggle]="nav">Navigation</button><aeris-sidebar #nav [(collapsed)]="collapsed"><aeris-sidebar-group label="Workspace"><a aerisSidebarItem href="/home" label="Home"><span aerisSidebarIcon></span></a></aeris-sidebar-group></aeris-sidebar>',
      classCode: 'readonly collapsed = signal(false);',
    });
    const code = sources.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain("import { AerisSidebarModule } from '@aeris-ui/core/sidebar';");
    expect(code).toContain('imports: [AerisSidebarModule]');
    expect(code).toContain('readonly collapsed = signal(false)');
    expect(code).toContain('Component, signal');
  });
  it('uses one Navbar family import for native links, disclosures, slots and the toggle', () => {
    const sources = buildAngularDemoSources({
      anchor: 'navbar-basic',
      title: 'Navbar',
      template:
        '<aeris-navbar mode="mobile" [(expanded)]="expanded"><strong aerisNavbarBrand>Workspace</strong><div aerisNavbarLinks><aeris-navbar-dropdown label="Resources"><a aerisNavbarItem href="/guide">Guide</a></aeris-navbar-dropdown></div><button aerisNavbarToggle><span aerisNavbarIcon></span></button></aeris-navbar>',
      classCode: 'readonly expanded = signal(false);',
    });
    const code = sources.find((source) => source.language === 'TypeScript')?.code ?? '';
    expect(code).toContain("import { AerisNavbarModule } from '@aeris-ui/core/navbar';");
    expect(code).toContain('imports: [AerisNavbarModule]');
    expect(code).toContain('readonly expanded = signal(false)');
  });
});
