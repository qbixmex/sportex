## Why

La plataforma no cuenta con un lugar centralizado para administrar videos (partidos, resúmenes o material promocional), por lo que ese contenido no puede gestionarse desde el sistema. Se necesita un módulo interno que permita a los administradores registrar y controlar estos videos.

## What Changes

- Se incorpora un módulo de **videos** de uso interno, accesible solo por administradores.
- Los administradores pueden **registrar**, **listar**, **consultar**, **modificar** y **eliminar** videos.
- Al registrarse, un video queda **inactivo** (no visible); un administrador debe **activarlo** para que sea visible, y puede **desactivarlo** sin eliminarlo.
- Cada video tiene una **fecha de publicación** que se asigna automáticamente el día de su registro.
- Cada video indica su **plataforma de origen** (texto libre, por ejemplo YouTube, Vimeo, Google Drive).
- Los videos son **independientes**: no se asocian obligatoriamente a ninguna otra entidad del negocio.
- La **eliminación** de un video es definitiva.

## Capabilities

### New Capabilities

- `videos`: Gestión interna de videos por parte de administradores, incluyendo el registro, el control de visibilidad (activo/inactivo), la consulta, la modificación y la eliminación.

### Modified Capabilities

- Ninguna.

## Impact

- Se agrega una nueva unidad de gestión dentro de la plataforma, restringida al rol administrador.
- No se modifican las capacidades existentes de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores ni anuncios.