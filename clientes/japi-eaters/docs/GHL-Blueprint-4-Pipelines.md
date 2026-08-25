# Blueprint — Motor GHL sobre los 4 pipelines

> Rediseño completo de la automatización de GoHighLevel de Japi Eaters para que
> los 4 pipelines nuevos funcionen como una sola máquina: smart tags, workflows,
> movimientos de etapa automáticos, Slack, responsables y métricas.
> Parte de la [auditoría de los 17 workflows actuales](./GHL-Auditoria-Workflows.md).

## Principios de arquitectura

1. **Una sola autopista**: ① → ② → ③ → ④. La **fuente** del lead (ads / org /
   setter) se marca con tags y un custom field, **no** con pipelines paralelos.
   El pipeline legacy `[SETTER - ORG] Formación` se retira en la Fase 4.
2. **Un workflow = un trabajo.** Nada de flujos que califican Y agendan Y confirman.
3. **Las etapas se mueven solas** cuando existe una señal automatizable (survey,
   booking, botón de WhatsApp, estado de cita, pago). Los humanos trabajan desde
   la conversación; mueven tarjetas a mano solo en ① (prospección de Valen) y en
   las decisiones de venta de ③ (Rafa: Reserva / Cerrada / Seguimiento).
4. **Nunca borrar oportunidades**: el handoff marca la de origen como `won`.
   Así cada pipeline conserva su funnel medible.
5. **Salidas por goal, no por espera**: toda secuencia de seguimiento usa un
   *goal event* (cita agendada, pago recibido, etapa alcanzada) para expulsar al
   contacto en el momento en que convierte.
6. **Toda creación de oportunidad asigna responsable** (*Assign to user*). El
   **valor monetario** ($1.250) se fija recién **al crear la oportunidad en ③**
   (handoff ②-5): las opps de ①/② quedan en $0 para que ningún reporte de
   "won revenue" agregado infle ingresos. Ventas en $ se leen en ③, cash en ④,
   y nunca se suma revenue cruzando pipelines.

## Los 4 pipelines y su dueño

| Pipeline | Dueño | SLA de la etapa crítica | Qué mide |
|---|---|---|---|
| ① Instagram · Setter [Valen] | **Valen** | Responder DMs < 2 h hábiles | Prospección orgánica: DM → survey |
| ② Agenda · WhatsApp [Anaís] | **Anaís** | Lead calificado contactado < 15 min | Survey calificado → llamada confirmada |
| ③ Llamadas · Closer [Rafa] | **Rafa** | No-show recontactado < 1 h | Llamada → venta |
| ④ [VENTAS] Cobros | **Rafa** (escala a Seba) | Pago fallido gestionado < 24 h | Venta → cash collected |

---

## Taxonomía de smart tags

Los tags existentes **se conservan** (ManyChat, surveys y triggers ya dependen de
ellos). Se añaden familias nuevas para los estados que hoy no existen.

| Familia | Tags | Quién los pone / quita |
|---|---|---|
| Fuente (permanente) | `lead-ads` · `lead-org` · `lead-setter-org` · `survey-ads` · `survey-org` | Calificación (②-1). No se quitan nunca: son el eje de atribución. *(Corrige el swap actual de [ADS] 3/[ORG] 3, que borra la fuente al re-agendar por otro canal.)* |
| Tier (permanente) | `tier-gold` · `tier-silver` · `tier-bronce` · `tier-out` · `presupuesto-alto` · `sin-presupuesto` · `no-profesional-salud` · `prospecto-exito` | Calificación (②-1) |
| Agenda (transitorios) | `ghost-agenda` · `agenda-ads` / `agenda-org` · `sin-confirmar` · `confirmada` · `video-enviado` · **`diagnostico-ok`** (nuevo) | ②-2 / ②-3; la confirmación limpia los del estado anterior |
| Llamada (nuevos) | **`asistio`** · **`no-show`** · **`reagendada`** | ③-1 / ③-2 |
| Venta y cobro (nuevos) | **`reserva-pagada`** · **`cliente-activo`** · **`pago-fallido`** · **`venta-total`** | ③-3 / ③-4 / ④-1 / ④-2 / ④-3 |
| Prospección ① (nuevos) | **`ig-contactada`** · **`survey-enviado`** | ManyChat / ①-1 |
| Sistema | `lead-revisar` (cae en rama None → revisión humana) | ②-1 |

