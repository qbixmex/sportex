## Why

Las galerías se registran actualmente como contenedores vacíos: no existe forma de asociarles las imágenes que constituyen su contenido. Se necesita que los administradores puedan poblar cada galería con imágenes para que la galería tenga contenido real.

## What Changes

- Se incorporan las **imágenes de galería** como el contenido de las galerías.
- Cada imagen de galería se define por su **título** y por la **imagen** que muestra (referencia a su ubicación y a su identificador público).
- Cada imagen de galería **pertenece obligatoriamente a una galería**, y la galería es la única capaz de agrupar esa imagen.
- Cada imagen de galería tiene un **estado activo/inactivo** (disponible o no) y registra su **fecha de creación** y su **fecha de última actualización**.
- Cada imagen de galería puede indicar una **posición** (entero positivo, opcional) para controlar el **orden de visualización** en el listado, que se muestra de forma ascendente.
- Un administrador puede **registrar**, **listar**, **consultar**, **modificar** y **eliminar** imágenes dentro de una galería.
- El **listado** de imágenes se hace dentro de una galería concreta.
- Cuando se **elimina una galería**, se eliminan de forma definitiva todas sus imágenes.
- La **misma imagen** no se puede registrar dos veces en la plataforma.
- La gestión de imágenes de galería queda restringida a **administradores**, al igual que las galerías.
- Las respuestas de imágenes de galería muestran únicamente los datos de la imagen, **sin incluir la galería** a la que pertenece; las eliminaciones (de imágenes y de galerías) devuelven solo un **mensaje de confirmación**.
- No se maneja la subida del archivo de la imagen: el administrador registra la referencia a una imagen ya almacenada por fuera.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `gallery-management`: Se amplía la gestión de galerías para incluir el contenido (imágenes) de cada galería: registro, listado por galería, consulta, modificación, eliminación y control de disponibilidad de las imágenes, manteniendo la restricción de acceso a administradores.

## Impact

- Se agrega el contenido (imágenes) dentro de la gestión de galerías existente, sin crear una capacidad pública nueva.
- La eliminación de una galería pasa a borrar también sus imágenes.
- No se modifican las capacidades de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores, anuncios ni videos.
- Se mantiene la regla vigente de que toda la gestión de galerías es exclusiva de administradores.