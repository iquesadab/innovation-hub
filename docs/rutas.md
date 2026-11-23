# Diseño de rutas de lectura — Innovation Hub

## 1. Introducción

En este documento se presenta el diseño de dos rutas GET existentes en la API de Innovation Hub.

El objetivo es explicar cómo se obtendrían los datos desde SQL Server y cómo se construirían las respuestas JSON que utiliza actualmente el cliente React.

Las rutas seleccionadas son públicas, por lo que no requieren iniciar sesión.

Se mantiene el contrato definido durante el Avance 2, incluyendo los nombres de los campos y los identificadores como cadenas de texto.

Los ejemplos utilizan los datos de prueba documentados en `modelo-datos.md`.

---

## 2. Ruta GET /api/initiatives

### 2.1. Descripción

Esta ruta permite consultar el catálogo de iniciativas.

También permite realizar búsquedas, aplicar filtros y paginar los resultados.

**Endpoint:**

`GET /api/initiatives?type=&category=&skill=&q=&page=1&size=10`

**Parámetros:**

| Parámetro | Descripción |
|---|---|
| type | Filtra por tipo de iniciativa. |
| category | Filtra por categoría. |
| skill | Filtra por competencia requerida. |
| q | Busca iniciativas por texto. |
| page | Número de página. |
| size | Cantidad de resultados por página. |

### 2.2. Tablas utilizadas

| Tabla | Uso |
|---|---|
| Iniciativas | Obtiene los datos de las iniciativas. |
| Usuarios | Obtiene información del propietario. |
| IniciativaCompetencias | Permite filtrar por competencias. |
| Competencias | Obtiene los nombres de las competencias. |

### 2.3. Consulta SQL

Esta consulta obtiene las iniciativas visibles para un visitante, aplicando los filtros y la paginación.

```sql
DECLARE @Tipo NVARCHAR(60) = NULL;
DECLARE @Categoria NVARCHAR(100) = NULL;
DECLARE @Competencia NVARCHAR(100) = NULL;
DECLARE @Busqueda NVARCHAR(100) = NULL;
DECLARE @Pagina INT = 1;
DECLARE @Limite INT = 10;

SELECT
    i.Id,
    i.Titulo,
    i.Tipo,
    i.Resumen,
    i.Categoria,
    i.PropietarioId,
    i.Visibilidad,
    i.Estado,
    i.FechaCreacion,
    i.FechaModificacion
FROM Iniciativas i
WHERE i.Estado <> 'archivada'
  AND i.Visibilidad IN ('publica', 'restringida')
  AND (@Tipo IS NULL OR i.Tipo = @Tipo)
  AND (@Categoria IS NULL OR i.Categoria = @Categoria)
  AND (
      @Busqueda IS NULL
      OR i.Titulo LIKE '%' + @Busqueda + '%'
      OR i.Resumen LIKE '%' + @Busqueda + '%'
  )
  AND (
      @Competencia IS NULL
      OR EXISTS (
          SELECT 1
          FROM IniciativaCompetencias ic
          INNER JOIN Competencias c
              ON ic.CompetenciaId = c.Id
          WHERE ic.IniciativaId = i.Id
            AND c.Nombre LIKE '%' + @Competencia + '%'
      )
  )
ORDER BY i.FechaCreacion DESC, i.Id DESC
OFFSET (@Pagina - 1) * @Limite ROWS
FETCH NEXT @Limite ROWS ONLY;
```

El servidor debe realizar también un conteo con los mismos filtros, sin `OFFSET` ni `FETCH`, para obtener el campo `total`.

En la implementación final, SQL Server deberá utilizar una intercalación adecuada para mantener las búsquedas sin distinguir mayúsculas ni tildes, como sucede actualmente en Express.

### 2.4. Respuesta JSON

**Código HTTP:** `200 OK`

Ejemplo basado en los datos de prueba, suponiendo que la iniciativa 1 es pública y tiene estado `abierta`:

```json
{
  "iniciativas": [
    {
      "id": "1",
      "titulo": "Plataforma de tutorías",
      "tipo": "idea",
      "resumen": "Plataforma para conectar estudiantes y tutores.",
      "categoria": "Educación",
      "propietarioId": "1",
      "visibilidad": "publica",
      "estado": "abierta",
      "fechaCreacion": "2026-11-10T10:00:00.000Z",
      "fechaModificacion": "2026-11-10T10:00:00.000Z",
      "descripcion": "Sistema para facilitar tutorías entre estudiantes.",
      "problema": "Dificultad para encontrar apoyo académico.",
      "beneficiarios": "Estudiantes universitarios",
      "competencias": ["JavaScript", "React"],
      "miembrosEstimados": 3,
      "miembros": ["1", "2"],
      "etiquetas": []
    }
  ],
  "total": 1,
  "pagina": 1,
  "limite": 10
}
```

Las fechas y los datos descriptivos son ilustrativos. Los nombres de las propiedades y la estructura corresponden a las funciones `consultarIniciativas` y `prepararIniciativa` del servicio Express.

### 2.5. Recorrido de los datos

