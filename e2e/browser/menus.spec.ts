import { expect, test } from './fixtures';
import { expectInsideViewport } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'Menu' }).scrollIntoViewIfNeeded();
});

test('popup menu stays anchored through viewport scrolling', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open popup menu' });
  await trigger.click();
  const panel = page.locator('.aeris-menu__panel[data-popup]');
  await expect(panel).toBeVisible();
  await expectInsideViewport(panel, page);

  const beforeTrigger = await trigger.boundingBox();
  const beforePanel = await panel.boundingBox();
  await page.evaluate(() => window.scrollBy(0, 160));
  await expect.poll(async () => (await panel.boundingBox())?.y).not.toBe(beforePanel?.y);
  const afterTrigger = await trigger.boundingBox();
  const afterPanel = await panel.boundingBox();

  expect(beforeTrigger && beforePanel && afterTrigger && afterPanel).toBeTruthy();
  if (beforeTrigger && beforePanel && afterTrigger && afterPanel) {
    expect(
      Math.abs(afterPanel.y - afterTrigger.y - (beforePanel.y - beforeTrigger.y)),
    ).toBeLessThan(3);
  }
});

test('tiered submenus support hover exit and keyboard traversal', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open tiered menu' });
  await trigger.click();
  const automation = page.getByRole('menuitem', { name: 'Automation' });
  await automation.hover();
  await expect(page.getByRole('menuitem', { name: 'Run now' })).toBeVisible();

  await page.getByRole('heading', { name: 'Menu' }).hover();
  await expect(page.getByRole('menuitem', { name: 'Run now' })).toHaveCount(0);

  await trigger.click();
  await expect(automation).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Run now' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
