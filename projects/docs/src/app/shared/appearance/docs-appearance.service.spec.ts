import { TestBed } from '@angular/core/testing';
import { AERIS_THEME_PRESETS, AerisThemeService, provideAeris } from '@aeris-ui/core/theming';

import { DocsAppearanceService } from './docs-appearance.service';

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe('DocsAppearanceService', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    TestBed.configureTestingModule({ providers: [provideAeris({ mode: 'system' })] });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('restores one shared documentation appearance state', () => {
    globalThis.localStorage.setItem('aeris-docs-palette', 'orchid');
    globalThis.localStorage.setItem('aeris-docs-density', 'compact');
    globalThis.localStorage.setItem('aeris-docs-radius', 'soft');
    globalThis.localStorage.setItem('aeris-docs-direction', 'rtl');

    const appearance = TestBed.inject(DocsAppearanceService);

    expect(appearance.activePaletteId()).toBe('orchid');
    expect(appearance.activeDensityId()).toBe('compact');
    expect(appearance.activeRadiusId()).toBe('soft');
    expect(appearance.activeDirectionId()).toBe('rtl');
  });

  it('reflects direct theme updates made by the Design Lab', () => {
    const appearance = TestBed.inject(DocsAppearanceService);
    const theme = TestBed.inject(AerisThemeService);

    theme.setTheme({
      ...AERIS_THEME_PRESETS.coastal,
      density: 'comfortable',
      radius: 'pill',
    });

    expect(appearance.activePaletteId()).toBe('coastal');
    expect(appearance.activePaletteName()).toBe('Coastal Glass');
    expect(appearance.activeDensityId()).toBe('comfortable');
    expect(appearance.activeRadiusId()).toBe('pill');

    theme.updateTheme({ palette: { primary: '#123456' } });

    expect(appearance.activePaletteId()).toBeNull();
    expect(appearance.activePaletteName()).toBe('Custom palette');
  });

  it('preserves density, corners, and direction when the menu changes palettes', () => {
    const appearance = TestBed.inject(DocsAppearanceService);

    appearance.selectDensity('compact');
    appearance.selectRadius('soft');
    appearance.selectDirection('rtl');
    appearance.selectPalette('monochrome');

    expect(appearance.activePaletteId()).toBe('monochrome');
    expect(appearance.activeDensityId()).toBe('compact');
    expect(appearance.activeRadiusId()).toBe('soft');
    expect(appearance.activeDirectionId()).toBe('rtl');
  });
});
