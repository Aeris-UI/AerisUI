import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const direction of ['ltr', 'rtl']) {
  test(`card keeps projected text and actions inside its surface in ${direction}`, async ({
    page,
  }) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.goto('/components/card');
    const card = page.locator('#card-basic .preview aeris-card');
    await card.locator('[aerisCardTitle]').evaluate((title) => {
      title.textContent = 'LongUnbrokenHeading'.repeat(8);
    });
    await card.locator('.aeris-card__content p').evaluate((content) => {
      content.textContent = 'LongUnbrokenContent'.repeat(10);
    });
    await card.locator('[aerisCardSubtitle]').evaluate((subtitle) => {
      subtitle.textContent = 'LongUnbrokenSubtitle'.repeat(8);
    });
    const actions = card.getByRole('button');
    await actions.nth(0).evaluate((button) => {
      button.textContent = 'First card action';
    });
    await actions.nth(1).evaluate((button) => {
      button.textContent = 'Second card action';
    });
    await expect(card).toHaveAccessibleName('LongUnbrokenHeading'.repeat(8));
    await expect(card).toHaveAccessibleDescription('LongUnbrokenContent'.repeat(10));
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      const layout = await card.evaluate((element) => {
        const surface = element.querySelector('.aeris-card');
        if (!surface) throw new Error('A card surface is required.');
        const bounds = surface.getBoundingClientRect();
        return { overflow: surface.scrollWidth - surface.clientWidth, width: bounds.width };
      });
      expect(layout.width).toBeGreaterThan(0);
      expect(layout.overflow).toBeLessThanOrEqual(1);
      const textBounds = await card.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return Array.from(
          element.querySelectorAll('[aerisCardTitle], [aerisCardSubtitle], .aeris-card__content p'),
        ).every((text) => {
          const range = document.createRange();
          range.selectNodeContents(text);
          return Array.from(range.getClientRects()).every(
            (rect) => rect.left >= bounds.left && rect.right <= bounds.right + 1,
          );
        });
      });
      expect(textBounds).toBe(true);
    }
    const positions = await actions.evaluateAll((buttons) =>
      buttons.map((button) => button.getBoundingClientRect().top),
    );
    expect(positions[1]).toBeGreaterThan(positions[0]);
    await expect(card).not.toHaveAttribute('tabindex');
    expect(
      (await new AxeBuilder({ page }).include('#card-basic .preview').analyze()).violations,
    ).toEqual([]);
  });
}
