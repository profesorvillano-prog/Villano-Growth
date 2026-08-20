# Workflow de Mensajes — Show Up & Compromiso a la Llamada

> Secuencia completa de WhatsApp desde que la terapeuta agenda hasta que entra a
> la llamada con Rafa. Complementa la plantilla SDR del mentor, adaptada a la voz
> de Japi Eaters y al hecho de que **el closer no es terapeuta**.
> Fuente: reuniones del 19 y 20 de agosto (Seba, Josefina, Anaís) + doc
> "Workflow Mensajes Japi Eaters" + plantilla "SDR Daily Workflow".
> Ver `Voz-y-Marca.md` para tono y `Avatar.md` para dolores.

---

## 1. Los dos números y quién habla en cada uno

| Número | Quién firma | Qué manda | Naturaleza |
|---|---|---|---|
| **Número AUTO** (el actual) | **Josefina** (fundadora) | Confirmación de agenda, video de indicaciones, handoff, recordatorios | 100% automático |
| **Número SETTER** (nuevo) | **Rafa** | Conversación real, preguntas, video personalizado del día 2, link del meet | Automático los 3 primeros + manual desde el #4 |

**Reglas de identidad**
- Todo lo que se firme desde el número nuevo va **a nombre de Rafa**, aunque lo
  escriba Anaís. Anaís conserva su WhatsApp propio **solo para alumnas ya
  inscritas** (Sesión de Claridad, mentorías) para no duplicar identidades.
- Josefina **solo** habla en el número AUTO, y su último mensaje ahí anuncia el
  traspaso. Después de eso, Josefina "reaparece" únicamente a través de Rafa
  (video personalizado del día 2). Eso es lo que produce el efecto de que *la
  fundadora se metió personalmente en su caso*.
- Rafa y Anaís deben tener **ambos acceso** al número setter (cancelaciones de
  último minuto, agendas del mismo día, coordinación de horarios).

## 2. Principios de redacción (aplican a todos los mensajes)

1. **Máximo 4 líneas por mensaje.** WhatsApp corta con "leer más" y ahí se pierde
   todo. Si el mensaje es largo, se parte en dos con desfase de 2-5 segundos.
2. **Un mensaje = una idea = una acción.** Nunca dos preguntas juntas.
3. **Botones con nombre humano**, no genéricos: "Sí, confirmo" / "Quiero ver el
   video" / "Necesito cambiar la hora". Nunca dos botones que digan "Confirmar".
4. **Tono colega-amiga**: cercano, chileno, con emojis de fruta/verdura 🥕🍓🥦,
   sin infantilizar ni culpar a la terapeuta.
5. **Palabras prohibidas**: "paciente" → *usuario* o *niño y niña*; "papás" →
   *familia* o *mamá*. Evitar "fácil", "rápido", "garantizado", "trucos".
6. **Nunca decir "para preparar tu llamada" ni "para personalizar tu llamada".**
   El closer no es terapeuta y no puede sostener esa promesa. El encuadre correcto
   es: *"para que el equipo vea bien tu caso"*.
7. **El video personalizado del día 2 es sorpresa.** No se anuncia en ningún
   mensaje previo.
8. Todos los mensajes se escriben **con nombre** (`{{nombre}}`), nunca en frío.

---

## 3. Mapa del flujo

```
FORMULARIO ──► ¿Eligió horario?
                 │
                 ├── NO ──► GHOSTING DE AGENDA (número SETTER, auto, firma Rafa)
                 │
                 └── SÍ ──► AUTO #1  (Josefina · botón "Quiero ver el video")
                              │
                              ├─ no hace clic en 2 min ──► AUTO #4 (recordatorio)
                              │
                              └─ hace clic ──► AUTO #2 (video nuevo + 2 botones)
                                                 │
                                                 ├─ "Necesito cambiar la hora" ──► AUTO #5
                                                 │
                                                 └─ "Sí, confirmo" ──► AUTO #3 (handoff)
                                                                        │
                                                                        ▼
                                              ══ SE ACTIVA NÚMERO SETTER (Rafa) ══
                                                 DÍA DE AGENDA:  #1 · #2 · #3 · #4 · #5
                                                 DÍA PRE-LLAMADA: #6 (video personalizado) · #7
                                                 DÍA DE LLAMADA: #8 · #9 · #10 · #11
```

---

## 4. Bloque A — Al agendar (número AUTO, voz Josefina)

### Wsp AUTO #1 — Al agendar (inmediato)

