## Purpose

Permite gestionar patrocinadores (sponsors) dentro de la plataforma: crear, consultar, actualizar y eliminar sponsors, con nombre único y campos opcionales, restringido únicamente a usuarios con rol administrador.

## ADDED Requirements

### Requirement: Crear sponsor

El sistema SHALL permitir crear un sponsor con un nombre único. El nombre SHALL no repetirse en el sistema. El sponsor MAY incluir url, imageUrl, imagePublicId, startDate, endDate, position (por defecto 0), clicks (por defecto 0) y active (por defecto false) como campos opcionales, y MAY existir sin ellos.

#### Scenario: Crear sponsor válido
- **WHEN** se envía una solicitud de creación con un nombre válido y sin campos opcionales
- **THEN** el sistema crea el sponsor con el nombre indicado, position en 0, clicks en 0 y active en false por defecto

#### Scenario: Crear sponsor con nombre duplicado
- **WHEN** se intenta crear un sponsor cuyo nombre ya está registrado en otro sponsor
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto

#### Scenario: Crear sponsor con campos opcionales
- **WHEN** se envía una solicitud de creación con nombre, url, imageUrl, imagePublicId, startDate, endDate, position, clicks y active
- **THEN** el sistema crea el sponsor con todos los valores indicados

#### Scenario: Crear sponsor sin nombre
- **WHEN** se envía una solicitud de creación sin nombre
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Acceso restringido a administradores

El sistema SHALL permitir gestionar sponsors (crear, consultar, actualizar y eliminar) únicamente a usuarios con rol administrador. Los usuarios sin rol administrador SHALL NOT poder ejecutar estas operaciones.

#### Scenario: Usuario administrador gestiona sponsors
- **WHEN** un usuario con rol administrador solicita crear, consultar, actualizar o eliminar un sponsor
- **THEN** el sistema permite la operación

#### Scenario: Usuario sin rol administrador intenta gestionar sponsors
- **WHEN** un usuario sin rol administrador solicita crear, consultar, actualizar o eliminar un sponsor
- **THEN** el sistema rechaza la operación y devuelve un error de autorización

### Requirement: Consultar sponsors

El sistema SHALL permitir listar sponsors con paginación y obtener un sponsor individual por su id. El listado SHALL devolver los sponsors en páginas y el detalle SHALL incluir todos los datos del sponsor.

#### Scenario: Listar sponsors paginado
- **WHEN** se solicita la lista de sponsors con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de sponsors

#### Scenario: Obtener un sponsor por id
- **WHEN** se solicita un sponsor cuyo id existe
- **THEN** el sistema devuelve todos los datos de ese sponsor

#### Scenario: Obtener un sponsor inexistente
- **WHEN** se solicita un sponsor cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar sponsor

El sistema SHALL permitir modificar los datos de un sponsor existente, incluyendo su nombre, url, imageUrl, imagePublicId, startDate, endDate, position, clicks y active. El nombre SHALL permanecer único entre todos los sponsors.

#### Scenario: Actualizar nombre a un valor no usado
- **WHEN** se actualiza el nombre de un sponsor existente a un valor válido y no usado por otro sponsor
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar nombre a un valor ya usado
- **WHEN** se intenta actualizar el nombre de un sponsor a un nombre ya registrado por otro sponsor
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto

#### Scenario: Actualizar campos opcionales de un sponsor
- **WHEN** se actualizan campos opcionales como url, imageUrl, imagePublicId, startDate, endDate, position, clicks o active
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar position y clicks de un sponsor
- **WHEN** se actualiza position o clicks de un sponsor existente
- **THEN** el sistema guarda los nuevos valores numéricos

#### Scenario: Actualizar sponsor inexistente
- **WHEN** se intenta actualizar un sponsor cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar sponsor

El sistema SHALL permitir eliminar un sponsor existente por su id.

#### Scenario: Eliminar un sponsor existente
- **WHEN** se elimina un sponsor cuyo id existe
- **THEN** el sponsor se elimina y ya no aparece en el listado

#### Scenario: Eliminar un sponsor inexistente
- **WHEN** se intenta eliminar un sponsor cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado