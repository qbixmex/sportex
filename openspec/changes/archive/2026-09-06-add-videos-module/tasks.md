## 1. Database Migration

- [x] 1.1 Run `bun run migration:generate --name=create_videos_table` and verify a timestamped file is created in `src/database/migrations/`
- [x] 1.2 Review the generated SQL: table `videos` with columns `id`, `title`, `permalink` (unique), `published_date` (default now), `description`, `url`, `platform`, `active` (default false), `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres

## 2. Entity and Enums

- [x] 2.1 Create `src/modules/videos/entities/video.entity.ts` matching design.md (snake_case columns, uuid id, `formatPermalink` static like `Announcement`, `Default(() => 'now()')` on `published_date`, `active` default false) and verify `bun run build` compiles

## 3. DTOs

- [x] 3.1 Create `create-video.dto.ts` with class-validator fields (title required min 3, permalink optional, description optional, url required https `IsUrl`, platform required, published_date optional `IsISO8601`, active optional `IsBoolean`) and `update-video.dto.ts` via `PartialType(CreateVideoDto)`; export both through `dto/index.ts`; verify `bun run build` compiles

## 4. Service

- [x] 4.1 Create `videos.service.ts` mirroring `announcements.service.ts` (inject `Repository<Video>` + `CommonService`) implementing create (forced `active: false`, permalink conflict/empty checks), findAll ordered by `created_at ASC` with `PaginationDto`, findById, update (permalink regen + conflict check), remove; verify `bun run build` compiles
- [x] 4.2 Add `src/modules/videos/videos.service.spec.ts` covering: create defaults inactive + permalink generation, permalink conflict raises conflict, findAll orders oldest first by creation date with pagination, findById returns not found for unknown id, update/remove happy paths; verify `bun test src/modules/videos/videos.service.spec.ts` passes

## 5. Controller

- [x] 5.1 Create `videos.controller.ts` at `@Controller('videos')` with class-level `@Auth(VALID_ROLES.ADMIN)`, `@Version('1')` on all handlers: POST `/`, GET `/` (PaginationDto), GET `/:id` (ParseUUIDPipe), PATCH `/:id`, DELETE `/:id`; verify `bun run build` compiles and `bun run lint` is clean

## 6. Module Wiring

- [x] 6.1 Create `videos.module.ts` importing `TypeOrmModule.forFeature([Video])`, `AuthModule`, `CommonModule`; register `VideosModule` in `src/app.module.ts`; verify server starts via `bun run start:dev` and `/api/v1/videos` answers only to an admin JWT

## 7. Verification

- [x] 7.1 Run `bun run lint`, `bun test`, `bun run type:check`, and `bun run build` and verify all pass
- [x] 7.2 Smoke-test the full flow with curl/admin token: create video (inactive), list ordered, activate via PATCH, confirm it is active, update fields, delete it, and confirm 404 afterwards