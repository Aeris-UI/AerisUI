import { expect, test } from './fixtures';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

for (const inputId of ['skills-basic', 'skills-filter']) {
  test(`MultiSelect ${inputId} stays open across mobile selections`, async ({ page }) => {
    // Selection behavior must not depend on downloading the docs web font.
    await page.route('https://fonts.googleapis.com/**', (route) =>
      route.fulfill({ contentType: 'text/css', body: '' }),
    );
    await page.goto('/components/multi-select');
    const trigger = page.locator(`#${inputId}`);
    await trigger.tap();
    const panel = page.locator('.aeris-multi-select__panel');
    const options = panel.getByRole('option');
    const first = options.nth(0);
    const second = options.nth(1);
    const initiallySelected = await first.getAttribute('aria-selected');
    await first.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute(
      'aria-selected',
      initiallySelected === 'true' ? 'false' : 'true',
    );
    await second.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await first.tap();
    await expect(first).toHaveAttribute('aria-selected', initiallySelected ?? 'false');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('h1').tap();
    await expect(panel).toHaveCount(0);
  });
}
