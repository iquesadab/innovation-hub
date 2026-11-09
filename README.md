# Innovation Hub
**Proyecto del curso SOFT-12 — Desarrollo Web Full Stack.**  
**Estudiante:** Ivannia Quesada Bogantes  
**Sección:** SCV2  
**Periodo:** III cuatrimestre 2026  
**Docente:** Álvaro Cordero Peña

## **Avance 1**

### Descripción
Innovation Hub es una aplicación web que permite publicar ideas, necesidades y retos, indicar las competencias requeridas y facilitar la colaboración entre personas de la comunidad universitaria.

El prototipo permite explorar iniciativas, realizar búsquedas y filtros, consultar sus detalles, publicar nuevas iniciativas, modificarlas o eliminarlas y enviar solicitudes de participación.


### Estructura del repositorio
- `avance1/` — prototipo principal de Innovation Hub
  - `index.html` — página principal
  - `paginas/` — pantallas del prototipo
  - `datos/` — archivos JSON con datos simulados
  - `js/` — archivos JavaScript con la lógica del sistema
  - `css/` — estilos propios y personalización de Bootstrap

### Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- JSON
- LocalStorage

### Cómo ejecutar
1. Abrir el proyecto en Visual Studio Code.
2. Abrir `avance1/index.html`.
3. Ejecutar el proyecto utilizando Live Server.

No requiere instalación de dependencias ni conexión a una base de datos.

### Funcionalidades principales
- Visualización de iniciativas.
- Búsqueda por diferentes datos de las iniciativas.
- Filtrado de iniciativas.
- Consulta del detalle de una iniciativa.
- Publicación de nuevas iniciativas.
- Modificación de iniciativas creadas localmente.
- Eliminación de iniciativas creadas localmente.
- Almacenamiento local mediante LocalStorage.
- Visualización del perfil de usuario.
- Solicitud de participación en iniciativas.
- Validación de formularios mediante JavaScript.
- Diseño responsive mediante Bootstrap.

### Decisiones de diseño
Se utilizó Bootstrap para facilitar la creación de una interfaz responsive y mantener una estructura consistente entre las diferentes pantallas.

La identidad visual de Innovation Hub utiliza azul oscuro como color principal, turquesa como color secundario y coral como color de acento. También se utiliza la tipografía Poppins.

Los componentes de Bootstrap fueron personalizados desde la hoja de estilos propia utilizando variables CSS y variables de Bootstrap como `--bs-btn-bg`, permitiendo mantener la funcionalidad del framework sin utilizar únicamente sus estilos predeterminados.

Las iniciativas iniciales se cargan desde archivos JSON. Las iniciativas creadas por el usuario se almacenan en LocalStorage para simular la persistencia de información sin utilizar todavía una base de datos.

La interfaz fue desarrollada con un enfoque responsive utilizando la grilla y las utilidades de Bootstrap para adaptarse a diferentes tamaños de pantalla.

## **Avance 2**

### Descripción del Avance 2

En este segundo avance se continuó con el desarrollo de Innovation Hub, pero ahora utilizando React para la parte visual, Node.js y Express para el servidor y MongoDB para guardar la información.

A diferencia del Avance 1, donde utilizamos archivos JSON y LocalStorage para simular los datos, ahora la información se guarda en una base de datos real.

También se agregaron funcionalidades como el registro e inicio de sesión de usuarios, la administración de iniciativas, la edición del perfil y las solicitudes de participación.

El objetivo de este avance fue conectar las páginas de la aplicación con el servidor y la base de datos, manteniendo el diseño que se había trabajado anteriormente.

### Estructura del Avance 2

Para este avance se organizaron los archivos en diferentes carpetas, separando la parte visual, el servidor y la documentación.

```text
innovation-hub/
├── avance1/                 # Prototipo del primer avance
├── cliente/                 # Aplicación desarrollada con React
│   └── src/
│       ├── componentes/     # Componentes reutilizables
│       ├── paginas/         # Páginas de la aplicación
│       ├── servicios/       # Comunicación con el servidor
│       ├── App.jsx          # Control de páginas y navegación
│       └── main.jsx         # Inicio de React
├── servidor/                # API desarrollada con Express
│   ├── controllers/         # Reciben las peticiones
│   ├── services/            # Contienen las reglas del sistema
│   ├── models/              # Manejan los datos de MongoDB
│   ├── routes/              # Definen las rutas de la API
│   └── middleware/          # Verificación de tokens
├── docs/                    # Documentación técnica
│   ├── api-contract.md
│   └── modelo-datos.md
├── pruebas/                 # Pruebas de la API
├── README.md
└── .gitignore
```

### Tecnologías utilizadas en el Avance 2

- **React:** para crear las páginas y componentes de la aplicación.
- **Vite:** para ejecutar el proyecto React durante el desarrollo.
- **JavaScript:** para programar las funcionalidades del cliente y del servidor.
- **Bootstrap 5:** para mantener el diseño responsive.
- **CSS:** para conservar los estilos personalizados del Avance 1.
- **Node.js:** para ejecutar el servidor con JavaScript.
- **Express:** para crear las rutas de la API.
- **MongoDB Atlas:** para almacenar la información en la nube.
- **MongoDB Driver:** para conectar el servidor con la base de datos.
- **Git y GitHub:** para llevar el control de los cambios realizados.

### Arquitectura utilizada

En este avance se utilizó una arquitectura cliente-servidor.

```text
React (Cliente)
      |
      | Peticiones HTTP
      v
Node.js + Express (Servidor)
      |
      | Consultas
      v
MongoDB Atlas (Base de datos)
```

React muestra las páginas y permite que el usuario interactúe con ellas.

El servidor recibe las peticiones, realiza las validaciones y consulta o modifica la información en MongoDB.

De esta manera, el cliente no necesita conectarse directamente con la base de datos.

### Funcionalidades implementadas en el Avance 2

**Usuarios**
- Registro de nuevos usuarios.
- Inicio de sesión.
- Verificación del token para acceder a las funciones privadas.
- Consulta y edición del perfil.
- Búsqueda de usuarios.

**Iniciativas**
- Consulta del catálogo de iniciativas.
- Búsqueda y filtros.
- Consulta de los detalles de cada iniciativa.
- Publicación de nuevas iniciativas.
- Edición de iniciativas propias.
- Eliminación de iniciativas.
- Gestión de integrantes.

**Solicitudes de participación**
- Envío de solicitudes para participar en iniciativas.
- Consulta de las solicitudes enviadas.
- Edición y cancelación de solicitudes pendientes.
- Consulta de las solicitudes recibidas por una iniciativa.
- Aceptación o rechazo de solicitudes por parte del propietario.

**Proyectos**
- Conversión de iniciativas en proyectos desde el servidor.

Las funcionalidades del cliente se comunican con el servidor mediante peticiones HTTP, y la información se almacena en MongoDB.

### Instalación y ejecución del Avance 2

Para ejecutar Innovation Hub se necesita tener instalado Node.js, npm y contar con acceso a MongoDB Atlas.

#### 1. Descargar o abrir el proyecto

Clonar el repositorio desde GitHub o abrir la carpeta del proyecto en Visual Studio Code.

#### 2. Instalar las dependencias del servidor

Abrir una terminal dentro de la carpeta `servidor` y ejecutar:

```bash
npm install
```

Este comando instala las dependencias necesarias para ejecutar el servidor.

#### 3. Configurar la conexión con MongoDB

La base de datos se encuentra en MongoDB Atlas.

Para utilizarla es necesario:

1. Tener un clúster disponible en MongoDB Atlas.
2. Configurar el acceso a la base de datos.
3. Obtener la cadena de conexión.
4. Agregar la configuración correspondiente en las variables de entorno del servidor.

Las credenciales de conexión no se incluyen en el repositorio por seguridad.

#### 4. Ejecutar el servidor

Abrir una terminal dentro de la carpeta `servidor`.

Para ejecutar el servidor durante el desarrollo, utilizar:

```bash
npm run dev
```

Este comando inicia el servidor utilizando Nodemon, que permite reiniciarlo automáticamente cuando se realizan cambios en el código.

También se puede iniciar utilizando:

```bash
npm start
```

Este comando ejecuta el servidor con Node.js.

El servidor utiliza el puerto `3001`, por lo que su dirección local es:

`http://localhost:3001`

El servidor debe estar funcionando para que el cliente React pueda consultar y guardar información en MongoDB.

#### 5. Instalar las dependencias del cliente

Abrir otra terminal dentro de la carpeta `cliente` y ejecutar:

```bash
npm install
```

Este comando instala las dependencias necesarias para ejecutar la aplicación React.

#### 6. Ejecutar el cliente React

Desde la carpeta `cliente`, ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

Para utilizar todas las funcionalidades, el servidor y el cliente deben estar ejecutándose al mismo tiempo.

### Variables de entorno y seguridad

Para este avance se utilizan variables de entorno para configurar el servidor y proteger información importante.

Entre los datos que deben mantenerse privados se encuentran la conexión con MongoDB y la clave utilizada para generar los tokens de autenticación.

El archivo `.gitignore` permite evitar que se suban al repositorio archivos que no deben compartirse, como:

- `.env`
- `node_modules/`
- Archivos con contraseñas o credenciales privadas.

Las variables de entorno deben configurarse antes de ejecutar el servidor.

#### Configuración del archivo .env

Dentro de la carpeta `servidor` se utiliza un archivo `.env` con las siguientes variables:

```env
PORT=3001
DB_NAME=innovation_hub
MONGO_URI=CADENA_DE_CONEXION_DE_MONGODB
CLIENT_URL=http://localhost:5173
JWT_SECRET=CLAVE_SECRETA_DEL_SERVIDOR
```

Cada variable tiene una función:

- `PORT`: indica el puerto donde se ejecuta el servidor.
- `DB_NAME`: indica el nombre de la base de datos de MongoDB.
- `MONGO_URI`: contiene la cadena de conexión con MongoDB Atlas.
- `CLIENT_URL`: indica la dirección del cliente React.
- `JWT_SECRET`: se utiliza para firmar y verificar los tokens de autenticación.

Los valores de `MONGO_URI` y `JWT_SECRET` deben configurarse de forma privada y no deben subirse al repositorio de GitHub.

### Base de datos MongoDB

Para el Avance 2 se utilizó MongoDB Atlas como base de datos en la nube.

La base de datos se llama `innovation_hub` y contiene las siguientes colecciones:

- `usuarios`: almacena la información de los usuarios registrados.
- `iniciativas`: guarda las iniciativas publicadas en la plataforma.
- `solicitudes`: almacena las solicitudes de participación en las iniciativas.
- `proyectos`: guarda la información de los proyectos.

La aplicación se conecta a MongoDB desde el servidor mediante la variable de entorno `MONGO_URI`.

Las colecciones ya se encuentran creadas en MongoDB Atlas y contienen datos utilizados durante el desarrollo y las pruebas.

La estructura y las relaciones entre las colecciones se documentan en `docs/modelo-datos.md`.

### Documentación de la API

La API se desarrolló con Node.js y Express para permitir la comunicación entre React y MongoDB.

La documentación se encuentra en los siguientes archivos:

- `docs/api-contract.md`: contiene las rutas, los métodos HTTP, los datos que reciben las peticiones y las respuestas del servidor.
- `docs/modelo-datos.md`: describe las colecciones de MongoDB y sus relaciones.

El contrato de la API definido en este avance debe mantenerse para la entrega final del proyecto.

### Pruebas de la API

Las pruebas de la API se realizan utilizando peticiones HTTP para comprobar el funcionamiento del servidor.

Se deben verificar los siguientes casos:

- Peticiones con datos correctos.
- Peticiones con datos inválidos.
- Consultas de recursos que no existen.
- Peticiones realizadas sin autorización.

La colección de pruebas de Thunder Client debe guardarse en la carpeta `pruebas/` del repositorio.


### Resumen de commits

