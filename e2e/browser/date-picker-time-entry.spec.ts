import AxeBuilder from '@axe-core/playwright';
import {
  aerisContrastRatio,
  parseAerisColor,
} from '../../projects/aeris-ui/theme-builder/aeris-color';
import { expect, test } from './fixtures';

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`popup time controls retain readable contrast in ${palette} ${mode}`, async ({
      page,
      hasTouch,
    }) => {
      await page.goto(`/?palette=${palette}&mode=${mode}`);
      const picker = page
        .locator('aeris-date-picker')
        .filter({ has: page.locator('#typed-arabic-time') });
      await picker.scrollIntoViewIfNeeded();
      await picker.locator('[data-segment="hour"]').press('Alt+ArrowDown');
      const panel = page.getByRole('dialog', { name: 'Choose a time', exact: true });
      const period = panel.getByRole('button', { name: 'Period AM', exact: true });
      const hoverColor = await panel.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--aeris-interactive-hover').trim(),
      );
      const expected = parseAerisColor(hoverColor);
      if (!expected) throw new Error(`Unexpected hover color: ${hoverColor}`);
      const hoverBackground = `rgb(${expected.red}, ${expected.green}, ${expected.blue})`;
      if (!hasTouch) {
        for (const button of [
          period,
          panel.getByRole('button', { name: 'Increase Hour' }),
          panel.getByRole('button', { name: 'Decrease Hour' }),
        ]) {
          await button.hover();
          await expect(button).toHaveCSS('background-color', hoverBackground);
          const colors = await button.evaluate((element) => {
            const style = getComputedStyle(element);
            return { foreground: style.color, background: style.backgroundColor };
          });
          expect(aerisContrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(
            4.5,
          );
        }
      } else {
        const hour = panel.getByRole('spinbutton', { name: 'Hour', exact: true });
        await expect(hour.locator('.wheel-selection')).toHaveCount(0);
        const foreground = await hour
          .locator('[data-selected]')
          .evaluate((element) => getComputedStyle(element).color);
        const background = await hour.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        );
        expect(aerisContrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
        await period.tap();
        await expect(panel.getByRole('button', { name: 'Period PM', exact: true })).toBeVisible();
      }
    });
  }
}

test('popup time controls use styled steppers and toggle AM/PM without closing', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const picker = page
    .locator('aeris-date-picker')
    .filter({ has: page.locator('#typed-arabic-time') });
  await picker.scrollIntoViewIfNeeded();
  await picker.locator('[data-segment="hour"]').press('Alt+ArrowDown');
  const panel = page.getByRole('dialog', { name: 'Choose a time', exact: true });
  const hour = panel.getByRole('spinbutton', { name: 'Hour', exact: true });
  await expect(hour).toBeFocused();
  await expect(panel.locator('select')).toHaveCount(0);
  if (!hasTouch) {
    await expect(panel.getByRole('button', { name: 'Increase Hour' })).toBeVisible();
    await panel.getByRole('button', { name: 'Increase Hour' }).click();
    await expect(hour).toHaveValue('11');
  } else {
    await expect(hour).toHaveAttribute('aria-valuenow', '10');
    for (const input of await panel.locator('input[type="number"]').all())
      await expect(input).toBeHidden();
  }
  const period = panel.getByRole('button', { name: 'Period AM', exact: true });
  if (hasTouch) await period.tap();
  else await period.click();
  const pm = panel.getByRole('button', { name: 'Period PM', exact: true });
  await expect(pm).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('input[name="typedArabicTime"]')).toHaveValue(
    hasTouch ? '22:15' : '23:15',
  );
  await pm.press('Space');
  await expect(panel.getByRole('button', { name: 'Period AM', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(panel).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include(`#${await panel.getAttribute('id')}`)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});

test('touch time wheels move continuously, snap on release and preserve page scroll', async ({
  page,
  hasTouch,
  browserName,
}) => {
  test.skip(!hasTouch, 'Touch wheels replace the popup number fields on coarse-pointer devices');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const picker = page
    .locator('aeris-date-picker')
    .filter({ has: page.locator('#typed-date-time') });
  await picker.scrollIntoViewIfNeeded();
  await picker.locator('[data-segment="hour"]').press('Alt+ArrowDown');
  const panel = page.getByRole('dialog', { name: 'Choose a date', exact: true });
  const minute = panel.getByRole('spinbutton', { name: 'Minute', exact: true });
  await expect
    .poll(() =>
      panel.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
  await minute.scrollIntoViewIfNeeded();
  const geometry = await minute.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const rows = element.querySelectorAll('.wheel-row');
    return {
      height: bounds.height,
      previousBottom: rows[0].getBoundingClientRect().bottom - bounds.top,
      nextTop: rows[2].getBoundingClientRect().top - bounds.bottom,
      selectionCount: element.querySelectorAll('.wheel-selection').length,
    };
  });
  expect(geometry.height).toBeCloseTo(46, 0);
  expect(geometry.previousBottom).toBeLessThanOrEqual(1.5);
  expect(geometry.nextTop).toBeGreaterThanOrEqual(-1.5);
  expect(geometry.selectionCount).toBe(0);
  const box = await minute.boundingBox();
  if (!box) throw new Error('Minute wheel has no bounds');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const scroll = await page.evaluate(() => window.scrollY);
  const client = browserName === 'chromium' ? await page.context().newCDPSession(page) : null;
  if (client) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: y - 54 }],
    });
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y - 54, { steps: 5 });
  }
  await expect(minute).toHaveAttribute('data-dragging', 'true');
  await expect(minute).toHaveAttribute('aria-valuenow', '31');
  const track = minute.locator('.wheel-track');
  await expect(track).toHaveCSS('translate', '0px -10px');
  await expect(picker.locator('[data-segment="minute"]')).toHaveValue('30');
  if (client) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await client.detach();
  } else await page.mouse.up();
  await expect(minute).not.toHaveAttribute('data-dragging');
  await expect(picker.locator('[data-segment="minute"]')).toHaveValue('31');
  await expect(track).toHaveCSS('translate', '0px');
  expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('transition-duration', '0s');
  await minute.press('Escape');
  await expect(picker.locator('[data-segment="hour"]')).toBeFocused();
});

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
  hasTouch,
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
  const minute = panel.getByRole('spinbutton', { name: 'Minute', exact: true });
  if (hasTouch) await minute.press('End');
  else await minute.fill('45');
  await expect(picker.locator('[data-segment="minute"]')).toHaveValue(hasTouch ? '59' : '45');
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

for (const direction of ['ltr', 'rtl']) {
  test(`editable date clear action does not cover segments in ${direction}`, async ({ page }) => {
    await page.goto('/?direction=' + direction);
    const picker = page
      .locator('aeris-date-picker')
      .filter({ has: page.locator('#typed-booking') });
    await picker.scrollIntoViewIfNeeded();
    const clear = picker.getByRole('button', { name: 'Clear date', exact: true });
    const bounds = await clear.boundingBox();
    expect(bounds).not.toBeNull();
    for (const segment of await picker.locator('[data-segment]').all()) {
      const part = await segment.boundingBox();
      expect(part).not.toBeNull();
      if (bounds && part) {
        expect(part.x + part.width <= bounds.x || part.x >= bounds.x + bounds.width).toBe(true);
      }
    }
    await clear.click();
    await expect(picker.locator('[data-segment="day"]')).toHaveValue('');
  });
}

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
