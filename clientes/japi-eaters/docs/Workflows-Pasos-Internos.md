# Workflows actuales — Japi Eaters (GoHighLevel)

> **Procedencia:** relevamiento hecho con Cowork (sesión local con navegador)
> el 24-08-2026, incorporado al repo el 13-09-2026. **Ojo con la fecha:** la
> unificación del pipeline con Anaís fue el 25-08 (un día después), y varios
> de estos workflows se editaron el 25/26/27-08. Los deltas conocidos y las
> verificaciones pendientes están en `Auditoria-GHL-Workflows.md` §8.

Inventario de solo lectura de la subcuenta **Japi Eaters** (`kdmmFxEbJjSpgMtbaZ6F`),
ruta `Automation → Workflows → HIGH TICKET FUNNEL → Marketing`.

- **Relevado:** 24 de agosto de 2026
- **Alcance:** las dos carpetas pedidas y sus subcarpetas
  - `[ADS] Anuncios Facebook` (6 workflows + subcarpeta `API Conversiones` con 4)
  - `[ORG] Instagram Orgánico` (5 workflows + subcarpetas `LINK BIO` con 1 y `SETTER` con 1)
  - **Total: 17 workflows**, todos en estado `Publicado`
- **Nada fue editado, pausado, publicado, movido ni borrado.** Solo se abrieron los
  paneles de configuración en modo lectura.

## Nombres de pipeline al día de hoy

Los pipelines ya están renombrados respecto de la lista del encargo. Los nombres que
aparecen dentro de los workflows son:

| Nombre en el encargo | Nombre actual en GHL |
|---|---|
| `② [SETTER - ADS]` | `② Agenda · WhatsApp [Anaís]` |
| `③ [CLOSER] Agenda` | `③ Llamadas · Closer [Rafa]` |
| `① [SETTER - ORG] Formación` | `[SETTER - ORG] Formación` (sin el `①` visible en los selectores) |

## Hallazgos que conviene mirar antes de renombrar etapas

1. ⚠ **`[ADS] 1 · Calificación (Survey → Tier)`, nodo `Crear en Descalificada`**: el campo
   *pipeline stage* está **vacío** y el nodo aparece marcado con error en el canvas.
   Crea la oportunidad en `② Agenda · WhatsApp [Anaís]` sin etapa de destino.
   El nodo equivalente en los dos workflows orgánicos sí apunta a la etapa `Descalificada`.
2. **Cinco etapas distintas de `② Agenda · WhatsApp [Anaís]` reciben escrituras** desde
   los workflows de ADS: `Calificada (Formulario)`, `Sin Agendar (Ghost)`, `Nueva Agenda`,
   `Pre-Llamada (Preparación)` y `Llamada Confirmada` (esta última como disparador).
3. **Cinco etapas de `[SETTER - ORG] Formación`** reciben escrituras desde los workflows
   orgánicos: `Descalificada`, `Formulario [ORG]`, `Ghost Intento Agenda`, `Nuevas Agendas`
   y `Llamada Preparación`; más `Llamada Confirmada` como disparador.
4. **`[ADS] 5` y `[ORG] 5` borran todas las oportunidades del contacto** en el pipeline de
   origen después de crear la del closer. Si se renombra o reordena algo ahí, ese borrado
   se ejecuta igual.
5. ⚠ **Esperas de 9999 días** en `Envío [Purchase]...` y `Envío [Schedule]...` retienen
   contactos dentro del workflow de forma permanente (9 y 206 activos respectivamente).
6. `[ORG] 2 · Agenda + Ghost` **no tiene disparador para `tier-bronce`** (el de ADS sí).
   Los leads bronce orgánicos nunca entran a ese seguimiento.
7. `[ORG] 2` envía la plantilla de WhatsApp `ghost_agenda_ads`, la misma que usa el flujo
   de pago, pese a ser el flujo orgánico.
8. En `[ADS] 3` y `[ORG] 3`, las ramas `Branch` y `None` del if/else `No toma decisión`
   ejecutan secuencias **idénticas** y con la misma plantilla — están duplicadas sin
   diferencia funcional.
9. `[ORG] 5` se llama "Mover de Setter-**ADS**" pero opera sobre el pipeline orgánico.

---

# Carpeta `[ADS] Anuncios Facebook`

