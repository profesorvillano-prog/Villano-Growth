# Fase 1 — Migración ORG a la autopista nueva (guía de ejecución)

> Objetivo: que el flujo orgánico deje de usar el pipeline legacy
> `[SETTER - ORG] Formación` y viva en la autopista nueva:
> **① Instagram · Setter [Valen]** (prospección pre-survey) →
> **② Agenda · WhatsApp [Anaís]** (donde caen las calificadas de ORG y las de ADS).
> Requiere la [Fase 0](./GHL-Fase-0-Quick-Fixes.md) completada.
> Tiempo estimado: **60-90 min**.

## La lógica de destino

| Lead | Entra por | Cae en |
|---|---|---|
| ADS | Survey [SURVEY - ADS] | ② directo (ya funciona así) |
| ORG link bio | Survey [SURVEY - ORG] | ② directo (hoy cae al legacy → se repunta) |
| ORG setteada por Valen | Survey [SURVEY - ORG SETTER] | ② + su tarjeta en ① se cierra como Won |

① es solo de Valen y pre-survey: ella trabaja a mano Bienvenidas → CTA → Link
Enviado; la tarjeta se cierra sola cuando la lead completa el survey del setter.
② queda como el único pipeline de agenda, con la fuente marcada por tags.

---

## Paso A — Repuntar los workflows ORG a ② (6 ediciones)

Publica cada workflow al terminar su edición, en este orden.

### A1 · [ORG] 1 · Calificación — ID `c98e6ba6`

1. Nodo **Crear en Descalificada** → cambiar a: Pipeline `②`, Stage
   **Calificada (Formulario)**, Status **Lost**, Lost reason `Inversion`
   (queda idéntico al de [ADS] 1 tras el Fix 4).
2. Los 3 nodos **Crear Oportunidad [ORG] Formación - Formulario** (Bronce,
   Silver, Gold) → cambiar a: Pipeline `②`, Stage **Calificada (Formulario)**,
   sin valor monetario, y si el nodo lo permite, **Opportunity owner = Anaís**.

### A2 · [SETTER - ORG] 1 · Calificación — ID `8439135d`

1. Mismas 4 ediciones que A1 (nodo Descalificada + 3 nodos de tier → ②).
2. **Extra — cierre de la tarjeta de Valen**: después de la acción 1 (tags),
   añadir **Create/Update Opportunity** → Pipeline `① Instagram · Setter [Valen]`,
   Stage **Formulario Completado**, Status **Won**, Owner **Valen**, sin valor.
   Así, cuando una lead setteada completa el survey, la tarjeta de Valen se
   cierra como ganada automáticamente. *(Solo en este workflow: el survey del
   setter es, por definición, lead trabajada por Valen. Las de link bio no
   tocan ①.)*

### A3 · [ORG] 2 · Agenda + Ghost — ID `851e8b99`

- Nodo **Cambiar a Ghost Agenda** → Pipeline `②`, Stage **Sin Agendar (Ghost)**.

### A4 · [ORG] 3 · Confirmación — ID `4a74420d`

- Nodo **Cambiar a Nueva Agenda** → Pipeline `②`, Stage **Nueva Agenda**.
- Aprovechar: en el nodo **Remove Tag**, quitar de la lista `lead-ads`
  (dejar solo `agenda-ads`). La fuente no se borra nunca. Hacer el espejo en
  [ADS] 3: dejar solo `agenda-org` (no `lead-org` ni `lead-setter-org`).

### A5 · [ORG] 4 · Recordatorios — ID `5296147d`

- Nodo **Cambiar a Llamada en Preparación** → Pipeline `②`,
  Stage **Pre-Llamada (Preparación)**.

### A6 · Handoff único — [ADS] 5 absorbe a [ORG] 5

El trigger de [ADS] 5 (`8ab3d347`) es "② / Llamada Confirmada" **sin filtro de
tag**, así que en cuanto las ORG vivan en ②, ese workflow hace el handoff de
ambas fuentes solo.

