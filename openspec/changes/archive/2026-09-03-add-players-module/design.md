## Context

La plataforma ya tiene módulos para usuarios, equipos, torneos y categorías. El módulo de equipos (`src/teams/`) es la referencia más cercana: tiene relaciones ManyToOne con Tournament y Category, enums, y tests unitarios. No existe código de jugadores en ningún lado del proyecto.

## Goals / Non-Goals

**Goals:**
- Crear un módulo CRUD completo para jugadores siguiendo las convenciones establecidas
- Establecer la relación bidireccional Player ↔ Team
- Mantener consistencia con los patrones existentes (service con CommonService, controller con auth y versioning, DTOs con class-validator)

**Non-Goals:**
- No se implementan estadísticas de jugadores
- No se agregan campos de posición o posición de juego
- No se modifica la lógica de autenticación ni roles
- No se agregan endpoints de búsqueda avanzada

## Decisions

### Entidad Player con FK opcional a Team
**Decisión**: El `teamId` es opcional (nullable) para permitir crear jugadores sin equipo asignado.
**Alternativa descartada**: Hacer `teamId` requerido — limitaría la creación de jugadores nuevos antes de asignarlos a un equipo.

### Relación bidireccional Player ↔ Team
**Decisión**: Agregar `@OneToMany` en Team entity para que al consultar un equipo se incluyan sus jugadores. La eliminación de un equipo no elimina sus jugadores (`onDelete: 'SET NULL'`).
**Alternativa descartada**: `onDelete: 'CASCADE'` — perdería datos de jugadores al eliminar un equipo.

### Seguir el patrón del módulo Teams
**Decisión**: Usar el módulo Teams como plantilla principal. El servicio inyectará repositorios de Player y Team, usará `CommonService.handleExceptions`, y el controlador tendrá `@Auth(VALID_ROLES.ADMIN)` a nivel de clase.
**Razón**: Consistencia con el resto del códigobase y menor curva de aprendizaje para el equipo.

### Migración generada vía TypeORM
**Decisión**: Generar la migración con `bun run migration:generate --name=create_players_table` en lugar de escribirla a mano.
**Razón**: TypeORM genera la migración comparando la entidad con el estado actual de la DB, reduciendo errores humanos.

## Risks / Trade-offs

- [Riesgo] La tabla `players` crece con el tiempo → **Mitigación**: Paginación ya implementada en el servicio, misma patrón que Teams
- [Riesgo] Eliminar un equipo pone `team_id` nulo en sus jugadores → **Mitigación**: Es el comportamiento esperado; los jugadores quedan sin equipo pero no se pierden
- [Trade-off] No hay restricción de unicidad en el nombre del jugador → **Aceptado**: Los jugadores pueden tener el mismo nombre en distintos equipos, similar a los equipos
