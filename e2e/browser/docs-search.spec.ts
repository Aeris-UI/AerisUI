import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('docs search preserves index matching, limits, query state and keyboard routing', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Search documentation', exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  await expect(page.locator('app-docs-search-dialog > aeris-command-palette')).toHaveCount(1);
  const input = dialog.getByRole('combobox', { name: 'Search guides and components' });
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await expect(dialog.getByRole('option').first()).toHaveAccessibleName('Mobile layouts');
  // Description matching belongs to the docs index, not CommandPalette's local filter.
  await input.fill('adornments');
  await expect(dialog.getByRole('option', { name: 'InputText', exact: true })).toBeVisible();
  await input.fill('form');
  await expect(dialog.getByRole('option')).toHaveCount(10);
  await input.fill('nothing-matches-this-query');
  await expect(dialog.getByRole('option')).toHaveCount(0);
  await expect(
    dialog.getByText('No documentation matches “nothing-matches-this-query”.'),
  ).toBeVisible();
  await input.press('Enter');
  await expect(dialog).toBeVisible();
  await input.fill('InputText');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/components\/input-text$/);
  await expect(dialog).toHaveCount(0);
  await trigger.click();
  await expect(input).toHaveValue('InputText');
  await input.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('docs shortcut, focus trap, IME and dismissal use the shared palette', async ({ page }) => {
  await page.goto('/guides/installation');
  const trigger = page.getByRole('button', { name: 'Search documentation', exact: true });
  await trigger.focus();
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.dispatchEvent('keydown', { key: 'Escape', isComposing: true, bubbles: true });
  await expect(dialog).toBeVisible();
  await input.press('ArrowDown');
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');
  await input.press('Tab');
  const close = dialog.getByRole('button', { name: 'Close documentation search' });
  await expect(close).toBeFocused();
  await close.press('Tab');
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await close.click();
  await expect(dialog).toHaveCount(0);
});

for (const mode of ['light', 'dark']) {
  test(`docs search is accessible, narrow-screen safe and routes tapped results in ${mode} RTL`, async ({
    page,
    isMobile,
  }) => {
    await page.addInitScript((mode) => {
      localStorage.setItem('aeris-ui-theme-mode', mode);
      localStorage.setItem('aeris-docs-direction', 'rtl');
    }, mode);
    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Search documentation', exact: true });
    const input = dialog.getByRole('combobox');
    await expect(input).toBeFocused();
    await input.fill('Installation');
    const option = dialog.getByRole('option', { name: 'Installation', exact: true });
    await expect(option).toBeVisible();
    const bounds = await dialog.boundingBox();
    if (!bounds) throw new Error('Missing search dialog bounds');
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(321);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(481);
    await expect(dialog.locator('.docs-command__result-icon svg')).toHaveCSS('width', '16px');
    expect(
      (
        await new AxeBuilder({ page })
          .include('[role="dialog"]')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    if (isMobile) await option.tap();
    else await option.click();
    await expect(page).toHaveURL(/\/guides\/installation$/);
    await expect(dialog).toHaveCount(0);
  });
}
