import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { AERIS_THEME_PRESETS, AerisThemeService, provideAeris } from '../../../theming/public-api';

describe('AerisThemeService', () => {
  const storageKey = 'aeris-test-theme-mode';
  const originalMatchMedia = globalThis.matchMedia;
  const values = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
  };

  beforeAll(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    });
  });

  beforeEach(() => {
    storage.removeItem(storageKey);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    storage.clear();
    const root = document.documentElement;
    delete root.dataset['aerisTheme'];
    delete root.dataset['aerisDensity'];
    delete root.dataset['aerisRadius'];
    delete root.dataset['aerisDirection'];
    root.removeAttribute('dir');
    root.removeAttribute('style');
    TestBed.resetTestingModule();
    Object.defineProperty(globalThis, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it('reports invalid runtime themes once in development mode', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          theme: { density: 'missing' },
          themeModeStorageKey: false,
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    await TestBed.tick();
    service.setMode('dark');
    await TestBed.tick();

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0]?.[0]).toContain('[Aeris UI] Theme validation found 1 error');
    expect(warning.mock.calls[0]?.[1]).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-density' })]),
    );
  });

  it('allows development-mode runtime diagnostics to be disabled', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          theme: { density: 'missing' },
          themeModeStorageKey: false,
          themeValidation: false,
        }),
      ],
    });

    TestBed.inject(AerisThemeService);
    await TestBed.tick();

    expect(warning).not.toHaveBeenCalled();
  });

  it('restores a stored theme mode', () => {
    storage.setItem(storageKey, 'dark');
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          themeModeStorageKey: storageKey,
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);

    expect(service.mode()).toBe('dark');
    expect(service.resolvedMode()).toBe('dark');
  });

  it('initializes document theming when provideAeris is registered', async () => {
    TestBed.configureTestingModule({
      providers: [provideAeris({ mode: 'dark', themeModeStorageKey: false })],
    });

    TestBed.inject(DOCUMENT);
    await TestBed.tick();

    expect(document.documentElement.dataset['aerisTheme']).toBe('dark');
  });

  it('applies an official starter theme through the existing theme option', () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          theme: AERIS_THEME_PRESETS.coastal,
          themeModeStorageKey: false,
        }),
      ],
    });

    const palette = TestBed.inject(AerisThemeService).theme().palette;

    expect(palette).toEqual(
      expect.objectContaining({
        ...AERIS_THEME_PRESETS.coastal.palette,
        mist: AERIS_THEME_PRESETS.coastal.palette.surface,
        sage: AERIS_THEME_PRESETS.coastal.palette.primary,
        cloud: AERIS_THEME_PRESETS.coastal.palette.secondary,
        sand: AERIS_THEME_PRESETS.coastal.palette.accent,
        umber: AERIS_THEME_PRESETS.coastal.palette.contrast,
      }),
    );
  });

  it('applies and cleanly replaces the high-contrast monochrome schemes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: AERIS_THEME_PRESETS.monochrome,
          themeModeStorageKey: false,
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    const root = document.documentElement;
    await TestBed.tick();

    expect(root.style.getPropertyValue('--aeris-primary')).toBe('#111111');
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-primary-hover')).toBe('#242424');
    expect(root.style.getPropertyValue('--aeris-on-primary-hover')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-secondary')).toBe('#565656');
    expect(root.style.getPropertyValue('--aeris-on-secondary')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-contrast')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-contrast-boundary')).toBe('#111111');
    expect(root.style.getPropertyValue('--aeris-on-contrast')).toBe('#111111');
    expect(root.style.getPropertyValue('--aeris-success')).toBe('#2f6b46');
    expect(root.style.getPropertyValue('--aeris-info')).toBe('#2f6178');
    expect(root.style.getPropertyValue('--aeris-warning')).toBe('#c38600');
    expect(root.style.getPropertyValue('--aeris-danger')).toBe('#c81e2a');
    expect(root.style.getPropertyValue('--aeris-border')).toBe('#767676');

    service.setMode('dark');
    await TestBed.tick();

    expect(root.style.getPropertyValue('--aeris-primary')).toBe('#f5f5f5');
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#090909');
    expect(root.style.getPropertyValue('--aeris-primary-hover')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-on-primary-hover')).toBe('#090909');
    expect(root.style.getPropertyValue('--aeris-secondary')).toBe('#b8b8b8');
    expect(root.style.getPropertyValue('--aeris-on-secondary')).toBe('#090909');
    expect(root.style.getPropertyValue('--aeris-contrast')).toBe('#090909');
    expect(root.style.getPropertyValue('--aeris-contrast-boundary')).toBe('#f5f5f5');
    expect(root.style.getPropertyValue('--aeris-on-contrast')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-success')).toBe('#9fd3ae');
    expect(root.style.getPropertyValue('--aeris-info')).toBe('#9ecbe0');
    expect(root.style.getPropertyValue('--aeris-warning')).toBe('#facc15');
    expect(root.style.getPropertyValue('--aeris-danger')).toBe('#ff5c68');
    expect(root.style.getPropertyValue('--aeris-border')).toBe('#a3a3a3');

    service.setTheme(AERIS_THEME_PRESETS.earth);
    service.setMode('light');
    await TestBed.tick();

    expect(service.theme().light.page).toBeUndefined();
    expect(root.style.getPropertyValue('--aeris-primary')).toBe(
      AERIS_THEME_PRESETS.earth.palette.primary,
    );
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#111411');
  });

  it('updates palette-aware borders without tinting ordinary text', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: AERIS_THEME_PRESETS.earth,
          themeModeStorageKey: false,
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    await TestBed.tick();
    const root = document.documentElement;
    const earthBorder = root.style.getPropertyValue('--aeris-border');

    service.updateTheme(AERIS_THEME_PRESETS.coastal);
    await TestBed.tick();

    expect(root.style.getPropertyValue('--aeris-border')).not.toBe(earthBorder);
    expect(root.style.getPropertyValue('--aeris-text')).toBe('#222222');
    expect(root.style.getPropertyValue('--aeris-text-2')).toBe('#555555');
    expect(root.style.getPropertyValue('--aeris-text-3')).toBe('#707070');
    expect(root.style.getPropertyValue('--aeris-interactive-hover')).not.toBe('');
  });

  it('persists theme mode changes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          themeModeStorageKey: storageKey,
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    service.setMode('dark');
    await TestBed.tick();

    expect(storage.getItem(storageKey)).toBe('dark');
  });

  it('accepts semantic palette seeds and registers one system listener', async () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
    Object.defineProperty(globalThis, 'matchMedia', {
      configurable: true,
      value: () => mediaQuery,
    });
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          theme: {
            palette: {
              primary: '#123456',
            },
          },
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    await TestBed.tick();
    expect(service.theme().palette.primary).toBe('#123456');
    expect(service.theme().palette.sage).toBe('#123456');
    expect(service.theme().palette.surface).toBe('#e8dfe0');
    expect(listeners.size).toBe(1);

    service.updateTheme({
      palette: {
        accent: '#abcdef',
      },
    });
    await TestBed.tick();

    expect(service.theme().palette.accent).toBe('#abcdef');
    expect(service.theme().palette.sand).toBe('#abcdef');
    expect(document.documentElement.style.getPropertyValue('--aeris-palette-accent')).toBe(
      '#abcdef',
    );
    expect(listeners.size).toBe(1);
  });

  it('applies the resolved mode, direction, density, radius, and mode-specific overrides', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: {
            direction: 'rtl',
            density: 'compact',
            radius: 'soft',
            light: {
              tones: {
                primary: { base: '#123456', onBase: '#ffffff' },
              },
            },
            dark: {
              tones: {
                primary: { base: '#abcdef' },
              },
            },
          },
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    await TestBed.tick();
    const root = document.documentElement;

    expect(root.dataset['aerisTheme']).toBe('light');
    expect(root.dataset['aerisDirection']).toBe('rtl');
    expect(root.getAttribute('dir')).toBe('rtl');
    expect(root.dataset['aerisDensity']).toBe('compact');
    expect(root.dataset['aerisRadius']).toBe('soft');
    expect(root.style.getPropertyValue('--aeris-primary')).toBe('#123456');
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--aeris-control-height')).toBe('2.125rem');
    expect(root.style.getPropertyValue('--aeris-radius-sm')).toBe('0.25rem');

    service.setMode('dark');
    await TestBed.tick();

    expect(root.dataset['aerisTheme']).toBe('dark');
    expect(root.style.getPropertyValue('--aeris-primary')).toBe('#abcdef');
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#111411');

    service.setDirection('ltr');
    await TestBed.tick();

    expect(root.dataset['aerisDirection']).toBe('ltr');
    expect(root.getAttribute('dir')).toBe('ltr');
  });

  it('keeps structural radii rounded and uses fully rounded controls for the pill preset', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: {
            radius: 'pill',
          },
        }),
      ],
    });

    await TestBed.tick();
    const root = document.documentElement;

    expect(root.dataset['aerisRadius']).toBe('pill');
    expect(root.style.getPropertyValue('--aeris-radius-sm')).toBe('0.75rem');
    expect(root.style.getPropertyValue('--aeris-radius-md')).toBe('1.125rem');
    expect(root.style.getPropertyValue('--aeris-radius-control')).toBe('999px');
    expect(root.style.getPropertyValue('--aeris-radius-pill')).toBe('999px');
  });

  it('supports custom density and radius presets from configuration and runtime updates', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: {
            density: 'spacious',
            densities: {
              spacious: {
                controlHeight: '3.5rem',
                controlPaddingX: '1rem',
                itemHeight: '3rem',
                itemPaddingY: '0.75rem',
                itemPaddingX: '1rem',
                gap: '0.875rem',
                iconSize: '1.125rem',
              },
            },
            radius: 'sharp',
            radii: {
              sharp: {
                sm: '0.125rem',
                md: '0.25rem',
                lg: '0.375rem',
                xl: '0.5rem',
                control: '0.125rem',
                pill: '999px',
              },
            },
          },
        }),
      ],
    });

    const service = TestBed.inject(AerisThemeService);
    await TestBed.tick();
    const root = document.documentElement;

    expect(root.dataset['aerisDensity']).toBe('spacious');
    expect(root.dataset['aerisRadius']).toBe('sharp');
    expect(root.style.getPropertyValue('--aeris-control-height')).toBe('3.5rem');
    expect(root.style.getPropertyValue('--aeris-control-padding-x')).toBe('1rem');
    expect(root.style.getPropertyValue('--aeris-item-height')).toBe('3rem');
    expect(root.style.getPropertyValue('--aeris-density-gap')).toBe('0.875rem');
    expect(root.style.getPropertyValue('--aeris-icon-size')).toBe('1.125rem');
    expect(root.style.getPropertyValue('--aeris-radius-lg')).toBe('0.375rem');
    expect(root.style.getPropertyValue('--aeris-radius-xl')).toBe('0.5rem');
    expect(root.style.getPropertyValue('--aeris-radius-control')).toBe('0.125rem');

    service.updateTheme({
      density: 'dense',
      densities: {
        dense: {
          controlHeight: '1.875rem',
          itemHeight: '1.75rem',
        },
      },
      radius: 'block',
      radii: {
        block: {
          sm: '0',
          md: '0',
          lg: '0',
          xl: '0',
        },
      },
    });
    await TestBed.tick();

    expect(root.dataset['aerisDensity']).toBe('dense');
    expect(root.dataset['aerisRadius']).toBe('block');
    expect(root.style.getPropertyValue('--aeris-control-height')).toBe('1.875rem');
    expect(root.style.getPropertyValue('--aeris-item-height')).toBe('1.75rem');
    expect(root.style.getPropertyValue('--aeris-control-padding-x')).toBe('');
    expect(root.style.getPropertyValue('--aeris-radius-lg')).toBe('0');
  });

  it('derives semantic interaction and contrast colors from each tone base', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAeris({
          mode: 'light',
          theme: {
            palette: {
              primary: '#f2d35c',
              secondary: '#406080',
            },
            light: {
              tones: {
                success: { base: '#245c35' },
                warning: {
                  base: '#f6d365',
                  hover: '#d4aa24',
                  onHover: '#111411',
                },
              },
            },
          },
        }),
      ],
    });

    await TestBed.tick();
    const service = TestBed.inject(AerisThemeService);
    const root = document.documentElement;

    expect(root.style.getPropertyValue('--aeris-primary')).toBe('#f2d35c');
    expect(root.style.getPropertyValue('--aeris-primary-boundary')).toBe('#f2d35c');
    expect(root.style.getPropertyValue('--aeris-primary-hover')).toBe('#e8ca59');
    expect(root.style.getPropertyValue('--aeris-on-primary')).toBe('#111411');
    expect(root.style.getPropertyValue('--aeris-primary-text')).not.toBe('#f2d35c');
    expect(root.style.getPropertyValue('--aeris-secondary-hover')).not.toBe(
      root.style.getPropertyValue('--aeris-primary-hover'),
    );
    expect(root.style.getPropertyValue('--aeris-success')).toBe('#245c35');
    expect(root.style.getPropertyValue('--aeris-success-hover')).not.toBe(
      root.style.getPropertyValue('--aeris-primary-hover'),
    );
    expect(root.style.getPropertyValue('--aeris-warning-hover')).toBe('#d4aa24');
    expect(root.style.getPropertyValue('--aeris-on-warning-hover')).toBe('#111411');
    expect(service.semanticTones().warning).toEqual(
      expect.objectContaining({
        base: '#f6d365',
        hover: '#d4aa24',
        onHover: '#111411',
      }),
    );
  });

  it('deep-merges runtime semantic tone overrides', async () => {
    TestBed.configureTestingModule({
      providers: [provideAeris({ mode: 'light', themeModeStorageKey: false })],
    });

    const service = TestBed.inject(AerisThemeService);
    service.updateTheme({
      light: {
        tones: {
          info: { base: '#315b70', hover: '#244758' },
        },
      },
    });
    service.updateTheme({
      light: {
        tones: {
          info: { onHover: '#ffffff' },
        },
      },
    });
    await TestBed.tick();

    expect(service.theme().light.tones?.info?.base).toBe('#315b70');
    expect(service.theme().light.tones?.info?.hover).toBe('#244758');
    expect(service.theme().light.tones?.info?.onHover).toBe('#ffffff');
    expect(document.documentElement.style.getPropertyValue('--aeris-info-hover')).toBe('#244758');
    expect(document.documentElement.style.getPropertyValue('--aeris-on-info-hover')).toBe(
      '#ffffff',
    );
  });
});
