# Hallazgos al leer el Drive y la cuenta de GHL de Marcelo

> Al construir el cerebro leí el KB, los dos libros, las tres fichas de producto,
> la guía del setter y las transcripciones. Aparecieron cosas que **contradicen**
> lo que estaba escrito en `docs/` y en los documentos del setter que armamos
> antes. Van acá para que se corrijan en la fuente.
> **Agosto 2026.**

---

## 1. La consulta no hay que inventarla: ya existe

En `automatizaciones/setter-ig-wsp/01-Embudo-y-Modelo.md` propuse crear una
"Consulta de Evaluación" de $47 porque en el repo no figuraba ningún producto de
entrada. **Existía y no estaba documentado.** La escalera real es:

| Producto | Precio | Trigger |
|---|---|---|
| Nutrición Dachshund (Libro 1) | **$27** | NUTRICION |
| Recomposición Dachshund (Libro 2) | **$47** | — |
| Consulta Nutricional 60 min | **$97** | — |
| Asesoría Nutricional Dachshund | **$197** | SALUD |
| Método Recomposición Dachshund | **$497** | — |

El "embudo a consulta" es la **Asesoría de $197**: videollamada de 60 minutos con
formulario previo, plan personalizado de 60 días, el Libro 2, guía de FAQ y receta
de antiparasitario. Valor declarado $285, precio $197. Capacidad de 10 clientes
nuevos por semana.

**No hay que crear ningún producto nuevo, ni pasarela, ni calendario.** Todo eso
existe en Hotmart. Eso elimina cuatro de los seis bloqueos que listé en el doc 01.

`docs/Oferta-High-Ticket.md` solo tiene el $497 y un "6 meses personalizado" que
no aparece en ninguna ficha. Hay que actualizarlo.

---

## 2. Vocabulario prohibido que estábamos usando

Las fichas de producto (julio-agosto 2026) traen una lista de frases prohibidas
que **contradice al doc madre** y a lo que yo había escrito en el prompt:

| Estábamos usando | Correcto según las fichas |
|---|---|
| "el único veterinario en habla hispana" | **prohibido**. Usar "Médico Veterinario Funcional dedicado exclusivamente al Dachshund" |
| "familia salchichera" / "familias salchicheras" | **prohibido**. Usar "papás y mamás perrunos" |
| "dieta BARF" | **prohibido**. Usar "dieta natural cruda" |
| "dueño" / "dueña" | "papá perruno" / "mamá perruna" |
| "mascota" | "hijo perruno" / "salchicha" |
| "lomo" | "columna" |

`docs/Marcelo-y-Ecosistema-Productos.md` dice explícitamente que hay que usar "el
único veterinario en habla hispana" y "familia salchichera". Las fichas son
posteriores y dicen lo contrario. **Manda la ficha**, pero hay que arreglar el doc
madre para que no vuelva a colarse.

---

## 3. La operación del setter ya existe en GHL

`Guia del setter - Flujos y Pipeline CRM.pdf` documenta un sistema que ya está
andando. El bot tiene que enchufarse a **eso**, no a la estructura paralela que
propuse en `05-Setup-GHL.md`.

**Los tres CTA** (la gente comenta la palabra en una publicación):

| CTA | Qué lead es | Dónde entra |
|---|---|---|
| **Hansel** | Calificado neutro. Puede terminar en libro o asesoría | Conversación abierta |
| **Salud** | Caso más grave, con enfermedad. Candidato a asesoría | Conversación abierta |
| **Nutrición** | Viene por el libro. Venta directa del ebook | Interesada ebook |

**Pipeline orgánico** (ya creado): Conversación abierta → Interesada ebook →
Interesada asesoría → Follow up 1 → Follow up 2 → Derivada al especialista.
Más un **pipeline de ventas** que se llena solo con webhook de pago.

**Slack:** `#leads`, `#follow-ups`, `#ventas`, `#tareas diarias`.

**Automatizaciones que ya corren:** respuesta automática al comentario, espera de
2 minutos antes del DM, primer DM con las tres preguntas (edad, qué come, qué le
preocupa), timeout de 1 día, follow-up automático, tags de origen y de sin
respuesta.

Consecuencia para el bot: el primer DM y el follow-up del ebook **ya están
automatizados**. El bot entra donde entraba el setter humano, o sea después de que
el lead responde. No hay que rehacer el saludo ni los tags ni el pipeline.

---

## 4. Detalles de la operación que el bot tiene que respetar

- **Las dos fotos.** Se piden después de que contó algo, nunca de entrada junto con
  todo lo demás. Enlazadas con lo que dijo: *"siento mucho que lleve tantos años
  con dermatitis, me ayudaría mucho ver una foto"*.
