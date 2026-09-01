# Cerebro del bot · Dachshund Salud

> Acá vive el prompt del bot que atiende WhatsApp e Instagram: quién es, cómo
> habla, qué puede y qué no puede decir.
> **Persona por defecto: Paula**, asistente del equipo que califica y agenda.
> `CEREBRO-MARCELO.md` queda disponible por si se quiere el bot en primera
> persona de Marcelo.

---

## Las dos personas

| | **Paula** (por defecto) | **Marcelo** |
|---|---|---|
| Quién dice ser | Asistente del equipo | El Dr. Marcelo, en primera persona |
| Qué sabe de nutrición | Cinco mecanismos generales, nada más | Todo el conocimiento clínico |
| Ante una pregunta técnica | La usa de **puente** a la consulta | Tiene que contenerse para no responderla |
| Si dice una burrada | Se equivocó el equipo | Se equivocó un veterinario colegiado |
| Tamaño | 3.175 tokens | 6.757 tokens |
| Coste (200 conv/mes, Opus 5) | **$17** | $26 |
| Coste (200 conv/mes, Haiku 4.5) | **$3** | $5 |

**Paula es la recomendada, y no por el precio.** Su ignorancia técnica es la
herramienta de venta: que ella no pueda responder "cuánto le doy de comer" es
creíble y empuja a la consulta. Que Marcelo no lo responda parece evasivo.

## Qué hay acá

| Archivo | Qué es |
|---|---|
| **`CEREBRO-PAULA.md`** | El prompt por defecto. Asistente que califica, pide fotos y agenda. Su sección clave es "Mi mejor herramienta es no saber", con el puente de tres movimientos. |
| `CEREBRO-MARCELO.md` | La versión en primera persona, con todo el conocimiento clínico. Sirve para el bot de soporte a compradores. |
| `COMO-CIERRA.md` | Por qué cierra lo que cierra: el diagnóstico parcial, las dos fotos, los micro-compromisos, la métrica única. |
| `HALLAZGOS-DRIVE.md` | Lo que apareció al leer el Drive y contradice los docs viejos. |
| `fuentes/` | Texto crudo de las fuentes. **No versionado** (ver `fuentes.md`). |
| `build.py` | Arma el cuerpo listo para pegar en Make y calcula el coste. |
| `salida/` | Lo que genera el script. **`cuerpo-modulo3.json` es lo que se pega en Make.** |

## Por qué el conocimiento NO va en un vector store

La arquitectura que se ve en los tutoriales de Make (módulo *OpenAI → Message an
assistant* con la biblioteca cargada en un vector store) resuelve un problema que
este bot no tiene, y crea uno que sí importa.

**Lo que promete:** la knowledge base vive en el servidor del proveedor, se
recuperan solo los fragmentos relevantes, y no pagás el libro entero en cada
mensaje.

**Por qué acá es contraproducente:**

1. **Le das a Paula justo lo que le prohibiste decir.** El recuperador va a traerle
   el capítulo con los gramajes cuando alguien pregunte por gramajes. Estarías
   pagando para darle la capacidad de romper la regla número 2.
2. **Deja de ser determinista.** Con el prompt fijo sabés exactamente qué sabe. Con
   recuperación, cada mensaje ve un contexto distinto y las reglas se cumplen de
   forma desigual.
3. **No hay problema de coste que resolver.** Paula entera son 3.175 tokens: $3 al
   mes con Haiku. La optimización que promete el vector store no aplica.
4. **Duplica el estado.** Los threads del proveedor conviven con el data store de
   Make y hay que mantener los dos sincronizados.

El vector store es la arquitectura correcta para **el otro bot**: el de soporte a
quienes ya compraron. Ahí responder con la cita exacta del libro es entregar el
producto, no regalarlo.

## Cómo se carga en Make

```bash
python3 build.py                          # Paula + Opus 5 (recomendado)
python3 build.py paula claude-haiku-4-5   # Paula + Haiku (5 veces más barato)
python3 build.py marcelo                  # el bot habla como Marcelo
python3 build.py completo                 # Marcelo + libros y transcripciones
```

> El script sabe que **`effort` da error en Haiku 4.5** y lo omite solo. Por eso
> el modelo se cambia acá y no editando el body a mano en Make: cambiarlo a mano
> deja el `effort` puesto y el escenario devuelve error 400.

