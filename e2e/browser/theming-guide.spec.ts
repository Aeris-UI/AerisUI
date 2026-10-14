import { expect, test } from './fixtures';

test('theming walkthrough stays short and opens a separate reference page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/guides/theming');
  await expect(page.locator('.guide-section h2').first()).toHaveText('Choose a theme');
  const beginnerSections = page
    .locator('.guide-section')
    .filter({ hasNot: page.locator('.guide-section__level') });
  await expect(beginnerSections.locator('h2')).toHaveText([
    'Choose a theme',
    'Apply your brand colors',
    'Adjust appearance',
    'Use the theme in your own layout',
    'Preview in Design Lab',
  ]);
  await page
    .getByRole('link', { name: 'Theme reference and troubleshooting', exact: true })
    .click();
  await expect(page).toHaveURL(/\/guides\/theme-reference$/);
  const toc = page.getByRole('complementary', { name: 'Guide sections' });
  const link = toc.getByRole('link', { name: 'Understand which color wins', exact: true });
  await link.click();
  await expect(page).toHaveURL(/\/guides\/theme-reference#inheritance$/);
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect
    .poll(() =>
      page.locator('#inheritance h2').evaluate((heading) => {
        const header = document.querySelector('.docs-header');
        return heading.getBoundingClientRect().top >= (header?.getBoundingClientRect().bottom ?? 0);
      }),
    )
    .toBe(true);
});

for (const path of ['/guides/theme-reference', '/components/table']) {
  test(`quick links scroll independently and reveal keyboard-focused items on ${path}`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 1440, height: 540 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const toc = page.locator('app-page-toc').first();
    await expect(toc).toBeVisible();
    await toc.scrollIntoViewIfNeeded();
    const nav = toc.locator('nav');
    await expect
      .poll(() => nav.evaluate((element) => element.scrollHeight > element.clientHeight))
      .toBe(true);
    const before = await page.evaluate(() => window.scrollY);
    await nav.hover();
    await page.mouse.wheel(0, 300);
    await expect.poll(() => nav.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    const last = nav.getByRole('link').last();
    await nav.evaluate((element) => {
      element.scrollTop = 0;
    });
    await nav.getByRole('link').first().focus();
    const count = await nav.getByRole('link').count();
    if (browserName === 'webkit') {
      // WebKit's default keyboard preference skips links during Tab traversal.
      // Check native focus scrolling and keyboard activation independently.
      await last.focus();
    } else {
      for (let index = 1; index < count; index += 1) await page.keyboard.press('Tab');
    }
    await expect(last).toBeFocused();
    await expect(last).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    expect(
      await toc.evaluate((element) => element.getBoundingClientRect().bottom),
    ).toBeLessThanOrEqual(540);
    const href = await last.getAttribute('href');
    await page.keyboard.press('Enter');
    await expect(last).toHaveAttribute('aria-current', 'location');
    expect(new URL(page.url()).hash).toBe(href);
  });
}

for (const width of [320, 390]) {
  test(`theming recipes remain readable and switch between complete files at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/guides/theming#palette');
    const palette = page.locator('#palette');
    await expect(palette.locator('code')).toContainText("primary: '#2563eb'");
    await palette.getByRole('tab', { name: 'src/app/app.config.ts', exact: true }).click();
    await expect(palette.locator('code')).toContainText(
      "import { productTheme } from './aeris-theme'",
    );
    await expect(palette.locator('code')).toContainText('theme: productTheme');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width + 1,
    );
  });
}
