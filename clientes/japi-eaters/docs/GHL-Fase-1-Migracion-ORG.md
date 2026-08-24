# Fase 1 — Migración ORG a la autopista nueva (guía de ejecución)

> **Modelo simplificado (decisión 24-08):** todo lo orgánico pre-agenda vive en
> **① Instagram · Setter [Valen]** — link bio y setter por igual. El pipeline
> **② Agenda · WhatsApp [Anaís]** arranca en *Calificada (Formulario)* **solo
> con ADS**; las ORG entran a ② recién al **agendar**, por *Nueva Agenda*.
> El puente es [ORG] 3: al agendar cierra ① como **Agendada / Won** (el win de
> Valen) y crea la tarjeta de ② en **Nueva Agenda / Open** (el turno de Anaís).
> Requiere la [Fase 0](./GHL-Fase-0-Quick-Fixes.md) completada.

| Lead | Pre-agenda | Al agendar | Post-agenda |
|---|---|---|---|
| ADS | ② desde Calificada (Formulario) | ② Nueva Agenda | ② → ③ → ④ |
| ORG (link bio y setter) | ① (Valen) | ① Agendada **Won** + ② Nueva Agenda | ② → ③ → ④ |

---

## Paso A — Repuntar los workflows ORG (6 ediciones)

Publica cada workflow al terminar su edición, en este orden.

### A1 · [ORG] 1 · Calificación — ID `c98e6ba6`

1. Nodo **Crear en Descalificada** → Pipeline `①`, Stage **Descalificada**,
   Status **Lost**, Lost reason `Inversion`. *(① tiene etapa Descalificada
   propia — mejor que ensuciar ②.)*
2. Los 3 nodos **Crear Oportunidad [ORG] Formación - Formulario** (Bronce /
   Silver / Gold) → Pipeline `①`, Stage **Formulario Completado**, Status
   **Open**, Owner **Valen**, sin valor.

### A2 · [SETTER - ORG] 1 · Calificación — ID `8439135d`

- Mismas 4 ediciones que A1 (Descalificada + 3 tiers → ①). Para las leads que
  Valen ya venía trabajando en ①, el create/update solo avanza su tarjeta a
  *Formulario Completado*; para las de link bio, la crea ahí directamente.

### A3 · [ORG] 2 · Agenda + Ghost — ID `851e8b99`

- Nodo **Cambiar a Ghost Agenda** → Pipeline `①`, Stage **Seguimiento**,
  Status **Open**. *(El ghost orgánico se trabaja en el tablero de Valen, no
  en el de Anaís — coherente con "② solo recibe ORG agendadas".)*
- El WhatsApp de ghost y el Slack quedan igual (más el trigger `tier-bronce`
  del Fix 3).

### A4 · [ORG] 3 · Confirmación — ID `4a74420d` ✅ ya editado

Como quedó armado:

1. Nodo 1 (ex "Cambiar a Nueva Agenda") → Pipeline `①`, Stage **Agendada**,
   Status **Won**. Renombrarlo a `Cerrar ① Agendada (Won)` para que el canvas
   se lea solo. Añadir Owner **Valen** si el campo está disponible.
2. Nodo 3 (Create or update opportunity) → Pipeline `②`, Stage **Nueva
   Agenda**, Status **Open**. Renombrar a `Crear ② Nueva Agenda` y añadir
   Owner **Anaís**.
3. En el nodo **Remove Tag**: dejar solo `agenda-ads` — quitar `lead-ads` de
   la lista (la fuente no se borra nunca). Espejo en [ADS] 3: dejar solo
   `agenda-org` (quitar `lead-org` y `lead-setter-org`).

**Edge case a cubrir:** el trigger es "booking en calendario [ORG]" sin filtro
de tag. Si una lead **de ADS** re-agenda por el calendario orgánico (pasa: por
eso existía el swap de tags), el nodo 1 le crearía una tarjeta **Won en ①** que
infla la métrica de Valen. Cobertura: envolver el nodo 1 en un **If/else →
Tags NOT include `lead-ads`** (rama SI: cerrar ①; rama None: saltar directo al
Remove Tag). El nodo de ② sí corre para todas.

### A5 · [ORG] 4 · Recordatorios — ID `5296147d`

- Nodo **Cambiar a Llamada en Preparación** → Pipeline `②`,
  Stage **Pre-Llamada (Preparación)**. *(Post-agenda = territorio de Anaís.)*

