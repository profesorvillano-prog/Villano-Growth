# Guion de WhatsApp — de la postulación a la llamada

> Transcripción del documento *Workflow Mensajes · Japi Eaters (Final)* con cada
> mensaje mapeado a su **etapa del pipeline ②**, su **disparador** y su
> **workflow**. Es la fuente de verdad de los textos; la estructura que los
> ejecuta está en [`Sistema-Pipelines-v2.md`](./Sistema-Pipelines-v2.md) §4.

---

## Los dos números

| | Número | Firma | Operación | Rol |
|---|---|---|---|---|
| 🟩 | **+52** · WhatsApp Business | **Josefina** | 100 % automático | La marca. Confirma la hora y sostiene la relación. |
| ⬜ | **+569** · Número nuevo | **Rafa** | **Anaís y Rafa** | La persona. Levanta, califica y lleva a la llamada. |

Dos notas de implementación que hay que tener presentes:

- **Anaís escribe firmando como Rafa** en todo el +569 (M3 a M7 son manuales).
  Los dos necesitan acceso a la misma bandeja del +569.
- El +52 usa **variables de plantilla** de WhatsApp Business (`{{1}}`); el +569
  usa texto libre con `[Nombre]`. En GHL los dos se resuelven con
  `{{contact.first_name}}`, pero el +52 exige plantilla aprobada por Meta antes
  de poder enviarse.

---

## FASE 0 · Postuló pero no agendó → etapa **1 · Sin Agendar**

Número **+569**, firma Rafa. Workflow **W7**.

| Id | Envío | Disparador | Texto |
|---|---|---|---|
| **G1** | AUTO | **+10 min** de la postulación | Hola [Nombre]! Soy Rafa, del equipo de Japi Eaters 🙌<br>Vi que completaste tu postulación a ÉxiTO pero no alcanzaste a elegir tu horario.<br>¿Pasó algo o simplemente se te cerró la página? |
| **G2** | AUTO | +3 h sin respuesta | [Nombre], te dejo el link por si se te perdió 👉 `{{link_agenda}}`<br>Hay pocos horarios esta semana, si ves uno que te sirva tómalo altiro. |
| **G3** | MANUAL | Día siguiente | [Nombre], última que te escribo por acá para no molestarte 🙈<br>Si este no es tu momento lo entiendo perfecto, dime "ahora no" y cierro tu postulación.<br>Y si sí quieres, es un clic: `{{link_agenda}}` |

> **G3 trae su propio cierre.** "Dime ahora no y cierro tu postulación" es el
> disparador limpio para marcar **Perdida · motivo *No es su momento***. Sin esa
> frase, las tarjetas se quedan abiertas para siempre — que es exactamente lo que
> pasa hoy con las 52 en ghost.

---

## FASE 1 · Al agendar → etapas **2 · Sin Confirmar** y **3 · Confirmada**

Número **+52**, voz Josefina, todo automático. Workflow **W9**.

No es un recordatorio: es un **portón de dos pasos**. La hora no queda confirmada
hasta que la lead hace clic en *Ver vídeo* y después en *Sí, confirmo*.

| Id | Envío | Disparador | Texto |
|---|---|---|---|
| **A1** | AUTO | Al agendar | Holaaa {{1}}! 👋 Soy Josefina, Fundadora de Japi Eaters 🥕<br>Antes de tu reunión te voy a mandar 3 indicaciones muy importantes para tu proceso de postulación.<br>Haz click en "Ver vídeo" para enviártelas 🙌<br>`[ Ver vídeo ]` |
| **A2** | AUTO | +2 min sin clic | {{1}}, ojo 👀<br>Si no haces click en "Ver vídeo", tu hora queda sin confirmar y se libera automáticamente.<br>Son 15 segundos 🙌 |
| **A3** | AUTO | Al pulsar *Ver vídeo* | *Vídeo de Josefina · 3 indicaciones*<br>Eso era todo {{1}} 🥦<br>Ahora ya sabes cómo va a ser la reunión y qué tener a mano.<br>¿Te dejo confirmada tu hora del [fecha y hora]?<br>`[ Sí, confirmo ]` `[ Cancelar ]` |
| **A4** | AUTO | Al pulsar *Cancelar* | Sin problema {{1}} 🙌<br>Si fue el horario, acá puedes elegir uno que te acomode de verdad: `{{link_agenda}}`<br>Y si prefieres dejarlo para más adelante, también está bien 💜 |
| **A5** | AUTO | Al confirmar → **activa el +569** | Supeer {{1}}! Ahora te va a escribir mi equipo y desde ahora en adelante por aquí sólo te llegarán mensajes automáticos para que no olvides la reunión 💜 |

