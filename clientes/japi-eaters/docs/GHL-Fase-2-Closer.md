# Fase 2 — Pipeline ③ Llamadas · Closer [Rafa] (guía de ejecución)

> Automatiza el tramo llamada → venta: asistencia y no-show automáticos con
> recuperación, reserva con recordatorios de pago, cierre que crea la
> oportunidad en ④ y avisa a Anaís para onboarding, y seguimiento a los que
> asistieron sin cerrar. Requiere Fase 0 y 1 completadas y el canal
> `#7-closer-ventas` creado. Tiempo estimado: **2-3 h** de armado + plantillas
> de WhatsApp a aprobar en Meta (ver §Plantillas — pedirlas ANTES de empezar).

## Reparto: qué se mueve solo y qué mueve Rafa

| Etapa de ③ | Quién la mueve |
|---|---|
| Llamada Confirmada | Automático (Handoff 5, ya existe) |
| Asistió / No-Show Llamada / Re-Agendada | **Automático** (F2-1, F2-2, F2-3) |
| Reserva (Por Pagar) / Cerrada (Venta) / Seguimiento (Asistentes) | **Rafa a mano** — son decisiones de venta; los workflows reaccionan al movimiento |

---

## F2-0 · Remate pendiente de Fase 1: tag `en-closer` + Día de Llamada

1. En **[Handoff] 5**: añadir acción **Add tag → `en-closer`** (después de crear
   la opp en ③). Este tag marca "la lead ya es de Rafa".
2. En **[ADS] 4 y [ORG] 4** (recordatorios), en el punto de 4 h: añadir
   **If/else → Tags NOT include `en-closer`** y dentro de la rama SI el nodo
   **Create/Update Opportunity → ② / Día de Llamada / Open**; la rama None
   sigue con Go To al WhatsApp de 4 h. Así la etapa *Día de Llamada* por fin
   se mueve sola **sin reabrir** tarjetas que el Handoff ya marcó Won.
3. En **[ADS] 3 / [ORG] 3** (confirmación): al inicio, **Remove tag
   `en-closer`** si existe (una re-agenda devuelve la lead al carril de Anaís).

## F2-1 · `[③] 1 · Asistió` (nuevo, 4 nodos)

- **Trigger:** Appointment status → status is **showed** (2 triggers: calendario
  [A] y calendario [ORG]).
- **Acciones:**
  1. Create/Update Opportunity → `③` / **Asistió** / Open / Owner Rafa.
  2. Add tag → `asistio`.
  3. Slack `#7-closer-ventas`:
     `✅ ASISTIÓ — {{contact.first_name}} {{contact.last_name}} entró a la llamada · Tier {{contact.tier_score}} · 📱 {{contact.phone}}`

## F2-2 · `[③] 2 · No-Show + recuperación` (nuevo)

- **Trigger:** Appointment status → status is **no_show** (2 triggers, ambos
  calendarios). **Goal de salida: appointment booked** (si re-agenda, sale).
- **Acciones:**
  1. Create/Update Opportunity → `③` / **No-Show Llamada** / Open.
  2. Add tag → `no-show`.
  3. **DM Slack a Rafa**: `🔴 NO-SHOW — {{contact.first_name}} no entró. Recuperación automática iniciada · 📱 {{contact.phone}}`
  4. Slack `#7-closer-ventas`: mismo mensaje (el director lo ve).
  5. Wait 15 min → WhatsApp toque 1 (plantilla `noshow_recuperacion_1`):
     *"Hola {{first}}, te esperamos en la llamada y no pudiste entrar 🙈
     ¿Todo bien? Te guardo el cupo — responde y la reagendamos."*
  6. Wait 24 h → WhatsApp toque 2 (`noshow_recuperacion_2`): link de re-agenda.
  7. Wait 24 h → WhatsApp toque 3 (`noshow_recuperacion_3`): último aviso +
     **Task para Rafa** ("llamar a {{name}} — no-show sin recuperar").

## F2-3 · `[③] 3 · Re-agendada` (nuevo, 3 nodos)

- **Trigger:** Customer booked appointment (ambos calendarios) + filtro
  **Has tag = `no-show`**.
- **Acciones:** Create/Update `③` / **Re-Agendada** / Open → Remove tag
  `no-show` → Add tag `reagendada` → Slack `#7-closer-ventas`
  (`🔄 RE-AGENDÓ — {{contact.first_name}} tiene nueva llamada`).
- Los recordatorios de ②-4 corren solos con la nueva cita.

## F2-4 · `[③] 4 · Reserva por pagar` (nuevo)

- **Trigger:** Pipeline stage changed → In pipeline `③`, stage
  **Reserva (Por Pagar)**. **Goal de salida: stage `Cerrada (Venta)`** (pagó).
