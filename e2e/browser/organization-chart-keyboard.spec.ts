import { expect, test } from './fixtures';

for (const direction of ['ltr', 'rtl'] as const) {
  test(`OrganizationChart manages one tab stop and tree navigation in ${direction}`, async ({
    page,
  }) => {
    await page.goto('http://127.0.0.1:4301/components/organization-chart');
    const chart = page.locator('aeris-organization-chart').first();
    await chart.evaluate((element, dir) => {
      element.setAttribute('dir', dir);
    }, direction);
    const nodes = chart.getByRole('treeitem');
    const parent = nodes.first();
    const child = nodes.nth(1);
    const expand = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const collapse = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    await expect(chart.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1);
    await parent.focus();
    await page.keyboard.press('ArrowDown');
    await expect(child).toBeFocused();
    await expect(child).toHaveAttribute('tabindex', '0');
    await expect(parent).toHaveAttribute('tabindex', '-1');
    await page.keyboard.press('ArrowUp');
    await expect(parent).toBeFocused();
    await page.keyboard.press(expand);
    await expect(child).toBeFocused();
    if ((await child.getAttribute('aria-expanded')) === 'true') {
      await page.keyboard.press(collapse);
      await expect(child).toHaveAttribute('aria-expanded', 'false');
      await expect(child).toBeFocused();
    }
    await page.keyboard.press(collapse);
    await expect(parent).toBeFocused();
    await page.keyboard.press(collapse);
    await expect(parent).toHaveAttribute('aria-expanded', 'false');
    await expect(nodes).toHaveCount(1);
    await page.keyboard.press(expand);
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await expect(parent).toBeFocused();
    await page.keyboard.press('End');
    await expect(nodes.last()).toBeFocused();
    await page.keyboard.press('Home');
    await expect(parent).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await chart.evaluate((element) => element.contains(document.activeElement))).toBe(false);
  });
}
