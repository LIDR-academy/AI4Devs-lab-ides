#PROMPTS INICIALES LPS

<!-- Hay muchos prompts. Pongo los más relevantes del princpio, que son para entender el proyecto y para preparar lo necesario para que funcione -->

-Indexa el proyecto y estudia su estructura

<!-- Muchos problemas al instalar docker desde Docker.dmg  -->

-Quiero instalar docker desde el terminal

<!-- Instala docker -->

- haz una comprobacion de conexion a la base de datos con los datos especificados en el acrhivo.env

<!-- GitHub Copilot
A continuación, te muestro un ejemplo de script en Node.js que carga las variables de entorno del archivo .env y realiza una conexión a la base de datos PostgreSQL usando la librería pg. Puedes guardar este código como, por ejemplo, test-connection.js dentro de la carpeta backend y ejecutarlo con node test-connection.js. -->

<!-- No está funcionando la comprobación de la conexión y ejecuto desde el terminal docker-compose logs db . Indico el error encontrado -->

- @workspace oretopardodesantayanagalbis@MacBook-Air-de-Loreto-2 AI4Devs-lab-ides % docker-compose logs db WARN[0000] .../AI4Devs-lab-ides/docker-compose.yml: the attribute version is obsolete, it will be ignored, please remove it to avoid potential confusion

<!-- Me indica que debo elimiar la línea version: "3.2" del docker-composer.yml -->

<!-- Me sigue fallando la conexión y era un problema con el puerto. Lo cambio el 5433 -->

<!-- A partir de aquí empiezo con el desarrollo de las soluciones a las tareas propouestas -->

<!-- Hago alguna pregunta que me ayude a escribir bien los próximos prompts -->

- ¿Basándote en otros proyectos ATS existentes, que campos crees que es necesario tener para los candidatos?

- # Implementación de la Interfaz de Usuario
ACCEDIENDO COMO RECLUTADOR
Los reclutadores tendrán su propio dashboard.
Desde la pantalla principal de dicho dashboard se podrá acceder a varias funciones, mediante botones claramente visibles. Por ahora sólo estará disponible la función de añadir un nuevo candidato. Este botón dará acceso a un formulario de ingreso de datos.
El formulario de ingreso de datos para candidatos tendrá los siguientes campos:
* Nombre
* Apellido
* Correo electrónico
* Teléfono
* Dirección
* Población
* Código postal
* Ciudad
* País
* Profesión actual
* Empresa actual
* Posición en la empresa
* Años de experiencia laboral
* Capacidades (poder añadir varias con los siguientes datos: tipo, categoría y nivel)
* Formación (poder añadir varias líneas con los siguientes datos:
* institution
* degree
* startDate
* endDate
* current (Boolean @default(false))
* description (String))
* Experiencia laboral (poder añadir varias con los siguientes datos:
* company
* position
* startDate
* endDate
* current (Boolean @default(false))
* description)
* CV: se podrá adjuntar un documento con el CV del candidato en formato PDF o DOCX
* Notas
* Etiquetas (para categorizar al candidato)
Requisitos del formulario:
* Todos estos campos del formulario deben tener una adecuada validación de datos, según la información pedida.
* Deben ser obligatorios el nombre, apellido, correo electrónico, teléfono y CV.
* Sería bueno que en el formulario haya funcionalidades de autocompletado para los campos que sea más adecuado. Quizá los campos Formación y Experiencia laboral.
* Si el formulario ha sido correctamente completado y todo ha ido bien, debe mostrar un mensaje de confirmación indicando que el candidato ha sido exitosamente añadido al sistema.
* En caso de haber algún error en los datos, o en la ejecución del código, debe mostrarse un mensaje adecuado al usuario, que pueda entenderlo, para informarle del problema.
Consideraciones adicionales:
* Esta funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
* La interfaz debe ser intuitiva y fácil de manejar, que tenga un diseño moderno y sencillo.
* En todo momento debe haber alguna forma de volver a la pantalla principal.


- Analiza y corrige los errores

- He olvidado decir que todo lo que se desarrolle tenga ** principios SOLID como DDD y TDD **.
Ahora vamos a desarrollar el ** backend necesario para la información ingresada en el formulario **. 

    - Hay que desarrollar los modelos de datos para esta información de los candidatos
    - Lanzar la migración en PostgreSQL
    - Implementar endpoints API en el backend
    - Y dime qué otras tareas ves necesarias para 