import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import { expectInsideViewport } from './helpers';

test('hover transit, focus ownership, cancellation and anchored scrolling remain usable', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const scope = page.locator('[data-fixture="hover-overlay"]');
  const trigger = scope.getByRole('button', { name: 'Preview person' });
  const preview = page.getByRole('region', { name: 'Person preview', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  if (hasTouch) await trigger.tap();
  else await trigger.hover();
  await expect(preview).toBeVisible();
  await expectInsideViewport(preview, page);
  const start = await trigger.boundingBox();
  const end = await preview.boundingBox();
  if (!start || !end) throw new Error('Expected trigger and preview bounds');
  if (!hasTouch) {
    await page.mouse.move(start.x + start.width / 2, start.y + start.height + 5);
    await expect(preview).toBeVisible();
    await page.mouse.move(end.x + end.width / 2, end.y + 10, { steps: 4 });
    await expect(preview).toBeVisible();
    await preview.getByRole('button', { name: 'Preview action' }).click();
    await expect(scope.getByLabel('Preview actions')).toHaveText('1');
    // Focus keeps content open after the pointer leaves both regions.
    await page.mouse.move(2, 2);
    await expect(preview).toBeVisible();
  }
  await trigger.focus();
  const before = await trigger.boundingBox();
  const beforePanel = await preview.boundingBox();
  await page.evaluate(() => window.scrollBy({ top: 80, behavior: 'instant' }));
  await expect
    .poll(async () => {
      const anchor = await trigger.boundingBox();
      const panel = await preview.boundingBox();
      if (!before || !beforePanel || !anchor || !panel) return Infinity;
      return Math.abs(panel.y - anchor.y - (beforePanel.y - before.y));
    })
    .toBeLessThan(3);
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.waitForTimeout(150);
  await expect(preview).toHaveCount(0);
  await scope.getByRole('button', { name: 'Outside target' }).focus();
  await trigger.focus();
  await expect(preview).toBeVisible();
  await expect(trigger).toBeFocused();
  const axe = await new AxeBuilder({ page })
    .include('[data-fixture="hover-overlay"]')
    .include('#foundation-preview')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(axe.violations).toEqual([]);
});

for (const mount of ['body', 'self']) {
  for (const direction of ['ltr', 'rtl']) {
    test(`nested ${mount} popovers align in ${direction} and dismiss one layer at a time`, async ({
      page,
    }) => {
      await page.goto(`/?mount=${mount}&direction=${direction}`);
      const trigger = page.getByRole('button', { name: 'Open parent preview' });
      await trigger.click();
      const parent = page.getByRole('dialog', { name: 'Parent preview', exact: true });
      await expect(parent).toBeVisible();
      await expectInsideViewport(parent, page);
      const anchor = await trigger.boundingBox();
      const panel = await parent.boundingBox();
      if (!anchor || !panel) throw new Error('Expected positioned popover');
      const desired = direction === 'rtl' ? anchor.x + anchor.width - panel.width : anchor.x;
      const expected = Math.max(
        8,
        Math.min(desired, (page.viewportSize()?.width ?? 0) - panel.width - 8),
      );
      expect(Math.abs(panel.x - expected)).toBeLessThan(3);
      await parent.getByRole('button', { name: 'Open child preview' }).click();
      const child = page.getByRole('dialog', { name: 'Child preview', exact: true });
      await expect(child).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(child.getByRole('button', { name: 'Child action' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(child).toHaveCount(0);
      await expect(parent).toBeVisible();
      await expect(parent.getByRole('button', { name: 'Open child preview' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(parent).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}
