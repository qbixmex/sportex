# Finiquitar `add-gallery-images`: `position` + respuestas livianas

Cambio OpenSpec: `openspec/changes/add-gallery-images` (capacidad `gallery-management`), aún sin archivar.

## Contexto actual verificado

- Migración aplicada: `1788743764576-create_gallery_image_table.ts` — tabla `gallery_images` YA tiene `position int NOT NULL DEFAULT 0`. (Nombre del archivo en singular; la convención es plural. Se deja como está — ya aplicada; cosmético.)
- Entidad `GalleryImage` + `CreateGalleryImageDto` ya incluyen `position` (opcional, `IsNumber` + `IsPositive`; DB default 0).
- Service ya recortado por el usuario: `create` filtra la clave `gallery` del output; `remove` devuelve solo `{ message }`; duplicado por `count()`. `galleries.service.remove` devuelve solo `{ message }`.
- Huecos detectados:
  1. `findById` y `update` usan `findOne({ where: { gallery: { id } } })` → TypeORM carga la relación `gallery` y el objeto galería completo se filtra en la respuesta.
  2. `findAll` ordena solo por `createdAt ASC`; `position` no se usa.
  3. `gallery-images.service.spec.ts` roto: el test de conflicto mockea `findOne` (ahora el service usa `count()`), y `remove` espera `{ message, galleryImage }`.
  4. Artefactos OpenSpec desactualizados (no mencionan `position` ni el recorte de respuestas; el spec dice "junto con la galería a la que pertenece").

## Decisiones del usuario (confirmadas)

1. Respuestas de GalleryImage: quitar SOLO la galería anidada en `findById`/`update`/`findAll`/`create` (no tocar campos de la imagen).
2. Módulo Gallery: recortar SOLO el DELETE (ya hecho) — el resto devuelve el objeto galería normal.
3. `findAll`: ordenar por `position ASC` y luego `createdAt ASC`.
4. `position` positivo desde 1 (DTO `IsPositive` ya elegido; omitir → DB default 0, aparece primero).

---

## Fase A — Artefactos OpenSpec (vía `openspec-update-change`)

### `proposal.md`
- Añadir bullet: cada imagen soporta una **posición opcional** que controla el orden de visualización en el listado.
- Añadir bullet: las respuestas de imágenes NO exponen la galería a la que pertenecen; las eliminaciones devuelven solo un mensaje de confirmación.

### `specs/gallery-management/spec.md` (delta)
- ADDED "Registro de una imagen en una galería": incluir **posición opcional** (entero positivo) al registrar.
- ADDED "Listado de imágenes de una galería": módulo ordenación → "ordenadas por **posición** (ascendente) y luego por **fecha de creación** (más antiguas primero)"; actualizar scenario.
- ADDED "Consulta de una imagen": quitar "junto con la galería a la que pertenece" → "la imagen se devuelve con sus datos sin incluir la galería".
- ADDED "Eliminación de una imagen": la respuesta confirma la eliminación (solo mensaje); idem scenario de eliminación de galería en MODIFIED.

### `design.md`
- Tabla de columnas de `GalleryImage`: añadir fila `position` (int, DB default 0, opcional en solicitudes, usado para ordenar).
- Bullet Service: `findAll` ordena `position ASC, createdAt ASC`; `findById`/`create`/`update` devuelven la imagen sin la relación `gallery`; `remove` (imágenes y galerías) devuelve solo `{ message }`.
- Bullet DTOs: `position` opcional (`IsNumber`+`IsPositive`, valores ≥ 1).

### `tasks.md`
- Ajustar tareas ya marcadas para reflejar realidad: 1.2 (columna `position`), 3.1 (DTO position), 4.1 (orden por position + strip de gallery en findById/update), 4.2 (tests nuevos), 7.2 (verificación sin galería anidada en respuestas).

## Fase B — Código

### `src/modules/gallery-images/gallery-images.service.ts`
- Extraer helper privado (p. ej. `stripGallery(image)`): devuelve el objeto sin la clave `gallery` (`Object.fromEntries(Object.entries(...).filter(...))`, mismo mecanismo del `create` actual).
- `findById`: `return this.stripGallery(galleryImage)`.
- `update`: usar `stripGallery(updatedGalleryImage)` en `galleryImage` de la respuesta.
- `create`: reemplazar el filtro inline por el helper (comportamiento idéntico).
- `findAll`: `orderBy('galleryImage.position','ASC').addOrderBy('galleryImage.createdAt','ASC')`.

### `src/modules/gallery-images/gallery-images.service.spec.ts`
- Mock del repo: añadir `count: vi.fn()`.
- Test conflicto: mockear `count.mockResolvedValue(1)` (en lugar de `findOne`) → sigue lanzando `ConflictException`.
- Test `findAll`: builder con `orderBy` + `addOrderBy`; esperar `orderBy('galleryImage.position','ASC')` y `addOrderBy('galleryImage.createdAt','ASC')`.
- Test `findById`: nuevo caso — `findOne` devuelve imagen con `gallery` poblado → resultado NO contiene clave `gallery`.
- Test `update`: ajustar expectativa para que `galleryImage` excluya `gallery`.
- Test `remove`: esperar solo `{ message }`.

### Verificación
`node_modules/.bin/oxlint` + `tsc --noEmit` (o `node_modules/.bin/tsc -p tsconfig.json --noEmit`) + `nest build` + `bunx vitest run src/modules/gallery-images/gallery-images.service.spec.ts` (y suite completa si no requiere DB fuera del alcance).

## No hacer (ya decidido / fuera de alcance)
- No recortar el resto de endpoints de `galleries` (solo DELETE, hecho).
- No renombrar la migración `create_gallery_image_table` → plural (ya aplicada; cosmético). Nota en tasks como desviación.
- No tocar el `position` que el usuario agregó a `categories/dto/create-category.dto.ts` (fuera de este change).