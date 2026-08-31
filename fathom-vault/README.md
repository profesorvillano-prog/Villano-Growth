# Fathom Vault — Profesor Villano

Transcripciones completas de **clases de Marketing** de Sebastián Escudero (Profesor Villano),
extraídas desde Fathom. Pensado como base de conocimiento para Claude, igual que el `loom-vault`.

- **Periodo:** 1 de septiembre de 2025 → 31 de agosto de 2026 (últimos 12 meses)
- **Transcripciones incluidas:** 242
- **Grabaciones revisadas en total:** 412
- **Grabaciones descartadas:** 170 (ver `EXCLUIDOS.md`)

Empieza por **[INDEX.md](INDEX.md)** — ahí está todo listado por categoría y por mes.

## Estructura

```
fathom-vault/
├── README.md                 ← este archivo
├── INDEX.md                  ← índice completo por categoría y mes
├── EXCLUIDOS.md              ← las 170 grabaciones descartadas y por qué
├── clases-grupales/          ← 42 archivos
├── mentorias-alumnos/        ← 72 archivos
└── sesiones-clientes/        ← 128 archivos
```

Cada archivo se llama `AAAA-MM-DD--tema.md` y trae front-matter en YAML:

```yaml
---
titulo: "Clase — Escalera de valor (low, mid, high) y onboarding al software"
fecha: 2025-10-19
fuente: Fathom
recording_id: 95163399
call_id: 446510320
url: https://fathom.video/calls/446510320
categoria: clases-grupales
---
```

Debajo va la transcripción íntegra con marcas de tiempo enlazadas al minuto exacto
de la grabación en Fathom.

## Las tres categorías

| Carpeta | Qué contiene |
|---|---|
| `clases-grupales` | Masterclasses, talleres, inducciones y Q&A a grupos de alumnos (trainers, mentores). |
| `mentorias-alumnos` | Mentorías 1-a-1 recurrentes enseñando marketing a un alumno: Gianluca, Paul, Andrés, Daniela, Rodrigo, Yann, Gian, Magaly… |
| `sesiones-clientes` | Sesiones de estrategia de marketing con clientes de la agencia: médicos (Doctor AI / Villano Growth), coaches y emprendedores. |

## Qué se dejó fuera

Se revisó grabación por grabación (por resumen de Fathom y, en los casos dudosos,
por transcripción) y se descartó lo que no es una clase:

- Reuniones internas de equipo (Org. Semanal, Métricas, SOP, dashboards)
- Contratación, entrevistas y onboarding de gente del equipo
- Llamadas de venta y prospección (propuestas, precios, cierres)
- Configuración técnica sin contenido de marketing
- Mentorías externas donde Sebastián es el alumno, no el profesor

El detalle completo, con `call_id`, fecha y motivo, está en `EXCLUIDOS.md`.

## Cómo usarlo con Claude

Sube la carpeta completa a un Proyecto de Claude. El `INDEX.md` le permite ubicar
rápido la clase correcta; el front-matter le da fecha, categoría y el enlace a la
grabación original para citar la fuente.
