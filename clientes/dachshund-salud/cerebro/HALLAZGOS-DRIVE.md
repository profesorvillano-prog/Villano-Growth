# Hallazgos al leer el Drive de Marcelo

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
