-- ================================================
-- INNOVATION HUB
-- Tarea 3 - Consultas SQL Server
-- ================================================
--
-- Estas consultas muestran cómo utilizar el
-- modelo relacional propuesto para Innovation Hub.
--
-- Los resultados esperados se basan en los datos
-- de prueba del archivo modelo-datos.md.
--
-- ================================================

USE InnovationHub;
GO


-- ================================================
-- CONSULTA 1: JOIN DE UNO A MUCHOS (1:N)
-- ================================================
--
-- Objetivo:
-- Mostrar las iniciativas con el nombre de su
-- propietario.
--
-- Relación:
-- Un usuario puede publicar varias iniciativas,
-- pero cada iniciativa tiene un propietario.
--
-- Resultado esperado:
-- Plataforma de tutorías - Ana Rodríguez
-- Sistema de biblioteca - Carlos Mora
-- Aplicación de voluntariado - María López
-- ================================================

SELECT
    i.Id,
    i.Titulo,
    u.Nombre AS Propietario,
    i.Visibilidad,
    i.Estado
FROM Iniciativas i
INNER JOIN Usuarios u
    ON i.PropietarioId = u.Id;
GO


-- ================================================
-- CONSULTA 2: JOIN DE MUCHOS A MUCHOS (N:M)
-- ================================================
--
-- Objetivo:
-- Mostrar los usuarios y sus competencias.
--
-- Relación:
-- Un usuario puede tener varias competencias
-- y una competencia puede pertenecer a varios
-- usuarios.
--
-- Se utiliza la tabla UsuarioCompetencias.
--
-- Resultado esperado:
-- Ana Rodríguez - JavaScript - avanzado
-- Ana Rodríguez - SQL Server - intermedio
-- Carlos Mora - React - avanzado
-- Carlos Mora - SQL Server - intermedio
-- María López - Diseño UX - avanzado
-- María López - Comunicación - intermedio
-- ================================================

SELECT
    u.Nombre AS Usuario,
    c.Nombre AS Competencia,
    uc.Nivel
FROM Usuarios u
INNER JOIN UsuarioCompetencias uc
    ON u.Id = uc.UsuarioId
INNER JOIN Competencias c
    ON uc.CompetenciaId = c.Id
ORDER BY u.Nombre, c.Nombre;
GO


-- ================================================
-- CONSULTA 3: GROUP BY Y COUNT
-- ================================================
--
-- Objetivo:
-- Contar cuántas solicitudes ha recibido cada
-- iniciativa.
--
-- LEFT JOIN permite mostrar también iniciativas
-- que todavía no tienen solicitudes.
--
-- Resultado esperado:
-- Plataforma de tutorías - 1 solicitud
-- Sistema de biblioteca - 1 solicitud
-- Aplicación de voluntariado - 0 solicitudes
-- ================================================

SELECT
    i.Titulo,
    COUNT(s.Id) AS TotalSolicitudes
FROM Iniciativas i
LEFT JOIN Solicitudes s
    ON i.Id = s.IniciativaId
GROUP BY i.Id, i.Titulo
ORDER BY i.Id;
GO


-- ================================================
-- CONSULTA 4: UPDATE CON WHERE
-- ================================================
--
-- Objetivo:
-- Cambiar el estado de una solicitud pendiente
-- a aceptada.
--
-- Se utiliza WHERE para modificar únicamente
-- la solicitud indicada.
--
-- Resultado esperado:
-- La solicitud con Id = 2 cambia su estado
-- de pendiente a aceptada.
--
-- Esta consulta es un ejemplo. En el sistema
-- también se debe actualizar la membresía
-- correspondiente cuando se acepta una solicitud.
-- ================================================

UPDATE Solicitudes
SET
    Estado = 'aceptada',
    FechaModificacion = GETDATE()
WHERE Id = 2
  AND Estado = 'pendiente';
GO


-- ================================================
-- CONSULTA 5: DELETE CON WHERE
-- ================================================
--
-- Objetivo:
-- Eliminar una relación entre un usuario y
-- una competencia.
--
-- Se utiliza WHERE para indicar exactamente
-- cuál relación se desea eliminar.
--
-- Resultado esperado:
-- Se elimina la competencia Comunicación
-- (CompetenciaId = 5) de María López
-- (UsuarioId = 3).
--
-- El usuario y la competencia permanecen
-- registrados en sus respectivas tablas.
-- ================================================

DELETE FROM UsuarioCompetencias
WHERE UsuarioId = 3
  AND CompetenciaId = 5;
GO


-- ================================================
-- CONSULTA 6: INSERT QUE FALLA POR RESTRICCIÓN
-- ================================================
--
-- Objetivo:
-- Comprobar que SQL Server no permite registrar
-- dos usuarios con el mismo correo electrónico.
--
-- La columna Correo de Usuarios tiene UNIQUE.
--
-- Resultado esperado:
-- Si ya existe el correo ana@ejemplo.com,
-- SQL Server rechaza este INSERT por duplicado.
--
-- No se crea un nuevo usuario.
-- ================================================

INSERT INTO Usuarios (
    Nombre,
    Correo,
    ContrasenaHash,
    Carrera,
    Disponibilidad
)
VALUES (
    'Usuario de prueba',
    'ana@ejemplo.com',
    'hash_de_prueba',
    'Ingeniería de Software',
    'Tardes'
);
GO
