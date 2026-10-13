import { expect, test } from './fixtures';

test('PickList places both reorder toolbars above their lists on mobile', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/components/pick-list');
    const pickList = page.locator('app-form-demo aeris-pick-list').first();
    await expect(pickList).toBeVisible();
    for (const direction of ['ltr', 'rtl']) {
      await pickList.evaluate((element, dir) => element.setAttribute('dir', dir), direction);
      for (const side of ['source', 'target']) {
        const body = pickList.locator(`.aeris-pick-list__pane-body[data-side=${side}]`);
        const controls = body.locator('.aeris-pick-list__reorder-controls');
        await expect(controls).toHaveCSS('grid-row-start', '1');
        await expect(controls).toHaveCSS('border-left-width', '0px');
        await expect(controls).toHaveCSS('border-right-width', '0px');
        await expect
          .poll(() =>
            body.evaluate((element) => {
              const controls = element.querySelector('.aeris-pick-list__reorder-controls');
              const viewport = element.querySelector('.aeris-pick-list__viewport');
              if (!controls || !viewport) return false;
              const bodyBox = element.getBoundingClientRect();
              const controlsBox = controls.getBoundingClientRect();
              const viewportBox = viewport.getBoundingClientRect();
              const buttons = Array.from(controls.querySelectorAll('button'));
              return (
                controlsBox.bottom <= viewportBox.top + 1 &&
                Math.abs(controlsBox.width - bodyBox.width) <= 1 &&
                viewportBox.right <= bodyBox.right + 1 &&
                buttons.length === 4 &&
                buttons.every(
                  (button) =>
                    Math.abs(
                      button.getBoundingClientRect().top - buttons[0].getBoundingClientRect().top,
                    ) <= 1,
                )
              );
            }),
          )
          .toBe(true);
      }
    }
  }
});
