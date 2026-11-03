
# Modelo de datos — Innovation Hub

## 1. Base de datos

Nombre: `innovation_hub`

Se utiliza MongoDB Atlas con el controlador oficial `mongodb` de Node.js.

## 2. Colección usuarios

Guarda la información de las personas registradas.

Campos principales:
- `_id`: identificador único.
- `nombre`: nombre completo.
- `correo`: correo único e inmutable.
- `contrasenaHash`: contraseña protegida.
- `carrera`: carrera del usuario.
- `competencias`: lista de competencias.
- `disponibilidad`: disponibilidad para colaborar.
- `fechaCreacion`: fecha de registro.

## 3. Colección iniciativas

Guarda las propuestas publicadas.

Campos principales:
- `_id`: identificador.
- `titulo`, `tipo`, `categoria`, `resumen`.
- `descripcion`, `problema`, `beneficiarios`.
- `competencias`: competencias requeridas.
- `miembrosEstimados`: cantidad prevista de integrantes.
- `propietarioId`: referencia a usuarios.
- `miembros`: lista de identificadores de usuarios aceptados.
- `visibilidad`: publica, institucional, restringida o privada.
- `estado`: activa o archivada.
- `fechaCreacion`, `fechaModificacion`.

## 4. Colección solicitudes

Guarda las solicitudes de participación.

Campos principales:
- `_id`: identificador.
- `iniciativaId`: referencia a iniciativas.
- `usuarioId`: referencia al solicitante.
- `motivo`, `experiencia`, `disponibilidad`.
- `competencias`: competencias declaradas.
- `estado`: pendiente, aceptada, rechazada o cancelada.
- `fechaCreacion`, `fechaModificacion`.

## 5. Colección proyectos

Guarda las iniciativas convertidas en proyectos.

Campos principales:
- `_id`: identificador.
- `iniciativaId`: referencia a la iniciativa original.
- `propietarioId`: referencia al propietario.
- `nombre`, `descripcion`, `objetivo`.
- `fechaInicio`, `estado`.
- `repositorioUrl`: enlace opcional a GitHub.
- `miembros`: integrantes del equipo.
- `fechaCreacion`.

## 6. Relaciones

- Un usuario puede ser propietario de varias iniciativas.
- Una iniciativa tiene un único propietario.
- Una iniciativa puede recibir varias solicitudes.
- Una solicitud pertenece a una iniciativa y a un usuario.
- Una iniciativa puede convertirse en proyecto cuando tiene al menos un integrante adicional al propietario.

## 7. Decisiones de diseño

Se utilizan referencias mediante identificadores para relacionar usuarios, iniciativas, solicitudes y proyectos.

Se utilizan arreglos embebidos para datos sencillos como competencias y miembros del equipo.

Esta combinación permite consultar las entidades por separado sin duplicar toda la información de los usuarios en cada iniciativa.

## 8. Validaciones e índices

- El correo del usuario debe ser único.
- Los identificadores relacionados deben existir.
- No se permiten solicitudes pendientes duplicadas del mismo usuario para la misma iniciativa.
- El servidor valida permisos, visibilidad y estados.
- Se utilizarán índices para búsquedas frecuentes y restricciones de unicidad.