# coach-management Specification

## Purpose

Permite gestionar entrenadores (coaches) dentro de la plataforma: crear, consultar, actualizar y eliminar entrenadores, y asociarlos opcionalmente a los equipos que dirigen.

## Requirements

### Requirement: Crear entrenador
El sistema SHALL permitir crear un entrenador con un nombre y un email. El email SHALL ser único en todo el sistema. El entrenador MAY estar asociado a uno o varios equipos existentes y MAY existir sin ellos. El entrenador MAY tener teléfono, edad, nacionalidad, imagen, imagen pública, descripción y estado activo/inactivo (`active` por defecto `false`).

#### Scenario: Crear entrenador válido sin equipos
- **WHEN** se envía una solicitud de creación con un nombre válido y un email válido y sin `teamIds`
- **THEN** se crea el entrenador con el nombre y email indicados, sin equipos asociados y con `active` en `false` por defecto

#### Scenario: Crear entrenador válido con equipos
- **WHEN** se envía una solicitud de creación con un nombre válido, un email válido y una lista de `teamIds` que referencian equipos existentes
- **THEN** se crea el entrenador asociado a dichos equipos

#### Scenario: Crear entrenador con email duplicado
- **WHEN** se intenta crear un entrenador cuyo email ya está registrado en otro entrenador
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto/validación

#### Scenario: Crear entrenador con campos opcionales
- **WHEN** se envía una solicitud de creación con nombre, email, phone, age, nationality, imageUrl, imagePublicId y description
- **THEN** se crea el entrenador con todos los campos opcionales guardados

#### Scenario: Crear entrenador sin nombre o sin email
- **WHEN** se envía una solicitud de creación sin nombre o sin email
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar entrenadores
El sistema SHALL permitir listar entrenadores con paginación y obtener un entrenador individual por su id.

#### Scenario: Listar entrenadores paginado
- **WHEN** se solicita la lista de entrenadores con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de entrenadores

#### Scenario: Obtener un entrenador por id
- **WHEN** se solicita un entrenador cuyo id existe
- **THEN** el sistema devuelve los datos de ese entrenador, incluyendo sus equipos asociados si los tiene

#### Scenario: Obtener un entrenador inexistente
- **WHEN** se solicita un entrenador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar entrenador
El sistema SHALL permitir modificar los datos de un entrenador existente, incluyendo su nombre, su email, sus `teamIds` y todos sus atributos opcionales. La lista de `teamIds` MAY asignar o quitar asociaciones con equipos. El email SHALL permanecer único.

#### Scenario: Actualizar nombre de un entrenador
- **WHEN** se actualiza el nombre de un entrenador existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar email a un valor no usado
- **WHEN** se actualiza el email de un entrenador a un email no registrado por otro entrenador
- **THEN** el sistema guarda el nuevo email

#### Scenario: Actualizar email a un valor ya usado
- **WHEN** se intenta actualizar el email de un entrenador a un email ya registrado por otro entrenador
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto/validación

#### Scenario: Asignar equipos a un entrenador
- **WHEN** se actualiza la lista de `teamIds` de un entrenador para añadir equipos existentes
- **THEN** el entrenador queda asociado a esos equipos

#### Scenario: Quitar equipos de un entrenador
- **WHEN** se quita de la lista de `teamIds` la referencia a uno o varios equipos
- **THEN** el entrenador deja de estar asociado a esos equipos

#### Scenario: Actualizar atributos opcionales de un entrenador
- **WHEN** se actualizan campos opcionales como phone, age, nationality, imageUrl, imagePublicId o description
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar estado activo/inactivo
- **WHEN** se actualiza el campo `active` de un entrenador
- **THEN** el sistema guarda el nuevo estado

#### Scenario: Actualizar entrenador inexistente
- **WHEN** se intenta actualizar un entrenador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar entrenador
El sistema SHALL permitir eliminar un entrenador existente por su id.

#### Scenario: Eliminar un entrenador existente
- **WHEN** se elimina un entrenador cuyo id existe
- **THEN** el entrenador se elimina y ya no aparece en el listado

#### Scenario: Eliminar un entrenador inexistente
- **WHEN** se intenta eliminar un entrenador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado
