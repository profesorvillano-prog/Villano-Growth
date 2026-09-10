# Auditoría del Bot de Marcelo contra la metodología AutoSetter

> **Qué es este documento:** auditoría del bot de Instagram de Dachshund Salud
> (Paula) contra los 7 documentos de "La estructura de setting" de AUTOSETTER™
> (58.613 chats analizados, 44 negocios, 11 semanas), con propuestas concretas
> de mejora al prompt y a los scenarios de Make.
> **Qué NO es:** nada de esto está aplicado. Ni el prompt ni los scenarios se
> tocaron. Todo es propuesta para revisar y aprobar.
> **Fuentes auditadas:** los 7 PDFs AutoSetter (00–06) · prompt del scenario
> `[BOT] Marcelo - Instagram` (7035201) · `[BOT] Marcelo - Seguimiento
> Instagram (ventana 24h)` (7035204) · `[BOT] Marcelo - Apertura por comentario
> IG` (7247435) · docs del cliente (`Oferta-High-Ticket.md`, `Marcelo-y-Ecosistema-Productos.md`).
> **Fecha:** Septiembre 2026

---

## 1. Veredicto general

El bot de Paula ya cumple, y en algunos puntos supera, buena parte de la
metodología. Antes de proponer nada, lo que **ya está alineado** y no hay que
tocar:

| Principio AutoSetter | Estado en el bot |
|---|---|
| Una sola petición/pregunta por mensaje (regla 1 del 00) | ✅ Explícito y con ejemplos |
| Nunca preguntar lo ya dicho (decisión 3 / error más caro del 01) | ✅ "DATOS QUE YA TENGO manda sobre todo" |
| Personalizar es reaccionar, no usar el nombre (regla 3 del 00) | ✅ "Nombro las cosas, no las etiqueto" |
| Lo prometido no se retiene (regla 2 del 00) | ✅ Flujo lead_magnet entrega primero y conversa después |
| Primero el problema, después los datos (Ruta 1 del 01) | ✅ Orden explícito de calificación |
| No soltar el precio sin contexto (opción C del 01 / punto 1 del 03) | ✅ Escalera de 3 síes antes del precio |
| Precio y descripción en mensajes separados | ✅ Explícito ("son dos decisiones distintas") |
| Cerrar con pregunta cerrada, nunca "cualquier cosa me avisas" | ✅ "Te mando el link?" |
| Espejo de su historia ("llevas 8 meses entre dermatólogo…") | ✅ Es el "clic" del paso 2 |
| Un no claro se respeta (regla 5 del 00 / punto 8 del 03) | ✅ En el prompt de seguimiento |
| Seguimiento con función distinta por intento (04) | ✅ Parcial: 3 intentos con funciones distintas |
| No repetir petición de fotos en seguimiento | ✅ Regla dura del prompt de seguimiento |

La estructura de fondo (escalera de síes → descripción fija → precio → correo →
link) es una versión comprimida y correcta de las decisiones 4–7. Las brechas
están en cuatro sitios: **el esfuerzo que pide cada pregunta, la confirmación
del freno antes de proponer, el manejo fino de objeciones y —la más cara— la
cadencia de seguimiento cuando el lead está caliente.**

---

## 2. Brechas y propuestas al PROMPT (Paula, scenario 7035201)

Ordenadas por impacto esperado.

### 2.1 Preguntas con dos salidas (A o B) — la técnica que falta entera

**Dato del 01:** los chats donde se preguntó algo útil antes de entregar
acabaron en llamada casi 4 veces más (8,47% vs 2,36%), y la clave en público
B2C de conciencia media-baja no es *qué* preguntas sino *cuánto cuesta
contestarte*. La pregunta megaabierta le hace el trabajo al lead; la de dos
opciones lo deja "señalándose" en vez de pensando.

