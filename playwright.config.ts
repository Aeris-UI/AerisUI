import { defineConfig, devices } from '@playwright/test';

const fixtureUrl = 'http://127.0.0.1:4300';
const docsLayoutTests = [
  '**/geometry-consistency.spec.ts',
  '**/cascade-select-responsive.spec.ts',
  '**/multi-select-responsive.spec.ts',
  '**/tree-select-responsive.spec.ts',
  '**/pick-list-responsive.spec.ts',
  '**/toast-touch.spec.ts',
  '**/galleria-layout.spec.ts',
  '**/code-block.spec.ts',
  '**/component-example-layout.spec.ts',
  '**/catalog-quality.spec.ts',
];

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
      testIgnore: [
        ...docsLayoutTests,
        '**/component-pages.spec.ts',
        '**/mobile.spec.ts',
        '**/accessibility.spec.ts',
        '**/visual-consistency.spec.ts',
        '**/visual-baselines.spec.ts',
      ],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: [
        ...docsLayoutTests,
        '**/component-pages.spec.ts',
        '**/mobile.spec.ts',
        '**/accessibility.spec.ts',
        '**/visual-consistency.spec.ts',
        '**/visual-baselines.spec.ts',
      ],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [
        ...docsLayoutTests,
        '**/component-pages.spec.ts',
        '**/mobile.spec.ts',
        '**/accessibility.spec.ts',
        '**/visual-consistency.spec.ts',
        '**/visual-baselines.spec.ts',
      ],
    },
    {
      name: 'component-smoke',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4301' },
      testMatch: '**/component-pages.spec.ts',
    },
    ...(['chromium', 'webkit'] as const).map((browserName) => ({
      name: `docs-layout-${browserName}`,
      use: { browserName, baseURL: 'http://127.0.0.1:4301' },
      testMatch: docsLayoutTests,
    })),
    {
      name: 'docs-quality-firefox',
      use: { ...devices['Desktop Firefox'], baseURL: 'http://127.0.0.1:4301' },
      testMatch: '**/catalog-quality.spec.ts',
    },
    {
      name: 'visual-baselines',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/visual-baselines.spec.ts',
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: ['**/mobile.spec.ts', '**/mobile-foundation.spec.ts'],
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 15'] },
      testMatch: ['**/mobile.spec.ts', '**/mobile-foundation.spec.ts'],
    },
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/accessibility.spec.ts', '**/visual-consistency.spec.ts'],
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
