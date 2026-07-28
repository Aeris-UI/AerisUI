import { Service, computed, effect, inject } from '@angular/core';
import {
  AerisThemeService,
  type AerisDensityName,
  type AerisDirection,
  type AerisPaletteConfig,
  type AerisRadiusName,
} from '@aeris-ui/core/theming';

import { DOCS_PALETTES, type DocsPaletteId } from '../../data/docs-palettes';

export type DocsDensityId = 'compact' | 'medium' | 'comfortable';
export type DocsRadiusId = 'soft' | 'rounded' | 'pill';
export type DocsDirectionId = 'ltr' | 'rtl';

export interface DocsThemeOption<T extends string> {
  readonly id: T;
  readonly name: string;
  readonly description: string;
}

export const DOCS_DENSITIES: readonly DocsThemeOption<DocsDensityId>[] = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter controls for dense documentation pages.',
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Balanced spacing for everyday reading.',
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    description: 'Larger controls with more breathing room.',
  },
];

export const DOCS_RADII: readonly DocsThemeOption<DocsRadiusId>[] = [
  {
    id: 'soft',
    name: 'Soft',
    description: 'Subtle corners with a quieter interface shape.',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    description: 'The default Aeris corner rhythm.',
  },
  {
    id: 'pill',
    name: 'Pill',
    description: 'Fuller corners for a more rounded surface system.',
  },
];

export const DOCS_DIRECTIONS: readonly DocsThemeOption<DocsDirectionId>[] = [
  {
    id: 'ltr',
    name: 'LTR',
    description: 'Left-to-right layout direction.',
  },
  {
    id: 'rtl',
    name: 'RTL',
    description: 'Right-to-left layout direction.',
  },
];

const PALETTE_STORAGE_KEY = 'aeris-docs-palette';
const DENSITY_STORAGE_KEY = 'aeris-docs-density';
const RADIUS_STORAGE_KEY = 'aeris-docs-radius';
const DIRECTION_STORAGE_KEY = 'aeris-docs-direction';

function palettesMatch(left: AerisPaletteConfig, right: AerisPaletteConfig): boolean {
  return (
    left.surface === right.surface &&
    left.primary === right.primary &&
    left.secondary === right.secondary &&
    left.accent === right.accent &&
    left.contrast === right.contrast
  );
}

function isDocsDensity(value: string): value is DocsDensityId {
  return value === 'compact' || value === 'medium' || value === 'comfortable';
}

function isDocsRadius(value: string): value is DocsRadiusId {
  return value === 'soft' || value === 'rounded' || value === 'pill';
}

@Service()
export class DocsAppearanceService {
  private readonly themeService = inject(AerisThemeService);

  readonly palettes = DOCS_PALETTES;
  readonly densities = DOCS_DENSITIES;
  readonly radii = DOCS_RADII;
  readonly directions = DOCS_DIRECTIONS;

  readonly activePaletteId = computed<DocsPaletteId | null>(
    () =>
      this.palettes.find((preset) =>
        palettesMatch(preset.palette, this.themeService.theme().palette),
      )?.id ?? null,
  );
  readonly activePaletteName = computed(
    () =>
      this.palettes.find((palette) => palette.id === this.activePaletteId())?.name ??
      'Custom palette',
  );
  readonly activeDensityId = computed<DocsDensityId>(() => {
    const density = this.themeService.theme().density;
    return isDocsDensity(density) ? density : 'medium';
  });
  readonly activeRadiusId = computed<DocsRadiusId>(() => {
    const radius = this.themeService.theme().radius;
    return isDocsRadius(radius) ? radius : 'rounded';
  });
  readonly activeDirectionId = computed<DocsDirectionId>(() =>
    this.themeService.theme().direction === 'rtl' ? 'rtl' : 'ltr',
  );
  readonly activeDensity = computed(
    () =>
      this.densities.find((density) => density.id === this.activeDensityId()) ?? this.densities[1],
  );
  readonly activeRadius = computed(
    () => this.radii.find((radius) => radius.id === this.activeRadiusId()) ?? this.radii[1],
  );
  readonly activeDirection = computed(
    () =>
      this.directions.find((direction) => direction.id === this.activeDirectionId()) ??
      this.directions[0],
  );

  constructor() {
    const palette =
      this.palettes.find((preset) => preset.id === this.readStoredPalette()) ?? this.palettes[0];
    this.themeService.setTheme({
      ...palette.theme,
      density: this.readStoredDensity() satisfies AerisDensityName,
      radius: this.readStoredRadius() satisfies AerisRadiusName,
      direction: this.readStoredDirection() satisfies AerisDirection,
    });

    effect(() => {
      const paletteId = this.activePaletteId();
      const density = this.activeDensityId();
      const radius = this.activeRadiusId();
      const direction = this.activeDirectionId();

      try {
        if (paletteId) globalThis.localStorage?.setItem(PALETTE_STORAGE_KEY, paletteId);
        globalThis.localStorage?.setItem(DENSITY_STORAGE_KEY, density);
        globalThis.localStorage?.setItem(RADIUS_STORAGE_KEY, radius);
        globalThis.localStorage?.setItem(DIRECTION_STORAGE_KEY, direction);
      } catch {
        // Storage can be unavailable in privacy modes or non-browser environments.
      }
    });
  }

  selectPalette(id: DocsPaletteId): void {
    const preset = this.palettes.find((palette) => palette.id === id);
    if (!preset) return;

    const current = this.themeService.theme();
    this.themeService.setTheme({
      ...preset.theme,
      density: current.density,
      radius: current.radius,
      direction: current.direction,
    });
  }

  selectDensity(id: DocsDensityId): void {
    this.themeService.updateTheme({ density: id satisfies AerisDensityName });
  }

  selectRadius(id: DocsRadiusId): void {
    this.themeService.updateTheme({ radius: id satisfies AerisRadiusName });
  }

  selectDirection(id: DocsDirectionId): void {
    this.themeService.setDirection(id satisfies AerisDirection);
  }

  private readStoredPalette(): DocsPaletteId {
    try {
      const stored = globalThis.localStorage?.getItem(PALETTE_STORAGE_KEY);
      if (
        stored === 'earth' ||
        stored === 'coastal' ||
        stored === 'orchid' ||
        stored === 'monochrome'
      ) {
        return stored;
      }
    } catch {
      // Storage can be unavailable in privacy modes or non-browser environments.
    }

    return 'earth';
  }

  private readStoredDensity(): DocsDensityId {
    try {
      const stored = globalThis.localStorage?.getItem(DENSITY_STORAGE_KEY);
      if (stored === 'compact' || stored === 'medium' || stored === 'comfortable') {
        return stored;
      }
    } catch {
      // Storage can be unavailable in privacy modes or non-browser environments.
    }

    return 'medium';
  }

  private readStoredRadius(): DocsRadiusId {
    try {
      const stored = globalThis.localStorage?.getItem(RADIUS_STORAGE_KEY);
      if (stored === 'soft' || stored === 'rounded' || stored === 'pill') {
        return stored;
      }
    } catch {
      // Storage can be unavailable in privacy modes or non-browser environments.
    }

    return 'rounded';
  }

  private readStoredDirection(): DocsDirectionId {
    try {
      const stored = globalThis.localStorage?.getItem(DIRECTION_STORAGE_KEY);
      if (stored === 'ltr' || stored === 'rtl') {
        return stored;
      }
    } catch {
      // Storage can be unavailable in privacy modes or non-browser environments.
    }

    return 'ltr';
  }
}
