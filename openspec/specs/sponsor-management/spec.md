# sponsor-management Specification

## Purpose

Permite gestionar patrocinadores dentro de la plataforma: registrar, consultar, modificar y eliminar patrocinadores, con nombre único y datos opcionales, restringido únicamente a usuarios con rol administrador.

## Requirements

### Requirement: Crear patrocinador

El sistema SHALL permitir crear un patrocinador con un nombre único. El nombre SHALL no repetirse en el sistema. El patrocinador MAY incluir enlace web, imagen, fecha de inicio, fecha de fin, posición (por defecto 0), cantidad de clics (por defecto 0) y estado activo/inactivo (inactivo por defecto) como datos opcionales, y MAY existir sin ellos.

#### Scenario: Crear patrocinador válido
- **WHEN** se envía una solicitud de creación con un nombre válido y sin datos opcionales
- **THEN** el sistema crea el patrocinador con el nombre indicado, posición en 0, cantidad de clics en 0 e inactivo por defecto

#### Scenario: Crear patrocinador con nombre duplicado
- **WHEN** se intenta crear un patrocinador cuyo nombre ya está registrado en otro patrocinador
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto

#### Scenario: Crear patrocinador con datos opcionales
- **WHEN** se envía una solicitud de creación con nombre, enlace web, imagen, fecha de inicio, fecha de fin, posición, cantidad de clics y estado activo/inactivo
- **THEN** el sistema crea el patrocinador con todos los valores indicados

#### Scenario: Crear patrocinador sin nombre
- **WHEN** se envía una solicitud de creación sin nombre
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Acceso restringido a administradores

El sistema SHALL permitir gestionar patrocinadores (crear, consultar, actualizar y eliminar) únicamente a usuarios con rol administrador. Los usuarios sin rol administrador SHALL NOT poder ejecutar estas operaciones.

#### Scenario: Usuario administrador gestiona patrocinadores
- **WHEN** un usuario con rol administrador solicita crear, consultar, actualizar o eliminar un patrocinador
- **THEN** el sistema permite la operación

#### Scenario: Usuario sin rol administrador intenta gestionar patrocinadores
- **WHEN** un usuario sin rol administrador solicita crear, consultar, actualizar o eliminar un patrocinador
- **THEN** el sistema rechaza la operación y devuelve un error de autorización

### Requirement: Consultar patrocinadores

El sistema SHALL permitir listar patrocinadores con paginación y obtener un patrocinador individual por su identificador. El listado SHALL devolver los patrocinadores por páginas y el detalle SHALL incluir todos los datos del patrocinador.

#### Scenario: Listar patrocinadores paginado
- **WHEN** se solicita la lista de patrocinadores con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de patrocinadores

#### Scenario: Obtener un patrocinador por identificador
- **WHEN** se solicita un patrocinador cuyo identificador existe
- **THEN** el sistema devuelve todos los datos de ese patrocinador

#### Scenario: Obtener un patrocinador inexistente
- **WHEN** se solicita un patrocinador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar patrocinador

El sistema SHALL permitir modificar los datos de un patrocinador existente, incluyendo su nombre, enlace web, imagen, fecha de inicio, fecha de fin, posición, cantidad de clics y estado activo/inactivo. El nombre SHALL permanecer único entre todos los patrocinadores.

#### Scenario: Actualizar nombre a un valor no usado
- **WHEN** se actualiza el nombre de un patrocinador existente a un valor válido y no usado por otro patrocinador
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Actualizar nombre a un valor ya usado
- **WHEN** se intenta actualizar el nombre de un patrocinador a un nombre ya registrado por otro patrocinador
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto

#### Scenario: Actualizar datos opcionales de un patrocinador
- **WHEN** se actualizan datos opcionales como enlace web, imagen, fecha de inicio, fecha de fin, posición, cantidad de clics o estado activo/inactivo
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar posición y cantidad de clics de un patrocinador
- **WHEN** se actualiza la posición o la cantidad de clics de un patrocinador existente
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar patrocinador inexistente
- **WHEN** se intenta actualizar un patrocinador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar patrocinador

El sistema SHALL permitir eliminar un patrocinador existente por su identificador.

#### Scenario: Eliminar un patrocinador existente
- **WHEN** se elimina un patrocinador cuyo identificador existe
- **THEN** el patrocinador se elimina y ya no aparece en el listado

#### Scenario: Eliminar un patrocinador inexistente
- **WHEN** se intenta eliminar un patrocinador cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado