## Why

The fields (canchas) module exists but the explicit many-to-many relationship between Field and Team via the FieldTeam pivot table needs formal specification for association management and query behavior.

## What Changes

- Formalize the `field-team` relationship capability with spec-level requirements for creating, querying (with count), managing associations with `teamsId`/`fieldsId`, and removing only pivot references (not teams/fields).
- Define the pivot behavior: a field may have many teams, and a team may belong to many fields, managed through `FieldTeam`.

## Capabilities

### New Capabilities
- `field-team`: Defines the many-to-many association between fields (`fields`) and teams (`teams`) through the `field_team` pivot table, including creation, listing, and removal of associations.

### Modified Capabilities
- `field-management`: Updated query to include team count and `permalink`; creation/update now accepts `teamsId`; delete removes only pivot refs.
- `team-management`: Updated to allow `fieldsId` in updates; query includes associated fields with `id`, `name`, `permalink`.

## Impact

- Entidad `Field` — relación con `FieldTeam`
- Entidad `Team` — relación con `FieldTeam`
- Entidad pivote `FieldTeam`
- Migración existente para la tabla `field_team`
