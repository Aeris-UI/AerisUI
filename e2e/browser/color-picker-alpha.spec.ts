import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const mount of ['self', 'body']) {
  test(`color picker stays anchored while scrolling with appendTo=${mount}`, async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1400 });
    await page.goto('/');
    const container = page.locator(`[data-color-scroll="${mount}"]`);
    const trigger = container.getByRole('button', { name: `${mount} scroll color`, exact: true });
    await trigger.click();
    const panel = page.getByRole('dialog', { name: 'Color picker', exact: true });
    const anchored = async () => {
      const anchor = await trigger.boundingBox();
      const overlay = await panel.boundingBox();
      if (!anchor || !overlay) return Number.POSITIVE_INFINITY;
      return Math.max(
        Math.abs(overlay.x - anchor.x),
        Math.abs(overlay.y - anchor.y - anchor.height - 8),
      );
    };
    await expect.poll(anchored).toBeLessThan(1.5);
    for (const scroll of [36, 12, 48, 0]) {
      await container.evaluate((element, top) => {
        element.scrollTop = top;
      }, scroll);
      await page.evaluate((top) => window.scrollTo(0, top), scroll);
      await expect.poll(anchored).toBeLessThan(1.5);
    }
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
  });
}

for (const mode of ['light', 'dark']) {
  test(`opacity supports keyboard, portals, and accurate previews in ${mode}`, async ({
    page,
    isMobile,
    browserName,
  }) => {
    await page.goto(`/?mode=${mode}`);
    const fixture = page.locator('[data-fixture="color-picker-alpha"]');
    await fixture.getByRole('button', { name: 'Overlay color', exact: true }).click();
    const panel = page.getByRole('dialog', { name: 'Color picker', exact: true });
    const alpha = panel.getByRole('slider', { name: 'Opacity', exact: true });
    await expect(alpha).toHaveValue('50');
    const track = await alpha.evaluate((element, browser) => {
      const pseudo =
        browser === 'firefox' ? '::-moz-range-track' : '::-webkit-slider-runnable-track';
      // WebKit/Blink do not expose range-track computed styles through this API.
      const rule = [...document.styleSheets]
        .flatMap((sheet) => [...sheet.cssRules])
        .find(
          (candidate): candidate is CSSStyleRule =>
            candidate instanceof CSSStyleRule &&
            candidate.selectorText.includes('.aeris-color-picker__alpha') &&
            candidate.selectorText.includes(pseudo),
        );
      const style = browser === 'firefox' ? getComputedStyle(element, pseudo) : rule?.style;
      if (!style) throw new Error('Expected opacity track styling');
      return { origin: style.backgroundOrigin, repeat: style.backgroundRepeat };
    }, browserName);
    expect(track.origin.split(',').every((origin) => origin.trim() === 'border-box')).toBe(true);
    expect(track.repeat.split(',')[0]?.trim()).toBe('no-repeat');
    await alpha.press('End');
    await expect(fixture.getByLabel('Overlay color value')).toHaveText('rgb(51, 102, 153)');
    await alpha.press('Home');
    await expect(fixture.getByLabel('Overlay color value')).toHaveText('rgba(51, 102, 153, 0)');
    await alpha.press('ArrowRight');
    await expect(alpha).toHaveValue('1');
    const swatch = fixture.locator('.aeris-color-picker__swatch');
    await expect(swatch).toHaveAttribute('data-translucent', 'true');
    await expect(panel.locator('.aeris-color-picker__preview')).toHaveCSS(
      'background-image',
      /conic-gradient/,
    );
    await expect(swatch).toHaveCSS('background-color', 'rgba(51, 102, 153, 0.01)');
    await panel.getByRole('button', { name: 'HEX', exact: true }).click();
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Select #336699ff', exact: true }).click();
    await expect(fixture.getByLabel('Overlay color value')).toHaveText('#336699');
    await expect(swatch).not.toHaveAttribute('data-translucent');
    await expect(swatch).toHaveCSS('background-image', 'none');
    if (isMobile) {
      const bounds = await alpha.boundingBox();
      if (!bounds) throw new Error('Expected opacity slider bounds');
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await expect(alpha).not.toHaveValue('100');
      await expect(panel).toBeVisible();
    }
    const box = await panel.boundingBox();
    const viewport = page.viewportSize();
    if (!box || !viewport) throw new Error('Expected visible panel and viewport');
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    const axe = await new AxeBuilder({ page })
      .include('[data-fixture="color-picker-alpha"]')
      .include('.aeris-color-picker__panel')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
    await alpha.press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(fixture.getByRole('button', { name: 'Overlay color', exact: true })).toBeFocused();
  });
}
