export interface AerisPaletteConfig {
  readonly surface: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly contrast: string;
}

export interface AerisPalette extends AerisPaletteConfig {
  /** @deprecated Use surface. Retained until the legacy Design Lab is replaced. */
  readonly mist: string;
  /** @deprecated Use primary. Retained until the legacy Design Lab is replaced. */
  readonly sage: string;
  /** @deprecated Use secondary. Retained until the legacy Design Lab is replaced. */
  readonly cloud: string;
  /** @deprecated Use accent. Retained until the legacy Design Lab is replaced. */
  readonly sand: string;
  /** @deprecated Use contrast. Retained until the legacy Design Lab is replaced. */
  readonly umber: string;
}

export type AerisSemanticToneName =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast';

export interface AerisSemanticTone {
  readonly base?: string;
  readonly boundary?: string;
  readonly hover?: string;
  readonly active?: string;
  readonly onBase?: string;
  readonly onHover?: string;
  readonly onActive?: string;
  readonly text?: string;
  readonly soft?: string;
  readonly onSoft?: string;
}

export interface AerisResolvedSemanticTone {
  readonly base: string;
  readonly boundary: string;
  readonly hover: string;
  readonly active: string;
  readonly onBase: string;
  readonly onHover: string;
  readonly onActive: string;
  readonly text: string;
  readonly soft: string;
  readonly onSoft: string;
}

export type AerisSemanticTones = Readonly<
  Partial<Record<AerisSemanticToneName, AerisSemanticTone>>
>;

export type AerisResolvedSemanticTones = Readonly<
  Record<AerisSemanticToneName, AerisResolvedSemanticTone>
>;

export interface AerisThemeScheme {
  readonly tones?: AerisSemanticTones;
  readonly accent?: string;
  readonly page?: string;
  readonly surface?: string;
  readonly surface2?: string;
  readonly surface3?: string;
  readonly interactiveHover?: string;
  readonly text?: string;
  readonly text2?: string;
  readonly text3?: string;
  readonly border?: string;
  readonly borderStrong?: string;
  readonly focus?: string;
  readonly shadowXs?: string;
  readonly shadowSm?: string;
}

export type AerisDensityName = 'compact' | 'medium' | 'comfortable' | (string & {});
export type AerisRadiusName = 'soft' | 'rounded' | 'pill' | (string & {});
export type AerisDirection = 'ltr' | 'rtl';

export interface AerisDensityScale {
  readonly controlHeight?: string;
  readonly controlPaddingX?: string;
  readonly itemHeight?: string;
  readonly itemPaddingY?: string;
  readonly itemPaddingX?: string;
  readonly gap?: string;
  readonly iconSize?: string;
}

export interface AerisRadiusScale {
  readonly sm?: string;
  readonly md?: string;
  readonly lg?: string;
  readonly xl?: string;
  readonly control?: string;
  readonly pill?: string;
}

export interface AerisTheme {
  readonly palette: AerisPalette;
  readonly light: AerisThemeScheme;
  readonly dark: AerisThemeScheme;
  readonly direction?: AerisDirection;
  readonly radius: AerisRadiusName;
  readonly radii: Readonly<Record<string, AerisRadiusScale>>;
  readonly density: AerisDensityName;
  readonly densities: Readonly<Record<string, AerisDensityScale>>;
}

export interface AerisThemeOverride extends Omit<
  Partial<AerisTheme>,
  'palette' | 'light' | 'dark'
> {
  readonly palette?: Partial<AerisPaletteConfig>;
  readonly light?: AerisThemeScheme;
  readonly dark?: AerisThemeScheme;
}

export type AerisThemePresetName = 'earth' | 'coastal' | 'orchid' | 'monochrome';

export interface AerisThemePreset extends AerisThemeOverride {
  readonly palette: AerisPaletteConfig;
}

