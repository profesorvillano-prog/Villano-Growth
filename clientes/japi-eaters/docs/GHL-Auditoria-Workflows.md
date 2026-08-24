# Auditoría — Workflows GoHighLevel (agosto 2026)

> Análisis de los **17 workflows publicados** de la subcuenta Japi Eaters
> (`kdmmFxEbJjSpgMtbaZ6F`), carpetas `[ADS] Anuncios Facebook` y
> `[ORG] Instagram Orgánico`, contrastados contra la nueva arquitectura de
> **4 pipelines**. Inventario relevado en modo lectura el 24-08-2026.
> El rediseño completo está en [`GHL-Blueprint-4-Pipelines.md`](./GHL-Blueprint-4-Pipelines.md).

## Estado actual en una frase

Los workflows cubren bien **calificación → agenda → confirmación → recordatorios →
handoff al closer**, pero fueron diseñados para la estructura vieja de pipelines:
escriben a etapas que ya no son el camino principal, **no tocan ninguna de las
etapas nuevas** de ②/③/④ (Sin Confirmar, Confirmada, Diagnóstico, Día de Llamada,
Re-Agendar, Follow Up, Asistió, No-Show, Reserva, Seguimiento, y todo ④ Cobros),
no asignan responsables, y tienen 6 defectos que hoy pierden leads o ensucian métricas.

## Pipelines vivos hoy

| Pipeline | Dueño | Estado |
|---|---|---|
| ① Instagram · Setter [Valen] | Valen | **Nuevo** (14-08). Sin ningún workflow conectado. |
| ② Agenda · WhatsApp [Anaís] | Anaís | Activo. Los workflows ADS escriben en 5 de sus 11 etapas. |
| ③ Llamadas · Closer [Rafa] | Rafa | Activo. Solo recibe creación en Llamada Confirmada; las otras 6 etapas se mueven a mano. |
| ④ [VENTAS] Cobros | Rafa/Seba | **Sin ninguna automatización.** |
| [SETTER - ORG] Formación | — | **Legacy.** Los 5 workflows ORG aún escriben aquí. A migrar y retirar. |

---

## Hallazgos priorizados

### P0 — Pierden leads o datos hoy mismo

| # | Hallazgo | Efecto | Corrección |
|---|---|---|---|
| 1 | **[ADS] 1**: nodo *Crear en Descalificada* con `pipeline stage` **vacío** (marcado en error). | Cada lead ADS "no invierte" crea una oportunidad huérfana sin etapa. | Crear en ② / *Calificada (Formulario)* con **status `lost`** y lost reason `Inversión`. El reporte de lost reasons la captura sin ensuciar el Kanban. |
| 2 | **Waits de 9999 días** en *Envío [Purchase]* (9 activos) y *Envío [Schedule]* (206 activos). | 215 contactos retenidos para siempre; el workflow no puede re-inscribirlos (re-agendas no envían nuevo evento a Meta). | Borrar los waits (el workflow termina tras el envío CAPI), activar *Allow re-entry*, y liberar a los 215 activos con bulk *Remove from workflow*. |
| 3 | **[ORG] 2 · Agenda + Ghost sin trigger `tier-bronce`** (el de ADS sí lo tiene). | Ningún lead bronce orgánico recibe follow-up de agenda: fuga silenciosa del tier más numeroso. | Añadir el tercer trigger `Tag added = tier-bronce`. |
| 4 | **[ADS] 5 / [ORG] 5 borran TODAS las oportunidades** del contacto en el pipeline de origen al pasar al closer. | Se destruye el historial del funnel del setter: imposible medir conversión por etapa de ② a posteriori. | Reemplazar *Remove opportunity* por *Update opportunity → status `won`*. El funnel de ② queda medible; el tablero se limpia filtrando por status Open. |
| 5 | **CAPI Purchase con valor fijo 1.500 USD.** | Meta optimiza con un valor falso (precio real $1.250, y hay planes de cuotas). | Enviar el **valor de la oportunidad** (`{{opportunity.lead_value}}`) en el evento Purchase. |
| 6 | **Etapas nuevas sin automatización** (ver tabla de pipelines). | Anaís y Rafa mueven tarjetas a mano o las etapas quedan muertas → funnel report mentiroso. | Workflows nuevos del blueprint (②-3, ②-4, ③-1 a ③-5, ④-1 a ④-3). |

