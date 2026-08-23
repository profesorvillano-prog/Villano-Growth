# Sistema de Pipelines v2 — Japi Eaters

> **Qué resuelve:** reemplazar los 5 pipelines actuales (partidos por origen:
> orgánico vs. ads) por **4 pipelines partidos por función y por canal**, con dos
> números de WhatsApp, dueños claros y las etapas alineadas a los cuellos de
> botella reales que muestran los datos.
>
> Sustituye a [`Pipeline-Setter-Organico.md`](./Pipeline-Setter-Organico.md), que
> queda como referencia del board de Valen dentro del nuevo `①`.
> Contexto de negocio: [`Operaciones-y-Embudo.md`](./Operaciones-y-Embudo.md).

---

## 0. La decisión de fondo

Hoy los pipelines están partidos por **de dónde vino la lead** (`ORG` vs `ADS`).
Eso duplica etapas, duplica workflows y no le dice a nadie qué tiene que hacer.

A partir de v2 se parten por **quién trabaja y en qué canal**:

```
   ① INSTAGRAM          ② AGENDA              ③ LLAMADAS          ④ VENTAS
   Valen                Anaís → Valen         Rafa                Admin
   DM de Instagram      +52 y +569            —                   —
   ───────────────      ──────────────        ─────────────       ────────────
   Conversación         Del formulario        De la llamada       Del cobro
   hasta que            a la llamada          al cierre           a la venta
   califica             confirmada                                completa
        │                     │                     │                  │
        └──── califica ───────┴──── confirmada ─────┴──── cierra ──────┘
```

El origen (orgánico o pauta) deja de ser un pipeline y pasa a ser una **etiqueta**
(`lead-org` / `lead-ads`), que ya existe y ya está puesta en el 100 % de los
contactos. Se sigue pudiendo comparar org vs. ads — con un filtro, no con dos
tableros paralelos.

---

## 1. Lo que dicen los datos hoy

Medido sobre la cuenta completa el 23/ago/2026:

| Pipeline | Histórico | **Abiertas** |
|---|---:|---:|
| `① [SETTER - ORG]` | 54 | 16 |
| `② [SETTER - ADS]` | 431 | 98 |
| `③ [CLOSER] Agenda` | 239 | 102 |
| `④ [VENTAS] Cobros` | **0** | **0** |
| | **724** | **216** |

Cuatro hallazgos que dictan el diseño de v2:

1. **El pipeline de cobros nunca se usó.** Cero oportunidades en toda su historia.
   Las ventas se registran hoy dentro de `③` (etapas *Paga Reserva* y *Venta High
   Ticket*). Un pipeline que depende de que alguien cree la tarjeta a mano no se
   usa nunca: en v2, `④` se llena solo desde el pago.
2. **El ghosting post-formulario es EL cuello de botella.** 52 de las 98 abiertas
   de `②` (53 %) están en *Ghost - Nueva Agenda*: llenaron el formulario y no
   tomaron hora. Es la fuga más grande del negocio y hoy nadie la trabaja de forma
   sistemática. Por eso `②` en v2 es un pipeline entero dedicado a esto.
3. **El board del closer es un cementerio.** 62 de 102 abiertas (61 %) están en
   *No-Show* o *Follow Up Asistentes*, y 34 de ellas llevan más de 22 días
   quietas. No es falta de leads: es falta de cierre de ciclo.
4. **Las columnas terminales no se cierran solas.** 25 abiertas viven en
   *Descalificada* de `②`, 17 con más de 22 días. Confirma la regla de v2:
   descalificar es un **estado con motivo**, no una columna donde estacionar.

---

## 2. Los dos números de WhatsApp

Definidos por el guion (ver [`Guion-WhatsApp.md`](./Guion-WhatsApp.md)). **No se
reparten por persona, se reparten por función:**

| | Número | Firma | Quién lo opera | Para qué |
|---|---|---|---|---|
| 🟩 | **+52** · WhatsApp Business | **Josefina** | 100 % automático | La marca. Confirma la hora y sostiene la relación. |
| ⬜ | **+569** · Número nuevo | **Rafa** | **Anaís y Rafa** | La persona. Levanta, califica y lleva a la llamada. |

**El Instagram de Valen no es un número de WhatsApp**: `①` vive íntegro en el DM
de Instagram. Los dos números entran en escena recién en `②`, cuando la lead ya
postuló.