const AERIS_MONOCHROME_LIGHT_PRIMARY_TONE = {
  base: '#111111',
  boundary: '#111111',
  hover: '#242424',
  active: '#050505',
  onBase: '#ffffff',
  onHover: '#ffffff',
  onActive: '#ffffff',
  text: '#111111',
  soft: '#f1f1f1',
  onSoft: '#111111',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_DARK_PRIMARY_TONE = {
  base: '#f5f5f5',
  boundary: '#f5f5f5',
  hover: '#ffffff',
  active: '#e7e7e7',
  onBase: '#090909',
  onHover: '#090909',
  onActive: '#090909',
  text: '#f5f5f5',
  soft: '#1b1b1b',
  onSoft: '#ffffff',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_LIGHT_SECONDARY_TONE = {
  base: '#565656',
  boundary: '#565656',
  hover: '#464646',
  active: '#363636',
  onBase: '#ffffff',
  onHover: '#ffffff',
  onActive: '#ffffff',
  text: '#454545',
  soft: '#ededed',
  onSoft: '#242424',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_DARK_SECONDARY_TONE = {
  base: '#b8b8b8',
  boundary: '#b8b8b8',
  hover: '#c8c8c8',
  active: '#a8a8a8',
  onBase: '#090909',
  onHover: '#090909',
  onActive: '#090909',
  text: '#d0d0d0',
  soft: '#262626',
  onSoft: '#f5f5f5',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_LIGHT_CONTRAST_TONE = {
  base: '#ffffff',
  boundary: '#111111',
  hover: '#f1f1f1',
  active: '#e3e3e3',
  onBase: '#111111',
  onHover: '#111111',
  onActive: '#111111',
  text: '#111111',
  soft: '#f1f1f1',
  onSoft: '#111111',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_DARK_CONTRAST_TONE = {
  base: '#090909',
  boundary: '#f5f5f5',
  hover: '#181818',
  active: '#242424',
  onBase: '#ffffff',
  onHover: '#ffffff',
  onActive: '#ffffff',
  text: '#f5f5f5',
  soft: '#1b1b1b',
  onSoft: '#ffffff',
} as const satisfies AerisSemanticTone;

const AERIS_MONOCHROME_LIGHT_STATUS_TONES = {
  success: {
    base: '#2f6b46',
    hover: '#285c3c',
    active: '#214f34',
    onBase: '#ffffff',
    onHover: '#ffffff',
    onActive: '#ffffff',
    text: '#24573a',
    soft: '#edf5ef',
    onSoft: '#214f34',
  },
  info: {
    base: '#2f6178',
    hover: '#285368',
    active: '#214758',
    onBase: '#ffffff',
    onHover: '#ffffff',
    onActive: '#ffffff',
    text: '#264f62',
    soft: '#edf4f7',
    onSoft: '#214758',
  },
  warning: {
    base: '#c38600',
    hover: '#bd8200',
    active: '#b87d00',
    onBase: '#211600',
    onHover: '#211600',
    onActive: '#211600',
    text: '#8a6100',
    soft: '#fff5d6',
    onSoft: '#704e00',
  },
  danger: {
    base: '#c81e2a',
    hover: '#b51b26',
    active: '#a21822',
    onBase: '#ffffff',
    onHover: '#ffffff',
    onActive: '#ffffff',
    text: '#a31722',
    soft: '#fff0f1',
    onSoft: '#81131a',
  },
} as const satisfies Pick<
  Record<AerisSemanticToneName, AerisSemanticTone>,
  'success' | 'info' | 'warning' | 'danger'
>;

const AERIS_MONOCHROME_DARK_STATUS_TONES = {
  success: {
    base: '#9fd3ae',
    hover: '#b5dfc0',
    active: '#8bc69c',
    onBase: '#0b1a10',
    onHover: '#0b1a10',
    onActive: '#0b1a10',
    text: '#9fd3ae',
    soft: '#17271d',
    onSoft: '#b5dfc0',
  },
  info: {
    base: '#9ecbe0',
    hover: '#b4d8e8',
    active: '#88bdd6',
    onBase: '#091923',
    onHover: '#091923',
    onActive: '#091923',
    text: '#9ecbe0',
    soft: '#17242a',
    onSoft: '#b4d8e8',
  },
  warning: {
    base: '#facc15',
    hover: '#ffdb4d',
    active: '#e7b900',
    onBase: '#211600',
    onHover: '#211600',
    onActive: '#211600',
    text: '#facc15',
    soft: '#2c2508',
    onSoft: '#ffdb4d',
  },
  danger: {
    base: '#ff5c68',
    hover: '#ff7b84',
    active: '#e84955',
    onBase: '#260609',
    onHover: '#260609',
    onActive: '#260609',
    text: '#ff5c68',
    soft: '#301416',
    onSoft: '#ff8f97',
  },
} as const satisfies Pick<
  Record<AerisSemanticToneName, AerisSemanticTone>,
  'success' | 'info' | 'warning' | 'danger'
>;

/** Accessible Aeris starter themes that can be passed directly to provideAeris(). */
export const AERIS_THEME_PRESETS = {
  earth: {
    palette: {
      surface: '#e8dfe0',
      primary: '#879566',
      secondary: '#80939b',
      accent: '#dab692',
      contrast: '#8f5b34',
    },
  },
  coastal: {
    palette: {
      surface: '#dfe8ee',
      primary: '#7196b4',
      secondary: '#6d9992',
      accent: '#d8ad70',
      contrast: '#31536a',
    },
  },
  orchid: {
    palette: {
      surface: '#e9e1ec',
      primary: '#9579b2',
      secondary: '#b68194',
      accent: '#d1a570',
      contrast: '#5c4b6b',
    },
  },
  monochrome: {
    palette: {
      surface: '#f4f4f4',
      primary: '#111111',
      secondary: '#1f1f1f',
      accent: '#f8f8f8',
      contrast: '#050505',
    },
    light: {
      accent: '#111111',
      page: '#f7f7f7',
      surface: '#ffffff',
      surface2: '#f3f3f3',
      surface3: '#e8e8e8',
      interactiveHover: '#e8e8e8',
      text: '#111111',
      text2: '#242424',
      text3: '#454545',
      border: '#767676',
      borderStrong: '#111111',
      focus: '#111111',
      shadowXs: '0 1px 2px rgb(0 0 0 / 10%)',
      shadowSm: '0 2px 5px rgb(0 0 0 / 14%)',
      tones: {
        primary: AERIS_MONOCHROME_LIGHT_PRIMARY_TONE,
        secondary: AERIS_MONOCHROME_LIGHT_SECONDARY_TONE,
        ...AERIS_MONOCHROME_LIGHT_STATUS_TONES,
        contrast: AERIS_MONOCHROME_LIGHT_CONTRAST_TONE,
      },
    },
    dark: {
      accent: '#f5f5f5',
      page: '#070707',
      surface: '#0c0c0c',
      surface2: '#151515',
      surface3: '#202020',
      interactiveHover: '#292929',
      text: '#f8f8f8',
      text2: '#ededed',
      text3: '#d0d0d0',
      border: '#a3a3a3',
      borderStrong: '#ffffff',
      focus: '#ffffff',
      shadowXs: '0 1px 2px rgb(0 0 0 / 48%)',
      shadowSm: '0 2px 6px rgb(0 0 0 / 62%)',
      tones: {
        primary: AERIS_MONOCHROME_DARK_PRIMARY_TONE,
        secondary: AERIS_MONOCHROME_DARK_SECONDARY_TONE,
        ...AERIS_MONOCHROME_DARK_STATUS_TONES,
        contrast: AERIS_MONOCHROME_DARK_CONTRAST_TONE,
      },
    },
  },
} as const satisfies Readonly<Record<AerisThemePresetName, AerisThemePreset>>;

export const AERIS_DENSITY_PRESETS: Readonly<
  Record<'compact' | 'medium' | 'comfortable', AerisDensityScale>
> = {
  compact: {
    controlHeight: '2.125rem',
    controlPaddingX: '0.625rem',
    itemHeight: '2rem',
    itemPaddingY: '0.375rem',
    itemPaddingX: '0.625rem',
    gap: '0.375rem',
    iconSize: '0.9375rem',
  },
  medium: {
    controlHeight: '2.625rem',
    controlPaddingX: '0.75rem',
    itemHeight: '2.5rem',
    itemPaddingY: '0.5rem',
    itemPaddingX: '0.75rem',
    gap: '0.5rem',
    iconSize: '1rem',
  },
  comfortable: {
    controlHeight: '3.125rem',
    controlPaddingX: '0.875rem',
    itemHeight: '2.875rem',
    itemPaddingY: '0.625rem',
    itemPaddingX: '0.875rem',
    gap: '0.625rem',
    iconSize: '1.0625rem',
  },
};

export const AERIS_RADIUS_PRESETS: Readonly<Record<'soft' | 'rounded' | 'pill', AerisRadiusScale>> =
  {
    soft: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.625rem',
      xl: '0.875rem',
      control: '0.25rem',
      pill: '999px',
    },
    rounded: {
      sm: '0.4375rem',
      md: '0.6875rem',
      lg: '1.125rem',
      xl: '1.5rem',
      control: '0.4375rem',
      pill: '999px',
    },
    pill: {
      sm: '0.75rem',
      md: '1.125rem',
      lg: '1.875rem',
      xl: '2.25rem',
      control: '999px',
      pill: '999px',
    },
  };

export const AERIS_DEFAULT_THEME: AerisTheme = {
  palette: {
    ...AERIS_THEME_PRESETS.earth.palette,
    mist: AERIS_THEME_PRESETS.earth.palette.surface,
    sage: AERIS_THEME_PRESETS.earth.palette.primary,
    cloud: AERIS_THEME_PRESETS.earth.palette.secondary,
    sand: AERIS_THEME_PRESETS.earth.palette.accent,
    umber: AERIS_THEME_PRESETS.earth.palette.contrast,
  },
  light: {},
  dark: {},
  radius: 'rounded',
  radii: AERIS_RADIUS_PRESETS,
  density: 'medium',
  densities: AERIS_DENSITY_PRESETS,
};