1. React solicita el listado con los filtros.
2. El servidor valida los parámetros.
3. SQL Server consulta las iniciativas visibles.
4. El servidor obtiene el total de coincidencias.
5. Se consultan las competencias, los integrantes y las etiquetas necesarios para construir cada objeto.
6. Se aplican las reglas de visibilidad.
7. Se devuelven `iniciativas`, `total`, `pagina` y `limite`, manteniendo los identificadores como texto.


---

## 3. Ruta GET /api/initiatives/:id

### 3.1. Descripción

Esta ruta permite consultar el detalle de una iniciativa.

Además de sus datos principales, permite obtener las competencias requeridas.

**Endpoint:**

`GET /api/initiatives/:id`

**Ejemplo:**

`GET /api/initiatives/1`

La ruta utiliza el identificador de la iniciativa para consultar su información.

### 3.2. Tablas utilizadas

| Tabla | Uso |
|---|---|
| Iniciativas | Obtiene los datos principales. |
| Usuarios | Identifica al propietario. |
| IniciativaCompetencias | Relaciona la iniciativa con sus competencias. |
| Competencias | Obtiene los nombres de las competencias. |

### 3.3. Consulta SQL

Primero se obtiene la información principal de la iniciativa.

```sql
DECLARE @IniciativaId INT = 1;

SELECT
    i.Id,
    i.Titulo,
    i.Tipo,
    i.Categoria,
    i.Resumen,
    i.Descripcion,
    i.Problema,
    i.Beneficiarios,
    i.MiembrosEstimados,
    i.Visibilidad,
    i.Estado,
    i.PropietarioId,
    i.FechaCreacion,
    i.FechaModificacion
FROM Iniciativas i
WHERE i.Id = @IniciativaId;
```

Después se consultan sus competencias:

```sql
DECLARE @IniciativaId INT = 1;

SELECT c.Nombre AS Competencia
FROM IniciativaCompetencias ic
INNER JOIN Competencias c
    ON ic.CompetenciaId = c.Id
WHERE ic.IniciativaId = @IniciativaId
ORDER BY c.Nombre;
```

Esta consulta demuestra la relación muchos a muchos entre iniciativas y competencias.

Para completar la respuesta, también se consultan los integrantes:

```sql
DECLARE @IniciativaId INT = 1;

SELECT UsuarioId
FROM IniciativaMiembros
WHERE IniciativaId = @IniciativaId;
```

Las etiquetas todavía no tienen una tabla en el modelo SQL propuesto. Será necesario incorporarlas al diseño para conservar completamente la respuesta de Express.

### 3.4. Respuesta JSON

**Código HTTP:** `200 OK`

```json
{
  "iniciativa": {
    "id": "1",
    "titulo": "Plataforma de tutorías",
    "tipo": "idea",
    "resumen": "Plataforma para conectar estudiantes y tutores.",
    "categoria": "Educación",
    "propietarioId": "1",
    "visibilidad": "publica",
    "estado": "abierta",
    "fechaCreacion": "2026-11-10T10:00:00.000Z",
    "fechaModificacion": "2026-11-10T10:00:00.000Z",
    "descripcion": "Sistema para facilitar tutorías entre estudiantes.",
    "problema": "Dificultad para encontrar apoyo académico.",
    "beneficiarios": "Estudiantes universitarios",
    "competencias": [
      "JavaScript",
      "React"
    ],
    "miembrosEstimados": 3,
    "miembros": ["1", "2"],
    "etiquetas": []
  }
}
```

Este ejemplo utiliza los nombres de campos definidos en `prepararIniciativa` y la estructura de respuesta del controlador.

Los valores son ilustrativos. En una migración real, los identificadores deberán corresponder a los registros migrados.

### 3.5. Recorrido de los datos

1. React solicita el detalle mediante el identificador.
2. El servidor busca la iniciativa en SQL Server.
3. Se consultan sus competencias y miembros.
4. Se aplican las reglas de visibilidad.
5. El servidor construye el objeto `iniciativa`.
6. Los identificadores se envían como cadenas de texto.
7. React recibe el JSON y muestra el detalle.

---

## 4. Conservación del contrato de API

La entrega final de Innovation Hub utilizará SQL Server y ASP.NET Core en lugar de MongoDB y Express.

Sin embargo, el cliente React debe continuar funcionando sin modificar sus peticiones.

Por eso, el nuevo servidor debe conservar:

- Las mismas rutas y métodos HTTP.
- Los mismos nombres de campos JSON.
- Los identificadores representados como texto.
- Las fechas en formato ISO 8601.
- Los mismos códigos de respuesta.
- Las reglas de visibilidad y autorización.
- La estructura de los errores.

La base de datos puede cambiar internamente, pero las respuestas que recibe React deben mantenerse.

---

## 5. Conclusión

Las dos rutas seleccionadas permiten demostrar cómo se utilizaría el modelo relacional de Innovation Hub.

La primera consulta obtiene un listado de iniciativas con filtros y paginación.

La segunda obtiene el detalle de una iniciativa y utiliza una tabla intermedia para consultar sus competencias.

Con este diseño se muestra cómo SQL Server puede reemplazar las consultas actuales de MongoDB sin cambiar el funcionamiento esperado del cliente React.
