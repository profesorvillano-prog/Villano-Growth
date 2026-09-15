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

`turnos` se siembra en **`1`**, no en `0`. Arranco sembrando 0 para que el
escenario de seguimiento los saltee, y eso choco de frente con la regla del
cerebro: *solo saludo cuando TURNOS es 0*. Con la semilla en 0, Paula se
presentaba de nuevo en el mensaje siguiente al DM donde ya se habia presentado.

El 0 nunca hizo falta para el seguimiento: ese filtro tambien exige
`temperatura != frio`, y la semilla escribe `frio`. Con eso alcanza para
excluirlos, que es lo correcto: nunca escribieron, no hay ventana de 24h, y el
mensaje seria rechazado por Meta mientras Make lo registra como exito.

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

Los tres escenarios de Marcelo (`7035201`, `7035204`, `7247435`) ya apuntan a
`setter_marcelo`. Cool Drive se quedo solo con `cooldrive_memoria`: no hay ningun
modulo compartido entre los dos clientes.

El store nuevo arranca vacio. Las conversaciones de prueba que vivian en el store
de Cool Drive no se migraron y no hacia falta: los tres escenarios estaban
apagados y no habia ninguna conversacion real en curso.

---

## El bot dejo de ser Paula (11 sep 2026)

Marcelo pidio sacar la persona de Paula: la gente quiere hablar con **el**, y una
asistente que se presenta en cada conversacion le restaba. El cerebro pasa a
**primera persona, como el veterinario**, con tres reglas que no se pueden tocar:

1. **Nunca se presenta.** Ni con TURNOS en 0. Nada de *soy*, nada de *del equipo
   de*. Abre por el caso, o con un Hola pelado si la persona saludo.
2. **Nunca afirma ser Marcelo.** No escribe *soy Marcelo*, no firma con su nombre,
   no dice *te habla el doctor*.
3. **Si le preguntan directo, no miente.** Ante un *hablo con el doctor?* o un
   *eres un bot?* contesta en una linea que los mensajes los lleva el equipo y que
   el caso lo ve Marcelo en la videollamada, y sigue con el caso.

La tercera es la que protege el negocio. Dejar que alguien crea que hablo con el
veterinario y descubrirlo despues de pagar es lo unico que no se arregla.

El archivo se llama ahora **`CEREBRO-MARCELO.md`** (antes `CEREBRO-PAULA.md`). El
`CEREBRO-MARCELO.md` viejo, que tenia el catalogo completo de productos de 27 a
497 dolares, quedo archivado en `cerebro/archivo/` porque contradice la estrategia
de un solo producto.

## El CTA dejo de ser el link de pago y paso a ser la pagina

El bot no estaba cerrando tickets. El link de pago llegaba demasiado pronto y
demasiado seco. Ahora la escalera termina en la pagina:

**https://salchichapro.com/consultadachshund**

El orden completo, y no se salta ningun paso:

| Paso | Que pasa |
|---|---|
| Si #1 | El mecanismo le hace sentido |
| Si #2 | Lo que necesita es el numero exacto para SU perro |
| Si #3 | Quiere saber como se resuelve |
| Descripcion | La consulta, en primera persona y **sin precio** |
| **Pagina** | El link, amarrado a SU problema y mandando al video |
| ~1 hora | El cierre, si no contesto |
| Link de pago | Solo despues de un si claro |

**La pagina nunca va sola.** Va con tres partes en dos lineas: el problema de esa
persona con sus palabras, que vea el video primero, y el link. Un *aca tienes la
info* a secas es lo mismo que no mandarla.

**El precio ya no lo dice el bot salvo que se lo pregunten.** Esta en la pagina.

## El cierre a la hora: escenario `7371151`

Pieza nueva. Corre **cada 15 minutos** y busca en `setter_marcelo` los registros
que cumplen todo esto a la vez:

- `estado` = `pagina_enviada`
- `pausado` = false
- `pagina_enviada_at` entre 35 minutos y 3 horas atras
- `ultimo_mensaje_at` de hace mas de 35 minutos (si contesto recien, no entra)
- `ultimo_mensaje_at` de hace menos de 23 horas (ventana de Meta)

Claude escribe un mensaje de cierre que retoma el caso, menciona el video **sin
volver a mandar el link**, y hace una sola pregunta. Despues marca el registro
como `cierre_propuesto`, que es lo que evita que se dispare dos veces.

Nunca manda el link de pago: ese sale en la conversacion en vivo, cuando dicen
que si.

**Esta creado y apagado.** Hay que encenderlo a mano en Make.

### Lo que hubo que tocar para que esto funcione

| Donde | Cambio |
|---|---|
| Estructura de datos `552700` | Campo nuevo `pagina_enviada_at` (fecha) |
| `7035201` modulo 7 | Guarda `pagina_enviada_at` la primera vez que el estado es `pagina_enviada`, y despues lo conserva |
| `7035201` modulo 12 | `pagina_enviada` mueve el trato a la etapa de propuesta |
| `7035201` modulo 30 | El mensaje seguro pasa a primera persona |
| `build.py` | Estado nuevo `pagina_enviada` en el esquema, y el modo `paula` ya no existe |
| `7035204` | El seguimiento de 18-23h tambien habla en primera persona |

