# Historias de Usuario para el Sistema ATS

## Historia Original: Añadir Candidato al Sistema

Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

## Historia 1: Búsqueda y Filtrado de Candidatos

**Como** reclutador,
**Quiero** poder buscar y filtrar candidatos en el sistema según diversos criterios,
**Para** encontrar rápidamente a los candidatos más adecuados para una posición específica.

**Criterios de Aceptación:**

- Debe existir una barra de búsqueda prominente en el dashboard que permita buscar candidatos por nombre, habilidades o experiencia.
- Se debe proporcionar filtros avanzados que incluyan: nivel educativo, años de experiencia, habilidades técnicas, ubicación y disponibilidad.
- Los resultados de búsqueda deben mostrarse en una tabla ordenable con información relevante del candidato.
- Debe ser posible guardar búsquedas frecuentes para acceder rápidamente a ellas en el futuro.
- La interfaz de búsqueda debe ser responsiva y funcionar en diferentes dispositivos.

**Notas:**

- Considerar la implementación de autocompletado en la barra de búsqueda.
- Los filtros deben ser intuitivos y fáciles de usar.

## Historia 2: Seguimiento del Proceso de Selección

**Como** reclutador,
**Quiero** poder actualizar y seguir el estado de los candidatos en el proceso de selección,
**Para** mantener un registro claro del progreso de cada candidato y tomar decisiones informadas.

**Criterios de Aceptación:**

- Cada candidato debe tener un panel de seguimiento que muestre su estado actual en el proceso de selección.
- Debe ser posible actualizar el estado del candidato a través de un sistema de arrastrar y soltar o mediante un menú desplegable.
- Los estados del proceso deben ser configurables, pero incluir por defecto: "Aplicación Recibida", "Revisión de CV", "Entrevista Inicial", "Prueba Técnica", "Entrevista Final", "Oferta Enviada", "Contratado", "Rechazado".
- Se debe poder añadir notas y comentarios a cada etapa del proceso.
- El sistema debe enviar notificaciones cuando un candidato cambie de estado.
- Debe existir una vista de tablero Kanban que muestre todos los candidatos organizados por su estado en el proceso.

**Notas:**

- La interfaz debe ser intuitiva y permitir actualizaciones rápidas.
- Considerar la posibilidad de integrar recordatorios para seguimiento.

## Historia 3: Generación de Reportes de Candidatos

**Como** reclutador o gerente de RRHH,
**Quiero** poder generar reportes sobre los candidatos y procesos de selección,
**Para** analizar la eficacia del proceso de reclutamiento y tomar decisiones estratégicas.

**Criterios de Aceptación:**

- Debe existir una sección de reportes accesible desde el dashboard principal.
- Los reportes deben incluir métricas clave como: número de candidatos por posición, tiempo promedio en cada etapa del proceso, tasas de conversión entre etapas, y fuentes de reclutamiento más efectivas.
- Debe ser posible filtrar los reportes por período de tiempo, posición, departamento o cualquier otro criterio relevante.
- Los reportes deben ser visuales, incluyendo gráficos y tablas para facilitar la comprensión de los datos.
- Debe existir la opción de exportar los reportes en formatos comunes como PDF, Excel o CSV.
- Los reportes deben actualizarse en tiempo real o tener una opción de actualización manual.

**Notas:**

- Considerar la implementación de un dashboard analítico con métricas en tiempo real.
- Los reportes deben ser accesibles y fáciles de interpretar para usuarios no técnicos.
