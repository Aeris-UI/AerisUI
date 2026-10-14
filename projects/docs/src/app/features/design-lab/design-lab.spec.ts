import { TestBed } from '@angular/core/testing';
import { AerisThemeService, provideAeris, resolveAerisTheme } from '@aeris-ui/core/theming';
import { DocsAppearanceService } from '../../shared/appearance/docs-appearance.service';
import { DesignLab } from './design-lab';

describe('DesignLab workflow', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    TestBed.configureTestingModule({
      imports: [DesignLab],
      providers: [provideAeris({ mode: 'light', themeValidation: false })],
    });
    TestBed.overrideComponent(DesignLab, { set: { template: '', imports: [] } });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it.each(['monochrome', 'earth', 'coastal', 'orchid'] as const)(
    'exports %s without redundant palette or appearance settings',
    (preset) => {
      const lab = TestBed.createComponent(DesignLab).componentInstance;
      TestBed.inject(DocsAppearanceService).selectPalette(preset);
      const code = lab['themeCode']();
      expect(code).toContain(`preset: '${preset}'`);
      expect(code).not.toContain('palette:');
      expect(code).not.toContain('density:');
      expect(code).not.toContain('radius:');
      expect(lab['paletteCustomized']()).toBe(false);
    },
  );

  it('keeps the starter and exports only changed seeds and appearance', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    const appearance = TestBed.inject(DocsAppearanceService);
    appearance.selectPalette('coastal');
    lab['updateColor']('primary', '#123456');
    lab['setDensity']('compact');
    lab['setRadius']('soft');
    const code = lab['themeCode']();
    expect(code).toContain("preset: 'coastal'");
    expect(code).toContain("primary: '#123456'");
    expect(code).toContain("density: 'compact'");
    expect(code).toContain("radius: 'soft'");
    expect(code).not.toContain('surface:');
    expect(code).not.toContain('secondary:');
    expect(lab['paletteCustomized']()).toBe(true);
    expect(lab['starterName']()).toBe('Coastal');
  });

  it('reflects external appearance changes immediately without mirrored writable state', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    const theme = TestBed.inject(AerisThemeService);
    theme.setTheme({ preset: 'orchid', palette: { secondary: '#654321' }, direction: 'rtl' });
    expect(lab['palette']().secondary).toBe('#654321');
    expect(lab['themeCode']()).toContain("secondary: '#654321'");
    expect(lab['themeCode']()).toContain("direction: 'rtl'");
    expect(lab['starterName']()).toBe('Orchid');
  });

  it('restores starter colors and tones without resetting mode or geometry', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    const theme = TestBed.inject(AerisThemeService);
    TestBed.inject(DocsAppearanceService).selectPalette('earth');
    lab['setMode']('dark');
    lab['setDensity']('comfortable');
    lab['setRadius']('pill');
    lab['updateColor']('primary', '#123456');
    lab['updateTone']('danger', 'hover', '#654321');
    expect(lab['themeCode']()).toContain("hover: '#654321'");
    lab['resetPalette']();
    expect(theme.theme().palette).toEqual(resolveAerisTheme({ preset: 'earth' }).palette);
    expect(theme.mode()).toBe('dark');
    expect(theme.theme().density).toBe('comfortable');
    expect(theme.theme().radius).toBe('pill');
    expect(lab['themeCode']()).not.toContain('palette:');
    expect(lab['themeCode']()).not.toContain('tones:');
  });

  it('retains explicit automatic and per-scheme overrides in generated code', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    lab['setMode']('light');
    lab['updateTone']('primary', 'base', '#123456');
    lab['setMode']('dark');
    lab['updateTone']('warning', 'active', '#654321');
    const code = lab['themeCode']();
    expect(code).toContain('light: {');
    expect(code).toContain("base: '#123456'");
    expect(code).toContain('dark: {');
    expect(code).toContain("active: '#654321'");
    lab['resetTone']('warning');
    expect(lab['themeCode']()).toContain('warning: null');
    expect(lab['themeCode']()).not.toContain("active: '#654321'");
  });
});
