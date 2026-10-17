import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const kind of ['table', 'tree-table'] as const) {
  for (const direction of ['ltr', 'rtl']) {
    test(`${kind} supports complete selection and column workflows in ${direction}`, async ({
      page,
    }, testInfo) => {
      await page.addInitScript(
        (dir) => localStorage.setItem('aeris-docs-direction', dir),
        direction,
      );
      await page.goto(`/components/${kind}`);
      const scope = page.locator(`#${kind}-selection-workflow .selection-workflow`);
      // Escaping absolute table content can widen the mobile layout viewport in RTL,
      // shifting touch hit targets even when the workflow itself has no overflow.
      const expectPageFits = async () => {
        const viewport = await page.evaluate(() => ({
          layout: window.innerWidth,
          client: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(viewport.layout).toBeLessThanOrEqual(viewport.client + 1);
        expect(viewport.content).toBeLessThanOrEqual(viewport.client + 1);
      };
      await expectPageFits();
      const count = scope.locator('[aerisToolbarStart]');
      const selectRow = async () => {
        const label = scope
          .locator('tbody label.aeris-checkbox')
          .filter({ has: page.locator('input[type="checkbox"]:enabled') })
          .first();
        if (testInfo.project.name.startsWith('mobile-')) await label.tap();
        else await label.click();
      };
      const columns = scope.getByRole('button', { name: 'Columns', exact: true });
      const clear = scope.getByRole('button', { name: 'Clear selection', exact: true });
      const remove = scope.getByRole('button', {
        name: kind === 'table' ? 'Remove selected members' : 'Remove selected files',
        exact: true,
      });
      const search = scope.getByRole('searchbox', {
        name: kind === 'table' ? 'Find members' : 'Find files',
      });
      const menu = page.getByRole('menu', {
        name: kind === 'table' ? 'Member columns' : 'File columns',
        exact: true,
      });
      await expect(scope).toHaveCSS('direction', direction);
      await expect(scope.locator('thead th[data-field="name"]')).toHaveCSS('text-align', 'start');
      await selectRow();
      await expect(count).toContainText('1 ');
      await scope.getByRole('button', { name: 'Next page', exact: true }).click();
      await selectRow();
      await expect(count).toContainText('2 ');
      await search.fill('No matching record');
      await expect(scope.locator('tbody input[type="checkbox"]')).toHaveCount(0);
      await expect(count).toContainText('2 ');
      await clear.click();
      await expect(count).toContainText('0 ');
      await expect(columns).toBeFocused();
      await search.fill('');

      // Filtering a column and then hiding it must not leave an invisible filter active.
      const field = kind === 'table' ? 'team' : 'owner';
      const label = kind === 'table' ? 'Team' : 'Owner';
      await scope
        .getByRole('searchbox', { name: `Filter ${label}`, exact: true })
        .fill(kind === 'table' ? 'Design' : 'Maya');
      await scope.locator(`thead th[data-field="${field}"] button`).first().click();
      await columns.click();
      await menu.getByRole('menuitem', { name: `Hide ${label}`, exact: true }).click();
      await expect(scope.locator(`thead th[data-field="${field}"]`)).toHaveCount(0);
      await expect(scope.locator('tbody input[type="checkbox"]:enabled')).toHaveCount(2);
      await columns.click();
      await menu.getByRole('menuitem', { name: `Show ${label}`, exact: true }).click();
      await expect(scope.locator(`thead th[data-field="${field}"]`)).not.toHaveAttribute(
        'aria-sort',
      );
      const nameHeader = scope.locator('thead th[data-field="name"] button').first();
      await nameHeader.press(direction === 'rtl' ? 'Alt+ArrowLeft' : 'Alt+ArrowRight');
      const fields = await scope
        .locator('thead tr')
        .first()
        .locator('th[data-field]')
        .evaluateAll((cells) => cells.map((cell) => cell.getAttribute('data-field')));
      expect(fields).toEqual(
        kind === 'table' ? ['team', 'name', 'status'] : ['type', 'name', 'owner'],
      );

      await selectRow();
      await scope.getByRole('button', { name: 'Next page', exact: true }).click();
      await selectRow();
      await remove.click();
      await expect(remove).toHaveAttribute('aria-busy', 'true');
      await expect(scope.locator('.workflow-note[role="status"]')).toContainText('Removed 2');
      await expect(count).toContainText('0 ');
      await expect(columns).toBeFocused();
      await expect(remove).toBeDisabled();
      await scope
        .getByRole('button', {
          name: kind === 'table' ? 'Restore members' : 'Restore files',
          exact: true,
        })
        .click();
      await expect(scope.locator('tbody input[type="checkbox"]:enabled')).toHaveCount(2);
      await expect(scope.locator('.workflow-note[role="status"]')).toContainText('restored');
      const overflow = await scope.evaluate((element) => element.scrollWidth - element.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      await expectPageFits();
      const axe = await new AxeBuilder({ page })
        .include(`#${kind}-selection-workflow .selection-workflow`)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(axe.violations).toEqual([]);
    });
  }
}
