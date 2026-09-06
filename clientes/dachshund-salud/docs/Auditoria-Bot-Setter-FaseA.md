# Auditoría bot setter Dr. Marcelo (Paula) — Fase A (solo diagnóstico)

Fecha de la lectura: 2026-09-06, ~04:00-05:00 UTC. Segundo pase de análisis: cada hallazgo del
primer pase fue re-verificado contra la evidencia y contra la semántica real de los handlers de
error de Make; una afirmación no resistió la revisión y está corregida (E.4), y se sumó un cuarto
hilo de evidencia (Carola, `tnhu0lxJKOhlYtgc1ufS`) que confirma tres hallazgos con citas nuevas. Todo lo de abajo es lectura. No se ejecutó ninguna
operación de escritura en Make ni en GoHighLevel.

---

## 0. Fuentes: a qué accedí y a qué no

### Accedí

| Fuente | Detalle |
|---|---|
| Blueprint completo escenario 7035201 `[BOT] Marcelo - Instagram` | JSON íntegro, 5 módulos + router de 5 rutas |
| Blueprint completo escenario 7247435 `[BOT] Marcelo - Apertura por comentario IG` | JSON íntegro |
| Blueprint completo escenario 7035204 `[BOT] Marcelo - Seguimiento Instagram (ventana 24h)` | JSON íntegro |
| System prompt textual de Paula (módulo 3) | Íntegro, 40.330 caracteres |
| System prompt del redactor de seguimiento (7035204, módulo 2) | Íntegro |
| Data store 180176 `setter_marcelo` | 28 registros leídos completos |
| Estructura de datos 552700 | Tipos de campo declarados (compartida con Cool Drive) |
| Historial de ejecuciones de los tres escenarios | Timestamps, operaciones, duración, status |
| GHL location `TzjuywpjnaS5aZn5RTs8` | 30 conversaciones listadas de 7.854 totales; 3 hilos leídos mensaje a mensaje |

### No pude obtener

1. **Detalle por módulo de las ejecuciones.** `executions_get-detail` devuelve solo
   `{"status":"SUCCESS"}`. No hay acceso al bundle de entrada/salida de cada módulo desde este MCP.
   Es la limitación más seria de esta auditoría: no puedo ver qué recibió exactamente el modelo en
   un turno concreto, solo lo que publicó.
2. **Los workflows de GoHighLevel.** No los expone el MCP. Y en este proyecto eso importa mucho más
   que en Cool Drive, porque hay al menos tres workflows que intervienen en la conversación:
   - el que manda el DM automático de apertura por comentario (`source: "workflow"`, texto
     *"Hola! Vi tu comentario en el post 🐶..."*),
   - el que llama al webhook 3583173 con cada mensaje entrante,
   - el que llama al webhook 3665341 (`evento=apertura`).
   Sin leerlos no puedo cerrar la causa raíz de los hallazgos 3.B.1 y 3.B.2. Digo exactamente qué
   me falta en cada uno.
3. **Conversaciones completas anteriores a las últimas 30.** El listado devuelve 30 de 7.854.
   La muestra leída es reciente (05-06 de septiembre) y suficiente para el diagnóstico, pero no
   permite medir frecuencia histórica.
4. **Origen de los links `salchichapro.com` que aparecen en los hilos.** Ver 3.C.1: puedo demostrar
   que **no** los mandó el bot, pero no puedo leer qué producto son ni quién los configuró.

### Correcciones del segundo pase

1. **E.4 reescrito.** El primer pase atribuyó la quema de los seguimientos a errores de la API de
   Anthropic; revisada la semántica de los handlers (`Ignore` descarta el bundle, `Resume`
   continúa), el camino real es el envío fallido en `M5` contabilizado como enviado.
2. **`enviar=false → fu_count=3` reclasificado** de fallo a decisión de diseño deliberada.
3. Se agregó el hilo de Carola: tercer caso del doble saludo (B.2, ahora 3/3), segunda instancia de
   descripción+precio en un mensaje (A.3, ahora 2/2) y la cita textual del lead frenado por plata
   que el seguimiento nunca va a tocar (E.5).

### Nota de seguridad, fuera del alcance pedido

El blueprint lleva **en texto plano** el Private Integration Token de GHL de esta subcuenta y una
API key de Anthropic distinta a la de Cool Drive, repetidas en 6 módulos entre los tres escenarios.
No las transcribo. Corresponde moverlas a Connections y rotarlas.

---

## 1. Línea base: qué está funcionando y no se toca

### 1.1 El ritmo de escritura saliente está bien resuelto

Módulo 10 del escenario 7035201:

```
duration = {{max(5; min(22; round(length(first(4.mensajes)) / 11)))}}
```

Delay proporcional al largo del mensaje, entre 5 y 22 segundos, **antes** de enviar. Es exactamente
lo que pide el estándar 3.2 y está mejor implementado que en Cool Drive (que no tiene delay).

Verificado en la conversación de Reyes (`9HNVmwKcyA3DE68dyijM`, 2026-09-06): los tiempos entre el
mensaje del lead y la respuesta son 35 s, 33 s, 27 s, 44 s, 45 s. Ninguna respuesta instantánea.

### 1.2 La escalera de calificación se ejecuta como está diseñada

Conversación Reyes, del comentario a la oferta en 11 minutos, sin saltarse un paso:

- 01:44:32 LEAD: `Holaa tiene fuerte el aliento..es hembrita de 2 años es cruza salchicha con pitbull`
- 01:45:07 PAULA: `Hola! Soy Paula, del equipo del Dr. Marcelo. Cuéntame, hace cuánto que notas ese olor tan fuerte?` → **problema primero**
- 01:46:10 PAULA: `Un año es harto tiempo con eso. Y hoy qué le estás dando de comer?` → **qué come**
- 01:48:23 PAULA: `El mal aliento fuerte muchas veces viene de la carga de carbohidratos del balanceado... Tiene sentido para el caso de tu perrita?` → **mecanismo + sí #1**
- 01:51:45 PAULA: `...Lo que falta es saber exactamente qué tanto de eso hay que sacar y con qué reemplazarlo, según su peso y su edad. Quieres que te cuente cómo lo resuelve Marcelo?` → **sí #2**
- 01:54:43 PAULA: `Es una videollamada de 60 minutos con Marcelo, donde revisa el caso completo de tu peluda...` → **descripción sin precio**

