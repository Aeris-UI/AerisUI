import {
  AERIS_THEME_PRESETS,
  validateAerisTheme,
  type AerisThemeOverride,
} from '../../../theme-builder/public-api';

describe('Aeris theme development validation', () => {
  it('accepts every official theme without diagnostics', () => {
    for (const preset of Object.values(AERIS_THEME_PRESETS)) {
      expect(validateAerisTheme(preset)).toEqual(
        expect.objectContaining({
          status: 'valid',
          valid: true,
          issues: [],
          errors: [],
          warnings: [],
        }),
      );
    }
  });

  it('reports missing scales and an invalid direction with actionable paths', () => {
    const invalidRuntimeInput = {
      density: 'unregistered',
      radius: 'unregistered',
      direction: 'sideways',
    } as unknown as AerisThemeOverride;

    const report = validateAerisTheme(invalidRuntimeInput);

    expect(report.status).toBe('error');
    expect(report.valid).toBe(false);
    expect(report.errors.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['missing-density', 'missing-radius', 'invalid-direction']),
    );
    expect(report.errors.map(({ path }) => path)).toEqual(
      expect.arrayContaining(['density', 'radius', 'direction']),
    );
  });

  it('rejects unsafe or empty values, including values in inactive custom scales', () => {
    const report = validateAerisTheme({
      palette: { primary: '#123456; color: red' },
      densities: {
        future: { controlHeight: '' },
        invalid: null,
      },
    } as unknown as AerisThemeOverride);

    expect(report.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-css-value', path: 'palette.primary' }),
        expect.objectContaining({
          code: 'invalid-css-value',
          path: 'densities.future.controlHeight',
        }),
        expect.objectContaining({ code: 'invalid-css-value', path: 'densities.invalid' }),
      ]),
    );
  });

  it('reports known WCAG failures as errors with ratios and remediation', () => {
    const report = validateAerisTheme({
      light: {
        page: '#ffffff',
        surface: '#ffffff',
        text: '#ffffff',
      },
    });
    const issue = report.errors.find(
      ({ code, path }) => code === 'contrast-failed' && path === 'contrast.light.text-page',
    );

    expect(issue).toEqual(
      expect.objectContaining({
        mode: 'light',
        ratio: 1,
        requiredRatio: 4.5,
      }),
    );
    expect(issue?.guidance).toContain('difference between the text and page colors');
  });

  it('keeps unresolved dynamic colors as warnings for rendered review', () => {
    const report = validateAerisTheme({
      palette: { primary: 'var(--application-primary)' },
    });

    expect(report.valid).toBe(true);
    expect(report.status).toBe('warning');
    expect(report.errors).toHaveLength(0);
    expect(report.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'contrast-unresolved',
          severity: 'warning',
        }),
      ]),
    );
  });
});
