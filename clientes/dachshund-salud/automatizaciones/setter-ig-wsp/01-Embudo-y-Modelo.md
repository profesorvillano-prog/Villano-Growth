# 01 · El embudo a Consulta (modelo de negocio del setter)

> **Contexto:** los setters humanos renunciaron. El bot IG + WhatsApp los
> reemplaza. Para que un bot pueda cerrar, el trabajo se simplifica: ya no vende
> un acompañamiento de $497 por chat, **vende una Consulta de Evaluación pagada**.
> El acompañamiento se vende dentro de la consulta, con Marcelo en vivo.
> **Última actualización:** Agosto 2026.

---

## 1. Por qué cambia el embudo

El modelo anterior (`docs/Oferta-High-Ticket.md`) era:

```
Ads / orgánico → WhatsApp → 2-4 audios de Marcelo → precio $497 → link de pago
```

Eso funciona con un humano con criterio y con la voz de Marcelo. **No es
automatizable**: exige juicio clínico, audios reales y manejo fino de objeciones
de un producto de $497 vendido en frío por texto.

El modelo nuevo baja el escalón:

```
Ads / orgánico → DM (IG) o WhatsApp → BOT califica → Consulta de Evaluación
pagada ($47) → Marcelo en vivo → Acompañamiento 3 meses ($497)
```

El bot solo tiene que conseguir **un sí de $47**, no uno de $497. Es una decisión
de bajo riesgo para el lead y una tarea acotada para la IA. Marcelo sigue siendo
quien vende el high-ticket, pero ahora lo hace **solo frente a gente que ya pagó**,
que ya contó su caso y que ya se comprometió con una hora en el calendario.

### Qué gana el negocio

| | Modelo setter humano | Modelo bot → consulta |
|---|---|---|
| Quién califica | Setter (renunció) | Bot 24/7 |
| Qué se cierra por chat | $497 | $47 |
| A quién le habla Marcelo | A todo el que escribe | Solo a quien pagó |
| Costo por lead atendido | Sueldo de setter | ~$0,01 de IA + ops de Make |
| Horario de atención | 15:00-19:00 Chile | 24/7 |
| Filtro de curiosos | Manual, agotador | El precio filtra solo |

---

## 2. La Consulta de Evaluación Dachshund (el producto nuevo)

Este producto **no existía**. Hay que crearlo antes de encender el bot. Ficha
propuesta (a confirmar con Marcelo, ver sección 3):

| Campo | Propuesta |
|---|---|
| **Nombre comercial** | Consulta de Evaluación Dachshund |
| **Precio** | **$47 USD** `[CONFIRMAR CON MARCELO]` |
| **Duración** | 45-60 min por Google Meet (coincide con la "primera evaluación 60 min" del KB interno) |
| **Horario** | 15:00-19:00 hrs Chile, lun-vie (horario real de Marcelo) |
| **Quién la da** | Dr. Marcelo Hernán, en persona (no el equipo, no el bot) |
| **Qué incluye** | Revisión del caso, revisión de lo que come hoy, identificación de la causa nutricional, primeros pasos concretos por escrito |
| **Qué NO incluye** | Plan nutricional completo, gramajes exactos, seguimiento. Eso es el acompañamiento. |
| **Regla de upsell** | Los $47 **se abonan al acompañamiento** si contrata dentro de las 72 h posteriores a la consulta |

### Por qué $47

- Es un **tripwire**, no una fuente de ingresos. Su función es filtrar y comprometer.
- Bajo lo suficiente para decidirlo en el chat sin consultarlo con la pareja.
- Alto lo suficiente para que no venga el que "solo pregunta".
- Con el abono al acompañamiento, el lead percibe riesgo cero: si sigue, no perdió nada.
- **Regla de negocio vigente (doc madre §8): nunca bajar precios, solo subirlos.**
  Si arrancás en $47 no podés volver a $37. Si hay duda, arrancá en $37 y subí.

> `[DECISIÓN DE MARCELO]` Precio final, si el abono es 100% o parcial, y si el
> precio es en USD para todos o hay precio local en CLP/MXN/COP.

---

## 3. Decisiones que faltan antes de encender

| # | Decisión | Quién | Bloquea |
|---|---|---|---|
| 1 | Precio final de la consulta y política de abono | Marcelo | Prompt, link de pago, guion |
| 2 | Pasarela de cobro (producto en GHL / Stripe / MercadoPago / Hotmart) | Marcelo | Link de pago del bot |
| 3 | Calendario con disponibilidad 15:00-19:00 Chile | Marcelo | Link de agenda post-pago |
| 4 | Confirmar que la Consulta **sí** puede tener agenda, aunque el doc madre diga "nunca Calendly" | Marcelo | Todo el modelo |
| 5 | Nombre de la asistente del bot (propuesta: **Cata**) | Marcelo | Prompt |
| 6 | Plan de Make (el Free no alcanza, ver `02-Arquitectura-Make.md` §7) | Villano | Encendido |

> ⚠️ **Punto 4, importante.** `docs/Oferta-High-Ticket.md` §3 y el doc madre §8
> dicen textualmente: *"Cierre solo por audio de WhatsApp, nunca Calendly/llamada"*.
> Este embudo **contradice esa regla** de forma deliberada: la consulta pagada sí
> se agenda. La regla vieja existía porque agendar en frío mata la conversión;
> acá no se agenda en frío, se agenda **después de pagar**, que es cuando el
> no-show se desploma. Marcelo tiene que aprobar el cambio explícitamente y hay
> que actualizar el doc madre. Si Marcelo lo rechaza, el bot cobra igual y la
> consulta se entrega por audio/WhatsApp cuando Marcelo pueda: el flujo del bot
> es el mismo hasta el pago, solo cambia el último mensaje.