### A6 · Handoff único — [ADS] 5 absorbe a [ORG] 5

El trigger de [ADS] 5 (`8ab3d347`) es "② / Llamada Confirmada" **sin filtro de
tag**: con las ORG entrando a ② al agendar, hace el handoff de ambas fuentes.

1. Renombrar [ADS] 5 a `[②] 5 · Handoff Closer (ADS + ORG)` y revisar que el
   Slack no diga «ads» (canal `#6-confirmaciones-llamadas` para todo).
2. **[ORG] 5** (`c0eead4d`): pasar a **Draft** (no borrar todavía).

---

## Paso B — Migrar las oportunidades abiertas del legacy

Opportunities → `[SETTER - ORG] Formación` → filtro **Open**, por etapa
(bulk edit si está disponible; si no, a mano — el volumen es bajo).
Las que van a ① → owner Valen; las que van a ② → owner Anaís.

| Etapa legacy | → Destino |
|---|---|
| Formulario [ORG] | ① Formulario Completado |
| Primer Contacto | ① Formulario Completado |
| Ghost - Primer Contacto | ① Seguimiento |
| Ghost Intento Agenda | ① Seguimiento |
| Follow Up | ① Seguimiento |
| Nuevas Agendas | ② Nueva Agenda |
| Llamada Preparación | ② Pre-Llamada (Preparación) |
| Cancelada (Re-Agendar) | ② Re-Agendar (Cancelada) |
| Descalificada | **No migrar**: bulk status → Lost y se quedan en el legacy |
| Llamada Confirmada | ⚠ ver nota |

> ⚠ **Llamada Confirmada**: mover una tarjeta a ②/Llamada Confirmada dispara el
> handoff (crea en ③ + Slack). Revisar una por una: si el contacto **ya tiene**
> oportunidad en ③ → marcar la del legacy Won y no mover; si no la tiene →
> mover a ② y dejar que el handoff corra.

Las Won/Lost históricas **se quedan en el legacy** como registro.

---

## Paso C — Retirar el legacy (sin borrar)

1. Renombrar el pipeline a `zz [RETIRADO] Setter ORG` y desmarcar
   *Show in funnel* / *Show in pie chart*.
2. **No borrarlo**: en GHL, eliminar un pipeline **elimina sus oportunidades**
   y el histórico. Se borra recién en unos meses.
3. Archivar el canal Slack `5-confirmaciones-llamadas` (el handoff reporta en
   `#6-confirmaciones-llamadas`).

---

## Métricas con el modelo simplificado

- **Valen (①):** win rate = Agendada (Won) / tarjetas creadas. Su funnel
  completo: Bienvenidas → … → Formulario Completado → Agendada.
- **Anaís (②):** para ADS mide desde *Calificada (Formulario)*; para ORG mide
  desde *Nueva Agenda*. Al comparar fuentes, usar la tasa **agenda → llamada
  confirmada** (existe para ambas); la tasa formulario → agenda de ORG se lee
  en ①.

## QA — carril ORG de punta a punta (10 min)

1. Contacto de prueba completa `[SURVEY - ORG SETTER]` con tier Silver → tarjeta
   en ① **Formulario Completado (Open, Valen)**; **nada en ②** ni en el legacy.
2. Sin agendar 2 h → ① **Seguimiento** + WhatsApp ghost.
3. Agenda en calendario [ORG] → ① **Agendada / Won** y ② **Nueva Agenda
   (Open, Anaís)** + Slack #4.
4. Mover ② a *Llamada Confirmada* → se crea en ③ (owner Rafa, value 1250),
   la de ② queda Won, Slack #6, un solo workflow disparó.
5. Legacy con 0 oportunidades Open.
6. Borrar/taggear `test` el contacto de prueba.

| ✔ | Paso |
|---|---|
| ☐ | A1 · [ORG] 1 → ① (Formulario Completado / Descalificada) |
| ☐ | A2 · [SETTER - ORG] 1 → ① |
| ☐ | A3 · [ORG] 2 ghost → ① Seguimiento |
| ☐ | A4 · [ORG] 3 puente ①→② ✅ + if/else lead-ads + tags |
| ☐ | A5 · [ORG] 4 → ② Pre-Llamada |
| ☐ | A6 · Handoff unificado + [ORG] 5 a draft |
| ☐ | B · Migración de abiertas (tabla nueva) |
| ☐ | C · Legacy oculto, canal archivado |
| ☐ | QA · Carril ORG completo |