### P1 — Fugas de conversión y atribución

| # | Hallazgo | Corrección |
|---|---|---|
| 7 | **Ghost de un solo toque**: [ADS] 2 / [ORG] 2 envían 1 WhatsApp a las 2 h y nada más. | Secuencia multi-toque (2 h / 24 h / 72 h) con **goal de salida** al agendar (blueprint ②-2). |
| 8 | **[ORG] 2 envía la plantilla `ghost_agenda_ads`** al tráfico orgánico. | Crear `ghost_agenda_org` con copy para quien vino de Instagram, no de un anuncio. |
| 9 | **Ramas duplicadas** en [ADS] 3 / [ORG] 3: *Branch* y *None* de "No toma decisión" ejecutan lo mismo. | Aprovechar la rama: si decide en pareja, mensaje que **invite a la pareja a la llamada** (sube show y close rate). Si no, eliminar el if/else. |
| 10 | **[ADS] 4 y Envío [Lead] CAPI sin filtro de tag**: cualquier booking en el calendario [A] dispara recordatorios y envía `Lead` a Meta aunque el contacto no venga de ads. | Añadir filtro `Has tag = lead-ads` a ambos. |
| 11 | **Ninguna oportunidad se asigna a un usuario.** | *Assign to user* en cada creación: ① Valen, ② Anaís, ③/④ Rafa (blueprint §Responsables). |
| 12 | **No-shows invisibles**: no existe trigger de *Appointment status = no_show / showed*. | Workflows ③-1 (asistencia) y ③-2 (recuperación) del blueprint. |
| 13 | **④ Cobros sin conexión con pagos** (Hotmart/Stripe). | Workflows ④-1/④-2/④-3 + puente Make para eventos Hotmart. |

### P2 — Higiene y mantenibilidad

| # | Hallazgo | Corrección |
|---|---|---|
| 14 | [ORG] 5 se llama "Mover de **Setter-ADS**" pero opera sobre el pipeline orgánico. | Renombrar según convención del blueprint (`[②→③] Handoff Closer`). |
| 15 | Canales Slack duplicados: `5-confirmaciones-llamadas` vs `6-confirmaciones-llamadas`; `1-leads-conflicto` vs `leads-conflictos`. | Consolidar según el mapa de canales del blueprint; archivar los duplicados. |
| 16 | [ORG] 1 y [SETTER - ORG] 1 son casi idénticos (cambia el survey y un tag). | Mantener ambos triggers pero como **una sola familia** con spec compartida; a futuro, un workflow con 2 triggers. |
| 17 | Pipeline legacy [SETTER - ORG] Formación coexiste con la nueva arquitectura; sus probabilidades de etapa son incoherentes (Descalificada = 90,91 %). | Migrar los 5 workflows ORG para escribir en ② y retirar el pipeline (blueprint §Fase 4). |
| 18 | Esperas "NO BOT" de 3-5 min con el video selfie viven dentro de [ADS] 3 / [ORG] 3, mezclando confirmación con nurture. | Se mantienen (funcionan), pero documentadas en la spec de ②-3 para no perderlas en la migración. |

## Lo que sí está bien (no tocar sin motivo)

- La **calificación por tier** (profesión → nivel de inversión → tier + producto
  recomendado + Slack por canal de tier) es sólida y queda igual en el blueprint.
- Los **recordatorios 24 h / 4 h / 1 h + aviso al closer 35 min antes** funcionan;
  solo cambian las etapas de destino.
- El patrón **confirmación por botón de WhatsApp** con ramas
  Confirmar / Undelivered / Time Out es correcto; se le añade el movimiento a las
  etapas nuevas *Sin Confirmar* / *Confirmada (Agenda)*.
- Los workflows **4.1 de cancelación** que frenan recordatorios; se amplían para
  además mover la tarjeta a *Re-Agendar (Cancelada)* y disparar la re-agenda.

## Números de referencia del inventario

- 17 workflows publicados; 2.163 enrollments acumulados; 221 contactos activos
  (215 de ellos atrapados por los waits de 9999 días → hallazgo #2).
- 20 tags escritos, 8 leídos en condiciones; campos `Tier Score` y
  `Producto Recomendado` como únicos custom fields escritos.
- Un único número emisor de WhatsApp (+52 1 984 404 6192) y 6 plantillas.
