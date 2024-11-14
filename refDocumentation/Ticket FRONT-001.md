# 🎟️ Ticket FRONT-001: Implementar Formulario para Añadir Candidato en el Frontend

## Descripción General
Como **reclutador**, quiero tener un formulario en el dashboard que me permita **añadir un nuevo candidato** al sistema ATS para gestionar sus datos y procesos de selección de manera eficiente.

### 🛠️ Tecnologías Utilizadas
- **Frontend Framework**: React + TypeScript
- **Librerías**: Axios, @testing-library/react, Jest
- **Estilos**: CSS
- **API Base URL**: `${process.env.API_BASE_URL}`

---

## 📋 Criterios de Aceptación

1. **Accesibilidad del formulario**
   - El dashboard debe tener un **botón claramente visible** que diga "Añadir Candidato".
   - El formulario debe abrirse en un **modal** o una **página separada**.

2. **Campos del formulario**
   - **Información Personal**:
     - Nombre (obligatorio)
     - Apellido (obligatorio)
     - Correo electrónico (obligatorio, formato válido)
     - Teléfono (opcional, formato válido)
     - Dirección (opcional)
   - **Educación**:
     - Institución Educativa (autocompletado)
     - Título
     - Año de Graduación
   - **Experiencia Laboral**:
     - Empresa (autocompletado)
     - Cargo
     - Duración (fecha de inicio y fin)
     - Descripción
   - **Carga de documentos**:
     - Subir CV (PDF o DOCX, máximo 5 MB).

3. **Validación de datos**
   - El formulario debe validar el formato del correo electrónico.
   - Mostrar mensajes de error en tiempo real si los campos obligatorios están incompletos.
   - El botón "Enviar" debe estar deshabilitado hasta que todos los campos sean válidos.
