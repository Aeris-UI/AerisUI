import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('native fieldsets disable both appearances without hover feedback, preserving legend exceptions', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="native-choice-groups"]');
  await area.getByRole('button', { name: 'Disable fieldsets' }).click();
  for (const appearance of ['standard', 'card']) {
    const group = area.locator(`fieldset[data-appearance="${appearance}"]`);
    const checkbox = group.getByRole('checkbox', { name: 'Enabled checkbox', exact: true });
    await expect(checkbox).toBeDisabled();
    const label = checkbox.locator('..');
    await expect(label).toHaveCSS('cursor', 'not-allowed');
    expect(Number(await label.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
    const legend = group.getByRole('checkbox', { name: `${appearance} legend exception` });
    await expect(legend).toBeEnabled();
    await legend.locator('..').click();
    await expect(legend).toBeChecked();
    const first = group.getByRole('radio', { name: 'First choice', exact: true });
    await expect(first).toBeDisabled();
    await expect(first.locator('..')).toHaveCSS('cursor', 'not-allowed');
    if (!hasTouch) {
      const control = first.locator('..').locator('.aeris-radio__control');
      const border = await control.evaluate((el) => getComputedStyle(el).borderColor);
      const surfaceBorder = await label.evaluate((el) => getComputedStyle(el).borderColor);
      await first.locator('..').hover();
      await expect(control).toHaveCSS('border-color', border);
      await label.hover();
      await expect(label).toHaveCSS('border-color', surfaceBorder);
    }
  }
  await area.getByRole('button', { name: 'Enable fieldsets' }).click();
  for (const appearance of ['standard', 'card']) {
    const group = area.locator(`fieldset[data-appearance="${appearance}"]`);
    await expect(
      group.getByRole('checkbox', { name: 'Enabled checkbox', exact: true }),
    ).toBeEnabled();
    await expect(group.getByRole('checkbox', { name: 'Locked checkbox' })).toBeDisabled();
    await expect(group.getByRole('radio', { name: 'Locked choice' })).toBeDisabled();
  }
});

test('native radios share keyboard selection within form owners, not between forms', async ({
  page,
}) => {
  await page.goto('/');
  const area = page.locator('[data-fixture="native-choice-groups"]');
  const standard = area.locator('fieldset[data-appearance="standard"]');
  const card = area.locator('fieldset[data-appearance="card"]');
  const first = standard.getByRole('radio', { name: 'First choice', exact: true });
  await first.focus();
  await first.press('Space');
  await first.press('ArrowDown');
  await expect(standard.getByRole('radio', { name: 'Last choice' })).toBeChecked();
  await card.getByRole('radio', { name: 'First choice', exact: true }).locator('..').click();
  await expect(card.getByRole('radio', { name: 'First choice', exact: true })).toBeChecked();
  await expect(standard.getByRole('radio', { name: 'Last choice' })).toBeChecked();
  expect(await first.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(false);
  const result = await new AxeBuilder({ page })
    .include('[data-fixture="native-choice-groups"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});

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