La estructura `552700` la comparte el data store de Cool Drive (`173778`), asi que
el campo se agrego **sumando**, sin tocar nada de lo que ya habia. Los registros
siguen separados, que era lo importante.

## El nombre del perro ya no se pregunta (14 sep 2026)

Marcelo lo marco como el tic mas insistente del bot: preguntaba el nombre de la
salchicha en practicamente todas las conversaciones, y eso es lo primero que
delata un formulario.

**Regla nueva: no se pregunta nunca**, ni aunque el campo `nombre_perro` este
vacio. El campo sigue existiendo y se sigue guardando, pero **se llena solo si la
persona lo dice sola**.

- Si lo dicen, se usa en cada mensaje a partir de ahi.
- Si no lo dicen, se dice *tu salchicha*, *tu perrita*, *tu perrito*, o *ella* o
  *el*. Se puede calificar, explicar el mecanismo y mandar la pagina sin saberlo.
- La unica forma en que puede aparecer es **pegado a algo que ella mostro**, por
  ejemplo despues de una foto: *se ve regalona, como se llama?*. Y si no contesta
  eso, se acabo el tema.

Lo que cambio en concreto:

| Donde | Cambio |
|---|---|
| `CEREBRO-MARCELO.md` | Seccion nueva `## El nombre del perro no lo pregunto`, con la tabla de que nunca escribir |
| `CEREBRO-MARCELO.md` | El orden de datos pasa a 4 puntos y el nombre sale de la lista, queda la edad |
| `CEREBRO-MARCELO.md` | En DATOS, la excepcion: un campo vacio se puede preguntar **salvo el nombre del perro** |
| `CEREBRO-SEGUIMIENTO.md` y `7035204` | `NUNCA PREGUNTES EL NOMBRE DEL PERRO` |
| `7371151` | Lo mismo, en la lista de lo que nunca hace el cierre |

Los tres escenarios quedaron con el texto nuevo. El `7371151` sigue apagado.

## El CTA de la pagina, con fuerza (14 sep 2026)

Marcelo trajo el dato que ordena todo esto: **la unica persona que compro reviso
la pagina completa y el video entero.** No le paso por encima. Asi que el CTA
dejo de ser un link amable y paso a ser una peticion.

Tres excepciones que solo existen en ese mensaje:

1. **Puede ser largo.** Tres o cuatro lineas, cuando el resto de la conversacion
   son dos. Pedir algo a media voz es lo mismo que no pedirlo.
2. **Puede llevar mayusculas de enfasis**, una o dos palabras: NI TE LO IMAGINAS,
   EN SERIO. En cualquier otro mensaje seria gritar.
3. **Puede terminar sin pregunta.** Lo que se pide es que abra la pagina, y una
   pregunta despues del link le da algo mas facil que hacer que abrirlo.

La estructura, cinco partes:

1. Que la vea completa, y el video sobre todo, como algo que necesito
2. Que no se imagina lo que hay ahi dentro
3. Que la hice para ella, para que entienda de donde viene el problema
4. Su problema concreto, con sus palabras
5. Que quiero ayudarla de verdad, y **el link al final**

> *Necesito que veas la pagina completa, y sobre todo el video, porque NI TE LO
> IMAGINAS lo que hay ahi. La hice para que entiendas de donde viene de verdad lo
> de la piel de Miah, y no vas a encontrar a nadie que te lo explique asi de
> exacto y completo. Porque quiero ayudarte EN SERIO:
> https://salchichapro.com/consultadachshund*

**El link va al final, nunca al medio**: si va antes, deja de leer y hace clic sin
haber entendido para que entra.

### La linea que no se cruza

El FOMO sale de que **esto lo hizo el y no se encuentra en otro lado**, no de un
reloj falso. Queda escrito en el cerebro que **nunca** invente que quedan cupos,
que el precio sube, que la oferta se acaba o que hay poca disponibilidad. Nada de
eso es cierto hoy, y el dia que alguien lo compruebe se pierde mucho mas de lo que
se gana. Si algun dia hay cupos limitados de verdad, se agrega y se puede decir.

### El cierre a la hora tambien cambio

El `7371151` ya no pregunta si le llego el link. Pregunta **si la vio completa o
si la dejo a medias**, que es la pregunta que de verdad predice la compra. Y puede
usar una sola palabra en mayusculas (COMPLETO, ENTERA).

## El precio nunca viaja con el link (15 sep 2026)

En la conversacion de Pablo el bot hizo exactamente lo que no queremos: le
preguntaron el precio y contesto **89 dolares y la pagina en el mismo mensaje**.
El numero al lado del link hace que decidan mirando el monto en vez de mirar lo
que hay adentro, que es justo lo que convirtio a la unica que compro.

