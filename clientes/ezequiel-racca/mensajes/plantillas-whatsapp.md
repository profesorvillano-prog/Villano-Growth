# Plantillas de WhatsApp · Sana tu Autoinmune

Adaptación de las plantillas de Dachshund Salud al embudo de la consulta de
Ezequiel. **Más simples que las de Marcelo:** no piden datos por chat, porque
en autoinmunes no hace falta el trabajo previo de ficha que sí requiere un perro
(marca de alimento, peso, fotos de cuerpo entero).

## Reglas aplicadas

- **Nunca "Dr."**: Ezequiel es odontólogo, no médico. Firma como *Ezequiel*.
- Sin pedir datos por chat. La preparación se sugiere, no se exige.
- Sin guiones largos, igual que la landing.
- Género neutro (los avatares son mayoritariamente mujeres, pero no siempre).
- Un emoji como máximo por mensaje.

## A reemplazar antes de cargar

- `[URL-AGENDA-CONSULTA]` y `[URL-AGENDA-ASESORIA]`: las URLs reales de los
  pasos de agenda en GoHighLevel.

---

## 1. `consulta_agendada_confirmacion`

**Dispara:** al confirmarse la reserva de la consulta.
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora

```
Hola {{1}}, soy Ezequiel 👋

Tu Consulta de Evaluación Autoinmune quedó agendada para {{2}}.

Es una hora, uno a uno, por videollamada. El enlace te llega por correo y te lo recuerdo por aquí.

Si tienes análisis recientes, déjalos a mano ese día. No hace falta que prepares nada más.

Nos vemos.
```

---

## 2. `asesoria_confirmacion_sin_consulta`

**Dispara:** al confirmarse la primera sesión de quien entra directo a la asesoría.
**Variables:** `{{1}}` nombre · `{{2}}` fecha y hora

```
Hola {{1}}, soy Ezequiel 👋

Te doy la bienvenida a la Asesoría. Tu primera sesión quedó agendada para {{2}}.

Por aquí vamos a acompañarte durante todo el proceso, no solo en las sesiones.

Si antes te surge cualquier duda, escríbeme por este mismo chat.

Empecemos.
```

---

## 3. `consulta_pagada_sin_agenda`

**Dispara:** pagó la consulta y no eligió horario.
**Variables:** `{{1}}` nombre

```
Hola {{1}}, soy Ezequiel 👋

Recibí tu pago de la Consulta de Evaluación Autoinmune, pero veo que todavía no eliges tu horario.

Tu cupo está reservado y no vence.

Cuando quieras tomarlo, es aquí: [URL-AGENDA-CONSULTA]

Y si prefieres que te sugiera un horario, dime qué días te acomodan y lo agendo por ti.
```

---

## 4. `asesoria_pagada_sin_agenda`

**Dispara:** pagó la asesoría y no eligió horario.
**Variables:** `{{1}}` nombre

```
Hola {{1}}, soy Ezequiel 👋

Tu cupo en la Asesoría está pagado y guardado, pero falta que elijas la hora de tu primera sesión.

Puedes tomarla aquí: [URL-AGENDA-ASESORIA]

Si ninguno de los horarios te sirve, dime qué días te acomodan y lo vemos.
```

---

## 5. `recordatorio_sesion_24h`

**Dispara:** 24 horas antes.
**Variables:** `{{1}}` nombre · `{{2}}` día · `{{3}}` hora · `{{4}}` nombre de la sesión

```
Hola {{1}}, te recuerdo que mañana {{2}} a las {{3}} tenemos tu {{4}}.

Nos vemos mañana.
```

---

## 6. `recordatorio_sesion_4h`

**Dispara:** 4 horas antes.
**Variables:** `{{1}}` nombre · `{{2}}` hora

> Cambio respecto a la versión de Marcelo: se quita el "si surge un imprevisto lo
> movemos". Recordar que se puede reagendar, justo antes de la sesión, invita a
> hacerlo. En su lugar, una línea que prepara para aprovechar la hora.

```
Hola {{1}}, ¿cómo vas? Hoy a las {{2}} nos vemos.

Búscate un rato tranquilo y con buena señal, que la hora se pasa rápido.
```

---

## 7. `recordatorio_sesion_1h`

**Dispara:** 1 hora antes. **Nuevo**, entrega el enlace.
**Variables:** `{{1}}` nombre · `{{2}}` enlace de la videollamada

```
Hola {{1}}, en una hora nos vemos.

Entras por aquí: {{2}}

Te espero.
```

> Si Meta rechaza la URL como variable en el cuerpo, la alternativa es dejar el
> enlace en un botón de tipo "Visitar sitio web" con variable en la URL.

---

### Fuentes
Plantillas de Dachshund Salud (Marcelo Hernán); `../docs/Mensajes-Angulos-y-Copy.md`;
`../landing-consulta.html`; `../embudo/`.
