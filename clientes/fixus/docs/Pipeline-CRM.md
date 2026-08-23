# Pipeline CRM — FIXUS

> **Qué resuelve este documento:** cómo se arma el embudo dentro del CRM
> (GoHighLevel), dónde termina la responsabilidad de la agencia y cómo FIXUS
> registra la venta presencial sin tener que aprender el CRM.
>
> Estrategia de origen: [`Embudo-Estrategia.md`](./Embudo-Estrategia.md).
> Pagos y workflows: [`Automatizaciones-y-Pago.md`](./Automatizaciones-y-Pago.md).

---

## 0. El principio de diseño

La agencia **vende la entrada**; FIXUS **vende el plan**. El CRM tiene que reflejar
exactamente esa línea:

```
        ─────────── AGENCIA (automatizado) ───────────┃── FIXUS (presencial) ──
                                                      ┃
 Anuncio → Landing → Pago entrada → Agenda → Asiste   ┃   Vende el plan → Ganado/Perdido
                                                      ┃
        1        2         3          4        5      ┃          6
                                                      ┃
                                              línea de traspaso
```

Tres consecuencias de diseño que hay que respetar:

1. **El CRM no toca la operación.** Solo entran los **dos productos de entrada**.
   Planes, recovery, nutrición y 1 a 1 siguen viviendo en Xflow. El CRM es de
   marketing, no de gestión del centro.
2. **FIXUS solo hace una cosa en el CRM:** decir si la persona compró el plan o no.
   Todo lo demás lo hace el sistema. Si les pedimos más, no lo van a hacer.
3. **Los dos embudos nunca se mezclan** — ni en pauta, ni en landing, ni en CRM.

---

## 1. Estructura: dos pipelines, no uno

Se crean **dos pipelines separados** en GoHighLevel, con la **misma arquitectura de
etapas** y contenido distinto:

| Pipeline | Nombre exacto en GHL |
|---|---|
| Embudo A | `FIXUS · 3 a 1` |
| Embudo B | `FIXUS · Kinesiología` |

**Por qué separados y no un solo pipeline con un campo `servicio`:**

- Los tickets son de otro orden ($98–115k vs $300k) y mezclarlos rompe cualquier
  promedio de facturación.
- La geo, el avatar, el ciclo de decisión y la tasa de asistencia esperada son
  distintos. Un embudo único obliga a filtrar siempre y nadie filtra siempre.
- El panel Cerebro guarda el embudo con clave `cliente + fecha + pipeline_name`
  (ver `cerebro/docs/make-automations.md`). Dos pipelines = dos series limpias en
  el tablero, sin trabajo extra.
- Es la regla dura del documento de estrategia: *nunca mezclados*.

> Costo de la decisión: hay que duplicar workflows. Es real pero acotado — se
> construye uno y se clona cambiando producto, precio, calendario y copy.

---

## 2. Las 6 etapas

Idénticas en ambos pipelines. La columna **Quién mueve** es lo importante: solo la
etapa 6 es humana.

| # | Etapa | Quién mueve | Disparador de entrada | Salidas |
|---|---|---|---|---|
| 1 | **Pago iniciado** | 🤖 automático | Abrió el checkout / se creó usuario en Xflow y no pagó | → 2 si paga · → Perdido a las 24 h |
| 2 | **Entrada pagada · por agendar** | 🤖 automático | **Pago aprobado** (webhook o formulario post-pago) | → 3 al agendar · → 2 con nudges 1 h / 24 h / 48 h |
| 3 | **Agendado** | 🤖 automático | Cita creada en el calendario del CRM | → 5 si asiste · → 4 si no |
| 4 | **No asistió · recuperar** | 🤖 automático | Cita marcada *No-Show*, o 2 h después de la hora sin marca | → 3 si reagenda · → Perdido a los 10 días |
| 5 | **Asistió · esperando resultado** | 🤖 automático | Cita marcada *Showed* o formulario del profesor | → 6 (Ganado) · → Perdido |
| 6 | **Plan vendido** | 🙋 **FIXUS** | El profesional confirma la venta del plan | Estado **Ganado** |

