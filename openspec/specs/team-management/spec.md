# team-management Specification

## Purpose

Permite gestionar equipos deportivos dentro de la plataforma: crear, consultar, actualizar y eliminar equipos, y asociarlos opcionalmente a un torneo existente.

## Requirements

### Requirement: Crear equipo
El sistema SHALL permitir crear un equipo con un nombre. El nombre NO SHALL ser único: puede repetirse en distintas categorías y torneos. El equipo MAY estar asociado a un torneo existente, a una categoría existente, o a ambos, y MAY existir sin ellos.

#### Scenario: Crear equipo válido sin torneo ni categoría
- **WHEN** se envía una solicitud de creación con un nombre válido y sin `tournamentId` ni `categoryId`
- **THEN** se crea el equipo con el nombre indicado y `tournamentId` y `categoryId` nulos

#### Scenario: Crear equipo válido con torneo y categoría
- **WHEN** se envía una solicitud de creación con un nombre válido, un `tournamentId` y un `categoryId` que referencian un torneo y una categoría existentes
- **THEN** se crea el equipo asociado a dicho torneo y a dicha categoría

#### Scenario: Crear equipo con el mismo nombre en otra categoría o torneo
- **WHEN** se intenta crear un equipo cuyo nombre ya existe pero en una categoría o torneo distintos
- **THEN** la creación se completa sin conflicto

#### Scenario: Crear equipo con torneo inexistente
- **WHEN** se intenta crear un equipo cuyo `tournamentId` no referencia un torneo existente
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear equipo con categoría inexistente
- **WHEN** se intenta crear un equipo cuyo `categoryId` no referencia una categoría existente
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar equipos
El sistema SHALL permitir listar equipos con paginación y obtener un equipo individual por su id. Al listar equipos, el sistema SHALL incluir la cantidad de jugadores registrados por equipo. Al obtener un equipo individual, el sistema SHALL incluir sus jugadores asociados si los tiene, exponiendo solo el `id` y el `name` de cada jugador.

#### Scenario: Listar equipos paginado
- **WHEN** se solicita la lista de equipos con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de equipos, incluyendo la cantidad de jugadores registrados por equipo

#### Scenario: Obtener un equipo por id
- **WHEN** se solicita un equipo cuyo id existe
- **THEN** el sistema devuelve los datos de ese equipo, incluyendo su torneo, su categoría y sus jugadores asociados si los tiene, exponiendo solo `id` y `name` de cada jugador

#### Scenario: Obtener un equipo inexistente
- **WHEN** se solicita un equipo cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar equipo
El sistema SHALL permitir modificar los datos de un equipo existente, incluyendo su nombre, su `tournamentId` y su `categoryId`. El `tournamentId` y el `categoryId` MAY asignar o quitar sus asociaciones. El nombre MAY repetirse en distintas categorías o torneos.

#### Scenario: Actualizar nombre de un equipo
- **WHEN** se actualiza el nombre de un equipo existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre sin restricción de unicidad global

#### Scenario: Asignar torneo a un equipo
- **WHEN** se actualiza el `tournamentId` de un equipo a un torneo existente
- **THEN** el equipo queda asociado a ese torneo

#### Scenario: Quitar torneo de un equipo
- **WHEN** se actualiza el `tournamentId` de un equipo a nulo
- **THEN** el equipo deja de estar asociado a ningún torneo

#### Scenario: Asignar categoría a un equipo
- **WHEN** se actualiza el `categoryId` de un equipo a una categoría existente
- **THEN** el equipo queda asociado a esa categoría

#### Scenario: Quitar categoría de un equipo
- **WHEN** se actualiza el `categoryId` de un equipo a nulo
- **THEN** el equipo deja de estar asociado a ninguna categoría

#### Scenario: Actualizar equipo inexistente
- **WHEN** se intenta actualizar un equipo cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar equipo
El sistema SHALL permitir eliminar un equipo existente por su id.

#### Scenario: Eliminar un equipo existente
- **WHEN** se elimina un equipo cuyo id existe
- **THEN** el equipo se elimina y ya no aparece en el listado

#### Scenario: Eliminar un equipo inexistente
- **WHEN** se intenta eliminar un equipo cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Asociar un entrenador a un equipo
El sistema SHALL permitir asociar a cada equipo un único entrenador (`coachId`). Un entrenador MAY dirigir varios equipos, pero un equipo SHALL tener a lo sumo un entrenador asociado. El `coachId` MAY asignarse o quitarse opcionalmente en la creación y actualización de un equipo.

#### Scenario: Crear equipo con entrenador
- **WHEN** se envía una solicitud de creación de un equipo con un `coachId` que referencia un entrenador existente
- **THEN** el equipo queda asociado a ese entrenador

#### Scenario: Crear equipo sin entrenador
- **WHEN** se envía una solicitud de creación de un equipo sin `coachId`
- **THEN** el equipo se crea con `coachId` nulo

#### Scenario: Crear equipo con entrenador inexistente
- **WHEN** se intenta crear un equipo cuyo `coachId` no referencia un entrenador existente
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Asignar entrenador a un equipo
- **WHEN** se actualiza el `coachId` de un equipo a un entrenador existente
- **THEN** el equipo queda asociado a ese entrenador

#### Scenario: Quitar entrenador de un equipo
- **WHEN** se actualiza el `coachId` de un equipo a nulo
- **THEN** el equipo deja de estar asociado a ningún entrenador

#### Scenario: Consultar equipos con su entrenador
- **WHEN** se lista o consulta un equipo
- **THEN** el sistema incluye los datos de su entrenador asociado si lo tiene