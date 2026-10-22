import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const component of ['table', 'tree-table']) {
  test(`${component} resolves table, column and cell editing permissions`, async ({ page }) => {
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-editing-permissions`);
    const rows = example.locator('tbody tr');
    const name = rows.first().locator('td[data-label="Name"]');
    const team = rows.first().locator('td[data-label="Team"]');
    await expect(name).toHaveAttribute('data-editable', 'true');
    await expect(team).toHaveAttribute('data-editable', 'true');
    await expect(rows.first().locator('td[data-label="Status"]')).not.toHaveAttribute(
      'data-editable',
    );
    await expect(rows.nth(1).locator('td[data-editable]')).toHaveCount(0);
    await expect(rows.nth(2).locator('td[data-label="Team"]')).not.toHaveAttribute('data-editable');
    await example.getByRole('button', { name: 'Table default: editable', exact: true }).click();
    await expect(name).not.toHaveAttribute('data-editable');
    await expect(name).not.toHaveAttribute('tabindex');
    await expect(team).toHaveAttribute('data-editable', 'true');
    await name.dblclick();
    await expect(example.locator('.aeris-cell-editor')).toHaveCount(0);
    await team.dblclick();
    const editor = example.getByRole('textbox', { name: 'Edit Team', exact: true });
    await expect(editor).toBeFocused();
    await editor.fill('Quality');
    await editor.press('Enter');
    await expect(team).toHaveText('Quality');
    expect(
      (await new AxeBuilder({ page }).include(`#${component}-editing-permissions`).analyze())
        .violations,
    ).toEqual([]);
    await page.setViewportSize({ width: 320, height: 740 });
    await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
    await team.dblclick();
    await expect(editor).toBeFocused();
    await editor.press('Escape');
    await expect(team).toHaveText('Quality');
  });

  test(`${component} switches custom editors and rejects invalid drafts`, async ({ page }) => {
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-custom-editors`);
    const row = example.locator('tbody tr').first();
    const status = row.locator('td[data-label="Status"]');
    const quantity = row.locator('td[data-label="Quantity"]');
    const name = row.locator('td[data-label="Name"]');
    await status.dblclick();
    const trigger = example.getByRole('combobox', { name: 'Edit Status', exact: true });
    await expect(trigger).toBeFocused();
    await example.locator('aeris-select').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`);
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => !element.closest('td'))).toBe(true);
    await trigger.press('Escape');
    await expect(panel).toBeHidden();
    await expect(trigger).toBeVisible();
    await example.locator('aeris-select').click();
    await page.getByRole('option', { name: 'Published', exact: true }).click();
    await quantity.dblclick();
    await expect(status).toHaveText('published');
    const number = example.getByRole('spinbutton', { name: 'Edit Quantity', exact: true });
    await expect(number).toBeFocused();
    await number.fill('-2');
    await expect(example.getByRole('alert')).toHaveText('Enter a quantity of zero or greater.');
    expect(
      (await new AxeBuilder({ page }).include(`#${component}-custom-editors`).analyze()).violations,
    ).toEqual([]);
    await name.dblclick();
    await expect(quantity).toHaveText(component === 'table' ? '3' : '2');
    const text = example.getByRole('textbox', { name: 'Edit Name', exact: true });
    await expect(text).toBeFocused();
    await text.fill('Updated name');
    await quantity.dblclick();
    await expect(name).toHaveText('Updated name');
    await number.fill('8');
    await name.dblclick();
    await expect(quantity).toHaveText('8');
    await text.fill('Discard this');
    await text.press('Escape');
    await expect(name).toHaveText('Updated name');
    await expect(name).toBeFocused();
    await expect(example.getByRole('button', { name: /^(Save|Cancel)$/ })).toHaveCount(0);
  });

  test(`${component} keeps owned date editors bounded through narrow RTL switching`, async ({
    page,
  }) => {
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-custom-editors`);
    const row = example.locator('tbody tr').first();
    const name = row.locator('td[data-label="Name"]');
    const quantity = row.locator('td[data-label="Quantity"]');
    const date = row.locator('td[data-label="Date"]');
    const number = example.getByRole('spinbutton', { name: 'Edit Quantity', exact: true });
    const expectDateToFit = async () => {
      const fits = await date.locator('aeris-date-picker').evaluate((element) => {
        const cell = element.closest('td');
        const trigger = element.querySelector('[role="combobox"]');
        if (!cell || !trigger) return false;
        const boundary = cell.getBoundingClientRect();
        return [element, trigger].every((control) => {
          const bounds = control.getBoundingClientRect();
          return bounds.left >= boundary.left + 2 && bounds.right <= boundary.right - 2;
        });
      });
      expect(fits).toBe(true);
    };
    await name.dblclick();
    await example.getByRole('textbox', { name: 'Edit Name', exact: true }).fill('Updated name');
    await date.dblclick();
    await expect(name).toHaveText('Updated name');
    const calendar = example.getByRole('combobox', { name: 'Edit Date', exact: true });
    await expectDateToFit();
    await calendar.click();
    const calendarPanel = page.locator(`[id="${await calendar.getAttribute('aria-controls')}"]`);
    await expect(calendarPanel).toBeVisible();
    await calendarPanel.locator('[data-date="2026-10-23"]').click();
    await expect(calendar).toBeVisible();
    await quantity.dblclick();
    await expect(date).toContainText('23');
    await page.setViewportSize({ width: 320, height: 740 });
    await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
    await quantity.dblclick();
    await number.fill('9');
    await number.press('Tab');
    await expect(quantity).toHaveText('9');
    await date.dblclick();
    await expectDateToFit();
  });
}
