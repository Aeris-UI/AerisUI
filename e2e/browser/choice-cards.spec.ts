import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('choice cards use native Space and radio arrow navigation with one change per activation', async ({
  page,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="choice-cards"]');
  const checkbox = area.getByRole('checkbox', { name: 'Weekly summary', exact: true });
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(area.getByRole('status', { name: 'Card changes' })).toHaveText('1');
  await expect(checkbox).toHaveAccessibleDescription(
    'Workspace activity and completed work, delivered every Monday.',
  );
  const standard = area.getByRole('radio', { name: 'Regular shipping', exact: true });
  const express = area.getByRole('radio', { name: 'Next day shipping', exact: true });
  await standard.focus();
  await page.keyboard.press('ArrowDown');
  await expect(express).toBeFocused();
  await expect(express).toBeChecked();
  await page.keyboard.press('ArrowUp');
  await expect(standard).toBeFocused();
  await expect(standard).toBeChecked();
  await expect(area.getByRole('radio', { name: 'Local pickup', exact: true })).toBeDisabled();
  await expect(standard.locator('..')).toHaveCSS('outline-style', 'solid');
  await expect(standard.locator('..').locator('.aeris-radio__control')).toHaveCSS(
    'outline-style',
    'none',
  );
});

test('card whitespace activates the native control and disabled card whitespace does not', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="choice-cards"]');
  const label = area.locator('aeris-checkbox label').first();
  // Click the card padding, not its text or indicator.
  if (hasTouch) {
    await label.tap({ position: { x: 6, y: 6 } });
  } else {
    await label.click({ position: { x: 6, y: 6 } });
  }
  await expect(area.getByRole('checkbox', { name: 'Weekly summary', exact: true })).toBeChecked();
  await expect(area.getByRole('status', { name: 'Card changes' })).toHaveText('1');
  const disabledBounds = await area.locator('aeris-checkbox label').last().boundingBox();
  if (!disabledBounds) throw new Error('The disabled card must be rendered.');
  if (hasTouch) {
    await page.touchscreen.tap(disabledBounds.x + 6, disabledBounds.y + 6);
  } else {
    await page.mouse.click(disabledBounds.x + 6, disabledBounds.y + 6);
  }
  await expect(
    area.getByRole('checkbox', { name: 'Managed reports', exact: true }),
  ).not.toBeChecked();
});

for (const direction of ['ltr', 'rtl'] as const) {
  test(`choice cards fit narrow layouts in ${direction} without nested actions or accessibility violations`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(`/?direction=${direction}`);
    const area = page.locator('[data-fixture="choice-cards"]');
    await expect(area.getByRole('checkbox', { name: 'Weekly summary', exact: true })).toBeVisible();
    expect(await area.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(area.locator('label :is(button, a, [tabindex]):not(input)')).toHaveCount(0);
    const results = await new AxeBuilder({ page })
      .include('[data-fixture="choice-cards"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
