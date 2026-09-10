# Auditoría del Bot de Cool Drive contra la metodología AutoSetter

> **Qué es este documento:** auditoría del bot de WhatsApp/Instagram/Facebook
> de Cool Drive Maipú (Sebastián) contra los 7 documentos de "La estructura de
> setting" de AUTOSETTER™ (58.613 chats analizados, 44 negocios, 11 semanas),
> con propuestas concretas de mejora al prompt y a los scenarios de Make.
> **Qué NO es:** nada de esto está aplicado. Ni el prompt ni los scenarios se
> tocaron. Todo es propuesta para revisar y aprobar.
> **Fuentes auditadas:** los 7 PDFs AutoSetter (00–06) · prompt del scenario
> `[BOT] Cool Drive - WhatsApp + Instagram` (7130146) · `[BOT] Cool Drive -
> Seguimiento automatico` (7131746) · `docs/Bot-WhatsApp.md`, `FAQ.md`,
> `Escuela-y-Servicio.md`.
> **Nota de contexto:** AutoSetter está escrito para venta high-ticket que
> cierra en llamada. Cool Drive vende un curso de $110.000–$140.000 que cierra
> por link/transferencia o visita a la sede. Donde la metodología dice
> "llamada/calendario", aquí el equivalente es **link de pago, reserva de cupo
> o visita con día comprometido**, y así está traducida toda la auditoría.
> **Fecha:** Septiembre 2026

---

## 1. Veredicto general

El prompt actual es muy sólido en lo conversacional-chileno y en el cierre por
señal de compra. Lo que **ya está alineado** con la metodología y no hay que
tocar:

| Principio AutoSetter | Estado en el bot |
|---|---|
| Responder al tiro lo que preguntan antes de pedir nada (decisión 2) | ✅ Regla 6 y 13 |
| Nunca repetir lo ya dicho ni lo ya preguntado (decisión 3) | ✅ Reglas 4, 10 y 11, con TUS ÚLTIMOS MENSAJES |
| No afirmar nada que el lead no dijo (interpretación prudente) | ✅ Regla 2 |
| Señal de compra → propuesta de cierre en el mismo mensaje (decisión 6–7) | ✅ Regla 12, con banco de cierres |
| El precio no se regala, pero se da sin rodeos si lo piden (03, punto 1) | ✅ Ritmo de la venta |
| Ancla de valor antes del descuento (promo como segunda capa) | ✅ Escalera normal → anzuelo → cifra |
| Link de pago con instrucción + pedido de comprobante (02, paso 8–9) | ✅ Nunca link desnudo |
| Verificar el pago, no darlo por acreditado (02: "no interpretes respuesta como reserva") | ✅ Regla 14 |
| Soltar el acuerdo cuando el lead lo suelta (03: no perseguir) | ✅ Regla 17 |
| Reserva de cupo al que dice que va a ir (compromiso pequeño) | ✅ Regla 16 |
| Un no claro se respeta | ✅ En seguimiento (enviar=false) |
| Seguimiento que engancha con el cabo suelto, no recordatorio genérico (04) | ✅ Regla 2 del prompt de seguimiento |

Las brechas grandes están en dos frentes: **(a) el bot informa muy bien pero
avanza poco la conversación cuando no hay señal de compra** (la regla
anti-interrogatorio se pasó de frenada respecto a los datos del 01), y
**(b) el seguimiento tiene UN solo toque a las 14+ horas**, cuando el 04
demuestra que la mayoría de los cierres ocurren en el seguimiento y que el
primer toque va a los 30 minutos.

---

## 2. Brechas y propuestas al PROMPT (Sebastián, scenario 7130146)

### 2.1 La regla 6 deja morir chats: preguntas fáciles A/B tras responder

**Dato del 01:** preguntar algo útil junto a la entrega multiplicó por casi 4
los cierres (8,47% vs 2,36%). Y en B2C de conciencia media-baja lo que decide
si el chat sigue vivo no es qué preguntas sino **cuánto cuesta contestar**: la
pregunta de dos opciones (A o B) se contesta en un semáforo.

**Hoy:** la regla 6 dice "si el lead te hizo una pregunta, respóndela y termina
ahí" y limita a 1 de cada 3 respuestas con pregunta. El resultado predecible:
el lead pregunta precio → recibe precio → silencio → el chat queda muerto hasta
el (único) seguimiento de 14 horas después. La propia regla 12 ya reconoce el
problema ("informar sin cerrar es perder la venta con buenos modales"), pero
solo se activa con señal de compra explícita.

**Propuesta:** mantener la prohibición de interrogar, pero cambiar el criterio
de "1 de cada 3" por **"una pregunta fácil que avance la venta, casi siempre"**:

