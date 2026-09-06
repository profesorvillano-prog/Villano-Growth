# Auditoría bot setter Cool Drive — Fase A (solo diagnóstico)

Fecha de la lectura: 2026-09-06, ~04:00 UTC. Todo lo de abajo es lectura. No se ejecutó ninguna
operación de escritura en Make ni en GoHighLevel.

---

## 0. Fuentes: a qué accedí y a qué no

### Accedí

| Fuente | Detalle |
|---|---|
| Blueprint completo escenario 7130146 `[BOT] Cool Drive - WhatsApp + Instagram` | JSON íntegro, 14 módulos + onerror handlers |
| Blueprint completo escenario 7131746 `[BOT] Cool Drive - Seguimiento automatico` | JSON íntegro |
| System prompt textual del módulo 3 (Cerebro) y del módulo 2 del seguimiento | Íntegros |
| Data store 173778 `cooldrive_memoria` | 36 registros leídos completos |
| Estructura de datos 552700 | Tipos de campo declarados |
| Historial de ejecuciones de ambos escenarios | Timestamps, operaciones, duración, status, eventos de edición |
| GHL location `2IusdptAEdUqdDyeNZxU` | 40 conversaciones listadas; 5 hilos leídos mensaje a mensaje |

### No pude obtener

1. **Detalle por módulo de las ejecuciones (input/output real de cada módulo).**
   `executions_get-detail` devuelve únicamente `{"status":"SUCCESS"}` y `executions_get` solo
   metadatos (duración, operaciones, transfer). No hay forma de leer el bundle de entrada/salida
   de cada módulo desde este MCP. Esto es una limitación real de la auditoría: varias causas raíz
   de abajo están inferidas del blueprint + los timestamps + el texto publicado en GHL, no del
   bundle. Donde eso pasa, lo digo.
2. **El contenido de los workflows de GoHighLevel.** El MCP de GHL no expone workflows. El webhook
   3620891 lo dispara un workflow de GHL que no puedo leer: no sé qué filtros tiene, si reintenta,
   ni con qué payload exacto llama. Varios comportamientos observados (mensajes entrantes que no
   generaron ejecución en Make) solo se explican mirando ese workflow.
3. **Los 4 elementos en DLQ del escenario 7130146.** El listado de ejecuciones no los expone y no
   hay operación de lectura de DLQ disponible.
4. **Conversaciones anteriores al 2026-08-24.** El listado devuelve 40 hilos; los más antiguos son
   del 2026-08-24. Para la línea base histórica solo tengo esa ventana.

### Nota de seguridad, fuera del alcance pedido pero no la puedo callar

El blueprint lleva **en texto plano** el Private Integration Token de GHL y la API key de Anthropic,
repetidos en 6 módulos entre los dos escenarios. Cualquiera con acceso de lectura al escenario (o a
un export del blueprint) se lleva las dos credenciales. No las transcribo acá. Corresponde moverlas
a Connections / variables de organización y rotarlas. Lo dejo anotado, no es parte de los hallazgos
de conversación.

---

## 1. Línea base: qué está funcionando y no se toca

### 1.1 La agrupación de ráfagas YA está implementada y funciona

Es el punto más importante del informe: el problema número uno del brief **ya fue resuelto el
2026-09-05 a las 20:39 UTC** (evento `modify` id 67266982, y un segundo ajuste a las 20:54).
Los módulos 40 / 10 / 42 y el filtro del módulo 30 no existían antes de esa hora.

Mecanismo real (blueprint 7130146):

- **M40** `datastore:UpdateRecord` upsert, key `{{1.contactId}}`, escribe `ultimo_mensaje_at = {{now}}`.
- **M2** `datastore:GetRecord` lee el registro (queda con el timestamp que acaba de escribir esta ejecución).
- **M10** `util:FunctionSleep` 45 s.
- **M42** `datastore:GetRecord` vuelve a leer.
- **M30** filtro `Solo responde el ultimo mensaje de la tanda`:
  `formatDate(42.ultimo_mensaje_at;"X") == formatDate(2.ultimo_mensaje_at;"X")`.

Es exactamente el patrón token del brief, con el timestamp haciendo de token.

**Evidencia de que funciona, tres casos independientes:**

- Verónica Vergara (conv `Wf0ypGzk7dwHWvBD1R1N`), 2026-09-05: entran `¿Dónde están ubicados?`
  (23:34:29.911) y `Tengo dudas sobre el curso...` (23:34:30.150). Sale **una** respuesta
  (23:35:22.688) que cubre las dos: *"Hola Verónica! Estamos en Sergio Silva Acuña 464, Maipú.
  Cuéntame qué dudas tienes del curso..."*.
- Elisa Mundaca (conv `F0EjpDZEFd4LkKJKtN7D`): entran `Full` (22:39:31), `Y pago con tarjeta`
  (22:39:40) y `Me gustaría pagar a fin de mes y comenzar en octubre` (22:40:01). Sale **una**
  respuesta (22:40:56) que cubre las tres.
- Confirmado en las ejecuciones: `9cf27ead...` (22:39:34) y `04b5ce98...` (22:39:42) consumen
  **5 operaciones** cada una y duran ~45 s — son las dos ejecuciones que murieron en el filtro del
  módulo 30. La tercera, `4dd964d4...` (22:40:03), consume **14 operaciones**: es la que respondió.

Esto es la línea base. Cualquier cambio que se proponga en Fase B tiene que preservar este patrón.

### 1.2 El handoff a humano funciona de punta a punta

Elisa, 22:40:56: el bot manda el link de pago del Full. Módulo 8 aplica los tags
`bot-off / atencion-humana / lead-caliente`. A partir de ahí los mensajes entrantes de Elisa
(`Ok.` 22:41:20, `Le puedo dar mi WhatsApp...` 22:41:47) **no generan ninguna ejecución en Make**
—no aparecen en el listado de ejecuciones— y a las 22:53:37 responde una persona
(`userId 5RMuOwHwBmAaIZkI8pYj`, sin `meta.marketplace`). El bot se calló y el humano cerró. Eso
está bien y no se toca.

### 1.3 El pipeline de GHL refleja el estado real

Elisa: `Opportunity created / Nuevo` (22:30:39) → `Información Entregada` (22:33:07) →
`Cierre propuesto` (22:40:57). Los tres saltos coinciden con lo que efectivamente pasó en el chat.
El `switch` del módulo 12 está bien mapeado y el filtro `estado != estado anterior` evita el ruido.

### 1.4 Cierres reales que sí ocurrieron

- Elisa Mundaca: de "Tengo dudas sobre el curso..." a link de pago del Full en **11 minutos**,
  con la objeción "quiero pagar a fin de mes" resuelta con el argumento correcto de los 60 días.
- Felipe Ferreira (`KrlxUMddhYQOhnrSFaNp`): estado `cierre_propuesto`, temperatura caliente,
  curso Avanzado asignado con la regla correcta (ya manejó → Avanzado).
- Carol Ormeño (`rgfUn70ZL7jF1FRAuKel`): 53 años, con miedo. El bot empatizó antes de informar,
  recomendó Full, y llegó a `oferta_anclada` con la cifra de promo. Que no cerrara no es un fallo
  del bot; llegó hasta donde se podía llegar.

### 1.5 Decisiones que se ven raras en el código pero funcionan: respetar

- **Sleep de 45 s y no de 12-15 s.** El brief pide 12-15. Los 45 s están funcionando y tienen una
  razón que no está escrita en ningún lado pero se ve en los datos: `M43` lee la conversación desde
  la API de GHL, y GHL tarda en indexar el mensaje entrante. Bajar la ventana sin medir ese lag
  rompe la lectura del historial. No es un hallazgo, es una decisión a respetar hasta tener el dato.
- **El buffer no concatena texto en el data store.** En vez de eso relee los últimos 10 mensajes de
  GHL (`M43`). Es una implementación distinta a la del brief pero es más robusta: sobrevive a que
  el escenario se caiga a mitad de ráfaga. Se mantiene. (Su defecto está en 4.1, y es de mapeo, no
  de arquitectura.)
- **`mensajes` es un array de un solo elemento y el módulo 5 manda `first(4.mensajes)`.** El brief
  pide dividir ocasionalmente en dos mensajes. Está deliberadamente desactivado y el prompt lo
  refuerza tres veces. En un canal donde una respuesta larga ya se ve como bot, mandar dos seguidos
  se ve peor. Decisión existente, no la toco sin datos.

---

## 2. Mapa del flujo real

### 2.1 Escenario 7130146 — respuesta en vivo

`instant: true` · `maximum_runs_per_minute: 100` · `sequential: false` · `dlq: true` · `maxErrors: 3`

```
M1  gateway:CustomWebHook (hook 3620891 "COOLDRIVE IG-WSP")
    campos consumidos: 1.contactId · 1.canal · 1.nombre · 1.mensaje
 |
M40 datastore:UpdateRecord (173778) upsert=true  key={{1.contactId}}
    data.ultimo_mensaje_at = {{now}}                       [onerror M41 Resume]
 |
M2  datastore:GetRecord (173778) key={{1.contactId}}       [onerror M19 Resume]
 |
M10 util:FunctionSleep duration=45
 |
M42 datastore:GetRecord (173778) key={{1.contactId}}       [onerror M44 Resume]
 |
M30 http GET /contacts/{{1.contactId}}                     [onerror M31 Resume]
    FILTRO "Solo responde el ultimo mensaje de la tanda"  (OR de dos ramas)
      A) formatDate(42.ultimo_mensaje_at;"X") == formatDate(2.ultimo_mensaje_at;"X")
      B) ifempty(2.ultimo_mensaje_at;"VACIO") == "VACIO"
 |
M35 http GET /conversations/search?locationId=...&contactId=...&limit=1  [onerror M36 Resume]
    FILTRO "Bot habilitado": join(30.data.contact.tags;",") no contiene "alumno"
                          Y no contiene "bot-off"
 |
M43 http GET /conversations/{{get(map(35.data.conversations;"id");1)}}/messages?limit=10
                                                            [onerror M45 Resume]
 |
M3  http POST api.anthropic.com/v1/messages                [onerror M20 Ignore]
    model claude-sonnet-5 · max_tokens 1000 · thinking disabled · effort low
    output json_schema {mensajes[], resumen, estado, temperatura, accion, datos{...}}
    system con cache_control ephemeral ttl 1h
    user: CANAL / NOMBRE / ESTADO / TURNOS / DATOS / RESUMEN /
          TUS ULTIMOS MENSAJES = join(map(43...;"body";"direction";"outbound")," // ")
          MENSAJES NUEVOS      = ifempty(join(map(43...;"body";"direction";"inbound")," // "); 1.mensaje)
 |
M4  json:ParseJSON (estructura 552687)                     [onerror M25 Ignore]
 |
M5  http POST /conversations/messages
    type = ifempty(switch(35.lastMessageType; TYPE_INSTAGRAM->IG; TYPE_WHATSAPP->WhatsApp;
                          TYPE_FACEBOOK->FB); ifempty(1.canal;"WhatsApp"))
    message = replace(first(4.mensajes); newline; " ")
 |
M7  datastore:AddRecord (173778) overwrite=true  key={{1.contactId}}
    canal · datos · estado · turnos={{ifempty(2.turnos;0)+1}} · pausado · fu_count
    historial={{ifempty(replace(4.resumen;newline;" ");"Conversacion iniciada...")}}
    temperatura · ultimo_mensaje_at={{2.ultimo_mensaje_at}}   <-- ojo, el valor VIEJO
 |
M9  builtin:BasicRouter
    ├─ ruta 1 → M12 POST /opportunities/upsert       [onerror M26 Ignore]
    │     FILTRO 4.estado != 2.estado AND != "frio" AND != "alumno"
    │     stage = switch(4.estado; nuevo|calificando|precio_dado|oferta_anclada|
    │                    cierre_propuesto|quiere_inscribirse; default=nuevo)
    │     monetaryValue = switch(4.datos.curso_interes; full=140000; avanzado=110000;
    │                            solo_practicas=200000; default=0)
    └─ ruta 2 → M8  POST /contacts/{id}/tags          [onerror M24 Ignore]
          FILTRO 4.accion != "responder"
          tags: bot-off + (alumno | atencion-humana) + lead-{temperatura}
```

### 2.2 Escenario 7131746 — seguimiento

`indefinitely / interval 14400` (cada 4 h)

```
M1 datastore:SearchRecord (173778) limit=15  continueWhenNoRes=false
   filtro: pausado == false  AND temperatura != "frio"  AND fu_count < 1
           AND turnos > 0    AND ultimo_mensaje_at < addHours(now;-14)
 |
M30 http GET /contacts/{{1.key}}                            [onerror M31 Resume]
 |
M2  http POST api.anthropic.com  (redactor del seguimiento)  [onerror M20 Ignore]
    FILTRO: hora Santiago >= 10  AND <= 20
            AND ultimo_mensaje_at > addHours(now;-23)
            AND tags sin "alumno" AND sin "bot-off"
 |
M3  json:ParseJSON (552936) {enviar, mensaje, motivo}       [onerror M21 Ignore]
 |
M4  Router
    ├─ M5 POST /conversations/messages   FILTRO 3.enviar == true   [onerror M22 Resume]
    └─ M6 datastore:UpdateRecord upsert=false  SIN FILTRO          [onerror M23 Resume]
          fu_count = if(3.enviar; fu_count+1; 1)
          historial = if(3.enviar; historial + " SEGUIMIENTO: ..." recortado a 2500; historial)
          ultimo_fu_at = now
```

### 2.3 Puntos donde una variable puede llegar vacía, nula o mal formada

| # | Punto | Qué pasa | Consecuencia observable |
|---|---|---|---|
| V1 | `M2` falla → `M19 Resume` | `2.ultimo_mensaje_at` queda vacío | La rama B del filtro de `M30` da verdadero → **toda ejecución pasa** → una respuesta por mensaje de la ráfaga |
| V2 | `M42` falla → `M44 Resume` | `42.ultimo_mensaje_at` vacío | Rama A del filtro falsa → la ejecución muere aunque sea la última: **el lead queda sin respuesta** |
| V3 | Dos mensajes en el mismo segundo | `formatDate(...,"X")` tiene granularidad de segundo | Las dos ejecuciones ven el mismo token → **doble respuesta** |
| V4 | Carrera entre `M40` (write) y `M2` (read) | `M2` de la ejecución A puede leer el `now` que escribió la ejecución B | A y B comparten token → **doble respuesta** |
| V5 | `M7` escribe `ultimo_mensaje_at = {{2.ultimo_mensaje_at}}` (valor de hace 45 s) | Pisa el timestamp que una ejecución posterior ya había escrito en `M40` | El mensaje que el lead escribió mientras el modelo generaba **se pierde sin respuesta** |
| V6 | `M35` sin resultados o con error → `M36 Resume` | `get(map(35.data.conversations;"id");1)` vacío | URL de `M43` queda `/conversations//messages` → error → `M45 Resume` → el modelo recibe historial vacío y cae al fallback `1.mensaje` |
| V7 | `M3` falla → `M20 Ignore` | Se corta la ejecución completa | No hay respuesta, **y `M7` nunca corre**: el estado del data store queda sin actualizar, `turnos` no sube |
| V8 | `M4` ParseJSON falla → `M25 Ignore` | Igual que V7 | Ídem |
| V9 | `4.datos.*` vacío | `datos` se guarda como `curso= manejo= cuando= nombre=` | El modelo recibe un string con signos igual sueltos, no un "no sé". Se ve en 14 de 36 registros |
| V10 | `M43` trae los últimos 10 mensajes sin recortar por la ráfaga | El join de `inbound` incluye mensajes que el bot **ya respondió** | Ver hallazgo 4.1 |
| V11 | Registros heredados sin `temperatura` ni `turnos` (`U2eWgPg6...`, `kRTuoEj1...`) | El filtro de `SearchRecord` los evalúa contra campos ausentes | Quedan fuera del seguimiento para siempre |
| V12 | `M6` del seguimiento no tiene filtro | Corre también cuando `M2` o `M3` fallaron y `3.enviar` viene vacío | `fu_count` pasa a 1 sin haber escrito nunca → **el lead quema su único seguimiento con un error de API** |

---

## 3. Taxonomía de fallos

Ordenados por impacto en la venta × frecuencia. Agrupo por causa compartida.

---

### CAUSA A — El campo `MENSAJES NUEVOS DEL LEAD` no está acotado a la ráfaga

`M3` arma la tanda así:

```
join(map(43.data.messages.messages; "body"; "direction"; "inbound"); " // ")
```

`M43` pide `?limit=10`, sin filtro por fecha ni por el timestamp de la ráfaga. Entonces el modelo
recibe como "mensajes nuevos" **todos los mensajes entrantes de los últimos 10 del hilo**, incluidos
los que él mismo ya contestó dos turnos atrás. El prompt le ordena responderlos todos
("PROHIBIDO responder solo al último texto e ignorar los otros") y el modelo obedece.

**Capa: escenario de Make, mapeo del módulo 3.** No es del prompt.

#### A.1 — El bot repite un bloque de información completo que acaba de dar

Conversación Elisa Mundaca, `F0EjpDZEFd4LkKJKtN7D`, 2026-09-05.

- 22:32:03 LEAD: `Precios, duración, horarios y ubicación?`
- 22:33:00 BOT: *"Te cuento todo: estamos en Sergio Silva Acuña 464, Maipú, atendemos de lunes a viernes de 9:00 a 13:00 y de 16:30 a 21:00. El Curso Full cuesta $140.000 con 12 clases prácticas y el Avanzado $110.000 con 8... Y hasta el 17 de septiembre hay una promo, si te interesa te cuento el monto"*
- 22:34:00 LEAD: `Si`
- 22:34:54 BOT: *"La dirección es Sergio Silva Acuña 464, Maipú. El Avanzado dura mínimo 1 mes y medio y sale $110.000, el Full mínimo 2 meses y sale $140.000... Las prácticas son de lunes a viernes, mañana entre 9:00 y 13:30 o tarde entre 15:45 y 21:00... Y hasta el 17 de septiembre hay una promo, si te interesa te cuento la cifra"*

**Qué debió pasar:** el `Si` es la respuesta a "si te interesa te cuento el monto". Debió salir
solo *"La promo deja el Full en $119.990 y el Avanzado en $90.000, pagando hasta el 17"*.

**Causa raíz:** en esa ejecución, el join de `inbound` sobre los últimos 10 mensajes devolvió
`Si // Precios, duración, horarios y ubicación? // Tengo dudas sobre el curso...`. El modelo vio
la pregunta de precios como nueva y la re-contestó. El prompt tiene una regla explícita para este
caso exacto ("si ofreciste contarle el monto de la promo y dice sí, LE DAS EL MONTO") y aun así
falló, porque el input le está mintiendo sobre qué es nuevo.

#### A.2 — Mismo patrón, dos turnos después, en la misma conversación

- 22:36:44 LEAD: `Dame la información de la promoción`
- 22:37:37 BOT: *"La promo de septiembre deja el Full en $119.990 en vez de $140.000, y el Avanzado en $90.000 en vez de $110.000, pagando hasta el 17..."*
- 22:38:15 LEAD: `Medio de pago?`
- 22:39:08 BOT: *"Puedes pagar por transferencia, efectivo, débito, cuotas con tarjeta o link de pago. **La promo de septiembre deja el Full en $119.990 y el Avanzado en $90.000, pagando hasta el 17.** Cuál de los dos te acomoda más?"*

Repite las cifras textuales que dio 90 segundos antes, contra la regla número 1 del prompt
("Si en TUS ÚLTIMOS MENSAJES ya aparecen las cifras con descuento, NO las vuelvas a escribir").
El prompt incluso trae este caso como ejemplo resuelto. Falla igual: la causa está en el input.

#### A.3 — Repetición de dirección y horario

Registro del data store `9WWCJM3UqmXAylu3f1IW` (Magdalena, WhatsApp, 2026-09-05), resumen escrito
por el propio bot: *"Preguntó ubicación, se dio dirección Sergio Silva Acuña 464 Maipú y horario de
atención, **reiterada luego**."* El bot documenta su propia repetición.

**Frecuencia:** no es determinista. En Verónica Vergara (00:26:22 `Valor / Duración del curso`,
00:27:16 respuesta) el bot **no** repitió la dirección, aunque la pregunta por ubicación seguía
dentro de la ventana de 10 mensajes. Es un factor de riesgo permanente que se materializa cuando la
conversación es densa. En los 5 hilos leídos aparece en 3.

**Impacto en la venta:** alto. Es el fallo que más delata al bot y el que dispara el "esto es un
robot" en el momento exacto en que el lead está evaluando pagar.

**Regla de prevención:** el campo de la tanda debe construirse con los mensajes `inbound` cuyo
`dateAdded` sea posterior al último `outbound` del bot, o posterior a la marca de inicio de la
ráfaga. No con "los inbound de los últimos 10".

---

### CAUSA B — El seguimiento automático nunca ha enviado un mensaje

**Evidencia dura:** de los 36 registros del data store, **36 tienen `fu_count` en 0 o vacío**.
Ninguno tiene `ultimo_fu_at`. En el listado de mensajes de los 5 hilos leídos no hay un solo mensaje
que corresponda al patrón del redactor de seguimiento.

Las ejecuciones del escenario 7131746 desde que quedó estable (2026-09-05 15:38) son:
15:38:15, 19:38:13, 23:38:13 y 03:38:16, **todas de 6 operaciones**. Seis operaciones = 1
`SearchRecord` + 5 llamadas `GET /contacts`. Es decir: encuentra 5 registros, les pide los tags, y
**ninguno pasa el filtro del módulo 2** — el Cerebro nunca se llama.

Tres cosas concurren:

#### B.1 — Registros zombi que ocupan la búsqueda para siempre

Los 5 registros que encuentra son los de 2026-08-28 / 08-29 (`U2eWgPg6...`, `kRTuoEj1...`,
`RjOQi1pE...`, `FnNwjA3O...`, `osPwuAx4...`, `yu6vAiSc...`, `QxeTEJRD...`). Cumplen el filtro del
`SearchRecord` (`ultimo_mensaje_at < now-14h`, `fu_count < 1`, `turnos > 0`, `pausado false`) y lo
van a cumplir **eternamente**, porque nada los saca: el módulo 6 solo los tocaría si el flujo llegara
hasta ahí, y no llega, porque el módulo 2 exige `ultimo_mensaje_at > now-23h` y ellos tienen 9 días.
Bucle cerrado. Consumen 6 operaciones cada 4 horas y ocupan slots del `limit: 15`.

**Capa: estado entre turnos** (data store sin política de expiración) + **escenario** (el
`SearchRecord` no acota por arriba, el filtro de `M2` sí).

#### B.2 — La ventana útil es de 14 h a 23 h, con un scheduler cada 4 h

`SearchRecord` pide `> 14 h` de silencio; `M2` exige `< 23 h`. Ventana de 9 h, barrida cada 4 h,
pero además `M2` exige hora Santiago entre 10 y 20. Las corridas de 23:38 UTC (19:38 CL) y 03:38 UTC
(23:38 CL) — esta última fuera de horario — reducen la cobertura real. Un lead que se calla a las
17:00 CL entra en ventana a las 07:00 CL del día siguiente y sale a las 16:00 CL; solo lo pillan las
corridas de 10:00-16:00. Es estrecho pero no imposible.

**No puedo afirmar que el seguimiento esté roto.** Lo que puedo afirmar es que **en 0 de 36 casos ha
enviado algo**, y que las 4 corridas observadas desde el arreglo no encontraron ni un lead elegible.
Para cerrar la causa raíz me falta: el detalle por módulo de una corrida (para ver qué devuelve
`SearchRecord` y en qué condición exacta muere `M2`), que es justo lo que este MCP no entrega.

#### B.3 — `temperatura != frio` excluye al grueso del tráfico frío

El filtro descarta todo lead marcado `frio`. En tráfico click-to-WhatsApp, el lead que llega con
"hola" o "info" y no avanza queda `frio` por definición del propio prompt
("frio si solo saludó o dijo que lo pensaría"). Registros `osPwuAx4...`, `QxeTEJRD...`,
`MlWv3qrd...`, `0jygzIxQ...`: todos frío, todos sin seguimiento posible. **Son exactamente los leads
que un seguimiento recupera.**

Caso Ramon (`wAUiLySoD1XZLsIGlh7E`), 2026-09-05, tráfico de anuncio:
- 16:37:37 LEAD (precargado del anuncio): `¿Dónde están ubicados?`
- 16:38:57 BOT: dirección + horario + `Estás viendo sacar la licencia?`
- 16:44:19 LEAD: `Ok gracias`
- 16:44:38 BOT: *"De nada Ramon! si quieres avanzar con la licencia, cuéntame no más y te ayudo a ver qué curso te conviene"*
- 16:52:27 LEAD: `Ok`
- 16:52:43 BOT: *"Cualquier cosa que necesites saber sobre el curso o los valores me dices no más, Ramon"*

Termina en `temperatura: frio` → excluido del seguimiento. Un lead de anuncio pagado que preguntó
por la ubicación y se enfrió, y el sistema decide no volver a hablarle nunca.

**Impacto en la venta: el más alto de todo el informe.** Es facturación que se está dejando en la
mesa de forma silenciosa.

#### B.4 — Un error de la API de Anthropic quema el único seguimiento del lead

El módulo 6 (`Registrar el seguimiento`) está en la ruta 2 del router **sin filtro**. Si `M2` falla
(`M20 Ignore`) o `M3` no parsea (`M21 Ignore`), `3.enviar` llega vacío → `if(3.enviar; ...; 1)` →
`fu_count = 1`. Con el filtro `fu_count < 1`, ese lead **nunca más entra al seguimiento**, sin que
se le haya escrito una línea. Es un fallo silencioso: la ejecución termina en status 1 (éxito).

**Capa: escenario de Make.** Aún no lo he visto materializado (no hay `ultimo_fu_at` en ningún
registro), pero está armado.

---

### CAUSA C — Doble respuesta a la ráfaga (histórico, pre 20:39 UTC del 05-09)

Todos los casos que encontré son **anteriores** al arreglo. Los dejo porque son la batería de
regresión: si un cambio futuro los reintroduce, hay que detectarlo.

#### C.1 — Dos mensajes, dos saludos

Conversación `OIBnWtBpvf6uDvuR4q6v` (WhatsApp, anuncio "Clases de manejo en la tarde"), 2026-09-05:

- 20:04:39 LEAD: `*Headline:* Clases de manejo en la tarde, en Maipú ... ¡Hola! Me gustaría inscribirme`
- 20:24:03 BOT: `Hola! cuéntame, en qué te puedo ayudar?`
- 20:24:05 BOT: `Hola! Buenísimo que te quieras inscribir. Cuéntame, has manejado algo antes o partirías de cero?`

Dos respuestas a **un** mensaje, con dos segundos de diferencia y dos saludos. Además la primera
ignora por completo el contenido ("me gustaría inscribirme") y pregunta en qué puede ayudar.

#### C.2 — Una respuesta por mensaje de la ráfaga, y la primera repregunta algo ya respondido

Conversación Carol Ormeño, `wj6yGr9q6xM3wc3CbtnD`, 2026-09-05:

- 18:15:36 LEAD: `Soy vieja. Tengo 53 años y me da miedo manejar. Sé lo básico, los pedales, las reglas en general. Pero no me he atrevido aún. Tomé un auto un par de veces de chica...`
- 18:15:45 LEAD: `Espero decir ya! Vamos.`
- 18:16:03 BOT: `Me encanta esa actitud Carol! Así partimos altiro. Me cuentas, has manejado algo antes o serías primera vez?`
- 18:16:09 BOT: `Carol, para nada eres vieja... Con lo que cuentas te recomiendo el Curso Full...`

Dos respuestas, y la primera pregunta *"has manejado algo antes"* cuando la lead acababa de escribir
*"Tomé un auto un par de veces de chica"*. Es el fallo que el brief marca como el que más rompe la
ilusión, y aquí es consecuencia directa de responder al primer mensaje de la ráfaga.

**Nota de precisión:** en esa misma conversación hay dos mensajes idénticos a las 19:20:20 y
19:20:22. **No es un doble envío**: comparten el mismo `altId` de Instagram, es el mismo mensaje
registrado dos veces por GHL (una por la API, otra por el webhook de eco). No lo cuento como fallo.

---

### CAUSA D — Fallos de estilo y de rol que sobreviven al prompt

Todos son de **capa prompt**. El prompt actual es largo (≈10.500 palabras) y las reglas más
específicas ganan a las generales.

#### D.1 — Frases textualmente prohibidas que igual salen

- *"**Te cuento todo:** estamos en Sergio Silva Acuña 464..."* — Elisa, 22:33:00. El prompt
  prohíbe literalmente "Te cuento todo" **y** los dos puntos para explicar, en la misma línea:
  *"Nada de Claro, Por supuesto, Excelente pregunta, Perdona, Te cuento todo"* /
  *"PROHIBIDO los dos puntos para explicar"*. Salieron los dos juntos.
- *"Hola! **te cuento**, estamos en Sergio Silva Acuña 464..."* — Carol, 16:55:40.

**Causa raíz:** el prompt enuncia las prohibiciones como texto plano dentro de un bloque largo,
sin ejemplo contrastado de qué escribir en su lugar. Las reglas que sí tienen tabla
"Nunca escribo | Escribo" (las de ortografía) se cumplen mejor.

#### D.2 — Mensajes de 4 y 5 líneas donde el estándar pide 1 a 3

- Elisa 22:33:00: 4 datos encadenados, ~430 caracteres. El prompt fija "máximo unos 300 caracteres".
- Elisa 22:34:54: ~370 caracteres.
- Carol 18:20:43: paso a paso completo, ~330 caracteres.