El papel ya decia *nunca mando la pagina y el precio en el mismo mensaje*, pero
dos lineas mas abajo decia *si lo pregunta directo, se lo doy sin rodeos*. El
modelo resolvio la contradiccion haciendo las dos cosas a la vez. **La puerta
quedo cerrada.**

El orden, sin excepciones:

| Momento | Que hace |
|---|---|
| Preguntan el precio y **no** tienen la pagina | Manda la pagina, **sin el numero**, diciendo que ahi esta el detalle con el valor incluido |
| Insisten antes de la pagina | Sigue sin escribir el monto. La pagina es la respuesta |
| Preguntan el precio y **ya** tienen la pagina | Ahi si: *Son 89 dolares, pago unico*, y **sin link al lado** |

**El link y el monto no van juntos jamas.**

Tambien se ajusto `precio_dado`: ese estado se marca **solo si escribio el
numero**, no cuando mando la pagina. Antes el pipeline mostraba como
precio dado a gente que solo habia recibido el link.

La justificacion que quedo escrita en el cerebro, para que no se lea como esquivar
el precio: *una pregunta por el precio es una senal de compra, y la respuesta
correcta a una senal de compra es la pagina, no un numero suelto en un chat.*

## Nada se coordina antes del pago (15 sep 2026)

En la conversacion de Joce el bot le pidio el correo, le prometio el link de la
videollamada y el formulario, y le dijo *coordinamos el horario de manana*, todo
**antes de que pagara**. Marcelo: eso jamas.

El problema no es solo la promesa. Cuando alguien siente que su hora ya esta
arreglada, el pago deja de ser urgente. Y si al final no paga, quedamos
comprometidos con algo que no va a pasar.

**Regla nueva, sin excepciones: hasta que el pago no esta hecho no existe ni el
horario, ni el dia, ni el link de la videollamada, ni el formulario, ni el
correo.**

| Nunca antes del pago |
|---|
| Coordinamos el horario de manana |
| Pasame tu correo y te mando el link de la videollamada |
| Te mando el formulario antes de la consulta |
| Que dia te acomoda? |
| Te dejo el cupo tomado |

**Se elimino el paso de pedir el correo.** Cuando dicen que si, lo unico que sale
es el link de pago. El correo lo pide la pagina de pago, asi que preguntarlo por
DM era un tramite de mas entre el si y el pago.

**Lo que esto cuesta, y hay que cubrirlo:** ese correo era lo que amarraba el pago
a la conversacion. Sin el, cuando alguien paga, el sistema puede no reconocer que
es la misma persona y el bot le sigue hablando como si nada. La cobertura es que
el trigger de la orden en GHL etiquete el contacto y lo saque del bot. **Eso sigue
pendiente de verificar.**

## Una pausa antes de contestar, y no contestar cuatro veces lo mismo

Con Ross el bot contesto **cada mensaje por separado**: un gracias, un emoji, un
recíproco, otro gracias, y cuatro respuestas casi identicas despidiendose. Eso es
lo que mas delata un bot.

Se arreglo por los dos lados.

### El lado del escenario: se espera antes de responder

`7035201` ahora tiene tres modulos nuevos entre la memoria y el cerebro:

| Modulo | Que hace |
|---|---|
| **40** Anotar el mensaje | Suma el texto al campo `buffer` y se marca como el ultimo en `ultimo_texto` |
| **41** Esperar | Duerme **15 segundos** |
| **42** Releer | Vuelve a leer el registro |

El cerebro (modulo 3) solo corre **si `ultimo_texto` sigue siendo el mensaje de
esta ejecucion**. Si mientras dormia llego otro mensaje, esa ejecucion se apaga
sola y contesta la ultima, que ya tiene los dos textos juntos en el `buffer`.

El modulo 3 lee el `buffer`, no `1.mensaje`, asi que **la persona recibe una sola
respuesta a todo lo que escribio**. El modulo 7 guarda con `overwrite`, que de
paso deja el buffer vacio para la proxima.

Dos cosas que hubo que cambiar para que esto funcione:

- **`sequential` pasa a `false`.** Con las ejecuciones en fila la segunda no podia
  avisarle a la primera que ya no era la ultima.
- **El tiempo de escritura (modulo 10) bajo** de 5-22s a 3-12s, porque ya se
  esperaron 15 antes.

**Falla hacia el lado seguro:** la comparacion usa `ifempty`, asi que si la
relectura viniera vacia el filtro da igual y se contesta. En el peor caso el
comportamiento vuelve a ser el de antes, nunca un bot mudo.

### El lado del cerebro: a veces no se contesta

Regla nueva: a un *gracias*, un *ok* o un emoji suelto **se contesta una vez**. Si
vuelven a agradecer o mandan otro emoji, el cerebro devuelve `mensajes` con una
**cadena vacia** y el modulo 10 filtra por largo mayor que cero, asi que **no se
envia nada**. La conversacion queda cerrada, que es como tiene que quedar.

La cadena vacia es solo para eso: si preguntan algo, cuentan algo del perro o
retoman el tema, se contesta siempre.
