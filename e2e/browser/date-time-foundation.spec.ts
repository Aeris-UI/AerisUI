import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const mode of ['light', 'dark'] as const) {
  test(`time edits preserve incomplete values and keep midnight display and serialization aligned in ${mode}`, async ({
    page,
  }) => {
    await page.goto(`/?mode=${mode}`);
    const trigger = page.getByRole('combobox', { name: 'Foundation meeting', exact: true });
    await expect(trigger).toContainText('00:00:00');
    await trigger.click();
    const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`);
    await expect(panel).toBeVisible();
    const hidden = page.locator('input[name="foundationMeeting"]');
    await expect(hidden).toHaveValue('2026-06-11T00:00:00');
    await panel.getByLabel('Minute', { exact: true }).fill('');
    await expect(hidden).toHaveValue('2026-06-11T00:00:00');
    await panel.getByLabel('Minute', { exact: true }).fill('30');
    await panel.getByLabel('Hour', { exact: true }).fill('13');
    await expect(hidden).toHaveValue('2026-06-11T13:30:00');
    await expect(trigger).toContainText('13:30:00');
    const result = await new AxeBuilder({ page })
      .include(`#${await trigger.getAttribute('aria-controls')}`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    await panel.getByLabel('Hour', { exact: true }).press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}

test('early years stay in their calendar century when selected', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('combobox', { name: 'Early calendar year', exact: true });
  await trigger.click();
  const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`);
  const day = panel.locator('[data-date="0042-06-12"]');
  await expect(day).toBeEnabled();
  await day.click();
  await expect(page.locator('input[name="foundationEarly"]')).toHaveValue('0042-06-12');
  await expect(panel).not.toBeVisible();
});

test('locale-derived week starts use Monday without a manual override', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('combobox', { name: 'British calendar', exact: true });
  await trigger.click();
  const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`);
  await expect(panel.locator('.aeris-date-picker__weekdays span').first()).toHaveText('Mon');
  await expect(panel.locator('[data-date="2026-06-11"][aria-selected="true"]')).toHaveCount(1);
});

for (const mode of ['light', 'dark'] as const) {
  test(`segmented fields accept typed dates, expose native validity and meet contrast in ${mode}`, async ({
    page,
  }) => {
    await page.goto(`/?mode=${mode}`);
    const form = page.locator('[data-date-form]');
    const field = form.locator('aeris-internal-date-picker-input');
    await field.locator('[data-segment="year"]').fill('');
    await expect(page.locator('input[name="nativeBirthday"]')).toHaveValue('');
    await form.getByRole('button', { name: 'Submit date', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Native submissions' })).toHaveText('0');
    await expect(field).toHaveAttribute('data-invalid');
    await field.locator('[data-segment="year"]').fill('2024');
    await field.locator('[data-segment="month"]').fill('02');
    await field.locator('[data-segment="day"]').fill('29');
    await expect(page.locator('input[name="nativeBirthday"]')).toHaveValue('2024-02-29');
    await form.getByRole('button', { name: 'Submit date', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Native submissions' })).toHaveText('1');
    const result = await new AxeBuilder({ page })
      .include('[data-fixture="date-entry"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
test('Signal Forms submission touches incomplete segments and a valid date clears errors', async ({
  page,
}) => {
  await page.goto('/');
  const field = page
    .locator('aeris-internal-date-picker-input')
    .filter({ has: page.locator('#signal-birthday') });
  await expect(field).not.toHaveAttribute('data-invalid');
  await page.getByRole('button', { name: 'Save signal date' }).click();
  await expect(field).toHaveAttribute('data-invalid');
  await field.locator('[data-segment="month"]').fill('06');
  await field.locator('[data-segment="day"]').fill('11');
  await field.locator('[data-segment="year"]').fill('2026');
  await expect(page.getByRole('status', { name: 'Signal date value' })).toHaveText('2026-06-11');
  await expect(field).not.toHaveAttribute('data-invalid');
});

test('continuous numeric typing advances segments and Tab leaves the field normally', async ({
  page,
}) => {
  await page.goto('/');
  const field = page.locator('[data-date-form] aeris-internal-date-picker-input');
  await field.locator('[data-segment="month"]').focus();
  await page.keyboard.type('12152025');
  await expect(page.locator('input[name="nativeBirthday"]')).toHaveValue('2025-12-15');
  await expect(field.locator('[data-segment="year"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-date-form] .aeris-date-picker__entry-trigger')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Submit date', exact: true })).toBeFocused();
});
test('typed field surface focuses its first segment, direct clicks retain the chosen segment and calendar artwork is visible', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const picker = page.locator('aeris-date-picker').filter({ has: page.locator('#typed-booking') });
  const surface = picker.locator('.aeris-date-picker-input');
  const box = await surface.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  const position = { x: 4, y: box.height / 2 };
  if (isMobile) await surface.tap({ position });
  else await surface.click({ position });
  await expect(picker.locator('[data-segment="month"]')).toBeFocused();
  if (isMobile) await picker.locator('[data-segment="year"]').tap();
  else await picker.locator('[data-segment="year"]').click();
  await expect(picker.locator('[data-segment="year"]')).toBeFocused();
  const icon = picker.locator('.aeris-date-picker__entry-icon');
  const artwork = await icon.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      mask: style.maskImage,
      background: style.backgroundColor,
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    };
  });
  expect(artwork.mask).toContain('svg');
  expect(artwork.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(artwork.width).toBeGreaterThanOrEqual(16);
  expect(artwork.height).toBeGreaterThanOrEqual(16);
  await picker.getByRole('button', { name: 'Choose booking date', exact: true }).click();
  await expect(
    page.getByRole('dialog', { name: 'Choose booking date', exact: true }),
  ).toBeVisible();
});

test('typed DatePicker entry and calendar selection stay synchronized with focus returning to entry', async ({
  page,
}) => {
  await page.goto('/');
  const picker = page.locator('aeris-date-picker').filter({ has: page.locator('#typed-booking') });
  await picker.locator('[data-segment="month"]').fill('07');
  await expect(page.locator('input[name="typedBooking"]')).toHaveValue('2026-07-11');
  await picker.getByRole('button', { name: 'Choose booking date', exact: true }).click();
  const panel = page.getByRole('dialog', { name: 'Choose booking date', exact: true });
  await panel.locator('[data-date="2026-07-12"]').click();
  await expect(page.locator('input[name="typedBooking"]')).toHaveValue('2026-07-12');
  await expect(
    picker.getByRole('button', { name: 'Choose booking date', exact: true }),
  ).toBeFocused();
  await picker.locator('[data-segment="year"]').press('Alt+ArrowDown');
  await expect(panel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(picker.locator('[data-segment="year"]')).toBeFocused();
});
test('year-only typing and calendar clicks commit January 1', async ({ page }) => {
  await page.goto('/');
  const picker = page.locator('aeris-date-picker').filter({ has: page.locator('#typed-year') });
  await picker.locator('[data-segment="year"]').fill('2025');
  await expect(page.locator('input[name="typedYear"]')).toHaveValue('2025-01-01');
  await picker.getByRole('button', { name: 'Choose reporting year' }).click();
  await page.getByRole('option', { name: '2027', exact: true }).click();
  await expect(picker.locator('[data-segment="year"]')).toHaveValue('2027');
  await expect(page.locator('input[name="typedYear"]')).toHaveValue('2027-01-01');
});
test('localized segments navigate visually in RTL and nested portaled calendar focus stays owned', async ({
  page,
}) => {
  await page.goto('/');
  const arabic = page
    .locator('aeris-internal-date-picker-input')
    .filter({ has: page.locator('#arabic-entry') });
  await expect(arabic.locator('[data-segment="year"]')).toHaveValue('٢٠٢٦');
  await arabic.locator('[data-segment="month"]').focus();
  await arabic.locator('[data-segment="month"]').press('ArrowRight');
  await expect(arabic.locator('[data-segment="day"]')).toBeFocused();
  await page.getByRole('button', { name: 'Edit date in dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Booking details', exact: true });
  await dialog.getByRole('button', { name: 'Choose dialog date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Choose dialog date', exact: true });
  await expect(calendar).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(calendar).not.toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Choose dialog date' })).toBeFocused();
  await expect(dialog).toBeVisible();
});
