import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] as const;
const THEMES = [
  ['earth', 'light', 'comfortable', 'rounded', 'ltr'],
  ['earth', 'dark', 'compact', 'soft', 'rtl'],
  ['coastal', 'light', 'compact', 'pill', 'ltr'],
  ['coastal', 'dark', 'comfortable', 'rounded', 'rtl'],
  ['orchid', 'light', 'comfortable', 'soft', 'ltr'],
  ['orchid', 'dark', 'compact', 'pill', 'rtl'],
  ['monochrome', 'light', 'compact', 'rounded', 'ltr'],
  ['monochrome', 'dark', 'comfortable', 'soft', 'rtl'],
] as const;

async function expectNoAutomatedViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags([...WCAG_TAGS]).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

async function waitForTheme(page: Page, mode: 'light' | 'dark'): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
}

for (const [palette, mode, density, radius, direction] of THEMES) {
  test(`${palette} ${mode}, ${density}, ${radius}, ${direction} has no automated WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(
      `/?palette=${palette}&mode=${mode}&density=${density}&radius=${radius}&direction=${direction}`,
    );
    await waitForTheme(page, mode);
    await expectNoAutomatedViolations(page);
  });
}

test('open form, menu, dialog, and toast states have no automated violations', async ({ page }) => {
  await page.goto('/');
  await waitForTheme(page, 'light');

  await page.getByRole('combobox', { name: 'Role' }).click();
  await expectNoAutomatedViolations(page);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Open popup menu' }).click();
  await expectNoAutomatedViolations(page);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expectNoAutomatedViolations(page);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Show toast' }).click();
  await expectNoAutomatedViolations(page);
});

test('keyboard focus, validation semantics, reflow, and reduced motion remain usable', async ({
  page,
}) => {
  await page.goto('/');
  const name = page.getByRole('textbox', { name: 'Required name' });
  await name.focus();
  await expect(name).toBeFocused();
  await name.blur();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toBeVisible();

  const trigger = page.getByRole('button', { name: 'Open dialog' });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Create project' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator(':focus')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 320, height: 640 });
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);

  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator('.aeris-toast__item')).toHaveCSS('transition-duration', '0s');
});
