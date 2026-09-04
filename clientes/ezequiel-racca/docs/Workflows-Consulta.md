# Workflows del embudo a consulta — Ezequiel Racca

> Cómo se automatiza el embudo **Instagram → landing con VSL → pago (Hotmart) →
> agenda (calendario GHL) → consulta**. Es el documento de montaje: qué workflow
> existe, cuál falta, y nodo por nodo qué va adentro.
>
> Subcuenta GHL: **Ezequiel Racca** (`KG0HeFXOJjAdf0BYP6oy`).
> Los tres mensajes que pidió Ezequiel — confirmación, pagada sin agenda y los
> recordatorios de 24 h / 4 h / 1 h — salen de los workflows **CONSULTA 2, 3 y 4**.

---

## 1. El embudo, en una línea

```
Reel / anuncio  →  perfil IG  →  landing VSL  →  botón de compra (Hotmart)
                                                        │
                                        webhook "compra aprobada"
                                                        ↓
                                              CONSULTA 1 · contacto + tag
                                                        │
                          ┌─────────────────────────────┴─────────────────────────────┐
                    agenda enseguida                                       no agenda (cierra el navegador)
                          ↓                                                             ↓
              CONSULTA 2 · confirmación                              CONSULTA 3 · "pagada sin agenda"
                          ↓                                                (reintentos 20 min / 3 h / 24 h / 48 h)
              CONSULTA 4 · recordatorios 24 h · 4 h · 1 h                             │
                          ↑                                                            │
                          └──────────────── al agendar, vuelve al carril de arriba ────┘
```

La pieza que rompe el embudo si no se monta es **CONSULTA 3**: en un flujo
"pagar primero, agendar después" siempre hay gente que paga y no elige horario.
Es el dinero ya cobrado que se pierde por no mandar un mensaje.

---

## 2. Lo que ya existe en la subcuenta (verificado por API)

### Calendario

| Campo | Valor |
|---|---|
| Nombre | **Consulta Sana tu Autoinmune** |
| ID | `GNMq6LBQUPnrbt8pBXCn` |
| Slug | `consulta-sana-autoinmune` |
| Duración | 60 min (intervalos de 30) |
| Confirmación automática | **Sí** (`autoConfirm: true`) |
| Videollamada | Google Meet (link generado por cita) |
| Antelación mínima para reservar | **12 horas** ⚠️ (ver §7.1) |
| Ventana de reserva | 5 días hacia adelante |
| Reprogramar / cancelar por el cliente | **Deshabilitado** ⚠️ (ver §7.2) |
| Tras reservar | redirige a `https://ezequielracca.com/confirmacionconsulta` |

### Etiquetas ya creadas (las que usa este embudo)

| Tag | Significado |
|---|---|
| `compra-consulta` | Pagó la consulta en Hotmart |
| `consulta-agendada` | Eligió horario en el calendario |
| `sin-confirmar` | Agendó pero no confirmó asistencia |
| `confirmada` | Confirmó que asiste |
| `ghost-agenda` | Pagó y no agendó tras toda la secuencia (o no se presentó) |

*(La subcuenta tiene además `lead-ads`, `lead-org`, `survey-*`, `tier-*`, etc.,
que pertenecen al embudo anterior de llamada gratuita y no se tocan aquí.)*

### Workflows existentes

| Workflow | Estado | Qué hace hoy |
|---|---|---|
| `Webhook Hotmart - Compra Aprobada (TAG)` | publicado | Webhook entrante → Crear contacto → Wait → Add Tag |
| `Consulta Agendada - Añadir TAG` | publicado | Cita reservada en el calendario → Add Tag |
| `Mensajes de Confirmación` | **borrador** | Tag añadido → Wait → Condition con 3 ramas **vacías** |
| `[ADS] 1…5` | publicados | Embudo anterior (llamada gratuita: survey → tier → agenda → recordatorios). **No pertenecen a este embudo** — ver §7.5 |

Los tres primeros son el esqueleto correcto. Lo que sigue los completa y agrega
las dos piezas que faltan (recordatorios y freno por cancelación).

---

## 3. Mapa de estados

Un contacto de este embudo está siempre en uno de estos estados, y el estado se
lee por etiquetas. Sin este mapa los workflows se pisan entre sí.

| Estado | Etiquetas | Qué mensaje le corresponde |
|---|---|---|
| Pagó, no agendó | `compra-consulta` | `consulta_pagada_sin_agenda` (y reintentos) |
| Pagó y agendó | `compra-consulta` + `consulta-agendada` | `consulta_agendada_confirmacion` + recordatorios |
| Agendó y confirmó | + `confirmada` | recordatorios |
| Se le pasó todo | `compra-consulta` + `ghost-agenda` | seguimiento manual de Ezequiel |

**Regla de oro:** `consulta-agendada` se pone y se quita **solo** desde los
workflows del calendario (CONSULTA 2 y 5). Nunca a mano, nunca desde otro sitio.

---

## 4. Los cinco workflows

### CONSULTA 1 · Hotmart compra aprobada → contacto + tag
*(ajustar el workflow existente `Webhook Hotmart - Compra Aprobada (TAG)`)*

**Trigger:** Webhook entrante (URL ya pegada en Hotmart).

| # | Nodo | Configuración |
|---|---|---|
| 1 | **Filtro del trigger** | Solo `event = PURCHASE_APPROVED`. Hoy dice "No se han aplicado filtros": sin esto entran reembolsos, disputas y compras pendientes como si fueran ventas. |
| 2 | **Crear/actualizar contacto** | Buscar por **email**, y si no hay, por teléfono. Mapear: `buyer.name` → nombre · `buyer.email` → email · `buyer.checkout_phone` → teléfono en **E.164** (§7.3) · `purchase.transaction` → campo `id_transaccion` (crear el campo) · `purchase.order_date` → `fecha_pago`. |
| 3 | **If/Else — ¿ya tiene `compra-consulta`?** | Sí → **End**. Hotmart reintenta el webhook y manda `PURCHASE_APPROVED` más de una vez; sin este corte se duplica la secuencia entera y la persona recibe todo dos veces. |
| 4 | **Add Tag** | `compra-consulta` |
| 5 | *(opcional)* **Crear oportunidad** | Pipeline de consulta, etapa "Consulta pagada". Deja la métrica de pagos ↔ agendas visible sin exportar nada. |

> El `Wait` que hay hoy entre "Crear contacto" y "Add Tag" puede quedarse (2-3 min
> ayuda a que el contacto termine de escribirse antes de disparar por etiqueta),
> pero no reemplaza al corte por duplicados del paso 3.

---

### CONSULTA 2 · Cita reservada → tag + mensaje de confirmación
*(el workflow `Consulta Agendada - Añadir TAG` + el mensaje que hoy falta)*

**Trigger:** *Cita reservada por el cliente* — filtros: `En el calendario` **is**
`Consulta Sana tu Autoinmune`, `Contact Mode` = `contact`.

| # | Nodo | Configuración |
|---|---|---|
| 1 | **Add Tag** | `consulta-agendada`, `sin-confirmar` |
| 2 | **Remove Tag** | `ghost-agenda` (por si venía de la secuencia de recuperación) |
| 3 | **Remove From Workflow** | `CONSULTA 3 · Pagada sin agenda` — corta el acoso a alguien que ya agendó. **Este nodo es el que evita el error más caro del embudo:** que a la persona que acaba de elegir horario le siga llegando "falta que elijas la hora". |
| 4 | **If/Else — ¿tiene `compra-consulta`?** | **No** → rama de aviso interno (agendó sin pagar: notificación a Ezequiel + Add Tag `lead-revisar`). **Sí** → sigue. |
| 5 | **Enviar WhatsApp** | Plantilla `consulta_agendada_confirmacion` (mapeo en §6) |
| 6 | *(opcional)* **Email de respaldo** | Mismo contenido + link de Meet. Cubre a quien tenga el WhatsApp mal cargado. |

**Por qué la confirmación vive acá y no en el workflow de la etiqueta de pago:**
así sale **una sola vez y siempre**, sin importar el orden — agende a los 30
segundos de pagar o a los dos días, después del mensaje de recuperación. El
workflow `Mensajes de Confirmación` (hoy en borrador, disparado por
`Etiqueta añadida ~ "compra-…"`) no puede cubrir el segundo caso: cuando esa
etiqueta se añade, la persona todavía no agendó, y su rama "Incluye Agendada"
nunca se cumple. **Recomendación: no publicarlo** — su rama útil es CONSULTA 3.

---

### CONSULTA 3 · Pagó y no agendó *(el que hay que crear)*

**Trigger:** *Etiqueta de contacto añadida* = `compra-consulta`.

Todos los pasos van con el mismo patrón: esperar → comprobar si ya agendó →
mandar o terminar. La comprobación antes de cada envío es red de seguridad por
si el nodo "Remove From Workflow" de CONSULTA 2 falla o la persona entra dos veces.

| # | Nodo | Configuración |
|---|---|---|
| 1 | **Wait** | 20 minutos *(ventana para que agende en la misma sesión; no mandar antes o le llega mientras está eligiendo horario)* |
| 2 | **If/Else** | `Tags` **incluye** `consulta-agendada` → **End**. Si no → sigue |
| 3 | **Enviar WhatsApp** | Plantilla `consulta_pagada_sin_agenda` |
| 4 | **Wait** | 3 horas |
| 5 | **If/Else** | ¿ya agendó? → End. Si no → sigue |
| 6 | **Enviar WhatsApp** | `consulta_pagada_sin_agenda` (2.º toque) |
| 7 | **Wait** | 24 horas |
| 8 | **If/Else** | ¿ya agendó? → End. Si no → sigue |
| 9 | **Enviar WhatsApp** | `consulta_pagada_sin_agenda` (3.º toque) |
| 10 | **Wait** | 48 horas |
| 11 | **If/Else** | ¿ya agendó? → End. Si no → sigue |
| 12 | **Add Tag** + **Notificación interna** | `ghost-agenda` + aviso a Ezequiel (email/Slack) con nombre, teléfono y fecha de pago → **lo llama él**. Es alguien que ya pagó: no se archiva, se persigue a mano. |

**Configuración del workflow (pestaña Configuración):**
- *Allow re-entry:* **No** (si vuelve a comprar, entra por otro contacto/otro flujo).
- *Stop on response:* **Sí** — si la persona contesta al WhatsApp, se frena la
  secuencia y la conversación pasa a manos de Ezequiel.
- *Ventana horaria:* enviar solo entre **09:00 y 21:00** (zona horaria de la
  subcuenta). El toque de 3 h no debe caer a las 3 de la mañana.

---

### CONSULTA 4 · Recordatorios 24 h / 4 h / 1 h *(el que hay que crear)*

**Trigger:** *Cita reservada por el cliente* — mismos filtros que CONSULTA 2
(calendario `Consulta Sana tu Autoinmune`).

Los `Wait` son de tipo **"Esperar hasta la hora de la cita menos X"** (no esperas
relativas): así el recordatorio se ancla a la cita, no al momento en que reservó.

| # | Nodo | Configuración |
|---|---|---|
| 1 | **Wait** | Hasta *hora de la cita − 24 h* |
| 2 | **If/Else** | Estado de la cita **no** es `cancelled` (ni `showed`) → sigue |
| 3 | **Enviar WhatsApp** | `recordatorio_24_horas` |
| 4 | **Wait** | Hasta *hora de la cita − 4 h* |
| 5 | **If/Else** | Cita no cancelada → sigue |
| 6 | **Enviar WhatsApp** | `recordatorio_4_horas` |
| 7 | **Wait** | Hasta *hora de la cita − 1 h* |
| 8 | **If/Else** | Cita no cancelada → sigue |
| 9 | **Enviar WhatsApp** | `recordatorio_1_hora` (lleva el **link de Meet**) |

**Configuración:** *Allow re-entry:* **Sí** — hace falta para que una cita
reprogramada vuelva a generar su tanda de recordatorios.

⚠️ Con la antelación mínima actual de **12 horas**, quien reserva para el día
siguiente temprano puede quedarse sin el recordatorio de 24 h (o recibirlo tarde,
diciendo "mañana" cuando ya es hoy). Cómo resolverlo, en §7.1.

---

### CONSULTA 5 · Cita cancelada o reprogramada → frenar *(el que hay que crear)*

Sin este workflow, una cita cancelada sigue mandando "mañana a las 18 h tenemos
la sesión". Es el equivalente al `[ADS] 4.1` del embudo anterior.

**Trigger:** *Estado de la cita* = `cancelled` (calendario Consulta Sana tu Autoinmune).

| # | Nodo | Configuración |
|---|---|---|
| 1 | **Remove From Workflow** | `CONSULTA 4 · Recordatorios` |
| 2 | **Remove Tag** | `consulta-agendada`, `sin-confirmar`, `confirmada` |
| 3 | **If/Else — ¿tiene `compra-consulta`?** | Sí → **Add to Workflow** `CONSULTA 3` (pagó y volvió a quedarse sin horario: hay que hacerlo agendar de nuevo). No → End. |

*(Una reprogramación dispara cancelación + nueva reserva: el nodo 1 corta la tanda
vieja y CONSULTA 4, con re-entry activado, arranca la nueva. Por eso el orden de
estos nodos importa.)*

---

## 5. Resumen de montaje

| Workflow | Acción | Prioridad |
|---|---|---|
| CONSULTA 1 · Hotmart | Ajustar el existente (filtro de evento + corte de duplicados) | Alta |
| CONSULTA 2 · Confirmación | Ampliar `Consulta Agendada - Añadir TAG` con el mensaje | **Crítica** |
| CONSULTA 3 · Pagada sin agenda | Crear de cero | **Crítica** |
| CONSULTA 4 · Recordatorios | Crear de cero | Alta |
| CONSULTA 5 · Cancelada | Crear de cero | Media |
| `Mensajes de Confirmación` (borrador) | No publicar; su lógica queda en 2 y 3 | — |

Sugerencia de nombres para que convivan con la serie vieja sin confusión:
`[CONSULTA] 1 · Hotmart`, `[CONSULTA] 2 · Confirmación`, `[CONSULTA] 3 · Pagada sin agenda`,
`[CONSULTA] 4 · Recordatorios`, `[CONSULTA] 5 · Cancelada → frenar`.

---

## 6. Plantillas de WhatsApp y mapeo de variables

Las cinco plantillas ya están aprobadas en Spanish (ARG), categoría *Utility*.

| Plantilla | Sale en | Variables |
|---|---|---|
| `consulta_agendada_confirmacion` | CONSULTA 2, nodo 5 | `{{1}}` nombre · `{{2}}` fecha · `{{3}}` hora |
| `consulta_pagada_sin_agenda` | CONSULTA 3, nodos 3/6/9 | `{{1}}` nombre |
| `recordatorio_24_horas` | CONSULTA 4, nodo 3 | `{{1}}` nombre · resto según el texto aprobado |
| `recordatorio_4_horas` | CONSULTA 4, nodo 6 | `{{1}}` nombre · `{{2}}` hora |
| `recordatorio_1_hora` | CONSULTA 4, nodo 9 | link de la sesión |

**Mapeo en GHL** (elegir siempre desde el selector de campos de combinación, que
es el que garantiza el nombre exacto en esta versión de la plataforma):

| Variable | Campo |
|---|---|
| nombre | `{{contact.first_name}}` |
| fecha | fecha de inicio de la cita (`{{appointment.start_date}}`) |
| hora | hora de inicio de la cita (`{{appointment.start_time}}`) |
| link de la sesión | ubicación/link de la reunión (`{{appointment.meeting_location}}`) — es el Meet que genera el calendario |

Tres cuidados con las variables:

