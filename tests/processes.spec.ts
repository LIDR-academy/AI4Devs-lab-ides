import { test, expect } from '@playwright/test';

test.describe('Selection Process Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'recruiter@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new selection process', async ({ page }) => {
    // Navigate to processes page
    await page.click('text=Manage Processes');
    await page.click('text=New Process');

    // Fill the process form
    await page.fill('#title', 'Senior Developer Position');
    await page.fill('#description', 'Selection process for senior developer role');
    await page.selectOption('#status', 'OPEN');
    await page.fill('#startDate', '2024-03-20');
    await page.fill('#endDate', '2024-04-20');
    
    // Add a candidate to the process
    await page.click('text=Add Candidate');
    await page.click('text=John Doe');
    
    // Add process stages
    await page.click('text=Add Stage');
    await page.fill('input[name="stages.0.name"]', 'Technical Interview');
    await page.fill('textarea[name="stages.0.description"]', 'Technical skills assessment');
    await page.fill('input[name="stages.0.date"]', '2024-03-25');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Selection process has been created successfully');
    await expect(page).toHaveURL('/processes');
  });

  test('should edit an existing process', async ({ page }) => {
    // Navigate to processes list
    await page.click('text=Manage Processes');
    
    // Click edit on the first process
    await page.click('text=Senior Developer Position >> xpath=.. >> button[aria-label="Edit"]');
    
    // Update form fields
    await page.fill('#title', 'Senior Developer Position Updated');
    await page.fill('#description', 'Updated description for senior role');
    
    // Update stage
    await page.fill('input[name="stages.0.name"]', 'Technical Interview Updated');
    
    // Submit changes
    await page.click('button[type="submit"]');
    
    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Selection process has been updated successfully');
    await expect(page).toHaveURL('/processes');
  });

  test('should delete a process', async ({ page }) => {
    // Navigate to processes list
    await page.click('text=Manage Processes');
    
    // Click delete on the first process
    await page.click('text=Senior Developer Position Updated >> xpath=.. >> button[aria-label="Delete"]');
    
    // Confirm deletion in modal
    await page.click('text=Confirm Delete');
    
    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Selection process has been deleted successfully');
    
    // Verify process is no longer in the list
    await expect(page.locator('text=Senior Developer Position Updated')).not.toBeVisible();
  });

  test('should handle validation errors in process form', async ({ page }) => {
    await page.click('text=Manage Processes');
    await page.click('text=New Process');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation errors
    await expect(page.locator('#title-error')).toBeVisible();
    await expect(page.locator('#startDate-error')).toBeVisible();
    await expect(page.locator('#status-error')).toBeVisible();
  });

  test('should update process status', async ({ page }) => {
    await page.click('text=Manage Processes');
    
    // Create a new process first
    await page.click('text=New Process');
    await page.fill('#title', 'Process for Status Test');
    await page.fill('#startDate', '2024-03-20');
    await page.fill('#endDate', '2024-04-20');
    await page.selectOption('#status', 'OPEN');
    await page.click('button[type="submit"]');
    
    // Update status
    await page.click('text=Process for Status Test >> xpath=.. >> button[aria-label="Change Status"]');
    await page.selectOption('select[name="status"]', 'CLOSED');
    await page.click('text=Update Status');
    
    // Verify status change
    await expect(page.locator('text=CLOSED')).toBeVisible();
  });
}); 