### [ADS] 1 · Calificación (Survey → Tier)
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 524 totales / 0 activos
- ID: 834de977-2078-4aae-bc2b-07fc3646d8d9
- Disparador: **Survey submitted** — nombre del disparador `[SURVEY - ADS] Postulación`; filtro `Survey is` → `[SURVEY - ADS] Postulación ÉxiTO en Alimentación`
- Acciones:
  1. Add contact tag — `Añadir LEAD-ADS` → tags `survey-ads`, `lead-ads`
  2. If/else — `¿Profesional de salud?`
     - Rama `SI Salud`: `¿Cuál es tu profesión?` Is `Terapeuta Ocupacional` OR Is `Nutricionista / Fonoaudióloga / ...` (truncado) OR Is `Otro profesional de la salud qu...` (truncado)
     - Rama `NO Salud`: `¿Cuál es tu profesión?` Is `No soy profesional de la salud`
     - Rama `None` (cuando no se cumple ninguna)
  3. [SI Salud] If/else — `Nivel inversión` — ramas `No invierte` / `Bronce (200-500)` / `Silver (500-1.000)` / `Gold (1.000-2.000)` / `None`, evaluando `Para recomendarte la mejor opción, ¿cuá...`
     - `No invierte` = Is `No puedo invertir`
  4. [No invierte] Create opportunity — `Crear en Descalificada` → pipeline `② Agenda · WhatsApp [Anaís]`, **etapa: VACÍA (Select pipeline stage)** ⚠ nodo con error en el canvas; source `[SURVEY - ADS] Postulación ÉxiTO`; status `lost`; lost reason `Inversion`
  5. [No invierte] Update contact field — `Set Tier OUT` → `Tier Score` = `tier-4-out`
  6. [No invierte] Add contact tag — `Tag tier-out` → `sin-presupuesto`, `tier-out` → END
  7. [Bronce] Create opportunity — `Crear Oportunidad [Setter-ADS] Formación - Formulario` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Calificada (Formulario)`
  8. [Bronce] Update contact field — `Set Tier Bronce` → `Tier Score` = `tier-3-bronce`
  9. [Bronce] Update contact field — `Set Producto = ÉxiTO Certificación` → `Producto Recomendado` = `exito-alimentacion`
  10. [Bronce] Add contact tag — `Tag tier-bronce` → `tier-bronce`, `prospecto-exito`
  11. [Bronce] Slack message — `Notificar Slack Lead-Bronce` → canal público `1-leads-bronce` (cuenta `Japi Eaters - japieaters`) → END
  12. [Silver] Create opportunity — `Crear Oportunidad [Setter-ADS] Formación - Formulario` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Calificada (Formulario)`
  13. [Silver] Update contact field — `Set Tier SILVER` → `Tier Score` = `tier-2-silver`
  14. [Silver] Update contact field — `Set Producto = ÉxiTO Certificación` → `Producto Recomendado` = `exito-alimentacion`
  15. [Silver] Add contact tag — `Tags SILVER` → `tier-silver`, `prospecto-exito`
  16. [Silver] Slack message — `Notificar Slack Lead-Silver` → canal público `2-leads-silver` → END
  17. [Gold] Create opportunity — `Crear Oportunidad [Setter-ADS] Formación - Formulario` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Calificada (Formulario)`
  18. [Gold] Update contact field — `Set Tier GOLD` → `Tier Score` = `tier-1-gold`
  19. [Gold] Update contact field — `Set Producto = ÉxiTO Certificación` → `Producto Recomendado` = `exito-alimentacion`
  20. [Gold] Add contact tag — `Tags GOLD` → `presupuesto-alto`, `tier-gold`, `prospecto-exito`
  21. [Gold] Slack message — `Notificar Slack Lead-Gold` → canal público `3-leads-gold` → END
  22. [Nivel inversión / None] Add contact tag — `Lead Revisar` → `lead-revisar`
  23. [Nivel inversión / None] Slack message — `Slack Anaís Lead Fuera flujo` → DM a usuario interno (la setter) → END
  24. [NO Salud] Update contact field — `Set Tier OUT` → `Tier Score` = `tier-4-out`
  25. [NO Salud] Add contact tag — `Tag tier-out` → `no-profesional-salud` → END
  26. [¿Profesional? / None] Add contact tag — `Lead Revisar` → `lead-revisar`
  27. [¿Profesional? / None] Slack message — `Slack Anaís Lead Fuera flujo` → canal público `leads-conflictos` → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `② Agenda · WhatsApp [Anaís]` — etapa `Calificada (Formulario)` (crea, x3) y una creación con **etapa vacía** ⚠
- Etiquetas que añade: `survey-ads`, `lead-ads`, `sin-presupuesto`, `tier-out`, `tier-bronce`, `prospecto-exito`, `tier-silver`, `tier-gold`, `presupuesto-alto`, `lead-revisar`, `no-profesional-salud`. No quita ninguna.
- Mensajes: solo Slack (canales `1-leads-bronce`, `2-leads-silver`, `3-leads-gold`, `leads-conflictos` y un DM interno). No envía WhatsApp/SMS/Email.

### [ADS] 2 · Agenda + Ghost
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 338 totales / 0 activos
- ID: 62c857b2-9a7a-4b4e-92b6-cdb88e9847a9
- Disparadores (3, todos **Contact Tag / Contact Tag Added**):
  1. `Tag added includes "tier-silver"`
  2. `Tag added includes "tier-gold"`
  3. `Tag added includes "tier-bronce"`
- Acciones:
  1. If/else — `¿Es ADS?`
     - Rama `SI`: `Tags` `Includes` `lead-ads`
     - Rama `None` → END
  2. [SI] Wait — `Wait 2 Horas` → periodo fijo, 2 `hours`
  3. If/else — `¿Ya agendó?`
     - Rama `SI`: `Tags Includes agenda-ads` OR `Last appointment at Is After 0 Days` OR `Last appointment at Is Today` → END
     - Rama `NO`: `Tags Does not include agenda-ads` → continúa
     - Rama `None` → END
  4. [NO] Add contact tag — `Añadir Ghost Agenda` → `ghost-agenda`
  5. [NO] Create opportunity — `Cambiar a Ghost Agenda` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Sin Agendar (Ghost)`
  6. [NO] WhatsApp — `WhatsApp No Agendó (Follow Up Agenda)` → desde `+52 1 984 404 6192 - default`, plantilla `ghost_agenda_ads (es) - MARKETING`
  7. [NO] Slack message — `Notificación Slack Anaís` → canal privado `1-leads-conflicto` → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `② Agenda · WhatsApp [Anaís]` — etapa `Sin Agendar (Ghost)` (crea/mueve)
- Etiquetas que añade: `ghost-agenda`. Lee (no modifica): `lead-ads`, `agenda-ads`, `tier-silver`, `tier-gold`, `tier-bronce`. No quita ninguna.
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (plantilla `ghost_agenda_ads`) + Slack canal privado `1-leads-conflicto`

