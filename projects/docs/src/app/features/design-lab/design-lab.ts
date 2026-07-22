import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisMessage, type AerisMessageSeverity } from '@aeris-ui/core/message';
import { AerisProgressBar } from '@aeris-ui/core/progress-bar';
import {
  AERIS_DEFAULT_THEME,
  AerisThemeService,
  auditAerisThemeContrast,
  type AerisContrastCategory,
  type AerisContrastCheck,
  type AerisContrastStatus,
  type AerisDensityName,
  type AerisPaletteConfig,
  type AerisRadiusName,
  type AerisResolvedSemanticTone,
  type AerisSemanticTone,
  type AerisSemanticToneName,
  type AerisSemanticTones,
  type AerisTheme,
  type AerisThemeMode,
  type AerisThemeScheme,
} from '@aeris-ui/core/theming';

import { DOCS_PALETTES, type DocsPalette } from '../../data/docs-palettes';
import { CodeBlockComponent } from '../../shared/code-block.component';
import { AerisApplicationShowcaseComponent } from '../../shared/showcase/aeris-application-showcase.component';

type PaletteKey = keyof AerisPaletteConfig;
type LabDensity = 'compact' | 'medium' | 'comfortable';
type LabRadius = 'soft' | 'rounded' | 'pill';
type LabScheme = 'light' | 'dark';
type LabToneProperty = 'base' | 'hover' | 'active';

interface LabPaletteOption {
  readonly key: PaletteKey;
  readonly label: string;
  readonly description: string;
}

interface LabToneOption {
  readonly name: AerisSemanticToneName;
  readonly label: string;
  readonly description: string;
}

interface LabToneRow extends LabToneOption {
  readonly resolved: AerisResolvedSemanticTone;
  readonly customized: boolean;
}

interface LabToneOverrides {
  readonly light: AerisSemanticTones;
  readonly dark: AerisSemanticTones;
}

interface LabContrastCheck extends AerisContrastCheck {
  readonly ratioLabel: string;
  readonly requiredLabel: string;
  readonly statusLabel: string;
}

interface LabContrastGroup {
  readonly category: AerisContrastCategory;
  readonly label: string;
  readonly checks: readonly LabContrastCheck[];
  readonly passed: number;
  readonly failed: number;
  readonly unresolved: number;
}

interface LabContrastReport {
  readonly mode: LabScheme;
  readonly checks: readonly LabContrastCheck[];
  readonly groups: readonly LabContrastGroup[];
  readonly passed: number;
  readonly failed: number;
  readonly unresolved: number;
  readonly total: number;
  readonly score: number;
  readonly status: AerisContrastStatus;
  readonly statusLabel: string;
  readonly issueCount: number;
}

const PALETTE_OPTIONS: readonly LabPaletteOption[] = [
  { key: 'surface', label: 'Surface seed', description: 'Pages, cards, and neutral layers' },
  { key: 'primary', label: 'Primary seed', description: 'Actions, focus, and selection' },
  { key: 'secondary', label: 'Secondary seed', description: 'Supporting interface accents' },
  { key: 'accent', label: 'Accent seed', description: 'Warm highlights and emphasis' },
  { key: 'contrast', label: 'Contrast seed', description: 'Grounding and strong contrast' },
];

const TONE_OPTIONS: readonly LabToneOption[] = [
  { name: 'primary', label: 'Primary', description: 'Main actions and selected states' },
  { name: 'secondary', label: 'Secondary', description: 'Supporting actions and emphasis' },
  { name: 'success', label: 'Success', description: 'Completed and positive outcomes' },
  { name: 'info', label: 'Info', description: 'Neutral guidance and information' },
  { name: 'warning', label: 'Warning', description: 'Caution and attention states' },
  { name: 'danger', label: 'Danger', description: 'Destructive and error states' },
  { name: 'contrast', label: 'Contrast', description: 'Strong neutral emphasis' },
];

const TONE_PROPERTIES: readonly LabToneProperty[] = ['base', 'hover', 'active'];
const SERIALIZED_TONE_PROPERTIES: readonly (keyof AerisSemanticTone)[] = [
  'base',
  'boundary',
  'hover',
  'active',
  'onBase',
  'onHover',
  'onActive',
  'text',
  'soft',
  'onSoft',
];
const SERIALIZED_SCHEME_PROPERTIES: readonly Exclude<keyof AerisThemeScheme, 'tones'>[] = [
  'accent',
  'page',
  'surface',
  'surface2',
  'surface3',
  'interactiveHover',
  'text',
  'text2',
  'text3',
  'border',
  'borderStrong',
  'focus',
  'shadowXs',
  'shadowSm',
];

const CONTRAST_CATEGORIES: readonly {
  readonly category: AerisContrastCategory;
  readonly label: string;
}[] = [
  { category: 'text', label: 'Text' },
  { category: 'interaction', label: 'Semantic content' },
  { category: 'focus', label: 'Focus indicators' },
  { category: 'boundary', label: 'Borders and controls' },
];

function editableToneOverrides(tones: AerisSemanticTones | undefined): AerisSemanticTones {
  return Object.fromEntries(
    TONE_OPTIONS.flatMap(({ name }) => {
      const source = tones?.[name];
      if (!source) return [];

      const tone: AerisSemanticTone = {
        ...(source.base ? { base: source.base } : {}),
        ...(source.hover ? { hover: source.hover } : {}),
        ...(source.active ? { active: source.active } : {}),
      };
      return Object.keys(tone).length ? [[name, tone] as const] : [];
    }),
  );
}

function serializeThemeScheme(mode: LabScheme, scheme: AerisThemeScheme): string {
  const properties = SERIALIZED_SCHEME_PROPERTIES.flatMap((property) =>
    scheme[property] ? [`    ${property}: '${scheme[property]}',`] : [],
  );
  const toneEntries = TONE_OPTIONS.flatMap(({ name }) => {
    const tone = scheme.tones?.[name];
    if (!tone) return [];

    const toneProperties = SERIALIZED_TONE_PROPERTIES.flatMap((property) =>
      tone[property] ? [`        ${property}: '${tone[property]}',`] : [],
    );
    return toneProperties.length
      ? [`      ${name}: {\n${toneProperties.join('\n')}\n      },`]
      : [];
  });
  const tones = toneEntries.length ? `    tones: {\n${toneEntries.join('\n')}\n    },` : '';
  const entries = [...properties, tones].filter(Boolean);

  return entries.length ? `  ${mode}: {\n${entries.join('\n')}\n  },\n` : '';
}

function contrastStatusLabel(status: AerisContrastStatus): string {
  switch (status) {
    case 'pass':
      return 'Pass';
    case 'fail':
      return 'Needs attention';
    case 'unresolved':
      return 'Review';
  }
}

function createContrastReport(theme: AerisTheme, mode: LabScheme): LabContrastReport {
  const report = auditAerisThemeContrast(theme, mode);
  const checks: readonly LabContrastCheck[] = report.checks.map((check) => ({
    ...check,
    ratioLabel: check.ratio === null ? 'Not resolved' : `${check.ratio.toFixed(2)}:1`,
    requiredLabel: `${check.requiredRatio}:1`,
    statusLabel: contrastStatusLabel(check.status),
  }));
  const groups = CONTRAST_CATEGORIES.map((option) => {
    const categoryChecks = checks.filter((check) => check.category === option.category);
    return {
      ...option,
      checks: categoryChecks,
      passed: categoryChecks.filter((check) => check.status === 'pass').length,
      failed: categoryChecks.filter((check) => check.status === 'fail').length,
      unresolved: categoryChecks.filter((check) => check.status === 'unresolved').length,
    };
  });

  return {
    ...report,
    checks,
    groups,
    statusLabel: contrastStatusLabel(report.status),
    issueCount: report.failed + report.unresolved,
  };
}

