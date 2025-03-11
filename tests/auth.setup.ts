import { test as setup } from '@playwright/test';
import { authenticateAsRecruiter, authenticateAsAdmin } from './utils/auth';

setup('authenticate as recruiter', async ({ page }) => {
  await authenticateAsRecruiter(page);
});

setup('authenticate as admin', async ({ page }) => {
  await authenticateAsAdmin(page);
}); 