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

for (const width of [390, 768, 1280]) {
  test(`landing page is accessible and contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('.home-usage').scrollIntoViewIfNeeded();
    await page
      .locator('.home-theme-controls')
      .getByRole('button', { name: 'Light', exact: true })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', 'light');
    await expect(page.locator('.home-brand')).toHaveCSS('color', 'rgb(17, 17, 17)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    const results = await new AxeBuilder({ page })
      .include('.home-page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    await page
      .locator('.home-theme-controls')
      .getByRole('button', { name: 'Dark', exact: true })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', 'dark');
    await expect(page.locator('.home-brand')).toHaveCSS('color', 'rgb(248, 248, 248)');
    const darkResults = await new AxeBuilder({ page })
      .include('.home-page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(darkResults.violations, JSON.stringify(darkResults.violations, null, 2)).toEqual([]);
    await page
      .getByRole('heading', { name: 'UI components for Angular.' })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: test.info().outputPath(`landing-dark-${width}.png`),
      fullPage: true,
    });
  });
}