- **El argumento para casos de salud:** si el perro está enfermo, el libro no es la
  respuesta. *Si tú estuvieras enfermo, no te comprarías un libro, te comprarías un
  acompañamiento.* Se siembra, no se impone. Si aun así quiere el libro, se le
  vende el libro.
- **Nunca marcar una oportunidad como ganada a mano.** El webhook de pago crea la
  oportunidad en el pipeline de ventas. La del orgánico se borra, no se marca.
- **Motivos de perdida:** dejó de responder · inversión · no interesado.

---

## 5. Un dato incómodo sobre el propio Marcelo en chat

De la guía del setter, sobre cuándo derivarle una conversación:

> "Si le pides que cierre, tiende a mandar el link de pago directo y a ser muy
> frontal con el diagnóstico. Eso quema la conversación."

Está escrito por la agencia, sobre Marcelo. Vale la pena tenerlo presente ahora
que el bot escribe con su nombre: el cerebro está calibrado para **no** hacer eso
(no manda el link sin un sí, no diagnostica). O sea que el bot va a ser más
prudente que Marcelo en chat. Es a propósito.

---

## 6. Qué queda desactualizado de lo que armamos antes

| Documento | Estado |
|---|---|
| `01-Embudo-y-Modelo.md` | La consulta de $47 no va. Reemplazar por la escalera real de la sección 1 |
| `03-Prompt-Setter-IA.md` | **Superado por `cerebro/CEREBRO-MARCELO.md`**. El bot ya no es Cata, es Marcelo |
| `04-Guion-...md` | Los mensajes de apertura ya no aplican: ese DM lo manda GHL |
| `05-Setup-GHL.md` | Pipeline y tags nuevos no van. Usar los que ya existen |
| `07-Voz-y-Conocimiento.md` | La parte 0 (asistente vs Marcelo) quedó decidida: Marcelo |
| `02` y `06` y `08` | Siguen válidos |

Los cambios de nombre de pipeline y de tags hay que aplicarlos en el escenario de
Make antes de encender.


---

## 7. Lo que dice la cuenta real de GHL (septiembre 2026)

Leído en vivo con el conector `GHL Subcuentas`, location
`TzjuywpjnaS5aZn5RTs8`. **Contradice tanto la guía del setter como lo que armamos
nosotros.**

### 7.1 El "pipeline orgánico" no existe

`Guia del setter - Flujos y Pipeline CRM.pdf` describe un pipeline orgánico de
seis etapas (Conversación abierta → Interesada ebook → Interesada asesoría →
Follow up 1 → Follow up 2 → Derivada). **En la cuenta hay un solo pipeline.**

**`VENTAS`** (`zJsoqk6LKTzQXu7q4Q8C`, actualizado el 26 de agosto), nueve etapas:

| # | Etapa | ID |
|---|---|---|
| 0 | Venta ebook NUTRICION | `268e08e8-ac81-43da-be39-858217b21766` |
| 1 | Venta eBook RECOMPOSICION | `5b8c27ba-4823-486f-957e-6cba9cda42f2` |
| 2 | Venta PACK eBooks | `9088cf04-3a56-410b-9628-361f8ff419de` |
| 3 | **Venta CONSULTA** | `6078e444-75bc-4813-9ccf-7d6dae86af91` |
| 4 | Pagó Sin agendar | `aa8dbce9-12aa-4a51-b2b7-7b93b327afdd` |
| 5 | Agendada | `4c307782-5618-44d5-bf58-268c06bd5396` |
| 6 | Sesión realizada | `fa72b849-d698-44aa-8120-d3571922d45a` |
| 7 | No asistió | `48e088e4-3ed0-45d3-ae49-a2405da621d7` |
| 8 | **Venta ASESORÍA** | `1ba36cb7-056c-4ae8-95f8-a5fed6a2292f` |

Es un pipeline **post-pago**: arranca en la venta y sigue hasta la sesión. No hay
ninguna etapa para el lead que todavía está conversando.

**Qué implica:**

- `05-Setup-GHL.md` propone crear un pipeline `Consultas Dachshund` de ocho
  etapas. **No hay que crearlo**: duplicaría lo que ya existe.
- La sección 3 de este mismo documento decía "usar el pipeline orgánico que ya
  existe". **Tampoco**: no existe.
- Falta decidir dónde vive el lead **antes** de pagar. O se agregan dos o tres
  etapas al principio de `VENTAS`, o el bot no toca oportunidades y se apoya solo
  en tags hasta que entre el pago. Lo segundo es más simple y no ensucia el
  embudo de ventas.
- `Pagó Sin agendar` → `Agendada` → `Sesión realizada` → `No asistió` confirma que
  el circuito post-pago que asumimos existe y funciona. El bot no tiene que
  tocarlo.
- Las etapas confirman la escalera: ebook Nutrición, ebook Recomposición, Pack,
  **Consulta** y **Asesoría** son productos distintos y se miden por separado.

