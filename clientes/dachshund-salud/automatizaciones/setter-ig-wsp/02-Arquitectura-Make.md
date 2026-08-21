# 02 · Arquitectura en Make

> Todo el cerebro del setter vive en Make. GHL es solo el buzón: recibe los DM de
> Instagram y los WhatsApp, se los pasa a Make por webhook, y Make le devuelve la
> respuesta por API. Ni un mensaje se escribe a mano.
> **Cuenta Make:** Villano Growth · org `8286748` · team `2094866` (`My Team`).

---

## 1. El mapa

```
   Instagram DM ─┐
                 ├─► GHL (Inbox)
   WhatsApp    ──┘        │
                          │  Workflow GHL "Customer Replied" → Webhook
                          ▼
              ┌───────────────────────────────┐
              │  MAKE · Escenario 1           │
              │  [SETTER] Marcelo IG+WSP      │   ← instantáneo (webhook)
              │  Webhook → Estado → IA → Ruta │
              └───────────┬───────────────────┘
                          │  HTTP POST a la API de GHL
                          ▼
              GHL envía el mensaje al lead (IG o WSP)
                          │
                          ├─► Data Store "setter_marcelo" (memoria)
                          └─► Contacto GHL (tags + campos + pipeline)

              ┌───────────────────────────────┐
              │  MAKE · Escenario 2           │
              │  [SETTER] Seguimientos        │   ← programado 3 veces/día
              │  Busca inactivos → FU1/2/3/4  │
              └───────────────────────────────┘
```

**Por qué GHL en el medio y no Instagram/WhatsApp directo a Make:** GHL ya tiene
resueltos los dos canales, la ventana de 24 h, el hilo de conversación y el
historial. Meterse con la Graph API de Instagram y la Cloud API de WhatsApp por
separado sería duplicar lo que ya está pagado y funcionando.

---

## 2. Escenario 1 · `[SETTER] Marcelo — IG+WSP → Consulta`

Trigger instantáneo. Se ejecuta una vez por cada mensaje entrante.

### Módulos, en orden

| # | Módulo | Qué hace | Ops |
|---|---|---|---|
| 1 | **Webhooks › Custom webhook** | Recibe el mensaje desde GHL | 1 |
| — | *Filtro* `entrante y con texto` | Corta salientes, notas y adjuntos vacíos | 0 |
| 2 | **Data store › Get a record** | Trae el estado del lead (key = `contactId`) | 1 |
| — | *Filtro* `no pausado` | Si Marcelo tomó la conversación, el bot se calla | 0 |
| 3 | **HTTP › Make a request** → Anthropic | El cerebro. Devuelve JSON con respuesta + estado + acción | 1 |
| 4 | **JSON › Parse JSON** | Convierte la respuesta de la IA en campos mapeables | 1 |
| 5 | **Router** | Rutea por `accion` | 0 |
| 6..9 | **HTTP › Make a request** → GHL | Envía el mensaje al lead (una por ruta) | 1 |
| 10 | **Data store › Add/replace a record** | Guarda estado, datos e historial | 1 |
| 11 | **HTTP › Make a request** → GHL (solo en hitos) | Tags + custom fields | 1 |

**Coste típico: 6 operaciones por mensaje entrante** (7 en los hitos).

### 2.1 Módulo 1 · Webhook

- App: **Webhooks › Custom webhook**
- Nombre: `SETTER Marcelo IG-WSP`
- Data structure: la de abajo (crearla a mano, no dejar que Make la adivine)

```json
{
  "contactId":      "text",
  "conversationId": "text",
  "locationId":     "text",
  "canal":          "text",
  "direccion":      "text",
  "mensaje":        "text",
  "nombre":         "text",
  "telefono":       "text",
  "email":          "text",
  "instagram":      "text",
  "fuente":         "text"
}
```

**Filtro inmediato después del webhook** (esto evita el bucle infinito, es el
punto más crítico de todo el escenario):

```
direccion  Equal to  inbound
AND  mensaje  Text length greater than  0
AND  mensaje  Does not contain  [BOT]
```

> ⚠️ Si el bot procesa sus propios mensajes salientes se responde a sí mismo en
> bucle y se come las operaciones del mes en minutos. El filtro va **siempre**, y
> además el Workflow de GHL debe disparar solo en `Customer Replied`, no en
> cualquier mensaje.

### 2.2 Módulo 2 · Data store › Get a record

- Data store: **`setter_marcelo`** (estructura en §4)
- Key: `{{1.contactId}}`
- ⚠️ Marcar el módulo con **"Continue the route even if the module returns no
  result"** (botón derecho → Advanced), para que el primer mensaje de un lead
  nuevo no rompa el flujo.

**Filtro después:** `{{2.pausado}}  Not equal to  true`

### 2.3 Módulo 3 · HTTP → Anthropic (el cerebro)

- Método: `POST`
- URL: `https://api.anthropic.com/v1/messages`
- Headers:
  - `x-api-key` = la API key de Anthropic (en el vault del equipo, nunca en el repo)
  - `anthropic-version` = `2023-06-01`
  - `content-type` = `application/json`
- Body type: `Raw` · Content type: `JSON (application/json)`
- Parse response: **sí**

El body tiene tres piezas que importan:

**1. Salida estructurada.** El JSON no se pide por prompt: se impone por API.

```json
"output_config": {
  "effort": "low",
  "format": { "type": "json_schema", "schema": { ...el esquema del §5... } }
}
```

Con esto el modelo **no puede** devolver algo que no cumpla el esquema, y `accion`,
`estado`, `temperatura` y `riesgo` solo pueden tomar los valores de su lista. Se
acabaron los errores de parseo y los reintentos.

> ⚠️ La versión anterior de este escenario forzaba el JSON con un *prefill* (una
> respuesta del asistente que arrancaba con `{`). Eso **devuelve error 400** en
> Opus 5, Sonnet 5 y la familia 4.6-4.8. Ya está corregido. Si ves ese patrón en
> algún tutorial viejo, está desactualizado.

**2. Caché de prompt.** El bloque `system` lleva `cache_control` con TTL de 1 hora:

```json
"system": [{
  "type": "text",
  "text": "<el núcleo de conocimiento, ver doc 07>",
  "cache_control": {"type": "ephemeral", "ttl": "1h"}
}]
```

Una lectura de caché cuesta ~0,1× el precio de entrada; la escritura, 2× con TTL
de 1 hora. Como los DMs llegan espaciados, el TTL de 5 minutos no sirve: casi todo
serían escrituras. Detalle y números en el doc 07.

**El caché es un match de prefijo exacto:** si cambia un solo byte del `system`,
se invalida entero. Por eso ahí no va nada dinámico (ni la fecha, ni el nombre del
lead, ni el estado). Todo lo variable va en `messages`.

**3. El contexto de la conversación**, en el turno de usuario:

```
ESTADO ACTUAL: {{2.estado}}
DATOS YA CAPTURADOS: {{2.datos}}
CANAL: {{1.canal}}
NOMBRE EN EL PERFIL: {{1.nombre}}
SEGUIMIENTOS ENVIADOS: {{2.fu_count}}

HISTORIAL:
{{2.historial}}

MENSAJE NUEVO DEL LEAD:
{{1.mensaje}}
```

**Modelo:** `claude-opus-5` con `effort: "low"`. Opus 5 es el que mejor sostiene la
voz y las reglas duras, que es justo lo que este bot necesita. Las palancas de
coste, si hace falta bajarlo, son `claude-sonnet-5` y `claude-haiku-4-5`
(comparativa en el doc 07). Ojo: **el ID del modelo no lleva sufijo de fecha.**

**Alternativa sin API key propia:** el módulo AI de Make usa la conexión
`Make's AI Provider (default)` que ya existe en el equipo. Más simple de conectar,
pero consume créditos de IA de Make y no deja controlar caché ni esquema.

### 2.4 Módulo 4 · JSON › Parse JSON

- Data structure: `setter_respuesta_ia` (§5)
- JSON string: `{{ last(map(3.data.content; "text")) }}`

> Se toma el **último** bloque de texto de la respuesta, no el primero: cuando el
> modelo razona, el array `content` puede traer un bloque de pensamiento adelante
> y `content[1]` dejaría de ser el JSON.

### 2.5 Módulo 5 · Router — las 5 rutas

Las rutas son **mutuamente excluyentes**: cada mensaje entra en una y solo una. El
enum de la salida estructurada garantiza que `accion` y `riesgo` solo tomen los
valores de la tabla, así que no hace falta ruta de respaldo.

| Ruta | Filtro | Qué manda |
|---|---|---|
| **A · Consulta** | `accion` = `ofrecer_consulta` **y** `riesgo` = `ninguno` | Mensaje + link de pago |
| **B · Pack** | `accion` = `ofrecer_pack` **y** `riesgo` = `ninguno` | Mensaje + link del Pack |
| **C · Clínico** | `accion` = `derivar_clinico` **o** `riesgo` = `urgencia` | Derivación + aviso a Marcelo |
| **D · Handoff** | `accion` = `handoff_humano` **o** `riesgo` = `medico` **o** `riesgo` = `fuera_de_alcance` | Aviso a Marcelo + `pausado = true` |
| **E · Conversar** | `accion` = `responder` **y** `riesgo` = `ninguno` | Solo el mensaje de la IA |

> **El campo `riesgo` manda sobre `accion`.** Si el modelo marca `urgencia` o
> `medico`, no importa qué acción haya elegido: el mensaje no sale y el caso va a
> Marcelo. Es la segunda red de seguridad del doc 08.

### 2.6 Módulos 6-9 · HTTP → GHL (enviar el mensaje)

- Método: `POST`
- URL: `https://services.leadconnectorhq.com/conversations/messages`
- Headers:
  - `Authorization` = `Bearer {{GHL_TOKEN}}` (Private Integration token de la sub-cuenta de Marcelo)
  - `Version` = `2021-04-15`
  - `Content-Type` = `application/json`
- Body raw JSON:

```json
{
  "type": "{{ if(1.canal = "IG"; "IG"; "WhatsApp") }}",
  "contactId": "{{1.contactId}}",
  "message": "{{4.respuesta}}"
}
```

Para la ruta B (consulta) el `message` es `{{4.respuesta}}` + salto de línea +
el link de pago. Para la C, el link del Pack.

> **Ventana de 24 horas.** WhatsApp API solo deja escribir libre dentro de las 24 h
> desde el último mensaje del lead; fuera de eso hay que usar plantilla aprobada.
> Instagram permite 24 h (o 7 días con la etiqueta *human agent*). Por eso los
> seguimientos del Escenario 2 se concentran en las primeras 24 h y el FU de 72 h
> tiene que salir como plantilla desde GHL, no como texto libre desde Make.

### 2.7 Módulo 10 · Data store › Add/replace a record

- Key: `{{1.contactId}}`
- `historial`: `{{ substring(2.historial + "\nLEAD: " + 1.mensaje + "\nBOT: " + 4.respuesta; 0; 6000) }}`
  (se recorta a 6.000 caracteres para no inflar el prompt ni el data store del plan)
- `estado`, `datos`, `temperatura`: los que devolvió la IA
- `fu_count`: `0` (cada mensaje del lead reinicia el contador de seguimientos)
- `ultimo_mensaje_at`: `{{now}}`
- `pausado`: `true` solo en la ruta E

### 2.8 Módulo 11 · HTTP → GHL (tags y campos, solo en hitos)

Solo se ejecuta cuando `{{4.datos_completos}} = true` o cuando la acción no es
`responder`. Ahorra una operación por mensaje.

- `PUT https://services.leadconnectorhq.com/contacts/{{1.contactId}}`
- Header `Version` = `2021-07-28`
- Body: custom fields (§`05-Setup-GHL.md`) + `tags`

---

## 3. Escenario 2 · `[SETTER] Seguimientos`

Programado. **3 veces al día** (09:00, 14:00, 20:00 hora Chile). No cada 15 min:
cada corrida cuesta operaciones aunque no haya nada que hacer.

| # | Módulo | Qué hace |
|---|---|---|
| 1 | **Data store › Search records** | `pausado = false` AND `estado` no en (`pagado`, `agendado`, `derivado_clinico`, `frio`) AND `fu_count < 4` |
| — | *Filtro* | `now - ultimo_mensaje_at` supera el umbral del `fu_count` siguiente |
| 2 | **Router** | Una ruta por número de seguimiento |
| 3 | **HTTP → GHL** | Manda el texto del FU (están escritos en `04-Guion-...md` §5) |
| 4 | **Data store › Update** | `fu_count + 1`, `ultimo_fu_at = now` |

Umbrales: **FU1 a las 2 h · FU2 a las 24 h · FU3 a las 72 h · FU4 a los 7 días**.
Después del FU4, `estado = frio` y el bot no vuelve a escribir.

> El FU3 y el FU4 caen fuera de la ventana de 24 h de WhatsApp. Para esos dos,
> Make no manda el texto: dispara un **Workflow de GHL** que envía una plantilla
> aprobada. En Instagram sí se puede seguir mandando texto libre hasta 7 días con
> la etiqueta human agent.

---

## 4. Data store `setter_marcelo`

Un solo data store (el plan Free permite exactamente uno). Key = `contactId` de GHL.

| Campo | Tipo | Para qué |
|---|---|---|
| `contactId` | Text (key) | Identidad del lead |
| `conversationId` | Text | Hilo de GHL |
| `canal` | Text | `IG` o `WhatsApp` |
| `estado` | Text | Máquina de estados (§6) |
| `temperatura` | Text | `gold` / `silver` / `bronze` / `out` |
| `datos` | Text (JSON) | Los 5 datos de calificación |
| `historial` | Text | Transcripción recortada a 6.000 caracteres |
| `fu_count` | Number | Seguimientos enviados |
| `pausado` | Boolean | `true` = Marcelo tomó la conversación |
| `ultimo_mensaje_at` | Date | Para los umbrales de seguimiento |
| `ultimo_fu_at` | Date | Auditoría |

> **Tamaño:** el plan Free da 1 MB de data store. Con `historial` recortado a
> 6 KB, entran ~150 conversaciones activas. Hay que purgar los `frio` y `pagado`
> con más de 60 días (se puede hacer a mano una vez al mes, o con un tercer
> escenario si se sube de plan).

---

## 5. Data structure `setter_respuesta_ia`

Es el contrato entre la IA y Make. Si la IA devuelve algo distinto, el escenario
falla, así que conviene marcar todos los campos como no obligatorios menos
`respuesta` y `accion`.

| Campo | Tipo | Valores |
|---|---|---|
| `respuesta` | Text | Lo que se le manda al lead |
| `estado` | Text | Ver §6 |
| `accion` | Text | `responder` · `ofrecer_consulta` · `ofrecer_pack` · `derivar_clinico` · `handoff_humano` |
| `temperatura` | Text | `gold` · `silver` · `bronze` · `out` |
| `datos` | Collection | `nombre_dueno`, `nombre_perro`, `edad_perro`, `sintoma`, `hace_cuanto`, `come_hoy`, `ya_intento`, `pais` |
| `datos_completos` | Boolean | `true` cuando están los 5 datos |
| `riesgo` | Text | `ninguno` · `medico` · `urgencia` · `fuera_de_alcance` (ver doc 08) |
| `nota_para_marcelo` | Text | Resumen del caso, solo en handoff y en pago |

