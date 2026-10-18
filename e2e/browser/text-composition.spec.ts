import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const direction of ['ltr', 'rtl']) {
  for (const field of [
    {
      route: 'input-text',
      demo: '#input-component',
      input: '#component-text',
    },
    { route: 'textarea', demo: '#textarea-signal', input: '#textarea-signal-example' },
  ]) {
    test(`${field.route} commits IME text without swallowing editing keys in ${direction}`, async ({
      page,
    }) => {
      await page.addInitScript(
        (dir) => localStorage.setItem('aeris-docs-direction', dir),
        direction,
      );
      await page.goto(`/components/${field.route}`);
      const demo = page.locator(field.demo);
      const input = demo.locator(field.input);
      await input.fill('');
      const status = demo.locator('small');
      const before = await status.textContent();
      await input.evaluate((element) => {
        const field = element as HTMLInputElement | HTMLTextAreaElement;
        field.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        field.value = 'に';
        field.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
      });
      await expect(input).toHaveValue('に');
      await expect(status).toHaveText(before ?? '');
      await input.evaluate((element) => {
        const field = element as HTMLInputElement | HTMLTextAreaElement;
        field.value = '日本語';
        field.dispatchEvent(
          new CompositionEvent('compositionend', { bubbles: true, data: '日本語' }),
        );
        field.dispatchEvent(new InputEvent('input', { bubbles: true }));
      });
      await expect(input).toHaveValue('日本語');
      await expect(status).toHaveText(
        field.route === 'textarea' ? '3 characters' : 'Committed value: 日本語',
      );
      if (field.route === 'textarea') {
        await input.press('End');
        await input.press('Enter');
        await input.pressSequentially('Line two');
        await input.press('Shift+Enter');
        await input.pressSequentially('Line three');
        await expect(input).toHaveValue('日本語\nLine two\nLine three');
      }
      expect(
        (await new AxeBuilder({ page }).include(`${field.demo} .preview`).analyze()).violations,
      ).toEqual([]);
    });
  }
}
