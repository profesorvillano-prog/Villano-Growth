# Cómo funciona el bot de Cool Drive

> Explicación para el equipo. Sin tecnicismos.

## La división del trabajo

Son dos sistemas y cada uno hace una cosa:

- **GoHighLevel (GHL)** es el CRM. Escucha los mensajes que llegan y decide
  **a quién** hay que hablarle.
- **Make** es el cerebro. Recibe el aviso de GHL, piensa **qué** responder y lo
  manda de vuelta.

Si GHL no avisa, Make no se entera de nada. Si Make se cae, GHL avisa al vacío.

## Los dos escenarios de Make

**1. El que conversa** (`WhatsApp + Instagram`)
Se despierta cada vez que alguien escribe. Lee lo que se habló antes, escribe
la respuesta, la envía, y mueve al lead en el pipeline.

**2. El que reactiva** (`Seguimiento automatico`)
Corre solo, cada 4 horas, entre las 10:00 y las 20:00. Busca a quien dejó de
responder hace más de 20 horas y le manda **un solo mensaje** para retomar.
Uno por persona: no insiste.

## Los siete workflows de GHL

| Workflow | Qué hace |
|---|---|
| `Bot Respuesta WhatsApp` / `Instagram` / `Facebook` | Le avisan a Make que entró un mensaje. Uno por canal. |
| `[BOT 1] Marcar alumno` | Cuando alguien paga, apaga el bot para esa persona. |
| `[BOT 2] Devolver al bot` | Vuelve a encender el bot para una conversación. |
| `[REACTIVACIÓN] Leads antiguos` | Campaña manual sobre leads viejos del pipeline. |
| `[SEGUIMIENTO] Fuera de ventana` | Recordatorios por plantilla, pasadas las 24 h. Solo WhatsApp. |
| `[SEGUIMIENTO] Cortar al responder` | Reinicia el contador cada vez que el lead escribe. |

## Los tags: el interruptor del bot

Esto es lo único que el equipo necesita saber para operar.

| Para... | Poner el tag |
|---|---|
| Que el bot deje de responderle a alguien | `bot-off` |
| Que el bot vuelva a atender esa conversación | `bot-on` |
| Marcar a alguien como alumno inscrito | `alumno` |

El bot revisa esos tags **antes** de contestar. Si tiene `alumno` o `bot-off`,
no responde nada y la conversación queda para una persona.

`bot-off` y `atencion-humana` los pone el bot solo cuando detecta que el caso
lo tiene que ver un humano: confirmar un pago, agendar una clase, un reclamo, o
alguien que ya es alumno.

## La regla de las 24 horas de WhatsApp

Meta solo permite escribir libremente dentro de las **24 horas** desde el último
mensaje de la persona. Pasado ese plazo hay que usar una plantilla aprobada.

Por eso el sistema está partido:

- **Dentro de 24 h** → mensaje escrito por el bot, adaptado a la conversación.
  Funciona en WhatsApp, Instagram y Messenger.
- **Fuera de 24 h** → solo plantilla, y **solo en WhatsApp**. En Instagram y
  Messenger no se puede escribir más: tiene que hablar la persona.

Consecuencia práctica: en Instagram y Messenger hay **una sola oportunidad** de
recuperar a alguien, y vence a las 24 horas.

## Qué NO hace el bot

Nunca confirma un pago, nunca agenda una clase, nunca promete un horario y
nunca inventa un descuento. Todo eso lo deriva a una persona y pone el tag
`atencion-humana`.
