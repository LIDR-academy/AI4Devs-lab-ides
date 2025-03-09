import { setupTestDB, teardownTestDB } from './setup';

describe('Database Setup', () => {
  it('debería configurar y limpiar la base de datos correctamente', async () => {
    // Configurar la base de datos
    await setupTestDB();
    
    // Limpiar la base de datos
    await teardownTestDB();
    
    // Si llegamos aquí sin errores, el test pasa
    expect(true).toBe(true);
  });
}); 