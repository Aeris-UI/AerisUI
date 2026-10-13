import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
test.use({ hasTouch: true });

test('CascadeSelect examples stay compact and fit narrow screens', async ({ page }) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components/cascade-select');
    const fields = page.locator('app-form-demo aeris-cascade-select');
    await expect(fields).toHaveCount(15);
    for (const field of await fields.all()) {
      await expect
        .poll(() =>
          field.evaluate((element) => {
            const box = element.getBoundingClientRect();
            return box.width <= 289 && box.left >= 0 && box.right <= innerWidth;
          }),
        )
        .toBe(true);
    }
    await page.locator('#cascade-basic-input').tap();
    await expect
      .poll(() =>
        page
          .locator('.aeris-cascade-select__panel')
          .evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeLessThanOrEqual(289);
  }
});

for (const width of [320, 390]) {
  for (const direction of ['ltr', 'rtl']) {
    test(`CascadeSelect mobile branches expand and collapse at ${width}px in ${direction}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/components/cascade-select');
      await page
        .locator('html')
        .evaluate((element, direction) => (element.dir = direction), direction);
      const trigger = page.locator('#cascade-basic-input');
      await trigger.tap();
      const panel = page.locator('.aeris-cascade-select__panel');
      const europe = panel.getByRole('treeitem', { name: 'Europe', exact: true });
      await europe.tap();
      await expect(europe).toHaveAttribute('aria-expanded', 'true');
      await expect(panel.getByRole('treeitem', { name: 'Portugal', exact: true })).toBeVisible();
      await expect(
        panel.getByRole('treeitem', { name: 'North America', exact: true }),
      ).toBeVisible();
      await expect(panel.locator('.aeris-cascade-select__submenu')).toHaveCSS('position', 'static');
      if (width === 390 && direction === 'ltr') {
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(page.getByRole('group', { name: 'Europe', exact: true })).toHaveCSS(
          'position',
          'fixed',
        );
        await page.setViewportSize({ width, height: 800 });
        await expect(panel.locator('.aeris-cascade-select__submenu')).toHaveCSS(
          'position',
          'static',
        );
      }
      await europe.tap();
      await expect(europe).toHaveAttribute('aria-expanded', 'false');
      await expect(panel.getByRole('treeitem', { name: 'Portugal', exact: true })).toHaveCount(0);
      await expect(trigger).toContainText('Choose a location');
      await europe.tap();
      await panel.getByRole('treeitem', { name: 'Portugal', exact: true }).tap();
      await expect
        .poll(() =>
          panel.evaluate((element) => {
            const box = element.getBoundingClientRect();
            return (
              box.left >= 0 &&
              box.right <= innerWidth &&
              element.scrollWidth <= element.clientWidth + 1
            );
          }),
        )
        .toBe(true);
      await panel.getByRole('treeitem', { name: 'Lisbon', exact: true }).tap();
      await expect(trigger).toContainText('Europe / Portugal / Lisbon');
      await expect(panel).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}

for (const direction of ['ltr', 'rtl']) {
  test(`CascadeSelect desktop flyouts anchor inside the viewport in ${direction}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/components/cascade-select');
    await page
      .locator('html')
      .evaluate((element, direction) => (element.dir = direction), direction);
    const trigger = page.locator('#cascade-basic-input');
    await trigger.click();
    const europe = page.getByRole('treeitem', { name: 'Europe', exact: true });
    await europe.hover();
    const children = page.getByRole('group', { name: 'Europe', exact: true });
    await expect(children).toBeVisible();
    await expect
      .poll(async () => {
        const parent = await page.locator('.aeris-cascade-select__panel').boundingBox();
        const child = await children.boundingBox();
        if (!parent || !child) return Infinity;
        return Math.min(
          Math.abs(child.x - (parent.x + parent.width)),
          Math.abs(parent.x - (child.x + child.width)),
        );
      })
      .toBeLessThan(1);
    await expect
      .poll(async () => {
        const parent = await europe.boundingBox(),
          child = await children.boundingBox();
        return (
          !!parent &&
          !!child &&
          Math.abs(parent.y - child.y) < 2 &&
          child.x >= 0 &&
          child.x + child.width <= 1280
        );
      })
      .toBe(true);
    await page.getByRole('treeitem', { name: 'Portugal', exact: true }).hover();
    await expect(page.getByRole('group', { name: 'Portugal', exact: true })).toBeVisible();
    await expect
      .poll(async () => {
        const parent = await children.boundingBox();
        const child = await page
          .getByRole('group', { name: 'Portugal', exact: true })
          .boundingBox();
        if (!parent || !child) return Infinity;
        return Math.min(
          Math.abs(child.x - (parent.x + parent.width)),
          Math.abs(parent.x - (child.x + child.width)),
        );
      })
      .toBeLessThan(1);
    const accessibility = await new AxeBuilder({ page })
      .include('.aeris-cascade-select__panel')
      .include('.aeris-cascade-select__submenu')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.getByRole('treeitem', { name: 'Lisbon', exact: true }).click();
    await expect(trigger).toContainText('Lisbon');
    await expect(
      page.locator('.aeris-cascade-select__panel,.aeris-cascade-select__submenu'),
    ).toHaveCount(0);
    await trigger.press('Enter');
    await expect(trigger).toHaveAttribute('aria-activedescendant', /lisbon/);
    await trigger.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
