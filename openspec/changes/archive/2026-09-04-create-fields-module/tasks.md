## 1. Entities

- [ ] 1.1 Create `src/modules/fields/entities/field.entity.ts` with columns `id` (uuid PK), `name`, `permalink` (nullable), `city`, `state`, `country`, `address`, `map` (nullable), `createdAt`, `updatedAt`, and a `@OneToMany(() => FieldTeam)` relation; verify it compiles
- [ ] 1.2 Create `src/modules/fields/entities/field-team.entity.ts` with composite primary key (`fieldId`, `teamId`) and `@ManyToOne` relations to Field and Team with `onDelete: CASCADE`; verify it compiles
- [ ] 1.3 Add `@OneToMany(() => FieldTeam)` relation to `src/modules/teams/entities/team.entity.ts`; verify existing teams tests still pass

## 2. DTOs

- [ ] 2.1 Create `src/modules/fields/dto/create-field.dto.ts` validating `name` (required) and optional `permalink`, `city`, `state`, `country`, `address`, `map`
- [ ] 2.2 Create `src/modules/fields/dto/update-field.dto.ts` (partial) and `src/modules/fields/dto/index.ts` barrel

## 3. Service & Controller

- [ ] 3.1 Create `src/modules/fields/fields.service.ts` with `findAll` (paginated), `create`, `findById` (by id or permalink, including associated teams with `id` and `name`), `update`, `remove`; verify uniqueness of `permalink`
- [ ] 3.2 Create `src/modules/fields/fields.controller.ts` (`@Controller('fields')`, `@Auth(VALID_ROLES.ADMIN)`, `@Version('1')`, routes `/api/v1/fields`)
- [ ] 3.3 Create `src/modules/fields/fields.module.ts` importing `TypeOrmModule.forFeature([Field, FieldTeam])`, `AuthModule`, `CommonModule`, `ConfigModule`, and register `FieldsModule` in `src/app.module.ts`

## 4. Migration

- [ ] 4.1 Generate a TypeORM migration (e.g. `create_field_team_table`) that creates `fields` and `field_team` (PK `field_id` + `team_id`); verify it lands in `src/database/migrations/`

## 5. Tests & Verification

- [ ] 5.1 Create `src/modules/fields/fields.service.spec.ts` covering create/list/get-by-id/update/remove and permalink uniqueness
- [ ] 5.2 Run `bun run build` and `bun run lint`; verify no errors
- [ ] 5.3 Run `bun test src/modules/fields/fields.service.spec.ts` (with DB available); verify all tests pass