1. En [ADS] 5: renombrar a `[②] 5 · Handoff Closer (ADS + ORG)` y revisar que
   el mensaje de Slack no diga "ads" (va al canal `#6-confirmaciones-llamadas`
   para todo).
2. **[ORG] 5** (`c0eead4d`): pasar a **Draft / despublicar** (no borrar todavía;
   se elimina cuando el legacy quede vacío).

---

## Paso B — Migrar las oportunidades abiertas del legacy

En Opportunities → pipeline `[SETTER - ORG] Formación` → filtrar **status Open**
y mover por etapa según esta tabla (bulk edit si está disponible; si no, a mano
— el volumen es bajo):

| Etapa legacy | → Etapa en ② |
|---|---|
| Formulario [ORG] | Calificada (Formulario) |
| Ghost - Primer Contacto | Sin Agendar (Ghost) |
| Primer Contacto | Calificada (Formulario) |
| Ghost Intento Agenda | Sin Agendar (Ghost) |
| Follow Up | Follow Up |
| Nuevas Agendas | Nueva Agenda |
| Llamada Preparación | Pre-Llamada (Preparación) |
| Cancelada (Re-Agendar) | Re-Agendar (Cancelada) |
| Descalificada | **No migrar**: bulk status → Lost y se quedan en el legacy |
| Llamada Confirmada | ⚠ ver nota |

> ⚠ **Llamada Confirmada**: mover una tarjeta a ②/Llamada Confirmada dispara el
> handoff (crea tarjeta en ③ + Slack). Revisar una por una: si el contacto **ya
> tiene** oportunidad en ③, marcar la del legacy como Won y no moverla; si no
> la tiene, moverla a ② y dejar que el handoff corra (es lo deseado).

Las Won/Lost históricas **se quedan en el legacy** como registro.

---

## Paso C — Retirar el legacy (sin borrar)

1. Renombrar el pipeline a `zz [RETIRADO] Setter ORG` y desmarcar
   *Show in funnel* y *Show in pie chart*.
2. **No borrarlo**: en GHL, eliminar un pipeline **elimina sus oportunidades**
   y con ellas el histórico. Se borra recién cuando ya no se necesite consultar
   datos viejos (meses).
3. El canal Slack `5-confirmaciones-llamadas` queda sin emisor → archivarlo
   (todo el handoff reporta en `#6-confirmaciones-llamadas`).

---

## QA — probar el carril ORG completo (10 min)

1. Contacto de prueba completa el survey `[SURVEY - ORG SETTER]` con tier Silver
   → aparece en ② *Calificada (Formulario)* (no en el legacy) y, si tenía
   tarjeta en ①, quedó **Won / Formulario Completado**.
2. No agenda en 2 h → pasa a ② *Sin Agendar (Ghost)* + WhatsApp ghost.
3. Agenda en el calendario [ORG] → ② *Nueva Agenda* + Slack #4.
4. Mover a mano a ② *Llamada Confirmada* → se crea en ③ con owner Rafa y
   value 1250, la de ② queda Won, Slack #6. **Un solo workflow disparó** (el
   handoff unificado; [ORG] 5 está en draft).
5. Legacy: 0 oportunidades Open.
6. Borrar/taggear `test` el contacto de prueba.

| ✔ | Paso |
|---|---|
| ☐ | A1 · [ORG] 1 → ② |
| ☐ | A2 · [SETTER - ORG] 1 → ② + cierre de ① |
| ☐ | A3 · [ORG] 2 → ② Sin Agendar (Ghost) |
| ☐ | A4 · [ORG] 3 → ② Nueva Agenda + tags de fuente |
| ☐ | A5 · [ORG] 4 → ② Pre-Llamada |
| ☐ | A6 · Handoff unificado + [ORG] 5 a draft |
| ☐ | B · Migración de abiertas (tabla de mapeo) |
| ☐ | C · Legacy oculto/renombrado, canal archivado |
| ☐ | QA · Carril ORG completo |
