import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('chip choices have one keyboard entry, skip disabled members and separate focus from selection', async ({
  page,
}) => {
  await page.goto('/components/chip');
  const demo = page.locator('#chip-group-single');
  const group = demo.getByRole('toolbar', { name: 'Single choices' });
  const first = group.getByRole('button', { name: 'First', exact: true });
  const third = group.getByRole('button', { name: 'Third', exact: true });
  await first.focus();
  await first.press('ArrowRight');
  await expect(third).toBeFocused();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(third).toHaveAttribute('aria-pressed', 'false');
  await third.press('Space');
  await expect(third).toHaveAttribute('aria-pressed', 'true');
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await third.press('Enter');
  await expect(demo.locator('.chip-removable-demo > p')).toHaveText('Selected: None');
  await expect(group.locator('button[tabindex="0"]')).toHaveCount(1);
  await demo.getByRole('button', { name: 'Select fourth' }).click();
  await expect(group.getByRole('button', { name: 'Fourth', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await demo.getByRole('button', { name: 'Clear selection', exact: true }).click();
  await expect(demo.locator('.chip-removable-demo > p')).toHaveText('Selected: None');
});

test('multiple chips toggle through real taps and stay contained on narrow screens', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/components/chip');
  const group = page.getByRole('toolbar', { name: 'Multiple choices' });
  const third = group.getByRole('button', { name: 'Third', exact: true });
  if (isMobile) await third.tap();
  else await third.click();
  await expect(third).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: 'First', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
  expect(await group.locator('button button').count()).toBe(0);
  const demo = page.locator('#chip-group-multiple');
  await demo.getByRole('button', { name: 'Clear selection', exact: true }).click();
  await expect(group.locator('button[aria-pressed="true"]')).toHaveCount(0);
  await expect(demo.locator('.preview p')).toHaveText('Selected: None');
});

test('group removal recovers focus and cancellation preserves the request exactly once', async ({
  page,
}) => {
  await page.goto('/components/chip');
  const demo = page.locator('#chip-group-removal');
  const group = demo.getByRole('group', { name: 'Removable choices' });
  const first = group.getByRole('button', { name: 'Remove First', exact: true });
  await first.focus();
  await first.press('Delete');
  await expect(first).toHaveCount(0);
  const protectedChip = group.getByRole('button', { name: 'Remove Protected', exact: true });
  await expect(protectedChip).toBeFocused();
  await protectedChip.press('Delete');
  await expect(protectedChip).toBeFocused();
  await expect(demo.locator('.preview [role="status"]')).toHaveText('Protected cannot be removed.');
  await protectedChip.press('End');
  const last = group.getByRole('button', { name: 'Remove Last', exact: true });
  await expect(last).toBeFocused();
  await last.press('Backspace');
  await expect(protectedChip).toBeFocused();
  await demo.getByRole('button', { name: 'Allow protected removal' }).click();
  const disallow = demo.getByRole('button', { name: 'Disallow protected removal' });
  await expect(disallow).toBeEnabled();
  await disallow.click();
  await protectedChip.focus();
  await protectedChip.press('Delete');
  await expect(protectedChip).toBeFocused();
  await demo.getByRole('button', { name: 'Allow protected removal' }).click();
  await protectedChip.focus();
  await protectedChip.press('Delete');
  await expect(group).toBeFocused();
  await expect(group).toHaveText('No chips');
  await demo.getByRole('button', { name: 'Reset chips' }).click();
  await expect(group.getByRole('button')).toHaveCount(3);
  await expect(demo.getByRole('button', { name: 'Allow protected removal' })).toBeEnabled();
  await expect(demo.locator('.preview [role="status"]')).toHaveText(
    'Chips reset. Remove any chip except Protected.',
  );
});

test('Signal Forms defers errors until touched and valid selections clear presentation', async ({
  page,
}) => {
  await page.goto('/components/chip');
  const demo = page.locator('#chip-group-forms');
  const group = demo.getByRole('toolbar', { name: 'Required choices' });
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  await demo.getByRole('button', { name: 'Validate group' }).click();
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(demo.locator('#chip-group-error')).toBeVisible();
  await group.getByRole('button', { name: 'First', exact: true }).click();
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  await expect(demo.locator('#chip-group-error')).toHaveCount(0);
  const success = demo.locator('#chip-group-success');
  await expect(success).toHaveCount(0);
  await demo.getByRole('button', { name: 'Validate group' }).click();
  await expect(success).toHaveText('Selection is valid.');
  await expect(group).toHaveAttribute('aria-describedby', 'chip-group-success');
  await group.getByRole('button', { name: 'Third', exact: true }).click();
  await expect(success).toHaveCount(0);
  await demo.getByRole('button', { name: 'Validate group' }).click();
  await expect(success).toBeVisible();
  await demo.getByRole('button', { name: 'Reset form' }).click();
  await expect(success).toHaveCount(0);
  await expect(demo.locator('#chip-group-error')).toHaveCount(0);
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  await expect(group.locator('button[aria-pressed="true"]')).toHaveCount(0);
  await demo.getByRole('button', { name: 'Validate group' }).click();
  await expect(demo.locator('#chip-group-error')).toBeVisible();
});

test('Reactive Forms demo can disable, enable and reset its control', async ({ page }) => {
  await page.goto('/components/chip');
  const demo = page.locator('#chip-group-reactive');
  const group = demo.getByRole('toolbar', { name: 'Reactive choices' });
  await demo.getByRole('button', { name: 'Disable group', exact: true }).click();
  await expect(group).toHaveAttribute('aria-disabled', 'true');
  await demo.getByRole('button', { name: 'Enable group', exact: true }).click();
  await expect(group).not.toHaveAttribute('aria-disabled', 'true');
  await group.getByRole('button', { name: 'First', exact: true }).click();
  await expect(demo.locator('.preview p')).toHaveText('Selected: first');
  await demo.getByRole('button', { name: 'Disable group', exact: true }).click();
  await demo.getByRole('button', { name: 'Reset control', exact: true }).click();
  await expect(group).not.toHaveAttribute('aria-disabled', 'true');
  await expect(group.getByRole('button', { name: 'Third', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(demo.locator('.preview p')).toHaveText('Selected: third');
});

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} chip groups support RTL, presets and accessible semantics`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.name !== 'docs-layout-chromium',
        'Run the palette matrix once; other engines exercise interactions.',
      );
      await page.addInitScript(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
          localStorage.setItem('aeris-docs-direction', 'rtl');
          localStorage.setItem('aeris-docs-density', mode === 'dark' ? 'compact' : 'comfortable');
          localStorage.setItem('aeris-docs-radius', palette === 'monochrome' ? 'pill' : 'rounded');
        },
        { palette, mode },
      );
      await page.goto('/components/chip');
      const group = page.getByRole('toolbar', { name: 'Single choices' });
      await group.getByRole('button', { name: 'First', exact: true }).focus();
      await page.keyboard.press('ArrowLeft');
      await expect(group.getByRole('button', { name: 'Third', exact: true })).toBeFocused();
      expect(
        (
          await new AxeBuilder({ page })
            .include('#chip-group-single .preview')
            .include('#chip-group-multiple .preview')
            .include('#chip-group-removal .preview')
            .include('#chip-group-forms .preview')
            .include('#chip-group-reactive .preview')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    });
  }
}
