import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const mode of ['light', 'dark']) {
  test(`typed clock supports native submission and incomplete validation in ${mode}`, async ({
    page,
  }) => {
    await page.goto(`/?mode=${mode}`);
    const form = page.locator('[data-time-form]');
    const picker = form.locator('aeris-date-picker');
    await expect(picker.locator('[data-segment="hour"]')).not.toHaveAttribute('aria-invalid');
    await form.getByRole('button', { name: 'Save clock', exact: true }).click();
    await expect(form.getByRole('status', { name: 'Clock submissions' })).toHaveText('0');
    await expect(picker.locator('[data-segment="hour"]')).toHaveAttribute('aria-invalid', 'true');
    for (const part of ['hour', 'minute', 'second'])
      await picker.locator(`[data-segment="${part}"]`).fill('00');
    await expect(page.locator('input[name="typedClock"]')).toHaveValue('00:00:00');
    await form.getByRole('button', { name: 'Save clock', exact: true }).click();
    await expect(form.getByRole('status', { name: 'Clock submissions' })).toHaveText('1');
    await picker.locator('[data-segment="minute"]').fill('');
    await expect(page.locator('input[name="typedClock"]')).toHaveValue('');
    const result = await new AxeBuilder({ page })
      .include('[data-fixture="date-entry"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test('date-time groups wrap without horizontal overflow and keep popup time edits in sync', async ({
  page,
}) => {
  await page.goto('/');
  const picker = page
    .locator('aeris-date-picker')
    .filter({ has: page.locator('#typed-date-time') });
  await picker.locator('[data-segment="hour"]').fill('23');
  await expect(page.locator('input[name="typedDateTime"]')).toHaveValue('2026-06-11T23:30:27');
  const geometry = await picker
    .locator('.aeris-date-picker-input')
    .evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth }));
  expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1);
  await picker.locator('[data-segment="hour"]').press('Alt+ArrowDown');
  const panel = page.getByRole('dialog', { name: 'Choose a date', exact: true });
  await panel.getByLabel('Minute', { exact: true }).fill('45');
  await expect(picker.locator('[data-segment="minute"]')).toHaveValue('45');
  await page.keyboard.press('Escape');
  await expect(picker.locator('[data-segment="hour"]')).toBeFocused();
});

test('localized periods and numeric time segments work with RTL keyboard navigation', async ({
  page,
}) => {
  await page.goto('/');
  const picker = page
    .locator('aeris-date-picker')
    .filter({ has: page.locator('#typed-arabic-time') });
  await picker.locator('[data-segment="hour"]').fill('٠٣');
  await picker.locator('[data-segment="dayPeriod"]').fill('م');
  await expect(page.locator('input[name="typedArabicTime"]')).toHaveValue('15:15');
  await picker.locator('[data-segment="minute"]').press('ArrowRight');
  await expect(picker.locator('[data-segment="hour"]')).toBeFocused();
});

test.describe('checked local clock bridge', () => {
  test.use({ timezoneId: 'Europe/Belgrade' });
  test('rejects a DST gap instead of silently changing the entered time', async ({ page }) => {
    await page.goto('/');
    const picker = page
      .locator('aeris-date-picker')
      .filter({ has: page.locator('#typed-date-time') });
    await picker.locator('[data-segment="month"]').fill('03');
    await picker.locator('[data-segment="day"]').fill('29');
    await picker.locator('[data-segment="hour"]').fill('02');
    await expect(page.locator('input[name="typedDateTime"]')).toHaveValue('');
    await expect(picker.locator('[data-segment="hour"]')).toHaveValue('02');
    await picker.locator('[data-segment="hour"]').fill('03');
    await expect(page.locator('input[name="typedDateTime"]')).toHaveValue('2026-03-29T03:30:27');
  });
});
