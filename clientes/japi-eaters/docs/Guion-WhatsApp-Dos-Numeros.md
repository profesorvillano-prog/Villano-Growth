# Guion de WhatsApp — arquitectura de dos números

> Todos los mensajes en orden, desde que la terapeuta postula hasta que entra a
> la llamada. **Versión posterior a la reunión del 04-09-2026 con Anaís**, que
> reasignó los mensajes entre los dos números respecto del guion anterior.
>
> Fuentes: `Workflow Mensajes — Japi Eaters Final` (PDF de Seba) +
> decisiones de `fathom-vault/sesiones-clientes/2026-09-04--japi-dos-numeros-y-guion-de-whatsapp.md`.
> Implementación técnica: [`Rediseno-Workflows-v2.md`](./Rediseno-Workflows-v2.md).

## Los dos números y sus reglas

| | 🟩 **VERDE** `+52 1 984 404 6192` | 🟪 **MORADO** `+569…` (teléfono nuevo de Anaís) |
|---|---|---|
| Tecnología | WhatsApp Business API (nativo GHL) | App externa en GHL (WhatsApp QR) |
| Mensajería | **Solo plantillas aprobadas** | **Texto libre**, se edita al vuelo |
| Ventana de 24 h | Sí, aplica | **No aplica** — puede iniciar cuando sea |
| Voz | *Equipo Japi Eaters* (3ª persona) hasta que agendan → después **Josefina** | **El closer**, en primera persona |
| Automatización | 100 % automático | Mayoría manual + 4 mensajes automáticos |
| Quién lo opera | Nadie (automático). Anaís lo mira en WhatsApp Web para responder dudas | Anaís (nutrición) + el closer, desde el teléfono/app |

### Las tres reglas que no se rompen

1. **Nunca hay follow-up de "no agendó" en el morado.** Si no agendó, solo
   habla el verde como equipo.
2. **Nunca aparece el nombre del closer en el verde.** El verde es "equipo" y
   luego Josefina; el closer existe solo en el morado.
3. **El morado se activa únicamente cuando la lead confirma** (mensaje A5).
   Antes de eso el morado no escribe.

---

> El número morado es el del teléfono nuevo de Anaís. En la subcuenta ya existe
> el tag `wa: +56962427929`, probablemente ese número — **confirmar antes de
> configurar los envíos.**

---

## FASE 0 · 🟩 VERDE · voz EQUIPO — postuló pero no agendó

