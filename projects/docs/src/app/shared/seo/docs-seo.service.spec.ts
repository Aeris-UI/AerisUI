import { resolveDocsSeo } from './docs-seo.service';

describe('docs SEO metadata', () => {
  it('describes the landing page as an indexable Angular library page', () => {
    const seo = resolveDocsSeo('/');

    expect(seo.title).toContain('Angular 22 Component Library');
    expect(seo.description).toContain('currently in alpha');
    expect(seo.noIndex).toBeUndefined();
  });

  it('uses the component catalog for component metadata', () => {
    const seo = resolveDocsSeo('/components/button?theme=dark#api');

    expect(seo).toMatchObject({
      title: 'Button Angular Component - Aeris UI',
      path: '/components/button',
      kind: 'article',
    });
    expect(seo.description).toContain('Trigger actions');
  });

  it('uses the guide catalog for guide metadata', () => {
    const seo = resolveDocsSeo('/guides/accessibility/');

    expect(seo).toMatchObject({
      title: 'Accessibility Guide - Aeris UI',
      path: '/guides/accessibility',
      kind: 'article',
    });
  });

  it('prevents unknown component and application routes from being indexed', () => {
    expect(resolveDocsSeo('/components/unknown').noIndex).toBe(true);
    expect(resolveDocsSeo('/unknown').noIndex).toBe(true);
  });
});