> Después de responder lo que preguntó, si todavía falta un dato que cambia la
> ruta (experiencia, para cuándo, qué curso) puedes cerrar con UNA pregunta,
> siempre que sea de dos salidas y se conteste con una palabra. Eso no es
> interrogar: interrogar es encadenar preguntas o pedir párrafos.
>
> - *Y tú partirías de cero o ya has manejado algo?*
> - *Lo estás viendo para partir pronto o más adelante en el año?*
> - *Lo tuyo sería el Full o quieres que te ayude a elegir?*
>
> Sigue prohibido: dos preguntas seguidas sin aportar nada en medio, repetir
> una pregunta hecha, y preguntar cuando el lead está despachándose o ya dio
> señal de compra (ahí se cierra, regla 12).

Con esto cada respuesta informa **y** deja algo fácil que contestar, que es
exactamente la diferencia que midió el estudio.

### 2.2 Elegir entre dos es un gesto; decidir es una decisión

**Del 02 (secuencia D):** la técnica que más recupera no es preguntar "quieres
venir?" sino dar **dos opciones concretas** ("te viene mejor mañana a las nueve
o a las cuatro?").

**Hoy:** la regla 16 pide el día en abierto ("qué día piensas venir?").

**Propuesta:** cuando ofrece reservar cupo o retomar una visita, dar dos
ventanas reales de la sede:

> *Te reservo el cupo, te acomoda más en la mañana (9:00–13:00) o en la tarde
> (16:30–21:00)?* — y cuando dice la franja, recién ahí el día: *mañana o más
> hacia el fin de semana?*

### 2.3 Objeción de plata: clasificar antes de soltar la promo

**Del 03:** "está caro" esconde cuatro cosas y la pregunta que las separa es
*"es que no lo ves por ese precio o es que ahora mismo no lo tienes?"*. Soltar
el descuento sin clasificar regala margen al que dudaba del valor y no ayuda al
que de verdad no tiene.

**Hoy:** ante "está caro / ando pato" el bot reencuadra e inmediatamente suelta
la cifra de promo. Además el ancla más potente de la KB (**las 12 clases
sueltas costarían $240.000; el Full completo cuesta $140.000 con todo
incluido**, que está en `Bot-WhatsApp.md`) no aparece en el prompt como
técnica, solo como dato de "solo prácticas".

**Propuesta:**

> **Está caro / ando corto de plata.** Primero clasifica en una pregunta:
> *Es que te parece mucho por lo que incluye, o es tema de este mes?*
> - **Si es valor** → ancla antes que descuento: *Solo las 12 clases prácticas
>   sueltas te costarían $240.000. El Full son $140.000 con la teoría, las
>   pruebas, las psicotécnicas y el acompañamiento en el examen con auto
>   incluido.* Y recién si hace falta, la promo.
> - **Si es plata del mes** → la promo con el argumento de los 60 días
>   (*pagas ahora con precio de septiembre y partes cuando puedas*), y si aun
>   así no puede, se cierra bien y queda etiquetado para recaptación, sin
>   presión.

### 2.4 "Lo tengo que conversar": falta la pregunta que distingue y la fecha

**Del 03 (punto 7):** *"por tu parte lo tendrías claro, o tú también le darías
alguna vuelta?"* separa la decisión conjunta real de la salida suave. Y sin
fecha ("cuándo lo conversan?") esto no vuelve nunca.

**Hoy:** "Lo tengo que conversar → ofrece asegurar el precio de septiembre
pagando ahora". Es un buen argumento pero apura a alguien que acaba de decir
que la decisión no es solo suya, y no deja nada agendado.

**Propuesta:**

> **Lo tengo que conversar (pareja, papás, etc.).** Primero: *Por tu parte lo
> tendrías claro, o tú también le darías alguna vuelta?* Si duda, la objeción
> es suya: trabájala. Si por su parte sí: *Buenísimo. Cuéntale que son
> {precio} con todo incluido hasta el examen y hasta 60 días para partir. Para
> cuándo crees que lo tendrán conversado?* El día que nombre va a `para_cuando`
> y el seguimiento engancha ahí (*cómo les fue con la conversa?*).

### 2.5 Resumen espejo antes del cierre con leads dudosos