Una pregunta por mensaje, mensajes de dos líneas, sin precio prematuro, sin emoji, sin viñetas.
Esta conversación es la línea base de estilo del proyecto.

### 1.3 El manejo de un caso que cambia de país/raza es bueno

Reyes, 01:52:54: `Ella pesa más de 30 kilos x el tema de la cruza ..`
Paula, 01:53:38: `Entiendo, con esa cruza el tamaño es distinto, pero el mecanismo del aliento y la
digestión funciona igual...` — no se desarma, reencuadra y sigue. La regla de la palabra por país
también se cumple: usa *balanceado* porque la lead usó *balanceado*.

### 1.4 El freno por urgencia médica existe y se dispara

Registro `6OlrB51dlIUG7nYSCRff` (Mariela / Luisa, abdomen inflamado con dolor):
`estado: derivado_humano`, `pausado: true`, y en GHL los tags
`bot-off / atencion-humana / lead-tibio / riesgo-urgencia`. El router de riesgo (módulo 30) mandó el
mensaje seguro y el módulo 8 marcó el contacto. Funcionó de punta a punta.

### 1.5 El pipeline se mueve con la conversación

Reyes: `Opportunity created / Calificando` (01:45:11) → `Información Entregada` (01:48:24).
Mariale: `Calificando` (17:04:57) → `Información Entregada` (22:45:56) → `Cierre propuesto`
(22:47:16). Los saltos coinciden con lo que pasó en el chat.

### 1.6 El escenario de apertura por comentario está bien diseñado

7247435 siembra memoria con `turnos = 1` y `historial = el DM que mandó el workflow`, y tiene el
guardarraíl correcto: solo actúa si `1.evento = "apertura"` **y** `ifempty(2.historial;"VACIO") ==
"VACIO"`. La intención es exactamente la correcta. El problema (3.B.1) es que el guardarraíl está en
la capa equivocada, no que el escenario esté mal.

### 1.7 Decisiones que se ven raras pero se respetan

- **`sequential: true` en 7035201.** Serializa las ejecuciones del webhook. Cuesta throughput pero
  evita que dos turnos del mismo lead se pisen. Con el volumen actual (162 ejecuciones) no es un
  cuello de botella.
- **El prompt es enorme (40.330 caracteres) y con `cache_control` de 1 h.** El costo está resuelto
  por caché. El largo tiene un efecto secundario real (ver 3.D.1) pero el contenido en sí es de
  altísima calidad y es el activo más valioso del proyecto.
- **`riesgo` decide si el mensaje del modelo se envía o se reemplaza por uno seguro.** Arquitectura
  correcta: el modelo no puede mandar una dosis aunque quiera. No se toca.

---

## 2. Mapa del flujo real

### 2.1 Escenario 7035201 — respuesta en vivo

`instant: true` · `maximum_runs_per_minute: 100` · `sequential: true` · `dlq: true` · `dlqCount: 0`

```
M1  gateway:CustomWebHook (hook 3583173 "SETTER Marcelo IG-WSP")
    campos consumidos: contactId · canal · nombre · evento · fuente · pais ·
                       direccion · mensaje · adjuntos · conversationId
 |
M2  datastore:GetRecord (180176) key={{1.contactId}}        [onerror M19 Resume]
    FILTRO "Mensaje con texto, con foto, o evento de lead magnet" (OR de tres ramas)
      A) 1.direccion == "inbound" AND 1.mensaje exists
      B) 1.direccion == "inbound" AND 1.adjuntos exists
      C) 1.evento == "lead_magnet"
 |
M3  http POST api.anthropic.com/v1/messages                 [onerror M20 Ignore]
    FILTRO "No pausado, y el lead magnet solo si no hay conversacion abierta"
      A) 2.pausado != "true" AND 1.evento != "lead_magnet"
      B) 2.pausado != "true" AND ifempty(2.turnos;0) == "0"
    model claude-sonnet-5 · max_tokens 1000 · thinking disabled · effort low
    output json_schema {mensajes[], resumen, estado, temperatura, accion, riesgo, datos{...}}
    system con cache_control ephemeral (sin ttl explícito)
    user: CANAL / NOMBRE / EVENTO / ORIGEN / PAIS / ESTADO / TURNOS /
          DATOS = 2.datos · RESUMEN = 2.historial · ADJUNTOS = 1.adjuntos ·
          MENSAJE NUEVO DEL LEAD = 1.mensaje        <-- UN solo mensaje, sin historial de chat
 |
M4  json:ParseJSON (estructura 541591)                      [onerror M25 Ignore]
 |
M9  builtin:BasicRouter  (5 rutas, todas se evalúan)
    ├─ r1 → M7  datastore:AddRecord overwrite=true, SIN FILTRO       [onerror M23 Resume]
    │        canal · datos · estado · turnos={{ifempty(2.turnos;0)+1}} ·
    │        pausado={{if(4.riesgo="urgencia";true; if(4.accion="derivar_humano";true;false))}} ·
    │        fu_count · historial={{ifempty(4.resumen; 2.historial)}} · temperatura ·
    │        conversationId · ultimo_mensaje_at={{now}}
    ├─ r2 → M10 util:FunctionSleep  FILTRO 4.riesgo == "ninguno"
    │        duration = max(5; min(22; round(length(first(4.mensajes))/11)))
    │     → M5  POST /conversations/messages  message=first(4.mensajes)  [onerror M21 Resume]
    ├─ r3 → M30 POST /conversations/messages  FILTRO 4.riesgo == "medico" OR == "urgencia"
    │        mensaje seguro hardcodeado según riesgo                    [onerror M31 Ignore]
    ├─ r4 → M12 POST /opportunities/upsert  FILTRO 4.estado != 2.estado AND != "frio"
    │        pipeline knRDXRIod5ezbecrfVrI · monetaryValue fijo 89       [onerror M26 Ignore]
    └─ r5 → M8  POST /contacts/{id}/tags
             FILTRO 4.accion != "responder" OR 4.riesgo != "ninguno"     [onerror M24 Ignore]
```

