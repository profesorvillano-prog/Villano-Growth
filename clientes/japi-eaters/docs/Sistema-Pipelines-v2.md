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
   IG DM + WhatsApp №1  WhatsApp №2           —                   —
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

| | Número | Quién lo usa | Para qué |
|---|---|---|---|
| **№1** | WhatsApp Instagram | **Valen** | Todo lo que sale del DM de IG. Conversación, lead magnets, envío del formulario. |
| **№2** | WhatsApp Agenda | **Anaís** (luego Valen) | Levantamiento y confirmación de agenda. **Solo dos trabajos: que agende y que se presente.** |

La frontera es el formulario: mientras conversa, es del №1; en cuanto califica,
pasa al №2. Nunca los dos números escriben a la misma persona el mismo día.

> **Por qué separar los números y no solo los pipelines:** el №2 solo manda
> mensajes de agenda y confirmación. Eso mantiene su reputación alta y su tasa de
> entrega intacta — que es literalmente el show-up rate. Si el mismo número manda
> lead magnets y contenido, se quema y los recordatorios dejan de llegar.

---

## 3. ① Instagram · Setter — Valen

**7 etapas.** Termina cuando la lead califica; ahí la tarjeta se gana y nace la
de `②`.

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

**El pipeline del show-up.** Entra **todo** el que llenó el formulario y calificó,
venga de Instagram o de pauta. Es el que reemplaza a los dos `Formulario [ORG]` /
`Formulario [ADS]` de hoy.

Según la regla acordada: la lead calificada recibe el link de agenda directamente,
y de ahí solo hay dos caminos — **agenda** o **no agenda** — y los dos disparan
mensaje automático por el №2.

| # | Etapa | Quién mueve | Entra | Sale | Color |
|---|---|---|---|---|---|
| 0 | **Calificada · Link Enviado** | 🤖 | Formulario + `tier` ≠ `out` | → 1 si agenda · → 2 a las 4 h sin agendar | `#3B82F6` |
| 1 | **Agenda Tomada** | 🤖 | Cita creada | → 3 si confirma · → 4 si no responde | `#0EA5E9` |
| 2 | **Ghost Agenda** | 🤖 | 4 h con link y sin hora | → 1 si agenda · Perdida a los 14 d | `#64748B` |
| 3 | **Confirmada** | 🤖 | Respondió "sí" al mensaje del №2 | **Gana** el día de la llamada → `③` | `#16A34A` |
| 4 | **Sin Confirmar** | 👤 Anaís | 24 h antes y no respondió | → 3 si confirma · → `③` igual, marcada en riesgo | `#EA580C` |
| 5 | **Reagendar** | 👤 Anaís | Canceló o pidió cambio | → 1 con nueva hora · Perdida a los 14 d | `#C026D3` |

Las etiquetas de estas etapas **ya existen y ya se usan**: `agenda-org`,
`agenda-ads`, `ghost-agenda` (46 contactos), `confirmada` (60), `sin-confirmar`
(8). No hay vocabulario nuevo que aprender.

**Las dos automatizaciones que suben el show-up** (contenido en §8):

- **Levantamiento de ghost** — sale a las 4 h de la etapa 2. Pregunta por qué no
  agendó. Ataca directamente el 53 % que hoy se pierde ahí.
- **Confirmación** — sale a las 24 h y a las 2 h de la llamada. Quien no responde
  a ninguno cae en *Sin Confirmar* y lo trabaja Anaís a mano.

---

## 5. ③ Llamadas · Closer — Rafa

**6 etapas.** Sale todo lo que sea cobro: eso vive en `④`.

| # | Etapa | Quién mueve | Entra | Sale | Color |
|---|---|---|---|---|---|
| 0 | **Llamada Hoy** | 🤖 | Es el día de la cita | → 1 o 2 según asista | `#6366F1` |
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

Los cuatro marcados **★** son los que mueven la aguja. Si solo se montan esos, el
sistema ya funciona.

### Pipeline ① — Instagram

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W1 | Crear oportunidad IG | Tag `bienvenida-enviada` | Crea en `①`/0, asigna a Valen, source `[IG] Bienvenida` |
| W2 | Respondió | Mensaje entrante | Si está en 0 → mueve a 1 |
| W3 | Intención | Tag `cta-leadmagnet` / `cta-formacion` | Crea o mueve a 2 / 3 |
| W4 | Ghost DM | 72 h sin respuesta | → 5 · Perdida a 21 d |

