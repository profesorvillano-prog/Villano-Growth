# Workflows de GoHighLevel — Cool Drive

> Los cinco workflows que sostienen la operación del bot. Se crean en GHL
> (Automation → Workflows). El conector de Claude **no** expone la API de
> workflows, así que estos se crean a mano o con el asistente de IA de GHL.
>
> Escenarios de Make relacionados: ver [`Prompt-Bot-WhatsApp.md`](./Prompt-Bot-WhatsApp.md)
> y [`Prompt-Seguimiento.md`](./Prompt-Seguimiento.md).

## Tags que gobiernan el sistema

| Tag | Quién lo pone | Efecto |
|---|---|---|
| `alumno` | Workflow 2, o el bot al detectar un inscrito | El bot deja de responder para siempre |
| `bot-off` | El bot al escalar, o a mano | El bot deja de responder |
| `atencion-humana` | El bot al escalar | Marca que alguien del equipo debe contestar |
| `bot-on` | A mano | Workflow 3 lo usa para devolver la conversación al bot |
| `reactivacion-sept` | Workflow 4 | Marca a quién ya se le mandó la campaña de reactivación |

El escenario de Make consulta `alumno` y `bot-off` antes de procesar cualquier
mensaje. Los workflows 1 y 2 son la misma compuerta del lado de GHL.

## La ventana de 24 horas de WhatsApp

Fuera de las 24 horas desde el último mensaje del usuario, **solo se pueden
enviar plantillas aprobadas por Meta**. Texto libre es rechazado.

Plantillas disponibles: `follow_up` (Marketing, para reabrir) y `saludo_tardio`
(Utility, para responder tarde).

Consecuencia de diseño: el seguimiento por texto libre desde Make solo sirve
para el primer intento (a las ~20 h). Los intentos posteriores tienen que ir
por plantilla desde GHL.

## Los cinco workflows

Detalle y prompts para el asistente de IA de GHL: ver el cuerpo de este
documento en el repositorio, sección siguiente.

### 1. `Bot Respuesta WHATSAPP` y `Bot Respuesta IG` — ya creados
Son dos workflows, uno por canal, porque el filtro *Reply channel* de GHL solo
admite un valor.

Trigger: Customer Replied, con *Reply channel* = WhatsApp / Instagram DM.
Filtro: *Doesn't have tag* = `bot-off`.
Acción: webhook POST al escenario conversacional de Make.

Body (solo estos cuatro campos; es todo lo que el escenario consume):

```json
{
  "contactId": "{{contact.id}}",
  "canal": "WhatsApp",
  "nombre": "{{contact.name}}",
  "mensaje": "{{message.body}}"
}
```

En el de Instagram, `canal` va como `IG`. Esos dos valores son exactamente los
que la API de GHL espera en el campo `type` al responder: cualquier otra cosa
falla con 422.

**Por qué basta con filtrar `bot-off` y no hace falta también `alumno`:** GHL
no permite dos filtros *Doesn't have tag* en el mismo trigger, y no hace falta,
porque `alumno` nunca existe sin `bot-off` — los dos caminos que ponen `alumno`
(el módulo del bot y el workflow 2) ponen ambos tags juntos. Además el
escenario de Make verifica los dos por su cuenta.

**Memoria del bot:** vive en el datastore de Make (`cooldrive_memoria`). Los
campos personalizados `bot_*` del contacto en GHL existen pero **nadie los
escribe**: quedaron de un diseño anterior. No los uses como fuente de verdad.

### 2. `[BOT] Marcar alumno`
Trigger: oportunidad movida a ganada, o tag `pagado`.
Acción: agregar `alumno` y `bot-off`; quitar `atencion-humana`.

### 3. `[BOT] Devolver al bot`
Trigger: tag `bot-on` agregado.
Acción: quitar `bot-off`, `atencion-humana` y `bot-on`.

### 4. `[REACTIVACION] Leads antiguos`
Trigger: agregado manual desde una vista filtrada del pipeline.
Filtros: sin `alumno`, sin `bot-off`, sin `reactivacion-sept`, sin conversación
en los últimos 7 días.
Acción: enviar plantilla `follow_up`, agregar `reactivacion-sept`. Cuando la
persona responde, el workflow 1 la entrega al bot.

### 5. `[SEGUIMIENTO] Fuera de ventana`
Trigger: contacto sin respuesta a las 48 h, sin `alumno` ni `bot-off`.
Acción: enviar plantilla `follow_up`. Máximo dos veces por contacto.