### 2.2 Escenario 7247435 — apertura por comentario

```
M1 gateway:CustomWebHook (hook 3665341 "APERTURA Marcelo IG (comentarios)")
 |
M2 datastore:GetRecord (180176) key={{1.contactId}}          [onerror M10 Resume]
 |
M3 datastore:AddRecord overwrite=true
   FILTRO 1.evento == "apertura" AND ifempty(2.historial;"VACIO") == "VACIO"
   estado="nuevo" · turnos={{1}} · fu_count={{0}} · pausado=false · temperatura="frio"
   datos="" · historial={{replace(1.mensaje;newline;" ")}}   [onerror M11 Resume]
```

### 2.3 Escenario 7035204 — seguimiento

`indefinitely / interval 7200` (cada 2 h)

```
M1 datastore:SearchRecord (180176) limit=15
   filtro: pausado == false AND temperatura != "frio" AND estado != "derivado_humano"
           AND fu_count < 3 AND turnos > 0
           AND ultimo_mensaje_at < addHours(now;-18)
           AND ultimo_mensaje_at > addHours(now;-23)
 |
M2 http POST api.anthropic.com (redactor)                    [onerror M20 Ignore]
   FILTRO hora Santiago >= 10 AND <= 20
          AND ultimo_fu_at < addHours(now;-12)
 |
M3 json:ParseJSON (560230) {enviar, mensaje, motivo}         [onerror M21 Ignore]
 |
M4 Router
   ├─ M5 POST /conversations/messages  FILTRO 3.enviar == true  [onerror M22 Resume]
   └─ M6 datastore:UpdateRecord upsert=false  SIN FILTRO        [onerror M23 Resume]
         fu_count = if(3.enviar; fu_count+1; 3)
         historial = ... recortado a los últimos 600 caracteres
         ultimo_fu_at = now
```

### 2.4 Puntos donde una variable puede llegar vacía, nula o mal formada

| # | Punto | Qué pasa | Consecuencia observable |
|---|---|---|---|
| V1 | **No hay ningún módulo de espera antes de `M3`** | Cada webhook entrante dispara su propia llamada al modelo | Una respuesta por mensaje recibido. Confirmado en 3.A.1 |
| V2 | `MENSAJE NUEVO DEL LEAD = {{1.mensaje}}` | El modelo recibe **un** texto, nunca la ráfaga | Ídem V1 |
| V3 | El prompt no recibe historial de chat, solo `2.historial` (resumen de 400 caracteres escrito por el propio modelo) | Paula no tiene forma de saber qué escribió textualmente | Repetición literal de mensajes propios. Confirmado en 3.A.2 |
| V4 | `M2` falla → `M19 Resume` | `2.turnos` y `2.pausado` vacíos | `ifempty(2.turnos;0)` da 0 → **Paula saluda y se presenta de nuevo**; y `2.pausado` vacío != "true" → **responde aunque el lead esté pausado** |
| V5 | `turnos: "{{ifempty(2.turnos;0) + 1}}"` sobre un campo declarado `number` | Cuando el operando llega como string, Make concatena en vez de sumar | Valores reales en el data store: `"0111111"`, `"01111"`, `"0111"`, `"01"`, `"0"`. Ver 3.E.1 |
| V6 | `fu_count: "{{ifempty(2.fu_count;0)}}"` | Se propaga como string `"0"` en 6 registros | El filtro `fu_count number:less 3` del `SearchRecord` puede no matchear un string |
| V7 | `M3` falla → `M20 Ignore` | Se corta todo el flujo | Sin respuesta **y** sin actualizar memoria: `turnos` no sube, y el próximo mensaje del lead vuelve a leer `turnos` viejo |
| V8 | `M7` corre en la ruta 1 **sin filtro de riesgo** | Escribe memoria incluso cuando el mensaje del modelo no se envía | El `resumen` guarda lo que Paula *iba* a decir, no lo que dijo. Diverge de la realidad del chat |
| V9 | El escenario **no lee los tags de GHL en ningún momento** | El único freno es `2.pausado` del data store | El tag `bot-off` que escribe el propio módulo 8 no lo lee nadie del lado de Make. Ver 3.C.2 |
| V10 | `M12` manda `name = "{{...}} - {{4.datos.nombre_perro}}"` | Con `nombre_perro` vacío queda `"Reyes - "` | Confirmado en GHL: oportunidad `Tx8MtcCe7kDiyPHbg3R0` se llama literalmente `Reyes - ` |
| V11 | El escenario de apertura escribe `datos: ""` | El prompt recibe `DATOS QUE YA TENGO:` en blanco | Correcto por diseño, pero convive con registros donde `datos` trae `persona= perro= edad= sintoma= come= intento=` (signos igual sueltos) |
| V12 | `M30` (mensaje seguro) no tiene sleep | Respuesta instantánea | Justo en el momento más delicado (urgencia médica), el bot responde en 0 segundos y se delata |
| V13 | Ventana del seguimiento 18-23 h + espaciado mínimo de 12 h entre seguimientos | Después del intento 1, `ultimo_mensaje_at` no cambia | Los intentos 2 y 3 son inalcanzables. Ver 3.B.4 |

---

## 3. Taxonomía de fallos

---

### CAUSA A — El escenario no agrupa ráfagas ni conserva historial de chat

Es la causa raíz estructural del proyecto, y explica los dos fallos de mayor impacto.
`M1 → M2 → M3` va directo: no hay data store de buffer, no hay sleep previo, no hay token,
no hay relectura. Y al modelo se le pasa `{{1.mensaje}}`, un solo texto.

**Capa: escenario de Make (7035201).** No es del prompt: el prompt no puede agrupar lo que no
recibe, ni recordar lo que no le dan.

#### A.1 — Dos mensajes seguidos del lead, dos respuestas, dos presentaciones

Conversación `yXSiilKnGibHpHDbGDQh`, 2026-09-05:

- 06:20:04 LEAD: `Hola`
- 06:20:35 PAULA: `Hola Sebastián! soy Paula, del equipo del Dr. Marcelo. cuéntame, en qué te puedo ayudar?`
- 06:20:51 LEAD: `Quiero saber sobre mi perro`
- 06:21:22 PAULA: `Hola Sebastián! soy Paula, del equipo del Dr. Marcelo. cuéntame, qué le está pasando a tu salchicha?`

