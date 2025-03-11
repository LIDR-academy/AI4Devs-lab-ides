import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 15000,
    navigationTimeout: 30000,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'recruiter tests',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/.auth/recruiter.json',
      },
      testMatch: /.*\.spec\.ts/,
    },
    {
      name: 'admin tests',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/.auth/admin.json',
      },
      testMatch: /.*\.admin\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
};

export default config; 