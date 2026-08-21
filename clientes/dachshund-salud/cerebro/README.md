# Cerebro del bot · Dr. Marcelo Hernán

> El bot **es Marcelo**, en primera persona, en WhatsApp e Instagram. Acá vive todo
> lo que sabe, cómo habla y qué puede y no puede decir.
> Decisión del cliente (agosto 2026): el bot firma como Marcelo, no como asistente.

---

## Qué hay acá

| Archivo | Qué es |
|---|---|
| **`CEREBRO-MARCELO.md`** | El prompt completo. Identidad, voz, vocabulario obligatorio, todo el conocimiento clínico, los 5 productos con precios reales, flujo de conversación, objeciones y 12 reglas duras. Esto es lo que se edita cuando el bot dice algo mal. |
| `fuentes/` | Texto crudo de las fuentes originales, versionado. Hoy: el manuscrito del Libro 1 y la transcripción del webinar (20.780 palabras de Marcelo hablando textual). |
| `build.py` | Arma el cuerpo de la petición listo para pegar en Make, y te dice cuánto cuesta. |
| `salida/` | Lo que genera el script. **`cuerpo-modulo3.json` es lo que se pega en Make.** |

---

## Cómo se carga en Make

```bash
python3 build.py            # núcleo (recomendado)
python3 build.py completo   # núcleo + todas las fuentes crudas
```

Después:

1. Make → escenario **`[SETTER] Marcelo - IG+WSP -> Consulta`** (id 7035201) → módulo 3
2. Campo **Request content** → borrar lo que hay
3. Pegar entero el contenido de `salida/cuerpo-modulo3.json`
4. Guardar

El archivo ya viene con el JSON escapado, el esquema de salida estructurada y el
`cache_control` de 1 hora puestos. No hay que tocar nada a mano.

---

## Núcleo o completo: los números reales

`build.py` los calcula. Con Claude Opus 5 y una estimación de 1.600 mensajes al mes:

| Modo | Palabras | Tokens | Coste mensual |
|---|---|---|---|
| **Núcleo** | 3.875 | ~5.800 | **~$47** |
| Completo | 37.005 | ~55.500 | **~$444** |

Con Claude Haiku 4.5 se divide por cinco: núcleo ~$9, completo ~$89.

> El cálculo asume el peor caso de caché: una escritura por hora, porque los DM
> llegan espaciados. Si el volumen sube y los mensajes se acercan, el coste real
> baja bastante. Verificalo mirando `usage.cache_read_input_tokens` en Make: si
> viene en 0 siempre, el caché no está funcionando.

**Recomendación: núcleo.** No por el dinero, sino porque el bot no necesita poder
recitar el libro. Necesita entender el caso y llevarlo al producto correcto. Si el
bot puede explicar el protocolo completo con cantidades, el papá perruno ya no
tiene motivo para pagar los $197. El conocimiento fino es el producto, no el
argumento de venta.

El modo completo tiene sentido en un **segundo bot**, el de soporte a quienes ya
compraron: ahí responder con la cita exacta del libro es entregar lo que pagaron.

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
