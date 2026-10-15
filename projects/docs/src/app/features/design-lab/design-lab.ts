import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisMessage, type AerisMessageSeverity } from '@aeris-ui/core/message';
import { AerisProgressBar } from '@aeris-ui/core/progress-bar';
import {
  AERIS_DEFAULT_THEME,
  AerisThemeService,
  auditAerisThemeContrast,
  resolveAerisTheme,
  resolveAerisThemeTokens,
  type AerisContrastCategory,
  type AerisContrastCheck,
  type AerisContrastStatus,
  type AerisPaletteConfig,
  type AerisResolvedSemanticTone,
  type AerisSemanticTone,
  type AerisSemanticToneName,
  type AerisSemanticTones,
  type AerisTheme,
  type AerisThemeMode,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from '@aeris-ui/core/theming';

import {
  LAB_DRAFT_KEY,
  LAB_JSON_LIMIT,
  LAB_SCHEME_KEYS,
  LAB_TONE_KEYS,
  labThemeCode,
  labThemeDocument,
  labThemeOverride,
  parseLabThemeDocument,
} from './design-lab-theme';

import { DOCS_PALETTES, type DocsPalette } from '../../data/docs-palettes';
import { DocsAppearanceService } from '../../shared/appearance/docs-appearance.service';
import { CodeBlockComponent } from '../../shared/code-block.component';
import { AerisShowcaseGalleryComponent } from '../../shared/showcase/aeris-showcase-gallery.component';
import { DesignLabColorFields } from './design-lab-color-fields';
import { DesignLabShadowFields } from './design-lab-shadow-fields';
import type { LabColorField } from './design-lab-theme';

type PaletteKey = keyof AerisPaletteConfig;
type LabDensity = 'compact' | 'medium' | 'comfortable';
type LabRadius = 'soft' | 'rounded' | 'pill';
type LabScheme = 'light' | 'dark';
type LabToneProperty = keyof AerisSemanticTone;

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
  readonly fields: readonly LabColorField<LabToneProperty>[];
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

const CONTRAST_CATEGORIES: readonly {
  readonly category: AerisContrastCategory;
  readonly label: string;
}[] = [
  { category: 'text', label: 'Text' },
  { category: 'interaction', label: 'Semantic content' },
  { category: 'focus', label: 'Focus indicators' },
  { category: 'boundary', label: 'Borders and controls' },
];

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
    RouterLink,
    AerisBadgeModule,
    AerisButton,
    AerisCardModule,
    AerisColorPicker,
    AerisTextarea,
    AerisMessage,
    AerisProgressBar,
    CodeBlockComponent,
    AerisShowcaseGalleryComponent,
    DesignLabColorFields,
    DesignLabShadowFields,
  ],
  templateUrl: './design-lab.html',
  styleUrl: './design-lab.scss',
})
export class DesignLab {
  private readonly destroyRef = inject(DestroyRef);
  private clearedDraft: string | null = null;
  private importReadId = 0;
  protected readonly draftStatus = signal('Changes are saved in this browser.');
  protected readonly transferMessage = signal('');
  protected readonly importText = signal('');
  protected readonly importError = signal(false);
  protected readonly editError = signal<{ readonly id: string; readonly message: string } | null>(
    null,
  );
  private readonly docsAppearance = inject(DocsAppearanceService);
  private readonly aerisTheme = inject(AerisThemeService);
  protected readonly paletteOptions = PALETTE_OPTIONS;
  protected readonly presets = DOCS_PALETTES;
  protected readonly activePresetId = computed(() => this.aerisTheme.theme().preset);
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
  protected readonly palette = computed(() => this.aerisTheme.theme().palette);
  protected readonly starterName = computed(
    () => this.presets.find(({ id }) => id === this.aerisTheme.theme().preset)?.shortName,
  );
  protected readonly paletteCustomized = computed(() => {
    const theme = this.aerisTheme.theme();
    const starter = resolveAerisTheme({ preset: theme.preset });
    return PALETTE_OPTIONS.some(({ key }) => theme.palette[key] !== starter.palette[key]);
  });
  protected readonly toneRows = computed<readonly LabToneRow[]>(() => {
    const scheme = this.resolvedMode();
    const resolved = this.aerisTheme.semanticTones();
    const overrides = this.aerisTheme.theme()[scheme].tones;

    return TONE_OPTIONS.map((option) => ({
      ...option,
      resolved: resolved[option.name],
      customized:
        overrides?.[option.name] === null ||
        LAB_TONE_KEYS.some((property) => overrides?.[option.name]?.[property] !== undefined),
      fields: LAB_TONE_KEYS.map((key) => {
        const value = overrides?.[option.name] === null ? null : overrides?.[option.name]?.[key];
        return {
          key,
          id: 'lab-' + scheme + '-' + option.name + '-' + key,
          label: key,
          value: value ?? resolved[option.name][key],
          state: value === null ? 'Automatic' : value === undefined ? 'Inherited' : 'Override',
        };
      }),
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
    if (report.failed > 0) return 'danger';
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

  protected readonly themeOverride = computed(() => labThemeOverride(this.aerisTheme.theme()));
  protected readonly themeCode = computed(() => labThemeCode(this.themeOverride()));
  protected readonly exportJson = computed(() =>
    JSON.stringify(labThemeDocument(this.aerisTheme.theme(), this.mode()), null, 2),
  );
  protected readonly schemeFields = computed<
    readonly LabColorField<Exclude<keyof AerisThemeScheme, 'tones'>>[]
  >(() => {
    const mode = this.resolvedMode();
    const explicit = this.aerisTheme.theme()[mode];
    const tokens = resolveAerisThemeTokens(this.aerisTheme.theme(), mode);
    return LAB_SCHEME_KEYS.map((key) => ({
      key,
      id: 'lab-' + mode + '-' + key,
      label: key,
      value: tokens[`--aeris-${key.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()}`] ?? '',
      state: explicit[key] === undefined ? 'Inherited' : 'Override',
    }));
  });

  protected readonly foundationColorFields = computed(() =>
    this.schemeFields().filter(({ key }) => !key.startsWith('shadow')),
  );
  protected readonly shadowFields = computed(() =>
    this.schemeFields().filter(({ key }) => key.startsWith('shadow')),
  );

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

  constructor() {
    try {
      const saved = globalThis.localStorage?.getItem(LAB_DRAFT_KEY);
      if (saved) {
        const draft = parseLabThemeDocument(saved);
        this.aerisTheme.setTheme(draft.theme);
        this.aerisTheme.setMode(draft.mode);
      }
    } catch {
      this.transferMessage.set(
        'The saved draft could not be restored. Your current theme was kept.',
      );
    }
    effect(() => {
      const document = this.exportJson();
      if (document === this.clearedDraft) return;
      this.clearedDraft = null;
      try {
        globalThis.localStorage.setItem(LAB_DRAFT_KEY, document);
        this.draftStatus.set('Draft saved in this browser.');
      } catch {
        this.draftStatus.set('Browser storage is unavailable. Export your theme before leaving.');
      }
    });
  }

  protected clearDraft(): void {
    try {
      globalThis.localStorage.removeItem(LAB_DRAFT_KEY);
      this.clearedDraft = this.exportJson();
      this.draftStatus.set('Saved draft cleared. New edits will be saved.');
    } catch {
      this.draftStatus.set('Browser storage is unavailable. The saved draft could not be cleared.');
    }
  }

  protected setImportText(event: Event): void {
    if (!(event.target instanceof HTMLTextAreaElement)) return;
    this.importReadId += 1;
    this.importText.set(event.target.value);
    this.importError.set(false);
    this.transferMessage.set('');
  }

  protected importTheme(): void {
    try {
      const document = parseLabThemeDocument(this.importText());
      this.aerisTheme.setTheme(document.theme);
      this.aerisTheme.setMode(document.mode);
      this.editError.set(null);
      this.importError.set(false);
      this.transferMessage.set(
        'Theme imported. The preview and generated configuration are updated.',
      );
    } catch (error: unknown) {
      this.importError.set(true);
      this.transferMessage.set(
        error instanceof Error ? error.message : 'The theme could not be imported.',
      );
    }
  }

  protected async readImportFile(event: Event): Promise<void> {
    if (!(event.target instanceof HTMLInputElement)) return;
    const readId = ++this.importReadId;
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > LAB_JSON_LIMIT) {
      this.importError.set(true);
      this.transferMessage.set('Theme JSON must be smaller than 64 KiB.');
      return;
    }
    try {
      const text = await file.text();
      if (this.destroyRef.destroyed || readId !== this.importReadId) return;
      this.importText.set(text);
      this.importError.set(false);
      this.transferMessage.set('File loaded. Choose Import theme to apply it.');
    } catch {
      if (this.destroyRef.destroyed || readId !== this.importReadId) return;
      this.importError.set(true);
      this.transferMessage.set('The file could not be read. Paste its JSON instead.');
    }
  }

  protected downloadTheme(): void {
    const url = URL.createObjectURL(new Blob([this.exportJson()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aeris-theme.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  protected updateScheme(property: Exclude<keyof AerisThemeScheme, 'tones'>, value: string): void {
    const mode = this.resolvedMode();
    const theme = this.themeOverride();
    this.applyEditedTheme(
      { ...theme, [mode]: { ...theme[mode], [property]: value } },
      `lab-${mode}-${property}`,
    );
  }

  protected inheritScheme(property: Exclude<keyof AerisThemeScheme, 'tones'>): void {
    this.aerisTheme.updateTheme({ [this.resolvedMode()]: { [property]: undefined } });
    this.editError.set(null);
  }

  protected resetToneField(
    name: AerisSemanticToneName,
    property: LabToneProperty,
    automatic: boolean,
  ): void {
    this.setToneProperty(name, property, automatic ? null : undefined);
  }

  private applyEditedTheme(theme: AerisThemeOverride, id: string): void {
    try {
      const document = parseLabThemeDocument(
        JSON.stringify({ version: 1, mode: this.mode(), theme }),
      );
      this.aerisTheme.setTheme(document.theme);
      this.editError.set(null);
    } catch (error: unknown) {
      this.editError.set({
        id,
        message: error instanceof Error ? error.message : 'Enter a valid CSS value.',
      });
    }
  }

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
    this.docsAppearance.selectDensity(density);
  }

  protected setRadius(radius: LabRadius): void {
    this.docsAppearance.selectRadius(radius);
  }

  protected applyPreset(preset: DocsPalette): void {
    this.docsAppearance.selectPalette(preset.id);
  }

  protected resetPalette(): void {
    const preset = this.presets.find(({ id }) => id === this.aerisTheme.theme().preset);
    if (preset) this.applyPreset(preset);
  }

  protected resetTheme(): void {
    this.aerisTheme.setMode('system');
    this.aerisTheme.setTheme({
      ...AERIS_DEFAULT_THEME,
      density: 'medium',
      radius: 'rounded',
    });
  }

  protected updateColor(key: PaletteKey, value: string): void {
    if (!/^#[\da-f]{6}$/i.test(value)) {
      return;
    }

    this.aerisTheme.updateTheme({ palette: { [key]: value.toLowerCase() } });
  }

  protected updateTone(
    name: AerisSemanticToneName,
    property: LabToneProperty,
    value: string,
  ): void {
    this.setToneProperty(name, property, value);
  }

  private setToneProperty(
    name: AerisSemanticToneName,
    property: LabToneProperty,
    value: string | null | undefined,
  ): void {
    const scheme = this.resolvedMode();
    const theme = this.themeOverride();
    const current = theme[scheme]?.tones?.[name];
    const tone =
      current === null ? Object.fromEntries(LAB_TONE_KEYS.map((key) => [key, null])) : current;
    this.applyEditedTheme(
      {
        ...theme,
        [scheme]: {
          ...theme[scheme],
          tones: { ...theme[scheme]?.tones, [name]: { ...tone, [property]: value } },
        },
      },
      `lab-${scheme}-${name}-${property}`,
    );
  }

  protected resetTone(name: AerisSemanticToneName): void {
    const scheme = this.resolvedMode();
    this.aerisTheme.updateTheme({
      [scheme]: {
        tones: {
          [name]: null,
        },
      },
    });
  }

  protected resetSemanticTones(): void {
    this.clearToneOverrides();
  }

  private clearToneOverrides(): void {
    const clearedTones: AerisSemanticTones = Object.fromEntries(
      TONE_OPTIONS.map(({ name }) => [name, null]),
    );
    this.aerisTheme.updateTheme({
      light: { tones: clearedTones },
      dark: { tones: clearedTones },
    });
  }
}
