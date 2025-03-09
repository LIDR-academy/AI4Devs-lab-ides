# Documentación de la API del Sistema ATS

Este documento proporciona información sobre cómo acceder y utilizar la documentación interactiva de la API del Sistema de Seguimiento de Candidatos (ATS).

## Acceso a la Documentación

La documentación de la API está disponible a través de Swagger UI, una interfaz interactiva que permite explorar y probar los endpoints de la API.

Para acceder a la documentación:

1. Asegúrate de que el servidor backend esté en ejecución:
   ```
   cd backend
   npm run dev
   ```

2. Abre tu navegador y visita:
   ```
   http://localhost:3010/api-docs
   ```

## Características de la Documentación

La documentación de Swagger proporciona:

- **Descripción detallada de todos los endpoints**: Incluye información sobre los métodos HTTP, parámetros, cuerpos de solicitud y respuestas.
- **Interfaz interactiva**: Permite probar los endpoints directamente desde el navegador.
- **Modelos de datos**: Muestra la estructura de los objetos utilizados en la API.
- **Códigos de respuesta**: Documenta los posibles códigos de estado HTTP y sus significados.

## Endpoints Disponibles

### Candidatos

- **POST /api/candidatos**: Crear un nuevo candidato
  - Crea un nuevo candidato con su información personal, educación y experiencia laboral.

- **POST /api/candidatos/{id_candidato}/documentos**: Subir CV de un candidato
  - Sube el CV de un candidato en formato PDF o DOCX.

- **GET /api/candidatos/{id_candidato}**: Obtener candidato por ID
  - Obtiene los datos completos de un candidato específico, incluyendo su información personal, educación, experiencia laboral y documentos.

## Uso de la Documentación

1. **Explorar endpoints**: Navega por la lista de endpoints disponibles en la interfaz de Swagger.
2. **Expandir un endpoint**: Haz clic en un endpoint para ver detalles sobre los parámetros, cuerpos de solicitud y respuestas.
3. **Probar un endpoint**: Haz clic en el botón "Try it out", completa los parámetros necesarios y haz clic en "Execute".
4. **Ver resultados**: Después de ejecutar una solicitud, podrás ver la respuesta del servidor, incluyendo el código de estado, los encabezados y el cuerpo de la respuesta.

## Exportar la Documentación

Si necesitas la especificación de la API en formato JSON para utilizarla en otras herramientas, puedes acceder a:

```
http://localhost:3010/api-docs.json
```

## Notas Adicionales

- La documentación se genera automáticamente a partir de las anotaciones en el código fuente.
- Si encuentras algún problema o tienes sugerencias para mejorar la documentación, por favor, contacta al equipo de desarrollo.

## Ejemplos de Uso

### Crear un Nuevo Candidato

1. Navega a `POST /api/candidatos`
2. Haz clic en "Try it out"
3. Introduce un cuerpo de solicitud JSON como:
   ```json
   {
     "nombre": "Juan",
     "apellido": "Pérez",
     "email": "juan.perez@email.com",
     "telefono": "+34912345678",
     "direccion": "Calle Ficticia 123, Ciudad",
     "educacion": [
       {
         "institucion": "Universidad de Madrid",
         "titulo": "Licenciado en Psicología",
         "fecha_inicio": "2015-09-01",
         "fecha_fin": "2019-06-30"
       }
     ],
     "experiencia_laboral": [
       {
         "empresa": "Empresa XYZ",
         "puesto": "Psicólogo Clínico",
         "fecha_inicio": "2020-01-01",
         "fecha_fin": "2023-01-01",
         "descripcion": "Atención a pacientes, diagnóstico y seguimiento."
       }
     ]
   }
   ```
4. Haz clic en "Execute"
5. Observa la respuesta del servidor 