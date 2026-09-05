## Why

La plataforma deportiva necesita un módulo para gestionar patrocinadores (sponsors), esencial para la sostenibilidad organizacional y el financiamiento deportivo. Este módulo permitirá administrar la información de los patrocinadores y sus propiedades clave dentro de la plataforma.

## What Changes

- Crear un módulo de gestión de sponsors con operaciones de crear, listar, consultar individual, actualizar y eliminar.
- Definir la entidad de negocio Sponsor con los campos: `id`, `name` (único, requerido), `url` (opcional), `imageUrl` (opcional), `imagePublicId` (opcional), `startDate` (opcional), `endDate` (opcional), `position` (number, por defecto 0), `clicks` (number, por defecto 0), `active` (boolean, por defecto false), `createdAt` y `updatedAt`.
- No se establecen relaciones con otros dominios (torneos, equipos) en este cambio.
- Establecer que únicamente los usuarios con rol administrador pueden gestionar sponsors.
- Exponer los endpoints de la API correspondientes a la gestión de sponsors.
- Añadir la tabla de base de datos correspondiente mediante una migración.

## Capabilities

### New Capabilities

- `sponsor-management`: Gestión de patrocinadores: crear, consultar (listado paginado y por id), actualizar y eliminar sponsors, con nombre único y campos opcionales, restringido a administradores y sin relaciones con otros dominios.

### Modified Capabilities

- (Ninguno - no se modifican capacidades existentes)

## Impact

- **Aplicación**: nuevo módulo de sponsors con su entidad, DTOs, servicio y controlador.
- **API**: nuevos endpoints de gestión de sponsors, accesibles únicamente por usuarios administradores.
- **Base de datos**: nueva tabla de sponsors con restricción de unicidad sobre el nombre, mediante migración.
- **Configuración**: registro del nuevo módulo en la aplicación.