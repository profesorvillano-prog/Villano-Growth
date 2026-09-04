# El bot es solo Instagram

> Decision de septiembre 2026. WhatsApp queda fuera: es el telefono personal de
> Marcelo. Instagram es el 93% del volumen y son todos leads.

Los dos escenarios de Make quedaron renombrados y ajustados para eso:

| Escenario | ID | Corre |
|---|---|---|
| `[BOT] Marcelo - Instagram` | `7035201` | Instantaneo, por webhook |
| `[BOT] Marcelo - Seguimiento Instagram (ventana 24h)` | `7035204` | Cada 2 horas |

---

## La ventana de 24 horas de Meta

**Esto es lo que mas cambia respecto a WhatsApp y hay que entenderlo antes de
encender.**

Instagram solo deja escribirle a una persona **dentro de las 24 horas de su ultimo
mensaje**. Pasado ese plazo la API rechaza el envio. No hay plantillas
preaprobadas como en WhatsApp: simplemente no se puede.

Consecuencias directas sobre el seguimiento:

- **Hay un solo tiro por silencio.** El disparo sale entre las 18 y las 23 horas
  desde el ultimo mensaje de la persona. Antes de las 18 es apurado, despues de
  las 23 no llega.
- **El segundo y el tercer intento solo existen si ella volvio a escribir.**
  Cuando contesta, su ultimo mensaje se actualiza y la ventana se reabre. Si no
  contesta, no hay segundo intento: la puerta se cerro.
- El diseno viejo (seguimientos cada 48 horas, hasta 3) **habria fallado en
  silencio**: Make los daba por enviados y Meta los rechazaba.

El escenario corre **cada 2 horas** para no dejar pasar a nadie por la ventana de
5 horas, y sigue respetando el horario habil de Chile (10:00 a 20:00).

`fu_count < 3` se queda como tope de por vida, no como cadencia.

**Como se lo dije al prompt:** el seguimiento sabe que es su unico tiro y que
despues la puerta se cierra. No escribe un recordatorio suave, escribe el mejor
mensaje que puede, y siempre termina en una pregunta facil de contestar.

---

## Dos formas de entrar al bot

El webhook es el mismo. Lo que cambia es el campo `evento`.

| `evento` | Quien dispara | Que hace Paula |
|---|---|---|
| `mensaje` | Workflow `Bot Respuesta INSTAGRAM`, trigger Customer Replied | Contesta |
| `lead_magnet` | El workflow del iman, X minutos despues de entregarlo | **Abre** ella la conversacion |

### El seguro contra abrir encima de una conversacion

Si llega un `lead_magnet` pero la memoria dice `turnos > 0`, el modulo 3 no
dispara: la persona ya esta hablando con Paula y no corresponde un saludo
enlatado. Eso vive en el filtro del modulo 3, no en GHL, para que no dependa de
que cada workflow este bien armado.

### Como abre con un lead magnet

`ORIGEN` (el campo `fuente`) le dice cual material pidio. Si nombra un tema
concreto, **da por hecho que ese es el problema** y pregunta directo por ahi:

> *Hola Sofia! soy Paula, del equipo del Dr. Marcelo. vi que pediste la guia de
> dermatitis. cuentame, hace cuanto que tu salchicha esta con la piel asi?*

Tres cosas prohibidas al abrir asi:

1. **Preguntar si le llego.** Se contesta con un si y se muere la conversacion.
2. **Vender en el primer mensaje.** Acaba de recibir algo gratis.
3. **Disculparse por escribir** o decir que es un mensaje automatico.

---

## Los dos workflows de GHL

### A - `Bot Respuesta INSTAGRAM`

**Trigger:** El cliente ha respondido

| Filtro | Valor |
|---|---|
| Canal de respuesta | `DM de Instagram` |
| No tiene etiqueta | `bot-off` |
| No tiene etiqueta | `lm-en-curso` |

**Acciones:**

1. **Wait** 15 seconds
2. **If/Else** No tiene etiqueta `lm-en-curso` -> Custom Webhook / END

**En Instagram no va el filtro `bot-on`.** Ahi si se quiere atender a todo el
mundo. El `bot-on` era para el WhatsApp personal de Marcelo, que ya no se usa.

### B - Lead Magnet (uno por iman)

1. **Add tag** `lm-en-curso` -- la primera accion de todas
2. **Add tag** `lm-<nombre del iman>`
3. Entrega del iman
4. **Remove tag** `lm-en-curso`
5. **Wait** 20 o 30 minutos
6. **Custom Webhook** con `evento: lead_magnet` y `fuente: <tema>`

El paso 1 tiene que llegar antes de que se cumplan los 15 segundos del workflow A.
El paso 4 va **antes** del Wait, no despues: si el tag vive los 30 minutos
completos, la persona que contesta a los 5 minutos queda sin respuesta.

### El cuerpo del webhook

```json
{
  "contactId": "{{contact.id}}",
  "locationId": "{{location.id}}",
  "canal": "IG",
  "direccion": "inbound",
  "evento": "mensaje",
  "mensaje": "{{message.body}}",
  "adjuntos": "",
  "tags": "{{contact.tags}}",
  "nombre": "{{contact.first_name}}",
  "email": "{{contact.email}}",
  "fuente": "{{contact.source}}"
}
```

En el workflow del iman cambian tres: `evento` a `lead_magnet`, `mensaje` vacio y
`fuente` con el tema del iman.

---

## Lo que falta antes de encender

1. **Plan Pro de Make + data store `setter_marcelo` propio.** Los 4 modulos
   apuntan al `173778`, que es de Cool Drive. Con leads reales se mezclarian.
2. **Apagar la automatizacion vieja de Instagram.** Hay conversaciones con
   respuestas marcadas como `automated` (a `isol_sol2017` le contesto sola
   "Y en que quieres exactamente que te ayude?"). Si se enciende Paula sin apagar
   esa, contestan las dos.
3. La lista de lead magnets con su palabra clave y su tema.

**Los dos escenarios quedan apagados.** Encenderlos es decision del usuario.