**A5 es la bisagra del sistema.** Es el único punto donde el +52 le pasa la
persona al +569. Antes de A5, el +569 no escribe. Después de A5, el +52 solo
manda recordatorios.

Las etiquetas de esta fase ya existen y ya se están poblando: `video-enviado`
(60 contactos), `confirmada` (60), `sin-confirmar` (8).

---

## FASE 2 · Día del agendamiento → etapa **4 · Diagnóstico**

Número **+569**, firma Rafa, lo opera Anaís. Workflow **W10**.

| Id | Envío | Disparador | Texto |
|---|---|---|---|
| **M1** | AUTO | Primeros 5 min tras A5 | Holaa [Nombre], soy Rafa del equipo Japi Eaters. ¿Cómo estás? 😊 |
| **M2** | AUTO | +5 seg | Agendaste una reunión para [fecha y hora], ¿es correcto? |
| **M3** | MANUAL | Al responder que sí | Perfectoo, sólo te tengo una última pregunta para dejar todo listo [Nombre]… |

### M4 · La pregunta — se ramifica sola

La rama la decide la respuesta del formulario a **"¿Con qué situación te
identificas más hoy?"**, que ya es un campo con esas tres opciones exactas. El
workflow puede mostrarle a Anaís la pregunta correcta sin que ella tenga que
buscarla. **Va una sola pregunta.**

**🅐 "Me llegan casos y termino derivándolos"**

- *A1 · recomendada* — Vi que terminas derivando casos de alimentación 👀 ¿Cuántos has tenido que derivar este año?
- *A2 · alternativa* — Me quedé pensando en algo que pusiste: que te llegan casos de alimentación y los terminas derivando. ¿Cómo te sientes cuando tienes que hacer eso?

**🅑 "Tengo casos pero no sé qué hacer, he intentado de todo y aún no logro que coman en casa"**

- *B1 · recomendada* — Vi que has intentado de todo pero aún no logras los resultados que quieres 😔 ¿Cuál es tu desafío hoy con estos peques?
- *B2 · alternativa* — Vi que aún no logras que coman en casa 👀 ¿Qué pasa cuando el niño o niña llega a la mesa del hogar?
- *B3 · alternativa* — [Nombre], cuéntame del caso que más te tiene dando vueltas hoy 👀 ¿Qué edad tiene y qué es lo que come?

**🅒 "No tengo casos aún, quiero prepararme"**

- *C1 · recomendada* — Vi que aún no has tenido casos de alimentación 🙌 ¿Qué crees que te falta para sentirte 100% lista para tomar un caso nuevo?
- *C2 · alternativa* — Vi que quieres prepararte antes de que te lleguen los casos 🥦 ¿Qué te imaginas que va a pasar cuando te llegue el primero?

**🅧 Si no hay respuesta de formulario**

- ¿Cuántos casos de alimentación tienes hoy y qué es lo que más te cuesta con ellos?

### M5 · La segunda pregunta — solo si respondió con interés

| Ruta | Pregunta |
|---|---|
| 🅐 | ¿Y por qué has tenido que derivarlos? · ¿Qué sientes que necesitas para dejar de derivarlos? |
| 🅑 | ¿Y qué es lo que ya has intentado con ellos? Cuéntame lo que se te venga, aunque sea desordenado · ¿Y la familia cómo está reaccionando a eso? |
| 🅒 | ¿Y qué te hizo decir "quiero prepararme en esto ahora"? · ¿Dónde estás trabajando hoy? |

