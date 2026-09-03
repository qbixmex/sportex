## 1. Entidad y relaciones

- [x] 1.1 Create `src/teams/entities/team.entity.ts` with `Team(table 'teams')`: uuid `id`, `name` varchar (no unique), `permalink` varchar (no unique), `format` varchar, `gender` enum (`teams_gender_enum`, default `male`), `country`/`city`/`state`/`address` varchar nullable, `emails` varchar array, `active` boolean, `imageUrl`/`imagePublicId` nullable, `createdAt`/`updatedAt` columns, y `@Index(['permalink', 'format'])`; `tournamentId` uuid nullable via `@ManyToOne(() => Tournament, (t) => t.teams, { onDelete: 'SET NULL' })` + `@JoinColumn({ name: 'tournament_id' })`; `categoryId` uuid nullable via `@ManyToOne(() => Category, (c) => c.teams, { onDelete: 'SET NULL' })` + `@JoinColumn({ name: 'category_id' })`; verify the file compiles (`bun run build`)
- [x] 1.2 Add inverse `@OneToMany(() => Team, (team) => team.tournament) teams!: Team[]` to `src/tournaments/entities/tournament.entity.ts`; verify build passes (`bun run build`)
- [x] 1.3 Add inverse `@OneToMany(() => Team, (team) => team.category) teams!: Team[]` to `src/categories/entities/category.entity.ts`; verify build passes (`bun run build`)

## 2. DTOs y servicio

- [x] 2.1 Create `src/teams/dto/create-team.dto.ts` (`name`, `permalink`, `format` required; `gender` optional enum; `tournamentId` optional; `categoryId` optional) and `src/teams/dto/update-team.dto.ts` (`@PartialType(CreateTeamDto)`); verify `bun run build`
- [x] 2.2 Create `src/teams/teams.service.ts` with CRUD: create (validate `tournamentId`/`categoryId` exist, assign relations; no duplicate-name check), findAll (pagination), findById (load tournament + category), update (use `repository.merge` for scalars; handle `tournamentId`/`categoryId` explicitly, allow nulling), remove; throw NotFound on missing entities; verify build passes

## 3. Controlador y módulo

- [x] 3.1 Create `src/teams/teams.controller.ts` with `@Auth(VALID_ROLES.ADMIN)`, `@Controller('teams')`, `@Version('1')`, `ParseUUIDPipe` on `:id`, routes: POST `/`, GET `/` (pagination), GET `/:id`, PATCH `/:id`, DELETE `/:id`; verify routes registered via `bun run start:dev` introspection or route listing
- [x] 3.2 Create `src/teams/teams.module.ts` importing `ConfigModule`, `TypeOrmModule.forFeature([Team, Tournament, Category])`, `AuthModule`, `CommonModule`, and register `TeamsModule` in `app.module.ts`; verify module loads and build passes

## 4. Migración y verificación

- [x] 4.1 Run `bun run migration:generate --name=create_teams_table` and confirm it creates `teams` table with FKs to `tournaments(id)` and `categories(id)` (nullable, `ON DELETE SET NULL`); includes `CREATE TYPE`/`DROP TYPE` for `teams_gender_enum` and index `(permalink, format)`; review the generated migration file
- [x] 4.2 Run `bun run migration:run` and verify the `teams` table exists in Postgres with `category_id` column and enum type `teams_gender_enum`
- [x] 4.3 Run `bun run migration:generate --name=update_teams_table` and `bun run migration:run` to add the `category_id` FK (only if it was added after `create_teams_table`); verify column and FK `ON DELETE SET NULL` in Postgres; build passes
- [ ] 4.4 Run `bun test src/teams` (or relevant spec files) and `bun run lint` and confirm no failures; verify nonexistent-tournament and nonexistent-category scenarios are covered (DEFERRED: user deprioritized tests)