### 7.2 Los custom fields del setter no existen, pero hay otros que sirven

Ninguno de los once `setter_*` que propone `05-Setup-GHL.md` está creado. Lo que
sí hay (contactos):

| Campo | Key | Tipo | Sirve para |
|---|---|---|---|
| edad | `contact.edad` | TEXT | edad del perro |
| Alimentacion | `contact.alimentacion` | TEXT | qué come hoy |
| diagnosticos | `contact.diagnosticos` | TEXT | síntoma / condición |
| inversion | `contact.inversion` | TEXT | **capacidad de inversión** |
| inversion_reciente | `contact.inversion_reciente` | TEXT | **cuánto ya gastó sin resultado** |
| condicion_corporal | `contact.condicion_corporal` | TEXT | peso |
| costillas · pelaje · energia | `contact.*` | TEXT | señales del Scanner de Vitalidad |
| Lead Score | `contact.lead_score` | NUMERICAL | scoring |
| Tier | `contact.tier` | TEXT | equivale a nuestra `temperatura` |

Los nueve primeros comparten carpeta: vienen del **Scanner de Vitalidad**.

**Qué implica:** el bot debería **escribir en estos campos**, no crear once
paralelos. `inversion_reciente` es especialmente valioso porque es justo el dato
que más pesa para cerrar (lo que ya gastó sin resultado), y ya tiene dónde
guardarse.

Faltarían solo tres: nombre del perro, hace cuánto está así, y el estado del
setter. Y `Tier` puede absorber la temperatura.

### 7.3 Qué hay que corregir

- [ ] Reescribir `05-Setup-GHL.md` §2 y §4 contra la estructura real
- [ ] Decidir dónde vive el lead antes de pagar (tags o etapas nuevas en VENTAS)
- [ ] Remapear el módulo 8 del Escenario 1 a los campos que existen
- [ ] Confirmar con Marcelo si el pipeline orgánico se eliminó o nunca existió


---

## 8. Volumen real de conversaciones (18-ago a 1-sep 2026)

Contado en vivo, día por día, con `search-conversation`.

### Instagram

| | Total 15 días | Promedio/día |
|---|---|---|
| Conversaciones **con actividad** | **490** | 33 |
| Conversaciones **nuevas** | **356** | 24 |

Días pico: 18-ago (89 activas) y 28-ago (51). Días flojos: 22-ago y 27-ago (16-17).
Histórico total de conversaciones de Instagram en la cuenta: **5.874**.

### WhatsApp

**39 conversaciones** con actividad en las dos semanas. Histórico: 409.

### ⚠️ El WhatsApp es el teléfono personal de Marcelo

Al leer esas 39 conversaciones aparece lo siguiente: saludos de cumpleaños, un
contacto llamado "Papá", una cuñada, amigos del gimnasio, y un proveedor de
huevos que manda su lista de precios. Mezclado con eso hay clientes reales,
reconocibles porque llevan el nombre del perro entre paréntesis: Marcia Palacios
(Milo), Luis Corcho (Nala), María José García (Matilde), Constanza Valencia
(Magnolia).

**No se puede poner a Paula en ese número.** Le respondería al padre de Marcelo y
al vendedor de huevos. Las opciones son:

1. **Número aparte para el bot.** Un WhatsApp Business API nuevo, solo para el
   embudo. Es lo correcto y lo más limpio.
2. **Solo Instagram por ahora.** Es donde está el 93% del volumen de todas formas
   (490 contra 39). Se enciende ahí y WhatsApp queda para Marcelo.

La opción 2 permite arrancar sin esperar nada.

Dato aparte: los contadores de no leídos en ese WhatsApp llegan a 2.131, 278 y
198 mensajes. Marcelo no está leyendo ese canal.

### Qué implica para el presupuesto

Todos los cálculos del proyecto asumían **200 conversaciones al mes**. El volumen
real de Instagram es de unas **700 nuevas al mes** (356 en 15 días), 3,5 veces más.

| Concepto | Con 200 conv | Con 700 conv |
|---|---|---|
| Paula en Opus 5 | $17 | **~$58** |
| Paula en Haiku 4.5 | $3 | **~$12** |
| Operaciones de Make (6 por mensaje, 8 mensajes) | 9.600 | **~33.600** |
| Plan de Make necesario | Core (10.000) | **Pro (40.000)** |

O sea: el plan Core **no alcanza**. Hay que ir a Pro, o reducir operaciones por
mensaje, o filtrar qué conversaciones entran al bot.

> **Salvedad del método:** `lastMessageType` filtra por el tipo del *último*
> mensaje. Una conversación de Instagram cuyo último mensaje sea una nota interna
> o una actividad del CRM no aparece. Los números son un piso, no un techo.
