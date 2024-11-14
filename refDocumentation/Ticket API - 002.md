# 🎟️ Ticket BACK-002: Crear API para recibir datos del candidato (Backend)

## 📝 Descripción General
Como **reclutador**, necesito un endpoint en el backend que permita **añadir candidatos** al sistema ATS para gestionar sus datos y documentos de manera eficiente.

Este ticket incluye:
- Crear un **endpoint POST** para recibir la información de los candidatos.
- **Validar y almacenar** los datos usando **Prisma** y **PostgreSQL**.
- Soportar la **carga de archivos** (CV en PDF/DOCX).
- Asegurar la **privacidad y seguridad** de los datos.

---

## 🛠️ Tecnologías Utilizadas
- **Backend Framework**: Express + TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL (usando Docker)
- **Configuración**: dotenv
- **Testing**: Jest, Supertest
- **Documentación de API**: swagger-jsdoc, swagger-ui-express

---

## 📋 Criterios de Aceptación

1. **Endpoint para creación de candidatos**
   - El endpoint debe ser accesible en:  
     `POST /api/candidates`
   - El endpoint debe recibir un **formulario con los siguientes campos**:
     - Nombre (obligatorio)
     - Apellido (obligatorio)
     - Correo electrónico (obligatorio, formato válido)
     - Teléfono (opcional)
     - Dirección (opcional)
     - Educación (institución, título, año de graduación)
     - Experiencia laboral (empresa, cargo, fechas)
     - Archivo (CV en formato PDF/DOCX)

2. **Validación de datos**
   - Validar que los campos obligatorios estén presentes y tengan el formato correcto.
   - Validar que el archivo cargado sea un **PDF o DOCX** y no supere los **5 MB**.

3. **Almacenamiento en la base de datos**
   - Usar **Prisma** para interactuar con **PostgreSQL** y almacenar los datos del candidato.
   - Almacenar la información del archivo en un servicio de almacenamiento (ej. Amazon S3).

4. **Manejo de errores**
   - El sistema debe devolver un **código de error 400** si los datos son inválidos.
   - El sistema debe devolver un **código de error 500** en caso de fallos del servidor.