Tres toques en 24-36 horas y se cierra. *(Antes eran cuatro y se estiraban
semanas; la decisión del 04-09 fue comprimir: "en uno o dos días y para
afuera".)* **Criterio único de corte: si agenda, sale del flujo.**

**V1** · AUTO · +10 min de la postulación
> Hola [Nombre]! Somos del equipo de Japi Eaters 🙌
> Vimos que completaste tu postulación al programa ÉxiTO en Alimentación
> Infantil, pero no alcanzaste a elegir tu horario para la llamada.
> ¿Pasó algo o simplemente se te cerró la página?
> Te dejamos el link acá 👉 {{link_agenda}}

*El link va desde el primer mensaje: la causa más frecuente es que se les cerró
la página (observación de Anaís).*

**V2** · AUTO · +4 h sin respuesta
> [Nombre], estamos atentos para ayudarte en lo que necesites 🙌
> ¿No te acomodan los horarios disponibles?
> 👉 {{link_agenda}}

**V3** · AUTO · día siguiente (último toque)
> [Nombre], cuéntanos si finalmente deseas agendar tu reunión 💜
> Ya liberamos varias horas para esta semana y quedan pocos cupos por
> convocatoria.
> 👉 {{link_agenda}}

Sin respuesta a V3 → la oportunidad se marca perdida (motivo: *ghosting*) y se
cierra. Nada de seguimiento eterno.

> **Plantillas nuevas a crear** (no se tocan las actuales para no cortar el
> flujo vivo): `v3_equipo_ghost_1`, `v3_equipo_ghost_2`, `v3_equipo_ghost_3`.
> Todas en 3ª persona del plural y sin nombre propio.

### Respuestas manuales frecuentes en el verde

El 70 % de quienes responden V1 preguntan el precio. Respuesta guardada:

> Esa te la responde el equipo en la reunión con calma, porque depende de tu
> caso y de qué camino te conviene 💜 ¿Te parece si tomamos el horario y lo
> vemos ahí? 👉 {{link_agenda}}

**Regla:** el precio no se da por WhatsApp. Siempre se cierra con la pregunta
de agenda.

---

## FASE 1 · 🟩 VERDE · voz JOSEFINA — al agendar

Aquí la conversación cambia de voz a propósito: se lee como si Josefina
entrara al chat.

**A1** · AUTO · al agendar
> Hola {{1}}! 👋 **Te escribe Josefina**, Fundadora de Japi Eaters 🥕
> Antes de nuestra reunión te voy a mandar 3 indicaciones muy importantes para
> tu proceso de postulación.
> Haz click en "Ver vídeo" para enviártelas 🙌
>
> `[ Ver vídeo ]`

**A2** · AUTO · +2 min sin clic
> {{1}}, ojo 👀
> Si no haces click en "Ver vídeo", tu hora queda sin confirmar y se libera
> automáticamente. Son 15 segundos 🙌

**A3** · AUTO · al tocar "Ver vídeo"
> *[Vídeo de Josefina · 3 indicaciones]*
>
> Eso era todo {{1}} 🥦
> Ahora ya sabes cómo va a ser la reunión y qué tener a mano.
> ¿Te dejo confirmada tu hora del [fecha y hora]?
>
> `[ Sí, confirmo ]` `[ Cancelar ]`

**A4** · AUTO · al tocar "Cancelar"
> Sin problema {{1}} 🙌
> Si fue el horario, acá puedes elegir uno que te acomode de verdad:
> {{link_agenda}}
> Y si prefieres dejarlo para más adelante, también está bien 💜

**A5** · AUTO · al confirmar → **activa el morado**
> Supeer {{1}}! Ahora te va a escribir mi equipo y desde ahora en adelante por
> aquí solo te llegarán mensajes automáticos para que no olvides la reunión 💜

> ⚠️ **Rescate del botón (nuevo).** El fallo conocido es que un clic tardío en
> "Sí, confirmo" ya no dispara nada, porque la ventana de la plantilla expiró
> (ver F-2 en la auditoría). Solución: si a los **45 min** no hubo clic, el
> **morado** —que no tiene ventana de 24 h— escribe a mano:
>
> > Hola [Nombre]! Te quedó pendiente confirmar tu hora del [fecha y hora].
> > ¿La dejamos tomada? Con un "sí" me basta 🙌
>
> Esto reemplaza la insistencia manual que hoy hace Anaís a pulso.

---

## FASE 2 · 🟪 MORADO · voz CLOSER — día del agendamiento

**M1** · AUTO · primeros 5 min tras confirmar
> Holaa [Nombre], soy [Closer] del equipo Japi Eaters. ¿Cómo estás? 😊

**M2** · AUTO · +5 seg
> Agendaste una reunión para [fecha y hora], ¿es correcto?

*M1 y M2 son automáticos a propósito: abren el chat solos, así el closer llega
a una conversación ya iniciada.*

**M3** · MANUAL · al responder que sí
> Perfectoo, solo te tengo una última pregunta para dejar todo listo [Nombre]…

### M4 · La pregunta — MANUAL, según el survey

Se elige **una sola**, según lo que marcó en *"¿Con qué situación te
identificas más hoy?"*:

**Si marcó "Me llegan casos y termino derivándolos"**
- *Recomendada:* Vi que terminas derivando casos de alimentación 👀 ¿Cuántos has tenido que derivar este año?
- *Alternativa:* Me quedé pensando en algo que pusiste: que te llegan casos y los terminas derivando. ¿Cómo te sientes cuando tienes que hacer eso?

**Si marcó "Tengo casos pero no sé qué hacer, he intentado de todo…"**
- *Recomendada:* Vi que has intentado de todo pero aún no logras los resultados que quieres 😔 ¿Cuál es tu desafío hoy con estos peques?
- *Alternativa:* Vi que aún no logras que coman en casa 👀 ¿Qué pasa cuando el niño o niña llega a la mesa del hogar?
- *Alternativa:* [Nombre], cuéntame del caso que más te tiene dando vueltas hoy 👀 ¿Qué edad tiene y qué es lo que come?

**Si marcó "No tengo casos aún, quiero prepararme"**
- *Recomendada:* Vi que aún no has tenido casos de alimentación 🙌 ¿Qué crees que te falta para sentirte 100 % lista para tomar un caso nuevo?
- *Alternativa:* Vi que quieres prepararte antes de que te lleguen los casos 🥦 ¿Qué te imaginas que va a pasar cuando te llegue el primero?

**Si no hay respuesta de formulario**
> ¿Cuántos casos de alimentación tienes hoy y qué es lo que más te cuesta con ellos?

### M5 · La segunda pregunta — MANUAL, solo si respondió con interés

| Ruta | Pregunta |
|---|---|
| Deriva casos | ¿Y por qué has tenido que derivarlos? / ¿Qué sientes que necesitas para dejar de derivarlos? |
| Tiene casos sin resultado | ¿Y qué es lo que ya has intentado con ellos? Cuéntame lo que se te venga, aunque sea desordenado / ¿Y la familia cómo está reaccionando a eso? |
| Sin casos aún | ¿Y qué te hizo decir "quiero prepararme en esto ahora"? / ¿Dónde estás trabajando hoy? |

### M6 · Cierre — MANUAL
> Excelente [Nombre], gracias por contarme 💜
> Entonces, para resumir: [su dolor, **en SUS palabras**].
> Cualquier cosa quedo atento por acá.

Variantes:
- *Si contó mucho:* Uf, se nota que le has puesto harto 🙌 Voy a dejar esto anotado tal cual me lo contaste.
- *Si contestó corto:* Te leo 🙌 Una última y te dejo tranquila: [la pregunta que faltó]
- *Si preguntó el precio:* Esa te la responde [Closer] en la reunión con calma, porque depende de tu caso 💜 Cuéntame mejor [pregunta de dolor]

> 📌 **El resumen de M6 se pega en el campo `Resumen Lead`** del contacto. Es lo
> que el closer lee antes de entrar a la llamada — es el único puente entre la
> conversación de WhatsApp y la reunión.

---

## FASE 3 · Día pre-llamada

**M7** · 🟪 MORADO · MANUAL · tres mensajes con 5-10 seg entre medio
> **M7a ·** Holaaa [Nombre]! Ya tengo todo preparado para nuestra reunión 👀
> Le conté tu caso a Josefina y me pidió que te mandara esto…
>
> **M7b ·** *[Vídeo personalizado de Josefina]*
>
> **M7c ·** Nos vemos [fecha y hora] 💜

*Manual a propósito: el vídeo personalizado depende de que Josefina lo haya
grabado. Lo único automático es el movimiento de etapa que avisa que hay que
grabarlo.*

**M8** · 🟩 VERDE · AUTO · esa noche (24 h antes)
> Recuerda que nos vemos [fecha y hora] 🙌
> ¿Nos confirmas por aquí si podrás asistir?
>
> `[ Confirmo mi asistencia ]`

> ⚠️ **Decisión pendiente de Seba (director comercial).** Anaís teme que
> ofrecer "reagendar" siembre reagendas; el problema opuesto es que el closer
> pierda tiempo esperando no-shows.
> **Recomendación:** un **único botón de confirmar**, sin "cancelar" ni
> "reagendar". Pedir confirmación no siembra la cancelación; ofrecer el botón
> de reagendar sí. Quien no toca el botón en 3 h entra a follow-up manual del
> morado, donde el closer puede ofrecer reagendar si la lead lo plantea.

---

## FASE 4 · Día de la llamada

**M9** · 🟪 MORADO · AUTO · en la mañana
> Hola [Nombre], buen día! Hoy es nuestra llamada a las [hora].
> Recuerda ingresar desde el computador y estar en un lugar tranquilo.
> Nos vemos! 🙌

**M10** · 🟪 MORADO · AUTO · 15 min antes
> Hola [Nombre], acá el link del meet: {{link_meet}}
> Nos vemos en breve! 🙌

**M11** · 🟪 MORADO · MANUAL · a la hora
> Ya estoy por aquí! Te espero adentro 👉 {{link_meet}}

*M9 y M10 automáticos resuelven el problema real de que el closer se conectaba
tarde o no leía los mensajes previos: la lead recibe el link sí o sí.*

---

## Resumen: qué es automático y en qué número

| Fase | Mensajes | Número | Modo |
|---|---|---|---|
| 0 · No agendó | V1, V2, V3 | 🟩 Verde | AUTO (3 plantillas nuevas) |
| 1 · Al agendar | A1, A2, A3, A4, A5 | 🟩 Verde | AUTO (plantillas con botón) |
| 1b · Rescate botón | 1 mensaje | 🟪 Morado | MANUAL (o auto si se arma) |
| 2 · Levantamiento | M1, M2 | 🟪 Morado | AUTO |
| 2 · Levantamiento | M3, M4, M5, M6 | 🟪 Morado | MANUAL |
| 3 · Pre-llamada | M7a/b/c | 🟪 Morado | MANUAL |
| 3 · Recordatorio 24 h | M8 | 🟩 Verde | AUTO |
| 4 · Día de llamada | M9, M10 | 🟪 Morado | AUTO |
| 4 · Entrada | M11 | 🟪 Morado | MANUAL |

**Total automático:** 10 mensajes (6 verde + 4 morado). **Total manual:** 8.
