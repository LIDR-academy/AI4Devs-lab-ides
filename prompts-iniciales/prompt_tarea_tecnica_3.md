# Prompt para Asegurar la Seguridad y Privacidad

## Descripción
Implementa medidas de seguridad para proteger los datos del candidato en el sistema ATS. Asegúrate de que los datos estén seguros y accesibles solo para usuarios autorizados.

## Tareas Específicas
1. **Medidas de Seguridad:**
   - Implementar encriptación para los siguientes campos sensibles:
     - **Correo Electrónico:** Encriptar para proteger la privacidad del candidato.
     - **Teléfono:** Encriptar para asegurar la confidencialidad de la información de contacto.
     - **Dirección:** Encriptar para proteger la información personal del candidato.

2. **Autenticación y Autorización:**
   - Configurar autenticación de usuarios y roles para asegurar que solo usuarios autorizados puedan acceder a los datos.
   - Implementar control de acceso basado en roles para limitar las acciones que cada tipo de usuario puede realizar.

3. **Privacidad de Datos:**
   - Implementar auditoría de acciones para rastrear accesos y cambios en los datos del candidato.
   - Asegurar que los datos encriptados se desencripten solo cuando sea necesario y por usuarios autorizados.

4. **Validaciones de Seguridad:**
   - Asegurar que las contraseñas de los usuarios sean almacenadas de manera segura utilizando técnicas de hashing.
   - Validar que las sesiones de usuario sean seguras y expiren después de un tiempo de inactividad.

5. **Accesibilidad y Compatibilidad:**
   - Asegurar que las medidas de seguridad sean compatibles con diferentes dispositivos y navegadores.

## Ejemplos y Casos de Uso
- Proporciona ejemplos de cómo implementar encriptación y autenticación.
- Incluye casos de uso para la auditoría de acciones y control de acceso.

## Archivos Necesarios
- Middleware de seguridad para Express.
- Archivos de configuración para autenticación y autorización. 