### Pipeline ② — Agenda ★

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| **W5 ★** | **Calificada → Agenda** | Formulario enviado **y** `tier` ≠ `out` | Gana la tarjeta de `①` · Crea en `②`/0 · **Manda link de agenda por el №2** |
| W6 | Descalificada | Formulario con `tier-out` | Mensaje de cortesía · Perdida con motivo. **No entra a `②`** |
| **W7 ★** | **Levantamiento de ghost** | 4 h en etapa 0 sin cita | → 2 · Tag `ghost-agenda` · **Mensaje №2 · Reintentos día 1, 3 y 7** |
| W8 | Agenda tomada | Cita creada | → 1 · Tag `agenda-*` |
| **W9 ★** | **Confirmación** | 24 h y 2 h antes de la cita | **Mensaje №2** · Si responde → 3 · Si no → 4 |
| W10 | Día de la llamada | Hora de la cita | Gana en `②` · Crea en `③`/0 · Avisa a Rafa |

### Pipeline ③ — Llamadas

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W11 | No-show | Rafa marca etapa 2 | Tag `no-show` · Devuelve a `②`/5 a las 2 h |
| W12 | Caducidad | 14 d en 2 · 21 d en 4 | Perdida con motivo obligatorio |
| **W13 ★** | **Cierre → Cobro** | Rafa mueve a etapa 3 | Gana en `③` · Crea en `④`/0 · Manda link de pago |

### Pipeline ④ — Ventas

| # | Workflow | Disparador | Acción |
|---|---|---|---|
| W14 | Pago recibido | Webhook de pago | Avanza a la cuota que corresponda |
| W15 | Pago fallido | Webhook de rechazo | → 4 · Avisa a admin · Secuencia de recuperación |

---

## 9. Plantillas de mensajes — huecos a rellenar

Esta es la parte que falta y que vas a entregar. La estructura ya define **cuántos
mensajes hacen falta, por qué número salen y qué tiene que lograr cada uno**:

| Slot | Número | Cuándo sale | Objetivo del mensaje |
|---|---|---|---|
| `M1` Bienvenida IG | №1 | Seguidora nueva | Abrir conversación, no vender |
| `M2` Entrega lead magnet | №1 | Pide el recurso | Entregar + puente a la formación |
| `M3` Envío del formulario | №1 | Detecta intención | Que lo llene hoy |
| `M4` Recordatorio de formulario | №1 | 48 h sin llenar | Reducir fricción, no insistir |
| `M5` Cortesía a descalificada | №1 | `tier-out` | Cerrar bien, dejar puerta abierta |
| **`M6` Link de agenda** | **№2** | Califica | **Que tome hora en el mismo mensaje** |
| **`M7` Levantamiento de ghost** | **№2** | 4 h sin agendar | **Descubrir el bloqueo real** |
| `M8` Ghost · reintento 2 y 3 | №2 | Día 3 y día 7 | Ángulo distinto cada vez |
| **`M9` Confirmación 24 h** | **№2** | Víspera | **Respuesta explícita, no informativa** |
| **`M10` Recordatorio 2 h** | **№2** | Mismo día | **Que se conecte** |
| `M11` Rescate de no-show | №2 | 2 h después | Reagendar sin culpa |
| `M12` Post-llamada seguimiento | №2 | Tras la llamada | Sostener la decisión |
| `M13` Link de pago | №2 | Cierre | Cobrar sin fricción |
| `M14` Cuota fallida | №2 | Rechazo | Recuperar sin dañar la relación |

**Cuando me pases los textos, los mapeo a estos slots y quedan listos para
pegar en cada workflow.** Los cuatro en negrita son los que determinan el
show-up rate.

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
| Número asignado | №1 | №2 | №2 |

Cuando `②` pase de Anaís a Valen, es un solo cambio: reasignar el número №2 y las
tarjetas abiertas de `②`. La estructura no se toca.

---

## 12. Métricas de control

Una por transición. Si una cae, se sabe exactamente quién y qué hay que arreglar.

| Métrica | Cálculo | Dueño | Referencia de arranque |
|---|---|---|---|
| Respuesta a bienvenida | `①`1 ÷ `①`0 | Valen | 15-25 % |
| Link → Formulario | `①`6 ÷ `①`4 | Valen | 30-40 % |
| **Formulario → Agenda** | `②`1 ÷ `②`0 | Anaís | **hoy ~47 %** |
| Rescate de ghost | salidas de `②`2 hacia 1 | Anaís | a medir |
| **Show-up rate** | `③`1 ÷ (`③`1+`③`2) | Anaís | **hoy ~39 %** |
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
3. **Montar W5, W7, W9 y W13** — los cuatro ★. Con esos el sistema ya opera.
4. **Recibir las plantillas M1–M14** y pegarlas en sus workflows.
5. **Migrar las 120 activas** por script y cerrar las 96 restantes con motivo.
6. **Archivar los pipelines viejos** (ocultar, no borrar: conservan el histórico
   de 724 oportunidades para reportes).
7. **Dar de alta a los 3 usuarios** con los permisos de §11.
8. **Montar el resto de workflows** (W1-W4, W6, W8, W10-W12, W14-W15).
9. A los 7 días: revisar las métricas de §12 contra la línea base.
