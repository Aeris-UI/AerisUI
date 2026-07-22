import { aerisContrastRatio } from './aeris-color';
import { resolveAerisFoundation } from './aeris-foundation';
import { resolveAerisSemanticTones } from './aeris-semantic-tones';
import {
  type AerisResolvedSemanticTone,
  type AerisSemanticToneName,
  type AerisTheme,
} from './aeris-theme';

export type AerisContrastCategory = 'text' | 'interaction' | 'focus' | 'boundary';
export type AerisContrastStatus = 'pass' | 'fail' | 'unresolved';
export type AerisContrastKind = 'text' | 'non-text';

export interface AerisContrastCheck {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly category: AerisContrastCategory;
  readonly kind: AerisContrastKind;
  readonly criterion: '1.4.3' | '1.4.11';
  readonly foreground: string;
  readonly background: string;
  readonly ratio: number | null;
  readonly requiredRatio: 3 | 4.5;
  readonly status: AerisContrastStatus;
  readonly guidance: string;
}

export interface AerisThemeContrastReport {
  readonly mode: 'light' | 'dark';
  readonly checks: readonly AerisContrastCheck[];
  readonly passed: number;
  readonly failed: number;
  readonly unresolved: number;
  readonly total: number;
  readonly score: number;
  readonly status: AerisContrastStatus;
}

interface ResolvedSchemeColors {
  readonly page: string;
  readonly surface: string;
  readonly surface2: string;
  readonly interactiveHover: string;
  readonly text: string;
  readonly text2: string;
  readonly text3: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly focus: string;
}

interface CheckDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly category: AerisContrastCategory;
  readonly kind: AerisContrastKind;
  readonly foreground: string;
  readonly background: string;
  readonly requiredRatio: 3 | 4.5;
  readonly guidance: string;
}

const TONE_NAMES: readonly AerisSemanticToneName[] = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'contrast',
];

export function auditAerisThemeContrast(
  theme: AerisTheme,
  mode: 'light' | 'dark',
): AerisThemeContrastReport {
  const scheme = resolveSchemeColors(theme, mode);
  const tones = resolveAerisSemanticTones(theme, mode);
  const checks: AerisContrastCheck[] = [
    createCheck({
      id: 'text-page',
      label: 'Primary text on page',
      description: 'Default body content against the application page.',
      category: 'text',
      kind: 'text',
      foreground: scheme.text,
      background: scheme.page,
      requiredRatio: 4.5,
      guidance: 'Increase the difference between the text and page colors.',
    }),
    createCheck({
      id: 'text-surface',
      label: 'Primary text on surface',
      description: 'Default content inside cards, panels, and overlays.',
      category: 'text',
      kind: 'text',
      foreground: scheme.text,
      background: scheme.surface,
      requiredRatio: 4.5,
      guidance: 'Increase the difference between the text and surface colors.',
    }),
    createCheck({
      id: 'text-secondary-surface',
      label: 'Secondary text on surface',
      description: 'Supporting descriptions and metadata on a primary surface.',
      category: 'text',
      kind: 'text',
      foreground: scheme.text2,
      background: scheme.surface,
      requiredRatio: 4.5,
      guidance: 'Strengthen the secondary text color without reducing hierarchy.',
    }),
    createCheck({
      id: 'text-tertiary-surface',
      label: 'Tertiary text on surface',
      description: 'Low-emphasis visible text on a primary surface.',
      category: 'text',
      kind: 'text',
      foreground: scheme.text3,
      background: scheme.surface,
      requiredRatio: 4.5,
      guidance: 'Darken or lighten the tertiary text until it remains readable.',
    }),
    createCheck({
      id: 'text-secondary-raised',
      label: 'Secondary text on raised surface',
      description: 'Supporting content against the secondary surface layer.',
      category: 'text',
      kind: 'text',
      foreground: scheme.text2,
      background: scheme.surface2,
      requiredRatio: 4.5,
      guidance: 'Increase secondary text contrast against the raised surface.',
    }),
    createCheck({
      id: 'text-interactive-hover',
      label: 'Primary text on neutral hover',
      description: 'Default item content against the shared neutral interactive hover surface.',
      category: 'interaction',
      kind: 'text',
      foreground: scheme.text,
      background: scheme.interactiveHover,
      requiredRatio: 4.5,
      guidance: 'Adjust interactiveHover until default content remains readable.',
    }),
    ...TONE_NAMES.flatMap((name) => interactionChecks(name, tones[name], scheme.surface)),
    createCheck({
      id: 'focus-surface',
      label: 'Focus indicator on surface',
      description: 'Focus token against cards, controls, and overlay surfaces.',
      category: 'focus',
      kind: 'non-text',
      foreground: scheme.focus,
      background: scheme.surface,
      requiredRatio: 3,
      guidance: 'Strengthen the focus color against the primary surface.',
    }),
    createCheck({
      id: 'focus-page',
      label: 'Focus indicator on page',
      description: 'Focus token against the application page background.',
      category: 'focus',
      kind: 'non-text',
      foreground: scheme.focus,
      background: scheme.page,
      requiredRatio: 3,
      guidance: 'Strengthen the focus color against the page background.',
    }),
    createCheck({
      id: 'border-surface',
      label: 'Standard border on surface',
      description: 'Default structural boundary against a primary surface.',
      category: 'boundary',
      kind: 'non-text',
      foreground: scheme.border,
      background: scheme.surface,
      requiredRatio: 3,
      guidance: 'Use the stronger border token when the boundary identifies a control.',
    }),
    createCheck({
      id: 'border-strong-surface',
      label: 'Control border on surface',
      description: 'Strong border used to identify interactive controls.',
      category: 'boundary',
      kind: 'non-text',
      foreground: scheme.borderStrong,
      background: scheme.surface,
      requiredRatio: 3,
      guidance: 'Increase the strong border contrast against the primary surface.',
    }),
    createCheck({
      id: 'border-strong-raised',
      label: 'Control border on raised surface',
      description: 'Strong border used on the secondary surface layer.',
      category: 'boundary',
      kind: 'non-text',
      foreground: scheme.borderStrong,
      background: scheme.surface2,
      requiredRatio: 3,
      guidance: 'Increase the strong border contrast against the raised surface.',
    }),
    ...TONE_NAMES.map((name) =>
      createCheck({
        id: `${name}-boundary`,
        label: `${titleCase(name)} control boundary`,
        description: `Solid ${name} controls against a primary surface.`,
        category: 'boundary',
        kind: 'non-text',
        foreground: tones[name].boundary,
        background: scheme.surface,
        requiredRatio: 3,
        guidance: `Adjust tones.${name}.boundary so solid controls remain identifiable.`,
      }),
    ),
  ];

  const passed = checks.filter((check) => check.status === 'pass').length;
  const failed = checks.filter((check) => check.status === 'fail').length;
  const unresolved = checks.filter((check) => check.status === 'unresolved').length;
  const resolvedTotal = passed + failed;

  return {
    mode,
    checks,
    passed,
    failed,
    unresolved,
    total: checks.length,
    score: resolvedTotal > 0 ? Math.round((passed / resolvedTotal) * 100) : 0,
    status: failed > 0 ? 'fail' : unresolved > 0 ? 'unresolved' : 'pass',
  };
}

