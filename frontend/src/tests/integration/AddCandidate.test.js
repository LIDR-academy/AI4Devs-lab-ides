// Este archivo contiene pruebas de integración end-to-end
// Requiere que tanto el frontend como el backend estén ejecutándose
// Para ejecutar: npm run test:e2e

const { test, expect } = require('@playwright/test');

test.describe('Añadir Candidato - Integración', () => {
  // URL base del frontend
  const baseUrl = 'http://localhost:3000';
  
  // Datos de prueba
  const testCandidate = {
    firstName: 'E2E',
    lastName: 'Test',
    email: `e2e-test-${Date.now()}@example.com`, // Email único
    phone: '123456789',
    address: 'E2E Test Address',
    institution: 'E2E University',
    degree: 'E2E Degree',
    fieldOfStudy: 'E2E Testing',
    company: 'E2E Company',
    position: 'E2E Tester',
    description: 'E2E Testing'
  };
  
  // Antes de cada prueba
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de añadir candidato
    await page.goto(`${baseUrl}/candidates/add`);
    
    // Esperar a que el formulario se cargue
    await page.waitForSelector('form');
  });
  
  // Prueba: Flujo completo de añadir candidato
  test('should add a candidate successfully', async ({ page }) => {
    // Completar información personal
    await page.fill('input[name="firstName"]', testCandidate.firstName);
    await page.fill('input[name="lastName"]', testCandidate.lastName);
    await page.fill('input[name="email"]', testCandidate.email);
    await page.fill('input[name="phone"]', testCandidate.phone);
    await page.fill('input[name="address"]', testCandidate.address);
    
    // Completar educación
    await page.fill('input[placeholder="Institución"]', testCandidate.institution);
    await page.fill('input[placeholder="Título"]', testCandidate.degree);
    await page.fill('input[placeholder="Campo de Estudio"]', testCandidate.fieldOfStudy);
    
    // Completar experiencia
    await page.fill('input[placeholder="Empresa"]', testCandidate.company);
    await page.fill('input[placeholder="Cargo"]', testCandidate.position);
    await page.fill('textarea[placeholder="Descripción"]', testCandidate.description);
    
    // Subir CV
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Subir CV');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Test CV content')
    });
    
    // Verificar que el archivo se cargó
    await page.waitForSelector('text=test-cv.pdf');
    
    // Enviar formulario
    await page.click('button:has-text("Añadir Candidato")');
    
    // Esperar mensaje de éxito
    await page.waitForSelector('text=Candidato añadido exitosamente', { timeout: 10000 });
    
    // Verificar que el formulario se resetea
    await expect(page.locator('input[name="firstName"]')).toHaveValue('');
  });
  
  // Prueba: Validación de campos obligatorios
  test('should show validation errors for required fields', async ({ page }) => {
    // Enviar formulario sin completar campos
    await page.click('button:has-text("Añadir Candidato")');
    
    // Verificar mensajes de error
    await expect(page.locator('text=El nombre es obligatorio')).toBeVisible();
    await expect(page.locator('text=El apellido es obligatorio')).toBeVisible();
    await expect(page.locator('text=El correo electrónico es obligatorio')).toBeVisible();
    await expect(page.locator('text=El teléfono es obligatorio')).toBeVisible();
    await expect(page.locator('text=La dirección es obligatoria')).toBeVisible();
    await expect(page.locator('text=Por favor, sube el CV del candidato')).toBeVisible();
  });
  
  // Prueba: Validación de formato de email
  test('should validate email format', async ({ page }) => {
    // Ingresar email inválido
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('input[name="phone"]'); // Hacer clic en otro campo para disparar validación
    
    // Verificar mensaje de error
    await expect(page.locator('text=Correo electrónico inválido')).toBeVisible();
    
    // Corregir email
    await page.fill('input[name="email"]', 'valid@example.com');
    await page.click('input[name="phone"]');
    
    // Verificar que el error desaparece
    await expect(page.locator('text=Correo electrónico inválido')).not.toBeVisible();
  });
  
  // Prueba: Validación de tipo de archivo
  test('should validate file type', async ({ page }) => {
    // Subir archivo inválido
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Subir CV');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Invalid file type')
    });
    
    // Verificar mensaje de error
    await expect(page.locator('text=Por favor, sube un archivo PDF o DOCX')).toBeVisible();
  });
  
  // Prueba: Email duplicado
  test('should show error for duplicate email', async ({ page }) => {
    // Primero añadir un candidato
    await page.fill('input[name="firstName"]', testCandidate.firstName);
    await page.fill('input[name="lastName"]', testCandidate.lastName);
    await page.fill('input[name="email"]', testCandidate.email);
    await page.fill('input[name="phone"]', testCandidate.phone);
    await page.fill('input[name="address"]', testCandidate.address);
    
    // Subir CV
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Subir CV');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Test CV content')
    });
    
    // Enviar formulario
    await page.click('button:has-text("Añadir Candidato")');
    
    // Esperar mensaje de éxito
    await page.waitForSelector('text=Candidato añadido exitosamente', { timeout: 10000 });
    
    // Cerrar el mensaje
    await page.click('button[aria-label="Close"]');
    
    // Intentar añadir otro candidato con el mismo email
    await page.fill('input[name="firstName"]', 'Otro');
    await page.fill('input[name="lastName"]', 'Candidato');
    await page.fill('input[name="email"]', testCandidate.email); // Mismo email
    await page.fill('input[name="phone"]', '987654321');
    await page.fill('input[name="address"]', 'Otra dirección');
    
    // Subir CV
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.click('text=Subir CV');
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles({
      name: 'test-cv2.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Another Test CV content')
    });
    
    // Enviar formulario
    await page.click('button:has-text("Añadir Candidato")');
    
    // Verificar mensaje de error
    await page.waitForSelector('text=Ya existe un candidato con este correo electrónico', { timeout: 10000 });
  });
}); 