- **Nunca dejar una variable vacía.** Si el contacto no tiene nombre, WhatsApp
  rechaza el envío de la plantilla. Poner un valor por defecto ("Hola" / "Que
  tal") en el campo de la variable.
- **`{{appointment.*}}` solo existe en workflows disparados por una cita.** Por eso
  la confirmación vive en CONSULTA 2 (trigger de cita) y no en un workflow
  disparado por etiqueta: ahí esas variables saldrían en blanco.
- **Zona horaria:** la hora se renderiza en la zona horaria de la subcuenta. Si
  Ezequiel atiende gente de varios países, conviene que la plantilla diga la
  ciudad de referencia, o usar la zona horaria del contacto en el calendario.

---

## 7. Los seis detalles que rompen esto si se pasan por alto

### 7.1 · Antelación mínima de 12 h contra el recordatorio de 24 h
El calendario permite reservar con 12 horas de anticipación, pero el primer
recordatorio es a 24 h. Quien reserve con menos de 24 h de margen entra a un
`Wait` cuya hora ya pasó: según cómo esté configurado el paso, se salta o se
dispara al instante con un texto que dice "mañana" cuando la sesión es hoy.

**Recomendado:** subir la antelación mínima del calendario a **26 horas**. Se
pierde la reserva del mismo día, pero la secuencia de tres recordatorios queda
íntegra y la persona siempre tiene una noche de margen para prepararse (que es lo
que pide el mensaje de confirmación: "si tienes análisis recientes, déjalos a mano").

**Alternativa** si Ezequiel quiere conservar el hueco de 12 h: dejar la antelación
como está y poner el paso `Wait` de 24 h en modo *saltar si la hora ya pasó*, de
modo que esas personas reciban solo los recordatorios de 4 h y 1 h.

### 7.2 · Reprogramar y cancelar están deshabilitados
Hoy el cliente no puede mover ni cancelar su cita desde el link. Quien no puede a
esa hora simplemente no aparece: **la cancelación se convierte en no-show**, que
es el peor resultado posible (bloquea la agenda y quema el horario). Habilitar
reprogramación — con CONSULTA 5 montado, una reprogramación se maneja sola.

### 7.3 · Teléfono en formato E.164
Hotmart entrega el teléfono partido (código de país + número) y a veces con ceros
o guiones. WhatsApp necesita `+549...`. Normalizar en el mapeo del webhook
(CONSULTA 1, nodo 2). **Un teléfono mal formateado no da error visible**: el
workflow sigue, el mensaje no llega, y la persona parece un ghost cuando en
realidad nunca supo que tenía que agendar.

### 7.4 · Ventana de 24 h de WhatsApp
Todos estos envíos son **plantillas** (correcto: fuera de la ventana de 24 h solo
pasan plantillas). Pero cuando la persona **responde**, se abre la ventana de 24 h
y ahí sí se puede escribir libre. Por eso CONSULTA 3 lleva *stop on response*: la
respuesta es de Ezequiel, no del robot.

### 7.5 · La serie `[ADS]` vieja puede duplicar mensajes
`[ADS] 3 · Confirmación de cita` y `[ADS] 4 · Recordatorios` son del embudo de
llamada gratuita. Si sus triggers de cita **no** están filtrados por calendario,
también se van a disparar con las citas de "Consulta Sana tu Autoinmune" y la
persona recibirá dos confirmaciones y dos tandas de recordatorios. **Antes de
publicar nada:** abrir esos dos workflows y verificar que su trigger tenga el
filtro `En el calendario is <calendario del embudo de ads>`.

### 7.6 · Pagó pero el contacto no se creó
Si Hotmart manda un email distinto del que la persona usa después para agendar, se
crean dos contactos: uno con `compra-consulta` que nunca agenda, y otro con
`consulta-agendada` sin pago. Se detecta con la métrica de control:
**pagos en Hotmart ÷ contactos con `compra-consulta`**. Si baja del 95%, hay
contactos duplicados o webhooks perdidos, y se concilia a mano con el export
diario de Hotmart.

---

## 8. Prueba antes de encender la pauta

Con un contacto de prueba (teléfono real de Ezequiel o del equipo):

- [ ] **Compra + agenda seguida** → llega `consulta_agendada_confirmacion` una vez, con fecha y hora correctas.
- [ ] **Compra sin agendar** → a los 20 min llega `consulta_pagada_sin_agenda`; a las 3 h el segundo toque.
- [ ] **Compra, no agenda, agenda al día siguiente** → deja de llegar el mensaje de recuperación **y** llega la confirmación.
- [ ] **Webhook de Hotmart disparado dos veces** con la misma compra → el contacto recibe todo **una** sola vez.
- [ ] **Cita a 30 h vista** → llegan los tres recordatorios, en horario correcto, y el de 1 h trae el link de Meet **que abre**.
- [ ] **Cita cancelada a mano en GHL** → no llega ningún recordatorio más.
- [ ] **Contacto sin nombre** → la plantilla se envía igual (valor por defecto), no falla.
- [ ] **Reembolso en Hotmart** → no entra al embudo (filtro de evento del paso 1).

---

## 9. Pendientes de definición

- Confirmar el **texto exacto y las variables** de `recordatorio_24_horas`,
  `recordatorio_4_horas` y `recordatorio_1_hora` (aquí están mapeadas por el
  fragmento visible de cada plantilla).
- Decidir §7.1: subir la antelación mínima a 26 h **o** aceptar que las reservas
  de menos de 24 h se queden sin el primer recordatorio.
- Habilitar reprogramación en el calendario (§7.2).
- Definir si se crea **pipeline de consulta** (etapas: pagada → agendada →
  asistió → cerrada) para medir el embudo sin exportar de Hotmart.
- Definir el seguimiento **post-consulta** (asistió → oferta del programa de 3
  meses; no asistió → reagendar), que hoy no está cubierto por ningún workflow.

---

### Fuentes
Subcuenta GHL `Ezequiel Racca` (`KG0HeFXOJjAdf0BYP6oy`): calendarios, etiquetas,
campos personalizados y workflows consultados por API el 04/09/2026 · capturas de
los workflows y del listado de plantillas de WhatsApp aportadas por Sebastián ·
[`Oferta.md`](./Oferta.md) §7 (embudo).
