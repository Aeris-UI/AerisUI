import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const direction of ['ltr', 'rtl']) {
  test(`table rows support keyboard, pick-and-place and dragging in ${direction}`, async ({
    page,
    browserName,
    hasTouch,
    context,
  }) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.goto('/components/table');
    const scope = page.locator('#table-row-reordering .row-reorder-demo');
    await scope.scrollIntoViewIfNeeded();
    const handle = (key: string) =>
      scope.locator(`tr[data-row-reorder-key="${key}"] .aeris-table__row-reorder`);
    const order = () =>
      scope
        .locator('tr[data-row-reorder-key]')
        .evaluateAll((rows) => rows.map((row) => row.getAttribute('data-row-reorder-key')));
    await expect(handle('4')).toBeDisabled();
    await expect(handle('1')).toHaveCSS('cursor', 'grab');
    if (hasTouch) {
      const bounds = await handle('1').boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
    }
    await handle('1').press('Alt+ArrowDown');
    await expect.poll(order).toEqual(['2', '1', '3', '4']);
    await expect(handle('1')).toBeFocused();
    await expect(scope.getByRole('status')).toContainText('position 2');
    if (hasTouch) await handle('2').tap();
    else await handle('2').click();
    await expect(handle('2')).toHaveAttribute('aria-pressed', 'true');
    if (hasTouch) await handle('3').tap();
    else await handle('3').click();
    await expect.poll(order).toEqual(['1', '3', '2', '4']);
    await expect(handle('2')).toBeFocused();
    await scope.getByRole('button', { name: 'Move first row down' }).click();
    await expect.poll(order).toEqual(['3', '1', '2', '4']);
    const start = await handle('3').boundingBox();
    const end = await handle('2').boundingBox();
    if (!start || !end) throw new Error('Expected visible reorder handles');
    const x = start.x + start.width / 2;
    const y = start.y + start.height / 2;
    const targetY = end.y + end.height / 2;
    if (browserName === 'chromium' && hasTouch) {
      const client = await context.newCDPSession(page);
      try {
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x, y }],
        });
        for (let step = 1; step <= 6; step++) {
          await client.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y: y + ((targetY - y) * step) / 6 }],
          });
        }
        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } finally {
        await client.detach();
      }
    } else {
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x, targetY, { steps: 6 });
      await page.mouse.up();
    }
    await expect.poll(order).toEqual(['1', '2', '3', '4']);
    await expect(handle('3')).toHaveAttribute('aria-pressed', 'false');
    await expect(handle('3')).toBeFocused();
    const first = await handle('1').boundingBox();
    const third = await handle('3').boundingBox();
    if (!first || !third) throw new Error('Expected visible reorder handles');
    await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
    await page.mouse.down();
    await page.mouse.move(third.x + third.width / 2, third.y + third.height / 2, { steps: 5 });
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await expect.poll(order).toEqual(['1', '2', '3', '4']);
    await expect(scope.locator('[data-row-dragging]')).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    const axe = await new AxeBuilder({ page })
      .include('#table-row-reordering .row-reorder-demo')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
  });
}
