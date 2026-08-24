# Fase 0 — Quick Fixes GHL (guía de ejecución)

> Los 7 arreglos críticos de la [auditoría](./GHL-Auditoria-Workflows.md), listos
> para ejecutar a mano en GoHighLevel. Subcuenta **Japi Eaters**
> (`kdmmFxEbJjSpgMtbaZ6F`) → Automation → Workflows → HIGH TICKET FUNNEL → Marketing.
> Tiempo estimado total: **30-40 min**.

## Antes de empezar

- **Riesgo bajo**: ninguno de los 7 fixes toca nodos de WhatsApp/SMS/Email —
  ningún lead recibirá mensajes por estos cambios.
- Cada fix es independiente: guarda y **publica** uno antes de pasar al siguiente.
- Si un panel no coincide con lo descrito aquí, detente en ese fix y sigue con el resto.
- Orden recomendado: el de esta guía (empieza por los triviales, termina en los CAPI).

---

## Fix 1 · Filtro `lead-ads` en Envío [Lead] — 2 min

**Workflow:** `Envío [Lead] a Llamadas Agendadas [ADS]` · carpeta [ADS] › API Conversiones
· ID `c3e365ba-550e-4840-b6b1-befdcce9caeb`

**Problema:** manda el evento *Lead* a Meta por cualquier agenda del calendario [A],
venga de ads o no → ensucia la atribución de campañas.

1. Abrir el workflow → clic en el disparador **Customer Booked Appointment**.
2. **Add filters** → `Has tag` → `lead-ads`.
3. Save trigger → **Save** → **Publish**.

**Verificar:** el trigger muestra 2 filtros: In calendar = [A]… **y** Has tag = lead-ads.

---

## Fix 2 · Filtro `lead-ads` en [ADS] 4 · Recordatorios — 2 min

**Workflow:** `[ADS] 4 · Recordatorios` · carpeta [ADS] · ID `825f4e87-319f-42c0-b345-40824c41910a`

**Problema:** cualquiera que agenda en el calendario [A] entra a los recordatorios
de ADS aunque no venga de anuncios.

1. Abrir el disparador **Customer Booked Appointment**.
2. **Add filters** → `Has tag` → `lead-ads`.
3. Save trigger → **Save** → **Publish**.

**Verificar:** mismo aspecto que el trigger de `[ADS] 3` (que ya tiene ese filtro).

---

## Fix 3 · Trigger `tier-bronce` en [ORG] 2 — 2 min

**Workflow:** `[ORG] 2 · Agenda + Ghost` · carpeta [ORG] · ID `851e8b99-a23c-44c3-b873-f5ee439061df`

**Problema:** solo dispara con `tier-silver` y `tier-gold` → los leads **bronce
orgánicos jamás reciben el seguimiento de agenda** (fuga silenciosa del tier más numeroso).

1. En la zona de disparadores → **Add New Trigger** → `Contact Tag`.
2. Filtro: `Tag added` → `includes` → `tier-bronce`.
3. Save trigger → **Save** → **Publish**.

**Verificar:** 3 triggers (bronce, silver, gold), igual que `[ADS] 2`.

---

## Fix 4 · Etapa vacía en [ADS] 1 (nodo en error) — 3 min

**Workflow:** `[ADS] 1 · Calificación (Survey → Tier)` · carpeta [ADS]
· ID `834de977-2078-4aae-bc2b-07fc3646d8d9`

**Problema:** el nodo **Crear en Descalificada** (rama *No invierte*) tiene el
`pipeline stage` vacío y está marcado en error → crea oportunidades huérfanas sin etapa.

1. Abrir el nodo ⚠ **Crear en Descalificada**.
2. Configurar: Pipeline `② Agenda · WhatsApp [Anaís]` · Stage **Calificada (Formulario)**
   · Status **Lost** · Lost reason `Inversion` (ya está puesto).
3. Save action → **Save** → **Publish**.

**Verificar:** el nodo ya no muestra el triángulo de error en el canvas.

> Nota: se usa *Calificada (Formulario)* + status **Lost** porque ② no tiene etapa
> Descalificada. Al estar Lost no aparece entre las abiertas del Kanban y el reporte
> de *lost reasons* la captura igual.

---

## Fix 5 · Handoff sin borrar + asignar a Rafa ([ADS] 5 y [ORG] 5) — 8 min

**Workflows:**
- `[ADS] 5 · Mover de Setter-ADS → Closer + Slack` · ID `8ab3d347-7826-403a-ac59-834b40e416c7`
- `[ORG] 5 · Mover de Setter-ADS → Closer + Slack` · ID `c0eead4d-18d2-4f65-9dd1-d7982e60297a`

