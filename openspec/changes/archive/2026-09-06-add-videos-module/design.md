## Context

The platform (NestJS 12 + TypeORM, UUID ids, `@Auth(VALID_ROLES.ADMIN)` pattern, versioned `/api/v1` routes, `PaginationDto`, snake_case `created_at`/`updated_at`) already has several feature modules (announcements, categories, tournaments) that all follow the same CRUD shape. The videos module mirrors that shape. See proposal.md — Why for motivation; the exact behavior contract lives in `specs/videos/spec.md`.

## Goals / Non-Goals

**Goals:**
- A self-contained admin-only `videos` module with Create, List (paginated), Get by id, Patch, Delete.
- A `videos` entity with the fields requested at business level (identifier, title, permalink, published date, description, video url, platform, active, created/updated dates).
- Automatic unique permalink generation following the existing `formatPermalink` pattern.
- New videos start **inactive** (`active = false`), published date defaults to now.

**Non-Goals:**
- No categories/types/enums for videos, no association with tournaments/teams/players, no public endpoints, no media upload/storage (only a remote video url is stored). No approval workflow.

## Decisions

- **Entity `Video` in `src/modules/videos/entities/video.entity.ts`**, table name `videos`, `@PrimaryGeneratedColumn('uuid') id`. Columns (snake_case, following tournament/team convention rather than the camelCase outlier in announcements):

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `title` | varchar | required |
| `permalink` | varchar | unique; auto-generated from title via `static formatPermalink` (same logic as `Announcement`), guard empty/conflict |
| `published_date` | timestamptz | DB default `now()` (`Default(() => 'now()')`) |
| `description` | varchar | nullable |
| `url` | varchar | video link; validated as https url |
| `platform` | varchar | text label of the source origin (YouTube, Vimeo, Drive…) |
| `active` | boolean | DB default `false` |
| `created_at` | timestamptz | `@CreateDateColumn` |
| `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

- **Module `src/modules/videos/`** with `videos.module.ts`, `videos.controller.ts`, `videos.service.ts`, `entities/video.entity.ts`, `dto/create-video.dto.ts`, `dto/update-video.dto.ts`, `dto/index.ts`. Module imports `TypeOrmModule.forFeature([Video])`, `AuthModule`, `CommonModule`, and is registered in `app.module.ts`.
- **Router:** `VideosController` at `@Controller('videos')`, every handler `@Version('1')` (real path `/api/v1/videos`), class-level `@Auth(VALID_ROLES.ADMIN)`. `:id` params use `ParseUUIDPipe`. `GET /` accepts `PaginationDto`.
- **Service mirrors `announcements.service.ts`** (`CommonService.handleExceptions`, `NotFoundException`, `ConflictException` on permalink, `BadRequestException` when normalized permalink is empty) with one difference: `findAll` orders by `created_at ASC` (oldest first) with `page`/`take` from `PaginationDto`. `create` forces `active: false` by default; activation/deactivation is done via `PATCH`.
- **DTOs** use `class-validator` following `create-announcement.dto.ts`: `title` required (min 3), `permalink` optional string, `published_date` optional `IsDateString`/`IsISO8601`, `description` optional, `url` required `IsUrl` (https), `platform` required string, `active` optional `IsBoolean`. `UpdateVideoDto` extends/partial with optional fields via `PartialType(CreateVideoDto)`.
- **Migration:** `bun run migration:generate --name=create_videos_table` (timestamped file in `src/database/migrations/`), applied with `bun run migration:run`. Follows the plural table-name convention (`create_<table>_table`).

## Risks / Trade-offs

- Unique `permalink` collisions on create/update → reuses the existing conflict check + `BadRequestException` for empty normalized permalinks (same as announcements).
- Inconsistent column naming already exists between modules (announcements uses camelCase) → videos follows the dominant snake_case convention; documented here so reviewers aren't surprised.
- `url` stored as varchar with only https-url validation → clips malformed links only at the DTO boundary, not via streaming checks; acceptable since no media is stored locally.

## Migration Plan

1. `bun run migration:generate --name=create_videos_table` → inspect generated SQL → `bun run migration:run`.
2. Rollback: `bun run migration:revert` drops the `videos` table (idempotent; no dependent data since videos are standalone).

## Open Questions

None. Behavior is fully covered by `specs/videos/spec.md`; the field set was confirmed by the product owner.