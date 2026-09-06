## Purpose

Permite a los administradores gestionar de forma interna los videos de la plataforma, controlando qué videos se registran, cuándo son visibles y qué información muestran.

## ADDED Requirements

### Requirement: Registro de videos

El sistema SHALL permitir a un administrador registrar un video indicando título, enlace del video, plataforma de origen y, opcionalmente, descripción. Al registrarse, el video SHALL quedar **inactivo** (no visible) y con fecha de publicación igual al día de su registro.

#### Scenario: Registro exitoso de un video

- **WHEN** un administrador registra un video con título, enlace del video, plataforma de origen y descripción
- **THEN** el video queda creado con fecha de publicación de hoy y estado **inactivo** (no visible)

#### Scenario: Registro sin descripción

- **WHEN** un administrador registra un video sin descripción
- **THEN** el video se crea igualmente con título, enlace del video y plataforma de origen

### Requirement: Listado de videos

El sistema SHALL permitir a un administrador obtener la lista de videos paginada y ordenada por fecha de creación, mostrando primero los más antiguos.

#### Scenario: Listado paginado de videos

- **WHEN** un administrador solicita la lista de videos
- **THEN** el sistema devuelve los videos ordenados por fecha de creación de más antiguos a los más recientes, en páginas de tamaño definido

### Requirement: Consulta de un video

El sistema SHALL permitir a un administrador consultar un video por su identificador y ver todos sus datos (título, enlace permanente, fecha de publicación, descripción, enlace del video, plataforma de origen, estado activo o inactivo, fechas de creación y de actualización).

#### Scenario: Consulta de un video existente

- **WHEN** un administrador consulta un video por su identificador
- **THEN** el sistema devuelve todos los datos del video

### Requirement: Modificación de un video

El sistema SHALL permitir a un administrador modificar los datos de un video (título, fecha de publicación, descripción, enlace del video o plataforma de origen). Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación exitosa de un video

- **WHEN** un administrador modifica el título y la plataforma de origen de un video
- **THEN** el sistema guarda y refleja de inmediato los nuevos datos

### Requirement: Control de visibilidad de un video

El sistema SHALL permitir a un administrador **activar** un video para que sea visible y **desactivarlo** para que deje de ser visible sin eliminarlo.

#### Scenario: Activación de un video

- **WHEN** un administrador activa un video inactivo
- **THEN** el video queda visible

#### Scenario: Desactivación de un video

- **WHEN** un administrador desactiva un video activo
- **THEN** el video deja de ser visible pero permanece registrado

### Requirement: Eliminación de un video

El sistema SHALL permitir a un administrador eliminar un video de forma definitiva.

#### Scenario: Eliminación de un video

- **WHEN** un administrador elimina un video
- **THEN** el video se elimina de forma definitiva y deja de existir en el sistema

### Requirement: Acceso restringido a administradores

El sistema SHALL restringir el acceso a la gestión de videos únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados.

#### Scenario: Acceso de un administrador

- **WHEN** un usuario administrador intenta acceder a la gestión de videos
- **THEN** el sistema le permite operar con los videos

#### Scenario: Acceso de un usuario no administrador

- **WHEN** un usuario que no es administrador intenta acceder a la gestión de videos
- **THEN** el sistema rechaza la solicitud