function interactionChecks(
  name: AerisSemanticToneName,
  tone: AerisResolvedSemanticTone,
  surface: string,
): readonly AerisContrastCheck[] {
  const label = titleCase(name);
  return [
    createCheck({
      id: `${name}-base-content`,
      label: `${label} solid content`,
      description: 'Text and icons on the default solid background.',
      category: 'interaction',
      kind: 'text',
      foreground: tone.onBase,
      background: tone.base,
      requiredRatio: 4.5,
      guidance: `Set tones.${name}.onBase to a more contrasting foreground.`,
    }),
    createCheck({
      id: `${name}-hover-content`,
      label: `${label} hover content`,
      description: 'Text and icons on the hover background.',
      category: 'interaction',
      kind: 'text',
      foreground: tone.onHover,
      background: tone.hover,
      requiredRatio: 4.5,
      guidance: `Adjust tones.${name}.hover or tones.${name}.onHover.`,
    }),
    createCheck({
      id: `${name}-active-content`,
      label: `${label} pressed content`,
      description: 'Text and icons on the pressed background.',
      category: 'interaction',
      kind: 'text',
      foreground: tone.onActive,
      background: tone.active,
      requiredRatio: 4.5,
      guidance: `Adjust tones.${name}.active or tones.${name}.onActive.`,
    }),
    createCheck({
      id: `${name}-text-surface`,
      label: `${label} text treatment`,
      description: 'Outline, text, and link content on a primary surface.',
      category: 'interaction',
      kind: 'text',
      foreground: tone.text,
      background: surface,
      requiredRatio: 4.5,
      guidance: `Set tones.${name}.text to a readable surface foreground.`,
    }),
    createCheck({
      id: `${name}-soft-content`,
      label: `${label} soft content`,
      description: 'Text and icons on the low-emphasis semantic background.',
      category: 'interaction',
      kind: 'text',
      foreground: tone.onSoft,
      background: tone.soft,
      requiredRatio: 4.5,
      guidance: `Adjust tones.${name}.soft or tones.${name}.onSoft.`,
    }),
  ];
}

function createCheck(definition: CheckDefinition): AerisContrastCheck {
  const ratio = aerisContrastRatio(definition.foreground, definition.background);
  const status: AerisContrastStatus =
    ratio === null ? 'unresolved' : ratio >= definition.requiredRatio ? 'pass' : 'fail';

  return {
    ...definition,
    criterion: definition.kind === 'text' ? '1.4.3' : '1.4.11',
    ratio,
    status,
  };
}

function resolveSchemeColors(theme: AerisTheme, mode: 'light' | 'dark'): ResolvedSchemeColors {
  return resolveAerisFoundation(theme, mode);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