**Del 01 (decisión 5):** devolverle la lista entera y que la confirme él
("entonces, si tuvieras X resuelto, ya no habría nada que te impida sacar la
licencia, lo pillé bien?") convierte la propuesta en continuación y no en
interrupción.

**Hoy:** el bot pasa de responder a cerrar sin paso intermedio. Con leads
calientes está perfecto (regla 12); con los tibios que llevan varias vueltas
falta el espejo.

**Propuesta (instrucción corta):**

> Con un lead que lleva varias vueltas dudando, antes de proponer el cierre
> resume su situación con sus palabras y pide confirmación: *O sea, la
> necesitas para la pega, partirías de cero y lo único que te frenaba era el
> horario. Es así?* Si confirma, la propuesta de cierre va en el mensaje
> siguiente y se siente lógica, no vendedora.

### 2.6 Consistencia interna: la reserva de cupo en el seguimiento

El prompt principal (regla 16) ofrece **reservar cupo**, pero el prompt de
seguimiento lo prohíbe ("PROHIBIDO decir que le guardas el cupo… NADA de eso
existe"). Un lead al que ayer le ofrecieron reserva y hoy el seguimiento se la
niega nota la costura.

**Propuesta:** decidir una de dos y alinear ambos prompts: (a) la reserva
existe → permitirla también en seguimiento cuando el lead había dicho que iría
a la sede; o (b) la reserva no existe operativamente → quitarla también del
principal. Según `Bot-WhatsApp.md` la escuela sí espera visitas, así que (a)
parece lo correcto — confirmar con Sebastián (humano).

---

## 3. Propuestas a los SCENARIOS de Make (no aplicadas)

### 3.1 De un toque a una cadencia — la brecha más cara de todo el sistema

**Del 04:** "la mayoría de los cierres ocurren en el seguimiento… ahí es donde
se pierde el dinero que ya estaba ganado". Y del estudio de 577 primeros
seguimientos: preguntar **qué le frenó** produjo 15 reservas de cada 100 contra
7 del recordatorio genérico; el primer toque va a los **30 minutos**, no al
otro día.

**Hoy (scenario 7131746):** UN solo seguimiento (`fu_count < 1`), recién a las
**14+ horas** de silencio, y solo dentro de la ventana de 23h. Un lead que
recibió el link de pago a las 11:00 y se distrajo recibe su único toque al día
siguiente — o nunca, si cae fuera del horario 10–20.

**Propuesta — cadencia por estado y por canal** (Meta limita IG/FB a la ventana
de 24h; WhatsApp vía GHL también exige ventana para mensajes libres, así que
todo lo de la primera tabla cabe dentro de las 24h y lo posterior necesita
plantilla aprobada o canal alternativo):

**Dentro de la ventana de 24h (todos los canales):**

| Estado al quedar en silencio | Toque 1 | Toque 2 | Toque 3 (último de la ventana) |
|---|---|---|---|
| `quiere_inscribirse` con link enviado | **30–45 min** — fricción: *Pudiste abrir el link o te dio algún problema?* | ~4 h — reduce esfuerzo: transferencia como alternativa | ~20 h — decisión limpia |
| `cierre_propuesto` / `oferta_anclada` | ~2 h — objeción escondida: *Quedaste dándole vueltas al valor o al horario?* | ~20 h — cabo suelto + promo si no salió | — |
| `precio_dado` / `calificando` | ~14 h (como hoy) — cabo suelto | ~22 h — pregunta A/B fácil | — |
| `fecha_visita` pasada sin comprobante ni visita | Al día siguiente de la fecha, 10:00 — *Alcanzaste a pasar ayer? si te complicó, lo vemos por acá* | — | — |

**Fuera de la ventana (solo WhatsApp, con plantilla aprobada de Meta):**

| Momento | Función (04) | Ejemplo de ángulo |
|---|---|---|
| Día 2–3 | Valor/prueba: se practica en las mismas calles del examen, 7–8 de 10 aprueban | sin pedir nada |
| Día 5–7 | Coste de esperar honesto: la promo termina el 17 (real, nunca inventada) | petición limpia |
| Día 14 | Cierre sin culpa + queda guardado | "lo dejo aquí, cuando quieras retomamos" |
| Semana 3–4 | Reactivación con motivo real: promo del mes nuevo, cupos de tarde | una sola vez |

Esto además implementa la recaptación que `Bot-WhatsApp.md` §2.4 ya pedía
("los 'no ahora' quedan etiquetados… muchos vuelven en verano") y que hoy no
ejecuta nadie.

Implementación sugerida:
- Subir `fu_count < 1` a `< 3` para la ventana de 24h y **pasar el número de
  intento al prompt** (hoy el prompt de seguimiento no distingue intentos;
  darle secciones "intento 1 / 2 / 3" como las tiene el bot de Marcelo).
- Rama o scenario hermano "Seguimiento caliente" con intervalo de 30 min y
  filtro por estado (`quiere_inscribirse`, `cierre_propuesto`,
  `oferta_anclada`) para los toques de fricción — el actual corre cada 4 h,
  demasiado lento para el toque de 30–45 min.
- Los toques post-ventana requieren plantillas de WhatsApp aprobadas en GHL:
  decisión operativa con Sebastián antes de construir.
- El filtro actual excluye `temperatura = frio`: correcto según el 04 (a quien
  solo saludó no se le persigue) — mantener.

### 3.2 Guardar el freno y la fecha comprometida

El resumen ya arrastra objeciones, pero el datastore no tiene campos
consultables. **Propuesta:** campos `freno` (plata / distancia / horario /
miedo / pareja / cotizando) y `fecha_compromiso` (el "lo conversamos el
sábado", además del `fecha_visita` que ya existe en `datos`). Con eso: (a) el
seguimiento engancha por el freno real sin re-parsear el resumen, (b) el toque
post-compromiso de la tabla anterior se puede filtrar por fecha, (c) el reporte
de fugas del §4 sale solo.

### 3.3 Confirmación de visita el día anterior

La fuga que la regla 16 tapa a medias: el lead reserva para el viernes y nadie
le recuerda. **Propuesta:** paso en el scenario de seguimiento que, con
`fecha_visita` presente, mande la tarde anterior un toque corto (*Mañana te
esperamos, cualquier cosa me avisas. Te sirve venir en la mañana o en la
tarde?*). Es el equivalente del "vídeo post-agenda que sube el show" del 02,
en versión escuela.

### 3.4 Auditoría automática de chats (doc 06, "la foto siempre delante")

Rúbrica de 7 preguntas sí/no adaptada a Cool Drive, para pasar 10
conversaciones reales al mes (scenario que muestrea GHL + Claude, o sesión
manual de Claude Code):

1. ¿La primera respuesta atendió el mensaje precargado del anuncio sin saludo genérico?
2. ¿Se respondió la duda concreta antes de calificar?
3. ¿Hay algún dato o pregunta repetida (experiencia, dirección, precios)?
4. ¿Se capturó experiencia + para cuándo (los dos datos que cambian la ruta)?
5. ¿La objeción real (plata, distancia, horario, pareja) quedó nombrada y trabajada, o solo respondida una vez?
6. ¿Hubo propuesta de cierre ante cada señal de compra?
7. ¿Todo link de pago llevó instrucción + pedido de comprobante, y toda visita anunciada terminó con día + oferta de reserva?

La columna con más "no" es la fuga del mes → se ajusta esa sección del prompt,
una sola cosa por ciclo, y se repite a las dos semanas (regla del 06: arreglar
una cosa a la vez o no sabrás qué funcionó).

---

## 4. Métricas que faltan mirar

Del 04: "el objetivo del seguimiento no es que conteste, es que reserve".

- **Por toque de seguimiento, por separado:** % respuesta vs % que terminó en
  pago o visita. El recordatorio genérico gana respuestas y pierde ventas: si
  solo se mira "contestó", se optimiza lo equivocado.
- **Funnel por estado:** nuevo → calificando → precio_dado → oferta_anclada →
  cierre_propuesto → quiere_inscribirse → pagado (el pipeline GHL ya existe;
  falta el reporte). La caída más grande entre etapas = la columna a arreglar.
- **Fugas por `freno`** (con §3.2): cuántos se pierden por plata vs distancia
  vs horario decide qué promo/argumento construir el mes siguiente.
- **Visitas anunciadas vs visitas efectivas** (con `fecha_visita`): hoy es la
  "fuga más grande" según el propio prompt, y nadie la mide.

---

## 5. Priorización sugerida

| # | Propuesta | Impacto | Esfuerzo | Dónde |
|---|---|---|---|---|
| 1 | Cadencia de seguimiento por estado, toque de fricción 30–45 min tras link (§3.1) | Muy alto (dato: 2× cierres) | Medio | Scenario + prompt seguimiento |
| 2 | Pregunta fácil A/B tras responder (§2.1) | Muy alto (dato: ~4× avance) | Bajo | Prompt |
| 3 | Confirmación de visita día anterior + check post-fecha (§3.3) | Alto | Bajo-medio | Scenario |
| 4 | Clasificador de objeción de plata + ancla $240.000 (§2.3) | Alto | Bajo | Prompt |
| 5 | "Lo tengo que conversar": distinguir + fecha (§2.4) | Medio-alto | Bajo | Prompt |
| 6 | Dos opciones concretas para visita (§2.2) | Medio | Bajo | Prompt |
| 7 | Campos `freno` y `fecha_compromiso` (§3.2) | Medio (habilita 1 y 3) | Medio | Scenario + datastore |
| 8 | Resumen espejo con leads tibios (§2.5) | Medio | Bajo | Prompt |
| 9 | Alinear reserva de cupo entre prompts (§2.6) | Bajo (consistencia) | Bajo | Prompts |
| 10 | Cadencia post-ventana con plantillas WhatsApp + recaptación (§3.1) | Alto a mediano plazo | Alto | GHL + Meta |
| 11 | Auditoría mensual (§3.4) | Sostiene todo | Medio | Proceso |

---

*Auditoría generada a partir de los 7 documentos AutoSetter y la lectura
completa de los prompts y blueprints actuales. Ningún scenario ni prompt fue
modificado.*