Después:

1. Make → escenario **`[SETTER] Marcelo - IG+WSP -> Consulta`** (id 7035201) → módulo 3
2. Campo **Request content** → borrar lo que hay
3. Pegar entero el contenido de `salida/cuerpo-modulo3.json`
4. Guardar

El archivo ya viene con el JSON escapado, el esquema de salida estructurada y el
`cache_control` de 1 hora puestos. No hay que tocar nada a mano.

---

## Por qué el tamaño del cerebro cuesta plata

Esto es lo que hay que entender antes de elegir.

**El modelo no tiene memoria.** Cada vez que alguien escribe un mensaje, Make le
manda a la IA **el cerebro entero otra vez**, más toda la conversación hasta ese
punto. No existe "cargar el conocimiento una vez y ya". Se reenvía siempre.

Entonces no pagás por *guardar* el conocimiento. Pagás por *transportarlo* en cada
mensaje. Un cerebro diez veces más grande cuesta diez veces más en **cada uno** de
los mensajes de **cada una** de las conversaciones.

El caché de Anthropic amortigua bastante: la primera vez que se manda un prompt se
guarda durante una hora, y las siguientes lecturas cuestan el 10%. Por eso el
cerebro tiene que quedar **congelado** (nada de fechas ni nombres adentro): si
cambia un solo carácter, el caché se cae y se paga completo de nuevo.

### Los números

`build.py` los imprime cada vez que lo corrés.

| | Núcleo | Completo |
|---|---|---|
| Tamaño | 5.812 tokens | 55.507 tokens |
| **Opus 5** · por conversación | $0,12 | $0,79 |
| **Opus 5** · 200 conv/mes | **~$24** | **~$158** |
| **Sonnet 5** · 200 conv/mes | ~$14 | ~$95 |
| **Haiku 4.5** · 200 conv/mes | ~$5 | ~$32 |

Supuestos: 8 mensajes por conversación y una escritura de caché por conversación
(el peor caso realista). Verificar los precios vigentes antes de presupuestar.

### Qué decidir

**El dinero no es el argumento.** Ni siquiera $158 al mes es un problema contra
ventas de $197. Los dos argumentos reales son otros:

1. **Si el bot puede recitar el protocolo con cantidades exactas, el papá perruno
   ya no necesita pagar los $197.** El conocimiento fino es el producto. El bot
   está para entender el caso y llevarlo al producto correcto, no para resolverlo
   gratis por chat.
2. **Un prompt de 55.000 tokens es más lento.** En un chat de WhatsApp, unos
   segundos de más por mensaje se notan.

**Recomendación: núcleo.** El modo completo tiene sentido en un **segundo bot**,
el de soporte a quienes ya compraron: ahí responder con la cita exacta del libro
es entregar lo que pagaron, no regalarlo.

---

## De dónde salió cada cosa

| Fuente en Drive | Qué aportó |
|---|---|
| `KB_Marcelo_Nutricion_Perros_Salchicha.docx` | Ficha profesional, límites éticos, frases propias, cómo manejar ansiosos y escépticos |
| `Nutricion-Dachshund-Manuscrito-con-Prompts.docx` | Libro 1 completo |
| `Recomposicion-Dachshund-Capitulos-1-4.docx` | Raza, mecanismo, microbiota, componentes de la dieta |
| `Ficha E-Book 1` · `Ficha Asesoría HT` | Precios reales, objeciones, vocabulario prohibido, criterios de cuándo ofrecer cada cosa |
| `Guia del setter - Flujos y Pipeline CRM.pdf` | Los 3 CTA, el pipeline, las dos fotos, cuándo derivar |
| 23 transcripciones `.srt` | La voz real de Marcelo hablando |

Los libros completos en PDF siguen viviendo en Drive
(`[07] Productos → [Setter] Información → Libros PDF`). Acá está el texto, no las
ilustraciones.

---

## Cómo se actualiza

Cuando Marcelo cambie un precio, saque un producto o publique un libro nuevo:

1. Editar `CEREBRO-MARCELO.md` (o agregar el `.txt` a `fuentes/`)
2. `python3 build.py`
3. Pegar `salida/cuerpo-modulo3.json` en el módulo 3
4. Commit

El caché de Anthropic se invalida solo con el cambio y se reconstruye en la
primera conversación. No hay nada más que hacer.