---

## 4. El embudo completo, etapa por etapa

```
┌─ ENTRADA ────────────────────────────────────────────────────────────┐
│  Ads Meta (IG/FB)  ·  Orgánico @dachshundsalud  ·  Scanner Vitalidad │
│  Bio del perfil    ·  eBooks (CTA a WhatsApp)   ·  Comentarios       │
└────────────────────────────┬─────────────────────────────────────────┘
                             ▼
              DM de Instagram  ó  WhatsApp  →  todo entra a GHL
                             ▼
┌─ EL BOT (Make + IA) ─────────────────────────────────────────────────┐
│  1. Saluda y pide el caso                                            │
│  2. Califica: 5 datos (dueño, perro, síntoma, comida, qué intentó)   │
│  3. Espeja el dolor + explica el mecanismo (intestino-piel / IVDD)   │
│  4. Puente: "esto se resuelve con evaluación, no con un consejo"     │
│  5. Ofrece la Consulta ($47) y maneja objeciones                     │
│  6. Manda link de pago                                               │
└────────────────────────────┬─────────────────────────────────────────┘
                             ▼
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   PAGÓ                  NO CALIFICA          CASO CLÍNICO
   → link de agenda      → Pack de eBooks     → deriva a vet clínico
   → form de caso        → nurture            → puerta abierta
   → recordatorios       │                    │
        ▼                                     
┌─ MARCELO (en vivo) ──────────────────────────────────────────────────┐
│  Consulta 45-60 min → diagnóstico nutricional → oferta Acompañamiento│
│  3 meses $497 (menos los $47 abonados) → cierre                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Rutas de salida del bot (las 5 únicas)

El bot siempre termina la conversación en uno de estos 5 lugares. Nunca la deja abierta.

| Ruta | Cuándo | Acción | Tag GHL |
|---|---|---|---|
| **CONSULTA** | Dolor nutricional real + disposición | Link de pago | `setter-consulta-ofrecida` → `consulta-pagada` |
| **PACK** | Sin presupuesto, solo info, regateo fuerte | Link del Pack de eBooks | `setter-nurture-pack` |
| **CLÍNICO** | Neurológico, ortopédico, traumatológico, oncológico, urgencia | Mensaje de derivación + puerta abierta | `setter-derivado-clinico` |
| **HANDOFF** | Cliente actual, caso raro, queja, prensa, algo fuera de guion | Avisa a Marcelo y se calla | `setter-handoff` |
| **FRÍO** | 4 seguimientos sin respuesta | Cierra ciclo, queda en lista | `setter-frio` |

---

## 6. KPIs del embudo

Se miden en GHL y se suben a Supabase (`ht_pipeline`, `cliente = marcelo`,
según `cerebro/docs/make-automations.md` §4).

| KPI | Definición | Dónde |
|---|---|---|
| **DMs entrantes** | Conversaciones nuevas IG + WSP | GHL conversations |
| **Tasa de enganche** | % que responde al primer mensaje del bot | Data store / GHL |
| **Tasa de calificación** | % que entrega los 5 datos | Custom field `setter_datos_completos` |
| **Tasa de oferta** | % de calificados a los que se les ofreció la consulta | Tag `setter-consulta-ofrecida` |
| **Tasa de pago** | % de ofertas que pagan los $47 | Tag `consulta-pagada` |
| **Tasa de show** | % de pagados que asisten | Calendario GHL |
| **Tasa de upsell** | % de consultas que compran el acompañamiento | Pipeline GHL |
| **Ingreso por DM** | Ingreso total / DMs entrantes | Cálculo |
| **Tasa de derivación** | % de casos clínicos (salud del bot: si sube mucho, el ads está mal segmentado) | Tag `setter-derivado-clinico` |

### Modelo de proyección para fijar metas

> ⚠️ **Esto NO es un dato histórico ni una promesa.** Es una hipótesis inicial
> para poder fijar objetivos y detectar dónde se rompe el embudo. Se reemplaza
> con datos reales después del primer mes. Regla de la casa: nunca inventar
> estadísticas y presentarlas como reales.

| Etapa | Hipótesis | Sobre 100 DMs |
|---|---|---|
| Responden al bot | 60% | 60 |
| Califican (5 datos) | 55% | 33 |
| Reciben oferta | 75% | 25 |
| Pagan la consulta | 25% | 6 |
| Asisten | 80% | 5 |
| Compran acompañamiento | 35% | ~2 |

Ingreso hipotético por 100 DMs: 6 × $47 + 2 × ($497 - $47) ≈ **$1.180**.
Lo que hay que vigilar de verdad el primer mes: **tasa de calificación** (si es
baja, el prompt pregunta mal) y **tasa de pago** (si es baja, o el precio está
mal o el puente a la consulta es débil).

---

## 7. Qué NO hace este bot (límites explícitos)

- No diagnostica, no receta, no da gramajes ni dosis. Nunca.
- No manda audios ni imita a Marcelo. Es la asistente del equipo, no el veterinario.
- No menciona el acompañamiento de $497 ni su precio. Ese es el trabajo de Marcelo en la consulta.
- No promete curación, ni plazos, ni "resultados garantizados".
- No inventa testimonios ni casos. Solo usa los verificados de `docs/Casos-de-Exito.md`.
- No negocia el precio de la consulta hacia abajo.
- No atiende urgencias. Deriva.
