# Plantillas de WhatsApp v3 — para enviar a aprobación

> Las 9 plantillas nuevas del número **verde** (`+52`, WhatsApp Business API).
> El número morado es texto libre y **no necesita plantillas**.
>
> Se crean **nuevas**, no se editan las actuales: las aprobadas siguen
> corriendo hasta que el flujo v2 esté publicado.
>
> Copy: [`Guion-WhatsApp-Dos-Numeros.md`](./Guion-WhatsApp-Dos-Numeros.md) ·
> Dónde se usa cada una: [`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md)

## Cómo enviarlas

Enviar **las 9 juntas hoy**. La aprobación tarda y es el camino crítico de toda
la Ola 2: mientras Meta revisa, se construye la Ola 1.

**Sobre la categoría:** las de seguimiento para que agenden son claramente
`MARKETING`. Las que hablan de una reunión que la persona **ya tiene agendada**
las propongo como `UTILITY` (entregan mejor y cuestan menos). Meta recategoriza
por su cuenta si no está de acuerdo, así que si alguna vuelve como MARKETING no
es un problema: se usa igual.

**Regla para que no rechacen las UTILITY:** el texto tiene que hablar solo de la
cita existente. Nada de vender, ni de cupos, ni de "aprovecha". Esa diferencia
está respetada abajo.

## Dos reglas del gestor que hacen rebotar plantillas

**El body no puede empezar ni terminar con una variable.** Meta lo rechaza con
*"Your body can't start or end with a variable. Add text before or after it"*.
Por eso todas abren con una palabra —"Hola", "Ojo"— y ninguna termina en el
link: siempre hay una línea de cierre después. *(Corregido el 14-09 tras el
rechazo de `v3_ghost_1`.)*

**Si el campo viene vacío en GHL, el envío falla.** Cada variable es un punto
de falla silencioso.

**El `{{2}}` se queda, porque el link cambia según el origen.** Las de anuncios
van al calendario `[A]` y las orgánicas al `[ORG]`. En vez de duplicar las
plantillas, la variable se mapea a **`{{contact.link_agenda}}`**, un campo que
los workflows de entrada rellenan con el link que le toca a cada una. Una sola
plantilla, el link siempre correcto — el mecanismo completo está en
[`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md), sección *El
link de agenda*.

---

## Bloque 1 · Seguimiento de postulación sin agenda (3)

Voz de **equipo**, tercera persona del plural. Nunca el nombre del closer.

### `v3_ghost_1` · MARKETING
**Variables:** `{{1}}` nombre · `{{2}}` link de agenda

```
Hola {{1}}! Somos del equipo de Japi Eaters 🙌

Vimos que completaste tu postulación al programa ÉxiTO en Alimentación Infantil, pero no alcanzaste a elegir tu horario para la llamada.

¿Pasó algo o simplemente se te cerró la página?

Te dejamos el link acá 👉 {{2}}

Cualquier duda, respóndenos por acá 💜
```

### `v3_ghost_2` · MARKETING
**Variables:** `{{1}}` nombre · `{{2}}` link de agenda

```
Hola {{1}}, estamos atentos para ayudarte en lo que necesites 🙌

¿No te acomodan los horarios disponibles?

Acá te dejamos el link de nuevo 👉 {{2}}

Elige el horario que más te sirva 💜
```

### `v3_ghost_3` · MARKETING
**Variables:** `{{1}}` nombre · `{{2}}` link de agenda

```
Hola {{1}}, cuéntanos si finalmente deseas agendar tu reunión 💜

Ya liberamos varias horas para esta semana y quedan pocos cupos por convocatoria.

Puedes elegir la tuya acá 👉 {{2}}

Si este no es tu momento también está bien: avísanos y cerramos tu postulación 🙌
```

---

## Bloque 2 · Bienvenida de Josefina y confirmación (5)

