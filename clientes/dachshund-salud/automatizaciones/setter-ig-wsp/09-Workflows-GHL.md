# Workflows de GHL que disparan el bot

> Los dos workflows de GoHighLevel que le mandan cada mensaje entrante al
> escenario de Make. Son la unica pieza que vive fuera de Make.
> Cuenta: **Dachshund Salud** (`TzjuywpjnaS5aZn5RTs8`).

---

## La URL del webhook

```
https://hook.eu1.make.com/tbq8mregt95h8z414iugwqt7o35clv9q
```

Es la **misma para los dos workflows**. Lo unico que los diferencia es el valor
del campo `canal` en el payload.

> Es un endpoint sin autenticacion: cualquiera con la URL puede inyectar
> mensajes falsos. No la publiques.

---

## Workflow A - `Bot Respuesta WHATSAPP`

### Trigger

**Customer Replied**, con estos filtros **en este orden**:

| # | Filtro | Valor |
|---|---|---|
| 1 | Reply channel | `WhatsApp` |
| 2 | **Has tag** | **`bot-on`** |
| 3 | Doesn't have tag | `bot-off` |

**El filtro 2 no es opcional.** El WhatsApp de Marcelo es su telefono personal:
ahi escriben su papa, sus amigos y sus proveedores. Un filtro negativo
(`doesn't have tag: bot-off`) deja pasar a todos ellos, porque nadie tiene ese
tag. Con `has tag: bot-on` el bot solo atiende a quien fue marcado a mano.

`bot-off` sigue siendo necesario como filtro 3: es el freno que el escenario de
Make le pone al contacto cuando hay que escalar a un humano
(modulo 8, "Avisar al equipo").

### Acciones

1. **Custom Webhook** - configuracion abajo

**Sin Wait, igual que el bot de Cool Drive.** Lo unico que cuelga del trigger es
el webhook.

### Que pasa con las rafagas de mensajes

La gente manda tres mensajes seguidos. Sin Wait eso son tres ejecuciones. El
problema real no son las tres respuestas: es que las tres **leen la misma
memoria al mismo tiempo**, cada una contesta ignorando a las otras dos, y la
ultima en escribir pisa a las anteriores.

Eso esta resuelto del lado de Make, no aca: el escenario `7035201` esta en
**procesamiento secuencial** (`sequential: true`). Make atiende una ejecucion
por vez, y la segunda arranca recien cuando la primera guardo la memoria. La
rafaga sigue generando tres respuestas, pero encadenadas en vez de pisadas: cada
una lee el resumen actualizado.

> El costo del secuencial es que una ejecucion colgada detiene la cola. Por eso
> los cinco modulos del escenario tienen manejador de error (`Resume` o
> `Ignore`): ninguno puede quedar colgado.

**Si en la semana de sombra las rafagas resultan molestas**, ahi si agregar
**Wait 15 seconds** antes del webhook y poner **Allow Re-Entry en OFF** en
Configuracion. No antes: el precio de esa solucion es que a Make le llega el
**primer** mensaje de la rafaga y no el ultimo, y no vale la pena pagarlo por un
problema que quiza no exista.

---

## Workflow B - `Bot Respuesta INSTAGRAM`

Identico al A salvo por dos cosas:

- Filtro 1: **Reply channel = `Instagram`**
- Payload: **`canal` = `IG`** (no `Instagram`; asi lo llama la API de GHL)

El filtro `has tag: bot-on` **no hace falta aca**. Instagram no tiene trafico
personal: el 93% del volumen del negocio entra por ese canal y son todos leads.
Alcanza con `doesn't have tag: bot-off`.

---

## Configuracion del Custom Webhook

**Method:** `POST`
**URL:** la de arriba

En **Custom Data**, estas 9 filas:

| Key | Value (WhatsApp) | Value (Instagram) |
|---|---|---|
| `contactId` | `{{contact.id}}` | igual |
| `locationId` | `{{location.id}}` | igual |
| `canal` | `WhatsApp` *(texto fijo)* | `IG` *(texto fijo)* |
| `direccion` | `inbound` *(texto fijo)* | igual |
| `mensaje` | `{{message.body}}` | igual |
| `nombre` | `{{contact.first_name}}` | igual |
| `telefono` | `{{contact.phone}}` | igual |
| `email` | `{{contact.email}}` | igual |
| `fuente` | `{{contact.source}}` | igual |

Si tu version de GHL da un body JSON crudo en vez del constructor de filas:

```json
{"contactId":"{{contact.id}}","locationId":"{{location.id}}","canal":"WhatsApp","direccion":"inbound","mensaje":"{{message.body}}","nombre":"{{contact.first_name}}","telefono":"{{contact.phone}}","email":"{{contact.email}}","fuente":"{{contact.source}}"}
```

### Por que `canal` va como texto fijo

El trigger ya filtra por canal, asi que el workflow siempre sabe cual es. Y ese
mismo valor es el que Make le devuelve a la API de GHL en el campo `type` para
contestar por el canal correcto (modulos 5 y 30 del escenario). Un merge field
mal resuelto ahi haria que la respuesta salga por el canal equivocado, o que no
salga.

### Por que `nombre` es `first_name` y no `name`

El cerebro de Paula usa ese nombre para saludar. `{{contact.name}}` trae el
nombre completo y a veces el @ de Instagram, que suena raro en un saludo.

---

## Pipeline `BOT Marce` - IDs cargados en Make

Creado a mano en GHL (la API no permite crear pipelines). Los IDs ya estan
escritos en el modulo 12 del escenario `7035201`.

| Pipeline | ID |
|---|---|
| `BOT Marce` | `knRDXRIod5ezbecrfVrI` |

| Etapa | ID | Estado del cerebro que la activa |
|---|---|---|
| Nuevo | `6bcd9393-e84e-45e9-9be1-b9deea4c3321` | `nuevo` *(y cualquier estado desconocido)* |
| Calificando | `94a00826-b5e0-4e28-8d61-2d9e6e3b1410` | `calificando` |
| Informacion Entregada | `47611694-ecb2-413a-8d52-644001200650` | `mecanismo_explicado`, `fotos_pedidas` |
| Cierre propuesto | `358617a4-5f76-49dd-9de1-539ffa12a6e4` | `precio_dado`, `cierre_propuesto` |
| Quiere Consulta | `93273989-99ae-4ad6-9813-3afae31955d8` | `quiere_agendar` |
| Pago Consulta | `bd18ec1f-fa0b-43a9-a5c0-ee7f6d8dcee7` | *ninguno* |

**`Pago Consulta` la mueve el pago, no el bot.** Paula nunca la escribe: el bot
no sabe si alguien pago. Esa etapa la tiene que mover un workflow de GHL con
trigger de pago del producto de $197, o Marcelo a mano.

El estado `frio` no mueve a nadie: el filtro del modulo 12 lo excluye a
proposito, para que un lead que se enfria no retroceda en el tablero.

---

## Lo que todavia falta para encender

1. `PEGAR_GHL_TOKEN` en los modulos 5, 8, 12 y 30 del escenario `7035201`.
2. `PEGAR_ANTHROPIC_API_KEY` en el modulo 3.
3. El cerebro en el modulo 3 (`cerebro/salida/cuerpo-modulo3.json`).
4. Plan Pro de Make + data store `setter_marcelo` propio.
5. Etiquetar con `bot-on` a los contactos de prueba antes de publicar el
   workflow de WhatsApp.