> Holaaa {{nombre}}! 🍓
> Soy Josefina, fundadora de Japi Eaters.
>
> Antes de tu reunión te voy a mandar 3 indicaciones muy importantes para tu
> proceso de postulación.
>
> Haz clic en **"Quiero ver el video"** y te las envío 👇

**Botón:** `Quiero ver el video`

*Nota: el botón NO dice "Confirmar" a propósito. Confirmar sin haber visto nada
es una confirmación vacía; queremos que primero vea el video y recién ahí decida.*

### Wsp AUTO #4 — No hizo clic (2 minutos después)

> {{nombre}}, ojo 👀
> Si no haces clic en **"Quiero ver el video"**, tu hora queda sin confirmar y se
> libera automáticamente.
>
> Son 15 segundos 🙌

*Se dispara solo si no hubo clic. Justificación (reunión 19/08): quien agenda está
con el teléfono en la mano; si no responde en minutos, no responde nunca.*

### Wsp AUTO #2 — Al poner "Quiero ver el video"

**Se envía el VIDEO NUEVO de Josefina** (guion en §8) y a continuación:

> Eso es todo {{nombre}} 🥦
> Esta es tu **única** postulación de este semestre, así que quiero que llegues
> con todo.
>
> ¿Me confirmas que vas a estar?

**Botones:** `Sí, confirmo` · `Necesito cambiar la hora`

*El segundo botón existe a propósito: preferimos que cancele ahora, después de
haber visto el video, y no que llene un cupo y no aparezca. La advertencia de la
única postulación por semestre va DENTRO del video, no en el texto (ahí se
escucha como cuidado, en texto se lee como amenaza).*

### Wsp AUTO #5 — Eligió "Necesito cambiar la hora"

> Sin problema {{nombre}} 🙌
> Acá puedes elegir la hora que de verdad te acomode: {{link_agenda}}
>
> Prefiero que llegues tranquila y no a medias 💜

### Wsp AUTO #3 — Eligió "Sí, confirmo" → **se activa el número SETTER**

> Supeer {{nombre}}! 🥕
> Este es el último mensaje que te escribo yo por acá: de ahora en adelante te va
> a estar contactando mi equipo desde otro número, y por aquí solo te llegarán los
> recordatorios para que no se te pase la reunión.
>
> Nos vemos pronto 💜

---

## 5. Bloque B — Ghosting de agenda (número SETTER, automático, firma Rafa)

Se dispara cuando completó el formulario pero **no eligió horario**. Va desde el
número setter (no desde el AUTO) porque acá empieza una conversación real y quien
la va a seguir es Rafa/Anaís.

### Ghosting #1 — a los 10 minutos

> Hola {{nombre}}! Soy Rafa, del equipo de Japi Eaters 🙌
> Vi que completaste tu postulación a ÉxiTO en Alimentación pero no alcanzaste a
> elegir tu horario.
>
> ¿Pasó algo o simplemente se te cerró la página?

### Ghosting #2 — a las 3 horas si no responde

> {{nombre}}, te dejo el link por si se te perdió 👉 {{link_agenda}}
>
> Hay pocos horarios esta semana, así que si ves uno que te sirva, tómalo altiro.

### Ghosting #3 — al día siguiente si no responde

> {{nombre}}, última que te escribo por acá para no molestarte 🙈
> Si este no es tu momento lo entiendo perfecto, solo dime "ahora no" y cierro tu
> postulación.
>
> Y si sí quieres, es un clic: {{link_agenda}}

*Si agenda después del ghosting: Rafa le avisa que empezarán a llegarle
confirmaciones desde otro número, para que no se confunda con el número AUTO.*

---

## 6. Bloque C — Día de agenda (número SETTER, firma Rafa)

Los mensajes **#1, #2 y #3 son automáticos**. El **#4 es automático pero con 3
variantes** según la respuesta del formulario. Del **#5 en adelante es manual**
(Anaís/Rafa escribiendo de verdad).

> ⏱️ **Regla de oro:** el #1 sale dentro de los primeros 5 minutos post-confirmación.

### WhatsApp Message #1 (auto)

> Holaa {{nombre}}, soy Rafa del equipo Japi Eaters 🙌
> ¿Cómo estás?

### WhatsApp Message #2 (auto · 5 segundos después)

> Agendaste una reunión para **{{fecha}} a las {{hora}}**, ¿es así? 👀

### WhatsApp Message #3 (auto · al responder que sí)

> Perfectoo {{nombre}}, entonces nos vemos ese día 🙌

### WhatsApp Message #4 (auto · **3 rutas según formulario**)