El prompt se auto-habilita la excepción ("Solo te extiendes si piden el paso a paso o si es la
PRIMERA vez que das los dos precios") y el modelo la usa de forma expansiva.

#### D.3 — Pregunta colgada después de responder una pregunta del lead

Regla 3 del prompt: *"SI EL LEAD TE HIZO UNA PREGUNTA, RESPÓNDELA Y TERMINA AHÍ."*

- Elisa 22:38:15 `Medio de pago?` → 22:39:08 respuesta que termina en `Cuál de los dos te acomoda más?`
- Carol 18:40:32 `Y cada cuanto son las 12 clases prácticas?` → 18:41:01 respuesta que termina en `para cuándo lo estarías necesitando?`
- Conv `OIBnWtBpvf6uDvuR4q6v` 20:29:58 `Que horarios manejas?` → 20:30:18 respuesta que termina en `Para cuándo te gustaría partir con el curso?`

3 de 3 casos observados. La regla no se está cumpliendo prácticamente nunca.

#### D.4 — Repetición de la misma pregunta

Conv `OIBnWtBpvf6uDvuR4q6v`: `Para cuándo te gustaría partir?` (20:29:02) y
`Para cuándo te gustaría partir con el curso?` (20:30:18), con 76 segundos de diferencia.
Confirmado en el resumen del data store del registro `2Fn7J2EI7VR5NYAsZUAP`:
*"Se preguntó **nuevamente** para cuándo quiere partir."*

**Causa raíz mixta:** el `resumen` sí arrastra "última pregunta hecha", pero cuando la tanda mal
acotada (Causa A) devuelve el mensaje viejo, el modelo reconstruye la conversación desde cero.

#### D.5 — Repetición del nombre del lead en cada mensaje

Ramon: `De nada Ramon!` / `...me dices no más, Ramon` en dos mensajes consecutivos.
Carol: `Ya Carol`, `Carol, para nada eres vieja`, `Tranquila Carol`, `Me encanta esa actitud Carol!`,
`Ya Carol, con toda confianza` — 5 de 8 mensajes. El estándar pide una vez al inicio.
El prompt actual **no tiene** una regla sobre esto (sí la tiene el prompt de Marcelo). Es una
omisión, no una desobediencia.

#### D.6 — La Sra. Cecilia, mencionada 5 veces en un hilo

Regla 9 del prompt: *"LA SRA. CECILIA SE MENCIONA UNA SOLA VEZ."*
Carol: 18:16:09, 18:20:43, 18:41:01, 19:16:45, 19:20:20, 19:35:43. Seis veces.

**Salvedad honesta:** el prompt se editó por última vez a las 22:59 del 05-09, después de esta
conversación. No puedo determinar si la regla 9 existía a las 18:16. Lo dejo como caso de regresión
a verificar, no como incumplimiento probado.

---

### CAUSA E — Datos y estado mal formados

#### E.1 — `datos` con dos esquemas distintos conviviendo

- Esquema viejo (7 registros, hasta 08-29): `nombre=; manejo=; curso=; franja=; cuando=; origen=`
- Esquema nuevo (29 registros): `curso= manejo= cuando= nombre=`

Los campos `franja` y `origen` ya no los produce el schema de salida del modelo, pero siguen en los
registros viejos. Si uno de esos leads vuelve a escribir, `M3` recibe un `DATOS YA CAPTURADOS` con
campos que el prompt no describe.

#### E.2 — Registros sin `temperatura` ni `turnos`

`U2eWgPg6KFaoi1V1KkRB` y `kRTuoEj1SUjOQsnIP3v4` no tienen ninguno de los dos campos. El prompt
recibe `TURNOS: 0` por el `ifempty`, con lo cual el bot **volvería a saludar** a un lead con el que
ya conversó. No lo he visto materializado (esos leads no volvieron a escribir), pero está armado.

#### E.3 — `historial` viejo con formato de transcripción, no de resumen

Los registros de agosto guardan `\nLEAD: ...\nBOT: ...` en vez del resumen de 400 caracteres. El
mapeo actual escribe `4.resumen`. Es residuo de una versión anterior. Sin impacto mientras esos
leads no vuelvan.

#### E.4 — Un link de pago que ya no existe quedó registrado

`qhsKd4okUdQ12HYO5PLD` (2026-08-29): *"Te dejo el link para pagar el Curso Avanzado,
https://mpago.la/2RSZX2x"*. Los DATOS DUROS actuales tienen `https://mpago.la/2VH6nMH` para el
Avanzado. O el link cambió, o el bot inventó uno. No puedo distinguir cuál sin el histórico de
ediciones del prompt. **Dato que me falta:** cuándo se editó el link del Avanzado en el prompt.
Si nunca fue `2RSZX2x`, esto es una alucinación de link de pago y sube a prioridad máxima.

#### E.5 — Fallo ya corregido que conviene vigilar

`FnNwjA3O209elRYvkilr` y `osPwuAx4HksdBa8fAJmR` (08-28/29): *"estamos en Sergio Silva Acuña 464,
**a pasos de la Plaza de Maipú**"*. El prompt actual lo prohíbe explícitamente
(*"NUNCA digas que estamos cerca de la Plaza de Maipú ni de ningún hito"*). Corrección aplicada en
la capa correcta (prompt) y sostenida: en los 5 hilos recientes leídos no vuelve a aparecer. Es el
ejemplo de que las correcciones de dato duro sí pegan; las de estilo (D.1-D.3) no.

---

## 4. Diagnóstico priorizado

| # | Causa raíz | Capa | Fallos que explica | Riesgo de dejarla como está |
|---|---|---|---|---|
| 1 | El seguimiento nunca sale: registros zombi + ventana estrecha + exclusión de `temperatura=frio` | Escenario 7131746 + estado | B.1, B.2, B.3, B.4 | Es el agujero de facturación más grande. Todo el tráfico frío de Meta que no cierra en la primera sesión se pierde sin un solo intento de recuperación. 36/36 leads sin seguimiento |
| 2 | `MENSAJES NUEVOS DEL LEAD` no está acotado a la ráfaga (`M43` limit=10 sin filtro temporal) | Escenario 7130146, mapeo M3 | A.1, A.2, A.3, y agrava D.4 | El bot repite bloques enteros de información justo en el momento de decisión. Es el fallo que más delata al bot ante un lead caliente |
| 3 | `M7` reescribe `ultimo_mensaje_at` con el valor viejo | Escenario 7130146, mapeo M7 | V5 | El mensaje que el lead escribe mientras el modelo genera queda sin respuesta y sin rastro. Silencioso |
| 4 | El filtro anti-ráfaga tiene dos vías de escape: rama `VACIO` y granularidad de segundo | Escenario 7130146, filtro M30 | V1, V2, V3, V4 | Un error transitorio del data store devuelve el sistema al comportamiento pre-arreglo (una respuesta por mensaje) sin que nadie se entere |
| 5 | Las reglas de estilo del prompt no se cumplen: pregunta colgada, largo, frases prohibidas | System prompt | D.1, D.2, D.3, D.5 | Erosión constante de la sensación de "persona". No mata una venta por sí sola, pero es lo que hace que el lead baje el ritmo |
| 6 | El data store no tiene política de expiración ni migración de esquema | Estado entre turnos | E.1, E.2, E.3, B.1 | Los registros viejos van a seguir acumulándose y ocupando slots del seguimiento. En 3 meses el `limit: 15` va a estar 100% ocupado por zombis |
| 7 | Credenciales en texto plano en el blueprint | Escenario (ambos) | — | Exposición del PIT de GHL y de la API key de Anthropic |

**Cosa que no puedo determinar y que necesito antes de proponer nada sobre el punto 1:**
el detalle por módulo de una corrida del escenario 7131746 en horario hábil (qué devuelve el
`SearchRecord` exactamente y contra qué valor muere el filtro de `M2`). No es accesible por MCP.
Se obtiene abriendo una ejecución en la UI de Make.

---

## 5. Lo que no se debe tocar, y por qué

1. **Los módulos 40 / 10 / 42 y el filtro del módulo 30.** Es la agrupación de ráfagas, funciona,
   está probada en tres conversaciones. Cualquier cambio ahí se valida contra los tres casos de
   1.1 antes de aplicarse.
2. **El sleep de 45 segundos.** No bajarlo a 12-15 sin medir primero cuánto tarda GHL en indexar el
   mensaje entrante para que `M43` lo devuelva. Si se baja a ciegas, `M43` empieza a devolver el
   historial sin el último mensaje del lead y el bot responde a la conversación de hace un turno.
3. **`mensajes` como array de un solo elemento y el envío de `first(4.mensajes)`.** Decisión
   deliberada, reforzada tres veces en el prompt. No convertirlo en multi-mensaje sin una prueba A/B.
4. **El bloque DATOS DUROS del prompt.** Precios, dirección, paso a paso, plazos, links de pago,
   tasa de aprobación. Es la única fuente de verdad del bot y está alineada con lo que la escuela
   vende. Ningún cambio de estilo puede tocar este bloque.
5. **El handoff por tags `bot-off` / `atencion-humana`.** Probado en la conversación de Elisa:
   el bot se calla y el humano cierra. Es el mecanismo que evita que el bot hable encima del equipo.
6. **La regla del precio: no regalarlo si no lo preguntaron, darlo directo si lo preguntan.**
   En los 5 hilos leídos se cumple en 5. Es la parte del rol de setter que sí está bien resuelta.
7. **El mapeo de estados a etapas del pipeline (módulo 12).** Verificado contra las actividades de
   oportunidad de la conversación de Elisa. Coincide.
8. **El prompt del seguimiento (escenario 7131746, módulo 2).** Está bien escrito y bien acotado.
   El problema del seguimiento no es lo que redacta, es que nunca llega a redactar.

---

## Fase A cerrada

No escribo el prompt nuevo, no redacto cambios de módulos y no propongo implementación.
Quedo esperando qué hallazgos apruebas para pasar a Fase B.
