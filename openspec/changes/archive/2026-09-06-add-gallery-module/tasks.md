## 1. Database Migration

- [x] 1.1 Run `bun run migration:generate --name=create_galleries_table` and verify a timestamped file is created in `src/database/migrations/`
- [x] 1.2 Review the generated SQL: table `galleries` with columns `id`, `title`, `permalink` (unique), `active` (default false), `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres

## 2. Entity

- [x] 2.1 Create `src/modules/galleries/entities/gallery.entity.ts` matching design.md (snake_case columns, uuid id, `formatPermalink` static like `Video`, `active` default false, `@BeforeInsert`/`@BeforeUpdate` regenerate permalink) and verify `bun run build` compiles

## 3. DTOs

- [x] 3.1 Create `create-gallery.dto.ts` with class-validator fields (title required min 3, permalink optional string, active optional `IsBoolean`) and `update-gallery.dto.ts` via `PartialType(CreateGalleryDto)`; export both through `dto/index.ts`; verify `bun run build` compiles

## 4. Service

- [x] 4.1 Create `galleries.service.ts` mirroring `videos.service.ts` (inject `Repository<Gallery>` + `CommonService`) implementing create (forced `active: false`, permalink conflict/empty checks), findAll ordered by `createdAt ASC` with `PaginationDto`, findById, update (permalink regen + conflict check), remove; verify `bun run build` compiles
- [x] 4.2 Add `src/modules/galleries/galleries.service.spec.ts` covering: create defaults inactive + permalink generation, permalink conflict raises conflict, findAll orders oldest first by creation date with pagination, findById returns not found for unknown id, update/remove happy paths; verify `bun test src/modules/galleries/galleries.service.spec.ts` passes

## 5. Controller

- [x] 5.1 Create `galleries.controller.ts` at `@Controller('galleries')` with class-level `@Auth(VALID_ROLES.ADMIN)`, `@Version('1')` on all handlers: POST `/`, GET `/` (PaginationDto), GET `/:id` (ParseUUIDPipe), PATCH `/:id`, DELETE `/:id`; verify `bun run build` compiles and `bun run lint` is clean

## 6. Module Wiring

- [x] 6.1 Create `galleries.module.ts` importing `TypeOrmModule.forFeature([Gallery])`, `AuthModule`, `CommonModule`; register `GalleriesModule` in `src/app.module.ts`; verify server starts via `bun run start:dev` and `/api/v1/galleries` answers only to an admin JWT

## 7. Verification

- [x] 7.1 Run `bun run lint`, `bun test`, `bun run type:check`, and `bun run build` and verify all pass
- [x] 7.2 Smoke-test the full flow with curl/admin token: create gallery (inactive), list ordered, activate via PATCH, confirm it is active, update title, delete it, and confirm 404 afterwards