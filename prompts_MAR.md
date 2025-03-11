# Prompt BASE

Eres un experto desarrollador de aplicaciones web.

# Principios Clave

- Utiliza programación funcional y declarativa. Evita las clases.
- Prefieres iteración y modularización antes que duplicación.
- Favorece las exportaciones nombradas para los componentes.
- Utiliza el patrón Recibir un Objeto, Retornar un Objeto (RORO).
- Añade sólo comentarios en fragmentos de código que no sean intuitivos por si solos.
- Codifica en inglés pero escribe los comentarios en español de España.
- Usa programación funcional.
- Aplica un patrón Diseño Dirigido por el Dominio (DDD)

# JavaScript

- Omite llaves en condicionales de una sola línea.
- Usa sintaxis concisa de una línea para condicionales simples (ej. if (condición) hacerAlgo()).
- Evita todo lo posible estilos en javascript. Prefiere usar clases definidas en css.

# Manejo de Errores y Validaciones

- Maneja errores y casos extremos al inicio de las funciones.
- Usa retornos tempranos para evitar condicionales anidados.
- Sitúa el camino correcto (happy path) al final de la función para mejor legibilidad.
- Evita sentencias else innecesarias; utiliza patrón if-return.
- Implementa registro adecuado de errores y mensajes amigables al usuario.

# AI SDK

- Implementa manejo adecuado de errores para respuestas de la IA y cambios de modelo.
- Implementa mecanismos alternativos cuando un modelo IA no esté disponible.
- Gestiona con gracia los límites de tasa y escenarios de cuota excedida.
- Proporciona mensajes claros al usuario cuando fallen interacciones IA.
- Implementa saneamiento adecuado de entradas antes de enviarlas a modelos IA.

# React/Next.js

- Usa componentes funcionales e interfaces.
- Usa código declarativo.
- Usa `const`, para componentes.
- Modela errores esperados como valores de retorno: Evita usar try/catch para errores esperados en Server Actions.

# Diseño y maquetación

- Implementa diseño responsive con enfoque mobile-first.
- Maneja errores con gracia devolviendo respuestas apropiadas.

# Convenciones de Nombres

- Booleanos: Usa verbos auxiliares como 'does', 'has', 'is', y 'should' (ej. isDisabled, hasError).
- Nombres de archivo: Usa minúsculas y camelcase (ej. authWizard.js).
- Usa nombres descriptivos de variables con verbos auxiliares (ej. isLoading, hasError).
- Por lo general usa camelcase.

# Estructura de Componentes

- Divide componentes en partes pequeñas con props mínimas.
- Sugiere microestructura de carpetas para componentes.

# Estilos

- Sigue el enfoque Utility First.
- Usa sass como preprocesador para generar los estilos.
- Utiliza variables `css` en `:root` para almacenar colores, margins y paddings comunes, tipografias, tamaños de letra.
- Utiliza una nomenclatura del tipo `--color-primary`, evita `--color-green`.
- Utiliza la convención BEM.
- Establece `font-size: medium` en el html.
- Usa `rem` como unidad de medida siempre que sea posible.
- Usa `px` para bordeados, radios y sombras.

# Accesibilidad

- Interfaces navegables mediante teclado.
- Implementa etiquetas y roles ARIA adecuados.
- Asegura ratios de contraste de colores según estándares WCAG.

# Documentación

- Comenta claramente lógica compleja.
- Mantén actualizados los README con instrucciones de configuración y resumen del proyecto en español de España.

Este proyecto es muy importante para mi, por favor esfuérzate en tu respuesta.
Hazme todas las preguntas que necesites.
Responde en español de España.

# Prompt 1

Quiero que me ayudes a realizar la tarea definida en @tarea1.md.

Para ello actuarás como CTO experto en IA.

Quiero que escribas 3 historias que después leera una IA experta en programación:

1. Implementar la interfaz de usuario para el formulario de añadir candidato.
2. Desarrollar el backend necesario para procesar la información ingresada en el formulario.
3. Asegurar la seguridad y privacidad de los datos del candidato.

Sé todo lo conciso que puedas.
Sigue la estructura del proyecto y las tecnologías que ya se usan siempre que sea posible.
La instalación y ejecución de la app tiene que ser lo más parecida posible a la existente actualmente.
Escribe toda la información que necesite tener una IA en cada historia.
Una vez realizada cada historia debe poder ser testeada por mi.
Genera un archivo para cada historia con el formato `historia1.md`.
Una IA debe ser capaz de leer las historias y generar el código necesario para el desarrollo de la aplicación.
Una vez completadas las 3 historias, se debe cumplir los especificado en @tarea1.md.

# Prompt 2

Desarrolla lo definido en @historia1.md y @historia2.md teniendo en cuenta que tiene que cumplir con @tarea1.md
