import { defineConfig, devices } from '@playwright/test';
import { join } from 'node:path';

const port = 4300;
const baseURL = `http://localhost:${port}`;

/**
 * Tests run against the built prerendered output served statically – what
 * ships, not the dev server (spec 004). Chromium only by decision; no retries
 * because a flaky test is a bug.
 */
export default defineConfig({
  testDir: './src',
  outputDir: '../../dist/.playwright/apps/ng-components-demo-e2e/test-output',
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../dist/.playwright/apps/ng-components-demo-e2e/report', open: 'never' }],
  ],
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm exec nx build ng-components-demo && pnpm exec serve --no-clipboard -l ${port} dist/apps/ng-components-demo/browser`,
    url: baseURL,
    // Never reuse a server on the fixed port: a stale local serve would let
    // the suite validate an outdated build. The nx
    // build cache keeps the fresh-build cost near zero when nothing changed.
    reuseExistingServer: false,
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
