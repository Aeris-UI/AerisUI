import { expect, test } from './fixtures';

// Baselines are reviewed and compared on Windows Chromium in the dedicated CI job.
// Font rasterization differs between operating systems; other engines use geometry tests.
test.skip(process.platform !== 'win32', 'Visual baselines use the Windows CI environment.');
test.use({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} default primitives`, async ({ page }) => {
      await page.goto(`/?palette=${palette}&mode=${mode}`);
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      await expect(page.locator('[data-fixture="forms"]')).toHaveScreenshot(
        `${palette}-${mode}-forms.png`,
        { animations: 'disabled' },
      );
      await expect(page.locator('[data-fixture="surfaces"]')).toHaveScreenshot(
        `${palette}-${mode}-surfaces.png`,
        { animations: 'disabled' },
      );
    });
  }
}

for (const radius of ['soft', 'pill']) {
  for (const mode of ['light', 'dark']) {
    test(`${radius} corners in ${mode} mode`, async ({ page }) => {
      await page.goto(`/?palette=monochrome&mode=${mode}&radius=${radius}`);
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      await expect(page.locator('[data-fixture="forms"]')).toHaveScreenshot(
        `${radius}-${mode}-forms.png`,
        { animations: 'disabled' },
      );
      await expect(page.locator('[data-fixture="surfaces"]')).toHaveScreenshot(
        `${radius}-${mode}-surfaces.png`,
        { animations: 'disabled' },
      );
    });
  }
}

for (const [name, width] of [
  ['phone', 390],
  ['tablet', 768],
  ['laptop', 1280],
  ['wide', 1920],
] as const) {
  test(`${name} responsive primitives`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?palette=monochrome&mode=light');
    await expect(page.locator('[data-fixture="forms"]')).toHaveScreenshot(`${name}-forms.png`, {
      animations: 'disabled',
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  });
}

test('catalog preview cards retain their resting composition', async ({ page, baseURL }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${baseURL?.replace(':4300', ':4301')}/components`);
  await page.getByRole('button', { name: 'Button', exact: true }).click();
  await expect(page.locator('.catalog-preview-card')).toHaveCount(4);
  await expect(page.locator('app-catalog-preview')).toHaveCount(4);
  await page.locator('h1').hover();
  await expect(page.locator('.catalog-previews')).toHaveScreenshot('catalog-buttons.png', {
    animations: 'disabled',
  });
});
