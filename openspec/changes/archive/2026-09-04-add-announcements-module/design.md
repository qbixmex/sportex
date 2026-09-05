## Context

El módulo `announcements` es un dominio nuevo bajo `src/modules/` que seguirá el patrón del dominio `sponsors` (el módulo standalone más reciente): entidad simple sin relaciones, DTOs con class-validator, servicio con `CommonService.handleExceptions` y controlador protegido con `@Auth(VALID_ROLES.ADMIN)`. La generación del enlace permanente adoptará el comportamiento de `Tournament.formatPermalink` (normalización: minúsculas, sin acentos, espacios a guiones). Ver proposal.md - Why para la motivación.

## Goals / Non-Goals

**Goals:**
- Módulo `Announcement` con CRUD completo siguiendo el patrón de `sponsors`.
- Modelo de datos con tabla `announcements` y restricción UNIQUE sobre `permalink`.
- API `/api/v1/announcements` protegida con `@Auth(VALID_ROLES.ADMIN)`.
- Listado con paginación y filtro por estado (activo/inactivo), conservando el orden natural en que se registran.
- Migración TypeORM para la tabla `announcements`.

**Non-Goals:**
- No establecer relaciones con torneos, categorías o equipos (alcance global confirmado en la especificación).
- No implementar vigencia ni caducidad temporal (`publishedAt` es informativo; el único control de visibilidad es `active`).
- No construir un feed/endpoint público autenticado; la lectura pública se cubre filtrando `active` en el listado.
- No gestionar autores auditables ni edición colaborativa (solo el rol administrador gestiona).

## Decisions

### D1. Entidad standalone `Announcement` con UUID

Se modela `Announcement` con `@Entity({ name: 'announcements' })`, `@PrimaryGeneratedColumn('uuid')` y columnas simples sin relaciones:
`id`, `title` (varchar, requerido), `permalink` (varchar, único), `publishedAt` (timestamptz, nullable), `imageUrl` (varchar, nullable), `imagePublicId` (varchar, nullable), `description` (text, nullable), `content` (text, requerido), `active` (boolean, default false), y las columnas de auditoría `createdAt` y `updatedAt` (nombres snake_case `published_at`, `created_at`/`updated_at` como el resto de entidades).

- **Racional**: el alcance global confirmado en la especificación no necesita claves foráneas; se replica el patrón de `Sponsor`.
- **Alternativa considerada**: `ManyToOne` hacia torneos para noticias por evento. Se descarta: contradice la regla de negocio de alcance general.

### D2. Enlace permanente derivado del título o personalizado, único

El `permalink` se normaliza siempre con `Tournament.formatPermalink` (minúsculas, `NFD` para quitar acentos, espacios y símbolos a guiones, sin guiones iniciales/finales). Cuando el administrador envía `permalink`, ese valor (normalizado) tiene prioridad sobre la derivación del título; cuando no lo envía, se deriva del `title`. La resolución ocurre en el servicio (`create` y `update`) y los hooks `@BeforeInsert`/`@BeforeUpdate` reutilizan la regla `permalink ?? title` como red de seguridad idempotente. En `update`: si llega `permalink`, se usa; si llega solo `title`, se regenera desde él; si no llega ninguno de los dos, el permalink no cambia. Un permalink que quede vacío tras normalizar (`!!`, `" "`…) lanza `BadRequestException`. La unicidad se valida en el servicio (`ConflictException`): en `create` contra cualquier anuncio y en `update` excluyendo el propio anuncio (regenerar el mismo valor o no tocar el permalink no es conflicto); la restricción UNIQUE de la BD queda como respaldo.

- **Racional**: consistencia con torneos y equipos, que derivan su permalink del nombre, y a la vez permite al administrador afinar la URL legible (SEO) sin romper la normalización. `@Column({ unique: true })` + validación en el servicio para errores de colisión controlados (`ConflictException`).
- **Alternativa considerada**: permalink inmutable tras la publicación (mejor para SEO y enlaces externos). Se descarta en este cambio por consistencia con la plataforma; ver trade-off en Risks.

### D3. DTOs con class-validator

