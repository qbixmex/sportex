## 1. Entidad y configuración

- [x] 1.1 Crear `src/modules/sponsors/entities/sponsor.entity.ts` con los campos `id` (uuid text, primary generated), `name` (varchar, unique, requerido), `url` (text, opcional), `imageUrl` (text, opcional), `imagePublicId` (text, opcional), `startDate` (date, opcional), `endDate` (date, opcional), `position` (int, default 0), `clicks` (int, default 0), `active` (boolean, default false), `createdAt` y `updatedAt`; verificar que la entidad se compile (`bun run build`)
- [x] 1.2 Verificar que la restricción UNIQUE en `name` se traduzca en migración y en validación del servicio

## 2. DTOs de Sponsor

- [x] 2.1 Crear `src/modules/sponsors/dto/create-sponsor.dto.ts`: `name` requerido (`@IsNotEmpty`, `@IsString`, `@MinLength(3)`); `url`, `imageUrl`, `imagePublicId` opcionales (`@IsString`); `position` y `clicks` opcionales (`@IsNumber`, `@Min(0)`); `active` opcional (`@IsBoolean`); verificar `bun run build`
- [x] 2.2 Crear `src/modules/sponsors/dto/update-sponsor.dto.ts` con `PartialType(CreateSponsorDto)`; crear `src/modules/sponsors/dto/index.ts` re-exportando ambos; verificar `bun run build`
- [x] 2.3 Añadir validación en el servicio para que `name` permanezca único en actualizaciones

## 3. Servicio

- [x] 3.1 Crear `src/modules/sponsors/sponsors.service.ts` con `@InjectRepository(Sponsor)`, implementar `create` validando que `name` sea único y manejando errores con `CommonService.handleExceptions`; implementar `findAll` paginado (`PaginationDto`) con `count` + `find`, y `findById` devolviendo `NotFoundException` si no existe; verificar `bun run build`
- [x] 3.2 Implementar `update` validando email/name único y `remove` (eliminar por id con `NotFoundException`); ambos con manejo central de errores; verificar `bun run build`

## 4. Controlador

- [x] 4.1 Crear `src/modules/sponsors/sponsors.controller.ts` con `@Auth(VALID_ROLES.ADMIN)` y ruta `sponsors`: `POST /`, `GET /` (paginado), `GET /:id`, `PATCH /:id` y `DELETE /:id`, todos con `@Version('1')` y `ParseUUIDPipe` en los `:id`; verificar `bun run build`

## 5. Módulo y registro

- [x] 5.1 Crear `src/modules/sponsors/sponsors.module.ts` con `TypeOrmModule.forFeature([Sponsor])`, registrando controlador y servicio (patrón de `players.module`); verificar `bun run build`
- [x] 5.2 Registrar `SponsorsModule` en `src/app.module.ts` bajo la ruta `./modules/sponsors/sponsors.module`; verificar `bun run build`

## 6. Migración

- [x] 6.1 Generar la migración con `bun run migration:generate --name=add-sponsor-module`; verificar que se crea un archivo en `src/database/migrations/` con la tabla `sponsors` y las columnas `id`, `name` (unique), `url`, `image_url`, `image_public_id`, `start_date`, `end_date`, `position` (default 0), `clicks` (default 0), `active` (default false), `createdAt`, `updatedAt`
- [x] 6.2 Revisar y, si es necesario, ajustar la migración generada para incluir la restricción `UNIQUE` sobre `name`; aplicar con `bun run migration:run` y verificar que la base refleja los cambios (tabla `sponsors`)

## 7. Tests y verificación

- [x] 7.1 Añadir `src/modules/sponsors/sponsors.service.spec.ts` con cobertura de crear (con nombre válido, nombre duplicado, campos opcionales), consultar (paginado, por id, no encontrado), actualizar y eliminar; verificar `bun test src/modules/sponsors/sponsors.service.spec.ts`
- [x] 7.2 Ejecutar `bun run build` y `bun run type:check`; verificar que no hay errores nuevos