**La bisagra es A5.** Antes de A5 el +569 no escribe; después de A5 el +52 solo
manda recordatorios. Un solo punto de traspaso, y está automatizado.

> **Anaís escribe firmando como Rafa** en todo el +569 (M3 a M7 son manuales).
> Los dos necesitan acceso a la misma bandeja. Es una decisión de marca ya
> tomada; el único cuidado es que el tono de Anaís y el de Rafa en la llamada no
> se contradigan.

---

## 3. ① Instagram · Setter — Valen

**7 etapas, íntegramente en el DM de Instagram** — sin WhatsApp. Termina cuando
la lead califica; ahí la tarjeta se gana y nace la de `②`.

| # | Etapa | Quién mueve | Entra | Sale | Color |
|---|---|---|---|---|---|
| 0 | **Bienvenidas** | 🤖 | Seguidora nueva / DM frío | → 1 si responde · → 5 a las 72 h | `#6366F1` |
| 1 | **Conversación** | 🤖 | Contestó cualquier mensaje | → 2 o 3 según lo que pida | `#0D9488` |
| 2 | **CTA Lead Magnet** | 🤖 | Palabra clave / comentario | → 3 al preguntar por la formación | `#F97316` |
| 3 | **CTA Formación** | 👤 Valen | Intención de compra detectada | → 4 al mandar el link | `#7C3AED` |
| 4 | **Link Enviado** | 👤 Valen | Pegó el link del formulario | → 5 a las 48 h · → 6 al llegar | `#CA8A04` |
| 5 | **Ghost DM** | 🤖 | 72 h sin respuesta / 3 toques | → 1 si reaparece · Perdida a 21 d | `#64748B` |
| 6 | **Formulario Completado** | 🤖 | Llegó la postulación | **Gana** si califica → nace en `②` · Perdida con motivo si no | `#3B82F6` |

**La calificación no la decide Valen.** El formulario ya calcula `tier_score` y
`producto_recomendado`; la etiqueta `tier-*` está puesta en el 100 % de los casos
y se ve en la tarjeta. `tier-out` → perdida con motivo, tras el mensaje de
cortesía.

---

## 4. ② Agenda · WhatsApp — Anaís

**El pipeline del show-up, y el que ejecuta el guion completo.** Entra todo el
que postuló y calificó, venga de Instagram o de pauta.

**9 etapas, una por momento del guion.** Textos completos en
[`Guion-WhatsApp.md`](./Guion-WhatsApp.md).

| # | Etapa | Fase · mensajes | Nº | Entra | Sale | Color |
|---|---|---|---|---|---|---|
| 0 | **Calificada (Formulario)** | — | — | Formulario con `tier` ≠ `out` | → 2 si agenda · → 1 a los 10 min sin agendar | `#3B82F6` |
| 1 | **Sin Agendar** | FASE 0 · `G1` `G2` `G3` | +569 | 10 min sin tomar hora | → 2 si agenda · Perdida si dice "ahora no" · caduca a 14 d | `#64748B` |
| 2 | **Nueva Agenda** | FASE 1 · `A1` | +52 | Cita creada | → 4 si cruza el portón · → 3 a los 2 min sin clic · → 8 si cancela | `#0EA5E9` |
| 3 | **Sin Confirmar** | FASE 1 · `A2` | +52 | 2 min sin pulsar *Ver vídeo* | → 4 si confirma · → 8 o Perdida si se libera la hora | `#EA580C` |
| 4 | **Confirmada** | FASE 1 · `A3` `A5` | +52 | Pulsó *Sí, confirmo* | → 5 automático (`A5` activa el +569) | `#16A34A` |
| 5 | **Diagnóstico** | FASE 2 · `M1`–`M6` | +569 | `A5` enviado | → 6 con el `Resumen Lead` escrito | `#7C3AED` |
| 6 | **Pre-Llamada** | FASE 3 · `M7` `M8` | +569 / +52 | Víspera de la llamada | → 7 el día de la cita | `#CA8A04` |
| 7 | **Día de Llamada** | FASE 4 · `M9` `M10` `M11` | +569 | Es el día | **Gana** al entrar a la reunión → `③` | `#0891B2` |
| 8 | **Re-Agendar** | FASE 1 · `A4` | +52 | Pulsó *Cancelar* | → 2 con nueva hora · Perdida a los 14 d | `#C026D3` |

**La etapa 0 no manda ningún mensaje.** El link del calendario va en la página de
gracias del formulario: la lead sale de postular directo a elegir hora. Por eso la
etapa se llama *Calificada (Formulario)* y no *Link Enviado* — el link solo vuelve
a aparecer en `G2` y `G3`, cuando ya no agendó. La etapa 0 es un paso de tránsito:
si funciona, la tarjeta pasa a **2** en segundos.

### Por qué *Nueva Agenda* y *Sin Confirmar* van separadas

Son dos trabajos distintos y una sola columna los escondería:

- **2 · Nueva Agenda** es lo que Anaís quiere ver cada mañana: quién tomó hora
  desde ayer. Es información, no tarea.
- **3 · Sin Confirmar** es cola de trabajo: gente con hora tomada que no cruzó el
  portón y cuya hora está por liberarse. Es la única etapa de toda la FASE 1 que
  puede necesitar mano humana.

Hoy conviven **60 `confirmada` y 8 `sin-confirmar`** en la cuenta: el mecanismo ya
corre, esta es la columna que lo hace visible.

### Las tres cosas que este diseño cambia respecto de v2 inicial

1. **El levantamiento sale a los 10 minutos, no a las 4 horas.** Lo fija `G1`. Es
   la diferencia entre alcanzarla mientras todavía tiene el teléfono en la mano y
   escribirle cuando ya cambió de contexto.
2. **Confirmar no es un recordatorio: es un portón de dos pasos.** *Ver vídeo* →
   *Sí, confirmo*. Quien no lo cruza cae a la etapa 3 y su hora se libera.
3. **Existe una etapa de diagnóstico humano** (`M1`–`M6`) que no estaba
   contemplada. Es donde Anaís califica de verdad y donde se escribe el
   `Resumen Lead` — literalmente el *"[su dolor, en SUS palabras]"* de `M6`.

**La etapa 5 es la que hay que vigilar.** Es la única con seis mensajes, cuatro de
ellos manuales y con ramificación. Si Anaís se atasca, se atasca ahí. El workflow
le sirve la rama correcta (🅐/🅑/🅒) ya elegida según el formulario, para que no
tenga que buscarla.

---

## 5. ③ Llamadas · Closer — Rafa

**6 etapas.** Sale todo lo que sea cobro: eso vive en `④`.

| # | Etapa | Quién mueve | Entra | Sale | Color |
|---|---|---|---|---|---|
| 0 | **En Llamada** | 🤖 | Ganó en `②`6 al entrar a la reunión | → 1 o 2 según asista | `#6366F1` |
| 1 | **Asistió** | 👤 Rafa | Se conectó | → 3 si compra · → 4 si lo piensa | `#0EA5E9` |
| 2 | **No-Show** | 🤖 | No se conectó | → `②` etapa 5 para reagendar · Perdida a 14 d | `#EF4444` |
| 3 | **Cerrada · Va a Pagar** | 👤 Rafa | Dijo que sí | **Gana** → nace en `④` | `#16A34A` |
| 4 | **Seguimiento** | 👤 Rafa | Lo está pensando | → 3 si cierra · Perdida a 21 d con motivo | `#C026D3` |
| 5 | **Reagendada** | 👤 Rafa | Cambió la hora | → 0 con la nueva fecha | `#CA8A04` |

**El cambio que arregla el cementerio:** hoy *No-Show* y *Follow Up Asistentes*
no tienen fecha de caducidad y acumulan 62 tarjetas. En v2 las dos tienen cierre
automático (14 y 21 días) y el no-show vuelve a `②` para que lo levante el número
de agenda, en vez de morir en el board del closer.

---

## 6. ④ Ventas · Cobros — Admin

**Se llena solo, desde el pago.** Nadie crea tarjetas a mano — por eso el actual
lleva 0 en toda su historia.

| # | Etapa | Quién mueve | Entra | Color |
|---|---|---|---|---|
| 0 | **Cuota de Entrada Pagada** | 🤖 | Primer pago recibido | `#0891B2` |
| 1 | **Pago Cuota 1** | 🤖 | Cobro confirmado | `#0EA5E9` |
| 2 | **Pago Cuota 2** | 🤖 | Cobro confirmado | `#3B82F6` |
| 3 | **Pago Cuota 3** | 🤖 | Cobro confirmado | `#6366F1` |
| 4 | **Pago Fallido · En Riesgo** | 🤖 | Cobro rechazado o vencido | `#DC2626` |
| 5 | **Venta Total** | 🤖 | Última cuota pagada → **Gana** | `#16A34A` |

