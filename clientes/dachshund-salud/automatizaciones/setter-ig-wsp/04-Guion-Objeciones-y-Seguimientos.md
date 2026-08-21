# 04 · Guion, mensajes fijos y seguimientos

> La IA improvisa la conversación. **Estos mensajes no**: son los que manda Make
> directo desde el escenario, siempre iguales, porque llevan links, plata o
> derivaciones y no pueden salir distintos cada vez.
> Todos respetan las reglas de copy de la casa: frases cortas, sin guiones largos,
> sin palabras de vendedor, sin testimonios inventados.

---

## 1. Mensaje de apertura (primer contacto entrante)

Lo manda la IA, pero conviene tener la versión base. Se adapta según de dónde
viene el lead (campo `fuente` del webhook).

**Genérico**
```
Hola, soy [NOMBRE_ASISTENTE], del equipo del Dr. Marcelo 🐾
Contame qué está pasando con tu salchicha.
```

**Viene de un anuncio de piel/dermatitis**
```
Hola, soy [NOMBRE_ASISTENTE], del equipo del Dr. Marcelo.
Vi que te interesó lo de la piel. ¿Qué le está pasando a tu salchicha?
```

**Viene del Scanner de Vitalidad**
```
Hola, soy [NOMBRE_ASISTENTE], del equipo del Dr. Marcelo.
Vi tu resultado del escáner. ¿Qué es lo que más te preocupa hoy de tu salchicha?
```

**Viene de los eBooks (ya compró)**
```
Hola, soy [NOMBRE_ASISTENTE], del equipo del Dr. Marcelo.
Vi que ya tenés el material. ¿Cómo va con tu salchicha, en qué te trabaste?
```

> Ninguna abre con "¿en qué te puedo ayudar?". Esa pregunta la contesta cualquiera
> con "nada, gracias".

---

## 2. Mensaje de oferta de la consulta (ruta B del router)

La IA escribe el puente. Make agrega este bloque fijo con el link:

```
Perfecto. Acá va el link para reservar tu Consulta de Evaluación con Marcelo:

[LINK_PAGO]

Son [PRECIO_CONSULTA] y dura entre 45 y 60 minutos por videollamada.
Apenas se confirma el pago te llega el link para elegir día y hora.
```

**Regla:** este mensaje sale **solo** después de que la persona dijo que sí.
Nunca antes.

---

## 3. Mensaje del Pack (ruta C, lead bronze)

```
Te paso el link del pack:

[LINK_PACK]

Ahí está el método completo por escrito: la dieta paso a paso, la lista de
alimentos permitidos y prohibidos, y cómo hacer la transición sin que le caiga mal.
Cualquier duda me escribís.
```

---

## 4. Mensaje de derivación clínica (ruta D)

Lo escribe la IA, pero este es el piso mínimo que tiene que decir. Make además le
avisa a Marcelo.

```
Eso necesita un veterinario presencial hoy, no mañana.
Andá a una clínica y que lo revisen. Cuando esté estable escribinos de nuevo:
la alimentación va a ser clave en su recuperación y ahí Marcelo te acompaña.
```

**Nunca** se le ofrece la consulta a un caso derivado en el mismo mensaje. Se
reactiva a los 10 días con un mensaje aparte:

```
Hola [nombre], te escribo para saber cómo siguió [nombre del perro].
¿Cómo está?
```

---

## 5. Seguimientos (Escenario 2)

Cuatro y se terminó. Cada uno pregunta algo distinto y agrega algo nuevo. Ninguno
dice "solo quería saber si viste mi mensaje".

### FU1 · 2 horas sin respuesta, conversación a medias
```
[nombre], quedé con la duda de lo de [nombre del perro].
¿Qué es lo que más te preocupa hoy?
```

### FU2 · 24 horas
```
Te cuento un caso parecido al de [nombre del perro]:
Max, salchicha de 7 años con dermatitis crónica, ya había pasado por dermatólogos,
corticoides y Apoquel. Con el cambio de alimentación la piel se le recuperó en 35 días.
Cada caso es distinto, pero el patrón se repite mucho. ¿Seguimos?
```