`CreateAnnouncementDto`: `title` requerido (`@IsString`, `@IsNotEmpty`, `@MinLength(3)`), `description` requerida (`@IsString`, `@IsNotEmpty`, `@MinLength(8)`), `content` requerido (`@IsString`, `@IsNotEmpty`, `@MinLength(8)`), `permalink` opcional (`@IsString`, `@MinLength(3)`, `@IsOptional`; el valor crudo se normaliza en el servicio), `publishedAt` opcional (`@IsDateString` o `@IsISO8601`), `imageUrl` opcional (`@IsUrl` restringido al protocolo `https`), `imagePublicId` opcional (`@IsString`, `@MinLength(4)`, `@IsOptional`), `active` opcional (`@IsBoolean`). `UpdateAnnouncementDto` extiende `PartialType(CreateAnnouncementDto)` (así `description` solo es obligatoria al crear; al actualizar se conserva el valor existente) y se re-exporta junto al de creación en `dto/index.ts`.

- **Racional**: mismo patrón de validación que `CreateSponsorDto`/`CreatePlayerDto`.

### D4. Servicio con operaciones CRUD y reglas de negocio

- `create`: resuelve el permalink (personalizado si llega `permalink`, si no derivado del `title`), lo normaliza, rechaza con `BadRequestException` si queda vacío, valida unicidad (`ConflictException`) y guarda con `active` por defecto false (apoyándose en `CommonService.handleExceptions` para el resto de errores).
- `findAll(paginationDto, active?)`: paginado con `count` + `find`, sin ordenamiento explícito (se conserva el orden natural de la base de datos, según lo solicitado por el cliente), aplicando el filtro de estado cuando se pide el listado público (solo activas) o sin filtrar cuando el administrador solicita todas.
- `findById`: `NotFoundException` si no existe; en ámbito público, los anuncios inactivos se tratan como no encontrados.
- `update`: si llega `permalink` (o solo `title`), resuelve y normaliza el nuevo permalink con las mismas reglas que `create`; valida unicidad en el servicio excluyendo el propio anuncio; si no llega ni `permalink` ni `title`, el permalink se conserva; `remove` con `NotFoundException`.
- **Racional**: replica `SponsorsService` más la lógica de filtrado por estado.

### D5. Controlador y versionado

`AnnouncementsController` con ruta base `announcements` bajo el prefijo global `api` y `@Version('1')` → `/api/v1/announcements`, protegido con `@Auth(VALID_ROLES.ADMIN)`. Endpoints: `POST /` (crear), `GET /` (listado paginado), `GET /:id`, `PATCH /:id`, `DELETE /:id`, con `ParseUUIDPipe` en los `:id`.

- **Racional**: mismo patrón y protección que `SponsorsController`. El listado `GET /` devuelve todos los anuncios, activos e inactivos, sin filtro de estado; el filtrado por estado queda disponible en el servicio (`findAll(paginationDto, active?)`) para el futuro ámbito público (feed de noticias activas).

### D6. Migración TypeORM

Migración generada con `bun run migration:generate --name=create_announcements_table` (data source en `src/database/data-source.ts`) que cree la tabla `announcements` con las columnas indicadas en D1 y la restricción UNIQUE sobre `permalink`. Se revisa el SQL generado antes de aplicarla con `bun run migration:run`.

- **Racional**: `synchronize: false` en el proyecto; toda creación de esquema pasa por migraciones versionadas.

## Risks / Trade-offs

- [Colisión de `permalink` al crear, al personalizarlo o al cambiar el título] → Mitigación: validación de unicidad en el servicio (`ConflictException`, excluyendo el propio anuncio en `update`) + restricción UNIQUE en la base de datos como respaldo.
- [Regenerar el permalink al cambiar el título rompe enlaces externos ya publicados] → Trade-off asumido por consistencia con torneos/equipos; la plataforma aún no expone URLs públicas en producción. Si en el futuro importa el SEO, se migrará a permalink inmutable.
- [`publishedAt` nulo en anuncios sin fecha de publicación] → Decisión: el listado no aplica ordenamiento explícito y conserva el orden natural de la base de datos; `publishedAt` es un dato informativo y su nulidad no altera la posición en el listado.

## Migration Plan

- Generar y aplicar una única migración (`create_announcements_table`) que cree la tabla `announcements`.
- Rollback: `bun run migration:revert` revierte la migración (se elimina la tabla `announcements`).

## Open Questions

- Ninguna por ahora: alcance global, estados, campos, unicidad de permalink y filtrado por rol quedan definidos en la especificación; la exposición pública como feed es un trabajo futuro ajeno a este cambio.