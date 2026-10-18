import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const direction of ['ltr', 'rtl']) {
  test(`Signal Forms bounds, typing and button geometry work in ${direction}`, async ({ page }) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.goto('/components/input-number');
    const demo = page.locator('#number-signals');
    const input = demo.getByRole('spinbutton', { name: 'Value (1–5)', exact: true });
    const increment = demo.getByRole('button', { name: 'Increase value' });
    const decrement = demo.getByRole('button', { name: 'Decrease value' });
    await expect(input).toHaveValue('3');
    await expect(input).toHaveAttribute('aria-valuemin', '1');
    await expect(input).toHaveAttribute('aria-valuemax', '5');
    await increment.click();
    await expect(demo.locator('small')).toHaveText('Current value: 4');
    await input.press('End');
    await expect(input).toHaveValue('5');
    await expect(increment).toBeDisabled();
    await input.press('Home');
    await expect(decrement).toBeDisabled();
    await input.fill('99');
    await input.press('Tab');
    await expect(input).toHaveValue('5');
    await input.fill('2');
    await input.press('Tab');
    await expect(demo.locator('small')).toHaveText('Current value: 2');
    const root = demo.locator('aeris-input-number');
    expect(await root.evaluate((element) => element.scrollWidth > element.clientWidth + 1)).toBe(
      false,
    );
    if (await page.evaluate(() => matchMedia('(pointer: coarse)').matches)) {
      for (const layout of ['horizontal', 'vertical']) {
        const buttons = page.locator(`#number-buttons [data-button-layout="${layout}"] button`);
        expect(await buttons.count()).toBe(2);
        for (const button of await buttons.all()) {
          const bounds = await button.boundingBox();
          expect(bounds?.width).toBeGreaterThanOrEqual(44);
          expect(bounds?.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
    expect(
      (await new AxeBuilder({ page }).include('#number-signals').analyze()).violations,
    ).toEqual([]);
  });
}

test('Signal Forms example remains accessible across preset schemes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/components/input-number');
  for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
    for (const mode of ['light', 'dark']) {
      await page.evaluate(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.reload();
      await expect(page.locator('#number-signal')).toHaveValue('3');
      expect(
        (await new AxeBuilder({ page }).include('#number-signals').analyze()).violations,
      ).toEqual([]);
    }
  }
});
