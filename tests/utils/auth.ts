import { Page } from '@playwright/test';

export async function authenticateAsRecruiter(page: Page) {
  // Navegar a la página de login
  await page.goto('/login');
  
  // Esperar a que el formulario esté visible
  await page.waitForSelector('h2:text("Sign In")');
  
  // Rellenar el formulario de login usando labels más robustos
  await page.getByLabel('Email Address').fill('recruiter@lti-talent.com');
  await page.getByLabel('Password').fill('12345aA!');
  
  // Enviar el formulario usando el texto del botón
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Esperar a que la navegación se complete y estemos en el dashboard
  await page.waitForURL('/dashboard');
  
  // Guardar el estado de autenticación
  await page.context().storageState({ path: './tests/.auth/recruiter.json' });
}

export async function authenticateAsAdmin(page: Page) {
  // Navegar a la página de login
  await page.goto('/login');
  
  // Esperar a que el formulario esté visible
  await page.waitForSelector('h2:text("Sign In")');
  
  // Rellenar el formulario de login usando labels más robustos
  await page.getByLabel('Email Address').fill('admin@lti-talent.com');
  await page.getByLabel('Password').fill('12345aA!');
  
  // Enviar el formulario usando el texto del botón
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Esperar a que la navegación se complete y estemos en el dashboard
  await page.waitForURL('/dashboard');
  
  // Guardar el estado de autenticación
  await page.context().storageState({ path: './tests/.auth/admin.json' });
} 