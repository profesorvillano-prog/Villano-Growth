# Workflows GHL — Embudo Consulta / Asesoría · Dachshund Salud

> Automatizaciones del embudo "Consulta - Asesoría" (funnel en GHL:
> Landing Consulta → Calendario Consulta / Calendario Asesoría → Redirección
> Mercado Pago → Thank You). Pagos por PayPal y Mercado Pago integrados
> nativos en GHL. La asesoría no se vende con landing: va por DM o
> post-diagnóstico con link de pago directo.
>
> Lógica: confirmar a quien **pagó y agendó**, rescatar a quien **pagó y no
> agendó** (ambos servicios, plantillas separadas), y recordatorios **24h y
> 4h** estándar para los dos calendarios.

---

## 0. Antes de empezar (manual, 5 minutos)

**Pipeline** (los pipelines no los crea la IA, se hacen a mano en
Opportunities → Pipelines):

- Nombre: **Dachshund · Consulta y Asesoría**
- Etapas (4, minimalista):
  1. **Pagó sin agendar**
  2. **Agendada**
  3. **Sesión realizada**
  4. **No asistió / Reagendar**

El servicio se distingue por el **nombre de la oportunidad** ("Consulta ·
Nombre" / "Asesoría · Nombre") y por **tags**, no por etapas duplicadas.

**Tags que usan los workflows** (se crean solos al usarlos, pero para
referencia):

| Tag | Quién lo recibe |
|---|---|
| `consulta-pagada` | Pagó la Consulta Diagnóstica (PayPal o MP) |
| `consulta-agendada` | Agendó en Calendario Consulta |
| `asesoria-pagada` | Pagó la Asesoría Nutricional |
| `asesoria-agendada` | Agendó en Calendario Asesoría |

**Requisitos:**

- Las 6 plantillas de WhatsApp deben estar **Aprobadas** por Meta antes de
  activar los workflows (hoy figuran Pendiente). Los workflows se pueden
  crear ya y activar cuando aprueben.
- El checkout/formulario de pago debe pedir **teléfono obligatorio**: si el
  pago llega solo con email (típico de PayPal), el WhatsApp de "pagó sin
  agendar" no tiene a dónde salir.
- Los nombres exactos de productos, calendarios y plantillas deben calzar
  con los tuyos; ajusta el texto del prompt si difieren.

---

## 1. Prompts para la IA de workflows de GHL

Pégalos de a uno en el asistente de IA de Workflows. Después de generar
cada uno, **revisa el borrador**: la IA a veces deja el filtro del trigger
o la plantilla de WhatsApp sin seleccionar; complétalos a mano antes de
publicar.

### W1 · Consulta · Pago recibido

```
Crea un workflow llamado "Consulta · Pago recibido".

Trigger: "Payment Received" con filtro: el producto es "Videoconsulta
Diagnóstica Dachshund" (aplica a pagos de PayPal y de Mercado Pago).

Pasos en orden:
1. Add Contact Tag: "consulta-pagada".
2. Create Opportunity: pipeline "Dachshund · Consulta y Asesoría", etapa
   "Pagó sin agendar", nombre "Consulta · {{contact.name}}", valor 89,
   estado Open.
3. Wait: 20 minutos.
4. If/Else: ¿el contacto tiene el tag "consulta-agendada"?
   - Rama SÍ: terminar el workflow (la confirmación la envía otro workflow).
   - Rama NO: Send WhatsApp template "consulta_pagada_sin_agenda",
     variable {{1}} = nombre del contacto.
5. Wait: 24 horas.
6. If/Else: ¿el contacto tiene el tag "consulta-agendada"?
   - Rama SÍ: terminar.
   - Rama NO: volver a enviar la plantilla "consulta_pagada_sin_agenda"
     y terminar.

Configuración: permitir reingreso del contacto (allow re-entry) por si
compra de nuevo en el futuro.
```

### W2 · Asesoría · Pago recibido

```
Crea un workflow llamado "Asesoría · Pago recibido".

Trigger: "Payment Received" con filtro: el producto es "Asesoría
Nutricional" (aplica a pagos de PayPal y de Mercado Pago).

Pasos en orden:
1. Add Contact Tag: "asesoria-pagada".
2. Create Opportunity: pipeline "Dachshund · Consulta y Asesoría", etapa
   "Pagó sin agendar", nombre "Asesoría · {{contact.name}}", valor 197,
   estado Open.
3. Wait: 20 minutos.
4. If/Else: ¿el contacto tiene el tag "asesoria-agendada"?
   - Rama SÍ: terminar el workflow.
   - Rama NO: Send WhatsApp template "asesoria_pagada_sin_agenda",
     variable {{1}} = nombre del contacto.
5. Wait: 24 horas.
6. If/Else: ¿el contacto tiene el tag "asesoria-agendada"?
   - Rama SÍ: terminar.
   - Rama NO: volver a enviar la plantilla "asesoria_pagada_sin_agenda"
     y terminar.

Configuración: permitir reingreso del contacto.
```

### W3 · Consulta · Agendada (confirmación)

```
Crea un workflow llamado "Consulta · Agendada".

Trigger: "Customer Booked Appointment" con filtro: calendario es
"Calendario Consulta".

Pasos en orden:
1. Add Contact Tag: "consulta-agendada".
2. Create/Update Opportunity: pipeline "Dachshund · Consulta y Asesoría",
   mover la oportunidad del contacto a la etapa "Agendada" (si no existe,
   crearla con nombre "Consulta · {{contact.name}}" y valor 89).
3. Send WhatsApp template "consulta_agendada_confirmacion",
   variable {{1}} = nombre del contacto y, si la plantilla lleva fecha y
   hora, mapear {{appointment.start_time}}.

Configuración: permitir reingreso del contacto (puede reagendar).
```

### W4 · Asesoría · Agendada (confirmación)

```
Crea un workflow llamado "Asesoría · Agendada".

Trigger: "Customer Booked Appointment" con filtro: calendario es
"Calendario Asesoría".

Pasos en orden:
1. Add Contact Tag: "asesoria-agendada".
2. Create/Update Opportunity: pipeline "Dachshund · Consulta y Asesoría",
   mover la oportunidad del contacto a la etapa "Agendada" (si no existe,
   crearla con nombre "Asesoría · {{contact.name}}" y valor 197).
3. Send WhatsApp template "asesoria_confirmacion" (la de confirmación de
   asesoría), variable {{1}} = nombre del contacto y, si la plantilla lleva
   fecha y hora, mapear {{appointment.start_time}}.

Configuración: permitir reingreso del contacto.
```

### W5 · Recordatorios 24h y 4h (ambos servicios)

```
Crea un workflow llamado "Recordatorios de sesión 24h y 4h".

Trigger: "Customer Booked Appointment" con filtro: calendario es
"Calendario Consulta" O "Calendario Asesoría" (los dos calendarios entran
al mismo workflow).

Pasos en orden:
1. Wait: hasta 24 horas antes de la hora de inicio de la cita
   (wait until 24 hours before appointment start time).
2. If/Else: ¿la cita sigue con estado Confirmed (no cancelada ni
   reagendada)?
   - Rama NO: terminar el workflow.
   - Rama SÍ: Send WhatsApp template "recordatorio_sesion_24h",
     variable {{1}} = nombre del contacto.
3. Wait: hasta 4 horas antes de la hora de inicio de la cita.
4. If/Else: ¿la cita sigue con estado Confirmed?
   - Rama NO: terminar.
   - Rama SÍ: Send WhatsApp template "recordatorio_sesion_4h".

Configuración: permitir reingreso del contacto (cada nueva cita genera sus
recordatorios). Si el contacto reagenda, la ejecución anterior debe
terminar y entrar la nueva.
```

### W6 · Después de la sesión (pipeline al día) — opcional

```
Crea un workflow llamado "Sesión realizada o no asistió".

Trigger 1: "Appointment Status" cambia a "Showed" en los calendarios
"Calendario Consulta" o "Calendario Asesoría".
Trigger 2: "Appointment Status" cambia a "No Show" en esos mismos
calendarios.

Pasos:
1. If/Else según el estado de la cita:
   - Si es "Showed": Update Opportunity, mover la oportunidad del contacto
     a la etapa "Sesión realizada" del pipeline "Dachshund · Consulta y
     Asesoría".
   - Si es "No Show": Update Opportunity, mover a la etapa "No asistió /
     Reagendar" y enviar la plantilla de WhatsApp
     "consulta_pagada_sin_agenda" con el link para reagendar (ya pagó, solo
     necesita tomar otra hora).
```

> Para que W6 funcione, Marcelo (o quien atienda) debe marcar la cita como
> **Showed / No Show** al terminar. Es un clic en el calendario y deja el
> pipeline siempre al día.

---

## 2. Cómo se conecta todo (mapa rápido)

| Situación | Workflow que actúa | WhatsApp que llega |
|---|---|---|
| Pagó consulta y agendó al tiro | W1 (termina en silencio) + W3 | `consulta_agendada_confirmacion` |
| Pagó consulta y NO agendó | W1 | `consulta_pagada_sin_agenda` (a los 20 min y a las 24 h) |
| Pagó asesoría (por DM / post-diagnóstico) y agendó | W2 (silencio) + W4 | `asesoria_confirmacion` |
| Pagó asesoría y NO agendó | W2 | `asesoria_pagada_sin_agenda` |
| Cualquier cita confirmada | W5 | `recordatorio_sesion_24h` y `recordatorio_sesion_4h` |
| Sesión hecha / no asistió | W6 | (solo pipeline; no-show recibe link para reagendar) |

## 3. Prueba antes de encender

1. Plantillas aprobadas por Meta (salir de "Pendiente").
2. Pago de prueba por Mercado Pago y otro por PayPal con un contacto tuyo:
   verificar tag, oportunidad en "Pagó sin agendar" y WhatsApp a los 20 min.
3. Agendar con ese mismo contacto: verificar confirmación, oportunidad en
   "Agendada" y que el rescate de 24 h ya no salga.
4. Cita de prueba a mañana: verificar el recordatorio de 24 h.