**Dos saludos y dos presentaciones completas con 47 segundos de diferencia.** El prompt tiene una
regla dedicada, en mayúsculas, contra esto exacto: *"SI TURNOS ES MAYOR QUE 0, LA CONVERSACIÓN YA
EMPEZÓ... nunca saludo, nunca digo hola, nunca me vuelvo a presentar"*.

**Qué debió pasar:** una sola respuesta, cubriendo los dos mensajes.

**Causa raíz:** dos ejecuciones independientes. La primera escribió `turnos` en `M7`, pero el valor
escrito fue `"01"` (ver 3.E.1), no `1`, y aunque el modelo lo lea como mayor que cero, el problema de
fondo es que **nunca debió haber una segunda ejecución**: los dos mensajes son una sola intervención.

#### A.2 — Paula repite su propio mensaje casi textual y no contesta la pregunta

Conversación Mariale, `me90TVk2SoZ2ZaBJxUuT`, 2026-09-05:

- 22:46:24 LEAD: `Si por favor`
- 22:47:11 PAULA: *"**La consulta es una videollamada de 60 minutos con Marcelo, donde revisa el caso completo de Miah y te deja un plan exacto con los gramajes según su peso y condición.** Son 89 dólares, pago único. Quieres que te pase el link?"*
- 23:09:36 LEAD: `Y el plan que contiene?`
- 23:10:17 PAULA: *"**Es una videollamada de 60 minutos con Marcelo, donde revisa el caso completo de Miah y te deja el plan con los gramajes exactos según su peso y condición.** Quieres que te pase el link de pago?"*

La segunda respuesta es la primera reescrita, y **no contesta la pregunta**. La lead preguntó qué
contiene el plan; recibió otra vez la descripción de la consulta.

**Causa raíz:** Paula no tiene acceso a lo que escribió. Su única memoria es `2.historial`, un
resumen de 400 caracteres que ella misma redactó y que dice *"expliqué mecanismo, di precio 89
dólares, expliqué qué incluye la consulta"* — información suficiente para saber que ya lo dijo,
insuficiente para saber que decirlo otra vez con otras palabras no responde nada nuevo.

Contraste útil: el bot de Cool Drive **sí** recibe sus últimos mensajes textuales (módulo 43) y aun
así repite a veces. Paula no los recibe nunca. Es el mismo síntoma con dos gravedades distintas.

**Impacto en la venta: máximo.** Este fallo ocurrió con una lead en `precio_dado`, temperatura
caliente, que ya había comprado dos productos antes. Es el perfil que más convierte, y se le
respondió con una repetición.

#### A.3 — Descripción y precio en el mismo mensaje

El mismo mensaje de las 22:47:11 mete la descripción de la consulta **y** los 89 dólares juntos.
El prompt lo prohíbe explícitamente y explica por qué:

> *"**Nunca meto la descripción y el precio en el mismo mensaje.** Son dos decisiones distintas:
> primero que quiera la consulta, después cuánto cuesta."*

Y el `Si por favor` de las 22:46:24 respondía a *"Quieres que te cuente cómo funciona la consulta
con él?"*, que el propio prompt define como *"permiso para explicar, nada más"*.

**Capa: prompt.** La regla está escrita, con su justificación, y no se cumple. Y no es un caso
aislado: en el hilo de Carola, 19:13:36, ante un `Si podes` que solo autorizaba a contar cómo
funciona, salió *"Dale, te cuento. Es una videollamada de 60 minutos con Marcelo, donde revisa el
caso completo de Carola y te dice exactamente qué darle y en qué cantidades. **Son 89 dólares.**
Quieres que te pase el link?"* — descripción, precio y cierre en un solo mensaje. **2 de 2 hilos**
donde la conversación llegó a la descripción de la consulta muestran la misma violación. El minuto
siguiente la lead contestó `No puedo ahora, gracias igual`. No se puede probar que juntar precio y
descripción causó el frenazo, pero es exactamente el mecanismo que la regla del prompt describe:
*"ahí lo compara contra nada"*.

---

### CAUSA B — La apertura por comentario se dispara sobre conversaciones ya abiertas

#### B.1 — Un lead con 6 turnos y oportunidad avanzada recibe el DM de bienvenida

Conversación `yXSiilKnGibHpHDbGDQh`, 2026-09-05. A las 06:33 el lead estaba en
`Información Entregada`, con `datos` completos (Raul, 5 años, picazón y sobrepeso, croqueta premium).
Diez horas después:

- 16:08:42 LEAD comenta en un post (`TYPE_INSTAGRAM_COMMENT`, body `Hansel`)
- 16:08:50 **workflow de GHL** (`source: "workflow"`): `Hola! Vi tu comentario en el post 🐶\nCuéntame, qué es lo que más te preocupa de tu salchicha?`
- 16:09:01 LEAD: `Esta enfermo`
- 16:09:43 PAULA: `Entiendo tu preocupación. Cuéntame, hace cuánto notas que está enfermo, es algo nuevo o es parte de la picazón y el peso que me contaste?`

Paula sí retomó con contexto — eso funciona. Pero el lead ya había recibido un *"Cuéntame, qué es lo
que más te preocupa de tu salchicha?"* de una conversación que llevaba diez horas y seis turnos.

**Causa raíz:** el guardarraíl `ifempty(2.historial;"VACIO") == "VACIO"` está en el escenario de
Make 7247435, que solo decide **si sembrar memoria**. El DM de apertura lo manda el workflow de GHL
*antes*, sin consultar nada. Es el caso de libro de "la corrección se aplicó en la capa equivocada":
la protección existe, pero está aguas abajo del mensaje que quiere prevenir.

**Dato que me falta para cerrarla:** la configuración del workflow de GHL que manda ese DM — si
tiene o no un filtro por tag/oportunidad/conversación existente. No es accesible por MCP.

#### B.2 — Dos saludos consecutivos de la misma marca en un lead nuevo

Conversación Reyes, `9HNVmwKcyA3DE68dyijM`, 2026-09-06:

