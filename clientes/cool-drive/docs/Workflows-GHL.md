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

### 1. `[BOT] Entrada de mensajes`
Trigger: mensaje entrante (WhatsApp + Instagram DM).
Filtro: el contacto no tiene `alumno` ni `bot-off`.
Acción: POST al webhook de Make del escenario conversacional.

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