**Este es el mensaje más importante de todo el workflow.** Su único objetivo es
que ella **suelte su situación real en sus propias palabras**, para que Josefina
pueda grabarle el video personalizado del día siguiente.

**Encuadre obligatorio** (por qué NO decimos "para preparar tu llamada"):

> La formación trabaja muchos frentes distintos — evaluación, sensorial,
> compromiso familiar, estructura de sesión — así que necesitamos saber en cuál
> estás tú para mostrarte lo que de verdad te sirve. Quien lee esa respuesta es el
> **equipo clínico**, no el closer.

Fórmula de los tres: **reconocimiento del formulario → pregunta abierta de
situación → pregunta de causa**. Nunca dos preguntas en el mismo mensaje: la
segunda se manda como #4b, 2-5 segundos después.

---

#### 🅐 Ruta A — "Me llegan casos y termino derivándolos"

**Variante A1** *(la recomendada — la derivación duele en la identidad profesional)*

> Antes de la reunión quiero pasarle tu caso al equipo, así que cuéntame un poco 👀
>
> Vi que te llegan casos de alimentación y terminas derivándolos. ¿Cuántos has
> tenido que derivar este año, más o menos?

*(#4b, a los 5 segundos)*

> Y cuando los derivas… ¿es porque sientes que te falta el paso a paso, o porque
> prefieres no arriesgarte con ese caso? 💜

**Variante A2** *(más emocional, para leads que ya escribieron harto en el formulario)*

> Cuéntame algo antes de la reunión, así el equipo llega sabiendo de ti 🙌
>
> Me quedé pensando en que te llegan casos de alimentación y los terminas
> derivando. ¿Cómo te sientes cuando tienes que hacer eso?

*(#4b)*

> ¿Y qué crees que te haría falta para quedarte tú con ese caso? 👀

---

#### 🅑 Ruta B — "Tengo casos pero no sé qué hacer, he intentado de todo y aún no logro que coman en casa" ⭐

*Esta es la ruta con más volumen y el dolor más caro (avance nulo + familia que
pierde la confianza). Por eso lleva **tres** variantes.*

**Variante B1** *(la recomendada — va directo al "en sesión sí, en casa no")*

> Antes de la reunión quiero pasarle tu caso al equipo, cuéntame un poco 👀
>
> Vi que tienes casos pero que aún no logras que coman en casa. ¿Cuántos casos
> así tienes hoy?

*(#4b)*

> ¿Y qué es lo que ya has intentado con ellos? Cuéntame lo que se te venga a la
> cabeza, aunque sea desordenado 🙌

**Variante B2** *(centrada en la familia — el 80% del método)*

> Cuéntame algo antes de la reunión así el equipo ve bien tu caso 🥕
>
> Dijiste que has intentado de todo y aún no logras que coman en casa. ¿Qué pasa
> cuando el niño o niña llega a la mesa del hogar?

*(#4b)*

> ¿Y la familia cómo está reaccionando a eso? 👀

**Variante B3** *(la del caso concreto — la que da mejor material para el video)*

> {{nombre}}, cuéntame de un caso puntual antes de la reunión 👀
>
> El que más te tiene dando vueltas hoy: ¿qué edad tiene y qué es lo que come?

*(#4b)*

> ¿Y qué es lo que más te está costando con ese caso? 💜

---

#### 🅒 Ruta C — "No tengo casos aún, quiero prepararme"

**Variante C1** *(la recomendada — valida la anticipación, no la castiga)*

> Antes de la reunión quiero que el equipo sepa de ti, cuéntame 🙌
>
> Vi que todavía no tienes casos de alimentación y quieres prepararte. ¿Estás
> atendiendo niños y niñas hoy en otra área, o estás partiendo?

*(#4b)*

> ¿Y qué te hizo decir "quiero prepararme en esto ahora"? 👀

**Variante C2** *(orientada al miedo real: que le llegue el caso y no sepa qué hacer)*

> Cuéntame un poco antes de la reunión, así el equipo llega sabiendo de ti 🥦
>
> ¿Qué te imaginas que va a pasar cuando te llegue el primer caso de alimentación?

*(#4b)*

> ¿Y hoy dónde estás trabajando? 🙌

---

#### 🅧 Ruta fallback — sin respuesta de formulario o respuesta ambigua

> Antes de la reunión quiero pasarle tu caso al equipo, así que cuéntame 👀
>
> ¿Cuántos casos de alimentación tienes hoy y qué es lo que más te cuesta con
> ellos?

---

### WhatsApp Message #5 (manual · Anaís/Rafa)

Espeja el dolor **con sus propias palabras** y cierra sin prometer nada. Este
mensaje es el que deja la puerta abierta para la sorpresa del día siguiente.

> Excelente {{nombre}}, gracias por contarme 💜
> Entonces, para resumir: **[punto de dolor en sus palabras]**.
>
> ¿Hay algo en específico que quieras que veamos sí o sí?

**Variantes de cierre según lo que soltó:**

- Si contó mucho →
  > Uf, se nota que le has puesto harto 🙌 Voy a dejar esto anotado tal cual me lo
  > contaste. ¿Algo más que quieras que sepamos?
- Si contestó corto →
  > Te leo 🙌 Una última y te dejo tranquila: **[la pregunta que faltó]**
- Si preguntó por precio →
  > Esa te la responde Rafa en la reunión con calma, porque depende de tu caso 💜
  > Cuéntame mejor **[pregunta de dolor]**

> 🚫 **No prometer el video acá.** Nada de "te voy a mandar algo". La sorpresa del
> día 2 se pierde si se anuncia.

---

## 7. Bloque D — Día pre-llamada (número SETTER, firma Rafa)

### WhatsApp Message #6 — El handoff a Josefina (el momento clave)

Se manda **en dos partes**, con 5-10 segundos entre medio.

**#6a (texto)**

> {{nombre}}! Le conté tu caso a Josefina 👀
> Le llamó la atención lo de **[dolor específico en sus palabras]** y me pidió que
> te mandara esto…

**#6b (video personalizado de Josefina, 60-90 s)** — guion en §8.

**#6c (5 segundos después del video)**

> Nos vemos {{fecha}} a las {{hora}} 💜

*Por qué funciona: la lead no pidió esto, no se lo prometimos y viene de la
fundadora, no del vendedor. Es la diferencia entre "me están vendiendo" y "se
están haciendo cargo de mi caso".*

### WhatsApp Message #7 — Al responder al video

> Buenísimo {{nombre}} 🙌 Nos vemos **{{fecha}} a las {{hora}}**.
> Cualquier cosa me escribes por acá.

---

## 8. Los dos videos de Josefina

### Video A — "3 indicaciones" (AUTO #2) · estándar · 60-90 s

Se graba **una sola vez**. Estructura:

1. **Saludo y validación** (10 s) — "Hola, soy Josefina. Primero, quiero
   felicitarte por postular…"
2. **Indicación 1 — Esto es un proceso de admisión, no una llamada de venta**
   (15 s) — no todas quedan; hay una conversación real de por medio.
3. **Indicación 2 — Vas a hablar con Rafa, de mi equipo** (15 s) — él conoce el
   programa por dentro; lo que tú le cuentes lo veo yo.
4. **Indicación 3 — Reserva 45 minutos reales** (15 s) — lugar tranquilo, sin
   niños, con papel y lápiz. Si no puedes, cambia la hora ahora.
5. **Cierre con la advertencia** (15 s) — "Si cancelas a última hora o no llegas,
   no vas a poder volver a postular este semestre. No es para asustarte: es
   porque cada hora que abrimos se la estamos quitando a otra terapeuta."
6. **CTA** (5 s) — "Dale a 'Sí, confirmo' y nos vemos 💜"

### Video B — Personalizado (Message #6b) · uno por lead · 60-90 s

Se graban **en tanda**, agrupando las agendas del día anterior. Guion:

1. **Nombre + de dónde viene** (10 s) — "Hola {{nombre}}, Rafa me estuvo contando
   de tu caso…"
2. **Devolverle su dolor textual** (15 s) — "…que tienes X casos y que en sesión
   avanzan pero en la casa no pasa nada."
3. **Nombrar la causa clínica** (20 s) — el porqué real de lo que le pasa, en
   lenguaje de colega. *No dar la solución completa: dar el nombre del problema.*
4. **Puente a la formación** (20 s) — "Eso es exactamente lo que trabajamos en
   [módulo / mentoría 1:1 / compromiso familiar]…"
5. **Cierre humano** (10 s) — "Nos vemos en la reunión con Rafa, y ahí lo vemos en
   detalle. Un abrazo 💜"

**Lo que Rafa/Anaís le deben pasar a Josefina** (formato fijo, por Slack):

```
NOMBRE · PAÍS
Ruta del formulario: A / B / C
Casos hoy: ___
Frase textual del dolor: "___"
Qué ya intentó: ___
Reunión: {{fecha}} {{hora}}
```

> Este mismo resumen debe llegarle **también a Rafa antes de la llamada**, para que
> la llamada continúe lo que dijo el video y no lo repita. (Problema levantado por
> Anaís: hoy la lead cuenta lo mismo 4 veces — Instagram, formulario, setter,
> closer.)

---

## 9. Bloque E — Día de la llamada (número SETTER, firma Rafa)

### WhatsApp Message #8 — En la mañana

> Hola {{nombre}}, buen día! 🙌
> Nos vemos hoy a las **{{hora}}**. Procura estar en un lugar tranquilo y con
> tiempo, así podemos ver en profundidad cómo ayudarte.

### WhatsApp Message #9 — Al responder

> Buenísimo! Una hora antes te paso el link del meet por acá. Nos vemos 💜

### WhatsApp Message #10 — 1 hora antes

> Hola {{nombre}}, acá el link del meet: {{link_meet}}
> Nos vemos en un rato! 🙌

### WhatsApp Message #11 — A la hora exacta

> Ya estoy por acá! Te espero adentro 👉 {{link_meet}}

---

## 10. Bloque F — No-show y reagenda

### No-show #1 — 10 minutos después de la hora

> {{nombre}}, te estoy esperando en el meet 👀
> {{link_meet}}

### No-show #2 — 45 minutos después

> {{nombre}}, no alcanzamos a juntarnos hoy 🙈
> ¿Se te cruzó algo o prefieres que lo dejemos hasta acá?

### No-show #3 — al día siguiente

> {{nombre}}, Josefina se dio el tiempo de grabarte ese video, así que antes de
> cerrar tu postulación te pregunto una vez más 💜
>
> ¿Quieres que te dé una última hora esta semana?

*Regla: **una sola** reagenda. Si tampoco llega, se cierra la postulación hasta el
próximo semestre — y eso se cumple, porque es lo que prometió el Video A.*

---

## 11. Reglas técnicas y de calendario

| Regla | Definición |
|---|---|
| Ventana de agenda | **4 días** hacia adelante. Con 6 días se llenaba de ghosting; con menos, no alcanzan a entrar. Revisar cada jueves. |
| Contacto post-confirmación | Primeros **5 minutos** |
| Desfase entre mensajes de un mismo bloque | 2-5 segundos |
| Wait tras respuesta de la lead | 2-3 minutos antes del siguiente automático (deja que mande 2-3 mensajes seguidos) |
| Origen del lead | Marcar orgánico vs. ads **antes** de mandar la agenda (Go High Level / Slack) |
| Si la lead escribe entremedio de un automático | Anaís responde **encima**, retomando lo que ella dijo. No dejar el automático colgado. |
| Respuestas rápidas | Las 3 variantes del #4 y las de cierre del #5 quedan guardadas en WhatsApp Business, aunque se automaticen |
| Notificación a Slack | Debe llegar la **frase textual del dolor**, no solo "respondió" |

## 12. Checklist de implementación

- [ ] Configurar el número setter nuevo y dar acceso a Rafa **y** a Anaís
- [ ] Grabar **Video A** (3 indicaciones) — Josefina
- [ ] Ajustar ventana del calendario a **4 días**
- [ ] Cargar AUTO #1 a #5 con los botones renombrados ("Quiero ver el video",
      "Sí, confirmo", "Necesito cambiar la hora")
- [ ] Cargar bloque de ghosting en el número setter, firma Rafa
- [ ] Cargar Message #1, #2, #3 automáticos + **#4 con las 3 rutas** condicionadas
      a la respuesta del formulario
- [ ] Dejar #5 en adelante en manual, con respuestas rápidas guardadas
- [ ] Definir el formato del resumen Rafa/Anaís → Josefina (§8) y publicarlo en Slack
- [ ] Reunión Rafa + Josefina: alinear guion del Video B con la apertura de la llamada
- [ ] Medir a 2 semanas: **% que hace clic en "Quiero ver el video"**, **% que
      confirma**, **% que responde el #4**, **show up rate**, **cierre**

## 13. Decisiones tomadas (para no re-discutirlas)

- El botón inicial **no** dice "Confirmar": primero ve el video, después confirma.
- **Sí** se ofrece cancelar/cambiar hora. Preferimos filtrar antes que tener
  agendas fantasma.
- El primer mensaje lo firma **Josefina** (recomendación del mentor), pero corto,
  para no morir en el "leer más".
- El día 2 lleva video personalizado **de sorpresa**; el video de preparación
  estándar de la web se deja de contar como parte del flujo.
- La pregunta del #4 se construye sobre **"¿Con qué situación te identificas más
  hoy?"** y no sobre "¿qué buscas lograr?": la situación actual es más objetiva,
  responde más gente y el dolor presente es lo que mueve la decisión.
