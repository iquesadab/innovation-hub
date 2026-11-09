
# Contrato de API — Innovation Hub

## 1. Información general

La API permite que el cliente React consulte y modifique los datos de Innovation Hub.

- URL base: `/api`
- Formato de intercambio: JSON
- Autenticación: token JWT enviado en `Authorization: Bearer TOKEN`
- Las fechas se envían en formato ISO 8601.
- Los identificadores se representan como cadenas de texto.

## 2. Respuestas y errores

Respuestas exitosas:
- `200`: consulta o actualización correcta.
- `201`: recurso creado.
- `204`: operación correcta sin contenido.

Respuestas de error:
- `400`: datos inválidos.
- `401`: usuario no autenticado.
- `403`: usuario sin permisos.
- `404`: recurso no encontrado.
- `409`: conflicto con información existente.
- `500`: error interno del servidor.

Formato general de error:

```json
{
  "error": {
    "codigo": "DATOS_INVALIDOS",
    "mensaje": "Revise la información enviada."
  }
}
```

## 3. Usuarios y autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Consultar perfil propio |
| PATCH | `/api/auth/me` | Actualizar perfil |
| GET | `/api/auth/usuarios` | Buscar usuarios |

Registro:

```json
{
  "nombre": "Ana Rodríguez",
  "correo": "ana@ejemplo.com",
  "contrasena": "ClaveSegura123",
  "carrera": "Ingeniería en Software",
  "competencias": ["JavaScript", "React"],
  "disponibilidad": "Tardes"
}
```

Inicio de sesión:

```json
{
  "correo": "ana@ejemplo.com",
  "contrasena": "ClaveSegura123"
}
```

Respuesta de inicio de sesión (`200`):

```json
{
  "token": "TOKEN_JWT",
  "usuario": {
    "id": "ID_USUARIO",
    "nombre": "Ana Rodríguez",
    "correo": "ana@ejemplo.com",
    "carrera": "Ingeniería en Software",
    "competencias": ["JavaScript", "React"],
    "disponibilidad": "Tardes"
  }
}
```

Filtros de usuarios:

`GET /api/users?name=&skill=&career=&availability=&page=1&size=10`

Reglas:
- El correo identifica al usuario y no puede modificarse.
- Nunca se devuelve la contraseña ni su hash.
- El servidor valida los datos y permisos.
- El cierre de sesión elimina el token del cliente; en esta versión no existe una lista de revocación de tokens.

## 4. Iniciativas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/initiatives` | Listar y filtrar iniciativas |
| GET | `/api/initiatives/:id` | Consultar detalle |
| POST | `/api/initiatives` | Crear iniciativa |
| PUT | `/api/initiatives/:id` | Modificar iniciativa |
| DELETE | `/api/initiatives/:id` | Archivar iniciativa |

Filtros:

`GET /api/initiatives?type=&category=&skill=&q=&page=1&size=10`

Datos para crear una iniciativa:

```json
{
  "titulo": "Plataforma de reciclaje",
  "tipo": "Proyecto",
  "categoria": "Tecnología",
  "resumen": "Sistema para coordinar reciclaje.",
  "descripcion": "Descripción de la propuesta.",
  "problema": "Falta de coordinación.",
  "beneficiarios": "Comunidades locales",
  "competencias": ["React", "MongoDB"],
  "miembrosEstimados": 5,
  "visibilidad": "publica"
}
```

Reglas:
- Cada iniciativa tiene exactamente un propietario.
- El propietario se obtiene del usuario autenticado.
- Solo el propietario puede modificar o archivar.
- Visibilidades: `publica`, `institucional`, `restringida`, `privada`.
- La API aplica las reglas de visibilidad antes de devolver datos.
- Archivar no significa borrar físicamente el documento.

Respuesta de listado (`200`):

```json
{
  "datos": [],
  "pagina": 1,
  "tamano": 10,
  "total": 0
}
```

## 5. Solicitudes de participación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/solicitudes/iniciativas/:iniciativaId` | Crear solicitud |
| GET | `/api/solicitudes/mis-solicitudes` | Consultar mis solicitudes |
| GET | `/api/solicitudes/iniciativas/:iniciativaId` | Consultar solicitudes recibidas |
| PUT | `/api/solicitudes/:id` | Modificar solicitud pendiente |
| PATCH | `/api/solicitudes/:id/cancelar` | Cancelar solicitud |
| PATCH | `/api/solicitudes/:id/revisar` | Aceptar o rechazar solicitud |

Crear solicitud:

```json
{
  "iniciativaId": "ID_INICIATIVA",
  "motivo": "Quiero colaborar en el proyecto.",
  "experiencia": "Conocimientos de React.",
  "disponibilidad": "Fines de semana",
  "competencias": ["React"]
}
```

Cambiar estado:

```json
{
  "decision": "aceptada"
}
```

Reglas:
- Un propietario no puede solicitar participación en su propia iniciativa.
- No se permiten solicitudes pendientes duplicadas.
- El solicitante puede editar o cancelar mientras esté pendiente.
- Solo el propietario puede aceptar o rechazar.
- Aceptar una solicitud incorpora al solicitante al equipo.

## 6. Equipos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/initiatives/:id/miembros` | Consultar integrantes |
| DELETE | `/api/initiatives/:id/miembros/:miembroId` | Retirar integrante |

Reglas:
- Solo el propietario puede retirar integrantes.
- El propietario no puede retirarse a sí mismo.
- Los cambios se validan en el servidor.

## 7. Proyectos

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/projects/desde-iniciativa/:iniciativaId` | Convertir iniciativa en proyecto |
| GET | `/api/projects` | Listar proyectos |
| GET | `/api/projects/:id` | Consultar proyecto |

Convertir iniciativa:

```json
{
  "nombre": "Plataforma de reciclaje",
  "descripcion": "Sistema de colaboración comunitaria.",
  "objetivo": "Mejorar la gestión de reciclaje.",
  "fechaInicio": "2026-11-10",
  "estado": "planificado",
  "repositorioUrl": "https://github.com/usuario/repositorio"
}
```

Reglas:
- Solo el propietario puede convertir la iniciativa.
- Debe existir al menos un integrante adicional al propietario.
- El proyecto conserva la referencia a la iniciativa original.
- La modificación y archivo de proyectos se reservan para la entrega final.

## 8. Integración con GitHub

El cliente React consulta la API pública de GitHub para mostrar información de un repositorio vinculado a un proyecto.

Datos esperados:
- Nombre del repositorio.
- Propietario.
- Descripción.
- Lenguaje principal.
- Rama predeterminada.
- Fecha de última actualización.
- Cantidad de incidencias abiertas.

La interfaz debe manejar errores por repositorio inexistente, privado, límite de solicitudes y servicio no disponible.

## 9. Reglas generales

- La validación y autorización se realizan en el servidor.
- React no accede directamente a MongoDB.
- Las búsquedas, filtros y paginación se realizan en el servidor.
- Los errores utilizan el formato definido en este contrato.
- La API no expone contraseñas, hashes ni secretos.
- Este contrato deberá mantenerse estable para la entrega final.