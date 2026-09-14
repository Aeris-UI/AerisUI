import { expect, test } from './fixtures';
import { expectInsideViewport } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('nested overlays stay usable and dialog focus returns to its trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' });
  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Create project' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Project name' })).toBeFocused();

  await dialog.getByRole('combobox', { name: 'Owner role' }).click();
  const panel = page.locator('body > .aeris-select__panel');
  await expect(panel).toBeVisible();
  await expectInsideViewport(panel, page);
  await page.getByRole('option', { name: 'Designer' }).click();
  await expect(panel).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('a dismissible backdrop does not click through to page content', async ({ page }) => {
  const underlay = page.getByRole('button', { name: 'Underlay target' });
  const box = await underlay.boundingBox();
  expect(box).not.toBeNull();
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const overlay = page.locator('.aeris-dialog__overlay');
  await expect(overlay).toBeVisible();
  if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(overlay).toHaveCount(0);
  await expect(page.getByLabel('Underlay click count')).toHaveText('0');
  await underlay.click();
  await expect(page.getByLabel('Underlay click count')).toHaveText('1');
});

test('tooltip remains attached to its target while the page scrolls', async ({ page }) => {
  const target = page.getByRole('button', { name: 'Tooltip target' });
  await target.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();

  const before = await target.boundingBox();
  const tooltipBefore = await tooltip.boundingBox();
  await page.getByRole('heading', { name: 'Menu' }).scrollIntoViewIfNeeded();
  const after = await target.boundingBox();
  const tooltipAfter = await tooltip.boundingBox();

  expect(before && tooltipBefore && after && tooltipAfter).toBeTruthy();
  if (before && tooltipBefore && after && tooltipAfter) {
    expect(Math.abs(tooltipAfter.y - after.y - (tooltipBefore.y - before.y))).toBeLessThan(3);
  }
});
