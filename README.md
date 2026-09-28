# Innovation Hub
**Proyecto del curso SOFT-12 — Desarrollo Web Full Stack.**  
**Estudiante:** Ivannia Quesada Bogantes  
**Sección:** SCV2  
**Periodo:** III cuatrimestre 2026  
**Docente:** Álvaro Cordero Peña

## Descripción
Innovation Hub es una aplicación web que permite publicar ideas, necesidades y retos, indicar las competencias requeridas y facilitar la colaboración entre personas de la comunidad universitaria.

El prototipo permite explorar iniciativas, realizar búsquedas y filtros, consultar sus detalles, publicar nuevas iniciativas, modificarlas o eliminarlas y enviar solicitudes de participación.


## Estructura del repositorio
- `avance1/` — prototipo principal de Innovation Hub
  - `index.html` — página principal
  - `paginas/` — pantallas del prototipo
  - `datos/` — archivos JSON con datos simulados
  - `js/` — archivos JavaScript con la lógica del sistema
  - `css/` — estilos propios y personalización de Bootstrap

## Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- JSON
- LocalStorage

## Cómo ejecutar
1. Abrir el proyecto en Visual Studio Code.
2. Abrir `avance1/index.html`.
3. Ejecutar el proyecto utilizando Live Server.

No requiere instalación de dependencias ni conexión a una base de datos.

## Funcionalidades principales
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

## Decisiones de diseño
Se utilizó Bootstrap para facilitar la creación de una interfaz responsive y mantener una estructura consistente entre las diferentes pantallas.

La identidad visual de Innovation Hub utiliza azul oscuro como color principal, turquesa como color secundario y coral como color de acento. También se utiliza la tipografía Poppins.

Los componentes de Bootstrap fueron personalizados desde la hoja de estilos propia utilizando variables CSS y variables de Bootstrap como `--bs-btn-bg`, permitiendo mantener la funcionalidad del framework sin utilizar únicamente sus estilos predeterminados.

Las iniciativas iniciales se cargan desde archivos JSON. Las iniciativas creadas por el usuario se almacenan en LocalStorage para simular la persistencia de información sin utilizar todavía una base de datos.

La interfaz fue desarrollada con un enfoque responsive utilizando la grilla y las utilidades de Bootstrap para adaptarse a diferentes tamaños de pantalla.

## Resumen de commits

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
<!-- FIN TABLA COMMITS -->
