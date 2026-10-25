import { TestBed } from '@angular/core/testing';
import { AerisThemeService, provideAeris, resolveAerisTheme } from '@aeris-ui/core/theming';
import { DocsAppearanceService } from '../../shared/appearance/docs-appearance.service';
import { DesignLab } from './design-lab';
import { LAB_DRAFT_KEY, parseLabThemeDocument } from './design-lab-theme';

describe('DesignLab workflow', () => {
  it('updates contrast traces after overrides and inheritance without changing the other scheme', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    const foreground = () =>
      lab['contrastReports']().light.checks.find(({ id }) => id === 'text-page')?.colors[0];
    const original = foreground();
    const dark = lab['contrastReports']().dark.checks;
    lab['setMode']('light');
    lab['updateScheme']('text', '#ffffff');
    expect(foreground()).toMatchObject({
      path: 'light.text',
      value: '#ffffff',
      source: 'Override',
    });
    expect(lab['contrastReports']().light.checks.find(({ id }) => id === 'text-page')?.status).toBe(
      'fail',
    );
    expect(lab['contrastReports']().dark.checks).toEqual(dark);
    lab['inheritScheme']('text');
    expect(foreground()).toEqual(original);
  });
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      get length() {
        return values.size;
      },
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        values.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        values.delete(key);
      }),
      clear: () => values.clear(),
      key: (index: number) => [...values.keys()][index] ?? null,
    } satisfies Storage);
    TestBed.configureTestingModule({
      imports: [DesignLab],
      providers: [provideAeris({ mode: 'light', themeValidation: false })],
    });
    TestBed.overrideComponent(DesignLab, { set: { template: '', imports: [] } });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

  it('edits and restores foundation overrides without affecting the other scheme', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    lab['setMode']('light');
    lab['updateScheme']('page', '#fafafa');
    lab['updateScheme']('shadowSm', '0 2px 8px rgb(0 0 0 / 0.12)');
    expect(lab['schemeFields']().find(({ key }) => key === 'page')?.state).toBe('Override');
    lab['setMode']('dark');
    expect(lab['schemeFields']().find(({ key }) => key === 'page')?.state).toBe('Inherited');
    lab['setMode']('light');
    lab['inheritScheme']('page');
    expect(lab['themeOverride']().light?.page).toBeUndefined();
    expect(lab['themeOverride']().light?.shadowSm).toContain('0 2px');
  });

  it('keeps automatic tone fields automatic when one field is overridden or inherited', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    lab['resetTone']('primary');
    lab['updateTone']('primary', 'onBase', '#ffffff');
    expect(lab['themeOverride']().light?.tones?.primary?.hover).toBeNull();
    expect(lab['themeOverride']().light?.tones?.primary?.onBase).toBe('#ffffff');
    lab['resetToneField']('primary', 'onBase', false);
    expect(lab['themeOverride']().light?.tones?.primary?.onBase).toBeUndefined();
    expect(lab['themeOverride']().light?.tones?.primary?.hover).toBeNull();
    lab['resetToneField']('primary', 'onBase', true);
    expect(lab['themeOverride']().light?.tones?.primary?.onBase).toBeNull();
  });

  it('does not apply malformed JSON or unsafe field edits', () => {
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    const before = lab['exportJson']();
    lab['importText'].set('{ invalid');
    lab['importTheme']();
    expect(lab['importError']()).toBe(true);
    expect(lab['exportJson']()).toBe(before);
    lab['updateScheme']('page', 'url(https://example.com)');
    expect(lab['editError']()?.id).toBe('lab-light-page');
    expect(lab['exportJson']()).toBe(before);
  });

  it('restores a saved theme and mode only when Design Lab is created', () => {
    vi.mocked(globalThis.localStorage.getItem).mockImplementation((key) =>
      key === LAB_DRAFT_KEY
        ? JSON.stringify({
            version: 1,
            mode: 'dark',
            theme: { preset: 'orchid', palette: { primary: '#123456' } },
          })
        : null,
    );
    const lab = TestBed.createComponent(DesignLab).componentInstance;
    expect(lab['mode']()).toBe('dark');
    expect(lab['palette']().primary).toBe('#123456');
    expect(lab['starterName']()).toBe('Orchid');
  });

  it('saves edits, clears only the stored copy, and saves again after another edit', () => {
    const setItem = vi.mocked(globalThis.localStorage.setItem);
    const removeItem = vi.mocked(globalThis.localStorage.removeItem);
    const fixture = TestBed.createComponent(DesignLab);
    const lab = fixture.componentInstance;
    fixture.detectChanges();
    lab['updateColor']('primary', '#123456');
    TestBed.tick();
    expect(setItem).toHaveBeenCalledWith(LAB_DRAFT_KEY, lab['exportJson']());
    expect(parseLabThemeDocument(lab['exportJson']()).theme.palette?.primary).toBe('#123456');
    setItem.mockClear();
    lab['clearDraft']();
    TestBed.tick();
    expect(removeItem).toHaveBeenCalledWith(LAB_DRAFT_KEY);
    expect(setItem).not.toHaveBeenCalled();
    expect(lab['palette']().primary).toBe('#123456');
    lab['setMode']('dark');
    TestBed.tick();
    expect(setItem).toHaveBeenCalledWith(LAB_DRAFT_KEY, lab['exportJson']());
    lab['setMode']('light');
    TestBed.tick();
    expect(setItem.mock.calls.filter(([key]) => key === LAB_DRAFT_KEY).at(-1)).toEqual([
      LAB_DRAFT_KEY,
      lab['exportJson'](),
    ]);
  });

  it('handles blocked storage and corrupt drafts without breaking editing', () => {
    vi.mocked(globalThis.localStorage.getItem).mockImplementation((key) =>
      key === LAB_DRAFT_KEY ? '{broken' : null,
    );
    vi.mocked(globalThis.localStorage.setItem).mockImplementation(() => {
      throw new Error('blocked');
    });
    const fixture = TestBed.createComponent(DesignLab);
    fixture.detectChanges();
    const lab = fixture.componentInstance;
    expect(lab['transferMessage']()).toContain('could not be restored');
    expect(lab['draftStatus']()).toContain('unavailable');
    lab['updateColor']('primary', '#123456');
    expect(lab['palette']().primary).toBe('#123456');
  });
});