### `v3_bienvenida_jose` · UTILITY · **con botón**
**Variables:** `{{1}}` nombre · **Botón:** `Ver vídeo` (Quick reply)

```
Hola {{1}}! 👋 Te escribe Josefina, Fundadora de Japi Eaters 🥕

Antes de nuestra reunión te voy a mandar 3 indicaciones muy importantes para tu proceso de postulación.

Toca "Ver vídeo" para enviártelas 🙌
```

### `v3_bienvenida_nudge` · UTILITY
**Variables:** `{{1}}` nombre

```
Ojo {{1}} 👀

Si no tocas "Ver vídeo", tu hora queda sin confirmar y se libera automáticamente.

Son 15 segundos 🙌
```

### `v3_confirma_hora` · UTILITY · **con vídeo y dos botones**
**Cabecera:** vídeo (las 3 indicaciones de Josefina)
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora
**Botones:** `Sí, confirmo` · `Cancelar` (Quick reply)

```
Eso era todo {{1}} 🥦

Ahora ya sabes cómo va a ser la reunión y qué tener a mano.

¿Te dejo confirmada tu hora del {{2}}?
```

### `v3_cancelo_reagenda` · UTILITY
**Variables:** `{{1}}` nombre · `{{2}}` link de agenda

```
Sin problema {{1}} 🙌

Si fue el horario, acá puedes elegir uno que te acomode de verdad: {{2}}

Y si prefieres dejarlo para más adelante, también está bien 💜
```

### `v3_traspaso_equipo` · UTILITY
**Variables:** `{{1}}` nombre

```
Supeer {{1}}! Ahora te va a escribir mi equipo y desde ahora en adelante por aquí solo te llegarán mensajes automáticos para que no olvides la reunión 💜
```

---

## Bloque 3 · Recordatorio de 24 h (1)

### `v3_recordatorio_24h` · UTILITY · **con un solo botón**
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora
**Botón:** `Confirmo mi asistencia` (Quick reply) — **uno solo, sin "reagendar"**

```
Hola {{1}}, recuerda que nos vemos {{2}} 🙌

¿Nos confirmas por aquí si podrás asistir?
```

> **Por qué un solo botón.** Anaís teme que ofrecer "reagendar" siembre la
> reagenda, y tiene razón: pedir confirmación no siembra la cancelación,
> ofrecer el botón de reagendar sí. Quien no toca el botón entra a seguimiento
> manual del morado, donde el closer puede ofrecer reagendar si la lead lo
> plantea. Queda pendiente la opinión de Seba, pero la plantilla se puede
> mandar así: agregar un botón después obliga a re-aprobar, quitarlo no.

---

## Resumen para el gestor de plantillas

| Plantilla | Categoría | Variables | Botones / media |
|---|---|---|---|
| `v3_ghost_1` | MARKETING | 2 | — |
| `v3_ghost_2` | MARKETING | 2 | — |
| `v3_ghost_3` | MARKETING | 2 | — |
| `v3_bienvenida_jose` | UTILITY | 1 | botón `Ver vídeo` |
| `v3_bienvenida_nudge` | UTILITY | 1 | — |
| `v3_confirma_hora` | UTILITY | 2 | vídeo + `Sí, confirmo` / `Cancelar` |
| `v3_cancelo_reagenda` | UTILITY | 2 | — |
| `v3_traspaso_equipo` | UTILITY | 1 | — |
| `v3_recordatorio_24h` | UTILITY | 2 | botón `Confirmo mi asistencia` |

## Plantillas actuales que se siguen usando

`wa_recordatorio_8h` y `wa_recordatorio_1h` se mantienen tal cual: el
recordatorio de 8 h y el de 1 h no cambian de voz ni de número.

`ghost_agenda_ads`, `v2_confirmar_jose` y `wa_confirmacion_agenda_organica`
quedan **en desuso** cuando la Ola 2 se publique. No se borran: se dejan de
usar en los workflows nuevos.
