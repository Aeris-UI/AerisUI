import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const width of [390, 1280]) {
  test(`catalog media images keep surface corners with the pill preset at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components');
    const appearance = page.getByRole('button', { name: /^Customize appearance\./ });
    await appearance.click();
    await page
      .getByRole('group', { name: 'Documentation corner style' })
      .getByRole('button', { name: /^Pill\b/ })
      .click();
    await appearance.click();
    await expect(page.locator('html')).toHaveAttribute('data-aeris-radius', 'pill');

    for (const name of ['Carousel', 'Compare']) {
      await page.getByRole('searchbox', { name: 'Filter components' }).fill(name);
      const card = page
        .locator('.catalog-preview-card')
        .filter({ has: page.getByRole('link', { name, exact: true }) });
      await card.scrollIntoViewIfNeeded();
      const images = card.locator('app-catalog-media-preview img');
      await expect(images.first()).toBeAttached();
      for (const image of await images.all()) {
        await expect(image).toHaveCSS('border-top-left-radius', '20px');
        await expect(image).toHaveCSS('border-bottom-right-radius', '20px');
      }
      await page
        .locator('html')
        .evaluate((element) => element.style.setProperty('--aeris-radius-surface', '12px'));
      await expect(images.first()).toHaveCSS('border-top-left-radius', '12px');
      await page
        .locator('html')
        .evaluate((element) => element.style.removeProperty('--aeris-radius-surface'));
      await expect(images.first()).toHaveCSS('border-top-left-radius', '20px');
    }
  });
}

test('catalog controls and inert preview scenes have accessible navigation', async ({
  page,
  browserName,
}) => {
  await page.goto('/components');
  await expect(page.locator('.docs-header img[ngsrc="logo.png"]')).toHaveAttribute(
    'fetchpriority',
    'high',
  );
  await page.getByRole('button', { name: 'Button', exact: true }).click();
  await expect(page.locator('.catalog-preview-card')).toHaveCount(4);
  for (const card of await page.locator('.catalog-preview-card').all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('app-catalog-preview')).toHaveCount(1);
  }
  await expect(page.locator('app-catalog-preview')).toHaveCount(4);
  for (const scene of await page.locator('.catalog-preview-scene').all()) {
    await expect(scene).toHaveAttribute('inert', '');
    await expect(scene).toHaveAttribute('aria-hidden', 'true');
  }
  const results = await new AxeBuilder({ page })
    .include('.reference-page')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  const link = page.locator('.catalog-preview-title a').first();
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Tab');
  // WebKit's default system preference skips native links in Tab navigation.
  // All engines must still skip inert scenes and support focus + Enter activation.
  if (browserName !== 'webkit')
    await expect(page.locator('.catalog-preview-title a').nth(1)).toBeFocused();
  expect(
    await page.evaluate(() => document.activeElement?.closest('.catalog-preview-scene') !== null),
  ).toBe(false);
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/components\/button$/);
});

for (const width of [390, 768, 1280, 1920]) {
  test(`catalog reflows without clipping at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components');
    await page.getByRole('button', { name: 'Button', exact: true }).click();
    await expect(page.locator('.catalog-preview-card')).toHaveCount(4);
    for (const card of await page.locator('.catalog-preview-card').all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator('app-catalog-preview')).toHaveCount(1);
    }
    await expect(page.locator('app-catalog-preview')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    for (const card of await page.locator('.catalog-preview-card').all()) {
      const bounds = await card.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds?.x).toBeGreaterThanOrEqual(0);
      expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
    }
  });
}

test('preview motion can be interrupted, replayed, and reduced without stale state', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const filter = page.getByRole('searchbox', { name: 'Filter components' });
  await filter.fill('Accordion');
  const card = page.locator('.catalog-preview-card');
  const preview = card.locator('app-catalog-preview');
  await expect(preview).toHaveCount(1);
  for (let cycle = 0; cycle < 4; cycle++) {
    await card.hover();
    await expect(preview).toHaveAttribute('data-active', 'true');
    await filter.hover();
    await expect(preview).toHaveAttribute('data-active', 'false');
  }
  await expect(card.locator('[aria-expanded="true"]')).toHaveCount(0);
  await card.hover();
  await expect(card.locator('[aria-expanded="true"]')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await filter.hover();
  await card.hover();
  await expect(preview).toHaveAttribute('data-active', 'false');
  await expect(card.locator('[aria-expanded="true"]')).toHaveCount(0);
  await expect(card).toHaveCSS('transform', 'none');
  expect(
    await card.evaluate(
      (el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
    ),
  ).toBe(0);
});
