## Purpose

Permite gestionar entrenadores dentro de la plataforma: registrar, consultar, modificar y eliminar entrenadores, y asociarlos opcionalmente a los equipos que dirigen.

## ADDED Requirements

### Requirement: Crear entrenador

El sistema SHALL permitir crear un entrenador con un nombre y un correo electrónico. El correo electrónico SHALL ser único en todo el sistema. El entrenador MAY estar asociado a uno o varios equipos existentes y MAY existir sin ellos. El entrenador MAY tener teléfono, edad, nacionalidad, imagen, descripción y estado activo/inactivo, siendo inactivo por defecto.

#### Scenario: Crear entrenador válido sin equipos
- **WHEN** se envía una solicitud de creación con un nombre válido y un correo electrónico válido y sin equipos asociados
- **THEN** se crea el entrenador con el nombre y correo indicados, sin equipos asociados y en estado inactivo por defecto

#### Scenario: Crear entrenador válido con equipos
- **WHEN** se envía una solicitud de creación con un nombre válido, un correo electrónico válido y una lista de equipos existentes
- **THEN** se crea el entrenador asociado a dichos equipos

#### Scenario: Crear entrenador con correo electrónico duplicado
- **WHEN** se intenta crear un entrenador cuyo correo electrónico ya está registrado en otro entrenador
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto/validación

#### Scenario: Crear entrenador con datos opcionales
- **WHEN** se envía una solicitud de creación con nombre, correo electrónico, teléfono, edad, nacionalidad, imagen y descripción
- **THEN** se crea el entrenador con todos los datos opcionales guardados

#### Scenario: Crear entrenador sin nombre o sin correo electrónico
- **WHEN** se envía una solicitud de creación sin nombre o sin correo electrónico
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar entrenadores

El sistema SHALL permitir listar entrenadores con paginación y obtener un entrenador individual por su identificador.

#### Scenario: Listar entrenadores paginado
- **WHEN** se solicita la lista de entrenadores con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de entrenadores

#### Scenario: Obtener un entrenador por identificador
- **WHEN** se solicita un entrenador cuyo identificador existe
- **THEN** el sistema devuelve los datos de ese entrenador, incluyendo sus equipos asociados si los tiene

#### Scenario: Obtener un entrenador inexistente
- **WHEN** se solicita un entrenador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar entrenador

El sistema SHALL permitir modificar los datos de un entrenador existente, incluyendo su nombre, su correo electrónico, sus equipos asociados y el resto de sus datos opcionales. La lista de equipos MAY asignar o quitar asociaciones. El correo electrónico SHALL permanecer único.

#### Scenario: Actualizar nombre de un entrenador
- **WHEN** se actualiza el nombre de un entrenador existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar correo electrónico a un valor no usado
- **WHEN** se actualiza el correo electrónico de un entrenador a uno no registrado por otro entrenador
- **THEN** el sistema guarda el nuevo correo electrónico

#### Scenario: Actualizar correo electrónico a un valor ya usado
- **WHEN** se intenta actualizar el correo electrónico de un entrenador a uno ya registrado por otro entrenador
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto/validación

#### Scenario: Asignar equipos a un entrenador
- **WHEN** se actualiza la lista de equipos de un entrenador para añadir equipos existentes
- **THEN** el entrenador queda asociado a esos equipos

#### Scenario: Quitar equipos de un entrenador
- **WHEN** se quita de la lista la referencia a uno o varios equipos
- **THEN** el entrenador deja de estar asociado a esos equipos

#### Scenario: Actualizar datos opcionales de un entrenador
- **WHEN** se actualizan datos opcionales como teléfono, edad, nacionalidad, imagen o descripción
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar estado activo/inactivo
- **WHEN** se actualiza el estado de un entrenador
- **THEN** el sistema guarda el nuevo estado

#### Scenario: Actualizar entrenador inexistente
- **WHEN** se intenta actualizar un entrenador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar entrenador

El sistema SHALL permitir eliminar un entrenador existente por su identificador.

#### Scenario: Eliminar un entrenador existente
- **WHEN** se elimina un entrenador cuyo identificador existe
- **THEN** el entrenador se elimina y ya no aparece en el listado

#### Scenario: Eliminar un entrenador inexistente
- **WHEN** se intenta eliminar un entrenador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado