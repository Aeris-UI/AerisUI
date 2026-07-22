import { mixAerisColor } from './aeris-color';
import type { AerisTheme } from './aeris-theme';

export interface AerisResolvedFoundation {
  readonly page: string;
  readonly surface: string;
  readonly surface2: string;
  readonly surface3: string;
  readonly interactiveHover: string;
  readonly text: string;
  readonly text2: string;
  readonly text3: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly focus: string;
}

const LIGHT_TEXT = '#222222';
const LIGHT_TEXT_SECONDARY = '#555555';
const LIGHT_TEXT_TERTIARY = '#707070';
const DARK_TEXT = '#f4f4f4';
const DARK_TEXT_SECONDARY = '#c5c5c5';
const DARK_TEXT_TERTIARY = '#9d9d9d';

/** Resolves palette-aware surfaces and borders while keeping ordinary text achromatic. */
export function resolveAerisFoundation(
  theme: AerisTheme,
  mode: 'light' | 'dark',
): AerisResolvedFoundation {
  const scheme = theme[mode];
  const surfaceSeed = theme.palette.surface;
  const borderSeed = theme.palette.secondary;

  if (mode === 'light') {
    const surface2 = scheme.surface2 ?? mixAerisColor('#f7f6f2', surfaceSeed, 0.24);
    return {
      page: scheme.page ?? mixAerisColor('#faf9f7', surfaceSeed, 0.18),
      surface: scheme.surface ?? '#ffffff',
      surface2,
      surface3: scheme.surface3 ?? mixAerisColor('#f1f0eb', surfaceSeed, 0.42),
      interactiveHover:
        scheme.interactiveHover ?? mixAerisColor(surface2, theme.palette.primary, 0.1),
      text: scheme.text ?? LIGHT_TEXT,
      text2: scheme.text2 ?? LIGHT_TEXT_SECONDARY,
      text3: scheme.text3 ?? LIGHT_TEXT_TERTIARY,
      border: scheme.border ?? mixAerisColor('#5f625d', borderSeed, 0.42),
      borderStrong: scheme.borderStrong ?? mixAerisColor('#444842', borderSeed, 0.3),
      focus: scheme.focus ?? mixAerisColor('#1d2119', theme.palette.primary, 0.5),
    };
  }

  const surface2 = scheme.surface2 ?? mixAerisColor('#171b22', surfaceSeed, 0.008);
  return {
    page: scheme.page ?? mixAerisColor('#090b0f', surfaceSeed, 0.004),
    surface: scheme.surface ?? mixAerisColor('#101318', surfaceSeed, 0.006),
    surface2,
    surface3: scheme.surface3 ?? mixAerisColor('#202632', surfaceSeed, 0.01),
    interactiveHover:
      scheme.interactiveHover ?? mixAerisColor(surface2, theme.palette.primary, 0.12),
    text: scheme.text ?? DARK_TEXT,
    text2: scheme.text2 ?? DARK_TEXT_SECONDARY,
    text3: scheme.text3 ?? DARK_TEXT_TERTIARY,
    border: scheme.border ?? mixAerisColor('#70746d', borderSeed, 0.35),
    borderStrong: scheme.borderStrong ?? mixAerisColor('#8d9289', borderSeed, 0.3),
    focus: scheme.focus ?? mixAerisColor('#ffffff', theme.palette.primary, 0.56),
  };
}
