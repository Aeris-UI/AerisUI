import { expect, test as base } from '@playwright/test';

interface BrowserFixtures {
  readonly runtimeErrors: readonly string[];
}

export const test = base.extend<BrowserFixtures>({
  runtimeErrors: [
    async ({ page }, use) => {
      // Verify app behavior independently of the external font stylesheet CDN.
      await page.route('https://fonts.googleapis.com/**', (route) =>
        route.fulfill({ contentType: 'text/css', body: '' }),
      );
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await use(errors);
      expect(errors, 'The browser emitted runtime errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
