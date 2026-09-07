## Context

The platform (NestJS 12 + TypeORM, UUID ids, `@Auth(VALID_ROLES.ADMIN)` pattern, versioned `/api/v1` routes, `PaginationDto`, snake_case `created_at`/`updated_at`) already has several admin-only CRUD modules (announcements, categories, tournaments, videos). The galleries module mirrors the `videos` module shape, whose entity fields (title, permalink, active, created/updated) are a subset of what galleries needs. See `proposal.md` — Why for motivation; the exact behavior contract lives in `specs/gallery-management/spec.md`.

## Goals / Non-Goals

**Goals:**
- A self-contained admin-only `galleries` module with Create, List (paginated), Get by id, Patch, Delete.
- A `Gallery` entity with the fields requested at business level (identifier, title, permalink, active, created/updated dates).
- Automatic unique permalink generation following the existing `formatPermalink` pattern (same as `Video`/`Announcement`).
- New galleries start **inactive** (`active = false`).

**Non-Goals:**
- No gallery content/media (images) — the gallery is a standalone container modeled by its own data only.
- No public endpoints, no association with tournaments/teams/players, no approval workflow.

## Decisions

- **Entity `Gallery` in `src/modules/galleries/entities/gallery.entity.ts`**, table name `galleries`, `@PrimaryGeneratedColumn('uuid') id`. Columns (snake_case, following the `videos`/tournament convention):

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `title` | varchar | required |
| `permalink` | varchar | unique; auto-generated from title via `static formatPermalink` (same logic as `Video`), regenerated on insert/update via `@BeforeInsert`/`@BeforeUpdate`, empty-normalized permalinks and conflicts guarded in the service |
| `active` | boolean | DB default `false` (`@Column({ type: 'boolean', default: false })`) |
| `created_at` | timestamptz | `@CreateDateColumn` |
| `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

- **Module `src/modules/galleries/`** with `galleries.module.ts`, `galleries.controller.ts`, `galleries.service.ts`, `entities/gallery.entity.ts`, `dto/create-gallery.dto.ts`, `dto/update-gallery.dto.ts`, `dto/index.ts`. Module imports `TypeOrmModule.forFeature([Gallery])`, `AuthModule`, `CommonModule`, and is registered in `src/app.module.ts`.
- **Router:** `GalleriesController` at `@Controller('galleries')`, every handler `@Version('1')` (real path `/api/v1/galleries`), class-level `@Auth(VALID_ROLES.ADMIN)`. `:id` params use `ParseUUIDPipe`. `GET /` accepts `PaginationDto`.
- **Service mirrors `videos.service.ts`** (`CommonService.handleExceptions`, `NotFoundException`, `ConflictException` on permalink, `BadRequestException` when the normalized permalink is empty) with `findAll` ordered by `created_at ASC` (oldest first) and `page`/`take` from `PaginationDto`. `create` forces `active: false` by default; activation/deactivation is done via `PATCH`.
- **DTOs** use `class-validator` following `create-video.dto.ts`: `title` required (min 3), `permalink` optional string, `active` optional `IsBoolean`. `UpdateGalleryDto` via `PartialType(CreateGalleryDto)`.
- **Migration:** `bun run migration:generate --name=create_galleries_table` (timestamped file in `src/database/migrations/`), applied with `bun run migration:run`. Follows the plural table-name convention (`create_<table>_table`).

## Risks / Trade-offs

- Unique `permalink` collisions on create/update → reuse the existing conflict check + `BadRequestException` for empty normalized permalinks (same as videos/announcements).
- Galleries have no content yet, so `active` only flags availability → intentional; content is a future change that will extend this entity.

## Migration Plan

1. `bun run migration:generate --name=create_galleries_table` → inspect generated SQL → `bun run migration:run`.
2. Rollback: `bun run migration:revert` drops the `galleries` table (idempotent; no dependent data since galleries are standalone).

## Open Questions

None. Behavior is fully covered by `specs/gallery-management/spec.md`; the field set was confirmed by the product owner.