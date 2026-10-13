import { describe, expect, it } from 'vitest';
import { routes } from '../../app.routes';
import { CAPACITOR_GUIDE } from './capacitor-guide';
import { GUIDE_ARTICLES } from './guide-data';
import { GUIDE_GROUPS, GUIDE_SUMMARY_BY_ID } from './guide-navigation';
import { MOBILE_GUIDE } from './mobile-guide';

describe('Mobile and Capacitor guides', () => {
  for (const guide of [MOBILE_GUIDE, CAPACITOR_GUIDE]) {
    it(`registers ${guide.id} with matching navigation and a lazy route`, () => {
      expect(GUIDE_ARTICLES.filter((article) => article.id === guide.id)).toEqual([guide]);
      expect(GUIDE_SUMMARY_BY_ID.get(guide.id)).toMatchObject({
        title: guide.title,
        path: guide.path,
        group: guide.group,
      });
      expect(
        GUIDE_GROUPS.find((group) => group.title === 'Integration and quality')?.guideIds,
      ).toContain(guide.id);
      const route = routes.find((entry) => entry.path === guide.path.slice(1));
      expect(route?.data?.['guideId']).toBe(guide.id);
      expect(route?.loadComponent).toBeTypeOf('function');
      expect(new Set(guide.sections.map((section) => section.id)).size).toBe(guide.sections.length);
    });
  }

  it('keeps mobile layout advice separate from native integration and cross-links both guides', () => {
    expect(MOBILE_GUIDE.related).toContain('capacitor');
    expect(CAPACITOR_GUIDE.related).toContain('mobile');
    expect(MOBILE_GUIDE.sections.map((section) => section.id)).toEqual([
      'mobile-layouts',
      'forms-overlays',
      'application-layout',
      'safe-areas',
    ]);
    expect(CAPACITOR_GUIDE.sections.map((section) => section.id)).toEqual([
      'interaction',
      'system-bars',
      'keyboard',
      'hardware-back',
      'device-validation',
    ]);
    const safeAreaLink = CAPACITOR_GUIDE.sections
      .flatMap((section) => section.links ?? [])
      .find((link) => link.href === '/guides/mobile#safe-areas');
    expect(safeAreaLink).toBeDefined();
    expect(CAPACITOR_GUIDE.summary).toContain('no Capacitor dependency');
    const code = CAPACITOR_GUIDE.sections
      .flatMap((section) => section.code ?? [])
      .map((source) => source.code)
      .join('\n');
    expect(code).toContain('dismissTopAerisOverlay(document)');
    expect(code).not.toContain('npm install');
    expect(code).not.toContain('capacitor.config');
    expect(code).not.toContain('@capacitor/haptics');
  });
});
