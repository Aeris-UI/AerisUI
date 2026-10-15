import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('cancelled chip removal retains focus and controlled removal emits without hiding', async ({
  page,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="chip-removal"]');
  const remove = area.getByRole('button', { name: 'Remove Controlled filter', exact: true });
  await remove.focus();
  await page.keyboard.press('Delete');
  await expect(remove).toBeVisible();
  await expect(remove).toBeFocused();
  await expect(area.getByRole('status', { name: 'Chip removal requests' })).toHaveText('0');
  await area.getByRole('button', { name: 'Allow chip removal', exact: true }).click();
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(remove).toBeVisible();
  await expect(remove).toBeFocused();
  await expect(area.getByRole('status', { name: 'Chip removal requests' })).toHaveText('1');
});

test('standalone removal uses the consumer focus destination and can be restored', async ({
  page,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="chip-removal"]');
  const remove = area.getByRole('button', { name: 'Remove Standalone filter', exact: true });
  const restore = area.getByRole('button', { name: 'Restore standalone chip', exact: true });
  await remove.focus();
  await page.keyboard.press('Backspace');
  await expect(remove).toHaveCount(0);
  await expect(restore).toBeFocused();
  await page.keyboard.press('Space');
  await expect(remove).toBeVisible();
});

test('chip removal works with touch and pointer activation', async ({ page, hasTouch }) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="chip-removal"]');
  const remove = area.getByRole('button', { name: 'Remove Standalone filter', exact: true });
  if (hasTouch) await remove.tap();
  else await remove.click();
  await expect(remove).toHaveCount(0);
  await expect(area.getByRole('button', { name: 'Restore standalone chip' })).toBeFocused();
});

test('projected and long chip labels retain accessible names at narrow widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/?direction=rtl');
  const area = page.locator('[data-fixture="chip-removal"]');
  await expect(
    area.getByRole('button', { name: 'Remove Projected filter', exact: true }),
  ).toBeVisible();
  const long = area.locator('aeris-chip.long');
  await expect(long.locator('.aeris-chip__label')).toHaveCSS('text-overflow', 'ellipsis');
  await expect(long.getByRole('button')).toHaveAccessibleName(
    'Remove A very long category label that remains readable to assistive technology',
  );
  expect(await area.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
  await expect(area.locator('aeris-chip[tabindex]')).toHaveCount(0);
  const results = await new AxeBuilder({ page })
    .include('[data-fixture="chip-removal"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