@Component({
  selector: 'app-design-lab',
  imports: [
    AerisBadgeModule,
    AerisButton,
    AerisCardModule,
    AerisColorPicker,
    AerisMessage,
    AerisProgressBar,
    CodeBlockComponent,
    AerisApplicationShowcaseComponent,
  ],
  templateUrl: './design-lab.html',
  styleUrl: './design-lab.scss',
})
export class DesignLab {
  private readonly aerisTheme = inject(AerisThemeService);
  protected readonly paletteOptions = PALETTE_OPTIONS;
  protected readonly presets = DOCS_PALETTES;
  protected readonly toneProperties: readonly {
    readonly key: LabToneProperty;
    readonly label: string;
  }[] = [
    { key: 'base', label: 'Base' },
    { key: 'hover', label: 'Hover' },
    { key: 'active', label: 'Pressed' },
  ];
  protected readonly densities: readonly LabDensity[] = ['compact', 'medium', 'comfortable'];
  protected readonly radii: readonly LabRadius[] = ['soft', 'rounded', 'pill'];
  protected readonly modes: readonly AerisThemeMode[] = ['system', 'light', 'dark'];
  protected readonly mode = this.aerisTheme.mode;
  protected readonly density = computed(() => this.aerisTheme.theme().density);
  protected readonly radius = computed(() => this.aerisTheme.theme().radius);
  protected readonly resolvedMode = this.aerisTheme.resolvedMode;
  protected readonly palette = signal<AerisPaletteConfig>({
    surface: this.aerisTheme.theme().palette.surface,
    primary: this.aerisTheme.theme().palette.primary,
    secondary: this.aerisTheme.theme().palette.secondary,
    accent: this.aerisTheme.theme().palette.accent,
    contrast: this.aerisTheme.theme().palette.contrast,
  });
  protected readonly toneOverrides = signal<LabToneOverrides>({
    light: editableToneOverrides(this.aerisTheme.theme().light.tones),
    dark: editableToneOverrides(this.aerisTheme.theme().dark.tones),
  });
  protected readonly toneRows = computed<readonly LabToneRow[]>(() => {
    const scheme = this.resolvedMode();
    const resolved = this.aerisTheme.semanticTones();
    const overrides = this.toneOverrides()[scheme];

    return TONE_OPTIONS.map((option) => ({
      ...option,
      resolved: resolved[option.name],
      customized: TONE_PROPERTIES.some((property) => Boolean(overrides[option.name]?.[property])),
    }));
  });
  protected readonly contrastMode = linkedSignal<LabScheme>(() => this.resolvedMode());
  protected readonly showOnlyContrastIssues = signal(false);
  protected readonly contrastReports = computed<Readonly<Record<LabScheme, LabContrastReport>>>(
    () => {
      const theme = this.aerisTheme.theme();
      return {
        light: createContrastReport(theme, 'light'),
        dark: createContrastReport(theme, 'dark'),
      };
    },
  );
  protected readonly contrastReportOptions = computed<readonly LabContrastReport[]>(() => [
    this.contrastReports().light,
    this.contrastReports().dark,
  ]);
  protected readonly selectedContrastReport = computed(
    () => this.contrastReports()[this.contrastMode()],
  );
  protected readonly displayedContrastGroups = computed<readonly LabContrastGroup[]>(() => {
    const groups = this.selectedContrastReport().groups;
    if (!this.showOnlyContrastIssues()) return groups;

    return groups
      .map((group) => ({
        ...group,
        checks: group.checks.filter((check) => check.status !== 'pass'),
      }))
      .filter((group) => group.checks.length > 0);
  });
  protected readonly contrastMessageSeverity = computed<AerisMessageSeverity>(() => {
    const report = this.selectedContrastReport();
    if (report.failed > 0) return 'error';
    if (report.unresolved > 0) return 'warning';
    return 'success';
  });
  protected readonly contrastMessage = computed(() => {
    const report = this.selectedContrastReport();
    if (report.failed > 0) {
      const unresolved = report.unresolved > 0 ? ` and ${report.unresolved} require review` : '';
      return `${report.failed} ${report.mode} scheme checks do not meet their AA target${unresolved}.`;
    }
    if (report.unresolved > 0) {
      return `${report.unresolved} ${report.mode} scheme checks use colors that cannot be analyzed statically.`;
    }
    return `All ${report.total} ${report.mode} scheme contrast checks meet their AA target.`;
  });

  protected readonly themeCode = computed(() => {
    const palette = this.palette();
    const theme = this.aerisTheme.theme();
    const schemeCode =
      serializeThemeScheme('light', theme.light) + serializeThemeScheme('dark', theme.dark);
    return `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const aerisTheme: AerisThemeOverride = {
  palette: {
    surface: '${palette.surface}',
    primary: '${palette.primary}',
    secondary: '${palette.secondary}',
    accent: '${palette.accent}',
    contrast: '${palette.contrast}',
  },
${schemeCode}  density: '${this.density()}',
  radius: '${this.radius()}',
};`;
  });

