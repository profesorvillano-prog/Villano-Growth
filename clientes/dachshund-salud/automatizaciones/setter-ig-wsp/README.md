# Setter Bot IG + WhatsApp → Consulta (Marcelo Dachshund)

> Reemplazo automatizado de los setters humanos. Un bot con IA atiende los DM de
> Instagram y los WhatsApp que llegan a GHL, califica el caso y vende **una
> Consulta de Evaluación pagada** con el Dr. Marcelo. El acompañamiento de $497 lo
> sigue vendiendo Marcelo, pero ahora solo frente a gente que ya pagó.
> **Todo el cerebro vive en Make.** GHL es el buzón y el CRM.

---

## El cambio en una línea

**Antes:** el setter tenía que cerrar $497 por chat.
**Ahora:** el bot tiene que cerrar $47. Marcelo cierra los $497 en la consulta.

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

**Blueprints importables:** [`blueprints/`](./blueprints/)

---

## Cómo importar los blueprints

1. Make → **Create a new scenario** → menú `···` → **Import Blueprint**
2. Subir `blueprints/01-setter-cerebro.blueprint.json`
3. Al importar, Make va a pedir tres cosas que el archivo no puede traer hechas:
   - **Webhook:** crear uno nuevo llamado `SETTER Marcelo IG-WSP` y copiar su URL
   - **Data store:** seleccionar `setter_marcelo` (crearlo antes, estructura en el doc 02 §4)
   - **Data structure del JSON:** seleccionar `setter_respuesta_ia` (doc 02 §5)
4. Reemplazar los placeholders que quedaron a la vista en los módulos:

| Placeholder | Dónde | Qué va |
|---|---|---|
| `PEGAR_ANTHROPIC_API_KEY` | Módulo 3, header `x-api-key` | API key de Anthropic |
| `PEGAR_AQUI_EL_PROMPT_COMPLETO_DEL_DOC_03` | Módulo 3, body, campo `system` | El prompt del doc 03 |
| `PEGAR_GHL_TOKEN` | Todos los módulos HTTP de GHL | Private Integration token |
| `PEGAR_WEBHOOK_AVISO_MARCELO` | Módulos 12 y 14 | Webhook de GHL que le avisa a Marcelo |
| `[LINK_PAGO]` `[LINK_PACK]` `[PRECIO_CONSULTA]` | Módulos 6 y 9 | Los links y el precio reales |

5. Repetir con `blueprints/02-seguimientos.blueprint.json` y programarlo
   **3 veces al día** (09:00, 14:00 y 20:00 hora de Chile), no cada 15 minutos.

> El campo `system` del módulo 3 es largo. Conviene pegarlo desde el editor
> expandido de Make, no en el campo chico.

---

## Estado del proyecto

**Listo:** arquitectura, prompt, guion completo, blueprints, setup de GHL, plan de pruebas.

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

- El bot **nunca** se hace pasar por Marcelo. Es la asistente del equipo.
- El bot **nunca** menciona el acompañamiento de $497 ni su precio.
- El bot **nunca** diagnostica, receta, da dosis ni promete curación.
- El bot **nunca** inventa testimonios ni cifras. Solo usa los casos verificados
  de `docs/Casos-de-Exito.md`.
- El bot **nunca** baja precios ni inventa promociones.
- El bot **nunca** dice "masterclass" ni "webinar".
- Casos neurológicos, ortopédicos, traumatológicos, oncológicos y urgencias:
  se derivan a un veterinario clínico y no se les vende nada.