- 01:42:51 LEAD comenta `Salud` en el post
- 01:43:05 **workflow**: `Hola! Vi tu comentario en el post 🐶\nCuéntame, qué es lo que más te preocupa de tu salchicha?`
- 01:44:32 LEAD: `Holaa tiene fuerte el aliento..`
- 01:45:07 PAULA: `**Hola!** Soy Paula, del equipo del Dr. Marcelo. Cuéntame, hace cuánto que notas ese olor tan fuerte?`

El escenario de apertura debía haber sembrado `turnos = 1`, y el prompt tiene una tabla específica
para este caso: *"contesta algo que ya le preguntaron → Soy Paula, del equipo del Dr. Marcelo.
Cuéntame..."*, **sin "Hola"**. Salió con "Hola!".

Tercer caso, idéntico (hilo Carola, `tnhu0lxJKOhlYtgc1ufS`, 2026-09-05):

- 19:05:55 LEAD comenta `Salud` en el post
- 19:06:04 **workflow**: `Hola! Vi tu comentario en el post 🐶...`
- 19:06:27 LEAD: `El aliento`
- 19:06:59 PAULA: `**Hola!** Soy Paula, del equipo del Dr. Marcelo. Cuéntame, hace cuánto que notas el mal aliento?`

Con esto el patrón es **3 de 3** aperturas por comentario observadas (Sebastián, Reyes, Carola):
siempre el saludo con presentación completa, que es exactamente el formato que el prompt pauta para
`TURNOS: 0`. Si Paula recibiera `TURNOS: 1` y desobedeciera, se esperaría variación entre casos; la
uniformidad apunta a que el modelo está recibiendo `TURNOS: 0`, es decir, a que la siembra de
memoria no ocurrió a tiempo (o no ocurrió). Nótese además que en los tres casos el lead respondió
al DM en menos de 2 minutos — la carrera es plausible sistemáticamente, no excepcionalmente.

Dos explicaciones posibles y no puedo distinguirlas del todo con lo que tengo:
(a) carrera — el webhook de apertura llegó después de que el lead ya había respondido, con lo que
`M2` leyó un registro vacío y el modelo vio `TURNOS: 0`;
(b) el modelo tenía `turnos = 1` y desobedeció.

**Dato que me falta:** el orden y los timestamps de las llamadas del workflow al hook 3665341 frente
al envío del DM, y el bundle de entrada de la ejecución de las 01:45. Ninguno es accesible por MCP.
El escenario 7247435 registra **10 ejecuciones** en total desde su creación el 05-09 a las 06:06,
frente a bastantes más aperturas por comentario en el mismo periodo, lo que apoya (a).

---

### CAUSA C — El modelo de negocio del bot no coincide con lo que se vende

#### C.1 — El prompt vende un solo producto; el negocio tiene tres

El prompt es taxativo:

> *"**Un solo producto. La Consulta con Marcelo, 89 dolares.** No existe nada mas en mi conversacion:
> ni libros, ni asesorias, ni metodos, ni planes de varios meses. Aunque sepa que existen, yo no los
> menciono nunca."*

Y para la asesoría tiene una salida de escape explícita: *"eso lo ve Marcelo contigo en la consulta"*.

Las reglas de asignación de oferta del brief (perro enfermo con gasto previo → asesoría; perro sano
o cachorro con pellet → ebook 1 + ebook 2; ya en dieta cruda → solo ebook 2) **no están
implementadas en ninguna capa**: ni en el prompt, ni en el schema de salida (`accion` solo admite
`responder / cerrar_consulta / derivar_humano`), ni en el router de Make.

**Evidencia de que el diseño de un solo producto está costando ventas ahora mismo:**

Conversación Mariale, `me90TVk2SoZ2ZaBJxUuT`:
- 17:01:03 LEAD: `Hola Marcelo cómo estás?? **Yo compré tus dos programas** de cómo ayudar a mi salchicha .. pero quisiera ya ir al otro paso .. para cambiar su comida porq Miah está obesa ..`
- Paula la trata como lead nuevo y le vende la consulta de 89 dólares.
- 23:10:17 Paula vuelve a repetir la descripción (fallo A.2) y la conversación se traba.
- 23:49:55 y 23:51:49: **una persona** toma el hilo (los mensajes no llevan `meta.marketplace.appId`,
  a diferencia de todos los de Paula) y manda un video y el link
  `https://salchichapro.com/asesorianutricional-394815`.

Un humano tuvo que entrar a vender la asesoría porque el bot no la conoce. Y el perfil de Mariale es
exactamente el de la regla de asignación del brief: ya compró los ebooks, perro con obesidad
diagnosticada, quiere el siguiente paso.

El mismo patrón, con link humano, se ve en `TMMj4MWCkNdZRj7gatUP` (Cristina) y
`yULVmLpJ8E9HXe9QXrXa` (Mariela).

**Capa: system prompt + schema de salida.** Es una decisión de negocio explícita en el prompt, no un
bug. Antes de tocarla hay que decidirla, no corregirla. La pongo como hallazgo porque el brief la
declara como regla a respetar exactamente y hoy no existe.

**Aclaración importante:** verifiqué que el bot **no inventa links**. Los dos links de
`link.fastpaydirect.com` del prompt son los únicos que Paula puede mandar, y los `salchichapro.com`
que aparecen en los hilos los mandó una persona desde la UI de GHL. Esto no es una alucinación.

#### C.2 — El tag `bot-off` lo escribe el bot y no lo lee nadie del lado de Make

El módulo 8 aplica `bot-off` cuando hay `derivar_humano` o `riesgo=urgencia`. Pero el escenario
7035201 **no consulta los tags del contacto en ningún módulo**: su único freno es `2.pausado` del
data store. (El bot de Cool Drive sí los consulta, en los filtros de los módulos 30 y 35.)

Divergencia real observable: registro `1FIlnM586Ac2UWrrGIYW` tiene `pausado: false` en el data store,
mientras que en GHL el mismo contacto tiene los tags `bot-off / atencion-humana / riesgo-urgencia`.
Los dos frenos no están de acuerdo.

**Consecuencia:** si un humano pone `bot-off` a mano en GHL para tomar un hilo, del lado de Make no
pasa nada. La única barrera es que el workflow de GHL filtre por ese tag antes de llamar al webhook,
y **eso no lo puedo verificar** (workflow inaccesible). Es la pieza de información que más falta.

