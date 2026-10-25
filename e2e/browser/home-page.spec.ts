import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('landing page form validates, saves, and supports keyboard selection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'UI components for Angular.' })).toBeVisible();
  const demo = page.locator('.home-usage app-home-profile-demo');
  const name = demo.getByRole('textbox', { name: 'Name', exact: true });
  await name.fill('');
  await demo.getByRole('button', { name: 'Save settings' }).click();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(demo.getByText('Enter your name before saving.')).toBeVisible();
  await name.fill('Sam Taylor');
  const role = demo.getByRole('combobox', { name: 'Role', exact: true });
  await role.focus();
  await role.press('ArrowDown');
  await expect(demo.getByRole('listbox')).toBeVisible();
  await role.press('Escape');
  await expect(demo.getByRole('listbox')).toHaveCount(0);
  await role.click();
  await demo.getByRole('option', { name: 'Developer', exact: true }).click();
  await expect(role).toContainText('Developer');
  await demo.getByRole('button', { name: 'Save settings' }).click();
  await expect(demo.getByText('Settings saved for Sam Taylor.')).toBeVisible();
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.home-theme-preview input')).toHaveValue('Alex Morgan');
});

test('theme controls share persisted documentation preferences and update copyable configuration', async ({
  page,
}) => {
  await page.goto('/');
  const controls = page.locator('.home-theme-controls');
  await controls.getByRole('button', { name: 'Orchid', exact: true }).click();
  await controls.getByRole('button', { name: 'Dark', exact: true }).click();
  await controls.getByRole('button', { name: 'Soft', exact: true }).click();
  await expect(controls.getByRole('button', { name: 'Orchid', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-aeris-radius', 'soft');
  // Verify live switching on rendered text separately from stable-mode AXE scans.
  await page.locator('.home-evidence').scrollIntoViewIfNeeded();
  // Orchid's dark neutral text is #f4f4f4, distinct from Monochrome's #f8f8f8.
  await expect(page.locator('.home-evidence h3').first()).toHaveCSS('color', 'rgb(244, 244, 244)');
  await expect(page.locator('.home-theme-code')).toContainText('AERIS_THEME_PRESETS.orchid');
  await expect(page.locator('.home-theme-code')).toContainText("radius: 'soft'");
  expect(await page.evaluate(() => localStorage.getItem('aeris-docs-palette'))).toBe('orchid');
  await page.reload();
  await expect(controls.getByRole('button', { name: 'Orchid', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(controls.getByRole('button', { name: 'Dark', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('Design Lab seed edits, explicit tones, automatic resets, and exports share one theme', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('aeris-ui-theme-mode', 'light'));
  await page.goto('/design-lab');
  const root = page.locator('html');
  const primaryRow = page
    .locator('.design-lab__tone')
    .filter({ has: page.getByText('Main actions and selected states', { exact: true }) });
  const token = (name: string) =>
    root.evaluate((element, property) => element.style.getPropertyValue(property), name);

  await page.getByRole('button', { name: 'Choose Primary seed', exact: true }).click();
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).fill('#2563eb');
  await page.getByRole('button', { name: 'Close color picker', exact: true }).click();
  await expect.poll(() => token('--aeris-primary')).toBe('#2563eb');

  await page.getByText('Advanced interaction colors', { exact: true }).click();
  await primaryRow.getByRole('button', { name: 'Choose Primary Hover color', exact: true }).click();
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).fill('#1d4ed8');
  await page.getByRole('button', { name: 'Close color picker', exact: true }).click();
  await expect.poll(() => token('--aeris-primary-hover')).toBe('#1d4ed8');

  await page.getByRole('button', { name: 'Choose Primary seed', exact: true }).click();
  await page.getByRole('textbox', { name: 'HEX value', exact: true }).fill('#345678');
  await page.getByRole('button', { name: 'Close color picker', exact: true }).click();
  await expect.poll(() => token('--aeris-primary')).toBe('#345678');
  await expect.poll(() => token('--aeris-primary-hover')).toBe('#1d4ed8');

  await primaryRow.getByRole('button', { name: 'Auto', exact: true }).click();
  await expect.poll(() => token('--aeris-primary-hover')).not.toBe('#1d4ed8');
  const code = page.locator('.design-lab__code-item').first();
  await expect(code).toContainText("preset: 'monochrome'");
  await expect(code).toContainText('primary: null');
  await expect(code).toContainText("primary: '#345678'");

  await page
    .locator('.design-lab__choices')
    .getByRole('button', { name: 'dark', exact: true })
    .click();
  await expect(root).toHaveAttribute('data-aeris-theme', 'dark');
  await expect.poll(() => token('--aeris-primary')).not.toBe('#f5f5f5');
  await page.getByRole('button', { name: 'Reset to defaults', exact: true }).click();
  await page
    .locator('.design-lab__choices')
    .getByRole('button', { name: 'light', exact: true })
    .click();
  await expect.poll(() => token('--aeris-primary')).toBe('#111111');
});

for (const width of [320, 390, 1280]) {
  test(`product showcase stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const gallery = page.locator('app-aeris-showcase-gallery').first();
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery.locator('app-aeris-showcase-content')).toBeVisible();
    const viewport = gallery.locator('.showcase-gallery__viewport');
    for (const name of ['Components', 'Dashboard', 'Chat', 'CRM', 'Mail', 'Finances']) {
      await gallery.getByRole('tab', { name, exact: true }).click();
      await expect(gallery.getByRole('tab', { name, exact: true })).toBeVisible();
      expect(
        await viewport.evaluate((element) => element.scrollWidth - element.clientWidth),
      ).toBeLessThanOrEqual(1);
      const accessibility = await new AxeBuilder({ page })
        .include('app-aeris-showcase-gallery')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(accessibility.violations, JSON.stringify(accessibility.violations, null, 2)).toEqual(
        [],
      );
      expect(
        await viewport.evaluate((element) => element.scrollWidth - element.clientWidth),
      ).toBeLessThanOrEqual(1);
      await viewport.screenshot({ path: test.info().outputPath(`showcase-${name}-${width}.png`) });
    }
    await gallery.getByRole('tab', { name: 'Chat', exact: true }).click();
    const input = gallery.getByRole('textbox', { name: 'Message Maya Chen', exact: true });
    const send = gallery.getByRole('button', { name: 'Send message', exact: true });
    await expect(send).toBeDisabled();
    await input.fill('A message with a very long link: https://example.com/' + 'a'.repeat(120));
    await send.click();
    await expect(send).toBeDisabled();
    await expect(input).toHaveValue('');
    expect(
      await viewport.evaluate((element) => element.scrollWidth - element.clientWidth),
    ).toBeLessThanOrEqual(1);
    if (width === 1280) {
      const toolbar = gallery.locator('.product-toolbar');
      const bar = await toolbar.boundingBox();
      const end = await toolbar.locator('[aerisToolbarEnd]').boundingBox();
      expect(bar).not.toBeNull();
      expect(end).not.toBeNull();
      if (bar && end) expect(bar.x + bar.width - end.x - end.width).toBeLessThanOrEqual(24);
    }
  });
}

for (const width of [390, 768, 1280]) {
  for (const mode of ['light', 'dark'] as const) {
    test(`landing page is accessible and contained at ${width}px in ${mode} mode`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((mode) => localStorage.setItem('aeris-ui-theme-mode', mode), mode);
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      await expect(page.locator('.home-brand')).toHaveCSS(
        'color',
        mode === 'light' ? 'rgb(17, 17, 17)' : 'rgb(248, 248, 248)',
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      const results = await new AxeBuilder({ page })
        .include('.home-page')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      await page
        .getByRole('heading', { name: 'UI components for Angular.' })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: test.info().outputPath(`landing-${mode}-${width}.png`),
        fullPage: true,
      });
    });
  }
}
