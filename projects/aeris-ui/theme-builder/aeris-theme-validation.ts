import { auditAerisThemeContrast } from './aeris-contrast';
import { AERIS_SEMANTIC_TONE_NAMES } from './aeris-semantic-tones';
import { resolveAerisTheme } from './aeris-theme-resolver';
import {
  type AerisSemanticTone,
  type AerisTheme,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from './aeris-theme';

export type AerisThemeValidationSeverity = 'error' | 'warning';
export type AerisThemeValidationStatus = 'valid' | 'warning' | 'error';

export type AerisThemeValidationCode =
  | 'contrast-failed'
  | 'contrast-unresolved'
  | 'invalid-css-value'
  | 'invalid-direction'
  | 'missing-density'
  | 'missing-radius';

export interface AerisThemeValidationIssue {
  readonly code: AerisThemeValidationCode;
  readonly severity: AerisThemeValidationSeverity;
  readonly message: string;
  readonly guidance: string;
  readonly path?: string;
  readonly mode?: 'light' | 'dark';
  readonly ratio?: number | null;
  readonly requiredRatio?: 3 | 4.5;
}

export interface AerisThemeValidationReport {
  readonly status: AerisThemeValidationStatus;
  readonly valid: boolean;
  readonly issues: readonly AerisThemeValidationIssue[];
  readonly errors: readonly AerisThemeValidationIssue[];
  readonly warnings: readonly AerisThemeValidationIssue[];
}

interface ThemeCssValue {
  readonly path: string;
  readonly value: unknown;
  readonly affectsColorResolution: boolean;
}

const SCHEME_COLOR_PROPERTIES = [
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
] as const satisfies readonly (keyof AerisThemeScheme)[];

const TONE_PROPERTIES = [
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
] as const satisfies readonly (keyof AerisSemanticTone)[];

/**
 * Validates a runtime or build-time theme without reading the DOM.
 *
 * Errors identify values Aeris cannot safely apply or accessibility checks
 * known to fail. Warnings identify colors that require rendered/manual review.
 */
export function validateAerisTheme(
  themeOverride: AerisThemeOverride = {},
): AerisThemeValidationReport {
  const theme = resolveAerisTheme(themeOverride);
  const issues: AerisThemeValidationIssue[] = [];

  validateThemeSelection(theme, issues);
  const values = collectThemeCssValues(theme);
  let canAuditColors = true;

  for (const entry of values) {
    if (isSafeCssValue(entry.value)) continue;
    if (entry.affectsColorResolution) canAuditColors = false;
    issues.push({
      code: 'invalid-css-value',
      severity: 'error',
      path: entry.path,
      message: `${entry.path} must be a non-empty CSS value without braces, semicolons, or line breaks.`,
      guidance: 'Replace it with a valid CSS color, length, radius, or shadow value.',
    });
  }

  if (canAuditColors) {
    for (const mode of ['light', 'dark'] as const) {
      const contrast = auditAerisThemeContrast(theme, mode);
      for (const check of contrast.checks) {
        if (check.status === 'pass') continue;

        const unresolved = check.status === 'unresolved';
        issues.push({
          code: unresolved ? 'contrast-unresolved' : 'contrast-failed',
          severity: unresolved ? 'warning' : 'error',
          mode,
          path: `contrast.${mode}.${check.id}`,
          ratio: check.ratio,
          requiredRatio: check.requiredRatio,
          message: unresolved
            ? `${check.label} could not be evaluated from static colors.`
            : `${check.label} is ${check.ratio?.toFixed(2)}:1; WCAG ${check.criterion} requires ${check.requiredRatio}:1.`,
          guidance: unresolved
            ? `${check.guidance} Static analysis supports opaque HEX, RGB, and HSL colors; verify CSS variables, named colors, and newer color functions in their rendered context.`
            : check.guidance,
        });
      }
    }
  }

  const errors = issues.filter(({ severity }) => severity === 'error');
  const warnings = issues.filter(({ severity }) => severity === 'warning');

  return {
    status: errors.length ? 'error' : warnings.length ? 'warning' : 'valid',
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
  };
}

function validateThemeSelection(theme: AerisTheme, issues: AerisThemeValidationIssue[]): void {
  if (theme.direction !== undefined && theme.direction !== 'ltr' && theme.direction !== 'rtl') {
    issues.push({
      code: 'invalid-direction',
      severity: 'error',
      path: 'direction',
      message: `direction must be "ltr" or "rtl"; received "${String(theme.direction)}".`,
      guidance: 'Use ltr for left-to-right content or rtl for right-to-left content.',
    });
  }

  if (!theme.densities[theme.density]) {
    issues.push({
      code: 'missing-density',
      severity: 'error',
      path: 'density',
      message: `The selected density "${theme.density}" is not registered in theme.densities.`,
      guidance: 'Select a built-in density or register a scale with the same name.',
    });
  }

  if (!theme.radii[theme.radius]) {
    issues.push({
      code: 'missing-radius',
      severity: 'error',
      path: 'radius',
      message: `The selected radius "${theme.radius}" is not registered in theme.radii.`,
      guidance: 'Select a built-in corner style or register a radius scale with the same name.',
    });
  }
}

function collectThemeCssValues(theme: AerisTheme): readonly ThemeCssValue[] {
  const values: ThemeCssValue[] = [
    cssValue('palette.surface', theme.palette.surface, true),
    cssValue('palette.primary', theme.palette.primary, true),
    cssValue('palette.secondary', theme.palette.secondary, true),
    cssValue('palette.accent', theme.palette.accent, true),
    cssValue('palette.contrast', theme.palette.contrast, true),
  ];

  for (const mode of ['light', 'dark'] as const) {
    const scheme = theme[mode];
    for (const property of SCHEME_COLOR_PROPERTIES) {
      const value = scheme[property];
      if (value !== undefined) values.push(cssValue(`${mode}.${property}`, value, true));
    }
    if (scheme.shadowXs !== undefined) {
      values.push(cssValue(`${mode}.shadowXs`, scheme.shadowXs, false));
    }
    if (scheme.shadowSm !== undefined) {
      values.push(cssValue(`${mode}.shadowSm`, scheme.shadowSm, false));
    }

    for (const toneName of AERIS_SEMANTIC_TONE_NAMES) {
      const tone = scheme.tones?.[toneName];
      if (!tone) continue;
      for (const property of TONE_PROPERTIES) {
        const value = tone[property];
        if (value !== undefined) {
          values.push(cssValue(`${mode}.tones.${toneName}.${property}`, value, true));
        }
      }
    }
  }

  for (const [name, scale] of Object.entries(theme.densities)) {
    if (!isRecord(scale)) {
      values.push(cssValue(`densities.${name}`, scale, false));
      continue;
    }
    for (const [property, value] of Object.entries(scale)) {
      values.push(cssValue(`densities.${name}.${property}`, value, false));
    }
  }
  for (const [name, scale] of Object.entries(theme.radii)) {
    if (!isRecord(scale)) {
      values.push(cssValue(`radii.${name}`, scale, false));
      continue;
    }
    for (const [property, value] of Object.entries(scale)) {
      values.push(cssValue(`radii.${name}.${property}`, value, false));
    }
  }

  return values;
}

function cssValue(path: string, value: unknown, affectsColorResolution: boolean): ThemeCssValue {
  return { path, value, affectsColorResolution };
}

function isSafeCssValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !/[;{}\r\n]/.test(value);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