### FU3 · 72 horas · **sale como plantilla desde GHL, no como texto libre**
```
[nombre], la decisión es simple y la tenés que tomar igual:
o seguís probando cosas a ver si alguna pega, o alguien mira el caso completo
de [nombre del perro] una vez y te dice qué hacer.
Si querés hacer lo segundo, avisame y te paso el link.
```

### FU4 · 7 días · última, y cambia de oferta
```
Última que te escribo por acá, no quiero ser pesada.
Si por ahora no es el momento de la consulta, Marcelo dejó el método completo por
escrito en el pack de eBooks: [LINK_PACK]
Y cuando quieras retomar, acá estamos 🐾
```

Después del FU4: `estado = frio`. El bot no vuelve a escribir nunca por su cuenta.

### Seguimiento post-link sin pago (rama aparte)

**1 hora después del link**
```
¿Pudiste abrir el link? Si te dio algún problema con el pago avisame y lo vemos.
```

**24 horas después del link**
```
[nombre], te reservo el cupo de esta semana o lo dejamos para más adelante?
Marcelo atiende de lunes a viernes de 15 a 19 hora de Chile.
```

> ⚠️ Nada de "quedan 2 cupos" ni cuentas regresivas inventadas. La urgencia honesta
> del doc de oferta es real (Marcelo atiende personalmente y tiene agenda finita);
> la urgencia falsa es la que quema la marca.

---

## 6. Mensaje post-pago (lo dispara GHL, no Make)

Cuando entra el pago, el Workflow de GHL manda:

```
Listo [nombre], tu consulta está confirmada 🐾

1. Elegí día y hora acá: [LINK_AGENDA]
2. Respondeme estas 3 cosas así Marcelo llega con el caso leído:
   · foto de la bolsa de comida que le das hoy (la etiqueta)
   · peso aproximado de [nombre del perro]
   · si toma algún medicamento, cuál

Nos vemos en la consulta.
```

Recordatorios de la consulta: 24 h antes y 1 h antes, ambos desde GHL.

---

## 7. Aviso a Marcelo (interno)

Va a su WhatsApp personal (+56 9 3644 7104) o a un canal interno. Se dispara en
handoff, en derivación clínica y en cada pago.

```
[SETTER] {{tipo}}

Lead: {{nombre_dueno}} ({{canal}})
Perro: {{nombre_perro}}, {{edad_perro}}
Motivo: {{sintoma}} (hace {{hace_cuanto}})
Come: {{come_hoy}}
Ya intentó: {{ya_intento}}
Temperatura: {{temperatura}}

Nota: {{nota_para_marcelo}}
Conversación: https://app.gohighlevel.com/...{{contactId}}
```

Cuando el tipo es `handoff`, el mensaje agrega: `El bot quedó en pausa para este
contacto. Se reactiva desde el tag.`

---

## 8. Errores y bordes

| Situación | Qué manda el bot |
|---|---|
| Falla la API de IA | `Se me cortó la conexión un segundo. ¿Me repetís lo último?` |
| Llega un audio | `No puedo escuchar audios por acá. ¿Me lo escribís cortito?` |
| Llega una foto | `Gracias por la foto. Esas las revisa Marcelo en la consulta. Contame mientras qué es lo que más te preocupa.` |
| Escriben de madrugada | La IA agrega `Mañana Marcelo revisa tu caso` en vez de prometer inmediatez |
| Piden hablar con Marcelo ya | `Marcelo atiende de 15 a 19 hora de Chile y su agenda va por consulta. Contame el caso y vemos cómo te ayudamos.` |
| Piden diagnóstico por chat | `Eso no lo puedo responder por acá sin ver el caso completo, y darte una respuesta al voleo sería peor. Es justo lo que se revisa en la consulta.` |

---

## 9. Qué revisar cada semana

1. Leer 10 conversaciones completas. No los KPIs: las conversaciones.
2. Marcar dónde se cae la gente. Casi siempre es el mismo mensaje.
3. Anotar las preguntas que el bot no supo responder y sumarlas al prompt.
4. Revisar que ninguna respuesta haya roto las 14 reglas duras.
5. Contar cuántas derivaciones clínicas hubo: si son muchas, el problema está en
   la segmentación de los ads, no en el bot.