**Hoy:** Paula pregunta bien pero casi siempre en abierto ("qué le das de comer
hoy?", "qué has probado?"). Para una mamá salchichera cansada y con culpa, cada
abierta es un peaje.

**Propuesta:** añadir al bloque CÓMO ESCRIBO una sección "Preguntas con dos
salidas":

> Cuando la pregunta lo permita, ofrezco dos opciones para que conteste
> reconociéndose, no redactando. Sigue siendo UNA pregunta: una petición con
> dos salidas. Las uso sobre todo al principio, cuando la persona todavía está
> con la guardia puesta. Más adelante, cuando ya conversa, puedo abrir más.
>
> - qué come hoy → *Le das comida seca o le mezclas con algo casero?*
> - qué intentó → *Ya pasaste por veterinario con esto o lo has ido manejando tú?*
> - hace cuánto → *Es de estas últimas semanas o lleva meses así?*
> - impacto → *Te preocupa más la picazón en sí o lo que pueda venir después?*

### 2.2 Validación y pregunta en burbujas separadas

**Del 01:** "la validación va en una burbuja y la pregunta va en otra". Lo
último que queda en pantalla debe ser una pregunta corta; mezclada en el mismo
bloque, cuesta verla.

**Hoy:** el prompt exige `mensajes` con **UN solo elemento** y la validación y
la pregunta van juntas en 2–3 líneas.

**Propuesta:** permitir **hasta dos elementos** en `mensajes` cuando hay
validación + pregunta: el primero valida/aporta (1–2 líneas), el segundo es
solo la pregunta (1 línea). El scenario ya envía el array, así que el cambio es
solo de prompt *si* el módulo de envío itera los elementos — **verificar antes:
hoy el HTTP a GHL manda un solo message; si no itera, este cambio requiere un
paso extra en el scenario** (ver §3.4).

### 2.3 "Qué más hay" + remate de confirmación antes de la escalera

**Del 01 (decisión 4 y 5):** a la primera nunca sale todo — la gente cuenta el
obstáculo presentable, no el real. Y el "remate que dispara el sí" es devolverle
la lista entera de frenos y que la confirme *él*: al confirmarla, es él quien
dice en voz alta que quiere resolverlo.

**Hoy:** Paula captura UN síntoma y va directo a la escalera. El espejo existe
("o sea que llevas ocho meses…") pero no está la pregunta *"aparte de eso, hay
algo más que te preocupe de {perro}?"* ni el remate de confirmación.

**Propuesta:** insertar entre el paso 2 y el 3 de CÓMO LLEVO LA CONVERSACIÓN:

> **2.5 — Antes de explicar el mecanismo, pregunto qué más hay.** Una sola vez:
> *Y aparte de {síntoma}, hay algo más de {perro} que te tenga preocupada?*
> Casi siempre aparece un segundo frente (peso, ánimo, otra molestia) y ese
> suele ser el que decide. Lo agrego al resumen y a datos.sintoma.
>
> Y cuando ya tengo el cuadro, el espejo termina en confirmación, no en punto:
> *…y sigue igual. Lo estoy entendiendo bien?* Si me lo confirma, es ella la
> que acaba de decir que esto hay que resolverlo.

### 2.4 Urgencia y compromiso antes del cierre (el encaje del 01)

**Del 01 (entre la decisión 5 y la 6, opción A):** cuando el dinero no es el
filtro (ticket $89 = accesible), lo que separa una consulta que se paga de una
que se enfría es **urgencia y compromiso**: "qué ha pasado ahora para que
quieras resolverlo de una vez?".

**Hoy:** no existe ninguna pregunta de urgencia/prioridad. La escalera valida
mecanismo → necesidad del número exacto → interés en la solución, pero no *por
qué ahora*.

**Propuesta:** añadir como pregunta opcional previa al Sí #2 cuando el lead
viene tibio (contesta lento, respuestas cortas):

> *Y qué pasó estos días para que decidieras escribir por esto ahora?*

Lo que conteste va al resumen y da el material del seguimiento (el motivo real
vuelve a aparecer en el toque de reactivación). Con leads calientes, saltárselo.

### 2.5 Objeción de precio: clasificar antes de reencuadrar

**Del 03:** "no tengo dinero / está caro" esconde 4 cosas distintas y la
pregunta que las separa es *"te lo pregunto de verdad, es que no lo ves por ese
dinero o es que ahora mismo no lo tienes?"*. Sin clasificar, hasta la respuesta
brillante empeora el chat. Y si no hay margen real: **parada dura**, sin frases
de culpa, cerrando bien.

**Hoy:** "Está caro" tiene una sola respuesta (comparación con lo gastado +
cirugía). Es un buen reencuadre, pero se dispara igual para el que no ve el
valor y para el que no llega a fin de mes.

**Propuesta:** reescribir la objeción así:

> **"Está caro" / "no me alcanza".** Primero clasifico, no reencuadro:
> *Te lo pregunto en serio y sin rollo, es que no lo ves por los 89 dólares o
> es que este mes andas justa?*
> - **Si es valor** → el reencuadre actual (lo ya gastado sin resultado, la
>   cirugía de columna) + el caso que más se parezca al suyo (Max, Dalí o
>   Mandí, UNO solo).
> - **Si es plata de verdad** → se respeta y se cierra bien, sin culpar:
>   *Entonces no toca ahora y no pasa nada. Cuando cambie la cosa me escribes
>   y lo vemos.* Y guardo en el resumen que el freno fue económico.

### 2.6 "Lo tengo que hablar con mi pareja": falta la pregunta que distingue y la fecha

**Del 03 (punto 7):** primero *"por tu parte lo tendrías claro, o tú también le
darías alguna vuelta?"* (si titubea, la pega es suya y se vuelve al reencuadre).
Si es real, nunca tratar al otro como obstáculo, dar el material para que no lo
cuente de memoria, y **siempre cerrar con fecha**: "cuándo lo conversan?". Sin
fecha, esto no vuelve.

**Hoy:** "Pregunto qué es lo que más le haría dudar, respondo eso, y ofrezco
mandarle el link igual". Mandar el link ahí contradice la regla 9 del propio
prompt (no mandar link sin un sí) y se salta la fecha.

**Propuesta:** sustituir por:

> **"Lo tengo que hablar con mi pareja."** Primero: *Por tu parte lo tendrías
> claro, o tú también le darías alguna vuelta?* Si titubea, la duda es suya:
> vuelvo a la objeción que corresponda. Si por su parte sí, es legítimo:
> *Me parece bien. Lo que más le va a importar es cuánto es y qué se llevan,
> así que cuéntale que son 89 dólares una vez y que salen con el plan exacto
> para {perro}. Cuándo lo conversan?* La fecha va al resumen, y el seguimiento
> engancha por ahí. El link no se manda hasta que haya un sí.

### 2.7 Guía para el "cómo te ve" (referente / igual / por encima)

**Del 01:** el ritmo lo decide cómo te ve el lead. Al que te cuestiona no se le
demuestra con credenciales (se cierra más); se le da la razón parcial, una
diferencia concreta y se le devuelve el turno.

**Hoy:** no hay ninguna instrucción para el escéptico ("los veterinarios de
verdad no venden por Instagram", "eso del BARF está de moda").

**Propuesta:** añadir a OBJECIONES:

> **Si me cuestiona o me pone a prueba** (tono de "a ver si saben"), no me
> defiendo ni le tiro credenciales encima: le doy la razón en lo que la tenga,
> marco UNA diferencia concreta (*Marcelo solo trabaja con esta raza y solo
> con alimentación, por eso ve lo que en una consulta general no alcanza a
> verse*) y le devuelvo el turno con una pregunta sobre su caso. Con esta
> persona voy más lento: cero prisa, cero cierre hasta que baje la guardia.

### 2.8 Detalle menor: el enlace del pago ya va bien acompañado

El link de pago se entrega con instrucción y con cierre de bucle ("avísame
cuando esté listo y coordinamos horario"), como pide el 02. Única mejora: pedir
la **confirmación explícita** como paso — *"me avisas apenas lo tengas listo y
le confirmo tu cupo a Marcelo?"* — para que el aviso tenga un porqué (el 02:
la instrucción + confirmación sube el cierre de bucle).

---

## 3. Propuestas a los SCENARIOS de Make (no aplicadas)

### 3.1 El toque de 30–60 minutos para leads calientes — la brecha más cara

**Dato del 02/04:** en 577 primeros seguimientos tras mandar el calendario,
preguntar **qué le frenó** consiguió 15 reservas de cada 100 contra 7 del
recordatorio genérico. Y el primer toque va a los **30 minutos**, no al día
siguiente.

**Hoy:** el scenario de seguimiento (7035204) busca silencios de **18 a 23
horas** para todos los estados por igual. Un lead que recibió el link de pago a
las 11:00 y se distrajo recién recibe un toque a las ~5:00 del día siguiente
(y el filtro horario 10–20 lo puede empujar aún más). En IG, con ventana de
24h, eso deja UN solo tiro donde la metodología usa tres.

**Propuesta — cadencia sensible al estado dentro de la ventana de 24h:**

| Estado al quedar en silencio | Toque 1 | Toque 2 | Toque 3 (último tiro) |
|---|---|---|---|
| `cierre_propuesto` / `quiere_agendar` (link o correo pendiente) | **45 min** — fricción: *Pudiste abrir el link o te quedó alguna duda?* | ~6 h — reduce esfuerzo / resuelve lo detectado | ~21 h — decisión limpia y puerta abierta |
| `precio_dado` | ~2 h — objeción escondida: *Quedaste pensando en el valor o en si le va a servir a {perro}?* | ~21 h — caso parecido + petición | — |
| `calificando` / `mecanismo_explicado` | 18–23 h (como hoy) — retomar el cabo suelto | — | — |

Implementación sugerida (pasos nuevos, sin tocar los existentes hasta aprobar):
- En el datastore ya están `estado`, `ultimo_mensaje_at`, `fu_count`,
  `ultimo_fu_at`: alcanza con **duplicar la rama de búsqueda** con filtros por
  estado y ventanas cortas (45 min / 2 h) y bajar el `interval` del scenario de
  7200s a 1800s, o crear un scenario hermano "Seguimiento caliente" con
  intervalo de 30 min para no tocar el actual.
- Pasar al prompt de seguimiento el **estado** y el **intento** (ya se pasan) y
  añadirle las funciones por estado de la tabla (hoy los 3 intentos son
  genéricos: retomar / aportar / cerrar).
- Relajar el espaciado mínimo de 12 h **solo** para la rama caliente.

### 3.2 Guardar el freno detectado

Cuando el toque de fricción obtiene respuesta ("es que no sé si mi tarjeta
sirve", "lo hablo con mi marido el sábado"), hoy eso solo queda en el resumen.
**Propuesta:** campo `freno` en el datastore (técnico / pareja / plata / miedo /
tiempo) que el bot principal rellene desde `resumen`. Sirve para: (a) que el
seguimiento enganche por el freno real, (b) el reporte de fugas del §4.

### 3.3 Reactivación fuera de la ventana de Instagram

El 04 manda reactivar a las 2–3 semanas con un motivo real, pero en IG no se
puede iniciar conversación fuera de la ventana. Dos vías que sí existen:

1. **El correo capturado en el cierre.** Hoy el correo solo se pide al que dijo
   que sí. Propuesta de prompt: cuando alguien llega a `precio_dado` y se
   enfría, en el ÚLTIMO toque de la ventana ofrecer algo por correo (*si
   quieres te dejo por correo el resumen de lo que vimos de {perro}, cuál es?*).
   Con ese correo, una mini-cadencia por email en GHL (2–3 toques, tono Paula,
   motivo real: caso nuevo, clase en vivo) reabre la puerta. Requiere workflow
   GHL nuevo — proponer aparte.
2. **La apertura por comentario** (scenario 7247435) ya reabre ventana cuando
   el lead comenta contenido nuevo. Propuesta: al reabrirse, si el datastore
   tiene un `freno` o un caso a medias, que el prompt reciba
   `EVENTO: reapertura` y retome por el cabo suelto en vez de tratarlo como
   lead nuevo ("la última vez quedamos en que…" — regla del 04: nunca "te
   escribí y no contestaste", siempre un motivo real).

### 3.4 Envío en dos burbujas

Si se aprueba §2.2, el módulo HTTP "Responder" necesita iterar el array
`mensajes` (un Iterator + envío por elemento con 1–2 s entre burbujas) en vez
de mandar solo el primer elemento.

### 3.5 Auditoría automática de chats (doc 06, "la foto siempre delante")

El 06 propone auditar 10 chats con 7 preguntas sí/no y arreglar UNA columna por
semana. El datastore ya guarda resumen, estado, datos y seguimientos: se puede
automatizar como scenario mensual (o sesión de Claude Code) que muestrea 10
conversaciones reales de GHL con esta rúbrica adaptada:

1. ¿El primer mensaje usó el origen real (comentario, imán, CTA) o fue genérico?
2. ¿Se entregó/atendió lo que esperaba antes de pedir nada?
3. ¿Hay algún dato preguntado dos veces?
4. ¿Se capturó síntoma + tiempo + qué come + qué intentó (números y hechos)?
5. ¿Se preguntó "qué más" y el lead confirmó el cuadro antes de la escalera?
6. ¿Hubo señal de urgencia/compromiso antes del precio?
7. ¿La consulta se propuso con pregunta y el link llevó instrucción + pedido de confirmación?

La columna con más "no" es la fuga del mes → se ajusta esa sección del prompt y
se repite a las dos semanas.

---

## 4. Métricas que faltan mirar

Del 04: "el objetivo del seguimiento no es que conteste, es que reserve. No te
dejes engañar por una bandeja llena de respuestas educadas."

- **Por toque de seguimiento, por separado:** % respuesta y % que llegó a
  `cierre_propuesto`/pago. Hoy `fu_count` existe pero no se reporta.
- **Funnel por estado** (el pipeline GHL ya mapea estados → etapas): nuevo →
  calificando → mecanismo → precio_dado → cierre_propuesto → pagado. La caída
  más grande entre dos etapas = la columna a arreglar.
- **Tiempo hasta primera respuesta del bot** (debería ser <1 min siempre; solo
  vigilar errores/DLQ del scenario).

---

## 5. Priorización sugerida

| # | Propuesta | Impacto | Esfuerzo | Dónde |
|---|---|---|---|---|
| 1 | Toque de fricción 45 min para `cierre_propuesto`/`quiere_agendar` (§3.1) | Muy alto (dato: 2× reservas) | Medio | Scenario |
| 2 | Preguntas A/B (§2.1) | Alto | Bajo | Prompt |
| 3 | "Qué más hay" + confirmación del cuadro (§2.3) | Alto | Bajo | Prompt |
| 4 | Clasificador de objeción de precio (§2.5) | Medio-alto | Bajo | Prompt |
| 5 | Pareja: distinguir + fecha (§2.6) | Medio | Bajo | Prompt |
| 6 | Pregunta de urgencia (§2.4) | Medio | Bajo | Prompt |
| 7 | Cadencia por estado completa + campo `freno` (§3.1–3.2) | Medio | Medio | Scenario |
| 8 | Burbujas separadas (§2.2 + §3.4) | Medio | Medio | Prompt + scenario |
| 9 | Reapertura con contexto + correo de rescate (§3.3) | Medio | Alto | Scenario + GHL |
| 10 | Auditoría mensual (§3.5) | Sostiene todo | Medio | Proceso |

---

*Auditoría generada a partir de los 7 documentos AutoSetter y la lectura
completa de los prompts y blueprints actuales. Ningún scenario ni prompt fue
modificado.*