**Regla de oro:** fuente y tier nunca se quitan; los transitorios de agenda se
limpian al pasar de fase; los de llamada/venta son el registro histórico del resultado.

## Custom fields

| Campo | Valores | Para qué |
|---|---|---|
| `Tier Score` (existe) | tier-1-gold … tier-4-out | Ya en uso |
| `Producto Recomendado` (existe) | exito-alimentacion | Ya en uso |
| **`Fuente Lead`** (nuevo) | ads / org / setter-org | Reportes y filtros sin depender de tags |
| **`Motivo No-Show`** (nuevo) | texto corto | Lo llena Rafa; alimenta el análisis de show rate |
| **`Plan de Pago`** (nuevo) | contado / 2-cuotas / 3-cuotas | Lo fija Rafa al cerrar; gobierna ④ |

---

## Workflows por pipeline

Convención de nombres: `[pipeline] N · Trabajo`. Los 17 actuales se renombran,
corrigen o absorben según la columna *Origen*.

### Pipeline ① — Instagram · Setter [Valen]

Valen trabaja Bienvenidas → CTA a mano desde la conversación; la automatización
registra los hitos y le avisa cuando algo se enfría.

| WF | Disparador | Acciones | Origen |
|---|---|---|---|
| **①-1 · Survey enviado** | Tag added `survey-enviado` (lo pone ManyChat o Valen al mandar el link) | Crear/actualizar opp en ① → *Link Enviado (Survey)*, assign **Valen** | Nuevo |
| **①-2 · Formulario completado** | Survey submitted `[SURVEY - ORG]` o `[SURVEY - ORG SETTER]` | Mover opp de ① → *Formulario Completado* y marcar **won** (la posta pasa a ②); sin Slack propio: ②-1 ya notifica por tier | Nuevo |
| **①-3 · Se enfrió** | Stale opportunity: 48 h sin cambio en *Respuesta Bienvenida* / *CTA Formación* / *Link Enviado* | Mover a *Seguimiento* + **DM Slack a Valen** con nombre y link al contacto | Nuevo |
| **①-4 · Agendó directo** | Appointment booked (calendario [ORG]) con opp abierta en ① | Mover ① → *Agendada*, won | Nuevo |

### Pipeline ② — Agenda · WhatsApp [Anaís]

