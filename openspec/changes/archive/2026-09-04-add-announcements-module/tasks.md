## 1. Entidad y configuración

- [x] 1.1 Crear `src/modules/announcements/entities/announcement.entity.ts` con `@Entity({ name: 'announcements' })` y campos `id` (uuid primary generated), `title` (varchar, requerido), `permalink` (varchar, unique), `publishedAt` (timestamptz, opcional), `imageUrl` (varchar, opcional), `imagePublicId` (varchar, opcional), `description` (text, opcional), `content` (text, requerido), `active` (boolean, default false), `createdAt` y `updatedAt`; añadir hooks `@BeforeInsert`/`@BeforeUpdate` que deriven el `permalink` del título con normalización (minúsculas, sin acentos, espacios a guiones) como en `Tournament.formatPermalink`; verificar `bun run build`
- [x] 1.2 Verificar que la restricción UNIQUE sobre `permalink` se traduzca en migración y en validación del servicio

## 2. DTOs de Announcement

- [x] 2.1 Crear `src/modules/announcements/dto/create-announcement.dto.ts`: `title`, `description` y `content` requeridos (`@IsString`, `@IsNotEmpty`; `@MinLength(3)` para el título y `@MinLength(8)` para descripción y contenido); `permalink` opcional (`@IsString`, `@MinLength(3)`, `@IsOptional`); `publishedAt` opcional (`@IsDateString` o `@IsISO8601`); `imageUrl` opcional (`@IsUrl` restringido a `https`); `imagePublicId` opcional (`@IsString`, `@MinLength(4)`, `@IsOptional`); `active` opcional (`@IsBoolean`); verificar `bun run build`
- [x] 2.2 Crear `src/modules/announcements/dto/update-announcement.dto.ts` con `PartialType(CreateAnnouncementDto)`; crear `src/modules/announcements/dto/index.ts` re-exportando ambos; verificar `bun run build`

## 3. Servicio

- [x] 3.1 Crear `src/modules/announcements/announcements.service.ts` con `@InjectRepository(Announcement)`; implementar `create` generando el permalink a partir del título y devolviendo `ConflictException` si el permalink ya existe, manejando errores con `CommonService.handleExceptions`; verificar `bun run build`
- [x] 3.2 Implementar `findAll(paginationDto, active?)` paginado (`count` + `find`) sin ordenamiento explícito (se conserva el orden natural de la base de datos); sin filtro devuelve todos los anuncios, activos e inactivos (ámbito administrativo); el filtro opcional por estado queda disponible para el futuro ámbito público (solo activas); implementar `findById` con `NotFoundException` si no existe, devolviendo el anuncio aunque esté inactivo en ámbito administrativo; verificar `bun run build`
- [x] 3.3 Implementar `update` regenerando el permalink cuando cambia el título y validando su unicidad, y `remove` con `NotFoundException`; ambos con manejo central de errores; verificar `bun run build`
- [x] 3.4 Implementar en `create` el soporte de un permalink personalizado: si el DTO incluye `permalink`, se normaliza con `Announcement.formatPermalink` y tiene prioridad sobre el derivado del título; si tras normalizar queda vacío, lanzar `BadRequestException`; mantener la validación de unicidad (`ConflictException`) y pasar el permalink normalizado en el `create()` del repositorio; verificar `bun run build`
- [x] 3.5 Implementar en `update` la regla del permalink: si llega `permalink`, se normaliza y gana sobre el título; si llega solo `title`, se regenera desde él; si no llega ninguno, el permalink se conserva sin consulta de unicidad; cuando el permalink resultante difiere del actual, validar unicidad excluyendo el propio anuncio (`ConflictException` si lo usa otro); lanzar `BadRequestException` si queda vacío tras normalizar; ajustar los hooks `@BeforeInsert`/`@BeforeUpdate` para respetar el permalink ya presente (`permalink ?? title`); verificar `bun run build`

## 4. Controlador

- [x] 4.1 Crear `src/modules/announcements/announcements.controller.ts` con `@Auth(VALID_ROLES.ADMIN)` y ruta `announcements`: `POST /`, `GET /` (listado paginado que devuelve todos los anuncios, activos e inactivos), `GET /:id`, `PATCH /:id` y `DELETE /:id`, todos con `@Version('1')` y `ParseUUIDPipe` en los `:id`; verificar `bun run build`

## 5. Módulo y registro

- [x] 5.1 Crear `src/modules/announcements/announcements.module.ts` con `TypeOrmModule.forFeature([Announcement])`, registrando controlador y servicio, importando `AuthModule` y `CommonModule` (patrón de `sponsors.module`); verificar `bun run build`
- [x] 5.2 Registrar `AnnouncementsModule` en `src/app.module.ts` bajo la ruta `./modules/announcements/announcements.module`; verificar `bun run build`

## 6. Migración

- [x] 6.1 Generar la migración con `bun run migration:generate --name=create_announcements_table`; verificar que se crea un archivo en `src/database/migrations/` con la tabla `announcements` y las columnas `id` (uuid), `title`, `permalink` (unique), `publishedAt`, `imageUrl`, `imagePublicId`, `description`, `content`, `active` (default false), `created_at` y `updated_at`
- [x] 6.2 Revisar y, si es necesario, ajustar la migración generada para incluir la restricción `UNIQUE` sobre `permalink`; aplicar con `bun run migration:run` y verificar que la base refleja los cambios (tabla `announcements`)

## 7. Tests y verificación

- [x] 7.1 Añadir `src/modules/announcements/announcements.service.spec.ts` con cobertura de crear (permisos de admin, permalink único y normalizado, anuncio por defecto inactivo, título/contenido requeridos, conflicto por permalink duplicado), consultar (listado paginado solo activas, listado administrativo con inactivas, sin ordenamiento explícito, por id activo, inactivo en público, no encontrado), actualizar (regenerar permalink al cambiar el título, conflicto si el permalink ya existe, no encontrado), activar/desactivar y eliminar (existente, inexistente); verificar `bun test src/modules/announcements/announcements.service.spec.ts`
- [x] 7.2 Ejecutar `bun run build` y `bun run lint`; verificar que no hay errores nuevos y que la regla lint del servicio se aplica
- [x] 7.3 Ampliar `announcements.service.spec.ts` con la regla del permalink personalizado: en crear (permallink normalizado con prioridad sobre el título, permalink vacío tras normalizar → `BadRequestException`), en actualizar (permalink gana sobre el título, solo contenido conserva el permalink sin segunda consulta, permalink vacío → `BadRequestException`, permalink usado por otro → `ConflictException`, unicidad que excluye el propio anuncio), hooks de entidad con permalink presente y validación del DTO para `permalink`; verificar `bun test src/modules/announcements/announcements.service.spec.ts` (33/33) y que `bun run build` y el lint scoped no arrojan errores
- [x] 7.4 Ajustar `CreateAnnouncementDto` y `announcements.service.spec.ts` a las validaciones finales: `description` obligatoria en creación (`@MinLength(8)`), `content` con `@MinLength(8)`, `imageUrl` con `@IsUrl` restringido a `https`, `imagePublicId` con `@MinLength(4)`; ampliar los tests del DTO (sin descripción → error, contenido < 8 → error, imagen no-https → error) y añadir `description` a los payloads y assertions de `create`; verificar `bun test src/modules/announcements/announcements.service.spec.ts` (36/36), `bun run build` y lint scoped