#### C.3 — El humano toma el hilo y el bot queda armado

En Mariale, después de que la persona mandó el video y el link (23:49-23:51), el registro del data
store sigue con `pausado: false`, `turnos: 5`, sin ningún tag de handoff en el contacto. Si Mariale
escribe de nuevo, Paula responde encima del humano, con un resumen que no sabe que le mandaron el
link de la asesoría.

**Capa: escenario + GHL.** No hay detección de intervención humana. Cool Drive tampoco la tiene, pero
allá el bot se auto-apaga al mandar el link de pago; acá `cerrar_consulta` aplica los tags
`link-de-pago-enviado / quiere-pagar` y **no** `bot-off` (el `switch` del módulo 8 lo pone
explícitamente así), con lo cual la conversación sigue siendo del bot por diseño. Eso es coherente
con el prompt (*"No me frena, la conversación sigue siendo mía"*), pero deja el hueco de arriba.

---

### CAUSA D — El prompt enseña las frases prohibidas y el modelo las usa

El prompt usa tablas `| Nunca escribo | Escribo |`. Es un buen formato para ortografía, pero para
muletillas tiene un efecto contraproducente medible: las frases prohibidas aparecen textualmente en
el contexto y salen publicadas.

#### D.1 — Frase copiada literal de la columna "Nunca escribo"

Conversación `yXSiilKnGibHpHDbGDQh`, 06:23:29:

> PAULA: `**dos condiciones importantes**, y muy comunes juntas en salchichas. hace cuánto que notas la picazón y el sobrepeso?`

El prompt, sección *"Nombro las cosas, no las etiqueto"*:

| Nunca escribo | Escribo |
|---|---|
| **son dos condiciones importantes** | la picazón y el sobrepeso suelen ir juntos |

Es la celda prohibida, palabra por palabra. Y el prompt agrega justo debajo: *"Eso suena a informe
médico y aleja."*

#### D.2 — Lenguaje de asistente que el estándar prohíbe

06:09:43 (mensaje más reciente del hilo): `**Entiendo tu preocupación.** Cuéntame, hace cuánto...`

*"Entiendo tu preocupación"* está en la lista de frases prohibidas del estándar 3.2. El prompt de
Paula no la nombra explícitamente (prohíbe *"Claro"*, *"Por supuesto"*, *"Excelente pregunta"*), y
es una omisión: se le escapa la variante.

#### D.3 — Todo en minúscula, contra una regla con tabla propia

Mensajes del 05-09 entre 06:21 y 06:33:

- `cuéntame, qué síntomas tiene y hace cuánto que lo notas así?`
- `dos condiciones importantes, y muy comunes juntas en salchichas. hace cuánto...`
- `dos meses es harto tiempo con eso. qué has intentado hasta ahora...`
- `esas croquetas premium igual pueden tener harto cereal como primer ingrediente...`
- `Raul de 5 años, entiendo. **dos meses** con picazón y sobrepeso ya es harto tiempo... **la** croqueta, aunque sea premium... **te** hace sentido eso...`

El prompt tiene una sección entera, *"Mayúscula al empezar cada oración"*, con tabla y con el
argumento (*"Todo en minúscula se lee descuidado y, en un DM, se nota que es automático"*).

**Salvedad:** los mensajes del 06-09 (Reyes, 01:45-01:54) sí respetan la mayúscula, igual que los de
Mariale del 05-09 por la tarde. El prompt se editó el 05-09 a las 22:58. **No puedo determinar** si
la sección de mayúsculas se agregó en esa edición. Si ya existía a las 06:21, es incumplimiento; si
se agregó después, es una corrección que funcionó. Dato faltante: el diff de esa edición.

#### D.4 — Devolver la pregunta después de contestar, cuando el lead preguntó

Mariale 23:09:36 `Y el plan que contiene?` → respuesta que termina en `Quieres que te pase el link de
pago?`. El prompt de Paula, a diferencia del de Cool Drive, **sí** permite y pide cerrar con
pregunta (*"Sin pregunta, aunque el puente esté bien escrito, la conversación se detiene"*), así que
esto **no es un incumplimiento del prompt**. Lo anoto como divergencia entre el prompt y el estándar
3.3 del brief ("SI EL LEAD TE HIZO UNA PREGUNTA, RESPÓNDELA Y TERMINA AHÍ"), a decidir, no a
corregir.

---

### CAUSA E — Estado corrupto en el data store

#### E.1 — `turnos` se concatena en vez de sumar

El campo está declarado `type: number` en la estructura 552700. El mapeo del módulo 7 es:

```
"turnos": "{{ifempty(2.turnos; 0) + 1}}"
```

Cuando el operando llega como texto, Make concatena. Valores reales encontrados en el data store:

| key | turnos | fu_count |
|---|---|---|
| `Uoq6gUnSRK05D0jgDTMb` | `"0111111"` | `"0"` |
| `ciwIiPOVkLZOUU7AnFCW` | `"01111"` | `"0"` |
| `JH1yQ9FwoBGaL8LWBiup` | `"0111"` | `"0"` |
| `FMQXbXxbAwoteYz8X7uY` | `"0111"` | `"0"` |
| `lqm61jwzVXi3BPrcggSR` | `"01"` | `"0"` |
| `HxwPN728Syktus37U3Ab`, `WhhlhKsApjH3DYHmn0Fm`, `HprK1j9jT394q4VXlgFJ`, `NKkiuBWjGBk09fUzobqq` | `"0"` | `"0"` |

Los otros 19 registros tienen números correctos (3, 4, 5, 7, 8, 9). Conviven los dos.

**Lo que no puedo determinar:** qué escritura produce el primer valor string. Con lectura sola no
puedo reproducir la condición. Haría falta el bundle de entrada/salida de `M2` y `M7` en una
ejecución de un lead afectado.

**Consecuencias concretas:**

1. Los cuatro registros con `turnos: "0"` tienen todos el mismo `historial`:
   *"Le escribi el primer DM presentandome y preguntando que le preocupa"*. Si cualquiera de esos
   cuatro leads responde, el prompt recibe `TURNOS: 0` y **Paula vuelve a saludar y a presentarse**
   a alguien a quien ya le escribió. Es el fallo A.1 en versión diferida.
