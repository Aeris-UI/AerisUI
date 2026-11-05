import { expect, test } from './fixtures';

test('MultiSelect fixture controls have usable click targets', async ({ page }) => {
  await page.goto('/');
  const controls = page.locator('[data-fixture="multi-select-overlay"]').getByRole('button');
  await expect(controls).toHaveCount(8);
  for (const control of await controls.all()) {
    const bounds = await control.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(24);
    expect(bounds?.height).toBeGreaterThanOrEqual(24);
  }
});

test('MultiSelect keeps checkbox-label spacing on a narrow RTL screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?direction=rtl');
  const fixture = page.locator('[data-fixture="multi-select-overlay"]');
  await fixture.getByRole('button', { name: 'body', exact: true }).click();
  await fixture.getByRole('combobox', { name: 'Overlay skills' }).click();
  const option = page.locator('.aeris-multi-select__panel').getByRole('option');
  await expect(option).toHaveCSS('direction', 'rtl');
  await expect(option).toHaveCSS('column-gap', '10px');
  const gap = await option.evaluate((element) => {
    const checkbox = element.querySelector('.aeris-multi-select__checkbox');
    const content = element.querySelector('.aeris-multi-select__option-content');
    if (!checkbox || !content) throw new Error('Missing option checkbox or label');
    return checkbox.getBoundingClientRect().left - content.getBoundingClientRect().right;
  });
  expect(gap).toBeCloseTo(10, 0);
});

test('MultiSelect retains fallback panel padding without an overlay-padding token', async ({
  page,
}) => {
  await page.goto('/');
  await page.addStyleTag({
    content: `:root, [data-fixture="multi-select-overlay"] { --aeris-overlay-padding: initial !important; }`,
  });
  const fixture = page.locator('[data-fixture="multi-select-overlay"]');
  for (const placement of ['self', 'body', 'target', 'auto']) {
    await fixture.getByRole('button', { name: placement, exact: true }).click();
    await fixture.getByRole('combobox', { name: 'Overlay skills' }).click();
    const panel = page.locator('.aeris-multi-select__panel');
    await expect(panel).toHaveCSS('padding-left', '7.5px');
    await expect(panel).toHaveCSS('padding-right', '7.5px');
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
  }
});

for (const placement of ['self', 'body', 'target', 'auto'] as const) {
  test(`MultiSelect preserves spacing and filter sizing with ${placement} placement`, async ({
    page,
  }) => {
    await page.goto('/');
    const fixture = page.locator('[data-fixture="multi-select-overlay"]');
    const trigger = fixture.getByRole('combobox', { name: 'Overlay skills' });

    for (const size of ['xs', 'sm', 'md', 'lg'] as const) {
      await fixture.getByRole('button', { name: size, exact: true }).click();
      await fixture.getByRole('button', { name: placement, exact: true }).click();
      await trigger.click();
      const panel = page.locator('.aeris-multi-select__panel');
      await expect(panel).toBeVisible();
      if (placement === 'body' || placement === 'auto') {
        await expect(page.locator('body > .aeris-multi-select__panel')).toBeVisible();
      } else if (placement === 'target') {
        await expect(
          fixture.locator('[data-overlay-target] > .aeris-multi-select__panel'),
        ).toBeVisible();
      } else {
        await expect(
          fixture.locator('aeris-multi-select .aeris-multi-select__panel'),
        ).toBeVisible();
      }
      if (placement === 'auto')
        await expect(panel).toHaveAttribute('data-aeris-auto-portaled', 'true');

      await expect(panel.getByRole('option')).toHaveCSS('column-gap', '10px');
      await expect(panel.locator('.aeris-multi-select__select-all')).toHaveCSS(
        'column-gap',
        '10px',
      );
      await expect(panel.locator('.aeris-multi-select__filter-wrap')).toHaveCSS(
        'column-gap',
        '10px',
      );
      await expect(panel.locator('.aeris-multi-select__option-content')).toHaveCSS(
        'row-gap',
        '2px',
      );
      const filterHeight = { xs: '32px', sm: '32px', md: '40px', lg: '44px' }[size];
      await expect(panel.locator('.aeris-multi-select__filter-wrap')).toHaveCSS(
        'min-height',
        filterHeight,
      );
      await expect(panel).toHaveCSS('padding-left', '6px');
      await expect(panel).toHaveCSS('padding-right', '6px');
      const distance = await panel.getByRole('option').evaluate((option) => {
        const checkbox = option.querySelector('.aeris-multi-select__checkbox');
        const content = option.querySelector('.aeris-multi-select__option-content');
        if (!checkbox || !content) throw new Error('Missing option checkbox or label');
        return content.getBoundingClientRect().left - checkbox.getBoundingClientRect().right;
      });
      expect(distance).toBeCloseTo(10, 0);
      await page.keyboard.press('Escape');
      await expect(panel).toHaveCount(0);
    }
  });
}
