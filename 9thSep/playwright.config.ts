import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './9thSep',

  reporter: [
    ['list'],
    ['html'],
    [
      'json',
      {
        outputFile: 'test-results/results.json'
      }
    ]
  ],

  use: {

    baseURL: 'https://phptravels.net/',

    screenshot: 'only-on-failure',

    trace: 'retain-on-failure',

    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});
