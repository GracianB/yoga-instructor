const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser', timeout: 30000, retries: 0, workers: 3,
  use: { baseURL: 'http://127.0.0.1:4185', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: { command: 'npm start', url: 'http://127.0.0.1:4185', reuseExistingServer: false },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({ name: browserName, use: { browserName } }))
});
