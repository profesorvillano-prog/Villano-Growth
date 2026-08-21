# Setter Bot IG + WhatsApp → Consulta (Marcelo Dachshund)

> Reemplazo automatizado de los setters humanos. Un bot que **es el Dr. Marcelo**
> atiende los DM de Instagram y los WhatsApp que llegan a GHL, califica el caso y
> lo lleva al producto correcto de la escalera ($27 / $47 / $97 / $197 / $497).
> **Todo el cerebro vive en Make.** GHL es el buzón y el CRM.

---

> ⚠️ **Agosto 2026: el bot ahora es Marcelo, no una asistente.** El prompt vive en
> [`../../cerebro/`](../../cerebro/) y reemplaza al doc 03. Al leer el Drive de
> Marcelo aparecieron precios, vocabulario prohibido y una operación de setter en
> GHL que contradicen partes de estos documentos: está todo detallado en
> [`cerebro/HALLAZGOS-DRIVE.md`](../../cerebro/HALLAZGOS-DRIVE.md), incluida la
> lista de qué quedó desactualizado.

## El cambio en una línea

**Antes:** el setter tenía que cerrar $497 por chat.
**Ahora:** el bot lleva a la Asesoría de $197, que ya incluye la videollamada de
diagnóstico. El $497 queda para los casos que necesitan 90 días de supervisión.

Esa es toda la razón por la que esto se puede automatizar.

---

## Los documentos

| # | Documento | Qué resuelve |
|---|---|---|
| 01 | [Embudo y Modelo](./01-Embudo-y-Modelo.md) | El embudo nuevo, la Consulta como producto, precios, KPIs, decisiones que faltan |
| 02 | [Arquitectura Make](./02-Arquitectura-Make.md) | Los 2 escenarios módulo por módulo, data store, operaciones y coste real |
| 03 | [Prompt del setter IA](./03-Prompt-Setter-IA.md) | El cerebro completo, listo para pegar. Voz, reglas, objeciones, formato JSON |
| 04 | [Guion, objeciones y seguimientos](./04-Guion-Objeciones-y-Seguimientos.md) | Todos los mensajes fijos: oferta, pack, derivación, 4 seguimientos, post-pago |
| 05 | [Setup en GHL](./05-Setup-GHL.md) | Custom fields, tags, pipeline, 4 workflows, producto, calendario, token |
| 06 | [Checklist y pruebas](./06-Checklist-y-Pruebas.md) | 18 casos de prueba obligatorios y el encendido gradual en 4 semanas |
| 07 | [Voz y conocimiento](./07-Voz-y-Conocimiento.md) | Cómo hacer que hable como Marcelo (ficha de voz + few-shot) y qué conocimiento sí y no le entra, con los costes |
| 08 | [Control de calidad](./08-Control-de-Calidad.md) | Las 3 capas para que no meta la pata: prompt, validador determinista en Make, y revisión humana |

**Blueprints importables:** [`blueprints/`](./blueprints/)

---

## Ya está creado en Make

No hace falta importar nada: los dos escenarios, el data store y el webhook ya
existen en la cuenta **Villano Growth** (org `8286748`, team `2094866`).

| Recurso | Nombre en Make | ID |
|---|---|---|
| Escenario 1 | `[SETTER] Marcelo - IG+WSP -> Consulta` | `7035201` |
| Escenario 2 | `[SETTER] Marcelo - Seguimientos` | `7035204` |
| Data store | `setter_marcelo` | `168449` |
| Estructura del data store | `setter_marcelo_estructura` | `541589` |
| Estructura de la respuesta IA | `setter_respuesta_ia` | `541591` |
| Estructura del webhook | `setter_webhook_ghl` | `541592` |
| Webhook | `SETTER Marcelo IG-WSP` | `3583173` |

Los dos escenarios están **apagados** a propósito: les faltan las credenciales de
abajo y no se pueden encender antes de las pruebas del doc 06.

> La URL del webhook no se guarda en este repo (es un endpoint sin autenticación:
> cualquiera con la URL puede inyectar mensajes falsos). Está en Make, dentro del
> módulo 1 del Escenario 1. De ahí se copia y se pega en el Workflow A de GHL.

### Lo que falta rellenar dentro de los escenarios

| Placeholder | Dónde | Qué va |
|---|---|---|
| `PEGAR_ANTHROPIC_API_KEY` | Esc. 1, módulo 3, header `x-api-key` | API key de Anthropic |
| todo el body del módulo 3 | Esc. 1, módulo 3, **Request content** | Pegar `cerebro/salida/cuerpo-modulo3.json` entero (lo genera `cerebro/build.py`) |
| `PEGAR_GHL_TOKEN` | Todos los módulos HTTP de GHL (ambos escenarios) | Private Integration token |
| `PEGAR_WEBHOOK_AVISO_MARCELO` | Esc. 1, módulos 12 y 14 | Webhook de GHL que le avisa a Marcelo |
| `PEGAR_WEBHOOK_GHL_PLANTILLA_FU3` / `FU4` | Esc. 2, módulos 7 y 9 | Workflows de GHL con plantilla aprobada |
| `[LINK_PAGO]` `[LINK_PACK]` `[PRECIO_CONSULTA]` | Esc. 1, módulos 6 y 9 | Los links y el precio reales |

El Escenario 2 quedó programado cada 8 horas (3 corridas al día), que es la
cadencia del doc 02 §3.

---

## Los blueprints del repo

Los archivos de [`blueprints/`](./blueprints/) son la copia versionada de lo que
hay en Make. Sirven para revisar cambios en git y para reconstruir todo si algo se
rompe. Para volver a importarlos:

1. Make → **Create a new scenario** → menú `···` → **Import Blueprint**
2. Subir `blueprints/01-setter-cerebro.blueprint.json`
3. Rellenar los placeholders de la tabla de arriba
5. Repetir con `blueprints/02-seguimientos.blueprint.json` y programarlo
   **3 veces al día** (09:00, 14:00 y 20:00 hora de Chile), no cada 15 minutos.

> Los IDs de data store, estructuras y webhook ya vienen escritos en los
> archivos, así que una reimportación en esta misma cuenta se conecta sola.

> El campo `system` del módulo 3 es largo. Conviene pegarlo desde el editor
> expandido de Make, no en el campo chico.

---

## Estado del proyecto

**Hecho:** arquitectura, prompt, guion completo, setup de GHL documentado, plan
de pruebas, y **los dos escenarios ya creados en Make** junto con el data store,
las 3 estructuras de datos y el webhook.

**Bloqueado, necesita a Marcelo:**

1. Aprobar el cambio de modelo. El doc `docs/Oferta-High-Ticket.md` dice hoy
   *"cierre solo por audio de WhatsApp, nunca Calendly/llamada"*. Este embudo
   agenda la consulta después del pago, que es distinto, pero contradice la regla
   escrita. Marcelo tiene que aprobarlo y hay que actualizar el doc madre.
2. Precio de la consulta y política de abono al acompañamiento.
3. Pasarela de cobro y link de pago.
4. Calendario publicado con su horario real (15:00-19:00 Chile).
5. Nombre de la asistente del bot.

**Bloqueado, necesita a Villano:**

6. **Subir el plan de Make.** La cuenta está en Free: 1.000 operaciones al mes y
   2 escenarios activos. Eso da para unas **17 conversaciones al mes**, y además
   ocupa los 2 escenarios que hoy usan los tableros de métricas. El plan **Core**
   (10.000 ops) sostiene unas 200 conversaciones al mes. Ver doc 02 §7.
7. API key de Anthropic con límite de gasto.

---

## Lo que cuesta operarlo

| Concepto | Mensual aproximado |
|---|---|
| Make plan Core | ~$10-12 |
| IA (Haiku 4.5, ~200 conversaciones) | ~$4 |
| **Total** | **~$15** |

Contra un sueldo de setter. Ese es el caso de negocio, y por eso vale la pena
hacer bien la semana de modo sombra antes de encender.

---

## Reglas de la casa que este sistema respeta

Vienen de `docs/Marcelo-y-Ecosistema-Productos.md` §8 y de `docs/Oferta-High-Ticket.md`:

- El bot **es** Marcelo y escribe en primera persona (decisión de agosto 2026,
  reemplaza la regla anterior de "nunca hacerse pasar por Marcelo").
- El bot **nunca** da el precio de un producto antes de entender el caso.
- El bot **nunca** diagnostica, receta, da dosis ni promete curación.
- El bot **nunca** inventa testimonios ni cifras. Solo usa los casos verificados
  de `docs/Casos-de-Exito.md`.
- El bot **nunca** baja precios ni inventa promociones.
- El bot **nunca** dice "masterclass" ni "webinar".
- Casos neurológicos, ortopédicos, traumatológicos, oncológicos y urgencias:
  se derivan a un veterinario clínico y no se les vende nada.