<!-- INICIO TABLA COMMITS -->
| # | Fecha | Hash | Mensaje |
|---|-------|------|---------|
| 1 | 2026-09-08 | 13292e1 | [init]: Crear estructura del avance 1 y documentación inicial |
| 2 | 2026-09-08 | a27f8b4 | [update]: Eliminar numero en el gitignore agregado por error |
| 3 | 2026-09-08 | 2ea9ed0 | [update]: Agregar resumen de commits al README |
| 4 | 2026-09-08 | 1ce0288 | [new]: Implementar tabla-commits.sh para la creacion de la tabla de commits en el README |
| 5 | 2026-09-08 | dee93e7 | [update]: Implementa la forma en la que la tabla se actualiza automáticamente |
| 6 | 2026-09-08 | 42563ef | [update]: Actualización de la tabla de commits |
| 7 | 2026-09-08 | 1f415a4 | [new]: Maquetar el encabezado y la navegación del catálogo |
| 8 | 2026-09-08 | fb97352 | [update]: Implementar parte del cuerpo de catalogo.html |
| 9 | 2026-09-08 | ce250b5 | [update]: Actualiza tabla de commits |
| 10 | 2026-09-08 | d2ff76a | [prueba]: Prueba de funcionamiento de hook |
| 11 | 2026-09-08 | b5a644f | [delete]: Elimina texto de prueba |
| 12 | 2026-09-22 | b205d2f | [new]: Agrega estructura inicial de la página principal con Bootstrap |
| 13 | 2026-09-23 | 1d8db3b | [improve]: Actualiza página principal y catálogo con Bootstrap |
| 14 | 2026-09-24 | f6d44b8 | [new]: Agrega datos y carga dinámica de iniciativas |
| 15 | 2026-09-24 | e8597b1 | [improve]: Completa filtros del catálogo y agrega detalle de iniciativas |
| 16 | 2026-09-25 | 8bce1c1 | [new]: Implementa detalle de iniciativas y corrige comentarios del catálogo |
| 17 | 2026-09-25 | fd5a307 | [new]: Agrega formulario para publicar iniciativas |
| 18 | 2026-09-26 | 2d21b20 | [new]: Implementa lógica y validaciones para publicar iniciativas |
| 19 | 2026-09-26 | 5261b3a | [improve]: Agrega edición y eliminación de iniciativas guardadas localmente |
| 20 | 2026-09-26 | a7c28b5 | [new]: Agrega perfil de usuario con competencias, intereses y proyectos |
| 21 | 2026-09-27 | 30e9203 | [new]: Agrega perfil, solicitud de participación e integración con iniciativas |
| 22 | 2026-09-27 | 65d4360 | [improve]: Completa solicitudes, integración y diseño visual de Innovation Hub |
| 23 | 2026-09-27 | 55adf7b | [update]: Actualiza tabla de commits para entrega final |
| 24 | 2026-11-02 | 4c58bba | [add]: Configura estructura inicial del servidor |
| 25 | 2026-11-02 | dcedf85 | [add]: Agrega conexión a MongoDB y servidor Express |
| 26 | 2026-11-02 | 33a368b | [docs]: Agrega contrato de API y modelo de datos |
| 27 | 2026-11-02 | c5aa4f6 | [add]: Agrega modelo de usuarios en MongoDB |
| 28 | 2026-11-02 | 0b14e3e | [add]: Agrega validaciones para registrar usuarios |
| 29 | 2026-11-03 | 7e8fcb4 | [add]: Conecta registro de usuarios |
| 30 | 2026-11-03 | 45a0865 | [add]: Agrega inicio de sesión |
| 31 | 2026-11-03 | 81a8299 | [add]: Agrega controlador para iniciar sesión |
| 32 | 2026-11-03 | 64de5ab | [add]: Agrega ruta para iniciar sesión |
| 33 | 2026-11-03 | d84d415 | [add]: Agrega revisión del token |
| 34 | 2026-11-04 | 1c3cbc9 | [add]: Agrega búsqueda de usuario por ID |
| 35 | 2026-11-04 | 234a2fe | [add]: Agrega consulta del perfil |
| 36 | 2026-11-04 | 553f66e | [add]: Agrega controlador del perfil |
| 37 | 2026-11-04 | d931e0d | [add]: Agrega ruta para consultar perfil |
| 38 | 2026-11-04 | 3b1c1fa | [add]: Permite editar el perfil de usuario |
| 39 | 2026-11-04 | 82bbef5 | [add]: Agrega búsqueda de usuarios |
| 40 | 2026-11-05 | b4d379d | [add]: Agrega CRUD de iniciativas |
| 41 | 2026-11-06 | deee1cc | [add]: Agrega solicitudes de participación |
| 42 | 2026-11-06 | aa701d8 | [fix]: Corrige acceso al cliente de MongoDB |
| 43 | 2026-11-06 | f42f9f6 | [add]: Agrega gestión de integrantes |
| 44 | 2026-11-07 | 298f8f7 | [add]: Agrega conversión de iniciativas en proyectos |
| 45 | 2026-11-07 | a4bbf7a | [fix]: Ajusta filtros de usuarios y reglas de iniciativas |
| 46 | 2026-11-07 | b528f6a | [new]: Crea la estructura inicial de React |
| 47 | 2026-11-07 | 0a683b4 | [new]: Agrega encabezado de Innovation Hub en React y mantiene estilos del avance 1 |
| 48 | 2026-11-07 | 588173e | [new]: Agrega página de inicio y pie de página en React |
| 49 | 2026-11-07 | dc3bf16 | [update]: Ajusta navegación según la sesión |
| 50 | 2026-11-07 | be00a04 | [new]: Agrega login, registro e inicio público |
| 51 | 2026-11-07 | 74a8bed | [new]: Agrega catálogo de iniciativas con búsqueda y filtros |
| 52 | 2026-11-07 | 03587ad | [new]: Agrega detalle de iniciativas |
| 53 | 2026-11-08 | 982a0b5 | [new]: Agrega formulario para publicar iniciativas |
| 54 | 2026-11-08 | 7313abd | [new]: Agrega consulta y edición del perfil |
| 55 | 2026-11-08 | 32b2db8 | [new]: Agrega solicitudes de participación y gestión de iniciativas |
| 56 | 2026-11-08 | 6df0dbf | [docs]: Actualiza el README con la informacion del Avance 2 |
| 57 | 2026-11-08 | 61851ab | [test]: Agrega las pruebas de la API con Thunder Client |
| 58 | 2026-11-08 | 36eb61e | [docs]: Actualiza la tabla de commits del proyecto |
| 59 | 2026-11-08 | df5b2f6 | [docs]: Corrige las rutas del contrato de API |
<!-- FIN TABLA COMMITS -->
