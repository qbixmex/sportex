## Purpose

Permite gestionar jugadores individuales dentro de la plataforma: registrar, consultar, modificar y eliminar jugadores, y asociarlos opcionalmente a un equipo existente.

## ADDED Requirements

### Requirement: Crear jugador

El sistema SHALL permitir crear un jugador con un nombre. El jugador MAY estar asociado a un equipo existente y MAY existir sin él. El jugador MAY tener correo electrónico, teléfono, fecha de nacimiento, nacionalidad, imagen y estado activo/inactivo, siendo inactivo por defecto.

#### Scenario: Crear jugador válido sin equipo
- **WHEN** se envía una solicitud de creación con un nombre válido y sin equipo
- **THEN** se crea el jugador con el nombre indicado, sin equipo asociado y en estado inactivo por defecto

#### Scenario: Crear jugador válido con equipo
- **WHEN** se envía una solicitud de creación con un nombre válido y un equipo existente
- **THEN** se crea el jugador asociado a dicho equipo

#### Scenario: Crear jugador con datos opcionales
- **WHEN** se envía una solicitud de creación con nombre, correo electrónico, teléfono, fecha de nacimiento, nacionalidad e imagen
- **THEN** se crea el jugador con todos los datos opcionales guardados

#### Scenario: Crear jugador con equipo inexistente
- **WHEN** se intenta crear un jugador cuyo equipo no existe
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear jugador sin nombre
- **WHEN** se envía una solicitud de creación sin nombre
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar jugadores

El sistema SHALL permitir listar jugadores con paginación y obtener un jugador individual por su identificador.

#### Scenario: Listar jugadores paginado
- **WHEN** se solicita la lista de jugadores con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de jugadores

#### Scenario: Obtener un jugador por identificador
- **WHEN** se solicita un jugador cuyo identificador existe
- **THEN** el sistema devuelve los datos de ese jugador, incluyendo su equipo asociado si lo tiene

#### Scenario: Obtener un jugador inexistente
- **WHEN** se solicita un jugador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar jugador

El sistema SHALL permitir modificar los datos de un jugador existente, incluyendo su nombre, su equipo y el resto de sus datos opcionales. La asociación con un equipo MAY asignarse o quitarse.

#### Scenario: Actualizar nombre de un jugador
- **WHEN** se actualiza el nombre de un jugador existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Asignar equipo a un jugador
- **WHEN** se asigna a un jugador un equipo existente
- **THEN** el jugador queda asociado a ese equipo

#### Scenario: Quitar equipo de un jugador
- **WHEN** se quita el equipo de un jugador
- **THEN** el jugador deja de estar asociado a ningún equipo

#### Scenario: Actualizar datos opcionales de un jugador
- **WHEN** se actualizan datos opcionales como correo electrónico, teléfono, fecha de nacimiento, nacionalidad o imagen
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar estado activo/inactivo
- **WHEN** se actualiza el estado de un jugador
- **THEN** el sistema guarda el nuevo estado

#### Scenario: Actualizar jugador inexistente
- **WHEN** se intenta actualizar un jugador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar jugador

El sistema SHALL permitir eliminar un jugador existente por su identificador.

#### Scenario: Eliminar un jugador existente
- **WHEN** se elimina un jugador cuyo identificador existe
- **THEN** el jugador se elimina y ya no aparece en el listado

#### Scenario: Eliminar un jugador inexistente
- **WHEN** se intenta eliminar un jugador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado