# gallery-management Specification

## Purpose

Permite a los administradores gestionar de forma interna las galerías de la plataforma, controlando qué galerías se registran, cuándo están disponibles y qué información muestran.

## Requirements

### Requirement: Registro de galerías

El sistema SHALL permitir a un administrador registrar una galería indicando únicamente su **título**. El sistema SHALL generar automáticamente un **enlace permanente** a partir del título, único para cada galería. Al registrarse, la galería SHALL quedar **inactiva** (no disponible) y con fecha de creación igual al día de su registro.

#### Scenario: Registro exitoso de una galería

- **WHEN** un administrador registra una galería con su título
- **THEN** el sistema crea la galería con un enlace permanente único generado automáticamente, estado **inactivo** (no disponible) y fecha de creación de hoy

### Requirement: Listado de galerías

El sistema SHALL permitir a un administrador obtener la lista de galerías paginada y ordenada por fecha de creación, mostrando primero las más antiguas.

#### Scenario: Listado paginado de galerías

- **WHEN** un administrador solicita la lista de galerías
- **THEN** el sistema devuelve las galerías ordenadas por fecha de creación de más antiguas a las más recientes, en páginas de tamaño definido

### Requirement: Consulta de una galería

El sistema SHALL permitir a un administrador consultar una galería por su identificador y ver todos sus datos (título, enlace permanente, estado activo o inactivo, fechas de creación y de actualización).

#### Scenario: Consulta de una galería existente

- **WHEN** un administrador consulta una galería por su identificador
- **THEN** el sistema devuelve todos los datos de la galería

### Requirement: Modificación de una galería

El sistema SHALL permitir a un administrador modificar el **título** de una galería. El enlace permanente SHALL regenerarse automáticamente cuando cambie el título y mantenerse único. Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación del título de una galería

- **WHEN** un administrador modifica el título de una galería
- **THEN** el sistema guarda el nuevo título, actualiza el enlace permanente y refleja de inmediato los cambios

### Requirement: Control de disponibilidad de una galería

El sistema SHALL permitir a un administrador **activar** una galería para que esté disponible y **desactivarla** para que deje de estar disponible sin eliminarla.

#### Scenario: Activación de una galería

- **WHEN** un administrador activa una galería inactiva
- **THEN** la galería queda disponible

#### Scenario: Desactivación de una galería

- **WHEN** un administrador desactiva una galería activa
- **THEN** la galería deja de estar disponible pero permanece registrada

### Requirement: Eliminación de una galería

El sistema SHALL permitir a un administrador eliminar una galería de forma definitiva.

#### Scenario: Eliminación de una galería

- **WHEN** un administrador elimina una galería
- **THEN** la galería se elimina de forma definitiva y deja de existir en el sistema

### Requirement: Acceso restringido a administradores

El sistema SHALL restringir el acceso a la gestión de galerías únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados.

#### Scenario: Acceso de un administrador

- **WHEN** un usuario administrador intenta acceder a la gestión de galerías
- **THEN** el sistema le permite operar con las galerías

#### Scenario: Acceso de un usuario no administrador

- **WHEN** un usuario que no es administrador intenta acceder a la gestión de galerías
- **THEN** el sistema rechaza la solicitud