# field-management Specification

## Purpose

Permite gestionar canchas deportivas dentro de la plataforma: registrar, consultar, modificar y eliminar canchas, y asociarlas a los equipos que las utilizan mediante una relación muchos a muchos.

## Requirements

### Requirement: Crear cancha

El sistema SHALL permitir crear una cancha con un nombre. El nombre NO SHALL ser único: puede repetirse. El enlace permanente es opcional y, cuando se define, NO SHALL repetirse. El resto de datos (ciudad, estado, país, dirección y mapa) son opcionales.

#### Scenario: Crear cancha válida solo con nombre
- **WHEN** se envía una solicitud de creación con un nombre válido y sin los datos opcionales
- **THEN** se crea la cancha con el nombre indicado y sin los datos opcionales

#### Scenario: Crear cancha válida con todos los datos
- **WHEN** se envía una solicitud de creación con un nombre válido, un enlace permanente, ciudad, estado, país, dirección y mapa
- **THEN** se crea la cancha con todos los datos indicados

#### Scenario: Crear cancha con enlace permanente duplicado
- **WHEN** se intenta crear una cancha cuyo enlace permanente ya existe en otra cancha
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar canchas

El sistema SHALL permitir listar canchas con paginación y obtener una cancha individual por su identificador o por su enlace permanente. Al obtener una cancha individual, el sistema SHALL incluir sus equipos asociados si los tiene, exponiendo solo el identificador y el nombre de cada equipo.

#### Scenario: Listar canchas paginado
- **WHEN** se solicita la lista de canchas con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de canchas

#### Scenario: Obtener una cancha por identificador
- **WHEN** se solicita una cancha cuyo identificador existe
- **THEN** el sistema devuelve los datos de esa cancha, incluyendo sus equipos asociados si los tiene, exponiendo solo el identificador y el nombre de cada equipo

#### Scenario: Obtener una cancha por enlace permanente
- **WHEN** se solicita una cancha a través de su enlace permanente
- **THEN** el sistema devuelve los datos de esa cancha

#### Scenario: Obtener una cancha inexistente
- **WHEN** se solicita una cancha cuyo identificador o enlace permanente no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar cancha

El sistema SHALL permitir modificar los datos de una cancha existente, incluyendo su nombre y cualquiera de sus datos opcionales. Un enlace permanente definido NO SHALL repetirse entre canchas.

#### Scenario: Actualizar nombre de una cancha
- **WHEN** se actualiza el nombre de una cancha existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar cancha inexistente
- **WHEN** se intenta actualizar una cancha cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar cancha

El sistema SHALL permitir eliminar una cancha existente por su identificador. Al eliminarla, se eliminan también sus asociaciones con equipos.

#### Scenario: Eliminar una cancha existente
- **WHEN** se elimina una cancha cuyo identificador existe
- **THEN** la cancha se elimina, sus asociaciones con equipos se limpian y ya no aparece en el listado

#### Scenario: Eliminar una cancha inexistente
- **WHEN** se intenta eliminar una cancha cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado