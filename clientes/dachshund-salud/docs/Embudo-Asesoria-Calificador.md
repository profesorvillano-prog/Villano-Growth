# Embudo de Asesoría — Calificador + WhatsApp

> **Origen:** Reunión Semanal Setter — Marcelo Hernán (17 ago 2026).
> Participan: Javier Donoso, Rodrigo Oyarce, Sebastián Escudero, Justher Llecllish (setter).
> **Qué es este doc:** el desglose del embudo nuevo de asesoría (high ticket) y del
> formulario calificador que lo alimenta.
> **Estado:** en implementación. Los `[POR CONFIRMAR]` se cierran con Marcelo.

---

## 1. La decisión de fondo

El foco pasa a ser **100% la asesoría (high ticket)**. Todo lo demás baja de prioridad.

| Antes | Ahora |
|---|---|
| Se ofrecía el eBook primero | El eBook es **bajada**, no entrada. Solo cuando hay rechazo al high ticket |
| Semáforo del embudo apuntaba al eBook | Semáforo apunta a **asesoría** |
| Idea de setear llamadas a Marcelo | **Cierre por chat**, 100% controlado por el setter |
| Lead magnet = eBook | Lead magnet = **test/formulario** (+ video). Se conversa con Marcelo bajar el fanatismo por el eBook |

**Razones para cerrar por chat y no por llamada:**
- Vender low ticket y high ticket cuesta el mismo trabajo → mejor high ticket.
- El embudo de llamada agrega un tramo muerto (confirmación → ejecución) con **no-show y cancelación alta**.
- Si el cierre depende de la llamada de Marcelo, el setter no controla el resultado ni aprende del cierre.
- El ticket **aguanta** cierre por chat.

**A quién le vendemos ahora:** urgencia primero. Perro enfermo, dueño que ya está
gastando en veterinario. La urgencia va de la mano con la compra. Es una decisión
**temporal** para levantar facturación, no un "para siempre".

---

## 2. El embudo, paso a paso

```
1. CTA orgánico / ads (problema de salud o alimentación)
2. DM en Instagram
3. ManyChat responde (automatización)  →  entra al pipeline "Conversación abierta"
4. Justher (como Marcelo) engancha en el DM y VENDE LA IDEA del formulario
        "para saber bien la situación de tu perro, complétame esto — son 60 seg"
5. FORMULARIO CALIFICADOR  →  nombre + correo  →  GHL (contacto enriquecido)
6. Resultado en pantalla (% de riesgo + zona) + botón WhatsApp (Walink)
7. WhatsApp: llega el mensaje con el resultado + pide FOTO del perro
8. Justher califica, consulta a Marcelo lo clínico, y CIERRA por chat
        (audio de Marcelo cuando el caso lo amerita)
9. Link de pago → venta
```

**Dos variantes a probar (A/B):**
- **A — Automática:** ManyChat manda el formulario directo tras la respuesta del lead.
- **B — Manual (preferida al inicio):** Justher lo manda personalizado, después de leer
  el caso. Se espera más tasa de completado porque se le "vende la idea".
- **Ghosting:** los que dejan en visto → follow-up de Justher revendiendo el formulario
  con un mensaje personalizado ("por la foto veo que tiene algo de sobrepeso…").
- Los leads que vienen de **lead magnet** sí van con automatización, para que el setter
  no pierda tiempo. Los que vienen de **CTA directo a problema de salud** los lleva Justher a mano.

**Por qué el formulario existe:**
1. Califica antes de gastar tiempo (leads mejor calificados).
2. Deja por escrito el dolor del cliente → munición para el cierre.
3. Es la excusa natural para **sacar la conversación de DM a WhatsApp** (más personal, permite audios).
4. Suma **nombre + correo** al contacto de Instagram en GHL.

---

## 3. El formulario calificador (`calificador-asesoria.html`)

Corto a propósito: **5 preguntas + nombre y correo**. Abre **directo en la pregunta 1**
(sin portada ni botón de "empezar": cero fricción desde el DM). El teléfono no se pide —
llega solo cuando el lead abre el Walink.

| # | Pregunta | Por qué está |
|---|---|---|
| 1 | **Peso** (foto, vista desde arriba, 5 opciones) | Señal visual dura. Sobrepeso = riesgo de columna = urgencia |
| 2 | **Qué come hoy** (foto del plato, 5 opciones) | Causa raíz. Define el discurso completo del setter |
| 3 | **Enfermedad / síntomas hoy** (4 niveles, hasta crónico-grave) | Filtro crónico: es quien compra asesoría |
| 4 | **Gasto veterinario últimos 6 meses** (USD, 4 rangos) | Capacidad y disposición real de inversión |
| 5 | **¿Cuándo empezarías?** (única del dueño) | Intención de compra. Separa curioso de comprador |

Al final: **nombre + correo** (obligatorios) y el botón a WhatsApp.

### Cómo puntúa

- **Riesgo del perro (0–100%)** = peso + comida + salud (0–9 pts) → % → zona
  `verde ≤25 · amarillo ≤50 · naranja ≤75 · rojo >75`
- **Capacidad (0–6)** = gasto veterinario + decisión
- **Tier:**

| Tier | Regla | Qué hace el setter |
|---|---|---|
| **Caliente** | riesgo ≥56% **y** capacidad ≥4 | Va directo a asesoría. Pide foto, consulta a Marcelo, cierra |
| **Tibio** | riesgo ≥56% **o** capacidad ≥4 | Nutre: audio/video de Marcelo + prueba social, y reintenta asesoría |
| **Frío** | resto, o "solo busco info gratis" con gasto bajo | Bajada al eBook (1 o 2 según nivel de conciencia) + follow-up |

- **Lead Score (0–100)** = 50% riesgo + 50% capacidad.
- **Ref** (`DS-C82`, `DS-T61`, `DS-F30`): viaja en el mensaje de WhatsApp para que el setter
  vea el tier de un vistazo, sin que el lead lea etiquetas internas.

### Qué llega a GHL (webhook)

`firstName`, `email`, `formulario`, `Lead Score`, `Tier`, `ref`, `riesgo_perro`, `zona`,
`p_peso`, `p_alimentacion`, `p_salud`, `d_gasto_veterinario`, `d_decision`,
`utm_source`, `utm_medium`, `utm_campaign`, `fuente`.

> El webhook es el mismo de `escaner-vitalidad.html`. **Antes de publicar:** confirmar
> webhook definitivo y número de WhatsApp/Walink que atiende el setter (constantes
> `WEBHOOK` y `WHATSAPP_NUM` al inicio del `<script>`).

### Qué llega a WhatsApp

Mensaje prellenado con: nombre, % de riesgo, zona, las 5 respuestas en texto, el `Ref`
y la promesa de mandar la foto. El setter abre el chat y ya tiene el caso completo —
sin repreguntar nada.

---

## 4. Reglas de venta: $197 vs $497

| Producto | Cuándo |
|---|---|
| **Asesoría 1 mes — $197** | Caso que Marcelo resuelve en ~30 días |
| **Asesoría 3 meses — $497** | Enfermedad de base: no se resuelve en un mes, necesita coaching sostenido |

**Criterio:** el **nivel de la enfermedad**, no el presupuesto. El setter no lo decide solo:
con el formulario + la foto le pregunta a Marcelo en el grupo de ventas, literal:
*"¿A este lo arreglas en un mes o necesitas más de 30 días?"*

**Escalera de $197 → $497:** se puede partir con el mes y, si sigue, descontar los $197
del programa de 3 meses (quedan ~$300 por pagar). `[POR CONFIRMAR con Marcelo: dejarlo
fijo o caso a caso]`

**eBooks (bajada):** eBook 1 para quien no sabe nada; eBook 2 para quien ya tiene noción
de alimentación. Precios de referencia $27 / $47. `[POR CONFIRMAR el precio del combo]`

---

## 5. Pipeline en GHL

Etapas actuales del pipeline del setter (~66 leads que interactuaron):

```
Conversación abierta  →  Interesado eBook  →  Interesado asesoría  →  Follow-up  →  Ganado / Perdido
```

Acuerdos de la reunión:
- El lead entra a **Conversación abierta** cuando **responde** la pregunta de follow-up del
  lead magnet (no cuando lo descarga).
- **Separar los follow-up:** uno para eBook y otro para asesoría. El core del tiempo va al de asesoría.
  - *Follow-up 1* → los que aún no entran al embudo de WhatsApp (falta el último mensaje).
  - *Follow-up 2* → los que ya dijeron "compro la otra semana": follow-up de venta.
- **Cargar el valor de la oportunidad** en cada tarjeta (eBook $27/$47, asesoría $197/$497)
  para ver de un vistazo cuánta plata hay sobre la mesa. Ej: 23 oportunidades en eBook,
  3 en asesoría ≈ $600.

---

## 6. Métricas de la reunión semanal (lunes)

Justher llega con:
- Mensajes enviados / respondidos (baseline: 100 enviados → 10 respuestas = **10%**).
- Ventas de la semana, desglosadas por producto.
- Tasa de conversión conversación → venta.
- 2–3 **conversaciones tipo**: una donde se trabó y una que salió bien.
- Feedback del formulario nuevo: % que lo completa, calidad de los leads que llegan a WhatsApp.

Del lado de la agencia se hace doble chequeo con la data del sistema.

---

## 7. Tareas y responsables

| # | Tarea | Responsable |
|---|---|---|
| 1 | Entregar el formulario calificador a Justher | Sebastián |
| 2 | Implementar el flujo DM → formulario → WhatsApp (manual y automático) | Justher |
| 3 | Preguntar en el grupo de ventas de WhatsApp, etiquetando a Marcelo (presencia + criterio clínico) | Justher |
| 4 | Cargar valor de oportunidad en las tarjetas del pipeline | Justher |
| 5 | Separar follow-up eBook / follow-up asesoría | Justher / Sebastián |
| 6 | Conversar con Marcelo: bajar el peso del eBook, sumar videos para objeciones | Javier / Sebastián |
| 7 | Reunión con Marcelo (Justher entra al inicio y luego sale) | Todos |
| 8 | Dejar tareas asignadas en Notion | Sebastián |
| 9 | Informar a Marcelo la venta de $497 y descontarla del pago mensual | Javier |

---

## 8. Objetivo comercial

- **Corto plazo:** 9–10 asesorías al mes.
- **Marzo 2027:** promedio ~20 asesorías al mes.
- Acompañado de ads + contenido orgánico.

---

## 9. Pendientes por confirmar

- [ ] Número/Walink definitivo que atiende el setter en WhatsApp.
- [ ] Webhook GHL definitivo para este formulario (¿reusar el del escáner o crear uno nuevo?).
- [ ] Campos personalizados creados en GHL con los nombres del payload.
- [ ] URL de la política de privacidad.
- [ ] Regla fija del descuento $197 → $497.
- [ ] Precio del combo de eBooks.