### M6 · Cierre — MANUAL

> Excelente [Nombre], gracias por contarme 💜
> Entonces, para resumir: **[su dolor, en SUS palabras]**.
> Cualquier cosa quedo atento por acá.

| Situación | Añadido |
|---|---|
| **Contó mucho** | Uf, se nota que le has puesto harto 🙌 Voy a dejar esto anotado tal cual me lo contaste. |
| **Contestó corto** | Te leo 🙌 Una última y te dejo tranquila: [la pregunta que faltó] |
| **Preguntó el precio** | Esa te la responde Rafa en la reunión con calma, porque depende de tu caso 💜 Cuéntame mejor [pregunta de dolor] |

> **"[su dolor, en SUS palabras]" es el campo `opportunity.resumen_lead`.** M6 no
> es solo un mensaje de cortesía: es el momento en que se captura lo que Rafa va
> a leer antes de entrar a la llamada. Lo que Anaís escribe en M6 se copia tal
> cual al campo. Sin ese paso, el diagnóstico se pierde en la conversación.

---

## FASE 3 · Día pre-llamada → etapa **5 · Pre-Llamada**

| Id | Nº | Envío | Disparador | Texto |
|---|---|---|---|---|
| **M7a** | +569 | MANUAL | Tres mensajes, 5-10 seg entre medio | Holaaa [Nombre]! Ya tengo todo preparado para nuestra reunión 👀 Le conté tu caso a Josefina y me pidió que te mandara esto… |
| **M7b** | +569 | MANUAL | | *Vídeo personalizado de Josefina* |
| **M7c** | +569 | MANUAL | | Nos vemos [fecha y hora] 💜 |
| **M8** | +52 | AUTO | Esa noche | Recuerda que nos vemos [fecha y hora] 🙌 |

M7b es el único activo que exige trabajo humano de Josefina cada vez. Conviene
medir su efecto sobre el show-up: si sube menos de lo que cuesta producirlo,
se puede reemplazar por un vídeo genérico por rama (🅐/🅑/🅒).

---

## FASE 4 · Día de la llamada → etapa **6 · Día de Llamada**

| Id | Nº | Envío | Disparador | Texto |
|---|---|---|---|---|
| **M9** | +569 | AUTO | En la mañana | Hola [Nombre], buen día! Hoy es nuestra llamada a las [hora].<br>Recuerda ingresar desde el computador y estar en un lugar tranquilo.<br>Nos vemos! 🙌 |
| **M10** | +569 | AUTO | 15 min antes | Hola [Nombre], acá el link del meet: `{{link_meet}}`<br>Nos vemos en breve! 🙌 |
| **M11** | +569 | MANUAL | A la hora | Ya estoy por aquí! Te espero adentro 👉 `{{link_meet}}` |

Con M11 termina el pipeline ②: la tarjeta se gana y nace en `③ Llamadas`.

---

## Los tres huecos del guion

El guion cubre de la postulación a la llamada. Faltan tres momentos, y uno de
ellos es el más caro del embudo:

1. **Rescate de no-show — no existe.** Hoy hay **34 no-shows abiertos**, 20 de
   ellos con más de 22 días. Es el hueco más caro que tiene el sistema: gente que
   llegó hasta el final del embudo y no tiene ni un mensaje escrito. Hace falta
   un `M12` por el +569, a las 2 h de la hora perdida, que reagende sin culpa.
2. **Cortesía a la descalificada.** Quien llena el formulario con `tier-out` no
   recibe nada. Hace falta un `M13` breve por el +569 que cierre bien y deje la
   puerta abierta — el 27 % de las descalificadas lo son por presupuesto, no por
   perfil.
3. **Post-llamada.** El guion se detiene al entrar a la reunión. Lo que pasa
   después (seguimiento, propuesta, link de pago) vive en `③` y `④` y todavía no
   tiene textos.