- **Acciones:**
  1. Slack `#7-closer-ventas`: `💰 RESERVA — {{contact.first_name}} por pagar · Rafa envió el link`
  2. Wait 24 h → WhatsApp recordatorio 1 (`reserva_recordatorio_1`):
     *"{{first}}, tu cupo sigue reservado ✨ Te dejo de nuevo el link para
     asegurarlo: {{link}}"*
  3. Wait 24 h → WhatsApp recordatorio 2 (`reserva_recordatorio_2`): urgencia
     suave (cupos/cohorte).
  4. Wait 24 h → **Task Rafa** ("Reserva sin pagar 72 h — llamar") + Slack
     `#7-closer-ventas` (`⚠️ Reserva de {{contact.first_name}} lleva 72 h sin pago`).
- El link de pago lo envía **Rafa en la llamada** (o aquí como acción 0 si se
  estandariza un link único).

## F2-5 · `[③] 5 · Cierre` (nuevo — el workflow más importante)

- **Trigger:** Pipeline stage changed → In pipeline `③`, stage **Cerrada (Venta)**.
- **Acciones:**
  1. Update Opportunity → `③` / Cerrada (Venta) / **Status Won** (Rafa ajustó
     antes el valor real si difiere de 1.250).
  2. Add tag → `cliente-activo`.
  3. **Create Opportunity → `④ [VENTAS] Cobros` / Cuota de Reserva / Open /
     Owner Rafa / Value = valor de la venta.**
  4. Slack `#7-closer-ventas`:
     `🎉 VENTA — {{contact.first_name}} {{contact.last_name}} · Tier {{contact.tier_score}} · 📱 {{contact.phone}}`
  5. **DM Slack a Anaís**: `🚀 Nueva alumna: {{contact.first_name}} — iniciar onboarding (Sesión de Claridad + form de ingreso + grupo WhatsApp)`
- **No añadir CAPI aquí**: `Envío [Purchase]` ya escucha ③/Cerrada con tag
  `lead-ads` (corregido en Fase 0 con valor real). Duplicarlo enviaría dos
  Purchase a Meta.

## F2-6 · `[③] 6 · Seguimiento asistentes` (nuevo)

- **Trigger:** Pipeline stage changed → `③` / **Seguimiento (Asistentes)**
  (Rafa la mueve cuando la llamada terminó sin decisión).
  **Goals de salida: stage Reserva (Por Pagar) o Cerrada (Venta).**
- **Cadencia:**
  1. Wait 48 h → WhatsApp (`seguimiento_1`): resumen de la llamada + caso de éxito.
  2. Wait 2 días → WhatsApp (`seguimiento_2`): responde la objeción nº 1
     (inversión/tiempo, según diagnóstico).
  3. Wait 3 días → WhatsApp (`seguimiento_3`): testimonio en video de alumna.
  4. Wait 7 días → WhatsApp (`seguimiento_4`): último llamado honesto + Task Rafa.
  5. Wait 7 días → **Update Opportunity → status Lost / reason
     `No cerró seguimiento`** + Remove tag `en-closer`.

## F2-7 · (Opcional) Diagnóstico pre-llamada

Cuando exista el survey corto de diagnóstico: trigger Survey submitted →
mover `②` / **Diagnóstico** + tag `diagnostico-ok` + **DM a Rafa** con las 3
respuestas clave. Activa la etapa muerta de ② y le da contexto al closer.

---

## Plantillas WhatsApp a aprobar en Meta (pedirlas HOY — tardan 1-2 días)

| Plantilla | Categoría | Uso |
|---|---|---|
| `noshow_recuperacion_1/2/3` | UTILITY | F2-2 |
| `reserva_recordatorio_1/2` | UTILITY | F2-4 |
| `seguimiento_1/2/3/4` | MARKETING | F2-6 |

Mientras se aprueban: los workflows se publican con **Tasks** en lugar de los
nodos de WhatsApp (envío manual), y se cambian al aprobarse.

## QA — contacto de prueba (15 min)

1. Cita de prueba → marcar **showed** en el calendario → ③ *Asistió* + tag +
   Slack #7.
2. Otra cita → marcar **no_show** → ③ *No-Show* + DM Rafa + toque 1 a los
   15 min. Re-agendar → sale del workflow (goal) y entra F2-3 → *Re-Agendada*.
3. Mover a mano a *Reserva (Por Pagar)* → Slack 💰; mover a *Cerrada (Venta)*
   → sale del dunning (goal), Won, tarjeta nueva en ④ *Cuota de Reserva*,
   🎉 en #7 y DM a Anaís.
4. Mover otra a *Seguimiento* → toque 1 a las 48 h (o verificar en Execution log).
5. Verificar que **Envío [Purchase]** disparó una sola vez con el valor real.

| ✔ | Paso |
|---|---|
| ☐ | F2-0 · Tag en-closer + Día de Llamada con guard |
| ☐ | F2-1 · [③] 1 Asistió |
| ☐ | F2-2 · [③] 2 No-Show + recuperación |
| ☐ | F2-3 · [③] 3 Re-agendada |
| ☐ | F2-4 · [③] 4 Reserva por pagar |
| ☐ | F2-5 · [③] 5 Cierre (④ + onboarding) |
| ☐ | F2-6 · [③] 6 Seguimiento asistentes |
| ☐ | Plantillas WhatsApp enviadas a aprobación |
| ☐ | QA completo |
