import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('overflowing tabs expose the last tab and defer content until activation', async ({
  page,
}) => {
  const fixture = page.locator('[data-fixture="tabs"]');
  await fixture.scrollIntoViewIfNeeded();
  await expect(fixture.getByRole('button', { name: 'Scroll tabs forward' })).toBeVisible();
  await expect(page.locator('[data-deferred-content]')).toHaveCount(0);

  const lastTab = fixture.getByRole('tab', { name: 'Deferred report' });
  await lastTab.click();
  await expect(lastTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-deferred-content]')).toBeVisible();

  await fixture.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(fixture.getByRole('tab', { name: 'Recent activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('table columns resize and reorder with keyboard controls', async ({ page }) => {
  const table = page.getByRole('table', { name: 'Team members' });
  await table.scrollIntoViewIfNeeded();
  const nameHeader = table.getByRole('columnheader').filter({ hasText: 'Name' });
  const beforeWidth = (await nameHeader.boundingBox())?.width;
  const resizer = table.getByRole('separator', { name: 'Resize Name column' });
  await resizer.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(async () => (await nameHeader.boundingBox())?.width).not.toBe(beforeWidth);

  const teamLabel = table.locator('th[data-field="team"] .aeris-table__header-label');
  await teamLabel.focus();
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(table.getByRole('columnheader').nth(0)).toContainText('Team');

  const viewport = page.locator('[data-fixture="data"] .aeris-table__viewport');
  await expect(viewport).toHaveCSS('overflow', /auto|scroll/);
});
