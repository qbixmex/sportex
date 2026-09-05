## Purpose

Permite gestionar equipos deportivos dentro de la plataforma: registrar, consultar, modificar y eliminar equipos, y asociarlos opcionalmente a un torneo existente.

## ADDED Requirements

### Requirement: Crear equipo

El sistema SHALL permitir crear un equipo con un nombre. El nombre NO SHALL ser único: puede repetirse en distintas categorías y torneos. El equipo MAY estar asociado a un torneo existente, a una categoría existente, o a ambos, y MAY existir sin ellos.

#### Scenario: Crear equipo válido sin torneo ni categoría
- **WHEN** se envía una solicitud de creación con un nombre válido y sin torneo ni categoría
- **THEN** se crea el equipo con el nombre indicado y sin torneo ni categoría asociados

#### Scenario: Crear equipo válido con torneo y categoría
- **WHEN** se envía una solicitud de creación con un nombre válido, un torneo y una categoría que existen
- **THEN** se crea el equipo asociado a dicho torneo y a dicha categoría

#### Scenario: Crear equipo con el mismo nombre en otra categoría o torneo
- **WHEN** se intenta crear un equipo cuyo nombre ya existe pero en una categoría o torneo distintos
- **THEN** la creación se completa sin conflicto

#### Scenario: Crear equipo con torneo inexistente
- **WHEN** se intenta crear un equipo cuyo torneo no existe
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear equipo con categoría inexistente
- **WHEN** se intenta crear un equipo cuya categoría no existe
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar equipos

El sistema SHALL permitir listar equipos con paginación y obtener un equipo individual por su identificador.

#### Scenario: Listar equipos paginado
- **WHEN** se solicita la lista de equipos con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de equipos

#### Scenario: Obtener un equipo por identificador
- **WHEN** se solicita un equipo cuyo identificador existe
- **THEN** el sistema devuelve los datos de ese equipo, incluyendo su torneo y su categoría asociados si los tiene

#### Scenario: Obtener un equipo inexistente
- **WHEN** se solicita un equipo cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar equipo

El sistema SHALL permitir modificar los datos de un equipo existente, incluyendo su nombre, su torneo y su categoría. El torneo y la categoría MAY asignarse o quitarse. El nombre MAY repetirse en distintas categorías o torneos.

#### Scenario: Actualizar nombre de un equipo
- **WHEN** se actualiza el nombre de un equipo existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre sin restricción de unicidad

#### Scenario: Asignar torneo a un equipo
- **WHEN** se asigna a un equipo un torneo existente
- **THEN** el equipo queda asociado a ese torneo

#### Scenario: Quitar torneo de un equipo
- **WHEN** se quita el torneo de un equipo
- **THEN** el equipo deja de estar asociado a ningún torneo

#### Scenario: Asignar categoría a un equipo
- **WHEN** se asigna a un equipo una categoría existente
- **THEN** el equipo queda asociado a esa categoría

#### Scenario: Quitar categoría de un equipo
- **WHEN** se quita la categoría de un equipo
- **THEN** el equipo deja de estar asociado a ninguna categoría

#### Scenario: Actualizar equipo inexistente
- **WHEN** se intenta actualizar un equipo cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar equipo

El sistema SHALL permitir eliminar un equipo existente por su identificador.

#### Scenario: Eliminar un equipo existente
- **WHEN** se elimina un equipo cuyo identificador existe
- **THEN** el equipo se elimina y ya no aparece en el listado

#### Scenario: Eliminar un equipo inexistente
- **WHEN** se intenta eliminar un equipo cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado