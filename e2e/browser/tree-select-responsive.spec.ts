import { expect, test } from './fixtures';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.goto('/components/tree-select');
});

test('TreeSelect checkbox mode keeps the panel open during repeated touch selection', async ({
  page,
}) => {
  const trigger = page.locator('#tree-checkbox');
  await trigger.tap();
  const panel = page.locator('.aeris-tree-select__panel');
  const node = panel.getByRole('treeitem').first();
  const initial = await node.getAttribute('aria-checked');
  await node.locator('.aeris-tree-select__node-content').tap();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(node).toHaveAttribute('aria-checked', initial === 'true' ? 'false' : 'true');
  await node.locator('.aeris-tree-select__node-content').tap();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(node).toHaveAttribute('aria-checked', initial === 'true' ? 'true' : 'false');
  await page.locator('h1').tap();
  await expect(panel).toHaveCount(0);
});

test('TreeSelect single mode commits touch selection and dismisses', async ({ page }) => {
  const trigger = page.locator('#tree-basic');
  await trigger.tap();
  const node = page.locator('.aeris-tree-select__panel [role=treeitem]').first();
  const label = await node.locator('.aeris-tree-select__node-content').innerText();
  await node.locator('.aeris-tree-select__node-content').tap();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toContainText(label.trim());
});