2. El filtro del `SearchRecord` del seguimiento compara `turnos number:greater 0` y
   `fu_count number:less 3` contra strings. Los 10 registros afectados quedan en un estado de
   evaluación no determinista.
3. El filtro del módulo 3 (`ifempty(2.turnos;0) == "0"`, rama del lead magnet) da verdadero para los
   cuatro registros con `"0"`: un evento `lead_magnet` sobre esos contactos abriría conversación
   como si fueran nuevos.

#### E.2 — Un caso agudo pero estable se marcó como urgencia y se derivó

Registro `1FIlnM586Ac2UWrrGIYW`, resumen escrito por el bot:
*"Sebastian, salchicha con colitis y sobrepeso, sintomas empezaron ayer (agudo...)"*.
Mensaje publicado a las 16:15:22:

> `Eso que me cuentas necesita que lo vea un veterinario presencial hoy, no manana. Anda a una clinica y que lo revisen. Cuando este estable escribeme de nuevo...`

El prompt tiene una sección entera dedicada a evitar exactamente esto:

> *"**Que algo haya empezado hace poco NO lo convierte en urgencia.** Un perro que empezó con colitis
> ayer, pero come, camina y está animado, es un caso normal y de los mejores que puede tomar
> Marcelo... Cuando algo empezó hace poco no freno: **le subo la prioridad.**"*

Colitis empezada ayer es el ejemplo textual del prompt de lo que **no** es urgencia. El modelo marcó
`riesgo: urgencia`, el mensaje seguro salió, y el lead quedó con `bot-off / atencion-humana`.