**Estados de la oportunidad (`status` de GHL, no etapas):**

- `Open` — en las etapas 1 a 5.
- `Won` — al llegar a la etapa 6. Se registra `monto_plan`.
- `Lost` — desde **cualquier** etapa, siempre con `motivo_perdida` obligatorio.
- `Abandoned` — no se usa. Todo lo que muere es `Lost` con motivo, o la métrica
  deja de ser interpretable.

### Por qué la etapa 1 existe aunque a veces quede vacía

En el flujo ideal la persona **no entrega datos antes de pagar**, así que en la
ruta Mercado Pago la etapa 1 solo se llena si el checkout captura el email antes
de aprobar el pago. En la ruta Xflow, en cambio, sí se llena siempre (Xflow obliga
a crear usuario primero) y ahí vale oro: **es la recuperación de carrito
abandonado**, y con un producto de $8.990 esa recuperación es el ingreso más barato
del embudo.

Si la ruta elegida no permite capturar nada antes del pago, la etapa 1 queda vacía
y **no pasa nada** — el embudo empieza en la 2. No se elimina la etapa: se deja
para cuando la ruta de pago lo permita.

### Por qué "No asistió" es etapa y no motivo de pérdida

Porque un no-show **no es una pérdida, es un reagendamiento pendiente** — la
persona ya pagó. Y porque *tasa de asistencia* es la métrica de riesgo número uno
del embudo: tiene que ser una columna que se ve, no un filtro que hay que buscar.
Recién a los 10 días y tras 3 intentos pasa a `Lost`.

---

## 3. Valor de la oportunidad

| Momento | Valor de la oportunidad | Por qué |
|---|---|---|
| Al crearse (etapa 2) | Precio de entrada ($8.990 / $24.990) | El pipeline muestra el ingreso ya cobrado, no una proyección |
| Al marcarse Ganado (etapa 6) | `monto_entrada + monto_plan` | Ingreso real atribuible a la pauta |

**Plan mensual:** `monto_plan` = **primer pago** (no el LTV). El trimestral se
carga completo porque se cobra completo. Se guarda `tipo_plan` aparte para poder
calcular LTV cuando FIXUS tenga el dato de permanencia media — hoy no lo tiene y
**no hay que inventarlo**.

**Descuento de la entrada:** si se confirma que la clase de prueba se descuenta del
plan, `monto_plan` se registra **ya descontado** (lo efectivamente cobrado) y se
marca `descuento_entrada_aplicado = Sí`. Así la facturación del panel es caja real.

---

## 4. Campos personalizados

### Contacto

| Campo | Tipo | Para qué |
|---|---|---|
| `rut` | Texto | **Boleta automática Simple Factura** (crítico para el reembolso de kine) |
| `comuna` | Desplegable | Validar la geo de pauta contra la geo real que convierte |
| `avatar_origen` | Desplegable | Qué ángulo lo trajo: `3a1-no-se-que-hacer`, `3a1-deportista-finde`, `3a1-oficina`, `kine-deportista-lesionado`, `kine-dolor-cronico` |
| `acepta_whatsapp` | Sí/No | Consentimiento explícito para la capa de recordatorios |

### Oportunidad

