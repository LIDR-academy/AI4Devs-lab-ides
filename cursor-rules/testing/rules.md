# Reglas de Testing

## Cobertura
- Cobertura mínima de tests: 80%
- Priorizar la cobertura de código crítico para el negocio
- Revisar regularmente la cobertura y mejorarla cuando sea necesario

## Tests Unitarios
- Tests unitarios obligatorios para todas las funciones y componentes
- Utilizar Jest para tests unitarios en todo el proyecto
- Seguir el patrón AAA (Arrange-Act-Assert) para estructurar los tests

## Tests de Integración
- Tests de integración para APIs y flujos de datos
- Utilizar Supertest para tests de integración en el backend
- Verificar la integración entre componentes y servicios

## Tests End-to-End
- Tests e2e para flujos críticos de usuario
- Utilizar Cypress o Playwright para tests e2e
- Automatizar los tests e2e en el pipeline de CI/CD

## Mocks y Stubs
- Utilizar mocks para simular dependencias externas
- Crear stubs para APIs y servicios externos
- Documentar claramente el comportamiento esperado de los mocks

## Entorno de Testing
- Mantener un entorno de testing separado
- Configurar datos de prueba consistentes
- Limpiar el entorno después de cada test

## Buenas Prácticas
- Escribir tests antes de implementar la funcionalidad (TDD)
- Mantener los tests independientes entre sí
- Revisar y refactorizar los tests regularmente 