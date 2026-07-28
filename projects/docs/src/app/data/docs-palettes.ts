import {
  AERIS_THEME_PRESETS,
  type AerisPaletteConfig,
  type AerisThemePreset,
  type AerisThemePresetName,
} from '@aeris-ui/core/theming';

export type DocsPaletteId = AerisThemePresetName;

export interface DocsPalette {
  readonly id: DocsPaletteId;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly theme: AerisThemePreset;
  readonly palette: AerisPaletteConfig;
  readonly swatches: readonly string[];
}

const paletteSwatches = (palette: AerisPaletteConfig): readonly string[] => [
  palette.surface,
  palette.primary,
  palette.secondary,
  palette.accent,
  palette.contrast,
];

export const DOCS_PALETTES: readonly DocsPalette[] = [
  {
    id: 'earth',
    name: 'Aeris Earth',
    shortName: 'Earth',
    description: 'Grounded olive, burnished copper, and warm amber on soft ivory.',
    theme: AERIS_THEME_PRESETS.earth,
    palette: AERIS_THEME_PRESETS.earth.palette,
    swatches: paletteSwatches(AERIS_THEME_PRESETS.earth.palette),
  },
  {
    id: 'coastal',
    name: 'Coastal Glass',
    shortName: 'Coastal',
    description: 'Clear ocean blue, balanced teal, and a restrained coral accent.',
    theme: AERIS_THEME_PRESETS.coastal,
    palette: AERIS_THEME_PRESETS.coastal.palette,
    swatches: paletteSwatches(AERIS_THEME_PRESETS.coastal.palette),
  },
  {
    id: 'orchid',
    name: 'Orchid Dusk',
    shortName: 'Orchid',
    description: 'Confident violet, rich berry, and warm gold on pale lavender.',
    theme: AERIS_THEME_PRESETS.orchid,
    palette: AERIS_THEME_PRESETS.orchid.palette,
    swatches: paletteSwatches(AERIS_THEME_PRESETS.orchid.palette),
  },
  {
    id: 'monochrome',
    name: 'Aeris Monochrome',
    shortName: 'Monochrome',
    description: 'Black-and-white interface colors with distinct neutral action tiers and restrained status accents.',
    theme: AERIS_THEME_PRESETS.monochrome,
    palette: AERIS_THEME_PRESETS.monochrome.palette,
    swatches: paletteSwatches(AERIS_THEME_PRESETS.monochrome.palette),
  },
];