La etapa 4 es la que no existe hoy y la que da el control que pediste: sin ella,
una cuota rechazada es invisible hasta que alguien revisa Stripe a mano.

---

## 7. Vocabulario de etiquetas

Se conserva **todo** el vocabulario actual. No se renombra nada — eso rompería
workflows vivos. Solo se añaden las tres que faltan.

| Etiqueta | Estado | Qué marca |
|---|---|---|
| `lead-org` · `lead-ads` | ✅ existe | Origen. **Reemplaza a tener dos pipelines.** |
| `survey-org` · `survey-ads` | ✅ existe | Llenó el formulario |
| `tier-gold/silver/bronce/out` | ✅ existe | Calificación automática del formulario |
| `agenda-org` · `agenda-ads` | ✅ existe | Tomó hora |
| `ghost-agenda` | ✅ existe | Llenó y no agendó |
| `confirmada` · `sin-confirmar` | ✅ existe | Estado de confirmación |
| `sin-presupuesto` · `presupuesto-alto` | ✅ existe | Señal de ticket |
| `bienvenida-enviada` | 🆕 nueva | Se mandó el saludo inicial (la pone ManyChat) |
| `cta-leadmagnet` · `cta-formacion` | 🆕 nuevas | Intención detectada en el DM |
| `no-show` | 🆕 nueva | No se presentó a la llamada |

---

## 8. Workflows

Dieciocho en total. Los cinco marcados **★** son los que mueven la aguja: con
esos el sistema ya opera.

### Pipeline ① — Instagram

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W1 | Crear oportunidad IG | Tag `bienvenida-enviada` | Crea en `①`/0, asigna a Valen, source `[IG] Bienvenida` |
| W2 | Respondió | Mensaje entrante | Si está en 0 → mueve a 1 |
| W3 | Intención | Tag `cta-leadmagnet` / `cta-formacion` | Crea o mueve a 2 / 3 |
| W4 | Ghost DM | 72 h sin respuesta | → 5 · Perdida a 21 d |

### Pipeline ② — Agenda ★

Cada workflow ejecuta una fase del guion. Los identificadores (`G1`, `A3`, `M6`…)
remiten a [`Guion-WhatsApp.md`](./Guion-WhatsApp.md).

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| **W5 ★** | **Calificada** | Formulario enviado **y** `tier` ≠ `out` | Gana la tarjeta de `①` · Crea en `②`/0 · La página de gracias la manda al calendario |
| W6 | Descalificada | Formulario con `tier-out` | `M13` por el +569 · Perdida con motivo. **No entra a `②`** |
| **W7 ★** | **Levantamiento · FASE 0** | **10 min** en etapa 0 sin cita | → 1 · Tag `ghost-agenda` · `G1` +569 · `G2` a las 3 h · `G3` manual al día siguiente · Si responde "ahora no" → Perdida |
| W8 | Nueva agenda | Cita creada | → 2 · Tag `agenda-*` · Dispara `A1` por el +52 |
| **W9 ★** | **Portón de confirmación · FASE 1** | Etapa 2 | `A2` a los 2 min sin clic → 3 · Al pulsar *Ver vídeo* → `A3` + tag `video-enviado` · Al confirmar → 4, tag `confirmada`, dispara `A5` · Al cancelar → 8 con `A4` |
| **W10 ★** | **Diagnóstico · FASE 2** | `A5` enviado (activa el +569) | → 5 · `M1` a los 5 min, `M2` a los 5 seg · Sirve a Anaís la rama 🅐/🅑/🅒 según *"¿Con qué situación te identificas más hoy?"* · Tarea: escribir el `Resumen Lead` con el texto de `M6` |
| W11 | Pre-llamada · FASE 3 | Víspera | → 6 · Tarea a Anaís para `M7a-c` · `M8` automático por el +52 esa noche |
| W12 | Día de llamada · FASE 4 | Es el día | → 7 · `M9` en la mañana · `M10` 15 min antes · Tarea `M11` a la hora · Gana y crea en `③`/0 |
| W13 | Caducidad | 14 d en 1 o en 8 | Perdida con motivo obligatorio |

