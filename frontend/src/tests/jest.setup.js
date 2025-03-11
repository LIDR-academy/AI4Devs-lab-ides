// Importar jest-dom
require('@testing-library/jest-dom');

// Configuración del entorno
process.env.NODE_ENV = 'test';
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';

// Silenciar los logs de consola durante los tests
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

console.log = jest.fn();
console.info = jest.fn();
console.debug = jest.fn();
// Mantener console.error y console.warn para depuración

// Configurar métodos globales para URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn(); 