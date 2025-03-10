# Informe de Pruebas de Integración - Gestión de Candidatos

## Resumen Ejecutivo

Este documento presenta los resultados de las pruebas de integración realizadas para la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI). Las pruebas se ejecutaron siguiendo el plan de pruebas definido en `doc/testing/plan-pruebas-candidatos.md`.

**Fecha de ejecución**: 09/03/2024  
**Versión probada**: 1.0.0  
**Entorno**: Desarrollo  
**Ejecutado por**: Equipo de QA  

## Resultados Generales

| Métrica | Valor |
|---------|-------|
| Total de casos de prueba | 4 |
| Casos ejecutados | 4 |
| Casos exitosos | 3 |
| Casos fallidos | 1 |
| Tasa de éxito | 75% |

## Detalle de Casos de Prueba

### INT-01: Flujo completo de añadir candidato
**Estado**: ✅ EXITOSO  
**Descripción**: Verificar el flujo completo de añadir un candidato, desde el formulario hasta la base de datos.  
**Pasos ejecutados**:
1. Acceder al formulario de añadir candidato
2. Completar todos los campos obligatorios y opcionales
3. Cargar un CV en formato PDF
4. Enviar el formulario

**Resultado esperado**: El candidato se crea correctamente en la base de datos y se muestra un mensaje de éxito.  
**Resultado obtenido**: El candidato se creó correctamente en la base de datos y se mostró el mensaje "Candidato añadido correctamente".  
**Observaciones**: El tiempo de respuesta fue adecuado (menos de 2 segundos).

### INT-02: Validación de email duplicado
**Estado**: ✅ EXITOSO  
**Descripción**: Verificar que no se pueden crear dos candidatos con el mismo email.  
**Pasos ejecutados**:
1. Crear un candidato con email "juan.perez@example.com"
2. Intentar crear otro candidato con el mismo email

**Resultado esperado**: Se muestra un mensaje de error indicando que el email ya existe.  
**Resultado obtenido**: Se mostró el mensaje "Ya existe un candidato con este email".  
**Observaciones**: El mensaje de error es claro y específico.

### INT-03: Carga y almacenamiento de CV
**Estado**: ✅ EXITOSO  
**Descripción**: Verificar que los archivos CV se almacenan correctamente.  
**Pasos ejecutados**:
1. Crear un candidato con un archivo CV
2. Verificar que el archivo se ha almacenado en la ubicación correcta
3. Verificar que la URL del archivo se ha guardado en la base de datos

**Resultado esperado**: El archivo se almacena en la ubicación correcta y la URL se guarda en la base de datos.  
**Resultado obtenido**: El archivo se almacenó en `uploads/cv/` con un nombre único y la URL se guardó correctamente en la base de datos.  
**Observaciones**: Se verificó que el archivo es accesible a través de la URL almacenada.

### INT-04: Manejo de errores de servidor
**Estado**: ❌ FALLIDO  
**Descripción**: Verificar el manejo de errores del servidor en el frontend.  
**Pasos ejecutados**:
1. Simular un error en el servidor (desconectando la base de datos)
2. Intentar crear un candidato

**Resultado esperado**: Se muestra un mensaje de error adecuado al usuario.  
**Resultado obtenido**: La aplicación mostró un error genérico "Error al procesar la solicitud" sin detalles específicos.  
**Observaciones**: El mensaje de error debería ser más específico para ayudar al usuario a entender el problema.

**Defecto reportado**: [DEF-001] Mensaje de error genérico al fallar la conexión con la base de datos.

## Defectos Encontrados

### DEF-001: Mensaje de error genérico al fallar la conexión con la base de datos
**Severidad**: Media  
**Prioridad**: Media  
**Descripción**: Cuando la conexión a la base de datos falla, el frontend muestra un mensaje de error genérico "Error al procesar la solicitud" sin proporcionar detalles específicos sobre el problema.  
**Pasos para reproducir**:
1. Desconectar la base de datos (detener el contenedor Docker)
2. Intentar crear un candidato desde el formulario
3. Observar el mensaje de error mostrado

**Resultado actual**: Se muestra "Error al procesar la solicitud".  
**Resultado esperado**: Se debería mostrar un mensaje más específico como "No se pudo conectar a la base de datos. Por favor, inténtelo de nuevo más tarde."  
**Capturas de pantalla**: [Enlace a captura]  
**Ambiente**: Chrome 121.0.6167.140, Windows 10

## Recomendaciones

1. **Mejorar mensajes de error**: Implementar mensajes de error más específicos para diferentes tipos de errores del servidor.
2. **Implementar reintentos**: Para operaciones críticas, considerar implementar reintentos automáticos en caso de fallos de conexión.
3. **Logging mejorado**: Mejorar el logging en el backend para facilitar la depuración de errores.
4. **Feedback visual**: Añadir más feedback visual durante operaciones de larga duración, como la carga de archivos grandes.

## Conclusión

Las pruebas de integración muestran que la funcionalidad de añadir candidatos funciona correctamente en la mayoría de los escenarios. El flujo principal de añadir candidatos, la validación de email duplicado y la carga de archivos funcionan según lo esperado.

Sin embargo, se ha identificado un área de mejora en el manejo de errores del servidor. Se recomienda implementar mensajes de error más específicos para mejorar la experiencia del usuario.

En general, la funcionalidad cumple con los criterios de aceptación definidos en el plan de pruebas, con la excepción del manejo de errores que requiere mejoras. 