| Campo | Tipo | Quién lo llena |
|---|---|---|
| `servicio` | Desplegable: `3 a 1` / `Kinesiología` | 🤖 |
| `producto_entrada` | Desplegable: `Clase de prueba` / `Evaluación kinesiológica` | 🤖 |
| `monto_entrada` | Número | 🤖 |
| `medio_pago` | Desplegable: `Xflow` / `Mercado Pago` / `Presencial` | 🤖 |
| `id_transaccion` | Texto | 🤖 — **clave anti-duplicados** |
| `fecha_pago` | Fecha | 🤖 |
| `profesor_asignado` | Desplegable (los 3 del 3 a 1 + kine) | 🤖 desde la cita |
| `fecha_cita` | Fecha y hora | 🤖 |
| `intentos_reagenda` | Número | 🤖 |
| `plan_vendido` | Desplegable: `Mensual 2x`, `Trimestral`, `10 sesiones kine`, `1 a 1`, `Nutrición`, `Ninguno` | 🙋 FIXUS |
| `monto_plan` | Número | 🙋 FIXUS |
| `descuento_entrada_aplicado` | Sí/No | 🙋 FIXUS |
| `motivo_perdida` | Desplegable (ver abajo) | 🙋 FIXUS / 🤖 |
| `utm_source`, `utm_campaign`, `utm_content`, `utm_term`, `landing_url`, `click_id` | Texto | 🤖 desde la landing |

> `utm_content` es el campo que conecta la venta del plan con **el anuncio
> concreto** que la trajo. Sin él no se puede optimizar creatividad, solo campaña.

### Motivos de pérdida (lista cerrada, obligatoria)

`Precio` · `Horarios no le calzan` · `Distancia` · `Esperaba clase grupal` ·
`Se fue a otro centro` · `Lesión / motivo médico` · `No asistió (3 intentos)` ·
`Sin respuesta` · `Otro`

**Lista cerrada a propósito.** Con campo libre cada quien escribe distinto y en dos
meses no se puede agrupar nada. `Esperaba clase grupal` está separado porque mide
directamente el riesgo de confusión de formato: si sube, el problema está en la
landing o en el anuncio, no en el precio.

### Etiquetas

`fixus` · `3a1` · `kine` · `pago-entrada` · `agendado` · `no-show` · `asistio` ·
`plan-vendido` · `perdido` · `reactivacion` · `puente-1a1` · `puente-kine-entreno` ·
`testimonio-candidato`

Los dos `puente-*` registran los efectos secundarios esperados del documento (3 a 1
→ 1 a 1, kine → entrenamiento). No se pautan, pero **sí se cuentan**: son valor
real que la pauta genera y que de otro modo queda invisible.

---

## 5. La línea de traspaso: cómo FIXUS marca el resultado

Este es el punto que decide si el sistema funciona. Todo lo anterior es
automatizable; esto no. Tres vías, en orden de preferencia:

### Vía A — Formulario de cierre *(recomendada)*

Una hora después de que termina la clase o evaluación, el **profesor asignado**
recibe por WhatsApp/email un link único ya vinculado a esa oportunidad:

> *"Cerrar clase de prueba — María Pérez, hoy 18:00"*

Cuatro preguntas, veinte segundos, desde el teléfono:

1. ¿Asistió? · Sí / No
2. ¿Compró plan? · Sí / No / Lo está pensando
3. ¿Cuál y por cuánto? *(desplegable + monto, se autocompleta con el precio de lista)*
4. Si no compró: motivo *(lista cerrada)*

El envío del formulario mueve la oportunidad y rellena todos los campos.

**Por qué esta es la buena:** ningún profesor tiene que aprender el CRM, tener
cuenta, ni acordarse de entrar. El sistema los busca a ellos. Y como todos
responden el mismo formulario, la conversión presencial queda **comparable entre
profesores** — que es exactamente el riesgo #2 del documento de estrategia
("si cada profesor cierra distinto, la métrica no es interpretable").

### Vía B — App móvil de GHL *(para Natalia)*

Natalia con usuario en el CRM, arrastra la tarjeta a *Plan vendido* y marca Ganado
con el monto. Útil para casos que llegan por otro camino (alguien que compró dos
días después por WhatsApp). Su usuario se limita a los dos pipelines de FIXUS.

### Vía C — Revisión semanal *(red de seguridad, no el mecanismo)*

