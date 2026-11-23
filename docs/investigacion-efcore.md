
# Investigación: Entity Framework Core

## 1. Introducción

Entity Framework Core (EF Core) es una herramienta de .NET que permite trabajar con bases de datos utilizando clases y objetos de C#. En lugar de escribir todas las consultas directamente en SQL, podemos utilizar LINQ para consultar la información.

En Innovation Hub, EF Core podría utilizarse si en el futuro se reemplaza el servidor Express por ASP.NET Core y se utiliza SQL Server como base de datos.

## 2. Diferencia entre Select e Include

`Select` permite seleccionar únicamente los campos que necesitamos de una tabla. Por ejemplo, si queremos mostrar el catálogo de iniciativas, podríamos consultar solamente el identificador, el título y el resumen.

```csharp
var iniciativas = await contexto.Iniciativas
    .Select(i => new
    {
        i.Id,
        i.Titulo,
        i.Resumen
    })
    .ToListAsync();
```

Por otra parte, `Include` permite cargar información relacionada con una entidad. Por ejemplo, consultar las iniciativas junto con sus competencias:

```csharp
var iniciativas = await contexto.Iniciativas
    .Include(i => i.Competencias)
    .ToListAsync();
```

La diferencia principal es que `Select` sirve para escoger los datos que queremos devolver, mientras que `Include` permite cargar entidades relacionadas.

Para el catálogo de Innovation Hub sería conveniente utilizar `Select`, porque no siempre necesitamos recuperar toda la información. En cambio, `Include` podría ser útil cuando necesitamos trabajar con una iniciativa y sus relaciones.

## 3. Uso de AsNoTracking

Normalmente, EF Core puede dar seguimiento a las entidades consultadas para detectar cambios y guardarlos posteriormente.

`AsNoTracking` indica que no necesitamos ese seguimiento. Es útil cuando solamente queremos consultar información y no modificarla.

```csharp
var iniciativas = await contexto.Iniciativas
    .AsNoTracking()
    .ToListAsync();
```

En Innovation Hub se podría utilizar para mostrar el catálogo público de iniciativas, ya que el usuario solamente está consultando información.

Esto puede reducir el trabajo que realiza EF Core y mejorar el rendimiento de consultas de solo lectura.

## 4. Relaciones muchos a muchos

Una relación muchos a muchos ocurre cuando un registro puede relacionarse con varios registros de otra tabla y viceversa.

En Innovation Hub, una iniciativa puede necesitar varias competencias y una misma competencia puede pertenecer a diferentes iniciativas.

En SQL Server representamos esta relación mediante tres tablas:

- `Iniciativas`
- `Competencias`
- `IniciativaCompetencias`

EF Core ofrece dos formas de trabajar con este tipo de relaciones.

### 4.1. Skip navigations

Permiten acceder directamente a las competencias de una iniciativa sin manejar manualmente la tabla intermedia desde el código.

EF Core se encarga de administrar la relación.

Esta opción es conveniente cuando la tabla intermedia solamente contiene las llaves de las entidades relacionadas.

### 4.2. Entidad intermedia explícita

Consiste en crear una clase que represente la tabla intermedia.

Es especialmente útil cuando la relación contiene información adicional.

Por ejemplo, la tabla `UsuarioCompetencias` de Innovation Hub guarda el nivel de cada competencia (`basico`, `intermedio` o `avanzado`).

En ese caso, conviene utilizar una entidad intermedia explícita, porque necesitamos consultar y administrar ese nivel.

## 5. Paginación con Skip y Take

La paginación permite consultar los resultados por partes, evitando devolver todos los registros al mismo tiempo.

En EF Core podemos utilizar:

- `Skip`: omite una cantidad de registros.
- `Take`: indica cuántos registros queremos obtener.

Por ejemplo, para mostrar la segunda página de un catálogo con diez iniciativas por página:

```csharp
var iniciativas = await contexto.Iniciativas
    .OrderBy(i => i.Id)
    .Skip(10)
    .Take(10)
    .ToListAsync();
```

En SQL Server, esta operación normalmente se traduce utilizando `OFFSET` y `FETCH`.

Para Innovation Hub, este mecanismo permitiría conservar los parámetros `page` y `size` que actualmente recibe Express.

Es importante ordenar los resultados de manera estable para evitar registros repetidos u omitidos entre páginas. También debemos considerar que saltar una gran cantidad de registros puede afectar el rendimiento.

## 6. Conclusión

Entity Framework Core sería una opción útil para una futura migración de Innovation Hub a ASP.NET Core y SQL Server.

`Select` ayudaría a recuperar solamente los campos necesarios; `Include` permitiría consultar relaciones; `AsNoTracking` sería apropiado para consultas de lectura; las relaciones muchos a muchos podrían representarse mediante navegaciones o entidades intermedias; y `Skip` junto con `Take` permitirían mantener la paginación del catálogo.

De esta forma, podríamos cambiar la tecnología del servidor sin modificar necesariamente la estructura de las respuestas que recibe React.

## 7. Referencias

Microsoft. (s. f.). *Consultas eficaces: EF Core*. Microsoft Learn.
https://learn.microsoft.com/es-es/ef/core/performance/efficient-querying

Microsoft. (s. f.). *Many-to-many relationships*. Microsoft Learn.
https://learn.microsoft.com/en-us/ef/core/modeling/relationships/many-to-many

Microsoft. (s. f.). *Changing foreign keys and navigations*. Microsoft Learn.
https://learn.microsoft.com/en-us/ef/core/change-tracking/relationship-changes
