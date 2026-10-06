import { expect, test } from './fixtures';

test.describe('motion foundation', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('uses shared, placement-aware motion for anchored overlays', async ({ page }) => {
    const select = page.getByRole('combobox', { name: 'Role' });
    await select.click();

    const panel = page.locator('.aeris-select__panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('animation-name', 'aeris-overlay-enter');
    await expect(panel).toHaveCSS('animation-duration', '0.15s');

    await select.press('Escape');
    await expect(panel).toHaveCount(0);

    for (let index = 0; index < 3; index += 1) {
      await select.click();
      await expect(panel).toBeVisible();
      await select.press('Escape');
      await expect(panel).toHaveCount(0);
    }
  });

  test('gives modal layers coordinated backdrop and surface motion', async ({ page }) => {
    await page.getByRole('button', { name: 'Open dialog' }).click();

    await expect(page.locator('.aeris-dialog__overlay')).toHaveCSS(
      'animation-name',
      'aeris-backdrop-enter',
    );
    await expect(page.getByRole('dialog', { name: 'Create project' })).toHaveCSS(
      'animation-name',
      /aeris-dialog-enter$/,
    );
  });
});

test('removes spatial overlay motion when reduced motion is requested', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Role' }).click();

  const panel = page.locator('.aeris-select__panel');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('animation-duration', '0s');
});
