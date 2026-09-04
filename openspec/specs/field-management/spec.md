# field-management Specification

## Purpose

Permite gestionar canchas deportivas (fields) dentro de la plataforma: crear, consultar, actualizar y eliminar canchas, y asociarlas a los equipos que las utilizan a través de una relación muchos a muchos.

## Requirements

### Requirement: Crear cancha
El sistema SHALL permitir crear una cancha con un nombre. El nombre NO SHALL ser único: puede repetirse. El `permalink` es opcional y, cuando se proporciona, NO SHALL repetirse. El resto de campos (`city`, `state`, `country`, `address`, `map`) son opcionales.

#### Scenario: Crear cancha válida solo con nombre
- **WHEN** se envía una solicitud de creación con un nombre válido y sin los campos opcionales
- **THEN** se crea la cancha con el nombre indicado y con los campos opcionales nulos

#### Scenario: Crear cancha válida con todos los campos
- **WHEN** se envía una solicitud de creación con un nombre válido, un `permalink`, `city`, `state`, `country`, `address` y `map`
- **THEN** se crea la cancha con todos los datos indicados

#### Scenario: Crear cancha con permalink duplicado
- **WHEN** se intenta crear una cancha cuyo `permalink` ya existe en otra cancha
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar canchas
El sistema SHALL permitir listar canchas con paginación y obtener una cancha individual por su id o por su `permalink`. Al obtener una cancha individual, el sistema SHALL incluir sus equipos asociados si los tiene, exponiendo solo el `id` y el `name` de cada equipo.

#### Scenario: Listar canchas paginado
- **WHEN** se solicita la lista de canchas con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de canchas

#### Scenario: Obtener una cancha por id
- **WHEN** se solicita una cancha cuyo id existe
- **THEN** el sistema devuelve los datos de esa cancha, incluyendo sus equipos asociados si los tiene, exponiendo solo `id` y `name` de cada equipo

#### Scenario: Obtener una cancha por permalink
- **WHEN** se solicita una cancha a través de su `permalink`
- **THEN** el sistema devuelve los datos de esa cancha

#### Scenario: Obtener una cancha inexistente
- **WHEN** se solicita una cancha cuyo id o `permalink` no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar cancha
El sistema SHALL permitir modificar los datos de una cancha existente, incluyendo su nombre y cualquiera de sus campos opcionales. Un `permalink` asignado NO SHALL repetirse entre canchas.

#### Scenario: Actualizar nombre de una cancha
- **WHEN** se actualiza el nombre de una cancha existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar cancha inexistente
- **WHEN** se intenta actualizar una cancha cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar cancha
El sistema SHALL permitir eliminar una cancha existente por su id. Al eliminarla, se eliminan también sus asociaciones con equipos en la tabla pivote.

#### Scenario: Eliminar una cancha existente
- **WHEN** se elimina una cancha cuyo id existe
- **THEN** la cancha se elimina, sus asociaciones con equipos se limpian y ya no aparece en el listado

#### Scenario: Eliminar una cancha inexistente
- **WHEN** se intenta eliminar una cancha cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado
