# Change: add-gallery-images (planning artifacts)

Target: `openspec/changes/add-gallery-images/` — schema `spec-driven`.
Capability: modified `gallery-management` (delta spec at `specs/gallery-management/spec.md`).

Decisions confirmed with the product owner:
- Deleting a gallery deletes its images too (DB `ON DELETE CASCADE`).
- Metadata-only CRUD: the admin provides the image URL + public id directly (no file upload).

---

## proposal.md

## Why

Las galerías se registran actualmente como contenedores vacíos: no existe forma de asociarles las imágenes que constituyen su contenido. Se necesita que los administradores puedan poblar cada galería con imágenes para que la galería tenga contenido real.

## What Changes

- Se incorporan las **imágenes de galería** como el contenido de las galerías.
- Cada imagen de galería se define por su **título** y por la **imagen** que muestra (referencia a su ubicación y a su identificador público).
- Cada imagen de galería **pertenece obligatoriamente a una galería**, y la galería es la única capaz de agrupar esa imagen.
- Cada imagen de galería tiene un **estado activo/inactivo** (disponible o no) y registra su **fecha de creación** y su **fecha de última actualización**.
- Un administrador puede **registrar**, **listar**, **consultar**, **modificar** y **eliminar** imágenes dentro de una galería.
- El **listado** de imágenes se hace dentro de una galería concreta.
- Cuando se **elimina una galería**, se eliminan de forma definitiva todas sus imágenes.
- La **misma imagen** no se puede registrar dos veces en la plataforma.
- La gestión de imágenes de galería queda restringida a **administradores**, al igual que las galerías.
- No se maneja la subida del archivo de la imagen: el administrador registra la referencia a una imagen ya almacenada por fuera.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `gallery-management`: Se amplía la gestión de galerías para incluir el contenido (imágenes) de cada galería: registro, listado por galería, consulta, modificación, eliminación y control de disponibilidad de las imágenes, manteniendo la restricción de acceso a administradores.

## Impact

- Se agrega el contenido (imágenes) dentro de la gestión de galerías existente, sin crear una capacidad pública nueva.
- La eliminación de una galería pasa a borrar también sus imágenes.
- No se modifican las capacidades de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores, anuncios ni videos.
- Se mantiene la regla vigente de que toda la gestión de galerías es exclusiva de administradores.

---

## specs/gallery-management/spec.md (delta)

## Purpose

Permite a los administradores gestionar el contenido (imágenes) de las galerías de la plataforma, de modo que cada galería pueda mostrar las imágenes que la componen.

## ADDED Requirements

### Requirement: Registro de una imagen en una galería

El sistema SHALL permitir a un administrador registrar una imagen dentro de una galería existente indicando su **título** y la **referencia a la imagen** (ubicación e identificador público). La misma imagen SHALL NOT poder registrarse dos veces en la plataforma. Al registrarse, la imagen SHALL quedar **inactiva** (no disponible) y con fecha de creación igual al día de su registro.

#### Scenario: Registro exitoso de una imagen en una galería

- **WHEN** un administrador registra una imagen con su título y referencia en una galería existente
- **THEN** el sistema crea la imagen asociada a esa galería, inactiva, con fecha de creación de hoy

#### Scenario: Intento de registrar la misma imagen dos veces

- **WHEN** un administrador intenta registrar una imagen cuya referencia ya está registrada
- **THEN** el sistema rechaza la solicitud por duplicidad

#### Scenario: Registro de una imagen en una galería inexistente

- **WHEN** un administrador intenta registrar una imagen en una galería que no existe
- **THEN** el sistema rechaza la solicitud

### Requirement: Listado de imágenes de una galería

El sistema SHALL permitir a un administrador obtener la lista de imágenes de una galería específica, paginada y ordenada por fecha de creación, mostrando primero las más antiguas.

#### Scenario: Listado paginado de las imágenes de una galería

- **WHEN** un administrador solicita la lista de imágenes de una galería
- **THEN** el sistema devuelve las imágenes de esa galería ordenadas por fecha de creación de más antiguas a más recientes, en páginas de tamaño definido

### Requirement: Consulta de una imagen

El sistema SHALL permitir a un administrador consultar una imagen por su identificador y ver todos sus datos (título, referencia a la imagen, estado activo o inactivo, fechas de creación y de actualización) junto con la galería a la que pertenece.

#### Scenario: Consulta de una imagen existente

- **WHEN** un administrador consulta una imagen por su identificador
- **THEN** el sistema devuelve todos los datos de la imagen

### Requirement: Modificación de una imagen

El sistema SHALL permitir a un administrador modificar el **título** y la **referencia a la imagen** de una imagen existente. La referencia SHALL mantenerse única en la plataforma. Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación de una imagen

- **WHEN** un administrador modifica el título o la referencia de una imagen
- **THEN** el sistema guarda los cambios y los refleja de inmediato

#### Scenario: Modificación que duplica la referencia de otra imagen