| WF | Disparador | Acciones clave | Origen |
|---|---|---|---|
| **②-1A · Calificación ADS** | Survey `[SURVEY - ADS]` | Estructura actual de tiers **intacta** + 4 fixes: nodo Descalificada → crear en *Calificada (Formulario)* con status **lost** / reason `Inversión`; **assign Anaís**; sin valor monetario (el valor se fija en ③, ver Principios §6); set `Fuente Lead = ads` | [ADS] 1 |
| **②-1B · Calificación ORG** | Surveys `[SURVEY - ORG]` **y** `[SURVEY - ORG SETTER]` (2 triggers) | Igual que ②-1A pero destino **② / Calificada (Formulario)** (ya no el pipeline legacy), `Fuente Lead = org` | [ORG] 1 + [SETTER - ORG] 1 |
| **②-2 · Ghost multi-toque** | Tag added `tier-gold` / `tier-silver` / **`tier-bronce`** (fix: ORG hoy no incluye bronce) | **Goal de salida: appointment booked.** T+2 h sin agenda → *Sin Agendar (Ghost)* + tag `ghost-agenda` + WhatsApp toque 1 (`ghost_agenda_ads` / **`ghost_agenda_org`** según fuente). T+24 h → toque 2 (audio/beneficio). T+72 h → toque 3 último aviso + mover a *Follow Up* + task para Anaís + Slack `#9-ghost-sin-agendar` | [ADS] 2 + [ORG] 2 |
| **②-3 · Confirmación de cita** | Appointment booked (cal. [A] con tag `lead-ads`; cal. [ORG] resto) | Mover → *Nueva Agenda* + Slack `#4-nuevas-agendas`. Enviar template botón (`v2_confirmar_jose`) y mover → ***Sin Confirmar (Agenda)***. Al pulsar **Confirmar** → mover → ***Confirmada (Agenda)***, limpiar `ghost-agenda`/`sin-confirmar`, tag `confirmada`, y continuar video selfie + mensaje de Rafa como hoy. Undelivered / Time Out → tag `sin-confirmar` + Slack `#9-ghost-sin-agendar`. **Fix rama duplicada**: si "decide en pareja" → mensaje que invita a la pareja a la llamada. Ya **no** borra los tags de fuente | [ADS] 3 + [ORG] 3 |
| **②-3.1 · Diagnóstico** *(nuevo, usa la etapa muerta)* | Survey pre-llamada completado (formulario corto de diagnóstico) | Mover → *Diagnóstico* + tag `diagnostico-ok` + **Slack DM a Rafa** con las 3 respuestas clave para preparar la llamada | Nuevo |
| **②-4 · Recordatorios** | Appointment booked, **con filtro de tag por fuente** (fix) | 24 h antes → *Pre-Llamada (Preparación)* + `wa_recordatorio_24h` + Slack `#5-llamadas-preparacion`. 4 h antes → 🚨 Slack a `#0-llamadas-hoy` + `wa_recordatorio_8h` *(la etapa Día de Llamada se eliminó de ②: el tablero del día es el canal #0)*. 1 h antes → `wa_recordatorio_1h`. 35 min antes → DM Slack al closer | [ADS] 4 + [ORG] 4 |
| **②-4.1 · Cancelación** | Appointment cancelled | Remove de ②-4 (como hoy) **+ mover → *Re-Agendar (Cancelada)*** + WhatsApp con link de re-agenda + Slack `#4-nuevas-agendas`; si a las 48 h no re-agendó → *Follow Up* + task Anaís | [ADS] 4.1 + [ORG] 4.1 |
| **②-5 · Handoff Closer** | Pipeline stage changed → *Llamada Confirmada* | Crear opp en ③ / *Llamada Confirmada*, **assign Rafa**, fijar valor $1.250 y copiar fuente; **marcar la opp de ② como won** (fix: hoy se borra); Slack `#6-confirmaciones-llamadas` | [ADS] 5 + [ORG] 5 |

### Pipeline ③ — Llamadas · Closer [Rafa]

Rafa mueve a mano solo *Reserva (Por Pagar)*, *Cerrada (Venta)* y *Seguimiento
(Asistentes)*; todo lo demás es automático.

| WF | Disparador | Acciones | Origen |
|---|---|---|---|
| **③-1 · Asistencia** | Appointment status = **showed** / **no_show** | *showed* → mover → *Asistió* + tag `asistio`. *no_show* → mover → *No-Show Llamada* + tag `no-show` + **DM Slack a Rafa al instante** + recuperación: WhatsApp a los 15 min ("¿todo bien? te guardo el cupo"), 24 h (link re-agenda), 48 h (último aviso + task para Rafa). Goal de salida: nueva cita | Nuevo |
| **③-2 · Re-agendada** | Appointment booked con tag `no-show` u opp en *No-Show* | Mover → *Re-Agendada* + tag `reagendada`, quitar `no-show`; al confirmar vuelve al carril de ②-4 (recordatorios) | Nuevo |
| **③-3 · Reserva por pagar** | Stage changed → *Reserva (Por Pagar)* | Enviar link de pago por WhatsApp; recordatorio a las 24 h y 48 h si no hay pago (**goal: payment received**); Slack `#7-cierres-ventas` "💰 Reserva pendiente"; a las 72 h sin pago → task Rafa + alerta | Nuevo |
| **③-4 · Cierre** | Stage changed → *Cerrada (Venta)* | Status **won** con valor real; tag `cliente-activo`; **crear opp en ④ / Cuota de Reserva** (assign Rafa); Slack `#7-cierres-ventas` "🎉 VENTA {{contact.name}} — ${{opportunity.lead_value}} ({{contact.fuente_lead}}/{{contact.tier_score}})"; **DM a Anaís** para iniciar onboarding; CAPI Purchase (ver §Meta CAPI) | Nuevo (absorbe el trigger de *Envío [Purchase]*) |
| **③-5 · Seguimiento asistentes** | Stage changed → *Seguimiento (Asistentes)* | Cadencia: 48 h (resumen + caso de éxito), día 4 (objeción top), día 7 (testimonio video), día 14 (último llamado). **Goal: stage Reserva o Cerrada.** Día 21 sin respuesta → status lost / reason `No cerró seguimiento` | Nuevo |

### Pipeline ④ — [VENTAS] Cobros

Pagos GHL/Stripe disparan nativo (*Payment Received / Failed*); Hotmart entra por
un escenario de **Make** que añade tags `pago-hotmart-ok` / `pago-hotmart-fail`.

| WF | Disparador | Acciones | Origen |
|---|---|---|---|
| **④-1 · Cobro registrado** | Payment received **o** tag `pago-hotmart-ok` | Mover a la cuota siguiente según `Plan de Pago` (Reserva → Cuota 1 → 2 → 3); quitar `pago-fallido` si estaba; Slack `#8-cobros` "✅ Pago {{contact.name}} — cuota N" | Nuevo |
| **④-2 · Pago fallido** | Payment/Invoice failed **o** tag `pago-hotmart-fail` | Mover → *Pago Fallido* + tag `pago-fallido`; dunning: día 0 aviso amable + link, día 2 recordatorio, día 5 task **Rafa llama**; Slack `#8-cobros` "🔴 Pago fallido {{contact.name}} — @Rafa". **Goal: payment received** | Nuevo |
| **④-3 · Venta total** | Última cuota pagada (posición según `Plan de Pago`) | Mover → *Venta Total*, status **won**, tag `venta-total`; Slack `#8-cobros` "🏆 Cobro completo {{contact.name}} — ${{opportunity.lead_value}}" | Nuevo |

### API Conversiones (Meta CAPI) — corregida

| Evento | Disparador | Fixes |
|---|---|---|
| InitiateCheckout | Survey ADS + tier gold/silver | Sin cambios |
| Lead | Booking calendario [A] **+ filtro `lead-ads`** | Filtro nuevo (hoy dispara sin tag) |
| Schedule | ③ / Llamada Confirmada + `lead-ads` | **Eliminar wait 9999 días** (206 contactos atrapados) + allow re-entry |
| Purchase | ③ / Cerrada (Venta) + `lead-ads` | **Eliminar wait 9999 días**; enviar **valor real** `{{opportunity.lead_value}}` en vez de 1.500 fijo. Se envía **una sola vez** al cerrar (④ no re-envía Purchase) |

---

## Mapa de canales Slack

| Canal | Qué llega | Quién mira |
|---|---|---|
| `#1-leads-bronce` / `#2-leads-silver` / `#3-leads-gold` | Lead calificado por tier (②-1) | Anaís |
| `#4-nuevas-agendas` | Nueva agenda, re-agenda, cancelación (②-3, ②-4.1) | Anaís |
| `#5-llamadas-preparacion` | 🔔 T-24 h de cada llamada (②-4) | Anaís, Rafa |
| `#0-llamadas-hoy` *(nuevo)* | El tablero del día: 🚨 T-4 h, cancelaciones y no-shows del día. El prefijo 0 lo deja primero en Slack. El aviso ⏰ T-35 min queda como **DM privado al closer** (empujón de ejecución, no información de equipo) | **Todos + director de ventas** |
| `#6-confirmaciones-llamadas` | Handoff a closer (②-5) — **absorbe `5-confirmaciones-llamadas`** | Rafa |
| `#7-closer-ventas` *(nuevo)* | Asistió / no-show, reservas pendientes y 🎉 ventas (③-1, ③-3, ③-4) | **Todos + director de ventas** |
| `#8-cobros` *(nuevo)* | Pagos ok, fallidos, venta total (④) | Rafa, Seba, director |
| `#9-ghost-sin-agendar` | Feed 👻 de seguimiento: leads que no agendaron (renombrado del viejo `leads-conflicto` privado; los nodos siguen publicando porque Slack conserva el ID) | Anaís, Valen |
| `#9-leads-conflictos` | Solo conflictos reales: rama None (`lead-revisar`), Undelivered / Time Out. Regla de salud: casi vacío = sistema sano | Anaís |
| DMs | Valen (①-3), Rafa (②-3.1 diagnóstico, T-35 min, no-show), Anaís (onboarding tras venta) | — |

**Formato estándar de mensaje** (todos los workflows):
`{{emoji}} {{evento}} — {{contact.name}} · {{contact.phone}} · tier {{contact.tier_score}} · fuente {{contact.fuente_lead}} · {{link a la oportunidad}}`

## Responsables (quién hace qué)

| Momento | Automático (workflow) | Humano |
|---|---|---|
| DM Instagram → survey | ①-1/①-3 registran y avisan | **Valen** conversa y mueve ① |
| Survey → llamada confirmada | ②-1 a ②-5 (asignan a **Anaís**) | Anaís interviene en *Follow Up*, conflictos y re-agendas |
| Llamada → venta | ③-1/③-2/③-5 (asignan a **Rafa**) | Rafa mueve Reserva / Cerrada / Seguimiento |
| Cobros | ④-1/④-2/④-3 | Rafa gestiona fallidos; **Seba** supervisa `#8-cobros` |
| Onboarding | DM automático a **Anaís** al cerrar | Anaís agenda Sesión de Claridad |

## Métricas — el árbol de KPIs que habilita este diseño

Con las etapas movidas por workflows (no a mano), el funnel report de GHL se
vuelve confiable. KPIs y su fuente:

| KPI | Fórmula (etapas) | Meta inicial |
|---|---|---|
| Tasa de calificación | opps creadas en ② / surveys enviados | > 60 % |
| Tier mix | distribución tags `tier-*` | vigilar % gold+silver |
| Tasa de agenda | *Nueva Agenda* / *Calificada (Formulario)* | > 50 % |
| Rescate ghost | agendas con tag `ghost-agenda` previo / total ghost | > 25 % |
| Tasa de confirmación | *Confirmada (Agenda)* / *Nueva Agenda* | > 80 % |
| **Show rate** | *Asistió* / *Llamada Confirmada* (③) | > 70 % |
| Recuperación no-show | re-agendas / `no-show` | > 40 % |
| **Close rate** | *Cerrada (Venta)* / *Asistió* | > 25 % |
| Cierre diferido | cierres desde *Seguimiento (Asistentes)* / entradas | medir 1er mes |
| **Cash collected** | suma pagos ④ / valor ventas ③ | > 90 % |
| Recuperación dunning | salidas de *Pago Fallido* con pago / entradas | > 70 % |
| Velocidad | tiempo medio survey → llamada; llamada → cobro total | reducir mes a mes |

- **Por fuente y por tier**: todos los KPIs se cortan con `Fuente Lead` y
  `Tier Score` (por eso son campos, no solo tags).
- **Digest semanal**: escenario de Make (lunes 9:00) que lee opportunities por
  etapa vía API y publica el resumen del funnel en `#7-closer-ventas`.
- **Digest matinal del director** (Fase 3): escenario de Make (8:00) que publica
  en `#0-llamadas-hoy` la lista de llamadas del día — hora, nombre, tier,
  fuente, closer.
- Las *stage win probabilities* de ①-④ ya son coherentes; al retirar el legacy
  desaparecen las incoherentes (Descalificada 90,91 %).

## Plan de implementación

**Fase 0 — Quick fixes (1 día, sin rediseño):** hallazgos P0 de la auditoría:
nodo Descalificada, waits 9999 + liberar 215 contactos, trigger `tier-bronce`
en ORG, filtros `lead-ads` en [ADS] 4 y CAPI Lead, won en vez de borrar en los
handoff, valor real en Purchase.

**Fase 1 — Pipeline ② completo (semana 1):** ②-1B apunta a ② (deja de escribir
al legacy); ②-2 multi-toque con goals; ②-3 usa *Sin Confirmar* / *Confirmada*;
②-4 usa *Día de Llamada*; ②-4.1 mueve a *Re-Agendar*; ②-5 asigna a Rafa.
Crear plantillas `ghost_agenda_org`, toques 2-3 y canales `#9-*`.

**Fase 2 — Pipeline ③ (semana 2):** ③-1 a ③-5; canales `#7-cierres-ventas`;
survey de diagnóstico + ②-3.1.

**Fase 3 — Pipeline ④ + métricas (semana 3):** ④-1 a ④-3, puente Make-Hotmart,
campo `Plan de Pago`, canal `#8-cobros`, digest semanal.

**Fase 4 — Pipeline ① y retiro del legacy (semana 4):** ①-1 a ①-4 con Valen;
migrar opps abiertas de [SETTER - ORG] Formación a ② (bulk), archivar el
pipeline y los canales Slack duplicados.

### QA por workflow (checklist antes de publicar)

1. Contacto de prueba con tag de fuente correcto recorre el flujo completo.
2. La tarjeta termina en la etapa esperada, con responsable y valor.
3. El goal de salida expulsa al convertir (agendar / pagar) en mitad de la secuencia.
4. Slack llega al canal correcto con el formato estándar.
5. Re-entrada probada (segundo survey / re-agenda) sin duplicar oportunidades.
6. Ningún workflow borra oportunidades ni tags de fuente/tier.
