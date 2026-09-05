## Why

La plataforma gestiona equipos y jugadores, pero carece de la figura del entrenador (coach), un rol esencial dentro de cualquier organización deportiva. Se necesita un módulo para gestionar entrenadores y asociarlos a los equipos que dirigen, cerrando así el modelo de staff deportivo.

## What Changes

- Crear un nuevo módulo `coaches` con CRUD completo (crear, listar, obtener por id, actualizar, eliminar), siguiendo el patrón de `players`.
- Definir la entidad `Coach` con los campos: `id` (uuid), `name` (text, requerido), `email` (text, único, requerido), `phone` (string, opcional), `age` (number, opcional), `nationality` (text, opcional), `imageUrl` (string, opcional), `imagePublicId` (string, opcional), `description` (string, opcional), `active` (boolean, por defecto `false`), `createdAt` y `updatedAt`.
- Asociar un coach a los equipos: un entrenador puede dirigir **muchos** equipos y un equipo tiene **un solo** entrenador (relación 1:N). El equipo adquiere una referencia `coachId` opcional.
- Registrar el módulo `coaches` en la aplicación y añadir la migración de base de datos correspondiente.
- Exponer la API de `coaches`, protegida con los mecanismos de autenticación por roles existentes.

## Capabilities

### New Capabilities
- `coach-management`: Gestión de entrenadores: crear, consultar (listado paginado y por id), actualizar y eliminar entrenadores, con email único y campos opcionales.

### Modified Capabilities
- `team-management`: un equipo ahora MAY estar asociado a un único entrenador (`coachId`), consultable y asignable/removible, y el listado/consulta de equipos refleja su entrenador.

## Impact

- **Nuevo código**: módulo `coaches` con su API CRUD; relación de equipo con entrenador.
- **Código modificado**: módulo `teams` (campo `coach`/`coachId`); registro del módulo `coaches` en la aplicación.
- **Base de datos**: nueva tabla `coaches` y columna `coach_id` en `teams`, mediante migración de base de datos.
- **API**: nuevos endpoints de `coaches`; el modelo de equipo gana el campo entrenador.
