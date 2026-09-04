## Context

El módulo `fields` ya existe con la entidad `Field`, `FieldTeam` y relaciones configuradas. Este cambio formaliza el comportamiento de la relación pivote.

## Goals / Non-Goals

**Goals:**
- Definir requisitos de comportamiento para la relación muchos a muchos.
- Documentar consultas y creación de asociaciones.

**Non-Goals:**
- No introduce nuevos endpoints de gestión de pivote (eso podría ser futuro).
- No modifica la estructura de la base de datos (ya existe `field_team`).

## Decisions

- Se usa la entidad `FieldTeam` dedicada (no `@JoinTable`) como se decidió en `create-fields-module`.
- La relación es bidireccional (`Field` ↔ `Team`) a través del pivote.

## Migration Plan

No requiere migración; la tabla `field_team` ya existe en la base de datos.
