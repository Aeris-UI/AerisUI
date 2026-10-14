import { describe, expect, it } from 'vitest';
import { GUIDE_ARTICLES } from './guide-data';
import { GUIDE_SUMMARY_BY_ID } from './guide-navigation';
import { routes } from '../../app.routes';

const theming = GUIDE_ARTICLES.find((article) => article.id === 'theming');
if (!theming) throw new Error('The theming guide must be registered.');
const reference = GUIDE_ARTICLES.find((article) => article.id === 'theme-reference');
if (!reference) throw new Error('The theme reference must be registered.');

describe('Consumer theming guides', () => {
  it('keeps the walkthrough to five sections and moves detailed material to a lazy reference page', () => {
    expect(theming.sections.map(({ id }) => id)).toEqual([
      'starter-themes',
      'palette',
      'scales',
      'application-colors',
      'preview-and-apply',
    ]);
    expect(theming.sections.some((section) => section.advanced)).toBe(false);
    expect(GUIDE_SUMMARY_BY_ID.get('theming')?.description).toBe(theming.description);
    expect(GUIDE_SUMMARY_BY_ID.get('theme-reference')?.description).toBe(reference.description);
    const route = routes.find(({ path }) => path === 'guides/theme-reference');
    expect(route?.data?.['guideId']).toBe('theme-reference');
    expect(route?.loadComponent).toBeTypeOf('function');
  });

  it('requires no icon dependency and demonstrates a minimal brand change with its registration', () => {
    const code = theming.sections
      .flatMap((section) => section.code ?? [])
      .map((source) => source.code)
      .join('\n');
    expect(code).not.toContain('@lucide/');
    expect(
      theming.sections.flatMap((section) => section.code ?? []).map((source) => source.label),
    ).not.toContain('src/app/save-action.ts');
    const palette = theming.sections.find((section) => section.id === 'palette');
    expect(palette?.code?.map((source) => source.label)).toEqual([
      'src/app/aeris-theme.ts',
      'src/app/app.config.ts',
    ]);
    expect(palette?.code?.[0].code).toContain("primary: '#2563eb'");
    expect(palette?.code?.[0].code).not.toContain('dark:');
    expect(palette?.code?.[1].code).toContain("import { productTheme } from './aeris-theme'");
    expect(palette?.code?.[1].code).toContain('theme: productTheme');
  });

  it('preserves existing section anchors and explains inheritance, automatic resets, and troubleshooting', () => {
    const ids = [...theming.sections, ...reference.sections].map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of [
      'architecture',
      'starter-themes',
      'palette',
      'neutral-content',
      'semantic-tones',
      'mode',
      'contrast-audit',
      'build-time-generation',
      'derived-color-stability',
      'development-validation',
      'scales',
      'css-tokens',
      'custom-scales',
      'visual-foundation',
      'motion',
      'shared-geometry',
    ])
      expect(ids).toContain(id);
    const inheritance = reference.sections.find((section) => section.id === 'inheritance');
    expect(inheritance?.table?.rows.map((row) => row[0])).toEqual([
      'Omitted',
      'A CSS color string',
      'null',
      'undefined in updateTheme()',
    ]);
    expect(
      reference.sections.find((section) => section.id === 'troubleshooting')?.table?.rows.length,
    ).toBeGreaterThanOrEqual(6);
  });

  it('uses real component tokens and valid in-site section links', () => {
    const css = reference.sections.find((section) => section.id === 'css-tokens')?.code?.[0].code;
    expect(css).toContain('--aeris-card-padding');
    expect(css).not.toContain('--aeris-button-primary-background');
    for (const article of GUIDE_ARTICLES.filter(
      ({ id }) => id === 'theming' || id === 'theme-reference' || id === 'design-system',
    )) {
      for (const link of article.sections.flatMap((section) => section.links ?? [])) {
        if (!link.href.startsWith('/guides/')) continue;
        const [path, anchor] = link.href.split('#');
        const target = GUIDE_ARTICLES.find((guide) => guide.path === path);
        expect(target, link.href).toBeDefined();
        if (anchor)
          expect(
            target?.sections.map((section) => section.id),
            link.href,
          ).toContain(anchor);
      }
    }
  });
});
