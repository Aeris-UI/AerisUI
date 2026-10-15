import { expect, test } from './fixtures';
import { readFile } from 'node:fs/promises';

test('Design Lab edits both schemes, restores its draft, and exports the same theme', async ({
  page,
}) => {
  await page.goto('/design-lab');
  const lab = page.locator('app-design-lab');
  await lab
    .getByRole('group', { name: 'Color mode', exact: true })
    .getByRole('button', { name: 'light', exact: true })
    .click();
  await lab.locator('.design-lab__advanced-foundations > summary').click();
  await lab.locator('#lab-light-page').click();
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).fill('#fafafa');
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).press('Enter');
  await page.keyboard.press('Escape');
  const code = lab.locator('.design-lab__code-item app-code-block code').first();
  await expect(code).toContainText("page: '#fafafa'");
  await lab.getByRole('spinbutton', { name: 'shadowSm Blur', exact: true }).fill('18');
  await lab.getByRole('spinbutton', { name: 'shadowSm Blur', exact: true }).press('Tab');
  await lab.getByRole('spinbutton', { name: 'shadowSm opacity', exact: true }).fill('25');
  await lab.getByRole('spinbutton', { name: 'shadowSm opacity', exact: true }).press('Tab');
  const smallShadow = lab
    .locator('app-lab-shadow-fields fieldset')
    .filter({ has: page.locator('legend', { hasText: 'shadowSm' }) });
  await smallShadow.getByText('Inset', { exact: true }).click();
  await expect(smallShadow.getByRole('checkbox', { name: 'Inset', exact: true })).toBeChecked();
  await expect(code).toContainText('inset 0px 2px 18px 0px rgb(0 0 0 / 0.25)');
  await lab
    .getByRole('group', { name: 'Color mode', exact: true })
    .getByRole('button', { name: 'dark', exact: true })
    .click();
  await lab.locator('#lab-dark-page').click();
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).fill('#101010');
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).press('Enter');
  await page.keyboard.press('Escape');
  await expect(code).toContainText("page: '#101010'");
  await page.reload();
  await expect(code).toContainText("page: '#fafafa'");
  await expect(code).toContainText("page: '#101010'");
  const pendingDownload = page.waitForEvent('download');
  await lab.getByRole('button', { name: 'Export theme JSON', exact: true }).click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe('aeris-theme.json');
  const path = await download.path();
  if (!path) throw new Error('Expected the JSON download.');
  const document = JSON.parse(await readFile(path, 'utf8'));
  expect(document.mode).toBe('dark');
  expect(document.theme.light.page).toBe('#fafafa');
  expect(document.theme.light.shadowSm).toBe('inset 0px 2px 18px 0px rgb(0 0 0 / 0.25)');
  expect(document.theme.dark.page).toBe('#101010');
  await lab.getByRole('button', { name: 'Clear saved draft', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('aeris-design-lab-draft-v1'))).toBeNull();
  await expect(code).toContainText("page: '#101010'");
  await page.reload();
  await expect(code).not.toContainText("page: '#101010'");
});

test('Design Lab rejects bad imports and accepts a JSON file without executing code', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design-lab');
  const lab = page.locator('app-design-lab');
  await lab.getByText('Import theme JSON', { exact: true }).click();
  const source = lab.getByRole('textbox', { name: 'Theme JSON', exact: true });
  const code = lab.locator('.design-lab__code-item app-code-block code').first();
  const before = await code.textContent();
  await source.fill('{"palette":{"primary":42}}');
  await lab.getByRole('button', { name: 'Import theme', exact: true }).click();
  await expect(source).toHaveAttribute('aria-invalid', 'true');
  await expect(lab.locator('#lab-transfer-message')).toHaveAttribute('role', 'alert');
  expect(await code.textContent()).toBe(before);
  await lab.locator('input[type=file]').setInputFiles({
    name: 'theme.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        mode: 'dark',
        theme: {
          preset: 'orchid',
          light: { tones: { primary: { onBase: '#ffffff' } } },
          dark: { page: '#121212' },
        },
      }),
    ),
  });
  await expect(lab.locator('#lab-transfer-message')).toContainText('File loaded');
  await lab.getByRole('button', { name: 'Import theme', exact: true }).click();
  await expect(code).toContainText("preset: 'orchid'");
  await expect(code).toContainText("onBase: '#ffffff'");
  await expect(code).toContainText("page: '#121212'");
  await expect(source).not.toHaveAttribute('aria-invalid');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

test('Design Lab keeps its main workflow short without removing advanced controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/design-lab');
  const lab = page.locator('app-design-lab');
  const advanced = lab.locator('.design-lab__advanced');
  const report = lab.locator('.design-lab__report');
  await expect(advanced).not.toHaveAttribute('open');
  await expect(report).not.toHaveAttribute('open');
  for (const seed of ['Surface', 'Primary', 'Secondary', 'Accent', 'Contrast']) {
    await expect(
      lab.getByRole('button', { name: `Choose ${seed} seed`, exact: true }),
    ).toBeVisible();
  }
  await expect(lab.locator('.design-lab__palette-card details')).toHaveCount(0);
  await advanced.locator(':scope > summary').click();
  await expect(lab.getByRole('button', { name: 'Use automatic tones', exact: true })).toBeVisible();
  await report.locator(':scope > summary').click();
  await expect(
    lab.getByRole('heading', { name: 'Contrast across the complete theme.' }),
  ).toBeVisible();
  await lab
    .getByRole('navigation', { name: 'Theme workflow' })
    .getByRole('link', { name: '3. Use your theme' })
    .click();
  await expect(page).toHaveURL(/\/design-lab#generated-code-title$/);
  await expect(lab.locator('.design-lab__code-item app-code-block code').first()).toContainText(
    'preset:',
  );
});

for (const width of [320, 390]) {
  test(`Design Lab controls and generated configuration fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto('/design-lab');
    const lab = page.locator('app-design-lab');
    await lab.getByRole('button', { name: 'Coastal', exact: true }).click();
    await expect(lab.getByRole('button', { name: 'Coastal', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const themeCode = lab.locator('.design-lab__code-item app-code-block code').first();
    await expect(themeCode).toContainText("preset: 'coastal'");
    await expect(themeCode).not.toContainText('palette:');
    await lab.locator('.design-lab__advanced-foundations > summary').click();
    await lab.locator('.design-lab__advanced > summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width + 1,
    );
    await lab.getByRole('button', { name: 'Reset to defaults', exact: true }).click();
    await expect(themeCode).toContainText("preset: 'monochrome'");
  });
}

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
