import { defineConfig, devices } from '@playwright/test';

const fixtureUrl = 'http://127.0.0.1:4300';

export default defineConfig({
  testDir: './e2e/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  workers: process.env['CI'] ? 4 : undefined,
  reporter: process.env['CI'] ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: fixtureUrl,
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/component-pages.spec.ts', '**/mobile.spec.ts'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/component-pages.spec.ts', '**/mobile.spec.ts'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/component-pages.spec.ts', '**/mobile.spec.ts'],
    },
    {
      name: 'component-smoke',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4301' },
      testMatch: '**/component-pages.spec.ts',
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/mobile.spec.ts',
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 15'] },
      testMatch: '**/mobile.spec.ts',
    },
  ],
  webServer: [
    {
      command: 'npm run serve:browser-tests',
      url: fixtureUrl,
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
    },
    {
      command: 'npm run serve:docs -- --host 127.0.0.1 --port 4301',
      url: 'http://127.0.0.1:4301',
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
    },
  ],
});
