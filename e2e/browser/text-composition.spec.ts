import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`Editor active formatting is distinct from hover in ${palette} ${mode}`, async ({
      page,
      isMobile,
    }) => {
      await page.addInitScript(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.goto('/components/editor');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      const example = page.locator('#editor-basic');
      const content = example.getByRole('textbox');
      await content.fill('Formatting sample');
      for (const name of ['Bold', 'Italic', 'Underline']) {
        await content.focus();
        await content.press('ControlOrMeta+A');
        const button = example.getByRole('button', { name, exact: true });
        await expect(button).toHaveAttribute('aria-pressed', 'false');
        const inactive = await button.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        );
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(button).not.toHaveCSS('background-color', inactive);
        const active = await button.evaluate((element) => {
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, color: style.color };
        });
        const luminance = (color: string): number => {
          const channels = color
            .match(/[\d.]+/g)
            ?.slice(0, 3)
            .map(Number);
          if (!channels || channels.length !== 3) throw new Error(`Expected RGB color: ${color}`);
          return channels.reduce((sum, channel, index) => {
            const value = channel / 255;
            return (
              sum +
              [0.2126, 0.7152, 0.0722][index] *
                (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
            );
          }, 0);
        };
        const foreground = luminance(active.color);
        const background = luminance(active.background);
        expect(
          (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
        ).toBeGreaterThanOrEqual(4.5);
        if (!isMobile) {
          await button.hover();
          await expect(button).toHaveCSS('background-color', active.background);
          await expect(button).toHaveCSS('color', active.color);
        }
        await button.focus();
        await button.press('Space');
        await expect(button).toHaveAttribute('aria-pressed', 'false');
        await expect(button).not.toHaveCSS('background-color', active.background);
      }
    });
  }
}

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
