# Plantillas de WhatsApp v3 — para enviar a aprobación

> Las 11 plantillas nuevas del número **verde** (`+52`, WhatsApp Business API),
> con el link de agenda **escrito directo en el texto**. El número morado es
> texto libre y **no necesita plantillas**.
>
> Se crean **nuevas**, no se editan las actuales: las aprobadas siguen
> corriendo hasta que el flujo v2 esté publicado.
>
> Página para copiar y pegar: https://claude.ai/code/artifact/63758f82-af14-46a8-8640-7864d90107ed
> · Copy del recorrido: [`Guion-WhatsApp-Dos-Numeros.md`](./Guion-WhatsApp-Dos-Numeros.md)
> · Dónde se usa cada una: [`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md)

## Los dos calendarios

| Origen | Link que va en la plantilla |
|---|---|
| `ads` | `https://www.japieaters.app/agendatullamada` |
| `org-bio` y `org-setter` | `https://www.japieaters.app/or/agendatullamada` |

Bio y setter comparten calendario. Y como el link va **solo en el primer
mensaje**, solo ese primero tiene dos versiones: los otros dos son uno solo.

## Qué implica llevar el link escrito

Al no ser variable, **`02 · Ghost` abre con un if/else por origen** solo para el
primer mensaje: rama ADS manda `v3_ghost_1_ads`, rama ORG manda
`v3_ghost_1_org`, y los `org-setter` salen sin ghost (Valen los trabaja por DM).
Después las dos ramas siguen con `v3_ghost_2` y `v3_ghost_3`, que son las mismas
para todos. Lo mismo en `03` para elegir cuál de los dos `cancelo_reagenda` sale.

A cambio desaparece el punto de falla: ninguna variable puede llegar vacía y
dejar un mensaje sin enviar, y Meta revisa la plantilla viendo el link real.

*(El campo `Link Agenda` que se creó el 14-09 deja de ser necesario para las
plantillas. Se mantiene porque le sirve a Valen para pegar el link en el DM y
porque deja el dato a la vista en la ficha del contacto.)*

## Dos reglas del gestor que hacen rebotar plantillas

**El body no puede empezar ni terminar con una variable.** Meta lo rechaza con
*"Your body can't start or end with a variable. Add text before or after it"*.
Por eso todas abren con una palabra —"Hola", "Ojo"— y ninguna termina en el
link: siempre hay una línea de cierre después.

**Si el campo viene vacío en GHL, el envío falla.** Quedan solo dos plantillas
con una segunda variable —`{{2}}` como fecha y hora—, así que son dos
puntos de falla en vez de siete.

## Cómo enviarlas

Enviar **las 11 juntas**. La aprobación tarda y es el camino crítico de toda la
Ola 2: mientras Meta revisa, se construye la Ola 1.

**Sobre la categoría:** las cuatro de seguimiento son `MARKETING`. Las que hablan
de una reunión que la persona **ya tiene agendada** van como `UTILITY`
(entregan mejor y cuestan menos). Meta recategoriza por su cuenta si no está de
acuerdo; si alguna vuelve como MARKETING se usa igual.

**Regla para que no rechacen las UTILITY:** el texto tiene que hablar solo de la
cita existente. Nada de vender, ni de cupos, ni de "aprovecha".

---

## Bloque 1 · Seguimiento sin agenda (4)

**El link va solo en el primer mensaje.** Es el único que cambia según el
calendario; los otros dos son iguales para todos, porque el link ya quedó en el
chat y a esa altura lo que se busca es una respuesta, no un clic.

### `v3_ghost_1_ads` · MARKETING · `{{1}}` nombre · origen `ads`

```
Hola {{1}}! Somos del equipo de Japi Eaters 🙌

Vimos que completaste tu postulación al programa ÉxiTO en Alimentación Infantil, pero no alcanzaste a elegir tu horario para la llamada.

¿Pasó algo o simplemente se te cerró la página?

Te dejamos el link acá 👉 https://www.japieaters.app/agendatullamada

Cualquier duda, respóndenos por acá.
```

### `v3_ghost_1_org` · MARKETING · `{{1}}` nombre · origen `org-bio` y `org-setter`

```
Hola {{1}}! Somos del equipo de Japi Eaters 🙌

Vimos que completaste tu postulación al programa ÉxiTO en Alimentación Infantil, pero no alcanzaste a elegir tu horario para la llamada.

¿Pasó algo o simplemente se te cerró la página?

Te dejamos el link acá 👉 https://www.japieaters.app/or/agendatullamada

Cualquier duda, respóndenos por acá.
```

### `v3_ghost_2` · MARKETING · `{{1}}` nombre · sirve para los dos

```
Hola {{1}}, seguimos atentos por si necesitas algo 🙌

¿No te acomodan los horarios disponibles?

Cuéntanos por acá y te ayudamos. El link para elegir tu hora te quedó en el mensaje anterior.
```

### `v3_ghost_3` · MARKETING · `{{1}}` nombre · sirve para los dos · último toque

```
Hola {{1}}, cuéntanos si finalmente deseas agendar tu reunión.

Ya liberamos varias horas para esta semana y quedan pocos cupos por convocatoria.

Si este no es tu momento también está bien: respóndenos y cerramos tu postulación 🙌
```

---

## Bloque 2 · Bienvenida de Josefina y confirmación (6)

### `v3_bienvenida_jose` · UTILITY · **con botón**
**Variables:** `{{1}}` nombre · **Botón:** `Ver vídeo` (quick reply)

```
Hola {{1}}! 👋 Te escribe Josefina, Fundadora de Japi Eaters 🥕

Antes de nuestra reunión te voy a mandar 3 indicaciones muy importantes para tu proceso de postulación.

Toca "Ver vídeo" para enviártelas 🙌
```

### `v3_bienvenida_nudge` · UTILITY
**Variables:** `{{1}}` nombre · **Se envía:** 2 min sin clic

```
Ojo {{1}} 👀

Si no tocas "Ver vídeo", tu hora queda sin confirmar y se libera automáticamente.

Son 15 segundos 🙌
```

### `v3_confirma_hora` · UTILITY · **con vídeo y dos botones**
**Cabecera:** vídeo (las 3 indicaciones de Josefina)
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora
**Botones:** `Sí, confirmo` · `Cancelar` (quick reply)

```
Eso era todo {{1}} 🥦

Ahora ya sabes cómo va a ser la reunión y qué tener a mano.

¿Te dejo confirmada tu hora del {{2}}?
```

### `v3_cancelo_reagenda_ads` · UTILITY
**Variables:** `{{1}}` nombre · **Se envía:** al tocar Cancelar, origen `ads`

```
Sin problema {{1}} 🙌

Si fue el horario, acá puedes elegir uno que te acomode de verdad: https://www.japieaters.app/agendatullamada

Y si prefieres dejarlo para más adelante, también está bien.
```

### `v3_cancelo_reagenda_org` · UTILITY
**Variables:** `{{1}}` nombre · **Se envía:** al tocar Cancelar, origen `org-bio` u `org-setter`

```
Sin problema {{1}} 🙌

Si fue el horario, acá puedes elegir uno que te acomode de verdad: https://www.japieaters.app/or/agendatullamada

Y si prefieres dejarlo para más adelante, también está bien.
```

### `v3_traspaso_equipo` · UTILITY
**Variables:** `{{1}}` nombre · **Se envía:** al confirmar — activa el morado

```
Supeer {{1}}! Ahora te va a escribir mi equipo y desde ahora en adelante por aquí solo te llegarán mensajes automáticos para que no olvides la reunión 🙌
```

---

## Bloque 3 · Recordatorio de 24 h (1)

### `v3_recordatorio_24h` · UTILITY · **con un solo botón**
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora
**Botón:** `Confirmo mi asistencia` — **uno solo, sin "reagendar"**

```
Hola {{1}}, recuerda que nos vemos {{2}} 🙌

¿Nos confirmas por aquí si podrás asistir?

Y si te surgió algo, escríbenos por acá y lo movemos sin problema.
```

### Por qué un solo botón y la salida por texto

**La asimetría es a propósito.** Confirmar cuesta un toque; avisar que no puede
cuesta escribir una línea. No es para atraparla: ese pequeño esfuerzo filtra.
Quien de verdad no puede, escribe. Quien solo está dudando no se molesta y
termina yendo. Un botón de cancelar convierte la duda en cancelación.

**Pero la salida tiene que existir.** Un no-show quema 45 minutos del equipo;
una cancelación con 24 horas de aviso libera el cupo. Por eso la última línea
invita a escribir.

**Y una respuesta vale más que un toque.** Quien escribe *"no puedo, se me
complicó"* se puede rescatar a un nuevo horario ahí mismo, y además abre la
ventana de 24 h para que Anaís conteste libre desde el verde. Quien toca
"Cancelar" se va sin conversación.

Queda pendiente la opinión de Seba, pero conviene mandarla así igual: agregar
un botón después obliga a re-aprobar la plantilla, quitarlo no.

---

## Resumen para el gestor

| Plantilla | Categoría | Variables | Botones / media |
|---|---|---|---|
| `v3_ghost_1_ads` | MARKETING | 1 | — |
| `v3_ghost_1_org` | MARKETING | 1 | — |
| `v3_ghost_2` | MARKETING | 1 | — |
| `v3_ghost_3` | MARKETING | 1 | — |
| `v3_bienvenida_jose` | UTILITY | 1 | botón `Ver vídeo` |
| `v3_bienvenida_nudge` | UTILITY | 1 | — |
| `v3_confirma_hora` | UTILITY | 2 | vídeo + `Sí, confirmo` / `Cancelar` |
| `v3_cancelo_reagenda_ads` | UTILITY | 1 | — |
| `v3_cancelo_reagenda_org` | UTILITY | 1 | — |
| `v3_traspaso_equipo` | UTILITY | 1 | — |
| `v3_recordatorio_24h` | UTILITY | 2 | botón `Confirmo mi asistencia` |

## Plantillas actuales

`wa_recordatorio_8h` y `wa_recordatorio_1h` se mantienen tal cual.

`ghost_agenda_ads`, `v2_confirmar_jose` y `wa_confirmacion_agenda_organica`
quedan **en desuso** cuando la Ola 2 se publique. No se borran.