### Pipeline ③ — Llamadas

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W14 | No-show | Rafa marca etapa 2 | Tag `no-show` · **`M12` a las 2 h** · Devuelve a `②`/8 para reagendar |
| W15 | Caducidad | 14 d en 2 · 21 d en 4 | Perdida con motivo obligatorio |
| **W16 ★** | **Cierre → Cobro** | Rafa mueve a etapa 3 | Gana en `③` · Crea en `④`/0 · `M15` con el link de pago |

### Pipeline ④ — Ventas

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W17 | Pago recibido | Webhook de pago | Avanza a la cuota que corresponda |
| W18 | Pago fallido | Webhook de rechazo | → 4 · Avisa a admin · `M16` |

---

## 9. Estado de los textos

Los textos de `②` **ya están** — son el guion de WhatsApp, transcrito y mapeado
etapa por etapa en [`Guion-WhatsApp.md`](./Guion-WhatsApp.md): 3 mensajes de
levantamiento, 5 de confirmación, 6 de diagnóstico con 8 variantes ramificadas,
4 de pre-llamada y 3 del día de la llamada.

Lo que falta escribir, por orden de lo que cuesta no tenerlo:

| Slot | Nº | Cuándo | Por qué importa |
|---|---|---|---|
| **`M12` Rescate de no-show** | +569 | 2 h después de la hora perdida | **34 no-shows abiertos**, 20 con más de 22 días. Gente que llegó al final del embudo y no tiene ni un mensaje escrito. |
| `M13` Cortesía a descalificada | +569 | Formulario con `tier-out` | El 27 % de las descalificadas lo son por presupuesto, no por perfil. Hoy no reciben nada. |
| `M14` Post-llamada · seguimiento | +569 | Tras la reunión | Sostiene la decisión. Vive en `③` etapa 4. |
| `M15` Link de pago | +569 | Al cerrar | Vive en `③` etapa 3 → `④`. |
| `M16` Cuota fallida | +569 | Rechazo de cobro | Vive en `④` etapa 4. |

### Y los del pipeline ① (Instagram), que son otro canal

`①` no usa WhatsApp: son DMs de Instagram. Sus textos siguen pendientes —
bienvenida, entrega de lead magnet, envío del formulario y recordatorio a 48 h.

---

## 10. Migración de las oportunidades vivas

**Corrección importante:** en el mensaje anterior dije 54 oportunidades vivas. Ese
54 es el histórico completo de `①` únicamente. El número real de **abiertas en
toda la cuenta es 216**. La decisión de migrar solo las activas sigue siendo la
correcta, pero el volumen es otro y conviene que lo sepas antes de arrancar.

Criterio de **activa**: abierta y con movimiento en los últimos 21 días.

| Origen | Abiertas | **Activas → migran** | Se cierran como perdidas |
|---|---:|---:|---:|
| `①` ORG | 16 | 13 | 3 |
| `②` ADS | 98 | 60 | 38 |
| `③` CLOSER | 102 | 47 | 55 |
| **Total** | **216** | **120** | **96** |

### Mapeo etapa por etapa

| Etapa actual | → Destino v2 |
|---|---|
| `①` Formulario [ORG] · `②` Formulario [ADS] | `②` 0 · Calificada · Link Enviado |
| `①` Ghost Intento Agenda · `②` Ghost - Nueva Agenda | `②` 2 · Ghost Agenda |
| `①` Nuevas Agendas · `②` Nuevas Agendas | `②` 1 · Agenda Tomada |
| `①` Llamada Confirmada · `②` Llamada Confirmada | `②` 3 · Confirmada |
| `①` Cancelada · `②` Cancelada (Re-Agendar) | `②` 5 · Reagendar |
| `①` Primer Contacto · Follow Up · `②` Follow Up | `①` 1 · Conversación |
| `①` Ghost - Primer Contacto | `①` 5 · Ghost DM |
| `③` Llamada Confirmada Setter | `③` 0 · Llamada Hoy |
| `③` Asistió | `③` 1 · Asistió |
| `③` No-Show Llamada | `③` 2 · No-Show |
| `③` Follow Up Asistentes | `③` 4 · Seguimiento |
| `③` Cancelada Última Hora | `③` 5 · Reagendada |
| `③` Paga Reserva | `④` 0 · Cuota de Entrada Pagada |
| `③` Venta High Ticket | `④` 5 · Venta Total |
| Descalificada (ambos) | Perdida · motivo *No cualifica* |

