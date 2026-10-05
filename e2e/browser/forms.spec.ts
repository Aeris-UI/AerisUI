import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('forms expose stable validation, selection, disabled, and read-only states', async ({
  page,
}) => {
  const name = page.getByRole('textbox', { name: 'Required name' });

  await expect(name).not.toHaveClass(/aeris-input-text--invalid/);
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');
  await name.focus();
  await name.blur();
  await expect(name).toHaveClass(/aeris-input-text--invalid/);
  await expect(name).toHaveAttribute('aria-invalid', 'true');

  await page.getByRole('button', { name: 'Make valid' }).click();
  await expect(name).not.toHaveClass(/aeris-input-text--invalid/);
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');

  const select = page.getByRole('combobox', { name: 'Role' });
  await select.click();
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('option', { name: 'Engineer' }).click();
  await expect(select).toHaveText('Engineer');
  await expect(select).toHaveAttribute('aria-expanded', 'false');

  await select.click();
  await select.press('Escape');
  await expect(select).toHaveAttribute('aria-expanded', 'false');

  const datePicker = page.getByRole('combobox', { name: 'Deadline' });
  await datePicker.click();
  const datePickerPanel = page.locator('.aeris-date-picker__panel');
  await expect(datePickerPanel).toBeVisible();
  const yearToggle = datePickerPanel.locator('.aeris-date-picker__heading button').nth(1);
  const displayedYear = (await yearToggle.textContent())?.trim() ?? '';
  await yearToggle.click();
  const yearList = page.getByRole('listbox', { name: 'Choose year' });
  await expect(yearList).toBeVisible();
  await yearList.getByRole('option', { name: displayedYear, exact: true }).click();
  const monthList = page.getByRole('listbox', { name: 'Choose month' });
  await expect(monthList).toBeVisible();
  await monthList.getByRole('option').first().click();
  await expect(datePickerPanel.getByRole('grid')).toBeVisible();
  await expect(datePicker).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(datePickerPanel).toHaveCount(0);

  await expect(page.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('readonly', '');
});
