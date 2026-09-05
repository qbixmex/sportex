# announcement-management Specification

## Purpose

Permite a la plataforma publicar noticias globales (anuncios) dirigidas a toda su audiencia, con alcance general, estado activo o inactivo y gestión restringida a usuarios administradores.

## Requirements

### Requirement: Crear anuncio

El sistema SHALL permitir crear un anuncio con un título, una descripción y un contenido obligatorios, con una longitud mínima de 8 caracteres para la descripción y el contenido. La imagen, cuando se envíe, SHALL usar el protocolo https. El enlace permanente SHALL ser único entre todos los anuncios y MAY ser especificado por el administrador; cuando el administrador lo especifica, el sistema SHALL normalizarlo (minúsculas, sin acentos, palabras separadas por guiones) conservando el texto elegido, con prioridad sobre el derivado del título; cuando no lo especifica, SHALL derivarlo automáticamente del título con la misma normalización. Un enlace permanente que quede vacío tras normalizarse SHALL rechazarse con un error de validación. El anuncio MAY incluir fecha de publicación e imagen como datos opcionales, y MAY existir sin ellos. El anuncio recién creado SHALL estar inactivo por defecto. El anuncio SHALL tener alcance global: no pertenece a ningún torneo, categoría ni equipo.

#### Scenario: Crear anuncio válido sin fecha ni imagen
- **WHEN** se envía una solicitud de creación con un título, una descripción y un contenido válidos y sin fecha de publicación ni imagen
- **THEN** el sistema crea el anuncio con el título, la descripción y el contenido indicados, inactivo por defecto, sin fecha de publicación y con un enlace permanente derivado del título

#### Scenario: Crear anuncio con enlace permanente normalizado
- **WHEN** se envía una solicitud de creación cuyo título contiene mayúsculas, acentos y espacios
- **THEN** el sistema genera un enlace permanente en minúsculas, sin acentos y con las palabras separadas por guiones

#### Scenario: Crear anuncio con enlace permanente personalizado
- **WHEN** se envía una solicitud de creación con un título y un enlace permanente propio que contiene mayúsculas, signos y espacios
- **THEN** el sistema normaliza el enlace permanente enviado (minúsculas, sin acentos, palabras separadas por guiones) sin sustituirlo por el derivado del título

#### Scenario: Crear anuncio con fecha de publicación e imagen
- **WHEN** se envía una solicitud de creación con título, descripción, contenido, fecha de publicación e imagen
- **THEN** el sistema crea el anuncio con todos los valores indicados

#### Scenario: Crear anuncio sin título
- **WHEN** se envía una solicitud de creación sin título
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear anuncio sin descripción
- **WHEN** se envía una solicitud de creación sin descripción
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear anuncio sin contenido
- **WHEN** se envía una solicitud de creación sin contenido
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear anuncio con imagen que no usa el protocolo https
- **WHEN** se envía una solicitud de creación con una imagen que no usa el protocolo https
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear anuncio cuyo enlace permanente coincide con otro
- **WHEN** se intenta crear un anuncio cuyo título genera un enlace permanente ya registrado por otro anuncio
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto

#### Scenario: Crear anuncio cuyo enlace permanente queda vacío al normalizarse
- **WHEN** se envía una solicitud de creación con un enlace permanente que tras normalizarse queda vacío
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Acceso restringido a administradores

El sistema SHALL permitir gestionar anuncios (crear, consultar, actualizar y eliminar) únicamente a usuarios con rol administrador. Los usuarios sin rol administrador SHALL NOT poder ejecutar estas operaciones.

#### Scenario: Usuario administrador gestiona anuncios
- **WHEN** un usuario con rol administrador solicita crear, consultar, actualizar o eliminar un anuncio
- **THEN** el sistema permite la operación

#### Scenario: Usuario sin rol administrador intenta gestionar anuncios
- **WHEN** un usuario sin rol administrador solicita crear, consultar, actualizar o eliminar un anuncio
- **THEN** el sistema rechaza la operación y devuelve un error de autorización

### Requirement: Consultar anuncios

El sistema SHALL permitir listar anuncios por páginas y obtener un anuncio individual por su identificador. El listado en ámbito público SHALL devolver únicamente anuncios activos, en el orden en que se registran. El listado en ámbito administrativo SHALL devolver todos los anuncios, activos e inactivos.

#### Scenario: Listar anuncios por páginas en ámbito público
- **WHEN** se solicita la lista de anuncios en ámbito público con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada que incluye únicamente los anuncios activos, en el orden en que se registran

#### Scenario: Listar anuncios en ámbito administrativo
- **WHEN** un administrador solicita la lista de anuncios incluyendo los inactivos
- **THEN** el sistema devuelve todos los anuncios, activos e inactivos

#### Scenario: Obtener un anuncio activo por identificador
- **WHEN** se solicita un anuncio activo cuyo identificador existe
- **THEN** el sistema devuelve todos los datos de ese anuncio

#### Scenario: Obtener un anuncio inactivo en ámbito público
- **WHEN** se solicita en ámbito público un anuncio inactivo cuyo identificador existe
- **THEN** el sistema devuelve un error de no encontrado

#### Scenario: Obtener un anuncio inexistente
- **WHEN** se solicita un anuncio cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar anuncio

El sistema SHALL permitir modificar los datos de un anuncio existente, incluyendo su título, contenido, fecha de publicación, imagen, descripción, enlace permanente y estado (activo o inactivo). Al enviar un enlace permanente propio, SHALL normalizarse y tener prioridad sobre cualquier derivación; al modificar solo el título, SHALL regenerarse desde el nuevo título; cuando no se envían ni título ni enlace permanente, SHALL conservarse el actual. El enlace permanente resultante SHALL permanecer único entre todos los anuncios; si es usado por otro anuncio o queda vacío tras normalizarse, el sistema SHALL rechazar la actualización.

#### Scenario: Actualizar título y regenerar enlace permanente
- **WHEN** se actualiza el título de un anuncio existente a un valor válido cuyo enlace permanente no usa otro anuncio
- **THEN** el sistema guarda el nuevo título y regenera el enlace permanente

#### Scenario: Actualizar y personalizar el enlace permanente
- **WHEN** se actualiza un anuncio enviando un enlace permanente propio, incluso junto a un nuevo título
- **THEN** el sistema normaliza el enlace permanente enviado, lo aplica con prioridad sobre el derivado del título y verifica que no lo use otro anuncio

#### Scenario: Actualizar contenido sin tocar el enlace permanente
- **WHEN** se actualizan únicamente el contenido, la descripción, la imagen u otros datos de un anuncio existente
- **THEN** el sistema conserva el enlace permanente actual sin regenerarlo

#### Scenario: Actualizar contenido, descripción e imagen
- **WHEN** se actualizan el contenido, la descripción o la imagen de un anuncio existente
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar título o enlace permanente que genera un enlace ya usado
- **WHEN** se intenta actualizar el título o el enlace permanente de un anuncio a un valor cuyo enlace permanente ya usa otro anuncio
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto

#### Scenario: Actualizar con un enlace permanente que queda vacío al normalizarse
- **WHEN** se intenta actualizar un anuncio con un enlace permanente que tras normalizarse queda vacío
- **THEN** el sistema rechaza la actualización y devuelve un error de validación

#### Scenario: Actualizar anuncio inexistente
- **WHEN** se intenta actualizar un anuncio cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Activar y desactivar anuncio

El sistema SHALL permitir alternar el estado de un anuncio entre activo e inactivo. Un anuncio inactivo SHALL NOT aparecer en el listado público. No existe ninguna otra forma de vigencia para un anuncio.

#### Scenario: Desactivar un anuncio activo
- **WHEN** se desactiva un anuncio que estaba activo
- **THEN** el anuncio deja de aparecer en el listado público

#### Scenario: Activar un anuncio inactivo
- **WHEN** se activa un anuncio que estaba inactivo
- **THEN** el anuncio pasa a aparecer en el listado público

### Requirement: Eliminar anuncio

El sistema SHALL permitir eliminar un anuncio existente por su identificador.

#### Scenario: Eliminar un anuncio existente
- **WHEN** se elimina un anuncio cuyo identificador existe
- **THEN** el anuncio se elimina y ya no aparece en el listado

#### Scenario: Eliminar un anuncio inexistente
- **WHEN** se intenta eliminar un anuncio cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado
