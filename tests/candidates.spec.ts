import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Candidate Management', () => {
  test('should create a new candidate', async ({ page }) => {
    // Navegar directamente a new candidate form (ya estamos autenticados)
    await page.goto('/candidates/new');
    
    // Fill the form
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#phone', '1234567890');
    await page.fill('#address', '123 Test St');
    await page.fill('#education', 'Bachelor in Computer Science');
    await page.fill('#workExperience', '5 years as Software Developer');
    await page.fill('#skills', 'JavaScript, React, Node.js');
    await page.fill('#notes', 'Great candidate for senior positions');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Candidate John Doe has been added successfully');
    await expect(page).toHaveURL('/candidates');
  });

  test('should edit an existing candidate', async ({ page }) => {
    // Navigate to candidates list
    await page.click('text=Manage Candidates');
    
    // Click edit on the first candidate
    await page.click('text=John Doe >> xpath=.. >> button[aria-label="Edit"]');
    
    // Update form fields
    await page.fill('#firstName', 'John Updated');
    await page.fill('#skills', 'JavaScript, React, Node.js, TypeScript');
    
    // Submit changes
    await page.click('button[type="submit"]');
    
    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Candidate John Updated');
    await expect(page).toHaveURL('/candidates');
  });

  test('should delete a candidate', async ({ page }) => {
    // Navigate to candidates list
    await page.click('text=Manage Candidates');
    
    // Click delete on the first candidate
    await page.click('text=John Updated >> xpath=.. >> button[aria-label="Delete"]');
    
    // Confirm deletion in modal
    await page.click('text=Confirm Delete');
    
    // Verify success notification
    await expect(page.locator('.notification')).toContainText('Candidate has been deleted successfully');
    
    // Verify candidate is no longer in the list
    await expect(page.locator('text=John Updated')).not.toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    await page.click('text=Add New Candidate');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation errors
    await expect(page.locator('#firstName-error')).toBeVisible();
    await expect(page.locator('#lastName-error')).toBeVisible();
    await expect(page.locator('#email-error')).toBeVisible();
  });
}); 