  protected readonly providerCode = computed(
    () => `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

import { aerisTheme } from './aeris-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: '${this.mode()}',
      themeModeStorageKey: 'app-color-mode',
      theme: aerisTheme,
    }),
  ],
};`,
  );

  protected readonly stylesCode = `@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';`;

  protected setMode(mode: AerisThemeMode): void {
    this.aerisTheme.setMode(mode);
  }

  protected setContrastMode(mode: LabScheme): void {
    this.contrastMode.set(mode);
  }

  protected toggleContrastIssues(): void {
    this.showOnlyContrastIssues.update((value) => !value);
  }

  protected setDensity(density: LabDensity): void {
    this.aerisTheme.updateTheme({ density: density satisfies AerisDensityName });
  }

  protected setRadius(radius: LabRadius): void {
    this.aerisTheme.updateTheme({ radius: radius satisfies AerisRadiusName });
  }

  protected applyPreset(preset: DocsPalette): void {
    const current = this.aerisTheme.theme();
    this.palette.set(preset.palette);
    this.toneOverrides.set({
      light: editableToneOverrides(preset.theme.light?.tones),
      dark: editableToneOverrides(preset.theme.dark?.tones),
    });
    this.aerisTheme.setTheme({
      ...preset.theme,
      density: current.density,
      radius: current.radius,
      direction: current.direction,
    });
  }

  protected resetTheme(): void {
    const palette: AerisPaletteConfig = {
      surface: AERIS_DEFAULT_THEME.palette.surface,
      primary: AERIS_DEFAULT_THEME.palette.primary,
      secondary: AERIS_DEFAULT_THEME.palette.secondary,
      accent: AERIS_DEFAULT_THEME.palette.accent,
      contrast: AERIS_DEFAULT_THEME.palette.contrast,
    };
    this.palette.set(palette);
    this.toneOverrides.set({ light: {}, dark: {} });
    this.aerisTheme.setMode('system');
    this.aerisTheme.setTheme({ palette, density: 'medium', radius: 'rounded' });
  }

  protected updateColor(key: PaletteKey, value: string): void {
    if (!/^#[\da-f]{6}$/i.test(value)) {
      return;
    }

    this.palette.update((current) => ({ ...current, [key]: value.toLowerCase() }));
    this.aerisTheme.updateTheme({ palette: { [key]: value.toLowerCase() } });
  }

  protected updateTone(
    name: AerisSemanticToneName,
    property: LabToneProperty,
    value: string,
  ): void {
    if (!/^#[\da-f]{6}$/i.test(value)) return;

    const scheme = this.resolvedMode();
    const normalized = value.toLowerCase();
    this.toneOverrides.update((current) => ({
      ...current,
      [scheme]: {
        ...current[scheme],
        [name]: {
          ...current[scheme][name],
          [property]: normalized,
        },
      },
    }));
    this.aerisTheme.updateTheme({
      [scheme]: {
        tones: { [name]: { [property]: normalized } },
      },
    });
  }

  protected resetTone(name: AerisSemanticToneName): void {
    const scheme = this.resolvedMode();
    this.toneOverrides.update((current) => ({
      ...current,
      [scheme]: { ...current[scheme], [name]: undefined },
    }));
    this.aerisTheme.updateTheme({
      [scheme]: {
        tones: {
          [name]: Object.fromEntries(
            SERIALIZED_TONE_PROPERTIES.map((property) => [property, undefined]),
          ),
        },
      },
    });
  }

  protected resetSemanticTones(): void {
    this.clearToneOverrides();
  }

  private clearToneOverrides(): void {
    const clearedTones: AerisSemanticTones = Object.fromEntries(
      TONE_OPTIONS.map(({ name }) => [
        name,
        Object.fromEntries(SERIALIZED_TONE_PROPERTIES.map((property) => [property, undefined])),
      ]),
    );
    this.toneOverrides.set({ light: {}, dark: {} });
    this.aerisTheme.updateTheme({
      light: { tones: clearedTones },
      dark: { tones: clearedTones },
    });
  }
}
