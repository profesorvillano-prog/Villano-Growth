# Auditoría GHL — Workflows, Pipelines y Automatización (Japi Eaters)

> Radiografía completa de la subcuenta **Japi Eaters** en Go High Level
> (`kdmmFxEbJjSpgMtbaZ6F`), extraída vía API el **2026-09-13**. Base para el
> rediseño: segundo número de WhatsApp, Slack multi-participante y métricas.
>
> **Alcance:** la API pública de GHL expone la lista de workflows (nombre,
> estado, versión, fechas) pero **no los pasos internos** (triggers, mensajes,
> esperas, condiciones). Los pasos hay que capturarlos desde la interfaz — ver
> la sección [Pendiente: captura de pasos internos](#pendiente-captura-de-pasos-internos).

---

## 1. Inventario de workflows (26)

### Familia A — Pipeline Closer (creados 25-08, sesión "pipeline unificado" con Anaís)

| # | Workflow | ID | Estado | Ver. | Última edición |
|---|---|---|---|---|---|
| A1 | `1 · Asistió` | `f76ab04d-3df0-4753-a806-7315938b1afc` | published | 5 | 25-08 |
| A2 | `2 · No-Show + recuperación` | `1b4cc6a7-05a1-4ef8-9e23-4d096fa6c6b7` | published | 6 | 25-08 |
| A3 | `3 · Re-agendada` | `0b4e2bf6-5669-4109-8784-8242aede256e` | published | 4 | 25-08 |
| A4 | `4 · Reserva pagada` | `88bdd890-5c69-4989-9076-38896b66b9ec` | published | 8 | 25-08 |

Corresponden 1:1 con las etapas del pipeline **③ Llamadas · Closer [Rafa]** y
los tags `asistio`, `no-show`, `re-agendada`, `reserva-pagada`.

### Familia B — Embudo ADS (cadena 1 → 4.1)

| # | Workflow | ID | Estado | Ver. | Última edición |
|---|---|---|---|---|---|
| B1 | `[ADS] 1 · Calificación (Survey → Tier)` | `834de977-2078-4aae-bc2b-07fc3646d8d9` | published | **53** | 25-08 |
| B2 | `[ADS] 2 · Agenda + Ghost` | `62c857b2-9a7a-4b4e-92b6-cdb88e9847a9` | published | 10 | 26-08 |
| B3 | `[ADS] 3 · Confirmación de cita` | `4e3de298-713f-4026-b7a6-73487918910d` | published | 37 | 25-08 |
| B4 | `[ADS] 4 · Recordatorios` | `825f4e87-319f-42c0-b345-40824c41910a` | published | 16 | 25-08 |
| B5 | `[ADS] 4.1 · Cita Cancelada → frenar` | `336e1908-043f-4a33-b218-a824159bc817` | published | 7 | **26-06** ⚠️ |

### Familia C — Embudo ORG (espejo de B)

| # | Workflow | ID | Estado | Ver. | Última edición |
|---|---|---|---|---|---|
| C1 | `[ORG] 1 · Calificación (Survey → Tier)` | `c98e6ba6-6154-4044-9bf5-77c756f608bf` | published | 26 | 25-08 |
| C2 | `[ORG] 2 · Agenda + Ghost` | `851e8b99-a23c-44c3-b873-f5ee439061df` | published | 18 | 27-08 |
| C3 | `[ORG] 3 · Confirmación de cita` | `4a74420d-eb24-45fb-98b3-b9af3bd41552` | published | 37 | 25-08 |
| C4 | `[ORG] 4 · Recordatorios` | `5296147d-09c2-4f99-9cb1-6737e0531fef` | published | 17 | 25-08 |
| C5 | `[ORG] 4.1 · Cita Cancelada → frenar` | `12157a7b-f140-4a45-8799-c5d0140792c7` | published | 4 | **26-06** ⚠️ |

### Familia D — Setter orgánico

| # | Workflow | ID | Estado | Ver. | Última edición |
|---|---|---|---|---|---|
| D1 | `[SETTER - ORG] 1 · Calificación (Survey → Tier)` | `8439135d-6c4f-4f75-9e28-4e75e05bdf0d` | published | 17 | 25-08 |

Solo existe el paso 1 de la cadena; los pasos 2-4 los cubre Valen manualmente
desde Instagram (decisión de la sesión del 25-08: el ghosting de setter es
manual porque Valen coordina la agenda por DM).

### Familia E — Tracking de conversiones Meta (CAPI)

| # | Workflow | ID | Evento Meta | Ver. | Última edición |
|---|---|---|---|---|---|
| E1 | `Envío [Lead] a Llamadas Agendadas [ADS]` | `c3e365ba-550e-4840-b6b1-befdcce9caeb` | Lead | 4 | 24-08 |
| E2 | `Envío [Initiate Checkout] a Forms Calificados [ADS]` | `b24e3f47-dcae-4b41-905f-21011b52b8d8` | InitiateCheckout | 5 | 10-08 |
| E3 | `Envío [Schedule] a Llamadas Confirmadas [ADS]` | `9f8d6a2c-1929-459a-b39e-0453ad7bb3fc` | Schedule | 23 | 24-08 |
| E4 | `Envío [Purchase] en cambio Lead -> Ventas High Ticket` | `b32d69b5-371b-4c57-84f8-3ad1f9e63a99` | Purchase | 10 | 24-08 |

### Familia F — Operativos / equipo

| # | Workflow | ID | Estado | Ver. | Última edición |
|---|---|---|---|---|---|
| F1 | `Asignación Anaís [Pipelines]` | `874d8016-8c67-4c28-801d-b1fbd10991d5` | published | 4 | **10-06** ⚠️ |
| F2 | `Asignación Rafa [Pipelines]` | `b71b6416-e04a-4612-8e93-b27f65dff257` | published | 4 | **10-06** ⚠️ |
| F3 | `[Handoff] 5 · Mover de Whatsapp -> Closer + Slack` | `8ab3d347-7826-403a-ac59-834b40e416c7` | published | 31 | 25-08 |
| F4 | `Envío de Onboarding - Venta High Ticket` | `41b79715-88e9-41df-bb5b-665a52e6d087` | published | 5 | 25-08 |
| F5 | `[General] WF-01 Entrega de Regalo Asistentes Llamada` | `5d8d5d2b-1fcd-4352-ace7-279bbaae0012` | published | 5 | **10-06** ⚠️ |
| F6 | `IG – Nuevo Seguidor (ManyChat Webhook)` | `5a617fbb-0909-4cd8-96d8-17d5cb278381` | published | 6 | 25-08 |
| F7 | `New Workflow : 1788364837592` | `24f0a1be-d582-4fa1-b442-0c8b5adb666a` | **draft** | 2 | **02-09** ⚠️ |

---

## 2. Pipelines y etapas

### ① Instagram · Setter [Valen] — `ZJbdlB7FnM3V5YY5BiDG`

Bienvenidas → Respuesta Bienvenida → CTA Lead Magnet → CTA Formación →
Link Enviado (Survey) → Seguimiento → Formulario Completado → Sin Agendar →
**Agendada** (win 100%) | Descalificada

### ② Agenda · WhatsApp [Anaís] — `puyQKiA3cuYzADHpbgcr` *(el pipeline unificado)*

Calificada (Formulario) → Sin Agendar (Ghost) → Follow Up 1/2/3 →
Nueva Agenda → Sin Confirmar (Agenda) → Confirmada (Agenda) → Diagnóstico →
Pre-Llamada (Preparación) → **Llamada Confirmada** (win 85%, la métrica "won"
de Anaís) → Re-Agendar (Cancelada) | Re-Contacto (Interesada)

### ③ Llamadas · Closer [Rafa] — `J61MmwBX4mGAl7W1jCpz`

Llamada Confirmada → Asistió → No-Show Llamada → Reserva (Por Pagar) →
**Cerrada (Venta)** (win 95%) → Seguimiento (Asistentes) | Re-Agendada

### ④ [VENTAS] Cobros — `vpq6pgz5Ht93tdBMImOC`

Cuota de Reserva → Pago Cuota 1 → Pago Cuota 2 → Pago Cuota 3 →
Pago Fallido → **Venta Total**

### [SETTER - ORG] Formación — `XoejslKD0GHwUWSxujbs` *(legado, en transición)*

Formulario [ORG] → Ghost Primer Contacto → Primer Contacto → Ghost Intento
Agenda → Follow Up → Nuevas Agendas → Llamada Preparación → Llamada
Confirmada → Cancelada (Re-Agendar) | Descalificada

⚠️ En la sesión del 25-08 Sebastián declaró este pipeline **obsoleto** ("este
pipeline va a quedar obsoleto… la idea era ir apagando esto"), pero sigue
activo y con win-probabilities incrementales (9→90%) que contaminan cualquier
métrica agregada.

---

## 3. Tags (31)

| Grupo | Tags |
|---|---|
| Origen | `lead-ads`, `lead-org`, `lead-setter-org`, `lead-revisar`, `nuevo-seguidor-ig` |
| Survey | `survey-ads`, `survey-org`, `survey-postulacion` |
| Tier | `tier-gold`, `tier-silver`, `tier-bronce`, `tier-out`, `bronce+ revisar` |
| Agenda | `agenda-ads`, `agenda-org`, `ghost-agenda`, `sin-confirmar`, `confirmada`, `re-agendada` |
| Llamada | `asistio`, `no-show`, `video-enviado`, `en-closer` |
| Venta | `reserva-pagada`, `prospecto-exito`, `curso-avanzado` |
| Calificación | `no-profesional-salud`, `sin-presupuesto`, `presupuesto-alto`, `decisor-tercero` |
| Infraestructura | `wa: +56962427929` ← **ya existe un tag de enrutamiento por número de WhatsApp** |

## 4. Custom fields relevantes (21 en total)

**Motor de calificación (Survey → Tier):**
- `contact.tier_score` (opciones: `tier-1-gold`, `tier-2-silver`, `tier-3-bronce`, `tier-4-out`)
- `contact.producto_recomendado` (`exito-alimentacion`, `curso-avanzado`, `descalificado`)
- `contact.monto_propuesto` (monetario)
- Preguntas del survey (RADIO): profesión, inversión pensada, quién decide,
  qué busca lograr, situación actual, confirmación de compromiso + campo
  abierto "cuéntanos más de tu caso"

**Atribución:** `contact.utm_source`, `contact.utm_campaign`, `contact.fecha_primer_contacto`

**Operación:** `contact.resumen_lead` (nutre al closer, creado 25-08),
`contact.usuario_instagram` (creado 25-08, lo llena el webhook de ManyChat)

**Legado (marzo, del sistema viejo):** `ocupacion`, `objetivo`, `trabaja_con_ninos`,
`interes_formacion`, `lead_status`, `real_name` ⚠️ probablemente ya sin uso

## 5. Calendarios (3)

| Calendario | ID | Duración | Detalles |
|---|---|---|---|
| `[ORG] Programa Éxito…` | `MiDJPvkZrUk3nhVrrYvw` | 45 min | Redirige a `japieaters.app/llamadaconfirmacion` |
| `[A] Programa Éxito…` | `NwjgigzvJK9qcrjizbFn` | 45 min | Redirige a `japieaters.app/formacion/exitoenalimentacion-preparacion-748635` |
| `Curso Avanzado` | `f6zX7ITk863lH93BqBJ9` | 30 min | Permite reagendar/cancelar (los otros dos NO) |

⚠️ Los dos calendarios principales: `allowReschedule: false`,
`allowCancellation: false`, un solo miembro de equipo (`oLXVLdDh5Vy9WEPligs2`)
pese a ser tipo round-robin, y **páginas post-agenda distintas entre ORG y
ADS** (¿intencional? ORG va a "llamadaconfirmacion", ADS a "preparación").

---

## 6. Fallas y riesgos detectados

### 🔴 F-1 · Triple mantenimiento de la misma cadena (ADS / ORG / SETTER)
La cadena Calificación → Agenda → Confirmación → Recordatorios existe en 3
copias que se editan por separado. La evidencia del drift está en las
versiones: **Calificación ADS v53 vs ORG v26 vs SETTER v17**. Cada mejora hay
que replicarla 3 veces a mano; es cuestión de tiempo que una copia diga algo
distinto de otra. *Al incorporar el segundo número esto se vuelve crítico:
cada cambio de proveedor de envío habría que hacerlo en 3+ workflows.*

### 🔴 F-2 · Ventana de confirmación rota por la regla de 24h de WhatsApp
Falla confirmada por el equipo (sesión 25-08, Anaís): *"si alguien hace clic
en confirmar luego de cierto tiempo, ya no se activan las automatizaciones"*.
El botón de confirmar/cancelar deja de disparar el workflow cuando la sesión
de WhatsApp expira. Hoy se parcha con insistencia manual de Anaís. El diseño
acordado (timeout ~30-60 min + follow-up "aprieta el botón") depende de pasos
internos que hay que verificar en B3/C3.

### 🟠 F-3 · `4.1 Cita Cancelada → frenar` congelado desde el 26-06
Toda la cadena se retocó el 25-08 menos los dos `4.1` (ADS y ORG). Si la
unificación cambió etapas o tags, el freno de cancelación puede estar apuntando
a etapas del pipeline viejo → riesgo de **seguir enviando recordatorios a
citas canceladas** (la falla más visible para la lead).

### 🟠 F-4 · `Asignación Anaís/Rafa [Pipelines]` anteriores a la unificación
Creados en mayo contra la estructura de pipelines vieja, sin tocar desde el
10-06, y el pipeline `[SETTER - ORG] Formación` que probablemente referencian
está declarado obsoleto. Verificar a qué etapas apuntan; candidatos a
apagar o reconstruir contra el pipeline ②.

### 🟠 F-5 · Pipeline obsoleto aún vivo
`[SETTER - ORG] Formación` sigue publicado y recibiendo movimiento durante la
transición. Mientras exista, hay dos lugares donde puede vivir la misma lead
(duplicidad que ya confundió el caso "Andrés": entró como org del formulario
de la bio y se marcó manualmente como org de Valen).

### 🟡 F-6 · Draft huérfano
`New Workflow : 1788364837592` (02-09, draft, sin nombre). Nadie sabrá en un
mes para qué era. Nombrarlo o borrarlo.

### 🟡 F-7 · Win-probabilities placeholder → métricas de embudo no confiables
Muchas etapas tienen 33.33% (default repartido) o valores incrementales
puestos por posición, no por conversión real (ej: en `[SETTER - ORG]`,
"Descalificada" tiene 90.91%). Cualquier forecast o pie chart de GHL miente
hoy. Si vas a montar métricas, esto hay que normalizarlo primero.

### 🟡 F-8 · Post-agenda inconsistente entre ORG y ADS
Dos páginas de destino distintas tras agendar (ver §5). Si es intencional
(tracking por origen), documentarlo; si no, unificar.

### 🟡 F-9 · Campos legado de marzo sin dueño
6 custom fields del sistema pre-GHL-actual (`ocupacion`, `lead_status`, etc.)
conviven con los nuevos. Riesgo de que un workflow viejo escriba en uno y los
reportes lean del otro.

---

## 7. Insumos para el rediseño planeado

### Segundo número de WhatsApp
- Decisión ya tomada en la sesión del 25-08: **número GHL/automatizado**
  (mexicano, plantillas, "Automation") + **WhatsApp QR** (número nuevo de
  Anaís, manual, sin restricción de plantilla ni ventana de 24h para iniciar).
- Ya existe el tag `wa: +56962427929` — el patrón de "marcar contacto por
  número" está iniciado; formalizarlo: un tag por número + campo de "canal
  asignado" para que los workflows elijan proveedor de envío.
- Regla pendiente de diseñar: qué pasa cuando la lead responde al número
  automatizado estando asignada al manual (hoy ambas conversaciones aparecen
  mezcladas en el mismo hilo de GHL).

### Slack multi-participante
- Hoy solo `[Handoff] 5` notifica a Slack (v31, muy iterado — es el corazón
  operativo). Con la llegada del director comercial (Seba Cachele) y la
  estructura Valen/Rafa/Anaís, los candidatos a notificación son:
  nueva agenda (por origen), no-show, reserva pagada, pago fallido, y el
  resumen del lead al pasar a closer (`contact.resumen_lead`).
- Diseño sugerido: un workflow de notificación por evento apuntando a
  canales por función (#ventas-agendas, #ventas-cierres, #alertas-pagos) en
  vez de mensajes a personas, para que escalar participantes no requiera
  tocar workflows.

### Métricas
- Los "won" por rol ya están definidos (25-08): Valen = Agendada (pipeline ①),
  Anaís = Llamada Confirmada (pipeline ②), Rafa = Cerrada (pipeline ③).
- La cadena Meta CAPI (familia E) ya emite Lead / InitiateCheckout / Schedule /
  Purchase — las métricas internas deberían leerse de los mismos movimientos
  de etapa para que ads y CRM cuenten lo mismo.
- Bloqueadores actuales: F-7 (probabilidades placeholder) y F-5 (pipeline
  duplicado) ensucian cualquier dashboard que se monte encima.

---

## Pendiente: captura de pasos internos

La API no expone los pasos; hay que capturarlos desde la interfaz de GHL con
Cowork (sesión local con navegador). Prompt sugerido:

> Entra a Go High Level, subcuenta Japi Eaters, sección Automation. Para cada
> workflow publicado (son 25), documenta en markdown: (1) trigger(s) exactos
> con sus filtros, (2) cada paso en orden — tipo de acción, canal/proveedor de
> envío, texto completo de mensajes, duración de esperas, condiciones de cada
> rama if/else, etiquetas/campos que escribe, movimientos de pipeline con
> etapa exacta, webhooks con URL, (3) configuración de re-entrada (allow
> re-entry) y stop-on-response. Presta atención especial a: `[ADS] 3` y
> `[ORG] 3` (botón confirmar/cancelar y su timeout), los dos `4.1` (a qué
> etapas apuntan), `Asignación Anaís/Rafa` (si referencian el pipeline
> obsoleto) y `[Handoff] 5` (canal y formato de Slack). Guarda el resultado
> como `clientes/japi-eaters/docs/Workflows-Pasos-Internos.md` en el repo
> Villano-Growth.

Cuando ese archivo exista, cruzarlo con esta auditoría cierra el diagnóstico
completo (pasos + fallas) y habilita el rediseño.

---

*Generado desde la API de GHL el 2026-09-13. IDs incluidos para automatizar
contra ellos sin volver a consultarlos.*