- **WHEN** un administrador modifica una imagen dejando la referencia de otra imagen ya registrada
- **THEN** el sistema rechaza la solicitud por duplicidad

### Requirement: Control de disponibilidad de una imagen

El sistema SHALL permitir a un administrador **activar** una imagen para que esté disponible y **desactivarla** para que deje de estar disponible sin eliminarla.

#### Scenario: Activación de una imagen

- **WHEN** un administrador activa una imagen inactiva
- **THEN** la imagen queda disponible

#### Scenario: Desactivación de una imagen

- **WHEN** un administrador desactiva una imagen activa
- **THEN** la imagen deja de estar disponible pero permanece registrada

### Requirement: Eliminación de una imagen

El sistema SHALL permitir a un administrador eliminar una imagen de una galería de forma definitiva.

#### Scenario: Eliminación de una imagen

- **WHEN** un administrador elimina una imagen existente
- **THEN** la imagen se elimina de forma definitiva y deja de existir en el sistema

### Requirement: Acceso restringido a administradores

El sistema SHALL restringir el acceso a la gestión de imágenes de galería únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados.

#### Scenario: Acceso de un administrador

- **WHEN** un usuario administrador intenta acceder a la gestión de imágenes de galería
- **THEN** el sistema le permite operar con las imágenes

#### Scenario: Acceso de un usuario no administrador

- **WHEN** un usuario que no es administrador intenta acceder a la gestión de imágenes de galería
- **THEN** el sistema rechaza la solicitud

## MODIFIED Requirements

### Requirement: Eliminación de una galería

El sistema SHALL permitir a un administrador eliminar una galería de forma definitiva. Al eliminar la galería, el sistema SHALL eliminar también, de forma definitiva, todas las imágenes asociadas a esa galería.

#### Scenario: Eliminación de una galería con imágenes

- **WHEN** un administrador elimina una galería que tiene imágenes
- **THEN** la galería se elimina de forma definitiva y todas sus imágenes se eliminan con ella

---

## design.md

## Context

The `galleries` module already exists (entity `Gallery`, admin-only CRUD at `/api/v1/galleries`). Images give galleries their content. The `Announcement` entity already models Cloudinary-style media as `imageUrl` (`image_url`) + `imagePublicId` (`image_public_id`). This change adds a `GalleryImage` entity that belongs to a `Gallery` (one-to-many) with DB-level `ON DELETE CASCADE`, plus an admin-only CRUD module. The behavior contract lives in `specs/gallery-management/spec.md`.

## Goals / Non-Goals

**Goals:**
- A `gallery_images` table and `GalleryImage` entity with the requested fields.
- One-to-many relation Gallery → GalleryImage; deleting a gallery deletes its images (DB `ON DELETE CASCADE`).
- Admin-only CRUD for gallery images, scoped per gallery (nested inside a gallery id).
- Metadata-only: no file upload handling.

**Non-Goals:**
- No file upload / storage service integration (the URL + public id are provided directly by the admin).
- No public endpoints.

## Decisions

- **Entity `GalleryImage`** in `src/modules/gallery-images/entities/gallery-image.entity.ts`, table `gallery_images`:

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK, `@PrimaryGeneratedColumn('uuid')` |
| `gallery_id` | uuid | FK → `galleries.id`, `onDelete: 'CASCADE'`, `@JoinColumn({ name: 'gallery_id' })` with `@ManyToOne(() => Gallery, (g) => g.images)` |
| `title` | varchar | required |
| `image_url` | varchar | unique, required |
| `image_public_id` | varchar | required |
| `active` | boolean | DB default `false` |
| `created_at` | timestamptz | `@CreateDateColumn` |
| `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

- **Gallery side:** add `@OneToMany(() => GalleryImage, (gi) => gi.gallery)` `images` to `src/modules/galleries/entities/gallery.entity.ts` (no migration needed for the relation itself).
- **Module `src/modules/gallery-images/`:** `gallery-images.module.ts`, `gallery-images.controller.ts`, `gallery-images.service.ts`, `entities/gallery-image.entity.ts`, `dto/create-gallery-image.dto.ts`, `dto/update-gallery-image.dto.ts`, `dto/index.ts`, `gallery-images.service.spec.ts`. Module imports `TypeOrmModule.forFeature([GalleryImage, Gallery])`, `AuthModule`, `CommonModule`; registered in `src/app.module.ts`.
- **Router:** `GalleryImagesController` at `@Controller('galleries/:galleryId/images')`, every handler `@Version('1')` (real path `/api/v1/galleries/:galleryId/images`), class-level `@Auth(VALID_ROLES.ADMIN)`. Params `galleryId`/`id` use `ParseUUIDPipe`. Endpoints: `POST /`, `GET /` (PaginationDto + galleryId), `GET /:id`, `PATCH /:id`, `DELETE /:id`. All operations validate the parent gallery exists (404 otherwise). Deleting a gallery via `galleries.service.remove` cascades through the DB FK.
- **Service mirrors `galleries.service.ts`** (`CommonService.handleExceptions`, `NotFoundException`, `ConflictException` on `image_url` conflict, forced `active: false` on create). `findAll` is filtered by `galleryId`, ordered `createdAt ASC`, paginated with `PaginationDto`. `create`/`update` guard the unique `image_url`. `remove` deletes the image record.
- **DTOs** use `class-validator` following `create-gallery.dto.ts`/`create-video.dto.ts`: `title` required (min 3), `imageUrl` required `IsString`/`IsUrl`, `imagePublicId` required `IsString`, `active` optional `IsBoolean`. `UpdateGalleryImageDto` via `PartialType(CreateGalleryImageDto)`.
- **Migration:** `bun run migration:generate --name=create_gallery_images_table` (timestamped, plural table name), applied with `bun run migration:run`. SQL creates `gallery_images` with FK `ON DELETE CASCADE` and a unique constraint on `image_url`.

## Risks / Trade-offs

- Unique `image_url` collisions → reuse the conflict-check pattern from galleries/videos.
- Deleting a gallery silently removes its images → intentional (confirmed with the product owner); the DB FK `ON DELETE CASCADE` guarantees consistency.
- Registering an image for a deleted/unknown gallery → validated up front with 404.

## Migration Plan

1. `bun run migration:generate --name=create_gallery_images_table` → inspect SQL (FK `ON DELETE CASCADE`, unique `image_url`) → `bun run migration:run`.
2. Rollback: `bun run migration:revert` drops `gallery_images`; galleries are untouched.

## Open Questions

None. Delete-cascade and metadata-only scope were confirmed with the product owner.

---

## tasks.md

## 1. Database Migration

- [ ] 1.1 Run `bun run migration:generate --name=create_gallery_images_table` and verify a timestamped file is created in `src/database/migrations/`
- [ ] 1.2 Review the generated SQL: table `gallery_images` with columns `id`, `gallery_id` (FK → `galleries` ON DELETE CASCADE), `title`, `image_url` (unique), `image_public_id`, `active` (default false), `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres

## 2. Entities

- [ ] 2.1 Create `src/modules/gallery-images/entities/gallery-image.entity.ts` (snake_case columns, uuid id, `@ManyToOne(() => Gallery, { onDelete: 'CASCADE' })` + `@JoinColumn({ name: 'gallery_id' })`, `image_url` unique, `active` default false, `@CreateDateColumn`/`@UpdateDateColumn`) and verify `bun run build` compiles
- [ ] 2.2 Add `@OneToMany(() => GalleryImage, (gi) => gi.gallery)` `images` to `src/modules/galleries/entities/gallery.entity.ts` and verify `bun run build` compiles

## 3. DTOs

- [ ] 3.1 Create `create-gallery-image.dto.ts` with class-validator fields (title required min 3, imageUrl required, imagePublicId required, active optional `IsBoolean`) and `update-gallery-image.dto.ts` via `PartialType(CreateGalleryImageDto)`; export both through `dto/index.ts`; verify `bun run build` compiles

## 4. Service

- [ ] 4.1 Create `gallery-images.service.ts` mirroring `galleries.service.ts` (inject `Repository<Gallery>` + `Repository<GalleryImage>` + `CommonService`) implementing: create (validate gallery exists → 404, forced `active: false`, imageUrl conflict check), findAll ordered by `createdAt ASC` filtered by galleryId with `PaginationDto`, findById, update (imageUrl conflict check), remove; verify `bun run build` compiles
- [ ] 4.2 Add `src/modules/gallery-images/gallery-images.service.spec.ts` covering: create defaults inactive + validates gallery exists, imageUrl conflict raises conflict, findAll returns only that gallery's images ordered oldest first with pagination, findById returns not found for unknown id, update/remove happy paths; verify `bun test src/modules/gallery-images/gallery-images.service.spec.ts` passes

## 5. Controller

- [ ] 5.1 Create `gallery-images.controller.ts` at `@Controller('galleries/:galleryId/images')` with class-level `@Auth(VALID_ROLES.ADMIN)`, `@Version('1')` on all handlers: POST `/`, GET `/` (PaginationDto), GET `/:id` (ParseUUIDPipe), PATCH `/:id`, DELETE `/:id`; `galleryId` and `id` via `ParseUUIDPipe`; verify `bun run build` compiles and `bun run lint` is clean

## 6. Module Wiring

- [ ] 6.1 Create `gallery-images.module.ts` importing `TypeOrmModule.forFeature([GalleryImage, Gallery])`, `AuthModule`, `CommonModule`; register `GalleryImagesModule` in `src/app.module.ts`; verify server starts via `bun run start:dev` and `/api/v1/galleries/:galleryId/images` answers only to an admin JWT

## 7. Verification

- [ ] 7.1 Run `bun run lint`, `bun test`, `bun run type:check`, and `bun run build` and verify all pass
- [ ] 7.2 Smoke-test with curl/admin token: create gallery, add images (inactive), list per gallery ordered, activate via PATCH, update an image, delete it (404 afterwards), delete the gallery and confirm its images are gone