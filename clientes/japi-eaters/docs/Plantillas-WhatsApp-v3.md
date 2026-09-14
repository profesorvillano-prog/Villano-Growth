# Plantillas de WhatsApp v3 — para enviar a aprobación

> Las 13 plantillas nuevas del número **verde** (`+52`, WhatsApp Business API),
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

Bio y setter comparten calendario, así que son **dos juegos de plantillas de
seguimiento, no tres**.

## Qué implica llevar el link escrito

Al no ser variable, **`02 · Ghost` necesita un if/else por origen**: la rama ADS
manda las tres `_ads`, la rama ORG manda las tres `_org`, y los `org-setter`
salen sin ghost (Valen los trabaja por DM). Lo mismo en `03` para elegir cuál
de los dos `cancelo_reagenda` sale.

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

**Si el campo viene vacío en GHL, el envío falla.** Quedan solo tres plantillas
con una segunda variable —`{{2}}` como fecha y hora—, así que son tres
puntos de falla en vez de siete.

## Cómo enviarlas

Enviar **las 13 juntas**. La aprobación tarda y es el camino crítico de toda la
Ola 2: mientras Meta revisa, se construye la Ola 1.

**Sobre la categoría:** las seis de seguimiento son `MARKETING`. Las que hablan
de una reunión que la persona **ya tiene agendada** van como `UTILITY`
(entregan mejor y cuestan menos). Meta recategoriza por su cuenta si no está de
acuerdo; si alguna vuelve como MARKETING se usa igual.

**Regla para que no rechacen las UTILITY:** el texto tiene que hablar solo de la
cita existente. Nada de vender, ni de cupos, ni de "aprovecha".

---

## Bloque 1 · Seguimiento sin agenda · ADS (3)

Link: `https://www.japieaters.app/agendatullamada` · Voz de **equipo**, tercera persona del plural.

### `v3_ghost_1_ads` · MARKETING · `{{1}}` nombre

```
Hola {{1}}! Somos del equipo de Japi Eaters 🙌

Vimos que completaste tu postulación al programa ÉxiTO en Alimentación Infantil, pero no alcanzaste a elegir tu horario para la llamada.

¿Pasó algo o simplemente se te cerró la página?

Te dejamos el link acá 👉 https://www.japieaters.app/agendatullamada

Cualquier duda, respóndenos por acá.
```

### `v3_ghost_2_ads` · MARKETING · `{{1}}` nombre

```
Hola {{1}}, estamos atentos para ayudarte en lo que necesites 🙌

¿No te acomodan los horarios disponibles?

Acá te dejamos el link de nuevo 👉 https://www.japieaters.app/agendatullamada

Elige el horario que más te sirva.
```

### `v3_ghost_3_ads` · MARKETING · `{{1}}` nombre

```
Hola {{1}}, cuéntanos si finalmente deseas agendar tu reunión.

Ya liberamos varias horas para esta semana y quedan pocos cupos por convocatoria.

Puedes elegir la tuya acá 👉 https://www.japieaters.app/agendatullamada

Si este no es tu momento también está bien: avísanos y cerramos tu postulación 🙌
```

---

## Bloque 2 · Seguimiento sin agenda · ORG (3)

Link: `https://www.japieaters.app/or/agendatullamada` · Mismo texto, solo cambia el link. Sirve para bio y para setter.

### `v3_ghost_1_org` · MARKETING · `{{1}}` nombre

```
Hola {{1}}! Somos del equipo de Japi Eaters 🙌

Vimos que completaste tu postulación al programa ÉxiTO en Alimentación Infantil, pero no alcanzaste a elegir tu horario para la llamada.

¿Pasó algo o simplemente se te cerró la página?

Te dejamos el link acá 👉 https://www.japieaters.app/or/agendatullamada

Cualquier duda, respóndenos por acá.
```

### `v3_ghost_2_org` · MARKETING · `{{1}}` nombre

```
Hola {{1}}, estamos atentos para ayudarte en lo que necesites 🙌

¿No te acomodan los horarios disponibles?

Acá te dejamos el link de nuevo 👉 https://www.japieaters.app/or/agendatullamada

Elige el horario que más te sirva.
```

### `v3_ghost_3_org` · MARKETING · `{{1}}` nombre

```
Hola {{1}}, cuéntanos si finalmente deseas agendar tu reunión.

Ya liberamos varias horas para esta semana y quedan pocos cupos por convocatoria.

Puedes elegir la tuya acá 👉 https://www.japieaters.app/or/agendatullamada

Si este no es tu momento también está bien: avísanos y cerramos tu postulación 🙌
```

---

## Bloque 3 · Bienvenida de Josefina y confirmación (6)

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

## Bloque 4 · Recordatorio de 24 h (1)

### `v3_recordatorio_24h` · UTILITY · **con un solo botón**
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora
**Botón:** `Confirmo mi asistencia` — **uno solo, sin "reagendar"**

```
Hola {{1}}, recuerda que nos vemos {{2}} 🙌

¿Nos confirmas por aquí si podrás asistir?
```

> **Por qué un solo botón.** Pedir confirmación no siembra la cancelación;
> ofrecer el botón de reagendar sí. Quien no toca el botón entra a seguimiento
> manual del morado. Queda pendiente la opinión de Seba, pero conviene mandarla
> así: agregar un botón después obliga a re-aprobar, quitarlo no.

---

## Resumen para el gestor

| Plantilla | Categoría | Variables | Botones / media |
|---|---|---|---|
| `v3_ghost_1_ads` | MARKETING | 1 | — |
| `v3_ghost_2_ads` | MARKETING | 1 | — |
| `v3_ghost_3_ads` | MARKETING | 1 | — |
| `v3_ghost_1_org` | MARKETING | 1 | — |
| `v3_ghost_2_org` | MARKETING | 1 | — |
| `v3_ghost_3_org` | MARKETING | 1 | — |
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
