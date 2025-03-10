# PROMPT 1 (Se solicitó el detalle de las actividades a chatGPT-4o en cursor, y para ejecutar el ticket detallado fue con claude-3.7-sonnet)

# Tareas de Frontend

## Diseño de la Interfaz de Usuario:
- 🎨 Utilizar Bootstrap para crear una interfaz minimalista con colores pasteles.
- ➕ Añadir un botón o enlace visible en el dashboard del reclutador para añadir un nuevo candidato.
- 📝 Diseñar un formulario de ingreso de datos con los campos necesarios: nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
- ✅ Implementar validaciones en el frontend para asegurar que los datos ingresados son correctos (formato de correo electrónico, campos obligatorios).
- 📂 Añadir funcionalidad para cargar documentos (CV en formato PDF o DOCX).
- 🎉 Mostrar un mensaje de confirmación al usuario una vez que el candidato ha sido añadido exitosamente.
- ⚠️ Implementar manejo de errores para mostrar mensajes adecuados en caso de fallos.

# Tareas de Backend

## Desarrollo de API:
- 🌐 Crear un endpoint en el backend para recibir y procesar la información del formulario de añadir candidato.
- 🔒 Implementar validaciones y sanitización de entradas para prevenir SQL Injection y ataques XSS.
- 🛡️ Utilizar ORMs seguros y sentencias preparadas para manejar las consultas a la base de datos.

## Gestión de Archivos:
- 📁 Desarrollar funcionalidad para manejar la carga y almacenamiento seguro de documentos (CVs).

## Manejo de Errores:
- 🛠️ Implementar manejo de excepciones para capturar y responder adecuadamente a errores durante el procesamiento de datos.

# Tareas de Base de Datos

## Modelado de Datos:
- 🗂️ Diseñar el modelo de datos para los candidatos, incluyendo los campos necesarios.
- 🛠️ Crear migraciones para establecer la estructura de la base de datos.
- 🌱 Desarrollar seeders si es necesario para poblar la base de datos con datos iniciales.

# Seguridad y Privacidad

## Protección de Datos:
- 🔐 Asegurar que los datos del candidato sean almacenados de manera segura y cumplan con las normativas de privacidad.
- 🔑 Implementar autenticación fuerte y control de accesos.
- 🔒 Cifrar datos sensibles y asegurar el cumplimiento con regulaciones.

## Política de Seguridad:
- 🔍 Implementar Code Reviews antes de hacer deploys.
- 🧪 Ejecutar pruebas automatizadas de seguridad (SAST, DAST).
- 🔄 Mantener paquetes y frameworks actualizados.
- 🛡️ Usar herramientas como Dependabot o Snyk para detectar vulnerabilidades en dependencias.
- 📜 Guardar logs de eventos críticos y usar herramientas como ELK Stack para análisis de logs.
- 🚨 Definir un plan de respuesta ante incidentes y tener una política de notificación de incidentes.

# Pruebas y Monitoreo

## Pruebas de Seguridad:
- 🔍 Realizar auditorías de seguridad internas y externas.
- 🛡️ Simular ataques para evaluar la respuesta del sistema.

## Monitoreo:
- 📊 Implementar monitoreo de actividad y uso de APIs seguras.
- 💾 Asegurar que se realicen backups y se tenga un plan de respuesta ante incidentes.

# PROMPT 2

Ahora requiero que el usuario pueda loguearse con usuario y contraseña. 
Tambien será necesario que se pueda registrar el usuario para poder tener su acceso. 

## Toma en cuenta los siguientes puntos de seguridad

🔹 **Autenticación Segura en APIs:**
- Usar OAuth 2.0 + OpenID Connect para autenticación segura de terceros.
- Implementar JWT con expiración y renovación segura.

🔹 **Limitación de Solicitudes y Protección contra Ataques:**
- Aplicar Rate Limiting en endpoints sensibles para evitar ataques de fuerza bruta.
- Habilitar CORS seguro para restringir acceso desde orígenes no autorizados.

🔹 **Registro y Monitoreo de APIs:**
- Auditar cada solicitud API con logs.
- Implementar WAF (Web Application Firewall) para bloquear solicitudes maliciosas. 