**Problema:** al pasar el lead al closer, **borran todas las oportunidades** del
pipeline de origen → destruyen el historial y el funnel del setter queda inmedible.
Además nadie queda asignado como responsable en ③.

En **cada uno** de los dos workflows:

1. Nodo **Create Or Update Opportunity** (el que crea en ③ *Llamada Confirmada*):
   añadir **Opportunity owner** = **Rafa**. Save.
2. **Eliminar** el nodo `Eliminar de Pipeline Setter-Ads` (Remove opportunity).
3. En su lugar, añadir acción **Create/Update Opportunity** sobre el pipeline de origen:
   - En [ADS] 5 → Pipeline `② Agenda · WhatsApp [Anaís]`, Stage `Llamada Confirmada`, Status **Won**.
   - En [ORG] 5 → Pipeline `[SETTER - ORG] Formación`, Stage `Llamada Confirmada`, Status **Won**.
4. **Save** → **Publish**.
5. Solo en [ORG] 5: renombrar el workflow a `[ORG] 5 · Mover de Setter-ORG → Closer + Slack`
   (hoy dice "Setter-ADS" y confunde).

**Verificar:** la secuencia queda: crear en ③ (owner Rafa) → marcar origen Won → Slack.
Ningún nodo "Remove opportunity" queda en el workflow.

---

## Fix 6 · Envío [Schedule]: quitar waits de 9999 días — 5 min

**Workflow:** `Envío [Schedule] a Llamadas Confirmadas [ADS]` · [ADS] › API Conversiones
· ID `9f8d6a2c-1929-459a-b39e-0453ad7bb3fc`

**Problema:** dos waits de 9999 días retienen **206 contactos** dentro del workflow
para siempre; nadie puede re-entrar, así que las re-agendas no reportan *Schedule* a Meta.

1. Eliminar el nodo **Wait — Lead Ads → 9999 days** (rama Branch).
2. Eliminar el nodo **Wait — Lead Org → 9999 days** (rama None).
3. En Settings del workflow: **Allow re-entry** (permitir múltiples entradas).
4. **Save** → **Publish**.
5. Liberar a los atrapados: pestaña **Enrollment History** → filtrar Active (206)
   → seleccionar todos → **bulk action: Remove from workflow**.

**Verificar:** 0 contactos activos. (Es seguro: este workflow solo envía eventos a
Meta, no mensajes; sacarlos no dispara nada.)

---

## Fix 7 · Envío [Purchase]: wait 9999 + valor real — 5 min

**Workflow:** `Envío [Purchase] en cambio Lead → Ventas High Ticket` · [ADS] › API Conversiones
· ID `b32d69b5-371b-4c57-84f8-3ad1f9e63a99`

**Problema:** (a) wait de 9999 días retiene 9 contactos; (b) reporta a Meta un valor
fijo de **1.500 USD** cuando el programa vale $1.250 (y hay cuotas) → Meta optimiza
con datos falsos.

1. Eliminar el nodo **Wait → 9999 days** (después del envío CAPI).
2. En el nodo **Enviar evento de conversión a Facebook**: campo *value* → borrar `1.500`
   e insertar el custom value del **valor de la oportunidad**
   (`{{opportunity.lead_value}}` / Opportunity → Lead value). Currency queda USD.
3. Settings del workflow: **Allow re-entry**.
4. **Save** → **Publish**.
5. **Enrollment History** → los 9 activos → **Remove from workflow**.

**Verificar:** 0 activos; el nodo CAPI muestra la variable, no el número fijo.

---

## Cierre — prueba de humo (5 min)

1. Contacto de prueba propio: completar el survey `[SURVEY - ADS]` respondiendo
   *"No puedo invertir"* → debe aparecer en ② como **Lost / Inversion** en
   *Calificada (Formulario)*, sin nodos en error.
2. Revisar que los 17 workflows sigan en estado **Published**.
3. Borrar el contacto de prueba (o taggearlo `test`).

| ✔ | Fix | Workflow |
|---|---|---|
| ☐ | 1 | Envío [Lead] — filtro lead-ads |
| ☐ | 2 | [ADS] 4 — filtro lead-ads |
| ☐ | 3 | [ORG] 2 — trigger tier-bronce |
| ☐ | 4 | [ADS] 1 — etapa vacía → Lost |
| ☐ | 5 | [ADS] 5 y [ORG] 5 — Won en vez de borrar + owner Rafa |
| ☐ | 6 | Envío [Schedule] — waits + liberar 206 |
| ☐ | 7 | Envío [Purchase] — wait + valor real + liberar 9 |
| ☐ | — | Prueba de humo |

Cuando esté todo marcado, la Fase 0 está cerrada y se puede arrancar la
**Fase 1** (pipeline ② completo) del [blueprint](./GHL-Blueprint-4-Pipelines.md).