> **La migración sí es automatizable.** La API de GHL permite cambiar pipeline y
> etapa de una oportunidad existente (`PUT /opportunities/{id}`). Las 120 activas
> se pueden mover por script en una pasada, y las 96 restantes cerrarse con su
> motivo. Lo que **no** se puede crear por API son los pipelines y sus etapas
> (§13) — eso va a mano una sola vez.

---

## 11. Permisos por persona

Todos entran como **User**, nunca Admin, y con **"Allow Assigned Data Only"
apagado** (si no, no ven las listas compartidas).

| | Valen | Anaís | Rafa |
|---|---|---|---|
| Pipelines que trabaja | `①` | `②` | `③` |
| Pipelines que ve | `①` `②` | `②` `③` | `②` `③` `④` |
| Contactos · Conversaciones | ✅ | ✅ | ✅ |
| Calendarios | ver | **gestionar** | **gestionar** |
| Workflows · Ajustes · Pagos | ❌ | ❌ | ❌ |
| Número asignado | — (DM de IG) | **+569** | **+569** |
| Bandeja del +52 | — | ver | ver |

El **+52 no lo opera nadie**: es 100 % automático y sale con la firma de Josefina.
El **+569 lo comparten Anaís y Rafa** — los dos escriben firmando como Rafa, así
que necesitan la misma bandeja.

Cuando `②` pase de Anaís a Valen, es un solo cambio: darle acceso al +569 y
reasignar las tarjetas abiertas de `②`. La estructura no se toca.

---

## 12. Métricas de control

Una por transición. Si una cae, se sabe exactamente quién y qué hay que arreglar.

| Métrica | Cálculo | Dueño | Referencia de arranque |
|---|---|---|---|
| Respuesta a bienvenida | `①`1 ÷ `①`0 | Valen | 15-25 % |
| Link → Formulario | `①`6 ÷ `①`4 | Valen | 30-40 % |
| **Formulario → Agenda** | `②`2 ÷ `②`0 | Anaís | **hoy ~47 %** |
| Rescate de ghost | salidas de `②`1 hacia 2 | Anaís | a medir |
| **Cruce del portón** | `②`4 ÷ `②`2 | automático | **hoy ~88 %** (60 `confirmada` vs. 8 `sin-confirmar`) |
| Diagnóstico completado | tarjetas de `②`5 con `Resumen Lead` | Anaís | **objetivo 100 %** |
| **Show-up rate** | `③`1 ÷ (`③`1+`③`2) | Anaís | **hoy ~39 %** |

La métrica que resume el guion entero es el show-up: `G1` a los 10 min, el portón
de `A3` y el vídeo personalizado de `M7b` existen todos para moverla.

| Cierre | `③`3 ÷ `③`1 | Rafa | a medir |
| Cobro completo | `④`5 ÷ `④`0 | Admin | a medir |

Los dos números de "hoy" salen de las abiertas actuales (52 ghost vs. 46 con
agenda; 34 no-show vs. 22 asistió) y son una foto de las vivas, no una serie
histórica. Sirven de línea base para saber si v2 mejora algo.

---

## 13. Orden de implementación

1. **Crear los 4 pipelines nuevos** con sus etapas y colores *(a mano — la API de
   GHL no crea pipelines; Opportunities → ⚙ Manage Pipelines)*.
2. **Crear las 4 etiquetas nuevas** y los motivos de pérdida.
3. **Montar W5, W7, W9, W10 y W16** — los cinco ★. Con esos el sistema ya opera.
4. **Cargar el guion** (`G1`-`G3`, `A1`-`A5`, `M1`-`M11`) en sus workflows. El +52
   necesita plantillas aprobadas por Meta antes de poder enviar `A1`, `A2`, `A3`,
   `A4`, `A5` y `M8` — empezar ese trámite el día 1, es el camino crítico.
5. **Migrar las 120 activas** por script y cerrar las 96 restantes con motivo.
6. **Archivar los pipelines viejos** (ocultar, no borrar: conservan el histórico
   de 724 oportunidades para reportes).
7. **Dar de alta a los 3 usuarios** con los permisos de §11.
8. **Montar el resto de workflows** (W1-W4, W6, W8, W10-W12, W14-W15).
9. A los 7 días: revisar las métricas de §12 contra la línea base.