### [ADS] 3 · Confirmación de cita
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 153 totales / 0 activos
- ID: 4e3de298-713f-4026-b7a6-73487918910d
- Disparador: **Customer booked appointment** — nombre `Customer Booked Appointment`; inscribe `Contact only`; filtros: `In calendar` = `[A] Programa Éxito en Alimentación Infantil` Y `Has tag` = `lead-ads`
- Acciones:
  1. Create opportunity — `Cambiar a Nueva Agenda` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Nueva Agenda`, status `open`
  2. Remove contact tag — `Remove Tag` → quita `agenda-org`, `lead-setter-org`, `lead-org`
  3. Add contact tag — `Add tag: agenda-ads` → `agenda-ads`
  4. If/else — `¿Primera vez o re-agenda?`
     - `PRIMERA VEZ (NO video-enviado)`: `Tags Does not include video-enviado`
     - `RE-AGENDA (SÍ video-enviado`: `Tags Includes video-enviado`
     - `None`
  5. [PRIMERA VEZ] If/else — `No toma decisión`
     - `Branch`: `¿Quién debe estar contigo en la reunión ...` Is `Solo yo, tomo la decisión por mi cuenta.`
     - `None`
     (ambas ramas ejecutan la misma secuencia 6-15, duplicada)
  6. Slack message — `Slack #4-nuevas-agendas` → canal privado `4-nuevas-agendas`
  7. WhatsApp — `WhatsApp – Template confirmación (botón "Confirmar")` → plantilla `v2_confirmar_jose (es) - MARKETING`, desde `+52 1 984 404 6192 - default`, **branches activados** → ramas `Undelivered` / `Confirmar` / `Time Out`
  8. [Undelivered] Slack message — `Slack Anaís` → canal privado `1-leads-conflicto`
  9. [Undelivered] Add contact tag — `Add tag sin-confirmar` → `sin-confirmar` → END
  10. [Time Out] Slack message — `Slack Anaís` → canal privado `1-leads-conflicto`
  11. [Time Out] Add contact tag — `Add tag sin-confirmar` → `sin-confirmar` → END
  12. [Confirmar] Remove contact tag — `Remove Tag` → quita `confirmada`, `ghost-agenda`, `sin-confirmar`
  13. [Confirmar] Wait — `Wait` → 1 `minutes`
  14. [Confirmar] Add contact tag — `Add Tag → confirmada` → `confirmada`
  15. [Confirmar] Wait — `Espera 3 min NO BOT ("Grabando Video")` → 3 `minutes`
  16. [Confirmar] WhatsApp media — `Video Selfie` → desde `+52 1 984 404 6192 - default`, tipo `Video`
  17. [Confirmar] Add contact tag — `Add Tag → video-enviado` → `video-enviado`
  18. [Confirmar] Wait — `Espera 5 min NO BOT (Contacto Rafa)` → 5 `minutes`
  19. [Confirmar] WhatsApp — `WhatsApp Rafa` → `None - Free form message`, desde `+52 1 984 404 6192 - default` → END
  20. [RE-AGENDA] Slack message — `Slack #4-nuevas-agendas` → canal privado `4-nuevas-agendas`
  21. [RE-AGENDA] WhatsApp — `WhatsApp Rafa` → plantilla `wa_confirmacion_agenda_organica (es) - MARKETING`, desde `+52 1 984 404 6192 - default`
  22. [RE-AGENDA] Remove contact tag — `Remove Tag` → quita `confirmada`, `ghost-agenda`, `sin-confirmar`
  23. [RE-AGENDA] Wait — `Wait` → 2 `minutes`
  24. [RE-AGENDA] Add contact tag — `Add Tag → confirmada` → `confirmada` → END
  25. [¿Primera vez o re-agenda? / None] → END sin acciones
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `② Agenda · WhatsApp [Anaís]` — etapa `Nueva Agenda` (crea/mueve)
- Etiquetas que añade: `agenda-ads`, `sin-confirmar`, `confirmada`, `video-enviado`
- Etiquetas que quita: `agenda-org`, `lead-setter-org`, `lead-org`, `confirmada`, `ghost-agenda`, `sin-confirmar`
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (plantillas `v2_confirmar_jose`, `wa_confirmacion_agenda_organica`, video selfie y un free-form) + Slack canales privados `4-nuevas-agendas` y `1-leads-conflicto`
- Nota: la rama `Branch` (decide sola) y la rama `None` de `No toma decisión` ejecutan secuencias idénticas y con la misma plantilla `v2_confirmar_jose` — están duplicadas

### [ADS] 4 · Recordatorios
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 154 totales / 3 activos
- ID: 825f4e87-319f-42c0-b345-40824c41910a
- Disparador: **Customer booked appointment** — nombre `Customer Booked Appointment`; `Contact only`; filtro: `In calendar` = `[A] Programa Éxito en Alimentación Infantil` (sin filtro de etiqueta)
- Acciones (lineal, sin ramas):
  1. Add contact tag — `Añadir Tag "Agenda-ADS"` → `agenda-ads`
  2. Wait — `Wait 24h` → hasta fecha programada (cita del disparador)
  3. Slack message — `Send notification to Slack` → canal público `5-llamadas-preparacion`
  4. Create opportunity — `Cambiar a Llamada en Preparación` → pipeline `② Agenda · WhatsApp [Anaís]`, etapa `Pre-Llamada (Preparación)`
  5. WhatsApp — `WhatsApp 24 hrs` → plantilla `wa_recordatorio_24h (es) - UTILITY`, desde `+52 1 984 404 6192 - default`
  6. Wait — `Wait 4h` → hasta fecha programada (cita)
  7. WhatsApp — `WhatsApp 4 hrs` → plantilla `wa_recordatorio_8h (es) - MARKETING`
  8. Wait — `Wait 1h` → hasta fecha programada (cita)
  9. WhatsApp — `WhatsApp 1 hr` → plantilla `wa_recordatorio_1h (es) - UTILITY`
  10. Wait — `35 min antes aviso Closer` → hasta fecha programada, `Before` la cita
  11. Slack message — `Send notification to Slack` → DM a usuario de Slack (el closer) → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `② Agenda · WhatsApp [Anaís]` — etapa `Pre-Llamada (Preparación)` (crea/mueve)
- Etiquetas que añade: `agenda-ads`. No quita ninguna.
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (plantillas `wa_recordatorio_24h`, `wa_recordatorio_8h`, `wa_recordatorio_1h`) + Slack canal público `5-llamadas-preparacion` y un DM

### [ADS] 4.1 · Cita Cancelada → frenar
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 61 totales / 0 activos
- ID: 336e1908-043f-4a33-b218-a824159bc817
- Disparador: **Appointment status** — nombre `Appointment Status`; `Contact only`; filtros: `Event type` = `Any`, `Appointment status is` = `cancelled`, `In calendar` = `[A] Programa Éxito en Alimentación Infantil`
- Acciones:
  1. Remove from workflow — `Remove from Workflow` → `Another workflow` → `[ADS] 4 · Recordatorios` → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: NO
- Etiquetas: ninguna (no añade ni quita)
- Mensajes: ninguno

### [ADS] 5 · Mover de Setter-ADS → Closer + Slack
- Carpeta: [ADS] Anuncios Facebook
- Estado: Publicado
- Enrollments: 145 totales / 0 activos
- ID: 8ab3d347-7826-403a-ac59-834b40e416c7
- Disparador: **Pipeline stage changed** — nombre `Pipeline Stage Changed`; filtros: `In pipeline` = `② Agenda · WhatsApp [Anaís]`, `Pipeline stage` = `Llamada Confirmada`
- Acciones:
  1. Create opportunity — `Create Or Update Opportunity` → pipeline `③ Llamadas · Closer [Rafa]`, etapa `Llamada Confirmada`
  2. Remove opportunity — `Eliminar de Pipeline Setter-Ads` → `All contact opportunities in the selected pipeline`, pipeline `② Agenda · WhatsApp [Anaís]`
  3. Slack message — `Send notification to Slack` → canal público `6-confirmaciones-llamadas` → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: SÍ
  - Lee (disparador): `② Agenda · WhatsApp [Anaís]` / etapa `Llamada Confirmada`
  - Crea: `③ Llamadas · Closer [Rafa]` / etapa `Llamada Confirmada`
  - Borra: todas las oportunidades del contacto en `② Agenda · WhatsApp [Anaís]`
- Etiquetas: ninguna (no añade ni quita)
- Mensajes: solo Slack, canal público `6-confirmaciones-llamadas`

## Subcarpeta `API Conversiones` (dentro de `[ADS] Anuncios Facebook`)

### Envío [Initiate Checkout] a Forms Calificados [ADS]
- Carpeta: [ADS] Anuncios Facebook → subcarpeta `API Conversiones`
- Estado: Publicado
- Enrollments: 135 totales / 0 activos
- ID: b24e3f47-dcae-4b41-905f-21011b52b8d8
- Disparador: **Survey submitted** — nombre `Survey Submitted`; filtro `Survey is` = `[SURVEY - ADS] Postulación ÉxiTO en Alimentación`
- Acciones:
  1. Wait — `Wait` → 2 `minutes`
  2. If/else — `Condition`
     - Rama `Branch`: (`Tags Includes survey-ads` + `tier-gold`) OR (`Tags Includes survey-ads` + `tier-silver`)
     - Rama `None` → END
  3. [Branch] Meta conversion API — `Meta Conversion API` → conexión `INTEGRATION`, event type `Funnel Event`, Dataset ID `1372444847951383`, Facebook event name `InitiateCheckout` (access token presente en el nodo; no se transcribe) → END
- TOCA ETAPAS DE PIPELINE: NO
- Etiquetas: solo lee `survey-ads`, `tier-gold`, `tier-silver`. No añade ni quita.
- Mensajes: ninguno (envía evento a Meta CAPI)

### Envío [Lead] a Llamadas Agendadas [ADS]
- Carpeta: [ADS] Anuncios Facebook → subcarpeta `API Conversiones`
- Estado: Publicado
- Enrollments: 32 totales / 0 activos
- ID: c3e365ba-550e-4840-b6b1-befdcce9caeb
- Disparador: **Customer booked appointment** — nombre `Customer Booked Appointment`; `Contact only`; filtro `In calendar` = `[A] Programa Éxito en Alimentación Infantil`
- Acciones:
  1. Meta conversion API — `Meta Conversion API` → `INTEGRATION`, event type `Funnel Event`, Dataset ID `1372444847951383`, Facebook event name `Lead` → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: NO
- Etiquetas: ninguna
- Mensajes: ninguno (evento a Meta CAPI)

### Envío [Purchase] en cambio Lead → Ventas High Ticket
- Carpeta: [ADS] Anuncios Facebook → subcarpeta `API Conversiones`
- Estado: Publicado
- Enrollments: 9 totales / 9 activos
- ID: b32d69b5-371b-4c57-84f8-3ad1f9e63a99
- Disparador: **Pipeline stage changed** — nombre `Oportunidad cambia a etapa Venta High Ticket`; filtros: `In pipeline` = `③ Llamadas · Closer [Rafa]`, `Pipeline stage` = `Cerrada (Venta)`, `Tag Equals to` = `lead-ads`
- Acciones:
  1. Wait — `Wait` → 10 `minutes`
  2. If/else — `Condition` → rama `Branch`: `Opportunity status Is won`; rama `None` → END
  3. [Branch] Meta conversion API — `Enviar evento de conversión a Facebook` → `INTEGRATION`, `Funnel Event`, Dataset ID `1372444847951383`, evento `Purchase`, value `1.500`, currency `USD`
  4. [Branch] Wait — `Wait` → 9999 `days` (retiene los contactos indefinidamente; explica los 9 activos) → END
- TOCA ETAPAS DE PIPELINE: SÍ (solo lectura, en el disparador)
  - Lee `③ Llamadas · Closer [Rafa]` / etapa `Cerrada (Venta)`
- Etiquetas: solo lee `lead-ads`. No añade ni quita.
- Mensajes: ninguno (evento a Meta CAPI)

### Envío [Schedule] a Llamadas Confirmadas [ADS]
- Carpeta: [ADS] Anuncios Facebook → subcarpeta `API Conversiones`
- Estado: Publicado
- Enrollments: 206 totales / 206 activos
- ID: 9f8d6a2c-1929-459a-b39e-0453ad7bb3fc
- Disparador: **Opportunity changed** — nombre `Opportunity Changed`; filtros: `In pipeline Equals` `③ Llamadas · Closer [Rafa]`, `Pipeline stage` = `Llamada Confirmada`
- Acciones:
  1. If/else — `Condition` → rama `Branch`: `Tags Includes lead-ads`; rama `None`
  2. [Branch] Meta conversion API — `Meta Conversion API` → `INTEGRATION`, `Funnel Event`, Dataset ID `1372444847951383`, evento `Schedule`, currency `USD`
  3. [Branch] Wait — `Lead Ads` → 9999 `days` → END
  4. [None] Wait — `Lead Org` → 9999 `days` → END
- TOCA ETAPAS DE PIPELINE: SÍ (solo lectura, en el disparador)
  - Lee `③ Llamadas · Closer [Rafa]` / etapa `Llamada Confirmada`
- Etiquetas: solo lee `lead-ads`. No añade ni quita.
- Mensajes: ninguno (evento a Meta CAPI)
- Nota: los dos `Wait` de 9999 días retienen a los 206 contactos activos dentro del workflow de forma permanente

---

# Carpeta `[ORG] Instagram Orgánico`

### [ORG] 1 · Calificación (Survey → Tier)
- Carpeta: [ORG] Instagram Orgánico → subcarpeta `LINK BIO`
- Estado: Publicado
- Enrollments: 23 totales / 0 activos
- ID: c98e6ba6-6154-4044-9bf5-77c756f608bf
- Disparador: **Survey submitted** — nombre `[SURVEY - ORG] Postulación`; filtro `Survey is` = `[SURVEY - ORG] Postulación ÉxiTO en Alimentación`
- Estructura: idéntica a `[ADS] 1` y `[SETTER - ORG] 1`
- Acciones:
  1. Add contact tag — `Añadir LEAD-ORG` → `survey-org`, `lead-org`
  2. If/else — `¿Profesional de salud?` → `SI Salud` / `NO Salud` / `None`
  3. [SI Salud] If/else — `Nivel inversión` → `No invierte` / `Bronce (200-500)` / `Silver (500-1.000)` / `Gold (1.000-2.000)` / `None`
  4. [No invierte] Create opportunity — `Crear en Descalificada` → pipeline `[SETTER - ORG] Formación`, etapa `Descalificada`
  5. [No invierte] `Set Tier OUT` (`Tier Score` = `tier-4-out`) → `Tag tier-out` (`sin-presupuesto`, `tier-out`) → END
  6. [Bronce] Create opportunity — `Crear Oportunidad [ORG] Formación - Formulario` → pipeline `[SETTER - ORG] Formación`, etapa `Formulario [ORG]`
  7. [Bronce] `Set Tier Bronce` (`tier-3-bronce`) → `Set Producto = ÉxiTO Certificación` (`exito-alimentacion`) → `Tag tier-bronce` (`tier-bronce`, `prospecto-exito`) → `Notificar Slack Lead-Bronce` (canal `1-leads-bronce`) → END
  8. [Silver] Create opportunity → mismo pipeline/etapa `Formulario [ORG]`; `Set Tier SILVER` (`tier-2-silver`); `Set Producto`; `Tags SILVER` (`tier-silver`, `prospecto-exito`); `Notificar Slack Lead-Silver` (`2-leads-silver`) → END
  9. [Gold] Create opportunity → mismo pipeline/etapa `Formulario [ORG]`; `Set Tier GOLD` (`tier-1-gold`); `Set Producto`; `Tags GOLD` (`presupuesto-alto`, `tier-gold`, `prospecto-exito`); `Notificar Slack Lead-Gold` (`3-leads-gold`) → END
  10. [Nivel inversión / None] `Lead Revisar` (`lead-revisar`) → `Slack Anaís Lead Fuera flujo` (canal `leads-conflictos`) → END
  11. [NO Salud] `Set Tier OUT` (`tier-4-out`) → `Tag tier-out` (`no-profesional-salud`) → END
  12. [¿Profesional? / None] `Lead Revisar` + `Slack Anaís Lead Fuera flujo` → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `[SETTER - ORG] Formación` — etapas `Descalificada` y `Formulario [ORG]`
- Etiquetas que añade: `survey-org`, `lead-org`, `sin-presupuesto`, `tier-out`, `tier-bronce`, `prospecto-exito`, `tier-silver`, `tier-gold`, `presupuesto-alto`, `lead-revisar`, `no-profesional-salud`. No quita ninguna.
- Mensajes: solo Slack (`1-leads-bronce`, `2-leads-silver`, `3-leads-gold`, `leads-conflictos`)

### [SETTER - ORG] 1 · Calificación (Survey → Tier)
- Carpeta: [ORG] Instagram Orgánico → subcarpeta `SETTER`
- Estado: Publicado
- Enrollments: 8 totales / 0 activos
- ID: 8439135d-6c4f-4f75-9e28-4e75e05bdf0d
- Disparador: **Survey submitted** — nombre `[SURVEY - SETTER- ORG] Postulación`; filtro `Survey is` = `[SURVEY - ORG SETTER] Postulación ÉxiTO en Alimentación`
- Estructura: idéntica a `[ADS] 1 · Calificación (Survey → Tier)` (mismas ramas `¿Profesional de salud?` → `Nivel inversión`)
- Acciones:
  1. Add contact tag — `Añadir LEAD-ORG` → `survey-org`, `lead-setter-org`
  2. If/else — `¿Profesional de salud?` → ramas `SI Salud` / `NO Salud` / `None`
  3. [SI Salud] If/else — `Nivel inversión` → ramas `No invierte` / `Bronce (200-500)` / `Silver (500-1.000)` / `Gold (1.000-2.000)` / `None`
  4. [No invierte] Create opportunity — `Crear en Descalificada` → pipeline `[SETTER - ORG] Formación`, etapa `Descalificada`
  5. [No invierte] Update contact field — `Set Tier OUT` → `Tier Score` = `tier-4-out`
  6. [No invierte] Add contact tag — `Tag tier-out` → `sin-presupuesto`, `tier-out` → END
  7. [Bronce] Create opportunity — `Crear Oportunidad [Setter-ORG] Formación - Formulario` → pipeline `[SETTER - ORG] Formación`, etapa `Formulario [ORG]`
  8. [Bronce] Update contact field — `Set Tier Bronce` → `Tier Score` = `tier-3-bronce`
  9. [Bronce] Update contact field — `Set Producto = ÉxiTO Certificación` → `Producto Recomendado` = `exito-alimentacion`
  10. [Bronce] Add contact tag — `Tag tier-bronce` → `tier-bronce`, `prospecto-exito`
  11. [Bronce] Slack message — `Notificar Slack Lead-Bronce` → canal público `1-leads-bronce` → END
  12. [Silver] Create opportunity — `Crear Oportunidad [Setter-ORG] Formación - Formulario` → pipeline `[SETTER - ORG] Formación`, etapa `Formulario [ORG]`
  13-16. [Silver] `Set Tier SILVER` (`tier-2-silver`) → `Set Producto = ÉxiTO Certificación` (`exito-alimentacion`) → `Tags SILVER` (`tier-silver`, `prospecto-exito`) → `Notificar Slack Lead-Silver` (canal `2-leads-silver`) → END
  17. [Gold] Create opportunity — `Crear Oportunidad [Setter-ORG] Formación - Formulario` → pipeline `[SETTER - ORG] Formación`, etapa `Formulario [ORG]`
  18-21. [Gold] `Set Tier GOLD` (`tier-1-gold`) → `Set Producto = ÉxiTO Certificación` → `Tags GOLD` (`presupuesto-alto`, `tier-gold`, `prospecto-exito`) → `Notificar Slack Lead-Gold` (canal `3-leads-gold`) → END
  22. [Nivel inversión / None] Add contact tag — `Lead Revisar` → `lead-revisar`
  23. [Nivel inversión / None] Slack message — `Slack Anaís Lead Fuera flujo` → canal público `leads-conflictos` → END
  24. [NO Salud] Update contact field — `Set Tier OUT` → `Tier Score` = `tier-4-out`
  25. [NO Salud] Add contact tag — `Tag tier-out` → `no-profesional-salud` → END
  26. [¿Profesional? / None] `Lead Revisar` + `Slack Anaís Lead Fuera flujo` → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `[SETTER - ORG] Formación` — etapas `Descalificada` (crea) y `Formulario [ORG]` (crea, x3)
- Etiquetas que añade: `survey-org`, `lead-setter-org`, `sin-presupuesto`, `tier-out`, `tier-bronce`, `prospecto-exito`, `tier-silver`, `tier-gold`, `presupuesto-alto`, `lead-revisar`, `no-profesional-salud`. No quita ninguna.
- Mensajes: solo Slack (`1-leads-bronce`, `2-leads-silver`, `3-leads-gold`, `leads-conflictos`)

### [ORG] 2 · Agenda + Ghost
- Carpeta: [ORG] Instagram Orgánico
- Estado: Publicado
- Enrollments: 270 totales / 1 activo
- ID: 851e8b99-a23c-44c3-b873-f5ee439061df
- Disparadores (2, **Contact Tag / Contact Tag Added**):
  1. `Tag added includes "tier-silver"`
  2. `Tag added includes "tier-gold"`
  (a diferencia de `[ADS] 2`, **no** hay disparador para `tier-bronce`)
- Acciones:
  1. If/else — `¿Es ORG?` → rama `SI`: `Tags Includes lead-org`; rama `None` → END
  2. [SI] Wait — `Wait 2 Horas` → 2 `hours`
  3. If/else — `¿Ya agendó?` → rama `SI`: `Tags Includes agenda-org` (+ condiciones de última cita, igual que en ADS) → END; rama `NO`: `Tags Does not include agenda-org` → continúa; rama `None` → END
  4. [NO] Add contact tag — `Añadir Ghost Agenda` → `ghost-agenda`
  5. [NO] Create opportunity — `Cambiar a Ghost Agenda` → pipeline `[SETTER - ORG] Formación`, etapa `Ghost Intento Agenda`
  6. [NO] WhatsApp — `WhatsApp No Agendó (Follow Up Agenda)` → desde `+52 1 984 404 6192 - default`, plantilla `ghost_agenda_ads (es) - MARKETING`
  7. [NO] Slack message — `Notificación Slack Anaís` → canal privado `1-leads-conflicto` → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `[SETTER - ORG] Formación` — etapa `Ghost Intento Agenda` (crea/mueve)
- Etiquetas que añade: `ghost-agenda`. Lee: `lead-org`, `agenda-org`, `tier-silver`, `tier-gold`. No quita ninguna.
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (plantilla `ghost_agenda_ads`, la misma que usa el flujo de ADS) + Slack canal privado `1-leads-conflicto`

### [ORG] 3 · Confirmación de cita
- Carpeta: [ORG] Instagram Orgánico
- Estado: Publicado
- Enrollments: 34 totales / 0 activos
- ID: 4a74420d-eb24-45fb-98b3-b9af3bd41552
- Disparador: **Customer booked appointment** — nombre `Customer Booked Appointment`; `Contact only`; filtro `In calendar` = `[ORG] Programa Éxito en Alimentación Infantil` (sin filtro de etiqueta)
- Estructura: espejo de `[ADS] 3 · Confirmación de cita`
- Acciones:
  1. Create opportunity — `Cambiar a Nueva Agenda` → pipeline `[SETTER - ORG] Formación`, etapa `Nuevas Agendas`
  2. Remove contact tag — `Remove Tag` → quita `agenda-ads`, `lead-ads`
  3. Add contact tag — `Add tag: agenda-org` → `agenda-org`
  4. If/else — `¿Primera vez o re-agenda?` → `PRIMERA VEZ (NO video-enviado)` (`Tags Does not include video-enviado`) / `RE-AGENDA (SÍ video-enviado` (`Tags Includes video-enviado`) / `None`
  5. [PRIMERA VEZ] If/else — `No toma decisión` → rama `Branch` (`¿Quién debe estar contigo en la reunión ...` Is `Solo yo, tomo la decisión por mi cuenta.`) y rama `None`; ambas ejecutan la misma secuencia
  6. Slack message — `Slack #4-nuevas-agendas` → canal privado `4-nuevas-agendas`
  7. WhatsApp — `WhatsApp – Template confirmación (botón "Confirmar")` → plantilla `v2_confirmar_jose (es) - MARKETING`, desde `+52 1 984 404 6192 - default`, branches activados → `Undelivered` / `Confirmar` / `Time Out`
  8. [Undelivered] `Slack Anaís` (canal privado `1-leads-conflicto`) → `Add tag sin-confirmar` (`sin-confirmar`) → END
  9. [Time Out] `Slack Anaís` → `Add tag sin-confirmar` (`sin-confirmar`) → END
  10. [Confirmar] `Remove Tag` (quita `confirmada`, `ghost-agenda`, `sin-confirmar`) → `Wait` (1 min) → `Add Tag → confirmada` (`confirmada`) → `Espera 3 min NO BOT ("Grabando Video")` → `Video Selfie` (WhatsApp media, video) → `Add Tag → video-enviado` (`video-enviado`) → `Espera 5 min NO BOT (Contacto Rafa)` → `WhatsApp Rafa` (free form) → END
  11. [RE-AGENDA] `Slack #4-nuevas-agendas` → `WhatsApp Rafa` (plantilla `wa_confirmacion_agenda_organica (es) - MARKETING`) → `Remove Tag` → `Wait` → `Add Tag → confirmada` → END
  12. [None] → END
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `[SETTER - ORG] Formación` — etapa `Nuevas Agendas` (crea/mueve)
- Etiquetas que añade: `agenda-org`, `sin-confirmar`, `confirmada`, `video-enviado`
- Etiquetas que quita: `agenda-ads`, `lead-ads`, `confirmada`, `ghost-agenda`, `sin-confirmar`
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (plantillas `v2_confirmar_jose`, `wa_confirmacion_agenda_organica`, video selfie, free-form) + Slack canales privados `4-nuevas-agendas` y `1-leads-conflicto`

### [ORG] 4 · Recordatorios
- Carpeta: [ORG] Instagram Orgánico
- Estado: Publicado
- Enrollments: 37 totales / 2 activos
- ID: 5296147d-09c2-4f99-9cb1-6737e0531fef
- Disparador: **Customer booked appointment** — nombre `Customer Booked Appointment`; `Contact only`; filtro `In calendar` = `[ORG] Programa Éxito en Alimentación Infantil`
- Acciones (lineal, sin ramas):
  1. Add contact tag — `Add Tag` → `agenda-org`
  2. Wait — `Wait 24h` → hasta fecha programada (cita del disparador)
  3. Slack message — `Send notification to Slack` → canal **privado** `5-llamadas-preparacion`
  4. Create opportunity — `Cambiar a Llamada en Preparación` → pipeline `[SETTER - ORG] Formación`, etapa `Llamada Preparación`
  5. WhatsApp — `WhatsApp 24 hrs` → plantilla `wa_recordatorio_24h (es) - UTILITY`
  6. Wait — `Wait 4h`
  7. WhatsApp — `WhatsApp 4 hrs` → plantilla `wa_recordatorio_8h (es) - MARKETING`
  8. Wait — `Wait 1h`
  9. WhatsApp — `WhatsApp 1 hr` → plantilla `wa_recordatorio_1h (es) - UTILITY`
  10. Wait — `35 min antes aviso Closer` → antes de la cita
  11. Slack message — `Send notification to Slack` → DM a usuario de Slack (el closer) → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: SÍ
  - Pipeline `[SETTER - ORG] Formación` — etapa `Llamada Preparación` (crea/mueve)
- Etiquetas que añade: `agenda-org`. No quita ninguna.
- Mensajes: WhatsApp desde `+52 1 984 404 6192` (mismas plantillas que el flujo de ADS) + Slack canal privado `5-llamadas-preparacion` y un DM

### [ORG] 4.1 · Cita Cancelada → frenar
- Carpeta: [ORG] Instagram Orgánico
- Estado: Publicado
- Enrollments: 15 totales / 0 activos
- ID: 12157a7b-f140-4a45-8799-c5d0140792c7
- Disparador: **Appointment status** — nombre `Appointment Status`; `Contact only`; filtros: `Event type` = `Normal`, `Appointment status is` = `cancelled`, `In calendar` = `[ORG] Programa Éxito en Alimentación Infantil`
  (diferencia con `[ADS] 4.1`: allí `Event type` es `Any`)
- Acciones:
  1. Remove from workflow — `Remove from Workflow` → `Another workflow` → `[ORG] 4 · Recordatorios` → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: NO
- Etiquetas: ninguna
- Mensajes: ninguno

### [ORG] 5 · Mover de Setter-ADS → Closer + Slack
- Carpeta: [ORG] Instagram Orgánico
- Estado: Publicado
- Enrollments: 29 totales / 0 activos
- ID: c0eead4d-18d2-4f65-9dd1-d7982e60297a
- Disparador: **Pipeline stage changed** — nombre `Pipeline Stage Changed`; filtros: `In pipeline` = `[SETTER - ORG] Formación`, `Pipeline stage` = `Llamada Confirmada`
- Acciones:
  1. Create opportunity — `Create Or Update Opportunity` → pipeline `③ Llamadas · Closer [Rafa]`, etapa `Llamada Confirmada`
  2. Remove opportunity — `Eliminar de Pipeline Setter-Ads` → `All contact opportunities in the selected pipeline`, pipeline `[SETTER - ORG] Formación`
  3. Slack message — `Send notification to Slack` → canal **privado** `5-confirmaciones-llamadas` → END
- Ramas / condiciones: ninguna
- TOCA ETAPAS DE PIPELINE: SÍ
  - Lee (disparador): `[SETTER - ORG] Formación` / etapa `Llamada Confirmada`
  - Crea: `③ Llamadas · Closer [Rafa]` / etapa `Llamada Confirmada`
  - Borra: todas las oportunidades del contacto en `[SETTER - ORG] Formación`
- Etiquetas: ninguna
- Mensajes: solo Slack, canal privado `5-confirmaciones-llamadas`
- Nota: el nombre del workflow y del nodo dicen "Setter-ADS", pero opera sobre el pipeline orgánico `[SETTER - ORG] Formación`

---

# Tabla resumen

| Workflow | Carpeta | Estado | Disparador | ¿Toca etapas? | Etapas que toca |
|---|---|---|---|---|---|
| `[ADS] 1 · Calificación (Survey → Tier)` | [ADS] | Publicado | Survey submitted — `[SURVEY - ADS] Postulación ÉxiTO en Alimentación` | **SÍ** | `② Agenda · WhatsApp [Anaís]`: `Calificada (Formulario)` (crea ×3) + **1 creación con etapa vacía** ⚠ |
| `[ADS] 2 · Agenda + Ghost` | [ADS] | Publicado | Contact Tag Added ×3 — `tier-silver`, `tier-gold`, `tier-bronce` | **SÍ** | `② Agenda · WhatsApp [Anaís]`: `Sin Agendar (Ghost)` |
| `[ADS] 3 · Confirmación de cita` | [ADS] | Publicado | Customer booked appointment — calendario `[A] Programa Éxito en Alimentación Infantil` + tag `lead-ads` | **SÍ** | `② Agenda · WhatsApp [Anaís]`: `Nueva Agenda` |
| `[ADS] 4 · Recordatorios` | [ADS] | Publicado | Customer booked appointment — calendario `[A] Programa Éxito en Alimentación Infantil` | **SÍ** | `② Agenda · WhatsApp [Anaís]`: `Pre-Llamada (Preparación)` |
| `[ADS] 4.1 · Cita Cancelada → frenar` | [ADS] | Publicado | Appointment status `cancelled` — calendario `[A] Programa Éxito en Alimentación Infantil` | NO | — |
| `[ADS] 5 · Mover de Setter-ADS → Closer + Slack` | [ADS] | Publicado | Pipeline stage changed — `② Agenda · WhatsApp [Anaís]` / `Llamada Confirmada` | **SÍ** | Lee `② Agenda · WhatsApp [Anaís]` / `Llamada Confirmada`; crea `③ Llamadas · Closer [Rafa]` / `Llamada Confirmada`; **borra todas** las oportunidades en `② Agenda · WhatsApp [Anaís]` |
| `Envío [Initiate Checkout] a Forms Calificados [ADS]` | [ADS] › API Conversiones | Publicado | Survey submitted — `[SURVEY - ADS] Postulación ÉxiTO en Alimentación` | NO | — |
| `Envío [Lead] a Llamadas Agendadas [ADS]` | [ADS] › API Conversiones | Publicado | Customer booked appointment — calendario `[A] Programa Éxito en Alimentación Infantil` | NO | — |
| `Envío [Purchase] en cambio Lead → Ventas High Ticket` | [ADS] › API Conversiones | Publicado | Pipeline stage changed — `③ Llamadas · Closer [Rafa]` / `Cerrada (Venta)` + tag `lead-ads` | SÍ (solo lee) | Lee `③ Llamadas · Closer [Rafa]` / `Cerrada (Venta)` |
| `Envío [Schedule] a Llamadas Confirmadas [ADS]` | [ADS] › API Conversiones | Publicado | Opportunity changed — `③ Llamadas · Closer [Rafa]` / `Llamada Confirmada` | SÍ (solo lee) | Lee `③ Llamadas · Closer [Rafa]` / `Llamada Confirmada` |
| `[ORG] 1 · Calificación (Survey → Tier)` | [ORG] › LINK BIO | Publicado | Survey submitted — `[SURVEY - ORG] Postulación ÉxiTO en Alimentación` | **SÍ** | `[SETTER - ORG] Formación`: `Descalificada`, `Formulario [ORG]` (crea ×3) |
| `[SETTER - ORG] 1 · Calificación (Survey → Tier)` | [ORG] › SETTER | Publicado | Survey submitted — `[SURVEY - ORG SETTER] Postulación ÉxiTO en Alimentación` | **SÍ** | `[SETTER - ORG] Formación`: `Descalificada`, `Formulario [ORG]` (crea ×3) |
| `[ORG] 2 · Agenda + Ghost` | [ORG] | Publicado | Contact Tag Added ×2 — `tier-silver`, `tier-gold` | **SÍ** | `[SETTER - ORG] Formación`: `Ghost Intento Agenda` |
| `[ORG] 3 · Confirmación de cita` | [ORG] | Publicado | Customer booked appointment — calendario `[ORG] Programa Éxito en Alimentación Infantil` | **SÍ** | `[SETTER - ORG] Formación`: `Nuevas Agendas` |
| `[ORG] 4 · Recordatorios` | [ORG] | Publicado | Customer booked appointment — calendario `[ORG] Programa Éxito en Alimentación Infantil` | **SÍ** | `[SETTER - ORG] Formación`: `Llamada Preparación` |
| `[ORG] 4.1 · Cita Cancelada → frenar` | [ORG] | Publicado | Appointment status `cancelled`, event type `Normal` — calendario `[ORG] Programa Éxito en Alimentación Infantil` | NO | — |
| `[ORG] 5 · Mover de Setter-ADS → Closer + Slack` | [ORG] | Publicado | Pipeline stage changed — `[SETTER - ORG] Formación` / `Llamada Confirmada` | **SÍ** | Lee `[SETTER - ORG] Formación` / `Llamada Confirmada`; crea `③ Llamadas · Closer [Rafa]` / `Llamada Confirmada`; **borra todas** las oportunidades en `[SETTER - ORG] Formación` |

## Etapas de pipeline referenciadas, agrupadas

**`② Agenda · WhatsApp [Anaís]`** (antes `② [SETTER - ADS]`)

| Etapa | Quién la toca | Cómo |
|---|---|---|
| *(etapa vacía)* ⚠ | `[ADS] 1` | crea |
| `Calificada (Formulario)` | `[ADS] 1` | crea (×3, una por tier) |
| `Sin Agendar (Ghost)` | `[ADS] 2` | crea / mueve |
| `Nueva Agenda` | `[ADS] 3` | crea / mueve |
| `Pre-Llamada (Preparación)` | `[ADS] 4` | crea / mueve |
| `Llamada Confirmada` | `[ADS] 5` | lee (disparador) |
| *(todas)* | `[ADS] 5` | borra las oportunidades del contacto |

**`[SETTER - ORG] Formación`**

| Etapa | Quién la toca | Cómo |
|---|---|---|
| `Descalificada` | `[ORG] 1`, `[SETTER - ORG] 1` | crea |
| `Formulario [ORG]` | `[ORG] 1`, `[SETTER - ORG] 1` | crea (×3, una por tier) |
| `Ghost Intento Agenda` | `[ORG] 2` | crea / mueve |
| `Nuevas Agendas` | `[ORG] 3` | crea / mueve |
| `Llamada Preparación` | `[ORG] 4` | crea / mueve |
| `Llamada Confirmada` | `[ORG] 5` | lee (disparador) |
| *(todas)* | `[ORG] 5` | borra las oportunidades del contacto |

**`③ Llamadas · Closer [Rafa]`** (antes `③ [CLOSER] Agenda`)

| Etapa | Quién la toca | Cómo |
|---|---|---|
| `Llamada Confirmada` | `[ADS] 5`, `[ORG] 5` | crea |
| `Llamada Confirmada` | `Envío [Schedule] a Llamadas Confirmadas [ADS]` | lee (disparador) |
| `Cerrada (Venta)` | `Envío [Purchase] en cambio Lead → Ventas High Ticket` | lee (disparador) |

## Etiquetas, consolidado

**Se añaden:** `survey-ads`, `lead-ads`, `survey-org`, `lead-org`, `lead-setter-org`,
`agenda-ads`, `agenda-org`, `ghost-agenda`, `confirmada`, `sin-confirmar`, `video-enviado`,
`tier-out`, `tier-bronce`, `tier-silver`, `tier-gold`, `presupuesto-alto`, `sin-presupuesto`,
`prospecto-exito`, `lead-revisar`, `no-profesional-salud`

**Se quitan:** `agenda-org`, `lead-setter-org`, `lead-org` (en `[ADS] 3`); `agenda-ads`,
`lead-ads` (en `[ORG] 3`); `confirmada`, `ghost-agenda`, `sin-confirmar` (en ambos flujos 3)

**Solo se leen (condiciones/disparadores):** `lead-ads`, `lead-org`, `agenda-ads`,
`agenda-org`, `video-enviado`, `tier-bronce`, `tier-silver`, `tier-gold`

**Contraste con el listado del encargo:** todas las etiquetas que enumera el encargo
aparecen en al menos un workflow de estas carpetas. Además hay dos que el encargo no
listaba y que sí se escriben: `lead-revisar` y `no-profesional-salud`.

## Campos de contacto que escriben los workflows

| Campo | Valores usados | Quién lo escribe |
|---|---|---|
| `Tier Score` | `tier-1-gold`, `tier-2-silver`, `tier-3-bronce`, `tier-4-out` | `[ADS] 1`, `[ORG] 1`, `[SETTER - ORG] 1` |
| `Producto Recomendado` | `exito-alimentacion` | `[ADS] 1`, `[ORG] 1`, `[SETTER - ORG] 1` |

## Canales de WhatsApp y Slack

- **Único número emisor de WhatsApp:** `+52 1 984 404 6192 - default`
- **Plantillas usadas:** `ghost_agenda_ads`, `v2_confirmar_jose`,
  `wa_confirmacion_agenda_organica`, `wa_recordatorio_24h`, `wa_recordatorio_8h`,
  `wa_recordatorio_1h`, más un envío de video (WhatsApp media) y un mensaje libre
- **Canales de Slack:** `1-leads-bronce`, `2-leads-silver`, `3-leads-gold`,
  `4-nuevas-agendas`, `5-llamadas-preparacion`, `6-confirmaciones-llamadas`,
  `5-confirmaciones-llamadas`, `1-leads-conflicto`, `leads-conflictos`, más DMs a
  usuarios internos

## Fuera de alcance

- `[General] WF-01 Entrega de Regalo Asistentes Llamada` (121 inscritos / 0 activos,
  Publicado) está en `Marketing` pero **fuera** de las dos carpetas pedidas, así que no
  se documentó.

## Notas de lectura

- Los valores de respuesta de encuesta dentro de los if/else aparecen truncados en la
  interfaz de GHL. Quedaron anotados tal como se ven, con los puntos suspensivos:
  `Nutricionista / Fonoaudióloga / ...` y `Otro profesional de la salud qu...`.
- Los nodos `Meta conversion API` contienen un access token visible en pantalla.
  **No se transcribió** en este documento; sí se dejó el Dataset ID (`1372444847951383`),
  que es el identificador del pixel.
