# Estructura Base del Backend

## Organización de Carpetas

```
src/
├── routes/ # Rutas de la API
├── controllers/ # Lógica de negocio
├── middleware/ # Middleware personalizado
├── models/ # Tipos e interfaces
├── services/ # Servicios de negocio
└── utils/ # Utilidades comunes
```

## Configuración Actual

El proyecto utiliza las siguientes tecnologías principales([1](https://expressjs.com/es/4x/api.html)):

- Express.js como framework web
- TypeScript para tipado estático
- Prisma como ORM
- PostgreSQL como base de datos
- Jest para pruebas unitarias

## Estructura de Rutas

### Configuración Base

```typescript
import express from 'express'
import { Router } from 'express'
const router = Router()
export default router
```

### Middleware Esencial

El proyecto debe incluir los siguientes middleware básicos:

```typescript
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

## Manejo de Errores

Se implementa un manejador de errores global:

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack)
	res.status(500).json({
		error: err.message,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
	})
})
```

## Convenciones de Código

1. **Nombrado de Archivos**

   - Rutas: `userRoutes.ts`
   - Controladores: `userController.ts`
   - Middleware: `authMiddleware.ts`

2. **Estructura de Rutas**

   - Usar Router de Express para cada módulo
   - Agrupar rutas relacionadas
   - Implementar validación de entrada

3. **Controladores**

   - Un archivo por entidad
   - Métodos async/await
   - Manejo de errores try/catch

4. **Respuestas HTTP**
   - Usar códigos de estado apropiados
   - Formato JSON consistente
   - Incluir mensajes descriptivos

## Ejemplo de Implementación

### Ruta

```typescript
// src/routes/userRoutes.ts
router.get('/', userController.getUsers)
router.post('/', validateUser, userController.createUser)
```

### Controlador

```typescript
// src/controllers/userController.ts
export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany()
		res.json(users)
	} catch (error) {
		next(error)
	}
}
```

### Middleware

```typescript
// src/middleware/validateUser.ts
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
	const { email, name } = req.body
	if (!email || !name) {
		return res.status(400).json({ error: 'Email y nombre son requeridos' })
	}
	next()
}
```

## Pruebas

Las pruebas deben seguir la estructura:

```typescript
describe('Módulo', () => {
	it('debe realizar una acción específica', async () => {
		// Configuración
		// Acción
		// Aserción
	})
})
```
