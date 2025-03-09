# Meta-prompt inicial (Cursor + Sonnet 3.7)

Como desarrollador experimentado fullstack en JavaScript y conociendo el contexto y los detalles de la aplicación de LTI en el README adjunto, construye una historia de usuario para la parte front-end que cumpla con los criterios de aceptación definidos en el archivo adjunto `add-candidate.md`. Pregúntame cualquier cuestión para realizar tu trabajo correctamente.

## Resultado del meta-prompt inicial

Voy a construir una historia de usuario para la parte front-end que cumpla con los criterios de aceptación definidos en el archivo `add-candidate.md`. Primero, necesito entender mejor la estructura actual del proyecto para asegurarme de que mi propuesta sea coherente con la arquitectura existente.

El resultado estará en el archivo `add-candidate-frontend.md`.

# Meta-prompt 2 (Cursor + Sonnet 3.7)

Como desarrollador experimentado en backend y teniendo en cuenta los requisitos y criterios de aceptación de la historia de usuario `@user-story.md`, además de la parte front-end que se va a desarrollar en paralelo `@add-candidate-frontend.md`, necesito crear una historia de usuario para la parte backend del proyecto. Pregunta cualquier cuestión para realizar tu trabajo correctamente.

## Resultado del meta-prompt

Veo que necesitas crear una historia de usuario para la parte backend que complemente la historia de usuario del front-end para añadir candidatos al sistema ATS. Primero, voy a revisar la estructura actual del backend para entender mejor cómo implementar esta funcionalidad.

Basado en la información recopilada, voy a crear una historia de usuario para la parte backend que complemente la historia de usuario del front-end para añadir candidatos al sistema ATS. 

El resultado estará en el archivo `add-candidate-backend.md`.

# Prompt 3: implementación de la parte front-end (Cursor + Sonnet 3.7)

Teniendo en cuenta la historia de usuario `@user-story.md` y los criterios técnicos y de desarrollo para la parte front-end definidos en `@add-candidate-frontend.md`, implementa dicha funcionalidad como desarrollador experimentado en front-end. Si tienes algún tipo de duda, no dudes en comentármelo antes de comenzar.

# Prompt 4: validación y correcciones de la parte front-end (Cursor + Sonnet 3.7)

Hay varios problemas a solucionar en el formulario:

- El campo de correo electrónico debe validarse en tiempo real.
- Hay que controlar que la fecha de fin no sea anterior a la de inicio y validarse en tiempo real.
- El campo de teléfono solo debe admitir números de teléfono válidos con o sin prefijos, y debe validarse en tiempo real.
- Los campos de fecha de fin son opcionales.

¿Puedes arreglarlo? Pregúntame cualquier duda antes de continuar.

# Prompt 5: implementación de la parte back-end (Cursor + Sonnet 3.7)

Teniendo en cuenta la historia de usuario `@user-story.md` y los criterios técnicos y de desarrollo para la parte backend definidos en `@add-candidate-backend.md`, implementa dicha funcionalidad como desarrollador experimentado en backend. Si tienes algún tipo de duda, no dudes en comentármelo antes de comenzar.

# Prompt 6: validación y correcciones de la parte back-end (Cursor + Sonnet 3.7)

Existe un error en el front-end al guardar el candidato, dando un error de tipo HTTP *500*. Te adjunto el error de la salida de la parte front-end y back-end en los terminales `@node` `@node` respectivamente. Creo que está relacionado con las fechas de fin, que ahora son opcionales.

# Prompt 7: protección de datos sensibles en la parte back-end (Cursor + Sonnet 3.7)

¿Me puedes indicar si se está cumpliendo este criterio de aceptación en la parte back-end de la historia de usuario `@add-candidate-backend.md`?

- Los datos sensibles deben estar protegidos adecuadamente.

Si no es así, me gustaría proteger al menos: teléfono, dirección y correo electrónico.

`Este criterio no se ha conseguido arreglar del todo, causando errores poco descriptivos en el guardado.`
