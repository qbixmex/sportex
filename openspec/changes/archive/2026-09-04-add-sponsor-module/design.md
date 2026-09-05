## Context

El módulo `sponsors` es un nuevo dominio bajo `src/modules/` que seguirá el patrón establecido por `players` y `coaches`. La entidad `Sponsor` tendrá campos simples sin relaciones N:N en este cambio. La API estará protegida con `@Auth(VALID_ROLES.ADMIN)` en todos los endpoints.

## Goals / Non-Goals

**Goals:**
- Entidad y módulo `Sponsor` con CRUD completo siguiendo el patrón de `players`.
- Modelo de base de datos con tabla `sponsors` y restricción UNIQUE en `name`.
- Exponer la API bajo `/api/v1/sponsors...` protegida con `@Auth(VALID_ROLES.ADMIN)`.
- Generar migración TypeORM para la tabla `sponsors`.

**Non-Goals:**
- No establecer relaciones N:N con torneos o equipos en este cambio.
- No cambiar el modelo de autenticación ni el de usuarios.
- No gestionar la lógica de membresía o campañas de patrocinio.

## Decisions

### D1. Entity `Sponsor` con campos simples
Se modela `Sponsor` con `@Entity({ name: 'sponsors' })` y campos `@Column` simples sin relaciones. El campo `name` lleva `@Column({ unique: true, length: 255 })` para restricción de unicidad a nivel de entidad y migración.

- **Alternativa considerada**: Crear entidad con UUID como primary key text. Se descarta porque el proyecto usa uuid para IDs pero este sponsor usará text por requisitos de negocio específicos.

### D2. DTO de `Sponsor` con decoradores de validación
El `CreateSponsorDto` expone `name` requerido con `@IsNotEmpty`, `@IsString`, `@MinLength(3)`; `url`, `imageUrl`, `imagePublicId`, `startDate`, `endDate` opcionales con `@IsString`; `position` y `clicks` opcionales con `@IsNumber` y `@Min(0)`; `active` opcional con `@IsBoolean`.

- **Racional**: replicar el patrón de validación de `CreatePlayerDto` (class-validator) y asegurar `name` único y valores numéricos no negativos.

### D3. Endpoints y versionado
Controlador `SponsorsController` con ruta base `sponsors` bajo el prefijo global `api` y versionado URI `@Version('1')` → `/api/v1/sponsors`. Endpoints: `POST /`, `GET /` (paginado), `GET /:id`, `PATCH /:id`, `DELETE /:id`, protegidos con `@Auth(VALID_ROLES.ADMIN)`.

- **Racional**: replicar el patrón de `players` (paginación con `PaginationDto`, ParseUUIDPipe en `:id`, respuestas con `message`/`data` y paginación), pero con protección de admin.

### D4. Migración TypeORM
Migración que: crea la tabla `sponsors` con columnas `id` (uuid text), `name` (varchar, unique), `url`, `imageUrl`, `imagePublicId`, `start_date`, `end_date`, `position` (int, default 0), `clicks` (int, default 0), `active` (boolean, default false), `createdAt`, `updatedAt`.

- **Racional**: tabla sencilla sin relaciones complejas, consistente con el alcance del cambio.

## Risks / Trade-offs

- [Nombre de sponsor no único a nivel de aplicación] → Mitigación: restricción UNIQUE en base de datos + validación en servicio con `ConflictException`.
- [Campo position o clicks negativos] → Mitigación: validación `@Min(0)` en DTO + validación en servicio.
- [Validar startDate <= endDate cuándo ambos están presentes] → Mitigación: validación en servicio si ambos fields se proveen.

## Migration Plan

- Generar y aplicar una única migración (`add-sponsor-module`) que cree la tabla `sponsors`.
- Rollback: `bun run migration:revert` revierte la migración (tabla `sponsors`).

## Open Questions

- Ninguna por ahora: la modelación de entidad simple, el manejo de campos opcionales y la validación de unicidad del nombre quedan resueltos y no dependen de decisiones posteriores.