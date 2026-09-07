## Why

La plataforma no cuenta con un lugar para gestionar galerías (álbumes con los que se organiza y muestra contenido), por lo que no existe una forma interna de definir, publicar u ocultar estos contenedores desde el sistema. Se necesita un módulo interno que permita a los administradores registrar y controlar las galerías.

## What Changes

- Se incorpora un módulo de **galerías** de uso interno, accesible solo por administradores.
- Las galerías se definen por su **título** y un **enlace permanente** que se genera automáticamente a partir del título, es único y no se pide al registrarla.
- Cada galería tiene un **estado activo/inactivo**: al registrarse queda **inactiva** (no disponible); un administrador debe **activarla** y puede **desactivarla** sin eliminarla.
- Cada galería registra su **fecha de creación** y su **fecha de última actualización**.
- Los administradores pueden **registrar**, **listar**, **consultar**, **modificar** y **eliminar** galerías.
- La **eliminación** de una galería es definitiva.
- Las galerías son **independientes**: en esta etapa solo se modelan los datos de la galería en sí; el contenido (imágenes/medios) que la compone se definirá en una etapa futura.

## Capabilities

### New Capabilities

- `gallery-management`: Gestión interna de galerías por parte de administradores, incluyendo el registro, el control de visibilidad (activo/inactivo), la consulta, la modificación y la eliminación.

### Modified Capabilities

- Ninguna.

## Impact

- Se agrega una nueva unidad de gestión dentro de la plataforma, restringida al rol administrador.
- No se modifican las capacidades existentes de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores ni anuncios.
- No se altera la información pública actual; el contenido de las galerías queda fuera del alcance de este cambio.