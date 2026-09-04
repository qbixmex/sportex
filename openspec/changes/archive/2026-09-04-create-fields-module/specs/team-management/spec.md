## ADDED Requirements

### Requirement: Asociar canchas a un equipo
El sistema SHALL permitir asociar a cada equipo una o varias canchas (`fields`) a través de la tabla pivote `FieldTeam`. Un equipo MAY tener cero o más canchas asociadas, y una cancha MAY ser utilizada por cero o más equipos. Al consultar un equipo, el sistema SHALL incluir sus canchas asociadas si las tiene, exponiendo solo el `id` y el `name` de cada cancha.

#### Scenario: Crear equipo con canchas
- **WHEN** se envía una solicitud de creación de un equipo con una o varias canchas asociadas
- **THEN** el equipo queda asociado a esas canchas

#### Scenario: Crear equipo sin canchas
- **WHEN** se envía una solicitud de creación de un equipo sin canchas asociadas
- **THEN** el equipo se crea sin canchas asociadas

#### Scenario: Consultar equipo con sus canchas
- **WHEN** se consulta un equipo que tiene canchas asociadas
- **THEN** el sistema devuelve las canchas asociadas, exponiendo solo `id` y `name` de cada una