El jueves, en la tarea `x-med` que ya existe en el planificador de Cerebro
(*"Marcar leads asistidos (ganado/perdido) en CRM"*), se repasan con Natalia las
oportunidades que quedaron sin resultado y se cierran.

### Regla de higiene

Si una oportunidad lleva **72 h en la etapa 5** sin resultado, se dispara:
recordatorio al profesor a las 24 h, y tarea a Natalia + aviso a la agencia a las
72 h. Una etapa 5 que se acumula significa que la métrica de conversión presencial
está muerta, y hay que verlo la misma semana, no en la reunión de fin de mes.

---

## 6. Qué **no** entra al pipeline

Decisiones explícitas para que el CRM no se convierta en el sistema del centro:

- ❌ Cobros de planes mensuales, renovaciones y recurrencia → **Xflow**.
- ❌ Recovery, nutrición, 1 a 1 y clases de plan → **Xflow**.
- ❌ Fichas clínicas, evoluciones y contenido de las sesiones → **Xflow**. El CRM
  solo lee **disponibilidad** del calendario: ve "ocupado", no de qué se trata.
- ❌ Leads que no pagaron entrada y llegaron por WhatsApp orgánico → no entran a
  estos pipelines. Si se quieren medir, van a un pipeline aparte para no ensuciar
  el costo por entrada vendida.

---

## 7. Orden de implementación

| Fase | Qué se hace | Bloqueado por |
|---|---|---|
| **1 · Esqueleto** | Subcuenta GHL, 2 pipelines, 6 etapas, campos, etiquetas, motivos de pérdida | Acceso a GHL de FIXUS |
| **2 · Entrada** | Ruta de pago + página de gracias con captura de RUT + calendarios sincronizados | Decisión Xflow vs Mercado Pago · calendarios del equipo |
| **3 · Asistencia** | Workflows W1–W5: confirmaciones, nudges, recordatorios, no-show | Número de WhatsApp definido |
| **4 · Cierre** | Formulario de cierre + W6–W8 + alertas de 72 h | Nombres/contactos de los 3 profesores + kine |
| **5 · Medición** | Escenarios Make → Supabase (`ventas`, `ht_pipeline`) | Fases 1–4 corriendo |

**La fase 2 es la que bloquea el encendido de pauta.** Y tiene una salida que no
depende de nadie externo — ver *Ruta C* en
[`Automatizaciones-y-Pago.md`](./Automatizaciones-y-Pago.md).

---

## 8. Lo que necesitamos de FIXUS para armarlo

**Bloquean el armado:**

- [ ] Acceso a la subcuenta de GoHighLevel (o luz verde para crearla).
- [ ] Decisión de ruta de pago: Xflow, Mercado Pago o página de gracias.
- [ ] Nombres, correos y teléfonos de **los 3 profesores del 3 a 1 + kinesiología**
      (para `profesor_asignado`, el formulario de cierre y los calendarios).
- [ ] Número de WhatsApp que se usará para la capa de recordatorios.
- [ ] Calendarios del equipo conectados (Xflow o Gmail por persona).

**Bloquean que el dato sirva, no el armado:**

- [ ] **Precio final de la clase de prueba:** ¿$8.990 o $10.000? Define el CPA objetivo.
- [ ] **Política de descuento de la entrada:** ¿se descuenta del plan, sí o no? Es
      un argumento de cierre fuerte, hoy no está estandarizado y tiene que estar
      escrito en la landing.
- [ ] **Tasa de cierre actual sobre consultas de WhatsApp** (la maneja Natalia).
      Es el punto de comparación para saber si el embudo mejora o empeora lo que ya
      existe. Sin este número, en dos meses no vamos a poder decir si funcionó.
- [ ] Punto 8 del formulario base: facturación actual, meta a 6 meses, costo máximo
      aceptable por cliente nuevo, clientes nuevos esperados al mes por servicio y
      presupuesto de publicidad.
