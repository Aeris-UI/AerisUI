import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test('custom artwork preserves control geometry, interaction and direction', async ({ page }) => {
  await page.goto('/');
  const fixture = page.locator('[data-fixture="custom-icons"]');
  await fixture.scrollIntoViewIfNeeded();
  const artwork = fixture.locator('[data-custom-artwork]').first();
  await expect(artwork).toBeVisible();
  const bounds = await artwork.boundingBox();
  expect(bounds?.width).toBeGreaterThanOrEqual(12);
  expect(bounds?.width).toBeLessThanOrEqual(24);
  expect(bounds?.height).toBe(bounds?.width);
  const calendar = fixture.locator('aeris-date-picker');
  await calendar.getByRole('combobox', { name: 'Custom calendar' }).click();
  await expect(page.getByRole('button', { name: 'Next period', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next period', exact: true }).click();
  await page.keyboard.press('Escape');
  const checkbox = fixture.getByRole('checkbox', { name: 'Custom check' });
  await expect(checkbox).toBeChecked();
  await fixture.locator('aeris-checkbox label').click();
  await expect(checkbox).not.toBeChecked();
  const tree = fixture.locator('aeris-tree');
  const toggle = tree.locator('.aeris-tree__toggle').first();
  const icon = toggle.locator('[data-aeris-custom-icon]');
  await expect(icon).not.toHaveCSS('transform', 'none');
  await toggle.click();
  await expect(icon).toHaveCSS('transform', 'none');
  await expect(tree.getByText('Files', { exact: true })).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include('[data-fixture="custom-icons"]')
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await fixture.evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(artwork).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(fixture).toBeVisible();
  expect(await fixture.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
});

test('custom dropdown icons retain touch interactions on narrow screens', async ({
  createContext,
}) => {
  const context = await createContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  const fixture = page.locator('[data-fixture="custom-icons"]');
  await fixture.scrollIntoViewIfNeeded();
  const trigger = fixture.getByRole('combobox', { name: 'Custom choices' });
  await trigger.tap();
  const option = page.getByRole('option', { name: 'Design', exact: true });
  await expect(option).toBeVisible();
  await option.tap();
  await expect(option).toBeVisible();
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await trigger.tap();
  await expect(option).not.toBeVisible();
});

test('global icon components retain geometry, scoped overlays and local precedence', async ({
  page,
}) => {
  await page.goto('/');
  const fixture = page.locator('[data-fixture="global-icons"]');
  await fixture.scrollIntoViewIfNeeded();
  const input = fixture.locator('aeris-input-text');
  const close = input.locator('[data-aeris-global-icon="close"]');
  await expect(close).toBeVisible();
  await expect(close).toHaveCSS('mask-image', 'none');
  const dimensions = await close.locator('svg').boundingBox();
  expect(dimensions?.width).toBeGreaterThanOrEqual(12);
  expect(dimensions?.width).toBeLessThanOrEqual(20);
  expect(dimensions?.height).toBe(dimensions?.width);
  expect(await close.evaluate((element) => getComputedStyle(element, '::before').display)).toBe(
    'none',
  );
  const edit = fixture.locator('[data-aeris-global-icon="edit"]');
  await expect(edit).toBeVisible();
  await expect(edit).toHaveCSS('mask-image', 'none');
  await fixture.getByRole('button', { name: 'Toggle local icon override' }).click();
  await expect(input.locator('[data-local-close]')).toBeVisible();
  await expect(close).toHaveCount(0);
  await fixture.getByRole('button', { name: 'Toggle local icon override' }).click();
  await expect(close).toBeVisible();
  const select = fixture.getByRole('combobox', { name: 'Global icon select' });
  await select.click();
  await page.getByRole('option', { name: 'Design', exact: true }).click();
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await fixture.getByRole('button', { name: 'Open global icon dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Global icons', exact: true });
  await expect(dialog.locator('[data-global-close]')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await expect(dialog).not.toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include('[data-fixture="global-icons"]')
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await fixture.evaluate((element) => element.setAttribute('dir', 'rtl'));
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await fixture.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  await input.locator('button').click();
  await expect(input.locator('input')).toHaveValue('');
});
