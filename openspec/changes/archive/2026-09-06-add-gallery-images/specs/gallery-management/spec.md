## ADDED Requirements

### Requirement: Registro de una imagen en una galería

El sistema SHALL permitir a un administrador registrar una imagen dentro de una galería existente indicando su **título**, la **referencia a la imagen** (ubicación e identificador público) y, de forma opcional, su **posición** (entero positivo) para el orden de visualización. La misma imagen SHALL NOT poder registrarse dos veces en la plataforma. Al registrarse, la imagen SHALL quedar **inactiva** (no disponible) y con fecha de creación igual al día de su registro.

#### Scenario: Registro exitoso de una imagen en una galería

- **WHEN** un administrador registra una imagen con su título y referencia en una galería existente
- **THEN** el sistema crea la imagen asociada a esa galería, inactiva, con fecha de creación de hoy

#### Scenario: Intento de registrar la misma imagen dos veces

- **WHEN** un administrador intenta registrar una imagen cuya referencia ya está registrada
- **THEN** el sistema rechaza la solicitud por duplicidad

#### Scenario: Registro de una imagen en una galería inexistente

- **WHEN** un administrador intenta registrar una imagen en una galería que no existe
- **THEN** el sistema rechaza la solicitud

### Requirement: Listado de imágenes de una galería

El sistema SHALL permitir a un administrador obtener la lista de imágenes de una galería específica, paginada y ordenada por posición de forma ascendente y, en caso de empate, por fecha de creación mostrando primero las más antiguas.

#### Scenario: Listado paginado de las imágenes de una galería

- **WHEN** un administrador solicita la lista de imágenes de una galería
- **THEN** el sistema devuelve las imágenes de esa galería ordenadas por posición ascendente y, en empate, por fecha de creación de más antiguas a más recientes, en páginas de tamaño definido

### Requirement: Consulta de una imagen

El sistema SHALL permitir a un administrador consultar una imagen por su identificador y ver todos sus datos (título, referencia a la imagen, posición, estado activo o inactivo, fechas de creación y de actualización) **sin incluir la galería a la que pertenece**.

#### Scenario: Consulta de una imagen existente

- **WHEN** un administrador consulta una imagen por su identificador
- **THEN** el sistema devuelve todos los datos de la imagen sin incluir la galería

### Requirement: Modificación de una imagen

El sistema SHALL permitir a un administrador modificar el **título** y la **referencia a la imagen** de una imagen existente. La referencia SHALL mantenerse única en la plataforma. Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación de una imagen

- **WHEN** un administrador modifica el título o la referencia de una imagen
- **THEN** el sistema guarda los cambios y los refleja de inmediato

#### Scenario: Modificación que duplica la referencia de otra imagen

- **WHEN** un administrador modifica una imagen dejando la referencia de otra imagen ya registrada
- **THEN** el sistema rechaza la solicitud por duplicidad

### Requirement: Control de disponibilidad de una imagen

El sistema SHALL permitir a un administrador **activar** una imagen para que esté disponible y **desactivarla** para que deje de estar disponible sin eliminarla.

#### Scenario: Activación de una imagen

- **WHEN** un administrador activa una imagen inactiva
- **THEN** la imagen queda disponible

#### Scenario: Desactivación de una imagen

- **WHEN** un administrador desactiva una imagen activa
- **THEN** la imagen deja de estar disponible pero permanece registrada

### Requirement: Eliminación de una imagen

El sistema SHALL permitir a un administrador eliminar una imagen de una galería de forma definitiva. La eliminación SHALL confirmarse únicamente con un mensaje, sin devolver la imagen eliminada.

#### Scenario: Eliminación de una imagen

- **WHEN** un administrador elimina una imagen existente
- **THEN** la imagen se elimina de forma definitiva y deja de existir en el sistema, y el sistema responde un mensaje de confirmación

### Requirement: Acceso restringido a administradores de la gestión de imágenes

El sistema SHALL restringir el acceso a la gestión de imágenes de galería únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados.

#### Scenario: Acceso de un administrador

- **WHEN** un usuario administrador intenta acceder a la gestión de imágenes de galería
- **THEN** el sistema le permite operar con las imágenes

#### Scenario: Acceso de un usuario no administrador

- **WHEN** un usuario que no es administrador intenta acceder a la gestión de imágenes de galería
- **THEN** el sistema rechaza la solicitud

## MODIFIED Requirements

### Requirement: Eliminación de una galería

El sistema SHALL permitir a un administrador eliminar una galería de forma definitiva. Al eliminar la galería, el sistema SHALL eliminar también, de forma definitiva, todas las imágenes asociadas a esa galería. La eliminación SHALL confirmarse únicamente con un mensaje.

#### Scenario: Eliminación de una galería

- **WHEN** un administrador elimina una galería
- **THEN** la galería se elimina de forma definitiva y deja de existir en el sistema, y el sistema responde un mensaje de confirmación

#### Scenario: Eliminación de una galería con imágenes

- **WHEN** un administrador elimina una galería que tiene imágenes
- **THEN** la galería se elimina de forma definitiva y todas sus imágenes se eliminan con ella, y el sistema responde un mensaje de confirmación