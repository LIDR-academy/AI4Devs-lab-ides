// Questo file viene eseguito prima di ogni test

// Sopprimere i messaggi di console durante i test
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

// Ripristinare le funzioni originali di console dopo tutti i test
afterAll(() => {
  jest.restoreAllMocks();
});

// Estendere le aspettative di Jest se necessario
expect.extend({
  // Esempio di estensione personalizzata se necessario
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Configurazione globale per tutti i test
jest.setTimeout(10000); // 10 secondi
