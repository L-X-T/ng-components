import { defineConfig, devices } from '@playwright/test';
import { join } from 'node:path';

const port = 4300;
const baseURL = `http://localhost:${port}`;

/**
 * Tests run against the built prerendered output served statically – what
 * ships, not the dev server (spec 004). Chromium only by decision; no retries
 * because a flaky test is a bug (plan 004 watchpoints).
 */
export default defineConfig({
  testDir: './src',
  outputDir: '../../dist/.playwright/apps/ng-component-demo-e2e/test-output',
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../dist/.playwright/apps/ng-component-demo-e2e/report', open: 'never' }],
  ],
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm exec nx build ng-component-demo && pnpm exec serve --no-clipboard -l ${port} dist/apps/ng-component-demo/browser`,
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 300_000,
    cwd: join(__dirname, '../..'),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