---

## 6. Máquina de estados

```
nuevo ──► saludado ──► calificando ──► espejo ──► oferta_consulta ──┐
                            │              │            │           │
                            │              │            ▼           │
                            │              │        objecion ───────┤
                            │              │                        ▼
                            │              │                  link_enviado
                            │              │                        │
                            │              │                        ▼
                            │              │                     pagado ──► agendado
                            ▼              ▼
                    derivado_clinico   nurture_pack
                            
   cualquiera ──► handoff_humano   ·   sin respuesta x4 ──► frio
```

La IA devuelve el estado en cada turno. Make no lo calcula: solo lo guarda. Eso
mantiene toda la lógica conversacional en un solo lugar (el prompt) y hace el
escenario de Make simple y barato de mantener.

---

## 7. Operaciones y coste real

**Este es el punto que hay que resolver antes de encender nada.**

La organización está hoy en plan **Free**: 1.000 operaciones/mes, 2 escenarios
activos, 1 data store, 1 MB de almacenamiento.

| Concepto | Cálculo |
|---|---|
| Ops por mensaje entrante | 6 |
| Mensajes por conversación (promedio) | ~8 |
| **Ops por conversación** | **~48** |
| Seguimientos (3 corridas/día × 30 días × ~2 ops) | ~180/mes fijas |
| **Conversaciones que caben en el plan Free** | **~17 al mes** |

Diecisiete conversaciones al mes no es un setter, es una demo. Traducción:

| Plan Make | Ops/mes | Conversaciones/mes | Veredicto |
|---|---|---|---|
| Free | 1.000 | ~17 | Solo para probar el flujo |
| **Core** | 10.000 | **~200** | **Mínimo para operar** |
| Pro | 40.000 | ~830 | Si el volumen de ads crece |

Además el plan Free limita a **2 escenarios activos**: justo los dos de este
sistema, sin margen para los escenarios de métricas que ya existen
(`[ADS]`, `[IG]` de `cerebro/docs/make-automations.md`). Con Core también se
levanta ese techo.

**Coste de IA (aparte de Make):** con Haiku 4.5, cada turno son ~2.500 tokens de
entrada y ~200 de salida. Del orden de **$0,004 por mensaje**, o sea unos **$3-4
al mes** para 200 conversaciones. Es ruido comparado con un sueldo de setter.
(Verificar el precio vigente en la web de Anthropic antes de presupuestar.)

**Cierre:** ~$10-12/mes de Make + ~$4/mes de IA reemplazan el trabajo de dos
setters. Ese es el argumento para Marcelo.

---

## 8. Guardarraíles del escenario (no del prompt)

Cosas que la IA no puede garantizar y que hay que resolver en Make:

1. **Anti-bucle.** El filtro `direccion = inbound` del §2.1. Sin excepciones.
2. **Anti-doble-respuesta.** La gente manda 3 mensajes seguidos. Opción barata:
   en el Workflow de GHL, poner un *Wait* de 15 segundos antes del webhook y
   marcar "solo el último mensaje". Opción cara (1 op extra): un `Sleep` de 10 s
   en Make + comparar `ultimo_mensaje_at`. Empezar por la de GHL.
3. **Freno de mano.** Si Marcelo o cualquier humano responde desde el inbox de
   GHL, un Workflow marca `pausado = true` por webhook. El bot se calla al toque.
4. **Manejo de errores.** Cada HTTP lleva un handler `Resume` con un texto de
   respaldo (*"Se me cayó la conexión un segundo. ¿Me repetís lo último?"*), para
   que una caída de la API no deje al lead hablando solo.
5. **Tope de gasto.** Alerta de Make al 80% de operaciones y `max_tokens: 700`
   duro en el body de Anthropic.
6. **Horario.** El bot responde 24/7, pero entre las 00:00 y las 07:00 hora del
   lead agrega *"mañana Marcelo revisa tu caso"* en vez de prometer inmediatez.
