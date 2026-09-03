## 1. Entidad y relación

- [x] 1.1 Crear `src/modules/coaches/entities/coach.entity.ts` con los campos `id` (uuid), `name` (varchar, requerido), `email` (varchar, `unique: true`, requerido), `phone`, `age` (int), `nationality`, `imageUrl`, `imagePublicId`, `description` (opcionales), `active` (boolean, default `false`), `createdAt` y `updatedAt`; verificar que la entidad se compile (`bun run build`)
- [x] 1.2 Añadir la relación `@OneToMany(() => Team, (team) => team.coach) teams: Team[]` en `Coach`, con el import a `@/modules/teams/entities/team.entity`; verificar que la entidad se compile
- [x] 1.3 Añadir en `Team` la relación `@ManyToOne(() => Coach, (coach) => coach.teams, { onDelete: 'SET NULL' })` + `@JoinColumn({ name: 'coach_id' })` con `coach?` y `coachId?`; verificar que la entidad se compile (`bun run build`)

## 2. DTOs de Coach

- [x] 2.1 Crear `src/modules/coaches/dto/create-coach.dto.ts`: `name` y `email` requeridos (`@IsNotEmpty`, `@IsString`, `@MinLength`), `email` con `@IsEmail`; `phone`, `age` (`@IsNumber`), `nationality`, `imageUrl`, `imagePublicId`, `description`, `active` opcionales; `teamIds: string[]` opcional con `@IsArray` + `@IsUUID({ each: true })`; verificar `bun run build`
- [x] 2.2 Crear `src/modules/coaches/dto/update-coach.dto.ts` con `PartialType(CreateCoachDto)`; crear `src/modules/coaches/dto/index.ts` re-exportando ambos; verificar `bun run build`
- [x] 2.3 Añadir `coachId?` opcional al `CreateTeamDto` y `UpdateTeamDto` (`@ValidateIf` + `@IsUUID`, en blanco anula), siguiendo el patrón de `tournamentId`/`categoryId`; verificar `bun run build`

## 3. Servicio

- [x] 3.1 Crear `src/modules/coaches/coaches.service.ts` con `@InjectRepository(Coach)` y `@InjectRepository(Team)`, inyectando `CommonService`; implementar `create` validando que cada `teamId` exista (patrón `ensureTeamExists`) y asignando `coach_id`, manejando errores con `CommonService.handleExceptions`; verificar `bun run build`
- [x] 3.2 Implementar `findAll` paginado (`PaginationDto`) con `count` + `find`, incluyendo `teams` (solo `id` y `name`); y `findById` devolviendo `NotFoundException` si no existe; verificar `bun run build`
- [x] 3.3 Implementar `update` (validar email único y sincronizar `teamIds`) y `remove` (eliminar por id con `NotFoundException`); ambos con manejo central de errores; verificar `bun run build`

## 4. Controlador

- [x] 4.1 Crear `src/modules/coaches/coaches.controller.ts` con `@Auth(VALID_ROLES.ADMIN)` y ruta `coaches`: `POST /`, `GET /` (paginado), `GET /:id`, `PATCH /:id` y `DELETE /:id`, todos con `@Version('1')` y `ParseUUIDPipe` en los `:id`; verificar `bun run build`

## 5. Módulo y registro

- [x] 5.1 Crear `src/modules/coaches/coaches.module.ts` con `TypeOrmModule.forFeature([Coach, Team])`, registrando controlador y servicio (patrón de `players.module`); verificar `bun run build`
- [x] 5.2 Registrar `CoachesModule` en `src/app.module.ts` bajo la ruta `./modules/coaches/coaches.module`; verificar `bun run build`

## 6. Migración

- [x] 6.1 Generar la migración con `bun run migration:generate --name=add-coaches-module`; verificar que se crea un archivo en `src/database/migrations/` con la tabla `coaches`, la columna `teams.coach_id` y la FK `ON DELETE SET NULL`
- [x] 6.2 Revisar y, si es necesario, ajustar la migración generada para incluir la restricción `UNIQUE` sobre `coaches.email`; aplicar con `bun run migration:run` y verificar que la base refleja los cambios (tabla `coaches` y columna `teams.coach_id`)

## 7. Tests y verificación

- [x] 7.1 Añadir `src/modules/coaches/coaches.service.spec.ts` con cobertura de crear (con y sin equipos, email duplicado, equipo inexistente), consultar (paginado, por id, no encontrado), actualizar y eliminar; verificar `bun test src/modules/coaches/coaches.service.spec.ts`
- [x] 7.2 Ejecutar `bun run build` y `bun run type:check`; verificar que no hay errores nuevos (solo se toleran los preexistentes en `teams.service.spec.ts`)
