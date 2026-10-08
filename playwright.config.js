const { defineConfig } = require('@playwright/test');

// Each browser has an independent CI runner; three workers per runner are
// nine parallel test workers overall, without competing for the same CPU.
// fullyParallel is essential because most scenarios live in closure.spec.js.
module.exports = defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  retries: 0,
  fullyParallel: true,
  workers: process.env.CI ? 3 : 4,
  use: {
    baseURL: 'http://127.0.0.1:4185',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:4185',
    reuseExistingServer: !process.env.CI
  },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: browserName,
    use: { browserName }
  }))
});
