# Guía de Testing

Este documento proporciona instrucciones para ejecutar los tests unitarios e integración en el proyecto.

## Estructura de Tests

El proyecto sigue una estructura organizada para los tests:

### Backend

```
backend/
└── src/
    └── tests/
        ├── unit/
        │   ├── controllers/
        │   ├── services/
        │   └── utils/
        ├── integration/
        │   ├── candidates/
        │   ├── documents/
        │   └── auth/
        └── fixtures/
            └── (datos de prueba)
```

### Frontend

```
frontend/
└── src/
    └── tests/
        ├── unit/
        │   ├── components/
        │   ├── hooks/
        │   └── utils/
        ├── integration/
        │   ├── features/
        │   │   ├── candidates/
        │   │   └── auth/
        │   └── pages/
        └── fixtures/
            └── (datos de prueba)
```

## Ejecutar Tests

### Backend

Navega al directorio del backend:

```bash
cd backend
```

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar tests con modo watch (útil durante el desarrollo):

```bash
npm run test:watch
```

Ejecutar tests con cobertura:

```bash
npm run test:coverage
```

Ejecutar solo tests unitarios:

```bash
npm run test:unit
```

Ejecutar solo tests de integración:

```bash
npm run test:integration
```

### Frontend

Navega al directorio del frontend:

```bash
cd frontend
```

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar tests con modo watch (útil durante el desarrollo):

```bash
npm run test:watch
```

Ejecutar tests con cobertura:

```bash
npm run test:coverage
```

Ejecutar solo tests unitarios:

```bash
npm run test:unit
```

Ejecutar solo tests de integración:

```bash
npm run test:integration
```

## Herramientas de Testing

### Backend

- **Jest**: Framework principal de testing
- **Supertest**: Para tests de API
- **Jest-Mock-Extended**: Para crear mocks avanzados

### Frontend

- **Jest**: Framework principal de testing
- **React Testing Library**: Para tests de componentes React
- **MSW (Mock Service Worker)**: Para simular llamadas a API
- **Jest-DOM**: Para aserciones específicas del DOM

## Convenciones de Nombrado

- Los archivos de test deben terminar con `.test.ts` o `.test.tsx`
- Los tests unitarios deben estar en el directorio `unit/`
- Los tests de integración deben estar en el directorio `integration/`

## Cobertura de Código

El objetivo es mantener una cobertura de código superior al 80%. Los informes de cobertura se generan en el directorio `coverage/` después de ejecutar `npm run test:coverage`.

## Buenas Prácticas

1. **Estructura AAA**: Arrange (Preparar), Act (Actuar), Assert (Verificar)
2. **Mocks Claros**: Definir claramente qué se está mockeando
3. **Tests Independientes**: Cada test debe ser independiente y no depender de otros
4. **Nombres Descriptivos**: Usar nombres que describan claramente qué se está probando
5. **Evitar Lógica Compleja**: Los tests deben ser simples y directos 