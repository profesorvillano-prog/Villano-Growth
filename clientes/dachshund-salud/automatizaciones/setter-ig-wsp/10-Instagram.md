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
  "pais": "{{contact.country}}",
  "email": "{{contact.email}}",
  "fuente": "{{contact.source}}"
}
```

En el workflow del iman cambian tres: `evento` a `lead_magnet`, `mensaje` vacio y
`fuente` con el tema del iman.

---

## El cobro

La Consulta existe como producto de GHL (`Video Consulta Diagnostica Dachshund`)
con dos precios, porque **un enlace de pago no admite dos monedas**: GHL lo
rechaza con "No se pueden seleccionar los productos de diferentes monedas".

| Moneda | Precio | Link |
|---|---|---|
| USD | $89 | `https://link.fastpaydirect.com/payment-link/6a9a65b1a7f78e147447ed9b` |
| CLP | $81.900 | `https://link.fastpaydirect.com/payment-link/6a9a66eda7f78e147447eda1` |

Los dos checkouts ofrecen **PayPal y tarjeta** (tarjeta via Mercado Pago). O sea
que el de USD sirve para todo el mundo, incluidos Espana y Costa Rica, donde
Mercado Pago no opera.

> **Ojo con el boton de PayPal en el link de CLP.** PayPal no opera en pesos
> chilenos, asi que ese boton probablemente falle. Hay que probarlo: si falla,
> conviene sacarlo de ese enlace. Un boton que revienta en la pantalla de pago
> cuesta mas caro que no tenerlo.

### Paula elige el link sola, sin preguntar

El webhook manda `pais` con `{{contact.country}}`:

- `CL` -> link en pesos
- cualquier otro valor, **o vacio** -> link en dolares

El caso vacio cae en USD, que funciona para todos. Si Instagram no informa el
pais, no se rompe nada: solo se pierde la comodidad del peso chileno.

**Paula nunca pregunta el metodo de pago ni menciona que existen dos links.**
Elige uno y lo manda. En la pagina de pago la persona elige como pagar.

### Pide el correo antes del link

Los contactos de Instagram no traen email. Si la persona paga y pone uno que GHL
no conoce, **el pago cae en un contacto nuevo**: el `pago-ok`, el cambio de etapa
y el `bot-off` van a parar al registro equivocado, y Paula le sigue hablando a
alguien que ya compro.

Por eso Paula pide el correo justo antes de mandar el link. No es un turno
desperdiciado: Marcelo lo necesita igual para el Google Meet y el formulario
previo.

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

---

## Los workflows de GHL, como quedaron

Solo tres, y los tres son del bot. Todo lo post-venta vive aparte, en el embudo
de Marcelo, y no se mezcla.

| Workflow | Disparador | Acciones |
|---|---|---|
| **WF1 - Bot Respuesta INSTAGRAM** | Cliente ha respondido, canal DM de Instagram | Espera 0.2 min -> condicion de etiquetas -> webhook a Make |
| **WF2 - Aviso atencion humana** | Se agrega la etiqueta `atencion-humana` | Notificacion interna a Marcelo |
| **WF3 - Pago Consulta - BOT Off** | Pago recibido del producto Video Consulta Diagnostica Dachshund | Agrega `bot-off` + mueve la oportunidad a *Pago Consulta* en `BOT Marce` con estado `won` |

### Dos que se cayeron de la lista

**El de "humano toma la conversacion".** No existe en GHL un disparador de mensaje
saliente manual, y un workflow que solo agrega una etiqueta no hace nada que
Marcelo no pueda hacer con dos clics desde el panel del contacto. Queda como
convencion acordada: **antes de meterse a contestar, poner `bot-off`**.

Se puede volver automatico desde Make: la conversacion de GHL expone
`lastOutboundMessageAction` con valores `automated` o `manual`, y el campo viene
en las 12 de 12 conversaciones que revise. Falta una sola prueba para confirmarlo:
que Marcelo escriba un mensaje a mano y verificar que el valor cambie a `manual`.
Si cambia, Make consulta la conversacion antes de responder y se calla solo.
Cuesta una operacion extra por mensaje entrante.

