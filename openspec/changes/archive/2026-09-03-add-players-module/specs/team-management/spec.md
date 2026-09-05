## MODIFIED Requirements

### Requirement: Consultar equipos

El sistema SHALL permitir listar equipos con paginación y obtener un equipo individual por su identificador. Al listar equipos, el sistema SHALL incluir la cantidad de jugadores registrados por equipo. Al obtener un equipo individual, el sistema SHALL incluir sus jugadores asociados si los tiene, exponiendo solo el identificador y el nombre de cada jugador.

#### Scenario: Listar equipos paginado
- **WHEN** se solicita la lista de equipos con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de equipos, incluyendo la cantidad de jugadores registrados por equipo

#### Scenario: Obtener un equipo por identificador
- **WHEN** se solicita un equipo cuyo identificador existe
- **THEN** el sistema devuelve los datos de ese equipo, incluyendo su torneo, su categoría y sus jugadores asociados si los tiene, exponiendo solo el identificador y el nombre de cada jugador

#### Scenario: Obtener un equipo inexistente
- **WHEN** se solicita un equipo cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado