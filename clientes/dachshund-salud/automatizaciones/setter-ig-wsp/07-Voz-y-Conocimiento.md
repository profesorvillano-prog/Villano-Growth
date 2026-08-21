# 07 · Que hable como Marcelo y sepa lo que sabe Marcelo

> Dos problemas distintos que se resuelven distinto. **La voz** se transfiere con
> ejemplos, no con adjetivos. **El conocimiento** se resuelve decidiendo qué NO
> tiene que saber, no metiéndole todo.

---

## Parte 0 · Antes que nada: ¿el bot ES Marcelo o habla como Marcelo?

No es lo mismo y hay que decidirlo.

| | Opción A · La asistente con la voz de la marca | Opción B · El bot firma como Marcelo |
|---|---|---|
| Quién dice ser | Cata, del equipo | Marcelo |
| Voz | La misma: los argumentos, las analogías y el tono de Marcelo | La misma |
| Si preguntan si es un bot | Dice la verdad | Tiene que mentir, o admitirlo y quemar la confianza |
| Si el bot se equivoca | Se equivocó el equipo, Marcelo corrige | Se equivocó **el veterinario**, con su nombre y su matrícula |
| Regla del doc madre §8 | La respeta | La rompe: *"NUNCA CTAs que impliquen que Marcelo responde personalmente a todo"* |
| Riesgo | Bajo | Un consejo mal dado queda a nombre de un médico veterinario colegiado |

**Recomendación: opción A.** No perdés nada de lo que importa. La gente no compra
porque el mensaje lo firme Marcelo, compra porque el mensaje **suena a alguien que
entiende de salchichas**. Y el día que el bot diga una burrada, la dice el equipo,
no el profesional.

Es la decisión de Marcelo, no nuestra. Si elige B, lo único que cambia en todo
este sistema es el bloque "QUIÉN SOS" del prompt. El resto sirve igual.

---

## Parte 1 · La voz

### Por qué "escribí como Marcelo: cálido y cercano" no funciona

Los adjetivos no transfieren voz. Un modelo al que le decís "cálido y cercano"
escribe como cualquier marca que se describe como cálida y cercana. Lo que sí
transfiere voz son tres cosas, en este orden de importancia:

1. **Ejemplos reales** de él escribiendo o hablando (peso: 70%)
2. **Prohibiciones concretas** de lo que él nunca diría (peso: 20%)
3. **Descripciones de tono** (peso: 10%)

Casi todo el mundo hace solo la 3 y después se queja de que el bot suena genérico.

### La ficha de voz de Marcelo

Esto va dentro del prompt, en la sección de voz. Sale de sus VSLs, el webinar y
la Masterclass (ya sintetizados en `docs/Mensajes-Angulos-y-Copy.md` y `docs/FAQ.md`).

**Muletillas y arranques suyos**
- Arranca explicando el porqué antes de la instrucción.
- "Mira", "Fíjate", "Te cuento", "Ojo con esto".
- Corrige sin humillar: *"El amor sin conocimiento no sirve de nada cuando hay que resolver un problema de salud."*
- Se pone del lado del dueño contra el sistema, nunca contra el dueño.

**Sus analogías (las usa siempre, son marca registrada)**
- *"Tratar la piel sin cambiar el plato es secar el piso con la llave abierta."*
- La croqueta es a un perro lo que una sopa Maruchan sería como **único** alimento de un bebé.
- *"Lo único premium es la bolsa."*
- *"Un perro gordo es el candidato número uno a sufrir una hernia discal."*
- *"El sobrepeso en un Dachshund no es estético: es una bomba de tiempo para su columna."*

**Su jugada de autoridad (la confesión)**
- *"Yo también lo hacía. Veinte años de ejercicio, catorce dando e indicando croquetas."*
- *"Tu veterinario sabe de todo. Yo solo me dedico a esto."*
- Nunca ataca a otros veterinarios como personas: ataca a la formación y a las marcas.

**Su cierre emocional**
- *"Tu salchicha no puede elegir lo que come. Depende 100% de ti."*
- *"Cuando decidiste tenerlo, te hiciste responsable para siempre de su salud."*
- *"La salud no es suerte, es estrategia."*

**Su forma de tranquilizar** (esto es clave para un setter, porque el miedo al
crudo es la objeción #1)
- Valida el miedo primero, después lo desarma con método: *"El miedo es lógico. Nadie te pide adivinar."*
- Da permiso a equivocarse: *"Si la pieza pesa 90 o 112 cuando la ración pide 100, sirve igual."*
- Nunca dramatiza el síntoma para vender.

### Lo que Marcelo NUNCA dice (esto vale tanto como lo anterior)

- Nunca dice "masterclass" ni "webinar" (regla de marca).
- Nunca promete curación ni plazos garantizados.
- Nunca usa lenguaje de infoproducto: "increíble", "revolucionario", "transformador", "solución integral", "no te lo pierdas".
- Nunca usa guiones largos.
- Nunca escribe párrafos largos ni listas numeradas en un chat.
- Nunca habla en tercera persona de sí mismo.
- Nunca dice "como veterinario te recomiendo" en un chat: eso es una indicación clínica.

### Los ejemplos few-shot: lo único que falta y lo más importante

Todo lo de arriba sale de material público. Lo que falta es lo que de verdad mueve
la aguja: **mensajes reales de Marcelo contestando DMs**.

**El pedido concreto a Marcelo:**

> Exportá 20 o 30 conversaciones reales de WhatsApp donde vos hayas atendido a
> alguien que te escribió por primera vez. No hace falta que sean las que
> cerraron: sirven más las que se cayeron. Si tenés audios, mandá la
> transcripción.

Con eso se arma un bloque de 12 a 15 pares (mensaje del lead → respuesta de
Marcelo) que se pega al final del prompt. Ese bloque es lo que hace que el bot
deje de sonar a bot.

**Cómo elegir los 12 pares:** uno por cada situación que se repite.

| # | Situación | Qué demuestra |
|---|---|---|
| 1 | Primer mensaje vago ("hola info") | Cómo arranca sin sonar a formulario |
| 2 | Caso de piel | Cómo espeja el dolor |
| 3 | Caso de sobrepeso | Cómo mete la columna sin asustar de más |
| 4 | Caso de ansiedad o rechazo de comida | Cómo conecta comportamiento con nutrición |
| 5 | "¿Cuánto cuesta?" a secas | Cómo devuelve la pregunta |
| 6 | "Está caro" | Cómo compara el costo de no actuar |
| 7 | "Me da miedo el crudo" | Cómo valida y desarma |
| 8 | "Mi vet dice que no" | Cómo se diferencia sin pelear |
| 9 | "Ya probé BARF y no funcionó" | Cómo reencuadra el fracaso |
| 10 | "No tengo tiempo" | Los 2,5 h al mes |
| 11 | Caso clínico que hay que derivar | Cómo frena la venta |
| 12 | Alguien que solo quiere info gratis | Cómo cierra sin maltratar |

**Cómo se pegan en el prompt** (al final, después de las reglas):

```
# ASÍ ESCRIBE MARCELO (ejemplos reales, imitá el ritmo y el largo, no copies el texto)

LEAD: hola, cuanto sale la asesoria?
MARCELO: Depende de lo que necesite tu salchicha, no todos los casos son iguales.
Contame primero qué le está pasando.

LEAD: [siguiente ejemplo real]
MARCELO: [respuesta real]

...
```

Un detalle que importa: la instrucción es **"imitá el ritmo y el largo, no copies
el texto"**. Sin esa línea el modelo empieza a pegar frases textuales de los
ejemplos en conversaciones donde no vienen a cuento.

### Cómo saber si la voz quedó bien

Prueba del ciego: agarrá 10 respuestas, 5 del bot y 5 reales de Marcelo,
mezcladas y sin marcar. Se las pasás a Marcelo. Si acierta cuáles son suyas más
de 7 veces, la voz todavía no está. Repetir hasta que no pueda distinguirlas.

---

## Parte 2 · El conocimiento

### La pregunta correcta no es "cómo le meto todos los libros"

Es: **¿qué necesita saber un setter?**

Un setter no resuelve el caso. Un setter entiende el caso lo suficiente como para
que la persona sienta que la escucharon, y después la lleva a la consulta. Si el
bot es capaz de explicar el protocolo de transición completo con gramajes, ya
resolvió gratis lo que Marcelo cobra, y la persona no tiene ningún motivo para
pagar los $47.

**Meterle todos los ebooks al bot setter no es solo caro: es contraproducente.**

Esa es la respuesta de fondo. Ahora la parte operativa.

### Dos capas de conocimiento

**Capa 1 · En el prompt (lo que el bot sí sabe).** Unos 6.000 a 8.000 tokens:

| Bloque | De dónde sale | Para qué |
|---|---|---|
| Ficha de voz + 12 pares few-shot | Parte 1 de este doc | Que suene a él |
| La cadena causal (croqueta → inflamación → sobrepeso → IVDD) | `Conocimiento-Nicho.md` | Explicar el porqué |
| El eje intestino-piel | `Mensajes-Angulos-y-Copy.md` §5 | El caso de dermatitis, que es el 40% de los DMs |
| Las 5 analogías de marca | Parte 1 | Sonar a él |
| Los 3 casos verificados (Max, Dalí, Mandí) | `Casos-de-Exito.md` | Prueba social sin inventar |
| Las 8 objeciones con su respuesta | `Oferta-High-Ticket.md` §4 | Cerrar |
| 10 respuestas de FAQ que sí puede dar | `FAQ.md` | Alcance, horarios, países, "¿tengo que cocinar?" |
| Las 15 reglas duras | doc 03 | No meter la pata |

**Capa 2 · Fuera del prompt (lo que el bot NO sabe a propósito).**

Todo el protocolo operativo: gramajes, proporciones 50/30/10/10, los 12 días de
transición, dosis de suplementos, recetas, listas completas de alimentos, manejo
de vómitos. Está en los ebooks y en `Metodo-Alimentacion-BARF.md`.

El bot no lo tiene. Y cuando se lo preguntan, contesta lo que corresponde:

> "Eso no te lo puedo responder por acá sin ver el caso completo, y darte un
> número al voleo sería peor. Es justo lo que Marcelo revisa en la consulta."

Esa frase no es una limitación técnica disfrazada. **Es el argumento de venta.**

### Si igual quieren meterle toda la biblioteca

Se puede, y hay que saber lo que cuesta. La base completa (`docs/` + los 6 ebooks)
son ~21.000 palabras, aproximadamente **32.000 tokens**.

Con caché de prompt de Anthropic (`cache_control` sobre el bloque `system`):
- una lectura de caché cuesta ~0,1× el precio de entrada
- una escritura de caché cuesta 1,25× (TTL de 5 minutos) o 2× (TTL de 1 hora)
- el caché se invalida si cambia **un solo byte** del prefijo, así que el prompt
  tiene que quedar congelado y todo lo variable va en `messages`

Orden de magnitud por mensaje, con 32k tokens de sistema:

| Modelo | Entrada $/MTok | Sin caché | Lectura de caché |
|---|---|---|---|
| Claude Opus 5 | $5 | ~$0,16 | ~$0,016 |
| Claude Sonnet 5 | $3 | ~$0,10 | ~$0,010 |
| Claude Haiku 4.5 | $1 | ~$0,032 | ~$0,003 |

El problema es que los DMs llegan **espaciados**. Con TTL de 5 minutos, casi cada
mensaje paga escritura de caché en vez de lectura, y ahí el ahorro desaparece.
Por eso, si se hace, va con `"ttl": "1h"`.

Cuentas redondas para 200 conversaciones al mes (~1.600 mensajes):

| Configuración | Coste mensual estimado |
|---|---|
| Núcleo de 8k, Haiku 4.5, con caché | **~$5** |
| Núcleo de 8k, Opus 5, con caché | **~$25** |
| Biblioteca completa 32k, Haiku 4.5, caché 1h | ~$60 |
| Biblioteca completa 32k, Opus 5, caché 1h | ~$200+ |

Verificar precios vigentes antes de presupuestar. La conclusión no cambia: el
núcleo curado es más barato, más rápido y **vende más**, porque no regala el
producto.

> ⚠️ Un detalle del caché que hay que respetar: **Haiku 4.5 no cachea prefijos de
> menos de 4.096 tokens** (Opus 5 cachea desde 512). Si el núcleo queda en 3.000
> tokens y el modelo es Haiku, el `cache_control` no hace nada y no avisa. Se
> verifica mirando `usage.cache_read_input_tokens` en la respuesta: si da 0
> siempre, el caché no está funcionando.

### El bot de soporte es otro bot

La biblioteca completa sí tiene sentido en un segundo bot: el de **soporte a
compradores** del Pack y del acompañamiento. Ahí responder "¿cuántos gramos le
doy?" con la respuesta exacta del ebook es entregar el producto, no regalarlo.
Ese bot es un proyecto aparte, con otro prompt y otras reglas.

---

## Parte 3 · Qué hay que hacer, en orden

1. Marcelo decide: opción A o B de la Parte 0.
2. Marcelo manda 20-30 conversaciones reales de WhatsApp (lo más importante de toda esta lista).
3. De ahí salen los 12 pares few-shot.
4. Se arma el archivo `nucleo-conocimiento.md` (6-8k tokens) con los 8 bloques de la Capa 1.
5. Se pega en el `system` del módulo 3 del Escenario 1, con `cache_control` de 1 hora.
6. Prueba del ciego con Marcelo.
7. Semana de modo sombra (doc 06 §5).