**El aviso de "quiere pagar".** Como notificacion era ruido. Su valor real es como
disparador de recuperacion: **tiene `quiere-pagar` y no tiene `bot-off`** despues
de unas horas es el lead mas caliente del embudo, y hoy se pierde en silencio.
Se arma cuando el WF3 este probado.

### La condicion del WF1, y la trampa que tiene

En GHL, poner dos etiquetas en una sola fila de *Tags no incluye* significa
**"alguna de las dos falta"**, no "faltan las dos". La propia ayuda de la interfaz
lo dice. Con las dos juntas, un contacto con `bot-off` pasaba igual, porque le
faltaba `lm-en-curso`: **el freno no frenaba, y sin dar ningun error.**

Van en **dos filas separadas unidas con Y**. Vale para cualquier otro workflow
donde se quiera decir "ninguna de estas".

### `{{contact.tags}}` no existe

Lo propuse para que Make tambien pudiera frenar y no es un valor personalizado
valido: GHL responde `is not a valid expression`. El campo `tags` quedo fuera del
webhook. La proteccion vive en la condicion del WF1.

---

## Las tres puertas de entrada

Todo el trafico de Instagram entra a Paula por una de tres puertas. Las tres
terminan en la misma conversacion y en la misma memoria; lo que cambia es quien
habla primero.

| Puerta | Workflow GHL | Escenario Make | Quien abre |
|---|---|---|---|
| DM espontaneo | `WF1 - Respuesta INSTAGRAM` | `7035201` | La persona |
| Comentario en post | `WF4 - Respuesta Comentarios` | `7247435` | GHL, texto fijo |
| Lead magnet | *pendiente* | `7035201` | Paula |

### Por que el comentario no lo abre Paula

Quien comenta nunca mando un DM, asi que **no hay ventana de 24 horas abierta**.
El unico mensaje que Meta permite ahi es la *respuesta privada al comentario*, y
solo la puede mandar GHL, que es quien tiene el ID del comentario. Make no puede:
intentaria un DM normal y Meta lo rechaza.

Por eso el primer DM sale de GHL con texto fijo (`Instagram interactive messenger`,
tipo de respuesta **Reply to comment via DM**) y Paula entra recien cuando la
persona responde. Para entonces ya conto su problema con sus palabras, que es
mejor dato que cualquier `fuente`.

### El escenario de apertura (`7247435`)

Tres modulos y nada mas. **No llama a Claude y no manda ningun mensaje.**

1. Webhook propio: `https://hook.eu1.make.com/h1m4n165mdt4mjqvwdqz18wbpblkciwy`
2. `GetRecord` sobre `setter_marcelo`
3. `AddRecord` con filtro `evento = apertura` **Y** `historial` vacio

El filtro del paso 3 es el que evita el peor caso: si la persona ya venia
conversando con Paula y comenta un post, sembrar memoria le **borraria** el
historial. Con el filtro, no se toca nada.

`turnos` se siembra en `0` a proposito. El escenario de seguimiento exige
`turnos > 0`, asi que estos contactos quedan fuera de los seguimientos, que es lo
correcto: nunca escribieron, no hay ventana de 24h, y el mensaje seria rechazado
por Meta mientras Make lo registra como exito.

### Webhook aparte, no una rama de `7035201`

La apertura tiene su propio hook y su propio escenario en vez de ser una rama del
principal. Asi `7035201` no se toca: cada reemplazo de blueprint de 31 KB es una
oportunidad de romper el cerebro en silencio.

El orden en WF4 tambien importa: **el webhook va antes del mensaje interactivo**.
Si va despues, queda detras de la espera de paso y alguien que contesta en veinte
segundos dispara WF1 antes de que exista la memoria: Paula se presenta dos veces.

### `setter_marcelo` (`180176`)

Data store propio, creado el 5 de septiembre. Antes los cuatro modulos apuntaban a
`cooldrive_memoria` (`173778`), compartido con dos escenarios **vivos** de Cool
Drive. El seguimiento de Cool Drive busca sobre ese store: los contactos de
Marcelo entraban en su barrido y se les escribia con el token de la otra
subcuenta.

`7035204` y `7247435` ya apuntan a `setter_marcelo`. **En `7035201` falta cambiarlo
a mano** en los dos modulos marcados `CAMBIAR a setter_marcelo`.