**Salvedad:** el texto publicado (`hoy, no manana. Anda a una clinica`, sin tildes ni eñes) **no
coincide** con el mensaje seguro hardcodeado hoy en el módulo 30 (*"...hoy mismo, porque hay que
revisarlo con las manos. En cuanto esté estable escríbeme..."*). El escenario se editó el 05-09 a
las 22:58, después de este mensaje. O sea: el texto seguro ya fue corregido. Lo que queda por
verificar es si la sección del prompt sobre "agudo no es urgencia" también se agregó en esa edición
o ya estaba y no se cumplió. **Dato faltante: el diff de la edición de las 22:58.**

#### E.3 — El seguimiento no puede pasar del intento 1

El `SearchRecord` exige `ultimo_mensaje_at` entre 18 y 23 horas atrás. Y `M2` exige
`ultimo_fu_at < now - 12h`.

`ultimo_mensaje_at` **solo lo escribe el escenario principal**, cuando el lead escribe. El
seguimiento no lo toca. Entonces:

- Intento 1 sale, digamos, a las 19 h de silencio. Se escribe `ultimo_fu_at`.
- A las 20, 21, 22 h de silencio el registro sigue en ventana, pero `ultimo_fu_at` tiene 1, 2, 3
  horas: falla el espaciado de 12 h.
- A las 31 h de silencio ya pasaron las 12 h de espaciado, pero `ultimo_mensaje_at` está fuera de la
  ventana de 23 h: falla el `SearchRecord`.

**Los intentos 2 y 3 son inalcanzables por construcción.** El `fu_count < 3` y las tres estrategias
del prompt (*"Intento 1... Intento 2... Intento 3..."*) describen algo que no puede ocurrir.

Confirmado en los datos: **28 de 28 registros tienen `fu_count` en 0**, ninguno tiene `ultimo_fu_at`.
No hay evidencia de que el seguimiento haya enviado un solo mensaje. Las 12 ejecuciones del escenario
consumieron **1 operación cada una** — solo el `SearchRecord`, sin resultados.

Esto es coherente con la ventana estrecha: en el momento de cada corrida no había ningún lead con
entre 18 y 23 horas exactas de silencio.

#### E.4 — Un envío fallido registra el seguimiento como hecho (corregido en el segundo pase)

**Corrección sobre el primer pase.** Se había afirmado que un error de la API de Anthropic o del
ParseJSON fijaba `fu_count = 3` y excluía al lead para siempre. Es falso: los handlers de `M2` y
`M3` son `Ignore`, y en Make `Ignore` **descarta el bundle** — ni `M5` ni `M6` corren, `fu_count`
queda intacto y el lead se reintenta en la corrida siguiente. Ese camino está bien.

El camino real es el del envío: `M5` (POST a `/conversations/messages`) tiene `onerror Resume`,
que traga el error y deja continuar. Si GHL rechaza el envío — y en Instagram el rechazo típico es
la **ventana de 24 h de Meta cerrada**, además de cualquier 4xx —, `M6` corre igual con
`3.enviar = true` y registra `fu_count + 1` y el texto del seguimiento en `historial`, **sin que el
mensaje haya llegado**. El "ÚNICO TIRO" del que habla el prompt puede gastarse contra un error HTTP
y quedar contabilizado como enviado. Fallo silencioso: la ejecución termina en éxito.

Aparte: cuando el modelo decide `enviar = false`, `M6` fija `fu_count = 3` a propósito. Los casos
de `false` que el prompt autoriza son terminales (no le interesa, ya compró, pidió no ser
contactado, urgencia derivada), así que cerrarle los tres intentos es **diseño deliberado y
coherente**, no un fallo. Se reclasifica como decisión existente a respetar.

#### E.5 — `temperatura != frio` deja fuera a quien más falta hace recuperar

Registro `MN3KecD9WoYAQhKyMp8V`: `estado: precio_dado`, `temperatura: frio`, resumen:
*"Le expliqué mecanismo y precio (89 dólares). **Dijo que no puede ahora, no quiso el link por el
momento.** Quedé abierta a que retome cuando pueda."*

Verificado en el hilo (`tnhu0lxJKOhlYtgc1ufS`): 19:14:35 LEAD `No puedo ahora, gracias igual` →
19:15:02 PAULA `Ningún problema! Cuando quieras retomamos, aquí quedo atenta` — un cierre elegante,
correcto. Pero "quedo atenta" es mentira estructural: es un lead que llegó hasta el precio y se
frenó por plata, y el filtro del `SearchRecord` (`temperatura != "frio"`) lo excluye del
seguimiento. El prompt del redactor tiene una estrategia
específica para este caso (*"Intento 2: aportas algo útil que todavía no le habías dicho"*) que nunca
se va a ejecutar.

Lo mismo con los 4 registros en `nuevo / frio` que solo recibieron el primer DM.

---

## 4. Diagnóstico priorizado

| # | Causa raíz | Capa | Fallos que explica | Riesgo de dejarla como está |
|---|---|---|---|---|
| 1 | **No hay agrupación de ráfagas ni historial de chat**: `M1→M2→M3` directo con `{{1.mensaje}}` | Escenario 7035201 | A.1, A.2, y agrava B.2 y E.1 | Es el problema número uno del brief y en este proyecto está sin resolver del todo. Cada mensaje corto del lead gasta una respuesta, y Paula repite lo que ya dijo porque literalmente no lo sabe. Ocurre en el momento del cierre |
| 2 | **El seguimiento no puede funcionar**: ventana 18-23 h contra espaciado de 12 h, exclusión de `frio`, y el envío fallido se contabiliza como enviado | Escenario 7035204 | E.3, E.4, E.5 | 0 seguimientos enviados en 28 leads. En un ciclo de venta largo y orgánico, sin seguimiento la mitad del embudo se pierde. Los intentos 2 y 3 que el prompt describe no existen |
| 3 | **El bot vende un solo producto y el negocio tiene tres**, sin reglas de asignación | Prompt + schema de salida | C.1 | Cada lead que califica para asesoría o para ebooks necesita que entre una persona. Se ve en 3 de los 30 hilos listados. Es la diferencia entre un setter y un contestador |
| 4 | **La apertura por comentario no verifica si ya hay conversación**, porque el guardarraíl está en Make y el DM lo manda GHL | GHL workflow (guard mal ubicado en Make 7247435) | B.1, B.2 | Leads activos reciben un mensaje de bienvenida genérico que borra el trabajo de calificación. Doble saludo en leads nuevos |
| 5 | **`turnos` se corrupta a string por concatenación** | Escenario 7035201, mapeo M7 | E.1 | 10 de 28 registros afectados. Cuatro leads están armados para recibir un segundo saludo completo. Los filtros numéricos del seguimiento evalúan strings |
| 6 | **El único freno es `pausado` del data store; los tags de GHL no se leen** | Escenario 7035201 | C.2, C.3 | Si un humano toma un hilo, el bot puede seguir respondiendo encima. La divergencia `pausado:false` + tag `bot-off` ya está en los datos |
| 7 | **El prompt lista las frases prohibidas en texto y el modelo las reproduce** | System prompt | D.1, D.2, D.3 | Erosión de la voz. La celda "son dos condiciones importantes" salió publicada tal cual |
| 8 | Falso positivo de `urgencia` en casos agudos estables | Prompt (a verificar contra el diff del 05-09 22:58) | E.2 | Cada falso positivo cierra la conversación con `bot-off` y regala el paciente a otra clínica. El prompt ya dice que esto no debe pasar |
| 9 | Credenciales en texto plano en los tres blueprints | Escenario | — | Exposición del PIT de GHL y de la API key de Anthropic |

**Lo que necesito antes de proponer nada sobre los puntos 4, 6 y 8:**

- **Punto 4:** la configuración del workflow de GHL que manda el DM *"Hola! Vi tu comentario en el
  post"* — qué filtros tiene y en qué orden llama al hook 3665341.
- **Punto 6:** si el workflow que llama al hook 3583173 filtra o no por el tag `bot-off`.
- **Punto 8:** el diff de la edición del escenario 7035201 del 2026-09-05 22:58, para saber qué
  secciones del prompt ya existían cuando ocurrieron los fallos del 05-09 por la mañana.

Los tres se obtienen desde la UI (GHL → Automatizaciones; Make → historial de versiones del
escenario). Ninguno es accesible por MCP.

---

## 5. Lo que no se debe tocar, y por qué

1. **El delay de escritura proporcional (módulo 10).** `max(5; min(22; round(length/11)))`.
   Funciona, está medido en tres conversaciones, y es lo que hace que Paula no parezca instantánea.
2. **La arquitectura del `riesgo`**: que el mensaje del modelo se descarte y se reemplace por uno
   hardcodeado cuando hay riesgo médico. Es la barrera que impide que el bot dé una dosis. El
   problema de E.2 es la *clasificación*, no el mecanismo. El mecanismo se queda.
3. **El cuerpo de conocimiento del prompt**: la cadena croqueta → inflamación → sobrepeso → columna,
   el 70% del sistema inmune en el intestino, la frase de Marcelo sobre secar el piso con la llave
   abierta, los tres casos de prueba social (Max, Dalí, Mandí), las objeciones. Es el activo más
   valioso del proyecto y está muy bien escrito. Ningún ajuste de forma puede tocarlo.
4. **La escalera de los tres "sí" antes del precio.** Verificada funcionando en la conversación de
   Reyes. Es lo que hace que el precio no llegue en frío.
5. **La regla de la palabra por país** (pellet / pienso / concentrado / balanceado / croqueta, y
   "la comida seca" ante la duda). Se cumple y es lo que evita que un lead mexicano o español note
   que le habla un guion chileno.
6. **El vocabulario obligatorio** (papá perruno, hijo perruno, columna, dieta natural cruda). Es
   identidad de marca, no estilo.
7. **Que `cerrar_consulta` NO ponga `bot-off`.** Es deliberado y está justificado en el prompt
   (*"No me frena, la conversación sigue siendo mía y le contesto lo que venga después"*). No
   confundirlo con el hueco de C.3, que es otro problema.
8. **El escenario de apertura 7247435 tal como está.** Su lógica es correcta. Lo que hay que mover
   es el guardarraíl al workflow de GHL, no reescribir este escenario.
9. **`sequential: true` en 7035201.** Con el volumen actual protege contra que dos turnos del mismo
   lead se pisen. Si en Fase B se introduce un buffer con sleep, hay que revisar esta decisión, pero
   no antes.

---

## Fase A cerrada

No escribo el prompt nuevo, no redacto cambios de módulos y no propongo implementación.
Quedo esperando qué hallazgos apruebas para pasar a Fase B.
