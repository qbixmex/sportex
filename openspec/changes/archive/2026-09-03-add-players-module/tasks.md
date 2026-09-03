## 1. Entidad y Migración

- [x] 1.1 Crear entidad `Player` en `src/players/entities/player.entity.ts` con atributos: id (uuid), name, email, phone, birthday, nationality, imageUrl, imagePublicId, active (default false), createdAt, updatedAt, y relación `@ManyToOne` a Team con `onDelete: 'SET NULL'` — verificar que el archivo compila sin errores de tipo
- [x] 1.2 Agregar relación `@OneToMany(() => Player, (player) => player.team) players` en `src/teams/entities/team.entity.ts` — verificar que la entidad Team compila correctamente
- [x] 1.3 Generar migración con `bun run migration:generate --name=create_players_table` — verificar que se crea el archivo de migración en `src/database/migrations/`

## 2. DTOs

- [x] 2.1 Crear `CreatePlayerDto` en `src/players/dto/create-player.dto.ts` con validaciones: name requerido (IsString, MinLength), teamId opcional (IsUUID, IsOptional), campos opcionales con validación apropiada, `@IsEmpty()` en campos de relación — verificar que el DTO compila
- [x] 2.2 Crear `UpdatePlayerDto` en `src/players/dto/update-player.dto.ts` que extienda `PartialType(CreatePlayerDto)` — verificar que el DTO compila
- [x] 2.3 Crear barrel export `src/players/dto/index.ts` — verificar exportaciones

## 3. Servicio

- [x] 3.1 Crear `PlayersService` en `src/players/players.service.ts` con métodos: `findAll` (paginado con `Promise.all([count, find])`), `findById` (soporte UUID con `isUUID`), `create` (con verificación de teamId si se provee), `update` (con merge y verificación de teamId), `remove` — verificar que el servicio compila
- [x] 3.2 Crear helper privado `ensureTeamExists(teamId)` que lance `BadRequestException` si el equipo no existe — verificar compilación

## 4. Controlador

- [x] 4.1 Crear `PlayersController` en `src/players/players.controller.ts` con `@Auth(VALID_ROLES.ADMIN)`, `@Controller('players')`, rutas versionadas (`@Version('1')`): POST, GET, GET(':id'), PATCH(':id'), DELETE(':id') con `ParseUUIDPipe` en PATCH y DELETE — verificar que el controlador compila

## 5. Módulo y Registro

- [x] 5.1 Crear `PlayersModule` en `src/players/players.module.ts` importando ConfigModule, TypeOrmModule.forFeature([Player, Team]), AuthModule, CommonModule — verificar que el módulo compila
- [x] 5.2 Importar `PlayersModule` en `src/app.module.ts` — verificar que la app compila sin errores
- [x] 5.3 Actualizar `src/teams/teams.service.ts` para cumplir el spec de team-management: en `findAll` incluir `playersCount` (cantidad de jugadores por equipo, no la lista completa) y en `findById` incluir los jugadores asociados exponiendo solo `id` y `name` — verificar que el service compila

## 6. Tests

- [x] 6.1 Crear tests unitarios en `src/players/players.service.spec.ts` siguiendo el patrón de `teams.service.spec.ts`: mockear repositorios de Player y Team con jest.fn(), testear `findAll`, `findById`, `create`, `update`, `remove`, y escenarios de error (equipo inexistente, jugador inexistente) — verificar que `bun test src/players/players.service.spec.ts` pasa

## 7. Lint y Build

- [x] 7.1 Ejecutar `bun run lint` y corregir errores si los hay — verificar que lint pasa limpio
- [x] 7.2 Ejecutar `bun run build` — verificar que el build completa sin errores
