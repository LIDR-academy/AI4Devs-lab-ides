import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Document Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'recruiter@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should upload PDF CV when creating candidate', async ({ page }) => {
    // Navigate to new candidate form
    await page.click('text=Add New Candidate');
    
    // Fill required fields
    await page.fill('#firstName', 'PDF');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', 'pdf.test@example.com');
    
    // Upload PDF file
    const pdfPath = path.join(__dirname, '../test-files/test-cv.pdf');
    await page.setInputFiles('input[type="file"]', pdfPath);
    
    // Verify file name is displayed
    await expect(page.locator('text=test-cv.pdf')).toBeVisible();
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('.notification')).toContainText('Candidate PDF Test has been added successfully');
  });

  test('should upload DOCX CV when creating candidate', async ({ page }) => {
    // Navigate to new candidate form
    await page.click('text=Add New Candidate');
    
    // Fill required fields
    await page.fill('#firstName', 'DOCX');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', 'docx.test@example.com');
    
    // Upload DOCX file
    const docxPath = path.join(__dirname, '../test-files/test-cv.docx');
    await page.setInputFiles('input[type="file"]', docxPath);
    
    // Verify file name is displayed
    await expect(page.locator('text=test-cv.docx')).toBeVisible();
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('.notification')).toContainText('Candidate DOCX Test has been added successfully');
  });

  test('should handle invalid file type', async ({ page }) => {
    await page.click('text=Add New Candidate');
    
    // Try to upload invalid file type
    const invalidPath = path.join(__dirname, '../test-files/invalid.txt');
    await page.setInputFiles('input[type="file"]', invalidPath);
    
    // Verify error message
    await expect(page.locator('text=Only PDF or DOCX files are allowed')).toBeVisible();
  });

  test('should handle file size limit', async ({ page }) => {
    await page.click('text=Add New Candidate');
    
    // Try to upload file larger than 5MB
    const largePath = path.join(__dirname, '../test-files/large-file.pdf');
    await page.setInputFiles('input[type="file"]', largePath);
    
    // Verify error message
    await expect(page.locator('text=File size must be less than 5MB')).toBeVisible();
  });

  test('should download CV from candidate details', async ({ page }) => {
    // Navigate to candidates list
    await page.click('text=Manage Candidates');
    
    // Click on a candidate with CV
    await page.click('text=PDF Test');
    
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('button[aria-label="Download CV"]');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toContain('cv');
    
    // Save file and verify it exists
    const downloadPath = path.join(__dirname, '../downloads/test-cv.pdf');
    await download.saveAs(downloadPath);
    expect(fs.existsSync(downloadPath)).toBeTruthy();
  });

  test('should replace CV file in edit mode', async ({ page }) => {
    // Navigate to candidates list
    await page.click('text=Manage Candidates');
    await page.click('text=PDF Test >> xpath=.. >> button[aria-label="Edit"]');
    
    // Remove current CV
    await page.click('button[aria-label="Remove file"]');
    
    // Upload new file
    const newPdfPath = path.join(__dirname, '../test-files/new-cv.pdf');
    await page.setInputFiles('input[type="file"]', newPdfPath);
    
    // Verify new file name is displayed
    await expect(page.locator('text=new-cv.pdf')).toBeVisible();
    
    // Submit changes
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('.notification')).toContainText('Candidate has been updated successfully');
  });
}); 